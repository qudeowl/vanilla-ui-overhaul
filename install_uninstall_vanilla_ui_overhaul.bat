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
set "archive="
cls
echo.
echo  Choose your main menu layout:
echo.
echo   1. Centered
echo   2. Vanilla
echo   3. Back
echo.
set /p "v=Select an option: "
if "%v%"=="1" set "archive=Vanilla_UI_Overhaul_v1.3_Beta_Centered.zip"
if "%v%"=="2" set "archive=Vanilla_UI_Overhaul_v1.3_Beta_VanillaLayout.zip"
if "%v%"=="3" goto menu
if defined archive goto checkgame
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
set "url=https://github.com/qudeowl/vanilla-ui-overhaul/releases/latest/download/!archive!"
curl -L --ssl-no-revoke -o "!tmp!\!archive!" "!url!"
if not exist "!tmp!\!archive!" powershell -Command "[Net.ServicePointManager]::SecurityProtocol='Tls12';(New-Object Net.WebClient).DownloadFile('!url!','!tmp!\!archive!')"
if not exist "!tmp!\!archive!" (
    echo  Download failed. Check your internet connection and try again.
    pause
    goto menu
)

echo  Installing...
powershell -Command "Expand-Archive -Path '!tmp!\!archive!' -DestinationPath '!tmp!\out' -Force"
powershell -NoProfile -Command "$d=Get-ChildItem '!tmp!\out' -Directory | Select-Object -First 1; if($d){$g=Join-Path $d.FullName 'garrysmod'; if(Test-Path $g){Copy-Item (Join-Path $g '*') '!gmod!' -Recurse -Force}else{Copy-Item (Join-Path $d.FullName '*') '!gmod!' -Recurse -Force}}"
rd /s /q "!tmp!" 2>nul

cls
echo.
echo  Done. Installed to:
echo  !gmod!
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
    "resource\fonts\Roboto-Regular.ttf"
    "resource\fonts\Roboto-Medium.ttf"
    "resource\fonts\Roboto-SemiBold.ttf"
) do if exist "!gmod!\%%~F" (del /f /q "!gmod!\%%~F" & echo   Removed %%~F)

for %%D in (
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
