/* ============================================================================
   FoodScan REAL — motor de escaneo por código de barras (decisión 0.7, 11 jul 2026)
   Cámara ya integrada en el flujo (foodscanflow.js) → este módulo aporta:
     1. Lectura del código de barras del frame capturado (ZXing, vendor/zxing.min.js)
     2. Consulta a Open Food Facts (única fuente de verdad; NUNCA datos inventados)
     3. Construcción del item con el MISMO esquema que la review existente
     4. Aviso NEUTRO de lo que contiene el producto (lactosa, gluten, picante, ultraprocesado,
        aditivos problemáticos) + caché offline de productos ya escaneados
   Se engancha vía window.CF_FS_RECOGNIZE (parche en foodscanflow.js). Si este
   archivo no carga, el flujo cae automáticamente en la simulación original.
   Vive en vendor/ → sobrevive a las actualizaciones desde Claude Design
   (re-inyectado por actualizar-desde-design.sh).
   ========================================================================== */
(function () {
  'use strict';

  var OFF_URL = 'https://world.openfoodfacts.org/api/v2/product/';
  var OFF_FIELDS = 'product_name,brands,ingredients_text,allergens_tags,additives_tags,nova_group,nutriments';
  var CACHE_KEY = 'cf_off_cache_v1';
  var CACHE_DAYS = 30;

  /* ---------- textos del módulo, en los 16 idiomas de la app (fallback en) ----------
     M24 (auditoría del 5 nov 2026): el aviso decía «⚠️ Possible IBD irritants» a TODO el mundo
     (también a quien tiene migraña) y sin fuente: una afirmación médica que Apple (norma 1.4.1)
     puede leer como consejo de salud. Ahora es un DATO NEUTRO de la composición del producto
     («Contiene: …»), con su fuente (Open Food Facts) y la invitación a apuntarlo en el diario. */
  var TXT = {
    contains: { en: 'Contains', es: 'Contiene', ca: 'Conté', fr: 'Contient', de: 'Enthält', it: 'Contiene',
                pt: 'Contém', ja: '含まれるもの', zh: '含有', ko: '포함 성분', hi: 'इसमें शामिल है',
                id: 'Mengandung', tr: 'İçerir', ru: 'Содержит', vi: 'Có chứa', ar: 'يحتوي على' },
    source:   { en: 'Product data: Open Food Facts', es: 'Datos del producto: Open Food Facts',
                ca: 'Dades del producte: Open Food Facts', fr: 'Données du produit : Open Food Facts',
                de: 'Produktdaten: Open Food Facts', it: 'Dati del prodotto: Open Food Facts',
                pt: 'Dados do produto: Open Food Facts', ja: '製品データ：Open Food Facts',
                zh: '产品数据：Open Food Facts', ko: '제품 정보: Open Food Facts',
                hi: 'उत्पाद का डेटा: Open Food Facts', id: 'Data produk: Open Food Facts',
                tr: 'Ürün verisi: Open Food Facts', ru: 'Данные о продукте: Open Food Facts',
                vi: 'Dữ liệu sản phẩm: Open Food Facts', ar: 'بيانات المنتج: Open Food Facts' },
    lactose:  { en: 'lactose / dairy', es: 'lactosa / lácteos', ca: 'lactosa / làctics', fr: 'lactose / produits laitiers',
                de: 'Laktose / Milchprodukte', it: 'lattosio / latticini', pt: 'lactose / lacticínios', ja: '乳糖・乳製品',
                zh: '乳糖 / 乳制品', ko: '유당 / 유제품', hi: 'लैक्टोज़ / दूध से बने पदार्थ', id: 'laktosa / produk susu',
                tr: 'laktoz / süt ürünleri', ru: 'лактоза / молочные продукты', vi: 'lactose / sản phẩm từ sữa', ar: 'اللاكتوز / مشتقات الحليب' },
    gluten:   { en: 'gluten', es: 'gluten', ca: 'gluten', fr: 'gluten', de: 'Gluten', it: 'glutine', pt: 'glúten',
                ja: 'グルテン', zh: '麸质', ko: '글루텐', hi: 'ग्लूटेन', id: 'gluten', tr: 'gluten', ru: 'глютен',
                vi: 'gluten', ar: 'الغلوتين' },
    spicy:    { en: 'spicy ingredients', es: 'ingredientes picantes', ca: 'ingredients picants', fr: 'ingrédients pimentés',
                de: 'scharfe Zutaten', it: 'ingredienti piccanti', pt: 'ingredientes picantes', ja: '辛い材料',
                zh: '辛辣配料', ko: '매운 재료', hi: 'तीखी सामग्री', id: 'bahan pedas', tr: 'acı malzemeler',
                ru: 'острые ингредиенты', vi: 'thành phần cay', ar: 'مكونات حارة' },
    ultra:    { en: 'ultra-processed (NOVA 4)', es: 'ultraprocesado (NOVA 4)', ca: 'ultraprocessat (NOVA 4)',
                fr: 'ultra-transformé (NOVA 4)', de: 'hochverarbeitet (NOVA 4)', it: 'ultra-processato (NOVA 4)',
                pt: 'ultraprocessado (NOVA 4)', ja: '超加工食品（NOVA 4）', zh: '超加工食品（NOVA 4）',
                ko: '초가공식품 (NOVA 4)', hi: 'अति-प्रसंस्कृत (NOVA 4)', id: 'ultra-proses (NOVA 4)',
                tr: 'ultra işlenmiş (NOVA 4)', ru: 'ультраобработанный (NOVA 4)', vi: 'siêu chế biến (NOVA 4)',
                ar: 'فائق المعالجة (NOVA 4)' },
    additives:{ en: 'additives', es: 'aditivos', ca: 'additius', fr: 'additifs', de: 'Zusatzstoffe', it: 'additivi',
                pt: 'aditivos', ja: '添加物', zh: '添加剂', ko: '첨가물', hi: 'योजक', id: 'bahan tambahan',
                tr: 'katkı maddeleri', ru: 'пищевые добавки', vi: 'phụ gia', ar: 'مواد مضافة' },
    checkNote:{ en: 'Log how you feel after eating it — your journal will spot patterns.',
                es: 'Anota cómo te sientes después de comerlo: tu diario detectará patrones.',
                ca: 'Apunta com et sents després de menjar-ho: el teu diari detectarà patrons.',
                fr: "Notez comment vous vous sentez après l'avoir mangé : votre journal repérera des tendances.",
                de: 'Notiere, wie es dir nach dem Essen geht – dein Tagebuch erkennt Muster.',
                it: 'Annota come ti senti dopo averlo mangiato: il diario individuerà gli schemi.',
                pt: 'Regista como te sentes depois de o comeres: o teu diário vai encontrar padrões.',
                ja: '食べたあとの体調を記録しましょう。日記がパターンを見つけます。',
                zh: '记录吃完后的感受，你的日记会发现规律。',
                ko: '먹은 뒤 몸 상태를 기록하세요. 일기가 패턴을 찾아 줍니다.',
                hi: 'इसे खाने के बाद आप कैसा महसूस करते हैं, यह दर्ज करें — आपकी डायरी पैटर्न पहचान लेगी।',
                id: 'Catat bagaimana perasaanmu setelah memakannya — jurnalmu akan menemukan polanya.',
                tr: 'Yedikten sonra kendini nasıl hissettiğini kaydet; günlüğün örüntüleri fark edecek.',
                ru: 'Отметьте, как вы себя чувствуете после еды, — дневник поможет заметить закономерности.',
                vi: 'Ghi lại cảm giác của bạn sau khi ăn — nhật ký sẽ giúp nhận ra các quy luật.',
                ar: 'سجّل شعورك بعد تناوله، وستكتشف يومياتك الأنماط.' },
  };
  function t(k) {
    var lang = (window.I18n && window.I18n.lang) || 'en';
    return (TXT[k] && (TXT[k][lang] || TXT[k].en)) || k;
  }

  /* ---------- lector de barcode (ZXing multi-intento sobre la foto) ----------
     Las fotos reales de móvil (4032px, ángulo, brillos) no se leen a la primera:
     probamos varias escalas, recortes, rotaciones y 2 binarizadores con
     TRY_HARDER hasta dar con el código. Primer acierto gana. */
  function _decodeCanvas(canvas) {
    var Z = window.ZXing;
    var hints = new Map();
    hints.set(Z.DecodeHintType.TRY_HARDER, true);
    hints.set(Z.DecodeHintType.POSSIBLE_FORMATS, [
      Z.BarcodeFormat.EAN_13, Z.BarcodeFormat.EAN_8,
      Z.BarcodeFormat.UPC_A, Z.BarcodeFormat.UPC_E, Z.BarcodeFormat.CODE_128,
    ]);
    var reader = new Z.MultiFormatReader();
    reader.setHints(hints);
    var lum = new Z.HTMLCanvasElementLuminanceSource(canvas);
    var bins = [Z.HybridBinarizer, Z.GlobalHistogramBinarizer];
    for (var i = 0; i < bins.length; i++) {
      try {
        var res = reader.decode(new Z.BinaryBitmap(new bins[i](lum)));
        if (res && res.getText) {
          var txt = res.getText();
          if (/^\d{8,14}$/.test(txt)) return txt;   // GTIN plausible
        }
      } catch (e) { /* siguiente intento */ }
      try { reader.reset(); } catch (e2) {}
    }
    return null;
  }

  function _variant(img, opts) {
    // opts: {w: ancho destino, crop: fracción central (0-1), rot: 0|90}
    var sw = img.naturalWidth || img.width, sh = img.naturalHeight || img.height;
    var cx = 0, cy = 0, cw = sw, ch = sh;
    if (opts.crop && opts.crop < 1) {
      cw = Math.round(sw * opts.crop); ch = Math.round(sh * opts.crop);
      cx = Math.round((sw - cw) / 2); cy = Math.round((sh - ch) / 2);
    }
    var scale = Math.min(1, opts.w / cw);
    var w = Math.max(1, Math.round(cw * scale)), h = Math.max(1, Math.round(ch * scale));
    var c = document.createElement('canvas');
    if (opts.rot === 90) {
      c.width = h; c.height = w;
      var x = c.getContext('2d');
      x.translate(h / 2, w / 2); x.rotate(Math.PI / 2);
      x.drawImage(img, cx, cy, cw, ch, -w / 2, -h / 2, w, h);
    } else {
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, cx, cy, cw, ch, 0, 0, w, h);
    }
    return c;
  }

  var VARIANTS = [
    { w: 1600, crop: 1 },          // foto completa, tamaño manejable
    { w: 1600, crop: 0.72 },       // recorte central (el código suele ir centrado)
    { w: 1000, crop: 1 },          // más pequeña (suaviza ruido/desenfoque)
    { w: 1600, crop: 1, rot: 90 }, // código en vertical
    { w: 2200, crop: 0.6 },        // zoom al centro en alta resolución
    { w: 1600, crop: 0.72, rot: 90 },
  ];

  function decodeBarcode(dataUrl) {
    return new Promise(function (resolve) {
      if (!dataUrl || !window.ZXing || !window.ZXing.MultiFormatReader) return resolve(null);
      var img = new Image();
      img.onload = function () {
        // intentos secuenciales con cesión de hilo (no congelar la UI)
        var i = 0;
        (function next() {
          if (i >= VARIANTS.length) return resolve(null);
          var v = VARIANTS[i++];
          var code = null;
          try { code = _decodeCanvas(_variant(img, v)); } catch (e) {}
          if (code) return resolve(code);
          setTimeout(next, 0);
        })();
      };
      img.onerror = function () { resolve(null); };
      img.src = dataUrl;
    });
  }

  /* ---------- caché local de productos (repetir escaneo sin conexión) ---------- */
  function cacheGet(code) {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      var hit = c[code];
      if (hit && (Date.now() - hit.ts) < CACHE_DAYS * 864e5) return hit.p;
    } catch (e) {}
    return null;
  }
  function cachePut(code, product) {
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      c[code] = { ts: Date.now(), p: product };
      var keys = Object.keys(c);
      if (keys.length > 120) {           // limpieza: fuera los más viejos
        keys.sort(function (a, b) { return c[a].ts - c[b].ts; })
            .slice(0, keys.length - 120).forEach(function (k) { delete c[k]; });
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(c));
    } catch (e) {}
  }

  /* ---------- lo que CONTIENE el producto según Open Food Facts (dato, no consejo; M24) ---------- */
  var BAD_ADDITIVES = ['en:e407', 'en:e433', 'en:e466', 'en:e420', 'en:e421',
                       'en:e965', 'en:e966', 'en:e967', 'en:e968'];  // carragenanos, emulsionantes, polioles
  function detectIrritants(p) {
    var out = [];
    var alg = p.allergens_tags || [];
    var ing = (p.ingredients_text || '').toLowerCase();
    if (alg.indexOf('en:milk') >= 0 || /lactos|milk|latte|leche/.test(ing)) out.push(t('lactose'));
    if (alg.indexOf('en:gluten') >= 0 || /gluten|wheat|trigo|frumento/.test(ing)) out.push(t('gluten'));
    if (/chil[il]|cayenne|jalape|piment|picante|piccante|spicy|harissa/.test(ing)) out.push(t('spicy'));
    if (p.nova_group === 4) out.push(t('ultra'));
    var adds = (p.additives_tags || []).filter(function (a) { return BAD_ADDITIVES.indexOf(a) >= 0; });
    if (adds.length) out.push(t('additives') + ' (' + adds.map(function (a) { return a.replace('en:', '').toUpperCase(); }).join(', ') + ')');
    return out;
  }

  /* ---------- aviso «Contiene: …» (overlay propio, se cierra solo; neutro desde M24) ---------- */
  function showIrritantBanner(irritants, productName) {
    try {
      var old = document.getElementById('cf-irr-banner');
      if (old) old.remove();
      var d = document.createElement('div');
      d.id = 'cf-irr-banner';
      d.style.cssText = 'position:fixed;left:12px;right:12px;bottom:88px;z-index:99999;' +
        'background:#3d2f14;color:#ffe9b8;border:1px solid #b98c3a;border-radius:16px;' +
        'padding:12px 16px;font:13px/1.45 Poppins,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.45)';
      var esc = function (x) { return String(x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
      d.innerHTML = '<b style="display:block;margin-bottom:2px">' + esc(t('contains')) + '</b>' +
        '<span>' + irritants.map(esc).join(' · ') + '</span>' +
        '<span style="display:block;opacity:.8;margin-top:4px;font-size:12px">' + esc(t('checkNote')) + '</span>' +
        '<span style="display:block;opacity:.65;margin-top:4px;font-size:11px">' + esc(t('source')) + '</span>';
      d.onclick = function () { d.remove(); };
      document.body.appendChild(d);
      setTimeout(function () { if (d.parentNode) d.remove(); }, 9000);
    } catch (e) {}
  }

  /* ---------- números desde OFF (por 100 g; si falta un dato, null — nunca inventar) ---------- */
  function n100(n, k) {
    var v = n[k + '_100g'];
    if (typeof v !== 'number') v = n[k];
    return (typeof v === 'number') ? Math.round(v * 10) / 10 : 0;
  }

  function itemFromProduct(code, p) {
    var name = (p.product_name || 'Product ' + code) +
               (p.brands ? ' — ' + String(p.brands).split(',')[0].trim() : '');
    var n = p.nutriments || {};
    var kcal = n100(n, 'energy-kcal');
    return {
      id: null, name: name, unit: '100 g',
      kcal: kcal ? Math.round(kcal) : null,
      p: n100(n, 'proteins'), c: n100(n, 'carbohydrates'),
      f: n100(n, 'fat'), fb: n100(n, 'fiber'),
      qty: 1, conf: 'high', key: 'off-' + code + '-' + Date.now(),
    };
  }

  /* ---------- pre-decodificación continua (11 jul 2026) ----------
     Un escáner profesional no depende del frame único del disparo (que puede
     salir movido): mientras la cámara en vivo está abierta, se intenta leer el
     código cada ~500ms en segundo plano. Al pulsar el botón, si hay un acierto
     fresco (<5s) se usa al instante. Consumo de un solo uso (no arrastra el
     código de un producto anterior). */
  var _pre = { code: null, ts: 0 };
  var _preBusy = false;
  setInterval(function () {
    try {
      if (_preBusy || document.hidden || !window.ZXing || !window.ZXing.MultiFormatReader) return;
      if (_pre.code && (Date.now() - _pre.ts) < 1200) return; // acierto fresco: no gastar CPU
      var v = document.querySelector('video');
      if (!v || !v.srcObject || v.readyState < 2 || !v.videoWidth) return;
      _preBusy = true;
      var w = Math.min(1280, v.videoWidth), h = Math.round(w * v.videoHeight / v.videoWidth);
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(v, 0, 0, w, h);
      var code = null;
      try { code = _decodeCanvas(c); } catch (e) {}
      if (!code) {
        // segundo intento barato: recorte central (el código suele ir centrado)
        var cw = Math.round(w * 0.7), ch = Math.round(h * 0.7);
        var c2 = document.createElement('canvas'); c2.width = cw; c2.height = ch;
        c2.getContext('2d').drawImage(c, Math.round((w - cw) / 2), Math.round((h - ch) / 2), cw, ch, 0, 0, cw, ch);
        try { code = _decodeCanvas(c2); } catch (e2) {}
      }
      if (code) { _pre.code = code; _pre.ts = Date.now(); }
      _preBusy = false;
    } catch (e) { _preBusy = false; }
  }, 500);

  /* ---------- el motor: llamado por el parche del efecto "analyzing" ---------- */
  window.CF_FS_RECOGNIZE = function (input) {
    input = input || {};
    // 0) acierto fresco de la pre-decodificación continua → instantáneo
    var fresh = (_pre.code && (Date.now() - _pre.ts) < 5000) ? _pre.code : null;
    _pre.code = null; // un solo uso
    // 1) si no, decodificar el barcode (frame hi-res primero, foto mostrada después)
    return (fresh ? Promise.resolve(fresh) : decodeBarcode(input.frame).then(function (code) {
      return code || decodeBarcode(input.photo);
    })).then(function (code) {
      if (!code) return { err: 'nofood' };
      // 2) caché → 3) Open Food Facts
      var cached = cacheGet(code);
      if (cached) return finish(code, cached);
      return fetch(OFF_URL + encodeURIComponent(code) + '.json?fields=' + OFF_FIELDS)
        .then(function (r) {
          if (r.status === 404) return { err: 'nofood' };
          if (!r.ok) return { err: 'offline' };
          return r.json().then(function (data) {
            if (!data || !data.product) return { err: 'nofood' };
            cachePut(code, data.product);
            return finish(code, data.product);
          });
        })
        .catch(function () { return { err: 'offline' }; });
    });

    function finish(code, product) {
      var irritants = detectIrritants(product);
      if (irritants.length) setTimeout(function () { showIrritantBanner(irritants, product.product_name); }, 600);
      return { items: [itemFromProduct(code, product)], irritants: irritants, barcode: code };
    }
  };
})();
