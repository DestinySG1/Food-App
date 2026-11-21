import { test } from 'node:test'
import assert from 'node:assert/strict'
import { dateKey, shiftDate, nutrientsFor, sumEntries, parseOffProduct } from './diary.js'

test('Datumsschlüssel und Tage wechseln', () => {
  assert.equal(dateKey(new Date(2026, 10, 21)), '2026-11-21')
  assert.equal(shiftDate('2026-11-30', 1), '2026-12-01')
  assert.equal(shiftDate('2026-03-01', -1), '2026-02-28')
})

test('Nährwerte für eine Menge', () => {
  const per100 = { kcal: 370, protein: 13.5, carbs: 58.7, fat: 7 }
  assert.deepEqual(nutrientsFor(per100, 50), { kcal: 185, protein: 6.8, carbs: 29.4, fat: 3.5 })
  assert.deepEqual(nutrientsFor(per100, ''), { kcal: 0, protein: 0, carbs: 0, fat: 0 })
})

test('Summe über Einträge', () => {
  const s = sumEntries([
    { totals: { kcal: 185, protein: 6.8, carbs: 29.4, fat: 3.5 } },
    { totals: { kcal: 100, protein: 0.2, carbs: 0.6, fat: 0 } },
  ])
  assert.deepEqual(s, { kcal: 285, protein: 7, carbs: 30, fat: 4 })
})

test('Open-Food-Facts-Produkt umwandeln', () => {
  const f = parseOffProduct({
    code: '123',
    product_name: 'Oats',
    product_name_de: 'Haferflocken',
    brands: 'Marke A, Marke B',
    serving_quantity: '40',
    nutriments: { 'energy-kcal_100g': 372, proteins_100g: 13.5, carbohydrates_100g: '58,7', fat_100g: 7 },
  })
  assert.equal(f.name, 'Haferflocken')
  assert.equal(f.brand, 'Marke A')
  assert.equal(f.servingGrams, 40)
  assert.deepEqual(f.per100, { kcal: 372, protein: 13.5, carbs: 58.7, fat: 7 })
})

test('kJ werden in kcal umgerechnet, Produkte ohne Werte verworfen', () => {
  assert.equal(parseOffProduct({ code: '1', product_name: 'X', nutriments: { energy_100g: 1674 } }).per100.kcal, 400)
  assert.equal(parseOffProduct({ code: '2', product_name: 'Y', nutriments: {} }), null)
  assert.equal(parseOffProduct({ code: '3', nutriments: { 'energy-kcal_100g': 10 } }), null)
})

import { isValidEan } from './diary.js'
test('EAN-Prüfziffer', () => {
  assert.equal(isValidEan('4006381333931'), true)
  assert.equal(isValidEan('4006381333932'), false)
  assert.equal(isValidEan('96385074'), true)
  assert.equal(isValidEan('036000291452'), true)
  assert.equal(isValidEan('12345'), false)
  assert.equal(isValidEan('abc'), false)
})

test('Format der neuen Suche (Marken als Liste, kJ-Feld)', () => {
  const f = parseOffProduct({ code: '4013200254742', product_name_de: 'Haferflocken', brands: ['Bio Rinatura Haferflocken', 'Rinatura'], nutriments: { 'energy-kj_100g': 1565, proteins_100g: 13, carbohydrates_100g: 59, fat_100g: 7 } })
  assert.equal(f.brand, 'Bio Rinatura Haferflocken')
  assert.equal(f.per100.kcal, 374)
})
