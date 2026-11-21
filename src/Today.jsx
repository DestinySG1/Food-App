import { calculateTargets, GOALS } from './goals.js'
import { MEALS, sumEntries, dateKey, shiftDate } from './diary.js'

export default function Today({ profile, day, onChangeDay, entries, onAdd, onRemove, onEditProfile }) {
  const t = calculateTargets(profile)
  const eaten = sumEntries(entries)
  const goal = GOALS.find((g) => g.id === profile.goal)
  const today = dateKey()

  return (
    <main className="screen">
      <header className="topbar">
        <div>
          <p className="muted small">{formatDay(day)}</p>
          <h1>{dayTitle(day, today)}</h1>
        </div>
        <div className="topbar-actions">
          <button className="icon-btn" onClick={() => onChangeDay(shiftDate(day, -1))} aria-label="Vorheriger Tag">
            <Chevron dir="left" />
          </button>
          <button className="icon-btn" onClick={() => onChangeDay(shiftDate(day, 1))} disabled={day >= today} aria-label="Nächster Tag">
            <Chevron dir="right" />
          </button>
          <button className="icon-btn" onClick={onEditProfile} aria-label="Profil bearbeiten">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
            </svg>
          </button>
        </div>
      </header>

      <section className="card ring-card">
        <Ring value={eaten.kcal} max={t.kcal} />
        <div className="ring-stats">
          <Stat label="Ziel" value={t.kcal} />
          <Stat label="Gegessen" value={eaten.kcal} />
        </div>
      </section>

      <section className="card">
        <h2>Makros</h2>
        <MacroBar label="Eiweiß" value={eaten.protein} max={t.protein} color="var(--protein)" />
        <MacroBar label="Kohlenhydrate" value={eaten.carbs} max={t.carbs} color="var(--carbs)" />
        <MacroBar label="Fett" value={eaten.fat} max={t.fat} color="var(--fat)" />
      </section>

      {MEALS.map((m) => {
        const list = entries.filter((e) => e.meal === m.id)
        const kcal = sumEntries(list).kcal
        return (
          <section className="card meal" key={m.id}>
            <div className="meal-head">
              <h2>{m.label}</h2>
              <span className="muted small">{kcal} kcal</span>
            </div>
            {list.length > 0 && (
              <ul className="entries">
                {list.map((e) => (
                  <li key={e.id}>
                    <span className="food-main">
                      <span className="food-name">{e.name}</span>
                      <span className="muted small">
                        {[e.grams ? `${e.grams} g` : null, e.brand].filter(Boolean).join(' · ') || 'Eigener Eintrag'}
                      </span>
                    </span>
                    <span className="entry-kcal">{e.totals.kcal} kcal</span>
                    <button className="remove" onClick={() => onRemove(e.id)} aria-label={`${e.name} entfernen`}>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button className="add-btn" onClick={() => onAdd(m.id)}>
              <span aria-hidden="true">+</span> Hinzufügen
            </button>
          </section>
        )
      })}

      <details className="card info">
        <summary>So kommt dein Ziel zustande</summary>
        <dl>
          <div><dt>Grundumsatz</dt><dd>{t.bmr} kcal</dd></div>
          <div><dt>Mit Aktivität</dt><dd>{t.tdee} kcal</dd></div>
          <div><dt>Ziel: {goal?.label}</dt><dd>{goal?.kcalDelta > 0 ? '+' : ''}{goal?.kcalDelta} kcal</dd></div>
        </dl>
        <p className="muted small">
          Schätzwerte nach der Mifflin-St-Jeor-Formel. Kein Ersatz für ärztlichen Rat.
        </p>
      </details>
    </main>
  )
}

function formatDay(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
}

function dayTitle(day, today) {
  if (day === today) return 'Heute'
  if (day === shiftDate(today, -1)) return 'Gestern'
  return 'Tagebuch'
}

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )
}

function Ring({ value, max }) {
  const r = 70
  const c = 2 * Math.PI * r
  const pct = Math.min(1, max ? value / max : 0)
  const over = value > max
  return (
    <div className="ring">
      <svg viewBox="0 0 180 180" width="180" height="180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--track)" strokeWidth="16" />
        <circle
          cx="90" cy="90" r={r} fill="none" stroke={over ? 'var(--danger)' : 'var(--accent)'} strokeWidth="16"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="ring-label">
        <strong>{Math.abs(max - value)}</strong>
        <span>{over ? 'kcal drüber' : 'kcal übrig'}</span>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span className="muted small">{label}</span>
      <strong>{value} kcal</strong>
    </div>
  )
}

function MacroBar({ label, value, max, color }) {
  const pct = Math.min(100, max ? (value / max) * 100 : 0)
  return (
    <div className="macro">
      <div className="macro-head">
        <span>{label}</span>
        <span className="muted">{value} / {max} g</span>
      </div>
      <div className="bar"><div style={{ width: `${pct}%`, background: color }} /></div>
    </div>
  )
}
