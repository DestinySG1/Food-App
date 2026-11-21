// Anbindung an Open Food Facts (freie Lebensmitteldatenbank, https://openfoodfacts.org).
import { parseOffProduct } from './diary.js'

const BASE = 'https://world.openfoodfacts.org'
const FIELDS = 'code,product_name,product_name_de,generic_name,generic_name_de,brands,nutriments,serving_quantity,serving_size'

// Nutzt die neue Suche von Open Food Facts (search.openfoodfacts.org). Die alte
// Suche (cgi/search.pl) blockiert anonyme Anfragen inzwischen häufig.
export async function searchFoods(query, { signal } = {}) {
  const params = new URLSearchParams({
    q: query,
    langs: 'de',
    page_size: '30',
    fields: FIELDS,
  })
  const res = await fetch(`https://search.openfoodfacts.org/search?${params}`, { signal })
  if (!res.ok) throw new Error(`Suche fehlgeschlagen (${res.status})`)
  const data = await res.json()
  return (data.hits || []).map(parseOffProduct).filter(Boolean)
}

// Produkt per Barcode abrufen. Gibt null zurück, wenn es nicht in der Datenbank ist
// oder keine Nährwerte hat.
export async function lookupBarcode(code, { signal } = {}) {
  const res = await fetch(`${BASE}/api/v2/product/${encodeURIComponent(code)}.json?fields=${FIELDS}`, { signal })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Abruf fehlgeschlagen (${res.status})`)
  const data = await res.json()
  if (data.status !== 1 || !data.product) return null
  return parseOffProduct({ code, ...data.product })
}
