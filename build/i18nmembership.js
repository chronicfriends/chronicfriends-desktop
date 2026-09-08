/* ===================================================================
   i18nmembership — CHAT1a (1 Sep 2026): «Your membership».
   The sheet behind Settings › Membership: what you have now, THE FREE
   PLAN with its real counters, what Premium changes (and the 60-scan
   ceiling it does NOT change), the four plans, manage & restore.
   Everything else on that screen reuses keys that already ship in the
   16 languages — plan names, terms, «Restore purchase», «Not now»,
   «Manage membership», «Last {n} days», the free-plan tone line.
   English is the source key; the 15 remaining app languages inline.
   Merge-if-missing — never overwrites a wording another screen shows.
   =================================================================== */
(function () {
  if (typeof CF_UI_MAP === 'undefined') return;
  var M = {
    /* ---- FOUND IN PASSING, AND IT IS A REAL GAP: `tr('Membership')` —
       the Settings group label and the manual's `where:` chip — had NO
       entry in any dictionary, so 15 languages read the English word.
       Same wording as «Manage membership» (i18ngap3), so the label, the
       button and the manual can never disagree. ---- */
    'Membership': {
      es: 'Suscripción', ca: 'Subscripció', fr: 'Abonnement', de: 'Mitgliedschaft',
      it: 'Abbonamento', pt: 'Subscrição', zh: '会员', ja: 'メンバーシップ',
      ko: '멤버십', hi: 'सदस्यता', id: 'Keanggotaan', tr: 'Üyelik',
      ru: 'Подписка', vi: 'Gói thành viên', ar: 'العضوية',
    },
    /* ---- the sheet itself ---- */
    'Your membership': {
      es: 'Tu suscripción', ca: 'La teva subscripció', fr: 'Votre abonnement', de: 'Deine Mitgliedschaft',
      it: 'Il tuo abbonamento', pt: 'A tua subscrição', zh: '你的会员', ja: 'あなたのメンバーシップ',
      ko: '내 멤버십', hi: 'आपकी सदस्यता', id: 'Keanggotaanmu', tr: 'Üyeliğin',
      ru: 'Ваша подписка', vi: 'Gói thành viên của bạn', ar: 'عضويتك',
    },
    'Free forever. Not a trial — a plan.': {
      es: 'Gratis para siempre. No es una prueba: es un plan.',
      ca: 'Gratis per sempre. No és una prova: és un pla.',
      fr: 'Gratuit pour toujours. Pas un essai : un forfait.',
      de: 'Für immer gratis. Kein Test — ein Plan.',
      it: 'Gratis per sempre. Non è una prova: è un piano.',
      pt: 'Grátis para sempre. Não é um teste: é um plano.',
      zh: '永久免费。不是试用，是一个方案。',
      ja: 'ずっと無料。トライアルではなく、プランです。',
      ko: '언제까지나 무료. 체험이 아니라 요금제입니다.',
      hi: 'हमेशा के लिए मुफ़्त। यह परीक्षण नहीं, एक प्लान है।',
      id: 'Gratis selamanya. Bukan uji coba — sebuah paket.',
      tr: 'Sonsuza kadar ücretsiz. Deneme değil, bir plan.',
      ru: 'Бесплатно навсегда. Это не пробный период, а план.',
      vi: 'Miễn phí mãi mãi. Không phải bản dùng thử — đây là một gói.',
      ar: 'مجاني إلى الأبد. ليست تجربة — إنها خطة.',
    },
    /* the free plan's row in «The plans» (7 Sep 2026). «Free» here means
       GRATIS, never «libre» — Italian «Gratis», not «Libero». «Forever»
       repeats the header's own wording («Free forever…») so the screen
       never says the same thing two different ways. */
    'Free': {
      es: 'Gratis', ca: 'Gratis', fr: 'Gratuit', de: 'Gratis', it: 'Gratis', pt: 'Grátis',
      zh: '免费', ja: '無料', ko: '무료', hi: 'मुफ़्त', id: 'Gratis', tr: 'Ücretsiz',
      ru: 'Бесплатно', vi: 'Miễn phí', ar: 'مجاني',
    },
    'Forever': {
      es: 'Para siempre', ca: 'Per sempre', fr: 'Pour toujours', de: 'Für immer', it: 'Per sempre', pt: 'Para sempre',
      zh: '永久', ja: 'ずっと', ko: '언제까지나', hi: 'हमेशा के लिए', id: 'Selamanya', tr: 'Sonsuza kadar',
      ru: 'Навсегда', vi: 'Mãi mãi', ar: 'إلى الأبد',
    },
    'What you have now': {
      es: 'Lo que tienes ahora', ca: 'El que tens ara', fr: 'Ce que vous avez maintenant', de: 'Was du jetzt hast',
      it: 'Quello che hai ora', pt: 'O que tens agora', zh: '你现在拥有的', ja: 'いま使えるもの',
      ko: '지금 이용 중인 것', hi: 'अभी आपके पास क्या है', id: 'Yang kamu miliki sekarang', tr: 'Şu anda sahip olduğun',
      ru: 'Что у вас сейчас', vi: 'Bạn đang có gì', ar: 'ما لديك الآن',
    },
    'The free plan': {
      es: 'El plan gratuito', ca: 'El pla gratuït', fr: 'L’offre gratuite', de: 'Der Gratis-Plan',
      it: 'Il piano gratuito', pt: 'O plano gratuito', zh: '免费方案', ja: '無料プラン',
      ko: '무료 플랜', hi: 'मुफ़्त प्लान', id: 'Paket gratis', tr: 'Ücretsiz plan',
      ru: 'Бесплатный план', vi: 'Gói miễn phí', ar: 'الخطة المجانية',
    },
    'The plans': {
      es: 'Los planes', ca: 'Els plans', fr: 'Les formules', de: 'Die Pläne',
      it: 'I piani', pt: 'Os planos', zh: '各种方案', ja: 'プラン',
      ko: '요금제', hi: 'प्लान', id: 'Paket-paket', tr: 'Planlar',
      ru: 'Планы', vi: 'Các gói', ar: 'الخطط',
    },

    /* ---- the six counters, as a table: label + value ---- */
    'Journal, trackers, medication & community': {
      es: 'Diario, registros, medicación y comunidad', ca: 'Diari, registres, medicació i comunitat',
      fr: 'Journal, suivis, médicaments et communauté', de: 'Tagebuch, Tracker, Medikamente & Community',
      it: 'Diario, tracker, farmaci e comunità', pt: 'Diário, registos, medicação e comunidade',
      zh: '日记、追踪、用药与社区', ja: '日記・トラッカー・薬・コミュニティ',
      ko: '일지, 트래커, 약, 커뮤니티', hi: 'डायरी, ट्रैकर, दवाइयाँ और समुदाय',
      id: 'Jurnal, pelacak, obat & komunitas', tr: 'Günlük, takipler, ilaçlar ve topluluk',
      ru: 'Дневник, трекеры, лекарства и сообщество', vi: 'Nhật ký, theo dõi, thuốc và cộng đồng',
      ar: 'اليوميات والمتابعات والأدوية والمجتمع',
    },
    'Looking back over your days': {
      es: 'Mirar atrás en tus días', ca: 'Mirar enrere els teus dies', fr: 'Revenir sur vos journées',
      de: 'Zurückschauen auf deine Tage', it: 'Guardare indietro nei tuoi giorni', pt: 'Olhar para trás nos teus dias',
      zh: '回看你的日子', ja: '過去の記録をふり返る', ko: '지난 날 돌아보기', hi: 'अपने बीते दिन देखना',
      id: 'Melihat kembali hari-harimu', tr: 'Geçmiş günlerine bakmak', ru: 'Просмотр прошедших дней',
      vi: 'Xem lại những ngày đã qua', ar: 'العودة إلى أيامك السابقة',
    },
    'Downloading your own data': {
      es: 'Descargar tus propios datos', ca: 'Descarregar les teves dades', fr: 'Télécharger vos propres données',
      de: 'Deine eigenen Daten herunterladen', it: 'Scaricare i tuoi dati', pt: 'Descarregar os teus dados',
      zh: '下载你自己的数据', ja: '自分のデータをダウンロード', ko: '내 데이터 내려받기', hi: 'अपना डेटा डाउनलोड करना',
      id: 'Mengunduh datamu sendiri', tr: 'Kendi verini indirmek', ru: 'Скачивание своих данных',
      vi: 'Tải dữ liệu của bạn', ar: 'تنزيل بياناتك',
    },
    'No limit': {
      es: 'Sin límite', ca: 'Sense límit', fr: 'Sans limite', de: 'Ohne Limit',
      it: 'Senza limiti', pt: 'Sem limite', zh: '无限制', ja: '制限なし',
      ko: '제한 없음', hi: 'कोई सीमा नहीं', id: 'Tanpa batas', tr: 'Sınırsız',
      ru: 'Без ограничений', vi: 'Không giới hạn', ar: 'بلا حد',
    },
    '{n} a day': {
      es: '{n} al día', ca: '{n} al dia', fr: '{n} par jour', de: '{n} pro Tag',
      it: '{n} al giorno', pt: '{n} por dia', zh: '每天 {n} 次', ja: '1日 {n} 回',
      ko: '하루 {n}회', hi: 'प्रतिदिन {n}', id: '{n} per hari', tr: 'Günde {n}',
      ru: '{n} в день', vi: '{n} mỗi ngày', ar: '{n} يوميًا',
    },
    '{n} a month': {
      es: '{n} al mes', ca: '{n} al mes', fr: '{n} par mois', de: '{n} pro Monat',
      it: '{n} al mese', pt: '{n} por mês', zh: '每月 {n} 次', ja: '月 {n} 回',
      ko: '한 달 {n}회', hi: 'प्रति माह {n}', id: '{n} per bulan', tr: 'Ayda {n}',
      ru: '{n} в месяц', vi: '{n} mỗi tháng', ar: '{n} شهريًا',
    },
    'Always free': {
      es: 'Siempre gratis', ca: 'Sempre gratis', fr: 'Toujours gratuit', de: 'Immer gratis',
      it: 'Sempre gratis', pt: 'Sempre grátis', zh: '始终免费', ja: 'いつでも無料',
      ko: '항상 무료', hi: 'हमेशा मुफ़्त', id: 'Selalu gratis', tr: 'Her zaman ücretsiz',
      ru: 'Всегда бесплатно', vi: 'Luôn miễn phí', ar: 'مجاني دائمًا',
    },

    /* ---- the two things the counters never touch ---- */
    'Downloading your own data is always free — a right, not an extra.': {
      es: 'Descargar tus datos es siempre gratis: es un derecho, no un extra.',
      ca: 'Descarregar les teves dades és sempre gratis: és un dret, no un extra.',
      fr: 'Télécharger vos données est toujours gratuit : c’est un droit, pas une option.',
      de: 'Deine Daten herunterzuladen ist immer gratis — ein Recht, kein Extra.',
      it: 'Scaricare i tuoi dati è sempre gratis: è un diritto, non un extra.',
      pt: 'Descarregar os teus dados é sempre grátis: é um direito, não um extra.',
      zh: '下载你的数据始终免费——这是权利，不是附加功能。',
      ja: '自分のデータのダウンロードはいつでも無料です。追加機能ではなく、あなたの権利です。',
      ko: '내 데이터를 내려받는 것은 언제나 무료입니다. 부가 기능이 아니라 권리입니다.',
      hi: 'अपना डेटा डाउनलोड करना हमेशा मुफ़्त है — यह अधिकार है, अतिरिक्त सुविधा नहीं।',
      id: 'Mengunduh datamu selalu gratis — itu hak, bukan fitur tambahan.',
      tr: 'Kendi verini indirmek her zaman ücretsizdir — bu bir hak, ek özellik değil.',
      ru: 'Скачивание ваших данных всегда бесплатно — это право, а не дополнительная услуга.',
      vi: 'Tải dữ liệu của bạn luôn miễn phí — đó là quyền, không phải tính năng thêm.',
      ar: 'تنزيل بياناتك مجاني دائمًا — هذا حق، وليس ميزة إضافية.',
    },
    /* the half-hour grace (CF_USE_GRACE_MS) — it works in the user's favour
       and until today it was written down nowhere */
    'Come back to the same room within {n} minutes and it is still the same session: it does not spend another use. Food Scan is not included — a scan is a scan.': {
      es: 'Si vuelves a la misma sala antes de {n} minutos sigue siendo la misma sesión: no gasta otro uso. Food Scan no entra: un escaneo es un escaneo.',
      ca: 'Si tornes a la mateixa sala abans de {n} minuts continua sent la mateixa sessió: no gasta un altre ús. Food Scan no hi entra: un escaneig és un escaneig.',
      fr: 'Si vous revenez dans la même salle avant {n} minutes, c’est toujours la même séance : cela ne consomme pas un autre usage. Food Scan n’est pas concerné : un scan est un scan.',
      de: 'Wenn du innerhalb von {n} Minuten in denselben Raum zurückkehrst, ist es dieselbe Sitzung: sie verbraucht keine weitere Nutzung. Food Scan gilt nicht — ein Scan ist ein Scan.',
      it: 'Se torni nella stessa stanza entro {n} minuti è sempre la stessa sessione: non consuma un altro utilizzo. Food Scan non rientra: una scansione è una scansione.',
      pt: 'Se voltares à mesma sala dentro de {n} minutos continua a ser a mesma sessão: não gasta outro uso. O Food Scan não entra: um scan é um scan.',
      zh: '在 {n} 分钟内重新进入同一个房间仍算同一次，不会再消耗一次。Food Scan 不包含在内：一次扫描就是一次扫描。',
      ja: '{n} 分以内に同じ部屋へ戻れば同じセッションのままで、回数は減りません。Food Scan は対象外です — スキャンは 1 回は 1 回です。',
      ko: '{n}분 안에 같은 공간으로 돌아오면 같은 세션이라 횟수가 줄지 않습니다. Food Scan은 해당되지 않습니다 — 스캔은 한 번이 한 번입니다.',
      hi: '{n} मिनट के भीतर उसी कमरे में लौटें तो वही सत्र जारी रहता है: दूसरा उपयोग खर्च नहीं होता। Food Scan इसमें शामिल नहीं है — एक स्कैन एक स्कैन है।',
      id: 'Kembali ke ruang yang sama dalam {n} menit tetap sesi yang sama: tidak memakai jatah lagi. Food Scan tidak termasuk — satu pindai tetap satu pindai.',
      tr: '{n} dakika içinde aynı odaya dönersen bu hâlâ aynı oturumdur: yeni bir hak harcamaz. Food Scan buna dâhil değil — bir tarama bir taramadır.',
      ru: 'Если вы вернётесь в ту же комнату в течение {n} минут, это та же сессия: ещё одно использование не тратится. Food Scan не входит — скан есть скан.',
      vi: 'Quay lại cùng một phòng trong vòng {n} phút vẫn là cùng một phiên: không tốn thêm lượt. Food Scan không tính — một lần quét là một lần quét.',
      ar: 'إذا عدت إلى الغرفة نفسها خلال {n} دقيقة فهي الجلسة نفسها ولا تستهلك استخدامًا آخر. Food Scan غير مشمول — المسح مسح.',
    },

    /* ---- what Premium changes, and the ceiling it does not ---- */
    'The daily and monthly counters go away: meditation, games and reports whenever you need them.': {
      es: 'Los contadores diarios y mensuales desaparecen: meditación, juegos e informes cuando los necesites.',
      ca: 'Els comptadors diaris i mensuals desapareixen: meditació, jocs i informes quan els necessitis.',
      fr: 'Les compteurs quotidiens et mensuels disparaissent : méditation, jeux et rapports quand vous en avez besoin.',
      de: 'Die täglichen und monatlichen Zähler fallen weg: Meditation, Spiele und Berichte, wann du sie brauchst.',
      it: 'I contatori giornalieri e mensili spariscono: meditazione, giochi e report quando ti servono.',
      pt: 'Os contadores diários e mensais desaparecem: meditação, jogos e relatórios quando precisares.',
      zh: '每日和每月的次数限制取消：冥想、游戏和报告随时可用。',
      ja: '1日・1か月の回数制限がなくなります。瞑想もゲームもレポートも、必要なときに。',
      ko: '하루·한 달 횟수 제한이 사라집니다: 명상, 게임, 리포트를 필요할 때마다.',
      hi: 'दैनिक और मासिक काउंटर हट जाते हैं: ध्यान, खेल और रिपोर्ट जब भी ज़रूरत हो।',
      id: 'Penghitung harian dan bulanan hilang: meditasi, permainan, dan laporan kapan pun kamu perlu.',
      tr: 'Günlük ve aylık sayaçlar kalkar: meditasyon, oyunlar ve raporlar ihtiyaç duyduğunda.',
      ru: 'Дневные и месячные счётчики исчезают: медитация, игры и отчёты — когда нужно.',
      vi: 'Bộ đếm theo ngày và theo tháng biến mất: thiền, trò chơi và báo cáo bất cứ khi nào bạn cần.',
      ar: 'تختفي العدادات اليومية والشهرية: التأمّل والألعاب والتقارير وقتما تحتاجها.',
    },
    'Food Scan: up to {n} scans a month': {
      es: 'Food Scan: hasta {n} escaneos al mes', ca: 'Food Scan: fins a {n} escanejos al mes',
      fr: 'Food Scan : jusqu’à {n} scans par mois', de: 'Food Scan: bis zu {n} Scans pro Monat',
      it: 'Food Scan: fino a {n} scansioni al mese', pt: 'Food Scan: até {n} scans por mês',
      zh: 'Food Scan：每月最多 {n} 次扫描', ja: 'Food Scan：月に最大 {n} 回のスキャン',
      ko: 'Food Scan: 한 달 최대 {n}회 스캔', hi: 'Food Scan: प्रति माह अधिकतम {n} स्कैन',
      id: 'Food Scan: maksimal {n} pindai per bulan', tr: 'Food Scan: ayda en fazla {n} tarama',
      ru: 'Food Scan: до {n} сканов в месяц', vi: 'Food Scan: tối đa {n} lần quét mỗi tháng',
      ar: 'Food Scan: حتى {n} عملية مسح شهريًا',
    },
    'Not a Premium limit — the same for everybody, and it starts again on {date}.': {
      es: 'No es un límite de Premium: es igual para todo el mundo y vuelve a empezar el {date}.',
      ca: 'No és un límit de Premium: és igual per a tothom i torna a començar el {date}.',
      fr: 'Ce n’est pas une limite Premium : elle est la même pour tout le monde et repart le {date}.',
      de: 'Kein Premium-Limit — für alle gleich, und es beginnt am {date} neu.',
      it: 'Non è un limite Premium: è uguale per tutti e riparte il {date}.',
      pt: 'Não é um limite Premium: é igual para toda a gente e recomeça a {date}.',
      zh: '这不是 Premium 的限制——对所有人都一样，并在 {date} 重新开始。',
      ja: 'これは Premium の制限ではありません。全員に共通で、{date} にリセットされます。',
      ko: 'Premium의 제한이 아닙니다 — 모두에게 같으며 {date}에 다시 시작합니다.',
      hi: 'यह Premium की सीमा नहीं है — सबके लिए एक जैसी है और {date} को फिर से शुरू होती है।',
      id: 'Bukan batas Premium — sama untuk semua orang, dan dimulai lagi pada {date}.',
      tr: 'Premium sınırı değil — herkes için aynı ve {date} tarihinde yeniden başlar.',
      ru: 'Это не ограничение Premium — оно одинаково для всех и обнуляется {date}.',
      vi: 'Đây không phải giới hạn của Premium — giống nhau với mọi người và bắt đầu lại vào {date}.',
      ar: 'ليس حدًّا خاصًا بـ Premium — إنه نفسه للجميع، ويبدأ من جديد في {date}.',
    },
    'Not a Premium limit — the same for everybody.': {
      es: 'No es un límite de Premium: es igual para todo el mundo.',
      ca: 'No és un límit de Premium: és igual per a tothom.',
      fr: 'Ce n’est pas une limite Premium : elle est la même pour tout le monde.',
      de: 'Kein Premium-Limit — für alle gleich.',
      it: 'Non è un limite Premium: è uguale per tutti.',
      pt: 'Não é um limite Premium: é igual para toda a gente.',
      zh: '这不是 Premium 的限制——对所有人都一样。',
      ja: 'これは Premium の制限ではありません。全員に共通です。',
      ko: 'Premium의 제한이 아닙니다 — 모두에게 같습니다.',
      hi: 'यह Premium की सीमा नहीं है — सबके लिए एक जैसी है।',
      id: 'Bukan batas Premium — sama untuk semua orang.',
      tr: 'Premium sınırı değil — herkes için aynı.',
      ru: 'Это не ограничение Premium — оно одинаково для всех.',
      vi: 'Đây không phải giới hạn của Premium — giống nhau với mọi người.',
      ar: 'ليس حدًّا خاصًا بـ Premium — إنه نفسه للجميع.',
    },
    'The store shows the price in your currency before you confirm.': {
      es: 'La tienda te muestra el precio en tu moneda antes de confirmar.',
      ca: 'La botiga et mostra el preu en la teva moneda abans de confirmar.',
      fr: 'La boutique affiche le prix dans votre devise avant confirmation.',
      de: 'Der Store zeigt den Preis in deiner Währung, bevor du bestätigst.',
      it: 'Lo store mostra il prezzo nella tua valuta prima di confermare.',
      pt: 'A loja mostra o preço na tua moeda antes de confirmares.',
      zh: '商店会在你确认前显示你所在货币的价格。',
      ja: '確定する前に、ストアがあなたの通貨で価格を表示します。',
      ko: '확인하기 전에 스토어가 현지 통화로 가격을 보여줍니다.',
      hi: 'पुष्टि करने से पहले स्टोर आपकी मुद्रा में कीमत दिखाता है।',
      id: 'Toko menampilkan harga dalam mata uangmu sebelum kamu mengonfirmasi.',
      tr: 'Onaylamadan önce mağaza fiyatı kendi para biriminde gösterir.',
      ru: 'Магазин покажет цену в вашей валюте до подтверждения.',
      vi: 'Cửa hàng hiển thị giá theo tiền tệ của bạn trước khi bạn xác nhận.',
      ar: 'يعرض المتجر السعر بعملتك قبل أن تؤكّد.',
    },

    /* ---- the pioneer: what they already have, before any price ---- */
    'Pioneer Premium — {n} days left': {
      es: 'Premium pionero: te quedan {n} días', ca: 'Premium pioner: et queden {n} dies',
      fr: 'Premium pionnier — il vous reste {n} jours', de: 'Pionier-Premium — noch {n} Tage',
      it: 'Premium pioniere — ti restano {n} giorni', pt: 'Premium pioneiro — faltam {n} dias',
      zh: '先锋 Premium——还剩 {n} 天', ja: 'パイオニア Premium — 残り {n} 日',
      ko: '파이오니어 Premium — {n}일 남음', hi: 'अग्रणी Premium — {n} दिन बाकी',
      id: 'Premium perintis — sisa {n} hari', tr: 'Öncü Premium — {n} gün kaldı',
      ru: 'Premium первопроходца — осталось дней: {n}', vi: 'Premium tiên phong — còn {n} ngày',
      ar: 'Premium الرائد — بقي {n} يومًا',
    },
    'Everything is open until {date}. There is nothing to buy today.': {
      es: 'Todo está abierto hasta el {date}. Hoy no hay nada que comprar.',
      ca: 'Tot està obert fins al {date}. Avui no hi ha res a comprar.',
      fr: 'Tout est ouvert jusqu’au {date}. Il n’y a rien à acheter aujourd’hui.',
      de: 'Bis zum {date} ist alles offen. Heute gibt es nichts zu kaufen.',
      it: 'Tutto è aperto fino al {date}. Oggi non c’è nulla da comprare.',
      pt: 'Está tudo aberto até {date}. Hoje não há nada para comprar.',
      zh: '在 {date} 之前一切都已开放。今天没有需要购买的东西。',
      ja: '{date} まですべて使えます。今日買うものはありません。',
      ko: '{date}까지 모두 열려 있습니다. 오늘 살 것은 없습니다.',
      hi: '{date} तक सब कुछ खुला है। आज कुछ खरीदने की ज़रूरत नहीं।',
      id: 'Semuanya terbuka sampai {date}. Hari ini tidak ada yang perlu dibeli.',
      tr: '{date} tarihine kadar her şey açık. Bugün satın alınacak bir şey yok.',
      ru: 'До {date} открыто всё. Сегодня покупать нечего.',
      vi: 'Mọi thứ đang mở đến {date}. Hôm nay không có gì để mua.',
      ar: 'كل شيء مفتوح حتى {date}. لا شيء لتشتريه اليوم.',
    },
    'Your trial is running — {n} days left. Nothing is charged until it ends.': {
      es: 'Tu prueba está en marcha: quedan {n} días. No se cobra nada hasta que termine.',
      ca: 'La teva prova està en marxa: queden {n} dies. No es cobra res fins que s’acabi.',
      fr: 'Votre essai est en cours — il reste {n} jours. Rien n’est facturé avant la fin.',
      de: 'Dein Test läuft — noch {n} Tage. Bis dahin wird nichts abgebucht.',
      it: 'La tua prova è in corso — restano {n} giorni. Non si paga nulla finché non finisce.',
      pt: 'O teu teste está a decorrer — faltam {n} dias. Nada é cobrado até terminar.',
      zh: '试用进行中——还剩 {n} 天。结束之前不会收费。',
      ja: 'トライアル中 — 残り {n} 日。終わるまで請求はありません。',
      ko: '체험 진행 중 — {n}일 남았습니다. 끝날 때까지 청구되지 않습니다.',
      hi: 'आपका परीक्षण चल रहा है — {n} दिन बाकी। खत्म होने तक कोई शुल्क नहीं।',
      id: 'Uji cobamu sedang berjalan — sisa {n} hari. Tidak ada tagihan sampai berakhir.',
      tr: 'Denemen sürüyor — {n} gün kaldı. Bitene kadar hiçbir ücret alınmaz.',
      ru: 'Пробный период идёт — осталось дней: {n}. До его окончания ничего не спишется.',
      vi: 'Bản dùng thử đang chạy — còn {n} ngày. Không tính phí cho đến khi kết thúc.',
      ar: 'تجربتك جارية — بقي {n} يومًا. لا يُخصم شيء حتى تنتهي.',
    },
    'Buy Premium anyway': {
      es: 'Comprar Premium igualmente', ca: 'Comprar Premium igualment', fr: 'Acheter Premium quand même',
      de: 'Premium trotzdem kaufen', it: 'Acquista Premium comunque', pt: 'Comprar Premium mesmo assim',
      zh: '仍要购买 Premium', ja: 'それでも Premium を購入', ko: '그래도 Premium 구매',
      hi: 'फिर भी Premium खरीदें', id: 'Tetap beli Premium', tr: 'Yine de Premium al',
      ru: 'Всё равно купить Premium', vi: 'Vẫn mua Premium', ar: 'شراء Premium على أي حال',
    },
    'You already have Premium': {
      es: 'Ya tienes Premium', ca: 'Ja tens Premium', fr: 'Vous avez déjà Premium', de: 'Du hast Premium schon',
      it: 'Hai già Premium', pt: 'Já tens Premium', zh: '你已经拥有 Premium', ja: 'すでに Premium をお持ちです',
      ko: '이미 Premium을 이용 중입니다', hi: 'आपके पास पहले से Premium है', id: 'Kamu sudah punya Premium',
      tr: 'Zaten Premium’un var', ru: 'У вас уже есть Premium', vi: 'Bạn đã có Premium', ar: 'لديك Premium بالفعل',
    },
    'You already have Premium free until {date}. If you buy now you start paying, and you get nothing new.': {
      es: 'Ya tienes Premium gratis hasta el {date}. Si compras ahora empezarás a pagar y no obtendrás nada nuevo.',
      ca: 'Ja tens Premium gratis fins al {date}. Si compres ara començaràs a pagar i no obtindràs res nou.',
      fr: 'Vous avez déjà Premium gratuitement jusqu’au {date}. Si vous achetez maintenant, vous commencerez à payer sans rien obtenir de nouveau.',
      de: 'Du hast Premium schon gratis bis zum {date}. Wenn du jetzt kaufst, zahlst du ab sofort — und bekommst nichts Neues.',
      it: 'Hai già Premium gratis fino al {date}. Se compri ora inizi a pagare e non ottieni nulla di nuovo.',
      pt: 'Já tens Premium grátis até {date}. Se comprares agora começas a pagar e não recebes nada de novo.',
      zh: '你已经免费拥有 Premium 直到 {date}。现在购买只会开始付费，不会得到任何新东西。',
      ja: '{date} まで Premium を無料で使えます。いま購入すると支払いが始まるだけで、新しく増えるものはありません。',
      ko: '{date}까지 Premium을 무료로 이용하고 있습니다. 지금 구매하면 결제만 시작되고 새로 얻는 것은 없습니다.',
      hi: '{date} तक आपके पास Premium मुफ़्त है। अभी खरीदने पर भुगतान शुरू हो जाएगा और नया कुछ नहीं मिलेगा।',
      id: 'Kamu sudah punya Premium gratis sampai {date}. Kalau beli sekarang, kamu mulai membayar tanpa mendapat apa pun yang baru.',
      tr: '{date} tarihine kadar Premium zaten ücretsiz sende. Şimdi alırsan ödemeye başlarsın ve yeni bir şey kazanmazsın.',
      ru: 'У вас уже есть Premium бесплатно до {date}. Если купить сейчас, начнутся списания, а нового вы не получите.',
      vi: 'Bạn đã có Premium miễn phí đến {date}. Mua bây giờ chỉ khiến bạn bắt đầu trả tiền mà không nhận thêm gì mới.',
      ar: 'لديك Premium مجانًا حتى {date}. إذا اشتريت الآن ستبدأ الدفع دون أن تحصل على شيء جديد.',
    },
    'Buy anyway': {
      es: 'Comprar igualmente', ca: 'Comprar igualment', fr: 'Acheter quand même', de: 'Trotzdem kaufen',
      it: 'Compra comunque', pt: 'Comprar mesmo assim', zh: '仍要购买', ja: 'それでも購入',
      ko: '그래도 구매', hi: 'फिर भी खरीदें', id: 'Tetap beli', tr: 'Yine de satın al',
      ru: 'Всё равно купить', vi: 'Vẫn mua', ar: 'الشراء على أي حال',
    },
  };
  Object.keys(M).forEach(function (k) {
    if (!CF_UI_MAP[k]) CF_UI_MAP[k] = M[k];
    else Object.keys(M[k]).forEach(function (l) { if (!CF_UI_MAP[k][l]) CF_UI_MAP[k][l] = M[k][l]; });
  });
})();
