"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Info,
  RefreshCw,
  Truck,
  Clock,
  BarChart3,
  Calculator,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Zap,
  Download,
  Share2,
  Target,
  Layers,
  Settings,
  ChevronRight,
  Activity,
  Database,
  LineChart,
  AlertCircle,
  CheckCircle2,
  Copy,
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
  LineChart as RechartsLineChart,
} from "recharts";

interface ReorderResult {
  dailyDemand: number;
  leadTimeDemand: number;
  safetyStock: number;
  reorderPoint: number;
  maxStock: number;
  avgStockLevel: number;
  stockTurnsPerYear: number;
  daysOfSupply: number;
  orderFrequency: number;
  annualOrders: number;
  serviceLevel: number;
  demandVariability: number;
}

interface ScenarioData {
  name: string;
  demand: number;
  leadTime: number;
  safetyStock: number;
  reorderPoint: number;
  avgStock: number;
  turns: number;
}

// Lead time benchmarks by industry
const leadTimeBenchmarks = [
  { industry: "Electronics", avgLeadTime: 21, variability: 7, description: "Consumer electronics, components" },
  { industry: "Apparel", avgLeadTime: 35, variability: 14, description: "Fashion, textiles, garments" },
  { industry: "Automotive", avgLeadTime: 14, variability: 5, description: "Parts, accessories, components" },
  { industry: "Food & Beverage", avgLeadTime: 7, variability: 3, description: "Perishable and non-perishable goods" },
  { industry: "Pharmaceuticals", avgLeadTime: 10, variability: 4, description: "Medicines, medical supplies" },
  { industry: "Consumer Goods", avgLeadTime: 14, variability: 5, description: "Household products, cosmetics" },
  { industry: "Industrial Equipment", avgLeadTime: 28, variability: 10, description: "Machinery, tools, equipment" },
  { industry: "Chemicals", avgLeadTime: 14, variability: 6, description: "Raw materials, industrial chemicals" },
];

// Service level factors (Z-scores)
const serviceLevelFactors = [
  { level: "90%", zScore: 1.28, description: "Standard service level" },
  { level: "95%", zScore: 1.65, description: "Common business standard" },
  { level: "97.5%", zScore: 1.96, description: "High service level" },
  { level: "99%", zScore: 2.33, description: "Critical items" },
  { level: "99.5%", zScore: 2.58, description: "Essential/critical supplies" },
];

const FAQS = [
  {
    question: "What is a Reorder Point (ROP) and why is it critical for inventory management?",
    answer: "A Reorder Point (ROP) is the specific inventory level at which a new purchase order should be placed to replenish stock before it runs out. It represents the minimum quantity of inventory that triggers the procurement process. The ROP is critical because it directly impacts your ability to meet customer demand without interruption while minimizing holding costs. Setting the right ROP prevents stockouts that can result in lost sales, damaged customer relationships, and production stoppages, while also avoiding excessive inventory that ties up capital and increases storage costs. A well-calculated ROP considers both the expected demand during lead time and a safety buffer for variability.",
  },
  {
    question: "How is the Reorder Point calculated and what factors influence it?",
    answer: "The fundamental ROP formula is: ROP = (Average Daily Demand × Lead Time in Days) + Safety Stock. This calculation accounts for two primary components: Lead Time Demand, which is the expected consumption during the replenishment period, and Safety Stock, which provides a buffer against demand variability and supply uncertainties. Key factors influencing ROP include demand patterns (average and variability), supplier lead time and its reliability, desired service level (probability of not stocking out), order costs, and holding costs. Seasonality, market trends, and supplier performance history also play crucial roles. Advanced ROP calculations may incorporate demand forecasting models, lead time distribution analysis, and dynamic safety stock adjustments based on service level targets.",
  },
  {
    question: "What is Safety Stock and how do I determine the optimal level?",
    answer: "Safety Stock is the additional inventory maintained as a buffer against unexpected demand spikes, supply delays, or other uncertainties. It protects against stockouts when actual conditions deviate from forecasts. The optimal safety stock level balances the cost of carrying extra inventory against the cost of potential stockouts. A common formula is: Safety Stock = Z × σ × √L, where Z is the service level factor (Z-score), σ is the standard deviation of demand, and L is the lead time. Higher service levels require more safety stock. For example, achieving 99% service level requires significantly more buffer than 90%. Consider product criticality, demand variability, lead time reliability, and the cost of stockouts when setting your safety stock strategy.",
  },
  {
    question: "How does lead time variability affect the Reorder Point?",
    answer: "Lead time variability significantly impacts ROP because uncertain delivery times create additional risk of stockouts. When lead time varies, you need additional safety stock to cover extended delivery periods. The combined uncertainty formula accounts for both demand and lead time variability: Safety Stock = Z × √(L × σd² + d² × σL²), where σd is demand standard deviation, d is average demand, and σL is lead time standard deviation. Suppliers with consistent lead times allow lower safety stock, while unreliable suppliers require larger buffers. Strategies to mitigate lead time variability include supplier diversification, improved demand communication with suppliers, expediting arrangements, and maintaining strategic safety stock at multiple points in the supply chain. Reducing lead time variability is often more cost-effective than increasing inventory.",
  },
  {
    question: "What is the relationship between Reorder Point and Economic Order Quantity (EOQ)?",
    answer: "While ROP determines WHEN to order, EOQ determines HOW MUCH to order. These two concepts work together in inventory management systems. EOQ minimizes total inventory costs (ordering + holding costs) by finding the optimal order quantity. The formula is: EOQ = √(2 × D × S / H), where D is annual demand, S is ordering cost per order, and H is holding cost per unit per year. When inventory reaches the ROP, you place an order for the EOQ quantity. This creates a sawtooth pattern in inventory levels. The combination ensures you order at the right time (ROP) in the right quantity (EOQ). When demand or costs change, both ROP and EOQ should be recalculated. Some businesses use fixed order quantities instead of EOQ based on supplier minimums, container sizes, or practical considerations.",
  },
  {
    question: "How often should I review and update my Reorder Points?",
    answer: "ROP review frequency depends on demand volatility, lead time stability, and business dynamics. As a general guideline, review ROPs at least quarterly for stable items and monthly for items with high variability. Key triggers for immediate review include: significant demand pattern changes, supplier lead time changes, stockout incidents, excess inventory situations, and seasonal transitions. Implement a periodic review system (e.g., monthly ABC analysis) where A-items (high value/velocity) receive more frequent attention than C-items. Modern inventory management systems can automate ROP adjustments based on rolling averages and demand forecasts. Track metrics like fill rate, stockout frequency, and inventory turnover to evaluate ROP effectiveness. Continuous improvement in ROP accuracy leads to better service levels and optimized working capital.",
  },
  {
    question: "How do I handle Reorder Points for seasonal or promotional items?",
    answer: "Seasonal and promotional items require dynamic ROP strategies rather than static calculations. For seasonal items, use historical data to establish seasonal indices that adjust the base ROP throughout the year. Calculate separate ROPs for peak and off-peak periods, or use multiplicative seasonal factors. For promotional items, forecast the incremental demand lift and adjust ROPs in anticipation. Consider pre-positioning inventory before promotions and plan for post-promotion inventory reduction. Safety stock may need to be higher during peak seasons to accommodate increased demand uncertainty. Collaborative planning with sales and marketing teams is essential for promotional items. Some businesses implement time-phased ROPs that automatically adjust based on calendar or event triggers. Always have contingency plans for unexpected demand spikes and work closely with suppliers to ensure capacity availability during peak periods.",
  },
];

const PRO_TIPS = [
  {
    title: "Monitor Demand Patterns",
    description: "Track demand variability over time. Increasing variability requires higher safety stock to maintain service levels.",
    icon: TrendingUp,
  },
  {
    title: "Validate Lead Times",
    description: "Regularly compare actual lead times against supplier quotes. Actual performance data gives more accurate ROP calculations.",
    icon: Truck,
  },
  {
    title: "Segment Your Inventory",
    description: "Apply different service levels by item classification. A-items deserve higher service levels than C-items.",
    icon: Layers,
  },
  {
    title: "Build Supplier Relationships",
    description: "Reliable suppliers with consistent lead times allow lower safety stock, reducing inventory investment.",
    icon: Target,
  },
  {
    title: "Review Systematically",
    description: "Establish regular review cycles for ROP parameters. Market changes can quickly make historical calculations obsolete.",
    icon: Settings,
  },
];

const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  excellent: "#10B981",
  good: "#22C55E",
  moderate: "#F59E0B",
  warning: "#EF4444",
};

export default function ReorderPointCalculator() {
  const [demandType, setDemandType] = useState<"monthly" | "weekly" | "daily">("monthly");
  const [demand, setDemand] = useState("1000");
  const [leadTime, setLeadTime] = useState("14");
  const [leadTimeUnit, setLeadTimeUnit] = useState<"days" | "weeks">("days");
  const [safetyStock, setSafetyStock] = useState("100");
  const [orderQty, setOrderQty] = useState("500");
  const [workingDays, setWorkingDays] = useState("260");
  const [demandVariability, setDemandVariability] = useState("10");
  const [serviceLevel, setServiceLevel] = useState("95");
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");

  const result = useMemo<ReorderResult | null>(() => {
    const demandNum = parseFloat(demand);
    const leadTimeNum = parseFloat(leadTime);
    const safetyStockNum = parseFloat(safetyStock);
    const orderQtyNum = parseFloat(orderQty);
    const workingDaysNum = parseFloat(workingDays);
    const variabilityNum = parseFloat(demandVariability);

    if (isNaN(demandNum) || isNaN(leadTimeNum) || isNaN(safetyStockNum) || isNaN(orderQtyNum)) {
      return null;
    }

    // Convert demand to daily
    let dailyDemand: number;
    switch (demandType) {
      case "monthly":
        dailyDemand = demandNum / 22;
        break;
      case "weekly":
        dailyDemand = demandNum / 5;
        break;
      default:
        dailyDemand = demandNum;
    }

    // Convert lead time to days
    const leadTimeDays = leadTimeUnit === "weeks" ? leadTimeNum * 7 : leadTimeNum;

    // Calculate lead time demand
    const leadTimeDemand = dailyDemand * leadTimeDays;

    // Calculate reorder point
    const reorderPoint = leadTimeDemand + safetyStockNum;

    // Calculate max stock level
    const maxStock = reorderPoint + orderQtyNum - dailyDemand * leadTimeDays;

    // Calculate average stock level
    const avgStockLevel = safetyStockNum + orderQtyNum / 2;

    // Calculate stock turns per year
    const annualDemand = dailyDemand * workingDaysNum;
    const stockTurnsPerYear = annualDemand / avgStockLevel;

    // Calculate days of supply at reorder point
    const daysOfSupply = reorderPoint / dailyDemand;

    // Calculate order frequency
    const orderFrequency = orderQtyNum / dailyDemand;
    const annualOrders = workingDaysNum / orderFrequency;

    return {
      dailyDemand: Math.round(dailyDemand * 100) / 100,
      leadTimeDemand: Math.round(leadTimeDemand * 100) / 100,
      safetyStock: safetyStockNum,
      reorderPoint: Math.round(reorderPoint * 100) / 100,
      maxStock: Math.round(maxStock * 100) / 100,
      avgStockLevel: Math.round(avgStockLevel * 100) / 100,
      stockTurnsPerYear: Math.round(stockTurnsPerYear * 10) / 10,
      daysOfSupply: Math.round(daysOfSupply * 10) / 10,
      orderFrequency: Math.round(orderFrequency * 10) / 10,
      annualOrders: Math.round(annualOrders * 10) / 10,
      serviceLevel: parseFloat(serviceLevel),
      demandVariability: variabilityNum,
    };
  }, [demand, demandType, leadTime, leadTimeUnit, safetyStock, orderQty, workingDays, demandVariability, serviceLevel]);

  // Generate scenario data for analysis
  const scenarioData = useMemo<ScenarioData[]>(() => {
    if (!result) return [];
    
    const scenarios: ScenarioData[] = [];
    const baseDemand = result.dailyDemand;
    const baseLeadTime = leadTimeUnit === "weeks" ? parseFloat(leadTime) * 7 : parseFloat(leadTime);
    
    // Different demand scenarios
    const demandScenarios = [-20, -10, 0, 10, 20];
    const leadTimeScenarios = [-30, -15, 0, 15, 30];
    
    demandScenarios.forEach((demandChange, idx) => {
      const newDemand = baseDemand * (1 + demandChange / 100);
      const newLeadTime = baseLeadTime * (1 + leadTimeScenarios[idx] / 100);
      const newLeadTimeDemand = newDemand * newLeadTime;
      const newSafetyStock = parseFloat(safetyStock) * Math.sqrt(Math.abs(demandChange + 10) / 10);
      const newROP = newLeadTimeDemand + newSafetyStock;
      const newAvgStock = newSafetyStock + parseFloat(orderQty) / 2;
      const newTurns = (newDemand * 260) / newAvgStock;
      
      scenarios.push({
        name: `D${demandChange > 0 ? "+" : ""}${demandChange}%/L${leadTimeScenarios[idx] > 0 ? "+" : ""}${leadTimeScenarios[idx]}%`,
        demand: Math.round(newDemand),
        leadTime: Math.round(newLeadTime),
        safetyStock: Math.round(newSafetyStock),
        reorderPoint: Math.round(newROP),
        avgStock: Math.round(newAvgStock),
        turns: Math.round(newTurns * 10) / 10,
      });
    });
    
    return scenarios;
  }, [result, leadTime, leadTimeUnit, safetyStock, orderQty]);

  // Chart data
  const stockCompositionData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Lead Time Demand", value: result.leadTimeDemand, fill: COLORS.ocean },
      { name: "Safety Stock", value: result.safetyStock, fill: COLORS.logistics },
    ];
  }, [result]);

  const comparisonData = [
    { name: "ROP", value: result?.reorderPoint || 0, fill: COLORS.ocean },
    { name: "Avg Stock", value: result?.avgStockLevel || 0, fill: COLORS.logistics },
    { name: "Safety", value: result?.safetyStock || 0, fill: COLORS.moderate },
  ];

  const trendData = useMemo(() => {
    if (!result) return [];
    // Simulated inventory trend over a cycle
    const data = [];
    const cycleLength = result.orderFrequency;
    const maxStock = result.reorderPoint + parseFloat(orderQty) - result.leadTimeDemand;
    
    for (let day = 0; day <= cycleLength + 10; day++) {
      let inventory;
      if (day <= cycleLength) {
        inventory = maxStock - (result.dailyDemand * day);
      } else {
        inventory = result.reorderPoint + parseFloat(orderQty) - (result.dailyDemand * (day - cycleLength));
      }
      data.push({
        day,
        inventory: Math.max(0, Math.round(inventory)),
        rop: result.reorderPoint,
        safetyStock: result.safetyStock,
      });
    }
    return data;
  }, [result, orderQty]);

  const applyIndustryBenchmark = (industry: string) => {
    const benchmark = leadTimeBenchmarks.find((b) => b.industry === industry);
    if (benchmark) {
      setLeadTime(benchmark.avgLeadTime.toString());
      setLeadTimeUnit("days");
      setSafetyStock(benchmark.variability.toString());
      setSelectedIndustry(industry);
    }
  };

  const resetForm = () => {
    setDemand("1000");
    setDemandType("monthly");
    setLeadTime("14");
    setLeadTimeUnit("days");
    setSafetyStock("100");
    setOrderQty("500");
    setWorkingDays("260");
    setDemandVariability("10");
    setServiceLevel("95");
    setSelectedIndustry("");
  };

  const getEfficiencyColor = (value: number) => {
    if (value >= 90) return COLORS.excellent;
    if (value >= 70) return COLORS.good;
    if (value >= 50) return COLORS.moderate;
    return COLORS.warning;
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[var(--ocean)] text-white">
                  <Package className="h-3 w-3 mr-1" />
                  Inventory Management
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                  <Truck className="h-3 w-3 mr-1" />
                  Supply Chain
                </Badge>
              </motion.div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Reorder Point Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Calculate optimal reorder points to prevent stockouts while minimizing inventory costs. 
              Analyze demand patterns, lead time variability, and safety stock requirements for efficient inventory management.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RefreshCw className="h-4 w-4 mr-2" />
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
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Scenarios</span>
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
                    <Database className="h-5 w-5 text-[var(--ocean)]" />
                    Industry Quick Select
                  </CardTitle>
                  <CardDescription>
                    Apply industry-specific benchmark parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={selectedIndustry} onValueChange={applyIndustryBenchmark}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry for benchmark parameters" />
                    </SelectTrigger>
                    <SelectContent>
                      {leadTimeBenchmarks.map((b) => (
                        <SelectItem key={b.industry} value={b.industry}>
                          <div className="flex items-center gap-2">
                            <span>{b.industry}</span>
                            <span className="text-muted-foreground text-xs">
                              (Lead time: {b.avgLeadTime}d)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedIndustry && (
                    <div className="p-3 bg-muted/30 rounded-lg text-sm">
                      <p className="font-medium">{selectedIndustry}</p>
                      <p className="text-muted-foreground">
                        {leadTimeBenchmarks.find((b) => b.industry === selectedIndustry)?.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                    Demand Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="demand">Demand Quantity</Label>
                      <Input
                        id="demand"
                        type="number"
                        value={demand}
                        onChange={(e) => setDemand(e.target.value)}
                        placeholder="1000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demandType">Demand Period</Label>
                      <Select
                        value={demandType}
                        onValueChange={(v: "monthly" | "weekly" | "daily") => setDemandType(v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="workingDays">Working Days/Year</Label>
                      <Input
                        id="workingDays"
                        type="number"
                        value={workingDays}
                        onChange={(e) => setWorkingDays(e.target.value)}
                        placeholder="260"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="demandVariability">Demand Variability (%)</Label>
                      <Input
                        id="demandVariability"
                        type="number"
                        value={demandVariability}
                        onChange={(e) => setDemandVariability(e.target.value)}
                        placeholder="10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[var(--ocean)]" />
                    Lead Time & Supply
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leadTime">Lead Time</Label>
                      <Input
                        id="leadTime"
                        type="number"
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value)}
                        placeholder="14"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadTimeUnit">Time Unit</Label>
                      <Select
                        value={leadTimeUnit}
                        onValueChange={(v: "days" | "weeks") => setLeadTimeUnit(v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderQty">Order Quantity (EOQ)</Label>
                      <Input
                        id="orderQty"
                        type="number"
                        value={orderQty}
                        onChange={(e) => setOrderQty(e.target.value)}
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceLevel">Service Level</Label>
                      <Select value={serviceLevel} onValueChange={setServiceLevel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceLevelFactors.map((sl) => (
                            <SelectItem key={sl.level} value={sl.level}>
                              {sl.level} - {sl.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Safety Stock
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="safetyStock">Safety Stock Units</Label>
                    <Input
                      id="safetyStock"
                      type="number"
                      value={safetyStock}
                      onChange={(e) => setSafetyStock(e.target.value)}
                      placeholder="100"
                    />
                    <p className="text-xs text-muted-foreground">
                      Buffer stock to protect against demand variability and supply uncertainty
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)]" />
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Calculation Results
                  </CardTitle>
                  <CardDescription>
                    Reorder point analysis based on your parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {result ? (
                    <>
                      {/* Primary Result */}
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-[var(--ocean)] to-[var(--logistics)] rounded-xl p-6 text-white text-center"
                      >
                        <p className="text-sm opacity-90 mb-2">Reorder Point (ROP)</p>
                        <p className="text-5xl font-bold">{result.reorderPoint.toLocaleString()}</p>
                        <p className="text-sm opacity-75 mt-2">units</p>
                      </motion.div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="p-4 bg-[var(--ocean)]/10 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-[var(--ocean)]" />
                            <span className="text-sm text-muted-foreground">Daily Demand</span>
                          </div>
                          <p className="text-2xl font-bold text-[var(--ocean)]">{result.dailyDemand}</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="p-4 bg-[var(--logistics)]/10 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-4 w-4 text-[var(--logistics)]" />
                            <span className="text-sm text-muted-foreground">Lead Time Demand</span>
                          </div>
                          <p className="text-2xl font-bold text-[var(--logistics)]">{result.leadTimeDemand}</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="p-4 bg-amber-100 dark:bg-amber-950/30 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-muted-foreground">Safety Stock</span>
                          </div>
                          <p className="text-2xl font-bold text-amber-600">{result.safetyStock}</p>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                          className="p-4 bg-purple-100 dark:bg-purple-950/30 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Layers className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-muted-foreground">Avg Stock Level</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-600">{result.avgStockLevel}</p>
                        </motion.div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm">Performance Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground text-sm">Stock Turns/Year</span>
                            <Badge variant="secondary">{result.stockTurnsPerYear} turns</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground text-sm">Days of Supply at ROP</span>
                            <Badge variant="secondary">{result.daysOfSupply} days</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground text-sm">Order Frequency</span>
                            <Badge variant="secondary">{result.orderFrequency} days</Badge>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-muted-foreground text-sm">Annual Orders</span>
                            <Badge variant="secondary">{result.annualOrders} orders</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Formula Reference */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Formula</p>
                            <p className="text-sm text-muted-foreground font-mono mt-1">
                              ROP = (Daily Demand × Lead Time) + Safety Stock
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              = ({result.dailyDemand} × {leadTimeUnit === "weeks" ? `${parseFloat(leadTime) * 7}` : leadTime}) + {result.safetyStock} = {result.reorderPoint}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        Enter parameters to calculate reorder point
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Inventory Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4 text-[var(--logistics)]" />
                    Inventory Level Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-32 border-2 border-dashed rounded-lg overflow-hidden">
                    {/* Safety stock zone */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-amber-100 dark:bg-amber-950/30"
                      style={{ height: `${(result?.safetyStock || 0) / ((result?.reorderPoint || 1) + parseFloat(orderQty || "0")) * 100}%` }}
                    />
                    
                    {/* ROP line */}
                    {result && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-dashed border-[var(--ocean)]"
                        style={{ bottom: `${(result.reorderPoint / (result.reorderPoint + parseFloat(orderQty))) * 100}%` }}
                      >
                        <span className="absolute right-2 -top-5 text-xs text-[var(--ocean)] font-medium">
                          ROP: {result.reorderPoint}
                        </span>
                      </div>
                    )}
                    
                    {/* Labels */}
                    <div className="absolute bottom-2 left-2 text-xs">
                      <div className="flex items-center gap-1 text-amber-600">
                        <div className="w-3 h-3 bg-amber-100 dark:bg-amber-900/50 rounded" />
                        <span>Safety Stock: {result?.safetyStock || 0}</span>
                      </div>
                    </div>
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
                  Stock Composition
                </CardTitle>
                <CardDescription>Breakdown of reorder point components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockCompositionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stockCompositionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} units`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[var(--logistics)]" />
                  Inventory Level Comparison
                </CardTitle>
                <CardDescription>Key inventory metrics comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} units`} />
                      <Bar dataKey="value" name="Units" radius={[0, 4, 4, 0]}>
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[var(--ocean)]" />
                  Inventory Cycle Simulation
                </CardTitle>
                <CardDescription>Typical inventory level pattern over order cycle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" label={{ value: "Days", position: "bottom", offset: -5 }} />
                      <YAxis label={{ value: "Units", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="inventory"
                        name="Inventory Level"
                        stroke={COLORS.ocean}
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="rop"
                        name="Reorder Point"
                        stroke={COLORS.warning}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="safetyStock"
                        name="Safety Stock"
                        stroke={COLORS.moderate}
                        strokeDasharray="3 3"
                        dot={false}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Demand Variability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">
                    {result?.dailyDemand || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Daily Demand (units)</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">
                    {result?.stockTurnsPerYear || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Annual Turns</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold" style={{ color: getEfficiencyColor(result?.serviceLevel || 0) }}>
                    {result?.serviceLevel || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Service Level</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {result?.demandVariability || 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Demand Variability</div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Analysis Insights</h4>
                <div className="space-y-2">
                  {result && (
                    <>
                      <div className="flex items-start gap-2 p-3 bg-[var(--logistics)]/5 rounded-lg">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          Your ROP of <strong>{result.reorderPoint}</strong> units provides a{" "}
                          <strong>{result.serviceLevel}%</strong> service level with{" "}
                          <strong>{result.safetyStock}</strong> units of safety stock buffer.
                        </p>
                      </div>
                      <div className="flex items-start gap-2 p-3 bg-[var(--ocean)]/5 rounded-lg">
                        <Info className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          With <strong>{result.stockTurnsPerYear}</strong> annual turns, inventory is refreshed
                          approximately every <strong>{Math.round(365 / result.stockTurnsPerYear)}</strong> days on average.
                        </p>
                      </div>
                      {result.demandVariability > 15 && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                          <p className="text-sm text-muted-foreground">
                            High demand variability ({result.demandVariability}%) may require increased safety stock
                            to maintain service levels.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                What-If Scenario Analysis
              </CardTitle>
              <CardDescription>
                Explore how changes in demand and lead time affect your reorder point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke={COLORS.ocean} />
                    <YAxis yAxisId="right" orientation="right" stroke={COLORS.logistics} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="reorderPoint" name="Reorder Point" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="turns" name="Stock Turns" stroke={COLORS.logistics} strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scenario Details</CardTitle>
              <CardDescription>
                Detailed comparison of different demand and lead time scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Scenario</th>
                      <th className="text-center p-3 font-medium">Daily Demand</th>
                      <th className="text-center p-3 font-medium">Lead Time (days)</th>
                      <th className="text-center p-3 font-medium">Safety Stock</th>
                      <th className="text-center p-3 font-medium">ROP</th>
                      <th className="text-center p-3 font-medium">Avg Stock</th>
                      <th className="text-center p-3 font-medium">Turns/Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioData.map((scenario, index) => (
                      <tr
                        key={scenario.name}
                        className={`border-b ${index === 2 ? "bg-[var(--logistics)]/5 font-medium" : ""}`}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {index === 2 && <Badge className="bg-[var(--logistics)] text-white text-xs">Current</Badge>}
                            {scenario.name}
                          </div>
                        </td>
                        <td className="text-center p-3">{scenario.demand}</td>
                        <td className="text-center p-3">{scenario.leadTime}</td>
                        <td className="text-center p-3">{scenario.safetyStock}</td>
                        <td className="text-center p-3 font-bold text-[var(--ocean)]">{scenario.reorderPoint}</td>
                        <td className="text-center p-3">{scenario.avgStock}</td>
                        <td className="text-center p-3">
                          <Badge variant="outline" style={{ color: getEfficiencyColor(scenario.turns * 10) }}>
                            {scenario.turns}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Scenario Planning Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                  <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Lower Demand/Lead Time</h4>
                  <p className="text-sm text-muted-foreground">
                    When both demand and lead time decrease, inventory requirements reduce significantly.
                    Consider reducing safety stock proportionally while maintaining service levels.
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">Higher Demand/Lead Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Increased demand or lead time requires higher ROP. Plan for capacity expansion
                    and negotiate shorter lead times with suppliers to minimize inventory investment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Reorder Point Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding Reorder Point
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  A Reorder Point (ROP) is a critical inventory management threshold that determines when to place a
                  new order for replenishment. It represents the minimum inventory level that triggers procurement
                  to ensure continuous product availability without excessive stock holding costs.
                </p>
                <p className="text-muted-foreground">
                  The fundamental principle behind ROP is balancing the competing objectives of customer service
                  (avoiding stockouts) and working capital efficiency (minimizing inventory investment). A well-calculated
                  ROP accounts for both expected demand during the replenishment lead time and the inherent uncertainty
                  in both demand and supply.
                </p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold">Key Components:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-[var(--ocean)]/10 rounded">
                      <span className="font-medium text-[var(--ocean)]">Lead Time Demand</span>
                      <p className="text-xs text-muted-foreground">Expected consumption during replenishment</p>
                    </div>
                    <div className="p-2 bg-[var(--logistics)]/10 rounded">
                      <span className="font-medium text-[var(--logistics)]">Safety Stock</span>
                      <p className="text-xs text-muted-foreground">Buffer for demand/supply variability</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Calculation Formulas Explained</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                    <h5 className="font-semibold text-[var(--ocean)] mb-2">Basic ROP Formula</h5>
                    <div className="p-3 bg-background rounded font-mono text-sm mb-3">
                      ROP = D × L + SS
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>D</strong> = Average daily demand<br />
                      <strong>L</strong> = Lead time in days<br />
                      <strong>SS</strong> = Safety stock
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                    <h5 className="font-semibold text-[var(--logistics)] mb-2">Safety Stock Formula</h5>
                    <div className="p-3 bg-background rounded font-mono text-sm mb-3">
                      SS = Z × σ × √L
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong>Z</strong> = Service level factor (Z-score)<br />
                      <strong>σ</strong> = Demand standard deviation<br />
                      <strong>L</strong> = Lead time
                    </p>
                  </div>
                  <div className="p-4 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                    <h5 className="font-semibold text-purple-600 mb-2">Service Level Factors</h5>
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">90%</span> service level: Z = 1.28</p>
                      <p><span className="font-medium">95%</span> service level: Z = 1.65</p>
                      <p><span className="font-medium">97.5%</span> service level: Z = 1.96</p>
                      <p><span className="font-medium">99%</span> service level: Z = 2.33</p>
                      <p><span className="font-medium">99.5%</span> service level: Z = 2.58</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Industry Benchmarks</CardTitle>
                <CardDescription>
                  Typical lead times and variability by industry sector
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Industry</th>
                        <th className="text-center p-3 font-medium">Description</th>
                        <th className="text-center p-3 font-medium">Avg Lead Time</th>
                        <th className="text-center p-3 font-medium">Variability</th>
                        <th className="text-center p-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leadTimeBenchmarks.map((b) => (
                        <tr key={b.industry} className="border-b hover:bg-muted/30">
                          <td className="p-3 font-medium">{b.industry}</td>
                          <td className="text-center p-3 text-muted-foreground">{b.description}</td>
                          <td className="text-center p-3">
                            <Badge variant="outline">{b.avgLeadTime} days</Badge>
                          </td>
                          <td className="text-center p-3">
                            <Badge variant="outline">±{b.variability} days</Badge>
                          </td>
                          <td className="text-center p-3">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                applyIndustryBenchmark(b.industry);
                                setActiveTab("calculator");
                              }}
                            >
                              Apply
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
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
                Common questions about reorder point calculation and inventory management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-[var(--ocean)]/10">
                          <HelpCircle className="h-4 w-4 text-[var(--ocean)]" />
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3">
                  <BookOpen className="h-8 w-8 text-[var(--ocean)]" />
                  <div>
                    <h4 className="font-medium">Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Read our comprehensive guide on inventory management
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3">
                  <Zap className="h-8 w-8 text-[var(--logistics)]" />
                  <div>
                    <h4 className="font-medium">Quick Start</h4>
                    <p className="text-sm text-muted-foreground">
                      Get started with the calculator using default parameters
                    </p>
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
