import { Metadata } from 'next';
import AirCargoCarriersClient from './client';

export const metadata: Metadata = {
  title: 'Air Cargo Carriers Directory | Global Air Freight Partners | Shiportrade',
  description: 'Find global air cargo carriers for your freight needs. Compare airlines by capacity, routes, and services. Verified carriers with fleet information.',
  keywords: ['air cargo carriers', 'air freight', 'airlines', 'cargo airlines', 'air freight forwarders', 'express cargo'],
  openGraph: {
    title: 'Air Cargo Carriers Directory | Shiportrade',
    description: 'Connect with leading air cargo carriers worldwide for express and freight services.',
    type: 'website',
  },
};

export default function AirCargoCarriersPage() {
  return <AirCargoCarriersClient />;
}
