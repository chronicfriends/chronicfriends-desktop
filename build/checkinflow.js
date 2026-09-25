(function(){/* ===================================================================
   THE DAILY CHECK-IN FLOW (checkinflow.jsx) — THE JOURNAL'S OWN
   SCREENS, GROUPED. Decided by Gerhard, 8 Sep 2026
   (PROMPTCDrecorridonuevo). Replaces the one-question-per-screen route
   of 7 Sep, which was right about the tap and wrong about the count:
   26 to 39 screens is too many, and a question drawn by this file
   looked like nothing else in the app.
   -------------------------------------------------------------------
   Still the SECOND way of filling the journal, the one almost
   everybody will use: the reminder chimes in the evening and the whole
   day is answered by tapping. What changed is the shape — 10 to 15
   screens, each one a GROUP of the Journal tab, drawn with the Journal
   tab's own cards (checkinflowrows.jsx mounts them).

   THE RULES OF THE SCREEN (non-negotiable):
     1. One TAP answers. The screen NEVER moves on by itself: the foot
        button is the only way forward (Gerhard, 16 Sep 2026 — TAP20).
        No timer for any kind of screen: maps, multi-select and
        single-tap screens all wait for the foot button, and that
        button always says «Next» (rule 4).
        🔴 Why the 420 ms self-advance died: a screen with three
        questions left on its own when the SECOND was answered, and the
        third was never asked.
     2. Never a scrollbar. The groups are cut so that each screen fits
        the 393×852 frame this app is drawn for; `.ckf-body` keeps a
        hidden overflow as a SAFETY NET (a shorter phone, a language
        that wraps twice — a question nobody can reach would be worse
        than a scroll nobody needs).
     3. The keyboard NEVER opens by itself. The optional notes (the
        pain comment and the four tracker notes) are on the screen of
        their group and stay silent until tapped.
     4. The foot pill ALWAYS reads «Next», and it is always visible
        (Gerhard, 17 Sep 2026 — TAP22): moving on without answering IS
        allowed and saves nothing new — the record keeps only what was
        touched (TAP20). «Skip» said the opposite of what the tap did
        on a screen whose answers HAD been written, so people stopped
        trusting their own journal.
     5. Back goes back. The X leaves — what was answered is saved.
     6. The screen counter is visible from the first screen: 3 / 15,
        the app's own «i / n». It can never rise: a conditional
        question lives INSIDE its screen, never in one of its own.
     7. The three body maps go alone on their screen, and none of them
        ever disappears.

   Storage: the SAME record as the form — cf-checkins[YYYY-MM-DD], same
   keys, no new field, written through CF_saveStore so the canonical
   fan-out and the journal mirror run exactly as for the form. Every
   answer is written the moment it is given. 🔴 A DEFAULT IS NOT AN
   ANSWER, and since TAP20 (16 Sep 2026) on both sides: the flow never
   spread CF_DEFAULTS into a day, and the form's own update() no longer
   does either.
   =================================================================== */
const{useState:useCkfS,useEffect:useCkfE}=React;
const CKF_POS_KEY='cf_ckflow_pos_v1';
/* the five flare areas the journal has always stored in `flareTypes`
   (RF_FT_MAP, flaremode.jsx — same spelling, same 16 translations) */
const CKF_FLARE_TYPES=['Diarrhea','Uveitis','Arthritis','Dermatitis','Psoriasis'];
/* ---------- the day, the record, the write ---------- */
function ckfDay(){try{return window.cfDayKey?cfDayKey():new Date().toISOString().slice(0,10);}catch(e){return new Date().toISOString().slice(0,10);}}
function ckfStore(){try{return(window.CF_loadStore&&CF_loadStore())||{};}catch(e){return{};}}
/* the RAW record — only what was really answered (or synced) */
function ckfRaw(day){const r=ckfStore()[day];return r&&typeof r==='object'?r:{};}
function ckfSave(day,patch){const prev=ckfStore();const next={...prev,[day]:{...(prev[day]||{}),...patch,_checkedIn:true}};
try{if(window.CF_saveStore)CF_saveStore(next);else localStorage.setItem('cf-checkins',JSON.stringify(next));}catch(e){}
try{window.dispatchEvent(new Event('cf-checkin-sync'));}catch(e){}return next[day];}
/* where the person was, so a trip to the system permission sheet (or a
   phone call) comes back to the SAME screen */
function ckfReadPos(day){try{const p=JSON.parse(localStorage.getItem(CKF_POS_KEY)||'null');return p&&p.d===day&&p.id?p.id:null;}catch(e){return null;}}
function ckfWritePos(day,id){try{localStorage.setItem(CKF_POS_KEY,JSON.stringify({d:day,id:id}));}catch(e){}}
function ckfClearPos(){try{localStorage.removeItem(CKF_POS_KEY);}catch(e){}}
/* ---------- which trackers this person carries ---------- */
function ckfModOn(mod){try{return!window.CFModules||CFModules.isOn(mod);}catch(e){return true;}}
/* the Mind tracker specifically: absent layer ⇒ false, so `love` stays
   asked (absence = the app as it was) */
function ckfHasMod(mod){try{return!!(window.CFModules&&CFModules.isOn(mod));}catch(e){return false;}}
function ckfUnivOn(){try{return!window.CFModules||CFModules.activeList().some(m=>m.id==='univ');}catch(e){return true;}}
function ckfMindGates(){try{return(window.smMindGates&&smMindGates())||{};}catch(e){return{};}}
/* ===================================================================
   THE SCREENS, IN THE ORDER OF THE FORM ITSELF
   A screen that does not apply to this person does not exist (it is
   never drawn empty). Nothing here is a new question, and the group
   titles are the form's own.
   =================================================================== */
function ckfScreens(rec){const r=rec||{},S=[];
const dig=ckfModOn('dig');const mindTracker=ckfHasMod('mind');
const push=s=>{if(s.items&&s.items.length)S.push(s);};
const sec=(id,icon,title,group,items,head)=>push({id:id,kind:'section',icon:icon,title:title,group:group,head:head!==false,items:items.filter(Boolean)});
/* S1 · how the illness itself is going: the flare question, its areas
   right underneath when the answer is yes, and the condition-adapted
   question (checkinpulse.jsx, its whole card) */
const first=[{k:'flare'}];
if(r.flare==='Yes')first.push({k:'flareTypes'});
if(ckfPulseDefs().length)first.push({k:'pulse'});
push({id:'day',kind:'plain',items:first});
/* S2 · Pain and Energy travel together, with the pain comment between
   them, exactly as «How do you feel?» has always done */
sec('feel','heart','How do you feel?',null,[{k:'pain'},{k:'painNote'},{k:'energy'}]);
/* S3–S8 · «Building a good day», one group label per screen. The big card
   header (badge + section title) is drawn ONCE, on the first screen of the
   section, exactly as the Journal tab draws it once for the whole section:
   from there on the group label is the heading, which is what the tab looks
   like when you are scrolled into it. It also gives the two densest groups
   the 64 px they need to fit in German, French and Italian without a split. */
let head=true;
const bag=(id,group,items)=>{const n=S.length;sec(id,'clip','Building a good day',group,items,head);if(S.length>n)head=false;};
bag('sym','Symptoms & Body',[dig&&{k:'life',key:'bowel'},{k:'life',key:'water'},{k:'life',key:'sleep'},{k:'hs',field:'sleep'}]);
bag('act','Lifestyle & Habits',[{k:'life',key:'move'},{k:'life',key:'steps'},{k:'hs',field:'steps'}]);
bag('out','Lifestyle & Habits',[{k:'life',key:'nature'},{k:'life',key:'animals'},{k:'life',key:'sunlight'},(r.sunlight==='1–2h'||r.sunlight==='+3h')&&{k:'sunProtect'}]);
bag('hab','Lifestyle & Habits',[{k:'life',key:'tv'},{k:'life',key:'tobacco'},{k:'life',key:'alcohol'},{k:'subst'}]);
/* 🔴 Mindset is asked of EVERYBODY now (the poda: it is the question that
   stays in place of the Mind tracker's inner weather), and «Time with
   loved ones?» only of whoever does NOT carry that tracker — with it on,
   «Time with people today?» is the question. */
bag('people','Mind & People',[{k:'life',key:'mindset'},!mindTracker&&{k:'life',key:'love'},{k:'life',key:'toxic'}]);
bag('care','Mind & People',[{k:'life',key:'meditate'},{k:'life',key:'relaxed'},{k:'life',key:'music'},{k:'life',key:'sing'},{k:'life',key:'dance'}]);
/* the trackers, in SM_BLOCKS order — every map on a screen of its own,
   right after the tracker it belongs to; digestion's extra is last */
const modS=(id,mod,fields)=>push({id:id,kind:'mod',mod:mod,items:fields.filter(Boolean).map(f=>({k:'mod',field:f}))});
const map=(mod,mapKind)=>S.push({id:mod+'.map',kind:'map',mod:mod,mapKind:mapKind,items:[]});
if(ckfModOn('musc')){modS('musc','musc',['mjStiff','mjMobility','mjZones']);map('musc','pain');}
if(ckfModOn('eyes'))modS('eyes','eyes',['eyeDry','eyeLight','eyeChips','eyeNote']);
if(ckfModOn('skin')){modS('skin','skin',['skItch','skChips','skNote']);map('skin','skin');}
if(ckfModOn('pelvic')){modS('pelvic','pelvic',['pvBleed','pvUrin','pvSpasm','pvNote']);map('pelvic','pelvic');}
if(ckfModOn('breath')){modS('breath','breath',['bhBreath','bhCtx']);modS('breath2','breath',['bhCough','bhChips','bhReliever']);}
if(ckfModOn('mind')){modS('mind1','mind',['mdWorry','mdConnect','mdChips','mdNote']);
const g=ckfMindGates();modS('mind2','mind',[g.swing&&'mdSwing',g.urges&&'mdUrge',g.focus&&'mdFocus']);}
if(ckfUnivOn())modS('univ','univ',['enFog','enDizzy','enChips']);
if(dig){const ctx=ckfDigCtx();modS('dig','dig',[ctx.length&&'digCtx','digGas']);}
return S;}
/* ---------- is the screen answered? (nothing advances on its own) ---------- */
function ckfScreenAnswered(scr,rec){if(!scr)return true;
if(scr.kind==='map')return ckfMapLoggedToday(scr.mapKind)>0;
return(scr.items||[]).every(it=>ckfRowAnswered(it,rec));}
/* TAP20 (Gerhard, 16 Sep 2026): NOTHING auto-advances any more. The
   function and its window export stay so nobody who calls it breaks. */
function ckfScreenAuto(scr,rec){return false;}
/* ---------- the body of a screen: the Journal tab's own cards ---------- */
function CkfBody({scr,rec,store,day,update}){
const CheckSection=window.CF_CheckSection,GroupLabel=window.CF_GroupLabel,SMSection=window.SMCheckinSection;
const row=(it,i)=>React.createElement(CkfRow,{key:(it.field||it.key||it.k)+'.'+i,it:it,rec:rec,store:store,date:day,update:update});
if(scr.kind==='map')return React.createElement(CkfMapCard,{mapKind:scr.mapKind,mod:scr.mod});
/* the tracker's own section chrome (badge, name, «{n} logged today»), with
   its questions given from here and its tools & logs left out — the maps
   have their own screen and the rest of the tools belong to the Journal
   tab, not to a 40-second evening pass */
if(scr.kind==='mod'&&SMSection)return React.createElement(SMSection,{mod:scr.mod,rec:rec,update:update,alwaysOpen:true,noTools:true},scr.items.map(row));
if(scr.kind==='plain'){const plain=scr.items.filter(it=>it.k!=='pulse'),pulse=scr.items.filter(it=>it.k==='pulse');
return React.createElement(React.Fragment,null,
plain.length>0&&React.createElement("div",{className:"card-solid",style:{padding:'18px 18px 20px',marginBottom:16,display:'flex',flexDirection:'column',gap:20}},plain.map(row)),
pulse.map(row));}
if(!CheckSection)return null;
/* a continuation screen of the same section: the same card, the same group
   label, no repeated section header (see ckfScreens) */
if(!scr.head)return React.createElement("div",{className:"card-solid",style:{padding:'18px 18px 20px',marginBottom:16,display:'flex',flexDirection:'column',gap:20}},
scr.group?React.createElement(GroupLabel,{key:"group"},tr(scr.group)):null,
scr.items.map(row));
return React.createElement(CheckSection,{icon:Ic[scr.icon](),title:tr(scr.title)},
scr.group?React.createElement(GroupLabel,{key:"group"},tr(scr.group)):null,
scr.items.map(row));}
/* ---------- the foot of a map screen ----------
   TAP22 (17 Sep 2026): the pill is «Next» and nothing else, on all three
   maps and in every state. When an earlier day left zones painted, ONE
   quiet line ABOVE the pill offers to carry them over — «Save for today»,
   the Body Map's own string (i18ngap2c) — and that line is the only thing
   on this screen that writes. The rule of 8 Sep is untouched: «Next»
   without touching anything writes NOT ONE entry with today's date. */
function CkfMapFoot({mapKind,onNext,onCarry}){
const pending=ckfMapPending(mapKind).length;
return React.createElement(React.Fragment,null,
pending>0&&React.createElement("button",{className:"ckf-quiet",onClick:onCarry},tr('Save for today')),
React.createElement("button",{className:"btn3d pill",onClick:onNext,style:{width:'100%',padding:'16px',fontSize:15.5,fontWeight:800}},tr('Next')));}
/* ---------- one screen ---------- */
function CkfScreen({scr,rec,store,day,update,index,total,onNext,onBack,onClose,onCarry}){useT();
const pct=Math.round(((index+1)/Math.max(1,total))*100);
return React.createElement(React.Fragment,null,
React.createElement("div",{className:"ckf-top"},
React.createElement("button",{className:"ckf-ic",onClick:onBack,disabled:index===0,"aria-label":tr('Previous step'),style:{opacity:index===0?.35:1}},Ic.back({width:18,height:18})),
React.createElement("div",{className:"ckf-bar"},React.createElement("i",{style:{width:pct+'%'}})),
/* the screen counter, visible from the first screen. Numbers only: it says
   where you are and how many there are, and it can never rise. */
React.createElement("span",{className:"ckf-count"},(index+1)+' / '+total),
React.createElement("button",{className:"ckf-ic",onClick:onClose,"aria-label":tr('Close')},Ic.x({width:16,height:16}))),
React.createElement("div",{className:"ckf-sheet ckf-group"},
React.createElement("div",{className:"ckf-body no-scrollbar",key:scr.id},React.createElement(CkfBody,{scr:scr,rec:rec,store:store,day:day,update:update})),
React.createElement("div",{className:"ckf-foot"},
scr.kind==='map'
?React.createElement(CkfMapFoot,{mapKind:scr.mapKind,onNext:onNext,onCarry:onCarry})
:React.createElement("button",{className:"btn3d pill",onClick:onNext,style:{width:'100%',padding:'16px',fontSize:15.5,fontWeight:800}},tr('Next')))));}
/* ---------- the closing screen ----------
   It says the day is saved and nothing else — no congratulation, no score.
   If anything was left, ONE quiet line offers it back. */
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
function CFCheckinFlow({onClose}){useT();
const day=ckfDay();
const[rec,setRec]=useCkfS(()=>ckfRaw(day));
const[store,setStore]=useCkfS(ckfStore);
const[curId,setCurId]=useCkfS(()=>ckfReadPos(day));
const[done,setDone]=useCkfS(false);
const[,setTick]=useCkfS(0);/* the maps live in another store */
useCkfE(()=>{const f=()=>{setRec(ckfRaw(day));setStore(ckfStore());};const g=()=>setTick(n=>n+1);
window.addEventListener('cf-checkin-sync',f);window.addEventListener('cf-hs-changed',f);window.addEventListener('cf-modlogs-updated',g);
return()=>{window.removeEventListener('cf-checkin-sync',f);window.removeEventListener('cf-hs-changed',f);window.removeEventListener('cf-modlogs-updated',g);};},[day]);
const list=ckfScreens(rec);
let idx=curId?list.findIndex(s=>s.id===curId):0;if(idx<0)idx=0;
const scr=list[idx];
/* the position is kept by screen ID, never by index */
useCkfE(()=>{if(scr)ckfWritePos(day,scr.id);},[day,scr&&scr.id]);// eslint-disable-line
const finish=()=>{ckfClearPos();setDone(true);};
const next=()=>{const n=list[idx+1];if(n)setCurId(n.id);else finish();};
const back=()=>{if(idx>0)setCurId(list[idx-1].id);};
const update=patch=>{const saved=ckfSave(day,patch);setRec(saved||{...rec,...patch});setStore(ckfStore());};
const carry=()=>{if(scr&&scr.mapKind)ckfMapCarry(scr.mapKind);next();};
/* TAP20 (Gerhard, 16 Sep 2026): the screen never moves on by itself; only
   the foot button. */
const openJournal=()=>{try{window.dispatchEvent(new CustomEvent('cf-nav-tab',{detail:'schedule'}));}catch(e){}
try{window.dispatchEvent(new CustomEvent('cf-journal-open-day',{detail:day}));}catch(e){}onClose();};
/* the first screen still holding something unanswered */
const firstPending=list.filter(s=>!ckfScreenAnswered(s,rec))[0]||null;
return React.createElement(SheetPortal,null,
React.createElement("div",{className:"ckf-ov",role:"dialog","aria-modal":"true"},
done||!scr
?React.createElement(CkfDone,{onClose:onClose,onJournal:openJournal,onResume:firstPending?()=>{setCurId(firstPending.id);setDone(false);}:null})
:React.createElement(CkfScreen,{scr:scr,rec:rec,store:store,day:day,update:update,index:idx,total:list.length,onNext:next,onBack:back,onClose:onClose,onCarry:carry})));}
/* ---------- the host: one mount, opened by the reminder ---------- */
function CFCheckinFlowHost(){const[open,setOpen]=useCkfS(false);
useCkfE(()=>{const f=()=>setOpen(true);window.CFCheckinFlowOpen=f;window.addEventListener('cf-checkin-flow',f);
return()=>{window.removeEventListener('cf-checkin-flow',f);if(window.CFCheckinFlowOpen===f)delete window.CFCheckinFlowOpen;};},[]);
if(!open)return null;
return React.createElement(CFCheckinFlow,{onClose:()=>setOpen(false)});}
function cfOpenCheckinFlow(){try{if(typeof window.CFCheckinFlowOpen==='function'){window.CFCheckinFlowOpen();return true;}}catch(e){}
try{window.dispatchEvent(new CustomEvent('cf-checkin-flow'));return true;}catch(e){}return false;}
Object.assign(window,{CFCheckinFlow,CFCheckinFlowHost,cfOpenCheckinFlow,ckfScreens,ckfScreenAnswered,ckfScreenAuto,CKF_FLARE_TYPES});
})();
