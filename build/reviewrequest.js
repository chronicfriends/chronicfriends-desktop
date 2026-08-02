(function(){/* ===================================================================
   MKT7 — REVIEW REQUEST after a value moment (web side ONLY).
   The NATIVE shell (Expo WebView) shows the official iOS/Android rating
   dialog; this module only DETECTS the right moment and pings the
   bridge. It draws NO UI of its own — ever: no modal, no stars, no
   pre-question. Same fire-and-forget pattern as the med:* messages.

   Web → native (window.ReactNativeWebView.postMessage(JSON string)):
     {type:'review:request', reason:'first-reply' | 'week-streak'}
   Nothing comes back. No bridge (plain browser) → the module is inert.

   Value moments (the FIRST one to occur wins; each milestone fires at
   most once per account):
     first-reply — the first time a post of MINE in the Community gets a
                   comment from someone else.
     week-streak — 7 consecutive days of real check-ins ending today.

   Vetoes (any one → do NOT ask, and do not retry until TOMORROW —
   skipDay below): a flare is logged today or Flare Mode is active, or
   today's check-in is a bad day (pain ≥ 5, the calendar's own 'bad'
   rule, plus energy ≤ 2 as a conservative extra). This is a health
   app: asking for a rating on a bad day is harmful and tasteless.

   Throttle (localStorage cf_review_ask_v1 — SHARED/device-wide, like
   the OS rating quota itself): max 1 ask / 90 days, max 3 per device
   lifetime. {ts, reason, count} saved on fire (+ internal done map and
   skipDay marker).

   Timing: never mid-action — the ask waits for ~2 s of quiet (any tap
   or keypress resets the timer) after the moment is detected.
   =================================================================== */const RR_KEY='cf_review_ask_v1';const RR_GAP_MS=90*86400000;/* 1 ask every 90 days */const RR_MAX=3;/* device-lifetime cap */const RR_IDLE_MS=2000;/* quiet time before asking */function rrPresent(){try{return!!(window.ReactNativeWebView&&typeof ReactNativeWebView.postMessage==='function');}catch(e){return false;}}function rrUid(){try{return window.CFNS&&CFNS.uid()||'anon';}catch(e){return'anon';}}function rrToday(){try{return cfDayKey();}catch(e){return'';}}function rrRead(){try{const r=JSON.parse(localStorage.getItem(RR_KEY));if(r&&typeof r==='object')return r;}catch(e){}return{};}function rrWrite(s){try{localStorage.setItem(RR_KEY,JSON.stringify(s));}catch(e){}}function rrCheckins(){try{const s=JSON.parse(localStorage.getItem('cf-checkins'));return s&&typeof s==='object'?s:{};}catch(e){return{};}}function rrIsReal(r){try{return!!(window.CF_isRealEntry&&CF_isRealEntry(r));}catch(e){return false;}}/* local day keys today-0 … today-(n-1), same format as cf-checkins */function rrDayKeys(n){const out=[];for(let i=0;i<n;i++){const d=new Date();d.setDate(d.getDate()-i);out.push(cfDayKey(d));}return out;}/* ---------- the two moments ---------- */function rrFirstReplyHit(){try{const P=window.CFPosts;if(!P)return false;const uid=rrUid();/* a comment from ANOTHER real account on one of my own live posts.
       Seed-post sample comments never apply here (own posts get none). */return(P.userPosts||[]).some(p=>p&&!p.deleted&&p.author===uid&&((P.comments||{})[p.id]||[]).some(c=>c&&!c.deleted&&c.author&&c.author!==uid));}catch(e){return false;}}function rrWeekStreakHit(){try{const store=rrCheckins();return rrDayKeys(7).every(k=>rrIsReal(store[k]));}catch(e){return false;}}/* ---------- vetoes: never ask on a bad day ---------- */function rrVetoToday(){try{if(window.CFFlareMode&&CFFlareMode.isActive())return true;const today=rrToday();if(window.cfIsFlareDay&&cfIsFlareDay(today))return true;/* flare logged today (journal, shelter or open episode) */const rec=rrCheckins()[today];if(rec){if(rec.flare==='Yes')return true;const pain=Number(rec.pain);if(isFinite(pain)&&pain>=5)return true;/* the calendar's own 'bad' rule */if(rec.energy!=null&&rec.energy!==''&&Number(rec.energy)<=2)return true;}return false;}catch(e){return true;}/* in doubt → don't ask */}/* ---------- throttle ---------- */function rrEligible(reason){const s=rrRead();if((s.count||0)>=RR_MAX)return false;if(s.ts&&Date.now()-s.ts<RR_GAP_MS)return false;if(s.skipDay===rrToday())return false;/* vetoed earlier today — retry tomorrow */if(s.done&&s.done[rrUid()+':'+reason])return false;/* this milestone was already used */return true;}/* fire = final re-check + post. A veto here writes skipDay (today) so
   nothing retries before tomorrow; the milestone itself stays pending. */function rrFire(reason){if(!rrPresent()||!rrEligible(reason))return;const s=rrRead();if(rrVetoToday()){s.skipDay=rrToday();rrWrite(s);return;}try{ReactNativeWebView.postMessage(JSON.stringify({type:'review:request',reason}));}catch(e){return;}const done=s.done||{};done[rrUid()+':'+reason]=Date.now();rrWrite({ts:Date.now(),reason,count:(s.count||0)+1,done});/* skipDay intentionally dropped */}/* ---------- quiet-moment arming (never mid-action) ---------- */let rrArmed=null,rrTimer=0;function rrReset(){if(rrArmed){clearTimeout(rrTimer);rrTimer=setTimeout(rrSettle,RR_IDLE_MS);}}function rrSettle(){const reason=rrArmed;rrArmed=null;window.removeEventListener('pointerdown',rrReset,true);window.removeEventListener('keydown',rrReset,true);if(reason)rrFire(reason);}function rrArm(reason){if(rrArmed||!rrPresent()||!rrEligible(reason))return;/* first moment wins */rrArmed=reason;window.addEventListener('pointerdown',rrReset,true);window.addEventListener('keydown',rrReset,true);clearTimeout(rrTimer);rrTimer=setTimeout(rrSettle,RR_IDLE_MS);}/* ---------- wiring ---------- */function rrCheckStreak(){if(rrWeekStreakHit())rrArm('week-streak');}function rrCheckReply(){if(rrFirstReplyHit())rrArm('first-reply');}(function rrBoot(){if(!rrPresent())return;/* plain browser → do nothing at all *//* week-streak: re-evaluated after every journal save (day 7's check-in
     closes → the sync event fires → 2 s of quiet → ask) */window.addEventListener('cf-checkin-sync',rrCheckStreak);/* first-reply: live changes to the feed while the app is open… */const wire=()=>{if(window.CFPosts&&CFPosts.subscribe){CFPosts.subscribe(rrCheckReply);return true;}return false;};if(!wire())window.addEventListener('load',wire);/* …and the reply that arrived while we were away: one settled boot check */setTimeout(rrCheckReply,4000);})();Object.assign(window,{CFReviewAsk:{present:rrPresent,eligible:rrEligible,veto:rrVetoToday,firstReply:rrFirstReplyHit,weekStreak:rrWeekStreakHit,arm:rrArm,fire:rrFire}});
})();