/* ===================================================================
   i18nciclo107f — the app strings of CICLO 1.0.7f (28 Sep 2026), the four
   things Gerhard asked for after watching a new member use the app:

     §2 the flare areas follow the person's illness (checkinflow.jsx ·
        CKF_FLARE_GROUPS). Almost every area is a word the app ALREADY
        says in 16 languages (FLARE_SYM_SETS / RFS_SYMPTOMS of
        flaremodestory.jsx → i18nflaresym · i18ngap5a · i18ngap7 ·
        i18nmind): they are reused, never defined again. Only the six the
        vocabulary lacked live here — patient words, not diagnoses.
     §3 «Translate ▾» under every post (postcard.jsx). «Translated from …»
        is ONE whole sentence per source language, because the name of a
        language cannot be glued into a frame: «del español» · «de l’àrab»
        · «dallo spagnolo» · «aus dem Spanischen» · «с испанского» ·
        «İspanyolcadan». The language NAMES in the list are the app's own
        (CF_LANGS, each in its own script) and are not translated.
     §4 «Invite someone to Chronic Friends» (invite.jsx). The message names
        nobody's health — not even the sender's; «WhatsApp» is a name.

   Reused, never defined again: Close (i18ncoop and others).
   All 15 non-English languages. Merge-if-missing.
   Loaded after i18nplural and BEFORE i18nlifetags (which stays last).
   =================================================================== */
(function () {
  if (typeof CF_UI_MAP === 'undefined') return;
  var M = {
  /* ---------- §2 · the six flare areas the vocabulary lacked ---------- */
  "Dry mouth": {
    es: "Boca seca", ca: "Boca seca", fr: "Bouche sèche", de: "Mundtrockenheit", it: "Bocca secca",
    pt: "Boca seca", zh: "口干", ja: "口の渇き", ko: "입 마름", hi: "मुँह सूखना",
    id: "Mulut kering", tr: "Ağız kuruluğu", ru: "Сухость во рту", vi: "Khô miệng", ar: "جفاف الفم",
  },
  "Numbness or tingling": {
    es: "Entumecimiento u hormigueo", ca: "Adormiment o formigueig", fr: "Engourdissement ou fourmillements", de: "Taubheit oder Kribbeln", it: "Intorpidimento o formicolio",
    pt: "Dormência ou formigueiro", zh: "麻木或刺痛", ja: "しびれやピリピリ感", ko: "저림 또는 따끔거림", hi: "सुन्नपन या झनझनाहट",
    id: "Mati rasa atau kesemutan", tr: "Uyuşma veya karıncalanma", ru: "Онемение или покалывание", vi: "Tê hoặc châm chích", ar: "خدر أو تنميل",
  },
  "Muscle weakness": {
    es: "Debilidad muscular", ca: "Debilitat muscular", fr: "Faiblesse musculaire", de: "Muskelschwäche", it: "Debolezza muscolare",
    pt: "Fraqueza muscular", zh: "肌肉无力", ja: "筋力の低下", ko: "근력 약화", hi: "मांसपेशियों में कमज़ोरी",
    id: "Otot lemah", tr: "Kas güçsüzlüğü", ru: "Мышечная слабость", vi: "Yếu cơ", ar: "ضعف العضلات",
  },
  "Neck pain": {
    es: "Dolor de cuello", ca: "Mal de coll", fr: "Douleur au cou", de: "Nackenschmerzen", it: "Dolore al collo",
    pt: "Dor no pescoço", zh: "颈部疼痛", ja: "首の痛み", ko: "목 통증", hi: "गर्दन में दर्द",
    id: "Nyeri leher", tr: "Boyun ağrısı", ru: "Боль в шее", vi: "Đau cổ", ar: "ألم الرقبة",
  },
  "Bladder pain": {
    es: "Dolor de vejiga", ca: "Dolor de bufeta", fr: "Douleur à la vessie", de: "Blasenschmerzen", it: "Dolore alla vescica",
    pt: "Dor na bexiga", zh: "膀胱疼痛", ja: "膀胱の痛み", ko: "방광 통증", hi: "मूत्राशय में दर्द",
    id: "Nyeri kandung kemih", tr: "Mesane ağrısı", ru: "Боль в мочевом пузыре", vi: "Đau bàng quang", ar: "ألم المثانة",
  },
  "Pain all over": {
    es: "Dolor por todo el cuerpo", ca: "Dolor per tot el cos", fr: "Douleurs partout", de: "Schmerzen überall", it: "Dolore dappertutto",
    pt: "Dores pelo corpo todo", zh: "全身疼痛", ja: "全身の痛み", ko: "온몸 통증", hi: "पूरे शरीर में दर्द",
    id: "Nyeri di seluruh tubuh", tr: "Tüm vücutta ağrı", ru: "Боль по всему телу", vi: "Đau khắp người", ar: "ألم في كل الجسم",
  },

  /* ---------- §3 · Translate ▾ under every post ---------- */
  "Translate": {
    es: "Traducir", ca: "Tradueix", fr: "Traduire", de: "Übersetzen", it: "Traduci",
    pt: "Traduzir", zh: "翻译", ja: "翻訳", ko: "번역", hi: "अनुवाद करें",
    id: "Terjemahkan", tr: "Çevir", ru: "Перевести", vi: "Dịch", ar: "ترجمة",
  },
  "Translating…": {
    es: "Traduciendo…", ca: "S’està traduint…", fr: "Traduction en cours…", de: "Wird übersetzt…", it: "Traduzione in corso…",
    pt: "A traduzir…", zh: "正在翻译…", ja: "翻訳中…", ko: "번역 중…", hi: "अनुवाद हो रहा है…",
    id: "Menerjemahkan…", tr: "Çevriliyor…", ru: "Перевод…", vi: "Đang dịch…", ar: "جارٍ الترجمة…",
  },
  "See original": {
    es: "Ver original", ca: "Mostra l’original", fr: "Voir l’original", de: "Original anzeigen", it: "Vedi originale",
    pt: "Ver original", zh: "查看原文", ja: "原文を表示", ko: "원문 보기", hi: "मूल देखें",
    id: "Lihat asli", tr: "Orijinali gör", ru: "Показать оригинал", vi: "Xem bản gốc", ar: "عرض الأصل",
  },
  "Translated": {
    es: "Traducido", ca: "Traduït", fr: "Traduit", de: "Übersetzt", it: "Tradotto",
    pt: "Traduzido", zh: "已翻译", ja: "翻訳済み", ko: "번역됨", hi: "अनुवादित",
    id: "Diterjemahkan", tr: "Çevrildi", ru: "Переведено", vi: "Đã dịch", ar: "مترجم",
  },
  "This post is already in that language.": {
    es: "Esta publicación ya está en ese idioma.", ca: "Aquesta publicació ja és en aquesta llengua.", fr: "Cette publication est déjà dans cette langue.", de: "Dieser Beitrag ist schon in dieser Sprache.", it: "Questo post è già in questa lingua.",
    pt: "Esta publicação já está nessa língua.", zh: "这篇帖子已经是这种语言了。", ja: "この投稿はすでにその言語で書かれています。", ko: "이 게시물은 이미 그 언어로 되어 있어요.", hi: "यह पोस्ट पहले से उसी भाषा में है।",
    id: "Postingan ini sudah dalam bahasa itu.", tr: "Bu gönderi zaten o dilde.", ru: "Эта публикация уже на этом языке.", vi: "Bài đăng này đã ở ngôn ngữ đó rồi.", ar: "هذا المنشور بهذه اللغة أصلًا.",
  },
  "This post can’t be translated right now.": {
    es: "Ahora mismo no se puede traducir esta publicación.", ca: "Ara mateix no es pot traduir aquesta publicació.", fr: "Cette publication ne peut pas être traduite pour le moment.", de: "Dieser Beitrag kann gerade nicht übersetzt werden.", it: "Al momento questo post non può essere tradotto.",
    pt: "De momento, não é possível traduzir esta publicação.", zh: "这篇帖子暂时无法翻译。", ja: "この投稿は今は翻訳できません。", ko: "이 게시물은 지금 번역할 수 없어요.", hi: "इस पोस्ट का अभी अनुवाद नहीं हो सकता।",
    id: "Postingan ini belum bisa diterjemahkan sekarang.", tr: "Bu gönderi şu anda çevrilemiyor.", ru: "Сейчас эту публикацию нельзя перевести.", vi: "Hiện chưa thể dịch bài đăng này.", ar: "لا يمكن ترجمة هذا المنشور الآن.",
  },
  /* «Translated from …» — one sentence per source language (PT_FROM, postcard.jsx) */
  "Translated from English": {
    es: "Traducido del inglés", ca: "Traduït de l’anglès", fr: "Traduit de l’anglais", de: "Aus dem Englischen übersetzt", it: "Tradotto dall’inglese",
    pt: "Traduzido do inglês", zh: "译自英语", ja: "英語から翻訳", ko: "영어에서 번역됨", hi: "अंग्रेज़ी से अनुवादित",
    id: "Diterjemahkan dari bahasa Inggris", tr: "İngilizceden çevrildi", ru: "Переведено с английского", vi: "Dịch từ tiếng Anh", ar: "مترجم من الإنجليزية",
  },
  "Translated from Spanish": {
    es: "Traducido del español", ca: "Traduït de l’espanyol", fr: "Traduit de l’espagnol", de: "Aus dem Spanischen übersetzt", it: "Tradotto dallo spagnolo",
    pt: "Traduzido do espanhol", zh: "译自西班牙语", ja: "スペイン語から翻訳", ko: "스페인어에서 번역됨", hi: "स्पेनिश से अनुवादित",
    id: "Diterjemahkan dari bahasa Spanyol", tr: "İspanyolcadan çevrildi", ru: "Переведено с испанского", vi: "Dịch từ tiếng Tây Ban Nha", ar: "مترجم من الإسبانية",
  },
  "Translated from Catalan": {
    es: "Traducido del catalán", ca: "Traduït del català", fr: "Traduit du catalan", de: "Aus dem Katalanischen übersetzt", it: "Tradotto dal catalano",
    pt: "Traduzido do catalão", zh: "译自加泰罗尼亚语", ja: "カタルーニャ語から翻訳", ko: "카탈루냐어에서 번역됨", hi: "कैटलन से अनुवादित",
    id: "Diterjemahkan dari bahasa Katalan", tr: "Katalancadan çevrildi", ru: "Переведено с каталанского", vi: "Dịch từ tiếng Catalan", ar: "مترجم من الكتالونية",
  },
  "Translated from French": {
    es: "Traducido del francés", ca: "Traduït del francès", fr: "Traduit du français", de: "Aus dem Französischen übersetzt", it: "Tradotto dal francese",
    pt: "Traduzido do francês", zh: "译自法语", ja: "フランス語から翻訳", ko: "프랑스어에서 번역됨", hi: "फ़्रेंच से अनुवादित",
    id: "Diterjemahkan dari bahasa Prancis", tr: "Fransızcadan çevrildi", ru: "Переведено с французского", vi: "Dịch từ tiếng Pháp", ar: "مترجم من الفرنسية",
  },
  "Translated from German": {
    es: "Traducido del alemán", ca: "Traduït de l’alemany", fr: "Traduit de l’allemand", de: "Aus dem Deutschen übersetzt", it: "Tradotto dal tedesco",
    pt: "Traduzido do alemão", zh: "译自德语", ja: "ドイツ語から翻訳", ko: "독일어에서 번역됨", hi: "जर्मन से अनुवादित",
    id: "Diterjemahkan dari bahasa Jerman", tr: "Almancadan çevrildi", ru: "Переведено с немецкого", vi: "Dịch từ tiếng Đức", ar: "مترجم من الألمانية",
  },
  "Translated from Italian": {
    es: "Traducido del italiano", ca: "Traduït de l’italià", fr: "Traduit de l’italien", de: "Aus dem Italienischen übersetzt", it: "Tradotto dall’italiano",
    pt: "Traduzido do italiano", zh: "译自意大利语", ja: "イタリア語から翻訳", ko: "이탈리아어에서 번역됨", hi: "इतालवी से अनुवादित",
    id: "Diterjemahkan dari bahasa Italia", tr: "İtalyancadan çevrildi", ru: "Переведено с итальянского", vi: "Dịch từ tiếng Ý", ar: "مترجم من الإيطالية",
  },
  "Translated from Portuguese": {
    es: "Traducido del portugués", ca: "Traduït del portuguès", fr: "Traduit du portugais", de: "Aus dem Portugiesischen übersetzt", it: "Tradotto dal portoghese",
    pt: "Traduzido do português", zh: "译自葡萄牙语", ja: "ポルトガル語から翻訳", ko: "포르투갈어에서 번역됨", hi: "पुर्तगाली से अनुवादित",
    id: "Diterjemahkan dari bahasa Portugis", tr: "Portekizceden çevrildi", ru: "Переведено с португальского", vi: "Dịch từ tiếng Bồ Đào Nha", ar: "مترجم من البرتغالية",
  },
  "Translated from Chinese": {
    es: "Traducido del chino", ca: "Traduït del xinès", fr: "Traduit du chinois", de: "Aus dem Chinesischen übersetzt", it: "Tradotto dal cinese",
    pt: "Traduzido do chinês", zh: "译自中文", ja: "中国語から翻訳", ko: "중국어에서 번역됨", hi: "चीनी से अनुवादित",
    id: "Diterjemahkan dari bahasa Mandarin", tr: "Çinceden çevrildi", ru: "Переведено с китайского", vi: "Dịch từ tiếng Trung", ar: "مترجم من الصينية",
  },
  "Translated from Japanese": {
    es: "Traducido del japonés", ca: "Traduït del japonès", fr: "Traduit du japonais", de: "Aus dem Japanischen übersetzt", it: "Tradotto dal giapponese",
    pt: "Traduzido do japonês", zh: "译自日语", ja: "日本語から翻訳", ko: "일본어에서 번역됨", hi: "जापानी से अनुवादित",
    id: "Diterjemahkan dari bahasa Jepang", tr: "Japoncadan çevrildi", ru: "Переведено с японского", vi: "Dịch từ tiếng Nhật", ar: "مترجم من اليابانية",
  },
  "Translated from Korean": {
    es: "Traducido del coreano", ca: "Traduït del coreà", fr: "Traduit du coréen", de: "Aus dem Koreanischen übersetzt", it: "Tradotto dal coreano",
    pt: "Traduzido do coreano", zh: "译自韩语", ja: "韓国語から翻訳", ko: "한국어에서 번역됨", hi: "कोरियाई से अनुवादित",
    id: "Diterjemahkan dari bahasa Korea", tr: "Koreceden çevrildi", ru: "Переведено с корейского", vi: "Dịch từ tiếng Hàn", ar: "مترجم من الكورية",
  },
  "Translated from Hindi": {
    es: "Traducido del hindi", ca: "Traduït de l’hindi", fr: "Traduit de l’hindi", de: "Aus dem Hindi übersetzt", it: "Tradotto dall’hindi",
    pt: "Traduzido do hindi", zh: "译自印地语", ja: "ヒンディー語から翻訳", ko: "힌디어에서 번역됨", hi: "हिन्दी से अनुवादित",
    id: "Diterjemahkan dari bahasa Hindi", tr: "Hintçeden çevrildi", ru: "Переведено с хинди", vi: "Dịch từ tiếng Hindi", ar: "مترجم من الهندية",
  },
  "Translated from Indonesian": {
    es: "Traducido del indonesio", ca: "Traduït de l’indonesi", fr: "Traduit de l’indonésien", de: "Aus dem Indonesischen übersetzt", it: "Tradotto dall’indonesiano",
    pt: "Traduzido do indonésio", zh: "译自印度尼西亚语", ja: "インドネシア語から翻訳", ko: "인도네시아어에서 번역됨", hi: "इंडोनेशियाई से अनुवादित",
    id: "Diterjemahkan dari bahasa Indonesia", tr: "Endonezceden çevrildi", ru: "Переведено с индонезийского", vi: "Dịch từ tiếng Indonesia", ar: "مترجم من الإندونيسية",
  },
  "Translated from Turkish": {
    es: "Traducido del turco", ca: "Traduït del turc", fr: "Traduit du turc", de: "Aus dem Türkischen übersetzt", it: "Tradotto dal turco",
    pt: "Traduzido do turco", zh: "译自土耳其语", ja: "トルコ語から翻訳", ko: "튀르키예어에서 번역됨", hi: "तुर्की से अनुवादित",
    id: "Diterjemahkan dari bahasa Turki", tr: "Türkçeden çevrildi", ru: "Переведено с турецкого", vi: "Dịch từ tiếng Thổ Nhĩ Kỳ", ar: "مترجم من التركية",
  },
  "Translated from Russian": {
    es: "Traducido del ruso", ca: "Traduït del rus", fr: "Traduit du russe", de: "Aus dem Russischen übersetzt", it: "Tradotto dal russo",
    pt: "Traduzido do russo", zh: "译自俄语", ja: "ロシア語から翻訳", ko: "러시아어에서 번역됨", hi: "रूसी से अनुवादित",
    id: "Diterjemahkan dari bahasa Rusia", tr: "Rusçadan çevrildi", ru: "Переведено с русского", vi: "Dịch từ tiếng Nga", ar: "مترجم من الروسية",
  },
  "Translated from Vietnamese": {
    es: "Traducido del vietnamita", ca: "Traduït del vietnamita", fr: "Traduit du vietnamien", de: "Aus dem Vietnamesischen übersetzt", it: "Tradotto dal vietnamita",
    pt: "Traduzido do vietnamita", zh: "译自越南语", ja: "ベトナム語から翻訳", ko: "베트남어에서 번역됨", hi: "वियतनामी से अनुवादित",
    id: "Diterjemahkan dari bahasa Vietnam", tr: "Vietnamcadan çevrildi", ru: "Переведено с вьетнамского", vi: "Dịch từ tiếng Việt", ar: "مترجم من الفيتنامية",
  },
  "Translated from Arabic": {
    es: "Traducido del árabe", ca: "Traduït de l’àrab", fr: "Traduit de l’arabe", de: "Aus dem Arabischen übersetzt", it: "Tradotto dall’arabo",
    pt: "Traduzido do árabe", zh: "译自阿拉伯语", ja: "アラビア語から翻訳", ko: "아랍어에서 번역됨", hi: "अरबी से अनुवादित",
    id: "Diterjemahkan dari bahasa Arab", tr: "Arapçadan çevrildi", ru: "Переведено с арабского", vi: "Dịch từ tiếng Ả Rập", ar: "مترجم من العربية",
  },

  /* ---------- §4 · Invite someone to Chronic Friends ---------- */
  "Invite someone to Chronic Friends": {
    es: "Invita a alguien a Chronic Friends", ca: "Convida algú a Chronic Friends", fr: "Inviter quelqu’un sur Chronic Friends", de: "Jemanden zu Chronic Friends einladen", it: "Invita qualcuno su Chronic Friends",
    pt: "Convidar alguém para o Chronic Friends", zh: "邀请朋友加入 Chronic Friends", ja: "誰かを Chronic Friends に招待", ko: "지인을 Chronic Friends에 초대하기", hi: "किसी को Chronic Friends पर बुलाएँ",
    id: "Undang seseorang ke Chronic Friends", tr: "Birini Chronic Friends'e davet et", ru: "Пригласить кого-нибудь в Chronic Friends", vi: "Mời ai đó tham gia Chronic Friends", ar: "ادعُ شخصًا إلى Chronic Friends",
  },
  "They get a short message with the link to our website. The message says nothing about your health.": {
    es: "Le llega un mensaje corto con el enlace a nuestra web. El mensaje no dice nada de tu salud.",
    ca: "Li arriba un missatge curt amb l’enllaç al nostre web. El missatge no diu res de la teva salut.",
    fr: "La personne reçoit un court message avec le lien vers notre site. Ce message ne dit rien de votre santé.",
    de: "Die Person bekommt eine kurze Nachricht mit dem Link zu unserer Website. Über deine Gesundheit steht darin nichts.",
    it: "Riceve un breve messaggio con il link al nostro sito. Il messaggio non dice nulla sulla tua salute.",
    pt: "A pessoa recebe uma mensagem curta com o link do nosso site. A mensagem não diz nada sobre a tua saúde.",
    zh: "对方会收到一条附有我们网站链接的简短消息。消息里不会提到你的健康状况。",
    ja: "相手には、私たちのサイトへのリンクが入った短いメッセージが届きます。あなたの健康については何も書かれていません。",
    ko: "상대방은 우리 웹사이트 링크가 담긴 짧은 메시지를 받아요. 메시지에는 건강에 관한 내용이 전혀 담기지 않아요.",
    hi: "उन्हें हमारी वेबसाइट के लिंक वाला एक छोटा संदेश मिलेगा। संदेश में आपकी सेहत के बारे में कुछ भी नहीं होता।",
    id: "Mereka menerima pesan singkat berisi tautan ke situs kami. Pesan itu tidak menyebut apa pun tentang kesehatanmu.",
    tr: "Karşı taraf, web sitemizin bağlantısını içeren kısa bir mesaj alır. Mesajda sağlığınla ilgili hiçbir şey yoktur.",
    ru: "Человек получит короткое сообщение со ссылкой на наш сайт. О вашем здоровье в нём нет ни слова.",
    vi: "Người đó sẽ nhận một tin nhắn ngắn kèm đường dẫn tới trang web của chúng tôi. Tin nhắn không nói gì về sức khỏe của bạn.",
    ar: "ستصله رسالة قصيرة فيها رابط موقعنا، ولا تذكر الرسالة شيئًا عن صحتك.",
  },
  /* the message itself (CF_INVITE_MSG, invite.jsx) — {link} is the landing page, never translated */
  "I’d like to invite you to Chronic Friends, an app for people who live with a chronic illness: {link}": {
    es: "Te invito a Chronic Friends, una app para personas que viven con una enfermedad crónica: {link}",
    ca: "Et convido a Chronic Friends, una app per a persones que viuen amb una malaltia crònica: {link}",
    fr: "Je vous invite sur Chronic Friends, une appli pour les personnes qui vivent avec une maladie chronique : {link}",
    de: "Ich lade dich zu Chronic Friends ein, einer App für Menschen, die mit einer chronischen Krankheit leben: {link}",
    it: "Ti invito su Chronic Friends, un’app per chi vive con una malattia cronica: {link}",
    pt: "Convido-te para o Chronic Friends, uma app para pessoas que vivem com uma doença crónica: {link}",
    zh: "邀请你加入 Chronic Friends，一款为与慢性病共同生活的人打造的应用：{link}",
    ja: "Chronic Friends に招待します。慢性の病気とともに暮らす人のためのアプリです：{link}",
    ko: "Chronic Friends에 초대할게요. 만성 질환과 함께 살아가는 사람들을 위한 앱이에요: {link}",
    hi: "आपके लिए Chronic Friends का न्योता — पुरानी बीमारी के साथ जी रहे लोगों के लिए एक ऐप: {link}",
    id: "Aku mengundangmu ke Chronic Friends, aplikasi untuk orang-orang yang hidup dengan penyakit kronis: {link}",
    tr: "Seni Chronic Friends'e davet ediyorum; kronik bir hastalıkla yaşayan insanlar için bir uygulama: {link}",
    ru: "Приглашаю тебя в Chronic Friends — приложение для людей, которые живут с хроническим заболеванием: {link}",
    vi: "Mình mời bạn tham gia Chronic Friends, một ứng dụng dành cho những người đang sống chung với bệnh mạn tính: {link}",
    ar: "أدعوك إلى Chronic Friends، تطبيق للأشخاص الذين يعيشون مع مرض مزمن: {link}",
  },
  "Copy link": {
    es: "Copiar enlace", ca: "Copia l’enllaç", fr: "Copier le lien", de: "Link kopieren", it: "Copia link",
    pt: "Copiar link", zh: "复制链接", ja: "リンクをコピー", ko: "링크 복사", hi: "लिंक कॉपी करें",
    id: "Salin tautan", tr: "Bağlantıyı kopyala", ru: "Копировать ссылку", vi: "Sao chép liên kết", ar: "نسخ الرابط",
  },
  "Link copied": {
    es: "Enlace copiado", ca: "Enllaç copiat", fr: "Lien copié", de: "Link kopiert", it: "Link copiato",
    pt: "Link copiado", zh: "链接已复制", ja: "リンクをコピーしました", ko: "링크를 복사했어요", hi: "लिंक कॉपी हो गया",
    id: "Tautan disalin", tr: "Bağlantı kopyalandı", ru: "Ссылка скопирована", vi: "Đã sao chép liên kết", ar: "تم نسخ الرابط",
  },
  "Share…": {
    es: "Compartir…", ca: "Comparteix…", fr: "Partager…", de: "Teilen…", it: "Condividi…",
    pt: "Partilhar…", zh: "分享…", ja: "共有…", ko: "공유…", hi: "शेयर करें…",
    id: "Bagikan…", tr: "Paylaş…", ru: "Поделиться…", vi: "Chia sẻ…", ar: "مشاركة…",
  },
  "The link could not be copied. Press and hold it in the message above to copy it by hand.": {
    es: "No se ha podido copiar el enlace. Mantén el dedo sobre él en el mensaje de arriba para copiarlo a mano.",
    ca: "No s’ha pogut copiar l’enllaç. Mantén el dit a sobre al missatge de dalt per copiar-lo a mà.",
    fr: "Le lien n’a pas pu être copié. Appuyez longuement dessus dans le message ci-dessus pour le copier vous-même.",
    de: "Der Link konnte nicht kopiert werden. Halte ihn in der Nachricht oben gedrückt, um ihn von Hand zu kopieren.",
    it: "Non è stato possibile copiare il link. Tienilo premuto nel messaggio qui sopra per copiarlo a mano.",
    pt: "Não foi possível copiar o link. Mantém-no premido na mensagem acima para o copiares à mão.",
    zh: "链接未能复制。请在上方消息中长按链接，手动复制。",
    ja: "リンクをコピーできませんでした。上のメッセージでリンクを長押しして、手動でコピーしてください。",
    ko: "링크를 복사하지 못했어요. 위 메시지에서 링크를 길게 눌러 직접 복사해 주세요.",
    hi: "लिंक कॉपी नहीं हो सका। ऊपर के संदेश में उसे दबाकर रखें और खुद कॉपी करें।",
    id: "Tautan tidak bisa disalin. Tekan lama tautan di pesan di atas untuk menyalinnya sendiri.",
    tr: "Bağlantı kopyalanamadı. Kendin kopyalamak için yukarıdaki mesajda bağlantıya basılı tut.",
    ru: "Не удалось скопировать ссылку. Нажмите на неё в сообщении выше и удерживайте, чтобы скопировать вручную.",
    vi: "Không sao chép được liên kết. Hãy nhấn giữ liên kết trong tin nhắn ở trên để tự sao chép.",
    ar: "تعذّر نسخ الرابط. اضغط عليه مطولًا في الرسالة أعلاه لتنسخه بنفسك.",
  },
  };
  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = M[k];
    else Object.keys(M[k]).forEach(function (l) { if (!CF_UI_MAP[k][l]) CF_UI_MAP[k][l] = M[k][l]; });
  });
})();
