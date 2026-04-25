import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Search, Anchor, Ship, Plane, Train, Package, Map as MapIcon, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getCountries, getPorts } from '@/utils/data-utils';
import PortMapClient from '@/components/PortMapClient';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Global Port Directory | Shiportrade',
  description: 'Explore our comprehensive directory of sea ports, airports, and dry ports worldwide. Find technical details, facilities, and contact information.',
};

export default async function PortsHubPage() {
  const countries = await getCountries();
  const ports = await getPorts();

  // Sort countries by name
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));

  // Stats
  const stats = {
    countries: countries.length,
    ports: ports.length,
    seaPorts: ports.filter(p => p.port_type === 'sea_port').length,
    airports: ports.filter(p => p.port_type === 'airport').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-3xl rounded-full -mr-64 -mt-64" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Global Port Directory</h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Discover over 8,000 transport hubs worldwide. Access technical specifications, 
              infrastructure details, and marine services for sea ports, airports, and inland terminals.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex-1 min-w-[150px]">
                <div className="text-3xl font-bold text-blue-400">{stats.countries}</div>
                <div className="text-sm text-slate-400 uppercase font-bold tracking-wider">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex-1 min-w-[150px]">
                <div className="text-3xl font-bold text-emerald-400">{stats.ports.toLocaleString()}</div>
                <div className="text-sm text-slate-400 uppercase font-bold tracking-wider">Total Hubs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex-1 min-w-[150px]">
                <div className="text-3xl font-bold text-amber-400">{stats.seaPorts.toLocaleString()}</div>
                <div className="text-sm text-slate-400 uppercase font-bold tracking-wider">Sea Ports</div>
              </div>
            </div>

            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input 
                placeholder="Search country or port name..." 
                className="pl-12 h-14 bg-white text-slate-900 border-none rounded-2xl text-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Map Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <MapIcon className="w-6 h-6 mr-2 text-blue-600" /> World Port Map
            </h2>
            <Badge variant="outline" className="bg-white">Showing {Math.min(ports.length, 500)} Major Hubs</Badge>
          </div>
          <Card className="p-2 border-slate-200 shadow-xl overflow-hidden rounded-3xl">
            <PortMapClient 
              ports={ports.slice(0, 500)} 
              height="600px" 
            />
          </Card>
        </div>

        {/* Countries Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-blue-600" /> Browse by Country
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedCountries.map((country) => (
              <Link key={country.id} href={`/directories/ports/${country.slug}`}>
                <Card className="group p-6 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 h-full border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{country.flag_emoji || '🏳️'}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {country.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">
                        {country.region || 'Global'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-50">
                    <div className="text-center">
                      <Ship className="w-3.5 h-3.5 mx-auto mb-1 text-blue-500" />
                      <div className="text-xs font-bold">{country.total_sea_ports || 0}</div>
                    </div>
                    <div className="text-center">
                      <Plane className="w-3.5 h-3.5 mx-auto mb-1 text-amber-500" />
                      <div className="text-xs font-bold">{country.total_airports || 0}</div>
                    </div>
                    <div className="text-center">
                      <Train className="w-3.5 h-3.5 mx-auto mb-1 text-rose-500" />
                      <div className="text-xs font-bold">{country.total_dry_ports || 0}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-end text-blue-600 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    View Ports <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* SEO Footer Text */}
      <div className="bg-white border-t border-slate-200 py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Comprehensive Global Port Infrastructure Data</h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            Shiportrade provides the most detailed and up-to-date directory of international sea ports, 
            airports, and inland dry terminals. Our data includes UN/LOCODE identifiers, coordinates, 
            infrastructure capacities, and facility specifications to help logistics professionals 
            navigate the global supply chain efficiently.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center text-sm font-bold text-slate-700">
              <Anchor className="w-4 h-4 mr-2 text-blue-600" /> 8,000+ Verified Hubs
            </div>
            <div className="flex items-center text-sm font-bold text-slate-700">
              <Globe className="w-4 h-4 mr-2 text-blue-600" /> 190+ Countries
            </div>
            <div className="flex items-center text-sm font-bold text-slate-700">
              <Package className="w-4 h-4 mr-2 text-blue-600" /> Real-time Updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
