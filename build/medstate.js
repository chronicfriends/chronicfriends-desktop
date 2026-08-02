(function(){/* ===================================================================
   MEDICATION DOSE STATE (medstate.jsx) — Phase 1 of the adherence task.
   THE single source of truth for reading & writing dose records in
   cf_taken_v2. Loaded BEFORE meds.js / medalarm.js; flareradar & drcf
   read through the guarded window accessors at runtime.

   Record shape (NEW writes):
     cf_taken_v2['YYYY-MM-DD|medId|HH:MM'] =
       { s:'taken'|'skipped'|'snoozed', at:<epochMs>,
         src:'app'|'notification'|'backfill', snz:<count> }
   LEGACY values 'taken' | 'skip' remain valid FOREVER — cfDoseState()
   normalizes both shapes ('skip' → 'skipped'). Lazy read-normalization
   only: no bulk rewrite of stored data, ever.

   Sacred rules:
   • unlogged = KEY ABSENCE. Never write an 'unlogged' record; never
     auto-promote unlogged to skipped — silence is not a missed dose.
   • 'snoozed' is transient bookkeeping (snz count): it must NEVER
     overwrite a taken/skipped resolution, and an abandoned snooze is
     cleared back to key absence (reads as unlogged again).
   • keepEarlier (used by the Phase-2 bridge): an existing taken/skipped
     resolution WINS over a later incoming one.
   =================================================================== */const CF_TAKEN_STORE='cf_taken_v2';function cfTakenRead(){try{return JSON.parse(localStorage.getItem(CF_TAKEN_STORE))||{};}catch(e){return{};}}function cfTakenWrite(map){try{localStorage.setItem(CF_TAKEN_STORE,JSON.stringify(map));}catch(e){}}function cfMedsBroadcast(){try{window.dispatchEvent(new CustomEvent('cf-meds-external'));}catch(e){}}/* THE normalizer — every reader of cf_taken_v2 goes through this. */function cfDoseState(v){if(v==null)return{s:null,at:null,src:null,snz:0};if(typeof v==='string'){if(v==='taken')return{s:'taken',at:null,src:'app',snz:0};if(v==='skip'||v==='skipped')return{s:'skipped',at:null,src:'app',snz:0};return{s:null,at:null,src:null,snz:0};}const s=v.s==='taken'||v.s==='skipped'||v.s==='snoozed'?v.s:null;return{s,at:typeof v.at==='number'&&isFinite(v.at)?v.at:null,src:v.src||'app',snz:Number(v.snz)||0};}function cfDoseStatus(v){return cfDoseState(v).s||'unlogged';}function cfDoseIsResolved(v){const s=cfDoseState(v).s;return s==='taken'||s==='skipped';}/* fresh record for a write, carrying the snooze count forward */function cfDoseRecord(status,src,prev){return{s:status,at:Date.now(),src:src||'app',snz:cfDoseState(prev).snz};}/* a dose the patient has ANSWERED must also stop ringing on the phone.
   The native side holds its own follow-up notifications (+3 / +8 min) for
   every scheduled dose, and the schedule horizon only carries FUTURE doses
   — so a dose resolved after its hour would never leave the horizon and the
   phone would keep ringing. Fire an explicit cancel through the bridge, on
   every resolution, whether the hour has passed or not, without waiting for
   the 4 s sync or a horizon-signature change. Silent no-op in a browser. */function cfDoseAnnounceResolved(key,status){try{if(window.CFMeds&&typeof CFMeds.cancelDose==='function')CFMeds.cancelDose(key,status);}catch(e){}}/* resolve a dose as taken/skipped (writes storage + broadcasts).
   keepEarlier: an existing taken/skipped resolution wins → returns null
   (nothing written); otherwise returns the stored record. opts.snz
   max-merges a caller-reported snooze count (native notifications). */function cfDoseResolve(key,status,src,opts){if(status!=='taken'&&status!=='skipped')return null;const map=cfTakenRead();const prev=cfDoseState(map[key]);if(opts&&opts.keepEarlier&&(prev.s==='taken'||prev.s==='skipped'))return null;map[key]={s:status,at:opts&&typeof opts.at==='number'?opts.at:Date.now(),src:src||'app',snz:Math.max(prev.snz,opts&&Number(opts.snz)||0)};cfTakenWrite(map);cfMedsBroadcast();cfDoseAnnounceResolved(key,status);return map[key];}/* explicit user undo → back to unlogged (key removed) */function cfDoseClear(key){const map=cfTakenRead();if(key in map){delete map[key];cfTakenWrite(map);cfMedsBroadcast();}}/* snooze bookkeeping — never overwrites a resolution */function cfDoseSnoozed(key){const map=cfTakenRead();const prev=cfDoseState(map[key]);if(prev.s==='taken'||prev.s==='skipped')return;map[key]={s:'snoozed',at:Date.now(),src:'app',snz:prev.snz+1};cfTakenWrite(map);cfMedsBroadcast();}/* an abandoned/dismissed snooze reads as unlogged again */function cfDoseUnsnooze(key){const map=cfTakenRead();if(map[key]&&cfDoseState(map[key]).s==='snoozed'){delete map[key];cfTakenWrite(map);cfMedsBroadcast();}}/* ---- med schedule helpers (additive) ---- *//* creation moment: explicit createdAt field, else the m<epochMs> id */function cfMedCreatedAt(med){if(!med)return null;if(typeof med.createdAt==='number'&&isFinite(med.createdAt))return med.createdAt;const t=/^m(\d{12,})$/.exec(String(med.id||''));return t?Number(t[1]):null;}/* earliest day with any dose record for this med — fallback start date */function cfMedFirstLogDate(medId,takenMap){const map=takenMap||cfTakenRead();let first=null;Object.keys(map).forEach(k=>{const p=k.split('|');if(p.length===3&&p[1]===medId&&cfDoseState(map[k]).s&&(!first||p[0]<first))first=p[0];});return first;}/* non-daily cadences are due the day the period completes (same
   accumulator model as the stock engine / alarm engine). PRN entries
   (prn:true) NEVER generate scheduled doses — the user logs them
   manually; they are excluded from every scheduled count. */const CF_MED_PERIOD_DAYS={day:1,week:7,fortnight:15,month:30,'8week':56,'3month':90,'6month':180};function cfMedDueToday(med){if(med.prn)return false;if((med.period||'day')==='day')return true;const interval=CF_MED_PERIOD_DAYS[med.period]||1;return(Number(med.acc)||0)>=(interval-1)/interval-1e-9;}/* ---- schedule reconstruction (single truth for timeline/chart/calendar) ----
   Start day = createdAt (or the m<epochMs> id), else the earliest logged
   dose, else today. Days before it have NO doses. */const cfMedTodayKey=()=>cfDayKey();function cfMedStartDate(m,takenMap){const c=cfMedCreatedAt(m);if(c)return cfDayKey(c);return cfMedFirstLogDate(m.id,takenMap)||cfMedTodayKey();}/* ---- MED6: schedule history -----------------------------------------
   m.sched = [{from:'YYYY-MM-DD', times:[...], seal?:true}] ascending.
   m.times STAYS the schedule in force now, so the alarm, the native
   bridge, the editor and the stock engine are untouched. A segment
   written at a real save is OBSERVED truth; the one written to seal a
   med that had no history yet carries seal:true (assumed past).
   Two rules this must never break: a recorded dose can never disappear,
   and changing the time can never invent retroactive missed doses. */function cfMedSchedGov(m,dateKey){const h=Array.isArray(m.sched)?m.sched.filter(e=>e&&e.from&&Array.isArray(e.times)):[];if(!h.length)return null;let best=null;h.forEach(e=>{if(e.from<=dateKey&&(!best||e.from>=best.from))best=e;});if(!best)h.forEach(e=>{if(!best||e.from<best.from)best=e;});// before the first segment
return best;}/* the schedule in force on a given day (falls back to the current one) */function cfMedSchedTimes(m,dateKey){const g=cfMedSchedGov(m,dateKey);return(g&&g.times||m.times||[]).slice();}/* every time of that day that carries a real record (taken/skipped/snoozed) */function cfMedRecordedTimes(m,dateKey,takenMap){const map=takenMap||{},pre=`${dateKey}|${m.id}|`,out=[];Object.keys(map).forEach(k=>{if(k.indexOf(pre)===0&&cfDoseStatus(map[k])!=='unlogged')out.push(k.slice(pre.length));});return out;}const cfMedMergeTimes=(a,b)=>Array.from(new Set([...(a||[]),...(b||[])])).sort();/* seal + extend the history. PURE — returns the next sched array; the
   only caller is meds.jsx saveMed. Never drops or rewrites a segment. */function cfMedSchedWrite(m,nextTimes,takenMap,todayStr){const today=todayStr||cfMedTodayKey();const times=(nextTimes||[]).slice();let h=Array.isArray(m.sched)&&m.sched.length?m.sched.slice():null;if(!h)h=[{from:cfMedStartDate(m,takenMap||{}),times:(m.times||[]).slice(),seal:true}];h.sort((a,b)=>a.from<b.from?-1:1);const cur=h[h.length-1];const same=(a,b)=>a.length===b.length&&a.every((t,i)=>t===b[i]);if(cur&&same(cur.times||[],times))return h;// unchanged → no new segment
if(cur&&cur.from>=today){h[h.length-1]={from:cur.from,times};return h;}// 2nd edit the same day
h.push({from:today,times});return h;}/* which of a med's dose times were scheduled on a given day — honest rule:
   daily meds: the schedule in force THAT day (MED6), from the start day
   onwards; longer cadences: past schedule can't be reconstructed from the
   accumulator, so past days show only doses that actually have a record,
   and today also shows a dose the engine says is due. */function cfMedDayTimes(m,dateKey,takenMap,todayStr){if(m.active===false)return[];const map=takenMap||{};const logged=t=>cfDoseStatus(map[`${dateKey}|${m.id}|${t}`])!=='unlogged';/* PRN: only doses the user actually recorded — zero phantom schedule */if(m.prn)return(m.times||[]).filter(logged);if(dateKey<cfMedStartDate(m,map))return[];const today=todayStr||cfMedTodayKey();const base=cfMedSchedTimes(m,dateKey);const rec=cfMedRecordedTimes(m,dateKey,map);if((m.period||'day')==='day'){if(dateKey<today){const gov=cfMedSchedGov(m,dateKey);/* past day whose schedule we KNOW (observed segment): schedule ∪
         records — accurate, and a later time change cannot touch it.
         Past day we only ASSUME (no history, or the sealed segment): a
         day with records shows exactly those records (a time change
         must not invent phantom doses); a day with no record keeps the
         assumed schedule, so the denominator never shrinks. */if(gov&&!gov.seal)return cfMedMergeTimes(base,rec);return rec.length?rec.slice().sort():base;}return cfMedMergeTimes(base,rec);}const due=base.filter(t=>logged(t)||dateKey===today&&cfMedDueToday(m));return cfMedMergeTimes(due,rec);}/* display label for a med's dose — empty dose (JIA 'as prescribed'
   activations) never renders a blank. MED7: the number and its unit are
   re-agreed for the active language (cfDoseText — i18nmeds6.jsx), so a
   typed "1 tablets" reads "1 tablet" everywhere the label is shown. */function cfMedDoseLabel(m){const d=m&&m.dose;const s=d?window.tr?tr(d):d:window.tr?tr('as prescribed'):'as prescribed';return d&&window.cfDoseText?cfDoseText(s):s;}/* MED7: THE clock for a scheduled dose time — 12h/24h by language and
   system, same Intl path the rest of the app uses. Never hand-rolled. */function cfFmtDoseTime(t){const[h,mn]=String(t).split(':').map(Number);const loc=window.I18n&&I18n.locale&&I18n.locale()||'en-US';try{return new Date(2000,0,1,h||0,mn||0).toLocaleTimeString(loc,{hour:'numeric',minute:'2-digit'});}catch(e){const ap=(h||0)<12?'AM':'PM';return`${(h||0)%12||12}:${String(mn||0).padStart(2,'0')} ${ap}`;}}Object.assign(window,{cfDoseAnnounceResolved,cfDoseState,cfDoseStatus,cfDoseIsResolved,cfDoseRecord,cfDoseResolve,cfDoseClear,cfDoseSnoozed,cfDoseUnsnooze,cfMedCreatedAt,cfMedFirstLogDate,cfMedDueToday,cfMedStartDate,cfMedDayTimes,cfMedDoseLabel,cfFmtDoseTime,cfMedSchedTimes,cfMedSchedGov,cfMedRecordedTimes,cfMedSchedWrite});
})();