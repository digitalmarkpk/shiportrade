import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Anchor, MapPin, Ship, Plane, Train, ChevronRight, Info, ExternalLink, Globe, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCountries, getCountryBySlug, getPortsByCountryCode } from '@/utils/data-utils';
import PortMapClient from '@/components/PortMapClient';
import { slugify } from '@/utils/slugify';

interface Props {
  params: Promise<{ countrySlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  
  if (!country) return { title: 'Country Not Found' };
  
  return {
    title: `${country.name} Port Directory | Sea, Air & Dry Ports | Shiportrade`,
    description: `Complete list of transport hubs in ${country.name}. Find infrastructure details, coordinates, and technical data for ${country.total_sea_ports} sea ports and ${country.total_airports} airports.`,
  };
}

export async function generateStaticParams() {
  const countries = await getCountries();
  return countries.map((c) => ({
    countrySlug: c.slug,
  }));
}

export default async function CountryPortsPage({ params }: Props) {
  const { countrySlug } = await params;
  const country = await getCountryBySlug(countrySlug);
  
  if (!country) notFound();
  
  const ports = await getPortsByCountryCode(country.country_code);
  const sortedPorts = [...ports].sort((a, b) => a.name.localeCompare(b.name));

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Directories', href: '/directories' },
    { name: 'Ports', href: '/directories/ports' },
    { name: country.name, href: `/directories/ports/${country.slug}` },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Country Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
            <Link href="/directories/ports" className="hover:text-blue-600 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
            </Link>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <span className="text-7xl shadow-sm rounded-lg p-2 bg-slate-50">{country.flag_emoji || '🏳️'}</span>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{country.name}</h1>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100">
                    {country.region}
                  </Badge>
                  <Badge variant="outline" className="text-slate-500">
                    ISO: {country.country_code}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Ports</div>
                <div className="text-2xl font-bold">{ports.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Map */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600" /> Interactive Map
              </h2>
              <Card className="p-2 border-slate-200 shadow-xl overflow-hidden rounded-3xl">
                <PortMapClient 
                  ports={ports} 
                  height="450px" 
                />
              </Card>
            </section>

            {/* Ports List */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <Anchor className="w-6 h-6 mr-2 text-blue-600" /> Port List
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {sortedPorts.map((port) => (
                  <Link key={port.id} href={`/directories/ports/${country.slug}/${port.slug}`}>
                    <Card className="group p-6 hover:border-blue-500 hover:shadow-lg transition-all border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          port.port_type === 'sea_port' ? 'bg-blue-50 text-blue-600' :
                          port.port_type === 'airport' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {port.port_type === 'sea_port' ? <Ship className="w-6 h-6" /> :
                           port.port_type === 'airport' ? <Plane className="w-6 h-6" /> :
                           <Train className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {port.name}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="font-mono font-bold">{port.un_locode}</span>
                            <span>•</span>
                            <span>{port.city}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white sticky top-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" /> Quick Facts
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Capital City</div>
                  <div className="font-bold text-slate-900 text-lg">{country.capital || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Currency</div>
                  <div className="font-bold text-slate-900 text-lg">{country.currency || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Coastline</div>
                  <div className="font-bold text-slate-900 text-lg">{country.coastline_km?.toLocaleString() || 0} km</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Landlocked</div>
                  <div className="font-bold text-slate-900 text-lg">{country.is_landlocked ? 'Yes' : 'No'}</div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">Airports</div>
                      <div className="text-xl font-extrabold text-amber-600">{country.total_airports || 0}</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="text-xs font-bold text-slate-400 uppercase mb-1">Dry Ports</div>
                      <div className="text-xl font-extrabold text-rose-600">{country.total_dry_ports || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-blue-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
              <h3 className="text-xl font-bold mb-4 relative z-10">Export to {country.name}?</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed relative z-10">
                Get instant freight quotes and handle documentation for shipments to {country.name}.
              </p>
              <Button variant="secondary" className="w-full font-bold relative z-10">
                Get Quote <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
