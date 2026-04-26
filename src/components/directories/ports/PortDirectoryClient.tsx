'use client';

import { useState, useMemo } from 'react';
import { Country, Port, Region } from '@/utils/data-utils';
import CountrySidebar from './CountrySidebar';
import PortTable from './PortTable';
import StatsCards from './StatsCards';
import SearchBox from './SearchBox';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { 
  Anchor, 
  Globe, 
  TrendingUp, 
  Map as MapIcon, 
  ArrowRight, 
  Info, 
  BarChart3, 
  Layers,
  Ship,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PortMap = dynamic(() => import('@/components/GlobalPortsMap'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-2xl" />
});

interface PortDirectoryClientProps {
  countries: Country[];
  ports: Port[];
  regions: Region[];
}

export default function PortDirectoryClient({ countries, ports, regions }: PortDirectoryClientProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  
  const countryPorts = useMemo(() => {
    if (!selectedCountry) return [];
    return ports.filter(p => p.country_code === selectedCountry.iso_alpha2);
  }, [selectedCountry, ports]);

  const topPorts = useMemo(() => {
    return [...ports]
      .sort((a, b) => b.annual_teu - a.annual_teu)
      .slice(0, 10);
  }, [ports]);

  const trendingCountries = useMemo(() => {
    return [...countries]
      .sort((a, b) => b.total_sea_ports - a.total_sea_ports)
      .slice(0, 10);
  }, [countries]);

  const stats = useMemo(() => {
    return {
      countries: countries.length,
      seaPorts: ports.filter(p => p.port_type === 'Sea Port').length,
      airports: ports.filter(p => p.port_type === 'Airport').length,
      dryPorts: ports.filter(p => ['Dry Port', 'Container Terminal', 'Rail Terminal'].includes(p.port_type)).length
    };
  }, [countries, ports]);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header & Hero */}
      <div className="bg-slate-900 pt-24 pb-48 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-emerald-600/5 blur-[100px] rounded-full -ml-32 -mb-32" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 rounded-full mb-6 font-bold tracking-wider uppercase text-[10px]">
              Global Infrastructure Database 2024
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              World Sea Ports <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Directory</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Access technical specifications, infrastructure details, and operational data for over 8,000 major commercial ports worldwide.
            </p>
          </div>

          <SearchBox ports={ports} countries={countries} className="mb-20" />
          
          <div className="max-w-5xl mx-auto">
            <StatsCards stats={stats} />
          </div>
        </div>
      </div>

      {/* Main Content Area - Overlapping the Hero */}
      <div className="container mx-auto px-4 -mt-32 pb-24 relative z-20">
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col-reverse lg:flex-row h-auto lg:h-[900px]">
          
          {/* Left Sidebar - Country Browser */}
          <div className="w-full lg:w-[320px] xl:w-[380px] flex-shrink-0 border-t lg:border-t-0 lg:border-r border-slate-100 max-h-[400px] lg:max-h-none">
            <CountrySidebar 
              regions={regions} 
              countries={countries} 
              selectedCountryCode={selectedCountry?.iso_alpha2}
              onSelectCountry={(country) => {
                setSelectedCountry(country);
                // On mobile, scroll to the detail panel after selection
                if (window.innerWidth < 1024) {
                  const detailPanel = document.getElementById('port-detail-panel');
                  detailPanel?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
          </div>

          {/* Right Panel - Detail View */}
          <div id="port-detail-panel" className="flex-1 flex flex-col bg-slate-50/50 overflow-y-auto custom-scrollbar min-h-[600px]">
            {!selectedCountry ? (
              <div className="flex-1 flex flex-col p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <MapIcon className="w-6 h-6 text-blue-600" />
                      Global Port Network
                    </h2>
                    <p className="text-slate-500 font-medium">Showing major commercial hubs across all continents</p>
                  </div>
                  <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs gap-2">
                    <Layers className="w-4 h-4" />
                    Heatmap View
                  </Button>
                </div>

                <div className="flex-1 rounded-[24px] overflow-hidden border border-slate-200 shadow-inner bg-slate-100 relative">
                  <PortMap 
                    ports={ports.filter(p => p.annual_teu > 500000 || p.harbor_size === 'Large').slice(0, 100)} 
                    height="100%"
                    zoom={2}
                    center={[20, 0]}
                  />
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-1">Real-time Data</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Sourced from UN/LOCODE, World Port Index, and Port Authorities.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <BarChart3 className="w-5 h-5 text-blue-500 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-1">Market Insights</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Detailed TEU throughput, depth data, and infrastructure capacity.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <Globe className="w-5 h-5 text-amber-500 mb-3" />
                    <h4 className="font-bold text-slate-900 mb-1">Global Coverage</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">196 countries mapped with deep infrastructure connectivity.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                {/* Country Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden shadow-lg border-4 border-white">
                      <Image 
                        src={selectedCountry.flag_url} 
                        alt={selectedCountry.name} 
                        fill 
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">{selectedCountry.name}</h2>
                        <Badge className="bg-blue-50 text-blue-600 border-blue-100 font-bold uppercase tracking-widest text-[10px]">
                          {selectedCountry.iso_alpha2} / {selectedCountry.iso_alpha3}
                        </Badge>
                      </div>
                      <p className="text-slate-500 font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        {selectedCountry.region} • {selectedCountry.subregion}
                      </p>
                    </div>
                  </div>
                  <Link href={`/directories/ports/country/${selectedCountry.slug}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold px-6 h-12 gap-2 shadow-lg shadow-blue-600/20 transition-all hover:translate-y-[-2px]">
                      Country Profile
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Country Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capital</div>
                    <div className="font-bold text-slate-900 truncate">{selectedCountry.capital}</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Currency</div>
                    <div className="font-bold text-slate-900 truncate">{selectedCountry.currency_name} ({selectedCountry.currency})</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Population</div>
                    <div className="font-bold text-slate-900">{(selectedCountry.population / 1e6).toFixed(1)}M</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">GDP (USD)</div>
                    <div className="font-bold text-slate-900">${(selectedCountry.gdp_usd / 1e9).toFixed(1)}B</div>
                  </div>
                </div>

                {/* Economic Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                    <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4" /> Major Exports
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedCountry.major_exports || []).map(item => (
                        <Badge key={item} variant="secondary" className="bg-white/80 text-emerald-700 border-emerald-100 px-3 py-1 font-semibold">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                    <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-4">
                      <BarChart3 className="w-4 h-4" /> Major Imports
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(selectedCountry.major_imports || []).map(item => (
                        <Badge key={item} variant="secondary" className="bg-white/80 text-blue-700 border-blue-100 px-3 py-1 font-semibold">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Country Map Section */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <MapIcon className="w-5 h-5 text-blue-600" />
                      Infrastructure Map
                    </h3>
                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 font-bold px-3">
                      {countryPorts.length} Ports Mapped
                    </Badge>
                  </div>
                  <div className="h-[400px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative">
                    <PortMap ports={countryPorts} height="100%" />
                  </div>
                </div>

                {/* Ports Table Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Anchor className="w-5 h-5 text-blue-600" />
                      Commercial Port Terminals
                    </h3>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600">CSV Export</Button>
                      <Button variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600">Print</Button>
                    </div>
                  </div>
                  <PortTable ports={countryPorts} countrySlug={selectedCountry.slug} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trending Sections */}
        <div className="mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">Market <span className="text-blue-600">Trending</span></h2>
              <p className="text-slate-500 font-medium">Top performing maritime hubs and nations by throughput and infrastructure</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full h-12 px-6 font-bold border-slate-200 hover:bg-slate-50">Global Stats</Button>
              <Button className="rounded-full h-12 px-6 font-bold bg-slate-900 text-white hover:bg-slate-800">Full Directory</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Trending Ports */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Ship className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Top Ports by TEU</h3>
              </div>
              <div className="space-y-3">
                {topPorts.map((port, idx) => (
                  <Link 
                    key={port.unlocode} 
                    href={`/directories/ports/${port.country_slug}/${port.slug}`}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-600/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-300 group-hover:text-blue-200 transition-colors w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <Anchor className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{port.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{port.country_name} • {port.unlocode}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-900">{(port.annual_teu / 1e6).toFixed(1)}M</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual TEU</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Countries */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Top Maritime Nations</h3>
              </div>
              <div className="space-y-3">
                {trendingCountries.map((country, idx) => (
                  <Link 
                    key={country.iso_alpha2} 
                    href={`/directories/ports/country/${country.slug}`}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-600/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-slate-300 group-hover:text-emerald-200 transition-colors w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                      <div className="relative w-10 h-7 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                        <Image 
                          src={country.flag_url} 
                          alt={country.name} 
                          fill 
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{country.name}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{country.region} • {country.iso_alpha3}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-900">{country.total_sea_ports}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sea Ports</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer SEO Content */}
      <div className="bg-white border-t border-slate-200 py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight">Comprehensive Global <br/>Port <span className="text-blue-600">Infrastructure</span></h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex-shrink-0 flex items-center justify-center">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Standardized UN/LOCODE Data</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Our directory strictly follows the UNECE UN/LOCODE standards, ensuring every port code is globally recognized and verifiable.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex-shrink-0 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Deep Technical Metrics</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">From maximum draft and depth to annual container throughput (TEU), we provide the technical data needed for logistics planning.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex-shrink-0 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Intermodal Hub Connectivity</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">Mapping the connection between sea ports, airports, and inland dry ports to provide a complete picture of global trade gateways.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-[40px] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full -mr-32 -mt-32" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-6">Need Port Data via API?</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Integrate our global port database directly into your logistics software, ERP, or TMS. 
                  Access real-time port status, technical specs, and geofencing data.
                </p>
                <div className="flex flex-col gap-3">
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-14 font-black transition-all hover:translate-y-[-2px]">
                    Explore API Docs
                  </Button>
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10 rounded-2xl h-14 font-bold">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
