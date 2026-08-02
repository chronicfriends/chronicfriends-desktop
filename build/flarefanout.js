(function(){/* ===================================================================
   FLARE FAN-OUT — normal → Flare data sync (Phase 4, data level ONLY)
   -------------------------------------------------------------------
   Completes the bidirectional §9.4 contract. The flare→journal leg
   already exists (flaresync.jsx). This file adds the OTHER direction:
   when the user answers a shared item in the (unified) journal, the
   value is fanned out to the Flare Mode micro-log paths the LOCKED
   flare screens already read — so entering the shelter shows current
   values, with zero changes to any Flare Mode code.

   Shared canonicalKeys handled (registry: CF_CANONICAL_KEYS):
     pain.overall      journal pain 0–10  → append fl[d].pain[] reading
     energy.level      journal energy     → battery 1–5 (inverse of ×2)
     bowel.frequency   journal bowel bucket → fl[d].bath counter
     hydration.volume  journal water bucket → fl[d].water glasses
   Mood / Bristol / notes / voice have no journal source — never written.
   The writer NEVER toggles Flare mode itself.

   Safety rules (defaults D-P4, flagged for Gerhard in the report):
   S1 Writes ONLY while a flare episode is ACTIVE, and only TODAY.
      cfFlareDays() counts any day with quick-logs as a cyan flare day —
      so writing outside an active flare would wrongly mark days cyan.
      This rule makes that impossible.
   S2 Only MANUAL journal values propagate: a value differing from what
      flaresync last synced (rec._flareSync), or — when no marker —
      differing from the field's untouched default (CF_DEFAULTS).
   S3 Idempotent & loop-safe: last pushed values live in
      fl[d]._journalSync (an ADDITIVE data key — flare code reads only
      its own keys; rcPatch never drops foreign keys). Re-runs are
      no-ops; flaresync's manual-edit-wins markers stop any bounce.
   S4 Counters are written only when the current count maps to a
      DIFFERENT bucket, using the bucket's representative value —
      the user's own tapped counts are never nudged within a bucket.
   =================================================================== */const FF_LOG_KEY='cf_flaremode_log_v1';const FF_CK_KEY='cf-checkins';/* bucket maps — MUST match checkin.jsx LIFE options & flaresync.jsx exactly */function ffBowelBucket(n){return n<=2?'0–2':n<=4?'2–4':n<=6?'4–6':'+6';}function ffWaterBucket(g){return g<2?'<0.5L':g<=4?'0.5–1L':g<=8?'1–2L':'+2L';}/* representative counts — chosen to round-trip into the same bucket */const FF_BOWEL_REP={'0–2':1,'2–4':3,'4–6':5,'+6':7};const FF_WATER_REP={'<0.5L':1,'0.5–1L':3,'1–2L':6,'+2L':9};function ffRead(k){try{return JSON.parse(localStorage.getItem(k))||{};}catch(e){return{};}}let ffBusy=false;function cfJournalToFlareSync(){if(ffBusy)return;ffBusy=true;try{const st=window.CFFlareMode?CFFlareMode.get():null;if(!st||!st.active)return;/* S1 */const today=cfDayKey();const store=ffRead(FF_CK_KEY);const rec=store[today];if(!rec)return;const mark=rec._flareSync||{};const DEF=window.CF_DEFAULTS||{};/* S2 — manual journal value: differs from last flare-synced value,
       or (never synced) differs from the untouched default */const manual=k=>{const v=rec[k];if(v==null||v==='')return false;if(mark[k]!==undefined)return String(v)!==String(mark[k]);try{return JSON.stringify(v)!==JSON.stringify(DEF[k]);}catch(e){return v!==DEF[k];}};const log=ffRead(FF_LOG_KEY);const d=log[today]||{pain:[],energy:[],bath:0,water:0};const js=Object.assign({},d._journalSync||{});/* S3 */let changed=false,uiChanged=false;if(manual('pain')){const v=Math.max(0,Math.min(10,Number(rec.pain)));if(js.pain!==v){const arr=d.pain||[];if(!(arr.length&&arr[arr.length-1].v===v)){d.pain=[...arr,{v,t:Date.now()}];uiChanged=true;}js.pain=v;changed=true;}}if(manual('energy')){const b=Math.max(1,Math.min(5,Math.round(Number(rec.energy)/2)));/* inverse of flaresync ×2 */if(js.energy!==b){const arr=d.energy||[];if(!(arr.length&&arr[arr.length-1].v===b)){d.energy=[...arr,{v:b,t:Date.now()}];uiChanged=true;}js.energy=b;changed=true;}}if(manual('bowel')&&FF_BOWEL_REP[rec.bowel]!=null&&js.bowel!==rec.bowel){if(ffBowelBucket(d.bath||0)!==rec.bowel){d.bath=FF_BOWEL_REP[rec.bowel];uiChanged=true;}/* S4 */js.bowel=rec.bowel;changed=true;}if(manual('water')&&FF_WATER_REP[rec.water]!=null&&js.water!==rec.water){if(ffWaterBucket(d.water||0)!==rec.water){d.water=FF_WATER_REP[rec.water];uiChanged=true;}/* S4 */js.water=rec.water;changed=true;}/* [C1 merge] inner weather → flare mood 1–5 (bijection in canonicalfanout.jsx) */const W2N=window.CFC_W2N||{};if(manual('mdWeather')&&W2N[rec.mdWeather]!=null){const mv=W2N[rec.mdWeather];if(js.mood!==mv){const arr=d.mood||[];if(!(arr.length&&arr[arr.length-1].v===mv)){d.mood=[...arr,{v:mv,t:Date.now()}];uiChanged=true;}js.mood=mv;changed=true;}}if(changed){d._journalSync=js;log[today]=d;try{localStorage.setItem(FF_LOG_KEY,JSON.stringify(log));}catch(e){}}if(uiChanged){try{window.dispatchEvent(new Event('cf-flaremode'));}catch(e){}}}catch(e){}finally{ffBusy=false;}}/* run on load (after flaresync's own pass) + whenever flare state or
   quick-logs change (activation pings 'cf-flaremode'). Journal writes
   trigger it via the one-line additive hook in checkin.jsx saveStore. */try{window.addEventListener('cf-flaremode',()=>cfJournalToFlareSync());setTimeout(()=>cfJournalToFlareSync(),400);}catch(e){}Object.assign(window,{cfJournalToFlareSync});
})();