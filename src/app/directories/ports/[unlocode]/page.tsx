import React from 'react';
import Link from 'next/link';
import { 
  Anchor, Globe, ChevronLeft, MapPin, Ship, Plane, Train, 
  Package, Info, Phone, Mail, Globe as WebIcon, Shield, 
  Settings, Activity, Maximize2, Compass
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PortMapClient from '@/components/PortMapClient';
import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { slugify } from '@/utils/slugify';

async function getPortData(unlocode: string) {
  const portsPath = path.join(process.cwd(), 'public', 'data', 'ports-main.json');
  const portsData = JSON.parse(fs.readFileSync(portsPath, 'utf8'));
  const port = portsData.find((p: any) => p.un_locode === unlocode.toUpperCase());
  
  if (!port) return null;

  const countriesPath = path.join(process.cwd(), 'public', 'data', 'countries-info.json');
  const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf8'));
  const country = countriesData.find((c: any) => c.country_code === port.country_code);

  return { port, country };
}

export async function generateMetadata({ params }: { params: { unlocode: string } }): Promise<Metadata> {
  const data = await getPortData(params.unlocode);
  if (!data) return { title: 'Port Not Found' };

  const { port, country } = data;
  return {
    title: `${port.name} (${port.un_locode}) Port Details | Shiportrade`,
    description: `Technical specifications, facilities, and contact information for ${port.name} port in ${country?.name}. UN/LOCODE: ${port.un_locode}.`,
  };
}

export default async function PortDetailPage({ params }: { params: { unlocode: string } }) {
  const data = await getPortData(params.unlocode);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Port Not Found</h1>
          <Button asChild>
            <Link href="/directories/ports">Back to Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { port, country } = data;

  const getPortIcon = (type: string) => {
    switch(type) {
      case 'sea_port': return <Ship className="w-6 h-6 text-blue-500" />;
      case 'airport': return <Plane className="w-6 h-6 text-amber-500" />;
      case 'container_terminal': return <Package className="w-6 h-6 text-emerald-500" />;
      case 'dry_port':
      case 'rail_terminal': return <Train className="w-6 h-6 text-rose-500" />;
      default: return <Anchor className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb & Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/directories/ports" className="hover:text-blue-600 transition-colors">Directory</Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <Link href={`/directories/ports/country/${slugify(country?.name || '')}`} className="hover:text-blue-600 transition-colors">
              {country?.name}
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-slate-900 font-medium">{port.name}</span>
          </nav>
          <Link 
            href={`/directories/ports/country/${slugify(country?.name || '')}`}
            className="text-sm font-bold text-blue-600 flex items-center hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to {country?.name}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8">
            <Card className="p-8 border-slate-200 overflow-hidden relative h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl -z-10" />
              
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                  {getPortIcon(port.port_type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100">
                      {port.port_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-slate-400 border-slate-200">
                      {port.un_locode}
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">Port of {port.name}</h1>
                  <div className="flex items-center text-slate-500 gap-4 text-sm">
                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {port.city}, {country?.name}</span>
                    <span className="flex items-center"><Activity className="w-4 h-4 mr-1" /> {port.is_active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto px-8 py-6 rounded-xl text-lg font-bold">
                    Get Freight Quote
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 pt-10 border-t border-slate-100">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest">Annual TEU</p>
                  <p className="text-xl font-bold text-slate-900">{port.annual_teu?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest">Max Depth</p>
                  <p className="text-xl font-bold text-slate-900">{port.max_depth_m ? `${port.max_depth_m}m` : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest">Harbor Type</p>
                  <p className="text-xl font-bold text-slate-900">{port.details?.harbor_type || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest">Timezone</p>
                  <p className="text-xl font-bold text-slate-900">{port.timezone || 'N/A'}</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="p-2 border-slate-200 h-full min-h-[300px] overflow-hidden">
              <PortMapClient 
                ports={[port]} 
                height="100%"
                center={[port.latitude, port.longitude]}
                zoom={12}
              />
            </Card>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-auto mb-6">
                <TabsTrigger value="overview" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold">
                  <Info className="w-4 h-4 mr-2" /> Overview
                </TabsTrigger>
                <TabsTrigger value="infrastructure" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold">
                  <Maximize2 className="w-4 h-4 mr-2" /> Infrastructure
                </TabsTrigger>
                <TabsTrigger value="facilities" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold">
                  <Settings className="w-4 h-4 mr-2" /> Facilities
                </TabsTrigger>
                <TabsTrigger value="services" className="rounded-lg py-2.5 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 font-bold">
                  <Shield className="w-4 h-4 mr-2" /> Services
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="p-8 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">General Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Official Name</span>
                      <span className="font-bold text-slate-900">{port.name}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">UN/LOCODE</span>
                      <span className="font-mono font-bold text-blue-600">{port.un_locode}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Port Type</span>
                      <span className="font-bold text-slate-900">{port.port_type.replace('_', ' ').toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Water Body</span>
                      <span className="font-bold text-slate-900">{port.details?.world_water_body || 'Global Waters'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Latitude</span>
                      <span className="font-mono text-slate-600">{port.latitude.toFixed(4)}°</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Longitude</span>
                      <span className="font-mono text-slate-600">{port.longitude.toFixed(4)}°</span>
                    </div>
                  </div>
                  
                  <div className="mt-10 p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex gap-4">
                      <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm h-fit">
                        <Compass className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">Port Authority & Management</h4>
                        <p className="text-blue-700/80 text-sm leading-relaxed">
                          The {port.details?.port_authority || `Port Authority of ${port.name}`} manages operations and development. 
                          Contact for terminal availability, berth scheduling, and local regulations.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="infrastructure">
                <Card className="p-8 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Channel Depth</span>
                      <span className="font-bold text-slate-900">{port.details?.channel_depth_m ? `${port.details.channel_depth_m}m` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Anchorage Depth</span>
                      <span className="font-bold text-slate-900">{port.details?.anchorage_depth_m ? `${port.details.anchorage_depth_m}m` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Max Vessel LOA</span>
                      <span className="font-bold text-slate-900">{port.details?.max_vessel_length_m ? `${port.details.max_vessel_length_m}m` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Max Vessel Beam</span>
                      <span className="font-bold text-slate-900">{port.details?.max_vessel_beam_m ? `${port.details.max_vessel_beam_m}m` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Tidal Range</span>
                      <span className="font-bold text-slate-900">{port.details?.tidal_range_m ? `${port.details.tidal_range_m}m` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-slate-50">
                      <span className="text-slate-500">Shelter</span>
                      <span className="font-bold text-slate-900">{port.details?.shelter || 'N/A'}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="facilities">
                <Card className="p-8 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Available Facilities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(port.details?.facilities || {}).map(([key, value]) => (
                      <div key={key} className={`p-4 rounded-xl border flex items-center gap-3 ${value ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-50'}`}>
                        <div className={`w-2 h-2 rounded-full ${value ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-sm font-bold uppercase tracking-wider">{key.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="services">
                <Card className="p-8 border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Marine & Support Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(port.details?.services || {}).map(([key, value]) => (
                      <div key={key} className={`p-4 rounded-xl border flex items-center gap-3 ${value ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-50'}`}>
                        <div className={`w-2 h-2 rounded-full ${value ? 'bg-blue-500' : 'bg-slate-300'}`} />
                        <span className="text-sm font-bold uppercase tracking-wider">{key.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-600" /> Contact Information
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-2">Phone</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" /> {port.details?.phone || 'Contact for info'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-2">Email</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" /> {port.details?.email || 'Contact for info'}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] text-slate-400 uppercase font-bold tracking-widest mb-2">Official Website</p>
                  <a href={port.details?.website || '#'} className="text-sm font-bold text-blue-600 flex items-center hover:underline">
                    <WebIcon className="w-3.5 h-3.5 mr-2" /> {port.details?.website ? 'Visit Port Site' : 'N/A'}
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full -mr-16 -mt-16 blur-2xl" />
              <h3 className="text-lg font-bold mb-2 relative z-10">Regional Growth</h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10">This hub has seen a 12% increase in container throughput over the last 24 months.</p>
              <div className="h-2 w-full bg-slate-800 rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4 rounded-full" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Utilization: 75%</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}