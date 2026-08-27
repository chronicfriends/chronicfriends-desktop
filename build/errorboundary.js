(function(){/* ===================================================================
   BARRIDO24 §2 — CFErrorBoundary: THE SAFETY NET THE APP NEVER HAD.

   There was not one React error boundary in the whole app, and with
   React 18 a render error without a boundary UNMOUNTS THE WHOLE ROOT:
   that is why §1 (a wrong hook alias in ONE settings row) left the
   patient with a blank app instead of a broken row. An isolated fault
   is a defect; without a net it is a total outage — and this is a
   health app, it can happen while somebody is in a flare.

   Three rules, all of them non-negotiable:
     1. It shows something decent — «Something went wrong on this
        screen» and a «Back» button. Never a blank screen, and NEVER
        the text of the error (it goes to the console only).
     2. Both strings are visible copy, so they are translated like the
        rest: the notice through the new key, the button through the
        'Back' key the app already ships in 16 languages.
     3. 🔴 It RE-ARMS on «Back» (failed → false, and the child subtree
        is remounted under a new key so the broken render is thrown
        away). Without that the screen stays stuck on the notice for
        ever and the button does nothing.

   Load order matters: build/errorboundary.js loads before every screen
   that wraps itself in it. Callers always test window.CFErrorBoundary
   first, so a missing file can never take the app down with it.
   =================================================================== */function CFErrorFallback({onBack}){useT();const T=k=>window.tr?tr(k):k;return/*#__PURE__*/React.createElement("div",{style:{minHeight:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16,padding:'48px 30px',textAlign:'center',background:'var(--bg, #f4f7f0)'},role:"alert"},/*#__PURE__*/React.createElement("span",{style:{width:62,height:62,borderRadius:22,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',background:'radial-gradient(120% 120% at 30% 25%,#9fb8a4,#5c7a63)',boxShadow:'0 12px 26px -12px rgba(30,60,35,.55)'}},window.Ic&&Ic.info?Ic.info({width:28,height:28}):null),/*#__PURE__*/React.createElement("div",{style:{fontSize:17.5,fontWeight:800,color:'var(--ink, #21321f)',letterSpacing:'-.01em',lineHeight:1.3,textWrap:'pretty',maxWidth:260}},T('Something went wrong on this screen')),/*#__PURE__*/React.createElement("button",{className:"btn3d pill",onClick:onBack,style:{padding:'14px 30px',fontSize:15,fontWeight:700}},T('Back')));}class CFErrorBoundary extends React.Component{constructor(props){super(props);this.state={failed:false,n:0};this.back=this.back.bind(this);}static getDerivedStateFromError(){return{failed:true};}componentDidCatch(err,info){/* the console is the only place the error text may appear */try{console.error('[Chronic Friends] screen error:',err,info&&info.componentStack);}catch(e){}}back(){/* 🔴 re-arm. The n bump gives the children a new key so the subtree
       is rebuilt from scratch instead of re-running the render that
       just threw. */this.setState(s=>({failed:false,n:s.n+1}));try{if(this.props.onBack)this.props.onBack();}catch(e){}}render(){if(this.state.failed)return/*#__PURE__*/React.createElement(CFErrorFallback,{onBack:this.back});return/*#__PURE__*/React.createElement(React.Fragment,{key:this.state.n},this.props.children);}}/* the one wrapper every call site uses: never breaks if this file is absent */function cfGuard(node,onBack){if(!window.CFErrorBoundary)return node;return/*#__PURE__*/React.createElement(CFErrorBoundary,{onBack:onBack},node);}Object.assign(window,{CFErrorBoundary,CFErrorFallback,cfGuard});
})();