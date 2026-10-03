#!/usr/bin/env -S bash \c
grep -q $'\r' "$0" 2> /dev/null && sed -i 's/\r$//' "$0" && exec bash "$0" "$@";

ARCHIVE="Vanilla_UI_Overhaul_v1.4.zip"
URL="https://github.com/qudeowl/vanilla-ui-overhaul/releases/download/vuo_v1.4/$ARCHIVE"

FILES=(
	"html/main.html"
	"html/menu.html"
	"html/loading.html"
	"html/loading.css"
	"html/awesomium_global.css"
	"html/saves.html"
	"html/dupes.html"
	"html/css/menu/VanillaUI.css"
	"html/css/menu/Custom.css"
	"html/img/gradient.png"
	"html/fonts/Roboto-Regular.ttf"
	"html/fonts/Roboto-Medium.ttf"
	"html/fonts/Roboto-SemiBold.ttf"
	"html/fonts/tgnormal.ttf"
	"html/template/servers.html"
	"resource/SourceScheme.res"
	"resource/LoadingDialogGMod.res"
	"resource/LoadingDialogNoBanner.res"
	"resource/LoadingDialogNoBannerSingle.res"
	"resource/LoadingDialogVAC.res"
	"resource/loadingdialogerror.res"
	"resource/fonts/Roboto-Regular.ttf"
	"resource/fonts/Roboto-Medium.ttf"
	"resource/fonts/Roboto-SemiBold.ttf"
	"resource/fonts/tgnormal.ttf"
	"resource/fonts/vuo_barlow.ttf"
	"resource/fonts/vuo_quicksand.ttf"
	"lua/menu/loading.lua"
	"lua/menu/errors.lua"
	"lua/menu/mount/vgui/workshop.lua"
	"lua/menu/problems/problems_pnl.lua"
	"lua/menu/openurl.lua"
	"lua/autorun/client/spawnmenu_theme.lua"
	"workshop/materials/console/background01.vtf"
	"workshop/materials/console/background01_widescreen.vtf"
	"workshop/materials/console/startup_loading.vtf"
)

DATA=(
	"materials/vuo_backgrounds"
	"materials/vuo_fonts"
	"sound/vuo_music"
	"sound/vuo_sounds"
)

ACTION=""
MODE=""
GMOD=""
TMP=""
SILENT=0

usage() {
	cat << 'EOF'
Usage:
  bash install_update_uninstall_vanilla_ui.sh           Interactive menu
  bash install_update_uninstall_vanilla_ui.sh -a        Install (Standard)
  bash install_update_uninstall_vanilla_ui.sh -A        Install (Addons Folder)
  bash install_update_uninstall_vanilla_ui.sh -U -a     Update (Standard)
  bash install_update_uninstall_vanilla_ui.sh -U -A     Update (Addons Folder)
  bash install_update_uninstall_vanilla_ui.sh -r        Uninstall

Options:
  -a, --install-standard   Standard installation method
  -A, --install-addon      Addons Folder installation method
  -U, --update             Update instead of install (use with -a or -A)
  -r, --uninstall          Remove the mod files
  -h, --help               Show this help

If Garry's Mod can't be found automatically, set GMOD_DIR to your
garrysmod folder, for example:
  GMOD_DIR="$HOME/.local/share/Steam/steamapps/common/GarrysMod/garrysmod" bash install_update_uninstall_vanilla_ui.sh -a
EOF
}

screen() {
	[ "$SILENT" = 1 ] || clear
}

pause_key() {
	[ "$SILENT" = 1 ] && return 0
	read -r -s -n 1 _ || true
}

fail() {
	echo " $1" >&2
	if [ "$SILENT" = 1 ]; then
		cleanup
		exit 1
	fi
}

gmod_running() {
	command -v pgrep > /dev/null 2>&1 || return 1
	pgrep -x hl2_linux > /dev/null 2>&1 && return 0
	pgrep -x gmod > /dev/null 2>&1 && return 0
	pgrep -f -i 'gmod\.exe|hl2\.exe' > /dev/null 2>&1 && return 0
	return 1
}

has_extractor() {
	command -v unzip > /dev/null 2>&1 && return 0
	command -v bsdtar > /dev/null 2>&1 && return 0
	command -v python3 > /dev/null 2>&1 && return 0
	return 1
}

update_info() {
	while true; do
		screen
		echo
		echo " Update removes the files of every previous version, then installs"
		echo " the latest release. Your settings, music, sounds, backgrounds and"
		echo " fonts are kept."
		echo
		echo "  1. Continue"
		echo "  2. Back"
		echo
		read -r -p "Select an option: " u || exit 0
		case "$u" in
			1) return 0 ;;
			2) return 1 ;;
		esac
	done
}

choose_mode() {
	while true; do
		screen
		echo
		echo " Choose your installation method:"
		echo
		echo "  1. Standard"
		echo "     Installs directly into the Garry's Mod folder. All features are"
		echo "     fully supported, but some game files are replaced. If a future"
		echo "     Garry's Mod update causes compatibility issues, simply reinstall"
		echo "     the mod."
		echo
		echo "  2. Addons Folder"
		echo "     Installs into garrysmod/addons instead. This avoids modifying game"
		echo "     files and reduces issues caused by official updates. However, some"
		echo "     interface elements may be unavailable or may not work as expected,"
		echo "     as they may be ignored by the game."
		echo
		echo "  3. Back"
		echo
		read -r -p "Select an option: " m || exit 0
		case "$m" in
			1) MODE="standard"; return 0 ;;
			2) MODE="addon"; return 0 ;;
			3) return 1 ;;
		esac
	done
}

clean_path() {
	local p="$1"
	p="${p//\"/}"
	p="${p//\'/}"
	p="${p/#\~/$HOME}"
	p="${p%/}"
	printf '%s' "$p"
}

detect_gmod() {
	local roots=(
		"$HOME/.steam/steam"
		"$HOME/.steam/root"
		"$HOME/.local/share/Steam"
		"$HOME/.var/app/com.valvesoftware.Steam/.local/share/Steam"
		"$HOME/snap/steam/common/.local/share/Steam"
	)
	local r lib
	for r in "${roots[@]}"; do
		if [ -d "$r/steamapps/common/GarrysMod/garrysmod" ]; then
			printf '%s' "$r/steamapps/common/GarrysMod/garrysmod"
			return 0
		fi
	done
	for r in "${roots[@]}"; do
		[ -f "$r/steamapps/libraryfolders.vdf" ] || continue
		while IFS= read -r lib; do
			if [ -d "$lib/steamapps/common/GarrysMod/garrysmod" ]; then
				printf '%s' "$lib/steamapps/common/GarrysMod/garrysmod"
				return 0
			fi
		done < <(sed -n 's/^[[:space:]]*"path"[[:space:]]*"\(.*\)"[[:space:]]*$/\1/p' "$r/steamapps/libraryfolders.vdf")
	done
	return 1
}

find_gmod() {
	local a
	GMOD=""
	if [ -n "${GMOD_DIR:-}" ]; then
		GMOD="$(clean_path "$GMOD_DIR")"
		return
	fi
	GMOD="$(detect_gmod)"
	if [ -n "$GMOD" ]; then
		[ "$SILENT" = 1 ] && return
		echo " Found Garry's Mod at: $GMOD"
		read -r -p "Use this folder? [Y/n] " a || a=""
		case "$a" in
			[Nn]*) GMOD="" ;;
			*) return ;;
		esac
	else
		[ "$SILENT" = 1 ] && return
		echo " Couldn't find the garrysmod folder automatically."
	fi
	read -r -p "Paste the full path to your 'garrysmod' folder: " a || a=""
	GMOD="$(clean_path "$a")"
}

download() {
	TMP="$(mktemp -d)" || return 1
	if command -v curl > /dev/null 2>&1; then
		curl -fL --retry 2 -o "$TMP/$ARCHIVE" "$URL"
	elif command -v wget > /dev/null 2>&1; then
		wget -O "$TMP/$ARCHIVE" "$URL"
	fi
	[ -s "$TMP/$ARCHIVE" ]
}

extract() {
	mkdir -p "$TMP/out" || return 1
	if command -v unzip > /dev/null 2>&1; then
		unzip -q -o "$TMP/$ARCHIVE" -d "$TMP/out"
	elif command -v bsdtar > /dev/null 2>&1; then
		bsdtar -xf "$TMP/$ARCHIVE" -C "$TMP/out"
	else
		python3 -m zipfile -e "$TMP/$ARCHIVE" "$TMP/out"
	fi
}

install_files() {
	local d src x
	d="$(find "$TMP/out" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
	[ -n "$d" ] || return 1
	src="$d"
	[ -d "$d/garrysmod" ] && src="$d/garrysmod"
	if [ "$MODE" = "addon" ]; then
		mkdir -p "$GMOD/addons/garrysmod" || return 1
		for x in "$src"/*; do
			case "$(basename "$x")" in
				addons|workshop) continue ;;
			esac
			cp -R "$x" "$GMOD/addons/garrysmod/" || return 1
		done
		for x in addons workshop; do
			if [ -d "$src/$x" ]; then
				mkdir -p "$GMOD/$x" || return 1
				cp -R "$src/$x/." "$GMOD/$x/" || return 1
			fi
		done
	else
		cp -R "$src/." "$GMOD/" || return 1
	fi
}

remove_files() {
	local f d
	for f in "${FILES[@]}"; do
		if [ -f "$GMOD/$f" ]; then
			rm -f "$GMOD/$f" && echo "  Removed $f"
		fi
	done
	for d in "workshop/materials/console" "workshop/materials" "workshop"; do
		rmdir "$GMOD/$d" 2> /dev/null
	done
	if [ -d "$GMOD/addons/Vanilla_UI_StartupScreen" ]; then
		rm -rf "$GMOD/addons/Vanilla_UI_StartupScreen" && echo "  Removed addons/Vanilla_UI_StartupScreen"
	fi
	if [ -d "$GMOD/addons/garrysmod" ]; then
		if [ "$1" = "keepdata" ]; then
			for d in "$GMOD/addons/garrysmod"/*; do
				case "$(basename "$d")" in
					materials|sound) continue ;;
				esac
				rm -rf "$d"
			done
		else
			rm -rf "$GMOD/addons/garrysmod"
		fi
		echo "  Removed addons/garrysmod"
	fi
	[ "$1" = "keepdata" ] && return 0
	for d in "${DATA[@]}"; do
		if [ -d "$GMOD/$d" ]; then
			rm -rf "$GMOD/$d" && echo "  Removed $d"
		fi
	done
}

cleanup() {
	if [ -n "$TMP" ] && [ -d "$TMP" ]; then
		rm -rf "$TMP"
	fi
	TMP=""
}

run_install() {
	if [ "$SILENT" = 1 ]; then
		gmod_running && fail "Garry's Mod is running. Please close it, then try again."
	else
		while gmod_running; do
			echo
			echo " Garry's Mod is running. Please close it, then press any key."
			pause_key
		done
	fi

	screen
	echo " Looking for Garry's Mod..."
	find_gmod
	if [ -z "$GMOD" ] || [ ! -d "$GMOD" ]; then
		if [ "$SILENT" = 1 ]; then
			fail "Couldn't find the garrysmod folder. Set GMOD_DIR to its full path and try again."
		fi
		echo " That path doesn't exist. Going back to the menu."
		sleep 3
		return 1
	fi
	echo " Found Garry's Mod at: $GMOD"

	if ! has_extractor; then
		fail "Please install unzip first (for example: sudo apt install unzip), then run this script again."
		echo " Press any key to go back."
		pause_key
		return 1
	fi

	echo " Downloading..."
	if ! download; then
		fail "Download failed. Check your internet connection and try again."
		cleanup
		pause_key
		return 1
	fi

	if ! extract; then
		fail "The download couldn't be extracted. Please try again."
		cleanup
		pause_key
		return 1
	fi

	if [ "$ACTION" = "update" ]; then
		echo
		echo " Removing previous version..."
		remove_files keepdata
	fi

	echo " Installing..."
	if ! install_files; then
		fail "Installation failed. Check that you can write to: $GMOD"
		cleanup
		pause_key
		return 1
	fi
	cleanup

	screen
	echo
	if [ "$MODE" = "addon" ]; then
		echo " Done. Installed as an addon to:"
		echo " $GMOD/addons/garrysmod"
	else
		echo " Done. Installed to:"
		echo " $GMOD"
	fi
	echo
	echo " Launch Garry's Mod to see your new menu."
	if [ "$SILENT" = 0 ]; then
		echo
		echo " Press any key to exit."
		pause_key
	fi
	exit 0
}

run_uninstall() {
	if [ "$SILENT" = 0 ]; then
		while true; do
			screen
			echo
			echo " This removes the mod files. Afterwards, verify the game files"
			echo " in Steam to bring the original ones back."
			echo
			echo "  1. Continue"
			echo "  2. Back"
			echo
			read -r -p "Select an option: " u || exit 0
			case "$u" in
				1) break ;;
				2) return 1 ;;
			esac
		done
	fi

	screen
	echo " Looking for Garry's Mod..."
	find_gmod
	if [ -z "$GMOD" ] || [ ! -d "$GMOD" ]; then
		if [ "$SILENT" = 1 ]; then
			fail "Couldn't find the garrysmod folder. Set GMOD_DIR to its full path and try again."
		fi
		echo " Couldn't find the garrysmod folder. Going back to the menu."
		sleep 3
		return 1
	fi

	echo " Removing files from $GMOD"
	echo
	remove_files

	screen
	echo
	echo " Mod files removed."
	echo
	echo " To restore the original Garry's Mod files:"
	echo "  1. Open your Steam library, right-click Garry's Mod, then Properties"
	echo "  2. Go to the Installed Files tab"
	echo "  3. Click Verify integrity of game files"
	if [ "$SILENT" = 0 ]; then
		echo
		echo " Press any key to exit."
		pause_key
	fi
	exit 0
}

run_options() {
	local mode="" update=0 remove=0
	while [ $# -gt 0 ]; do
		case "$1" in
			-a|--install-standard)
				[ -z "$mode" ] || { echo " Choose only one installation method." >&2; usage >&2; exit 2; }
				mode="standard"
				;;
			-A|--install-addon)
				[ -z "$mode" ] || { echo " Choose only one installation method." >&2; usage >&2; exit 2; }
				mode="addon"
				;;
			-U|--update) update=1 ;;
			-r|--uninstall) remove=1 ;;
			-h|--help) usage; exit 0 ;;
			*) echo " Unknown option: $1" >&2; usage >&2; exit 2 ;;
		esac
		shift
	done
	SILENT=1
	if [ "$remove" = 1 ]; then
		if [ -n "$mode" ] || [ "$update" = 1 ]; then
			echo " Uninstall can't be combined with other options." >&2
			usage >&2
			exit 2
		fi
		run_uninstall
	fi
	if [ -z "$mode" ]; then
		echo " Choose an installation method: -a (Standard) or -A (Addons Folder)." >&2
		usage >&2
		exit 2
	fi
	MODE="$mode"
	if [ "$update" = 1 ]; then ACTION="update"; else ACTION="install"; fi
	run_install
	exit 1
}

main() {
	trap cleanup EXIT
	if [ $# -gt 0 ]; then
		run_options "$@"
	fi
	while true; do
		screen
		echo
		echo " Vanilla UI+ v1.4"
		echo " github.com/qudeowl/vanilla-ui-overhaul"
		echo
		echo "  1. Install"
		echo "  2. Update"
		echo "  3. Uninstall (Reset To Default)"
		echo "  4. Exit"
		echo
		read -r -p "Select an option: " choice || exit 0
		case "$choice" in
			1) ACTION="install"; choose_mode && run_install ;;
			2) update_info && { ACTION="update"; choose_mode && run_install; } ;;
			3) run_uninstall ;;
			4) exit 0 ;;
		esac
	done
}

if [ "${BASH_SOURCE[0]}" = "$0" ]; then
	main "$@"
fi
