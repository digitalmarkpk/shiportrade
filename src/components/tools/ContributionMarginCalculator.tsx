"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  ArrowRight,
  DollarSign,
  BarChart3,
  Target,
  Percent,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  RefreshCw,
  Layers,
  Award,
  Zap,
  BookOpen,
  HelpCircle,
  Lightbulb,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  BarChart2,
  Sparkles,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { currencies, formatCurrency, Currency } from "@/lib/constants/currencies";
import { cn } from "@/lib/utils";

// Types
interface SKU {
  id: string;
  name: string;
  revenue: number;
  cogs: number;
  shipping: number;
  platformFees: number;
  paymentFees: number;
  otherVariableCosts: number;
  fixedCosts: number;
  unitsSold: number;
  sellingPrice: number;
}

interface SKUAnalysis {
  id: string;
  name: string;
  revenue: number;
  totalVariableCosts: number;
  contributionMargin: number;
  contributionMarginRatio: number;
  breakEvenUnits: number;
  unitsSold: number;
  profitability: "high" | "medium" | "low" | "negative";
  fixedCosts: number;
  sellingPrice: number;
  unitContributionMargin: number;
}

interface ScenarioData {
  name: string;
  revenueChange: number;
  costChange: number;
  projectedMargin: number;
  projectedRatio: number;
}

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#10B981",
  purple: "#8B5CF6",
  pink: "#EC4899",
  cyan: "#06B6D4",
};

// Animated badge variants
const badgeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Default SKU template
const createDefaultSKU = (): SKU => ({
  id: generateId(),
  name: "",
  revenue: 0,
  cogs: 0,
  shipping: 0,
  platformFees: 0,
  paymentFees: 0,
  otherVariableCosts: 0,
  fixedCosts: 0,
  unitsSold: 0,
  sellingPrice: 0,
});

// Sample SKU data
const sampleSKUs: SKU[] = [
  {
    id: generateId(),
    name: "Premium Widget A",
    revenue: 50000,
    cogs: 20000,
    shipping: 5000,
    platformFees: 2500,
    paymentFees: 1500,
    otherVariableCosts: 1000,
    fixedCosts: 8000,
    unitsSold: 1000,
    sellingPrice: 50,
  },
  {
    id: generateId(),
    name: "Standard Widget B",
    revenue: 35000,
    cogs: 18000,
    shipping: 4000,
    platformFees: 1750,
    paymentFees: 1050,
    otherVariableCosts: 700,
    fixedCosts: 5000,
    unitsSold: 700,
    sellingPrice: 50,
  },
  {
    id: generateId(),
    name: "Economy Widget C",
    revenue: 20000,
    cogs: 12000,
    shipping: 3000,
    platformFees: 1000,
    paymentFees: 600,
    otherVariableCosts: 400,
    fixedCosts: 3000,
    unitsSold: 500,
    sellingPrice: 40,
  },
];

// Calculate analysis for a single SKU
function analyzeSKU(sku: SKU): SKUAnalysis {
  const totalVariableCosts = sku.cogs + sku.shipping + sku.platformFees + sku.paymentFees + sku.otherVariableCosts;
  const contributionMargin = sku.revenue - totalVariableCosts;
  const contributionMarginRatio = sku.revenue > 0 ? (contributionMargin / sku.revenue) * 100 : 0;
  const unitContributionMargin = sku.unitsSold > 0 ? contributionMargin / sku.unitsSold : 0;
  const breakEvenUnits = unitContributionMargin > 0 ? Math.ceil(sku.fixedCosts / unitContributionMargin) : 0;

  let profitability: "high" | "medium" | "low" | "negative";
  if (contributionMarginRatio < 0) {
    profitability = "negative";
  } else if (contributionMarginRatio < 15) {
    profitability = "low";
  } else if (contributionMarginRatio < 30) {
    profitability = "medium";
  } else {
    profitability = "high";
  }

  return {
    id: sku.id,
    name: sku.name || "Unnamed SKU",
    revenue: sku.revenue,
    totalVariableCosts,
    contributionMargin,
    contributionMarginRatio,
    breakEvenUnits,
    unitsSold: sku.unitsSold,
    profitability,
    fixedCosts: sku.fixedCosts,
    sellingPrice: sku.sellingPrice,
    unitContributionMargin,
  };
}

export function ContributionMarginCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState<Currency>(currencies.find(c => c.code === "USD") || currencies[0]);
  const [skus, setSKUs] = useState<SKU[]>(sampleSKUs);
  const [copied, setCopied] = useState(false);
  const [scenarioRevenueChange, setScenarioRevenueChange] = useState(0);
  const [scenarioCostChange, setScenarioCostChange] = useState(0);

  // Analyze all SKUs
  const analyses = useMemo(() => skus.map(analyzeSKU), [skus]);

  // Aggregate metrics
  const aggregateMetrics = useMemo(() => {
    const totalRevenue = analyses.reduce((sum, a) => sum + a.revenue, 0);
    const totalVariableCosts = analyses.reduce((sum, a) => sum + a.totalVariableCosts, 0);
    const totalContributionMargin = analyses.reduce((sum, a) => sum + a.contributionMargin, 0);
    const totalFixedCosts = analyses.reduce((sum, a) => sum + a.fixedCosts, 0);
    const totalUnits = analyses.reduce((sum, a) => sum + a.unitsSold, 0);
    const averageMarginRatio = totalRevenue > 0 ? (totalContributionMargin / totalRevenue) * 100 : 0;
    const netProfit = totalContributionMargin - totalFixedCosts;

    return {
      totalRevenue,
      totalVariableCosts,
      totalContributionMargin,
      totalFixedCosts,
      totalUnits,
      averageMarginRatio,
      netProfit,
    };
  }, [analyses]);

  // Ranked SKUs by profitability
  const rankedSKUs = useMemo(() => {
    return [...analyses].sort((a, b) => b.contributionMargin - a.contributionMargin);
  }, [analyses]);

  // Margin comparison chart data
  const marginComparisonData = useMemo(() => {
    return analyses.map(a => ({
      name: a.name.length > 15 ? a.name.substring(0, 15) + "..." : a.name,
      fullName: a.name,
      revenue: a.revenue,
      variableCosts: a.totalVariableCosts,
      contributionMargin: a.contributionMargin,
      marginRatio: a.contributionMarginRatio,
    }));
  }, [analyses]);

  // Waterfall chart data
  const waterfallData = useMemo(() => {
    const data: Array<{ name: string; value: number; type: string; cumulative: number }> = [];
    let cumulative = 0;

    data.push({ name: "Revenue", value: aggregateMetrics.totalRevenue, type: "positive", cumulative: aggregateMetrics.totalRevenue });
    cumulative = aggregateMetrics.totalRevenue;

    const variableCostCategories = [
      { name: "COGS", value: skus.reduce((sum, s) => sum + s.cogs, 0) },
      { name: "Shipping", value: skus.reduce((sum, s) => sum + s.shipping, 0) },
      { name: "Platform Fees", value: skus.reduce((sum, s) => sum + s.platformFees, 0) },
      { name: "Payment Fees", value: skus.reduce((sum, s) => sum + s.paymentFees, 0) },
      { name: "Other Costs", value: skus.reduce((sum, s) => sum + s.otherVariableCosts, 0) },
    ];

    variableCostCategories.forEach(cat => {
      cumulative -= cat.value;
      data.push({ name: cat.name, value: -cat.value, type: "negative", cumulative });
    });

    data.push({ name: "Contribution", value: aggregateMetrics.totalContributionMargin, type: "total", cumulative: aggregateMetrics.totalContributionMargin });
    cumulative -= aggregateMetrics.totalFixedCosts;
    data.push({ name: "Fixed Costs", value: -aggregateMetrics.totalFixedCosts, type: "negative", cumulative });
    data.push({ name: "Net Profit", value: aggregateMetrics.netProfit, type: aggregateMetrics.netProfit >= 0 ? "positive" : "negative", cumulative: aggregateMetrics.netProfit });

    return data;
  }, [aggregateMetrics, skus]);

  // Product mix optimization
  const productMixOptimization = useMemo(() => {
    const highMargin = analyses.filter(a => a.profitability === "high");
    const mediumMargin = analyses.filter(a => a.profitability === "medium");
    const lowMargin = analyses.filter(a => a.profitability === "low");
    const negativeMargin = analyses.filter(a => a.profitability === "negative");

    const recommendations: string[] = [];

    if (negativeMargin.length > 0) {
      recommendations.push(`Discontinue or reprice ${negativeMargin.length} negative margin SKU(s): ${negativeMargin.map(s => s.name).join(", ")}`);
    }

    if (lowMargin.length > 0) {
      recommendations.push(`Review pricing strategy for ${lowMargin.length} low margin SKU(s) to improve profitability`);
    }

    if (highMargin.length > 0) {
      recommendations.push(`Focus marketing efforts on high-margin SKUs: ${highMargin.map(s => s.name).join(", ")}`);
    }

    const optimalMix = analyses.map(a => ({
      ...a,
      recommendedUnits: a.profitability === "high" ? Math.ceil(a.unitsSold * 1.5) : 
                        a.profitability === "negative" ? 0 : 
                        a.unitsSold,
      potentialMargin: a.profitability === "high" ? a.unitContributionMargin * Math.ceil(a.unitsSold * 1.5) : 
                       a.profitability === "negative" ? 0 : 
                       a.contributionMargin,
    }));

    return {
      highMargin: highMargin.length,
      mediumMargin: mediumMargin.length,
      lowMargin: lowMargin.length,
      negativeMargin: negativeMargin.length,
      recommendations,
      optimalMix,
    };
  }, [analyses]);

  // SKU ranking chart data
  const rankingData = useMemo(() => {
    return rankedSKUs.map((a, index) => ({
      rank: index + 1,
      name: a.name.length > 12 ? a.name.substring(0, 12) + "..." : a.name,
      fullName: a.name,
      contributionMargin: a.contributionMargin,
      marginRatio: a.contributionMarginRatio,
      profitability: a.profitability,
    }));
  }, [rankedSKUs]);

  // Cost structure pie chart data
  const costStructureData = useMemo(() => [
    { name: "COGS", value: skus.reduce((sum, s) => sum + s.cogs, 0), color: COLORS.ocean },
    { name: "Shipping", value: skus.reduce((sum, s) => sum + s.shipping, 0), color: COLORS.logistics },
    { name: "Platform Fees", value: skus.reduce((sum, s) => sum + s.platformFees, 0), color: COLORS.purple },
    { name: "Payment Fees", value: skus.reduce((sum, s) => sum + s.paymentFees, 0), color: COLORS.pink },
    { name: "Other Variable", value: skus.reduce((sum, s) => sum + s.otherVariableCosts, 0), color: COLORS.cyan },
    { name: "Fixed Costs", value: aggregateMetrics.totalFixedCosts, color: COLORS.warning },
  ], [skus, aggregateMetrics]);

  // Break-even line chart data
  const breakEvenLineData = useMemo(() => {
    const maxUnits = Math.max(...analyses.map(a => Math.max(a.unitsSold, a.breakEvenUnits) * 1.5), 100);
    const dataPoints = [];
    
    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 20)) {
      const totalContribution = analyses.reduce((sum, a) => {
        const unitCM = a.unitContributionMargin;
        return sum + (unitCM * units);
      }, 0);
      const totalFixed = aggregateMetrics.totalFixedCosts;
      const profit = totalContribution - totalFixed;
      
      dataPoints.push({
        units,
        totalContribution,
        fixedCosts: totalFixed,
        profit,
      });
    }
    
    return dataPoints;
  }, [analyses, aggregateMetrics]);

  // Profit scenarios area chart data
  const profitScenariosData = useMemo(() => {
    const scenarios = [];
    const baseRevenue = aggregateMetrics.totalRevenue;
    const baseVariableCosts = aggregateMetrics.totalVariableCosts;
    const baseFixedCosts = aggregateMetrics.totalFixedCosts;

    for (let revChange = -30; revChange <= 30; revChange += 10) {
      const adjustedRevenue = baseRevenue * (1 + revChange / 100);
      const adjustedVariableCosts = baseVariableCosts * (1 + revChange / 100);
      const contribution = adjustedRevenue - adjustedVariableCosts;
      const profit = contribution - baseFixedCosts;
      
      scenarios.push({
        scenario: `${revChange >= 0 ? '+' : ''}${revChange}% Revenue`,
        revenue: adjustedRevenue,
        contribution,
        profit,
        marginRatio: adjustedRevenue > 0 ? (contribution / adjustedRevenue) * 100 : 0,
      });
    }
    
    return scenarios;
  }, [aggregateMetrics]);

  // What-if scenarios data
  const whatIfScenarios = useMemo((): ScenarioData[] => {
    const baseRevenue = aggregateMetrics.totalRevenue;
    const baseVariableCosts = aggregateMetrics.totalVariableCosts;
    const baseFixedCosts = aggregateMetrics.totalFixedCosts;

    return [
      {
        name: "Base Case",
        revenueChange: 0,
        costChange: 0,
        projectedMargin: aggregateMetrics.totalContributionMargin,
        projectedRatio: aggregateMetrics.averageMarginRatio,
      },
      {
        name: "Revenue +20%",
        revenueChange: 20,
        costChange: 0,
        projectedMargin: baseRevenue * 1.2 - baseVariableCosts,
        projectedRatio: ((baseRevenue * 1.2 - baseVariableCosts) / (baseRevenue * 1.2)) * 100,
      },
      {
        name: "Costs -10%",
        revenueChange: 0,
        costChange: -10,
        projectedMargin: baseRevenue - baseVariableCosts * 0.9,
        projectedRatio: ((baseRevenue - baseVariableCosts * 0.9) / baseRevenue) * 100,
      },
      {
        name: "Optimistic (+20% Rev, -10% Cost)",
        revenueChange: 20,
        costChange: -10,
        projectedMargin: baseRevenue * 1.2 - baseVariableCosts * 0.9,
        projectedRatio: ((baseRevenue * 1.2 - baseVariableCosts * 0.9) / (baseRevenue * 1.2)) * 100,
      },
      {
        name: "Pessimistic (-20% Rev, +10% Cost)",
        revenueChange: -20,
        costChange: 10,
        projectedMargin: baseRevenue * 0.8 - baseVariableCosts * 1.1,
        projectedRatio: ((baseRevenue * 0.8 - baseVariableCosts * 1.1) / (baseRevenue * 0.8)) * 100,
      },
    ];
  }, [aggregateMetrics]);

  // Custom scenario calculation
  const customScenario = useMemo(() => {
    const adjustedRevenue = aggregateMetrics.totalRevenue * (1 + scenarioRevenueChange / 100);
    const adjustedVariableCosts = aggregateMetrics.totalVariableCosts * (1 + scenarioCostChange / 100);
    const contributionMargin = adjustedRevenue - adjustedVariableCosts;
    const marginRatio = adjustedRevenue > 0 ? (contributionMargin / adjustedRevenue) * 100 : 0;
    const netProfit = contributionMargin - aggregateMetrics.totalFixedCosts;

    return {
      adjustedRevenue,
      adjustedVariableCosts,
      contributionMargin,
      marginRatio,
      netProfit,
    };
  }, [aggregateMetrics, scenarioRevenueChange, scenarioCostChange]);

  // Add SKU
  const addSKU = () => {
    setSKUs(prev => [...prev, createDefaultSKU()]);
  };

  // Remove SKU
  const removeSKU = (id: string) => {
    setSKUs(prev => prev.filter(s => s.id !== id));
  };

  // Update SKU
  const updateSKU = (id: string, field: keyof SKU, value: string | number) => {
    setSKUs(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  // Reset to sample data
  const resetCalculator = () => {
    setSKUs(sampleSKUs.map(s => ({ ...s, id: generateId() })));
    setScenarioRevenueChange(0);
    setScenarioCostChange(0);
  };

  // Format money
  const formatMoney = (value: number) => {
    return formatCurrency(value, currency.code);
  };

  // Export results as JSON
  const exportResults = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      currency: currency.code,
      summary: {
        totalRevenue: aggregateMetrics.totalRevenue,
        totalVariableCosts: aggregateMetrics.totalVariableCosts,
        totalContributionMargin: aggregateMetrics.totalContributionMargin,
        averageMarginRatio: aggregateMetrics.averageMarginRatio,
        totalFixedCosts: aggregateMetrics.totalFixedCosts,
        netProfit: aggregateMetrics.netProfit,
      },
      skus: analyses.map(a => ({
        name: a.name,
        revenue: a.revenue,
        variableCosts: a.totalVariableCosts,
        contributionMargin: a.contributionMargin,
        marginRatio: a.contributionMarginRatio,
        breakEvenUnits: a.breakEvenUnits,
        profitability: a.profitability,
      })),
      recommendations: productMixOptimization.recommendations,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contribution-margin-analysis-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currency, aggregateMetrics, analyses, productMixOptimization]);

  // Share results
  const shareResults = useCallback(async () => {
    const shareText = `Contribution Margin Analysis Summary:
    
Total Revenue: ${formatMoney(aggregateMetrics.totalRevenue)}
Total Contribution Margin: ${formatMoney(aggregateMetrics.totalContributionMargin)}
Average Margin Ratio: ${aggregateMetrics.averageMarginRatio.toFixed(1)}%
Net Profit: ${formatMoney(aggregateMetrics.netProfit)}

High Margin SKUs: ${productMixOptimization.highMargin}
Medium Margin SKUs: ${productMixOptimization.mediumMargin}
Low Margin SKUs: ${productMixOptimization.lowMargin}
Negative Margin SKUs: ${productMixOptimization.negativeMargin}

Generated by Shiportrade.com Contribution Margin Calculator`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Contribution Margin Analysis",
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [aggregateMetrics, productMixOptimization, formatMoney]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { text: "Profitability Analysis", icon: TrendingUp, color: "bg-[var(--ocean)]" },
                { text: "Margin Calculator", icon: Calculator, color: "bg-[var(--logistics)]" },
                { text: "Business Finance", icon: DollarSign, color: "bg-purple-500" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.text}
                  variants={badgeVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.1 }}
                  whileHover="hover"
                >
                  <Badge className={`${badge.color} text-white gap-1`}>
                    <badge.icon className="h-3 w-3" />
                    {badge.text}
                  </Badge>
                </motion.div>
              ))}
            </div>
            
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Contribution Margin Calculator
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Analyze product profitability, calculate break-even points, and optimize your product mix 
                with our comprehensive contribution margin analysis tool.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetCalculator}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={shareResults}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-1">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          {/* Currency Selection and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Currency:</Label>
                <Select value={currency.code} onValueChange={(v) => setCurrency(currencies.find(c => c.code === v) || currency)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.slice(0, 20).map(c => (
                      <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="secondary">{skus.length} SKU(s)</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetCalculator}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" onClick={addSKU}>
                <Plus className="h-4 w-4 mr-2" />
                Add SKU
              </Button>
            </div>
          </div>

          {/* SKU Cards */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {skus.map((sku, index) => {
                const analysis = analyses[index];
                return (
                  <motion.div
                    key={sku.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={cn(
                      "transition-all",
                      analysis.profitability === "negative" && "border-red-300 dark:border-red-800",
                      analysis.profitability === "high" && "border-green-300 dark:border-green-800"
                    )}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                              analysis.profitability === "high" ? "bg-green-500" :
                              analysis.profitability === "medium" ? "bg-blue-500" :
                              analysis.profitability === "low" ? "bg-amber-500" : "bg-red-500"
                            )}>
                              {index + 1}
                            </div>
                            <Input
                              value={sku.name}
                              onChange={(e) => updateSKU(sku.id, "name", e.target.value)}
                              placeholder="SKU Name"
                              className="w-64 font-semibold"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={analysis.profitability === "high" ? "default" : 
                                      analysis.profitability === "negative" ? "destructive" : "secondary"}
                              className={cn(
                                analysis.profitability === "high" && "bg-[var(--logistics)]",
                                analysis.profitability === "medium" && "bg-[var(--ocean)]"
                              )}
                            >
                              {analysis.contributionMarginRatio.toFixed(1)}% Margin
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeSKU(sku.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                          {/* Revenue Column */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-[var(--ocean)]" />
                              Revenue
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <Label className="text-xs">Total Revenue</Label>
                                <Input
                                  type="number"
                                  value={sku.revenue || ""}
                                  onChange={(e) => updateSKU(sku.id, "revenue", parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-xs">Units Sold</Label>
                                  <Input
                                    type="number"
                                    value={sku.unitsSold || ""}
                                    onChange={(e) => updateSKU(sku.id, "unitsSold", parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Unit Price</Label>
                                  <Input
                                    type="number"
                                    value={sku.sellingPrice || ""}
                                    onChange={(e) => updateSKU(sku.id, "sellingPrice", parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Variable Costs Column */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              Variable Costs
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <Label className="text-xs">COGS</Label>
                                <Input
                                  type="number"
                                  value={sku.cogs || ""}
                                  onChange={(e) => updateSKU(sku.id, "cogs", parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Shipping</Label>
                                <Input
                                  type="number"
                                  value={sku.shipping || ""}
                                  onChange={(e) => updateSKU(sku.id, "shipping", parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-xs">Platform Fees</Label>
                                  <Input
                                    type="number"
                                    value={sku.platformFees || ""}
                                    onChange={(e) => updateSKU(sku.id, "platformFees", parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Payment Fees</Label>
                                  <Input
                                    type="number"
                                    value={sku.paymentFees || ""}
                                    onChange={(e) => updateSKU(sku.id, "paymentFees", parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs">Other Variable Costs</Label>
                                <Input
                                  type="number"
                                  value={sku.otherVariableCosts || ""}
                                  onChange={(e) => updateSKU(sku.id, "otherVariableCosts", parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Fixed Costs Column */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                              <Layers className="h-4 w-4 text-amber-500" />
                              Fixed Costs
                            </h4>
                            <div className="space-y-2">
                              <div>
                                <Label className="text-xs">Allocated Fixed Costs</Label>
                                <Input
                                  type="number"
                                  value={sku.fixedCosts || ""}
                                  onChange={(e) => updateSKU(sku.id, "fixedCosts", parseFloat(e.target.value) || 0)}
                                  placeholder="0"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Rent, salaries, insurance, etc. allocated to this SKU
                              </p>
                            </div>
                          </div>

                          {/* Results Column */}
                          <div className="space-y-3">
                            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                              <Calculator className="h-4 w-4 text-[var(--logistics)]" />
                              Calculated
                            </h4>
                            <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Variable Costs</span>
                                <span className="font-medium">{formatMoney(analysis.totalVariableCosts)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Contribution</span>
                                <span className={cn(
                                  "font-bold",
                                  analysis.contributionMargin >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                )}>
                                  {formatMoney(analysis.contributionMargin)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Margin Ratio</span>
                                <span className={cn(
                                  "font-medium",
                                  analysis.contributionMarginRatio >= 30 ? "text-green-600 dark:text-green-400" :
                                  analysis.contributionMarginRatio >= 15 ? "text-blue-600 dark:text-blue-400" :
                                  analysis.contributionMarginRatio >= 0 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                                )}>
                                  {analysis.contributionMarginRatio.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Break-Even</span>
                                <span className="font-medium">{analysis.breakEvenUnits} units</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Unit Margin</span>
                                <span className="font-medium">{formatMoney(analysis.unitContributionMargin)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Quick Summary */}
          <Card className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Total Revenue</div>
                  <div className="text-2xl font-bold text-[var(--ocean)]">{formatMoney(aggregateMetrics.totalRevenue)}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Total Contribution</div>
                  <div className={cn(
                    "text-2xl font-bold",
                    aggregateMetrics.totalContributionMargin >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {formatMoney(aggregateMetrics.totalContributionMargin)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Avg Margin Ratio</div>
                  <div className="text-2xl font-bold text-[var(--logistics)]">{aggregateMetrics.averageMarginRatio.toFixed(1)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Net Profit</div>
                  <div className={cn(
                    "text-2xl font-bold",
                    aggregateMetrics.netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {formatMoney(aggregateMetrics.netProfit)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Structure Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Structure Breakdown
                </CardTitle>
                <CardDescription>
                  Distribution of costs across your product portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costStructureData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={true}
                      >
                        {costStructureData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatMoney(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Product Comparison Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--logistics)]" />
                  Product/Service Comparison
                </CardTitle>
                <CardDescription>
                  Revenue, costs, and contribution margin by SKU
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={marginComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => formatMoney(v)} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === "marginRatio" ? `${value.toFixed(1)}%` : formatMoney(value),
                          name === "revenue" ? "Revenue" : 
                          name === "variableCosts" ? "Variable Costs" :
                          name === "contributionMargin" ? "Contribution Margin" : "Margin Ratio"
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill={COLORS.ocean} />
                      <Bar dataKey="variableCosts" name="Variable Costs" fill={COLORS.danger} />
                      <Bar dataKey="contributionMargin" name="Contribution Margin" fill={COLORS.logistics} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Break-Even Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Break-Even Analysis
                </CardTitle>
                <CardDescription>
                  Profit trajectory as units increase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={breakEvenLineData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="units" label={{ value: "Units", position: "bottom", offset: -5 }} />
                      <YAxis tickFormatter={(v) => formatMoney(v)} />
                      <Tooltip formatter={(value: number, name: string) => [
                        formatMoney(value),
                        name === "totalContribution" ? "Total Contribution" :
                        name === "fixedCosts" ? "Fixed Costs" : "Profit"
                      ]} />
                      <Legend />
                      <ReferenceLine y={aggregateMetrics.totalFixedCosts} stroke={COLORS.warning} strokeDasharray="5 5" label="Break-Even" />
                      <Line type="monotone" dataKey="totalContribution" name="Total Contribution" stroke={COLORS.logistics} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="fixedCosts" name="Fixed Costs" stroke={COLORS.warning} strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      <Line type="monotone" dataKey="profit" name="Profit" stroke={COLORS.ocean} strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Profit Scenarios Area Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Profit Scenarios
                </CardTitle>
                <CardDescription>
                  How profit changes with revenue variations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={profitScenariosData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="scenario" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                      <YAxis tickFormatter={(v) => formatMoney(v)} />
                      <Tooltip formatter={(value: number, name: string) => [
                        name === "marginRatio" ? `${value.toFixed(1)}%` : formatMoney(value),
                        name === "revenue" ? "Revenue" :
                        name === "contribution" ? "Contribution" :
                        name === "marginRatio" ? "Margin Ratio" : "Profit"
                      ]} />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" name="Revenue" fill={COLORS.ocean} fillOpacity={0.3} stroke={COLORS.ocean} />
                      <Area type="monotone" dataKey="contribution" name="Contribution" fill={COLORS.logistics} fillOpacity={0.3} stroke={COLORS.logistics} />
                      <Area type="monotone" dataKey="profit" name="Profit" fill={COLORS.purple} fillOpacity={0.5} stroke={COLORS.purple} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Waterfall Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Profit Waterfall Analysis
              </CardTitle>
              <CardDescription>
                See how revenue transforms into net profit through cost deductions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => formatMoney(v)} />
                    <Tooltip 
                      formatter={(value: number) => formatMoney(Math.abs(value))}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {waterfallData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={
                            entry.type === "positive" ? COLORS.logistics :
                            entry.type === "negative" ? COLORS.danger :
                            entry.type === "total" ? COLORS.ocean :
                            entry.value >= 0 ? COLORS.logistics : COLORS.danger
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.logistics }} />
                  <span className="text-sm text-muted-foreground">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.danger }} />
                  <span className="text-sm text-muted-foreground">Negative</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.ocean }} />
                  <span className="text-sm text-muted-foreground">Total/Subtotal</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profitability Distribution */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{productMixOptimization.highMargin}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">High Margin SKUs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{productMixOptimization.mediumMargin}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Medium Margin SKUs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{productMixOptimization.lowMargin}</div>
                    <div className="text-sm text-amber-700 dark:text-amber-300">Low Margin SKUs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{productMixOptimization.negativeMargin}</div>
                    <div className="text-sm text-red-700 dark:text-red-300">Negative Margin SKUs</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6 mt-6">
          {/* What-If Scenarios Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--ocean)]" />
                What-If Scenario Analysis
              </CardTitle>
              <CardDescription>
                Compare different business scenarios and their impact on contribution margin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Scenario</th>
                      <th className="text-right py-3 px-4 font-medium">Revenue Change</th>
                      <th className="text-right py-3 px-4 font-medium">Cost Change</th>
                      <th className="text-right py-3 px-4 font-medium">Projected Margin</th>
                      <th className="text-right py-3 px-4 font-medium">Margin Ratio</th>
                      <th className="text-right py-3 px-4 font-medium">vs Base</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whatIfScenarios.map((scenario, index) => {
                      const baseMargin = aggregateMetrics.totalContributionMargin;
                      const diff = scenario.projectedMargin - baseMargin;
                      return (
                        <tr key={index} className={cn(
                          "border-b hover:bg-muted/30 transition-colors",
                          index === 0 && "bg-[var(--ocean)]/5"
                        )}>
                          <td className="py-3 px-4 font-medium">{scenario.name}</td>
                          <td className={cn(
                            "text-right py-3 px-4",
                            scenario.revenueChange > 0 ? "text-green-600 dark:text-green-400" :
                            scenario.revenueChange < 0 ? "text-red-600 dark:text-red-400" : ""
                          )}>
                            {scenario.revenueChange >= 0 ? "+" : ""}{scenario.revenueChange}%
                          </td>
                          <td className={cn(
                            "text-right py-3 px-4",
                            scenario.costChange < 0 ? "text-green-600 dark:text-green-400" :
                            scenario.costChange > 0 ? "text-red-600 dark:text-red-400" : ""
                          )}>
                            {scenario.costChange >= 0 ? "+" : ""}{scenario.costChange}%
                          </td>
                          <td className="text-right py-3 px-4">{formatMoney(scenario.projectedMargin)}</td>
                          <td className="text-right py-3 px-4">
                            <Badge variant={scenario.projectedRatio >= 30 ? "default" : scenario.projectedRatio >= 15 ? "secondary" : "destructive"}
                              className={cn(scenario.projectedRatio >= 30 && "bg-[var(--logistics)]")}>
                              {scenario.projectedRatio.toFixed(1)}%
                            </Badge>
                          </td>
                          <td className={cn(
                            "text-right py-3 px-4 font-semibold",
                            diff > 0 ? "text-green-600 dark:text-green-400" :
                            diff < 0 ? "text-red-600 dark:text-red-400" : ""
                          )}>
                            {diff >= 0 ? "+" : ""}{formatMoney(diff)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Custom Scenario Builder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                Custom Scenario Builder
              </CardTitle>
              <CardDescription>
                Create your own what-if scenario by adjusting revenue and cost parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Revenue Change: {scenarioRevenueChange >= 0 ? "+" : ""}{scenarioRevenueChange}%</Label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={scenarioRevenueChange}
                      onChange={(e) => setScenarioRevenueChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>-50%</span>
                      <span>0%</span>
                      <span>+50%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Variable Cost Change: {scenarioCostChange >= 0 ? "+" : ""}{scenarioCostChange}%</Label>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={scenarioCostChange}
                      onChange={(e) => setScenarioCostChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>-50%</span>
                      <span>0%</span>
                      <span>+50%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold">Projected Results</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Adjusted Revenue</div>
                      <div className="font-bold text-lg">{formatMoney(customScenario.adjustedRevenue)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Adjusted Costs</div>
                      <div className="font-bold text-lg">{formatMoney(customScenario.adjustedVariableCosts)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Contribution Margin</div>
                      <div className={cn(
                        "font-bold text-lg",
                        customScenario.contributionMargin >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {formatMoney(customScenario.contributionMargin)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Margin Ratio</div>
                      <div className={cn(
                        "font-bold text-lg",
                        customScenario.marginRatio >= 30 ? "text-green-600 dark:text-green-400" :
                        customScenario.marginRatio >= 15 ? "text-blue-600 dark:text-blue-400" :
                        customScenario.marginRatio >= 0 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {customScenario.marginRatio.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Projected Net Profit</span>
                    <span className={cn(
                      "font-bold text-xl",
                      customScenario.netProfit >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {formatMoney(customScenario.netProfit)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sensitivity Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Sensitivity Analysis
              </CardTitle>
              <CardDescription>
                Understanding how changes in key variables affect your contribution margin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={whatIfScenarios} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => formatMoney(v)} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Legend />
                    <Bar dataKey="projectedMargin" name="Projected Margin" fill={COLORS.logistics} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* What is Contribution Margin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                What is Contribution Margin?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Contribution margin is a fundamental financial metric that represents the revenue remaining after 
                deducting all variable costs associated with producing and selling a product or service. This metric 
                is essential for understanding product profitability and making informed business decisions. Unlike 
                gross margin, which only considers cost of goods sold (COGS), contribution margin accounts for all 
                variable expenses including shipping, platform fees, payment processing fees, and other costs that 
                fluctuate with sales volume.
              </p>
              <p className="text-muted-foreground mt-4">
                The contribution margin tells you how much money from each sale is available to cover fixed costs 
                and generate profit. A higher contribution margin indicates that a product is more profitable per 
                unit sold, while a lower margin suggests that most of the revenue is consumed by variable costs. 
                Products with negative contribution margins actually lose money on each sale, making them prime 
                candidates for discontinuation or repricing strategies.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg my-4">
                <h4 className="font-semibold mb-2">Key Formulas</h4>
                <code className="text-[var(--ocean)] font-bold block mb-2">
                  Contribution Margin = Revenue - Variable Costs
                </code>
                <code className="text-[var(--logistics)] font-bold block">
                  Contribution Margin Ratio = (Contribution Margin / Revenue) × 100%
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Margin vs Gross Margin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--logistics)]" />
                Contribution Margin vs Gross Margin
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Understanding the difference between contribution margin and gross margin is crucial for accurate 
                profitability analysis. While both metrics measure profitability, they serve different purposes 
                and include different cost components. Gross margin only deducts the cost of goods sold (COGS) 
                from revenue, representing the basic profitability of production or procurement. Contribution 
                margin goes further by including all variable costs that scale with sales volume.
              </p>
              <p className="text-muted-foreground mt-4">
                For e-commerce businesses and modern retail operations, contribution margin provides a more 
                accurate picture of true product profitability. Consider an online seller: a product might have 
                a healthy gross margin of 50%, but after accounting for marketplace fees (typically 15%), shipping 
                costs (10%), and payment processing (3%), the contribution margin might drop to just 22%. This 
                distinction is critical for pricing decisions, product selection, and channel strategy.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                  <h5 className="font-semibold text-[var(--ocean)]">Gross Margin Includes</h5>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Direct materials</li>
                    <li>• Direct labor</li>
                    <li>• Manufacturing overhead</li>
                  </ul>
                </div>
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                  <h5 className="font-semibold text-[var(--logistics)]">Contribution Margin Also Includes</h5>
                  <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                    <li>• Shipping and freight</li>
                    <li>• Platform/marketplace fees</li>
                    <li>• Payment processing</li>
                    <li>• Sales commissions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Using Contribution Margin for Decision Making */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-500" />
                Using Contribution Margin for Decision Making
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Contribution margin analysis is a powerful tool for making strategic business decisions across 
                multiple areas. When evaluating product portfolios, contribution margin helps identify which 
                products generate the most value per sale and which drain resources. Products with high 
                contribution margins should be prioritized in marketing efforts and inventory management, while 
                those with low or negative margins may need to be repriced, bundled with higher-margin items, 
                or discontinued.
              </p>
              <p className="text-muted-foreground mt-4">
                In pricing strategy, contribution margin analysis enables more sophisticated decision-making. 
                When considering discounts or promotions, you can calculate exactly how much additional volume 
                is needed to maintain profitability. For example, a 10% discount on a product with a 30% 
                contribution margin ratio requires a 50% increase in volume just to maintain the same total 
                contribution. This insight helps avoid pricing decisions that erode profitability.
              </p>
              <p className="text-muted-foreground mt-4">
                Contribution margin also informs channel strategy and customer segmentation. Different sales 
                channels often have different variable cost structures—selling on Amazon incurs different fees 
                than selling through your own website or wholesale. By calculating contribution margin by channel, 
                you can optimize your sales mix and allocate resources to the most profitable routes to market.
              </p>
            </CardContent>
          </Card>

          {/* Break-Even Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                Break-Even Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Break-even analysis is a critical application of contribution margin that determines the sales 
                volume needed to cover all costs. The break-even point is where total revenue equals total costs, 
                resulting in zero profit or loss. Understanding your break-even point helps set realistic sales 
                targets, evaluate new product viability, and assess business risk.
              </p>
              <p className="text-muted-foreground mt-4">
                The formula for break-even in units is straightforward: divide fixed costs by the unit contribution 
                margin. For example, if your monthly fixed costs are $10,000 and your average unit contribution 
                margin is $25, you need to sell 400 units monthly to break even. Every unit sold beyond this 
                point contributes directly to profit. This calculation becomes more complex when dealing with 
                multiple products, requiring weighted-average contribution margins based on the expected sales mix.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg my-4">
                <h4 className="font-semibold mb-2">Break-Even Formulas</h4>
                <code className="text-[var(--ocean)] font-bold block mb-2">
                  Break-Even Units = Fixed Costs ÷ Unit Contribution Margin
                </code>
                <code className="text-[var(--logistics)] font-bold block">
                  Break-Even Revenue = Fixed Costs ÷ Contribution Margin Ratio
                </code>
              </div>
              <p className="text-muted-foreground mt-4">
                Break-even analysis also helps evaluate the impact of business decisions. Considering a rent 
                increase? Calculate how many additional units you need to sell. Want to hire a new employee? 
                Determine the revenue required to justify the additional fixed cost. This quantitative approach 
                removes guesswork from business planning and helps set achievable goals.
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Pro Tips and Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: Target,
                    title: "Focus on Unit Contribution",
                    description: "While total contribution matters, focus on unit contribution margin to understand true profitability per sale. Products with lower revenue but higher unit margins may be more valuable.",
                    color: "bg-[var(--logistics)]"
                  },
                  {
                    icon: Package,
                    title: "Bundle Strategically",
                    description: "Bundle low-margin products with high-margin ones to improve overall margin while increasing average order value and customer satisfaction.",
                    color: "bg-[var(--ocean)]"
                  },
                  {
                    icon: RefreshCw,
                    title: "Update Costs Regularly",
                    description: "Variable costs change frequently. Review your cost structure monthly to ensure accurate margin calculations and timely price adjustments.",
                    color: "bg-purple-500"
                  },
                  {
                    icon: AlertTriangle,
                    title: "Monitor Margin Creep",
                    description: "Set up alerts for products approaching zero margin. Investigate causes immediately—sometimes loss leaders make sense, but they should be intentional.",
                    color: "bg-amber-500"
                  },
                  {
                    icon: TrendingUp,
                    title: "Consider Opportunity Costs",
                    description: "A low-margin product may tie up warehouse space and capital that could be used for higher-margin products. Factor opportunity costs into product mix decisions.",
                    color: "bg-cyan-500"
                  },
                  {
                    icon: Calculator,
                    title: "Use for Pricing Decisions",
                    description: "When considering price changes, recalculate break-even units. A price cut requires substantially more volume to maintain the same profit level.",
                    color: "bg-pink-500"
                  }
                ].map((tip, index) => (
                  <div key={index} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className={`w-10 h-10 rounded-lg ${tip.color} flex items-center justify-center shrink-0`}>
                      <tip.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h5 className="font-semibold">{tip.title}</h5>
                      <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-red-700 dark:text-red-300">Confusing Gross Margin with Contribution Margin</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gross margin only deducts COGS, while contribution margin deducts ALL variable costs 
                      including shipping, fees, and commissions. Using gross margin for pricing decisions 
                      can lead to underpricing and eroded profitability.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-red-700 dark:text-red-300">Ignoring Fixed Cost Allocation</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      While contribution margin ignores fixed costs for individual products, you still need 
                      to ensure your total contribution covers all fixed costs. Calculate your overall 
                      break-even to ensure business viability.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-red-700 dark:text-red-300">Neglecting Volume Impact</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      A high contribution margin on a slow-moving product may generate less total 
                      contribution than a moderate margin on a fast-selling item. Consider both margin 
                      and sales velocity in product decisions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-red-700 dark:text-red-300">Not Updating Costs Regularly</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Shipping rates, platform fees, and COGS change frequently. Using outdated cost 
                      data leads to incorrect margin calculations and poor pricing decisions. 
                      Update your cost structure at least monthly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-red-700 dark:text-red-300">Overlooking Hidden Variable Costs</h5>
                    <p className="text-sm text-muted-foreground mt-1">
                      Returns processing, customer service time, and inventory holding costs can all 
                      scale with sales volume. Failing to include these in your variable cost calculations 
                      results in overstated contribution margins.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="faq1" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--ocean)]">Q1</Badge>
                      <span className="font-semibold text-left">What is a good contribution margin ratio?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      A &quot;good&quot; contribution margin ratio varies significantly by industry, business model, and 
                      competitive landscape. Generally speaking, a ratio above 30% is considered healthy for most 
                      e-commerce and retail businesses, while ratios below 15% indicate potential profitability 
                      concerns that require attention. However, these benchmarks should be interpreted in context.
                    </p>
                    <p>
                      High-volume, low-margin businesses like grocery stores typically operate with contribution 
                      margins of 10-15%, compensated by massive sales volume. In contrast, luxury goods, 
                      software products, and professional services often achieve margins of 50% or higher. 
                      The key is understanding what&apos;s normal for your specific industry and business model, 
                      then benchmarking your performance against relevant competitors.
                    </p>
                    <p>
                      More important than the absolute number is the trend over time and the relationship to 
                      your fixed costs. A business with a 20% contribution margin and low fixed costs can be 
                      highly profitable, while a business with a 40% margin but enormous fixed costs might 
                      struggle to break even. Always analyze contribution margin in conjunction with your 
                      break-even point and total fixed costs.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq2" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--logistics)]">Q2</Badge>
                      <span className="font-semibold text-left">How do I calculate contribution margin for multiple products?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Calculating contribution margin for multiple products requires analyzing each product 
                      individually first, then aggregating the results. Start by determining the revenue and 
                      variable costs for each product in your portfolio. Calculate the unit contribution margin 
                      for each product by subtracting per-unit variable costs from the selling price. Then 
                      multiply by the number of units sold to get the total contribution for each product.
                    </p>
                    <p>
                      For an overall contribution margin ratio across multiple products, sum the total contribution 
                      from all products and divide by total revenue. This weighted-average approach gives you 
                      a portfolio-level view of profitability. However, it&apos;s crucial to also analyze individual 
                      product margins—averaging can mask significant variation between products.
                    </p>
                    <p>
                      A more sophisticated approach involves calculating the contribution margin per constrained 
                      resource. If warehouse space, production capacity, or sales team time is your limiting 
                      factor, rank products by contribution margin per unit of the constrained resource rather 
                      than by total contribution. This optimization approach ensures you&apos;re maximizing the 
                      return on your most limited resources.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq3" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500">Q3</Badge>
                      <span className="font-semibold text-left">Should I discontinue products with negative contribution margins?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Products with negative contribution margins lose money on every sale, making discontinuation 
                      a natural consideration. However, the decision isn&apos;t always straightforward. Before 
                      discontinuing, carefully evaluate whether the product serves a strategic purpose that 
                      justifies the loss. Some products act as loss leaders, attracting customers who then 
                      purchase profitable items. Others might be necessary to maintain customer relationships 
                      or compete effectively in a market.
                    </p>
                    <p>
                      Consider whether the negative margin is fixable. Can you negotiate better supplier terms, 
                      reduce shipping costs, or increase prices without significantly impacting demand? Sometimes 
                      operational improvements can turn a negative margin positive. Also evaluate the cost of 
                      discontinuation—write-offs for inventory, customer relationship impacts, and potential 
                      competitive responses.
                    </p>
                    <p>
                      If you decide to discontinue, plan the transition carefully. Communicate with affected 
                      customers, offer alternatives, and time the exit to minimize disruption. For products 
                      that serve strategic purposes despite negative margins, set clear boundaries on the 
                      acceptable loss and regularly review whether the strategic value justifies the ongoing cost.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq4" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-amber-500">Q4</Badge>
                      <span className="font-semibold text-left">How does contribution margin differ from markup?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Contribution margin and markup are related but distinct concepts that serve different 
                      purposes in business analysis. Markup is a pricing calculation that determines how much 
                      to add to cost to arrive at a selling price. It&apos;s typically expressed as a percentage 
                      of cost: Markup % = (Price - Cost) / Cost × 100. A 50% markup means selling at 1.5 times 
                      the cost.
                    </p>
                    <p>
                      Contribution margin, in contrast, is expressed as a percentage of revenue: CM % = 
                      (Revenue - Variable Costs) / Revenue × 100. This difference in denominator creates 
                      significant variation in the resulting percentages. A 50% markup on a product that 
                      costs $100 results in a $150 selling price, but the contribution margin ratio is only 
                      33.3% ($50 / $150), not 50%.
                    </p>
                    <p>
                      The practical implication is that you can&apos;t simply markup your costs by your desired 
                      profit percentage. If you need a 30% contribution margin to cover fixed costs and profit, 
                      you need a markup of approximately 43%, not 30%. Understanding this relationship is 
                      essential for setting prices that actually achieve your profitability targets.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq5" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-cyan-500">Q5</Badge>
                      <span className="font-semibold text-left">What costs should I include in variable costs?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Variable costs are expenses that change in proportion to your sales volume. The key test 
                      is: does this cost increase when I sell one more unit, and decrease when I sell one less? 
                      If the answer is yes, it&apos;s a variable cost. Common variable costs include direct materials, 
                      direct labor (if paid per unit), shipping and freight, packaging, and sales commissions.
                    </p>
                    <p>
                      For e-commerce and retail businesses, additional variable costs include marketplace fees 
                      (Amazon, eBay, etc.), payment processing fees, and often return processing costs. These 
                      costs are directly tied to each transaction and scale with sales volume. Include any 
                      cost that you would eliminate if you stopped selling that product entirely.
                    </p>
                    <p>
                      Be careful with costs that have both fixed and variable components. For example, customer 
                      service might be partly fixed (salaries) and partly variable (per-call costs). In these 
                      cases, allocate the variable portion to product costs. When in doubt, err on the side 
                      of including a cost as variable—it&apos;s better to overestimate costs and be pleasantly 
                      surprised than to underestimate and make poor decisions based on inflated margin figures.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq6" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-pink-500">Q6</Badge>
                      <span className="font-semibold text-left">How often should I recalculate contribution margins?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      The frequency of contribution margin recalculation depends on how quickly your costs and 
                      prices change. At minimum, conduct a thorough review quarterly, coinciding with financial 
                      reporting periods. However, businesses in dynamic environments—those with frequent supplier 
                      price changes, volatile shipping costs, or active pricing strategies—should recalculate 
                      monthly or even weekly.
                    </p>
                    <p>
                      Set up triggers that prompt immediate recalculation when significant changes occur. These 
                      triggers might include supplier price increases, shipping rate changes, new marketplace 
                      fee structures, or competitive price movements. A 5% change in any major cost component 
                      can significantly impact profitability and should trigger a review.
                    </p>
                    <p>
                      Implementing automated tracking can help maintain accuracy without manual effort. Many 
                      accounting and inventory management systems can track costs in real-time. For businesses 
                      without such systems, create a simple spreadsheet that automatically recalculates margins 
                      when you input current costs. The investment in accurate, timely contribution margin data 
                      pays dividends in better pricing decisions and improved profitability.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq7" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Q7</Badge>
                      <span className="font-semibold text-left">Can contribution margin help with make vs. buy decisions?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Contribution margin analysis is extremely valuable for make versus buy decisions, which 
                      involve choosing between producing goods in-house or purchasing them from external suppliers. 
                      The key is to compare the contribution margin under each scenario, considering only the 
                      relevant costs that differ between the alternatives.
                    </p>
                    <p>
                      When evaluating a buy decision, compare your internal variable cost per unit against the 
                      supplier&apos;s price. However, don&apos;t stop there—consider capacity constraints, quality 
                      implications, and strategic factors. If you can use freed-up production capacity for 
                      higher-margin products, buying may be advantageous even if the supplier price is slightly 
                      higher than your internal cost.
                    </p>
                    <p>
                      For outsourcing decisions, calculate the contribution margin differential: the difference 
                      between the margin you&apos;d earn making the product versus the margin you&apos;d earn buying it 
                      and potentially producing something else with the freed capacity. Include all relevant 
                      costs—quality control, logistics, inventory carrying costs—and consider strategic factors 
                      like supplier reliability and the importance of maintaining internal capabilities.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq8" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-500">Q8</Badge>
                      <span className="font-semibold text-left">How do discounts and promotions affect contribution margin?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Discounts and promotions have a powerful—and often underestimated—impact on contribution 
                      margin. Because discounts reduce revenue while variable costs remain constant, they 
                      significantly erode margin. A 10% discount on a product with a 30% contribution margin 
                      reduces the margin to just 22.2%, a 26% reduction in profitability per unit.
                    </p>
                    <p>
                      To maintain total contribution when discounting, you need to increase volume proportionally. 
                      The formula is: Required Volume Increase = Discount % ÷ (Contribution Margin % - Discount %). 
                      For that same 10% discount on a 30% margin product, you need a 50% increase in volume 
                      just to maintain the same total contribution. This calculation is essential for evaluating 
                      whether a promotion will actually improve profitability.
                    </p>
                    <p>
                      Not all discounts are bad—they can be effective for clearing slow-moving inventory, 
                      acquiring new customers, or competing strategically. The key is to calculate the 
                      required volume uplift beforehand and track actual results against projections. For 
                      ongoing promotions, consider whether you could achieve similar results through 
                      alternative approaches like improved marketing, product bundling, or value-added 
                      services that don&apos;t erode margin as severely.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Industry Benchmarks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industry Contribution Margin Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Industry</th>
                      <th className="text-right py-3 px-4">Typical Margin Ratio</th>
                      <th className="text-left py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">E-Commerce (General)</td>
                      <td className="text-right py-3 px-4">20-40%</td>
                      <td className="py-3 px-4 text-muted-foreground">Varies significantly by category</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Electronics</td>
                      <td className="text-right py-3 px-4">15-25%</td>
                      <td className="py-3 px-4 text-muted-foreground">Lower due to competitive pricing</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Fashion/Apparel</td>
                      <td className="text-right py-3 px-4">40-60%</td>
                      <td className="py-3 px-4 text-muted-foreground">Higher margins for branded items</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Food & Beverage</td>
                      <td className="text-right py-3 px-4">25-35%</td>
                      <td className="py-3 px-4 text-muted-foreground">Lower due to spoilage risk</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Health & Beauty</td>
                      <td className="text-right py-3 px-4">35-50%</td>
                      <td className="py-3 px-4 text-muted-foreground">Strong brand loyalty helps</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Home & Garden</td>
                      <td className="text-right py-3 px-4">30-45%</td>
                      <td className="py-3 px-4 text-muted-foreground">Seasonal variations common</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
}
