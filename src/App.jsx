import { useState } from 'react'
import { loadProfile, saveProfile, loadDiary, saveDiary, rememberFood } from './storage.js'
import { dateKey } from './diary.js'
import ProfileForm from './ProfileForm.jsx'
import Today from './Today.jsx'
import AddFood from './AddFood.jsx'

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile())
  const [diary, setDiary] = useState(() => loadDiary())
  const [day, setDay] = useState(() => dateKey())
  const [view, setView] = useState({ name: 'today' })

  function handleSaveProfile(p) {
    saveProfile(p)
    setProfile(p)
    setView({ name: 'today' })
  }

  function updateDiary(fn) {
    setDiary((d) => {
      const next = fn(d)
      saveDiary(next)
      return next
    })
  }

  function addEntry(entry, food) {
    if (food) rememberFood(food)
    updateDiary((d) => ({ ...d, [day]: [...(d[day] || []), entry] }))
    setView({ name: 'today' })
  }

  function removeEntry(id) {
    updateDiary((d) => ({ ...d, [day]: (d[day] || []).filter((e) => e.id !== id) }))
  }

  if (!profile || view.name === 'profile') {
    return (
      <ProfileForm
        initial={profile}
        onSave={handleSaveProfile}
        onCancel={profile ? () => setView({ name: 'today' }) : null}
      />
    )
  }
  if (view.name === 'add') {
    return <AddFood meal={view.meal} onAdd={addEntry} onClose={() => setView({ name: 'today' })} />
  }
  return (
    <Today
      profile={profile}
      day={day}
      onChangeDay={setDay}
      entries={diary[day] || []}
      onAdd={(meal) => setView({ name: 'add', meal })}
      onRemove={removeEntry}
      onEditProfile={() => setView({ name: 'profile' })}
    />
  )
}
