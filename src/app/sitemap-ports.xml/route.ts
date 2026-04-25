import { NextResponse } from 'next/server';
import { getCountries, getPorts } from '@/utils/data-utils';

export async function GET() {
  const baseUrl = 'https://shiportrade.com';
  
  const countries = await getCountries();
  const ports = await getPorts();
  
  const urls = [
    { loc: `${baseUrl}/directories/ports`, lastmod: new Date().toISOString(), priority: '1.0' },
  ];

  // Add country pages
  countries.forEach((country) => {
    urls.push({
      loc: `${baseUrl}/directories/ports/${country.slug}`,
      lastmod: new Date().toISOString(),
      priority: '0.8'
    });
  });

  // Add port pages
  ports.forEach((port) => {
    urls.push({
      loc: `${baseUrl}/directories/ports/${port.country_slug}/${port.slug}`,
      lastmod: new Date().toISOString(),
      priority: '0.6'
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
