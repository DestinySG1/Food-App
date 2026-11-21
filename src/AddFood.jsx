import { useEffect, useRef, useState } from 'react'
import { MEALS, nutrientsFor } from './diary.js'
import { loadRecent } from './storage.js'
import { searchFoods } from './off.js'

const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`

export default function AddFood({ meal, onAdd, onClose }) {
  const mealLabel = MEALS.find((m) => m.id === meal)?.label ?? 'Mahlzeit'
  const [tab, setTab] = useState('suche')
  const [selected, setSelected] = useState(null)

  function addFood(food, grams) {
    onAdd(
      {
        id: newId(),
        meal,
        name: food.name,
        brand: food.brand,
        grams,
        per100: food.per100,
        totals: nutrientsFor(food.per100, grams),
      },
      food,
    )
  }

  return (
    <main className="screen">
      <header className="subbar">
        <button className="icon-btn" onClick={selected ? () => setSelected(null) : onClose} aria-label="Zurück">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div>
          <p className="muted small">Hinzufügen zu</p>
          <h1 className="h1-sm">{mealLabel}</h1>
        </div>
      </header>

      {selected ? (
        <AmountPicker food={selected} onConfirm={(g) => addFood(selected, g)} />
      ) : (
        <>
          <div className="segmented">
            <button className={tab === 'suche' ? 'active' : ''} onClick={() => setTab('suche')}>Suchen</button>
            <button className={tab === 'eigen' ? 'active' : ''} onClick={() => setTab('eigen')}>Eigener Eintrag</button>
          </div>
          {tab === 'suche' ? <Search onPick={setSelected} /> : <QuickEntry onAdd={(e, f) => onAdd({ ...e, id: newId(), meal }, f)} />}
        </>
      )}
    </main>
  )
}

function Search({ onPick }) {
  const [query, setQuery] = useState('')
  const [state, setState] = useState({ status: 'idle', results: [] })
  const [recent] = useState(() => loadRecent())
  const abortRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    return () => abortRef.current?.abort()
  }, [])

  async function run(e) {
    e.preventDefault()
    const q = query.trim()
    if (q.length < 2) return
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setState({ status: 'loading', results: [] })
    try {
      const results = await searchFoods(q, { signal: ctrl.signal })
      setState({ status: 'done', results })
    } catch (err) {
      if (err.name !== 'AbortError') setState({ status: 'error', results: [] })
    }
  }

  return (
    <>
      <form className="searchbar" onSubmit={run} role="search">
        <input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          placeholder="z. B. Haferflocken, Banane, Joghurt"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="primary small-btn" disabled={query.trim().length < 2}>Suchen</button>
      </form>

      {state.status === 'loading' && <p className="muted center">Suche läuft …</p>}
      {state.status === 'error' && (
        <p className="notice">Die Suche hat gerade nicht geklappt. Prüfe die Internetverbindung oder versuch es gleich nochmal. Du kannst auch einen eigenen Eintrag anlegen.</p>
      )}
      {state.status === 'done' && state.results.length === 0 && (
        <p className="notice">Nichts gefunden. Versuch einen anderen Begriff oder leg einen eigenen Eintrag an.</p>
      )}
      {state.status === 'done' && state.results.length > 0 && <FoodList foods={state.results} onPick={onPick} />}

      {state.status === 'idle' && recent.length > 0 && (
        <section>
          <h2 className="section-title">Zuletzt verwendet</h2>
          <FoodList foods={recent} onPick={onPick} />
        </section>
      )}
      {state.status === 'idle' && recent.length === 0 && (
        <p className="muted small center">Daten von Open Food Facts, der freien Lebensmitteldatenbank.</p>
      )}
    </>
  )
}

function FoodList({ foods, onPick }) {
  return (
    <ul className="food-list card">
      {foods.map((f) => (
        <li key={f.id}>
          <button onClick={() => onPick(f)}>
            <span className="food-main">
              <span className="food-name">{f.name}</span>
              {f.brand && <span className="muted small">{f.brand}</span>}
            </span>
            <span className="food-kcal">{f.per100.kcal}<small> kcal/100 g</small></span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function AmountPicker({ food, onConfirm }) {
  const [grams, setGrams] = useState(String(food.servingGrams || 100))
  const g = Number(String(grams).replace(',', '.'))
  const valid = g > 0 && g <= 5000
  const n = nutrientsFor(food.per100, valid ? g : 0)
  const presets = [...new Set([food.servingGrams, 50, 100, 150, 250].filter(Boolean))]

  return (
    <section className="card form">
      <div>
        <h2 className="food-title">{food.name}</h2>
        {food.brand && <p className="muted small no-margin">{food.brand}</p>}
      </div>

      <label className="field">
        <span className="field-label">Menge</span>
        <span className="field-input">
          <input inputMode="decimal" value={grams} onChange={(e) => setGrams(e.target.value)} autoFocus aria-label="Menge in Gramm" />
          <span className="unit">g</span>
        </span>
      </label>
      <div className="chips">
        {presets.map((p) => (
          <button key={p} type="button" className={g === p ? 'chip active' : 'chip'} onClick={() => setGrams(String(p))}>
            {p === food.servingGrams ? `1 Portion (${p} g)` : `${p} g`}
          </button>
        ))}
      </div>

      <div className="nutri-grid">
        <div><strong>{n.kcal}</strong><span>kcal</span></div>
        <div><strong>{Math.round(n.protein)} g</strong><span>Eiweiß</span></div>
        <div><strong>{Math.round(n.carbs)} g</strong><span>Kohlenh.</span></div>
        <div><strong>{Math.round(n.fat)} g</strong><span>Fett</span></div>
      </div>

      <button className="primary" disabled={!valid} onClick={() => onConfirm(g)}>Eintragen</button>
    </section>
  )
}

function QuickEntry({ onAdd }) {
  const [f, setF] = useState({ name: '', kcal: '', protein: '', carbs: '', fat: '' })
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))
  const n = (v) => Math.max(0, Number(String(v).replace(',', '.')) || 0)
  const valid = f.name.trim() && n(f.kcal) > 0

  function submit(e) {
    e.preventDefault()
    if (!valid) return
    const totals = { kcal: Math.round(n(f.kcal)), protein: n(f.protein), carbs: n(f.carbs), fat: n(f.fat) }
    const name = f.name.trim()
    // Als "Lebensmittel" mit 100 g = 1 Portion merken, damit es unter "Zuletzt verwendet" auftaucht
    const food = { id: `eigen:${name.toLowerCase()}`, name, brand: 'Eigener Eintrag', per100: totals, servingGrams: 100 }
    onAdd({ name, brand: '', grams: null, per100: null, totals }, food)
  }

  return (
    <form className="card form" onSubmit={submit}>
      <p className="muted small no-margin">Für Gerichte ohne Packung, z. B. „Kantine Nudelauflauf“. Werte für die ganze Portion.</p>
      <label className="field">
        <span className="field-label">Bezeichnung</span>
        <span className="field-input"><input value={f.name} onChange={set('name')} /></span>
      </label>
      <div className="row2">
        <Num label="Kalorien" unit="kcal" value={f.kcal} onChange={set('kcal')} />
        <Num label="Eiweiß" unit="g" value={f.protein} onChange={set('protein')} />
        <Num label="Kohlenhydrate" unit="g" value={f.carbs} onChange={set('carbs')} />
        <Num label="Fett" unit="g" value={f.fat} onChange={set('fat')} />
      </div>
      <button className="primary" disabled={!valid}>Eintragen</button>
    </form>
  )
}

function Num({ label, unit, value, onChange }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="field-input">
        <input inputMode="decimal" value={value} onChange={onChange} />
        <span className="unit">{unit}</span>
      </span>
    </label>
  )
}
