/* ===== Puente RevenueCat (lado web) · D5.x ============================
   window.CFPurchases — habla con el envoltorio nativo (App.js) para lanzar
   compras REALES de Apple/Google vía RevenueCat. Las compras SOLO ocurren
   en el nativo; aquí solo se pide una acción y se recibe el resultado.

   Protocolo (web → nativo, window.ReactNativeWebView.postMessage(JSON)):
     {t:'rc:ready'}                         al cargar → pide estado
     {t:'rc:refresh'}                       re-lee customerInfo/offerings
     {t:'rc:login', uid}                    asocia compras al uid de Firebase
     {t:'rc:logout'}
     {t:'rc:purchase', ref, id, productId}  compra un paquete
     {t:'rc:restore', ref}                  restaura compras previas
   Protocolo (nativo → web, window.CFPurchases._recv(payload)):
     {t:'rc:state', configured, entitlement, offerings}
     {t:'rc:purchase:ok'|'rc:purchase:err', ref, entitlement|…}
     {t:'rc:restore:ok'|'rc:restore:err', ref, entitlement|…}

   El entitlement «community» activo se traduce al registro cf_plan_v1 que
   ya lee toda la app (cfIsPremium/usePremium), con source:'revenuecat', y se
   emite 'cf-plan-updated' para que la UI reaccione igual que antes. En un
   navegador normal (sin nativo) todo queda inerte: isNative()=false y el
   paywall usa su camino de siempre. Aditivo: no toca el código de diseño. */
(function () {
  'use strict';

  var RN = window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function'
    ? window.ReactNativeWebView : null;

  /* planId (UI) ↔ paquete RC ↔ productId (tiendas). Ver docs/monetizacion.md. */
  var PLAN_MAP = {
    yearly:   { pkg: '$rc_annual',    product: 'community_annual' },
    sixmonth: { pkg: '$rc_six_month', product: 'community_semiannual' },
    monthly:  { pkg: '$rc_monthly',   product: 'community_monthly' },
    lifetime: { pkg: '$rc_lifetime',  product: 'community_lifetime' }
  };
  var PRODUCT_TO_PLAN = {};
  Object.keys(PLAN_MAP).forEach(function (k) { PRODUCT_TO_PLAN[PLAN_MAP[k].product] = k; });
  var PRICE_USD = { yearly: 49.99, sixmonth: 29.99, monthly: 7.99, lifetime: 149.99 };

  var state = { configured: false, entitlement: null, offerings: null };
  var priceByPlan = {};                 /* planId → «7,99 US$» localizado */
  var pending = {};                     /* ref → {resolve, reject} */
  var refSeq = 0;
  var changeCbs = [];
  var lastUid = null;

  function post(msg) { if (RN) { try { RN.postMessage(JSON.stringify(msg)); } catch (e) {} } }
  function nextRef() { refSeq += 1; return 'r' + refSeq; }

  /* ---- traducir el entitlement de RC al registro cf_plan_v1 de la app ---- */
  function loadPlan() { try { return JSON.parse(localStorage.getItem('cf_plan_v1') || 'null'); } catch (e) { return null; } }
  function applyEntitlement(ent) {
    try {
      if (ent && ent.active) {
        var planId = PRODUCT_TO_PLAN[ent.productId] || 'yearly';
        var lifetime = planId === 'lifetime';
        var trial = ent.periodType === 'TRIAL' || ent.periodType === 'INTRO';
        var startedTs = ent.latestPurchaseMs || Date.now();
        var trialDays = 0;
        if (trial && ent.expirationMs) trialDays = Math.max(1, Math.round((ent.expirationMs - startedTs) / 86400000));
        var rec = { plan: planId, priceUSD: PRICE_USD[planId], trial: trial, trialDays: trialDays,
          lifetime: lifetime, startedTs: startedTs, source: 'revenuecat' };
        localStorage.setItem('cf_plan_v1', JSON.stringify(rec));
      } else {
        /* sin entitlement activo: solo limpiamos lo que vino de RevenueCat
           (no tocamos un plan puesto por el onboarding u otra vía) */
        var cur = loadPlan();
        if (cur && cur.source === 'revenuecat') localStorage.removeItem('cf_plan_v1');
      }
      window.dispatchEvent(new CustomEvent('cf-plan-updated'));
    } catch (e) {}
  }

  function applyState(payload) {
    state.configured = !!payload.configured;
    if ('entitlement' in payload) state.entitlement = payload.entitlement || null;
    if (payload.offerings) {
      state.offerings = payload.offerings;
      priceByPlan = {};
      payload.offerings.forEach(function (p) {
        var plan = PRODUCT_TO_PLAN[p.productId];
        if (!plan) Object.keys(PLAN_MAP).forEach(function (k) { if (PLAN_MAP[k].pkg === p.pkgId) plan = k; });
        if (plan && p.priceString) priceByPlan[plan] = p.priceString;
      });
    }
    if ('entitlement' in payload) applyEntitlement(state.entitlement);
    changeCbs.forEach(function (f) { try { f(state); } catch (e) {} });
  }

  /* ---- recepción desde el nativo ---- */
  function _recv(payload) {
    if (!payload || typeof payload.t !== 'string') return;
    switch (payload.t) {
      case 'rc:state': applyState(payload); break;
      case 'rc:purchase:ok':
      case 'rc:restore:ok':
        if (payload.entitlement !== undefined) { state.entitlement = payload.entitlement; applyEntitlement(payload.entitlement); }
        settle(payload.ref, true, payload.entitlement || state.entitlement);
        break;
      case 'rc:purchase:err':
      case 'rc:restore:err':
        settle(payload.ref, false, payload);
        break;
    }
  }
  function settle(ref, ok, val) {
    var p = ref && pending[ref];
    if (!p) return;
    delete pending[ref];
    if (ok) p.resolve(val); else p.reject(val);
  }

  /* ---- login/logout siguiendo la sesión de Firebase ---- */
  function currentUid() {
    try { if (window.CFNS && typeof CFNS.uid === 'function') { var u = CFNS.uid(); if (u && u !== 'anon') return u; } } catch (e) {}
    try { var a = JSON.parse(localStorage.getItem('cf_auth_v1') || 'null'); if (a && a.email) return a.uid || ('pat:' + a.email); } catch (e) {}
    return null;
  }
  function syncAuth() {
    var uid = currentUid();
    if (uid === lastUid) return;
    lastUid = uid;
    if (uid) post({ t: 'rc:login', uid: uid }); else post({ t: 'rc:logout' });
  }

  /* ================= API pública ================= */
  var CFPurchases = {
    isNative: function () { return !!RN; },
    available: function () { return !!RN && state.configured; },   /* nativo + SDK con clave */
    entitlement: function () { return state.entitlement; },
    isPremium: function () { return !!(state.entitlement && state.entitlement.active); },
    priceFor: function (planId) { return priceByPlan[planId] || null; },
    offerings: function () { return state.offerings; },
    onChange: function (fn) { if (typeof fn === 'function') changeCbs.push(fn); return function () { changeCbs = changeCbs.filter(function (f) { return f !== fn; }); }; },
    refresh: function () { post({ t: 'rc:refresh' }); },

    /* Lanza la compra real. Devuelve Promise<entitlement>; rechaza con
       {userCancelled, code, message} si falla o el usuario cancela. */
    purchase: function (planId) {
      var m = PLAN_MAP[planId];
      if (!RN || !state.configured || !m) return Promise.reject({ code: 'unavailable', message: 'RevenueCat no disponible' });
      var ref = nextRef();
      return new Promise(function (resolve, reject) {
        pending[ref] = { resolve: resolve, reject: reject };
        post({ t: 'rc:purchase', ref: ref, id: m.pkg, productId: m.product });
        setTimeout(function () { settle(ref, false, { code: 'timeout', message: 'Sin respuesta' }); }, 180000);
      });
    },
    restore: function () {
      if (!RN || !state.configured) return Promise.reject({ code: 'unavailable' });
      var ref = nextRef();
      return new Promise(function (resolve, reject) {
        pending[ref] = { resolve: resolve, reject: reject };
        post({ t: 'rc:restore', ref: ref });
        setTimeout(function () { settle(ref, false, { code: 'timeout' }); }, 60000);
      });
    },
    _recv: _recv
  };
  window.CFPurchases = CFPurchases;

  /* arranque: avisar al nativo y engancharse a la sesión */
  function boot() { post({ t: 'rc:ready' }); syncAuth(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('storage', function (e) { if (e && e.key === 'cf_auth_v1') syncAuth(); });
  window.addEventListener('cf-auth-changed', syncAuth);        /* si la app emite este evento */
  document.addEventListener('visibilitychange', function () { if (!document.hidden && RN) { post({ t: 'rc:refresh' }); syncAuth(); } });
  /* poll corto al inicio: la sesión/stores pueden inicializarse tras la carga */
  var t = 0, h = setInterval(function () { syncAuth(); if (++t > 20) clearInterval(h); }, 700);
})();
