(function(){/* ===================================================================
   i18nrate1 — the app strings of RATE1 (30 Oct 2026): «Rate Chronic
   Friends» takes the person to the STORE (settings.jsx › RateSheet);
   the five stars that only wrote cf_rating_v1 on the phone are gone.
   The two NEW lines of the sheet:
     · the sentence under the title — where a review really helps;
     · «Write a review» — in each language the store's OWN action, the
       words the person then sees there, as the stores' own help pages
       write them (RATE1b, checked 30 Oct 2026 in the iPhone User Guide
       on support.apple.com and in Google Play's help,
       support.google.com/googleplay/answer/4346705 with hl=):
       fr «Rédiger un avis» (the App Store; Google Play's web the same) ·
       de «Rezension schreiben» (Google Play and the Mac App Store; the
       iPhone's says «Rezensieren» — in German the stars are the
       «Bewertung», the written review is the «Rezension») ·
       vi «Viết bài đánh giá» (Google Play; the App Store says
       «Viết nhận xét» — Google's, as the sentence already says
       «bài đánh giá»). The other twelve match at least one of the two
       stores (in es · ca · zh · tr · ar · ru the two stores use
       different words, and ours is one of them), e.g. es «Escribir
       una reseña» · it «Scrivi una recensione» · pt «Escrever uma
       crítica» (Google Play pt-PT) · tr «Yorum yaz». The sentence
       names the review with the button's own noun, in every language
       (de «Rezension» since RATE1b).
   REUSED, never translated again: the title «Rate Chronic Friends»
   (i18nfix8 × 15). Translated in no language: App Store · Google Play ·
   Chronic Friends. «App Store or Google Play» as i18nstore writes it;
   «people who live with a chronic illness» as the invite says it
   (i18nciclo107f). The sentence addresses nobody, so no tú / vous /
   Sie / вы can disagree with the app; es · ca · it · fr · pt without
   gender (1.0.8j §4).
   All 15 non-English languages. Merge-if-missing.
   Loaded after i18nciclo108m and BEFORE i18nlifetags (which stays last).
   =================================================================== */(function(){if(typeof CF_UI_MAP==='undefined')return;var M={"A review on the App Store or Google Play helps other people living with a chronic illness find Chronic Friends.":{es:"Una reseña en la App Store o Google Play ayuda a otras personas que viven con una enfermedad crónica a encontrar Chronic Friends.",ca:"Una ressenya a l’App Store o Google Play ajuda altres persones que viuen amb una malaltia crònica a trobar Chronic Friends.",fr:"Un avis sur l’App Store ou Google Play aide d’autres personnes qui vivent avec une maladie chronique à trouver Chronic Friends.",de:"Eine Rezension im App Store oder bei Google Play hilft anderen Menschen, die mit einer chronischen Krankheit leben, Chronic Friends zu finden.",it:"Una recensione su App Store o Google Play aiuta altre persone che vivono con una malattia cronica a trovare Chronic Friends.",pt:"Uma crítica na App Store ou no Google Play ajuda outras pessoas que vivem com uma doença crónica a encontrar o Chronic Friends.",zh:"App Store 或 Google Play 上的一条评论，能帮助其他与慢性病共同生活的人找到 Chronic Friends。",ja:"App Store や Google Play のレビューは、慢性の病気とともに暮らすほかの人が Chronic Friends を見つける助けになります。",ko:"App Store나 Google Play에 남긴 리뷰는 만성 질환과 함께 살아가는 다른 사람들이 Chronic Friends를 찾는 데 도움이 돼요.",hi:"App Store या Google Play पर लिखी समीक्षा, पुरानी बीमारी के साथ जी रहे दूसरे लोगों को Chronic Friends ढूँढने में मदद करती है।",id:"Ulasan di App Store atau Google Play membantu orang lain yang hidup dengan penyakit kronis menemukan Chronic Friends.",tr:"App Store veya Google Play'de yazılan bir yorum, kronik bir hastalıkla yaşayan başka insanların Chronic Friends'i bulmasına yardımcı olur.",ru:"Отзыв в App Store или Google Play помогает другим людям, которые живут с хроническим заболеванием, найти Chronic Friends.",vi:"Một bài đánh giá trên App Store hoặc Google Play giúp những người khác đang sống chung với bệnh mạn tính tìm thấy Chronic Friends.",ar:"مراجعة على App Store أو Google Play تساعد أشخاصًا آخرين يعيشون مع مرض مزمن على إيجاد Chronic Friends."},"Write a review":{es:"Escribir una reseña",ca:"Escriu una ressenya",fr:"Rédiger un avis",de:"Rezension schreiben",it:"Scrivi una recensione",pt:"Escrever uma crítica",zh:"撰写评论",ja:"レビューを書く",ko:"리뷰 작성",hi:"समीक्षा लिखें",id:"Tulis ulasan",tr:"Yorum yaz",ru:"Написать отзыв",vi:"Viết bài đánh giá",ar:"كتابة مراجعة"}};Object.keys(M).forEach(function(k){if(!CF_UI_MAP[k])CF_UI_MAP[k]=M[k];else Object.keys(M[k]).forEach(function(l){if(!CF_UI_MAP[k][l])CF_UI_MAP[k][l]=M[k][l];});});})();
})();