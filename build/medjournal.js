(function(){/* ===================================================================
   MEDICATION DAY CARD (medjournal.jsx) — Phase 3 journal alignment.
   Follows the sanctioned CFFlareDaySummary pattern: a READ-ONLY
   per-day summary card in the Journal day view, derived from the SAME
   dose store (cf_meds_v3 + cf_taken_v2 through cfDoseState) — no
   copies, no caches, no parallel journal, no new renderer.

   • Only RESOLVED doses (taken / skipped) appear. Unlogged doses:
     nothing. Snoozed doses: nothing (transient). A day with zero
     resolved doses shows NO medication card at all.
   • Attribution: a dose always appears on its SCHEDULED day (the date
     part of its dose key). respondedAt renders only as the
     "taken at HH:MM" detail — a backfill done today for last Tuesday
     appears on Tuesday's card.
   • Copy is factual (COPY RULES): "[Name], [dose] — taken at 08:12" /
     "[Name] — skipped". No judgments, no totals, no streaks.
   • Re-renders on 'cf-meds-external' (in-app alarm, bridge
     med:resolved, backfill via medstate broadcasts) — same render
     cycle, no manual reload.
   =================================================================== */const{useState:useMjS,useEffect:useMjE}=React;const mjRead=k=>{try{return JSON.parse(localStorage.getItem(k))||null;}catch(e){return null;}};/* the day's resolved doses, scheduled-day attribution, sorted by time */function cfMedDayLines(date){if(!window.cfDoseState)return[];const meds=mjRead('cf_meds_v3')||[];const taken=mjRead('cf_taken_v2')||{};const byId={};meds.forEach(m=>{byId[m.id]=m;});const lines=[];Object.keys(taken).forEach(key=>{const p=key.split('|');if(p.length!==3||p[0]!==date)return;const st=cfDoseState(taken[key]);if(st.s!=='taken'&&st.s!=='skipped')return;// resolved only
const m=byId[p[1]];lines.push({key,time:p[2],st,name:m?tr(m.name):p[1],dose:m?window.cfMedDoseLabel?cfMedDoseLabel(m):tr(m.dose):''});});lines.sort((a,b)=>a.time<b.time?-1:1);return lines;}function CFMedDaySummary({date}){useT();const[,bump]=useMjS(0);useMjE(()=>{const f=()=>bump(n=>n+1);window.addEventListener('cf-meds-external',f);return()=>window.removeEventListener('cf-meds-external',f);},[]);const lines=cfMedDayLines(date);if(!lines.length)return null;// zero resolved doses → no card
const loc=window.I18n&&I18n.locale&&I18n.locale()||'en-US';const flare=!!(window.cfFlareUI&&cfFlareUI());// day-view theming, like the Food Journal card
const text=l=>{if(l.st.s==='skipped')return trf('{name} — skipped',{name:l.name});const t=l.st.at?new Date(l.st.at).toLocaleTimeString(loc,{hour:'numeric',minute:'2-digit'}):null;return t?trf('{name}, {dose} — taken at {t}',{name:l.name,dose:l.dose,t}):trf('{name}, {dose} — taken',{name:l.name,dose:l.dose});};return/*#__PURE__*/React.createElement("div",{style:{marginTop:12,padding:'13px 15px',borderRadius:16,background:flare?'var(--white)':'linear-gradient(180deg,#eaf6e3,#dcefd0)',boxShadow:'inset 0 0 0 1.5px rgba(90,140,80,.25)'},"data-comment-anchor":"med-day-summary"},/*#__PURE__*/React.createElement("div",{style:{display:'flex',alignItems:'center',gap:8}},/*#__PURE__*/React.createElement("span",{style:{display:'flex',color:flare?'#8fce7d':'var(--green-600)',flex:'none'}},Ic.pill({width:16,height:16})),/*#__PURE__*/React.createElement("span",{style:{flex:1,minWidth:0,fontSize:12.5,fontWeight:800,lineHeight:1.3,color:flare?'#bfe3b0':'var(--green-700)'}},tr('Medication'))),/*#__PURE__*/React.createElement("div",{style:{display:'flex',flexDirection:'column',marginTop:4}},lines.map((l,i)=>/*#__PURE__*/React.createElement("div",{key:l.key,style:{display:'flex',alignItems:'baseline',gap:8,padding:'5px 0',borderTop:i===0?'none':'1px dashed rgba(110,150,100,.3)'}},/*#__PURE__*/React.createElement("span",{style:{fontSize:10,fontWeight:800,color:flare?'#a8c99b':'#6d8a62',fontFamily:'monospace',flex:'none',width:36}},l.time),/*#__PURE__*/React.createElement("span",{style:{flex:1,minWidth:0,fontSize:12.5,fontWeight:700,color:'var(--ink)',lineHeight:1.4,overflowWrap:'break-word'}},text(l))))));}Object.assign(window,{CFMedDaySummary,cfMedDayLines});
})();