import { Metadata } from 'next';
import AirWaybillGenerator from '@/components/documents/AirWaybillGenerator';

export const metadata: Metadata = {
  title: 'Air Waybill Generator | Shiportrade',
  description: 'Generate professional air waybill documents for air freight shipments.',
};

export default function AirWaybillPage() {
  return <AirWaybillGenerator />;
}
