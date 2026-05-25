import { MetadataRoute } from 'next'
import { toolCategories, documentCategories } from '@/lib/constants/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.shiportrade.com'
  const urls: MetadataRoute.Sitemap = []

  // 1. Static Pages
  const staticPages = ['', '/about', '/contact', '/tools', '/documents', '/modules', '/directories', '/trade', '/pricing']
  staticPages.forEach(page => {
    urls.push({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: page === '' ? 1 : 0.8,
    })
  })

  // 2. Dynamic Tools (Working Modules Only)
  const workingModules = [
    "international-trade", "ocean-freight", "air-freight", "road-rail",
    "customs-compliance", "warehousing", "ecommerce", "insurance",
    "sustainability", "project-cargo", "blockchain-digital-supply-chain",
    "financial-payment", "logistics-planning", "inventory-management"
  ];

  toolCategories.forEach(category => {
    if (!workingModules.includes(category.slug)) return;

    // Add Module Main Page
    urls.push({
      url: `${baseUrl}/tools/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    // Add Tools inside Module
    category.tools.forEach(tool => {
      urls.push({
        url: `${baseUrl}/tools/${category.slug}/${tool.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })
  })

  // 3. Dynamic Documents
  documentCategories.forEach(category => {
    category.documents.forEach(doc => {
      urls.push({
        url: `${baseUrl}/documents/${category.slug}/${doc.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  })

  return urls
}