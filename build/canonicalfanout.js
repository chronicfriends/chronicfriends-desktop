(function(){/* ===================================================================
   CANONICAL FAN-OUT — the approved C1–C4 merges (data level ONLY)
   -------------------------------------------------------------------
   Gerhard approved merging the four candidate canonicalKeys
   (docs/tracker-mapping.md §2.2). One measure, every original path:

   C1 mood.tone   core.mindset ⇄ mind.mdWeather ⇄ flare mood (1–5)
      Clean 5↔5↔5 bijection:
        Fighter=Sunny=5 · Positive=Partly cloudy=4 · Balanced=Cloudy=3 ·
        Negative=Rainy=2 · Depressed=Stormy=1
      Rendered instance (§13.2): mind.mdWeather when the Mind module is
      on (the classic Mindset row hides — its FIELD keeps being written,
      so the Mindset chart and history never change); Mindset when the
      Mind module is off. Flare mood joins via flaresync/flarefanout.
   C2 stiffness.morning   musc.mjStiff ⇄ CFModLogs.unlock — identical
      scales, two stores. Both surfaces stay (tool = quick surface,
      rule R4); values two-way synced with a per-day marker.
   C3 cycle.flow   pelvic.pvBleed ⇄ CFModLogs.cycle — same options
      ('None' = no cycle day). Two-way with marker.
   C4 mouth.ulcers   CFModLogs.mouth[] → 'Mouth ulcer' chip in skChips.
      One-way (a chip can't invent a mouth region); never removes.

   Rules: runs ONLY while the unified journal flag is ON (flag OFF =
   the previous app, bit for bit — D6). Additive `_canonSync` marker
   inside the day record (same pattern as _flareSync/_sync) makes every
   write idempotent and lets a manual edit on either surface win.
   Nothing is ever deleted; no component code is touched.
   =================================================================== *//* C1 bijections (exported — flarefanout/flaresync reuse them) */const CFC_W2M={'Sunny':'Fighter','Partly cloudy':'Positive','Cloudy':'Balanced','Rainy':'Negative','Stormy':'Depressed'};const CFC_M2W={'Fighter':'Sunny','Positive':'Partly cloudy','Balanced':'Cloudy','Negative':'Rainy','Depressed':'Stormy'};const CFC_W2N={'Sunny':5,'Partly cloudy':4,'Cloudy':3,'Rainy':2,'Stormy':1};const CFC_N2W={5:'Sunny',4:'Partly cloudy',3:'Cloudy',2:'Rainy',1:'Stormy'};/* is mood.tone asked as Inner weather? (unified ON + Mind module on) */function cfMoodToneUnified(){return!!(window.cfUnifiedJournalEnabled&&cfUnifiedJournalEnabled()&&window.CFModules&&CFModules.isOn('mind'));}let cfcBusy=false;function cfCanonicalFanout(){if(cfcBusy)return;if(!window.cfUnifiedJournalEnabled||!cfUnifiedJournalEnabled())return;/* D6 */if(!window.CFModLogs||!window.CFModules)return;cfcBusy=true;try{let store;try{store=JSON.parse(localStorage.getItem('cf-checkins')||'{}')||{};}catch(e){store={};}const ml=CFModLogs.get();const unlock=ml.unlock||{},cycle=ml.cycle||{};const mouthDays=new Set((ml.mouth||[]).map(m=>m&&m.d).filter(Boolean));const mindOn=CFModules.isOn('mind');const days=new Set([...Object.keys(store),...Object.keys(unlock),...Object.keys(cycle),...mouthDays]);let ckChanged=false;const mlWrites=[];days.forEach(ds=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(ds))return;const rec0=store[ds]||null;let rec=rec0?{...rec0}:null;let dirty=false;const cs={...(rec0&&rec0._canonSync||{})};const ensure=()=>{if(!rec){rec={};}};/* ---- C1 mood.tone (in-record, direction = the rendered instance) ---- */if(rec){if(mindOn){const m=rec.mdWeather&&CFC_W2M[rec.mdWeather];if(m&&rec.mindset!==m){rec.mindset=m;dirty=true;}}else{const w=rec.mindset&&CFC_M2W[rec.mindset];if(w&&rec.mdWeather!==w){rec.mdWeather=w;dirty=true;}}}/* ---- C2 stiffness.morning: mjStiff ⇄ unlock[ds] ---- */const uv=unlock[ds]||null;const jv=rec&&rec.mjStiff||null;if(jv&&jv!==cs.stiff&&jv!==uv){/* journal edited → tool */mlWrites.push(['unlock',ds,jv]);cs.stiff=jv;dirty=true;}else if(uv&&uv!==cs.stiff&&jv!==uv){/* tool edited → journal */ensure();rec.mjStiff=uv;cs.stiff=uv;dirty=true;}else if(jv&&jv===uv&&cs.stiff!==jv){cs.stiff=jv;dirty=true;}/* ---- C3 cycle.flow: pvBleed ⇄ cycle[ds] ---- */const cyv=cycle[ds]||null;/* 'Spotting'|'Normal'|'Heavy' */const jf=rec&&rec.pvBleed||null;/* + 'None' */if(jf&&jf!==cs.flow){/* journal answer changed */if(jf==='None'){if(cyv)mlWrites.push(['cycle',ds,null]);}else if(cyv!==jf)mlWrites.push(['cycle',ds,jf]);cs.flow=jf;dirty=true;}else if(cyv&&cyv!==cs.flow&&jf!==cyv){/* tool day set/changed → journal */ensure();rec.pvBleed=cyv;cs.flow=cyv;dirty=true;}else if(!cyv&&cs.flow&&cs.flow!=='None'&&jf===cs.flow){rec.pvBleed='None';cs.flow='None';dirty=true;/* tool day cleared → journal (synced value only) */}/* ---- C4 mouth spots → 'Mouth ulcer' chip (one-way, never removes) ---- */if(mouthDays.has(ds)){ensure();const chips=rec.skChips||[];if(chips.indexOf('Mouth ulcer')<0){rec.skChips=[...chips,'Mouth ulcer'];dirty=true;}}if(rec&&dirty){if(Object.keys(cs).length)rec._canonSync=cs;store[ds]=rec;ckChanged=true;}});if(ckChanged){try{localStorage.setItem('cf-checkins',JSON.stringify(store));}catch(e){}try{window.dispatchEvent(new Event('cf-checkin-sync'));}catch(e){}}/* tool-store writes go through the public API (fires cf-modlogs-updated;
       re-entry is busy-guarded and re-runs settle by equality) */mlWrites.forEach(([kind,ds,v])=>{try{kind==='unlock'?CFModLogs.setUnlock(ds,v):CFModLogs.setCycleDay(ds,v);}catch(e){}});}catch(e){}finally{cfcBusy=false;}}/* triggers: journal writes (saveStore hook in checkin.jsx), tool writes,
   flaresync passes, and load */try{window.addEventListener('cf-modlogs-updated',()=>cfCanonicalFanout());window.addEventListener('cf-checkin-sync',()=>cfCanonicalFanout());setTimeout(()=>cfCanonicalFanout(),500);}catch(e){}Object.assign(window,{cfCanonicalFanout,cfMoodToneUnified,CFC_W2M,CFC_M2W,CFC_W2N,CFC_N2W});
})();