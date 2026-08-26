Set-Location "D:\Projects\Book Summary"
$log = "D:\Projects\Book Summary\auto-commit.log"
"$(Get-Date) Polling watcher started" | Add-Content $log

while ($true) {
    Start-Sleep -Seconds 5
    $dirty = git status --porcelain 2>$null
    if (-not $dirty) { continue }
    
    git add -A 2>$null
    $n = ($dirty | Measure-Object -Line).Lines
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $msg = git commit -m "Auto-commit: $n file(s) [$ts]" --no-verify 2>&1
    $pushed = git push origin main 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        "$(Get-Date) Pushed $n file(s)" | Add-Content $log
    } else {
        "$(Get-Date) Commit/push issue: $pushed" | Add-Content $log
    }
}
