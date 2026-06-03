-- =========================================================
--  Spawn menu dark theme
--  garrysmod/lua/autorun/client/spawnmenu_theme.lua
-- =========================================================
if SERVER then return end

local C = {
    bg          = Color( 14,  14,  18,  165 ),   -- neutral dark black
    bgMid       = Color( 18,  18,  22,  155 ),
    bgLight     = Color( 22,  22,  28,  145 ),
    bgDark      = Color( 8,   8,   12,  185 ),
    border      = Color( 255, 255, 255, 18  ),
    accent      = Color( 35,  135, 237, 255 ),   -- GMod blue used only as accent
    accentDim   = Color( 35,  135, 237, 45  ),
    accentHover = Color( 35,  135, 237, 70  ),
    text        = Color( 210, 215, 225, 255 ),   -- neutral light gray-white
    textMuted   = Color( 140, 145, 155, 180 ),
    textBright  = Color( 235, 238, 245, 255 ),
    catBg       = Color( 18,  18,  24,  210 ),
    rowHover    = Color( 35,  135, 237, 28  ),
    rowSelect   = Color( 35,  135, 237, 75  ),
    transparent = Color( 0,   0,   0,   0   ),
    white       = Color( 255, 255, 255, 255 ),
}

-- Track already-styled panels to avoid double-processing
local styled = {}

-- =========================================================
--  SKIN PATCH — Override Tree text colours at the source
--  DTree_Node_Button.UpdateColours() reads from skin.Colours.Tree
--  so SetTextColor() alone is not enough; we must fix the skin.
-- =========================================================
local function PatchSkin()
    local skin = derma.GetDefaultSkin()
    if not skin then return end
    if skin._darkThemePatchedTree then return end
    skin._darkThemePatchedTree = true

    -- Override tree text colours
    if skin.Colours and skin.Colours.Tree then
        skin.Colours.Tree.Normal   = C.text
        skin.Colours.Tree.Hover    = C.textBright
        skin.Colours.Tree.Selected = C.textBright
        skin.Colours.Tree.Lines    = Color( 35, 135, 237, 60 )
    end

    -- Override PaintTreeNodeButton so selected rows use our custom bg
    -- instead of the GWEN texture (which is a hardcoded blue bitmap)
    skin.PaintTreeNodeButton = function( self2, panel, w, h )
        if not panel.m_bSelected then return end
        draw.RoundedBox( 2, 0, 0, w, h, C.rowSelect )
        surface.SetDrawColor( C.accent )
        surface.DrawRect( 0, 0, 2, h )
    end

    -- Also fix Label colours used by DLabel with SetDark()
    if skin.Colours and skin.Colours.Label then
        skin.Colours.Label.Default   = C.text
        skin.Colours.Label.Bright    = C.textBright
        skin.Colours.Label.Dark      = C.text   -- SetDark(true) normally makes this near-black
        skin.Colours.Label.Highlight = C.accent
    end
end

-- Apply as soon as possible and retry in case skin isn't ready yet
PatchSkin()
timer.Simple( 0,   PatchSkin )
timer.Simple( 0.5, PatchSkin )
timer.Simple( 1.0, PatchSkin )

local function IsStyled( pnl )
    if not IsValid( pnl ) then return true end
    if styled[ pnl ] then return true end
    styled[ pnl ] = true
    return false
end

-- Style DTree background and nodes
local function StyleTree( tree )
    if IsStyled( tree ) then return end
    tree:SetBackgroundColor( C.bgDark )
    -- Style each tree node
    local function styleNodes( pnl )
        if not IsValid( pnl ) then return end
        for _, child in ipairs( pnl:GetChildren() ) do
            if child.ClassName == "DTree_Node" or child.m_bSelected ~= nil then
                if not styled[ child ] then
                    styled[ child ] = true
                    child.Paint = function( s, w, h )
                        if s.m_bSelected then
                            draw.RoundedBox( 2, 0, 0, w, h, C.rowSelect )
                            surface.SetDrawColor( C.accent )
                            surface.DrawRect( 0, 0, 2, h )
                        elseif s:IsHovered() then
                            draw.RoundedBox( 2, 0, 0, w, h, C.rowHover )
                        end
                    end
                    child.GetTextColor = function() return C.text end
                end
                styleNodes( child )
            end
            styleNodes( child )
        end
    end
    timer.Simple( 0.1, function() styleNodes( tree ) end )
    timer.Simple( 0.5, function() styleNodes( tree ) end )
    timer.Simple( 1.0, function() styleNodes( tree ) end )
end

-- Style DCategoryList
local function StyleCategoryList( list )
    if IsStyled( list ) then return end
    list.Paint = function( s, w, h )
        draw.RoundedBox( 0, 0, 0, w, h, C.bgDark )
    end
    timer.Simple( 0.05, function()
        if not IsValid( list ) then return end
        local canvas = list.pnlCanvas
        if not IsValid( canvas ) then return end
        for _, cat in ipairs( canvas:GetChildren() ) do
            if not IsValid( cat ) or styled[ cat ] then continue end
            styled[ cat ] = true
            -- Category panel paint
            cat.Paint = function( s, w, h )
                draw.RoundedBox( 0, 0, 0, w, h, C.bg )
            end
            -- Category header
            if IsValid( cat.Header ) then
                local hdr = cat.Header
                if not styled[ hdr ] then
                    styled[ hdr ] = true
                    hdr.Paint = function( s, w, h )
                        -- Sadece arka plan + sol accent çizgi; metin DCollapsibleCategory kendi çiziyor
                        draw.RoundedBox( 0, 0, 0, w, h, C.catBg )
                        draw.RoundedBox( 0, 0, 0, 3, h, C.accent )
                    end
                    if hdr.SetTextColor then hdr:SetTextColor( C.textBright ) end
                end
            end
            -- Tool buttons inside category
            for _, item in ipairs( cat:GetChildren() ) do
                if not IsValid( item ) or item == cat.Header or styled[ item ] then continue end
                styled[ item ] = true
                item.Paint = function( s, w, h )
                    if s:IsSelected() then
                        draw.RoundedBox( 0, 0, 0, w, h, C.rowSelect )
                        draw.RoundedBox( 0, 0, 0, 3, h, C.accent )
                    elseif s:IsHovered() then
                        draw.RoundedBox( 0, 0, 0, w, h, C.rowHover )
                    end
                end
                if item.SetTextColor then item:SetTextColor( C.text ) end
            end
        end
    end )
end

-- Style DPropertySheet (tab bars)
local function StyleSheet( sheet )
    if IsStyled( sheet ) then return end
    sheet.Paint = function( s, w, h )
        draw.RoundedBox( 0, 0, 0, w, 22, C.bgDark )
        draw.RoundedBox( 0, 0, 22, w, h - 22, C.bg )
        surface.SetDrawColor( C.border )
        surface.DrawRect( 0, 22, w, 1 )
    end
    timer.Simple( 0, function()
        if not IsValid( sheet ) then return end
        for _, item in pairs( sheet:GetItems() ) do
            local tab = item.Tab
            if not IsValid( tab ) or styled[ tab ] then continue end
            styled[ tab ] = true
            tab.Paint = function( s, w, h )
                local active  = s:GetPropertySheet():GetActiveTab() == s
                local hovered = s:IsHovered()
                if active then
                    draw.RoundedBox( 0, 0, 0, w, h, C.accentDim )
                    surface.SetDrawColor( C.accent )
                    surface.DrawRect( 3, h-2, w-6, 2 )
                elseif hovered then
                    draw.RoundedBox( 0, 0, 0, w, h, C.accentHover )
                end
            end
            if tab.SetTextColor then tab:SetTextColor( C.text ) end
        end
    end )
end

-- Style control panel
local function StyleControlPanel( pnl )
    if not IsValid( pnl ) or styled[ pnl ] then return end
    styled[ pnl ] = true
    pnl.Paint = function( s, w, h )
        draw.RoundedBox( 0, 0, 0, w, h, C.bgMid )
    end

    -- Recursively fix all labels and text inside the control panel
    local function fixLabels( p, depth )
        if not IsValid( p ) or depth > 6 then return end
        local cn = p.ClassName or ""

        -- DLabel — SetDark(true) makes them black, override
        if cn == "DLabel" or cn == "DCheckBoxLabel" then
            if not styled[ p ] then
                styled[ p ] = true
                p:SetDark( false )
                p:SetTextColor( C.text )
                -- Override Paint to ensure text color is always forced
                p.Paint = function( s, w, h )
                    s:SetDark( false )
                    s:SetTextColor( C.text )
                end
            end
        end

        -- RichText panels
        if cn == "RichText" then
            if not styled[ p ] then
                styled[ p ] = true
                p:SetFGColor( C.text )
            end
        end

        -- DPanel / Panel children — dark background
        if ( cn == "DPanel" or cn == "Panel" ) and p ~= pnl then
            if not styled[ p ] then
                styled[ p ] = true
                p.Paint = function( s, w, h )
                    draw.RoundedBox( 0, 0, 0, w, h, C.bgMid )
                end
            end
        end

        for _, child in ipairs( p:GetChildren() ) do
            fixLabels( child, depth + 1 )
        end
    end
    fixLabels( pnl, 0 )
end

-- Style ContentSidebar (left tree panel)
local function StyleContentArea( pnl )
    if not IsValid( pnl ) or styled[ pnl ] then return end
    styled[ pnl ] = true
    pnl.Paint = function( s, w, h )
        draw.RoundedBox( 0, 0, 0, w, h, C.bgDark )
    end
    -- DTree inside sidebar
    for _, child in ipairs( pnl:GetChildren() ) do
        if not IsValid( child ) then continue end
        if child.ClassName == "DTree" then
            StyleTree( child )
        elseif child.ClassName == "DScrollPanel" then
            if not styled[ child ] then
                styled[ child ] = true
                child.Paint = function( s, w, h )
                    draw.RoundedBox( 0, 0, 0, w, h, C.bgDark )
                end
            end
        end
    end
end

-- Main theme application function
local function ApplyTheme()
    if not IsValid( g_SpawnMenu ) then return end
    local sm = g_SpawnMenu

    -- Main panel — draw a solid dark background so the game world is not visible through it
    if not styled[ sm ] then
        styled[ sm ] = true
        sm.Paint = function( s, w, h )
            draw.RoundedBox( 0, 0, 0, w, h, Color( 10, 10, 14, 220 ) )
        end
    end

    -- Divider between left and right panels
    local hdiv = sm.HorizontalDivider
    if IsValid( hdiv ) and not styled[ hdiv ] then
        styled[ hdiv ] = true
        hdiv.Paint = function( s, w, h )
            local lw = s:GetLeftWidth()
            surface.SetDrawColor( 35, 135, 237, 40 )
            surface.DrawRect( lw + 2, 0, 1, h )
        end
    end

    -- ── SOL PANEL: CreationMenu ───────────────────────────
    local cm = sm.CreateMenu
    if IsValid( cm ) then
        StyleSheet( cm )
        -- Tab panelleri
        for _, item in pairs( cm:GetItems() ) do
            local panel = item.Panel
            if not IsValid( panel ) then continue end
            -- ContentSidebar veya DPanel içinde sidebar
            for _, child in ipairs( panel:GetChildren() ) do
                if not IsValid( child ) then continue end
                if child.ClassName == "ContentSidebar" then
                    StyleContentArea( child )
                    if IsValid( child.Tree ) then StyleTree( child.Tree ) end
                elseif child.ClassName == "DTree" then
                    StyleTree( child )
                elseif child.ClassName == "DScrollPanel" then
                    StyleContentArea( child )
                end
                -- İçindeki scroll/panel
                for _, sub in ipairs( child:GetChildren() ) do
                    if not IsValid( sub ) then continue end
                    if sub.ClassName == "DTree" then StyleTree( sub ) end
                    if sub.ClassName == "ContentSidebar" then StyleContentArea( sub ) end
                end
            end
            if not styled[ panel ] then
                styled[ panel ] = true
                panel.Paint = function( s, w, h )
                    draw.RoundedBox( 0, 0, 0, w, h, C.bg )
                end
            end
        end
    end

    -- ── SAĞ PANEL: ToolMenu ───────────────────────────────
    local tm = sm.ToolMenu
    if IsValid( tm ) then
        StyleSheet( tm )
        for name, tp in pairs( tm.ToolPanels or {} ) do
            if not IsValid( tp ) then continue end
            if not styled[ tp ] then
                styled[ tp ] = true
                tp.Paint = function( s, w, h )
                    draw.RoundedBox( 0, 0, 0, w, h, C.bg )
                end
            end
            -- Sol liste
            if IsValid( tp.List ) then StyleCategoryList( tp.List ) end
            -- Sağ içerik
            if IsValid( tp.Content ) then
                if not styled[ tp.Content ] then
                    styled[ tp.Content ] = true
                    tp.Content.Paint = function( s, w, h )
                        draw.RoundedBox( 0, 0, 0, w, h, C.bgMid )
                    end
                end
                -- Control panels
                for _, cp in ipairs( tp.Content:GetCanvas():GetChildren() ) do
                    StyleControlPanel( cp )
                end
            end
            -- Arama
            if IsValid( tp.SearchBar ) then
                tp.SearchBar:SetTextColor( C.text )
            end
            -- Horizontal divider
            local hd = tp.HorizontalDivider
            if IsValid( hd ) and not styled[ hd ] then
                styled[ hd ] = true
                hd.Paint = function() end
            end
        end
    end
end

-- Hooks
hook.Add( "SpawnMenuCreated", "DarkTheme_v2", function()
    styled = {} -- Reset
    timer.Simple( 0.1, ApplyTheme )
    timer.Simple( 0.5, ApplyTheme )
    timer.Simple( 1.0, ApplyTheme )
end )

-- Theme small floating panels that sit outside g_SpawnMenu
-- (NPC options bottom-left panel, spawnlist editor panel, etc.)
-- These are direct children of the world panel, not of g_SpawnMenu
local lastFloatStyle = 0
local function StyleFloatingPanel( pnl )
    if not IsValid( pnl ) or styled[ pnl ] then return end
    styled[ pnl ] = true

    local cn = pnl.ClassName or ""
    if cn == "DPanel" or cn == "Panel" then
        pnl.Paint = function( s, w, h )
            draw.RoundedBox( 3, 0, 0, w, h, Color( 10, 10, 14, 235 ) )
            surface.SetDrawColor( C.accent )
            surface.DrawOutlinedRect( 0, 0, w, h, 1 )
        end
    end

    local function fixChildren( p, depth )
        if not IsValid( p ) or depth > 8 then return end
        local c = p.ClassName or ""

        if ( c == "DPanel" or c == "Panel" ) and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 0, 0, 0, w, h, Color( 12, 12, 16, 230 ) )
            end
        end

        if ( c == "DLabel" or c == "DCheckBoxLabel" ) and not styled[ p ] then
            styled[ p ] = true
            p:SetDark( false )
            p:SetTextColor( C.text )
            p.Paint = function( s, w, h )
                s:SetDark( false )
                s:SetTextColor( C.text )
            end
        end

        if c == "DCheckBox" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 2, 0, 0, w, h, Color( 20, 28, 50, 200 ) )
                surface.SetDrawColor( C.accent )
                surface.DrawOutlinedRect( 0, 0, w, h, 1 )
                if s:GetChecked() then
                    surface.SetDrawColor( C.accent )
                    surface.DrawRect( 2, 2, w - 4, h - 4 )
                end
            end
        end

        if c == "DTextEntry" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 2, 0, 0, w, h, Color( 8, 8, 12, 200 ) )
                surface.SetDrawColor( C.accent )
                surface.DrawOutlinedRect( 0, 0, w, h, 1 )
                s:DrawTextEntryText( C.text, C.accent, C.text )
            end
        end

        if c == "DComboBox" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 2, 0, 0, w, h, Color( 14, 14, 20, 220 ) )
                surface.SetDrawColor( C.accent )
                surface.DrawOutlinedRect( 0, 0, w, h, 1 )
            end
            if p.SetTextColor then p:SetTextColor( C.text ) end
        end

        if c == "DButton" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                local bg = s:IsHovered() and Color( 35, 135, 237, 60 ) or Color( 20, 28, 50, 160 )
                draw.RoundedBox( 2, 0, 0, w, h, bg )
                surface.SetDrawColor( C.accent )
                surface.DrawOutlinedRect( 0, 0, w, h, 1 )
            end
            if p.SetTextColor then p:SetTextColor( C.text ) end
        end

        if c == "DScrollPanel" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 0, 0, 0, w, h, Color( 8, 8, 12, 200 ) )
            end
        end

        for _, child in ipairs( p:GetChildren() ) do
            fixChildren( child, depth + 1 )
        end
    end

    fixChildren( pnl, 0 )
end

hook.Add( "Think", "DarkTheme_FloatingPanels", function()
    if not IsValid( g_SpawnMenu ) then return end
    if not g_SpawnMenu:IsVisible() then return end
    if CurTime() - lastFloatStyle < 0.5 then return end
    lastFloatStyle = CurTime()

    local world = vgui.GetWorldPanel()
    if not IsValid( world ) then return end

    for _, pnl in ipairs( world:GetChildren() ) do
        if not IsValid( pnl ) then continue end
        -- Skip g_SpawnMenu itself and Lua error dialogs
        if pnl == g_SpawnMenu then continue end
        if pnl.ClassName == "DFrame" then continue end
        -- Only target small panels (NPC options ~220x100, spawnlist panel etc.)
        local w, h = pnl:GetSize()
        if w < 10 or h < 10 then continue end
        if w > 600 or h > 600 then continue end
        StyleFloatingPanel( pnl )
    end
end )

hook.Add( "PostReloadToolsMenu", "DarkTheme_v2_Reload", function()
    styled = {}
    timer.Simple( 0.3, ApplyTheme )
    timer.Simple( 0.8, ApplyTheme )
end )

-- Re-apply when tabs change to catch newly loaded panels
hook.Add( "Think", "DarkTheme_v2_Think", function()
    if not IsValid( g_SpawnMenu ) then return end
    if not g_SpawnMenu:IsVisible() then return end
    -- Re-apply every 2 seconds to catch lazily loaded panels
    if ( CurTime() % 2 ) < 0.05 then
        ApplyTheme()
    end
end )

-- Force DTree background every frame — SetBackgroundColor gets overridden by skin
hook.Add( "Think", "DarkTheme_TreeBG", function()
    if not IsValid( g_SpawnMenu ) then return end
    if not g_SpawnMenu:IsVisible() then return end
    local function forceTrees( pnl, depth )
        if not IsValid( pnl ) or depth > 8 then return end
        if pnl.ClassName == "DTree" then
            pnl:SetBackgroundColor( Color( 8, 8, 12, 190 ) )
        end
        for _, c in ipairs( pnl:GetChildren() ) do
            forceTrees( c, depth + 1 )
        end
    end
    forceTrees( g_SpawnMenu, 0 )
end )

-- Hide HUD hint messages while the spawn menu is open
-- (they render over the menu and become distracting)
hook.Add( "HUDShouldDraw", "DarkTheme_HideHints", function( name )
    if name == "CHudHintDisplay" or name == "CHudSkillDisplay" then
        if IsValid( g_SpawnMenu ) and g_SpawnMenu:IsVisible() then
            return false
        end
    end
end )

print( "[DarkTheme v2] Loaded." )


-- Additional: darken scroll panel canvases on Think
local lastDeepStyle = 0
hook.Add( "Think", "DarkTheme_DeepFix", function()
    if not IsValid( g_SpawnMenu ) then return end
    if not g_SpawnMenu:IsVisible() then return end
    if CurTime() - lastDeepStyle < 1.5 then return end
    lastDeepStyle = CurTime()

    -- Fix both left (CreateMenu) and right (ToolMenu) panels
    -- Also include all direct children of the spawn menu to catch bottom bars etc.
    local roots = { g_SpawnMenu.CreateMenu, g_SpawnMenu.ToolMenu }
    for _, child in ipairs( g_SpawnMenu:GetChildren() ) do
        if IsValid( child ) then
            table.insert( roots, child )
        end
    end

    local function fixPanel( pnl, depth )
        if not IsValid( pnl ) or depth > 10 then return end
        local cn = pnl.ClassName or ""

        if cn == "DScrollPanel" then
            if not styled[ pnl ] then
                styled[ pnl ] = true
                pnl.Paint = function( s, w, h )
                    draw.RoundedBox( 0, 0, 0, w, h, C.bgDark )
                end
            end
            local canvas = rawget( pnl, "pnlCanvas" )
            if IsValid( canvas ) and not styled[ canvas ] then
                styled[ canvas ] = true
                canvas.Paint = function( s, w, h )
                    draw.RoundedBox( 0, 0, 0, w, h, C.bgDark )
                end
            end

        elseif cn == "DTree" then
            if not styled[ pnl ] then
                pnl:SetBackgroundColor( C.bgDark )
                styled[ pnl ] = true
            end

        -- Fix white DPanel backgrounds in left content area
        elseif cn == "DPanel" then
            if not styled[ pnl ] then
                styled[ pnl ] = true
                pnl.Paint = function( s, w, h )
                    draw.RoundedBox( 0, 0, 0, w, h, C.bg )
                end
            end

        -- Fix black DLabel text (SetDark makes them black)
        elseif cn == "DLabel" or cn == "DCheckBoxLabel" then
            if not styled[ pnl ] then
                styled[ pnl ] = true
                pnl:SetDark( false )
                pnl:SetTextColor( C.text )
                pnl.Paint = function( s, w, h )
                    s:SetDark( false )
                    s:SetTextColor( C.text )
                end
            end

        -- Fix DTree_Node labels going black
        elseif cn == "DTree_Node" then
            if not styled[ pnl ] then
                styled[ pnl ] = true
                if pnl.SetTextColor then pnl:SetTextColor( C.text ) end
                if pnl.SetDark then pnl:SetDark( false ) end
                if pnl.Label and IsValid( pnl.Label ) then
                    pnl.Label:SetTextColor( C.text )
                    if pnl.Label.SetDark then pnl.Label:SetDark( false ) end
                    pnl.Label.Paint = function( s, w, h )
                        s:SetDark( false )
                        s:SetTextColor( C.text )
                    end
                end
                pnl.GetTextColor = function() return C.text end
            end

        -- Dark text entries
        elseif cn == "DTextEntry" then
            if not styled[ pnl ] then
                styled[ pnl ] = true
                pnl.Paint = function( s, w, h )
                    draw.RoundedBox( 2, 0, 0, w, h, Color( 8, 8, 12, 200 ) )
                    surface.SetDrawColor( C.accent )
                    surface.DrawOutlinedRect( 0, 0, w, h, 1 )
                    s:DrawTextEntryText( C.text, C.accent, C.text )
                end
            end

        -- Dark combo boxes
        elseif cn == "DComboBox" then
            if not styled[ pnl ] then
                styled[ pnl ] = true
                pnl.Paint = function( s, w, h )
                    draw.RoundedBox( 2, 0, 0, w, h, Color( 14, 14, 20, 220 ) )
                    surface.SetDrawColor( C.accent )
                    surface.DrawOutlinedRect( 0, 0, w, h, 1 )
                end
                if pnl.SetTextColor then pnl:SetTextColor( C.text ) end
            end

        -- Dark buttons
        elseif cn == "DButton" then
            if not styled[ pnl ] then
                styled[ pnl ] = true
                pnl.Paint = function( s, w, h )
                    local bg = s:IsHovered() and Color( 35, 135, 237, 60 ) or Color( 20, 28, 50, 160 )
                    draw.RoundedBox( 2, 0, 0, w, h, bg )
                    surface.SetDrawColor( C.accent )
                    surface.DrawOutlinedRect( 0, 0, w, h, 1 )
                end
                if pnl.SetTextColor then pnl:SetTextColor( C.text ) end
            end
        end

        for _, child in ipairs( pnl:GetChildren() ) do
            fixPanel( child, depth + 1 )
        end
    end

    for _, root in ipairs( roots ) do
        if IsValid( root ) then fixPanel( root, 0 ) end
    end
end )

-- Global DCheckBox paint override
-- Uses VGUICreated hook so it works in menu context too
hook.Add( "VGUICreated", "DarkTheme_CheckBox", function( pnl )
    if not IsValid( pnl ) then return end
    if pnl:GetName() ~= "DCheckBox" then return end
    pnl.Paint = function( s, w, h )
        draw.RoundedBox( 2, 0, 0, w, h, Color( 20, 28, 50, 200 ) )
        surface.SetDrawColor( 35, 135, 237, 130 )
        surface.DrawOutlinedRect( 0, 0, w, h, 1 )
        if s:GetChecked() then
            surface.SetDrawColor( 35, 135, 237, 255 )
            surface.DrawRect( 2, 2, w - 4, h - 4 )
        end
    end
end )

-- Theme panels that spawn outside g_SpawnMenu (NPC options, spawnlist editor, etc.)
-- We use a short timer so the panel is fully built before we style it
local function ThemeExternalPanel( pnl )
    if not IsValid( pnl ) then return end
    local cn = pnl.ClassName or ""

    -- Dark background for floating DFrame windows (NPC options frame, etc.)
    if cn == "DFrame" then
        if not styled[ pnl ] then
            styled[ pnl ] = true
            local origPaint = pnl.Paint
            pnl.Paint = function( s, w, h )
                draw.RoundedBox( 4, 0, 0, w, h, Color( 10, 10, 14, 230 ) )
                draw.RoundedBox( 4, 0, 0, w, 24, Color( 8, 8, 12, 240 ) )
                surface.SetDrawColor( C.accent )
                surface.DrawRect( 0, 24, w, 1 )
            end
        end
    end

    -- Recursively dark-theme every child
    local function fix( p, depth )
        if not IsValid( p ) or depth > 8 then return end
        local c = p.ClassName or ""

        if ( c == "DPanel" or c == "Panel" ) and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 0, 0, 0, w, h, Color( 14, 14, 18, 210 ) )
            end
        end

        if ( c == "DLabel" or c == "DCheckBoxLabel" ) and not styled[ p ] then
            styled[ p ] = true
            p:SetDark( false )
            p:SetTextColor( C.text )
            p.Paint = function( s, w, h )
                s:SetDark( false )
                s:SetTextColor( C.text )
            end
        end

        if c == "DTextEntry" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 2, 0, 0, w, h, Color( 8, 8, 12, 200 ) )
                surface.SetDrawColor( C.accent )
                surface.DrawOutlinedRect( 0, 0, w, h, 1 )
                s:DrawTextEntryText( C.text, C.accent, C.text )
            end
        end

        if c == "DComboBox" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 2, 0, 0, w, h, Color( 14, 14, 20, 220 ) )
                surface.SetDrawColor( C.accent )
                surface.DrawOutlinedRect( 0, 0, w, h, 1 )
            end
            if p.SetTextColor then p:SetTextColor( C.text ) end
        end

        if c == "DButton" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                local bg = s:IsHovered() and Color( 35, 135, 237, 60 ) or Color( 20, 28, 50, 160 )
                draw.RoundedBox( 2, 0, 0, w, h, bg )
                surface.SetDrawColor( C.accent )
                surface.DrawOutlinedRect( 0, 0, w, h, 1 )
            end
            if p.SetTextColor then p:SetTextColor( C.text ) end
        end

        if c == "DScrollPanel" and not styled[ p ] then
            styled[ p ] = true
            p.Paint = function( s, w, h )
                draw.RoundedBox( 0, 0, 0, w, h, Color( 8, 8, 12, 200 ) )
            end
        end

        for _, child in ipairs( p:GetChildren() ) do
            fix( child, depth + 1 )
        end
    end

    timer.Simple( 0.05, function() fix( pnl, 0 ) end )
    timer.Simple( 0.3,  function() fix( pnl, 0 ) end )
end

hook.Add( "VGUICreated", "DarkTheme_ExternalPanels", function( pnl )
    if not IsValid( pnl ) then return end
    local cn = pnl.ClassName or ""
    -- Only intercept panels that appear near the spawn menu area
    -- DFrame = NPC options, EntityOptions, etc.
    if cn == "DFrame" then
        ThemeExternalPanel( pnl )
    end
end )
