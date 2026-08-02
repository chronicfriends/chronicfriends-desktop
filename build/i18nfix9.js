(function(){/* ===================================================================
   i18nfix9 — "Download PDF" (the word "file" dropped from the button
   label in EVERY language; used in the Journal, the Analytics sheet
   and the PDF export sheet). Merge-if-missing. Loaded after i18nfix8.
   =================================================================== */(function(){if(typeof CF_UI_MAP==='undefined')return;var M={"Download PDF":{es:"Descargar PDF",ca:"Descarrega el PDF",fr:"Télécharger le PDF",de:"PDF herunterladen",it:"Scarica PDF",pt:"Baixar PDF",zh:"下载 PDF",ja:"PDFをダウンロード",ko:"PDF 다운로드",hi:"PDF डाउनलोड करें",id:"Unduh PDF",tr:"PDF'yi indir",ru:"Скачать PDF",vi:"Tải PDF",ar:"تنزيل PDF"}};Object.keys(M).forEach(function(k){if(!CF_UI_MAP[k])CF_UI_MAP[k]={};Object.keys(M[k]).forEach(function(lang){if(!CF_UI_MAP[k][lang])CF_UI_MAP[k][lang]=M[k][lang];});});})();
})();