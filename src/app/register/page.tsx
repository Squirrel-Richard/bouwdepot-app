'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Wachtwoord moet minimaal 8 tekens zijn'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false); return }
    setDone(true)
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A0F' }}>
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📬</div>
        <h2 className="text-2xl font-bold text-white mb-3">Check je email!</h2>
        <p className="text-gray-400">We hebben een bevestigingslink gestuurd naar <strong className="text-white">{email}</strong>. Klik op de link om je account te activeren.</p>
        <Link href="/login" className="mt-6 inline-block text-orange-400 hover:underline text-sm">← Terug naar inloggen</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A0F' }}>
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>🏗️</div>
          <span className="font-bold text-white">Bouwdepot Tracker</span>
        </Link>
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 className="text-2xl font-bold text-white mb-1">Gratis account aanmaken</h1>
          <p className="text-gray-400 text-sm mb-6">Start vandaag met bijhouden van je bouwdepot</p>
          {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Naam</label>
              <input required placeholder="Jan de Vries" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">E-mailadres</label>
              <input type="email" required placeholder="jij@voorbeeld.nl" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Wachtwoord (min. 8 tekens)</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Account aanmaken...' : 'Gratis beginnen →'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Al een account?{' '}
            <Link href="/login" className="text-orange-400 hover:underline">Inloggen</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
