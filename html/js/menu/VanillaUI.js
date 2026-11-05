
(function() {
    function patchJQuery() {
        if (typeof $ === 'undefined' || !$.fn) { setTimeout(patchJQuery, 200); return; }
        if ($.fn._nfFadePatched) return;
        $.fn._nfFadePatched = true;

        var _toggle = $.fn.toggle;
        var _hide   = $.fn.hide;

        function nfFadeClose(el, ms) {
            el.css('animation', 'none');
            el.stop(true, true).fadeOut(ms, function() {
                $(this).css('animation', '');
            });
        }

        $.fn.toggle = function() {
            if (arguments.length === 0 && this.is('ul.popup')) {
                return this.each(function() {
                    var el = $(this);
                    if (el.is(':visible')) {
                        nfFadeClose(el, 450);
                    } else {
                        el.css('animation', '');
                        el.stop(true, true).show();
                    }
                });
            }
            return _toggle.apply(this, arguments);
        };

        $.fn.hide = function() {
            if (arguments.length === 0 && this.is('ul.popup') && this.is(':visible')) {
                var el = this;
                el.each(function() { nfFadeClose($(this), 450); });
                return el;
            }
            return _hide.apply(this, arguments);
        };
    }
    patchJQuery();
})();

(function() {
    function wrapUpdateNewsList() {
        if (typeof UpdateNewsList === 'undefined') {
            setTimeout(wrapUpdateNewsList, 200);
            return;
        }
        if (UpdateNewsList._nfWrapped) return;
        var _orig = UpdateNewsList;
        UpdateNewsList = function(newslist, hide) {

            if (typeof window.vuoUserHideNews === 'undefined') {
                window.vuoUserHideNews = true;
            }
            _orig(newslist, window.vuoUserHideNews);
        };
        UpdateNewsList._nfWrapped = true;
    }
    setTimeout(wrapUpdateNewsList, 100);
})();

(function() {

    var VUO_ICONS = {
        news:     '<rect x="2" y="3" width="12" height="10" rx="1.6"/><path d="M5 6.3h6M5 8.8h6M5 11.3h3.5"/>',
        music:    '<path d="M6.2 11.6V4.1l7-1.6v7.6"/><circle cx="4.6" cy="11.8" r="1.7"/><circle cx="11.6" cy="10.3" r="1.7"/>',
        settings: '<path d="M6.38 3.27L6.62 1.54L9.38 1.54L9.62 3.27L10.2 3.51L11.59 2.46L13.54 4.41L12.49 5.8L12.73 6.38L14.46 6.62L14.46 9.38L12.73 9.62L12.49 10.2L13.54 11.59L11.59 13.54L10.2 12.49L9.62 12.73L9.38 14.46L6.62 14.46L6.38 12.73L5.8 12.49L4.41 13.54L2.46 11.59L3.51 10.2L3.27 9.62L1.54 9.38L1.54 6.62L3.27 6.38L3.51 5.8L2.46 4.41L4.41 2.46L5.8 3.51Z"/><circle cx="8" cy="8" r="2.1"/>'
    };
    function vuoIcon(name){
        return '<span class="vuo-navicon"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + VUO_ICONS[name] + '</svg></span>';
    }
    var VUO_MP_ICONS = {
        play:    '<path d="M5.2 3.3v9.4a.7.7 0 0 0 1.07.6l7.1-4.7a.7.7 0 0 0 0-1.2l-7.1-4.7a.7.7 0 0 0-1.07.6z"/>',
        pause:   '<path d="M5.5 3.5v9M10.5 3.5v9"/>',
        prev:    '<path d="M3.5 3.5v9"/><path d="M12.5 4.1v7.8a.6.6 0 0 1-.94.5L6.2 8.5a.6.6 0 0 1 0-1l5.36-3.9a.6.6 0 0 1 .94.5z"/>',
        next:    '<path d="M12.5 3.5v9"/><path d="M3.5 4.1v7.8a.6.6 0 0 0 .94.5L9.8 8.5a.6.6 0 0 0 0-1L4.44 3.6a.6.6 0 0 0-.94.5z"/>',
        vol:     '<path d="M2.5 6.1h2.3L8 3.4v9.2L4.8 9.9H2.5z"/><path class="vuo-w1" d="M10.6 6.2a2.5 2.5 0 0 1 0 3.6"/><path class="vuo-w2" d="M12.5 4.4a5 5 0 0 1 0 7.2"/><path class="vuo-wx" d="M10.8 6.2l3.4 3.6M14.2 6.2l-3.4 3.6"/>',
        shuffle: '<path d="M2 4.6h2.1c1.3 0 2.1.6 2.8 1.7l2.2 3.4c.7 1.1 1.5 1.7 2.8 1.7H14"/><path d="M2 11.4h2.1c.8 0 1.4-.2 1.9-.6M10 5.2c.5-.4 1.1-.6 1.9-.6H14"/><path d="M12.3 2.9L14 4.6l-1.7 1.7M12.3 9.7L14 11.4l-1.7 1.7"/>',
        repeat:  '<path d="M11.4 1.8l1.9 1.9-1.9 1.9"/><path d="M2.7 7.2v-.7a2.8 2.8 0 0 1 2.8-2.8h7.8"/><path d="M4.6 14.2l-1.9-1.9 1.9-1.9"/><path d="M13.3 8.8v.7a2.8 2.8 0 0 1-2.8 2.8H2.7"/><path class="vuo-one" d="M7.3 7.1l1-.7v3.2"/>',
        expand:  '<path d="M6 2.5H3.5a1 1 0 0 0-1 1V6M10 2.5h2.5a1 1 0 0 1 1 1V6M6 13.5H3.5a1 1 0 0 1-1-1V10M10 13.5h2.5a1 1 0 0 0 1-1V10"/>',
        yt:      '<rect x="1.8" y="3.4" width="12.4" height="9.2" rx="2.6"/><path d="M6.7 6.1v3.8L9.9 8z"/>'
    };
    function vuoMpIco(name){
        return '<span class="vuo-mpi vuo-mpi-' + name + '"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + (VUO_MP_ICONS[name] || VUO_ICONS[name]) + '</svg></span>';
    }

    function styleNewsItem(item) {
        if (item._nfDone) return;
        item._nfDone = true;
        var span = item.querySelector('div > span');
        if (!span) return;

        span.addEventListener('mouseenter', function() {
            if (typeof lua !== 'undefined') lua.PlaySound('garrysmod/ui_hover.wav');
        });
        span.addEventListener('click', function() {
            if (typeof lua !== 'undefined') lua.PlaySound('garrysmod/ui_click.wav');
        });
    }

    function nfNewsButtonSounds(news) {
        var btns = news.querySelectorAll('.news_buttons div');
        for (var i = 0; i < btns.length; i++) {
            (function(b) {
                if (b._nfBtn) return;
                b._nfBtn = true;
                b.addEventListener('mouseenter', function() { vuoUiPlay('focus'); });
                b.addEventListener('click', function(e) {
                    if (e.isTrusted) vuoUiPlay(b.getAttribute('ng-click') === 'ToggleNewsList()' ? 'back' : 'accept');
                });
            })(btns[i]);
        }
    }

    var nfNewsBtn = null;

    var newsAutoPlay = {
        timer: null,
        paused: false,
        interval: 15000,
        start: function() {
            if (this.timer) return;
            var self = this;
            this.timer = setInterval(function() {
                if (self.paused) return;

                if (!window.nfNewsOpen) return;

                var btns = document.querySelectorAll('.news_buttons div[ng-repeat]');
                if (btns.length < 2) return;
                var cur = -1;
                for (var i = 0; i < btns.length; i++) {
                    if (btns[i].classList.contains('selected')) { cur = i; break; }
                }
                var next = (cur + 1) % btns.length;
                btns[next].click();
            }, this.interval);
        }
    };

    document.addEventListener('mouseover', function(e) {
        var news = document.querySelector('.news');
        if (news && news.contains(e.target)) newsAutoPlay.paused = true;
    });
    document.addEventListener('mouseout', function(e) {
        var news = document.querySelector('.news');
        if (news && news.contains(e.target)) newsAutoPlay.paused = false;
    });

    function initNewsBtn() {
        if (nfNewsBtn) return;

        var newsDiv = document.querySelector('.news');
        if (!newsDiv) return;

        var btn = document.createElement('div');
        btn.id = 'nf_news_btn';
        nfNewsBtn = btn;

        var nfNewsI18n = {
            'en':       'News',
            'de':       'Neuigkeiten',
            'fr':       'Actualités',
            'es':       'Noticias',
            'es-es':    'Noticias',
            'pt':       'Notícias',
            'pt-br':    'Notícias',
            'pt-pt':    'Notícias',
            'it':       'Notizie',
            'nl':       'Nieuws',
            'pl':       'Aktualności',
            'ru':       'Новости',
            'uk':       'Новини',
            'cs':       'Novinky',
            'hu':       'Hírek',
            'ro':       'Știri',
            'tr':       'Haberler',
            'fi':       'Uutiset',
            'sv-se':    'Nyheter',
            'da':       'Nyheder',
            'no':       'Nyheter',
            'ko':       '뉴스',
            'ja':       'ニュース',
            'zh-cn':    '新闻',
            'zh-tw':    '新聞',
            'th':       'ข่าวสาร',
            'bg':       'Новини',
            'el':       'Νέα',
            'he':       'חדשות',
            'lt':       'Naujienos',
            'et':       'Uudised',
            'hr':       'Vijesti',
            'sk':       'Správy',
            'vi':       'Tin tức'
        };
        function nfGetNewsLabel() {
            var lang = (typeof gScope !== 'undefined' && gScope) ? gScope.Language : 'en';
            return nfNewsI18n[lang] || nfNewsI18n[lang && lang.split('-')[0]] || 'News';
        }
        var nfNewsSpan = document.createElement('span');
        nfNewsSpan.className = 'vuo-navlabel';
        nfNewsSpan.style.cssText = 'margin-left:7px;';
        nfNewsSpan.textContent = nfGetNewsLabel();
        btn.insertAdjacentHTML('beforeend', vuoIcon('news'));
        btn.appendChild(nfNewsSpan);

        var isVanillaLayout = document.body.classList.contains('vuo-layout-vanilla');

        btn._vuoVanilla = isVanillaLayout;
        btn.style.cssText = [
            'position:fixed',
            'top:5px',
            isVanillaLayout ? 'right:5px' : 'left:5px',
            'z-index:9999',
            'display:flex',
            'align-items:center',
            'box-sizing:border-box',
            'height:40px',
            'padding:0 10px 0 12px',
            'cursor:pointer',
            'white-space:nowrap',
            'user-select:none'
        ].join(';');
        btn.className = 'nf-corner-btn';

        btn.addEventListener('mouseenter', function() {
            if (typeof lua !== 'undefined') lua.PlaySound('garrysmod/ui_hover.wav');

        });
        btn.addEventListener('mouseleave', function() {});

        function nfLiveScope() {
            try {
                var el = document.querySelector('[ng-controller="ControllerMain"]');
                if (el && typeof angular !== 'undefined') {
                    var s = angular.element(el).scope();
                    if (s) return s;
                }
            } catch (e) {}
            return (typeof scope !== 'undefined' && scope) ? scope : null;
        }

        btn.addEventListener('click', function() {
            var s = nfLiveScope();
            if (s && s.ToggleNewsList) {
                s.ToggleNewsList();
                try {
                    if (!s.$$phase && !s.$root.$$phase) s.$apply();
                } catch(e) {}

                window.vuoUserHideNews = !!s.HideNews;
                window.nfNewsOpen = !s.HideNews;
            }
            if (window.nfNewsOpen) vuoCloseTopPanels('news');

            if (typeof vuoUiPlay === 'function') vuoUiPlay(window.nfNewsOpen ? 'accept' : 'back');
            else if (typeof lua !== 'undefined') lua.PlaySound('garrysmod/ui_click.wav');
        });

        document.body.appendChild(btn);
        positionNewsBtn();

        var _lastState = null;
        setInterval(function() {

            var hash = window.location.hash;
            var onMain = (hash === '#/' || hash === '#' || hash === '');
            var cin = vuoCinTick(onMain);
            vuoMnTick();
            vuoIdleTick(onMain);

            if (typeof window.nfNewsOpen === 'undefined') window.nfNewsOpen = false;
            var sPin = nfLiveScope();
            if (sPin && (!!sPin.HideNews) !== (!window.nfNewsOpen)) {
                sPin.HideNews = !window.nfNewsOpen;
                try {
                    if (!sPin.$$phase && !sPin.$root.$$phase) sPin.$apply();
                } catch(e) {}
            }
            var hidden = !window.nfNewsOpen;
            btn.classList.toggle('nf-active', window.nfNewsOpen && onMain);

            document.body.classList.toggle('nf-news-open', window.nfNewsOpen && onMain);
            if (onMain) { var nfNewsP = document.querySelector('.news'); if (nfNewsP) vuoPositionPanel(nfNewsP, btn); }

            var langBtn = document.querySelector('#NavBar .button[ng-click="ToggleLanguage()"]');
            if (langBtn) {
                langBtn.classList.add('nf-corner-btn');
                var lgSpan = langBtn.querySelector('span');
                if (lgSpan) {
                    var lgCode = vuoNavLang();
                    var lgName = nfLangNames[lgCode] || lgCode.toUpperCase();
                    if (lgSpan.textContent !== lgName) lgSpan.textContent = lgName;
                }
                langBtn.style.whiteSpace = 'nowrap';

                langBtn.style.display = onMain ? 'inline-block' : 'none';
                var vanilla = btn._vuoVanilla;
                var bw = btn.offsetWidth || 0;

                var lx, lRight;
                if (vanilla) {
                    lRight = (bw > 0 ? (5 + bw + VUO_NAV_GAP) : 5);
                } else {
                    lx = (bw > 0 ? (5 + bw + VUO_NAV_GAP) : 5);
                }
                langBtn.style.position = 'fixed';
                langBtn.style.top      = '5px';
                if (cin && cin.lang != null) {
                    langBtn.style.left  = cin.lang + 'px';
                    langBtn.style.right = 'auto';
                } else if (vanilla) {
                    langBtn.style.right = lRight + 'px';
                    langBtn.style.left  = 'auto';
                } else {
                    langBtn.style.left  = lx + 'px';
                    langBtn.style.right = 'auto';
                }
                langBtn.style.margin   = '0';
                langBtn.style.zIndex   = '1001';
                var ll = document.querySelector('ul.language_list');
                var llOpen = false;
                if (ll) {
                    ll.style.position = 'fixed';
                    ll.style.top      = '50px';
                    ll.style.bottom   = 'auto';
                    if (cin && cin.lang != null) {
                        ll.style.left  = cin.lang + 'px';
                        ll.style.right = 'auto';
                    } else if (vanilla) {
                        ll.style.right = lRight + 'px';
                        ll.style.left  = 'auto';
                    } else {
                        ll.style.left  = lx + 'px';
                        ll.style.right = 'auto';
                    }
                    ll.style.zIndex   = '1200';
                    if (!onMain) ll.style.display = 'none';
                    llOpen = onMain && (getComputedStyle(ll).display !== 'none');
                    if (llOpen) vuoPositionPanel(ll, langBtn);
                }

                langBtn.classList.toggle('nf-active', llOpen);
                langBtn.style.opacity = llOpen ? '1' : '0.45';
            }

            if (vuoMusic.built && vuoMusic.btn && vuoSt.btn) {
                vuoMusic.btn.style.display = (onMain && vuoCfg.music) ? 'flex' : 'none';
                vuoMusic.btn.classList.toggle('vuo-playing', !!(vuoMusic.audio && vuoMusic.audio.src && !vuoMusic.audio.paused));
                vuoSt.btn.style.display    = onMain ? 'flex' : 'none';
                if (!onMain) {
                    if (vuoMusic.open) vuoMusicToggle();
                    if (vuoSt.open)    vuoStToggle();
                    if (typeof vuoNpClose==='function') vuoNpClose();
                } else if (cin && cin.st != null) {
                    vuoSt.btn.style.right = 'auto';  vuoSt.btn.style.left = cin.st + 'px';
                    if (cin.mu != null) { vuoMusic.btn.style.right = 'auto'; vuoMusic.btn.style.left = cin.mu + 'px'; }
                } else if (btn._vuoVanilla) {
                    var vLang = document.querySelector('#NavBar .button[ng-click="ToggleLanguage()"]');
                    var useLang = !!(vLang && vLang.getBoundingClientRect().width > 0);
                    var vAnchor = useLang ? vLang : btn;
                    var vRect = vuoRect(vAnchor);
                    var aOff = useLang ? vuoOff('navLgX') : vuoOff('navNwX');
                    if (vRect.width > 0) {
                        var gRight = Math.round(vuoVW() - (vRect.left - aOff) + VUO_NAV_GAP);
                        vuoSt.btn.style.left = 'auto';   vuoSt.btn.style.right = gRight + 'px';
                        var gW = vuoRect(vuoSt.btn).width || 40;
                        vuoMusic.btn.style.left = 'auto';
                        vuoMusic.btn.style.right = Math.round(gRight + gW + VUO_NAV_GAP) + 'px';
                    }
                } else if (btn._vuoVanillaRight || vuoCfg.menuLayout === 'gmod10') {
                    var rLang = document.querySelector('#NavBar .button[ng-click="ToggleLanguage()"]');
                    var rUseLang = !!(rLang && rLang.getBoundingClientRect().width > 0);
                    var rAnchor = rUseLang ? rLang : btn;
                    var rRect = vuoRect(rAnchor);
                    var rOff = rUseLang ? vuoOff('navLgX') : vuoOff('navNwX');
                    if (rRect.width > 0) {
                        var gLeft = Math.round(rRect.right - rOff + VUO_NAV_GAP);
                        vuoSt.btn.style.right = 'auto';  vuoSt.btn.style.left = gLeft + 'px';
                        var gWr = vuoRect(vuoSt.btn).width || 40;
                        vuoMusic.btn.style.right = 'auto';
                        vuoMusic.btn.style.left = Math.round(gLeft + gWr + VUO_NAV_GAP) + 'px';
                    }
                } else {
                    vuoSt.btn.style.left = 'auto';    vuoSt.btn.style.right = '5px';
                    var gW2 = vuoRect(vuoSt.btn).width || 40;
                    vuoMusic.btn.style.left = 'auto';
                    vuoMusic.btn.style.right = Math.round(5 + gW2 + VUO_NAV_GAP) + 'px';
                }
                if (onMain) {
                    if (vuoSt.open) vuoPositionPanel(vuoSt.panel, vuoSt.btn);
                    if (vuoMusic.open) vuoPositionPanel(vuoMusic.panel, vuoMusic.btn);
                }
                vuoUpdTick(onMain);
                vuoToastTick(onMain);
                if (onMain) vuoLogoTick();
                vuoG10Tick(onMain);
                vuoDdTick();
            }

            var nfLeft = document.querySelectorAll('#NavBar .group.left .button');
            for (var lb_i = 0; lb_i < nfLeft.length; lb_i++) {
                nfLeft[lb_i].style.opacity = '0.45';
            }
            var nfPairs = [
                ['#NavBar .button[ng-click="ToggleGames()"]',      'ul.games_list'],
                ['#NavBar .button[ng-click="ToggleGamemodes()"]',  'ul.gamemode_list'],
                ['#NavBar .button[ng-click^="TogglePopup"]',       'ul.kinect_settings'],
                ['#NavBar .button[ng-click="ToggleProblems()"]',    null]
            ];
            window.nfNavSnd = window.nfNavSnd || {};
            for (var p_i = 0; p_i < nfPairs.length; p_i++) {
                var pb = document.querySelector(nfPairs[p_i][0]);
                if (!pb) continue;
                var open = false;
                if (nfPairs[p_i][1]) {
                    var pp = document.querySelector(nfPairs[p_i][1]);
                    open = !!(pp && getComputedStyle(pp).display !== 'none');
                } else if (nfPairs[p_i][0].indexOf('ToggleProblems') >= 0) {
                    open = !!window.vuoProblemsOpen;
                    vuoPushProblemsRect(pb);
                }
                pb.style.opacity = open ? '1' : '0.45';
                pb.classList.toggle('nf-active', open);
                if (open && nfPairs[p_i][1] && pp) vuoPositionPanel(pp, pb);
            }

            var vPops = document.querySelectorAll('ul.popup'), vPopOpened = false;
            for (var vp_i = 0; vp_i < vPops.length; vp_i++) {
                var vpOpen = getComputedStyle(vPops[vp_i]).display !== 'none';
                if (vpOpen && !vPops[vp_i]._vuoWasOpen) vPopOpened = true;
                vPops[vp_i]._vuoWasOpen = vpOpen;
            }
            if (vPopOpened) vuoCloseTopPanels('popup');

            var ubs = document.querySelectorAll('.ugc_settings_button');
            for (var ub_i = 0; ub_i < ubs.length; ub_i++) {
                var ubp = ubs[ub_i].parentElement;
                var ubPanel = ubp && ubp.querySelector('.ugc_settings');
                var ubCat = (typeof Scope !== 'undefined' && Scope && typeof Scope.ToggleSettings === 'function') ? (Scope.Category || '') : '';
                if (ubp) ubp.classList.toggle('vuo-ugc-personal', ubCat === 'favorite' || ubCat === 'followed' || ubCat === 'mine');
                if (ubPanel && !ubPanel._vuoSubOnly) {
                    ubPanel._vuoSubOnly = true;
                    var subOnly = [ubPanel.querySelector('#FilterEnabledOnly'), ubPanel.querySelector('#UGCSortMethod_title')];
                    for (var so_i = 0; so_i < subOnly.length; so_i++) {
                        if (subOnly[so_i] && subOnly[so_i].parentElement) subOnly[so_i].parentElement.classList.add('vuo-ugc-subonly');
                    }
                    var selAll = ubPanel.querySelector('a[ng-click="SelectAll()"]');
                    if (selAll) selAll.classList.add('vuo-ugc-subonly');
                }
                ubs[ub_i].classList.toggle('vuo-on', !!(ubPanel && ubPanel.classList.contains('active')));
            }

            var sIG = nfLiveScope();
            var ig = sIG ? !!sIG.InGame : false;

            var cssShow = (typeof vuoCssBg === 'function') && vuoCssBg() && !ig && !(window.vuoLiveOn && Date.now() - (window.vuoLiveAt || 0) > 1600);
            if (window.nfCssBgShown !== cssShow) {
                window.nfCssBgShown = cssShow;
                var bgIds = ['vuo_bg', 'vuo_bg2', 'vuo_bg_overlay'];
                for (var bg_i = 0; bg_i < bgIds.length; bg_i++) {
                    var bgEl = document.getElementById(bgIds[bg_i]);
                    if (bgEl) bgEl.style.display = cssShow ? 'block' : 'none';
                }
            }
            if (typeof window.nfLastInGame === 'undefined') window.nfLastInGame = ig;
            if (ig !== window.nfLastInGame) {
                window.nfLastInGame = ig;
                if (ig) vuoGameState(false, true);
                var lis = document.querySelectorAll('div[ng-controller="ControllerMain"] .options ul li');
                for (var li_i = 0; li_i < lis.length; li_i++) {
                    lis[li_i].style.animation = 'none';
                    void lis[li_i].offsetWidth;
                    lis[li_i].style.animation = '';
                }
            }

            var lang = (typeof gScope !== 'undefined' && gScope) ? gScope.Language : 'en';
            var state = onMain + '|' + hidden + '|' + lang;
            if (state === _lastState) return;
            _lastState = state;

            if (typeof nfNewsSpan !== 'undefined') nfNewsSpan.textContent = nfGetNewsLabel();
            vuoNavRefreshLabels();

            btn.style.display = onMain ? 'flex' : 'none';

            btn.style.opacity = hidden ? '0.45' : '1';

            var nb = document.querySelector('.news_buttons');
            if (nb) {
                var nbShow = (!hidden && onMain);
                nb.style.visibility    = 'visible';
                nb.style.transition    = 'opacity 0.30s ease';
                nb.style.opacity       = nbShow ? '1' : '0';
                nb.style.pointerEvents = nbShow ? 'auto' : 'none';
            }
        }, 50);
    }

    function positionNewsBtn() {

    }

    var nfLangNames = {
        'bg':'Български','cs':'Čeština','da':'Dansk','de':'Deutsch','el':'Ελληνικά',
        'en':'English','en-pt':'Pirate','es-es':'Español','et':'Eesti','fi':'Suomi',
        'fr':'Français','he':'עברית','hr':'Hrvatski','hu':'Magyar','it':'Italiano',
        'ja':'日本語','ko':'한국어','lt':'Lietuvių','nl':'Nederlands','no':'Norsk',
        'pl':'Polski','pt-br':'Português (BR)','pt-pt':'Português (PT)','ru':'Русский',
        'sk':'Slovenčina','sv-se':'Svenska','th':'ไทย','tr':'Türkçe','uk':'Українська',
        'vi':'Tiếng Việt','zh-cn':'简体中文','zh-tw':'繁體中文'
    };

    var vuoNavI18n = {
        music: {
            'bg':'Музика','cs':'Hudba','da':'Musik','de':'Musik','el':'Μουσική',
            'en':'Music','en-pt':'Shanty','es-es':'Música','et':'Muusika','fi':'Musiikki',
            'fr':'Musique','he':'מוסיקה','hr':'Glazba','hu':'Zene','it':'Musica',
            'ja':'音楽','ko':'음악','lt':'Muzika','nl':'Muziek','no':'Musikk',
            'pl':'Muzyka','pt-br':'Música','pt-pt':'Música','ru':'Музыка',
            'sk':'Hudba','sv-se':'Musik','th':'ดนตรี','tr':'Müzik','uk':'Музика',
            'vi':'Âm nhạc','zh-cn':'音乐','zh-tw':'音樂'
        },
        settings: {
            'bg':'Настройки','cs':'Nastavení','da':'Indstillinger','de':'Einstellungen','el':'Ρυθμίσεις',
            'en':'Settings','en-pt':"Settin's",'es-es':'Ajustes','et':'Seaded','fi':'Asetukset',
            'fr':'Paramètres','he':'הגדרות','hr':'Postavke','hu':'Beállítások','it':'Impostazioni',
            'ja':'設定','ko':'설정','lt':'Nustatymai','nl':'Instellingen','no':'Innstillinger',
            'pl':'Ustawienia','pt-br':'Configurações','pt-pt':'Definições','ru':'Настройки',
            'sk':'Nastavenia','sv-se':'Inställningar','th':'การตั้งค่า','tr':'Ayarlar','uk':'Налаштування',
            'vi':'Cài đặt','zh-cn':'设置','zh-tw':'設定'
        }
    };
    function vuoNavLang() {
        var l = (typeof gScope !== 'undefined' && gScope && gScope.Language) ? gScope.Language : 'en';
        return String(l).toLowerCase();
    }
    function vuoNavLabel(kind) {
        var map = vuoNavI18n[kind] || {};
        var lang = vuoNavLang();
        return map[lang] || map[lang.split('-')[0]] || map['en'] || '';
    }
    var vuoLocI18n = {
        now_playing:   {'en':'Now Playing','bg':'Сега свири','cs':'Právě hraje','da':'Afspiller nu','de':'Läuft gerade','el':'Παίζει τώρα','en-pt':"Now Playin'",'es-es':'Reproduciendo','et':'Hetkel mängib','fi':'Nyt soi','fr':'En lecture','he':'מתנגן כעת','hr':'Sada svira','hu':'Most szól','it':'In riproduzione','ja':'再生中','ko':'재생 중','lt':'Dabar grojama','nl':'Nu speelt','no':'Spilles nå','pl':'Teraz odtwarzane','pt-br':'Tocando agora','pt-pt':'A tocar','ru':'Сейчас играет','sk':'Práve hrá','sv-se':'Spelas nu','th':'กำลังเล่น','tr':'Şimdi Çalıyor','uk':'Зараз грає','vi':'Đang phát','zh-cn':'正在播放','zh-tw':'正在播放'},
        autoplay:      {'en':'Autoplay','bg':'Автопуск','el':'Αυτόματα','he':'אוטומטי','ja':'自動再生','ko':'자동 재생','ru':'Автозапуск','uk':'Автозапуск','th':'เล่นอัตโนมัติ','tr':'Otomatik','vi':'Tự phát','zh-cn':'自动播放','zh-tw':'自動播放'},
        shuffle:       {'en':'Shuffle','bg':'Разбъркай','cs':'Náhodně','da':'Bland','de':'Zufall','el':'Τυχαία','es-es':'Aleatorio','et':'Juhuslik','fi':'Sekoita','fr':'Aléatoire','he':'ערבוב','hr':'Nasumično','hu':'Keverés','it':'Casuale','ja':'シャッフル','ko':'셔플','lt':'Maišyti','nl':'Willekeurig','no':'Tilfeldig','pl':'Losowo','pt-br':'Aleatório','pt-pt':'Aleatório','ru':'Перемешать','sk':'Náhodne','sv-se':'Blanda','th':'สุ่ม','tr':'Karışık','uk':'Перемішати','vi':'Ngẫu nhiên','zh-cn':'随机','zh-tw':'隨機'},
        repeat:        {'en':'Repeat','bg':'Повтори','cs':'Opakovat','da':'Gentag','de':'Wiederholen','el':'Επανάληψη','es-es':'Repetir','et':'Korda','fi':'Kertaus','fr':'Répéter','he':'חזרה','hr':'Ponovi','hu':'Ismétlés','it':'Ripeti','ja':'リピート','ko':'반복','lt':'Kartoti','nl':'Herhalen','no':'Gjenta','pl':'Powtarzaj','pt-br':'Repetir','pt-pt':'Repetir','ru':'Повтор','sk':'Opakovať','sv-se':'Upprepa','th':'เล่นซ้ำ','tr':'Tekrar','uk':'Повтор','vi':'Lặp lại','zh-cn':'循环','zh-tw':'循環'},
        rep_off:       {'en':'Off','bg':'Изкл','cs':'Vyp','da':'Fra','de':'Aus','el':'Όχι','es-es':'No','et':'Väljas','fi':'Pois','fr':'Non','he':'כבוי','hr':'Isklj','hu':'Ki','it':'No','ja':'オフ','ko':'끔','lt':'Išj','nl':'Uit','no':'Av','pl':'Wył','pt-br':'Não','pt-pt':'Não','ru':'Выкл','sk':'Vyp','sv-se':'Av','th':'ปิด','tr':'Kapalı','uk':'Вимк','vi':'Tắt','zh-cn':'关','zh-tw':'關'},
        rep_all:       {'en':'All','bg':'Всички','cs':'Vše','da':'Alle','de':'Alle','el':'Όλα','es-es':'Todo','et':'Kõik','fi':'Kaikki','fr':'Tout','he':'הכל','hr':'Sve','hu':'Mind','it':'Tutti','ja':'全曲','ko':'전체','lt':'Visi','nl':'Alle','no':'Alle','pl':'Wszystko','pt-br':'Tudo','pt-pt':'Tudo','ru':'Все','sk':'Všetko','sv-se':'Alla','th':'ทั้งหมด','tr':'Tümü','uk':'Усі','vi':'Tất cả','zh-cn':'全部','zh-tw':'全部'},
        rep_one:       {'en':'One','bg':'Една','cs':'Jedna','da':'Én','de':'Eins','el':'Ένα','es-es':'Una','et':'Üks','fi':'Yksi','fr':'Une','he':'אחד','hr':'Jedna','hu':'Egy','it':'Una','ja':'1曲','ko':'한 곡','lt':'Viena','nl':'Eén','no':'Én','pl':'Jedna','pt-br':'Uma','pt-pt':'Uma','ru':'Одна','sk':'Jedna','sv-se':'En','th':'เพลงเดียว','tr':'Tek','uk':'Одна','vi':'Một','zh-cn':'单曲','zh-tw':'單曲'},
        crossfade:     {'en':'Crossfade','bg':'Кросфейд','cs':'Prolínání','da':'Overtoning','de':'Überblendung','el':'Μετάβαση','es-es':'Fundido cruzado','et':'Üleminek','fi':'Ristihäivytys','fr':'Fondu enchaîné','he':'קרוספייד','hr':'Prijelaz','hu':'Áttűnés','it':'Dissolvenza','ja':'クロスフェード','ko':'크로스페이드','lt':'Perėjimas','nl':'Overvloeien','no':'Overtoning','pl':'Płynne przejście','pt-br':'Transição suave','pt-pt':'Transição suave','ru':'Кроссфейд','sk':'Prelínanie','sv-se':'Övertoning','th':'ครอสเฟด','tr':'Çapraz geçiş','uk':'Кросфейд','vi':'Chuyển tiếp','zh-cn':'淡入淡出','zh-tw':'淡入淡出'},
        search_tracks: {'en':'Search tracks…','bg':'Търси песни…','cs':'Hledat skladby…','da':'Søg numre…','de':'Titel suchen…','el':'Αναζήτηση…','en-pt':'Search yer shanties…','es-es':'Buscar pistas…','et':'Otsi lugusid…','fi':'Etsi kappaleita…','fr':'Rechercher…','he':'חיפוש שירים…','hr':'Traži pjesme…','hu':'Keresés…','it':'Cerca brani…','ja':'曲を検索…','ko':'곡 검색…','lt':'Ieškoti takelių…','nl':'Zoek nummers…','no':'Søk i spor…','pl':'Szukaj utworów…','pt-br':'Buscar faixas…','pt-pt':'Procurar faixas…','ru':'Поиск треков…','sk':'Hľadať skladby…','sv-se':'Sök spår…','th':'ค้นหาเพลง…','tr':'Parça ara…','uk':'Пошук треків…','vi':'Tìm bài hát…','zh-cn':'搜索曲目…','zh-tw':'搜尋曲目…'},
        tracks:        {'en':'Tracks','bg':'Песни','cs':'Skladby','da':'Numre','de':'Titel','el':'Κομμάτια','en-pt':'Shanties','es-es':'Pistas','et':'Lood','fi':'Kappaleet','fr':'Pistes','he':'שירים','hr':'Pjesme','hu':'Számok','it':'Brani','ja':'トラック','ko':'트랙','lt':'Takeliai','nl':'Nummers','no':'Spor','pl':'Utwory','pt-br':'Faixas','pt-pt':'Faixas','ru':'Треки','sk':'Skladby','sv-se':'Spår','th':'เพลง','tr':'Parçalar','uk':'Треки','vi':'Bài hát','zh-cn':'曲目','zh-tw':'曲目'},
        track_one:     {'en':'track','bg':'песен','cs':'skladba','da':'nummer','de':'Titel','el':'κομμάτι','en-pt':'shanty','es-es':'pista','et':'lugu','fi':'kappale','fr':'piste','he':'שיר','hr':'pjesma','hu':'szám','it':'brano','ja':'曲','ko':'곡','lt':'takelis','nl':'nummer','no':'spor','pl':'utwór','pt-br':'faixa','pt-pt':'faixa','ru':'трек','sk':'skladba','sv-se':'spår','th':'เพลง','tr':'parça','uk':'трек','vi':'bài','zh-cn':'首','zh-tw':'首'},
        track_many:    {'en':'tracks','bg':'песни','cs':'skladeb','da':'numre','de':'Titel','el':'κομμάτια','en-pt':'shanties','es-es':'pistas','et':'lugu','fi':'kappaletta','fr':'pistes','he':'שירים','hr':'pjesama','hu':'szám','it':'brani','ja':'曲','ko':'곡','lt':'takelių','nl':'nummers','no':'spor','pl':'utworów','pt-br':'faixas','pt-pt':'faixas','ru':'треков','sk':'skladieb','sv-se':'spår','th':'เพลง','tr':'parça','uk':'треків','vi':'bài','zh-cn':'首','zh-tw':'首'},
        add_music:     {'en':'Add more music to','bg':'Добави още музика в','cs':'Přidej další hudbu do','da':'Tilføj mere musik i','de':'Mehr Musik ablegen in','el':'Πρόσθεσε μουσική στο','en-pt':'Stash more shanties in','es-es':'Añade más música en','et':'Lisa muusikat kausta','fi':'Lisää musiikkia kansioon','fr':'Ajoutez de la musique dans','he':'הוסף עוד מוזיקה אל','hr':'Dodaj još glazbe u','hu':'További zene ide:','it':'Aggiungi altra musica in','ja':'音楽を追加:','ko':'음악 추가:','lt':'Pridėk muzikos į','nl':'Voeg meer muziek toe in','no':'Legg til mer musikk i','pl':'Dodaj więcej muzyki do','pt-br':'Adicione mais músicas em','pt-pt':'Adiciona mais música em','ru':'Добавь музыку в','sk':'Pridaj ďalšiu hudbu do','sv-se':'Lägg till mer musik i','th':'เพิ่มเพลงลงใน','tr':'Şu klasöre müzik ekle:','uk':'Додай музику до','vi':'Thêm nhạc vào','zh-cn':'添加更多音乐到','zh-tw':'加入更多音樂到'},
        no_tracks:     {'en':'No tracks found.','bg':'Няма намерени песни.','cs':'Žádné skladby.','da':'Ingen numre fundet.','de':'Keine Titel gefunden.','el':'Δεν βρέθηκαν κομμάτια.','en-pt':'No shanties found, arr.','es-es':'No se encontraron pistas.','et':'Lugusid ei leitud.','fi':'Kappaleita ei löytynyt.','fr':'Aucune piste trouvée.','he':'לא נמצאו שירים.','hr':'Nema pjesama.','hu':'Nincs találat.','it':'Nessun brano trovato.','ja':'トラックが見つかりません','ko':'트랙이 없습니다','lt':'Takelių nerasta.','nl':'Geen nummers gevonden.','no':'Ingen spor funnet.','pl':'Nie znaleziono utworów.','pt-br':'Nenhuma faixa encontrada.','pt-pt':'Nenhuma faixa encontrada.','ru':'Треки не найдены.','sk':'Žiadne skladby.','sv-se':'Inga spår hittades.','th':'ไม่พบเพลง','tr':'Parça bulunamadı.','uk':'Треки не знайдено.','vi':'Không tìm thấy bài hát.','zh-cn':'未找到曲目','zh-tw':'找不到曲目'},
        drop_audio:    {'en':'Drop {fmt} files into','bg':'Постави {fmt} файлове в','cs':'Vlož soubory {fmt} do','da':'Læg {fmt}-filer i','de':'{fmt}-Dateien ablegen in','el':'Βάλε αρχεία {fmt} στο','es-es':'Suelta archivos {fmt} en','et':'Aseta {fmt} failid kausta','fi':'Pudota {fmt}-tiedostot kansioon','fr':'Déposez des fichiers {fmt} dans','he':'הכנס קבצי {fmt} אל','hr':'Ubaci {fmt} datoteke u','hu':'Tegyél {fmt} fájlokat ide:','it':'Trascina file {fmt} in','ja':'{fmt} ファイルをここへ:','ko':'{fmt} 파일을 넣기:','lt':'Įkelk {fmt} failus į','nl':'Zet {fmt}-bestanden in','no':'Legg {fmt}-filer i','pl':'Umieść pliki {fmt} w','pt-br':'Coloque arquivos {fmt} em','pt-pt':'Coloca ficheiros {fmt} em','ru':'Закинь файлы {fmt} в','sk':'Vlož súbory {fmt} do','sv-se':'Lägg {fmt}-filer i','th':'วางไฟล์ {fmt} ใน','tr':'{fmt} dosyalarını şu klasöre bırak:','uk':'Поклади файли {fmt} до','vi':'Đặt tệp {fmt} vào','zh-cn':'将 {fmt} 文件放入','zh-tw':'將 {fmt} 檔案放入'},
        no_match:      {'en':'No tracks match your search.','bg':'Няма съвпадения.','cs':'Nic nenalezeno.','da':'Ingen match.','de':'Keine Treffer.','el':'Καμία αντιστοιχία.','en-pt':'No shanties match, arr.','es-es':'Ninguna pista coincide.','et':'Vasteid pole.','fi':'Ei osumia.','fr':'Aucune piste ne correspond.','he':'אין התאמות.','hr':'Nema podudaranja.','hu':'Nincs találat.','it':'Nessun brano corrisponde.','ja':'一致するトラックがありません','ko':'일치하는 트랙이 없습니다','lt':'Atitikmenų nėra.','nl':'Geen nummers gevonden.','no':'Ingen treff.','pl':'Brak pasujących utworów.','pt-br':'Nenhuma faixa corresponde.','pt-pt':'Nenhuma faixa corresponde.','ru':'Ничего не найдено.','sk':'Nič sa nenašlo.','sv-se':'Inga träffar.','th':'ไม่พบเพลงที่ตรงกัน','tr':'Aramanla eşleşen parça yok.','uk':'Нічого не знайдено.','vi':'Không có bài phù hợp.','zh-cn':'没有匹配的曲目','zh-tw':'沒有符合的曲目'},
        copied:        {'en':'Copied! Paste it into your file manager\'s address bar','bg':'Копирано! Постави в адресната лента','cs':'Zkopírováno! Vlož do adresního řádku','da':'Kopieret! Indsæt i mappelinjen','de':'Kopiert! In die Ordner-Adressleiste einfügen','el':'Αντιγράφηκε! Επικόλλησε στη γραμμή φακέλου','en-pt':'Copied! Paste in yer chart bar, arr','es-es':'¡Copiado! Pega en la barra de carpetas','et':'Kopeeritud! Kleebi kausta ribale','fi':'Kopioitu! Liitä kansiopalkkiin','fr':'Copié ! Collez dans la barre de dossier','he':'הועתק! הדבק בשורת התיקייה','hr':'Kopirano! Zalijepi u adresnu traku','hu':'Másolva! Illeszd be a mappasávba','it':'Copiato! Incolla nella barra delle cartelle','ja':'コピーしました！フォルダーバーに貼り付け','ko':'복사됨! 폴더 주소창에 붙여넣기','lt':'Nukopijuota! Įklijuok į aplanko juostą','nl':'Gekopieerd! Plak in de adresbalk','no':'Kopiert! Lim inn i mappelinjen','pl':'Skopiowano! Wklej w pasku folderu','pt-br':'Copiado! Cole na barra de pastas','pt-pt':'Copiado! Cola na barra de pastas','ru':'Скопировано! Вставь в адресную строку папки','sk':'Skopírované! Vlož do adresného riadka','sv-se':'Kopierat! Klistra in i mappfältet','th':'คัดลอกแล้ว! วางในแถบโฟลเดอร์','tr':'Kopyalandı! Steam klasörü adres çubuğuna yapıştır','uk':'Скопійовано! Встав у адресний рядок','vi':'Đã sao chép! Dán vào thanh thư mục','zh-cn':'已复制！粘贴到文件夹地址栏','zh-tw':'已複製！貼上到資料夾位址列'},
        watch_yt:      {'en':'Watch on YouTube','bg':'Гледай в YouTube','cs':'Přehrát na YouTube','da':'Se på YouTube','de':'Auf YouTube ansehen','el':'Δες στο YouTube','en-pt':'Spy it on YeTube','es-es':'Ver en YouTube','et':"Vaata YouTube'is",'fi':'Katso YouTubesta','fr':'Voir sur YouTube','he':'צפה ביוטיוב','hr':'Gledaj na YouTubeu','hu':'Megnézés YouTube-on','it':'Guarda su YouTube','ja':'YouTubeで見る','ko':'YouTube에서 보기','lt':'Žiūrėti YouTube','nl':'Bekijk op YouTube','no':'Se på YouTube','pl':'Obejrzyj na YouTube','pt-br':'Assistir no YouTube','pt-pt':'Ver no YouTube','ru':'Смотреть на YouTube','sk':'Pozrieť na YouTube','sv-se':'Se på YouTube','th':'ดูบน YouTube','tr':"YouTube'da izle",'uk':'Дивитися на YouTube','vi':'Xem trên YouTube','zh-cn':'在 YouTube 观看','zh-tw':'在 YouTube 觀看'},
        tab_appear:    {'en':'Appearance','bg':'Външен вид','cs':'Vzhled','da':'Udseende','de':'Aussehen','el':'Εμφάνιση','en-pt':'Looks','es-es':'Apariencia','et':'Välimus','fi':'Ulkoasu','fr':'Apparence','he':'מראה','hr':'Izgled','hu':'Megjelenés','it':'Aspetto','ja':'外観','ko':'모양','lt':'Išvaizda','nl':'Uiterlijk','no':'Utseende','pl':'Wygląd','pt-br':'Aparência','pt-pt':'Aparência','ru':'Вид','sk':'Vzhľad','sv-se':'Utseende','th':'รูปลักษณ์','tr':'Görünüm','uk':'Вигляд','vi':'Giao diện','zh-cn':'外观','zh-tw':'外觀'},
        tab_bg:        {'en':'Background','bg':'Фон','cs':'Pozadí','da':'Baggrund','de':'Hintergrund','el':'Φόντο','en-pt':'Backdrop','es-es':'Fondo','et':'Taust','fi':'Tausta','fr':'Fond','he':'רקע','hr':'Pozadina','hu':'Háttér','it':'Sfondo','ja':'背景','ko':'배경','lt':'Fonas','nl':'Achtergrond','no':'Bakgrunn','pl':'Tło','pt-br':'Fundo','pt-pt':'Fundo','ru':'Фон','sk':'Pozadie','sv-se':'Bakgrund','th':'พื้นหลัง','tr':'Arka plan','uk':'Тло','vi':'Nền','zh-cn':'背景','zh-tw':'背景'},
        tab_layout:    {'en':'Layout','bg':'Подредба','cs':'Rozložení','el':'Διάταξη','es-es':'Diseño','et':'Paigutus','fi':'Asettelu','fr':'Disposition','he':'פריסה','hr':'Raspored','hu':'Elrendezés','ja':'レイアウト','ko':'레이아웃','lt':'Išdėstymas','nl':'Indeling','no':'Oppsett','pl':'Układ','ru':'Макет','sk':'Rozloženie','th':'เลย์เอาต์','tr':'Düzen','uk':'Макет','vi':'Bố cục','zh-cn':'布局','zh-tw':'版面'},
        made_by:       {'en':'Made by','bg':'Създадено от','cs':'Vytvořil','da':'Lavet af','de':'Erstellt von','el':'Δημιουργήθηκε από','en-pt':'Crafted by','es-es':'Creado por','et':'Autor','fi':'Tekijä','fr':'Créé par','he':'נוצר על ידי','hr':'Izradio','hu':'Készítette','it':'Creato da','ja':'制作','ko':'제작','lt':'Sukūrė','nl':'Gemaakt door','no':'Laget av','pl':'Autor','pt-br':'Feito por','pt-pt':'Feito por','ru':'Автор','sk':'Vytvoril','sv-se':'Skapad av','th':'สร้างโดย','tr':'Yapan','uk':'Автор','vi':'Thực hiện bởi','zh-cn':'制作者','zh-tw':'製作者'},
        about_desc:    {'en':'A redesigned main menu. Choose your own fonts, backgrounds, music and layout.','bg':'Преработено главно меню. Избери свои шрифтове, фонове, музика и подредба.','cs':'Přepracované hlavní menu. Zvol si vlastní písma, pozadí, hudbu a rozložení.','da':'En redesignet hovedmenu. Vælg dine egne skrifttyper, baggrunde, musik og layout.','de':'Ein neu gestaltetes Hauptmenü. Wähle eigene Schriftarten, Hintergründe, Musik und Layouts.','el':'Ανασχεδιασμένο κεντρικό μενού. Διάλεξε δικές σου γραμματοσειρές, φόντα, μουσική και διάταξη.','en-pt':'A refitted main menu. Pick yer own fonts, backdrops, shanties and layout.','es-es':'Un menú principal rediseñado. Elige tus propias fuentes, fondos, música y diseño.','et':'Ümber kujundatud peamenüü. Vali oma fondid, taustad, muusika ja paigutus.','fi':'Uudistettu päävalikko. Valitse omat fontit, taustat, musiikki ja asettelu.','fr':'Un menu principal repensé. Choisissez vos polices, fonds, musiques et dispositions.','he':'תפריט ראשי מעוצב מחדש. בחר גופנים, רקעים, מוזיקה ופריסה משלך.','hr':'Redizajnirani glavni izbornik. Odaberi vlastite fontove, pozadine, glazbu i raspored.','hu':'Újratervezett főmenü. Válassz saját betűtípusokat, háttereket, zenét és elrendezést.','it':'Un menu principale ridisegnato. Scegli font, sfondi, musica e disposizione.','ja':'再デザインされたメインメニュー。フォント、背景、音楽、レイアウトを自由に選べます。','ko':'새롭게 디자인한 메인 메뉴. 글꼴, 배경, 음악, 레이아웃을 직접 고르세요.','lt':'Perkurtas pagrindinis meniu. Pasirink savo šriftus, fonus, muziką ir išdėstymą.','nl':'Een opnieuw ontworpen hoofdmenu. Kies je eigen lettertypen, achtergronden, muziek en indeling.','no':'En redesignet hovedmeny. Velg dine egne skrifttyper, bakgrunner, musikk og oppsett.','pl':'Przeprojektowane menu główne. Wybierz własne czcionki, tła, muzykę i układ.','pt-br':'Um menu principal redesenhado. Escolha suas próprias fontes, fundos, músicas e layout.','pt-pt':'Um menu principal redesenhado. Escolhe as tuas fontes, fundos, músicas e disposição.','ru':'Переработанное главное меню. Выбирай свои шрифты, фоны, музыку и макет.','sk':'Prepracované hlavné menu. Zvoľ si vlastné písma, pozadia, hudbu a rozloženie.','sv-se':'En omdesignad huvudmeny. Välj egna typsnitt, bakgrunder, musik och layout.','th':'เมนูหลักที่ออกแบบใหม่ เลือกฟอนต์ พื้นหลัง เพลง และเลย์เอาต์ได้เอง','tr':'Yeniden tasarlanmış bir ana menü. Yazı tiplerini, arka planları, müziği ve düzeni kendin seç.','uk':'Перероблене головне меню. Обирай власні шрифти, тла, музику та компонування.','vi':'Menu chính được thiết kế lại. Tự chọn phông chữ, hình nền, nhạc và bố cục.','zh-cn':'重新设计的主菜单。自由选择字体、背景、音乐和布局。','zh-tw':'重新設計的主選單。自由選擇字型、背景、音樂和版面。'},
        gh_page:       {'en':'GitHub page','bg':'GitHub страница','cs':'Stránka na GitHubu','da':'GitHub-side','de':'GitHub-Seite','el':'Σελίδα GitHub','en-pt':'GitHub port','es-es':'Página de GitHub','et':'GitHubi leht','fi':'GitHub-sivu','fr':'Page GitHub','he':'עמוד GitHub','hr':'GitHub stranica','hu':'GitHub oldal','it':'Pagina GitHub','ja':'GitHub ページ','ko':'GitHub 페이지','lt':'GitHub puslapis','nl':'GitHub-pagina','no':'GitHub-side','pl':'Strona GitHub','pt-br':'Página do GitHub','pt-pt':'Página do GitHub','ru':'Страница GitHub','sk':'Stránka na GitHube','sv-se':'GitHub-sida','th':'หน้า GitHub','tr':'GitHub sayfası','uk':'Сторінка GitHub','vi':'Trang GitHub','zh-cn':'GitHub 页面','zh-tw':'GitHub 頁面'},
        steam_page:    {'en':'Steam page','bg':'Steam страница','cs':'Stránka na Steamu','da':'Steam-side','de':'Steam-Seite','el':'Σελίδα Steam','en-pt':'Steam port','es-es':'Página de Steam','et':'Steami leht','fi':'Steam-sivu','fr':'Page Steam','he':'עמוד Steam','hr':'Steam stranica','hu':'Steam oldal','it':'Pagina Steam','ja':'Steam ページ','ko':'Steam 페이지','lt':'Steam puslapis','nl':'Steam-pagina','no':'Steam-side','pl':'Strona Steam','pt-br':'Página da Steam','pt-pt':'Página da Steam','ru':'Страница Steam','sk':'Stránka na Steame','sv-se':'Steam-sida','th':'หน้า Steam','tr':'Steam sayfası','uk':'Сторінка Steam','vi':'Trang Steam','zh-cn':'Steam 页面','zh-tw':'Steam 頁面'},
        tab_about:     {'en':'About','bg':'Относно','cs':'Info','da':'Om','de':'Info','el':'Σχετικά','es-es':'Acerca de','et':'Teave','fi':'Tietoja','fr':'À propos','he':'אודות','hr':'Info','hu':'Névjegy','it':'Info','ja':'情報','ko':'정보','lt':'Apie','nl':'Over','no':'Om','pl':'Info','pt-br':'Sobre','pt-pt':'Sobre','ru':'О моде','sk':'Info','sv-se':'Om','th':'เกี่ยวกับ','tr':'Hakkında','uk':'Про мод','vi':'Giới thiệu','zh-cn':'关于','zh-tw':'關於'},
        bg_dim:        {'en':'Background dim','bg':'Затъмняване','cs':'Ztmavení pozadí','da':'Dæmp baggrund','de':'Abdunklung','el':'Σκοτείνιασμα','en-pt':'Dim the backdrop','es-es':'Oscurecer fondo','et':'Tausta tumendus','fi':'Taustan himmennys','fr':'Assombrissement','he':'עמעום רקע','hr':'Zatamnjenje','hu':'Háttér sötétítés','it':'Oscura sfondo','ja':'背景の暗さ','ko':'배경 어둡기','lt':'Fono tamsinimas','nl':'Achtergrond dimmen','no':'Demp bakgrunn','pl':'Przyciemnienie tła','pt-br':'Escurecer fundo','pt-pt':'Escurecer fundo','ru':'Затемнение фона','sk':'Stmavenie pozadia','sv-se':'Dämpa bakgrund','th':'ความมืดพื้นหลัง','tr':'Arka plan karartma','uk':'Затемнення тла','vi':'Làm tối nền','zh-cn':'背景变暗','zh-tw':'背景變暗'},
        accent1:       {'en':'Primary accent','bg':'Основен цвят','cs':'Hlavní barva','da':'Primær farve','de':'Primärfarbe','el':'Κύριο χρώμα','en-pt':'First colour','es-es':'Color primario','et':'Põhivärv','fi':'Pääväri','fr':'Couleur primaire','he':'צבע ראשי','hr':'Glavna boja','hu':'Elsődleges szín','it':'Colore primario','ja':'メインカラー','ko':'기본 색상','lt':'Pagrindinė spalva','nl':'Primaire kleur','no':'Primærfarge','pl':'Kolor główny','pt-br':'Cor primária','pt-pt':'Cor primária','ru':'Основной цвет','sk':'Hlavná farba','sv-se':'Primärfärg','th':'สีหลัก','tr':'Birincil renk','uk':'Основний колір','vi':'Màu chính','zh-cn':'主色调','zh-tw':'主色調'},
        accent2:       {'en':'Secondary accent','bg':'Втори цвят','cs':'Vedlejší barva','da':'Sekundær farve','de':'Sekundärfarbe','el':'Δεύτερο χρώμα','en-pt':'Second colour','es-es':'Color secundario','et':'Lisavärv','fi':'Lisäväri','fr':'Couleur secondaire','he':'צבע משני','hr':'Sporedna boja','hu':'Másodlagos szín','it':'Colore secondario','ja':'サブカラー','ko':'보조 색상','lt':'Antrinė spalva','nl':'Secundaire kleur','no':'Sekundærfarge','pl':'Kolor dodatkowy','pt-br':'Cor secundária','pt-pt':'Cor secundária','ru':'Второй цвет','sk':'Vedľajšia farba','sv-se':'Sekundärfärg','th':'สีรอง','tr':'İkincil renk','uk':'Другий колір','vi':'Màu phụ','zh-cn':'次色调','zh-tw':'次色調'},
        font:          {'en':'Font','bg':'Шрифт','cs':'Písmo','da':'Skrifttype','de':'Schriftart','el':'Γραμματοσειρά','es-es':'Fuente','fi':'Fontti','fr':'Police','he':'גופן','hu':'Betűtípus','ja':'フォント','ko':'글꼴','lt':'Šriftas','nl':'Lettertype','no':'Skrift','pl':'Czcionka','pt-br':'Fonte','pt-pt':'Fonte','ru':'Шрифт','sk':'Písmo','sv-se':'Typsnitt','th':'ฟอนต์','tr':'Yazı tipi','uk':'Шрифт','vi':'Phông chữ','zh-cn':'字体','zh-tw':'字型'},
        ui_scale:      {'en':'UI scale','bg':'Мащаб','cs':'Měřítko rozhraní','da':'UI-skalering','de':'UI-Skalierung','el':'Κλίμακα UI','es-es':'Escala de la interfaz','et':'Liidese suurus','fi':'Käyttöliittymän koko','fr':'Échelle de l’interface','he':'קנה מידה','hr':'Veličina sučelja','hu':'Felület mérete','it':'Scala interfaccia','ja':'UIの拡大率','ko':'UI 크기','lt':'Sąsajos mastelis','nl':'UI-schaal','no':'UI-skalering','pl':'Skala interfejsu','pt-br':'Escala da interface','pt-pt':'Escala da interface','ru':'Масштаб интерфейса','sk':'Mierka rozhrania','sv-se':'UI-skala','th':'ขนาด UI','tr':'Arayüz ölçeği','uk':'Масштаб інтерфейсу','vi':'Tỷ lệ giao diện','zh-cn':'界面缩放','zh-tw':'介面縮放'},
        scale_auto:    {'en':'Auto','bg':'Авто','cs':'Automaticky','da':'Auto','de':'Automatisch','el':'Αυτόματο','es-es':'Automático','et':'Automaatne','fi':'Automaattinen','fr':'Auto','he':'אוטומטי','hr':'Automatski','hu':'Automatikus','it':'Automatico','ja':'自動','ko':'자동','lt':'Automatinis','nl':'Automatisch','no':'Automatisk','pl':'Automatycznie','pt-br':'Automático','pt-pt':'Automático','ru':'Авто','sk':'Automaticky','sv-se':'Automatisk','th':'อัตโนมัติ','tr':'Otomatik','uk':'Авто','vi':'Tự động','zh-cn':'自动','zh-tw':'自動'},
        font_size:     {'en':'Font size','bg':'Размер','cs':'Velikost písma','da':'Skriftstørrelse','de':'Schriftgröße','el':'Μέγεθος','es-es':'Tamaño','et':'Fondi suurus','fi':'Fonttikoko','fr':'Taille','he':'גודל גופן','hr':'Veličina fonta','hu':'Betűméret','it':'Dimensione','ja':'文字サイズ','ko':'글자 크기','lt':'Šrifto dydis','nl':'Lettergrootte','no':'Størrelse','pl':'Rozmiar czcionki','pt-br':'Tamanho','pt-pt':'Tamanho','ru':'Размер шрифта','sk':'Veľkosť písma','sv-se':'Textstorlek','th':'ขนาดฟอนต์','tr':'Yazı boyutu','uk':'Розмір шрифту','vi':'Cỡ chữ','zh-cn':'字号','zh-tw':'字級'},
        letter_spacing:{'en':'Letter spacing','bg':'Разредка','cs':'Rozestup písmen','da':'Bogstavafstand','de':'Zeichenabstand','el':'Αραίωση','es-es':'Espaciado','et':'Tähevahe','fi':'Kirjainväli','fr':'Espacement','he':'ריווח אותיות','hr':'Razmak slova','hu':'Betűköz','it':'Spaziatura','ja':'字間','ko':'자간','lt':'Raidžių tarpai','nl':'Letterafstand','no':'Bokstavavstand','pl':'Odstępy liter','pt-br':'Espaçamento','pt-pt':'Espaçamento','ru':'Интервал букв','sk':'Rozostup písmen','sv-se':'Teckenavstånd','th':'ระยะห่างตัวอักษร','tr':'Harf aralığı','uk':'Інтервал літер','vi':'Giãn cách chữ','zh-cn':'字间距','zh-tw':'字距'},
        hover_effect:  {'en':'Hover effect','bg':'Ефект при посочване','cs':'Efekt najetí','da':'Hover-effekt','de':'Hover-Effekt','el':'Εφέ επισήμανσης','en-pt':'Pointin\' effect','es-es':'Efecto al pasar','et':'Hiire-efekt','fi':'Osoitustehoste','fr':'Effet au survol','he':'אפקט מעבר עכבר','hr':'Efekt prelaska','hu':'Rámutatás effekt','it':'Effetto al passaggio','ja':'ホバー効果','ko':'호버 효과','lt':'Užvedimo efektas','nl':'Hover-effect','no':'Hover-effekt','pl':'Efekt najechania','pt-br':'Efeito ao passar','pt-pt':'Efeito ao passar','ru':'Эффект наведения','sk':'Efekt prejdenia','sv-se':'Hover-effekt','th':'เอฟเฟกต์เมื่อชี้','tr':'Vurgu efekti','uk':'Ефект наведення','vi':'Hiệu ứng di chuột','zh-cn':'悬停效果','zh-tw':'滑過效果'},
        accent_bar:    {'en':'Accent bar','bg':'Цветна лента','cs':'Barevný pruh','da':'Accentstribe','de':'Akzentleiste','el':'Γραμμή τόνου','en-pt':'Colour stripe','es-es':'Barra de acento','et':'Rõhuriba','fi':'Korostuspalkki','fr':'Barre d\'accent','he':'פס הדגשה','hr':'Naglasna traka','hu':'Kiemelő sáv','it':'Barra accento','ja':'アクセントバー','ko':'강조 바','lt':'Akcento juosta','nl':'Accentbalk','no':'Aksentstripe','pl':'Pasek akcentu','pt-br':'Barra de destaque','pt-pt':'Barra de destaque','ru':'Акцентная полоса','sk':'Farebný pruh','sv-se':'Accentstapel','th':'แถบเน้นสี','tr':'Vurgu çubuğu','uk':'Акцентна смуга','vi':'Thanh nhấn','zh-cn':'强调条','zh-tw':'強調條'},
        reset:         {'en':'Reset','bg':'Нулирай','cs':'Obnovit','da':'Nulstil','de':'Zurücksetzen','el':'Επαναφορά','es-es':'Restablecer','et':'Lähtesta','fi':'Palauta','fr':'Réinitialiser','he':'אפס','hr':'Vrati','hu':'Visszaállít','it':'Ripristina','ja':'リセット','ko':'초기화','lt':'Atstatyti','nl':'Herstel','no':'Tilbakestill','pl':'Resetuj','pt-br':'Redefinir','pt-pt':'Repor','ru':'Сброс','sk':'Obnoviť','sv-se':'Återställ','th':'รีเซ็ต','tr':'Sıfırla','uk':'Скинути','vi':'Đặt lại','zh-cn':'重置','zh-tw':'重置'},
        enable_music:  {'en':'Enable music player','bg':'Музикален плеър','cs':'Hudební přehrávač','da':'Musikafspiller','de':'Musikplayer','el':'Πρόγραμμα μουσικής','en-pt':'Shanty player','es-es':'Reproductor','et':'Muusikamängija','fi':'Musiikkisoitin','fr':'Lecteur de musique','he':'נגן מוזיקה','hr':'Reproduktor glazbe','hu':'Zenelejátszó','it':'Lettore musicale','ja':'音楽プレーヤー','ko':'음악 플레이어','lt':'Muzikos grotuvas','nl':'Muziekspeler','no':'Musikkspiller','pl':'Odtwarzacz muzyki','pt-br':'Player de música','pt-pt':'Leitor de música','ru':'Музыкальный плеер','sk':'Hudobný prehrávač','sv-se':'Musikspelare','th':'เครื่องเล่นเพลง','tr':'Müzik çalar','uk':'Музичний плеєр','vi':'Trình phát nhạc','zh-cn':'音乐播放器','zh-tw':'音樂播放器'},
        custom_sounds: {'en':'Portal 2 UI sounds','bg':'Portal 2 UI звуци','cs':'Zvuky UI z Portal 2','da':'Portal 2 UI-lyde','de':'Portal-2-UI-Sounds','el':'Ήχοι UI Portal 2','en-pt':'Portal 2 sounds, arr','es-es':'Sonidos UI de Portal 2','et':'Portal 2 UI helid','fi':'Portal 2 UI-äänet','fr':'Sons UI de Portal 2','he':'צלילי ממשק Portal 2','hr':'Portal 2 UI zvukovi','hu':'Portal 2 UI hangok','it':'Suoni UI di Portal 2','ja':'Portal 2 のUI音','ko':'Portal 2 UI 사운드','lt':'Portal 2 UI garsai','nl':'Portal 2 UI-geluiden','no':'Portal 2 UI-lyder','pl':'Dźwięki UI z Portal 2','pt-br':'Sons de UI do Portal 2','pt-pt':'Sons de UI do Portal 2','ru':'Звуки UI из Portal 2','sk':'Zvuky UI z Portal 2','sv-se':'Portal 2 UI-ljud','th':'เสียง UI จาก Portal 2','tr':'Portal 2 arayüz sesleri','uk':'Звуки UI з Portal 2','vi':'Âm thanh UI Portal 2','zh-cn':'Portal 2 界面音效','zh-tw':'Portal 2 介面音效'},
        sounds_default:{'en':"Portal 2's menu sounds are used by default.",'bg':'По подразбиране се използват звуците от менюто на Portal 2.','cs':'Ve výchozím nastavení se používají zvuky menu z Portal 2.','da':'Som standard bruges menulydene fra Portal 2.','de':'Standardmäßig werden die Menü-Sounds aus Portal 2 verwendet.','el':'Από προεπιλογή χρησιμοποιούνται οι ήχοι μενού του Portal 2.','en-pt':"Portal 2's menu sounds be used by default, matey.",'es-es':'Por defecto se usan los sonidos del menú de Portal 2.','et':'Vaikimisi kasutatakse Portal 2 menüü helisid.','fi':'Oletuksena käytetään Portal 2:n valikkoääniä.','fr':'Par défaut, les sons de menu de Portal 2 sont utilisés.','he':'כברירת מחדל נעשה שימוש בצלילי התפריט של Portal 2.','hr':'Prema zadanim postavkama koriste se zvukovi izbornika iz Portal 2.','hu':'Alapértelmezetten a Portal 2 menühangjai szólnak.','it':'Per impostazione predefinita vengono usati i suoni del menu di Portal 2.','ja':'既定では Portal 2 のメニュー音を使用します。','ko':'기본적으로 Portal 2의 메뉴 사운드를 사용합니다.','lt':'Pagal numatytuosius nustatymus naudojami Portal 2 meniu garsai.','nl':'Standaard worden de menugeluiden van Portal 2 gebruikt.','no':'Som standard brukes menylydene fra Portal 2.','pl':'Domyślnie używane są dźwięki menu z Portal 2.','pt-br':'Por padrão, são usados os sons de menu do Portal 2.','pt-pt':'Por predefinição, são usados os sons de menu do Portal 2.','ru':'По умолчанию используются звуки меню из Portal 2.','sk':'Predvolene sa používajú zvuky menu z Portal 2.','sv-se':'Som standard används menyljuden från Portal 2.','th':'ค่าเริ่มต้นจะใช้เสียงเมนูจาก Portal 2','tr':'Varsayılan olarak Portal 2 menü sesleri kullanılır.','uk':'За замовчуванням використовуються звуки меню з Portal 2.','vi':'Mặc định sử dụng âm thanh menu của Portal 2.','zh-cn':'默认使用 Portal 2 的菜单音效。','zh-tw':'預設使用 Portal 2 的選單音效。'},
        np_toast:      {'en':'Now playing popup','bg':'Известие за песента','cs':'Oznámení o skladbě','da':'Besked om nummeret','de':'Hinweis zum aktuellen Titel','el':'Ειδοποίηση κομματιού','es-es':'Aviso de la canción','et':'Loo teavitus','fi':'Nyt soi -ilmoitus','fr':'Notification du titre','he':'התראה על השיר','hr':'Obavijest o pjesmi','hu':'Most szól értesítés','it':'Avviso del brano','ja':'再生中の通知','ko':'재생 중 알림','lt':'Pranešimas apie dainą','nl':'Melding van het nummer','no':'Varsel om sangen','pl':'Powiadomienie o utworze','pt-br':'Aviso da música','pt-pt':'Aviso da música','ru':'Уведомление о треке','sk':'Oznámenie o skladbe','sv-se':'Avisering om låten','th':'แจ้งเตือนเพลงที่เล่น','tr':'Şimdi çalıyor bildirimi','uk':'Сповіщення про трек','vi':'Thông báo bài hát','zh-cn':'正在播放提示','zh-tw':'正在播放提示'},
        stop_on_join:  {'en':'Stop music when joining','bg':'Спри при влизане','cs':'Zastavit při připojení','da':'Stop ved tilslutning','de':'Beim Beitreten stoppen','el':'Διακοπή κατά τη σύνδεση','en-pt':'Belay the shanty when boardin\'','es-es':'Parar al entrar','et':'Peata liitumisel','fi':'Pysäytä liityttäessä','fr':'Arrêter en rejoignant','he':'עצור בהצטרפות','hr':'Zaustavi pri ulasku','hu':'Leállítás csatlakozáskor','it':'Ferma all\'ingresso','ja':'参加時に停止','ko':'접속 시 정지','lt':'Sustabdyti prisijungus','nl':'Stoppen bij deelnemen','no':'Stopp ved tilkobling','pl':'Zatrzymaj przy dołączaniu','pt-br':'Parar ao entrar','pt-pt':'Parar ao entrar','ru':'Стоп при входе','sk':'Zastaviť pri pripojení','sv-se':'Stoppa vid anslutning','th':'หยุดเมื่อเข้าร่วม','tr':'Katılırken durdur','uk':'Стоп при вході','vi':'Dừng khi tham gia','zh-cn':'加入时停止','zh-tw':'加入時停止'},
        sounds_hint:   {'en':'Drop your own {snd} sounds into','bg':'Постави свои {snd} звуци в','cs':'Vlož vlastní zvuky {snd} do','da':'Læg dine egne {snd}-lyde i','de':'Eigene {snd}-Sounds ablegen in','el':'Βάλε τους ήχους {snd} στο','en-pt':'Stow yer {snd} sounds in','es-es':'Coloca tus sonidos {snd} en','et':'Aseta oma {snd} helid kausta','fi':'Pudota omat {snd}-äänet kansioon','fr':'Déposez vos sons {snd} dans','he':'הכנס צלילי {snd} משלך אל','hr':'Ubaci svoje {snd} zvukove u','hu':'Tedd a saját {snd} hangjaid ide:','it':'Metti i tuoi suoni {snd} in','ja':'自分の{snd}音をここへ:','ko':'나만의 {snd} 사운드를 넣기:','lt':'Įkelk savo {snd} garsus į','nl':'Zet je eigen {snd}-geluiden in','no':'Legg egne {snd}-lyder i','pl':'Umieść własne dźwięki {snd} w','pt-br':'Coloque seus sons {snd} em','pt-pt':'Coloca os teus sons {snd} em','ru':'Положи свои звуки {snd} в','sk':'Vlož vlastné zvuky {snd} do','sv-se':'Lägg egna {snd}-ljud i','th':'วางไฟล์เสียง {snd} ของคุณใน','tr':'Kendi {snd} seslerini şu klasöre bırak:','uk':'Поклади свої звуки {snd} до','vi':'Đặt âm thanh {snd} của bạn vào','zh-cn':'将自定义{snd}音效放入','zh-tw':'將自訂{snd}音效放入'},
        animation:     {'en':'Animation','bg':'Анимация','cs':'Animace','el':'Κίνηση','es-es':'Animación','et':'Animatsioon','fi':'Animaatio','he':'אנימציה','hr':'Animacija','hu':'Animáció','it':'Animazione','ja':'アニメーション','ko':'애니메이션','lt':'Animacija','nl':'Animatie','no':'Animasjon','pl':'Animacja','pt-br':'Animação','pt-pt':'Animação','ru':'Анимация','sk':'Animácia','sv-se':'Animering','th':'แอนิเมชัน','tr':'Animasyon','uk':'Анімація','vi':'Hoạt ảnh','zh-cn':'动画','zh-tw':'動畫'},
        an_none:       {'en':'None','bg':'Без','cs':'Žádná','da':'Ingen','de':'Keine','el':'Καμία','es-es':'No','et':'Puudub','fi':'Ei','fr':'Aucune','he':'ללא','hr':'Bez','hu':'Nincs','it':'No','ja':'なし','ko':'없음','lt':'Nėra','nl':'Geen','no':'Ingen','pl':'Brak','pt-br':'Não','pt-pt':'Não','ru':'Нет','sk':'Žiadna','sv-se':'Ingen','th':'ไม่มี','tr':'Yok','uk':'Немає','vi':'Không','zh-cn':'无','zh-tw':'無'},
        an_zoom:       {'en':'Zoom','bg':'Зум','el':'Ζουμ','he':'זום','ja':'ズーム','ko':'줌','ru':'Зум','uk':'Зум','th':'ซูม','zh-cn':'缩放','zh-tw':'縮放'},
        an_pan:        {'en':'Pan','he':'הזזה','ja':'パン','ko':'팬','ru':'Сдвиг','uk':'Зсув','th':'แพน','zh-cn':'平移','zh-tw':'平移'},
        an_float:      {'en':'Float','bg':'Плаване','cs':'Vznos','da':'Svæv','de':'Schweben','el':'Αιώρηση','en-pt':"Driftin'",'es-es':'Flotar','et':'Hõljuv','fi':'Leijunta','fr':'Flottant','he':'ריחוף','hr':'Lebdenje','hu':'Lebegés','it':'Fluttua','ja':'浮遊','ko':'부유','lt':'Pleventi','nl':'Zwevend','no':'Svev','pl':'Dryf','pt-br':'Flutuar','pt-pt':'Flutuar','ru':'Парение','sk':'Vznos','sv-se':'Sväva','th':'ลอย','tr':'Süzülme','uk':'Ширяння','vi':'Lơ lửng','zh-cn':'漂浮','zh-tw':'漂浮'},
        swap_interval: {'en':'Swap interval','bg':'Интервал на смяна','cs':'Interval střídání','da':'Skifteinterval','de':'Wechselintervall','el':'Διάστημα εναλλαγής','es-es':'Intervalo de cambio','et':'Vahetusintervall','fi':'Vaihtoväli','fr':'Intervalle','he':'מרווח החלפה','hr':'Interval izmjene','hu':'Váltási időköz','it':'Intervallo cambio','ja':'切替間隔','ko':'전환 간격','lt':'Keitimo intervalas','nl':'Wisselinterval','no':'Bytteintervall','pl':'Interwał zmiany','pt-br':'Intervalo de troca','pt-pt':'Intervalo de troca','ru':'Интервал смены','sk':'Interval striedania','sv-se':'Bytesintervall','th':'ช่วงสลับภาพ','tr':'Değişim aralığı','uk':'Інтервал зміни','vi':'Chu kỳ đổi','zh-cn':'切换间隔','zh-tw':'切換間隔'},
        blur:          {'en':'Gaussian blur','bg':'Гаусово замъгляване','cs':'Gaussovo rozostření','da':'Gaussisk sløring','de':'Gaußscher Weichzeichner','el':'Θόλωμα Gauss','en-pt':'Gaussian fog o\' war','es-es':'Desenfoque gaussiano','et':'Gaussi hägustus','fi':'Gaussin sumennus','fr':'Flou gaussien','he':'טשטוש גאוסי','hr':'Gaussovo zamućenje','hu':'Gauss-elmosás','it':'Sfocatura gaussiana','ja':'ガウスぼかし','ko':'가우시안 흐림','lt':'Gauso suliejimas','nl':'Gaussiaanse vervaging','no':'Gaussisk uskarphet','pl':'Rozmycie gaussowskie','pt-br':'Desfoque gaussiano','pt-pt':'Desfoque gaussiano','ru':'Размытие по Гауссу','sk':'Gaussovo rozostrenie','sv-se':'Gaussisk oskärpa','th':'เบลอแบบเกาส์เซียน','tr':'Gauss bulanıklığı','uk':'Розмиття за Гаусом','vi':'Làm mờ Gaussian','zh-cn':'高斯模糊','zh-tw':'高斯模糊'},
        anim_locked:   {'en':'Background animation is paused while blur is on, since running both is heavy.','bg':'Анимацията на фона е спряна, докато замъгляването е включено, защото двете заедно натоварват.','cs':'Animace pozadí je pozastavena, když je zapnuté rozostření, protože obojí naráz je náročné.','da':'Baggrundsanimationen er sat på pause, mens sløring er slået til, da begge dele samtidig er tungt.','de':'Die Hintergrund-Animation pausiert, solange der Weichzeichner aktiv ist, da beides zusammen sehr teuer ist.','el':'Η κίνηση φόντου είναι σε παύση όσο το θόλωμα είναι ενεργό, καθώς μαζί κοστίζουν πολύ.','en-pt':"Backdrop be still while the fog be up, for both at once be heavy goin'.",'es-es':'La animación del fondo se pausa con el desenfoque activo, porque juntos consumen mucho.','et':'Tausta animatsioon on hägustuse ajal peatatud, sest koos on need rasked.','fi':'Taustan animaatio on pysäytetty sumennuksen ollessa päällä, koska yhdessä ne kuormittavat.','fr':"L'animation du fond est en pause quand le flou est actif, car les deux ensemble coûtent cher.",'he':'אנימציית הרקע מושהית כשהטשטוש פעיל, מכיוון ששניהם יחד כבדים.','hr':'Animacija pozadine je pauzirana dok je zamućenje uključeno, jer su zajedno zahtjevni.','hu':'A háttéranimáció szünetel, amíg az elmosás be van kapcsolva, mert együtt sokat terhelnek.','it':"L'animazione dello sfondo è in pausa con la sfocatura attiva, perché insieme pesano molto.",'ja':'ぼかし有効中は背景アニメーションを停止します。同時に使うと重くなるためです。','ko':'흐림이 켜져 있는 동안 배경 애니메이션은 정지됩니다. 함께 사용하면 무겁기 때문입니다.','lt':'Fono animacija sustabdyta, kai įjungtas suliejimas, nes kartu jie stipriai apkrauna.','nl':'Achtergrondanimatie staat stil zolang vervaging aan is, omdat ze samen zwaar zijn.','no':'Bakgrunnsanimasjonen er satt på pause mens uskarphet er på, siden begge sammen er tungt.','pl':'Animacja tła jest wstrzymana przy włączonym rozmyciu, ponieważ razem mocno obciążają.','pt-br':'A animação do fundo fica pausada com o desfoque ligado, pois juntos pesam bastante.','pt-pt':'A animação do fundo fica em pausa com o desfoque ligado, pois juntos pesam bastante.','ru':'Анимация фона приостановлена, пока включено размытие, так как вместе они дорого обходятся.','sk':'Animácia pozadia je pozastavená, kým je zapnuté rozmazanie, pretože spolu sú náročné.','sv-se':'Bakgrundsanimeringen är pausad när oskärpa är på, eftersom de tillsammans är tunga.','th':'แอนิเมชันพื้นหลังหยุดชั่วคราวขณะเปิดเบลอ เพราะใช้พร้อมกันจะหนักเครื่อง','tr':'Blur açıkken arka plan animasyonu duraklatılır, çünkü ikisi birlikte performansı belirgin düşürüyor.','uk':'Анімація тла призупинена, поки увімкнено розмиття, оскільки разом вони дорого коштують.','vi':'Hoạt ảnh nền tạm dừng khi bật làm mờ, vì dùng cả hai rất nặng.','zh-cn':'开启模糊时暂停背景动画，因为两者同时运行开销很大。','zh-tw':'啟用模糊時暫停背景動畫，因為兩者同時運行開銷很大。'},
        strength:      {'en':'Strength','bg':'Сила','cs':'Síla','da':'Styrke','de':'Stärke','el':'Ένταση','en-pt':'Strength','es-es':'Intensidad','et':'Tugevus','fi':'Voimakkuus','fr':'Intensité','he':'עוצמה','hr':'Jačina','hu':'Erősség','it':'Intensità','ja':'強さ','ko':'강도','lt':'Stiprumas','nl':'Sterkte','no':'Styrke','pl':'Siła','pt-br':'Intensidade','pt-pt':'Intensidade','ru':'Сила','sk':'Sila','sv-se':'Styrka','th':'ความเข้ม','tr':'Şiddet','uk':'Сила','vi':'Cường độ','zh-cn':'强度','zh-tw':'強度'},
        bg_hint:       {'en':'Enable any number of backgrounds. More than one will cycle on the swap interval. None enabled = the game\'s own backgrounds.','bg':'Включи колкото искаш фонове, няколко се сменят през интервала. Нито един = фоновете на играта.','cs':'Zapni libovolný počet pozadí, více se střídá podle intervalu. Žádné = vlastní pozadí hry.','da':'Aktivér så mange baggrunde du vil, flere skifter efter intervallet. Ingen = spillets egne baggrunde.','de':'Beliebig viele Hintergründe aktivieren, mehrere wechseln im Intervall. Keiner aktiv = die Hintergründe des Spiels.','el':'Ενεργοποίησε όσα φόντα θες, πολλά εναλλάσσονται στο διάστημα. Κανένα = τα φόντα του παιχνιδιού.','en-pt':'Hoist as many backdrops as ye like, several rotate on the interval. None = the game\'s own backdrops.','es-es':'Activa los fondos que quieras: varios rotan según el intervalo. Ninguno activo = los fondos del juego.','et':'Luba mistahes arv tausti, mitu vahetuvad intervalli järgi. Mitte ükski = mängu enda taustad.','fi':'Ota käyttöön niin monta taustaa kuin haluat, useat vaihtuvat vaihtovälin mukaan. Ei yhtään = pelin omat taustat.','fr':"Activez autant de fonds que vous voulez, plusieurs alternent selon l'intervalle. Aucun activé = les fonds du jeu.",'he':'הפעל כמה רקעים שתרצה, כמה מתחלפים לפי המרווח. אף אחד = הרקעים של המשחק.','hr':'Uključi koliko god pozadina želiš, više njih se izmjenjuje po intervalu. Nijedna = pozadine same igre.','hu':'Tetszőleges számú hátteret bekapcsolhatsz, több esetén az időköz szerint váltakoznak. Egy sem = a játék saját hátterei.','it':'Attiva quanti sfondi vuoi: più sfondi ruotano secondo l\'intervallo. Nessuno attivo = gli sfondi del gioco.','ja':'背景はいくつでも有効化できます。複数は切替間隔で入れ替わります。なし = ゲーム標準の背景。','ko':'배경을 원하는 만큼 켤 수 있습니다. 여러 개면 전환 간격마다 바뀝니다. 없으면 게임 기본 배경.','lt':'Įjunk kiek nori fonų, keli keičiasi pagal intervalą. Nė vieno = žaidimo fonai.','nl':'Schakel zoveel achtergronden in als je wilt, meerdere wisselen per interval. Geen actief = de achtergronden van het spel.','no':'Aktiver så mange bakgrunner du vil, flere bytter etter intervallet. Ingen = spillets egne bakgrunner.','pl':'Włącz dowolną liczbę teł, kilka zmienia się co interwał. Żadne = tła samej gry.','pt-br':'Ative quantos fundos quiser, vários alternam no intervalo. Nenhum ativo = fundos do próprio jogo.','pt-pt':'Ativa os fundos que quiseres, vários alternam no intervalo. Nenhum ativo = fundos do próprio jogo.','ru':'Включай сколько угодно фонов, несколько сменяются по интервалу. Ни одного = фоны самой игры.','sk':'Zapni ľubovoľný počet pozadí, viaceré sa striedajú podľa intervalu. Žiadne = vlastné pozadia hry.','sv-se':'Aktivera hur många bakgrunder du vill, flera växlar enligt intervallet. Ingen = spelets egna bakgrunder.','th':'เปิดใช้พื้นหลังได้ตามต้องการ หลายภาพจะสลับตามช่วงเวลา ไม่เปิดเลย = พื้นหลังของเกม','tr':'İstediğin kadar arka plan seçebilirsin, birden fazlası değişim aralığında sırayla döner. Hiçbiri seçili değilse oyunun kendi arka planları kullanılır.','uk':'Вмикай скільки завгодно фонів, кілька змінюються за інтервалом. Жодного = фони самої гри.','vi':'Bật bao nhiêu nền tùy ý, nhiều nền sẽ luân phiên theo chu kỳ. Không bật = nền mặc định của game.','zh-cn':'可启用任意数量的背景，多个背景按切换间隔轮换。全部关闭 = 游戏自带背景。','zh-tw':'可啟用任意數量的背景，多個背景依切換間隔輪換。全部關閉 = 遊戲內建背景。'},
        default_3d:    {'en':'Default','bg':'Стандартен','cs':'Výchozí','da':'Standard','de':'Standard','el':'Προεπιλογή','es-es':'Por defecto','et':'Vaikimisi','fi':'Oletus','fr':'Par défaut','he':'ברירת מחדל','hr':'Zadano','hu':'Alap','it':'Predefinito','ja':'デフォルト','ko':'기본','lt':'Numatytasis','nl':'Standaard','no':'Standard','pl':'Domyślne','pt-br':'Padrão','pt-pt':'Padrão','ru':'По умолчанию','sk':'Predvolené','sv-se':'Standard','th':'ค่าเริ่มต้น','tr':'Varsayılan','uk':'Типовий','vi':'Mặc định','zh-cn':'默认','zh-tw':'預設'},
        default_bgs:   {'en':'Default backgrounds','bg':'Вградени фонове','cs':'Výchozí pozadí','da':'Standardbaggrunde','de':'Standard-Hintergründe','el':'Προεπιλεγμένα φόντα','es-es':'Fondos por defecto','et':'Vaikimisi taustad','fi':'Oletustaustat','fr':'Fonds par défaut','he':'רקעים מובנים','hr':'Zadane pozadine','hu':'Alap hátterek','it':'Sfondi predefiniti','ja':'標準の背景','ko':'기본 배경','lt':'Numatytieji fonai','nl':'Standaardachtergronden','no':'Standardbakgrunner','pl':'Tła domyślne','pt-br':'Fundos padrão','pt-pt':'Fundos padrão','ru':'Стандартные фоны','sk':'Predvolené pozadia','sv-se':'Standardbakgrunder','th':'พื้นหลังเริ่มต้น','tr':'Varsayılan arka planlar','uk':'Типові фони','vi':'Nền mặc định','zh-cn':'默认背景','zh-tw':'預設背景'},
        custom:        {'en':'Custom','bg':'Свои','cs':'Vlastní','da':'Egne','de':'Eigene','el':'Δικά σου','es-es':'Personalizados','et':'Oma','fi':'Omat','fr':'Personnalisés','he':'מותאמים','hr':'Vlastite','hu':'Egyéni','it':'Personalizzati','ja':'カスタム','ko':'커스텀','lt':'Savi','nl':'Eigen','no':'Egne','pl':'Własne','pt-br':'Personalizados','pt-pt':'Personalizados','ru':'Свои','sk':'Vlastné','sv-se':'Egna','th':'กำหนดเอง','tr':'Özel','uk':'Власні','vi':'Tùy chỉnh','zh-cn':'自定义','zh-tw':'自訂'},
        on_word:       {'en':'on','bg':'вкл.','cs':'zap.','da':'til','de':'aktiv','el':'ενεργά','es-es':'activos','et':'sees','fi':'päällä','fr':'actifs','he':'פעיל','hr':'uklj.','hu':'aktív','it':'attivi','ja':'有効','ko':'켜짐','lt':'įj.','nl':'actief','no':'på','pl':'wł.','pt-br':'ativos','pt-pt':'ativos','ru':'вкл.','sk':'zap.','sv-se':'på','th':'เปิด','tr':'açık','uk':'увімк.','vi':'bật','zh-cn':'开启','zh-tw':'開啟'},
        add_images:    {'en':'Add more images to','bg':'Добави още изображения в','cs':'Přidej další obrázky do','da':'Tilføj flere billeder i','de':'Mehr Bilder ablegen in','el':'Πρόσθεσε εικόνες στο','en-pt':'Stash more picture-maps in','es-es':'Añade más imágenes en','et':'Lisa pilte kausta','fi':'Lisää kuvia kansioon','fr':'Ajoutez des images dans','he':'הוסף עוד תמונות אל','hr':'Dodaj još slika u','hu':'További képek ide:','it':'Aggiungi altre immagini in','ja':'画像を追加:','ko':'이미지 추가:','lt':'Pridėk paveikslėlių į','nl':'Voeg meer afbeeldingen toe in','no':'Legg til flere bilder i','pl':'Dodaj więcej obrazów do','pt-br':'Adicione mais imagens em','pt-pt':'Adiciona mais imagens em','ru':'Добавь изображения в','sk':'Pridaj ďalšie obrázky do','sv-se':'Lägg till fler bilder i','th':'เพิ่มรูปภาพลงใน','tr':'Şu klasöre resim ekle:','uk':'Додай зображення до','vi':'Thêm ảnh vào','zh-cn':'添加更多图片到','zh-tw':'加入更多圖片到'},
        drop_images:   {'en':'Drop images into','bg':'Постави изображения в','cs':'Vlož obrázky do','da':'Læg billeder i','de':'Bilder ablegen in','el':'Βάλε εικόνες στο','en-pt':'Drop yer picture-maps in','es-es':'Suelta imágenes en','et':'Aseta pildid kausta','fi':'Pudota kuvat kansioon','fr':'Déposez des images dans','he':'הכנס תמונות אל','hr':'Ubaci slike u','hu':'Képek ide:','it':'Trascina immagini in','ja':'画像をここへ:','ko':'이미지 넣기:','lt':'Įkelk paveikslėlius į','nl':'Zet afbeeldingen in','no':'Legg bilder i','pl':'Umieść obrazy w','pt-br':'Coloque imagens em','pt-pt':'Coloca imagens em','ru':'Закинь изображения в','sk':'Vlož obrázky do','sv-se':'Lägg bilder i','th':'วางรูปภาพใน','tr':'Resimleri şuraya bırak:','uk':'Поклади зображення до','vi':'Đặt ảnh vào','zh-cn':'将图片放入','zh-tw':'將圖片放入'},
        menu_layout:   {'en':'Menu layout','bg':'Подредба на менюто','cs':'Rozložení menu','da':'Menulayout','de':'Menü-Layout','el':'Διάταξη μενού','es-es':'Diseño del menú','et':'Menüü paigutus','fi':'Valikon asettelu','fr':'Disposition du menu','he':'פריסת תפריט','hr':'Raspored izbornika','hu':'Menü elrendezés','it':'Layout menu','ja':'メニュー配置','ko':'메뉴 레이아웃','lt':'Meniu išdėstymas','nl':'Menu-indeling','no':'Menyoppsett','pl':'Układ menu','pt-br':'Layout do menu','pt-pt':'Layout do menu','ru':'Макет меню','sk':'Rozloženie menu','sv-se':'Menylayout','th':'เลย์เอาต์เมนู','tr':'Menü düzeni','uk':'Макет меню','vi':'Bố cục menu','zh-cn':'菜单布局','zh-tw':'選單版面'},
        cap_display:   {'en':'Display','bg':'Екран','cs':'Zobrazení','da':'Visning','de':'Anzeige','el':'Οθόνη','es-es':'Pantalla','et':'Kuva','fi':'Näyttö','fr':'Affichage','he':'תצוגה','hr':'Prikaz','hu':'Megjelenítés','it':'Schermo','ja':'表示','ko':'화면','lt':'Ekranas','nl':'Weergave','no':'Visning','pl':'Wyświetlanie','pt-br':'Exibição','pt-pt':'Ecrã','ru':'Экран','sk':'Zobrazenie','sv-se':'Visning','th':'การแสดงผล','tr':'Ekran','uk':'Екран','vi':'Hiển thị','zh-cn':'显示','zh-tw':'顯示'},
        cap_colors:    {'en':'Colors','bg':'Цветове','cs':'Barvy','da':'Farver','de':'Farben','el':'Χρώματα','es-es':'Colores','et':'Värvid','fi':'Värit','fr':'Couleurs','he':'צבעים','hr':'Boje','hu':'Színek','it':'Colori','ja':'カラー','ko':'색상','lt':'Spalvos','nl':'Kleuren','no':'Farger','pl':'Kolory','pt-br':'Cores','pt-pt':'Cores','ru':'Цвета','sk':'Farby','sv-se':'Färger','th':'สี','tr':'Renkler','uk':'Кольори','vi':'Màu sắc','zh-cn':'颜色','zh-tw':'顏色'},
        cap_text:      {'en':'Text','bg':'Текст','cs':'Text','da':'Tekst','de':'Text','el':'Κείμενο','es-es':'Texto','et':'Tekst','fi':'Teksti','fr':'Texte','he':'טקסט','hr':'Tekst','hu':'Szöveg','it':'Testo','ja':'テキスト','ko':'텍스트','lt':'Tekstas','nl':'Tekst','no':'Tekst','pl':'Tekst','pt-br':'Texto','pt-pt':'Texto','ru':'Текст','sk':'Text','sv-se':'Text','th':'ข้อความ','tr':'Metin','uk':'Текст','vi':'Văn bản','zh-cn':'文字','zh-tw':'文字'},
        cap_effects:   {'en':'Effects','bg':'Ефекти','cs':'Efekty','da':'Effekter','de':'Effekte','el':'Εφέ','es-es':'Efectos','et':'Efektid','fi':'Tehosteet','fr':'Effets','he':'אפקטים','hr':'Efekti','hu':'Effektek','it':'Effetti','ja':'エフェクト','ko':'효과','lt':'Efektai','nl':'Effecten','no':'Effekter','pl':'Efekty','pt-br':'Efeitos','pt-pt':'Efeitos','ru':'Эффекты','sk':'Efekty','sv-se':'Effekter','th':'เอฟเฟกต์','tr':'Efektler','uk':'Ефекти','vi':'Hiệu ứng','zh-cn':'效果','zh-tw':'效果'},
        cap_slideshow: {'en':'Slideshow','bg':'Слайдшоу','cs':'Prezentace','da':'Diasshow','de':'Diashow','el':'Προβολή','es-es':'Presentación','et':'Slaidiseanss','fi':'Diaesitys','fr':'Diaporama','he':'מצגת','hr':'Dijaprojekcija','hu':'Diavetítés','it':'Presentazione','ja':'スライドショー','ko':'슬라이드쇼','lt':'Skaidrės','nl':'Diavoorstelling','no':'Lysbildeserie','pl':'Pokaz slajdów','pt-br':'Apresentação','pt-pt':'Apresentação','ru':'Слайд-шоу','sk':'Prezentácia','sv-se':'Bildspel','th':'สไลด์โชว์','tr':'Slayt gösterisi','uk':'Слайдшоу','vi':'Trình chiếu','zh-cn':'幻灯片','zh-tw':'投影片'},
        cap_images:    {'en':'Images','bg':'Изображения','cs':'Obrázky','da':'Billeder','de':'Bilder','el':'Εικόνες','es-es':'Imágenes','et':'Pildid','fi':'Kuvat','fr':'Images','he':'תמונות','hr':'Slike','hu':'Képek','it':'Immagini','ja':'画像','ko':'이미지','lt':'Paveikslėliai','nl':'Afbeeldingen','no':'Bilder','pl':'Obrazy','pt-br':'Imagens','pt-pt':'Imagens','ru':'Изображения','sk':'Obrázky','sv-se':'Bilder','th':'รูปภาพ','tr':'Görseller','uk':'Зображення','vi':'Hình ảnh','zh-cn':'图片','zh-tw':'圖片'},
        cap_livebg:    {'en':'Live background','bg':'Жив фон','cs':'Živé pozadí','da':'Levende baggrund','de':'Live-Hintergrund','el':'Ζωντανό φόντο','es-es':'Fondo en vivo','et':'Elav taust','fi':'Elävä tausta','fr':'Arrière-plan animé','he':'רקע חי','hr':'Živa pozadina','hu':'Élő háttér','it':'Sfondo dal vivo','ja':'ライブ背景','ko':'라이브 배경','lt':'Gyvas fonas','nl':'Live-achtergrond','no':'Levende bakgrunn','pl':'Żywe tło','pt-br':'Fundo ao vivo','pt-pt':'Fundo ao vivo','ru':'Живой фон','sk':'Živé pozadie','sv-se':'Levande bakgrund','th':'พื้นหลังสด','tr':'Canlı arka plan','uk':'Живий фон','vi':'Nền sống động','zh-cn':'实时背景','zh-tw':'即時背景'},
        livebg_on:     {'en':'Enable live background','bg':'Включи живия фон','cs':'Zapnout živé pozadí','da':'Slå levende baggrund til','de':'Live-Hintergrund aktivieren','el':'Ενεργοποίηση ζωντανού φόντου','es-es':'Activar fondo en vivo','et':'Luba elav taust','fi':'Ota elävä tausta käyttöön','fr':'Activer l’arrière-plan animé','he':'הפעל רקע חי','hr':'Uključi živu pozadinu','hu':'Élő háttér bekapcsolása','it':'Attiva sfondo dal vivo','ja':'ライブ背景を有効化','ko':'라이브 배경 사용','lt':'Įjungti gyvą foną','nl':'Live-achtergrond inschakelen','no':'Slå på levende bakgrunn','pl':'Włącz żywe tło','pt-br':'Ativar fundo ao vivo','pt-pt':'Ativar fundo ao vivo','ru':'Включить живой фон','sk':'Zapnúť živé pozadie','sv-se':'Aktivera levande bakgrund','th':'เปิดพื้นหลังสด','tr':'Canlı arka planı aç','uk':'Увімкнути живий фон','vi':'Bật nền sống động','zh-cn':'启用实时背景','zh-tw':'啟用即時背景'},
        livebg_map:    {'en':'Map','bg':'Карта','cs':'Mapa','da':'Bane','de':'Karte','el':'Χάρτης','es-es':'Mapa','et':'Kaart','fi':'Kartta','fr':'Carte','he':'מפה','hr':'Mapa','hu':'Pálya','it':'Mappa','ja':'マップ','ko':'맵','lt':'Žemėlapis','nl':'Map','no':'Kart','pl':'Mapa','pt-br':'Mapa','pt-pt':'Mapa','ru':'Карта','sk':'Mapa','sv-se':'Karta','th':'แผนที่','tr':'Harita','uk':'Мапа','vi':'Bản đồ','zh-cn':'地图','zh-tw':'地圖'},
        livebg_random: {'en':'Random','bg':'Случайна','cs':'Náhodná','da':'Tilfældig','de':'Zufällig','el':'Τυχαίος','es-es':'Aleatorio','et':'Juhuslik','fi':'Satunnainen','fr':'Aléatoire','he':'אקראי','hr':'Nasumično','hu':'Véletlenszerű','it':'Casuale','ja':'ランダム','ko':'무작위','lt':'Atsitiktinis','nl':'Willekeurig','no':'Tilfeldig','pl':'Losowa','pt-br':'Aleatório','pt-pt':'Aleatório','ru':'Случайная','sk':'Náhodná','sv-se':'Slumpmässig','th':'สุ่ม','tr':'Rastgele','uk':'Випадкова','vi':'Ngẫu nhiên','zh-cn':'随机','zh-tw':'隨機'},
        livebg_hl2_none: {'en':'Half-Life 2 scenes need Half-Life 2 to be installed.','bg':'Сцените от Half-Life 2 изискват инсталиран Half-Life 2.','cs':'Scény z Half-Life 2 vyžadují nainstalovaný Half-Life 2.','da':'Half-Life 2-scener kræver, at Half-Life 2 er installeret.','de':'Half-Life-2-Szenen benötigen ein installiertes Half-Life 2.','el':'Οι σκηνές του Half-Life 2 απαιτούν εγκατεστημένο το Half-Life 2.','es-es':'Las escenas de Half-Life 2 requieren tener Half-Life 2 instalado.','et':'Half-Life 2 stseenide jaoks peab Half-Life 2 olema paigaldatud.','fi':'Half-Life 2 -näkymät vaativat, että Half-Life 2 on asennettu.','fr':'Les scènes de Half-Life 2 nécessitent que Half-Life 2 soit installé.','he':'סצנות Half-Life 2 דורשות ש-Half-Life 2 יהיה מותקן.','hr':'Scene iz Half-Life 2 zahtijevaju instaliran Half-Life 2.','hu':'A Half-Life 2 jelenetekhez telepített Half-Life 2 szükséges.','it':'Le scene di Half-Life 2 richiedono Half-Life 2 installato.','ja':'Half-Life 2 のシーンには Half-Life 2 のインストールが必要です。','ko':'Half-Life 2 장면을 사용하려면 Half-Life 2가 설치되어 있어야 합니다.','lt':'Half-Life 2 scenoms reikia įdiegto Half-Life 2.','nl':'Half-Life 2-scènes vereisen dat Half-Life 2 is geïnstalleerd.','no':'Half-Life 2-scener krever at Half-Life 2 er installert.','pl':'Sceny z Half-Life 2 wymagają zainstalowanego Half-Life 2.','pt-br':'As cenas de Half-Life 2 exigem o Half-Life 2 instalado.','pt-pt':'As cenas de Half-Life 2 exigem o Half-Life 2 instalado.','ru':'Для сцен Half-Life 2 нужен установленный Half-Life 2.','sk':'Scény z Half-Life 2 vyžadujú nainštalovaný Half-Life 2.','sv-se':'Half-Life 2-scener kräver att Half-Life 2 är installerat.','th':'ฉากของ Half-Life 2 ต้องติดตั้ง Half-Life 2 ก่อน','tr':'Half-Life 2 sahneleri için Half-Life 2 yüklü olmalı.','uk':'Для сцен Half-Life 2 потрібен встановлений Half-Life 2.','vi':'Các cảnh Half-Life 2 cần cài đặt Half-Life 2.','zh-cn':'Half-Life 2 场景需要安装 Half-Life 2。','zh-tw':'Half-Life 2 場景需要安裝 Half-Life 2。'},
        livebg_hl2_off: {'en':'Half-Life 2 scenes need Half-Life 2 to be enabled in the Games menu.','bg':'Сцените от Half-Life 2 изискват Half-Life 2 да е включен в менюто Игри.','cs':'Scény z Half-Life 2 vyžadují zapnutý Half-Life 2 v nabídce Hry.','da':'Half-Life 2-scener kræver, at Half-Life 2 er slået til i menuen Spil.','de':'Half-Life-2-Szenen benötigen Half-Life 2, aktiviert im Spiele-Menü.','el':'Οι σκηνές του Half-Life 2 απαιτούν να είναι ενεργό το Half-Life 2 στο μενού Παιχνίδια.','es-es':'Las escenas de Half-Life 2 requieren activar Half-Life 2 en el menú Juegos.','et':'Half-Life 2 stseenide jaoks peab Half-Life 2 olema menüüs Mängud sisse lülitatud.','fi':'Half-Life 2 -näkymät vaativat, että Half-Life 2 on otettu käyttöön Pelit-valikossa.','fr':"Les scènes de Half-Life 2 nécessitent d'activer Half-Life 2 dans le menu Jeux.",'he':'סצנות Half-Life 2 דורשות להפעיל את Half-Life 2 בתפריט המשחקים.','hr':'Scene iz Half-Life 2 zahtijevaju uključen Half-Life 2 u izborniku Igre.','hu':'A Half-Life 2 jelenetekhez engedélyezni kell a Half-Life 2-t a Játékok menüben.','it':'Le scene di Half-Life 2 richiedono Half-Life 2 attivato nel menu Giochi.','ja':'Half-Life 2 のシーンを使うには、ゲームメニューで Half-Life 2 を有効にしてください。','ko':'Half-Life 2 장면을 사용하려면 게임 메뉴에서 Half-Life 2를 켜야 합니다.','lt':'Half-Life 2 scenoms reikia įjungti Half-Life 2 meniu „Žaidimai“.','nl':'Half-Life 2-scènes vereisen dat Half-Life 2 is ingeschakeld in het menu Games.','no':'Half-Life 2-scener krever at Half-Life 2 er slått på i Spill-menyen.','pl':'Sceny z Half-Life 2 wymagają włączenia Half-Life 2 w menu Gry.','pt-br':'As cenas de Half-Life 2 exigem o Half-Life 2 ativado no menu Jogos.','pt-pt':'As cenas de Half-Life 2 exigem o Half-Life 2 ativado no menu Jogos.','ru':'Для сцен Half-Life 2 включите Half-Life 2 в меню «Игры».','sk':'Scény z Half-Life 2 vyžadujú zapnutý Half-Life 2 v ponuke Hry.','sv-se':'Half-Life 2-scener kräver att Half-Life 2 är aktiverat i menyn Spel.','th':'ฉากของ Half-Life 2 ต้องเปิด Half-Life 2 ในเมนูเกม','tr':'Half-Life 2 sahneleri için Half-Life 2, Oyunlar menüsünde etkin olmalı.','uk':'Для сцен Half-Life 2 увімкніть Half-Life 2 у меню «Ігри».','vi':'Các cảnh Half-Life 2 cần bật Half-Life 2 trong menu Trò chơi.','zh-cn':'Half-Life 2 场景需要在游戏菜单中启用 Half-Life 2。','zh-tw':'Half-Life 2 場景需要在遊戲選單中啟用 Half-Life 2。'},
        livebg_hint:   {'en':'Experimental. Loads a map behind the menu with its sounds. Addons load with it, so it can take a moment.','bg':'Експериментално. Зарежда карта със звуците ѝ зад менюто. Добавките се зареждат с нея, така че може да отнеме малко време.','cs':'Experimentální. Načte za menu mapu i s jejími zvuky. Doplňky se načtou s ní, takže to může chvíli trvat.','da':'Eksperimentel. Indlæser en bane med dens lyde bag menuen. Addons indlæses også, så det kan tage et øjeblik.','de':'Experimentell. Lädt eine Karte mit ihren Geräuschen hinter dem Menü. Addons werden mitgeladen, das kann einen Moment dauern.','el':'Πειραματικό. Φορτώνει έναν χάρτη με τους ήχους του πίσω από το μενού. Φορτώνονται και τα πρόσθετα, οπότε ίσως πάρει λίγο χρόνο.','es-es':'Experimental. Carga un mapa con sus sonidos detrás del menú. Los addons también se cargan, así que puede tardar un poco.','et':'Eksperimentaalne. Laadib menüü taha kaardi koos helidega. Lisandmoodulid laaditakse ka, nii et see võib veidi aega võtta.','fi':'Kokeellinen. Lataa kartan äänineen valikon taakse. Lisäosat latautuvat mukana, joten se voi kestää hetken.','fr':'Expérimental. Charge une carte avec ses sons derrière le menu. Les addons se chargent aussi, cela peut prendre un moment.','he':'ניסיוני. טוען מפה עם הצלילים שלה מאחורי התפריט. גם התוספים נטענים איתה, כך שזה עשוי לקחת רגע.','hr':'Eksperimentalno. Učitava mapu sa zvukovima iza izbornika. Dodaci se učitavaju s njom, pa može potrajati.','hu':'Kísérleti. Egy pályát tölt be a menü mögé a hangjaival együtt. A kiegészítők is betöltődnek, így eltarthat egy ideig.','it':'Sperimentale. Carica una mappa con i suoi suoni dietro il menu. Si caricano anche gli addon, quindi può richiedere un momento.','ja':'実験的機能。メニューの背後にマップをサウンド付きで読み込みます。アドオンも一緒に読み込まれるため、少し時間がかかることがあります。','ko':'실험적 기능. 메뉴 뒤에 소리와 함께 맵을 불러옵니다. 애드온도 함께 불러오므로 시간이 조금 걸릴 수 있습니다.','lt':'Eksperimentinė. Už meniu įkelia žemėlapį su jo garsais. Kartu įkeliami ir priedai, todėl gali šiek tiek užtrukti.','nl':'Experimenteel. Laadt een map met geluid achter het menu. Addons laden mee, dus het kan even duren.','no':'Eksperimentell. Laster et kart med lydene bak menyen. Tillegg lastes også, så det kan ta litt tid.','pl':'Eksperymentalne. Wczytuje mapę z jej dźwiękami za menu. Dodatki wczytują się razem z nią, więc może to chwilę potrwać.','pt-br':'Experimental. Carrega um mapa com seus sons atrás do menu. Os addons carregam junto, então pode demorar um pouco.','pt-pt':'Experimental. Carrega um mapa com os seus sons atrás do menu. Os addons carregam também, por isso pode demorar um pouco.','ru':'Экспериментально. Загружает карту со звуками за меню. Аддоны загружаются вместе с ней, поэтому это может занять время.','sk':'Experimentálne. Načíta za menu mapu aj s jej zvukmi. Doplnky sa načítajú s ňou, takže to môže chvíľu trvať.','sv-se':'Experimentell. Laddar en karta med ljud bakom menyn. Tillägg laddas också, så det kan ta en stund.','th':'ทดลองใช้ โหลดแผนที่พร้อมเสียงไว้หลังเมนู แอดออนจะโหลดตามไปด้วย จึงอาจใช้เวลาสักครู่','tr':'Deneysel. Menünün arkasında sesleriyle birlikte bir harita yükler. Eklentiler de onunla yüklendiği için biraz sürebilir.','uk':'Експериментально. Завантажує мапу зі звуками за меню. Аддони завантажуються разом із нею, тож це може зайняти час.','vi':'Thử nghiệm. Tải một bản đồ kèm âm thanh phía sau menu. Addon cũng được tải theo nên có thể mất một lúc.','zh-cn':'实验性功能。在菜单后方加载带有音效的地图。插件也会随之加载，可能需要一点时间。','zh-tw':'實驗性功能。在選單後方載入帶有音效的地圖。模組也會一併載入，可能需要一點時間。'},
        cap_sounds:    {'en':'Sounds','bg':'Звуци','cs':'Zvuky','da':'Lyde','de':'Sounds','el':'Ήχοι','es-es':'Sonidos','et':'Helid','fi':'Äänet','fr':'Sons','he':'צלילים','hr':'Zvukovi','hu':'Hangok','it':'Suoni','ja':'サウンド','ko':'사운드','lt':'Garsai','nl':'Geluiden','no':'Lyder','pl':'Dźwięki','pt-br':'Sons','pt-pt':'Sons','ru':'Звуки','sk':'Zvuky','sv-se':'Ljud','th':'เสียง','tr':'Sesler','uk':'Звуки','vi':'Âm thanh','zh-cn':'音效','zh-tw':'音效'},
        preset:        {'en':'Preset','bg':'Шаблон','cs':'Předvolba','da':'Forvalg','de':'Vorlage','el':'Προεπιλογή','es-es':'Preajuste','et':'Eelseade','fi':'Esiasetus','fr':'Préréglage','he':'תבנית','hr':'Predložak','hu':'Előbeállítás','ja':'プリセット','ko':'프리셋','lt':'Šablonas','nl':'Voorinstelling','no':'Forhåndsvalg','pl':'Szablon','pt-br':'Predefinição','pt-pt':'Predefinição','ru':'Пресет','sk':'Predvoľba','sv-se':'Förval','th':'พรีเซ็ต','tr':'Ön ayar','uk':'Пресет','vi':'Cài sẵn','zh-cn':'预设','zh-tw':'預設集'},
        lo_centered:   {'en':'Centered','bg':'Центрирано','cs':'Na střed','da':'Centreret','de':'Zentriert','el':'Στο κέντρο','es-es':'Centrado','et':'Keskel','fi':'Keskitetty','fr':'Centré','he':'ממורכז','hr':'Centrirano','hu':'Középre','it':'Centrato','ja':'中央','ko':'중앙','lt':'Centre','nl':'Gecentreerd','no':'Sentrert','pl':'Środek','pt-br':'Centralizado','pt-pt':'Centrado','ru':'По центру','sk':'Na stred','sv-se':'Centrerad','th':'กึ่งกลาง','tr':'Ortalanmış','uk':'По центру','vi':'Giữa','zh-cn':'居中','zh-tw':'置中'},
        lo_vanillaright:{'en':'Vanilla Right','bg':'Vanilla вдясно','cs':'Vanilla vpravo','da':'Vanilla højre','de':'Vanilla rechts','el':'Vanilla δεξιά','en-pt':'Vanilla Starboard','es-es':'Vanilla derecha','et':'Vanilla parem','fi':'Vanilla oikea','fr':'Vanilla droite','he':'Vanilla ימין','hr':'Vanilla desno','hu':'Vanilla jobb','it':'Vanilla destra','ja':'バニラ 右','ko':'바닐라 오른쪽','lt':'Vanilla dešinė','nl':'Vanilla rechts','no':'Vanilla høyre','pl':'Vanilla prawo','pt-br':'Vanilla direita','pt-pt':'Vanilla direita','ru':'Ванилла справа','sk':'Vanilla vpravo','sv-se':'Vanilla höger','th':'ดั้งเดิม ขวา','tr':'Vanilla sağ','uk':'Ваніла справа','vi':'Vanilla phải','zh-cn':'原版 右','zh-tw':'原版 右'},
        lo_vanilla:    {'en':'Vanilla','ja':'バニラ','ko':'바닐라','ru':'Ванилла','uk':'Ваніла','th':'ดั้งเดิม','zh-cn':'原版','zh-tw':'原版'},
        lo_cinematic:  {'en':'Horizontal','bg':'Хоризонтален','cs':'Vodorovný','da':'Vandret','de':'Horizontal','el':'Οριζόντιο','es-es':'Horizontal','et':'Horisontaalne','fi':'Vaakasuora','fr':'Horizontal','he':'אופקי','hr':'Vodoravno','hu':'Vízszintes','it':'Orizzontale','ja':'横並び','ko':'가로형','lt':'Horizontalus','nl':'Horizontaal','no':'Vannrett','pl':'Poziomy','pt-br':'Horizontal','pt-pt':'Horizontal','ru':'Горизонтальный','sk':'Vodorovný','sv-se':'Horisontell','th':'แนวนอน','tr':'Yatay','uk':'Горизонтальний','vi':'Ngang','zh-cn':'横向','zh-tw':'橫向'},
        lo_modern:     {'en':'Modern','bg':'Модерен','cs':'Moderní','da':'Moderne','de':'Modern','el':'Μοντέρνο','es-es':'Moderno','et':'Kaasaegne','fi':'Moderni','fr':'Moderne','he':'מודרני','hr':'Moderno','hu':'Modern','it':'Moderno','ja':'モダン','ko':'모던','lt':'Modernus','nl':'Modern','no':'Moderne','pl':'Nowoczesny','pt-br':'Moderno','pt-pt':'Moderno','ru':'Современный','sk':'Moderný','sv-se':'Modern','th':'โมเดิร์น','tr':'Modern','uk':'Сучасний','vi':'Hiện đại','zh-cn':'现代','zh-tw':'現代'},
        main_menu_text:{'en':'Main menu text','bg':'Текст на менюто','cs':'Text menu','da':'Menutekst','de':'Menütext','el':'Κείμενο μενού','es-es':'Texto del menú','et':'Menüü tekst','fi':'Valikon teksti','fr':'Texte du menu','he':'טקסט תפריט','hr':'Tekst izbornika','hu':'Menü szöveg','it':'Testo del menu','ja':'メニュー文字','ko':'메뉴 텍스트','lt':'Meniu tekstas','nl':'Menutekst','no':'Menytekst','pl':'Tekst menu','pt-br':'Texto do menu','pt-pt':'Texto do menu','ru':'Текст меню','sk':'Text menu','sv-se':'Menytext','th':'ข้อความเมนู','tr':'Menü yazısı','uk':'Текст меню','vi':'Chữ menu','zh-cn':'菜单文字','zh-tw':'選單文字'},
        horizontal:    {'en':'Horizontal','bg':'Хоризонтално','cs':'Vodorovně','da':'Vandret','el':'Οριζόντια','et':'Horisontaal','fi':'Vaaka','fr':'Horizontal','he':'אופקי','hr':'Vodoravno','hu':'Vízszintes','it':'Orizzontale','ja':'横','ko':'가로','lt':'Horizontaliai','nl':'Horizontaal','no':'Horisontal','pl':'Poziomo','ru':'Горизонталь','sk':'Vodorovne','sv-se':'Horisontell','th':'แนวนอน','tr':'Yatay','uk':'Горизонталь','vi':'Ngang','zh-cn':'水平','zh-tw':'水平'},
        vertical:      {'en':'Vertical','bg':'Вертикално','cs':'Svisle','da':'Lodret','el':'Κάθετα','et':'Vertikaal','fi':'Pysty','he':'אנכי','hr':'Okomito','hu':'Függőleges','it':'Verticale','ja':'縦','ko':'세로','lt':'Vertikaliai','nl':'Verticaal','no':'Vertikal','pl':'Pionowo','ru':'Вертикаль','sk':'Zvisle','sv-se':'Vertikal','th':'แนวตั้ง','tr':'Dikey','uk':'Вертикаль','vi':'Dọc','zh-cn':'垂直','zh-tw':'垂直'},
        alignment:     {'en':'Alignment','bg':'Подравняване','cs':'Zarovnání','da':'Justering','de':'Ausrichtung','el':'Στοίχιση','es-es':'Alineación','et':'Joondus','fi':'Tasaus','fr':'Alignement','he':'יישור','hr':'Poravnanje','hu':'Igazítás','it':'Allineamento','ja':'配置','ko':'정렬','lt':'Lygiavimas','nl':'Uitlijning','no':'Justering','pl':'Wyrównanie','pt-br':'Alinhamento','pt-pt':'Alinhamento','ru':'Выравнивание','sk':'Zarovnanie','sv-se':'Justering','th':'การจัดแนว','tr':'Hizalama','uk':'Вирівнювання','vi':'Căn chỉnh','zh-cn':'对齐','zh-tw':'對齊'},
        al_left:       {'en':'Left','bg':'Ляво','cs':'Vlevo','da':'Venstre','de':'Links','el':'Αριστερά','es-es':'Izquierda','et':'Vasak','fi':'Vasen','fr':'Gauche','he':'שמאל','hr':'Lijevo','hu':'Balra','it':'Sinistra','ja':'左','ko':'왼쪽','lt':'Kairė','nl':'Links','no':'Venstre','pl':'Lewo','pt-br':'Esquerda','pt-pt':'Esquerda','ru':'Слева','sk':'Vľavo','sv-se':'Vänster','th':'ซ้าย','tr':'Sol','uk':'Ліворуч','vi':'Trái','zh-cn':'左','zh-tw':'左'},
        al_center:     {'en':'Center','bg':'Център','cs':'Střed','da':'Midt','de':'Mitte','el':'Κέντρο','es-es':'Centro','et':'Kesk','fi':'Keski','fr':'Centre','he':'מרכז','hr':'Sredina','hu':'Közép','it':'Centro','ja':'中央','ko':'가운데','lt':'Centras','nl':'Midden','no':'Midt','pl':'Środek','pt-br':'Centro','pt-pt':'Centro','ru':'Центр','sk':'Stred','sv-se':'Mitten','th':'กลาง','tr':'Orta','uk':'Центр','vi':'Giữa','zh-cn':'中','zh-tw':'中'},
        al_right:      {'en':'Right','bg':'Дясно','cs':'Vpravo','da':'Højre','de':'Rechts','el':'Δεξιά','es-es':'Derecha','et':'Parem','fi':'Oikea','fr':'Droite','he':'ימין','hr':'Desno','hu':'Jobbra','it':'Destra','ja':'右','ko':'오른쪽','lt':'Dešinė','nl':'Rechts','no':'Høyre','pl':'Prawo','pt-br':'Direita','pt-pt':'Direita','ru':'Справа','sk':'Vpravo','sv-se':'Höger','th':'ขวา','tr':'Sağ','uk':'Праворуч','vi':'Phải','zh-cn':'右','zh-tw':'右'},
        logo:          {'en':'Logo','bg':'Лого','el':'Λογότυπο','he':'לוגו','ja':'ロゴ','ko':'로고','ru':'Лого','uk':'Лого','th':'โลโก้','zh-cn':'标志','zh-tw':'標誌'},
        show_logo:     {'en':'Show logo','bg':'Покажи лого','cs':'Zobrazit logo','da':'Vis logo','de':'Logo anzeigen','el':'Εμφάνιση λογότυπου','es-es':'Mostrar logo','et':'Näita logo','fi':'Näytä logo','fr':'Afficher le logo','he':'הצג לוגו','hr':'Prikaži logo','hu':'Logó mutatása','it':'Mostra logo','ja':'ロゴを表示','ko':'로고 표시','lt':'Rodyti logotipą','nl':'Logo tonen','no':'Vis logo','pl':'Pokaż logo','pt-br':'Mostrar logo','pt-pt':'Mostrar logo','ru':'Показать лого','sk':'Zobraziť logo','sv-se':'Visa logga','th':'แสดงโลโก้','tr':'Logoyu göster','uk':'Показати лого','vi':'Hiện logo','zh-cn':'显示标志','zh-tw':'顯示標誌'},
        idle_anim:     {'en':'Idle animation','bg':'Анимация при бездействие','cs':'Animace při nečinnosti','da':'Animation ved inaktivitet','de':'Leerlaufanimation','el':'Κίνηση σε αδράνεια','es-es':'Animación en reposo','et':'Jõudeoleku animatsioon','fi':'Joutoanimaatio','fr':'Animation d’inactivité','he':'אנימציה בהמתנה','hr':'Animacija u mirovanju','hu':'Tétlenségi animáció','it':'Animazione di inattività','ja':'放置アニメーション','ko':'대기 애니메이션','lt':'Neveiklumo animacija','nl':'Animatie bij inactiviteit','no':'Animasjon ved inaktivitet','pl':'Animacja bezczynności','pt-br':'Animação ociosa','pt-pt':'Animação em repouso','ru':'Анимация простоя','sk':'Animácia pri nečinnosti','sv-se':'Animation vid inaktivitet','th':'แอนิเมชันขณะว่าง','tr':'Bekleme animasyonu','uk':'Анімація простою','vi':'Hoạt ảnh khi chờ','zh-cn':'闲置动画','zh-tw':'閒置動畫'},
        size:          {'en':'Size','bg':'Размер','cs':'Velikost','da':'Størrelse','de':'Größe','el':'Μέγεθος','es-es':'Tamaño','et':'Suurus','fi':'Koko','fr':'Taille','he':'גודל','hr':'Veličina','hu':'Méret','it':'Dimensione','ja':'サイズ','ko':'크기','lt':'Dydis','nl':'Grootte','no':'Størrelse','pl':'Rozmiar','pt-br':'Tamanho','pt-pt':'Tamanho','ru':'Размер','sk':'Veľkosť','sv-se':'Storlek','th':'ขนาด','tr':'Boyut','uk':'Розмір','vi':'Kích cỡ','zh-cn':'大小','zh-tw':'大小'},
        navbar:        {'en':'Navbar','bg':'Навигация','cs':'Navigace','de':'Navileiste','el':'Πλοήγηση','en-pt':"The riggin'",'es-es':'Navegación','et':'Menüüriba','fi':'Navigointi','fr':'Navigation','he':'סרגל ניווט','hr':'Navigacija','hu':'Navigáció','it':'Navigazione','ja':'ナビバー','ko':'내비 바','lt':'Navigacija','nl':'Navigatiebalk','no':'Navigasjon','pl':'Pasek nawigacji','pt-br':'Navegação','pt-pt':'Navegação','ru':'Навбар','sk':'Navigácia','sv-se':'Navigering','th':'แถบนำทาง','tr':'Gezinme çubuğu','uk':'Навбар','vi':'Thanh điều hướng','zh-cn':'导航栏','zh-tw':'導覽列'},
        target:        {'en':'Target','bg':'Цел','cs':'Cíl','da':'Mål','de':'Ziel','el':'Στόχος','es-es':'Objetivo','et':'Siht','fi':'Kohde','fr':'Cible','he':'יעד','hr':'Cilj','hu':'Cél','it':'Destinazione','ja':'対象','ko':'대상','lt':'Tikslas','nl':'Doel','no':'Mål','pl':'Cel','pt-br':'Alvo','pt-pt':'Alvo','ru':'Цель','sk':'Cieľ','sv-se':'Mål','th':'เป้าหมาย','tr':'Hedef','uk':'Ціль','vi':'Mục tiêu','zh-cn':'目标','zh-tw':'目標'},
        t_all:         {'en':'All','bg':'Всички','cs':'Vše','da':'Alle','de':'Alle','el':'Όλα','es-es':'Todos','et':'Kõik','fi':'Kaikki','fr':'Tous','he':'הכל','hr':'Sve','hu':'Mind','it':'Tutti','ja':'すべて','ko':'전체','lt':'Visi','nl':'Alle','no':'Alle','pl':'Wszystkie','pt-br':'Todos','pt-pt':'Todos','ru':'Все','sk':'Všetky','sv-se':'Alla','th':'ทั้งหมด','tr':'Tümü','uk':'Усі','vi':'Tất cả','zh-cn':'全部','zh-tw':'全部'},
        t_problems:    {'en':'Problems','bg':'Проблеми','cs':'Problémy','da':'Problemer','de':'Probleme','el':'Προβλήματα','es-es':'Problemas','et':'Probleemid','fi':'Ongelmat','fr':'Problèmes','he':'בעיות','hr':'Problemi','hu':'Problémák','it':'Problemi','ja':'問題','ko':'문제점','lt':'Problemos','nl':'Problemen','no':'Problemer','pl':'Problemy','pt-br':'Problemas','pt-pt':'Problemas','ru':'Проблемы','sk':'Problémy','sv-se':'Problem','th':'ปัญหา','tr':'Sorunlar','uk':'Проблеми','vi':'Những vấn đề','zh-cn':'问题','zh-tw':'問題'},
        t_games:       {'en':'Games','bg':'Игри','cs':'Hry','da':'Spil','de':'Spiele','el':'Παιχνίδια','en-pt':'Ships','es-es':'Juegos','et':'Mängud','fi':'Pelit','fr':'Jeux','he':'משחקים','hr':'Igre','hu':'Játékok','it':'Giochi','ja':'ゲーム','ko':'게임 목록','lt':'Žaidimai','nl':'Spellen','no':'Spill','pl':'Gry','pt-br':'Jogos','pt-pt':'Jogos','ru':'Игры','sk':'Hry','sv-se':'Spel','th':'เกม','tr':'Oyunlar','uk':'Ігри','vi':'Trò chơi','zh-cn':'游戏','zh-tw':'遊戲'},
        t_gamemode:    {'en':'Gamemode','bg':'Режим','cs':'Herní mód','da':'Spiltilstand','de':'Spielmodus','el':'Λειτουργία','es-es':'Modo de juego','et':'Mängurežiim','fi':'Pelitila','fr':'Mode de jeu','he':'מצב משחק','hr':'Način igre','hu':'Játékmód','it':'Modalità','ja':'ゲームモード','ko':'게임 모드','lt':'Žaidimo režimas','nl':'Spelmodus','no':'Spillmodus','pl':'Tryb gry','pt-br':'Modo de jogo','pt-pt':'Modo de jogo','ru':'Режим игры','sk':'Herný mód','sv-se':'Spelläge','th':'โหมดเกม','tr':'Oyun modu','uk':'Режим гри','vi':'Chế độ chơi','zh-cn':'游戏模式','zh-tw':'遊戲模式'},
        t_lang:        {'en':'Language','bg':'Език','cs':'Jazyk','da':'Sprog','de':'Sprache','el':'Γλώσσα','es-es':'Idioma','et':'Keel','fi':'Kieli','fr':'Langue','he':'שפה','hr':'Jezik','hu':'Nyelv','it':'Lingua','ja':'言語','ko':'언어','lt':'Kalba','nl':'Taal','no':'Språk','pl':'Język','pt-br':'Idioma','pt-pt':'Idioma','ru':'Язык','sk':'Jazyk','sv-se':'Språk','th':'ภาษา','tr':'Dil','uk':'Мова','vi':'Ngôn ngữ','zh-cn':'语言','zh-tw':'語言'},
        t_news:        {'en':'News','bg':'Новини','cs':'Zprávy','da':'Nyheder','de':'Nachrichten','el':'Νέα','es-es':'Noticias','et':'Uudised','fi':'Uutiset','fr':'Actualités','he':'חדשות','hr':'Vijesti','hu':'Hírek','it':'Notizie','ja':'ニュース','ko':'뉴스','lt':'Naujienos','nl':'Nieuws','no':'Nyheter','pl':'Aktualności','pt-br':'Notícias','pt-pt':'Notícias','ru':'Новости','sk':'Správy','sv-se':'Nyheter','th':'ข่าว','tr':'Haberler','uk':'Новини','vi':'Tin tức','zh-cn':'新闻','zh-tw':'新聞'},
        icons_only:    {'en':'Icons only','bg':'Само икони','cs':'Jen ikony','da':'Kun ikoner','de':'Nur Icons','el':'Μόνο εικονίδια','es-es':'Solo iconos','et':'Ainult ikoonid','fi':'Vain kuvakkeet','fr':'Icônes seules','he':'אייקונים בלבד','hr':'Samo ikone','hu':'Csak ikonok','it':'Solo icone','ja':'アイコンのみ','ko':'아이콘만','lt':'Tik piktogramos','nl':'Alleen iconen','no':'Kun ikoner','pl':'Tylko ikony','pt-br':'Apenas ícones','pt-pt':'Só ícones','ru':'Только иконки','sk':'Len ikony','sv-se':'Endast ikoner','th':'ไอคอนเท่านั้น','tr':'Sadece ikonlar','uk':'Лише іконки','vi':'Chỉ biểu tượng','zh-cn':'仅图标','zh-tw':'僅圖示'},
        loading_screen:{'en':'Loading screen','bg':'Екран за зареждане','cs':'Načítací obrazovka','da':'Indlæsningsskærm','de':'Ladebildschirm','el':'Οθόνη φόρτωσης','en-pt':"Loadin' screen",'es-es':'Pantalla de carga','et':'Laadimisekraan','fi':'Latausruutu','fr':'Écran de chargement','he':'מסך טעינה','hr':'Zaslon učitavanja','hu':'Betöltőképernyő','it':'Schermata di caricamento','ja':'ロード画面','ko':'로딩 화면','lt':'Įkėlimo ekranas','nl':'Laadscherm','no':'Lasteskjerm','pl':'Ekran ładowania','pt-br':'Tela de carregamento','pt-pt':'Ecrã de carregamento','ru':'Экран загрузки','sk':'Načítavacia obrazovka','sv-se':'Laddningsskärm','th':'หน้าจอโหลด','tr':'Yükleme ekranı','uk':'Екран завантаження','vi':'Màn hình tải','zh-cn':'加载画面','zh-tw':'載入畫面'},
        width:         {'en':'Width','bg':'Ширина','cs':'Šířka','da':'Bredde','de':'Breite','el':'Πλάτος','es-es':'Ancho','et':'Laius','fi':'Leveys','fr':'Largeur','he':'רוחב','hr':'Širina','hu':'Szélesség','it':'Larghezza','ja':'幅','ko':'너비','lt':'Plotis','nl':'Breedte','no':'Bredde','pl':'Szerokość','pt-br':'Largura','pt-pt':'Largura','ru':'Ширина','sk':'Šírka','sv-se':'Bredd','th':'ความกว้าง','tr':'Genişlik','uk':'Ширина','vi':'Chiều rộng','zh-cn':'宽度','zh-tw':'寬度'},
        bar_thickness: {'en':'Bar thickness','bg':'Дебелина на лентата','cs':'Tloušťka lišty','da':'Bjælketykkelse','de':'Balkenstärke','el':'Πάχος μπάρας','es-es':'Grosor de la barra','et':'Riba paksus','fi':'Palkin paksuus','fr':'Épaisseur de la barre','he':'עובי הפס','hr':'Debljina trake','hu':'Sáv vastagsága','it':'Spessore barra','ja':'バーの太さ','ko':'바 두께','lt':'Juostos storis','nl':'Balkdikte','no':'Linjetykkelse','pl':'Grubość paska','pt-br':'Espessura da barra','pt-pt':'Espessura da barra','ru':'Толщина полосы','sk':'Hrúbka lišty','sv-se':'Stapeltjocklek','th':'ความหนาแถบ','tr':'Çubuk kalınlığı','uk':'Товщина смуги','vi':'Độ dày thanh','zh-cn':'进度条粗细','zh-tw':'進度條粗細'},
        text_size:     {'en':'Text size','bg':'Размер на текста','cs':'Velikost textu','da':'Tekststørrelse','de':'Textgröße','el':'Μέγεθος κειμένου','es-es':'Tamaño del texto','et':'Teksti suurus','fi':'Tekstin koko','fr':'Taille du texte','he':'גודל טקסט','hr':'Veličina teksta','hu':'Szövegméret','it':'Dimensione testo','ja':'テキストサイズ','ko':'텍스트 크기','lt':'Teksto dydis','nl':'Tekstgrootte','no':'Tekststørrelse','pl':'Rozmiar tekstu','pt-br':'Tamanho do texto','pt-pt':'Tamanho do texto','ru':'Размер текста','sk':'Veľkosť textu','sv-se':'Textstorlek','th':'ขนาดข้อความ','tr':'Metin boyutu','uk':'Розмір тексту','vi':'Cỡ văn bản','zh-cn':'文字大小','zh-tw':'文字大小'},
        position:      {'en':'Position','bg':'Позиция','cs':'Pozice','da':'Placering','de':'Position','el':'Θέση','es-es':'Posición','et':'Asukoht','fi':'Sijainti','fr':'Position','he':'מיקום','hr':'Položaj','hu':'Pozíció','it':'Posizione','ja':'位置','ko':'위치','lt':'Padėtis','nl':'Positie','no':'Plassering','pl':'Pozycja','pt-br':'Posição','pt-pt':'Posição','ru':'Положение','sk':'Pozícia','sv-se':'Placering','th':'ตำแหน่ง','tr':'Konum','uk':'Положення','vi':'Vị trí','zh-cn':'位置','zh-tw':'位置'},
        progress_bar:  {'en':'Progress bar','bg':'Лента за напредък','cs':'Ukazatel průběhu','da':'Statuslinje','de':'Fortschrittsbalken','el':'Γραμμή προόδου','es-es':'Barra de progreso','et':'Edenemisriba','fi':'Edistymispalkki','fr':'Barre de progression','he':'סרגל התקדמות','hr':'Traka napretka','hu':'Folyamatjelző','it':'Barra di avanzamento','ja':'プログレスバー','ko':'진행률 표시줄','lt':'Eigos juosta','nl':'Voortgangsbalk','no':'Fremdriftslinje','pl':'Pasek postępu','pt-br':'Barra de progresso','pt-pt':'Barra de progresso','ru':'Полоса загрузки','sk':'Indikátor priebehu','sv-se':'Förloppsindikator','th':'แถบความคืบหน้า','tr':'İlerleme çubuğu','uk':'Смуга завантаження','vi':'Thanh tiến trình','zh-cn':'进度条','zh-tw':'進度列'},
        server_info:   {'en':'Server info','bg':'Информация за сървъра','cs':'Informace o serveru','da':'Serverinfo','de':'Serverinfo','el':'Πληροφορίες διακομιστή','es-es':'Info del servidor','et':'Serveri teave','fi':'Palvelimen tiedot','fr':'Infos du serveur','he':'פרטי שרת','hr':'Podaci o poslužitelju','hu':'Szerverinfó','it':'Info server','ja':'サーバー情報','ko':'서버 정보','lt':'Serverio informacija','nl':'Serverinfo','no':'Serverinfo','pl':'Informacje o serwerze','pt-br':'Info do servidor','pt-pt':'Info do servidor','ru':'Инфо о сервере','sk':'Informácie o serveri','sv-se':'Serverinfo','th':'ข้อมูลเซิร์ฟเวอร์','tr':'Sunucu bilgisi','uk':'Інфо про сервер','vi':'Thông tin máy chủ','zh-cn':'服务器信息','zh-tw':'伺服器資訊'},
        vertical_pos:  {'en':'Vertical position','bg':'Вертикална позиция','cs':'Svislá pozice','da':'Lodret placering','de':'Vertikale Position','el':'Κάθετη θέση','es-es':'Posición vertical','et':'Vertikaalne asukoht','fi':'Pystysijainti','fr':'Position verticale','he':'מיקום אנכי','hr':'Okomiti položaj','hu':'Függőleges pozíció','it':'Posizione verticale','ja':'縦位置','ko':'세로 위치','lt':'Vertikali padėtis','nl':'Verticale positie','no':'Vertikal plassering','pl':'Pozycja pionowa','pt-br':'Posição vertical','pt-pt':'Posição vertical','ru':'Вертикальное положение','sk':'Zvislá pozícia','sv-se':'Vertikal placering','th':'ตำแหน่งแนวตั้ง','tr':'Dikey konum','uk':'Вертикальне положення','vi':'Vị trí dọc','zh-cn':'垂直位置','zh-tw':'垂直位置'},
        upd_available: {'en':'Update available','bg':'Налична е актуализация','cs':'Je k dispozici aktualizace','da':'Opdatering tilgængelig','de':'Update verfügbar','el':'Διαθέσιμη ενημέρωση','es-es':'Actualización disponible','et':'Uuendus saadaval','fi':'Päivitys saatavilla','fr':'Mise à jour disponible','he':'עדכון זמין','hr':'Dostupno ažuriranje','hu':'Frissítés érhető el','it':'Aggiornamento disponibile','ja':'アップデートがあります','ko':'업데이트 가능','lt':'Yra naujinys','nl':'Update beschikbaar','no':'Oppdatering tilgjengelig','pl':'Dostępna aktualizacja','pt-br':'Atualização disponível','pt-pt':'Atualização disponível','ru':'Доступно обновление','sk':'Je k dispozícii aktualizácia','sv-se':'Uppdatering tillgänglig','th':'มีอัปเดตใหม่','tr':'Güncelleme mevcut','uk':'Доступне оновлення','vi':'Có bản cập nhật','zh-cn':'有可用更新','zh-tw':'有可用的更新'},
        upd_installed: {'en':'Installed','bg':'Инсталирана','cs':'Nainstalováno','da':'Installeret','de':'Installiert','el':'Εγκατεστημένη','es-es':'Instalada','et':'Paigaldatud','fi':'Asennettu','fr':'Installée','he':'מותקנת','hr':'Instalirano','hu':'Telepítve','it':'Installata','ja':'インストール済み','ko':'설치된 버전','lt':'Įdiegta','nl':'Geïnstalleerd','no':'Installert','pl':'Zainstalowana','pt-br':'Instalada','pt-pt':'Instalada','ru':'Установлена','sk':'Nainštalované','sv-se':'Installerad','th':'ที่ติดตั้งอยู่','tr':'Yüklü','uk':'Встановлена','vi':'Đã cài đặt','zh-cn':'已安装','zh-tw':'已安裝'},
        upd_download:  {'en':'Download','bg':'Изтегли','cs':'Stáhnout','da':'Download','de':'Herunterladen','el':'Λήψη','es-es':'Descargar','et':'Laadi alla','fi':'Lataa','fr':'Télécharger','he':'הורדה','hr':'Preuzmi','hu':'Letöltés','it':'Scarica','ja':'ダウンロード','ko':'다운로드','lt':'Atsisiųsti','nl':'Downloaden','no':'Last ned','pl':'Pobierz','pt-br':'Baixar','pt-pt':'Transferir','ru':'Скачать','sk':'Stiahnuť','sv-se':'Ladda ner','th':'ดาวน์โหลด','tr':'İndir','uk':'Завантажити','vi':'Tải xuống','zh-cn':'下载','zh-tw':'下載'},
        upd_whatsnew:  {'en':'What’s new','bg':'Какво ново','cs':'Co je nového','da':'Nyheder','de':'Neuigkeiten','el':'Τι νέο υπάρχει','es-es':'Novedades','et':'Mis on uut','fi':'Uutta','fr':'Nouveautés','he':'מה חדש','hr':'Što je novo','hu':'Újdonságok','it':'Novità','ja':'更新内容','ko':'새로운 기능','lt':'Kas naujo','nl':'Wat is er nieuw','no':'Nyheter','pl':'Co nowego','pt-br':'Novidades','pt-pt':'Novidades','ru':'Что нового','sk':'Čo je nové','sv-se':'Nyheter','th':'มีอะไรใหม่','tr':'Yenilikler','uk':'Що нового','vi':'Có gì mới','zh-cn':'更新内容','zh-tw':'更新內容'},
        upd_uptodate:  {'en':'Up to date','bg':'Актуална версия','cs':'Aktuální','da':'Opdateret','de':'Aktuell','el':'Ενημερωμένο','es-es':'Actualizado','et':'Ajakohane','fi':'Ajan tasalla','fr':'À jour','he':'מעודכן','hr':'Ažurno','hu':'Naprakész','it':'Aggiornato','ja':'最新です','ko':'최신 상태','lt':'Naujausia','nl':'Up-to-date','no':'Oppdatert','pl':'Aktualna','pt-br':'Atualizado','pt-pt':'Atualizado','ru':'Актуальная версия','sk':'Aktuálne','sv-se':'Uppdaterad','th':'เป็นเวอร์ชันล่าสุด','tr':'Güncel','uk':'Актуальна версія','vi':'Đã cập nhật','zh-cn':'已是最新','zh-tw':'已是最新'},
        upd_latest_msg:{'en':'You’re using the latest version.','bg':'Използваш най-новата версия.','cs':'Používáš nejnovější verzi.','da':'Du bruger den nyeste version.','de':'Du nutzt die neueste Version.','el':'Χρησιμοποιείς την πιο πρόσφατη έκδοση.','es-es':'Estás usando la última versión.','et':'Kasutad uusimat versiooni.','fi':'Käytät uusinta versiota.','fr':'Vous utilisez la dernière version.','he':'מותקנת הגרסה העדכנית ביותר.','hr':'Koristiš najnoviju verziju.','hu':'A legújabb verziót használod.','it':'Stai usando l’ultima versione.','ja':'最新バージョンを使用しています。','ko':'최신 버전을 사용 중입니다.','lt':'Naudoji naujausią versiją.','nl':'Je gebruikt de nieuwste versie.','no':'Du bruker den nyeste versjonen.','pl':'Używasz najnowszej wersji.','pt-br':'Você está usando a versão mais recente.','pt-pt':'Estás a usar a versão mais recente.','ru':'Ты используешь последнюю версию.','sk':'Používaš najnovšiu verziu.','sv-se':'Du använder den senaste versionen.','th':'คุณกำลังใช้เวอร์ชันล่าสุด','tr':'En son sürümü kullanıyorsun.','uk':'Ти використовуєш останню версію.','vi':'Bạn đang dùng phiên bản mới nhất.','zh-cn':'你正在使用最新版本。','zh-tw':'你正在使用最新版本。'},
        upd_check:     {'en':'Check for updates','bg':'Провери за актуализации','cs':'Zkontrolovat aktualizace','da':'Søg efter opdateringer','de':'Nach Updates suchen','el':'Έλεγχος για ενημερώσεις','es-es':'Buscar actualizaciones','et':'Otsi uuendusi','fi':'Tarkista päivitykset','fr':'Rechercher des mises à jour','he':'בדיקת עדכונים','hr':'Provjeri ažuriranja','hu':'Frissítések keresése','it':'Controlla aggiornamenti','ja':'アップデートを確認','ko':'업데이트 확인','lt':'Ieškoti naujinių','nl':'Controleren op updates','no':'Se etter oppdateringer','pl':'Sprawdź aktualizacje','pt-br':'Verificar atualizações','pt-pt':'Procurar atualizações','ru':'Проверить обновления','sk':'Skontrolovať aktualizácie','sv-se':'Sök efter uppdateringar','th':'ตรวจหาอัปเดต','tr':'Güncellemeleri denetle','uk':'Перевірити оновлення','vi':'Kiểm tra cập nhật','zh-cn':'检查更新','zh-tw':'檢查更新'},
        upd_checking:  {'en':'Checking…','bg':'Проверка…','cs':'Kontroluji…','da':'Søger…','de':'Suche…','el':'Έλεγχος…','es-es':'Buscando…','et':'Kontrollin…','fi':'Tarkistetaan…','fr':'Recherche…','he':'בבדיקה…','hr':'Provjera…','hu':'Keresés…','it':'Controllo…','ja':'確認中…','ko':'확인 중…','lt':'Tikrinama…','nl':'Controleren…','no':'Søker…','pl':'Sprawdzanie…','pt-br':'Verificando…','pt-pt':'A procurar…','ru':'Проверка…','sk':'Kontroluje sa…','sv-se':'Söker…','th':'กำลังตรวจสอบ…','tr':'Denetleniyor…','uk':'Перевірка…','vi':'Đang kiểm tra…','zh-cn':'正在检查…','zh-tw':'正在檢查…'},
        upd_failed:    {'en':'Couldn’t check','bg':'Неуспешна проверка','cs':'Nelze zkontrolovat','da':'Kunne ikke søge','de':'Prüfung fehlgeschlagen','el':'Αποτυχία ελέγχου','es-es':'No se pudo comprobar','et':'Kontrollimine ebaõnnestus','fi':'Tarkistus epäonnistui','fr':'Échec de la vérification','he':'הבדיקה נכשלה','hr':'Provjera nije uspjela','hu':'Nem sikerült ellenőrizni','it':'Controllo non riuscito','ja':'確認できませんでした','ko':'확인할 수 없음','lt':'Nepavyko patikrinti','nl':'Controle mislukt','no':'Kunne ikke sjekke','pl':'Nie udało się sprawdzić','pt-br':'Não foi possível verificar','pt-pt':'Não foi possível verificar','ru':'Не удалось проверить','sk':'Nepodarilo sa skontrolovať','sv-se':'Kunde inte kontrollera','th':'ตรวจสอบไม่สำเร็จ','tr':'Denetlenemedi','uk':'Не вдалося перевірити','vi':'Không thể kiểm tra','zh-cn':'检查失败','zh-tw':'檢查失敗'},
        lua_missing_cap: {'en':'Not fully loaded','bg':'Не е заредено напълно','cs':'Nenačteno celé','da':'Ikke helt indlæst','de':'Nicht vollständig geladen','el':'Δεν φορτώθηκε πλήρως','es-es':'No se cargó del todo','et':'Pole täielikult laaditud','fi':'Ei latautunut kokonaan','fr':'Pas entièrement chargé','he':'לא נטען במלואו','hr':'Nije potpuno učitano','hu':'Nem töltődött be teljesen','it':'Non caricato del tutto','ja':'一部が読み込まれていません','ko':'일부가 로드되지 않았습니다','lt':'Įkelta ne visiškai','nl':'Niet volledig geladen','no':'Ikke fullstendig lastet','pl':'Nie wczytano w całości','pt-br':'Não carregou por completo','pt-pt':'Não carregou por completo','ru':'Загружено не полностью','sk':'Nenačítané úplne','sv-se':'Inte helt inläst','th':'โหลดไม่ครบ','tr':'Tam yüklenmedi','uk':'Завантажено не повністю','vi':'Chưa tải đầy đủ','zh-cn':'未完全加载','zh-tw':'未完全載入'},
        lua_missing:   {'en':'Run the installer again and pick 2. Update.','bg':'Пусни инсталатора отново и избери 2. Update.','cs':'Spusť instalátor znovu a vyber 2. Update.','da':'Kør installationsprogrammet igen og vælg 2. Update.','de':'Starte das Installationsprogramm erneut und wähle 2. Update.','el':'Τρέξε ξανά το πρόγραμμα εγκατάστασης και διάλεξε 2. Update.','es-es':'Vuelve a ejecutar el instalador y elige 2. Update.','et':'Käivita paigaldaja uuesti ja vali 2. Update.','fi':'Suorita asennusohjelma uudelleen ja valitse 2. Update.','fr':'Relance l’installateur et choisis 2. Update.','he':'הפעל שוב את תוכנית ההתקנה ובחר 2. Update.','hr':'Ponovno pokreni instalacijski program i odaberi 2. Update.','hu':'Futtasd újra a telepítőt, és válaszd a 2. Update lehetőséget.','it':'Avvia di nuovo l’installer e scegli 2. Update.','ja':'インストーラーをもう一度実行し、2. Update を選んでください。','ko':'설치 프로그램을 다시 실행하고 2. Update를 선택하세요.','lt':'Paleisk diegimo programą iš naujo ir pasirink 2. Update.','nl':'Start het installatieprogramma opnieuw en kies 2. Update.','no':'Kjør installasjonsprogrammet på nytt og velg 2. Update.','pl':'Uruchom instalator ponownie i wybierz 2. Update.','pt-br':'Execute o instalador novamente e escolha 2. Update.','pt-pt':'Executa o instalador novamente e escolhe 2. Update.','ru':'Запусти установщик снова и выбери 2. Update.','sk':'Spusti inštalátor znova a vyber 2. Update.','sv-se':'Kör installationsprogrammet igen och välj 2. Update.','th':'เปิดตัวติดตั้งอีกครั้งแล้วเลือก 2. Update','tr':'Kurulum dosyasını yeniden çalıştır ve 2. Update’i seç.','uk':'Запусти інсталятор знову й вибери 2. Update.','vi':'Hãy chạy lại trình cài đặt và chọn 2. Update.','zh-cn':'请重新运行安装程序并选择 2. Update。','zh-tw':'請重新執行安裝程式並選擇 2. Update。'},
        font_default:  {'en':'Default','bg':'Стандартен','cs':'Výchozí','da':'Standard','de':'Standard','el':'Προεπιλογή','es-es':'Por defecto','et':'Vaikimisi','fi':'Oletus','fr':'Par défaut','he':'ברירת מחדל','hr':'Zadani','hu':'Alapértelmezett','it':'Predefinito','ja':'デフォルト','ko':'기본','lt':'Numatytasis','nl':'Standaard','no':'Standard','pl':'Domyślna','pt-br':'Padrão','pt-pt':'Padrão','ru':'По умолчанию','sk':'Predvolené','sv-se':'Standard','th':'ค่าเริ่มต้น','tr':'Varsayılan','uk':'Типовий','vi':'Mặc định','zh-cn':'默认','zh-tw':'預設'},
        ld_status_sample: {'en':'Starting Lua...','bg':'Стартиране на Lua...','cs':'Spouštění Lua...','da':'Starter Lua...','de':'Lua wird gestartet...','el':'Εκκίνηση Lua...','en-pt':'Firin’ up the Lua...','es-es':'Iniciando Lua...','et':'Lua käivitamine...','fi':'Käynnistetään Luaa...','fr':'Démarrage de Lua...','he':'מפעיל את Lua...','hr':'Pokretanje Lua...','hu':'Lua indítása...','it':'Avvio di Lua...','ja':'Lua を起動中...','ko':'Lua 시작 중...','lt':'Paleidžiama Lua...','nl':'Lua wordt gestart...','no':'Starter Lua...','pl':'Uruchamianie Lua...','pt-br':'Iniciando Lua...','pt-pt':'A iniciar Lua...','ru':'Запуск Lua...','sk':'Spúšťanie Lua...','sv-se':'Startar Lua...','th':'กำลังเริ่ม Lua...','tr':'Lua başlatılıyor...','uk':'Запуск Lua...','vi':'Đang khởi động Lua...','zh-cn':'正在启动 Lua...','zh-tw':'正在啟動 Lua...'},
        ld_cancel:     {'en':'Cancel','bg':'Отказ','cs':'Zrušit','da':'Annullér','de':'Abbrechen','el':'Ακύρωση','en-pt':'Abort','es-es':'Cancelar','et':'Loobu','fi':'Peruuta','fr':'Annuler','he':'ביטול','hr':'Otkaži','hu':'Mégse','it':'Annulla','ja':'キャンセル','ko':'취소','lt':'Atšaukti','nl':'Annuleren','no':'Avbryt','pl':'Anuluj','pt-br':'Cancelar','pt-pt':'Cancelar','ru':'Отмена','sk':'Zrušiť','sv-se':'Avbryt','th':'ยกเลิก','tr':'İptal Et','uk':'Скасувати','vi':'Hủy','zh-cn':'取消','zh-tw':'取消'}
    };
    function vuoT(key) {
        var m = vuoLocI18n[key] || vuoNavI18n[key];
        if (!m) return '';
        var lang = vuoNavLang();
        return m[lang] || m[lang.split('-')[0]] || m['en'] || '';
    }
    function vuoLocApply() {
        var hl = vuoNavLang();
        if (document.documentElement.lang !== hl) document.documentElement.lang = hl;
        var els = document.querySelectorAll('[data-l]');
        for (var i = 0; i < els.length; i++) {
            var t = vuoT(els[i].getAttribute('data-l'));
            if (t && els[i].textContent !== t) els[i].textContent = t;
        }
        var se = vuoEl('vuo_mp_search');
        if (se) { var pt = vuoT('search_tracks'); if (se.placeholder !== pt) se.placeholder = pt; }
        var sb = vuoEl('vuo_st_build');
        if (sb) { var bd = vuoBuildDate(VUO_BUILD); if (sb.textContent !== bd) sb.textContent = bd; }
        var sh = vuoEl('vuo_st_sndhint');
        if (sh) sh.innerHTML = vuoT('sounds_default') + '<br>' + vuoT('sounds_hint').replace('{snd}', '<b>hover</b> / <b>click</b> / <b>back</b>') + '<br><b>garrysmod/sound/vuo_sounds/</b>';
        var fh = vuoEl('vuo_st_fonthint');
        if (fh) fh.innerHTML = vuoT('drop_audio').replace('{fmt}', '<b>.ttf / .otf</b>') + '<br><b>garrysmod/materials/vuo_fonts/</b>';
    }
    var _vuoLocLang = '';
    function vuoNavRefreshLabels() {
        var ml = document.getElementById('vuo_music_label');
        if (ml) { var mt = vuoNavLabel('music');    if (ml.textContent !== mt) ml.textContent = mt; }
        var sl = document.getElementById('vuo_st_label');
        if (sl) { var st = vuoNavLabel('settings'); if (sl.textContent !== st) sl.textContent = st; }
        var mp = document.getElementById('vuo_mp_title_txt');
        if (mp) { var mpt = vuoNavLabel('music');   if (mp.textContent !== mpt) mp.textContent = mpt; }
        var lg = vuoNavLang();
        if (lg !== _vuoLocLang) {
            _vuoLocLang = lg;
            vuoLocApply();
            if (typeof vuoMusic !== 'undefined' && vuoMusic.built) {
                try { vuoMusicRenderList(); vuoMusicSyncState(); } catch(e) {}
            }
            if (typeof vuoSt !== 'undefined' && vuoSt.built) {
                try { vuoStRenderBg(); vuoStRenderScale(); vuoStRenderFonts(); } catch(e) {}
            }
        }
    }
    function nfLangLabels() {
        var items = document.querySelectorAll('.language_list li');
        var cur = vuoNavLang();
        for (var i = 0; i < items.length; i++) {
            var li = items[i];
            if (!li._nfLangDone) {
                var img = li.querySelector('img');
                if (!img) continue;
                var src = img.getAttribute('src') || img.getAttribute('ng-src') || '';
                var m = src.match(/localization\/([^\/]+?)\.png/i);
                if (!m) continue;
                var code = m[1].toLowerCase();
                var span = document.createElement('span');
                span.className = 'nf-langname';
                span.textContent = nfLangNames[code] || code.toUpperCase();
                li.appendChild(span);
                li._nfLang = code;
                li._nfLangDone = true;
            }
            li.classList.toggle('vuo-active', li._nfLang === cur);
        }
    }

    var vuoMusic = { built:false, open:false, audio:null, panel:null, tracks:[], idx:-1, loadTok:0, shuffle:false, repeat:'off', filter:'', disabled:[], artUrl:null,
                     players:[], ai:0, blobUrls:[null,null], vol:0.7, xfTok:0, xfTimer:null, xfActive:false, xfArmed:false, xfNext:-1, xfBlob:null, seekUntil:0,
                     durations:{}, durScanning:false, np:null, meta:{}, metaScanning:false, resumeAfter:false };

    function vuoMusicRightSide() {
        var o = document.querySelector('[ng-controller="ControllerMain"] .options');
        var vanilla = o && getComputedStyle(o).position === 'absolute';
        return !vanilla;
    }
    function vuoFmt(t){ if(!isFinite(t))return '0:00'; var m=Math.floor(t/60),s=Math.floor(t%60); return m+':'+(s<10?'0':'')+s; }
    function vuoEl(id){ return document.getElementById(id); }

    function vuoMusicBuild(){
        if (vuoMusic.built) return; vuoMusic.built = true;
        var right = vuoMusicRightSide();

        var a0 = document.createElement('audio'); a0.id='vuo_audio0';
        var a1 = document.createElement('audio'); a1.id='vuo_audio1';
        document.body.appendChild(a0); document.body.appendChild(a1);
        vuoMusic.players = [a0, a1]; vuoMusic.ai = 0; vuoMusic.audio = a0;

        var btn = document.createElement('div');
        btn.id='vuo_music_btn'; btn.className='nf-corner-btn';
        btn.style.cssText = ['position:fixed','top:5px','right:50px',
            'z-index:9999','display:flex','align-items:center','box-sizing:border-box',
            'height:40px','padding:0 10px 0 12px','cursor:pointer','white-space:nowrap','user-select:none'].join(';');
        btn.innerHTML = vuoIcon('music') + '<span class="vuo-nav-eq"><i></i><i></i><i></i></span>' +
                        '<span id="vuo_music_label" class="vuo-navlabel" style="margin-left:7px;"></span>';
        btn.querySelector('#vuo_music_label').textContent = vuoNavLabel('music');
        btn.addEventListener('mouseenter', function(){ if(typeof lua!=='undefined') lua.PlaySound('garrysmod/ui_hover.wav'); });
        btn.addEventListener('click', function(){ vuoMusicToggle(); vuoUiPlay(vuoMusic.open ? 'accept' : 'back'); });
        btn.style.opacity = '0.45';
        document.body.appendChild(btn); vuoMusic.btn = btn;

        var p = document.createElement('div'); p.id='vuo_music_panel';
        p.style.right = '5px';
        p.innerHTML =
          '<div class="vuo-mp-head"><span class="vuo-mp-title">'+vuoIcon('music')+'<span id="vuo_mp_title_txt">Music</span></span><span id="vuo_mp_count" class="vuo-mp-count"></span><span id="vuo_mp_close" class="vuo-mp-close">&#10005;</span></div>'+
          '<div class="vuo-mp-body">'+
            '<div class="vuo-mp-left">'+
              '<div class="vuo-mp-toprow">'+
                '<div class="vuo-mp-now"><div id="vuo_mp_art" class="vuo-mp-art" title="Expand player">'+vuoMpIco('music')+'</div>'+
                  '<div class="vuo-mp-nowtxt"><div class="vuo-mp-nowlbl" data-l="now_playing">Now Playing</div><div id="vuo_mp_nowname" class="vuo-mp-nowname">&mdash;</div><div id="vuo_mp_nowartist" class="vuo-mp-nowartist"></div><div class="vuo-mp-eq"><i></i><i></i><i></i><i></i><i></i></div></div>'+
                  '<div class="vuo-mp-nowact"><div id="vuo_mp_expand" class="vuo-mp-expand" title="Expand player">'+vuoMpIco('expand')+'</div></div></div>'+
                '<div class="vuo-mp-ctrls">'+
                  '<div id="vuo_mp_prev" class="vuo-mp-btn vuo-mp-skip vuo-skip-prev" title="Previous">'+vuoMpIco('prev')+'</div>'+
                  '<div id="vuo_mp_play" class="vuo-mp-btn vuo-mp-play" title="Play / Pause">'+vuoMpIco('play')+vuoMpIco('pause')+'</div>'+
                  '<div id="vuo_mp_next" class="vuo-mp-btn vuo-mp-skip vuo-skip-next" title="Next">'+vuoMpIco('next')+'</div>'+
                '</div>'+
              '</div>'+
              '<div class="vuo-mp-seekrow"><span id="vuo_mp_cur">0:00</span><div id="vuo_mp_seek" class="vuo-mp-seek"><div id="vuo_mp_seekfill" class="vuo-mp-seekfill"></div></div><span id="vuo_mp_dur">0:00</span></div>'+
              '<div class="vuo-mp-botrow">'+
                '<div class="vuo-mp-volrow"><span class="vuo-mp-volicon vuo-volicon" title="Mute">'+vuoMpIco('vol')+'</span><div class="vuo-mp-vol" title="Volume"><div id="vuo_mp_volfill" class="vuo-mp-volfill"></div></div></div>'+
                '<div class="vuo-mp-opts">'+
                  '<div id="vuo_mp_autoplay" class="vuo-mp-opt" title="Auto-play when the menu opens"><span data-l="autoplay">Autoplay</span><span class="vuo-mp-sw"></span></div>'+
                  '<div id="vuo_mp_shuffle" class="vuo-mp-opt" title="Shuffle order"><span data-l="shuffle">Shuffle</span><span class="vuo-mp-sw"></span></div>'+
                  '<div id="vuo_mp_repeat" class="vuo-mp-opt" title="Repeat: off / all / one"><span data-l="repeat">Repeat</span><span id="vuo_mp_repmode" class="vuo-mp-repmode">Off</span></div>'+
                  '<div id="vuo_mp_crossfade" class="vuo-mp-opt" title="Crossfade between tracks"><span data-l="crossfade">Crossfade</span><span class="vuo-mp-sw"></span></div>'+
                '</div>'+
              '</div>'+
            '</div>'+
            '<div class="vuo-mp-right">'+
              '<input id="vuo_mp_search" class="vuo-mp-search" type="text" placeholder="Search tracks&hellip;">'+
              '<div id="vuo_mp_listhead" class="vuo-mp-listhead"><span class="vuo-mp-listchev">&#9656;</span><span class="vuo-mp-listlbl" data-l="tracks">Tracks</span><span id="vuo_mp_listcount" class="vuo-mp-listcount"></span></div>'+
              '<div id="vuo_mp_list" class="vuo-mp-list"></div>'+
            '</div>'+
          '</div>'+
          '<div class="vuo-mp-foot"><span id="vuo_mp_folder" class="vuo-mp-folder" title="Click to copy the path from your Steam folder"><span data-l="add_music">Add more music to</span><br><b>garrysmod/sound/vuo_music/</b></span><span class="vuo-mp-fmt">.mp3 / .ogg / .wav / .flac</span><span id="vuo_mp_msg" class="vuo-mp-msg"></span></div>';
        document.body.appendChild(p); vuoMusic.panel = p;
        vuoEl('vuo_mp_title_txt').textContent = vuoNavLabel('music');
        vuoNpBuild();
        vuoLocApply();

        vuoWrapSounds();
        vuoPanelSounds(p,
            '.vuo-mp-btn,.vuo-mp-item,.vuo-mp-opt,.vuo-mp-listhead,.vuo-mp-art,.vuo-mp-expand,.vuo-mp-close,.vuo-mp-search,.vuo-volicon',
            '.vuo-mp-btn,.vuo-mp-item,.vuo-mp-art,.vuo-mp-expand');
        vuoEl('vuo_mp_close').addEventListener('click', function(){ vuoUiPlay('back'); vuoMusicToggle(); });
        vuoEl('vuo_mp_play').addEventListener('click', vuoMusicPlayPause);
        vuoEl('vuo_mp_prev').addEventListener('click', vuoMusicPrev);
        vuoEl('vuo_mp_next').addEventListener('click', function(){ vuoMusicNext(false); });
        vuoEl('vuo_mp_shuffle').addEventListener('click', vuoMusicToggleShuffle);
        vuoEl('vuo_mp_repeat').addEventListener('click', vuoMusicCycleRepeat);
        vuoEl('vuo_mp_autoplay').addEventListener('click', vuoMusicToggleAutoplay);
        vuoEl('vuo_mp_search').addEventListener('input', function(){ vuoMusic.filter=(this.value||'').toLowerCase(); vuoMusicRenderList(); });
        var vuoMpLh=vuoEl('vuo_mp_listhead'); if(vuoMpLh) vuoMpLh.addEventListener('click', function(){ var r=vuoMusic.panel&&vuoMusic.panel.querySelector('.vuo-mp-right'); if(r){ r.classList.toggle('vuo-list-collapsed'); vuoUiPlay(r.classList.contains('vuo-list-collapsed') ? 'back' : 'accept'); } });
        vuoEl('vuo_mp_crossfade').addEventListener('click', vuoMusicToggleCrossfade);
        vuoDragBind(vuoEl('vuo_mp_seek'), function(f){ var au=vuoMusic.audio; if(au && au.duration) au.currentTime=f*au.duration; vuoEl('vuo_mp_seekfill').style.width=(f*100)+'%'; var nf=vuoEl('vuo_np_seekfill'); if(nf) nf.style.width=(f*100)+'%'; });
        vuoDragBind(p.querySelector('.vuo-mp-vol'), vuoSetVol, vuoSaveCfg);
        p.querySelector('.vuo-mp-volicon').addEventListener('click', vuoMuteToggle);
        vuoMusic.vol = (vuoCfg.vol!=null?vuoCfg.vol:0.7); a0.volume = vuoMusic.vol; a1.volume = vuoMusic.vol; vuoVolUi();

        vuoEl('vuo_mp_folder').addEventListener('click', function(){
            var ok=false, sep=/win/i.test(navigator.platform||'')?'\\':'/';
            try { var ta=document.createElement('textarea'); ta.value=['steamapps','common','GarrysMod','garrysmod','sound','vuo_music'].join(sep); ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); ok=document.execCommand('copy'); document.body.removeChild(ta); } catch(e){}
            var m=vuoEl('vuo_mp_msg'); if(m){ m.textContent = ok?vuoT('copied'):['steamapps','common','GarrysMod','...'].join(sep); setTimeout(function(){ if(m) m.textContent=''; }, 3400); }
        });

        function vuoSeekMark(){ vuoMusic.seekUntil = Date.now() + 2500; }
        function vuoBindAudio(au){
            au.addEventListener('timeupdate', function(){
                if (this !== vuoMusic.audio) return;
                var pct=(this.duration?(this.currentTime/this.duration*100):0)+'%', cur=vuoFmt(this.currentTime), dur=vuoFmt(this.duration);
                vuoEl('vuo_mp_cur').textContent = cur;
                vuoEl('vuo_mp_dur').textContent = dur;
                vuoEl('vuo_mp_seekfill').style.width = pct;
                var nf=vuoEl('vuo_np_seekfill'); if(nf){ nf.style.width=pct; vuoEl('vuo_np_cur').textContent=cur; vuoEl('vuo_np_dur').textContent=dur; }
                var tf=vuoEl('vuo_toast_fill'); if(tf) tf.style.width=pct;
                vuoMaybeCrossfade(this);
            });
            au.addEventListener('ended', function(){
                if (this !== vuoMusic.audio || vuoMusic.xfActive) return;
                if (vuoMusic.panel) vuoMusic.panel.classList.remove('vuo-playing');
                vuoMusicNext(true);
            });
            au.addEventListener('play',  function(){ if (this !== vuoMusic.audio) return; if(vuoMusic.panel) vuoMusic.panel.classList.add('vuo-playing'); vuoNpRefresh(); vuoToastNew(); });
            au.addEventListener('pause', function(){ if (this !== vuoMusic.audio || vuoMusic.xfActive) return; if(vuoMusic.panel) vuoMusic.panel.classList.remove('vuo-playing'); vuoNpRefresh(); });
            au.addEventListener('seeking', vuoSeekMark);
            au.addEventListener('seeked',  vuoSeekMark);
        }
        vuoBindAudio(a0); vuoBindAudio(a1);

        var lastT=-1, stall=0;
        setInterval(function(){
            var a=vuoMusic.audio;
            if (!a || a.paused || a.ended || !a.src || a.seeking || vuoMusic.xfActive || Date.now() < vuoMusic.seekUntil) { stall=0; lastT=a?a.currentTime:-1; return; }
            var t=a.currentTime;
            if (t === lastT) { stall++; if (stall >= 3) { try { a.currentTime = t + 0.3; } catch(e){} stall=0; } }
            else { stall=0; }
            lastT=t;
        }, 1000);

        vuoMusicRenderList(); vuoMusicSyncState();
    }
    var vuoZoom=1, vuoRectK=1, vuoEvtK=1, VUO_SCALES=[0,0.75,0.9,1,1.1,1.25,1.5,1.75,2];
    function vuoAutoScale(){ var h=window.innerHeight||1080; return Math.max(1, Math.min(2, Math.round(h/1080*20)/20)); }
    function vuoScaleValue(){ var s=+vuoCfg.uiScale||0; return s>0 ? Math.max(0.75, Math.min(2, s)) : vuoAutoScale(); }
    function vuoMeasureZoom(){
        vuoRectK=1; vuoEvtK=1;
        if(vuoZoom===1 || !document.body) return;
        var p=document.createElement('div');
        p.style.cssText='position:fixed;left:100px;top:100px;width:20px;height:20px;opacity:0;z-index:2147483647;pointer-events:auto;';
        document.body.appendChild(p);
        var l=p.getBoundingClientRect().left; if(l>0) vuoRectK=l/100;
        if(document.elementFromPoint(110*vuoZoom, 110*vuoZoom)===p) vuoEvtK=vuoZoom;
        else if(document.elementFromPoint(110, 110)!==p) vuoEvtK=vuoZoom;
        document.body.removeChild(p);
    }
    function vuoApplyScale(){
        var z=vuoScaleValue(), root=document.documentElement;
        vuoZoom=z;
        root.style.zoom=(z===1 ? '' : String(z));
        root.classList.toggle('vuo-zoom-int', z>1 && z===Math.round(z));
        root.style.setProperty('--vuo-vh', ((window.innerHeight||1080)/z/100)+'px');
        root.style.setProperty('--vuo-vw', ((window.innerWidth||1920)/z/100)+'px');
        vuoMeasureZoom();
    }
    function vuoRect(el){
        var r=el.getBoundingClientRect(), k=vuoRectK;
        if(k===1) return r;
        return { left:r.left/k, top:r.top/k, right:r.right/k, bottom:r.bottom/k, width:r.width/k, height:r.height/k };
    }
    function vuoVW(){ return (window.innerWidth||1920)/vuoZoom; }
    function vuoVH(){ return (window.innerHeight||1080)/vuoZoom; }
    function vuoPositionPanel(panel, btn){
        if(!panel || !btn) return;
        var br=vuoRect(btn); if(br.width===0 && br.height===0) return;
        var pw=panel.offsetWidth, ph=panel.offsetHeight, W=vuoVW(), H=vuoVH(), g=6;
        var left=br.right-pw; if(left<g) left=br.left;
        left=Math.max(g, Math.min(left, W-pw-g));
        var top=br.bottom+g; if(top+ph>H-g) top=br.top-ph-g;
        top=Math.max(g, Math.min(top, H-ph-g));
        panel.style.setProperty('position', 'fixed', 'important');
        panel.style.setProperty('left', left+'px', 'important');
        panel.style.setProperty('right', 'auto', 'important');
        panel.style.setProperty('bottom', 'auto', 'important');
        panel.style.setProperty('top', top+'px', 'important');
    }
    var vuoFollow = { until: 0, on: false };
    function vuoFollowFrame(){
        var h=window.location.hash;
        if(h==='#/'||h==='#'||h===''){
            var np=document.querySelector('.news'); if(np && nfNewsBtn) vuoPositionPanel(np, nfNewsBtn);
            var lb=document.querySelector('#NavBar .button[ng-click="ToggleLanguage()"]'), ll=document.querySelector('ul.language_list');
            if(lb && ll && getComputedStyle(ll).display!=='none') vuoPositionPanel(ll, lb);
            if(vuoSt.open) vuoPositionPanel(vuoSt.panel, vuoSt.btn);
            if(vuoMusic.open) vuoPositionPanel(vuoMusic.panel, vuoMusic.btn);
        }
        if(Date.now()<vuoFollow.until) requestAnimationFrame(vuoFollowFrame); else vuoFollow.on=false;
    }
    document.addEventListener('animationstart', function(e){
        if(String(e.animationName).indexOf('vuoNavIn')!==0) return;
        vuoFollow.until=Date.now()+700;
        if(!vuoFollow.on){ vuoFollow.on=true; requestAnimationFrame(vuoFollowFrame); }
    }, true);
    function vuoPushProblemsRect(btn){
        if(!btn || typeof lua==='undefined' || !lua.Run) return;
        if(vuoIdle.ns && !btn.classList.contains('nf-active')) return;
        var r=btn.getBoundingClientRect(), s=vuoZoom/vuoRectK;
        if(r.width===0 && r.height===0) return;
        var l=Math.round(r.left*s), t=Math.round(r.top*s), ri=Math.round(r.right*s), b=Math.round(r.bottom*s);
        var key=l+','+t+','+ri+','+b;
        if(vuoPushProblemsRect._last===key) return;
        vuoPushProblemsRect._last=key;
        try{ lua.Run("VUO_ProblemsBtn={"+l+","+t+","+ri+","+b+"}"); }catch(e){}
    }
    function vuoMusicToggle(){
        if(!vuoMusic.panel) return;
        vuoMusic.open=!vuoMusic.open;
        if(vuoMusic.open) vuoCloseTopPanels('music');
        if(vuoMusic.open) vuoPositionPanel(vuoMusic.panel, vuoMusic.btn);
        vuoMusic.panel.classList.toggle('vuo-open', vuoMusic.open);
        if (vuoMusic.btn){ vuoMusic.btn.classList.toggle('nf-active', vuoMusic.open); vuoMusic.btn.style.opacity = vuoMusic.open ? '1' : '0.45'; }
        if (vuoMusic.open) { vuoScanDurations(); vuoScanMeta(); }
    }
    function vuoCloseTopPanels(keep){
        if(keep!=='music' && vuoMusic.open) vuoMusicToggle();
        if(keep!=='settings' && vuoSt.open) vuoStToggle();
        if(keep!=='news' && window.nfNewsOpen){
            window.nfNewsOpen=false; window.vuoUserHideNews=true;
            try{
                var ne=document.querySelector('[ng-controller="ControllerMain"]');
                var ns=(ne && angular.element(ne).scope()) || ((typeof scope!=='undefined' && scope) ? scope : null);
                if(ns && ns.SetHideNewsList){ ns.SetHideNewsList(true, true); if(!ns.$$phase && !ns.$root.$$phase) ns.$apply(); }
            }catch(e){}
        }
        if(keep!=='popup' && typeof $!=='undefined' && $.fn) $('ul.popup:visible').hide();
    }

    function vuoNpBuild(){
        if(vuoMusic.np) return;
        var np=document.createElement('div'); np.id='vuo_np'; np.className='vuo-np';
        np.innerHTML =
          '<div id="vuo_np_bg" class="vuo-np-bg"></div>'+
          '<div class="vuo-np-inner">'+
            '<div id="vuo_np_collapse" class="vuo-np-collapse" title="Back to player">&#10005;</div>'+
            '<div id="vuo_np_art" class="vuo-np-art">'+vuoMpIco('music')+'</div>'+
            '<div class="vuo-np-info"><div id="vuo_np_title" class="vuo-np-title">&mdash;</div><div id="vuo_np_artist" class="vuo-np-artist"></div><div id="vuo_np_meta" class="vuo-np-meta"></div></div>'+
            '<div class="vuo-np-seekrow"><span id="vuo_np_cur">0:00</span><div id="vuo_np_seek" class="vuo-np-seek"><div id="vuo_np_seekfill" class="vuo-np-seekfill"></div></div><span id="vuo_np_dur">0:00</span></div>'+
            '<div class="vuo-np-ctrls">'+
              '<div id="vuo_np_shuffle" class="vuo-np-btn vuo-np-toggle" title="Shuffle">'+vuoMpIco('shuffle')+'</div>'+
              '<div id="vuo_np_prev" class="vuo-np-btn vuo-np-skip vuo-skip-prev" title="Previous">'+vuoMpIco('prev')+'</div>'+
              '<div id="vuo_np_play" class="vuo-np-btn vuo-np-play" title="Play / Pause">'+vuoMpIco('play')+vuoMpIco('pause')+'</div>'+
              '<div id="vuo_np_next" class="vuo-np-btn vuo-np-skip vuo-skip-next" title="Next">'+vuoMpIco('next')+'</div>'+
              '<div id="vuo_np_repeat" class="vuo-np-btn vuo-np-toggle" title="Repeat">'+vuoMpIco('repeat')+'</div>'+
            '</div>'+
            '<div class="vuo-np-volrow"><span class="vuo-np-volicon vuo-volicon" title="Mute">'+vuoMpIco('vol')+'</span><div id="vuo_np_vol" class="vuo-np-vol"><div id="vuo_np_volfill" class="vuo-np-volfill"></div></div></div>'+
            '<div id="vuo_np_yt" class="vuo-np-yt" title="Search this track on YouTube">'+vuoMpIco('yt')+'<span data-l="watch_yt">Watch on YouTube</span></div>'+
          '</div>';
        document.body.appendChild(np); vuoMusic.np=np;
        vuoPanelSounds(np, '.vuo-np-btn,.vuo-np-yt,.vuo-np-collapse,.vuo-volicon', '.vuo-np-btn,.vuo-np-yt');
        vuoEl('vuo_np_collapse').addEventListener('click', vuoNpClose);
        vuoEl('vuo_np_play').addEventListener('click', vuoMusicPlayPause);
        vuoEl('vuo_np_prev').addEventListener('click', vuoMusicPrev);
        vuoEl('vuo_np_next').addEventListener('click', function(){ vuoMusicNext(false); });
        vuoEl('vuo_np_shuffle').addEventListener('click', vuoMusicToggleShuffle);
        vuoEl('vuo_np_repeat').addEventListener('click', vuoMusicCycleRepeat);
        vuoDragBind(vuoEl('vuo_np_seek'), function(f){ var au=vuoMusic.audio; if(au && au.duration) au.currentTime=f*au.duration; vuoEl('vuo_np_seekfill').style.width=(f*100)+'%'; var mf=vuoEl('vuo_mp_seekfill'); if(mf) mf.style.width=(f*100)+'%'; });
        vuoDragBind(vuoEl('vuo_np_vol'), vuoSetVol, vuoSaveCfg);
        np.querySelector('.vuo-np-volicon').addEventListener('click', vuoMuteToggle);
        vuoEl('vuo_np_yt').addEventListener('click', vuoMusicYouTube);
        np.addEventListener('click', function(e){ if(e.target===np || e.target===vuoEl('vuo_np_bg')) vuoNpClose(); });
        var ex=vuoEl('vuo_mp_expand'); if(ex) ex.addEventListener('click', vuoNpOpen);
        var ar=vuoEl('vuo_mp_art');    if(ar) ar.addEventListener('click', vuoNpOpen);
    }
    function vuoNpOpen(){ var np=vuoEl('vuo_np'); if(!np) return; if(vuoMusic.idx<0 && vuoMusic.tracks.length) vuoMusicLoad(0,true); np.classList.add('vuo-open'); vuoNpRefresh(); }
    function vuoNpClose(){ var np=vuoEl('vuo_np'); if(np) np.classList.remove('vuo-open'); }
    function vuoNpIsOpen(){ var np=vuoEl('vuo_np'); return !!(np && np.classList.contains('vuo-open')); }

    function vuoVolUi(){
        var f=vuoMusic.vol, w=Math.round(f*100)+'%', lv=f<=0 ? '0' : (f<0.5 ? '1' : '2');
        var a=vuoEl('vuo_mp_volfill'); if(a) a.style.width=w;
        var b=vuoEl('vuo_np_volfill'); if(b) b.style.width=w;
        var ic=document.querySelectorAll('.vuo-volicon');
        for(var i=0;i<ic.length;i++) ic[i].setAttribute('data-v', lv);
    }
    function vuoSetVol(f){
        vuoMusic.vol=f; vuoCfg.vol=f;
        if(vuoMusic.audio && !vuoMusic.xfActive) vuoMusic.audio.volume=f;
        vuoVolUi();
    }
    function vuoMuteToggle(){
        if(vuoMusic.vol>0){ vuoMusic.preMute=vuoMusic.vol; vuoSetVol(0); }
        else vuoSetVol(vuoMusic.preMute || 0.7);
        vuoUiPlay(vuoMusic.vol>0 ? 'accept' : 'back');
        vuoSaveCfg();
    }

    var vuoToast = { el:null, url:'', until:0, hover:false };
    function vuoToastBuild(){
        if(vuoToast.el) return vuoToast.el;
        var d=document.createElement('div'); d.id='vuo_toast';
        d.innerHTML =
          '<div id="vuo_toast_art" class="vuo-toast-art">'+vuoMpIco('music')+'</div>'+
          '<div class="vuo-toast-txt">'+
            '<div class="vuo-toast-lbl"><span class="vuo-toast-eq"><i></i><i></i><i></i></span><span data-l="now_playing">Now Playing</span></div>'+
            '<div id="vuo_toast_title" class="vuo-toast-title"></div>'+
            '<div id="vuo_toast_artist" class="vuo-toast-artist"></div>'+
          '</div>'+
          '<div id="vuo_toast_next" class="vuo-toast-next vuo-skip-next" title="Next">'+vuoMpIco('next')+'</div>'+
          '<div class="vuo-toast-bar"><div id="vuo_toast_fill" class="vuo-toast-fill"></div></div>';
        document.body.appendChild(d); vuoToast.el=d;
        vuoPanelSounds(d, '.vuo-toast-next', '.vuo-toast-next');
        d.addEventListener('mouseenter', function(){ vuoToast.hover=true; });
        d.addEventListener('mouseleave', function(){ vuoToast.hover=false; if(d.classList.contains('vuo-open')) vuoToast.until=Math.max(vuoToast.until, Date.now()+1500); });
        d.addEventListener('click', function(e){
            if(e.target.closest('.vuo-toast-next')){ vuoMusicNext(false); return; }
            vuoToast.until=0; vuoToast.hover=false;
            if(!vuoMusic.open){ vuoMusicToggle(); vuoUiPlay('accept'); }
        });
        vuoLocApply();
        return d;
    }
    function vuoToastRefresh(){
        if(!vuoToast || !vuoToast.el) return;
        var m=vuoCurMeta();
        var t=vuoEl('vuo_toast_title'); if(t && t.textContent!==m.title) t.textContent=m.title;
        var a=vuoEl('vuo_toast_artist'); if(a && a.textContent!==m.artist) a.textContent=m.artist;
        var art=vuoEl('vuo_toast_art'), u=vuoMusic.artUrl || '';
        if(art && art._u!==u){ art._u=u; art.style.backgroundImage=u ? ('url("'+u+'")') : ''; art.classList.toggle('has-art', !!u); }
        vuoToast.el.classList.toggle('vuo-playing', !!(vuoMusic.audio && vuoMusic.audio.src && !vuoMusic.audio.paused));
    }
    function vuoToastNew(){
        var t=vuoMusic.tracks[vuoMusic.idx];
        if(!t || t.url===vuoToast.url) return;
        vuoToast.url=t.url;
        if(vuoCfg.npToast===false || vuoMusic.open || vuoNpIsOpen()) return;
        vuoToastBuild();
        vuoToastRefresh();
        vuoToast.until=Date.now()+4500;
    }
    function vuoToastTick(onMain){
        var d=vuoToast.el; if(!d) return;
        var upd=!!(vuoUpd.el && vuoUpd.el.classList.contains('vuo-open'));
        var on=(vuoToast.hover || Date.now()<vuoToast.until) && onMain && !upd && !vuoUpd.ingame && !vuoSt.open && !vuoMusic.open && !vuoNpIsOpen() && vuoCfg.npToast!==false;
        if(on){ var br=vuoRect(vuoMusic.btn); if(br.width===0 && br.height===0) on=false; }
        if(on) vuoPositionPanel(d, vuoMusic.btn);
        else { vuoToast.until=0; vuoToast.hover=false; }
        d.classList.toggle('vuo-open', on);
    }

    function vuoCurMeta(){
        var t=(vuoMusic.idx>=0 && vuoMusic.tracks[vuoMusic.idx]) ? vuoMusic.tracks[vuoMusic.idx] : null;
        if(!t) return { title:'-', artist:'', year:'', album:'' };
        var md=vuoMusic.meta[t.url]||{}, fn=vuoSplitName(t.name);
        return { title: md.title||fn.title||t.name, artist: md.artist||fn.artist||'', year: md.year||'', album: md.album||'' };
    }

    function vuoNpRefresh(){
        vuoToastRefresh();
        var m=vuoCurMeta();
        var nn=vuoEl('vuo_mp_nowname');   if(nn) nn.textContent=m.title;
        var na=vuoEl('vuo_mp_nowartist'); if(na) na.textContent=m.artist;
        var np=vuoEl('vuo_np'); if(!np) return;
        var a=vuoEl('vuo_np_art');
        if(a){ if(vuoMusic.artUrl){ a.style.backgroundImage='url("'+vuoMusic.artUrl+'")'; a.classList.add('has-art'); } else { a.style.backgroundImage=''; a.classList.remove('has-art'); } }
        var bg=vuoEl('vuo_np_bg'); if(bg) bg.style.backgroundImage = vuoMusic.artUrl ? ('url("'+vuoMusic.artUrl+'")') : '';
        var t=vuoEl('vuo_np_title');  if(t) t.textContent=m.title;
        var ar=vuoEl('vuo_np_artist'); if(ar) ar.textContent=m.artist;
        var mp=[]; if(m.year) mp.push(m.year); if(m.album) mp.push(m.album);
        var me=vuoEl('vuo_np_meta'); if(me) me.textContent=mp.join('  •  ');
        var playing = !!(vuoMusic.audio && vuoMusic.audio.src && !vuoMusic.audio.paused);
        np.classList.toggle('vuo-playing', playing);
        var sh=vuoEl('vuo_np_shuffle'); if(sh) sh.classList.toggle('on', !!vuoMusic.shuffle);
        var rp=vuoEl('vuo_np_repeat'); if(rp){ rp.classList.toggle('on', vuoMusic.repeat!=='off'); rp.classList.toggle('vuo-rep-one', vuoMusic.repeat==='one'); }
        var vf=vuoEl('vuo_np_volfill'); if(vf) vf.style.width=Math.round((vuoMusic.vol||0)*100)+'%';
    }

    function vuoIsDisabled(i){ var t=vuoMusic.tracks[i]; return !!(t && vuoMusic.disabled.indexOf(t.name)>=0); }
    function vuoEnabledCount(){ var c=0; for(var i=0;i<vuoMusic.tracks.length;i++) if(!vuoIsDisabled(i)) c++; return c; }

    function vuoRandomEnabled(){ var pool=[]; for(var i=0;i<vuoMusic.tracks.length;i++){ if(!vuoIsDisabled(i)) pool.push(i); } return pool.length ? pool[Math.floor(Math.random()*pool.length)] : -1; }
    function vuoMusicToggleTrack(i){
        if(i<0||i>=vuoMusic.tracks.length) return;
        var nm=vuoMusic.tracks[i].name, p=vuoMusic.disabled.indexOf(nm), enabling=(p>=0);
        if(p>=0) vuoMusic.disabled.splice(p,1); else vuoMusic.disabled.push(nm);
        vuoCfg.disabled = vuoMusic.disabled;
        vuoMusicRenderList(); vuoSaveCfg();
        if(typeof vuoUiPlay==='function') vuoUiPlay(enabling ? 'accept' : 'back');
        else if(typeof lua!=='undefined') lua.PlaySound('garrysmod/ui_click.wav');
    }

    function vuoSplitName(nm){
        var s=(nm||'').replace(/\.(mp3|ogg|wav|flac)$/i,'');

        var m=s.match(/^(.+?)\s*[-–—]\s+(.+)$/) || s.match(/^(.+?)\s+[-–—]\s*(.+)$/);
        if(m && m[1].trim() && m[2].trim()) return { artist:m[1].trim(), title:m[2].trim() };
        return { artist:'', title:s };
    }
    function vuoSetNowText(nm){ vuoNpRefresh(); }

    function vuoScanDurations(){
        if(vuoMusic.durScanning || !vuoMusic.tracks.length) return;
        vuoMusic.durScanning=true; var i=0;
        function step(){
            while(i<vuoMusic.tracks.length && vuoMusic.durations[vuoMusic.tracks[i].url]!==undefined) i++;
            if(i>=vuoMusic.tracks.length){ vuoMusic.durScanning=false; return; }
            var t=vuoMusic.tracks[i];
            function save(d){ vuoMusic.durations[t.url]=(isFinite(d)&&d>0)?d:0; vuoUpdateDurCell(t.url); i++; setTimeout(step,40); }
            if(/\.(ogg|oga|opus)$/i.test(t.url)){ vuoOggDurationUrl(t.url, save); return; }
            var a=new Audio(), done=false;
            function fin(d){ if(done)return; done=true; try{a.src='';}catch(e){} if(isFinite(d)&&d>0) save(d); else vuoBlobDuration(t.url, save); }
            a.preload='metadata';
            a.addEventListener('loadedmetadata', function(){ fin(a.duration); });
            a.addEventListener('error', function(){ fin(0); });
            setTimeout(function(){ fin(0); }, 6000);
            try { a.src=t.url; } catch(e){ fin(0); }
        }
        step();
    }
    function vuoBlobMeasure(blob, cb){
        var fired=false; function end(d){ if(fired) return; fired=true; cb((isFinite(d)&&d>0)?d:0); }
        try {
            var u=URL.createObjectURL(blob), a=new Audio();
            function done(d){ try{a.src='';}catch(e){} try{URL.revokeObjectURL(u);}catch(e){} end(d); }
            function check(){ if(isFinite(a.duration) && a.duration>0) done(a.duration); }
            a.preload='metadata';
            a.addEventListener('loadedmetadata', check);
            a.addEventListener('durationchange', check);
            a.addEventListener('error', function(){ done(0); });
            setTimeout(function(){ done(a.duration); }, 15000);
            a.src=u;
        } catch(e){ end(0); }
    }
    function vuoBlobDuration(url, cb){
        try {
            var xhr=new XMLHttpRequest(); xhr.open('GET', url, true); xhr.responseType='blob';
            xhr.onload=function(){
                if(!(xhr.status===200||xhr.status===0) || !xhr.response || !xhr.response.size){ cb(0); return; }
                vuoBlobMeasure(xhr.response, cb);
            };
            xhr.onerror=function(){ cb(0); };
            xhr.send();
        } catch(e){ cb(0); }
    }
    function vuoOggDuration(b){
        if(!b || b.length<64 || !(b[0]===0x4F&&b[1]===0x67&&b[2]===0x67&&b[3]===0x53)) return 0;
        var p=27+b[26], rate=0, skip=0;
        if(b[p]===0x01 && vuoIndexOfAscii(b.subarray(p+1,p+7),'vorbis',0)===0) rate=(b[p+12]|(b[p+13]<<8)|(b[p+14]<<16)|(b[p+15]<<24))>>>0;
        else if(vuoIndexOfAscii(b.subarray(p,p+8),'OpusHead',0)===0){ rate=48000; skip=b[p+10]|(b[p+11]<<8); }
        if(!rate) return 0;
        for(var i=b.length-27; i>=0; i--){
            if(b[i]!==0x4F || b[i+1]!==0x67 || b[i+2]!==0x67 || b[i+3]!==0x53 || b[i+4]!==0) continue;
            var lo=(b[i+6]|(b[i+7]<<8)|(b[i+8]<<16)|(b[i+9]<<24))>>>0, hi=(b[i+10]|(b[i+11]<<8)|(b[i+12]<<16)|(b[i+13]<<24))>>>0;
            if(lo===0xFFFFFFFF && hi===0xFFFFFFFF) continue;
            var g=hi*4294967296+lo-skip;
            return g>0 ? g/rate : 0;
        }
        return 0;
    }
    function vuoOggDurationUrl(url, cb){
        try {
            var xhr=new XMLHttpRequest(); xhr.open('GET', url, true); xhr.responseType='arraybuffer';
            xhr.onload=function(){
                if(!(xhr.status===200||xhr.status===0) || !xhr.response || !xhr.response.byteLength){ cb(0); return; }
                var d=0; try{ d=vuoOggDuration(new Uint8Array(xhr.response)); }catch(e){ d=0; }
                if(d>0) cb(d); else vuoBlobMeasure(new Blob([xhr.response]), cb);
            };
            xhr.onerror=function(){ cb(0); };
            xhr.send();
        } catch(e){ cb(0); }
    }
    function vuoUpdateDurCell(url){
        var list=vuoEl('vuo_mp_list'); if(!list) return;
        for(var i=0;i<vuoMusic.tracks.length;i++){
            if(vuoMusic.tracks[i].url===url){
                var c=list.querySelector('.vuo-mp-dur[data-i="'+i+'"]');
                if(c){ var d=vuoMusic.durations[url]; c.textContent=(d>0)?vuoFmt(d):''; }
            }
        }
    }
    function vuoEsc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

    function vuoStreamTags(url, cb){
        if(typeof fetch!=='function' || !window.ReadableStream || !/^(https?|blob|data):/i.test(url)){ cb(null); return; }
        var fired=false; function fin(v){ if(fired)return; fired=true; cb(v); }
        var CAP=12*1024*1024;
        try {
            fetch(url).then(function(res){
                if(!res.body){ fin(null); return; }
                var reader=res.body.getReader(), chunks=[], got=0, lastChk=0;
                function tryParse(){
                    var buf=new Uint8Array(got), off=0; for(var k=0;k<chunks.length;k++){ buf.set(chunks[k],off); off+=chunks[k].length; }
                    var tg=null; try{ tg=vuoParseTags(buf); }catch(e){}
                    return (tg && (tg.artist||tg.title||tg.year||tg.album)) ? tg : null;
                }
                (function pump(){
                    reader.read().then(function(r){
                        if(r.value){ chunks.push(r.value); got+=r.value.length; }
                        var found=null;
                        if(r.done || got>=CAP || got-lastChk>=262144){ lastChk=got; found=tryParse(); }
                        if(found || r.done || got>=CAP){ try{reader.cancel();}catch(e){} fin(found); return; }
                        pump();
                    }).catch(function(){ fin(null); });
                })();
            }).catch(function(){ fin(null); });
        } catch(e){ fin(null); }
    }

    function vuoScanMeta(){
        if(vuoMusic.metaScanning || !vuoMusic.tracks.length) return;
        vuoMusic.metaScanning=true; var i=0;
        function step(){
            while(i<vuoMusic.tracks.length && vuoMusic.meta[vuoMusic.tracks[i].url]) i++;
            if(i>=vuoMusic.tracks.length){ vuoMusic.metaScanning=false; return; }
            var t=vuoMusic.tracks[i], ci=i;
            function commit(tg){
                if(tg && (tg.artist||tg.title||tg.year||tg.album)) vuoMusic.meta[t.url]=tg;
                vuoUpdateRowMeta(ci); if(ci===vuoMusic.idx) vuoNpRefresh();
                i=ci+1; setTimeout(step, 25);
            }
            vuoStreamTags(t.url, function(tg){

                if(tg && (tg.artist||tg.title||tg.year||tg.album)) commit(tg);
                else vuoBlobTags(t.url, commit);
            });
        }
        step();
    }

    function vuoBlobTags(url, cb){
        try {
            var xhr=new XMLHttpRequest(); xhr.open('GET',url,true); xhr.responseType='arraybuffer'; var done=false;
            xhr.onload=function(){ if(done)return; done=true;
                var tg=null; try{ if(xhr.response) tg=vuoParseTags(new Uint8Array(xhr.response)); }catch(e){}
                cb(tg);
            };
            xhr.onerror=function(){ if(done)return; done=true; cb(null); };
            try { xhr.send(); } catch(e){ done=true; cb(null); }
        } catch(e){ cb(null); }
    }
    function vuoUpdateRowMeta(i){
        var list=vuoEl('vuo_mp_list'); if(!list || i<0 || i>=vuoMusic.tracks.length) return;
        var row=list.querySelector('.vuo-mp-item[data-i="'+i+'"]'); if(!row) return;
        var meta=row.querySelector('.vuo-mp-meta'); if(!meta) return;
        var md=vuoMusic.meta[vuoMusic.tracks[i].url]||{}, sp=vuoSplitName(vuoMusic.tracks[i].name);
        var nameEl=meta.querySelector('.vuo-mp-name'); if(nameEl) nameEl.textContent=md.title||sp.title;
        var artist=md.artist||sp.artist, artEl=meta.querySelector('.vuo-mp-artist');
        if(artist){ if(!artEl){ artEl=document.createElement('span'); artEl.className='vuo-mp-artist'; meta.appendChild(artEl); } artEl.textContent=artist; }
        else if(artEl){ artEl.parentNode.removeChild(artEl); }
    }
    function vuoMusicRenderList(){
        var cnt=vuoEl('vuo_mp_count'); if(cnt) cnt.textContent = vuoMusic.tracks.length ? (vuoMusic.tracks.length+' '+(vuoMusic.tracks.length===1?vuoT('track_one'):vuoT('track_many'))) : '';
        var lc=vuoEl('vuo_mp_listcount'); if(lc) lc.textContent = vuoMusic.tracks.length || '';
        var list=vuoEl('vuo_mp_list'); if(!list) return;
        if(!vuoMusic.tracks.length){ list.innerHTML='<div class="vuo-mp-empty">'+vuoT('no_tracks')+'<br>'+vuoT('drop_audio').replace('{fmt}','<b>.mp3 / .ogg / .wav / .flac</b>')+'<br><b>garrysmod/sound/vuo_music/</b></div>'; return; }
        var f=vuoMusic.filter||'', h='', any=false;
        for(var i=0;i<vuoMusic.tracks.length;i++){
            var nm=vuoMusic.tracks[i].name, md=vuoMusic.meta[vuoMusic.tracks[i].url]||{}, sp=vuoSplitName(nm);
            var rTitle=md.title||sp.title, rArtist=md.artist||sp.artist;
            if(f && (nm+' '+rArtist+' '+rTitle).toLowerCase().indexOf(f)<0) continue;
            any=true; var off=vuoIsDisabled(i), dur=vuoMusic.durations[vuoMusic.tracks[i].url];
            h+='<div class="vuo-mp-item'+(i===vuoMusic.idx?' vuo-active':'')+(off?' vuo-off':'')+'" data-i="'+i+'">'+
                 '<span class="vuo-mp-num"><span class="vuo-mp-numtxt">'+(i+1)+'</span><span class="vuo-mp-roweq"><i></i><i></i><i></i></span></span>'+
                 '<span class="vuo-mp-meta"><span class="vuo-mp-name">'+vuoEsc(rTitle)+'</span>'+(rArtist?('<span class="vuo-mp-artist">'+vuoEsc(rArtist)+'</span>'):'')+'</span>'+
                 '<span class="vuo-mp-dur" data-i="'+i+'">'+((dur>0)?vuoFmt(dur):'')+'</span>'+
                 '<span class="vuo-mp-en'+(off?'':' on')+'" data-i="'+i+'" title="'+(off?'Disabled, won\'t auto-play':'Enabled in rotation')+'"></span>'+
               '</div>';
        }
        if(!any) h='<div class="vuo-mp-empty">'+vuoT('no_match')+'</div>';
        list.innerHTML=h;
        var it=list.querySelectorAll('.vuo-mp-item');
        for(var j=0;j<it.length;j++){ it[j].addEventListener('click', function(){ vuoMusicLoad(parseInt(this.getAttribute('data-i'),10), true); }); }
        var en=list.querySelectorAll('.vuo-mp-en');
        for(var k=0;k<en.length;k++){ en[k].addEventListener('click', function(e){ e.stopPropagation(); vuoMusicToggleTrack(parseInt(this.getAttribute('data-i'),10)); }); }
    }
    function vuoMusicLoad(i, play){
        if(i<0||i>=vuoMusic.tracks.length) return;
        vuoMusicFadeStop();
        vuoCancelCrossfade();
        vuoMusic.idx=i;
        vuoSetNowText(vuoMusic.tracks[i].name);
        vuoMusicResetArt();
        vuoMusicRenderList();
        var slot=vuoMusic.ai, a=vuoMusic.audio, url=vuoMusic.tracks[i].url, tok=(++vuoMusic.loadTok), done=false;
        try { a.volume = vuoMusic.vol; } catch(e){}
        if (vuoMusic.blobUrls[slot]){ try{ URL.revokeObjectURL(vuoMusic.blobUrls[slot]); }catch(e){} vuoMusic.blobUrls[slot]=null; }
        function go(src){ if(tok!==vuoMusic.loadTok) return; a.src=src; if(play){ var pr=a.play(); if(pr&&pr.catch)pr.catch(function(){}); } }

        try {
            var xhr=new XMLHttpRequest(); xhr.open('GET', url, true); xhr.responseType='blob';
            xhr.onload=function(){ if(done||tok!==vuoMusic.loadTok)return; done=true;
                if ((xhr.status===200||xhr.status===0) && xhr.response && xhr.response.size>0){
                    try { vuoMusic.blobUrls[slot]=URL.createObjectURL(xhr.response); go(vuoMusic.blobUrls[slot]); } catch(e){ go(url); }
                    vuoSetArtFromBlob(xhr.response, tok);
                } else { go(url); } };
            xhr.onerror=function(){ if(done||tok!==vuoMusic.loadTok)return; done=true; go(url); };
            xhr.send();
        } catch(e){ go(url); }
    }
    function vuoMusicResetArt(){
        if(vuoMusic.artUrl){ try{ URL.revokeObjectURL(vuoMusic.artUrl); }catch(e){} vuoMusic.artUrl=null; }
        var el=vuoEl('vuo_mp_art'); if(el){ el.classList.remove('has-art'); el.style.backgroundImage=''; }
        vuoNpRefresh();
    }

    function vuoSetArtFromBlob(blob, tok){
        try {
            var fr=new FileReader();
            fr.onload=function(){
                if(tok!==vuoMusic.loadTok) return;
                var arr; try{ arr=new Uint8Array(fr.result); }catch(e){ return; }
                try { var tg=vuoParseTags(arr); var t=vuoMusic.tracks[vuoMusic.idx]; if(tg && t && (tg.artist||tg.title||tg.year||tg.album)){ vuoMusic.meta[t.url]=tg; vuoUpdateRowMeta(vuoMusic.idx); } } catch(e){}
                var u=null; try{ u=vuoParseArt(arr); }catch(e){ u=null; }
                if(u){ var el=vuoEl('vuo_mp_art'); if(el){ vuoMusic.artUrl=u; el.style.backgroundImage='url("'+u+'")'; el.classList.add('has-art'); } else { try{URL.revokeObjectURL(u);}catch(e){} } }
                vuoNpRefresh();
            };
            fr.readAsArrayBuffer(blob);
        } catch(e){}
    }
    function vuoParseID3Art(b){
        if(b.length<10 || b[0]!==0x49 || b[1]!==0x44 || b[2]!==0x33) return null;
        var ver=b[3];
        var tagSize=(b[6]<<21)|(b[7]<<14)|(b[8]<<7)|b[9];
        var end=Math.min(10+tagSize, b.length), pos=10;
        while(pos+10<=end){
            var id=String.fromCharCode(b[pos],b[pos+1],b[pos+2],b[pos+3]);
            var fs = (ver===4)
                ? ((b[pos+4]<<21)|(b[pos+5]<<14)|(b[pos+6]<<7)|b[pos+7])
                : ((b[pos+4]<<24)|(b[pos+5]<<16)|(b[pos+6]<<8)|b[pos+7]);
            if(fs<=0) break;
            if(id==='APIC'){
                var p=pos+10, enc=b[p]; p++;
                var ms=p; while(p<b.length && b[p]!==0) p++;
                var mime=''; for(var m=ms;m<p;m++) mime+=String.fromCharCode(b[m]);
                p++;
                p++;
                if(enc===1||enc===2){ while(p+1<b.length && !(b[p]===0&&b[p+1]===0)) p+=2; p+=2; }
                else { while(p<b.length && b[p]!==0) p++; p++; }
                var imgEnd=pos+10+fs; if(imgEnd>b.length) imgEnd=b.length;
                if(imgEnd>p) return URL.createObjectURL(new Blob([b.subarray(p,imgEnd)], {type: mime||'image/jpeg'}));
                return null;
            }
            pos += 10+fs;
        }
        return null;
    }

    function vuoParseArt(b){
        if(b.length<12) return null;
        if(b[0]===0x49&&b[1]===0x44&&b[2]===0x33) return vuoParseID3Art(b);
        if(b[0]===0x66&&b[1]===0x4C&&b[2]===0x61&&b[3]===0x43) return vuoParseFlacArt(b);
        if(b[0]===0x4F&&b[1]===0x67&&b[2]===0x67&&b[3]===0x53) return vuoParseOggArt(b);
        return vuoParseID3Art(b);
    }
    function vuoU32BE(b,p){ return ((b[p]<<24)|(b[p+1]<<16)|(b[p+2]<<8)|b[p+3])>>>0; }

    function vuoParseFlacPicture(d){
        if(d.length<32) return null;
        var p=4;
        var mimeLen=vuoU32BE(d,p); p+=4;
        if(mimeLen>4096 || p+mimeLen+4>d.length) return null;
        var mime=''; for(var i=0;i<mimeLen;i++) mime+=String.fromCharCode(d[p+i]); p+=mimeLen;
        var descLen=vuoU32BE(d,p); p+=4;
        if(descLen>1000000 || p+descLen+20>d.length) return null;
        p+=descLen; p+=16;
        var dataLen=vuoU32BE(d,p); p+=4;
        if(dataLen<=0 || p+dataLen>d.length) dataLen=d.length-p;
        if(dataLen<=0) return null;
        return URL.createObjectURL(new Blob([d.subarray(p,p+dataLen)], {type:mime||'image/jpeg'}));
    }
    function vuoB64ToBytes(s){ try{ var bin=atob(s), u=new Uint8Array(bin.length); for(var i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i); return u; }catch(e){ return null; } }
    function vuoIsB64(c){ return (c>=65&&c<=90)||(c>=97&&c<=122)||(c>=48&&c<=57)||c===43||c===47||c===61; }
    function vuoIndexOfAscii(buf,str,from){
        var n=buf.length,m=str.length,c0=str.charCodeAt(0);
        for(var i=(from||0); i+m<=n; i++){ if(buf[i]!==c0) continue; var ok=true; for(var j=1;j<m;j++){ if(buf[i+j]!==str.charCodeAt(j)){ ok=false; break; } } if(ok) return i; }
        return -1;
    }

    function vuoFindMetaBlockPicture(buf){
        var key='METADATA_BLOCK_PICTURE', ki=vuoIndexOfAscii(buf,key,0);
        if(ki<4) return null;
        var head=key.length+1;
        var commentLen=(buf[ki-4])|(buf[ki-3]<<8)|(buf[ki-2]<<16)|(buf[ki-1]<<24);
        if(commentLen<=head || ki+commentLen>buf.length){
            commentLen=head; var q=ki+head; while(q<buf.length && vuoIsB64(buf[q])){ q++; commentLen++; }
        }
        var start=ki+head, b64len=commentLen-head;
        if(start+b64len>buf.length) b64len=buf.length-start;
        if(b64len<=0) return null;
        var s=''; for(var i=0;i<b64len;i++) s+=String.fromCharCode(buf[start+i]);
        var pic=vuoB64ToBytes(s);
        return pic ? vuoParseFlacPicture(pic) : null;
    }
    function vuoParseFlacArt(b){
        var pos=4;
        while(pos+4<=b.length){
            var hdr=b[pos], isLast=(hdr&0x80)!==0, type=hdr&0x7F;
            var len=(b[pos+1]<<16)|(b[pos+2]<<8)|b[pos+3], dStart=pos+4;
            if(dStart+len>b.length) len=b.length-dStart;
            if(type===6){ var u=vuoParseFlacPicture(b.subarray(dStart,dStart+len)); if(u) return u; }
            else if(type===4){ var u2=vuoFindMetaBlockPicture(b.subarray(dStart,dStart+len)); if(u2) return u2; }
            if(isLast) break;
            pos=dStart+len;
        }
        return null;
    }

    function vuoParseOggArt(b){
        var pos=0,n=b.length,parts=[],total=0,LIMIT=4*1024*1024;
        while(pos+27<=n && total<LIMIT){
            if(!(b[pos]===0x4F&&b[pos+1]===0x67&&b[pos+2]===0x67&&b[pos+3]===0x53)) break;
            var segCount=b[pos+26], stStart=pos+27;
            if(stStart+segCount>n) break;
            var dataLen=0; for(var i=0;i<segCount;i++) dataLen+=b[stStart+i];
            var dStart=stStart+segCount;
            if(dStart+dataLen>n) dataLen=n-dStart;
            parts.push(b.subarray(dStart,dStart+dataLen)); total+=dataLen; pos=dStart+dataLen;
        }
        var merged=new Uint8Array(total), off=0;
        for(var j=0;j<parts.length;j++){ merged.set(parts[j],off); off+=parts[j].length; }
        return vuoFindMetaBlockPicture(merged);
    }

    function vuoParseTags(b){
        var out={ artist:'', title:'', album:'', year:'' };
        if(!b || b.length<12) return out;
        if(b[0]===0x49&&b[1]===0x44&&b[2]===0x33) vuoParseID3Tags(b,out);
        else if(b[0]===0x66&&b[1]===0x4C&&b[2]===0x61&&b[3]===0x43) vuoParseVorbisTags(vuoFlacCommentBlock(b),out);
        else if(b[0]===0x4F&&b[1]===0x67&&b[2]===0x67&&b[3]===0x53) vuoParseVorbisTags(vuoDePageOggBytes(b),out);
        return out;
    }
    function vuoReadID3Text(b,p,len){
        if(len<2) return '';
        var enc=b[p], i=p+1, endp=p+len, s='';
        if(enc===1||enc===2){
            var le=true;
            if(enc===1 && i+1<endp && b[i]===0xFF && b[i+1]===0xFE){ le=true; i+=2; }
            else if(enc===1 && i+1<endp && b[i]===0xFE && b[i+1]===0xFF){ le=false; i+=2; }
            else if(enc===2){ le=false; }
            for(; i+1<endp; i+=2){ var c=le?(b[i]|(b[i+1]<<8)):((b[i]<<8)|b[i+1]); if(c===0) break; s+=String.fromCharCode(c); }
        } else {
            var arr=[]; for(var k=i;k<endp;k++){ if(b[k]===0) break; arr.push(b[k]); }
            s=String.fromCharCode.apply(null,arr);
            if(enc===3){ try{ s=decodeURIComponent(escape(s)); }catch(e){} }
        }
        return s.replace(/ +$/,'').trim();
    }
    function vuoParseID3Tags(b,out){
        var ver=b[3], tagSize=(b[6]<<21)|(b[7]<<14)|(b[8]<<7)|b[9], end=Math.min(10+tagSize,b.length), pos=10;
        while(pos+10<=end){
            var id=String.fromCharCode(b[pos],b[pos+1],b[pos+2],b[pos+3]);
            var fs=(ver===4)?((b[pos+4]<<21)|(b[pos+5]<<14)|(b[pos+6]<<7)|b[pos+7]):((b[pos+4]<<24)|(b[pos+5]<<16)|(b[pos+6]<<8)|b[pos+7]);
            if(fs<=0) break;
            if(id==='TPE1'&&!out.artist) out.artist=vuoReadID3Text(b,pos+10,fs);
            else if(id==='TIT2'&&!out.title) out.title=vuoReadID3Text(b,pos+10,fs);
            else if(id==='TALB'&&!out.album) out.album=vuoReadID3Text(b,pos+10,fs);
            else if((id==='TYER'||id==='TDRC'||id==='TDAT')&&!out.year){ var y=vuoReadID3Text(b,pos+10,fs), ym=y.match(/\d{4}/); if(ym) out.year=ym[0]; }
            pos+=10+fs;
        }
    }
    function vuoFlacCommentBlock(b){
        var pos=4;
        while(pos+4<=b.length){
            var hdr=b[pos], isLast=(hdr&0x80)!==0, type=hdr&0x7F, len=(b[pos+1]<<16)|(b[pos+2]<<8)|b[pos+3], ds=pos+4;
            if(ds+len>b.length) len=b.length-ds;
            if(type===4) return b.subarray(ds,ds+len);
            if(isLast) break;
            pos=ds+len;
        }
        return new Uint8Array(0);
    }
    function vuoDePageOggBytes(b){
        var pos=0,n=b.length,parts=[],total=0,LIMIT=4*1024*1024;
        while(pos+27<=n && total<LIMIT){
            if(!(b[pos]===0x4F&&b[pos+1]===0x67&&b[pos+2]===0x67&&b[pos+3]===0x53)) break;
            var segCount=b[pos+26], stStart=pos+27; if(stStart+segCount>n) break;
            var dataLen=0; for(var i=0;i<segCount;i++) dataLen+=b[stStart+i];
            var dStart=stStart+segCount; if(dStart+dataLen>n) dataLen=n-dStart;
            parts.push(b.subarray(dStart,dStart+dataLen)); total+=dataLen; pos=dStart+dataLen;
        }
        var merged=new Uint8Array(total), off=0;
        for(var j=0;j<parts.length;j++){ merged.set(parts[j],off); off+=parts[j].length; }
        return merged;
    }
    function vuoParseVorbisTags(buf,out){
        if(!buf || buf.length<8) return;
        var start=0, vi=vuoIndexOfAscii(buf,'vorbis',0);
        while(vi>=1 && buf[vi-1]!==0x03) vi=vuoIndexOfAscii(buf,'vorbis',vi+1);
        if(vi>=1) start=vi+6;
        else { var oi=vuoIndexOfAscii(buf,'OpusTags',0); if(oi>=0) start=oi+8; }
        var p=start, n=buf.length;
        function u32(){ if(p+4>n) return -1; var v=(buf[p]|(buf[p+1]<<8)|(buf[p+2]<<16)|(buf[p+3]<<24))>>>0; p+=4; return v; }
        var vlen=u32(); if(vlen<0) return; p+=vlen;
        var count=u32(); if(count<0) return;
        for(var i=0;i<count && p+4<=n;i++){
            var clen=u32(); if(clen<0 || p+clen>n) break;
            var s=''; for(var j=0;j<clen;j++) s+=String.fromCharCode(buf[p+j]); p+=clen;
            var eq=s.indexOf('='); if(eq<0) continue;
            var k=s.slice(0,eq).toUpperCase(), v=s.slice(eq+1);
            try{ v=decodeURIComponent(escape(v)); }catch(e){}
            if(k==='ARTIST'&&!out.artist) out.artist=v;
            else if(k==='TITLE'&&!out.title) out.title=v;
            else if(k==='ALBUM'&&!out.album) out.album=v;
            else if((k==='DATE'||k==='YEAR')&&!out.year){ var ym=v.match(/\d{4}/); out.year=ym?ym[0]:v; }
        }
    }
    function vuoMusicPlayPause(){ vuoMusic.resumeAfter=false; vuoMusicFadeStop(); if(vuoMusic.idx<0&&vuoMusic.tracks.length){ vuoMusicLoad(0,true); return; } if(vuoMusic.audio.paused)vuoMusic.audio.play(); else vuoMusic.audio.pause(); }
    function vuoMusicPrev(){
        var n=vuoMusic.tracks.length; if(!n || vuoEnabledCount()===0) return;
        var p=vuoMusic.idx, g=0; do { p=p-1; if(p<0)p=n-1; g++; } while(vuoIsDisabled(p) && g<=n);
        vuoMusicLoad(p,true);
    }

    function vuoComputeNextIndex(auto){
        var n=vuoMusic.tracks.length; if(!n || vuoEnabledCount()===0) return -1;
        if(vuoMusic.shuffle){
            var pool=[]; for(var i=0;i<n;i++){ if(i!==vuoMusic.idx && !vuoIsDisabled(i)) pool.push(i); }
            return pool.length ? pool[Math.floor(Math.random()*pool.length)] : (vuoIsDisabled(vuoMusic.idx)? -1 : vuoMusic.idx);
        }
        var nx=vuoMusic.idx, g=0;
        do { nx=nx+1; if(nx>=n){ if(auto && vuoMusic.repeat==='off') return -1; nx=0; } g++; } while(vuoIsDisabled(nx) && g<=n);
        return nx;
    }
    function vuoMusicNext(auto){
        if(!vuoMusic.tracks.length) return;
        if(auto && vuoMusic.repeat==='one'){ vuoMusicLoad(vuoMusic.idx,true); return; }
        var nx=vuoComputeNextIndex(auto);
        if(nx<0){ if(vuoMusic.audio) vuoMusic.audio.pause(); return; }
        vuoMusicLoad(nx,true);
    }

    function vuoFetchBlob(url, cb){
        try {
            var xhr=new XMLHttpRequest(); xhr.open('GET',url,true); xhr.responseType='blob'; var done=false;
            xhr.onload=function(){ if(done)return; done=true;
                if((xhr.status===200||xhr.status===0)&&xhr.response&&xhr.response.size>0){ try{ cb(URL.createObjectURL(xhr.response), xhr.response); }catch(e){ cb(url,null); } }
                else cb(url,null); };
            xhr.onerror=function(){ if(done)return; done=true; cb(url,null); };
            xhr.send();
        } catch(e){ cb(url,null); }
    }
    function vuoMaybeCrossfade(a){
        if(!vuoCfg.crossfade || vuoMusic.xfArmed || vuoMusic.xfActive) return;
        if(vuoMusic.repeat==='one') return;
        var XF=vuoCfg.crossfade;
        if(!a.duration || !isFinite(a.duration) || a.duration < XF*2) return;
        if(a.currentTime < a.duration - XF) return;
        var nx=vuoComputeNextIndex(true);
        if(nx<0) return;
        vuoMusic.xfArmed=true;
        vuoStartCrossfade(nx, XF);
    }
    function vuoStartCrossfade(nx, XF){
        var slot=1-vuoMusic.ai, idle=vuoMusic.players[slot], url=vuoMusic.tracks[nx].url, tok=(++vuoMusic.xfTok);
        if(vuoMusic.blobUrls[slot]){ try{URL.revokeObjectURL(vuoMusic.blobUrls[slot]);}catch(e){} vuoMusic.blobUrls[slot]=null; }
        vuoFetchBlob(url, function(src, blob){
            if(tok!==vuoMusic.xfTok || !vuoMusic.xfArmed) return;
            vuoMusic.blobUrls[slot]=src;
            try { idle.src=src; idle.volume=0; var pr=idle.play(); if(pr&&pr.catch)pr.catch(function(){}); } catch(e){}
            vuoMusic.xfNext=nx; vuoMusic.xfBlob=blob;
            var active=vuoMusic.audio, steps=Math.max(12, Math.round(XF*15)), step=0, startVol=vuoMusic.vol;
            vuoMusic.xfActive=true;
            vuoMusic.xfTimer=setInterval(function(){
                if(tok!==vuoMusic.xfTok){ clearInterval(vuoMusic.xfTimer); vuoMusic.xfTimer=null; return; }
                step++; var t=step/steps;
                try{ active.volume=Math.max(0, startVol*(1-t)); }catch(e){}
                try{ idle.volume=Math.min(startVol, startVol*t); }catch(e){}
                if(step>=steps){
                    clearInterval(vuoMusic.xfTimer); vuoMusic.xfTimer=null;
                    try{ active.pause(); }catch(e){}
                    var oldSlot=vuoMusic.ai;
                    if(vuoMusic.blobUrls[oldSlot]){ try{URL.revokeObjectURL(vuoMusic.blobUrls[oldSlot]);}catch(e){} vuoMusic.blobUrls[oldSlot]=null; }
                    vuoMusic.ai=slot; vuoMusic.audio=idle;
                    try{ idle.volume=vuoMusic.vol; }catch(e){}
                    vuoMusic.xfActive=false; vuoMusic.xfArmed=false;
                    vuoMusic.idx=vuoMusic.xfNext;
                    vuoSetNowText(vuoMusic.tracks[vuoMusic.idx].name);
                    vuoMusicResetArt();
                    if(vuoMusic.xfBlob) vuoSetArtFromBlob(vuoMusic.xfBlob, ++vuoMusic.loadTok);
                    vuoMusicRenderList();
                    if(vuoMusic.panel) vuoMusic.panel.classList.add('vuo-playing');
                    vuoToastNew();
                }
            }, XF*1000/steps);
        });
    }
    function vuoCancelCrossfade(){
        vuoMusic.xfTok=(vuoMusic.xfTok||0)+1;
        if(vuoMusic.xfTimer){ clearInterval(vuoMusic.xfTimer); vuoMusic.xfTimer=null; }
        if(vuoMusic.xfActive){
            var idleSlot=1-vuoMusic.ai, idle=vuoMusic.players[idleSlot];
            try{ idle.pause(); }catch(e){}
            if(vuoMusic.blobUrls[idleSlot]){ try{URL.revokeObjectURL(vuoMusic.blobUrls[idleSlot]);}catch(e){} vuoMusic.blobUrls[idleSlot]=null; }
            try{ vuoMusic.audio.volume=vuoMusic.vol; }catch(e){}
        }
        vuoMusic.xfActive=false; vuoMusic.xfArmed=false;
    }

    function vuoMusicSyncState(){
        var sh=vuoEl('vuo_mp_shuffle'); if(sh) sh.classList.toggle('on', !!vuoMusic.shuffle);
        var ap=vuoEl('vuo_mp_autoplay'); if(ap) ap.classList.toggle('on', !!vuoCfg.autoplay);
        var rp=vuoEl('vuo_mp_repeat'); if(rp) rp.classList.toggle('on', vuoMusic.repeat!=='off');
        var rm=vuoEl('vuo_mp_repmode'); if(rm) rm.textContent = vuoMusic.repeat==='one'?vuoT('rep_one'):(vuoMusic.repeat==='all'?vuoT('rep_all'):vuoT('rep_off'));
        var cf=vuoEl('vuo_mp_crossfade'); if(cf) cf.classList.toggle('on', vuoCfg.crossfade>0);
        vuoNpRefresh();
    }
    function vuoMusicToggleShuffle(){
        vuoMusic.shuffle=!vuoMusic.shuffle; vuoCfg.shuffle=vuoMusic.shuffle;
        vuoMusicSyncState(); vuoSaveCfg();
        vuoUiPlay(vuoMusic.shuffle ? 'accept' : 'back');
    }
    function vuoMusicCycleRepeat(){
        vuoMusic.repeat = vuoMusic.repeat==='off' ? 'all' : (vuoMusic.repeat==='all' ? 'one' : 'off');
        vuoCfg.repeat=vuoMusic.repeat;
        vuoMusicSyncState(); vuoSaveCfg();
        vuoUiPlay(vuoMusic.repeat==='off' ? 'back' : 'accept');
    }
    function vuoMusicToggleAutoplay(){
        vuoCfg.autoplay=!vuoCfg.autoplay;
        vuoMusicSyncState(); if(typeof vuoStSync==='function') vuoStSync(); vuoSaveCfg();
        vuoUiPlay(vuoCfg.autoplay ? 'accept' : 'back');
    }
    function vuoMusicToggleCrossfade(){
        vuoCfg.crossfade = vuoCfg.crossfade>0 ? 0 : 6;
        if(!vuoCfg.crossfade) vuoCancelCrossfade();
        vuoMusicSyncState(); vuoSaveCfg();
        vuoUiPlay(vuoCfg.crossfade>0 ? 'accept' : 'back');
    }

    function vuoMusicFadeStop(){
        if(!vuoMusic.fadeTimer) return;
        clearInterval(vuoMusic.fadeTimer); vuoMusic.fadeTimer=null;
        if(!vuoMusic.xfActive){ try{ vuoMusic.audio.volume=vuoMusic.vol; }catch(e){} }
    }
    function vuoMusicFadeIn(a){
        vuoMusicFadeStop();
        try{ a.volume=0; }catch(e){}
        var step=0, steps=40, wait=0;
        vuoMusic.fadeTimer=setInterval(function(){
            if(a!==vuoMusic.audio || vuoMusic.xfActive){ clearInterval(vuoMusic.fadeTimer); vuoMusic.fadeTimer=null; return; }
            if(a.paused){ if(++wait>200) vuoMusicFadeStop(); return; }
            step++; var t=step/steps;
            try{ a.volume=vuoMusic.vol*t*t*(3-2*t); }catch(e){}
            if(step>=steps) vuoMusicFadeStop();
        }, 50);
    }

    function vuoStopForGame(){
        if(!vuoCfg.stopOnJoin) return;
        for(var p=0;p<vuoMusic.players.length;p++){ if(!vuoMusic.players[p].paused){ vuoMusic.resumeAfter=true; break; } }
        vuoMusicFadeStop();
        vuoCancelCrossfade();
        for(var i=0;i<vuoMusic.players.length;i++){ try{ vuoMusic.players[i].pause(); }catch(e){} }
    }
    window.vuoStopForGame = vuoStopForGame;

    function vuoGameState(loading, ingame){
        vuoUpd.ingame = !!(loading || ingame);
        if(loading || ingame){
            vuoStopForGame();
            return;
        }
        if(!vuoMusic.resumeAfter) return;
        vuoMusic.resumeAfter=false;
        if(!vuoCfg.music || !vuoMusic.audio || !vuoMusic.audio.src) return;
        vuoMusicFadeIn(vuoMusic.audio);
        try{ var pr=vuoMusic.audio.play(); if(pr&&pr.catch) pr.catch(function(){}); }catch(e){}
    }
    window.vuoGameState = vuoGameState;

    function vuoMusicYouTube(){
        if(vuoMusic.idx<0 || !vuoMusic.tracks.length) return;
        var m=vuoCurMeta(), q=((m.artist?(m.artist+' '):'')+(m.title||'')).trim() || vuoMusic.tracks[vuoMusic.idx].name;
        var url='https://www.youtube.com/results?search_query='+encodeURIComponent(q);
        try { if(typeof lua!=='undefined' && lua.Run) lua.Run("gui.OpenURL(%s)", url); } catch(e){}
        if(typeof lua!=='undefined') lua.PlaySound('garrysmod/ui_click.wav');
    }

    window.vuoSetMusic = function(tracks){ vuoMusic.tracks = tracks||[]; if(!vuoMusic.built) vuoMusicBuild(); vuoMusicRenderList(); };

    var vuoCfg = { uiScale:0, dim:0.48, accentBlue:'35,135,237', accentGreen:'60,200,140', music:true, autoplay:false, bg:'', bgOn:[], bgSwap:30, bgFade:true, bgBlurOn:false, bgBlur:0, bganim:'none', liveBg:false, liveBgMap:'random', shuffle:false, repeat:'off', disabled:[], crossfade:0, stopOnJoin:false, npToast:true, customSounds:true, hoverStyle:'vuo', hoverBar:true, font:'', menuFontSize:24, menuSpacing:0.04, vol:0.7,
                    menuLayout:'centered', menuAlign:'center', loBtnX:0, loBtnY:0, loLogoX:0, loLogoY:0, loLogoScale:1, loLogoHide:false, logoIdle:true, textIdle:true, navIdle:true, navIconsOnly:false, loNavX:0, loNavY:0,
                    navPbX:0, navPbY:0, navGmX:0, navGmY:0, navGtX:0, navGtY:0, navLgX:0, navLgY:0,
                    navNwX:0, navNwY:0, navStX:0, navStY:0, navMuX:0, navMuY:0,
                    ldWidth:280, ldBar:7, ldText:13, ldPos:'right', ldY:0, ldInfoScale:1, ldInfoPos:'left', ldInfoY:100, updSeen:'', updOk:'' };
    var vuoSt  = { built:false, open:false, panel:null, btn:null, bgs:[], defbgs:[], defOpen:false, cusOpen:false, navTarget:'all' };
    var VUO_VERSION = '1.5.1';
    var VUO_BUILD = 20261105;
    var VUO_RELEASES = 'https://github.com/qudeowl/vanilla-ui-overhaul/releases/latest';
    var VUO_BUILD_URL = 'https://raw.githubusercontent.com/qudeowl/vanilla-ui-overhaul/main/build.txt';
    var vuoUpd = { latest:'', build:0, lua:null, state:'', cfg:false, ingame:false, el:null, okHide:false, okTimer:0, failTimer:0 };
    vuoApplyScale();
    window.addEventListener('resize', vuoApplyScale);

    function vuoSaveCfg(){ try { if (typeof lua!=='undefined' && lua.Run) lua.Run("if cookie then cookie.Set('vuo_settings', %s) end", JSON.stringify(vuoCfg)); } catch(e){} }

    function vuoOpenURL(u){ if (typeof lua!=='undefined' && lua.Run){ try { lua.Run("if gui and gui.OpenURL then gui.OpenURL(%s) end", u); } catch(e){} } }

    function vuoVerOlder(a, b){
        var x=String(a).split('.'), y=String(b).split('.');
        for(var i=0;i<Math.max(x.length, y.length);i++){ var p=+x[i]||0, q=+y[i]||0; if(p!==q) return p<q; }
        return false;
    }
    function vuoUpdNewer(){ return vuoVerOlder(VUO_VERSION, vuoUpd.latest) || vuoUpd.build>VUO_BUILD; }
    function vuoUpdKey(){ return vuoVerOlder(VUO_VERSION, vuoUpd.latest) ? vuoUpd.latest : VUO_VERSION+'@'+vuoUpd.build; }
    function vuoBuildDate(b){
        var d=new Date(Math.floor(b/10000), Math.floor(b/100)%100-1, b%100), l=vuoNavLang();
        try { return d.toLocaleDateString(l==='en-pt' ? 'en' : l, { day:'numeric', month:'short' }); }
        catch(e){ return String(b).replace(/^(\d{4})(\d\d)(\d\d)$/, '$1-$2-$3'); }
    }
    function vuoUpdLabel(){ return vuoVerOlder(VUO_VERSION, vuoUpd.latest) ? 'v'+vuoUpd.latest : 'v'+VUO_VERSION+' · '+vuoBuildDate(vuoUpd.build); }
    window.vuoSetBuild = function(t){
        var p=String(t||'').trim().split(/\s+/);
        if(p[0]===VUO_VERSION && /^\d{8}$/.test(p[1]||'')) vuoUpd.build=+p[1];
    };
    window.vuoSetLatest = function(v){
        v=String(v||''); if(!/^\d+(\.\d+)*$/.test(v)) return;
        vuoUpd.latest=v; vuoUpd.state=vuoUpdNewer() ? 'new' : 'ok';
        clearTimeout(vuoUpd.failTimer);
    };
    function vuoUpdCheck(){
        if(vuoUpd.state==='checking') return;
        vuoUpd.state='checking';
        clearTimeout(vuoUpd.failTimer);
        vuoUpd.failTimer=setTimeout(function(){ if(vuoUpd.state==='checking') vuoUpd.state='fail'; }, 10000);
        var fallback=function(){ if(typeof lua!=='undefined' && lua.Run){ try { lua.Run("if VUO_FetchLatest then VUO_FetchLatest() end"); } catch(e){} } };
        if(typeof fetch!=='function') return fallback();
        fetch('https://api.github.com/repos/qudeowl/vanilla-ui-overhaul/releases/latest', { cache:'no-store' })
            .then(function(r){ if(!r.ok) throw r.status; return r.json(); })
            .then(function(j){
                var m=String((j && j.tag_name) || '').match(/\d+(?:\.\d+)+/); if(!m) return fallback();
                return fetch(VUO_BUILD_URL, { cache:'no-store' })
                    .then(function(r){ return r.ok ? r.text() : ''; })
                    .catch(function(){ return ''; })
                    .then(function(t){ vuoSetBuild(t); vuoSetLatest(m[0]); });
            })
            .catch(fallback);
    }
    setTimeout(vuoUpdCheck, 2000);
    function vuoUpdBuild(){
        if(vuoUpd.el) return vuoUpd.el;
        var d=document.createElement('div'); d.id='vuo_update';
        d.innerHTML =
          '<div class="vuo-upd-head"><span class="vuo-upd-cap vuo-upd-new" data-l="upd_available">Update available</span><span class="vuo-upd-cap vuo-upd-cur" data-l="upd_uptodate">Up to date</span><span class="vuo-upd-cap vuo-upd-luax" data-l="lua_missing_cap">Not fully loaded</span><span id="vuo_upd_close" class="vuo-st-close">&#10005;</span></div>'+
          '<div class="vuo-upd-title">Vanilla UI+ <span id="vuo_upd_ver"></span></div>'+
          '<div class="vuo-upd-sub vuo-upd-new"><span data-l="upd_installed">Installed</span>: <span id="vuo_upd_inst"></span></div>'+
          '<div class="vuo-upd-sub vuo-upd-cur" data-l="upd_latest_msg">You’re using the latest version.</div>'+
          '<div class="vuo-upd-sub vuo-upd-luax" data-l="lua_missing">Run the installer again and pick 2. Update.</div>'+
          '<div class="vuo-upd-actions"><span id="vuo_upd_get" class="vuo-upd-get vuo-upd-new" data-l="upd_download">Download</span><span id="vuo_upd_fix" class="vuo-upd-get vuo-upd-luax" data-l="upd_download">Download</span><span id="vuo_upd_notes" class="vuo-st-link" data-l="upd_whatsnew">What’s new</span></div>';
        document.body.appendChild(d); vuoUpd.el=d;
        vuoPanelSounds(d, '.vuo-upd-get,.vuo-st-link,.vuo-st-close', '.vuo-upd-get,.vuo-st-link');
        vuoEl('vuo_upd_close').addEventListener('click', function(){
            vuoUiPlay('back');
            if(d.classList.contains('vuo-upd-lua')) vuoCfg.luaSeen=VUO_VERSION+'@'+VUO_BUILD;
            else if(vuoUpdNewer()) vuoCfg.updSeen=vuoUpdKey(); else vuoCfg.updOk=VUO_VERSION+'@'+VUO_BUILD;
            vuoSaveCfg();
        });
        vuoEl('vuo_upd_get').addEventListener('click', function(){ vuoOpenURL(VUO_RELEASES); });
        vuoEl('vuo_upd_fix').addEventListener('click', function(){ vuoOpenURL(VUO_RELEASES); });
        vuoEl('vuo_upd_notes').addEventListener('click', function(){ vuoOpenURL('https://steamcommunity.com/sharedfiles/filedetails/changelog/3737107792'); });
        vuoLocApply();
        return d;
    }
    function vuoUpdStatus(){
        var s=vuoEl('vuo_st_updstate'); if(!s) return;
        var st=vuoUpd.state;
        var t = st==='checking' ? vuoT('upd_checking') : st==='ok' ? vuoT('upd_uptodate') :
                st==='new' ? vuoT('upd_available')+' · '+vuoUpdLabel() : st==='fail' ? vuoT('upd_failed') : '';
        if(s.textContent!==t) s.textContent=t;
        if(s.getAttribute('data-s')!==st) s.setAttribute('data-s', st);
        var b=vuoEl('vuo_st_updcheck'); if(b) b.classList.toggle('vuo-busy', st==='checking');
    }
    function vuoUpdTick(onMain){
        vuoUpdStatus();
        var u=vuoUpd, lost=u.lua===false && vuoCfg.luaSeen!==VUO_VERSION+'@'+VUO_BUILD, newer=!lost && u.latest!=='' && vuoUpdNewer();
        var shown = lost || (newer ? (vuoUpdKey()!==vuoCfg.updSeen) : (u.latest!=='' && !u.okHide && VUO_VERSION+'@'+VUO_BUILD!==vuoCfg.updOk));
        var on = onMain && u.cfg && !u.ingame && !vuoSt.open && !vuoMusic.open && shown;
        if(!on && !u.el) return;
        var d=vuoUpdBuild();
        if(on){
            var bld=newer && !vuoVerOlder(VUO_VERSION, u.latest);
            var ver=newer ? vuoUpdLabel() : 'v'+VUO_VERSION, v=vuoEl('vuo_upd_ver');
            if(v.textContent!==ver) v.textContent=ver;
            var inst='v'+VUO_VERSION+(bld ? ' · '+vuoBuildDate(VUO_BUILD) : ''), iv=vuoEl('vuo_upd_inst');
            if(iv.textContent!==inst) iv.textContent=inst;
            d.classList.toggle('vuo-upd-lua', lost);
            d.classList.toggle('vuo-upd-ok', !lost && !newer);
            if(!lost && !newer && !u.okTimer) u.okTimer=setTimeout(function(){ u.okHide=true; }, 8000);
            vuoPositionPanel(d, vuoSt.btn);
        }
        d.classList.toggle('vuo-open', on);
    }

    var vuoDrag=null, vuoDragDone=null, vuoDragEl=null;
    function vuoDragBind(el, onFrac, onCommit){
        if(!el) return;
        function set(e){ var r=vuoRect(el); var f=Math.max(0,Math.min(1,(e.clientX/vuoEvtK-r.left)/r.width)); onFrac(f); }
        el.addEventListener('mousedown', function(e){ vuoDrag=set; vuoDragDone=onCommit||null; vuoDragEl=el; el.classList.add('vuo-sliding'); set(e); e.preventDefault(); });
    }
    function vuoSliderBind(id, onFrac){ vuoDragBind(vuoEl(id), function(f){ onFrac(f); vuoStSync(); }, vuoSaveCfg); }
    document.addEventListener('mousemove', function(e){ if(vuoDrag) vuoDrag(e); });
    document.addEventListener('mouseup',   function(){ if(vuoDrag){ vuoDrag=null; var d=vuoDragDone; vuoDragDone=null; if(vuoDragEl){ vuoDragEl.classList.remove('vuo-sliding'); vuoDragEl=null; } if(d) d(); } });

    function vuoApplyDim(){ var o=document.getElementById('gm_overlay'); if(o) o.style.setProperty('background','rgba(0,0,0,'+vuoCfg.dim+')','important'); }
    function vuoHslToRgb(h){
        var s=0.72, l=0.55; h=(((h%360)+360)%360)/360;
        function hp(p,q,t){ if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; }
        var q=l<0.5?l*(1+s):l+s-l*s, p=2*l-q;
        return Math.round(hp(p,q,h+1/3)*255)+','+Math.round(hp(p,q,h)*255)+','+Math.round(hp(p,q,h-1/3)*255);
    }
    function vuoRgbToHue(str){
        var a=(str||'').split(','), r=(+a[0]||0)/255, g=(+a[1]||0)/255, b=(+a[2]||0)/255;
        var mx=Math.max(r,g,b), mn=Math.min(r,g,b), d=mx-mn, h=0;
        if(d===0) h=0; else if(mx===r) h=((g-b)/d)%6; else if(mx===g) h=(b-r)/d+2; else h=(r-g)/d+4;
        h*=60; if(h<0)h+=360; return h;
    }

    function vuoApplyAccent(){
        var d=document.documentElement;
        d.style.setProperty('--vuo-blue-rgb',  vuoCfg.accentBlue  || '35,135,237');
        d.style.setProperty('--vuo-green-rgb', vuoCfg.accentGreen || '60,200,140');
        var ex=document.getElementById('vuo_accent_css'); if(ex&&ex.parentNode) ex.parentNode.removeChild(ex);
    }
    function vuoApplyMusic(){ var h=window.location.hash, onMain=(h==='#/'||h==='#'||h===''); if(vuoMusic.btn) vuoMusic.btn.style.display = (vuoCfg.music && onMain) ? 'flex' : 'none'; if(!vuoCfg.music && vuoMusic.audio){ try{vuoMusic.audio.pause();}catch(e){} if(vuoMusic.open) vuoMusicToggle(); } }

    var vuoBgCycle = { timer:null, idx:0, layer:0 };

    function vuoBgEnsure(){
        if(!document.getElementById('vuo_bg')){
            var mk=function(id,cls){ var e=document.getElementById(id); if(!e){ e=document.createElement('div'); e.id=id; e.className=cls; document.body.insertBefore(e, document.body.firstChild); } return e; };
            mk('vuo_bg_overlay','vuo-bg-overlay');
            mk('vuo_bg2','vuo-bg-layer');
            mk('vuo_bg','vuo-bg-layer');
        }
        return [document.getElementById('vuo_bg'), document.getElementById('vuo_bg2'), document.getElementById('vuo_bg_overlay')];
    }
    function vuoBgOn(){ return (vuoCfg.bgOn && vuoCfg.bgOn.length) ? vuoCfg.bgOn.slice() : []; }

    function vuoBgInner(layer){
        var inner = layer.firstElementChild;
        if(!inner){ inner = document.createElement('div'); inner.className = 'vuo-bg-inner'; layer.appendChild(inner); }
        return inner;
    }

    function vuoCssBg(){ return !!(vuoCfg.bgBlurOn && (vuoCfg.bgBlur||0) > 0 && vuoBgOn().length); }

    function vuoAnimLocked(){ return !!vuoCfg.bgBlurOn; }
    function vuoAnimEff(){ return vuoAnimLocked() ? 'none' : (vuoCfg.bganim||'none'); }

    function vuoApplyBg(){
        var on=vuoBgOn(), css=vuoCssBg();
        var ea=vuoAnimEff();
        var opts={ swap:Math.max(5,vuoCfg.bgSwap||30), anim:ea, zoom:(ea!=='none'), cssmode:css, fade:(vuoCfg.bgFade!==false) };
        if(typeof lua!=='undefined' && lua.Run){
            try { lua.Run("if VUO_SetBackground then VUO_SetBackground(%s) end", JSON.stringify({on:(css?[]:on), opts:opts})); } catch(e){}
        }
        vuoCssBgApply();
    }

    var vuoCssKey=null;
    function vuoCssBgApply(){
        var L=vuoBgEnsure(), bg=L[0], bg2=L[1], ov=L[2];
        var on=vuoBgOn(), css=vuoCssBg();

        var show = css && !window.nfLastInGame;
        window.nfCssBgShown = null;

        if(vuoBgCycle.timer){ clearInterval(vuoBgCycle.timer); vuoBgCycle.timer=null; }
        bg.style.display=bg2.style.display=ov.style.display = show ? 'block' : 'none';

        if(!css){
            vuoCssKey=null;
            bg.className=bg2.className='vuo-bg-layer';
            return;
        }

        var anim=vuoAnimEff();
        var px=Math.round((vuoCfg.bgBlur||0)*vuoVH()*0.024);

        var K = px >= 10 ? 2 : 1;

        for(var i=0;i<2;i++){
            var el=(i?bg2:bg);
            el.className='vuo-bg-layer vuo-bg-blurred vuo-bganim-'+anim;
            el.style.filter='';
            var inner=vuoBgInner(el);
            inner.style.width=inner.style.height=(100/K)+'%';
            inner.style.transform=(K>1)?('scale('+K+')'):'none';
            inner.style.filter='blur('+(px/K).toFixed(2)+'px)';
        }

        var key=on.join('|');
        if(key!==vuoCssKey){
            vuoCssKey=key;
            vuoBgCycle.idx=0; vuoBgCycle.layer=0;
            bg.style.transition='none'; bg2.style.transition='none';
            bg.style.backgroundImage=''; bg2.style.backgroundImage='';
            vuoBgInner(bg).style.backgroundImage='url("'+on[0]+'")';
            bg.style.opacity='1'; bg2.style.opacity='0';
        }
        if(on.length>1) vuoBgCycle.timer=setInterval(vuoBgNext, Math.max(5,vuoCfg.bgSwap||30)*1000);
    }
    function vuoBgNext(){
        var on=vuoBgOn(); if(on.length<2) return;
        var layers=[document.getElementById('vuo_bg'), document.getElementById('vuo_bg2')];
        if(!layers[0]||!layers[1]) return;
        vuoBgCycle.idx=(vuoBgCycle.idx+1)%on.length;
        var show=1-vuoBgCycle.layer, cur=layers[vuoBgCycle.layer], nxt=layers[show];
        var fade=(vuoCfg.bgFade!==false);
        nxt.style.transition = fade ? 'opacity 1.2s ease' : 'none';
        cur.style.transition = fade ? 'opacity 1.2s ease' : 'none';
        vuoBgInner(nxt).style.backgroundImage='url("'+on[vuoBgCycle.idx]+'")';
        nxt.style.opacity='1'; cur.style.opacity='0';
        vuoBgCycle.layer=show;
    }

    function vuoApplyLayout(){
        var st=vuoEl('vuo_layout_css'); if(!st){ st=document.createElement('style'); st.id='vuo_layout_css'; document.head.appendChild(st); }
        var bx=vuoOff('loBtnX'), by=vuoOff('loBtnY'), lx=vuoOff('loLogoX'), ly=vuoOff('loLogoY'), ls=vuoCfg.loLogoScale||1;
        var css =
            'div[ng-controller="ControllerMain"] .options ul{transform:translate('+bx+'px,'+by+'px);}'+
            'div[ng-controller="ControllerMain"] .options ul li:first-child img{transform:translate(calc('+(lx-bx)+'px + var(--vuo-idle-x, 0px)),calc('+(ly-by)+'px + var(--vuo-idle-y, 0px))) scale('+ls+');transform-origin:left center;}'+
            '#vuo_g10logo{transform:translate(calc('+lx+'px + var(--vuo-idle-x, 0px)),calc('+ly+'px + var(--vuo-idle-y, 0px))) scale('+ls+');}';
        if(vuoCfg.loLogoHide) css += 'div[ng-controller="ControllerMain"] .options ul li:first-child{display:none !important;}';
        var navAllX=vuoOff('loNavX'), navAllY=vuoOff('loNavY');
        var navList=[
            ['#NavBar .button[ng-click="ToggleProblems()"]','navPbX','navPbY',1],
            ['#NavBar .button[ng-click="ToggleGames()"]','navGmX','navGmY',1],
            ['#NavBar .button[ng-click="ToggleGamemodes()"]','navGtX','navGtY',1],
            ['#NavBar .button[ng-click="ToggleLanguage()"]','navLgX','navLgY',0],
            ['#nf_news_btn','navNwX','navNwY',0],
            ['#vuo_settings_btn','navStX','navStY',0],
            ['#vuo_music_btn','navMuX','navMuY',0]
        ];
        for(var ni=0;ni<navList.length;ni++){
            var ix=(navList[ni][3]?navAllX:0)+vuoOff(navList[ni][1]), iy=(navList[ni][3]?navAllY:0)+vuoOff(navList[ni][2]);
            if(ix||iy) css += navList[ni][0]+'{--vuo-nx:'+ix+'px;--vuo-ny:'+iy+'px;}';
        }
        st.textContent = css;
        var van=(vuoCfg.menuLayout==='vanilla');
        document.body.classList.toggle('vuo-layout-vanilla', van);
        document.body.classList.toggle('vuo-layout-vanillaright', vuoCfg.menuLayout==='vanillaright');
        document.body.classList.toggle('vuo-layout-gmod10', vuoCfg.menuLayout==='gmod10');
        document.body.classList.toggle('vuo-layout-cinematic', vuoCfg.menuLayout==='cinematic');
        document.body.classList.toggle('vuo-layout-modern', vuoCfg.menuLayout==='modern');
        document.body.classList.toggle('vuo-nav-icons', !!vuoCfg.navIconsOnly);
        vuoMnTick();
        var mal=vuoCfg.menuAlign||'center';
        document.body.classList.remove('vuo-malign-left','vuo-malign-center','vuo-malign-right');
        document.body.classList.add('vuo-malign-'+mal);
        if(nfNewsBtn){ nfNewsBtn._vuoVanilla=van; nfNewsBtn._vuoVanillaRight=(vuoCfg.menuLayout==='vanillaright'); if(vuoCfg.menuLayout!=='cinematic'){ nfNewsBtn.style.left=van?'auto':'5px'; nfNewsBtn.style.right=van?'5px':'auto'; } }
    }
    function vuoDefaultAlign(lo){
        lo = lo || vuoCfg.menuLayout;
        if(lo==='vanilla') return 'left';
        if(lo==='vanillaright') return 'right';
        if(lo==='gmod10' || lo==='modern') return 'left';
        return 'center';
    }
    function vuoApplyHover(){
        var van=(vuoCfg.hoverStyle==='vanilla');
        document.body.classList.toggle('vuo-hover-vanilla', van);
        document.body.classList.toggle('vuo-hover-nobar', van || !vuoCfg.hoverBar || vuoCfg.menuLayout==='modern');
    }
    function vuoApplyAll(){ vuoApplyScale(); vuoApplyDim(); vuoApplyAccent(); vuoApplyMusic(); vuoApplyBg(); vuoApplyFont(); vuoApplyLayout(); vuoApplyHover(); }

    function vuoNavKeys(){
        var t=vuoSt.navTarget||'all';
        if(t==='problems') return ['navPbX','navPbY'];
        if(t==='games')    return ['navGmX','navGmY'];
        if(t==='gamemode') return ['navGtX','navGtY'];
        if(t==='lang')     return ['navLgX','navLgY'];
        if(t==='news')     return ['navNwX','navNwY'];
        if(t==='settings') return ['navStX','navStY'];
        if(t==='music')    return ['navMuX','navMuY'];
        return ['loNavX','loNavY'];
    }
    function vuoNavRange(axis){ return Math.max(200, axis==='y' ? vuoVH() : vuoVW()); }
    function vuoNavSels(t){
        if(t==='problems') return ['#NavBar .button[ng-click="ToggleProblems()"]'];
        if(t==='games')    return ['#NavBar .button[ng-click="ToggleGames()"]'];
        if(t==='gamemode') return ['#NavBar .button[ng-click="ToggleGamemodes()"]'];
        if(t==='lang')     return ['#NavBar .button[ng-click="ToggleLanguage()"]'];
        if(t==='news')     return ['#nf_news_btn'];
        if(t==='settings') return ['#vuo_settings_btn'];
        if(t==='music')    return ['#vuo_music_btn'];
        return ['#NavBar .button[ng-click="ToggleProblems()"]','#NavBar .button[ng-click="ToggleGames()"]','#NavBar .button[ng-click="ToggleGamemodes()"]'];
    }
    var VUO_BTN_SEL='div[ng-controller="ControllerMain"] .options ul';
    var VUO_LOGO_SEL='div[ng-controller="ControllerMain"] .options ul li:first-child img';
    var VUO_LOGO_SVG='img/vuo_logo.svg', VUO_LOGO_G10='img/vuo_logo_gmod10.svg', vuoLogoFont=null;
    function vuoLogoFontOk(){
        if(vuoLogoFont!==null) return vuoLogoFont;
        try {
            var x=document.createElement('canvas').getContext('2d'), t='garry’s mod';
            x.font='bold 72px monospace'; var m=x.measureText(t).width;
            x.font='bold 72px Arial, "Liberation Sans", monospace'; vuoLogoFont=(x.measureText(t).width!==m);
        } catch(e){ vuoLogoFont=false; }
        return vuoLogoFont;
    }
    function vuoLogoVanilla(img){
        try {
            if(img.naturalWidth!==288 || img.naturalHeight!==128) return false;
            var c=document.createElement('canvas'); c.width=288; c.height=128;
            var x=c.getContext('2d'); x.drawImage(img, 0, 0);
            var d=x.getImageData(0, 0, 288, 128).data;
            var near=function(i, j, r, g, b, a){ var k=(j*288+i)*4; return Math.abs(d[k]-r)<4 && Math.abs(d[k+1]-g)<4 && Math.abs(d[k+2]-b)<4 && Math.abs(d[k+3]-a)<4; };
            return near(60,50,17,148,240,255) && near(0,64,155,155,155,102) && near(200,64,255,255,255,255) && near(5,5,0,0,0,0);
        } catch(e){ return false; }
    }
    function vuoLogoTick(){
        var img=document.querySelector(VUO_LOGO_SEL); if(!img) return;
        var src=img.getAttribute('src')||'';
        if(src!==VUO_LOGO_SVG && img._vuoPng!==src){
            if(!img.complete || !img.naturalWidth) return;
            img._vuoPng=src; img._vuoVanilla=vuoLogoVanilla(img);
        }
        var want=img._vuoVanilla && vuoZoom*(vuoCfg.loLogoScale||1)>1 && vuoLogoFontOk();
        if(want && src!==VUO_LOGO_SVG) img.setAttribute('src', VUO_LOGO_SVG);
        else if(!want && src===VUO_LOGO_SVG) img.setAttribute('src', img._vuoPng);
    }
    var VUO_NAV_GAP = 10;
    var vuoCinEls = [];
    function vuoCinPin(el, x){
        if(!el._vuoCin){ el._vuoCin=true; vuoCinEls.push(el); }
        var s=el.style; s.position='fixed'; s.top='5px'; s.margin='0'; s.zIndex='1001'; s.left=x+'px'; s.right='auto';
    }
    function vuoCinTick(onMain){
        var on=(vuoCfg.menuLayout==='cinematic' && onMain), nav=document.getElementById('NavBar');
        if(nav && nav.classList.contains('vuo-cin-nav')!==on) nav.classList.toggle('vuo-cin-nav', on);
        if(!on){
            for(var c=0;c<vuoCinEls.length;c++){ var cs=vuoCinEls[c].style; cs.position=''; cs.top=''; cs.margin=''; cs.zIndex=''; cs.left=''; cs.right=''; vuoCinEls[c]._vuoCin=false; }
            vuoCinEls=[];
            return null;
        }
        var lis=document.querySelectorAll('div[ng-controller="ControllerMain"] .options ul > li'), seen=false;
        for(var i=1;i<lis.length;i++){
            var sp=!lis[i].querySelector('a'), vis=!sp && !lis[i].classList.contains('ng-hide');
            lis[i].classList.toggle('vuo-cin-sp', sp);
            lis[i].classList.toggle('vuo-cin-sep', vis && seen);
            if(vis) seen=true;
        }
        var opts=document.querySelector('div[ng-controller="ControllerMain"] .options'), ul=opts ? opts.querySelector('ul') : null;
        if(ul && ul.offsetWidth){
            var k=Math.round(Math.max(0.5, Math.min(1, (vuoVW()-120)/ul.offsetWidth))*1000)/1000;
            if(opts._vuoFit!==k){ opts._vuoFit=k; opts.style.setProperty('--vuo-cin-fit', String(k)); }
        }
        var q=function(c){ return document.querySelector('#NavBar .button[ng-click'+c+']'); };
        var lang=q('="ToggleLanguage()"'), right=Array.prototype.slice.call(document.querySelectorAll('#NavBar .group.center .button'));
        if(lang) lang.style.display='inline-block';
        right.push(q('^="TogglePopup"'), q('="ToggleProblems()"'), q('="ToggleGamemodes()"'), q('="ToggleGames()"'));
        var left=[nfNewsBtn, lang, vuoSt.btn, vuoMusic.btn];
        var out={ lang: null, st: null, mu: null }, x=5, el, w, j;
        for(j=0;j<left.length;j++){
            el=left[j]; w=el ? el.offsetWidth : 0; if(!w) continue;
            if(el===lang) out.lang=x; else if(el===vuoSt.btn) out.st=x; else if(el===vuoMusic.btn) out.mu=x;
            else { el.style.left=x+'px'; el.style.right='auto'; }
            x+=w+VUO_NAV_GAP;
        }
        x=vuoVW()-5;
        for(j=right.length-1;j>=0;j--){ el=right[j]; w=el ? el.offsetWidth : 0; if(!w) continue; x-=w; vuoCinPin(el, x); x-=VUO_NAV_GAP; }
        return out;
    }
    function vuoMnTick(){
        if(vuoCfg.menuLayout!=='modern') return;
        var lis=document.querySelectorAll('div[ng-controller="ControllerMain"] .options ul > li'), role=[], i, k, a, c, h;
        for(i=1;i<lis.length;i++){
            a=lis[i].querySelector('a'); role[i]=null; if(!a) continue;
            c=a.getAttribute('ng-click')||''; h=a.getAttribute('ng-href')||'';
            role[i]=(c.indexOf('BackToGame')>=0 || h==='#/newgame/' || h==='#/servers/') ? 'cta' : (c.indexOf('MenuOption')>=0 ? 'sys' : 'link');
        }
        var pri=false, prev=null, vis, br, nx;
        for(i=1;i<lis.length;i++){
            vis=!lis[i].classList.contains('ng-hide'); br=false; nx=null;
            if(!role[i] && vis && prev){
                for(k=i+1;k<lis.length && !nx;k++) if(role[k] && !lis[k].classList.contains('ng-hide')) nx=role[k];
                br=!!nx && nx!==prev;
            }
            lis[i].classList.toggle('vuo-mn-cta', role[i]==='cta');
            lis[i].classList.toggle('vuo-mn-link', role[i]==='link');
            lis[i].classList.toggle('vuo-mn-sys', role[i]==='sys');
            lis[i].classList.toggle('vuo-mn-pri', role[i]==='cta' && vis && !pri);
            lis[i].classList.toggle('vuo-mn-br', br);
            lis[i].classList.toggle('vuo-mn-rule', br && nx==='sys');
            if(role[i]==='cta' && vis) pri=true;
            if(br) prev=null; else if(role[i] && vis) prev=role[i];
        }
    }
    function vuoLogoSel(){ return vuoCfg.menuLayout==='gmod10' ? '#vuo_g10logo' : VUO_LOGO_SEL; }
    function vuoG10Tick(onMain){
        var el=vuoEl('vuo_g10logo');
        var img=(vuoCfg.menuLayout==='gmod10') ? document.querySelector(VUO_LOGO_SEL) : null;
        if(!img || !img._vuoPng){ if(el) el.style.display='none'; return; }
        if(!el){ el=document.createElement('img'); el.id='vuo_g10logo'; el.alt=''; document.body.appendChild(el); }
        var stacked=!!(img._vuoVanilla && vuoLogoFontOk()), src=stacked ? VUO_LOGO_G10 : img._vuoPng;
        if(el.getAttribute('src')!==src) el.setAttribute('src', src);
        el.classList.toggle('vuo-g10-stacked', stacked);
        var show=onMain && !vuoCfg.loLogoHide;
        if((el.style.display!=='none')!==show) el.style.display=show ? '' : 'none';
    }
    var vuoIdle = { last: Date.now(), on: false, logo: false, text: false, nav: false, ls: false, ts: false, ns: false, amp: 0, t: 0, prev: 0, raf: 0, nextIco: 0, lastIco: null, navList: null, navT: 0 };
    var vuoIdleEv = ['mousemove','mousedown','wheel','keydown'];
    for(var vie=0;vie<vuoIdleEv.length;vie++) document.addEventListener(vuoIdleEv[vie], function(){ vuoIdle.last=Date.now(); }, true);
    var VUO_IDLE_ICONS = ['#nf_news_btn','#NavBar .button[ng-click="ToggleLanguage()"]','#vuo_settings_btn','#vuo_music_btn','#NavBar .button[ng-click="ToggleGames()"]','#NavBar .button[ng-click="ToggleGamemodes()"]'];
    function vuoIdleLogo(x, y){
        var els=[document.querySelector(VUO_LOGO_SEL), vuoEl('vuo_g10logo')];
        for(var i=0;i<els.length;i++){
            var s=els[i] && els[i].style; if(!s) continue;
            if(x===null){ if(s.willChange){ s.removeProperty('--vuo-idle-x'); s.removeProperty('--vuo-idle-y'); s.willChange=''; } }
            else { s.setProperty('--vuo-idle-x', x.toFixed(2)+'px'); s.setProperty('--vuo-idle-y', y.toFixed(2)+'px'); s.willChange='transform'; }
        }
    }
    function vuoIdleText(t, k){
        var lis=document.querySelectorAll('div[ng-controller="ControllerMain"] .options ul > li'), w=Math.PI*2, n=0;
        for(var i=1;i<lis.length;i++){
            var s=lis[i].style;
            if(k===null || !lis[i].querySelector('a') || lis[i].classList.contains('ng-hide')){ if(s.transform){ s.transform=''; s.willChange=''; } continue; }
            s.transform='translateY('+(-Math.sin(w*t/4.8-n*0.55)*3*k).toFixed(2)+'px)'; s.willChange='transform'; n++;
        }
    }
    function vuoIdleIcon(){
        var pool=[], el, i;
        for(i=0;i<VUO_IDLE_ICONS.length;i++){
            el=document.querySelector(VUO_IDLE_ICONS[i]);
            if(el && el.offsetWidth && el!==vuoIdle.lastIco && !el.classList.contains('vuo-playing')) pool.push(el);
        }
        if(!pool.length) return;
        el=pool[Math.floor(Math.random()*pool.length)];
        vuoIdle.lastIco=el;
        el.classList.add('vuo-ico-play');
        setTimeout(function(){ el.classList.remove('vuo-ico-play'); }, 1000);
    }
    var VUO_IDLE_NAV = '#nf_news_btn, #vuo_settings_btn, #vuo_music_btn, #NavBar .button';
    function vuoIdleNavOff(el){
        var s=el.style; if(s.willChange){ s.removeProperty('--vuo-idle-n'); s.willChange=''; }
    }
    function vuoIdleNavClear(){
        var els=document.querySelectorAll(VUO_IDLE_NAV);
        for(var i=0;i<els.length;i++) vuoIdleNavOff(els[i]);
        vuoIdle.navList=null;
    }
    function vuoIdleNav(t, k){
        var i, el, w=Math.PI*2;
        if(!vuoIdle.navList || t-vuoIdle.navT>1){
            vuoIdleNavClear();
            var els=document.querySelectorAll(VUO_IDLE_NAV), list=[];
            for(i=0;i<els.length;i++){ if(els[i].offsetWidth){ els[i]._vuoX=els[i].getBoundingClientRect().left; list.push(els[i]); } }
            list.sort(function(a, b){ return a._vuoX-b._vuoX; });
            vuoIdle.navList=list; vuoIdle.navT=t;
        }
        var card=vuoUpd.el && vuoUpd.el.classList.contains('vuo-open');
        for(i=0;i<vuoIdle.navList.length;i++){
            el=vuoIdle.navList[i];
            if(el.classList.contains('nf-active') || (card && el===vuoSt.btn)){ vuoIdleNavOff(el); continue; }
            el.style.setProperty('--vuo-idle-n', (-Math.sin(w*t/4.8-i*0.55)*2*k).toFixed(2)+'px'); el.style.willChange='transform';
        }
    }
    function vuoIdleRest(){
        if(vuoIdle.raf) cancelAnimationFrame(vuoIdle.raf);
        vuoIdle.raf=0; vuoIdle.amp=0; vuoIdle.prev=0;
        vuoIdleLogo(null); vuoIdleText(0, null); vuoIdleNavClear(); vuoIdle.ls=false; vuoIdle.ts=false; vuoIdle.ns=false;
    }
    function vuoIdleFrame(now){
        var dt=vuoIdle.prev ? Math.min(0.1, (now-vuoIdle.prev)/1000) : 0;
        vuoIdle.prev=now; vuoIdle.t+=dt;
        vuoIdle.amp+=((vuoIdle.on ? 1 : 0)-vuoIdle.amp)*Math.min(1, dt*(vuoIdle.on ? 0.6 : 4));
        if(!vuoIdle.on && vuoIdle.amp<0.01){ vuoIdleRest(); return; }
        var w=Math.PI*2, k=vuoIdle.amp, t=vuoIdle.t;
        if(vuoIdle.logo){ vuoIdleLogo(Math.sin(w*t/9)*3*k, -Math.sin(w*t/5.5)*7*k); vuoIdle.ls=true; }
        else if(vuoIdle.ls){ vuoIdleLogo(null); vuoIdle.ls=false; }
        if(vuoIdle.text){ vuoIdleText(t, k); vuoIdle.ts=true; }
        else if(vuoIdle.ts){ vuoIdleText(0, null); vuoIdle.ts=false; }
        if(vuoIdle.nav){ vuoIdleNav(t, k); vuoIdle.ns=true; }
        else if(vuoIdle.ns){ vuoIdleNavClear(); vuoIdle.ns=false; }
        if(vuoIdle.nav && vuoIdle.on && k>0.6 && t>=vuoIdle.nextIco){ vuoIdleIcon(); vuoIdle.nextIco=t+2.4+Math.random()*1.6; }
        vuoIdle.raf=requestAnimationFrame(vuoIdleFrame);
    }
    function vuoIdleTick(onMain){
        vuoIdle.logo=!!(vuoCfg.logoIdle && !vuoCfg.loLogoHide);
        vuoIdle.text=!!vuoCfg.textIdle;
        vuoIdle.nav=!!vuoCfg.navIdle;
        vuoIdle.on=!!(onMain && (vuoIdle.logo || vuoIdle.text || vuoIdle.nav) && !window.nfLastInGame && !document.hidden && Date.now()-vuoIdle.last>20000);
        if(vuoIdle.on && !vuoIdle.raf){ vuoIdle.prev=0; vuoIdle.nextIco=vuoIdle.t; vuoIdle.raf=requestAnimationFrame(vuoIdleFrame); }
    }
    var vuoFit = {};
    function vuoOff(k){ return (vuoCfg[k]||0) + (vuoFit[k]||0); }
    function vuoAnimDone(el){
        var t=[el, el.closest ? el.closest('li') : null];
        for(var k=0;k<t.length;k++){
            if(!t[k] || !t[k].getAnimations) continue;
            var a=t[k].getAnimations();
            for(var i=0;i<a.length;i++){
                var n=String(a[i].animationName||'');
                if(n.indexOf('vuoNavIn')===0 || n.indexOf('vuoMenu')===0){ try{ a[i].finish(); }catch(e){} }
            }
        }
    }
    function vuoReplayIn(){
        var els=document.querySelectorAll('div[ng-controller="ControllerMain"] .options ul li, #NavBar .button, #nf_news_btn, #vuo_music_btn, #vuo_g10logo'), i;
        for(i=0;i<els.length;i++) els[i].style.animation='none';
        void document.body.offsetWidth;
        for(i=0;i<els.length;i++) els[i].style.animation='';
    }
    function vuoClampKeys(kx, ky, sels, keep){
        if(vuoIdle.raf || vuoIdle.amp) vuoIdleRest();
        if(keep && (vuoFit[kx] || vuoFit[ky])){ vuoFit[kx]=0; vuoFit[ky]=0; vuoApplyLayout(); }
        var W=vuoVW(), H=vuoVH(), dx=0, dy=0, found=false;
        for(var i=0;i<sels.length;i++){
            var el=document.querySelector(sels[i]); if(!el) continue;
            vuoAnimDone(el);
            var r=vuoRect(el); if(r.width===0 && r.height===0) continue;
            found=true;
            var cdx = r.left<0 ? -r.left : (r.right>W ? W-r.right : 0);
            var cdy = r.top<0 ? -r.top : (r.bottom>H ? H-r.bottom : 0);
            if(Math.abs(cdx)>Math.abs(dx)) dx=cdx;
            if(Math.abs(cdy)>Math.abs(dy)) dy=cdy;
        }
        if(found && (dx||dy)){
            var t = keep ? vuoCfg : vuoFit;
            t[kx]=Math.round((t[kx]||0)+dx);
            t[ky]=Math.round((t[ky]||0)+dy);
            vuoApplyLayout();
        }
    }
    function vuoClampAll(){
        vuoFit = {}; vuoApplyLayout();
        vuoClampKeys('loBtnX','loBtnY',[VUO_BTN_SEL]);
        if(!vuoCfg.loLogoHide) vuoClampKeys('loLogoX','loLogoY',[vuoLogoSel()]);
        var items=[['loNavX','loNavY','all'],['navPbX','navPbY','problems'],['navGmX','navGmY','games'],['navGtX','navGtY','gamemode'],['navLgX','navLgY','lang'],['navNwX','navNwY','news'],['navStX','navStY','settings'],['navMuX','navMuY','music']];
        for(var i=0;i<items.length;i++) vuoClampKeys(items[i][0],items[i][1],vuoNavSels(items[i][2]));
    }
    var vuoResizeT=null;
    window.addEventListener('resize', function(){ if(!vuoSt.built) return; if(vuoResizeT) clearTimeout(vuoResizeT); vuoResizeT=setTimeout(function(){ vuoClampAll(); vuoStSync(); vuoSaveCfg(); }, 250); });

    window.vuoApplySettings = function(s){ vuoUpd.cfg=true; if(s){ for(var k in vuoCfg){ if(s[k]!==undefined) vuoCfg[k]=s[k]; } if(s.menuAlign===undefined) vuoCfg.menuAlign=vuoDefaultAlign(); }
        if(!Array.isArray(vuoCfg.bgOn)) vuoCfg.bgOn=[];
        if(vuoCfg.bgOn.length===0 && vuoCfg.bg){ vuoCfg.bgOn=[vuoCfg.bg]; vuoCfg.bg=''; }
        if(!vuoSt.built) vuoStBuild();
        vuoMusic.shuffle=!!vuoCfg.shuffle; vuoMusic.repeat=vuoCfg.repeat||'off'; vuoMusic.disabled=vuoCfg.disabled||[];
        if(vuoCfg.vol!=null){ vuoMusic.vol=vuoCfg.vol; if(vuoMusic.players){ try{ vuoMusic.players[0].volume=vuoCfg.vol; vuoMusic.players[1].volume=vuoCfg.vol; }catch(e){} } vuoVolUi(); }
        vuoApplyAll();
        if(typeof vuoMusicSyncState==='function') vuoMusicSyncState();
        vuoMusicRenderList(); vuoStSync();
        if(!vuoSt._clampInit){ vuoSt._clampInit=true; setTimeout(function(){ vuoClampAll(); vuoStSync(); vuoSaveCfg(); }, 1300); }
        if(vuoCfg.autoplay && vuoCfg.music && vuoMusic.audio && vuoMusic.tracks.length && vuoMusic.idx<0){ var fe=vuoRandomEnabled(); if(fe>=0) vuoMusicLoad(fe,true); } };
    function vuoRequestCfg(){
        if(vuoUpd.cfg || typeof lua==='undefined' || !lua.Run) return;
        try { lua.Run("local r=cookie and cookie.GetString('vuo_settings') if not r or r=='' then local ok,l=pcall(file.Read,'vuo_settings.txt','DATA') r=ok and l or nil end if IsValid(pnlMainMenu) then pnlMainMenu:Call('if(window.vuoApplySettings){vuoApplySettings('..((r and r~='') and ('JSON.parse(\"'..string.JavascriptSafe(r)..'\")') or 'null')..');}') end"); } catch(e){}
    }
    setTimeout(vuoRequestCfg, 3000);
    setTimeout(vuoRequestCfg, 7000);
    window.vuoLuaOk = function(){ vuoUpd.lua=true; };
    function vuoLuaCheck(){
        if(vuoUpd.lua || typeof lua==='undefined' || !lua.Run) return;
        try { lua.Run("if VUO_LiveBGRefresh and IsValid(pnlMainMenu) then pnlMainMenu:Call('if(window.vuoLuaOk){vuoLuaOk();}') end"); } catch(e){}
    }
    setTimeout(vuoLuaCheck, 3000);
    setTimeout(vuoLuaCheck, 8000);
    setTimeout(function(){ if(!vuoUpd.lua && typeof lua!=='undefined' && lua.Run) vuoUpd.lua=false; }, 12000);
    var VUO_LIVE_NAMES = { gm_construct:'Garry\'s Mod: Construct', gm_flatgrass:'Garry\'s Mod: Flatgrass', background01:'Half-Life 2: Station', background02:'Half-Life 2: Canals', background03:'Half-Life 2: Ravenholm', background04:'Half-Life 2: Coast', background05:'Half-Life 2: Nova Prospekt', background06:'Half-Life 2: City 17', background07:'Half-Life 2: Citadel' };
    var VUO_HL2_SCENES = ['background01', 'background02', 'background03', 'background04', 'background05', 'background06', 'background07'];
    function vuoStRenderLive(){
        var sel=vuoEl('vuo_st_livemap'); if(!sel) return;
        var list=vuoSt.liveMaps||[], h='<option value="random" data-l="livebg_random">'+vuoT('livebg_random')+'</option>', locked=false, i, m;
        for(i=0;i<list.length;i++){ m=String(list[i]).replace(/[^A-Za-z0-9_\-]/g,''); if(VUO_HL2_SCENES.indexOf(m)<0) h+='<option value="'+m+'">'+(VUO_LIVE_NAMES[m]||m)+'</option>'; }
        for(i=0;i<VUO_HL2_SCENES.length;i++){ m=VUO_HL2_SCENES[i]; var ok=list.indexOf(m)>=0; if(!ok) locked=true; h+='<option value="'+m+'"'+(ok?'':' disabled')+'>'+VUO_LIVE_NAMES[m]+'</option>'; }
        sel.innerHTML=h;
        var want=vuoCfg.liveBgMap||'random';
        sel.value=(want==='random' || list.indexOf(want)>=0) ? want : 'random';
        var note=vuoEl('vuo_st_livenote');
        if(note){
            var key=(vuoSt.liveHl2==='off') ? 'livebg_hl2_off' : 'livebg_hl2_none';
            note.setAttribute('data-l', key); note.textContent=vuoT(key);
            note.style.display=(locked && vuoSt.liveHl2) ? '' : 'none';
        }
        vuoDdSync();
    }
    function vuoLiveRefresh(){ try { if(typeof lua!=='undefined' && lua.Run) lua.Run('if VUO_LiveBGRefresh then VUO_LiveBGRefresh() end'); } catch(e){} }
    window.vuoSetLiveMaps = function(list, hl2){ vuoSt.liveMaps = list||[]; vuoSt.liveHl2 = hl2||''; vuoStRenderLive(); };
    window.vuoLiveBg = function(on){ window.vuoLiveOn = !!on; window.vuoLiveAt = Date.now(); document.body.classList.toggle('vuo-live-on', !!on); };
    window.vuoSetBackgrounds = function(list){ vuoSt.bgs = list||[]; vuoStRenderBg(); };
    window.vuoSetDefaultBackgrounds = function(list){ vuoSt.defbgs = list||[]; vuoStRenderBg(); };

    var VUO_UI = { focus:'vuo_sounds/menu_focus.wav', accept:'vuo_sounds/menu_accept.wav', back:'vuo_sounds/menu_back.wav' };
    var vuoSounds = { hover:null, click:null, back:null };

    function vuoUiPlay(kind){
        if(typeof lua==='undefined' || !lua.PlaySound) return;
        var orig = lua._vuoOrigPlay || lua.PlaySound.bind(lua);
        if(!vuoCfg.customSounds) return orig(kind==='focus' ? 'garrysmod/ui_hover.wav' : (kind==='back' ? 'garrysmod/ui_return.wav' : 'garrysmod/ui_click.wav'));
        if(kind==='focus'  && vuoSounds.hover) return orig(vuoSounds.hover);
        if(kind==='accept' && vuoSounds.click) return orig(vuoSounds.click);
        if(kind==='back'   && vuoSounds.back)  return orig(vuoSounds.back);
        return orig(VUO_UI[kind] || VUO_UI.accept);
    }

    var vuoSndBack = false;
    if(!window._vuoSndCtxBound){
        window._vuoSndCtxBound = true;
        document.addEventListener('mousedown', function(e){
            try {
                var t = e.target;
                if (t && t.closest && t.closest('.ui_sound_return, #BackToMenu')) { vuoSndBack = true; return; }

                var btn = t && t.closest && t.closest('#NavBar .button, #NavBar .smallicon');
                if (btn) {
                    var ngc = btn.getAttribute('ng-click') || '';
                    var pop = /ToggleGames\b/.test(ngc)     ? 'ul.games_list'
                            : /ToggleGamemodes\b/.test(ngc) ? 'ul.gamemode_list'
                            : /ToggleLanguage\b/.test(ngc)  ? 'ul.language_list'
                            : /TogglePopup\b/.test(ngc)     ? 'ul.kinect_settings' : null;
                    if (pop) { var pp = document.querySelector(pop); vuoSndBack = !!(pp && getComputedStyle(pp).display !== 'none'); return; }
                }
                vuoSndBack = false;
            } catch(_){ vuoSndBack = false; }
        }, true);
    }
    function vuoWrapSounds(){
        if(typeof lua==='undefined' || !lua.PlaySound || lua._vuoWrapped) return;
        var orig = lua.PlaySound.bind(lua); lua._vuoOrigPlay = orig;

        lua.PlaySound = function(path){
            if(vuoCfg.customSounds && typeof path==='string'){
                if(/ui_hover\.wav$/i.test(path)) return vuoUiPlay('focus');
                if(/ui_click\.wav$/i.test(path)){ var b=vuoSndBack; vuoSndBack=false; return vuoUiPlay(b ? 'back' : 'accept'); }
            }
            return orig(path);
        };
        lua._vuoWrapped = true;
    }

    function vuoPanelSounds(root, hoverSel, clickSel){
        if(!root || root._vuoSnd) return; root._vuoSnd=true;
        var last=null;
        root.addEventListener('mouseover', function(e){
            var t=e.target.closest(hoverSel);
            if(t){ if(t!==last){ last=t; vuoUiPlay('focus'); } } else { last=null; }
        });
        root.addEventListener('mouseleave', function(){ last=null; });
        root.addEventListener('click', function(e){ if(e.target.closest(clickSel)) vuoUiPlay('accept'); });
    }
    window.vuoSetSounds = function(s){ vuoSounds.hover=(s&&s.hover)||null; vuoSounds.click=(s&&s.click)||null; vuoSounds.back=(s&&s.back)||null; vuoWrapSounds(); };

    (function vuoEnsureWrap(){
        if(typeof lua!=='undefined' && lua.PlaySound){ vuoWrapSounds(); return; }
        setTimeout(vuoEnsureWrap, 200);
    })();

    (function(){
        if(window._vuoNativeSnd) return; window._vuoNativeSnd = true;
        var backSel = 'pagination .back, a.bglink, .serverinfo .closebtn';
        var acceptSel = 'pagination .next, ' +
            'UL.category LI.mapicon, gamesettings .btn-primary, gamesettings .dropdown .label, gamesettings .dropdown .contents > div, ' +
            '.server_gamemodes .gamemode, .installgamemode, .serverlist .server, .serverlist .header > *, .favbutton, .serverinfo .btn-primary, .add_fav_server button, img.flag, ' +
            'ul.language_list li, ul.gamemode_list li, ul.games_list li.game-item';
        var hoverSel = backSel + ', ' + acceptSel;
        var last=null;
        document.addEventListener('mouseover', function(e){
            var t = e.target.closest && e.target.closest(hoverSel);
            if(t){ if(t!==last){ last=t; vuoUiPlay('focus'); } } else { last=null; }
        });
        document.addEventListener('click', function(e){
            if(!e.target.closest) return;
            if(e.target.closest(backSel)) return vuoUiPlay('back');
            if(e.target.closest(acceptSel)) return vuoUiPlay('accept');
        });
    })();

    var vuoFonts = [];
    function vuoInjectFonts(){
        var st=vuoEl('vuo_fonts_css'); if(!st){ st=document.createElement('style'); st.id='vuo_fonts_css'; document.head.appendChild(st); }
        var css='';
        for(var i=0;i<vuoFonts.length;i++){ vuoFonts[i].family='VUOFont'+i; css+='@font-face{font-family:"'+vuoFonts[i].family+'";src:url("'+vuoFonts[i].url+'");font-display:swap;}'; }
        st.textContent=css;
    }
    function vuoApplyFont(){
        var base="'Roboto','Segoe UI','Noto Sans','Helvetica Neue',Arial,'Microsoft YaHei','PingFang SC',sans-serif", fam='';
        for(var i=0;i<vuoFonts.length;i++){ if(vuoFonts[i].name===vuoCfg.font){ fam='"'+(vuoFonts[i].family||'VUOFont'+i)+'",'; break; } }
        var d=document.documentElement;
        d.style.setProperty('--vuo-font', (vuoCfg.font&&fam)?(fam+base):base);
        d.style.setProperty('--vuo-menu-fontsize', (vuoCfg.menuFontSize||24)+'px');
        d.style.setProperty('--vuo-menu-spacing', (vuoCfg.menuSpacing==null?0.04:vuoCfg.menuSpacing)+'em');
    }
    window.vuoSetFonts = function(list){ vuoFonts=list||[]; vuoInjectFonts(); vuoApplyFont(); if(typeof vuoStRenderFonts==='function') vuoStRenderFonts(); };
    function vuoStRenderFonts(){
        var sel=vuoEl('vuo_st_font'); if(!sel) return;
        var h='<option value="">'+vuoT('font_default')+' (Roboto)</option>';
        for(var i=0;i<vuoFonts.length;i++){ var nm=vuoFonts[i].name; h+='<option value="'+nm.replace(/"/g,'')+'"'+(vuoCfg.font===nm?' selected':'')+'>'+nm+'</option>'; }
        sel.innerHTML=h; sel.value=vuoCfg.font||'';
    }

    var vuoDd = { open: null };
    function vuoDdLabel(sel){ var o=sel.options[sel.selectedIndex]; return o ? o.textContent : ''; }
    function vuoDdSync(){
        var w=document.querySelectorAll('.vuo-dd');
        for(var i=0;i<w.length;i++){ var t=vuoDdLabel(w[i]._vuoSel); if(w[i]._vuoLbl.textContent!==t) w[i]._vuoLbl.textContent=t; }
    }
    function vuoDdClose(){
        var o=vuoDd.open; if(!o) return; vuoDd.open=null;
        o.wrap.classList.remove('vuo-open');
        if(o.list.parentNode) o.list.parentNode.removeChild(o.list);
    }
    function vuoDdPlace(){
        var o=vuoDd.open; if(!o) return;
        var br=vuoRect(o.wrap), W=vuoVW(), H=vuoVH(), g=6;
        o.list.style.minWidth=br.width+'px';
        var lw=o.list.offsetWidth, lh=o.list.offsetHeight;
        var left=Math.max(g, Math.min(br.left, W-lw-g));
        var top=br.bottom+4; if(top+lh>H-g) top=Math.max(g, br.top-lh-4);
        o.list.style.left=left+'px'; o.list.style.top=top+'px';
    }
    function vuoDdOpen(wrap){
        vuoDdClose();
        var sel=wrap._vuoSel, list=document.createElement('div'); list.className='vuo-dd-list';
        for(var i=0;i<sel.options.length;i++){
            var d=document.createElement('div'); d.className='vuo-dd-opt'+(i===sel.selectedIndex?' vuo-sel':'')+(sel.options[i].disabled?' vuo-dd-off':'');
            d.textContent=sel.options[i].textContent; d._vuoVal=sel.options[i].value; list.appendChild(d);
        }
        list.addEventListener('click', function(e){
            var t=e.target.closest('.vuo-dd-opt'); if(!t || t.classList.contains('vuo-dd-off')) return;
            var changed=(sel.value!==t._vuoVal);
            sel.value=t._vuoVal; vuoDdClose(); vuoDdSync(); vuoUiPlay('accept');
            if(changed) sel.dispatchEvent(new Event('change'));
        });
        vuoPanelSounds(list, '.vuo-dd-opt:not(.vuo-dd-off)', '.vuo-dd-none');
        document.body.appendChild(list);
        vuoDd.open={ wrap: wrap, list: list }; wrap.classList.add('vuo-open');
        vuoDdPlace();
        var cur=list.querySelector('.vuo-sel'); if(cur) list.scrollTop=Math.max(0, cur.offsetTop-list.clientHeight/2+cur.offsetHeight/2);
    }
    function vuoDropdown(sel){
        if(sel._vuoDd) return; sel._vuoDd=true;
        var wrap=document.createElement('div'); wrap.className='vuo-dd';
        sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
        var b=document.createElement('div'); b.className='vuo-dd-btn';
        b.innerHTML='<span class="vuo-dd-label"></span><svg class="vuo-dd-chev" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.2 3.8L5 6.6l2.8-2.8"/></svg>';
        wrap.appendChild(b); wrap._vuoSel=sel; wrap._vuoLbl=b.firstChild;
        b.addEventListener('click', function(){
            if(vuoDd.open && vuoDd.open.wrap===wrap){ vuoDdClose(); vuoUiPlay('back'); }
            else { vuoDdOpen(wrap); vuoUiPlay('accept'); }
        });
        vuoDdSync();
    }
    function vuoDdTick(){
        if(vuoSt.open) vuoDdSync();
        var o=vuoDd.open; if(!o) return;
        if(!vuoSt.open || !o.wrap.offsetParent) vuoDdClose(); else vuoDdPlace();
    }
    document.addEventListener('mousedown', function(e){
        if(vuoDd.open && !e.target.closest('.vuo-dd-list') && !e.target.closest('.vuo-dd')) vuoDdClose();
    }, true);

    function vuoStBuild(){
        if (vuoSt.built) return; vuoSt.built=true;
        var right = vuoMusicRightSide();
        var g=document.createElement('div'); g.id='vuo_settings_btn'; g.className='nf-corner-btn';
        g.style.cssText=['position:fixed','top:5px','right:5px','z-index:9999','display:flex','align-items:center','box-sizing:border-box','height:40px','padding:0 10px 0 12px','cursor:pointer','white-space:nowrap','user-select:none','opacity:0.45'].join(';');
        g.innerHTML=vuoIcon('settings') +
                    '<span id="vuo_st_label" class="vuo-navlabel" style="margin-left:7px;"></span>';
        g.querySelector('#vuo_st_label').textContent = vuoNavLabel('settings');
        g.addEventListener('mouseenter', function(){ if(typeof lua!=='undefined') lua.PlaySound('garrysmod/ui_hover.wav'); });
        g.addEventListener('click', function(){ vuoStToggle(); vuoUiPlay(vuoSt.open ? 'accept' : 'back'); });
        document.body.appendChild(g); vuoSt.btn=g;

        var p=document.createElement('div'); p.id='vuo_settings_panel'; p.style.right='5px';
        p.innerHTML =
          '<div class="vuo-st-head"><span class="vuo-st-title">'+vuoIcon('settings')+'Vanilla UI+</span><span id="vuo_st_close" class="vuo-st-close">&#10005;</span></div>'+
          '<div class="vuo-st-tabs"><div class="vuo-st-tab vuo-on" data-t="appear"><span data-l="tab_appear">Appearance</span></div><div class="vuo-st-tab" data-t="music"><span data-l="music">Music</span></div><div class="vuo-st-tab" data-t="bg"><span data-l="tab_bg">Background</span></div><div class="vuo-st-tab" data-t="layout"><span data-l="tab_layout">Layout</span></div><div class="vuo-st-tab" data-t="about"><span data-l="tab_about">About</span></div></div>'+
          '<div class="vuo-st-body">'+
            '<div class="vuo-st-page vuo-on" data-p="appear">'+
              '<div class="vuo-st-cap vuo-st-caprow"><span data-l="cap_colors">Colors</span><span id="vuo_st_colreset" class="vuo-st-link vuo-st-capreset" data-l="reset">Reset</span></div>'+
              '<div class="vuo-st-row"><span data-l="accent1">Primary accent</span><div id="vuo_st_hue_b" class="vuo-st-hue"><div id="vuo_st_hue_b_k" class="vuo-st-hueknob"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="accent2">Secondary accent</span><div id="vuo_st_hue_g" class="vuo-st-hue"><div id="vuo_st_hue_g_k" class="vuo-st-hueknob"></div></div></div>'+
              '<div class="vuo-st-cap vuo-st-caprow"><span data-l="cap_text">Text</span><span id="vuo_st_txtreset" class="vuo-st-link vuo-st-capreset" data-l="reset">Reset</span></div>'+
              '<div class="vuo-st-row"><span data-l="font">Font</span><select id="vuo_st_font" class="vuo-st-select"></select></div>'+
              '<div class="vuo-st-hint" id="vuo_st_fonthint">Drop <b>.ttf / .otf</b> files into<br><b>garrysmod/materials/vuo_fonts/</b></div>'+
              '<div class="vuo-st-row"><span data-l="font_size">Font size</span><div id="vuo_st_fsize" class="vuo-st-slider"><div id="vuo_st_fsizefill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="letter_spacing">Letter spacing</span><div id="vuo_st_fspace" class="vuo-st-slider"><div id="vuo_st_fspacefill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="hover_effect">Hover effect</span><div id="vuo_st_hover" class="vuo-st-seg"><div class="vuo-st-segbtn" data-hv="vuo">Vanilla UI+</div><div class="vuo-st-segbtn" data-hv="vanilla" data-l="lo_vanilla">Vanilla</div></div></div>'+
              '<div class="vuo-st-row" id="vuo_st_hoverbarrow"><span data-l="accent_bar">Accent bar</span><div id="vuo_st_hoverbar" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-cap vuo-st-caprow"><span data-l="cap_display">Display</span><span id="vuo_st_dspreset" class="vuo-st-link vuo-st-capreset" data-l="reset">Reset</span></div>'+
              '<div class="vuo-st-row"><span data-l="ui_scale">UI scale</span><select id="vuo_st_uiscale" class="vuo-st-select"></select></div>'+
              '<div class="vuo-st-row"><span data-l="bg_dim">Background dim</span><div id="vuo_st_dim" class="vuo-st-slider"><div id="vuo_st_dimfill" class="vuo-st-sfill"></div></div></div>'+
            '</div>'+
            '<div class="vuo-st-page" data-p="music">'+
              '<div class="vuo-st-cap" data-l="music">Music</div>'+
              '<div class="vuo-st-row"><span data-l="enable_music">Enable music player</span><div id="vuo_st_music" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-row"><span data-l="stop_on_join">Stop music when joining</span><div id="vuo_st_stopjoin" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-row"><span data-l="np_toast">Now playing popup</span><div id="vuo_st_nptoast" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-cap" data-l="cap_sounds">Sounds</div>'+
              '<div class="vuo-st-row"><span data-l="custom_sounds">Custom UI sounds</span><div id="vuo_st_sounds" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-hint" id="vuo_st_sndhint">Portal 2&#39;s menu sounds are used by default.<br>Drop your own <b>hover</b> / <b>click</b> / <b>back</b> sounds into<br><b>garrysmod/sound/vuo_sounds/</b></div>'+
            '</div>'+
            '<div class="vuo-st-page" data-p="bg">'+
              '<div class="vuo-st-cap" data-l="cap_effects">Effects</div>'+
              '<div class="vuo-st-row" id="vuo_st_bganimrow"><span data-l="animation">Animation</span><div id="vuo_st_bganim" class="vuo-st-seg"><div class="vuo-st-segbtn" data-an="none" data-l="an_none">None</div><div class="vuo-st-segbtn" data-an="zoom" data-l="an_zoom">Zoom</div><div class="vuo-st-segbtn" data-an="pan" data-l="an_pan">Pan</div><div class="vuo-st-segbtn" data-an="float" data-l="an_float">Float</div></div></div>'+
              '<div class="vuo-st-hint" id="vuo_st_animlock" data-l="anim_locked" style="display:none">Background animation is paused while blur is on, since running both is heavy.</div>'+
              '<div class="vuo-st-row" id="vuo_st_bgbluronrow"><span data-l="blur">Gaussian blur</span><div id="vuo_st_bgbluron" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-row" id="vuo_st_bgblurrow"><span data-l="strength">Strength</span><div id="vuo_st_bgblur" class="vuo-st-slider"><div id="vuo_st_bgblurfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-cap" data-l="cap_slideshow">Slideshow</div>'+
              '<div class="vuo-st-row" id="vuo_st_bgswaprow"><span data-l="swap_interval">Swap interval</span><div id="vuo_st_bgswap" class="vuo-st-slider"><div id="vuo_st_bgswapfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row" id="vuo_st_bgfaderow"><span data-l="crossfade">Crossfade</span><div id="vuo_st_bgfade" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-cap" data-l="cap_livebg">Live background</div>'+
              '<div class="vuo-st-hint" data-l="livebg_hint">Experimental. Loads a map behind the menu with its sounds. Addons load with it, so it can take a moment.</div>'+
              '<div class="vuo-st-row"><span data-l="livebg_on">Enable live background</span><div id="vuo_st_livebg" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-row" id="vuo_st_livemaprow"><span data-l="livebg_map">Map</span><select id="vuo_st_livemap" class="vuo-st-select"><option value="random" data-l="livebg_random">Random</option></select></div>'+
              '<div class="vuo-st-hint vuo-st-livenote" id="vuo_st_livenote" style="display:none"></div>'+
              '<div class="vuo-st-cap" data-l="cap_images">Images</div>'+
              '<div class="vuo-st-hint" data-l="bg_hint">Enable any number of backgrounds. More than one will cycle on the swap interval. None enabled = the game\'s own backgrounds.</div>'+
              '<div id="vuo_st_bglist" class="vuo-st-bglist"></div>'+
            '</div>'+
            '<div class="vuo-st-page" data-p="layout">'+
              '<div class="vuo-st-cap" data-l="menu_layout">Menu layout</div>'+
              '<div class="vuo-st-row"><span data-l="preset">Preset</span><select id="vuo_st_preset" class="vuo-st-select"><option value="centered" data-l="lo_centered">Centered</option><option value="vanilla" data-l="lo_vanilla">Vanilla</option><option value="vanillaright" data-l="lo_vanillaright">Vanilla Right</option><option value="gmod10">GMod 10</option><option value="cinematic" data-l="lo_cinematic">Horizontal</option><option value="modern" data-l="lo_modern">Modern</option></select></div>'+
              '<div class="vuo-st-cap vuo-st-caprow"><span data-l="main_menu_text">Main menu text</span><span id="vuo_st_btnreset" class="vuo-st-link vuo-st-capreset" data-l="reset">Reset</span></div>'+
              '<div class="vuo-st-row"><span data-l="idle_anim">Idle animation</span><div id="vuo_st_textidle" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-row"><span data-l="horizontal">Horizontal</span><div id="vuo_st_btnx" class="vuo-st-slider"><div id="vuo_st_btnxfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="vertical">Vertical</span><div id="vuo_st_btny" class="vuo-st-slider"><div id="vuo_st_btnyfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="alignment">Alignment</span><div id="vuo_st_malign" class="vuo-st-seg"><div class="vuo-st-segbtn" data-al="left" data-l="al_left">Left</div><div class="vuo-st-segbtn" data-al="center" data-l="al_center">Center</div><div class="vuo-st-segbtn" data-al="right" data-l="al_right">Right</div></div></div>'+
              '<div class="vuo-st-cap vuo-st-caprow"><span data-l="logo">Logo</span><span id="vuo_st_logoreset" class="vuo-st-link vuo-st-capreset" data-l="reset">Reset</span></div>'+
              '<div class="vuo-st-row"><span data-l="show_logo">Show logo</span><div id="vuo_st_logohide" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-row" id="vuo_st_logoidlerow"><span data-l="idle_anim">Idle animation</span><div id="vuo_st_logoidle" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-row"><span data-l="horizontal">Horizontal</span><div id="vuo_st_logox" class="vuo-st-slider"><div id="vuo_st_logoxfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="vertical">Vertical</span><div id="vuo_st_logoy" class="vuo-st-slider"><div id="vuo_st_logoyfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="size">Size</span><div id="vuo_st_logos" class="vuo-st-slider"><div id="vuo_st_logosfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-cap vuo-st-caprow"><span data-l="navbar">Navbar</span><span id="vuo_st_navreset" class="vuo-st-link vuo-st-capreset" data-l="reset">Reset</span></div>'+
              '<div class="vuo-st-row"><span data-l="idle_anim">Idle animation</span><div id="vuo_st_navidle" class="vuo-st-toggle"></div></div>'+
              '<div class="vuo-st-row"><span data-l="target">Target</span><select id="vuo_st_navtarget" class="vuo-st-select"><option value="all" data-l="t_all">All</option><option value="problems" data-l="t_problems">Problems</option><option value="games" data-l="t_games">Games</option><option value="gamemode" data-l="t_gamemode">Gamemode</option><option value="lang" data-l="t_lang">Language</option><option value="news" data-l="t_news">News</option><option value="settings" data-l="settings">Settings</option><option value="music" data-l="music">Music</option></select></div>'+
              '<div class="vuo-st-row"><span data-l="horizontal">Horizontal</span><div id="vuo_st_navx" class="vuo-st-slider"><div id="vuo_st_navxfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="vertical">Vertical</span><div id="vuo_st_navy" class="vuo-st-slider"><div id="vuo_st_navyfill" class="vuo-st-sfill"></div></div></div>'+
              '<div class="vuo-st-row"><span data-l="icons_only">Icons only</span><div id="vuo_st_navicons" class="vuo-st-toggle"></div></div>'+
              '<div id="vuo_st_ldsec">'+
                '<div class="vuo-st-cap vuo-st-caprow"><span data-l="loading_screen">Loading screen</span><span id="vuo_st_ldreset" class="vuo-st-link vuo-st-capreset" data-l="reset">Reset</span></div>'+
                '<div class="vuo-st-subcap" data-l="progress_bar">Progress bar</div>'+
                '<div class="vuo-st-row"><span data-l="width">Width</span><div id="vuo_st_ldw" class="vuo-st-slider"><div id="vuo_st_ldwfill" class="vuo-st-sfill"></div></div></div>'+
                '<div class="vuo-st-row"><span data-l="bar_thickness">Bar thickness</span><div id="vuo_st_ldb" class="vuo-st-slider"><div id="vuo_st_ldbfill" class="vuo-st-sfill"></div></div></div>'+
                '<div class="vuo-st-row"><span data-l="text_size">Text size</span><div id="vuo_st_ldt" class="vuo-st-slider"><div id="vuo_st_ldtfill" class="vuo-st-sfill"></div></div></div>'+
                '<div class="vuo-st-row"><span data-l="position">Position</span><div id="vuo_st_ldpos" class="vuo-st-seg"><div class="vuo-st-segbtn" data-lp="left" data-l="al_left">Left</div><div class="vuo-st-segbtn" data-lp="center" data-l="al_center">Center</div><div class="vuo-st-segbtn" data-lp="right" data-l="al_right">Right</div></div></div>'+
                '<div class="vuo-st-row"><span data-l="vertical_pos">Vertical position</span><div id="vuo_st_ldy" class="vuo-st-slider"><div id="vuo_st_ldyfill" class="vuo-st-sfill"></div></div></div>'+
                '<div class="vuo-st-subcap" data-l="server_info">Server info</div>'+
                '<div class="vuo-st-row"><span data-l="size">Size</span><div id="vuo_st_ldis" class="vuo-st-slider"><div id="vuo_st_ldisfill" class="vuo-st-sfill"></div></div></div>'+
                '<div class="vuo-st-row"><span data-l="position">Position</span><div id="vuo_st_ldipos" class="vuo-st-seg"><div class="vuo-st-segbtn" data-lip="left" data-l="al_left">Left</div><div class="vuo-st-segbtn" data-lip="center" data-l="al_center">Center</div><div class="vuo-st-segbtn" data-lip="right" data-l="al_right">Right</div></div></div>'+
                '<div class="vuo-st-row"><span data-l="vertical_pos">Vertical position</span><div id="vuo_st_ldiy" class="vuo-st-slider"><div id="vuo_st_ldiyfill" class="vuo-st-sfill"></div></div></div>'+
              '</div>'+
            '</div>'+
            '<div class="vuo-st-page" data-p="about">'+
              '<div class="vuo-st-abouthead"><span class="vuo-st-abouttitle">Vanilla UI+ v'+VUO_VERSION+' · <span id="vuo_st_build">'+vuoBuildDate(VUO_BUILD)+'</span></span><span class="vuo-st-by"><span data-l="made_by">Made by</span> <b id="vuo_st_author" class="vuo-st-link">Qude</b></span></div>'+
              '<div class="vuo-st-about" data-l="about_desc">A redesigned main menu. Choose your own fonts, backgrounds, music and layout.</div>'+
              '<div class="vuo-st-updrow"><span id="vuo_st_updstate" class="vuo-st-updstate"></span><span id="vuo_st_updcheck" class="vuo-st-link" data-l="upd_check">Check for updates</span></div>'+
              '<div class="vuo-st-aboutlinks"><span id="vuo_st_gh" class="vuo-st-link" data-l="gh_page">GitHub page</span><span id="vuo_st_steam" class="vuo-st-link" data-l="steam_page">Steam page</span></div>'+
            '</div>'+
          '</div>';
        document.body.appendChild(p); vuoSt.panel=p;
        vuoLocApply();

        vuoWrapSounds();
        vuoPanelSounds(p,
            '.vuo-st-tab,.vuo-sw,.vuo-st-segbtn,.vuo-st-toggle,.vuo-st-link,.vuo-st-folder,.vuo-st-bg,.vuo-st-close,.vuo-dd-btn',
            '.vuo-st-tab,.vuo-sw,.vuo-st-segbtn,.vuo-st-link');
        var vuoSels=p.querySelectorAll('select.vuo-st-select'); for(var si=0;si<vuoSels.length;si++) vuoDropdown(vuoSels[si]);
        var tabs=p.querySelectorAll('.vuo-st-tab');
        for(var i=0;i<tabs.length;i++){ tabs[i].addEventListener('click', function(){ vuoStTab(this.getAttribute('data-t')); }); }
        vuoEl('vuo_st_close').addEventListener('click', function(){ vuoUiPlay('back'); vuoStToggle(); });

        vuoSliderBind('vuo_st_dim', function(f){ vuoCfg.dim=Math.round(f*0.85*1000)/1000; vuoApplyDim(); });
        var ba=vuoEl('vuo_st_bganim'); if(ba){ var bb=ba.querySelectorAll('.vuo-st-segbtn'); for(var k=0;k<bb.length;k++){ bb[k].addEventListener('click', function(){ if(vuoAnimLocked()) return; vuoCfg.bganim=this.getAttribute('data-an'); vuoApplyBg(); vuoStSync(); vuoSaveCfg(); }); } }
        vuoEl('vuo_st_music').addEventListener('click', function(){ vuoCfg.music=!vuoCfg.music; vuoApplyMusic(); vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.music ? 'accept' : 'back'); });
        vuoEl('vuo_st_stopjoin').addEventListener('click', function(){ vuoCfg.stopOnJoin=!vuoCfg.stopOnJoin; vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.stopOnJoin ? 'accept' : 'back'); });
        vuoEl('vuo_st_nptoast').addEventListener('click', function(){ vuoCfg.npToast=(vuoCfg.npToast===false); vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.npToast ? 'accept' : 'back'); });
        vuoEl('vuo_st_sounds').addEventListener('click', function(){ vuoCfg.customSounds=!vuoCfg.customSounds; vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.customSounds ? 'accept' : 'back'); });
        vuoEl('vuo_st_font').addEventListener('change', function(){ vuoCfg.font=this.value; vuoApplyFont(); vuoSaveCfg(); });
        var vuoStHover=vuoEl('vuo_st_hover'); if(vuoStHover){ var hvb=vuoStHover.querySelectorAll('.vuo-st-segbtn'); for(var hk=0;hk<hvb.length;hk++){ hvb[hk].addEventListener('click', function(){ vuoCfg.hoverStyle=this.getAttribute('data-hv'); vuoApplyHover(); vuoStSync(); vuoSaveCfg(); vuoUiPlay('accept'); }); } }
        vuoEl('vuo_st_hoverbar').addEventListener('click', function(){ if(vuoCfg.hoverStyle==='vanilla' || vuoCfg.menuLayout==='modern') return; vuoCfg.hoverBar=!vuoCfg.hoverBar; vuoApplyHover(); vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.hoverBar ? 'accept' : 'back'); });

        vuoSliderBind('vuo_st_fsize',  function(f){ vuoCfg.menuFontSize=Math.round(16+f*24); vuoApplyFont(); });
        var vuoStScale=vuoEl('vuo_st_uiscale'); if(vuoStScale) vuoStScale.addEventListener('change', function(){ vuoCfg.uiScale=+this.value||0; vuoApplyScale(); vuoClampAll(); vuoStSync(); vuoSaveCfg(); });
        vuoSliderBind('vuo_st_fspace', function(f){ vuoCfg.menuSpacing=Math.round(f*0.2*1000)/1000; vuoApplyFont(); });
        vuoHueBind('vuo_st_hue_b','vuo_st_hue_b_k','blue');
        vuoHueBind('vuo_st_hue_g','vuo_st_hue_g_k','green');

        vuoSliderBind('vuo_st_bgswap', function(f){ vuoCfg.bgSwap=Math.round(5+f*115); vuoApplyBg(); });
        vuoEl('vuo_st_bgfade').addEventListener('click', function(){ vuoCfg.bgFade=(vuoCfg.bgFade===false); vuoApplyBg(); vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.bgFade!==false ? 'accept' : 'back'); });
        vuoEl('vuo_st_livebg').addEventListener('click', function(){ vuoCfg.liveBg=!vuoCfg.liveBg; vuoStSync(); vuoSaveCfg(); vuoLiveRefresh(); vuoUiPlay(vuoCfg.liveBg ? 'accept' : 'back'); });
        vuoEl('vuo_st_livemap').addEventListener('change', function(){ vuoCfg.liveBgMap=this.value; vuoSaveCfg(); vuoLiveRefresh(); });
        vuoSliderBind('vuo_st_bgblur', function(f){ vuoCfg.bgBlur=Math.round(f*1000)/1000; vuoApplyBg(); });
        vuoEl('vuo_st_bgbluron').addEventListener('click', function(){ vuoCfg.bgBlurOn=!vuoCfg.bgBlurOn; vuoApplyBg(); vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.bgBlurOn ? 'accept' : 'back'); });

        vuoSliderBind('vuo_st_btnx',  function(f){ vuoCfg.loBtnX=Math.round((f*2-1)*vuoNavRange('x')); vuoApplyLayout(); vuoClampKeys('loBtnX','loBtnY',[VUO_BTN_SEL], true); });
        vuoSliderBind('vuo_st_btny',  function(f){ vuoCfg.loBtnY=Math.round((f*2-1)*vuoNavRange('y')); vuoApplyLayout(); vuoClampKeys('loBtnX','loBtnY',[VUO_BTN_SEL], true); });
        vuoSliderBind('vuo_st_logox', function(f){ vuoCfg.loLogoX=Math.round((f*2-1)*1000); vuoApplyLayout(); vuoClampKeys('loLogoX','loLogoY',[vuoLogoSel()], true); });
        vuoSliderBind('vuo_st_logoy', function(f){ vuoCfg.loLogoY=Math.round((f*2-1)*1000); vuoApplyLayout(); vuoClampKeys('loLogoX','loLogoY',[vuoLogoSel()], true); });
        vuoSliderBind('vuo_st_logos', function(f){ vuoCfg.loLogoScale=Math.round((0.3+f*2.7)*100)/100; vuoApplyLayout(); vuoClampKeys('loLogoX','loLogoY',[vuoLogoSel()], true); });
        vuoSliderBind('vuo_st_navx',  function(f){ var nk=vuoNavKeys(); vuoCfg[nk[0]]=Math.round((f*2-1)*vuoNavRange('x')); vuoApplyLayout(); vuoClampKeys(nk[0],nk[1],vuoNavSels(vuoSt.navTarget||'all'), true); });
        vuoSliderBind('vuo_st_navy',  function(f){ var nk=vuoNavKeys(); vuoCfg[nk[1]]=Math.round((f*2-1)*vuoNavRange('y')); vuoApplyLayout(); vuoClampKeys(nk[0],nk[1],vuoNavSels(vuoSt.navTarget||'all'), true); });
        vuoEl('vuo_st_navtarget').addEventListener('change', function(){ vuoSt.navTarget=this.value; vuoStSync(); });
        vuoEl('vuo_st_navicons').addEventListener('click', function(){ vuoCfg.navIconsOnly=!vuoCfg.navIconsOnly; vuoApplyLayout(); vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.navIconsOnly ? 'accept' : 'back'); });
        vuoEl('vuo_st_navidle').addEventListener('click', function(){ vuoCfg.navIdle=!vuoCfg.navIdle; vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.navIdle ? 'accept' : 'back'); });
        var vuoStPreset=vuoEl('vuo_st_preset'); if(vuoStPreset) vuoStPreset.addEventListener('change', function(){ vuoCfg.menuLayout=this.value; vuoCfg.menuAlign=vuoDefaultAlign(); vuoApplyLayout(); vuoApplyHover(); vuoClampAll(); vuoStSync(); vuoSaveCfg(); vuoReplayIn(); });
        var vuoStMalign=vuoEl('vuo_st_malign'); if(vuoStMalign){ var mab=vuoStMalign.querySelectorAll('.vuo-st-segbtn'); for(var mk=0;mk<mab.length;mk++){ mab[mk].addEventListener('click', function(){ vuoCfg.menuAlign=this.getAttribute('data-al'); vuoApplyLayout(); vuoStSync(); vuoSaveCfg(); vuoUiPlay('accept'); }); } }
        vuoEl('vuo_st_logohide').addEventListener('click', function(){ vuoCfg.loLogoHide=!vuoCfg.loLogoHide; vuoApplyLayout(); vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.loLogoHide ? 'back' : 'accept'); });
        vuoEl('vuo_st_logoidle').addEventListener('click', function(){ if(vuoCfg.loLogoHide) return; vuoCfg.logoIdle=!vuoCfg.logoIdle; vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.logoIdle ? 'accept' : 'back'); });
        vuoEl('vuo_st_textidle').addEventListener('click', function(){ vuoCfg.textIdle=!vuoCfg.textIdle; vuoStSync(); vuoSaveCfg(); vuoUiPlay(vuoCfg.textIdle ? 'accept' : 'back'); });

        function vuoLdBind(id, onFrac){ vuoDragBind(vuoEl(id), function(f){ onFrac(f); vuoStSync(); vuoLdPreviewShow(); }, function(){ vuoSaveCfg(); vuoLdPreviewHide(); }); }
        vuoLdBind('vuo_st_ldw', function(f){ vuoCfg.ldWidth=Math.round(VUO_LD.w[0]+f*(VUO_LD.w[1]-VUO_LD.w[0])); });
        vuoLdBind('vuo_st_ldb', function(f){ vuoCfg.ldBar=Math.round(VUO_LD.b[0]+f*(VUO_LD.b[1]-VUO_LD.b[0])); });
        vuoLdBind('vuo_st_ldt', function(f){ vuoCfg.ldText=Math.round(VUO_LD.t[0]+f*(VUO_LD.t[1]-VUO_LD.t[0])); });
        var vuoStLdPos=vuoEl('vuo_st_ldpos'); if(vuoStLdPos){ var lpb=vuoStLdPos.querySelectorAll('.vuo-st-segbtn'); for(var lk=0;lk<lpb.length;lk++){ lpb[lk].addEventListener('click', function(){ vuoCfg.ldPos=this.getAttribute('data-lp'); vuoStSync(); vuoSaveCfg(); vuoUiPlay('accept'); vuoLdPreviewShow(); vuoLdPreviewHide(); }); } }
        vuoLdBind('vuo_st_ldy', function(f){ vuoCfg.ldY=Math.round(f*100); });
        vuoLdBind('vuo_st_ldis', function(f){ vuoCfg.ldInfoScale=Math.round((VUO_LD.s[0]+f*(VUO_LD.s[1]-VUO_LD.s[0]))*100)/100; });
        var vuoStLdIPos=vuoEl('vuo_st_ldipos'); if(vuoStLdIPos){ var lipb=vuoStLdIPos.querySelectorAll('.vuo-st-segbtn'); for(var lik=0;lik<lipb.length;lik++){ lipb[lik].addEventListener('click', function(){ vuoCfg.ldInfoPos=this.getAttribute('data-lip'); vuoStSync(); vuoSaveCfg(); vuoUiPlay('accept'); vuoLdPreviewShow(); vuoLdPreviewHide(); }); } }
        vuoLdBind('vuo_st_ldiy', function(f){ vuoCfg.ldInfoY=Math.round(f*100); });
        vuoEl('vuo_st_ldreset').addEventListener('click', function(){ vuoCfg.ldWidth=VUO_LD.w[2]; vuoCfg.ldBar=VUO_LD.b[2]; vuoCfg.ldText=VUO_LD.t[2]; vuoCfg.ldPos='right'; vuoCfg.ldY=VUO_LD.y[2]; vuoCfg.ldInfoScale=VUO_LD.s[2]; vuoCfg.ldInfoPos='left'; vuoCfg.ldInfoY=VUO_LD.iy[2]; vuoStSync(); vuoSaveCfg(); vuoLdPreviewShow(); vuoLdPreviewHide(); });
        var vuoStLdSec=vuoEl('vuo_st_ldsec'); if(vuoStLdSec){
            vuoStLdSec.addEventListener('mouseenter', function(){ vuoLd.hover=true; vuoLdPreviewShow(); });
            vuoStLdSec.addEventListener('mouseleave', function(){ vuoLd.hover=false; vuoLdPreviewHide(); });
        }
        vuoEl('vuo_st_colreset').addEventListener('click', function(){ vuoCfg.accentBlue='35,135,237'; vuoCfg.accentGreen='60,200,140'; vuoApplyAccent(); vuoStSync(); vuoSaveCfg(); });
        vuoEl('vuo_st_txtreset').addEventListener('click', function(){ vuoCfg.font=''; vuoCfg.menuFontSize=24; vuoCfg.menuSpacing=0.04; vuoCfg.hoverStyle='vuo'; vuoCfg.hoverBar=true; vuoApplyFont(); vuoApplyHover(); vuoClampAll(); vuoStSync(); vuoSaveCfg(); });
        vuoEl('vuo_st_dspreset').addEventListener('click', function(){ vuoCfg.uiScale=0; vuoCfg.dim=0.48; vuoApplyScale(); vuoApplyDim(); vuoClampAll(); vuoStSync(); vuoSaveCfg(); });
        vuoEl('vuo_st_btnreset').addEventListener('click', function(){ vuoCfg.loBtnX=0; vuoCfg.loBtnY=0; vuoCfg.menuAlign=vuoDefaultAlign(); vuoCfg.textIdle=true; vuoClampAll(); vuoStSync(); vuoSaveCfg(); });
        vuoEl('vuo_st_logoreset').addEventListener('click', function(){ vuoCfg.loLogoX=0; vuoCfg.loLogoY=0; vuoCfg.loLogoScale=1; vuoCfg.loLogoHide=false; vuoCfg.logoIdle=true; vuoClampAll(); vuoStSync(); vuoSaveCfg(); });
        vuoEl('vuo_st_navreset').addEventListener('click', function(){ vuoCfg.loNavX=0; vuoCfg.loNavY=0; vuoCfg.navPbX=0; vuoCfg.navPbY=0; vuoCfg.navGmX=0; vuoCfg.navGmY=0; vuoCfg.navGtX=0; vuoCfg.navGtY=0; vuoCfg.navLgX=0; vuoCfg.navLgY=0; vuoCfg.navNwX=0; vuoCfg.navNwY=0; vuoCfg.navStX=0; vuoCfg.navStY=0; vuoCfg.navMuX=0; vuoCfg.navMuY=0; vuoCfg.navIconsOnly=false; vuoCfg.navIdle=true; vuoClampAll(); vuoStSync(); vuoSaveCfg(); });
        var vuoStAuthor=vuoEl('vuo_st_author'); if(vuoStAuthor) vuoStAuthor.addEventListener('click', function(){ vuoOpenURL('https://steamcommunity.com/id/qudeowl'); });
        vuoEl('vuo_st_gh').addEventListener('click', function(){ vuoOpenURL('https://github.com/qudeowl/vanilla-ui-overhaul'); });
        vuoEl('vuo_st_updcheck').addEventListener('click', vuoUpdCheck);
        vuoEl('vuo_st_updstate').addEventListener('click', function(){ if(vuoUpd.state==='new'){ vuoUiPlay('accept'); vuoOpenURL(VUO_RELEASES); } });
        var vuoStSteam=vuoEl('vuo_st_steam'); if(vuoStSteam) vuoStSteam.addEventListener('click', function(){ vuoOpenURL('https://steamcommunity.com/id/qudeowl/myworkshopfiles/?appid=0&sort=score&browsefilter=myfiles&view=imagewall&p=1&numperpage=30'); });

        vuoStRenderBg(); vuoStRenderLive(); vuoStSync();
    }
    var VUO_LD = { w:[180,560,280], b:[3,16,7], t:[10,22,13], s:[0.7,1.6,1], y:[0,100,0], iy:[0,100,100] };
    function vuoLdY(k, d){ var v=Number(vuoCfg[k]); return isFinite(v) && vuoCfg[k]!==null && vuoCfg[k]!=='' ? Math.max(0, Math.min(100, v)) : d; }
    var vuoLd  = { el:null, info:null, hover:false, t:null };
    function vuoLdPreviewEl(){
        if(vuoLd.el) return vuoLd.el;
        var d=document.createElement('div'); d.id='vuo_ld_preview';
        d.innerHTML='<div class="vuo-ldp-info"><div class="vuo-ldp-status" data-l="ld_status_sample">'+vuoT('ld_status_sample')+'</div><div class="vuo-ldp-track"><div class="vuo-ldp-fill"></div></div></div><div class="vuo-ldp-cancel" data-l="ld_cancel">'+vuoT('ld_cancel')+'</div>';
        document.body.appendChild(d); vuoLd.el=d;
        var n=document.createElement('div'); n.id='vuo_ldi_preview';
        n.innerHTML='<div class="vuo-ldi-map"></div><div class="vuo-ldi-text"><div class="vuo-ldi-name">Garry&#39;s Mod</div><div class="vuo-ldi-mapname">gm_construct</div><div class="vuo-ldi-gm">Sandbox</div></div>';
        document.body.appendChild(n); vuoLd.info=n;
        return d;
    }
    function vuoLdPreviewShow(){
        if(vuoLd.t){ clearTimeout(vuoLd.t); vuoLd.t=null; }
        var d=vuoLdPreviewEl(), n=vuoLd.info;
        d.style.setProperty('--ld-w', (vuoCfg.ldWidth||VUO_LD.w[2])+'px');
        d.style.setProperty('--ld-bar', (vuoCfg.ldBar||VUO_LD.b[2])+'px');
        d.style.setProperty('--ld-text', (vuoCfg.ldText||VUO_LD.t[2])+'px');
        d.setAttribute('data-pos', vuoCfg.ldPos||'right');
        d.style.setProperty('--ld-y', 1 - vuoLdY('ldY', VUO_LD.y[2]) / 100);
        n.style.setProperty('--ld-info', vuoCfg.ldInfoScale||VUO_LD.s[2]);
        n.style.setProperty('--ld-iy', 1 - vuoLdY('ldInfoY', VUO_LD.iy[2]) / 100);
        n.setAttribute('data-pos', vuoCfg.ldInfoPos||'left');
        d.classList.add('vuo-open'); n.classList.add('vuo-open');
    }
    function vuoLdPreviewHide(now){
        if(vuoLd.t){ clearTimeout(vuoLd.t); vuoLd.t=null; }
        if(!vuoLd.el) return;
        function off(){ vuoLd.el.classList.remove('vuo-open'); vuoLd.info.classList.remove('vuo-open'); }
        if(now){ off(); return; }
        vuoLd.t=setTimeout(function(){ vuoLd.t=null; if(!vuoLd.hover && !vuoDrag) off(); }, 900);
    }
    function vuoStToggle(){ if(!vuoSt.panel) return; vuoSt.open=!vuoSt.open; if(vuoSt.open) vuoCloseTopPanels('settings'); else { vuoLd.hover=false; vuoLdPreviewHide(true); } if(vuoSt.open) vuoPositionPanel(vuoSt.panel, vuoSt.btn); vuoSt.panel.classList.toggle('vuo-open', vuoSt.open); if(vuoSt.btn){ vuoSt.btn.classList.toggle('nf-active', vuoSt.open); vuoSt.btn.style.opacity=vuoSt.open?'1':'0.45'; } }
    function vuoStTab(t){ var p=vuoSt.panel; if(!p) return; if(t!=='layout'){ vuoLd.hover=false; vuoLdPreviewHide(true); } var a=p.querySelectorAll('.vuo-st-tab'); for(var i=0;i<a.length;i++){ a[i].classList.toggle('vuo-on', a[i].getAttribute('data-t')===t); } var b=p.querySelectorAll('.vuo-st-page'); for(var j=0;j<b.length;j++){ b[j].classList.toggle('vuo-on', b[j].getAttribute('data-p')===t); } }
    function vuoHueBind(barId, knobId, slot){
        var bar=vuoEl(barId), kn=vuoEl(knobId); if(!bar||!kn) return;
        vuoDragBind(bar, function(f){
            var rgb=vuoHslToRgb(f*360);
            if(slot==='blue') vuoCfg.accentBlue=rgb; else vuoCfg.accentGreen=rgb;
            kn.style.left=(f*100)+'%'; kn.style.background='rgb('+rgb+')';
            vuoApplyAccent();
        }, vuoSaveCfg);
    }
    function vuoStRenderAccents(){
        var pairs=[['vuo_st_hue_b_k', vuoCfg.accentBlue||'35,135,237'],['vuo_st_hue_g_k', vuoCfg.accentGreen||'60,200,140']];
        for(var i=0;i<pairs.length;i++){ var k=vuoEl(pairs[i][0]); if(!k) continue; k.style.left=(vuoRgbToHue(pairs[i][1])/360*100)+'%'; k.style.background='rgb('+pairs[i][1]+')'; }
    }
    function vuoStRenderScale(){
        var sel=vuoEl('vuo_st_uiscale'); if(!sel) return;
        var auto=vuoAutoScale(), key=vuoNavLang()+'|'+auto;
        if(sel._vuoKey!==key){
            var h='';
            for(var i=0;i<VUO_SCALES.length;i++){ var v=VUO_SCALES[i]; h+='<option value="'+v+'">'+(v===0 ? vuoT('scale_auto')+' ('+Math.round(auto*100)+'%)' : Math.round(v*100)+'%')+'</option>'; }
            sel.innerHTML=h; sel._vuoKey=key;
        }
        var cur=+vuoCfg.uiScale||0, best=0, bd=1e9;
        for(var j=0;j<VUO_SCALES.length;j++){ var d=Math.abs(VUO_SCALES[j]-cur); if(d<bd){ bd=d; best=VUO_SCALES[j]; } }
        sel.value=String(best);
    }
    function vuoStSync(){
        if(!vuoSt.panel) return;
        vuoStRenderScale();
        var df=vuoEl('vuo_st_dimfill'); if(df) df.style.width=((vuoCfg.dim/0.85)*100)+'%';
        vuoStRenderAccents();
        var m=vuoEl('vuo_st_music'); if(m) m.classList.toggle('vuo-on', !!vuoCfg.music);
        var sj=vuoEl('vuo_st_stopjoin'); if(sj) sj.classList.toggle('vuo-on', !!vuoCfg.stopOnJoin);
        var nt=vuoEl('vuo_st_nptoast'); if(nt) nt.classList.toggle('vuo-on', vuoCfg.npToast!==false);
        var sd=vuoEl('vuo_st_sounds'); if(sd) sd.classList.toggle('vuo-on', !!vuoCfg.customSounds);
        vuoStRenderFonts();
        var hv=vuoCfg.hoverStyle==='vanilla'?'vanilla':'vuo';
        var hs=vuoEl('vuo_st_hover'); if(hs){ var hsb=hs.querySelectorAll('.vuo-st-segbtn'); for(var hi=0;hi<hsb.length;hi++){ hsb[hi].classList.toggle('vuo-sel', hsb[hi].getAttribute('data-hv')===hv); } }
        var hbLock=(hv==='vanilla' || vuoCfg.menuLayout==='modern');
        var hb=vuoEl('vuo_st_hoverbar'); if(hb) hb.classList.toggle('vuo-on', !hbLock && !!vuoCfg.hoverBar);
        var hbr=vuoEl('vuo_st_hoverbarrow'); if(hbr) hbr.classList.toggle('vuo-st-off', hbLock);
        var ap=vuoEl('vuo_st_autoplay'); if(ap) ap.classList.toggle('vuo-on', !!vuoCfg.autoplay);
        var ea=vuoAnimEff(), alock=vuoAnimLocked(), lv=!!vuoCfg.liveBg;
        var ba=vuoEl('vuo_st_bganim'); if(ba){ var bb=ba.querySelectorAll('.vuo-st-segbtn'); for(var i=0;i<bb.length;i++){ bb[i].classList.toggle('vuo-sel', bb[i].getAttribute('data-an')===ea); } }
        var bar=vuoEl('vuo_st_bganimrow'); if(bar) bar.classList.toggle('vuo-st-off', alock || lv);
        var bsr=vuoEl('vuo_st_bgswaprow'); if(bsr) bsr.classList.toggle('vuo-st-off', lv);
        var bfr=vuoEl('vuo_st_bgfaderow'); if(bfr) bfr.classList.toggle('vuo-st-off', lv);
        var bgl=vuoEl('vuo_st_bglist'); if(bgl) bgl.classList.toggle('vuo-st-off', lv);
        var alk=vuoEl('vuo_st_animlock'); if(alk) alk.style.display = alock ? 'block' : 'none';
        var f;
        f=vuoEl('vuo_st_bgswapfill'); if(f) f.style.width=(((vuoCfg.bgSwap||30)-5)/115*100)+'%';
        f=vuoEl('vuo_st_bgblurfill'); if(f) f.style.width=((vuoCfg.bgBlur||0)*100)+'%';
        var hasBg=!!(vuoCfg.bgOn && vuoCfg.bgOn.length);
        var bo=vuoEl('vuo_st_bgbluron'); if(bo) bo.classList.toggle('vuo-on', !!vuoCfg.bgBlurOn && hasBg);
        var bor=vuoEl('vuo_st_bgbluronrow'); if(bor) bor.classList.toggle('vuo-st-off', !hasBg || lv);
        var brw=vuoEl('vuo_st_bgblurrow'); if(brw) brw.classList.toggle('vuo-st-off', !hasBg || !vuoCfg.bgBlurOn || lv);
        var cf=vuoEl('vuo_st_bgfade'); if(cf) cf.classList.toggle('vuo-on', vuoCfg.bgFade!==false);
        var lbt=vuoEl('vuo_st_livebg'); if(lbt) lbt.classList.toggle('vuo-on', !!vuoCfg.liveBg);
        var lmr=vuoEl('vuo_st_livemaprow'); if(lmr) lmr.classList.toggle('vuo-st-off', !vuoCfg.liveBg);
        var lms=vuoEl('vuo_st_livemap'); if(lms && lms.value!==(vuoCfg.liveBgMap||'random')) lms.value=vuoCfg.liveBgMap||'random';
        f=vuoEl('vuo_st_fsizefill');  if(f) f.style.width=(((vuoCfg.menuFontSize||24)-16)/24*100)+'%';
        f=vuoEl('vuo_st_fspacefill'); if(f) f.style.width=(((vuoCfg.menuSpacing==null?0.04:vuoCfg.menuSpacing)/0.2)*100)+'%';
        f=vuoEl('vuo_st_btnxfill');  if(f) f.style.width=Math.max(0,Math.min(100,((vuoCfg.loBtnX||0)/vuoNavRange('x')+1)/2*100))+'%';
        f=vuoEl('vuo_st_btnyfill');  if(f) f.style.width=Math.max(0,Math.min(100,((vuoCfg.loBtnY||0)/vuoNavRange('y')+1)/2*100))+'%';
        f=vuoEl('vuo_st_logoxfill'); if(f) f.style.width=(((vuoCfg.loLogoX||0)/1000+1)/2*100)+'%';
        f=vuoEl('vuo_st_logoyfill'); if(f) f.style.width=(((vuoCfg.loLogoY||0)/1000+1)/2*100)+'%';
        f=vuoEl('vuo_st_logosfill'); if(f) f.style.width=(((vuoCfg.loLogoScale||1)-0.3)/2.7*100)+'%';
        var nk=vuoNavKeys();
        f=vuoEl('vuo_st_navxfill');  if(f) f.style.width=Math.max(0,Math.min(100,((vuoCfg[nk[0]]||0)/vuoNavRange('x')+1)/2*100))+'%';
        f=vuoEl('vuo_st_navyfill');  if(f) f.style.width=Math.max(0,Math.min(100,((vuoCfg[nk[1]]||0)/vuoNavRange('y')+1)/2*100))+'%';
        var nt=vuoEl('vuo_st_navtarget'); if(nt) nt.value=vuoSt.navTarget||'all';
        var ni=vuoEl('vuo_st_navicons'); if(ni) ni.classList.toggle('vuo-on', !!vuoCfg.navIconsOnly);
        var nid=vuoEl('vuo_st_navidle'); if(nid) nid.classList.toggle('vuo-on', !!vuoCfg.navIdle);
        var lh=vuoEl('vuo_st_logohide'); if(lh) lh.classList.toggle('vuo-on', !vuoCfg.loLogoHide);
        var lid=vuoEl('vuo_st_logoidle'); if(lid) lid.classList.toggle('vuo-on', !vuoCfg.loLogoHide && !!vuoCfg.logoIdle);
        var lidr=vuoEl('vuo_st_logoidlerow'); if(lidr) lidr.classList.toggle('vuo-st-off', !!vuoCfg.loLogoHide);
        var tid=vuoEl('vuo_st_textidle'); if(tid) tid.classList.toggle('vuo-on', !!vuoCfg.textIdle);
        var pr2=vuoEl('vuo_st_preset'); if(pr2 && pr2.value!==(vuoCfg.menuLayout||'centered')) pr2.value=vuoCfg.menuLayout||'centered';
        var ma2=vuoEl('vuo_st_malign'); if(ma2){ var maseg=ma2.querySelectorAll('.vuo-st-segbtn'); for(var ms=0;ms<maseg.length;ms++){ maseg[ms].classList.toggle('vuo-sel', maseg[ms].getAttribute('data-al')===(vuoCfg.menuAlign||'center')); } }
        f=vuoEl('vuo_st_ldwfill'); if(f) f.style.width=Math.max(0,Math.min(100,((vuoCfg.ldWidth||VUO_LD.w[2])-VUO_LD.w[0])/(VUO_LD.w[1]-VUO_LD.w[0])*100))+'%';
        f=vuoEl('vuo_st_ldbfill'); if(f) f.style.width=Math.max(0,Math.min(100,((vuoCfg.ldBar||VUO_LD.b[2])-VUO_LD.b[0])/(VUO_LD.b[1]-VUO_LD.b[0])*100))+'%';
        f=vuoEl('vuo_st_ldtfill'); if(f) f.style.width=Math.max(0,Math.min(100,((vuoCfg.ldText||VUO_LD.t[2])-VUO_LD.t[0])/(VUO_LD.t[1]-VUO_LD.t[0])*100))+'%';
        var lp2=vuoEl('vuo_st_ldpos'); if(lp2){ var lpseg=lp2.querySelectorAll('.vuo-st-segbtn'); for(var lps=0;lps<lpseg.length;lps++){ lpseg[lps].classList.toggle('vuo-sel', lpseg[lps].getAttribute('data-lp')===(vuoCfg.ldPos||'right')); } }
        f=vuoEl('vuo_st_ldyfill'); if(f) f.style.width=vuoLdY('ldY', VUO_LD.y[2])+'%';
        f=vuoEl('vuo_st_ldisfill'); if(f) f.style.width=Math.max(0,Math.min(100,((vuoCfg.ldInfoScale||VUO_LD.s[2])-VUO_LD.s[0])/(VUO_LD.s[1]-VUO_LD.s[0])*100))+'%';
        var lip2=vuoEl('vuo_st_ldipos'); if(lip2){ var lipseg=lip2.querySelectorAll('.vuo-st-segbtn'); for(var lis=0;lis<lipseg.length;lis++){ lipseg[lis].classList.toggle('vuo-sel', lipseg[lis].getAttribute('data-lip')===(vuoCfg.ldInfoPos||'left')); } }
        f=vuoEl('vuo_st_ldiyfill'); if(f) f.style.width=vuoLdY('ldInfoY', VUO_LD.iy[2])+'%';
    }
    function vuoBgIsOn(url){ return (vuoCfg.bgOn||[]).indexOf(url)>=0; }
    function vuoBgToggle(url){
        var snd='back';
        if(!url){ vuoCfg.bgOn=[]; }
        else { var i=(vuoCfg.bgOn||[]).indexOf(url); if(i>=0){ vuoCfg.bgOn.splice(i,1); } else { vuoCfg.bgOn.push(url); snd='accept'; } }
        if(typeof vuoUiPlay==='function') vuoUiPlay(snd);
        vuoApplyBg(); vuoStRenderBg(); vuoStSync(); vuoSaveCfg();
    }
    function vuoBgTile(b){
        var sel=vuoBgIsOn(b.url);
        return '<div class="vuo-st-bg'+(sel?' vuo-sel':'')+'" data-u="'+b.url+'" title="'+vuoEsc(b.name)+'" style="background-image:url(\''+b.url+'\')">'+
               '<span class="vuo-st-bgcheck'+(sel?' on':'')+'"></span><span class="vuo-st-bgname">'+vuoEsc(b.name)+'</span></div>';
    }
    function vuoStRenderBg(){
        var list=vuoEl('vuo_st_bglist'); if(!list) return;
        var on=vuoCfg.bgOn||[];
        function vuoBgFolder(key, label, arr, open){
            if(!arr.length) return '';
            var sel=0; for(var i=0;i<arr.length;i++){ if(vuoBgIsOn(arr[i].url)) sel++; }
            var s='<div class="vuo-st-folder'+(open?' open':'')+'" data-fold="'+key+'"><span class="vuo-st-foldchev">&#9656;</span><span class="vuo-st-foldname">'+label+'</span>'+(sel?'<span class="vuo-st-foldsel">'+sel+' '+vuoT('on_word')+'</span>':'')+'<span class="vuo-st-foldcount">'+arr.length+'</span></div>';
            s+='<div class="vuo-st-foldbody'+(open?' open':'')+'">';
            for(var j=0;j<arr.length;j++){ s+=vuoBgTile(arr[j]); }
            return s+'</div>';
        }
        var h='<div class="vuo-st-bg vuo-st-bgdefault'+(on.length===0?' vuo-sel':'')+'" data-u=""><span class="vuo-st-bgname">'+vuoT('default_3d')+'</span></div>';
        h+=vuoBgFolder('def',vuoT('default_bgs'), vuoSt.defbgs, !!vuoSt.defOpen);
        h+=vuoBgFolder('cus',vuoT('custom'), vuoSt.bgs, !!vuoSt.cusOpen);
        h+='<div class="vuo-st-bgempty">'+(vuoSt.bgs.length?vuoT('add_images'):vuoT('drop_images'))+'<br><b>garrysmod/materials/vuo_backgrounds/</b></div>';
        list.innerHTML=h;
        var folds=list.querySelectorAll('.vuo-st-folder');
        for(var f=0;f<folds.length;f++){ folds[f].addEventListener('click', function(){ var k=this.getAttribute('data-fold'), nowOpen; if(k==='def'){ vuoSt.defOpen=!vuoSt.defOpen; nowOpen=vuoSt.defOpen; } else if(k==='cus'){ vuoSt.cusOpen=!vuoSt.cusOpen; nowOpen=vuoSt.cusOpen; } if(typeof vuoUiPlay==='function') vuoUiPlay(nowOpen ? 'accept' : 'back'); vuoStRenderBg(); }); }
        var it=list.querySelectorAll('.vuo-st-bg');
        for(var k=0;k<it.length;k++){ it[k].addEventListener('click', function(){ vuoBgToggle(this.getAttribute('data-u')); }); }
    }

    function process() {
        var items = document.querySelectorAll('.news_item');
        for (var i = 0; i < items.length; i++) styleNewsItem(items[i]);
        var newsDivs = document.querySelectorAll('.news');
        for (var i = 0; i < newsDivs.length; i++) {
            nfNewsButtonSounds(newsDivs[i]);
        }
        nfLangLabels();
        initNewsBtn();
        positionNewsBtn();
        if (!vuoMusic.built) vuoMusicBuild();
        if (!vuoSt.built) vuoStBuild();
    }

    (function() {
        var navbar = document.getElementById('NavBar');
        if (!navbar || navbar._nfSoundDone) return;
        navbar._nfSoundDone = true;
        navbar.addEventListener('mouseenter', function(e) {
            var el = e.target;
            while (el && el !== navbar) {
                if (el.classList && (el.classList.contains('button') || el.classList.contains('smallicon') || el.classList.contains('bigicon'))) {
                    if (typeof lua !== 'undefined') lua.PlaySound('garrysmod/ui_hover.wav');
                    return;
                }
                el = el.parentElement;
            }
        }, true);
        navbar.addEventListener('click', function(e) {
            var el = e.target;
            while (el && el !== navbar) {
                if (el.classList && (el.classList.contains('button') || el.classList.contains('smallicon') || el.classList.contains('bigicon'))) {
                    if ((el.getAttribute('ng-click') || '') === 'ToggleProblems()') return;
                    if (typeof lua !== 'undefined') lua.PlaySound('garrysmod/ui_click.wav');
                    return;
                }
                el = el.parentElement;
            }
        }, true);
    })();

    document.addEventListener('focusin', function(e) {
        var el = e.target;
        while (el && el.classList) {
            if (el.classList.contains('gamemode_list') ||
                el.classList.contains('language_list') ||
                el.classList.contains('games_list')) {
                if (e.target && e.target.blur) e.target.blur();
                return;
            }
            el = el.parentElement;
        }
    }, true);

    var observer = new MutationObserver(process);
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(process, 300);
    setTimeout(process, 1000);
    setTimeout(process, 2500);
    setTimeout(function() { newsAutoPlay.start(); }, 3000);
})();

