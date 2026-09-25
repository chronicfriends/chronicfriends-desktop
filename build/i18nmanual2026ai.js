(function(){/* ===================================================================
   i18nmanual2026ai — the manual strings of THE GROUPED EVENING FLOW
   (8 Sep 2026, PROMPTCDrecorridonuevo).

   The evening route is no longer one question per screen but one GROUP
   per screen, in the Journal tab's own cards, so the Journal chapter
   needed: the rewritten topic «Your evening, screen by screen» (title ·
   body · 2 new steps · tip), the NEW topic «Your body map, in one tap»
   (title · body · problem), and the corrected sentence of «The daily
   check-in» (its whole body is the key).

   🔴 AMENDED 16 Sep 2026 (TAP20, Gerhard): the two sentences that
   described the screen leaving by itself were rewritten in all 16
   languages, in these same two slots — the body («Ten to fifteen
   screens; when you are done with one, tap Next — nothing moves until
   you do») and the second step («Tap your answers, then Next — the
   screen waits for you»). Nothing else in this file moved.

   🔴 AMENDED AGAIN 18 Sep 2026 (TAP22, Gerhard): the foot pill of the
   flow now always reads «Next», on the map screens too, so the body of
   «Your body map, in one tap» was rewritten in all 16 languages IN THIS
   SAME SLOT — «Next» without touching anything records nothing at all,
   and «Save for today» became the quiet line above the pill. Not one
   language needed a new word: «Next» was already in this file, and the
   `problem` of that topic (which talks about skipping, the act, not the
   button) was deliberately left as it is.

   🔴 Every button name inside a <strong> tag comes from the RESOLVED
   live dictionary, never from the first file a grep finds:
     Save for today → i18ngap2c.jsx (es Guardar para hoy · ca Desa per a
                      avui · fr Enregistrer pour aujourd’hui · de Für
                      heute speichern · it Salva per oggi · pt Guardar
                      para hoje · zh 保存到今天 · ja 今日の分を保存 ·
                      ko 오늘로 저장 · hi आज के लिए सहेजें · id Simpan
                      untuk hari ini · tr Bugün için kaydet ·
                      ru Сохранить на сегодня · vi Lưu cho hôm nay ·
                      ar احفظ لليوم)
     Skip           → NOT USED ANY MORE (TAP22, 17 Sep 2026): the
                      foot pill always reads «Next», so the map
                      sentence names «Next» too. The i18n-flare8
                      entry for «Skip» stays there as a reserve, and
                      no visible string of the flow or of the manual
                      uses it.
     Check-In       → the body below reuses, word for word, the
                      localized button name each language already had in
                      i18nmanual2026af.jsx: only the last sentence
                      changed («one question at a time» → «screen by
                      screen, in these same cards»).
     Next           → TAP20 (16 Sep 2026): the screen no longer moves on
                      by itself, so the body and the second step NAME the
                      foot button. «Next» is defined twice — i18n-flare8
                      (loaded first) and i18nlandscape (which only fills
                      what is missing) — so what RESOLVES, and what is
                      typed here, is es Siguiente · ca Següent ·
                      fr Suivant · de Weiter · it Avanti · pt Seguinte ·
                      zh 下一步 · ja 次へ · ko 다음 · hi आगे ·
                      id Lanjut · tr İleri · ru Далее · vi Tiếp ·
                      ar التالي — the same words the fourth step of this
                      very topic has shipped since 8 Sep.

   Two other strings changed WITHOUT coming here, because their 15
   translations were already right and only the English carried the
   retired clause: the body and the last step of «Rate pain, energy &
   more» (the inner weather is no longer asked anywhere). They live in
   the INDEX-ADDRESSED table, so the English was updated in
   i18nmanualkeys.jsx at slots 43 and 48 — the same slots, so every
   existing translation follows the new key.

   All 15 non-English languages. Merge-if-missing.
   Loaded after build/i18nmanual2026ah.js.
   =================================================================== */
(function () {
  if (!window.CF_UI_MAP) return;
  var M = {
  /* ---------- Journal › the grouped evening flow ---------- */
  'Your evening, screen by screen': {
    es: 'Tu noche, pantalla a pantalla',
    ca: 'El teu vespre, pantalla a pantalla',
    fr: 'Votre soirée, écran par écran',
    de: 'Dein Abend, Bildschirm für Bildschirm',
    it: 'La tua sera, schermata per schermata',
    pt: 'A tua noite, ecrã a ecrã',
    zh: '你的夜晚，一屏一屏来',
    ja: '夜のひととき、画面ごとに',
    ko: '저녁 시간, 화면 단위로',
    hi: 'आपकी शाम, स्क्रीन-दर-स्क्रीन',
    id: 'Malammu, layar demi layar',
    tr: 'Akşamın, ekran ekran',
    ru: 'Ваш вечер, экран за экраном',
    vi: 'Buổi tối của bạn, từng màn hình',
    ar: 'مساؤك، شاشةً بشاشة',
  },
  'In the evening your reminder opens the quick way to log a day: the same cards you already know from your journal, <strong>one group per screen</strong> — how you feel, your day, your habits, the people around you, then each of your trackers. Ten to fifteen screens; when you are done with one, tap <strong>Next</strong> — nothing moves until you do. Nothing to scroll, and the keyboard stays shut unless you open it.': {
    es: 'Por la noche tu recordatorio abre la manera rápida de registrar un día: las mismas tarjetas que ya conoces de tu diario, <strong>un grupo por pantalla</strong>: cómo te sientes, tu día, tus hábitos, la gente que te rodea y después cada uno de tus seguimientos. Entre diez y quince pantallas; cuando acabes una, pulsa <strong>Siguiente</strong>: nada se mueve hasta que lo hagas. Nada que desplazar, y el teclado no se abre si no lo abres tú.',
    ca: 'Al vespre el teu recordatori obre la manera ràpida de registrar un dia: les mateixes targetes que ja coneixes del teu diari, <strong>un grup per pantalla</strong>: com et sents, el teu dia, els teus hàbits, la gent que t’envolta i després cadascun dels teus seguiments. Entre deu i quinze pantalles; quan acabis una, prem <strong>Següent</strong>: res no es mou fins que ho facis. Res per desplaçar, i el teclat no s’obre si no l’obres tu.',
    fr: 'Le soir, votre rappel ouvre la façon rapide de noter une journée : les mêmes cartes que vous connaissez déjà de votre journal, <strong>un groupe par écran</strong> — comment vous vous sentez, votre journée, vos habitudes, les gens autour de vous, puis chacun de vos suivis. Entre dix et quinze écrans ; quand vous avez fini avec un écran, touchez <strong>Suivant</strong> : rien ne bouge avant. Rien à faire défiler, et le clavier reste fermé sauf si vous l’ouvrez.',
    de: 'Abends öffnet deine Erinnerung den schnellen Weg, einen Tag zu erfassen: dieselben Karten, die du aus deinem Tagebuch kennst, <strong>eine Gruppe pro Bildschirm</strong> — wie du dich fühlst, dein Tag, deine Gewohnheiten, die Menschen um dich, dann jeder deiner Tracker. Zehn bis fünfzehn Bildschirme; bist du mit einem fertig, tippe auf <strong>Weiter</strong> — nichts bewegt sich, bis du das tust. Nichts zu scrollen, und die Tastatur bleibt zu, wenn du sie nicht öffnest.',
    it: 'La sera il tuo promemoria apre il modo rapido di registrare una giornata: le stesse schede che già conosci dal tuo diario, <strong>un gruppo per schermata</strong> — come ti senti, la tua giornata, le tue abitudini, le persone intorno a te e poi ognuno dei tuoi tracker. Da dieci a quindici schermate; quando hai finito una, tocca <strong>Avanti</strong>: niente si muove finché non lo fai. Niente da scorrere, e la tastiera resta chiusa se non la apri tu.',
    pt: 'À noite o teu lembrete abre a maneira rápida de registar um dia: os mesmos cartões que já conheces do teu diário, <strong>um grupo por ecrã</strong> — como te sentes, o teu dia, os teus hábitos, as pessoas à tua volta e depois cada um dos teus seguimentos. Entre dez e quinze ecrãs; quando acabares um, toca em <strong>Seguinte</strong>: nada se move até o fazeres. Nada para deslizar, e o teclado só abre se o abrires tu.',
    zh: '到了晚上，提醒会打开记录一天的快捷方式：就是你在日记里熟悉的那些卡片，<strong>每屏一组</strong>——你的感受、你的一天、你的习惯、身边的人，然后是你每一个追踪项。十到十五屏；一屏答完后点<strong>下一步</strong>——你不点，它就不动。不用滚动，键盘也只有你去点才会打开。',
    ja: '夜になるとリマインダーが、1日を記録する近道を開きます。日記でおなじみの同じカードで、<strong>1画面に1グループ</strong> — 体調、その日のこと、習慣、まわりの人、そしてトラッカーごとに。画面は10〜15枚。ひとつ終えたら<strong>次へ</strong>をタップ — タップするまで何も動きません。スクロールは不要、キーボードは自分で開かないかぎり出てきません。',
    ko: '저녁이 되면 알림이 하루를 기록하는 빠른 길을 엽니다. 일지에서 이미 익숙한 그 카드로, <strong>한 화면에 한 그룹</strong> — 오늘의 몸, 하루, 습관, 주변 사람들, 그리고 추적 항목 하나하나. 화면은 열에서 열다섯 개, 한 화면을 마쳤으면 <strong>다음</strong>을 누르세요 — 누를 때까지 아무것도 움직이지 않아요. 스크롤할 것도 없고, 키보드는 직접 누르지 않으면 열리지 않아요.',
    hi: 'शाम को आपका रिमाइंडर दिन दर्ज करने का तेज़ रास्ता खोलता है: वही कार्ड जो आप अपनी डायरी से पहचानते हैं, <strong>हर स्क्रीन पर एक समूह</strong> — आप कैसा महसूस करते हैं, आपका दिन, आपकी आदतें, आपके आसपास के लोग, और फिर आपका हर ट्रैकर। दस से पंद्रह स्क्रीन; एक पूरी हो जाए तो <strong>आगे</strong> दबाएँ — जब तक आप न दबाएँ, कुछ नहीं बदलता। कुछ स्क्रॉल करना नहीं, और कीबोर्ड तभी खुलता है जब आप उसे खोलें।',
    id: 'Pada malam hari pengingatmu membuka cara cepat mencatat satu hari: kartu-kartu yang sudah kamu kenal dari jurnalmu, <strong>satu kelompok per layar</strong> — bagaimana perasaanmu, harimu, kebiasaanmu, orang-orang di sekitarmu, lalu setiap pelacakmu. Sepuluh sampai lima belas layar; kalau satu layar sudah selesai, ketuk <strong>Lanjut</strong> — tidak ada yang berpindah sebelum kamu mengetuknya. Tidak ada yang perlu digeser, dan papan tombol tetap tertutup kecuali kamu membukanya.',
    tr: 'Akşam hatırlatıcın bir günü kaydetmenin hızlı yolunu açar: günlüğünden tanıdığın aynı kartlar, <strong>ekran başına bir grup</strong> — nasıl olduğun, günün, alışkanlıkların, çevrendeki insanlar ve sonra her takibin. On ile on beş ekran; bir ekranı bitirdiğinde <strong>İleri</strong> düğmesine dokun — sen dokunmadıkça hiçbir şey ilerlemez. Kaydıracak bir şey yok, klavye de sen açmadıkça açılmaz.',
    ru: 'Вечером напоминание открывает быстрый способ записать день: те же карточки, что вы знаете из своего дневника, <strong>по одной группе на экран</strong> — как вы себя чувствуете, ваш день, ваши привычки, люди вокруг, а затем каждый ваш дневник наблюдений. От десяти до пятнадцати экранов; закончив экран, нажмите <strong>Далее</strong> — без этого ничего не сдвинется. Ничего не нужно прокручивать, а клавиатура откроется только если вы её откроете.',
    vi: 'Buổi tối, lời nhắc mở cách nhanh nhất để ghi lại một ngày: vẫn những thẻ bạn đã quen trong sổ tay, <strong>mỗi màn hình một nhóm</strong> — bạn cảm thấy thế nào, ngày của bạn, thói quen, những người quanh bạn, rồi từng mục theo dõi. Mười đến mười lăm màn hình; xong một màn hình thì chạm <strong>Tiếp</strong> — bạn chưa chạm thì không có gì chuyển. Không có gì phải cuộn, và bàn phím chỉ mở khi bạn tự mở.',
    ar: 'في المساء يفتح تذكيرك الطريق السريع لتدوين اليوم: البطاقات نفسها التي تعرفها من دفترك، <strong>مجموعة واحدة في كل شاشة</strong> — كيف تشعر، يومك، عاداتك، من حولك، ثم كل متعقّب من متعقّباتك. من عشر إلى خمس عشرة شاشة؛ وعندما تنتهي من شاشة اضغط <strong>التالي</strong> — لا يتحرك شيء قبل ذلك. لا شيء للتمرير، ولوحة المفاتيح لا تُفتح إلا إذا فتحتها أنت.',
  },
  'Tap your answers, then <strong>Next</strong> — the screen waits for you.': {
    es: 'Toca tus respuestas y después <strong>Siguiente</strong>: la pantalla te espera.',
    ca: 'Toca les teves respostes i després <strong>Següent</strong>: la pantalla t’espera.',
    fr: 'Touchez vos réponses, puis <strong>Suivant</strong> : l’écran vous attend.',
    de: 'Tippe deine Antworten an, dann <strong>Weiter</strong> — der Bildschirm wartet auf dich.',
    it: 'Tocca le tue risposte e poi <strong>Avanti</strong>: la schermata ti aspetta.',
    pt: 'Toca nas tuas respostas e depois <strong>Seguinte</strong>: o ecrã espera por ti.',
    zh: '点选你的答案，然后点<strong>下一步</strong>——这一屏会等你。',
    ja: '答えをタップして、<strong>次へ</strong> — 画面はあなたを待っています。',
    ko: '답을 누르고 <strong>다음</strong>을 누르세요 — 화면은 당신을 기다립니다.',
    hi: 'अपने जवाब चुनें, फिर <strong>आगे</strong> — स्क्रीन आपका इंतज़ार करती है।',
    id: 'Ketuk jawabanmu, lalu <strong>Lanjut</strong> — layarnya menunggumu.',
    tr: 'Yanıtlarına dokun, sonra <strong>İleri</strong> — ekran seni bekler.',
    ru: 'Нажимайте свои ответы, потом <strong>Далее</strong> — экран вас ждёт.',
    vi: 'Chạm vào câu trả lời, rồi <strong>Tiếp</strong> — màn hình chờ bạn.',
    ar: 'اضغط أجوبتك ثم <strong>التالي</strong> — الشاشة تنتظرك.',
  },
  'The counter at the top says which screen you are on and how many there are; a day you have already answered opens with your answers marked.': {
    es: 'El contador de arriba dice en qué pantalla vas y cuántas hay; un día ya contestado se abre con tus respuestas marcadas.',
    ca: 'El comptador de dalt diu en quina pantalla vas i quantes n’hi ha; un dia ja contestat s’obre amb les teves respostes marcades.',
    fr: 'Le compteur en haut indique à quel écran vous êtes et combien il y en a ; une journée déjà répondue s’ouvre avec vos réponses cochées.',
    de: 'Der Zähler oben sagt, auf welchem Bildschirm du bist und wie viele es sind; ein Tag, den du schon beantwortet hast, öffnet sich mit deinen Antworten markiert.',
    it: 'Il contatore in alto dice a quale schermata sei e quante ce ne sono; una giornata già risposta si apre con le tue risposte segnate.',
    pt: 'O contador em cima diz em que ecrã vais e quantos há; um dia já respondido abre com as tuas respostas marcadas.',
    zh: '顶部的计数器告诉你在第几屏、一共几屏；已经答过的一天，打开时你的答案都还在。',
    ja: '上のカウンターが何画面目か、全部で何画面かを示します。すでに答えた日は、答えが選ばれた状態で開きます。',
    ko: '위쪽 카운터가 몇 번째 화면이고 전부 몇 개인지 알려줘요. 이미 답한 날은 답이 표시된 채로 열립니다.',
    hi: 'ऊपर का काउंटर बताता है कि आप कौन-सी स्क्रीन पर हैं और कुल कितनी हैं; पहले से भरा हुआ दिन आपके जवाबों के साथ खुलता है।',
    id: 'Penghitung di atas menunjukkan kamu di layar ke berapa dan ada berapa layar; hari yang sudah kamu jawab terbuka dengan jawabanmu tertandai.',
    tr: 'Yukarıdaki sayaç kaçıncı ekranda olduğunu ve kaç ekran olduğunu söyler; daha önce yanıtladığın bir gün, yanıtların işaretli olarak açılır.',
    ru: 'Счётчик сверху говорит, на каком вы экране и сколько их всего; уже отвеченный день открывается с вашими ответами.',
    vi: 'Bộ đếm ở trên cho biết bạn đang ở màn hình nào và có bao nhiêu màn hình; một ngày bạn đã trả lời sẽ mở ra với các câu trả lời đã chọn.',
    ar: 'العدّاد في الأعلى يقول في أي شاشة أنت وكم شاشة هناك؛ ويوم أجبت عنه من قبل يُفتح وأجوبتك محدَّدة.',
  },
  'Writing is optional and never holds a screen back: the pain comment and each tracker’s note sit on the screen of their group, and the keyboard only opens if you tap one. Steps and sleep your phone already knows arrive answered, with the line that says where they came from — change them and your answer wins.': {
    es: 'Escribir es opcional y nunca frena una pantalla: el comentario del dolor y la nota de cada seguimiento están en la pantalla de su grupo, y el teclado solo se abre si tocas uno. Los pasos y el sueño que tu teléfono ya sabe llegan contestados, con la línea que dice de dónde vienen; si los cambias, gana tu respuesta.',
    ca: 'Escriure és opcional i no frena mai una pantalla: el comentari del dolor i la nota de cada seguiment són a la pantalla del seu grup, i el teclat només s’obre si en toques un. Els passos i el son que el teu telèfon ja sap arriben contestats, amb la línia que diu d’on vénen; si els canvies, guanya la teva resposta.',
    fr: 'Écrire est optionnel et ne bloque jamais un écran : le commentaire de la douleur et la note de chaque suivi sont sur l’écran de leur groupe, et le clavier ne s’ouvre que si vous en touchez un. Les pas et le sommeil que votre téléphone connaît déjà arrivent déjà répondus, avec la ligne qui dit d’où ils viennent ; si vous les modifiez, votre réponse gagne.',
    de: 'Schreiben ist freiwillig und hält nie einen Bildschirm auf: der Schmerz-Kommentar und die Notiz jedes Trackers stehen auf dem Bildschirm ihrer Gruppe, und die Tastatur öffnet sich nur, wenn du eine antippst. Schritte und Schlaf, die dein Handy schon kennt, kommen beantwortet an, mit der Zeile, die sagt, woher sie stammen — änderst du sie, gewinnt deine Antwort.',
    it: 'Scrivere è facoltativo e non trattiene mai una schermata: il commento del dolore e la nota di ogni tracker stanno nella schermata del loro gruppo, e la tastiera si apre solo se ne tocchi una. I passi e il sonno che il telefono già conosce arrivano già risposti, con la riga che dice da dove vengono: se li cambi, vince la tua risposta.',
    pt: 'Escrever é opcional e nunca trava um ecrã: o comentário da dor e a nota de cada seguimento estão no ecrã do seu grupo, e o teclado só abre se tocares num. Os passos e o sono que o teu telefone já sabe chegam respondidos, com a linha que diz de onde vêm; se os mudares, ganha a tua resposta.',
    zh: '写字是可选的，从不拦着一屏往下走：疼痛备注和每个追踪项的备注都在自己那一组的屏上，只有你去点，键盘才会打开。手机已经知道的步数和睡眠会带着答案出现，下面一行会说它们来自哪里——你改了，就以你的答案为准。',
    ja: '書くのは任意で、画面を止めることはありません。痛みのコメントと各トラッカーのメモは、そのグループの画面にあり、キーボードは自分でタップしたときだけ開きます。スマホがすでに知っている歩数と睡眠は答え済みで届き、どこから来たかを示す行がつきます — 自分で直せば、あなたの答えが優先されます。',
    ko: '글쓰기는 선택이고 화면을 붙잡지 않아요. 통증 메모와 각 추적의 메모는 자기 그룹 화면에 있고, 키보드는 직접 누를 때만 열립니다. 휴대폰이 이미 아는 걸음 수와 수면은 답이 채워진 채 도착하고, 어디서 왔는지 알려주는 줄이 붙어요 — 직접 바꾸면 당신의 답이 이깁니다.',
    hi: 'लिखना वैकल्पिक है और किसी स्क्रीन को कभी नहीं रोकता: दर्द की टिप्पणी और हर ट्रैकर का नोट अपने समूह की स्क्रीन पर होते हैं, और कीबोर्ड तभी खुलता है जब आप उसे छूएँ। जो कदम और नींद आपका फ़ोन पहले से जानता है, वे जवाब के साथ आते हैं और नीचे की लाइन बताती है कि वे कहाँ से आए — आप बदल दें तो आपका जवाब ही चलता है।',
    id: 'Menulis itu opsional dan tidak pernah menahan satu layar: komentar nyeri dan catatan setiap pelacak ada di layar kelompoknya, dan papan tombol hanya terbuka kalau kamu mengetuknya. Langkah dan tidur yang sudah diketahui ponselmu datang terjawab, dengan baris yang menyebut asalnya — kalau kamu mengubahnya, jawabanmu yang menang.',
    tr: 'Yazmak isteğe bağlıdır ve hiçbir ekranı bekletmez: ağrı yorumu ve her takibin notu kendi grubunun ekranındadır, klavye de yalnızca sen dokunursan açılır. Telefonunun zaten bildiği adım ve uyku yanıtlanmış olarak gelir, nereden geldiğini söyleyen satırla birlikte — değiştirirsen senin yanıtın geçer.',
    ru: 'Писать необязательно, и это никогда не задерживает экран: комментарий о боли и заметка каждого дневника наблюдений стоят на экране своей группы, а клавиатура открывается только если вы её нажмёте. Шаги и сон, которые телефон уже знает, приходят с ответом и строкой о том, откуда они — измените их, и победит ваш ответ.',
    vi: 'Viết là tuỳ chọn và không bao giờ giữ màn hình lại: ghi chú về cơn đau và ghi chú của từng mục theo dõi nằm trên màn hình của nhóm mình, và bàn phím chỉ mở nếu bạn chạm vào. Số bước và giấc ngủ mà điện thoại đã biết sẽ đến kèm câu trả lời, với dòng cho biết chúng từ đâu — bạn sửa thì câu trả lời của bạn thắng.',
    ar: 'الكتابة اختيارية ولا توقف شاشة أبدًا: تعليق الألم وملاحظة كل متعقّب موجودان في شاشة مجموعتهما، ولوحة المفاتيح لا تُفتح إلا إذا ضغطتها. الخطوات والنوم التي يعرفها هاتفك تصل مُجابة، مع السطر الذي يقول من أين جاءت — وإذا غيّرتها فجوابك هو الذي يبقى.',
  },
  /* ---------- Journal › the three maps in the evening flow ---------- */
  'Your body map, in one tap': {
    es: 'Tu mapa del cuerpo, en un toque',
    ca: 'El teu mapa del cos, en un toc',
    fr: 'Votre carte du corps, en une touche',
    de: 'Deine Körperkarte, mit einem Tipp',
    it: 'La tua mappa del corpo, in un tocco',
    pt: 'O teu mapa do corpo, num toque',
    zh: '你的身体图，一点就好',
    ja: 'からだの地図を、ワンタップで',
    ko: '몸 지도, 한 번의 터치로',
    hi: 'आपका शरीर-नक़्शा, एक टैप में',
    id: 'Peta tubuhmu, dalam satu ketukan',
    tr: 'Vücut haritan, tek dokunuşta',
    ru: 'Ваша карта тела — одним касанием',
    vi: 'Bản đồ cơ thể của bạn, chỉ một lần chạm',
    ar: 'خريطة جسدك، بلمسة واحدة',
  },
  'Each of your maps — the body map for joints, the skin map, the pelvic map — gets a screen of its own in the evening, and it opens with the zones of the last day you logged still painted. If today feels the same, <strong>Save for today</strong> records every one of them for today in a single tap. <strong>Next</strong> without touching anything records nothing at all: the zones stay on screen as the memory of that other day, and today keeps no entry.': {
    es: 'Cada uno de tus mapas —el del cuerpo para las articulaciones, el de la piel, el pélvico— tiene su propia pantalla por la noche, y se abre con las zonas del último día que registraste todavía pintadas. Si hoy se siente igual, <strong>Guardar para hoy</strong> las registra todas para hoy de un solo toque. <strong>Siguiente</strong> sin tocar nada no registra nada: las zonas siguen en pantalla como recuerdo de aquel otro día, y hoy no se queda con ningún apunte.',
    ca: 'Cadascun dels teus mapes —el del cos per a les articulacions, el de la pell, el pelvià— té la seva pròpia pantalla al vespre, i s’obre amb les zones de l’últim dia que vas registrar encara pintades. Si avui se sent igual, <strong>Desa per a avui</strong> les registra totes per a avui amb un sol toc. <strong>Següent</strong> sense tocar res no registra res: les zones es queden a la pantalla com a record d’aquell altre dia, i avui no es queda amb cap apunt.',
    fr: 'Chacune de vos cartes — celle du corps pour les articulations, celle de la peau, la pelvienne — a son propre écran le soir, et elle s’ouvre avec les zones du dernier jour noté encore colorées. Si aujourd’hui ressemble à ce jour-là, <strong>Enregistrer pour aujourd’hui</strong> les note toutes pour aujourd’hui d’une seule touche. <strong>Suivant</strong> sans rien toucher ne note rien du tout : les zones restent à l’écran comme le souvenir de cet autre jour, et aujourd’hui ne garde aucune entrée.',
    de: 'Jede deiner Karten — die Körperkarte für die Gelenke, die Hautkarte, die Beckenkarte — hat abends ihren eigenen Bildschirm, und sie öffnet sich mit den Zonen des letzten erfassten Tages noch eingefärbt. Fühlt sich heute genauso an, erfasst <strong>Für heute speichern</strong> sie alle mit einem einzigen Tipp für heute. <strong>Weiter</strong>, ohne etwas anzutippen, erfasst überhaupt nichts: die Zonen bleiben als Erinnerung an jenen anderen Tag stehen, und heute behält keinen Eintrag.',
    it: 'Ognuna delle tue mappe — quella del corpo per le articolazioni, quella della pelle, quella pelvica — ha la sua schermata la sera, e si apre con le zone dell’ultimo giorno registrato ancora colorate. Se oggi è uguale, <strong>Salva per oggi</strong> le registra tutte per oggi con un solo tocco. <strong>Avanti</strong> senza toccare nulla non registra nulla: le zone restano sullo schermo come ricordo di quell’altro giorno, e oggi non tiene nessuna voce.',
    pt: 'Cada um dos teus mapas — o do corpo para as articulações, o da pele, o pélvico — tem o seu próprio ecrã à noite, e abre com as zonas do último dia que registaste ainda pintadas. Se hoje se sente igual, <strong>Guardar para hoje</strong> regista-as todas para hoje num só toque. <strong>Seguinte</strong> sem tocar em nada não regista nada: as zonas ficam no ecrã como memória desse outro dia, e hoje não fica com nenhum registo.',
    zh: '你的每一张图——关节的身体图、皮肤图、盆腔图——晚上都有自己的一屏，打开时你上次记录那天的部位仍然是上色的。如果今天感觉一样，<strong>保存到今天</strong>一点就把它们全部记到今天。什么都不碰直接按<strong>下一步</strong>，就什么都不记：那些部位留在屏幕上，只是那一天的记忆，今天不会留下任何记录。',
    ja: '地図はどれも — 関節のからだの地図、皮膚の地図、骨盤の地図 — 夜はそれぞれ専用の画面になり、最後に記録した日の部位が色のまま開きます。今日も同じなら、<strong>今日の分を保存</strong>でワンタップですべて今日として記録。何も触らずに<strong>次へ</strong>を押すと、何も記録されません。部位はその日の記憶として画面に残り、今日には記録が残りません。',
    ko: '지도는 모두 — 관절의 몸 지도, 피부 지도, 골반 지도 — 저녁에 각자 화면을 가지며, 마지막으로 기록한 날의 부위가 그대로 칠해진 채 열립니다. 오늘도 같다면 <strong>오늘로 저장</strong> 한 번으로 모두 오늘 기록이 됩니다. 아무것도 건드리지 않고 <strong>다음</strong>을 누르면 아무것도 기록되지 않아요. 부위는 그날의 기억으로 화면에 남고, 오늘에는 기록이 남지 않습니다.',
    hi: 'आपका हर नक़्शा — जोड़ों का शरीर-नक़्शा, त्वचा का, पेल्विक — शाम को अपनी अलग स्क्रीन पाता है, और वह पिछली बार दर्ज किए दिन के हिस्सों के रंग के साथ खुलता है। अगर आज भी वैसा ही लगता है, तो <strong>आज के लिए सहेजें</strong> एक ही टैप में उन सबको आज के लिए दर्ज कर देता है। कुछ भी छुए बिना <strong>आगे</strong> करने पर कुछ भी दर्ज नहीं होता: हिस्से उस दूसरे दिन की याद के तौर पर स्क्रीन पर रहते हैं, और आज के लिए कोई प्रविष्टि नहीं बनती।',
    id: 'Setiap petamu — peta tubuh untuk persendian, peta kulit, peta panggul — punya layarnya sendiri di malam hari, dan terbuka dengan zona dari hari terakhir yang kamu catat masih berwarna. Kalau hari ini terasa sama, <strong>Simpan untuk hari ini</strong> mencatat semuanya untuk hari ini dalam satu ketukan. <strong>Lanjut</strong> tanpa menyentuh apa pun tidak mencatat apa pun: zonanya tetap di layar sebagai kenangan hari itu, dan hari ini tidak menyimpan catatan.',
    tr: 'Haritalarının her biri — eklemler için vücut haritası, cilt haritası, pelvis haritası — akşam kendi ekranını alır ve son kaydettiğin günün bölgeleri hâlâ boyalı olarak açılır. Bugün de aynıysa, <strong>Bugün için kaydet</strong> tek dokunuşta hepsini bugüne kaydeder. Hiçbir şeye dokunmadan <strong>İleri</strong> hiçbir şey kaydetmez: bölgeler o günün hatırası olarak ekranda kalır, bugüne hiçbir kayıt geçmez.',
    ru: 'Каждая ваша карта — карта тела для суставов, карта кожи, карта таза — вечером получает свой экран и открывается с закрашенными зонами последнего записанного дня. Если сегодня всё так же, <strong>Сохранить на сегодня</strong> одним касанием записывает их все на сегодня. <strong>Далее</strong> без единого касания не записывает вообще ничего: зоны остаются на экране как память о том дне, а у сегодняшнего дня записи не появится.',
    vi: 'Mỗi bản đồ của bạn — bản đồ cơ thể cho khớp, bản đồ da, bản đồ vùng chậu — có màn hình riêng vào buổi tối, và mở ra với các vùng của ngày cuối bạn ghi vẫn còn tô màu. Nếu hôm nay cũng vậy, <strong>Lưu cho hôm nay</strong> ghi tất cả cho hôm nay chỉ trong một lần chạm. <strong>Tiếp</strong> mà không chạm gì thì không ghi gì cả: các vùng vẫn ở đó như ký ức của ngày kia, còn hôm nay không có mục nào.',
    ar: 'كل خريطة من خرائطك — خريطة الجسد للمفاصل، وخريطة الجلد، وخريطة الحوض — لها شاشتها الخاصة في المساء، وتُفتح ومناطق آخر يوم سجّلته ما زالت ملوّنة. وإن كان اليوم مثله، فإن <strong>احفظ لليوم</strong> يسجّلها كلها لليوم بلمسة واحدة. أما <strong>التالي</strong> دون لمس أي شيء فلا يسجّل شيئًا على الإطلاق: تبقى المناطق على الشاشة كذكرى ذلك اليوم الآخر، ولا يحتفظ اليوم بأي تدوينة.',
  },
  'A map is answered zone by zone, which is a lot of taps on a day when nothing has changed — and that is exactly how a map ends up empty. One tap for “the same as before” is comfortable and true. Skipping has to write nothing, because a day you walked past must never turn up in your doctor’s report as pain you never reported.': {
    es: 'Un mapa se contesta zona por zona, que son muchos toques en un día en que nada ha cambiado, y así es exactamente como un mapa acaba vacío. Un toque para «sigue igual» es cómodo y es verdad. Y saltar tiene que no escribir nada, porque un día que pasaste de largo nunca debe aparecer en el informe de tu médico como un dolor que no contaste.',
    ca: 'Un mapa es contesta zona per zona, que són molts tocs en un dia en què res no ha canviat, i així és exactament com un mapa acaba buit. Un toc per a «segueix igual» és còmode i és veritat. I saltar ha de no escriure res, perquè un dia que vas passar de llarg no ha d’aparèixer mai a l’informe del teu metge com un dolor que no vas explicar.',
    fr: 'Une carte se remplit zone par zone, ce qui fait beaucoup de touches un jour où rien n’a changé — et c’est exactement comme ça qu’une carte finit vide. Une touche pour « comme avant » est confortable et vraie. Et passer doit n’écrire rien du tout, car une journée que vous avez laissée de côté ne doit jamais apparaître dans le rapport de votre médecin comme une douleur que vous n’avez pas signalée.',
    de: 'Eine Karte wird Zone für Zone beantwortet — an einem Tag, an dem sich nichts geändert hat, sind das viele Tipps, und genau so bleibt eine Karte am Ende leer. Ein Tipp für „wie gehabt“ ist bequem und wahr. Und Überspringen muss überhaupt nichts schreiben, denn ein Tag, an dem du vorbeigegangen bist, darf im Bericht deiner Ärztin nie als Schmerz auftauchen, den du nie gemeldet hast.',
    it: 'Una mappa si risponde zona per zona, che sono molti tocchi in un giorno in cui non è cambiato niente — ed è esattamente così che una mappa finisce vuota. Un tocco per «come prima» è comodo e vero. E saltare deve non scrivere niente, perché un giorno che hai passato oltre non deve mai comparire nel referto del tuo medico come un dolore che non hai raccontato.',
    pt: 'Um mapa responde-se zona a zona, o que são muitos toques num dia em que nada mudou — e é exatamente assim que um mapa acaba vazio. Um toque para «continua igual» é cómodo e é verdade. E saltar tem de não escrever nada, porque um dia que passaste ao lado nunca deve aparecer no relatório do teu médico como uma dor que não contaste.',
    zh: '一张图要一个部位一个部位地答，在什么都没变的一天里就是很多次点击——图最后就是这样变空的。为“和之前一样”只点一次，既省事也是真话。而跳过就必须什么都不写，因为你路过的一天，绝不该在医生看的报告里变成你从没说过的疼。',
    ja: '地図は部位ごとに答えるので、何も変わっていない日には多くのタップが必要で — まさにそれで地図は空のままになります。「前と同じ」をワンタップにするのは、楽であり、本当のことです。そしてスキップは何も書いてはいけません。通り過ぎた1日が、伝えていない痛みとして主治医の読むレポートに出てはならないからです。',
    ko: '지도는 부위마다 답해야 해서, 아무것도 달라지지 않은 날에는 탭이 너무 많아집니다 — 지도가 비어 있게 되는 이유가 바로 그것이에요. “전과 같다”를 한 번의 터치로 하는 건 편하고, 사실입니다. 그리고 건너뛰기는 아무것도 쓰지 않아야 해요. 그냥 지나간 하루가, 말하지 않은 통증으로 의사가 읽는 보고서에 나타나선 안 되니까요.',
    hi: 'नक़्शा हिस्सा-दर-हिस्सा भरा जाता है, और जिस दिन कुछ नहीं बदला उस दिन यह बहुत सारे टैप हैं — नक़्शा ठीक इसी तरह ख़ाली रह जाता है। “पहले जैसा ही” के लिए एक टैप आसान है और सच भी। और छोड़ने पर कुछ भी दर्ज नहीं होना चाहिए, क्योंकि जिस दिन आप आगे बढ़ गए, वह आपके डॉक्टर की रिपोर्ट में कभी ऐसे दर्द के रूप में न दिखे जो आपने बताया ही नहीं।',
    id: 'Peta dijawab zona demi zona, dan itu banyak ketukan di hari ketika tidak ada yang berubah — persis begitulah sebuah peta berakhir kosong. Satu ketukan untuk “sama seperti sebelumnya” itu nyaman dan benar. Dan melewati harus tidak menulis apa pun, karena hari yang kamu lewati tidak boleh muncul di laporan doktermu sebagai nyeri yang tidak pernah kamu sebutkan.',
    tr: 'Bir harita bölge bölge yanıtlanır; hiçbir şeyin değişmediği bir günde bu çok fazla dokunuş demektir — haritalar tam böyle boş kalır. “Öncekiyle aynı” için tek dokunuş hem rahat hem doğrudur. Atlamanın ise hiçbir şey yazmaması gerekir, çünkü yanından geçtiğin bir gün, doktorunun okuduğu raporda hiç bildirmediğin bir ağrı olarak görünmemeli.',
    ru: 'Карту заполняют зона за зоной, а в день, когда ничего не изменилось, это очень много касаний — именно так карта и остаётся пустой. Одно касание для «как раньше» удобно и правдиво. А «Пропустить» обязано не записывать ничего, потому что день, который вы прошли мимо, не должен появиться в отчёте для врача как боль, о которой вы не говорили.',
    vi: 'Bản đồ được trả lời từng vùng, và vào một ngày chẳng có gì thay đổi thì đó là rất nhiều lần chạm — đúng là cách một bản đồ trở nên trống rỗng. Một lần chạm cho “vẫn như trước” vừa dễ vừa thật. Còn bỏ qua thì phải không ghi gì cả, vì một ngày bạn đi ngang qua không bao giờ được xuất hiện trong báo cáo bác sĩ đọc như một cơn đau bạn chưa từng kể.',
    ar: 'تُجاب الخريطة منطقةً بمنطقة، وهذا كثير من اللمسات في يوم لم يتغيّر فيه شيء — وهكذا بالضبط تبقى الخريطة فارغة. لمسة واحدة لـ«كما كان» مريحة وصادقة. وأما التخطي فيجب ألا يكتب شيئًا، لأن يومًا مررت به مرور الكرام لا يصح أن يظهر في تقرير طبيبك كألم لم تُبلّغ عنه قط.',
  },
  /* ---------- Journal › the daily check-in (one sentence changed) ---------- */
  'Tap the big <strong>Check-In</strong> button once a day. It opens today’s entry and saves automatically as you go, and the questions <strong>adapt to your conditions</strong> — tracker questions appear only for the trackers you keep on. In the evening the app asks you about the same day screen by screen, in these same cards, so this form is here for when you feel like writing, not the only way in.': {
    es: 'Toca el botón grande <strong>Registro</strong> una vez al día. Abre el registro de hoy y se guarda solo mientras lo rellenas, y las preguntas <strong>se adaptan a tus enfermedades</strong>: las preguntas de un seguimiento solo aparecen si lo tienes activado. Por la noche la app te pregunta por el mismo día pantalla a pantalla, en estas mismas tarjetas, así que este formulario está aquí para cuando te apetezca escribir, no como única puerta.',
    ca: 'Toca el botó gran <strong>Registre</strong> un cop al dia. Obre el registre d\'avui i es guarda sol mentre l\'omples, i les preguntes <strong>s\'adapten a les teves malalties</strong>: les preguntes d\'un seguiment només apareixen si el tens activat. Al vespre l\'app et pregunta pel mateix dia pantalla a pantalla, en aquestes mateixes targetes, així que aquest formulari hi és per quan tinguis ganes d\'escriure, no com a única porta.',
    fr: 'Touchez le grand bouton <strong>Bilan</strong> une fois par jour. Il ouvre la saisie du jour et enregistre tout seul à mesure, et les questions <strong>s\'adaptent à vos maladies</strong> : les questions d\'un suivi n\'apparaissent que si vous le gardez activé. Le soir, l\'application vous interroge sur la même journée écran par écran, dans ces mêmes cartes ; ce formulaire est donc là pour quand vous avez envie d\'écrire, pas comme seule entrée.',
    de: 'Tippe einmal am Tag auf den großen Knopf <strong>Check-in</strong>. Er öffnet den heutigen Eintrag und speichert von selbst, während du ausfüllst, und die Fragen <strong>richten sich nach deinen Erkrankungen</strong> — die Fragen eines Trackers erscheinen nur, wenn du ihn eingeschaltet lässt. Abends fragt die App denselben Tag Bildschirm für Bildschirm ab, in denselben Karten; dieses Formular ist also für die Momente da, in denen du schreiben willst, nicht der einzige Weg hinein.',
    it: 'Tocca il grande pulsante <strong>Check-in</strong> una volta al giorno. Apre la voce di oggi e si salva da sé mentre la compili, e le domande <strong>si adattano alle tue malattie</strong>: le domande di un tracker compaiono solo se lo tieni attivo. La sera l\'app ti chiede la stessa giornata schermata per schermata, nelle stesse schede, quindi questo modulo c\'è per quando ti va di scrivere, non come unica porta.',
    pt: 'Toca no botão grande <strong>Check-in</strong> uma vez por dia. Abre o registo de hoje e guarda-se sozinho enquanto o preenches, e as perguntas <strong>adaptam-se às tuas doenças</strong> — as perguntas de um seguimento só aparecem se o mantiveres ligado. À noite a aplicação pergunta-te pelo mesmo dia ecrã a ecrã, nestes mesmos cartões, por isso este formulário está aqui para quando te apetecer escrever, não como única porta.',
    zh: '每天点一次大的<strong>打卡</strong>按钮。它会打开今天的记录，边填边自动保存，而且问题会<strong>随你的疾病调整</strong>——某个追踪项的问题只在你保持开启时出现。到了晚上，应用会就同一天一屏一屏地问你，用的就是这些卡片，所以这份表单是留给你想写字的时候，而不是唯一的入口。',
    ja: '1日に一度、大きな<strong>チェックイン</strong>ボタンをタップします。きょうの記録が開き、書きながら自動で保存され、質問は<strong>あなたの病気に合わせて変わります</strong> — トラッカーの質問は、そのトラッカーをオンにしているときだけ出ます。夜にはアプリが同じ一日を、同じカードのまま画面ごとにたずねるので、このフォームは書きたい気分のときのためにあり、唯一の入口ではありません。',
    ko: '하루에 한 번 큰 <strong>체크인</strong> 버튼을 누르세요. 오늘의 기록이 열리고 채우는 동안 저절로 저장되며, 질문은 <strong>당신의 질환에 맞춰 바뀝니다</strong> — 어떤 추적의 질문은 그 추적을 켜 두었을 때만 나와요. 저녁에는 앱이 같은 하루를 같은 카드로 화면 단위로 물어보니, 이 서식은 글을 쓰고 싶을 때를 위한 것이고 유일한 입구가 아닙니다.',
    hi: 'दिन में एक बार बड़ा <strong>चेक-इन</strong> बटन दबाएँ। यह आज की प्रविष्टि खोलता है और भरते-भरते ख़ुद सहेजता है, और सवाल <strong>आपकी बीमारियों के अनुसार बदलते हैं</strong> — किसी ट्रैकर के सवाल तभी दिखते हैं जब वह चालू हो। शाम को ऐप उसी दिन के बारे में इन्हीं कार्डों में, स्क्रीन-दर-स्क्रीन पूछता है, इसलिए यह फ़ॉर्म तब के लिए है जब आपका लिखने का मन हो, यही एकमात्र रास्ता नहीं।',
    id: 'Ketuk tombol besar <strong>Check-in</strong> sekali sehari. Ia membuka catatan hari ini dan menyimpan sendiri sambil kamu mengisi, dan pertanyaannya <strong>menyesuaikan dengan penyakitmu</strong> — pertanyaan sebuah pelacak hanya muncul kalau pelacaknya kamu biarkan menyala. Pada malam hari aplikasi menanyakan hari yang sama layar demi layar, dengan kartu yang sama, jadi formulir ini ada untuk saat kamu ingin menulis, bukan satu-satunya pintu.',
    tr: 'Günde bir kez büyük <strong>Kayıt</strong> düğmesine dokun. Bugünün kaydını açar ve sen doldururken kendiliğinden kaydeder, sorular da <strong>hastalıklarına göre değişir</strong> — bir takibin soruları yalnızca onu açık bıraktıysan çıkar. Akşam uygulama aynı günü, aynı kartlarla ekran ekran sorar; yani bu form yazmak istediğin zamanlar için var, tek kapı değil.',
    ru: 'Один раз в день нажмите большую кнопку <strong>Отметка</strong>. Она открывает сегодняшнюю запись и сохраняет всё сама, пока вы заполняете, а вопросы <strong>подстраиваются под ваши болезни</strong> — вопросы отдельного дневника появляются только если он включён. Вечером приложение спрашивает про тот же день экран за экраном, в этих же карточках, так что эта форма — для тех дней, когда хочется писать, а не единственный вход.',
    vi: 'Mỗi ngày chạm một lần vào nút lớn <strong>Điểm danh</strong>. Nó mở mục của hôm nay và tự lưu trong lúc bạn điền, và các câu hỏi <strong>thay đổi theo bệnh của bạn</strong> — câu hỏi của một mục theo dõi chỉ hiện nếu bạn để nó bật. Buổi tối, ứng dụng hỏi bạn về cùng ngày đó theo từng màn hình, trong chính những thẻ này, nên biểu mẫu này dành cho khi bạn muốn viết, không phải cửa duy nhất.',
    ar: 'اضغط الزر الكبير <strong>تسجيل</strong> مرة واحدة في اليوم. يفتح إدخال اليوم ويحفظ وحده أثناء تعبئتك، والأسئلة <strong>تتكيّف مع أمراضك</strong> — أسئلة أي متعقّب لا تظهر إلا إذا أبقيته مفعّلًا. في المساء يسألك التطبيق عن اليوم نفسه شاشةً بشاشة، وبالبطاقات نفسها، فهذه الاستمارة موجودة لحين ترغب في الكتابة، وليست الباب الوحيد.',
  },
  };
  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = M[k];
    else Object.keys(M[k]).forEach(function (l) { if (!CF_UI_MAP[k][l]) CF_UI_MAP[k][l] = M[k][l]; });
  });
})();
})();
