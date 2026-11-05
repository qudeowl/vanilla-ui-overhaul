@echo off
setlocal EnableDelayedExpansion
title Vanilla UI Overhaul

:menu
cls
echo.
echo  Vanilla UI+ v1.5.1
echo  github.com/qudeowl/vanilla-ui-overhaul
echo.
echo   1. Install
echo   2. Update
echo   3. Uninstall (Reset To Default)
echo   4. Exit
echo.
set /p "choice=Select an option: "
if "%choice%"=="1" set "action=install" & goto variant
if "%choice%"=="2" goto updateinfo
if "%choice%"=="3" goto uninstall
if "%choice%"=="4" exit /b
goto menu

:updateinfo
cls
echo.
echo  Update removes the files of every previous version, then installs
echo  v1.5.1. Your settings, music, sounds, backgrounds and fonts are kept.
echo.
echo   1. Continue
echo   2. Back
echo.
set /p "u=Select an option: "
if "%u%"=="2" goto menu
if not "%u%"=="1" goto updateinfo
set "action=update"
goto variant

:variant
set "archive=Vanilla_UI_Overhaul_v1.5.1.zip"
set "mode="
set "cssfail="
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

cls
echo  Looking for Garry's Mod...
call :findgmod
if not exist "!gmod!" (
    echo  That path doesn't exist. Going back to the menu.
    timeout /t 3 >nul
    goto menu
)
echo  Found Garry's Mod at: !gmod!

echo  Downloading...
set "tmp=%TEMP%\vuo_%RANDOM%"
mkdir "!tmp!" 2>nul
set "url=https://github.com/qudeowl/vanilla-ui-overhaul/releases/download/vuo_v1.5.1/!archive!"
curl -fL --ssl-no-revoke -o "!tmp!\!archive!" "!url!"
if not exist "!tmp!\!archive!" powershell -Command "[Net.ServicePointManager]::SecurityProtocol='Tls12';(New-Object Net.WebClient).DownloadFile('!url!','!tmp!\!archive!')"
if not exist "!tmp!\!archive!" (
    echo  Download failed. Check your internet connection and try again.
    rd /s /q "!tmp!" 2>nul
    pause
    goto menu
)

powershell -Command "Expand-Archive -Path '!tmp!\!archive!' -DestinationPath '!tmp!\out' -Force"
dir /s /b "!tmp!\out\VanillaUI.js" >nul 2>&1 || (
    echo  The download couldn't be extracted. Please try again.
    rd /s /q "!tmp!" 2>nul
    pause
    goto menu
)

if "%action%"=="update" (
    echo.
    echo  Removing previous version...
    call :removefiles keepdata
    for %%F in ("Hazardous Environments" "Love's Official Theme" "Self Esteem Fund" "Taste of Blood" "Very Important Bunny") do (
        del /f /q "!gmod!\sound\vuo_music\%%~F.flac" 2>nul
        del /f /q "!gmod!\addons\garrysmod\sound\vuo_music\%%~F.flac" 2>nul
    )
)

echo  Installing...
powershell -NoProfile -Command "$d=Get-ChildItem '!tmp!\out' -Directory | Select-Object -First 1; if($d){$g=Join-Path $d.FullName 'garrysmod'; $src=if(Test-Path $g){$g}else{$d.FullName}; if('!mode!' -eq 'addon'){$dest=Join-Path '!gmod!' 'addons\garrysmod'; New-Item -ItemType Directory -Force -Path $dest | Out-Null; Get-ChildItem $src | Where-Object {'addons','workshop' -notcontains $_.Name} | Copy-Item -Destination $dest -Recurse -Force; foreach($x in 'addons','workshop'){$p=Join-Path $src $x; if(Test-Path $p){$t=Join-Path '!gmod!' $x; New-Item -ItemType Directory -Force -Path $t | Out-Null; Copy-Item (Join-Path $p '*') $t -Recurse -Force}}}else{Copy-Item (Join-Path $src '*') '!gmod!' -Recurse -Force}}"
call :restorecss
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
if defined cssfail (
    echo  One game file couldn't be restored: html\awesomium_global.css
    echo  To fix it, verify the game files in Steam, then run Install again.
    echo.
)
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
call :findgmod
if not exist "!gmod!" (
    echo  Couldn't find the garrysmod folder. Going back to the menu.
    timeout /t 3 >nul
    goto menu
)

echo  Removing files from !gmod!
echo.
call :removefiles

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


:findgmod
set "steam="
for /f "tokens=2*" %%a in ('reg query "HKCU\Software\Valve\Steam" /v SteamPath 2^>nul') do set "steam=%%b"
if not defined steam for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\Valve\Steam" /v InstallPath 2^>nul') do set "steam=%%b"
if not defined steam for /f "tokens=2*" %%a in ('reg query "HKLM\SOFTWARE\WOW6432Node\Valve\Steam" /v InstallPath 2^>nul') do set "steam=%%b"
if not defined steam if exist "C:\Program Files (x86)\Steam\steam.exe" set "steam=C:\Program Files (x86)\Steam"
if not defined steam if exist "C:\Program Files\Steam\steam.exe" set "steam=C:\Program Files\Steam"

set "gmod="
if defined steam (
    set "steam=!steam:"=!"
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
    echo  Couldn't find the garrysmod folder automatically.
    set /p "gmod=Paste the full path to your 'garrysmod' folder: "
    set "gmod=!gmod:"=!"
    set "gmod=!gmod:/=\!"
)
exit /b


:restorecss
set "css=!gmod!\html\awesomium_global.css"
if exist "!css!" (
    findstr /c:"important" "!css!" >nul || exit /b
)
set "cssurl=https://raw.githubusercontent.com/Facepunch/garrysmod/master/garrysmod/html/awesomium_global.css"
curl -fsL --ssl-no-revoke -o "!tmp!\awesomium_global.css" "!cssurl!"
if not exist "!tmp!\awesomium_global.css" powershell -Command "[Net.ServicePointManager]::SecurityProtocol='Tls12';(New-Object Net.WebClient).DownloadFile('!cssurl!','!tmp!\awesomium_global.css')" >nul 2>&1
findstr /c:"checkbox" "!tmp!\awesomium_global.css" >nul 2>&1 && copy /y "!tmp!\awesomium_global.css" "!css!" >nul && (
    echo   Restored html\awesomium_global.css
    exit /b
)
set "cssfail=1"
exit /b


:removefiles
for %%F in (
    "html\main.html"
    "html\menu.html"
    "html\loading.html"
    "html\loading.css"
    "html\saves.html"
    "html\dupes.html"
    "html\css\menu\VanillaUI.css"
    "html\css\menu\Custom.css"
    "html\js\menu\VanillaUI.js"
    "html\img\gradient.png"
    "html\img\vuo_logo.svg"
    "html\img\vuo_logo_brave.png"
    "html\img\vuo_logo_gmod10.svg"
    "html\fonts\Roboto-Regular.ttf"
    "html\fonts\Roboto-Medium.ttf"
    "html\fonts\Roboto-SemiBold.ttf"
    "html\fonts\tgnormal.ttf"
    "html\template\servers.html"
    "resource\SourceScheme.res"
    "resource\LoadingDialogGMod.res"
    "resource\LoadingDialogNoBanner.res"
    "resource\LoadingDialogNoBannerSingle.res"
    "resource\LoadingDialogVAC.res"
    "resource\loadingdialogerror.res"
    "resource\fonts\Roboto-Regular.ttf"
    "resource\fonts\Roboto-Medium.ttf"
    "resource\fonts\Roboto-SemiBold.ttf"
    "resource\fonts\tgnormal.ttf"
    "resource\fonts\vuo_barlow.ttf"
    "resource\fonts\vuo_quicksand.ttf"
    "lua\menu\loading.lua"
    "lua\menu\errors.lua"
    "lua\menu\mount\vgui\workshop.lua"
    "lua\menu\problems\problems_pnl.lua"
    "lua\menu\openurl.lua"
    "lua\autorun\client\spawnmenu_theme.lua"
    "lua\autorun\vuo_livebg.lua"
    "materials\vuo_ui\check.png"
    "workshop\materials\console\background01.vtf"
    "workshop\materials\console\background01_widescreen.vtf"
    "workshop\materials\console\startup_loading.vtf"
) do if exist "!gmod!\%%~F" (del /f /q "!gmod!\%%~F" & echo   Removed %%~F)

if not "%~1"=="keepdata" if exist "!gmod!\html\awesomium_global.css" (
    findstr /c:"important" "!gmod!\html\awesomium_global.css" >nul && (del /f /q "!gmod!\html\awesomium_global.css" & echo   Removed html\awesomium_global.css)
)

for %%D in ("materials\vuo_ui" "workshop\materials\console" "workshop\materials" "workshop") do rd "!gmod!\%%~D" 2>nul

if exist "!gmod!\addons\Vanilla_UI_StartupScreen" (rd /s /q "!gmod!\addons\Vanilla_UI_StartupScreen" & echo   Removed addons\Vanilla_UI_StartupScreen)

if exist "!gmod!\addons\garrysmod" (
    if "%~1"=="keepdata" (
        for /d %%D in ("!gmod!\addons\garrysmod\*") do if /i not "%%~nxD"=="materials" if /i not "%%~nxD"=="sound" rd /s /q "%%~D"
        del /f /q "!gmod!\addons\garrysmod\*" 2>nul
    ) else rd /s /q "!gmod!\addons\garrysmod"
    echo   Removed addons\garrysmod
)

if "%~1"=="keepdata" exit /b

for %%D in (
    "materials\vuo_backgrounds"
    "materials\vuo_fonts"
    "sound\vuo_music"
    "sound\vuo_sounds"
) do if exist "!gmod!\%%~D" (rd /s /q "!gmod!\%%~D" & echo   Removed %%~D)
exit /b
