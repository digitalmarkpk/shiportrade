import React from 'react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { Anchor, Globe, ChevronRight, Info } from 'lucide-react';
import { slugify } from '@/utils/slugify';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import countriesData from '../../../../../public/data/countries-info.json';
import portsData from '../../../../../public/data/ports-main.json';

import { Metadata } from 'next';

const GlobalPortsMap = nextDynamic(() => import('@/components/GlobalPortsMap'), { ssr: false });

export async function generateMetadata({ params }: { params: { countrySlug: string } }): Promise<Metadata> {
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
  return countriesData.map((country) => ({
    countrySlug: slugify(country.name),
  }));
}

export default function CountryPortsPage({ params }: { params: { countrySlug: string } }) {
  const { countrySlug } = params;
  
  const country = countriesData.find(c => slugify(c.name) === countrySlug);
  
  if (!country) {
    return <div>Country not found</div>;
  }

  const countryPorts = portsData.filter(p => p.country_code === country.country_code)
    .sort((a, b) => b.annual_teu - a.annual_teu);

  const totalTeu = countryPorts.reduce((acc, p) => acc + (p.annual_teu || 0), 0);
  const region = countryPorts.length > 0 ? countryPorts[0].region : "";

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#e2e8f0]">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-[14px] text-slate-500">
            <Link href="/" className="hover:text-[#0F4C81]">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/directories/ports" className="hover:text-[#0F4C81]">Ports</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">{country.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (70%) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Top Section */}
            <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] shadow-sm">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative w-[120px] h-[90px] md:w-[160px] md:h-[120px] rounded-lg border border-[#e2e8f0] overflow-hidden shadow-sm flex-shrink-0">
                  <img 
                    src={`https://flagcdn.com/w160/${country.country_code.toLowerCase()}.png`} 
                    alt={`${country.name} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-100 bg-blue-50/50">
                      {region}
                    </Badge>
                    <Badge variant="outline" className="font-mono">
                      {country.country_code}
                    </Badge>
                  </div>
                  <h1 className="text-[32px] font-extrabold text-slate-900 mb-2">
                    Sea Ports in {country.name}
                  </h1>
                  <p className="text-[16px] text-slate-500 leading-relaxed">
                    Explore the complete directory of {countryPorts.length} major commercial ports in {country.name}. 
                    {totalTeu > 0 && ` With a combined annual throughput of ${totalTeu.toLocaleString()} TEU, ${country.name} represents a significant hub in global maritime trade.`}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-50">
                <div>
                  <p className="text-[12px] text-slate-400 uppercase font-bold tracking-wider mb-1">Total Ports</p>
                  <p className="text-[20px] font-bold text-slate-900">{countryPorts.length}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-400 uppercase font-bold tracking-wider mb-1">Total TEU</p>
                  <p className="text-[20px] font-bold text-slate-900">{totalTeu > 0 ? totalTeu.toLocaleString() : "N/A"}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-400 uppercase font-bold tracking-wider mb-1">Coastline</p>
                  <p className="text-[20px] font-bold text-slate-900">{country.coastline_km > 0 ? `${country.coastline_km.toLocaleString()} km` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-[12px] text-slate-400 uppercase font-bold tracking-wider mb-1">Currency</p>
                  <p className="text-[20px] font-bold text-slate-900">{country.currency}</p>
                </div>
              </div>
            </div>

            {/* Port List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[24px] font-bold text-slate-900">Major Commercial Terminals</h2>
                <span className="text-[14px] text-slate-500">{countryPorts.length} results found</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {countryPorts.map((port) => (
                  <Card key={port.unlocode} className="p-6 border-[#e2e8f0] hover:border-blue-600 transition-colors group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#0F4C81] flex-shrink-0">
                          <Anchor className="h-6 w-6" />
                        </div>
                        <div>
                          <Link 
                            href={`/directories/ports/${countrySlug}/${slugify(port.name.replace('Port of ', ''))}-${port.unlocode.toLowerCase()}`}
                            className="text-[18px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors"
                          >
                            {port.name}
                          </Link>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="font-mono text-[12px] bg-slate-50">{port.unlocode}</Badge>
                            <span className="text-[14px] text-slate-500">{port.port_type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:flex items-center gap-8 md:gap-12">
                        <div className="text-center md:text-left">
                          <p className="text-[12px] text-slate-400 uppercase font-bold tracking-tight">Annual TEU</p>
                          <p className="text-[15px] font-semibold text-slate-700">
                            {port.annual_teu > 0 ? port.annual_teu.toLocaleString() : "N/A"}
                          </p>
                        </div>
                        <div className="text-center md:text-left">
                          <p className="text-[12px] text-slate-400 uppercase font-bold tracking-tight">Coordinates</p>
                          <p className="text-[15px] font-semibold text-slate-700 font-mono">
                            {port.latitude.toFixed(2)}°, {port.longitude.toFixed(2)}°
                          </p>
                        </div>
                        <div className="hidden sm:block text-center md:text-left">
                          <p className="text-[12px] text-slate-400 uppercase font-bold tracking-tight">Max Depth</p>
                          <p className="text-[15px] font-semibold text-slate-700">{port.max_depth_m}m</p>
                        </div>
                      </div>

                      <Link 
                        href={`/directories/ports/${countrySlug}/${slugify(port.name.replace('Port of ', ''))}-${port.unlocode.toLowerCase()}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#e2e8f0] text-[14px] font-semibold text-[#0F4C81] hover:bg-slate-50 transition-colors"
                      >
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Country Info Card */}
            <Card className="p-6 border-[#e2e8f0] bg-white sticky top-24">
              <h3 className="text-[18px] font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Country Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Capital</span>
                  <span className="font-semibold text-slate-900">{country.capital}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Currency</span>
                  <span className="font-semibold text-slate-900">{country.currency}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Population</span>
                  <span className="font-semibold text-slate-900">{country.population > 0 ? country.population.toLocaleString() : "N/A"}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-500">Coastline</span>
                  <span className="font-semibold text-slate-900">{country.coastline_km > 0 ? `${country.coastline_km.toLocaleString()} km` : "N/A"}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Main Ports</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {countryPorts.slice(0, 3).map(p => p.name.replace('Port of ', '')).join(', ')}
                  </span>
                </div>
              </div>

              {/* Sticky Map */}
              <div className="mt-8">
                <h4 className="text-[14px] font-bold text-slate-900 mb-3 uppercase tracking-wider">Port Locations</h4>
                <div className="h-[300px] rounded-lg overflow-hidden border border-[#e2e8f0]">
                  <GlobalPortsMap 
                    ports={countryPorts} 
                    height="100%" 
                    maxMarkers={100}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
