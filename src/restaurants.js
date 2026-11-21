// Eingebaute Liste mit Fast-Food- und Restaurantgerichten, die in Open Food Facts
// meist fehlen. Werte pro Portion. Es sind Richtwerte: Rezepte und Portionen
// ändern sich, und bei Imbiss-Gerichten schwankt die Größe stark.
// Format: [Name, Kette/Kategorie, Portion, kcal, Eiweiß, Kohlenhydrate, Fett, Suchwörter]

const RAW = [
  // McDonald's
  ['Hamburger', "McDonald's", '1 Stück', 250, 13, 30, 8, 'mcdonalds mcd burger'],
  ['Cheeseburger', "McDonald's", '1 Stück', 300, 15, 31, 12, 'mcdonalds mcd burger käse'],
  ['Doppel-Cheeseburger', "McDonald's", '1 Stück', 460, 27, 32, 24, 'mcdonalds mcd double burger käse'],
  ['Big Mac', "McDonald's", '1 Stück', 500, 26, 42, 25, 'mcdonalds mcd burger bigmac'],
  ['Hamburger Royal Käse', "McDonald's", '1 Stück', 520, 31, 38, 27, 'mcdonalds mcd burger royal cheese'],
  ['McChicken', "McDonald's", '1 Stück', 390, 15, 40, 18, 'mcdonalds mcd burger chicken hähnchen'],
  ['Chicken McNuggets, 6 Stück', "McDonald's", '6 Stück', 260, 15, 17, 15, 'mcdonalds mcd nuggets chicken'],
  ['Chicken McNuggets, 9 Stück', "McDonald's", '9 Stück', 390, 22, 25, 22, 'mcdonalds mcd nuggets chicken'],
  ['Chicken McNuggets, 20 Stück', "McDonald's", '20 Stück', 870, 50, 55, 50, 'mcdonalds mcd nuggets chicken'],
  ['Pommes Frites, klein', "McDonald's", 'kleine Portion', 230, 3, 29, 11, 'mcdonalds mcd fritten fries'],
  ['Pommes Frites, mittel', "McDonald's", 'mittlere Portion', 330, 4, 42, 16, 'mcdonalds mcd fritten fries'],
  ['Pommes Frites, groß', "McDonald's", 'große Portion', 440, 5, 56, 21, 'mcdonalds mcd fritten fries'],
  ['McFlurry Oreo', "McDonald's", '1 Becher', 340, 8, 50, 12, 'mcdonalds mcd eis dessert'],

  // Burger King
  ['Whopper', 'Burger King', '1 Stück', 630, 28, 49, 35, 'bk burger'],
  ['Whopper Jr.', 'Burger King', '1 Stück', 340, 15, 30, 18, 'bk burger junior'],
  ['Cheeseburger', 'Burger King', '1 Stück', 310, 16, 30, 14, 'bk burger käse'],
  ['Long Chicken', 'Burger King', '1 Stück', 570, 21, 52, 31, 'bk burger hähnchen'],
  ['Chicken Nuggets, 6 Stück', 'Burger King', '6 Stück', 280, 14, 18, 17, 'bk nuggets'],
  ['Pommes, mittel', 'Burger King', 'mittlere Portion', 330, 4, 43, 16, 'bk fritten fries'],

  // KFC
  ['Original Recipe Chicken', 'KFC', '1 Stück', 280, 24, 9, 17, 'kentucky hähnchen'],
  ['Hot Wings, 5 Stück', 'KFC', '5 Stück', 380, 27, 12, 25, 'kentucky chicken flügel'],
  ['Zinger Burger', 'KFC', '1 Stück', 470, 26, 45, 21, 'kentucky burger chicken'],

  // Subway
  ['Chicken Teriyaki Sub, 15 cm', 'Subway', '1 Sub (15 cm)', 340, 25, 47, 5, 'sandwich hähnchen'],
  ['Italian B.M.T. Sub, 15 cm', 'Subway', '1 Sub (15 cm)', 410, 19, 45, 17, 'sandwich salami bmt'],
  ['Veggie Delite Sub, 15 cm', 'Subway', '1 Sub (15 cm)', 230, 9, 40, 3, 'sandwich vegetarisch'],

  // Imbiss und Restaurant (allgemein)
  ['Döner Kebab im Brot', 'Imbiss', '1 Stück', 700, 35, 70, 30, 'doener kebap'],
  ['Dürüm Döner', 'Imbiss', '1 Stück', 750, 38, 75, 32, 'yufka rolle doener'],
  ['Döner-Box mit Pommes', 'Imbiss', '1 Box', 900, 40, 70, 50, 'doener box'],
  ['Falafel im Brot', 'Imbiss', '1 Stück', 600, 18, 75, 25, 'vegetarisch'],
  ['Currywurst', 'Imbiss', '1 Portion', 400, 14, 15, 31, 'wurst'],
  ['Currywurst mit Pommes', 'Imbiss', '1 Portion', 800, 20, 70, 48, 'wurst fritten'],
  ['Pommes mit Mayo', 'Imbiss', '1 Portion', 550, 5, 50, 36, 'fritten mayonnaise'],
  ['Bratwurst im Brötchen', 'Imbiss', '1 Stück', 450, 17, 30, 29, 'wurst grill'],
  ['Leberkäsbrötchen', 'Imbiss', '1 Stück', 450, 16, 30, 29, 'leberkäse fleischkäse'],
  ['Pizza Margherita (ganze, Ø 30 cm)', 'Restaurant', '1 Pizza', 850, 35, 110, 28, 'pizzeria'],
  ['Pizza Salami (ganze, Ø 30 cm)', 'Restaurant', '1 Pizza', 1050, 45, 110, 45, 'pizzeria'],
  ['Spaghetti Bolognese', 'Restaurant', '1 Teller', 650, 30, 85, 20, 'nudeln pasta'],
  ['Schnitzel Wiener Art mit Pommes', 'Restaurant', '1 Teller', 1000, 45, 80, 55, 'paniert'],
  ['Gebratene Nudeln mit Hähnchen', 'Restaurant', '1 Teller', 700, 30, 85, 25, 'asia wok chinesisch'],
  ['Sushi Maki Lachs, 8 Stück', 'Restaurant', '8 Stück', 280, 11, 48, 4, 'japanisch'],
]

export const RESTAURANT_FOODS = RAW.map(([name, brand, portion, kcal, protein, carbs, fat, keywords], i) => ({
  id: `rest:${i}:${slug(brand)}-${slug(name)}`,
  name,
  brand,
  portionLabel: portion,
  perPortion: { kcal, protein, carbs, fat },
  keywords,
  approx: true,
}))

function slug(s) {
  return normalize(s).replace(/\s+/g, '-')
}

// Kleinbuchstaben, Umlaute ausschreiben, "Mc Donald's" → "mcdonalds"
export function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/['’`´.]/g, '')
    .replace(/\bmc\s+/g, 'mc')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function levenshtein(a, b) {
  if (a === b) return 0
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return prev[b.length]
}

// Wie gut passt ein Suchwort zu einem Wort aus dem Eintrag? 0 = gar nicht
function tokenScore(q, t) {
  if (t === q) return 3
  if (t.startsWith(q) && q.length >= 2) return 2
  if (q.length >= 4 && (t.includes(q) || q.startsWith(t) && t.length >= 4)) return 1.5
  const allowed = q.length >= 8 ? 2 : q.length >= 4 ? 1 : 0
  if (allowed && Math.abs(q.length - t.length) <= allowed && levenshtein(q, t) <= allowed) return 1
  return 0
}

// Durchsucht die eingebaute Liste; tolerant gegenüber Tippfehlern.
export function searchRestaurantFoods(query, limit = 8) {
  const qTokens = normalize(query).split(' ').filter(Boolean)
  if (!qTokens.length) return []
  const scored = []
  for (const f of RESTAURANT_FOODS) {
    const tokens = normalize(`${f.name} ${f.brand} ${f.keywords}`).split(' ')
    // zusammengesetzte Wörter wie "doppelcheeseburger" auch als Ganzes prüfen
    const name = normalize(f.name).replace(/ /g, '')
    let total = 0
    let ok = true
    for (const q of qTokens) {
      const best = Math.max(...tokens.map((t) => tokenScore(q, t)), name.includes(q) && q.length >= 4 ? 1.5 : 0)
      if (!best) { ok = false; break }
      total += best
    }
    if (ok) scored.push({ f, total })
  }
  return scored.sort((a, b) => b.total - a.total).slice(0, limit).map((s) => s.f)
}
