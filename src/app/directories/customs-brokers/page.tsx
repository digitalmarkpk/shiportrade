import { Metadata } from 'next';
import CustomsBrokersClient from './client';

export const metadata: Metadata = {
  title: 'Customs Brokers Directory | Licensed Trade Compliance Experts | Shiportrade',
  description: 'Find licensed customs brokers worldwide. Expert trade compliance, tariff classification, and customs clearance services. Verified professionals across 50+ countries.',
  keywords: ['customs brokers', 'customs clearance', 'trade compliance', 'tariff classification', 'import broker', 'export documentation', 'licensed customs broker'],
  openGraph: {
    title: 'Customs Brokers Directory | Shiportrade',
    description: 'Connect with licensed customs brokers for seamless trade compliance and clearance.',
    type: 'website',
  },
};

export default function CustomsBrokersPage() {
  return <CustomsBrokersClient />;
}
