import React from 'react';
import { Metadata } from 'next';
import { getCountries, getPorts, getRegions } from '@/utils/data-utils';
import PortDirectoryClient from '@/components/directories/ports/PortDirectoryClient';

export const metadata: Metadata = {
  title: 'World Sea Ports Directory | 8,000+ Major Commercial Ports | Shiportrade',
  description: 'Comprehensive global ports list to find 8,000+ major sea ports worldwide. Access UN/LOCODE, technical details, TEU throughput, and depth for 190+ countries.',
  keywords: 'port directory, sea ports list, unlocode finder, container terminals, global logistics hubs, port depth, annual teu',
  openGraph: {
    title: 'World Sea Ports Directory | Shiportrade',
    description: 'Explore 8,000+ major commercial ports across 190+ countries. The most comprehensive global infrastructure database.',
    images: ['/canyon-banner.png'],
  }
};

export default async function PortsHubPage() {
  const [countries, ports, regions] = await Promise.all([
    getCountries(),
    getPorts(),
    getRegions()
  ]);

  return (
    <PortDirectoryClient 
      countries={countries} 
      ports={ports} 
      regions={regions} 
    />
  );
}
