(function(){/* ===================================================================
   THE EVENING FLOW, ROW BY ROW (checkinflowrows.jsx) — Gerhard,
   8 Sep 2026 (PROMPTCDrecorridonuevo).
   -------------------------------------------------------------------
   The flow used to draw its own full-screen question (one per screen,
   26–39 of them). It now shows the SAME questions GROUPED, and it does
   not draw a single row of its own: every row below is one of the
   Journal tab's own components, with the same props the form passes.
     checkin.jsx      CF_ParamRow · CF_SegSelect · CF_LevelScale ·
                      CF_Chips · CF_CheckSection · CF_GroupLabel
     modcheckin.jsx   SMCheckinSection · SMLevelRow · SMSegRow ·
                      SMChipsRow · SMNote
     checkinpulse.jsx CFConditionPulse (its own card, whole)
     bodymap.jsx      BodyMap (kind pain · skin · pelvic)

   🔴 NOT ONE TEXT IS WRITTEN HERE. Every label, option, min/max and
   placeholder is copied letter by letter from the component that
   already asks it, so the two ways speak with one voice and share the
   same 16 translations.
   🔴 A DEFAULT IS NOT AN ANSWER, and since TAP20 (16 Sep 2026) neither
   way writes one: a row with nothing answered shows «—» (the journal's
   own word for it) and its 0–10 ramp sits at zero. `ckfHas` is untouched:
   a 0 or a «No» somebody CHOSE is an answer.

   FIVE QUESTIONS ARE MISSING FROM THIS FILE ON PURPOSE (the poda of
   8 Sep 2026 — one measure, ONE question): mjPain and pvPain are the
   Pain Level of «How do you feel?», mdWeather is Mindset, mdSteady is
   the clean-day question, and `love` belongs to whoever does NOT carry
   the Mind tracker. Their FIELDS keep being written underneath by
   cfJournalMirror() (canonicalfanout.jsx).
   =================================================================== */
/* ---------- the module rows, exactly as modcheckin.jsx asks them ----------
   kind: level → SMLevelRow · seg → SMSegRow · chips → SMChipsRow ·
   note → SMNote. `lbl` = the two wordings of the Mind tracker's
   plain-language setting (smMindLbl). `gate` = smMindGates(). */
const CKF_MOD_ROWS={
/* musc — mjPain is asked once, as Pain Level */
mjStiff:{mod:'musc',kind:'seg',icon:'unlockpad',label:'Morning stiffness lasted…',options:['None','<15 min','15–60 min','>1 h']},
mjMobility:{mod:'musc',kind:'level',theme:'energy',icon:'run',label:'How does your body move today?',min:'Locked up',max:'Moving freely'},
mjZones:{mod:'musc',kind:'chips',icon:'bodymap',label:'Where do you feel it?',options:['Hands','Knees','Back','Neck','Hips','Shoulders']},
eyeDry:{mod:'eyes',kind:'level',icon:'eye',label:'Eye dryness',min:'Comfortable',max:'Very dry'},
eyeLight:{mod:'eyes',kind:'level',icon:'sun',label:'Light sensitivity',min:'None',max:'Very sensitive'},
eyeChips:{mod:'eyes',kind:'chips',icon:'spark',label:'Anything else today?',options:['Blurry vision','Redness','Eye pain']},
eyeNote:{mod:'eyes',kind:'note',ph:'e.g. screens felt harsh this afternoon…'},
skItch:{mod:'skin',kind:'level',icon:'mirror',label:'Itch today',min:'No itch',max:'Intense'},
skChips:{mod:'skin',kind:'chips',icon:'spark',label:'Anything new or changed?',options:['Rash','Eczema patch','Nodule','Mouth ulcer','Hair loss']},
skNote:{mod:'skin',kind:'note',ph:'e.g. new patch on left elbow…'},
/* pelvic — pvPain is asked once, as Pain Level */
pvBleed:{mod:'pelvic',kind:'seg',icon:'drop',label:'Bleeding today?',options:['None','Spotting','Normal','Heavy']},
pvUrin:{mod:'pelvic',kind:'chips',icon:'drop',label:'Bathroom comfort',options:['Pain','Urgency','Frequency']},
pvSpasm:{mod:'pelvic',kind:'seg',icon:'pulse',label:'Pelvic spasms?',options:['Yes','No']},
pvNote:{mod:'pelvic',kind:'note',ph:'anything you want to remember…'},
bhBreath:{mod:'breath',kind:'level',theme:'energy',icon:'lungs',label:'How did breathing feel today?',min:'Hard work',max:'Easy'},
bhCtx:{mod:'breath',kind:'chips',icon:'run',label:'Noticed when…',options:['At rest','Walking','Stairs']},
bhCough:{mod:'breath',kind:'seg',icon:'wind',label:'Cough today?',options:['None','Dry','Productive']},
bhChips:{mod:'breath',kind:'chips',icon:'heart',label:'Also felt…',options:['Wheezing','Palpitations']},
bhReliever:{mod:'breath',kind:'seg',icon:'pill',label:'Reliever inhaler used today',options:['0','1','2','3+'],min:'None',max:'Several'},
/* mind — mdWeather is Mindset · mdSteady is the clean-day question */
mdWorry:{mod:'mind',kind:'level',icon:'mind',label:'Worry & anxiety level',min:'Quiet mind',max:'Racing'},
mdConnect:{mod:'mind',kind:'seg',icon:'users',label:'Time with people today?',options:['Alone all day','A little','Plenty']},
mdSwing:{mod:'mind',kind:'seg',icon:'pulse',gate:'swing',wrap:true,lbl:['Mood dial — where did it sit?','Mood level today'],options:['Deep low','Low','Steady','Elevated','Racing high']},
mdUrge:{mod:'mind',kind:'seg',icon:'wave',gate:'urges',label:'Urges or cravings today?',options:['None','Passing','Strong']},
mdFocus:{mod:'mind',kind:'level',theme:'energy',icon:'timer',gate:'focus',label:'Focus today',min:'Scattered',max:'Locked in'},
mdChips:{mod:'mind',kind:'chips',icon:'spark',label:'Your mind also felt…',options:['Racing thoughts','Low motivation','Irritable','Restless','Tearful','Calm']},
mdNote:{mod:'mind',kind:'note',ph:'e.g. big meeting, slept 5h, good walk with Ana…'},
enFog:{mod:'univ',kind:'seg',icon:'fog',label:'Head today?',options:['Clear','Foggy','Very foggy']},
enDizzy:{mod:'univ',kind:'seg',icon:'pulse',label:'Dizzy on standing today?',options:['0','1','2','3+'],min:'Not once',max:'Often'},
enChips:{mod:'univ',kind:'chips',icon:'spark',label:'Also today…',options:['Felt feverish','Heart raced at rest']},
digCtx:{mod:'dig',kind:'chips',icon:'gut',label:'Context (your conditions)'},/* options come from CFModules.digCtxOptions() */
digGas:{mod:'dig',kind:'seg',icon:'gut',label:'Gas or bloating today?',options:['Yes','No']},
};
function ckfHas(v){return v!=null&&v!==''&&!(Array.isArray(v)&&!v.length);}
function ckfModColorOf(mod){const m=(window.SM_MOD_BY||{})[mod];return(m&&m.color)||(window.PC&&PC.nature)||['#9fe07a','#4e9c3f'];}
function ckfDigCtx(){try{return(window.CFModules&&CFModules.digCtxOptions())||[];}catch(e){return[];}}
function ckfRowLabel(d){try{return d.lbl&&window.smMindLbl?smMindLbl(d.lbl[0],d.lbl[1]):tr(d.label);}catch(e){return tr(d.label||'');}}
/* ---------- a module row — modcheckin.jsx's own row components ---------- */
function CkfModRow({field,rec,update}){const d=CKF_MOD_ROWS[field];
const Level=window.SMLevelRow,Seg=window.SMSegRow,ChipsR=window.SMChipsRow,Note=window.SMNote;
if(!d||!Level||!Seg||!ChipsR||!Note)return null;
const color=ckfModColorOf(d.mod);const set=v=>update({[field]:v});
if(d.kind==='note')return React.createElement(Note,{value:rec[field],onChange:set,ph:tr(d.ph)});
if(d.kind==='level')return React.createElement(Level,{icon:Ic[d.icon],color:color,label:ckfRowLabel(d),value:rec[field],onChange:set,minLabel:tr(d.min),maxLabel:tr(d.max),theme:d.theme||'pain'});
if(d.kind==='chips'){const arr=rec[field]||[];const opts=d.options||ckfDigCtx();
return React.createElement(ChipsR,{icon:Ic[d.icon],color:color,label:ckfRowLabel(d),options:opts,value:arr,onToggle:o=>set(arr.indexOf(o)>=0?arr.filter(x=>x!==o):arr.concat([o]))});}
return React.createElement(Seg,{icon:Ic[d.icon],color:color,label:ckfRowLabel(d),options:d.options,value:rec[field],onChange:set,minLabel:d.min?tr(d.min):undefined,maxLabel:d.max?tr(d.max):undefined,wrap:d.wrap});}
/* ---------- a core row — checkin.jsx's own Seg() / pain / energy ----------
   The 0–10 pair keeps the form's exact icon and value colours; the only
   difference is the honest «—» while nothing has been answered. */
function CkfLevel({field,icon,iconColor,valColor,label,min,max,theme,rec,update}){
const ParamRow=window.CF_ParamRow,LevelScale=window.CF_LevelScale;if(!ParamRow||!LevelScale)return null;
const v=rec[field],has=ckfHas(v);
return React.createElement(ParamRow,{icon:icon({width:17,height:17}),iconColor:iconColor,label:tr(label),value:has?v:'—',valueColor:has?valColor:'var(--muted-2)'},
React.createElement(LevelScale,{value:has?v:0,onChange:x=>update({[field]:x}),theme:theme,minLabel:tr(min),maxLabel:tr(max)}));}
function CkfSeg({pKey,rec,update}){const p=(window.byKey||{})[pKey];
const ParamRow=window.CF_ParamRow,SegSelect=window.CF_SegSelect;if(!p||!ParamRow||!SegSelect)return null;
const v=rec[pKey],has=ckfHas(v);
return React.createElement(ParamRow,{icon:p.icon({width:17,height:17}),iconColor:p.color[1],label:tr(p.label),value:has?tx(v):'—',valueColor:has?p.color[1]:'var(--muted-2)'},
React.createElement(SegSelect,{options:p.options,value:v,onChange:x=>update({[pKey]:x}),color:p.color,wrap:p.wrap,minLabel:p.minLabel,maxLabel:p.maxLabel}));}
/* substances: the form's own chip row, «None» included (cfSubstArr) */
function CkfSubst({rec,update}){const p=(window.byKey||{})['subst'];
const ParamRow=window.CF_ParamRow,Chips=window.CF_Chips;if(!p||!ParamRow||!Chips)return null;
const arr=window.cfSubstArr?cfSubstArr(rec.subst):(Array.isArray(rec.subst)?rec.subst:[]);
const said=Array.isArray(rec.subst)||ckfHas(rec.subst);/* «None» is an answer too */
const toggle=o=>{if(o==='None'){update({subst:[]});return;}update({subst:arr.indexOf(o)>=0?arr.filter(x=>x!==o):arr.concat([o])});};
return React.createElement(ParamRow,{icon:p.icon({width:17,height:17}),iconColor:p.color[1],label:tr(p.label),value:arr.length?arr.map(s=>tx(s)).join(', '):said?tx('None'):'—',valueColor:arr.length?p.color[1]:'var(--muted-2)'},
React.createElement(Chips,{options:['None','THC','CBD','Coke','MDMA','Amph','Keta','Other'],value:arr.length?arr:['None'],onToggle:toggle,color:p.color}));}
/* the pain comment — optional, and the keyboard only ever opens if the
   person taps it themselves (no autofocus, here or anywhere in the flow) */
function CkfPainNote({rec,update}){const flare=window.cfFlareUI&&cfFlareUI();
return React.createElement("div",null,
React.createElement("div",{style:{display:'flex',alignItems:'center',gap:8,marginBottom:8}},
React.createElement("span",{className:"eyebrow",style:{color:'var(--ink-soft)'}},tr('Pain comment')),
React.createElement("span",{style:{fontSize:10.5,fontWeight:700,color:'var(--muted-2)',background:flare?'rgba(160,210,255,.12)':'#eef3e8',padding:'2px 8px',borderRadius:10}},tr('optional'))),
React.createElement("input",{value:rec.painNote||'',onChange:e=>update({painNote:e.target.value}),placeholder:tr('e.g. felt pain in my lower back today…'),style:{width:'100%',border:'none',outline:'none',background:'var(--white)',borderRadius:14,padding:'13px 15px',fontFamily:'inherit',fontSize:13,boxShadow:'inset 0 2px 5px rgba(60,80,55,.12),0 2px 6px rgba(30,60,30,.05)'}}));}
/* a conditional sub-question, indented under its trigger exactly as the
   form indents «Sun protection used?» */
function CkfSub({color,children}){const hexA=window.CF_hexA;
return React.createElement("div",{style:{marginTop:-8,marginLeft:5,paddingLeft:15,borderLeft:'2px solid '+(hexA?hexA(color[1],.35):color[1])}},children);}
function CkfSunProtect({rec,update}){const ParamRow=window.CF_ParamRow,SegSelect=window.CF_SegSelect,col=(window.PC||{}).sunlight||['#f5cf4e','#dfa50f'];
if(!ParamRow||!SegSelect)return null;const has=ckfHas(rec.sunProtect);
return React.createElement(CkfSub,{color:col},
React.createElement(ParamRow,{icon:Ic.shield({width:16,height:16}),iconColor:col[1],label:tr('Sun protection used?'),value:has?tx(rec.sunProtect):'—',valueColor:has?col[1]:'var(--muted-2)'},
React.createElement(SegSelect,{options:['Yes','No'],value:rec.sunProtect,onChange:v=>update({sunProtect:v}),color:col})));}
/* the five flare areas — the journal's own `flareTypes` values, asked with
   the chip row and the label the flow already ships in 16 languages */
function CkfFlareTypes({rec,update}){const ParamRow=window.CF_ParamRow,Chips=window.CF_Chips,col=(window.PC||{}).flare||['#f6a96b','#e07d2c'];
if(!ParamRow||!Chips)return null;
const arr=Array.isArray(rec.flareTypes)?rec.flareTypes:(ckfHas(rec.flareTypes)?[rec.flareTypes]:[]);
const opts=window.CKF_FLARE_TYPES||['Diarrhea','Uveitis','Arthritis','Dermatitis','Psoriasis'];
return React.createElement(CkfSub,{color:col},
React.createElement(ParamRow,{icon:Ic.spark({width:16,height:16}),iconColor:col[1],label:tr('Which areas are flaring?'),value:arr.length?String(arr.length):'—',valueColor:arr.length?col[1]:'var(--muted-2)'},
React.createElement(Chips,{options:opts,value:arr,onToggle:o=>update({flareTypes:arr.indexOf(o)>=0?arr.filter(x=>x!==o):arr.concat([o])}),color:col})));}
/* ---------- one row, whichever kind it is ---------- */
function CkfRow({it,rec,store,date,update}){
if(it.k==='mod')return React.createElement(CkfModRow,{field:it.field,rec:rec,update:update});
if(it.k==='life')return React.createElement(CkfSeg,{pKey:it.key,rec:rec,update:update});
if(it.k==='flare')return React.createElement(CkfSeg,{pKey:"flare",rec:rec,update:update});
if(it.k==='flareTypes')return React.createElement(CkfFlareTypes,{rec:rec,update:update});
if(it.k==='sunProtect')return React.createElement(CkfSunProtect,{rec:rec,update:update});
if(it.k==='subst')return React.createElement(CkfSubst,{rec:rec,update:update});
if(it.k==='painNote')return React.createElement(CkfPainNote,{rec:rec,update:update});
if(it.k==='pain')return React.createElement(CkfLevel,{field:"pain",icon:Ic.flame,iconColor:"#d6584a",valColor:"#c0392b",label:"Pain Level",min:"No pain",max:"Worst",theme:"pain",rec:rec,update:update});
if(it.k==='energy')return React.createElement(CkfLevel,{field:"energy",icon:Ic.bolt,iconColor:"#2f7a35",valColor:"#2f7a35",label:"Energy Level",min:"Very low",max:"Full of energy",theme:"energy",rec:rec,update:update});
if(it.k==='hs'&&window.CFHSSyncLine)return React.createElement(CFHSSyncLine,{k:it.field,rec:rec,date:date});
if(it.k==='pulse'&&window.CFConditionPulse)return React.createElement(CFConditionPulse,{date:date,rec:rec,update:update,store:store});
return null;}
/* ---------- is this row answered? (an answer, never a default) ----------
   A note is always «answered»: it is optional and must never hold a screen
   back. The condition card counts every question it draws. */
function ckfPulseDefs(){try{return(window.cpDefs&&cpDefs())||[];}catch(e){return[];}}
function ckfRowField(it){
if(it.k==='life')return it.key;
if(it.k==='mod')return it.field;
if(it.k==='pain'||it.k==='energy'||it.k==='subst'||it.k==='flare'||it.k==='flareTypes'||it.k==='sunProtect')return it.k;
return null;}
function ckfRowOptional(it){
if(it.k==='painNote'||it.k==='hs')return true;
if(it.k==='mod'){const d=CKF_MOD_ROWS[it.field];return!!(d&&d.kind==='note');}
return false;}
function ckfRowMulti(it){
if(it.k==='flareTypes'||it.k==='subst')return true;
if(it.k==='mod'){const d=CKF_MOD_ROWS[it.field];return!!(d&&d.kind==='chips');}
return false;}
function ckfRowAnswered(it,rec){
if(ckfRowOptional(it))return true;
if(it.k==='pulse'){const defs=ckfPulseDefs();return defs.length?defs.every(d=>ckfHas(rec[d.field])):true;}
if(it.k==='subst')return Array.isArray(rec.subst)||ckfHas(rec.subst);/* «None» is an answer, and it is an empty array */
const f=ckfRowField(it);return f?ckfHas(rec[f]):true;}
/* ===================================================================
   THE BODY MAPS — the same BodyMap, on a screen of its own
   -------------------------------------------------------------------
   There are THREE (musc/pain · skin · pelvic) and none of them ever
   disappears: the poda took away repeated questions, never a map. The
   card is bodymap.jsx untouched — it already opens with the zones of
   the last day painted (latestOf(), no date test) and tapping a zone
   still opens its sheet.
   The flow adds ONE thing: a single tap that says «today looks like
   that too» (ckfMapCarry → CFModLogs.addZone, the way of always).
   🔴 And Skip writes NOTHING. If skipping saved yesterday's zones, a
   day somebody walked past would read «pain in the hand» in the PDF
   their doctor opens without them ever having said it — the very lie
   of the blue button that died on 7 Sep.
   🔴 The carry copies the VALUE and never the words: `v` only, no note
   and no type chips. Yesterday's «worse after sitting» is yesterday's
   sentence.
   =================================================================== */
function ckfMapToday(){try{return(window.CF_TODAY)||cfDayKey();}catch(e){return new Date().toISOString().slice(0,10);}}
function ckfMapZones(kind){try{return(window.CFModLogs&&CFModLogs.zoneAll(kind))||{};}catch(e){return{};}}
/* zones carried over from an earlier day that today does not have yet */
function ckfMapPending(kind){const all=ckfMapZones(kind),d=ckfMapToday();
return Object.keys(all).filter(z=>{const es=all[z]||[];if(!es.length||es.some(e=>e&&e.d===d))return false;return es[es.length-1].v!=null;});}
function ckfMapLoggedToday(kind){const all=ckfMapZones(kind),d=ckfMapToday();
return Object.keys(all).filter(z=>(all[z]||[]).some(e=>e&&e.d===d)).length;}
function ckfMapCarry(kind){const all=ckfMapZones(kind),d=ckfMapToday();
ckfMapPending(kind).forEach(z=>{const es=all[z]||[],last=es[es.length-1];if(!last)return;
try{CFModLogs.addZone(kind,z,{d:d,ts:Date.now(),v:last.v,note:''});}catch(e){}});}
function CkfMapCard({mapKind,mod}){if(!window.BodyMap)return null;
return React.createElement("div",{className:"ckf-map"},React.createElement(BodyMap,{kind:mapKind,accent:ckfModColorOf(mod)}));}
Object.assign(window,{CKF_MOD_ROWS,CkfRow,CkfModRow,CkfMapCard,ckfRowAnswered,ckfRowOptional,ckfRowMulti,ckfRowField,ckfPulseDefs,ckfHas,ckfModColorOf,ckfDigCtx,ckfMapPending,ckfMapCarry,ckfMapLoggedToday,ckfMapToday});
})();
