import { Metadata } from 'next';
import FreightForwardersClient from './client';

export const metadata: Metadata = {
  title: 'Freight Forwarders Directory | Global Logistics Partners | Shiportrade',
  description: 'Find trusted freight forwarders worldwide. Search by region, services, and certifications. Connect with verified logistics partners for your shipping needs.',
  keywords: ['freight forwarders', 'logistics partners', 'shipping agents', 'global freight', 'cargo forwarding', 'supply chain partners'],
  openGraph: {
    title: 'Freight Forwarders Directory | Shiportrade',
    description: 'Find trusted freight forwarders worldwide for your shipping and logistics needs.',
    type: 'website',
  },
};

export default function FreightForwardersPage() {
  return <FreightForwardersClient />;
}
