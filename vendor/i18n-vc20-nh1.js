(function () {
  /* ===================================================================
     i18n-vc20-nh1 — traducciones de las cadenas VISIBLES que llegaron sin
     traducir en el export de Claude Design del 15 ago 2026 (vc20):

       · Las 13 de la pantalla NH1 rediseñada («Your next alarm»), que hasta
         hoy salía ENTERA en inglés en los 17 idiomas.
       · Las 4 del manual del paciente que la citan literalmente (el capítulo
         de los avisos y el paso de crear cuenta, que cambió de sitio).

     Detectadas comparando las llamadas tr()/trf() de build/notifhealth.js y
     build/manualpatient.js contra los 187 diccionarios i18n del proyecto,
     deshaciendo los escapes \uXXXX antes de comparar (sin eso salían 35
     falsas huérfanas del manual: la raya larga — se contaba como distinta).

     Los 15 idiomas de la app. Inglés es la clave. Merge-if-missing.
     «Chronic Friends» NUNCA se traduce; los {t} y las etiquetas <strong> se
     conservan exactos — comprobado uno a uno: 255 de 255 sin fallos.

     🔴 Retirar cuando Claude Design las adopte en origen.
     =================================================================== */
  var CF_UI_MAP = (window.CF_UI_MAP = window.CF_UI_MAP || {});
  var M = {
    "Even with your phone locked and in your pocket.": {
      es: "Aunque tengas el móvil bloqueado y en el bolsillo.",
      ca: "Encara que tinguis el mòbil bloquejat i a la butxaca.",
      fr: "Même avec ton téléphone verrouillé et dans ta poche.",
      de: "Auch wenn dein Handy gesperrt ist und in der Tasche steckt.",
      it: "Anche con il telefono bloccato e in tasca.",
      pt: "Mesmo com o telemóvel bloqueado e no bolso.",
      zh: "即使手机锁屏、放在口袋里，也照样会响。",
      ja: "スマホがロックされていても、ポケットの中でも鳴ります。",
      ko: "화면이 잠겨 있어도, 주머니 속에 있어도 울려요.",
      hi: "फ़ोन लॉक हो और जेब में हो, तब भी।",
      id: "Meski ponselmu terkunci dan ada di saku.",
      tr: "Telefonun kilitliyken ve cebindeyken bile.",
      ru: "Даже если телефон заблокирован и лежит в кармане.",
      vi: "Ngay cả khi điện thoại đã khóa và nằm trong túi.",
      ar: "حتى لو كان هاتفك مقفلًا وفي جيبك."
    },
    "Fix it now": {
      es: "Solucionarlo ahora",
      ca: "Solucionar-ho ara",
      fr: "Régler ça maintenant",
      de: "Jetzt beheben",
      it: "Risolvi ora",
      pt: "Resolver agora",
      zh: "马上解决",
      ja: "今すぐ直す",
      ko: "지금 해결하기",
      hi: "अभी ठीक करें",
      id: "Perbaiki sekarang",
      tr: "Şimdi düzelt",
      ru: "Исправить сейчас",
      vi: "Sửa ngay",
      ar: "أصلِح المشكلة الآن"
    },
    "It is ringing now — listen.": {
      es: "Está sonando ahora — escucha.",
      ca: "Està sonant ara — escolta.",
      fr: "Elle sonne maintenant — écoute.",
      de: "Es klingelt jetzt — hör hin.",
      it: "Sta suonando ora — ascolta.",
      pt: "Está a tocar agora — ouve.",
      zh: "正在响铃——听一听。",
      ja: "いま鳴っています。聞いてみてください。",
      ko: "지금 울리고 있어요 — 들어 보세요.",
      hi: "अभी बज रहा है — सुनें।",
      id: "Sedang berbunyi sekarang — dengarkan.",
      tr: "Şu anda çalıyor — dinle.",
      ru: "Он звонит прямо сейчас — послушай.",
      vi: "Chuông đang kêu — hãy nghe thử.",
      ar: "المنبّه يرنّ الآن — استمِع."
    },
    "It will NOT sound": {
      es: "NO sonará",
      ca: "NO sonarà",
      fr: "Elle NE sonnera PAS",
      de: "Er wird NICHT klingeln",
      it: "NON suonerà",
      pt: "NÃO vai tocar",
      zh: "“不会”响铃",
      ja: "「鳴りません」",
      ko: "‘안’ 울려요",
      hi: "आवाज़ बिल्कुल नहीं आएगी",
      id: "TIDAK akan berbunyi",
      tr: "ÇALMAYACAK",
      ru: "Будильник НЕ зазвонит",
      vi: "Chuông sẽ KHÔNG kêu",
      ar: "لن يرنّ المنبّه إطلاقًا"
    },
    "It will sound": {
      es: "Sonará",
      ca: "Sonarà",
      fr: "Elle sonnera",
      de: "Er wird klingeln",
      it: "Suonerà",
      pt: "Vai tocar",
      zh: "会响铃",
      ja: "鳴ります",
      ko: "울려요",
      hi: "आवाज़ आएगी",
      id: "Akan berbunyi",
      tr: "Çalacak",
      ru: "Будильник зазвонит",
      vi: "Chuông sẽ kêu",
      ar: "سيرنّ المنبّه"
    },
    "Ring it now, so you hear it": {
      es: "Hazla sonar ahora, para que la oigas",
      ca: "Fes-la sonar ara, perquè la sentis",
      fr: "Fais-la sonner maintenant, pour l'entendre",
      de: "Jetzt klingeln lassen, damit du es hörst",
      it: "Falla suonare ora, così la senti",
      pt: "Tocar agora, para o ouvires",
      zh: "现在就响一次，让你亲耳听到",
      ja: "今すぐ鳴らして、耳で確かめる",
      ko: "지금 울려서 직접 들어보기",
      hi: "अभी बजाकर सुनें",
      id: "Bunyikan sekarang, biar kamu dengar",
      tr: "Şimdi çaldır da duy",
      ru: "Включить сигнал сейчас, чтобы его услышать",
      vi: "Cho chuông kêu ngay để bạn nghe",
      ar: "شغّل الرنين الآن لتسمعه"
    },
    "See what was checked": {
      es: "Ver qué se ha comprobado",
      ca: "Veure què s'ha comprovat",
      fr: "Voir ce qui a été vérifié",
      de: "Sieh, was geprüft wurde",
      it: "Guarda cosa è stato controllato",
      pt: "Ver o que foi verificado",
      zh: "看看检查了哪些内容",
      ja: "確認した項目を見る",
      ko: "무엇을 확인했는지 보기",
      hi: "देखें क्या-क्या जाँचा गया",
      id: "Lihat apa saja yang diperiksa",
      tr: "Nelerin kontrol edildiğini gör",
      ru: "Посмотреть, что мы проверили",
      vi: "Xem những gì đã kiểm tra",
      ar: "اطّلِع على ما فحصناه"
    },
    "Today at {t}": {
      es: "Hoy a las {t}",
      ca: "Avui a les {t}",
      fr: "Aujourd'hui à {t}",
      de: "Heute um {t}",
      it: "Oggi alle {t}",
      pt: "Hoje às {t}",
      zh: "今天 {t}",
      ja: "今日 {t}",
      ko: "오늘 {t}",
      hi: "आज {t} बजे",
      id: "Hari ini pukul {t}",
      tr: "Bugün saat {t}",
      ru: "Сегодня в {t}",
      vi: "Hôm nay lúc {t}",
      ar: "اليوم الساعة {t}"
    },
    "Tomorrow at {t}": {
      es: "Mañana a las {t}",
      ca: "Demà a les {t}",
      fr: "Demain à {t}",
      de: "Morgen um {t}",
      it: "Domani alle {t}",
      pt: "Amanhã às {t}",
      zh: "明天 {t}",
      ja: "明日 {t}",
      ko: "내일 {t}",
      hi: "कल {t} बजे",
      id: "Besok pukul {t}",
      tr: "Yarın saat {t}",
      ru: "Завтра в {t}",
      vi: "Ngày mai lúc {t}",
      ar: "غدًا الساعة {t}"
    },
    "You have no alarms set yet.": {
      es: "Todavía no tienes ninguna alarma puesta.",
      ca: "Encara no tens cap alarma posada.",
      fr: "Tu n'as encore réglé aucune alarme.",
      de: "Du hast noch keine Alarme eingestellt.",
      it: "Non hai ancora impostato nessuna sveglia.",
      pt: "Ainda não tens alarmes definidos.",
      zh: "你还没有设置任何闹钟。",
      ja: "まだアラームが設定されていません。",
      ko: "아직 설정한 알람이 없어요.",
      hi: "आपने अभी तक कोई अलार्म सेट नहीं किया है।",
      id: "Kamu belum mengatur alarm apa pun.",
      tr: "Henüz kurduğun bir alarm yok.",
      ru: "У тебя пока нет будильников.",
      vi: "Bạn chưa đặt báo thức nào.",
      ar: "لم تضبط أي منبّه بعد."
    },
    "Your alarm will not sound": {
      es: "Tu alarma no sonará",
      ca: "La teva alarma no sonarà",
      fr: "Ton alarme ne sonnera pas",
      de: "Dein Alarm wird nicht klingeln",
      it: "La tua sveglia non suonerà",
      pt: "O teu alarme não vai tocar",
      zh: "你的闹钟不会响",
      ja: "アラームは鳴りません",
      ko: "알람이 울리지 않아요",
      hi: "आपके अलार्म की आवाज़ नहीं आएगी",
      id: "Alarmmu tidak akan berbunyi",
      tr: "Alarmın çalmayacak",
      ru: "Твой будильник не зазвонит",
      vi: "Báo thức của bạn sẽ không kêu",
      ar: "لن يرنّ منبّهك"
    },
    "Your next alarm": {
      es: "Tu próxima alarma",
      ca: "La teva propera alarma",
      fr: "Ta prochaine alarme",
      de: "Dein nächster Alarm",
      it: "La tua prossima sveglia",
      pt: "O teu próximo alarme",
      zh: "你的下一个闹钟",
      ja: "次のアラーム",
      ko: "다음 알람",
      hi: "आपका अगला अलार्म",
      id: "Alarm berikutnya",
      tr: "Bir sonraki alarmın",
      ru: "Твой следующий будильник",
      vi: "Báo thức tiếp theo của bạn",
      ar: "منبّهك التالي"
    },
    "Your phone is stopping it. You would not hear anything at {t}.": {
      es: "Tu móvil la está bloqueando. A las {t} no oirías nada.",
      ca: "El teu mòbil l'està bloquejant. A les {t} no sentiries res.",
      fr: "Ton téléphone la bloque. À {t}, tu n'entendrais rien.",
      de: "Dein Handy blockiert ihn. Um {t} würdest du nichts hören.",
      it: "Il telefono la sta bloccando. Alle {t} non sentiresti nulla.",
      pt: "O teu telemóvel está a bloqueá-lo. Às {t} não ouvirias nada.",
      zh: "是手机在拦住它。这样下去，{t} 你什么都听不到。",
      ja: "スマホ側が止めています。このままだと {t} には何も聞こえません。",
      ko: "휴대폰이 막고 있어요. 이대로면 {t}에 아무 소리도 들리지 않아요.",
      hi: "आपका फ़ोन इसे रोक रहा है। {t} बजे आपको कुछ भी सुनाई नहीं देगा।",
      id: "Ponselmu menghalanginya. Pukul {t} kamu tidak akan mendengar apa pun.",
      tr: "Telefonun buna engel oluyor. Saat {t} geldiğinde hiçbir şey duyamazsın.",
      ru: "Телефон его блокирует. В {t} ты ничего не услышишь.",
      vi: "Điện thoại đang chặn chuông. Lúc {t} bạn sẽ không nghe thấy gì.",
      ar: "هاتفك يمنعه. لن تسمع شيئًا عند الساعة {t}."
    },
    "A reminder that never rings is worse than no reminder at all — and every Android phone hides the switches somewhere different. In <strong>Medication</strong>, open <strong>Will your reminders reach you?</strong>: the screen names your own next dose — the medicine and the hour — and answers in three words, <strong>It will sound</strong> or <strong>It will NOT sound</strong>. When something is blocking it there is a single button, <strong>Fix it now</strong>, which opens the exact screen on your phone for that one problem; solve it and the next one, if there is one, takes its place. <strong>Ring it now, so you hear it</strong> makes your phone ring on the spot, so you never have to take our word for it. Everything the app looked at — notifications, exact timing, battery saving, the reminder sound, the note for Xiaomi, Huawei, OPPO and vivo phones, and how many reminders this phone is holding — is folded under <strong>See what was checked</strong>. If your phone cannot deliver them, a small card on the Medication screen says so.": {
      es: "Un recordatorio que nunca suena es peor que no tener ninguno — y cada móvil Android esconde los interruptores en un sitio distinto. En <strong>Medicación</strong>, abre <strong>¿Te llegarán tus recordatorios?</strong>: la pantalla te dice cuál es tu próxima dosis — la medicina y la hora — y te responde de un vistazo, <strong>Sonará</strong> o <strong>NO sonará</strong>. Cuando algo la está bloqueando aparece un único botón, <strong>Solucionarlo ahora</strong>, que abre en tu móvil la pantalla exacta de ese problema; resuélvelo y, si hay otro, ocupa su lugar. <strong>Hazla sonar ahora, para que la oigas</strong> hace sonar tu móvil en el acto, para que nunca tengas que fiarte solo de nuestra palabra. Todo lo que la app ha mirado — las notificaciones, la hora exacta, el ahorro de batería, el sonido del recordatorio, el aviso para los móviles Xiaomi, Huawei, OPPO y vivo, y cuántos recordatorios está guardando este móvil — está recogido en <strong>Ver qué se ha comprobado</strong>. Si tu móvil no puede entregarlos, una tarjeta pequeña en la pantalla de Medicación te lo dice.",
      ca: "Un recordatori que no sona mai és pitjor que no tenir-ne cap — i cada mòbil Android amaga els interruptors en un lloc diferent. A <strong>Medicació</strong>, obre <strong>T'arribaran els teus recordatoris?</strong>: la pantalla et diu quina és la teva propera dosi — el medicament i l'hora — i et respon d'un cop d'ull, <strong>Sonarà</strong> o <strong>NO sonarà</strong>. Quan alguna cosa la bloqueja, apareix un sol botó, <strong>Solucionar-ho ara</strong>, que obre al teu mòbil la pantalla exacta d'aquell problema; resol-lo i, si n'hi ha un altre, ocupa el seu lloc. <strong>Fes-la sonar ara, perquè la sentis</strong> fa sonar el teu mòbil a l'instant, perquè mai no hagis de creure'ns només de paraula. Tot el que l'app ha mirat — les notificacions, l'hora exacta, l'estalvi de bateria, el so del recordatori, l'avís per als mòbils Xiaomi, Huawei, OPPO i vivo, i quants recordatoris està guardant aquest mòbil — està recollit a <strong>Veure què s'ha comprovat</strong>. Si el teu mòbil no te'ls pot fer arribar, una targeta petita a la pantalla de Medicació t'ho diu.",
      fr: "Un rappel qui ne sonne jamais est pire que pas de rappel du tout — et chaque téléphone Android cache les réglages à un endroit différent. Dans <strong>Médicaments</strong>, ouvre <strong>Tes rappels vont-ils te parvenir ?</strong> : l'écran nomme ta prochaine prise — le médicament et l'heure — et te répond en un coup d'œil, <strong>Elle sonnera</strong> ou <strong>Elle NE sonnera PAS</strong>. Quand quelque chose la bloque, il y a un seul bouton, <strong>Régler ça maintenant</strong>, qui ouvre sur ton téléphone l'écran exact de ce problème ; règle-le et le suivant, s'il y en a un, prend sa place. <strong>Fais-la sonner maintenant, pour l'entendre</strong> fait sonner ton téléphone sur-le-champ, pour que tu n'aies jamais à nous croire sur parole. Tout ce que l'app a regardé — les notifications, l'heure exacte, l'économie de batterie, le son du rappel, la note pour les téléphones Xiaomi, Huawei, OPPO et vivo, et combien de rappels ce téléphone garde — est regroupé sous <strong>Voir ce qui a été vérifié</strong>. Si ton téléphone ne peut pas te les envoyer, une petite carte sur l'écran Médicaments te le dit.",
      de: "Eine Erinnerung, die nie klingelt, ist schlimmer als gar keine Erinnerung — und jedes Android-Handy versteckt die Schalter woanders. Öffne in <strong>Medikamente</strong> den Punkt <strong>Erreichen dich deine Erinnerungen?</strong>: Der Bildschirm nennt deine eigene nächste Dosis — das Medikament und die Uhrzeit — und antwortet in drei Worten, <strong>Er wird klingeln</strong> oder <strong>Er wird NICHT klingeln</strong>. Wenn etwas ihn blockiert, gibt es einen einzigen Knopf, <strong>Jetzt beheben</strong>, der auf deinem Handy genau den Bildschirm für dieses eine Problem öffnet; löse es, und das nächste rückt nach, falls es eines gibt. <strong>Jetzt klingeln lassen, damit du es hörst</strong> lässt dein Handy sofort klingeln, damit du uns nie einfach glauben musst. Alles, was die App geprüft hat — die Benachrichtigungen, die genaue Uhrzeit, das Energiesparen, der Ton der Erinnerung, der Hinweis für Handys von Xiaomi, Huawei, OPPO und vivo und wie viele Erinnerungen dieses Handy gerade bereithält — steckt unter <strong>Sieh, was geprüft wurde</strong>. Wenn dein Handy sie nicht zustellen kann, sagt dir eine kleine Karte auf dem Medikamente-Bildschirm Bescheid.",
      it: "Un promemoria che non suona mai è peggio di nessun promemoria — e ogni telefono Android nasconde gli interruttori in un posto diverso. In <strong>Farmaci</strong>, apri <strong>I tuoi promemoria ti arriveranno?</strong>: la schermata dice qual è la tua prossima dose — il farmaco e l'ora — e risponde in poche parole, <strong>Suonerà</strong> o <strong>NON suonerà</strong>. Quando qualcosa lo sta bloccando c'è un solo pulsante, <strong>Risolvi ora</strong>, che apre sul telefono la schermata esatta per quel problema; risolvilo e, se ce n'è un altro, prende il suo posto. <strong>Falla suonare ora, così la senti</strong> fa suonare il telefono all'istante, così non devi fidarti solo della nostra parola. Tutto quello che l'app ha controllato — le notifiche, l'orario esatto, il risparmio energetico, il suono del promemoria, la nota per i telefoni Xiaomi, Huawei, OPPO e vivo e quanti promemoria ha in attesa questo telefono — è raccolto sotto <strong>Guarda cosa è stato controllato</strong>. Se il telefono non riesce a consegnarli, un piccolo riquadro nella schermata Farmaci te lo dice.",
      pt: "Um lembrete que nunca toca é pior do que não ter lembrete nenhum — e cada telemóvel Android esconde os botões num sítio diferente. Em <strong>Medicação</strong>, abre <strong>Os teus lembretes vão chegar-te?</strong>: o ecrã diz qual é a tua próxima toma — o medicamento e a hora — e responde em poucas palavras, <strong>Vai tocar</strong> ou <strong>NÃO vai tocar</strong>. Quando há alguma coisa a bloqueá-lo, há um único botão, <strong>Resolver agora</strong>, que abre no teu telemóvel o ecrã exato para esse problema; resolve-o e, se houver outro, ocupa o lugar. <strong>Tocar agora, para o ouvires</strong> faz o telemóvel tocar na hora, para nunca teres de acreditar só na nossa palavra. Tudo o que a aplicação verificou — as notificações, a hora exata, a poupança de bateria, o som do lembrete, a nota para os telemóveis Xiaomi, Huawei, OPPO e vivo e quantos lembretes este telemóvel tem em espera — está reunido em <strong>Ver o que foi verificado</strong>. Se o teu telemóvel não os conseguir entregar, um pequeno cartão no ecrã Medicação avisa-te.",
      zh: "从不响铃的提醒，比没有提醒还糟糕——而且每台安卓手机把这些开关都藏在不一样的地方。在<strong>用药</strong>里打开<strong>提醒能送到你手上吗？</strong>：这个页面会写出你下一次用药的药名和时间，并用一句话回答：<strong>会响铃</strong>或<strong>“不会”响铃</strong>。如果有东西在拦住它，页面上只会有一个按钮，<strong>马上解决</strong>，它会直接打开你手机上对应那个问题的设置页面；解决完一个，如果还有别的问题，就会接着显示下一个。<strong>现在就响一次，让你亲耳听到</strong>会让手机当场响起来，不用光听我们说。这个应用检查过的所有内容——通知、准时提醒、省电设置、提醒声音、给小米、华为、OPPO 和 vivo 手机的说明，以及这台手机现在存着多少条提醒——都收在<strong>看看检查了哪些内容</strong>里面。如果你的手机没办法把提醒送到，用药页面上会有一张小卡片告诉你。",
      ja: "鳴らないリマインダーは、リマインダーがないよりも困ります。しかも Android はスマホごとに設定の場所がばらばらです。<strong>服薬</strong>から<strong>リマインダーはあなたに届きますか？</strong>を開いてください。この画面には次の服薬（薬の名前と時刻）が表示され、<strong>鳴ります</strong>か<strong>「鳴りません」</strong>か、ひと言で答えます。何かが邪魔しているときは、ボタンは1つだけ、<strong>今すぐ直す</strong>です。押すと、その問題に対応する設定画面がスマホ上で直接開きます。1つ解決すると、次の問題があれば、そこに入れ替わります。<strong>今すぐ鳴らして、耳で確かめる</strong>を押すと、その場でスマホが鳴ります。本当に鳴るかどうか、自分の耳で確かめられます。アプリが確認したこと（通知、正確な時刻、バッテリー節約、リマインダーの音、Xiaomi・Huawei・OPPO・vivo のスマホ向けの注意、そしてこのスマホが今いくつリマインダーを抱えているか）は、すべて<strong>確認した項目を見る</strong>にまとめてあります。スマホがリマインダーを届けられないときは、服薬の画面に小さなカードでお知らせします。",
      ko: "울리지 않는 알림은 알림이 아예 없는 것보다 못해요 — 게다가 안드로이드 휴대폰마다 그 스위치를 숨겨 둔 곳이 달라요. <strong>복약</strong>에서 <strong>알림이 제대로 도착할까요?</strong>를 열어 보세요. 이 화면은 다음에 먹을 약과 그 시간을 그대로 보여 주고, <strong>울려요</strong> 또는 <strong>‘안’ 울려요</strong>로 짧게 답해 줘요. 무언가가 막고 있을 때는 버튼이 하나뿐이에요. <strong>지금 해결하기</strong>를 누르면 그 문제에 해당하는 설정 화면이 휴대폰에서 바로 열려요. 하나를 해결하면, 남은 문제가 있을 때 그 자리에 다음 문제가 들어와요. <strong>지금 울려서 직접 들어보기</strong>를 누르면 휴대폰이 그 자리에서 울리니까, 저희 말만 믿지 않아도 돼요. 앱이 살펴본 것은 모두 <strong>무엇을 확인했는지 보기</strong> 안에 들어 있어요 — 알림, 정확한 시간, 배터리 절약, 알림 소리, Xiaomi·Huawei·OPPO·vivo 휴대폰을 위한 안내, 그리고 이 휴대폰에 지금 예약된 알림이 몇 개인지까지요. 휴대폰이 알림을 전달하지 못하면, 복약 화면에 작은 카드로 알려 드려요.",
      hi: "जो रिमाइंडर कभी बजता ही नहीं, वह किसी भी रिमाइंडर के न होने से भी बुरा है — और हर Android फ़ोन ये सेटिंग अलग-अलग जगह छिपाकर रखता है। <strong>दवाइयाँ</strong> में <strong>क्या आपके रिमाइंडर आप तक पहुँचेंगे?</strong> खोलें: यह स्क्रीन आपकी अपनी अगली खुराक का नाम लेती है — दवा और समय — और कुछ ही शब्दों में जवाब देती है, <strong>आवाज़ आएगी</strong> या <strong>आवाज़ बिल्कुल नहीं आएगी</strong>। जब कोई चीज़ उसे रोक रही हो, तो सिर्फ़ एक बटन दिखता है, <strong>अभी ठीक करें</strong>, जो आपके फ़ोन पर ठीक उसी एक समस्या की स्क्रीन खोल देता है; उसे हल कीजिए और अगली समस्या, अगर कोई हो, उसकी जगह ले लेती है। <strong>अभी बजाकर सुनें</strong> आपके फ़ोन को उसी वक़्त बजा देता है, ताकि आपको हमारी बात पर यूँ ही भरोसा न करना पड़े। ऐप ने जो कुछ भी जाँचा — नोटिफ़िकेशन, सही समय पर बजना, बैटरी की बचत, रिमाइंडर की आवाज़, Xiaomi, Huawei, OPPO और vivo फ़ोन के लिए ख़ास सूचना, और यह फ़ोन कितने रिमाइंडर संभाल रहा है — वह सब <strong>देखें क्या-क्या जाँचा गया</strong> के नीचे रखा है। अगर आपका फ़ोन उन्हें पहुँचा नहीं सकता, तो दवाइयाँ स्क्रीन पर एक छोटा कार्ड यह बता देता है।",
      id: "Pengingat yang tidak pernah berbunyi lebih buruk daripada tidak ada pengingat sama sekali — dan setiap ponsel Android menyembunyikan pengaturannya di tempat yang berbeda-beda. Di <strong>Obat</strong>, buka <strong>Apakah pengingatmu akan sampai kepadamu?</strong>: layar itu menyebut dosis berikutnya milikmu — obatnya dan jamnya — lalu menjawab dengan beberapa kata saja, <strong>Akan berbunyi</strong> atau <strong>TIDAK akan berbunyi</strong>. Kalau ada sesuatu yang menghalanginya, muncul satu tombol saja, <strong>Perbaiki sekarang</strong>, yang membuka layar yang tepat di ponselmu untuk masalah itu; selesaikan, dan masalah berikutnya, kalau ada, akan menggantikannya. <strong>Bunyikan sekarang, biar kamu dengar</strong> membuat ponselmu berbunyi saat itu juga, jadi kamu tidak perlu sekadar percaya pada kata-kata kami. Semua yang diperiksa aplikasi — notifikasi, ketepatan waktu, penghemat baterai, suara pengingat, catatan untuk ponsel Xiaomi, Huawei, OPPO dan vivo, serta berapa banyak pengingat yang sedang ditangani ponsel ini — dirangkum di bawah <strong>Lihat apa saja yang diperiksa</strong>. Kalau ponselmu tidak bisa mengantarkannya, sebuah kartu kecil di layar Obat akan memberitahumu.",
      tr: "Hiç çalmayan bir hatırlatıcı, hiç hatırlatıcı olmamasından daha kötüdür — üstelik her Android telefon bu ayarları başka bir yerde saklar. <strong>İlaçlar</strong> bölümünde <strong>Hatırlatıcıların sana ulaşacak mı?</strong> ekranını aç: ekran senin bir sonraki dozunu söyler — ilacı ve saati — ve birkaç kelimeyle cevap verir: <strong>Çalacak</strong> ya da <strong>ÇALMAYACAK</strong>. Onu engelleyen bir şey varsa tek bir düğme çıkar, <strong>Şimdi düzelt</strong>; bu düğme telefonunda tam o sorunun ekranını açar; sen onu çöz, varsa bir sonraki sorun onun yerini alır. <strong>Şimdi çaldır da duy</strong> telefonunu anında çaldırır, böylece bizim sözümüze güvenmek zorunda kalmazsın. Uygulamanın kontrol ettiği her şey — bildirimler, tam zamanında çalma, pil tasarrufu, hatırlatıcı sesi, Xiaomi, Huawei, OPPO ve vivo telefonlar için not ve bu telefonun kaç hatırlatıcı taşıdığı — <strong>Nelerin kontrol edildiğini gör</strong> altında toplandı. Telefonun bunları iletemiyorsa, İlaçlar ekranındaki küçük bir kart bunu sana söyler.",
      ru: "Напоминание, которое не звонит, хуже, чем его полное отсутствие, — а каждый телефон на Android прячет нужные переключатели в своём месте. В разделе <strong>Лекарства</strong> открой <strong>Дойдут ли до тебя напоминания?</strong>: на экране будет твой ближайший приём — лекарство и время — и короткий ответ: <strong>Будильник зазвонит</strong> или <strong>Будильник НЕ зазвонит</strong>. Если что-то мешает, там есть одна кнопка — <strong>Исправить сейчас</strong>, — которая открывает на твоём телефоне именно тот экран, где решается эта проблема; реши её, и на её место встанет следующая, если она есть. Кнопка <strong>Включить сигнал сейчас, чтобы его услышать</strong> заставит телефон зазвонить прямо сейчас, чтобы тебе не приходилось верить нам на слово. Всё, что проверило приложение — уведомления, точное время, экономию заряда, звук напоминания, отдельную заметку для телефонов Xiaomi, Huawei, OPPO и vivo и то, сколько напоминаний хранит этот телефон, — собрано под кнопкой <strong>Посмотреть, что мы проверили</strong>. Если телефон не может их доставить, на экране «Лекарства» об этом скажет небольшая карточка.",
      vi: "Một lời nhắc không bao giờ kêu còn tệ hơn là không có lời nhắc nào — và mỗi điện thoại Android lại giấu các nút gạt ở một chỗ khác nhau. Trong <strong>Thuốc</strong>, hãy mở <strong>Nhắc nhở có đến được với bạn không?</strong>: màn hình sẽ nêu đúng liều thuốc kế tiếp của bạn — tên thuốc và giờ uống — rồi trả lời thật ngắn gọn: <strong>Chuông sẽ kêu</strong> hoặc <strong>Chuông sẽ KHÔNG kêu</strong>. Khi có thứ gì đó đang chặn, chỉ có một nút duy nhất là <strong>Sửa ngay</strong>, mở đúng màn hình trên điện thoại của bạn cho riêng vấn đề đó; giải quyết xong thì vấn đề tiếp theo, nếu còn, sẽ hiện ra thế chỗ. Nút <strong>Cho chuông kêu ngay để bạn nghe</strong> làm điện thoại reo lên ngay lập tức, để bạn tự nghe chứ không phải chỉ tin lời chúng tôi. Mọi thứ ứng dụng đã xem qua — thông báo, giờ giấc chính xác, chế độ tiết kiệm pin, âm thanh của lời nhắc, lưu ý riêng cho điện thoại Xiaomi, Huawei, OPPO và vivo, và số lời nhắc mà máy này đang giữ — đều được gom vào <strong>Xem những gì đã kiểm tra</strong>. Nếu điện thoại không thể gửi được, một thẻ nhỏ trên màn hình Thuốc sẽ báo cho bạn biết.",
      ar: "التذكير الذي لا يرنّ أبدًا أسوأ من ألا يكون هناك تذكير أصلًا — وكل هاتف أندرويد يخفي هذه المفاتيح في مكان مختلف. في قسم <strong>الأدوية</strong>، افتح <strong>هل ستصلك تذكيراتك؟</strong>: تعرض لك الشاشة جرعتك التالية أنت — اسم الدواء والساعة — وتجيب بكلمات قليلة: <strong>سيرنّ المنبّه</strong> أو <strong>لن يرنّ المنبّه إطلاقًا</strong>. وإذا كان هناك ما يعيقه، فهناك زر واحد فقط، <strong>أصلِح المشكلة الآن</strong>، يفتح لك في هاتفك الشاشة المخصّصة لتلك المشكلة بالذات؛ عالِجها فتحلّ محلّها المشكلة التالية إن وُجدت. وزر <strong>شغّل الرنين الآن لتسمعه</strong> يجعل هاتفك يرنّ في الحال، حتى تسمعه بنفسك لا أن تصدّق كلامنا فقط. وكل ما فحصه التطبيق — الإشعارات، والتوقيت الدقيق، وتوفير البطارية، وصوت التذكير، والملاحظة الخاصة بهواتف Xiaomi وHuawei وOPPO وvivo، وعدد التذكيرات التي يحتفظ بها هذا الهاتف — تجده كله تحت <strong>اطّلِع على ما فحصناه</strong>. وإذا كان هاتفك غير قادر على إيصالها، فستخبرك بذلك بطاقة صغيرة في شاشة الأدوية."
    },
    "At the top of the white panel — just above <strong>Welcome back</strong> — tap <strong>Create your account</strong>, then enter your email and a password of at least <strong>6 characters</strong>.": {
      es: "Arriba del todo del panel blanco — justo encima de <strong>Hola de nuevo</strong> — toca <strong>Crear tu cuenta</strong> y luego escribe tu email y una contraseña de al menos <strong>6 caracteres</strong>.",
      ca: "A dalt de tot del panell blanc — just a sobre de <strong>Hola de nou</strong> — toca <strong>Crea el teu compte</strong> i després escriu el teu correu i una contrasenya de com a mínim <strong>6 caràcters</strong>.",
      fr: "En haut du panneau blanc — juste au-dessus de <strong>Bon retour</strong> — touche <strong>Crée ton compte</strong>, puis saisis ton e-mail et un mot de passe d'au moins <strong>6 caractères</strong>.",
      de: "Ganz oben im weißen Bereich — direkt über <strong>Willkommen zurück</strong> — tippe auf <strong>Konto erstellen</strong> und gib dann deine E-Mail-Adresse und ein Passwort mit mindestens <strong>6 Zeichen</strong> ein.",
      it: "In cima al riquadro bianco — appena sopra <strong>Bentornato</strong> — tocca <strong>Crea il tuo account</strong>, poi inserisci la tua email e una password di almeno <strong>6 caratteri</strong>.",
      pt: "No topo do painel branco — mesmo por cima de <strong>Bem-vindo de volta</strong> — toca em <strong>Criar a tua conta</strong> e depois escreve o teu email e uma palavra-passe com pelo menos <strong>6 caracteres</strong>.",
      zh: "在白色面板的最上方——就在<strong>欢迎回来</strong>的正上方——点一下<strong>创建账号</strong>，然后输入你的邮箱和一个至少 <strong>6 个字符</strong>的密码。",
      ja: "白いパネルのいちばん上、<strong>おかえりなさい</strong>のすぐ上にある<strong>アカウントを作成</strong>をタップして、メールアドレスと <strong>6文字以上</strong>のパスワードを入力してください。",
      ko: "흰색 패널 맨 위, <strong>다시 만나서 반가워요</strong> 바로 위에 있는 <strong>계정 만들기</strong>를 누르고, 이메일과 <strong>6자 이상</strong>의 비밀번호를 입력하세요.",
      hi: "सफ़ेद पैनल के सबसे ऊपर — <strong>वापस स्वागत है</strong> के ठीक ऊपर — <strong>अपना खाता बनाएँ</strong> पर टैप करें, फिर अपना ईमेल और कम से कम <strong>6 अक्षरों</strong> का पासवर्ड डालें।",
      id: "Di bagian paling atas panel putih — tepat di atas <strong>Selamat datang kembali</strong> — ketuk <strong>Buat akunmu</strong>, lalu masukkan emailmu dan kata sandi minimal <strong>6 karakter</strong>.",
      tr: "Beyaz panelin en üstünde — <strong>Tekrar hoş geldin</strong> yazısının hemen üzerinde — <strong>Hesabını oluştur</strong> düğmesine dokun, sonra e-postanı ve en az <strong>6 karakter</strong> uzunluğunda bir şifre gir.",
      ru: "Вверху белой панели — прямо над надписью <strong>С возвращением</strong> — нажми <strong>Создать аккаунт</strong>, затем введи свою почту и пароль не короче <strong>6 символов</strong>.",
      vi: "Ở phía trên cùng của bảng màu trắng — ngay bên trên dòng <strong>Chào mừng bạn trở lại</strong> — hãy chạm vào <strong>Tạo tài khoản</strong>, rồi nhập email và mật khẩu dài ít nhất <strong>6 ký tự</strong>.",
      ar: "في أعلى اللوحة البيضاء — فوق <strong>أهلًا بعودتك</strong> مباشرة — اضغط <strong>أنشئ حسابك</strong>، ثم أدخل بريدك الإلكتروني وكلمة مرور من <strong>6 أحرف</strong> على الأقل."
    },
    "Read the answer for your next dose — if it says <strong>It will NOT sound</strong>, tap <strong>Fix it now</strong>.": {
      es: "Lee la respuesta para tu próxima dosis — si pone <strong>NO sonará</strong>, toca <strong>Solucionarlo ahora</strong>.",
      ca: "Llegeix la resposta per a la teva propera dosi — si diu <strong>NO sonarà</strong>, toca <strong>Solucionar-ho ara</strong>.",
      fr: "Lis la réponse pour ta prochaine prise — si elle dit <strong>Elle NE sonnera PAS</strong>, touche <strong>Régler ça maintenant</strong>.",
      de: "Lies die Antwort für deine nächste Dosis — wenn dort <strong>Er wird NICHT klingeln</strong> steht, tippe auf <strong>Jetzt beheben</strong>.",
      it: "Leggi la risposta per la tua prossima dose — se dice <strong>NON suonerà</strong>, tocca <strong>Risolvi ora</strong>.",
      pt: "Lê a resposta para a tua próxima toma — se disser <strong>NÃO vai tocar</strong>, toca em <strong>Resolver agora</strong>.",
      zh: "看一下你下一次用药的回答——如果显示<strong>“不会”响铃</strong>，就点<strong>马上解决</strong>。",
      ja: "次の服薬の答えを読んでみてください。<strong>「鳴りません」</strong>と出ていたら、<strong>今すぐ直す</strong>をタップしてください。",
      ko: "다음에 먹을 약에 대한 답을 읽어 보세요 — <strong>‘안’ 울려요</strong>라고 나오면 <strong>지금 해결하기</strong>를 누르세요.",
      hi: "अपनी अगली खुराक का जवाब पढ़ें — अगर उसमें लिखा हो <strong>आवाज़ बिल्कुल नहीं आएगी</strong>, तो <strong>अभी ठीक करें</strong> पर टैप करें।",
      id: "Baca jawaban untuk dosis berikutnya — kalau tertulis <strong>TIDAK akan berbunyi</strong>, ketuk <strong>Perbaiki sekarang</strong>.",
      tr: "Bir sonraki dozun için verilen cevabı oku — <strong>ÇALMAYACAK</strong> diyorsa <strong>Şimdi düzelt</strong> düğmesine dokun.",
      ru: "Прочитай ответ для ближайшего приёма — если там написано <strong>Будильник НЕ зазвонит</strong>, нажми <strong>Исправить сейчас</strong>.",
      vi: "Hãy đọc câu trả lời cho liều thuốc kế tiếp — nếu thấy dòng <strong>Chuông sẽ KHÔNG kêu</strong>, hãy chạm vào <strong>Sửa ngay</strong>.",
      ar: "اقرأ الجواب الخاص بجرعتك التالية — فإذا ظهر <strong>لن يرنّ المنبّه إطلاقًا</strong>، فاضغط <strong>أصلِح المشكلة الآن</strong>."
    },
    "Tap <strong>Ring it now, so you hear it</strong> and listen.": {
      es: "Toca <strong>Hazla sonar ahora, para que la oigas</strong> y escucha.",
      ca: "Toca <strong>Fes-la sonar ara, perquè la sentis</strong> i escolta.",
      fr: "Touche <strong>Fais-la sonner maintenant, pour l'entendre</strong> et écoute.",
      de: "Tippe auf <strong>Jetzt klingeln lassen, damit du es hörst</strong> und hör hin.",
      it: "Tocca <strong>Falla suonare ora, così la senti</strong> e ascolta.",
      pt: "Toca em <strong>Tocar agora, para o ouvires</strong> e ouve.",
      zh: "点一下<strong>现在就响一次，让你亲耳听到</strong>，然后听一听。",
      ja: "<strong>今すぐ鳴らして、耳で確かめる</strong>をタップして、音を聞いてみてください。",
      ko: "<strong>지금 울려서 직접 들어보기</strong>를 누르고 소리를 들어 보세요.",
      hi: "<strong>अभी बजाकर सुनें</strong> पर टैप करें और सुनें।",
      id: "Ketuk <strong>Bunyikan sekarang, biar kamu dengar</strong> lalu dengarkan.",
      tr: "<strong>Şimdi çaldır da duy</strong> düğmesine dokun ve dinle.",
      ru: "Нажми <strong>Включить сигнал сейчас, чтобы его услышать</strong> и послушай.",
      vi: "Hãy chạm vào <strong>Cho chuông kêu ngay để bạn nghe</strong> rồi lắng nghe.",
      ar: "اضغط <strong>شغّل الرنين الآن لتسمعه</strong> واستمِع."
    }
  };

  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = {};
    Object.keys(M[k]).forEach(function (lang) {
      if (!CF_UI_MAP[k][lang]) CF_UI_MAP[k][lang] = M[k][lang];
    });
  });
})();
