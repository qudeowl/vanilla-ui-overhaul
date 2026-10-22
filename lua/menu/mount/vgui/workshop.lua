PANEL.Base = "DPanel"

local pnlRocket = vgui.RegisterFile( "addon_rocket.lua" )

local function wsSettings()
	local raw = cookie and cookie.GetString( "vuo_settings" )
	if ( !isstring( raw ) or raw == "" ) then
		local ok, legacy = pcall( file.Read, "vuo_settings.txt", "DATA" )
		raw = ( ok and isstring( legacy ) and legacy != "" ) and legacy or nil
	end
	return raw and util.JSONToTable( raw ) or {}
end

local function wsColor( str, r, g, b )
	if ( isstring( str ) ) then
		local cr, cg, cb = string.match( str, "(%d+)%s*,%s*(%d+)%s*,%s*(%d+)" )
		if ( cr and cg and cb ) then return tonumber( cr ), tonumber( cg ), tonumber( cb ) end
	end
	return r, g, b
end

local wsFont = "Helvetica"
if ( system and system.IsLinux and system.IsLinux() ) then
	wsFont = "DejaVu Sans"
elseif ( system and system.IsWindows and system.IsWindows() ) then
	wsFont = "Tahoma"
end

surface.CreateFont( "WorkshopLarge", {
	font		= wsFont,
	size		= 19,
	antialias	= true,
	weight		= 800
})

local cornerRadius = 8
local cornerPixels = {}

for py = 0, cornerRadius - 1 do
	for px = 0, cornerRadius - 1 do
		local d = math.sqrt( ( cornerRadius - px - 0.5 ) ^ 2 + ( cornerRadius - py - 0.5 ) ^ 2 )
		local a = 1 - math.abs( d - ( cornerRadius - 0.5 ) )
		if ( a > 0 ) then table.insert( cornerPixels, { px, py, a } ) end
	end
end

local function RoundedOutline( x, y, w, h, col )

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

local function Pill( x, y, w, h, frac, trackCol, fillCol )

	draw.RoundedBox( h * 0.5, x, y, w, h, trackCol )

	local fw = math.max( h, math.floor( w * math.Clamp( frac, 0, 1 ) ) )
	draw.RoundedBox( h * 0.5, x, y, fw, h, fillCol )

end

AccessorFunc( PANEL, "m_bDrawProgress", "DrawProgress", FORCE_BOOL )

function PANEL:Init()

	local cfg = wsSettings()
	local pr, pg, pb = wsColor( cfg.accentBlue, 35, 135, 237 )
	local sr, sg, sb = wsColor( cfg.accentGreen, 60, 200, 140 )

	local fontLarge, fontSmall = "WorkshopLarge", "DermaDefault"

	self.BoxColor		= Color( 8, 10, 18, 179 )
	self.BorderColor	= Color( 255, 255, 255, 4 )
	self.TrackColor		= Color( 255, 255, 255, 18 )
	self.FillColor		= Color( pr, pg, pb, 242 )
	self.TotalFillColor	= Color( sr, sg, sb, 210 )

	self.Label = self:Add( "DLabel" )
	self.Label:SetText( "..." )
	self.Label:SetFont( fontLarge )
	self.Label:SetTextColor( Color( 225, 238, 255, 235 ) )
	self.Label:Dock( TOP )
	self.Label:DockMargin( 16, 10, 16, 8 )
	self.Label:SetContentAlignment( 5 )

	self.ProgressLabel = self:Add( "DLabel" )
	self.ProgressLabel:SetText( "" )
	self.ProgressLabel:SetFont( fontSmall )
	self.ProgressLabel:SetContentAlignment( 4 )
	self.ProgressLabel:SetVisible( false )
	self.ProgressLabel:SetTextColor( Color( 210, 225, 248, 190 ) )

	self.TotalsLabel = self:Add( "DLabel" )
	self.TotalsLabel:SetText( "" )
	self.TotalsLabel:SetFont( fontSmall )
	self.TotalsLabel:SetContentAlignment( 4 )
	self.TotalsLabel:SetVisible( false )
	self.TotalsLabel:SetTextColor( Color( 210, 225, 248, 130 ) )

	self.Progress = 0
	self.TotalProgress = 0
	self.ShownProgress = 0
	self.ShownTotal = 0

	self:SetDrawProgress( false )

	self:SetAlpha( 0 )
	self:AlphaTo( 255, 0.25, 0 )

end

function PANEL:PerformLayout( wide )

	self:SetSize( 500, 80 )
	self:Center()
	self:AlignBottom( 16 )

	self.ProgressLabel:SetSize( 100, 16 )
	self.ProgressLabel:SetPos( wide - 100, 40 )

	self.TotalsLabel:SetSize( 100, 16 )
	self.TotalsLabel:SetPos( wide - 100, 58 )

end

function PANEL:Spawn()

	self:InvalidateLayout( true )

end

function PANEL:PrepareDownloading()

	if ( IsValid( self.Rocket ) ) then self.Rocket:Remove() end

	self.Rocket = self:Add( pnlRocket )
	self.Rocket:Dock( LEFT )
	self.Rocket:MoveToBack()
	self.Rocket:DockMargin( 8, 0, 8, 0 )

end

function PANEL:StartDownloading( id, iImageID, title, iSize )

	self.Label:SetText( language.GetPhrase( "ugc.downloadingX" ):format( title ) )

	self.Rocket:Charging( id, iImageID )

	self.ProgressLabel:Show()
	self.ProgressLabel:SetText( "" )

	self.TotalsLabel:Show()

	self:SetDrawProgress( true )
	self:UpdateProgress( 0, iSize )

end

function PANEL:FinishedDownloading( id )

	self.Progress = -1

end

function PANEL:SetMessage( msg )

	self.Label:SetText( msg )

	self:SetDrawProgress( false )

end

function PANEL:Paint( wide, tall )

	draw.RoundedBox( cornerRadius, 0, 0, wide, tall, self.BoxColor )
	RoundedOutline( 0, 0, wide, tall, self.BorderColor )

	if ( !self:GetDrawProgress() ) then return end

	local x = 112
	local w = wide - 228
	local step = math.min( FrameTime() * 10, 1 )

	if ( self.TotalProgress < self.ShownTotal ) then self.ShownTotal = self.TotalProgress end
	self.ShownTotal = Lerp( step, self.ShownTotal, self.TotalProgress )
	Pill( x, 64, w, 4, self.ShownTotal, self.TrackColor, self.TotalFillColor )

	local currentProgress = self.Progress

	if ( currentProgress >= 0 ) then
		if ( currentProgress < self.ShownProgress ) then self.ShownProgress = currentProgress end
		self.ShownProgress = Lerp( step, self.ShownProgress, currentProgress )
		Pill( x, 44, w, 8, self.ShownProgress, self.TrackColor, self.FillColor )
	else
		Pill( x, 44, w, 8, 1, self.TrackColor, self.FillColor )
	end

end

function PANEL:UpdateProgress( downloaded, expected )

	if ( expected <= 0 ) then
		self.Progress = 0
		self.ProgressLabel:SetText( "" )
		return
	end

	self.Progress = downloaded / expected

	if ( self.Progress > 0 ) then
		self.ProgressLabel:SetText( language.GetPhrase( "ugc.XoutofY" ):format( Format( "%.0f%%", self.Progress * 100 ), string.NiceSize( expected ) ) )
	else
		self.ProgressLabel:SetText( string.NiceSize( expected ) )
	end

end

function PANEL:ExtractProgress( title, percent )

	self.Label:SetText( language.GetPhrase( "ugc.extractingX" ):format( title ) )
	self.Progress = percent / 100

	if ( self.Progress > 0 ) then
		self.ProgressLabel:SetText( Format( "%.0f%%", percent ) )
	else
		self.ProgressLabel:SetText( "0%" )
	end

end

function PANEL:UpdateTotalProgress( iCurrent, iTotal )

	self.TotalsLabel:SetText( language.GetPhrase( "ugc.addonXofY" ):format( iCurrent, iTotal ) )
	self.TotalProgress = iCurrent / iTotal

end

function PANEL:SubscriptionsProgress( iCurrent, iTotal )

	self.Label:SetText( "#ugc.fetching" )
	self:SetDrawProgress( true )

	self.Progress = iCurrent / iTotal

	self.ProgressLabel:Show()
	self.ProgressLabel:SetText( language.GetPhrase( "ugc.XofY" ):format( iCurrent, iTotal ) )

end
