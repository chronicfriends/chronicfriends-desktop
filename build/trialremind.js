(function(){/* ===================================================================
   BARRIDO24 §6 — THE TRIAL-END REMINDER (window.CFTrialRemind)

   The paywall promises, in writing, on the «Day 28» row of the trial
   timeline: «We remind you before any charge». Nothing ever scheduled
   it. Decided by Gerhard, 24 Aug 2026: the notice is really scheduled —
   the promise stays, it is not removed.

   🔴 THERE ARE TWO 30-DAY CLOCKS AND ONLY ONE OF THEM ENDS IN A CHARGE:
     · cfTrialEndTs() (foodscan.jsx) counts 30 days from the ACCOUNT
       CREATION date. It is the welcome window, and when it runs out
       NOTHING is charged: the person moves down to the FREE TIER
       (cfPlanStatus() → kind:'free', plan:null, no payment method on
       file — CFAccessNotice already explains it without mentioning
       money). ❌ Using that date would send everyone who has never paid
       a warning about a charge that does not exist, with an empty plan
       name. That is exactly what must not happen.
     · The STORE trial is the one the card promises: it starts when
       somebody taps «Start 30-day free trial» on that same screen, and
       the «Day 30» row beside it is literally the price they will be
       charged. Its day 0 is the PURCHASE, not the signup. ✅ This is
       the one used here, read from cf_plan_v1 through cfLoadPlan().

   WHO gets it: only a running store trial — a record with
   trial === true AND lifetime !== true. No record, not a trial, or the
   lifetime plan → nothing is sent (and a pending notice is withdrawn).

   WHERE THE DATE COMES FROM: the record itself,
   p.startedTs + p.trialDays * 86400000 is the moment of the first
   charge; the reminder goes 48 h earlier, which is the «Day 28» row.
   ⚠️ Never cfPlanRenewTs(): that returns the NEXT renewal (it rolls
   whole terms forward from the purchase), so on a yearly plan it would
   fire eleven months late.

   HOW IT IS SENT (the native side is written and waiting; do not
   rename a field):
     web → native   {t:'trial:remind', atISO, title, body}
                    {t:'trial:clear'}
   Title and body are ALREADY TRANSLATED here, so they arrive ready to
   show. The `if (window.ReactNativeWebView)` guard is obligatory: in a
   plain browser that object does not exist and booting would throw.
   The shell uses one fixed identifier, so re-scheduling REPLACES the
   pending notice instead of stacking two for the same charge; a date
   already past (or less than a minute away), or a missing notification
   permission, schedules nothing and breaks nothing.

   WHEN IT IS SENT: on load, and every time the plan state changes
   (purchase, plan change, restored purchase) — 'cf-plan-updated', the
   storage event, and a slow poll that catches any write that comes
   without an event. trial:clear goes out the moment the record stops
   carrying trial:true (it converted into a paid plan, or it is gone).
   A signature guard means an unchanged state is never re-posted.
   =================================================================== */const TR_LEAD_MS=48*3600*1000;/* «Day 28» = 2 days before the charge */const TR_PLAN_NAME={yearly:'Yearly plan',sixmonth:'6-month plan',monthly:'Monthly plan',lifetime:'Lifetime plan'};function trPlanRecord(){try{return window.cfLoadPlan?cfLoadPlan():null;}catch(e){return null;}}/* The moment of the FIRST CHARGE of a running store trial, or null when
   there is no charge to warn anybody about. This is the whole rule. */function cfTrialChargeTs(){const p=trPlanRecord();if(!p||p.trial!==true||p.lifetime===true)return null;const started=Number(p.startedTs);const days=Number(p.trialDays);if(!started||!days)return null;return started+days*86400000;}function trPlanLabel(){const p=trPlanRecord();const k=TR_PLAN_NAME[p&&p.plan];return k&&window.tr?tr(k):k||'';}function trFmtDate(ts){try{const loc=window.cfLocale?cfLocale():window.I18n&&I18n.locale&&I18n.locale()||'en-US';return new Date(ts).toLocaleDateString(loc,{day:'numeric',month:'long'});}catch(e){return'';}}/* the message this device should have pending right now */function cfTrialRemindMessage(){const chargeTs=cfTrialChargeTs();if(chargeTs==null)return{t:'trial:clear'};return{t:'trial:remind',atISO:new Date(chargeTs-TR_LEAD_MS).toISOString(),title:window.tr?tr('Your trial ends in 2 days'):'Your trial ends in 2 days',body:window.trf?trf('On {date} the charge for {plan} begins. You can cancel anytime in the App Store or Google Play.',{date:trFmtDate(chargeTs),plan:trPlanLabel()}):''};}let trLastSig=null;function cfTrialRemindSync(force){const msg=cfTrialRemindMessage();const sig=JSON.stringify(msg);let bridge=false;try{bridge=!!(window.ReactNativeWebView&&typeof ReactNativeWebView.postMessage==='function');}catch(e){}if(!bridge)return msg;/* browser: nothing to schedule, nothing cached */if(!force&&sig===trLastSig)return msg;trLastSig=sig;try{ReactNativeWebView.postMessage(sig);}catch(e){}return msg;}const CFTrialRemind={chargeTs:cfTrialChargeTs,message:cfTrialRemindMessage,sync:cfTrialRemindSync};cfTrialRemindSync(true);try{window.addEventListener('cf-plan-updated',()=>cfTrialRemindSync(false));window.addEventListener('storage',()=>cfTrialRemindSync(false));/* the notice text is ours, so a language change has to re-schedule it */if(window.I18n&&I18n.listeners&&I18n.listeners.add)I18n.listeners.add(()=>cfTrialRemindSync(false));/* catches a plan record written without an event (restored purchase) */setInterval(()=>cfTrialRemindSync(false),60000);}catch(e){}Object.assign(window,{CFTrialRemind,cfTrialChargeTs,cfTrialRemindSync,cfTrialRemindMessage});
})();