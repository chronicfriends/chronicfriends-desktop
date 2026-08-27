(function(){/* ===================================================================
   i18nbarrido25 — the visible strings of the 25-Aug-2026 sweep.
   Merge-if-missing (an existing translation always wins), English is
   the key, the other 15 languages inline.

     §4  'Check-In' — the big Home button. The word "Daily" is gone at
         Gerhard's request, and because with the bell beside it the old
         label broke onto two lines on his iPhone. This is a NEW key, so
         all 16 languages are written from scratch and shortened the way
         each language really shortens it — never trimmed by eye. The old
         'Daily Check-In' entry stays where it is (i18nfix7), orphaned;
         the lowercase 'Daily check-in' key (i18nfix8) is a DIFFERENT
         string used by other screens and was not touched.
     §2  the two lines under the Home steps number, for the two silences
         that must never read the same: "connected, nothing recorded for
         today" and "not reading your steps yet". The em dash itself is
         drawn by the card, never a 0. The third case (a computer, where
         there is nothing to connect) reuses the existing 16-language key
         'Steps come from your phone' from i18nsteps.jsx — grep the
         dictionaries before writing a key.
   Loaded after i18nbarrido24 and BEFORE i18nlifetags, which stays last.
   =================================================================== */(function(){if(typeof CF_UI_MAP==='undefined')return;var M={'Check-In':{es:'Registro',ca:'Registre',fr:'Bilan',de:'Check-in',it:'Check-in',pt:'Check-in',zh:'打卡',ja:'チェックイン',ko:'체크인',hi:'चेक-इन',id:'Check-in',tr:'Kayıt',ru:'Отметка',vi:'Điểm danh',ar:'تسجيل'},'Connected — no steps from {p} for today yet.':{es:'Conectado: {p} aún no tiene pasos de hoy.',ca:'Connectat: {p} encara no té passos d’avui.',fr:'Connecté — {p} n’a pas encore de pas pour aujourd’hui.',de:'Verbunden — von {p} kommen für heute noch keine Schritte.',it:'Collegato: da {p} non arrivano ancora passi per oggi.',pt:'Ligado — de {p} ainda não vêm passos de hoje.',zh:'已连接 —— {p} 还没有今天的步数。',ja:'接続済み — {p} からきょうの歩数はまだ届いていません。',ko:'연결됨 — {p}에서 오늘 걸음 수가 아직 오지 않았어요.',hi:'जुड़ा है — {p} से आज के क़दम अभी नहीं आए।',id:'Terhubung — belum ada langkah hari ini dari {p}.',tr:'Bağlı — {p} bugünün adımlarını henüz vermedi.',ru:'Подключено — шагов за сегодня от {p} ещё нет.',vi:'Đã kết nối — chưa có số bước hôm nay từ {p}.',ar:'متصل — لم تصل خطوات اليوم من {p} بعد.'},'Not reading your steps from {p} yet — tap to connect it in the step tournament.':{es:'Aún no leemos tus pasos de {p}: toca para conectarlo en el torneo de pasos.',ca:'Encara no llegim els teus passos de {p}: toca per connectar-lo al torneig de passos.',fr:'Nous ne lisons pas encore vos pas depuis {p} — touchez pour le connecter dans le tournoi de pas.',de:'Wir lesen deine Schritte noch nicht aus {p} — tippe, um es im Schritte-Turnier zu verbinden.',it:'Non leggiamo ancora i tuoi passi da {p}: tocca per collegarlo nel torneo di passi.',pt:'Ainda não lemos os teus passos de {p} — toca para o ligar no torneio de passos.',zh:'还没有从 {p} 读取你的步数 —— 点一下，在步数锦标赛里连接。',ja:'{p} からの歩数はまだ読み取っていません — タップして歩数トーナメントでつなげます。',ko:'아직 {p}에서 걸음 수를 읽지 않아요 — 눌러서 걸음 수 토너먼트에서 연결하세요.',hi:'{p} से आपके क़दम अभी नहीं पढ़े जा रहे — क़दमों के टूर्नामेंट में जोड़ने के लिए टैप करें।',id:'Langkahmu belum dibaca dari {p} — ketuk untuk menghubungkannya di turnamen langkah.',tr:'Adımlarını {p} üzerinden henüz okumuyoruz — adım turnuvasında bağlamak için dokun.',ru:'Мы пока не читаем ваши шаги из {p} — нажмите, чтобы подключить его в турнире шагов.',vi:'Chưa đọc số bước của bạn từ {p} — chạm để kết nối trong giải đấu bước chân.',ar:'لا نقرأ خطواتك من {p} بعد — اضغط لربطه في دورة الخطوات.'}};Object.keys(M).forEach(function(en){var cur=CF_UI_MAP[en]||(CF_UI_MAP[en]={});var add=M[en];Object.keys(add).forEach(function(L){if(cur[L]==null)cur[L]=add[L];});});})();
})();