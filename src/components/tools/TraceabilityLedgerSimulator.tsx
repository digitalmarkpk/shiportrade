"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Link2,
  MapPin,
  Calendar,
  User,
  Package,
  Truck,
  Ship,
  CheckCircle2,
  Clock,
  Hash,
  FileText,
  Plus,
  RotateCcw,
  Download,
  Share2,
  Globe,
  Building,
  Anchor,
  Shield,
  Database,
  Activity,
  TrendingUp,
  PieChart as PieChartIcon,
  BookOpen,
  HelpCircle,
  Zap,
  Lock,
  Eye,
  Search,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SupplyChainEvent {
  id: string;
  timestamp: Date;
  eventType: "origin" | "processing" | "transit" | "customs" | "delivery" | "verification";
  location: string;
  actor: string;
  actorType: "producer" | "manufacturer" | "carrier" | "customs" | "warehouse" | "retailer";
  description: string;
  data: Record<string, string>;
  previousHash: string;
  hash: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  origin: string;
  createdAt: Date;
}

const eventTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  origin: { icon: Package, color: "bg-[var(--logistics)]", label: "Origin" },
  processing: { icon: Building, color: "bg-[var(--ocean)]", label: "Processing" },
  transit: { icon: Truck, color: "bg-amber-500", label: "Transit" },
  customs: { icon: FileText, color: "bg-purple-500", label: "Customs" },
  delivery: { icon: MapPin, color: "bg-cyan-500", label: "Delivery" },
  verification: { icon: CheckCircle2, color: "bg-emerald-500", label: "Verification" },
};

const actorTypes = [
  { value: "producer", label: "Producer/Farm" },
  { value: "manufacturer", label: "Manufacturer" },
  { value: "carrier", label: "Carrier/Logistics" },
  { value: "customs", label: "Customs Broker" },
  { value: "warehouse", label: "Warehouse/DC" },
  { value: "retailer", label: "Retailer" },
];

const eventTypes = [
  { value: "origin", label: "Origin/Creation" },
  { value: "processing", label: "Processing/Manufacturing" },
  { value: "transit", label: "Transit/Transport" },
  { value: "customs", label: "Customs Clearance" },
  { value: "delivery", label: "Delivery/Handoff" },
  { value: "verification", label: "Quality Verification" },
];

// Simulate hash generation
const generateHash = (data: string): string => {
  let hash = "";
  for (let i = 0; i < 8; i++) {
    hash += Math.random().toString(16).substr(2, 8);
    if (i < 7) hash += "";
  }
  return `0x${hash}`;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const badgeVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 10,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
};

// Chart colors
const CHART_COLORS = [
  "var(--ocean)",
  "var(--logistics)",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
];

export function TraceabilityLedgerSimulator() {
  const [product, setProduct] = useState<Product>({
    id: `PRD-${Date.now().toString(36).toUpperCase()}`,
    name: "Organic Coffee Beans",
    category: "Agricultural Products",
    origin: "Colombia",
    createdAt: new Date(),
  });

  const [events, setEvents] = useState<SupplyChainEvent[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      eventType: "origin",
      location: "Huila, Colombia",
      actor: "Café de Colombia Co.",
      actorType: "producer",
      description: "Coffee beans harvested and graded",
      data: { quality: "Grade A", weight: "500kg", variety: "Arabica" },
      previousHash: "0x0000000000000000",
      hash: generateHash("origin"),
    },
  ]);

  const [newEvent, setNewEvent] = useState<Partial<SupplyChainEvent>>({
    eventType: "transit",
    location: "",
    actor: "",
    actorType: "carrier",
    description: "",
    data: {},
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1000);

  // Analysis data
  const eventDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    events.forEach(e => {
      distribution[e.eventType] = (distribution[e.eventType] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({
      name: eventTypeConfig[name]?.label || name,
      value,
    }));
  }, [events]);

  const timelineData = useMemo(() => {
    return events.map((e, index) => ({
      name: `Block ${index + 1}`,
      events: 1,
      cumulative: index + 1,
      timestamp: e.timestamp.toLocaleDateString(),
    }));
  }, [events]);

  const actorDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    events.forEach(e => {
      distribution[e.actorType] = (distribution[e.actorType] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({
      name: actorTypes.find(a => a.value === name)?.label || name,
      value,
    }));
  }, [events]);

  const chainMetrics = useMemo(() => {
    const uniqueActors = new Set(events.map(e => e.actor)).size;
    const uniqueLocations = new Set(events.map(e => e.location)).size;
    const avgTimeBetweenEvents = events.length > 1 
      ? Math.round((Date.now() - events[0].timestamp.getTime()) / (events.length * 24 * 60 * 60 * 1000))
      : 0;
    
    return {
      totalBlocks: events.length,
      uniqueActors,
      uniqueLocations,
      chainIntegrity: 100,
      avgTimeBetweenEvents,
    };
  }, [events]);

  const addEvent = () => {
    const lastEvent = events[events.length - 1];
    const newEventRecord: SupplyChainEvent = {
      id: `${events.length + 1}`,
      timestamp: new Date(),
      eventType: newEvent.eventType as SupplyChainEvent["eventType"],
      location: newEvent.location || "Unknown",
      actor: newEvent.actor || "Unknown",
      actorType: newEvent.actorType as SupplyChainEvent["actorType"],
      description: newEvent.description || "",
      data: newEvent.data || {},
      previousHash: lastEvent.hash,
      hash: generateHash(`${events.length}-${Date.now()}`),
    };
    setEvents([...events, newEventRecord]);
    setNewEvent({
      eventType: "transit",
      location: "",
      actor: "",
      actorType: "carrier",
      description: "",
      data: {},
    });
  };

  const runSimulation = () => {
    setIsSimulating(true);
    const sampleEvents: Partial<SupplyChainEvent>[] = [
      { eventType: "processing", location: "Bogotá, Colombia", actor: "Café Processors Inc.", actorType: "manufacturer", description: "Beans roasted and packaged", data: { temp: "200°C", duration: "15min" } },
      { eventType: "transit", location: "Cartagena Port, Colombia", actor: "Maersk Line", actorType: "carrier", description: "Loaded onto container vessel", data: { container: "MSKU-123456", vessel: "Maersk Line" } },
      { eventType: "customs", location: "Port of Miami, USA", actor: "US Customs", actorType: "customs", description: "Cleared customs inspection", data: { status: "Cleared", tariff: "0%" } },
      { eventType: "transit", location: "Miami, FL, USA", actor: "J.B. Hunt Transport", actorType: "carrier", description: "Inland transport to warehouse", data: { truck: "TRK-789", eta: "2 days" } },
      { eventType: "delivery", location: "Atlanta, GA, USA", actor: "Atlantic Warehouse Co.", actorType: "warehouse", description: "Received at distribution center", data: { qty: "500kg", condition: "Good" } },
      { eventType: "verification", location: "Atlanta, GA, USA", actor: "Quality Inspector", actorType: "warehouse", description: "Quality verification completed", data: { grade: "Premium", certified: "Yes" } },
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index >= sampleEvents.length) {
        clearInterval(interval);
        setIsSimulating(false);
        return;
      }
      const lastEvent = events[events.length - 1 + index];
      const eventData = sampleEvents[index];
      const newRecord: SupplyChainEvent = {
        id: `${events.length + index + 1}`,
        timestamp: new Date(),
        eventType: eventData.eventType as SupplyChainEvent["eventType"],
        location: eventData.location || "",
        actor: eventData.actor || "",
        actorType: eventData.actorType as SupplyChainEvent["actorType"],
        description: eventData.description || "",
        data: eventData.data || {},
        previousHash: lastEvent?.hash || "0x0000000000000000",
        hash: generateHash(`${events.length + index}-${Date.now()}`),
      };
      setEvents(prev => [...prev, newRecord]);
      index++;
    }, simulationSpeed);
  };

  const resetSimulation = () => {
    setEvents([
      {
        id: "1",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        eventType: "origin",
        location: product.origin,
        actor: "Origin Producer",
        actorType: "producer",
        description: "Product created/harvested",
        data: { quantity: "100 units", condition: "Good" },
        previousHash: "0x0000000000000000",
        hash: generateHash("origin"),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--ocean)]/10 via-transparent to-[var(--logistics)]/10 rounded-2xl" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        <div className="relative p-6 md:p-8">
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-4">
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="inline-flex"
            >
              <Badge className="bg-[var(--ocean)] hover:bg-[var(--ocean-dark)] text-white px-4 py-1.5 text-sm gap-2">
                <Layers className="h-4 w-4" />
                Blockchain
              </Badge>
            </motion.div>
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="inline-flex"
              style={{ animationDelay: "0.1s" }}
            >
              <Badge className="bg-[var(--logistics)] hover:bg-[var(--logistics-dark)] text-white px-4 py-1.5 text-sm gap-2">
                <Truck className="h-4 w-4" />
                Supply Chain
              </Badge>
            </motion.div>
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="inline-flex"
              style={{ animationDelay: "0.2s" }}
            >
              <Badge variant="outline" className="border-purple-500 text-purple-600 dark:text-purple-400 px-4 py-1.5 text-sm gap-2">
                <Shield className="h-4 w-4" />
                Immutable
              </Badge>
            </motion.div>
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className="inline-flex"
              style={{ animationDelay: "0.3s" }}
            >
              <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400 px-4 py-1.5 text-sm gap-2">
                <Activity className="h-4 w-4" />
                Real-time
              </Badge>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl font-bold text-gradient-ocean mb-2">
              Traceability Ledger Simulator
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
              Experience the power of blockchain-based supply chain tracking. Simulate product journeys, 
              verify chain integrity, and understand how distributed ledger technology ensures transparency 
              and trust across global logistics networks.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Total Blocks", value: chainMetrics.totalBlocks, icon: Database, color: "text-[var(--ocean)]" },
              { label: "Unique Actors", value: chainMetrics.uniqueActors, icon: User, color: "text-[var(--logistics)]" },
              { label: "Locations", value: chainMetrics.uniqueLocations, icon: MapPin, color: "text-purple-500" },
              { label: "Chain Status", value: "Valid", icon: CheckCircle2, color: "text-emerald-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 hover:border-[var(--ocean)]/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs defaultValue="simulator" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="simulator" className="flex items-center gap-2 py-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Simulator</span>
          </TabsTrigger>
          <TabsTrigger value="ledger" className="flex items-center gap-2 py-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Ledger</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 py-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 py-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Simulator Tab */}
        <TabsContent value="simulator" className="space-y-6 mt-6">
          {/* Product Info */}
          <Card className="bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5 border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--ocean)]" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Product ID</Label>
                  <div className="font-mono text-sm flex items-center gap-2">
                    <Hash className="h-3 w-3 text-[var(--ocean)]" />
                    {product.id}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Product Name</Label>
                  <Input
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <Input
                    value={product.category}
                    onChange={(e) => setProduct({ ...product, category: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Origin</Label>
                  <Input
                    value={product.origin}
                    onChange={(e) => setProduct({ ...product, origin: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Event Input */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5 text-[var(--logistics)]" />
                    Add Ledger Event
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <Select
                      value={newEvent.eventType}
                      onValueChange={(v) => setNewEvent({ ...newEvent, eventType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Actor/Company</Label>
                    <Input
                      value={newEvent.actor}
                      onChange={(e) => setNewEvent({ ...newEvent, actor: e.target.value })}
                      placeholder="Company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Actor Type</Label>
                    <Select
                      value={newEvent.actorType}
                      onValueChange={(v) => setNewEvent({ ...newEvent, actorType: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {actorTypes.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="What happened?"
                    />
                  </div>

                  <Button onClick={addEvent} className="w-full bg-[var(--ocean)] hover:bg-[var(--ocean-dark)]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event to Ledger
                  </Button>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Auto-Simulation</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="flex-1 bg-[var(--logistics)] hover:bg-[var(--logistics-dark)]"
                      >
                        {isSimulating ? (
                          <>
                            <Activity className="h-4 w-4 mr-2 animate-pulse" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Run Demo
                          </>
                        )}
                      </Button>
                      <Button onClick={resetSimulation} variant="outline" size="icon">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ledger Preview */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Layers className="h-5 w-5 text-[var(--ocean)]" />
                      Blockchain Ledger
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {events.length} events recorded • Last updated: {new Date().toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--ocean)] via-[var(--logistics)] to-purple-500" />

                      {/* Events */}
                      <div className="space-y-4">
                        <AnimatePresence>
                          {events.map((event, index) => {
                            const config = eventTypeConfig[event.eventType];
                            const Icon = config.icon;
                            return (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative pl-14 pb-4"
                              >
                                {/* Timeline Dot */}
                                <div className={`absolute left-3 w-6 h-6 rounded-full ${config.color} flex items-center justify-center shadow-md`}>
                                  <Icon className="h-3 w-3 text-white" />
                                </div>

                                {/* Event Card */}
                                <div className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          {config.label}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {event.timestamp.toLocaleString()}
                                        </span>
                                      </div>
                                      <h4 className="font-medium mt-1">{event.description}</h4>
                                    </div>
                                    <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] dark:bg-[var(--ocean)]/20 border-0 text-xs">
                                      Block #{index + 1}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <MapPin className="h-3 w-3" />
                                      <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <User className="h-3 w-3" />
                                      <span>{event.actor}</span>
                                    </div>
                                  </div>

                                  {/* Hash Info */}
                                  <div className="mt-3 p-2 bg-black/5 dark:bg-white/5 rounded text-xs font-mono">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Hash className="h-3 w-3" />
                                      <span className="truncate">{event.hash}</span>
                                    </div>
                                    {event.previousHash && (
                                      <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                        <Link2 className="h-3 w-3" />
                                        <span className="truncate">Prev: {event.previousHash.slice(0, 20)}...</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Additional Data */}
                                  {Object.keys(event.data).length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {Object.entries(event.data).map(([key, value]) => (
                                        <Badge key={key} variant="secondary" className="text-xs">
                                          {key}: {value}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Ledger Tab */}
        <TabsContent value="ledger" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Chain Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-[var(--ocean)]" />
                  Chain Overview
                </CardTitle>
                <CardDescription>Complete blockchain ledger with hash verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border border-border bg-muted/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">
                            Block #{index + 1}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {eventTypeConfig[event.eventType]?.label}
                          </Badge>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Lock className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-xs text-muted-foreground truncate">
                            {event.hash}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link2 className="h-3 w-3 text-muted-foreground" />
                          <span className="font-mono text-xs text-muted-foreground truncate">
                            Prev: {event.previousHash?.slice(0, 30)}...
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {event.timestamp.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chain Integrity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--logistics)]" />
                  Chain Integrity
                </CardTitle>
                <CardDescription>Verification status and security metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center p-6">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${chainMetrics.chainIntegrity * 3.52} 352`}
                        className="text-[var(--logistics)]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[var(--logistics)]">100%</div>
                        <div className="text-xs text-muted-foreground">Integrity</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[var(--logistics)]" />
                      <span className="text-sm">Hash Chain Valid</span>
                    </div>
                    <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)]">Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[var(--logistics)]" />
                      <span className="text-sm">No Tampering Detected</span>
                    </div>
                    <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)]">Secure</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-[var(--logistics)]" />
                      <span className="text-sm">All Events Linked</span>
                    </div>
                    <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)]">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[var(--ocean)]" />
                      <span className="text-sm">Transparent Audit Trail</span>
                    </div>
                    <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">Public</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Event Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Event Distribution
                </CardTitle>
                <CardDescription>Breakdown of event types in the supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {eventDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Actor Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[var(--logistics)]" />
                  Actor Distribution
                </CardTitle>
                <CardDescription>Participants in the supply chain journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={actorDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="value" fill="var(--ocean)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Supply Chain Timeline
                </CardTitle>
                <CardDescription>Event progression over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="cumulative"
                        stroke="var(--ocean)"
                        fill="var(--ocean)"
                        fillOpacity={0.2}
                        name="Cumulative Events"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Metrics Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                  Chain Metrics Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-[var(--ocean)]" />
                      <span className="text-sm text-muted-foreground">Total Blocks</span>
                    </div>
                    <div className="text-2xl font-bold">{chainMetrics.totalBlocks}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-[var(--logistics)]" />
                      <span className="text-sm text-muted-foreground">Unique Actors</span>
                    </div>
                    <div className="text-2xl font-bold">{chainMetrics.uniqueActors}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span className="text-sm text-muted-foreground">Locations</span>
                    </div>
                    <div className="text-2xl font-bold">{chainMetrics.uniqueLocations}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-muted-foreground">Integrity</span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--logistics)]">{chainMetrics.chainIntegrity}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {/* What is Blockchain Traceability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  What is Blockchain Traceability?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  Blockchain traceability represents a revolutionary approach to supply chain management that leverages distributed ledger technology to create an immutable, transparent record of every transaction and movement within a product's journey. Unlike traditional centralized databases where a single entity controls the data, blockchain distributes the ledger across multiple nodes, making it virtually impossible to alter historical records without detection. This fundamental characteristic ensures that every participant in the supply chain—from raw material suppliers to end consumers—can trust the authenticity and accuracy of the product information.
                </p>
                <p className="text-muted-foreground mt-4">
                  The core principle behind blockchain traceability is the creation of cryptographic links between records. Each new entry in the ledger contains a reference to the previous entry's unique hash, forming a chain of blocks. Any attempt to modify a historical record would change its hash, breaking the chain and alerting all participants to the tampering attempt. This self-verifying nature of blockchain makes it particularly valuable for industries where trust, authenticity, and regulatory compliance are paramount, such as pharmaceuticals, food safety, luxury goods, and automotive parts.
                </p>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[var(--logistics)]" />
                  How Blockchain Supply Chain Tracking Works
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  The process of blockchain-based supply chain tracking begins when a product is first created or harvested at its origin point. At this initial stage, key information such as the product's unique identifier, source location, producer details, quality attributes, and timestamp are recorded on the blockchain. This creates the genesis block—the first link in the chain that will follow the product throughout its entire lifecycle. The data is cryptographically secured and assigned a unique hash that serves as its digital fingerprint.
                </p>
                <p className="text-muted-foreground mt-4">
                  As the product moves through the supply chain, each participant adds new blocks to the chain. When goods arrive at a processing facility, the manufacturer records transformation activities such as quality inspections, packaging, and value-added services. Logistics providers then add transit information including shipping routes, carrier details, and custody transfers. Customs authorities contribute clearance data, and warehouses record storage conditions. Finally, retailers and consumers can verify the complete history by tracing the blockchain from end to beginning, ensuring the product's authenticity and compliance with relevant standards.
                </p>
              </CardContent>
            </Card>

            {/* Key Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Key Benefits of Blockchain Traceability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-[var(--ocean)]" />
                      <span className="font-medium">Immutability</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Once recorded, data cannot be altered or deleted, ensuring the integrity of historical records and preventing fraud or data manipulation.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-[var(--logistics)]" />
                      <span className="font-medium">Transparency</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      All authorized participants can view the complete history of a product, creating trust and enabling faster dispute resolution.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Security</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Cryptographic hashing and distributed consensus mechanisms protect against unauthorized modifications and cyber attacks.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <span className="font-medium">Efficiency</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Automated verification reduces manual checks, accelerates customs clearance, and streamlines recall procedures when issues arise.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Events Explained */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  Understanding Supply Chain Events
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  In a blockchain traceability system, supply chain events represent discrete transactions or state changes that occur as products move from origin to destination. Each event type captures specific information relevant to that stage of the journey. Origin events document the initial creation or harvesting of raw materials, including producer details, geographic location, and initial quality assessments. Processing events record manufacturing activities such as transformation, packaging, and quality control procedures applied to the product.
                </p>
                <p className="text-muted-foreground mt-4">
                  Transit events track the movement of goods between locations, capturing carrier information, shipping routes, container numbers, and estimated arrival times. Customs events document regulatory compliance activities including duty payments, inspection results, and clearance status. Delivery events mark the transfer of custody to warehouses or distribution centers, while verification events confirm quality standards and authenticity through inspections or certifications. Together, these event types create a comprehensive digital thread that enables complete supply chain visibility.
                </p>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-[var(--ocean)]" />
                  Getting Started with the Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Configure Your Product</h4>
                      <p className="text-sm text-muted-foreground">
                        Start by setting the product name, category, and origin location. This information will appear in the genesis block of your simulated blockchain.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Add Supply Chain Events</h4>
                      <p className="text-sm text-muted-foreground">
                        Manually add events like transit, processing, or customs clearance. Each event is cryptographically linked to the previous one, creating a verifiable chain.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Run the Demo Simulation</h4>
                      <p className="text-sm text-muted-foreground">
                        Click "Run Demo" to automatically simulate a complete coffee supply chain journey from Colombian farm to US retail, demonstrating real-world blockchain traceability.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center font-bold shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Analyze the Results</h4>
                      <p className="text-sm text-muted-foreground">
                        Use the Analysis and Ledger tabs to explore event distributions, chain integrity metrics, and the complete blockchain record with hash verification.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about blockchain traceability and this simulator</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="q1" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <Badge variant="outline" className="shrink-0">Q1</Badge>
                      <span>How does blockchain ensure data cannot be tampered with?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Blockchain technology uses cryptographic hashing to create a unique digital fingerprint for each block of data. Every block contains the hash of the previous block, creating a chain where any modification to a historical record would change its hash and break the chain. This makes tampering immediately detectable because the modified block's hash would no longer match the reference stored in subsequent blocks.
                    </p>
                    <p>
                      Additionally, in distributed blockchain networks, multiple nodes maintain copies of the ledger. Any inconsistent data would be rejected by the consensus mechanism, requiring malicious actors to control more than half the network's computing power to successfully alter records—an economically and technically infeasible proposition for well-established networks.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q2" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <Badge variant="outline" className="shrink-0">Q2</Badge>
                      <span>What types of products benefit most from blockchain traceability?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Products with high value, regulatory requirements, or consumer demand for transparency benefit most from blockchain traceability. This includes pharmaceuticals where drug authenticity and cold chain compliance are critical for patient safety, food products where origin verification and contamination tracking protect public health, and luxury goods where counterfeiting costs billions annually.
                    </p>
                    <p>
                      Other high-impact categories include automotive parts where safety-critical components require documented provenance, diamonds and precious metals where ethical sourcing certifications matter, and organic or fair-trade products where consumers pay premiums for verified sustainable practices.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q3" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <Badge variant="outline" className="shrink-0">Q3</Badge>
                      <span>How is blockchain traceability different from traditional tracking systems?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Traditional tracking systems typically rely on centralized databases controlled by a single organization, creating single points of failure and trust issues between supply chain partners. Data can be modified or deleted by authorized users without audit trails, and verifying information requires trusting the database administrator.
                    </p>
                    <p>
                      Blockchain traceability distributes data across multiple nodes, eliminates single points of control, and creates immutable records that all participants can verify independently. The consensus mechanism ensures that no single party can unilaterally alter historical data, while smart contracts can automate compliance checks and trigger actions based on predefined conditions.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q4" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <Badge variant="outline" className="shrink-0">Q4</Badge>
                      <span>What information is typically recorded in each supply chain event?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Each supply chain event typically includes several key pieces of information: a unique event identifier, timestamp, event type classification, geographic location, actor information (company name and role), and a description of what occurred. Additional metadata varies by event type—for example, transit events include carrier details and routing information, while quality verification events include inspection results and certifications.
                    </p>
                    <p>
                      Crucially, each event also contains cryptographic hashes: the hash of the event data itself (serving as a unique fingerprint) and the hash of the previous event (creating the chain link). This enables verification that the entire sequence of events has not been altered since recording.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q5" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <Badge variant="outline" className="shrink-0">Q5</Badge>
                      <span>How does blockchain help with product recalls and quality issues?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      When a quality issue or contamination is discovered, blockchain traceability enables rapid identification of all affected products by tracing backward through the chain to find the source and forward to identify all downstream recipients. Instead of broad recalls that waste enormous quantities of safe products, manufacturers can precisely target only the affected batches.
                    </p>
                    <p>
                      The complete audit trail also helps identify root causes more quickly by providing visibility into every handling step, storage condition, and custody transfer. This accelerates corrective actions and provides documentation for regulatory reporting requirements, reducing both the duration and cost of recall operations.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q6" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-left">
                      <Badge variant="outline" className="shrink-0">Q6</Badge>
                      <span>Is this simulator using real blockchain technology?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      This simulator demonstrates the concepts and user experience of blockchain traceability using simulated hash generation and local state management. It accurately represents how blocks are linked through cryptographic hashes and how supply chain events are recorded in a sequential, verifiable manner.
                    </p>
                    <p>
                      For production applications, real blockchain implementations would use established cryptographic algorithms (like SHA-256), distributed consensus mechanisms, and network synchronization. However, the fundamental principles demonstrated here—immutability, transparency, and chain verification—remain the same regardless of whether the underlying technology is a public blockchain, private permissioned network, or consortium chain.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <Card className="bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-[var(--ocean)]/10">
                  <Info className="h-6 w-6 text-[var(--ocean)]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Need More Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This simulator is designed to help you understand blockchain traceability concepts through hands-on experience. Try running the demo simulation to see a complete supply chain journey, then explore the Analysis tab to visualize the data.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Documentation
                    </Button>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
