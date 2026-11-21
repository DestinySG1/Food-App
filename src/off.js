// Anbindung an Open Food Facts (freie Lebensmitteldatenbank, https://openfoodfacts.org).
import { parseOffProduct } from './diary.js'

const BASE = 'https://world.openfoodfacts.org'
const FIELDS = 'code,product_name,product_name_de,generic_name,generic_name_de,brands,nutriments,serving_quantity,serving_size'

export async function searchFoods(query, { signal } = {}) {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '30',
    lc: 'de',
    cc: 'de',
    sort_by: 'unique_scans_n',
    fields: FIELDS,
  })
  const res = await fetch(`${BASE}/cgi/search.pl?${params}`, { signal })
  if (!res.ok) throw new Error(`Suche fehlgeschlagen (${res.status})`)
  const data = await res.json()
  return (data.products || []).map(parseOffProduct).filter(Boolean)
}
