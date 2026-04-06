import { Metadata } from 'next';
import SalesContractGenerator from '@/components/documents/SalesContractGenerator';

export const metadata: Metadata = {
  title: 'Sales Contract Generator | Shiportrade',
  description: 'Generate professional international sales contracts for global trade transactions.',
};

export default function SalesContractPage() {
  return <SalesContractGenerator />;
}
