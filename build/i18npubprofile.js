(function(){/* ===================================================================
   i18npubprofile — strings for the public mini-profile fallbacks:
   the generic author shown when a user has no users/{uid}/public/profile.
   English is the source key; all 15 remaining app languages inline.
   Merge-if-missing. Loaded with the other i18n fills, before app scripts.
   =================================================================== */(function(){if(typeof CF_UI_MAP==='undefined')return;var M={"Community member":{es:"Miembro de la comunidad",ca:"Membre de la comunitat",fr:"Membre de la communauté",de:"Community-Mitglied",it:"Membro della community",pt:"Membro da comunidade",zh:"社区成员",ja:"コミュニティメンバー",ko:"커뮤니티 회원",hi:"समुदाय सदस्य",id:"Anggota komunitas",tr:"Topluluk üyesi",ru:"Участник сообщества",vi:"Thành viên cộng đồng",ar:"عضو في المجتمع"}};Object.keys(M).forEach(function(k){if(!CF_UI_MAP[k])CF_UI_MAP[k]={};Object.keys(M[k]).forEach(function(lang){if(!CF_UI_MAP[k][lang])CF_UI_MAP[k][lang]=M[k][lang];});});})();
})();