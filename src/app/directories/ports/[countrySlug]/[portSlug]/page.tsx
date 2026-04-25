import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCountries, getPorts, getPortBySlug, getPortsByCountryCode, getPortsBySubregion } from '@/utils/data-utils';
import PortPageClient from '@/components/directories/ports/PortPageClient';

interface Props {
  params: Promise<{ countrySlug: string; portSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug, portSlug } = await params;
  const port = await getPortBySlug(countrySlug, portSlug);
  
  if (!port) return { title: 'Port Not Found' };
  
  const isAirport = port.port_type === 'Airport';
  const isDryPort = port.port_type === 'Dry Port';
  const prefix = isAirport ? '' : isDryPort ? 'Dry Port of ' : 'Port of ';
  
  return {
    title: `${prefix}${port.name} (${port.unlocode}), ${port.country_name} – Complete Guide | Shiportrade`,
    description: `Access technical details for ${prefix}${port.name} (${port.unlocode}). Infrastructure specs, ${!isAirport ? port.max_depth_m + 'm depth, ' : ''}${(port.annual_teu / 1e6).toFixed(1)}M ${isAirport ? 'units' : 'TEU'} throughput, and coordinates in ${port.country_name}.`,
    keywords: `${port.name} ${port.port_type.toLowerCase()}, ${port.unlocode}, ${port.country_name} shipping, ${port.name} terminal, ${!isAirport ? 'port depth ' + port.max_depth_m + 'm' : 'airport info'}`,
    alternates: {
      canonical: `https://shiportrade.com/directories/ports/${port.country_slug}/${port.slug}`,
    },
    openGraph: {
      title: `${prefix}${port.name} (${port.unlocode}) | Shiportrade`,
      description: `Complete technical profile for ${prefix}${port.name} in ${port.country_name}. Essential data for global logistics and maritime shipping.`,
      images: [`https://flagcdn.com/w80/${port.country_code.toLowerCase()}.png`],
    }
  };
}

export async function generateStaticParams() {
  const ports = await getPorts();
  return ports.map((p) => ({
    countrySlug: p.country_slug,
    portSlug: p.slug,
  }));
}

export default async function PortDetailPage({ params }: Props) {
  const { countrySlug, portSlug } = await params;
  const port = await getPortBySlug(countrySlug, portSlug);
  
  if (!port) notFound();
  
  // Get other ports in the same country (up to 5)
  const countryPorts = await getPortsByCountryCode(port.country_code);
  const otherCountryPorts = countryPorts
    .filter(p => p.unlocode !== port.unlocode)
    .slice(0, 5);
  
  // Get nearby ports (mocking logic: same subregion)
  const subregionPorts = await getPortsBySubregion(port.subregion);
  const nearbyPorts = subregionPorts
    .filter(p => p.unlocode !== port.unlocode)
    .slice(0, 4);

  const isAirport = port.port_type === 'Airport';
  const isDryPort = port.port_type === 'Dry Port';
  const prefix = isAirport ? '' : isDryPort ? 'Dry Port of ' : 'Port of ';

  // JSON-LD for 'Place'
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${prefix}${port.name}`,
    "description": `${port.port_type} terminal in ${port.country_name} (${port.unlocode})`,
    "identifier": port.unlocode,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": port.country_code
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": port.latitude,
      "longitude": port.longitude
    },
    "url": `https://shiportrade.com/directories/ports/${port.country_slug}/${port.slug}`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortPageClient 
        port={port} 
        nearbyPorts={nearbyPorts}
        otherCountryPorts={otherCountryPorts}
      />
    </>
  );
}
