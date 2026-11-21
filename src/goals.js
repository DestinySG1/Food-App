// Berechnung des Tagesziels für Kalorien und Makronährstoffe.
// Grundumsatz nach Mifflin-St Jeor, multipliziert mit dem Aktivitätsfaktor.

export const ACTIVITY_LEVELS = [
  { id: 'sitzend', label: 'Kaum Bewegung', hint: 'Bürojob, wenig Sport', factor: 1.2 },
  { id: 'leicht', label: 'Leicht aktiv', hint: '1–3× Sport pro Woche', factor: 1.375 },
  { id: 'mittel', label: 'Aktiv', hint: '3–5× Sport pro Woche', factor: 1.55 },
  { id: 'hoch', label: 'Sehr aktiv', hint: 'Fast täglich Sport', factor: 1.725 },
  { id: 'extrem', label: 'Extrem aktiv', hint: 'Körperliche Arbeit + Sport', factor: 1.9 },
]

export const GOALS = [
  { id: 'abnehmen', label: 'Abnehmen', kcalDelta: -500, proteinPerKg: 1.8 },
  { id: 'halten', label: 'Gewicht halten', kcalDelta: 0, proteinPerKg: 1.6 },
  { id: 'zunehmen', label: 'Zunehmen', kcalDelta: 300, proteinPerKg: 1.8 },
]

const SEX_OFFSET = { m: 5, w: -161, d: -78 }
const MIN_KCAL = 1200
const FAT_SHARE = 0.3

export function bmr({ sex, weightKg, heightCm, age }) {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (SEX_OFFSET[sex] ?? SEX_OFFSET.d)
}

export function calculateTargets(profile) {
  const activity = ACTIVITY_LEVELS.find((a) => a.id === profile.activity) ?? ACTIVITY_LEVELS[0]
  const goal = GOALS.find((g) => g.id === profile.goal) ?? GOALS[1]

  const base = bmr(profile)
  const tdee = base * activity.factor
  const kcal = Math.max(MIN_KCAL, Math.round((tdee + goal.kcalDelta) / 10) * 10)

  // Eiweiß nach Körpergewicht, Fett als Anteil, Rest Kohlenhydrate
  let protein = Math.round(profile.weightKg * goal.proteinPerKg)
  protein = Math.min(protein, Math.round((kcal * 0.35) / 4))
  const fat = Math.round((kcal * FAT_SHARE) / 9)
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4))

  return { bmr: Math.round(base), tdee: Math.round(tdee), kcal, protein, fat, carbs }
}

export function validateProfile(p) {
  const errors = {}
  if (!(p.age >= 14 && p.age <= 100)) errors.age = 'Bitte ein Alter zwischen 14 und 100 angeben.'
  if (!(p.heightCm >= 120 && p.heightCm <= 230)) errors.heightCm = 'Bitte eine Größe zwischen 120 und 230 cm angeben.'
  if (!(p.weightKg >= 35 && p.weightKg <= 300)) errors.weightKg = 'Bitte ein Gewicht zwischen 35 und 300 kg angeben.'
  if (!['m', 'w', 'd'].includes(p.sex)) errors.sex = 'Bitte auswählen.'
  return errors
}
