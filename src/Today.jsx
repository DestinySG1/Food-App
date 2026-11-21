import { calculateTargets, GOALS } from './goals.js'

export default function Today({ profile, onEditProfile }) {
  const t = calculateTargets(profile)
  const eaten = { kcal: 0, protein: 0, carbs: 0, fat: 0 } // kommt in Etappe 2 aus dem Tagebuch
  const goal = GOALS.find((g) => g.id === profile.goal)
  const date = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <main className="screen">
      <header className="topbar">
        <div>
          <p className="muted small">{date}</p>
          <h1>Heute</h1>
        </div>
        <button className="icon-btn" onClick={onEditProfile} aria-label="Profil bearbeiten">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
          </svg>
        </button>
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

      <section className="card info">
        <h2>So kommt dein Ziel zustande</h2>
        <dl>
          <div><dt>Grundumsatz</dt><dd>{t.bmr} kcal</dd></div>
          <div><dt>Mit Aktivität</dt><dd>{t.tdee} kcal</dd></div>
          <div><dt>Ziel: {goal?.label}</dt><dd>{goal?.kcalDelta > 0 ? '+' : ''}{goal?.kcalDelta} kcal</dd></div>
        </dl>
        <p className="muted small">
          Schätzwerte nach der Mifflin-St-Jeor-Formel. Kein Ersatz für ärztlichen Rat.
        </p>
      </section>

      <p className="muted small center">Mahlzeiten eintragen kommt in der nächsten Etappe.</p>
    </main>
  )
}

function Ring({ value, max }) {
  const r = 70
  const c = 2 * Math.PI * r
  const pct = Math.min(1, max ? value / max : 0)
  const left = Math.max(0, max - value)
  return (
    <div className="ring">
      <svg viewBox="0 0 180 180" width="180" height="180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="var(--track)" strokeWidth="16" />
        <circle
          cx="90" cy="90" r={r} fill="none" stroke="var(--accent)" strokeWidth="16"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform="rotate(-90 90 90)"
        />
      </svg>
      <div className="ring-label">
        <strong>{left}</strong>
        <span>kcal übrig</span>
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
