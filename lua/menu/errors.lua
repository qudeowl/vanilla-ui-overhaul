local Errors = {}

hook.Add( "OnLuaError", "MenuErrorHandler", function( str, realm, stack, addontitle, addonid )

	if ( addonid == nil ) then addonid = 0 end

	if ( Errors[ addonid ] ) then
		Errors[ addonid ].times	= Errors[ addonid ].times + 1
		Errors[ addonid ].last	= SysTime()

		return
	end

	local text = language.GetPhrase( "errors.something_p" )

	if ( isstring( addontitle ) ) then
		text = string.format( language.GetPhrase( "errors.addon_p" ), addontitle )
	end

	local error = {
		first	= SysTime(),
		last	= SysTime(),
		times	= 1,

		x		= 32,
		text	= text,
		iserr   = true
	}

	Errors[ addonid ] = error

end )

hook.Add( "OnPauseMenuBlockedTooManyTimes", "TellAboutShiftEsc", function()

	Errors[ "internal_shift+esc" ] = {
		first	= SysTime(),
		last	= SysTime(),
		times	= 1,
		x		= 32,
		text	= "#permission.main_menu_blocked",
		iserr   = false
	}

end )

hook.Add( "OnProblemReceived", "FireProblemNotification", function( problem )

	if ( problem.severity != 2 ) then return end

	local shortdesc = string.match( problem.text, "([^\n]+)" ) or problem.text

	Errors[ "internal_problem" ] = {
		first	= SysTime(),
		last	= SysTime(),
		times	= 1,
		x		= 32,
		text	= string.format( language.GetPhrase( "#errors.problem" ), shortdesc ),
		iserr   = true
	}

end )

local matAlert = Material( "icon16/error.png" )
local matInfo = Material( "icon16/information.png" )

local cl_drawhud = GetConVar( "cl_drawhud" )

hook.Add( "DrawOverlay", "MenuDrawLuaErrors", function()

	if ( table.IsEmpty( Errors ) ) then return end
	if ( !cl_drawhud:GetBool() ) then return end

	local idealy = 32
	local height = 30
	local EndTime = SysTime() - 10
	local Recent = SysTime() - 0.5

	for k, v in SortedPairsByMemberValue( Errors, "last" ) do

		surface.SetFont( "DermaDefault" )
		if ( v.y == nil ) then v.y = idealy end
		if ( v.w == nil ) then v.w = surface.GetTextSize( v.text ) + 48 end

		draw.RoundedBox( 8, v.x, v.y, v.w, height, Color( 10, 10, 14, 220 ) )

		if ( v.last > Recent ) then
			local alpha = ( v.last - Recent ) * 180
			if v.iserr then

				surface.SetDrawColor( 255, 200, 0, alpha )
				surface.DrawRect( v.x, v.y, 3, height )
			else

				surface.SetDrawColor( 35, 135, 237, alpha )
				surface.DrawRect( v.x, v.y, 3, height )
			end
		end

		surface.SetTextColor( 210, 225, 248, 230 )
		surface.SetTextPos( v.x + 34, v.y + 8 )
		surface.DrawText( v.text )

		surface.SetDrawColor( 255, 255, 255, 150 + math.sin( v.y + SysTime() * 30 ) * 100 )
		if ( v.iserr ) then
			surface.SetMaterial( matAlert )
		else
			surface.SetMaterial( matInfo )
		end
		surface.DrawTexturedRect( v.x + 10, v.y + 7, 16, 16 )

		v.y = idealy

		idealy = idealy + 40

		if ( v.last < EndTime ) then
			Errors[ k ] = nil
		end

	end

end )
