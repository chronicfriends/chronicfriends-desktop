(function(){/* ===================================================================
   i18n — catalogue Phase 7 strings. 'as prescribed' is the JIA
   no-numeric-dose display value (7c renders it instead of any numeric
   dose inside the JIA section). All 15 non-English languages.
   =================================================================== */(function(){if(!window.CF_UI_MAP)return;var F={"as prescribed":{es:"según prescripción",ca:"segons prescripció",fr:"selon prescription",de:"nach Verordnung",it:"come da prescrizione",pt:"conforme prescrição",zh:"遵医嘱",ja:"処方どおり",ko:"처방에 따라",hi:"पर्चे के अनुसार",id:"sesuai resep",tr:"reçeteye göre",ru:"по назначению врача",vi:"theo đơn của bác sĩ",ar:"حسب الوصفة الطبية"}};Object.keys(F).forEach(function(k){var cur=CF_UI_MAP[k]||(CF_UI_MAP[k]={});Object.keys(F[k]).forEach(function(lang){if(cur[lang]==null)cur[lang]=F[k][lang];});});})();
})();