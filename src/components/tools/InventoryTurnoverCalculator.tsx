"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Package,
  Calculator,
  BarChart3,
  BookOpen,
  HelpCircle,
  RefreshCw,
  Download,
  Share2,
  DollarSign,
  Calendar,
  Target,
  AlertTriangle,
  Info,
  Zap,
  Layers,
  PieChart,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Warehouse,
  LineChart,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
} from "recharts";

interface TurnoverResult {
  inventoryTurnover: number;
  daysInventoryOutstanding: number;
  grossMargin: number;
  grossMarginROI: number;
  inventoryCarryingCost: number;
  avgInventoryValue: number;
  annualPurchases: number;
  stockOutRisk: "low" | "medium" | "high";
  industryComparison: string;
  recommendation: string;
  efficiency: number;
}

interface ComparisonPeriod {
  id: string;
  name: string;
  cogs: number;
  beginningInventory: number;
  endingInventory: number;
  turnover: number;
  dio: number;
}

// Industry benchmarks with comprehensive data
const industryBenchmarks = [
  { industry: "Retail - Grocery", turnover: 14, dio: 26, carryingCost: 25, description: "High-turnover perishable goods" },
  { industry: "Retail - Apparel", turnover: 4, dio: 91, carryingCost: 30, description: "Seasonal fashion items" },
  { industry: "Retail - Electronics", turnover: 6, dio: 61, carryingCost: 28, description: "Consumer electronics" },
  { industry: "Manufacturing - Automotive", turnover: 10, dio: 37, carryingCost: 22, description: "Just-in-time parts" },
  { industry: "Manufacturing - Chemicals", turnover: 6, dio: 61, carryingCost: 24, description: "Industrial chemicals" },
  { industry: "Manufacturing - Electronics", turnover: 5, dio: 73, carryingCost: 26, description: "Electronic components" },
  { industry: "Wholesale - General", turnover: 8, dio: 46, carryingCost: 20, description: "Distribution wholesale" },
  { industry: "Pharmaceuticals", turnover: 3, dio: 122, carryingCost: 35, description: "Regulated medicines" },
  { industry: "Food & Beverage", turnover: 12, dio: 30, carryingCost: 25, description: "Food processing" },
  { industry: "Construction Materials", turnover: 5, dio: 73, carryingCost: 22, description: "Building supplies" },
  { industry: "E-commerce", turnover: 15, dio: 24, carryingCost: 18, description: "Online retail fulfillment" },
  { industry: "Aerospace Parts", turnover: 2, dio: 183, carryingCost: 32, description: "Specialized aircraft components" },
];

const FAQS = [
  {
    question: "What is inventory turnover ratio and why is it important?",
    answer: "Inventory turnover ratio is a financial metric that measures how many times a company sells and replaces its inventory during a specific period, typically a year. It is calculated by dividing the Cost of Goods Sold (COGS) by the Average Inventory. This ratio is crucial because it indicates how efficiently a company manages its inventory - a higher turnover generally suggests strong sales and effective inventory management, while a lower turnover may indicate overstocking, obsolete products, or weak sales. Understanding your inventory turnover helps optimize working capital, reduce carrying costs, identify slow-moving items, and improve cash flow. Industry benchmarks vary significantly, with grocery stores typically achieving 12-15 turns per year while luxury goods retailers may only achieve 2-4 turns.",
  },
  {
    question: "How do I calculate Days Inventory Outstanding (DIO)?",
    answer: "Days Inventory Outstanding (DIO), also known as Days Sales of Inventory (DSI) or Inventory Days, measures the average number of days a company holds inventory before selling it. The formula is: DIO = (Average Inventory / Cost of Goods Sold) × 365, or equivalently DIO = 365 / Inventory Turnover Ratio. For example, if your inventory turnover is 6 times per year, your DIO would be approximately 61 days (365 ÷ 6). A lower DIO indicates faster inventory movement and better cash conversion, while a higher DIO may suggest overstocking or slow sales. However, the optimal DIO varies by industry - fresh produce businesses may target 3-7 days, while heavy machinery manufacturers may have DIOs of 90+ days. Monitoring DIO trends over time helps identify improving or deteriorating inventory efficiency.",
  },
  {
    question: "What is GMROI and how does it relate to inventory turnover?",
    answer: "Gross Margin Return on Inventory Investment (GMROI) measures the profit return on each dollar invested in inventory. The formula is: GMROI = Gross Margin ÷ Average Inventory Cost. This metric combines profitability with inventory efficiency, providing a more complete picture than turnover alone. For example, a GMROI of 2.5 means you earn $2.50 in gross profit for every $1.00 invested in inventory. While a high turnover is generally good, it becomes problematic if margins are too thin - selling products quickly at minimal profit doesn't generate strong returns. Conversely, slow turnover with high margins may still yield good GMROI. The ideal scenario combines reasonable turnover (typically 6-12 times annually) with healthy margins (30-50%), resulting in GMROI above 2.0. Retailers use GMROI to make decisions about product assortment, pricing strategies, and inventory investment allocation across categories.",
  },
  {
    question: "What are the main factors affecting inventory carrying costs?",
    answer: "Inventory carrying costs typically represent 20-35% of total inventory value annually and include several components. Storage costs comprise warehouse space, utilities, insurance, and security. Capital costs represent the opportunity cost of money tied up in inventory - if you could invest that capital elsewhere at 8% return, that's part of your carrying cost. Risk costs include obsolescence, spoilage, damage, theft, and shrinkage. Service costs cover inventory management systems, handling equipment, labor, and taxes. For perishable goods, spoilage rates can be significant. For technology products, obsolescence risk increases rapidly over time. Understanding these components helps identify optimization opportunities - better warehouse management, improved demand forecasting, reduced lead times, or strategic supplier partnerships can all reduce carrying costs while maintaining service levels.",
  },
  {
    question: "How can I improve a low inventory turnover ratio?",
    answer: "Improving a low inventory turnover ratio requires a systematic approach combining demand management, purchasing optimization, and sales strategies. Start by analyzing your inventory with ABC classification - focus efforts on high-value items that contribute most to carrying costs. Review purchasing practices: consider smaller, more frequent orders instead of large batch purchases, especially for slow-moving items. Implement Just-In-Time (JIT) principles where appropriate, reducing safety stock for items with reliable suppliers. Address obsolete inventory proactively through discounting, bundling, or liquidation. Improve demand forecasting accuracy using historical sales data, market trends, and seasonal patterns. Consider dropshipping arrangements for slow-moving items to eliminate inventory entirely. Negotiate better payment terms with suppliers to improve cash flow. Finally, align sales and marketing efforts with inventory positions to move slow-moving stock through promotions, bundles, or channel strategies.",
  },
  {
    question: "What are the risks of having too high an inventory turnover?",
    answer: "While high inventory turnover is generally positive, excessively high turnover can create significant operational risks. The primary concern is stockout risk - running out of inventory means lost sales, customer dissatisfaction, and potential loss of market share to competitors. Frequent stockouts damage customer relationships and brand reputation. High turnover with minimal safety stock makes your supply chain vulnerable to disruptions from supplier delays, transportation issues, or demand spikes. You may also miss quantity discounts and face higher per-unit procurement costs from ordering smaller quantities more frequently. Administrative costs increase with more purchase orders, receiving activities, and supplier management. Some industries require minimum inventory levels for quality control or regulatory compliance. The optimal turnover balances efficiency with resilience - generally, you want sufficient safety stock to maintain a 95-99% service level while avoiding excessive inventory that ties up capital and increases carrying costs.",
  },
  {
    question: "How does inventory turnover vary across different industries?",
    answer: "Inventory turnover varies dramatically across industries due to fundamental differences in product characteristics, demand patterns, and supply chain structures. Fast-moving consumer goods (FMCG) industries like grocery retail achieve 12-15+ annual turns due to perishability and high demand frequency. Fashion retail typically sees 4-6 turns, with pressure to clear seasonal inventory before obsolescence. Heavy industries like construction equipment may only achieve 2-3 turns due to high-value, low-volume products and custom manufacturing. Pharmaceutical companies face unique constraints from regulatory requirements, lot tracking, and shelf-life management, typically resulting in 3-4 turns. E-commerce companies can achieve 15-20+ turns by holding minimal inventory and leveraging dropshipping. Understanding your industry benchmark is crucial - comparing a 5-turn pharmaceutical company to a 12-turn grocery chain is meaningless. Always benchmark against industry peers with similar business models, product mixes, and geographic footprints.",
  },
];

const PRO_TIPS = [
  {
    title: "Use ABC Analysis",
    description: "Focus inventory management efforts on high-value 'A' items that represent 80% of value but only 20% of SKUs.",
    icon: Target,
  },
  {
    title: "Implement Safety Stock",
    description: "Balance turnover goals with service levels. Maintain safety stock based on demand variability and lead time.",
    icon: Package,
  },
  {
    title: "Monitor Slow Movers",
    description: "Set thresholds to identify slow-moving items. Products with turnover below industry average need attention.",
    icon: AlertTriangle,
  },
  {
    title: "Align with Suppliers",
    description: "Work with suppliers on smaller, frequent deliveries. Vendor-managed inventory can significantly improve turnover.",
    icon: ArrowRight,
  },
  {
    title: "Forecast Accurately",
    description: "Invest in demand forecasting tools. Better predictions mean less safety stock and higher turnover.",
    icon: LineChart,
  },
];

export default function InventoryTurnoverCalculator() {
  const [calculationMethod, setCalculationMethod] = useState<"sales" | "cogs">("cogs");
  const [periodType, setPeriodType] = useState<"annual" | "quarterly" | "monthly">("annual");
  const [cogs, setCogs] = useState("1200000");
  const [sales, setSales] = useState("2000000");
  const [beginningInventory, setBeginningInventory] = useState("250000");
  const [endingInventory, setEndingInventory] = useState("200000");
  const [carryingCostRate, setCarryingCostRate] = useState("25");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [result, setResult] = useState<TurnoverResult | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");
  const [comparisonPeriods, setComparisonPeriods] = useState<ComparisonPeriod[]>([]);

  const calculateTurnover = () => {
    const cogsNum = parseFloat(cogs);
    const salesNum = parseFloat(sales);
    const beginningInvNum = parseFloat(beginningInventory);
    const endingInvNum = parseFloat(endingInventory);
    const carryingRateNum = parseFloat(carryingCostRate);

    if (isNaN(cogsNum) || isNaN(beginningInvNum) || isNaN(endingInvNum)) {
      return;
    }

    // Adjust for period type
    let periodMultiplier = 1;
    switch (periodType) {
      case "quarterly":
        periodMultiplier = 4;
        break;
      case "monthly":
        periodMultiplier = 12;
        break;
    }

    // Calculate average inventory
    const avgInventory = (beginningInvNum + endingInvNum) / 2;

    // Calculate inventory turnover based on method
    let turnover: number;
    let numerator: number;

    if (calculationMethod === "cogs") {
      numerator = cogsNum * periodMultiplier;
      turnover = numerator / avgInventory;
    } else {
      numerator = salesNum * periodMultiplier;
      turnover = numerator / avgInventory;
    }

    // Calculate Days Inventory Outstanding (DIO)
    const dio = 365 / turnover;

    // Calculate gross margin
    const grossMargin =
      ((salesNum * periodMultiplier - cogsNum * periodMultiplier) / (salesNum * periodMultiplier)) * 100;

    // Calculate Gross Margin Return on Inventory Investment (GMROI)
    const gmroi = (salesNum * periodMultiplier - cogsNum * periodMultiplier) / avgInventory;

    // Calculate inventory carrying cost
    const carryingCost = avgInventory * (carryingRateNum / 100);

    // Determine stock-out risk based on turnover
    let stockOutRisk: "low" | "medium" | "high";
    if (turnover > 8) {
      stockOutRisk = "high";
    } else if (turnover > 4) {
      stockOutRisk = "medium";
    } else {
      stockOutRisk = "low";
    }

    // Calculate efficiency score
    const efficiency = Math.min(turnover / 12, 1) * 100;

    // Industry comparison
    let industryComparison = "Moderate Level";
    let recommendation = "";

    if (turnover < 3) {
      industryComparison = "Below Industry Average";
      recommendation =
        "Consider reducing inventory levels, optimizing purchasing strategies, or strengthening sales efforts. Review slow-moving items and consider liquidation strategies.";
    } else if (turnover > 10) {
      industryComparison = "Above Industry Average";
      recommendation =
        "High inventory turnover is positive, but monitor for potential stockout risks. Consider increasing safety stock for critical items and evaluate if sales are being lost due to stockouts.";
    } else {
      industryComparison = "Near Industry Average";
      recommendation =
        "Maintain current inventory management practices while continuously monitoring and optimizing. Focus on improving forecasting accuracy and supplier relationships.";
    }

    setResult({
      inventoryTurnover: Math.round(turnover * 10) / 10,
      daysInventoryOutstanding: Math.round(dio),
      grossMargin: Math.round(grossMargin * 10) / 10,
      grossMarginROI: Math.round(gmroi * 10) / 10,
      inventoryCarryingCost: Math.round(carryingCost),
      avgInventoryValue: Math.round(avgInventory),
      annualPurchases: Math.round(cogsNum * periodMultiplier),
      stockOutRisk,
      industryComparison,
      recommendation,
      efficiency,
    });
  };

  const applyIndustryBenchmark = (industry: string) => {
    const benchmark = industryBenchmarks.find((b) => b.industry === industry);
    if (benchmark) {
      setCarryingCostRate(benchmark.carryingCost.toString());
      setSelectedIndustry(industry);
    }
  };

  const resetForm = () => {
    setCogs("1200000");
    setSales("2000000");
    setBeginningInventory("250000");
    setEndingInventory("200000");
    setCarryingCostRate("25");
    setResult(null);
    setSelectedIndustry("");
    setPeriodType("annual");
    setCalculationMethod("cogs");
    setComparisonPeriods([]);
  };

  const addToComparison = () => {
    if (result) {
      const newPeriod: ComparisonPeriod = {
        id: crypto.randomUUID(),
        name: `Period ${comparisonPeriods.length + 1}`,
        cogs: parseFloat(cogs),
        beginningInventory: parseFloat(beginningInventory),
        endingInventory: parseFloat(endingInventory),
        turnover: result.inventoryTurnover,
        dio: result.daysInventoryOutstanding,
      };
      setComparisonPeriods((prev) => [...prev, newPeriod]);
    }
  };

  // Chart data
  const turnoverComparisonData = useMemo(() => {
    const benchmark = selectedIndustry
      ? industryBenchmarks.find((b) => b.industry === selectedIndustry)
      : null;

    return [
      {
        name: "Your Turnover",
        value: result?.inventoryTurnover || 0,
        fill: "#0F4C81",
      },
      {
        name: "Industry Avg",
        value: benchmark?.turnover || 6,
        fill: "#2E8B57",
      },
    ];
  }, [result, selectedIndustry]);

  const inventoryCompositionData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Beginning", value: parseFloat(beginningInventory), fill: "#0F4C81" },
      { name: "Ending", value: parseFloat(endingInventory), fill: "#2E8B57" },
    ];
  }, [result, beginningInventory, endingInventory]);

  const costBreakdownData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Avg Inventory", value: result.avgInventoryValue, fill: "#0F4C81" },
      { name: "Carrying Cost", value: result.inventoryCarryingCost, fill: "#F59E0B" },
      { name: "Annual COGS", value: result.annualPurchases / 10, fill: "#2E8B57" },
    ];
  }, [result]);

  const efficiencyData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Efficiency", value: result.efficiency, fill: "#2E8B57" },
      { name: "Remaining", value: 100 - result.efficiency, fill: "#E5E7EB" },
    ];
  }, [result]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return "#10B981";
    if (efficiency >= 60) return "#22C55E";
    if (efficiency >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-emerald-500";
      case "medium":
        return "bg-amber-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-slate-500";
    }
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
              <Badge className="bg-[var(--ocean)] text-white">
                <Warehouse className="h-3 w-3 mr-1" />
                Inventory Management
              </Badge>
              <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                <Zap className="h-3 w-3 mr-1" />
                Performance Metrics
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Inventory Turnover Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Analyze inventory efficiency, optimize working capital, and improve operational performance.
              Calculate turnover ratio, days inventory outstanding, GMROI, and carrying costs with
              industry benchmark comparisons.
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
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Calculation Settings
                  </CardTitle>
                  <CardDescription>Configure your inventory turnover calculation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Calculation Method</Label>
                      <Select
                        value={calculationMethod}
                        onValueChange={(v: "sales" | "cogs") => setCalculationMethod(v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cogs">COGS Method (Preferred)</SelectItem>
                          <SelectItem value="sales">Sales Method</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Data Period</Label>
                      <Select
                        value={periodType}
                        onValueChange={(v: "annual" | "quarterly" | "monthly") => setPeriodType(v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                    Financial Data
                  </CardTitle>
                  <CardDescription>Enter your cost and sales figures</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cogs">
                      {calculationMethod === "cogs" ? "Cost of Goods Sold (COGS)" : "Sales Revenue"}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="cogs"
                        type="number"
                        value={calculationMethod === "cogs" ? cogs : sales}
                        onChange={(e) =>
                          calculationMethod === "cogs" ? setCogs(e.target.value) : setSales(e.target.value)
                        }
                        className="pl-8"
                        placeholder="1,200,000"
                      />
                    </div>
                  </div>

                  {calculationMethod === "cogs" && (
                    <div className="space-y-2">
                      <Label htmlFor="sales">Sales Revenue (for margin calculation)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="sales"
                          type="number"
                          value={sales}
                          onChange={(e) => setSales(e.target.value)}
                          className="pl-8"
                          placeholder="2,000,000"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Inventory Data
                  </CardTitle>
                  <CardDescription>Enter beginning and ending inventory values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="beginningInv">Beginning Inventory</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="beginningInv"
                          type="number"
                          value={beginningInventory}
                          onChange={(e) => setBeginningInventory(e.target.value)}
                          className="pl-8"
                          placeholder="250,000"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endingInv">Ending Inventory</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          id="endingInv"
                          type="number"
                          value={endingInventory}
                          onChange={(e) => setEndingInventory(e.target.value)}
                          className="pl-8"
                          placeholder="200,000"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-[var(--logistics)]" />
                    Industry Reference
                  </CardTitle>
                  <CardDescription>Apply industry benchmarks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Industry</Label>
                      <Select value={selectedIndustry} onValueChange={applyIndustryBenchmark}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryBenchmarks.map((b) => (
                            <SelectItem key={b.industry} value={b.industry}>
                              {b.industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carryingCost">Carrying Cost Rate (%)</Label>
                      <div className="relative">
                        <Input
                          id="carryingCost"
                          type="number"
                          value={carryingCostRate}
                          onChange={(e) => setCarryingCostRate(e.target.value)}
                          placeholder="25"
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                      </div>
                    </div>
                  </div>

                  {selectedIndustry && (
                    <div className="p-3 bg-muted/30 rounded-lg">
                      {(() => {
                        const benchmark = industryBenchmarks.find((b) => b.industry === selectedIndustry);
                        return benchmark ? (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Industry benchmark:</span>
                            <div className="flex gap-4">
                              <span>
                                <strong className="text-[var(--ocean)]">{benchmark.turnover}</strong> turns/year
                              </span>
                              <span>
                                <strong className="text-[var(--logistics)]">{benchmark.dio}</strong> days
                              </span>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={calculateTurnover}
                className="w-full bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] hover:opacity-90"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Inventory Turnover
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                    Analysis Results
                  </CardTitle>
                  <CardDescription>Your inventory turnover analysis</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {result ? (
                    <>
                      {/* Primary Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          key={result.inventoryTurnover}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center"
                        >
                          <div className="text-3xl font-bold text-[var(--ocean)]">
                            {result.inventoryTurnover}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Inventory Turnover</div>
                          <div className="text-xs text-muted-foreground">times per year</div>
                        </motion.div>
                        <motion.div
                          key={result.daysInventoryOutstanding}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center"
                        >
                          <div className="text-3xl font-bold text-[var(--logistics)]">
                            {result.daysInventoryOutstanding}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">Days Inventory Outstanding</div>
                          <div className="text-xs text-muted-foreground">average days in stock</div>
                        </motion.div>
                      </div>

                      {/* Secondary Metrics */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-muted/30 rounded-lg p-3 text-center">
                          <div className="text-xs text-muted-foreground mb-1">Gross Margin</div>
                          <div className="text-lg font-bold text-[var(--ocean)]">{result.grossMargin}%</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3 text-center">
                          <div className="text-xs text-muted-foreground mb-1">GMROI</div>
                          <div className="text-lg font-bold text-[var(--logistics)]">{result.grossMarginROI}x</div>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-3 text-center">
                          <div className="text-xs text-muted-foreground mb-1">Carrying Cost</div>
                          <div className="text-lg font-bold text-amber-600">
                            ${result.inventoryCarryingCost.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Efficiency Score */}
                      <div className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Efficiency Score</span>
                          <span
                            className="text-2xl font-bold"
                            style={{ color: getEfficiencyColor(result.efficiency) }}
                          >
                            {result.efficiency.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={result.efficiency} className="h-2" />
                      </div>

                      {/* Analysis Summary */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-muted-foreground">Average Inventory</span>
                          <Badge variant="secondary">${result.avgInventoryValue.toLocaleString()}</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-muted-foreground">Annual Purchases</span>
                          <Badge variant="secondary">${result.annualPurchases.toLocaleString()}</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-muted-foreground">Industry Comparison</span>
                          <Badge
                            className={
                              result.industryComparison === "Above Industry Average"
                                ? "bg-emerald-500"
                                : result.industryComparison === "Below Industry Average"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                            }
                          >
                            {result.industryComparison}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">Stockout Risk</span>
                          <Badge className={getRiskColor(result.stockOutRisk)}>
                            {result.stockOutRisk === "high"
                              ? "High"
                              : result.stockOutRisk === "medium"
                                ? "Medium"
                                : "Low"}
                          </Badge>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="bg-[var(--logistics)]/5 border border-[var(--logistics)]/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Recommendation</p>
                            <p className="text-sm text-muted-foreground mt-1">{result.recommendation}</p>
                          </div>
                        </div>
                      </div>

                      {/* Formula Reference */}
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">Formulas Used</p>
                            <div className="text-sm text-muted-foreground mt-1 space-y-1">
                              <p>Inventory Turnover = COGS ÷ Average Inventory</p>
                              <p>DIO = 365 ÷ Inventory Turnover</p>
                              <p>GMROI = Gross Margin ÷ Average Inventory</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" onClick={addToComparison} className="w-full">
                        <Layers className="h-4 w-4 mr-2" />
                        Add to Comparison
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <TrendingUp className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">Enter your data and click Calculate</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Results will appear here with comprehensive analysis
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {result ? (
            <>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                      Turnover vs Industry Benchmark
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={turnoverComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, "auto"]} />
                          <Tooltip formatter={(value: number) => `${value} times/year`} />
                          <Bar dataKey="value" name="Turnover" radius={[4, 4, 0, 0]}>
                            {turnoverComparisonData.map((entry, index) => (
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
                      <PieChart className="h-5 w-5 text-[var(--logistics)]" />
                      Efficiency Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={efficiencyData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {efficiencyData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                          <Legend />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Cost Analysis Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={costBreakdownData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                        <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                    Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[var(--ocean)]">
                        ${result.avgInventoryValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Average Inventory</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[var(--logistics)]">
                        ${result.inventoryCarryingCost.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">Annual Carrying Cost</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold" style={{ color: getEfficiencyColor(result.efficiency) }}>
                        {result.efficiency.toFixed(0)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Efficiency Score</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold text-amber-600">{result.grossMarginROI}x</div>
                      <div className="text-sm text-muted-foreground">GMROI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Please calculate inventory turnover first to see analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                Period Comparison
              </CardTitle>
              <CardDescription>
                Compare inventory turnover across multiple periods or categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {comparisonPeriods.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonPeriods.map((p) => ({
                          name: p.name,
                          turnover: p.turnover,
                          dio: p.dio,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                        <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="turnover" name="Turnover" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="dio" name="DIO (days)" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Period</th>
                          <th className="text-right p-2">COGS</th>
                          <th className="text-right p-2">Avg Inventory</th>
                          <th className="text-right p-2">Turnover</th>
                          <th className="text-right p-2">DIO</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonPeriods.map((period) => (
                          <tr key={period.id} className="border-b">
                            <td className="p-2 font-medium">{period.name}</td>
                            <td className="text-right p-2">${period.cogs.toLocaleString()}</td>
                            <td className="text-right p-2">
                              ${Math.round((period.beginningInventory + period.endingInventory) / 2).toLocaleString()}
                            </td>
                            <td className="text-right p-2 font-bold text-[var(--ocean)]">{period.turnover}</td>
                            <td className="text-right p-2 font-bold text-[var(--logistics)]">{period.dio}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Layers className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No comparison data yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Calculate turnover and click "Add to Comparison" to build your comparison
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Industry Benchmark Comparison
              </CardTitle>
              <CardDescription>Compare your turnover against industry standards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Industry</th>
                      <th className="text-center p-3">Turnover</th>
                      <th className="text-center p-3">DIO</th>
                      <th className="text-center p-3">Carrying Cost</th>
                      <th className="text-left p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {industryBenchmarks.map((b) => (
                      <tr
                        key={b.industry}
                        className={`border-b cursor-pointer hover:bg-muted/30 ${selectedIndustry === b.industry ? "bg-muted/50" : ""}`}
                        onClick={() => {
                          applyIndustryBenchmark(b.industry);
                          setActiveTab("calculator");
                        }}
                      >
                        <td className="p-3 font-medium">{b.industry}</td>
                        <td className="text-center p-3">
                          <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">{b.turnover}x</Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)]">{b.dio} days</Badge>
                        </td>
                        <td className="text-center p-3">
                          <Badge variant="outline">{b.carryingCost}%</Badge>
                        </td>
                        <td className="p-3 text-muted-foreground">{b.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  What is Inventory Turnover?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Inventory turnover ratio is a fundamental financial metric that measures how efficiently a company
                  manages its inventory by calculating how many times inventory is sold and replaced over a specific
                  period, typically one year. This ratio provides critical insights into operational efficiency,
                  sales effectiveness, and inventory management practices.
                </p>
                <p>
                  The ratio is calculated by dividing the Cost of Goods Sold (COGS) by the average inventory value
                  during the period. Average inventory is typically calculated as (Beginning Inventory + Ending
                  Inventory) ÷ 2. A higher turnover ratio indicates that inventory is being sold quickly, which
                  generally suggests strong sales performance and efficient inventory management. Conversely, a lower
                  ratio may indicate overstocking, obsolete inventory, or weak sales demand.
                </p>
                <p>
                  Understanding and optimizing inventory turnover is essential for maintaining healthy cash flow,
                  reducing carrying costs, and improving overall business profitability. Companies use this metric
                  to benchmark performance against industry standards, identify slow-moving products, and make
                  informed decisions about purchasing, pricing, and production planning.
                </p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Metrics Explained:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>
                        <strong>Inventory Turnover:</strong> Number of times inventory cycles per year
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>
                        <strong>Days Inventory Outstanding (DIO):</strong> Average days inventory sits before sale
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>
                        <strong>GMROI:</strong> Gross Margin Return on Inventory Investment
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>
                        <strong>Carrying Cost:</strong> Total cost of holding inventory (% of inventory value)
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--logistics)]" />
                  Strategies to Improve Inventory Turnover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--ocean)]">Demand Management</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        <span>Implement accurate demand forecasting using historical data and market trends</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        <span>Use ABC analysis to prioritize high-value inventory items</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        <span>Monitor sales trends and adjust inventory levels proactively</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[var(--logistics)]">Supply Chain Optimization</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        <span>Consider Just-In-Time (JIT) inventory management where appropriate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        <span>Negotiate smaller, more frequent deliveries with suppliers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        <span>Implement vendor-managed inventory (VMI) programs</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Ignoring seasonality:</strong> Failing to account for seasonal demand variations can
                      lead to inaccurate turnover calculations and poor inventory decisions.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Over-optimizing turnover:</strong> Pursuing high turnover at the expense of customer
                      service can result in stockouts and lost sales.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Using wrong benchmarks:</strong> Comparing your turnover to unrelated industries leads
                      to misleading conclusions and inappropriate targets.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Neglecting product mix:</strong> Not analyzing turnover by product category can hide
                      problems with specific items.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--ocean)]" />
                  KPI Reference Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                    <h5 className="font-semibold text-[var(--ocean)] mb-2">Inventory Turnover</h5>
                    <p className="text-xs text-muted-foreground">
                      Industry benchmarks vary widely. Retail: 8-15x, Manufacturing: 4-8x, Pharmaceuticals: 2-4x.
                      Higher is generally better but balance with service levels.
                    </p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                    <h5 className="font-semibold text-[var(--logistics)] mb-2">Days Inventory Outstanding</h5>
                    <p className="text-xs text-muted-foreground">
                      Lower DIO means faster inventory conversion. Target varies by industry. Fresh food: 3-7 days,
                      Electronics: 30-45 days, Heavy equipment: 60-90 days.
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
                    <h5 className="font-semibold text-purple-600 mb-2">GMROI</h5>
                    <p className="text-xs text-muted-foreground">
                      Gross Margin Return on Inventory Investment. Above 2.0 is good, below 1.0 needs attention.
                      Measures profit return per dollar invested in inventory.
                    </p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                    <h5 className="font-semibold text-amber-600 mb-2">Carrying Cost</h5>
                    <p className="text-xs text-muted-foreground">
                      Typically 20-35% of inventory value annually. Includes storage, capital cost, insurance,
                      obsolescence, and handling. Lower is better.
                    </p>
                  </div>
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
                Comprehensive answers to common questions about inventory turnover
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Help Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--logistics)]" />
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you have additional questions about inventory turnover analysis or need assistance with your
                  specific situation, consider consulting with a supply chain professional or financial analyst who
                  can provide personalized guidance based on your industry and business model.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Support
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Quick Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Turnover Formula</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">COGS ÷ Avg Inventory</code>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">DIO Formula</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">365 ÷ Turnover</code>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">GMROI Formula</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">Gross Margin ÷ Avg Inventory</code>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-muted-foreground">Avg Inventory</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">(Begin + End) ÷ 2</code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
