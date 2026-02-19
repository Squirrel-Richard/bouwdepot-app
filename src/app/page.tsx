'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, AlertTriangle, TrendingUp, Clock, FileText, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const stats = [
  { value: '50.000+', label: 'actieve bouwdepots in NL' },
  { value: '14 dagen', label: 'gemiddelde uitbetalingsvertraging' },
  { value: '€8.000', label: 'gemiddeld onterecht verlopen' },
]

const features = [
  {
    icon: FileText,
    title: 'Facturen bijhouden',
    desc: 'Log elke factuur met bedrag, status en aanvrager. Zie in één oogopslag wat ingediend, uitbetaald of afgewezen is.',
    color: '#F97316',
  },
  {
    icon: TrendingUp,
    title: 'Budget overzicht',
    desc: 'Voortgangsbalk toont hoeveel van je depot al uitbetaald is en hoeveel je nog kunt claimen.',
    color: '#3B82F6',
  },
  {
    icon: Clock,
    title: 'Vervaldatum alert',
    desc: 'Je bouwdepot vervalt na 2 jaar. Wij herinneren je 90, 30 en 7 dagen van tevoren via email.',
    color: '#10B981',
  },
  {
    icon: Bell,
    title: 'Deadline meldingen',
    desc: 'Nooit meer vergeten wanneer je facturen moet indienen. Automatische reminders houden je op schema.',
    color: '#8B5CF6',
  },
]

const pricing = [
  {
    plan: 'Gratis',
    price: '€0',
    period: '/altijd',
    features: ['1 bouwdepot', 'Max 10 facturen', 'Budget overzicht', 'Vervaldatum tracking'],
    cta: 'Start gratis',
    primary: false,
  },
  {
    plan: 'Plus',
    price: '€9',
    period: '/maand',
    features: ['Onbeperkt depots', 'Onbeperkt facturen', 'Email alerts + reminders', 'PDF-factuur upload', 'Export rapportage'],
    cta: 'Start Plus',
    primary: true,
  },
  {
    plan: 'Pro',
    price: '€29',
    period: '/maand',
    features: ['Alles van Plus', 'Meerdere klanten (aannemers)', 'Klant-portal link', 'Prioriteit support'],
    cta: 'Start Pro',
    primary: false,
  },
]

const faqs = [
  {
    q: 'Wat is een bouwdepot?',
    a: 'Een bouwdepot is een speciaal gedeelte van je hypotheek dat gereserveerd is voor de verbouwing of nieuwbouw van je woning. Het geld staat apart bij je bank en wordt uitbetaald na het indienen van facturen.',
  },
  {
    q: 'Wanneer vervalt mijn bouwdepot?',
    a: 'De meeste bouwdepots hebben een looptijd van 2 jaar. Na afloop wordt het resterende bedrag verrekend met je hypotheek — je verliest dus rentemogelijkheden op het ongebruikte deel.',
  },
  {
    q: 'Hoe werkt het bijhouden van facturen?',
    a: 'Je maakt een depot aan met je totaalbedrag en looptijd. Daarna log je elke factuur die je bij je bank indient. Je ziet direct hoeveel budget je nog hebt en welke facturen nog uitbetaald moeten worden.',
  },
  {
    q: 'Werkt dit voor alle banken?',
    a: 'Ja! Je kunt kiezen uit ING, Rabobank, ABN AMRO of "Andere bank". Het systeem werkt onafhankelijk van je hypotheekverstrekker.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="font-medium text-white">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-400 text-sm leading-relaxed border-t border-white/10 pt-3">
          {a}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}>🏗️</div>
          <span className="font-bold text-white">Bouwdepot Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Inloggen</Link>
          <Link href="/register">
            <button className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105" style={{ background: '#F97316' }}>
              Gratis starten
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', color: '#F97316' }}>
            <AlertTriangle className="w-4 h-4" />
            Gemiddeld €8.000 verlopen per depot in NL
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Hou je bouwdepot bij.<br />
            <span style={{ color: '#F97316' }}>Mis geen euro.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Track facturen, budget en vervaldatum van je verbouwingshypotheek in één overzicht. 
            Automatische reminders zodat je nooit te laat bent.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(249,115,22,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl text-white font-semibold text-lg"
                style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
              >
                Gratis beginnen
              </motion.button>
            </Link>
            <Link href="#hoe-het-werkt" className="px-8 py-4 rounded-2xl text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all font-medium">
              Hoe het werkt
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mt-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-6 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: '#F97316' }}>{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="hoe-het-werkt" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Alles in één overzicht</h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">Stop met zoeken in emails en Excel-sheets. Bouwdepot Tracker houdt alles bij.</p>
        <div className="grid grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}20`, border: `1px solid ${f.color}30` }}>
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">In 3 stappen geregeld</h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Depot aanmaken', desc: 'Vul je bank, totaalbedrag, startdatum en vervaldatum in. Klaar in 30 seconden.' },
            { step: '2', title: 'Facturen loggen', desc: 'Voeg facturen toe zodra je ze bij de bank indient. Markeer ze als uitbetaald wanneer het geld binnenkomt.' },
            { step: '3', title: 'Op schema blijven', desc: 'Ontvang automatische reminders voor de vervaldatum en openstaande facturen.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4" style={{ background: 'rgba(249,115,22,0.15)', border: '2px solid rgba(249,115,22,0.3)', color: '#F97316' }}>
                {item.step}
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simpele prijzen</h2>
        <p className="text-gray-400 text-center mb-12">Gratis starten. Upgrade als je meer nodig hebt.</p>
        <div className="grid grid-cols-3 gap-6">
          {pricing.map((plan) => (
            <motion.div
              key={plan.plan}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl flex flex-col"
              style={{
                background: plan.primary ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.03)',
                border: plan.primary ? '1px solid rgba(249,115,22,0.3)' : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {plan.primary && (
                <div className="text-xs font-medium text-center px-3 py-1 rounded-full mb-3 self-start" style={{ background: 'rgba(249,115,22,0.2)', color: '#F97316' }}>
                  Meest gekozen
                </div>
              )}
              <div className="text-gray-400 text-sm mb-1">{plan.plan}</div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-500 text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 my-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#F97316' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <button
                  className="w-full py-3 rounded-xl font-medium transition-all"
                  style={{
                    background: plan.primary ? '#F97316' : 'rgba(255,255,255,0.05)',
                    color: 'white',
                    border: plan.primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {plan.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Veelgestelde vragen</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="p-12 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,88,12,0.05))', border: '1px solid rgba(249,115,22,0.2)' }}>
          <h2 className="text-4xl font-bold text-white mb-4">Klaar om te beginnen?</h2>
          <p className="text-gray-400 mb-8">Gratis account. Geen creditcard nodig. In 2 minuten ingesteld.</p>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(249,115,22,0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 rounded-2xl text-white font-semibold text-lg"
              style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)' }}
            >
              Gratis account aanmaken
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-gray-500 text-sm">
        <p>© 2026 Bouwdepot Tracker · Gemaakt in Nederland 🇳🇱</p>
      </footer>
    </div>
  )
}
