
include( "problem_lua.lua" )
include( "problem_generic.lua" )
include( "permissions.lua" )

-- =========================================================
--  Theme colors — matched to Custom.css v2 palette
-- =========================================================
local THEME = {
    -- Main frame background
    frameBg      = Color( 12,  16,  28,  210 ),
    -- Content area background
    contentBg    = Color( 10,  14,  24,  130 ),
    -- Tab bar background
    tabBarBg     = Color( 8,   10,  18,  120 ),
    -- Frame border
    frameBorder  = Color( 255, 255, 255, 18  ),
    -- Active tab tint
    tabActive    = Color( 35,  135, 237, 30  ),
    -- Inactive tab — fully transparent
    tabInactive  = Color( 0,   0,   0,   0   ),
    -- Tab hover
    tabHover     = Color( 255, 255, 255, 12  ),
    -- Accent line under active tab
    accent       = Color( 35,  135, 237, 200 ),
    -- Text color
    text         = Color( 200, 218, 245, 255 ),
    -- Separator line
    separator    = Color( 255, 255, 255, 12  ),
    -- Close button hover
    closeHover   = Color( 180, 40,  40,  160 ),
    -- Title bar background
    titleBg      = Color( 35,  135, 237, 20  ),
}

-- Blur: render.UpdateScreenEffectTexture is only available in game context.
-- Silently skip in menu context (pcall + nil guard).
local blurMat = Material( "pp/blurscreen" )
local function DrawBlur( panel, amount )
    -- render.UpdateScreenEffectTexture may be nil in menu context
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
    -- ok == false: silently skip; background color remains visible
end

local PANEL = {}

function PANEL:Init()

    self:SetSize( ScrW(), ScrH() )
    self:MakePopup()

    self.ErrorPanels  = {}
    self.ProblemPanels = {}

    local ProblemsFrame = vgui.Create( "DFrame", self )

    local panelW = 700
    local margin = 25
    local panelH = ( ScrH() - 55 ) - ( margin * 2 )

    ProblemsFrame:SetSize( panelW, panelH )
    ProblemsFrame:SetPos( ScrW() - panelW - margin, margin )
    ProblemsFrame:SetTitle( "Problems" )
    ProblemsFrame:SetDraggable( false )
    ProblemsFrame:ShowCloseButton( true )
    ProblemsFrame.OnRemove = function() self:Remove() end
    ProblemsFrame.OnClose  = function() self:Remove() end

    ProblemsFrame.Paint = function( frm, w, h )
        DrawBlur( frm, 6 )
        -- Ana arka plan
        draw.RoundedBox( 6, 0, 0, w, h, THEME.frameBg )
        -- İnce dış kenarlık
        surface.SetDrawColor( THEME.frameBorder.r, THEME.frameBorder.g, THEME.frameBorder.b, THEME.frameBorder.a )
        surface.DrawOutlinedRect( 0, 0, w, h, 1 )
    end

    -- DFrame'in başlık barını tema rengine boyamak için
    -- DFrame children: [1] = title label, [2] = close button
    timer.Simple( 0, function()
        if not IsValid( ProblemsFrame ) then return end
        for _, child in ipairs( ProblemsFrame:GetChildren() ) do
            -- Title label
            if child.ClassName == "DLabel" then
                child:SetTextColor( THEME.text )
                child.Paint = function( s, w, h ) end -- Remove default DFrame title background
            end
            -- Close button
            if child.ClassName == "DButton" and child:GetText() == "" then
                child.Paint = function( s, w, h )
                    if s:IsHovered() then
                        draw.RoundedBox( 4, 0, 0, w, h, THEME.closeHover )
                    end
                    -- X icon
                    draw.SimpleText( "✕", "DermaDefault", w/2, h/2,
                        s:IsHovered() and Color(255,255,255,255) or THEME.text,
                        TEXT_ALIGN_CENTER, TEXT_ALIGN_CENTER )
                end
            end
        end
    end )

    ProblemsFrame:DockPadding( 8, 28, 8, 8 )

    local sheet = vgui.Create( "DPropertySheet", ProblemsFrame )
    sheet:Dock( FILL )
    self.Tabs = sheet

    -- Tab bar — minimal, sadece içerik alanı hafif karartılmış
    sheet.Paint = function( s, w, h )
        -- Content area only (below tab bar)
        draw.RoundedBoxEx( 4, 0, 20, w, h - 20, THEME.contentBg, false, false, true, true )
        -- Thin separator below tab bar
        surface.SetDrawColor( THEME.separator.r, THEME.separator.g, THEME.separator.b, THEME.separator.a )
        surface.DrawRect( 0, 20, w, 1 )
    end

    -- Lua Errors tab
    local luaErrorContainer = vgui.Create( "Panel", ProblemsFrame )
    luaErrorContainer.Paint = function() end

    local luaErrorList = luaErrorContainer:Add( "DScrollPanel" )
    luaErrorList:Dock( FILL )

    local luaStrictMode = luaErrorContainer:Add( "DCheckBoxLabel" )
    luaStrictMode:Dock( BOTTOM )
    luaStrictMode:SetText( "#lua_strict" )
    luaStrictMode:SetConVar( "lua_strict" )
    luaStrictMode:SetDark( false )
    luaStrictMode:SetTextColor( THEME.text )
    -- Find DCheckBox inside DCheckBoxLabel and override its Paint
    local function styleCheckbox( lbl )
        if not IsValid( lbl ) then return end
        for _, child in ipairs( lbl:GetChildren() ) do
            if child.ClassName == "DCheckBox" then
                child.Paint = function( s, w, h )
                    draw.RoundedBox( 2, 0, 0, w, h, Color( 15, 18, 28, 220 ) )
                    surface.SetDrawColor( 35, 135, 237, 140 )
                    surface.DrawOutlinedRect( 0, 0, w, h, 1 )
                    if s:GetChecked() then
                        surface.SetDrawColor( 35, 135, 237, 230 )
                        surface.DrawRect( 3, 3, w - 6, h - 6 )
                    end
                end
                return
            end
        end
    end
    timer.Simple( 0,   function() styleCheckbox( luaStrictMode ) end )
    timer.Simple( 0.1, function() styleCheckbox( luaStrictMode ) end )

    sheet:AddSheet( "#problems.lua_errors", luaErrorContainer, "icon16/error.png" )
    self.LuaErrorList = luaErrorList

    -- Problems tab
    local problemsList = ProblemsFrame:Add( "DScrollPanel" )
    sheet:AddSheet( "#problems.problems", problemsList, "icon16/tick.png" )
    self.ProblemsList = problemsList

    -- Permissions tab
    local permissionList = ProblemsFrame:Add( "PermissionViewer" )
    permissionList.ParentFrame = self
    sheet:AddSheet( "#permissions.title", permissionList, "icon16/lock.png" )

    -- Tab button styles
    for _, item in pairs( sheet:GetItems() ) do
        local tab = item.Tab
        tab:SetHeight( 20 )
        tab.Paint = function( s, w, h )
            local isActive  = s:GetPropertySheet():GetActiveTab() == s
            local isHovered = s:IsHovered()
            if isActive then
                -- Only bottom accent line — no box
                surface.SetDrawColor( THEME.accent.r, THEME.accent.g, THEME.accent.b, THEME.accent.a )
                surface.DrawRect( 4, h - 2, w - 8, 2 )
                -- Subtle background tint
                draw.RoundedBoxEx( 3, 1, 1, w - 2, h - 2, THEME.tabActive, true, true, false, false )
            elseif isHovered then
                draw.RoundedBoxEx( 3, 1, 1, w - 2, h - 2, THEME.tabHover, true, true, false, false )
            end
            -- Inactive: draw nothing, fully transparent
        end
        if tab.SetTextColor then
            tab:SetTextColor( THEME.text )
        end
    end

end

function PANEL:OnMousePressed( mcode )
    if ( mcode == MOUSE_LEFT ) then self:Remove() end
end

function PANEL:Think()
    if ( input.IsKeyDown( KEY_ESCAPE ) and !IsInGame() ) then
        self:Remove()
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
