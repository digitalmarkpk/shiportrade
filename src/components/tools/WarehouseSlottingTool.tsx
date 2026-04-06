"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Info,
  Zap,
  BarChart3,
  RefreshCw,
  Settings,
  Layers,
  Move,
  Clock,
  DollarSign,
  Target,
  Warehouse,
  ArrowRight,
  Sparkles,
  PieChart,
  HelpCircle,
  ChevronDown,
  Activity,
  Box,
  Route,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";

interface SlottingResult {
  currentEfficiency: number;
  optimizedEfficiency: number;
  potentialSavings: number;
  pickTimeReduction: number;
  travelDistanceReduction: number;
  slotRecommendations: SlotRecommendation[];
  zoneUtilization: ZoneUtilization[];
}

interface SlotRecommendation {
  sku: string;
  currentZone: string;
  recommendedZone: string;
  pickFrequency: number;
  reason: string;
  priority: "high" | "medium" | "low";
}

interface ZoneUtilization {
  zone: string;
  currentUtilization: number;
  optimalUtilization: number;
  itemsCount: number;
  avgPickRate: number;
}

interface SKUData {
  sku: string;
  name: string;
  pickFrequency: number;
  currentZone: string;
  currentSlot: string;
  weight: number;
  volume: number;
}

const zones = [
  { id: "zone-a", name: "Zone A (Golden)", description: "Eye level, highest velocity", floor: 1, velocity: "high" },
  { id: "zone-b", name: "Zone B (Silver)", description: "Waist level, medium velocity", floor: 1, velocity: "medium" },
  { id: "zone-c", name: "Zone C (Bronze)", description: "Floor level, lower velocity", floor: 1, velocity: "low" },
  { id: "zone-d", name: "Zone D (Bulk)", description: "High rack storage", floor: 2, velocity: "low" },
];

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6"];

// Sample SKU data for demonstration
const sampleSKUData: SKUData[] = [
  { sku: "SKU-001", name: "Product Alpha", pickFrequency: 450, currentZone: "Zone C (Bronze)", currentSlot: "C-12-03", weight: 2.5, volume: 0.3 },
  { sku: "SKU-002", name: "Product Beta", pickFrequency: 380, currentZone: "Zone B (Silver)", currentSlot: "B-05-02", weight: 1.2, volume: 0.15 },
  { sku: "SKU-003", name: "Product Gamma", pickFrequency: 320, currentZone: "Zone D (Bulk)", currentSlot: "D-08-01", weight: 8.0, volume: 1.2 },
  { sku: "SKU-004", name: "Product Delta", pickFrequency: 290, currentZone: "Zone A (Golden)", currentSlot: "A-02-01", weight: 0.5, volume: 0.1 },
  { sku: "SKU-005", name: "Product Epsilon", pickFrequency: 250, currentZone: "Zone C (Bronze)", currentSlot: "C-15-04", weight: 3.2, volume: 0.45 },
  { sku: "SKU-006", name: "Product Zeta", pickFrequency: 180, currentZone: "Zone B (Silver)", currentSlot: "B-10-03", weight: 1.8, volume: 0.25 },
  { sku: "SKU-007", name: "Product Eta", pickFrequency: 150, currentZone: "Zone D (Bulk)", currentSlot: "D-03-02", weight: 12.0, volume: 2.0 },
  { sku: "SKU-008", name: "Product Theta", pickFrequency: 120, currentZone: "Zone A (Golden)", currentSlot: "A-08-02", weight: 0.8, volume: 0.12 },
  { sku: "SKU-009", name: "Product Iota", pickFrequency: 90, currentZone: "Zone C (Bronze)", currentSlot: "C-20-01", weight: 4.5, volume: 0.6 },
  { sku: "SKU-010", name: "Product Kappa", pickFrequency: 60, currentZone: "Zone D (Bulk)", currentSlot: "D-15-03", weight: 15.0, volume: 2.5 },
];

// FAQ Data
const faqData = [
  {
    question: "What is warehouse slotting and why is it important?",
    answer: "Warehouse slotting is the strategic organization of inventory within a warehouse to optimize picking efficiency, reduce travel time, and maximize space utilization. Proper slotting can reduce pick times by 20-40% and significantly lower labor costs. It ensures fast-moving items are easily accessible while slower items are stored in less prime locations.",
  },
  {
    question: "How does ABC analysis work in warehouse slotting?",
    answer: "ABC analysis categorizes inventory into three groups: A-items (high value/velocity, typically 20% of SKUs accounting for 80% of picks), B-items (moderate velocity), and C-items (low velocity). A-items are placed in the most accessible 'golden zone' at eye level, while C-items go to less convenient locations. This minimizes picker travel and maximizes efficiency.",
  },
  {
    question: "What factors should I consider when re-slotting my warehouse?",
    answer: "Key factors include: pick frequency and velocity of items, product dimensions and weight, seasonal demand patterns, product affinity (items often ordered together), ergonomic considerations, special handling requirements (hazmat, temperature), and order profiles. Regular re-slotting (quarterly or when velocity changes significantly) maintains optimal efficiency.",
  },
  {
    question: "How much can I expect to save with optimized warehouse slotting?",
    answer: "Typical savings range from 15-40% reduction in pick time, 20-35% reduction in travel distance, and annual labor cost savings of $50,000-$500,000+ depending on warehouse size. Most operations see ROI within 3-6 months of implementation. The exact savings depend on your current efficiency, warehouse size, and picking volume.",
  },
  {
    question: "What is the difference between velocity-based and cubing slotting methods?",
    answer: "Velocity-based slotting prioritizes placing high-turnover items in easily accessible locations to minimize pick time. Cubing focuses on maximizing space utilization by matching product dimensions to slot sizes. Hybrid methods combine both approaches, balancing picking efficiency with space optimization for comprehensive warehouse improvement.",
  },
  {
    question: "How often should I re-evaluate my warehouse slotting strategy?",
    answer: "Best practices recommend quarterly reviews for dynamic operations, or whenever there's a significant change in product mix, seasonal demand shifts, or when you notice declining pick rates. Many warehouses implement continuous improvement programs with monthly velocity analysis and incremental adjustments rather than complete re-slotting.",
  },
  {
    question: "Can slotting optimization help with labor management?",
    answer: "Absolutely. Optimized slotting reduces physical strain on workers by placing heavy items at waist level and minimizing unnecessary travel. This leads to fewer injuries, higher job satisfaction, and reduced training time for new employees. It also enables more accurate labor planning and productivity forecasting.",
  },
  {
    question: "What technology is needed to implement warehouse slotting?",
    answer: "Basic slotting can be done with a WMS (Warehouse Management System) and spreadsheet analysis. Advanced implementations use slotting optimization software, pick-to-light systems, voice picking, and real-time analytics. Even without advanced technology, the principles of ABC analysis and velocity-based placement can significantly improve operations.",
  },
];

export default function WarehouseSlottingTool() {
  const [warehouseSize, setWarehouseSize] = useState<string>("50000");
  const [totalSKUs, setTotalSKUs] = useState<string>("2500");
  const [avgPicksPerDay, setAvgPicksPerDay] = useState<string>("850");
  const [laborCost, setLaborCost] = useState<string>("22");
  const [avgPickTime, setAvgPickTime] = useState<string>("45");
  const [avgTravelTime, setAvgTravelTime] = useState<string>("180");
  const [slottingMethod, setSlottingMethod] = useState<string>("abc");
  const [shiftHours, setShiftHours] = useState<string>("8");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const [result, setResult] = useState<SlottingResult | null>(null);
  const [skuData] = useState<SKUData[]>(sampleSKUData);

  const calculateSlotting = () => {
    const picksPerDay = parseFloat(avgPicksPerDay) || 850;
    const labor = parseFloat(laborCost) || 22;
    const pickTime = parseFloat(avgPickTime) || 45;
    const travelTime = parseFloat(avgTravelTime) || 180;

    // Calculate current inefficiency based on random slotting
    const currentEfficiency = 62;

    // Calculate optimized efficiency based on slotting method
    let optimizedEfficiency = 85;
    if (slottingMethod === "abc") optimizedEfficiency = 85;
    else if (slottingMethod === "velocity") optimizedEfficiency = 88;
    else if (slottingMethod === "cubing") optimizedEfficiency = 82;
    else if (slottingMethod === "hybrid") optimizedEfficiency = 92;

    // Calculate time savings
    const pickTimeReduction = (optimizedEfficiency - currentEfficiency) / currentEfficiency * 100 * 0.6;
    const travelDistanceReduction = (optimizedEfficiency - currentEfficiency) / currentEfficiency * 100 * 0.8;

    // Calculate annual savings
    const dailyPickingHours = (picksPerDay * (pickTime + travelTime)) / 3600;
    const annualHours = dailyPickingHours * 250;
    const currentAnnualCost = annualHours * labor;
    const optimizedAnnualCost = currentAnnualCost * (1 - pickTimeReduction / 100);
    const potentialSavings = currentAnnualCost - optimizedAnnualCost;

    // Generate slot recommendations
    const slotRecommendations: SlotRecommendation[] = skuData
      .sort((a, b) => b.pickFrequency - a.pickFrequency)
      .slice(0, 8)
      .map((sku, index) => {
        const recommendedZone = index < 3 ? "Zone A (Golden)" : index < 6 ? "Zone B (Silver)" : "Zone C (Bronze)";
        return {
          sku: sku.sku,
          currentZone: sku.currentZone,
          recommendedZone,
          pickFrequency: sku.pickFrequency,
          reason: sku.pickFrequency > 300 ? "High velocity item" :
                  sku.pickFrequency > 150 ? "Medium velocity item" : "Lower velocity item",
          priority: sku.pickFrequency > 300 ? "high" :
                    sku.pickFrequency > 150 ? "medium" : "low"
        };
      });

    // Generate zone utilization data
    const zoneUtilization: ZoneUtilization[] = [
      { zone: "Zone A", currentUtilization: 45, optimalUtilization: 85, itemsCount: 125, avgPickRate: 320 },
      { zone: "Zone B", currentUtilization: 72, optimalUtilization: 80, itemsCount: 380, avgPickRate: 180 },
      { zone: "Zone C", currentUtilization: 88, optimalUtilization: 75, itemsCount: 750, avgPickRate: 90 },
      { zone: "Zone D", currentUtilization: 65, optimalUtilization: 70, itemsCount: 1245, avgPickRate: 40 },
    ];

    setResult({
      currentEfficiency,
      optimizedEfficiency,
      potentialSavings,
      pickTimeReduction,
      travelDistanceReduction,
      slotRecommendations,
      zoneUtilization
    });

    setActiveTab("analysis");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const radarData = result?.zoneUtilization.map((z) => ({
    zone: z.zone,
    current: z.currentUtilization,
    optimal: z.optimalUtilization,
  })) || [];

  const barData = result?.zoneUtilization.map((z) => ({
    zone: z.zone,
    current: z.currentUtilization,
    optimal: z.optimalUtilization,
  })) || [];

  // Pie chart data for efficiency distribution
  const pieData = result ? [
    { name: "Optimized", value: result.optimizedEfficiency, color: "#2E8B57" },
    { name: "Gap", value: 100 - result.optimizedEfficiency, color: "#e2e8f0" },
  ] : [];

  // Travel time comparison data
  const travelData = [
    { name: "Before", travel: 180, pick: 45, total: 225 },
    { name: "After", travel: result ? Math.round(180 * (1 - result.travelDistanceReduction / 100)) : 180, pick: result ? Math.round(45 * (1 - result.pickTimeReduction / 100)) : 45, total: result ? Math.round(225 * (1 - result.pickTimeReduction / 100)) : 225 },
  ];

  // Zone heat map data
  const zoneHeatData = [
    { zone: "A", velocity: 95, accessibility: 100, efficiency: 90, utilization: result?.zoneUtilization[0]?.currentUtilization || 45 },
    { zone: "B", velocity: 70, accessibility: 85, efficiency: 75, utilization: result?.zoneUtilization[1]?.currentUtilization || 72 },
    { zone: "C", velocity: 40, accessibility: 60, efficiency: 55, utilization: result?.zoneUtilization[2]?.currentUtilization || 88 },
    { zone: "D", velocity: 20, accessibility: 30, efficiency: 35, utilization: result?.zoneUtilization[3]?.currentUtilization || 65 },
  ];

  // Weekly trend data
  const weeklyTrendData = [
    { day: "Mon", current: 62, optimized: result?.optimizedEfficiency || 85 },
    { day: "Tue", current: 60, optimized: result?.optimizedEfficiency || 85 },
    { day: "Wed", current: 65, optimized: result?.optimizedEfficiency || 85 },
    { day: "Thu", current: 61, optimized: result?.optimizedEfficiency || 85 },
    { day: "Fri", current: 63, optimized: result?.optimizedEfficiency || 85 },
    { day: "Sat", current: 58, optimized: result?.optimizedEfficiency || 85 },
    { day: "Sun", current: 55, optimized: result?.optimizedEfficiency || 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/95 to-[#2E8B57] text-white"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#2E8B57]/20 to-transparent" />

        <div className="relative p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span className="text-sm font-medium">AI-Powered Optimization</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Warehouse Slotting
                <span className="block text-[#7DD3A0]">Optimization Tool</span>
              </h1>

              <p className="text-lg text-white/80 max-w-2xl">
                Transform your warehouse efficiency with intelligent slotting analysis.
                Reduce pick times by up to 40%, minimize travel distance, and maximize your ROI.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">40%</p>
                    <p className="text-xs text-white/60">Faster Picks</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$250K+</p>
                    <p className="text-xs text-white/60">Avg. Savings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3-6mo</p>
                    <p className="text-xs text-white/60">ROI Period</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative w-64 h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-white/20"
                />
                <div className="absolute inset-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Warehouse className="h-20 w-20 text-white/80" />
                </div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2E8B57]">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -right-2 top-1/2 -translate-y-1/2"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                    <Route className="h-4 w-4 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-2">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="configuration" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="visualizations" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
              <PieChart className="h-4 w-4 mr-2" />
              Visualizations
            </TabsTrigger>
            <TabsTrigger value="faq" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-[#0F4C81] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F4C81]/10">
                    <Warehouse className="h-6 w-6 text-[#0F4C81]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Warehouse Size</p>
                    <p className="text-2xl font-bold text-[#0F4C81]">{warehouseSize} sqft</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#2E8B57] hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2E8B57]/10">
                    <Package className="h-6 w-6 text-[#2E8B57]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total SKUs</p>
                    <p className="text-2xl font-bold text-[#2E8B57]">{totalSKUs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10">
                    <Activity className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Picks</p>
                    <p className="text-2xl font-bold text-amber-500">{avgPicksPerDay}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                    <DollarSign className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Labor Cost</p>
                    <p className="text-2xl font-bold text-purple-500">${laborCost}/hr</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zone Reference */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Layers className="h-5 w-5" />
                Warehouse Zone Reference
              </CardTitle>
              <CardDescription>Understanding the slotting zones and their characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {zones.map((zone, index) => (
                  <motion.div
                    key={zone.id}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full ring-2 ring-offset-2"
                        style={{ backgroundColor: COLORS[index], ringColor: COLORS[index] }}
                      ></div>
                      <h4 className="font-semibold text-[#0F4C81]">{zone.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{zone.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        zone.velocity === "high" ? "bg-green-100 text-green-700" :
                        zone.velocity === "medium" ? "bg-amber-100 text-amber-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {zone.velocity.toUpperCase()} VELOCITY
                      </span>
                      <span className="text-xs text-muted-foreground">Floor {zone.floor}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white border-0">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Ready to Optimize Your Warehouse?</h3>
                  <p className="text-white/80">Configure your parameters and get instant slotting recommendations.</p>
                </div>
                <Button
                  onClick={() => setActiveTab("configuration")}
                  className="bg-white text-[#0F4C81] hover:bg-white/90 px-6 py-5 text-lg font-semibold"
                >
                  Start Optimization
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Settings className="h-5 w-5" />
                Warehouse Configuration
              </CardTitle>
              <CardDescription>Enter your warehouse parameters for accurate optimization analysis</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="warehouseSize" className="flex items-center gap-2">
                    <LayoutGrid className="h-4 w-4 text-[#2E8B57]" />
                    Warehouse Size (sq ft)
                  </Label>
                  <Input
                    id="warehouseSize"
                    type="number"
                    value={warehouseSize}
                    onChange={(e) => setWarehouseSize(e.target.value)}
                    placeholder="50,000"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalSKUs" className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#2E8B57]" />
                    Total SKUs
                  </Label>
                  <Input
                    id="totalSKUs"
                    type="number"
                    value={totalSKUs}
                    onChange={(e) => setTotalSKUs(e.target.value)}
                    placeholder="2,500"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avgPicksPerDay" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                    Avg. Picks per Day
                  </Label>
                  <Input
                    id="avgPicksPerDay"
                    type="number"
                    value={avgPicksPerDay}
                    onChange={(e) => setAvgPicksPerDay(e.target.value)}
                    placeholder="850"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laborCost" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                    Labor Cost ($/hour)
                  </Label>
                  <Input
                    id="laborCost"
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(e.target.value)}
                    placeholder="22"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avgPickTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#2E8B57]" />
                    Avg. Pick Time (seconds)
                  </Label>
                  <Input
                    id="avgPickTime"
                    type="number"
                    value={avgPickTime}
                    onChange={(e) => setAvgPickTime(e.target.value)}
                    placeholder="45"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avgTravelTime" className="flex items-center gap-2">
                    <Move className="h-4 w-4 text-[#2E8B57]" />
                    Avg. Travel Time (seconds)
                  </Label>
                  <Input
                    id="avgTravelTime"
                    type="number"
                    value={avgTravelTime}
                    onChange={(e) => setAvgTravelTime(e.target.value)}
                    placeholder="180"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shiftHours" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#2E8B57]" />
                    Shift Hours per Day
                  </Label>
                  <Input
                    id="shiftHours"
                    type="number"
                    value={shiftHours}
                    onChange={(e) => setShiftHours(e.target.value)}
                    placeholder="8"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slottingMethod">Slotting Method</Label>
                  <Select value={slottingMethod} onValueChange={setSlottingMethod}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc">ABC Analysis (Velocity)</SelectItem>
                      <SelectItem value="velocity">Velocity-Based</SelectItem>
                      <SelectItem value="cubing">Cubing (Space Optimization)</SelectItem>
                      <SelectItem value="hybrid">Hybrid (Velocity + Cubing)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  onClick={calculateSlotting}
                  className="bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Optimize Warehouse Slotting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {!result ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <BarChart3 className="h-10 w-10 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Analysis Results</h3>
                    <p className="text-muted-foreground mt-2">Configure your warehouse parameters and run optimization to see results.</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("configuration")}
                    className="bg-[#0F4C81] hover:bg-[#0F4C81]/90"
                  >
                    Go to Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full" />
                  <CardContent className="pt-6 relative">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="h-8 w-8 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Efficiency</span>
                    </div>
                    <p className="text-3xl font-bold">{result.optimizedEfficiency}%</p>
                    <p className="text-sm opacity-80 mt-1">
                      Up from {result.currentEfficiency}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full" />
                  <CardContent className="pt-6 relative">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="h-8 w-8 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Annual Savings</span>
                    </div>
                    <p className="text-3xl font-bold">{formatCurrency(result.potentialSavings)}</p>
                    <p className="text-sm opacity-80 mt-1">
                      Labor cost reduction
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full" />
                  <CardContent className="pt-6 relative">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-8 w-8 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Pick Time</span>
                    </div>
                    <p className="text-3xl font-bold">-{result.pickTimeReduction.toFixed(1)}%</p>
                    <p className="text-sm opacity-80 mt-1">
                      Faster order fulfillment
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full" />
                  <CardContent className="pt-6 relative">
                    <div className="flex items-center justify-between mb-2">
                      <Move className="h-8 w-8 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Travel</span>
                    </div>
                    <p className="text-3xl font-bold">-{result.travelDistanceReduction.toFixed(1)}%</p>
                    <p className="text-sm opacity-80 mt-1">
                      Distance reduction
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* SKU Recommendations */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Box className="h-5 w-5" />
                    SKU Slotting Recommendations
                  </CardTitle>
                  <CardDescription>Recommended zone changes based on pick frequency analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">SKU</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Current Zone</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Recommended Zone</th>
                          <th className="text-right py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Pick Freq.</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Priority</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-600 dark:text-slate-300">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.slotRecommendations.map((rec, index) => (
                          <motion.tr
                            key={rec.sku}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`border-b border-slate-100 dark:border-slate-800 ${
                              rec.currentZone !== rec.recommendedZone ? "bg-amber-50 dark:bg-amber-900/10" : ""
                            }`}
                          >
                            <td className="py-3 px-4 font-medium">{rec.sku}</td>
                            <td className="py-3 px-4">
                              <span className="text-sm">{rec.currentZone}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-sm font-medium ${
                                rec.currentZone !== rec.recommendedZone ? "text-[#2E8B57]" : ""
                              }`}>
                                {rec.recommendedZone}
                              </span>
                              {rec.currentZone !== rec.recommendedZone && (
                                <span className="ml-2 text-xs bg-[#2E8B57] text-white px-2 py-0.5 rounded">
                                  Move
                                </span>
                              )}
                            </td>
                            <td className="text-right py-3 px-4">{rec.pickFrequency}/day</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                rec.priority === "high" ? "bg-red-100 text-red-700" :
                                rec.priority === "medium" ? "bg-amber-100 text-amber-700" :
                                "bg-green-100 text-green-700"
                              }`}>
                                {rec.priority.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{rec.reason}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Zone Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                      <Layers className="h-5 w-5" />
                      Zone Utilization Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.zoneUtilization.map((zone, index) => (
                        <div key={zone.zone} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                              ></div>
                              <span className="font-medium">{zone.zone}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {zone.itemsCount} SKUs | {zone.avgPickRate} picks/day
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Current</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                  <div
                                    className="bg-slate-400 h-2 rounded-full transition-all"
                                    style={{ width: `${zone.currentUtilization}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{zone.currentUtilization}%</span>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Optimal</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                  <div
                                    className="bg-[#2E8B57] h-2 rounded-full transition-all"
                                    style={{ width: `${zone.optimalUtilization}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{zone.optimalUtilization}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                      <Activity className="h-5 w-5" />
                      Quick Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-[#0F4C81]/5 rounded-lg border border-[#0F4C81]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                          <span className="text-sm text-muted-foreground">Efficiency Gain</span>
                        </div>
                        <p className="text-2xl font-bold text-[#0F4C81]">
                          +{(result.optimizedEfficiency - result.currentEfficiency)}%
                        </p>
                      </div>
                      <div className="p-4 bg-[#2E8B57]/5 rounded-lg border border-[#2E8B57]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-[#2E8B57]" />
                          <span className="text-sm text-muted-foreground">Time Saved/Day</span>
                        </div>
                        <p className="text-2xl font-bold text-[#2E8B57]">
                          {Math.round(parseFloat(avgPicksPerDay) * result.pickTimeReduction / 100 * parseFloat(avgPickTime) / 60)} min
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Move className="h-5 w-5 text-amber-600" />
                          <span className="text-sm text-muted-foreground">Travel Reduction</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">
                          {result.travelDistanceReduction.toFixed(0)}%
                        </p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-5 w-5 text-purple-600" />
                          <span className="text-sm text-muted-foreground">ROI Period</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">
                          3-6 months
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Info className="h-5 w-5" />
                    Key Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">Optimization Benefits</p>
                            <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                              <li>• Reduced picker travel time by up to {result.travelDistanceReduction.toFixed(0)}%</li>
                              <li>• Improved order fulfillment speed</li>
                              <li>• Better space utilization across zones</li>
                              <li>• Reduced fatigue and injury risk</li>
                              <li>• Improved inventory accuracy</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800 dark:text-amber-200">Implementation Tips</p>
                            <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1">
                              <li>• Start with high-velocity items (Zone A)</li>
                              <li>• Consider seasonality in slotting decisions</li>
                              <li>• Re-evaluate slotting quarterly</li>
                              <li>• Account for product dimensions and weight</li>
                              <li>• Train staff on new slotting strategy</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Visualizations Tab */}
        <TabsContent value="visualizations" className="space-y-6">
          {!result ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <PieChart className="h-10 w-10 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No Visualization Data</h3>
                    <p className="text-muted-foreground mt-2">Run the optimization analysis first to generate visualizations.</p>
                  </div>
                  <Button
                    onClick={() => setActiveTab("configuration")}
                    className="bg-[#0F4C81] hover:bg-[#0F4C81]/90"
                  >
                    Go to Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Charts Row 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#0F4C81] flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Zone Utilization: Current vs Optimal
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="zone" tick={{ fill: "#64748b" }} />
                          <YAxis tick={{ fill: "#64748b" }} label={{ value: "Utilization %", angle: -90, position: "insideLeft", fill: "#64748b" }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                          />
                          <Legend />
                          <Bar dataKey="current" name="Current" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="optimal" name="Optimal" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Radar Chart */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#0F4C81] flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Efficiency Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="zone" tick={{ fill: "#64748b" }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b" }} />
                          <Radar
                            name="Current"
                            dataKey="current"
                            stroke="#94a3b8"
                            fill="#94a3b8"
                            fillOpacity={0.5}
                          />
                          <Radar
                            name="Optimal"
                            dataKey="optimal"
                            stroke="#2E8B57"
                            fill="#2E8B57"
                            fillOpacity={0.5}
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#0F4C81] flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Efficiency Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPie>
                      </ResponsiveContainer>
                      <div className="text-center mt-2">
                        <p className="text-3xl font-bold text-[#2E8B57]">{result.optimizedEfficiency}%</p>
                        <p className="text-sm text-muted-foreground">Optimized Efficiency</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Travel Time Comparison */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#0F4C81] flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      Time Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={travelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
                          <YAxis tick={{ fill: "#64748b" }} />
                          <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                          />
                          <Legend />
                          <Bar dataKey="travel" name="Travel Time" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="pick" name="Pick Time" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Zone Heat Map */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[#0F4C81] flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      Zone Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {zoneHeatData.map((zone, index) => (
                        <div key={zone.zone} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Zone {zone.zone}</span>
                            <span className="text-muted-foreground">Efficiency: {zone.efficiency}%</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <div
                              className="h-3 rounded"
                              style={{ backgroundColor: COLORS[index], opacity: zone.velocity / 100 }}
                              title={`Velocity: ${zone.velocity}%`}
                            />
                            <div
                              className="h-3 rounded bg-[#2E8B57]"
                              style={{ opacity: zone.accessibility / 100 }}
                              title={`Accessibility: ${zone.accessibility}%`}
                            />
                            <div
                              className="h-3 rounded bg-amber-500"
                              style={{ opacity: zone.utilization / 100 }}
                              title={`Utilization: ${zone.utilization}%`}
                            />
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-center gap-4 pt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#0F4C81]" /> Velocity</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-[#2E8B57]" /> Access</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-amber-500" /> Util</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Trend */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#0F4C81] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly Efficiency Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={weeklyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" tick={{ fill: "#64748b" }} />
                        <YAxis tick={{ fill: "#64748b" }} domain={[50, 100]} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "8px" }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="current"
                          name="Current Efficiency"
                          stroke="#94a3b8"
                          fill="#94a3b8"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="optimized"
                          name="Optimized Efficiency"
                          stroke="#2E8B57"
                          fill="#2E8B57"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0F4C81] flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Learn more about warehouse slotting optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200 dark:border-slate-700">
                    <AccordionTrigger className="text-left py-4 hover:text-[#0F4C81] hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F4C81]/10">
                          <HelpCircle className="h-4 w-4 text-[#0F4C81]" />
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-14 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Help Section */}
          <Card className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5 border-0 shadow-lg">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F4C81]/10">
                    <HelpCircle className="h-7 w-7 text-[#0F4C81]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F4C81]">Still have questions?</h3>
                    <p className="text-muted-foreground">Our team is ready to help you optimize your warehouse.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-[#0F4C81] text-[#0F4C81] hover:bg-[#0F4C81]/10">
                    View Documentation
                  </Button>
                  <Button className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
