@echo off
setlocal

echo ========================================================
echo PROPTECH-NEXUS V2 - AUTONOMOUS DEPLOYMENT AGENT
echo ========================================================
echo.

echo [*] Checking GitHub CLI installation...
where gh >nul 2>nul
if "%ERRORLEVEL%" NEQ "0" (
    echo [!] GitHub CLI is missing. Executing autonomous background installation...
    winget install --id GitHub.cli --silent --accept-source-agreements --accept-package-agreements
    echo [+] GitHub CLI installed successfully. 
    echo [!] CRITICAL: You must close this terminal and run deploy-nexus.bat again to refresh the PATH.
    pause
    exit /b
)

echo [*] Checking GitHub Authentication...
gh auth status >nul 2>nul
if "%ERRORLEVEL%" NEQ "0" (
    echo [!] Not authenticated. Launching GitHub web authentication...
    gh auth login --web
) else (
    echo [+] Successfully authenticated with GitHub.
)

echo.
echo [*] Provisioning GitHub Repository...
gh repo create proptech-nexus-v2 --public --source=. --remote=origin --push
if "%ERRORLEVEL%" NEQ "0" (
    echo [i] Repository might already exist. Attempting manual push...
    git push -u origin main
) else (
    echo [+] Repository created and code pushed successfully.
)

echo.
echo ========================================================
echo SUPABASE DATABASE SYNCHRONIZATION
echo ========================================================
echo Please paste your Supabase IPv4 Transaction Connection String.
echo Example: postgresql://postgres.[REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
echo.
set /p SUPABASE_URL="Database URL: "

if "%SUPABASE_URL%"=="" (
    echo [ERROR] No Database URL provided. Migration aborted.
    pause
    exit /b
)

echo.
echo [*] Generating .env.local file in frontend...
cd frontend
echo DATABASE_URL="%SUPABASE_URL%" > .env.local

echo [*] Executing Drizzle ORM Push Migration...
call npx drizzle-kit push --config=drizzle.config.ts
if "%ERRORLEVEL%" NEQ "0" (
    echo [ERROR] Database migration failed. Ensure your connection string is correct.
    pause
    exit /b
)

echo [+] Database migration successful!
echo.
echo ========================================================
echo DEPLOYMENT READY
echo ========================================================
echo Your repository is live on GitHub and your Supabase schema is synchronized!
echo You may now connect Vercel and Railway directly to your new GitHub repository.
echo.
pause
