/* ===== Chronic Friends · SL1 — Red de seguridad ante crisis / autolesión =====
   Capa persistente (webapp/vendor/): sobrevive a los reexports de Claude Design.
   Dataset de líneas de ayuda / prevención del suicidio por país, para mostrar al
   usuario los teléfonos de SU país si expresa una crisis.

   Datos verificados contra fuentes oficiales el 16 jul 2026 (ver notas al final).
   ⚠️ REVISAR antes de producción y reverificar periódicamente: los números y
   horarios cambian. findahelpline.com mantiene los datos al día (valorar su API).

   Uso desde la app (cuando se construya la pantalla SL1 en Claude Design):
     var info = CFCrisis.forCountry('ES');   // devuelve {country, code, lines[]}
     // si el país no está en la lista → devuelve el bloque INTL (fallback mundial)
   EN CUALQUIER crisis con peligro inmediato, mostrar SIEMPRE también el número de
   emergencias local (112 UE, 911 US/CA, 000 AU, etc.).
   ===================================================================== */
(function () {
  'use strict';

  var DATA = [
    { country: 'Spain', code: 'ES', lines: [
      { name: 'Línea 024 · Atención a la Conducta Suicida (Min. Sanidad)', phone: '024', hours: '24/7', notes: 'Gratuita y confidencial. Videointerpretación en lengua de signos e interpretación en otros idiomas.' },
      { name: 'Teléfono de la Esperanza', phone: '717 003 717', hours: '24/7', notes: 'ONG. telefonodelaesperanza.org' }
    ]},
    { country: 'Italy', code: 'IT', lines: [
      { name: 'Telefono Amico Italia', phone: '02 2327 2327', hours: 'Todos los días 10:00-24:00', notes: 'También chat y WhatsApp. telefonoamico.it' },
      { name: 'Samaritans Onlus', phone: '800 86 00 22', hours: 'Todos los días 13:00-22:00', notes: 'Gratuito. Alt: 06 77208977. samaritansonlus.org' }
    ]},
    { country: 'United States', code: 'US', lines: [
      { name: '988 Suicide & Crisis Lifeline', phone: '988', hours: '24/7', notes: 'Llamar o SMS al 988. Chat en 988lifeline.org. Español: 988 y pulsar 2. Veteranos: pulsar 1.' },
      { name: 'Crisis Text Line', phone: '741741', hours: '24/7', notes: 'SMS con la palabra HOME al 741741.' }
    ]},
    { country: 'United Kingdom', code: 'GB', lines: [
      { name: 'Samaritans', phone: '116 123', hours: '24/7', notes: 'Gratuito, no aparece en la factura. jo@samaritans.org' },
      { name: 'Shout', phone: '85258', hours: '24/7', notes: 'SMS: enviar SHOUT al 85258.' }
    ]},
    { country: 'Germany', code: 'DE', lines: [
      { name: 'TelefonSeelsorge', phone: '0800 111 0 111', hours: '24/7', notes: 'Gratuito y anónimo. Alt: 0800 111 0 222 y 116 123. Chat/email en telefonseelsorge.de' }
    ]},
    { country: 'France', code: 'FR', lines: [
      { name: '3114 · Numéro national de prévention du suicide', phone: '3114', hours: '24/7', notes: 'Gratuito. Ministère de la Santé. 3114.fr' }
    ]},
    { country: 'Mexico', code: 'MX', lines: [
      { name: 'Línea de la Vida (CONASAMA)', phone: '800 911 2000', hours: '24/7', notes: 'Gratuita. Salud mental y adicciones. gob.mx/conasama' },
      { name: 'SAPTEL', phone: '55 5259 8121', hours: '24/7', notes: 'Intervención en crisis, gratuita.' }
    ]},
    { country: 'Argentina', code: 'AR', lines: [
      { name: 'Centro de Asistencia al Suicida (CAS) · Línea 135', phone: '135', hours: 'Todos los días 08:00-24:00', notes: 'Gratuita en CABA y Gran Bs. As. Resto: (011) 5275-1135 o 0800 345 1435. asistenciaalsuicida.org.ar' }
    ]},
    { country: 'Colombia', code: 'CO', verify: true, lines: [
      { name: 'Línea 106 «El poder de ser escuchado» (Bogotá)', phone: '106', hours: '24/7', notes: 'Cobertura principalmente Bogotá; otras regiones tienen líneas territoriales.' },
      { name: 'Emergencias (salud mental)', phone: '123', hours: '24/7', notes: 'Emergencia general nacional con equipos de salud mental.' }
    ]},
    { country: 'Portugal', code: 'PT', lines: [
      { name: 'SOS Voz Amiga', phone: '213 544 545', hours: 'Todos los días 15:30-00:30', notes: 'Apoyo emocional. Alt: 912 802 669 / 963 524 660. sosvozamiga.org' },
      { name: 'SNS 24 · Linha de Saúde', phone: '808 24 24 24', hours: '24/7', notes: 'Línea nacional de salud del SNS; opción de salud mental.', verify: true }
    ]},
    { country: 'Netherlands', code: 'NL', lines: [
      { name: '113 Zelfmoordpreventie', phone: '113', hours: '24/7', notes: 'También 0800-0113 (anónimo en factura). Chat en 113.nl' }
    ]},
    { country: 'Ireland', code: 'IE', lines: [
      { name: 'Samaritans', phone: '116 123', hours: '24/7', notes: 'Gratuito. jo@samaritans.ie' },
      { name: 'Pieta', phone: '1800 247 247', hours: '24/7', notes: 'SMS: HELP al 51444. Prevención del suicidio y autolesión.' },
      { name: 'Text 50808 (HSE)', phone: '50808', hours: '24/7', notes: 'SMS: HELLO al 50808.' }
    ]},
    { country: 'Canada', code: 'CA', lines: [
      { name: '9-8-8 Suicide Crisis Helpline', phone: '988', hours: '24/7', notes: 'Llamar o SMS al 988. Bilingüe EN/FR.' },
      { name: 'Québec · 1-866-APPELLE', phone: '1 866 277 3553', hours: '24/7', notes: 'SMS al 535353. suicide.ca' }
    ]},
    { country: 'Australia', code: 'AU', lines: [
      { name: 'Lifeline', phone: '13 11 14', hours: '24/7', notes: 'SMS al 0477 13 11 14 y chat en lifeline.org.au' },
      { name: 'Beyond Blue', phone: '1300 22 4636', hours: '24/7', notes: 'Ansiedad, depresión y crisis. Chat online.' }
    ]},
    { country: 'Brazil', code: 'BR', lines: [
      { name: 'CVV · Centro de Valorização da Vida', phone: '188', hours: '24/7', notes: 'Gratuito. Chat, email y presencial. cvv.org.br' }
    ]},
    { country: 'Belgium', code: 'BE', lines: [
      { name: 'Zelfmoordlijn 1813 (NL)', phone: '1813', hours: '24/7', notes: 'Gratuito y anónimo. zelfmoord1813.be' },
      { name: 'Centre de Prévention du Suicide (FR)', phone: '0800 32 123', hours: '24/7', notes: 'Gratuito y anónimo, francófonos.' }
    ]},
    { country: 'Austria', code: 'AT', lines: [
      { name: 'TelefonSeelsorge · Notruf 142', phone: '142', hours: '24/7', notes: 'Gratuito. Chat 16:00-23:00. telefonseelsorge.at' },
      { name: 'Rat auf Draht (menores)', phone: '147', hours: '24/7', notes: 'Niños, adolescentes y cuidadores.' }
    ]},
    { country: 'Switzerland', code: 'CH', lines: [
      { name: 'Die Dargebotene Hand / La Main Tendue / Telefono Amico · 143', phone: '143', hours: '24/7', notes: 'Anónimo, en DE/FR/IT. 143.ch' },
      { name: 'Heart2Heart (EN)', phone: '0800 143 000', hours: 'Todos los días 18:00-23:00', notes: 'Servicio en inglés.' }
    ]},
    { country: 'Poland', code: 'PL', lines: [
      { name: 'Telefon Zaufania (adultos en crisis)', phone: '116 123', hours: '24/7', notes: 'Gratuito y confidencial. 116sos.pl' },
      { name: 'Telefon Zaufania (menores)', phone: '116 111', hours: '24/7', notes: 'Niños y jóvenes.' }
    ]},
    { country: 'Sweden', code: 'SE', lines: [
      { name: 'Mind Självmordslinjen', phone: '90101', hours: '24/7', notes: 'Gratuito y confidencial. Chat en mind.se' }
    ]},
    { country: 'Finland', code: 'FI', lines: [
      { name: 'MIELI Kriisipuhelin', phone: '09 2525 0111', hours: '24/7', notes: 'Finés, sueco e inglés (horarios por idioma). mieli.fi' }
    ]},
    { country: 'Greece', code: 'GR', lines: [
      { name: 'Klimaka · Suicide Prevention Helpline', phone: '1018', hours: '24/7', notes: 'Anónimo. Supervisado por el Ministerio de Salud.' }
    ]},
    { country: 'Denmark', code: 'DK', lines: [
      { name: 'Livslinien', phone: '70 201 201', hours: 'Todos los días 11:00-05:00', notes: 'Anónimo. livslinien.dk' }
    ]},
    { country: 'International (fallback)', code: 'INTL', lines: [
      { name: 'Find A Helpline', phone: '', hours: '-', notes: 'Buscador mundial verificado por país. findahelpline.com' },
      { name: 'IASP · Crisis Centres & Helplines', phone: '', hours: '-', notes: 'Directorio de la International Association for Suicide Prevention. iasp.info/crisis-centres-helplines' },
      { name: 'Befrienders Worldwide', phone: '', hours: '-', notes: 'Red mundial de apoyo emocional. befrienders.org' },
      { name: 'Emergencias (UE)', phone: '112', hours: '24/7', notes: 'Número europeo de emergencias en peligro inmediato de vida.' }
    ]}
  ];

  var BY_CODE = {};
  DATA.forEach(function (c) { BY_CODE[c.code] = c; });

  window.CFCrisis = {
    all: DATA,
    /* devuelve el bloque del país (código ISO alpha-2) o el fallback INTL */
    forCountry: function (code) {
      var k = String(code || '').toUpperCase();
      return BY_CODE[k] || BY_CODE.INTL;
    },
    intl: function () { return BY_CODE.INTL; }
  };
  try { console.log('[CFCrisis] dataset de líneas de crisis cargado ·', DATA.length, 'países (+INTL)'); } catch (e) {}
})();
