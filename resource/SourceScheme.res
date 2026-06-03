///////////////////////////////////////////////////////////
// Tracker scheme resource file
//
// sections:
//		Colors			- all the colors used by the scheme
//		BaseSettings	- contains settings for app to use to draw controls
//		Fonts			- list of all the fonts used by app
//		Borders			- description of all the borders
//
///////////////////////////////////////////////////////////
Scheme
{
	//////////////////////// COLORS ///////////////////////////
	// color details
	// this is a list of all the colors used by the scheme
	Colors
	{
		"White"					"255 255 255 255"
		"TextPrimary"			"224 224 224 255"
		"DarkGrey"				"42 42 42 255"
		"DarkerGrey"			"26 26 26 255"
		"BorderGrey"			"58 58 58 255"
		"ScrollGrey"			"74 74 74 255"
		"DarkGreen"				"45 80 22 255"
		"DarkGreenAccent"		"58 107 31 255"
		"GreenHighlight"		"74 128 40 255"
		"ErrorOrange"			"196 58 0 255"
		"TransparentBlack"		"0 0 0 128"
		"Black"					"0 0 0 255"
		"Blank"					"0 0 0 0"
		"BGOpaque"				"26 26 26 250"
		"BGTransparent"			"26 26 26 0"
		"WhiteTransparent"		"255 255 255 0"
		
		// ── Tema: Custom.css ile birebir eşleştirildi ──────────
		// Ana arka plan  rgba(15, 20, 35, 0.82)  → alpha ≈ 195
		"Theme_WindowBG"        "15 20 35 195"
		// İçerik arka planı (liste/panel iç) rgba(20,28,48)
		"Theme_ContentBG"       "20 28 48 170"
		// Metin arka planı (RichText, TextEntry)
		"Theme_TextBG"          "8 12 26 175"
		// Ana metin rengi #e0ecff
		"Theme_Text"            "224 236 255 255"
		// Buton normal: rgba(20,28,50,0.55)
		"Theme_Button"          "20 28 50 140"
		// Buton hover: rgba(35,135,237,0.3)
		"Theme_ButtonHover"     "35 135 237 76"
		// Border: rgba(255,255,255,0.1)
		"Theme_Border"          "255 255 255 25"
		// GMod mavi: #2387ed  (35,135,237)
		"Theme_Blue"            "35 135 237 255"
		// GMod mavi yarı saydam
		"Theme_Blue_Light"      "35 135 237 110"
		// Başlık barı arka planı: rgba(35,135,237,0.15)
		"Theme_TitleBG"         "35 135 237 38"
	}

	///////////////////// BASE SETTINGS ////////////////////////
	//
	// default settings for all panels
	// controls use these to determine their settings
	BaseSettings
	{
		// vgui_controls color specifications
		Border.Bright					"Theme_Blue"		// the lit side of a control
		Border.Dark						"26 26 26 198"		// the dark/unlit side of a control
		Border.Selection				"Theme_Blue_Light"	// the additional border color for displaying the default/selected button
		Border.DarkSolid				"Theme_WindowBG"
		Border.Subtle					"58 58 58 255"

		Button.TextColor				"Theme_Text"
		Button.BgColor					"Theme_Button"
		Button.ArmedTextColor			"Theme_Blue"
		Button.ArmedBgColor				"Theme_ButtonHover"
		Button.DepressedTextColor		"White"
		Button.DepressedBgColor			"Theme_Blue"
		Button.FocusBorderColor			"Theme_Blue"

		CheckButton.TextColor			"Theme_Text"
		CheckButton.SelectedTextColor	"White"
		CheckButton.BgColor				"Theme_ContentBG"
		CheckButton.Border1				"35 135 237 80"
		CheckButton.Border2				"35 135 237 80"
		CheckButton.Check				"Theme_Blue"
		CheckButton.DisabledFgColor		"58 58 58 255"
		CheckButton.HighlightFgColor	"Theme_Blue"
		CheckButton.ArmedBgColor		"Blank"
		CheckButton.DepressedBgColor	"Blank"
		CheckButton.DisabledBgColor		"Theme_ContentBG"

		ComboBoxButton.ArrowColor		"Theme_Text"
		ComboBoxButton.ArmedArrowColor	"Theme_Blue"
		ComboBoxButton.BgColor			"Theme_Button"
		ComboBoxButton.DisabledBgColor	"Theme_ContentBG"

		Frame.TitleTextInsetX			16
		Frame.ClientInsetX				8
		Frame.ClientInsetY				6
		Frame.BgColor					"Theme_WindowBG"
		Frame.OutOfFocusBgColor			"15 20 35 210"
		Frame.FocusTransitionEffectTime	"0.3"
		Frame.TransitionEffectTime		"0.3"
		Frame.AutoSnapRange				"0"
		FrameGrip.Color1				"Theme_Blue_Light"
		FrameGrip.Color2				"15 20 35 196"
		FrameTitleButton.FgColor		"224 236 255 200"
		FrameTitleButton.BgColor		"0 0 0 0"
		FrameTitleButton.DisabledFgColor	"58 70 90 192"
		FrameTitleButton.DisabledBgColor	"0 0 0 0"
		FrameSystemButton.FgColor		"Blank"
		FrameSystemButton.BgColor		"Blank"
		FrameSystemButton.Icon			""
		FrameSystemButton.DisabledIcon	""
		FrameTitleBar.Font				"UiBold"
		FrameTitleBar.TextColor			"Theme_Blue"
		FrameTitleBar.BgColor			"Theme_TitleBG"
		FrameTitleBar.DisabledTextColor	"58 70 90 91"
		FrameTitleBar.DisabledBgColor	"0 0 0 0"

		GraphPanel.FgColor				"White"
		GraphPanel.BgColor				"0 0 0 128"

		Label.TextDullColor				"80 100 130 255"
		Label.TextColor					"Theme_Text"
		Label.TextBrightColor			"255 255 255 255"
		Label.SelectedTextColor			"White"
		Label.BgColor					"0 0 0 0"
		Label.DisabledFgColor1			"80 100 130 200"
		Label.DisabledFgColor2			"Theme_ContentBG"

		ListPanel.TextColor					"Theme_Text"
		ListPanel.TextBgColor				"Blank"
		ListPanel.BgColor					"Theme_ContentBG"
		ListPanel.SelectedTextColor			"White"
		ListPanel.SelectedBgColor			"Theme_Blue_Light"
		ListPanel.OutOfFocusSelectedTextColor	"Theme_Text"
		ListPanel.SelectedOutOfFocusBgColor	"Theme_Blue"
		ListPanel.EmptyListInfoTextColor	"Theme_Text"

		Menu.TextColor					"Theme_Text"
		Menu.BgColor					"Theme_ContentBG"
		Menu.ArmedTextColor				"White"
		Menu.ArmedBgColor				"Theme_Blue_Light"
		Menu.TextInset					"6"

		Panel.FgColor					"Theme_Text"
		Panel.BgColor					"0 0 0 0"

		ProgressBar.FgColor				"Theme_Blue"
		ProgressBar.BgColor				"0 0 0 128"

		PropertySheet.TextColor				"224 224 224 200"
		PropertySheet.SelectedTextColor		"White"
		PropertySheet.SelectedBgColor		"Theme_Blue_Light"
		PropertySheet.TransitionEffectTime	"0.25"
		PropertySheet.BgColor				"Theme_ContentBG"

		RadioButton.TextColor			"Theme_Text"
		RadioButton.SelectedTextColor	"White"

		RichText.TextColor				"Theme_Text"
		RichText.BgColor				"0 0 0 128"
		RichText.SelectedTextColor		"White"
		RichText.SelectedBgColor		"Theme_Blue_Light"

		ScrollBar.Wide					15

		ScrollBarButton.FgColor				"Theme_Text"
		ScrollBarButton.BgColor				"Theme_Button"
		ScrollBarButton.ArmedFgColor		"Theme_Blue"
		ScrollBarButton.ArmedBgColor		"Theme_Text"
		ScrollBarButton.DepressedFgColor	"White"
		ScrollBarButton.DepressedBgColor	"Theme_Blue"

		ScrollBarSlider.FgColor				"35 135 237 150"
		ScrollBarSlider.BgColor				"15 20 35 180"

		SectionedListPanel.HeaderTextColor	"Theme_Blue"
		SectionedListPanel.HeaderBgColor	"Blank"
		SectionedListPanel.DividerColor		"58 58 58 150"
		SectionedListPanel.TextColor		"Theme_Text"
		SectionedListPanel.BrightTextColor	"255 255 255 255"
		SectionedListPanel.BgColor			"Theme_WindowBG"
		SectionedListPanel.SelectedTextColor			"White"
		SectionedListPanel.SelectedBgColor			"Theme_Blue"
		SectionedListPanel.OutOfFocusSelectedTextColor	"Theme_Text"
		SectionedListPanel.OutOfFocusSelectedBgColor	"Theme_Blue"

		Slider.NobColor				"Theme_Blue"
		Slider.TextColor			"Theme_Text"
		Slider.TrackColor			"20 28 48 200"
		Slider.DisabledTextColor1	"58 58 58 255"
		Slider.DisabledTextColor2	"Theme_WindowBG"

		TextEntry.TextColor			"Theme_Text"
		TextEntry.BgColor			"Theme_TextBG"
		TextEntry.CursorColor		"Theme_Blue"
		TextEntry.DisabledTextColor	"58 58 58 255"
		TextEntry.DisabledBgColor	"Theme_ContentBG"
		TextEntry.SelectedTextColor	"255 255 255 255"
		TextEntry.SelectedBgColor	"Theme_Blue_Light"
		TextEntry.OutOfFocusSelectedBgColor	"Theme_Blue"
		TextEntry.FocusEdgeColor	"Theme_Blue_Light"

		ToggleButton.SelectedTextColor	"Theme_Blue_Light"

		Tooltip.TextColor			"Theme_WindowBG"
		Tooltip.BgColor				"Theme_Blue"

		TreeView.BgColor			"26 26 26 0"

		WizardSubPanel.BgColor		"Blank"

		// scheme-specific colors
		MainMenu.TextColor			"Theme_Text"
		MainMenu.ArmedTextColor		"Theme_Blue"
		MainMenu.DepressedTextColor	"Theme_Blue"
		MainMenu.MenuItemHeight		"30"
		MainMenu.Inset				"32"
		MainMenu.Backdrop			"0 0 0 156"

		Console.TextColor			"Theme_Text"
		Console.DevTextColor		"Theme_Blue"

		NewGame.TextColor			"Theme_Text"
		NewGame.FillColor			"Theme_WindowBG"
		NewGame.SelectionColor		"Theme_Blue"
		NewGame.DisabledColor		"58 58 58 196"

		MessageDialog.MatchmakingBG				"Theme_WindowBG"
		MessageDialog.MatchmakingBGBlack		"20 20 20 255"

		MatchmakingMenuItemTitleColor		"Theme_Text"
		MatchmakingMenuItemDescriptionColor	"Theme_Text"

		"QuickListBGDeselected"		"Theme_WindowBG"
		"QuickListBGSelected"		"Theme_Blue"
	}

	//////////////////////// BITMAP FONT FILES /////////////////////////////
	//
	// Bitmap Fonts are ****VERY*** expensive static memory resources so they are purposely sparse
	BitmapFontFiles
	{
		// UI buttons, custom font, (256x64)
		"Buttons"		"materials/vgui/fonts/buttons_32.vbf"
	}

	//////////////////////// FONTS /////////////////////////////
	//
	// describes all the fonts
	Fonts
	{
		// fonts are used in order that they are listed
		// fonts listed later in the order will only be used if they fulfill a range not already filled
		// if a font fails to load then the subsequent fonts will replace
		// fonts are used in order that they are listed
		"DebugFixed"
		{
			"1"
			{
				"name"		"Courier New"
				"tall"		"10"
				"weight"	"500"
				"antialias" "1"
			}
		}
		// fonts are used in order that they are listed
		"DebugFixedSmall"
		{
			"1"
			{
				"name"		"Courier New"
				"tall"		"7"
				"weight"	"500"
				"antialias" "1"
			}
		}
		"DefaultFixedOutline"
		{
			"1"
			{
				"name"		"Lucida Console" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"14" [$LINUX]
				"tall"		 "10"
				"tall_lodef" "15"
				"tall_hidef" "20"
				"weight"	 "0"
				"outline"	 "1"
			}
		}
		"Default"
		{
			"1"
			{
				"name"		"Tahoma" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"16"
				"weight"	"500"
			}
		}
		"DefaultBold"
		{
			"1"
			{
				"name"		"Tahoma" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"16"
				"weight"	"1000"
			}
		}
		"DefaultUnderline"
		{
			"1"
			{
				"name"		"Tahoma" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"16"
				"weight"	"500"
				"underline" "1"
			}
		}
		"DefaultSmall"
		{
			"1"
			{
				"name"		"Tahoma" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"12" [$WINDOWS]
				"tall"		"14" [$OSX]
				"tall"		"16" [$LINUX]
				"weight"	"0"
			}
		}
		"DefaultSmallDropShadow"
		{
			"1"
			{
				"name"		"Tahoma" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"13"
				"weight"	"0"
				"dropshadow" "1"
			}
		}
		"DefaultVerySmall"
		{
			"1"
			{
				"name"		"Tahoma" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"12"
				"weight"	"0"
			}
		}

		"DefaultLarge"
		{
			"1"
			{
				"name"		"Tahoma" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"18"
				"weight"	"0"
			}
		}
		"UiBold"
		{
			"1"	[$WIN32]
			{
				"name"		"Tahoma" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"12"
				"weight"	"1000"
			}
			"1"	[$X360]
			{
				"name"		"Tahoma"
				"tall"		"24"
				"weight"	"2000"
				"outline"	"1"
			}
		}
		"ChapterTitle"	[$X360]
		{
			"1"
			{
				"name"			"Tahoma"
				"tall"			"20"
				"tall_hidef"	"28"
				"weight"		"2000"
				"outline"		"1"
			}
		}
		"ChapterTitleBlur"	[$X360]
		{
			"1"
			{
				"name"			"Tahoma"
				"tall"			"20"
				"tall_hidef"	"28"
				"weight"		"2000"
				"blur"			"3"
				"blur_hidef"	"5"
			}
		}
		"MenuLarge"
		{
			"1"	[$LINUX]
			{
				"name"		"Helvetica Bold"
				"tall"		"20"
				"antialias" "1"
			}
			"1"	[!$LINUX]
			{
				"name"		"Verdana"
				"tall"		"16"
				"weight"	"600"
				"antialias" "1"
			}
			"1"	[$X360]
			{
				"name"		"Verdana"
				"tall"			"14"
				"tall_hidef"	"20"
				"weight"	"1200"
				"antialias" "1"
				"outline" "1"
			}
		}
		"AchievementTitleFont"
		{
			"1"
			{
				"name"		"Verdana"
				"tall"		"20"
				"weight"	"1200"
				"antialias" "1"
				"outline" "1"
			}
		}

		"AchievementTitleFontSmaller"
		{
			"1"
			{
				"name"		"Verdana"
				"tall"		"18"
				"weight"	"1200"
				"antialias" "1"
				//"outline" "1"
			}
		}


		"AchievementDescriptionFont"
		{
			"1"
			{
				"name"		"Verdana"
				"tall"		"15"
				"weight"	"1200"
				"antialias" "1"
				"outline" "1"
				"yres"		"0 480"
			}
			"2"
			{
				"name"		"Verdana"
				"tall"		"20"
				"weight"	"1200"
				"antialias" "1"
				"outline" "1"
				"yres"	 "481 10000"
			}
		}

		GameUIButtons
		{
			"1"	[$X360]
			{
				"bitmap"	"1"
				"name"		"Buttons"
				"scalex"	"0.63"
				"scaley"	"0.63"
				"scalex_hidef"	"1.0"
				"scaley_hidef"	"1.0"
				"scalex_lodef"	"0.75"
				"scaley_lodef"	"0.75"
			}
		}
		"ConsoleText"
		{
			"1"
			{
				"name"		"Lucida Console" [$WINDOWS]
				"name"		"Verdana" [!$WINDOWS]
				"tall"		"12" [$WINDOWS]
				"tall"		"14" [!$WINDOWS]
				"weight"	"500"
			}
		}

		// this is the symbol font
		"Marlett"
		{
			"1"
			{
				"name"		"Marlett"
				"tall"		"14"
				"weight"	"0"
				"symbol"	"1"
			}
		}

		"Trebuchet24"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"24"
				"weight"	"900"
			}
		}

		"Trebuchet20"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"20"
				"weight"	"900"
			}
		}

		"Trebuchet18"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"18"
				"weight"	"900"
			}
		}

		// HUD numbers
		// We use multiple fonts to 'pulse' them in the HUD, hence the need for many of near size
		"HUDNumber"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"40"
				"weight"	"900"
			}
		}
		"HUDNumber1"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"41"
				"weight"	"900"
			}
		}
		"HUDNumber2"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"42"
				"weight"	"900"
			}
		}
		"HUDNumber3"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"43"
				"weight"	"900"
			}
		}
		"HUDNumber4"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"44"
				"weight"	"900"
			}
		}
		"HUDNumber5"
		{
			"1"
			{
				"name"		"Trebuchet MS"
				"tall"		"45"
				"weight"	"900"
			}
		}
		"DefaultFixed"
		{
			"1"
			{
				"name"		 "Lucida Console" [$WINDOWS]
				"name"		 "Lucida Console" [$X360]
				"name"		 "Verdana" [$LINUX]
				"tall"		"11" [$LINUX]
				"tall"		"10"
				"weight"	"0"
			}
//			"1"
//			{
//				"name"		"FixedSys"
//				"tall"		"20"
//				"weight"	"0"
//			}
		}

		"DefaultFixedDropShadow"
		{
			"1"
			{
				"name"		 "Lucida Console" [$WINDOWS]
				"name"		 "Lucida Console" [$X360]
				"name"		 "Lucida Console" [$OSX]
				"name"		 "Courier" [$LINUX]
				"tall"		"14" [$LINUX]
				"tall"		"10"
				"weight"	"0"
				"dropshadow" "1"
			}
//			"1"
//			{
//				"name"		"FixedSys"
//				"tall"		"20"
//				"weight"	"0"
//			}
		}

		"CloseCaption_Normal"
		{
			"1"
			{
				"name"		"Tahoma" [!$POSIX]
				"name"		"Verdana" [$POSIX]
				"tall"		"16"
				"weight"	"500"
			}
		}
		"CloseCaption_Italic"
		{
			"1"
			{
				"name"		"Tahoma"
				"tall"		"16"
				"weight"	"500"
				"italic"	"1"
			}
		}
		"CloseCaption_Bold"
		{
			"1"
			{
				"name"		"Tahoma" [!$POSIX]
				"name"		"Verdana Bold" [$POSIX]
				"tall"		"16"
				"weight"	"900"
			}
		}
		"CloseCaption_BoldItalic"
		{
			"1"
			{
				"name"		"Tahoma" [!$POSIX]
				"name"		"Verdana Bold Italic" [$POSIX]
				"tall"		"16"
				"weight"	"900"
				"italic"	"1"
			}
		}

		TitleFont
		{
			"1"
			{
				"name"		"HalfLife2"
				"tall"		"72"
				"weight"	"400"
				"antialias"	"1"
				"custom"	"1"
			}
		}

		TitleFont2
		{
			"1"
			{
				"name"		"HalfLife2"
				"tall"		"120"
				"weight"	"400"
				"antialias"	"1"
				"custom"	"1"
			}
		}

		AppchooserGameTitleFont	[$X360]
		{
			"1"
			{
				"name"			"Trebuchet MS"
				"tall"			"16"
				"tall_hidef"	"24"
				"weight"		"900"
				"antialias"		"1"
			}
		}

		AppchooserGameTitleFontBlur	[$X360]
		{
			"1"
			{
				"name"			"Trebuchet MS"
				"tall"			"16"
				"tall_hidef"	"24"
				"weight"		"900"
				"blur"			"3"
				"blur_hidef"	"5"
				"antialias"		"1"
			}
		}

		StatsTitle	[$WIN32]
		{
			"1"
			{
				"name"		"Arial" [!$POSIX]
				"name"		"Verdana Bold" [$POSIX]
				"weight"		"2000"
				"tall"			"20"
				"antialias"		"1"
			}
		}

		StatsText	[$WIN32]
		{
			"1"
			{
				"name"		"Arial" [!$POSIX]
				"name"		"Verdana Bold" [$POSIX]
				"weight"		"2000"
				"tall"			"18"
				"antialias"		"1"
			}
		}

		AchievementItemTitle	[$WIN32]
		{
			"1"
			{
				"name"		"Arial" [!$POSIX]
				"name"		"Verdana Bold" [$POSIX]
				"weight"		"1500"
				"tall"			"16" [!$POSIX]
				"tall"			"18" [$POSIX]
				"antialias"		"1"
			}
		}

		AchievementItemDate	[$WIN32]
		{
			"1"
			{
				"name"		"Arial" [!$POSIX]
				"name"		"Verdana Bold" [$POSIX]
				"weight"		"1500"
				"tall"			"16"
				"antialias"		"1"
			}
		}


		StatsPageText
		{
			"1"
			{
				"name"		"Arial" [!$POSIX]
				"name"		"Verdana Bold" [$POSIX]
				"weight"		"1500"
				"tall"			"14" [!$POSIX]
				"tall"			"16" [$POSIX]
				"antialias"		"1"
			}
		}

		AchievementItemTitleLarge	[$WIN32]
		{
			"1"
			{
				"name"		"Arial" [!$POSIX]
				"name"		"Verdana Bold" [$POSIX]
				"weight"		"1500"
				"tall"			"18" [!$POSIX]
				"tall"			"19" [$POSIX]
				"antialias"		"1"
			}
		}

		AchievementItemDescription	[$WIN32]
		{
			"1"
			{
				"name"		"Arial" [!$POSIX]
				"name"		"Verdana" [$POSIX]
				"weight"		"1000"
				"tall"			"14" [!$POSIX]
				"tall"			"15" [$POSIX]
				"antialias"		"1"
			}
		}


		"ServerBrowserTitle"
		{
			"1"
			{
				"name"		"Tahoma" [!$POSIX]
				"name"		"Verdana" [$POSIX]
				"tall"		"35"
				"tall_lodef"	"40"
				"weight"	"500"
				"additive"	"0"
				"antialias" "1"
			}
		}

		"ServerBrowserSmall"
		{
			"1"
			{
				"name"		"Tahoma"
				"tall"		"16"
				"weight"	"0"
				"range"		"0x0000 0x017F" //	Basic Latin, Latin-1 Supplement, Latin Extended-A
				"yres"	"480 599"
			}
			"2"
			{
				"name"		"Tahoma"
				"tall"		"16"
				"weight"	"0"
				"range"		"0x0000 0x017F" //	Basic Latin, Latin-1 Supplement, Latin Extended-A
				"yres"	"600 767"
			}
			"3"
			{
				"name"		"Tahoma"
				"tall"		"16"
				"weight"	"0"
				"range"		"0x0000 0x017F" //	Basic Latin, Latin-1 Supplement, Latin Extended-A
				"yres"	"768 1023"
				"antialias"	"1"
			}
			"4"
			{
				"name"		"Tahoma"
				"tall"		"19"
				"weight"	"0"
				"range"		"0x0000 0x017F" //	Basic Latin, Latin-1 Supplement, Latin Extended-A
				"yres"	"1024 1199"
				"antialias"	"1"
			}
			"5"
			{
				"name"		"Tahoma"
				"tall"		"19"
				"weight"	"0"
				"range"		"0x0000 0x017F" //	Basic Latin, Latin-1 Supplement, Latin Extended-A
				"yres"	"1200 6000"
				"antialias"	"1"
			}
		}

	}

	//
	//////////////////// BORDERS //////////////////////////////
	//
	// describes all the border types
	Borders
	{
		BaseBorder		SubtleBorder
		ButtonBorder	RaisedBorder
		ComboBoxBorder	DepressedBorder
		MenuBorder		SubtleBorder
		BrowserBorder	DepressedBorder
		PropertySheetBorder	RaisedBorder

		FrameBorder
		{
			// rounded corners for frames
			//"backgroundtype" "2"

			Left
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Bottom
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}
		}

		SubtleBorder
		{
			"inset" "0 0 0 0"
			Left
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

			Bottom
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}
		}

		DepressedBorder
		{
			"inset" "0 0 0 0"
			Left
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Bottom
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}
		}
		RaisedBorder
		{
			"inset" "0 0 0 0"
			Left
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

			Bottom
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}
		}

		TitleButtonBorder
		{
			"backgroundtype" "0"
		}

		TitleButtonDisabledBorder
		{
			"backgroundtype" "0"
		}

		TitleButtonDepressedBorder
		{
			"backgroundtype" "0"
		}

		ScrollBarButtonBorder
		{
			"inset" "0 0 0 0"
			Left
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Bottom
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}
		}

		ScrollBarButtonDepressedBorder
		{
			"inset" "0 0 0 0"
			Left
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Bottom
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}
		}

		TabBorder
		{
			"inset" "1 1 1 1"

			render
			{
				"0" "fill( x0, y0, x1, y1, Black )"
			}

			render_bg
			{
				"0" "fill( x0, y0, x1, y1, Orange )"
			}

		}

		TabActiveBorder
		{
			"inset" "1 1 1 1"
			Left
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.Subtle"
					"offset" "0 0"
				}
			}

		}


		ToolTipBorder
		{
			"inset" "0 0 1 0"
			Left
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Bottom
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}
		}

		// this is the border used for default buttons (the button that gets pressed when you hit enter)
		ButtonKeyFocusBorder
		{
			"inset" "0 0 0 0"
			Left
			{
				"1"
				{
					"color" "Border.Selection"
					"offset" "0 0"
				}
			}
			Top
			{
				"1"
				{
					"color" "Border.Selection"
					"offset" "0 0"
				}
			}
			Right
			{
				"1"
				{
					"color" "Border.Selection"
					"offset" "0 0"
				}
			}
			Bottom
			{
				"1"
				{
					"color" "Border.Selection"
					"offset" "0 0"
				}
			}
		}

		ButtonDepressedBorder
		{
			"inset" "0 0 0 0"
			Left
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 1"
				}
			}

			Right
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "1 0"
				}
			}

			Top
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}

			Bottom
			{
				"1"
				{
					"color" "Border.DarkSolid"
					"offset" "0 0"
				}
			}
		}
	}

	//////////////////////// CUSTOM FONT FILES /////////////////////////////
	//
	// specifies all the custom (non-system) font files that need to be loaded to service the above described fonts
	CustomFontFiles
	{
		"1"		"resource/HALFLIFE2.ttf"
		"2"		"resource/HL2EP2.ttf"
		"3"		"resource/marlett.ttf"
	}
}
