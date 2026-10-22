local function nfSettingsRaw()
    local raw = cookie and cookie.GetString( "vuo_settings" )
    if ( isstring( raw ) and raw ~= "" ) then return raw end
    local ok, legacy = pcall( file.Read, "vuo_settings.txt", "DATA" )
    if ( ok and isstring( legacy ) and legacy ~= "" ) then return legacy end
end

local function nfReadSettings()
    local raw = nfSettingsRaw()
    local cfg = raw and util.JSONToTable( raw ) or nil
    return istable( cfg ) and cfg or {}
end

local function nfNum( v, lo, hi, def )
    v = tonumber( v )
    if ( not v ) then return def end
    return math.Clamp( math.floor( v + 0.5 ), lo, hi )
end

local function nfFontFile( name )
    if ( not isstring( name ) or name == "" ) then return nil end
    local all = {}
    for _, ext in ipairs( { "*.ttf", "*.otf" } ) do
        local files = file.Find( "materials/vuo_fonts/" .. ext, "GAME" )
        if ( istable( files ) ) then
            for _, fn in ipairs( files ) do all[ #all + 1 ] = fn end
        end
    end
    table.sort( all )
    for _, fn in ipairs( all ) do
        if ( string.StripExtension( fn ) == name and not string.find( fn, "[\"\\]" ) ) then return fn end
    end
    return nil
end

local function nfStyleInjectJS()
    local cfg = nfReadSettings()
    local rgb = "35,135,237"
    if ( isstring( cfg.accentBlue ) and string.match( cfg.accentBlue, "^%s*%d+%s*,%s*%d+%s*,%s*%d+%s*$" ) ) then
        rgb = cfg.accentBlue
    end

    local scale = math.Clamp( tonumber( cfg.ldInfoScale ) or 1, 0.7, 1.6 )

    local css = ":root{--vuo-a:" .. rgb ..
                ";--ld-w:" .. nfNum( cfg.ldWidth, 180, 560, 280 ) .. "px" ..
                ";--ld-bar:" .. nfNum( cfg.ldBar, 3, 16, 7 ) .. "px" ..
                ";--ld-text:" .. nfNum( cfg.ldText, 10, 22, 13 ) .. "px" ..
                ";--ld-info:" .. string.format( "%.2f", scale ) ..
                ";--ld-y:" .. string.format( "%.2f", 1 - nfNum( cfg.ldY, 0, 100, 0 ) / 100 ) ..
                ";--ld-iy:" .. string.format( "%.2f", 1 - nfNum( cfg.ldInfoY, 0, 100, 100 ) / 100 ) .. "}"

    if ( cfg.ldPos == "left" ) then
        css = css .. "#nf_loading{left:24px !important;right:auto !important}"
    elseif ( cfg.ldPos == "center" ) then
        css = css .. "#nf_loading{left:50% !important;right:auto !important;transform:translateX(-50%) translateY(calc(-100% * var(--ld-y,1))) !important}"
    end

    if ( cfg.ldInfoPos == "center" ) then
        css = css .. ".server_info{left:50% !important;transform:translateX(-50%) translateY(calc(-100% * var(--ld-iy,0) * var(--ld-info,1))) scale(var(--ld-info,1)) !important;transform-origin:top center !important}"
    elseif ( cfg.ldInfoPos == "right" ) then
        css = css .. ".server_info{left:auto !important;right:16px !important;transform-origin:top right !important}"
    end

    local font = nfFontFile( cfg.font )
    if ( font ) then
        css = css .. "@font-face{font-family:\"VUOLoadFont\";src:url(\"asset://garrysmod/materials/vuo_fonts/" .. font .. "\");font-display:swap}" ..
                     "body,#nf_loading{font-family:\"VUOLoadFont\",'Roboto','Segoe UI','Noto Sans','Helvetica Neue',Arial,sans-serif !important}"
    end

    return "(function(){var id='vuo_accent_style';var s=document.getElementById(id);" ..
           "if(!s){s=document.createElement('style');s.id=id;(document.head||document.documentElement).appendChild(s);}" ..
           "s.textContent=" .. string.format( "%q", css ) .. ";})();"
end

local PANEL = {}

function PANEL:Init()

	self:SetSize( ScrW(), ScrH() )

end

function PANEL:ShowURL( url, force )

	if ( string.len( url ) < 5 ) then
		return
	end

	if ( IsValid( self.HTML ) ) then
		if ( !force ) then return end

		self:RunJavascript( "if(window.nfLoadServer)nfLoadServer('" .. url:JavascriptSafe() .. "')" )
		self.nfInjected = false
		self.LoadedURL = url
		return
	end

	self:SetSize( ScrW(), ScrH() )

	self.HTML = vgui.Create( "DHTML", self )
	self.HTML:SetSize( ScrW(), ScrH() )
	self.HTML:Dock( FILL )
	self.HTML:SetMouseInputEnabled( true )

	self.HTML.OnChangeTitle = function( _, title )
		if title == "NF_CANCEL" then
			engine.Disconnect()
		end
	end

	self.HTML.OnDocumentReady = function( _, pageurl )
		self.HTML:AddFunction( "lua", "Run", function( param, ... )
			local args = { ... }
			for id, arg in pairs( args ) do
				if ( isstring( arg ) ) then
					args[ id ] = string.format( "%q", arg )
				end
			end
			RunString( param:format( unpack( args ) ) )
		end )
		self.HTML:AddFunction( "lua", "PlaySound", function( param ) surface.PlaySound( param ) end )
		self.nfInjected = false
	end

	self.HTML:OpenURL( url )

	self:InvalidateLayout()
	self:SetMouseInputEnabled( true )

	self.LoadedURL = url

end

function PANEL:PerformLayout()

	self:SetSize( ScrW(), ScrH() )

end

function PANEL:Paint()

	if ( !IsValid( self.HTML ) || self.HTML:IsLoading() ) then
		surface.SetDrawColor( 10, 10, 14, 255 )
		surface.DrawRect( 0, 0, self:GetWide(), self:GetTall() )
	end

	if ( self.JavascriptRun && IsValid( self.HTML ) && !self.HTML:IsLoading() ) then

		self:RunJavascript( self.JavascriptRun )
		self.JavascriptRun = nil

	end

end

function PANEL:RunJavascript( str )

	if ( !IsValid( self.HTML ) ) then return end
	if ( self.HTML:IsLoading() ) then return end

	self.HTML:RunJavascript( str )

end

local _nfCSS = [[
@keyframes nfFadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
#nf_loading{position:fixed;right:24px;top:calc(28px + (100vh - 56px) * var(--ld-y,1));transform:translateY(calc(-100% * var(--ld-y,1)));background:rgba(10,10,14,0.78);border:1px solid rgba(255,255,255,0.05);border-radius:8px;padding:14px 16px 12px 16px;display:flex;flex-direction:row;align-items:center;gap:12px;z-index:2147483647;pointer-events:none;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;box-shadow:0 4px 24px rgba(0,0,0,0.55)}
#nf_info{display:flex;flex-direction:column;gap:10px;width:var(--ld-w,280px)}
#nf_status{font-size:var(--ld-text,13px);color:rgba(225,238,255,0.90);letter-spacing:0.09em;text-shadow:0 1px 6px rgba(0,0,0,0.90);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.4}
#nf_cancel{font-size:calc(var(--ld-text,13px) * 0.77);width:6.6em;height:2.2em;flex-shrink:0;color:rgba(210,225,248,0.85);letter-spacing:0.09em;border-radius:4px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;pointer-events:none;user-select:none;-webkit-user-select:none}
#nf_track{width:100%;height:var(--ld-bar,7px);background:rgba(255,255,255,0.07);border-radius:9999px;overflow:hidden}
#nf_fill{height:100%;width:0%;border-radius:9999px;background:rgba(var(--vuo-a,35,135,237),0.95);box-shadow:0 0 10px rgba(var(--vuo-a,35,135,237),0.70);transition:width 0.45s cubic-bezier(0.4,0,0.2,1)}
]]

local _nfInjectJS = [[
(function(){
  if(document.getElementById('nf_loading'))return;
  var s=document.createElement('style');s.textContent=]] .. string.format("%q", _nfCSS) .. [[;
  document.head&&document.head.appendChild(s);
  var d=document.createElement('div');d.id='nf_loading';
  d.innerHTML='<div id="nf_info"><div id="nf_status">Connecting...</div><div id="nf_track"><div id="nf_fill"></div></div></div><div id="nf_cancel">Cancel</div>';
  document.body&&document.body.appendChild(d);
  window.SetLoadingFraction=function(f){var el=document.getElementById('nf_fill');if(el)el.style.width=(Math.max(0,Math.min(1,f))*100)+'%';};
  window.SetStatusChanged=function(t){var el=document.getElementById('nf_status');if(el&&t)el.innerText=t;};
})();
]]

local _nfStatusMap = {
	["Sending client info"]   = 0.05,
	["Receiving server info"] = 0.10,
	["Requesting resources"]  = 0.15,
	["Downloading resources"] = 0.25,
	["Loading resources"]     = 0.45,
	["Starting Lua"]          = 0.65,
	["Lua Started"]           = 0.85,
	["Initializing game"]     = 0.92,
}

local function NF_GetFractionForStatus( str )
	if !str then return nil end
	for key, val in pairs( _nfStatusMap ) do
		if string.find( str, key, 1, true ) then return val end
	end
	return nil
end

local _nfText = {
	connecting = { bg = "Свързване...", cs = "Připojování...", da = "Opretter forbindelse...", de = "Verbinde...", el = "Σύνδεση...", ["en-pt"] = "Settin' sail...", ["es-es"] = "Conectando...", et = "Ühendamine...", fi = "Yhdistetään...", fr = "Connexion...", he = "מתחבר...", hr = "Povezivanje...", hu = "Csatlakozás...", it = "Connessione...", ja = "接続中...", ko = "연결 중...", lt = "Jungiamasi...", nl = "Verbinden...", no = "Kobler til...", pl = "Łączenie...", ["pt-br"] = "Conectando...", ["pt-pt"] = "A ligar...", ru = "Подключение...", sk = "Pripájanie...", ["sv-se"] = "Ansluter...", th = "กำลังเชื่อมต่อ...", tr = "Bağlanılıyor...", uk = "Підключення...", vi = "Đang kết nối...", ["zh-cn"] = "正在连接...", ["zh-tw"] = "正在連線..." },
	lua_starting = { bg = "Стартиране на Lua...", cs = "Spouštění Lua...", da = "Starter Lua...", de = "Lua wird gestartet...", el = "Εκκίνηση Lua...", ["en-pt"] = "Firin' up the Lua...", ["es-es"] = "Iniciando Lua...", et = "Lua käivitamine...", fi = "Käynnistetään Luaa...", fr = "Démarrage de Lua...", he = "מפעיל את Lua...", hr = "Pokretanje Lua...", hu = "Lua indítása...", it = "Avvio di Lua...", ja = "Lua を起動中...", ko = "Lua 시작 중...", lt = "Paleidžiama Lua...", nl = "Lua wordt gestart...", no = "Starter Lua...", pl = "Uruchamianie Lua...", ["pt-br"] = "Iniciando Lua...", ["pt-pt"] = "A iniciar Lua...", ru = "Запуск Lua...", sk = "Spúšťanie Lua...", ["sv-se"] = "Startar Lua...", th = "กำลังเริ่ม Lua...", tr = "Lua başlatılıyor...", uk = "Запуск Lua...", vi = "Đang khởi động Lua...", ["zh-cn"] = "正在启动 Lua...", ["zh-tw"] = "正在啟動 Lua..." },
	lua_started = { bg = "Lua е стартиран!", cs = "Lua spuštěna!", da = "Lua startet!", de = "Lua gestartet!", el = "Το Lua ξεκίνησε!", ["en-pt"] = "Lua be runnin'!", ["es-es"] = "¡Lua iniciado!", et = "Lua käivitatud!", fi = "Lua käynnistetty!", fr = "Lua démarré !", he = "Lua הופעל!", hr = "Lua pokrenut!", hu = "Lua elindult!", it = "Lua avviato!", ja = "Lua を起動しました！", ko = "Lua 시작됨!", lt = "Lua paleista!", nl = "Lua gestart!", no = "Lua startet!", pl = "Lua uruchomione!", ["pt-br"] = "Lua iniciado!", ["pt-pt"] = "Lua iniciado!", ru = "Lua запущен!", sk = "Lua spustená!", ["sv-se"] = "Lua startat!", th = "เริ่ม Lua แล้ว!", tr = "Lua başlatıldı!", uk = "Lua запущено!", vi = "Đã khởi động Lua!", ["zh-cn"] = "Lua 已启动！", ["zh-tw"] = "Lua 已啟動！" },
	lua_received = { bg = "Всички нужни Lua файлове са получени!", cs = "Všechny potřebné soubory Lua přijaty!", da = "Alle nødvendige Lua-filer modtaget!", de = "Alle benötigten Lua-Dateien empfangen!", el = "Ελήφθησαν όλα τα απαραίτητα αρχεία Lua!", ["en-pt"] = "Got all the Lua we be needin'!", ["es-es"] = "¡Recibidos todos los archivos Lua necesarios!", et = "Kõik vajalikud Lua failid on käes!", fi = "Kaikki tarvittavat Lua-tiedostot vastaanotettu!", fr = "Tous les fichiers Lua nécessaires ont été reçus !", he = "התקבלו כל קבצי ה-Lua הדרושים!", hr = "Primljene su sve potrebne Lua datoteke!", hu = "Minden szükséges Lua-fájl megérkezett!", it = "Ricevuti tutti i file Lua necessari!", ja = "必要な Lua ファイルをすべて受信しました！", ko = "필요한 Lua 파일을 모두 받았습니다!", lt = "Gauti visi reikalingi Lua failai!", nl = "Alle benodigde Lua-bestanden ontvangen!", no = "Mottok alle nødvendige Lua-filer!", pl = "Odebrano wszystkie potrzebne pliki Lua!", ["pt-br"] = "Todos os arquivos Lua necessários foram recebidos!", ["pt-pt"] = "Todos os ficheiros Lua necessários foram recebidos!", ru = "Все нужные файлы Lua получены!", sk = "Všetky potrebné súbory Lua prijaté!", ["sv-se"] = "Alla nödvändiga Lua-filer har tagits emot!", th = "ได้รับไฟล์ Lua ที่จำเป็นครบแล้ว!", tr = "Gereken tüm Lua dosyaları alındı!", uk = "Усі потрібні файли Lua отримано!", vi = "Đã nhận đủ các tệp Lua cần thiết!", ["zh-cn"] = "已收到所有需要的 Lua 文件！", ["zh-tw"] = "已收到所有需要的 Lua 檔案！" },
	lua_requesting = { bg = "Изискване на {n} Lua файла от сървъра...", cs = "Vyžadování {n} souborů Lua ze serveru...", da = "Anmoder om {n} Lua-filer fra serveren...", de = "{n} Lua-Dateien werden vom Server angefordert...", el = "Αίτηση {n} αρχείων Lua από τον διακομιστή...", ["en-pt"] = "Askin' the server fer {n} Lua files...", ["es-es"] = "Solicitando {n} archivos Lua al servidor...", et = "Serverilt küsitakse {n} Lua faili...", fi = "Pyydetään {n} Lua-tiedostoa palvelimelta...", fr = "Demande de {n} fichiers Lua au serveur...", he = "מבקש {n} קבצי Lua מהשרת...", hr = "Traženje {n} Lua datoteka od poslužitelja...", hu = "{n} Lua-fájl lekérése a szerverről...", it = "Richiesta di {n} file Lua al server...", ja = "サーバーに {n} 個の Lua ファイルを要求中...", ko = "서버에 Lua 파일 {n}개 요청 중...", lt = "Iš serverio prašoma {n} Lua failų...", nl = "{n} Lua-bestanden opvragen bij de server...", no = "Ber serveren om {n} Lua-filer...", pl = "Pobieranie {n} plików Lua z serwera...", ["pt-br"] = "Solicitando {n} arquivos Lua do servidor...", ["pt-pt"] = "A pedir {n} ficheiros Lua ao servidor...", ru = "Запрос {n} файлов Lua с сервера...", sk = "Vyžadovanie {n} súborov Lua zo servera...", ["sv-se"] = "Begär {n} Lua-filer från servern...", th = "กำลังขอไฟล์ Lua {n} ไฟล์จากเซิร์ฟเวอร์...", tr = "Sunucudan {n} Lua dosyası isteniyor...", uk = "Запит {n} файлів Lua із сервера...", vi = "Đang yêu cầu {n} tệp Lua từ máy chủ...", ["zh-cn"] = "正在向服务器请求 {n} 个 Lua 文件...", ["zh-tw"] = "正在向伺服器請求 {n} 個 Lua 檔案..." },
	ws_mounting = { bg = "Зареждане на добавки от Работилницата", cs = "Připojování doplňků z Workshopu", da = "Indlæser Workshop-tilføjelser", de = "Workshop-Addons werden eingebunden", el = "Φόρτωση πρόσθετων του Εργαστηρίου", ["en-pt"] = "Loadin' Workshop plunder", ["es-es"] = "Montando complementos del Workshop", et = "Workshopi lisade laadimine", fi = "Ladataan Workshop-lisäosia", fr = "Montage des addons du Workshop", he = "טוען תוספים מה-Workshop", hr = "Učitavanje Workshop dodataka", hu = "Műhely-kiegészítők betöltése", it = "Caricamento addon del Workshop", ja = "ワークショップのアドオンをマウント中", ko = "창작마당 애드온 마운트 중", lt = "Prijungiami Workshop priedai", nl = "Workshop-add-ons laden", no = "Laster inn Workshop-tillegg", pl = "Montowanie dodatków z Warsztatu", ["pt-br"] = "Montando addons da Oficina", ["pt-pt"] = "A montar addons do Workshop", ru = "Подключение аддонов Мастерской", sk = "Pripájanie doplnkov z Workshopu", ["sv-se"] = "Laddar Workshop-tillägg", th = "กำลังโหลดแอดออนจากเวิร์กช็อป", tr = "Atölye eklentileri yükleniyor", uk = "Підключення аддонів Майстерні", vi = "Đang gắn addon từ Workshop", ["zh-cn"] = "正在挂载创意工坊插件", ["zh-tw"] = "正在掛載工作坊附加元件" },
	ws_complete = { bg = "Работилницата е готова!", cs = "Workshop dokončen!", da = "Workshop færdig!", de = "Workshop abgeschlossen!", el = "Το Εργαστήριο ολοκληρώθηκε!", ["en-pt"] = "Workshop be shipshape!", ["es-es"] = "¡Workshop completado!", et = "Workshop valmis!", fi = "Workshop valmis!", fr = "Workshop terminé !", he = "ה-Workshop הושלם!", hr = "Workshop dovršen!", hu = "Műhely kész!", it = "Workshop completato!", ja = "ワークショップ完了！", ko = "창작마당 완료!", lt = "Workshop baigta!", nl = "Workshop voltooid!", no = "Workshop fullført!", pl = "Warsztat gotowy!", ["pt-br"] = "Oficina concluída!", ["pt-pt"] = "Workshop concluído!", ru = "Мастерская готова!", sk = "Workshop dokončený!", ["sv-se"] = "Workshop klar!", th = "เวิร์กช็อปเสร็จสมบูรณ์!", tr = "Atölye tamamlandı!", uk = "Майстерню завершено!", vi = "Đã xong Workshop!", ["zh-cn"] = "创意工坊已完成！", ["zh-tw"] = "工作坊已完成！" },
	ws_waiting = { bg = "Изчакване на Работилницата в Steam...", cs = "Čekání na dokončení Steam Workshopu...", da = "Venter på, at Steam Workshop bliver færdig...", de = "Warte auf den Steam Workshop...", el = "Αναμονή για το Εργαστήριο του Steam...", ["en-pt"] = "Waitin' on the Steam Workshop...", ["es-es"] = "Esperando a que termine Steam Workshop...", et = "Ootan Steam Workshopi lõpetamist...", fi = "Odotetaan Steam Workshopin valmistumista...", fr = "En attente du Steam Workshop...", he = "ממתין לסיום Steam Workshop...", hr = "Čekanje da Steam Workshop završi...", hu = "Várakozás a Steam Műhelyre...", it = "In attesa dello Steam Workshop...", ja = "Steam ワークショップの完了を待機中...", ko = "Steam 창작마당 완료 대기 중...", lt = "Laukiama, kol baigs Steam Workshop...", nl = "Wachten tot Steam Workshop klaar is...", no = "Venter på at Steam Workshop blir ferdig...", pl = "Oczekiwanie na Warsztat Steam...", ["pt-br"] = "Aguardando a Oficina Steam terminar...", ["pt-pt"] = "A aguardar que o Steam Workshop termine...", ru = "Ожидание Мастерской Steam...", sk = "Čaká sa na dokončenie Steam Workshopu...", ["sv-se"] = "Väntar på att Steam Workshop ska bli klar...", th = "กำลังรอให้ Steam เวิร์กช็อปเสร็จสิ้น...", tr = "Steam Atölyesi'nin bitirmesi bekleniyor...", uk = "Очікування Майстерні Steam...", vi = "Đang chờ Steam Workshop hoàn tất...", ["zh-cn"] = "正在等待 Steam 创意工坊完成...", ["zh-tw"] = "正在等待 Steam 工作坊完成..." },
	ws_fetching = { bg = "Получаване на информация за добавките...", cs = "Získávání informací o doplňcích z Workshopu...", da = "Henter info om Workshop-tilføjelser...", de = "Infos zu Workshop-Addons werden abgerufen...", el = "Λήψη πληροφοριών για τα πρόσθετα...", ["en-pt"] = "Scoutin' the Workshop plunder...", ["es-es"] = "Obteniendo información de los complementos del Workshop...", et = "Workshopi lisade teabe hankimine...", fi = "Haetaan tietoja Workshop-lisäosista...", fr = "Récupération des infos des addons du Workshop...", he = "מקבל מידע על תוספי ה-Workshop...", hr = "Dohvaćanje podataka o Workshop dodacima...", hu = "Műhely-kiegészítők adatainak lekérése...", it = "Recupero informazioni sugli addon del Workshop...", ja = "ワークショップのアドオン情報を取得中...", ko = "창작마당 애드온 정보 가져오는 중...", lt = "Gaunama informacija apie Workshop priedus...", nl = "Info over Workshop-add-ons ophalen...", no = "Henter info om Workshop-tillegg...", pl = "Pobieranie informacji o dodatkach z Warsztatu...", ["pt-br"] = "Obtendo informações dos addons da Oficina...", ["pt-pt"] = "A obter informações dos addons do Workshop...", ru = "Получение данных об аддонах Мастерской...", sk = "Získavanie informácií o doplnkoch z Workshopu...", ["sv-se"] = "Hämtar info om Workshop-tillägg...", th = "กำลังดึงข้อมูลแอดออนจากเวิร์กช็อป...", tr = "Atölye eklentilerinin bilgileri alınıyor...", uk = "Отримання даних про аддони Майстерні...", vi = "Đang lấy thông tin addon Workshop...", ["zh-cn"] = "正在获取创意工坊插件信息...", ["zh-tw"] = "正在取得工作坊附加元件資訊..." },
	ws_downloading = { bg = "Изтегляне на съдържание от Работилницата", cs = "Stahování obsahu z Workshopu", da = "Henter Workshop-indhold", de = "Workshop-Inhalte werden heruntergeladen", el = "Λήψη περιεχομένου Εργαστηρίου", ["en-pt"] = "Haulin' in Workshop booty", ["es-es"] = "Descargando contenido del Workshop", et = "Workshopi sisu allalaadimine", fi = "Ladataan Workshop-sisältöä", fr = "Téléchargement du contenu du Workshop", he = "מוריד תוכן מה-Workshop", hr = "Preuzimanje Workshop sadržaja", hu = "Műhely-tartalom letöltése", it = "Download dei contenuti del Workshop", ja = "ワークショップのコンテンツをダウンロード中", ko = "창작마당 콘텐츠 다운로드 중", lt = "Atsisiunčiamas Workshop turinys", nl = "Workshop-inhoud downloaden", no = "Laster ned Workshop-innhold", pl = "Pobieranie zawartości z Warsztatu", ["pt-br"] = "Baixando conteúdo da Oficina", ["pt-pt"] = "A transferir conteúdo do Workshop", ru = "Загрузка контента Мастерской", sk = "Sťahovanie obsahu z Workshopu", ["sv-se"] = "Laddar ner Workshop-innehåll", th = "กำลังดาวน์โหลดเนื้อหาจากเวิร์กช็อป", tr = "Atölye içeriği indiriliyor", uk = "Завантаження вмісту Майстерні", vi = "Đang tải nội dung Workshop", ["zh-cn"] = "正在下载创意工坊内容", ["zh-tw"] = "正在下載工作坊內容" },
	cache_loading = { bg = "Зареждане на кеша на сървъра...", cs = "Načítání mezipaměti serveru...", da = "Indlæser serverens cache...", de = "Server-Cache wird geladen...", el = "Φόρτωση προσωρινής μνήμης διακομιστή...", ["en-pt"] = "Haulin' the server's cache aboard...", ["es-es"] = "Cargando la caché del servidor...", et = "Serveri vahemälu laadimine...", fi = "Ladataan palvelimen välimuistia...", fr = "Chargement du cache du serveur...", he = "טוען את מטמון השרת...", hr = "Učitavanje predmemorije poslužitelja...", hu = "Szerver gyorsítótárának betöltése...", it = "Caricamento della cache del server...", ja = "サーバーキャッシュを読み込み中...", ko = "서버 캐시 불러오는 중...", lt = "Įkeliama serverio talpykla...", nl = "Servercache laden...", no = "Laster inn serverbuffer...", pl = "Wczytywanie pamięci podręcznej serwera...", ["pt-br"] = "Carregando o cache do servidor...", ["pt-pt"] = "A carregar a cache do servidor...", ru = "Загрузка кэша сервера...", sk = "Načítavanie vyrovnávacej pamäte servera...", ["sv-se"] = "Laddar serverns cache...", th = "กำลังโหลดแคชของเซิร์ฟเวอร์...", tr = "Sunucu önbelleği yükleniyor...", uk = "Завантаження кешу сервера...", vi = "Đang tải bộ nhớ đệm máy chủ...", ["zh-cn"] = "正在加载服务器缓存...", ["zh-tw"] = "正在載入伺服器快取..." },
	map_loading = { bg = "Зареждане на картата...", cs = "Načítání mapy...", da = "Indlæser banen...", de = "Karte wird geladen...", el = "Φόρτωση χάρτη...", ["en-pt"] = "Unrollin' the map...", ["es-es"] = "Cargando el mapa...", et = "Kaardi laadimine...", fi = "Ladataan karttaa...", fr = "Chargement de la carte...", he = "טוען את המפה...", hr = "Učitavanje mape...", hu = "Pálya betöltése...", it = "Caricamento della mappa...", ja = "マップを読み込み中...", ko = "맵 불러오는 중...", lt = "Įkeliamas žemėlapis...", nl = "Map laden...", no = "Laster inn kartet...", pl = "Wczytywanie mapy...", ["pt-br"] = "Carregando o mapa...", ["pt-pt"] = "A carregar o mapa...", ru = "Загрузка карты...", sk = "Načítavanie mapy...", ["sv-se"] = "Laddar kartan...", th = "กำลังโหลดแผนที่...", tr = "Harita yükleniyor...", uk = "Завантаження мапи...", vi = "Đang tải bản đồ...", ["zh-cn"] = "正在加载地图...", ["zh-tw"] = "正在載入地圖..." },
	files_downloading = { bg = "Изтегляне на файлове...", cs = "Stahování souborů...", da = "Henter filer...", de = "Dateien werden heruntergeladen...", el = "Λήψη αρχείων...", ["en-pt"] = "Haulin' in the cargo...", ["es-es"] = "Descargando archivos...", et = "Failide allalaadimine...", fi = "Ladataan tiedostoja...", fr = "Téléchargement des fichiers...", he = "מוריד קבצים...", hr = "Preuzimanje datoteka...", hu = "Fájlok letöltése...", it = "Download dei file...", ja = "ファイルをダウンロード中...", ko = "파일 다운로드 중...", lt = "Atsisiunčiami failai...", nl = "Bestanden downloaden...", no = "Laster ned filer...", pl = "Pobieranie plików...", ["pt-br"] = "Baixando arquivos...", ["pt-pt"] = "A transferir ficheiros...", ru = "Загрузка файлов...", sk = "Sťahovanie súborov...", ["sv-se"] = "Laddar ner filer...", th = "กำลังดาวน์โหลดไฟล์...", tr = "Dosyalar indiriliyor...", uk = "Завантаження файлів...", vi = "Đang tải tệp...", ["zh-cn"] = "正在下载文件...", ["zh-tw"] = "正在下載檔案..." },
	cancel = { bg = "Отказ", cs = "Zrušit", da = "Annullér", de = "Abbrechen", el = "Ακύρωση", ["en-pt"] = "Abort", ["es-es"] = "Cancelar", et = "Loobu", fi = "Peruuta", fr = "Annuler", he = "ביטול", hr = "Otkaži", hu = "Mégse", it = "Annulla", ja = "キャンセル", ko = "취소", lt = "Atšaukti", nl = "Annuleren", no = "Avbryt", pl = "Anuluj", ["pt-br"] = "Cancelar", ["pt-pt"] = "Cancelar", ru = "Отмена", sk = "Zrušiť", ["sv-se"] = "Avbryt", th = "ยกเลิก", tr = "İptal Et", uk = "Скасувати", vi = "Hủy", ["zh-cn"] = "取消", ["zh-tw"] = "取消" },
}

local _nfStatusKeys = {
	["Connecting..."]                          = "connecting",
	["Starting Lua..."]                        = "lua_starting",
	["Lua Started!"]                           = "lua_started",
	["Received all Lua files we needed!"]      = "lua_received",
	["Mounting Workshop Addons"]               = "ws_mounting",
	["Workshop Complete!"]                     = "ws_complete",
	["Waiting for Steam Workshop to finish..."] = "ws_waiting",
	["Fetching info about workshop addons..."] = "ws_fetching",
	["Downloading Workshop content"]           = "ws_downloading",
	["Loading server cache content..."]        = "cache_loading",
	["Loading the map..."]                     = "map_loading",
}

local function NF_Text( key, fallback )
	local t = _nfText[ key ]
	if !t then return fallback end
	local lang = string.lower( GetConVarString( "gmod_language" ) or "" )
	return t[ lang ] or t[ string.match( lang, "^[^%-]+" ) or "" ] or fallback
end

local function NF_TranslateStatus( str )
	if !isstring( str ) then return str end
	local trimmed = string.Trim( str )
	local key = _nfStatusKeys[ trimmed ]
	if key then return NF_Text( key, str ) end
	local n = string.match( trimmed, "^Requesting (%d+) Lua files from the server%.%.%.$" )
	if n then
		local t = NF_Text( "lua_requesting" )
		if t then return ( string.gsub( t, "{n}", n ) ) end
	end
	return str
end

function PANEL:OnActivate()

	if ( IsValid( pnlMainMenu ) ) then
		pcall( function() pnlMainMenu:Call( "if(window.vuoGameState){vuoGameState(true,false);}" ) end )
	end

	self:ShowURL( GetDefaultLoadingHTML() )

	self.NumDownloadables    = 0
	self.CheckedSingleplayer = false
	self.nfInjected          = false
	self.nfLastStatus        = "Connecting..."
	self.nfLastFraction      = 0

end

function PANEL:OnDeactivate()

	if ( IsValid( self.HTML ) ) then self.HTML:Remove() end
	self.LoadedURL = nil
	self.NumDownloadables = 0

	system.FlashWindow()

end

function PANEL:OnScreenSizeChanged( oldW, oldH, newW, newH )

	self:InvalidateLayout( true )

end

function PANEL:Think()

	self:CheckForStatusChanges()
	self:CheckDownloadTables()

	if ( !self.CheckedSingleplayer && IsHostingGame() ) then
		local map = GetConVarString( "host_map" )
		map = string.StripExtension( map )

		GameDetails( GetConVarString( "hostname" ), "127.0.0.1", map, 1, 1, "", GetConVarString( "gamemode" ) )
		self.CheckedSingleplayer = true
	end

	if !self.nfInjected && IsValid( self.HTML ) && !self.HTML:IsLoading() then
		self:RunJavascript( _nfInjectJS )

		self:RunJavascript( nfStyleInjectJS() )

		local s = NF_TranslateStatus( self.nfLastStatus or "Connecting..." )
		local fr = self.nfLastFraction or 0
		self:RunJavascript( "window.nfTxtFiles='" .. NF_Text( "files_downloading", "Downloading files..." ):JavascriptSafe() .. "';var c=document.getElementById('nf_cancel');if(c)c.innerText='" .. NF_Text( "cancel", "Cancel" ):JavascriptSafe() .. "';" )
		self:RunJavascript( "if(window.SetStatusChanged) SetStatusChanged('" .. s:JavascriptSafe() .. "')" )
		self:RunJavascript( "if(window.SetLoadingFraction) SetLoadingFraction(" .. fr .. ")" )
		self.nfInjected = true
	elseif self.nfInjected && IsValid( self.HTML ) && self.HTML:IsLoading() then
		self.nfInjected = false
	end

end

function PANEL:StatusChanged( strStatus )

	self.nfLastStatus = strStatus
	local f = NF_GetFractionForStatus( strStatus )
	if f then
		self.nfLastFraction = f
		self:RunJavascript( "if(window.SetLoadingFraction) SetLoadingFraction(" .. f .. ")" )
	end

	self:RunJavascript( "if(window.SetStatusChanged) SetStatusChanged('" .. NF_TranslateStatus( strStatus ):JavascriptSafe() .. "')" )

	local matchedFileName = string.match( strStatus, "%w+/%w+ [-] (.+) is downloading" )
	if ( matchedFileName ) then

		self:RunJavascript( "if ( window.DownloadingFile ) DownloadingFile( '" .. matchedFileName:JavascriptSafe() .. "' )" )

		return

	end

	local startPos, _ = string.find( strStatus, "Downloading " )
	if ( startPos ) then

		strStatus = string.sub( strStatus, startPos )

		if ( string.EndsWith( strStatus, "via Workshop" ) ) then
			strStatus = string.gsub( strStatus, "' via Workshop", "" )
			strStatus = string.gsub( strStatus, "Downloading '", "" )
		end

		local fileName = string.gsub( strStatus, "Downloading ", "" )

		self:RunJavascript( "if ( window.DownloadingFile ) DownloadingFile( '" .. fileName:JavascriptSafe() .. "' )" )

		return

	end

end

function PANEL:CheckForStatusChanges()

	local str = GetLoadStatus()
	if ( !str ) then return end

	str = string.Trim( str )
	str = string.Trim( str, "\n" )
	str = string.Trim( str, "\t" )

	str = string.gsub( str, "%.bz2", "" )
	str = string.gsub( str, "%.ztmp", "" )
	str = string.gsub( str, "\\", "/" )

	if ( self.OldStatus && self.OldStatus == str ) then return end

	self.OldStatus = str
	self:StatusChanged( str )

end

function PANEL:RefreshDownloadables()

	self.Downloadables = GetDownloadables()
	if ( !self.Downloadables ) then return end

	local iDownloading = 0
	local iFileCount = 0
	for k, v in pairs( self.Downloadables ) do

		v = string.gsub( v, "%.bz2", "" )
		v = string.gsub( v, "%.ztmp", "" )
		v = string.gsub( v, "\\", "/" )

		iDownloading = iDownloading + self:FileNeedsDownload( v )
		iFileCount = iFileCount + 1

	end

	if ( iDownloading == 0 ) then return end

	self:RunJavascript( "if ( window.SetFilesNeeded ) SetFilesNeeded( " .. iDownloading .. ")" )
	self:RunJavascript( "if ( window.SetFilesTotal ) SetFilesTotal( " .. iFileCount .. ")" )

end

function PANEL:FileNeedsDownload( filename )

	local bExists = file.Exists( filename, "GAME" )
	if ( bExists ) then return 0 end

	return 1

end

function PANEL:CheckDownloadTables()

	local NumDownloadables = NumDownloadables()
	if ( !NumDownloadables ) then return end

	if ( self.NumDownloadables && NumDownloadables == self.NumDownloadables ) then return end

	self.NumDownloadables = NumDownloadables
	self:RefreshDownloadables()

end

local PanelType_Loading = vgui.RegisterTable( PANEL, "EditablePanel" )

local pnlLoading = nil

function GetLoadPanel()

	if ( !IsValid( pnlLoading ) ) then
		pnlLoading = vgui.CreateFromTable( PanelType_Loading )
	end

	return pnlLoading

end

function IsInLoading()

	if ( !IsValid( pnlLoading ) || !IsValid( pnlLoading.HTML ) ) then
		return false
	end

	return true

end

function GameDetails( servername, serverurl, mapname, maxplayers, maxplayers_visible, steamid, gamemode )

	if ( engine.IsPlayingDemo() ) then return end

	serverurl = serverurl:Replace( "%s", steamid )
	serverurl = serverurl:Replace( "%m", mapname )

	if ( maxplayers > 1 && GetConVar( "cl_enable_loadingurl" ):GetBool() && ( serverurl:StartsWith( "http" ) || serverurl:StartsWith( "asset://" ) ) ) then
		pnlLoading:ShowURL( serverurl, true )
	end

	local niceGamemode = gamemode
	for k, v in pairs( engine.GetGamemodes() ) do
		if ( niceGamemode == v.name ) then
			niceGamemode = v.title
			break
		end
	end

	pnlLoading.JavascriptRun = string.format( [[if ( window.GameDetails ) GameDetails( "%s", "%s", "%s", %i, "%s", "%s", %.2f, "%s", "%s" );]],
		servername:JavascriptSafe(), serverurl:JavascriptSafe(), mapname:JavascriptSafe(), maxplayers_visible, steamid:JavascriptSafe(), gamemode:JavascriptSafe(),
		GetConVarNumber( "snd_musicvolume" ), GetConVarString( "gmod_language" ):JavascriptSafe(), niceGamemode:JavascriptSafe() )

end

do
    local FOLDER = "sound/vuo_music"
    local EXTS   = { "*.mp3", "*.ogg", "*.wav", "*.flac" }

    local function vuoGetTracks()
        local out = {}
        for _, ext in ipairs( EXTS ) do
            local files = file.Find( FOLDER .. "/" .. ext, "GAME" )
            if ( istable( files ) ) then
                for _, fn in ipairs( files ) do out[ #out + 1 ] = fn end
            end
        end
        table.sort( out )
        return out
    end

    local function vuoPushTracks()
        if ( not IsValid( pnlMainMenu ) ) then return end
        local parts = {}
        for _, fn in ipairs( vuoGetTracks() ) do
            local name = string.gsub( string.StripExtension( fn ), "_", " " )
            local url  = "asset://garrysmod/" .. FOLDER .. "/" .. fn
            parts[ #parts + 1 ] = "{name:\"" .. name:JavascriptSafe() ..
                                  "\",url:\"" .. url:JavascriptSafe() .. "\"}"
        end

        pcall( function()
            pnlMainMenu:Call( "if(window.vuoSetMusic){vuoSetMusic([" ..
                table.concat( parts, "," ) .. "]);}" )
        end )
    end

    timer.Simple( 2, function()
        print( "[VUO Music] " .. #vuoGetTracks() .. " track(s) in garrysmod/" .. FOLDER ..
               " | pnlMainMenu=" .. tostring( IsValid( pnlMainMenu ) ) )
    end )

    local n = 0
    local function loop()
        n = n + 1
        vuoPushTracks()
        if ( n < 15 ) then timer.Simple( 1, loop ) end
    end
    timer.Simple( 1, loop )
end

do
    local BG_FOLDER     = "materials/vuo_backgrounds"
    local BG_EXTS       = { "*.png", "*.jpg", "*.jpeg" }

    local function vuoBackgrounds()
        local out = {}
        for _, ext in ipairs( BG_EXTS ) do
            local files = file.Find( BG_FOLDER .. "/" .. ext, "GAME" )
            if ( istable( files ) ) then
                for _, fn in ipairs( files ) do out[ #out + 1 ] = fn end
            end
        end
        table.sort( out )
        return out
    end

    local function vuoDefaultBackgrounds()
        local out, seen = {}, {}
        local function add( path, fn )
            local low = string.lower( path )
            if ( seen[ low ] ) then return end
            seen[ low ] = true
            out[ #out + 1 ] = {
                name = string.gsub( string.StripExtension( fn ), "_", " " ),
                url  = "asset://garrysmod/" .. path,
            }
        end
        for _, ext in ipairs( BG_EXTS ) do
            local files = file.Find( "backgrounds/" .. ext, "MOD" )
            if ( istable( files ) ) then
                for _, fn in ipairs( files ) do add( "backgrounds/" .. fn, fn ) end
            end
        end
        table.sort( out, function( a, b ) return a.name < b.name end )
        return out
    end

    local function vuoPush()
        if ( not IsValid( pnlMainMenu ) ) then return end

        local parts = {}
        for _, fn in ipairs( vuoBackgrounds() ) do
            parts[ #parts + 1 ] = "{name:\"" .. string.gsub( string.StripExtension( fn ), "_", " " ):JavascriptSafe() ..
                                  "\",url:\"asset://garrysmod/" .. BG_FOLDER .. "/" .. fn .. "\"}"
        end
        local dparts = {}
        for _, b in ipairs( vuoDefaultBackgrounds() ) do
            dparts[ #dparts + 1 ] = "{name:\"" .. b.name:JavascriptSafe() ..
                                    "\",url:\"" .. b.url:JavascriptSafe() .. "\"}"
        end
        local raw = nfSettingsRaw() or "{}"
        pcall( function()
            pnlMainMenu:Call( "if(window.vuoSetBackgrounds){vuoSetBackgrounds([" .. table.concat( parts, "," ) .. "]);}" )
            pnlMainMenu:Call( "if(window.vuoSetDefaultBackgrounds){vuoSetDefaultBackgrounds([" .. table.concat( dparts, "," ) .. "]);}" )
            pnlMainMenu:Call( "if(window.vuoApplySettings){vuoApplySettings(" .. raw .. ");}" )
        end )
    end

    local n = 0
    local function loop()
        n = n + 1
        vuoPush()
        if ( n < 15 ) then timer.Simple( 1, loop ) end
    end
    timer.Simple( 1.2, loop )
end

do
    local active, opts = {}, { swap = 30, zoom = true, darken = 0, fade = true, cssmode = false }
    local mats = {}
    local idx, prevIdx, swapAt, fadeAt = 1, nil, 0, 0

    local function matFor( path )
        if ( mats[ path ] ) then return mats[ path ] end
        local m = Material( path, "nocull smooth" )
        mats[ path ] = m
        return m
    end

    local function clean( p )
        p = tostring( p or "" )
        p = string.gsub( p, "^asset://garrysmod/", "" )
        p = string.gsub( p, "^materials/", "" )
        return p
    end

    function VUO_SetBackground( json )
        local d = util.JSONToTable( json or "{}" ) or {}
        local list = istable( d.on ) and d.on or {}
        local o = istable( d.opts ) and d.opts or {}
        active = {}
        for _, p in ipairs( list ) do
            local c = clean( p )
            if ( c ~= "" ) then active[ #active + 1 ] = c end
        end
        opts.swap   = math.max( 2, tonumber( o.swap ) or 30 )
        opts.zoom   = o.zoom and true or false
        opts.anim   = ( o.anim and tostring( o.anim ) ) or ( opts.zoom and "zoom" or "none" )
        opts.cssmode = o.cssmode and true or false
        opts.fade   = o.fade ~= false
        idx = 1; prevIdx = nil; swapAt = SysTime() + opts.swap
    end

    local function drawImg( path, alpha )
        if ( alpha <= 0 ) then return end
        local m = matFor( path )
        if ( not m or m:IsError() ) then return end
        surface.SetMaterial( m )
        local w, h = ScrW(), ScrH()
        local now = SysTime()
        local anim = opts.anim or "none"
        local s, ox, oy = 1.0, 0, 0
        if ( anim == "zoom" ) then
            s = 1.04 + ( math.sin( now * 0.18 ) * 0.5 + 0.5 ) * 0.08
        elseif ( anim == "pan" ) then
            s = 1.12
            ox = math.sin( now * 0.13 ) * ( w * 0.03 )
            oy = math.cos( now * 0.10 ) * ( h * 0.02 )
        elseif ( anim == "float" ) then
            s = 1.08 + ( math.sin( now * 0.12 ) * 0.5 + 0.5 ) * 0.03
            ox = math.sin( now * 0.09 ) * ( w * 0.018 )
            oy = math.sin( now * 0.07 ) * ( h * 0.018 )
        end
        surface.SetDrawColor( 255, 255, 255, alpha )
        surface.DrawTexturedRectRotated( w * 0.5 + ox, h * 0.5 + oy, w * s, h * s, 0 )
    end

    local origDraw = DrawBackground
    local function VUODrawBackground()

        local inGame = ( isfunction( IsInGame ) and IsInGame() ) or ( isfunction( IsInLoading ) and IsInLoading() )
        if ( inGame ) then
            if ( isfunction( origDraw ) ) then return origDraw() end
            return
        end
        if ( opts.cssmode ) then
            surface.SetDrawColor( 0, 0, 0, 255 )
            surface.DrawRect( 0, 0, ScrW(), ScrH() )
            return
        end
        if ( #active == 0 ) then
            if ( isfunction( origDraw ) ) then return origDraw() end
            return
        end
        local now = SysTime()
        if ( #active > 1 and now >= swapAt ) then
            prevIdx = idx
            idx = idx % #active + 1
            swapAt = now + opts.swap
            fadeAt = now
        end
        local cur = active[ idx ]
        if ( not cur ) then return end
        local t = opts.fade and math.Clamp( ( now - fadeAt ) / 1.2, 0, 1 ) or 1
        if ( prevIdx and active[ prevIdx ] and t < 1 ) then
            drawImg( active[ prevIdx ], 255 )
            drawImg( cur, math.floor( t * 255 ) )
        else
            drawImg( cur, 255 )
            prevIdx = nil
        end
    end

    local seeded = false
    timer.Create( "VUO_BgHijack", 1, 0, function()
        if ( DrawBackground ~= VUODrawBackground ) then
            if ( isfunction( DrawBackground ) ) then origDraw = DrawBackground end
            _G.DrawBackground = VUODrawBackground
        end
        if ( not seeded ) then
            seeded = true
            local raw = nfSettingsRaw()
            local cfg = raw and util.JSONToTable( raw ) or nil
            if ( cfg and istable( cfg.bgOn ) ) then
                VUO_SetBackground( util.TableToJSON( {
                    on = cfg.bgOn,
                    opts = {
                        swap   = cfg.bgSwap,
                        anim   = ( not cfg.bgBlurOn and cfg.bganim ) or "none",
                        zoom   = ( not cfg.bgBlurOn and cfg.bganim and cfg.bganim ~= "none" ) and true or false,
                        cssmode = ( cfg.bgBlurOn and ( tonumber( cfg.bgBlur ) or 0 ) > 0 ) or false,
                        fade   = cfg.bgFade,
                    },
                } ) )
            end
        end
    end )
end

do
    local FONT_FOLDER  = "materials/vuo_fonts"
    local SOUND_FOLDER = "sound/vuo_sounds"

    local function vuoFonts()
        local out = {}
        for _, ext in ipairs( { "*.ttf", "*.otf" } ) do
            local files = file.Find( FONT_FOLDER .. "/" .. ext, "GAME" )
            if ( istable( files ) ) then
                for _, fn in ipairs( files ) do out[ #out + 1 ] = fn end
            end
        end
        table.sort( out )
        return out
    end

    local function vuoFindSound( base )
        for _, ext in ipairs( { ".wav", ".mp3", ".ogg" } ) do
            if ( file.Exists( SOUND_FOLDER .. "/" .. base .. ext, "GAME" ) ) then
                return "vuo_sounds/" .. base .. ext
            end
        end
        return nil
    end

    local function vuoPushExtras()
        if ( not IsValid( pnlMainMenu ) ) then return end

        local fparts = {}
        for _, fn in ipairs( vuoFonts() ) do
            fparts[ #fparts + 1 ] = "{name:\"" .. string.StripExtension( fn ):JavascriptSafe() ..
                                    "\",url:\"asset://garrysmod/" .. FONT_FOLDER .. "/" .. fn:JavascriptSafe() .. "\"}"
        end

        local hover, click, back = vuoFindSound( "hover" ), vuoFindSound( "click" ), vuoFindSound( "back" )
        local function js( v ) return v and ( "\"" .. v:JavascriptSafe() .. "\"" ) or "null" end

        pcall( function()
            pnlMainMenu:Call( "if(window.vuoSetFonts){vuoSetFonts([" .. table.concat( fparts, "," ) .. "]);}" )
            pnlMainMenu:Call( "if(window.vuoSetSounds){vuoSetSounds({hover:" .. js( hover ) .. ",click:" .. js( click ) .. ",back:" .. js( back ) .. "});}" )
        end )
    end

    local n = 0
    local function loop()
        n = n + 1
        vuoPushExtras()
        if ( n < 15 ) then timer.Simple( 1, loop ) end
    end
    timer.Simple( 1.4, loop )
end

do
    local pnl = nil
    local wrapped = false
    local lastOpen = nil
    timer.Create( "VUO_ProblemsActive", 0.2, 0, function()
        if ( not wrapped and isfunction( OpenProblemsPanel ) ) then
            wrapped = true
            local orig = OpenProblemsPanel
            OpenProblemsPanel = function()
                local w = vgui.GetWorldPanel()
                local before = {}
                if ( IsValid( w ) ) then for _, c in ipairs( w:GetChildren() ) do before[ c ] = true end end
                orig()
                if ( IsValid( w ) ) then for _, c in ipairs( w:GetChildren() ) do if ( not before[ c ] ) then pnl = c break end end end
            end
        end
        local open = false
        pcall( function() open = IsValid( pnl ) and pnl:IsVisible() and true or false end )
        if ( open ~= lastOpen ) then
            lastOpen = open
            if ( IsValid( pnlMainMenu ) ) then
                pcall( function() pnlMainMenu:Call( "window.vuoProblemsOpen=" .. ( open and "true" or "false" ) .. ";" ) end )
            end
        end
    end )
end

do
    local last = nil
    timer.Create( "VUO_MusicGameState", 0.25, 0, function()
        if ( not IsValid( pnlMainMenu ) ) then return end

        local loading = ( isfunction( IsInLoading ) and IsInLoading() ) and true or false
        local ingame  = ( isfunction( IsInGame )    and IsInGame()    ) and true or false

        local state = tostring( loading ) .. "|" .. tostring( ingame )
        if ( state == last ) then return end
        last = state

        pcall( function()
            pnlMainMenu:Call( string.format( "if(window.vuoGameState){vuoGameState(%s,%s);}",
                loading and "true" or "false", ingame and "true" or "false" ) )
        end )
    end )
end

