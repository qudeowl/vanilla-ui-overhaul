@echo off
setlocal EnableDelayedExpansion
mode con: cols=100 lines=30
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
if "%CHOICE%"=="2" goto UninstallMenu
if "%CHOICE%"=="3" exit /b
goto MainMenu

:PreChecks
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

:: ── Steam path: try all known registry locations ──────────────────────
set "STEAM_PATH="

:: HKCU (most reliable — user-specific, forward-slash path)
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Valve\Steam" /v SteamPath 2^>nul') do set "STEAM_PATH=%%b"

:: HKLM 32-bit node (fallback)
if not defined STEAM_PATH (
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Valve\Steam" /v InstallPath 2^>nul') do set "STEAM_PATH=%%b"
)

:: HKLM WOW6432Node (64-bit Windows)
if not defined STEAM_PATH (
    for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\WOW6432Node\Valve\Steam" /v InstallPath 2^>nul') do set "STEAM_PATH=%%b"
)

:: Common fallback paths
if not defined STEAM_PATH if exist "C:\Program Files (x86)\Steam\steam.exe" set "STEAM_PATH=C:\Program Files (x86)\Steam"
if not defined STEAM_PATH if exist "C:\Program Files\Steam\steam.exe"       set "STEAM_PATH=C:\Program Files\Steam"

if not defined STEAM_PATH (
    echo    [ERROR] Steam not found automatically.
    set /p STEAM_PATH="    Enter Steam path manually: "
    set "STEAM_PATH=!STEAM_PATH:"=!"
)

:: Normalize forward slashes to backslashes
set "STEAM_PATH=!STEAM_PATH:/=\!"
echo    [OK] Steam: !STEAM_PATH!

:: ── Find GMod across ALL Steam libraries ─────────────────────────────
set "GMOD_PATH="

:: Check main library
if exist "!STEAM_PATH!\steamapps\common\GarrysMod\garrysmod" (
    set "GMOD_PATH=!STEAM_PATH!\steamapps\common\GarrysMod\garrysmod"
)

:: Parse libraryfolders.vdf for additional libraries
if not defined GMOD_PATH (
    set "VDF=!STEAM_PATH!\steamapps\libraryfolders.vdf"
    if exist "!VDF!" (
        for /f "usebackq tokens=2 delims=	 " %%L in ("!VDF!") do (
            set "LIB=%%~L"
            set "LIB=!LIB:"=!"
            set "LIB=!LIB:/=\!"
            if exist "!LIB!\steamapps\common\GarrysMod\garrysmod" (
                set "GMOD_PATH=!LIB!\steamapps\common\GarrysMod\garrysmod"
            )
        )
    )
)

if not defined GMOD_PATH (
    echo.
    echo    [ERROR] Garry's Mod folder not found automatically.
    echo.
    set /p GMOD_PATH="    Paste full path to 'garrysmod' folder: "
    set "GMOD_PATH=!GMOD_PATH:"=!"
    set "GMOD_PATH=!GMOD_PATH:/=\!"
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

:: ── Download ──────────────────────────────────────────────────────────
echo.
echo    [2/4] Downloading Vanilla UI Overhaul...
set "TEMP_DIR=%TEMP%\vanilla_ui_installer_%RANDOM%"
mkdir "!TEMP_DIR!" 2>nul

curl -L -o "!TEMP_DIR!\%ARCHIVE_NAME%" "%DOWNLOAD_URL%" --ssl-no-revoke --progress-bar 2>nul

if not exist "!TEMP_DIR!\%ARCHIVE_NAME%" (
    echo    [INFO] curl failed, trying PowerShell...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%DOWNLOAD_URL%', '!TEMP_DIR!\%ARCHIVE_NAME%')" 2>nul
)

if not exist "!TEMP_DIR!\%ARCHIVE_NAME%" (
    color 0C
    echo    [FATAL] Download failed. Check your internet connection.
    pause
    goto MainMenu
)

:: ── Extract + Copy ────────────────────────────────────────────────────
echo.
echo    [3/4] Installing...
set "STAGE_DIR=!TEMP_DIR!\extracted"

powershell -Command "Expand-Archive -Path '!TEMP_DIR!\%ARCHIVE_NAME%' -DestinationPath '!STAGE_DIR!' -Force" 2>nul
if errorlevel 1 (
    color 0C
    echo    [ERROR] Extraction failed. Check folder permissions.
    pause
    goto MainMenu
)

powershell -NoProfile -Command ^
    "$src = Get-ChildItem '!STAGE_DIR!' -Directory | Select-Object -First 1;" ^
    "if ($src) {" ^
    "  $inner = Join-Path $src.FullName 'garrysmod';" ^
    "  if (Test-Path $inner) { Copy-Item -Path (Join-Path $inner '*') -Destination '!GMOD_PATH!' -Recurse -Force }" ^
    "  else { Copy-Item -Path (Join-Path $src.FullName '*') -Destination '!GMOD_PATH!' -Recurse -Force }" ^
    "}" 2>nul

if errorlevel 1 (
    color 0C
    echo    [ERROR] File copy failed. Try running as Administrator.
    pause
    goto MainMenu
)

:: ── Cleanup ───────────────────────────────────────────────────────────
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

:: ═════════════════════════════════════════════════════════════════════
:UninstallMenu
cls
echo.
echo                       ========================================================
echo                                    Vanilla UI Overhaul - Uninstall
echo                       ========================================================
echo.
echo                         This will delete all mod files and then guide you
echo                         to verify game files in Steam to restore originals.
echo.
echo                                  [1] Continue with uninstall
echo                                  [2] Back to main menu
echo.
echo                       ========================================================
echo.
set /p "UCHOICE=Selection: "
if "%UCHOICE%"=="1" goto DoUninstall
if "%UCHOICE%"=="2" goto MainMenu
goto UninstallMenu

:DoUninstall
cls
echo.
echo    Locating Garry's Mod...

set "STEAM_PATH="
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Valve\Steam" /v SteamPath 2^>nul') do set "STEAM_PATH=%%b"
if not defined STEAM_PATH for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Valve\Steam" /v InstallPath 2^>nul') do set "STEAM_PATH=%%b"
if not defined STEAM_PATH for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\WOW6432Node\Valve\Steam" /v InstallPath 2^>nul') do set "STEAM_PATH=%%b"
if not defined STEAM_PATH if exist "C:\Program Files (x86)\Steam\steam.exe" set "STEAM_PATH=C:\Program Files (x86)\Steam"

set "GMOD_PATH="
if defined STEAM_PATH (
    set "STEAM_PATH=!STEAM_PATH:/=\!"
    if exist "!STEAM_PATH!\steamapps\common\GarrysMod\garrysmod" (
        set "GMOD_PATH=!STEAM_PATH!\steamapps\common\GarrysMod\garrysmod"
    )
    if not defined GMOD_PATH (
        set "VDF=!STEAM_PATH!\steamapps\libraryfolders.vdf"
        if exist "!VDF!" (
            for /f "usebackq tokens=2 delims=	 " %%L in ("!VDF!") do (
                set "LIB=%%~L"
                set "LIB=!LIB:"=!"
                set "LIB=!LIB:/=\!"
                if exist "!LIB!\steamapps\common\GarrysMod\garrysmod" (
                    set "GMOD_PATH=!LIB!\steamapps\common\GarrysMod\garrysmod"
                )
            )
        )
    )
)

if not defined GMOD_PATH (
    set /p GMOD_PATH="    Paste full path to 'garrysmod' folder: "
    set "GMOD_PATH=!GMOD_PATH:"=!"
    set "GMOD_PATH=!GMOD_PATH:/=\!"
)

if not exist "!GMOD_PATH!" (
    color 0C
    echo    [ERROR] garrysmod folder not found. Returning to menu...
    timeout /t 3 >nul
    color 0B
    goto MainMenu
)

echo    [OK] Removing files from: !GMOD_PATH!
echo.

:: Delete all mod files
for %%F in (
    "html\main.html"
    "html\menu.html"
    "html\loading.html"
    "html\loading.css"
    "html\awesomium_global.css"
    "html\saves.html"
    "html\dupes.html"
    "html\css\menu\Custom.css"
    "html\img\gradient.png"
    "resource\SourceScheme.res"
    "resource\LoadingDialogNoBanner.res"
    "lua\menu\loading.lua"
    "lua\menu\mount\vgui\workshop.lua"
    "lua\menu\problems\problems_pnl.lua"
    "lua\autorun\client\spawnmenu_theme.lua"
) do (
    if exist "!GMOD_PATH!\%%~F" (
        del /f /q "!GMOD_PATH!\%%~F"
        echo    Removed: %%~F
    )
)

cls
color 0A
echo.
echo                             =========================================
echo                                        FILES REMOVED
echo                             =========================================
echo.
echo                             To restore original Garry's Mod files:
echo.
echo                             1. Open Steam Library
echo                             2. Right-click "Garry's Mod" - Properties
echo                             3. Click "Installed Files" tab
echo                             4. Click "Verify integrity of game files"
echo.
echo                             =========================================
echo.
echo                                   Press any key to exit...
pause >nul
exit /b 0
