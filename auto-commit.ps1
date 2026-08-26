# Auto-commit & push on file changes using FileSystemWatcher.
# Run once:  powershell -File auto-commit.ps1
# It stays in the foreground; press Ctrl+C to stop.

$repo     = "D:\Projects\Book Summary"
$log      = Join-Path $repo "auto-commit.log"
$debounce = 2000          # ms to wait after last change before committing

function Log($msg) {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg" | Add-Content -Path $log
}

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path              = $repo
$watcher.IncludeSubdirectories = $true
$watcher.Filter            = "*.*"
$watcher.NotifyFilter      = [System.IO.NotifyFilters]::FileName, [System.IO.NotifyFilters]::LastWrite, [System.IO.NotifyFilters]::DirectoryName
$watcher.EnableRaisingEvents = $true

# Ignore paths that should not trigger commits
$ignorePatterns = @("node_modules", ".next", ".git", "auto-commit.log")

$timer = $null

function DoCommit {
    Set-Location -LiteralPath $repo
    $status = git status --porcelain
    if (-not $status) { return }

    # Filter out ignored paths
    $relevant = $status | Where-Object {
        $line = $_.Substring(3)
        $skip = $false
        foreach ($pat in $ignorePatterns) {
            if ($line -like "*$pat*") { $skip = $true; break }
        }
        -not $skip
    }
    if (-not $relevant) { return }

    git add -A 2>$null
    $summary = ($relevant | Measure-Object -Line).Lines
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    git commit -m "Auto-commit: $summary file(s) changed [$ts]" --no-verify 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        git push origin main 2>$null
        if ($LASTEXITCODE -eq 0) { Log "Committed & pushed $summary file(s)." }
        else { Log "Committed but PUSH FAILED." }
    }
}

$resetTimer = {
    if ($timer) { $timer.Stop(); $timer.Dispose() }
    $script:timer = [System.Timers.Timer]::new($debounce)
    $script:timer.AutoReset = $false
    $script:timer.Add_StopAction({ DoCommit })
    $script:timer.Start()
}

$null = Register-ObjectEvent $watcher "Changed" -Action $resetTimer
$null = Register-ObjectEvent $watcher "Created" -Action $resetTimer
$null = Register-ObjectEvent $watcher "Deleted" -Action $resetTimer
$null = Register-ObjectEvent $watcher "Renamed" -Action $resetTimer

Log "File watcher started on $repo"
Write-Host "Watching for changes in $repo — press Ctrl+C to stop."

try {
    while ($true) { Start-Sleep -Milliseconds 500 }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Unregister-Event -SourceIdentifier *
    Log "File watcher stopped."
}