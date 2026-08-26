# signal-commit.ps1
# Usage: .\signal-commit.ps1 "Commit message here"
# Signals the watcher to commit and push.

param(
    [string]$Message = ""
)

$signal = "D:\Projects\Book Summary\.commit-signal"
$Message | Out-File -FilePath $signal -Encoding utf8 -NoNewline
Write-Host "Commit signal sent: $Message"
