"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowRight,
  Download,
  Share2,
  HelpCircle,
  BarChart3,
  PieChart,
  Ruler,
  CheckCircle2,
  XCircle,
  Zap,
  Target,
  Box,
  Scale,
  Warehouse,
  Clock,
  Sparkles,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  Truck,
  Shield,
  Percent,
  Settings,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatCurrency } from "@/lib/constants/currencies";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Approximate FBA fees by category (simplified)
const fbaFeeRates: Record<string, { small: number; standard: number; oversize: number }> = {
  "Apparel": { small: 3.22, standard: 4.75, oversize: 9.73 },
  "Electronics": { small: 3.22, standard: 4.75, oversize: 9.73 },
  "Home & Kitchen": { small: 3.22, standard: 4.75, oversize: 9.73 },
  "Beauty": { small: 3.22, standard: 4.75, oversize: 9.73 },
  "Sports": { small: 3.22, standard: 4.75, oversize: 9.73 },
  "Toys": { small: 3.22, standard: 4.75, oversize: 9.73 },
  "Books": { small: 2.50, standard: 3.80, oversize: 8.25 },
  "Other": { small: 3.22, standard: 4.75, oversize: 9.73 },
};

const referralFeeRates: Record<string, number> = {
  "Apparel": 0.17,
  "Electronics": 0.08,
  "Home & Kitchen": 0.15,
  "Beauty": 0.08,
  "Sports": 0.15,
  "Toys": 0.15,
  "Books": 0.15,
  "Other": 0.15,
};

const storageFeeRates = {
  standard: { janSep: 0.87, octDec: 2.40 },
  oversize: { janSep: 0.56, octDec: 1.40 },
};

// Size tier definitions
const sizeTiers = [
  {
    name: "Small Standard",
    longestSide: 15,
    medianSide: 12,
    shortestSide: 0.75,
    weight: 12,
    weightUnit: "oz",
    description: "Small, lightweight items that fit in padded mailers",
    examples: "Jewelry, small electronics accessories, cosmetics",
    fbaFeeRange: "$2.50 - $3.50",
    color: "#22c55e",
  },
  {
    name: "Large Standard",
    longestSide: 18,
    medianSide: 14,
    shortestSide: 8,
    weight: 20,
    weightUnit: "lbs",
    description: "Standard-sized products that fit in boxes",
    examples: "Books, small appliances, clothing, toys",
    fbaFeeRange: "$4.00 - $6.00",
    color: "var(--ocean)",
  },
  {
    name: "Small Oversize",
    longestSide: 60,
    medianSide: 30,
    shortestSide: 30,
    weight: 70,
    weightUnit: "lbs",
    description: "Bulky items that exceed standard dimensions",
    examples: "Small furniture, large electronics, exercise equipment",
    fbaFeeRange: "$9.00 - $15.00",
    color: "#f59e0b",
  },
  {
    name: "Medium Oversize",
    longestSide: 108,
    medianSide: 60,
    shortestSide: 30,
    weight: 150,
    weightUnit: "lbs",
    description: "Large items requiring special handling",
    examples: "Furniture, large appliances, outdoor equipment",
    fbaFeeRange: "$15.00 - $30.00",
    color: "#f97316",
  },
  {
    name: "Large Oversize",
    longestSide: 108,
    medianSide: 60,
    shortestSide: 30,
    weight: 150,
    weightUnit: "lbs",
    description: "Very large or heavy items",
    examples: "Large furniture, mattresses, fitness machines",
    fbaFeeRange: "$30.00 - $75.00",
    color: "#ef4444",
  },
  {
    name: "Special Oversize",
    longestSide: null,
    medianSide: null,
    shortestSide: null,
    weight: null,
    weightUnit: "custom",
    description: "Items exceeding 108\" on any side or 150 lbs",
    examples: "Industrial equipment, vehicles, large machinery",
    fbaFeeRange: "Custom pricing",
    color: "#8b5cf6",
  },
];

// Pro Tips Data
const proTips = [
  {
    icon: Package,
    title: "Optimize Product Dimensions",
    description: "Even small reductions in packaging size can move your product to a lower size tier, significantly reducing FBA fees. Work with suppliers to create custom packaging that fits just under size tier thresholds.",
  },
  {
    icon: Clock,
    title: "Time Your Inventory Shipments",
    description: "Plan shipments to arrive in September before peak storage fees begin in October. This strategy helps avoid the higher Q4 storage rates while ensuring adequate holiday inventory.",
  },
  {
    icon: Percent,
    title: "Calculate True Profit Margins",
    description: "Always include all costs in your calculations: product cost, shipping, FBA fees, referral fees, PPC advertising (typically 10-15% of sales), returns (budget 5-10%), and storage fees for accurate margin projections.",
  },
  {
    icon: TrendingUpIcon,
    title: "Monitor Inventory Turnover",
    description: "Aim for inventory turnover of 4-6 times per year. Slow-moving inventory not only ties up capital but accumulates storage fees and risks long-term storage penalties after 365 days.",
  },
  {
    icon: Target,
    title: "Use Bundle Strategies",
    description: "Creating product bundles can increase average order value while potentially qualifying for lower per-unit FBA fees. Bundles also differentiate your listing from competitors.",
  },
  {
    icon: Shield,
    title: "Protect Your Buy Box",
    description: "Maintain excellent seller metrics including low order defect rate, fast shipment times, and competitive pricing. Losing the Buy Box can dramatically impact sales volume and profitability.",
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    icon: XCircle,
    title: "Ignoring All Fee Components",
    description: "Many sellers only calculate obvious costs like product cost and Amazon referral fees, overlooking FBA fulfillment fees, storage fees, advertising costs, and return rates. This leads to inaccurate profit projections and potentially unprofitable products. Always use a comprehensive calculator that includes all fee categories.",
  },
  {
    icon: AlertTriangle,
    title: "Underestimating Return Rates",
    description: "Product returns are often underestimated in profit calculations. Categories like apparel can see return rates of 15-30%, while electronics may experience 5-10%. Returns not only reduce revenue but also incur return processing fees and may result in unsellable inventory. Factor realistic return rates into your pricing strategy.",
  },
  {
    icon: Clock,
    title: "Neglecting Peak Season Planning",
    description: "Failing to plan for Q4 peak storage fees (October-December) can result in significantly higher costs. The storage fees increase by nearly 3x during this period. Additionally, inadequate holiday inventory planning can lead to stockouts during the highest sales period or excess inventory after the season.",
  },
  {
    icon: Scale,
    title: "Miscalculating Size Tiers",
    description: "Incorrectly estimating your product's size tier can lead to unexpected FBA fees. Always measure the final packaged product dimensions and weight, not the product itself. A few inches or ounces can push your product into a higher tier with substantially higher fees.",
  },
  {
    icon: DollarSign,
    title: "Setting Unrealistic Prices",
    description: "Pricing products too low to gain sales velocity without proper cost analysis often results in losses. Conversely, pricing too high without adequate differentiation can lead to slow sales and storage fee accumulation. Use competitive analysis and cost-plus pricing to find the optimal balance between sales volume and profitability.",
  },
];

type SizeTier = "small" | "standard" | "oversize";

interface FBAInputs {
  productCost: number;
  sellingPrice: number;
  category: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  shippingToAmazon: number;
  currency: string;
  quantityPerMonth: number;
}

interface FBAResults {
  sizeTier: SizeTier;
  referralFee: number;
  fbaFee: number;
  storageFee: number;
  totalFees: number;
  profitPerUnit: number;
  profitMargin: number;
  roi: number;
  breakEvenPrice: number;
  monthlyProfit: number;
  monthlyRevenue: number;
  totalMonthlyFees: number;
}

function determineSizeTier(
  length: number,
  width: number,
  height: number,
  weight: number
): SizeTier {
  const longestSide = Math.max(length, width, height);
  const shortestSide = Math.min(length, width, height);
  const medianSide = [length, width, height].sort((a, b) => a - b)[1];

  if (
    longestSide <= 15 &&
    medianSide <= 12 &&
    shortestSide <= 0.75 &&
    weight <= 0.75
  ) {
    return "small";
  }

  if (
    longestSide <= 18 &&
    medianSide <= 14 &&
    shortestSide <= 8 &&
    weight <= 20
  ) {
    return "standard";
  }

  return "oversize";
}

function calculateStorageFee(
  length: number,
  width: number,
  height: number,
  isOversize: boolean
): number {
  const volume = (length * width * height) / 1728;

  const avgRate = isOversize
    ? (storageFeeRates.oversize.janSep * 9 + storageFeeRates.oversize.octDec * 3) / 12
    : (storageFeeRates.standard.janSep * 9 + storageFeeRates.standard.octDec * 3) / 12;

  return volume * avgRate;
}

export function FBACalculator() {
  const [inputs, setInputs] = useState<FBAInputs>({
    productCost: 10,
    sellingPrice: 29.99,
    category: "Other",
    weight: 1,
    length: 10,
    width: 8,
    height: 2,
    shippingToAmazon: 2,
    currency: "USD",
    quantityPerMonth: 100,
  });

  const [activeTab, setActiveTab] = useState("calculator");

  const results = useMemo<FBAResults>(() => {
    const sizeTier = determineSizeTier(
      inputs.length,
      inputs.width,
      inputs.height,
      inputs.weight
    );

    const referralRate = referralFeeRates[inputs.category] || 0.15;
    const referralFee = inputs.sellingPrice * referralRate;

    const fbaFeeRate = fbaFeeRates[inputs.category]?.[sizeTier] || fbaFeeRates.Other[sizeTier];
    const fbaFee = fbaFeeRate;

    const storageFee = calculateStorageFee(
      inputs.length,
      inputs.width,
      inputs.height,
      sizeTier === "oversize"
    );

    const totalFees = referralFee + fbaFee + storageFee;
    const totalCost = inputs.productCost + inputs.shippingToAmazon + totalFees;
    const profitPerUnit = inputs.sellingPrice - totalCost;
    const profitMargin = inputs.sellingPrice > 0 ? (profitPerUnit / inputs.sellingPrice) * 100 : 0;
    const roi = inputs.productCost > 0 ? (profitPerUnit / inputs.productCost) * 100 : 0;

    const breakEvenPrice = inputs.productCost + inputs.shippingToAmazon + (inputs.productCost + inputs.shippingToAmazon) * 0.15 / 0.85 + fbaFee;

    return {
      sizeTier,
      referralFee,
      fbaFee,
      storageFee,
      totalFees,
      profitPerUnit,
      profitMargin,
      roi,
      breakEvenPrice,
      monthlyProfit: profitPerUnit * inputs.quantityPerMonth,
      monthlyRevenue: inputs.sellingPrice * inputs.quantityPerMonth,
      totalMonthlyFees: totalFees * inputs.quantityPerMonth,
    };
  }, [inputs]);

  const updateInput = <K extends keyof FBAInputs>(field: K, value: FBAInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const resetInputs = () => {
    setInputs({
      productCost: 10,
      sellingPrice: 29.99,
      category: "Other",
      weight: 1,
      length: 10,
      width: 8,
      height: 2,
      shippingToAmazon: 2,
      currency: "USD",
      quantityPerMonth: 100,
    });
  };

  const formatMoney = (value: number) => formatCurrency(value, inputs.currency);

  // Chart data
  const feeBreakdownData = useMemo(() => [
    { name: "Referral Fee", value: results.referralFee, color: "var(--ocean)" },
    { name: "FBA Fee", value: results.fbaFee, color: "var(--logistics)" },
    { name: "Storage Fee", value: results.storageFee, color: "#f59e0b" },
  ], [results]);

  const marginAnalysisData = useMemo(() => [
    { name: "Product Cost", value: inputs.productCost, color: "#6b7280" },
    { name: "Shipping", value: inputs.shippingToAmazon, color: "#94a3b8" },
    { name: "Amazon Fees", value: results.totalFees, color: "var(--ocean)" },
    { name: "Profit", value: results.profitPerUnit, color: "var(--logistics)" },
  ], [inputs, results]);

  const storageProjectionData = useMemo(() => {
    const baseVolume = (inputs.length * inputs.width * inputs.height) / 1728;
    const isOversize = results.sizeTier === "oversize";
    const janSepRate = isOversize ? storageFeeRates.oversize.janSep : storageFeeRates.standard.janSep;
    const octDecRate = isOversize ? storageFeeRates.oversize.octDec : storageFeeRates.standard.octDec;

    return [
      { month: "Jan", fee: baseVolume * janSepRate, isPeak: false },
      { month: "Feb", fee: baseVolume * janSepRate, isPeak: false },
      { month: "Mar", fee: baseVolume * janSepRate, isPeak: false },
      { month: "Apr", fee: baseVolume * janSepRate, isPeak: false },
      { month: "May", fee: baseVolume * janSepRate, isPeak: false },
      { month: "Jun", fee: baseVolume * janSepRate, isPeak: false },
      { month: "Jul", fee: baseVolume * janSepRate, isPeak: false },
      { month: "Aug", fee: baseVolume * janSepRate, isPeak: false },
      { month: "Sep", fee: baseVolume * janSepRate, isPeak: false },
      { month: "Oct", fee: baseVolume * octDecRate, isPeak: true },
      { month: "Nov", fee: baseVolume * octDecRate, isPeak: true },
      { month: "Dec", fee: baseVolume * octDecRate, isPeak: true },
    ];
  }, [inputs, results.sizeTier]);

  // Profitability at different prices
  const profitabilityData = useMemo(() => {
    const basePrice = inputs.sellingPrice;
    const prices = [-20, -10, 0, 10, 20, 30].map(delta => basePrice + delta);
    
    return prices.map(price => {
      const referralFee = price * (referralFeeRates[inputs.category] || 0.15);
      const totalFees = referralFee + results.fbaFee + results.storageFee;
      const profit = price - inputs.productCost - inputs.shippingToAmazon - totalFees;
      const margin = price > 0 ? (profit / price) * 100 : 0;
      
      return {
        price: price.toFixed(2),
        profit: Math.max(0, profit),
        margin: margin,
      };
    });
  }, [inputs, results]);

  // Fee comparison data
  const feeComparisonData = useMemo(() => [
    { category: "Electronics", referral: 8, fba: results.fbaFee },
    { category: "Apparel", referral: 17, fba: results.fbaFee },
    { category: "Home & Kitchen", referral: 15, fba: results.fbaFee },
    { category: "Beauty", referral: 8, fba: results.fbaFee },
    { category: "Books", referral: 15, fba: results.fbaFee * 0.8 },
  ], [results.fbaFee]);

  // Export functionality
  const handleExport = () => {
    const data = {
      product: {
        category: inputs.category,
        dimensions: `${inputs.length}" x ${inputs.width}" x ${inputs.height}"`,
        weight: `${inputs.weight} lbs`,
        sizeTier: results.sizeTier,
      },
      costs: {
        productCost: inputs.productCost,
        shippingToAmazon: inputs.shippingToAmazon,
        sellingPrice: inputs.sellingPrice,
      },
      fees: {
        referralFee: results.referralFee,
        fbaFee: results.fbaFee,
        storageFee: results.storageFee,
        totalFees: results.totalFees,
      },
      results: {
        profitPerUnit: results.profitPerUnit,
        profitMargin: results.profitMargin,
        roi: results.roi,
        monthlyProfit: results.monthlyProfit,
      },
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fba-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: "FBA Profitability Analysis",
      text: `Profit: ${formatMoney(results.profitPerUnit)} per unit | Margin: ${results.profitMargin.toFixed(1)}% | ROI: ${results.roi.toFixed(1)}%`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(
        `FBA Analysis: Profit ${formatMoney(results.profitPerUnit)}/unit, ${results.profitMargin.toFixed(1)}% margin, ${results.roi.toFixed(1)}% ROI - ${window.location.href}`
      );
      alert("Analysis copied to clipboard!");
    }
  };

  // Animated badge variants
  const badgeVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Animated Badges */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-2 border-[var(--ocean)]/20">
          {/* Background gradient with CSS variables */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5" />

          <CardContent className="relative p-8">
            {/* Animated Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {["Amazon FBA", "Profit Calculator", "E-Commerce"].map((badge, i) => (
                <motion.div
                  key={badge}
                  custom={i}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                  >
                    <Badge
                      className="px-4 py-2 text-sm font-medium gap-2"
                      style={{
                        backgroundColor: i === 0 ? "rgba(var(--ocean-rgb), 0.1)" : 
                                        i === 1 ? "rgba(var(--logistics-rgb), 0.1)" : 
                                        "rgba(var(--ocean-rgb), 0.05)",
                        color: i === 0 ? "var(--ocean)" : 
                               i === 1 ? "var(--logistics)" : 
                               "var(--ocean)",
                        border: `1px solid ${i === 0 ? "rgba(var(--ocean-rgb), 0.2)" : 
                                            i === 1 ? "rgba(var(--logistics-rgb), 0.2)" : 
                                            "rgba(var(--ocean-rgb), 0.15)"}`
                      }}
                    >
                      {i === 0 && <Package className="h-4 w-4" />}
                      {i === 1 && <Calculator className="h-4 w-4" />}
                      {i === 2 && <Sparkles className="h-4 w-4" />}
                      {badge}
                    </Badge>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Title and Description */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--ocean)" }}>
                FBA Profitability Calculator
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Calculate your Amazon FBA fees, profit margins, and ROI with precision.
                Understand the true cost of selling on Amazon and optimize your pricing strategy.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button variant="outline" className="gap-2" onClick={resetInputs}>
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Key Metrics Display Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--ocean)]/5 border border-[var(--ocean)]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(var(--ocean-rgb), 0.1)" }}>
                    <DollarSign className="h-5 w-5" style={{ color: "var(--ocean)" }} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Total FBA Fees</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--ocean)" }}>
                  {formatMoney(results.totalFees)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Per unit sold
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-[var(--logistics)]/10 to-[var(--logistics)]/5 border border-[var(--logistics)]/20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(var(--logistics-rgb), 0.1)" }}>
                    <Target className="h-5 w-5" style={{ color: "var(--logistics)" }} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Referral Fee</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--logistics)" }}>
                  {formatMoney(results.referralFee)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(referralFeeRates[inputs.category] * 100).toFixed(0)}% of sale price
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border ${
                  results.profitPerUnit >= 0
                    ? "bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
                    : "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    results.profitPerUnit >= 0 ? "bg-green-500/10" : "bg-red-500/10"
                  }`}>
                    {results.profitPerUnit >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Net Profit</span>
                </div>
                <div className={`text-2xl font-bold ${
                  results.profitPerUnit >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {formatMoney(results.profitPerUnit)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {results.profitMargin.toFixed(1)}% margin
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="fees" className="flex items-center gap-2 py-3">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Fees</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" style={{ color: "var(--ocean)" }} />
                    Product Details
                  </CardTitle>
                  <CardDescription>
                    Enter your product information to calculate FBA profitability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category & Currency */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Category</Label>
                      <Select
                        value={inputs.category}
                        onValueChange={(v) => updateInput("category", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(referralFeeRates).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={inputs.currency}
                        onValueChange={(v) => updateInput("currency", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productCost">Product Cost (per unit)</Label>
                      <Input
                        id="productCost"
                        type="number"
                        value={inputs.productCost}
                        onChange={(e) => updateInput("productCost", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">Selling Price</Label>
                      <Input
                        id="sellingPrice"
                        type="number"
                        value={inputs.sellingPrice}
                        onChange={(e) => updateInput("sellingPrice", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingToAmazon">Shipping to Amazon (per unit)</Label>
                    <Input
                      id="shippingToAmazon"
                      type="number"
                      value={inputs.shippingToAmazon}
                      onChange={(e) => updateInput("shippingToAmazon", parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dimensions & Weight</CardTitle>
                  <CardDescription>
                    Product dimensions in inches and weight in lbs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="length">L (in)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={inputs.length}
                        onChange={(e) => updateInput("length", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">W (in)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={inputs.width}
                        onChange={(e) => updateInput("width", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">H (in)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={inputs.height}
                        onChange={(e) => updateInput("height", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Wt (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={inputs.weight}
                        onChange={(e) => updateInput("weight", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Size Tier:</span>
                    <Badge
                      variant={
                        results.sizeTier === "small"
                          ? "default"
                          : results.sizeTier === "standard"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {results.sizeTier.charAt(0).toUpperCase() + results.sizeTier.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sales Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="quantityPerMonth">Units Sold per Month</Label>
                    <Input
                      id="quantityPerMonth"
                      type="number"
                      value={inputs.quantityPerMonth}
                      onChange={(e) => updateInput("quantityPerMonth", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Main Results */}
              <Card className="border-2" style={{ borderColor: "rgba(var(--ocean-rgb), 0.2)" }}>
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" style={{ color: "var(--ocean)" }} />
                    Profitability Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Profit Per Unit */}
                  <motion.div
                    key={results.profitPerUnit}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-6 rounded-xl"
                    style={{
                      backgroundColor:
                        results.profitPerUnit >= 0
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                    }}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Profit Per Unit</div>
                    <div
                      className="text-4xl font-bold"
                      style={{
                        color: results.profitPerUnit >= 0 ? "var(--logistics)" : "#ef4444",
                      }}
                    >
                      {formatMoney(results.profitPerUnit)}
                    </div>
                  </motion.div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">Profit Margin</div>
                      <div
                        className="text-2xl font-bold"
                        style={{
                          color: results.profitMargin >= 20 ? "var(--logistics)" : results.profitMargin >= 10 ? "#f59e0b" : "#ef4444",
                        }}
                      >
                        {results.profitMargin.toFixed(1)}%
                      </div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-sm text-muted-foreground">ROI</div>
                      <div
                        className="text-2xl font-bold"
                        style={{
                          color: results.roi >= 50 ? "var(--logistics)" : results.roi >= 25 ? "#f59e0b" : "#ef4444",
                        }}
                      >
                        {results.roi.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Fee Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Referral Fee ({(referralFeeRates[inputs.category] * 100).toFixed(0)}%)</span>
                        <span className="font-medium">{formatMoney(results.referralFee)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">FBA Fulfillment Fee</span>
                        <span className="font-medium">{formatMoney(results.fbaFee)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Storage Fee</span>
                        <span className="font-medium">{formatMoney(results.storageFee)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total Amazon Fees</span>
                        <span style={{ color: "var(--ocean)" }}>{formatMoney(results.totalFees)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Projection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Projection</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Revenue</div>
                      <div className="text-xl font-bold">{formatMoney(results.monthlyRevenue)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Amazon Fees</div>
                      <div className="text-xl font-bold" style={{ color: "var(--ocean)" }}>{formatMoney(results.totalMonthlyFees)}</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "rgba(var(--logistics-rgb), 0.1)", borderColor: "rgba(var(--logistics-rgb), 0.2)" }}>
                    <div className="text-xs text-muted-foreground mb-1">Net Profit</div>
                    <div className="text-2xl font-bold" style={{ color: "var(--logistics)" }}>
                      {formatMoney(results.monthlyProfit)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {results.profitMargin < 15 && (
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        <p className="font-semibold mb-1">Low Profit Margin</p>
                        <p>
                          Your profit margin is below 15%. Consider increasing your selling price
                          or finding ways to reduce costs. Break-even price: {formatMoney(results.breakEvenPrice)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Export/Share Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export Analysis
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share Results
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          {/* Profit breakdown and margin analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Profit Margin Analysis</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Profitability analysis is the cornerstone of successful Amazon selling. It involves
                understanding all cost components and how they interact with your pricing strategy
                to determine your actual profit margin. Many sellers focus solely on the difference
                between wholesale cost and selling price, overlooking the significant impact of Amazon&apos;s
                various fees on their bottom line. A comprehensive profitability analysis examines
                product costs, shipping expenses, Amazon fees, advertising costs, and returns rates.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Profit margin and Return on Investment (ROI) are two key metrics that serve different
                purposes. Profit margin measures profitability as a percentage of revenue, indicating
                how much of each dollar of sales translates to profit. A healthy profit margin for
                Amazon sellers typically ranges from 15% to 30%, though this varies by category and
                business model. ROI measures the return relative to your investment, helping you
                compare the efficiency of different products or investment opportunities. A good
                ROI target for Amazon FBA is typically 50% or higher.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Profit Margin Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost vs Profit Distribution</CardTitle>
                <CardDescription>
                  Visual breakdown of your selling price allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: "Costs", value: inputs.productCost + inputs.shippingToAmazon + results.totalFees, type: "cost" },
                      { name: "Profit", value: Math.max(0, results.profitPerUnit), type: "profit" },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-muted-foreground" />
                      <YAxis tickFormatter={(v) => `$${v}`} className="text-muted-foreground" />
                      <Tooltip formatter={(value: number) => formatMoney(value)} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <Cell fill="#ef4444" />
                        <Cell fill="var(--logistics)" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-muted-foreground">Total Costs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--logistics)" }} />
                    <span className="text-sm text-muted-foreground">Profit</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profitability at Different Prices Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profitability at Different Prices</CardTitle>
                <CardDescription>
                  How profit changes with price adjustments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={profitabilityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="price" label={{ value: "Price ($)", position: "bottom", offset: -5 }} className="text-muted-foreground" />
                      <YAxis tickFormatter={(v) => `$${v.toFixed(0)}`} className="text-muted-foreground" />
                      <Tooltip formatter={(value: number, name: string) => [name === "profit" ? formatMoney(value) : `${value.toFixed(1)}%`, name === "profit" ? "Profit" : "Margin"]} />
                      <Legend />
                      <Line type="monotone" dataKey="profit" stroke="var(--logistics)" strokeWidth={3} dot={{ fill: "var(--logistics)", strokeWidth: 2 }} name="Profit" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Storage Fee Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Storage Fee Projections</CardTitle>
              <CardDescription>
                Monthly storage costs throughout the year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={storageProjectionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis tickFormatter={(v) => `$${v.toFixed(2)}`} className="text-muted-foreground" />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Area
                      type="monotone"
                      dataKey="fee"
                      stroke="var(--ocean)"
                      fill="var(--ocean)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                  <Clock className="h-4 w-4" />
                  Peak season (Oct-Dec) rates are significantly higher
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Dashboard */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(var(--ocean-rgb), 0.1)" }}>
                    <DollarSign className="h-5 w-5" style={{ color: "var(--ocean)" }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Break-even Price</div>
                    <div className="text-xl font-bold">{formatMoney(results.breakEvenPrice)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Annual Profit</div>
                    <div className="text-xl font-bold text-green-600">{formatMoney(results.monthlyProfit * 12)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(var(--ocean-rgb), 0.1)" }}>
                    <Scale className="h-5 w-5" style={{ color: "var(--ocean)" }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Fee Percentage</div>
                    <div className="text-xl font-bold" style={{ color: "var(--ocean)" }}>
                      {((results.totalFees / inputs.sellingPrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(var(--logistics-rgb), 0.1)" }}>
                    <Target className="h-5 w-5" style={{ color: "var(--logistics)" }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Cost Ratio</div>
                    <div className="text-xl font-bold" style={{ color: "var(--logistics)" }}>
                      {((inputs.productCost / inputs.sellingPrice) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Fees */}
        <TabsContent value="fees" className="space-y-6">
          {/* Educational Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">FBA Fee Structure</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Amazon FBA (Fulfillment by Amazon) fees represent the costs associated with using Amazon&apos;s
                fulfillment network to store, pick, pack, and ship your products to customers. Understanding
                these fees is crucial for maintaining profitability on the Amazon marketplace. FBA fees are
                divided into several categories, each serving a specific purpose in the fulfillment process.
                The primary fee categories include referral fees, fulfillment fees, and storage fees, each
                calculated differently based on product characteristics and time factors.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The referral fee is a percentage of the total sales price that Amazon charges for facilitating
                the sale on their platform. This fee varies by category, ranging from 8% for consumer electronics
                to 17% for apparel items. The referral fee is automatically deducted from your sales proceeds
                before payment is issued. Understanding category-specific referral rates helps you select the
                most appropriate product category during listing creation, as miscategorization can lead to
                higher fees or account issues.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pie Chart - Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fee Breakdown Visualization</CardTitle>
                <CardDescription>
                  Visual representation of your FBA fee distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={feeBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {feeBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatMoney(value)}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart - Fee Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Fee Comparison</CardTitle>
                <CardDescription>
                  Referral fee rates across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feeComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(v) => `${v}%`} className="text-muted-foreground" />
                      <YAxis dataKey="category" type="category" width={100} className="text-muted-foreground" />
                      <Tooltip formatter={(value: number, name: string) => [name === "referral" ? `${value}%` : formatMoney(value), name === "referral" ? "Referral %" : "FBA Fee"]} />
                      <Bar dataKey="referral" fill="var(--ocean)" radius={[0, 4, 4, 0]} name="referral" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fee Explanations */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" style={{ color: "var(--ocean)" }} />
                  Referral Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Amazon charges a referral fee on each item sold. This is a percentage of the
                  total sales price (including gift wrap but excluding taxes). The minimum referral
                  fee is $0.30 for most categories, regardless of the percentage calculation.
                </p>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Your Rate</div>
                  <div className="text-lg font-semibold" style={{ color: "var(--ocean)" }}>
                    {(referralFeeRates[inputs.category] * 100).toFixed(0)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" style={{ color: "var(--logistics)" }} />
                  Fulfillment Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  FBA fulfillment fees cover picking, packing, shipping, and customer service.
                  These fees are based on the size tier and weight of your product. Heavier and
                  larger items incur higher fees due to increased handling and shipping costs.
                </p>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Your Fee</div>
                  <div className="text-lg font-semibold" style={{ color: "var(--logistics)" }}>
                    {formatMoney(results.fbaFee)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-amber-500" />
                  Storage Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Monthly storage fees are charged based on the volume your inventory occupies
                  in Amazon&apos;s fulfillment centers. Rates increase during Q4 (Oct-Dec) peak season.
                  Long-term storage fees apply to items stored over 365 days.
                </p>
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-1">Monthly Avg</div>
                  <div className="text-lg font-semibold text-amber-600">
                    {formatMoney(results.storageFee)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Size Tier Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Size Tier Reference Table</CardTitle>
              <CardDescription>
                Complete classification guide for Amazon FBA product sizing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Size Tier</th>
                      <th className="text-left py-3 px-4 font-semibold">Longest Side</th>
                      <th className="text-left py-3 px-4 font-semibold">Median Side</th>
                      <th className="text-left py-3 px-4 font-semibold">Shortest Side</th>
                      <th className="text-left py-3 px-4 font-semibold">Max Weight</th>
                      <th className="text-left py-3 px-4 font-semibold">FBA Fee Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTiers.slice(0, 5).map((tier) => (
                      <tr
                        key={tier.name}
                        className={`border-b transition-colors ${
                          results.sizeTier === "small" && tier.name === "Small Standard" ||
                          results.sizeTier === "standard" && tier.name === "Large Standard" ||
                          results.sizeTier === "oversize" && (tier.name === "Small Oversize" || tier.name === "Medium Oversize" || tier.name === "Large Oversize")
                            ? "bg-[var(--ocean)]/10"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <Badge style={{ backgroundColor: `${tier.color}20`, color: tier.color }}>
                            {tier.name}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{tier.longestSide ? `≤ ${tier.longestSide}"` : "Any"}</td>
                        <td className="py-3 px-4">{tier.medianSide ? `≤ ${tier.medianSide}"` : "Any"}</td>
                        <td className="py-3 px-4">{tier.shortestSide ? `≤ ${tier.shortestSide}"` : "Any"}</td>
                        <td className="py-3 px-4">
                          {tier.weight ? `≤ ${tier.weight} ${tier.weightUnit}` : "Custom"}
                        </td>
                        <td className="py-3 px-4 font-medium">{tier.fbaFeeRange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6">
          {/* Understanding Amazon FBA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Package className="h-5 w-5" style={{ color: "var(--ocean)" }} />
                Understanding Amazon FBA
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Amazon FBA (Fulfillment by Amazon) is a service that allows sellers to store their products in Amazon&apos;s fulfillment centers. When a customer places an order, Amazon handles the picking, packing, shipping, and customer service for those products. This comprehensive fulfillment solution has revolutionized e-commerce by enabling businesses of all sizes to leverage Amazon&apos;s world-class logistics infrastructure without the need for their own warehouses or fulfillment teams. FBA provides sellers with access to Amazon Prime&apos;s fast shipping benefits, which can significantly increase conversion rates and sales velocity.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The FBA program offers several key advantages for sellers. First, Prime eligibility means your products display the Prime badge, making them more attractive to Amazon&apos;s millions of Prime members who tend to spend more and convert at higher rates. Second, Amazon handles all customer service inquiries and returns, saving sellers considerable time and resources. Third, FBA products are eligible for Amazon&apos;s trusted customer service and A-to-z Guarantee protection, which builds customer confidence. Fourth, Amazon&apos;s fulfillment network enables fast, reliable shipping to customers worldwide, with multiple shipping options and delivery speeds.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                However, FBA also comes with costs and considerations that sellers must understand. Amazon charges various fees for storage, fulfillment, and referral services. These fees can significantly impact profit margins, especially for low-priced items or products with slow turnover. Additionally, sellers must carefully manage inventory levels to avoid long-term storage fees while maintaining sufficient stock to meet demand. Understanding the fee structure and optimizing your FBA strategy is essential for building a profitable Amazon business.
              </p>
            </CardContent>
          </Card>

          {/* FBA Fee Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5" style={{ color: "var(--logistics)" }} />
                FBA Fee Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Amazon&apos;s FBA fee structure consists of three main components: referral fees, fulfillment fees, and storage fees. Each component is calculated differently and serves a specific purpose in Amazon&apos;s business model. Understanding how each fee is calculated and what factors influence it is crucial for accurate profit projections and pricing decisions. Sellers must account for all these fees when determining product viability and setting competitive prices.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Referral fees are percentage-based charges that Amazon applies to each sale, ranging from 8% to 17% depending on the product category. For example, consumer electronics typically have an 8% referral rate, while apparel carries a 17% rate. These fees are calculated based on the total sales price, including any gift-wrapping charges but excluding taxes collected. There&apos;s typically a minimum referral fee of $0.30 per item, which ensures Amazon receives at least some compensation even for very low-priced items. Sellers should carefully consider category selection during listing creation, as the correct category ensures you&apos;re charged the appropriate rate.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Fulfillment fees cover the cost of picking, packing, and shipping your products to customers, plus customer service and returns handling. These fees are primarily determined by your product&apos;s size tier and weight. Amazon classifies products into several size tiers: Small Standard-Size, Large Standard-Size, Small Oversize, Medium Oversize, Large Oversize, and Special Oversize. Each tier has different fee ranges, with smaller, lighter products incurring lower fees. The dimensional weight calculation may also apply, where Amazon charges based on volume rather than actual weight if the dimensional weight exceeds the actual weight.
              </p>
            </CardContent>
          </Card>

          {/* Profitability Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                Profitability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Accurate profitability analysis requires accounting for all costs associated with selling on Amazon through FBA. Beyond the obvious product cost and Amazon fees, sellers must consider shipping costs to Amazon warehouses, advertising expenses, return rates, and potential long-term storage fees. Many new sellers underestimate these costs, leading to inaccurate profit projections and potentially unprofitable product selections. A comprehensive profit calculation should include every expense from sourcing to final sale.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Profit margin and ROI are two critical metrics for evaluating product performance. Profit margin, calculated as (Revenue - All Costs) / Revenue, tells you what percentage of your selling price translates to actual profit. A healthy profit margin for Amazon FBA typically ranges from 15% to 30%, though this varies by category and business model. ROI, or Return on Investment, measures the return relative to your initial investment and is calculated as Net Profit / Investment Cost. Many successful Amazon sellers target an ROI of 50% or higher, which accounts for the time value of money and business risk.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Break-even analysis helps sellers understand the minimum price at which a product can be sold without incurring losses. This calculation must include all variable costs: product cost, inbound shipping, referral fees, FBA fulfillment fees, and estimated storage fees per unit. Knowing your break-even price allows you to set minimum price floors and make informed decisions about promotions, advertising spend, and competitive pricing strategies. Regular profitability analysis enables you to identify underperforming products and optimize your product mix for maximum returns.
              </p>
            </CardContent>
          </Card>

          {/* FBA vs FBM Decision */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Truck className="h-5 w-5" style={{ color: "var(--ocean)" }} />
                FBA vs FBM Decision
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The choice between Fulfillment by Amazon (FBA) and Fulfillment by Merchant (FBM) significantly impacts your Amazon business operations and profitability. FBA offers Prime eligibility, Amazon&apos;s trusted customer service, and access to Amazon&apos;s extensive fulfillment network. FBM provides greater control over the fulfillment process, no storage fees, and potentially lower costs for certain product types. The optimal choice depends on your product characteristics, sales volume, operational capabilities, and business goals.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                FBA is generally the better choice for products that benefit from Prime eligibility and fast shipping. These include competitive products where Prime status can differentiate your listing, items with consistent sales velocity that warrant storage in Amazon&apos;s warehouses, and products where the convenience of Amazon handling customer service and returns adds significant value. FBA is also advantageous for sellers who lack their own fulfillment infrastructure or want to focus on product sourcing and marketing rather than logistics.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                FBM may be more cost-effective for certain product types and situations. Heavy or oversized items often incur substantial FBA fees that make FBM more economical. Products with low sales velocity can accumulate storage fees in FBA that erode profit margins. Items that require special handling or custom packaging may be better fulfilled directly by the seller. Many successful Amazon businesses use a hybrid approach, utilizing FBA for fast-moving, Prime-eligible products while using FBM for slow-moving, oversized, or specialized items. Regular analysis of fulfillment costs by product helps optimize this mix over time.
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips & Best Practices
              </CardTitle>
              <CardDescription>
                Expert strategies to maximize your FBA profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {proTips.map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-gradient-to-br from-muted/50 to-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: "rgba(var(--ocean-rgb), 0.1)" }}>
                        <tip.icon className="h-5 w-5" style={{ color: "var(--ocean)" }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>
                Learn from common pitfalls that hurt FBA sellers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {commonMistakes.map((mistake, index) => (
                <motion.div
                  key={mistake.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20"
                >
                  <div className="flex items-start gap-3">
                    <mistake.icon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-400 mb-1">{mistake.title}</h4>
                      <p className="text-sm text-muted-foreground">{mistake.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Everything you need to know about Amazon FBA fees and profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="q1" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 shrink-0" style={{ color: "var(--ocean)" }} />
                      <span>What is the difference between FBA fees and referral fees?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    <p className="leading-relaxed">
                      FBA fees and referral fees serve different purposes in the Amazon marketplace ecosystem.
                      Referral fees are percentages of your sale price that Amazon charges for the privilege
                      of selling on their platform - essentially a commission for using their customer base
                      and marketplace infrastructure. These fees typically range from 8% to 17% depending on
                      the product category. FBA fees, on the other hand, are charges specifically for using
                      Amazon&apos;s fulfillment services. These cover the costs of storing your inventory in
                      Amazon warehouses, picking and packing orders, and shipping products to customers. FBA
                      fees are calculated based on your product&apos;s size and weight, not its price. Understanding
                      both fee types is essential for accurate profit calculations and pricing strategy.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q2" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 shrink-0" style={{ color: "var(--logistics)" }} />
                      <span>How can I reduce my Amazon FBA storage fees?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    <p className="leading-relaxed">
                      Reducing FBA storage fees requires a multi-faceted approach to inventory management.
                      First, optimize your inventory levels by using sales forecasting tools to avoid
                      overstocking. Amazon charges storage fees based on the volume your products occupy,
                      so keeping only necessary stock on hand directly reduces costs. Second, pay attention
                      to inventory turnover rates - products that sit in warehouses for extended periods
                      not only incur monthly storage fees but also risk long-term storage fees after 365 days.
                      Third, consider seasonal products carefully; storing seasonal items year-round can
                      be expensive. Fourth, use the FBA Revenue Calculator before sending inventory to
                      ensure the product will be profitable after all fees. Fifth, monitor your inventory
                      age report regularly and create removal orders for slow-moving items before they
                      become subject to long-term storage fees. Finally, consider using Fulfillment by
                      Merchant (FBM) for slow-moving or oversized items that might be more cost-effective
                      to ship yourself.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q3" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 shrink-0 text-amber-500" />
                      <span>What is a good profit margin for Amazon FBA sellers?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    <p className="leading-relaxed">
                      A healthy profit margin for Amazon FBA sellers typically ranges from 15% to 30%,
                      though this varies significantly by product category, competition level, and
                      business model. New sellers often aim for at least 20% profit margin to ensure
                      sustainability and room for growth. Categories with higher competition may see
                      lower average margins (10-15%), while niche products or private label brands can
                      achieve margins above 30%. It&apos;s important to remember that profit margin should
                      be considered alongside other metrics. A product with a 15% margin but high sales
                      volume might be more profitable than a 40% margin product with few sales. Similarly,
                      consider your Return on Investment (ROI) - many successful FBA sellers target 50%
                      or higher ROI. When calculating margins, always account for all costs: product cost,
                      shipping to Amazon, FBA fees, referral fees, advertising costs, returns, and any
                      other expenses specific to your business. The margin you target should also factor
                      in your ability to absorb unexpected costs like fee increases or return spikes.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q4" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 shrink-0" style={{ color: "var(--ocean)" }} />
                      <span>How does Amazon determine my product&apos;s size tier?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    <p className="leading-relaxed">
                      Amazon determines your product&apos;s size tier through a specific measurement and
                      classification process. First, Amazon measures your product in its ready-to-ship
                      packaging, not the product itself. They identify the longest, median, and shortest
                      sides of the package, and weigh it in pounds. For Small Standard-Size classification,
                      the product must meet strict criteria: longest side ≤ 15 inches, median side ≤ 12
                      inches, shortest side ≤ 0.75 inches, and weight ≤ 12 ounces. Large Standard-Size
                      products have more relaxed limits: longest side ≤ 18 inches, median side ≤ 14 inches,
                      shortest side ≤ 8 inches, and weight ≤ 20 pounds. Products exceeding these limits
                      fall into Oversize categories, which have sub-tiers (Small Oversize, Medium Oversize,
                      Large Oversize, Special Oversize) based on dimensional and weight thresholds. The
                      dimensional weight calculation may also apply - if your product&apos;s dimensional weight
                      (volume ÷ 139) exceeds its actual weight, Amazon may use dimensional weight for fee
                      calculations. Proper packaging design can sometimes help products qualify for lower
                      size tiers, directly impacting your bottom line.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q5" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 shrink-0" style={{ color: "var(--logistics)" }} />
                      <span>What are the peak season storage fees and when do they apply?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    <p className="leading-relaxed">
                      Peak season storage fees are higher rates that Amazon charges during the fourth
                      quarter (October through December) to account for increased warehouse demand during
                      the holiday shopping season. These fees can be significantly higher than standard
                      rates - for Standard-Size items, the monthly storage fee increases from $0.87 per
                      cubic foot to $2.40 per cubic foot during peak months. For Oversize items, rates
                      increase from $0.56 to $1.40 per cubic foot. The minimum fee also increases during
                      peak season. Understanding these fees is crucial for inventory planning. Sellers
                      should carefully manage their Q4 inventory levels, sending only what they anticipate
                      selling during the holiday rush. Overstocking during peak season can be particularly
                      costly due to these elevated rates. Additionally, products that don&apos;t sell during
                      Q4 will continue incurring higher storage fees until January when standard rates
                      resume. Some sellers use strategies like promoting slow-moving inventory before
                      October or temporarily using FBM during peak season for certain products. Planning
                      your shipments to arrive in September (before peak fees begin) while ensuring
                      adequate stock for holiday sales is a common optimization strategy.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q6" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 shrink-0 text-amber-500" />
                      <span>Should I use FBA or FBM for my Amazon business?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    <p className="leading-relaxed">
                      The decision between Fulfillment by Amazon (FBA) and Fulfillment by Merchant (FBM)
                      depends on multiple factors specific to your business. FBA offers several advantages:
                      Prime eligibility, Amazon&apos;s trusted customer service, automatic handling of returns,
                      and potential for higher conversion rates due to Prime shipping. However, FBA fees
                      can significantly impact margins, especially for low-priced or heavy items. FBM,
                      on the other hand, gives you complete control over the fulfillment process, no
                      storage fees, and can be more cost-effective for certain products. FBM is often
                      better for very heavy or oversized items where FBA fees would be prohibitive,
                      products with low turnover rates that would accumulate storage fees, items that
                      require special handling or packaging, and sellers who already have efficient
                      fulfillment operations. Many successful sellers use a hybrid approach - FBA for
                      fast-moving products that benefit from Prime eligibility, and FBM for slow-movers,
                      oversize items, or products with thin margins. The best strategy often involves
                      analyzing each product&apos;s characteristics individually and choosing the fulfillment
                      method that optimizes profitability while meeting customer expectations.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q7" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 shrink-0" style={{ color: "var(--ocean)" }} />
                      <span>How do long-term storage fees work and how can I avoid them?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    <p className="leading-relaxed">
                      Long-term storage fees are additional charges that Amazon imposes on inventory that
                      has been stored in their fulfillment centers for more than 365 days. As of 2024,
                      the long-term storage fee is $6.90 per cubic foot or $0.15 per unit, whichever is
                      greater. This fee is assessed on the 15th of each month and applies to items that
                      have been in Amazon&apos;s warehouses for over a year. These fees can quickly erode
                      profits and turn slow-moving inventory into a significant liability. To avoid
                      long-term storage fees, implement proactive inventory management strategies.
                      First, use Amazon&apos;s Inventory Age report to monitor how long items have been in
                      storage. Set up automatic alerts for items approaching the 365-day threshold.
                      Second, consider running promotions, creating bundles, or using Amazon&apos;s outlet
                      deals to move aging inventory before it incurs long-term fees. Third, evaluate
                      whether removing items and disposing of or liquidating them would be more cost-effective
                      than paying ongoing fees. Fourth, for items that sell slowly but consistently,
                      consider FBM fulfillment to avoid storage time limits. Fifth, optimize your initial
                      order quantities - ordering less initially and restocking more frequently can prevent
                      overstock situations. Remember that long-term storage fees are in addition to regular
                      monthly storage fees, making aged inventory particularly expensive to maintain.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q8" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="h-5 w-5 shrink-0" style={{ color: "var(--logistics)" }} />
                      <span>What hidden costs should I consider when selling on Amazon FBA?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    <p className="leading-relaxed">
                      Beyond the obvious product cost and standard Amazon fees, several hidden costs can
                      significantly impact your profitability. First, advertising costs are essential for
                      most products - Amazon PPC campaigns typically consume 10-15% of sales revenue, and
                      competitive categories may require even higher ad spend. Second, return rates vary
                      by category but can range from 5% to over 30% for apparel. Returns not only reduce
                      revenue but may also incur return processing fees and result in unsellable inventory.
                      Third, inbound shipping costs to Amazon fulfillment centers are often underestimated.
                      Work with reliable freight forwarders and compare rates to minimize these costs.
                      Fourth, consider costs for product preparation, labeling, and packaging that meets
                      Amazon&apos;s requirements. Fifth, account for potential fee increases - Amazon regularly
                      adjusts FBA fees, so build buffer into your pricing. Sixth, consider inventory
                      holding costs beyond Amazon storage fees, including opportunity cost of capital
                      tied up in inventory. Seventh, factor in costs for tools and software for repricing,
                      inventory management, and analytics. Finally, don&apos;t forget taxes, business insurance,
                      and other general business expenses. A comprehensive understanding of all costs
                      enables accurate profit forecasting and sustainable pricing strategies.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
