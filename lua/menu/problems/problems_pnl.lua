include( "problem_lua.lua" )
include( "problem_generic.lua" )
include( "permissions.lua" )

local THEME = {

    frameBg      = Color( 10,  10,  14,  220 ),

    contentBg    = Color( 8,   8,   12,  160 ),

    tabBarBg     = Color( 8,   8,   12,  140 ),

    frameBorder  = Color( 255, 255, 255, 4   ),

    tabActive    = Color( 35,  135, 237, 35  ),

    tabInactive  = Color( 0,   0,   0,   0   ),

    tabHover     = Color( 255, 255, 255, 15  ),

    accent       = Color( 35,  135, 237, 220 ),

    text         = Color( 210, 225, 248, 255 ),

    closeHover   = Color( 180, 40,  40,  180 ),

    titleBg      = Color( 35,  135, 237, 25  ),
}

local function nfSettingsRaw()
    local raw = cookie and cookie.GetString( "vuo_settings" )
    if ( isstring( raw ) and raw ~= "" ) then return raw end
    local ok, legacy = pcall( file.Read, "vuo_settings.txt", "DATA" )
    if ( ok and isstring( legacy ) and legacy ~= "" ) then return legacy end
end

local function nfReadAccents()
    local blue  = { 35, 135, 237 }
    local green = { 60, 200, 140 }
    local function parse( str, fallback )
        if ( !isstring( str ) ) then return fallback end
        local r, g, b = string.match( str, "(%d+)%s*,%s*(%d+)%s*,%s*(%d+)" )
        if ( r and g and b ) then return { tonumber( r ), tonumber( g ), tonumber( b ) } end
        return fallback
    end
    local raw = nfSettingsRaw()
    if ( raw ) then
        local cfg = util.JSONToTable( raw )
        if ( cfg ) then
            blue  = parse( cfg.accentBlue,  blue )
            green = parse( cfg.accentGreen, green )
        end
    end
    return blue, green
end

local function nfCustomSounds()
    local raw = nfSettingsRaw()
    if ( raw ) then
        local cfg = util.JSONToTable( raw )
        if ( cfg and cfg.customSounds ~= nil ) then return cfg.customSounds and true or false end
    end
    return true
end

local blurMat = Material( "pp/blurscreen" )
local function DrawBlur( panel, amount )

    if ( !render.UpdateScreenEffectTexture ) then return end
    if ( !render.SupportsPixelShaders_2_0() ) then return end
    local ok = pcall( function()
        local x, y = panel:LocalToScreen( 0, 0 )
        surface.SetDrawColor( 255, 255, 255, 255 )
        surface.SetMaterial( blurMat )
        for i = 1, 4 do
            blurMat:SetFloat( "$blur", ( i / 4 ) * ( amount or 8 ) )
            blurMat:Recompute()
            render.UpdateScreenEffectTexture()
            surface.DrawTexturedRect( -x, -y, ScrW(), ScrH() )
        end
    end )

end

local function nfDrawCircle( cx, cy, radius, col )
    local segs = 32
    local poly = {}
    for i = 0, segs do
        local a = math.rad( ( i / segs ) * 360 )
        poly[ i + 1 ] = { x = cx + math.cos( a ) * radius, y = cy + math.sin( a ) * radius }
    end
    surface.SetDrawColor( col.r, col.g, col.b, col.a )
    draw.NoTexture()
    surface.DrawPoly( poly )
end

local nfCorners = {}

local function nfOutline( x, y, w, h, r, col )
    local px = nfCorners[ r ]
    if ( !px ) then
        px = {}
        for cy = 0, r - 1 do
            for cx = 0, r - 1 do
                local d = math.sqrt( ( r - cx - 0.5 ) ^ 2 + ( r - cy - 0.5 ) ^ 2 )
                local a = 1 - math.abs( d - ( r - 0.5 ) )
                if ( a > 0 ) then px[ #px + 1 ] = { cx, cy, a } end
            end
        end
        nfCorners[ r ] = px
    end
    surface.SetDrawColor( col.r, col.g, col.b, col.a )
    surface.DrawRect( x + r, y, w - r * 2, 1 )
    surface.DrawRect( x + r, y + h - 1, w - r * 2, 1 )
    surface.DrawRect( x, y + r, 1, h - r * 2 )
    surface.DrawRect( x + w - 1, y + r, 1, h - r * 2 )
    for _, p in ipairs( px ) do
        surface.SetDrawColor( col.r, col.g, col.b, col.a * p[3] )
        surface.DrawRect( x + p[1], y + p[2], 1, 1 )
        surface.DrawRect( x + w - 1 - p[1], y + p[2], 1, 1 )
        surface.DrawRect( x + p[1], y + h - 1 - p[2], 1, 1 )
        surface.DrawRect( x + w - 1 - p[1], y + h - 1 - p[2], 1, 1 )
    end
end

local function nfAccentLine( x, y, w, a, b )
    for i = 0, w - 1, 2 do
        local f = ( i + 1 ) / w
        local r, g, bl, al
        if ( f < 0.3 ) then
            r, g, bl, al = a[1], a[2], a[3], 0.65 * f / 0.3
        elseif ( f < 0.7 ) then
            local k = ( f - 0.3 ) / 0.4
            r, g, bl, al = Lerp( k, a[1], b[1] ), Lerp( k, a[2], b[2] ), Lerp( k, a[3], b[3] ), Lerp( k, 0.65, 0.55 )
        else
            r, g, bl, al = b[1], b[2], b[3], 0.55 * ( 1 - f ) / 0.3
        end
        local sw = math.min( 2, w - i )
        surface.SetDrawColor( r, g, bl, al * 255 )
        surface.DrawRect( x + i, y, sw, 1 )
        surface.SetDrawColor( a[1], a[2], a[3], al * 40 )
        surface.DrawRect( x + i, y - 1, sw, 1 )
        surface.DrawRect( x + i, y + 1, sw, 1 )
        surface.SetDrawColor( a[1], a[2], a[3], al * 16 )
        surface.DrawRect( x + i, y - 2, sw, 1 )
        surface.DrawRect( x + i, y + 2, sw, 1 )
    end
end

local PANEL = {}

function PANEL:Init()

    local accBlue, accGreen = nfReadAccents()
    local function PRIMARY( a )   return Color( accBlue[1],  accBlue[2],  accBlue[3],  a ) end
    local function SECONDARY( a ) return Color( accGreen[1], accGreen[2], accGreen[3], a ) end
    THEME.tabActive = PRIMARY( 35 )
    THEME.accent    = PRIMARY( 220 )
    THEME.titleBg   = PRIMARY( 25 )

    local sndOn = nfCustomSounds()
    local function nfPlay( f ) if ( sndOn ) then surface.PlaySound( f ) end end
    self._nfPlay = nfPlay
    self._openedAt = SysTime()

    self:SetSize( ScrW(), ScrH() )
    self:MakePopup()

    self:SetAlpha( 0 )
    self:AlphaTo( 255, 0.28, 0 )
    nfPlay( "vuo_sounds/menu_accept.wav" )

    self.ErrorPanels  = {}
    self.ProblemPanels = {}

    local ProblemsFrame = vgui.Create( "DPanel", self )

    local panelW = 700
    local margin = 25
    local panelH = ( ScrH() - 55 ) - ( margin * 2 )

    ProblemsFrame:SetSize( panelW, panelH )
    local px, py = ScrW() - panelW - margin, margin
    if ( istable( VUO_ProblemsBtn ) and #VUO_ProblemsBtn == 4 ) then
        local bl, bt, brr, bb = VUO_ProblemsBtn[1], VUO_ProblemsBtn[2], VUO_ProblemsBtn[3], VUO_ProblemsBtn[4]
        local gap = 6
        px = brr - panelW
        if ( px < gap ) then px = bl end
        px = math.Clamp( px, gap, ScrW() - panelW - gap )
        py = bb + gap
        if ( py + panelH > ScrH() - gap ) then py = bt - panelH - gap end
        py = math.Clamp( py, gap, ScrH() - panelH - gap )
    end
    ProblemsFrame:SetPos( px, py )
    ProblemsFrame.OnRemove = function() self:Remove() end

    ProblemsFrame.Paint = function( frm, w, h )
        DrawBlur( frm, 6 )
        draw.RoundedBox( 10, 0, 0, w, h, THEME.frameBg )
        nfOutline( 0, 0, w, h, 10, THEME.frameBorder )

        nfAccentLine( 1, 26, w - 2, accBlue, accGreen )

        draw.SimpleText( "Problems", "DermaDefault", 10, 8, Color(180, 185, 195, 140), TEXT_ALIGN_LEFT, TEXT_ALIGN_TOP )
    end

    local CloseBtn = ProblemsFrame:Add( "DButton" )
    CloseBtn:SetSize( 22, 18 )
    CloseBtn:SetPos( panelW - 26, 4 )
    CloseBtn:SetText( "✕" )
    CloseBtn:SetFont( "DermaDefault" )
    CloseBtn:SetTextColor( Color( 180, 185, 195, 160 ) )
    CloseBtn.Paint = function( s, w, h )
        if s:IsHovered() then
            draw.RoundedBox( 3, 0, 0, w, h, THEME.closeHover )
            s:SetTextColor( Color( 255, 255, 255, 255 ) )
        else
            s:SetTextColor( Color( 180, 185, 195, 160 ) )
        end
    end
    CloseBtn.OnCursorEntered = function() nfPlay( "vuo_sounds/menu_focus.wav" ) end
    CloseBtn.DoClick = function() self:FadeRemove() end

    ProblemsFrame:DockPadding( 8, 34, 8, 8 )

    local sheet = vgui.Create( "DPropertySheet", ProblemsFrame )
    sheet:Dock( FILL )
    self.Tabs = sheet

    sheet.Paint = function( s, w, h )
        draw.RoundedBoxEx( 4, 0, 22, w, h - 22, THEME.contentBg, false, false, true, true )
    end

    local luaErrorWrapper = vgui.Create( "DPanel", ProblemsFrame )
    luaErrorWrapper.Paint = function() end
    luaErrorWrapper:DockPadding( 0, 10, 0, 0 )

    local luaErrorContainer = luaErrorWrapper:Add( "Panel" )
    luaErrorContainer:Dock( FILL )
    luaErrorContainer.Paint = function() end

    local luaErrorList = luaErrorContainer:Add( "DScrollPanel" )
    luaErrorList:Dock( FILL )

    local luaStrictMode = luaErrorContainer:Add( "DCheckBoxLabel" )
    luaStrictMode:Dock( BOTTOM )
    luaStrictMode:SetText( "#lua_strict" )
    luaStrictMode:SetConVar( "lua_strict" )
    luaStrictMode:SetDark( false )
    luaStrictMode:SetTextColor( THEME.text )
    luaStrictMode:SetTall( 22 )
    luaStrictMode.Paint = function() end
    luaStrictMode.OnChange = function( s, val )
        if ( !s._nfSndReady ) then return end
        nfPlay( val and "vuo_sounds/menu_accept.wav" or "vuo_sounds/menu_back.wav" )
    end
    timer.Simple( 0.2, function() if ( IsValid( luaStrictMode ) ) then luaStrictMode._nfSndReady = true end end )

    luaStrictMode.PerformLayout = function( s, w, h )
        local children = s:GetChildren()
        for _, child in ipairs( children ) do
            if child.ClassName == "DCheckBox" then
                local cbSize = 14
                child:SetSize( cbSize, cbSize )
                child:SetPos( 2, math.floor((h - cbSize) / 2) )
            elseif child.ClassName == "DLabel" then
                child:SetPos( 20, 0 )
                child:SetSize( w - 20, h )
            end
        end
    end

    local function styleCheckbox( lbl )
        if not IsValid( lbl ) then return end
        for _, child in ipairs( lbl:GetChildren() ) do
            if child.ClassName == "DCheckBox" then
                child.Paint = function( s, w, h )

                    local checked = s:GetChecked()
                    local cx, cy = w * 0.5, h * 0.5
                    local R = math.min( w, h ) * 0.5
                    if checked then
                        nfDrawCircle( cx, cy, R, PRIMARY( 255 ) )
                    else
                        nfDrawCircle( cx, cy, R,     Color( 255, 255, 255, 102 ) )
                        nfDrawCircle( cx, cy, R - 1, Color( 14,  14,  18,  255 ) )
                    end
                end
                return
            end
        end
    end
    timer.Simple( 0,   function() styleCheckbox( luaStrictMode ) end )
    timer.Simple( 0.1, function() styleCheckbox( luaStrictMode ) end )

    sheet:AddSheet( "#problems.lua_errors", luaErrorWrapper, "icon16/error.png" )
    self.LuaErrorList = luaErrorList

    local problemsWrapper = vgui.Create( "DPanel", ProblemsFrame )
    problemsWrapper.Paint = function() end
    problemsWrapper:DockPadding( 0, 10, 0, 0 )
    local problemsList = problemsWrapper:Add( "DScrollPanel" )
    problemsList:Dock( FILL )
    sheet:AddSheet( "#problems.problems", problemsWrapper, "icon16/tick.png" )
    self.ProblemsList = problemsList

    local permWrapper = vgui.Create( "DPanel", ProblemsFrame )
    permWrapper.Paint = function() end
    permWrapper:DockPadding( 0, 10, 0, 0 )
    local permissionList = permWrapper:Add( "PermissionViewer" )
    permissionList:Dock( FILL )
    permissionList.ParentFrame = self
    sheet:AddSheet( "#permissions.title", permWrapper, "icon16/lock.png" )

    for _, item in pairs( sheet:GetItems() ) do
        local tab = item.Tab
        tab:SetHeight( 22 )

        tab.OnCursorEntered = function() nfPlay( "vuo_sounds/menu_focus.wav" ) end
        local _nfOldDo = tab.DoClick
        tab.DoClick = function( s ) nfPlay( "vuo_sounds/menu_accept.wav" ) if ( _nfOldDo ) then _nfOldDo( s ) end end

        tab.Paint = function( s, w, h )
            local isActive  = s:GetPropertySheet():GetActiveTab() == s
            local isHovered = s:IsHovered()

            if isActive then
                surface.SetDrawColor( SECONDARY( 235 ) )
                surface.DrawRect( 6, h - 2, w - 12, 2 )
            elseif isHovered then
                surface.SetDrawColor( THEME.accent.r, THEME.accent.g, THEME.accent.b, 200 )
                surface.DrawRect( 6, h - 2, w - 12, 2 )
            end
            if tab.SetTextColor then
                tab:SetTextColor( isActive and SECONDARY( 255 ) or THEME.text )
            end
        end
    end

end

function PANEL:FadeRemove()
    if ( self._nfClosing ) then return end
    self._nfClosing = true
    if ( self._nfPlay ) then self._nfPlay( "vuo_sounds/menu_back.wav" ) end
    self:AlphaTo( 0, 0.50, 0, function()
        if ( IsValid( self ) ) then self:Remove() end
    end )
end

function PANEL:OnMousePressed( mcode )
    if ( mcode == MOUSE_LEFT ) then
        if ( SysTime() - ( self._openedAt or 0 ) < 0.25 ) then return end
        self:FadeRemove()
    end
end

function PANEL:Think()
    if ( input.IsKeyDown( KEY_ESCAPE ) and !IsInGame() ) then
        self:FadeRemove()
    end
end

function PANEL:AddEmptyWarning( txt, parent )
    local lab = parent:Add( "DLabel" )
    lab:SetText( txt )
    lab:SetBright( true )
    lab:SetFont( "DermaLarge" )
    lab:SetContentAlignment( 5 )
    lab:Dock( FILL )
    lab.Paint = function( s, w, h )
        s:SetTall( parent:GetTall() )
    end
    return lab
end

local color_background = Color( 0, 0, 0, 0 )
function PANEL:Paint( w, h )
    draw.RoundedBox( 0, 0, 0, w, h, color_background )
end

function PANEL:PerformLayout()
    if ( self.LuaErrorList:GetCanvas():ChildCount() < 1 ) then
        self.NoErrorsLabel = self:AddEmptyWarning( "#problems.no_lua_errors", self.LuaErrorList )
    end
    if ( self.ProblemsList:GetCanvas():ChildCount() < 1 ) then
        self.NoProblemsLabel = self:AddEmptyWarning( "#problems.no_problems", self.ProblemsList )
    end
end

function PANEL:ReceivedError( uid, err )
    if ( IsValid( self.NoErrorsLabel ) ) then self.NoErrorsLabel:Remove() end
    local groupID = err.type or "Other"
    local pnl = self.ErrorPanels[ groupID ]
    if ( !IsValid( pnl ) ) then
        pnl = self.LuaErrorList:Add( "LuaProblemGroup" )
        pnl:SetTitleAndID( err.title, err.addonid, groupID )
        self.ErrorPanels[ groupID ] = pnl
        local z = 0
        for gid, epnl in SortedPairs( self.ErrorPanels ) do
            epnl:SetZPos( z )
            z = z + 1
        end
        self:InvalidateLayout()
    end
    pnl:ReceivedError( uid, err )
end

function PANEL:ReceivedProblem( uid, prob )
    if ( IsValid( self.NoProblemsLabel ) ) then self.NoProblemsLabel:Remove() end
    local groupID = prob.type or "other"
    local pnl = self.ProblemPanels[ groupID ]
    if ( !IsValid( pnl ) ) then
        pnl = self.ProblemsList:Add( "GenericProblemGroup" )
        pnl:SetGroup( groupID )
        self.ProblemPanels[ groupID ] = pnl
        self:InvalidateLayout()
    end
    pnl:ReceivedProblem( uid, prob )
end

vgui.Register( "ProblemsPanel", PANEL, "EditablePanel" )
