"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Boxes,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Info,
  Calculator,
  Target,
  BarChart3,
  Settings,
  RotateCcw,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Layers,
  Workflow,
  Gauge,
  Timer,
  ShoppingCart,
  Warehouse,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  Legend,
  Tooltip,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants/chartColors";

type PickMethod = "batch" | "zone" | "wave" | "discrete";

interface PickMethodData {
  id: PickMethod;
  name: string;
  description: string;
  efficiencyMultiplier: number;
  laborReduction: number;
  setupTime: number;
  bestFor: string;
  icon: string;
  complexity: "low" | "medium" | "high";
  accuracy: number;
}

interface CalculationResult {
  totalItems: number;
  pickTime: number;
  packTime: number;
  totalLaborHours: number;
  laborCost: number;
  costPerOrder: number;
  costPerItem: number;
  throughput: number;
  ordersPerHour: number;
  itemsPerHour: number;
  stationUtilization: number;
  efficiency: number;
  potentialSavings: number;
  optimizedCost: number;
}

interface ComparisonScenario {
  method: PickMethod;
  totalCost: number;
  costPerOrder: number;
  laborHours: number;
  efficiency: number;
  savings: number;
}

const pickMethods: Record<PickMethod, PickMethodData> = {
  discrete: {
    id: "discrete",
    name: "Discrete Picking",
    description: "Traditional method where each order is picked individually by one picker. Simple to implement but less efficient for high volumes.",
    efficiencyMultiplier: 1.0,
    laborReduction: 0,
    setupTime: 0.05,
    bestFor: "Low volume, high-value items, specialty orders",
    icon: "📦",
    complexity: "low",
    accuracy: 99.5,
  },
  batch: {
    id: "batch",
    name: "Batch Picking",
    description: "Pick multiple orders simultaneously in one trip through the warehouse. Reduces travel time significantly compared to discrete picking.",
    efficiencyMultiplier: 1.35,
    laborReduction: 25,
    setupTime: 0.1,
    bestFor: "High volume, similar products, e-commerce",
    icon: "📋",
    complexity: "medium",
    accuracy: 98.5,
  },
  zone: {
    id: "zone",
    name: "Zone Picking",
    description: "Warehouse divided into zones with dedicated pickers per zone. Orders pass through zones on conveyors or carts. Excellent for large facilities.",
    efficiencyMultiplier: 1.5,
    laborReduction: 35,
    setupTime: 0.15,
    bestFor: "Large warehouses, diverse SKUs, high throughput",
    icon: "🏭",
    complexity: "high",
    accuracy: 99.0,
  },
  wave: {
    id: "wave",
    name: "Wave Picking",
    description: "Release orders in scheduled waves coordinated with shipping deadlines and carrier pickup times. Optimizes warehouse-to-shipping flow.",
    efficiencyMultiplier: 1.45,
    laborReduction: 30,
    setupTime: 0.12,
    bestFor: "Time-sensitive, carrier integration, deadline-driven",
    icon: "🌊",
    complexity: "high",
    accuracy: 98.0,
  },
};

const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  amber: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
  teal: "#14B8A6",
};

const FAQS = [
  {
    question: "What is pick and pack, and why is it important for warehouse operations?",
    answer: "Pick and pack is a fundamental warehouse fulfillment process where items are selected (picked) from inventory storage locations and then prepared (packed) for shipment to customers. This process represents 55-65% of total warehouse operating costs, making it a critical area for optimization. Efficient pick and pack operations directly impact customer satisfaction through faster delivery times, reduce labor costs, minimize errors and returns, and improve overall warehouse throughput. Understanding and optimizing this process is essential for competitive advantage in modern logistics and e-commerce fulfillment.",
  },
  {
    question: "How do I choose the right picking method for my warehouse?",
    answer: "Choosing the right picking method depends on several factors: order volume (discrete picking works well under 100 orders/day, batch/zone for 500+), product characteristics (size, weight, value), SKU count and diversity, warehouse layout and size, available technology (WMS, pick-to-light, voice picking), and labor skill levels. Discrete picking is simplest but least efficient. Batch picking offers excellent ROI for medium volumes. Zone picking scales well for large operations but requires investment in conveyor systems. Wave picking excels when shipping schedules are critical. Many operations use hybrid approaches, combining methods based on order profiles and peak periods.",
  },
  {
    question: "What are the key performance indicators (KPIs) for pick and pack operations?",
    answer: "Essential KPIs include: Picks Per Hour (PPH) - measures picker productivity, industry average is 100-150 for discrete, 150-200 for batch; Order Accuracy Rate - target 99.5%+ to minimize returns; Cost Per Order - includes labor, materials, overhead; Order Cycle Time - from receipt to shipment ready; Fill Rate - percentage of orders shipped complete; Pick Rate Variance - consistency across pickers; Travel Time Percentage - should be under 50% of total time. Tracking these KPIs enables data-driven optimization and identifies training needs, equipment issues, or layout inefficiencies.",
  },
  {
    question: "How can I reduce pick and pack costs without compromising quality?",
    answer: "Cost reduction strategies include: implementing slotting optimization to place fast-moving items near pack stations; using ABC analysis to prioritize warehouse layout; investing in pick-assist technology like pick-to-light or voice picking; cross-training staff for flexibility during peak periods; pre-staging packaging materials at workstations; using cartonization algorithms to select optimal box sizes; implementing quality checkpoints at pack stations; analyzing and reducing deadhead travel time; considering automation for repetitive tasks. Even small improvements compound - reducing average pick time by 15 seconds can save thousands of labor hours annually in busy operations.",
  },
  {
    question: "What role does technology play in modern pick and pack operations?",
    answer: "Technology transforms pick and pack efficiency through: Warehouse Management Systems (WMS) that optimize pick paths and batch orders; Pick-to-light systems that use LED indicators to guide pickers, achieving 300+ PPH; Voice-directed picking for hands-free operation and improved accuracy; Mobile RF scanners and tablets for real-time inventory visibility; Conveyor systems and sortation equipment for zone picking integration; Automated Storage and Retrieval Systems (AS/RS) for goods-to-person picking; Machine learning for demand forecasting and slotting optimization; Robotic picking for repetitive, high-volume items. The key is matching technology investment to your specific operation's bottlenecks and ROI requirements.",
  },
  {
    question: "How do seasonal peaks affect pick and pack planning?",
    answer: "Seasonal peaks (holiday seasons, promotional events) require proactive planning: hire and train temporary staff 4-6 weeks before peak; pre-position inventory based on demand forecasts; implement parallel processing with additional pack stations; extend shifts or add second shifts strategically; pre-assemble shipping materials and common order combinations; use wave picking to manage carrier cutoff times; monitor real-time KPIs to identify and address bottlenecks quickly; have contingency plans for 20-30% volume spikes above forecast. Post-peak, analyze performance data to identify permanent improvements and prepare for the next surge. Peak planning should begin 3-4 months in advance for major seasonal events.",
  },
];

const PRO_TIPS = [
  {
    title: "Optimize Your Warehouse Layout",
    description: "Place high-velocity items (A-movers) closest to pack stations and at waist height. This reduces travel time by up to 40% and minimizes picker fatigue. Review slotting quarterly.",
    icon: Warehouse,
  },
  {
    title: "Implement Batch Sizing Rules",
    description: "Optimal batch size depends on pick density. For dense storage areas, batch 10-15 orders. For sparse areas, limit to 5-8 orders. Too large batches increase sort time and errors.",
    icon: Layers,
  },
  {
    title: "Pre-Stage Packing Materials",
    description: "Stock each pack station with appropriate box sizes, void fill, and labels. Pre-assembly can reduce pack time by 20-30% and keeps packers at their stations.",
    icon: Package,
  },
  {
    title: "Use Voice or Light Technology",
    description: "Pick-to-light systems achieve 400+ PPH for high-density picking. Voice picking excels for large items and full-case picking. ROI typically achieved within 12-18 months.",
    icon: Zap,
  },
  {
    title: "Cross-Train Your Team",
    description: "Multi-skilled workers can flex between picking and packing during volume imbalances. This maintains throughput during absences and peak periods without overtime costs.",
    icon: Users,
  },
  {
    title: "Monitor Travel Time Ratio",
    description: "In manual picking, travel time often exceeds 50% of total time. If above 60%, review warehouse layout, slotting strategy, or consider zone picking implementation.",
    icon: Timer,
  },
];

const COMMON_MISTAKES = [
  {
    title: "Ignoring Travel Time Optimization",
    description: "Travel time is the largest component of pick time. Failing to optimize routes and slotting results in wasted labor hours that compound daily.",
  },
  {
    title: "Over-Batching Orders",
    description: "Large batches reduce travel but increase sorting complexity and error rates. Find the optimal balance based on your product mix and warehouse layout.",
  },
  {
    title: "Neglecting Pack Station Ergonomics",
    description: "Poor pack station design causes fatigue, reduces throughput, and increases injury risk. Ensure proper table height, lighting, and tool placement.",
  },
  {
    title: "Inadequate Quality Control",
    description: "Skipping verification steps to speed throughput creates costly returns and damages customer trust. Implement weight verification or scan checks.",
  },
];

const BENCHMARKS = [
  { metric: "Picks Per Hour (Discrete)", value: "100-150", unit: "picks" },
  { metric: "Picks Per Hour (Batch)", value: "150-250", unit: "picks" },
  { metric: "Picks Per Hour (Zone + Tech)", value: "300-400", unit: "picks" },
  { metric: "Order Accuracy Target", value: "99.5%+", unit: "accuracy" },
  { metric: "Cost Per Order (Manual)", value: "$1.50-$3.00", unit: "USD" },
  { metric: "Cost Per Order (Automated)", value: "$0.50-$1.50", unit: "USD" },
];

export function PickAndPackCalculator() {
  const [orderVolume, setOrderVolume] = useState<string>("500");
  const [itemsPerOrder, setItemsPerOrder] = useState<string>("3");
  const [pickMethod, setPickMethod] = useState<PickMethod>("batch");
  const [packStations, setPackStations] = useState<number>(4);
  const [laborRate, setLaborRate] = useState<string>("18");
  const [shiftHours, setShiftHours] = useState<string>("8");
  const [warehouseSize, setWarehouseSize] = useState<string>("50000");
  const [activeTab, setActiveTab] = useState("calculator");

  const selectedMethod = pickMethods[pickMethod];

  const calculation = useMemo<CalculationResult>(() => {
    const orders = parseInt(orderVolume) || 0;
    const items = parseInt(itemsPerOrder) || 1;
    const rate = parseFloat(laborRate) || 18;
    const shifts = parseFloat(shiftHours) || 8;
    const size = parseInt(warehouseSize) || 50000;

    const totalItems = orders * items;

    // Base pick time per item (minutes) - industry standard is 0.3-0.6 minutes
    const basePickTime = 0.5;
    // Travel time factor based on warehouse size (larger = more travel)
    const travelFactor = 1 + (size / 100000);
    // Apply method efficiency
    const effectivePickTime = (basePickTime * travelFactor) / selectedMethod.efficiencyMultiplier;
    const totalPickTime = totalItems * effectivePickTime;

    // Pack time per order (minutes) - includes quality check and labeling
    const packTimePerOrder = 2.5;
    const totalPackTime = orders * packTimePerOrder;

    // Setup and transition time
    const setupTime = orders * selectedMethod.setupTime;

    const totalTimeMinutes = totalPickTime + totalPackTime + (setupTime * orders * items);
    const totalLaborHours = totalTimeMinutes / 60;

    // Labor cost calculation
    const laborCost = totalLaborHours * rate;

    // Cost per order
    const costPerOrder = orders > 0 ? laborCost / orders : 0;
    const costPerItem = totalItems > 0 ? laborCost / totalItems : 0;

    // Throughput calculations
    const availableMinutes = packStations * shifts * 60;
    const throughput = availableMinutes > 0 ? Math.min(100, (totalTimeMinutes / availableMinutes) * 100) : 0;
    const ordersPerHour = totalLaborHours > 0 ? orders / totalLaborHours : 0;
    const itemsPerHour = totalLaborHours > 0 ? totalItems / totalLaborHours : 0;

    // Station utilization
    const stationUtilization = Math.min(100, (totalLaborHours / (packStations * shifts)) * 100);

    // Efficiency score (0-100)
    const efficiency = Math.min(100, Math.round(
      50 * selectedMethod.efficiencyMultiplier +
      (100 - stationUtilization) * 0.3 +
      (items > 2 ? 10 : 5)
    ));

    // Calculate potential savings vs discrete picking
    const discreteLaborHours = (totalItems * basePickTime * travelFactor + orders * packTimePerOrder + orders * pickMethods.discrete.setupTime * orders * items) / 60;
    const discreteCost = discreteLaborHours * rate;
    const potentialSavings = discreteCost - laborCost;
    const optimizedCost = laborCost * 0.85; // Assume 15% more optimization possible

    return {
      totalItems,
      pickTime: totalPickTime / 60,
      packTime: totalPackTime / 60,
      totalLaborHours,
      laborCost,
      costPerOrder,
      costPerItem,
      throughput,
      ordersPerHour,
      itemsPerHour,
      stationUtilization,
      efficiency,
      potentialSavings,
      optimizedCost,
    };
  }, [orderVolume, itemsPerOrder, pickMethod, packStations, laborRate, shiftHours, warehouseSize, selectedMethod]);

  // Comparison scenarios for all methods
  const comparisonScenarios = useMemo<ComparisonScenario[]>(() => {
    const orders = parseInt(orderVolume) || 0;
    const items = parseInt(itemsPerOrder) || 1;
    const rate = parseFloat(laborRate) || 18;
    const size = parseInt(warehouseSize) || 50000;
    const totalItems = orders * items;
    const basePickTime = 0.5;
    const travelFactor = 1 + (size / 100000);
    const packTimePerOrder = 2.5;

    return Object.values(pickMethods).map((method) => {
      const effectivePickTime = (basePickTime * travelFactor) / method.efficiencyMultiplier;
      const totalPickTime = totalItems * effectivePickTime;
      const totalPackTime = orders * packTimePerOrder;
      const setupTime = orders * method.setupTime;
      const totalTimeMinutes = totalPickTime + totalPackTime + (setupTime * orders * items);
      const laborHours = totalTimeMinutes / 60;
      const cost = laborHours * rate;
      const discreteTime = (totalItems * basePickTime * travelFactor + orders * packTimePerOrder + orders * pickMethods.discrete.setupTime * orders * items) / 60;
      const discreteCost = discreteTime * rate;
      const efficiency = Math.min(100, Math.round(
        50 * method.efficiencyMultiplier +
        (100 - Math.min(100, (laborHours / (packStations * 8)) * 100)) * 0.3 +
        (items > 2 ? 10 : 5)
      ));

      return {
        method: method.id,
        totalCost: cost,
        costPerOrder: orders > 0 ? cost / orders : 0,
        laborHours,
        efficiency,
        savings: discreteCost - cost,
      };
    });
  }, [orderVolume, itemsPerOrder, laborRate, warehouseSize, packStations]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  // Chart data
  const timeBreakdownData = [
    { name: "Picking", hours: calculation.pickTime, fill: COLORS.ocean },
    { name: "Packing", hours: calculation.packTime, fill: COLORS.logistics },
    { name: "Setup/Other", hours: Math.max(0, calculation.totalLaborHours - calculation.pickTime - calculation.packTime), fill: COLORS.amber },
  ];

  const methodComparisonData = Object.values(pickMethods).map((method) => ({
    name: method.name.split(" ")[0],
    efficiency: Math.round(method.efficiencyMultiplier * 100),
    laborReduction: method.laborReduction,
    accuracy: method.accuracy,
    current: method.id === pickMethod,
  }));

  const throughputData = Array.from({ length: 8 }, (_, i) => ({
    hour: `${i + 1}h`,
    orders: Math.round((parseInt(orderVolume) || 0) / 8 * (0.8 + Math.random() * 0.4)),
    target: Math.round((parseInt(orderVolume) || 0) / 8),
    cumulative: Math.round((parseInt(orderVolume) || 0) / 8 * (i + 1)),
  }));

  const pieData = [
    { name: "Pick Time", value: calculation.pickTime, color: COLORS.ocean },
    { name: "Pack Time", value: calculation.packTime, color: COLORS.logistics },
    { name: "Other", value: Math.max(0.1, calculation.totalLaborHours - calculation.pickTime - calculation.packTime), color: COLORS.amber },
  ];

  const costComparisonData = comparisonScenarios.map((s) => ({
    name: pickMethods[s.method].name.split(" ")[0],
    cost: s.totalCost,
    savings: s.savings,
    isCurrent: s.method === pickMethod,
  }));

  const efficiencyData = comparisonScenarios.map((s) => ({
    name: pickMethods[s.method].name.split(" ")[0],
    efficiency: s.efficiency,
    cost: s.costPerOrder,
  }));

  const chartConfig = {
    hours: { label: "Hours" },
    efficiency: { label: "Efficiency %" },
    orders: { label: "Orders" },
    target: { label: "Target" },
    cost: { label: "Cost ($)" },
    savings: { label: "Savings ($)" },
  };

  const resetForm = () => {
    setOrderVolume("500");
    setItemsPerOrder("3");
    setPickMethod("batch");
    setPackStations(4);
    setLaborRate("18");
    setShiftHours("8");
    setWarehouseSize("50000");
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return COLORS.logistics;
    if (efficiency >= 60) return COLORS.amber;
    return COLORS.red;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[var(--ocean)] text-white">
                  <Warehouse className="h-3 w-3 mr-1" />
                  Warehousing
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                  <Zap className="h-3 w-3 mr-1" />
                  Labor Optimization
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge variant="secondary">
                  <Target className="h-3 w-3 mr-1" />
                  Cost Analysis
                </Badge>
              </motion.div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Pick & Pack Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Optimize your warehouse fulfillment operations with intelligent labor planning. Calculate picking and packing costs, 
              compare methods, and identify efficiency opportunities for your distribution center.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
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
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[var(--ocean)]" />
                    Order Volume
                  </CardTitle>
                  <CardDescription>
                    Enter your daily order processing requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderVolume">Daily Orders</Label>
                      <Input
                        id="orderVolume"
                        type="number"
                        value={orderVolume}
                        onChange={(e) => setOrderVolume(e.target.value)}
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemsPerOrder">Avg Items/Order</Label>
                      <Input
                        id="itemsPerOrder"
                        type="number"
                        value={itemsPerOrder}
                        onChange={(e) => setItemsPerOrder(e.target.value)}
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Items to Process</span>
                      <Badge variant="secondary" className="font-mono text-base">
                        {formatNumber(calculation.totalItems, 0)} items
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-[var(--logistics)]" />
                    Pick Method
                  </CardTitle>
                  <CardDescription>
                    Choose the optimal picking strategy for your operation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={pickMethod} onValueChange={(v) => setPickMethod(v as PickMethod)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(pickMethods).map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            <span>{method.icon}</span>
                            <span>{method.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              +{Math.round((method.efficiencyMultiplier - 1) * 100)}% efficiency
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="p-4 bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{selectedMethod.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{selectedMethod.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedMethod.description}
                        </p>
                        <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Efficiency:</span>
                            <Badge variant="outline" className="ml-2 text-[var(--logistics)]">
                              +{Math.round((selectedMethod.efficiencyMultiplier - 1) * 100)}%
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Labor Saved:</span>
                            <Badge variant="outline" className="ml-2 text-[var(--ocean)]">
                              {selectedMethod.laborReduction}%
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Accuracy:</span>
                            <Badge variant="outline" className="ml-2">
                              {selectedMethod.accuracy}%
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          <strong>Best for:</strong> {selectedMethod.bestFor}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-[var(--logistics)]" />
                    Resources & Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Pack Stations</Label>
                      <Badge variant="secondary">{packStations} stations</Badge>
                    </div>
                    <Slider
                      value={[packStations]}
                      onValueChange={(v) => setPackStations(v[0])}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="laborRate">Labor Rate ($/hr)</Label>
                      <Input
                        id="laborRate"
                        type="number"
                        value={laborRate}
                        onChange={(e) => setLaborRate(e.target.value)}
                        placeholder="18"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shiftHours">Shift Hours</Label>
                      <Input
                        id="shiftHours"
                        type="number"
                        value={shiftHours}
                        onChange={(e) => setShiftHours(e.target.value)}
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warehouseSize">Warehouse Size (sq ft)</Label>
                    <Select value={warehouseSize} onValueChange={setWarehouseSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10000">10,000 sq ft (Small)</SelectItem>
                        <SelectItem value="25000">25,000 sq ft (Medium)</SelectItem>
                        <SelectItem value="50000">50,000 sq ft (Large)</SelectItem>
                        <SelectItem value="100000">100,000 sq ft (X-Large)</SelectItem>
                        <SelectItem value="200000">200,000 sq ft (Distribution Center)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                    Cost Analysis
                  </CardTitle>
                  <CardDescription>
                    Labor hours and cost breakdown for {formatNumber(parseInt(orderVolume) || 0, 0)} orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-lg">
                    <motion.div
                      key={calculation.totalLaborHours}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <div className="text-2xl font-bold text-[var(--ocean)]">
                        {formatNumber(calculation.totalLaborHours)}
                      </div>
                      <div className="text-xs text-muted-foreground">Labor Hours</div>
                    </motion.div>
                    <motion.div
                      key={calculation.laborCost}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <div className="text-2xl font-bold text-[var(--logistics)]">
                        {formatCurrency(calculation.laborCost)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Cost</div>
                    </motion.div>
                    <motion.div
                      key={calculation.costPerOrder}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <div className="text-2xl font-bold text-[var(--ocean)]">
                        {formatCurrency(calculation.costPerOrder)}
                      </div>
                      <div className="text-xs text-muted-foreground">Per Order</div>
                    </motion.div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4 text-[var(--ocean)]" />
                        Picking Time
                      </span>
                      <span className="font-medium">{formatNumber(calculation.pickTime)} hrs</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Boxes className="h-4 w-4 text-[var(--logistics)]" />
                        Packing Time
                      </span>
                      <span className="font-medium">{formatNumber(calculation.packTime)} hrs</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Setup & Transitions
                      </span>
                      <span className="font-medium">
                        {formatNumber(Math.max(0, calculation.totalLaborHours - calculation.pickTime - calculation.packTime))} hrs
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-[var(--logistics)]/10 rounded-lg px-4">
                    <span className="font-semibold">Cost Per Order</span>
                    <span className="font-bold text-[var(--logistics)] text-xl">
                      {formatCurrency(calculation.costPerOrder)}
                    </span>
                  </div>

                  {calculation.potentialSavings > 0 && (
                    <div className="flex justify-between items-center py-3 bg-[var(--ocean)]/10 rounded-lg px-4">
                      <span className="font-semibold text-sm">Savings vs Discrete Picking</span>
                      <span className="font-bold text-[var(--ocean)]">
                        {formatCurrency(calculation.potentialSavings)} ({Math.round((calculation.potentialSavings / (calculation.laborCost + calculation.potentialSavings)) * 100)}%)
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                    Throughput Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-[var(--logistics)]" />
                        <span className="text-sm font-medium">Orders/Hour</span>
                      </div>
                      <div className="text-2xl font-bold">{formatNumber(calculation.ordersPerHour)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-[var(--ocean)]" />
                        <span className="text-sm font-medium">Efficiency Score</span>
                      </div>
                      <div className="text-2xl font-bold" style={{ color: getEfficiencyColor(calculation.efficiency) }}>
                        {calculation.efficiency}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Station Utilization</span>
                      <span className="font-medium">{formatNumber(calculation.stationUtilization)}%</span>
                    </div>
                    <Progress value={calculation.stationUtilization} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capacity Utilization</span>
                      <span className="font-medium">{formatNumber(calculation.throughput)}%</span>
                    </div>
                    <Progress value={calculation.throughput} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Time Distribution Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[var(--ocean)]" />
                    Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Time Breakdown Analysis
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of labor hours by activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} hrs`} />
                      <Bar dataKey="hours" name="Hours" radius={[4, 4, 0, 0]}>
                        {timeBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Hourly Throughput Projection
                </CardTitle>
                <CardDescription>
                  Expected order fulfillment throughout the shift
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={throughputData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        name="Orders"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.3}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        name="Target"
                        stroke={COLORS.amber}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                  Method Efficiency Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={methodComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="efficiency" name="Efficiency %" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="accuracy" name="Accuracy %" stroke={COLORS.logistics} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--amber)]" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">{formatNumber(calculation.itemsPerHour)}</div>
                  <div className="text-sm text-muted-foreground">Items/Hour</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">{formatCurrency(calculation.costPerItem)}</div>
                  <div className="text-sm text-muted-foreground">Cost/Item</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">{selectedMethod.accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Expected Accuracy</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">{selectedMethod.complexity}</div>
                  <div className="text-sm text-muted-foreground">Complexity</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-[var(--logistics)]/5 border border-[var(--logistics)]/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Recommendation</p>
                    <p className="text-muted-foreground">
                      {calculation.efficiency >= 80 
                        ? "Your current configuration shows excellent efficiency. Consider scaling operations or adding automation for further improvements."
                        : calculation.efficiency >= 60
                        ? "Good efficiency with room for optimization. Review warehouse layout and consider implementing pick-assist technology."
                        : "Efficiency is below optimal. Evaluate picking method selection, warehouse slotting, and consider zone picking implementation."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Comparison by Method
                </CardTitle>
                <CardDescription>
                  Total labor cost comparison across picking methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="cost" name="Total Cost" radius={[4, 4, 0, 0]}>
                        {costComparisonData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isCurrent ? COLORS.logistics : COLORS.ocean}
                            opacity={entry.isCurrent ? 1 : 0.6}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Efficiency vs Cost Per Order
                </CardTitle>
                <CardDescription>
                  Trade-off analysis between efficiency and per-order cost
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="efficiency" name="Efficiency %" fill={COLORS.logistics} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="cost" name="Cost/Order ($)" stroke={COLORS.ocean} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                Detailed Method Comparison
              </CardTitle>
              <CardDescription>
                Side-by-side comparison of all picking methods for your operation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Method</th>
                      <th className="text-right py-3 px-4 font-medium">Total Cost</th>
                      <th className="text-right py-3 px-4 font-medium">Cost/Order</th>
                      <th className="text-right py-3 px-4 font-medium">Labor Hours</th>
                      <th className="text-right py-3 px-4 font-medium">Efficiency</th>
                      <th className="text-right py-3 px-4 font-medium">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonScenarios.map((scenario) => {
                      const method = pickMethods[scenario.method];
                      const isCurrent = scenario.method === pickMethod;
                      return (
                        <tr 
                          key={scenario.method} 
                          className={`border-b ${isCurrent ? "bg-[var(--logistics)]/5" : ""}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span>{method.icon}</span>
                              <span className="font-medium">{method.name}</span>
                              {isCurrent && (
                                <Badge variant="secondary" className="text-xs">Current</Badge>
                              )}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 font-mono">{formatCurrency(scenario.totalCost)}</td>
                          <td className="text-right py-3 px-4 font-mono">{formatCurrency(scenario.costPerOrder)}</td>
                          <td className="text-right py-3 px-4 font-mono">{formatNumber(scenario.laborHours)} hrs</td>
                          <td className="text-right py-3 px-4">
                            <Badge 
                              variant="outline"
                              style={{ 
                                borderColor: getEfficiencyColor(scenario.efficiency),
                                color: getEfficiencyColor(scenario.efficiency)
                              }}
                            >
                              {scenario.efficiency}%
                            </Badge>
                          </td>
                          <td className="text-right py-3 px-4">
                            {scenario.savings > 0 ? (
                              <span className="text-[var(--logistics)] font-medium">
                                +{formatCurrency(scenario.savings)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Method Selection Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                Method Selection Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.values(pickMethods).map((method) => (
                  <div 
                    key={method.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      method.id === pickMethod 
                        ? "border-[var(--logistics)] bg-[var(--logistics)]/5" 
                        : "border-muted hover:border-[var(--ocean)]/30"
                    }`}
                    onClick={() => setPickMethod(method.id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{method.icon}</span>
                      <span className="font-semibold text-sm">{method.name}</span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span className="text-[var(--logistics)] font-medium">+{Math.round((method.efficiencyMultiplier - 1) * 100)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Labor Saved:</span>
                        <span className="text-[var(--ocean)] font-medium">{method.laborReduction}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complexity:</span>
                        <span className="capitalize font-medium">{method.complexity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          {/* Understanding Pick & Pack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Understanding Pick & Pack Operations
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Pick and pack operations form the backbone of modern warehouse fulfillment, representing the critical link between inventory storage and customer delivery. This process encompasses two distinct phases: picking, where warehouse workers retrieve items from storage locations based on order requirements, and packing, where these items are consolidated, verified, packaged, and prepared for shipment. Together, these activities account for approximately 55-65% of total warehouse operating costs, making optimization essential for competitive advantage in logistics and e-commerce fulfillment.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The efficiency of pick and pack operations directly impacts several key business metrics. Faster order processing leads to shorter delivery times and improved customer satisfaction. Lower cost per order enables competitive pricing and improved profit margins. Higher accuracy rates reduce returns, replacements, and customer service costs. Understanding the factors that influence these metrics—warehouse layout, inventory slotting, picking methodology, workforce training, and technology investment—allows operations managers to make informed decisions that drive continuous improvement.
              </p>
            </CardContent>
          </Card>

          {/* Picking Methods Explained */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-[var(--logistics)]" />
                Picking Methods Explained
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.values(pickMethods).map((method) => (
                  <div key={method.id} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{method.icon}</span>
                      <h4 className="font-semibold">{method.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between p-2 bg-background rounded">
                        <span>Efficiency</span>
                        <span className="text-[var(--logistics)] font-medium">+{Math.round((method.efficiencyMultiplier - 1) * 100)}%</span>
                      </div>
                      <div className="flex justify-between p-2 bg-background rounded">
                        <span>Labor Save</span>
                        <span className="text-[var(--ocean)] font-medium">{method.laborReduction}%</span>
                      </div>
                      <div className="flex justify-between p-2 bg-background rounded">
                        <span>Accuracy</span>
                        <span className="font-medium">{method.accuracy}%</span>
                      </div>
                      <div className="flex justify-between p-2 bg-background rounded">
                        <span>Complexity</span>
                        <span className="capitalize font-medium">{method.complexity}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      <strong>Best for:</strong> {method.bestFor}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--amber)]" />
                Pro Tips for Pick & Pack Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <tip.icon className="h-4 w-4 text-[var(--logistics)]" />
                      <h4 className="font-semibold text-sm">{tip.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[var(--red)]" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <div key={index} className="p-4 border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <h4 className="font-semibold text-sm">{mistake.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{mistake.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industry Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Industry Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                {BENCHMARKS.map((benchmark, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-lg font-bold text-[var(--ocean)]">{benchmark.value}</div>
                    <div className="text-xs text-muted-foreground">{benchmark.metric}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                <strong>Note:</strong> Benchmarks vary by industry, order complexity, and automation level. 
                E-commerce fulfillment centers typically achieve higher throughput due to smaller, 
                standardized orders compared to B2B distribution operations.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about pick and pack operations and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-[var(--logistics)]" />
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed pl-6">
                        {faq.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--logistics)]" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm mb-2">Warehouse Layout Optimization</h4>
                  <p className="text-xs text-muted-foreground">
                    Learn how to design an efficient warehouse layout that minimizes travel time and maximizes throughput.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm mb-2">WMS Implementation Guide</h4>
                  <p className="text-xs text-muted-foreground">
                    Best practices for selecting and implementing a warehouse management system for your operation.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm mb-2">Labor Planning Strategies</h4>
                  <p className="text-xs text-muted-foreground">
                    Strategies for workforce planning, cross-training, and managing seasonal demand fluctuations.
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
