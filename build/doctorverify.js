(function(){/* ===================================================================
   DOCTOR LICENSE VERIFICATION — the real gate that stops a non-doctor
   from becoming a bookable "verified" specialist.

   Design-phase / simulated (same philosophy as Health Sync): the real
   medical-board lookup drops in later and maps 1:1 to the three outcomes
   below. Until then a small simulated national register stands in, and a
   clearly-labelled prototype helper shows a registered example number so
   the doctor flow can still be walked end to end.

   Two gates, applied in order by check(country, license):

   1. FORMAT   — a universal shape check. A registration number is
                 digit-heavy and longer than a PIN, so trivial fakes
                 ("1234", "test", "aaaa") are rejected instantly, inline,
                 before the form can advance.
   2. REGISTER — a format-valid number is looked up in the (simulated)
                 national medical register:
                   • found      → 'verified'  badge goes live, can be booked
                   • not found  → 'review'    application accepted but PENDING
                                              a human check — NO doctor access
                                              is granted until it is approved.

   The single source of truth is window.CFDocVerify — never re-derive the
   check anywhere else.
   =================================================================== */(function(){/* strip separators / case so "ES-28-2846617" == "es282846617" */function normalize(s){return String(s==null?'':s).toUpperCase().replace(/[^A-Z0-9]/g,'');}function digitCount(s){return(String(s).match(/\d/g)||[]).length;}/* universal format gate: real registration numbers are ≥8 chars and
     carry ≥6 digits — a "1234" PIN or a word can never pass. */function formatOk(license){const n=normalize(license);return n.length>=8&&digitCount(n)>=6;}/* per-country helper text + one registered EXAMPLE (shown in the
     prototype helper). Every example satisfies formatOk. */const COUNTRY={'Spain':{ex:'ES-28-2846617',hint:'Colegiado no. — province + digits'},'France':{ex:'RPPS-10101234576',hint:'RPPS — 11 digits'},'Germany':{ex:'LANR-918273645',hint:'Arztnummer (LANR) — 9 digits'},'Italy':{ex:'OMCEO-RM-183746',hint:'Ordine dei Medici registration'},'Portugal':{ex:'OM-5827361',hint:'Ordem dos Médicos no.'},'United Kingdom':{ex:'GMC-7418529',hint:'GMC reference — 7 digits'},'United States':{ex:'NPI-1902384756',hint:'NPI — 10 digits'},'Mexico':{ex:'CED-8273645',hint:'Cédula profesional'},'Argentina':{ex:'MN-1283746',hint:'Matrícula nacional'},'Morocco':{ex:'CNOM-3827186',hint:"Conseil de l'Ordre no."},'Egypt':{ex:'EMS-4728163',hint:'Medical Syndicate no.'},'United Arab Emirates':{ex:'DHA-38274655',hint:'DHA / DOH / MOH licence no.'}};const DEFAULT={ex:'REG-10273846',hint:'your national medical-registration number'};function info(country){return COUNTRY[country]||DEFAULT;}/* simulated national register. In production this is a live medical-board
     lookup; here a number is "registered" when it matches the country's
     seeded example (the number shown in the prototype helper). Everything
     else that is well-formed is unknown → routed to manual review. */function inRegister(country,license){const n=normalize(license);if(!n)return false;return n===normalize(info(country).ex);}/* the one decision function. Returns { status, hint, example }. */function check(country,license){const meta=info(country);if(!formatOk(license))return{status:'format',hint:meta.hint,example:meta.ex};if(inRegister(country,license))return{status:'verified',hint:meta.hint,example:meta.ex};return{status:'review',hint:meta.hint,example:meta.ex};}window.CFDocVerify={check,formatOk,info,example:c=>info(c).ex,hint:c=>info(c).hint};})();
})();