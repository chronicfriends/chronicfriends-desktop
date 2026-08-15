(function () {
  /* ===================================================================
     i18n-vc20-restos — las 7 cadenas que TODAVIA salian en ingles en los
     15 idiomas, encontradas en el barrido completo del 15 ago 2026 (vc20).
     No venian del export de hoy: llevaban varias versiones ahi.

     Origen: flaremodecomfort (luz suave del Modo brote), healthsyncui,
     modjournal, onboarding (el tour del Flare Radar) y readingslog.

     🔴 «never used to predict anything» se traduce LITERAL en todos los
     idiomas: es lenguaje regulado (la app no predice nada) — comprobado
     idioma por idioma. «Flare Radar» y «Chronic Friends» no se traducen.
     =================================================================== */
  var CF_UI_MAP = (window.CF_UI_MAP = window.CF_UI_MAP || {});
  var M = {
    "Gentle daylight helps many people feel steadier — a few minutes near a window or outside, only what feels good.": {
      es: "La luz suave del día ayuda a muchas personas a sentirse más estables — unos minutos cerca de una ventana o al aire libre, solo lo que te siente bien.",
      ca: "La llum suau del dia ajuda moltes persones a sentir-se més estables — uns minuts a prop d'una finestra o a fora, només el que et vagi bé.",
      fr: "La lumière douce du jour aide beaucoup de personnes à se sentir plus stables — quelques minutes près d'une fenêtre ou dehors, seulement ce qui te fait du bien.",
      de: "Sanftes Tageslicht hilft vielen Menschen, sich stabiler zu fühlen — ein paar Minuten am Fenster oder draußen, nur so viel, wie dir guttut.",
      it: "La luce delicata del giorno aiuta molte persone a sentirsi più stabili — qualche minuto vicino a una finestra o all'aperto, solo ciò che ti fa stare bene.",
      pt: "A luz suave do dia ajuda muita gente a sentir-se mais estável — uns minutos junto a uma janela ou lá fora, apenas o que te fizer sentir bem.",
      zh: "柔和的日光能让很多人感觉更平稳一些——在窗边或户外待上几分钟，只做让你舒服的那些。",
      ja: "やわらかな日ざしは、多くの人が落ち着いた感じでいられる助けになります——窓辺や外で数分だけ、心地よいと感じる分だけで。",
      ko: "부드러운 햇빛은 많은 사람이 더 안정된 느낌을 갖는 데 도움이 돼요 — 창가나 바깥에서 몇 분, 기분 좋은 만큼만.",
      hi: "दिन की कोमल रोशनी से बहुत से लोग ख़ुद को ज़्यादा स्थिर महसूस करते हैं — खिड़की के पास या बाहर बस कुछ मिनट, उतना ही जितना अच्छा लगे।",
      id: "Cahaya siang yang lembut membantu banyak orang merasa lebih stabil — beberapa menit di dekat jendela atau di luar, sebanyak yang terasa nyaman saja.",
      tr: "Yumuşak gün ışığı birçok kişinin kendini daha dengede hissetmesine yardımcı olur — pencere kenarında ya da dışarıda birkaç dakika, sadece sana iyi geldiği kadar.",
      ru: "Мягкий дневной свет помогает многим чувствовать себя ровнее — несколько минут у окна или на улице, только столько, сколько тебе приятно.",
      vi: "Ánh sáng ban ngày dịu nhẹ giúp nhiều người cảm thấy vững vàng hơn — vài phút bên cửa sổ hoặc ngoài trời, chỉ vừa đủ dễ chịu với bạn.",
      ar: "ضوء النهار اللطيف يساعد كثيرين على الشعور باتزان أكبر — بضع دقائق قرب نافذة أو في الخارج، بالقدر الذي يريحك فقط."
    },
    "Gentle light — a kind thing to do.": {
      es: "Luz suave — un gesto amable contigo.",
      ca: "Llum suau — un gest amable cap a tu.",
      fr: "Lumière douce — un geste bienveillant envers toi.",
      de: "Sanftes Licht — etwas Gutes für dich.",
      it: "Luce delicata — un gesto gentile verso di te.",
      pt: "Luz suave — um gesto de carinho contigo.",
      zh: "柔和的光——对自己温柔一点。",
      ja: "やわらかな光——自分をいたわる小さなこと。",
      ko: "부드러운 빛 — 나에게 다정해지는 방법.",
      hi: "मुलायम रोशनी — अपने साथ नरमी बरतने का एक तरीका।",
      id: "Cahaya lembut — hal baik yang bisa kamu lakukan untuk dirimu.",
      tr: "Yumuşak ışık — kendine karşı nazik bir davranış.",
      ru: "Мягкий свет — маленькая забота о себе.",
      vi: "Ánh sáng dịu — một điều tử tế bạn dành cho chính mình.",
      ar: "ضوء لطيف — لفتة لطيفة تجاه نفسك."
    },
    "Read from your device and compared only with your own average — never used to predict anything.": {
      es: "Se lee de tu dispositivo y se compara solo con tu propia media — nunca se usa para predecir nada.",
      ca: "Es llegeix del teu dispositiu i es compara només amb la teva pròpia mitjana — mai s'utilitza per predir res.",
      fr: "Lu depuis ton appareil et comparé uniquement à ta propre moyenne — jamais utilisé pour prédire quoi que ce soit.",
      de: "Wird von deinem Gerät gelesen und nur mit deinem eigenen Durchschnitt verglichen — nie verwendet, um irgendetwas vorherzusagen.",
      it: "Letto dal tuo dispositivo e confrontato solo con la tua media — mai usato per prevedere nulla.",
      pt: "Lido a partir do teu dispositivo e comparado apenas com a tua própria média — nunca é usado para prever nada.",
      zh: "从你的设备读取，只与你自己的平均值比较——绝不用于预测任何事情。",
      ja: "あなたの端末から読み取り、あなた自身の平均とだけ比べます——何かを予測するために使われることは決してありません。",
      ko: "기기에서 읽어 와서 내 평균하고만 비교해요 — 무언가를 예측하는 데는 절대 쓰이지 않아요.",
      hi: "तुम्हारे डिवाइस से पढ़ा जाता है और सिर्फ़ तुम्हारे अपने औसत से तुलना की जाती है — किसी भी चीज़ की भविष्यवाणी करने के लिए इसका इस्तेमाल कभी नहीं होता।",
      id: "Dibaca dari perangkatmu dan dibandingkan hanya dengan rata-ratamu sendiri — tidak pernah digunakan untuk memprediksi apa pun.",
      tr: "Cihazından okunur ve yalnızca kendi ortalamanla karşılaştırılır — hiçbir zaman bir şeyi tahmin etmek için kullanılmaz.",
      ru: "Считывается с твоего устройства и сравнивается только с твоим собственным средним — никогда не используется, чтобы что-либо предсказывать.",
      vi: "Được đọc từ thiết bị của bạn và chỉ so sánh với mức trung bình của chính bạn — không bao giờ được dùng để dự đoán bất cứ điều gì.",
      ar: "تُقرأ من جهازك وتُقارن فقط بمتوسطك أنت — ولا تُستخدم أبدًا للتنبؤ بأي شيء."
    },
    "Synced from {p} · read-only": {
      es: "Sincronizado desde {p} · solo lectura",
      ca: "Sincronitzat des de {p} · només lectura",
      fr: "Synchronisé depuis {p} · lecture seule",
      de: "Synchronisiert von {p} · nur Lesezugriff",
      it: "Sincronizzato da {p} · sola lettura",
      pt: "Sincronizado a partir de {p} · apenas leitura",
      zh: "从 {p} 同步 · 只读",
      ja: "{p} から同期 · 読み取り専用",
      ko: "{p}에서 동기화됨 · 읽기 전용",
      hi: "{p} से सिंक किया गया · केवल पढ़ने के लिए",
      id: "Disinkronkan dari {p} · hanya baca",
      tr: "{p} kaynağından eşitlendi · salt okunur",
      ru: "Синхронизировано из {p} · только чтение",
      vi: "Đồng bộ từ {p} · chỉ đọc",
      ar: "تمت المزامنة من {p} · للقراءة فقط"
    },
    "Your journal is organized by your trackers. Every answer flows into your charts, Flare Radar and reports.": {
      es: "Tu diario se organiza por tus seguimientos. Cada respuesta pasa a tus gráficas, al Flare Radar y a tus informes.",
      ca: "El teu diari s'organitza pels teus seguiments. Cada resposta va als teus gràfics, al Flare Radar i als teus informes.",
      fr: "Ton journal est organisé selon tes suivis. Chaque réponse alimente tes graphiques, le Flare Radar et tes rapports.",
      de: "Dein Tagebuch ist nach deinen Trackern geordnet. Jede Antwort fließt in deine Diagramme, den Flare Radar und deine Berichte ein.",
      it: "Il tuo diario è organizzato in base ai tuoi monitoraggi. Ogni risposta confluisce nei tuoi grafici, nel Flare Radar e nei tuoi report.",
      pt: "O teu diário está organizado pelos indicadores que segues. Cada resposta alimenta os teus gráficos, o Flare Radar e os relatórios.",
      zh: "你的日记按你追踪的项目来分组。每一个回答都会汇入你的图表、Flare Radar 和报告。",
      ja: "日記は、あなたが記録している項目ごとに整理されます。答えはすべて、グラフや Flare Radar、レポートに反映されます。",
      ko: "일기는 내가 기록하는 항목별로 정리돼요. 모든 답변은 내 차트와 Flare Radar, 리포트에 반영돼요.",
      hi: "तुम्हारी डायरी उन चीज़ों के हिसाब से सजी है जिन्हें तुम ट्रैक करते हो। हर जवाब तुम्हारे चार्ट, Flare Radar और रिपोर्ट में जुड़ जाता है।",
      id: "Jurnalmu disusun berdasarkan pelacak yang kamu pakai. Setiap jawaban mengalir ke grafik, Flare Radar, dan laporanmu.",
      tr: "Günlüğün, takip ettiğin ölçümlere göre düzenlenir. Her yanıt grafiklerine, Flare Radar'a ve raporlarına akar.",
      ru: "Твой дневник построен вокруг твоих трекеров. Каждый ответ попадает в твои графики, в Flare Radar и в отчёты.",
      vi: "Nhật ký của bạn được sắp xếp theo các chỉ số bạn theo dõi. Mọi câu trả lời đều chảy vào biểu đồ, Flare Radar và báo cáo của bạn.",
      ar: "يومياتك مرتّبة حسب المؤشرات التي تتابعها. كل إجابة تصبّ في رسومك البيانية وفي Flare Radar وفي تقاريرك."
    },
    "An instrument that reads the days you log and shows how your own signals are moving — so you (and your doctor) can see it early.": {
      es: "Un instrumento que lee los días que registras y muestra cómo se mueven tus propias señales — para que tú (y tu médico) podáis verlo pronto.",
      ca: "Un instrument que llegeix els dies que registres i mostra com es mouen els teus propis senyals — perquè tu (i el teu metge) ho pugueu veure aviat.",
      fr: "Un instrument qui lit les jours que tu enregistres et montre comment tes propres signaux bougent — pour que toi (et ton médecin) puissiez le voir tôt.",
      de: "Ein Instrument, das die Tage liest, die du einträgst, und zeigt, wie sich deine eigenen Signale bewegen — damit du (und deine Ärztin oder dein Arzt) es früh sehen könnt.",
      it: "Uno strumento che legge i giorni che registri e mostra come si muovono i tuoi segnali — così tu (e il tuo medico) potete vederlo presto.",
      pt: "Um instrumento que lê os dias que registas e mostra como os teus próprios sinais se estão a mover — para que tu (e o teu médico) o possam ver cedo.",
      zh: "一件工具，它读取你记录的日子，显示你自己的各项信号在如何变化——好让你（和你的医生）能早一点看到。",
      ja: "記録した日々を読み取り、あなた自身のサインがどう動いているかを示す道具です——あなた（そして主治医）が早い段階でそれを見られるように。",
      ko: "기록한 날들을 읽어서 내 신호가 어떻게 움직이고 있는지 보여 주는 도구예요 — 나(그리고 내 의사)가 그걸 일찍 볼 수 있도록요.",
      hi: "एक ऐसा साधन जो तुम्हारे दर्ज किए हुए दिनों को पढ़ता है और दिखाता है कि तुम्हारे अपने संकेत किस ओर बढ़ रहे हैं — ताकि तुम (और तुम्हारा डॉक्टर) उसे जल्दी देख सको।",
      id: "Sebuah alat yang membaca hari-hari yang kamu catat dan menunjukkan ke mana sinyal-sinyalmu sendiri bergerak — supaya kamu (dan doktermu) bisa melihatnya lebih awal.",
      tr: "Kaydettiğin günleri okuyup kendi sinyallerinin nasıl değiştiğini gösteren bir araç — böylece sen (ve doktorun) bunu erkenden görebilirsin.",
      ru: "Инструмент, который читает отмеченные тобой дни и показывает, как меняются твои собственные сигналы, — чтобы ты (и твой врач) могли увидеть это раньше.",
      vi: "Một công cụ đọc những ngày bạn ghi lại và cho thấy các tín hiệu của chính bạn đang chuyển động ra sao — để bạn (và bác sĩ của bạn) nhìn thấy điều đó sớm.",
      ar: "أداة تقرأ الأيام التي تسجّلها وتُظهر كيف تتحرك مؤشراتك أنت — كي تراها أنت (وطبيبك) مبكرًا."
    },
    "e.g. {v}": {
      es: "p. ej. {v}",
      ca: "p. ex. {v}",
      fr: "p. ex. {v}",
      de: "z. B. {v}",
      it: "es. {v}",
      pt: "p. ex. {v}",
      zh: "例：{v}",
      ja: "例：{v}",
      ko: "예: {v}",
      hi: "उदा. {v}",
      id: "mis. {v}",
      tr: "ör. {v}",
      ru: "напр. {v}",
      vi: "VD: {v}",
      ar: "مثال: {v}"
    }
  };

  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = {};
    Object.keys(M[k]).forEach(function (lang) {
      if (!CF_UI_MAP[k][lang]) CF_UI_MAP[k][lang] = M[k][lang];
    });
  });
})();
