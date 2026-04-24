import React from 'react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { Anchor, MapPin, Globe, Clock, Ship, Maximize2, ChevronRight, ExternalLink, Calculator } from 'lucide-react';
import { slugify } from '@/utils/slugify';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import countriesData from '../../../../public/data/countries-info.json';
import portsData from '../../../../public/data/ports-main.json';

import { Metadata } from 'next';

const GlobalPortsMap = nextDynamic(() => import('@/components/GlobalPortsMap'), { ssr: false });

export async function generateMetadata({ params }: { params: { countrySlug: string; portSlug: string } }): Promise<Metadata> {
  const { portSlug } = params;
  const port = portsData.find(p => {
    const slug = `${slugify(p.name.replace('Port of ', ''))}-${p.unlocode.toLowerCase()}`;
    return slug === portSlug;
  });

  if (!port) {
    return {
      title: 'Port Not Found | Shiportrade',
    };
  }

  const title = `${port.name} (${port.unlocode}), ${port.country_name} - Port Details | Shiportrade`;
  const description = `Complete information about ${port.name} including location, UN/LOCODE, facilities, and shipping details. Handles ${port.annual_teu.toLocaleString()} TEU annually.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const params: { countrySlug: string; portSlug: string }[] = [];
  
  portsData.forEach((port) => {
    const country = countriesData.find(c => c.country_code === port.country_code);
    if (country) {
      params.push({
        countrySlug: slugify(country.name),
        portSlug: `${slugify(port.name.replace('Port of ', ''))}-${port.unlocode.toLowerCase()}`,
      });
    }
  });
  
  return params;
}

export default function PortDetailPage({ params }: { params: { countrySlug: string; portSlug: string } }) {
  const { countrySlug, portSlug } = params;
  
  const port = portsData.find(p => {
    const slug = `${slugify(p.name.replace('Port of ', ''))}-${p.unlocode.toLowerCase()}`;
    return slug === portSlug;
  });

  if (!port) return <div>Port not found</div>;

  const country = countriesData.find(c => c.country_code === port.country_code);
  const otherPorts = portsData.filter(p => p.country_code === port.country_code && p.unlocode !== port.unlocode).slice(0, 3);

  // SEO Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": port.name,
    "description": `${port.name} (${port.unlocode}) is a major ${port.port_type} located in ${port.country_name}. It handles an annual throughput of ${port.annual_teu.toLocaleString()} TEU with a maximum depth of ${port.max_depth_m}m.`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": port.country_code
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": port.latitude,
      "longitude": port.longitude
    },
    "url": `https://shiportrade.com/directories/ports/${countrySlug}/${portSlug}`
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-[14px] text-slate-500">
            <Link href="/" className="hover:text-[#0F4C81]">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/directories/ports" className="hover:text-[#0F4C81]">Ports</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/directories/ports/country/${countrySlug}`} className="hover:text-[#0F4C81]">{port.country_name}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">{port.name.replace('Port of ', '')}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-[30px] font-bold text-slate-900 mb-2">
            {port.name} ({port.unlocode}), {port.country_name} - Complete Guide
          </h1>
          <p className="text-[16px] text-slate-500 max-w-4xl">
            Detailed information about {port.name} including UN/LOCODE, coordinates, facilities, and annual container throughput.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (70%) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Key Facts Table */}
            <Card className="overflow-hidden border-[#e2e8f0]">
              <div className="bg-slate-50 px-6 py-4 border-b border-[#e2e8f0]">
                <h2 className="text-[24px] font-bold text-slate-900">Key Facts & Specifications</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {[
                  { label: "UN/LOCODE", value: port.unlocode, icon: Anchor },
                  { label: "Coordinates", value: `${port.latitude.toFixed(4)}°N, ${port.longitude.toFixed(4)}°E`, icon: MapPin },
                  { label: "Port Type", value: port.port_type, icon: Ship },
                  { label: "Max Depth", value: `${port.max_depth_m} meters`, icon: Maximize2 },
                  { label: "Annual TEU", value: port.annual_teu > 0 ? port.annual_teu.toLocaleString() : "N/A", icon: Globe },
                  { label: "Timezone", value: port.timezone, icon: Clock },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 p-6 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 4 ? 'border-b' : ''} border-[#e2e8f0]`}>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0F4C81]">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[14px] text-slate-400 uppercase font-bold tracking-wider">{item.label}</p>
                      <p className="text-[16px] font-semibold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Map Section */}
            <div className="space-y-4">
              <h2 className="text-[24px] font-bold text-slate-900">Location Map</h2>
              <div className="h-[400px] rounded-xl overflow-hidden border border-[#e2e8f0] shadow-sm">
                <GlobalPortsMap 
                  ports={[port]} 
                  selectedId={port.unlocode} 
                  height="100%" 
                  maxMarkers={1} 
                />
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none">
              <h2 className="text-[24px] font-bold text-slate-900 mb-4">About {port.name}</h2>
              <p className="text-[16px] text-slate-600 leading-relaxed">
                {port.name} (UN/LOCODE: {port.unlocode}) is a critical maritime infrastructure located in {port.country_name}, specifically in the {port.region} region. 
                As a {port.port_type.toLowerCase()}, it serves as a vital gateway for international trade, facilitating the movement of goods across global supply chains. 
                The port maintains a maximum depth of {port.max_depth_m} meters, allowing it to accommodate a wide range of commercial vessels. 
                With an annual container throughput of approximately {port.annual_teu.toLocaleString()} TEU, it stands as one of the major commercial hubs in the region. 
                The facility operates within the {port.timezone} timezone and continues to play a pivotal role in the economic development of {port.country_name}.
              </p>
            </div>

            {/* Terminal Info & Services (New Section) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-[#e2e8f0]">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4">Terminal Services</h3>
                <ul className="space-y-3 text-[14px] text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Container Handling & Storage
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Customs Clearance Facilities
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Intermodal Rail & Road Connections
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Vessel Berthing & Pilotage
                  </li>
                </ul>
              </Card>
              <Card className="p-6 border-[#e2e8f0]">
                <h3 className="text-[18px] font-bold text-slate-900 mb-4">Port Infrastructure</h3>
                <ul className="space-y-3 text-[14px] text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Modern Quay Cranes (STS)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Deep-water Berths ({port.max_depth_m}m)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Reefer Plug Points
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    24/7 Security & Monitoring
                  </li>
                </ul>
              </Card>
            </div>
          </div>

          {/* Right Column (30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Info Card */}
            <Card className="p-6 border-[#e2e8f0] bg-white">
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={`https://flagcdn.com/w80/${port.country_code.toLowerCase()}.png`} 
                  alt={port.country_name}
                  className="w-12 h-9 object-cover rounded shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-slate-900">{port.country_name}</h3>
                  <Link href={`/directories/ports/country/${countrySlug}`} className="text-[13px] text-blue-600 hover:underline">
                    View all ports in {port.country_name}
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <a 
                  href={port.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#0F4C81] text-white font-semibold hover:bg-[#0F4C81]/90 transition-colors"
                >
                  Official Website
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link 
                  href="/tools/ocean-freight/container-shipping-calculator"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#e2e8f0] text-[#0F4C81] font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Calculator className="h-4 w-4" />
                  Calculate Shipping
                </Link>
                <a 
                  href={`https://www.marinetraffic.com/en/ais/details/ports/${port.unlocode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-[#e2e8f0] text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  <Ship className="h-4 w-4" />
                  Live Vessel Traffic
                </a>
              </div>
            </Card>

            {/* Other Regional Ports */}
            {otherPorts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-[18px] font-bold text-slate-900">Other {port.country_name} Ports</h3>
                <div className="space-y-3">
                  {otherPorts.map(p => (
                    <Link 
                      key={p.unlocode}
                      href={`/directories/ports/${countrySlug}/${slugify(p.name.replace('Port of ', ''))}-${p.unlocode.toLowerCase()}`}
                      className="flex items-center gap-3 p-4 bg-white border border-[#e2e8f0] rounded-xl hover:border-blue-600 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600">
                        <Anchor className="h-5 w-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="font-bold text-slate-900 truncate">{p.name.replace('Port of ', '')}</p>
                        <p className="text-[12px] text-slate-500 font-mono">{p.unlocode}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
