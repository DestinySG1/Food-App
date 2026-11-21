import { test } from 'node:test'
import assert from 'node:assert/strict'
import { searchRestaurantFoods, normalize } from './restaurants.js'

const names = (q) => searchRestaurantFoods(q).map((f) => `${f.brand}|${f.name}`)

test('Normalisierung', () => {
  assert.equal(normalize("Mc Donald's Döner"), 'mcdonalds doener')
})

test('Doppel-Cheeseburger auch mit Tippfehlern und Schreibweisen', () => {
  for (const q of ['Doppel Cheesburger', 'doppel cheeseburger mc donalds', 'double cheeseburger', 'doppelcheeseburger', "McDonald's Doppel"]) {
    assert.equal(names(q)[0], "McDonald's|Doppel-Cheeseburger", q)
  }
})

test('Weitere Treffer', () => {
  assert.ok(names('big mac')[0].includes('Big Mac'))
  assert.ok(names('döner').some((n) => n.includes('Döner Kebab')))
  assert.ok(names('doner').some((n) => n.includes('Döner')))
  assert.ok(names('whoper')[0].includes('Whopper'))
  assert.ok(names('bk pommes')[0].startsWith('Burger King'))
})

test('Keine Treffer bei Unpassendem', () => {
  assert.deepEqual(names('haferflocken'), [])
  assert.deepEqual(names('apfel'), [])
})
