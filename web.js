/* ===== Capa WEB (solo chronicfriends.app, escritorio/navegador) ========
   Equivalente web de native.js: SOLO se sirve en el despliegue de
   chronicfriends.app (deploy-desktop.sh la inyecta al final del index).
   Aditiva: no toca el código del diseño de Claude Design.

   1. Marca window.__CF_WEB__ (la app corre como web pública).
   2. Compras: sustituye window.CFPurchases para que la web NUNCA simule
      una compra escribiendo cf_plan_v1 (eso regalaría Premium). Al pulsar
      comprar/restaurar sale el cartel «disponible en la app móvil»
      (texto aprobado por Gerhard, 2 ago 2026). El Premium real comprado
      en el móvil SÍ llega a la web vía firebase-sync (cf_plan_v1).
   3. Aviso en la pantalla de medicaciones: en el PC los recordatorios
      solo suenan con la app abierta (texto aprobado por Gerhard).
   4. Registra las traducciones de ambos carteles en CF_UI_MAP
      (16 idiomas, fusión solo-si-falta: lo existente siempre gana).
   5. Registra el service worker → PWA instalable («Instalar Chronic
      Friends» en Chrome/Edge).
   ===================================================================== */
(function () {
  'use strict';

  window.__CF_WEB__ = true;

  /* ---------- 4. traducciones de los carteles ------------------------- */
  var WEB_I18N = {
    "Premium is activated from the Chronic Friends mobile app (iPhone and Android). Purchasing from your computer isn't available yet.": {
      es: "Premium se activa desde la app móvil de Chronic Friends (iPhone y Android). La compra desde el ordenador aún no está disponible.",
      ca: "Premium s'activa des de l'app mòbil de Chronic Friends (iPhone i Android). La compra des de l'ordinador encara no està disponible.",
      fr: "Premium s'active depuis l'app mobile Chronic Friends (iPhone et Android). L'achat depuis l'ordinateur n'est pas encore disponible.",
      de: "Premium wird über die Chronic-Friends-App auf dem Handy (iPhone und Android) aktiviert. Der Kauf am Computer ist noch nicht verfügbar.",
      it: "Premium si attiva dall'app mobile di Chronic Friends (iPhone e Android). L'acquisto dal computer non è ancora disponibile.",
      pt: "O Premium é ativado na app móvel do Chronic Friends (iPhone e Android). A compra a partir do computador ainda não está disponível.",
      zh: "Premium 需在 Chronic Friends 手机应用中开通（iPhone 和 Android）。暂不支持在电脑上购买。",
      ja: "PremiumはChronic Friendsのモバイルアプリ（iPhone・Android）から有効にできます。パソコンからの購入はまだご利用いただけません。",
      ko: "Premium은 Chronic Friends 모바일 앱(iPhone 및 Android)에서 활성화할 수 있습니다. 컴퓨터에서의 구매는 아직 지원되지 않습니다.",
      hi: "Premium को Chronic Friends मोबाइल ऐप (iPhone और Android) से चालू किया जाता है। कंप्यूटर से खरीदारी अभी उपलब्ध नहीं है।",
      id: "Premium diaktifkan dari aplikasi seluler Chronic Friends (iPhone dan Android). Pembelian dari komputer belum tersedia.",
      tr: "Premium, Chronic Friends mobil uygulamasından (iPhone ve Android) etkinleştirilir. Bilgisayardan satın alma henüz mevcut değil.",
      ru: "Premium активируется в мобильном приложении Chronic Friends (iPhone и Android). Покупка с компьютера пока недоступна.",
      vi: "Premium được kích hoạt từ ứng dụng di động Chronic Friends (iPhone và Android). Hiện chưa thể mua từ máy tính.",
      ar: "يتم تفعيل Premium من تطبيق Chronic Friends على الهاتف (iPhone وAndroid). الشراء من الكمبيوتر غير متاح بعد."
    },
    "On this computer, reminders only ring while Chronic Friends is open. For alarms that always ring, use the mobile app.": {
      es: "En el ordenador, los recordatorios solo suenan mientras Chronic Friends esté abierta. Para alarmas que suenan siempre, usa la app móvil.",
      ca: "A l'ordinador, els recordatoris només sonen mentre Chronic Friends està oberta. Per a alarmes que sonen sempre, fes servir l'app mòbil.",
      fr: "Sur cet ordinateur, les rappels ne sonnent que lorsque Chronic Friends est ouverte. Pour des alarmes qui sonnent toujours, utilisez l'app mobile.",
      de: "Am Computer klingeln Erinnerungen nur, solange Chronic Friends geöffnet ist. Für Wecker, die immer klingeln, nutze die App auf dem Handy.",
      it: "Sul computer i promemoria suonano solo mentre Chronic Friends è aperta. Per sveglie che suonano sempre, usa l'app mobile.",
      pt: "No computador, os lembretes só tocam enquanto o Chronic Friends está aberto. Para alarmes que tocam sempre, usa a app móvel.",
      zh: "在电脑上，提醒仅在 Chronic Friends 打开时响起。若需随时响起的闹钟，请使用手机应用。",
      ja: "パソコンでは、リマインダーはChronic Friendsを開いている間だけ鳴ります。いつでも鳴るアラームにはモバイルアプリをご利用ください。",
      ko: "컴퓨터에서는 Chronic Friends가 열려 있는 동안에만 알림이 울립니다. 항상 울리는 알람은 모바일 앱을 이용하세요.",
      hi: "कंप्यूटर पर रिमाइंडर केवल तभी बजते हैं जब Chronic Friends खुला हो। हमेशा बजने वाले अलार्म के लिए मोबाइल ऐप इस्तेमाल करें।",
      id: "Di komputer, pengingat hanya berbunyi saat Chronic Friends terbuka. Untuk alarm yang selalu berbunyi, gunakan aplikasi seluler.",
      tr: "Bilgisayarda hatırlatıcılar yalnızca Chronic Friends açıkken çalar. Her zaman çalan alarmlar için mobil uygulamayı kullanın.",
      ru: "На компьютере напоминания звучат, только пока Chronic Friends открыт. Для будильников, которые звонят всегда, используйте мобильное приложение.",
      vi: "Trên máy tính, lời nhắc chỉ kêu khi Chronic Friends đang mở. Để báo thức luôn kêu, hãy dùng ứng dụng di động.",
      ar: "على الكمبيوتر، تصدر التذكيرات صوتًا فقط أثناء فتح Chronic Friends. للمنبهات التي ترن دائمًا، استخدم تطبيق الهاتف."
    },
    "Got it": {
      es: "Entendido", ca: "Entesos", fr: "Compris", de: "Verstanden",
      it: "Capito", pt: "Entendido", zh: "知道了", ja: "わかりました",
      ko: "알겠어요", hi: "ठीक है", id: "Mengerti", tr: "Anladım",
      ru: "Понятно", vi: "Đã hiểu", ar: "فهمت"
    },
    "Fill in your Journal carefully once. From then on, the blue button copies yesterday's entry into today with a single click. You'll also find it when you confirm your daily medication from its alarm or notification — one click there logs your day too. And if your routine follows the app's advice, every click means something bigger: you've built another good day. Building good days — that's Chronic Friends.": {
      es: "Rellena bien tu Journal una sola vez. Desde entonces, el botón azul copia el registro de ayer en el día de hoy con un solo clic. También lo encontrarás al confirmar tu medicación diaria desde su alarma o notificación — un clic ahí también registra tu día. Y si tu rutina sigue los consejos de la app, cada clic significa algo más grande: has construido otro buen día. Building good days — eso es Chronic Friends.",
      ca: "Omple bé el teu Journal una sola vegada. Des de llavors, el botó blau copia el registre d'ahir al dia d'avui amb un sol clic. També el trobaràs en confirmar la teva medicació diària des de la seva alarma o notificació — un clic allà també registra el teu dia. I si la teva rutina segueix els consells de l'app, cada clic significa una cosa més gran: has construït un altre bon dia. Building good days — això és Chronic Friends.",
      fr: "Remplissez bien votre Journal une seule fois. Ensuite, le bouton bleu copie l'entrée d'hier dans la journée d'aujourd'hui en un seul clic. Vous le retrouverez aussi en confirmant votre médication quotidienne depuis son alarme ou sa notification — un clic là aussi enregistre votre journée. Et si votre routine suit les conseils de l'app, chaque clic veut dire quelque chose de plus grand : vous avez construit un autre bon jour. Building good days — c'est ça, Chronic Friends.",
      de: "Fülle dein Journal einmal sorgfältig aus. Danach kopiert der blaue Button den gestrigen Eintrag mit einem Klick in den heutigen Tag. Du findest ihn auch, wenn du deine tägliche Medikation über ihren Wecker oder ihre Benachrichtigung bestätigst — auch dort trägt ein Klick deinen Tag ein. Und wenn deine Routine den Empfehlungen der App folgt, bedeutet jeder Klick etwas Größeres: Du hast wieder einen guten Tag gebaut. Building good days — das ist Chronic Friends.",
      it: "Compila bene il tuo Journal una sola volta. Da lì in poi, il pulsante blu copia la registrazione di ieri nel giorno di oggi con un solo clic. Lo troverai anche quando confermi la tua terapia quotidiana dalla sua sveglia o notifica — anche lì un clic registra la tua giornata. E se la tua routine segue i consigli dell'app, ogni clic significa qualcosa di più grande: hai costruito un altro buon giorno. Building good days — questo è Chronic Friends.",
      pt: "Preenche bem o teu Journal uma só vez. A partir daí, o botão azul copia o registo de ontem para o dia de hoje com um único clique. Também o vais encontrar ao confirmar a tua medicação diária a partir do alarme ou da notificação — um clique aí também regista o teu dia. E se a tua rotina segue os conselhos da app, cada clique significa algo maior: construíste mais um bom dia. Building good days — isso é o Chronic Friends.",
      zh: "认真填写一次日记（Journal）。之后，蓝色按钮只需一键就能把昨天的记录复制到今天。当你通过每日用药的闹钟或通知确认服药时，也会看到这个蓝色按钮——在那里点一下，同样能记录你的一天。如果你的日常按照应用的建议来安排，每一次点击都意味着更重要的事：你又建成了美好的一天。Building good days —— 这就是 Chronic Friends。",
      ja: "Journalを一度だけていねいに記入しましょう。その後は、青いボタンをワンクリックするだけで昨日の記録が今日にコピーされます。毎日のお薬をアラームや通知から確認するときにも、この青いボタンが表示され、そこでのワンクリックでもその日を記録できます。アプリのアドバイスに沿った習慣を続ければ、そのワンクリックはもっと大きな意味を持ちます。また一つ、良い一日を築けたということ。Building good days — それがChronic Friendsです。",
      ko: "Journal을 한 번만 정성껏 작성하세요. 그다음부터는 파란 버튼 한 번의 클릭으로 어제의 기록이 오늘로 복사됩니다. 매일 복용하는 약을 알람이나 알림에서 확인할 때도 이 파란 버튼이 나타나며, 거기서의 클릭 한 번으로도 하루가 기록됩니다. 앱의 조언에 맞춰 루틴을 만들어 가면, 클릭 한 번은 더 큰 의미가 됩니다. 또 하나의 좋은 하루를 만들어냈다는 뜻이니까요. Building good days — 그것이 Chronic Friends입니다.",
      hi: "अपना Journal एक बार अच्छी तरह भरें। उसके बाद, नीला बटन एक क्लिक में कल की एंट्री आज में कॉपी कर देता है। जब आप अपनी रोज़ की दवा उसके अलार्म या नोटिफ़िकेशन से कन्फ़र्म करते हैं, तब भी यह नीला बटन दिखता है — वहाँ एक क्लिक से भी आपका दिन दर्ज हो जाता है। और अगर आपकी दिनचर्या ऐप की सलाह के अनुसार है, तो हर क्लिक का मतलब कुछ बड़ा है: आपने एक और अच्छा दिन बनाया है। Building good days — यही है Chronic Friends।",
      id: "Isi Journal-mu dengan baik satu kali saja. Setelah itu, tombol biru menyalin catatan kemarin ke hari ini dengan sekali klik. Kamu juga akan menemukannya saat mengonfirmasi obat harianmu dari alarm atau notifikasinya — sekali klik di sana juga mencatat harimu. Dan jika rutinitasmu mengikuti saran aplikasi, setiap klik berarti sesuatu yang lebih besar: kamu telah membangun satu hari baik lagi. Building good days — itulah Chronic Friends.",
      tr: "Journal'ını bir kez özenle doldur. Sonrasında mavi buton, dünün kaydını tek tıkla bugüne kopyalar. Günlük ilacını alarmından veya bildiriminden onaylarken de bu mavi butonu görürsün — oradaki tek tık da gününü kaydeder. Rutinin uygulamanın önerilerine uyuyorsa her tık daha büyük bir anlam taşır: bir iyi gün daha inşa ettin. Building good days — Chronic Friends budur.",
      ru: "Заполните свой Journal внимательно один раз. Дальше синяя кнопка одним кликом копирует вчерашнюю запись в сегодняшний день. Вы также увидите её, подтверждая ежедневный приём лекарства из будильника или уведомления — один клик там тоже записывает ваш день. И если ваш распорядок следует советам приложения, каждый клик значит нечто большее: вы построили ещё один хороший день. Building good days — в этом весь Chronic Friends.",
      vi: "Hãy điền Journal của bạn thật kỹ một lần. Từ đó, nút màu xanh sẽ sao chép bản ghi hôm qua sang hôm nay chỉ với một cú nhấp. Bạn cũng sẽ thấy nút này khi xác nhận thuốc hằng ngày từ báo thức hoặc thông báo — một cú nhấp ở đó cũng ghi lại ngày của bạn. Và nếu thói quen của bạn theo lời khuyên của ứng dụng, mỗi cú nhấp mang một ý nghĩa lớn hơn: bạn đã xây thêm một ngày tốt lành. Building good days — đó chính là Chronic Friends.",
      ar: "املأ يومياتك (Journal) بعناية مرة واحدة. بعد ذلك، ينسخ الزر الأزرق تسجيل الأمس إلى اليوم بنقرة واحدة. ستجده أيضًا عند تأكيد دوائك اليومي من منبهه أو إشعاره — نقرة واحدة هناك تسجّل يومك أيضًا. وإذا كان روتينك يتبع نصائح التطبيق، فكل نقرة تعني شيئًا أكبر: لقد بنيت يومًا جيدًا آخر. Building good days — هذه هي Chronic Friends."
    },
    "Continue with the free plan": {
      es: "Continuar con el plan gratis", ca: "Continua amb el pla gratuït",
      fr: "Continuer avec l'offre gratuite", de: "Mit dem Gratis-Plan fortfahren",
      it: "Continua con il piano gratuito", pt: "Continuar com o plano grátis",
      zh: "继续使用免费版", ja: "無料プランで続ける", ko: "무료 플랜으로 계속하기",
      hi: "मुफ़्त प्लान के साथ जारी रखें", id: "Lanjutkan dengan paket gratis",
      tr: "Ücretsiz planla devam et", ru: "Продолжить с бесплатным планом",
      vi: "Tiếp tục với gói miễn phí", ar: "المتابعة بالخطة المجانية"
    }
  };

  function mergeI18n() {
    if (typeof window.CF_UI_MAP === 'undefined') return false;
    Object.keys(WEB_I18N).forEach(function (k) {
      if (!CF_UI_MAP[k]) CF_UI_MAP[k] = {};
      Object.keys(WEB_I18N[k]).forEach(function (lang) {
        if (!CF_UI_MAP[k][lang]) CF_UI_MAP[k][lang] = WEB_I18N[k][lang];
      });
    });
    return true;
  }
  if (!mergeI18n()) document.addEventListener('DOMContentLoaded', mergeI18n);

  /* traducir un cartel en el momento de mostrarlo (idioma actual) */
  function wtr(key) {
    try { if (typeof window.tr === 'function') { var v = window.tr(key); if (v) return v; } } catch (e) {}
    var lang = 'en';
    try { lang = localStorage.getItem('cf_lang') || 'en'; } catch (e2) {}
    var m = WEB_I18N[key];
    return (m && m[lang]) || key;
  }

  var PREMIUM_MSG = "Premium is activated from the Chronic Friends mobile app (iPhone and Android). Purchasing from your computer isn't available yet.";
  var ALARM_MSG = "On this computer, reminders only ring while Chronic Friends is open. For alarms that always ring, use the mobile app.";

  /* ---------- 2. cartel de Premium + bloqueo de compra simulada -------- */
  function showPremiumNotice() {
    if (document.getElementById('cf-web-premium-notice')) return;
    var wrap = document.createElement('div');
    wrap.id = 'cf-web-premium-notice';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);padding:24px;';
    var card = document.createElement('div');
    card.style.cssText = 'max-width:420px;width:100%;background:#1a241b;color:#eaf6e6;border:1px solid rgba(214,245,205,.18);border-radius:18px;padding:26px 24px;box-shadow:0 18px 50px rgba(0,0,0,.5);text-align:center;font-family:inherit;';
    var icon = document.createElement('div');
    icon.textContent = '📱';
    icon.style.cssText = 'font-size:34px;margin-bottom:10px;';
    var body = document.createElement('div');
    body.textContent = wtr(PREMIUM_MSG);
    body.style.cssText = 'font-size:14.5px;line-height:1.55;opacity:.95;';
    var close = function () { try { wrap.remove(); } catch (e) { wrap.parentNode && wrap.parentNode.removeChild(wrap); } };
    card.appendChild(icon); card.appendChild(body);
    /* Durante el ONBOARDING el paso de planes no tiene otra salida en web
       (la única puerta era comprar) → botón para seguir con el plan gratis.
       Bug encontrado por Gerhard en la prueba real (2 ago noche). */
    var inOnboarding = false;
    try { inOnboarding = localStorage.getItem('cf_onboarded_v1') !== '1' && !!(window.CFAuth && CFAuth.setOnboarded); } catch (e) {}
    if (inOnboarding) {
      var freeBtn = document.createElement('button');
      freeBtn.textContent = wtr('Continue with the free plan');
      freeBtn.style.cssText = 'display:block;margin:18px auto 0;padding:12px 26px;border:0;border-radius:999px;background:#3f9142;color:#fff;font-size:14px;font-weight:700;cursor:pointer;';
      freeBtn.onclick = function () { close(); try { CFAuth.setOnboarded(true); } catch (e) {} };
      card.appendChild(freeBtn);
    }
    var btn = document.createElement('button');
    btn.textContent = wtr('Got it');
    btn.style.cssText = inOnboarding
      ? 'display:block;margin:10px auto 0;padding:9px 22px;border:1px solid rgba(214,245,205,.35);border-radius:999px;background:transparent;color:#d6f5cd;font-size:13px;font-weight:600;cursor:pointer;'
      : 'margin-top:18px;padding:11px 26px;border:0;border-radius:999px;background:#3f9142;color:#fff;font-size:14px;font-weight:700;cursor:pointer;';
    btn.onclick = close;
    card.appendChild(btn);
    wrap.appendChild(card);
    wrap.addEventListener('click', function (ev) { if (ev.target === wrap) btn.onclick(); });
    document.body.appendChild(wrap);
  }

  /* Sustituye la API de compras del móvil. available() DEBE ser true:
     con false, onboarding.js y foodscan.js caen en su camino simulado
     y escriben cf_plan_v1 (Premium gratis). Con true, llaman a
     purchase(), que aquí enseña el cartel y rechaza como cancelación
     de usuario (D5.8: las cancelaciones son silenciosas, sin toast). */
  window.CFPurchases = {
    isNative: function () { return false; },
    available: function () { return true; },
    entitlement: function () { return null; },
    isPremium: function () { return false; },
    priceFor: function () { return null; },
    offerings: function () { return null; },
    onChange: function () { return function () {}; },
    refresh: function () {},
    purchase: function () { showPremiumNotice(); return Promise.reject({ userCancelled: true, code: 'web', message: 'Purchases are mobile-only' }); },
    restore: function () { showPremiumNotice(); return Promise.reject({ userCancelled: true, code: 'web', message: 'Purchases are mobile-only' }); },
    _recv: function () {}
  };

  /* ---------- 3. aviso de alarmas en la pantalla de medicaciones ------- */
  /* MedsScreen (build/meds.js) pinta un .eyebrow con tr('My medications').
     Cuando aparece, se le antepone una banda con el aviso. Idempotente:
     marca cf-web-alarm-note; sobrevive a re-renders vía MutationObserver. */
  function injectAlarmNote() {
    var eyebrows = document.querySelectorAll('.eyebrow');
    for (var i = 0; i < eyebrows.length; i++) {
      var el = eyebrows[i];
      var label = '';
      try { label = (typeof window.tr === 'function' ? window.tr('My medications') : 'My medications'); } catch (e) { label = 'My medications'; }
      if ((el.textContent || '').trim() !== String(label).trim()) continue;
      var host = el.parentNode;
      if (!host || !host.parentNode) continue;
      if (document.querySelector('.cf-web-alarm-note')) continue;
      var note = document.createElement('div');
      note.className = 'cf-web-alarm-note';
      note.textContent = '💻 ' + wtr(ALARM_MSG);
      /* banda de ancho completo ANTES de la sección (la pantalla de
         medicaciones tiene fondo claro: texto verde oscuro legible) */
      note.style.cssText = 'display:block;width:100%;box-sizing:border-box;margin:0 0 12px;padding:10px 14px;border-radius:12px;background:rgba(63,145,66,.12);border:1px solid rgba(63,145,66,.35);color:#1d4d20;font-size:13px;line-height:1.5;';
      host.parentNode.insertBefore(note, host);
    }
  }
  /* ---------- rebrand: frase de donación del onboarding ---------------- */
  /* El onboarding aún enseña la frase con solo «Crohn y colitis»; la frase
     paraguas («fighting chronic diseases») ya viaja TRADUCIDA en el paquete
     → intercambio en caliente hasta que CD lo arregle en origen (detectado
     por Gerhard el 2 ago probando la webapp). Idempotente: si la frase
     vieja no está, no toca nada. */
  var OLD_DONATE = "Chronic Friends donates part of every subscription to research centres and hospitals fighting Crohn's disease and ulcerative colitis.";
  var NEW_DONATE = "Part of every subscription is donated to research centres and hospitals fighting chronic diseases.";
  function fixDonationCopy() {
    if (typeof window.tr !== 'function') return;
    var oldTxt, newTxt;
    try { oldTxt = tr(OLD_DONATE); newTxt = tr(NEW_DONATE); } catch (e) { return; }
    if (!oldTxt || !newTxt || oldTxt === newTxt) return;
    var els = document.querySelectorAll('div,p,span');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.childElementCount === 0 && (el.textContent || '').trim() === oldTxt.trim()) el.textContent = newTxt;
    }
  }
  /* ---------- UX20 (versión web): explicar el botón azul de rutina ----- */
  /* Idea de Gerhard (2 ago): el Journal se rellena bien UNA vez; después el
     botón azul lo copia con un clic, y si la rutina sigue los consejos de
     la app, cada clic = otro buen día construido (Building good days).
     La tarjeta sale UNA sola vez, la primera vez que el usuario tiene el
     banner azul delante. La versión definitiva irá en el onboarding de CD. */
  var ROUTINE_TIP_KEY = 'cf_web_routine_tip_v1';
  var ROUTINE_BODY = "Fill in your Journal carefully once. From then on, the blue button copies yesterday's entry into today with a single click. You'll also find it when you confirm your daily medication from its alarm or notification — one click there logs your day too. And if your routine follows the app's advice, every click means something bigger: you've built another good day. Building good days — that's Chronic Friends.";
  function maybeShowRoutineTip() {
    try { if (localStorage.getItem(ROUTINE_TIP_KEY) === '1') return; } catch (e) { return; }
    if (document.getElementById('cf-web-routine-tip') || typeof window.tr !== 'function') return;
    var t = tr('Same routine as yesterday?');
    if (!t) return;
    /* Dispara en CUALQUIERA de los dos momentos (el freno es el mismo):
       a) nada más entrar en la app con el onboarding terminado — así forma
          parte del onboarding, que es donde Gerhard la quiere (su cuenta
          nueva no vio la tarjeta porque el banner azul aún no existía);
       b) primera vez que el banner azul aparece en el Journal (respaldo). */
    var onboarded = false, logged = false;
    try { onboarded = localStorage.getItem('cf_onboarded_v1') === '1'; } catch (e) {}
    try { logged = !!(window.CFAuth && CFAuth.data && CFAuth.data.email); } catch (e) {}
    var found = false;
    if (!(onboarded && logged)) {
      var els = document.querySelectorAll('div,span,p');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el.childElementCount === 0 && (el.textContent || '').indexOf(t) === 0 && el.getBoundingClientRect().height > 0) { found = true; break; }
      }
      if (!found) return;
    }
    var wrap = document.createElement('div');
    wrap.id = 'cf-web-routine-tip';
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99998;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);padding:24px;';
    var card = document.createElement('div');
    card.style.cssText = 'max-width:440px;width:100%;background:#1a241b;color:#eaf6e6;border:1px solid rgba(214,245,205,.18);border-radius:18px;padding:26px 24px;box-shadow:0 18px 50px rgba(0,0,0,.5);text-align:center;font-family:inherit;';
    var icon = document.createElement('div');
    icon.textContent = '✨';
    icon.style.cssText = 'font-size:34px;margin-bottom:10px;';
    var title = document.createElement('div');
    title.textContent = tr('Same routine as yesterday?');
    title.style.cssText = 'font-size:16px;font-weight:800;margin-bottom:8px;';
    var body = document.createElement('div');
    body.textContent = wtr(ROUTINE_BODY);
    body.style.cssText = 'font-size:14px;line-height:1.6;opacity:.95;';
    var btn = document.createElement('button');
    btn.textContent = wtr('Got it');
    btn.style.cssText = 'margin-top:18px;padding:11px 26px;border:0;border-radius:999px;background:#3f9142;color:#fff;font-size:14px;font-weight:700;cursor:pointer;';
    var done = function () {
      try { localStorage.setItem(ROUTINE_TIP_KEY, '1'); } catch (e) {}
      try { wrap.remove(); } catch (e) { wrap.parentNode && wrap.parentNode.removeChild(wrap); }
    };
    btn.onclick = done;
    card.appendChild(icon); card.appendChild(title); card.appendChild(body); card.appendChild(btn);
    wrap.appendChild(card);
    wrap.addEventListener('click', function (ev) { if (ev.target === wrap) done(); });
    document.body.appendChild(wrap);
  }
  try {
    new MutationObserver(function () {
      try { injectAlarmNote(); } catch (e) {}
      try { fixDonationCopy(); } catch (e) {}
      try { maybeShowRoutineTip(); } catch (e) {}
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  /* ---------- 5. service worker (PWA instalable) ----------------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
})();
