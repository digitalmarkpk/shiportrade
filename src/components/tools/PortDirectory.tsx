"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Ship,
  MapPin,
  Search,
  Globe,
  Container,
  ChevronRight,
  Filter,
  Building2,
  Anchor,
  Users,
  DollarSign,
  ArrowRightLeft,
  Waves,
  Truck,
  Plane,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  HelpCircle,
  ChevronDown,
  Compass,
  Activity,
  Database,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { WORLD_PORTS_DATA, type Port, type CountryData } from "@/data/world-countries";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// All countries are now imported from the comprehensive data file
const ALL_COUNTRIES_DATA = WORLD_PORTS_DATA;

const regions = ["All", "Asia", "Europe", "North America", "South America", "Africa", "Oceania", "Middle East", "Caribbean", "Central America"];

// Chart colors
const CHART_COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, "#6366f1", "#f59e0b", "#ec4899", "#14b8a6", "#8b5cf6", "#f97316"];

export function PortDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [showCountryDetails, setShowCountryDetails] = useState<CountryData | null>(null);
  const [viewMode, setViewMode] = useState<'countries' | 'ports'>('countries');
  const [activeTab, setActiveTab] = useState("directory");

  const filteredCountries = useMemo(() => {
    return ALL_COUNTRIES_DATA.filter((country) => {
      const matchesSearch = 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.capital.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === "All" || country.region === selectedRegion;
      
      const hasMatchingPort = country.ports.some(port => 
        port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        port.unLoCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return (matchesSearch || hasMatchingPort) && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  const allFilteredPorts = useMemo(() => {
    const ports: Port[] = [];
    filteredCountries.forEach(country => {
      country.ports.forEach(port => {
        if (searchQuery === '' || 
            port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            port.unLoCode.toLowerCase().includes(searchQuery.toLowerCase())) {
          ports.push(port);
        }
      });
    });
    return ports;
  }, [filteredCountries, searchQuery]);

  const groupedCountries = useMemo(() => {
    const groups: Record<string, CountryData[]> = {};
    filteredCountries.forEach((country) => {
      if (!groups[country.region]) {
        groups[country.region] = [];
      }
      groups[country.region].push(country);
    });
    return groups;
  }, [filteredCountries]);

  const totalPorts = useMemo(() => {
    return WORLD_PORTS_DATA.reduce((sum, country) => sum + country.ports.length, 0);
  }, []);

  // Analytics data
  const portsByRegion = useMemo(() => {
    const regionData: Record<string, number> = {};
    WORLD_PORTS_DATA.forEach(country => {
      if (!regionData[country.region]) {
        regionData[country.region] = 0;
      }
      regionData[country.region] += country.ports.length;
    });
    return Object.entries(regionData)
      .map(([region, count]) => ({ region, count, fill: CHART_COLORS[Object.keys(regionData).indexOf(region) % CHART_COLORS.length] }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const portsByType = useMemo(() => {
    const typeData: Record<string, number> = {};
    WORLD_PORTS_DATA.forEach(country => {
      country.ports.forEach(port => {
        port.portType.forEach(type => {
          typeData[type] = (typeData[type] || 0) + 1;
        });
      });
    });
    return Object.entries(typeData)
      .map(([type, count]) => ({ type, count, fill: CHART_COLORS[Object.keys(typeData).indexOf(type) % CHART_COLORS.length] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, []);

  const topCountriesByPorts = useMemo(() => {
    return WORLD_PORTS_DATA
      .map(country => ({
        name: country.name,
        ports: country.ports.length,
        flag: country.flag,
        region: country.region
      }))
      .sort((a, b) => b.ports - a.ports)
      .slice(0, 10);
  }, []);

  const portStatusData = useMemo(() => {
    const statusCount = { active: 0, limited: 0, inactive: 0 };
    WORLD_PORTS_DATA.forEach(country => {
      country.ports.forEach(port => {
        statusCount[port.status]++;
      });
    });
    return [
      { status: "Active", count: statusCount.active, fill: LOGISTICS_GREEN },
      { status: "Limited", count: statusCount.limited, fill: "#f59e0b" },
      { status: "Inactive", count: statusCount.inactive, fill: "#ef4444" },
    ];
  }, []);

  const getPortTypeIcon = (type: string) => {
    switch (type) {
      case 'Seaport': return <Waves className="h-3 w-3" />;
      case 'Inland Port': return <Truck className="h-3 w-3" />;
      case 'River Port': return <Ship className="h-3 w-3" />;
      case 'Container Terminal': return <Container className="h-3 w-3" />;
      case 'Airport': return <Plane className="h-3 w-3" />;
      default: return <Anchor className="h-3 w-3" />;
    }
  };

  const chartConfig = {
    count: { label: "Count" },
    region: { label: "Region", color: OCEAN_BLUE },
    type: { label: "Type", color: LOGISTICS_GREEN },
  };

  // FAQ Data
  const faqData = [
    {
      question: "What is a UN/LOCODE and why is it important?",
      answer: "UN/LOCODE (United Nations Code for Trade and Transport Locations) is a code system developed by the United Nations Economic Commission for Europe (UNECE) to facilitate trade and transport. Each port has a unique 5-character code (e.g., CNSHA for Shanghai, NLRTM for Rotterdam) that is universally recognized in shipping documents, customs declarations, and logistics systems."
    },
    {
      question: "How are port throughput numbers measured?",
      answer: "Port throughput is typically measured in TEU (Twenty-foot Equivalent Units) for container ports, which represents one standard 20-foot container. For bulk ports, throughput may be measured in metric tons. Some ports also track vessel calls, passenger numbers, or cargo value. These metrics help assess port capacity, efficiency, and economic impact."
    },
    {
      question: "What is the difference between a seaport and an inland port?",
      answer: "A seaport is located on a coast or ocean and handles vessels directly from sea routes. An inland port (or dry port) is located inland, often connected to seaports via rail or road networks, and serves as a logistics hub for cargo distribution without direct sea access. Inland ports help reduce congestion at seaports and extend their reach inland."
    },
    {
      question: "How do trade agreements affect port operations?",
      answer: "Trade agreements reduce or eliminate tariffs, harmonize customs procedures, and establish common standards between member countries. This increases trade volumes, affects routing decisions, and can shift cargo flows between ports. Ports in countries with favorable trade agreements often see increased traffic and need to adapt infrastructure accordingly."
    },
    {
      question: "What factors determine a port's status (active, limited, inactive)?",
      answer: "A port's status depends on operational capability, infrastructure condition, political stability, and economic factors. 'Active' ports operate at normal capacity. 'Limited' ports may have restricted operations due to seasonal conditions, ongoing construction, or partial facility availability. 'Inactive' ports are temporarily or permanently closed due to damage, economic conditions, or other factors."
    },
    {
      question: "How do I use this directory to find ports for my shipping route?",
      answer: "Use the search bar to find ports by name, country, or UN/LOCODE. Filter by region to narrow results. Click on any country card to see detailed port information including facilities, vessel types handled, and throughput capacity. Port details show coordinates, timezone, and operational status to help with route planning."
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Anchor className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Global Port Directory</h1>
              <p className="text-white/80">Comprehensive maritime & logistics hub database</p>
            </div>
          </div>
          
          <p className="text-white/90 max-w-2xl mb-6">
            Explore {WORLD_PORTS_DATA.length} countries with {totalPorts}+ ports worldwide. 
            Access detailed information including UN/LOCODE, facilities, vessel types, throughput data, and trade agreements.
          </p>

          {/* Quick Stats in Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/15 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-5 w-5" />
                <span className="text-sm text-white/80">Countries</span>
              </div>
              <div className="text-2xl font-bold">{WORLD_PORTS_DATA.length}</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Anchor className="h-5 w-5" />
                <span className="text-sm text-white/80">Total Ports</span>
              </div>
              <div className="text-2xl font-bold">{totalPorts}</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-5 w-5" />
                <span className="text-sm text-white/80">Regions</span>
              </div>
              <div className="text-2xl font-bold">{regions.length - 1}</div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Container className="h-5 w-5" />
                <span className="text-sm text-white/80">Terminals</span>
              </div>
              <div className="text-2xl font-bold">5,000+</div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#2E8B57]/30 rounded-full blur-3xl"></div>
        <div className="absolute right-10 top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="directory" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            <span className="hidden sm:inline">Directory</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Statistics</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Map View</span>
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQs</span>
          </TabsTrigger>
        </TabsList>

        {/* Directory Tab */}
        <TabsContent value="directory" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search countries, ports, or codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full sm:w-48 h-11">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'countries' ? 'default' : 'outline'} 
                onClick={() => setViewMode('countries')}
                className="h-11"
                style={viewMode === 'countries' ? { backgroundColor: OCEAN_BLUE } : {}}
              >
                <Globe className="h-4 w-4 mr-2" />
                Countries
              </Button>
              <Button 
                variant={viewMode === 'ports' ? 'default' : 'outline'} 
                onClick={() => setViewMode('ports')}
                className="h-11"
                style={viewMode === 'ports' ? { backgroundColor: OCEAN_BLUE } : {}}
              >
                <Anchor className="h-4 w-4 mr-2" />
                Ports
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Badge variant="secondary">
              {viewMode === 'countries' ? filteredCountries.length : allFilteredPorts.length} results
            </Badge>
            <span>
              {viewMode === 'countries' 
                ? `Showing ${filteredCountries.length} of ${WORLD_PORTS_DATA.length} countries`
                : `Showing ${allFilteredPorts.length} ports`
              }
            </span>
          </div>

          {/* Countries View */}
          {viewMode === 'countries' && (
            <div className="space-y-6">
              {Object.entries(groupedCountries).map(([region, countries]) => (
                <div key={region}>
                  <div className="flex items-center gap-2 mb-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
                    <Globe className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    <h2 className="text-xl font-semibold">{region}</h2>
                    <Badge variant="secondary">{countries.length}</Badge>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {countries.map((country, index) => (
                      <motion.div
                        key={country.code}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.01 }}
                      >
                        <Card 
                          className="h-full hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                          style={{ borderColor: 'transparent' }}
                        >
                          <div 
                            className="h-1" 
                            style={{ background: `linear-gradient(90deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                          ></div>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl">{country.flag}</span>
                                <div>
                                  <CardTitle 
                                    className="text-base group-hover:transition-colors"
                                    style={{ color: OCEAN_BLUE }}
                                  >
                                    {country.name}
                                  </CardTitle>
                                  <CardDescription className="text-xs mt-0.5">
                                    {country.capital} • {country.currency.split(' ')[0]}
                                  </CardDescription>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Ports</span>
                                <span className="font-semibold" style={{ color: OCEAN_BLUE }}>
                                  {country.ports.length}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Coastline</span>
                                <span className="font-medium">{country.coastline}</span>
                              </div>

                              {country.ports.length > 0 && (
                                <div className="pt-2 border-t">
                                  <div className="text-xs font-medium text-muted-foreground mb-2">Major Ports</div>
                                  <div className="flex flex-wrap gap-1">
                                    {country.ports.slice(0, 3).map((port) => (
                                      <Badge key={port.unLoCode} variant="outline" className="text-xs font-mono">
                                        {port.unLoCode}
                                      </Badge>
                                    ))}
                                    {country.ports.length > 3 && (
                                      <Badge variant="secondary" className="text-xs">
                                        +{country.ports.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full mt-2"
                                style={{ backgroundColor: 'transparent' }}
                                onClick={() => {
                                  setExpandedCountry(expandedCountry === country.code ? null : country.code);
                                  setShowCountryDetails(country);
                                }}
                              >
                                <span style={{ color: LOGISTICS_GREEN }}>View Details</span>
                                <ChevronRight className="h-4 w-4 ml-1" style={{ color: LOGISTICS_GREEN }} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ports View */}
          {viewMode === 'ports' && (
            <div className="space-y-4">
              {allFilteredPorts.map((port, index) => (
                <motion.div
                  key={port.unLoCode}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.005 }}
                >
                  <Card 
                    className="hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedPort(port)}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                          >
                            <Anchor className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{port.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{port.country}</span>
                              <Badge variant="outline" className="font-mono text-xs">
                                {port.unLoCode}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium" style={{ color: OCEAN_BLUE }}>
                              {port.throughput || 'N/A'}
                            </div>
                            <div className="text-xs text-muted-foreground">Throughput</div>
                          </div>
                          <div className="flex flex-wrap gap-1 justify-end max-w-48">
                            {port.portType.slice(0, 2).map((type) => (
                              <Badge key={type} variant="secondary" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {(viewMode === 'countries' && filteredCountries.length === 0) || 
           (viewMode === 'ports' && allFilteredPorts.length === 0) ? (
            <div className="text-center py-12">
              <Ship className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No results found matching your criteria</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("All");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : null}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ports by Region Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Ports by Region
                </CardTitle>
                <CardDescription>Distribution of ports across global regions</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={portsByRegion}
                        dataKey="count"
                        nameKey="region"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ region, count }) => `${region}: ${count}`}
                      >
                        {portsByRegion.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Ports by Type Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Ports by Type
                </CardTitle>
                <CardDescription>Breakdown of port facilities by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portsByType} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="type" type="category" width={120} tick={{ fontSize: 11 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill={OCEAN_BLUE} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Countries by Ports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Top Countries by Port Count
                </CardTitle>
                <CardDescription>Countries with the most ports in our database</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topCountriesByPorts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="ports" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Port Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Port Status Distribution
                </CardTitle>
                <CardDescription>Operational status of ports worldwide</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={portStatusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        label={({ status, count }) => `${status}: ${count}`}
                      >
                        {portStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Card style={{ borderTop: `4px solid ${OCEAN_BLUE}` }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${OCEAN_BLUE}20` }}
                  >
                    <Globe className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{WORLD_PORTS_DATA.length}</div>
                    <div className="text-sm text-muted-foreground">Total Countries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card style={{ borderTop: `4px solid ${LOGISTICS_GREEN}` }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${LOGISTICS_GREEN}20` }}
                  >
                    <Anchor className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalPorts}</div>
                    <div className="text-sm text-muted-foreground">Total Ports</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card style={{ borderTop: `4px solid #6366f1` }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f120' }}>
                    <Waves className="h-6 w-6" style={{ color: '#6366f1' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{portsByType.find(p => p.type === 'Seaport')?.count || 0}</div>
                    <div className="text-sm text-muted-foreground">Seaports</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card style={{ borderTop: `4px solid #f59e0b` }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f59e0b20' }}>
                    <Container className="h-6 w-6" style={{ color: '#f59e0b' }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{portsByType.find(p => p.type === 'Container Terminal')?.count || 0}</div>
                    <div className="text-sm text-muted-foreground">Container Terminals</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Regional Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {portsByRegion.map((region, index) => (
                      <div key={region.region} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: region.fill }}
                          ></div>
                          <span className="font-medium">{region.region}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary">{region.count} ports</Badge>
                          <span className="text-sm text-muted-foreground">
                            {((region.count / totalPorts) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Port Facility Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {portsByType.map((type, index) => (
                      <div key={type.type} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.fill }}></div>
                          <span className="font-medium">{type.type}</span>
                        </div>
                        <Badge variant="secondary">{type.count} facilities</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Coverage Summary */}
          <Card className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardHeader>
              <CardTitle>Coverage Summary</CardTitle>
              <CardDescription>Comprehensive port data coverage across the globe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Geographic Coverage</div>
                  <div className="text-lg font-semibold">{regions.length - 1} Regions</div>
                  <div className="text-sm text-muted-foreground">Including all continents and major island nations</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Data Points per Port</div>
                  <div className="text-lg font-semibold">15+ Attributes</div>
                  <div className="text-sm text-muted-foreground">Coordinates, facilities, vessel types, throughput, and more</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Update Frequency</div>
                  <div className="text-lg font-semibold">Quarterly</div>
                  <div className="text-sm text-muted-foreground">Regular updates for port status and throughput data</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map View Tab */}
        <TabsContent value="map" className="space-y-6 mt-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Interactive World Map
              </CardTitle>
              <CardDescription>Explore ports and countries geographically</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-[#0F4C81] animate-pulse"></div>
                  <div className="absolute top-1/3 left-1/2 w-3 h-3 rounded-full bg-[#2E8B57] animate-pulse"></div>
                  <div className="absolute top-1/2 left-3/4 w-4 h-4 rounded-full bg-[#0F4C81] animate-pulse"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-3 h-3 rounded-full bg-[#2E8B57] animate-pulse"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-[#0F4C81] animate-pulse"></div>
                </div>
                <div className="text-center z-10">
                  <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">Global Port Network</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Interactive map visualization coming soon. Browse {totalPorts} ports across {WORLD_PORTS_DATA.length} countries using the Directory tab.
                  </p>
                  <Button 
                    className="mt-4"
                    style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                    onClick={() => setActiveTab("directory")}
                  >
                    Browse Directory
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Access to Major Ports */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Anchor className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  Top Asian Ports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {WORLD_PORTS_DATA.find(c => c.code === 'CN')?.ports.slice(0, 3).map(port => (
                    <div key={port.unLoCode} className="flex justify-between items-center text-sm">
                      <span>{port.name}</span>
                      <Badge variant="outline" className="font-mono text-xs">{port.unLoCode}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Anchor className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                  Top European Ports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {WORLD_PORTS_DATA.find(c => c.code === 'NL')?.ports.slice(0, 3).map(port => (
                    <div key={port.unLoCode} className="flex justify-between items-center text-sm">
                      <span>{port.name}</span>
                      <Badge variant="outline" className="font-mono text-xs">{port.unLoCode}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Anchor className="h-4 w-4" style={{ color: '#f59e0b' }} />
                  Top American Ports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {WORLD_PORTS_DATA.find(c => c.code === 'US')?.ports.slice(0, 3).map(port => (
                    <div key={port.unLoCode} className="flex justify-between items-center text-sm">
                      <span>{port.name}</span>
                      <Badge variant="outline" className="font-mono text-xs">{port.unLoCode}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6 mt-6">
          <Card className="overflow-hidden">
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Find answers to common questions about ports, shipping, and our directory</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                          style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Help Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card style={{ borderColor: `${OCEAN_BLUE}30` }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Search Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">Tip</Badge>
                  <span>Search by UN/LOCODE (e.g., &quot;CNSHA&quot; for Shanghai)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">Tip</Badge>
                  <span>Search by country name or capital city</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">Tip</Badge>
                  <span>Use region filters to narrow down results</span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">Tip</Badge>
                  <span>Click on country cards to see detailed port information</span>
                </div>
              </CardContent>
            </Card>

            <Card style={{ borderColor: `${LOGISTICS_GREEN}30` }}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Data Sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Our port directory is compiled from multiple authoritative sources:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>United Nations Economic Commission for Europe (UNECE)</li>
                  <li>International Maritime Organization (IMO)</li>
                  <li>World Port Index</li>
                  <li>National Port Authorities</li>
                  <li>Containerisation International</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Country Details Dialog */}
      <Dialog open={!!showCountryDetails} onOpenChange={() => setShowCountryDetails(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
          {showCountryDetails && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{showCountryDetails.flag}</span>
                  <div>
                    <div>{showCountryDetails.name}</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {showCountryDetails.region} • {showCountryDetails.ports.length} ports
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Comprehensive port and trade information
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="ports">Ports</TabsTrigger>
                  <TabsTrigger value="trade">Trade</TabsTrigger>
                  <TabsTrigger value="economy">Economy</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span className="text-sm">Capital</span>
                        </div>
                        <div className="text-xl font-semibold mt-1">{showCountryDetails.capital}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">Currency</span>
                        </div>
                        <div className="text-xl font-semibold mt-1">{showCountryDetails.currency}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">Population</span>
                        </div>
                        <div className="text-xl font-semibold mt-1">{showCountryDetails.population}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Waves className="h-4 w-4" />
                          <span className="text-sm">Coastline</span>
                        </div>
                        <div className="text-xl font-semibold mt-1">{showCountryDetails.coastline}</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="ports">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {showCountryDetails.ports.map((port) => (
                        <Card 
                          key={port.unLoCode}
                          className="cursor-pointer"
                          style={{ borderColor: `${OCEAN_BLUE}30` }}
                          onClick={() => setSelectedPort(port)}
                        >
                          <CardContent className="py-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{port.name}</div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Badge variant="outline" className="font-mono text-xs">
                                    {port.unLoCode}
                                  </Badge>
                                  <span>{port.timezone}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium" style={{ color: OCEAN_BLUE }}>
                                  {port.throughput || 'N/A'}
                                </div>
                                <div className="flex gap-1 mt-1">
                                  {port.portType.slice(0, 2).map(type => (
                                    <Badge key={type} variant="secondary" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {showCountryDetails.ports.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Anchor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No major ports recorded</p>
                          <p className="text-sm">This country may be landlocked</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="trade" className="space-y-4">
                  <Card style={{ background: `linear-gradient(to right, ${OCEAN_BLUE}10, transparent)` }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        Trade Agreements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(showCountryDetails.tradeAgreements || []).map((agreement) => (
                          <Badge key={agreement} style={{ backgroundColor: `${OCEAN_BLUE}20`, color: OCEAN_BLUE }}>
                            {agreement}
                          </Badge>
                        ))}
                        {(!showCountryDetails.tradeAgreements || showCountryDetails.tradeAgreements.length === 0) && (
                          <span className="text-muted-foreground text-sm">No trade agreements recorded</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card style={{ background: `linear-gradient(to right, ${LOGISTICS_GREEN}10, transparent)` }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                        Neighbouring Countries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(showCountryDetails.neighbours || []).map((neighbour) => (
                          <Badge key={neighbour} variant="outline" style={{ borderColor: `${LOGISTICS_GREEN}50`, color: LOGISTICS_GREEN }}>
                            {neighbour}
                          </Badge>
                        ))}
                        {(!showCountryDetails.neighbours || showCountryDetails.neighbours.length === 0) && (
                          <span className="text-muted-foreground text-sm">No neighbouring countries recorded</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <ArrowRightLeft className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                          Major Exports
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {showCountryDetails.majorExports.map((exp) => (
                            <Badge key={exp} variant="secondary">{exp}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <ArrowRightLeft className="h-4 w-4" style={{ color: '#f59e0b' }} />
                          Major Imports
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {showCountryDetails.majorImports.map((imp) => (
                            <Badge key={imp} variant="secondary">{imp}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="economy" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="col-span-2">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg, ${LOGISTICS_GREEN}, ${OCEAN_BLUE})` }}
                          >
                            <DollarSign className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">GDP</div>
                            <div className="text-2xl font-bold">{showCountryDetails.gdp}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Language</div>
                        <div className="text-lg font-semibold">{showCountryDetails.language}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Timezone</div>
                        <div className="text-lg font-semibold">{showCountryDetails.timezone}</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Port Details Dialog */}
      <Dialog open={!!selectedPort} onOpenChange={() => setSelectedPort(null)}>
        <DialogContent className="max-w-2xl">
          {selectedPort && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                  >
                    <Anchor className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div>{selectedPort.name}</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {selectedPort.country} • {selectedPort.unLoCode}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">Throughput</div>
                      <div className="text-xl font-bold" style={{ color: OCEAN_BLUE }}>
                        {selectedPort.throughput || 'N/A'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: selectedPort.status === 'active' ? LOGISTICS_GREEN :
                            selectedPort.status === 'limited' ? '#f59e0b' : '#ef4444'
                          }}
                        />
                        <span className="font-semibold capitalize">{selectedPort.status}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium mb-2">Port Types</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPort.portType.map((type) => (
                        <Badge key={type} variant="secondary" className="flex items-center gap-1">
                          {getPortTypeIcon(type)}
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Facilities</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPort.facilities.map((facility) => (
                        <Badge key={facility} variant="outline">{facility}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Vessel Types</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPort.vesselTypes.map((vessel) => (
                        <Badge key={vessel} variant="secondary">{vessel}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <div className="text-sm text-muted-foreground">Coordinates</div>
                      <div className="font-mono text-sm">
                        {selectedPort.coordinates.lat.toFixed(4)}, {selectedPort.coordinates.lng.toFixed(4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Timezone</div>
                      <div className="font-mono text-sm">{selectedPort.timezone}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
