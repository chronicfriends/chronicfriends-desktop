(function(){/* ===================================================================
   MEDICATION NATIVE BRIDGE GLUE (medbridge.jsx) — Phase 2.
   window.CFMeds — web-side glue for the Expo shell's OS notifications
   with action buttons (Taken / Snooze / Skipped) while the app is
   closed. Web-side ONLY: schedule horizon out, resolutions in.

   Web → native  (window.ReactNativeWebView.postMessage(JSON string)):
     {t:'med:ready'}                          once, on load
     {t:'med:cancel', logId}                  a dose was answered inside the
        app: drop every notification the phone still holds for it (the due
        alarm and its +3 / +8 min follow-ups). Sent the moment cfDoseResolve
        writes taken/skipped — past-hour doses included, independent of the
        4s cycle and of the horizon signature.
     {t:'med:schedule', v:2, doses:[{logId, medId, name, dose, timeISO, groupId,
        secure:{name,dose}}], groups:[{id, kind:'dose'|'am'|'pm', timeISO, n,
        title, body, logIds, expire}]}
        the FULL next-7-days horizon, re-sent IN FULL on load and on
        every schedule-affecting change (med add/edit/delete/toggle,
        time/dose change, resolutions, language change) — detected via
        a horizon signature checked every 4s + on 'cf-meds-external'.
        MED16: `groups` is what the phone SHOWS — one notification per
        time (never per medication), neutral title/body plus the count,
        with ONE exception in the groupId (MED20, 19 Aug 2026): a dose
        carrying a live re-alert (snoozed, or "I'll take it now") gets
        `|@<effective minute>` appended to its groupId, so it never rides
        inside the notification of the doses still firing at the original
        hour — the group keeps the EARLIEST timeISO of its members, so
        sharing a group would ring the snoozed dose back early and lose
        the snooze. Two doses re-alerted to the same minute still group
        together, and a dose without a re-alert keeps the plain
        `g|<day>|<time>` id, byte for byte. Never "simplify" the suffix
        away. The native side treats the groupId as an OPAQUE label
        (equality, storage key, echoed back in med:open), so a longer id
        breaks nothing there.
        and `expire` naming the earlier unanswered notifications of the
        same medication that day, which are dropped from the tray when
        this one fires (the dose record is untouched — silence is not a
        missed dose). `doses` keeps the v1 shape for per-logId cancel and
        the +3/+8 min follow-ups; its visible fields carry the same
        neutral text, so no shell can leak a medication name.
        name/dose are localized AT SEND TIME (native shows verbatim).
     {t:'med:clear'}                          when no schedulable med remains
     {t:'med:perm:request'}                   only from the app's own
        notification UI — the existing cfEnableNotifications() opt-in
        (AlarmSetupCard / Settings) is wrapped, never called cold.

   NH1 — "Will your reminders reach you?" (notifhealth.jsx). This glue
   only carries the messages; it never schedules or cancels anything:
     {t:'med:health:check'}                   read the delivery state
     {t:'med:exact:request'}                  open the OS exact-alarms screen
     {t:'med:battery:request'}                open the app's battery settings
     {t:'med:settings:open'}                  open the app's notification settings
     {t:'med:test', mode:'1min'|'15min'}      one test reminder
   All five fire ONLY from a tap on that screen — never on open, never
   automatically.

   Native → web  (shell injects window.CFMeds._recv(payload)):
     {t:'med:resolved', items:[{logId, medId, action:'taken'|'skipped',
        respondedAtISO, snoozeCount, source:'notification'}]}
        → cfDoseResolve(logId, …, {keepEarlier:true}) on the SAME store
        the in-app alarm uses. Dedup: an earlier taken/skipped
        resolution wins; nothing but taken/skipped is ever applied, so
        a snooze can never overwrite a resolution. Every apply
        broadcasts 'cf-meds-external' → meds view / dose log / hero /
        journal / radar refresh in the same render cycle, no reload.
     {t:'med:perm', granted:bool} → reflected in the notification
        settings UI via the existing cf_notif_* stores + 'cf-notif'.
     {t:'med:health', platform, osMajor, notif, exact, battery, channel,
        scheduled, nextAt, vendor} → handed straight to
        CFNotifHealth._recvHealth (notifhealth.jsx), read lazily off
        window so load order never matters. Kept in memory only, and a
        value we are not given is never painted.
     {t:'med:test:scheduled', mode, atISO} → CFNotifHealth._recvTest,
        so the screen can say the exact minute it will ring.
     {t:'med:open', groupId, logIds} → MED20: the patient tapped the BODY
        of a grouped notification. window.cfMedOpenDoses(logIds)
        (medalarm.jsx) opens the alarm screen those doses already have,
        WITHOUT sound — nothing is written, and a list whose doses were
        already answered opens nothing at all. Empty logIds (a tap on a
        day-summary notification) → the doses due right now.

   logId IS the internal dose key 'YYYY-MM-DD|medId|HH:MM' — 1:1, no
   separate id namespace.

   In a plain browser (no window.ReactNativeWebView) every outbound
   call is a SILENT NO-OP and _recv is simply never called. The in-app
   alarm engine (medalarm.jsx) is untouched and un-degraded either way;
   with the bridge present the native side suppresses OS banners while
   the app is open, so there is no double ring.
   =================================================================== */const MB_PERIOD_DAYS={day:1,week:7,fortnight:15,month:30,'8week':56,'3month':90,'6month':180};const mbRead=(k,fb)=>{try{return JSON.parse(localStorage.getItem(k))||fb;}catch(e){return fb;}};const mbUnitsOf=dose=>{const m=/([\d.]+)/.exec(dose||'');const n=m?parseFloat(m[1]):1;return!isFinite(n)||n<=0?1:n;};const mbTodayKey=()=>cfDayKey();function mbPresent(){try{return!!(window.ReactNativeWebView&&typeof ReactNativeWebView.postMessage==='function');}catch(e){return false;}}function mbPost(obj){if(!mbPresent())return;try{ReactNativeWebView.postMessage(JSON.stringify(obj));}catch(e){}}/* days until a non-daily med's period completes (same accumulator model
   as the stock/alarm engines; 0 = due today) */function mbDaysUntilDue(m){if((m.period||'day')==='day')return 0;const interval=MB_PERIOD_DAYS[m.period]||1;return Math.max(0,Math.ceil(interval-1-(Number(m.acc)||0)*interval-1e-9));}/* MED3/MED5: re-avisos vivos escritos por medalarm.jsx — el móvil los tiene que
   conocer, o mueren al cerrar la app. Devuelven epoch ms, o 0 si no hay. */function mbSnoozeUntil(logId){try{const s=mbRead('cf_alarm_snooze_v1',{});const t=s&&s[logId];return typeof t==='number'&&isFinite(t)?t:0;}catch(e){return 0;}}function mbPendingUntil(logId){try{const p=mbRead('cf_alarm_pending_v1',{});const t=p&&p[logId]&&Number(p[logId].at);return typeof t==='number'&&isFinite(t)?t:0;}catch(e){return 0;}}/* ---- MED16: the three notification fixes, in every reminder mode ----
   A taper of 8 drops/day plus a second drop 4×/day queues 84 notifications
   a week, and every ignored one stays in the tray. So:
   (a) ONE NOTIFICATION PER TIME, not per medication. Doses that share an
       hour become a single `group` saying how many are due; opening it
       leads to the grouped alarm screen the app already has (medalarm.jsx).
   (b) UNANSWERED NOTIFICATIONS EXPIRE. Each group carries `expire`: the
       logIds of earlier unanswered notifications for the SAME medication
       that day, which the shell drops from the tray when this one fires.
       The dose record stays UNLOGGED — silence is never a missed dose;
       this only cleans the phone's tray, never cf_taken_v2.
   (c) A NEUTRAL LOCK SCREEN. The visible title/body are "Chronic Friends"
       plus the count — never a medication, a strength or a dose, exactly
       like the daily check-in. The real detail travels in `secure` and is
       shown only INSIDE the app, after unlock. A user setting
       (cf_med_names_v1) turns the name back on; neutral is the default,
       and the legacy `name`/`dose` fields always carry the VISIBLE text,
       so an older shell can never leak a medication name either.
   Plus the daily-summary groups (kind 'am'/'pm') for medications whose
   reminder mode asks for them, and a horizon that follows the taper:
   each future day is scheduled with the schedule in force THAT day
   (cfMedSchedTimes), never with today's rate. */const mbDayKey=d=>{const dt=new Date(mbTodayKey()+'T00:00:00Z');dt.setUTCDate(dt.getUTCDate()+d);return dt.toISOString().slice(0,10);};function mbGroupText(list,names,kind,n){if(kind==='am'||kind==='pm'){const t=window.cfMedNeutralText?cfMedNeutralText(n,kind):{title:'Chronic Friends',body:''};return t;}if(!names)return window.cfMedNeutralText?cfMedNeutralText(list.length):{title:'Chronic Friends',body:''};if(list.length===1)return{title:window.trf?trf('Time for {name}',{name:list[0].secure.name}):list[0].secure.name,body:list[0].secure.dose};return{title:window.trf?trf('{n} medicines at {t}',{n:list.length,t:list[0].schedLabel}):String(list.length),body:list.map(d=>d.secure.name).join(' · ')};}/* the FULL next-7-days horizon: active meds with reminders on; only
   future, unresolved dose instances. null → nothing schedulable. */function mbHorizon(){const meds=mbRead('cf_meds_v3',[]).filter(m=>m.active!==false&&m.reminders&&!m.prn&&(m.times||[]).length);const summaryWanted=!!(window.CFMedSummary&&CFMedSummary.wanted());if(!meds.length)return null;const taken=mbRead('cf_taken_v2',{});const now=Date.now();const names=!!(window.cfMedNotifNames&&cfMedNotifNames());const doses=[];const dayPlan={};// dk → doses planned for the summary
meds.forEach(m=>{const daily=(m.period||'day')==='day';const dueIn=daily?null:mbDaysUntilDue(m);const mode=window.cfMedRemindMode?cfMedRemindMode(m):'every';const name=((window.tr?tr(m.name):m.name)+(m.strength?' '+m.strength:'')).trim();const dose=window.cfMedDoseLabel?cfMedDoseLabel(m):window.tr?tr(m.dose):m.dose;// MED7: plural-correct label
for(let d=0;d<7;d++){if(!daily&&d!==dueIn)continue;const dk=mbDayKey(d);/* MED16: the schedule in force THAT day — a taper's next step is
         already a dated segment, so week two is scheduled at its own
         rate instead of this week's */const times=daily&&window.cfMedSchedTimes?cfMedSchedTimes(m,dk):m.times||[];if(mode!=='every')dayPlan[dk]=(dayPlan[dk]||0)+times.length;if(mode==='summary')continue;// its reminders are the two summaries
times.forEach(time=>{const logId=`${dk}|${m.id}|${time}`;if(window.cfDoseIsResolved&&cfDoseIsResolved(taken[logId]))return;// already answered
let when=new Date(`${dk}T${time}:00`).getTime();// local wall-clock
/* un re-aviso vivo manda SU hora, no la original ya pasada */let live=false;// MED20: a re-alert set INSIDE the app
const snzAt=mbSnoozeUntil(logId);if(snzAt&&snzAt>when){when=snzAt;live=true;}const pndAt=mbPendingUntil(logId);if(pndAt&&pndAt>when){when=pndAt;live=true;}if(!(when>now))return;// never schedule the past
doses.push({logId,medId:m.id,name:name,dose:dose,timeISO:new Date(when).toISOString(),/* MED7: ONE clock — the app's own locale, so the phone's language can
             never disagree with the alarm screen. Always the SCHEDULED hour,
             never the snooze / "I'll take it now" one (that stays in timeISO). */schedTime:time,schedLabel:window.cfFmtDoseTime?cfFmtDoseTime(time):time,/* MED20: a re-alerted dose gets its own group (its effective minute),
             so the group's earliest-timeISO rule can never drag it back to the
             original hour and lose the snooze. `day` stays the dose's day — the
             same-medication expiry below keys on it across midnight. */groupId:live?`g|${dk}|${time}|@${Math.floor(when/60000)}`:`g|${dk}|${time}`,day:dk,secure:{name,dose}});});}});/* (a) group by day+time */const groups=[];const byId={};doses.forEach(d=>{let g=byId[d.groupId];if(!g){g=byId[d.groupId]={id:d.groupId,kind:'dose',day:d.day,schedTime:d.schedTime,timeISO:d.timeISO,logIds:[],expire:[],items:[]};groups.push(g);}g.logIds.push(d.logId);g.items.push(d);if(d.timeISO<g.timeISO)g.timeISO=d.timeISO;});/* (b) an earlier unanswered notification for the same medication that
     day is dismissed when the next one fires */const seen={};groups.slice().sort((a,b)=>a.timeISO<b.timeISO?-1:1).forEach(g=>{const drop={};g.items.forEach(d=>{(seen[d.day+'|'+d.medId]||[]).forEach(id=>{drop[id]=1;});});g.expire=Object.keys(drop);g.items.forEach(d=>{const k=d.day+'|'+d.medId;(seen[k]=seen[k]||[]).push(d.logId);});});/* the daily summaries — one morning, one evening, for the medications
     that asked for them (reuses the CKREM idea: soft, neutral, counted) */if(summaryWanted&&window.CFMedSummary){const st=CFMedSummary.get();for(let d=0;d<7;d++){const dk=mbDayKey(d);const n=dayPlan[dk]||0;if(!n)continue;[['am',st.am],['pm',st.pm]].forEach(([kind,hm])=>{const when=new Date(`${dk}T${hm}:00`).getTime();if(!(when>now))return;groups.push({id:`s|${dk}|${kind}`,kind,day:dk,schedTime:hm,timeISO:new Date(when).toISOString(),logIds:[],expire:[],items:[],n});});}}if(!groups.length)return null;/* (c) the VISIBLE text — neutral unless the patient turned names on */groups.forEach(g=>{const t=mbGroupText(g.items,names,g.kind,g.kind==='dose'?g.items.length:g.n);g.title=t.title;g.body=t.body;g.n=g.kind==='dose'?g.items.length:g.n;delete g.items;});groups.sort((a,b)=>a.timeISO<b.timeISO?-1:1);/* the flat per-dose list stays (per-logId cancel, follow-ups), with the
     visible fields already neutralized */doses.forEach(d=>{if(!names){const t=window.cfMedNeutralText?cfMedNeutralText(1):{title:'Chronic Friends',body:''};d.name=t.title;d.dose=t.body;}});doses.sort((a,b)=>a.timeISO<b.timeISO?-1:1);return{doses,groups};}/* stock side of a bridge resolution — SAME rule as meds.jsx setDose:
   taken & unlogged count as consumed, skipped pills stay in the box.
   Today: 'taken' deducts live. Past daily days are already reconciled,
   so only ENTERING 'skipped' returns a pill. (keepEarlier guarantees
   prev was unlogged/snoozed whenever a resolution applies.) */function mbApplyStock(medId,dk,action){const meds=mbRead('cf_meds_v3',[]);const med=meds.find(m=>m.id===medId);if(!med)return;const units=window.cfMedUnitsPerDose?cfMedUnitsPerDose(med):mbUnitsOf(med.dose);// MED17: both eyes = 2 per dose
const isToday=dk===mbTodayKey();let delta=0;if(isToday&&action==='taken')delta=-units;else if(!isToday&&action==='skipped'&&(med.period||'day')==='day')delta=+units;if(!delta)return;try{localStorage.setItem('cf_meds_v3',JSON.stringify(meds.map(m=>m.id===medId?{...m,stock:Math.max(0,(Number(m.stock)||0)+delta)}:m)));}catch(e){}}/* MED10: a dose confirmed from the phone notification deserves the same
   journal offer as the in-app alarm. medalarm.jsx owns the window, the
   conditions and the once-a-day flag — this only rings the bell. If the app
   is still booting when a pending resolution arrives, the host picks the
   request up as it mounts. */function mbOfferJournal(){try{if(typeof window.CFJournalOffer==='function'){window.CFJournalOffer();return;}}catch(e){}window.__cfJournalOfferPending=true;}/* ---- the glue ---- *//* explicit per-dose cancel — mbHorizon only carries FUTURE doses, so a dose
   answered after its hour never changes the schedule signature and the
   notifications the phone already scheduled for it would still fire. */function mbCancel(logId){if(!logId)return;mbPost({t:'med:cancel',logId:String(logId)});}let mbLastSig=null;function mbSync(force){if(!mbPresent())return;// plain browser: silent no-op
const h=mbHorizon();const sig=h?JSON.stringify(h):'CLEAR';if(!force&&sig===mbLastSig)return;mbLastSig=sig;/* v:2 — `groups` is the display truth (one notification per time,
     neutral, expiring); `doses` keeps the v1 shape so per-logId cancel
     and the follow-ups are untouched. */if(h)mbPost({t:'med:schedule',v:2,doses:h.doses,groups:h.groups});else mbPost({t:'med:clear'});}const CFMeds={present:mbPresent,/* opt-in from the app's own notification UI — never called cold */requestPermission(){mbPost({t:'med:perm:request'});},/* NH1 — the delivery-health screen. Reads and system-settings jumps
     only: not one of these schedules, moves or cancels a reminder. */healthCheck(){mbPost({t:'med:health:check'});},requestExact(){mbPost({t:'med:exact:request'});},requestBattery(){mbPost({t:'med:battery:request'});},openSettings(){mbPost({t:'med:settings:open'});},sendTest(mode){mbPost({t:'med:test',mode:(mode==='15min'||mode==='now')?mode:'1min'});},/* full re-send, e.g. after the native side restarts */resend(){mbSync(true);},/* called by cfDoseResolve (medstate.jsx) on every taken/skipped write */cancelDose(logId){mbCancel(logId);},_recv(payload){try{const p=typeof payload==='string'?JSON.parse(payload):payload;if(!p||!p.t)return;if(p.t==='med:resolved'){let tookAny=false;(p.items||[]).forEach(it=>{if(!it||!it.logId)return;const action=it.action==='taken'?'taken':it.action==='skipped'?'skipped':null;if(!action)return;// only resolutions apply — a snooze can never overwrite
const prevResolved=window.cfDoseIsResolved&&cfDoseIsResolved(mbRead('cf_taken_v2',{})[it.logId]);const at=Date.parse(it.respondedAtISO||'')||Date.now();const rec=window.cfDoseResolve?cfDoseResolve(it.logId,action,it.source==='notification'?'notification':'app',{keepEarlier:true,at,snz:Number(it.snoozeCount)||0}):null;if(rec&&!prevResolved)mbApplyStock(it.logId.split('|')[1],it.logId.split('|')[0],action);if(rec&&action==='taken'&&it.logId.split('|')[0]===mbTodayKey())tookAny=true;});/* cfDoseResolve already broadcast 'cf-meds-external' (meds view,
           dose log, hero reload); charts/radar/journal read the store at
           render. Re-send the horizon minus the resolved doses: */try{window.dispatchEvent(new CustomEvent('cf-meds-external'));}catch(e){}mbSync(false);if(tookAny)mbOfferJournal();}else if(p.t==='med:perm'){try{if(p.granted){localStorage.setItem('cf_notif_pref_v1','1');localStorage.setItem('cf_notif_sim_v1','1');}else localStorage.removeItem('cf_notif_sim_v1');}catch(e){}try{window.dispatchEvent(new Event('cf-notif'));}catch(e){}// AlarmSetupCard / Settings re-read
}else if(p.t==='med:health'){try{if(window.CFNotifHealth)CFNotifHealth._recvHealth(p);}catch(e){}}else if(p.t==='med:test:scheduled'){try{if(window.CFNotifHealth)CFNotifHealth._recvTest(p);}catch(e){}}else if(p.t==='med:open'){try{if(window.cfMedOpenDoses)cfMedOpenDoses(Array.isArray(p.logIds)?p.logIds:[]);}catch(e){}}}catch(e){}}};/* med:perm:request rides the EXISTING opt-in: wrap cfEnableNotifications
   (defined in medalarm.js, loaded before this file) so the request only
   ever fires from the app's own calm notification UI. */(function mbHookPermUI(){const wrap=()=>{const orig=window.cfEnableNotifications;if(!orig||orig.__cfMedBridge)return!!orig;const w=function(){try{CFMeds.requestPermission();}catch(e){}return orig.apply(this,arguments);};w.__cfMedBridge=true;window.cfEnableNotifications=w;return true;};if(!wrap())setTimeout(wrap,0);})();/* install + announce + keep the horizon fresh */(function mbInit(){window.CFMeds=CFMeds;if(!mbPresent())return;// browser: engine untouched, glue dormant
mbPost({t:'med:ready'});mbSync(true);window.addEventListener('cf-meds-external',()=>mbSync(false));setInterval(()=>mbSync(false),4000);// catches in-screen edits (state→storage writes)
})();Object.assign(window,{CFMeds});
})();