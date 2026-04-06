import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shiportrade.com'

  // Yahan apni website ke important pages add karein
  const routes = [
    '',
    '/tools',
    '/about',
    '/contact',
    '/documents',
    '/documents/pro-forma-invoice',
    '/documents/international-trade/proforma-invoice',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
