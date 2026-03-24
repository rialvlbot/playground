# Kitten Timer - Desktop Shortcut Installer
# If blocked, open PowerShell as Admin and run:
#   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
# Then re-run this script.

# ── Locate the HTML file ──────────────────────────────────────────────────────
$htmlFile = Join-Path $PSScriptRoot "timer-widget.html"

Write-Host ""
Write-Host "=== Kitten Timer Installer ===" -ForegroundColor Cyan
Write-Host "Looking for timer-widget.html at: $htmlFile"

if (-not (Test-Path $htmlFile)) {
    Write-Host "ERROR: timer-widget.html not found. Make sure both files are in the same folder." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "Found timer-widget.html" -ForegroundColor Green

# ── Find Chrome or Edge ───────────────────────────────────────────────────────
$browserPaths = @(
    "$env:LocalAppData\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles (x86)\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe",
    "$env:LocalAppData\Microsoft\Edge\Application\msedge.exe"
)

$browser = $browserPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $browser) {
    Write-Host "ERROR: Could not find Chrome or Edge at any expected path." -ForegroundColor Red
    Write-Host "Checked paths:" -ForegroundColor Yellow
    $browserPaths | ForEach-Object { Write-Host "  $_" }
    Read-Host "Press Enter to exit"
    exit 1
}

$browserName = if ($browser -match "chrome") { "Chrome" } else { "Edge" }
Write-Host "Found browser: $browserName at $browser" -ForegroundColor Green

# ── Resolve desktop path (handles OneDrive-synced desktops) ──────────────────
$desktopPath = [Environment]::GetFolderPath("Desktop")

# Fallback: OneDrive desktop
if (-not (Test-Path $desktopPath)) {
    $desktopPath = "$env:OneDrive\Desktop"
}
if (-not (Test-Path $desktopPath)) {
    $desktopPath = "$env:UserProfile\Desktop"
}
if (-not (Test-Path $desktopPath)) {
    Write-Host "ERROR: Could not locate your Desktop folder. Tried:" -ForegroundColor Red
    Write-Host "  $([Environment]::GetFolderPath('Desktop'))"
    Write-Host "  $env:OneDrive\Desktop"
    Write-Host "  $env:UserProfile\Desktop"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Desktop folder: $desktopPath" -ForegroundColor Green

# ── Create shortcut ───────────────────────────────────────────────────────────
$shortcutPath = Join-Path $desktopPath "Kitten Timer.lnk"
$fileUrl      = "file:///" + $htmlFile.Replace("\", "/")
$appArgs      = "--app=`"$fileUrl`" --window-size=360,600"

try {
    $shell    = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath       = $browser
    $shortcut.Arguments        = $appArgs
    $shortcut.Description      = "Kitten Timer Widget"
    $shortcut.WorkingDirectory = $PSScriptRoot
    $shortcut.Save()
} catch {
    Write-Host "ERROR creating shortcut: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

if (Test-Path $shortcutPath) {
    Write-Host ""
    Write-Host "SUCCESS! Shortcut created at:" -ForegroundColor Green
    Write-Host "  $shortcutPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Double-click 'Kitten Timer' on your Desktop to launch the widget." -ForegroundColor Cyan
} else {
    Write-Host "ERROR: Shortcut file was not created. Unknown reason." -ForegroundColor Red
}

Read-Host "Press Enter to exit"
