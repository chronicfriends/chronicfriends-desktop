(function(){/* ===================================================================
   i18nflarealias — Phase 6: Flare Mode label alignment WITHOUT
   touching any flare file. The locked flare surfaces still call
   tr('Games') / tr('Comfort toolkit'); this wrapper redirects those
   two keys to the new master strings ('Entertainment' / 'Meditation')
   BEFORE the English passthrough, so all 16 locales — English
   included — show the aligned names. Contents are untouched: flare
   Entertainment still opens night games, flare Meditation still opens
   the flare comfort experiences.
   Verified consumers of the old keys: gamesnight.jsx (4×) and
   flaremodedash.jsx / flaremodecomfort.jsx (5×) only — no other
   source file uses them. The old CF_UI_MAP entries stay (never
   deleted); removing this file restores the old labels.
   Load AFTER the i18n fills (window.tr must exist), BEFORE app use.
   =================================================================== */(function(){var ALIAS={'Games':'Entertainment','Comfort toolkit':'Meditation'};var orig=window.tr;if(!orig||orig.__cfAliased)return;var wrapped=function(en){return orig(Object.prototype.hasOwnProperty.call(ALIAS,en)?ALIAS[en]:en);};wrapped.__cfAliased=true;window.tr=wrapped;})();
})();