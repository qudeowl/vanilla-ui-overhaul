
local function uoSettingsRaw()
	local raw = cookie and cookie.GetString( "vuo_settings" )
	if ( isstring( raw ) and raw != "" ) then return raw end
	local ok, legacy = pcall( file.Read, "vuo_settings.txt", "DATA" )
	if ( ok and isstring( legacy ) and legacy != "" ) then return legacy end
end

local function uoSettings()
	local raw = uoSettingsRaw()
	local cfg = raw and util.JSONToTable( raw ) or nil
	return istable( cfg ) and cfg or {}
end

local function uoColor( str, r, g, b )
	if ( isstring( str ) ) then
		local cr, cg, cb = string.match( str, "(%d+)%s*,%s*(%d+)%s*,%s*(%d+)" )
		if ( cr and cg and cb ) then return tonumber( cr ), tonumber( cg ), tonumber( cb ) end
	end
	return r, g, b
end

local uoSounds = {
	focus	= { "vuo_sounds/menu_focus.wav", "garrysmod/ui_hover.wav" },
	accept	= { "vuo_sounds/menu_accept.wav", "garrysmod/ui_click.wav" },
	back	= { "vuo_sounds/menu_back.wav", "garrysmod/ui_return.wav" }
}

local cornerRadius = 8
local cornerPixels = {}

for py = 0, cornerRadius - 1 do
	for px = 0, cornerRadius - 1 do
		local d = math.sqrt( ( cornerRadius - px - 0.5 ) ^ 2 + ( cornerRadius - py - 0.5 ) ^ 2 )
		local a = 1 - math.abs( d - ( cornerRadius - 0.5 ) )
		if ( a > 0 ) then table.insert( cornerPixels, { px, py, a } ) end
	end
end

local function uoOutline( x, y, w, h, col )

	local r = cornerRadius

	surface.SetDrawColor( col.r, col.g, col.b, col.a )
	surface.DrawRect( x + r, y, w - r * 2, 1 )
	surface.DrawRect( x + r, y + h - 1, w - r * 2, 1 )
	surface.DrawRect( x, y + r, 1, h - r * 2 )
	surface.DrawRect( x + w - 1, y + r, 1, h - r * 2 )

	for _, p in ipairs( cornerPixels ) do
		surface.SetDrawColor( col.r, col.g, col.b, col.a * p[3] )
		surface.DrawRect( x + p[1], y + p[2], 1, 1 )
		surface.DrawRect( x + w - 1 - p[1], y + p[2], 1, 1 )
		surface.DrawRect( x + p[1], y + h - 1 - p[2], 1, 1 )
		surface.DrawRect( x + w - 1 - p[1], y + h - 1 - p[2], 1, 1 )
	end

end

local function uoAccentLine( x, y, w, a, b )

	for i = 0, w - 1, 2 do
		local f = ( i + 1 ) / w
		local r, g, bl, al
		if ( f < 0.3 ) then
			r, g, bl, al = a.r, a.g, a.b, 0.65 * f / 0.3
		elseif ( f < 0.7 ) then
			local k = ( f - 0.3 ) / 0.4
			r, g, bl, al = Lerp( k, a.r, b.r ), Lerp( k, a.g, b.g ), Lerp( k, a.b, b.b ), Lerp( k, 0.65, 0.55 )
		else
			r, g, bl, al = b.r, b.g, b.b, 0.55 * ( 1 - f ) / 0.3
		end
		local sw = math.min( 2, w - i )
		surface.SetDrawColor( r, g, bl, al * 255 )
		surface.DrawRect( x + i, y, sw, 1 )
		surface.SetDrawColor( a.r, a.g, a.b, al * 40 )
		surface.DrawRect( x + i, y - 1, sw, 1 )
		surface.DrawRect( x + i, y + 1, sw, 1 )
		surface.SetDrawColor( a.r, a.g, a.b, al * 16 )
		surface.DrawRect( x + i, y - 2, sw, 1 )
		surface.DrawRect( x + i, y + 2, sw, 1 )
	end

end

local function uoCircle( cx, cy, radius, col )
	local poly = {}
	for i = 0, 24 do
		local a = math.rad( ( i / 24 ) * 360 )
		poly[ i + 1 ] = { x = cx + math.cos( a ) * radius, y = cy + math.sin( a ) * radius }
	end
	surface.SetDrawColor( col.r, col.g, col.b, col.a )
	draw.NoTexture()
	surface.DrawPoly( poly )
end

local function uoTheme()

	local cfg = uoSettings()
	local pr, pg, pb = uoColor( cfg.accentBlue, 35, 135, 237 )
	local sr, sg, sb = uoColor( cfg.accentGreen, 60, 200, 140 )
	local custom = cfg.customSounds != false

	local t = {
		frame		= Color( 10, 12, 18, 242 ),
		tooltip		= Color( 18, 21, 30, 250 ),
		border		= Color( 255, 255, 255, 4 ),
		lineA		= Color( pr, pg, pb ),
		lineB		= Color( sr, sg, sb ),
		title		= Color( 225, 238, 255, 235 ),
		text		= Color( 200, 212, 230, 220 ),
		field		= Color( 255, 255, 255, 10 ),
		button		= Color( 255, 255, 255, 16 ),
		buttonOff	= Color( 255, 255, 255, 7 ),
		primary		= Color( pr, pg, pb, 205 ),
		secondary	= Color( sr, sg, sb, 225 ),
		danger		= Color( 180, 40, 40, 170 ),
		dangerDown	= Color( 140, 30, 30, 200 ),
		buttonText	= Color( 235, 240, 250, 255 ),
		buttonTextOff = Color( 210, 225, 248, 90 ),
		accent		= Color( pr, pg, pb, 255 )
	}

	t.play = function( kind )
		local s = uoSounds[ kind ]
		if ( !s ) then return end
		if ( custom and file.Exists( "sound/" .. s[1], "GAME" ) ) then
			surface.PlaySound( s[1] )
		else
			surface.PlaySound( s[2] )
		end
	end

	return t

end

local function uoSkinFrame( frame, t )

	frame.VUO = t

	frame.lblTitle:SetTextColor( t.title )

	frame.btnMaxim:SetVisible( false )
	frame.btnMinim:SetVisible( false )

	frame.btnClose.Paint = function( s, w, h )
		if ( s:IsHovered() ) then draw.RoundedBox( 5, 0, 0, w, h, t.danger ) end
		local c = s:IsHovered() and t.buttonText or t.text
		surface.SetDrawColor( c.r, c.g, c.b, c.a )
		local p = 7
		for i = 0, 1 do
			surface.DrawLine( p, p + i, w - p, h - p + i )
			surface.DrawLine( w - p, p + i, p, h - p + i )
		end
	end

	local closeEnter = frame.btnClose.OnCursorEntered
	frame.btnClose.OnCursorEntered = function( s ) if ( closeEnter ) then closeEnter( s ) end t.play( "focus" ) end

	local closeClick = frame.btnClose.DoClick
	frame.btnClose.DoClick = function( s ) t.play( "back" ) closeClick( s ) end

	frame.Paint = function( s, w, h )
		draw.RoundedBox( cornerRadius, 0, 0, w, h, t.frame )
		uoOutline( 0, 0, w, h, t.border )
		uoAccentLine( 1, 32, w - 2, t.lineA, t.lineB )
		return true
	end

end

local function uoLayoutFrame( frame, w )

	frame.lblTitle:SetPos( 14, 6 )
	frame.lblTitle:SetSize( w - 60, 22 )

	frame.btnClose:SetPos( w - 34, 6 )
	frame.btnClose:SetSize( 24, 22 )

end

local function uoSkinButton( btn, t, hover, down )

	btn.Paint = function( s, w, h )
		local col = t.button
		if ( !s:IsEnabled() ) then
			col = t.buttonOff
		elseif ( s:IsDown() ) then
			col = down
		elseif ( s:IsHovered() ) then
			col = hover
		end
		draw.RoundedBox( 6, 0, 0, w, h, col )
	end

	btn.UpdateColours = function( s, skin )
		if ( !s:IsEnabled() ) then return s:SetTextStyleColor( t.buttonTextOff ) end
		return s:SetTextStyleColor( t.buttonText )
	end

	local enter = btn.OnCursorEntered
	btn.OnCursorEntered = function( s )
		if ( enter ) then enter( s ) end
		if ( s:IsEnabled() ) then t.play( "focus" ) end
	end

end

local function uoWrapClick( btn, t, kind )
	local click = btn.DoClick
	btn.DoClick = function( s )
		if ( s:IsEnabled() ) then t.play( kind ) end
		click( s )
	end
end

local TOOLTIP = {}

function TOOLTIP:OpenForPanel( panel )

	local frame = panel
	while ( IsValid( frame ) and !frame.VUO ) do frame = frame:GetParent() end

	if ( IsValid( frame ) ) then
		self.VUO = frame.VUO
		self:SetParent( frame )
		self:SetDrawOnTop( false )
		self:SetZPos( 100 )
		self:SetTextColor( frame.VUO.title )
	end

	DTooltip.OpenForPanel( self, panel )

end

function TOOLTIP:PerformLayout()

	local w, h = self:GetContentSize()
	self:SetSize( w + 16, h + 10 )
	self:SetContentAlignment( 5 )

end

function TOOLTIP:PositionTooltip()

	if ( !self.VUO ) then return DTooltip.PositionTooltip( self ) end

	if ( !IsValid( self.TargetPanel ) ) then
		self:Close()
		return
	end

	self:PerformLayout()

	local parent = self:GetParent()
	local w, h = self:GetSize()
	local tx, ty = self.TargetPanel:LocalToScreen( 0, 0 )
	local x, y = parent:ScreenToLocal( tx + self.TargetPanel:GetWide() * 0.5 - w * 0.5, ty - h - 6 )

	self:SetPos( math.Clamp( x, 6, parent:GetWide() - w - 6 ), math.max( y, 6 ) )

end

function TOOLTIP:Paint( w, h )

	if ( !self.VUO ) then return DTooltip.Paint( self, w, h ) end

	self:PositionTooltip()
	draw.RoundedBox( cornerRadius, 0, 0, w, h, self.VUO.tooltip )
	uoOutline( 0, 0, w, h, self.VUO.border )

end

vgui.Register( "VUOTooltip", TOOLTIP, "DTooltip" )

local PANEL_Browser = {}

PANEL_Browser.Base = "DFrame"

function PANEL_Browser:Init()

	self.HTML = vgui.Create( "HTML", self )

	if ( !self.HTML ) then
		print( "SteamOverlayReplace: Failed to create HTML element" )
		self:Remove()
		return
	end

	self.HTML:Dock( FILL )

	self:SetTitle( "#openurl.overlay_replacement_title" )
	self:SetSize( ScrW() * 0.75, ScrH() * 0.75 )
	self:SetSizable( true )

	uoSkinFrame( self, uoTheme() )
	self:DockPadding( 6, 38, 6, 6 )

	self:Center()
	self:MakePopup()

end

function PANEL_Browser:PerformLayout( w, h )

	DFrame.PerformLayout( self, w, h )
	uoLayoutFrame( self, w or self:GetWide() )

end

function PANEL_Browser:SetURL( url )

	self.HTML:OpenURL( url )

end

function GMOD_OpenURLNoOverlay( url )

	local BrowserInst = vgui.CreateFromTable( PANEL_Browser )
	BrowserInst:SetURL( url )

	timer.Simple( 0, function()
		if ( !gui.IsGameUIVisible() ) then gui.ActivateGameUI() end
	end )

end

local RememberedDenials = {}

local PANEL = {}

PANEL.Base = "DFrame"

function PANEL:Init()

	local t = uoTheme()

	self.Type = "openurl"

	self:SetTitle( "#openurl.title" )

	self.Garble = vgui.Create( "DLabel", self )
	self.Garble:SetText( "#openurl.text" )
	self.Garble:SetContentAlignment( 5 )
	self.Garble:Dock( TOP )
	self.Garble:SetTextColor( t.text )
	self.Garble:SetTall( 22 )
	self.Garble:DockMargin( 0, 0, 0, 6 )

	self.URL = vgui.Create( "DTextEntry", self )
	self.URL:SetEnabled( false )
	self.URL:SetHeight( 28 )
	self.URL:Dock( TOP )
	self.URL.Paint = function( s, w, h )
		draw.RoundedBox( 6, 0, 0, w, h, t.field )
		s:DrawTextEntryText( t.title, t.accent, t.title )
	end

	self.URLCopyBtn = vgui.Create( "DImageButton", self.URL )
	self.URLCopyBtn:SetImage( "icon16/page_copy.png" )
	self.URLCopyBtn:SetTooltip( "#spawnmenu.menu.copy" )
	self.URLCopyBtn:SetTooltipPanelOverride( "VUOTooltip" )
	self.URLCopyBtn:Dock( RIGHT )
	self.URLCopyBtn:SetWidth( 16 )
	self.URLCopyBtn:SetStretchToFit( false )
	self.URLCopyBtn:DockMargin( 0, 0, 26, 0 )
	self.URLCopyBtn.DoClick = function() t.play( "accept" ) SetClipboardText( self.URL:GetText() ) end

	self.CustomPanel = vgui.Create( "DLabel", self )
	self.CustomPanel:Dock( TOP )
	self.CustomPanel:SetContentAlignment( 5 )
	self.CustomPanel:DockMargin( 0, 8, 0, 0 )
	self.CustomPanel:SetVisible( false )
	self.CustomPanel:SetTextColor( t.title )
	self.CustomPanel.Color = Color( 0, 0, 0, 0 )
	self.CustomPanel.Paint = function( s, w, h )
		if ( s.Color.a == 0 ) then return end
		draw.RoundedBox( 6, 0, 0, w, h, Color( s.Color.r, s.Color.g, s.Color.b, 40 ) )
	end

	local sizeToContents = self.CustomPanel.SizeToContents
	self.CustomPanel.SizeToContents = function( s )
		sizeToContents( s )
		s:SetTall( s:GetTall() + 12 )
	end

	self.Buttons = vgui.Create( "Panel", self )
	self.Buttons:Dock( TOP )
	self.Buttons:DockMargin( 0, 12, 0, 0 )
	self.Buttons:DockPadding( 0, 0, 0, 14 )
	self.Buttons:SetTall( 44 )

	self.Disconnect = vgui.Create( "DButton", self.Buttons )
	self.Disconnect:SetText( "#openurl.disconnect" )
	self.Disconnect.DoClick = function() self:DoNope() RunConsoleCommand( "disconnect" ) end
	self.Disconnect:Dock( LEFT )
	uoSkinButton( self.Disconnect, t, t.danger, t.dangerDown )
	self.Disconnect:SizeToContentsX( 24 )

	self.Nope = vgui.Create( "DButton", self.Buttons )
	self.Nope:SetText( "#openurl.nope" )
	self.Nope.DoClick = function() self:DoNope() end
	self.Nope:DockMargin( 0, 0, 0, 0 )
	self.Nope:Dock( RIGHT )
	uoSkinButton( self.Nope, t, t.primary, t.secondary )
	self.Nope:SizeToContentsX( 24 )
	self.Nope:SetWide( math.max( self.Nope:GetWide(), 80 ) )

	self.Yes = vgui.Create( "DButton", self.Buttons )
	self.Yes:SetText( "#openurl.yes" )
	self.Yes.DoClick = function() self:DoYes() end
	self.Yes:DockMargin( 0, 0, 8, 0 )
	self.Yes:Dock( RIGHT )
	uoSkinButton( self.Yes, t, t.primary, t.secondary )
	self.Yes:SizeToContentsX( 24 )
	self.Yes:SetWide( math.max( self.Yes:GetWide(), 80 ) )

	self.YesPerma = vgui.Create( "DCheckBoxLabel", self.Buttons )
	self.YesPerma:SetText( "#openurl.yes_remember" )
	self.YesPerma:SetTextColor( t.text )
	self.YesPerma:DockMargin( 0, 0, 16, 0 )
	self.YesPerma:Dock( RIGHT )
	self.YesPerma:SetVisible( false )
	self.YesPerma.Button.Paint = function( s, w, h )
		local cx, cy = w * 0.5, h * 0.5
		local r = math.min( w, h ) * 0.5
		if ( s:GetChecked() ) then
			uoCircle( cx, cy, r, t.accent )
		else
			uoCircle( cx, cy, r, Color( 255, 255, 255, 102 ) )
			uoCircle( cx, cy, r - 1, Color( 14, 14, 18, 255 ) )
		end
	end
	self.YesPerma.OnChange = function( s, val ) t.play( val and "accept" or "back" ) end

	self.Garble:SetZPos( 1 )
	self.URL:SetZPos( 2 )
	self.CustomPanel:SetZPos( 3 )
	self.Buttons:SetZPos( 4 )

	uoWrapClick( self.Nope, t, "back" )
	uoWrapClick( self.Yes, t, "accept" )
	uoWrapClick( self.Disconnect, t, "back" )

	uoSkinFrame( self, t )
	self:DockPadding( 14, 42, 14, 0 )

	self:SetSize( 680, 104 )
	self:Center()
	self:MakePopup()
	self:DoModal()

	self:SetAlpha( 0 )
	self:AlphaTo( 255, 0.2, 0 )

	hook.Add( "Think", self, self.AlwaysThink )

	if ( !IsInGame() ) then self.Disconnect:SetVisible( false ) end

end

function PANEL:LoadServerInfo()

	self.CustomPanel:SetVisible( true )
	self.CustomPanel:SetText( "#askconnect.loading" )
	self.CustomPanel:SizeToContents()

	serverlist.PingServer( self:GetURL(), function( ping, name, desc, map, players, maxplayers, bot, pass, lp, ip, gamemode )
		if ( !IsValid( self ) ) then return end

		if ( !ping ) then
			self.CustomPanel.Color = Color( 200, 50, 50 )
			self.CustomPanel:SetText( "#askconnect.no_response" )
		else
			self.CustomPanel:SetText( string.format( "%s\n%i/%i players | %s | %s | %ims", name, players, maxplayers, map, desc, ping ) )
		end
		self.CustomPanel:SizeToContents()
	end )

end

function PANEL:DisplayPermissionInfo()

	self.CustomPanel.Color = Color( 200, 200, 200 )
	self.CustomPanel:SetVisible( true )
	self.CustomPanel:SetDark( true )
	self.CustomPanel:SetText( "\n" .. language.GetPhrase( "permission." .. self:GetURL() ) .. "\n" .. language.GetPhrase( "permission." .. self:GetURL() .. ".help" ) .. "\n" )
	self.CustomPanel:SizeToContents()

end

function PANEL:AlwaysThink()

	if ( SysTime() - self.StartTime > 0.1 and self.Type == "askconnect" and !self.CustomPanel:IsVisible() ) then
		self:LoadServerInfo()
	end

	if ( self.StartTime + 1 > SysTime() ) then
		return
	end

	if ( !self.Yes:IsEnabled() ) then
		self.Yes:SetEnabled( true )
	end

	if ( !gui.IsGameUIVisible() ) then
		self:Remove()
	end

end

function PANEL:PerformLayout( w, h )

	DFrame.PerformLayout( self, w, h )
	uoLayoutFrame( self, w or self:GetWide() )

	self:SizeToChildren( false, true )

end

function PANEL:SetURL( url )

	self.URL:SetText( url )

	self.StartTime = SysTime()
	self.Yes:SetEnabled( false )
	self.CustomPanel:SetVisible( false )
	self.CustomPanel.Color = Color( 0, 0, 0, 0 )
	self:InvalidateLayout()

	if ( self.Type == "permission" ) then
		self:DisplayPermissionInfo()
	end

end

function PANEL:GetURL()

	return self.URL:GetText()

end

function PANEL:DoNope()

	self:Remove()
	gui.HideGameUI()

	local remember = self.YesPerma:GetChecked()
	if ( remember ) then
		RememberedDenials[ self.uniquePermID ] = true
	end
end

function PANEL:DoYes()

	if ( self.StartTime + 1 > SysTime() ) then
		return
	end

	local saveYes = self.YesPerma:GetChecked()
	self:DoYesAction( !saveYes )
	self:Remove()
	gui.HideGameUI()

end

function PANEL:DoYesAction( bSessionOnly )

	if ( self.Type == "openurl" ) then
		gui.OpenURL( self.URL:GetText() )
	elseif ( self.Type == "askconnect" ) then
		permissions.Grant( "connect", bSessionOnly )
		permissions.Connect( self.URL:GetText() )
	elseif ( self.Type == "permission" ) then
		permissions.Grant( self.URL:GetText(), bSessionOnly )
	else
		ErrorNoHaltWithStack( "Unhandled confirmation type '" .. tostring( self.Type ) .. "'!" )
	end

end

function PANEL:SetType( t )

	self.Type = t

	self:SetTitle( "#" .. t .. ".title" )
	self.Garble:SetText( "#" .. t .. ".text" )

	if ( self.Type == "permission" or self.Type == "askconnect" ) then
		self.YesPerma:SetVisible( true )
	end

end

local PanelInst = nil
local function OpenConfirmationDialog( address, confirm_type )

	local permID = tostring( confirm_type ) .. "|" .. tostring( address ) .. "|" .. tostring( engine.CurrentServerAddress() )
	if ( RememberedDenials[ permID ] ) then
		print( "Ignoring request for denied permission " .. tostring( confirm_type ) .. " to " .. tostring( address ) )
		return
	end

	if ( IsValid( PanelInst ) and PanelInst:GetURL() == address ) then return end
	if ( !IsValid( PanelInst ) ) then PanelInst = vgui.CreateFromTable( PANEL ) end

	PanelInst.uniquePermID = permID
	PanelInst:SetType( confirm_type )
	PanelInst:SetURL( address )

	timer.Simple( 0, function()
		if ( !gui.IsGameUIVisible() ) then gui.ActivateGameUI() end
	end )

end

function RequestOpenURL( url )

	OpenConfirmationDialog( url, "openurl" )

end
function RequestConnectToServer( serverip )

	if ( permissions.IsGranted( "connect" ) ) then
		permissions.Connect( serverip )
	else
		OpenConfirmationDialog( serverip, "askconnect" )
	end

end
function RequestPermission( perm )

	OpenConfirmationDialog( perm, "permission" )

end
