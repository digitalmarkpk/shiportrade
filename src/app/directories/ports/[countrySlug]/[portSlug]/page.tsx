import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Anchor, MapPin, Ship, Plane, Train, ChevronRight, Info, 
  ArrowLeft, Activity, Layers, Shield, Phone, Mail, Globe,
  Maximize2, Box, Wind, Waves, Navigation
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCountries, getPorts, getPortBySlugs, getCountryBySlug } from '@/utils/data-utils';
import PortMapClient from '@/components/PortMapClient';

interface Props {
  params: Promise<{ countrySlug: string; portSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { countrySlug, portSlug } = await params;
  const port = await getPortBySlugs(countrySlug, portSlug);
  
  if (!port) return { title: 'Port Not Found' };
  
  return {
    title: `${port.name} (${port.un_locode}) | Port Details & Infrastructure | Shiportrade`,
    description: `Technical specifications and facilities for ${port.name} in ${port.country_name}. Includes UN/LOCODE ${port.un_locode}, coordinates, and infrastructure data.`,
  };
}

export async function generateStaticParams() {
  try {
    const countries = await getCountries();
    const ports = await getPorts();
    
    const params: { countrySlug: string; portSlug: string }[] = [];
    
    ports.forEach((port) => {
      // Find the country for this port to get the countrySlug
      const country = countries.find(c => c.country_code === port.country_code);
      
      // Robust validation: Ensure all required fields exist before adding to static params
      if (country?.slug && port?.slug) {
        params.push({
          countrySlug: country.slug,
          portSlug: port.slug,
        });
      }
    });
    
    return params;
  } catch (error) {
    console.error('Error in generateStaticParams for port pages:', error);
    return [];
  }
}

export default async function PortDetailPage({ params }: Props) {
  const { countrySlug, portSlug } = await params;
  const port = await getPortBySlugs(countrySlug, portSlug);
  const country = await getCountryBySlug(countrySlug);
  
  if (!port || !country) notFound();

  const details = port.details || {};

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Port Hero */}
      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="container mx-auto px-4 py-12 relative z-10">
          <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
            <Link href={`/directories/ports/${country.slug}`} className="hover:text-white flex items-center transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> {country.name} Ports
            </Link>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
              <div className={`p-5 rounded-3xl ${
                port.port_type === 'sea_port' ? 'bg-blue-600' :
                port.port_type === 'airport' ? 'bg-amber-600' :
                'bg-emerald-600'
              } shadow-2xl shadow-blue-900/20`}>
                {port.port_type === 'sea_port' ? <Ship className="w-10 h-10" /> :
                 port.port_type === 'airport' ? <Plane className="w-10 h-10" /> :
                 <Train className="w-10 h-10" />}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400 font-mono text-sm">
                    {port.un_locode}
                  </Badge>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 font-medium uppercase tracking-widest text-xs">
                    {port.port_type.replace('_', ' ')}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                  {port.name}
                </h1>
                <p className="text-slate-400 flex items-center text-lg">
                  <MapPin className="w-5 h-5 mr-2 text-blue-500" /> {port.city}, {country.name}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-3xl min-w-[140px]">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${port.is_active ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                  <span className="font-bold text-lg">{port.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-3xl min-w-[140px]">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Region</div>
                <div className="font-bold text-lg">{country.region}</div>
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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <Navigation className="w-6 h-6 mr-2 text-blue-600" /> Geographic Location
                </h2>
                <div className="flex gap-4 text-xs font-mono text-slate-400">
                  <span>LAT: {port.latitude.toFixed(4)}</span>
                  <span>LNG: {port.longitude.toFixed(4)}</span>
                </div>
              </div>
              <Card className="p-2 border-slate-200 shadow-xl overflow-hidden rounded-3xl bg-white">
                <PortMapClient 
                  ports={[port]} 
                  height="450px" 
                  center={[port.latitude, port.longitude]}
                  zoom={12}
                />
              </Card>
            </section>

            {/* Technical Details Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-600" /> Infrastructure
                </h3>
                <div className="space-y-4">
                  <DetailItem label="Terminal Type" value={details.terminal_type || 'Standard'} />
                  <DetailItem label="Number of Berths" value={details.berths || 'N/A'} />
                  <DetailItem label="Max Draft" value={details.max_draft ? `${details.max_draft}m` : 'N/A'} />
                  <DetailItem label="Storage Capacity" value={details.storage_capacity || 'N/A'} />
                </div>
              </Card>

              <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" /> Facilities
                </h3>
                <div className="space-y-4">
                  <DetailItem label="Customs Clearing" value={details.customs ? 'Yes' : 'N/A'} />
                  <DetailItem label="Warehousing" value={details.warehousing ? 'Available' : 'N/A'} />
                  <DetailItem label="Security Level" value={details.security_level || 'ISPS Compliant'} />
                  <DetailItem label="Operating Hours" value={details.hours || '24/7'} />
                </div>
              </Card>

              <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" /> Operations
                </h3>
                <div className="space-y-4">
                  <DetailItem label="Tug Assistance" value={details.tugs ? 'Required' : 'Optional'} />
                  <DetailItem label="Pilotage" value={details.pilotage ? 'Compulsory' : 'N/A'} />
                  <DetailItem label="Bunkering" value={details.bunkering ? 'Available' : 'N/A'} />
                  <DetailItem label="Fresh Water" value={details.water ? 'Available' : 'N/A'} />
                </div>
              </Card>

              <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Box className="w-5 h-5 mr-2 text-blue-600" /> Cargo Handling
                </h3>
                <div className="space-y-4">
                  <DetailItem label="Containerized" value="Full Support" />
                  <DetailItem label="Bulk Cargo" value={details.bulk_cargo ? 'Supported' : 'Limited'} />
                  <DetailItem label="Ro-Ro" value={details.roro ? 'Available' : 'N/A'} />
                  <DetailItem label="Hazardous" value={details.hazmat ? 'Accepted' : 'Prohibited'} />
                </div>
              </Card>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-600" /> Contact Info
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Port Authority</div>
                  <div className="font-bold text-slate-900">{details.authority || 'Local Port Management'}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</div>
                  <div className="font-bold text-slate-900 text-lg">+1 234 567 890</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</div>
                  <div className="font-bold text-slate-900">ops@{port.un_locode.toLowerCase()}.port.info</div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl h-12">
                    Send Inquiry
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-8 border-slate-200 shadow-sm rounded-3xl bg-white">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                <Waves className="w-5 h-5 mr-2 text-blue-600" /> Marine Conditions
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tide Range</span>
                  <span className="font-bold">1.2m - 4.5m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Water Density</span>
                  <span className="font-bold">1.025 kg/m³</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Ice Risk</span>
                  <span className="font-bold">None</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CivicStructure",
            "name": port.name,
            "description": `Technical specifications and facilities for ${port.name} in ${port.country_name}.`,
            "identifier": port.un_locode,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": port.city,
              "addressCountry": port.country_code
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": port.latitude,
              "longitude": port.longitude
            }
          })
        }}
      />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="font-bold text-slate-900 text-sm">{value}</span>
    </div>
  );
}
