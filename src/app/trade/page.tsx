import type { Metadata } from 'next';
import TradeClient from './TradeClient';

export const metadata: Metadata = {
  title: 'Trade - Real-Time Global Market Data & Trading Platform | Shiportrade',
  description: 'Access comprehensive real-time market data for 500+ commodities, stock indices, currencies, cryptocurrencies, bonds, and freight indices. Professional trading intelligence platform with live quotes, charts, and analytics.',
  keywords: 'trade, commodities, stocks, indexes, currencies, forex, crypto, bonds, freight index, market data, trading, real-time quotes, oil price, gold price, bitcoin price, S&P 500, forex rates, market analysis',
  authors: [{ name: 'Shiportrade' }],
  creator: 'Shiportrade',
  publisher: 'Shiportrade',
  robots: 'index, follow',
  openGraph: {
    title: 'Trade - Real-Time Global Market Data & Trading Platform | Shiportrade',
    description: 'Access comprehensive real-time market data for 500+ commodities, stock indices, currencies, cryptocurrencies, bonds, and freight indices.',
    type: 'website',
    url: 'https://shiportrade.com/trade',
    siteName: 'Shiportrade',
    locale: 'en_US',
    images: [
      {
        url: '/og-trade.png',
        width: 1200,
        height: 630,
        alt: 'Shiportrade Trading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trade - Real-Time Global Market Data | Shiportrade',
    description: 'Access comprehensive real-time market data for commodities, stocks, currencies, crypto, and more.',
    images: ['/og-trade.png'],
    creator: '@shiportrade',
  },
  alternates: {
    canonical: 'https://shiportrade.com/trade',
  },
  category: 'finance',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Shiportrade Trade Platform',
  description: 'Real-time global market data and trading intelligence platform',
  url: 'https://shiportrade.com/trade',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

export default function TradePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradeClient />
    </>
  );
}
