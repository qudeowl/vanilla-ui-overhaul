@echo off
setlocal EnableDelayedExpansion
title Vanilla UI Overhaul

:menu
cls
echo.
echo  VUO Beta v1.3
echo  github.com/qudeowl/vanilla-ui-overhaul
echo.
echo   1. Install / Update
echo   2. Uninstall (Reset To Default)
echo   3. Exit
echo.
set /p "choice=Select an option: "
if "%choice%"=="1" goto variant
if "%choice%"=="2" goto uninstall
if "%choice%"=="3" exit /b
goto menu

:variant
set "archive=Vanilla_UI_Overhaul_v1.3_Beta.zip"
set "mode="
cls
echo.
echo  Choose your installation method:
echo.
echo   1. Standard
echo      Installs directly into the Garry's Mod folder. All features are
echo      fully supported, but some game files are replaced. If a future
echo      Garry's Mod update causes compatibility issues, simply reinstall
echo      the mod.
echo.
echo   2. Addons Folder
echo      Installs into garrysmod\addons instead. This avoids modifying game
echo      files and reduces issues caused by official updates. However, some
echo      interface elements may be unavailable or may not work as expected,
echo      as they may be ignored by the game.
echo.
echo   3. Back
echo.
set /p "m=Select an option: "
if "%m%"=="1" set "mode=standard"
if "%m%"=="2" set "mode=addon"
if "%m%"=="3" goto menu
if defined mode goto checkgame
goto variant

:checkgame
set "running="
tasklist /fi "imagename eq gmod.exe" 2>nul | find /i "gmod.exe" >nul && set "running=1"
tasklist /fi "imagename eq hl2.exe" 2>nul | find /i "hl2.exe" >nul && set "running=1"
if defined running (
    echo.
    echo  Garry's Mod is running. Please close it, then press any key.
    pause >nul
    goto checkgame
)

:locate
cls
echo  Looking for Steam...
set "steam="
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Valve\Steam" /v SteamPath 2^>nul') do set "steam=%%b"
if not defined steam for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Valve\Steam" /v InstallPath 2^>nul') do set "steam=%%b"
if not defined steam for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\WOW6432Node\Valve\Steam" /v InstallPath 2^>nul') do set "steam=%%b"
if not defined steam if exist "C:\Program Files (x86)\Steam\steam.exe" set "steam=C:\Program Files (x86)\Steam"
if not defined steam if exist "C:\Program Files\Steam\steam.exe" set "steam=C:\Program Files\Steam"
if not defined steam set /p "steam=Couldn't find Steam. Paste your Steam folder path: "
set "steam=!steam:"=!"
set "steam=!steam:/=\!"

set "gmod="
if exist "!steam!\steamapps\common\GarrysMod\garrysmod" set "gmod=!steam!\steamapps\common\GarrysMod\garrysmod"
if not defined gmod if exist "!steam!\steamapps\libraryfolders.vdf" (
    for /f "usebackq tokens=2 delims=	 " %%L in ("!steam!\steamapps\libraryfolders.vdf") do (
        set "lib=%%~L"
        set "lib=!lib:/=\!"
        if exist "!lib!\steamapps\common\GarrysMod\garrysmod" set "gmod=!lib!\steamapps\common\GarrysMod\garrysmod"
    )
)
if not defined gmod (
    echo  Couldn't find the garrysmod folder automatically.
    set /p "gmod=Paste the full path to your 'garrysmod' folder: "
    set "gmod=!gmod:"=!"
    set "gmod=!gmod:/=\!"
)
if not exist "!gmod!" (
    echo  That path doesn't exist. Going back to the menu.
    timeout /t 3 >nul
    goto menu
)
echo  Found Garry's Mod at: !gmod!

echo  Downloading...
set "tmp=%TEMP%\vuo_%RANDOM%"
mkdir "!tmp!" 2>nul
set "url=https://github.com/qudeowl/vanilla-ui-overhaul/releases/download/vuo_v1.3_beta/!archive!"
curl -L --ssl-no-revoke -o "!tmp!\!archive!" "!url!"
if not exist "!tmp!\!archive!" powershell -Command "[Net.ServicePointManager]::SecurityProtocol='Tls12';(New-Object Net.WebClient).DownloadFile('!url!','!tmp!\!archive!')"
if not exist "!tmp!\!archive!" (
    echo  Download failed. Check your internet connection and try again.
    pause
    goto menu
)

echo  Installing...
powershell -Command "Expand-Archive -Path '!tmp!\!archive!' -DestinationPath '!tmp!\out' -Force"
powershell -NoProfile -Command "$d=Get-ChildItem '!tmp!\out' -Directory | Select-Object -First 1; if($d){$g=Join-Path $d.FullName 'garrysmod'; $src=if(Test-Path $g){$g}else{$d.FullName}; if('!mode!' -eq 'addon'){$dest=Join-Path '!gmod!' 'addons\garrysmod'; New-Item -ItemType Directory -Force -Path $dest | Out-Null; Copy-Item (Join-Path $src '*') $dest -Recurse -Force}else{Copy-Item (Join-Path $src '*') '!gmod!' -Recurse -Force}}"
rd /s /q "!tmp!" 2>nul

cls
echo.
if "!mode!"=="addon" (
    echo  Done. Installed as an addon to:
    echo  !gmod!\addons\garrysmod
) else (
    echo  Done. Installed to:
    echo  !gmod!
)
echo.
echo  Launch Garry's Mod to see your new menu.
echo.
echo  Press any key to exit.
pause >nul
exit /b 0


:uninstall
cls
echo.
echo  This removes the mod files. Afterwards, verify the game files
echo  in Steam to bring the original ones back.
echo.
echo   1. Continue
echo   2. Back
echo.
set /p "u=Select an option: "
if "%u%"=="2" goto menu
if not "%u%"=="1" goto uninstall

cls
echo  Looking for Garry's Mod...
set "steam="
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Valve\Steam" /v SteamPath 2^>nul') do set "steam=%%b"
if not defined steam for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Valve\Steam" /v InstallPath 2^>nul') do set "steam=%%b"
if not defined steam for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\WOW6432Node\Valve\Steam" /v InstallPath 2^>nul') do set "steam=%%b"
if not defined steam if exist "C:\Program Files (x86)\Steam\steam.exe" set "steam=C:\Program Files (x86)\Steam"

set "gmod="
if defined steam (
    set "steam=!steam:/=\!"
    if exist "!steam!\steamapps\common\GarrysMod\garrysmod" set "gmod=!steam!\steamapps\common\GarrysMod\garrysmod"
    if not defined gmod if exist "!steam!\steamapps\libraryfolders.vdf" (
        for /f "usebackq tokens=2 delims=	 " %%L in ("!steam!\steamapps\libraryfolders.vdf") do (
            set "lib=%%~L"
            set "lib=!lib:/=\!"
            if exist "!lib!\steamapps\common\GarrysMod\garrysmod" set "gmod=!lib!\steamapps\common\GarrysMod\garrysmod"
        )
    )
)
if not defined gmod (
    set /p "gmod=Paste the full path to your 'garrysmod' folder: "
    set "gmod=!gmod:"=!"
    set "gmod=!gmod:/=\!"
)
if not exist "!gmod!" (
    echo  Couldn't find the garrysmod folder. Going back to the menu.
    timeout /t 3 >nul
    goto menu
)

echo  Removing files from !gmod!
echo.
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
    "html\fonts\tgnormal.ttf"
    "resource\SourceScheme.res"
    "resource\LoadingDialogNoBanner.res"
    "resource\fonts\tgnormal.ttf"
    "lua\menu\loading.lua"
    "lua\menu\mount\vgui\workshop.lua"
    "lua\menu\problems\problems_pnl.lua"
    "lua\menu\errors.lua"
    "lua\autorun\client\spawnmenu_theme.lua"
    "html\template\servers.html"
    "html\fonts\Roboto-Regular.ttf"
    "html\fonts\Roboto-Medium.ttf"
    "html\fonts\Roboto-SemiBold.ttf"
    "resource\LoadingDialogGMod.res"
    "resource\LoadingDialogNoBannerSingle.res"
    "resource\LoadingDialogVAC.res"
    "resource\loadingdialogerror.res"
    "resource\fonts\Roboto-Regular.ttf"
    "resource\fonts\Roboto-Medium.ttf"
    "resource\fonts\Roboto-SemiBold.ttf"
) do if exist "!gmod!\%%~F" (del /f /q "!gmod!\%%~F" & echo   Removed %%~F)

for %%D in (
    "addons\garrysmod"
    "materials\vuo_backgrounds"
    "materials\vuo_fonts"
    "sound\vuo_music"
    "sound\vuo_sounds"
) do if exist "!gmod!\%%~D" (rd /s /q "!gmod!\%%~D" & echo   Removed %%~D)

cls
echo.
echo  Mod files removed.
echo.
echo  To restore the original Garry's Mod files:
echo   1. Open your Steam library, right-click Garry's Mod, then Properties
echo   2. Go to the Installed Files tab
echo   3. Click Verify integrity of game files
echo.
echo  Press any key to exit.
pause >nul
exit /b 0
