/**
 * AnafilaxiaSOS - Test suite unitario
 * Comando: node test.js
 */
'use strict';
var assert = require('assert');
var AnafilaxiaSOS = require('./anafilaxia.js');

var passed = 0;
function test(nombre, fn) {
  try {
    fn();
    passed++;
    console.log('  [OK] ' + nombre);
  } catch (e) {
    console.error('  [FAIL] ' + nombre + '\n         ' + e.message);
    process.exitCode = 1;
  }
}

console.log('=== 1. Criterios de Anafilaxia WAO 2020 ===');

test('Urticaria + dificultad para respirar dispara diagnóstico de Anafilaxia y emergencia vital', function () {
  var r = AnafilaxiaSOS.evaluarAnafilaxia({
    cutaneos: true,
    respiratorios: true,
    cardiovasculares: false,
    digestivos: false
  });
  assert.strictEqual(r.esAnafilaxia, true);
  assert.strictEqual(r.urgencia, 'emergencia_vital');
  assert.ok(/ADRENALINA/i.test(r.accion));
});

test('Alérgeno conocido + dolor abdominal y mareo activa Anafilaxia', function () {
  var r = AnafilaxiaSOS.evaluarAnafilaxia({
    alergenoExpuesto: true,
    cutaneos: false,
    respiratorios: false,
    cardiovasculares: true,
    digestivos: true
  });
  assert.strictEqual(r.esAnafilaxia, true);
  assert.strictEqual(r.urgencia, 'emergencia_vital');
});

test('Solo picor aislado sin compromiso respiratorio ni alérgeno es reacción leve', function () {
  var r = AnafilaxiaSOS.evaluarAnafilaxia({
    cutaneos: true,
    respiratorios: false,
    cardiovasculares: false,
    digestivos: false
  });
  assert.strictEqual(r.esAnafilaxia, false);
  assert.strictEqual(r.urgencia, 'leve');
});

console.log('\n=== 2. Dosificación de Autoinyector de Adrenalina ===');

test('Niño de 18 kg recibe dosis Junior de 0.15 mg', function () {
  var r = AnafilaxiaSOS.calcularDosisAdrenalina(18);
  assert.strictEqual(r.dosisMg, 0.15);
  assert.strictEqual(r.tipo, 'Infantil / Junior');
});

test('Adulto de 70 kg recibe dosis de 0.30 mg', function () {
  var r = AnafilaxiaSOS.calcularDosisAdrenalina(70);
  assert.strictEqual(r.dosisMg, 0.30);
  assert.strictEqual(r.tipo, 'Adulto');
});

console.log('\n' + passed + ' tests de anafilaxia superados con éxito.');
