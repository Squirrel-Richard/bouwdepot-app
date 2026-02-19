'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Depot, Factuur } from '@/types/database'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Clock, CheckCircle, XCircle, AlertTriangle, FileText, Trash2 } from 'lucide-react'

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  nieuw: { label: 'Nieuw', color: '#6B7280', icon: FileText },
  ingediend: { label: 'Ingediend', color: '#3B82F6', icon: Clock },
  uitbetaald: { label: 'Uitbetaald', color: '#10B981', icon: CheckCircle },
  afgewezen: { label: 'Afgewezen', color: '#EF4444', icon: XCircle },
}

export default function DepotDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [depot, setDepot] = useState<Depot | null>(null)
  const [facturen, setFacturen] = useState<Factuur[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: d } = await supabase.from('depots').select('*').eq('id', id).single()
      if (!d) { router.push('/dashboard'); return }
      setDepot(d)
      const { data: f } = await supabase.from('facturen').select('*').eq('depot_id', id).order('created_at', { ascending: false })
      setFacturen(f || [])
      setLoading(false)
    }
    load()
  }, [id])

  async function updateStatus(factuurId: string, status: string) {
    const update: Record<string, string | null> = { status }
    if (status === 'uitbetaald') update.uitbetaald_op = new Date().toISOString().split('T')[0]
    if (status === 'ingediend') update.ingediend_op = new Date().toISOString().split('T')[0]
    await supabase.from('facturen').update(update).eq('id', factuurId)
    setFacturen(prev => prev.map(f => f.id === factuurId ? { ...f, ...update } as Factuur : f))
  }

  async function deleteFactuur(factuurId: string) {
    if (!confirm('Factuur verwijderen?')) return
    await supabase.from('facturen').delete().eq('id', factuurId)
    setFacturen(prev => prev.filter(f => f.id !== factuurId))
  }

  if (loading || !depot) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const totaalUitbetaald = facturen.filter(f => f.status === 'uitbetaald').reduce((s, f) => s + f.bedrag, 0)
  const totaalIngediend = facturen.filter(f => f.status === 'ingediend').reduce((s, f) => s + f.bedrag, 0)
  const resterend = depot.totaal_bedrag - totaalUitbetaald - totaalIngediend
  const pct = Math.min(100, Math.round((totaalUitbetaald / depot.totaal_bedrag) * 100))
  const days = daysUntil(depot.vervaldatum)

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: '#0A0A0F' }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{depot.naam}</h1>
            <p className="text-gray-500 text-sm">{depot.bank} · {new Date(depot.startdatum).toLocaleDateString('nl-NL')} – {new Date(depot.vervaldatum).toLocaleDateString('nl-NL')}</p>
          </div>
          <Link href={`/factuur/nieuw?depot=${id}`}>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#F97316' }}>
              <Plus className="w-4 h-4" /> Factuur toevoegen
            </button>
          </Link>
        </div>

        {days <= 30 && days > 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', color: '#FB923C' }}>
            <AlertTriangle className="w-4 h-4" /> Je depot vervalt over <strong>{days} dagen</strong>! Dien nog openstaande facturen in.
          </div>
        )}
        {days <= 0 && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#F87171' }}>
            <XCircle className="w-4 h-4" /> Dit bouwdepot is verlopen op {new Date(depot.vervaldatum).toLocaleDateString('nl-NL')}.
          </div>
        )}

        {/* Budget overview */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Totaal depot', value: formatMoney(depot.totaal_bedrag) },
            { label: 'Uitbetaald', value: formatMoney(totaalUitbetaald), color: '#10B981' },
            { label: 'In behandeling', value: formatMoney(totaalIngediend), color: '#3B82F6' },
            { label: 'Nog beschikbaar', value: formatMoney(resterend), color: '#F97316' },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className="text-lg font-bold" style={{ color: s.color || 'white' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-8 p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Budget benut: {pct}%</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {days > 0 ? `${days} dagen resterend` : 'Verlopen'}</span>
          </div>
          <div className="h-3 rounded-full bg-white/5 overflow-hidden">
            <div className="h-3 rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #10B981, #3B82F6)' }} />
          </div>
        </div>

        {/* Facturen */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Facturen ({facturen.length})</h2>
        </div>

        {facturen.length === 0 ? (
          <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <FileText className="w-10 h-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">Nog geen facturen toegevoegd</p>
            <Link href={`/factuur/nieuw?depot=${id}`}>
              <button className="px-5 py-2.5 rounded-xl text-sm text-white" style={{ background: '#F97316' }}>Eerste factuur toevoegen</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {facturen.map(f => {
              const cfg = statusConfig[f.status]
              const Icon = cfg.icon
              return (
                <motion.div key={f.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl flex items-center gap-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cfg.color}15` }}>
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{f.aanvrager_naam}</p>
                    <p className="text-gray-500 text-xs truncate">{f.omschrijving || f.factuur_datum}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-semibold text-sm">{formatMoney(f.bedrag)}</p>
                    <p className="text-xs" style={{ color: cfg.color }}>{cfg.label}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {f.status === 'nieuw' && (
                      <button onClick={() => updateStatus(f.id, 'ingediend')} className="px-2 py-1 text-xs rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors">Ingediend</button>
                    )}
                    {f.status === 'ingediend' && (
                      <button onClick={() => updateStatus(f.id, 'uitbetaald')} className="px-2 py-1 text-xs rounded-lg hover:bg-green-500/20 text-green-400 transition-colors">Uitbetaald ✓</button>
                    )}
                    <button onClick={() => deleteFactuur(f.id)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
