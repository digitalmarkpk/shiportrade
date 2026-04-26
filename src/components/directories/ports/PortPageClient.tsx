'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Anchor, 
  MapPin, 
  Ship, 
  Globe, 
  ArrowLeft, 
  Info, 
  BarChart3, 
  ExternalLink,
  Navigation,
  Waves,
  Maximize2,
  Clock,
  Phone,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { Port } from '@/utils/data-utils';

const PortMap = dynamic(() => import('@/components/GlobalPortsMap'), { ssr: false });

interface PortPageClientProps {
  port: Port;
  nearbyPorts: Port[];
  otherCountryPorts: Port[];
}

export default function PortPageClient({ port, nearbyPorts, otherCountryPorts }: PortPageClientProps) {
  const isAirport = port.port_type === 'Airport';
  const isDryPort = port.port_type === 'Dry Port';
  const prefix = isAirport ? '' : isDryPort ? 'Dry Port of ' : 'Port of ';
  
  // Generate a detailed description
  const description = `${prefix}${port.name}, identified by the UN/LOCODE ${port.unlocode}, is a premier ${port.port_type.toLowerCase()} situated in ${port.country_name}. This facility plays an indispensable role in the ${port.region} ${isAirport ? 'aviation' : 'logistics'} infrastructure, serving as a critical gateway for international trade and logistics. With its strategic geographic position at coordinates ${port.latitude.toFixed(4)}°N, ${port.longitude.toFixed(4)}°E, it provides essential connectivity between global ${isAirport ? 'air routes' : 'shipping lanes'} and the domestic markets of ${port.country_name}.

The ${isAirport ? 'airport' : 'port'}'s technical capabilities are impressive${!isAirport ? `, featuring a maximum draft of ${port.max_depth_m} meters, which allows it to accommodate ${port.max_depth_m > 13 ? 'the world\'s largest container ships and deep-draft bulk carriers' : 'a wide range of modern commercial vessels'}` : ''}. Its annual throughput of approximately ${(port.annual_teu / 1e6).toFixed(1)} million ${isAirport ? 'passengers/cargo units' : 'TEU'} underscores its status as a high-capacity hub within the ${port.subregion}. The facility is equipped with advanced cargo handling technology and specialized terminals for ${(port.major_exports || []).slice(0, 3).join(', ')} and ${(port.major_imports || []).slice(0, 2).join(', ')}, ensuring efficient turnaround times for global carriers.

Beyond its physical infrastructure, ${prefix}${port.name} is a key economic driver for ${port.city || 'the region'}, supporting thousands of jobs and facilitating seamless supply chain operations. It operates in the ${port.timezone} timezone and is complemented by its proximity to other major hubs like ${(nearbyPorts || []).slice(0, 2).map(p => p.name).join(' and ')}, further strengthening the regional ${isAirport ? 'aviation' : 'maritime'} network. For businesses looking to optimize their global logistics, ${port.name} offers a reliable and sophisticated platform for ${isAirport ? 'air' : 'maritime'} commerce.`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Port Hero */}
      <div className="bg-slate-900 pt-32 pb-48 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Navigation className="w-3 h-3 mx-1" />
            <Link href="/directories/ports" className="hover:text-white transition-colors">Ports</Link>
            <Navigation className="w-3 h-3 mx-1" />
            <Link href={`/directories/ports/country/${port.country_slug}`} className="hover:text-white transition-colors">{port.country_name}</Link>
            <Navigation className="w-3 h-3 mx-1" />
            <span className="text-blue-400 font-bold">{port.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="p-6 rounded-[32px] bg-blue-600 shadow-2xl shadow-blue-600/40 relative">
                <Ship className="w-12 h-12 text-white" />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-900">
                  <Image 
                    src={`https://flagcdn.com/w40/${port.country_code.toLowerCase()}.png`}
                    alt={port.country_name}
                    width={24}
                    height={16}
                    className="rounded-sm"
                    unoptimized
                  />
                </div>
              </div>
              <div className="text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-mono text-sm px-3 py-1">
                    {port.unlocode}
                  </Badge>
                  <Badge variant="outline" className="border-slate-700 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                    {port.port_type}
                  </Badge>
                  {port.annual_teu > 1000000 && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                      Major Global Hub
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                  {prefix}{port.name} <span className="text-blue-500">({port.unlocode})</span>
                </h1>
                <p className="text-xl text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  {port.country_name} • {port.region}
                </p>
              </div>
            </div>

            <div className="hidden lg:flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 font-black shadow-lg shadow-blue-600/20 transition-all hover:translate-y-[-2px]">
                Calculate Shipping to {isAirport ? 'Airport' : 'Port'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-32 pb-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Main Info */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white/80 backdrop-blur-xl border-slate-100 p-6 rounded-[24px] shadow-lg shadow-slate-200/50">
                <BarChart3 className="w-5 h-5 text-blue-600 mb-3" />
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Annual TEU</div>
                <div className="text-2xl font-black text-slate-900">{(port.annual_teu / 1e6).toFixed(1)}M</div>
              </Card>
              <Card className="bg-white/80 backdrop-blur-xl border-slate-100 p-6 rounded-[24px] shadow-lg shadow-slate-200/50">
                <Waves className="w-5 h-5 text-emerald-600 mb-3" />
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Depth</div>
                <div className="text-2xl font-black text-slate-900">{port.max_depth_m}m</div>
              </Card>
              <Card className="bg-white/80 backdrop-blur-xl border-slate-100 p-6 rounded-[24px] shadow-lg shadow-slate-200/50">
                <Maximize2 className="w-5 h-5 text-amber-600 mb-3" />
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Harbor Size</div>
                <div className="text-2xl font-black text-slate-900">{port.harbor_size}</div>
              </Card>
              <Card className="bg-white/80 backdrop-blur-xl border-slate-100 p-6 rounded-[24px] shadow-lg shadow-slate-200/50">
                <Clock className="w-5 h-5 text-purple-600 mb-3" />
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timezone</div>
                <div className="text-lg font-black text-slate-900 truncate">{port.timezone}</div>
              </Card>
            </div>

            {/* Map Section */}
            <Card className="bg-white rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden p-2">
              <div className="h-[450px] rounded-[28px] overflow-hidden relative border border-slate-100">
                <PortMap ports={[port]} height="100%" zoom={13} center={[port.latitude, port.longitude]} />
                <div className="absolute bottom-6 left-6 z-[400] bg-slate-900/90 backdrop-blur text-white px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Coordinates</div>
                  <div className="font-mono font-bold">{port.latitude.toFixed(4)}, {port.longitude.toFixed(4)}</div>
                </div>
              </div>
            </Card>

            {/* Description & Technical Data */}
            <Card className="bg-white rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Port Overview & Facilities</h2>
              </div>

              <div className="prose prose-slate max-w-none mb-12">
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600" /> Key Technical Specs
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">UN/LOCODE</span>
                      <span className="font-bold text-slate-900">{port.unlocode}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Port Type</span>
                      <span className="font-bold text-slate-900">{port.port_type}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Maximum Depth</span>
                      <span className="font-bold text-slate-900">{port.max_depth_m} Meters</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Annual Throughput</span>
                      <span className="font-bold text-slate-900">{(port.annual_teu / 1e6).toFixed(1)}M TEU</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Operational Details
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Harbor Size</span>
                      <span className="font-bold text-slate-900">{port.harbor_size}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Timezone</span>
                      <span className="font-bold text-slate-900">{port.timezone}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Website</span>
                      <a href={port.website} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
                        Official Site <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Nearby Airport</span>
                      <span className="font-bold text-slate-900">{port.has_airport ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Nearby Ports */}
            {nearbyPorts.length > 0 && (
              <section>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" /> Nearby Maritime Hubs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(nearbyPorts || []).map(np => (
                    <Link 
                      key={np.unlocode} 
                      href={`/directories/ports/${np.country_slug}/${np.slug}`}
                      className="group flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-600/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          <Anchor className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div>
                          <div className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{np.name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{np.unlocode} • {np.port_type}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Quick Contact / Actions */}
            <Card className="bg-slate-900 rounded-[32px] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full -mr-24 -mt-24" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white mb-6 leading-tight">Plan Your Logistics to {port.name}</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Real-time Freight Rates</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Verified Port Authority Data</span>
                  </div>
                </div>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-14 font-black transition-all hover:translate-y-[-2px] mb-4">
                  Get Instant Quote
                </Button>
                <Button variant="ghost" className="w-full text-white hover:bg-white/10 rounded-2xl h-14 font-bold">
                  Contact Port Agent
                </Button>
              </div>
            </Card>

            {/* Other Ports in Country */}
            <Card className="bg-white rounded-[32px] border-slate-100 shadow-xl shadow-slate-200/50 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-slate-900 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Other Ports in {port.country_name}
                </h3>
                <Link href={`/directories/ports/country/${port.country_slug}`}>
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-600">View All</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {(otherCountryPorts || []).map(p => (
                  <Link 
                    key={p.unlocode} 
                    href={`/directories/ports/${p.country_slug}/${p.slug}`}
                    className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex-shrink-0 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Anchor className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{p.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.unlocode}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Quick Links / FAQ Card */}
            <Card className="bg-blue-600 rounded-[32px] p-8 text-white">
              <h3 className="text-xl font-black mb-6">Need Support?</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Our logistics experts are available 24/7 to help you manage shipments through {port.name}.
              </p>
              <div className="space-y-4">
                <a href="tel:+1234567890" className="flex items-center gap-3 font-bold hover:translate-x-1 transition-transform">
                  <Phone className="w-5 h-5" /> +1 (234) 567-890
                </a>
                <a href="mailto:support@shiportrade.com" className="flex items-center gap-3 font-bold hover:translate-x-1 transition-transform">
                  <Globe className="w-5 h-5" /> support@shiportrade.com
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
