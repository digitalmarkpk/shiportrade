import type { Metadata } from 'next';
import TradePageTemplate, { CategoryConfig } from '../TradePageTemplate';

export const metadata: Metadata = {
  title: 'Stocks & Shares - Real-Time Stock Prices for Top Companies | Shiportrade',
  description: 'Track real-time stock prices for 150+ major companies including Apple (AAPL), Microsoft (MSFT), Amazon (AMZN), Google (GOOGL), Tesla (TSLA), NVIDIA (NVDA), and more. Comprehensive stock market data with price charts.',
  keywords: 'stocks, shares, stock market, AAPL, MSFT, AMZN, GOOGL, TSLA, NVDA, META, stock prices, stock trading, NYSE, NASDAQ, technology stocks, healthcare stocks, financial stocks',
  authors: [{ name: 'Shiportrade' }],
  creator: 'Shiportrade',
  publisher: 'Shiportrade',
  robots: 'index, follow',
  openGraph: {
    title: 'Stocks & Shares - Real-Time Stock Prices for Top Companies | Shiportrade',
    description: 'Real-time stock prices for top companies including Apple, Microsoft, Amazon, Google, Tesla, and more.',
    type: 'website',
    url: 'https://shiportrade.com/trade/shares',
    siteName: 'Shiportrade',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stocks & Shares - Real-Time Stock Prices | Shiportrade',
    description: 'Track stock prices for Apple, Microsoft, Amazon, Google, Tesla, and more.',
    creator: '@shiportrade',
  },
  alternates: {
    canonical: 'https://shiportrade.com/trade/shares',
  },
  category: 'finance',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Stocks & Shares - Real-Time Stock Prices',
  description: 'Real-time stock prices for major US and international companies',
  url: 'https://shiportrade.com/trade/shares',
  publisher: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

const sharesConfig: CategoryConfig = {
  name: 'Stocks & Shares',
  description: 'Real-time stock prices for major US and international companies',
  apiCategory: 'shares',
  iconName: 'PieChart',
  color: 'from-emerald-500 to-teal-600',
  bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
  textColor: 'text-emerald-600 dark:text-emerald-400',
  filters: [
    { label: 'Technology', value: 'technology' },
    { label: 'Healthcare', value: 'healthcare' },
    { label: 'Financial', value: 'financial' },
    { label: 'Energy', value: 'energy' },
    { label: 'Consumer', value: 'consumer' },
    { label: 'Industrial', value: 'industrial' },
  ],
};

export default function SharesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradePageTemplate config={sharesConfig} />
    </>
  );
}
