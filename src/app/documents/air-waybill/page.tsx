import { Metadata } from 'next';
import AirWaybillGenerator from '@/components/documents/AirWaybillGenerator';

export const metadata: Metadata = {
  title: 'Air Waybill Generator | IATA Standard AWB | Shiportrade',
  description: 'Generate IATA-standard Air Waybill documents for international air cargo shipments. Professional AWB creation with real-time preview and print functionality.',
  keywords: ['air waybill', 'AWB', 'air cargo document', 'IATA air waybill', 'air freight document'],
  openGraph: {
    title: 'Air Waybill Generator | Shiportrade',
    description: 'Generate professional Air Waybill documents for air cargo shipments.',
    type: 'website',
  },
};

export default function AirWaybillPage() {
  return <AirWaybillGenerator />;
}
