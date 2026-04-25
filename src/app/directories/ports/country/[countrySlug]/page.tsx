import React from 'react';
import Link from 'next/link';
import { Anchor, Globe, ChevronRight, Info } from 'lucide-react';
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
            <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden relative">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
              
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="relative w-[120px] h-[90px] md:w-[160px] md:h-[120px] rounded-xl border border-[#e2e8f0] overflow-hidden shadow-md flex-shrink-0 bg-white">
                  <img 
                    src={`https://flagcdn.com/w160/${country.country_code.toLowerCase()}.png`} 
                    alt={`${country.name} flag`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-[#0F4C81] hover:bg-[#0F4C81] text-white border-none px-3 py-1">
                      {region}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-slate-500 border-slate-200 px-3 py-1">
                      {country.country_code}
                    </Badge>
                  </div>
                  <h1 className="text-[32px] md:text-[40px] font-extrabold text-slate-900 mb-3 tracking-tight">
                    Sea Ports in {country.name}
                  </h1>
                  <p className="text-[17px] text-slate-600 leading-relaxed max-w-2xl">
                    Discover the primary maritime gateways of {country.name}. 
                    Our directory covers {countryPorts.length} major commercial ports, 
                    providing critical data for logistics, shipping, and international trade operations.
                    {totalTeu > 0 && ` The country handles an estimated ${totalTeu.toLocaleString()} TEU annually.`}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-10 pt-10 border-t border-slate-100 relative z-10">
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-2">Total Ports</p>
                  <p className="text-[24px] font-black text-slate-900 leading-none">{countryPorts.length}</p>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-2">Annual TEU</p>
                  <p className="text-[24px] font-black text-slate-900 leading-none">{totalTeu > 0 ? totalTeu.toLocaleString() : "N/A"}</p>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-2">Coastline</p>
                  <p className="text-[24px] font-black text-slate-900 leading-none">{country.coastline_km > 0 ? `${country.coastline_km.toLocaleString()} km` : "N/A"}</p>
                </div>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-2">Currency</p>
                  <p className="text-[24px] font-black text-slate-900 leading-none">{country.currency}</p>
                </div>
              </div>
            </div>

            {/* Port List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-[24px] font-bold text-slate-900 flex items-center gap-2">
                  <Anchor className="h-6 w-6 text-blue-600" />
                  Major Commercial Terminals
                </h2>
                <span className="text-[14px] text-slate-500 font-medium">{countryPorts.length} active ports</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {countryPorts.map((port) => (
                  <Card key={port.unlocode} className="p-0 border-[#e2e8f0] hover:border-blue-600 transition-all hover:shadow-md group overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#0F4C81] flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Anchor className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <Link 
                              href={`/directories/ports/${countrySlug}/${slugify(port.name.replace('Port of ', ''))}-${port.unlocode.toLowerCase()}`}
                              className="text-[20px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors block mb-1"
                            >
                              {port.name}
                            </Link>
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge variant="secondary" className="font-mono text-[12px] py-0 px-2 h-5 bg-slate-100 text-slate-600 border-none">{port.unlocode}</Badge>
                              <span className="text-[14px] text-slate-500 font-medium flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                {port.port_type}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-6 ml-16">
                          <div>
                            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Annual TEU</p>
                            <p className="text-[16px] font-bold text-slate-700">
                              {port.annual_teu > 0 ? port.annual_teu.toLocaleString() : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Max Depth</p>
                            <p className="text-[16px] font-bold text-slate-700">{port.max_depth_m}m</p>
                          </div>
                          <div className="hidden sm:block">
                            <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">Region</p>
                            <p className="text-[16px] font-bold text-slate-700 truncate">{port.region}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-4 md:w-[180px] flex flex-row md:flex-col items-center justify-center gap-3">
                        <div className="hidden md:block text-center mb-2">
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Coordinates</p>
                          <p className="text-[12px] font-mono text-slate-500">
                            {port.latitude.toFixed(2)}, {port.longitude.toFixed(2)}
                          </p>
                        </div>
                        <Link 
                          href={`/directories/ports/${countrySlug}/${slugify(port.name.replace('Port of ', ''))}-${port.unlocode.toLowerCase()}`}
                          className="flex-1 md:w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#e2e8f0] text-[14px] font-bold text-[#0F4C81] hover:bg-[#0F4C81] hover:text-white hover:border-[#0F4C81] transition-all shadow-sm"
                        >
                          Details
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (30%) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Country Info Card */}
            <div className="sticky top-24 space-y-6">
              <Card className="p-0 border-[#e2e8f0] bg-white overflow-hidden shadow-sm">
                <div className="bg-slate-50 border-b border-slate-100 p-5">
                  <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Quick Facts
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-[14px]">Capital City</span>
                    <span className="font-bold text-slate-900">{country.capital}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-[14px]">Currency Code</span>
                    <span className="font-bold text-slate-900">{country.currency}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-[14px]">Population</span>
                    <span className="font-bold text-slate-900">{country.population > 0 ? country.population.toLocaleString() : "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-500 text-[14px]">Coastline</span>
                    <span className="font-bold text-slate-900">{country.coastline_km > 0 ? `${country.coastline_km.toLocaleString()} km` : "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-slate-500 text-[14px]">Primary Gateways</span>
                    <div className="flex flex-wrap gap-2">
                      {countryPorts.slice(0, 4).map(p => (
                        <Badge key={p.unlocode} variant="outline" className="bg-white text-slate-700 border-slate-200">
                          {p.name.replace('Port of ', '')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Map Integration */}
                <div className="p-5 pt-0">
                  <div className="h-[320px] rounded-xl overflow-hidden border border-slate-200 shadow-inner relative group">
                    <div className="absolute top-3 left-3 z-[400] bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <p className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-blue-600" />
                        Interactive Port Map
                      </p>
                    </div>
                    <PortMapClient 
                      ports={countryPorts} 
                      height="100%"
                    />
                  </div>
                </div>

                {/* Call to action or secondary info */}
                <div className="p-5 pt-0">
                  <div className="bg-blue-600 rounded-xl p-6 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                    <h4 className="text-[18px] font-bold mb-2 relative z-10">Shipping to {country.name}?</h4>
                    <p className="text-blue-100 text-[14px] mb-4 relative z-10">Get real-time freight quotes and track your vessels globally.</p>
                    <button className="w-full bg-white text-blue-600 font-bold py-2.5 rounded-lg text-[14px] relative z-10 hover:bg-blue-50 transition-colors">
                      Get Freight Quote
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
