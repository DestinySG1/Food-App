// Speichert Daten lokal im Browser (bleibt nur auf diesem Gerät).
const KEYS = {
  profile: 'tagesteller.profile.v1',
  diary: 'tagesteller.diary.v1',
  recent: 'tagesteller.recent.v1',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus) – App läuft trotzdem weiter
  }
}

export const loadProfile = () => read(KEYS.profile, null)
export const saveProfile = (p) => write(KEYS.profile, p)

// Tagebuch: { "2026-11-21": [Eintrag, ...], ... }
export const loadDiary = () => read(KEYS.diary, {})
export const saveDiary = (d) => write(KEYS.diary, d)

// Zuletzt verwendete Lebensmittel (neueste zuerst, max. 30)
export const loadRecent = () => read(KEYS.recent, [])
export function rememberFood(food) {
  const list = loadRecent().filter((f) => f.id !== food.id)
  list.unshift(food)
  write(KEYS.recent, list.slice(0, 30))
}
