'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Anchor, 
  MapPin, 
  Globe, 
  ArrowLeft, 
  Search, 
  Filter, 
  Info, 
  TrendingUp, 
  BarChart3, 
  Ship,
  ChevronRight,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';
import { Country, Port } from '@/utils/data-utils';
import PortTable from './PortTable';

const PortMap = dynamic(() => import('@/components/GlobalPortsMap'), { ssr: false });

interface CountryPageClientProps {
  country: Country;
  ports: Port[];
}

export default function CountryPageClient({ country, ports }: CountryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [portTypeFilter, setPortTypeFilter] = useState<string>('All');
  const [teuRange, setTeuRange] = useState<string>('All');

  const filteredPorts = useMemo(() => {
    return ports.filter(port => {
      const matchesSearch = port.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           port.unlocode.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = portTypeFilter === 'All' || port.port_type === portTypeFilter;
      
      let matchesTeu = true;
      if (teuRange === 'Large (>1M)') matchesTeu = port.annual_teu >= 1000000;
      else if (teuRange === 'Medium (100K-1M)') matchesTeu = port.annual_teu >= 100000 && port.annual_teu < 1000000;
      else if (teuRange === 'Small (<100K)') matchesTeu = port.annual_teu < 100000;

      return matchesSearch && matchesType && matchesTeu;
    });
  }, [ports, searchQuery, portTypeFilter, teuRange]);

  const portTypes = ['All', ...Array.from(new Set(ports.map(p => p.port_type)))];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/directories/ports" className="hover:text-white transition-colors">Ports</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-blue-400 font-bold">{country.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
              <div className="relative w-32 h-20 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <Image 
                  src={country.flag_url} 
                  alt={country.name} 
                  fill 
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  {country.name} <span className="text-blue-500">Ports</span>
                </h1>
                <p className="text-xl text-slate-400 font-medium">
                  Exploring {country.total_sea_ports} major commercial maritime hubs
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[24px] text-center min-w-[140px]">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Sea Ports</div>
                <div className="text-3xl font-black text-white">{country.total_sea_ports}</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[24px] text-center min-w-[140px]">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Airports</div>
                <div className="text-3xl font-black text-white">{country.total_airports}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Content & Table */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Country Info Card */}
            <Card className="bg-white rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">National Overview</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capital</div>
                  <div className="font-bold text-slate-900">{country.capital}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ISO Codes</div>
                  <div className="font-bold text-slate-900">{country.iso_alpha2} / {country.iso_alpha3}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currency</div>
                  <div className="font-bold text-slate-900">{country.currency_name} ({country.currency})</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Population</div>
                  <div className="font-bold text-slate-900">{(country.population / 1e6).toFixed(1)}M</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100/50">
                  <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4" /> Major Exports
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {country.major_exports.map(item => (
                      <Badge key={item} variant="secondary" className="bg-white text-emerald-700 border-emerald-100 px-3 py-1 font-semibold">
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
                    {country.major_imports.map(item => (
                      <Badge key={item} variant="secondary" className="bg-white text-blue-700 border-blue-100 px-3 py-1 font-semibold">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Ports Explorer */}
            <Card className="bg-white rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                      <Anchor className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Port Directory</h2>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs">Export Data</Button>
                    <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs">Compare Ports</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      placeholder="Search by name or code..." 
                      className="pl-11 h-12 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      className="w-full h-12 pl-11 pr-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={portTypeFilter}
                      onChange={(e) => setPortTypeFilter(e.target.value)}
                    >
                      {portTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <BarChart3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select 
                      className="w-full h-12 pl-11 pr-4 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-all font-medium appearance-none outline-none focus:ring-2 focus:ring-blue-500/20"
                      value={teuRange}
                      onChange={(e) => setTeuRange(e.target.value)}
                    >
                      <option value="All">All TEU Ranges</option>
                      <option value="Large (>1M)">Large (&gt;1M TEU)</option>
                      <option value="Medium (100K-1M)">Medium (100K-1M TEU)</option>
                      <option value="Small (<100K)">Small (&lt;100K TEU)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-0">
                <PortTable ports={filteredPorts} countrySlug={country.slug} />
              </div>
            </Card>
          </div>

          {/* Right Column - Sticky Map */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <Card className="bg-white rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden p-2">
                <div className="h-[500px] rounded-[28px] overflow-hidden relative border border-slate-100">
                  <PortMap ports={filteredPorts} height="100%" />
                  <div className="absolute top-4 right-4 z-[400]">
                    <Badge className="bg-white/90 backdrop-blur text-slate-900 border-slate-200 font-bold px-3 py-1.5 shadow-sm">
                      {filteredPorts.length} Ports Shown
                    </Badge>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900 rounded-[32px] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <h3 className="text-xl font-black text-white mb-4">Infrastructure Data</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Our database for {country.name} is updated monthly with official records from maritime authorities and UN/LOCODE registers.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold gap-2">
                    Request Full Report
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Nearby Countries / Quick Links */}
              <Card className="bg-white rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 p-8">
                <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Regional Links
                </h3>
                <div className="space-y-3">
                  <Link href="/directories/ports" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Global Port Directory</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                  </Link>
                  <Link href={`/directories/ports?region=${country.region}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                    <span className="text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Other {country.region} Countries</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
