#!/usr/bin/env pwsh
# Simple polling auto-commit. Run in terminal.
$repo = "D:\Projects\Book Summary"
$log  = "$repo\auto-commit.log"
Set-Location $repo
"$(Get-Date) Watcher started" | Add-Content $log

while ($true) {
    Start-Sleep 5
    $dirty = git status --porcelain
    if (-not $dirty) { continue }

    $skip = @("node_modules","\.next","\.git","auto-commit.log")
    $todo = $dirty | Where-Object { $line = $_.Substring(3); -not ($skip | Where-Object { $line -like "*$_*" }) }
    if (-not $todo) { continue }

    git add -A
    $n = ($todo | Measure-Object).Count
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Auto-commit: $n file(s) [$ts]" --no-verify
    git push origin main
    "$(Get-Date) Pushed $n file(s)" | Add-Content $log
}
