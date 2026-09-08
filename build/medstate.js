(function(){/* ===================================================================
   MEDICATION DOSE STATE (medstate.jsx) — Phase 1 of the adherence task.
   THE single source of truth for reading & writing dose records in
   cf_taken_v2. Loaded BEFORE meds.js / medalarm.js; flareradar & drcf
   read through the guarded window accessors at runtime.

   Record shape (NEW writes):
     cf_taken_v2['YYYY-MM-DD|medId|HH:MM'] =
       { s:'taken'|'skipped'|'snoozed', at:<epochMs>,
         src:'app'|'notification'|'backfill', snz:<count>,
         amt?:<number>, amtU?:'<unit key>' }   ← MED12, optional
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
   =================================================================== */const CF_TAKEN_STORE='cf_taken_v2';function cfTakenRead(){try{return JSON.parse(localStorage.getItem(CF_TAKEN_STORE))||{};}catch(e){return{};}}function cfTakenWrite(map){try{localStorage.setItem(CF_TAKEN_STORE,JSON.stringify(map));}catch(e){}}function cfMedsBroadcast(){try{window.dispatchEvent(new CustomEvent('cf-meds-external'));}catch(e){}}/* ---- MED12: HOW MUCH was really taken (amt / amtU) -----------------
   Two OPTIONAL fields on a dose record, for treatments whose dose is
   not fixed — fast insulin changes units at every meal, and without
   that number the report is useless to the endocrinologist it is made
   for. Built on the same idea as the JIA activations (a dose that is
   not a number: empty dose, shown as 'as prescribed').
     amt  : number  — the amount the patient says they took
     amtU : string  — the unit KEY it is counted in ('unit' for
            injections — insulin units —, otherwise the form's unit
            from MED_FORMS: 'tablet', 'drop', …). A key, never a
            rendered word, so the label re-reads in the active
            language through the MED7 plural engine (i18nmeds6.jsx).

   🔴 The three lines that are never crossed:
   • The number is ALWAYS optional and ALWAYS later. Marking a dose
     taken never waits for it; every reader behaves exactly as before
     when the fields are absent (which is the case for almost every
     dose ever recorded).
   • It is NEVER filled in by us — not copied from yesterday, not from
     the previous dose, not an average. A number the patient did not
     give us ends up in a report a doctor reads (the weight/height
     rule in onboarding.jsx).
   • The app never suggests, calculates or corrects a dose — not from
     glucose, not from carbs, not from anything. It only writes down
     what the patient says they injected.
   Plus: re-marking the same dose as taken KEEPS an amount already
   written; marking it skipped REMOVES it (that dose was not taken).
   And nothing new travels over the native bridge — the med:* contract
   in medbridge.jsx stays exactly as it is. */const CF_DOSE_AMT_MAX=9999;/* accepts '12', '0.5' and '0,5' (comma decimals); anything else → null */function cfDoseAmtNum(v){if(v==null||v==='')return null;const n=typeof v==='number'?v:Number(String(v).replace(',','.').trim());if(!isFinite(n)||n<=0||n>CF_DOSE_AMT_MAX)return null;return Math.round(n*100)/100;}function cfDoseAmtUnit(v){const s=String(v==null?'':v).trim();return s?s.slice(0,24):null;}/* THE normalizer — every reader of cf_taken_v2 goes through this.
   MED12: amt/amtU come back as null when absent, so a reader that
   knows nothing about them is unaffected. Idempotent: feeding it an
   already-normalized state returns the same state. */function cfDoseState(v){if(v==null)return{s:null,at:null,src:null,snz:0,amt:null,amtU:null};if(typeof v==='string'){if(v==='taken')return{s:'taken',at:null,src:'app',snz:0,amt:null,amtU:null};if(v==='skip'||v==='skipped')return{s:'skipped',at:null,src:'app',snz:0,amt:null,amtU:null};return{s:null,at:null,src:null,snz:0,amt:null,amtU:null};}const s=v.s==='taken'||v.s==='skipped'||v.s==='snoozed'?v.s:null;const amt=s==='taken'?cfDoseAmtNum(v.amt):null;// only a taken dose can carry an amount
return{s,at:typeof v.at==='number'&&isFinite(v.at)?v.at:null,src:v.src||'app',snz:Number(v.snz)||0,amt,amtU:amt==null?null:cfDoseAmtUnit(v.amtU)};}function cfDoseStatus(v){return cfDoseState(v).s||'unlogged';}function cfDoseIsResolved(v){const s=cfDoseState(v).s;return s==='taken'||s==='skipped';}/* fresh record for a write, carrying the snooze count forward — and
   (MED12) an amount already written, but only into another 'taken':
   a skip erases it, because that dose was not taken. */function cfDoseRecord(status,src,prev){const p=cfDoseState(prev);const rec={s:status,at:Date.now(),src:src||'app',snz:p.snz};if(status==='taken'&&p.amt!=null){rec.amt=p.amt;if(p.amtU)rec.amtU=p.amtU;}return rec;}/* a dose the patient has ANSWERED must also stop ringing on the phone.
   The native side holds its own follow-up notifications (+3 / +8 min) for
   every scheduled dose, and the schedule horizon only carries FUTURE doses
   — so a dose resolved after its hour would never leave the horizon and the
   phone would keep ringing. Fire an explicit cancel through the bridge, on
   every resolution, whether the hour has passed or not, without waiting for
   the 4 s sync or a horizon-signature change. Silent no-op in a browser. */function cfDoseAnnounceResolved(key,status){try{if(window.CFMeds&&typeof CFMeds.cancelDose==='function')CFMeds.cancelDose(key,status);}catch(e){}}/* resolve a dose as taken/skipped (writes storage + broadcasts).
   keepEarlier: an existing taken/skipped resolution wins → returns null
   (nothing written); otherwise returns the stored record. opts.snz
   max-merges a caller-reported snooze count (native notifications). */function cfDoseResolve(key,status,src,opts){if(status!=='taken'&&status!=='skipped')return null;const map=cfTakenRead();const prev=cfDoseState(map[key]);if(opts&&opts.keepEarlier&&(prev.s==='taken'||prev.s==='skipped'))return null;map[key]={s:status,at:opts&&typeof opts.at==='number'?opts.at:Date.now(),src:src||'app',snz:Math.max(prev.snz,opts&&Number(opts.snz)||0)};/* MED12: an amount already written survives another 'taken' (the
     alarm, the notification and a second tap all land here); a skip
     drops it — that dose was not taken. Never invented, never moved. */if(status==='taken'&&prev.amt!=null){map[key].amt=prev.amt;if(prev.amtU)map[key].amtU=prev.amtU;}cfTakenWrite(map);cfMedsBroadcast();cfDoseAnnounceResolved(key,status);return map[key];}/* explicit user undo → back to unlogged (key removed) */function cfDoseClear(key){const map=cfTakenRead();if(key in map){delete map[key];cfTakenWrite(map);cfMedsBroadcast();}}/* snooze bookkeeping — never overwrites a resolution */function cfDoseSnoozed(key){const map=cfTakenRead();const prev=cfDoseState(map[key]);if(prev.s==='taken'||prev.s==='skipped')return;map[key]={s:'snoozed',at:Date.now(),src:'app',snz:prev.snz+1};cfTakenWrite(map);cfMedsBroadcast();}/* an abandoned/dismissed snooze reads as unlogged again */function cfDoseUnsnooze(key){const map=cfTakenRead();if(map[key]&&cfDoseState(map[key]).s==='snoozed'){delete map[key];cfTakenWrite(map);cfMedsBroadcast();}}/* ---- MED12 writer: the amount the patient says they took ------------
   Lands ONLY on a dose that is ALREADY resolved as taken — the number
   is an addition after the fact, never a condition for logging the
   dose — and returns false without writing anything otherwise (no
   record is ever created here). An empty amount REMOVES it (edit or
   delete by tapping again). Unparseable input leaves the record
   untouched. Nothing is sent to the native bridge. */function cfDoseAmount(key,amt,unit){const map=cfTakenRead();const prev=cfDoseState(map[key]);if(prev.s!=='taken')return false;const clearing=amt==null||amt==='';const n=clearing?null:cfDoseAmtNum(amt);if(!clearing&&n==null)return false;// garbage in → nothing written
const raw=map[key];const rec=raw&&typeof raw==='object'?Object.assign({},raw):{s:'taken',src:prev.src||'app',snz:prev.snz};rec.s='taken';if(n==null){delete rec.amt;delete rec.amtU;}else{rec.amt=n;const u=cfDoseAmtUnit(unit)||prev.amtU;if(u)rec.amtU=u;else delete rec.amtU;}map[key]=rec;cfTakenWrite(map);cfMedsBroadcast();return true;}/* "12 units" — the stored unit KEY re-rendered for that number in the
   active language (MED7 plural engine). A unit we don't ship is shown
   exactly as stored, like cfDoseText does with a typed dose. Takes a
   raw record or an already-normalized state; '' when there is nothing
   written (never a placeholder number). */function cfDoseAmountText(v){const st=cfDoseState(v);if(st.amt==null)return'';const loc=window.I18n&&I18n.locale&&I18n.locale()||'en-US';let num;try{num=st.amt.toLocaleString(loc);}catch(e){num=String(st.amt);}const known=!!(window.CF_DOSE_UNITS&&CF_DOSE_UNITS.en&&st.amtU&&CF_DOSE_UNITS.en[st.amtU]);const word=known&&window.cfDoseUnitWord?cfDoseUnitWord(st.amtU,st.amt):st.amtU||'';return word?`${num} ${word}`:num;}/* ---- MED12: a medication whose dose is not fixed --------------------
   m.varDose — the patient's own switch ('The dose changes each time').
   Its dose stays EMPTY and reads 'as prescribed' (the JIA rule), and
   every taken dose can carry the real amount. The default is only a
   suggestion at activation time, for the insulins in the catalogue;
   the patient can always switch it off and type a fixed dose. */const CF_VAR_DOSE_CLASSES=['Basal insulin','Rapid-acting insulin','Ultra-long basal insulin','Intermediate basal insulin','Short-acting insulin'];function cfMedVarDose(m){return!!(m&&m.varDose);}function cfMedVarDoseDefault(m){return!!(m&&CF_VAR_DOSE_CLASSES.indexOf(m.cls)>=0);}/* the unit an amount is counted in: injections are counted in UNITS
   (insulin), every other form in its own MED_FORMS unit. Read lazily
   off window so this file keeps loading first. */function cfMedAmountUnit(m){if(!m)return'dose';if(m.form==='injection')return'unit';const forms=window.MED_FORMS||[];for(let i=0;i<forms.length;i++)if(forms[i].key===m.form)return forms[i].unit||'dose';return'dose';}/* ---- med schedule helpers (additive) ---- *//* creation moment: explicit createdAt field, else the m<epochMs> id */function cfMedCreatedAt(med){if(!med)return null;if(typeof med.createdAt==='number'&&isFinite(med.createdAt))return med.createdAt;const t=/^m(\d{12,})$/.exec(String(med.id||''));return t?Number(t[1]):null;}/* earliest day with any dose record for this med — fallback start date */function cfMedFirstLogDate(medId,takenMap){const map=takenMap||cfTakenRead();let first=null;Object.keys(map).forEach(k=>{const p=k.split('|');if(p.length===3&&p[1]===medId&&cfDoseState(map[k]).s&&(!first||p[0]<first))first=p[0];});return first;}/* non-daily cadences are due the day the period completes (same
   accumulator model as the stock engine / alarm engine). PRN entries
   (prn:true) NEVER generate scheduled doses — the user logs them
   manually; they are excluded from every scheduled count. */const CF_MED_PERIOD_DAYS={day:1,week:7,fortnight:15,month:30,'8week':56,'3month':90,'6month':180};function cfMedDueToday(med){if(med.prn)return false;if((med.period||'day')==='day')return true;const interval=CF_MED_PERIOD_DAYS[med.period]||1;return(Number(med.acc)||0)>=(interval-1)/interval-1e-9;}/* MED22 — HOW MANY DAYS UNTIL THE PERIOD COMPLETES (0 = due today, null =
   never scheduled). Same accumulator arithmetic as cfMedDueToday, so the two
   can never disagree: days === 0 ⇔ cfMedDueToday === true. It lived only
   inside the native notification bridge (medbridge.jsx mbDaysUntilDue),
   which is why the «next dose» resolver could not tell whether a weekly
   injection was due tomorrow — and a screen that says «nothing scheduled»
   while the phone has a reminder set for tomorrow is the MED22 defect in a
   mirror. ONE implementation, here, where the period already lives. */function cfMedDaysUntilDue(med){if(!med||med.prn)return null;if((med.period||'day')==='day')return 0;const interval=CF_MED_PERIOD_DAYS[med.period]||1;return Math.max(0,Math.ceil(interval-1-(Number(med.acc)||0)*interval-1e-9));}/* ---- schedule reconstruction (single truth for timeline/chart/calendar) ----
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
h.push({from:today,times});return h;}/* ===== MED16 — A TREATMENT THAT STEPS DOWN AND ENDS ==================
   Real treatments taper: the doctor prescribes a dose that steps down
   over weeks and then stops. m.taper holds EXACTLY what the patient
   typed from their own doctor's plan:

     m.taper = { start:'YYYY-MM-DD',
                 steps:[{days:7, perDay:8}, …],
                 end:'YYYY-MM-DD',                  ← computed, last day
                 spread:{from:'08:00', to:'22:00'} } ← waking window

   🔴 THE GOLDEN RULE — the app never proposes a schedule. No suggested
   tapers, no pre-filled example doses, no "recommended" anything, no
   default step values. Same rule as the no-invented-patient-data policy:
   a dosing suggestion from us would be medical advice. The only thing
   computed here is the arithmetic the patient would otherwise do on
   paper — total length, end date, and the hours the doses they typed
   are spread across.

   m.taper is the source of truth for the UI. The ENGINE keeps reading
   m.sched / m.times exactly as before (MED6): one dated segment per
   step, generated from the taper. Nothing downstream had to learn a new
   concept — cfMedSchedGov already resolves dated future segments. */const CF_TAPER_MAX_STEPS=12,CF_TAPER_MAX_DAYS=400,CF_TAPER_MAX_PERDAY=24;const CF_TAPER_SPREAD={from:'08:00',to:'22:00'};// a waking window, never a dose
function cfDayPlus(dateKey,n){const d=new Date(String(dateKey)+'T00:00:00Z');if(isNaN(d.getTime()))return dateKey;d.setUTCDate(d.getUTCDate()+(Number(n)||0));return d.toISOString().slice(0,10);}const cfDayDiff=(a,b)=>Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000);const cfTaperMin=t=>{const p=String(t||'').split(':');return Math.max(0,Math.min(1439,(Number(p[0])||0)*60+(Number(p[1])||0)));};const cfTaperHM=m=>`${String(Math.floor(m/60)%24).padStart(2,'0')}:${String(Math.round(m)%60).padStart(2,'0')}`;/* THE spread — n doses across the waking window. ONE implementation,
   shared by the editor preview, the generated segments and the daily
   reconciliation; never a second one. Where the app already has an
   agreed spread for that many doses a day (DEFAULT_TIMES, meds.jsx) and
   the window is untouched, that existing spread is what you get, so a
   taper step reads like every other schedule in the app. */function cfSpreadTimes(n,from,to){const c=Math.max(0,Math.min(CF_TAPER_MAX_PERDAY,Math.round(Number(n)||0)));if(!c)return[];const f=cfTaperMin(from||CF_TAPER_SPREAD.from),t1=cfTaperMin(to||CF_TAPER_SPREAD.to);const dflt=window.CF_DEFAULT_TIMES;/* 🔴 THE SHORT-CIRCUIT STAYS. The app's agreed spread for that many doses a
     day comes first, and is taken only when every one of those hours really
     falls inside the window (MED19: DEFAULT_TIMES[6] opens at 07:00, an hour
     before the default window, and a dose outside the patient's window is
     exactly the bug that was fixed).
     Do NOT "fix" this into absolute anchoring later: the invariant is INSIDE
     THE WINDOW, and anchoring at both ends is only how we get there when
     there is no agreed spread to reuse. Anchoring 2/day on a taper would
     give 08:00/22:00 while the same medication without a taper keeps
     09:00/21:00 — two different schedules for the same frequency. */if(dflt&&dflt[c]&&f===cfTaperMin(CF_TAPER_SPREAD.from)&&t1===cfTaperMin(CF_TAPER_SPREAD.to)&&dflt[c].every(t=>cfTaperMin(t)>=f&&cfTaperMin(t)<=t1))return dflt[c].slice();if(c===1)return[cfTaperHM(f)];/* MED19 — BOTH ENDS ARE ANCHORS. The first dose is always at `from`, the
     last always at `to`; only the doses in between are rounded (to 5 min).
     Nothing may ever land outside the window the patient chose — they may
     have picked 22:00 because that is when they go to bed. *//* A REVERSED WINDOW (Until earlier than From, e.g. 22:00 → 08:00) is used as
     the interval BETWEEN the two hours typed: the earlier one becomes the
     first anchor, the later one the last. Deliberate, and pinned by
     cfTaperSelfTest — no patient sets one today, and what must never happen
     is several doses landing on the same minute (they would share one dose
     key, so only one of them could ever be logged). Overnight windows are
     not a feature; if they ever become one they need their own model. */const first=Math.min(f,t1),last=Math.max(f,t1);// the two hours typed, in order
const mins=[first];for(let i=1;i<c-1;i++)mins.push(Math.round((first+(last-first)*i/(c-1))/5)*5);mins.push(last);/* strictly ascending without moving the anchors: the forward pass pushes a
     collision later, the backward pass resolves a collision near the end by
     moving the EARLIER dose earlier — never the last one past `to`. */for(let i=1;i<c-1;i++)mins[i]=Math.max(mins[i-1]+1,Math.min(last-1,mins[i]));for(let i=c-2;i>=1;i--)mins[i]=Math.min(mins[i+1]-1,mins[i]);return mins.map(m=>cfTaperHM(Math.max(first,Math.min(last,m))));}/* ---------- MED19 self-test (pure; run headless or from the console) ----------
   Pins the spread invariants so a later edit cannot quietly put a dose back
   outside the patient's window. cfTaperSelfTest().pass must stay true. */function cfTaperSelfTest(){const mn=t=>cfTaperMin(t),fails=[];const dflt=window.CF_DEFAULT_TIMES||{};let checked=0;[['08:00','22:00'],['09:00','19:00'],['07:30','23:00'],['06:00','23:55'],['10:00','14:00']].forEach(([f,t])=>{for(let n=2;n<=CF_TAPER_MAX_PERDAY;n++){const o=cfSpreadTimes(n,f,t);const isDflt=JSON.stringify(o)===JSON.stringify(dflt[n]||[]);const inside=o.every(x=>mn(x)>=mn(f)&&mn(x)<=mn(t));// THE invariant
const asc=o.every((x,i)=>i===0||mn(x)>mn(o[i-1]));// ascending ⇒ no duplicates
const anchored=o[0]===f&&o[o.length-1]===t;// unless the agreed spread applies
checked++;if(!(o.length===n&&inside&&asc&&(anchored||isDflt)))fails.push(`${f}-${t} n=${n}: ${o.join(' ')}`);}});/* the short-circuit itself: the agreed spread is reused when it fits, and
     refused when one of its hours is outside (DEFAULT_TIMES[6] starts 07:00) */if(dflt[2]&&JSON.stringify(cfSpreadTimes(2,'08:00','22:00'))!==JSON.stringify(dflt[2]))fails.push('short-circuit n=2 not reused');if(dflt[6]&&JSON.stringify(cfSpreadTimes(6,'08:00','22:00'))===JSON.stringify(dflt[6]))fails.push('short-circuit n=6 reused a 07:00 dose');/* a reversed window: the interval between the two hours typed, and never
     two doses on the same minute */const rev=cfSpreadTimes(4,'22:00','08:00');if(rev.join(' ')!=='08:00 12:40 17:20 22:00')fails.push('reversed window: '+rev.join(' '));if(new Set(rev).size!==rev.length)fails.push('reversed window collided on one minute');/* the two ends of the range */if(JSON.stringify(cfSpreadTimes(1,'09:30','19:00'))!==JSON.stringify(['09:30']))fails.push('n=1 is not [from]');if(cfSpreadTimes(0,'08:00','22:00').length)fails.push('n=0 is not empty');return{pass:!fails.length,checked,fails};}/* sanitize what the patient typed — an incomplete step is simply not a
   step yet (never completed for them, never given a default) */function cfTaperNorm(t){if(!t||!Array.isArray(t.steps))return null;const steps=t.steps.map(s=>({days:Math.round(Number(s&&s.days)||0),perDay:Math.round(Number(s&&s.perDay)||0)})).filter(s=>s.days>0&&s.perDay>0&&s.days<=CF_TAPER_MAX_DAYS&&s.perDay<=CF_TAPER_MAX_PERDAY).slice(0,CF_TAPER_MAX_STEPS);if(!steps.length)return null;const start=/^\d{4}-\d{2}-\d{2}$/.test(String(t.start||''))?t.start:cfMedTodayKey();const sp=t.spread||{};const spread={from:/^\d{2}:\d{2}$/.test(String(sp.from||''))?sp.from:CF_TAPER_SPREAD.from,to:/^\d{2}:\d{2}$/.test(String(sp.to||''))?sp.to:CF_TAPER_SPREAD.to};const total=steps.reduce((a,s)=>a+s.days,0);return{start,steps,spread,end:cfDayPlus(start,total-1),total};}const cfTaperTotalDays=t=>{const n=cfTaperNorm(t);return n?n.total:0;};const cfTaperEnd=t=>{const n=cfTaperNorm(t);return n?n.end:null;};/* the step governing a day → {i, days, perDay, from, times, dayInStep} */function cfTaperStepAt(t,dateKey){const n=cfTaperNorm(t);if(!n||dateKey<n.start||dateKey>n.end)return null;let off=cfDayDiff(n.start,dateKey),acc=0;for(let i=0;i<n.steps.length;i++){const s=n.steps[i];if(off<acc+s.days)return{i,days:s.days,perDay:s.perDay,from:cfDayPlus(n.start,acc),dayInStep:off-acc+1,times:cfSpreadTimes(s.perDay,n.spread.from,n.spread.to)};acc+=s.days;}return null;}/* 1-based day number inside the treatment (0 = outside it) */function cfTaperDayIndex(t,dateKey){const n=cfTaperNorm(t);if(!n||dateKey<n.start||dateKey>n.end)return 0;return cfDayDiff(n.start,dateKey)+1;}const cfTaperDayTimes=(t,dateKey)=>{const s=cfTaperStepAt(t,dateKey);return s?s.times.slice():[];};/* one dated segment per step + an empty one before it starts and after it
   ends, so nothing the patient did not plan ever rings */function cfTaperSegments(t,todayStr){const n=cfTaperNorm(t);if(!n)return[];const today=todayStr||cfMedTodayKey();const out=[];if(n.start>today)out.push({from:today,times:[]});// nothing until the treatment begins
let acc=0;n.steps.forEach(s=>{out.push({from:cfDayPlus(n.start,acc),times:cfSpreadTimes(s.perDay,n.spread.from,n.spread.to)});acc+=s.days;});out.push({from:cfDayPlus(n.end,1),times:[]});// the treatment is over
return out;}/* THE taper writer — sibling of cfMedSchedWrite, which stays exactly as
   it is (other callers depend on it). PURE: returns the next sched array.
   Invariants:
   • past segments are never rewritten, reordered or dropped — whatever
     governed a day that has already happened keeps governing it;
   • segments from today onwards are REPLACED by the newly generated
     series (editing a taper mid-treatment must not leave stale future
     segments piling up alongside the new ones);
   • cf_taken_v2 is never touched — adherence already recorded never
     changes;
   • the array stays sorted ascending by `from`. */function cfMedTaperWrite(m,taper,takenMap,todayStr){const today=todayStr||cfMedTodayKey();const past=(Array.isArray(m&&m.sched)?m.sched:[]).filter(e=>e&&e.from&&Array.isArray(e.times)&&e.from<today);const n=cfTaperNorm(taper);let next=[];if(n){next=cfTaperSegments(n,today).filter(seg=>seg.from>=today);/* a plan that began before today: the step covering today is pinned
       at today, so the new plan governs from now on and not one day of
       recorded history moves */const gov=cfTaperStepAt(n,today);if(gov&&gov.from<today)next.unshift({from:today,times:gov.times});else if(!gov&&n.end<today)next.unshift({from:today,times:[]});}const out=past.concat(next);out.sort((a,b)=>a.from<b.from?-1:a.from>b.from?1:0);return out;}const cfMedHasTaper=m=>!!(m&&m.taper&&cfTaperNorm(m.taper));const cfMedTaperOver=(m,todayStr)=>{const n=cfTaperNorm(m&&m.taper);return!!n&&(todayStr||cfMedTodayKey())>n.end;};/* ADVANCING THE LIVE SCHEDULE — the one thing that must not be missed.
   m.times is "the schedule in force NOW" and both the alarm engine and
   the native bridge read it directly; without this the phone would keep
   ringing 8 times a day into week two. Runs on app load and on day
   change. PURE (returns {meds, changed}), idempotent, silent, no
   notification of its own — and it never writes a dose record. Same
   spirit as the stock reconciliation. */function cfMedTaperReconcile(meds,todayStr){const today=todayStr||cfMedTodayKey();let changed=false;const out=(meds||[]).map(m=>{if(!m||m.active===false||!cfMedHasTaper(m))return m;/* the treatment is complete: deactivate but NEVER delete — the exact
       path deleteMed uses, so it drops back into the catalogue list and
       can be re-activated. taperDone carries the closing message. */if(cfMedTaperOver(m,today)){changed=true;return{...m,active:false,reminders:false,times:[],taperDone:cfTaperEnd(m.taper)};}const want=cfMedSchedTimes(m,today);const cur=m.times||[];const same=want.length===cur.length&&want.every((x,i)=>x===cur[i]);if(same&&(m.period||'day')==='day'&&(!want.length||Number(m.freq)===want.length))return m;changed=true;return{...m,times:want.slice(),freq:want.length||m.freq,period:'day'};});return{meds:out,changed};}/* units per dose, parsed from the dose text ('2 tablets' → 2) — the same
   reading meds.jsx and the bridge already use */const cfDoseUnits=dose=>{const m=/([\d.]+)/.exec(dose||'');const n=m?parseFloat(m[1]):1;return!isFinite(n)||n<=0?1:n;};/* STOCK against the WHOLE taper, not today's rate: 8 drops a day this
   week, 2 next — a 5 ml bottle (~100 drops) empties around day 12 of a
   5-week plan. The stock RULE is untouched (taken & unlogged consume,
   skipped stays in the box); this only projects the doses the plan still
   has ahead, so the warning arrives early enough to reach a pharmacy.
   → {needed, runsOut, daysLeft, covers, shortDays} | null */function cfMedTaperStock(m,takenMap,todayStr){const n=cfTaperNorm(m&&m.taper);if(!n)return null;const today=todayStr||cfMedTodayKey();const map=takenMap||{};const units=cfMedUnitsPerDose(m);let stock=Number(m.stock)||0,needed=0,runsOut=null;let day=today<n.start?n.start:today;for(let guard=0;guard<CF_TAPER_MAX_DAYS+2&&day<=n.end;guard++,day=cfDayPlus(day,1)){let times=cfTaperDayTimes(n,day);/* today's doses already resolved are already accounted for: a taken
       one was deducted at tap time, a skipped one stays in the box */if(day===today)times=times.filter(t=>!cfDoseIsResolved(map[`${day}|${m.id}|${t}`]));const use=times.length*units;needed+=use;if(runsOut==null&&use>0&&stock-use<0)runsOut=day;stock=stock-use;}return{needed,runsOut,covers:runsOut==null,daysLeft:runsOut?Math.max(0,cfDayDiff(today,runsOut)):Math.max(0,cfDayDiff(today,n.end)+1),shortDays:runsOut?Math.max(0,cfDayDiff(runsOut,n.end)+1):0};}/* which of a med's dose times were scheduled on a given day — honest rule:
   daily meds: the schedule in force THAT day (MED6), from the start day
   onwards; longer cadences: past schedule can't be reconstructed from the
   accumulator, so past days show only doses that actually have a record,
   and today also shows a dose the engine says is due. */function cfMedDayTimes(m,dateKey,takenMap,todayStr){if(m.active===false)return[];const map=takenMap||{};const logged=t=>cfDoseStatus(map[`${dateKey}|${m.id}|${t}`])!=='unlogged';/* PRN: only doses the user actually recorded — zero phantom schedule */if(m.prn)return(m.times||[]).filter(logged);if(dateKey<cfMedStartDate(m,map))return[];const today=todayStr||cfMedTodayKey();const base=cfMedSchedTimes(m,dateKey);const rec=cfMedRecordedTimes(m,dateKey,map);if((m.period||'day')==='day'){if(dateKey<today){const gov=cfMedSchedGov(m,dateKey);/* past day whose schedule we KNOW (observed segment): schedule ∪
         records — accurate, and a later time change cannot touch it.
         Past day we only ASSUME (no history, or the sealed segment): a
         day with records shows exactly those records (a time change
         must not invent phantom doses); a day with no record keeps the
         assumed schedule, so the denominator never shrinks. */if(gov&&!gov.seal)return cfMedMergeTimes(base,rec);return rec.length?rec.slice().sort():base;}return cfMedMergeTimes(base,rec);}const due=base.filter(t=>logged(t)||dateKey===today&&cfMedDueToday(m));return cfMedMergeTimes(due,rec);}/* ---- MED17: WHICH EYE ------------------------------------------------
   m.eye = 'right' | 'left' | 'both' | null. null is the DEFAULT and a
   legitimate final answer ("not specified") — exactly like the null
   weight/height/age of PROFILE_DEFAULT. It is never inferred, never
   guessed from the condition or the molecule, and never silently
   promoted to 'both': anterior uveitis is usually ONE eye, and the side
   is a clinical fact about the patient that only the patient has.
   The four labels are shared keys — the episode log will reuse them. */const CF_MED_EYES=['right','left','both'];const cfMedEye=m=>m&&CF_MED_EYES.indexOf(m.eye)>=0?m.eye:null;function cfMedEyeLabel(eye){const k=CF_MED_EYES.indexOf(eye)>=0?eye:null;if(!k)return'';const s=k==='right'?'Right eye':k==='left'?'Left eye':'Both eyes';return window.tr?tr(s):s;}/* display label for a med's dose — empty dose (JIA 'as prescribed'
   activations, and every eye drop, whose side and count we never invent)
   never renders a blank. MED7: the number and its unit are re-agreed for
   the active language (cfDoseText — i18nmeds6.jsx), so a typed "1 tablets"
   reads "1 tablet" everywhere the label is shown. MED17: the eye is
   resolved HERE, in the one generator every surface reads (card, alarm,
   timeline, treatment view, PDF), and it is composed through a
   translatable pattern — never glued on with +, because the order and the
   agreement differ by language. m.eye === null renders exactly as before,
   with no suffix: absence is printed as absence. */function cfMedDoseLabel(m){const d=m&&m.dose;const s=d?window.tr?tr(d):d:window.tr?tr('as prescribed'):'as prescribed';const base=d&&window.cfDoseText?cfDoseText(s):s;const eye=cfMedEyeLabel(cfMedEye(m));if(!eye)return base;return window.trf?trf('{dose} · {eye}',{dose:base,eye}):base+' · '+eye;}/* MED17 — how many units ONE dose really consumes. unitsOf() reads the
   first number in the dose text, which is right for a tablet and wrong
   for a bottle: a drop in BOTH eyes is two drops out of the bottle. With
   ~100 drops in a 5 ml bottle at 8 doses a day that is the difference
   between running out on day 12 and believing you have until day 24.
   'both' → 2× the typed number; 'right'/'left'/null → the typed number
   (today's behaviour, unchanged for every existing account). The stock
   RULE (MED8) is untouched — only the units-per-dose figure changes. */function cfMedUnitsPerDose(m){const n=cfDoseUnits(m&&m.dose);return cfMedEye(m)==='both'?n*2:n;}/* MED7: THE clock for a scheduled dose time — 12h/24h by language and
   system, same Intl path the rest of the app uses. Never hand-rolled. */function cfFmtDoseTime(t){const[h,mn]=String(t).split(':').map(Number);const loc=window.I18n&&I18n.locale&&I18n.locale()||'en-US';try{return new Date(2000,0,1,h||0,mn||0).toLocaleTimeString(loc,{hour:'numeric',minute:'2-digit'});}catch(e){const ap=(h||0)<12?'AM':'PM';return`${(h||0)%12||12}:${String(mn||0).padStart(2,'0')} ${ap}`;}}Object.assign(window,{cfDoseAnnounceResolved,cfDoseState,cfDoseStatus,cfDoseIsResolved,cfDoseRecord,cfDoseResolve,cfDoseClear,cfDoseSnoozed,cfDoseUnsnooze,cfMedCreatedAt,cfMedFirstLogDate,cfMedDueToday,cfMedDaysUntilDue,cfMedStartDate,cfMedDayTimes,cfMedDoseLabel,cfFmtDoseTime,cfMedSchedTimes,cfMedSchedGov,cfMedRecordedTimes,cfMedSchedWrite,/* MED12 — the real amount taken */cfDoseAmount,cfDoseAmountText,cfDoseAmtNum,cfMedVarDose,cfMedVarDoseDefault,cfMedAmountUnit,CF_VAR_DOSE_CLASSES,/* MED16 — the step-down treatment */cfDayPlus,cfDayDiff,cfSpreadTimes,cfTaperNorm,cfTaperTotalDays,cfTaperEnd,cfTaperStepAt,cfTaperDayIndex,cfTaperDayTimes,cfTaperSelfTest,cfTaperSegments,cfMedTaperWrite,cfMedHasTaper,cfMedTaperOver,cfMedTaperReconcile,cfMedTaperStock,cfDoseUnits,CF_TAPER_SPREAD,CF_TAPER_MAX_STEPS,/* MED17 — which eye, and what a dose really takes out of the bottle */CF_MED_EYES,cfMedEye,cfMedEyeLabel,cfMedUnitsPerDose});
})();