(function(){/* ===================================================================
   i18nplural — sentences whose noun changes with the number (CICLO 1.0.7b
   §5.1, 26 Sep 2026). Read by trf() (i18n4.jsx): for a key and a language
   listed here, the CLDR category of {n} — asked of Intl.PluralRules, never
   worked out by hand — picks the sentence. Anything not listed here reads
   CF_UI_MAP exactly as before.

   ARABIC, THE RELATIVE-TIME FAMILY. One string cannot agree with every
   number: «قبل 5 دقيقة» and «قبل 2 أيام» are what the single values of
   i18ndoc-fill-tr-ar · i18nfix1 · i18ngap4a printed (those values stay as
   the fallback of a phone that loads no table). The six categories, checked
   against the Unicode CLDR Language Plural Rules chart for Arabic, whose own
   minimal pairs are ٠ كتاب · ولد واحد · ولدان · ٣ أولاد · ١١ ولدًا · ١٠٠ ولد:
     zero  (0)                → the singular          قبل 0 دقيقة
     one   (1)                → the noun alone        قبل دقيقة
     two   (2)                → the dual (genitive,   قبل دقيقتين
                                after قبل), no digit
     few   (3–10, 103–110…)   → the broken plural     قبل 5 دقائق
     many  (11–99, 111–199…)  → the singular in the   قبل 11 دقيقة · قبل 30 يومًا
                                accusative (tanwīn:
                                يومًا · أسبوعًا · شهرًا;
                                unwritten on ـة)
     other (100–102, 200…)    → the singular          قبل 100 يوم
   Digits stay the app's own Western digits, as {n} already prints them.
   Keys: every relative-time sentence the app composes with {n} — the step
   tournament's age line (min · h · days), the doctor's request list
   (min · h · d), the consultations list (days · weeks), the Flare story
   (days · months · years) and the Flare bands (d).
   Loaded after i18nzenmusic and before i18nlifetags, which stays last.
   =================================================================== */(function(){var P=window.CF_UI_PLURAL=window.CF_UI_PLURAL||{};function ar(sg,du,pl,acc){return{zero:'قبل {n} '+sg,one:'قبل '+sg,two:'قبل '+du,few:'قبل {n} '+pl,many:'قبل {n} '+acc,other:'قبل {n} '+sg};}var AR={'{n} min ago':ar('دقيقة','دقيقتين','دقائق','دقيقة'),'{n}h ago':ar('ساعة','ساعتين','ساعات','ساعة'),'{n} days ago':ar('يوم','يومين','أيام','يومًا'),'{n}d ago':ar('يوم','يومين','أيام','يومًا'),'{n} weeks ago':ar('أسبوع','أسبوعين','أسابيع','أسبوعًا'),'{n} months ago':ar('شهر','شهرين','أشهر','شهرًا'),'{n} years ago':ar('سنة','سنتين','سنوات','سنة')};Object.keys(AR).forEach(function(k){if(!P[k])P[k]={};if(!P[k].ar)P[k].ar=AR[k];});})();
})();