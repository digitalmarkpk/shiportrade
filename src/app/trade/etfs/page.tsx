import type { Metadata } from 'next';
import TradePageTemplate, { CategoryConfig } from '../TradePageTemplate';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'ETFs - Exchange Traded Funds Prices | Shiportrade',
  description: 'Real-time ETF prices for popular exchange-traded funds including SPY, QQQ, VTI, and more. Track ETF performance, expense ratios, and AUM data.',
  keywords: 'ETFs, exchange traded funds, SPY, QQQ, VTI, ETF prices, index funds, ETF trading',
  openGraph: {
    title: 'ETFs - Exchange Traded Funds Prices | Shiportrade',
    description: 'Real-time ETF prices for popular exchange-traded funds including SPY, QQQ, VTI, and more.',
    type: 'website',
    url: 'https://shiportrade.com/trade/etfs',
  },
};

const etfsConfig: CategoryConfig = {
  name: 'ETFs',
  description: 'Real-time prices for popular Exchange-Traded Funds',
  apiCategory: 'etfs',
  icon: 'Activity',
  color: 'from-indigo-500 to-purple-600',
  bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
  textColor: 'text-indigo-600 dark:text-indigo-400',
  filters: [
    { label: 'Large Cap', value: 'Large Cap' },
    { label: 'Technology', value: 'Technology' },
    { label: 'International', value: 'International' },
    { label: 'Bond', value: 'Bond' },
    { label: 'Sector', value: 'Sector' },
  ],
};

export default function ETFsPage() {
  return <TradePageTemplate config={etfsConfig} />;
}
