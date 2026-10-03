(function(){/* ===================================================================
   notiffix.jsx — CICLO 1.0.8a (29 Sep 2026): «Turn on notifications» in
   ONE tap, the same component everywhere the app used to say only
   «Notifications are blocked, so no reminder can reach you.»

   Gerhard, watching new members: without the phone's notification
   permission NEITHER the journal reminder NOR the medication alerts can
   arrive — and the app said so without offering any way to fix it. People
   do not know how to reach the phone's Settings; they tapped «Continue»
   and stayed without reminders for ever.

   CFNotifFix reads cfNotifStatus() (medalarm.jsx — inside the app it
   reads the phone's REAL permission) and paints ONE of:
     'default'      → «Turn on notifications» → cfEnableNotifications()
                      (the system dialog appears).
     'denied'       → «Open notification settings» → CFMeds.openSettings()
                      (medbridge.jsx: the native side opens Chronic
                      Friends' notification page in the phone's Settings)
                      + one short line: turn them on there and come back.
                      🔴 NO menu names of the system: they change with
                      every phone and every language. Without the bridge
                      (the web in a browser) nothing is drawn here: the
                      callers' own line already says «blocked», and the
                      medication card keeps its browser sentences THERE,
                      where they are true.
     'granted'      → ✅ «Notifications are allowed.» — ONLY when this very
                      mount saw the permission change (never a permanent
                      tick, never one that cfNotifStatus() does not back).
                      At that moment, where the component stands for the
                      journal reminder (`reminder`), CFCkRem.enable(time)
                      switches it on at its hour — `time` from the caller
                      or CFCkRem.get().time, which is CKREM_DEFAULT_TIME
                      (never written by hand here). «Of the phone and of
                      the app» = both with the same tap. Places that are
                      NOT about the journal reminder (the medication card)
                      pass no `reminder`: a reminder somebody switched off
                      by hand is never switched back on from there.
     'unsupported'  → nothing.

   🔴 Coming back from the phone's Settings refreshes by itself:
   useNotifStatus() listens to 'cf-notif' (the native side fires it after
   re-reading the permission; medalarm fires it after every request) AND
   re-reads cfNotifStatus() when the page becomes visible again
   (visibilitychange / focus / pageshow). A ✅ can only ever be painted
   when cfNotifStatus() === 'granted' at that paint.

   Used by: onboarding.jsx (step 4.5 + CFNotifSkipSheet), checkinreminder
   (the sheet, the no-meds card, the Journal line), settings.jsx (the
   Journal reminder row), meds.jsx (AlarmSetupCard, inside the app only).
   Loaded after build/checkinreminder.js; every dependency is read at use
   time through window (cfNotifStatus · cfEnableNotifications · CFMeds ·
   CFCkRem), so the file loads with none of them present.
   =================================================================== */const{useState:useNfS,useEffect:useNfE,useRef:useNfR}=React;function nfStatus(){try{return window.cfNotifStatus?cfNotifStatus():'unsupported';}catch(e){return'unsupported';}}/* the door into the phone's Settings exists only inside the app */function nfBridge(){try{return!!(window.CFMeds&&typeof CFMeds.present==='function'&&CFMeds.present()&&typeof CFMeds.openSettings==='function');}catch(e){return false;}}/* 'default' | 'denied' = the phone will not show a notification today */function nfUnreachable(st){return st==='default'||st==='denied';}function useNotifStatus(){const[st,setSt]=useNfS(nfStatus);useNfE(()=>{const re=()=>setSt(nfStatus());const vis=()=>{if(!document.hidden)re();};window.addEventListener('cf-notif',re);window.addEventListener('focus',re);window.addEventListener('pageshow',re);document.addEventListener('visibilitychange',vis);return()=>{window.removeEventListener('cf-notif',re);window.removeEventListener('focus',re);window.removeEventListener('pageshow',re);document.removeEventListener('visibilitychange',vis);};},[]);return st;}function nfEnable(){try{if(window.cfEnableNotifications)return Promise.resolve(cfEnableNotifications()).catch(()=>null);}catch(e){}return Promise.resolve(null);}function nfOpenSettings(){try{if(nfBridge())CFMeds.openSettings();}catch(e){}}/* props: reminder (this place is about the journal reminder → switch it on
   when the permission arrives) · time (its hour; else the stored one) ·
   onGranted · explain (paint the why under the 'default' button) · style */function CFNotifFix({reminder,time,onGranted,explain,style}){useT();const st=useNotifStatus();const prev=useNfR(st);const[fixed,setFixed]=useNfS(false);useNfE(()=>{const was=prev.current;prev.current=st;if(st!=='granted'||was==='granted')return;setFixed(true);/* the app's own switch (cf_notif_pref_v1, read by the medication alarms)
       follows the phone: already granted, so no dialog can appear here */try{if(window.cfNotifWanted&&!cfNotifWanted()&&window.cfEnableNotifications)cfEnableNotifications();}catch(e){}if(reminder&&window.CFCkRem){try{CFCkRem.enable(time||CFCkRem.get().time);}catch(e){}}if(onGranted){try{onGranted();}catch(e){}}},[st]);if(st==='unsupported')return null;if(st==='granted'){if(!fixed)return null;return/*#__PURE__*/React.createElement("div",{className:"nf-ok",style:{display:'flex',alignItems:'center',gap:9,padding:'11px 14px',borderRadius:15,background:'var(--mint-50)',color:'var(--green-700)',fontSize:13,fontWeight:700,lineHeight:1.4,...(style||{})}},/*#__PURE__*/React.createElement("span",{style:{display:'flex',color:'var(--green-600)',flex:'none'}},Ic.check({width:17,height:17})),/*#__PURE__*/React.createElement("span",{style:{flex:1,minWidth:0}},tr('Notifications are allowed.')));}if(st==='denied'&&!nfBridge())return null;const denied=st==='denied';return/*#__PURE__*/React.createElement("div",{className:"nf-fix",style:{display:'flex',flexDirection:'column',gap:8,...(style||{})}},/*#__PURE__*/React.createElement("button",{className:"btn3d pill nf-btn",onClick:denied?nfOpenSettings:nfEnable,style:{width:'100%',padding:'14px',fontSize:14.5,fontWeight:800,gap:8}},Ic.bellRing({width:17,height:17})," ",tr(denied?'Open notification settings':'Turn on notifications')),(denied||explain)&&/*#__PURE__*/React.createElement("div",{className:"muted nf-why",style:{fontSize:12,fontWeight:600,lineHeight:1.5,textAlign:'center',textWrap:'pretty'}},tr(denied?'Turn on notifications for Chronic Friends there, then come back here.':'Without notifications, neither the journal reminder nor your medication alerts can reach you.')));}/* ---------- the ONE soft sheet of the onboarding (step 4.5) ----------
   Shown once, when the person leaves the reminder screen with the
   permission not granted: the consequence in one sentence, the same
   button, and «Continue without notifications». It never blocks: the
   permission arriving continues by itself (onContinue), and so does the
   grey button. */function CFNotifSkipSheet({open,time,onContinue}){useT();if(!open)return null;return/*#__PURE__*/React.createElement(SheetPortal,null,/*#__PURE__*/React.createElement("div",{className:"sheet-backdrop nf-skip",onClick:onContinue},/*#__PURE__*/React.createElement("div",{className:"sheet",onClick:e=>e.stopPropagation()},/*#__PURE__*/React.createElement("div",{className:"sheet-grab"}),/*#__PURE__*/React.createElement("div",{style:{display:'flex',alignItems:'center',gap:12,marginBottom:10}},/*#__PURE__*/React.createElement("div",{className:"badge-ic",style:{background:'linear-gradient(180deg,#7bd853,#3f8a3f)',color:'#fff'}},Ic.bellRing({width:20,height:20})),/*#__PURE__*/React.createElement("div",{style:{flex:1,minWidth:0,fontWeight:800,fontSize:16,letterSpacing:'-.01em',lineHeight:1.25,textWrap:'pretty'}},tr('Without notifications, neither the journal reminder nor your medication alerts can reach you.'))),/*#__PURE__*/React.createElement(CFNotifFix,{reminder:true,time:time,onGranted:onContinue,style:{marginTop:6}}),/*#__PURE__*/React.createElement("button",{className:"nf-skip-go",onClick:onContinue,style:{width:'100%',marginTop:12,border:'none',cursor:'pointer',fontFamily:'inherit',fontWeight:700,fontSize:13.5,color:'var(--muted)',background:'rgba(60,90,60,.08)',borderRadius:22,padding:'13px'}},tr('Continue without notifications')))));}Object.assign(window,{CFNotifFix,CFNotifSkipSheet,useNotifStatus,cfNotifUnreachable:nfUnreachable,cfNotifFixBridge:nfBridge});
})();