import { Metadata } from 'next';
import { SmartHSCodeSearch } from '@/components/tools/SmartHSCodeSearch';

export const metadata: Metadata = {
  title: 'HS Code Search - Find HS Codes by Commodity or Code | Shiportrade',
  description: 'Free HS Code lookup tool. Search by HS code number to find commodity description, or search by product name to find the correct HS code. Based on WCO Harmonized System 2022. Covers 97 chapters and 500+ HS codes for international trade classification.',
  keywords: [
    'HS code search',
    'HS code lookup',
    'harmonized system code',
    'customs tariff code',
    'import export code',
    'WCO HS code',
    'commodity code finder',
    'trade classification',
    'customs classification',
    'HS code by product',
    'find HS code',
    'tariff code search',
    'international trade codes',
  ],
  openGraph: {
    title: 'HS Code Search - Bidirectional Lookup Tool | Shiportrade',
    description: 'Search HS codes by code number or commodity name. Free tool for international trade professionals. Based on WCO Harmonized System 2022.',
    type: 'website',
    url: 'https://shiportrade.com/tools/hs-code-search',
  },
  alternates: {
    canonical: 'https://shiportrade.com/tools/hs-code-search',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD Structured Data for SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'HS Code Search Tool',
  description: 'Free bidirectional HS code lookup tool. Search by HS code number to find commodity description, or search by product name to find the correct HS code.',
  url: 'https://shiportrade.com/tools/hs-code-search',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  creator: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

export default function HSCodeSearchPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header with SEO-friendly H1 */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent mb-4">
              HS Code Search Tool
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Find HS codes by commodity name or search by code number. Based on WCO Harmonized System 2022.
              Covers all 97 chapters for international trade classification.
            </p>
          </header>

          {/* Smart Search Component */}
          <SmartHSCodeSearch />

          {/* SEO Content Section */}
          <section className="mt-12 grid md:grid-cols-2 gap-6">
            <article className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">What is an HS Code?</h2>
              <p className="text-slate-600 dark:text-slate-400">
                The Harmonized System (HS) Code is a standardized numerical method of classifying traded products
                developed by the World Customs Organization (WCO). It is used by customs authorities worldwide
                to identify products for assessing duties and taxes, gathering statistics, and monitoring trade flows.
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-4">
                The HS system comprises approximately 5,000 commodity groups, each identified by a six-digit code.
                The first two digits identify the chapter, the next two identify the heading, and the last two
                identify the subheading. Countries may add additional digits for further classification.
              </p>
            </article>

            <article className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">How to Use This Tool</h2>
              <ul className="text-slate-600 dark:text-slate-400 space-y-2">
                <li>
                  <strong>Search by Code:</strong> Enter a partial or complete HS code (e.g., &quot;1006&quot; for rice)
                  to find the commodity description and related codes.
                </li>
                <li>
                  <strong>Search by Commodity:</strong> Enter a product name (e.g., &quot;cotton&quot;, &quot;steel&quot;, &quot;coffee&quot;)
                  to find the corresponding HS codes.
                </li>
                <li>
                  <strong>Browse Chapters:</strong> Click on any chapter to explore all HS codes within that category.
                </li>
                <li>
                  <strong>Copy Codes:</strong> Click the copy button to quickly copy HS codes to your clipboard.
                </li>
              </ul>
            </article>
          </section>

          {/* Popular HS Code Chapters for SEO */}
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Popular HS Code Categories</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { chapter: '10', name: 'Cereals', codes: '1001-1008', desc: 'Wheat, rice, maize, barley, oats' },
                { chapter: '27', name: 'Mineral Fuels', codes: '2701-2715', desc: 'Coal, petroleum, natural gas' },
                { chapter: '39', name: 'Plastics', codes: '3901-3926', desc: 'Polymers, plastic articles' },
                { chapter: '72', name: 'Iron & Steel', codes: '7201-7229', desc: 'Steel products, alloys' },
                { chapter: '84', name: 'Machinery', codes: '8401-8487', desc: 'Mechanical appliances, computers' },
                { chapter: '85', name: 'Electrical', codes: '8501-8549', desc: 'Electronics, circuits, phones' },
                { chapter: '87', name: 'Vehicles', codes: '8701-8716', desc: 'Cars, trucks, motorcycles' },
                { chapter: '90', name: 'Instruments', codes: '9001-9033', desc: 'Optical, medical devices' },
              ].map((item) => (
                <div
                  key={item.chapter}
                  className="p-3 bg-white dark:bg-slate-800 rounded-lg border hover:border-blue-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-blue-600">Chapter {item.chapter}</span>
                    <span className="text-xs text-muted-foreground">{item.codes}</span>
                  </div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
