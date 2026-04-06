import { Metadata } from 'next';
import QuantumAISearchEngine from '@/components/ai-search/QuantumAISearchEngine';

export const metadata: Metadata = {
  title: 'Quantum AI Search & Insight Engine | Shiportrade',
  description: 'Revolutionary AI-powered search engine for global supply chain intelligence. Real-time predictive analytics, visual insights, and actionable recommendations for shipping, trade, and logistics.',
  keywords: [
    'AI search engine', 'supply chain intelligence', 'shipping analytics', 'trade insights',
    'freight rate prediction', 'port congestion', 'container tracking', 'logistics AI',
    'maritime intelligence', 'global trade analytics', 'predictive shipping', 'cargo insights',
    'vessel tracking', 'port analytics', 'freight forwarding intelligence', 'trade finance AI',
    'customs analytics', 'supply chain visibility', 'real-time shipping data', 'trade route optimization'
  ],
  openGraph: {
    title: 'Quantum AI Search & Insight Engine | Shiportrade',
    description: 'Revolutionary AI-powered search engine delivering unprecedented intelligence across global shipping, trade, and logistics ecosystems.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantum AI Search & Insight Engine | Shiportrade',
    description: 'Revolutionary AI-powered search engine for global supply chain intelligence.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/tools/ai-search',
  },
};

export default function AISearchPage() {
  return <QuantumAISearchEngine />;
}
