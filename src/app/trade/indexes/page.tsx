import type { Metadata } from 'next';
import TradePageTemplate, { CategoryConfig } from '../TradePageTemplate';

export const metadata: Metadata = {
  title: 'Stock Market Indices - S&P 500, Dow Jones, NASDAQ, FTSE, DAX | Shiportrade',
  description: 'Track real-time global stock market indices including S&P 500, Dow Jones Industrial Average, NASDAQ Composite, FTSE 100, DAX 40, Nikkei 225, Hang Seng, and 100+ international indices. Comprehensive market performance data.',
  keywords: 'stock indices, S&P 500, Dow Jones, NASDAQ, FTSE 100, DAX, Nikkei 225, Hang Seng, market index, stock market, SPX, DJI, IXIC, global indices, market performance',
  authors: [{ name: 'Shiportrade' }],
  creator: 'Shiportrade',
  publisher: 'Shiportrade',
  robots: 'index, follow',
  openGraph: {
    title: 'Stock Market Indices - S&P 500, Dow Jones, NASDAQ | Shiportrade',
    description: 'Track global stock market indices including S&P 500, Dow Jones, NASDAQ, FTSE 100, DAX, Nikkei, and more.',
    type: 'website',
    url: 'https://shiportrade.com/trade/indexes',
    siteName: 'Shiportrade',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stock Market Indices - Real-Time Global Index Data | Shiportrade',
    description: 'Track S&P 500, Dow Jones, NASDAQ, and global indices.',
    creator: '@shiportrade',
  },
  alternates: {
    canonical: 'https://shiportrade.com/trade/indexes',
  },
  category: 'finance',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Stock Market Indices - Real-Time Data',
  description: 'Real-time stock market index data from major global exchanges',
  url: 'https://shiportrade.com/trade/indexes',
  publisher: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

const indexesConfig: CategoryConfig = {
  name: 'Stock Market Indices',
  description: 'Global stock market indices from major exchanges worldwide',
  apiCategory: 'indexes',
  iconName: 'TrendingUp',
  color: 'from-blue-500 to-indigo-600',
  bgColor: 'bg-blue-50 dark:bg-blue-950/30',
  textColor: 'text-blue-600 dark:text-blue-400',
  filters: [
    { label: 'Americas', value: 'americas' },
    { label: 'Europe', value: 'europe' },
    { label: 'Asia Pacific', value: 'asia' },
    { label: 'Middle East', value: 'middleEast' },
    { label: 'Africa', value: 'africa' },
    { label: 'Oceania', value: 'oceania' },
  ],
};

export default function IndexesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradePageTemplate config={indexesConfig} />
    </>
  );
}
