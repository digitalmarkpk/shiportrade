import { NextResponse } from 'next/server';
import portsData from '../../../public/data/ports-main.json';
import countriesData from '../../../public/data/countries-info.json';
import { slugify } from '@/utils/slugify';

export async function GET() {
  const baseUrl = 'https://shiportrade.com';
  
  const urls = [
    { loc: `${baseUrl}/directories/ports`, lastmod: new Date().toISOString() },
  ];

  // Add country pages
  countriesData.forEach((country) => {
    urls.push({
      loc: `${baseUrl}/directories/ports/country/${slugify(country.name)}`,
      lastmod: new Date().toISOString(),
    });
  });

  // Add port pages
  portsData.forEach((port) => {
    const country = countriesData.find(c => c.country_code === port.country_code);
    if (country) {
      const countrySlug = slugify(country.name);
      const portSlug = `${slugify(port.name.replace('Port of ', ''))}-${port.unlocode.toLowerCase()}`;
      urls.push({
        loc: `${baseUrl}/directories/ports/${countrySlug}/${portSlug}`,
        lastmod: new Date().toISOString(),
      });
    }
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
    <priority>${url.loc.endsWith('/ports') ? '1.0' : url.loc.includes('/country/') ? '0.8' : '0.6'}</priority>
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
