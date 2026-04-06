import type { Metadata } from 'next';
import TradePageTemplate, { CategoryConfig } from '../TradePageTemplate';

export const metadata: Metadata = {
  title: 'Earnings Calendar - Company Earnings Reports | Shiportrade',
  description: 'Upcoming and recent company earnings reports. Track earnings announcements, EPS forecasts, and actual results for major companies.',
  keywords: 'earnings calendar, earnings report, EPS, company earnings, quarterly earnings, earnings announcement',
  openGraph: {
    title: 'Earnings Calendar - Company Earnings Reports | Shiportrade',
    description: 'Upcoming and recent company earnings reports. Track earnings announcements, EPS forecasts, and actual results.',
    type: 'website',
    url: 'https://shiportrade.com/trade/earnings',
  },
};

const earningsConfig: CategoryConfig = {
  name: 'Earnings Calendar',
  description: 'Track upcoming and recent company earnings announcements',
  apiCategory: 'earnings',
  iconName: 'Calendar',
  color: 'from-orange-500 to-red-600',
  bgColor: 'bg-orange-50 dark:bg-orange-950/30',
  textColor: 'text-orange-600 dark:text-orange-400',
  filters: [
    { label: 'This Week', value: 'week' },
    { label: 'Next Week', value: 'nextweek' },
    { label: 'Beat Estimates', value: 'Beat' },
    { label: 'Missed Estimates', value: 'Miss' },
  ],
};

export default function EarningsPage() {
  return <TradePageTemplate config={earningsConfig} />;
}
