(function(){/* ===================================================================
   DOCTORS — COMING SOON (launch gate)
   Teleconsultation is not live at launch. The Community → Doctors tab
   stays VISIBLE, but opening it shows this intentional coming-soon
   state instead of the doctor screens. The entire teleconsultation
   flow (DoctorsTab directory → booking → waiting room → video call →
   payment) is left fully intact in the codebase — this screen simply
   replaces it at the entry point (one line in screens.jsx). Remove
   that line to re-connect the flow at launch.

   Compliance: wellness framing only — "talk to verified doctors";
   no diagnosis / prediction / treatment wording.

   Reuses the country machinery from countryrule.jsx: CountrySheet
   (searchable picker → writes CFProfile.country, same field as
   onboarding + Settings).

   AUDIT1 §4 (7 Nov 2026) — no promise of a notice that does not exist:
   «Notify me when available» stored a flag on the phone (and in each
   person's own box) that nobody ever read, and no doctor is verified yet.
   The button and its «on the list» line are gone, and this screen no
   longer writes cf_notify_country_v1 (cfToggleCountryNotify stays in
   countryrule.jsx: the crisis sheet still reads that key as a country
   hint; nothing already stored is deleted). The words are the landing's
   since September: «Doctors, coming soon».
   =================================================================== */const CS_video=p=>/*#__PURE__*/React.createElement("svg",{viewBox:"0 0 24 24",width:p&&p.width||20,height:p&&p.height||20,fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",strokeLinejoin:"round"},/*#__PURE__*/React.createElement("rect",{x:"2.5",y:"6",width:"13.5",height:"12",rx:"3"}),/*#__PURE__*/React.createElement("path",{d:"M16 10.5l5.5-3.2v9.4L16 13.5z"}));function DoctorsComingSoon({onGoCommunity}){useT();/* live country from the profile (same store onboarding + Settings write) */const profile=window.useProfile?useProfile():window.CFProfile&&CFProfile.get()||{};const country=profile&&profile.country||null;const[sheet,setSheet]=React.useState(false);/* picking a country here only sets the profile's country — nothing else is written */const pickCountry=c=>{if(window.cfSetPatientCountry)cfSetPatientCountry(c);};return/*#__PURE__*/React.createElement("div",{style:{flex:1,overflowY:'auto',padding:'16px 20px 26px',background:'var(--card)'},className:"no-scrollbar","data-screen-label":"Doctors \u2014 coming soon"},/*#__PURE__*/React.createElement("div",{style:{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'18px 8px 8px'}},/*#__PURE__*/React.createElement("div",{style:{width:120,height:120,borderRadius:36,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--green-700)',background:'linear-gradient(165deg,var(--mint-50),var(--mint-100))',boxShadow:'inset 0 2px 4px rgba(255,255,255,.2),0 12px 28px -12px rgba(10,30,20,.4)'}},CS_video({width:54,height:54})),/*#__PURE__*/React.createElement("div",{style:{display:'inline-flex',alignItems:'center',gap:7,marginTop:18,padding:'5px 12px',borderRadius:20,background:'var(--mint-50)'}},/*#__PURE__*/React.createElement("span",{style:{width:8,height:8,borderRadius:'50%',background:'var(--fluor, #39ff14)',boxShadow:'0 0 7px var(--fluor, #39ff14)'}}),/*#__PURE__*/React.createElement("span",{style:{fontSize:11,fontWeight:800,letterSpacing:'.03em',textTransform:'uppercase',color:'var(--green-700)'}},tr('Coming soon'))),/*#__PURE__*/React.createElement("div",{style:{fontSize:20,fontWeight:800,letterSpacing:'-.02em',color:'var(--ink)',marginTop:14,lineHeight:1.25,textWrap:'balance',maxWidth:300}},tr('Doctors, coming soon')),/*#__PURE__*/React.createElement("div",{className:"muted",style:{fontSize:13.5,fontWeight:500,marginTop:10,lineHeight:1.55,maxWidth:292,textWrap:'pretty'}},tr('Video visits with doctors aren\u2019t available yet. When they open in your country, you\u2019ll find them in Community \u203a Doctors.')),/*#__PURE__*/React.createElement("button",{className:"btn3d soft pill",onClick:onGoCommunity,style:{width:'100%',maxWidth:320,fontSize:14,fontWeight:700,padding:'14px',marginTop:22,gap:8,color:'var(--green-700)'}},Ic.heart({width:17,height:17})," ",tr('Meanwhile, the community is here')),/*#__PURE__*/React.createElement("button",{onClick:()=>setSheet(true),style:{background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',fontSize:12.5,fontWeight:700,color:'var(--muted-2)',marginTop:16}},country?tr('Receive care somewhere else? Change country'):tr('Choose your country'))),window.CountrySheet&&/*#__PURE__*/React.createElement(CountrySheet,{open:sheet,current:country,onClose:()=>setSheet(false),onPick:pickCountry}));}Object.assign(window,{DoctorsComingSoon});
})();