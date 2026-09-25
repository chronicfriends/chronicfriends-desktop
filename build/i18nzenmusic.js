/* ===================================================================
   i18nzenmusic — the strings of ZEN MUSIC (TOOL1, 18 Sep 2026).

   Four long Creative-Commons pieces inside the Meditation room
   (zenmusic.jsx · NCZenMusic). Only the SCREEN is translated here:

   🔴 THE TRACK TITLES AND THE CHANNEL NAMES ARE NEVER TRANSLATED.
   «Calm the Mind», «Water & Stillness», «Japanese Flute»,
   «30-Minute Zen» and their authors (Spiritual Life · D-SOPHORN ·
   MusicSense · ZenFlow Music) are typed once, in zenmusic.jsx, and
   read the same in the 16 languages — the credit of a CC BY work is
   the author's name as the author writes it, not a translation of it.
   The quoted work titles in the credits block are likewise verbatim.

   Reused, never defined again (the 23 Aug rule):
     Play · Pause  → i18n-flare6.jsx
     Stop          → i18n-flare8.jsx

   All 15 non-English languages. Merge-if-missing.
   Loaded after i18nciclo105 and BEFORE i18nlifetags (which stays last
   of the dictionaries).
   =================================================================== */
(function () {
  if (typeof CF_UI_MAP === 'undefined') return;
  var M = {
  /* ---------- the room entry ---------- */
  "Zen Music": {
    es: "Música zen", ca: "Música zen", fr: "Musique zen", de: "Zen-Musik", it: "Musica zen",
    pt: "Música zen", zh: "禅意音乐", ja: "禅の音楽", ko: "젠 음악", hi: "ज़ेन संगीत",
    id: "Musik zen", tr: "Zen müziği", ru: "Дзен-музыка", vi: "Nhạc thiền", ar: "موسيقى زِن",
  },
  "Four long pieces to rest, meditate or fall asleep to — press play and put the phone down.": {
    es: "Cuatro piezas largas para descansar, meditar o quedarte dormido: dale al play y deja el teléfono.",
    ca: "Quatre peces llargues per descansar, meditar o adormir-te: prem play i deixa el telèfon.",
    fr: "Quatre longues pièces pour vous reposer, méditer ou vous endormir — appuyez sur lecture et posez le téléphone.",
    de: "Vier lange Stücke zum Ausruhen, Meditieren oder Einschlafen — auf Abspielen tippen und das Handy weglegen.",
    it: "Quattro brani lunghi per riposare, meditare o addormentarti: premi play e posa il telefono.",
    pt: "Quatro peças longas para descansar, meditar ou adormecer — carrega em reproduzir e pousa o telemóvel.",
    zh: "四段长音乐，用来休息、冥想或入睡——按下播放，把手机放下。",
    ja: "休む・瞑想する・眠りに落ちるための長い4曲。再生を押して、スマホは置いておきましょう。",
    ko: "쉬거나 명상하거나 잠들기 위한 긴 네 곡 — 재생을 누르고 휴대폰을 내려놓으세요.",
    hi: "आराम करने, ध्यान लगाने या सो जाने के लिए चार लंबी धुनें — प्ले दबाएँ और फ़ोन रख दें।",
    id: "Empat lagu panjang untuk beristirahat, bermeditasi, atau tertidur — tekan putar lalu letakkan ponselmu.",
    tr: "Dinlenmek, meditasyon yapmak ya da uykuya dalmak için dört uzun parça — oynat'a dokun ve telefonu bırak.",
    ru: "Четыре длинные композиции, чтобы отдохнуть, помедитировать или уснуть — нажмите воспроизведение и отложите телефон.",
    vi: "Bốn bản nhạc dài để nghỉ ngơi, thiền hoặc chìm vào giấc ngủ — bấm phát rồi đặt điện thoại xuống.",
    ar: "أربع مقطوعات طويلة للراحة أو التأمل أو النوم — اضغط تشغيل وضع الهاتف جانبًا.",
  },
  /* ---------- the list ---------- */
  "by {channel}": {
    es: "de {channel}", ca: "de {channel}", fr: "par {channel}", de: "von {channel}", it: "di {channel}",
    pt: "de {channel}", zh: "来自 {channel}", ja: "{channel} より", ko: "{channel} 제공", hi: "{channel} द्वारा",
    id: "oleh {channel}", tr: "{channel} tarafından", ru: "от {channel}", vi: "bởi {channel}", ar: "من {channel}",
  },
  "{n} min": {
    es: "{n} min", ca: "{n} min", fr: "{n} min", de: "{n} Min.", it: "{n} min",
    pt: "{n} min", zh: "{n} 分钟", ja: "{n}分", ko: "{n}분", hi: "{n} मिनट",
    id: "{n} mnt", tr: "{n} dk", ru: "{n} мин", vi: "{n} phút", ar: "{n} دقيقة",
  },
  /* ---------- the sleep timer ---------- */
  "Sleep timer": {
    es: "Temporizador de sueño", ca: "Temporitzador de son", fr: "Minuteur de sommeil", de: "Einschlaf-Timer",
    it: "Timer per dormire", pt: "Temporizador de sono", zh: "睡眠定时", ja: "スリープタイマー", ko: "취침 타이머",
    hi: "स्लीप टाइमर", id: "Timer tidur", tr: "Uyku zamanlayıcısı", ru: "Таймер сна", vi: "Hẹn giờ ngủ", ar: "مؤقّت النوم",
  },
  "Stop after {n} min": {
    es: "Parar a los {n} min", ca: "Aturar als {n} min", fr: "Arrêter après {n} min", de: "Nach {n} Min. stoppen",
    it: "Ferma dopo {n} min", pt: "Parar após {n} min", zh: "{n} 分钟后停止", ja: "{n}分で停止", ko: "{n}분 후 정지",
    hi: "{n} मिनट बाद रोकें", id: "Berhenti setelah {n} mnt", tr: "{n} dk sonra dur", ru: "Остановить через {n} мин",
    vi: "Dừng sau {n} phút", ar: "التوقّف بعد {n} دقيقة",
  },
  /* ---------- the Home card, while something is playing ---------- */
  "Playing": {
    es: "Sonando", ca: "Sonant", fr: "En lecture", de: "Läuft", it: "In riproduzione",
    pt: "A tocar", zh: "正在播放", ja: "再生中", ko: "재생 중", hi: "चल रहा है",
    id: "Sedang diputar", tr: "Çalıyor", ru: "Играет", vi: "Đang phát", ar: "قيد التشغيل",
  },
  /* ---------- no connection (never a noisy retry) ---------- */
  "This piece streams from the internet — connect and try again.": {
    es: "Esta pieza se reproduce desde internet: conéctate y vuelve a intentarlo.",
    ca: "Aquesta peça es reprodueix des d'internet: connecta't i torna-ho a provar.",
    fr: "Ce morceau est diffusé depuis internet — connectez-vous et réessayez.",
    de: "Dieses Stück kommt aus dem Internet — verbinde dich und versuche es noch einmal.",
    it: "Questo brano arriva da internet: collegati e riprova.",
    pt: "Esta peça vem da internet — liga-te e tenta outra vez.",
    zh: "这段音乐来自网络——连上网后再试一次。",
    ja: "この曲はインターネットから再生されます。接続してもう一度お試しください。",
    ko: "이 곡은 인터넷에서 재생됩니다 — 연결한 뒤 다시 시도해 보세요.",
    hi: "यह धुन इंटरनेट से चलती है — कनेक्ट करें और फिर कोशिश करें।",
    id: "Lagu ini diputar dari internet — sambungkan lalu coba lagi.",
    tr: "Bu parça internetten çalınır — bağlan ve tekrar dene.",
    ru: "Эта композиция звучит из интернета — подключитесь и попробуйте снова.",
    vi: "Bản nhạc này phát từ internet — hãy kết nối rồi thử lại.",
    ar: "تُشغَّل هذه المقطوعة من الإنترنت — اتصل ثم حاول مرة أخرى.",
  },
  /* ---------- the credits, which are obligatory (CC BY) ---------- */
  "Credits": {
    es: "Créditos", ca: "Crèdits", fr: "Crédits", de: "Credits", it: "Crediti",
    pt: "Créditos", zh: "致谢", ja: "クレジット", ko: "크레딧", hi: "श्रेय",
    id: "Kredit", tr: "Künye", ru: "Авторы", vi: "Ghi công", ar: "المصادر",
  },
  "Music by these creators, used under the Creative Commons Attribution license.": {
    es: "Música de estos creadores, usada bajo la licencia Creative Commons Attribution.",
    ca: "Música d'aquests creadors, usada sota la llicència Creative Commons Attribution.",
    fr: "Musique de ces créateurs, utilisée sous licence Creative Commons Attribution.",
    de: "Musik dieser Urheber, genutzt unter der Creative-Commons-Attribution-Lizenz.",
    it: "Musica di questi autori, usata con licenza Creative Commons Attribution.",
    pt: "Música destes criadores, usada sob a licença Creative Commons Attribution.",
    zh: "音乐来自以下创作者，依据 Creative Commons Attribution 许可使用。",
    ja: "以下のクリエイターによる音楽を、Creative Commons Attribution ライセンスのもとで使用しています。",
    ko: "아래 창작자들의 음악을 Creative Commons Attribution 라이선스에 따라 사용합니다.",
    hi: "यह संगीत इन रचनाकारों का है, Creative Commons Attribution लाइसेंस के तहत उपयोग किया गया।",
    id: "Musik dari para kreator ini, digunakan di bawah lisensi Creative Commons Attribution.",
    tr: "Bu müzikler adı geçen kişilere aittir; Creative Commons Attribution lisansıyla kullanılmaktadır.",
    ru: "Музыка этих авторов используется по лицензии Creative Commons Attribution.",
    vi: "Nhạc của những tác giả này, được dùng theo giấy phép Creative Commons Attribution.",
    ar: "موسيقى هؤلاء المبدعين، مستخدمة بموجب رخصة Creative Commons Attribution.",
  },
  };
  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = M[k];
    else Object.keys(M[k]).forEach(function (l) { if (!CF_UI_MAP[k][l]) CF_UI_MAP[k][l] = M[k][l]; });
  });
})();
