/* ===================================================================
   i18nmanual2026al — the manual strings of CICLO 1.0.7 (25 Sep 2026),
   because the manual ships with the app:
     · «Together with a friend», a new topic in the Meditation chapter —
       the «Together» layer is real now (coop.jsx → CFCoopCloud): a friend
       who has the app open, each on your own phone, only presence shared,
       nothing synchronised, invitations that expire after 2 minutes (the
       engine's contract; firebase-coop.js lives outside design/).
     · one new step in «The step tournament»: each row says how old it is,
       because a person's steps travel when THEY open the app.

   🔴 Every label inside a <strong> tag is the word the LIVE dictionary
   resolves for that language, never a second translation:
     Join with another user · Leave → i18ncoop.jsx
     Meditation                     → i18n-flare3.jsx
   The runtime-built words («5 min ago», «Invite {name}», «{name} stepped
   away for a moment») are never quoted: they are said in plain words.
   No `shot:` — no capture of the real layer or of the new rows exists yet.

   All 15 non-English languages. Merge-if-missing.
   Loaded after build/i18nmanual2026ak.js.

   CICLO 1.0.7b (26 Sep 2026) — the topic follows the app again, every
   change IN ITS OWN SLOT (no orphan left beside it):
     · the body's last sentence: not only the light travels — your name and
       photo (the banner draws the sender's avatar) and the ritual you invite
       to travel too;
     · step 2 read «Friends who do not appear switched off» (broken
       English): the key is now «…who do not have it open appear switched
       off», and its 15 translations MOVED with it untouched — they already
       said the right thing;
     · step 3: the invitation reaches the friend on ANY screen (no longer
       «inside Meditation»), joining takes them into the ritual, and a ritual
       of Flare Mode is only joined in Flare Mode (and the others outside it);
     · step 4: «Go there» (→ i18ncoop) beside «Leave»;
     · the tip: a friend who accepted but is not in the ritual yet is
       «waited for», never «stepped away» (session.partnerArrived).
   🔴 German: no gender asterisk («Freund*in», «Jede*r») — the form of
   the rest of the app.
   =================================================================== */
(function () {
  if (typeof CF_UI_MAP === 'undefined') return;
  var M = {
  "Together with a friend": {
    es: "Juntos con un amigo",
    ca: "Junts amb un amic",
    fr: "Ensemble avec un ami",
    de: "Gemeinsam mit einem Freund",
    it: "Insieme a un amico",
    pt: "Juntos com um amigo",
    zh: "和好友一起",
    ja: "友だちと一緒に",
    ko: "친구와 함께",
    hi: "किसी दोस्त के साथ",
    id: "Bersama seorang teman",
    tr: "Bir arkadaşla birlikte",
    ru: "Вместе с другом",
    vi: "Cùng một người bạn",
    ar: "معًا مع صديق",
  },
  "Inside a Meditation ritual, <strong>Join with another user</strong> invites a friend to do it at the same time as you. Each of you does the ritual on your own phone — nothing is synchronised, not the music and not the breathing — and while you are both there, a small light with your friend’s name drifts across your screen. Only your name and photo, the ritual you invite to and that light travel between you: nothing else of yours is shared.": {
    es: "Dentro de un ritual de Meditación, <strong>Unirse con otra persona</strong> invita a un amigo a hacerlo a la vez que tú. Cada uno hace el ritual en su propio teléfono —no se sincroniza nada, ni la música ni la respiración— y, mientras estáis los dos, una lucecita con el nombre de tu amigo flota por tu pantalla. Solo viajan entre vosotros tu nombre y tu foto, el ritual al que invitas y esa luz: no se comparte nada más de ti.",
    ca: "Dins d’un ritual de Meditació, <strong>Uneix-t’hi amb una altra persona</strong> convida un amic a fer-lo alhora que tu. Cadascú fa el ritual al seu propi telèfon —no se sincronitza res, ni la música ni la respiració— i, mentre hi sou tots dos, una llumeta amb el nom del teu amic sura per la teva pantalla. Entre vosaltres només viatgen el teu nom i la teva foto, el ritual al qual convides i aquesta llum: no es comparteix res més de tu.",
    fr: "Dans un rituel de Méditation, <strong>Rejoindre avec une autre personne</strong> invite un ami à le faire en même temps que vous. Chacun fait le rituel sur son propre téléphone — rien n’est synchronisé, ni la musique ni la respiration — et, tant que vous êtes là tous les deux, une petite lumière portant le nom de votre ami flotte sur votre écran. Seuls votre nom et votre photo, le rituel auquel vous invitez et cette lumière circulent entre vous : rien d’autre de vous n’est partagé.",
    de: "In einem Meditationsritual lädt <strong>Mit einer anderen Person zusammen</strong> eine Freundin oder einen Freund ein, es zur selben Zeit wie du zu machen. Jeder macht das Ritual am eigenen Handy — nichts wird synchronisiert, weder die Musik noch das Atmen —, und solange ihr beide da seid, schwebt ein kleines Licht mit dem Namen deines Gegenübers über deinen Bildschirm. Nur dein Name und dein Foto, das Ritual, zu dem du einlädst, und dieses Licht wandern zwischen euch: Sonst wird nichts von dir geteilt.",
    it: "In un rituale di Meditazione, <strong>Unisciti a un’altra persona</strong> invita un amico a farlo nello stesso momento in cui lo fai tu. Ognuno fa il rituale sul proprio telefono — non si sincronizza nulla, né la musica né il respiro — e, finché ci siete entrambi, una piccola luce con il nome del tuo amico fluttua sul tuo schermo. Tra voi viaggiano solo il tuo nome e la tua foto, il rituale a cui inviti e quella luce: nient’altro di tuo viene condiviso.",
    pt: "Dentro de um ritual de Meditação, <strong>Juntar-se a outra pessoa</strong> convida um amigo a fazê-lo ao mesmo tempo que tu. Cada um faz o ritual no seu próprio telefone — nada é sincronizado, nem a música nem a respiração — e, enquanto estiverem os dois, uma pequena luz com o nome do teu amigo flutua pelo teu ecrã. Entre vocês só viajam o teu nome e a tua foto, o ritual para o qual convidas e essa luz: nada mais de ti é partilhado.",
    zh: "在冥想的某个练习里，<strong>和另一位用户一起</strong>可以邀请一位好友和你同时进行。你们各自用自己的手机做这个练习——什么都不会同步，音乐不会，呼吸也不会——而当你们都在的时候，一个写着好友名字的小光点会在你的屏幕上飘动。你们之间传递的只有你的名字和照片、你邀请的练习，以及那点光：你的其他任何内容都不会被共享。",
    ja: "瞑想のリチュアルの中で<strong>他のユーザーと一緒に</strong>を使うと、友だちを招待して同じ時間に行えます。それぞれが自分のスマホでリチュアルを行い——音楽も呼吸も、何も同期されません——ふたりともそこにいるあいだ、友だちの名前がついた小さな光があなたの画面をただよいます。ふたりのあいだを行き来するのは、あなたの名前と写真、招待したリチュアル、そしてその光だけ。あなたのそれ以外のものは何も共有されません。",
    ko: "명상 리추얼 안에서 <strong>다른 사용자와 함께하기</strong>를 누르면 친구를 초대해 같은 시간에 함께할 수 있어요. 각자 자신의 폰으로 리추얼을 하고 — 음악도 호흡도, 아무것도 동기화되지 않아요 — 두 사람이 모두 있는 동안 친구 이름이 적힌 작은 빛이 내 화면 위를 떠다녀요. 두 사람 사이를 오가는 건 내 이름과 사진, 초대한 리추얼, 그리고 그 빛뿐이에요. 그 밖의 내 것은 아무것도 공유되지 않아요.",
    hi: "ध्यान के किसी अभ्यास के भीतर, <strong>किसी और के साथ जुड़ें</strong> किसी दोस्त को आपके साथ उसी समय करने के लिए बुलाता है। हर कोई अपने फ़ोन पर अभ्यास करता है — कुछ भी सिंक नहीं होता, न संगीत, न साँस — और जब तक आप दोनों वहाँ हैं, आपके दोस्त के नाम वाली एक छोटी रोशनी आपकी स्क्रीन पर तैरती है। आप दोनों के बीच सिर्फ़ आपका नाम और फ़ोटो, जिस अभ्यास में आप बुलाते हैं वह, और वही रोशनी आती-जाती है: आपका और कुछ भी साझा नहीं होता।",
    id: "Di dalam sebuah ritual Meditasi, <strong>Gabung dengan orang lain</strong> mengundang seorang teman untuk melakukannya bersamaan denganmu. Masing-masing melakukan ritual di ponselnya sendiri — tidak ada yang disinkronkan, baik musik maupun napas — dan selama kalian berdua ada di sana, sebuah cahaya kecil bertuliskan nama temanmu melayang di layarmu. Hanya nama dan fotomu, ritual undanganmu, dan cahaya itu yang berpindah di antara kalian: tidak ada hal lain darimu yang dibagikan.",
    tr: "Bir Meditasyon ritüelinin içinde <strong>Başka biriyle katıl</strong>, bir arkadaşını seninle aynı anda yapmaya davet eder. Herkes ritüeli kendi telefonunda yapar — hiçbir şey eşitlenmez, ne müzik ne nefes — ve ikiniz de oradayken, arkadaşının adını taşıyan küçük bir ışık ekranında süzülür. Aranızda yalnızca adın ve fotoğrafın, davet ettiğin ritüel ve o ışık gidip gelir: senden başka hiçbir şey paylaşılmaz.",
    ru: "Внутри ритуала Медитации кнопка <strong>Вместе с другим человеком</strong> приглашает друга сделать его одновременно с вами. Каждый проходит ритуал на своём телефоне — ничего не синхронизируется, ни музыка, ни дыхание, — и пока вы оба здесь, по вашему экрану плывёт маленький огонёк с именем друга. Между вами передаются только ваше имя и фото, ритуал, в который вы приглашаете, и этот огонёк: ничем другим вы не делитесь.",
    vi: "Bên trong một nghi thức Thiền, <strong>Tham gia cùng người khác</strong> mời một người bạn làm cùng lúc với bạn. Mỗi người làm nghi thức trên điện thoại của mình — không có gì được đồng bộ, cả nhạc lẫn nhịp thở — và khi cả hai cùng ở đó, một đốm sáng nhỏ mang tên người bạn trôi trên màn hình của bạn. Giữa hai người chỉ có tên và ảnh của bạn, nghi thức bạn mời, và đốm sáng ấy đi lại: không có gì khác của bạn được chia sẻ.",
    ar: "داخل أحد طقوس التأمّل، يدعو <strong>انضمّ مع شخص آخر</strong> صديقًا لممارسته في الوقت نفسه معك. يمارس كلٌّ منكما الطقس على هاتفه — لا شيء يُزامَن، لا الموسيقى ولا التنفّس — وما دمتما موجودَين، يطفو على شاشتك ضوء صغير يحمل اسم صديقك. لا يعبر بينكما إلا اسمك وصورتك والطقس الذي تدعو إليه وذلك الضوء: لا يُشارَك أي شيء آخر منك.",
  },
  "A hard evening is lighter with company, but a call is not always possible and a video is too much. Being in the same quiet room, each on your own sofa, can be enough — and nobody is ever shown who is not really there: the light appears only while your friend really is.": {
    es: "Una noche difícil pesa menos acompañada, pero no siempre se puede llamar y una videollamada es demasiado. Estar en la misma sala tranquila, cada uno en su sofá, puede bastar — y nunca se muestra a nadie que no esté de verdad: la luz solo aparece mientras tu amigo está de verdad.",
    ca: "Un vespre difícil pesa menys acompanyat, però no sempre es pot trucar i una videotrucada és massa. Ser a la mateixa sala tranquil·la, cadascú al seu sofà, pot ser prou — i mai no es mostra ningú que no hi sigui de veritat: la llum només apareix mentre el teu amic hi és de veritat.",
    fr: "Une soirée difficile est plus légère en compagnie, mais un appel n’est pas toujours possible et une vidéo, c’est trop. Être dans la même pièce calme, chacun sur son canapé, peut suffire — et l’app ne montre jamais quelqu’un qui n’est pas vraiment là : la lumière n’apparaît que tant que votre ami l’est vraiment.",
    de: "Ein schwerer Abend ist leichter in Gesellschaft, aber ein Anruf geht nicht immer, und ein Video ist zu viel. Im selben stillen Raum zu sein, jeder auf dem eigenen Sofa, kann genügen — und nie wird jemand gezeigt, der nicht wirklich da ist: Das Licht erscheint nur, solange dein Gegenüber wirklich da ist.",
    it: "Una sera difficile pesa meno in compagnia, ma una chiamata non è sempre possibile e un video è troppo. Stare nella stessa stanza tranquilla, ognuno sul proprio divano, può bastare — e non viene mai mostrato nessuno che non ci sia davvero: la luce appare solo finché il tuo amico c’è davvero.",
    pt: "Uma noite difícil pesa menos acompanhada, mas nem sempre é possível ligar e uma videochamada é demasiado. Estar na mesma sala tranquila, cada um no seu sofá, pode bastar — e nunca se mostra ninguém que não esteja lá de verdade: a luz só aparece enquanto o teu amigo está mesmo lá.",
    zh: "艰难的夜晚有人陪伴会轻松一些，但打电话并不总是可能，视频又太多了。待在同一个安静的房间里，各自坐在自己的沙发上，也许就足够了——而且应用绝不会显示一个并不真的在场的人：只有你的好友真的在，那点光才会出现。",
    ja: "つらい夜も、誰かがいれば少し軽くなります。でも電話はいつもできるわけではないし、ビデオ通話は重すぎる。同じ静かな部屋に、それぞれ自分のソファで一緒にいる——それで十分なこともあります。そして、本当はいない人が表示されることは決してありません。光が現れるのは、友だちが本当にそこにいるあいだだけです。",
    ko: "힘든 저녁도 누군가 곁에 있으면 조금 가벼워져요. 하지만 전화는 늘 가능한 게 아니고, 영상 통화는 너무 부담스럽죠. 같은 고요한 방에, 각자 자기 소파에 있는 것만으로 충분할 때가 있어요 — 그리고 실제로 없는 사람이 표시되는 일은 결코 없어요. 빛은 친구가 정말 있는 동안에만 나타나요.",
    hi: "मुश्किल शाम किसी के साथ हल्की लगती है, पर फ़ोन करना हमेशा मुमकिन नहीं होता और वीडियो ज़्यादा हो जाता है। एक ही शांत कमरे में, हर कोई अपने सोफ़े पर — इतना काफ़ी हो सकता है। और ऐसा कोई कभी नहीं दिखाया जाता जो सच में वहाँ न हो: रोशनी तभी दिखती है जब आपका दोस्त सच में वहाँ हो।",
    id: "Malam yang berat terasa lebih ringan bila ditemani, tetapi menelepon tidak selalu bisa dan video terlalu berlebihan. Berada di ruang tenang yang sama, masing-masing di sofanya sendiri, bisa jadi sudah cukup — dan tidak pernah ada orang yang ditampilkan padahal ia tidak benar-benar ada: cahaya itu hanya muncul selama temanmu memang ada di sana.",
    tr: "Zor bir akşam, yanında biri olunca hafifler; ama her zaman arama yapılamaz, görüntülü konuşma da fazla gelir. Aynı sakin odada, herkes kendi koltuğunda olmak yetebilir — ve gerçekte orada olmayan hiç kimse gösterilmez: ışık yalnızca arkadaşın gerçekten oradayken görünür.",
    ru: "Тяжёлый вечер легче, когда рядом кто-то есть, но позвонить можно не всегда, а видеосвязь — это слишком. Быть в одной тихой комнате, каждому на своём диване, бывает достаточно — и приложение никогда не показывает того, кого на самом деле нет: огонёк появляется, только пока ваш друг действительно здесь.",
    vi: "Một buổi tối khó khăn sẽ nhẹ hơn khi có người bên cạnh, nhưng không phải lúc nào cũng gọi điện được, còn gọi video thì quá sức. Ở trong cùng một căn phòng yên tĩnh, mỗi người trên chiếc sofa của mình, có khi là đủ — và ứng dụng không bao giờ hiện ra một người không thực sự ở đó: đốm sáng chỉ xuất hiện khi bạn của bạn thực sự có mặt.",
    ar: "المساء الصعب أخفّ بصحبة أحد، لكن الاتصال ليس ممكنًا دائمًا والفيديو أكثر مما يُحتمل. أن تكونا في الغرفة الهادئة نفسها، كلٌّ على أريكته، قد يكفي — ولا يُعرض أبدًا أحد ليس موجودًا حقًا: لا يظهر الضوء إلا ما دام صديقك موجودًا فعلًا.",
  },
  "Open a ritual in <strong>Meditation</strong> and tap <strong>Join with another user</strong>.": {
    es: "Abre un ritual en <strong>Meditación</strong> y toca <strong>Unirse con otra persona</strong>.",
    ca: "Obre un ritual a <strong>Meditació</strong> i toca <strong>Uneix-t’hi amb una altra persona</strong>.",
    fr: "Ouvrez un rituel dans <strong>Méditation</strong> et touchez <strong>Rejoindre avec une autre personne</strong>.",
    de: "Öffne ein Ritual in <strong>Meditation</strong> und tippe auf <strong>Mit einer anderen Person zusammen</strong>.",
    it: "Apri un rituale in <strong>Meditazione</strong> e tocca <strong>Unisciti a un’altra persona</strong>.",
    pt: "Abre um ritual em <strong>Meditação</strong> e toca em <strong>Juntar-se a outra pessoa</strong>.",
    zh: "在<strong>冥想</strong>里打开一个练习，点<strong>和另一位用户一起</strong>。",
    ja: "<strong>瞑想</strong>でリチュアルを開き、<strong>他のユーザーと一緒に</strong>をタップします。",
    ko: "<strong>명상</strong>에서 리추얼을 열고 <strong>다른 사용자와 함께하기</strong>를 누르세요.",
    hi: "<strong>ध्यान</strong> में कोई अभ्यास खोलें और <strong>किसी और के साथ जुड़ें</strong> पर टैप करें।",
    id: "Buka sebuah ritual di <strong>Meditasi</strong> lalu ketuk <strong>Gabung dengan orang lain</strong>.",
    tr: "<strong>Meditasyon</strong> içinde bir ritüel aç ve <strong>Başka biriyle katıl</strong> düğmesine dokun.",
    ru: "Откройте ритуал в разделе <strong>Медитация</strong> и нажмите <strong>Вместе с другим человеком</strong>.",
    vi: "Mở một nghi thức trong <strong>Thiền</strong> rồi chạm <strong>Tham gia cùng người khác</strong>.",
    ar: "افتح أحد الطقوس في <strong>تأمّل</strong> واضغط <strong>انضمّ مع شخص آخر</strong>.",
  },
  "Pick a friend who has the app open right now. Friends who do not have it open appear switched off: there are no notifications, so an invitation could never reach them.": {
    es: "Elige a un amigo que tenga la app abierta ahora mismo. Los que no la tienen aparecen apagados: no hay notificaciones, así que una invitación nunca les llegaría.",
    ca: "Tria un amic que tingui l’app oberta ara mateix. Els que no la tenen apareixen apagats: no hi ha notificacions, així que una invitació no els arribaria mai.",
    fr: "Choisissez un ami qui a l’app ouverte en ce moment. Ceux qui ne l’ont pas apparaissent éteints : il n’y a pas de notifications, une invitation ne leur parviendrait donc jamais.",
    de: "Wähle eine Freundin oder einen Freund, die oder der die App gerade offen hat. Wer sie nicht offen hat, erscheint ausgegraut: Es gibt keine Benachrichtigungen, eine Einladung würde also nie ankommen.",
    it: "Scegli un amico che ha l’app aperta in questo momento. Chi non ce l’ha appare spento: non ci sono notifiche, quindi un invito non gli arriverebbe mai.",
    pt: "Escolhe um amigo que tenha a app aberta neste momento. Quem não a tem aparece apagado: não há notificações, por isso um convite nunca lhe chegaria.",
    zh: "选一位此刻正打开着应用的好友。没打开的好友会显示为灰色：没有推送通知，所以邀请永远到不了他们那里。",
    ja: "いまアプリを開いている友だちを選びます。開いていない友だちはグレーで表示されます。通知はないので、招待が届くことはないからです。",
    ko: "지금 앱을 열어 둔 친구를 고르세요. 앱을 열지 않은 친구는 흐리게 표시돼요. 알림이 없어서 초대가 절대 닿을 수 없거든요.",
    hi: "ऐसा दोस्त चुनें जिसका ऐप अभी खुला हो। जिनका नहीं खुला, वे धुँधले दिखते हैं: कोई सूचना नहीं जाती, इसलिए निमंत्रण उन तक कभी नहीं पहुँचेगा।",
    id: "Pilih teman yang sedang membuka aplikasi saat ini. Yang tidak sedang membukanya tampil redup: tidak ada notifikasi, jadi undangan tidak akan pernah sampai kepada mereka.",
    tr: "Şu an uygulaması açık olan bir arkadaş seç. Uygulaması açık olmayanlar soluk görünür: bildirim yoktur, bu yüzden davet onlara hiçbir zaman ulaşmaz.",
    ru: "Выберите друга, у которого приложение открыто прямо сейчас. Остальные показаны приглушёнными: уведомлений нет, поэтому приглашение до них никогда бы не дошло.",
    vi: "Chọn một người bạn đang mở ứng dụng ngay lúc này. Những người không mở sẽ hiện mờ đi: không có thông báo, nên lời mời sẽ không bao giờ đến được với họ.",
    ar: "اختر صديقًا يفتح التطبيق الآن. من لا يفتحه يظهر باهتًا: لا توجد إشعارات، لذا لن تصله الدعوة أبدًا.",
  },
  "Your friend sees the invitation on any screen of the app and joins or declines; joining takes them straight into the ritual. The rituals of Flare Mode can only be joined in Flare Mode, and the others only outside it. If nobody answers, it expires after 2 minutes.": {
    es: "Tu amigo ve la invitación en cualquier pantalla de la app y se une o la rechaza; al unirse, entra directamente en el ritual. A un ritual del Modo brote solo se puede unir desde el Modo brote, y a los demás solo fuera de él. Si nadie contesta, caduca a los 2 minutos.",
    ca: "El teu amic veu la invitació en qualsevol pantalla de l’app i s’hi uneix o la rebutja; en unir-s’hi, entra directament al ritual. A un ritual del Mode brot només s’hi pot unir des del Mode brot, i als altres només fora d’aquest mode. Si ningú no contesta, caduca als 2 minuts.",
    fr: "Votre ami voit l’invitation sur n’importe quel écran de l’app et la rejoint ou la refuse ; la rejoindre l’emmène directement dans le rituel. Un rituel du Mode poussée ne se rejoint qu’en Mode poussée, et les autres qu’en dehors. Si personne ne répond, elle expire au bout de 2 minutes.",
    de: "Dein Gegenüber sieht die Einladung auf jedem Bildschirm der App und nimmt sie an oder lehnt ab; wer annimmt, landet direkt im Ritual. Einem Ritual des Schub-Modus kann man nur im Schub-Modus beitreten, den anderen nur außerhalb davon. Antwortet niemand, verfällt sie nach 2 Minuten.",
    it: "Il tuo amico vede l’invito in qualsiasi schermata dell’app e si unisce o rifiuta; unendosi, entra subito nel rituale. A un rituale della Modalità riacutizzazione ci si può unire solo dalla Modalità riacutizzazione, e agli altri solo fuori da essa. Se nessuno risponde, scade dopo 2 minuti.",
    pt: "O teu amigo vê o convite em qualquer ecrã da app e junta-se ou recusa; ao juntar-se, entra diretamente no ritual. A um ritual do Modo de crise só é possível juntar-se no Modo de crise, e aos outros só fora dele. Se ninguém responder, expira ao fim de 2 minutos.",
    zh: "好友在应用的任何画面都会看到邀请，可以加入或谢绝；加入后会直接进入这个练习。发作模式里的练习只能在发作模式中加入，其他练习只能在发作模式之外加入。如果没人回应，邀请在 2 分钟后失效。",
    ja: "友だちはアプリのどの画面にいても招待を見て、参加するか辞退します。参加すると、そのままリチュアルに入ります。フレアモードのリチュアルにはフレアモードでのみ、それ以外のリチュアルにはフレアモードの外でのみ参加できます。誰も答えなければ、招待は 2 分で期限切れになります。",
    ko: "친구는 앱의 어느 화면에서든 초대를 보고 참여하거나 거절해요. 참여하면 바로 그 리추얼로 들어가요. 플레어 모드의 리추얼은 플레어 모드에서만, 나머지는 플레어 모드 밖에서만 참여할 수 있어요. 아무도 답하지 않으면 초대는 2분 뒤에 만료돼요.",
    hi: "आपका दोस्त ऐप की किसी भी स्क्रीन पर निमंत्रण देखता है और जुड़ता है या मना करता है; जुड़ते ही वह सीधे उस अभ्यास में पहुँच जाता है। फ्लेयर मोड के अभ्यासों से सिर्फ़ फ्लेयर मोड में जुड़ा जा सकता है, और बाकी से सिर्फ़ उसके बाहर। अगर कोई जवाब न दे, तो यह 2 मिनट बाद समाप्त हो जाता है।",
    id: "Temanmu melihat undangan itu di layar mana pun di aplikasi, lalu bergabung atau menolak; bergabung langsung membawanya ke dalam ritual. Ritual Mode Flare hanya bisa diikuti di Mode Flare, dan yang lain hanya di luar mode itu. Kalau tidak ada yang menjawab, undangan kedaluwarsa setelah 2 menit.",
    tr: "Arkadaşın daveti uygulamanın herhangi bir ekranında görür; katılır ya da reddeder, katılınca doğrudan ritüele girer. Alevlenme Modu ritüellerine yalnızca Alevlenme Modu’nda, diğerlerine ise yalnızca bu modun dışında katılınabilir. Kimse yanıt vermezse davet 2 dakika sonra sona erer.",
    ru: "Друг видит приглашение на любом экране приложения и присоединяется или отказывается; присоединившись, он сразу попадает в ритуал. К ритуалам режима обострения можно присоединиться только в режиме обострения, а к остальным — только вне его. Если никто не ответит, через 2 минуты оно истекает.",
    vi: "Bạn của bạn thấy lời mời ở bất kỳ màn hình nào của ứng dụng và tham gia hoặc từ chối; tham gia sẽ đưa họ thẳng vào nghi thức. Nghi thức của Chế độ bùng phát chỉ tham gia được trong Chế độ bùng phát, còn các nghi thức khác chỉ tham gia được bên ngoài chế độ đó. Nếu không ai trả lời, lời mời hết hạn sau 2 phút.",
    ar: "يرى صديقك الدعوة في أي شاشة من التطبيق، فينضمّ أو يرفض؛ والانضمام يأخذه مباشرة إلى الطقس. لا يمكن الانضمام إلى طقوس وضع النوبة إلا من داخل وضع النوبة، ولا إلى غيرها إلا من خارجه. وإذا لم يُجب أحد، تنتهي صلاحيتها بعد دقيقتين.",
  },
  "<strong>Leave</strong> ends it whenever you want. If you wander into another ritual, a line at the top says where you are together, with <strong>Go there</strong> to take you back.": {
    es: "<strong>Salir</strong> lo termina cuando quieras. Si pasas a otro ritual, una línea arriba dice dónde estáis juntos, con <strong>Ir allí</strong> para volver.",
    ca: "<strong>Surt</strong> ho acaba quan vulguis. Si passes a un altre ritual, una línia a dalt diu on sou junts, amb <strong>Ves-hi</strong> per tornar-hi.",
    fr: "<strong>Quitter</strong> y met fin quand vous voulez. Si vous passez à un autre rituel, une ligne en haut indique où vous êtes ensemble, avec <strong>Y aller</strong> pour y retourner.",
    de: "<strong>Verlassen</strong> beendet es, wann immer du willst. Wechselst du in ein anderes Ritual, sagt eine Zeile oben, wo ihr zusammen seid, und <strong>Hingehen</strong> bringt dich zurück.",
    it: "<strong>Esci</strong> lo chiude quando vuoi. Se passi a un altro rituale, una riga in alto dice dove siete insieme, con <strong>Vai lì</strong> per tornarci.",
    pt: "<strong>Sair</strong> termina-o quando quiseres. Se passares para outro ritual, uma linha no topo diz onde estão juntos, com <strong>Ir para lá</strong> para voltares.",
    zh: "想结束时，点<strong>离开</strong>即可。如果你转到了别的练习，顶部会有一行字告诉你你们在哪里一起，点<strong>前往</strong>就能回去。",
    ja: "<strong>退出</strong>でいつでも終えられます。別のリチュアルに移ると、上の一行がふたりがどこで一緒にいるかを伝え、<strong>そこへ行く</strong>で戻れます。",
    ko: "<strong>나가기</strong>를 누르면 언제든 끝낼 수 있어요. 다른 리추얼로 옮기면 맨 위의 한 줄이 두 사람이 어디에 함께 있는지 알려 주고, <strong>그곳으로 가기</strong>로 돌아갈 수 있어요.",
    hi: "<strong>छोड़ें</strong> से आप जब चाहें इसे खत्म कर सकते हैं। अगर आप किसी दूसरे अभ्यास में चले जाएँ, तो ऊपर एक पंक्ति बताती है कि आप दोनों कहाँ साथ हैं, और <strong>वहाँ जाएँ</strong> आपको वापस ले जाता है।",
    id: "<strong>Keluar</strong> mengakhirinya kapan pun kamu mau. Kalau kamu pindah ke ritual lain, sebaris di atas menyebut di mana kalian bersama, dengan <strong>Ke sana</strong> untuk kembali.",
    tr: "<strong>Ayrıl</strong> ile istediğin zaman bitirirsin. Başka bir ritüele geçersen, üstteki bir satır nerede birlikte olduğunuzu söyler; <strong>Oraya git</strong> seni geri götürür.",
    ru: "<strong>Выйти</strong> завершает это, когда захотите. Если вы перейдёте в другой ритуал, строка вверху скажет, где вы вместе, а <strong>Перейти туда</strong> вернёт вас обратно.",
    vi: "<strong>Rời đi</strong> kết thúc bất cứ lúc nào bạn muốn. Nếu bạn chuyển sang một nghi thức khác, một dòng ở trên cùng cho biết hai người đang cùng nhau ở đâu, với <strong>Đến đó</strong> để quay lại.",
    ar: "<strong>مغادرة</strong> يُنهيه متى شئت. وإذا انتقلت إلى طقس آخر، يقول سطر في الأعلى أين أنتما معًا، ومعه <strong>اذهب إلى هناك</strong> للعودة.",
  },
  "Until your friend is in the ritual, a line says you are waiting for them. If they leave it or close the app, their light disappears within a minute and a quiet line says they stepped away — the app never keeps a light on for someone who is not there.": {
    es: "Hasta que tu amigo entra en el ritual, una línea dice que lo estás esperando. Si sale de él o cierra la app, su luz desaparece en menos de un minuto y una línea discreta dice que se ha ido un momento: la app nunca mantiene encendida la luz de alguien que no está.",
    ca: "Fins que el teu amic no entra al ritual, una línia diu que l’estàs esperant. Si en surt o tanca l’app, la seva llum desapareix en menys d’un minut i una línia discreta diu que ha marxat un moment: l’app mai no manté encesa la llum d’algú que no hi és.",
    fr: "Tant que votre ami n’est pas entré dans le rituel, une ligne indique que vous l’attendez. S’il le quitte ou ferme l’app, sa lumière disparaît en moins d’une minute et une ligne discrète dit qu’il s’est absenté : l’app ne laisse jamais allumée la lumière de quelqu’un qui n’est pas là.",
    de: "Bis dein Gegenüber im Ritual ist, sagt eine Zeile, dass du wartest. Verlässt die Person es oder schließt die App, verschwindet das Licht innerhalb einer Minute, und eine leise Zeile sagt, dass sie kurz weg ist — die App lässt nie ein Licht an für jemanden, der nicht da ist.",
    it: "Finché il tuo amico non è entrato nel rituale, una riga dice che lo stai aspettando. Se ne esce o chiude l’app, la sua luce scompare entro un minuto e una riga discreta dice che si è allontanato: l’app non tiene mai accesa la luce di qualcuno che non c’è.",
    pt: "Até o teu amigo entrar no ritual, uma linha diz que estás à espera dele. Se ele sair ou fechar a app, a luz dele desaparece em menos de um minuto e uma linha discreta diz que saiu por um momento: a app nunca mantém acesa a luz de alguém que não está lá.",
    zh: "在好友进入练习之前，会有一行字说你正在等他。如果他离开了练习或关掉了应用，他的光点会在一分钟内消失，并有一行小字说他暂时离开了——应用绝不会为不在场的人留着一盏灯。",
    ja: "友だちがリチュアルに入るまでは、待っていることを一行が伝えます。友だちがリチュアルを出たりアプリを閉じたりすると、その光は1分以内に消え、少し席を外していると静かな一行が伝えます。いない人のために光をつけたままにすることは決してありません。",
    ko: "친구가 리추얼에 들어오기 전까지는 기다리는 중이라는 한 줄이 나와요. 친구가 리추얼을 나가거나 앱을 닫으면 그 빛은 1분 안에 사라지고, 잠시 자리를 비웠다는 조용한 한 줄이 나와요. 앱은 곁에 없는 사람의 빛을 켜 두지 않아요.",
    hi: "जब तक आपका दोस्त अभ्यास में नहीं आता, एक पंक्ति बताती है कि आप उसका इंतज़ार कर रहे हैं। अगर वह अभ्यास छोड़ दे या ऐप बंद कर दे, तो उसकी रोशनी एक मिनट के भीतर गायब हो जाती है और एक शांत पंक्ति बताती है कि वह थोड़ी देर के लिए चला गया है — ऐप कभी ऐसे किसी की रोशनी जलती नहीं रखता जो वहाँ नहीं है।",
    id: "Sampai temanmu masuk ke ritual, sebaris kalimat mengatakan kamu sedang menunggunya. Kalau ia keluar dari ritual atau menutup aplikasi, cahayanya hilang dalam semenit dan sebaris kalimat pelan mengatakan ia sedang pergi sebentar — aplikasi tidak pernah membiarkan cahaya menyala untuk orang yang tidak ada.",
    tr: "Arkadaşın ritüele girene kadar bir satır onu beklediğini söyler. Ritüelden çıkarsa ya da uygulamayı kapatırsa ışığı bir dakika içinde kaybolur ve sessiz bir satır kısa bir süreliğine ayrıldığını söyler — uygulama orada olmayan biri için asla ışığı açık tutmaz.",
    ru: "Пока друг не вошёл в ритуал, строка говорит, что вы его ждёте. Если он выйдет из ритуала или закроет приложение, его огонёк погаснет в течение минуты, а тихая строка скажет, что он ненадолго отошёл: приложение никогда не оставляет огонёк тому, кого нет.",
    vi: "Cho đến khi bạn của bạn vào nghi thức, một dòng cho biết bạn đang chờ họ. Nếu họ rời nghi thức hoặc đóng ứng dụng, đốm sáng của họ biến mất trong vòng một phút và một dòng nhỏ cho biết họ vừa rời đi một lát — ứng dụng không bao giờ để đèn sáng cho người không có mặt.",
    ar: "إلى أن يدخل صديقك الطقس، يقول سطر إنك تنتظره. وإذا غادره أو أغلق التطبيق، يختفي ضوؤه خلال دقيقة، ويقول سطر هادئ إنه ابتعد للحظة — لا يُبقي التطبيق الضوء مضاءً لأحد ليس موجودًا.",
  },
  "Under each number, a small grey line says when that row was last updated — each person’s steps travel only when that person opens the app, so a row can be a little behind.": {
    es: "Debajo de cada número, una línea pequeña y gris dice cuándo se actualizó esa fila: los pasos de cada persona solo viajan cuando esa persona abre la app, así que una fila puede ir un poco atrasada.",
    ca: "A sota de cada número, una línia petita i grisa diu quan es va actualitzar aquella fila: els passos de cada persona només viatgen quan aquella persona obre l’app, així que una fila pot anar una mica endarrerida.",
    fr: "Sous chaque nombre, une petite ligne grise indique quand cette ligne a été mise à jour : les pas de chacun ne partent que lorsque cette personne ouvre l’app, une ligne peut donc avoir un peu de retard.",
    de: "Unter jeder Zahl sagt eine kleine graue Zeile, wann diese Reihe zuletzt aktualisiert wurde — die Schritte einer Person werden erst übertragen, wenn sie die App öffnet, also kann eine Reihe etwas hinterherhinken.",
    it: "Sotto ogni numero, una piccola riga grigia dice quando quella riga è stata aggiornata: i passi di ogni persona partono solo quando quella persona apre l’app, quindi una riga può essere un po’ indietro.",
    pt: "Por baixo de cada número, uma pequena linha cinzenta diz quando essa linha foi atualizada: os passos de cada pessoa só seguem quando essa pessoa abre a app, por isso uma linha pode estar um pouco atrasada.",
    zh: "每个数字下面，有一行灰色小字写着这一行上次更新的时间——每个人的步数只有在他本人打开应用时才会上传，所以某一行可能会稍微落后。",
    ja: "各数字の下に、その行がいつ更新されたかを小さな灰色の一行が示します。歩数は本人がアプリを開いたときにだけ送られるので、行によっては少し遅れていることがあります。",
    ko: "각 숫자 아래의 작은 회색 줄이 그 행이 마지막으로 언제 업데이트됐는지 알려 줘요. 걸음 수는 그 사람이 앱을 열 때만 전송되기 때문에, 어떤 행은 조금 늦을 수 있어요.",
    hi: "हर संख्या के नीचे एक छोटी धूसर पंक्ति बताती है कि वह पंक्ति आख़िरी बार कब अपडेट हुई — हर व्यक्ति के क़दम तभी भेजे जाते हैं जब वह ऐप खोलता है, इसलिए कोई पंक्ति थोड़ी पीछे हो सकती है।",
    id: "Di bawah setiap angka, sebaris kecil berwarna abu-abu menyebut kapan baris itu terakhir diperbarui — langkah setiap orang hanya terkirim saat orang itu membuka aplikasi, jadi sebuah baris bisa sedikit tertinggal.",
    tr: "Her sayının altında küçük, gri bir satır o sıranın en son ne zaman güncellendiğini söyler — herkesin adımları yalnızca o kişi uygulamayı açtığında gönderilir, bu yüzden bir sıra biraz geride kalabilir.",
    ru: "Под каждым числом маленькая серая строка говорит, когда эта строка обновлялась в последний раз: шаги каждого человека отправляются, только когда он открывает приложение, поэтому строка может немного отставать.",
    vi: "Dưới mỗi con số, một dòng nhỏ màu xám cho biết hàng đó được cập nhật lần cuối khi nào — số bước của mỗi người chỉ được gửi khi người đó mở ứng dụng, nên một hàng có thể hơi chậm một chút.",
    ar: "تحت كل رقم، يقول سطر صغير رمادي متى حُدِّث ذلك الصف آخر مرة — لا تنتقل خطوات كل شخص إلا حين يفتح ذلك الشخص التطبيق، لذا قد يتأخر صف قليلًا.",
  },
  };
  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = M[k];
    else Object.keys(M[k]).forEach(function (l) { if (!CF_UI_MAP[k][l]) CF_UI_MAP[k][l] = M[k][l]; });
  });
})();
