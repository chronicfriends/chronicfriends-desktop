/* ===================================================================
   i18nckflow — the strings of THE ONE-QUESTION-PER-SCREEN CHECK-IN
   FLOW (checkinflow.jsx), of the onboarding screen that presents it
   (onboarding.jsx, step 4.5), and of the two places the evening
   reminder can be switched off (settings.jsx · the top of the
   Journal tab).  Decided by Gerhard, 7 Sep 2026.
   Merge-if-missing (an existing translation always wins), English is
   the key, the other 15 languages inline.

   Everything else the flow says is a string the journal form ALREADY
   shows and already ships in 16 languages — the questions, the
   options, the min/max labels, «Skip» (i18n-flare8), «Next»
   (i18nlandscape), «Done» (i18n-flare8), «Previous step» /
   «Close» (i18naria), «{n} steps» (i18nhealthsync-b), «Connect {p}»
   (i18nhealthsync-a), «Remind me at» / «Yes, remind me» / the
   lock-screen promise (i18nckrem) and the blocked-notifications line
   (i18ngap9). The flow reuses them on purpose: the same word for the
   same thing, translated once.
   Loaded after i18nbarrido25 and BEFORE i18nlifetags, which stays
   last of the dictionaries.
   =================================================================== */
(function () {
  if (typeof CF_UI_MAP === 'undefined') return;
  var M = {
    /* ---------- the flow ---------- */
    'Which areas are flaring?': {
      es: '¿Qué zonas tienes en brote?', ca: 'Quines zones tens en brot?', fr: 'Quelles zones sont en poussée ?',
      de: 'Welche Bereiche sind im Schub?', it: 'Quali zone sono in fase attiva?', pt: 'Que zonas estão em crise?',
      zh: '哪些部位在发作？', ja: 'どの部位が悪化していますか？', ko: '어느 부위가 심해졌나요?',
      hi: 'कौन-से हिस्से भड़के हुए हैं?', id: 'Bagian mana yang sedang kambuh?', tr: 'Hangi bölgeler alevlenmede?',
      ru: 'Какие области в обострении?', vi: 'Những vùng nào đang bùng phát?', ar: 'ما المناطق التي تشتعل؟',
    },
    /* the counter says what is LEFT (Gerhard, 7 Sep 2026): «Faltan 17», and
       «Last question» instead of «1 to go» on the final screen. */
    '{n} to go': {
      es: 'Faltan {n}', ca: 'En falten {n}', fr: 'Encore {n}', de: 'Noch {n}', it: 'Ne restano {n}', pt: 'Faltam {n}',
      zh: '还剩 {n} 个', ja: 'あと {n} 問', ko: '{n}개 남음', hi: '{n} बाकी', id: 'Sisa {n}', tr: '{n} kaldı',
      ru: 'Осталось {n}', vi: 'Còn {n}', ar: 'بقي {n}',
    },
    'Last question': {
      es: 'Última pregunta', ca: 'Última pregunta', fr: 'Dernière question', de: 'Letzte Frage',
      it: 'Ultima domanda', pt: 'Última pergunta', zh: '最后一个问题', ja: '最後の質問', ko: '마지막 질문',
      hi: 'आख़िरी सवाल', id: 'Pertanyaan terakhir', tr: 'Son soru', ru: 'Последний вопрос',
      vi: 'Câu hỏi cuối', ar: 'السؤال الأخير',
    },
    'Tap all that apply': {
      es: 'Toca todo lo que aplique', ca: 'Toca tot el que t’encaixi', fr: 'Touchez tout ce qui correspond',
      de: 'Tippe alles an, was zutrifft', it: 'Tocca tutto ciò che vale', pt: 'Toca tudo o que se aplica',
      zh: '点选所有符合的项', ja: '当てはまるものをすべてタップ', ko: '해당되는 것을 모두 누르세요',
      hi: 'जो लागू हो, सब चुनें', id: 'Ketuk semua yang sesuai', tr: 'Geçerli olanların hepsine dokun',
      ru: 'Нажмите всё, что подходит', vi: 'Chạm vào tất cả những gì đúng', ar: 'اضغط كل ما ينطبق',
    },
    'OK': {
      es: 'OK', ca: 'D’acord', fr: 'OK', de: 'OK', it: 'OK', pt: 'OK',
      zh: '好', ja: 'OK', ko: '확인', hi: 'ठीक है', id: 'OK', tr: 'Tamam',
      ru: 'ОК', vi: 'OK', ar: 'حسنًا',
    },
    'I’ll say it myself': {
      es: 'Prefiero decirlo yo', ca: 'Prefereixo dir-ho jo', fr: 'Je préfère le dire moi-même',
      de: 'Ich sage es selbst', it: 'Preferisco dirlo io', pt: 'Prefiro dizê-lo eu',
      zh: '我自己来填', ja: '自分で答えます', ko: '직접 입력할게요',
      hi: 'मैं खुद बताऊँगा', id: 'Aku isi sendiri', tr: 'Kendim söyleyeyim',
      ru: 'Скажу сам', vi: 'Tôi tự nói', ar: 'سأقولها بنفسي',
    },
    'Your day is saved 💚': {
      es: 'Tu día está guardado 💚', ca: 'El teu dia està guardat 💚', fr: 'Votre journée est enregistrée 💚',
      de: 'Dein Tag ist gespeichert 💚', it: 'La tua giornata è salvata 💚', pt: 'O teu dia está guardado 💚',
      zh: '今天已经保存好了 💚', ja: 'きょうの記録を保存しました 💚', ko: '오늘 하루가 저장됐어요 💚',
      hi: 'आपका दिन सहेज लिया गया 💚', id: 'Harimu sudah tersimpan 💚', tr: 'Günün kaydedildi 💚',
      ru: 'Ваш день сохранён 💚', vi: 'Ngày của bạn đã được lưu 💚', ar: 'تم حفظ يومك 💚',
    },
    'Thank you for telling us. See you tomorrow.': {
      es: 'Gracias por contárnoslo. Hasta mañana.', ca: 'Gràcies per explicar-nos-ho. Fins demà.',
      fr: 'Merci de nous l’avoir dit. À demain.', de: 'Danke, dass du es uns erzählt hast. Bis morgen.',
      it: 'Grazie per avercelo detto. A domani.', pt: 'Obrigado por nos contares. Até amanhã.',
      zh: '谢谢你告诉我们。明天见。', ja: '教えてくれてありがとう。また明日。', ko: '알려줘서 고마워요. 내일 또 만나요.',
      hi: 'बताने के लिए धन्यवाद। कल मिलते हैं।', id: 'Terima kasih sudah bercerita. Sampai besok.',
      tr: 'Anlattığın için teşekkürler. Yarın görüşürüz.', ru: 'Спасибо, что рассказали. До завтра.',
      vi: 'Cảm ơn bạn đã chia sẻ. Hẹn gặp lại ngày mai.', ar: 'شكرًا لإخبارنا. إلى الغد.',
    },
    'Go back to what you skipped': {
      es: 'Volver a lo que saltaste', ca: 'Tornar al que has saltat', fr: 'Revenir à ce que vous avez passé',
      de: 'Zurück zu dem, was du übersprungen hast', it: 'Torna a ciò che hai saltato', pt: 'Voltar ao que saltaste',
      zh: '回到你跳过的问题', ja: 'スキップした質問へ戻る', ko: '건너뛴 질문으로 돌아가기',
      hi: 'जो छोड़ा था उस पर लौटें', id: 'Kembali ke yang kamu lewati', tr: 'Atladıklarına dön',
      ru: 'Вернуться к пропущенному', vi: 'Quay lại những câu đã bỏ qua', ar: 'العودة إلى ما تخطّيته',
    },
    'Open my journal': {
      es: 'Abrir mi diario', ca: 'Obrir el meu diari', fr: 'Ouvrir mon journal',
      de: 'Mein Tagebuch öffnen', it: 'Apri il mio diario', pt: 'Abrir o meu diário',
      zh: '打开我的日记', ja: '記録を開く', ko: '내 일지 열기',
      hi: 'मेरी डायरी खोलें', id: 'Buka jurnalku', tr: 'Günlüğümü aç',
      ru: 'Открыть дневник', vi: 'Mở nhật ký của tôi', ar: 'افتح مذكراتي',
    },

    /* ---------- Health Sync: the phone already answered ----------
       🔴 The message follows the number and never congratulates
       blindly: high → celebration, normal → neutral, low → neutral
       and kind. Never a disappointment, and never a word suggesting
       that moving more would help an illness. */
    '{n} active minutes': {
      es: '{n} minutos activos', ca: '{n} minuts actius', fr: '{n} minutes actives',
      de: '{n} Aktivminuten', it: '{n} minuti attivi', pt: '{n} minutos ativos',
      zh: '活动 {n} 分钟', ja: '活動 {n} 分', ko: '활동 {n}분',
      hi: '{n} सक्रिय मिनट', id: '{n} menit aktif', tr: '{n} aktif dakika',
      ru: '{n} активных минут', vi: '{n} phút vận động', ar: '{n} دقيقة نشاط',
    },
    'That is a lot of walking today. 💚': {
      es: 'Hoy has caminado mucho. 💚', ca: 'Avui has caminat molt. 💚', fr: 'Vous avez beaucoup marché aujourd’hui. 💚',
      de: 'Heute warst du viel unterwegs. 💚', it: 'Oggi hai camminato molto. 💚', pt: 'Hoje andaste muito. 💚',
      zh: '今天走了很多路。💚', ja: 'きょうはよく歩きましたね。💚', ko: '오늘 많이 걸었네요. 💚',
      hi: 'आज आप बहुत चले। 💚', id: 'Hari ini kamu banyak berjalan. 💚', tr: 'Bugün çok yürümüşsün. 💚',
      ru: 'Сегодня вы много прошли. 💚', vi: 'Hôm nay bạn đi bộ nhiều. 💚', ar: 'مشيت كثيرًا اليوم. 💚',
    },
    'A quiet day for your legs — that counts too.': {
      es: 'Un día tranquilo para tus piernas; también cuenta.', ca: 'Un dia tranquil per a les teves cames; també compta.',
      fr: 'Une journée calme pour vos jambes — ça compte aussi.', de: 'Ein ruhiger Tag für deine Beine — das zählt auch.',
      it: 'Una giornata tranquilla per le tue gambe: conta anche questo.', pt: 'Um dia tranquilo para as tuas pernas — também conta.',
      zh: '今天双腿休息了——这也算。', ja: '脚を休めた一日。それも記録です。', ko: '다리에게 조용한 하루였네요 — 그것도 기록이에요.',
      hi: 'आज पैरों ने आराम किया — यह भी मायने रखता है।', id: 'Hari yang tenang untuk kakimu — itu juga berarti.',
      tr: 'Bacakların için sakin bir gün — o da sayılır.', ru: 'Спокойный день для ваших ног — это тоже считается.',
      vi: 'Một ngày nghỉ ngơi cho đôi chân — điều đó cũng đáng ghi.', ar: 'يوم هادئ لساقيك — وهذا يُحتسب أيضًا.',
    },
    'Steps saved, straight from your phone.': {
      es: 'Pasos guardados, directos desde tu teléfono.', ca: 'Passos guardats, directes des del teu telèfon.',
      fr: 'Pas enregistrés, directement depuis votre téléphone.', de: 'Schritte gespeichert, direkt von deinem Handy.',
      it: 'Passi salvati, direttamente dal tuo telefono.', pt: 'Passos guardados, diretamente do teu telefone.',
      zh: '步数已保存，直接来自你的手机。', ja: '歩数を保存しました。スマホからそのまま。', ko: '걸음 수를 저장했어요. 휴대폰에서 바로 가져왔어요.',
      hi: 'क़दम सहेजे गए — सीधे आपके फ़ोन से।', id: 'Langkah tersimpan, langsung dari ponselmu.',
      tr: 'Adımlar kaydedildi, doğrudan telefonundan.', ru: 'Шаги сохранены — прямо с телефона.',
      vi: 'Đã lưu số bước, lấy trực tiếp từ điện thoại.', ar: 'حُفظت الخطوات، مباشرة من هاتفك.',
    },
    'A full night — saved. 💚': {
      es: 'Una noche completa, guardada. 💚', ca: 'Una nit completa, guardada. 💚', fr: 'Une nuit complète — enregistrée. 💚',
      de: 'Eine ganze Nacht — gespeichert. 💚', it: 'Una notte piena, salvata. 💚', pt: 'Uma noite completa — guardada. 💚',
      zh: '睡了一整夜——已保存。💚', ja: 'しっかり眠れた夜。保存しました。💚', ko: '충분히 잔 밤 — 저장했어요. 💚',
      hi: 'पूरी नींद — सहेज ली। 💚', id: 'Malam yang penuh — tersimpan. 💚', tr: 'Dolu dolu bir gece — kaydedildi. 💚',
      ru: 'Полная ночь — сохранено. 💚', vi: 'Một đêm trọn giấc — đã lưu. 💚', ar: 'ليلة كاملة — محفوظة. 💚',
    },
    'A short night. Be gentle with yourself today.': {
      es: 'Una noche corta. Hoy trátate con cariño.', ca: 'Una nit curta. Avui tracta’t amb cura.',
      fr: 'Une nuit courte. Ménagez-vous aujourd’hui.', de: 'Eine kurze Nacht. Sei heute sanft mit dir.',
      it: 'Una notte corta. Oggi sii gentile con te.', pt: 'Uma noite curta. Hoje sê gentil contigo.',
      zh: '这一夜很短。今天对自己温柔一点。', ja: '短い夜でした。きょうは自分にやさしく。', ko: '짧은 밤이었어요. 오늘은 스스로에게 다정하게.',
      hi: 'रात छोटी रही। आज ख़ुद पर नरमी रखें।', id: 'Malam yang singkat. Hari ini lembutlah pada dirimu.',
      tr: 'Kısa bir geceydi. Bugün kendine nazik ol.', ru: 'Короткая ночь. Будьте сегодня добрее к себе.',
      vi: 'Một đêm ngắn. Hôm nay hãy nhẹ nhàng với bản thân.', ar: 'ليلة قصيرة. كن لطيفًا مع نفسك اليوم.',
    },
    'Sleep saved, straight from your phone.': {
      es: 'Sueño guardado, directo desde tu teléfono.', ca: 'Son guardat, directe des del teu telèfon.',
      fr: 'Sommeil enregistré, directement depuis votre téléphone.', de: 'Schlaf gespeichert, direkt von deinem Handy.',
      it: 'Sonno salvato, direttamente dal tuo telefono.', pt: 'Sono guardado, diretamente do teu telefone.',
      zh: '睡眠已保存，直接来自你的手机。', ja: '睡眠を保存しました。スマホからそのまま。', ko: '수면을 저장했어요. 휴대폰에서 바로 가져왔어요.',
      hi: 'नींद सहेजी गई — सीधे आपके फ़ोन से।', id: 'Tidur tersimpan, langsung dari ponselmu.',
      tr: 'Uyku kaydedildi, doğrudan telefonundan.', ru: 'Сон сохранён — прямо с телефона.',
      vi: 'Đã lưu giấc ngủ, lấy trực tiếp từ điện thoại.', ar: 'حُفظ النوم، مباشرة من هاتفك.',
    },
    'A moving day — saved. 💚': {
      es: 'Un día en movimiento, guardado. 💚', ca: 'Un dia en moviment, guardat. 💚', fr: 'Une journée active — enregistrée. 💚',
      de: 'Ein bewegter Tag — gespeichert. 💚', it: 'Una giornata in movimento, salvata. 💚', pt: 'Um dia em movimento — guardado. 💚',
      zh: '活动了一天——已保存。💚', ja: 'よく動いた一日。保存しました。💚', ko: '많이 움직인 하루 — 저장했어요. 💚',
      hi: 'हलचल भरा दिन — सहेज लिया। 💚', id: 'Hari yang aktif — tersimpan. 💚', tr: 'Hareketli bir gün — kaydedildi. 💚',
      ru: 'Активный день — сохранено. 💚', vi: 'Một ngày vận động — đã lưu. 💚', ar: 'يوم مليء بالحركة — محفوظ. 💚',
    },
    'Activity saved, straight from your phone.': {
      es: 'Actividad guardada, directa desde tu teléfono.', ca: 'Activitat guardada, directa des del teu telèfon.',
      fr: 'Activité enregistrée, directement depuis votre téléphone.', de: 'Aktivität gespeichert, direkt von deinem Handy.',
      it: 'Attività salvata, direttamente dal tuo telefono.', pt: 'Atividade guardada, diretamente do teu telefone.',
      zh: '活动已保存，直接来自你的手机。', ja: '活動を保存しました。スマホからそのまま。', ko: '활동을 저장했어요. 휴대폰에서 바로 가져왔어요.',
      hi: 'गतिविधि सहेजी गई — सीधे आपके फ़ोन से।', id: 'Aktivitas tersimpan, langsung dari ponselmu.',
      tr: 'Hareket kaydedildi, doğrudan telefonundan.', ru: 'Активность сохранена — прямо с телефона.',
      vi: 'Đã lưu hoạt động, lấy trực tiếp từ điện thoại.', ar: 'حُفظ النشاط، مباشرة من هاتفك.',
    },

    /* ---------- the onboarding screen (step 4.5) ---------- */
    'We ask about your day, every night': {
      es: 'Te preguntamos por tu día, cada noche', ca: 'Et preguntem pel teu dia, cada nit',
      fr: 'Nous vous demandons comment s’est passée votre journée, chaque soir', de: 'Wir fragen jeden Abend nach deinem Tag',
      it: 'Ti chiediamo com’è andata la giornata, ogni sera', pt: 'Perguntamos-te pelo teu dia, todas as noites',
      zh: '每天晚上，我们问你这一天', ja: '毎晩、きょうの一日をたずねます', ko: '매일 밤, 오늘 하루를 물어볼게요',
      hi: 'हर रात हम आपके दिन के बारे में पूछेंगे', id: 'Setiap malam kami menanyakan harimu',
      tr: 'Her akşam gününü soruyoruz', ru: 'Каждый вечер мы спрашиваем о вашем дне',
      vi: 'Mỗi tối, chúng tôi hỏi về ngày của bạn', ar: 'نسألك عن يومك كل ليلة',
    },
    'One question at a time, one tap each — under a minute.': {
      es: 'Una pregunta cada vez, un toque en cada una: menos de un minuto.',
      ca: 'Una pregunta cada vegada, un toc a cada una: menys d’un minut.',
      fr: 'Une question à la fois, une touche par question — moins d’une minute.',
      de: 'Eine Frage nach der anderen, ein Tipp pro Frage — unter einer Minute.',
      it: 'Una domanda alla volta, un tocco ciascuna: meno di un minuto.',
      pt: 'Uma pergunta de cada vez, um toque em cada — menos de um minuto.',
      zh: '一次一个问题，各点一下——不到一分钟。', ja: '一度に一問、タップひとつずつ — 1分もかかりません。',
      ko: '한 번에 한 질문, 한 번씩 누르면 돼요 — 1분도 안 걸려요.',
      hi: 'एक बार में एक सवाल, हर एक पर एक टैप — एक मिनट से भी कम।',
      id: 'Satu pertanyaan sekali, satu ketukan tiap soal — kurang dari satu menit.',
      tr: 'Her seferinde bir soru, her birine bir dokunuş — bir dakikadan az.',
      ru: 'По одному вопросу, одно касание на каждый — меньше минуты.',
      vi: 'Mỗi lần một câu hỏi, mỗi câu một lần chạm — dưới một phút.',
      ar: 'سؤال واحد في كل مرة، لمسة واحدة لكل سؤال — أقل من دقيقة.',
    },
    'If you take medication, a few minutes after your last dose works well.': {
      es: 'Si tomas medicación, va bien unos minutos después de tu última dosis.',
      ca: 'Si prens medicació, va bé uns minuts després de l’última dosi.',
      fr: 'Si vous prenez un traitement, quelques minutes après votre dernière dose convient bien.',
      de: 'Wenn du Medikamente nimmst, passen ein paar Minuten nach der letzten Dosis gut.',
      it: 'Se prendi farmaci, qualche minuto dopo l’ultima dose funziona bene.',
      pt: 'Se tomas medicação, uns minutos depois da última dose funciona bem.',
      zh: '如果你在服药，安排在最后一次用药后几分钟最合适。',
      ja: 'お薬を飲むなら、最後の一回の数分後がちょうどいいです。',
      ko: '약을 드신다면, 마지막 복용 몇 분 뒤가 좋아요.',
      hi: 'अगर आप दवा लेते हैं, तो आख़िरी ख़ुराक के कुछ मिनट बाद का समय अच्छा रहता है।',
      id: 'Kalau kamu minum obat, beberapa menit setelah dosis terakhir paling cocok.',
      tr: 'İlaç kullanıyorsan, son dozundan birkaç dakika sonrası iyi gider.',
      ru: 'Если вы принимаете лекарства, хорошо подходит через несколько минут после последней дозы.',
      vi: 'Nếu bạn dùng thuốc, vài phút sau liều cuối là hợp nhất.',
      ar: 'إن كنت تتناول دواءً، فبعد جرعتك الأخيرة بدقائق وقت مناسب.',
    },
    'You can turn it off whenever you like — in Settings, or at the top of your Journal.': {
      es: 'Puedes apagarlo cuando quieras: en Ajustes o arriba de tu Diario.',
      ca: 'El pots apagar quan vulguis: a Configuració o a dalt del teu Diari.',
      fr: 'Vous pouvez le désactiver quand vous voulez — dans Réglages ou en haut de votre Journal.',
      de: 'Du kannst sie jederzeit ausschalten — in den Einstellungen oder oben im Tagebuch.',
      it: 'Puoi spegnerlo quando vuoi: nelle Impostazioni o in cima al Diario.',
      pt: 'Podes desligá-lo quando quiseres — nas Definições ou no topo do teu Diário.',
      zh: '你随时可以关掉——在设置里，或日记页面顶部。',
      ja: 'いつでもオフにできます — 設定か、記録の一番上から。',
      ko: '언제든 끌 수 있어요 — 설정에서, 또는 일지 맨 위에서.',
      hi: 'आप जब चाहें इसे बंद कर सकते हैं — सेटिंग्स में, या डायरी के सबसे ऊपर।',
      id: 'Kamu bisa mematikannya kapan saja — di Pengaturan, atau di bagian atas Jurnal.',
      tr: 'İstediğin zaman kapatabilirsin — Ayarlar’dan ya da Günlüğünün en üstünden.',
      ru: 'Вы можете отключить его когда угодно — в настройках или наверху дневника.',
      vi: 'Bạn có thể tắt bất cứ lúc nào — trong Cài đặt, hoặc ở đầu Nhật ký.',
      ar: 'يمكنك إيقافه وقتما تشاء — من الإعدادات أو من أعلى مذكراتك.',
    },

    /* ---------- the two off-switches ---------- */
    'Journal reminder': {
      es: 'Recordatorio del diario', ca: 'Recordatori del diari', fr: 'Rappel du journal',
      de: 'Tagebuch-Erinnerung', it: 'Promemoria del diario', pt: 'Lembrete do diário',
      zh: '日记提醒', ja: '記録のリマインダー', ko: '일지 알림',
      hi: 'डायरी की याद', id: 'Pengingat jurnal', tr: 'Günlük hatırlatıcısı',
      ru: 'Напоминание о дневнике', vi: 'Nhắc ghi nhật ký', ar: 'تذكير المذكرات',
    },
  };
  Object.keys(M).forEach(function (en) {
    var cur = CF_UI_MAP[en] || (CF_UI_MAP[en] = {});
    var add = M[en];
    Object.keys(add).forEach(function (L) { if (cur[L] == null) cur[L] = add[L]; });
  });
})();
