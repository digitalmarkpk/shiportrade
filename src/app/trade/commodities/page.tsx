import type { Metadata } from 'next';
import { CommoditiesClient } from './CommoditiesClient';

export const metadata: Metadata = {
  title: 'Commodities Market - Real-Time Prices for Oil, Gold, Silver & More | Shiportrade',
  description: 'Track real-time commodity prices for crude oil (WTI, Brent), natural gas, gold, silver, copper, agricultural products (corn, wheat, soybeans), livestock, and industrial materials. Comprehensive commodity futures and spot prices.',
  keywords: 'commodities, oil price, gold price, silver price, copper price, natural gas, crude oil WTI, Brent crude, commodity trading, agricultural commodities, metal prices, energy prices',
  authors: [{ name: 'Shiportrade' }],
  creator: 'Shiportrade',
  publisher: 'Shiportrade',
  robots: 'index, follow',
  openGraph: {
    title: 'Commodities Market - Real-Time Prices for Oil, Gold, Silver & More | Shiportrade',
    description: 'Track real-time commodity prices for crude oil, natural gas, gold, silver, copper, agricultural products, livestock, and industrial materials.',
    type: 'website',
    url: 'https://shiportrade.com/trade/commodities',
    siteName: 'Shiportrade',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commodities Market - Real-Time Prices | Shiportrade',
    description: 'Track real-time commodity prices for oil, gold, silver, and more.',
    creator: '@shiportrade',
  },
  alternates: {
    canonical: 'https://shiportrade.com/trade/commodities',
  },
  category: 'finance',
};

// JSON-LD Structured Data for Commodities
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Commodities Market - Real-Time Prices',
  description: 'Real-time commodity prices for energy, metals, agriculture, and industrial materials',
  url: 'https://shiportrade.com/trade/commodities',
  mainEntity: {
    '@type': 'ItemList',
    name: 'Commodities',
    description: 'List of traded commodities with real-time prices',
    numberOfItems: 200,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

export default function CommoditiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CommoditiesClient />
    </>
  );
}
