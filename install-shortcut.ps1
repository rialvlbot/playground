# Kitten Timer - Desktop Shortcut Installer
# Run with: right-click -> "Run with PowerShell"

$htmlFile = Join-Path $PSScriptRoot "timer-widget.html"

if (-not (Test-Path $htmlFile)) {
    Write-Host "ERROR: timer-widget.html not found next to this script." -ForegroundColor Red
    pause
    exit 1
}

# Find Chrome or Edge
$browserPaths = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles (x86)\Google\Chrome\Application\chrome.exe",
    "$env:LocalAppData\Google\Chrome\Application\chrome.exe",
    "$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe",
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe"
)

$browser = $browserPaths | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $browser) {
    Write-Host "ERROR: Could not find Chrome or Edge. Please install one and try again." -ForegroundColor Red
    pause
    exit 1
}

$browserName = if ($browser -match "chrome") { "Chrome" } else { "Edge" }
Write-Host "Found browser: $browserName" -ForegroundColor Green

# Build the shortcut
$desktopPath  = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktopPath "Kitten Timer.lnk"
$fileUrl      = "file:///" + $htmlFile.Replace("\", "/")
$appArgs      = "--app=`"$fileUrl`" --window-size=360,600"

$shell    = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath       = $browser
$shortcut.Arguments        = $appArgs
$shortcut.Description      = "Kitten Timer Widget"
$shortcut.WorkingDirectory = $PSScriptRoot
$shortcut.Save()

Write-Host "Shortcut created on your Desktop: 'Kitten Timer'" -ForegroundColor Green
Write-Host "Double-click it to launch the widget!" -ForegroundColor Cyan
pause
