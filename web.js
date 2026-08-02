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
    var btn = document.createElement('button');
    btn.textContent = wtr('Got it');
    btn.style.cssText = 'margin-top:18px;padding:11px 26px;border:0;border-radius:999px;background:#3f9142;color:#fff;font-size:14px;font-weight:700;cursor:pointer;';
    btn.onclick = function () { try { wrap.remove(); } catch (e) { wrap.parentNode && wrap.parentNode.removeChild(wrap); } };
    card.appendChild(icon); card.appendChild(body); card.appendChild(btn);
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
  try {
    new MutationObserver(function () {
      try { injectAlarmNote(); } catch (e) {}
    }).observe(document.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  /* ---------- 5. service worker (PWA instalable) ----------------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }
})();
