// Reine Hilfsfunktionen für das Ernährungstagebuch (ohne Browser-Abhängigkeiten, gut testbar).

export const MEALS = [
  { id: 'fruehstueck', label: 'Frühstück' },
  { id: 'mittag', label: 'Mittagessen' },
  { id: 'abend', label: 'Abendessen' },
  { id: 'snack', label: 'Snacks' },
]

export const ZERO = { kcal: 0, protein: 0, carbs: 0, fat: 0 }

// Datum als Schlüssel "JJJJ-MM-TT" in lokaler Zeit
export function dateKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function shiftDate(key, days) {
  const [y, m, d] = key.split('-').map(Number)
  return dateKey(new Date(y, m - 1, d + days))
}

// Nährwerte für eine Menge in Gramm aus Werten pro 100 g
export function nutrientsFor(per100, grams) {
  const f = (Number(grams) || 0) / 100
  return {
    kcal: Math.round((per100.kcal || 0) * f),
    protein: round1((per100.protein || 0) * f),
    carbs: round1((per100.carbs || 0) * f),
    fat: round1((per100.fat || 0) * f),
  }
}

export function sumEntries(entries) {
  const t = entries.reduce(
    (acc, e) => ({
      kcal: acc.kcal + (e.totals?.kcal || 0),
      protein: acc.protein + (e.totals?.protein || 0),
      carbs: acc.carbs + (e.totals?.carbs || 0),
      fat: acc.fat + (e.totals?.fat || 0),
    }),
    ZERO,
  )
  return { kcal: Math.round(t.kcal), protein: Math.round(t.protein), carbs: Math.round(t.carbs), fat: Math.round(t.fat) }
}

// Wandelt ein Produkt von Open Food Facts in unser Format um. Gibt null zurück,
// wenn keine brauchbaren Kalorienangaben vorhanden sind.
export function parseOffProduct(p) {
  if (!p) return null
  const n = p.nutriments || {}
  let kcal = num(n['energy-kcal_100g'])
  if (kcal == null && num(n['energy_100g']) != null) kcal = num(n['energy_100g']) / 4.184 // kJ → kcal
  const name = (p.product_name_de || p.product_name || p.generic_name_de || p.generic_name || '').trim()
  if (kcal == null || !name) return null
  const serving = num(p.serving_quantity)
  return {
    id: `off:${p.code}`,
    code: p.code,
    name,
    brand: (p.brands || '').split(',')[0].trim(),
    per100: {
      kcal: Math.round(kcal),
      protein: round1(num(n.proteins_100g) ?? 0),
      carbs: round1(num(n.carbohydrates_100g) ?? 0),
      fat: round1(num(n.fat_100g) ?? 0),
    },
    servingGrams: serving && serving > 0 && serving < 2000 ? Math.round(serving) : null,
    servingLabel: p.serving_size || null,
  }
}

function num(v) {
  const x = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : v
  return typeof x === 'number' && Number.isFinite(x) ? x : null
}
function round1(x) {
  return Math.round(x * 10) / 10
}
