"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Warehouse,
  Package,
  Globe,
  DollarSign,
  Target,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Info,
  Building2,
  MapPin,
  RefreshCw,
  Download,
  Zap,
  Shield,
  Gauge,
  Percent,
  BoxIcon,
  ChevronRight,
  Award,
  PieChart as PieChartIcon,
  Activity,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  ComposedChart,
  Area,
  AreaChart,
  ReferenceLine,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors as specified
const COLORS = {
  ocean: "#2B4570",
  sustainability: "#4CAF50",
  oceanLight: "#3D5A80",
  sustainabilityLight: "#66BB6A",
  warning: "#F59E0B",
  danger: "#EF4444",
  critical: "#DC2626",
  neutral: "#6B7280",
  purple: "#8B5CF6",
  pink: "#EC4899",
};

// Logistics provider data for benchmarking
interface LogisticsProvider {
  id: string;
  name: string;
  type: "Ocean" | "Air" | "Road" | "Rail" | "Multimodal";
  region: string;
  rating: number;
  
  // Cost metrics ($/TEU or equivalent)
  transportationCost: number;
  warehousingCost: number;
  handlingCost: number;
  documentationCost: number;
  insuranceCost: number;
  customsClearanceCost: number;
  
  // Performance metrics
  onTimeDelivery: number; // percentage
  damageRate: number; // percentage (lower is better)
  transitTime: number; // days average
  trackingAccuracy: number; // percentage
  
  // Service factors
  networkCoverage: number; // countries
  fleetSize: number;
  sustainabilityScore: number; // 1-100
}

const logisticsProviders: LogisticsProvider[] = [
  {
    id: "maersk",
    name: "Maersk",
    type: "Ocean",
    region: "Global",
    rating: 4.7,
    transportationCost: 2450,
    warehousingCost: 320,
    handlingCost: 185,
    documentationCost: 95,
    insuranceCost: 125,
    customsClearanceCost: 145,
    onTimeDelivery: 92.5,
    damageRate: 0.8,
    transitTime: 28,
    trackingAccuracy: 98.2,
    networkCoverage: 130,
    fleetSize: 708,
    sustainabilityScore: 78,
  },
  {
    id: "msc",
    name: "MSC",
    type: "Ocean",
    region: "Global",
    rating: 4.5,
    transportationCost: 2380,
    warehousingCost: 295,
    handlingCost: 175,
    documentationCost: 88,
    insuranceCost: 118,
    customsClearanceCost: 138,
    onTimeDelivery: 89.8,
    damageRate: 1.1,
    transitTime: 30,
    trackingAccuracy: 96.5,
    networkCoverage: 155,
    fleetSize: 760,
    sustainabilityScore: 72,
  },
  {
    id: "cma-cgm",
    name: "CMA CGM",
    type: "Ocean",
    region: "Global",
    rating: 4.6,
    transportationCost: 2520,
    warehousingCost: 310,
    handlingCost: 180,
    documentationCost: 92,
    insuranceCost: 122,
    customsClearanceCost: 142,
    onTimeDelivery: 91.2,
    damageRate: 0.9,
    transitTime: 27,
    trackingAccuracy: 97.8,
    networkCoverage: 160,
    fleetSize: 620,
    sustainabilityScore: 75,
  },
  {
    id: "hapag-lloyd",
    name: "Hapag-Lloyd",
    type: "Ocean",
    region: "Global",
    rating: 4.6,
    transportationCost: 2580,
    warehousingCost: 335,
    handlingCost: 190,
    documentationCost: 98,
    insuranceCost: 130,
    customsClearanceCost: 150,
    onTimeDelivery: 93.1,
    damageRate: 0.7,
    transitTime: 26,
    trackingAccuracy: 98.5,
    networkCoverage: 130,
    fleetSize: 260,
    sustainabilityScore: 82,
  },
  {
    id: "dhl",
    name: "DHL Global",
    type: "Multimodal",
    region: "Global",
    rating: 4.7,
    transportationCost: 2850,
    warehousingCost: 380,
    handlingCost: 210,
    documentationCost: 105,
    insuranceCost: 145,
    customsClearanceCost: 165,
    onTimeDelivery: 94.5,
    damageRate: 0.6,
    transitTime: 22,
    trackingAccuracy: 99.2,
    networkCoverage: 220,
    fleetSize: 280,
    sustainabilityScore: 85,
  },
  {
    id: "kuehne-nagel",
    name: "Kuehne + Nagel",
    type: "Multimodal",
    region: "Global",
    rating: 4.5,
    transportationCost: 2680,
    warehousingCost: 350,
    handlingCost: 195,
    documentationCost: 100,
    insuranceCost: 135,
    customsClearanceCost: 155,
    onTimeDelivery: 91.8,
    damageRate: 0.9,
    transitTime: 25,
    trackingAccuracy: 97.5,
    networkCoverage: 100,
    fleetSize: 0,
    sustainabilityScore: 79,
  },
  {
    id: "db-schenker",
    name: "DB Schenker",
    type: "Multimodal",
    region: "Europe/Global",
    rating: 4.4,
    transportationCost: 2620,
    warehousingCost: 340,
    handlingCost: 188,
    documentationCost: 96,
    insuranceCost: 128,
    customsClearanceCost: 148,
    onTimeDelivery: 90.5,
    damageRate: 1.0,
    transitTime: 24,
    trackingAccuracy: 96.8,
    networkCoverage: 130,
    fleetSize: 0,
    sustainabilityScore: 81,
  },
  {
    id: "ups-scs",
    name: "UPS SCS",
    type: "Multimodal",
    region: "Americas/Global",
    rating: 4.5,
    transportationCost: 2750,
    warehousingCost: 365,
    handlingCost: 200,
    documentationCost: 102,
    insuranceCost: 140,
    customsClearanceCost: 160,
    onTimeDelivery: 93.8,
    damageRate: 0.7,
    transitTime: 20,
    trackingAccuracy: 98.8,
    networkCoverage: 195,
    fleetSize: 0,
    sustainabilityScore: 76,
  },
];

// Industry benchmarks
const INDUSTRY_BENCHMARKS = {
  transportation: { avg: 2500, best: 2200, worst: 3000, unit: "$/TEU" },
  warehousing: { avg: 320, best: 280, worst: 400, unit: "$/month" },
  handling: { avg: 185, best: 150, worst: 230, unit: "$/TEU" },
  documentation: { avg: 95, best: 75, worst: 130, unit: "$/shipment" },
  insurance: { avg: 130, best: 100, worst: 180, unit: "$/TEU" },
  customsClearance: { avg: 150, best: 120, worst: 200, unit: "$/entry" },
  onTimeDelivery: { avg: 90, best: 95, worst: 85, unit: "%" },
  damageRate: { avg: 1.0, best: 0.5, worst: 2.0, unit: "%" },
  transitTime: { avg: 26, best: 20, worst: 35, unit: "days" },
  trackingAccuracy: { avg: 97, best: 99, worst: 94, unit: "%" },
};

// Regional cost data
const REGIONAL_COSTS = [
  { region: "Asia-Pacific", transportation: 2350, warehousing: 280, handling: 170, growth: 5.2 },
  { region: "Europe", transportation: 2680, warehousing: 380, handling: 195, growth: 3.8 },
  { region: "North America", transportation: 2850, warehousing: 420, handling: 210, growth: 4.5 },
  { region: "South America", transportation: 2920, warehousing: 310, handling: 185, growth: 6.1 },
  { region: "Middle East", transportation: 2550, warehousing: 340, handling: 178, growth: 7.2 },
  { region: "Africa", transportation: 3100, warehousing: 290, handling: 195, growth: 8.5 },
];

// Historical trend data
const COST_TRENDS = [
  { month: "Jan", transportation: 2320, warehousing: 290, handling: 165, benchmark: 2500 },
  { month: "Feb", transportation: 2350, warehousing: 295, handling: 168, benchmark: 2500 },
  { month: "Mar", transportation: 2380, warehousing: 300, handling: 172, benchmark: 2520 },
  { month: "Apr", transportation: 2420, warehousing: 305, handling: 175, benchmark: 2540 },
  { month: "May", transportation: 2480, warehousing: 310, handling: 178, benchmark: 2560 },
  { month: "Jun", transportation: 2520, warehousing: 315, handling: 182, benchmark: 2580 },
  { month: "Jul", transportation: 2580, warehousing: 320, handling: 185, benchmark: 2600 },
  { month: "Aug", transportation: 2550, warehousing: 318, handling: 183, benchmark: 2590 },
  { month: "Sep", transportation: 2500, warehousing: 315, handling: 180, benchmark: 2570 },
  { month: "Oct", transportation: 2480, warehousing: 312, handling: 178, benchmark: 2550 },
  { month: "Nov", transportation: 2450, warehousing: 308, handling: 176, benchmark: 2530 },
  { month: "Dec", transportation: 2420, warehousing: 305, handling: 174, benchmark: 2510 },
];

// KPI definitions
const KPI_DEFINITIONS = {
  costPerTEU: { name: "Cost per TEU", target: 2400, industry: 2500, unit: "$", icon: DollarSign, lower: true },
  costPerKg: { name: "Cost per Kg", target: 0.85, industry: 0.95, unit: "$", icon: Package, lower: true },
  onTimeDelivery: { name: "On-Time Delivery", target: 95, industry: 90, unit: "%", icon: Truck, lower: false },
  damageRate: { name: "Damage Rate", target: 0.5, industry: 1.0, unit: "%", icon: Shield, lower: true },
  transitTime: { name: "Avg Transit Time", target: 22, industry: 26, unit: "days", icon: Gauge, lower: true },
  costEfficiency: { name: "Cost Efficiency", target: 92, industry: 85, unit: "%", icon: Percent, lower: false },
};

// Sample KPI data
const CURRENT_KPI_DATA = {
  costPerTEU: 2450,
  costPerKg: 0.88,
  onTimeDelivery: 92.5,
  damageRate: 0.8,
  transitTime: 24,
  costEfficiency: 88.5,
};

// Improvement recommendations
const IMPROVEMENT_RECOMMENDATIONS = [
  {
    id: 1,
    priority: "high",
    category: "Transportation",
    title: "Consolidate shipments for volume discounts",
    description: "Increase shipment consolidation to achieve 15-20% volume discounts with carriers",
    potentialSavings: 45000,
    effort: "Medium",
    timeline: "3-6 months",
    impact: "High",
  },
  {
    id: 2,
    priority: "high",
    category: "Warehousing",
    title: "Optimize warehouse network",
    description: "Relocate 30% of inventory to lower-cost regional distribution centers",
    potentialSavings: 38000,
    effort: "High",
    timeline: "6-12 months",
    impact: "High",
  },
  {
    id: 3,
    priority: "medium",
    category: "Documentation",
    title: "Automate customs documentation",
    description: "Implement automated documentation system to reduce processing costs by 25%",
    potentialSavings: 22000,
    effort: "Medium",
    timeline: "3-6 months",
    impact: "Medium",
  },
  {
    id: 4,
    priority: "medium",
    category: "Insurance",
    title: "Review insurance coverage",
    description: "Negotiate better rates with insurers based on improved safety record",
    potentialSavings: 15000,
    effort: "Low",
    timeline: "1-3 months",
    impact: "Medium",
  },
  {
    id: 5,
    priority: "low",
    category: "Handling",
    title: "Standardize packaging",
    description: "Implement standardized packaging to reduce handling time and damage rates",
    potentialSavings: 18000,
    effort: "Medium",
    timeline: "3-6 months",
    impact: "Medium",
  },
  {
    id: 6,
    priority: "low",
    category: "Transportation",
    title: "Modal shift optimization",
    description: "Shift 15% of long-haul shipments from road to rail for cost savings",
    potentialSavings: 28000,
    effort: "Medium",
    timeline: "6-12 months",
    impact: "Medium",
  },
];

interface LogisticsBenchmarkingToolProps {
  onProviderSelect?: (providerId: string) => void;
}

export function LogisticsBenchmarkingTool({ onProviderSelect }: LogisticsBenchmarkingToolProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["maersk", "dhl", "kuehne-nagel", "hapag-lloyd"]);

  // Filter providers based on selection
  const filteredProviders = useMemo(() => {
    return logisticsProviders.filter((p) => {
      if (selectedRegion !== "all" && p.region !== selectedRegion && p.region !== "Global") return false;
      if (selectedType !== "all" && p.type !== selectedType) return false;
      return true;
    });
  }, [selectedRegion, selectedType]);

  // Calculate provider rankings
  const providerRankings = useMemo(() => {
    return filteredProviders
      .map((p) => {
        const totalCost = p.transportationCost + p.warehousingCost + p.handlingCost + 
          p.documentationCost + p.insuranceCost + p.customsClearanceCost;
        const performanceScore = (p.onTimeDelivery * 0.3) + 
          ((100 - p.damageRate * 10) * 0.2) + 
          (p.trackingAccuracy * 0.2) + 
          (p.sustainabilityScore * 0.15) +
          (Math.min(100, (35 - p.transitTime) / 35 * 100) * 0.15);
        
        return {
          ...p,
          totalCost,
          performanceScore,
          valueScore: performanceScore / (totalCost / 1000),
        };
      })
      .sort((a, b) => b.valueScore - a.valueScore);
  }, [filteredProviders]);

  // Cost breakdown data for charts
  const costBreakdownData = useMemo(() => {
    return providerRankings
      .filter((p) => selectedProviders.includes(p.id))
      .map((p) => ({
        name: p.name,
        Transportation: p.transportationCost,
        Warehousing: p.warehousingCost,
        Handling: p.handlingCost,
        Documentation: p.documentationCost,
        Insurance: p.insuranceCost,
        "Customs": p.customsClearanceCost,
      }));
  }, [providerRankings, selectedProviders]);

  // Benchmark comparison data
  const benchmarkComparisonData = useMemo(() => {
    const categories = ["transportation", "warehousing", "handling", "documentation", "insurance", "customsClearance"] as const;
    return categories.map((cat) => {
      const benchmark = INDUSTRY_BENCHMARKS[cat];
      const avgCost = filteredProviders.reduce((sum, p) => sum + p[cat === "customsClearance" ? "customsClearanceCost" : `${cat}Cost`], 0) / filteredProviders.length;
      return {
        category: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/([A-Z])/g, " $1"),
        "Your Cost": avgCost,
        "Industry Avg": benchmark.avg,
        "Best-in-Class": benchmark.best,
      };
    });
  }, [filteredProviders]);

  // Performance radar data
  const performanceRadarData = useMemo(() => {
    return [
      { metric: "On-Time", value: 92.5, benchmark: 90, fullMark: 100 },
      { metric: "Cost", value: 88, benchmark: 85, fullMark: 100 },
      { metric: "Speed", value: 78, benchmark: 75, fullMark: 100 },
      { metric: "Accuracy", value: 95, benchmark: 92, fullMark: 100 },
      { metric: "Sustainability", value: 76, benchmark: 70, fullMark: 100 },
      { metric: "Coverage", value: 82, benchmark: 78, fullMark: 100 },
    ];
  }, []);

  // Format currency helper
  const formatMoney = (value: number) => {
    return formatCurrency(value, selectedCurrency as keyof typeof currencies);
  };

  // Toggle provider selection
  const toggleProvider = (providerId: string) => {
    setSelectedProviders((prev) => {
      if (prev.includes(providerId)) {
        return prev.filter((id) => id !== providerId);
      }
      return [...prev, providerId];
    });
  };

  // Get score color
  const getScoreColor = (value: number, target: number, lowerIsBetter: boolean = false) => {
    if (lowerIsBetter) {
      if (value <= target) return COLORS.sustainability;
      if (value <= target * 1.1) return COLORS.ocean;
      if (value <= target * 1.2) return COLORS.warning;
      return COLORS.danger;
    }
    if (value >= target) return COLORS.sustainability;
    if (value >= target * 0.95) return COLORS.ocean;
    if (value >= target * 0.9) return COLORS.warning;
    return COLORS.danger;
  };

  // Get trend icon
  const getTrendIcon = (current: number, previous: number, lowerIsBetter: boolean = false) => {
    const improved = lowerIsBetter ? current < previous : current > previous;
    if (Math.abs(current - previous) < 0.5) {
      return <span className="text-neutral-500">—</span>;
    }
    if (improved) {
      return <ArrowUpRight className="h-4 w-4" style={{ color: COLORS.sustainability }} />;
    }
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="Global">Global</SelectItem>
              <SelectItem value="Europe/Global">Europe</SelectItem>
              <SelectItem value="Americas/Global">Americas</SelectItem>
              <SelectItem value="Asia-Pacific">Asia-Pacific</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Ocean">Ocean</SelectItem>
              <SelectItem value="Air">Air</SelectItem>
              <SelectItem value="Road">Road</SelectItem>
              <SelectItem value="Rail">Rail</SelectItem>
              <SelectItem value="Multimodal">Multimodal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="CNY">CNY</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="kpis">KPIs</TabsTrigger>
          <TabsTrigger value="recommendations">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4" style={{ borderLeftColor: COLORS.ocean }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Cost per TEU</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.ocean }}>
                      {formatMoney(INDUSTRY_BENCHMARKS.transportation.avg)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${COLORS.ocean}15` }}>
                    <DollarSign className="h-6 w-6" style={{ color: COLORS.ocean }} />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <TrendingDown className="h-4 w-4" style={{ color: COLORS.sustainability }} />
                  <span style={{ color: COLORS.sustainability }}>-3.2%</span>
                  <span className="text-muted-foreground">vs last quarter</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: COLORS.sustainability }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Industry Avg OTD</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.sustainability }}>
                      {INDUSTRY_BENCHMARKS.onTimeDelivery.avg}%
                    </p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${COLORS.sustainability}15` }}>
                    <Truck className="h-6 w-6" style={{ color: COLORS.sustainability }} />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4" style={{ color: COLORS.sustainability }} />
                  <span style={{ color: COLORS.sustainability }}>+1.5%</span>
                  <span className="text-muted-foreground">vs last quarter</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: COLORS.warning }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Damage Rate</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.warning }}>
                      {INDUSTRY_BENCHMARKS.damageRate.avg}%
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Shield className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <TrendingDown className="h-4 w-4" style={{ color: COLORS.sustainability }} />
                  <span style={{ color: COLORS.sustainability }}>-0.2%</span>
                  <span className="text-muted-foreground">vs last quarter</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4" style={{ borderLeftColor: COLORS.purple }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Providers</p>
                    <p className="text-2xl font-bold" style={{ color: COLORS.purple }}>
                      {filteredProviders.length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: `${COLORS.purple}15` }}>
                    <Building2 className="h-6 w-6" style={{ color: COLORS.purple }} />
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {selectedProviders.length} selected for comparison
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Trend Chart and Performance Radar */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Cost Trends (12 Months)
                </CardTitle>
                <CardDescription>Transportation costs vs industry benchmark</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={COST_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="transportation"
                        name="Transportation Cost"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="benchmark"
                        name="Industry Benchmark"
                        stroke={COLORS.sustainability}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: COLORS.sustainability }} />
                  Performance Radar
                </CardTitle>
                <CardDescription>Your performance vs industry benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={performanceRadarData}>
                      <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Your Performance"
                        dataKey="value"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name="Industry Benchmark"
                        dataKey="benchmark"
                        stroke={COLORS.sustainability}
                        fill="transparent"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Providers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Top Value Providers
              </CardTitle>
              <CardDescription>Ranked by value score (performance/cost ratio)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {providerRankings.slice(0, 4).map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedProviders.includes(provider.id)
                        ? "border-2 bg-muted/30"
                        : "border hover:border-muted-foreground/50"
                    }`}
                    style={{
                      borderColor: selectedProviders.includes(provider.id) ? COLORS.ocean : undefined,
                    }}
                    onClick={() => toggleProvider(provider.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant={index === 0 ? "default" : "secondary"}
                        style={index === 0 ? { backgroundColor: COLORS.sustainability } : undefined}
                      >
                        #{index + 1}
                      </Badge>
                      <Badge variant="outline">{provider.type}</Badge>
                    </div>
                    <h4 className="font-semibold mb-2">{provider.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Cost:</span>
                        <span className="font-medium">{formatMoney(provider.totalCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">OTD:</span>
                        <span className="font-medium">{provider.onTimeDelivery}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Value Score:</span>
                        <span className="font-medium" style={{ color: COLORS.sustainability }}>
                          {provider.valueScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Logistics Provider Comparison
              </CardTitle>
              <CardDescription>Compare costs and performance across providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={costBreakdownData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => formatMoney(v)} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Legend />
                    <Bar dataKey="Transportation" stackId="a" fill={COLORS.ocean} />
                    <Bar dataKey="Warehousing" stackId="a" fill={COLORS.sustainability} />
                    <Bar dataKey="Handling" stackId="a" fill={COLORS.warning} />
                    <Bar dataKey="Documentation" stackId="a" fill={COLORS.purple} />
                    <Bar dataKey="Insurance" stackId="a" fill={COLORS.pink} />
                    <Bar dataKey="Customs" stackId="a" fill="#06B6D4" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Provider Details Table */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Provider</th>
                      <th className="text-center py-3 px-4">Type</th>
                      <th className="text-center py-3 px-4">Total Cost</th>
                      <th className="text-center py-3 px-4">OTD %</th>
                      <th className="text-center py-3 px-4">Damage %</th>
                      <th className="text-center py-3 px-4">Transit Days</th>
                      <th className="text-center py-3 px-4">Sustainability</th>
                      <th className="text-center py-3 px-4">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerRankings.map((provider) => (
                      <tr
                        key={provider.id}
                        className="border-b hover:bg-muted/30 cursor-pointer"
                        onClick={() => onProviderSelect?.(provider.id)}
                      >
                        <td className="py-3 px-4 font-medium">{provider.name}</td>
                        <td className="text-center py-3 px-4">
                          <Badge variant="outline">{provider.type}</Badge>
                        </td>
                        <td className="text-center py-3 px-4 font-medium">
                          {formatMoney(provider.totalCost)}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span
                            className="font-medium"
                            style={{
                              color: getScoreColor(provider.onTimeDelivery, 90),
                            }}
                          >
                            {provider.onTimeDelivery}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span
                            className="font-medium"
                            style={{
                              color: getScoreColor(provider.damageRate, 1, true),
                            }}
                          >
                            {provider.damageRate}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">{provider.transitTime}</td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Progress value={provider.sustainabilityScore} className="w-16 h-2" />
                            <span className="text-xs">{provider.sustainabilityScore}</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge style={{ backgroundColor: COLORS.sustainability }}>
                            {provider.rating}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benchmarks Tab */}
        <TabsContent value="benchmarks" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Cost Benchmark Comparison
                </CardTitle>
                <CardDescription>Your costs vs industry benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={benchmarkComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => formatMoney(value)} />
                      <Legend />
                      <Bar dataKey="Your Cost" fill={COLORS.ocean} />
                      <Bar dataKey="Industry Avg" fill={COLORS.neutral} />
                      <Bar dataKey="Best-in-Class" fill={COLORS.sustainability} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" style={{ color: COLORS.sustainability }} />
                  Cost Breakdown Analysis
                </CardTitle>
                <CardDescription>Average cost distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Transportation", value: INDUSTRY_BENCHMARKS.transportation.avg, color: COLORS.ocean },
                          { name: "Warehousing", value: INDUSTRY_BENCHMARKS.warehousing.avg, color: COLORS.sustainability },
                          { name: "Handling", value: INDUSTRY_BENCHMARKS.handling.avg, color: COLORS.warning },
                          { name: "Documentation", value: INDUSTRY_BENCHMARKS.documentation.avg, color: COLORS.purple },
                          { name: "Insurance", value: INDUSTRY_BENCHMARKS.insurance.avg, color: COLORS.pink },
                          { name: "Customs", value: INDUSTRY_BENCHMARKS.customsClearance.avg, color: "#06B6D4" },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {[
                          COLORS.ocean,
                          COLORS.sustainability,
                          COLORS.warning,
                          COLORS.purple,
                          COLORS.pink,
                          "#06B6D4",
                        ].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatMoney(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benchmark Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmark Reference</CardTitle>
              <CardDescription>Key metrics and targets for logistics operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Metric</th>
                      <th className="text-center py-3 px-4">Industry Average</th>
                      <th className="text-center py-3 px-4">Best-in-Class</th>
                      <th className="text-center py-3 px-4">Worst Case</th>
                      <th className="text-center py-3 px-4">Unit</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(INDUSTRY_BENCHMARKS).map(([key, benchmark]) => {
                      const isInverseMetric = ["damageRate", "transitTime"].includes(key);
                      return (
                        <tr key={key} className="border-b">
                          <td className="py-3 px-4 font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </td>
                          <td className="text-center py-3 px-4">{benchmark.avg}</td>
                          <td className="text-center py-3 px-4">
                            <span style={{ color: COLORS.sustainability }}>{benchmark.best}</span>
                          </td>
                          <td className="text-center py-3 px-4">
                            <span style={{ color: COLORS.danger }}>{benchmark.worst}</span>
                          </td>
                          <td className="text-center py-3 px-4">{benchmark.unit}</td>
                          <td className="text-center py-3 px-4">
                            <Badge
                              variant="outline"
                              style={{
                                borderColor: isInverseMetric ? COLORS.sustainability : COLORS.warning,
                                color: isInverseMetric ? COLORS.sustainability : COLORS.warning,
                              }}
                            >
                              {isInverseMetric ? "Lower is better" : "Higher is better"}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regional Tab */}
        <TabsContent value="regional" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Regional Cost Comparison
              </CardTitle>
              <CardDescription>Logistics costs by geographic region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={REGIONAL_COSTS}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Legend />
                    <Bar dataKey="transportation" name="Transportation" fill={COLORS.ocean} />
                    <Bar dataKey="warehousing" name="Warehousing" fill={COLORS.sustainability} />
                    <Bar dataKey="handling" name="Handling" fill={COLORS.warning} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Regional Detail Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REGIONAL_COSTS.map((region) => (
              <Card key={region.region} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5" style={{ color: COLORS.ocean }} />
                    <h4 className="font-semibold">{region.region}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transportation:</span>
                      <span className="font-medium">{formatMoney(region.transportation)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Warehousing:</span>
                      <span className="font-medium">{formatMoney(region.warehousing)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Handling:</span>
                      <span className="font-medium">{formatMoney(region.handling)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">YoY Growth:</span>
                      <span
                        className="font-medium"
                        style={{ color: region.growth > 5 ? COLORS.warning : COLORS.sustainability }}
                      >
                        +{region.growth}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* KPIs Tab */}
        <TabsContent value="kpis" className="space-y-6 mt-6">
          {/* KPI Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(KPI_DEFINITIONS).map(([key, kpi]) => {
              const Icon = kpi.icon;
              const currentValue = CURRENT_KPI_DATA[key as keyof typeof CURRENT_KPI_DATA];
              const percentToTarget = kpi.lower
                ? ((kpi.target / currentValue) * 100)
                : ((currentValue / kpi.target) * 100);
              
              return (
                <Card key={key} className="card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${COLORS.ocean}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: COLORS.ocean }} />
                        </div>
                        <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                      </div>
                      {getTrendIcon(
                        currentValue,
                        kpi.industry,
                        kpi.lower
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <span
                          className="text-3xl font-bold"
                          style={{ color: getScoreColor(currentValue, kpi.target, kpi.lower) }}
                        >
                          {typeof currentValue === "number" && currentValue < 10
                            ? currentValue.toFixed(2)
                            : currentValue.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground text-lg ml-1">{kpi.unit}</span>
                      </div>
                      <Badge
                        variant={percentToTarget >= 95 ? "default" : "secondary"}
                        style={percentToTarget >= 95 ? { backgroundColor: COLORS.sustainability } : undefined}
                      >
                        {percentToTarget >= 95 ? "On Target" : "Below Target"}
                      </Badge>
                    </div>

                    <Progress value={Math.min(100, percentToTarget)} className="h-2" />

                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="text-muted-foreground">Target: </span>
                        <span className="font-medium">{kpi.target}{kpi.unit}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Industry: </span>
                        <span
                          className="font-medium"
                          style={{
                            color: kpi.lower
                              ? (currentValue <= kpi.industry ? COLORS.sustainability : COLORS.warning)
                              : (currentValue >= kpi.industry ? COLORS.sustainability : COLORS.warning),
                          }}
                        >
                          {kpi.industry}{kpi.unit}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* KPI Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: COLORS.ocean }} />
                KPI Performance Trends
              </CardTitle>
              <CardDescription>Historical performance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={COST_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="transportation"
                      name="Transportation Cost"
                      stroke={COLORS.ocean}
                      fill={COLORS.ocean}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="warehousing"
                      name="Warehousing Cost"
                      stroke={COLORS.sustainability}
                      fill={COLORS.sustainability}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="handling"
                      name="Handling Cost"
                      stroke={COLORS.warning}
                      fill={COLORS.warning}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6 mt-6">
          {/* Summary Card */}
          <Card className="border-2" style={{ borderColor: COLORS.sustainability }}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="p-4 rounded-full" style={{ backgroundColor: `${COLORS.sustainability}15` }}>
                  <Lightbulb className="h-10 w-10" style={{ color: COLORS.sustainability }} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold mb-2">Potential Annual Savings</h3>
                  <p className="text-3xl font-bold" style={{ color: COLORS.sustainability }}>
                    {formatMoney(IMPROVEMENT_RECOMMENDATIONS.reduce((sum, r) => sum + r.potentialSavings, 0))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {IMPROVEMENT_RECOMMENDATIONS.length} improvement opportunities identified
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button style={{ backgroundColor: COLORS.ocean }}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations List */}
          <div className="space-y-4">
            {IMPROVEMENT_RECOMMENDATIONS.map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{
                            backgroundColor:
                              rec.priority === "high"
                                ? `${COLORS.danger}15`
                                : rec.priority === "medium"
                                ? `${COLORS.warning}15`
                                : `${COLORS.ocean}15`,
                          }}
                        >
                          <Zap
                            className="h-5 w-5"
                            style={{
                              color:
                                rec.priority === "high"
                                  ? COLORS.danger
                                  : rec.priority === "medium"
                                  ? COLORS.warning
                                  : COLORS.ocean,
                            }}
                          />
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            style={{
                              borderColor:
                                rec.priority === "high"
                                  ? COLORS.danger
                                  : rec.priority === "medium"
                                  ? COLORS.warning
                                  : COLORS.ocean,
                              color:
                                rec.priority === "high"
                                  ? COLORS.danger
                                  : rec.priority === "medium"
                                  ? COLORS.warning
                                  : COLORS.ocean,
                            }}
                          >
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">{rec.category}</Badge>
                          <h4 className="font-semibold">{rec.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Savings:</span>
                            <span className="font-medium" style={{ color: COLORS.sustainability }}>
                              {formatMoney(rec.potentialSavings)}/year
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Scale className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Effort:</span>
                            <span className="font-medium">{rec.effort}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Timeline:</span>
                            <span className="font-medium">{rec.timeline}</span>
                          </div>
                        </div>
                      </div>

                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Wins Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" style={{ color: COLORS.sustainability }} />
                Quick Wins Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: COLORS.sustainability }}>
                    {IMPROVEMENT_RECOMMENDATIONS.filter((r) => r.effort === "Low").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Low Effort</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: COLORS.warning }}>
                    {IMPROVEMENT_RECOMMENDATIONS.filter((r) => r.effort === "Medium").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Medium Effort</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: COLORS.ocean }}>
                    {IMPROVEMENT_RECOMMENDATIONS.filter((r) => r.timeline.includes("1-3")).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Within 3 Months</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
