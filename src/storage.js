// Speichert Daten lokal im Browser (bleibt nur auf diesem Gerät).
const KEY = 'tagesteller.profile.v1'

export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveProfile(profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {
    // Speicher nicht verfügbar (z. B. privater Modus) – App läuft trotzdem weiter
  }
}
