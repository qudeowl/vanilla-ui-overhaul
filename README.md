# Vanilla UI+

A redesigned main menu. Choose your own fonts, backgrounds, music and layout.

> Bug reports welcome via [Issues](https://github.com/qudeowl/vanilla-ui-overhaul/issues).

## Installation

**Automatic (Recommended)**

1. Download the installer from the [latest release](https://github.com/qudeowl/vanilla-ui-overhaul/releases/latest)
   - **Windows:** `install_update_uninstall_vanilla_ui.bat`, then run it
   - **Linux:** `install_update_uninstall_vanilla_ui.sh`, then run `bash install_update_uninstall_vanilla_ui.sh` in a terminal
2. Select your preferred setup when prompted
3. The script finds your GMod folder automatically and installs the files
4. Launch Garry's Mod

> Make sure the game is closed before running the installer.

**Linux**

Linux support is still experimental. If the menu doesn't load properly (for example, the top bar buttons have no labels), this setup has worked for our testers:

1. In Steam, open Garry's Mod **Properties > Betas** and select the `x86-64` branch
2. Open **Properties > Compatibility**, enable **Force the use of a specific Steam Play compatibility tool** and select **Proton Experimental**
3. Install Vanilla UI+ with the **Standard** method, as the Addons Folder method may not load every interface file

If the menu still looks broken, the third-party [GModPatchTool](https://github.com/solsticegamestudios/GModPatchTool) can help by updating the game's built-in browser. It isn't part of Vanilla UI+ and changes game files, so it's up to you.

The Linux installer can also run without menus:

| Command | Action |
|---|---|
| `bash install_update_uninstall_vanilla_ui.sh -a` | Install (Standard) |
| `bash install_update_uninstall_vanilla_ui.sh -A` | Install (Addons Folder) |
| `bash install_update_uninstall_vanilla_ui.sh -U -a` | Update (Standard) |
| `bash install_update_uninstall_vanilla_ui.sh -U -A` | Update (Addons Folder) |
| `bash install_update_uninstall_vanilla_ui.sh -r` | Uninstall |

If your Garry's Mod folder isn't found automatically, set `GMOD_DIR` to it, for example `GMOD_DIR=~/path/to/garrysmod bash install_update_uninstall_vanilla_ui.sh -a`.

**Manual**

1. Download the zip from the [latest release](https://github.com/qudeowl/vanilla-ui-overhaul/releases/latest)
2. Extract and drop the `garrysmod` folder into `...\Steam\steamapps\common\GarrysMod` (on Linux usually `~/.local/share/Steam/steamapps/common/GarrysMod`)
> You're ready.

**Manual (Alternative)**
1. Download the zip from the [latest release](https://github.com/qudeowl/vanilla-ui-overhaul/releases/latest)
2. Extract and drop the `garrysmod` folder into `...\Steam\steamapps\common\GarrysMod\garrysmod\addons`
3. For the startup screen, move `addons\garrysmod\addons\Vanilla_UI_StartupScreen` to `...\garrysmod\addons` and `addons\garrysmod\workshop` to `...\garrysmod`
> The alternative installation method avoids modifying game files and reduces issues caused by official updates. However, some interface elements may be unavailable or may not work as expected, as they may be ignored by the game.

---

## Uninstall

**Automatic (Recommended)**

1. Run the .bat (or the .sh on Linux)
2. Select > 3. Uninstall (Reset To Default)
3. Verify game files on Steam

**Manual**

1. Verify game files on Steam
2. Delete `...\garrysmod\addons\Vanilla_UI_StartupScreen` and `...\garrysmod\workshop\materials\console`
3. If you installed v1.0, also delete `spawnmenu_theme.lua` from `...\garrysmod\lua\autorun\client` if it exists

**Manual (Alternative)**

1. Go to `...\Steam\steamapps\common\GarrysMod\garrysmod\addons`
2. Delete the `garrysmod` and `Vanilla_UI_StartupScreen` folders
3. Delete `...\garrysmod\workshop\materials\console`
> Follow alternative steps only if you installed the mod using the alternative installation method.

---

## Credits

Inspired by [TuPiDAn](https://steamcommunity.com/sharedfiles/filedetails/?id=3599195211)'s Dark Main Menu, [Remedy](https://steamcommunity.com/id/voidcubes/myworkshopfiles/)'s Theme Engine and [Portal](https://store.steampowered.com/bundle/234/Portal_Bundle/)

Linux testing and Setup steps by [Tiddie](https://steamcommunity.com/id/Tiddster/)
