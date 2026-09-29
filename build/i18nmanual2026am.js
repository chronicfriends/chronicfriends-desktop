/* ===================================================================
   i18nmanual2026am — the manual strings of CICLO 1.0.7f (28 Sep 2026),
   because the manual ships with the app (the MANUAL-SYNC RULE):
     · §2 «A flare you log yourself» gains a tip: the areas follow the
       conditions you chose, and a saved day keeps the areas it holds.
     · §3 a new Community topic, «Read a post in your language». CICLO 1.0.7g
       (29 Sep 2026): its tip now says the PHONE translates (no server, the
       text never leaves it), rewritten in its own slot; the topic itself is
       only shown where window.CFPostTr exists (manualpatient.jsx).
     · §4 a new Community topic, «Invite someone who is not here yet».
   (§1, the catalogue without its dose line, was never in the manual.)

   🔴 Every label inside a <strong> tag is the word the LIVE dictionary
   resolves for that language, never a second translation:
     Settings › My Health                     → i18nmanual2026o (ru in the
                                                prepositional: «в Настройках»)
     Recent Chats                             → i18n4 · i18n8-17
     Translate · See original · Translating… · Invite someone to Chronic
     Friends · Copy link · Share…             → i18nciclo107f (this cycle)
     Chronic Friends · WhatsApp               → names, the same everywhere
   A suffix that a language hangs on a button name stays OUTSIDE the tag
   (tr «Son Sohbetler'in», ko «WhatsApp으로»), and ru says «под кнопкой
   <strong>Недавние чаты</strong>» so the name keeps its own case.
   No figure anywhere (§9b of audit/zenmusic-test.html): «the app's
   languages», never a count. No `shot:` — no capture exists yet.

   All 15 non-English languages. Merge-if-missing.
   Loaded after build/i18nmanual2026al.js.
   =================================================================== */
(function () {
  if (typeof CF_UI_MAP === 'undefined') return;
  var M = {
  /* ---------- §2 · the tip of «A flare you log yourself» ---------- */
  "The areas it offers follow the conditions you chose, which you can change in <strong>Settings › My Health</strong>. A day you already saved keeps the areas you marked, even if your conditions change later.": {
    es: "Las zonas que te ofrece siguen las condiciones que elegiste, que puedes cambiar en <strong>Ajustes › Mi salud</strong>. Un día que ya guardaste conserva las zonas que marcaste, aunque tus condiciones cambien después.",
    ca: "Les zones que t’ofereix segueixen les condicions que vas triar, que pots canviar a <strong>Configuració › La meva salut</strong>. Un dia que ja vas desar conserva les zones que hi vas marcar, encara que després les teves condicions canviïn.",
    fr: "Les zones proposées suivent les maladies que vous avez choisies, modifiables dans <strong>Réglages › Ma santé</strong>. Un jour déjà enregistré garde les zones que vous y avez cochées, même si vos maladies changent ensuite.",
    de: "Welche Bereiche angeboten werden, richtet sich nach den Erkrankungen, die du gewählt hast — ändern kannst du sie unter <strong>Einstellungen › Meine Gesundheit</strong>. Ein bereits gespeicherter Tag behält die markierten Bereiche, auch wenn sich deine Erkrankungen später ändern.",
    it: "Le zone proposte seguono le condizioni che hai scelto, che puoi cambiare in <strong>Impostazioni › La mia salute</strong>. Un giorno già salvato conserva le zone che avevi segnato, anche se in seguito le tue condizioni cambiano.",
    pt: "As zonas que aparecem seguem as condições que escolheste, que podes mudar em <strong>Definições › A minha saúde</strong>. Um dia que já guardaste mantém as zonas que marcaste, mesmo que as tuas condições mudem depois.",
    zh: "这里列出的部位会跟随你选择的慢性病，你可以在<strong>设置 › 我的健康</strong>里更改。已经保存的日子会保留你当时标记的部位，即使之后你的慢性病有变化。",
    ja: "ここに出てくる部位は、あなたが選んだ持病に合わせて変わります。持病は<strong>設定 › 私の健康</strong>で変更できます。すでに保存した日は、あとで持病が変わっても、そのとき選んだ部位をそのまま残します。",
    ko: "여기에 나오는 부위는 선택한 질환에 따라 달라지며, 질환은 <strong>설정 › 내 건강</strong>에서 바꿀 수 있어요. 이미 저장한 날은 나중에 질환이 바뀌어도 그때 표시한 부위를 그대로 간직해요.",
    hi: "यहाँ दिखने वाले हिस्से आपकी चुनी हुई स्थितियों के अनुसार होते हैं, जिन्हें आप <strong>सेटिंग्स › मेरा स्वास्थ्य</strong> में बदल सकते हैं। जो दिन आप पहले सहेज चुके हैं, उसमें आपके चिह्नित हिस्से बने रहते हैं, भले ही बाद में आपकी स्थितियाँ बदल जाएँ।",
    id: "Bagian yang ditawarkan mengikuti kondisi yang Anda pilih, yang bisa diubah di <strong>Pengaturan › Kesehatan Saya</strong>. Hari yang sudah Anda simpan tetap menyimpan bagian yang Anda tandai, meskipun kondisi Anda berubah kemudian.",
    tr: "Sunulan bölgeler seçtiğin rahatsızlıklara göre belirlenir; bunları <strong>Ayarlar › Sağlığım</strong> bölümünden değiştirebilirsin. Önceden kaydettiğin bir gün, rahatsızlıkların sonradan değişse bile işaretlediğin bölgeleri korur.",
    ru: "Области, которые предлагаются, зависят от выбранных вами состояний — их можно изменить в <strong>Настройках › Моё здоровье</strong>. Уже записанный день оставляет отмеченные вами области, даже если ваши состояния потом изменятся.",
    vi: "Các vùng hiện ra sẽ theo những bệnh bạn đã chọn, và bạn có thể đổi chúng trong <strong>Cài đặt › Sức khỏe của tôi</strong>. Một ngày bạn đã lưu vẫn giữ những vùng bạn đã đánh dấu, kể cả khi sau này bệnh của bạn thay đổi.",
    ar: "تتبع المناطق المعروضة الحالات التي اخترتها، ويمكنك تغييرها من <strong>الإعدادات › صحتي</strong>. واليوم الذي حفظته من قبل يحتفظ بالمناطق التي حددتها، حتى لو تغيّرت حالاتك لاحقًا.",
  },

  /* ---------- §3 · «Read a post in your language» ---------- */
  "Read a post in your language": {
    es: "Leer una publicación en tu idioma", ca: "Llegir una publicació en la teva llengua", fr: "Lire une publication dans votre langue",
    de: "Einen Beitrag in deiner Sprache lesen", it: "Leggere un post nella tua lingua", pt: "Ler uma publicação na tua língua",
    zh: "用你的语言阅读帖子", ja: "投稿を自分の言語で読む", ko: "게시물을 내 언어로 읽기", hi: "पोस्ट को अपनी भाषा में पढ़ें",
    id: "Membaca postingan dalam bahasa Anda", tr: "Bir gönderiyi kendi dilinde oku", ru: "Читать публикацию на своём языке",
    vi: "Đọc bài đăng bằng ngôn ngữ của bạn", ar: "اقرأ المنشور بلغتك",
  },
  "Under each post, <strong>Translate</strong> lists the app’s languages, each under its own name, with yours first. Pick one and the title and the text of that post change into it right there, with a small line that says which language it was written in; <strong>See original</strong> brings back the words exactly as they were written. It works the same way in the Tools room.": {
    es: "Debajo de cada publicación, <strong>Traducir</strong> muestra los idiomas de la app, cada uno con su propio nombre y el tuyo primero. Elige uno y el título y el texto de esa publicación cambian a ese idioma ahí mismo, con una línea pequeña que dice en qué idioma se escribió; <strong>Ver original</strong> devuelve las palabras tal como se escribieron. Funciona igual en la Sala de herramientas.",
    ca: "A sota de cada publicació, <strong>Tradueix</strong> mostra les llengües de l’app, cadascuna amb el seu propi nom i la teva primer. Tria’n una i el títol i el text d’aquella publicació hi canvien allà mateix, amb una línia petita que diu en quina llengua es va escriure; <strong>Mostra l’original</strong> torna les paraules tal com es van escriure. Funciona igual a la Sala d’eines.",
    fr: "Sous chaque publication, <strong>Traduire</strong> affiche les langues de l’appli, chacune sous son propre nom, la vôtre en premier. Choisissez-en une : le titre et le texte de la publication passent dans cette langue sur place, avec une petite ligne qui indique dans quelle langue elle a été écrite ; <strong>Voir l’original</strong> ramène les mots tels qu’ils ont été écrits. Cela fonctionne de la même façon dans le Salon des outils.",
    de: "Unter jedem Beitrag zeigt <strong>Übersetzen</strong> die Sprachen der App, jede unter ihrem eigenen Namen, deine zuerst. Wähle eine aus, und Titel und Text des Beitrags wechseln direkt an Ort und Stelle in diese Sprache, mit einer kleinen Zeile, die sagt, in welcher Sprache er geschrieben wurde; <strong>Original anzeigen</strong> bringt die Worte genau so zurück, wie sie geschrieben wurden. Im Werkzeugraum funktioniert es genauso.",
    it: "Sotto ogni post, <strong>Traduci</strong> mostra le lingue dell’app, ognuna con il suo nome, la tua per prima. Scegline una e il titolo e il testo di quel post passano in quella lingua lì dove sono, con una piccola riga che dice in che lingua è stato scritto; <strong>Vedi originale</strong> riporta le parole esattamente come sono state scritte. Funziona allo stesso modo nella Sala degli strumenti.",
    pt: "Por baixo de cada publicação, <strong>Traduzir</strong> mostra as línguas da app, cada uma com o seu próprio nome e a tua primeiro. Escolhe uma e o título e o texto dessa publicação mudam para ela ali mesmo, com uma pequena linha que diz em que língua foi escrita; <strong>Ver original</strong> devolve as palavras tal como foram escritas. Funciona da mesma forma na Sala das ferramentas.",
    zh: "每篇帖子下方，<strong>翻译</strong>会列出本应用的所有语言，每种都用它自己的名字，你的语言排在最前。选一种，这篇帖子的标题和正文就会当场换成那种语言，并有一行小字说明原文是用哪种语言写的；<strong>查看原文</strong>会让文字恢复成原本写下的样子。在工具讨论区里也是一样。",
    ja: "各投稿の下にある<strong>翻訳</strong>を押すと、アプリの言語がそれぞれの言語自身の名前で並び、あなたの言語が先頭に来ます。ひとつ選ぶと、その投稿のタイトルと本文がその場でその言語に切り替わり、もとは何語で書かれたかを示す小さな一行が添えられます。<strong>原文を表示</strong>で、書かれたとおりの言葉に戻ります。ツールの部屋でも同じように使えます。",
    ko: "각 게시물 아래의 <strong>번역</strong>을 누르면 앱의 언어들이 각자의 이름으로 나오고, 내 언어가 맨 앞에 와요. 하나를 고르면 그 게시물의 제목과 본문이 그 자리에서 그 언어로 바뀌고, 원래 어떤 언어로 쓰였는지 알려 주는 작은 줄이 함께 나와요. <strong>원문 보기</strong>를 누르면 쓰인 그대로의 글로 돌아가요. 도구의 방에서도 똑같이 쓸 수 있어요.",
    hi: "हर पोस्ट के नीचे <strong>अनुवाद करें</strong> ऐप की भाषाएँ दिखाता है, हर भाषा अपने ही नाम से, और आपकी भाषा सबसे पहले। कोई एक चुनें और उस पोस्ट का शीर्षक और लेख वहीं उस भाषा में बदल जाते हैं, साथ में एक छोटी पंक्ति बताती है कि वह किस भाषा में लिखी गई थी; <strong>मूल देखें</strong> शब्दों को ठीक वैसे ही लौटा देता है जैसे वे लिखे गए थे। उपकरण कक्ष में भी यह इसी तरह काम करता है।",
    id: "Di bawah setiap postingan, <strong>Terjemahkan</strong> menampilkan bahasa-bahasa aplikasi, masing-masing dengan namanya sendiri, dan bahasa Anda paling atas. Pilih satu, maka judul dan isi postingan itu langsung berganti ke bahasa tersebut di tempat, dengan satu baris kecil yang menyebut dalam bahasa apa postingan itu ditulis; <strong>Lihat asli</strong> mengembalikan kata-katanya persis seperti ditulis. Di Ruang alat pun sama.",
    tr: "Her gönderinin altında <strong>Çevir</strong>, uygulamanın dillerini her birini kendi adıyla ve seninkini en başta göstererek listeler. Birini seç; o gönderinin başlığı ve metni hemen oracıkta o dile geçer, yanında da gönderinin hangi dilde yazıldığını söyleyen küçük bir satır çıkar. <strong>Orijinali gör</strong>, sözcükleri tam yazıldıkları gibi geri getirir. Araçlar odasında da aynı şekilde çalışır.",
    ru: "Под каждой публикацией кнопка <strong>Перевести</strong> показывает языки приложения — каждый под своим собственным названием, ваш первым. Выберите один, и заголовок и текст публикации тут же сменятся на этот язык, а маленькая строка скажет, на каком языке она была написана; <strong>Показать оригинал</strong> вернёт слова в точности такими, какими их написали. В Комнате инструментов всё работает так же.",
    vi: "Dưới mỗi bài đăng, <strong>Dịch</strong> liệt kê các ngôn ngữ của ứng dụng, mỗi ngôn ngữ mang tên riêng của nó, ngôn ngữ của bạn đứng đầu. Chọn một, tiêu đề và nội dung bài đăng sẽ đổi sang ngôn ngữ đó ngay tại chỗ, kèm một dòng nhỏ cho biết bài được viết bằng ngôn ngữ nào; <strong>Xem bản gốc</strong> đưa chữ trở lại đúng như khi được viết. Trong Phòng công cụ cũng vậy.",
    ar: "تحت كل منشور، يعرض زر <strong>ترجمة</strong> لغات التطبيق، كل لغة باسمها الخاص، ولغتك أولًا. اختر واحدة فيتحوّل عنوان المنشور ونصه إليها في المكان نفسه، مع سطر صغير يقول بأي لغة كُتب؛ ويعيد <strong>عرض الأصل</strong> الكلمات كما كُتبت تمامًا. ويعمل ذلك بالطريقة نفسها في غرفة الأدوات.",
  },
  "The people here write in many languages. A post you cannot read is a voice you cannot hear, so any post can be read in yours without leaving the feed.": {
    es: "Aquí la gente escribe en muchos idiomas. Una publicación que no puedes leer es una voz que no puedes oír, así que cualquier publicación se puede leer en el tuyo sin salir del muro.",
    ca: "Aquí la gent escriu en moltes llengües. Una publicació que no pots llegir és una veu que no pots sentir, així que qualsevol publicació es pot llegir en la teva sense sortir del mur.",
    fr: "Ici, les gens écrivent dans beaucoup de langues. Une publication que vous ne pouvez pas lire est une voix que vous n’entendez pas : chaque publication peut donc se lire dans la vôtre, sans quitter le mur.",
    de: "Hier schreiben die Menschen in vielen Sprachen. Ein Beitrag, den du nicht lesen kannst, ist eine Stimme, die du nicht hörst — deshalb lässt sich jeder Beitrag in deiner Sprache lesen, ohne die Pinnwand zu verlassen.",
    it: "Qui le persone scrivono in tante lingue. Un post che non riesci a leggere è una voce che non riesci a sentire, perciò ogni post si può leggere nella tua senza lasciare la bacheca.",
    pt: "Aqui as pessoas escrevem em muitas línguas. Uma publicação que não consegues ler é uma voz que não consegues ouvir, por isso qualquer publicação pode ser lida na tua sem sair do mural.",
    zh: "这里的人用许多种语言写作。读不懂的帖子，就像听不见的声音——所以任何一篇帖子都能用你的语言来读，而且不用离开动态页。",
    ja: "ここでは、みんながいろいろな言語で書いています。読めない投稿は、聞こえない声と同じ。だから、どの投稿もフィードを離れずに自分の言語で読めます。",
    ko: "여기 사람들은 여러 언어로 글을 써요. 읽을 수 없는 게시물은 들을 수 없는 목소리와 같아요. 그래서 어떤 게시물이든 피드를 떠나지 않고 내 언어로 읽을 수 있어요.",
    hi: "यहाँ लोग कई भाषाओं में लिखते हैं। जो पोस्ट आप पढ़ नहीं सकते, वह एक ऐसी आवाज़ है जो आप सुन नहीं सकते — इसलिए कोई भी पोस्ट फ़ीड छोड़े बिना आपकी भाषा में पढ़ी जा सकती है।",
    id: "Orang-orang di sini menulis dalam banyak bahasa. Postingan yang tidak bisa Anda baca adalah suara yang tidak bisa Anda dengar, jadi setiap postingan bisa dibaca dalam bahasa Anda tanpa meninggalkan beranda.",
    tr: "Buradaki insanlar pek çok dilde yazıyor. Okuyamadığın bir gönderi, duyamadığın bir sestir; bu yüzden her gönderi akıştan çıkmadan kendi dilinde okunabilir.",
    ru: "Здесь люди пишут на многих языках. Публикация, которую вы не можете прочитать, — это голос, которого вы не слышите, поэтому любую публикацию можно прочитать на вашем языке, не уходя из ленты.",
    vi: "Mọi người ở đây viết bằng nhiều ngôn ngữ. Một bài đăng bạn không đọc được là một tiếng nói bạn không nghe được, nên bài đăng nào cũng có thể đọc bằng ngôn ngữ của bạn mà không phải rời bảng tin.",
    ar: "يكتب الناس هنا بلغات كثيرة. والمنشور الذي لا تستطيع قراءته صوتٌ لا تسمعه، لذا يمكن قراءة أي منشور بلغتك دون مغادرة الصفحة.",
  },
  /* CICLO 1.0.7g (29 Sep 2026) — rewritten IN ITS OWN SLOT (no orphan left): the
     translations are made by the phone's own translator, never on a server. */
  "Your phone translates the post itself, so the text never leaves your phone. The first time you choose a language, your phone may need to download it, so it can take a moment: <strong>Translating…</strong> stays on the post until it is ready. Comments are not translated yet.": {
    es: "Es tu propio teléfono el que traduce la publicación, así que el texto nunca sale de tu teléfono. La primera vez que eliges un idioma, puede que tu teléfono tenga que descargarlo, así que puede tardar un momento: <strong>Traduciendo…</strong> se queda en la publicación hasta que está lista. Los comentarios todavía no se traducen.",
    ca: "És el teu propi telèfon qui tradueix la publicació, així que el text no surt mai del teu telèfon. La primera vegada que tries una llengua, potser el telèfon l’haurà de descarregar, i pot trigar un moment: <strong>S’està traduint…</strong> es queda a la publicació fins que és a punt. Els comentaris encara no es tradueixen.",
    fr: "C’est votre téléphone lui-même qui traduit la publication : le texte ne quitte jamais votre téléphone. La première fois que vous choisissez une langue, votre téléphone peut avoir besoin de la télécharger, ce qui peut prendre un instant : <strong>Traduction en cours…</strong> reste affiché sur la publication jusqu’à ce qu’elle soit prête. Les commentaires ne sont pas encore traduits.",
    de: "Dein Handy übersetzt den Beitrag selbst — der Text verlässt dein Handy also nie. Wenn du eine Sprache zum ersten Mal wählst, muss dein Handy sie vielleicht erst herunterladen, das kann einen Moment dauern: <strong>Wird übersetzt…</strong> bleibt am Beitrag stehen, bis die Übersetzung fertig ist. Kommentare werden noch nicht übersetzt.",
    it: "È il tuo telefono stesso a tradurre il post, quindi il testo non esce mai dal tuo telefono. La prima volta che scegli una lingua, il telefono potrebbe doverla scaricare, quindi può volerci un momento: <strong>Traduzione in corso…</strong> resta sul post finché non è pronta. I commenti non vengono ancora tradotti.",
    pt: "É o teu próprio telemóvel que traduz a publicação, por isso o texto nunca sai do teu telemóvel. Da primeira vez que escolhes uma língua, o telemóvel pode ter de a descarregar, por isso pode demorar um momento: <strong>A traduzir…</strong> fica na publicação até estar pronta. Os comentários ainda não são traduzidos.",
    zh: "帖子由你的手机自己翻译，所以文字从不离开你的手机。第一次选择某种语言时，手机可能需要先下载这种语言，所以可能要等一会儿：翻译好之前，帖子上会一直显示<strong>正在翻译…</strong>。评论暂时还不翻译。",
    ja: "投稿はあなたのスマホ自身が翻訳するので、文章がスマホの外に出ることはありません。ある言語を初めて選ぶときは、スマホがその言語をダウンロードする必要があり、少し時間がかかることがあります。できあがるまで、投稿には<strong>翻訳中…</strong>と表示されます。コメントはまだ翻訳されません。",
    ko: "게시물은 휴대폰이 직접 번역하기 때문에 글이 휴대폰 밖으로 나가지 않아요. 어떤 언어를 처음 고를 때는 휴대폰이 그 언어를 내려받아야 할 수 있어 잠시 걸릴 수 있어요. 번역이 준비될 때까지 게시물에는 <strong>번역 중…</strong>이 표시돼요. 댓글은 아직 번역되지 않아요.",
    hi: "पोस्ट का अनुवाद आपका फ़ोन खुद करता है, इसलिए लिखा हुआ आपके फ़ोन से बाहर नहीं जाता। जब आप कोई भाषा पहली बार चुनते हैं, तो हो सकता है कि फ़ोन को वह भाषा डाउनलोड करनी पड़े, इसलिए थोड़ा समय लग सकता है: तैयार होने तक पोस्ट पर <strong>अनुवाद हो रहा है…</strong> दिखता रहता है। टिप्पणियों का अनुवाद अभी नहीं होता।",
    id: "Ponsel Anda sendiri yang menerjemahkan postingan, jadi teksnya tidak pernah keluar dari ponsel Anda. Saat pertama kali memilih sebuah bahasa, ponsel Anda mungkin perlu mengunduhnya dulu, jadi bisa perlu sebentar: <strong>Menerjemahkan…</strong> tetap tampil di postingan sampai terjemahannya siap. Komentar belum diterjemahkan.",
    tr: "Gönderiyi telefonunun kendisi çevirir; yani metin telefonundan hiç çıkmaz. Bir dili ilk kez seçtiğinde telefonunun o dili indirmesi gerekebilir, bu yüzden biraz sürebilir: hazır olana kadar gönderide <strong>Çevriliyor…</strong> yazar. Yorumlar henüz çevrilmiyor.",
    ru: "Публикацию переводит сам ваш телефон, поэтому текст никогда не покидает его. Когда вы выбираете язык впервые, телефону может понадобиться его скачать, так что иногда нужно немного подождать: пока перевод не готов, на публикации видно <strong>Перевод…</strong>. Комментарии пока не переводятся.",
    vi: "Chính điện thoại của bạn dịch bài đăng, nên nội dung không bao giờ rời khỏi điện thoại của bạn. Lần đầu bạn chọn một ngôn ngữ, điện thoại có thể cần tải ngôn ngữ đó về, nên có thể mất một chút thời gian: <strong>Đang dịch…</strong> sẽ hiện trên bài đăng cho đến khi xong. Bình luận thì chưa được dịch.",
    ar: "هاتفك نفسه هو الذي يترجم المنشور، لذا لا يغادر النص هاتفك أبدًا. في المرة الأولى التي تختار فيها لغة، قد يحتاج هاتفك إلى تنزيلها، لذا قد يستغرق الأمر لحظة: تبقى عبارة <strong>جارٍ الترجمة…</strong> على المنشور حتى تجهز الترجمة. أما التعليقات فلا تُترجَم بعد.",
  },

  /* ---------- §4 · «Invite someone who is not here yet» ---------- */
  "Invite someone who is not here yet": {
    es: "Invita a quien todavía no está aquí", ca: "Convida qui encara no és aquí", fr: "Inviter quelqu’un qui n’est pas encore là",
    de: "Jemanden einladen, der noch nicht hier ist", it: "Invita chi non è ancora qui", pt: "Convidar quem ainda não está cá",
    zh: "邀请还不在这里的人", ja: "まだここにいない人を招待する", ko: "아직 여기 없는 사람 초대하기", hi: "जो अभी यहाँ नहीं हैं, उन्हें बुलाएँ",
    id: "Undang orang yang belum ada di sini", tr: "Henüz burada olmayan birini davet et", ru: "Пригласить того, кого здесь ещё нет",
    vi: "Mời người chưa có mặt ở đây", ar: "ادعُ من ليس هنا بعد",
  },
  "In the <strong>Chronic Friends</strong> tab, right under <strong>Recent Chats</strong>, <strong>Invite someone to Chronic Friends</strong> shows a short message with the link to our website, in your language. Send it with <strong>WhatsApp</strong> — you pick the contact there — or tap <strong>Copy link</strong> and paste it wherever you like. Where your phone offers it, <strong>Share…</strong> opens its own list of apps.": {
    es: "En la pestaña <strong>Chronic Friends</strong>, justo debajo de <strong>Chats recientes</strong>, <strong>Invita a alguien a Chronic Friends</strong> muestra un mensaje corto con el enlace a nuestra web, en tu idioma. Envíalo con <strong>WhatsApp</strong> —el contacto lo eliges allí— o toca <strong>Copiar enlace</strong> y pégalo donde quieras. Si tu teléfono lo ofrece, <strong>Compartir…</strong> abre su propia lista de apps.",
    ca: "A la pestanya <strong>Chronic Friends</strong>, just a sota de <strong>Xats recents</strong>, <strong>Convida algú a Chronic Friends</strong> mostra un missatge curt amb l’enllaç al nostre web, en la teva llengua. Envia’l amb <strong>WhatsApp</strong> —el contacte el tries allà— o toca <strong>Copia l’enllaç</strong> i enganxa’l on vulguis. Si el teu telèfon ho ofereix, <strong>Comparteix…</strong> obre la seva pròpia llista d’apps.",
    fr: "Dans l’onglet <strong>Chronic Friends</strong>, juste sous <strong>Discussions récentes</strong>, <strong>Inviter quelqu’un sur Chronic Friends</strong> affiche un court message avec le lien vers notre site, dans votre langue. Envoyez-le avec <strong>WhatsApp</strong> — vous y choisissez le contact — ou touchez <strong>Copier le lien</strong> et collez-le où vous voulez. Si votre téléphone le propose, <strong>Partager…</strong> ouvre sa propre liste d’applis.",
    de: "Im Tab <strong>Chronic Friends</strong>, direkt unter <strong>Letzte Chats</strong>, zeigt <strong>Jemanden zu Chronic Friends einladen</strong> eine kurze Nachricht mit dem Link zu unserer Website, in deiner Sprache. Schick sie mit <strong>WhatsApp</strong> — den Kontakt wählst du dort — oder tippe auf <strong>Link kopieren</strong> und füge ihn ein, wo du willst. Wo dein Handy es anbietet, öffnet <strong>Teilen…</strong> seine eigene Liste mit Apps.",
    it: "Nella scheda <strong>Chronic Friends</strong>, subito sotto <strong>Chat recenti</strong>, <strong>Invita qualcuno su Chronic Friends</strong> mostra un breve messaggio con il link al nostro sito, nella tua lingua. Invialo con <strong>WhatsApp</strong> — il contatto lo scegli lì — oppure tocca <strong>Copia link</strong> e incollalo dove vuoi. Se il tuo telefono lo offre, <strong>Condividi…</strong> apre il suo elenco di app.",
    pt: "No separador <strong>Chronic Friends</strong>, logo abaixo de <strong>Chats recentes</strong>, <strong>Convidar alguém para o Chronic Friends</strong> mostra uma mensagem curta com o link do nosso site, na tua língua. Envia-a pelo <strong>WhatsApp</strong> — escolhes o contacto lá — ou toca em <strong>Copiar link</strong> e cola-o onde quiseres. Se o teu telemóvel o oferecer, <strong>Partilhar…</strong> abre a sua própria lista de apps.",
    zh: "在 <strong>Chronic Friends</strong> 标签页里，<strong>最近聊天</strong>的正下方，<strong>邀请朋友加入 Chronic Friends</strong> 会显示一条附有我们网站链接的简短消息，用的是你的语言。可以用 <strong>WhatsApp</strong> 发送——在那里选择联系人——也可以点<strong>复制链接</strong>，粘贴到任何地方。如果你的手机支持，<strong>分享…</strong>会打开手机自己的应用列表。",
    ja: "<strong>Chronic Friends</strong> タブの<strong>最近のチャット</strong>のすぐ下にある<strong>誰かを Chronic Friends に招待</strong>を押すと、私たちのサイトへのリンクが入った短いメッセージが、あなたの言語で表示されます。<strong>WhatsApp</strong> で送る（連絡先はそちらで選びます）か、<strong>リンクをコピー</strong>を押して好きな場所に貼り付けてください。スマホが対応していれば、<strong>共有…</strong>でスマホ自身のアプリ一覧が開きます。",
    ko: "<strong>Chronic Friends</strong> 탭의 <strong>최근 채팅</strong> 바로 아래에 있는 <strong>지인을 Chronic Friends에 초대하기</strong>를 누르면, 우리 웹사이트 링크가 담긴 짧은 메시지가 내 언어로 나와요. <strong>WhatsApp</strong>으로 보내거나(연락처는 거기서 골라요) <strong>링크 복사</strong>를 눌러 원하는 곳에 붙여 넣으세요. 휴대폰이 지원하면 <strong>공유…</strong>가 휴대폰의 앱 목록을 열어요.",
    hi: "<strong>Chronic Friends</strong> टैब में, <strong>हाल की चैट</strong> के ठीक नीचे, <strong>किसी को Chronic Friends पर बुलाएँ</strong> आपकी भाषा में एक छोटा संदेश दिखाता है, जिसमें हमारी वेबसाइट का लिंक होता है। इसे <strong>WhatsApp</strong> से भेजें — संपर्क वहीं चुनें — या <strong>लिंक कॉपी करें</strong> पर टैप करके जहाँ चाहें पेस्ट करें। अगर आपका फ़ोन यह सुविधा देता है, तो <strong>शेयर करें…</strong> उसकी अपनी ऐप सूची खोलता है।",
    id: "Di tab <strong>Chronic Friends</strong>, tepat di bawah <strong>Obrolan Terbaru</strong>, <strong>Undang seseorang ke Chronic Friends</strong> menampilkan pesan singkat berisi tautan ke situs kami, dalam bahasa Anda. Kirim lewat <strong>WhatsApp</strong> — kontaknya Anda pilih di sana — atau ketuk <strong>Salin tautan</strong> lalu tempel di mana saja. Jika ponsel Anda menyediakannya, <strong>Bagikan…</strong> membuka daftar aplikasinya sendiri.",
    tr: "<strong>Chronic Friends</strong> sekmesinde, <strong>Son Sohbetler</strong>'in hemen altında, <strong>Birini Chronic Friends'e davet et</strong> web sitemizin bağlantısını içeren kısa bir mesajı senin dilinde gösterir. Mesajı <strong>WhatsApp</strong> ile gönder — kişiyi orada seçersin — ya da <strong>Bağlantıyı kopyala</strong>'ya dokunup istediğin yere yapıştır. Telefonun destekliyorsa <strong>Paylaş…</strong> kendi uygulama listesini açar.",
    ru: "Во вкладке <strong>Chronic Friends</strong>, прямо под кнопкой <strong>Недавние чаты</strong>, кнопка <strong>Пригласить кого-нибудь в Chronic Friends</strong> показывает короткое сообщение со ссылкой на наш сайт на вашем языке. Отправьте его через <strong>WhatsApp</strong> — контакт выбирается там — или нажмите <strong>Копировать ссылку</strong> и вставьте, куда захотите. Если телефон это поддерживает, <strong>Поделиться…</strong> откроет его собственный список приложений.",
    vi: "Trong thẻ <strong>Chronic Friends</strong>, ngay dưới <strong>Trò chuyện gần đây</strong>, <strong>Mời ai đó tham gia Chronic Friends</strong> hiện một tin nhắn ngắn kèm đường dẫn tới trang web của chúng tôi, bằng ngôn ngữ của bạn. Gửi qua <strong>WhatsApp</strong> — bạn chọn người nhận ở đó — hoặc chạm <strong>Sao chép liên kết</strong> rồi dán vào bất cứ đâu bạn muốn. Nếu điện thoại của bạn có, <strong>Chia sẻ…</strong> sẽ mở danh sách ứng dụng của chính nó.",
    ar: "في تبويب <strong>Chronic Friends</strong>، تحت <strong>الدردشات الأخيرة</strong> مباشرةً، يعرض <strong>ادعُ شخصًا إلى Chronic Friends</strong> رسالة قصيرة فيها رابط موقعنا، بلغتك. أرسلها عبر <strong>WhatsApp</strong> — وتختار جهة الاتصال هناك — أو اضغط <strong>نسخ الرابط</strong> والصقه حيث تشاء. وإن كان هاتفك يتيح ذلك، يفتح <strong>مشاركة…</strong> قائمة التطبيقات الخاصة به.",
  },
  "The people who would understand you best are often already in your phone. An invitation should be one tap away, and it should never say anything about you: it carries the invitation and the link, and not a word about anybody’s health.": {
    es: "Las personas que mejor te entenderían muchas veces ya están en tu teléfono. Una invitación debería estar a un toque, y nunca debería decir nada de ti: lleva la invitación y el enlace, y ni una palabra sobre la salud de nadie.",
    ca: "Les persones que millor t’entendrien sovint ja són al teu telèfon. Una invitació hauria d’estar a un toc, i no hauria de dir mai res de tu: porta la invitació i l’enllaç, i ni una paraula sobre la salut de ningú.",
    fr: "Les personnes qui vous comprendraient le mieux sont souvent déjà dans votre téléphone. Une invitation devrait être à portée d’un geste, et ne jamais rien dire de vous : elle porte l’invitation et le lien, et pas un mot sur la santé de qui que ce soit.",
    de: "Die Menschen, die dich am besten verstehen würden, sind oft schon in deinem Handy. Eine Einladung sollte nur einen Tipp entfernt sein und nie etwas über dich verraten: Sie enthält die Einladung und den Link — und kein Wort über die Gesundheit von irgendwem.",
    it: "Le persone che ti capirebbero meglio sono spesso già nel tuo telefono. Un invito dovrebbe essere a portata di tocco, e non dovrebbe mai dire nulla di te: porta l’invito e il link, e nemmeno una parola sulla salute di nessuno.",
    pt: "As pessoas que melhor te entenderiam estão muitas vezes já no teu telemóvel. Um convite deve estar à distância de um toque e nunca deve dizer nada sobre ti: leva o convite e o link, e nem uma palavra sobre a saúde de ninguém.",
    zh: "最能理解你的人，常常早就在你的手机里。邀请应该一点就能发出，也绝不该透露你的任何事：它只带着邀请和链接，关于任何人的健康只字不提。",
    ja: "あなたをいちばんわかってくれそうな人は、たいていもうスマホの中にいます。招待はワンタップで送れるべきで、あなたのことは何も伝えてはいけません。届くのは招待とリンクだけで、誰の健康についても一言も書かれていません。",
    ko: "나를 가장 잘 이해해 줄 사람은 대개 이미 휴대폰 안에 있어요. 초대는 한 번의 탭이면 충분해야 하고, 나에 대해서는 아무것도 말하지 않아야 해요. 초대와 링크만 담길 뿐, 누구의 건강에 대해서도 한마디도 없어요.",
    hi: "जो लोग आपको सबसे अच्छी तरह समझेंगे, वे अक्सर पहले से आपके फ़ोन में होते हैं। न्योता बस एक टैप दूर होना चाहिए, और उसे आपके बारे में कभी कुछ नहीं कहना चाहिए: उसमें न्योता और लिंक होता है, किसी की सेहत के बारे में एक शब्द भी नहीं।",
    id: "Orang-orang yang paling bisa memahami Anda sering kali sudah ada di ponsel Anda. Undangan seharusnya cukup sekali ketuk, dan tidak boleh mengatakan apa pun tentang Anda: isinya hanya undangan dan tautan, tanpa satu kata pun tentang kesehatan siapa pun.",
    tr: "Seni en iyi anlayacak insanlar çoğu zaman zaten telefonunda. Bir davet tek dokunuş uzaklıkta olmalı ve senin hakkında hiçbir şey söylememeli: yalnızca daveti ve bağlantıyı taşır, kimsenin sağlığı hakkında tek kelime etmez.",
    ru: "Люди, которые поняли бы вас лучше всех, часто уже есть в вашем телефоне. Приглашение должно отправляться одним касанием и никогда ничего не говорить о вас: в нём только приглашение и ссылка — и ни слова о чьём-либо здоровье.",
    vi: "Những người hiểu bạn nhất thường đã có sẵn trong điện thoại của bạn. Một lời mời chỉ nên cách một lần chạm, và không bao giờ được nói gì về bạn: nó chỉ mang lời mời và đường dẫn, không một chữ nào về sức khỏe của ai.",
    ar: "الأشخاص الذين سيفهمونك أكثر من غيرهم كثيرًا ما يكونون في هاتفك أصلًا. ينبغي أن تكون الدعوة على بُعد لمسة واحدة، وألّا تقول عنك شيئًا أبدًا: فهي تحمل الدعوة والرابط فقط، ولا كلمة عن صحة أحد.",
  },
  /* the tab name in the topic's «where» — a name, the same in every language */
  "Chronic Friends": {
    es: "Chronic Friends", ca: "Chronic Friends", fr: "Chronic Friends", de: "Chronic Friends", it: "Chronic Friends",
    pt: "Chronic Friends", zh: "Chronic Friends", ja: "Chronic Friends", ko: "Chronic Friends", hi: "Chronic Friends",
    id: "Chronic Friends", tr: "Chronic Friends", ru: "Chronic Friends", vi: "Chronic Friends", ar: "Chronic Friends",
  },
  };
  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = M[k];
    else Object.keys(M[k]).forEach(function (l) { if (!CF_UI_MAP[k][l]) CF_UI_MAP[k][l] = M[k][l]; });
  });
})();
