import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCountries, getCountryBySlug, getPortsByCountryCode, MinimalPort } from '@/utils/data-utils';
import CountryPageClient from '@/components/directories/ports/CountryPageClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  
  if (!country) return { title: 'Country Not Found' };
  
  return {
    title: `${country.name} Ports Directory | Sea Ports, UN/LOCODE, TEU & Depth | Shiportrade`,
    description: `Complete guide to ${country.name} ports. Technical details, annual TEU throughput, maximum depth, and UN/LOCODE for ${country.total_sea_ports} major commercial ports in ${country.name}.`,
    keywords: `${country.name} ports, ${country.name} sea ports, ${country.name} shipping, unlocode ${country.iso_alpha2}, container terminals ${country.name}`,
    alternates: {
      canonical: `https://shiportrade.com/directories/ports/country/${country.slug}`,
    },
    openGraph: {
      title: `${country.name} Ports Directory | Shiportrade`,
      description: `Explore ${country.total_sea_ports} major commercial ports in ${country.name}. Access technical infrastructure data and global trade connectivity.`,
      images: [country.flag_url],
    }
  };
}

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((c) => ({
    slug: c.slug,
  }));
}

export default async function CountryPortsPage({ params }: Props) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);
  
  if (!country) notFound();
  
  const allPorts = await getPortsByCountryCode(country.iso_alpha2);
  
  // Strip down port data to minimize payload size and avoid Vercel oversized ISR page error
  // We sort by annual_teu and take top 1000 for extremely large countries like US
  const ports: MinimalPort[] = (allPorts || [])
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
      annual_teu: p.annual_teu,
      max_depth_m: p.max_depth_m,
      latitude: p.latitude,
      longitude: p.longitude,
      timezone: p.timezone,
      harbor_size: p.harbor_size
    }));
  
  // JSON-LD for Country / ItemList of ports
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Ports in ${country.name}`,
    "description": `List of ${allPorts?.length || 0} major commercial ports in ${country.name}`,
    "numberOfItems": allPorts?.length || 0,
    "itemListElement": ports.slice(0, 10).map((p, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://shiportrade.com/directories/ports/${p.country_slug}/${p.slug}`,
      "name": p.name
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CountryPageClient 
        country={country} 
        ports={ports as any} 
      />
    </>
  );
}
