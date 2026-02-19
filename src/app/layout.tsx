import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://bouwdepot-app.vercel.app'),
  title: {
    default: 'Bouwdepot Tracker | Bijhouden facturen en budget',
    template: '%s — Bouwdepot Tracker',
  },
  description: 'Beheer je bouwdepot overzichtelijk. Track facturen, budget en vervaldatum van je verbouwingshypotheek. Nooit meer onterecht verlopen depot.',
  keywords: ['bouwdepot bijhouden', 'bouwdepot facturen', 'verbouwing hypotheek depot', 'bouwdepot calculator', 'bouwdepot app', 'verbouwing budget', 'hypotheek bouwdepot'],
  authors: [{ name: 'Bouwdepot Tracker' }],
  creator: 'Bouwdepot Tracker',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://bouwdepot-app.vercel.app',
    siteName: 'Bouwdepot Tracker',
    title: 'Bouwdepot Tracker — Nooit meer een euro missen',
    description: 'Bijhouden welke facturen zijn uitbetaald, hoeveel budget je nog hebt, en wanneer je depot vervalt. Voor alle NL hypotheekhouders met bouwdepot.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Bouwdepot Tracker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bouwdepot Tracker — Nooit meer een euro missen',
    description: 'Track je bouwdepot facturen, budget en vervaldatum in één overzicht.',
  },
  robots: { index: true, follow: true },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Bouwdepot Tracker',
  url: 'https://bouwdepot-app.vercel.app',
  description: 'App om je bouwdepot bij te houden',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  inLanguage: 'nl-NL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
