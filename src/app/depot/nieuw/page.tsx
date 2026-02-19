'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

const BANKEN = ['ING', 'Rabobank', 'ABN AMRO', 'SNS Bank', 'Volksbank', 'Triodos', 'ASN Bank', 'Andere bank']

export default function NieuwDepotPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    naam: '',
    bank: '',
    totaal_bedrag: '',
    startdatum: new Date().toISOString().split('T')[0],
    vervaldatum: '',
    omschrijving: '',
  })

  function setField(k: string, v: string) {
    setForm(p => ({ ...p, [k]: v }))
    // Auto-calculate vervaldatum (2 jaar na startdatum)
    if (k === 'startdatum' && v) {
      const d = new Date(v)
      d.setFullYear(d.getFullYear() + 2)
      setForm(p => ({ ...p, startdatum: v, vervaldatum: d.toISOString().split('T')[0] }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.bank) { setError('Selecteer je bank'); return }
    const bedrag = Math.round(parseFloat(form.totaal_bedrag) * 100)
    if (isNaN(bedrag) || bedrag <= 0) { setError('Voer een geldig bedrag in'); return }
    setSaving(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('depots').insert({
        user_id: user?.id,
        naam: form.naam,
        bank: form.bank,
        totaal_bedrag: bedrag,
        startdatum: form.startdatum,
        vervaldatum: form.vervaldatum,
        omschrijving: form.omschrijving || null,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Opslaan mislukt')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#0A0A0F' }}>
      <div className="max-w-xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Terug naar dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>🏗️</div>
          <div>
            <h1 className="text-2xl font-bold text-white">Nieuw bouwdepot</h1>
            <p className="text-gray-400 text-sm">Voeg je verbouwingsdepot toe</p>
          </div>
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl space-y-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="font-semibold text-white">Depot gegevens</h2>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Naam (bijv. &quot;Verbouwing woonkamer&quot;)</label>
              <input required placeholder="Mijn bouwdepot" value={form.naam} onChange={e => setField('naam', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Bank</label>
              <select required value={form.bank} onChange={e => setField('bank', e.target.value)}>
                <option value="">Selecteer je bank</option>
                {BANKEN.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Totaal depotbedrag (€)</label>
              <input type="number" required min="1" step="0.01" placeholder="50000" value={form.totaal_bedrag} onChange={e => setField('totaal_bedrag', e.target.value)} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl space-y-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="font-semibold text-white">Looptijd</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Startdatum</label>
                <input type="date" required value={form.startdatum} onChange={e => setField('startdatum', e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Vervaldatum</label>
                <input type="date" required value={form.vervaldatum} onChange={e => setField('vervaldatum', e.target.value)} />
              </div>
            </div>
            <p className="text-xs text-gray-500">Vervaldatum is automatisch ingesteld op 2 jaar na startdatum. Pas aan indien nodig.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <label className="block font-semibold text-white mb-3">Omschrijving (optioneel)</label>
            <textarea placeholder="Bijv. aanbouw, keukenrenovatie, dakisolatie..." value={form.omschrijving} onChange={e => setField('omschrijving', e.target.value)} rows={3} style={{ resize: 'none' }} />
          </motion.div>

          <div className="flex gap-3">
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Opslaan...' : 'Depot aanmaken'}
            </motion.button>
            <Link href="/dashboard">
              <button type="button" className="px-6 py-3 text-gray-400 hover:text-white rounded-xl text-sm border border-white/10 hover:border-white/20 transition-all">
                Annuleren
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
