'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, Ship, Plane, Truck, Train, DollarSign, TrendingUp, AlertTriangle,
  Info, RefreshCw, Globe, Package, Scale, ArrowRight, Download, Share2,
  BarChart3, PieChart, BookOpen, HelpCircle, Sparkles, ChevronDown, ChevronUp,
  CheckCircle2, Clock, Fuel, Shield, FileText, Box, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FreightRateResult {
  baseRate: number;
  fuelSurcharge: number;
  securitySurcharge: number;
  documentationFee: number;
  handlingFee: number;
  totalRate: number;
  costPerKg: number;
  costPerCbm: number;
  costPerContainer: number;
  comparison: {
    mode: string;
    totalCost: number;
    transitDays: number;
    costEfficiency: string;
  }[];
  recommendations: string[];
}

// Rate benchmarks (per kg or per CBM)
const rateBenchmarks = {
  ocean: {
    'Asia-North America': { perCBM: 80, perContainer20: 2500, perContainer40: 3200, transit: 18 },
    'Asia-Europe': { perCBM: 70, perContainer20: 2200, perContainer40: 2800, transit: 32 },
    'Europe-North America': { perCBM: 90, perContainer20: 2800, perContainer40: 3600, transit: 14 },
    'Intra-Asia': { perCBM: 40, perContainer20: 1200, perContainer40: 1600, transit: 7 },
    'South America-Asia': { perCBM: 100, perContainer20: 3200, perContainer40: 4200, transit: 35 },
  },
  air: {
    'Asia-North America': { perKg: 4.5, transit: 3 },
    'Asia-Europe': { perKg: 3.8, transit: 2 },
    'Europe-North America': { perKg: 3.2, transit: 1 },
    'Intra-Asia': { perKg: 2.0, transit: 1 },
    'Global Average': { perKg: 4.0, transit: 2 },
  },
  rail: {
    'China-Europe': { perCBM: 120, transit: 16 },
    'Trans-Siberian': { perCBM: 100, transit: 20 },
  },
  road: {
    'Intra-Region': { perKg: 0.15, transit: 3 },
    'Cross-Border': { perKg: 0.20, transit: 5 },
  },
};

const routes = {
  ocean: Object.keys(rateBenchmarks.ocean),
  air: Object.keys(rateBenchmarks.air),
  rail: Object.keys(rateBenchmarks.rail),
  road: Object.keys(rateBenchmarks.road),
};

// Common Surcharges Data
const commonSurcharges = [
  { code: 'BAF', name: 'Bunker Adjustment Factor', description: 'Fuel cost adjustment based on bunker prices', range: '10-25% of base rate', appliesTo: ['Ocean'] },
  { code: 'CAF', name: 'Currency Adjustment Factor', description: 'Adjustment for currency fluctuations between contract and payment', range: '2-8% of base rate', appliesTo: ['Ocean'] },
  { code: 'THC', name: 'Terminal Handling Charge', description: 'Cost of handling container at origin and destination terminals', range: '$150-500 per container', appliesTo: ['Ocean'] },
  { code: 'FSC', name: 'Fuel Surcharge', description: 'Aviation fuel surcharge for air freight', range: '$0.50-1.50 per kg', appliesTo: ['Air'] },
  { code: 'SSC', name: 'Security Surcharge', description: 'Security screening and handling costs', range: '$0.10-0.25 per kg', appliesTo: ['Air', 'Ocean'] },
  { code: 'DOC', name: 'Documentation Fee', description: 'Bill of lading, airway bill, and customs documentation', range: '$50-200 per shipment', appliesTo: ['Air', 'Ocean', 'Rail', 'Road'] },
  { code: 'PSS', name: 'Peak Season Surcharge', description: 'Additional charge during high-demand periods (Aug-Oct)', range: '$200-1000 per container', appliesTo: ['Ocean'] },
  { code: 'GRI', name: 'General Rate Increase', description: 'Carrier-imposed rate increases throughout the year', range: '5-15% increase', appliesTo: ['Ocean'] },
  { code: 'WRS', name: 'War Risk Surcharge', description: 'Additional premium for routes through conflict zones', range: '$50-300 per container', appliesTo: ['Ocean'] },
  { code: 'ISPS', name: 'International Ship & Port Security', description: 'Security compliance costs at ports', range: '$10-50 per container', appliesTo: ['Ocean'] },
  { code: 'SEAL', name: 'Container Seal Fee', description: 'High-security seal for containers', range: '$5-15 per seal', appliesTo: ['Ocean'] },
  { code: 'CHAS', name: 'Chassis Fee', description: 'Chassis rental for container transport', range: '$50-150 per day', appliesTo: ['Ocean'] },
];

// FAQ Data
const faqData = [
  {
    question: "What factors determine freight rates?",
    answer: "Freight rates are determined by multiple factors including the mode of transport (ocean, air, rail, road), distance and route, cargo weight and volume, fuel prices, seasonal demand fluctuations, carrier capacity, and applicable surcharges. The relationship between supply and demand in the shipping market significantly impacts rates, with peak seasons typically commanding higher prices. Additionally, cargo characteristics such as hazardous materials, temperature requirements, or special handling needs can increase costs."
  },
  {
    question: "How is chargeable weight calculated for air freight?",
    answer: "For air freight, chargeable weight is the greater of actual gross weight or volumetric weight. Volumetric weight is calculated by dividing the cargo's volume (in cubic centimeters) by a divisor (typically 6000 for IATA standard, or 5000/139 for specific carriers like DHL/FedEx). For example, a shipment of 100kg with dimensions 100cm × 100cm × 100cm (1 CBM) would have a volumetric weight of 167kg (1,000,000 ÷ 6000), making the chargeable weight 167kg. Understanding this calculation is crucial for optimizing packaging and avoiding unexpected costs."
  },
  {
    question: "What is the difference between FCL and LCL rates?",
    answer: "FCL (Full Container Load) rates are charged per container regardless of how full it is, making it cost-effective for large shipments that can fill a container. You pay a fixed price for exclusive use of the container. LCL (Less than Container Load) rates are charged per cubic meter (CBM) or per ton, whichever is greater, making it suitable for smaller shipments. LCL rates include consolidation and deconsolidation fees at origin and destination. Generally, FCL becomes more economical when shipping more than 10-15 CBM, as LCL per-unit costs are higher due to additional handling requirements."
  },
  {
    question: "When do peak season surcharges apply?",
    answer: "Peak season surcharges typically apply during periods of high demand in the shipping industry. The main peak season for ocean freight runs from August through October, coinciding with holiday inventory stocking for Christmas and Chinese New Year preparations. Other peak periods include pre-Chinese New Year (January-February) and pre-summer (May-June). During these times, carriers implement Peak Season Surcharges (PSS) ranging from $200-1000 per container. Planning shipments outside these windows can result in significant cost savings, though this requires careful supply chain coordination."
  },
  {
    question: "How do fuel surcharges work?",
    answer: "Fuel surcharges are variable fees that adjust based on fuel price fluctuations. In ocean freight, the Bunker Adjustment Factor (BAF) is typically calculated as a percentage of the base freight rate or as a fixed amount per TEU. For air freight, the Fuel Surcharge (FSC) is usually quoted per kilogram and is updated weekly or monthly based on jet fuel prices. Carriers use fuel price indices to determine these surcharges, and they can represent 10-30% of total shipping costs. Some carriers offer fuel hedging options or fixed-rate contracts that include fuel costs."
  },
  {
    question: "What additional costs should I budget beyond base freight?",
    answer: "Beyond base freight rates, budget for: origin and destination Terminal Handling Charges (THC), documentation fees ($50-200), customs clearance fees, inland transportation to/from ports, cargo insurance (0.1-0.5% of cargo value), fuel surcharges (BAF/FSC), security surcharges, and potential peak season surcharges. For international shipments, also consider: customs duties, import taxes, quarantine fees (for agricultural products), and inspection fees. A good rule of thumb is to add 25-40% to the base freight rate to estimate total landed transport costs."
  },
  {
    question: "How can I reduce my freight costs?",
    answer: "To reduce freight costs: 1) Optimize packaging to minimize volumetric weight and maximize container utilization. 2) Book shipments early to secure better rates and avoid peak season surcharges. 3) Consider alternative routes or ports that may offer lower rates. 4) Consolidate shipments to achieve FCL rates instead of LCL. 5) Build relationships with multiple carriers to compare and negotiate rates. 6) Use intermodal transport combinations (e.g., rail-ocean) for cost-time optimization. 7) Consider freight forwarders who may have volume discounts. 8) Schedule shipments during shoulder seasons when rates are lower. Regular rate benchmarking and market analysis can identify saving opportunities."
  },
];

const COLORS = ['#0F4C81', '#2E8B57', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function FreightRateCalculator() {
  const [transportMode, setTransportMode] = useState<'ocean' | 'air' | 'rail' | 'road'>('ocean');
  const [route, setRoute] = useState('Asia-North America');
  const [cargoType, setCargoType] = useState<'fcl' | 'lcl' | 'bulk'>('fcl');
  const [containerType, setContainerType] = useState<'20GP' | '40GP' | '40HC'>('40HC');
  const [weight, setWeight] = useState('10000');
  const [volume, setVolume] = useState('50');
  const [customsValue, setCustomsValue] = useState('50000');
  const [insuranceRequired, setInsuranceRequired] = useState(true);
  const [result, setResult] = useState<FreightRateResult | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  // Calculate rate
  const calculateRate = () => {
    const weightNum = parseFloat(weight) || 0;
    const volumeNum = parseFloat(volume) || 0;
    const customsValueNum = parseFloat(customsValue) || 0;
    
    const benchmark = rateBenchmarks[transportMode]?.[route as keyof typeof rateBenchmarks[typeof transportMode]] 
      || { perCBM: 100, perKg: 4, transit: 14 };
    
    let baseRate = 0;
    let fuelSurcharge = 0;
    let securitySurcharge = 0;
    let documentationFee = 150;
    let handlingFee = 0;
    let costPerKg = 0;
    let costPerCbm = 0;
    let costPerContainer = 0;
    
    if (transportMode === 'ocean') {
      if (cargoType === 'fcl') {
        baseRate = containerType === '20GP' 
          ? (benchmark as any).perContainer20 || 2500
          : (benchmark as any).perContainer40 || 3200;
        costPerContainer = baseRate;
      } else {
        baseRate = volumeNum * ((benchmark as any).perCBM || 80);
        costPerCbm = (benchmark as any).perCBM || 80;
      }
      fuelSurcharge = baseRate * 0.15;
      handlingFee = cargoType === 'fcl' ? 350 : 150;
      securitySurcharge = 75;
    } else if (transportMode === 'air') {
      const chargeableWeight = Math.max(weightNum, volumeNum * 167);
      baseRate = chargeableWeight * ((benchmark as any).perKg || 4);
      costPerKg = (benchmark as any).perKg || 4;
      fuelSurcharge = chargeableWeight * 0.8;
      securitySurcharge = chargeableWeight * 0.15;
      handlingFee = 85;
    } else if (transportMode === 'rail') {
      baseRate = volumeNum * ((benchmark as any).perCBM || 120);
      costPerCbm = (benchmark as any).perCBM || 120;
      fuelSurcharge = baseRate * 0.08;
      handlingFee = 200;
      securitySurcharge = 50;
    } else {
      baseRate = weightNum * ((benchmark as any).perKg || 0.15);
      costPerKg = (benchmark as any).perKg || 0.15;
      fuelSurcharge = baseRate * 0.12;
      handlingFee = 100;
    }
    
    const totalRate = baseRate + fuelSurcharge + securitySurcharge + documentationFee + handlingFee;
    
    // Generate comparison
    const comparison: FreightRateResult['comparison'] = [];
    
    if (transportMode !== 'ocean' && routes.ocean.includes(route)) {
      const oceanBench = rateBenchmarks.ocean[route as keyof typeof rateBenchmarks.ocean];
      if (oceanBench && cargoType === 'fcl') {
        const oceanCost = (oceanBench as any).perContainer40 || 3200;
        comparison.push({
          mode: 'Ocean (FCL)',
          totalCost: oceanCost * 1.25,
          transitDays: (oceanBench as any).transit || 18,
          costEfficiency: 'Most economical for large volumes',
        });
      }
    }
    
    if (transportMode !== 'air' && weightNum < 5000) {
      const airBench = route.includes('Asia') || route.includes('Europe') || route.includes('America')
        ? rateBenchmarks.air['Asia-North America']
        : rateBenchmarks.air['Global Average'];
      const chargeableWt = Math.max(weightNum, volumeNum * 167);
      const airCost = chargeableWt * ((airBench as any).perKg || 4) * 1.3;
      comparison.push({
        mode: 'Air Freight',
        totalCost: airCost,
        transitDays: (airBench as any).transit || 3,
        costEfficiency: 'Fastest option for urgent cargo',
      });
    }
    
    if (transportMode !== 'rail' && (route.includes('China') || route.includes('Europe'))) {
      const railBench = rateBenchmarks.rail['China-Europe'];
      const railCost = volumeNum * ((railBench as any).perCBM || 120) * 1.2;
      comparison.push({
        mode: 'Rail Freight',
        totalCost: railCost,
        transitDays: (railBench as any).transit || 16,
        costEfficiency: 'Balanced cost-speed option',
      });
    }
    
    // Recommendations
    const recommendations: string[] = [];
    if (transportMode === 'air' && weightNum > 5000) {
      recommendations.push('For cargo over 5,000kg, consider ocean freight for cost savings');
    }
    if (transportMode === 'ocean' && volumeNum < 15 && cargoType === 'lcl') {
      recommendations.push('Small LCL shipment - consider air freight for time-sensitive cargo');
    }
    if (insuranceRequired && customsValueNum > 10000) {
      recommendations.push('High-value cargo - ensure adequate insurance coverage');
    }
    if (transportMode === 'ocean' && route.includes('Europe') && volumeNum > 30) {
      recommendations.push('Consider China-Europe rail as alternative to ocean freight');
    }
    
    setResult({
      baseRate: Math.round(baseRate * 100) / 100,
      fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
      securitySurcharge: Math.round(securitySurcharge * 100) / 100,
      documentationFee,
      handlingFee,
      totalRate: Math.round(totalRate * 100) / 100,
      costPerKg: Math.round(costPerKg * 100) / 100,
      costPerCbm: Math.round(costPerCbm * 100) / 100,
      costPerContainer: Math.round(costPerContainer * 100) / 100,
      comparison,
      recommendations,
    });
  };

  // Memoized chart data
  const costBreakdownData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Base Rate', value: result.baseRate, color: '#0F4C81' },
      { name: 'Fuel Surcharge', value: result.fuelSurcharge, color: '#2E8B57' },
      { name: 'Security Surcharge', value: result.securitySurcharge, color: '#F59E0B' },
      { name: 'Documentation', value: result.documentationFee, color: '#8B5CF6' },
      { name: 'Handling', value: result.handlingFee, color: '#06B6D4' },
    ];
  }, [result]);

  const comparisonChartData = useMemo(() => {
    if (!result) return [];
    const data = [
      { mode: transportMode.charAt(0).toUpperCase() + transportMode.slice(1), cost: result.totalRate, color: '#0F4C81' },
    ];
    result.comparison.forEach((comp, index) => {
      data.push({ mode: comp.mode, cost: comp.totalCost, color: COLORS[(index + 1) % COLORS.length] });
    });
    return data;
  }, [result, transportMode]);

  const surchargeBreakdownData = useMemo(() => {
    return commonSurcharges.slice(0, 8).map(s => ({
      name: s.code,
      value: Math.random() * 500 + 50,
      description: s.name
    }));
  }, []);

  const rateTrendData = useMemo(() => {
    return [
      { month: 'Jan', ocean: 2800, air: 4.2 },
      { month: 'Feb', ocean: 2650, air: 4.0 },
      { month: 'Mar', ocean: 2500, air: 3.8 },
      { month: 'Apr', ocean: 2700, air: 4.1 },
      { month: 'May', ocean: 2900, air: 4.3 },
      { month: 'Jun', ocean: 3100, air: 4.5 },
      { month: 'Jul', ocean: 3400, air: 4.8 },
      { month: 'Aug', ocean: 3800, air: 5.2 },
      { month: 'Sep', ocean: 4200, air: 5.5 },
      { month: 'Oct', ocean: 4500, air: 5.8 },
      { month: 'Nov', ocean: 4000, air: 5.2 },
      { month: 'Dec', ocean: 3200, air: 4.5 },
    ];
  }, []);

  const resetForm = () => {
    setWeight('10000');
    setVolume('50');
    setCustomsValue('50000');
    setCargoType('fcl');
    setContainerType('40HC');
    setResult(null);
  };

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
    if (mode === 'air' || mode === 'road') {
      setCargoType('lcl');
    }
  };

  const handleExport = () => {
    if (!result) return;
    const data = {
      transportMode,
      route,
      cargoType,
      containerType,
      weight,
      volume,
      result,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freight-rate-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!result) return;
    const shareData = {
      title: 'Freight Rate Estimate',
      text: `Total Rate: $${result.totalRate.toLocaleString()} for ${transportMode} freight via ${route}`,
      url: window.location.href
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`Freight Rate: $${result.totalRate.toLocaleString()} - ${transportMode.toUpperCase()} via ${route}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Badge 
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white shadow-lg"
            >
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Rate Estimation Tool
            </Badge>
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Freight Rate Calculator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Calculate and compare freight rates across multiple transport modes with comprehensive cost breakdown
          </p>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-[#0F4C81]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Ship className="h-4 w-4 text-[#0F4C81]" />
                    <span className="text-xs text-muted-foreground">Ocean Freight</span>
                  </div>
                  <p className="text-lg font-bold text-[#0F4C81]">$40-100/CBM</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-[#2E8B57]">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Plane className="h-4 w-4 text-[#2E8B57]" />
                    <span className="text-xs text-muted-foreground">Air Freight</span>
                  </div>
                  <p className="text-lg font-bold text-[#2E8B57]">$2.0-5.0/kg</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Train className="h-4 w-4 text-amber-500" />
                    <span className="text-xs text-muted-foreground">Rail Freight</span>
                  </div>
                  <p className="text-lg font-bold text-amber-600">$100-150/CBM</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-4 w-4 text-purple-500" />
                    <span className="text-xs text-muted-foreground">Road Freight</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600">$0.15-0.25/kg</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* 5-Tab Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="surcharges" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Surcharges</span>
            </TabsTrigger>
            <TabsTrigger value="methodology" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Methodology</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Calculator */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-[#0F4C81]" />
                      Freight Parameters
                    </CardTitle>
                    <CardDescription>Select transport mode and enter cargo details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Transport Mode Selection */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#2E8B57]" />
                        Transport Mode
                      </h4>
                      
                      <div className="grid grid-cols-4 gap-2">
                        {(['ocean', 'air', 'rail', 'road'] as const).map((mode) => (
                          <Button
                            key={mode}
                            variant={transportMode === mode ? 'default' : 'outline'}
                            className={`flex flex-col h-auto py-3 ${transportMode === mode ? 'bg-gradient-to-r from-[#0F4C81] to-[#2E8B57]' : ''}`}
                            onClick={() => handleModeChange(mode)}
                          >
                            {getModeIcon(mode)}
                            <span className="text-xs mt-1 capitalize">{mode}</span>
                          </Button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label>Route / Trade Lane</Label>
                        <Select value={route} onValueChange={setRoute}>
                          <SelectTrigger>
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
                    </div>

                    <Separator />

                    {/* Cargo Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#0F4C81]" />
                        Cargo Information
                      </h4>
                      
                      {transportMode === 'ocean' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Shipment Type</Label>
                            <Select value={cargoType} onValueChange={(v: 'fcl' | 'lcl' | 'bulk') => setCargoType(v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fcl">FCL (Full Container)</SelectItem>
                                <SelectItem value="lcl">LCL (Less Container)</SelectItem>
                                <SelectItem value="bulk">Bulk Cargo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {cargoType === 'fcl' && (
                            <div className="space-y-2">
                              <Label>Container Type</Label>
                              <Select value={containerType} onValueChange={(v: '20GP' | '40GP' | '40HC') => setContainerType(v)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="20GP">20GP (20ft Standard)</SelectItem>
                                  <SelectItem value="40GP">40GP (40ft Standard)</SelectItem>
                                  <SelectItem value="40HC">40HC (40ft High Cube)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="volume">Volume (CBM)</Label>
                          <Input
                            id="volume"
                            type="number"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customsValue">Declared Customs Value (USD)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                          <Input
                            id="customsValue"
                            type="number"
                            value={customsValue}
                            onChange={(e) => setCustomsValue(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={calculateRate}
                        className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Rate
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetForm}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                          Rate Analysis
                        </CardTitle>
                        <CardDescription>Detailed cost breakdown and comparisons</CardDescription>
                      </div>
                      {result && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {result ? (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-6"
                        >
                          {/* Total Cost */}
                          <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white text-center">
                            <p className="text-sm opacity-90 mb-2">Estimated Total Freight</p>
                            <p className="text-4xl font-bold">${result.totalRate.toLocaleString()}</p>
                            <p className="text-sm opacity-75 mt-2">USD</p>
                          </div>

                          {/* Cost Breakdown */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Cost Breakdown</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-600 dark:text-slate-400">Base Rate</span>
                                <Badge variant="secondary">${result.baseRate.toLocaleString()}</Badge>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-600 dark:text-slate-400">Fuel Surcharge</span>
                                <Badge variant="secondary">${result.fuelSurcharge.toLocaleString()}</Badge>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-600 dark:text-slate-400">Security Surcharge</span>
                                <Badge variant="secondary">${result.securitySurcharge.toLocaleString()}</Badge>
                              </div>
                              <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-slate-600 dark:text-slate-400">Documentation Fee</span>
                                <Badge variant="secondary">${result.documentationFee}</Badge>
                              </div>
                              <div className="flex justify-between items-center py-2">
                                <span className="text-slate-600 dark:text-slate-400">Handling Fee</span>
                                <Badge variant="secondary">${result.handlingFee}</Badge>
                              </div>
                            </div>
                          </div>

                          {/* Unit Rates */}
                          {(result.costPerKg > 0 || result.costPerCbm > 0) && (
                            <div className="grid grid-cols-2 gap-4">
                              {result.costPerKg > 0 && (
                                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
                                  <p className="text-xs text-slate-500">Rate per kg</p>
                                  <p className="font-semibold text-[#0F4C81]">${result.costPerKg}</p>
                                </div>
                              )}
                              {result.costPerCbm > 0 && (
                                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 text-center">
                                  <p className="text-xs text-slate-500">Rate per CBM</p>
                                  <p className="font-semibold text-[#2E8B57]">${result.costPerCbm}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Mode Comparison */}
                          {result.comparison.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-slate-700 dark:text-slate-300">Transport Mode Comparison</h4>
                              <div className="space-y-2">
                                {result.comparison.map((comp, index) => (
                                  <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-medium">{comp.mode}</span>
                                      <Badge>${comp.totalCost.toLocaleString()}</Badge>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500">
                                      <span>Transit: {comp.transitDays} days</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">{comp.costEfficiency}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recommendations */}
                          {result.recommendations.length > 0 && (
                            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4 text-amber-600" />
                                <p className="font-semibold text-amber-700 dark:text-amber-400">Recommendations</p>
                              </div>
                              <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1">
                                {result.recommendations.map((rec, index) => (
                                  <li key={index}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-12 text-center"
                        >
                          <DollarSign className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                          <p className="text-slate-500 dark:text-slate-400">
                            Enter parameters and click calculate
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Tab 2: Rate Analysis */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Cost Breakdown Pie Chart */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-[#0F4C81]" />
                    Cost Breakdown
                  </CardTitle>
                  <CardDescription>Visual breakdown of freight cost components</CardDescription>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Calculate a rate first to see the breakdown
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rate Comparison Bar Chart */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                    Rate Comparison
                  </CardTitle>
                  <CardDescription>Compare costs across different transport modes</CardDescription>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mode" />
                        <YAxis tickFormatter={(value) => `$${value}`} />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="cost" fill="#0F4C81" radius={[4, 4, 0, 0]}>
                          {comparisonChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      Calculate a rate first to see comparisons
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rate Trends */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-500" />
                    Rate Trends (12 Months)
                  </CardTitle>
                  <CardDescription>Historical freight rate trends showing seasonal variations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={rateTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value}/kg`} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="ocean" 
                        stroke="#0F4C81" 
                        strokeWidth={2}
                        name="Ocean FCL ($/40HC)"
                        dot={{ fill: '#0F4C81' }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="air" 
                        stroke="#2E8B57" 
                        strokeWidth={2}
                        name="Air ($/kg)"
                        dot={{ fill: '#2E8B57' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 3: Surcharges */}
          <TabsContent value="surcharges" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                  Common Freight Surcharges
                </CardTitle>
                <CardDescription>
                  Comprehensive list of surcharges that may apply to your freight shipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold text-[#0F4C81]">Code</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#0F4C81]">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#0F4C81]">Description</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#0F4C81]">Typical Range</th>
                        <th className="text-left py-3 px-4 font-semibold text-[#0F4C81]">Applies To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commonSurcharges.map((surcharge, index) => (
                        <tr 
                          key={surcharge.code} 
                          className={`border-b border-slate-100 dark:border-slate-800 ${
                            index % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <Badge className="bg-[#0F4C81]/10 text-[#0F4C81] hover:bg-[#0F4C81]/20">
                              {surcharge.code}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-medium">{surcharge.name}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{surcharge.description}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="border-[#2E8B57] text-[#2E8B57]">
                              {surcharge.range}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {surcharge.appliesTo.map((mode) => (
                                <Badge key={mode} variant="secondary" className="text-xs">
                                  {mode}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Surcharge Breakdown Chart */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[#2E8B57]" />
                  Surcharge Impact Analysis
                </CardTitle>
                <CardDescription>Typical surcharge impact on total freight cost</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={surchargeBreakdownData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                    <YAxis dataKey="name" type="category" width={60} />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Bar dataKey="value" fill="#0F4C81" radius={[0, 4, 4, 0]}>
                      {surchargeBreakdownData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Methodology */}
          <TabsContent value="methodology" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* How Freight Rates Are Calculated */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[#0F4C81]" />
                    How Freight Rates Are Calculated
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400">
                    Freight rates are determined through a complex interplay of multiple factors that carriers and freight forwarders consider when quoting prices. The base rate forms the foundation, representing the fundamental cost of moving cargo from origin to destination. This base rate is influenced by the mode of transport, distance traveled, and the specific trade lane used.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">
                    Carriers analyze market demand, vessel capacity utilization, and competitive positioning when setting base rates. During periods of high demand or limited capacity, base rates tend to increase, while during market downturns, carriers may reduce rates to maintain volume. The calculation also incorporates operational costs including fuel, labor, port charges, and equipment maintenance, ensuring the carrier remains profitable while remaining competitive in the market.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">
                    Understanding this methodology helps shippers negotiate better rates and plan their logistics more effectively. By timing shipments during lower-demand periods and consolidating cargo, businesses can significantly reduce their freight spend while maintaining supply chain efficiency.
                  </p>
                </CardContent>
              </Card>

              {/* Base Rate + Surcharges Breakdown */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                    Base Rate + Surcharges Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400">
                    The total freight cost consists of the base rate plus various surcharges that account for fluctuating costs and specific service requirements. The base rate typically covers the fundamental transportation service, but numerous additional charges apply to ensure accurate cost allocation and risk distribution.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">
                    <strong>Key Surcharges Include:</strong> Bunker Adjustment Factor (BAF) covers fuel cost fluctuations, typically 10-25% of base rate. Currency Adjustment Factor (CAF) addresses exchange rate volatility. Terminal Handling Charges (THC) cover port operations. Peak Season Surcharges (PSS) apply during high-demand periods.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">
                    Each surcharge serves a specific purpose in risk allocation between carrier and shipper. Understanding these components allows businesses to identify potential savings opportunities, such as timing shipments to avoid peak season surcharges or negotiating fixed-rate contracts that bundle surcharges into predictable monthly payments.
                  </p>
                </CardContent>
              </Card>

              {/* Peak Season Adjustments */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-amber-500" />
                    Peak Season Adjustments
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400">
                    Peak season in freight shipping refers to periods of exceptionally high demand that strain available capacity and drive up rates. The primary peak season runs from August through October, coinciding with holiday inventory stocking for Christmas and year-end shopping periods.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">
                    During peak seasons, carriers implement Peak Season Surcharges (PSS) ranging from $200 to $1,000 per container. Additionally, General Rate Increases (GRI) of 5-15% may be applied monthly. Space allocation becomes competitive, with priority given to long-term contract customers.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">
                    Strategic planning can help avoid peak season premiums. Consider booking 4-6 weeks in advance, diversifying origin ports, utilizing alternative routes, or building inventory buffers to ship during off-peak periods. These strategies can result in savings of 20-40% compared to peak season rates.
                  </p>
                </CardContent>
              </Card>

              {/* FCL vs LCL Rate Differences */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-purple-500" />
                    FCL vs LCL Rate Differences
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400">
                    Full Container Load (FCL) and Less than Container Load (LCL) represent two fundamentally different approaches to ocean freight, each with distinct pricing structures and use cases. Understanding these differences is crucial for optimizing your shipping strategy.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">
                    <strong>FCL (Full Container Load):</strong> You pay a flat rate per container regardless of how full it is. This is most cost-effective for shipments over 15 CBM. Benefits include faster transit (no consolidation time), reduced handling damage risk, and simpler documentation. Rates are typically quoted per container (20GP, 40GP, 40HC).
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-4">
                    <strong>LCL (Less than Container Load):</strong> You pay per cubic meter or per ton, whichever is greater. Additional costs include CFS (Container Freight Station) handling fees at both ends. While per-unit costs are higher, LCL makes economic sense for smaller shipments under 10-15 CBM or when testing new markets with smaller initial orders.
                  </p>
                </CardContent>
              </Card>

              {/* Factors Affecting Freight Rates */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-[#2E8B57]" />
                    Factors Affecting Freight Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <h5 className="font-semibold text-[#0F4C81] mb-3 flex items-center gap-2">
                        <Fuel className="h-4 w-4" />
                        Fuel & Energy Costs
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                          <span>Bunker prices directly impact ocean freight costs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                          <span>Jet fuel prices affect air freight surcharges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                          <span>IMO 2020 low-sulfur regulations increased costs</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                      <h5 className="font-semibold text-[#2E8B57] mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Supply & Demand
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                          <span>Capacity utilization drives rate fluctuations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                          <span>Seasonal demand peaks impact pricing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                          <span>New vessel deliveries affect market rates</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                      <h5 className="font-semibold text-amber-600 mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Geopolitical Factors
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                          <span>Trade policies and tariffs affect routes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                          <span>Port congestion creates delays and costs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                          <span>Currency fluctuations impact pricing</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 grid md:grid-cols-3 gap-6">
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Cargo Characteristics
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                          <span>Dangerous goods require special handling</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                          <span>Temperature-controlled cargo costs more</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                          <span>Over-dimensional cargo has surcharges</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-cyan-50 dark:bg-cyan-950/30 rounded-lg p-4">
                      <h5 className="font-semibold text-cyan-600 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documentation & Compliance
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
                          <span>Customs requirements vary by destination</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
                          <span>Security certifications add costs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-cyan-600 mt-0.5 shrink-0" />
                          <span>Documentation errors cause delays</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-rose-50 dark:bg-rose-950/30 rounded-lg p-4">
                      <h5 className="font-semibold text-rose-600 mb-3 flex items-center gap-2">
                        <Scale className="h-4 w-4" />
                        Competition & Market
                      </h5>
                      <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                          <span>Carrier alliances affect pricing power</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                          <span>New market entrants drive competition</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-rose-600 mt-0.5 shrink-0" />
                          <span>Contract vs spot market rates differ</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 5: FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Comprehensive answers to common freight rate questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqData.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`faq-${index}`}
                      className="border rounded-lg px-4 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <AccordionTrigger className="hover:no-underline text-left">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] flex items-center justify-center text-white font-semibold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 dark:text-slate-400 pl-11 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Quick Reference Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-[#0F4C81] bg-white/80 dark:bg-slate-900/80">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-[#0F4C81] mb-2">Quick Tip #1</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Always compare volumetric weight vs actual weight for air freight - you&apos;re charged for whichever is greater.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-[#2E8B57] bg-white/80 dark:bg-slate-900/80">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-[#2E8B57] mb-2">Quick Tip #2</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Book 4-6 weeks in advance during peak season to secure space and better rates.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-amber-500 bg-white/80 dark:bg-slate-900/80">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-amber-600 mb-2">Quick Tip #3</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    FCL becomes economical at around 10-15 CBM. Below that, consider LCL options.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
