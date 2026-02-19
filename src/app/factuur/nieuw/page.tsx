'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Depot } from '@/types/database'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Loader2, FileText } from 'lucide-react'
import { Suspense } from 'react'

function NieuwFactuurForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const depotId = searchParams.get('depot')
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [depot, setDepot] = useState<Depot | null>(null)
  const [depots, setDepots] = useState<Depot[]>([])
  const [form, setForm] = useState({
    depot_id: depotId || '',
    aanvrager_naam: '',
    bedrag: '',
    factuur_datum: new Date().toISOString().split('T')[0],
    omschrijving: '',
    status: 'nieuw' as 'nieuw' | 'ingediend',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('depots').select('*').eq('user_id', user.id)
      setDepots(data || [])
      if (depotId) {
        const d = data?.find(d => d.id === depotId)
        if (d) setDepot(d)
      }
    }
    load()
  }, [depotId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.depot_id) { setError('Selecteer een depot'); return }
    const bedrag = Math.round(parseFloat(form.bedrag) * 100)
    if (isNaN(bedrag) || bedrag <= 0) { setError('Voer een geldig bedrag in'); return }
    setSaving(true)
    setError('')
    try {
      const { error } = await supabase.from('facturen').insert({
        depot_id: form.depot_id,
        aanvrager_naam: form.aanvrager_naam,
        bedrag,
        factuur_datum: form.factuur_datum,
        omschrijving: form.omschrijving || null,
        status: form.status,
        ingediend_op: form.status === 'ingediend' ? form.factuur_datum : null,
      })
      if (error) throw error
      router.push(`/depot/${form.depot_id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Opslaan mislukt')
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#0A0A0F' }}>
      <div className="max-w-xl mx-auto">
        <Link href={depotId ? `/depot/${depotId}` : '/dashboard'} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {depot ? depot.naam : 'Dashboard'}
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Factuur toevoegen</h1>
            <p className="text-gray-400 text-sm">Log een nieuwe factuur in je depot</p>
          </div>
        </div>

        {error && <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400 bg-red-400/10 border border-red-400/20">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl space-y-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="font-semibold text-white">Factuurgegevens</h2>

            {!depotId && (
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Bouwdepot</label>
                <select required value={form.depot_id} onChange={e => setForm(p => ({ ...p, depot_id: e.target.value }))}>
                  <option value="">Selecteer depot</option>
                  {depots.map(d => <option key={d.id} value={d.id}>{d.naam} ({d.bank})</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Aanvrager / Aannemer *</label>
              <input required placeholder="bijv. Bouwbedrijf Jansen BV" value={form.aanvrager_naam} onChange={e => setForm(p => ({ ...p, aanvrager_naam: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Bedrag (€) *</label>
                <input type="number" required min="0.01" step="0.01" placeholder="5000" value={form.bedrag} onChange={e => setForm(p => ({ ...p, bedrag: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Factuurdatum *</label>
                <input type="date" required value={form.factuur_datum} onChange={e => setForm(p => ({ ...p, factuur_datum: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Omschrijving (optioneel)</label>
              <input placeholder="bijv. fundering, dakwerk, kozijnen..." value={form.omschrijving} onChange={e => setForm(p => ({ ...p, omschrijving: e.target.value }))} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h2 className="font-semibold text-white mb-3">Status</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 'nieuw', label: 'Nog in te dienen', desc: 'Factuur ontvangen, nog niet bij bank ingediend' },
                { v: 'ingediend', label: 'Al ingediend', desc: 'Factuur is al bij de bank ingediend' },
              ].map(opt => (
                <button
                  key={opt.v}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, status: opt.v as 'nieuw' | 'ingediend' }))}
                  className="p-3 rounded-xl text-left transition-all text-sm"
                  style={{
                    background: form.status === opt.v ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                    border: form.status === opt.v ? '1px solid rgba(249,115,22,0.35)' : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <p className="font-medium" style={{ color: form.status === opt.v ? '#FB923C' : 'white' }}>{opt.label}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          <div className="flex gap-3">
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Opslaan...' : 'Factuur opslaan'}
            </motion.button>
            <Link href={depotId ? `/depot/${depotId}` : '/dashboard'}>
              <button type="button" className="px-6 py-3 text-gray-400 hover:text-white rounded-xl text-sm border border-white/10 transition-all">
                Annuleren
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NieuwFactuurPage() {
  return (
    <Suspense>
      <NieuwFactuurForm />
    </Suspense>
  )
}
