import React from 'react';
import Link from 'next/link';
import { Anchor, Globe, ChevronRight, Info, Ship, Plane, Train, Package, MapPin, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { slugify } from '@/utils/slugify';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import PortMapClient from '@/components/PortMapClient';
import PortsList from '@/components/PortsList';
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

export async function generateMetadata({ params }: { params: { countrySlug: string } }): Promise<Metadata> {
  const { portsData, countriesData } = await getData();
  const { countrySlug } = params;
  const country = countriesData.find(c => slugify(c.name) === countrySlug);

  if (!country) {
    return {
      title: 'Country Not Found | Shiportrade',
    };
  }

  const portCount = portsData.filter(p => p.country_code === country.country_code).length;
  const title = `Sea Ports in ${country.name} (${portCount} Ports) | Shiportrade`;
  const description = `Complete directory of ${portCount} major commercial ports in ${country.name}. Find UN/LOCODE, container throughput, and terminal details for all ${country.name} ports.`;

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
  const { countriesData } = await getData();
  return countriesData.map((country: any) => ({
    countrySlug: slugify(country.name),
  }));
}

export default async function CountryPortsPage({ params }: { params: { countrySlug: string } }) {
  const { countrySlug } = params;
  const { portsData, countriesData } = await getData();
  
  const country = countriesData.find(c => slugify(c.name) === countrySlug);
  
  if (!country) {
    return <div>Country not found</div>;
  }

  const countryPorts = portsData.filter(p => p.country_code === country.country_code)
    .sort((a, b) => (b.annual_teu || 0) - (a.annual_teu || 0));

  const seaPorts = countryPorts.filter(p => p.port_type === 'sea_port');
  const airports = countryPorts.filter(p => p.port_type === 'airport');
  const dryPorts = countryPorts.filter(p => ['dry_port', 'container_terminal', 'rail_terminal'].includes(p.port_type));

  const getPortIcon = (type: string) => {
    switch(type) {
      case 'sea_port': return <Ship className="w-4 h-4 text-blue-500" />;
      case 'airport': return <Plane className="w-4 h-4 text-amber-500" />;
      case 'container_terminal': return <Package className="w-4 h-4 text-emerald-500" />;
      case 'dry_port':
      case 'rail_terminal': return <Train className="w-4 h-4 text-rose-500" />;
      default: return <Anchor className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/directories/ports" className="hover:text-blue-600 transition-colors">Ports</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">{country.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Country Header */}
            <Card className="p-8 border-slate-200 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
              
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="text-7xl p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  <img 
                    src={`https://flagcdn.com/w160/${country.country_code.toLowerCase()}.png`} 
                    alt={`${country.name} flag`}
                    className="w-24 h-auto object-contain"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100">{countryPorts.length > 0 ? countryPorts[0].region : ""}</Badge>
                    <Badge variant="outline" className="text-slate-400">{country.country_code}</Badge>
                  </div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">Ports in {country.name}</h1>
                  <p className="text-slate-500 max-w-xl">
                    Discover {countryPorts.length} major transport hubs in {country.name}, including major sea ports, international airports, and inland dry terminals.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{countryPorts.length}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Hubs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{seaPorts.length}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Sea Ports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{airports.length}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Airports</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{dryPorts.length}</div>
                  <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">Dry Ports</div>
                </div>
              </div>
            </Card>

            {/* Ports List with Search & Pagination */}
            <PortsList ports={countryPorts} countrySlug={countrySlug} />
          </div>

          {/* Right Column (Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" /> Country Profile
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Capital</span>
                  <span className="font-bold text-slate-900 text-sm">{country.capital}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Currency</span>
                  <span className="font-bold text-slate-900 text-sm">{country.currency}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Population</span>
                  <span className="font-bold text-slate-900 text-sm">{country.population > 0 ? country.population.toLocaleString() : "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Coastline</span>
                  <span className="font-bold text-slate-900 text-sm">{country.coastline_km > 0 ? `${country.coastline_km.toLocaleString()} km` : "N/A"}</span>
                </div>
              </div>

              <div className="h-[300px] rounded-xl overflow-hidden border border-slate-200 mb-6">
                <PortMapClient 
                  ports={countryPorts} 
                  height="100%"
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-xl">
                Get Shipping Rates to {country.name}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
