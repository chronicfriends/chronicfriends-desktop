(function(){/* ===================================================================
   USER PROFILE — a tiny shared store for the signed-in person.
   Holds name, status line and avatar (uploaded photo OR a colour with
   initials). Persists to localStorage so edits stick across reloads,
   and notifies subscribers (avatar, welcome bar, settings, posts…).
   =================================================================== */const CF_PROFILE_KEY='cf_profile_v1';const CF_PROFILE_DEFAULTS={name:'Gerard',email:'gerard@crohnfriends.app',status:'',// optional short status / bio line
country:null,// nationality (English country name; flag/翻訳 derived from it)
avatarPhoto:null,// dataURL of an uploaded photo
avatarColor:null// hex of a chosen colour avatar (with initials)
};/* curated avatar colours (shared chroma/lightness, varied hue) */const CF_AVATAR_COLORS=['#3f8a3f','#1fa596','#2f7fd4','#7556d0','#d4569e','#d98a26','#c0563f'];function cfLoadProfile(){try{const r=JSON.parse(localStorage.getItem(CF_PROFILE_KEY));if(r&&typeof r==='object')return cfWithSessionEmail({...CF_PROFILE_DEFAULTS,...r});}catch(e){}return cfWithSessionEmail({...CF_PROFILE_DEFAULTS});}/* The signed-in email is the session's source of truth (the email used to
   log in). It is NOT user-editable, so always surface it over any stored /
   default profile email — that way Settings shows whoever is logged in. */function cfSessionEmail(){try{const a=JSON.parse(localStorage.getItem('cf_auth_v1'));/* shared, un-namespaced */return a&&a.email?a.email:null;}catch(e){return null;}}function cfWithSessionEmail(obj){const se=cfSessionEmail();if(se)obj.email=se;return obj;}const CFProfile={data:cfLoadProfile(),listeners:new Set(),subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);},persist(){try{localStorage.setItem(CF_PROFILE_KEY,JSON.stringify(this.data));}catch(e){}},emit(){this.persist();this.listeners.forEach(fn=>fn());},get(){return cfWithSessionEmail({...this.data});},update(patch){this.data={...this.data,...patch};this.emit();},firstName(){return(this.data.name||'Gerard').trim().split(/\s+/)[0];},initials(){const parts=(this.data.name||'G').trim().split(/\s+/).filter(Boolean);const a=parts[0]?parts[0][0]:'G';const b=parts.length>1?parts[parts.length-1][0]:'';return(a+b).toUpperCase();}};/* ---------------------------------------------------------------------------
   DOCTOR TITLE — gender + language aware (single source of truth).
   The data model stores `docTitle` ('none' | 'doctor') and `docGender`
   ('m' | 'f' | 'x'); the visible abbreviation is rendered at runtime from the
   ACTIVE app language, so switching language re-renders the correct form.

     lang     m        f           x / neutral
     es / ca  Dr.      Dra.        Dr.
     pt       Dr.      Dra.        Dr.
     it       Dott.    Dott.ssa    Dott.
     fr       Dr       Dre         Dr
     en       Dr       Dr          Dr      (no gender distinction)
     de       Dr.      Dr.         Dr.     (invariable)
   For every other supported language we fall back to the localized neutral
   "Dr. {ln}" i18n key, which already carries that language's correct form and
   placement (e.g. ko "{ln} 선생님"), so non-latin scripts keep working. */const CF_DOC_TITLE_TABLE={en:{m:'Dr',f:'Dr',x:'Dr'},es:{m:'Dr.',f:'Dra.',x:'Dr.'},ca:{m:'Dr.',f:'Dra.',x:'Dr.'},pt:{m:'Dr.',f:'Dra.',x:'Dr.'},it:{m:'Dott.',f:'Dott.ssa',x:'Dott.'},fr:{m:'Dr',f:'Dre',x:'Dr'},de:{m:'Dr.',f:'Dr.',x:'Dr.'}};function cfDocGenderKey(g){return g==='m'||g==='f'?g:'x';}/* title token for a gender in the current (or given) language, or null when
   this language isn't in the gendered table (caller then uses the i18n key) */function cfDocTitleToken(gender,lang){lang=lang||window.I18n&&I18n.lang||'en';const row=CF_DOC_TITLE_TABLE[lang];return row?row[cfDocGenderKey(gender)]:null;}/* strip any leading honorific so a stored name is never double-prefixed */function cfStripDocTitle(name){return String(name||'').replace(/^\s*(dr|dra|dott\.ssa|dottssa|dott|dre|d-?r)\.?\s+/i,'').trim();}/* Render a doctor's display name with the right title for the active language.
   `prof` carries { name, lastName, docTitle, docGender }. mode 'last' uses just
   the surname (welcome-bar style); 'full' keeps the whole name. A missing
   docTitle defaults to 'doctor', so pre-existing accounts keep their title. */function cfDocTitledName(prof,mode){prof=prof||{};const bare=cfStripDocTitle((prof.name||'').trim());const titleType=prof.docTitle||'doctor';const last=(prof.lastName||'').trim()||bare.split(/\s+/).pop()||bare;const part=mode==='last'?last:bare;if(titleType!=='doctor'||!part)return part;const tok=cfDocTitleToken(prof.docGender);if(tok)return tok+' '+part;return window.trf?trf('Dr. {ln}',{ln:part}):'Dr. '+part;}/* Read ANY account's stored profile by its namespace uid (e.g. the author of
   a shared community comment/post). The per-user isolation patch passes keys
   that are already fully-qualified with the `cfns:` prefix through untouched,
   so we can read another account's private profile directly. Returns the raw
   stored object ({ name, avatarPhoto, avatarColor, ... }) or null. */function cfProfileForUid(uid){try{if(!uid||uid==='anon')return null;const raw=localStorage.getItem('cfns:'+uid+':'+CF_PROFILE_KEY);if(!raw)return null;const r=JSON.parse(raw);return r&&typeof r==='object'?r:null;}catch(e){return null;}}/* initials for an arbitrary display name */function cfInitialsFor(name){const parts=(name||'?').trim().split(/\s+/).filter(Boolean);const a=parts[0]?parts[0][0]:'?';const b=parts.length>1?parts[parts.length-1][0]:'';return(a+b).toUpperCase();}/* Discover every REAL patient account registered on this device by scanning
   localStorage for namespaced profile keys (cfns:<uid>:cf_profile_v1). This
   automatically includes any account created now or in the future — no list
   to maintain. Excludes doctors (they live in the Doctors tab) and the
   currently signed-in user (you don't friend yourself). Returns objects shaped
   like the demo friends so they drop straight into the Chronic Friends list. */function cfAppUsers(){const out=[];try{const cur=window.CFNS&&CFNS.uid&&CFNS.uid()||null;const uids={};// Any namespaced key (cfns:<uid>:<appkey>) reveals an account that has used
// the app — profile, journal, member-since, etc. Collect every patient uid.
for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(!k||k.indexOf('cfns:')!==0)continue;const segs=k.slice(5).split(':');// ['pat', '<email>', '<appkey>']
if(segs.length<3)continue;if(segs[0]!=='pat')continue;// patients only (doctors → Doctors tab)
const uid=segs.slice(0,-1).join(':');// everything but the trailing appkey
uids[uid]=1;}Object.keys(uids).forEach(uid=>{if(cur&&uid===cur)return;// not yourself
const prof=cfProfileForUid(uid)||{};let name=(prof.name||'').trim();if(!name){// fall back to the email's local part
const local=uid.replace(/^pat:/,'').split('@')[0]||'Friend';name=local.charAt(0).toUpperCase()+local.slice(1);}out.push({uid,seed:uid,name,online:true,real:true});});out.sort((a,b)=>a.name.localeCompare(b.name));}catch(e){}return out;}/* ---- avatar image compression ------------------------------------------
   A raw phone photo dataURL is several MB. localStorage caps around ~5MB per
   origin, so a couple of full-size avatars exhaust it and every later save
   silently fails (the write throws, the catch swallows it) — which is why an
   uploaded photo could look fine in the owner's own Settings yet never persist
   for other accounts to read. We cap the longest edge and re-encode as JPEG so
   every avatar is a few dozen KB, not megabytes. */function cfShrinkDataUrl(dataUrl,maxDim,quality){maxDim=maxDim||320;quality=quality||0.82;return new Promise((resolve,reject)=>{try{const img=new Image();img.onload=()=>{try{let w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;if(!w||!h){resolve(dataUrl);return;}const scale=Math.min(1,maxDim/Math.max(w,h));w=Math.max(1,Math.round(w*scale));h=Math.max(1,Math.round(h*scale));const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);/* flatten alpha so JPEG looks right */ctx.drawImage(img,0,0,w,h);let out;try{out=c.toDataURL('image/jpeg',quality);}catch(e){out=dataUrl;}resolve(out||dataUrl);}catch(e){resolve(dataUrl);}};img.onerror=()=>reject(new Error('decode failed'));img.src=dataUrl;}catch(e){reject(e);}});}/* Read an uploaded File and return a compact avatar dataURL (downscaled JPEG). */function cfDownscaleImage(file,maxDim,quality){return new Promise((resolve,reject)=>{try{const reader=new FileReader();reader.onerror=()=>reject(new Error('read failed'));reader.onload=()=>cfShrinkDataUrl(reader.result,maxDim||320,quality||0.82).then(resolve).catch(()=>resolve(reader.result));reader.readAsDataURL(file);}catch(e){reject(e);}});}/* One-time device cleanup: re-compress any already-stored avatar that is still
   oversized (legacy uploads saved before compression existed). Runs across
   EVERY account's namespaced profile so the whole device is brought under the
   storage budget — freeing room so future photo saves stop failing. */function cfMigrateAvatars(){const FLAG='_cfAvatarOpt_v1';/* no cf_/cf- prefix → stays global, runs once per device */try{if(localStorage.getItem(FLAG)==='1')return;}catch(e){return;}if(typeof document==='undefined')return;const MAX_STORED=120000;/* ~120KB dataURL — bigger than a 320px JPEG ever needs */const keys=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('cfns:')===0&&k.lastIndexOf(':'+CF_PROFILE_KEY)===k.length-(CF_PROFILE_KEY.length+1))keys.push(k);}}catch(e){}let pending=keys.length;const finish=()=>{try{localStorage.setItem(FLAG,'1');}catch(e){}};if(!pending){finish();return;}keys.forEach(key=>{let prof=null;try{prof=JSON.parse(localStorage.getItem(key));}catch(e){}const photo=prof&&prof.avatarPhoto;if(!photo||photo.length<=MAX_STORED){if(--pending===0)finish();return;}cfShrinkDataUrl(photo,320,0.82).then(small=>{try{if(small&&small.length<photo.length){prof.avatarPhoto=small;localStorage.setItem(key,JSON.stringify(prof));/* cfns: key passes the namespace shim untouched */if(window.CFProfile&&CFProfile.data&&CFNS&&CFNS.uid&&key==='cfns:'+CFNS.uid()+':'+CF_PROFILE_KEY){CFProfile.data.avatarPhoto=small;CFProfile.emit();/* refresh the live session if it's mine */}}}catch(e){}if(--pending===0)finish();}).catch(()=>{if(--pending===0)finish();});});}try{cfMigrateAvatars();}catch(e){}/* subscribe a component to profile changes */function useProfile(){const[,force]=React.useState(0);React.useEffect(()=>CFProfile.subscribe(()=>force(x=>x+1)),[]);return CFProfile.get();}Object.assign(window,{CFProfile,useProfile,CF_AVATAR_COLORS,cfLoadProfile,cfSessionEmail,cfProfileForUid,cfInitialsFor,cfAppUsers,cfShrinkDataUrl,cfDownscaleImage,cfDocTitleToken,cfDocTitledName,cfStripDocTitle,CF_DOC_TITLE_TABLE});
})();