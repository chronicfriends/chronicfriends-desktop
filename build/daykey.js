(function(){/* MED2: dia y mes SIEMPRE en la hora local del paciente, nunca en UTC.
   Cargado como PRIMER script de build/ para que todos los modulos lo vean.
   Mismo formato que antes (YYYY-MM-DD) - las claves ya guardadas siguen valiendo. */function cfDayKey(x){const d=x==null?new Date():x instanceof Date?x:new Date(x);if(isNaN(d.getTime()))return'';const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());}function cfMonthKey(x){return cfDayKey(x).slice(0,7);}window.cfDayKey=cfDayKey;window.cfMonthKey=cfMonthKey;
})();