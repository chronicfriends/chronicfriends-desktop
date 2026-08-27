(function(){/* ===================================================================
   BARRIDO23-N §1 — DATA-EXPORT BRIDGE (window.CFData)

   "Export my data" is a right, not a nicety (GDPR art. 15 + 20), and
   inside a native WebView a Blob + <a download> lands NOWHERE — the
   same reason native/App.js:1302 gives for the PDF. So the file leaves
   the app the way every report already does: the web side composes it
   and hands it to the shell, which writes it and opens the OS share
   sheet (Files, mail, WhatsApp…).

   CONTRACT — the native side is already written and expects exactly
   this; do not change a field name:
   Web → native  (window.ReactNativeWebView.postMessage(JSON string)):
     {t:'data:share', id:'<unique>', json:'<the serialized text>', filename}
   Native → web  (ALWAYS both ways, whichever we listen to):
     · window.CFData._recv(msg)
     · window event 'cf-data-result', the message in event.detail
     msg = {t:'data:result', id, ok, cancelled, error, file}
   Both doors land in the same _recv and the id is deleted on first
   arrival, so a double answer resolves exactly once.
   No reply within 30 s → resolves {ok:false, error:'timeout'}.

   ok:true means the file was WRITTEN AND OFFERED — iOS never reveals
   whether the user kept it, so the copy says "your file is ready",
   never "saved to your phone". In a plain browser (no shell) share()
   falls back to a real <a download>, and only THAT path may say
   "Saved as chronic-friends-export.json". NEVER a simulated success:
   a failed bridge must make the button say so, and the button waits
   for this answer — never a timer. Same philosophy as reportbridge.jsx
   / medbridge.jsx (silent degradation, honest states).
   =================================================================== */function cfDfPresent(){try{return!!(window.ReactNativeWebView&&typeof ReactNativeWebView.postMessage==='function');}catch(e){return false;}}const cfDfPending={};let cfDfSeq=0;function cfDfNative(payload){return new Promise(resolve=>{const id='df'+ ++cfDfSeq+'-'+Date.now();cfDfPending[id]=resolve;/* if the shell never answers, fail honestly — never a fake success */setTimeout(()=>{if(cfDfPending[id]){delete cfDfPending[id];resolve({ok:false,cancelled:false,error:'timeout',via:'native'});}},30000);try{ReactNativeWebView.postMessage(JSON.stringify({t:'data:share',id,json:payload.json,filename:payload.filename||'chronic-friends-export.json'}));}catch(e){delete cfDfPending[id];resolve({ok:false,cancelled:false,error:String(e&&e.message||e),via:'native'});}});}/* browser fallback (CFData.present() false): a real file download.
   This is the one path that genuinely SAVES, so it reports via:'download'
   and the caller may name the file it wrote. */function cfDfDownload(payload){return new Promise(resolve=>{let url=null;try{const name=payload.filename||'chronic-friends-export.json';const blob=new Blob([payload.json],{type:'application/json;charset=utf-8'});url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>{try{URL.revokeObjectURL(url);}catch(e){}},4000);resolve({ok:true,cancelled:false,file:name,via:'download'});}catch(e){try{if(url)URL.revokeObjectURL(url);}catch(e2){}resolve({ok:false,cancelled:false,error:String(e&&e.message||e),via:'download'});}});}const CFData={present(){return cfDfPresent();},share(payload){payload=payload||{};if(!payload.json)return Promise.resolve({ok:false,cancelled:false,error:'empty-file'});return cfDfPresent()?cfDfNative(payload):cfDfDownload(payload);},_recv(msg){try{if(typeof msg==='string')msg=JSON.parse(msg);}catch(e){return;}if(!msg||msg.t!=='data:result')return;const resolve=cfDfPending[msg.id];if(!resolve)return;/* already answered by the other door */delete cfDfPending[msg.id];/* BARRIDO24 §5 — the tri-state survives. `cancelled` may arrive as
       null, and null is NOT false: neither iOS nor Android reveal whether
       the person kept the file or closed the share sheet, so the shell
       sends null = «unknown» and the button treats that as «the file was
       offered», never as a failure. Coercing it with !! made that case
       indistinguishable from a real refusal. The timeout and throw paths
       below stay at cancelled:false, so they remain honest red errors. */resolve({ok:!!msg.ok,cancelled:msg.cancelled==null?null:!!msg.cancelled,error:msg.error,file:msg.file,via:'native'});}};/* the second door: the same message as a window event */try{window.addEventListener('cf-data-result',e=>CFData._recv(e&&e.detail));}catch(e){}Object.assign(window,{CFData});
})();