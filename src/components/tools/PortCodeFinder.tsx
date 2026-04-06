"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Globe,
  Ship,
  Plane,
  Building,
  Anchor,
  Navigation,
  Clock,
  Info,
  X,
  ChevronRight,
  Filter,
  Star,
  History,
  ArrowUpDown,
  Layers,
  Truck,
  Package,
  Box,
  Container,
  Database,
  ExternalLink,
  BarChart3,
  BookOpen,
  HelpCircle,
  TrendingUp,
  PieChart,
  Activity,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  PORTS,
  COUNTRIES,
  REGIONS,
  getPortByUnLoCode,
  UNLOCODE_INFO,
  type Port,
} from "@/lib/constants/ports";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Chart colors
const CHART_COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

type SortField = "name" | "unLoCode" | "country" | "throughput";
type SortOrder = "asc" | "desc";

interface RecentSearch {
  code: string;
  name: string;
  timestamp: Date;
}

// Fuzzy search implementation
function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  if (textLower.includes(queryLower)) return true;
  
  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === queryLower.length;
}

// Parse throughput for sorting
function parseThroughput(throughput?: string): number {
  if (!throughput) return 0;
  const match = throughput.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    const num = parseFloat(match[1]);
    if (throughput.includes('M')) return num * 1000000;
    if (throughput.includes('K')) return num * 1000;
    return num;
  }
  return 0;
}

// Get icon for port type
function getPortTypeIcon(type: string) {
  switch (type) {
    case 'Seaport':
      return <Ship className="h-4 w-4" />;
    case 'Airport':
      return <Plane className="h-4 w-4" />;
    case 'Inland Port':
    case 'Dry Port':
      return <Building className="h-4 w-4" />;
    case 'River Port':
      return <Navigation className="h-4 w-4" />;
    case 'Container Terminal':
      return <Container className="h-4 w-4" />;
    case 'RoRo Terminal':
      return <Truck className="h-4 w-4" />;
    case 'Bulk Terminal':
      return <Package className="h-4 w-4" />;
    case 'Tanker Terminal':
      return <Box className="h-4 w-4" />;
    default:
      return <Anchor className="h-4 w-4" />;
  }
}

// Animated Badge Component
function AnimatedBadge({ children, variant = "default", delay = 0 }: { 
  children: React.ReactNode; 
  variant?: "default" | "outline";
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
    >
      <Badge 
        variant={variant}
        className={`
          text-sm px-4 py-1.5 font-medium
          ${variant === "default" 
            ? "bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white dark:bg-[#0F4C81] dark:hover:bg-[#0F4C81]/90" 
            : "border-[#2E8B57] text-[#2E8B57] dark:border-[#2E8B57] dark:text-[#2E8B57]"}
        `}
      >
        {children}
      </Badge>
    </motion.div>
  );
}

// Hero Section Component
function HeroSection() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 md:p-12 text-white mb-8"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <Ship className="absolute right-8 bottom-8 w-32 h-32 text-white/10" />
      </div>
      
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap gap-3 mb-6"
        >
          <AnimatedBadge variant="default" delay={0.1}>
            <Ship className="h-3.5 w-3.5 mr-1.5" />
            Ocean Freight
          </AnimatedBadge>
          <AnimatedBadge variant="outline" delay={0.2}>
            <Database className="h-3.5 w-3.5 mr-1.5" />
            UN/LOCODE
          </AnimatedBadge>
          <AnimatedBadge variant="default" delay={0.3}>
            <Globe className="h-3.5 w-3.5 mr-1.5" />
            Global Ports
          </AnimatedBadge>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
        >
          Port Code Finder
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mb-6"
        >
          Search and explore UN/LOCODE port codes for over 100 major shipping ports worldwide. 
          Your comprehensive resource for maritime logistics and trade documentation.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-2 text-white/80">
            <Container className="h-5 w-5" />
            <span>100+ Ports</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Globe className="h-5 w-5" />
            <span>50+ Countries</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="h-5 w-5" />
            <span>7 Regions</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Statistics Data for Charts
function useStatisticsData() {
  const portsByRegion = useMemo(() => {
    const data: Record<string, number> = {};
    PORTS.forEach(port => {
      data[port.region] = (data[port.region] || 0) + 1;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, []);

  const topPorts = useMemo(() => {
    return PORTS
      .filter(p => p.throughput)
      .sort((a, b) => parseThroughput(b.throughput) - parseThroughput(a.throughput))
      .slice(0, 10)
      .map(p => ({
        name: p.name,
        throughput: parseThroughput(p.throughput) / 1000000,
        code: p.unLoCode
      }));
  }, []);

  const portTypeDistribution = useMemo(() => {
    const types: Record<string, number> = {};
    PORTS.forEach(port => {
      port.portType.forEach(type => {
        types[type] = (types[type] || 0) + 1;
      });
    });
    return Object.entries(types)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, []);

  const throughputByRegion = useMemo(() => {
    const data: Record<string, number> = {};
    PORTS.forEach(port => {
      if (port.throughput) {
        data[port.region] = (data[port.region] || 0) + parseThroughput(port.throughput);
      }
    });
    return Object.entries(data).map(([name, value]) => ({ 
      name, 
      value: Math.round(value / 1000000) 
    }));
  }, []);

  return { portsByRegion, topPorts, portTypeDistribution, throughputByRegion };
}

// Analysis Tab Component
function AnalysisTab() {
  const { portsByRegion, topPorts, portTypeDistribution, throughputByRegion } = useStatisticsData();

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Ports", value: PORTS.length, icon: Ship, color: OCEAN_BLUE },
          { label: "Countries", value: COUNTRIES.length, icon: Globe, color: LOGISTICS_GREEN },
          { label: "Regions", value: REGIONS.length, icon: MapPin, color: "#3B82F6" },
          { label: "Major Hubs", value: PORTS.filter(p => p.throughput?.includes('M+')).length, icon: Star, color: "#F59E0B" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top 10 Ports by Throughput */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
              Top 10 Ports by Throughput
            </CardTitle>
            <CardDescription>Annual container throughput in million TEU</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPorts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${value.toFixed(1)}M TEU`, "Throughput"]}
                  />
                  <Bar dataKey="throughput" fill={OCEAN_BLUE} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Ports by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
              Port Distribution by Region
            </CardTitle>
            <CardDescription>Number of ports per geographic region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={portsByRegion}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {portsByRegion.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Throughput by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
              Regional Throughput Analysis
            </CardTitle>
            <CardDescription>Total annual throughput by region (million TEU)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={throughputByRegion}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                    formatter={(value: number) => [`${value}M TEU`, "Throughput"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={OCEAN_BLUE} 
                    fill={OCEAN_BLUE}
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Port Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
              Port Type Distribution
            </CardTitle>
            <CardDescription>Number of ports by terminal type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portTypeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="value" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 mb-2">
                <Ship className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                <span className="font-semibold">Asia Dominance</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Asian ports handle over 60% of global container traffic, with Shanghai leading at 47M+ TEU annually.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                <span className="font-semibold">Growth Trends</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Middle Eastern ports show the fastest growth rate, driven by strategic investments in infrastructure.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-2 mb-2">
                <Container className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                <span className="font-semibold">Container Focus</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Container terminals represent the largest segment, with multi-purpose facilities growing in importance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Guide Tab Component with Educational Content
function GuideTab() {
  return (
    <div className="space-y-6">
      {/* What is UN/LOCODE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
            Understanding UN/LOCODE: The Global Standard for Trade Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              UN/LOCODE, which stands for United Nations Code for Trade and Transport Locations, represents one of the most 
              critical standardization systems in global trade and logistics. Established and maintained by the United Nations 
              Economic Commission for Europe (UNECE), this coding system provides a unique identification method for locations 
              involved in international trade, including seaports, airports, rail terminals, and inland freight facilities. 
              The system has become the de facto standard for identifying trade and transport locations worldwide, enabling 
              seamless communication between shippers, carriers, freight forwarders, customs authorities, and other stakeholders 
              in the global supply chain.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The importance of UN/LOCODE cannot be overstated in modern logistics operations. With over 100,000 locations 
              coded across more than 200 countries, the system facilitates electronic data interchange (EDI), reduces errors 
              in documentation, and enables efficient tracking of cargo movements. Whether you&apos;re booking a shipment, 
              preparing a bill of lading, or filing customs documentation, the UN/LOCODE ensures that all parties understand 
              exactly which location is being referenced, eliminating confusion that could arise from similar place names or 
              language barriers. This standardization has become particularly crucial in the age of digital logistics, where 
              automated systems rely on consistent, unambiguous location identifiers.
            </p>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-3">Code Structure Breakdown</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">The 5-character code consists of two distinct parts that work together to create a unique identifier:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#0F4C81] shrink-0">XX</span>
                    <span>First 2 characters: ISO 3166-1 alpha-2 country code identifying the nation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#2E8B57] shrink-0">XXX</span>
                    <span>Last 3 characters: Location code uniquely assigned within each country</span>
                  </li>
                </ul>
              </div>
              <div className="bg-background p-4 rounded border">
                <p className="text-sm font-medium mb-2">Practical Example: <span className="font-mono">CNSHA</span></p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-mono font-bold text-[#0F4C81]">CN</span> = China (ISO country code)<br/>
                  <span className="font-mono font-bold text-[#2E8B57]">SHA</span> = Shanghai (location identifier)<br/>
                  <span className="text-xs mt-2 block">This code uniquely identifies the Port of Shanghai among all ports worldwide.</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Code Functions */}
      <Card>
        <CardHeader>
          <CardTitle>Location Code Classification System</CardTitle>
          <CardDescription>Understanding the functional indicators embedded in location codes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            The UN/LOCODE system includes sophisticated classification indicators that provide additional information about 
            the nature and function of each location. These indicators help logistics professionals quickly understand 
            what types of operations are available at any given location, enabling more informed routing and planning decisions. 
            The second character of the location code often carries special significance, indicating whether the location 
            is a seaport, airport, rail terminal, or multimodal facility. This classification system has evolved over decades 
            to meet the changing needs of global trade, incorporating new types of facilities as supply chains have become 
            more complex and interconnected.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(UNLOCODE_INFO.types).map(([code, desc]) => (
              <div key={code} className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Badge variant="outline" className="font-mono shrink-0 border-[#0F4C81] text-[#0F4C81]">{code}</Badge>
                <span className="text-sm">{desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practical Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Practical Applications in Modern Shipping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Understanding how to effectively use UN/LOCODEs is essential for anyone involved in international trade and 
            logistics. These codes appear in virtually every shipping document and electronic message exchanged between 
            trading partners. From the initial booking request to final delivery confirmation, UN/LOCODEs provide the 
            geographic anchors that define where cargo originates, transships, and ultimately arrives. Mastering their 
            use can significantly improve operational efficiency and reduce costly errors that often result from using 
            incorrect or ambiguous location names. Below we explore the key areas where UN/LOCODE knowledge is most valuable.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg hover:border-[#0F4C81]/50 transition-colors">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Ship className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                Booking & Documentation
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Shipping documentation relies heavily on accurate UN/LOCODE usage. Every bill of lading, booking confirmation, 
                and shipping instruction must specify the ports of loading and discharge using correct codes. Using the wrong 
                code can result in cargo being routed to the wrong destination, incurring significant costs and delays.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Bill of Lading port of loading/discharge specification</li>
                <li>• Shipping instructions and booking confirmations</li>
                <li>• Freight forwarder and carrier communications</li>
                <li>• Vessel schedule and routing documentation</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg hover:border-[#0F4C81]/50 transition-colors">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Container className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                Container Operations
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Container tracking systems use UN/LOCODEs to record every movement and event in a container&apos;s journey. 
                Terminal operating systems, vessel tracking platforms, and customer portals all depend on accurate location 
                codes to provide real-time visibility into cargo status and location.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time container tracking and visibility platforms</li>
                <li>• Terminal operating system gate operations</li>
                <li>• Customs declaration and clearance processes</li>
                <li>• Intermodal and transshipment coordination</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg hover:border-[#2E8B57]/50 transition-colors">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Trade Finance
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Banks and financial institutions require precise location information when processing letters of credit 
                and other trade finance instruments. The Uniform Customs and Practice for Documentary Credits (UCP 600) 
                specifically references the use of UN/LOCODEs for identifying ports and transport locations.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Letter of Credit port specifications</li>
                <li>• Incoterms delivery point determination</li>
                <li>• Marine insurance policy documentation</li>
                <li>• International trade statistics compilation</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg hover:border-[#2E8B57]/50 transition-colors">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Building className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Supply Chain Planning
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Strategic supply chain planning uses UN/LOCODE data to analyze routing options, calculate transit times, 
                and optimize distribution networks. Understanding port characteristics and capabilities helps logistics 
                professionals make informed decisions about routing and carrier selection.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multi-modal route planning and optimization</li>
                <li>• Transit time calculations and scheduling</li>
                <li>• Inventory positioning and warehouse selection</li>
                <li>• Network design and facility location analysis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <X className="h-5 w-5" />
            Critical Mistakes to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Even experienced logistics professionals can make errors when working with port codes. Understanding common 
            mistakes can help prevent costly routing errors, documentation rejections, and shipment delays. The following 
            examples represent the most frequent errors we encounter in practice, along with guidance on how to avoid them.
          </p>
          <div className="space-y-3">
            {[
              { 
                mistake: "Using IATA airport codes instead of UN/LOCODE for seaports", 
                tip: "IATA codes (3 letters) are exclusively for airports. Seaports require the 5-character UN/LOCODE format. For example, use SGSIN for Singapore port, not SIN which is Changi Airport.",
                severity: "high"
              },
              { 
                mistake: "Confusing visually similar port codes", 
                tip: "Codes like CNSHA (Shanghai) and CNSZX (Shenzhen) can be easily confused. Always verify the full port name and country before finalizing documentation.",
                severity: "high"
              },
              { 
                mistake: "Using deprecated or superseded port codes", 
                tip: "Port codes are occasionally updated or consolidated. Always use the current official UN/LOCODE from the UNECE database to ensure compatibility with all systems.",
                severity: "medium"
              },
              { 
                mistake: "Mixing up port names with city names", 
                tip: "Many ports have names different from their cities. AEJEA represents Jebel Ali port, not Dubai city center. Understanding these distinctions is crucial for accurate routing.",
                severity: "medium"
              },
              { 
                mistake: "Incorrect formatting in electronic messages", 
                tip: "Always use uppercase letters with no spaces or separators: CNSHA is correct, not cnsha, CN-SHA, or CN SHA. Inconsistent formatting can cause system rejections.",
                severity: "low"
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  item.severity === 'high' ? 'bg-destructive/10' : 
                  item.severity === 'medium' ? 'bg-yellow-500/10' : 'bg-blue-500/10'
                }`}>
                  <X className={`h-3 w-3 ${
                    item.severity === 'high' ? 'text-destructive' : 
                    item.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.mistake}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reference Links */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources and References</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            For the most current and authoritative information on UN/LOCODE assignments and updates, we recommend 
            consulting the official UNECE resources. These databases are updated regularly to reflect new location 
            additions, code modifications, and geographic changes.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Button variant="outline" className="justify-between h-auto py-3" asChild>
              <a href="https://unece.org/cefact/unlocode" target="_blank" rel="noopener noreferrer">
                <div className="flex flex-col items-start">
                  <span className="font-medium">Official UN/LOCODE Database</span>
                  <span className="text-xs text-muted-foreground">UNECE official repository</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="justify-between h-auto py-3" asChild>
              <a href="https://service.unece.org/trade/locode/Service.aspx" target="_blank" rel="noopener noreferrer">
                <div className="flex flex-col items-start">
                  <span className="font-medium">UN/LOCODE Search Service</span>
                  <span className="text-xs text-muted-foreground">Online lookup tool</span>
                </div>
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// FAQ Tab Component
function FAQTab() {
  const faqs = [
    {
      question: "What is the difference between UN/LOCODE and IATA codes?",
      answer: "UN/LOCODE and IATA codes serve different purposes in the transportation industry. UN/LOCODE (United Nations Code for Trade and Transport Locations) is a 5-character code used to identify seaports, inland ports, and other trade-related locations. It consists of a 2-letter country code followed by a 3-letter location code (e.g., CNSHA for Shanghai). IATA codes, issued by the International Air Transport Association, are 3-letter codes exclusively for airports (e.g., PVG for Shanghai Pudong Airport). Using the wrong code type can result in cargo routing errors, so it's essential to use UN/LOCODE for seaports and IATA codes only for air freight shipments."
    },
    {
      question: "How often are UN/LOCODE codes updated or changed?",
      answer: "The UN/LOCODE database is maintained by the United Nations Economic Commission for Europe (UNECE) and undergoes regular updates. Typically, new editions are published twice per year, incorporating new locations, code modifications, and occasionally code deletions for locations that are no longer active. It's important to use the most current version of the codes, especially for locations that have undergone recent changes. The official UNECE website provides free access to the latest code lists and amendments. We recommend checking for updates quarterly if you work frequently with international shipping documentation."
    },
    {
      question: "Can a single port have multiple UN/LOCODE entries?",
      answer: "Yes, large port complexes often have multiple UN/LOCODE entries representing different terminals, facilities, or areas within the port. For example, the Port of Rotterdam has separate codes for different terminals and facilities. Additionally, some cities may have multiple port facilities with distinct codes (seaport, river port, container terminal, etc.). When booking shipments, it's important to use the specific code for the terminal or facility where your cargo will actually be handled. Using a general port code when a specific terminal code is required can lead to additional handling charges or delays."
    },
    {
      question: "What should I do if I cannot find a port's UN/LOCODE?",
      answer: "If you cannot locate a port's UN/LOCODE in our database, there are several steps you can take. First, verify the exact name of the port, as many ports have multiple names or spellings. Check the official UNECE UN/LOCODE database directly, as it contains the complete list of over 100,000 coded locations. If the location is new or recently developed, it may not yet have an assigned code - in this case, contact your shipping line or freight forwarder for guidance. For very small or private facilities, the nearest major port code may be used with an additional location description in the documentation."
    },
    {
      question: "Are UN/LOCODE codes required for all shipping documents?",
      answer: "While UN/LOCODE usage is not legally mandated in all jurisdictions, it has become the de facto standard for international shipping documentation. Most major shipping lines, freight forwarders, and customs authorities require UN/LOCODEs for electronic data interchange (EDI) and documentation processing. Letters of Credit often specify that ports must be identified using UN/LOCODE format. The Uniform Customs and Practice for Documentary Credits (UCP 600) explicitly references location codes for port identification. Using standardized codes reduces errors, speeds up processing, and ensures clear communication between all parties in the supply chain."
    },
    {
      question: "How do I interpret throughput figures like '47M+ TEU'?",
      answer: "TEU stands for Twenty-foot Equivalent Unit, the standard measure for container traffic. One TEU represents a standard 20-foot shipping container. A 40-foot container equals 2 TEU. When you see '47M+ TEU', it means the port handles more than 47 million TEU annually. This translates to approximately 23.5 million 40-foot containers or a combination of container sizes totaling that capacity. These figures represent annual throughput and are typically reported by port authorities. The 'M+' indicates the figure exceeds that number, as exact counts vary slightly between reporting periods and methodologies."
    },
    {
      question: "What does port 'status' mean in the database?",
      answer: "The status field indicates the operational condition of a port. 'Active' means the port is fully operational and handling regular commercial traffic. 'Limited' indicates the port has restrictions - this could be due to seasonal operations, draft limitations for larger vessels, infrastructure constraints, or ongoing construction. 'Inactive' means the port is not currently handling commercial traffic, possibly due to closure, renovation, or conversion to other uses. Always check a port's status before planning shipments, and verify current conditions with shipping lines as situations can change rapidly."
    },
    {
      question: "Why do some ports have multiple 'port types' listed?",
      answer: "Modern ports are often complex facilities capable of handling various cargo types and vessel classes. The port type field lists all the functions a port can serve. For example, a port listed as 'Seaport, Container Terminal, Bulk Terminal' can handle container ships, bulk carriers, and general cargo vessels. This multi-functionality is common at major ports that serve diverse shipping needs. Understanding a port's capabilities helps in planning shipments, as you can determine whether a port can handle your specific cargo type and vessel class."
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions about UN/LOCODE, port codes, and shipping documentation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            This comprehensive FAQ section addresses the most common questions we receive about port codes, 
            UN/LOCODE usage, and maritime logistics terminology. Whether you&apos;re new to shipping documentation 
            or an experienced logistics professional, these answers provide practical guidance for working with 
            port codes in your daily operations. If you don&apos;t find the answer you&apos;re looking for, 
            consult the Guide section for more detailed explanations or reach out to your shipping line for 
            specific requirements.
          </p>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-4 bg-muted/20"
              >
                <AccordionTrigger className="text-left font-medium hover:text-[#0F4C81] dark:hover:text-[#0F4C81]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export function PortCodeFinder() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedPortType, setSelectedPortType] = useState("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [activeTab, setActiveTab] = useState("search");

  // Filtered and sorted ports
  const filteredPorts = useMemo(() => {
    let result = [...PORTS];

    if (searchQuery.trim()) {
      result = result.filter(port => 
        fuzzyMatch(port.name, searchQuery) ||
        fuzzyMatch(port.unLoCode, searchQuery) ||
        fuzzyMatch(port.country, searchQuery) ||
        fuzzyMatch(port.countryCode, searchQuery)
      );
    }

    if (selectedRegion !== "all") {
      result = result.filter(port => port.region.toLowerCase() === selectedRegion.toLowerCase());
    }

    if (selectedCountry !== "all") {
      result = result.filter(port => port.countryCode === selectedCountry);
    }

    if (selectedPortType !== "all") {
      result = result.filter(port => 
        port.portType.some(type => type.toLowerCase().includes(selectedPortType.toLowerCase()))
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "unLoCode":
          comparison = a.unLoCode.localeCompare(b.unLoCode);
          break;
        case "country":
          comparison = a.country.localeCompare(b.country);
          break;
        case "throughput":
          comparison = parseThroughput(a.throughput) - parseThroughput(b.throughput);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, selectedRegion, selectedCountry, selectedPortType, sortField, sortOrder]);

  // Group ports by region
  const portsByRegion = useMemo(() => {
    const groups: Record<string, Port[]> = {};
    filteredPorts.forEach(port => {
      if (!groups[port.region]) {
        groups[port.region] = [];
      }
      groups[port.region].push(port);
    });
    return groups;
  }, [filteredPorts]);

  // Group ports by country
  const portsByCountry = useMemo(() => {
    const groups: Record<string, Port[]> = {};
    filteredPorts.forEach(port => {
      if (!groups[port.country]) {
        groups[port.country] = [];
      }
      groups[port.country].push(port);
    });
    return groups;
  }, [filteredPorts]);

  // Get countries for selected region
  const countriesForRegion = useMemo(() => {
    if (selectedRegion === "all") {
      return COUNTRIES;
    }
    return COUNTRIES.filter(c => c.region.toLowerCase() === selectedRegion.toLowerCase());
  }, [selectedRegion]);

  // Handle sort toggle
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }, [sortField]);

  // Handle port selection
  const handleSelectPort = useCallback((port: Port) => {
    setSelectedPort(port);
    setRecentSearches(prev => {
      const filtered = prev.filter(r => r.code !== port.unLoCode);
      return [{ code: port.unLoCode, name: port.name, timestamp: new Date() }, ...filtered].slice(0, 5);
    });
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedRegion("all");
    setSelectedCountry("all");
    setSelectedPortType("all");
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <HeroSection />

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="search" className="flex items-center gap-1.5 py-2.5">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </TabsTrigger>
          <TabsTrigger value="browse" className="flex items-center gap-1.5 py-2.5">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Browse</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1.5 py-2.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1.5 py-2.5">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1.5 py-2.5">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by port name, UN/LOCODE, or country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedRegion} onValueChange={(v) => { setSelectedRegion(v); setSelectedCountry("all"); }}>
                    <SelectTrigger className="w-36">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      {REGIONS.map(region => (
                        <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countriesForRegion.map(country => (
                        <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedPortType} onValueChange={setSelectedPortType}>
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Port Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="seaport">Seaport</SelectItem>
                      <SelectItem value="container">Container Terminal</SelectItem>
                      <SelectItem value="river">River Port</SelectItem>
                      <SelectItem value="inland">Inland Port</SelectItem>
                      <SelectItem value="roro">RoRo Terminal</SelectItem>
                      <SelectItem value="bulk">Bulk Terminal</SelectItem>
                      <SelectItem value="tanker">Tanker Terminal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Found <span className="font-semibold text-foreground">{filteredPorts.length}</span> ports
                </p>
                {(searchQuery || selectedRegion !== "all" || selectedCountry !== "all" || selectedPortType !== "all") && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("unLoCode")}
                      >
                        <div className="flex items-center gap-1">
                          UN/LOCODE
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "unLoCode" ? "text-[#0F4C81]" : "text-muted-foreground"}`} />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          Port Name
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "name" ? "text-[#0F4C81]" : "text-muted-foreground"}`} />
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("country")}
                      >
                        <div className="flex items-center gap-1">
                          Country
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "country" ? "text-[#0F4C81]" : "text-muted-foreground"}`} />
                        </div>
                      </TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("throughput")}
                      >
                        <div className="flex items-center gap-1">
                          Throughput
                          <ArrowUpDown className={`h-3 w-3 ${sortField === "throughput" ? "text-[#0F4C81]" : "text-muted-foreground"}`} />
                        </div>
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredPorts.map((port, index) => (
                        <motion.tr
                          key={port.unLoCode}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.01 }}
                          className="group cursor-pointer hover:bg-muted/50 border-b"
                          onClick={() => handleSelectPort(port)}
                        >
                          <TableCell>
                            <Badge variant="outline" className="font-mono border-[#0F4C81] text-[#0F4C81] dark:border-[#0F4C81] dark:text-[#0F4C81]">
                              {port.unLoCode}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium group-hover:text-[#0F4C81] transition-colors">
                            {port.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">({port.countryCode})</span>
                              {port.country}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {port.region}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {port.portType.slice(0, 2).map(type => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                              {port.portType.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{port.portType.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {port.throughput ? (
                              <span className="text-[#0F4C81] font-medium">{port.throughput}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-[#0F4C81] transition-colors" />
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filteredPorts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12">
                          <Ship className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground">No ports found matching your criteria</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {recentSearches.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recently Viewed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(search => (
                    <Button
                      key={search.code}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const port = getPortByUnLoCode(search.code);
                        if (port) handleSelectPort(port);
                      }}
                    >
                      <Badge variant="outline" className="mr-2 font-mono">{search.code}</Badge>
                      {search.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Browse Tab */}
        <TabsContent value="browse" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Browse by Region
                </CardTitle>
                <CardDescription>Explore ports by geographic region</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {REGIONS.map(region => {
                  const portCount = PORTS.filter(p => p.region.toLowerCase() === region.id.toLowerCase()).length;
                  return (
                    <Button
                      key={region.id}
                      variant="outline"
                      className="w-full justify-between h-auto py-3"
                      onClick={() => {
                        setSelectedRegion(region.id);
                        setActiveTab("search");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{region.name}</span>
                        <Badge variant="secondary">{portCount} ports</Badge>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Browse by Country
                </CardTitle>
                <CardDescription>Find ports in specific countries</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {Object.entries(portsByCountry)
                      .sort(([, a], [, b]) => b.length - a.length)
                      .map(([country, ports]) => (
                        <Button
                          key={country}
                          variant="ghost"
                          className="w-full justify-between"
                          onClick={() => {
                            setSelectedCountry(ports[0].countryCode);
                            setActiveTab("search");
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">({ports[0].countryCode})</span>
                            <span>{country}</span>
                          </div>
                          <Badge variant="outline">{ports.length}</Badge>
                        </Button>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Ports by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(portsByRegion).map(([region, ports]) => (
                  <div key={region}>
                    <div className="flex items-center gap-2 mb-3">
                      <Globe className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                      <h3 className="font-semibold">{region}</h3>
                      <Badge variant="secondary">{ports.length}</Badge>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {ports.slice(0, 8).map(port => (
                        <Button
                          key={port.unLoCode}
                          variant="outline"
                          size="sm"
                          className="justify-start h-auto py-2"
                          onClick={() => handleSelectPort(port)}
                        >
                          <Badge variant="outline" className="mr-2 font-mono text-xs">{port.unLoCode}</Badge>
                          <span className="truncate">{port.name}</span>
                        </Button>
                      ))}
                      {ports.length > 8 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start"
                          onClick={() => {
                            setSelectedRegion(region.toLowerCase());
                            setActiveTab("search");
                          }}
                        >
                          +{ports.length - 8} more
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-6">
          <AnalysisTab />
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="mt-6">
          <GuideTab />
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6">
          <FAQTab />
        </TabsContent>
      </Tabs>

      {/* Port Detail Modal */}
      <AnimatePresence>
        {selectedPort && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedPort(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="font-mono text-base bg-[#0F4C81]">{selectedPort.unLoCode}</Badge>
                        {selectedPort.throughput && (
                          <Badge variant="secondary">{selectedPort.throughput}</Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{selectedPort.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        {selectedPort.country} ({selectedPort.countryCode}) • {selectedPort.region}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedPort(null)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Anchor className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                      Port Types
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPort.portType.map(type => (
                        <Badge key={type} variant="outline" className="flex items-center gap-1">
                          {getPortTypeIcon(type)}
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Building className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                      Terminal Facilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPort.facilities.map(facility => (
                        <Badge key={facility} variant="secondary">{facility}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Ship className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                      Vessel Types Handled
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPort.vesselTypes.map(type => (
                        <Badge key={type} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Navigation className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        Coordinates
                      </h4>
                      <p className="font-mono text-sm">
                        {selectedPort.coordinates.lat.toFixed(4)}° {selectedPort.coordinates.lat >= 0 ? 'N' : 'S'}, 
                        {' '}{Math.abs(selectedPort.coordinates.lng).toFixed(4)}° {selectedPort.coordinates.lng >= 0 ? 'E' : 'W'}
                      </p>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                        <a 
                          href={`https://www.google.com/maps?q=${selectedPort.coordinates.lat},${selectedPort.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Google Maps <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        Timezone
                      </h4>
                      <p className="font-mono text-sm">{selectedPort.timezone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge 
                      variant={selectedPort.status === 'active' ? 'default' : 'secondary'}
                      className={selectedPort.status === 'active' ? 'bg-[#2E8B57]' : ''}
                    >
                      {selectedPort.status.charAt(0).toUpperCase() + selectedPort.status.slice(1)}
                    </Badge>
                  </div>

                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={`https://service.unece.org/trade/locode/Service.aspx?query=${selectedPort.unLoCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        UN/LOCODE Database
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Container className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
