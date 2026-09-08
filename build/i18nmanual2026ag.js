/* ===================================================================
   i18nmanual2026ag — the manual line for THE FREE PLAN'S ROW in «The
   plans» (7 Sep 2026). The table used to list four rows, all paid, in
   a screen that had just said twice that the app is free for ever;
   the free plan is now its FIRST row.

   THE MANUAL QUOTES THE APP. The four labels inside <strong> tags were
   taken FROM the live dictionaries, never translated again by hand:
     Free plan  → i18ngap3.jsx
     Forever · Free → i18nmembership.jsx (added the same day)
     Your plan  → i18nbuild103.jsx
   All 15 non-English languages. Merge-if-missing; <strong> kept
   verbatim. Loaded after build/i18nmanual2026af.js.
   =================================================================== */
(function () {
  if (typeof CF_UI_MAP === 'undefined') return;
  var M = {
  "The table of plans starts with the <strong>Free plan</strong>: <strong>Forever</strong>, <strong>Free</strong>, and nothing to tap because there is nothing to buy. A discreet <strong>Your plan</strong> marks the one you are on.": {
    es: "La tabla de planes empieza por el <strong>Plan gratuito</strong>: <strong>Para siempre</strong>, <strong>Gratis</strong>, y nada que pulsar porque no hay nada que comprar. Una marca discreta, <strong>Tu plan</strong>, señala el que tienes.",
    ca: "La taula de plans comença pel <strong>Pla gratuït</strong>: <strong>Per sempre</strong>, <strong>Gratis</strong>, i res per prémer perquè no hi ha res a comprar. Una marca discreta, <strong>El teu pla</strong>, assenyala el que tens.",
    fr: "Le tableau des forfaits commence par l’<strong>Offre gratuite</strong> : <strong>Pour toujours</strong>, <strong>Gratuit</strong>, et rien à toucher puisqu’il n’y a rien à acheter. Une marque discrète, <strong>Votre forfait</strong>, indique celui que vous avez.",
    de: "Die Plan-Tabelle beginnt mit dem <strong>Gratis-Plan</strong>: <strong>Für immer</strong>, <strong>Gratis</strong>, und nichts zum Antippen, weil es nichts zu kaufen gibt. Eine leise Markierung, <strong>Dein Plan</strong>, zeigt den, den du hast.",
    it: "La tabella dei piani inizia dal <strong>Piano gratuito</strong>: <strong>Per sempre</strong>, <strong>Gratis</strong>, e niente da toccare perché non c’è nulla da comprare. Una marca discreta, <strong>Il tuo piano</strong>, indica quello che hai.",
    pt: "A tabela de planos começa pelo <strong>Plano gratuito</strong>: <strong>Para sempre</strong>, <strong>Grátis</strong>, e nada para tocar porque não há nada para comprar. Uma marca discreta, <strong>Seu plano</strong>, assinala o que tens.",
    zh: "方案表格的第一行是<strong>免费方案</strong>：<strong>永久</strong>、<strong>免费</strong>，也没有可点的地方，因为没有什么要买。一个不打扰的<strong>你的方案</strong>标出你现在用的那个。",
    ja: "プランの表は<strong>無料プラン</strong>から始まります。<strong>ずっと</strong>、<strong>無料</strong>、そして買うものがないのでタップするところもありません。いま使っているプランには<strong>あなたのプラン</strong>という控えめな印がつきます。",
    ko: "요금제 표는 <strong>무료 플랜</strong>으로 시작해요. <strong>언제까지나</strong>, <strong>무료</strong>, 그리고 살 것이 없으니 누를 것도 없습니다. 지금 쓰는 요금제에는 <strong>내 요금제</strong>라는 조용한 표시가 붙어요.",
    hi: "प्लान की तालिका <strong>मुफ़्त प्लान</strong> से शुरू होती है: <strong>हमेशा के लिए</strong>, <strong>मुफ़्त</strong>, और दबाने को कुछ नहीं, क्योंकि ख़रीदने को कुछ नहीं है। आप जिस पर हैं, उस पर <strong>आपका प्लान</strong> का हल्का-सा निशान होता है।",
    id: "Tabel paket dimulai dari <strong>Paket gratis</strong>: <strong>Selamanya</strong>, <strong>Gratis</strong>, dan tidak ada yang perlu diketuk karena tidak ada yang dibeli. Tanda kecil <strong>Paketmu</strong> menunjukkan paket yang sedang kamu pakai.",
    tr: "Plan tablosu <strong>Ücretsiz plan</strong> ile başlar: <strong>Sonsuza kadar</strong>, <strong>Ücretsiz</strong>, ve dokunacak bir şey yok çünkü satın alınacak bir şey yok. Kullandığın planı <strong>Planın</strong> diye sade bir işaret gösterir.",
    ru: "Таблица планов начинается с <strong>Бесплатного плана</strong>: <strong>Навсегда</strong>, <strong>Бесплатно</strong>, и нажимать нечего, потому что покупать нечего. Тот, что у вас, отмечен скромной надписью <strong>Ваш план</strong>.",
    vi: "Bảng các gói bắt đầu bằng <strong>Gói miễn phí</strong>: <strong>Mãi mãi</strong>, <strong>Miễn phí</strong>, và không có gì để chạm vì không có gì để mua. Một dấu nhỏ <strong>Gói của bạn</strong> đánh dấu gói bạn đang dùng.",
    ar: "يبدأ جدول الخطط بـ<strong>الخطة المجانية</strong>: <strong>إلى الأبد</strong>، <strong>مجاني</strong>، ولا شيء تضغطه لأنه لا شيء للشراء. وعلامة هادئة، <strong>خطتك</strong>، تشير إلى الخطة التي لديك.",
  },
  };
  Object.keys(M).forEach(function (en) {
    var cur = CF_UI_MAP[en] || (CF_UI_MAP[en] = {});
    var add = M[en];
    Object.keys(add).forEach(function (L) { if (cur[L] == null) cur[L] = add[L]; });
  });
})();
