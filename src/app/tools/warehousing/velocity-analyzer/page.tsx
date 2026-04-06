import InventoryVelocityAnalyzer from '@/components/tools/InventoryVelocityAnalyzer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventory Velocity Analyzer | Shiportrade.com',
  description: 'Analyze SKU velocity, identify slow and fast-moving items, calculate turnover rates, and optimize inventory management with our comprehensive velocity analysis tool.',
  keywords: ['inventory velocity', 'SKU analysis', 'turnover rate', 'slow moving items', 'fast moving items', 'reorder suggestions', 'warehouse management'],
};

export default function VelocityAnalyzerPage() {
  return <InventoryVelocityAnalyzer />;
}
