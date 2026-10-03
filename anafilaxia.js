/*!
 * AnafilaxiaSOS v1.0.0 — Protocolo de Anafilaxia y Simulador de Autoinyector de Adrenalina
 * Open-source severe allergy emergency guide & adrenaline auto-injector trainer (WAO/EAACI).
 *
 * Copyright (c) 2026 DataFlow Elegance - Ismael Ben Kazem
 * Licencia MIT · 100% en el navegador · Criterios World Allergy Organization 2020
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AnafilaxiaSOS = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var VERSION = '1.0.0';

  /**
   * Criterios diagnósticos de Anafilaxia (World Allergy Organization - WAO 2020)
   */
  function evaluarAnafilaxia(p) {
    p = p || {};
    var piel = !!p.cutaneos; // Urticaria, picor, eritema, hinchazón de labios/lengua
    var resp = !!p.respiratorios; // Dificultad para respirar, estridor, voz ronca, pitos
    var cardio = !!p.cardiovasculares; // Mareo brusco, caída de tensión, desmayo, palidez
    var digest = !!p.digestivos; // Dolor abdominal cólico grave, vómitos reiterados tras comer
    var alergenoConocido = !!p.alergenoExpuesto;

    var numSistemas = (piel ? 1 : 0) + (resp ? 1 : 0) + (cardio ? 1 : 0) + (digest ? 1 : 0);

    // Criterio 1: Piel/mucosas + (Respiratorio O Cardiovascular)
    var criterio1 = piel && (resp || cardio);
    // Criterio 2: Dos o más sistemas tras exposición a alérgeno
    var criterio2 = alergenoConocido && (numSistemas >= 2);
    // Criterio 3: Caída brusca de tensión tras alérgeno conocido
    var criterio3 = alergenoConocido && cardio;

    var esAnafilaxia = criterio1 || criterio2 || criterio3;

    var urgencia = 'leve';
    var accion = 'Tratamiento antihistamínico habitual según pauta y observación.';
    var mensajeClinico = 'Reacción alérgica localizada o leve sin compromiso de vías respiratorias ni cardiovascular.';

    if (esAnafilaxia) {
      urgencia = 'emergencia_vital';
      accion = 'INYECTAR ADRENALINA INTRAMUSCULAR DE INMEDIATO EN EL MUSLO Y LLAMAR AL 112.';
      mensajeClinico = 'CUADRO COMPATIBLE CON ANAFILAXIA AGUDA. La adrenalina (epinefrina) es el ÚNICO tratamiento que frena el shock anafiláctico y la asfixia. No esperes a antihistamínicos ni corticoides.';
    }

    return {
      esAnafilaxia: esAnafilaxia,
      urgencia: urgencia,
      accion: accion,
      mensajeClinico: mensajeClinico,
      sistemasAfectados: numSistemas
    };
  }

  /**
   * Cálculo de dosis de autoinyector de adrenalina según peso
   */
  function calcularDosisAdrenalina(pesoKg) {
    var peso = Math.max(5, parseFloat(pesoKg) || 70);
    
    if (peso < 25) {
      return {
        dosisMg: 0.15,
        tipo: 'Infantil / Junior',
        marcasComunes: 'EpiPen Jr, Jext 150 mcg, Altellus 0.15 mg',
        instruccion: 'Dosis pediátrica (0.15 mg). Clavar en la cara externa del muslo.'
      };
    }

    return {
      dosisMg: 0.30,
      tipo: 'Adulto',
      marcasComunes: 'EpiPen, Jext 300 mcg, Altellus 0.30 mg',
      instruccion: 'Dosis estándar de adulto (0.30 mg). Clavar en la cara externa del muslo.'
    };
  }

  var REGLA_MNEMOTECNICA = {
    lema: '«Azul al cielo, naranja al muslo»',
    pasos: [
      '1. Agarra el autoinyector con el puño cerrado (pulgar fuera de los extremos).',
      '2. Retira la tapa de seguridad azul tirando recto («Azul al cielo»).',
      '3. Apoya y clava con fuerza el extremo naranja contra la cara lateral externa del muslo a 90º («Naranja al muslo»), incluso a través de la ropa.',
      '4. Escucha el «clic» y MANTÉN PRESIONADO FIRME durante 3 a 5 segundos completos.',
      '5. Retira el inyector, masajea la zona durante 10 segundos y LLAMA AL 112 informando de anafilaxia tratada.'
    ]
  };

  return {
    VERSION: VERSION,
    evaluarAnafilaxia: evaluarAnafilaxia,
    calcularDosisAdrenalina: calcularDosisAdrenalina,
    REGLA_MNEMOTECNICA: REGLA_MNEMOTECNICA
  };
});
