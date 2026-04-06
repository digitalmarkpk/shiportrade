import type { Metadata } from 'next';
import TradePageTemplate, { CategoryConfig } from '../TradePageTemplate';

export const metadata: Metadata = {
  title: 'Cryptocurrency Prices - Bitcoin, Ethereum, Solana & More | Shiportrade',
  description: 'Live cryptocurrency prices for Bitcoin (BTC), Ethereum (ETH), Solana (SOL), XRP, BNB, Cardano, Dogecoin, and 30+ major cryptocurrencies. Real-time crypto market data with price charts and market cap.',
  keywords: 'cryptocurrency, Bitcoin, Ethereum, crypto prices, BTC, ETH, SOL, XRP, BNB, ADA, DOGE, Solana, Cardano, cryptocurrency trading, crypto market cap, DeFi, Layer 1, Layer 2',
  authors: [{ name: 'Shiportrade' }],
  creator: 'Shiportrade',
  publisher: 'Shiportrade',
  robots: 'index, follow',
  openGraph: {
    title: 'Cryptocurrency Prices - Bitcoin, Ethereum & More | Shiportrade',
    description: 'Live cryptocurrency prices for Bitcoin, Ethereum, Solana, XRP, and other major cryptocurrencies.',
    type: 'website',
    url: 'https://shiportrade.com/trade/crypto',
    siteName: 'Shiportrade',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cryptocurrency Prices - Bitcoin, Ethereum, Solana | Shiportrade',
    description: 'Live crypto prices for BTC, ETH, SOL and 30+ cryptocurrencies.',
    creator: '@shiportrade',
  },
  alternates: {
    canonical: 'https://shiportrade.com/trade/crypto',
  },
  category: 'finance',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Cryptocurrency Prices - Real-Time Crypto Data',
  description: 'Real-time cryptocurrency prices for Bitcoin, Ethereum, and major digital assets',
  url: 'https://shiportrade.com/trade/crypto',
  publisher: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

const cryptoConfig: CategoryConfig = {
  name: 'Cryptocurrency',
  description: 'Real-time prices for Bitcoin, Ethereum, and other major cryptocurrencies',
  apiCategory: 'crypto',
  iconName: 'Bitcoin',
  color: 'from-cyan-500 to-sky-600',
  bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
  textColor: 'text-cyan-600 dark:text-cyan-400',
  filters: [
    { label: 'Top 10', value: 'bitcoin' },
    { label: 'DeFi', value: 'uniswap' },
    { label: 'Layer 1', value: 'ethereum' },
    { label: 'Layer 2', value: 'arbitrum' },
  ],
};

export default function CryptoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradePageTemplate config={cryptoConfig} />
    </>
  );
}
