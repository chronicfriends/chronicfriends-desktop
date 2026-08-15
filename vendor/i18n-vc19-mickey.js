(function () {
  /* ===================================================================
     i18n-vc19-mickey — traducciones de las cadenas VISIBLES que llegaron
     sin traducir en el export de Claude Design del 13 ago 2026 (23:31),
     la tanda de 9 prompts de Mickey + los 4 parches.

     Detectadas comparando todas las llamadas tr()/trf() de los 20 ficheros
     que tocó el zip contra los 366 diccionarios i18n del proyecto.
     Sin esto salen EN INGLÉS en los 16 idiomas de la app.

     Los 15 idiomas de la app. Inglés es la clave. Merge-if-missing.
     «Chronic Friends» NUNCA se traduce. Los {n} y {t} y las etiquetas
     <strong> se conservan tal cual.

     🔴 PENDIENTE de que CD las adopte EN ORIGEN: mientras vivan solo aquí,
     este fichero tiene que seguir inyectándose tras cada export.
     =================================================================== */
  if (typeof CF_UI_MAP === 'undefined') return;

  var M = {

    /* ---------- notifhealth.jsx — «¿llegarán mis avisos?» (prompt 9) ---------- */

    "Why my phone may stop reminders": {
      es: "Por qué mi móvil puede parar los avisos", ca: "Per què el meu mòbil pot aturar els avisos", fr: "Pourquoi mon téléphone peut bloquer les rappels", de: "Warum mein Handy Erinnerungen stoppen kann",
      it: "Perché il telefono può bloccare i promemoria", pt: "Por que o meu telemóvel pode parar os lembretes", zh: "为什么我的手机可能会中断提醒", ja: "スマホがリマインダーを止めてしまう理由", ko: "휴대폰이 알림을 멈출 수 있는 이유",
      hi: "आपका फ़ोन रिमाइंडर क्यों रोक सकता है", id: "Kenapa ponselmu bisa menghentikan pengingat", tr: "Telefonum hatırlatıcıları neden durdurabilir", ru: "Почему телефон может остановить напоминания", vi: "Vì sao điện thoại có thể chặn lời nhắc", ar: "لماذا قد يوقف هاتفك التذكيرات"
    },
    "Medication reminders ring in the Chronic Friends app on your phone. There is nothing to check on a computer.": {
      es: "Los avisos de medicación suenan en la app Chronic Friends de tu móvil. En el ordenador no hay nada que comprobar.",
      ca: "Els avisos de medicació sonen a l'app Chronic Friends del teu mòbil. A l'ordinador no hi ha res a comprovar.",
      fr: "Les rappels de médicaments sonnent dans l'application Chronic Friends sur votre téléphone. Il n'y a rien à vérifier sur un ordinateur.",
      de: "Medikamenten-Erinnerungen klingeln in der Chronic Friends App auf deinem Handy. Am Computer gibt es nichts zu prüfen.",
      it: "I promemoria dei farmaci suonano nell'app Chronic Friends sul telefono. Sul computer non c'è nulla da controllare.",
      pt: "Os lembretes de medicação tocam na app Chronic Friends do seu telemóvel. No computador não há nada para verificar.",
      zh: "用药提醒在手机上的 Chronic Friends 应用中响起。电脑上没有需要检查的内容。",
      ja: "服薬リマインダーはスマホの Chronic Friends アプリで鳴ります。パソコンで確認することはありません。",
      ko: "복약 알림은 휴대폰의 Chronic Friends 앱에서 울립니다. 컴퓨터에서 확인할 것은 없어요.",
      hi: "दवा के रिमाइंडर आपके फ़ोन की Chronic Friends ऐप में बजते हैं। कंप्यूटर पर जाँचने के लिए कुछ नहीं है।",
      id: "Pengingat obat berbunyi di aplikasi Chronic Friends pada ponselmu. Tidak ada yang perlu diperiksa di komputer.",
      tr: "İlaç hatırlatıcıları telefonundaki Chronic Friends uygulamasında çalar. Bilgisayarda kontrol edilecek bir şey yok.",
      ru: "Напоминания о лекарствах звучат в приложении Chronic Friends на телефоне. На компьютере проверять нечего.",
      vi: "Lời nhắc uống thuốc reo trong ứng dụng Chronic Friends trên điện thoại. Không có gì phải kiểm tra trên máy tính.",
      ar: "تصدر تذكيرات الدواء في تطبيق Chronic Friends على هاتفك. لا يوجد ما يجب التحقق منه على الكمبيوتر."
    },
    "Checking your phone…": {
      es: "Comprobando tu móvil…", ca: "Comprovant el teu mòbil…", fr: "Vérification de votre téléphone…", de: "Dein Handy wird geprüft…",
      it: "Controllo del telefono…", pt: "A verificar o seu telemóvel…", zh: "正在检查你的手机…", ja: "スマホを確認しています…", ko: "휴대폰을 확인하는 중…",
      hi: "आपका फ़ोन जाँचा जा रहा है…", id: "Memeriksa ponselmu…", tr: "Telefonun kontrol ediliyor…", ru: "Проверяем ваш телефон…", vi: "Đang kiểm tra điện thoại…", ar: "جارٍ فحص هاتفك…"
    },
    "All set — your reminders will arrive on time.": {
      es: "Todo listo: tus avisos llegarán a su hora.", ca: "Tot a punt: els teus avisos arribaran a l'hora.", fr: "Tout est prêt : vos rappels arriveront à l'heure.", de: "Alles bereit — deine Erinnerungen kommen pünktlich.",
      it: "Tutto pronto: i tuoi promemoria arriveranno in orario.", pt: "Tudo pronto — os seus lembretes chegarão a horas.", zh: "一切就绪，你的提醒会准时到达。", ja: "準備完了。リマインダーは時間どおりに届きます。", ko: "준비 완료 — 알림이 제시간에 도착합니다.",
      hi: "सब तैयार — आपके रिमाइंडर समय पर आएंगे।", id: "Semua siap — pengingatmu akan datang tepat waktu.", tr: "Her şey hazır — hatırlatıcıların zamanında gelecek.", ru: "Всё готово — напоминания придут вовремя.", vi: "Xong rồi — lời nhắc sẽ đến đúng giờ.", ar: "كل شيء جاهز — ستصلك التذكيرات في وقتها."
    },
    "Your reminders may not arrive": {
      es: "Puede que tus avisos no lleguen", ca: "Pot ser que els teus avisos no arribin", fr: "Vos rappels risquent de ne pas arriver", de: "Deine Erinnerungen kommen vielleicht nicht an",
      it: "I tuoi promemoria potrebbero non arrivare", pt: "Os seus lembretes podem não chegar", zh: "你的提醒可能不会送达", ja: "リマインダーが届かないおそれがあります", ko: "알림이 도착하지 않을 수 있어요",
      hi: "हो सकता है आपके रिमाइंडर न आएँ", id: "Pengingatmu mungkin tidak sampai", tr: "Hatırlatıcıların gelmeyebilir", ru: "Ваши напоминания могут не прийти", vi: "Lời nhắc của bạn có thể không đến", ar: "قد لا تصلك التذكيرات"
    },

    "Notifications allowed": {
      es: "Avisos permitidos", ca: "Avisos permesos", fr: "Notifications autorisées", de: "Benachrichtigungen erlaubt",
      it: "Notifiche consentite", pt: "Notificações permitidas", zh: "已允许通知", ja: "通知が許可されています", ko: "알림 허용됨",
      hi: "सूचनाएँ अनुमत", id: "Notifikasi diizinkan", tr: "Bildirimlere izin verildi", ru: "Уведомления разрешены", vi: "Đã cho phép thông báo", ar: "الإشعارات مسموح بها"
    },
    "Notifications are allowed.": {
      es: "Los avisos están permitidos.", ca: "Els avisos estan permesos.", fr: "Les notifications sont autorisées.", de: "Benachrichtigungen sind erlaubt.",
      it: "Le notifiche sono consentite.", pt: "As notificações estão permitidas.", zh: "通知已获允许。", ja: "通知は許可されています。", ko: "알림이 허용되어 있어요.",
      hi: "सूचनाओं की अनुमति है।", id: "Notifikasi sudah diizinkan.", tr: "Bildirimlere izin verilmiş.", ru: "Уведомления разрешены.", vi: "Thông báo đã được cho phép.", ar: "الإشعارات مسموح بها."
    },
    "Notifications are blocked, so no reminder can reach you.": {
      es: "Los avisos están bloqueados, así que ningún recordatorio puede llegarte.", ca: "Els avisos estan bloquejats, així que cap recordatori pot arribar-te.", fr: "Les notifications sont bloquées : aucun rappel ne peut vous parvenir.", de: "Benachrichtigungen sind blockiert, deshalb kann dich keine Erinnerung erreichen.",
      it: "Le notifiche sono bloccate, quindi nessun promemoria può raggiungerti.", pt: "As notificações estão bloqueadas, por isso nenhum lembrete o pode alcançar.", zh: "通知被屏蔽了，因此任何提醒都无法送达。", ja: "通知がブロックされているため、リマインダーは届きません。", ko: "알림이 차단되어 있어 어떤 알림도 받을 수 없어요.",
      hi: "सूचनाएँ अवरुद्ध हैं, इसलिए कोई रिमाइंडर आप तक नहीं पहुँच सकता।", id: "Notifikasi diblokir, jadi tidak ada pengingat yang bisa sampai padamu.", tr: "Bildirimler engellenmiş, bu yüzden hiçbir hatırlatıcı sana ulaşamaz.", ru: "Уведомления заблокированы, поэтому напоминания до вас не дойдут.", vi: "Thông báo đang bị chặn nên không lời nhắc nào đến được với bạn.", ar: "الإشعارات محظورة، لذا لا يمكن أن يصلك أي تذكير."
    },
    "Notifications haven’t been allowed yet.": {
      es: "Todavía no has permitido los avisos.", ca: "Encara no has permès els avisos.", fr: "Les notifications n'ont pas encore été autorisées.", de: "Benachrichtigungen wurden noch nicht erlaubt.",
      it: "Le notifiche non sono ancora state consentite.", pt: "As notificações ainda não foram permitidas.", zh: "尚未允许通知。", ja: "通知はまだ許可されていません。", ko: "아직 알림을 허용하지 않았어요.",
      hi: "सूचनाओं की अनुमति अभी नहीं दी गई है।", id: "Notifikasi belum diizinkan.", tr: "Bildirimlere henüz izin verilmedi.", ru: "Уведомления ещё не разрешены.", vi: "Bạn chưa cho phép thông báo.", ar: "لم يتم السماح بالإشعارات بعد."
    },

    "Exact-time reminders": {
      es: "Avisos a la hora exacta", ca: "Avisos a l'hora exacta", fr: "Rappels à l'heure exacte", de: "Erinnerungen zur exakten Zeit",
      it: "Promemoria all'ora esatta", pt: "Lembretes à hora exata", zh: "精确时间提醒", ja: "正確な時刻のリマインダー", ko: "정확한 시각 알림",
      hi: "सटीक समय पर रिमाइंडर", id: "Pengingat pada waktu tepat", tr: "Tam saatinde hatırlatıcılar", ru: "Напоминания в точное время", vi: "Lời nhắc đúng giờ chính xác", ar: "تذكيرات في الوقت الدقيق"
    },
    "Reminders can ring at the exact minute.": {
      es: "Los avisos pueden sonar en el minuto exacto.", ca: "Els avisos poden sonar al minut exacte.", fr: "Les rappels peuvent sonner à la minute près.", de: "Erinnerungen können auf die Minute genau klingeln.",
      it: "I promemoria possono suonare al minuto esatto.", pt: "Os lembretes podem tocar ao minuto exato.", zh: "提醒可以在精确的分钟响起。", ja: "リマインダーは分単位で正確に鳴らせます。", ko: "알림이 정확한 분에 울릴 수 있어요.",
      hi: "रिमाइंडर ठीक उसी मिनट पर बज सकते हैं।", id: "Pengingat bisa berbunyi tepat pada menitnya.", tr: "Hatırlatıcılar dakikası dakikasına çalabilir.", ru: "Напоминания могут звучать минута в минуту.", vi: "Lời nhắc có thể reo đúng từng phút.", ar: "يمكن أن تصدر التذكيرات في الدقيقة المحددة."
    },
    "Reminders may arrive late — exact timing is switched off.": {
      es: "Los avisos pueden llegar tarde: la hora exacta está desactivada.", ca: "Els avisos poden arribar tard: l'hora exacta està desactivada.", fr: "Les rappels peuvent arriver en retard : l'heure exacte est désactivée.", de: "Erinnerungen können zu spät kommen — die exakte Zeit ist ausgeschaltet.",
      it: "I promemoria possono arrivare in ritardo: l'ora esatta è disattivata.", pt: "Os lembretes podem chegar tarde — a hora exata está desativada.", zh: "提醒可能会迟到——精确时间已关闭。", ja: "リマインダーが遅れる場合があります。正確な時刻がオフになっています。", ko: "알림이 늦게 올 수 있어요 — 정확한 시각이 꺼져 있습니다.",
      hi: "रिमाइंडर देर से आ सकते हैं — सटीक समय बंद है।", id: "Pengingat bisa terlambat — waktu tepat sedang dimatikan.", tr: "Hatırlatıcılar gecikebilir — tam zamanlama kapalı.", ru: "Напоминания могут приходить с опозданием — точное время отключено.", vi: "Lời nhắc có thể đến muộn — hẹn giờ chính xác đang tắt.", ar: "قد تصل التذكيرات متأخرة — التوقيت الدقيق مُعطَّل."
    },
    "Exact timing hasn’t been allowed yet.": {
      es: "Todavía no has permitido la hora exacta.", ca: "Encara no has permès l'hora exacta.", fr: "L'heure exacte n'a pas encore été autorisée.", de: "Die exakte Zeit wurde noch nicht erlaubt.",
      it: "L'ora esatta non è ancora stata consentita.", pt: "A hora exata ainda não foi permitida.", zh: "尚未允许精确时间。", ja: "正確な時刻はまだ許可されていません。", ko: "아직 정확한 시각을 허용하지 않았어요.",
      hi: "सटीक समय की अनुमति अभी नहीं दी गई है।", id: "Waktu tepat belum diizinkan.", tr: "Tam zamanlamaya henüz izin verilmedi.", ru: "Точное время ещё не разрешено.", vi: "Bạn chưa cho phép hẹn giờ chính xác.", ar: "لم يتم السماح بالتوقيت الدقيق بعد."
    },

    "Battery saving": {
      es: "Ahorro de batería", ca: "Estalvi de bateria", fr: "Économie de batterie", de: "Energiesparmodus",
      it: "Risparmio batteria", pt: "Poupança de bateria", zh: "省电模式", ja: "バッテリー節約", ko: "배터리 절약",
      hi: "बैटरी बचत", id: "Penghemat baterai", tr: "Pil tasarrufu", ru: "Экономия батареи", vi: "Tiết kiệm pin", ar: "توفير البطارية"
    },
    "Battery saving is not holding the app back.": {
      es: "El ahorro de batería no está frenando la app.", ca: "L'estalvi de bateria no està frenant l'app.", fr: "L'économie de batterie ne bride pas l'application.", de: "Der Energiesparmodus bremst die App nicht.",
      it: "Il risparmio batteria non sta frenando l'app.", pt: "A poupança de bateria não está a travar a app.", zh: "省电模式没有限制这个应用。", ja: "バッテリー節約はアプリを妨げていません。", ko: "배터리 절약이 앱을 막고 있지 않아요.",
      hi: "बैटरी बचत ऐप को नहीं रोक रही है।", id: "Penghemat baterai tidak menghambat aplikasi.", tr: "Pil tasarrufu uygulamayı engellemiyor.", ru: "Экономия батареи не мешает приложению.", vi: "Tiết kiệm pin không cản trở ứng dụng.", ar: "توفير البطارية لا يعيق التطبيق."
    },
    "Battery saving may stop reminders while your screen is off.": {
      es: "El ahorro de batería puede parar los avisos con la pantalla apagada.", ca: "L'estalvi de bateria pot aturar els avisos amb la pantalla apagada.", fr: "L'économie de batterie peut bloquer les rappels lorsque l'écran est éteint.", de: "Der Energiesparmodus kann Erinnerungen stoppen, wenn der Bildschirm aus ist.",
      it: "Il risparmio batteria può bloccare i promemoria a schermo spento.", pt: "A poupança de bateria pode parar os lembretes com o ecrã desligado.", zh: "息屏时省电模式可能会中断提醒。", ja: "画面がオフのあいだ、バッテリー節約がリマインダーを止めることがあります。", ko: "화면이 꺼져 있는 동안 배터리 절약이 알림을 멈출 수 있어요.",
      hi: "स्क्रीन बंद होने पर बैटरी बचत रिमाइंडर रोक सकती है।", id: "Penghemat baterai bisa menghentikan pengingat saat layar mati.", tr: "Ekran kapalıyken pil tasarrufu hatırlatıcıları durdurabilir.", ru: "При выключенном экране экономия батареи может останавливать напоминания.", vi: "Khi tắt màn hình, tiết kiệm pin có thể chặn lời nhắc.", ar: "قد يوقف توفير البطارية التذكيرات عندما تكون الشاشة مطفأة."
    },

    "Reminder sound": {
      es: "Sonido del aviso", ca: "So de l'avís", fr: "Son du rappel", de: "Erinnerungston",
      it: "Suono del promemoria", pt: "Som do lembrete", zh: "提醒声音", ja: "リマインダーの音", ko: "알림 소리",
      hi: "रिमाइंडर की आवाज़", id: "Suara pengingat", tr: "Hatırlatıcı sesi", ru: "Звук напоминания", vi: "Âm thanh lời nhắc", ar: "صوت التذكير"
    },
    "Reminders will make a sound.": {
      es: "Los avisos sonarán.", ca: "Els avisos sonaran.", fr: "Les rappels émettront un son.", de: "Erinnerungen machen einen Ton.",
      it: "I promemoria emetteranno un suono.", pt: "Os lembretes vão emitir som.", zh: "提醒会发出声音。", ja: "リマインダーは音が鳴ります。", ko: "알림에서 소리가 납니다.",
      hi: "रिमाइंडर आवाज़ करेंगे।", id: "Pengingat akan berbunyi.", tr: "Hatırlatıcılar ses çıkaracak.", ru: "Напоминания будут со звуком.", vi: "Lời nhắc sẽ phát ra âm thanh.", ar: "ستصدر التذكيرات صوتًا."
    },
    "The reminder channel is silenced, so reminders arrive without sound.": {
      es: "El canal de avisos está silenciado, así que los avisos llegan sin sonido.", ca: "El canal d'avisos està silenciat, així que els avisos arriben sense so.", fr: "Le canal de rappels est en silencieux : les rappels arrivent sans son.", de: "Der Erinnerungskanal ist stummgeschaltet, deshalb kommen Erinnerungen ohne Ton.",
      it: "Il canale dei promemoria è silenziato, quindi i promemoria arrivano senza suono.", pt: "O canal de lembretes está silenciado, por isso os lembretes chegam sem som.", zh: "提醒渠道已静音，因此提醒不会发声。", ja: "リマインダーのチャンネルがミュートのため、音なしで届きます。", ko: "알림 채널이 무음이라 소리 없이 도착해요.",
      hi: "रिमाइंडर चैनल म्यूट है, इसलिए रिमाइंडर बिना आवाज़ आते हैं।", id: "Saluran pengingat dibisukan, jadi pengingat datang tanpa suara.", tr: "Hatırlatıcı kanalı sessize alınmış, bu yüzden hatırlatıcılar sessiz geliyor.", ru: "Канал напоминаний отключён по звуку, поэтому они приходят беззвучно.", vi: "Kênh lời nhắc đang bị tắt tiếng nên lời nhắc đến mà không có âm thanh.", ar: "قناة التذكيرات مكتومة، لذا تصل التذكيرات بلا صوت."
    },

    "Fix this": {
      es: "Arreglar esto", ca: "Arreglar això", fr: "Corriger", de: "Beheben",
      it: "Sistema questo", pt: "Corrigir isto", zh: "去修复", ja: "修正する", ko: "해결하기",
      hi: "इसे ठीक करें", id: "Perbaiki ini", tr: "Bunu düzelt", ru: "Исправить", vi: "Khắc phục", ar: "أصلح هذا"
    },
    "Open settings": {
      es: "Abrir ajustes", ca: "Obrir ajustos", fr: "Ouvrir les réglages", de: "Einstellungen öffnen",
      it: "Apri impostazioni", pt: "Abrir definições", zh: "打开设置", ja: "設定を開く", ko: "설정 열기",
      hi: "सेटिंग्स खोलें", id: "Buka pengaturan", tr: "Ayarları aç", ru: "Открыть настройки", vi: "Mở cài đặt", ar: "افتح الإعدادات"
    },

    "No reminders scheduled right now.": {
      es: "Ahora mismo no hay ningún aviso programado.", ca: "Ara mateix no hi ha cap avís programat.", fr: "Aucun rappel programmé pour le moment.", de: "Zurzeit sind keine Erinnerungen geplant.",
      it: "Al momento non ci sono promemoria programmati.", pt: "Neste momento não há lembretes agendados.", zh: "目前没有已安排的提醒。", ja: "現在、予定されているリマインダーはありません。", ko: "지금 예약된 알림이 없어요.",
      hi: "अभी कोई रिमाइंडर निर्धारित नहीं है।", id: "Saat ini tidak ada pengingat yang dijadwalkan.", tr: "Şu anda planlanmış hatırlatıcı yok.", ru: "Сейчас нет запланированных напоминаний.", vi: "Hiện chưa có lời nhắc nào được đặt.", ar: "لا توجد تذكيرات مجدولة الآن."
    },
    "{n} reminders scheduled on this phone · next at {t}": {
      es: "{n} avisos programados en este móvil · el siguiente a las {t}", ca: "{n} avisos programats en aquest mòbil · el següent a les {t}", fr: "{n} rappels programmés sur ce téléphone · prochain à {t}", de: "{n} Erinnerungen auf diesem Handy geplant · nächste um {t}",
      it: "{n} promemoria programmati su questo telefono · il prossimo alle {t}", pt: "{n} lembretes agendados neste telemóvel · o próximo às {t}", zh: "本机已安排 {n} 条提醒 · 下一条 {t}", ja: "このスマホに {n} 件のリマインダー · 次は {t}", ko: "이 휴대폰에 알림 {n}개 · 다음은 {t}",
      hi: "इस फ़ोन पर {n} रिमाइंडर निर्धारित · अगला {t} बजे", id: "{n} pengingat dijadwalkan di ponsel ini · berikutnya pukul {t}", tr: "Bu telefonda {n} hatırlatıcı planlı · sıradaki {t}", ru: "На этом телефоне запланировано напоминаний: {n} · следующее в {t}", vi: "{n} lời nhắc đã đặt trên điện thoại này · kế tiếp lúc {t}", ar: "{n} تذكيرات مجدولة على هذا الهاتف · التالي في {t}"
    },
    "{n} reminders scheduled on this phone": {
      es: "{n} avisos programados en este móvil", ca: "{n} avisos programats en aquest mòbil", fr: "{n} rappels programmés sur ce téléphone", de: "{n} Erinnerungen auf diesem Handy geplant",
      it: "{n} promemoria programmati su questo telefono", pt: "{n} lembretes agendados neste telemóvel", zh: "本机已安排 {n} 条提醒", ja: "このスマホに {n} 件のリマインダー", ko: "이 휴대폰에 알림 {n}개",
      hi: "इस फ़ोन पर {n} रिमाइंडर निर्धारित", id: "{n} pengingat dijadwalkan di ponsel ini", tr: "Bu telefonda {n} hatırlatıcı planlı", ru: "На этом телефоне запланировано напоминаний: {n}", vi: "{n} lời nhắc đã đặt trên điện thoại này", ar: "{n} تذكيرات مجدولة على هذا الهاتف"
    },
    "Setting up your test…": {
      es: "Preparando tu prueba…", ca: "Preparant la teva prova…", fr: "Préparation de votre test…", de: "Dein Test wird vorbereitet…",
      it: "Preparazione della prova…", pt: "A preparar o seu teste…", zh: "正在设置测试…", ja: "テストを準備しています…", ko: "테스트를 준비하는 중…",
      hi: "आपका परीक्षण तैयार किया जा रहा है…", id: "Menyiapkan pengujianmu…", tr: "Testin hazırlanıyor…", ru: "Готовим вашу проверку…", vi: "Đang chuẩn bị bài kiểm tra…", ar: "جارٍ إعداد اختبارك…"
    },
    "Test reminder set for {t}. Lock your phone and leave it alone until then.": {
      es: "Aviso de prueba puesto para las {t}. Bloquea el móvil y no lo toques hasta entonces.",
      ca: "Avís de prova posat per a les {t}. Bloqueja el mòbil i no el toquis fins llavors.",
      fr: "Rappel de test programmé pour {t}. Verrouillez votre téléphone et n'y touchez plus jusque-là.",
      de: "Test-Erinnerung für {t} gesetzt. Sperre dein Handy und lass es bis dahin liegen.",
      it: "Promemoria di prova impostato per le {t}. Blocca il telefono e non toccarlo fino ad allora.",
      pt: "Lembrete de teste definido para as {t}. Bloqueie o telemóvel e não lhe toque até lá.",
      zh: "测试提醒已设为 {t}。请锁屏并在此之前不要动手机。",
      ja: "テスト用リマインダーを {t} に設定しました。スマホをロックして、それまで触らないでください。",
      ko: "{t}에 테스트 알림을 설정했어요. 휴대폰을 잠그고 그때까지 그대로 두세요.",
      hi: "{t} के लिए परीक्षण रिमाइंडर सेट किया गया। फ़ोन लॉक करें और तब तक उसे न छुएँ।",
      id: "Pengingat uji disetel pukul {t}. Kunci ponselmu dan biarkan sampai saat itu.",
      tr: "Test hatırlatıcısı {t} için ayarlandı. Telefonunu kilitle ve o ana kadar dokunma.",
      ru: "Тестовое напоминание установлено на {t}. Заблокируйте телефон и не трогайте его до этого времени.",
      vi: "Đã đặt lời nhắc thử lúc {t}. Hãy khóa điện thoại và đừng đụng đến cho tới lúc đó.",
      ar: "تم ضبط تذكير تجريبي في {t}. اقفل هاتفك ولا تلمسه حتى ذلك الوقت."
    },
    "In 1 minute": {
      es: "Dentro de 1 minuto", ca: "D'aquí a 1 minut", fr: "Dans 1 minute", de: "In 1 Minute",
      it: "Tra 1 minuto", pt: "Dentro de 1 minuto", zh: "1 分钟后", ja: "1分後", ko: "1분 후",
      hi: "1 मिनट में", id: "Dalam 1 menit", tr: "1 dakika içinde", ru: "Через 1 минуту", vi: "Sau 1 phút", ar: "بعد دقيقة واحدة"
    },
    "In 15 minutes (lock your phone)": {
      es: "Dentro de 15 minutos (bloquea el móvil)", ca: "D'aquí a 15 minuts (bloqueja el mòbil)", fr: "Dans 15 minutes (verrouillez votre téléphone)", de: "In 15 Minuten (Handy sperren)",
      it: "Tra 15 minuti (blocca il telefono)", pt: "Dentro de 15 minutos (bloqueie o telemóvel)", zh: "15 分钟后（请锁屏）", ja: "15分後（スマホをロックしてください）", ko: "15분 후 (휴대폰을 잠그세요)",
      hi: "15 मिनट में (फ़ोन लॉक करें)", id: "Dalam 15 menit (kunci ponselmu)", tr: "15 dakika içinde (telefonunu kilitle)", ru: "Через 15 минут (заблокируйте телефон)", vi: "Sau 15 phút (hãy khóa điện thoại)", ar: "بعد 15 دقيقة (اقفل هاتفك)"
    }
  };

  /* ---------- checkin.jsx · foodscan.jsx · onboarding.jsx — FoodScan ---------- */

  M["Dose amounts recorded"] = {
    es: "Dosis registradas", ca: "Dosis registrades", fr: "Doses enregistrées", de: "Erfasste Dosismengen",
    it: "Dosi registrate", pt: "Doses registadas", zh: "已记录的剂量", ja: "記録した用量", ko: "기록된 용량",
    hi: "दर्ज की गई खुराक", id: "Dosis yang dicatat", tr: "Kaydedilen dozlar", ru: "Записанные дозы", vi: "Liều đã ghi", ar: "الجرعات المسجَّلة"
  };
  M["Scan a barcode or add a meal by hand to start your record."] = {
    es: "Escanea un código de barras o añade una comida a mano para empezar tu registro.",
    ca: "Escaneja un codi de barres o afegeix un àpat a mà per començar el teu registre.",
    fr: "Scannez un code-barres ou ajoutez un repas à la main pour commencer votre suivi.",
    de: "Scanne einen Barcode oder trage eine Mahlzeit von Hand ein, um dein Protokoll zu starten.",
    it: "Scansiona un codice a barre o aggiungi un pasto a mano per iniziare il tuo registro.",
    pt: "Digitalize um código de barras ou adicione uma refeição à mão para começar o seu registo.",
    zh: "扫描条形码或手动添加一餐，开始你的记录。",
    ja: "バーコードを読み取るか、食事を手入力して記録を始めましょう。",
    ko: "바코드를 스캔하거나 식사를 직접 입력해 기록을 시작하세요.",
    hi: "बारकोड स्कैन करें या खाना हाथ से जोड़कर अपना रिकॉर्ड शुरू करें।",
    id: "Pindai barcode atau tambahkan makanan secara manual untuk memulai catatanmu.",
    tr: "Bir barkod tara ya da bir öğünü elle ekleyerek kaydına başla.",
    ru: "Отсканируйте штрихкод или добавьте приём пищи вручную, чтобы начать записи.",
    vi: "Quét mã vạch hoặc thêm bữa ăn thủ công để bắt đầu ghi chép.",
    ar: "امسح رمزًا شريطيًا أو أضف وجبة يدويًا لتبدأ سجلك."
  };
  M["Scan a barcode with Food Scan, or add a meal by hand, and your meals will appear here."] = {
    es: "Escanea un código de barras con Food Scan, o añade una comida a mano, y tus comidas aparecerán aquí.",
    ca: "Escaneja un codi de barres amb Food Scan, o afegeix un àpat a mà, i els teus àpats apareixeran aquí.",
    fr: "Scannez un code-barres avec Food Scan, ou ajoutez un repas à la main, et vos repas apparaîtront ici.",
    de: "Scanne einen Barcode mit Food Scan oder trage eine Mahlzeit von Hand ein — deine Mahlzeiten erscheinen dann hier.",
    it: "Scansiona un codice a barre con Food Scan, o aggiungi un pasto a mano, e i tuoi pasti compariranno qui.",
    pt: "Digitalize um código de barras com o Food Scan, ou adicione uma refeição à mão, e as suas refeições aparecerão aqui.",
    zh: "用 Food Scan 扫描条形码，或手动添加一餐，你的餐食就会显示在这里。",
    ja: "Food Scan でバーコードを読み取るか、食事を手入力すると、ここに表示されます。",
    ko: "Food Scan으로 바코드를 스캔하거나 식사를 직접 입력하면 여기에 나타납니다.",
    hi: "Food Scan से बारकोड स्कैन करें या खाना हाथ से जोड़ें, और आपके भोजन यहाँ दिखेंगे।",
    id: "Pindai barcode dengan Food Scan, atau tambahkan makanan secara manual, dan makananmu akan muncul di sini.",
    tr: "Food Scan ile bir barkod tara ya da bir öğünü elle ekle; öğünlerin burada görünecek.",
    ru: "Отсканируйте штрихкод в Food Scan или добавьте приём пищи вручную — они появятся здесь.",
    vi: "Quét mã vạch bằng Food Scan hoặc thêm bữa ăn thủ công, các bữa ăn sẽ hiện ở đây.",
    ar: "امسح رمزًا شريطيًا باستخدام Food Scan أو أضف وجبة يدويًا، وستظهر وجباتك هنا."
  };
  M["Scan a packaged product’s barcode for its real ingredients and nutrition — or add a meal by hand."] = {
    es: "Escanea el código de barras de un producto envasado para ver sus ingredientes y su nutrición reales, o añade una comida a mano.",
    ca: "Escaneja el codi de barres d'un producte envasat per veure'n els ingredients i la nutrició reals, o afegeix un àpat a mà.",
    fr: "Scannez le code-barres d'un produit emballé pour ses vrais ingrédients et sa nutrition — ou ajoutez un repas à la main.",
    de: "Scanne den Barcode eines verpackten Produkts für die echten Zutaten und Nährwerte — oder trage eine Mahlzeit von Hand ein.",
    it: "Scansiona il codice a barre di un prodotto confezionato per ingredienti e valori nutrizionali reali — o aggiungi un pasto a mano.",
    pt: "Digitalize o código de barras de um produto embalado para ver os ingredientes e a nutrição reais — ou adicione uma refeição à mão.",
    zh: "扫描包装食品的条形码即可获得真实的配料和营养成分——或手动添加一餐。",
    ja: "パッケージ食品のバーコードを読み取ると、実際の原材料と栄養がわかります。手入力でも追加できます。",
    ko: "포장 제품의 바코드를 스캔하면 실제 원재료와 영양 정보를 볼 수 있어요 — 직접 입력할 수도 있습니다.",
    hi: "पैकेज्ड उत्पाद का बारकोड स्कैन करें और असली सामग्री व पोषण देखें — या खाना हाथ से जोड़ें।",
    id: "Pindai barcode produk kemasan untuk bahan dan gizi aslinya — atau tambahkan makanan secara manual.",
    tr: "Paketli bir ürünün barkodunu tarayarak gerçek içindekileri ve besin değerlerini gör — ya da bir öğünü elle ekle.",
    ru: "Отсканируйте штрихкод упакованного продукта, чтобы увидеть реальный состав и пищевую ценность, или добавьте приём пищи вручную.",
    vi: "Quét mã vạch của sản phẩm đóng gói để biết thành phần và dinh dưỡng thật — hoặc thêm bữa ăn thủ công.",
    ar: "امسح الرمز الشريطي لمنتج معبأ لمعرفة مكوناته وقيمه الغذائية الحقيقية — أو أضف وجبة يدويًا."
  };
  M["Scan a packaged product’s barcode and its real ingredients and nutrition land here — or add any meal by hand."] = {
    es: "Escanea el código de barras de un producto envasado y sus ingredientes y nutrición reales aparecen aquí, o añade cualquier comida a mano.",
    ca: "Escaneja el codi de barres d'un producte envasat i els seus ingredients i nutrició reals apareixen aquí, o afegeix qualsevol àpat a mà.",
    fr: "Scannez le code-barres d'un produit emballé : ses vrais ingrédients et sa nutrition arrivent ici — ou ajoutez n'importe quel repas à la main.",
    de: "Scanne den Barcode eines verpackten Produkts und seine echten Zutaten und Nährwerte landen hier — oder trage jede Mahlzeit von Hand ein.",
    it: "Scansiona il codice a barre di un prodotto confezionato e ingredienti e valori nutrizionali reali finiscono qui — o aggiungi qualsiasi pasto a mano.",
    pt: "Digitalize o código de barras de um produto embalado e os ingredientes e a nutrição reais aparecem aqui — ou adicione qualquer refeição à mão.",
    zh: "扫描包装食品的条形码，真实的配料和营养就会出现在这里——也可以手动添加任意一餐。",
    ja: "パッケージ食品のバーコードを読み取ると、実際の原材料と栄養がここに入ります。どんな食事も手入力できます。",
    ko: "포장 제품의 바코드를 스캔하면 실제 원재료와 영양 정보가 여기에 담겨요 — 어떤 식사든 직접 입력할 수도 있습니다.",
    hi: "पैकेज्ड उत्पाद का बारकोड स्कैन करें और उसकी असली सामग्री व पोषण यहाँ आ जाते हैं — या कोई भी खाना हाथ से जोड़ें।",
    id: "Pindai barcode produk kemasan dan bahan serta gizi aslinya langsung masuk ke sini — atau tambahkan makanan apa pun secara manual.",
    tr: "Paketli bir ürünün barkodunu tara; gerçek içindekiler ve besin değerleri buraya gelir — ya da herhangi bir öğünü elle ekle.",
    ru: "Отсканируйте штрихкод упакованного продукта — реальный состав и пищевая ценность попадут сюда; можно добавить любой приём пищи вручную.",
    vi: "Quét mã vạch của sản phẩm đóng gói và thành phần cùng dinh dưỡng thật sẽ vào đây — hoặc thêm bất kỳ bữa ăn nào thủ công.",
    ar: "امسح الرمز الشريطي لمنتج معبأ فتصل مكوناته وقيمه الغذائية الحقيقية إلى هنا — أو أضف أي وجبة يدويًا."
  };
  M["Scan a barcode, or add today’s meals by hand."] = {
    es: "Escanea un código de barras o añade a mano las comidas de hoy.",
    ca: "Escaneja un codi de barres o afegeix a mà els àpats d'avui.",
    fr: "Scannez un code-barres ou ajoutez les repas d'aujourd'hui à la main.",
    de: "Scanne einen Barcode oder trage die heutigen Mahlzeiten von Hand ein.",
    it: "Scansiona un codice a barre o aggiungi a mano i pasti di oggi.",
    pt: "Digitalize um código de barras ou adicione as refeições de hoje à mão.",
    zh: "扫描条形码，或手动添加今天的餐食。",
    ja: "バーコードを読み取るか、今日の食事を手入力しましょう。",
    ko: "바코드를 스캔하거나 오늘의 식사를 직접 입력하세요.",
    hi: "बारकोड स्कैन करें, या आज का खाना हाथ से जोड़ें।",
    id: "Pindai barcode, atau tambahkan makanan hari ini secara manual.",
    tr: "Bir barkod tara ya da bugünkü öğünleri elle ekle.",
    ru: "Отсканируйте штрихкод или добавьте сегодняшние приёмы пищи вручную.",
    vi: "Quét mã vạch, hoặc thêm bữa ăn hôm nay thủ công.",
    ar: "امسح رمزًا شريطيًا، أو أضف وجبات اليوم يدويًا."
  };
  M["Scan the barcode of a packaged product and its real ingredients and nutrition land in your food journal."] = {
    es: "Escanea el código de barras de un producto envasado y sus ingredientes y nutrición reales van a tu diario de comidas.",
    ca: "Escaneja el codi de barres d'un producte envasat i els seus ingredients i nutrició reals van al teu diari d'àpats.",
    fr: "Scannez le code-barres d'un produit emballé : ses vrais ingrédients et sa nutrition arrivent dans votre journal alimentaire.",
    de: "Scanne den Barcode eines verpackten Produkts und seine echten Zutaten und Nährwerte landen in deinem Ernährungstagebuch.",
    it: "Scansiona il codice a barre di un prodotto confezionato e ingredienti e valori nutrizionali reali finiscono nel tuo diario alimentare.",
    pt: "Digitalize o código de barras de um produto embalado e os ingredientes e a nutrição reais vão para o seu diário alimentar.",
    zh: "扫描包装食品的条形码，真实的配料和营养会进入你的饮食日记。",
    ja: "パッケージ食品のバーコードを読み取ると、実際の原材料と栄養が食事日記に入ります。",
    ko: "포장 제품의 바코드를 스캔하면 실제 원재료와 영양 정보가 식사 일기에 저장돼요.",
    hi: "पैकेज्ड उत्पाद का बारकोड स्कैन करें और उसकी असली सामग्री व पोषण आपकी फ़ूड डायरी में आ जाते हैं।",
    id: "Pindai barcode produk kemasan dan bahan serta gizi aslinya masuk ke jurnal makananmu.",
    tr: "Paketli bir ürünün barkodunu tara; gerçek içindekiler ve besin değerleri yemek günlüğüne işlenir.",
    ru: "Отсканируйте штрихкод упакованного продукта — реальный состав и пищевая ценность попадут в ваш пищевой дневник.",
    vi: "Quét mã vạch của sản phẩm đóng gói và thành phần cùng dinh dưỡng thật sẽ vào nhật ký ăn uống của bạn.",
    ar: "امسح الرمز الشريطي لمنتج معبأ فتنتقل مكوناته وقيمه الغذائية الحقيقية إلى يوميات طعامك."
  };
  M["Barcode scanning for packaged food"] = {
    es: "Escaneo de códigos de barras para productos envasados", ca: "Escaneig de codis de barres per a productes envasats", fr: "Scan de code-barres pour les aliments emballés", de: "Barcode-Scan für verpackte Lebensmittel",
    it: "Scansione del codice a barre per i cibi confezionati", pt: "Leitura de código de barras para alimentos embalados", zh: "扫描包装食品的条形码", ja: "パッケージ食品のバーコード読み取り", ko: "포장 식품 바코드 스캔",
    hi: "पैकेज्ड खाने के लिए बारकोड स्कैनिंग", id: "Pemindaian barcode untuk makanan kemasan", tr: "Paketli gıdalar için barkod taraması", ru: "Сканирование штрихкодов упакованных продуктов", vi: "Quét mã vạch cho thực phẩm đóng gói", ar: "مسح الرموز الشريطية للأطعمة المعبأة"
  };
  M["Or add any meal by hand"] = {
    es: "O añade cualquier comida a mano", ca: "O afegeix qualsevol àpat a mà", fr: "Ou ajoutez n'importe quel repas à la main", de: "Oder trage jede Mahlzeit von Hand ein",
    it: "Oppure aggiungi qualsiasi pasto a mano", pt: "Ou adicione qualquer refeição à mão", zh: "也可手动添加任意一餐", ja: "どんな食事も手入力で追加できます", ko: "또는 어떤 식사든 직접 입력",
    hi: "या कोई भी खाना हाथ से जोड़ें", id: "Atau tambahkan makanan apa pun secara manual", tr: "Ya da herhangi bir öğünü elle ekle", ru: "Или добавьте любой приём пищи вручную", vi: "Hoặc thêm bất kỳ bữa ăn nào thủ công", ar: "أو أضف أي وجبة يدويًا"
  };
  M["Everything kept in your food calendar"] = {
    es: "Todo se guarda en tu calendario de comidas", ca: "Tot es guarda al teu calendari d'àpats", fr: "Tout est conservé dans votre calendrier alimentaire", de: "Alles bleibt in deinem Ernährungskalender",
    it: "Tutto resta nel tuo calendario alimentare", pt: "Tudo fica guardado no seu calendário alimentar", zh: "全部保存在你的饮食日历中", ja: "すべて食事カレンダーに残ります", ko: "모두 식사 캘린더에 보관돼요",
    hi: "सब कुछ आपके फ़ूड कैलेंडर में सुरक्षित", id: "Semuanya tersimpan di kalender makananmu", tr: "Hepsi yemek takviminde saklanır", ru: "Всё сохраняется в вашем пищевом календаре", vi: "Tất cả được lưu trong lịch ăn uống của bạn", ar: "كل شيء محفوظ في تقويم طعامك"
  };

  /* ---------- readingslog.jsx — unidades de glucosa/HbA1c (prompt 5) ---------- */

  M["Which unit are your numbers in?"] = {
    es: "¿En qué unidad están tus cifras?", ca: "En quina unitat són les teves xifres?", fr: "Dans quelle unité sont vos chiffres ?", de: "In welcher Einheit sind deine Werte?",
    it: "In quale unità sono i tuoi valori?", pt: "Em que unidade estão os seus valores?", zh: "你的数值使用哪种单位？", ja: "数値の単位はどちらですか？", ko: "수치의 단위는 무엇인가요?",
    hi: "आपके आंकड़े किस इकाई में हैं?", id: "Angkamu dalam satuan apa?", tr: "Değerlerin hangi birimde?", ru: "В каких единицах ваши показатели?", vi: "Chỉ số của bạn theo đơn vị nào?", ar: "بأي وحدة أرقامك؟"
  };
  M["Pick the unit your meter or lab report shows — you can change it any time."] = {
    es: "Elige la unidad que muestra tu medidor o tu informe de laboratorio; puedes cambiarla cuando quieras.",
    ca: "Tria la unitat que mostra el teu mesurador o el teu informe de laboratori; la pots canviar quan vulguis.",
    fr: "Choisissez l'unité affichée par votre lecteur ou votre analyse de laboratoire — vous pouvez la changer à tout moment.",
    de: "Wähle die Einheit, die dein Messgerät oder dein Laborbericht anzeigt — du kannst sie jederzeit ändern.",
    it: "Scegli l'unità che mostra il tuo misuratore o il referto di laboratorio: puoi cambiarla quando vuoi.",
    pt: "Escolha a unidade que o seu medidor ou a sua análise mostra — pode mudá-la a qualquer momento.",
    zh: "选择你的血糖仪或化验单上显示的单位——随时可以更改。",
    ja: "測定器や検査結果に表示される単位を選んでください。いつでも変更できます。",
    ko: "측정기나 검사 결과지에 표시된 단위를 고르세요 — 언제든 바꿀 수 있어요.",
    hi: "वह इकाई चुनें जो आपका मीटर या लैब रिपोर्ट दिखाती है — इसे कभी भी बदल सकते हैं।",
    id: "Pilih satuan yang ditampilkan alat ukur atau hasil labmu — bisa diubah kapan saja.",
    tr: "Cihazının ya da laboratuvar raporunun gösterdiği birimi seç — istediğin zaman değiştirebilirsin.",
    ru: "Выберите единицу, которую показывает ваш глюкометр или лабораторный отчёт, — её можно изменить в любой момент.",
    vi: "Chọn đơn vị mà máy đo hoặc phiếu xét nghiệm của bạn hiển thị — có thể đổi bất cứ lúc nào.",
    ar: "اختر الوحدة التي يعرضها جهازك أو تقرير المختبر — يمكنك تغييرها في أي وقت."
  };
  M["The number from your lab report or home test, kept with the rest of your data."] = {
    es: "El número de tu informe de laboratorio o de tu prueba en casa, guardado junto al resto de tus datos.",
    ca: "El número del teu informe de laboratori o de la teva prova a casa, guardat amb la resta de les teves dades.",
    fr: "Le chiffre de votre analyse de laboratoire ou de votre test à domicile, conservé avec le reste de vos données.",
    de: "Der Wert aus deinem Laborbericht oder Heimtest, gespeichert bei deinen übrigen Daten.",
    it: "Il numero del referto di laboratorio o del test casalingo, conservato insieme agli altri tuoi dati.",
    pt: "O número da sua análise ou do seu teste em casa, guardado com os restantes dados.",
    zh: "来自化验单或家庭检测的数值，与你的其他数据保存在一起。",
    ja: "検査結果や自宅検査の数値を、ほかのデータと一緒に保存します。",
    ko: "검사 결과지나 자가 검사에서 나온 수치를 다른 데이터와 함께 보관해요.",
    hi: "आपकी लैब रिपोर्ट या घरेलू जाँच का आंकड़ा, बाकी डेटा के साथ सुरक्षित।",
    id: "Angka dari hasil lab atau tes di rumah, tersimpan bersama data lainnya.",
    tr: "Laboratuvar raporundan ya da evdeki testten gelen değer, diğer verilerinle birlikte saklanır.",
    ru: "Значение из лабораторного отчёта или домашнего теста, хранится вместе с остальными данными.",
    vi: "Con số từ phiếu xét nghiệm hoặc que thử tại nhà, được lưu cùng dữ liệu khác của bạn.",
    ar: "الرقم من تقرير المختبر أو الفحص المنزلي، محفوظ مع بقية بياناتك."
  };
  M["Lab test"] = {
    es: "Análisis de laboratorio", ca: "Anàlisi de laboratori", fr: "Analyse en laboratoire", de: "Laborwert",
    it: "Esame di laboratorio", pt: "Análise laboratorial", zh: "化验检测", ja: "検査室の検査", ko: "검사실 검사",
    hi: "लैब जाँच", id: "Tes laboratorium", tr: "Laboratuvar testi", ru: "Лабораторный анализ", vi: "Xét nghiệm tại phòng lab", ar: "فحص مختبري"
  };
  M["Home test"] = {
    es: "Prueba en casa", ca: "Prova a casa", fr: "Test à domicile", de: "Heimtest",
    it: "Test a casa", pt: "Teste em casa", zh: "居家检测", ja: "自宅での検査", ko: "가정용 검사",
    hi: "घर पर जाँच", id: "Tes di rumah", tr: "Evde test", ru: "Домашний тест", vi: "Tự đo tại nhà", ar: "فحص منزلي"
  };

  /* ---------- medalarm.jsx · meds.jsx — avisos y dosis real ---------- */

  M["{n} medicines at {t}"] = {
    es: "{n} medicamentos a las {t}", ca: "{n} medicaments a les {t}", fr: "{n} médicaments à {t}", de: "{n} Medikamente um {t}",
    it: "{n} farmaci alle {t}", pt: "{n} medicamentos às {t}", zh: "{t} 有 {n} 种药", ja: "{t} に {n} 種類の薬", ko: "{t}에 약 {n}개",
    hi: "{t} बजे {n} दवाएँ", id: "{n} obat pukul {t}", tr: "{t} saatinde {n} ilaç", ru: "{n} лекарств в {t}", vi: "{n} thuốc lúc {t}", ar: "{n} أدوية في {t}"
  };
  M["The dose stays “as prescribed”, and each time you mark a dose as taken you can write down how much you really took."] = {
    es: "La dosis sigue siendo «la prescrita», y cada vez que marques una toma puedes anotar cuánto tomaste de verdad.",
    ca: "La dosi continua sent «la prescrita», i cada vegada que marquis una presa pots anotar quant vas prendre de debò.",
    fr: "La dose reste « celle prescrite », et chaque fois que vous marquez une prise vous pouvez noter la quantité réellement prise.",
    de: "Die Dosis bleibt „wie verordnet“, und jedes Mal, wenn du eine Einnahme markierst, kannst du notieren, wie viel du wirklich genommen hast.",
    it: "La dose resta «quella prescritta» e ogni volta che segni una dose come presa puoi annotare quanto hai preso davvero.",
    pt: "A dose continua a ser «a prescrita» e, sempre que marcar uma toma, pode anotar quanto tomou realmente.",
    zh: "剂量仍按“医嘱”记录，每次标记为已服用时，你都可以写下实际服用的量。",
    ja: "用量は「処方どおり」のままで、服用済みにするたびに実際に飲んだ量を書き留められます。",
    ko: "용량은 '처방대로'로 유지되고, 복용으로 표시할 때마다 실제로 얼마나 복용했는지 적을 수 있어요.",
    hi: "खुराक «निर्धारित के अनुसार» ही रहती है, और हर बार खुराक को लिया हुआ चिह्नित करते समय आप लिख सकते हैं कि असल में कितना लिया।",
    id: "Dosisnya tetap «sesuai resep», dan setiap kali kamu menandai dosis sebagai diminum kamu bisa mencatat berapa yang benar-benar diminum.",
    tr: "Doz «reçetedeki gibi» kalır; bir dozu alındı olarak işaretlediğin her seferde gerçekte ne kadar aldığını yazabilirsin.",
    ru: "Доза остаётся «как назначено», и каждый раз, отмечая приём, вы можете записать, сколько приняли на самом деле.",
    vi: "Liều vẫn giữ «theo đơn», và mỗi lần bạn đánh dấu đã uống, bạn có thể ghi lại lượng thực sự đã dùng.",
    ar: "تبقى الجرعة «كما وُصفت»، وفي كل مرة تحدد فيها جرعة كمتناولة يمكنك تدوين الكمية التي تناولتها فعليًا."
  };

  /* ---------- manualpatient.jsx — manual: datos de salud del móvil ---------- */

  M["Your phone already counts your steps and your sleep. Let the app read them and that part of your diary fills in by itself — free for everyone."] = {
    es: "Tu móvil ya cuenta tus pasos y tu sueño. Deja que la app los lea y esa parte de tu diario se rellena sola, gratis para todos.",
    ca: "El teu mòbil ja compta els teus passos i el teu son. Deixa que l'app els llegeixi i aquesta part del teu diari s'omple sola, gratis per a tothom.",
    fr: "Votre téléphone compte déjà vos pas et votre sommeil. Laissez l'application les lire et cette partie de votre journal se remplit toute seule — gratuit pour tous.",
    de: "Dein Handy zählt deine Schritte und deinen Schlaf bereits. Lass die App sie lesen, und dieser Teil deines Tagebuchs füllt sich von selbst — für alle kostenlos.",
    it: "Il tuo telefono conta già i tuoi passi e il tuo sonno. Lascia che l'app li legga e quella parte del diario si riempie da sola: gratis per tutti.",
    pt: "O seu telemóvel já conta os seus passos e o seu sono. Deixe a app lê-los e essa parte do seu diário preenche-se sozinha — gratuito para todos.",
    zh: "你的手机已经在记录步数和睡眠。让应用读取这些数据，日记的这部分就会自动填好——所有人免费。",
    ja: "スマホはすでに歩数と睡眠を数えています。アプリに読み取らせれば、日記のその部分は自動で埋まります（全員無料）。",
    ko: "휴대폰은 이미 걸음 수와 수면을 세고 있어요. 앱이 읽도록 허용하면 일기의 그 부분이 저절로 채워집니다 — 모두에게 무료예요.",
    hi: "आपका फ़ोन पहले से ही आपके कदम और नींद गिनता है। ऐप को उन्हें पढ़ने दें और डायरी का वह हिस्सा अपने आप भर जाएगा — सबके लिए मुफ़्त।",
    id: "Ponselmu sudah menghitung langkah dan tidurmu. Biarkan aplikasi membacanya dan bagian buku harianmu itu terisi sendiri — gratis untuk semua.",
    tr: "Telefonun adımlarını ve uykunu zaten sayıyor. Uygulamanın bunları okumasına izin ver, günlüğünün o kısmı kendiliğinden dolsun — herkes için ücretsiz.",
    ru: "Ваш телефон уже считает шаги и сон. Разрешите приложению их читать — и эта часть дневника заполнится сама. Бесплатно для всех.",
    vi: "Điện thoại của bạn vốn đã đếm số bước và giấc ngủ. Hãy để ứng dụng đọc chúng và phần đó của nhật ký sẽ tự điền — miễn phí cho mọi người.",
    ar: "هاتفك يحسب خطواتك ونومك بالفعل. دع التطبيق يقرأها فيمتلئ هذا الجزء من يومياتك تلقائيًا — مجانًا للجميع."
  };
  M["On Home — or in Settings — open <strong>Connect your health data</strong> and tap <strong>Yes, read them from my phone</strong>."] = {
    es: "En Inicio —o en Ajustes— abre <strong>Conecta tus datos de salud</strong> y toca <strong>Sí, léelos de mi móvil</strong>.",
    ca: "A Inici —o a Ajustos— obre <strong>Connecta les teves dades de salut</strong> i toca <strong>Sí, llegeix-les del meu mòbil</strong>.",
    fr: "Sur l'Accueil — ou dans les Réglages — ouvrez <strong>Connectez vos données de santé</strong> et touchez <strong>Oui, lisez-les depuis mon téléphone</strong>.",
    de: "Öffne auf der Startseite — oder in den Einstellungen — <strong>Verbinde deine Gesundheitsdaten</strong> und tippe auf <strong>Ja, von meinem Handy lesen</strong>.",
    it: "Nella Home —o nelle Impostazioni— apri <strong>Collega i tuoi dati sulla salute</strong> e tocca <strong>Sì, leggili dal mio telefono</strong>.",
    pt: "No Início — ou nas Definições — abra <strong>Ligue os seus dados de saúde</strong> e toque em <strong>Sim, leia-os do meu telemóvel</strong>.",
    zh: "在首页——或在设置中——打开<strong>连接你的健康数据</strong>，然后点按<strong>好，从我的手机读取</strong>。",
    ja: "ホーム（または設定）で<strong>健康データを連携する</strong>を開き、<strong>はい、スマホから読み取る</strong>をタップします。",
    ko: "홈 — 또는 설정 — 에서 <strong>건강 데이터 연결</strong>을 열고 <strong>네, 휴대폰에서 읽어 주세요</strong>를 누르세요.",
    hi: "होम पर — या सेटिंग्स में — <strong>अपना स्वास्थ्य डेटा जोड़ें</strong> खोलें और <strong>हाँ, मेरे फ़ोन से पढ़ें</strong> पर टैप करें।",
    id: "Di Beranda — atau di Pengaturan — buka <strong>Hubungkan data kesehatanmu</strong> lalu ketuk <strong>Ya, baca dari ponselku</strong>.",
    tr: "Ana ekranda — ya da Ayarlar'da — <strong>Sağlık verilerini bağla</strong>'yı aç ve <strong>Evet, telefonumdan oku</strong>'ya dokun.",
    ru: "На главном экране — или в настройках — откройте <strong>Подключите данные о здоровье</strong> и нажмите <strong>Да, читать с моего телефона</strong>.",
    vi: "Ở Trang chủ — hoặc trong Cài đặt — mở <strong>Kết nối dữ liệu sức khỏe</strong> và chạm <strong>Có, đọc từ điện thoại của tôi</strong>.",
    ar: "من الصفحة الرئيسية — أو من الإعدادات — افتح <strong>اربط بياناتك الصحية</strong> ثم اضغط <strong>نعم، اقرأها من هاتفي</strong>."
  };

  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = {};
    Object.keys(M[k]).forEach(function (lang) {
      if (!CF_UI_MAP[k][lang]) CF_UI_MAP[k][lang] = M[k][lang];
    });
  });
})();
