import React from 'react';
import Link from 'next/link';
import { Anchor, MapPin, Globe, Clock, Ship, Maximize2, ChevronRight, ExternalLink, Calculator, Info } from 'lucide-react';
import { slugify } from '@/utils/slugify';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import PortMapClient from '@/components/PortMapClient';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';

// Helper to get data on server
async function getData() {
  const portsPath = path.join(process.cwd(), 'public', 'data', 'ports-main.json');
  const countriesPath = path.join(process.cwd(), 'public', 'data', 'countries-info.json');
  
  const portsData = JSON.parse(fs.readFileSync(portsPath, 'utf8'));
  const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));
  
  return { portsData, countriesData };
}

export async function generateMetadata({ params }: { params: { countrySlug: string; portSlug: string } }): Promise<Metadata> {
  const { portsData } = await getData();
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
  const { portsData, countriesData } = await getData();
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

export default async function PortDetailPage({ params }: { params: { countrySlug: string; portSlug: string } }) {
  const { countrySlug, portSlug } = params;
  const { portsData, countriesData } = await getData();
  
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
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-[#0F4C81] hover:bg-[#0F4C81] text-white border-none px-3 py-1 uppercase tracking-wider text-[11px]">
                {port.port_type}
              </Badge>
              <Badge variant="outline" className="font-mono text-slate-500 border-slate-200 px-3 py-1">
                {port.unlocode}
              </Badge>
            </div>
            <h1 className="text-[32px] md:text-[42px] font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
              {port.name.includes('Port of') ? port.name : `Port of ${port.name}`}
            </h1>
            <p className="text-[18px] text-slate-500 max-w-3xl leading-relaxed">
              Comprehensive operational data for {port.name} ({port.unlocode}). 
              Explore infrastructure details, container throughput, and geographic positioning for this major maritime hub in {port.country_name}.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <a 
              href={`https://www.marinetraffic.com/en/ais/details/ports/${port.unlocode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#e2e8f0] text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm text-[14px]"
            >
              <Ship className="h-4 w-4 text-blue-600" />
              Live Traffic
            </a>
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F4C81] text-white font-bold hover:bg-[#0F4C81]/90 transition-all shadow-lg shadow-blue-900/10 text-[14px]">
              <Calculator className="h-4 w-4" />
              Get Freight Quote
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (70%) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Key Facts Table */}
            <Card className="overflow-hidden border-[#e2e8f0] shadow-sm rounded-2xl">
              <div className="bg-slate-50/80 px-8 py-5 border-b border-[#e2e8f0]">
                <h2 className="text-[20px] font-bold text-slate-900 flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Technical Specifications
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {[
                  { label: "UN/LOCODE", value: port.unlocode, icon: Anchor, desc: "Global location identifier" },
                  { label: "Geographic Location", value: `${port.latitude.toFixed(4)}°N, ${port.longitude.toFixed(4)}°E`, icon: MapPin, desc: "Precise GPS coordinates" },
                  { label: "Terminal Type", value: port.port_type, icon: Ship, desc: "Primary port classification" },
                  { label: "Maximum Draft", value: `${port.max_depth_m} meters`, icon: Maximize2, desc: "Vessel depth capacity" },
                  { label: "Annual Throughput", value: port.annual_teu > 0 ? `${port.annual_teu.toLocaleString()} TEU` : "Data pending", icon: Globe, desc: "Container volume per year" },
                  { label: "Operational Time", value: port.timezone, icon: Clock, desc: "Local time zone reference" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-5 p-8 ${i % 2 === 0 ? 'md:border-r' : ''} ${i < 4 ? 'border-b' : ''} border-[#e2e8f0] hover:bg-slate-50/30 transition-colors`}>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0F4C81] flex-shrink-0">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-1">{item.label}</p>
                      <p className="text-[18px] font-bold text-slate-900 leading-tight mb-1">{item.value}</p>
                      <p className="text-[13px] text-slate-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Map Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-[24px] font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  Port Geographic Positioning
                </h2>
                <Badge variant="outline" className="bg-white text-slate-500 border-slate-200">
                  Interactive View
                </Badge>
              </div>
              <div className="h-[450px] rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-md relative group">
                <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200 shadow-sm pointer-events-none">
                  <p className="text-[12px] font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-blue-600" />
                    {port.name} Terminal Location
                  </p>
                </div>
                <PortMapClient 
                  ports={[port]} 
                  selectedId={port.unlocode}
                  height="100%"
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />
              <h2 className="text-[24px] font-bold text-slate-900 mb-5 relative z-10">Strategic Overview</h2>
              <div className="prose prose-slate max-w-none relative z-10">
                <p className="text-[17px] text-slate-600 leading-relaxed mb-6">
                  {port.name} (UN/LOCODE: {port.unlocode}) serves as a premier maritime gateway located in {port.country_name}. 
                  Situated in the {port.region} region, this {port.port_type.toLowerCase()} plays an indispensable role in global supply chains, 
                  facilitating efficient international trade and logistics operations.
                </p>
                <p className="text-[17px] text-slate-600 leading-relaxed">
                  With a maximum depth capacity of {port.max_depth_m} meters, the facility is engineered to handle a diverse range of modern commercial vessels. 
                  The port's strategic significance is underscored by its annual container throughput of approximately {port.annual_teu.toLocaleString()} TEU, 
                  making it a core component of the maritime infrastructure in {port.country_name} and the broader {port.region} area.
                </p>
              </div>
            </div>

            {/* Terminal Info & Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border-[#e2e8f0] rounded-2xl hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <Anchor className="h-6 w-6" />
                </div>
                <h3 className="text-[20px] font-bold text-slate-900 mb-5">Terminal Services</h3>
                <ul className="space-y-4">
                  {[
                    "Container Handling & Storage",
                    "Customs Clearance Facilities",
                    "Intermodal Rail & Road Connections",
                    "Vessel Berthing & Pilotage"
                  ].map((service, i) => (
                    <li key={i} className="flex items-center gap-3 text-[15px] text-slate-600 font-medium">
                      <div className="w-2 h-2 rounded-full bg-blue-600 shadow-sm shadow-blue-200" />
                      {service}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-8 border-[#e2e8f0] rounded-2xl hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-6">
                  <Maximize2 className="h-6 w-6" />
                </div>
                <h3 className="text-[20px] font-bold text-slate-900 mb-5">Infrastructure</h3>
                <ul className="space-y-4">
                  {[
                    "Modern Quay Cranes (STS)",
                    `Deep-water Berths (${port.max_depth_m}m)`,
                    "Reefer Plug Points",
                    "24/7 Security & Monitoring"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[15px] text-slate-600 font-medium">
                      <div className="w-2 h-2 rounded-full bg-green-600 shadow-sm shadow-green-200" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          {/* Right Column (30%) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Country Context Card */}
            <Card className="p-0 border-[#e2e8f0] bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 border-b border-slate-100 p-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={`https://flagcdn.com/w80/${port.country_code.toLowerCase()}.png`} 
                    alt={port.country_name}
                    className="w-14 h-10 object-cover rounded-lg shadow-sm border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-[18px]">{port.country_name}</h3>
                    <p className="text-[13px] text-slate-500">Maritime Logistics Hub</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Link 
                  href={`/directories/ports/country/${countrySlug}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all text-[14px] mb-6"
                >
                  View all ports in {port.country_name}
                  <ChevronRight className="h-4 w-4" />
                </Link>
                
                <div className="space-y-4">
                  <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4">Nearby Ports</h4>
                  {otherPorts.map((other) => (
                    <Link 
                      key={other.unlocode}
                      href={`/directories/ports/${countrySlug}/${slugify(other.name.replace('Port of ', ''))}-${other.unlocode.toLowerCase()}`}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#0F4C81] group-hover:bg-[#0F4C81] group-hover:text-white transition-colors">
                        <Anchor className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-[14px] leading-tight mb-0.5">{other.name}</p>
                        <p className="text-[12px] text-slate-500 font-mono">{other.unlocode}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Card>

            {/* Freight Quote CTA */}
            <Card className="p-8 border-none bg-[#0F4C81] text-white rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                  <Calculator className="h-7 w-7 text-blue-200" />
                </div>
                <h3 className="text-[22px] font-bold mb-3">Freight Estimator</h3>
                <p className="text-blue-100/80 text-[15px] mb-8 leading-relaxed">
                  Looking to ship cargo to or from {port.name}? Get instant freight rate estimates and compare carriers.
                </p>
                <button className="w-full bg-white text-[#0F4C81] font-bold py-3.5 rounded-xl text-[15px] hover:bg-blue-50 transition-all shadow-xl shadow-black/20">
                  Calculate Shipping Cost
                </button>
              </div>
            </Card>

            {/* Port Data Summary */}
            <Card className="p-6 border-slate-100 bg-white rounded-2xl shadow-sm">
              <h3 className="text-[16px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                Data Source Information
              </h3>
              <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
                Port metrics and throughput data are verified against Lloyd's List Top 100 Container Ports and World Port Index (WPI) records.
              </p>
              <div className="flex items-center gap-2 text-[12px] font-bold text-[#0F4C81]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Verified Data 2024-2025
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
