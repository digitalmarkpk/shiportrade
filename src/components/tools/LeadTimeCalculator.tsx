"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Clock,
  Ship,
  Plane,
  Truck,
  Train,
  Calendar,
  MapPin,
  AlertTriangle,
  Info,
  RefreshCw,
  Globe,
  Package,
  Download,
  Share2,
  BarChart3,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  Layers,
  Route,
  Sparkles,
  Activity,
  Timer,
  Gauge,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

interface LeadTimeResult {
  totalDays: number;
  totalWeeks: number;
  breakdown: {
    production: number;
    inlandOrigin: number;
    customsOrigin: number;
    portHandling: number;
    transit: number;
    customsDest: number;
    inlandDest: number;
  };
  milestoneDates: {
    productionStart: string;
    productionComplete: string;
    pickupDate: string;
    departureDate: string;
    arrivalDate: string;
    deliveryDate: string;
  };
  riskFactors: string[];
  recommendations: string[];
  efficiency: number;
}

// Transit times by route (days)
const transitTimes = {
  ocean: {
    'Asia-North America West Coast': { min: 14, max: 21, avg: 17 },
    'Asia-North America East Coast': { min: 25, max: 35, avg: 30 },
    'Asia-Europe': { min: 28, max: 40, avg: 34 },
    'Asia-Mediterranean': { min: 22, max: 32, avg: 27 },
    'Europe-North America East Coast': { min: 10, max: 16, avg: 13 },
    'Europe-North America West Coast': { min: 20, max: 28, avg: 24 },
    'Intra-Asia': { min: 3, max: 10, avg: 6 },
    'Trans-Pacific (Westbound)': { min: 12, max: 18, avg: 15 },
    'South America-Asia': { min: 30, max: 45, avg: 38 },
    'Africa-Europe': { min: 12, max: 20, avg: 16 },
  },
  air: {
    'Asia-North America': { min: 2, max: 4, avg: 3 },
    'Asia-Europe': { min: 1, max: 3, avg: 2 },
    'Europe-North America': { min: 1, max: 2, avg: 1 },
    'Intra-Asia': { min: 1, max: 2, avg: 1 },
    'Global': { min: 1, max: 5, avg: 2 },
  },
  rail: {
    'China-Europe': { min: 14, max: 21, avg: 18 },
    'Trans-Siberian': { min: 18, max: 25, avg: 21 },
    'Intra-Europe': { min: 2, max: 7, avg: 4 },
  },
  road: {
    'Intra-Region': { min: 1, max: 5, avg: 3 },
    'Cross-Border': { min: 2, max: 7, avg: 4 },
  },
};

const routes = {
  ocean: Object.keys(transitTimes.ocean),
  air: Object.keys(transitTimes.air),
  rail: Object.keys(transitTimes.rail),
  road: Object.keys(transitTimes.road),
};

// Comparison data for different routes/suppliers
const comparisonData = [
  { name: "Supplier A (Ocean)", production: 14, transit: 30, customs: 5, total: 49, cost: 2800 },
  { name: "Supplier B (Air)", production: 7, transit: 3, customs: 2, total: 12, cost: 8500 },
  { name: "Supplier C (Rail)", production: 14, transit: 18, customs: 3, total: 35, cost: 4200 },
  { name: "Supplier D (Ocean)", production: 21, transit: 25, customs: 5, total: 51, cost: 2500 },
];

const FAQS = [
  {
    question: "What is supply chain lead time and why is it critical for business operations?",
    answer: "Supply chain lead time represents the total duration from placing a purchase order to receiving the goods at your facility. This metric is fundamental to inventory management, production planning, and customer satisfaction. Accurate lead time calculation enables businesses to maintain optimal inventory levels, avoid stockouts that disrupt operations, and reduce excess inventory carrying costs. Companies that master lead time management typically achieve 15-25% reduction in inventory costs while improving service levels.",
  },
  {
    question: "How do different transportation modes affect total lead time?",
    answer: "Transportation mode selection significantly impacts both lead time and cost. Ocean freight, while most economical, adds 14-45 days depending on route and port congestion. Air freight reduces transit to 1-5 days but costs 8-12 times more. Rail freight offers a middle ground at 14-21 days for Asia-Europe routes. Road transport provides flexibility for regional shipments with 1-7 day transit times.",
  },
  {
    question: "What are the key factors affecting customs clearance time?",
    answer: "Customs clearance time varies based on multiple factors including documentation accuracy, product classification, destination country regulations, and shipment value. Proper documentation (commercial invoice, packing list, certificates of origin) can reduce clearance time by 40-60%. Products requiring special permits face longer clearance times.",
  },
  {
    question: "How should I calculate buffer time for supply chain planning?",
    answer: "Buffer time protects against variability and unforeseen delays in your supply chain. Industry best practices suggest adding 10-15% of total calculated lead time as buffer. For complex international shipments with multiple handoffs, consider 15-20%. Track your on-time performance and adjust buffers quarterly.",
  },
  {
    question: "What strategies can reduce overall supply chain lead time?",
    answer: "Effective lead time reduction requires a multi-pronged approach: dual sourcing, vendor-managed inventory programs, lean manufacturing implementation, multimodal transport optimization, customs pre-clearance programs, and electronic data interchange (EDI). Companies implementing comprehensive programs typically achieve 20-40% improvement within 12-18 months.",
  },
  {
    question: "How do seasonal factors and holidays impact lead time calculations?",
    answer: "Seasonal factors and holidays can extend lead times by 20-50%. Chinese New Year creates 2-4 week delays across Asian supply chains. Port congestion during peak seasons adds 5-15 days. Build seasonal buffers into your planning calendar and maintain communication with suppliers about their holiday schedules.",
  },
  {
    question: "What role does visibility and tracking play in lead time management?",
    answer: "Real-time visibility transforms lead time management from reactive to proactive. Modern tracking systems provide milestone updates across production, inland transport, customs, and international shipping. Companies with end-to-end visibility report 30% fewer supply chain disruptions and 25% improvement in lead time accuracy.",
  },
  {
    question: "What is the optimal lead time for international shipping?",
    answer: "Optimal lead time depends on product type, value, and business model. For standard commodities shipped via ocean, 30-45 days is typical. For time-sensitive goods, air freight at 5-10 days may be justified despite higher costs. The key is balancing inventory carrying costs against stockout risks and customer service requirements.",
  },
];

const PRO_TIPS = [
  {
    title: "Plan for Peak Seasons",
    description: "Add 20-30% buffer during Q4 and pre-Chinese New Year periods when carrier capacity is constrained.",
    icon: Calendar,
    color: OCEAN_BLUE,
  },
  {
    title: "Diversify Transport Modes",
    description: "Maintain relationships with multiple carriers across different modes to ensure flexibility when disruptions occur.",
    icon: Route,
    color: LOGISTICS_GREEN,
  },
  {
    title: "Pre-clear Documentation",
    description: "Submit customs documentation 24-48 hours before arrival to minimize clearance delays at destination.",
    icon: CheckCircle2,
    color: OCEAN_BLUE,
  },
  {
    title: "Monitor Milestone Dates",
    description: "Set alerts for each milestone date. Early detection of delays enables faster response and mitigation.",
    icon: Target,
    color: LOGISTICS_GREEN,
  },
  {
    title: "Build Supplier Partnerships",
    description: "Strategic suppliers with shared visibility systems reduce lead time variability by 15-25%.",
    icon: Globe,
    color: OCEAN_BLUE,
  },
  {
    title: "Use Data Analytics",
    description: "Track historical lead time performance to identify patterns and improve forecast accuracy over time.",
    icon: BarChart3,
    color: LOGISTICS_GREEN,
  },
];

const MODE_INFO = [
  {
    mode: 'ocean',
    icon: Ship,
    title: 'Ocean Freight',
    description: 'Most economical for large volumes. Transit: 14-45 days. Best for non-urgent, bulk cargo.',
    color: OCEAN_BLUE,
  },
  {
    mode: 'air',
    icon: Plane,
    title: 'Air Freight',
    description: 'Fastest option for time-critical shipments. Transit: 1-5 days. Higher cost, ideal for high-value goods.',
    color: LOGISTICS_GREEN,
  },
  {
    mode: 'rail',
    icon: Train,
    title: 'Rail Freight',
    description: 'Balanced cost-speed for Asia-Europe routes. Transit: 14-21 days. Growing popularity as middle-ground.',
    color: '#8B5CF6',
  },
  {
    mode: 'road',
    icon: Truck,
    title: 'Road Transport',
    description: 'Flexible regional delivery. Transit: 1-7 days. Door-to-door capability for intra-continental shipments.',
    color: '#F59E0B',
  },
];

export default function LeadTimeCalculator() {
  const [transportMode, setTransportMode] = useState<'ocean' | 'air' | 'rail' | 'road'>('ocean');
  const [route, setRoute] = useState('Asia-North America West Coast');
  const [productionDays, setProductionDays] = useState('14');
  const [inlandOriginDays, setInlandOriginDays] = useState('3');
  const [customsOriginDays, setCustomsOriginDays] = useState('2');
  const [portHandlingDays, setPortHandlingDays] = useState('3');
  const [customsDestDays, setCustomsDestDays] = useState('3');
  const [inlandDestDays, setInlandDestDays] = useState('2');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [bufferDays, setBufferDays] = useState('5');
  const [activeTab, setActiveTab] = useState('calculator');

  const result = useMemo<LeadTimeResult | null>(() => {
    const production = parseInt(productionDays) || 0;
    const inlandOrigin = parseInt(inlandOriginDays) || 0;
    const customsOrigin = parseInt(customsOriginDays) || 0;
    const portHandling = parseInt(portHandlingDays) || 0;
    const customsDest = parseInt(customsDestDays) || 0;
    const inlandDest = parseInt(inlandDestDays) || 0;
    const buffer = parseInt(bufferDays) || 0;
    
    // Get transit time based on mode and route
    const transitData = transitTimes[transportMode]?.[route as keyof typeof transitTimes[typeof transportMode]] 
      || { min: 5, max: 10, avg: 7 };
    const transit = transitData.avg;

    const totalDays = production + inlandOrigin + customsOrigin + portHandling + transit + customsDest + inlandDest + buffer;
    const totalWeeks = Math.ceil(totalDays / 7);

    // Calculate milestone dates
    const start = new Date(startDate);
    const addDays = (date: Date, days: number) => {
      const resultDate = new Date(date);
      resultDate.setDate(resultDate.getDate() + days);
      return resultDate.toISOString().split('T')[0];
    };

    const productionComplete = addDays(start, production);
    const pickupDate = addDays(new Date(productionComplete), inlandOrigin + customsOrigin);
    const departureDate = addDays(new Date(pickupDate), portHandling);
    const arrivalDate = addDays(new Date(departureDate), transit);
    const deliveryDate = addDays(new Date(arrivalDate), customsDest + inlandDest);

    // Risk factors
    const riskFactors: string[] = [];
    if (transportMode === 'ocean' && transit > 20) {
      riskFactors.push('Long ocean transit may be affected by port congestion');
    }
    if (customsOrigin > 3 || customsDest > 3) {
      riskFactors.push('Extended customs clearance time indicates potential documentation complexity');
    }
    if (production > 21) {
      riskFactors.push('Long production lead time may be affected by raw material availability');
    }
    if (buffer < 5 && totalDays > 30) {
      riskFactors.push('Low buffer days for a long lead time may cause delays');
    }

    // Recommendations
    const recommendations: string[] = [];
    if (transportMode === 'ocean' && transitData.avg > 25) {
      recommendations.push('Consider air freight for urgent shipments');
    }
    if (transportMode === 'ocean' && route.includes('Europe') && !route.includes('Asia')) {
      recommendations.push('Rail freight via China-Europe route may be faster');
    }
    if (customsDest > 2) {
      recommendations.push('Pre-clear customs documentation to reduce clearance time');
    }
    if (buffer < 5) {
      recommendations.push('Add buffer days to account for unforeseen delays');
    }

    // Efficiency score
    const efficiency = Math.max(0, Math.min(100, 100 - (riskFactors.length * 15) - (buffer < 5 ? 10 : 0)));

    return {
      totalDays,
      totalWeeks,
      breakdown: {
        production,
        inlandOrigin,
        customsOrigin,
        portHandling,
        transit,
        customsDest,
        inlandDest,
      },
      milestoneDates: {
        productionStart: startDate,
        productionComplete,
        pickupDate,
        departureDate,
        arrivalDate,
        deliveryDate,
      },
      riskFactors,
      recommendations,
      efficiency,
    };
  }, [transportMode, route, productionDays, inlandOriginDays, customsOriginDays, portHandlingDays, customsDestDays, inlandDestDays, startDate, bufferDays]);

  // Chart data
  const breakdownData = result ? [
    { name: 'Production', value: result.breakdown.production, fill: OCEAN_BLUE },
    { name: 'Origin Inland', value: result.breakdown.inlandOrigin, fill: LOGISTICS_GREEN },
    { name: 'Export Customs', value: result.breakdown.customsOrigin, fill: '#F59E0B' },
    { name: 'Port Handling', value: result.breakdown.portHandling, fill: '#8B5CF6' },
    { name: 'Transit', value: result.breakdown.transit, fill: '#EF4444' },
    { name: 'Import Customs', value: result.breakdown.customsDest, fill: '#06B6D4' },
    { name: 'Destination', value: result.breakdown.inlandDest, fill: '#EC4899' },
  ] : [];

  const timelineData = result ? [
    { phase: 'Production', start: 0, end: result.breakdown.production, days: result.breakdown.production },
    { phase: 'Inland Origin', start: result.breakdown.production, end: result.breakdown.production + result.breakdown.inlandOrigin, days: result.breakdown.inlandOrigin },
    { phase: 'Export Customs', start: result.breakdown.production + result.breakdown.inlandOrigin, end: result.breakdown.production + result.breakdown.inlandOrigin + result.breakdown.customsOrigin, days: result.breakdown.customsOrigin },
    { phase: 'Port Handling', start: result.breakdown.production + result.breakdown.inlandOrigin + result.breakdown.customsOrigin, end: result.breakdown.production + result.breakdown.inlandOrigin + result.breakdown.customsOrigin + result.breakdown.portHandling, days: result.breakdown.portHandling },
    { phase: 'Transit', start: result.breakdown.production + result.breakdown.inlandOrigin + result.breakdown.customsOrigin + result.breakdown.portHandling, end: result.breakdown.production + result.breakdown.inlandOrigin + result.breakdown.customsOrigin + result.breakdown.portHandling + result.breakdown.transit, days: result.breakdown.transit },
    { phase: 'Import Customs', start: result.breakdown.production + result.breakdown.inlandOrigin + result.breakdown.customsOrigin + result.breakdown.portHandling + result.breakdown.transit, end: result.breakdown.production + result.breakdown.inlandOrigin + result.breakdown.customsOrigin + result.breakdown.portHandling + result.breakdown.transit + result.breakdown.customsDest, days: result.breakdown.customsDest },
    { phase: 'Final Delivery', start: result.breakdown.production + result.breakdown.inlandOrigin + result.breakdown.customsOrigin + result.breakdown.portHandling + result.breakdown.transit + result.breakdown.customsDest, end: result.totalDays, days: result.breakdown.inlandDest },
  ] : [];

  const efficiencyData = result ? [
    {
      name: 'Efficiency',
      value: result.efficiency,
      fill: result.efficiency >= 80 ? LOGISTICS_GREEN : result.efficiency >= 60 ? '#22C55E' : result.efficiency >= 40 ? '#F59E0B' : '#EF4444',
    },
  ] : [];

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'ocean': return <Ship className="h-5 w-5" />;
      case 'air': return <Plane className="h-5 w-5" />;
      case 'rail': return <Train className="h-5 w-5" />;
      case 'road': return <Truck className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  const handleModeChange = (mode: 'ocean' | 'air' | 'rail' | 'road') => {
    setTransportMode(mode);
    const routeOptions = routes[mode];
    if (routeOptions.length > 0) {
      setRoute(routeOptions[0]);
    }
  };

  const resetForm = () => {
    setTransportMode('ocean');
    setRoute('Asia-North America West Coast');
    setProductionDays('14');
    setInlandOriginDays('3');
    setCustomsOriginDays('2');
    setPortHandlingDays('3');
    setCustomsDestDays('3');
    setInlandDestDays('2');
    setBufferDays('5');
    setStartDate(new Date().toISOString().split('T')[0]);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return LOGISTICS_GREEN;
    if (efficiency >= 60) return "#22C55E";
    if (efficiency >= 40) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
        {/* Animated Background */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}08 0%, transparent 50%, ${LOGISTICS_GREEN}08 100%)` }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${OCEAN_BLUE}20 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${LOGISTICS_GREEN}20 0%, transparent 70%)` }} />
        
        {/* Floating Icons */}
        <motion.div
          className="absolute top-8 right-20 opacity-10"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Ship className="w-20 h-20" style={{ color: OCEAN_BLUE }} />
        </motion.div>
        <motion.div
          className="absolute bottom-8 left-20 opacity-10"
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plane className="w-16 h-16" style={{ color: LOGISTICS_GREEN }} />
        </motion.div>

        <div className="relative p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="text-white border-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, ${LOGISTICS_GREEN} 100%)` }}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Supply Chain Intelligence
                </Badge>
                <Badge variant="outline" className="border-2" style={{ borderColor: LOGISTICS_GREEN, color: LOGISTICS_GREEN }}>
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Logistics Planning
                </Badge>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Activity className="h-3.5 w-3.5 mr-1.5" />
                  Real-time Analysis
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70">
                  Lead Time Calculator
                </h1>
                <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
                  Calculate end-to-end supply chain lead times with detailed breakdown analysis, 
                  milestone tracking, and risk assessment for optimized logistics planning.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                  <Timer className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  <span className="text-sm font-medium">{result?.totalDays || 0} Days</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                  <Gauge className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                  <span className="text-sm font-medium">{result?.efficiency || 0}% Efficiency</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">{result?.riskFactors.length || 0} Risk Factors</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={resetForm} className="border-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" className="border-2">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="border-2">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl h-12">
          <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:text-white data-[state=active]:shadow-md" style={{ '--active-bg': OCEAN_BLUE } as React.CSSProperties}>
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card className="border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Transport Configuration
                  </CardTitle>
                  <CardDescription>
                    Select transportation mode and route
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Transport Mode Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Transportation Mode</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['ocean', 'air', 'rail', 'road'] as const).map((mode) => (
                        <Button
                          key={mode}
                          variant={transportMode === mode ? 'default' : 'outline'}
                          className={`flex flex-col h-auto py-3 transition-all duration-200 ${transportMode === mode ? 'text-white shadow-lg' : 'hover:border-2'}`}
                          style={transportMode === mode ? { background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, ${LOGISTICS_GREEN} 100%)` } : {}}
                          onClick={() => handleModeChange(mode)}
                        >
                          {getModeIcon(mode)}
                          <span className="text-xs mt-1 capitalize">{mode}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Route</Label>
                    <Select value={route} onValueChange={setRoute}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {routes[transportMode].map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border">
                    <div className="grid grid-cols-3 gap-3 text-center text-sm">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground font-medium">Min Transit</div>
                        <div className="text-xl font-bold" style={{ color: OCEAN_BLUE }}>
                          {transitTimes[transportMode]?.[route as keyof typeof transitTimes[typeof transportMode]]?.min || 0}
                          <span className="text-xs font-normal ml-0.5">days</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground font-medium">Average</div>
                        <div className="text-xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                          {transitTimes[transportMode]?.[route as keyof typeof transitTimes[typeof transportMode]]?.avg || 0}
                          <span className="text-xs font-normal ml-0.5">days</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground font-medium">Max Transit</div>
                        <div className="text-xl font-bold text-amber-600">
                          {transitTimes[transportMode]?.[route as keyof typeof transitTimes[typeof transportMode]]?.max || 0}
                          <span className="text-xs font-normal ml-0.5">days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2" style={{ borderColor: `${LOGISTICS_GREEN}20` }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Time Components
                  </CardTitle>
                  <CardDescription>
                    Enter duration for each lead time phase
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bufferDays" className="text-sm font-medium">Buffer Days</Label>
                      <Input
                        id="bufferDays"
                        type="number"
                        value={bufferDays}
                        onChange={(e) => setBufferDays(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="production" className="text-sm font-medium">Production (days)</Label>
                      <Input
                        id="production"
                        type="number"
                        value={productionDays}
                        onChange={(e) => setProductionDays(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inlandOrigin" className="text-sm font-medium">Origin Inland (days)</Label>
                      <Input
                        id="inlandOrigin"
                        type="number"
                        value={inlandOriginDays}
                        onChange={(e) => setInlandOriginDays(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customsOrigin" className="text-sm font-medium">Export Customs (days)</Label>
                      <Input
                        id="customsOrigin"
                        type="number"
                        value={customsOriginDays}
                        onChange={(e) => setCustomsOriginDays(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portHandling" className="text-sm font-medium">Port Handling (days)</Label>
                      <Input
                        id="portHandling"
                        type="number"
                        value={portHandlingDays}
                        onChange={(e) => setPortHandlingDays(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customsDest" className="text-sm font-medium">Import Customs (days)</Label>
                      <Input
                        id="customsDest"
                        type="number"
                        value={customsDestDays}
                        onChange={(e) => setCustomsDestDays(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inlandDest" className="text-sm font-medium">Destination Delivery (days)</Label>
                      <Input
                        id="inlandDest"
                        type="number"
                        value={inlandDestDays}
                        onChange={(e) => setInlandDestDays(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 overflow-hidden" style={{ borderColor: `${OCEAN_BLUE}30` }}>
                <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Lead Time Results
                  </CardTitle>
                  <CardDescription>
                    Complete lead time analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Primary Result */}
                  <div className="text-center">
                    <motion.div
                      key={result?.totalDays}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-2xl p-8 text-white shadow-xl"
                      style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, ${LOGISTICS_GREEN} 100%)` }}
                    >
                      <p className="text-sm opacity-90 mb-2 font-medium">Total Lead Time</p>
                      <p className="text-6xl font-bold">{result?.totalDays || 0}</p>
                      <p className="text-base opacity-80 mt-2">Days ({result?.totalWeeks || 0} weeks)</p>
                    </motion.div>
                  </div>

                  {/* Efficiency Score */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Planning Efficiency Score</span>
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: getEfficiencyColor(result?.efficiency || 0) }}
                      >
                        {result?.efficiency || 0}%
                      </span>
                    </div>
                    <Progress value={result?.efficiency || 0} className="h-3" />
                  </div>

                  {/* Time Breakdown */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Layers className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                      Time Breakdown
                    </h4>
                    {result && Object.entries(result.breakdown).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <Badge variant="secondary" className="font-medium">{value} days</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Milestone Dates */}
              <Card className="border-2" style={{ borderColor: `${LOGISTICS_GREEN}20` }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Milestone Dates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {result && Object.entries(result.milestoneDates).map(([key, date]) => (
                      <div key={key} className="bg-muted/30 rounded-lg p-3 border">
                        <p className="text-xs text-muted-foreground capitalize mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-semibold text-sm">{date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factors & Recommendations */}
              {result && (result.riskFactors.length > 0 || result.recommendations.length > 0) && (
                <div className="space-y-4">
                  {result.riskFactors.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <p className="font-semibold text-amber-700 dark:text-amber-400">Risk Factors</p>
                      </div>
                      <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1.5">
                        {result.riskFactors.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.recommendations.length > 0 && (
                    <div className="rounded-xl p-4 border-2" style={{ background: `${OCEAN_BLUE}08`, borderColor: `${OCEAN_BLUE}20` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        <p className="font-semibold" style={{ color: OCEAN_BLUE }}>Recommendations</p>
                      </div>
                      <ul className="text-sm space-y-1.5" style={{ color: OCEAN_BLUE }}>
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowUpRight className="w-4 h-4 mt-0.5 shrink-0" style={{ color: LOGISTICS_GREEN }} />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Lead Time Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={breakdownData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value: number) => [`${value} days`, 'Duration']} contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="value" name="Days" radius={[0, 8, 8, 0]}>
                        {breakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: `${LOGISTICS_GREEN}20` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Phase Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdownData.filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: '#666', strokeWidth: 1 }}
                      >
                        {breakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value} days`, 'Duration']} contentStyle={{ borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-2" style={{ borderColor: `${LOGISTICS_GREEN}20` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Timeline Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={timelineData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                      <XAxis dataKey="phase" tick={{ fontSize: 11 }} />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend />
                      <Area type="monotone" dataKey="end" name="Cumulative Days" fill={OCEAN_BLUE} fillOpacity={0.2} stroke={OCEAN_BLUE} strokeWidth={2} />
                      <Bar dataKey="days" name="Phase Duration" fill={LOGISTICS_GREEN} radius={[6, 6, 0, 0]} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          <Card className="border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl text-center border-2" style={{ background: `${OCEAN_BLUE}08`, borderColor: `${OCEAN_BLUE}20` }}>
                  <div className="text-3xl font-bold" style={{ color: OCEAN_BLUE }}>{result?.totalDays || 0}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Lead Time</div>
                </div>
                <div className="p-5 rounded-xl text-center border-2" style={{ background: `${LOGISTICS_GREEN}08`, borderColor: `${LOGISTICS_GREEN}20` }}>
                  <div className="text-3xl font-bold" style={{ color: LOGISTICS_GREEN }}>{result?.breakdown.transit || 0}</div>
                  <div className="text-sm text-muted-foreground mt-1">Transit Days</div>
                </div>
                <div className="p-5 rounded-xl text-center border-2 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <div className="text-3xl font-bold" style={{ color: getEfficiencyColor(result?.efficiency || 0) }}>
                    {result?.efficiency || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Efficiency</div>
                </div>
                <div className="p-5 rounded-xl text-center border-2 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                  <div className="text-3xl font-bold text-red-600">{result?.riskFactors.length || 0}</div>
                  <div className="text-sm text-muted-foreground mt-1">Risk Factors</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card className="border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Supplier/Route Comparison
              </CardTitle>
              <CardDescription>
                Compare lead times across different suppliers and transportation modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" orientation="left" stroke={OCEAN_BLUE} />
                    <YAxis yAxisId="right" orientation="right" stroke={LOGISTICS_GREEN} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="total" name="Total Days" fill={OCEAN_BLUE} radius={[6, 6, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="cost" name="Cost ($)" stroke={LOGISTICS_GREEN} strokeWidth={3} dot={{ fill: LOGISTICS_GREEN, strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-2" style={{ borderColor: `${LOGISTICS_GREEN}20` }}>
              <CardHeader>
                <CardTitle>Component Breakdown by Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} />
                      <Legend />
                      <Bar dataKey="production" name="Production" stackId="a" fill={OCEAN_BLUE} radius={[0, 0, 0, 0]} />
                      <Bar dataKey="transit" name="Transit" stackId="a" fill={LOGISTICS_GREEN} />
                      <Bar dataKey="customs" name="Customs" stackId="a" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
              <CardHeader>
                <CardTitle>Comparison Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left p-3 font-semibold">Option</th>
                        <th className="text-center p-3 font-semibold">Days</th>
                        <th className="text-center p-3 font-semibold">Cost</th>
                        <th className="text-center p-3 font-semibold">$/Day</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonData.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-3 font-medium">{item.name}</td>
                          <td className="text-center p-3 font-semibold" style={{ color: OCEAN_BLUE }}>{item.total}</td>
                          <td className="text-center p-3 font-semibold" style={{ color: LOGISTICS_GREEN }}>${item.cost.toLocaleString()}</td>
                          <td className="text-center p-3 font-medium">${(item.cost / item.total).toFixed(0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-2" style={{ borderColor: `${LOGISTICS_GREEN}20` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Pro Tips for Lead Time Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-4 bg-muted/30 rounded-xl border hover:shadow-md transition-shadow">
                      <tip.icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: tip.color }} />
                      <div>
                        <h4 className="font-semibold text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Understanding Lead Time Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Supply chain lead time encompasses all activities from order placement to final delivery. 
                  Understanding each component enables targeted optimization and better planning accuracy.
                </p>
                <p>
                  Production time varies based on manufacturing complexity, raw material availability, and 
                  factory capacity. Inland transportation connects production facilities to ports or airports, 
                  with duration affected by distance and infrastructure quality.
                </p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Formula:</h4>
                  <div className="p-4 bg-muted/50 rounded-lg font-mono text-xs leading-relaxed">
                    Total Lead Time = Production + Inland Origin + Export Customs + Port Handling + Transit + Import Customs + Final Delivery + Buffer
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
              <CardHeader>
                <CardTitle>Transportation Mode Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {MODE_INFO.map((mode) => (
                    <div key={mode.mode} className="rounded-xl p-5 border-2 transition-all hover:shadow-lg" style={{ background: `${mode.color}08`, borderColor: `${mode.color}20` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <mode.icon className="h-5 w-5" style={{ color: mode.color }} />
                        <h5 className="font-semibold" style={{ color: mode.color }}>{mode.title}</h5>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {mode.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-2" style={{ borderColor: `${LOGISTICS_GREEN}20` }}>
              <CardHeader>
                <CardTitle>Best Practices for Lead Time Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Effective lead time management requires a holistic approach combining strategic planning, 
                  supplier collaboration, and continuous improvement. Start by establishing baseline metrics 
                  for each lead time component through historical data analysis.
                </p>
                <p>
                  Collaborate with suppliers on production scheduling and inventory positioning strategies. 
                  Implement vendor-managed inventory (VMI) programs with strategic partners to reduce 
                  production lead times. Consider near-shoring or regional manufacturing for products with 
                  high demand volatility.
                </p>
                <p>
                  Leverage technology for visibility and automation. Real-time tracking systems enable 
                  proactive exception management. Electronic documentation reduces customs processing time. 
                  Regular performance reviews with carriers and suppliers drive continuous improvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="border-2" style={{ borderColor: `${OCEAN_BLUE}20` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about supply chain lead time calculation and management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-3">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-2 rounded-xl px-4 data-[state=open]:shadow-md" style={{ borderColor: `${OCEAN_BLUE}15` }}>
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <HelpCircle className="h-4 w-4 shrink-0" style={{ color: LOGISTICS_GREEN }} />
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-7 pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card className="border-2" style={{ borderColor: `${LOGISTICS_GREEN}20` }}>
            <CardHeader>
              <CardTitle>Quick Reference Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl border-2 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    Short Lead Time
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Under 15 days. Typically domestic or regional shipments using air or express road services.
                  </p>
                </div>
                <div className="p-5 rounded-xl border-2" style={{ background: `${OCEAN_BLUE}08`, borderColor: `${OCEAN_BLUE}20` }}>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    Medium Lead Time
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    15-45 days. Standard international shipments via ocean freight with efficient routing.
                  </p>
                </div>
                <div className="p-5 rounded-xl border-2 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Long Lead Time
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Over 45 days. Complex supply chains, custom manufacturing, or multi-modal routing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
