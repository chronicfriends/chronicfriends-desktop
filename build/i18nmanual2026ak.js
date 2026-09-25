/* ===================================================================
   i18nmanual2026ak — the manual strings of ZEN MUSIC (TOOL1,
   18 Sep 2026): one new topic in the Meditation chapter
   (manualpatient.jsx), because the manual ships with the app.

   🔴 Every button name inside a <strong> tag is the word the LIVE
   dictionary resolves for that language, never a second translation:
     Zen Music · Stop after {n} min · Playing · Credits
                   → i18nzenmusic.jsx (this cycle)
     Meditation  → i18n-flare3.jsx (es Meditación · ca Meditació ·
                   fr Méditation · de Meditation · it Meditazione ·
                   pt Meditação · zh 冥想 · ja 瞑想 · ko 명상 ·
                   hi ध्यान · id Meditasi · tr Meditasyon ·
                   ru Медитация · vi Thiền · ar التأمّل)
   The four track titles and the four channel names are NOT here and
   never will be: they are the attribution of somebody else's work.

   The title of the topic reuses the «Zen Music» key of i18nzenmusic,
   so it is not defined again. No `shot:` — no capture of the screen
   exists yet.

   All 15 non-English languages. Merge-if-missing.
   Loaded after build/i18nmanual2026aj.js.
   =================================================================== */
(function () {
  if (typeof CF_UI_MAP === 'undefined') return;
  var M = {
  "Inside Meditation, <strong>Zen Music</strong> holds four long pieces — from 20 to 37 minutes — to rest, meditate or fall asleep to. Press play on one and a player appears at the foot of the screen: pause it, drag the line to move through the piece, or stop it. Only one piece ever sounds at a time.": {
    es: "Dentro de Meditación, <strong>Música zen</strong> guarda cuatro piezas largas —de 20 a 37 minutos— para descansar, meditar o quedarte dormido. Dale al play a una y abajo aparece el reproductor: pausa, arrastra la línea para avanzar por la pieza, o para. Solo suena una pieza a la vez.",
    ca: "Dins de Meditació, <strong>Música zen</strong> guarda quatre peces llargues —de 20 a 37 minuts— per descansar, meditar o adormir-te. Prem play en una i a baix apareix el reproductor: pausa, arrossega la línia per avançar per la peça, o atura-la. Només sona una peça alhora.",
    fr: "Dans Méditation, <strong>Musique zen</strong> réunit quatre longues pièces — de 20 à 37 minutes — pour vous reposer, méditer ou vous endormir. Lancez-en une et le lecteur apparaît en bas : pause, glissez la ligne pour avancer dans la pièce, ou arrêtez. Une seule pièce sonne à la fois.",
    de: "In Meditation liegen unter <strong>Zen-Musik</strong> vier lange Stücke — von 20 bis 37 Minuten — zum Ausruhen, Meditieren oder Einschlafen. Starte eines, und unten erscheint der Player: pausieren, die Linie ziehen, um im Stück vorzuspulen, oder stoppen. Es läuft immer nur ein Stück.",
    it: "Dentro Meditazione, <strong>Musica zen</strong> raccoglie quattro brani lunghi — da 20 a 37 minuti — per riposare, meditare o addormentarti. Avvia uno e in basso compare il lettore: metti in pausa, trascina la linea per spostarti nel brano, o ferma. Suona un brano alla volta.",
    pt: "Dentro de Meditação, <strong>Música zen</strong> guarda quatro peças longas — de 20 a 37 minutos — para descansar, meditar ou adormecer. Carrega em reproduzir numa delas e em baixo aparece o leitor: pausa, arrasta a linha para avançar na peça, ou para. Só toca uma peça de cada vez.",
    zh: "在冥想里，<strong>禅意音乐</strong>收了四段长音乐——20 到 37 分钟——用来休息、冥想或入睡。播放其中一段，屏幕底部会出现播放器：暂停、拖动进度线，或停止。同一时间只会响一段。",
    ja: "瞑想の中の<strong>禅の音楽</strong>には、休む・瞑想する・眠るための長い4曲（20〜37分）があります。1曲を再生すると画面の下にプレーヤーが出ます。一時停止、線をドラッグして曲の中を移動、停止。鳴るのはいつも1曲だけです。",
    ko: "명상 안의 <strong>젠 음악</strong>에는 쉬거나 명상하거나 잠들기 위한 긴 네 곡(20~37분)이 있습니다. 한 곡을 재생하면 화면 아래에 플레이어가 나타납니다: 일시정지, 선을 끌어 곡 안에서 이동, 정지. 한 번에 한 곡만 재생됩니다.",
    hi: "ध्यान के अंदर <strong>ज़ेन संगीत</strong> में चार लंबी धुनें हैं — 20 से 37 मिनट तक — आराम करने, ध्यान लगाने या सो जाने के लिए। किसी एक को चलाएँ और नीचे प्लेयर आ जाता है: रोकें, लाइन खींचकर धुन में आगे-पीछे जाएँ, या बंद करें। एक बार में एक ही धुन बजती है।",
    id: "Di dalam Meditasi, <strong>Musik zen</strong> berisi empat lagu panjang — 20 sampai 37 menit — untuk beristirahat, bermeditasi, atau tertidur. Putar salah satunya dan pemutar muncul di bawah layar: jeda, geser garisnya untuk berpindah di dalam lagu, atau berhenti. Hanya satu lagu berbunyi pada satu waktu.",
    tr: "Meditasyon içinde <strong>Zen müziği</strong> dört uzun parça tutar — 20 ile 37 dakika arası — dinlenmek, meditasyon yapmak ya da uykuya dalmak için. Birini çal, ekranın altında oynatıcı belirir: duraklat, parçanın içinde ilerlemek için çizgiyi sürükle ya da durdur. Aynı anda tek bir parça çalar.",
    ru: "Внутри Медитации в разделе <strong>Дзен-музыка</strong> лежат четыре длинные композиции — от 20 до 37 минут — чтобы отдохнуть, помедитировать или уснуть. Запустите одну, и внизу появится плеер: пауза, перетащите линию, чтобы двигаться по композиции, или остановите. Одновременно звучит только одна.",
    vi: "Trong Thiền, <strong>Nhạc thiền</strong> có bốn bản nhạc dài — từ 20 đến 37 phút — để nghỉ ngơi, thiền hoặc chìm vào giấc ngủ. Bấm phát một bản và trình phát hiện ra ở cuối màn hình: tạm dừng, kéo thanh để di chuyển trong bản nhạc, hoặc dừng hẳn. Mỗi lúc chỉ có một bản phát.",
    ar: "داخل التأمّل، تضم <strong>موسيقى زِن</strong> أربع مقطوعات طويلة — من 20 إلى 37 دقيقة — للراحة أو التأمل أو النوم. شغّل واحدة ويظهر المشغّل أسفل الشاشة: إيقاف مؤقت، اسحب الخط للتنقّل داخل المقطوعة، أو إيقاف. لا تُشغَّل سوى مقطوعة واحدة في كل مرة.",
  },
  "Long music for sleeping or meditating usually means leaving the app for another one, full of ads and of whatever plays next. Here there are four quiet pieces, chosen and credited, with a timer that takes them away once you are asleep.": {
    es: "Poner música larga para dormir o meditar suele significar salir de la app y abrir otra, llena de anuncios y de lo que suene después. Aquí hay cuatro piezas tranquilas, elegidas y con sus créditos, y un temporizador que las retira cuando ya estás dormido.",
    ca: "Posar música llarga per dormir o meditar sol voler dir sortir de l’app i obrir-ne una altra, plena d’anuncis i del que soni després. Aquí hi ha quatre peces tranquil·les, triades i amb els seus crèdits, i un temporitzador que les retira quan ja dorms.",
    fr: "Écouter de longues musiques pour dormir ou méditer oblige d’ordinaire à quitter l’application pour une autre, pleine de publicités et de ce qui suivra. Ici, quatre pièces calmes, choisies et créditées, avec un minuteur qui les retire une fois que vous dormez.",
    de: "Lange Musik zum Schlafen oder Meditieren heißt sonst: die App verlassen und eine andere öffnen, voller Werbung und von dem, was danach kommt. Hier sind es vier ruhige Stücke, ausgewählt und mit Credits, und ein Timer, der sie wegnimmt, wenn du schon schläfst.",
    it: "Mettere musica lunga per dormire o meditare di solito significa uscire dall’app e aprirne un’altra, piena di pubblicità e di quello che parte dopo. Qui ci sono quattro brani tranquilli, scelti e con i loro crediti, e un timer che li porta via quando ormai dormi.",
    pt: "Pôr música longa para dormir ou meditar costuma significar sair da app e abrir outra, cheia de anúncios e do que toca a seguir. Aqui há quatro peças calmas, escolhidas e com os seus créditos, e um temporizador que as retira quando já estás a dormir.",
    zh: "想放长一点的音乐来睡觉或冥想，通常得离开这个应用，去打开另一个满是广告、还会自动接着播下一首的。这里只有四段安静的音乐，挑选过、注明了作者，还有一个在你睡着后把它们收走的定时器。",
    ja: "眠るため・瞑想するための長い音楽は、たいていこのアプリを離れて別のアプリを開くことになります。広告だらけで、そのあと何が流れるかも分かりません。ここにあるのは静かな4曲だけ。選ばれ、作者が明記され、眠ったころに音を引き取るタイマーもあります。",
    ko: "잠들거나 명상하려고 긴 음악을 틀려면 보통 이 앱을 나가 다른 앱을 열어야 합니다. 광고가 가득하고, 다음에 무엇이 나올지도 모르죠. 여기에는 고르고 출처를 밝힌 조용한 네 곡과, 잠든 뒤 음악을 거둬 가는 타이머가 있습니다.",
    hi: "सोने या ध्यान के लिए लंबा संगीत लगाने का मतलब आमतौर पर ऐप से निकलकर कोई दूसरी ऐप खोलना होता है — विज्ञापनों से भरी, और उसके बाद जो भी बजे। यहाँ चार शांत धुनें हैं, चुनी हुई और श्रेय के साथ, और एक टाइमर जो आपके सो जाने पर उन्हें हटा देता है।",
    id: "Memutar musik panjang untuk tidur atau bermeditasi biasanya berarti keluar dari aplikasi ini dan membuka yang lain, penuh iklan dan apa pun yang diputar berikutnya. Di sini ada empat lagu tenang, dipilih dan dicantumkan penciptanya, dengan timer yang menyingkirkannya setelah kamu tertidur.",
    tr: "Uyumak ya da meditasyon yapmak için uzun müzik açmak genelde uygulamadan çıkıp bir başkasını açmak demektir: reklam dolu ve sonrasında ne çalacağı belirsiz. Burada seçilmiş ve künyesi verilmiş dört sakin parça var, bir de sen uyuduktan sonra onları kaldıran bir zamanlayıcı.",
    ru: "Включить длинную музыку для сна или медитации обычно значит выйти из приложения и открыть другое — с рекламой и с тем, что заиграет следом. Здесь четыре спокойные композиции, выбранные и с указанием авторов, и таймер, который убирает их, когда вы уже спите.",
    vi: "Muốn nghe nhạc dài để ngủ hay thiền thì thường phải rời ứng dụng này và mở một ứng dụng khác, đầy quảng cáo và bài kế tiếp tự phát. Ở đây chỉ có bốn bản nhạc yên tĩnh, được chọn và ghi công, cùng một hẹn giờ mang chúng đi khi bạn đã ngủ.",
    ar: "تشغيل موسيقى طويلة للنوم أو التأمل يعني عادةً مغادرة التطبيق وفتح آخر، مليء بالإعلانات وبما سيأتي بعده. هنا أربع مقطوعات هادئة، مختارة ومنسوبة لأصحابها، ومؤقّت يزيحها بعد أن تنام.",
  },
  "Open <strong>Meditation</strong> on Home and tap <strong>Zen Music</strong>, the first of the kits.": {
    es: "Abre <strong>Meditación</strong> en Inicio y toca <strong>Música zen</strong>, el primero de los kits.",
    ca: "Obre <strong>Meditació</strong> a l’Inici i toca <strong>Música zen</strong>, el primer dels kits.",
    fr: "Ouvrez <strong>Méditation</strong> sur l’accueil et touchez <strong>Musique zen</strong>, le premier des kits.",
    de: "Öffne <strong>Meditation</strong> auf Home und tippe <strong>Zen-Musik</strong> an, den ersten der Kits.",
    it: "Apri <strong>Meditazione</strong> nella Home e tocca <strong>Musica zen</strong>, il primo dei kit.",
    pt: "Abre <strong>Meditação</strong> no Início e toca em <strong>Música zen</strong>, o primeiro dos kits.",
    zh: "在首页打开<strong>冥想</strong>，点第一个套装<strong>禅意音乐</strong>。",
    ja: "ホームで<strong>瞑想</strong>を開き、キットの最初にある<strong>禅の音楽</strong>をタップ。",
    ko: "홈에서 <strong>명상</strong>을 열고 키트의 첫 번째인 <strong>젠 음악</strong>을 누르세요.",
    hi: "होम पर <strong>ध्यान</strong> खोलें और किट में सबसे पहले वाले <strong>ज़ेन संगीत</strong> पर टैप करें।",
    id: "Buka <strong>Meditasi</strong> di Beranda dan ketuk <strong>Musik zen</strong>, kit yang pertama.",
    tr: "Ana ekranda <strong>Meditasyon</strong>'u aç ve kitlerin ilki olan <strong>Zen müziği</strong>ne dokun.",
    ru: "Откройте <strong>Медитация</strong> на главном экране и нажмите <strong>Дзен-музыка</strong> — первый из наборов.",
    vi: "Mở <strong>Thiền</strong> ở Trang chính và chạm <strong>Nhạc thiền</strong>, bộ đầu tiên.",
    ar: "افتح <strong>التأمّل</strong> من الرئيسية واضغط <strong>موسيقى زِن</strong>، أول المجموعات.",
  },
  "Press play on the piece you fancy — it streams from the internet, so it needs a connection.": {
    es: "Dale al play a la pieza que te apetezca: se reproduce desde internet, así que necesita conexión.",
    ca: "Prem play a la peça que et vingui de gust: es reprodueix des d’internet, així que necessita connexió.",
    fr: "Lancez la pièce qui vous tente — elle est diffusée depuis internet, il faut donc une connexion.",
    de: "Starte das Stück, auf das du Lust hast — es kommt aus dem Internet, also braucht es eine Verbindung.",
    it: "Avvia il brano che ti va: arriva da internet, quindi serve la connessione.",
    pt: "Carrega em reproduzir na peça que te apetecer — vem da internet, por isso precisa de ligação.",
    zh: "点开你想听的那一段——它来自网络，所以需要联网。",
    ja: "聴きたい曲を再生します。インターネットから流れるので、接続が必要です。",
    ko: "듣고 싶은 곡을 재생하세요 — 인터넷에서 재생되므로 연결이 필요합니다.",
    hi: "जो धुन अच्छी लगे उसे चलाएँ — यह इंटरनेट से चलती है, इसलिए कनेक्शन चाहिए।",
    id: "Putar lagu yang kamu suka — lagunya diputar dari internet, jadi perlu koneksi.",
    tr: "Canının istediği parçayı çal — internetten çalındığı için bağlantı gerekir.",
    ru: "Запустите ту композицию, которая вам по душе, — она звучит из интернета, поэтому нужно соединение.",
    vi: "Bấm phát bản bạn thích — nhạc phát từ internet nên cần có kết nối.",
    ar: "شغّل المقطوعة التي تعجبك — تُشغَّل من الإنترنت، لذا تحتاج إلى اتصال.",
  },
  "To fall asleep with it, choose <strong>Stop after 15 min</strong>, 30 or 60: the music fades away on its own. Tap the same button again to cancel it.": {
    es: "Para dormirte con ella, elige <strong>Parar a los 15 min</strong>, 30 o 60: la música se va apagando sola. Toca el mismo botón otra vez para cancelarlo.",
    ca: "Per adormir-t’hi, tria <strong>Aturar als 15 min</strong>, 30 o 60: la música s’apaga sola. Toca el mateix botó un altre cop per cancel·lar-ho.",
    fr: "Pour vous endormir avec, choisissez <strong>Arrêter après 15 min</strong>, 30 ou 60 : la musique s’éteint toute seule. Touchez le même bouton pour annuler.",
    de: "Zum Einschlafen wähle <strong>Nach 15 Min. stoppen</strong>, 30 oder 60: die Musik blendet von selbst aus. Zum Abbrechen dieselbe Taste noch einmal antippen.",
    it: "Per addormentarti, scegli <strong>Ferma dopo 15 min</strong>, 30 o 60: la musica sfuma da sola. Tocca di nuovo lo stesso pulsante per annullare.",
    pt: "Para adormeceres com ela, escolhe <strong>Parar após 15 min</strong>, 30 ou 60: a música desvanece sozinha. Toca no mesmo botão outra vez para cancelar.",
    zh: "想听着入睡，就选<strong>15 分钟后停止</strong>、30 或 60：音乐会自己淡出。再点一次同一个按钮就取消。",
    ja: "聴きながら眠るなら<strong>15分で停止</strong>・30・60を選びます。音楽はひとりでにフェードアウトします。同じボタンをもう一度押せば取り消せます。",
    ko: "들으며 잠들고 싶다면 <strong>15분 후 정지</strong>, 30, 60 중에서 고르세요: 음악이 알아서 서서히 사라집니다. 같은 버튼을 다시 누르면 취소됩니다.",
    hi: "इसके साथ सोना हो तो <strong>15 मिनट बाद रोकें</strong>, 30 या 60 चुनें: संगीत अपने आप धीमा होकर बंद हो जाता है। रद्द करने के लिए वही बटन दोबारा टैप करें।",
    id: "Untuk tertidur bersamanya, pilih <strong>Berhenti setelah 15 mnt</strong>, 30 atau 60: musiknya memudar sendiri. Ketuk tombol yang sama lagi untuk membatalkan.",
    tr: "Onunla uykuya dalmak için <strong>15 dk sonra dur</strong>, 30 ya da 60'ı seç: müzik kendiliğinden kısılarak biter. İptal için aynı düğmeye tekrar dokun.",
    ru: "Чтобы уснуть под неё, выберите <strong>Остановить через 15 мин</strong>, 30 или 60: музыка сама затихнет. Нажмите ту же кнопку ещё раз, чтобы отменить.",
    vi: "Để ngủ cùng nó, chọn <strong>Dừng sau 15 phút</strong>, 30 hoặc 60: nhạc sẽ tự nhỏ dần rồi tắt. Chạm lại đúng nút đó để huỷ.",
    ar: "لتنام معها، اختر <strong>التوقّف بعد 15 دقيقة</strong> أو 30 أو 60: تخفت الموسيقى وحدها. اضغط الزر نفسه مرة أخرى للإلغاء.",
  },
  "Leave the room or lock the phone and the music keeps playing; the <strong>Meditation</strong> card on Home then says <strong>Playing</strong> to take you back to it.": {
    es: "Sal de la sala o bloquea el teléfono y la música sigue; la tarjeta <strong>Meditación</strong> de Inicio dice entonces <strong>Sonando</strong> para llevarte de vuelta.",
    ca: "Surt de la sala o bloqueja el telèfon i la música continua; la targeta <strong>Meditació</strong> de l’Inici diu llavors <strong>Sonant</strong> per tornar-hi.",
    fr: "Quittez la salle ou verrouillez le téléphone : la musique continue, et la carte <strong>Méditation</strong> de l’accueil affiche <strong>En lecture</strong> pour y revenir.",
    de: "Verlasse den Raum oder sperre das Handy — die Musik läuft weiter, und die Karte <strong>Meditation</strong> auf Home sagt dann <strong>Läuft</strong>, um dich zurückzubringen.",
    it: "Esci dalla sala o blocca il telefono: la musica continua, e la scheda <strong>Meditazione</strong> nella Home dice <strong>In riproduzione</strong> per riportarti lì.",
    pt: "Sai da sala ou bloqueia o telemóvel e a música continua; o cartão <strong>Meditação</strong> no Início passa a dizer <strong>A tocar</strong> para te levar de volta.",
    zh: "离开这个房间或锁上手机，音乐照样继续；首页的<strong>冥想</strong>卡片会显示<strong>正在播放</strong>，点它就能回来。",
    ja: "部屋を出ても、画面をロックしても音楽は続きます。ホームの<strong>瞑想</strong>カードが<strong>再生中</strong>と表示し、そこから戻れます。",
    ko: "방을 나가거나 휴대폰을 잠가도 음악은 계속됩니다. 홈의 <strong>명상</strong> 카드가 <strong>재생 중</strong>이라고 알려 주며 다시 데려다줍니다.",
    hi: "कमरा छोड़ दें या फ़ोन लॉक कर दें, संगीत चलता रहता है; होम पर <strong>ध्यान</strong> कार्ड तब <strong>चल रहा है</strong> दिखाता है और वापस ले जाता है।",
    id: "Keluar dari ruangan atau kunci ponsel, musiknya tetap jalan; kartu <strong>Meditasi</strong> di Beranda lalu bertuliskan <strong>Sedang diputar</strong> untuk membawamu kembali.",
    tr: "Odadan çık ya da telefonu kilitle, müzik devam eder; Ana ekrandaki <strong>Meditasyon</strong> kartı o sırada <strong>Çalıyor</strong> der ve seni geri götürür.",
    ru: "Выйдите из комнаты или заблокируйте телефон — музыка продолжает играть, а карточка <strong>Медитация</strong> на главном экране показывает <strong>Играет</strong> и возвращает вас к ней.",
    vi: "Rời khỏi phòng hay khoá màn hình thì nhạc vẫn chạy; thẻ <strong>Thiền</strong> ở Trang chính khi đó ghi <strong>Đang phát</strong> để đưa bạn quay lại.",
    ar: "اخرج من الغرفة أو أقفل الهاتف وتستمر الموسيقى؛ عندها تقول بطاقة <strong>التأمّل</strong> في الرئيسية <strong>قيد التشغيل</strong> لتعيدك إليها.",
  },
  "The four pieces are other people’s work, shared under a Creative Commons licence: <strong>Credits</strong>, under the list, names every author and links to the original video.": {
    es: "Las cuatro piezas son trabajo de otras personas, compartido con licencia Creative Commons: <strong>Créditos</strong>, debajo de la lista, nombra a cada autor y enlaza al vídeo original.",
    ca: "Les quatre peces són treball d’altres persones, compartit amb llicència Creative Commons: <strong>Crèdits</strong>, sota la llista, anomena cada autor i enllaça al vídeo original.",
    fr: "Les quatre pièces sont l’œuvre d’autres personnes, partagée sous licence Creative Commons : <strong>Crédits</strong>, sous la liste, nomme chaque auteur et renvoie à la vidéo d’origine.",
    de: "Die vier Stücke stammen von anderen Menschen und stehen unter einer Creative-Commons-Lizenz: <strong>Credits</strong> unter der Liste nennt jeden Urheber und verlinkt das Originalvideo.",
    it: "I quattro brani sono lavoro di altre persone, condiviso con licenza Creative Commons: <strong>Crediti</strong>, sotto l’elenco, nomina ogni autore e rimanda al video originale.",
    pt: "As quatro peças são trabalho de outras pessoas, partilhado com licença Creative Commons: <strong>Créditos</strong>, por baixo da lista, nomeia cada autor e liga ao vídeo original.",
    zh: "这四段音乐是别人的作品，以 Creative Commons 许可分享：列表下方的<strong>致谢</strong>写出每位作者，并链接到原视频。",
    ja: "4曲はほかの人の作品で、Creative Commons ライセンスのもとで共有されています。リストの下の<strong>クレジット</strong>が作者を挙げ、元の動画にリンクしています。",
    ko: "네 곡은 다른 사람들의 작품이며 Creative Commons 라이선스로 공유된 것입니다. 목록 아래의 <strong>크레딧</strong>이 작가를 밝히고 원본 영상으로 연결됩니다.",
    hi: "ये चारों धुनें दूसरों का काम हैं, जो Creative Commons लाइसेंस के तहत साझा की गई हैं: सूची के नीचे <strong>श्रेय</strong> हर रचनाकार का नाम देता है और मूल वीडियो से जोड़ता है।",
    id: "Keempat lagu itu karya orang lain, dibagikan dengan lisensi Creative Commons: <strong>Kredit</strong> di bawah daftar menyebut setiap penciptanya dan menautkan video aslinya.",
    tr: "Dört parça başkalarının eseridir ve Creative Commons lisansıyla paylaşılmıştır: listenin altındaki <strong>Künye</strong> her yaratıcının adını verir ve orijinal videoya bağlanır.",
    ru: "Четыре композиции — работа других людей, опубликованная по лицензии Creative Commons: раздел <strong>Авторы</strong> под списком называет каждого автора и ведёт к исходному видео.",
    vi: "Bốn bản nhạc là tác phẩm của người khác, chia sẻ theo giấy phép Creative Commons: mục <strong>Ghi công</strong> dưới danh sách nêu tên từng tác giả và dẫn tới video gốc.",
    ar: "المقطوعات الأربع من عمل أشخاص آخرين، مشاركة برخصة Creative Commons: قسم <strong>المصادر</strong> أسفل القائمة يذكر كل مؤلف ويربط بالفيديو الأصلي.",
  },
  };
  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = M[k];
    else Object.keys(M[k]).forEach(function (l) { if (!CF_UI_MAP[k][l]) CF_UI_MAP[k][l] = M[k][l]; });
  });
})();
