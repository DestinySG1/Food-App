import { test } from 'node:test'
import assert from 'node:assert/strict'
import { bmr, calculateTargets, validateProfile } from './goals.js'

const base = { sex: 'm', age: 30, heightCm: 180, weightKg: 80, activity: 'sitzend', goal: 'halten' }

test('Grundumsatz nach Mifflin-St Jeor', () => {
  assert.equal(bmr(base), 1780)
  assert.equal(bmr({ ...base, sex: 'w' }), 1614)
})

test('Tagesziel beim Halten', () => {
  const t = calculateTargets(base)
  assert.equal(t.tdee, 2136)
  assert.equal(t.kcal, 2140)
})

test('Abnehmen zieht 500 kcal ab', () => {
  assert.equal(calculateTargets({ ...base, goal: 'abnehmen' }).kcal, 1640)
})

test('Nie unter 1200 kcal', () => {
  const t = calculateTargets({ sex: 'w', age: 80, heightCm: 150, weightKg: 40, activity: 'sitzend', goal: 'abnehmen' })
  assert.equal(t.kcal, 1200)
})

test('Makros ergeben ungefähr das Kalorienziel', () => {
  const t = calculateTargets({ ...base, activity: 'mittel', goal: 'zunehmen' })
  const sum = t.protein * 4 + t.carbs * 4 + t.fat * 9
  assert.ok(Math.abs(sum - t.kcal) < 15, `Summe ${sum} vs ${t.kcal}`)
})

test('Validierung meldet ungültige Werte', () => {
  assert.deepEqual(validateProfile(base), {})
  assert.ok(validateProfile({ ...base, age: 5 }).age)
})
