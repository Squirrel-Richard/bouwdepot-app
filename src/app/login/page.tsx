'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Home } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0A0A0F' }}>
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>🏗️</div>
          <span className="font-bold text-white">Bouwdepot Tracker</span>
        </Link>
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 className="text-2xl font-bold text-white mb-1">Inloggen</h1>
          <p className="text-gray-400 text-sm mb-6">Welkom terug!</p>
          {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">E-mailadres</label>
              <input type="email" required placeholder="jij@voorbeeld.nl" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Wachtwoord</label>
              <input type="password" required placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Bezig...' : 'Inloggen'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-6">
            Nog geen account?{' '}
            <Link href="/register" className="text-orange-400 hover:underline">Registreer gratis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
