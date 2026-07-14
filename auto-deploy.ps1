$GH = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host "========================================="
Write-Host "PROPTECH-NEXUS V2 - AUTONOMOUS GITHUB PUSH"
Write-Host "========================================="

Write-Host "[*] Checking GitHub Authentication..."
& $GH auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Authentication required. Opening your web browser now..."
    Write-Host "[!] PLEASE CLICK 'AUTHORIZE' IN THE BROWSER WINDOW THAT OPENS!"
    & $GH auth login --web
} else {
    Write-Host "[+] Already authenticated with GitHub!"
}

Write-Host "[*] Initializing local Git repository..."
git init
git add .
git commit -m "Final Production Build v2 - Autonomous"

Write-Host "[*] Creating remote repository and pushing code..."
& $GH repo create proptech-nexus-v2 --public --source=. --remote=origin --push

if ($LASTEXITCODE -eq 0) {
    Write-Host "[+] SUCCESS! Repository is now live on GitHub."
} else {
    Write-Host "[!] Repository might already exist, attempting direct push..."
    git push -u origin main
}
