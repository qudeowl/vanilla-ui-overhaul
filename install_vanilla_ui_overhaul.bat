@echo off
setlocal EnableDelayedExpansion
mode con: cols=100 lines=24
title Vanilla UI Overhaul Installer
color 0B

:MainMenu
cls
echo.
echo                       ========================================================
echo                                    Vanilla UI Overhaul - Beta
echo                                 github.com/qudeowl/vanilla-ui-overhaul
echo                       ========================================================
echo.
echo                                  [1] Install / Update Vanilla UI Overhaul
echo                                  [2] Uninstall (Reset to default)
echo                                  [3] Exit
echo.
echo                       ========================================================
echo.
set /p "CHOICE=Selection: "

if "%CHOICE%"=="1" goto PreChecks
if "%CHOICE%"=="2" goto UninstallInfo
if "%CHOICE%"=="3" exit /b
goto MainMenu

:PreChecks
:: Check if Game is Running (hl2.exe AND gmod.exe)
set "GAME_RUNNING=0"
tasklist /NH /FI "IMAGENAME eq hl2.exe" 2>nul | find /I "hl2.exe" >nul
if not errorlevel 1 set "GAME_RUNNING=1"

tasklist /NH /FI "IMAGENAME eq gmod.exe" 2>nul | find /I "gmod.exe" >nul
if not errorlevel 1 set "GAME_RUNNING=1"

if "!GAME_RUNNING!"=="1" (
    color 0C
    echo.
    echo    [CRITICAL] Garry's Mod is currently running!
    echo    Please close the game before installing.
    echo.
    echo    Press any key to retry check...
    pause >nul
    color 0B
    goto PreChecks
)

goto Locate

:Locate
cls
echo.
echo    [1/4] Locating Steam installation...

set "GITHUB_OWNER=qudeowl"
set "GITHUB_REPO=vanilla-ui-overhaul"
set "ARCHIVE_NAME=Vanilla_UI_Overhaul_Beta.zip"
set "DOWNLOAD_URL=https://github.com/%GITHUB_OWNER%/%GITHUB_REPO%/releases/latest/download/%ARCHIVE_NAME%"

set "STEAM_PATH="
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Valve\Steam" /v SteamPath 2^>nul') do set "STEAM_PATH=%%b"
if not defined STEAM_PATH for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Valve\Steam" /v InstallPath 2^>nul') do set "STEAM_PATH=%%b"
if not defined STEAM_PATH if exist "C:\Program Files (x86)\Steam" set "STEAM_PATH=C:\Program Files (x86)\Steam"

if not defined STEAM_PATH (
    echo    [ERROR] Steam not found automatically
    set /p STEAM_PATH="    Enter Steam path manually: "
    set "STEAM_PATH=!STEAM_PATH:"=!"
)

set "STEAM_PATH=!STEAM_PATH:/=\!"
set "GMOD_PATH=!STEAM_PATH!\steamapps\common\GarrysMod\garrysmod"

if not exist "!GMOD_PATH!" (
    echo.
    echo    [ERROR] Garry's Mod folder not found automatically.
    echo.
    set /p GMOD_PATH="    Paste full path to 'garrysmod' folder: "
    :: Input Sanitization (Remove quotes)
    set "GMOD_PATH=!GMOD_PATH:"=!"

    if not exist "!GMOD_PATH!" (
        color 0C
        echo    [ERROR] Invalid path specified. Returning to menu...
        timeout /t 3 >nul
        color 0B
        goto MainMenu
    )
)

echo    [OK] Target: !GMOD_PATH!
timeout /t 1 >nul

echo.
echo    [2/4] Downloading Vanilla UI Overhaul...
set "TEMP_DIR=%TEMP%\vanilla_ui_installer_%RANDOM%"
if not exist "!TEMP_DIR!" mkdir "!TEMP_DIR!"

:: Interactive Progress Bar (curl)
curl -L -o "%TEMP_DIR%\%ARCHIVE_NAME%" "%DOWNLOAD_URL%" --ssl-no-revoke --progress-bar

if not exist "%TEMP_DIR%\%ARCHIVE_NAME%" (
    echo    [ERROR] Curl failed. Trying PowerShell...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $web = New-Object Net.WebClient; $web.DownloadFile('%DOWNLOAD_URL%', '%TEMP_DIR%\%ARCHIVE_NAME%')" 2>nul
)

if not exist "%TEMP_DIR%\%ARCHIVE_NAME%" (
    color 0C
    echo    [FATAL] Download failed completely. Check internet.
    pause
    goto MainMenu
)

echo.
echo    [3/4] Installing...

:: Extract to a staging folder first, then move contents one level up
:: (ZIP has an extra root folder "Vanilla UI Overhaul Beta/" inside)
set "STAGE_DIR=%TEMP_DIR%\extracted"
powershell -Command "Expand-Archive -Path '%TEMP_DIR%\%ARCHIVE_NAME%' -DestinationPath '%STAGE_DIR%' -Force" 2>nul
if errorlevel 1 (
    color 0C
    echo    [ERROR] Extraction failed. Check folder permissions.
    pause
    goto MainMenu
)

:: Move the inner "garrysmod" folder contents directly into the target
powershell -Command ^
    "$src = Get-ChildItem '%STAGE_DIR%' -Directory | Select-Object -First 1;" ^
    "if ($src) { Copy-Item -Path (Join-Path $src.FullName 'garrysmod\*') -Destination '!GMOD_PATH!' -Recurse -Force }" ^
    2>nul

if errorlevel 1 (
    color 0C
    echo    [ERROR] File copy failed. Check folder permissions.
    pause
    goto MainMenu
)

echo.
echo    [4/4] Cleanup...
rd /s /q "!TEMP_DIR!" 2>nul

cls
color 0A
echo.
echo                             =========================================
echo                                      INSTALLATION SUCCESSFUL
echo                             =========================================
echo.
echo                              Repository: %GITHUB_OWNER%/%GITHUB_REPO%
echo              Location: !GMOD_PATH!
echo.
echo                              Launch Garry's Mod to see your new menu.
echo.
echo                                      Press any key to exit...
pause >nul
exit /b 0

:UninstallInfo
cls
echo.
echo                             =========================================
echo                                         HOW TO UNINSTALL
echo                             =========================================
echo.
echo                             To remove Vanilla UI Overhaul and restore the
echo                             default Garry's Mod UI, verify your game files.
echo.
echo                             1. Open Steam Library.
echo                             2. Right-click "Garry's Mod" -> "Properties".
echo                             3. Click "Installed Files" tab.
echo                             4. Click "Verify integrity of game files".
echo.
echo                             This ensures all modified files are reverted to
echo                             their official state safely.
echo.
echo                             =========================================
echo.
echo                               Press any key to return to main menu...
pause >nul
goto MainMenu
