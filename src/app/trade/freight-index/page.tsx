import type { Metadata } from 'next';
import TradePageTemplate, { CategoryConfig } from '../TradePageTemplate';

export const metadata: Metadata = {
  title: 'Freight Index Tracker - BDI, FBX, SCFI, Container & Tanker Rates | Shiportrade',
  description: 'Track real-time freight shipping indices including Baltic Dry Index (BDI), FBX Global Container Index, Shanghai SCFI, World Container Index (WCI), tanker rates, and LNG shipping rates. Monitor global shipping costs across dry bulk, container, and tanker markets.',
  keywords: 'freight index, Baltic Dry Index, BDI, FBX, SCFI, shipping rates, container shipping, freight rates, tanker rates, VLCC, dry bulk, container index, shipping costs, freight market, Baltic Exchange',
  authors: [{ name: 'Shiportrade' }],
  creator: 'Shiportrade',
  publisher: 'Shiportrade',
  robots: 'index, follow',
  openGraph: {
    title: 'Freight Index Tracker - BDI, FBX, SCFI Shipping Rates | Shiportrade',
    description: 'Track freight shipping indices including Baltic Dry Index (BDI), FBX Container Index, SCFI, WCI, and tanker rates.',
    type: 'website',
    url: 'https://shiportrade.com/trade/freight-index',
    siteName: 'Shiportrade',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freight Index Tracker - BDI, Container & Tanker Rates | Shiportrade',
    description: 'Track Baltic Dry Index, container rates, and tanker shipping costs.',
    creator: '@shiportrade',
  },
  alternates: {
    canonical: 'https://shiportrade.com/trade/freight-index',
  },
  category: 'finance',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Freight Index Tracker - Global Shipping Rates',
  description: 'Real-time freight shipping indices for dry bulk, container, and tanker markets',
  url: 'https://shiportrade.com/trade/freight-index',
  publisher: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

const freightConfig: CategoryConfig = {
  name: 'Freight Index Tracker',
  description: 'Monitor global shipping rates with Baltic Dry Index, container indices, and tanker rates',
  apiCategory: 'freight',
  iconName: 'Ship',
  color: 'from-sky-500 to-blue-600',
  bgColor: 'bg-sky-50 dark:bg-sky-950/30',
  textColor: 'text-sky-600 dark:text-sky-400',
  filters: [
    { label: 'Dry Bulk', value: 'Dry Bulk' },
    { label: 'Container', value: 'Container' },
    { label: 'Tanker', value: 'Tanker' },
    { label: 'Gas', value: 'Gas' },
    { label: 'Earnings', value: 'Earnings' },
  ],
};

export default function FreightIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradePageTemplate config={freightConfig} />
    </>
  );
}
