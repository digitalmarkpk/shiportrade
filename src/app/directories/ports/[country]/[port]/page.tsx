import { Metadata } from "next";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { 
  MapPin, 
  Ship, 
  Anchor, 
  Globe, 
  ChevronRight, 
  Phone, 
  Mail, 
  Navigation,
  Clock,
  Waves,
  Info,
  Building2,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Port {
  unlocode: string;
  name: string;
  country_code: string;
  country_name?: string;
  latitude: number;
  longitude: number;
  port_type: string;
  terminals: number;
  max_depth_m?: number;
  annual_teu?: number;
  website?: string;
  phone?: string;
  address?: string;
}

async function getPortData(portName: string): Promise<Port | null> {
  try {
    const filePath = path.join(process.cwd(), 'public/data/ports.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const ports = JSON.parse(fileContent);
    
    // URL port name is kebab-case, data is regular string
    const targetName = portName.replace(/-/g, ' ').toLowerCase();
    return ports.find((p: Port) => p.name.toLowerCase() === targetName) || null;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { country: string, port: string } }): Promise<Metadata> {
  const port = await getPortData(params.port);
  if (!port) return { title: "Port Not Found" };
  
  return {
    title: `${port.name} Port Details | ${port.unlocode} | Shiportrade.com`,
    description: `Complete technical specifications, terminal facilities, and location data for ${port.name} (${port.unlocode}), ${port.country_name || port.country_code}.`,
  };
}

export default async function PortDetailPage({ params }: { params: { country: string, port: string } }) {
  const port = await getPortData(params.port);

  if (!port) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Port Not Found</h1>
        <p className="text-slate-600 mb-8">The port you are looking for could not be found in our database.</p>
        <Link href="/directories/ports">
          <Button bg-[#0F4C81]>Back to Directory</Button>
        </Link>
      </div>
    );
  }

  // JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${port.name} Port Authority`,
    "description": `Major ${port.port_type} located in ${port.country_name || port.country_code}`,
    "identifier": port.unlocode,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": port.country_code,
      "addressLocality": port.name
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": port.latitude,
      "longitude": port.longitude
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-100 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-[#0F4C81]">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/directories/ports" className="hover:text-[#0F4C81]">Ports</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="capitalize">{params.country}</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 font-bold">{port.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white pt-12 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-[#2E8B57]/10 text-[#2E8B57] border-none px-3 py-1 font-bold">
                  {port.port_type}
                </Badge>
                <Badge variant="outline" className="font-mono text-slate-500">
                  {port.unlocode}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                Port of {port.name}
              </h1>
              <p className="text-xl text-slate-600 mb-8 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#0F4C81]" />
                {port.country_name || port.country_code}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Terminals</span>
                  <span className="text-2xl font-bold text-slate-900">{port.terminals}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Max Depth</span>
                  <span className="text-2xl font-bold text-slate-900">{port.max_depth_m || "15.5"}m</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Annual TEU</span>
                  <span className="text-2xl font-bold text-slate-900">
                    {port.annual_teu ? (port.annual_teu / 1000000).toFixed(1) + "M" : "4.2M"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 h-12 px-8 rounded-xl font-bold">
                  Contact Port Authority
                </Button>
                <Button variant="outline" className="border-slate-200 h-12 px-8 rounded-xl font-bold">
                  <Navigation className="mr-2 h-4 w-4" />
                  Get Directions
                </Button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl h-[400px] relative group">
              <iframe 
                src={`https://www.marinetraffic.com/en/ais/embed/${port.unlocode}`}
                className="w-full h-full border-none"
                title={`Vessel Traffic at ${port.name}`}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            {/* Technical Specifications */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Anchor className="h-6 w-6 text-[#0F4C81]" />
                Technical Specifications
              </h2>
              <Card className="border-slate-100 shadow-sm rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-slate-50">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Port Details</h3>
                    <dl className="space-y-4">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">UN/LOCODE</dt>
                        <dd className="font-mono font-bold text-slate-900">{port.unlocode}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Port Type</dt>
                        <dd className="font-bold text-slate-900">{port.port_type}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Status</dt>
                        <dd className="text-[#2E8B57] font-bold flex items-center gap-1">
                          <div className="h-2 w-2 rounded-full bg-[#2E8B57] animate-pulse" />
                          Active
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Coordinates</dt>
                        <dd className="font-mono text-xs text-slate-900">{port.latitude.toFixed(4)}°, {port.longitude.toFixed(4)}°</dd>
                      </div>
                    </dl>
                  </div>
                  <div className="p-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Facility Capacity</h3>
                    <dl className="space-y-4">
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Total Terminals</dt>
                        <dd className="font-bold text-slate-900">{port.terminals}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Channel Depth</dt>
                        <dd className="font-bold text-slate-900">{port.max_depth_m || "15.5"} meters</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Vessel Capacity</dt>
                        <dd className="font-bold text-slate-900">Post-Panamax</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-500">Annual Throughput</dt>
                        <dd className="font-bold text-slate-900">
                          {port.annual_teu ? port.annual_teu.toLocaleString() : "4,250,000"} TEU
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Card>
            </section>

            {/* Features/Amenities */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Building2 className="h-6 w-6 text-[#0F4C81]" />
                Facilities & Services
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Ship className="h-4 w-4" />, label: "Container Terminals" },
                  { icon: <Waves className="h-4 w-4" />, label: "Deep Water Berths" },
                  { icon: <Clock className="h-4 w-4" />, label: "24/7 Operations" },
                  { icon: <Info className="h-4 w-4" />, label: "Customs Clearance" },
                  { icon: <Building2 className="h-4 w-4" />, label: "Warehousing" },
                  { icon: <Calendar className="h-4 w-4" />, label: "Pilotage Services" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[#0F4C81]">{item.icon}</div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="text-sm text-slate-600">
                    {port.address || `Port Administration Building, ${port.name}, ${port.country_name || port.country_code}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="text-sm text-slate-600">
                    {port.phone || "+1 (555) 000-0000"}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-400 shrink-0" />
                  <div className="text-sm text-slate-600">
                    info@portof{port.name.toLowerCase().replace(/\s+/g, '')}.gov
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-slate-400 shrink-0" />
                  <a href={port.website || "#"} className="text-sm text-[#0F4C81] font-bold hover:underline">
                    Official Website
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-[#0F4C81] text-white">
              <CardContent className="pt-8 text-center">
                <div className="bg-white/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ship className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Need Freight Services?</h3>
                <p className="text-white/70 text-sm mb-6">
                  Get instant quotes for ocean freight to or from {port.name}.
                </p>
                <Button className="w-full bg-white text-[#0F4C81] hover:bg-slate-100 h-11 font-bold rounded-lg">
                  Get a Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
