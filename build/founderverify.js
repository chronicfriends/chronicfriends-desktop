(function(){/* ===================================================================
   THE PIONEER WHO NEVER GOT HIS NUMBER (VERIF, 1 Sep 2026)

   The first 500 accounts are PIONEERS: CF_FOUNDER_MONTHS = 14 free months
   (foodscan.jsx). The number is handed out by the SERVER, and talking to the
   server needs a verified email (webapp/vendor/firebase-founder.js: active()
   requires verified()). So somebody who signs up, does NOT verify and keeps
   using the app never receives their number — and the local date backstop is
   off on purpose (CF_FOUNDER_CUTOFF = null), so there is no net underneath:
   on day 30 the trial ends and a full-blooded pioneer drops to the free plan.

   This file is A WARNING, and only that:
   • It never grants anything. Nothing here touches cfFounderResolve() or
     CF_FOUNDER_CUTOFF — the cloud → cache → backstop order is correct, and a
     phone clock is changed in two taps, so 14 months are never given away
     from a date on the device.
   • It appears only while usePlanStatus().kind === 'trial' (inside the 30-day
     window and the pioneer gift has NOT arrived). kind === 'founder' means
     the gift is already granted: nothing is shown, ever.
   • It names WHAT IS LOST, not the errand — the 14 free months — and it
     tightens as the 30 days run out (calm → the last week → the last day).
   • It is not dismissible, because the person cannot dismiss the consequence.
     It DISAPPEARS BY ITSELF the moment the email is verified.
   • It never promises the gift as a fact: the pioneer number belongs to the
     first 500 accounts, and only the server knows who they are. The copy says
     so; the app does not decide it.

   The engine is window.CFFirebase (webapp/vendor, outside design/, read
   lazily like every other engine):
     currentUser()      → the user or null; .emailVerified is the session fact
     isVerified()       → Promise<boolean>, RELOADS against the server first,
                          so it is the one that turns true after somebody
                          follows the link
     sendVerification() → Promise<{ok, code}> — the same call
                          firebase-auth-wire.js:166 already makes
   No engine → nothing is drawn at all. We never guess a session's state.

   It does not duplicate the sign-up «Verify email» screen in auth.jsx (a
   6-digit code flow): this is one notice with one action, and every string it
   can reuse from that flow is reused word for word — «Sending verification
   email…», «Check your inbox», «Last day», «{n} days left».
   =================================================================== */const CF_FV_RECHECK_MS=15000;/* one server re-check per 15 s at most */function cfFvApi(){const f=window.CFFirebase;return f&&typeof f.currentUser==='function'?f:null;}function cfFvUser(){const f=cfFvApi();if(!f)return null;try{return f.currentUser()||null;}catch(e){return null;}}/* what the session says right now, with no network */function cfFvVerifiedFlag(){const u=cfFvUser();return!!(u&&u.emailVerified);}/* the server truth. Unknown (no engine, offline, a rejection) → null: a doubt
   never becomes a statement, and a doubt never hides the warning either. */function cfFvVerifiedServer(){const f=cfFvApi();if(!f||typeof f.isVerified!=='function')return Promise.resolve(null);let p;try{p=f.isVerified();}catch(e){p=null;}return Promise.resolve(p).then(r=>typeof r==='boolean'?r:null).catch(()=>null);}function cfFvSend(){const f=cfFvApi();if(!f||typeof f.sendVerification!=='function')return Promise.resolve({ok:false});let p;try{p=f.sendVerification();}catch(e){p=null;}return Promise.resolve(p).then(r=>r&&typeof r==='object'?r:{ok:false}).catch(()=>({ok:false}));}function CFFounderVerifyNotice(){useT();const status=window.usePlanStatus?usePlanStatus():null;const[verified,setVerified]=React.useState(()=>cfFvVerifiedFlag());const[send,setSend]=React.useState({busy:false,done:false,failed:false});const[,bump]=React.useState(0);const last=React.useRef(0);/* The re-check can only ever turn the notice OFF: a `false` is what we
     already believe, and a silence is not a verification. */const check=React.useCallback(()=>{if(!cfFvApi())return;if(cfFvVerifiedFlag()){setVerified(true);return;}const now=Date.now();if(now-last.current<CF_FV_RECHECK_MS)return;last.current=now;cfFvVerifiedServer().then(r=>{if(r===true)setVerified(true);});},[]);React.useEffect(()=>{check();/* the two moments the answer can have changed: the app said the session
       changed, or the person came back from their mail app — both reset the
       throttle, because coming back IS the moment to ask again (the 15 s cap
       only protects against re-renders asking the server in a loop).
       They also BUMP: check() alone can only ever turn the notice off, so
       without a bump a session that turns out to be unverified would never
       repaint. */const onAuth=()=>{last.current=0;bump(x=>x+1);check();};const onVis=()=>{if(!document.hidden){last.current=0;bump(x=>x+1);check();}};window.addEventListener('cf-auth-changed',onAuth);document.addEventListener('visibilitychange',onVis);/* THE ENGINE MAY LAND AFTER THE FIRST RENDER. The vendor layer is loaded
       independently of the app — the same reason useFriends keeps trying to
       attach and cfChatCloudAttach polls. Without this loop, a cold start
       where firebase-* arrives late leaves the warning invisible for exactly
       the person it exists for (unverified, inside the 30 days), and no event
       is guaranteed to come. A few seconds of trying, then it gives up
       quietly — never a permanent timer. */let id=null,tries=0;if(!cfFvApi()){id=setInterval(()=>{tries++;const here=!!cfFvApi();if(here){last.current=0;bump(x=>x+1);check();}if(here||tries>20){clearInterval(id);id=null;}},500);}return()=>{window.removeEventListener('cf-auth-changed',onAuth);document.removeEventListener('visibilitychange',onVis);if(id)clearInterval(id);};},[check]);if(!cfFvApi()||verified)return null;if(!status||status.kind!=='trial')return null;/* 'founder' = already granted */const months=window.CF_FOUNDER_MONTHS||14;const trialDays=window.CF_TRIAL_DAYS||30;const d=typeof status.daysLeft==='number'&&isFinite(status.daysLeft)?status.daysLeft:null;/* it tightens as the window closes, and never gets louder than this */const urgent=d!=null&&d<=1;const soon=d!=null&&d<=7&&!urgent;const skin=urgent?{bg:'rgba(194,79,84,.12)',line:'rgba(194,79,84,.32)',ink:'#a53b40'}:soon?{bg:'rgba(245,166,35,.2)',line:'rgba(200,140,30,.34)',ink:'#8a5a12'}:{bg:'rgba(245,166,35,.12)',line:'rgba(245,166,35,.28)',ink:'#8a5a12'};const left=d==null?null:d<=1?tr('Last day'):trf('{n} days left',{n:d});const resend=()=>{if(send.busy)return;setSend({busy:true,done:false,failed:false});cfFvSend().then(r=>{setSend({busy:false,done:!!(r&&r.ok),failed:!(r&&r.ok)});last.current=0;});};return/*#__PURE__*/React.createElement("div",{className:"card",role:"status",style:{marginTop:14,padding:'13px 15px 15px',background:skin.bg,border:'1px solid '+skin.line,display:'flex',flexDirection:'column',gap:7}},left&&/*#__PURE__*/React.createElement("div",{style:{display:'flex',alignItems:'center',gap:6,fontSize:10.5,fontWeight:800,letterSpacing:'.08em',textTransform:'uppercase',color:skin.ink}},Ic.clock?Ic.clock({width:13,height:13}):null,left),/*#__PURE__*/React.createElement("div",{style:{fontSize:14.5,fontWeight:800,lineHeight:1.35,color:'var(--ink)',textWrap:'pretty'}},trf('Verify your email so you don’t lose your {n} free pioneer months',{n:months})),/*#__PURE__*/React.createElement("div",{className:"muted",style:{fontSize:12,fontWeight:600,lineHeight:1.45,textWrap:'pretty'}},trf('The pioneer months are for the first 500 accounts and can only reach a verified email. Without verifying, your account becomes free when the {n}-day trial ends.',{n:trialDays})),send.done?/*#__PURE__*/React.createElement("div",{style:{fontSize:12.5,fontWeight:800,color:'var(--green-700)',marginTop:2}},tr('Check your inbox')):/*#__PURE__*/React.createElement(React.Fragment,null,/*#__PURE__*/React.createElement("button",{className:"btn3d pill",disabled:send.busy,onClick:resend,style:{alignSelf:'flex-start',marginTop:3,padding:'10px 16px',fontSize:13,fontWeight:800,gap:7,opacity:send.busy?.7:1}},Ic.send?Ic.send({width:15,height:15}):null,send.busy?tr('Sending verification email…'):tr('Send the email again')),send.failed&&/*#__PURE__*/React.createElement("div",{style:{fontSize:12,fontWeight:700,color:'#c24f54',marginTop:1}},tr('We couldn’t send it — try again in a moment.'))));}Object.assign(window,{CFFounderVerifyNotice,cfFvApi,cfFvUser,cfFvVerifiedFlag,cfFvVerifiedServer,cfFvSend,CF_FV_RECHECK_MS});
})();