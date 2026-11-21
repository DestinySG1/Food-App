import { useState } from 'react'
import { loadProfile, saveProfile } from './storage.js'
import ProfileForm from './ProfileForm.jsx'
import Today from './Today.jsx'

export const APP_NAME = 'Tagesteller'

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile())
  const [editing, setEditing] = useState(false)

  function handleSave(p) {
    saveProfile(p)
    setProfile(p)
    setEditing(false)
  }

  if (!profile || editing) {
    return (
      <ProfileForm
        initial={profile}
        onSave={handleSave}
        onCancel={profile ? () => setEditing(false) : null}
      />
    )
  }
  return <Today profile={profile} onEditProfile={() => setEditing(true)} />
}
