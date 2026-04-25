"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Globe, Anchor, Ship, Plane, Train, Package, 
  Map as MapIcon, BarChart3, HelpCircle, ChevronRight, 
  ChevronDown, Filter, Info, MapPin, ExternalLink, Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { slugify } from "@/utils/slugify";
import dynamicImport from 'next/dynamic';
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import map to avoid SSR issues
const GlobalPortsMap = dynamicImport(() => import("@/components/GlobalPortsMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center">
    <MapIcon className="h-12 w-12 text-slate-300" />
  </div>
});

interface CountryInfo {
  id: number;
  country_code: string;
  name: string;
  slug: string;
  capital: string;
  currency: string;
  coastline_km: number;
  population: number;
  flag_emoji: string;
  region: string;
  is_landlocked: boolean;
  total_sea_ports: number;
  total_airports: number;
  total_dry_ports: number;
}

interface Port {
  id: number;
  un_locode: string;
  name: string;
  slug: string;
  country_id: number;
  country_code: string;
  country_name: string;
  city: string;
  port_type: 'sea_port' | 'airport' | 'dry_port' | 'container_terminal' | 'rail_terminal';
  latitude: number;
  longitude: number;
  is_active: boolean;
  annual_teu?: number;
}

export default function PortsDirectoryPage() {
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("directory");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({
    "Asia": true,
    "Europe": true,
    "Americas": true,
    "Africa": true,
    "Oceania": true
  });

  useEffect(() => {
    Promise.all([
      fetch("/data/countries-info.json").then((res) => res.json()),
      fetch("/data/ports-main.json").then((res) => res.json()),
    ])
      .then(([countriesData, portsData]) => {
        setCountries(countriesData.sort((a: any, b: any) => a.name.localeCompare(b.name)));
        setPorts(portsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load directory data:", err);
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    return {
      countries: countries.length,
      ports: ports.length,
      seaPorts: ports.filter(p => p.port_type === 'sea_port').length,
      airports: ports.filter(p => p.port_type === 'airport').length,
      dryPorts: ports.filter(p => p.port_type === 'dry_port' || p.port_type === 'container_terminal' || p.port_type === 'rail_terminal').length,
    };
  }, [countries, ports]);

  const filteredCountries = useMemo(() => {
    let result = countries;
    
    if (selectedRegion) {
      result = result.filter(c => c.region === selectedRegion);
    }

    if (selectedType) {
      // Filter countries that have at least one port of the selected type
      const countriesWithType = new Set(
        ports
          .filter(p => p.port_type === selectedType)
          .map(p => p.country_code)
      );
      result = result.filter(c => countriesWithType.has(c.country_code));
    }

    if (search) {
      const query = search.toLowerCase();
      // Match country name/code OR port name/locode
      const matchingPortCountries = new Set(
        ports
          .filter(p => p.name.toLowerCase().includes(query) || p.un_locode.toLowerCase().includes(query))
          .map(p => p.country_code)
      );

      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.country_code.toLowerCase().includes(query) ||
          matchingPortCountries.has(c.country_code)
      );
    }

    return result;
  }, [search, countries, ports, selectedRegion, selectedType]);

  const countriesByRegion = useMemo(() => {
    const grouped: Record<string, CountryInfo[]> = {};
    filteredCountries.forEach(c => {
      const region = c.region || "Other";
      if (!grouped[region]) grouped[region] = [];
      grouped[region].push(c);
    });
    return grouped;
  }, [filteredCountries]);

  const toggleRegion = (region: string) => {
    setExpandedRegions(prev => ({ ...prev, [region]: !prev[region] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-600 font-medium">Loading Global Port Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-50">
                <Globe className="w-3 h-3 mr-1" /> Worldwide Network
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                Global Port Directory
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
                Explore ports worldwide – sea ports, airports, dry ports, and container terminals with real-time data and technical specifications.
              </p>
            </motion.div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12 relative group">
              <div className="absolute inset-0 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-colors rounded-full" />
              <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-lg p-1.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                <Search className="ml-4 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search port name, city, country, or UN/LOCODE..."
                  className="border-0 focus-visible:ring-0 text-lg h-12 bg-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 font-medium">
                  Search
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {[
                { label: "Countries", value: stats.countries, icon: Globe, color: "text-blue-600" },
                { label: "Total Ports", value: stats.ports, icon: MapPin, color: "text-indigo-600" },
                { label: "Sea Ports", value: stats.seaPorts, icon: Ship, color: "text-emerald-600" },
                { label: "Airports", value: stats.airports, icon: Plane, color: "text-amber-600" },
                { label: "Dry Ports", value: stats.dryPorts, icon: Package, color: "text-rose-600" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-4 border-slate-100 shadow-sm hover:shadow-md transition-all text-center">
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mx-auto mb-3 ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{stat.value.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 container mx-auto px-4">
        <Tabs defaultValue="directory" className="w-full" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-auto">
              <TabsTrigger value="directory" className="rounded-lg py-2 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <Globe className="w-4 h-4 mr-2" /> Directory
              </TabsTrigger>
              <TabsTrigger value="map" className="rounded-lg py-2 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <MapIcon className="w-4 h-4 mr-2" /> Map View
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg py-2 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <BarChart3 className="w-4 h-4 mr-2" /> Analytics
              </TabsTrigger>
              <TabsTrigger value="faqs" className="rounded-lg py-2 px-6 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                <HelpCircle className="w-4 h-4 mr-2" /> FAQs
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Port Type Filter */}
              <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                {[
                  { label: "All", value: null, icon: Globe },
                  { label: "Sea Ports", value: "sea_port", icon: Ship },
                  { label: "Airports", value: "airport", icon: Plane },
                  { label: "Dry Ports", value: "dry_port", icon: Train },
                  { label: "Terminals", value: "container_terminal", icon: Package },
                ].map((type) => (
                  <button
                    key={type.label}
                    onClick={() => setSelectedType(selectedType === type.value ? null : type.value)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                      selectedType === type.value 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <type.icon className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{type.label}</span>
                  </button>
                ))}
              </div>

              {/* Region Filter */}
              <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                {["Asia", "Europe", "Americas", "Africa", "Oceania"].map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(selectedRegion === region ? null : region)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedRegion === region 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <TabsContent value="directory" className="space-y-12">
            {Object.entries(countriesByRegion).map(([region, regionCountries]) => (
              <div key={region} className="space-y-6">
                <div 
                  className="flex items-center justify-between cursor-pointer group"
                  onClick={() => toggleRegion(region)}
                >
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                    <span className="w-2 h-8 bg-blue-600 rounded-full mr-3" />
                    {region}
                    <span className="ml-3 text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {regionCountries.length}
                    </span>
                  </h2>
                  <div className="flex items-center text-slate-400 group-hover:text-blue-600 transition-colors">
                    <span className="text-sm font-medium mr-2">{expandedRegions[region] ? "Collapse" : "Expand"}</span>
                    {expandedRegions[region] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>

                {expandedRegions[region] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {regionCountries.map((country) => (
                      <motion.div
                        key={country.country_code}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="group overflow-hidden border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="text-4xl">{country.flag_emoji}</div>
                              <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold border-slate-100 text-slate-400">
                                {country.country_code}
                              </Badge>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {country.name}
                            </h3>
                            <div className="text-sm text-slate-500 mb-6 flex items-center">
                              <MapPin className="w-3 h-3 mr-1" /> {country.capital} • {country.currency}
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-6">
                              <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <Ship className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                                <div className="text-sm font-bold text-slate-900">{country.total_sea_ports}</div>
                                <div className="text-[10px] text-slate-400 uppercase">Sea</div>
                              </div>
                              <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <Plane className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                                <div className="text-sm font-bold text-slate-900">{country.total_airports}</div>
                                <div className="text-[10px] text-slate-400 uppercase">Air</div>
                              </div>
                              <div className="text-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <Train className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                                <div className="text-sm font-bold text-slate-900">{country.total_dry_ports}</div>
                                <div className="text-[10px] text-slate-400 uppercase">Dry</div>
                              </div>
                            </div>

                            <Button asChild className="w-full bg-slate-900 hover:bg-blue-600 text-white transition-colors py-6 rounded-xl">
                              <Link href={`/directories/ports/country/${country.slug}`}>
                                View Ports <ChevronRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </div>
                          
                          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[11px] font-medium text-slate-400">
                            <span className="flex items-center">
                              <Activity className="w-3 h-3 mr-1" /> 
                              {country.is_landlocked ? "Landlocked" : `${country.coastline_km.toLocaleString()}km Coast`}
                            </span>
                            <span>{country.population > 1000000 ? `${(country.population / 1000000).toFixed(1)}M Pop` : "Small Pop"}</span>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="map">
            <Card className="p-2 border-slate-200 overflow-hidden shadow-2xl">
              <GlobalPortsMap 
                ports={ports} 
                height="700px" 
                maxMarkers={1000}
                onSelect={(port) => {
                  window.location.href = `/directories/ports/${port.un_locode}`;
                }}
              />
            </Card>
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-sm font-medium text-slate-600">Sea Ports</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-amber-600" />
                <span className="text-sm font-medium text-slate-600">Airports</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-emerald-600" />
                <span className="text-sm font-medium text-slate-600">Dry Ports / ICDs</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <Anchor className="w-5 h-5 mr-2 text-blue-600" /> Top Port Hubs by Region
                </h3>
                <div className="space-y-6">
                  {["Asia", "Europe", "Americas", "Africa", "Oceania"].map(region => {
                    const count = countries.filter(c => c.region === region).reduce((acc, c) => acc + c.total_sea_ports, 0);
                    return (
                      <div key={region} className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-slate-600">{region}</span>
                          <span className="text-slate-900">{count} Ports</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(count / stats.ports) * 100}%` }}
                            className="bg-blue-600 h-full rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-8 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" /> Infrastructure Distribution
                </h3>
                <div className="space-y-6">
                  {[
                    { label: "Sea Ports", count: stats.seaPorts, color: "bg-blue-500", icon: Ship },
                    { label: "Airports", count: stats.airports, color: "bg-amber-500", icon: Plane },
                    { label: "Dry Ports", count: stats.dryPorts, color: "bg-rose-500", icon: Train },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-slate-600 flex items-center">
                          <item.icon className="w-4 h-4 mr-2" /> {item.label}
                        </span>
                        <span className="text-slate-900">{((item.count / stats.ports) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.count / stats.ports) * 100}%` }}
                          className={`${item.color} h-full rounded-full`}
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                        {item.count.toLocaleString()} Hubs Worldwide
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faqs">
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: "What is a UN/LOCODE?", a: "UN/LOCODE (United Nations Code for Trade and Transport Locations) is a five-character code system used to identify locations such as ports, airports, and inland terminals. For example, SGSIN represents Singapore." },
                { q: "How many ports are in your directory?", a: "Our directory currently features over 11,000 commercial locations, including 8,000+ sea ports, and thousands of airports and dry ports across 200+ countries." },
                { q: "How often is the port data updated?", a: "Port specifications and vessel traffic data are updated monthly using official port authority publications and AIS data feeds." },
                { q: "Can I get real-time shipping quotes through the directory?", a: "Yes, once you select a specific port, you can use our 'Get Quote' feature to receive real-time freight rates for your shipment." }
              ].map((faq, i) => (
                <Card key={i} className="p-6 border-slate-200 hover:border-blue-200 transition-colors">
                  <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
