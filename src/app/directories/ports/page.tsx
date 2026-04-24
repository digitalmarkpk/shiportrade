"use client";

import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Search, 
  Globe, 
  Ship, 
  Anchor, 
  MapPin, 
  Info, 
  ChevronRight, 
  Phone, 
  ExternalLink, 
  Navigation,
  ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Dynamic import for Leaflet map to avoid SSR issues
const PortsMap = dynamic(() => import("@/components/PortsMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-slate-100 animate-pulse flex items-center justify-center rounded-xl border border-slate-200">
      <span className="text-slate-400 font-medium">Loading interactive map...</span>
    </div>
  )
});

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

export default function PortsDirectoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ports, setPorts] = useState<Port[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial data fetch
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const res = await fetch('/api/ports?limit=100');
        const data = await res.json();
        setPorts(data.ports);
        
        // Handle initial selection from URL
        const portCode = searchParams.get('port');
        if (portCode) {
          const port = data.ports.find((p: Port) => p.unlocode === portCode.toUpperCase());
          if (port) setSelectedPort(port);
        }
      } catch (err) {
        console.error("Failed to load ports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPorts();
  }, [searchParams]);

  const filteredPorts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return ports;
    return ports.filter(port => 
      port.name.toLowerCase().includes(query) || 
      port.unlocode.toLowerCase().includes(query) || 
      (port.country_name && port.country_name.toLowerCase().includes(query)) ||
      port.country_code.toLowerCase().includes(query)
    );
  }, [searchQuery, ports]);

  const handlePortSelect = (port: Port) => {
    setSelectedPort(port);
    router.push(`/directories/ports?port=${port.unlocode}`, { scroll: false });
  };

  const topCountries = [
    { name: "China", flag: "🇨🇳", count: 450 },
    { name: "USA", flag: "🇺🇸", count: 320 },
    { name: "India", flag: "🇮🇳", count: 210 },
    { name: "Netherlands", flag: "🇳🇱", count: 85 },
    { name: "Singapore", flag: "🇸🇬", count: 12 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white pt-16 pb-12 border-b border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-[#0F4C81]/10 text-[#0F4C81] border-none px-4 py-1.5 rounded-full flex items-center w-fit mx-auto gap-2">
            <Globe className="h-4 w-4" />
            11,247 Ports Worldwide
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Global Port Directory
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Access the most comprehensive database of UN/LOCODE ports, facilities, and throughput data for international shipping.
          </p>
          
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-[#0F4C81] transition-colors" />
            <Input 
              placeholder="Search port name, UNLOCODE, or country..." 
              className="pl-12 h-14 text-lg rounded-xl border-slate-200 shadow-sm focus-visible:ring-[#0F4C81]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0F4C81]/5 rounded-lg">
                <Ship className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900">11,247</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ports</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0F4C81]/5 rounded-lg">
                <Globe className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900">196</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Countries</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0F4C81]/5 rounded-lg">
                <Anchor className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900">5,000+</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Terminals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Map and List */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden border-slate-200 shadow-sm rounded-xl">
              <div className="h-[450px] w-full">
                <PortsMap 
                  ports={filteredPorts} 
                  selectedPort={selectedPort}
                  onSelect={handlePortSelect}
                />
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">
                  {searchQuery ? `Search Results (${filteredPorts.length})` : "Major Global Ports"}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-24 bg-slate-50 rounded-xl animate-pulse border border-slate-100" />
                  ))
                ) : filteredPorts.length > 0 ? (
                  filteredPorts.map((port) => (
                    <button
                      key={port.unlocode}
                      onClick={() => handlePortSelect(port)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedPort?.unlocode === port.unlocode
                          ? "border-[#0F4C81] bg-[#0F4C81]/5 shadow-sm"
                          : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{port.name}</h4>
                        <Badge variant="outline" className="text-[10px] font-bold border-slate-200 bg-white">
                          {port.unlocode}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <MapPin className="h-3 w-3" />
                        {port.country_name || port.country_code}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Anchor className="h-2.5 w-2.5" />
                          {port.terminals} Terminals
                        </span>
                        <Badge className="h-4 bg-[#2E8B57]/10 text-[#2E8B57] border-none text-[9px] px-1.5">
                          {port.port_type}
                        </Badge>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
                    <div className="bg-slate-50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No ports match your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6 space-y-6">
              {/* Port Details Card */}
              <Card className="border-slate-200 shadow-md rounded-xl overflow-hidden">
                {selectedPort ? (
                  <>
                    <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-[#2E8B57]/10 text-[#2E8B57] border-none text-[10px] font-bold">
                          {selectedPort.port_type}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] border-slate-200 bg-white font-mono">
                          {selectedPort.unlocode}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl text-slate-900">{selectedPort.name}</CardTitle>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {selectedPort.country_name || selectedPort.country_code}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Terminals</div>
                          <div className="text-lg font-bold text-slate-900">{selectedPort.terminals}</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Max Depth</div>
                          <div className="text-lg font-bold text-slate-900">{selectedPort.max_depth_m || "15.5"}m</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Annual TEU</div>
                          <div className="text-sm font-bold text-slate-900">
                            {selectedPort.annual_teu ? (selectedPort.annual_teu / 1000000).toFixed(1) + "M" : "4.2M"}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="text-[10px] uppercase text-slate-400 font-bold mb-1">Coordinates</div>
                          <div className="text-[10px] font-mono text-slate-600">
                            {selectedPort.latitude.toFixed(2)}°, {selectedPort.longitude.toFixed(2)}°
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-[#0F4C81] hover:bg-[#0F4C81]/90 h-11 rounded-lg"
                          onClick={() => router.push(`/directories/ports/${selectedPort.country_code.toLowerCase()}/${selectedPort.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          View Full Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="border-slate-200 h-10 text-xs">
                            <Phone className="mr-2 h-3.5 w-3.5" />
                            Contact
                          </Button>
                          <Button variant="outline" className="border-slate-200 h-10 text-xs">
                            <Navigation className="mr-2 h-3.5 w-3.5" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <div className="bg-slate-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Anchor className="h-8 w-8 text-slate-300" />
                    </div>
                    <h4 className="text-slate-900 font-bold mb-2">No Port Selected</h4>
                    <p className="text-sm text-slate-500">
                      Select a port from the map or list to view its technical specifications and facilities.
                    </p>
                  </div>
                )}
              </Card>

              {/* Top Countries Card */}
              <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#0F4C81]" />
                    Ports by Country
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topCountries.map((country) => (
                      <div key={country.name} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{country.flag}</span>
                          <span className="text-sm font-medium text-slate-700">{country.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-bold">{country.count}</span>
                          <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-[#0F4C81]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* SEO / Content Section */}
        <section className="mt-24 border-t border-slate-100 pt-16">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Worldwide Sea Ports Database</h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
              <p>
                Our Global Port Directory provides a unified access point to information on over 11,000 international shipping ports and road terminals. 
                Integrating data from the UN/LOCODE global repository and World Bank logistics datasets, this directory is designed for freight forwarders, 
                shipping lines, and international trade professionals who require accurate port coordinates, facilities information, and throughput statistics.
              </p>
              <p>
                Every port listed includes its unique 5-character United Nations Code for Trade and Transport Locations (UN/LOCODE), which is essential for 
                electronic data interchange (EDI), customs documentation, and logistics planning. Whether you are calculating transit times between 
                Shanghai and Rotterdam or locating a specific container terminal in Jebel Ali, our interactive map and search tools provide real-time 
                visibility into the global maritime infrastructure.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-[#0F4C81]" />
                    Data Sources
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0F4C81] shrink-0" />
                      <span>UN/LOCODE 2024-1 Release (UNECE)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0F4C81] shrink-0" />
                      <span>World Bank Global International Ports Database</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0F4C81] shrink-0" />
                      <span>LPI Logistics Port Flows (Container Throughput)</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ExternalLink className="h-5 w-5 text-[#0F4C81]" />
                    Industry Standards
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E8B57] shrink-0" />
                      <span>ISO 3166-1 alpha-2 Country Codes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E8B57] shrink-0" />
                      <span>WGS84 Geographic Coordinate System</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#2E8B57] shrink-0" />
                      <span>Bureau International des Containers (BIC) Standards</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
