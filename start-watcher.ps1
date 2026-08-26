Set-Location "D:\Projects\Book Summary"
$log = "D:\Projects\Book Summary\auto-commit.log"
$signal = "D:\Projects\Book Summary\.commit-signal"

# Clean stale signal
Remove-Item $signal -Force -ErrorAction SilentlyContinue

"$(Get-Date) Signal-based watcher started. Waiting for .commit-signal ..." | Add-Content $log

while ($true) {
    if (Test-Path $signal) {
        $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

        # Read and remove signal
        $task = Get-Content $signal -Raw
        Remove-Item $signal -Force -ErrorAction SilentlyContinue

        # Check for changes
        $dirty = git status --porcelain 2>$null
        if (-not $dirty) { continue }

        git add -A 2>$null
        $n = ($dirty | Measure-Object -Line).Lines
        $commitMsg = if ($task) { $task.Trim() } else { "Auto-commit: $n file(s) [$ts]" }
        $msg = git commit -m "$commitMsg" --no-verify 2>&1
        $pushed = git push origin main 2>&1

        if ($LASTEXITCODE -eq 0) {
            "$(Get-Date) Pushed $n file(s) -- $commitMsg" | Add-Content $log
        } else {
            "$(Get-Date) Commit/push issue: $pushed" | Add-Content $log
        }
    } else {
        Start-Sleep -Seconds 1
    }
}
