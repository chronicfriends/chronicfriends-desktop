(function(){/* ===================================================================
   ZEN MUSIC (TOOL1 — Gerhard, 17-18 Sep 2026) — four long pieces
   inside the Meditation room (normalcomfort.jsx › NC_MENU › kits).
   -------------------------------------------------------------------
   The four pieces are real and they are NOT ours: YouTube works under
   CREATIVE COMMONS ATTRIBUTION (checked video by video on 17 Sep
   2026), usable on condition that the author is credited. The credits
   are therefore obligatory and visible: work title, channel and a link
   to the source under the list, and the channel in the player.
   Same table as https://www.chronicfriends.org/audio/creditos.json.

   The MP3s live on the web, never in the export (109 MB): ONE
   <audio preload="none"> streams the chosen piece.

   🔴 The <audio> is NOT React's — ZMEngine creates it once and appends
   it to document.body, so closing the room does not stop the music
   (the Home «Meditation» card then says «Playing»), and nothing here
   listens to visibilitychange or blur: a locked phone keeps playing.
   🔴 No noisy retries: one calm line when the stream cannot start.
   =================================================================== */
const{useState:useZMS,useEffect:useZME}=React;
const ZM_BASE='https://www.chronicfriends.org/audio/';
/* work = the ORIGINAL title of the video, quoted verbatim in the credits
   (emoji included: it is the author's title, not ours). title = the short
   name we show. channel + source are copied exactly: they are the attribution. */
const ZM_TRACKS=[
{id:'zen-1',url:ZM_BASE+'zen-1.mp3',title:'Calm the Mind',channel:'Spiritual Life 🦋❤️',
 source:'https://youtu.be/wmHcYdJHeoU',seconds:1911,
 work:'Musica Zen para Relajarse y Calmar la Mente 🎋 Meditar, Dormir Profundamente'},
{id:'zen-2',url:ZM_BASE+'zen-2.mp3',title:'Water & Stillness',channel:'D-SOPHORN',
 source:'https://youtu.be/iCX_19Oznpc',seconds:1203,
 work:'[ No Ads ] 🍀 Relaxing Music with Water Sounds 💧 for Stress Relief and Sleep 💤 #012'},
{id:'zen-3',url:ZM_BASE+'zen-3.mp3',title:'Japanese Flute',channel:'MusicSense',
 source:'https://youtu.be/rTnG_smBH6E',seconds:2250,
 work:'Música Zen para Sanar el Alma y el Cuerpo / Flauta Japonesa Relajante / Zen Music / Sentir Sosiego'},
{id:'zen-4',url:ZM_BASE+'zen-4.mp3',title:'30-Minute Zen',channel:'ZenFlow Music',
 source:'https://youtu.be/cSP9CBcTORU',seconds:1800,
 work:'Relaxing Stress Relief Music Video - 30 Minutes Zen Music, Relax & Mindfulness.'}];
/* ---------- the engine: ONE <audio>, outside React ---------- */
const ZMEngine=(function(){
let el=null,curId=null,err=false,subs=[];
let timerMin=0,timerAt=0,timerId=null,fadeId=null;
const emit=()=>subs.slice().forEach((f)=>{try{f();}catch(e){}});
const find=(id)=>ZM_TRACKS.filter((t)=>t.id===id)[0]||null;
function media(t){try{if(!navigator.mediaSession||!window.MediaMetadata)return;
navigator.mediaSession.metadata=new window.MediaMetadata({title:t.title,artist:t.channel,album:'Chronic Friends'});
navigator.mediaSession.setActionHandler('play',()=>api.resume());
navigator.mediaSession.setActionHandler('pause',()=>api.pause());
navigator.mediaSession.setActionHandler('stop',()=>api.stop());}catch(e){}}
function audio(){if(el)return el;
el=document.createElement('audio');el.preload='none';el.id='zm-audio';el.setAttribute('playsinline','');
['timeupdate','play','pause','durationchange','loadedmetadata'].forEach((ev)=>el.addEventListener(ev,emit));
el.addEventListener('error',()=>{err=true;emit();});
el.addEventListener('ended',()=>{api.clearTimer();curId=null;emit();});
try{document.body.appendChild(el);}catch(e){}
return el;}
/* the sleep timer never cuts: 3 s down, then silence. Driven by the CLOCK,
   never by a tick count — a backgrounded phone throttles intervals, and a
   fade that counted ticks would take half a minute there. */
function fadeStop(){const a=el;if(!a){api.stop();return;}
const t0=Date.now(),v0=a.volume||1;
fadeId=setInterval(()=>{const k=Math.min(1,(Date.now()-t0)/3000);
try{a.volume=Math.max(0,v0*(1-k));}catch(e){}
if(k>=1){clearInterval(fadeId);fadeId=null;api.stop();}},100);}
const api={
tracks:ZM_TRACKS,
node:()=>el,
state(){const a=el,t=find(curId);
return{id:curId,playing:!!(a&&curId&&!a.paused),at:a?(a.currentTime||0):0,
dur:(a&&a.duration&&isFinite(a.duration)&&a.duration>0)?a.duration:(t?t.seconds:0),
error:err,timerMin:timerMin,timerLeft:timerAt?Math.max(0,Math.round((timerAt-Date.now())/1000)):0};},
subscribe(f){subs.push(f);return()=>{subs=subs.filter((g)=>g!==f);};},
/* only one piece ever sounds: the same element takes the new src, so
   starting another one stops the first by construction */
play(id){const t=find(id);if(!t)return;const a=audio();err=false;
if(curId!==id){curId=id;a.src=t.url;try{a.currentTime=0;}catch(e){}}
try{a.volume=1;}catch(e){}
const p=a.play();if(p&&p.catch)p.catch(()=>{err=true;emit();});
media(t);emit();},
pause(){if(el){try{el.pause();}catch(e){}}emit();},
resume(){if(curId)api.play(curId);},
toggle(id){const s=api.state();if(s.id===id&&s.playing)api.pause();else api.play(id);},
stop(){api.clearTimer();
if(el){try{el.pause();el.currentTime=0;el.volume=1;}catch(e){}}
curId=null;err=false;emit();},
seek(sec){if(el&&isFinite(sec)){try{el.currentTime=Math.max(0,sec);}catch(e){}emit();}},
setTimer(min){api.clearTimer();if(!min){emit();return;}
timerMin=min;timerAt=Date.now()+min*60000;timerId=setTimeout(fadeStop,min*60000);emit();},
clearTimer(){if(timerId)clearTimeout(timerId);if(fadeId)clearInterval(fadeId);
timerId=null;fadeId=null;timerMin=0;timerAt=0;
if(el){try{el.volume=1;}catch(e){}}}};
return api;})();
function zmClock(s){s=Math.max(0,Math.round(s||0));const m=Math.floor(s/60),r=s%60;return m+':'+(r<10?'0':'')+r;}
function useZm(){const[,bump]=useZMS(0);useZME(()=>ZMEngine.subscribe(()=>bump((n)=>n+1)),[]);return ZMEngine.state();}
const ZmIc={
play:(s)=>React.createElement("svg",{viewBox:"0 0 24 24",width:s||20,height:s||20,fill:"currentColor","aria-hidden":"true"},React.createElement("path",{d:"M8 5.2 19 12 8 18.8z"})),
pause:(s)=>React.createElement("svg",{viewBox:"0 0 24 24",width:s||20,height:s||20,fill:"currentColor","aria-hidden":"true"},React.createElement("rect",{x:"7",y:"5",width:"3.6",height:"14",rx:"1.2"}),React.createElement("rect",{x:"13.4",y:"5",width:"3.6",height:"14",rx:"1.2"})),
stop:(s)=>React.createElement("svg",{viewBox:"0 0 24 24",width:s||18,height:s||18,fill:"currentColor","aria-hidden":"true"},React.createElement("rect",{x:"6",y:"6",width:"12",height:"12",rx:"2.4"}))};
/* ---------- the player, sticky at the foot while a piece is loaded ---------- */
function ZmBar({st}){useT();
const t=ZM_TRACKS.filter((x)=>x.id===st.id)[0];
if(!t)return null;
const dur=st.dur||t.seconds;
return React.createElement("div",{className:"zm-bar"},
React.createElement("div",{className:"zm-bar-top"},
React.createElement("button",{className:"zm-play big tap",onClick:()=>ZMEngine.toggle(t.id),"aria-label":st.playing?tr('Pause'):tr('Play')},st.playing?ZmIc.pause(22):ZmIc.play(22)),
React.createElement("div",{className:"zm-meta"},
React.createElement("div",{className:"zm-t"},t.title),
React.createElement("div",{className:"zm-sub"},trf('by {channel}',{channel:t.channel}))),
React.createElement("button",{className:"zm-stop tap",onClick:()=>ZMEngine.stop(),"aria-label":tr('Stop')},ZmIc.stop())),
React.createElement("input",{className:"zm-seek",type:"range",min:"0",max:Math.round(dur),step:"1",value:Math.min(Math.round(st.at),Math.round(dur)),"aria-label":t.title,onChange:(e)=>ZMEngine.seek(Number(e.target.value))}),
React.createElement("div",{className:"zm-times"},React.createElement("span",null,zmClock(st.at)),React.createElement("span",null,'-'+zmClock(Math.max(0,dur-st.at)))));}
/* ---------- the screen ---------- */
function NCZenMusic({acc}){useT();
const st=useZm();
return React.createElement("div",{className:"zm-wrap",style:{'--acc':acc||'#46d6b0'}},
React.createElement("div",{className:"nc-intro"},tr('Four long pieces to rest, meditate or fall asleep to — press play and put the phone down.')),
React.createElement("div",{className:"zm-list"},
ZM_TRACKS.map((t)=>{const on=st.id===t.id,playing=on&&st.playing;
return React.createElement("div",{key:t.id,className:'zm-row'+(on?' on':'')},
React.createElement("button",{className:"zm-play tap",onClick:()=>ZMEngine.toggle(t.id),"aria-label":(playing?tr('Pause'):tr('Play'))+' — '+t.title},playing?ZmIc.pause():ZmIc.play()),
React.createElement("div",{className:"zm-meta"},
React.createElement("div",{className:"zm-t"},t.title),
React.createElement("div",{className:"zm-sub"},trf('by {channel}',{channel:t.channel}),' · ',trf('{n} min',{n:Math.floor(t.seconds/60)}))),
playing&&React.createElement("span",{className:"zm-eq","aria-hidden":"true"},React.createElement("i",null),React.createElement("i",null),React.createElement("i",null)));})),
st.error&&React.createElement("div",{className:"zm-err"},tr('This piece streams from the internet — connect and try again.')),
React.createElement("div",{className:"nc-sec"},tr('Sleep timer')),
React.createElement("div",{className:"nc-pills"},
[15,30,60].map((m)=>React.createElement("button",{key:m,className:'nc-pill'+(st.timerMin===m?' sel':''),onClick:()=>ZMEngine.setTimer(st.timerMin===m?0:m)},trf('Stop after {n} min',{n:m})))),
/* CC BY: the credit of each work, always on screen */
React.createElement("div",{className:"nc-sec"},tr('Credits')),
React.createElement("div",{className:"zm-credits"},
ZM_TRACKS.map((t)=>React.createElement("p",{className:"zm-credit",key:t.id},
React.createElement("span",{className:"zm-work"},'«'+t.work+'»'),' — '+t.channel+' · CC BY · ',
React.createElement("a",{href:t.source,target:"_blank",rel:"noopener noreferrer"},t.source.replace('https://','')))),
React.createElement("p",{className:"zm-cc"},tr('Music by these creators, used under the Creative Commons Attribution license.'))),
st.id&&React.createElement(ZmBar,{st:st}));}
/* ---------- «Playing» for the Home card (the music outlives the room) ---------- */
function ZmPlayingChip(){useT();
const st=useZm();
if(!st.playing)return null;
return React.createElement("span",{className:"zm-chip"},React.createElement("i",null),tr('Playing'));}
Object.assign(window,{NCZenMusic,ZmPlayingChip,ZMEngine,ZM_TRACKS,ZM_BASE});
})();
