import React from 'react';
import { Metadata } from 'next';
import { getCountries, getPorts, getRegions, MinimalPort } from '@/utils/data-utils';
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
  const [countries, allPorts, regions] = await Promise.all([
    getCountries(),
    getPorts(),
    getRegions()
  ]);

  // Pre-calculate stats on server to avoid passing huge ports array
  const stats = {
    countries: countries.length,
    seaPorts: allPorts.filter(p => p.port_type === 'sea_port').length,
    airports: allPorts.filter(p => p.port_type === 'airport').length,
    dryPorts: allPorts.filter(p => ['dry_port', 'container_terminal', 'rail_terminal'].includes(p.port_type)).length
  };

  // Strip down and include top ports as MinimalPort to ensure the page size stays within limits
  // For the main hub, we only show top 1000 ports to keep the payload manageable
  const minimalPorts = allPorts
    .sort((a, b) => (b.annual_teu || 0) - (a.annual_teu || 0))
    .slice(0, 1000)
    .map(p => ({
    unlocode: p.unlocode,
    name: p.name,
    slug: p.slug,
    country_code: p.country_code,
    country_name: p.country_name,
    country_slug: p.country_slug,
    port_type: p.port_type,
    annual_teu: p.annual_teu || 0,
    max_depth_m: p.max_depth_m || 0,
    latitude: p.latitude || 0,
    longitude: p.longitude || 0,
    timezone: p.timezone || '',
  }));

  return (
    <PortDirectoryClient 
      countries={countries} 
      ports={minimalPorts as any} 
      regions={regions} 
      stats={stats}
    />
  );
}
