# Auto-commit & push on file changes.
# Run:  powershell -File auto-commit.ps1
# Press Ctrl+C to stop.

$repo     = "D:\Projects\Book Summary"
$log      = Join-Path $repo "auto-commit.log"
$interval = 5          # seconds between checks

function Log($msg) {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg" | Add-Content -Path $log
}

function DoCommit {
    Set-Location -LiteralPath $repo
    $status = git status --porcelain
    if (-not $status) { return }

    $ignore = @("node_modules", ".next", ".git", "auto-commit.log")
    $relevant = $status | Where-Object {
        $line = $_.Substring(3)
        $skip = $false
        foreach ($pat in $ignore) {
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

Log "Polling watcher started (every ${interval}s)"
Write-Host "Watching $repo — press Ctrl+C to stop."

while ($true) {
    Start-Sleep -Seconds $interval
    DoCommit
}