(function(){/* ===================================================================
   UNIFIED JOURNAL TRACKER — Phase 3 UI (additive)
   -------------------------------------------------------------------
   The Journal tab shows exactly ONE tracker. It is a COMPOSED VIEW:

   • Spine = the untouched <DailyCheckin/> (checkin.jsx) — calendar,
     Download PDF + Analytics (premium gate intact), essentials, core
     digestion/lifestyle/mind sections, and the per-module question
     groups it already composes via CFModulesCheckinExtra. One question,
     one truth: everything lands in the existing cf-checkins record, so
     every chart, radar and report keeps working unchanged.
   • Around it, rendered FROM the UnifiedTrackerConfig
     (cfResolveUnifiedFromProfile → resolveUnifiedTracker):
     the composed-from header and the D2 empty-state CTA. Each module's
     question group carries its own tools & logs INSIDE it (one group
     per module — modcheckin.jsx embeds the existing SMTools* when the
     unified flag is on), so the journal reads as ONE flow: essentials →
     core → module groups. Nothing rewritten.

   Feature flag `unifiedJournalEnabled` (cf_unified_journal_v1,
   default ON): flag OFF renders <SMJournalHome/> — the previous
   Journal, exactly as it is today. The per-tracker journals and the
   picker stay in the codebase untouched (D6).

   Flare Mode: app.jsx already swaps the whole Journal tab to the
   locked FlareModeCheckin while a flare is active — this view never
   mounts there, and no flare code is touched (D7).
   =================================================================== *//* ---------- feature flag (Phase 5 wires the Tweaks control) ---------- */const CF_UNIFIED_FLAG_KEY='cf_unified_journal_v1';function cfUnifiedJournalEnabled(){try{return localStorage.getItem(CF_UNIFIED_FLAG_KEY)!=='0';}catch(e){return true;}}function cfSetUnifiedJournal(on){try{localStorage.setItem(CF_UNIFIED_FLAG_KEY,on?'1':'0');}catch(e){}try{window.dispatchEvent(new CustomEvent('cf-unified-flag'));}catch(e){}}function useUnifiedFlag(){const[,bump]=React.useState(0);React.useEffect(()=>{const r=()=>bump(n=>n+1);window.addEventListener('cf-unified-flag',r);window.addEventListener('storage',r);return()=>{window.removeEventListener('cf-unified-flag',r);window.removeEventListener('storage',r);};},[]);return cfUnifiedJournalEnabled();}/* ---------- D2 empty state — univ stays, plus the Settings invitation ---------- */function SMUJEmptyCard({onChoose}){return/*#__PURE__*/React.createElement("div",{className:"card-solid",style:{padding:'18px 18px 20px',marginBottom:16}},/*#__PURE__*/React.createElement("div",{style:{display:'flex',alignItems:'center',gap:12,marginBottom:10}},/*#__PURE__*/React.createElement("div",{className:"badge-ic"},Ic.heart({width:22,height:22})),/*#__PURE__*/React.createElement("div",{style:{fontWeight:800,fontSize:16.5,letterSpacing:'-.01em'}},tr('Make this journal yours'))),/*#__PURE__*/React.createElement("div",{className:"muted",style:{fontSize:13,fontWeight:600,lineHeight:1.5,marginBottom:14}},tr('Choose the conditions you live with and your journal composes itself — only what matters to you, nothing else.')),/*#__PURE__*/React.createElement("button",{className:"btn3d",onClick:onChoose,style:{width:'100%',fontSize:14.5,fontWeight:700,borderRadius:22,padding:'14px 12px',gap:9}},Ic.heart({width:17,height:17})," ",tr('Choose my conditions')));}/* ---------- THE unified tracker ---------- */function UnifiedJournal(){useT();const ms=useModules();const on=useUnifiedFlag();const[mhOpen,setMhOpen]=React.useState(false);/* memoized recomposition — recomputes only when the profile store changes */const cfg=React.useMemo(()=>window.cfResolveUnifiedFromProfile?cfResolveUnifiedFromProfile():null,[ms]);/* flag OFF → the previous Journal, exactly as it is today (§10.1, D6) */if(!on)return window.SMJournalHome?/*#__PURE__*/React.createElement(SMJournalHome,null):/*#__PURE__*/React.createElement(DailyCheckin,null);if(!cfg)return/*#__PURE__*/React.createElement(DailyCheckin,null);/* resolver absent → classic behavior, never a dead end *//* dev-only consistency check: the spine's composed question groups must
     match the config (both derive from the same profile — warn, never block) */try{const spine=CFModules.activeList().map(m=>m.id).sort().join();const conf=[...cfg.moduleIds].sort().join();if(spine!==conf)console.warn('[unified-journal] config/spine module mismatch',spine,conf);}catch(e){}const conds=(cfg.conditionIds||[]).filter(c=>c!=='Other / not listed');return/*#__PURE__*/React.createElement("div",{"data-screen-label":"Journal \u2014 unified tracker"},cfg.emptyState&&/*#__PURE__*/React.createElement(SMUJEmptyCard,{onChoose:()=>setMhOpen(true)}),/*#__PURE__*/React.createElement(DailyCheckin,null),mhOpen&&window.MyHealthPanel&&/*#__PURE__*/React.createElement(SheetPortal,null,/*#__PURE__*/React.createElement(MyHealthPanel,{onBack:()=>setMhOpen(false)})));}Object.assign(window,{UnifiedJournal,cfUnifiedJournalEnabled,cfSetUnifiedJournal});
})();