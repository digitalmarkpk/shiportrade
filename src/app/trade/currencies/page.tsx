import type { Metadata } from 'next';
import TradePageTemplate, { CategoryConfig } from '../TradePageTemplate';

export const metadata: Metadata = {
  title: 'Forex & Currency Exchange Rates - Live FX Rates | Shiportrade',
  description: 'Live foreign exchange rates for 50+ currency pairs including EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, and emerging market currencies. Real-time forex data with historical charts and price movements.',
  keywords: 'forex, currency exchange, foreign exchange, EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, currency rates, forex trading, FX rates, major pairs, cross pairs, emerging market currencies',
  authors: [{ name: 'Shiportrade' }],
  creator: 'Shiportrade',
  publisher: 'Shiportrade',
  robots: 'index, follow',
  openGraph: {
    title: 'Forex & Currency Exchange Rates - Live FX Rates | Shiportrade',
    description: 'Live foreign exchange rates for major currency pairs. Track EUR/USD, GBP/USD, USD/JPY, and more.',
    type: 'website',
    url: 'https://shiportrade.com/trade/currencies',
    siteName: 'Shiportrade',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forex & Currency Exchange Rates - Live FX | Shiportrade',
    description: 'Live forex rates for EUR/USD, GBP/USD, USD/JPY and more.',
    creator: '@shiportrade',
  },
  alternates: {
    canonical: 'https://shiportrade.com/trade/currencies',
  },
  category: 'finance',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Forex & Currency Exchange Rates',
  description: 'Live foreign exchange rates for major and emerging market currency pairs',
  url: 'https://shiportrade.com/trade/currencies',
  publisher: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

const currenciesConfig: CategoryConfig = {
  name: 'Currencies & Forex',
  description: 'Live foreign exchange rates for major and emerging market currency pairs',
  apiCategory: 'currencies',
  iconName: 'DollarSign',
  color: 'from-purple-500 to-violet-600',
  bgColor: 'bg-purple-50 dark:bg-purple-950/30',
  textColor: 'text-purple-600 dark:text-purple-400',
  filters: [
    { label: 'Major Pairs', value: 'major' },
    { label: 'Cross Pairs', value: 'cross' },
    { label: 'Emerging Markets', value: 'emerging' },
  ],
};

export default function CurrenciesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradePageTemplate config={currenciesConfig} />
    </>
  );
}
