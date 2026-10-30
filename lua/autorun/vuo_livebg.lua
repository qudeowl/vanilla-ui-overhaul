if ( SERVER ) then
	AddCSLuaFile()

	hook.Add( "Initialize", "VUO_LiveBG", function()
		local cv = GetConVar( "vuo_livebg_map" )
		if ( not cv or cv:GetString() == "" or cv:GetString() ~= game.GetMap() ) then return end

		SetGlobalBool( "VUO_LiveBG", true )
		hook.Add( "PlayerLoadout", "VUO_LiveBG", function() return true end )
		hook.Add( "PlayerSpawn", "VUO_LiveBG", function( ply )
			timer.Simple( 0, function()
				if ( not IsValid( ply ) ) then return end
				ply:StripWeapons()
				ply:Lock()
				ply:SetNoDraw( true )
				ply:DrawShadow( false )
			end )
		end )
	end )

	return
end

local live = false

local function vuoLive()
	if ( live ) then return end
	live = true

	hook.Add( "HUDShouldDraw", "VUO_LiveBG", function() return false end )
	hook.Add( "PreDrawViewModel", "VUO_LiveBG", function() return true end )
	hook.Add( "PlayerBindPress", "VUO_LiveBG", function() return true end )

	for _, name in ipairs( { "OpeningMenu", "Annoy1", "Annoy2" } ) do timer.Remove( "HintSystem_" .. name ) end
	if ( GAMEMODE ) then
		GAMEMODE.AddHint = function() end
		GAMEMODE.AddNotify = function() end
	end
	notification.AddLegacy = function() end
	notification.AddProgress = function() end

	local base
	hook.Add( "CalcView", "VUO_LiveBG", function( ply, pos, ang, fov )
		if ( ply:GetViewEntity() ~= ply ) then return end
		base = base or { pos = pos + Vector( 0, 0, 40 ), yaw = ang.y }
		local t = RealTime()
		return {
			origin = base.pos + Angle( 0, base.yaw, 0 ):Forward() * math.sin( t * 0.05 ) * 48,
			angles = Angle( math.sin( t * 0.07 ) * 2, base.yaw + math.sin( t * 0.045 ) * 38, 0 ),
			fov = fov,
			drawviewer = false
		}
	end )
end

hook.Add( "Initialize", "VUO_LiveBG", function()
	local cv = GetConVar( "vuo_livebg_map" )
	if ( cv and cv:GetString() ~= "" and cv:GetString() == game.GetMap() ) then vuoLive() end
end )

hook.Add( "InitPostEntity", "VUO_LiveBG", function()
	if ( GetGlobalBool( "VUO_LiveBG" ) ) then return vuoLive() end
	timer.Simple( 1, function()
		if ( GetGlobalBool( "VUO_LiveBG" ) ) then vuoLive() end
	end )
end )
