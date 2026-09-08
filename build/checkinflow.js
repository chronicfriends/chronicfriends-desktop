(function(){/* ===================================================================
   THE DAILY CHECK-IN FLOW (checkinflow.jsx) — ONE QUESTION, ONE
   SCREEN, ONE TAP.  Decided by Gerhard, 7 Sep 2026.
   -------------------------------------------------------------------
   This is the SECOND way of filling the journal, the one almost
   everybody will use: the reminder chimes in the evening, and the
   whole day is answered by tapping, one question per screen, with no
   scrolling and no keyboard. The Journal tab — its form, its
   calendar, its history — is untouched and still there.

   It replaces the blue «Same routine as yesterday?» button, which
   could log 23 answers in two taps without the person reading one of
   them: that data reached the charts, the analytics and the PDF a
   doctor reads. The comfortable way is now also the truthful one.

   Rules of the screen: one question per screen, never a scrollbar ·
   options at 56 px for a thumb · one tap answers AND moves on · Skip
   always visible · the keyboard NEVER opens (the five free-text notes
   are not part of the route) · progress visible from the first screen
   · Back goes back, the X leaves and keeps what was answered · a day
   with answers opens WITH THEM MARKED · friend tone, and never a
   blind congratulation (see ckfHsInfo).

   Storage: the SAME record as the form — cf-checkins[YYYY-MM-DD],
   same keys, no new field, written through CF_saveStore so the
   canonical fan-out runs exactly as for the form. 🔴 Unlike the form,
   the flow NEVER spreads CF_DEFAULTS into the day: a default is not
   an answer, and pre-marking a default would be exactly the lie the
   blue button used to tell.
   =================================================================== */
const{useState:useCkfS,useEffect:useCkfE}=React;const CKF_POS_KEY='cf_ckflow_pos_v1';
/* the five flare areas the journal has always stored in `flareTypes`
   (RF_FT_MAP, flaremode.jsx — same spelling, same 16 translations) */
const CKF_FLARE_TYPES=['Diarrhea','Uveitis','Arthritis','Dermatitis','Psoriasis'];
/* ---------- the day, the record, the write ---------- */
function ckfDay(){try{return window.cfDayKey?cfDayKey():new Date().toISOString().slice(0,10);}catch(e){return new Date().toISOString().slice(0,10);}}
function ckfStore(){try{return(window.CF_loadStore&&CF_loadStore())||{};}catch(e){return{};}}
/* the RAW record — only what was really answered (or synced) */
function ckfRaw(day){const r=ckfStore()[day];return r&&typeof r==='object'?r:{};}
function ckfSave(day,patch){const prev=ckfStore();const next={...prev,[day]:{...(prev[day]||{}),...patch,_checkedIn:true}};try{if(window.CF_saveStore)CF_saveStore(next);else localStorage.setItem('cf-checkins',JSON.stringify(next));}catch(e){}try{window.dispatchEvent(new Event('cf-checkin-sync'));}catch(e){}return next[day];}
/* where the person was, so a trip to the system permission sheet comes
   back to the SAME question instead of the start of the questionnaire */
function ckfReadPos(day){try{const p=JSON.parse(localStorage.getItem(CKF_POS_KEY)||'null');return p&&p.d===day&&p.id?p.id:null;}catch(e){return null;}}
function ckfWritePos(day,id){try{localStorage.setItem(CKF_POS_KEY,JSON.stringify({d:day,id}));}catch(e){}}
function ckfClearPos(){try{localStorage.removeItem(CKF_POS_KEY);}catch(e){}}
/* ---------- the questions ----------
   Every label and option below is a string the journal form ALREADY
   shows, so the two ways speak with one voice and reuse the same 16
   translations. `q` may be a function when the label is chosen at
   render (the Mind tracker's plain-words setting). */
function ckfLife(key,extra){const p=(window.byKey||{})[key];if(!p)return null;return Object.assign({id:key,field:key,kind:'single',q:p.label,options:p.options,icon:p.icon,color:p.color,min:p.minLabel,max:p.maxLabel},extra||{});}
function ckfModColor(mod){const m=(window.SM_MOD_BY||{})[mod];return(m&&m.color)||(window.PC&&PC.nature)||['#9fe07a','#4e9c3f'];}
/* per-module questions, in the order of the module's own check-in block
   (modcheckin.jsx). The free-text notes are deliberately absent. */
const CKF_MOD_Q={
musc:[{field:'mjPain',kind:'scale',theme:'pain',icon:'bone',q:'Joint & muscle pain today',min:'No pain',max:'Worst'},
{field:'mjStiff',kind:'single',icon:'unlockpad',q:'Morning stiffness lasted…',options:['None','<15 min','15–60 min','>1 h']},
{field:'mjMobility',kind:'scale',theme:'energy',icon:'run',q:'How does your body move today?',min:'Locked up',max:'Moving freely'},
{field:'mjZones',kind:'multi',icon:'bodymap',q:'Where do you feel it?',options:['Hands','Knees','Back','Neck','Hips','Shoulders']}],
eyes:[{field:'eyeDry',kind:'scale',theme:'pain',icon:'eye',q:'Eye dryness',min:'Comfortable',max:'Very dry'},
{field:'eyeLight',kind:'scale',theme:'pain',icon:'sun',q:'Light sensitivity',min:'None',max:'Very sensitive'},
{field:'eyeChips',kind:'multi',icon:'spark',q:'Anything else today?',options:['Blurry vision','Redness','Eye pain']}],
skin:[{field:'skItch',kind:'scale',theme:'pain',icon:'mirror',q:'Itch today',min:'No itch',max:'Intense'},
{field:'skChips',kind:'multi',icon:'spark',q:'Anything new or changed?',options:['Rash','Eczema patch','Nodule','Mouth ulcer','Hair loss']}],
pelvic:[{field:'pvPain',kind:'scale',theme:'pain',icon:'tulip',q:'Pelvic pain today',min:'No pain',max:'Worst'},
{field:'pvBleed',kind:'single',icon:'drop',q:'Bleeding today?',options:['None','Spotting','Normal','Heavy']},
{field:'pvUrin',kind:'multi',icon:'drop',q:'Bathroom comfort',options:['Pain','Urgency','Frequency']},
{field:'pvSpasm',kind:'single',icon:'pulse',q:'Pelvic spasms?',options:['Yes','No']}],
breath:[{field:'bhBreath',kind:'scale',theme:'energy',icon:'lungs',q:'How did breathing feel today?',min:'Hard work',max:'Easy'},
{field:'bhCtx',kind:'multi',icon:'run',q:'Noticed when…',options:['At rest','Walking','Stairs']},
{field:'bhCough',kind:'single',icon:'wind',q:'Cough today?',options:['None','Dry','Productive']},
{field:'bhChips',kind:'multi',icon:'heart',q:'Also felt…',options:['Wheezing','Palpitations']},
{field:'bhReliever',kind:'single',icon:'pill',q:'Reliever inhaler used today',options:['0','1','2','3+']}],
mind:[{field:'mdWeather',kind:'single',icon:'suncloud',q:()=>smMindLbl('Your inner weather today','Your mood today'),options:['Sunny','Partly cloudy','Cloudy','Rainy','Stormy']},
{field:'mdWorry',kind:'scale',theme:'pain',icon:'mind',q:'Worry & anxiety level',min:'Quiet mind',max:'Racing'},
{field:'mdConnect',kind:'single',icon:'users',q:'Time with people today?',options:['Alone all day','A little','Plenty']},
{field:'mdSwing',kind:'single',icon:'pulse',gate:'swing',q:()=>smMindLbl('Mood dial — where did it sit?','Mood level today'),options:['Deep low','Low','Steady','Elevated','Racing high']},
{field:'mdUrge',kind:'single',icon:'wave',gate:'urges',q:'Urges or cravings today?',options:['None','Passing','Strong']},
{field:'mdSteady',kind:'single',icon:'cal',gate:'urges',q:'How did the day go?',options:['Steady day','Had a slip']},
{field:'mdFocus',kind:'scale',theme:'energy',icon:'timer',gate:'focus',q:'Focus today',min:'Scattered',max:'Locked in'},
{field:'mdChips',kind:'multi',icon:'spark',q:'Your mind also felt…',options:['Racing thoughts','Low motivation','Irritable','Restless','Tearful','Calm']}],
univ:[{field:'enFog',kind:'single',icon:'fog',q:'Head today?',options:['Clear','Foggy','Very foggy']},
{field:'enDizzy',kind:'single',icon:'pulse',q:'Dizzy on standing today?',options:['0','1','2','3+']},
{field:'enChips',kind:'multi',icon:'spark',q:'Also today…',options:['Felt feverish','Heart raced at rest']}]};
function ckfModOn(mod){try{return!window.CFModules||CFModules.isOn(mod);}catch(e){return true;}}
function ckfMindGates(){try{return(window.smMindGates&&smMindGates())||{};}catch(e){return{};}}
function ckfModQuestions(mod){const gates=mod==='mind'?ckfMindGates():null;const color=ckfModColor(mod);return(CKF_MOD_Q[mod]||[]).filter(d=>!d.gate||!!gates[d.gate])/* 🔴 the spread comes FIRST: with `d` last, its `icon` (a NAME string) overwrote
   the resolved function and the question screen called a string — TypeError, and
   React 18 unmounts the whole root into the error boundary. */
.map(d=>Object.assign({},d,{id:mod+'.'+d.field,color,icon:(window.Ic||{})[d.icon]}));}
/* the whole route, in the order of the form itself, for THIS record */
function ckfBuild(rec){const r=rec||{};const out=[];const push=q=>{if(q)out.push(q);};const PCc=window.PC||{};
/* 0 — the flare question. It was taken out of the form because Flare
   mode already writes it; the consequence was that anybody who does not
   use Flare mode never recorded a single flare day in their life. Here
   it is question ZERO, and answering Yes paints the day cyan
   (flaresync.jsx reads this field). */
push({id:'flare',field:'flare',kind:'single',q:'Having a flare-up?',options:['Yes','No'],icon:(window.Ic||{}).spark,color:PCc.flare});
/* 🪤 `cond` = a question that only exists because of the answer above it.
   It is the SECOND HALF of its trigger, never a new question: out of the
   total, and it never moves the counter. Without this the counter would go
   17 → 16 → 17 the moment somebody says yes to the sun or to a flare. */
if(r.flare==='Yes')push({id:'flareTypes',field:'flareTypes',kind:'multi',cond:true,q:'Which areas are flaring?',options:CKF_FLARE_TYPES,icon:(window.Ic||{}).spark,color:PCc.flare});
/* 1 — the condition-adapted question, exactly the definitions the
   journal's own first card uses (checkinpulse.jsx) */
let defs=[];try{defs=(window.cpDefs&&cpDefs())||[];}catch(e){defs=[];}
defs.forEach(d=>{const clean=d.field==='clean';push({id:'pulse.'+d.field,field:d.field,kind:'single',q:d.q,icon:(window.Ic||{})[d.icon]||(window.Ic||{}).heart,color:clean?['#66c7b8','#2f8a7d']:['#95c96e','#4e9c3f'],choices:clean?[{v:'Clean',label:'No'},{v:'Slip',label:'Yes'}]:[{v:'Good day',label:d.good},{v:'Tough day',label:d.tough}]});});
/* 2 — the form's own order, question by question */
push({id:'pain',field:'pain',kind:'scale',theme:'pain',q:'Pain Level',min:'No pain',max:'Worst',icon:(window.Ic||{}).flame,color:PCc.pain});
push({id:'energy',field:'energy',kind:'scale',theme:'energy',q:'Energy Level',min:'Very low',max:'Full of energy',icon:(window.Ic||{}).bolt,color:PCc.energy});
if(ckfModOn('dig'))push(ckfLife('bowel'));
push(ckfLife('water'));push(ckfLife('sleep',{hs:'sleep'}));push(ckfLife('move',{hs:'move'}));push(ckfLife('steps',{hs:'steps'}));
push(ckfLife('nature'));push(ckfLife('animals'));push(ckfLife('sunlight'));
if(r.sunlight==='1–2h'||r.sunlight==='+3h')push({id:'sunProtect',field:'sunProtect',kind:'single',cond:true,q:'Sun protection used?',options:['Yes','No'],icon:(window.Ic||{}).shield,color:PCc.sunlight});
push(ckfLife('tv'));push(ckfLife('tobacco'));push(ckfLife('alcohol'));
push(ckfLife('subst',{kind:'multi',options:['THC','CBD','Coke','MDMA','Amph','Keta','Other']}));
/* the Mind tracker asks the same measure as Mindset — asked once,
   exactly like the form (cfMoodToneUnified) */
let unified=false;try{unified=!!(window.cfMoodToneUnified&&cfMoodToneUnified());}catch(e){}
if(!unified)push(ckfLife('mindset'));
['love','toxic','meditate','relaxed','music','sing','dance'].forEach(k=>push(ckfLife(k)));
/* 3 — the active trackers, in SM_BLOCKS order, digestion's extra last */
['musc','eyes','skin','pelvic','breath','mind','univ'].forEach(mod=>{if(mod!=='univ'&&!ckfModOn(mod))return;if(mod==='univ'){try{if(!(window.CFModules&&CFModules.activeList().some(m=>m.id==='univ')))return;}catch(e){}}ckfModQuestions(mod).forEach(push);});
if(ckfModOn('dig')){let ctx=[];try{ctx=(window.CFModules&&CFModules.digCtxOptions())||[];}catch(e){ctx=[];}const digColor=ckfModColor('dig');
if(ctx.length)push({id:'dig.digCtx',field:'digCtx',kind:'multi',q:'Context (your conditions)',options:ctx,icon:(window.Ic||{}).gut,color:digColor});
push({id:'dig.digGas',field:'digGas',kind:'single',q:'Gas or bloating today?',options:['Yes','No'],icon:(window.Ic||{}).gut,color:digColor});}
return out;}
/* ---------- Health Sync: three questions the phone already answered ----------
   cfHsAutofill() writes today's steps / sleep / activity into the same
   record and keeps the exact number in _sync. When it is there, the
   screen does not ask — it TELLS, and one «OK» moves on.
   🔴 The message follows the number and never celebrates blindly:
   celebrating 300 steps at somebody who spent the day in bed with a
   flare is cruel. High → celebration. Normal → neutral. Low → neutral
   and kind, never disappointment, and never a word about moving more. */
function ckfHsInfo(kind,rec){const sync=(rec&&rec._sync)||{};
if(kind==='steps'&&sync.stepsN!=null){const n=sync.stepsN;return{value:trf('{n} steps',{n:window.cfHsFmtSteps?cfHsFmtSteps(n):String(n)}),line:n>=8000?'That is a lot of walking today. 💚':n<2000?'A quiet day for your legs — that counts too.':'Steps saved, straight from your phone.'};}
if(kind==='sleep'&&sync.sleepMin!=null){const m=sync.sleepMin;return{value:window.cfHsFmtSleep?cfHsFmtSleep(m):m+' min',line:m>=420?'A full night — saved. 💚':m<300?'A short night. Be gentle with yourself today.':'Sleep saved, straight from your phone.'};}
if(kind==='move'&&sync.activeMin!=null){const m=sync.activeMin;return{value:trf('{n} active minutes',{n:m}),line:m>=45?'A moving day — saved. 💚':'Activity saved, straight from your phone.'};}
return null;}
/* is there a health app on this phone that is not connected yet? */
function ckfCanConnect(){try{if(!(window.cfHsInApp&&cfHsInApp()))return false;if(!(window.cfHsAvailable&&cfHsAvailable()))return false;return!(window.CFHealthSync&&CFHealthSync.connected());}catch(e){return false;}}
function ckfConnect(){try{if(!window.cfHsRequest)return;const days=window.HS_QUERY_DAYS||365;Promise.resolve(cfHsRequest()).then(()=>(window.cfHsQuery?cfHsQuery(days):null)).then(()=>{try{if(window.cfHsAutofill)cfHsAutofill();}catch(e){}}).catch(()=>{});}catch(e){}}
/* ---------- the label of a question / an option ---------- */
function ckfQLabel(q){try{return typeof q.q==='function'?q.q():tr(q.q);}catch(e){return'';}}
function ckfChoices(q){if(q.choices)return q.choices.map(c=>({v:c.v,label:tr(c.label)}));return(q.options||[]).map(o=>({v:o,label:tx(o)}));}
function ckfAnswered(q,rec){const v=rec[q.field];if(q.kind==='multi')return Array.isArray(v)?v:(typeof v==='string'&&v&&v!=='None'?[v]:[]);return v;}
/* ---------- the 0–10 scale, the journal's own ramp at thumb size ----------
   Same colours and same «filled up to your number» reading as the
   journal's LevelScale; drawn at 56 px because 11 numbers across one
   phone row are 23 px wide and this flow is answered with a thumb. */
function ckfLerp(a,b,t){const p=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];const pa=p(a),pb=p(b);return'#'+pa.map((v,i)=>Math.round(v+(pb[i]-v)*t).toString(16).padStart(2,'0')).join('');}
const CKF_THEME={pain:{lo:'#f6cabf',hi:'#a8362c'},energy:{lo:'#cdeab2',hi:'#2f7a35'}};
function CkfScale({theme,value,min,max,onPick}){const T=CKF_THEME[theme]||CKF_THEME.energy;const has=value!=null&&value!=='';
return React.createElement("div",{style:{display:'flex',flexDirection:'column',gap:10,flex:'1 1 auto',minHeight:0,justifyContent:'center'}},
React.createElement("div",{className:"ckf-nums"},Array.from({length:11}).map((_,i)=>{const on=has&&i<=Number(value),t=i/10;
return React.createElement("button",{key:i,className:"ckf-num",onClick:()=>onPick(i),style:{background:on?ckfLerp(T.lo,T.hi,t):'var(--white)',color:on?(t>0.42?'#fff':'#5a4a3a'):'var(--muted-2)',boxShadow:on?'inset 0 2px 3px rgba(0,0,0,.12)':'inset 0 0 0 1.5px rgba(120,150,110,.22)'}},i);})),
React.createElement("div",{className:"ckf-minmax"},React.createElement("span",null,tx(min)),React.createElement("span",null,tx(max))));}
/* ---------- one question, one screen ---------- */
function CkfQuestion({q,rec,left,pct,index,onAnswer,onSkip,onBack,onClose}){useT();
const[manual,setManual]=useCkfS(false);/* «I'll say it myself» on a synced question */
const[multi,setMulti]=useCkfS(()=>ckfAnswered(q,rec)||[]);
const[touched,setTouched]=useCkfS(false);/* unticking everything IS an answer: «none of these» */
useCkfE(()=>{setManual(false);setTouched(false);setMulti(ckfAnswered(q,rec)||[]);},[q.id]);// eslint-disable-line
const hs=q.hs&&!manual?ckfHsInfo(q.hs,rec):null;const choices=ckfChoices(q);const cur=ckfAnswered(q,rec);
const cols=q.kind==='multi'||choices.length>4?2:1;const canConnect=q.hs&&!hs&&ckfCanConnect();
const pname=(window.cfHsPlatformLabel&&cfHsPlatformLabel())||'';
const toggle=v=>{setTouched(true);setMulti(arr=>(arr.indexOf(v)>=0?arr.filter(x=>x!==v):arr.concat([v])));};
const multiReady=multi.length>0||touched;const label=ckfQLabel(q);const long=String(label).length>46;/* 19 px rather than a cut word */const col=Array.isArray(q.color)&&q.color.length===2?q.color:null;
return React.createElement(React.Fragment,null,
React.createElement("div",{className:"ckf-top"},
React.createElement("button",{className:"ckf-ic",onClick:onBack,disabled:index===0,"aria-label":tr('Previous step'),style:{opacity:index===0?.35:1}},Ic.back({width:18,height:18})),
React.createElement("div",{className:"ckf-bar"},React.createElement("i",{style:{width:pct+'%'}})),
/* what is LEFT, never what is done (Gerhard, 7 Sep 2026): the number
   reassures and the bar is understood without reading. */
React.createElement("span",{className:"ckf-count"},left<=1?tr('Last question'):trf('{n} to go',{n:left})),
React.createElement("button",{className:"ckf-ic",onClick:onClose,"aria-label":tr('Close')},Ic.x({width:16,height:16}))),
/* The question band has a FIXED height and its content is centred in it, so
   the question sits in exactly the same place on all 38 screens — two options
   or five, the text never jumps. Each question wears its own parameter colour
   (PC, checkin.jsx): decoration, never a verdict. */
React.createElement("div",{className:"ckf-q",key:q.id},
React.createElement("div",{className:"ckf-halo",style:col?{background:'linear-gradient(180deg,'+col[0]+','+col[1]+')'}:null},(typeof q.icon==='function'?q.icon:Ic.heart)({width:28,height:28})),
React.createElement("div",{className:'ckf-title'+(long?' long':'')},label),
hs&&React.createElement("div",{className:"ckf-value"},hs.value)),
React.createElement("div",{className:"ckf-sheet"},
hs
?React.createElement(React.Fragment,null,
React.createElement("div",{className:"ckf-hsline"},tr(hs.line)),
React.createElement("button",{className:"btn3d pill",onClick:()=>onAnswer(null),style:{width:'100%',padding:'17px',fontSize:16,fontWeight:800}},tr('OK')),
React.createElement("button",{className:"ckf-quiet",onClick:()=>setManual(true)},tr('I’ll say it myself')))
:React.createElement(React.Fragment,null,
q.kind==='scale'
?React.createElement(CkfScale,{theme:q.theme,value:cur,min:q.min,max:q.max,onPick:v=>onAnswer({[q.field]:v})})
:React.createElement("div",{className:"ckf-opts",style:{gridTemplateColumns:'repeat('+cols+',minmax(0,1fr))'}},choices.map((c,i)=>{
const on=q.kind==='multi'?multi.indexOf(c.v)>=0:cur===c.v;
const wide=cols===2&&choices.length%2===1&&i===choices.length-1;
return React.createElement("button",{key:c.v,className:'ckf-opt'+(on?' on':''),style:wide?{gridColumn:'1 / -1'}:null,onClick:()=>(q.kind==='multi'?toggle(c.v):onAnswer({[q.field]:c.v}))},c.label);})),
q.kind==='multi'&&React.createElement("div",{className:"ckf-hint"},tr('Tap all that apply')),
q.min&&q.kind==='single'&&(q.max?React.createElement("div",{className:"ckf-minmax"},React.createElement("span",null,tx(q.min)),React.createElement("span",null,tx(q.max))):null),
React.createElement("div",{className:"ckf-foot"},
canConnect&&React.createElement("button",{className:"ckf-quiet",onClick:ckfConnect},trf('Connect {p}',{p:pname})),
q.kind==='multi'
?React.createElement("button",{className:"btn3d pill",onClick:()=>(multiReady?onAnswer({[q.field]:multi}):onSkip()),style:{width:'100%',padding:'16px',fontSize:15.5,fontWeight:800}},multiReady?tr('Next'):tr('Skip'))
:React.createElement("button",{className:"ckf-skip",onClick:onSkip},tr('Skip'))))));}
/* is this question answered in the record? (an answer, never a default) */
function ckfHasAnswer(q,rec){const v=rec[q.field];if(Array.isArray(v))return v.length>0;return v!=null&&v!=='';}
/* ---------- the closing screen ----------
   ADENDA §4 (7 Sep 2026): it says the day is saved and nothing else — no
   congratulation, no score, nothing won. Closing is the normal thing, so
   Close comes first. If anything was skipped, ONE quiet line offers it
   back — never a count in red, never a reproach, and nothing at all when
   nothing was skipped. */
function CkfDone({onClose,onJournal,onResume}){useT();
return React.createElement(React.Fragment,null,
React.createElement("div",{className:"ckf-top"},React.createElement("span",{style:{flex:1}}),React.createElement("button",{className:"ckf-ic",onClick:onClose,"aria-label":tr('Close')},Ic.x({width:16,height:16}))),
React.createElement("div",{className:"ckf-q done"},
React.createElement("div",{className:"ckf-halo",style:{width:68,height:68}},Ic.check({width:32,height:32})),
React.createElement("div",{className:"ckf-title"},tr('Your day is saved 💚')),
React.createElement("div",{className:"ckf-sub"},tr('Thank you for telling us. See you tomorrow.'))),
React.createElement("div",{className:"ckf-sheet"},
React.createElement("div",{className:"ckf-foot"},
React.createElement("button",{className:"btn3d pill",onClick:onClose,style:{width:'100%',padding:'17px',fontSize:16,fontWeight:800}},tr('Done')),
React.createElement("button",{className:"ckf-quiet",onClick:onJournal},tr('Open my journal')),
onResume&&React.createElement("button",{className:"ckf-quiet",onClick:onResume},tr('Go back to what you skipped')))));}
/* ---------- the flow itself ---------- */
function CFCheckinFlow({onClose}){useT();const day=ckfDay();
const[rec,setRec]=useCkfS(()=>ckfRaw(day));
const[curId,setCurId]=useCkfS(()=>ckfReadPos(day));
const[done,setDone]=useCkfS(false);
/* Health Sync may land while the flow is open (and always when the
   person comes back from connecting it) — re-read, never overwrite */
useCkfE(()=>{const f=()=>setRec(ckfRaw(day));window.addEventListener('cf-checkin-sync',f);window.addEventListener('cf-hs-changed',f);return()=>{window.removeEventListener('cf-checkin-sync',f);window.removeEventListener('cf-hs-changed',f);};},[day]);
const list=ckfBuild(rec);
let idx=curId?list.findIndex(q=>q.id===curId):0;if(idx<0)idx=0;
const q=list[idx];
useCkfE(()=>{if(q)ckfWritePos(day,q.id);},[day,q&&q.id]);// eslint-disable-line
/* The total is taken ONCE, when the flow opens: the fixed questions plus the
   blocks of the modules this person has on. Conditionals are not in it, so
   from here the number can only go down. */
const[total]=useCkfS(()=>Math.max(1,ckfBuild(ckfRaw(day)).filter(x=>!x.cond).length));
const finish=()=>{ckfClearPos();setDone(true);};
const step=(nextList,from)=>{const n=(nextList||list)[from+1];if(n)setCurId(n.id);else finish();};
const answer=patch=>{if(!q)return;let nextRec=rec;
if(patch){const saved=ckfSave(day,patch);nextRec=saved||{...rec,...patch};setRec(nextRec);}
else{const saved=ckfSave(day,{});nextRec=saved||rec;setRec(nextRec);}/* an OK on a synced answer still marks the day logged */
const nl=ckfBuild(nextRec);const j=nl.findIndex(x=>x.id===q.id);step(nl,j<0?idx:j);};
const skip=()=>step(list,idx);
const back=()=>{if(idx>0)setCurId(list[idx-1].id);};
const openJournal=()=>{try{window.dispatchEvent(new CustomEvent('cf-nav-tab',{detail:'schedule'}));}catch(e){}try{window.dispatchEvent(new CustomEvent('cf-journal-open-day',{detail:day}));}catch(e){}onClose();};
/* the first question still without an answer, for the closing screen */
const firstPending=list.filter(x=>!ckfHasAnswer(x,rec))[0]||null;
return React.createElement(SheetPortal,null,
React.createElement("div",{className:"ckf-ov",role:"dialog","aria-modal":"true"},
done||!q
?React.createElement(CkfDone,{onClose:onClose,onJournal:openJournal,onResume:firstPending?()=>{setCurId(firstPending.id);setDone(false);}:null})
:React.createElement(CkfQuestion,{q:q,rec:rec,index:idx,left:Math.max(1,Math.min(total,list.slice(idx).filter(x=>!x.cond).length)),pct:Math.round(((total-Math.min(total,list.slice(idx).filter(x=>!x.cond).length))/total)*100),onAnswer:answer,onSkip:skip,onBack:back,onClose:onClose})));}
/* ---------- the host: one mount, opened by the reminder ---------- */
function CFCheckinFlowHost(){const[open,setOpen]=useCkfS(false);
useCkfE(()=>{const f=()=>setOpen(true);window.CFCheckinFlowOpen=f;window.addEventListener('cf-checkin-flow',f);return()=>{window.removeEventListener('cf-checkin-flow',f);if(window.CFCheckinFlowOpen===f)delete window.CFCheckinFlowOpen;};},[]);
if(!open)return null;
return React.createElement(CFCheckinFlow,{onClose:()=>setOpen(false)});}
function cfOpenCheckinFlow(){try{if(typeof window.CFCheckinFlowOpen==='function'){window.CFCheckinFlowOpen();return true;}}catch(e){}try{window.dispatchEvent(new CustomEvent('cf-checkin-flow'));return true;}catch(e){}return false;}
Object.assign(window,{CFCheckinFlow,CFCheckinFlowHost,cfOpenCheckinFlow,ckfBuild,ckfHsInfo,CKF_MOD_Q,CKF_FLARE_TYPES});
})();
