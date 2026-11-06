/* ===================================================================
   cf-crisis-lines.js — window.CFCrisis · motor de Claude Code (webapp/vendor) · GENERADO
   por tools/crisis/generar-cf-crisis-lines.py el 2026-11-05. No se edita a mano: se regenera.

   AUD1 (auditoría del 5 nov 2026, crítico C2): la hoja «You're not alone» (build/crisissafety.js)
   pide forCountryName(país del perfil) e international, que el motor de julio no tenía → no se
   abría o salía «Something went wrong», también desde la pregunta 9 del PHQ-9.

   Directorio independiente de líneas de ayuda en crisis y del número de emergencias de cada país
   del perfil (51 países + el bloque internacional). Cada teléfono se comprobó en su fuente
   OFICIAL y lo volvió a comprobar un verificador independiente (5 nov 2026); lo que no se pudo
   confirmar se quitó. Cada línea lleva su fuente (campo source). NO es consejo médico ni un servicio
   de Chronic Friends. Los números cambian: se revisan cada 6 meses.

   API:  all · international · forCountry(códigoISO) · forCountryName(nombre en inglés, el del perfil)
         · intl() (compatibilidad con el motor de julio) · verified (fecha de la comprobación)
   Los textos (hours, notes, emergencyNote) van en inglés y sus traducciones se registran en
   CF_UI_MAP (las que ya tenga la app mandan) para que tr() las pinte en los 16 idiomas.
   =================================================================== */
(function () {
  'use strict';
  var VERIFICADO = "2026-11-05";
  var INTERNATIONAL = {
  "country": "International",
  "code": "INT",
  "flag": "🌍",
  "emergency": "112",
  "emergencyNote": "In the US & Canada call 911 · in Australia 000 · or your local emergency number.",
  "lines": [
    {
      "name": "Find a Helpline",
      "phone": "",
      "hours": "Anytime",
      "notes": "Free, confidential helplines in your country and language.",
      "web": "https://findahelpline.com"
    },
    {
      "name": "Befrienders Worldwide",
      "phone": "",
      "hours": "Anytime",
      "notes": "A global network of emotional-support centres. Find the nearest one.",
      "web": "https://befrienders.org"
    },
    {
      "name": "IASP Crisis Centres",
      "phone": "",
      "hours": "Anytime",
      "notes": "International directory of crisis centres by country.",
      "web": "https://www.iasp.info/resources/Crisis_Centres/"
    }
  ]
};
  var COUNTRIES = [
 {
  "country": "Spain",
  "code": "ES",
  "flag": "🇪🇸",
  "emergency": "112",
  "emergencySource": "https://www.sanidad.gob.es/linea024/home.htm",
  "lines": [
   {
    "name": "Línea 024 · Atención a la conducta suicida",
    "phone": "024",
    "hours": "24 hours, every day",
    "notes": "Free, confidential, run by the Ministry of Health.",
    "web": "https://www.sanidad.gob.es/linea024/home.htm",
    "source": "https://www.sanidad.gob.es/linea024/home.htm"
   },
   {
    "name": "Teléfono de la Esperanza",
    "phone": "717 003 717",
    "hours": "24 hours, every day",
    "notes": "Confidential.",
    "web": "https://telefonodelaesperanza.org",
    "source": "https://telefonodelaesperanza.org/"
   }
  ]
 },
 {
  "country": "Portugal",
  "code": "PT",
  "flag": "🇵🇹",
  "emergency": "112",
  "emergencySource": "https://www.gov.pt/linhas-uteis",
  "lines": [
   {
    "name": "Linha Nacional de Prevenção do Suicídio · 1411",
    "phone": "1411",
    "hours": "24 hours, every day",
    "notes": "Free, run by the Ministry of Health.",
    "web": "https://www.sns24.gov.pt/pt/servico/linha-nacional-de-prevencao-do-suicidio",
    "source": "https://www.sns24.gov.pt/pt/servico/linha-nacional-de-prevencao-do-suicidio"
   },
   {
    "name": "SNS 24 · Aconselhamento Psicológico",
    "phone": "808 24 24 24",
    "hours": "24 hours, every day",
    "notes": "National health line: ask for psychological counselling.",
    "web": "https://www.sns24.gov.pt",
    "source": "https://www.sns24.gov.pt/pt/sobre-nos/"
   }
  ]
 },
 {
  "country": "Italy",
  "code": "IT",
  "flag": "🇮🇹",
  "emergency": "112",
  "emergencyNote": "Ambulance 118",
  "emergencySource": "https://prefettura.interno.gov.it/it/prefetture/brescia/notizie/giornata-europea-numero-unico-emergenza-europeo-112",
  "lines": [
   {
    "name": "Telefono Amico Italia",
    "phone": "02 2327 2327",
    "hours": "24 hours, every day",
    "notes": "Anonymous. WhatsApp: 324 011 72 52, every day 18:00–21:00.",
    "web": "https://www.telefonoamico.it",
    "source": "https://www.telefonoamico.it/cosa-facciamo/come-contattarci/"
   },
   {
    "name": "Samaritans OdV",
    "phone": "06 77208977",
    "hours": "Every day, 13:00–22:00",
    "notes": "",
    "source": "http://www.samaritansonlus.org/"
   }
  ]
 },
 {
  "country": "France",
  "code": "FR",
  "flag": "🇫🇷",
  "emergency": "112",
  "emergencyNote": "Ambulance 15 (SAMU)",
  "emergencySource": "https://www.service-public.gouv.fr/particuliers/vosdroits/F33954",
  "lines": [
   {
    "name": "3114 · Numéro national de prévention du suicide",
    "phone": "3114",
    "hours": "24 hours, every day",
    "notes": "Free, run by the Ministry of Health.",
    "web": "https://3114.fr",
    "source": "https://3114.fr/"
   },
   {
    "name": "SOS Amitié",
    "phone": "09 72 39 40 50",
    "hours": "24 hours, every day",
    "notes": "Anonymous.",
    "web": "https://www.sosamitie.org",
    "source": "https://www.sosamitie.org/"
   }
  ]
 },
 {
  "country": "Belgium",
  "code": "BE",
  "flag": "🇧🇪",
  "emergency": "112",
  "emergencyNote": "Police 101",
  "emergencySource": "https://112.be/fr",
  "lines": [
   {
    "name": "Centre de Prévention du Suicide",
    "phone": "0800 32 123",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous, in French.",
    "web": "https://www.preventionsuicide.be",
    "source": "https://www.preventionsuicide.be/la-ligne-decoute-0800-32-123"
   },
   {
    "name": "Zelfmoordlijn 1813",
    "phone": "1813",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous, in Dutch.",
    "web": "https://www.zelfmoord1813.be",
    "source": "https://www.zelfmoord1813.be/"
   }
  ]
 },
 {
  "country": "Germany",
  "code": "DE",
  "flag": "🇩🇪",
  "emergency": "112",
  "emergencyNote": "Police 110",
  "emergencySource": "https://gesund.bund.de/wege-im-gesundheitswesen/jugend/psychische-gesundheit/soforthilfe",
  "lines": [
   {
    "name": "TelefonSeelsorge",
    "phone": "0800 111 0 111",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous. Also 0800 111 0 222 or 116 123.",
    "web": "https://www.telefonseelsorge.de",
    "source": "https://www.telefonseelsorge.de/telefon/"
   }
  ]
 },
 {
  "country": "Austria",
  "code": "AT",
  "flag": "🇦🇹",
  "emergency": "144",
  "emergencyNote": "Police 133 · 112 also works",
  "emergencySource": "https://www.oesterreich.gv.at/de/themen/notfaelle_unfaelle_und_kriminalitaet/notrufnummern",
  "lines": [
   {
    "name": "TelefonSeelsorge · Notruf 142",
    "phone": "142",
    "hours": "24 hours, every day",
    "notes": "Free and confidential.",
    "web": "https://www.telefonseelsorge.at",
    "source": "https://www.telefonseelsorge.at/notruf-142"
   },
   {
    "name": "Ö3-Kummernummer (Rotes Kreuz)",
    "phone": "116 123",
    "hours": "Every day, 16:00–24:00",
    "notes": "Free and anonymous.",
    "web": "https://oe3.orf.at/kummernummer",
    "source": "https://www.roteskreuz.at/wien/ich-brauche-hilfe/telefonische-beratung"
   }
  ]
 },
 {
  "country": "Switzerland",
  "code": "CH",
  "flag": "🇨🇭",
  "emergency": "144",
  "emergencyNote": "Police 117 · 112 also works",
  "emergencySource": "https://bern.ch/en/topics/health-age-social-well-being/emergency",
  "lines": [
   {
    "name": "Die Dargebotene Hand / La Main Tendue / Telefono Amico · 143",
    "phone": "143",
    "hours": "24 hours, every day",
    "notes": "Anonymous, in German, French and Italian. In English: 0800 143 000, 18:00–23:00.",
    "web": "https://www.143.ch",
    "source": "https://www.143.ch/hilfesuchende/hilfesuchende-kontakt"
   }
  ]
 },
 {
  "country": "Netherlands",
  "code": "NL",
  "flag": "🇳🇱",
  "emergency": "112",
  "emergencySource": "https://www.rijksoverheid.nl/onderwerpen/alarmnummer-112/vraag-en-antwoord/wanneer-112-bellen",
  "lines": [
   {
    "name": "113 Zelfmoordpreventie",
    "phone": "113",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous. From abroad, use the chat on the website.",
    "web": "https://www.113.nl",
    "source": "https://www.113.nl/english"
   },
   {
    "name": "De Luisterlijn",
    "phone": "088 0767 000",
    "hours": "24 hours, every day",
    "notes": "Anonymous.",
    "web": "https://www.deluisterlijn.nl",
    "source": "https://www.deluisterlijn.nl/"
   }
  ]
 },
 {
  "country": "Poland",
  "code": "PL",
  "flag": "🇵🇱",
  "emergency": "112",
  "emergencyNote": "Ambulance 999 · Police 997",
  "emergencySource": "https://www.gov.pl/web/zdrowie/gdzie-uzyskac-pomoc-psychologiczna-i-psychiatryczna",
  "lines": [
   {
    "name": "116 123 · Telefon wsparcia emocjonalnego",
    "phone": "116 123",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous.",
    "web": "https://www.116sos.pl",
    "source": "https://www.116sos.pl/"
   },
   {
    "name": "Centrum Wsparcia dla Osób Dorosłych w Kryzysie Psychicznym",
    "phone": "800 70 2222",
    "hours": "24 hours, every day",
    "notes": "Free, for adults in crisis.",
    "web": "https://centrumwsparcia.pl",
    "source": "https://centrumwsparcia.pl/"
   }
  ]
 },
 {
  "country": "United Kingdom",
  "code": "GB",
  "flag": "🇬🇧",
  "emergency": "999",
  "emergencySource": "https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/",
  "lines": [
   {
    "name": "Samaritans",
    "phone": "116 123",
    "hours": "24 hours, every day",
    "notes": "Free from any phone.",
    "web": "https://www.samaritans.org",
    "source": "https://www.samaritans.org/how-we-can-help/contact-samaritan/"
   },
   {
    "name": "Shout",
    "phone": "",
    "hours": "24 hours, every day",
    "notes": "Text SHOUT to 85258. Free and confidential.",
    "web": "https://giveusashout.org",
    "source": "https://giveusashout.org/get-help/"
   }
  ]
 },
 {
  "country": "Ireland",
  "code": "IE",
  "flag": "🇮🇪",
  "emergency": "112",
  "emergencyNote": "999 also works",
  "emergencySource": "https://www2.hse.ie/mental-health/services-support/get-urgent-help/",
  "lines": [
   {
    "name": "Samaritans Ireland",
    "phone": "116 123",
    "hours": "24 hours, every day",
    "notes": "Free from any phone.",
    "web": "https://www.samaritans.org/ireland/",
    "source": "https://www.samaritans.org/ireland/how-we-can-help/contact-samaritan/"
   },
   {
    "name": "Pieta",
    "phone": "1800 247 247",
    "hours": "24 hours, every day",
    "notes": "Free. Suicide and self-harm support. Text HELP to 51444 (standard SMS rates).",
    "web": "https://www.pieta.ie",
    "source": "https://www2.hse.ie/mental-health/services-support/supports-services/"
   }
  ]
 },
 {
  "country": "Sweden",
  "code": "SE",
  "flag": "🇸🇪",
  "emergency": "112",
  "emergencySource": "https://ki.se/nasp/information-och-stod/hjalplinjer-och-stod",
  "lines": [
   {
    "name": "Mind Självmordslinjen",
    "phone": "90101",
    "hours": "24 hours, every day",
    "notes": "Suicide prevention line.",
    "web": "https://mind.se",
    "source": "https://ki.se/nasp/information-och-stod/hjalplinjer-och-stod"
   },
   {
    "name": "Hjälplinjen",
    "phone": "90390",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous.",
    "web": "https://hjalplinjen.se",
    "source": "https://hjalplinjen.se/"
   }
  ]
 },
 {
  "country": "Norway",
  "code": "NO",
  "flag": "🇳🇴",
  "emergency": "113",
  "emergencyNote": "Police 112 · Fire 110",
  "emergencySource": "https://www.helsenorge.no/en/psykisk-helse/do-you-need-someone-to-talk-to/",
  "lines": [
   {
    "name": "Mental Helse Hjelpetelefonen",
    "phone": "116 123",
    "hours": "24 hours, every day",
    "notes": "Free.",
    "web": "https://mentalhelse.no",
    "source": "https://mentalhelse.no/fa-hjelp/hjelpetelefonen"
   },
   {
    "name": "Kirkens SOS",
    "phone": "22 40 00 40",
    "hours": "24 hours, every day",
    "notes": "",
    "web": "https://www.kirkens-sos.no",
    "source": "https://www.kirkens-sos.no/telefon"
   }
  ]
 },
 {
  "country": "Denmark",
  "code": "DK",
  "flag": "🇩🇰",
  "emergency": "112",
  "emergencyNote": "112 also gives quick access to psychiatric advice.",
  "emergencySource": "https://via.ritzau.dk/pressemeddelelse/15093586",
  "lines": [
   {
    "name": "Livslinien",
    "phone": "70 201 201",
    "hours": "Every day, 09:00–05:00",
    "notes": "Anonymous.",
    "web": "https://www.livslinien.dk",
    "source": "https://www.livslinien.dk/raadgivning/telefonraadgivning"
   }
  ]
 },
 {
  "country": "Finland",
  "code": "FI",
  "flag": "🇫🇮",
  "emergency": "112",
  "emergencySource": "https://112.fi/",
  "lines": [
   {
    "name": "MIELI Kriisipuhelin",
    "phone": "09 2525 0111",
    "hours": "24 hours, every day",
    "notes": "In Finnish.",
    "web": "https://mieli.fi",
    "source": "https://mieli.fi/tukea-ja-apua/kriisipuhelin/"
   },
   {
    "name": "Palveleva puhelin",
    "phone": "0400 22 11 80",
    "hours": "Every day, 18:00–24:00",
    "notes": "In Finnish.",
    "web": "https://evl.fi/apua-ja-tukea/palveleva-puhelin/",
    "source": "https://evl.fi/apua-ja-tukea/palveleva-puhelin/"
   }
  ]
 },
 {
  "country": "Greece",
  "code": "GR",
  "flag": "🇬🇷",
  "emergency": "112",
  "emergencyNote": "Ambulance 166",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/greece/getting-help",
  "lines": [
   {
    "name": "Klimaka · Suicide Helpline 1018 (Κλίμακα)",
    "phone": "1018",
    "hours": "24 hours, every day",
    "notes": "Anonymous.",
    "web": "https://www.klimaka.org.gr/kentro-imeras-gia-tin-prolipsi-tis-autoktonias/",
    "source": "https://www.klimaka.org.gr/kentro-imeras-gia-tin-prolipsi-tis-autoktonias/"
   },
   {
    "name": "Psychosocial Support Line 10306 (Γραμμή Ψυχοκοινωνικής Υποστήριξης)",
    "phone": "10306",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous, in Greek and English.",
    "source": "https://www.moh.gov.gr/articles/newspaper/promhtheies-symbaseis/prokhrykseis-tomeakoy-programmatos-anaptykshs/14433-apofash-entakshs-ths-prakshs-laquo-leitoyrgia-ths-dwrean-thlefwnikhs-grammhs-psyxokoinwnikhs-yposthrikshs-10306-raquo-me-kwdiko-ops-5229281-sto-laquo-tpa-ypoyrgeioy-ygeias-2026-2030-raquo"
   }
  ]
 },
 {
  "country": "Croatia",
  "code": "HR",
  "flag": "🇭🇷",
  "emergency": "112",
  "emergencyNote": "Ambulance 194",
  "emergencySource": "https://www.gov.hr/hr/112-jedinstveni-europski-broj-za-hitne-sluzbe/1184",
  "lines": [
   {
    "name": "Telefon za krizna stanja i prevenciju suicida · KBC Zagreb",
    "phone": "01 2376 335",
    "hours": "24 hours, every day",
    "notes": "Run by Zagreb University Hospital. Also 01 2376 470.",
    "web": "https://www.kbc-zagreb.hr/klinika-za-psihijatriju-i-psiholosku-medicinu.aspx",
    "source": "https://www.kbc-zagreb.hr/klinika-za-psihijatriju-i-psiholosku-medicinu.aspx"
   },
   {
    "name": "Plavi telefon",
    "phone": "01 4833 888",
    "hours": "Mon–Fri, 09:00–20:00",
    "notes": "For people of all ages.",
    "web": "https://www.plavi-telefon.hr",
    "source": "https://www.plavi-telefon.hr/"
   }
  ]
 },
 {
  "country": "Hungary",
  "code": "HU",
  "flag": "🇭🇺",
  "emergency": "112",
  "emergencySource": "https://www.police.hu/hu/112",
  "lines": [
   {
    "name": "Lelki Elsősegély Telefonszolgálat 116-123",
    "phone": "116 123",
    "hours": "24 hours, every day",
    "notes": "Free.",
    "web": "https://sos116-123.hu",
    "source": "https://sos116-123.hu/"
   },
   {
    "name": "Kék Vonal 116-111",
    "phone": "116 111",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous, for people under 24.",
    "web": "https://kek-vonal.hu",
    "source": "https://kek-vonal.hu/"
   }
  ]
 },
 {
  "country": "Romania",
  "code": "RO",
  "flag": "🇷🇴",
  "emergency": "112",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/romania/getting-help",
  "lines": [
   {
    "name": "depreHUB Helpline",
    "phone": "0374 456 420",
    "hours": "24 hours, every day",
    "notes": "Volunteer psychologists and psychology students.",
    "web": "https://deprehub.ro",
    "source": "https://deprehub.ro/"
   },
   {
    "name": "TelVerde Antisuicid",
    "phone": "0800 801 200",
    "hours": "Fri–Sun, 19:00–07:00",
    "notes": "Free, for adults in crisis.",
    "web": "https://www.antisuicid.ro",
    "source": "https://www.antisuicid.ro/"
   }
  ]
 },
 {
  "country": "Turkey",
  "code": "TR",
  "flag": "🇹🇷",
  "emergency": "112",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/turkey/getting-help",
  "lines": []
 },
 {
  "country": "Russia",
  "code": "RU",
  "flag": "🇷🇺",
  "emergency": "112",
  "emergencyNote": "Ambulance 103",
  "emergencySource": "https://mchs.gov.ru/deyatelnost/press-centr/novosti/1431843",
  "lines": [
   {
    "name": "Экстренная психологическая помощь МЧС России (EMERCOM)",
    "phone": "8 495 989 50 50",
    "hours": "24 hours, every day",
    "notes": "Run by the Ministry of Emergency Situations.",
    "web": "https://mchs.gov.ru/ministerstvo/uchrezhdeniya-mchs-rossii/federalnye-gosudarstvennye-byudzhetnye-uchrezhdeniya/fku-centr-ekstrennoy-psihologicheskoy-pomoshchi-mchs-rossii",
    "source": "https://www.mos.ru/otvet-ekstrennie-situacii/kak-poluchit-ekstrennuyu-suicidologicheskuyu-pomosch"
   }
  ]
 },
 {
  "country": "United States",
  "code": "US",
  "flag": "🇺🇸",
  "emergency": "911",
  "emergencySource": "https://www.nimh.nih.gov/health/topics/suicide-prevention",
  "lines": [
   {
    "name": "988 Suicide & Crisis Lifeline",
    "phone": "988",
    "hours": "24 hours, every day",
    "notes": "Free and confidential. You can also text 988. Spanish: press 2. Veterans: press 1.",
    "web": "https://988lifeline.org",
    "source": "https://988lifeline.org/talk-to-someone-now/"
   },
   {
    "name": "Crisis Text Line",
    "phone": "",
    "hours": "24 hours, every day",
    "notes": "Text HOME (or HOLA, in Spanish) to 741741. Free on AT&T, T-Mobile, Sprint and Verizon.",
    "web": "https://www.crisistextline.org",
    "source": "https://www.crisistextline.org/faq/"
   }
  ]
 },
 {
  "country": "Canada",
  "code": "CA",
  "flag": "🇨🇦",
  "emergency": "911",
  "emergencySource": "https://www.canada.ca/en/public-health/services/mental-health-services/mental-health-get-help.html",
  "lines": [
   {
    "name": "9-8-8: Suicide Crisis Helpline",
    "phone": "988",
    "hours": "24 hours, every day",
    "notes": "Free to call, in English and French. You can also text 988.",
    "web": "https://988.ca",
    "source": "https://988.ca/get-help/what-to-expect"
   },
   {
    "name": "Kids Help Phone",
    "phone": "1 800 668 6868",
    "hours": "24 hours, every day",
    "notes": "Free, for young people aged 5 to 29. Text CONNECT to 686868.",
    "web": "https://kidshelpphone.ca",
    "source": "https://www.canada.ca/en/public-health/services/mental-health-services/mental-health-get-help.html"
   }
  ]
 },
 {
  "country": "Mexico",
  "code": "MX",
  "flag": "🇲🇽",
  "emergency": "911",
  "emergencySource": "https://www.gob.mx/911/articulos/que-es-el-911emergencias?idiom=es",
  "lines": [
   {
    "name": "Línea de la Vida (CONASAMA)",
    "phone": "800 911 2000",
    "hours": "24 hours, every day",
    "notes": "Free, run by the Ministry of Health.",
    "web": "https://www.gob.mx/conasama/articulos/linea-de-la-vida-800-911-2000",
    "source": "https://www.gob.mx/conasama/articulos/linea-de-la-vida-800-911-2000"
   },
   {
    "name": "SAPTEL",
    "phone": "55 5259 8121",
    "hours": "24 hours, every day",
    "notes": "Crisis support by trained psychologists.",
    "web": "https://www.saptel.org.mx",
    "source": "https://www.saptel.org.mx/"
   }
  ]
 },
 {
  "country": "Argentina",
  "code": "AR",
  "flag": "🇦🇷",
  "emergency": "911",
  "emergencyNote": "Ambulance 107 (SAME) in Buenos Aires",
  "emergencySource": "https://www.argentina.gob.ar/tema/emergencias",
  "lines": [
   {
    "name": "Línea Nacional de Orientación y Apoyo en la Urgencia de Salud Mental",
    "phone": "0800 999 0091",
    "hours": "24 hours, every day",
    "notes": "Free, confidential, run by the Ministry of Health.",
    "web": "https://www.argentina.gob.ar/dispositivo-0800",
    "source": "https://www.argentina.gob.ar/node/513585"
   },
   {
    "name": "Centro de Asistencia al Suicida (CAS)",
    "phone": "0800 345 1435",
    "hours": "Every day, 08:00–24:00",
    "notes": "Volunteers. From Buenos Aires City and Greater Buenos Aires, dial 135 for free.",
    "web": "https://www.asistenciaalsuicida.org.ar",
    "source": "https://www.asistenciaalsuicida.org.ar/horarios-de-atencion"
   }
  ]
 },
 {
  "country": "Brazil",
  "code": "BR",
  "flag": "🇧🇷",
  "emergency": "192",
  "emergencyNote": "Police 190 · Fire 193",
  "emergencySource": "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/samu-192",
  "lines": [
   {
    "name": "CVV · Centro de Valorização da Vida",
    "phone": "188",
    "hours": "24 hours, every day",
    "notes": "Free from any phone.",
    "web": "https://cvv.org.br",
    "source": "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/s/suicidio-prevencao"
   }
  ]
 },
 {
  "country": "Chile",
  "code": "CL",
  "flag": "🇨🇱",
  "emergency": "131",
  "emergencyNote": "Police 133 · Fire 132",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/chile/getting-help",
  "lines": [
   {
    "name": "Línea de Prevención del Suicidio *4141",
    "phone": "",
    "hours": "24 hours, every day",
    "notes": "Free, run by the Ministry of Health. Dial *4141 from a mobile phone.",
    "web": "https://www.minsal.cl/linea-de-atencion-4141-no-estas-solo-no-estas-sola/",
    "source": "https://www.crececontigo.gob.cl/noticias/no-estas-solo-no-estas-sola-ministerio-de-salud-tiene-disponible-el-fono-4141-linea-prevencion-del-suicidio/"
   },
   {
    "name": "Salud Responde (Minsal)",
    "phone": "600 360 7777",
    "hours": "24 hours, every day",
    "notes": "General health line, not a crisis line.",
    "web": "https://saludresponde.minsal.cl/",
    "source": "https://chileatiende.gob.cl/fichas/2467-salud-responde"
   }
  ]
 },
 {
  "country": "Colombia",
  "code": "CO",
  "flag": "🇨🇴",
  "emergency": "123",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/colombia/getting-help",
  "lines": [
   {
    "name": "Línea 106 · Línea Nacional de Salud Mental",
    "phone": "106",
    "hours": "24 hours, every day",
    "notes": "Free public mental health line. If no one answers, call 123.",
    "web": "https://www.minsalud.gov.co/salud/publica/salud-mental/Paginas/linea-106.aspx",
    "source": "https://www.fomag.gov.co/wp-content/uploads/2026/06/directorio-salud-mental-prevencion-suicidio-minsalud-4-11.pdf"
   }
  ]
 },
 {
  "country": "Peru",
  "code": "PE",
  "flag": "🇵🇪",
  "emergency": "106",
  "emergencyNote": "Fire and rescue 116 · Police 105",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/peru/getting-help",
  "lines": [
   {
    "name": "Línea 113 Salud (Minsa)",
    "phone": "113",
    "hours": "24 hours, every day",
    "notes": "Free, run by the Ministry of Health. Mental health: press 5 (or 3, then 5).",
    "web": "https://www.gob.pe/555",
    "source": "https://busquedas.elperuano.pe/dispositivo/NL/2415136-1"
   },
   {
    "name": "La Voz Amiga",
    "phone": "0800 4 1212",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous.",
    "web": "https://www.lavozamigaperu.org/",
    "source": "https://www.lavozamigaperu.org/contactanos/"
   }
  ]
 },
 {
  "country": "Saudi Arabia",
  "code": "SA",
  "flag": "🇸🇦",
  "emergency": "997",
  "emergencyNote": "Police 999 · 911 in Riyadh, Makkah, Madinah and the Eastern Province",
  "emergencySource": "https://www.stc.com.sa/en/personal/support/support-library/emergency-numbers.html",
  "lines": [
   {
    "name": "Psychological Consultation Center (National Center for Mental Health Promotion)",
    "phone": "9200 33360",
    "hours": "Sun–Thu, 08:00–20:00 · Sat, 13:00–20:00",
    "notes": "",
    "web": "https://ncmh.org.sa",
    "source": "https://www.moh.gov.sa/en/Ministry/Information-and-services/Pages/psychiatry.aspx"
   },
   {
    "name": "937 · Ministry of Health",
    "phone": "937",
    "hours": "24 hours, every day",
    "notes": "General health line, not a crisis line.",
    "web": "https://www.moh.gov.sa/en/937/Pages/default.aspx",
    "source": "https://www.moh.gov.sa/en/937/Pages/default.aspx"
   }
  ]
 },
 {
  "country": "United Arab Emirates",
  "code": "AE",
  "flag": "🇦🇪",
  "emergency": "998",
  "emergencyNote": "Police 999",
  "emergencySource": "https://www.ajman.ae/en/node/416",
  "lines": [
   {
    "name": "Itma'en Mental Wellbeing Hotline (Dubai)",
    "phone": "800 506",
    "hours": "Every day, 09:00–24:00",
    "notes": "Free and confidential, in Arabic and English.",
    "web": "https://dubaihealth.ae",
    "source": "https://dubaihealth.ae/w/dubai-health-community-development-authority-and-dubai-health-authority-introduce-the-itma-en-service-to-support-mental-wellbeing-and-quality-of-life-in-dubai"
   },
   {
    "name": "800-SAKINA (Abu Dhabi)",
    "phone": "800 725462",
    "hours": "24 hours, every day",
    "notes": "In Arabic and English.",
    "source": "https://www.mediaoffice.abudhabi/en/health/department-of-health-abu-dhabi-activates-24-7-mental-health-support-hotline-800-sakina/"
   }
  ]
 },
 {
  "country": "Egypt",
  "code": "EG",
  "flag": "🇪🇬",
  "emergency": "123",
  "emergencyNote": "Police 122",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/egypt/getting-help",
  "lines": [
   {
    "name": "Psychological Support Hotline · Ministry of Health and Population",
    "phone": "16328",
    "hours": "24 hours, every day",
    "notes": "",
    "source": "https://www.egyptindependent.com/egypt-prioritizes-mental-health-support-expands-services-nationwide/"
   }
  ]
 },
 {
  "country": "Morocco",
  "code": "MA",
  "flag": "🇲🇦",
  "emergency": "150",
  "emergencyNote": "Police 190 · Gendarmerie 177",
  "emergencySource": "https://travel.gc.ca/destinations/morocco",
  "lines": []
 },
 {
  "country": "Israel",
  "code": "IL",
  "flag": "🇮🇱",
  "emergency": "101",
  "emergencyNote": "Police 100",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/israel/getting-help",
  "lines": [
   {
    "name": "ERAN (ער״ן) · Emotional First Aid",
    "phone": "1201",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous. Arabic: press 7. WhatsApp (Hebrew): 052-845-1201, 08:00–02:00.",
    "web": "https://en.eran.org.il",
    "source": "https://en.eran.org.il/emotional-first-aid/"
   },
   {
    "name": "SAHAR (סה״ר) · Online emotional support",
    "phone": "",
    "hours": "Sun–Thu, 16:00–03:00 · Fri, Sat and holiday eves, 18:00–24:00",
    "notes": "Free, anonymous chat on the website. WhatsApp: 055-957-1399.",
    "web": "https://sahar.org.il",
    "source": "https://sahar.org.il/"
   }
  ]
 },
 {
  "country": "India",
  "code": "IN",
  "flag": "🇮🇳",
  "emergency": "112",
  "emergencyNote": "Ambulance 108 in many states",
  "emergencySource": "https://keralapolice.gov.in/home/page/award/10",
  "lines": [
   {
    "name": "Tele MANAS",
    "phone": "14416",
    "hours": "24 hours, every day",
    "notes": "Free, run by the Ministry of Health. 20 Indian languages. They may call you back.",
    "web": "https://telemanas.mohfw.gov.in",
    "source": "https://telemanas.mohfw.gov.in/"
   },
   {
    "name": "Vandrevala Foundation Helpline",
    "phone": "9999 666 555",
    "hours": "24 hours, every day",
    "notes": "Free, by call or WhatsApp.",
    "web": "https://www.vandrevalafoundation.com",
    "source": "https://www.vandrevalafoundation.com/free-counseling"
   }
  ]
 },
 {
  "country": "Pakistan",
  "code": "PK",
  "flag": "🇵🇰",
  "emergency": "1122",
  "emergencyNote": "Police 15 · Edhi ambulance 115",
  "emergencySource": "https://rescue.gov.pk/",
  "lines": [
   {
    "name": "Taskeen Helpline",
    "phone": "0316 8275336",
    "hours": "Mon–Sat, 11:00–23:00",
    "notes": "Free.",
    "web": "https://taskeen.org",
    "source": "https://taskeen.org/seek-help/"
   },
   {
    "name": "Rozan Counseling Helpline",
    "phone": "0304 111 1741",
    "hours": "Mon–Fri, 09:30–17:00",
    "notes": "Open to everyone. Toll-free landline: 0800 22 444.",
    "web": "https://rozan.org",
    "source": "https://rozan.org/rozan-counseling-helpline/"
   }
  ]
 },
 {
  "country": "Indonesia",
  "code": "ID",
  "flag": "🇮🇩",
  "emergency": "119",
  "emergencyNote": "Police 110 · 112 in some cities",
  "emergencySource": "https://kemkes.go.id/id/akses-darurat-medis-119-kini-bisa-melalui-satusehat-mobile",
  "lines": [
   {
    "name": "Healing119 (Kementerian Kesehatan)",
    "phone": "119",
    "hours": "24 hours, every day",
    "notes": "Free, run by the Ministry of Health. Call 119 and press 8.",
    "web": "https://www.healing119.id",
    "source": "https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/FAQ_Cegah_Bunuh_Diri%2C_Dukung_Kesehatan_Jiwa__Kenali_Layanan_Healing119.id.pdf"
   }
  ]
 },
 {
  "country": "Philippines",
  "code": "PH",
  "flag": "🇵🇭",
  "emergency": "911",
  "emergencySource": "https://calabarzon.dilg.gov.ph/one-number-for-all-emergencies-unified-911-to-launch-nationwide/",
  "lines": [
   {
    "name": "NCMH Crisis Hotline (National Center for Mental Health)",
    "phone": "0917 899 8727",
    "hours": "24 hours, every day",
    "notes": "Government line. From landlines, 1553 is toll-free. Smart/TNT: 0919 057 1553.",
    "web": "https://ncmh.gov.ph",
    "source": "https://quezoncity.gov.ph/national-mental-health-week-3/"
   },
   {
    "name": "In Touch Crisis Line",
    "phone": "02 8893 7603",
    "hours": "24 hours, every day",
    "notes": "Free and anonymous. Also 0917 800 1123 or 0919 056 0709.",
    "web": "https://in-touch.org",
    "source": "https://in-touch.org/"
   }
  ]
 },
 {
  "country": "Thailand",
  "code": "TH",
  "flag": "🇹🇭",
  "emergency": "1669",
  "emergencyNote": "General emergency 191",
  "emergencySource": "https://www.gov.uk/foreign-travel-advice/thailand/getting-help",
  "lines": [
   {
    "name": "Mental Health Hotline 1323 (Department of Mental Health)",
    "phone": "1323",
    "hours": "24 hours, every day",
    "notes": "Free, confidential, run by the Ministry of Health.",
    "web": "https://www.dmh.go.th",
    "source": "https://www.dmh.go.th/"
   },
   {
    "name": "Samaritans of Thailand",
    "phone": "02 113 6789",
    "hours": "Every day, 12:00–22:00",
    "notes": "Thai: press 1. English: press 2 and they call you back.",
    "web": "https://www.samaritansthai.com",
    "source": "https://www.samaritansthai.com/contactus/"
   }
  ]
 },
 {
  "country": "China",
  "code": "CN",
  "flag": "🇨🇳",
  "emergency": "120",
  "emergencyNote": "Police 110",
  "emergencySource": "https://www.gov.cn/zhengce/2013-11/29/content_5713800.htm",
  "lines": [
   {
    "name": "12356 心理援助热线 (National Psychological Assistance Hotline)",
    "phone": "12356",
    "hours": "Every day",
    "notes": "National line, open at least 18 hours a day; 24 hours in some cities.",
    "source": "https://www.gov.cn/zhengce/zhengceku/202412/content_6994470.htm"
   },
   {
    "name": "Lifeline Shanghai",
    "phone": "400 821 1215",
    "hours": "Every day, 10:00–22:00",
    "notes": "Anonymous and confidential, in English.",
    "web": "https://www.lifeline-shanghai.com",
    "source": "https://www.gov.uk/government/publications/china-mental-health-support-abroad/mental-health-support-for-british-nationals-in-china"
   }
  ]
 },
 {
  "country": "Hong Kong",
  "code": "HK",
  "flag": "🇭🇰",
  "emergency": "999",
  "emergencySource": "https://www.hkengage.gov.hk/en/essentials/basics/emergency-ambulance-services",
  "lines": [
   {
    "name": "18111 Mental Health Support Hotline (情緒通)",
    "phone": "18111",
    "hours": "24 hours, every day",
    "notes": "Government line in 12 languages, including English. Also on WhatsApp.",
    "web": "https://www.shallwetalk.hk/en/get-help/mental-health-support-hotline-18111/",
    "source": "https://www.shallwetalk.hk/en/get-help/mental-health-support-hotline-18111/"
   },
   {
    "name": "The Samaritans Hong Kong (撒瑪利亞會)",
    "phone": "2896 0000",
    "hours": "24 hours, every day",
    "notes": "Multilingual suicide prevention line.",
    "web": "https://samaritans.org.hk",
    "source": "https://www.shallwetalk.hk/en/get-help/emergency-helplines/"
   }
  ]
 },
 {
  "country": "Japan",
  "code": "JP",
  "flag": "🇯🇵",
  "emergency": "119",
  "emergencyNote": "Police 110",
  "emergencySource": "https://www.fdma.go.jp/publication/portal/items/portal001_pamphiet_english.pdf",
  "lines": [
   {
    "name": "Yorisoi Hotline (よりそいホットライン)",
    "phone": "0120 279 338",
    "hours": "24 hours, every day",
    "notes": "Free. English and other languages: press 2 (10:00–22:00). If you feel suicidal: press 5.",
    "web": "https://www.since2011.net/yorisoi/",
    "source": "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hukushi_kaigo/seikatsuhogo/jisatsu/soudan_tel.html"
   },
   {
    "name": "TELL Lifeline",
    "phone": "0800 300 8355",
    "hours": "Sun and Mon, 05:30–23:00 · Tue–Fri, 09:00–16:00 and 19:30–23:00 · Sat, 09:00–23:00",
    "notes": "Free, in English.",
    "web": "https://telljp.com/lifeline/",
    "source": "https://telljp.com/tell-hours/"
   }
  ]
 },
 {
  "country": "South Korea",
  "code": "KR",
  "flag": "🇰🇷",
  "emergency": "119",
  "emergencyNote": "Police 112",
  "emergencySource": "https://www.korea.kr/news/policyNewsView.do?newsId=156034566",
  "lines": [
   {
    "name": "자살예방상담전화 109 (Suicide Prevention Hotline)",
    "phone": "109",
    "hours": "24 hours, every day",
    "notes": "Free, run by the Ministry of Health.",
    "web": "https://www.129.go.kr/109",
    "source": "https://mohw.go.kr/board.es?act=view&bid=0027&list_no=1491820&mid=a10503010100&nPage=1&tag="
   },
   {
    "name": "정신건강 위기상담전화 (Mental Health Crisis Line)",
    "phone": "1577 0199",
    "hours": "24 hours, every day",
    "notes": "Connects you to a mental health centre near you.",
    "source": "https://www.129.go.kr/109"
   }
  ]
 },
 {
  "country": "Singapore",
  "code": "SG",
  "flag": "🇸🇬",
  "emergency": "995",
  "emergencyNote": "Police 999",
  "emergencySource": "https://www.scdf.gov.sg/home/about-scdf/emergency-medical-services",
  "lines": [
   {
    "name": "Samaritans of Singapore (SOS)",
    "phone": "1767",
    "hours": "24 hours, every day",
    "notes": "Trained volunteers. WhatsApp: 9151 1767.",
    "web": "https://www.sos.org.sg",
    "source": "https://www.sos.org.sg/"
   },
   {
    "name": "national mindline 1771",
    "phone": "1771",
    "hours": "24 hours, every day",
    "notes": "Run by the Ministry of Health. WhatsApp: 6669 1771.",
    "web": "https://www.mindline.sg",
    "source": "https://www.moh.gov.sg/newsroom/national-mindline-1771-to-provide--round-the-clock-support-for-mental-health/"
   }
  ]
 },
 {
  "country": "Vietnam",
  "code": "VN",
  "flag": "🇻🇳",
  "emergency": "115",
  "emergencyNote": "Police 113 · Fire 114",
  "emergencySource": "https://congan.dienbien.gov.vn/Danh-muc-tin-tuc/tong-hop-cac-so-dien-thoai-khan-cap-quoc-gia-ghi-nho-de-bao-ve-minh-va-ho-tro-nguoi-khac-13182.html",
  "lines": [
   {
    "name": "HOPE – Hy Vọng Sống",
    "phone": "086 50 444 00",
    "hours": "Every day, 12:00–24:00",
    "notes": "Suicide prevention line, in Vietnamese and English.",
    "web": "https://hyvongsong.com",
    "source": "https://hyvongsong.com/"
   },
   {
    "name": "Đường dây nóng Ngày Mai",
    "phone": "096 306 1414",
    "hours": "Wed–Sun, 13:00–20:30",
    "notes": "Psychological first aid by volunteers.",
    "web": "https://duongdaynongngaymai.vn",
    "source": "https://duongdaynongngaymai.vn/"
   }
  ]
 },
 {
  "country": "Australia",
  "code": "AU",
  "flag": "🇦🇺",
  "emergency": "000",
  "emergencySource": "https://www.healthdirect.gov.au/calling-triple-zero",
  "lines": [
   {
    "name": "Lifeline",
    "phone": "13 11 14",
    "hours": "24 hours, every day",
    "notes": "Free from mobiles. You can also text 0477 13 11 14.",
    "web": "https://www.lifeline.org.au",
    "source": "https://www.lifeline.org.au/131114/"
   },
   {
    "name": "Suicide Call Back Service",
    "phone": "1300 659 467",
    "hours": "24 hours, every day",
    "notes": "Counselling if you feel suicidal or are worried about someone.",
    "web": "https://www.suicidecallbackservice.org.au",
    "source": "https://www.suicidecallbackservice.org.au/"
   }
  ]
 },
 {
  "country": "New Zealand",
  "code": "NZ",
  "flag": "🇳🇿",
  "emergency": "111",
  "emergencySource": "https://www.police.govt.nz/contact-us/111-police-emergency",
  "lines": [
   {
    "name": "1737 Need to Talk?",
    "phone": "1737",
    "hours": "24 hours, every day",
    "notes": "Free and confidential. You can also text 1737.",
    "web": "https://1737.org.nz",
    "source": "https://1737.org.nz/"
   },
   {
    "name": "Samaritans",
    "phone": "0800 726 666",
    "hours": "24 hours, every day",
    "notes": "Free.",
    "web": "https://www.samaritans.org.nz",
    "source": "https://www.mhwc.govt.nz/where-to-get-support/"
   }
  ]
 },
 {
  "country": "South Africa",
  "code": "ZA",
  "flag": "🇿🇦",
  "emergency": "112",
  "emergencyNote": "Ambulance 10177 · Police 10111",
  "emergencySource": "https://www.westerncape.gov.za/know-who-you-can-call-emergency",
  "lines": [
   {
    "name": "SADAG Suicide Crisis Helpline",
    "phone": "0800 567 567",
    "hours": "24 hours, every day",
    "notes": "Free.",
    "web": "https://www.sadag.org",
    "source": "https://www.sadag.org/"
   },
   {
    "name": "SADAG Cipla Mental Health Helpline",
    "phone": "0800 456 789",
    "hours": "24 hours, every day",
    "notes": "Free. You can also text 31393.",
    "web": "https://www.sadag.org",
    "source": "https://www.sadag.org/"
   }
  ]
 },
 {
  "country": "Kenya",
  "code": "KE",
  "flag": "🇰🇪",
  "emergency": "999",
  "emergencyNote": "Ambulance 112",
  "emergencySource": "https://www.ca.go.ke/sites/default/files/2026-04/Numbering%20Plan%20Kenya%20April%202026.pdf",
  "lines": [
   {
    "name": "Befrienders Kenya",
    "phone": "0722 178 177",
    "hours": "Mon–Fri, 09:00–17:00",
    "notes": "Confidential support by call, SMS or WhatsApp.",
    "source": "https://findahelpline.com/organizations/befrienders-kenya"
   }
  ]
 },
 {
  "country": "Nigeria",
  "code": "NG",
  "flag": "🇳🇬",
  "emergency": "112",
  "emergencySource": "https://ncc.gov.ng/node/1397",
  "lines": [
   {
    "name": "SURPIN Suicide Prevention Helpline",
    "phone": "0800 078 7746",
    "hours": "24 hours, every day",
    "notes": "Free.",
    "web": "https://surpinng.com",
    "source": "https://surpinng.com/"
   },
   {
    "name": "She Writes Woman Mental Health Helpline",
    "phone": "0800 800 2000",
    "hours": "24 hours, every day",
    "notes": "Free.",
    "web": "https://shewriteswoman.org",
    "source": "https://shewriteswoman.org/"
   }
  ]
 }
];
  var TEXTOS = {
 "112 also gives quick access to psychiatric advice.": {
  "es": "El 112 también te da acceso rápido a asesoramiento psiquiátrico.",
  "ca": "El 112 també et dona accés ràpid a assessorament psiquiàtric.",
  "fr": "Le 112 permet aussi d'obtenir rapidement un avis psychiatrique.",
  "de": "Über 112 bekommst du auch schnell psychiatrische Beratung.",
  "it": "Chiamando il 112 puoi anche ricevere rapidamente una consulenza psichiatrica.",
  "pt": "O 112 também dá acesso rápido a aconselhamento psiquiátrico.",
  "ja": "112 に電話すると、精神科の助言にもすぐつないでもらえます。",
  "zh": "拨打 112 也能快速获得精神科咨询。",
  "ko": "112로 전화하면 정신과 상담에도 빠르게 연결돼요.",
  "hi": "112 पर आप जल्दी मनोचिकित्सकीय सलाह भी ले सकते हैं।",
  "id": "112 juga memberi akses cepat ke konsultasi psikiatri.",
  "tr": "112 üzerinden psikiyatrik danışmanlığa da hızla ulaşabilirsin.",
  "ru": "По номеру 112 также можно быстро получить консультацию психиатра.",
  "vi": "Gọi 112 cũng giúp bạn nhanh chóng được tư vấn chuyên khoa tâm thần.",
  "ar": "يتيح لك الرقم 112 أيضًا الوصول بسرعة إلى استشارة في الطب النفسي."
 },
 "24 hours, every day": {
  "es": "24 horas, todos los días",
  "ca": "24 hores, cada dia",
  "fr": "24 h/24, tous les jours",
  "de": "Rund um die Uhr, jeden Tag",
  "it": "24 ore su 24, ogni giorno",
  "pt": "24 horas, todos os dias",
  "ja": "毎日24時間",
  "zh": "每天 24 小时",
  "ko": "24시간 연중무휴",
  "hi": "24 घंटे, हर दिन",
  "id": "24 jam, setiap hari",
  "tr": "Her gün, 24 saat",
  "ru": "Круглосуточно, без выходных",
  "vi": "24 giờ, hằng ngày",
  "ar": "على مدار 24 ساعة طوال أيام الأسبوع"
 },
 "999 also works": {
  "es": "También puedes llamar al 999",
  "ca": "També pots trucar al 999",
  "fr": "Vous pouvez aussi appeler le 999",
  "de": "Du kannst auch 999 wählen",
  "it": "Puoi chiamare anche il 999",
  "pt": "Também podes ligar para o 999",
  "ja": "999 でもつながります",
  "zh": "也可拨打 999",
  "ko": "999로도 연결돼요",
  "hi": "999 पर भी कॉल कर सकते हैं",
  "id": "999 juga bisa dihubungi",
  "tr": "999'u da arayabilirsin",
  "ru": "Также работает номер 999",
  "vi": "Cũng có thể gọi 999",
  "ar": "يعمل الرقم 999 أيضًا"
 },
 "A global network of emotional-support centres. Find the nearest one.": {
  "es": "Una red mundial de centros de apoyo emocional. Encuentra el más cercano.",
  "ca": "Una xarxa mundial de centres de suport emocional. Troba el més proper.",
  "fr": "Un réseau mondial de centres de soutien émotionnel. Trouvez le centre le plus proche.",
  "de": "Ein weltweites Netzwerk von Anlaufstellen für emotionale Unterstützung. Finde die nächstgelegene.",
  "it": "Una rete mondiale di centri di sostegno emotivo. Trova quello più vicino a te.",
  "pt": "Uma rede mundial de centros de apoio emocional. Encontra o mais próximo de ti.",
  "ja": "心のサポートを行うセンターの世界的なネットワーク。最寄りのセンターを探してみてください。",
  "zh": "一个遍布全球的情绪支持中心网络。查找离你最近的中心。",
  "ko": "전 세계 정서 지원 센터 네트워크. 가장 가까운 센터를 찾아보세요.",
  "hi": "भावनात्मक सहायता केंद्रों का एक वैश्विक नेटवर्क। अपना सबसे नज़दीकी केंद्र खोजें।",
  "id": "Jaringan global pusat dukungan emosional. Temukan yang terdekat denganmu.",
  "tr": "Dünya çapında duygusal destek merkezlerinden oluşan bir ağ. Sana en yakın olanı bul.",
  "ru": "Всемирная сеть центров эмоциональной поддержки. Найдите ближайший к вам.",
  "vi": "Mạng lưới toàn cầu các trung tâm hỗ trợ tinh thần. Hãy tìm trung tâm gần bạn nhất.",
  "ar": "شبكة عالمية من مراكز الدعم العاطفي. ابحث عن أقرب مركز إليك."
 },
 "Ambulance 10177 · Police 10111": {
  "es": "Ambulancia 10177 · Policía 10111",
  "ca": "Ambulància 10177 · Policia 10111",
  "fr": "Ambulance 10177 · Police 10111",
  "de": "Rettungsdienst 10177 · Polizei 10111",
  "it": "Ambulanza 10177 · Polizia 10111",
  "pt": "Ambulância 10177 · Polícia 10111",
  "ja": "救急車 10177 · 警察 10111",
  "zh": "急救 10177 · 报警 10111",
  "ko": "구급차 10177 · 경찰 10111",
  "hi": "एंबुलेंस 10177 · पुलिस 10111",
  "id": "Ambulans 10177 · Polisi 10111",
  "tr": "Ambulans 10177 · Polis 10111",
  "ru": "Скорая помощь 10177 · Полиция 10111",
  "vi": "Cấp cứu 10177 · Cảnh sát 10111",
  "ar": "الإسعاف 10177 · الشرطة 10111"
 },
 "Ambulance 103": {
  "es": "Ambulancia 103",
  "ca": "Ambulància 103",
  "fr": "Ambulance 103",
  "de": "Rettungsdienst 103",
  "it": "Ambulanza 103",
  "pt": "Ambulância 103",
  "ja": "救急車 103",
  "zh": "急救 103",
  "ko": "구급차 103",
  "hi": "एंबुलेंस 103",
  "id": "Ambulans 103",
  "tr": "Ambulans 103",
  "ru": "Скорая помощь 103",
  "vi": "Cấp cứu 103",
  "ar": "الإسعاف 103"
 },
 "Ambulance 107 (SAME) in Buenos Aires": {
  "es": "Ambulancia 107 (SAME) en Buenos Aires",
  "ca": "Ambulància 107 (SAME) a Buenos Aires",
  "fr": "Ambulance 107 (SAME) à Buenos Aires",
  "de": "Rettungsdienst 107 (SAME) in Buenos Aires",
  "it": "Ambulanza 107 (SAME) a Buenos Aires",
  "pt": "Ambulância 107 (SAME) em Buenos Aires",
  "ja": "ブエノスアイレスでは救急車 107（SAME）",
  "zh": "布宜诺斯艾利斯急救 107（SAME）",
  "ko": "부에노스아이레스에서는 구급차 107(SAME)",
  "hi": "ब्यूनस आयर्स में एंबुलेंस 107 (SAME)",
  "id": "Ambulans 107 (SAME) di Buenos Aires",
  "tr": "Buenos Aires'te ambulans 107 (SAME)",
  "ru": "Скорая помощь 107 (SAME) в Буэнос-Айресе",
  "vi": "Cấp cứu 107 (SAME) ở Buenos Aires",
  "ar": "الإسعاف 107 (SAME) في بوينس آيرس"
 },
 "Ambulance 108 in many states": {
  "es": "Ambulancia 108 en muchos estados",
  "ca": "Ambulància 108 en molts estats",
  "fr": "Ambulance 108 dans de nombreux États",
  "de": "Rettungsdienst 108 in vielen Bundesstaaten",
  "it": "Ambulanza 108 in molti Stati",
  "pt": "Ambulância 108 em muitos estados",
  "ja": "多くの州では救急車 108",
  "zh": "急救 108（许多邦适用）",
  "ko": "많은 주에서는 구급차 108",
  "hi": "कई राज्यों में एंबुलेंस 108",
  "id": "Ambulans 108 di banyak negara bagian",
  "tr": "Birçok eyalette ambulans 108",
  "ru": "Скорая помощь 108 во многих штатах",
  "vi": "Cấp cứu 108 ở nhiều bang",
  "ar": "الإسعاف 108 في كثير من الولايات"
 },
 "Ambulance 112": {
  "es": "Ambulancia 112",
  "ca": "Ambulància 112",
  "fr": "Ambulance 112",
  "de": "Rettungsdienst 112",
  "it": "Ambulanza 112",
  "pt": "Ambulância 112",
  "ja": "救急車 112",
  "zh": "急救 112",
  "ko": "구급차 112",
  "hi": "एंबुलेंस 112",
  "id": "Ambulans 112",
  "tr": "Ambulans 112",
  "ru": "Скорая помощь 112",
  "vi": "Cấp cứu 112",
  "ar": "الإسعاف 112"
 },
 "Ambulance 118": {
  "es": "Ambulancia 118",
  "ca": "Ambulància 118",
  "fr": "Ambulance 118",
  "de": "Rettungsdienst 118",
  "it": "Ambulanza 118",
  "pt": "Ambulância 118",
  "ja": "救急車 118",
  "zh": "急救 118",
  "ko": "구급차 118",
  "hi": "एंबुलेंस 118",
  "id": "Ambulans 118",
  "tr": "Ambulans 118",
  "ru": "Скорая помощь 118",
  "vi": "Cấp cứu 118",
  "ar": "الإسعاف 118"
 },
 "Ambulance 15 (SAMU)": {
  "es": "Ambulancia 15 (SAMU)",
  "ca": "Ambulància 15 (SAMU)",
  "fr": "Urgence médicale 15 (SAMU)",
  "de": "Rettungsdienst 15 (SAMU)",
  "it": "Ambulanza 15 (SAMU)",
  "pt": "Ambulância 15 (SAMU)",
  "ja": "救急車 15（SAMU）",
  "zh": "急救 15（SAMU）",
  "ko": "구급차 15(SAMU)",
  "hi": "एंबुलेंस 15 (SAMU)",
  "id": "Ambulans 15 (SAMU)",
  "tr": "Ambulans 15 (SAMU)",
  "ru": "Скорая помощь 15 (SAMU)",
  "vi": "Cấp cứu 15 (SAMU)",
  "ar": "الإسعاف 15 (SAMU)"
 },
 "Ambulance 166": {
  "es": "Ambulancia 166",
  "ca": "Ambulància 166",
  "fr": "Ambulance 166",
  "de": "Rettungsdienst 166",
  "it": "Ambulanza 166",
  "pt": "Ambulância 166",
  "ja": "救急車 166",
  "zh": "急救 166",
  "ko": "구급차 166",
  "hi": "एंबुलेंस 166",
  "id": "Ambulans 166",
  "tr": "Ambulans 166",
  "ru": "Скорая помощь 166",
  "vi": "Cấp cứu 166",
  "ar": "الإسعاف 166"
 },
 "Ambulance 194": {
  "es": "Ambulancia 194",
  "ca": "Ambulància 194",
  "fr": "Ambulance 194",
  "de": "Rettungsdienst 194",
  "it": "Ambulanza 194",
  "pt": "Ambulância 194",
  "ja": "救急車 194",
  "zh": "急救 194",
  "ko": "구급차 194",
  "hi": "एंबुलेंस 194",
  "id": "Ambulans 194",
  "tr": "Ambulans 194",
  "ru": "Скорая помощь 194",
  "vi": "Cấp cứu 194",
  "ar": "الإسعاف 194"
 },
 "Ambulance 999 · Police 997": {
  "es": "Ambulancia 999 · Policía 997",
  "ca": "Ambulància 999 · Policia 997",
  "fr": "Ambulance 999 · Police 997",
  "de": "Rettungsdienst 999 · Polizei 997",
  "it": "Ambulanza 999 · Polizia 997",
  "pt": "Ambulância 999 · Polícia 997",
  "ja": "救急車 999 · 警察 997",
  "zh": "急救 999 · 报警 997",
  "ko": "구급차 999 · 경찰 997",
  "hi": "एंबुलेंस 999 · पुलिस 997",
  "id": "Ambulans 999 · Polisi 997",
  "tr": "Ambulans 999 · Polis 997",
  "ru": "Скорая помощь 999 · Полиция 997",
  "vi": "Cấp cứu 999 · Cảnh sát 997",
  "ar": "الإسعاف 999 · الشرطة 997"
 },
 "Anonymous and confidential, in English.": {
  "es": "Anónimo y confidencial, en inglés.",
  "ca": "Anònim i confidencial, en anglès.",
  "fr": "Anonyme et confidentiel, en anglais.",
  "de": "Anonym und vertraulich, auf Englisch.",
  "it": "Anonimo e riservato, in inglese.",
  "pt": "Anónimo e confidencial, em inglês.",
  "ja": "匿名で相談でき、秘密は守られます。英語で対応しています。",
  "zh": "匿名、保密，提供英语服务。",
  "ko": "영어로 익명 상담을 받을 수 있고, 비밀이 보장돼요.",
  "hi": "गुमनाम और गोपनीय, अंग्रेज़ी में।",
  "id": "Anonim dan rahasia, dalam bahasa Inggris.",
  "tr": "Anonim ve gizli. İngilizce hizmet verir.",
  "ru": "Анонимно и конфиденциально, на английском языке.",
  "vi": "Ẩn danh và bảo mật, bằng tiếng Anh.",
  "ar": "سرّي ودون الكشف عن هويتك، بالإنجليزية."
 },
 "Anonymous, in German, French and Italian. In English: 0800 143 000, 18:00–23:00.": {
  "es": "Anónimo, en alemán, francés e italiano. En inglés: 0800 143 000, de 18:00 a 23:00.",
  "ca": "Anònim, en alemany, francès i italià. En anglès: 0800 143 000, de 18:00 a 23:00.",
  "fr": "Anonyme, en allemand, en français et en italien. En anglais : 0800 143 000, de 18 h à 23 h.",
  "de": "Anonym, auf Deutsch, Französisch und Italienisch. Auf Englisch: 0800 143 000, 18:00–23:00 Uhr.",
  "it": "Anonimo, in tedesco, francese e italiano. In inglese: 0800 143 000, dalle 18:00 alle 23:00.",
  "pt": "Anónimo, em alemão, francês e italiano. Em inglês: 0800 143 000, das 18h às 23h.",
  "ja": "匿名で相談できます。ドイツ語・フランス語・イタリア語で対応しています。英語での相談は 0800 143 000（18:00〜23:00）。",
  "zh": "可匿名，提供德语、法语和意大利语服务。英语服务：0800 143 000，18:00–23:00。",
  "ko": "독일어, 프랑스어, 이탈리아어로 익명 상담을 받을 수 있어요. 영어 상담: 0800 143 000, 18:00~23:00.",
  "hi": "गुमनाम सेवा, जर्मन, फ़्रेंच और इतालवी में। अंग्रेज़ी में: 0800 143 000, 18:00–23:00।",
  "id": "Anonim, dalam bahasa Jerman, Prancis, dan Italia. Dalam bahasa Inggris: 0800 143 000, pukul 18.00–23.00.",
  "tr": "Anonim. Almanca, Fransızca ve İtalyanca hizmet verir. İngilizce için: 0800 143 000, 18:00–23:00.",
  "ru": "Анонимно, на немецком, французском и итальянском языках. На английском: 0800 143 000, 18:00–23:00.",
  "vi": "Bạn có thể giữ ẩn danh. Hỗ trợ bằng tiếng Đức, tiếng Pháp và tiếng Ý. Tiếng Anh: 0800 143 000, 18:00–23:00.",
  "ar": "دون الكشف عن هويتك، بالألمانية والفرنسية والإيطالية. بالإنجليزية: ‎0800 143 000، من 18:00 إلى 23:00."
 },
 "Anonymous.": {
  "es": "Anónimo.",
  "ca": "Anònim.",
  "fr": "Anonyme.",
  "de": "Anonym.",
  "it": "Anonimo.",
  "pt": "Anónimo.",
  "ja": "匿名で相談できます。",
  "zh": "可匿名。",
  "ko": "익명으로 상담할 수 있어요.",
  "hi": "गुमनाम।",
  "id": "Anonim.",
  "tr": "Anonim.",
  "ru": "Анонимно.",
  "vi": "Bạn có thể giữ ẩn danh.",
  "ar": "دون الكشف عن هويتك."
 },
 "Anonymous. WhatsApp: 324 011 72 52, every day 18:00–21:00.": {
  "es": "Anónimo. WhatsApp: 324 011 72 52, todos los días de 18:00 a 21:00.",
  "ca": "Anònim. WhatsApp: 324 011 72 52, cada dia de 18:00 a 21:00.",
  "fr": "Anonyme. WhatsApp : 324 011 72 52, tous les jours de 18 h à 21 h.",
  "de": "Anonym. WhatsApp: 324 011 72 52, jeden Tag 18:00–21:00 Uhr.",
  "it": "Anonimo. WhatsApp: 324 011 72 52, ogni giorno dalle 18:00 alle 21:00.",
  "pt": "Anónimo. WhatsApp: 324 011 72 52, todos os dias, das 18h às 21h.",
  "ja": "匿名で相談できます。WhatsApp：324 011 72 52（毎日 18:00〜21:00）。",
  "zh": "可匿名。WhatsApp：324 011 72 52，每天 18:00–21:00。",
  "ko": "익명으로 상담할 수 있어요. WhatsApp: 324 011 72 52, 매일 18:00~21:00.",
  "hi": "गुमनाम। WhatsApp: 324 011 72 52, हर दिन 18:00–21:00।",
  "id": "Anonim. WhatsApp: 324 011 72 52, setiap hari pukul 18.00–21.00.",
  "tr": "Anonim. WhatsApp: 324 011 72 52, her gün 18:00–21:00.",
  "ru": "Анонимно. WhatsApp: 324 011 72 52, ежедневно 18:00–21:00.",
  "vi": "Bạn có thể giữ ẩn danh. WhatsApp: 324 011 72 52, hằng ngày 18:00–21:00.",
  "ar": "دون الكشف عن هويتك. WhatsApp: ‎324 011 72 52، يوميًا من 18:00 إلى 21:00."
 },
 "Anytime": {
  "es": "En cualquier momento",
  "ca": "En qualsevol moment",
  "fr": "À tout moment",
  "de": "Jederzeit",
  "it": "In qualsiasi momento",
  "pt": "A qualquer hora",
  "ja": "いつでも",
  "zh": "任何时间",
  "ko": "언제든지",
  "hi": "कभी भी",
  "id": "Kapan saja",
  "tr": "Her zaman",
  "ru": "В любое время",
  "vi": "Bất cứ lúc nào",
  "ar": "في أي وقت"
 },
 "Confidential support by call, SMS or WhatsApp.": {
  "es": "Apoyo confidencial por llamada, SMS o WhatsApp.",
  "ca": "Suport confidencial per telèfon, SMS o WhatsApp.",
  "fr": "Soutien confidentiel par téléphone, SMS ou WhatsApp.",
  "de": "Vertrauliche Unterstützung per Anruf, SMS oder WhatsApp.",
  "it": "Sostegno riservato per telefono, SMS o WhatsApp.",
  "pt": "Apoio confidencial por telefone, SMS ou WhatsApp.",
  "ja": "電話、SMS、WhatsApp で相談でき、秘密は守られます。",
  "zh": "通过电话、短信或 WhatsApp 提供保密支持。",
  "ko": "전화, 문자, WhatsApp으로 상담할 수 있고 비밀이 보장돼요.",
  "hi": "कॉल, SMS या WhatsApp के ज़रिए गोपनीय सहायता।",
  "id": "Dukungan yang terjamin kerahasiaannya, lewat telepon, SMS, atau WhatsApp.",
  "tr": "Telefon, SMS veya WhatsApp üzerinden gizli destek.",
  "ru": "Конфиденциальная поддержка по телефону, SMS или в WhatsApp.",
  "vi": "Hỗ trợ qua cuộc gọi, SMS hoặc WhatsApp. Mọi thông tin đều được bảo mật.",
  "ar": "دعم سرّي عبر الاتصال أو الرسائل النصية أو WhatsApp."
 },
 "Confidential.": {
  "es": "Confidencial.",
  "ca": "Confidencial.",
  "fr": "Confidentiel.",
  "de": "Vertraulich.",
  "it": "Riservatezza garantita.",
  "pt": "Confidencial.",
  "ja": "秘密は守られます。",
  "zh": "保密。",
  "ko": "비밀이 보장돼요.",
  "hi": "गोपनीय।",
  "id": "Kerahasiaan terjamin.",
  "tr": "Görüşmeler gizlidir.",
  "ru": "Конфиденциально.",
  "vi": "Thông tin được bảo mật.",
  "ar": "سرّي."
 },
 "Connects you to a mental health centre near you.": {
  "es": "Te pone en contacto con un centro de salud mental cerca de ti.",
  "ca": "Et posa en contacte amb un centre de salut mental a prop teu.",
  "fr": "Vous met en relation avec un centre de santé mentale près de chez vous.",
  "de": "Verbindet dich mit einem Zentrum für psychische Gesundheit in deiner Nähe.",
  "it": "Ti mette in contatto con un centro di salute mentale vicino a te.",
  "pt": "Põe-te em contacto com um centro de saúde mental perto de ti.",
  "ja": "お近くの精神保健センターにつながります。",
  "zh": "为你转接附近的心理健康中心。",
  "ko": "가까운 정신건강복지센터로 연결돼요.",
  "hi": "यह हेल्पलाइन आपको आपके नज़दीकी मानसिक स्वास्थ्य केंद्र से जोड़ती है।",
  "id": "Menghubungkanmu ke pusat kesehatan jiwa terdekat.",
  "tr": "Seni yakınındaki bir ruh sağlığı merkezine bağlar.",
  "ru": "Соединяет с ближайшим к вам центром психического здоровья.",
  "vi": "Kết nối bạn với trung tâm sức khỏe tâm thần gần nơi bạn ở.",
  "ar": "يوصلك بمركز للصحة النفسية قريب منك."
 },
 "Counselling if you feel suicidal or are worried about someone.": {
  "es": "Apoyo psicológico si tienes pensamientos de suicidio o te preocupa alguien.",
  "ca": "Atenció psicològica si tens pensaments de suïcidi o et preocupa algú.",
  "fr": "Soutien psychologique si vous avez des idées suicidaires ou si vous vous inquiétez pour quelqu'un.",
  "de": "Beratung, wenn du Suizidgedanken hast oder dir Sorgen um jemanden machst.",
  "it": "Sostegno psicologico se hai pensieri suicidi o se sei in pensiero per qualcuno.",
  "pt": "Aconselhamento se tens pensamentos suicidas ou se alguém te preocupa.",
  "ja": "死にたいほどつらいときや、誰かのことが心配なときに、カウンセリングを受けられます。",
  "zh": "如果你有自杀的念头，或正在为某个人担心，可以在这里获得心理咨询。",
  "ko": "죽고 싶은 마음이 들거나 누군가가 걱정될 때 상담을 받을 수 있어요.",
  "hi": "परामर्श, अगर आपके मन में आत्महत्या के विचार आ रहे हैं या आप किसी को लेकर चिंतित हैं।",
  "id": "Konseling jika kamu punya pikiran untuk mengakhiri hidup atau mengkhawatirkan seseorang.",
  "tr": "İntihar düşüncelerin varsa ya da biri için endişeleniyorsan psikolojik danışmanlık verir.",
  "ru": "Консультации, если вы думаете о самоубийстве или беспокоитесь за кого-то.",
  "vi": "Tư vấn khi bạn có ý nghĩ tự tử hoặc đang lo lắng cho một ai đó.",
  "ar": "استشارة نفسية إذا راودتك أفكار انتحارية أو ساورك القلق على شخص ما."
 },
 "Crisis support by trained psychologists.": {
  "es": "Apoyo en crisis a cargo de psicólogos especializados.",
  "ca": "Suport en situacions de crisi a càrrec de psicòlegs especialitzats.",
  "fr": "Soutien en cas de crise, assuré par des psychologues spécialement formés.",
  "de": "Krisenhilfe durch geschulte Psychologinnen und Psychologen.",
  "it": "Sostegno nelle situazioni di crisi, a cura di psicologi con formazione specifica.",
  "pt": "Apoio em situações de crise, prestado por psicólogos com formação específica.",
  "ja": "訓練を受けた心理士が、危機のときの相談に応じます。",
  "zh": "由受过专业培训的心理咨询师提供危机干预。",
  "ko": "훈련받은 심리 전문가가 위기 상담을 해 드려요.",
  "hi": "प्रशिक्षित मनोवैज्ञानिकों द्वारा संकट में सहायता।",
  "id": "Dukungan krisis oleh psikolog terlatih.",
  "tr": "Kriz müdahalesi eğitimi almış psikologlar destek verir.",
  "ru": "Кризисную помощь оказывают специально подготовленные психологи.",
  "vi": "Hỗ trợ khủng hoảng do các nhà tâm lý học đã qua đào tạo thực hiện.",
  "ar": "دعم في الأزمات يقدّمه أخصائيون نفسيون مدرَّبون."
 },
 "Every day": {
  "es": "Todos los días",
  "ca": "Cada dia",
  "fr": "Tous les jours",
  "de": "Jeden Tag",
  "it": "Ogni giorno",
  "pt": "Todos os dias",
  "ja": "毎日",
  "zh": "每天",
  "ko": "매일",
  "hi": "हर दिन",
  "id": "Setiap hari",
  "tr": "Her gün",
  "ru": "Ежедневно",
  "vi": "Hằng ngày",
  "ar": "يوميًا"
 },
 "Every day, 08:00–24:00": {
  "es": "Todos los días, de 08:00 a 24:00",
  "ca": "Cada dia, de 8:00 a 24:00",
  "fr": "Tous les jours, de 8 h à minuit",
  "de": "Jeden Tag, 08:00–24:00 Uhr",
  "it": "Ogni giorno, dalle 08:00 alle 24:00",
  "pt": "Todos os dias, das 8h às 24h",
  "ja": "毎日 8:00〜24:00",
  "zh": "每天 08:00–24:00",
  "ko": "매일 08:00~24:00",
  "hi": "हर दिन, 08:00–24:00",
  "id": "Setiap hari, 08.00–24.00",
  "tr": "Her gün, 08:00–24:00",
  "ru": "Ежедневно, 08:00–24:00",
  "vi": "Hằng ngày, 08:00–24:00",
  "ar": "يوميًا، من 08:00 إلى 24:00"
 },
 "Every day, 09:00–05:00": {
  "es": "Todos los días, de 09:00 a 05:00",
  "ca": "Cada dia, de 9:00 a 5:00",
  "fr": "Tous les jours, de 9 h à 5 h du matin",
  "de": "Jeden Tag, 09:00–05:00 Uhr",
  "it": "Ogni giorno, dalle 09:00 alle 05:00 del mattino",
  "pt": "Todos os dias, das 9h às 5h da madrugada",
  "ja": "毎日 9:00〜翌5:00",
  "zh": "每天 09:00–次日 05:00",
  "ko": "매일 09:00~다음 날 05:00",
  "hi": "हर दिन, 09:00–05:00",
  "id": "Setiap hari, 09.00–05.00",
  "tr": "Her gün, 09:00–05:00",
  "ru": "Ежедневно, 09:00–05:00",
  "vi": "Hằng ngày, 09:00–05:00 sáng hôm sau",
  "ar": "يوميًا، من 09:00 إلى 05:00"
 },
 "Every day, 09:00–24:00": {
  "es": "Todos los días, de 09:00 a 24:00",
  "ca": "Cada dia, de 9:00 a 24:00",
  "fr": "Tous les jours, de 9 h à minuit",
  "de": "Jeden Tag, 09:00–24:00 Uhr",
  "it": "Ogni giorno, dalle 09:00 alle 24:00",
  "pt": "Todos os dias, das 9h às 24h",
  "ja": "毎日 9:00〜24:00",
  "zh": "每天 09:00–24:00",
  "ko": "매일 09:00~24:00",
  "hi": "हर दिन, 09:00–24:00",
  "id": "Setiap hari, 09.00–24.00",
  "tr": "Her gün, 09:00–24:00",
  "ru": "Ежедневно, 09:00–24:00",
  "vi": "Hằng ngày, 09:00–24:00",
  "ar": "يوميًا، من 09:00 إلى 24:00"
 },
 "Every day, 10:00–22:00": {
  "es": "Todos los días, de 10:00 a 22:00",
  "ca": "Cada dia, de 10:00 a 22:00",
  "fr": "Tous les jours, de 10 h à 22 h",
  "de": "Jeden Tag, 10:00–22:00 Uhr",
  "it": "Ogni giorno, dalle 10:00 alle 22:00",
  "pt": "Todos os dias, das 10h às 22h",
  "ja": "毎日 10:00〜22:00",
  "zh": "每天 10:00–22:00",
  "ko": "매일 10:00~22:00",
  "hi": "हर दिन, 10:00–22:00",
  "id": "Setiap hari, 10.00–22.00",
  "tr": "Her gün, 10:00–22:00",
  "ru": "Ежедневно, 10:00–22:00",
  "vi": "Hằng ngày, 10:00–22:00",
  "ar": "يوميًا، من 10:00 إلى 22:00"
 },
 "Every day, 12:00–22:00": {
  "es": "Todos los días, de 12:00 a 22:00",
  "ca": "Cada dia, de 12:00 a 22:00",
  "fr": "Tous les jours, de 12 h à 22 h",
  "de": "Jeden Tag, 12:00–22:00 Uhr",
  "it": "Ogni giorno, dalle 12:00 alle 22:00",
  "pt": "Todos os dias, das 12h às 22h",
  "ja": "毎日 12:00〜22:00",
  "zh": "每天 12:00–22:00",
  "ko": "매일 12:00~22:00",
  "hi": "हर दिन, 12:00–22:00",
  "id": "Setiap hari, 12.00–22.00",
  "tr": "Her gün, 12:00–22:00",
  "ru": "Ежедневно, 12:00–22:00",
  "vi": "Hằng ngày, 12:00–22:00",
  "ar": "يوميًا، من 12:00 إلى 22:00"
 },
 "Every day, 12:00–24:00": {
  "es": "Todos los días, de 12:00 a 24:00",
  "ca": "Cada dia, de 12:00 a 24:00",
  "fr": "Tous les jours, de 12 h à minuit",
  "de": "Jeden Tag, 12:00–24:00 Uhr",
  "it": "Ogni giorno, dalle 12:00 alle 24:00",
  "pt": "Todos os dias, das 12h às 24h",
  "ja": "毎日 12:00〜24:00",
  "zh": "每天 12:00–24:00",
  "ko": "매일 12:00~24:00",
  "hi": "हर दिन, 12:00–24:00",
  "id": "Setiap hari, 12.00–24.00",
  "tr": "Her gün, 12:00–24:00",
  "ru": "Ежедневно, 12:00–24:00",
  "vi": "Hằng ngày, 12:00–24:00",
  "ar": "يوميًا، من 12:00 إلى 24:00"
 },
 "Every day, 13:00–22:00": {
  "es": "Todos los días, de 13:00 a 22:00",
  "ca": "Cada dia, de 13:00 a 22:00",
  "fr": "Tous les jours, de 13 h à 22 h",
  "de": "Jeden Tag, 13:00–22:00 Uhr",
  "it": "Ogni giorno, dalle 13:00 alle 22:00",
  "pt": "Todos os dias, das 13h às 22h",
  "ja": "毎日 13:00〜22:00",
  "zh": "每天 13:00–22:00",
  "ko": "매일 13:00~22:00",
  "hi": "हर दिन, 13:00–22:00",
  "id": "Setiap hari, 13.00–22.00",
  "tr": "Her gün, 13:00–22:00",
  "ru": "Ежедневно, 13:00–22:00",
  "vi": "Hằng ngày, 13:00–22:00",
  "ar": "يوميًا، من 13:00 إلى 22:00"
 },
 "Every day, 16:00–24:00": {
  "es": "Todos los días, de 16:00 a 24:00",
  "ca": "Cada dia, de 16:00 a 24:00",
  "fr": "Tous les jours, de 16 h à minuit",
  "de": "Jeden Tag, 16:00–24:00 Uhr",
  "it": "Ogni giorno, dalle 16:00 alle 24:00",
  "pt": "Todos os dias, das 16h às 24h",
  "ja": "毎日 16:00〜24:00",
  "zh": "每天 16:00–24:00",
  "ko": "매일 16:00~24:00",
  "hi": "हर दिन, 16:00–24:00",
  "id": "Setiap hari, 16.00–24.00",
  "tr": "Her gün, 16:00–24:00",
  "ru": "Ежедневно, 16:00–24:00",
  "vi": "Hằng ngày, 16:00–24:00",
  "ar": "يوميًا، من 16:00 إلى 24:00"
 },
 "Every day, 18:00–24:00": {
  "es": "Todos los días, de 18:00 a 24:00",
  "ca": "Cada dia, de 18:00 a 24:00",
  "fr": "Tous les jours, de 18 h à minuit",
  "de": "Jeden Tag, 18:00–24:00 Uhr",
  "it": "Ogni giorno, dalle 18:00 alle 24:00",
  "pt": "Todos os dias, das 18h às 24h",
  "ja": "毎日 18:00〜24:00",
  "zh": "每天 18:00–24:00",
  "ko": "매일 18:00~24:00",
  "hi": "हर दिन, 18:00–24:00",
  "id": "Setiap hari, 18.00–24.00",
  "tr": "Her gün, 18:00–24:00",
  "ru": "Ежедневно, 18:00–24:00",
  "vi": "Hằng ngày, 18:00–24:00",
  "ar": "يوميًا، من 18:00 إلى 24:00"
 },
 "Fire and rescue 116 · Police 105": {
  "es": "Bomberos y rescate 116 · Policía 105",
  "ca": "Bombers i rescat 116 · Policia 105",
  "fr": "Pompiers et secours 116 · Police 105",
  "de": "Feuerwehr und Rettung 116 · Polizei 105",
  "it": "Vigili del fuoco e soccorso 116 · Polizia 105",
  "pt": "Bombeiros e resgate 116 · Polícia 105",
  "ja": "消防・救助 116 · 警察 105",
  "zh": "消防救援 116 · 报警 105",
  "ko": "소방구조대 116 · 경찰 105",
  "hi": "अग्निशमन और बचाव 116 · पुलिस 105",
  "id": "Pemadam kebakaran dan penyelamatan 116 · Polisi 105",
  "tr": "İtfaiye ve kurtarma 116 · Polis 105",
  "ru": "Пожарно-спасательная служба 116 · Полиция 105",
  "vi": "Cứu hỏa và cứu nạn 116 · Cảnh sát 105",
  "ar": "الإطفاء والإنقاذ 116 · الشرطة 105"
 },
 "For people of all ages.": {
  "es": "Para personas de todas las edades.",
  "ca": "Per a persones de totes les edats.",
  "fr": "Pour les personnes de tout âge.",
  "de": "Für Menschen jeden Alters.",
  "it": "Per persone di tutte le età.",
  "pt": "Para pessoas de todas as idades.",
  "ja": "年齢を問わず、どなたでも相談できます。",
  "zh": "面向所有年龄段的人。",
  "ko": "나이와 관계없이 누구나 이용할 수 있어요.",
  "hi": "हर उम्र के लोगों के लिए।",
  "id": "Untuk semua usia.",
  "tr": "Her yaştan insan için.",
  "ru": "Для людей любого возраста.",
  "vi": "Dành cho mọi lứa tuổi.",
  "ar": "لجميع الأعمار."
 },
 "Free and anonymous, for people under 24.": {
  "es": "Gratuito y anónimo, para personas menores de 24 años.",
  "ca": "Gratuït i anònim, per a persones de menys de 24 anys.",
  "fr": "Gratuit et anonyme, pour les moins de 24 ans.",
  "de": "Kostenlos und anonym, für Menschen unter 24 Jahren.",
  "it": "Gratuito e anonimo, per chi ha meno di 24 anni.",
  "pt": "Gratuito e anónimo, para pessoas com menos de 24 anos.",
  "ja": "24歳未満の方のための、無料・匿名の相談窓口です。",
  "zh": "免费、匿名，面向未满 24 岁的儿童和年轻人。",
  "ko": "24세 미만을 위한 무료 익명 상담전화예요.",
  "hi": "मुफ़्त और गुमनाम, 24 साल से कम उम्र के लोगों के लिए।",
  "id": "Gratis dan anonim, untuk yang berusia di bawah 24 tahun.",
  "tr": "Ücretsiz ve anonim. 24 yaşın altındakiler için.",
  "ru": "Бесплатно и анонимно, для людей младше 24 лет.",
  "vi": "Miễn phí và ẩn danh, dành cho người dưới 24 tuổi.",
  "ar": "مجاني ودون الكشف عن هويتك، لمن تقلّ أعمارهم عن 24 عامًا."
 },
 "Free and anonymous, in Dutch.": {
  "es": "Gratuito y anónimo, en neerlandés.",
  "ca": "Gratuït i anònim, en neerlandès.",
  "fr": "Gratuit et anonyme, en néerlandais.",
  "de": "Kostenlos und anonym, auf Niederländisch.",
  "it": "Gratuito e anonimo, in neerlandese.",
  "pt": "Gratuito e anónimo, em neerlandês.",
  "ja": "無料・匿名で相談できます。オランダ語で対応しています。",
  "zh": "免费、匿名，提供荷兰语服务。",
  "ko": "네덜란드어로 무료 익명 상담을 받을 수 있어요.",
  "hi": "मुफ़्त और गुमनाम, डच में।",
  "id": "Gratis dan anonim, dalam bahasa Belanda.",
  "tr": "Ücretsiz ve anonim. Felemenkçe hizmet verir.",
  "ru": "Бесплатно и анонимно, на нидерландском языке.",
  "vi": "Miễn phí và ẩn danh, bằng tiếng Hà Lan.",
  "ar": "مجاني ودون الكشف عن هويتك، بالهولندية."
 },
 "Free and anonymous, in French.": {
  "es": "Gratuito y anónimo, en francés.",
  "ca": "Gratuït i anònim, en francès.",
  "fr": "Gratuit et anonyme, en français.",
  "de": "Kostenlos und anonym, auf Französisch.",
  "it": "Gratuito e anonimo, in francese.",
  "pt": "Gratuito e anónimo, em francês.",
  "ja": "無料・匿名で相談できます。フランス語で対応しています。",
  "zh": "免费、匿名，提供法语服务。",
  "ko": "프랑스어로 무료 익명 상담을 받을 수 있어요.",
  "hi": "मुफ़्त और गुमनाम, फ़्रेंच में।",
  "id": "Gratis dan anonim, dalam bahasa Prancis.",
  "tr": "Ücretsiz ve anonim. Fransızca hizmet verir.",
  "ru": "Бесплатно и анонимно, на французском языке.",
  "vi": "Miễn phí và ẩn danh, bằng tiếng Pháp.",
  "ar": "مجاني ودون الكشف عن هويتك، بالفرنسية."
 },
 "Free and anonymous, in Greek and English.": {
  "es": "Gratuito y anónimo, en griego e inglés.",
  "ca": "Gratuït i anònim, en grec i en anglès.",
  "fr": "Gratuit et anonyme, en grec et en anglais.",
  "de": "Kostenlos und anonym, auf Griechisch und Englisch.",
  "it": "Gratuito e anonimo, in greco e inglese.",
  "pt": "Gratuito e anónimo, em grego e inglês.",
  "ja": "無料・匿名で相談できます。ギリシャ語と英語で対応しています。",
  "zh": "免费、匿名，提供希腊语和英语服务。",
  "ko": "그리스어와 영어로 무료 익명 상담을 받을 수 있어요.",
  "hi": "मुफ़्त और गुमनाम, यूनानी और अंग्रेज़ी में।",
  "id": "Gratis dan anonim, dalam bahasa Yunani dan Inggris.",
  "tr": "Ücretsiz ve anonim. Yunanca ve İngilizce hizmet verir.",
  "ru": "Бесплатно и анонимно, на греческом и английском языках.",
  "vi": "Miễn phí và ẩn danh, bằng tiếng Hy Lạp và tiếng Anh.",
  "ar": "مجاني ودون الكشف عن هويتك، باليونانية والإنجليزية."
 },
 "Free and anonymous.": {
  "es": "Gratuito y anónimo.",
  "ca": "Gratuït i anònim.",
  "fr": "Gratuit et anonyme.",
  "de": "Kostenlos und anonym.",
  "it": "Gratuito e anonimo.",
  "pt": "Gratuito e anónimo.",
  "ja": "無料・匿名で相談できます。",
  "zh": "免费、匿名。",
  "ko": "무료로 익명 상담을 받을 수 있어요.",
  "hi": "मुफ़्त और गुमनाम।",
  "id": "Gratis dan anonim.",
  "tr": "Ücretsiz ve anonim.",
  "ru": "Бесплатно и анонимно.",
  "vi": "Miễn phí và ẩn danh.",
  "ar": "مجاني ودون الكشف عن هويتك."
 },
 "Free and anonymous. Also 0800 111 0 222 or 116 123.": {
  "es": "Gratuito y anónimo. También en el 0800 111 0 222 o el 116 123.",
  "ca": "Gratuït i anònim. També al 0800 111 0 222 o al 116 123.",
  "fr": "Gratuit et anonyme. Également au 0800 111 0 222 ou au 116 123.",
  "de": "Kostenlos und anonym. Auch unter 0800 111 0 222 oder 116 123.",
  "it": "Gratuito e anonimo. Anche ai numeri 0800 111 0 222 o 116 123.",
  "pt": "Gratuito e anónimo. Também podes ligar para o 0800 111 0 222 ou para o 116 123.",
  "ja": "無料・匿名で相談できます。0800 111 0 222 または 116 123 でもつながります。",
  "zh": "免费、匿名。也可拨打 0800 111 0 222 或 116 123。",
  "ko": "무료로 익명 상담을 받을 수 있어요. 0800 111 0 222 또는 116 123으로도 전화할 수 있어요.",
  "hi": "मुफ़्त और गुमनाम। आप 0800 111 0 222 या 116 123 पर भी कॉल कर सकते हैं।",
  "id": "Gratis dan anonim. Juga bisa dihubungi di 0800 111 0 222 atau 116 123.",
  "tr": "Ücretsiz ve anonim. 0800 111 0 222 veya 116 123 numaralarından da ulaşabilirsin.",
  "ru": "Бесплатно и анонимно. Также можно звонить по номеру 0800 111 0 222 или 116 123.",
  "vi": "Miễn phí và ẩn danh. Bạn cũng có thể gọi 0800 111 0 222 hoặc 116 123.",
  "ar": "مجاني ودون الكشف عن هويتك. ويمكنك أيضًا الاتصال بالرقم ‎0800 111 0 222 أو ‎116 123."
 },
 "Free and anonymous. Also 0917 800 1123 or 0919 056 0709.": {
  "es": "Gratuito y anónimo. También en el 0917 800 1123 o el 0919 056 0709.",
  "ca": "Gratuït i anònim. També al 0917 800 1123 o al 0919 056 0709.",
  "fr": "Gratuit et anonyme. Également au 0917 800 1123 ou au 0919 056 0709.",
  "de": "Kostenlos und anonym. Auch unter 0917 800 1123 oder 0919 056 0709.",
  "it": "Gratuito e anonimo. Anche ai numeri 0917 800 1123 o 0919 056 0709.",
  "pt": "Gratuito e anónimo. Também podes ligar para o 0917 800 1123 ou para o 0919 056 0709.",
  "ja": "無料・匿名で相談できます。0917 800 1123 または 0919 056 0709 でもつながります。",
  "zh": "免费、匿名。也可拨打 0917 800 1123 或 0919 056 0709。",
  "ko": "무료로 익명 상담을 받을 수 있어요. 0917 800 1123 또는 0919 056 0709로도 전화할 수 있어요.",
  "hi": "मुफ़्त और गुमनाम। आप 0917 800 1123 या 0919 056 0709 पर भी कॉल कर सकते हैं।",
  "id": "Gratis dan anonim. Juga bisa dihubungi di 0917 800 1123 atau 0919 056 0709.",
  "tr": "Ücretsiz ve anonim. 0917 800 1123 veya 0919 056 0709 numaralarından da ulaşabilirsin.",
  "ru": "Бесплатно и анонимно. Также можно звонить по номеру 0917 800 1123 или 0919 056 0709.",
  "vi": "Miễn phí và ẩn danh. Bạn cũng có thể gọi 0917 800 1123 hoặc 0919 056 0709.",
  "ar": "مجاني ودون الكشف عن هويتك. ويمكنك أيضًا الاتصال بالرقم ‎0917 800 1123 أو ‎0919 056 0709."
 },
 "Free and anonymous. Arabic: press 7. WhatsApp (Hebrew): 052-845-1201, 08:00–02:00.": {
  "es": "Gratuito y anónimo. En árabe: marca el 7. WhatsApp (en hebreo): 052-845-1201, de 08:00 a 02:00.",
  "ca": "Gratuït i anònim. En àrab: prem el 7. WhatsApp (en hebreu): 052-845-1201, de 8:00 a 2:00.",
  "fr": "Gratuit et anonyme. Pour l'arabe, tapez 7. WhatsApp (en hébreu) : 052-845-1201, de 8 h à 2 h du matin.",
  "de": "Kostenlos und anonym. Auf Arabisch: Taste 7. WhatsApp (auf Hebräisch): 052-845-1201, 08:00–02:00 Uhr.",
  "it": "Gratuito e anonimo. Per l'arabo, premi 7. WhatsApp (in ebraico): 052-845-1201, dalle 08:00 alle 02:00 di notte.",
  "pt": "Gratuito e anónimo. Em árabe: marca a opção 7. WhatsApp (em hebraico): 052-845-1201, das 8h às 2h da madrugada.",
  "ja": "無料・匿名で相談できます。アラビア語は 7 を押してください。WhatsApp（ヘブライ語）：052-845-1201（8:00〜翌2:00）。",
  "zh": "免费、匿名。阿拉伯语服务请按 7。WhatsApp（希伯来语）：052-845-1201，08:00–次日 02:00。",
  "ko": "무료로 익명 상담을 받을 수 있어요. 아랍어는 7번을 누르세요. WhatsApp(히브리어): 052-845-1201, 08:00~다음 날 02:00.",
  "hi": "मुफ़्त और गुमनाम। अरबी के लिए 7 दबाएँ। WhatsApp (हिब्रू): 052-845-1201, 08:00–02:00।",
  "id": "Gratis dan anonim. Bahasa Arab: tekan 7. WhatsApp (bahasa Ibrani): 052-845-1201, pukul 08.00–02.00.",
  "tr": "Ücretsiz ve anonim. Arapça için 7'yi tuşla. WhatsApp (İbranice): 052-845-1201, 08:00–02:00.",
  "ru": "Бесплатно и анонимно. На арабском: нажмите 7. WhatsApp (на иврите): 052-845-1201, 08:00–02:00.",
  "vi": "Miễn phí và ẩn danh. Tiếng Ả Rập: nhấn phím 7. WhatsApp (tiếng Do Thái): 052-845-1201, 08:00–02:00 sáng hôm sau.",
  "ar": "مجاني ودون الكشف عن هويتك. للعربية: اضغط 7. WhatsApp (بالعبرية): ‎052-845-1201، من 08:00 إلى 02:00."
 },
 "Free and anonymous. From abroad, use the chat on the website.": {
  "es": "Gratuito y anónimo. Desde el extranjero, usa el chat de su web.",
  "ca": "Gratuït i anònim. Des de l'estranger, fes servir el xat del lloc web.",
  "fr": "Gratuit et anonyme. Depuis l'étranger, utilisez le chat du site web.",
  "de": "Kostenlos und anonym. Aus dem Ausland nutze bitte den Chat auf der Website.",
  "it": "Gratuito e anonimo. Dall'estero, usa la chat sul sito web.",
  "pt": "Gratuito e anónimo. A partir do estrangeiro, usa o chat do site.",
  "ja": "無料・匿名で相談できます。海外からは、ウェブサイトのチャットをご利用ください。",
  "zh": "免费、匿名。如果你在国外，请使用网站上的在线聊天。",
  "ko": "무료로 익명 상담을 받을 수 있어요. 해외에서는 웹사이트의 채팅을 이용하세요.",
  "hi": "मुफ़्त और गुमनाम। विदेश से संपर्क करने के लिए वेबसाइट पर चैट का इस्तेमाल करें।",
  "id": "Gratis dan anonim. Dari luar negeri, gunakan chat di situs webnya.",
  "tr": "Ücretsiz ve anonim. Hollanda dışındaysan web sitesindeki canlı sohbeti kullan.",
  "ru": "Бесплатно и анонимно. Если вы за пределами Нидерландов, воспользуйтесь чатом на сайте.",
  "vi": "Miễn phí và ẩn danh. Nếu bạn ở nước ngoài, hãy dùng khung chat trên trang web.",
  "ar": "مجاني ودون الكشف عن هويتك. من الخارج، استخدم الدردشة على الموقع الإلكتروني."
 },
 "Free and confidential, in Arabic and English.": {
  "es": "Gratuito y confidencial, en árabe e inglés.",
  "ca": "Gratuït i confidencial, en àrab i en anglès.",
  "fr": "Gratuit et confidentiel, en arabe et en anglais.",
  "de": "Kostenlos und vertraulich, auf Arabisch und Englisch.",
  "it": "Gratuito e riservato, in arabo e inglese.",
  "pt": "Gratuito e confidencial, em árabe e inglês.",
  "ja": "無料で、秘密は守られます。アラビア語と英語で対応しています。",
  "zh": "免费、保密，提供阿拉伯语和英语服务。",
  "ko": "무료이고 비밀이 보장돼요. 아랍어와 영어로 상담할 수 있어요.",
  "hi": "मुफ़्त और गोपनीय, अरबी और अंग्रेज़ी में।",
  "id": "Gratis dan rahasia, dalam bahasa Arab dan Inggris.",
  "tr": "Ücretsiz ve gizli. Arapça ve İngilizce hizmet verir.",
  "ru": "Бесплатно и конфиденциально, на арабском и английском языках.",
  "vi": "Miễn phí và bảo mật, bằng tiếng Ả Rập và tiếng Anh.",
  "ar": "مجاني وسرّي، بالعربية والإنجليزية."
 },
 "Free and confidential.": {
  "es": "Gratuito y confidencial.",
  "ca": "Gratuït i confidencial.",
  "fr": "Gratuit et confidentiel.",
  "de": "Kostenlos und vertraulich.",
  "it": "Gratuito e riservato.",
  "pt": "Gratuito e confidencial.",
  "ja": "無料で、秘密は守られます。",
  "zh": "免费、保密。",
  "ko": "무료이고 비밀이 보장돼요.",
  "hi": "मुफ़्त और गोपनीय।",
  "id": "Gratis dan rahasia.",
  "tr": "Ücretsiz ve gizli.",
  "ru": "Бесплатно и конфиденциально.",
  "vi": "Miễn phí và bảo mật.",
  "ar": "مجاني وسرّي."
 },
 "Free and confidential. You can also text 1737.": {
  "es": "Gratuito y confidencial. También puedes enviar un SMS al 1737.",
  "ca": "Gratuït i confidencial. També pots enviar un SMS al 1737.",
  "fr": "Gratuit et confidentiel. Vous pouvez aussi envoyer un SMS au 1737.",
  "de": "Kostenlos und vertraulich. Du kannst auch eine SMS an 1737 schreiben.",
  "it": "Gratuito e riservato. Puoi anche inviare un SMS al 1737.",
  "pt": "Gratuito e confidencial. Também podes enviar SMS para o 1737.",
  "ja": "無料で、秘密は守られます。1737 に SMS を送ることもできます。",
  "zh": "免费、保密。也可发送短信至 1737。",
  "ko": "무료이고 비밀이 보장돼요. 1737로 문자를 보낼 수도 있어요.",
  "hi": "मुफ़्त और गोपनीय। आप 1737 पर SMS भी भेज सकते हैं।",
  "id": "Gratis dan rahasia. Kamu juga bisa mengirim SMS ke 1737.",
  "tr": "Ücretsiz ve gizli. 1737'ye SMS de gönderebilirsin.",
  "ru": "Бесплатно и конфиденциально. Можно также отправить SMS на номер 1737.",
  "vi": "Miễn phí và bảo mật. Bạn cũng có thể nhắn tin đến số 1737.",
  "ar": "مجاني وسرّي. يمكنك أيضًا إرسال رسالة نصية إلى 1737."
 },
 "Free and confidential. You can also text 988. Spanish: press 2. Veterans: press 1.": {
  "es": "Gratuito y confidencial. También puedes enviar un SMS al 988. En español: marca el 2. Veteranos militares: marca el 1.",
  "ca": "Gratuït i confidencial. També pots enviar un SMS al 988. En espanyol: prem el 2. Veterans de l'exèrcit: prem l'1.",
  "fr": "Gratuit et confidentiel. Vous pouvez aussi envoyer un SMS au 988. Pour l'espagnol, tapez 2. Pour les anciens combattants, tapez 1.",
  "de": "Kostenlos und vertraulich. Du kannst auch eine SMS an 988 schreiben. Auf Spanisch: Taste 2. Für Veteraninnen und Veteranen: Taste 1.",
  "it": "Gratuito e riservato. Puoi anche inviare un SMS al 988. Per lo spagnolo, premi 2. Per i veterani delle forze armate, premi 1.",
  "pt": "Gratuito e confidencial. Também podes enviar SMS para o 988. Em espanhol: marca a opção 2. Veteranos das Forças Armadas: marca a opção 1.",
  "ja": "無料で、秘密は守られます。988 に SMS を送ることもできます。スペイン語は 2、退役軍人の方は 1 を押してください。",
  "zh": "免费、保密。也可发送短信至 988。西班牙语服务请按 2。退伍军人请按 1。",
  "ko": "무료이고 비밀이 보장돼요. 988로 문자를 보낼 수도 있어요. 스페인어는 2번, 퇴역 군인은 1번을 누르세요.",
  "hi": "मुफ़्त और गोपनीय। आप 988 पर SMS भी भेज सकते हैं। स्पेनिश के लिए 2 दबाएँ। पूर्व सैनिकों के लिए 1 दबाएँ।",
  "id": "Gratis dan rahasia. Kamu juga bisa mengirim SMS ke 988. Bahasa Spanyol: tekan 2. Veteran: tekan 1.",
  "tr": "Ücretsiz ve gizli. 988'e SMS de gönderebilirsin. İspanyolca için 2'yi, gaziler için 1'i tuşla.",
  "ru": "Бесплатно и конфиденциально. Можно также отправить SMS на номер 988. На испанском: нажмите 2. Для ветеранов: нажмите 1.",
  "vi": "Miễn phí và bảo mật. Bạn cũng có thể nhắn tin đến số 988. Tiếng Tây Ban Nha: nhấn phím 2. Cựu chiến binh: nhấn phím 1.",
  "ar": "مجاني وسرّي. يمكنك أيضًا إرسال رسالة نصية إلى 988. للإسبانية: اضغط 2. للمحاربين القدامى: اضغط 1."
 },
 "Free from any phone.": {
  "es": "Llamada gratuita desde cualquier teléfono.",
  "ca": "Trucada gratuïta des de qualsevol telèfon.",
  "fr": "Appel gratuit depuis n'importe quel téléphone.",
  "de": "Kostenlos von jedem Telefon aus.",
  "it": "Chiamata gratuita da qualsiasi telefono.",
  "pt": "Gratuito a partir de qualquer telefone.",
  "ja": "どの電話からでも通話無料です。",
  "zh": "任何电话均可免费拨打。",
  "ko": "어느 전화로 걸어도 무료예요.",
  "hi": "किसी भी फ़ोन से कॉल मुफ़्त है।",
  "id": "Gratis dari telepon mana pun.",
  "tr": "Her telefondan ücretsiz arayabilirsin.",
  "ru": "Бесплатно с любого телефона.",
  "vi": "Gọi miễn phí từ mọi điện thoại.",
  "ar": "الاتصال مجاني من أي هاتف."
 },
 "Free from mobiles. You can also text 0477 13 11 14.": {
  "es": "Llamada gratuita desde el móvil. También puedes enviar un SMS al 0477 13 11 14.",
  "ca": "Trucada gratuïta des de mòbils. També pots enviar un SMS al 0477 13 11 14.",
  "fr": "Appel gratuit depuis un mobile. Vous pouvez aussi envoyer un SMS au 0477 13 11 14.",
  "de": "Kostenlos vom Handy aus. Du kannst auch eine SMS an 0477 13 11 14 schreiben.",
  "it": "Chiamata gratuita da cellulare. Puoi anche inviare un SMS al numero 0477 13 11 14.",
  "pt": "Gratuito a partir de telemóveis. Também podes enviar SMS para o 0477 13 11 14.",
  "ja": "携帯電話からは通話無料です。0477 13 11 14 に SMS を送ることもできます。",
  "zh": "用手机拨打免费。也可发送短信至 0477 13 11 14。",
  "ko": "휴대전화로 걸면 무료예요. 0477 13 11 14로 문자를 보낼 수도 있어요.",
  "hi": "मोबाइल से कॉल मुफ़्त है। आप 0477 13 11 14 पर SMS भी भेज सकते हैं।",
  "id": "Gratis dari ponsel. Kamu juga bisa mengirim SMS ke 0477 13 11 14.",
  "tr": "Cep telefonlarından ücretsiz. 0477 13 11 14 numarasına SMS de gönderebilirsin.",
  "ru": "Бесплатно с мобильных телефонов. Можно также отправить SMS на номер 0477 13 11 14.",
  "vi": "Gọi miễn phí từ điện thoại di động. Bạn cũng có thể nhắn tin đến số 0477 13 11 14.",
  "ar": "الاتصال مجاني من الهواتف المحمولة. يمكنك أيضًا إرسال رسالة نصية إلى ‎0477 13 11 14."
 },
 "Free public mental health line. If no one answers, call 123.": {
  "es": "Línea pública y gratuita de salud mental. Si nadie contesta, llama al 123.",
  "ca": "Línia pública i gratuïta de salut mental. Si no et responen, truca al 123.",
  "fr": "Ligne publique et gratuite de santé mentale. Si personne ne répond, appelez le 123.",
  "de": "Kostenloses öffentliches Hilfetelefon für psychische Gesundheit. Wenn niemand abnimmt, ruf 123 an.",
  "it": "Linea pubblica e gratuita per la salute mentale. Se nessuno risponde, chiama il 123.",
  "pt": "Linha pública e gratuita de saúde mental. Se ninguém atender, liga para o 123.",
  "ja": "公的機関による、無料のこころの健康相談電話です。つながらないときは 123 に電話してください。",
  "zh": "免费的公共心理健康热线。如果无人接听，请拨打 123。",
  "ko": "무료 공공 정신건강 상담전화예요. 아무도 받지 않으면 123에 전화하세요.",
  "hi": "मुफ़्त सरकारी मानसिक स्वास्थ्य हेल्पलाइन। अगर कोई फ़ोन न उठाए, तो 123 पर कॉल करें।",
  "id": "Layanan telepon kesehatan jiwa publik yang gratis. Jika tidak ada yang mengangkat, hubungi 123.",
  "tr": "Ücretsiz, kamuya ait ruh sağlığı hattı. Yanıt veren olmazsa 123'ü ara.",
  "ru": "Бесплатная государственная горячая линия по вопросам психического здоровья. Если никто не ответит, звоните по номеру 123.",
  "vi": "Đường dây nóng sức khỏe tâm thần miễn phí của nhà nước. Nếu không ai nghe máy, hãy gọi 123.",
  "ar": "خط عام ومجاني للصحة النفسية. إذا لم يردّ أحد، اتصل بالرقم 123."
 },
 "Free to call, in English and French. You can also text 988.": {
  "es": "Llamada gratuita, en inglés y francés. También puedes enviar un SMS al 988.",
  "ca": "Trucada gratuïta, en anglès i en francès. També pots enviar un SMS al 988.",
  "fr": "Appel gratuit, en anglais et en français. Vous pouvez aussi envoyer un SMS au 988.",
  "de": "Kostenlos erreichbar, auf Englisch und Französisch. Du kannst auch eine SMS an 988 schreiben.",
  "it": "Chiamata gratuita, in inglese e francese. Puoi anche inviare un SMS al 988.",
  "pt": "Chamada gratuita, em inglês e francês. Também podes enviar SMS para o 988.",
  "ja": "通話無料です。英語とフランス語で対応しています。988 に SMS を送ることもできます。",
  "zh": "免费拨打，提供英语和法语服务。也可发送短信至 988。",
  "ko": "영어와 프랑스어로 무료 전화 상담을 받을 수 있어요. 988로 문자를 보낼 수도 있어요.",
  "hi": "मुफ़्त कॉल, अंग्रेज़ी और फ़्रेंच में। आप 988 पर SMS भी भेज सकते हैं।",
  "id": "Panggilan gratis, dalam bahasa Inggris dan Prancis. Kamu juga bisa mengirim SMS ke 988.",
  "tr": "Arama ücretsiz; İngilizce ve Fransızca hizmet verir. 988'e SMS de gönderebilirsin.",
  "ru": "Звонок бесплатный, помощь на английском и французском языках. Можно также отправить SMS на номер 988.",
  "vi": "Gọi miễn phí, bằng tiếng Anh và tiếng Pháp. Bạn cũng có thể nhắn tin đến số 988.",
  "ar": "الاتصال مجاني، بالإنجليزية والفرنسية. يمكنك أيضًا إرسال رسالة نصية إلى 988."
 },
 "Free, anonymous chat on the website. WhatsApp: 055-957-1399.": {
  "es": "Chat gratuito y anónimo en su web. WhatsApp: 055-957-1399.",
  "ca": "Xat gratuït i anònim al lloc web. WhatsApp: 055-957-1399.",
  "fr": "Chat gratuit et anonyme sur le site web. WhatsApp : 055-957-1399.",
  "de": "Kostenloser, anonymer Chat auf der Website. WhatsApp: 055-957-1399.",
  "it": "Chat gratuita e anonima sul sito web. WhatsApp: 055-957-1399.",
  "pt": "Chat gratuito e anónimo no site. WhatsApp: 055-957-1399.",
  "ja": "ウェブサイトで、無料・匿名のチャット相談ができます。WhatsApp：055-957-1399。",
  "zh": "网站上提供免费、匿名的在线聊天。WhatsApp：055-957-1399。",
  "ko": "웹사이트에서 무료 익명 채팅 상담을 받을 수 있어요. WhatsApp: 055-957-1399.",
  "hi": "वेबसाइट पर मुफ़्त, गुमनाम चैट। WhatsApp: 055-957-1399।",
  "id": "Chat gratis dan anonim di situs webnya. WhatsApp: 055-957-1399.",
  "tr": "Web sitesinde ücretsiz ve anonim canlı sohbet. WhatsApp: 055-957-1399.",
  "ru": "Бесплатный анонимный чат на сайте. WhatsApp: 055-957-1399.",
  "vi": "Chat miễn phí và ẩn danh trên trang web. WhatsApp: 055-957-1399.",
  "ar": "دردشة مجانية على الموقع الإلكتروني دون الكشف عن هويتك. WhatsApp: ‎055-957-1399."
 },
 "Free, by call or WhatsApp.": {
  "es": "Gratuito, por llamada o WhatsApp.",
  "ca": "Gratuït, per telèfon o per WhatsApp.",
  "fr": "Gratuit, par téléphone ou WhatsApp.",
  "de": "Kostenlos, per Anruf oder WhatsApp.",
  "it": "Gratuito, per telefono o WhatsApp.",
  "pt": "Gratuito, por telefone ou WhatsApp.",
  "ja": "電話でも WhatsApp でも、無料で相談できます。",
  "zh": "免费，可通过电话或 WhatsApp 联系。",
  "ko": "전화나 WhatsApp으로 무료 상담을 받을 수 있어요.",
  "hi": "मुफ़्त, कॉल या WhatsApp के ज़रिए।",
  "id": "Gratis, lewat telepon atau WhatsApp.",
  "tr": "Ücretsiz; arayarak ya da WhatsApp üzerinden ulaşabilirsin.",
  "ru": "Бесплатно, по телефону или в WhatsApp.",
  "vi": "Miễn phí, qua cuộc gọi hoặc WhatsApp.",
  "ar": "مجاني، عبر الاتصال أو WhatsApp."
 },
 "Free, confidential helplines in your country and language.": {
  "es": "Líneas de ayuda gratuitas y confidenciales en tu país y en tu idioma.",
  "ca": "Línies d'ajuda gratuïtes i confidencials al teu país i en el teu idioma.",
  "fr": "Lignes d'écoute gratuites et confidentielles dans votre pays et dans votre langue.",
  "de": "Kostenlose, vertrauliche Hilfetelefone in deinem Land und in deiner Sprache.",
  "it": "Linee di ascolto gratuite e riservate nel tuo paese e nella tua lingua.",
  "pt": "Linhas de apoio gratuitas e confidenciais no teu país e na tua língua.",
  "ja": "お住まいの国で、あなたの言語で利用できる、無料で秘密厳守の相談窓口。",
  "zh": "你所在国家的免费、保密求助热线，可用你的语言沟通。",
  "ko": "계신 나라에서, 사용하시는 언어로 이용할 수 있는 무료·비밀 보장 상담전화.",
  "hi": "आपके देश में, आपकी भाषा में निःशुल्क और गोपनीय हेल्पलाइन।",
  "id": "Saluran bantuan gratis dan terjamin kerahasiaannya, di negaramu dan dalam bahasamu.",
  "tr": "Ülkende ve kendi dilinde ücretsiz ve gizli destek hatları.",
  "ru": "Бесплатные и конфиденциальные телефоны доверия в вашей стране и на вашем языке.",
  "vi": "Các đường dây hỗ trợ miễn phí và bảo mật tại quốc gia của bạn, bằng ngôn ngữ của bạn.",
  "ar": "خطوط مساعدة مجانية وسرية في بلدك وبلغتك."
 },
 "Free, confidential, run by the Ministry of Health.": {
  "es": "Servicio público, gratuito y confidencial.",
  "ca": "Gratuït, confidencial i a càrrec del Ministeri de Sanitat.",
  "fr": "Ligne gratuite et confidentielle du ministère de la Santé.",
  "de": "Kostenloses, vertrauliches Angebot des Gesundheitsministeriums.",
  "it": "Servizio gratuito e riservato del Ministero della Salute.",
  "pt": "Linha gratuita e confidencial do Ministério da Saúde.",
  "ja": "無料で、秘密は守られます。保健省が運営しています。",
  "zh": "免费、保密，由卫生部运营。",
  "ko": "무료이고 비밀이 보장돼요. 보건부에서 운영해요.",
  "hi": "मुफ़्त, गोपनीय, स्वास्थ्य मंत्रालय द्वारा संचालित।",
  "id": "Gratis dan rahasia, dikelola oleh Kementerian Kesehatan.",
  "tr": "Sağlık Bakanlığının ücretsiz ve gizli hattı.",
  "ru": "Бесплатная и конфиденциальная горячая линия Министерства здравоохранения.",
  "vi": "Miễn phí, bảo mật, do Bộ Y tế vận hành.",
  "ar": "مجاني وسرّي، وتديره وزارة الصحة."
 },
 "Free, for adults in crisis.": {
  "es": "Gratuito, para personas adultas en crisis.",
  "ca": "Gratuït, per a persones adultes en crisi.",
  "fr": "Gratuit, pour les adultes en situation de crise.",
  "de": "Kostenlos, für Erwachsene in Krisensituationen.",
  "it": "Gratuito, per adulti in situazioni di crisi.",
  "pt": "Gratuito, para adultos em crise.",
  "ja": "こころの危機にある大人のための、無料の相談窓口です。",
  "zh": "免费，面向正处于心理危机中的成年人。",
  "ko": "위기를 겪고 있는 성인을 위한 무료 상담전화예요.",
  "hi": "मुफ़्त, संकट से गुज़र रहे वयस्कों के लिए।",
  "id": "Gratis, untuk orang dewasa yang sedang mengalami krisis.",
  "tr": "Kriz yaşayan yetişkinler için ücretsiz destek.",
  "ru": "Бесплатно, для взрослых в кризисной ситуации.",
  "vi": "Miễn phí, dành cho người trưởng thành đang gặp khủng hoảng.",
  "ar": "مجاني، للبالغين الذين يمرّون بأزمة."
 },
 "Free, for young people aged 5 to 29. Text CONNECT to 686868.": {
  "es": "Gratuito, para niños y jóvenes de 5 a 29 años. Envía CONNECT por SMS al 686868.",
  "ca": "Gratuït, per a infants i joves de 5 a 29 anys. Envia un SMS amb la paraula CONNECT al 686868.",
  "fr": "Gratuit, pour les jeunes de 5 à 29 ans. Envoyez PARLER (ou CONNECT) par SMS au 686868.",
  "de": "Kostenlos, für Kinder und junge Menschen von 5 bis 29 Jahren. Schreib CONNECT per SMS an 686868.",
  "it": "Gratuito, per bambini e giovani dai 5 ai 29 anni. Invia un SMS con la parola CONNECT al numero 686868.",
  "pt": "Gratuito, para crianças e jovens dos 5 aos 29 anos. Envia a palavra CONNECT por SMS para o 686868.",
  "ja": "5〜29歳の子ども・若者のための、無料の相談窓口です。SMS なら 686868 に「CONNECT」と送ってください。",
  "zh": "免费，面向 5 至 29 岁的儿童和年轻人。编辑短信 CONNECT 发送至 686868。",
  "ko": "5세부터 29세까지 아동, 청소년, 청년을 위한 무료 상담전화예요. 686868로 CONNECT라고 문자를 보내세요.",
  "hi": "मुफ़्त, 5 से 29 साल के बच्चों और युवाओं के लिए। 686868 पर CONNECT लिखकर SMS भेजें।",
  "id": "Gratis, untuk anak dan anak muda berusia 5 hingga 29 tahun. Kirim SMS berisi CONNECT ke 686868.",
  "tr": "5 ile 29 yaş arası çocuk ve gençler için ücretsiz. CONNECT yazıp 686868'e SMS gönder.",
  "ru": "Бесплатно, для детей и молодёжи от 5 до 29 лет. Отправьте SMS со словом CONNECT на номер 686868.",
  "vi": "Miễn phí, dành cho trẻ em và người trẻ từ 5 đến 29 tuổi. Nhắn tin CONNECT đến số 686868.",
  "ar": "مجاني، للأطفال والشباب من 5 إلى 29 عامًا. أرسل كلمة CONNECT في رسالة نصية إلى 686868."
 },
 "Free, in English.": {
  "es": "Gratuito, en inglés.",
  "ca": "Gratuït, en anglès.",
  "fr": "Gratuit, en anglais.",
  "de": "Kostenlos, auf Englisch.",
  "it": "Gratuito, in inglese.",
  "pt": "Gratuito, em inglês.",
  "ja": "無料です。英語で対応しています。",
  "zh": "免费，提供英语服务。",
  "ko": "영어로 무료 상담을 받을 수 있어요.",
  "hi": "मुफ़्त, अंग्रेज़ी में।",
  "id": "Gratis, dalam bahasa Inggris.",
  "tr": "Ücretsiz. İngilizce hizmet verir.",
  "ru": "Бесплатно, на английском языке.",
  "vi": "Miễn phí, bằng tiếng Anh.",
  "ar": "مجاني، بالإنجليزية."
 },
 "Free, run by the Ministry of Health.": {
  "es": "Servicio público y gratuito.",
  "ca": "Gratuït, a càrrec del Ministeri de Salut.",
  "fr": "Ligne gratuite du ministère de la Santé.",
  "de": "Kostenloses Angebot des Gesundheitsministeriums.",
  "it": "Servizio gratuito del Ministero della Salute.",
  "pt": "Linha gratuita do Ministério da Saúde.",
  "ja": "無料です。保健省が運営しています。",
  "zh": "免费，由卫生部运营。",
  "ko": "무료예요. 보건 당국에서 운영해요.",
  "hi": "मुफ़्त, स्वास्थ्य मंत्रालय द्वारा संचालित।",
  "id": "Gratis, dikelola oleh Kementerian Kesehatan.",
  "tr": "Sağlık Bakanlığının ücretsiz hattı.",
  "ru": "Бесплатная горячая линия Министерства здравоохранения.",
  "vi": "Miễn phí, do Bộ Y tế vận hành.",
  "ar": "مجاني، وتديره وزارة الصحة."
 },
 "Free, run by the Ministry of Health. 20 Indian languages. They may call you back.": {
  "es": "Servicio gratuito del Ministerio de Sanidad. En 20 idiomas de la India. Puede que te devuelvan la llamada.",
  "ca": "Gratuït, a càrrec del Ministeri de Salut. En 20 llengües de l'Índia. És possible que et tornin la trucada.",
  "fr": "Ligne gratuite du ministère de la Santé. En 20 langues indiennes. Il se peut qu'on vous rappelle.",
  "de": "Kostenloses Angebot des Gesundheitsministeriums. In 20 indischen Sprachen. Möglicherweise wirst du zurückgerufen.",
  "it": "Servizio gratuito del Ministero della Salute. In 20 lingue indiane. Potrebbero richiamarti.",
  "pt": "Linha gratuita do Ministério da Saúde. Em 20 línguas indianas. Podem ligar-te de volta.",
  "ja": "無料です。保健省が運営しています。インドの20言語で対応しています。折り返し電話がかかってくることがあります。",
  "zh": "免费，由卫生部运营。提供 20 种印度语言服务。工作人员可能会给你回电。",
  "ko": "무료예요. 보건부에서 운영해요. 인도의 20개 언어로 상담할 수 있어요. 상담원이 다시 전화해 줄 수도 있어요.",
  "hi": "मुफ़्त, स्वास्थ्य मंत्रालय द्वारा संचालित। 20 भारतीय भाषाओं में। हो सकता है वे आपको वापस कॉल करें।",
  "id": "Gratis, dikelola oleh Kementerian Kesehatan. Tersedia dalam 20 bahasa India. Mereka mungkin akan meneleponmu kembali.",
  "tr": "Sağlık Bakanlığının ücretsiz hattı. Hindistan'da konuşulan 20 dilde hizmet verir. Seni geri arayabilirler.",
  "ru": "Бесплатная горячая линия Министерства здравоохранения. Помощь на 20 языках Индии. Вам могут перезвонить.",
  "vi": "Miễn phí, do Bộ Y tế vận hành. Hỗ trợ 20 ngôn ngữ của Ấn Độ. Họ có thể gọi lại cho bạn.",
  "ar": "مجاني، وتديره وزارة الصحة. متاح بـ20 لغة من لغات الهند. وقد يعاودون الاتصال بك."
 },
 "Free, run by the Ministry of Health. Call 119 and press 8.": {
  "es": "Servicio gratuito del Ministerio de Sanidad. Llama al 119 y marca el 8.",
  "ca": "Gratuït, a càrrec del Ministeri de Salut. Truca al 119 i prem el 8.",
  "fr": "Ligne gratuite du ministère de la Santé. Appelez le 119 et tapez 8.",
  "de": "Kostenloses Angebot des Gesundheitsministeriums. Ruf 119 an und drück die Taste 8.",
  "it": "Servizio gratuito del Ministero della Salute. Chiama il 119 e premi 8.",
  "pt": "Linha gratuita do Ministério da Saúde. Liga para o 119 e marca a opção 8.",
  "ja": "無料です。保健省が運営しています。119 に電話して 8 を押してください。",
  "zh": "免费，由卫生部运营。拨打 119 后按 8。",
  "ko": "무료예요. 보건부에서 운영해요. 119에 전화한 뒤 8번을 누르세요.",
  "hi": "मुफ़्त, स्वास्थ्य मंत्रालय द्वारा संचालित। 119 पर कॉल करें और 8 दबाएँ।",
  "id": "Gratis, dikelola oleh Kementerian Kesehatan. Hubungi 119, lalu tekan 8.",
  "tr": "Sağlık Bakanlığının ücretsiz hattı. 119'u ara ve 8'i tuşla.",
  "ru": "Бесплатная горячая линия Министерства здравоохранения. Позвоните по номеру 119 и нажмите 8.",
  "vi": "Miễn phí, do Bộ Y tế vận hành. Gọi 119 rồi nhấn phím 8.",
  "ar": "مجاني، وتديره وزارة الصحة. اتصل بالرقم 119 واضغط 8."
 },
 "Free, run by the Ministry of Health. Dial *4141 from a mobile phone.": {
  "es": "Servicio gratuito del Ministerio de Salud. Marca el *4141 desde un teléfono móvil.",
  "ca": "Gratuït, a càrrec del Ministeri de Salut. Marca el *4141 des d'un mòbil.",
  "fr": "Ligne gratuite du ministère de la Santé. Composez le *4141 depuis un téléphone mobile.",
  "de": "Kostenloses Angebot des Gesundheitsministeriums. Wähl vom Handy aus *4141.",
  "it": "Servizio gratuito del Ministero della Salute. Dal cellulare, componi il numero *4141.",
  "pt": "Linha gratuita do Ministério da Saúde. A partir de um telemóvel, liga para o *4141.",
  "ja": "無料です。保健省が運営しています。携帯電話から *4141 にかけてください。",
  "zh": "免费，由卫生部运营。请用手机拨打 *4141。",
  "ko": "무료예요. 보건부에서 운영해요. 휴대전화로 *4141에 전화하세요.",
  "hi": "मुफ़्त, स्वास्थ्य मंत्रालय द्वारा संचालित। मोबाइल फ़ोन से *4141 डायल करें।",
  "id": "Gratis, dikelola oleh Kementerian Kesehatan. Hubungi *4141 dari ponsel.",
  "tr": "Sağlık Bakanlığının ücretsiz hattı. Cep telefonundan *4141'i tuşla.",
  "ru": "Бесплатная горячая линия Министерства здравоохранения. Наберите *4141 с мобильного телефона.",
  "vi": "Miễn phí, do Bộ Y tế vận hành. Gọi *4141 từ điện thoại di động.",
  "ar": "مجاني، وتديره وزارة الصحة. اطلب ‎*4141 من هاتف محمول."
 },
 "Free, run by the Ministry of Health. Mental health: press 5 (or 3, then 5).": {
  "es": "Servicio gratuito del Ministerio de Salud. Para salud mental, marca el 5 (o el 3 y después el 5).",
  "ca": "Gratuït, a càrrec del Ministeri de Salut. Salut mental: prem el 5 (o el 3 i després el 5).",
  "fr": "Ligne gratuite du ministère de la Santé. Pour la santé mentale, tapez 5 (ou 3, puis 5).",
  "de": "Kostenloses Angebot des Gesundheitsministeriums. Psychische Gesundheit: Taste 5 (oder 3, dann 5).",
  "it": "Servizio gratuito del Ministero della Salute. Per la salute mentale, premi 5 (oppure 3 e poi 5).",
  "pt": "Linha gratuita do Ministério da Saúde. Saúde mental: marca a opção 5 (ou a 3 e depois a 5).",
  "ja": "無料です。保健省が運営しています。こころの相談は 5（または 3 のあと 5）を押してください。",
  "zh": "免费，由卫生部运营。心理健康服务请按 5（或先按 3 再按 5）。",
  "ko": "무료예요. 보건부에서 운영해요. 정신건강 상담은 5번(또는 3번 다음 5번)을 누르세요.",
  "hi": "मुफ़्त, स्वास्थ्य मंत्रालय द्वारा संचालित। मानसिक स्वास्थ्य के लिए 5 दबाएँ (या 3, फिर 5)।",
  "id": "Gratis, dikelola oleh Kementerian Kesehatan. Kesehatan jiwa: tekan 5 (atau 3, lalu 5).",
  "tr": "Sağlık Bakanlığının ücretsiz hattı. Ruh sağlığı için 5'i tuşla (ya da önce 3'ü, sonra 5'i).",
  "ru": "Бесплатная горячая линия Министерства здравоохранения. По вопросам психического здоровья нажмите 5 (или 3, затем 5).",
  "vi": "Miễn phí, do Bộ Y tế vận hành. Sức khỏe tâm thần: nhấn phím 5 (hoặc phím 3, rồi phím 5).",
  "ar": "مجاني، وتديره وزارة الصحة. للصحة النفسية: اضغط 5 (أو 3 ثم 5)."
 },
 "Free.": {
  "es": "Gratuito.",
  "ca": "Gratuït.",
  "fr": "Gratuit.",
  "de": "Kostenlos.",
  "it": "Gratuito.",
  "pt": "Gratuito.",
  "ja": "無料です。",
  "zh": "免费。",
  "ko": "무료예요.",
  "hi": "मुफ़्त।",
  "id": "Gratis.",
  "tr": "Ücretsiz.",
  "ru": "Бесплатно.",
  "vi": "Miễn phí.",
  "ar": "مجاني."
 },
 "Free. English and other languages: press 2 (10:00–22:00). If you feel suicidal: press 5.": {
  "es": "Gratuito. En inglés y otros idiomas: marca el 2 (de 10:00 a 22:00). Si tienes pensamientos de suicidio: marca el 5.",
  "ca": "Gratuït. En anglès i altres idiomes: prem el 2 (de 10:00 a 22:00). Si tens pensaments de suïcidi, prem el 5.",
  "fr": "Gratuit. Pour l'anglais et d'autres langues, tapez 2 (de 10 h à 22 h). Si vous avez des idées suicidaires, tapez 5.",
  "de": "Kostenlos. Auf Englisch und in anderen Sprachen: Taste 2 (10:00–22:00 Uhr). Wenn du Suizidgedanken hast: Taste 5.",
  "it": "Gratuito. Per l'inglese e altre lingue, premi 2 (dalle 10:00 alle 22:00). Se hai pensieri suicidi, premi 5.",
  "pt": "Gratuito. Em inglês e noutras línguas: marca a opção 2 (das 10h às 22h). Se tens pensamentos suicidas, marca a opção 5.",
  "ja": "無料です。英語などの外国語は 2 を押してください（10:00〜22:00）。死にたいほどつらいときは 5 を押してください。",
  "zh": "免费。英语及其他语言服务请按 2（10:00–22:00）。如果你有自杀的念头，请按 5。",
  "ko": "무료예요. 영어 등 다른 언어는 2번을 누르세요(10:00~22:00). 죽고 싶을 만큼 힘들다면 5번을 누르세요.",
  "hi": "मुफ़्त। अंग्रेज़ी और अन्य भाषाओं के लिए 2 दबाएँ (10:00–22:00)। अगर आपके मन में आत्महत्या के विचार आ रहे हैं, तो 5 दबाएँ।",
  "id": "Gratis. Bahasa Inggris dan bahasa lain: tekan 2 (10.00–22.00). Jika kamu punya pikiran untuk mengakhiri hidup: tekan 5.",
  "tr": "Ücretsiz. İngilizce ve diğer diller için 2'yi tuşla (10:00–22:00). İntihar düşüncelerin varsa 5'i tuşla.",
  "ru": "Бесплатно. На английском и других языках: нажмите 2 (10:00–22:00). Если вы думаете о самоубийстве, нажмите 5.",
  "vi": "Miễn phí. Tiếng Anh và các ngôn ngữ khác: nhấn phím 2 (10:00–22:00). Nếu bạn có ý nghĩ tự tử: nhấn phím 5.",
  "ar": "مجاني. للإنجليزية ولغات أخرى: اضغط 2 (من 10:00 إلى 22:00). إذا راودتك أفكار انتحارية: اضغط 5."
 },
 "Free. Suicide and self-harm support. Text HELP to 51444 (standard SMS rates).": {
  "es": "Gratuito. Apoyo si tienes pensamientos de suicidio o te autolesionas. Envía HELP por SMS al 51444 (coste de un SMS normal).",
  "ca": "Gratuït. Suport davant el risc de suïcidi i les autolesions. Envia un SMS amb la paraula HELP al 51444 (al preu habitual d'un SMS).",
  "fr": "Gratuit. Soutien en cas d'idées suicidaires ou d'automutilation. Envoyez HELP par SMS au 51444 (prix d'un SMS standard).",
  "de": "Kostenlos. Hilfe bei Suizidgedanken und Selbstverletzung. Schreib HELP per SMS an 51444 (zum normalen SMS-Tarif).",
  "it": "Gratuito. Sostegno in caso di pensieri suicidi e autolesionismo. Invia un SMS con la parola HELP al numero 51444 (al costo di un normale SMS).",
  "pt": "Gratuito. Apoio em caso de risco de suicídio ou autolesão. Envia a palavra HELP por SMS para o 51444 (ao preço normal de SMS).",
  "ja": "無料です。自殺や自傷行為に悩む人を支えます。SMS なら 51444 に「HELP」と送ってください（通常の SMS 料金がかかります）。",
  "zh": "免费。为有自杀念头或自伤行为的人提供支持。编辑短信 HELP 发送至 51444（收取标准短信费用）。",
  "ko": "무료예요. 자살 생각이나 자해로 힘든 분을 지원해요. 51444로 HELP라고 문자를 보내세요(일반 문자 요금이 부과돼요).",
  "hi": "मुफ़्त। आत्महत्या और ख़ुद को नुक़सान पहुँचाने से जुड़ी सहायता। 51444 पर HELP लिखकर SMS भेजें (सामान्य SMS शुल्क लागू)।",
  "id": "Gratis. Dukungan terkait bunuh diri dan menyakiti diri sendiri. Kirim SMS berisi HELP ke 51444 (dikenakan tarif SMS biasa).",
  "tr": "Ücretsiz. İntihar ve kendine zarar verme konusunda destek. HELP yazıp 51444'e SMS gönder (standart SMS ücreti uygulanır).",
  "ru": "Бесплатно. Поддержка при мыслях о самоубийстве и самоповреждениях. Отправьте SMS со словом HELP на номер 51444 (по стандартному тарифу за SMS).",
  "vi": "Miễn phí. Hỗ trợ khi có ý nghĩ tự tử hoặc tự làm hại bản thân. Nhắn tin HELP đến số 51444 (tính cước SMS thông thường).",
  "ar": "مجاني. دعم لمن تراودهم أفكار انتحارية أو يؤذون أنفسهم. أرسل كلمة HELP في رسالة نصية إلى 51444 (بالسعر العادي للرسائل النصية)."
 },
 "Free. You can also text 31393.": {
  "es": "Gratuito. También puedes enviar un SMS al 31393.",
  "ca": "Gratuït. També pots enviar un SMS al 31393.",
  "fr": "Gratuit. Vous pouvez aussi envoyer un SMS au 31393.",
  "de": "Kostenlos. Du kannst auch eine SMS an 31393 schreiben.",
  "it": "Gratuito. Puoi anche inviare un SMS al 31393.",
  "pt": "Gratuito. Também podes enviar SMS para o 31393.",
  "ja": "無料です。31393 に SMS を送ることもできます。",
  "zh": "免费。也可发送短信至 31393。",
  "ko": "무료예요. 31393으로 문자를 보낼 수도 있어요.",
  "hi": "मुफ़्त। आप 31393 पर SMS भी भेज सकते हैं।",
  "id": "Gratis. Kamu juga bisa mengirim SMS ke 31393.",
  "tr": "Ücretsiz. 31393'e SMS de gönderebilirsin.",
  "ru": "Бесплатно. Можно также отправить SMS на номер 31393.",
  "vi": "Miễn phí. Bạn cũng có thể nhắn tin đến số 31393.",
  "ar": "مجاني. يمكنك أيضًا إرسال رسالة نصية إلى 31393."
 },
 "Fri–Sun, 19:00–07:00": {
  "es": "De viernes a domingo, de 19:00 a 07:00",
  "ca": "De divendres a diumenge, de 19:00 a 7:00",
  "fr": "Du vendredi au dimanche, de 19 h à 7 h du matin",
  "de": "Fr.–So., 19:00–07:00 Uhr",
  "it": "Dal venerdì alla domenica, dalle 19:00 alle 07:00 del mattino",
  "pt": "De sexta a domingo, das 19h às 7h da manhã",
  "ja": "金〜日曜 19:00〜翌7:00",
  "zh": "周五至周日 19:00–次日 07:00",
  "ko": "금~일요일 19:00~다음 날 07:00",
  "hi": "शुक्र–रवि, 19:00–07:00",
  "id": "Jumat–Minggu, 19.00–07.00",
  "tr": "Cuma–Pazar, 19:00–07:00",
  "ru": "Пт–Вс, 19:00–07:00",
  "vi": "Thứ Sáu đến Chủ Nhật, 19:00–07:00 sáng hôm sau",
  "ar": "من الجمعة إلى الأحد، من 19:00 إلى 07:00"
 },
 "General emergency 191": {
  "es": "Emergencias generales 191",
  "ca": "Emergències generals 191",
  "fr": "Urgences générales 191",
  "de": "Allgemeiner Notruf 191",
  "it": "Numero di emergenza generale 191",
  "pt": "Emergência geral 191",
  "ja": "緊急通報 191",
  "zh": "紧急求助 191",
  "ko": "일반 긴급전화 191",
  "hi": "सामान्य आपातकालीन नंबर 191",
  "id": "Darurat umum 191",
  "tr": "Genel acil çağrı 191",
  "ru": "Общий экстренный номер 191",
  "vi": "Khẩn cấp chung 191",
  "ar": "الطوارئ العامة 191"
 },
 "General health line, not a crisis line.": {
  "es": "Línea de salud general; no es una línea de atención en crisis.",
  "ca": "Línia de salut general, no especialitzada en crisis.",
  "fr": "Ligne de santé générale, et non une ligne d'aide en cas de crise.",
  "de": "Allgemeines Gesundheitstelefon, kein Krisentelefon.",
  "it": "Linea di assistenza sanitaria generale, non dedicata alle situazioni di crisi.",
  "pt": "Linha geral de saúde, não é uma linha de apoio em crise.",
  "ja": "一般的な健康相談の電話で、危機対応の窓口ではありません。",
  "zh": "综合健康热线，并非危机干预热线。",
  "ko": "일반 건강 상담전화로, 위기 상담전화는 아니에요.",
  "hi": "यह सामान्य स्वास्थ्य हेल्पलाइन है, संकट हेल्पलाइन नहीं।",
  "id": "Layanan telepon kesehatan umum, bukan layanan krisis.",
  "tr": "Genel sağlık hattıdır, kriz hattı değildir.",
  "ru": "Общая горячая линия по вопросам здоровья, а не линия кризисной помощи.",
  "vi": "Tổng đài y tế chung, không phải đường dây nóng hỗ trợ khủng hoảng.",
  "ar": "خط صحي عام، وليس خطًا للأزمات."
 },
 "Government line in 12 languages, including English. Also on WhatsApp.": {
  "es": "Línea del Gobierno en 12 idiomas, incluido el inglés. También por WhatsApp.",
  "ca": "Línia governamental en 12 idiomes, inclòs l'anglès. També per WhatsApp.",
  "fr": "Ligne gouvernementale en 12 langues, dont l'anglais. Également sur WhatsApp.",
  "de": "Staatliches Hilfetelefon in 12 Sprachen, darunter Englisch. Auch per WhatsApp.",
  "it": "Linea governativa in 12 lingue, tra cui l'inglese. Anche su WhatsApp.",
  "pt": "Linha do Governo em 12 línguas, incluindo o inglês. Também por WhatsApp.",
  "ja": "政府の相談窓口で、英語を含む12言語で対応しています。WhatsApp でも相談できます。",
  "zh": "政府热线，提供包括英语在内的 12 种语言服务。也可通过 WhatsApp 联系。",
  "ko": "정부가 운영하는 상담전화로, 영어를 포함한 12개 언어로 상담해요. WhatsApp으로도 이용할 수 있어요.",
  "hi": "सरकारी हेल्पलाइन, अंग्रेज़ी सहित 12 भाषाओं में। WhatsApp पर भी उपलब्ध।",
  "id": "Layanan pemerintah dalam 12 bahasa, termasuk bahasa Inggris. Juga tersedia lewat WhatsApp.",
  "tr": "İngilizce dâhil 12 dilde hizmet veren devlet hattı. WhatsApp üzerinden de ulaşabilirsin.",
  "ru": "Государственная горячая линия на 12 языках, включая английский. Также доступна в WhatsApp.",
  "vi": "Đường dây nóng của chính phủ, hỗ trợ 12 ngôn ngữ, trong đó có tiếng Anh. Cũng có trên WhatsApp.",
  "ar": "خط حكومي بـ12 لغة، منها الإنجليزية. ويمكن التواصل معه أيضًا عبر WhatsApp."
 },
 "Government line. From landlines, 1553 is toll-free. Smart/TNT: 0919 057 1553.": {
  "es": "Línea del Gobierno. Desde un teléfono fijo, la llamada al 1553 es gratuita. Smart/TNT: 0919 057 1553.",
  "ca": "Línia governamental. Des de telèfons fixos, el 1553 és gratuït. Smart/TNT: 0919 057 1553.",
  "fr": "Ligne gouvernementale. Depuis un fixe, le 1553 est gratuit. Abonnés Smart/TNT : 0919 057 1553.",
  "de": "Staatliches Hilfetelefon. Aus dem Festnetz ist 1553 gebührenfrei. Smart/TNT: 0919 057 1553.",
  "it": "Linea governativa. Da rete fissa, il 1553 è gratuito. Clienti Smart/TNT: 0919 057 1553.",
  "pt": "Linha do Governo. A partir da rede fixa, o 1553 é gratuito. Smart/TNT: 0919 057 1553.",
  "ja": "政府の相談窓口です。固定電話からは 1553 が通話無料です。Smart/TNT の携帯電話からは 0919 057 1553 にかけてください。",
  "zh": "政府热线。用座机拨打 1553 免费。Smart/TNT 用户：0919 057 1553。",
  "ko": "정부가 운영하는 상담전화예요. 유선전화에서는 1553번이 무료예요. Smart/TNT 휴대전화: 0919 057 1553.",
  "hi": "सरकारी हेल्पलाइन। लैंडलाइन से 1553 टोल-फ़्री है। Smart/TNT: 0919 057 1553।",
  "id": "Layanan pemerintah. Dari telepon rumah, 1553 bebas pulsa. Smart/TNT: 0919 057 1553.",
  "tr": "Devlet hattı. Sabit hatlardan 1553 ücretsizdir. Smart/TNT: 0919 057 1553.",
  "ru": "Государственная горячая линия. Со стационарных телефонов звонок на номер 1553 бесплатный. Абонентам Smart/TNT: 0919 057 1553.",
  "vi": "Đường dây nóng của chính phủ. Từ điện thoại cố định, gọi 1553 được miễn cước. Thuê bao Smart/TNT: 0919 057 1553.",
  "ar": "خط حكومي. من الهاتف الأرضي، الاتصال بالرقم 1553 مجاني. لمشتركي Smart/TNT: ‎0919 057 1553."
 },
 "In Arabic and English.": {
  "es": "En árabe e inglés.",
  "ca": "En àrab i en anglès.",
  "fr": "En arabe et en anglais.",
  "de": "Auf Arabisch und Englisch.",
  "it": "In arabo e inglese.",
  "pt": "Em árabe e inglês.",
  "ja": "アラビア語と英語で対応しています。",
  "zh": "提供阿拉伯语和英语服务。",
  "ko": "아랍어와 영어로 상담할 수 있어요.",
  "hi": "अरबी और अंग्रेज़ी में।",
  "id": "Dalam bahasa Arab dan Inggris.",
  "tr": "Arapça ve İngilizce hizmet verir.",
  "ru": "На арабском и английском языках.",
  "vi": "Hỗ trợ bằng tiếng Ả Rập và tiếng Anh.",
  "ar": "بالعربية والإنجليزية."
 },
 "In Finnish.": {
  "es": "En finlandés.",
  "ca": "En finès.",
  "fr": "En finnois.",
  "de": "Auf Finnisch.",
  "it": "In finlandese.",
  "pt": "Em finlandês.",
  "ja": "フィンランド語で対応しています。",
  "zh": "提供芬兰语服务。",
  "ko": "핀란드어로 상담할 수 있어요.",
  "hi": "फ़िनिश में।",
  "id": "Dalam bahasa Finlandia.",
  "tr": "Fince hizmet verir.",
  "ru": "На финском языке.",
  "vi": "Hỗ trợ bằng tiếng Phần Lan.",
  "ar": "بالفنلندية."
 },
 "In the US & Canada call 911 · in Australia 000 · or your local emergency number.": {
  "es": "En EE. UU. y Canadá, llama al 911 · en Australia, al 000 · o al número de emergencias local.",
  "ca": "Als EUA i al Canadà, truca al 911 · a Austràlia, al 000 · o al número d'emergències local.",
  "fr": "Aux États-Unis et au Canada, appelez le 911 · en Australie, le 000 · ou le numéro d'urgence local.",
  "de": "In den USA und in Kanada wähle die 911 · in Australien die 000 · oder deine örtliche Notrufnummer.",
  "it": "Negli Stati Uniti e in Canada chiama il 911 · in Australia lo 000 · oppure il numero di emergenza locale.",
  "pt": "Nos EUA e no Canadá, liga para o 911 · na Austrália, para o 000 · ou para o número de emergência local.",
  "ja": "アメリカとカナダでは911 · オーストラリアでは000 · または現地の緊急通報番号に電話してください。",
  "zh": "在美国和加拿大请拨打911 · 在澳大利亚请拨打000 · 或拨打当地的紧急电话。",
  "ko": "미국과 캐나다에서는 911 · 호주에서는 000 · 또는 현지 긴급전화번호로 전화하세요.",
  "hi": "अमेरिका और कनाडा में 911 पर कॉल करें · ऑस्ट्रेलिया में 000 पर · या अपने स्थानीय आपातकालीन नंबर पर।",
  "id": "Di Amerika Serikat dan Kanada, hubungi 911 · di Australia, 000 · atau nomor darurat setempat.",
  "tr": "ABD ve Kanada'da 911'i ara · Avustralya'da 000'ı · ya da bulunduğun yerdeki acil durum numarasını.",
  "ru": "В США и Канаде звоните по номеру 911 · в Австралии — 000 · или по местному номеру экстренных служб.",
  "vi": "Tại Hoa Kỳ và Canada, hãy gọi 911 · tại Úc, gọi 000 · hoặc gọi số khẩn cấp tại địa phương của bạn.",
  "ar": "في الولايات المتحدة وكندا، اتصل بالرقم 911 · وفي أستراليا بالرقم 000 · أو برقم الطوارئ في منطقتك."
 },
 "International directory of crisis centres by country.": {
  "es": "Directorio internacional de centros de atención en crisis, por país.",
  "ca": "Directori internacional de centres d'atenció en crisi, per països.",
  "fr": "Annuaire international des centres de crise, par pays.",
  "de": "Internationales Verzeichnis von Krisenzentren, nach Ländern geordnet.",
  "it": "Elenco internazionale dei centri di crisi, per paese.",
  "pt": "Diretório internacional de centros de intervenção em crise, por país.",
  "ja": "世界各国の危機介入センターを国別にまとめた一覧。",
  "zh": "按国家分类的国际危机干预中心名录。",
  "ko": "국가별로 정리한 국제 위기상담센터 목록.",
  "hi": "संकट सहायता केंद्रों की देशवार अंतरराष्ट्रीय सूची।",
  "id": "Direktori internasional pusat krisis, berdasarkan negara.",
  "tr": "Ülkelere göre uluslararası kriz merkezleri rehberi.",
  "ru": "Международный справочник кризисных центров по странам.",
  "vi": "Danh bạ quốc tế các trung tâm hỗ trợ khủng hoảng theo quốc gia.",
  "ar": "دليل دولي لمراكز التدخل في الأزمات، حسب البلد."
 },
 "Mon–Fri, 09:00–17:00": {
  "es": "De lunes a viernes, de 09:00 a 17:00",
  "ca": "De dilluns a divendres, de 9:00 a 17:00",
  "fr": "Du lundi au vendredi, de 9 h à 17 h",
  "de": "Mo.–Fr., 09:00–17:00 Uhr",
  "it": "Dal lunedì al venerdì, dalle 09:00 alle 17:00",
  "pt": "De segunda a sexta, das 9h às 17h",
  "ja": "月〜金曜 9:00〜17:00",
  "zh": "周一至周五 09:00–17:00",
  "ko": "월~금요일 09:00~17:00",
  "hi": "सोम–शुक्र, 09:00–17:00",
  "id": "Senin–Jumat, 09.00–17.00",
  "tr": "Pazartesi–Cuma, 09:00–17:00",
  "ru": "Пн–Пт, 09:00–17:00",
  "vi": "Thứ Hai đến Thứ Sáu, 09:00–17:00",
  "ar": "من الاثنين إلى الجمعة، من 09:00 إلى 17:00"
 },
 "Mon–Fri, 09:00–20:00": {
  "es": "De lunes a viernes, de 09:00 a 20:00",
  "ca": "De dilluns a divendres, de 9:00 a 20:00",
  "fr": "Du lundi au vendredi, de 9 h à 20 h",
  "de": "Mo.–Fr., 09:00–20:00 Uhr",
  "it": "Dal lunedì al venerdì, dalle 09:00 alle 20:00",
  "pt": "De segunda a sexta, das 9h às 20h",
  "ja": "月〜金曜 9:00〜20:00",
  "zh": "周一至周五 09:00–20:00",
  "ko": "월~금요일 09:00~20:00",
  "hi": "सोम–शुक्र, 09:00–20:00",
  "id": "Senin–Jumat, 09.00–20.00",
  "tr": "Pazartesi–Cuma, 09:00–20:00",
  "ru": "Пн–Пт, 09:00–20:00",
  "vi": "Thứ Hai đến Thứ Sáu, 09:00–20:00",
  "ar": "من الاثنين إلى الجمعة، من 09:00 إلى 20:00"
 },
 "Mon–Fri, 09:30–17:00": {
  "es": "De lunes a viernes, de 09:30 a 17:00",
  "ca": "De dilluns a divendres, de 9:30 a 17:00",
  "fr": "Du lundi au vendredi, de 9 h 30 à 17 h",
  "de": "Mo.–Fr., 09:30–17:00 Uhr",
  "it": "Dal lunedì al venerdì, dalle 09:30 alle 17:00",
  "pt": "De segunda a sexta, das 9h30 às 17h",
  "ja": "月〜金曜 9:30〜17:00",
  "zh": "周一至周五 09:30–17:00",
  "ko": "월~금요일 09:30~17:00",
  "hi": "सोम–शुक्र, 09:30–17:00",
  "id": "Senin–Jumat, 09.30–17.00",
  "tr": "Pazartesi–Cuma, 09:30–17:00",
  "ru": "Пн–Пт, 09:30–17:00",
  "vi": "Thứ Hai đến Thứ Sáu, 09:30–17:00",
  "ar": "من الاثنين إلى الجمعة، من 09:30 إلى 17:00"
 },
 "Mon–Sat, 11:00–23:00": {
  "es": "De lunes a sábado, de 11:00 a 23:00",
  "ca": "De dilluns a dissabte, d'11:00 a 23:00",
  "fr": "Du lundi au samedi, de 11 h à 23 h",
  "de": "Mo.–Sa., 11:00–23:00 Uhr",
  "it": "Dal lunedì al sabato, dalle 11:00 alle 23:00",
  "pt": "De segunda a sábado, das 11h às 23h",
  "ja": "月〜土曜 11:00〜23:00",
  "zh": "周一至周六 11:00–23:00",
  "ko": "월~토요일 11:00~23:00",
  "hi": "सोम–शनि, 11:00–23:00",
  "id": "Senin–Sabtu, 11.00–23.00",
  "tr": "Pazartesi–Cumartesi, 11:00–23:00",
  "ru": "Пн–Сб, 11:00–23:00",
  "vi": "Thứ Hai đến Thứ Bảy, 11:00–23:00",
  "ar": "من الاثنين إلى السبت، من 11:00 إلى 23:00"
 },
 "Multilingual suicide prevention line.": {
  "es": "Línea de prevención del suicidio en varios idiomas.",
  "ca": "Línia multilingüe de prevenció del suïcidi.",
  "fr": "Ligne multilingue de prévention du suicide.",
  "de": "Mehrsprachiges Krisentelefon zur Suizidprävention.",
  "it": "Linea multilingue per la prevenzione del suicidio.",
  "pt": "Linha de prevenção do suicídio em várias línguas.",
  "ja": "多言語で対応する自殺予防の相談電話です。",
  "zh": "多语种自杀预防热线。",
  "ko": "여러 언어로 상담하는 자살 예방 상담전화예요.",
  "hi": "बहुभाषी आत्महत्या रोकथाम हेल्पलाइन।",
  "id": "Layanan pencegahan bunuh diri multibahasa.",
  "tr": "Birçok dilde hizmet veren intihar önleme hattı.",
  "ru": "Многоязычная горячая линия по предотвращению самоубийств.",
  "vi": "Đường dây nóng phòng chống tự tử đa ngôn ngữ.",
  "ar": "خط للوقاية من الانتحار بلغات متعددة."
 },
 "National health line: ask for psychological counselling.": {
  "es": "Línea nacional de salud: pide asesoramiento psicológico.",
  "ca": "Línia nacional de salut: demana assessorament psicològic.",
  "fr": "Ligne nationale de santé : demandez le service de soutien psychologique.",
  "de": "Nationales Gesundheitstelefon: Frag nach psychologischer Beratung.",
  "it": "Linea nazionale di assistenza sanitaria: chiedi una consulenza psicologica.",
  "pt": "Linha nacional de saúde: pede aconselhamento psicológico.",
  "ja": "国の健康相談ダイヤルです。「心理カウンセリング」を希望すると伝えてください。",
  "zh": "全国健康热线：来电时请说明你需要心理咨询。",
  "ko": "국가 건강 상담전화예요. 전화해서 심리 상담을 요청하세요.",
  "hi": "राष्ट्रीय स्वास्थ्य हेल्पलाइन: मनोवैज्ञानिक परामर्श के लिए कहें।",
  "id": "Layanan telepon kesehatan nasional: mintalah konseling psikologis.",
  "tr": "Ulusal sağlık hattı: psikolojik danışmanlık istediğini söyle.",
  "ru": "Национальная горячая линия по вопросам здоровья: попросите консультацию психолога.",
  "vi": "Tổng đài y tế quốc gia: hãy nói rằng bạn cần tư vấn tâm lý.",
  "ar": "الخط الوطني للصحة: اطلب خدمة الاستشارة النفسية."
 },
 "National line, open at least 18 hours a day; 24 hours in some cities.": {
  "es": "Línea nacional, abierta al menos 18 horas al día; 24 horas en algunas ciudades.",
  "ca": "Línia nacional, oberta com a mínim 18 hores al dia; 24 hores en algunes ciutats.",
  "fr": "Ligne nationale, ouverte au moins 18 heures par jour, et 24 h/24 dans certaines villes.",
  "de": "Landesweites Hilfetelefon, mindestens 18 Stunden am Tag erreichbar; in einigen Städten 24 Stunden.",
  "it": "Linea nazionale, attiva almeno 18 ore al giorno; 24 ore su 24 in alcune città.",
  "pt": "Linha nacional, disponível pelo menos 18 horas por dia; 24 horas em algumas cidades.",
  "ja": "全国共通の相談電話です。毎日18時間以上つながり、一部の都市では24時間対応です。",
  "zh": "全国统一热线，每天服务不少于 18 小时；部分城市提供 24 小时服务。",
  "ko": "전국 상담전화로, 하루 18시간 이상 운영해요. 일부 도시에서는 24시간 운영해요.",
  "hi": "राष्ट्रीय हेल्पलाइन, रोज़ कम से कम 18 घंटे उपलब्ध; कुछ शहरों में 24 घंटे।",
  "id": "Layanan nasional, buka minimal 18 jam sehari; 24 jam di beberapa kota.",
  "tr": "Ulusal hat; günde en az 18 saat açık, bazı şehirlerde 24 saat.",
  "ru": "Национальная горячая линия: работает не менее 18 часов в сутки, а в некоторых городах — круглосуточно.",
  "vi": "Đường dây nóng quốc gia, hoạt động ít nhất 18 giờ mỗi ngày; ở một số thành phố là 24 giờ.",
  "ar": "خط وطني يعمل 18 ساعة يوميًا على الأقل، وعلى مدار 24 ساعة في بعض المدن."
 },
 "Open to everyone. Toll-free landline: 0800 22 444.": {
  "es": "Abierto a todo el mundo. Llamada gratuita desde un teléfono fijo: 0800 22 444.",
  "ca": "Obert a tothom. Des de telèfons fixos, el 0800 22 444 és gratuït.",
  "fr": "Ouvert à tous. Numéro gratuit depuis un fixe : 0800 22 444.",
  "de": "Offen für alle. Gebührenfrei aus dem Festnetz: 0800 22 444.",
  "it": "Aperto a tutti. Numero verde da rete fissa: 0800 22 444.",
  "pt": "Aberto a todas as pessoas. Linha fixa gratuita: 0800 22 444.",
  "ja": "どなたでも相談できます。固定電話からは、通話無料の 0800 22 444 にかけられます。",
  "zh": "面向所有人开放。座机免费号码：0800 22 444。",
  "ko": "누구나 이용할 수 있어요. 유선전화 무료 번호: 0800 22 444.",
  "hi": "सभी के लिए उपलब्ध। टोल-फ़्री लैंडलाइन नंबर: 0800 22 444।",
  "id": "Terbuka untuk siapa saja. Bebas pulsa dari telepon rumah: 0800 22 444.",
  "tr": "Herkese açık. Ücretsiz sabit hat: 0800 22 444.",
  "ru": "Обратиться может каждый. Бесплатный номер для стационарных телефонов: 0800 22 444.",
  "vi": "Dành cho tất cả mọi người. Số miễn cước cho điện thoại cố định: 0800 22 444.",
  "ar": "متاح للجميع. رقم أرضي مجاني: ‎0800 22 444."
 },
 "Police 100": {
  "es": "Policía 100",
  "ca": "Policia 100",
  "fr": "Police 100",
  "de": "Polizei 100",
  "it": "Polizia 100",
  "pt": "Polícia 100",
  "ja": "警察 100",
  "zh": "报警 100",
  "ko": "경찰 100",
  "hi": "पुलिस 100",
  "id": "Polisi 100",
  "tr": "Polis 100",
  "ru": "Полиция 100",
  "vi": "Cảnh sát 100",
  "ar": "الشرطة 100"
 },
 "Police 101": {
  "es": "Policía 101",
  "ca": "Policia 101",
  "fr": "Police 101",
  "de": "Polizei 101",
  "it": "Polizia 101",
  "pt": "Polícia 101",
  "ja": "警察 101",
  "zh": "报警 101",
  "ko": "경찰 101",
  "hi": "पुलिस 101",
  "id": "Polisi 101",
  "tr": "Polis 101",
  "ru": "Полиция 101",
  "vi": "Cảnh sát 101",
  "ar": "الشرطة 101"
 },
 "Police 110": {
  "es": "Policía 110",
  "ca": "Policia 110",
  "fr": "Police 110",
  "de": "Polizei 110",
  "it": "Polizia 110",
  "pt": "Polícia 110",
  "ja": "警察 110",
  "zh": "报警 110",
  "ko": "경찰 110",
  "hi": "पुलिस 110",
  "id": "Polisi 110",
  "tr": "Polis 110",
  "ru": "Полиция 110",
  "vi": "Cảnh sát 110",
  "ar": "الشرطة 110"
 },
 "Police 110 · 112 in some cities": {
  "es": "Policía 110 · 112 en algunas ciudades",
  "ca": "Policia 110 · 112 en algunes ciutats",
  "fr": "Police 110 · 112 dans certaines villes",
  "de": "Polizei 110 · 112 in einigen Städten",
  "it": "Polizia 110 · 112 in alcune città",
  "pt": "Polícia 110 · 112 em algumas cidades",
  "ja": "警察 110 · 一部の都市では 112",
  "zh": "报警 110 · 部分城市可拨打 112",
  "ko": "경찰 110 · 일부 도시에서는 112",
  "hi": "पुलिस 110 · कुछ शहरों में 112",
  "id": "Polisi 110 · 112 di beberapa kota",
  "tr": "Polis 110 · bazı şehirlerde 112",
  "ru": "Полиция 110 · 112 в некоторых городах",
  "vi": "Cảnh sát 110 · 112 ở một số thành phố",
  "ar": "الشرطة 110 · الرقم 112 في بعض المدن"
 },
 "Police 112": {
  "es": "Policía 112",
  "ca": "Policia 112",
  "fr": "Police 112",
  "de": "Polizei 112",
  "it": "Polizia 112",
  "pt": "Polícia 112",
  "ja": "警察 112",
  "zh": "报警 112",
  "ko": "경찰 112",
  "hi": "पुलिस 112",
  "id": "Polisi 112",
  "tr": "Polis 112",
  "ru": "Полиция 112",
  "vi": "Cảnh sát 112",
  "ar": "الشرطة 112"
 },
 "Police 112 · Fire 110": {
  "es": "Policía 112 · Bomberos 110",
  "ca": "Policia 112 · Bombers 110",
  "fr": "Police 112 · Pompiers 110",
  "de": "Polizei 112 · Feuerwehr 110",
  "it": "Polizia 112 · Vigili del fuoco 110",
  "pt": "Polícia 112 · Bombeiros 110",
  "ja": "警察 112 · 消防 110",
  "zh": "报警 112 · 火警 110",
  "ko": "경찰 112 · 소방 110",
  "hi": "पुलिस 112 · अग्निशमन 110",
  "id": "Polisi 112 · Pemadam kebakaran 110",
  "tr": "Polis 112 · İtfaiye 110",
  "ru": "Полиция 112 · Пожарная служба 110",
  "vi": "Cảnh sát 112 · Cứu hỏa 110",
  "ar": "الشرطة 112 · الإطفاء 110"
 },
 "Police 113 · Fire 114": {
  "es": "Policía 113 · Bomberos 114",
  "ca": "Policia 113 · Bombers 114",
  "fr": "Police 113 · Pompiers 114",
  "de": "Polizei 113 · Feuerwehr 114",
  "it": "Polizia 113 · Vigili del fuoco 114",
  "pt": "Polícia 113 · Bombeiros 114",
  "ja": "警察 113 · 消防 114",
  "zh": "报警 113 · 火警 114",
  "ko": "경찰 113 · 소방 114",
  "hi": "पुलिस 113 · अग्निशमन 114",
  "id": "Polisi 113 · Pemadam kebakaran 114",
  "tr": "Polis 113 · İtfaiye 114",
  "ru": "Полиция 113 · Пожарная служба 114",
  "vi": "Cảnh sát 113 · Cứu hỏa 114",
  "ar": "الشرطة 113 · الإطفاء 114"
 },
 "Police 117 · 112 also works": {
  "es": "Policía 117 · También puedes llamar al 112",
  "ca": "Policia 117 · També pots trucar al 112",
  "fr": "Police 117 · Vous pouvez aussi appeler le 112",
  "de": "Polizei 117 · Du kannst auch 112 wählen",
  "it": "Polizia 117 · Puoi chiamare anche il 112",
  "pt": "Polícia 117 · Também podes ligar para o 112",
  "ja": "警察 117 · 112 でもつながります",
  "zh": "报警 117 · 也可拨打 112",
  "ko": "경찰 117 · 112로도 연결돼요",
  "hi": "पुलिस 117 · 112 पर भी कॉल कर सकते हैं",
  "id": "Polisi 117 · 112 juga bisa dihubungi",
  "tr": "Polis 117 · 112'yi de arayabilirsin",
  "ru": "Полиция 117 · также работает номер 112",
  "vi": "Cảnh sát 117 · Cũng có thể gọi 112",
  "ar": "الشرطة 117 · يعمل الرقم 112 أيضًا"
 },
 "Police 122": {
  "es": "Policía 122",
  "ca": "Policia 122",
  "fr": "Police 122",
  "de": "Polizei 122",
  "it": "Polizia 122",
  "pt": "Polícia 122",
  "ja": "警察 122",
  "zh": "报警 122",
  "ko": "경찰 122",
  "hi": "पुलिस 122",
  "id": "Polisi 122",
  "tr": "Polis 122",
  "ru": "Полиция 122",
  "vi": "Cảnh sát 122",
  "ar": "الشرطة 122"
 },
 "Police 133 · 112 also works": {
  "es": "Policía 133 · También puedes llamar al 112",
  "ca": "Policia 133 · També pots trucar al 112",
  "fr": "Police 133 · Vous pouvez aussi appeler le 112",
  "de": "Polizei 133 · Du kannst auch 112 wählen",
  "it": "Polizia 133 · Puoi chiamare anche il 112",
  "pt": "Polícia 133 · Também podes ligar para o 112",
  "ja": "警察 133 · 112 でもつながります",
  "zh": "报警 133 · 也可拨打 112",
  "ko": "경찰 133 · 112로도 연결돼요",
  "hi": "पुलिस 133 · 112 पर भी कॉल कर सकते हैं",
  "id": "Polisi 133 · 112 juga bisa dihubungi",
  "tr": "Polis 133 · 112'yi de arayabilirsin",
  "ru": "Полиция 133 · также работает номер 112",
  "vi": "Cảnh sát 133 · Cũng có thể gọi 112",
  "ar": "الشرطة 133 · يعمل الرقم 112 أيضًا"
 },
 "Police 133 · Fire 132": {
  "es": "Policía 133 · Bomberos 132",
  "ca": "Policia 133 · Bombers 132",
  "fr": "Police 133 · Pompiers 132",
  "de": "Polizei 133 · Feuerwehr 132",
  "it": "Polizia 133 · Vigili del fuoco 132",
  "pt": "Polícia 133 · Bombeiros 132",
  "ja": "警察 133 · 消防 132",
  "zh": "报警 133 · 火警 132",
  "ko": "경찰 133 · 소방 132",
  "hi": "पुलिस 133 · अग्निशमन 132",
  "id": "Polisi 133 · Pemadam kebakaran 132",
  "tr": "Polis 133 · İtfaiye 132",
  "ru": "Полиция 133 · Пожарная служба 132",
  "vi": "Cảnh sát 133 · Cứu hỏa 132",
  "ar": "الشرطة 133 · الإطفاء 132"
 },
 "Police 15 · Edhi ambulance 115": {
  "es": "Policía 15 · Ambulancia Edhi 115",
  "ca": "Policia 15 · Ambulància Edhi 115",
  "fr": "Police 15 · Ambulance Edhi 115",
  "de": "Polizei 15 · Edhi-Rettungsdienst 115",
  "it": "Polizia 15 · Ambulanza Edhi 115",
  "pt": "Polícia 15 · Ambulância Edhi 115",
  "ja": "警察 15 · Edhi の救急車 115",
  "zh": "报警 15 · Edhi 救护车 115",
  "ko": "경찰 15 · Edhi 구급차 115",
  "hi": "पुलिस 15 · Edhi एंबुलेंस 115",
  "id": "Polisi 15 · Ambulans Edhi 115",
  "tr": "Polis 15 · Edhi ambulansı 115",
  "ru": "Полиция 15 · Скорая помощь Edhi 115",
  "vi": "Cảnh sát 15 · Cấp cứu Edhi 115",
  "ar": "الشرطة 15 · إسعاف Edhi 115"
 },
 "Police 190 · Fire 193": {
  "es": "Policía 190 · Bomberos 193",
  "ca": "Policia 190 · Bombers 193",
  "fr": "Police 190 · Pompiers 193",
  "de": "Polizei 190 · Feuerwehr 193",
  "it": "Polizia 190 · Vigili del fuoco 193",
  "pt": "Polícia 190 · Bombeiros 193",
  "ja": "警察 190 · 消防 193",
  "zh": "报警 190 · 火警 193",
  "ko": "경찰 190 · 소방 193",
  "hi": "पुलिस 190 · अग्निशमन 193",
  "id": "Polisi 190 · Pemadam kebakaran 193",
  "tr": "Polis 190 · İtfaiye 193",
  "ru": "Полиция 190 · Пожарная служба 193",
  "vi": "Cảnh sát 190 · Cứu hỏa 193",
  "ar": "الشرطة 190 · الإطفاء 193"
 },
 "Police 190 · Gendarmerie 177": {
  "es": "Policía 190 · Gendarmería 177",
  "ca": "Policia 190 · Gendarmeria 177",
  "fr": "Police 190 · Gendarmerie 177",
  "de": "Polizei 190 · Gendarmerie 177",
  "it": "Polizia 190 · Gendarmeria 177",
  "pt": "Polícia 190 · Gendarmaria 177",
  "ja": "警察 190 · 憲兵隊 177",
  "zh": "报警 190 · 宪兵 177",
  "ko": "경찰 190 · 헌병대 177",
  "hi": "पुलिस 190 · जेंडरमेरी 177",
  "id": "Polisi 190 · Gendarmeri 177",
  "tr": "Polis 190 · Jandarma 177",
  "ru": "Полиция 190 · Жандармерия 177",
  "vi": "Cảnh sát 190 · Hiến binh 177",
  "ar": "الشرطة 190 · الدرك الملكي 177"
 },
 "Police 999": {
  "es": "Policía 999",
  "ca": "Policia 999",
  "fr": "Police 999",
  "de": "Polizei 999",
  "it": "Polizia 999",
  "pt": "Polícia 999",
  "ja": "警察 999",
  "zh": "报警 999",
  "ko": "경찰 999",
  "hi": "पुलिस 999",
  "id": "Polisi 999",
  "tr": "Polis 999",
  "ru": "Полиция 999",
  "vi": "Cảnh sát 999",
  "ar": "الشرطة 999"
 },
 "Police 999 · 911 in Riyadh, Makkah, Madinah and the Eastern Province": {
  "es": "Policía 999 · 911 en Riad, La Meca, Medina y la Provincia Oriental",
  "ca": "Policia 999 · 911 a Riad, la Meca, Medina i la Província Oriental",
  "fr": "Police 999 · 911 à Riyad, à La Mecque, à Médine et dans la province orientale",
  "de": "Polizei 999 · 911 in Riad, Mekka, Medina und der Ostprovinz",
  "it": "Polizia 999 · 911 a Riad, alla Mecca, a Medina e nella Provincia Orientale",
  "pt": "Polícia 999 · 911 em Riade, Meca, Medina e na Província Oriental",
  "ja": "警察 999 · リヤド、メッカ、メディナ、東部州では 911",
  "zh": "报警 999 · 利雅得、麦加、麦地那和东部省可拨打 911",
  "ko": "경찰 999 · 리야드, 메카, 메디나, 동부주에서는 911",
  "hi": "पुलिस 999 · रियाद, मक्का, मदीना और पूर्वी प्रांत में 911",
  "id": "Polisi 999 · 911 di Riyadh, Makkah, Madinah, dan Provinsi Timur",
  "tr": "Polis 999 · Riyad, Mekke, Medine ve Doğu Bölgesi'nde 911",
  "ru": "Полиция 999 · 911 в Эр-Рияде, Мекке, Медине и Восточной провинции",
  "vi": "Cảnh sát 999 · 911 ở Riyadh, Makkah, Madinah và Tỉnh Đông",
  "ar": "الشرطة 999 · الرقم 911 في الرياض ومكة المكرمة والمدينة المنورة والمنطقة الشرقية"
 },
 "Psychological first aid by volunteers.": {
  "es": "Primeros auxilios psicológicos a cargo de voluntarios.",
  "ca": "Primers auxilis psicològics a càrrec de voluntaris.",
  "fr": "Premiers secours psychologiques, assurés par des bénévoles.",
  "de": "Psychologische Erste Hilfe durch Ehrenamtliche.",
  "it": "Primo soccorso psicologico offerto da volontari.",
  "pt": "Primeiros socorros psicológicos, prestados por voluntários.",
  "ja": "ボランティアによる心理的応急処置です。",
  "zh": "由志愿者提供心理急救。",
  "ko": "자원봉사자가 심리적 응급처치를 해 드려요.",
  "hi": "स्वयंसेवकों द्वारा मनोवैज्ञानिक प्राथमिक सहायता।",
  "id": "Pertolongan pertama psikologis oleh relawan.",
  "tr": "Gönüllüler psikolojik ilk yardım sunar.",
  "ru": "Первую психологическую помощь оказывают волонтёры.",
  "vi": "Sơ cứu tâm lý do tình nguyện viên thực hiện.",
  "ar": "إسعافات أولية نفسية يقدّمها متطوعون."
 },
 "Run by Zagreb University Hospital. Also 01 2376 470.": {
  "es": "Servicio del Hospital Universitario de Zagreb. También en el 01 2376 470.",
  "ca": "A càrrec de l'Hospital Universitari de Zagreb. També al 01 2376 470.",
  "fr": "Ligne du CHU de Zagreb. Également au 01 2376 470.",
  "de": "Ein Angebot des Universitätsklinikums Zagreb. Auch unter 01 2376 470.",
  "it": "Servizio dell'Ospedale universitario di Zagabria. Anche al numero 01 2376 470.",
  "pt": "Linha do Hospital Universitário de Zagreb. Também podes ligar para o 01 2376 470.",
  "ja": "ザグレブ大学病院が運営しています。01 2376 470 でもつながります。",
  "zh": "由萨格勒布大学医院运营。也可拨打 01 2376 470。",
  "ko": "자그레브 대학병원에서 운영해요. 01 2376 470으로도 전화할 수 있어요.",
  "hi": "ज़ाग्रेब विश्वविद्यालय अस्पताल द्वारा संचालित। आप 01 2376 470 पर भी कॉल कर सकते हैं।",
  "id": "Dikelola oleh Rumah Sakit Universitas Zagreb. Juga bisa dihubungi di 01 2376 470.",
  "tr": "Zagreb Üniversite Hastanesi tarafından yürütülür. 01 2376 470 numarasından da ulaşabilirsin.",
  "ru": "Работает при Университетской больнице Загреба. Также можно звонить по номеру 01 2376 470.",
  "vi": "Do Bệnh viện Đại học Zagreb vận hành. Bạn cũng có thể gọi 01 2376 470.",
  "ar": "يديره مستشفى زغرب الجامعي. ويمكنك أيضًا الاتصال بالرقم ‎01 2376 470."
 },
 "Run by the Ministry of Emergency Situations.": {
  "es": "Servicio del Ministerio de Situaciones de Emergencia.",
  "ca": "A càrrec del Ministeri de Situacions d'Emergència.",
  "fr": "Ligne du ministère des Situations d'urgence.",
  "de": "Ein Angebot des Katastrophenschutzministeriums.",
  "it": "Servizio del Ministero per le Situazioni di Emergenza.",
  "pt": "Linha do Ministério de Situações de Emergência.",
  "ja": "非常事態省が運営しています。",
  "zh": "由紧急情况部运营。",
  "ko": "비상사태부에서 운영해요.",
  "hi": "आपातकालीन स्थिति मंत्रालय द्वारा संचालित।",
  "id": "Dikelola oleh Kementerian Situasi Darurat.",
  "tr": "Acil Durumlar Bakanlığı tarafından yürütülür.",
  "ru": "Служба МЧС России.",
  "vi": "Do Bộ Tình trạng Khẩn cấp vận hành.",
  "ar": "تديره وزارة الطوارئ."
 },
 "Run by the Ministry of Health. WhatsApp: 6669 1771.": {
  "es": "Servicio del Ministerio de Sanidad. WhatsApp: 6669 1771.",
  "ca": "A càrrec del Ministeri de Salut. WhatsApp: 6669 1771.",
  "fr": "Ligne du ministère de la Santé. WhatsApp : 6669 1771.",
  "de": "Ein Angebot des Gesundheitsministeriums. WhatsApp: 6669 1771.",
  "it": "Servizio del Ministero della Salute. WhatsApp: 6669 1771.",
  "pt": "Linha do Ministério da Saúde. WhatsApp: 6669 1771.",
  "ja": "保健省が運営しています。WhatsApp：6669 1771。",
  "zh": "由卫生部运营。WhatsApp：6669 1771。",
  "ko": "보건부에서 운영해요. WhatsApp: 6669 1771.",
  "hi": "स्वास्थ्य मंत्रालय द्वारा संचालित। WhatsApp: 6669 1771।",
  "id": "Dikelola oleh Kementerian Kesehatan. WhatsApp: 6669 1771.",
  "tr": "Sağlık Bakanlığı tarafından yürütülür. WhatsApp: 6669 1771.",
  "ru": "Горячая линия Министерства здравоохранения. WhatsApp: 6669 1771.",
  "vi": "Do Bộ Y tế vận hành. WhatsApp: 6669 1771.",
  "ar": "تديره وزارة الصحة. WhatsApp: ‎6669 1771."
 },
 "Suicide prevention line, in Vietnamese and English.": {
  "es": "Línea de prevención del suicidio, en vietnamita e inglés.",
  "ca": "Línia de prevenció del suïcidi, en vietnamita i en anglès.",
  "fr": "Ligne de prévention du suicide, en vietnamien et en anglais.",
  "de": "Krisentelefon zur Suizidprävention, auf Vietnamesisch und Englisch.",
  "it": "Linea per la prevenzione del suicidio, in vietnamita e inglese.",
  "pt": "Linha de prevenção do suicídio, em vietnamita e inglês.",
  "ja": "自殺予防の相談電話です。ベトナム語と英語で対応しています。",
  "zh": "自杀预防热线，提供越南语和英语服务。",
  "ko": "베트남어와 영어로 상담하는 자살 예방 상담전화예요.",
  "hi": "आत्महत्या रोकथाम हेल्पलाइन, वियतनामी और अंग्रेज़ी में।",
  "id": "Layanan pencegahan bunuh diri, dalam bahasa Vietnam dan Inggris.",
  "tr": "İntihar önleme hattı. Vietnamca ve İngilizce hizmet verir.",
  "ru": "Горячая линия по предотвращению самоубийств, на вьетнамском и английском языках.",
  "vi": "Đường dây nóng phòng chống tự tử, hỗ trợ bằng tiếng Việt và tiếng Anh.",
  "ar": "خط للوقاية من الانتحار، بالفيتنامية والإنجليزية."
 },
 "Suicide prevention line.": {
  "es": "Línea de prevención del suicidio.",
  "ca": "Línia de prevenció del suïcidi.",
  "fr": "Ligne de prévention du suicide.",
  "de": "Krisentelefon zur Suizidprävention.",
  "it": "Linea per la prevenzione del suicidio.",
  "pt": "Linha de prevenção do suicídio.",
  "ja": "自殺予防の相談電話です。",
  "zh": "自杀预防热线。",
  "ko": "자살 예방 상담전화예요.",
  "hi": "आत्महत्या रोकथाम हेल्पलाइन।",
  "id": "Layanan pencegahan bunuh diri.",
  "tr": "İntihar önleme hattı.",
  "ru": "Горячая линия по предотвращению самоубийств.",
  "vi": "Đường dây nóng phòng chống tự tử.",
  "ar": "خط للوقاية من الانتحار."
 },
 "Sun and Mon, 05:30–23:00 · Tue–Fri, 09:00–16:00 and 19:30–23:00 · Sat, 09:00–23:00": {
  "es": "Domingos y lunes, de 05:30 a 23:00 · De martes a viernes, de 09:00 a 16:00 y de 19:30 a 23:00 · Sábados, de 09:00 a 23:00",
  "ca": "Diumenges i dilluns, de 5:30 a 23:00 · De dimarts a divendres, de 9:00 a 16:00 i de 19:30 a 23:00 · Dissabtes, de 9:00 a 23:00",
  "fr": "Dimanche et lundi, de 5 h 30 à 23 h · Du mardi au vendredi, de 9 h à 16 h et de 19 h 30 à 23 h · Samedi, de 9 h à 23 h",
  "de": "So. und Mo., 05:30–23:00 Uhr · Di.–Fr., 09:00–16:00 und 19:30–23:00 Uhr · Sa., 09:00–23:00 Uhr",
  "it": "Domenica e lunedì, dalle 05:30 alle 23:00 · Dal martedì al venerdì, dalle 09:00 alle 16:00 e dalle 19:30 alle 23:00 · Sabato, dalle 09:00 alle 23:00",
  "pt": "Ao domingo e à segunda, das 5h30 às 23h · De terça a sexta, das 9h às 16h e das 19h30 às 23h · Ao sábado, das 9h às 23h",
  "ja": "日・月曜 5:30〜23:00 · 火〜金曜 9:00〜16:00、19:30〜23:00 · 土曜 9:00〜23:00",
  "zh": "周日和周一 05:30–23:00 · 周二至周五 09:00–16:00 和 19:30–23:00 · 周六 09:00–23:00",
  "ko": "일요일과 월요일 05:30~23:00 · 화~금요일 09:00~16:00, 19:30~23:00 · 토요일 09:00~23:00",
  "hi": "रवि और सोम, 05:30–23:00 · मंगल–शुक्र, 09:00–16:00 और 19:30–23:00 · शनि, 09:00–23:00",
  "id": "Minggu dan Senin, 05.30–23.00 · Selasa–Jumat, 09.00–16.00 dan 19.30–23.00 · Sabtu, 09.00–23.00",
  "tr": "Pazar ve Pazartesi, 05:30–23:00 · Salı–Cuma, 09:00–16:00 ve 19:30–23:00 · Cumartesi, 09:00–23:00",
  "ru": "Вс и Пн, 05:30–23:00 · Вт–Пт, 09:00–16:00 и 19:30–23:00 · Сб, 09:00–23:00",
  "vi": "Chủ Nhật và Thứ Hai, 05:30–23:00 · Thứ Ba đến Thứ Sáu, 09:00–16:00 và 19:30–23:00 · Thứ Bảy, 09:00–23:00",
  "ar": "الأحد والاثنين، من 05:30 إلى 23:00 · من الثلاثاء إلى الجمعة، من 09:00 إلى 16:00 ومن 19:30 إلى 23:00 · السبت، من 09:00 إلى 23:00"
 },
 "Sun–Thu, 08:00–20:00 · Sat, 13:00–20:00": {
  "es": "De domingo a jueves, de 08:00 a 20:00 · Sábados, de 13:00 a 20:00",
  "ca": "De diumenge a dijous, de 8:00 a 20:00 · Dissabtes, de 13:00 a 20:00",
  "fr": "Du dimanche au jeudi, de 8 h à 20 h · Samedi, de 13 h à 20 h",
  "de": "So.–Do., 08:00–20:00 Uhr · Sa., 13:00–20:00 Uhr",
  "it": "Dalla domenica al giovedì, dalle 08:00 alle 20:00 · Sabato, dalle 13:00 alle 20:00",
  "pt": "De domingo a quinta, das 8h às 20h · Ao sábado, das 13h às 20h",
  "ja": "日〜木曜 8:00〜20:00 · 土曜 13:00〜20:00",
  "zh": "周日至周四 08:00–20:00 · 周六 13:00–20:00",
  "ko": "일~목요일 08:00~20:00 · 토요일 13:00~20:00",
  "hi": "रवि–गुरु, 08:00–20:00 · शनि, 13:00–20:00",
  "id": "Minggu–Kamis, 08.00–20.00 · Sabtu, 13.00–20.00",
  "tr": "Pazar–Perşembe, 08:00–20:00 · Cumartesi, 13:00–20:00",
  "ru": "Вс–Чт, 08:00–20:00 · Сб, 13:00–20:00",
  "vi": "Chủ Nhật đến Thứ Năm, 08:00–20:00 · Thứ Bảy, 13:00–20:00",
  "ar": "من الأحد إلى الخميس، من 08:00 إلى 20:00 · السبت، من 13:00 إلى 20:00"
 },
 "Sun–Thu, 16:00–03:00 · Fri, Sat and holiday eves, 18:00–24:00": {
  "es": "De domingo a jueves, de 16:00 a 03:00 · Viernes, sábados y vísperas de festivo, de 18:00 a 24:00",
  "ca": "De diumenge a dijous, de 16:00 a 3:00 · Divendres, dissabtes i vigílies de festius, de 18:00 a 24:00",
  "fr": "Du dimanche au jeudi, de 16 h à 3 h du matin · Vendredi, samedi et veilles de fêtes, de 18 h à minuit",
  "de": "So.–Do., 16:00–03:00 Uhr · Fr., Sa. und am Vorabend von Feiertagen, 18:00–24:00 Uhr",
  "it": "Dalla domenica al giovedì, dalle 16:00 alle 03:00 di notte · Venerdì, sabato e prefestivi, dalle 18:00 alle 24:00",
  "pt": "De domingo a quinta, das 16h às 3h da madrugada · À sexta, ao sábado e em vésperas de feriado, das 18h às 24h",
  "ja": "日〜木曜 16:00〜翌3:00 · 金・土曜、祝前日 18:00〜24:00",
  "zh": "周日至周四 16:00–次日 03:00 · 周五、周六及节日前夕 18:00–24:00",
  "ko": "일~목요일 16:00~다음 날 03:00 · 금요일, 토요일, 공휴일 전날 18:00~24:00",
  "hi": "रवि–गुरु, 16:00–03:00 · शुक्र, शनि और छुट्टियों की पूर्व संध्या, 18:00–24:00",
  "id": "Minggu–Kamis, 16.00–03.00 · Jumat, Sabtu, dan sehari sebelum hari raya, 18.00–24.00",
  "tr": "Pazar–Perşembe, 16:00–03:00 · Cuma, Cumartesi ve bayram arifeleri, 18:00–24:00",
  "ru": "Вс–Чт, 16:00–03:00 · Пт, Сб и предпраздничные дни, 18:00–24:00",
  "vi": "Chủ Nhật đến Thứ Năm, 16:00–03:00 sáng hôm sau · Thứ Sáu, Thứ Bảy và đêm trước ngày lễ, 18:00–24:00",
  "ar": "من الأحد إلى الخميس، من 16:00 إلى 03:00 · الجمعة والسبت وعشية الأعياد، من 18:00 إلى 24:00"
 },
 "Text HOME (or HOLA, in Spanish) to 741741. Free on AT&T, T-Mobile, Sprint and Verizon.": {
  "es": "Envía HOME (o HOLA, en español) por SMS al 741741. Es gratuito con AT&T, T-Mobile, Sprint y Verizon.",
  "ca": "Envia un SMS amb la paraula HOME (o HOLA, en espanyol) al 741741. Gratuït amb AT&T, T-Mobile, Sprint i Verizon.",
  "fr": "Envoyez HOME (ou HOLA, en espagnol) par SMS au 741741. Gratuit chez AT&T, T-Mobile, Sprint et Verizon.",
  "de": "Schreib HOME (oder HOLA, auf Spanisch) per SMS an 741741. Kostenlos bei AT&T, T-Mobile, Sprint und Verizon.",
  "it": "Invia un SMS con la parola HOME (o HOLA, in spagnolo) al numero 741741. Gratuito per i clienti AT&T, T-Mobile, Sprint e Verizon.",
  "pt": "Envia a palavra HOME (ou HOLA, em espanhol) por SMS para o 741741. Gratuito para clientes da AT&T, T-Mobile, Sprint e Verizon.",
  "ja": "741741 に「HOME」（スペイン語なら「HOLA」）と SMS を送ってください。AT&T、T-Mobile、Sprint、Verizon の回線なら無料です。",
  "zh": "编辑短信 HOME（西班牙语请用 HOLA）发送至 741741。AT&T、T-Mobile、Sprint 和 Verizon 用户免费。",
  "ko": "741741로 HOME이라고 문자를 보내세요. 스페인어는 HOLA라고 보내면 돼요. AT&T, T-Mobile, Sprint, Verizon 가입자는 무료예요.",
  "hi": "741741 पर HOME (या स्पेनिश में HOLA) लिखकर SMS भेजें। AT&T, T-Mobile, Sprint और Verizon नेटवर्क पर मुफ़्त।",
  "id": "Kirim SMS berisi HOME (atau HOLA, dalam bahasa Spanyol) ke 741741. Gratis untuk pengguna AT&T, T-Mobile, Sprint, dan Verizon.",
  "tr": "HOME (İspanyolca için HOLA) yazıp 741741'e SMS gönder. AT&T, T-Mobile, Sprint ve Verizon abonelerine ücretsiz.",
  "ru": "Отправьте SMS со словом HOME (или HOLA — на испанском) на номер 741741. Бесплатно для абонентов AT&T, T-Mobile, Sprint и Verizon.",
  "vi": "Nhắn tin HOME (hoặc HOLA để nhắn bằng tiếng Tây Ban Nha) đến số 741741. Miễn phí với các nhà mạng AT&T, T-Mobile, Sprint và Verizon.",
  "ar": "أرسل كلمة HOME (أو HOLA بالإسبانية) في رسالة نصية إلى 741741. مجاني لمشتركي AT&T وT-Mobile وSprint وVerizon."
 },
 "Text SHOUT to 85258. Free and confidential.": {
  "es": "Envía SHOUT por SMS al 85258. Gratuito y confidencial.",
  "ca": "Envia un SMS amb la paraula SHOUT al 85258. Gratuït i confidencial.",
  "fr": "Envoyez SHOUT par SMS au 85258. Gratuit et confidentiel.",
  "de": "Schreib SHOUT per SMS an 85258. Kostenlos und vertraulich.",
  "it": "Invia un SMS con la parola SHOUT al numero 85258. Gratuito e riservato.",
  "pt": "Envia a palavra SHOUT por SMS para o 85258. Gratuito e confidencial.",
  "ja": "85258 に「SHOUT」と SMS を送ってください。無料で、秘密は守られます。",
  "zh": "编辑短信 SHOUT 发送至 85258。免费、保密。",
  "ko": "85258로 SHOUT라고 문자를 보내세요. 무료이고 비밀이 보장돼요.",
  "hi": "85258 पर SHOUT लिखकर SMS भेजें। मुफ़्त और गोपनीय।",
  "id": "Kirim SMS berisi SHOUT ke 85258. Gratis dan rahasia.",
  "tr": "SHOUT yazıp 85258'e SMS gönder. Ücretsiz ve gizli.",
  "ru": "Отправьте SMS со словом SHOUT на номер 85258. Бесплатно и конфиденциально.",
  "vi": "Nhắn tin SHOUT đến số 85258. Miễn phí và bảo mật.",
  "ar": "أرسل كلمة SHOUT في رسالة نصية إلى 85258. مجاني وسرّي."
 },
 "Thai: press 1. English: press 2 and they call you back.": {
  "es": "En tailandés: marca el 1. En inglés: marca el 2 y te devuelven la llamada.",
  "ca": "En tailandès: prem l'1. En anglès: prem el 2 i et tornaran la trucada.",
  "fr": "Pour le thaï, tapez 1. Pour l'anglais, tapez 2 et on vous rappelle.",
  "de": "Auf Thai: Taste 1. Auf Englisch: Taste 2, dann wirst du zurückgerufen.",
  "it": "Per il thailandese, premi 1. Per l'inglese, premi 2 e ti richiameranno.",
  "pt": "Em tailandês: marca a opção 1. Em inglês: marca a opção 2 e ligam-te de volta.",
  "ja": "タイ語は 1 を押してください。英語は 2 を押すと、折り返し電話がかかってきます。",
  "zh": "泰语服务请按 1。英语服务请按 2，工作人员会给你回电。",
  "ko": "태국어는 1번을 누르세요. 영어는 2번을 누르면 상담원이 다시 전화해 줘요.",
  "hi": "थाई के लिए 1 दबाएँ। अंग्रेज़ी के लिए 2 दबाएँ, वे आपको वापस कॉल करेंगे।",
  "id": "Bahasa Thai: tekan 1. Bahasa Inggris: tekan 2, lalu mereka akan meneleponmu kembali.",
  "tr": "Tayca için 1'i tuşla. İngilizce için 2'yi tuşla; seni geri ararlar.",
  "ru": "На тайском: нажмите 1. На английском: нажмите 2, и вам перезвонят.",
  "vi": "Tiếng Thái: nhấn phím 1. Tiếng Anh: nhấn phím 2, họ sẽ gọi lại cho bạn.",
  "ar": "للتايلاندية: اضغط 1. للإنجليزية: اضغط 2 وسيعاودون الاتصال بك."
 },
 "Trained volunteers. WhatsApp: 9151 1767.": {
  "es": "Te atienden voluntarios con formación. WhatsApp: 9151 1767.",
  "ca": "T'atenen voluntaris amb formació. WhatsApp: 9151 1767.",
  "fr": "Des bénévoles formés vous répondent. WhatsApp : 9151 1767.",
  "de": "Geschulte Ehrenamtliche. WhatsApp: 9151 1767.",
  "it": "Rispondono volontari formati. WhatsApp: 9151 1767.",
  "pt": "Atendimento por voluntários com formação. WhatsApp: 9151 1767.",
  "ja": "訓練を受けたボランティアが対応します。WhatsApp：9151 1767。",
  "zh": "由受过培训的志愿者接听。WhatsApp：9151 1767。",
  "ko": "교육받은 자원봉사자가 상담해요. WhatsApp: 9151 1767.",
  "hi": "प्रशिक्षित स्वयंसेवक। WhatsApp: 9151 1767।",
  "id": "Dilayani oleh relawan terlatih. WhatsApp: 9151 1767.",
  "tr": "Aramaları eğitim almış gönüllüler yanıtlar. WhatsApp: 9151 1767.",
  "ru": "Отвечают обученные волонтёры. WhatsApp: 9151 1767.",
  "vi": "Do tình nguyện viên đã qua đào tạo hỗ trợ. WhatsApp: 9151 1767.",
  "ar": "يقدّم الدعم متطوعون مدرَّبون. WhatsApp: ‎9151 1767."
 },
 "Volunteer psychologists and psychology students.": {
  "es": "Te atienden voluntarios: psicólogos y estudiantes de psicología.",
  "ca": "T'atenen psicòlegs voluntaris i estudiants de psicologia.",
  "fr": "Des bénévoles vous répondent : des psychologues et des étudiants en psychologie.",
  "de": "Ehrenamtliche Psychologinnen und Psychologen sowie Psychologiestudierende.",
  "it": "Rispondono volontari: psicologi e studenti di psicologia.",
  "pt": "Atendimento por voluntários: psicólogos e estudantes de psicologia.",
  "ja": "ボランティアの心理士と、心理学を学ぶ学生が対応します。",
  "zh": "由心理咨询师和心理学专业学生志愿接听。",
  "ko": "심리 전문가와 심리학 전공 학생들이 자원봉사로 상담해요.",
  "hi": "स्वयंसेवी मनोवैज्ञानिक और मनोविज्ञान के छात्र।",
  "id": "Dilayani oleh psikolog relawan dan mahasiswa psikologi.",
  "tr": "Aramaları gönüllü psikologlar ve psikoloji öğrencileri yanıtlar.",
  "ru": "Отвечают психологи-волонтёры и студенты-психологи.",
  "vi": "Do các nhà tâm lý học và sinh viên ngành tâm lý tình nguyện hỗ trợ.",
  "ar": "يقدّم الدعم أخصائيون نفسيون متطوعون وطلاب علم النفس."
 },
 "Volunteers. From Buenos Aires City and Greater Buenos Aires, dial 135 for free.": {
  "es": "Te atienden voluntarios. Desde la Ciudad de Buenos Aires y el Gran Buenos Aires, marca el 135 (llamada gratuita).",
  "ca": "T'atenen voluntaris. Des de la Ciutat de Buenos Aires i el Gran Buenos Aires, truca gratuïtament al 135.",
  "fr": "Des bénévoles vous répondent. Depuis la ville de Buenos Aires et le Grand Buenos Aires, composez le 135 (appel gratuit).",
  "de": "Hier helfen Ehrenamtliche. Aus der Stadt und dem Großraum Buenos Aires kannst du kostenlos 135 wählen.",
  "it": "Rispondono volontari. Dalla città di Buenos Aires e dalla Grande Buenos Aires, chiama gratuitamente il 135.",
  "pt": "Atendimento por voluntários. A partir da cidade de Buenos Aires e da Grande Buenos Aires, liga gratuitamente para o 135.",
  "ja": "ボランティアが対応します。ブエノスアイレス市と大ブエノスアイレス圏からは、135 に無料でかけられます。",
  "zh": "由志愿者接听。在布宜诺斯艾利斯市和大布宜诺斯艾利斯地区，可免费拨打 135。",
  "ko": "자원봉사자가 상담해요. 부에노스아이레스시와 부에노스아이레스 광역권에서는 135번에 무료로 전화할 수 있어요.",
  "hi": "स्वयंसेवकों द्वारा संचालित। ब्यूनस आयर्स शहर और ग्रेटर ब्यूनस आयर्स से 135 पर मुफ़्त कॉल करें।",
  "id": "Dilayani oleh relawan. Dari Kota Buenos Aires dan Buenos Aires Raya, hubungi 135 secara gratis.",
  "tr": "Aramaları gönüllüler yanıtlar. Buenos Aires şehrinden ve Büyük Buenos Aires'ten 135'i ücretsiz arayabilirsin.",
  "ru": "Отвечают волонтёры. Из города Буэнос-Айрес и Большого Буэнос-Айреса наберите 135 — это бесплатно.",
  "vi": "Do tình nguyện viên hỗ trợ. Từ Thành phố Buenos Aires và vùng đô thị Buenos Aires, bạn có thể gọi miễn phí số 135.",
  "ar": "يديره متطوعون. من مدينة بوينس آيرس ومنطقة بوينس آيرس الكبرى، اطلب 135 مجانًا."
 },
 "Wed–Sun, 13:00–20:30": {
  "es": "De miércoles a domingo, de 13:00 a 20:30",
  "ca": "De dimecres a diumenge, de 13:00 a 20:30",
  "fr": "Du mercredi au dimanche, de 13 h à 20 h 30",
  "de": "Mi.–So., 13:00–20:30 Uhr",
  "it": "Dal mercoledì alla domenica, dalle 13:00 alle 20:30",
  "pt": "De quarta a domingo, das 13h às 20h30",
  "ja": "水〜日曜 13:00〜20:30",
  "zh": "周三至周日 13:00–20:30",
  "ko": "수~일요일 13:00~20:30",
  "hi": "बुध–रवि, 13:00–20:30",
  "id": "Rabu–Minggu, 13.00–20.30",
  "tr": "Çarşamba–Pazar, 13:00–20:30",
  "ru": "Ср–Вс, 13:00–20:30",
  "vi": "Thứ Tư đến Chủ Nhật, 13:00–20:30",
  "ar": "من الأربعاء إلى الأحد، من 13:00 إلى 20:30"
 }
};

  var registrado = false;
  function registrar() {
    if (registrado) return;
    try {
      if (typeof CF_UI_MAP === 'undefined' || !CF_UI_MAP) return;     /* build/i18n4.js aún no ha cargado */
      Object.keys(TEXTOS).forEach(function (en) {
        var ya = CF_UI_MAP[en] || {}, fila = {};
        Object.keys(TEXTOS[en]).forEach(function (l) { fila[l] = TEXTOS[en][l]; });
        Object.keys(ya).forEach(function (l) { fila[l] = ya[l]; });  /* lo que ya traduce la app, manda */
        CF_UI_MAP[en] = fila;
      });
      registrado = true;
    } catch (e) {}
  }
  try {
    window.addEventListener('DOMContentLoaded', registrar);
    window.addEventListener('load', registrar);
  } catch (e) {}

  function norm(s) { return String(s == null ? '' : s).trim().toLowerCase(); }
  var BY_CODE = {}, BY_NAME = {};
  COUNTRIES.forEach(function (b) { BY_CODE[b.code] = b; BY_NAME[norm(b.country)] = b; });

  var API = {
    verified: VERIFICADO,
    forCountry: function (code) { registrar(); return BY_CODE[String(code == null ? '' : code).trim().toUpperCase()] || INTERNATIONAL; },
    forCountryName: function (name) { registrar(); return (name && BY_NAME[norm(name)]) || INTERNATIONAL; },
    intl: function () { registrar(); return INTERNATIONAL; }
  };
  /* all e international se leen como propiedades (la hoja hace CFC.international y [CFC.international].concat(CFC.all)):
     al leerlas también se registran los textos */
  Object.defineProperty(API, 'all', { enumerable: true, get: function () { registrar(); return COUNTRIES; } });
  Object.defineProperty(API, 'international', { enumerable: true, get: function () { registrar(); return INTERNATIONAL; } });
  window.CFCrisis = API;
})();
