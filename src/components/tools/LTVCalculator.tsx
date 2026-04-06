"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Sparkles,
  Award,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Lightbulb,
  Shield,
  Rocket,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  ReferenceLine,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  AreaChart,
  Area,
  Legend,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand Colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  accent: "#6366F1",
  teal: "#14B8A6",
  lightOcean: "#1A6BA8",
  lightLogistics: "#3DA76D",
};

interface LTVInputs {
  aov: number;
  purchaseFrequency: number;
  customerLifespan: number;
  profitMargin: number;
  retentionRate: number;
  discountRate: number;
  cac: number;
}

interface LTVResults {
  simpleLTV: number;
  advancedLTV: number;
  grossLTV: number;
  netLTV: number;
  npvLTV: number;
  ltvCacRatio: number;
  paybackPeriod: number;
  avgCustomerValue: number;
  totalPurchases: number;
  grossProfit: number;
  churnRate: number;
  monthsToPayback: number;
  isHealthyRatio: boolean;
  retentionMultiplier: number;
}

interface CohortData {
  month: number;
  retained: number;
  revenue: number;
  cumulativeRevenue: number;
  probability: number;
}

// FAQs Data
const faqs = [
  {
    question: "What is a good LTV:CAC ratio?",
    answer: "A healthy LTV:CAC ratio is typically 3:1 or higher. This means for every dollar spent on customer acquisition, you generate $3 in customer lifetime value. Ratios below 3:1 suggest you may be overspending on acquisition or under-monetizing customers. The best-performing companies often achieve 4:1 to 5:1 ratios.",
  },
  {
    question: "How often should I recalculate LTV?",
    answer: "LTV should be recalculated quarterly at minimum, or monthly for fast-growing businesses. Changes in pricing, product mix, customer behavior, or market conditions can significantly impact LTV. Real-time LTV tracking is ideal for subscription businesses with predictable revenue streams.",
  },
  {
    question: "What's the difference between Simple and Advanced LTV?",
    answer: "Simple LTV (AOV × Frequency × Lifespan) provides a quick estimate without considering customer churn. Advanced LTV divides gross profit by churn rate, accounting for how retention impacts customer value. Advanced LTV is more accurate for businesses with measurable retention metrics.",
  },
  {
    question: "Why is NPV-adjusted LTV lower than Advanced LTV?",
    answer: "NPV (Net Present Value) accounts for the time value of money - future revenue is worth less than current revenue. A dollar received today can be reinvested, so NPV discounts future cash flows to present value. This gives a more conservative and financially accurate LTV estimate.",
  },
  {
    question: "How can I improve my LTV quickly?",
    answer: "Focus on retention first - a 5% improvement in retention can boost profits by 25-95%. Then work on increasing AOV through cross-selling and bundling. Finally, implement loyalty programs to boost purchase frequency. These strategies compound over time.",
  },
  {
    question: "What is payback period and why does it matter?",
    answer: "Payback period is the time it takes to recover your customer acquisition cost. Shorter payback periods (under 12 months) mean faster reinvestment capability and lower risk. Long payback periods strain cash flow and increase vulnerability to customer churn before ROI is achieved.",
  },
  {
    question: "How does churn rate affect LTV?",
    answer: "Churn has an inverse relationship with LTV. The formula LTV = Margin / Churn Rate means that as churn decreases, LTV increases exponentially. A business with 5% churn has 2x the LTV of one with 10% churn, all else equal. Reducing churn is the most powerful lever for increasing LTV.",
  },
  {
    question: "Should I use gross margin or net margin for LTV calculations?",
    answer: "Use gross margin for LTV calculations as it reflects the direct profitability of sales. Net margin includes overhead costs that may not scale with customer acquisition. For subscription businesses, use contribution margin which excludes costs that vary with customer count.",
  },
];

export function LTVCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");

  // Input states
  const [aov, setAov] = useState<string>("150");
  const [purchaseFrequency, setPurchaseFrequency] = useState<string>("4");
  const [customerLifespan, setCustomerLifespan] = useState<string>("3");
  const [profitMargin, setProfitMargin] = useState<string>("30");
  const [retentionRate, setRetentionRate] = useState<string>("75");
  const [discountRate, setDiscountRate] = useState<string>("10");
  const [cac, setCac] = useState<string>("100");

  const parseNum = (val: string) => parseFloat(val) || 0;

  // Calculate LTV
  const ltvResults = useMemo((): LTVResults => {
    const inputs: LTVInputs = {
      aov: parseNum(aov),
      purchaseFrequency: parseNum(purchaseFrequency),
      customerLifespan: parseNum(customerLifespan),
      profitMargin: parseNum(profitMargin) / 100,
      retentionRate: parseNum(retentionRate) / 100,
      discountRate: parseNum(discountRate) / 100,
      cac: parseNum(cac),
    };

    // Simple LTV Formula: AOV × Purchase Frequency × Lifespan
    const simpleLTV = inputs.aov * inputs.purchaseFrequency * inputs.customerLifespan;

    // Advanced LTV: (AOV × Purchase Frequency × Profit Margin) / Churn Rate
    const churnRate = 1 - inputs.retentionRate;
    const avgCustomerValue = inputs.aov * inputs.purchaseFrequency;
    const grossProfit = avgCustomerValue * inputs.profitMargin;
    const advancedLTV = churnRate > 0 ? grossProfit / churnRate : grossProfit * 10;

    // Gross LTV (before profit margin)
    const grossLTV = avgCustomerValue * inputs.customerLifespan;

    // Net LTV (after CAC)
    const netLTV = advancedLTV - inputs.cac;

    // NPV-adjusted LTV (discounted cash flows)
    let npvLTV = 0;
    const monthlyPurchaseValue = avgCustomerValue / 12 * inputs.profitMargin;
    const monthlyDiscount = inputs.discountRate / 12;
    const monthsLifespan = inputs.customerLifespan * 12;
    
    for (let month = 1; month <= monthsLifespan; month++) {
      const retentionFactor = Math.pow(inputs.retentionRate, month / 12);
      const discountFactor = Math.pow(1 + monthlyDiscount, month);
      npvLTV += (monthlyPurchaseValue * retentionFactor) / discountFactor;
    }

    // LTV:CAC Ratio
    const ltvCacRatio = inputs.cac > 0 ? advancedLTV / inputs.cac : 0;

    // Payback Period (months)
    const monthlyProfit = avgCustomerValue * inputs.profitMargin / 12;
    const monthsToPayback = monthlyProfit > 0 ? Math.ceil(inputs.cac / monthlyProfit) : 0;

    // Total purchases over lifespan
    const totalPurchases = inputs.purchaseFrequency * inputs.customerLifespan;

    // Retention multiplier (how much value retention adds)
    const retentionMultiplier = churnRate > 0 ? 1 / churnRate : 10;

    // Health check
    const isHealthyRatio = ltvCacRatio >= 3;

    return {
      simpleLTV,
      advancedLTV,
      grossLTV,
      netLTV,
      npvLTV,
      ltvCacRatio,
      paybackPeriod: monthsToPayback / 12,
      avgCustomerValue,
      totalPurchases,
      grossProfit,
      churnRate,
      monthsToPayback,
      isHealthyRatio,
      retentionMultiplier,
    };
  }, [aov, purchaseFrequency, customerLifespan, profitMargin, retentionRate, discountRate, cac]);

  // Cohort Analysis Data
  const cohortData = useMemo((): CohortData[] => {
    const data: CohortData[] = [];
    const retention = parseNum(retentionRate) / 100;
    const monthlyRevenue = parseNum(aov) * (parseNum(purchaseFrequency) / 12) * (parseNum(profitMargin) / 100);
    let cumulative = 0;

    for (let month = 0; month <= 36; month++) {
      const retained = Math.pow(retention, month / 12) * 100;
      const probability = Math.pow(retention, month / 12);
      const revenue = monthlyRevenue * probability;
      cumulative += revenue;
      
      data.push({
        month,
        retained: Math.round(retained * 10) / 10,
        revenue: Math.round(revenue * 100) / 100,
        cumulativeRevenue: Math.round(cumulative * 100) / 100,
        probability: Math.round(probability * 1000) / 1000,
      });
    }
    return data;
  }, [aov, purchaseFrequency, profitMargin, retentionRate]);

  // Churn Impact Data
  const churnImpactData = useMemo(() => {
    const baseRetention = parseNum(retentionRate) / 100;
    const aovVal = parseNum(aov);
    const freq = parseNum(purchaseFrequency);
    const margin = parseNum(profitMargin) / 100;

    return [50, 60, 70, 80, 90, 95].map((retention) => {
      const churn = 1 - retention / 100;
      const avgValue = aovVal * freq;
      const grossProfitVal = avgValue * margin;
      const ltv = churn > 0 ? grossProfitVal / churn : grossProfitVal * 10;
      
      return {
        retention,
        ltv: Math.round(ltv),
        churn: (100 - retention),
        isCurrent: Math.abs(retention - baseRetention * 100) < 5,
      };
    });
  }, [aov, purchaseFrequency, profitMargin, retentionRate]);

  // LTV Breakdown Chart Data
  const ltvBreakdownData = useMemo(() => {
    return [
      { name: "Revenue", value: ltvResults.grossLTV, color: COLORS.ocean },
      { name: "Gross Profit", value: ltvResults.grossProfit * parseNum(customerLifespan), color: COLORS.logistics },
      { name: "CAC", value: -parseNum(cac), color: COLORS.danger },
      { name: "Net LTV", value: ltvResults.netLTV, color: COLORS.teal },
    ];
  }, [ltvResults, cac, customerLifespan]);

  // Sensitivity Analysis
  const sensitivityData = useMemo(() => {
    const baseAOV = parseNum(aov);
    const baseFreq = parseNum(purchaseFrequency);
    const baseRetention = parseNum(retentionRate) / 100;
    const margin = parseNum(profitMargin) / 100;

    const scenarios = [
      { label: "Baseline", aovChange: 0, freqChange: 0, retChange: 0 },
      { label: "+10% AOV", aovChange: 0.1, freqChange: 0, retChange: 0 },
      { label: "+10% Freq", aovChange: 0, freqChange: 0.1, retChange: 0 },
      { label: "+5% Retention", aovChange: 0, freqChange: 0, retChange: 0.05 },
      { label: "All Improved", aovChange: 0.1, freqChange: 0.1, retChange: 0.05 },
    ];

    return scenarios.map((s) => {
      const newAOV = baseAOV * (1 + s.aovChange);
      const newFreq = baseFreq * (1 + s.freqChange);
      const newRetention = Math.min(0.99, baseRetention + s.retChange);
      const churn = 1 - newRetention;
      const avgValue = newAOV * newFreq;
      const grossProfitVal = avgValue * margin;
      const ltv = churn > 0 ? grossProfitVal / churn : grossProfitVal * 10;

      return {
        scenario: s.label,
        ltv: Math.round(ltv),
        improvement: Math.round(((ltv - ltvResults.advancedLTV) / ltvResults.advancedLTV) * 100),
      };
    });
  }, [aov, purchaseFrequency, retentionRate, profitMargin, ltvResults.advancedLTV]);

  // Radial Chart Data for LTV:CAC
  const radialData = useMemo(() => {
    const ratio = Math.min(ltvResults.ltvCacRatio, 6);
    return [
      {
        name: "LTV:CAC",
        value: (ratio / 6) * 100,
        fill: ltvResults.isHealthyRatio ? COLORS.logistics : COLORS.warning,
      },
    ];
  }, [ltvResults.ltvCacRatio, ltvResults.isHealthyRatio]);

  // LTV Components Pie Data
  const ltvPieData = useMemo(() => {
    return [
      { name: "Gross LTV", value: ltvResults.grossLTV, fill: COLORS.ocean },
      { name: "Profit Margin", value: ltvResults.grossProfit * parseNum(customerLifespan), fill: COLORS.logistics },
      { name: "CAC Deduction", value: parseNum(cac), fill: COLORS.danger },
    ];
  }, [ltvResults, cac, customerLifespan]);

  const formatMoney = (value: number) => formatCurrency(value, currency);

  const getRatioGrade = (ratio: number): { grade: string; color: string; description: string } => {
    if (ratio >= 5) return { grade: "A+", color: "text-emerald-500", description: "Exceptional" };
    if (ratio >= 4) return { grade: "A", color: "text-emerald-500", description: "Excellent" };
    if (ratio >= 3) return { grade: "B", color: "text-blue-500", description: "Good" };
    if (ratio >= 2) return { grade: "C", color: "text-amber-500", description: "Average" };
    if (ratio >= 1) return { grade: "D", color: "text-orange-500", description: "Poor" };
    return { grade: "F", color: "text-red-500", description: "Unprofitable" };
  };

  const resetForm = () => {
    setAov("150");
    setPurchaseFrequency("4");
    setCustomerLifespan("3");
    setProfitMargin("30");
    setRetentionRate("75");
    setDiscountRate("10");
    setCac("100");
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.ocean} 0%, ${COLORS.lightOcean} 50%, ${COLORS.logistics} 100%)` 
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <motion.div 
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Badge className="px-4 py-2 text-sm bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Professional Business Analytics
              </Badge>
            </motion.div>
            
            {/* Title */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Customer Lifetime Value
              <br />
              <span className="text-white/90">Calculator</span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Calculate, analyze, and optimize your customer lifetime value with advanced 
              formulas, cohort analysis, and actionable insights for sustainable growth.
            </motion.p>
            
            {/* Key Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: Calculator, label: "5 LTV Formulas", value: "Advanced" },
                { icon: TrendingUp, label: "LTV:CAC Analysis", value: "Real-time" },
                { icon: Users, label: "Cohort Tracking", value: "36 Months" },
                { icon: Target, label: "Accuracy", value: "95%+" },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <stat.icon className="h-6 w-6 mx-auto mb-2 text-white/80" />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path 
              d="M0 80V40C240 0 480 60 720 60C960 60 1200 0 1440 40V80H0Z" 
              fill="hsl(var(--background))" 
            />
          </svg>
        </div>
      </div>

      {/* Main Calculator Section */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="cohort" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Cohort</span>
            </TabsTrigger>
            <TabsTrigger value="churn" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Churn</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Guide</span>
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Card */}
              <Card className="border-l-4 border-l-[#0F4C81]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" style={{ color: COLORS.ocean }} />
                    Customer Metrics
                  </CardTitle>
                  <CardDescription>Enter your customer and business metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Label className="shrink-0">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.slice(0, 15).map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="aov">Average Order Value (AOV)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="aov"
                          type="number"
                          value={aov}
                          onChange={(e) => setAov(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total revenue divided by number of orders
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Purchase Frequency (per year)</Label>
                        <span className="font-bold" style={{ color: COLORS.ocean }}>{purchaseFrequency}x</span>
                      </div>
                      <Slider
                        value={[parseNum(purchaseFrequency)]}
                        onValueChange={(v) => setPurchaseFrequency(v[0].toString())}
                        min={1}
                        max={24}
                        step={0.5}
                        className="[&_[role=slider]]:bg-[#0F4C81]"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1x</span>
                        <span>24x</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Customer Lifespan (years)</Label>
                        <span className="font-bold" style={{ color: COLORS.ocean }}>{customerLifespan} yrs</span>
                      </div>
                      <Slider
                        value={[parseNum(customerLifespan)]}
                        onValueChange={(v) => setCustomerLifespan(v[0].toString())}
                        min={0.5}
                        max={10}
                        step={0.5}
                        className="[&_[role=slider]]:bg-[#0F4C81]"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0.5 yrs</span>
                        <span>10 yrs</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Profit Margin (%)</Label>
                        <span className="font-bold" style={{ color: COLORS.logistics }}>{profitMargin}%</span>
                      </div>
                      <Slider
                        value={[parseNum(profitMargin)]}
                        onValueChange={(v) => setProfitMargin(v[0].toString())}
                        min={5}
                        max={80}
                        step={1}
                        className="[&_[role=slider]]:bg-[#2E8B57]"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5%</span>
                        <span>80%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Customer Retention Rate (%)</Label>
                        <span className="font-bold" style={{ color: COLORS.logistics }}>{retentionRate}%</span>
                      </div>
                      <Slider
                        value={[parseNum(retentionRate)]}
                        onValueChange={(v) => setRetentionRate(v[0].toString())}
                        min={20}
                        max={99}
                        step={1}
                        className="[&_[role=slider]]:bg-[#2E8B57]"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>20%</span>
                        <span>99%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label>Discount Rate for NPV (%)</Label>
                        <span className="font-bold" style={{ color: COLORS.ocean }}>{discountRate}%</span>
                      </div>
                      <Slider
                        value={[parseNum(discountRate)]}
                        onValueChange={(v) => setDiscountRate(v[0].toString())}
                        min={0}
                        max={25}
                        step={0.5}
                        className="[&_[role=slider]]:bg-[#0F4C81]"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>25%</span>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cac">Customer Acquisition Cost (CAC)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cac"
                          type="number"
                          value={cac}
                          onChange={(e) => setCac(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total marketing spend divided by new customers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Card */}
              <Card className="border-l-4 border-l-[#2E8B57]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" style={{ color: COLORS.logistics }} />
                    LTV Results
                  </CardTitle>
                  <CardDescription>Your customer lifetime value analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Main LTV Score */}
                  <div 
                    className="text-center p-6 rounded-xl mb-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${COLORS.ocean}15 0%, ${COLORS.logistics}15 100%)` 
                    }}
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5" style={{ color: COLORS.ocean }} />
                      <span className="text-sm text-muted-foreground">Customer Lifetime Value (Advanced)</span>
                    </div>
                    <p className="text-5xl font-bold" style={{ color: COLORS.ocean }}>
                      {formatMoney(ltvResults.advancedLTV)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on retention-adjusted calculation
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Simple LTV</p>
                      <p className="text-xl font-bold" style={{ color: COLORS.ocean }}>
                        {formatMoney(ltvResults.simpleLTV)}
                      </p>
                      <p className="text-xs text-muted-foreground">AOV × Freq × Years</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">NPV-Adjusted LTV</p>
                      <p className="text-xl font-bold" style={{ color: COLORS.logistics }}>
                        {formatMoney(ltvResults.npvLTV)}
                      </p>
                      <p className="text-xs text-muted-foreground">Discounted cash flows</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* LTV:CAC Ratio */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{ background: `linear-gradient(90deg, ${COLORS.logistics}15 0%, transparent 100%)` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">LTV:CAC Ratio</span>
                      <Badge className={ltvResults.isHealthyRatio ? "bg-emerald-500" : "bg-amber-500"}>
                        {getRatioGrade(ltvResults.ltvCacRatio).grade}
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-4xl font-bold ${getRatioGrade(ltvResults.ltvCacRatio).color}`}>
                        {ltvResults.ltvCacRatio.toFixed(1)}:1
                      </p>
                      <span className="text-sm text-muted-foreground">
                        {getRatioGrade(ltvResults.ltvCacRatio).description}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {ltvResults.isHealthyRatio 
                        ? "Healthy ratio - customers generate good return on acquisition investment"
                        : "Below 3:1 - consider improving retention or reducing CAC"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Payback Period</p>
                      <p className="text-xl font-bold">
                        {ltvResults.monthsToPayback} months
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Churn Rate</p>
                      <p className="text-xl font-bold text-amber-500">
                        {(ltvResults.churnRate * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Avg Customer Value / Year</p>
                    <p className="text-lg font-bold">{formatMoney(ltvResults.avgCustomerValue)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ltvResults.totalPurchases} total purchases over {customerLifespan} year(s)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Quick Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    {ltvResults.ltvCacRatio >= 3 ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">LTV:CAC Health</p>
                      <p className="text-sm text-muted-foreground">
                        {ltvResults.ltvCacRatio >= 3 
                          ? "Your ratio is healthy. Continue optimizing retention."
                          : "Focus on improving retention or reducing acquisition costs."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    {ltvResults.monthsToPayback <= 12 ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Payback Period</p>
                      <p className="text-sm text-muted-foreground">
                        {ltvResults.monthsToPayback <= 12 
                          ? "Fast payback allows quick reinvestment in growth."
                          : "Long payback strains cash flow. Consider reducing CAC."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 shrink-0 mt-0.5" style={{ color: COLORS.logistics }} />
                    <div>
                      <p className="font-medium">Retention Multiplier</p>
                      <p className="text-sm text-muted-foreground">
                        Your {parseNum(retentionRate)}% retention creates a {ltvResults.retentionMultiplier.toFixed(1)}x value multiplier.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* LTV Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" style={{ color: COLORS.ocean }} />
                    LTV Value Breakdown
                  </CardTitle>
                  <CardDescription>How customer value is distributed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ltvBreakdownData.slice(0, 3)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency, true)} />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip formatter={(value: number) => formatMoney(Math.abs(value))} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {ltvBreakdownData.slice(0, 3).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg" style={{ background: `${COLORS.logistics}15` }}>
                      <p className="text-xs text-muted-foreground">Gross LTV</p>
                      <p className="text-lg font-bold" style={{ color: COLORS.logistics }}>
                        {formatMoney(ltvResults.grossLTV)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: `${COLORS.teal}15` }}>
                      <p className="text-xs text-muted-foreground">Net LTV</p>
                      <p className="text-lg font-bold" style={{ color: COLORS.teal }}>
                        {formatMoney(ltvResults.netLTV)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sensitivity Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" style={{ color: COLORS.logistics }} />
                    Sensitivity Analysis
                  </CardTitle>
                  <CardDescription>How improvements affect LTV</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sensitivityData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="scenario" angle={-45} textAnchor="end" height={80} fontSize={11} />
                        <YAxis tickFormatter={(v) => formatCurrency(v, currency, true)} />
                        <Tooltip formatter={(value: number) => formatMoney(value)} />
                        <ReferenceLine y={ltvResults.advancedLTV} stroke={COLORS.ocean} strokeDasharray="5 5" />
                        <Bar dataKey="ltv" radius={[4, 4, 0, 0]}>
                          {sensitivityData.map((entry) => (
                            <Cell 
                              key={`cell-${entry.scenario}`} 
                              fill={entry.improvement > 0 ? COLORS.logistics : COLORS.ocean} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {sensitivityData.slice(1).map((s, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <span>{s.scenario}</span>
                        <Badge variant={s.improvement > 0 ? "default" : "secondary"} style={{ backgroundColor: s.improvement > 0 ? COLORS.logistics : undefined }}>
                          {s.improvement > 0 ? "+" : ""}{s.improvement}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LTV:CAC Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  LTV:CAC Ratio Analysis
                </CardTitle>
                <CardDescription>Understanding your customer economics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-lg bg-muted/50">
                    <div className="w-40 h-40 mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          cx="50%" 
                          cy="50%" 
                          innerRadius="60%" 
                          outerRadius="100%" 
                          startAngle={90} 
                          endAngle={-270}
                          data={radialData}
                        >
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                          />
                          <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="text-3xl font-bold"
                            fill={ltvResults.isHealthyRatio ? COLORS.logistics : COLORS.warning}
                          >
                            {ltvResults.ltvCacRatio.toFixed(1)}:1
                          </text>
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {getRatioGrade(ltvResults.ltvCacRatio).grade} Grade - {getRatioGrade(ltvResults.ltvCacRatio).description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Customer LTV</span>
                        <span className="font-bold" style={{ color: COLORS.ocean }}>{formatMoney(ltvResults.advancedLTV)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Acquisition Cost</span>
                        <span className="font-bold text-red-500">{formatMoney(parseNum(cac))}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Net Customer Value</span>
                        <span className="font-bold" style={{ color: COLORS.logistics }}>{formatMoney(ltvResults.netLTV)}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Payback Period</p>
                      <p className="text-xl font-bold">{ltvResults.monthsToPayback} months</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Time to recover acquisition investment
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Industry Benchmarks</h4>
                    <div className="space-y-2">
                      {[
                        { ratio: 3, label: "Minimum viable", color: "bg-amber-500" },
                        { ratio: 4, label: "Good performance", color: "bg-blue-500" },
                        { ratio: 5, label: "Excellent", color: "bg-emerald-500" },
                      ].map((b) => (
                        <div key={b.ratio} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${b.color}`} />
                          <span className="text-sm flex-1">{b.ratio}:1 - {b.label}</span>
                          {ltvResults.ltvCacRatio >= b.ratio && (
                            <CheckCircle2 className="h-4 w-4" style={{ color: COLORS.logistics }} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* LTV Composition Pie */}
            <Card>
              <CardHeader>
                <CardTitle>LTV Composition</CardTitle>
                <CardDescription>Visual breakdown of customer value components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={ltvPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${formatMoney(value)}`}
                      >
                        {ltvPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatMoney(value)} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cohort Tab */}
          <TabsContent value="cohort" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Cohort Retention Analysis
                </CardTitle>
                <CardDescription>Customer retention and revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={cohortData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" label={{ value: "Months", position: "bottom", offset: -5 }} />
                      <YAxis yAxisId="left" orientation="left" stroke={COLORS.ocean} />
                      <YAxis yAxisId="right" orientation="right" stroke={COLORS.logistics} />
                      <Tooltip />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="retained"
                        name="Retention %"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.3}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="cumulativeRevenue"
                        name="Cumulative Revenue"
                        stroke={COLORS.logistics}
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 grid md:grid-cols-4 gap-4">
                  {[
                    { label: "Month 6 Retention", value: cohortData[6]?.retained || 0, suffix: "%" },
                    { label: "Month 12 Retention", value: cohortData[12]?.retained || 0, suffix: "%" },
                    { label: "Month 24 Retention", value: cohortData[24]?.retained || 0, suffix: "%" },
                    { label: "3-Year Revenue", value: formatMoney(cohortData[36]?.cumulativeRevenue || 0), suffix: "" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-2xl font-bold" style={{ color: COLORS.ocean }}>
                        {typeof item.value === "number" ? item.value.toFixed(1) : item.value}{item.suffix}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cohort Table */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Cohort Breakdown</CardTitle>
                <CardDescription>Retention probability and expected revenue per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-background">
                      <tr className="border-b">
                        <th className="text-left py-2 px-3">Month</th>
                        <th className="text-right py-2 px-3">Retention %</th>
                        <th className="text-right py-2 px-3">Probability</th>
                        <th className="text-right py-2 px-3">Monthly Revenue</th>
                        <th className="text-right py-2 px-3">Cumulative</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohortData.filter((_, i) => i % 3 === 0).map((row) => (
                        <tr key={row.month} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-3 font-medium">Month {row.month}</td>
                          <td className="text-right py-2 px-3">{row.retained.toFixed(1)}%</td>
                          <td className="text-right py-2 px-3">{(row.probability * 100).toFixed(1)}%</td>
                          <td className="text-right py-2 px-3">{formatMoney(row.revenue)}</td>
                          <td className="text-right py-2 px-3 font-medium" style={{ color: COLORS.logistics }}>
                            {formatMoney(row.cumulativeRevenue)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Churn Impact Tab */}
          <TabsContent value="churn" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-500" />
                  Churn Impact Analysis
                </CardTitle>
                <CardDescription>How retention rate affects customer lifetime value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={churnImpactData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="retention" label={{ value: "Retention Rate %", position: "bottom", offset: -5 }} />
                      <YAxis tickFormatter={(v) => formatCurrency(v, currency, true)} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === "ltv" ? formatMoney(value) : `${value}%`,
                          name === "ltv" ? "LTV" : "Churn"
                        ]}
                      />
                      <Bar dataKey="ltv" name="LTV" radius={[4, 4, 0, 0]}>
                        {churnImpactData.map((entry) => (
                          <Cell 
                            key={`cell-${entry.retention}`} 
                            fill={entry.isCurrent ? COLORS.logistics : COLORS.ocean}
                            opacity={entry.isCurrent ? 1 : 0.6}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 p-4 rounded-lg border-2" style={{ borderColor: COLORS.warning, background: `${COLORS.warning}10` }}>
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: COLORS.warning }} />
                    <div className="text-sm">
                      <p className="font-semibold">The Retention Multiplier Effect</p>
                      <p className="mt-1 text-muted-foreground">
                        A 5% improvement in retention rate can increase LTV by up to 25-95% depending on your 
                        baseline. Small retention improvements compound significantly over customer lifetimes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Churn Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Retention vs LTV Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {churnImpactData.slice(0, 3).map((item) => (
                    <div 
                      key={item.retention}
                      className={`p-4 rounded-lg border-2 ${
                        item.isCurrent 
                          ? "border-[#2E8B57]" 
                          : "border-border"
                      }`}
                      style={item.isCurrent ? { background: `${COLORS.logistics}10` } : {}}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">{item.retention}% Retention</span>
                        {item.isCurrent && <Badge style={{ backgroundColor: COLORS.logistics }}>Current</Badge>}
                      </div>
                      <p className="text-2xl font-bold">{formatMoney(item.ltv)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Churn: {item.churn}% | LTV Impact: {item.ltv > ltvResults.advancedLTV ? "+" : ""}
                        {((item.ltv - ltvResults.advancedLTV) / ltvResults.advancedLTV * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  {churnImpactData.slice(3).map((item) => (
                    <div 
                      key={item.retention}
                      className={`p-4 rounded-lg border-2 ${
                        item.isCurrent 
                          ? "border-[#2E8B57]" 
                          : "border-border"
                      }`}
                      style={item.isCurrent ? { background: `${COLORS.logistics}10` } : {}}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">{item.retention}% Retention</span>
                        {item.isCurrent && <Badge style={{ backgroundColor: COLORS.logistics }}>Current</Badge>}
                      </div>
                      <p className="text-2xl font-bold">{formatMoney(item.ltv)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Churn: {item.churn}% | LTV Impact: {item.ltv > ltvResults.advancedLTV ? "+" : ""}
                        {((item.ltv - ltvResults.advancedLTV) / ltvResults.advancedLTV * 100).toFixed(0)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Retention Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Retention Improvement Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Shield, title: "Onboarding Excellence", desc: "Create seamless first experiences with guided tutorials and quick wins", impact: "+15% retention" },
                    { icon: Users, title: "Customer Success Teams", desc: "Proactive outreach and dedicated support for high-value customers", impact: "+20% retention" },
                    { icon: Zap, title: "Loyalty Programs", desc: "Reward repeat purchases with points, tiers, and exclusive benefits", impact: "+12% retention" },
                    { icon: Target, title: "Personalization", desc: "Tailored recommendations and communications based on behavior", impact: "+18% retention" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-lg flex gap-3">
                      <item.icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: COLORS.ocean }} />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="font-medium">{item.title}</p>
                          <Badge variant="secondary" style={{ color: COLORS.logistics }}>{item.impact}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Understanding Customer Lifetime Value
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h3 className="text-lg font-semibold" style={{ color: COLORS.ocean }}>What is Customer Lifetime Value (LTV)?</h3>
                  <p className="text-muted-foreground">
                    Customer Lifetime Value (LTV or CLV) is the total revenue a business can expect from a single 
                    customer account throughout their entire relationship. It considers the customer&apos;s revenue 
                    value and compares it to the company&apos;s predicted customer lifespan.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2" style={{ color: COLORS.ocean }}>Simple LTV Formula</h4>
                      <code className="text-sm bg-background p-2 rounded block">
                        LTV = AOV × Purchase Frequency × Lifespan
                      </code>
                      <p className="text-xs text-muted-foreground mt-2">
                        Quick estimate without retention consideration
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2" style={{ color: COLORS.logistics }}>Advanced LTV Formula</h4>
                      <code className="text-sm bg-background p-2 rounded block">
                        LTV = (AOV × Frequency × Margin) / Churn Rate
                      </code>
                      <p className="text-xs text-muted-foreground mt-2">
                        More accurate, accounts for retention and margins
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.ocean }}>Key Metrics Explained</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="aov">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" style={{ color: COLORS.ocean }} />
                          Average Order Value (AOV)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          AOV measures the average dollar amount spent each time a customer places an order. 
                          Calculate it by dividing total revenue by number of orders. To increase AOV, consider 
                          cross-selling, bundling products, or offering free shipping thresholds.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="frequency">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" style={{ color: COLORS.logistics }} />
                          Purchase Frequency
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          How often customers make purchases within a given time period (usually annually). 
                          Higher purchase frequency directly increases LTV. Improve this through loyalty programs, 
                          email marketing, and subscription models.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="retention">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" style={{ color: COLORS.ocean }} />
                          Customer Retention Rate
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          The percentage of customers who continue buying over time. A 5% increase in retention 
                          can increase profits by 25-95%. Focus on customer success, support quality, and 
                          delivering consistent value.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="cac">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <Target className="h-4 w-4" style={{ color: COLORS.logistics }} />
                          Customer Acquisition Cost (CAC)
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          Total cost to acquire a new customer, including marketing, sales, and onboarding costs. 
                          The LTV:CAC ratio should ideally be 3:1 or higher - meaning each customer generates 
                          at least 3x their acquisition cost in value.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="npv">
                      <AccordionTrigger>
                        <span className="flex items-center gap-2">
                          <Percent className="h-4 w-4" style={{ color: COLORS.ocean }} />
                          NPV-Adjusted LTV
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">
                          Net Present Value accounts for the time value of money - a dollar today is worth more 
                          than a dollar tomorrow. This calculation discounts future revenue to present value, 
                          giving a more realistic LTV for businesses with long customer relationships.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.logistics }}>Strategies to Increase LTV</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: TrendingUp, title: "Increase AOV", desc: "Cross-sell, bundle, upsell, free shipping thresholds" },
                      { icon: Zap, title: "Boost Frequency", desc: "Loyalty programs, subscriptions, email marketing" },
                      { icon: Users, title: "Improve Retention", desc: "Customer success, support quality, consistent value" },
                      { icon: Target, title: "Reduce CAC", desc: "Optimize marketing, referral programs, organic growth" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg flex gap-3">
                        <item.icon className="h-5 w-5 shrink-0 mt-0.5" style={{ color: COLORS.ocean }} />
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Common questions about Customer Lifetime Value</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left">
                        <span className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 shrink-0" style={{ color: COLORS.logistics }} />
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground pl-6">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Industry Benchmarks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Industry LTV Benchmarks
                </CardTitle>
                <CardDescription>Typical LTV ranges by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Industry</th>
                        <th className="text-right py-3 px-4">Avg LTV</th>
                        <th className="text-right py-3 px-4">LTV:CAC Ratio</th>
                        <th className="text-right py-3 px-4">Retention Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { industry: "SaaS/Software", ltv: "$2,500 - $15,000", ratio: "3:1 - 5:1", retention: "85-95%" },
                        { industry: "E-commerce", ltv: "$200 - $1,000", ratio: "3:1 - 4:1", retention: "25-40%" },
                        { industry: "Subscription Box", ltv: "$500 - $2,500", ratio: "3:1 - 5:1", retention: "65-80%" },
                        { industry: "Financial Services", ltv: "$5,000 - $50,000", ratio: "4:1 - 6:1", retention: "90-95%" },
                        { industry: "Telecommunications", ltv: "$2,000 - $10,000", ratio: "4:1 - 5:1", retention: "80-90%" },
                        { industry: "Retail", ltv: "$150 - $500", ratio: "2:1 - 3:1", retention: "20-35%" },
                      ].map((row, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{row.industry}</td>
                          <td className="text-right py-3 px-4" style={{ color: COLORS.ocean }}>{row.ltv}</td>
                          <td className="text-right py-3 px-4">{row.ratio}</td>
                          <td className="text-right py-3 px-4" style={{ color: COLORS.logistics }}>{row.retention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Pro Tips for LTV Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: "Segment Your Customers", desc: "Calculate LTV by customer segment to identify your most valuable audiences and tailor strategies accordingly." },
                    { title: "Track Cohort Behavior", desc: "Monitor how different customer cohorts behave over time to spot retention trends early." },
                    { title: "Balance Growth & Unit Economics", desc: "Don&apos;t scale acquisition until LTV:CAC is healthy. Growth with poor unit economics is unsustainable." },
                  ].map((tip, i) => (
                    <div key={i} className="p-4 rounded-lg border" style={{ borderColor: COLORS.ocean, background: `${COLORS.ocean}05` }}>
                      <p className="font-medium mb-2">{tip.title}</p>
                      <p className="text-sm text-muted-foreground">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t">
          <Button variant="outline" onClick={resetForm}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Values
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Last updated: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
