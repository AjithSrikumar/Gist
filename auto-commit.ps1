# Auto-commit & push any changes in this repo (excluding ignored paths).
# Runs via Windows Task Scheduler every 15 minutes.

$repo = "D:\Projects\Book Summary"
$log  = Join-Path $repo "auto-commit.log"

function Log($msg) {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')  $msg" | Add-Content -Path $log
}

try {
    Set-Location -LiteralPath $repo

    # Only proceed if there is something to commit
    $status = git status --porcelain
    if (-not $status) { exit 0 }

    git add -A 2>$null
    $stillDirty = git status --porcelain
    if (-not $stillDirty) { exit 0 }

    $summary = ($stillDirty | Measure-Object -Line).Lines
    git commit -m "Auto-commit: $summary file(s) changed [$(Get-Date -Format 'yyyy-MM-dd HH:mm')]" --no-verify 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        git push origin main 2>$null
        if ($LASTEXITCODE -eq 0) { Log "Committed & pushed $summary file(s)." }
        else { Log "Committed but PUSH FAILED (exit $LASTEXITCODE)." }
    } else {
        Log "Nothing to commit after staging."
    }
} catch {
    Log "ERROR: $($_.Exception.Message)"
}
