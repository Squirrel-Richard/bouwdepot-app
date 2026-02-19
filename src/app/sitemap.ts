import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://bouwdepot-app.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://bouwdepot-app.vercel.app/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://bouwdepot-app.vercel.app/register', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
