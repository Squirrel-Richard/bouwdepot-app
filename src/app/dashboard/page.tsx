'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Depot, Factuur } from '@/types/database'
import { motion } from 'framer-motion'
import { Plus, LogOut, AlertTriangle, Clock, TrendingUp, FileText, ChevronRight } from 'lucide-react'

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function formatMoney(cents: number) {
  return (cents / 100).toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
}

function DepotCard({ depot, facturen }: { depot: Depot; facturen: Factuur[] }) {
  const depotFacturen = facturen.filter(f => f.depot_id === depot.id)
  const totaalIngediend = depotFacturen.reduce((s, f) => s + (f.status !== 'nieuw' ? f.bedrag : 0), 0)
  const totaalUitbetaald = depotFacturen.reduce((s, f) => s + (f.status === 'uitbetaald' ? f.bedrag : 0), 0)
  const resterend = depot.totaal_bedrag - totaalUitbetaald
  const pct = Math.min(100, Math.round((totaalUitbetaald / depot.totaal_bedrag) * 100))
  const days = daysUntil(depot.vervaldatum)
  const urgent = days <= 30

  return (
    <Link href={`/depot/${depot.id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl cursor-pointer transition-colors"
        style={{
          background: urgent ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.03)',
          border: urgent ? '1px solid rgba(249,115,22,0.25)' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">{depot.naam}</h3>
            <p className="text-gray-500 text-xs mt-0.5">{depot.bank}</p>
          </div>
          <div className="flex items-center gap-2">
            {urgent && <AlertTriangle className="w-4 h-4 text-orange-400" />}
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
        </div>

        {/* Budget bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Uitbetaald: {formatMoney(totaalUitbetaald)}</span>
            <span>Totaal: {formatMoney(depot.totaal_bedrag)}</span>
          </div>
          <div className="h-2 rounded-full bg-white/5">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${pct}%`, background: pct >= 80 ? '#10B981' : '#F97316' }}
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{pct}% benut</div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Resterend: <strong className="text-white">{formatMoney(resterend)}</strong></span>
          <span className={`text-xs px-2 py-1 rounded-full ${urgent ? 'text-orange-400 bg-orange-400/10' : 'text-gray-400 bg-white/5'}`}>
            <Clock className="w-3 h-3 inline mr-1" />
            {days > 0 ? `${days} dagen` : 'Verlopen'}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5 text-xs text-gray-500">
          <span><FileText className="w-3 h-3 inline mr-1" />{depotFacturen.length} facturen</span>
          <span>{depotFacturen.filter(f => f.status === 'ingediend').length} ingediend</span>
          <span>{depotFacturen.filter(f => f.status === 'uitbetaald').length} uitbetaald</span>
        </div>
      </motion.div>
    </Link>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [depots, setDepots] = useState<Depot[]>([])
  const [facturen, setFacturen] = useState<Factuur[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email?: string; user_metadata?: { full_name?: string } } | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)

      const { data: depotData } = await supabase
        .from('depots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (depotData?.length) {
        const ids = depotData.map(d => d.id)
        const { data: factuurData } = await supabase
          .from('facturen')
          .select('*')
          .in('depot_id', ids)
        setFacturen(factuurData || [])
      }
      setDepots(depotData || [])
      setLoading(false)
    }
    load()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const totalBudget = depots.reduce((s, d) => s + d.totaal_bedrag, 0)
  const totalUitbetaald = facturen.filter(f => f.status === 'uitbetaald').reduce((s, f) => s + f.bedrag, 0)
  const urgentDepots = depots.filter(d => daysUntil(d.vervaldatum) <= 30 && daysUntil(d.vervaldatum) > 0)
  const openFacturen = facturen.filter(f => f.status === 'nieuw' || f.status === 'ingediend')

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
      <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>🏗️</div>
          <span className="font-bold text-white">Bouwdepot Tracker</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{user?.user_metadata?.full_name || user?.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" /> Uitloggen
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Urgent banner */}
        {urgentDepots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl mb-6 text-sm"
            style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', color: '#FB923C' }}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            ⚠️ {urgentDepots.length} depot{urgentDepots.length > 1 ? 's vervallen' : ' vervalt'} binnen 30 dagen! Claim je resterende budget.
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Totaal budget', value: formatMoney(totalBudget), icon: TrendingUp, color: '#3B82F6' },
            { label: 'Uitbetaald', value: formatMoney(totalUitbetaald), icon: TrendingUp, color: '#10B981' },
            { label: 'Resterend', value: formatMoney(Math.max(0, totalBudget - totalUitbetaald)), icon: TrendingUp, color: '#F97316' },
            { label: 'Open facturen', value: openFacturen.length.toString(), icon: FileText, color: '#8B5CF6' },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Header + new */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Mijn bouwdepots</h2>
          <Link href="/depot/nieuw">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{ background: '#F97316' }}>
              <Plus className="w-4 h-4" /> Nieuw depot
            </button>
          </Link>
        </div>

        {depots.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-white font-semibold mb-2">Nog geen bouwdepot</h3>
            <p className="text-gray-400 text-sm mb-6">Voeg je eerste bouwdepot toe om te beginnen</p>
            <Link href="/depot/nieuw">
              <button className="px-6 py-3 rounded-xl text-white font-medium" style={{ background: '#F97316' }}>
                Depot toevoegen
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {depots.map((depot) => (
              <DepotCard key={depot.id} depot={depot} facturen={facturen} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
