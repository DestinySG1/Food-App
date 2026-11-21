import { useState } from 'react'
import { ACTIVITY_LEVELS, GOALS, validateProfile } from './goals.js'

const EMPTY = { sex: '', age: '', heightCm: '', weightKg: '', activity: 'leicht', goal: 'halten' }

export default function ProfileForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => (initial ? { ...initial } : EMPTY))
  const [errors, setErrors] = useState({})

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  function submit(e) {
    e.preventDefault()
    const profile = {
      ...form,
      age: Number(form.age),
      heightCm: Number(form.heightCm),
      weightKg: Number(String(form.weightKg).replace(',', '.')),
    }
    const errs = validateProfile(profile)
    setErrors(errs)
    if (Object.keys(errs).length === 0) onSave(profile)
  }

  return (
    <main className="screen">
      <header className="intro">
        <img src="./icon.svg" alt="" className="intro-logo" />
        <h1>{initial ? 'Profil bearbeiten' : 'Willkommen!'}</h1>
        <p className="muted">
          Ein paar Angaben zu dir, dann berechnen wir dein persönliches Tagesziel.
        </p>
      </header>

      <form onSubmit={submit} noValidate className="card form">
        <fieldset>
          <legend>Geschlecht</legend>
          <div className="segmented">
            {[['w', 'Weiblich'], ['m', 'Männlich'], ['d', 'Divers']].map(([id, label]) => (
              <button
                type="button"
                key={id}
                className={form.sex === id ? 'active' : ''}
                onClick={() => set('sex')(id)}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.sex && <p className="error">{errors.sex}</p>}
        </fieldset>

        <div className="row3">
          <NumberField label="Alter" unit="Jahre" value={form.age} onChange={set('age')} error={errors.age} />
          <NumberField label="Größe" unit="cm" value={form.heightCm} onChange={set('heightCm')} error={errors.heightCm} />
          <NumberField label="Gewicht" unit="kg" value={form.weightKg} onChange={set('weightKg')} error={errors.weightKg} decimal />
        </div>

        <fieldset>
          <legend>Wie aktiv bist du?</legend>
          <div className="choices">
            {ACTIVITY_LEVELS.map((a) => (
              <label key={a.id} className={`choice ${form.activity === a.id ? 'active' : ''}`}>
                <input type="radio" name="activity" checked={form.activity === a.id} onChange={() => set('activity')(a.id)} />
                <span className="choice-title">{a.label}</span>
                <span className="choice-hint">{a.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Dein Ziel</legend>
          <div className="segmented">
            {GOALS.map((g) => (
              <button
                type="button"
                key={g.id}
                className={form.goal === g.id ? 'active' : ''}
                onClick={() => set('goal')(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="primary">Tagesziel berechnen</button>
        {onCancel && (
          <button type="button" className="ghost" onClick={onCancel}>Abbrechen</button>
        )}
      </form>
    </main>
  )
}

function NumberField({ label, unit, value, onChange, error, decimal }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="field-input">
        <input
          inputMode={decimal ? 'decimal' : 'numeric'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
        />
        <span className="unit">{unit}</span>
      </span>
      {error && <span className="error">{error}</span>}
    </label>
  )
}
