import type { Metadata } from 'next';
import TradePageTemplate, { CategoryConfig } from '../TradePageTemplate';

export const metadata: Metadata = {
  title: 'Government Bond Yields - US Treasury, Bunds, Gilts, JGBs | Shiportrade',
  description: 'Track real-time government bond yields for US Treasury (2Y, 5Y, 10Y, 30Y), German Bunds, UK Gilts, Japanese JGBs, and sovereign bonds from 20+ countries. Monitor global fixed income markets and yield curves.',
  keywords: 'bond yields, US Treasury, government bonds, 10 year treasury, 2 year treasury, Bund, Gilt, JGB, bond market, treasury yields, yield curve, sovereign bonds, fixed income, interest rates',
  authors: [{ name: 'Shiportrade' }],
  creator: 'Shiportrade',
  publisher: 'Shiportrade',
  robots: 'index, follow',
  openGraph: {
    title: 'Government Bond Yields - US Treasury, Bunds, Gilts, JGBs | Shiportrade',
    description: 'Track government bond yields for US Treasury, German Bunds, UK Gilts, Japanese JGBs, and other sovereign bonds.',
    type: 'website',
    url: 'https://shiportrade.com/trade/bonds',
    siteName: 'Shiportrade',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Bond Yields - US Treasury & Global Bonds | Shiportrade',
    description: 'Track US Treasury yields, German Bunds, UK Gilts, and global sovereign bonds.',
    creator: '@shiportrade',
  },
  alternates: {
    canonical: 'https://shiportrade.com/trade/bonds',
  },
  category: 'finance',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Government Bond Yields - Real-Time Fixed Income Data',
  description: 'Real-time government bond yields from major economies worldwide',
  url: 'https://shiportrade.com/trade/bonds',
  publisher: {
    '@type': 'Organization',
    name: 'Shiportrade',
    url: 'https://shiportrade.com',
  },
};

const bondsConfig: CategoryConfig = {
  name: 'Government Bonds',
  description: 'Track government bond yields from major economies worldwide',
  apiCategory: 'bonds',
  iconName: 'Landmark',
  color: 'from-rose-500 to-pink-600',
  bgColor: 'bg-rose-50 dark:bg-rose-950/30',
  textColor: 'text-rose-600 dark:text-rose-400',
  filters: [
    { label: 'United States', value: 'USA' },
    { label: 'Europe', value: 'Germany' },
    { label: 'Asia Pacific', value: 'Japan' },
    { label: 'Americas', value: 'Canada' },
    { label: 'Emerging Markets', value: 'Brazil' },
  ],
};

export default function BondsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradePageTemplate config={bondsConfig} />
    </>
  );
}
