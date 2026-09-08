(function(){/* ===================================================================
   i18ndevo103 — the app strings of the 1.0.3 DEVOLUCIÓN (30 Aug 2026).

   §6  A PIONEER IS NOT A LIFETIME PLAN. The account screen called the
       14-month gift «Lifetime plan» while the app warned the same
       person that «your 14 free months are ending». The pioneer needs
       a word of their own and a countdown; the countdown reuses the
       keys that already exist ({n} days left · Last day), so only the
       plan word and the badge are new.
   §7.4 Two plural forms for the free-plan card, used only if a counter
       in CF_USE_LIMITS ever stops being 1 — the singular sentences
       already translated in i18nbuild103 keep serving while it is 1 —
       and the report line, which now says the number the export really
       enforces (cfPdfRangeLocked → CF_FREE_WINDOW_DAYS). «Reports over
       short periods» stays in i18nbuild103 as an orphan.
   §3  The hour of an «as needed» dose on a day already gone: the app
       never invents it, so it asks.

   All 15 non-English languages. Merge-if-missing into CF_UI_MAP.
   Loaded after build/i18nanexo103.js and BEFORE build/i18nlifetags.js
   (which stays last of the dictionaries).
   =================================================================== */(function(){if(typeof CF_UI_MAP==='undefined')return;var M={"Pioneer plan":{es:"Plan pionero",ca:"Pla pioner",fr:"Formule pionnier",de:"Pionier-Plan",it:"Piano pioniere",pt:"Plano pioneiro",zh:"先锋方案",ja:"パイオニアプラン",ko:"파이오니어 요금제",hi:"अग्रणी योजना",id:"Paket perintis",tr:"Öncü plan",ru:"План первопроходца",vi:"Gói tiên phong",ar:"خطة الرواد"},"PIONEER":{es:"PIONERO",ca:"PIONER",fr:"PIONNIER",de:"PIONIER",it:"PIONIERE",pt:"PIONEIRO",zh:"先锋",ja:"パイオニア",ko:"파이오니어",hi:"अग्रणी",id:"PERINTIS",tr:"ÖNCÜ",ru:"ПИОНЕР",vi:"TIÊN PHONG",ar:"رائد"},"{n} calm sessions a day":{es:"{n} sesiones de calma al día",ca:"{n} sessions de calma al dia",fr:"{n} séances de calme par jour",de:"{n} Ruhe-Sitzungen pro Tag",it:"{n} sessioni di calma al giorno",pt:"{n} sessões de calma por dia",zh:"每天 {n} 次静心时段",ja:"1 日 {n} 回の静かな時間",ko:"하루 {n}번의 고요한 세션",hi:"दिन में {n} शांति सत्र",id:"{n} sesi tenang sehari",tr:"Günde {n} sakinlik oturumu",ru:"{n} сессий спокойствия в день",vi:"{n} buổi tĩnh tâm mỗi ngày",ar:"{n} جلسات هدوء يوميًا"},"{n} games a day":{es:"{n} partidas al día",ca:"{n} partides al dia",fr:"{n} parties par jour",de:"{n} Spiele pro Tag",it:"{n} partite al giorno",pt:"{n} partidas por dia",zh:"每天 {n} 局游戏",ja:"1 日 {n} ゲーム",ko:"하루 {n}판",hi:"दिन में {n} गेम",id:"{n} permainan sehari",tr:"Günde {n} oyun",ru:"{n} игр в день",vi:"{n} lượt chơi mỗi ngày",ar:"{n} ألعاب يوميًا"},"Reports of up to {n} days":{es:"Informes de hasta {n} días",ca:"Informes de fins a {n} dies",fr:"Des rapports jusqu'à {n} jours",de:"Berichte über bis zu {n} Tage",it:"Report fino a {n} giorni",pt:"Relatórios de até {n} dias",zh:"最长 {n} 天的报告",ja:"最長 {n} 日分のレポート",ko:"최대 {n}일까지의 리포트",hi:"{n} दिन तक की रिपोर्ट",id:"Laporan hingga {n} hari",tr:"{n} güne kadar raporlar",ru:"Отчёты за период до {n} дней",vi:"Báo cáo tối đa {n} ngày",ar:"تقارير حتى {n} يومًا"},"What time did you take it?":{es:"¿A qué hora la tomaste?",ca:"A quina hora la vas prendre?",fr:"À quelle heure l'avez-vous prise ?",de:"Um wie viel Uhr hast du sie genommen?",it:"A che ora l'hai presa?",pt:"A que horas a tomaste?",zh:"你几点服用的？",ja:"何時に服用しましたか？",ko:"몇 시에 복용했나요?",hi:"आपने इसे किस समय लिया?",id:"Jam berapa kamu meminumnya?",tr:"Saat kaçta aldın?",ru:"Во сколько вы приняли?",vi:"Bạn đã dùng lúc mấy giờ?",ar:"في أي ساعة أخذتها؟"}};Object.keys(M).forEach(function(k){if(!CF_UI_MAP[k])CF_UI_MAP[k]=M[k];else Object.keys(M[k]).forEach(function(l){if(!CF_UI_MAP[k][l])CF_UI_MAP[k][l]=M[k][l];});});})();
})();