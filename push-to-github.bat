@echo off
title Push GelScan to GitHub
echo ====================================================================
echo               PUSH GELSCAN TO GITHUB REPOSITORY
echo          Repository: https://github.com/chetanw993-crypto/GelScan.git
echo ====================================================================
echo.
echo Your computer currently has GitHub credentials saved for: vinzone-lead
echo.
echo Choose an option to push:
echo   [1] I invited 'vinzone-lead' as a collaborator on GitHub (Quick Push)
echo   [2] Push using a Personal Access Token (ghp_...)
echo   [3] Log in to GitHub as 'chetanw993-crypto' via browser
echo.
set /p choice="Enter option (1, 2, or 3): "

if "%choice%"=="1" (
    echo.
    echo Pushing to main branch...
    git remote set-url origin https://github.com/chetanw993-crypto/GelScan.git
    git push -u origin main
)

if "%choice%"=="2" (
    echo.
    echo Enter your GitHub Personal Access Token:
    set /p token="Token: "
    git push -u https://%token%@github.com/chetanw993-crypto/GelScan.git main
)

if "%choice%"=="3" (
    echo.
    echo Clearing old GitHub credentials so Git prompts for chetanw993-crypto...
    cmdkey /delete:git:https://github.com
    git remote set-url origin https://chetanw993-crypto@github.com/chetanw993-crypto/GelScan.git
    git push -u origin main
)

echo.
echo ====================================================================
pause
