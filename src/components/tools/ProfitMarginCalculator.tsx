"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  Download,
  Share2,
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
  PieChart,
  BookOpen,
  Building2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Lightbulb,
  Scale,
  LineChart,
  Factory,
  ShoppingBag,
  Truck,
  Globe,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

interface MarginResult {
  revenue: number;
  totalCost: number;
  grossProfit: number;
  grossMargin: number;
  grossMarginPercent: number;
  netProfit: number;
  netMargin: number;
  netMarginPercent: number;
  markup: number;
  markupPercent: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  roi: number;
  breakEvenPrice: number;
}

interface CostBreakdown {
  item: string;
  amount: number;
  percentOfCost: number;
  percentOfRevenue: number;
}

// Brand Colors
const BRAND_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  light: "#E8F4F8",
};

// Industry Benchmarks Data
const industryBenchmarks = [
  {
    industry: "Retail",
    icon: ShoppingBag,
    avgGrossMargin: "25-35%",
    avgNetMargin: "2-5%",
    avgMarkup: "30-50%",
    topPerformers: "40%+",
    notes: "High volume, low margin business. Grocery stores typically at lower end.",
  },
  {
    industry: "Manufacturing",
    icon: Factory,
    avgGrossMargin: "20-35%",
    avgNetMargin: "5-10%",
    avgMarkup: "25-40%",
    topPerformers: "35%+",
    notes: "Varies significantly by product type. Specialty manufacturing commands higher margins.",
  },
  {
    industry: "Logistics & Shipping",
    icon: Truck,
    avgGrossMargin: "15-25%",
    avgNetMargin: "3-7%",
    avgMarkup: "20-35%",
    topPerformers: "30%+",
    notes: "Asset-heavy industry. Technology-enabled logistics companies achieve higher margins.",
  },
  {
    industry: "E-commerce",
    icon: Globe,
    avgGrossMargin: "30-45%",
    avgNetMargin: "5-15%",
    avgMarkup: "40-80%",
    topPerformers: "50%+",
    notes: "Lower overhead but high marketing costs. Niche e-commerce can achieve premium margins.",
  },
  {
    industry: "Wholesale/Distribution",
    icon: Building2,
    avgGrossMargin: "10-20%",
    avgNetMargin: "2-5%",
    avgMarkup: "15-25%",
    topPerformers: "25%+",
    notes: "Volume-driven business. Value-added services improve margins.",
  },
  {
    industry: "Technology/SaaS",
    icon: BarChart3,
    avgGrossMargin: "60-80%",
    avgNetMargin: "15-30%",
    avgMarkup: "150-300%",
    topPerformers: "85%+",
    notes: "Highest margins due to low marginal costs. Scale improves net margins significantly.",
  },
];

// FAQ Data
const faqData = [
  {
    question: "What is the difference between profit margin and markup?",
    answer: "Profit margin and markup are two fundamental concepts in pricing strategy that are often confused. Margin (also called profit margin) is calculated as (Selling Price - Cost) / Selling Price × 100, expressing profit as a percentage of the selling price. Markup is calculated as (Selling Price - Cost) / Cost × 100, expressing profit as a percentage of the cost. For example, if a product costs $60 and sells for $100, the margin is 40% ($40/$100) while the markup is 66.67% ($40/$60). Margin is always lower than markup for the same price-cost relationship. Understanding this distinction is crucial for pricing decisions, as confusing the two can lead to underpricing products and eroding profitability. Most financial reports use margin, while sales teams often think in terms of markup.",
  },
  {
    question: "What is a good profit margin for my business?",
    answer: "A 'good' profit margin varies significantly by industry, business model, and growth stage. For gross margin, most businesses aim for 30-50%, though this varies widely: retail typically operates at 25-35%, manufacturing at 20-35%, and software/SaaS businesses can achieve 70-80%+. Net margins are typically much lower, with 10% considered healthy for most industries, though top performers often exceed 15-20%. New businesses often accept lower margins initially to build market share, then focus on improving efficiency. Consider your industry benchmarks, competitive positioning, and growth objectives when setting margin targets. A margin that's too low threatens sustainability, while one that's too high might indicate pricing that could limit market penetration or invite competition.",
  },
  {
    question: "How do I calculate gross profit margin vs net profit margin?",
    answer: "Gross profit margin and net profit margin measure different aspects of profitability. Gross margin = (Revenue - Cost of Goods Sold) / Revenue × 100, showing how efficiently you produce or acquire your products. It only considers direct costs like materials and manufacturing labor. Net margin = (Revenue - All Expenses) / Revenue × 100, reflecting your overall profitability after all costs including operating expenses, interest, taxes, and one-time items. For example, if revenue is $1,000, COGS is $600, and total expenses are $850, gross margin is 40% while net margin is 15%. Gross margin reveals production/purchasing efficiency, while net margin shows overall business health. A business can have a healthy gross margin but poor net margin due to high operating expenses, signaling the need to control overhead costs.",
  },
  {
    question: "Why is my markup percentage higher than my margin percentage?",
    answer: "Markup is always higher than margin for any profitable product because they use different denominators in their calculations. Markup divides profit by cost (a smaller number), while margin divides profit by selling price (a larger number). This mathematical relationship means a 50% markup yields only a 33.3% margin, and a 100% markup yields a 50% margin. This is why it's crucial to specify which metric you're using when discussing pricing. Many businesses make the mistake of setting prices based on a desired margin but calculating it as markup, resulting in lower-than-expected profitability. The conversion formulas are: Margin = Markup / (1 + Markup), and Markup = Margin / (1 - Margin). Always clarify which metric stakeholders are using to avoid costly pricing mistakes.",
  },
  {
    question: "How can I improve my profit margins?",
    answer: "Improving profit margins requires a multi-faceted approach combining revenue optimization and cost reduction. On the revenue side: increase prices strategically by adding value or targeting less price-sensitive segments; improve product mix toward higher-margin items; reduce discounting and promotions; bundle products to increase average order value. On the cost side: negotiate better terms with suppliers; reduce waste and improve operational efficiency; optimize inventory management to reduce carrying costs; automate processes to lower labor costs; outsource non-core activities. For trading/shipping businesses specifically: consolidate shipments for better freight rates; optimize packaging to reduce dimensional weight charges; use incoterms strategically to control cost responsibility; consider duty drawback programs. Small improvements in multiple areas compound significantly—raising prices 3% while reducing costs 2% can improve net margin by 30% or more on a modest margin base.",
  },
  {
    question: "What costs should I include in my landed cost calculation?",
    answer: "Landed cost includes all expenses to get a product to your doorstep, ready for sale. Core components include: product purchase price; international freight (ocean, air, or ground shipping); customs duties and tariffs based on HTS classification; customs brokerage fees; insurance during transit; port charges and handling fees; inland transportation from port to warehouse; and inspection/quarantine fees if applicable. For comprehensive landed cost, also consider: currency conversion costs and hedging; letters of credit or payment processing fees; warehouse receiving and handling; quality control inspections; and inventory carrying costs. Many businesses underestimate landed costs by 10-20%, leading to margin erosion. Use our calculator to itemize all these costs and understand true product profitability before setting prices. Remember that shipping terms (Incoterms) significantly impact which costs you're responsible for.",
  },
  {
    question: "How do payment processing fees affect my profit margins?",
    answer: "Payment processing fees significantly impact profitability, especially for low-margin businesses. Typical fees include: credit card processing at 2.5-3.5% plus $0.15-0.30 per transaction; PayPal at 2.9-4.4% plus fixed fees; international cards often incur additional 1-2% cross-border fees; and chargeback fees of $20-100 per disputed transaction. On a 10% net margin product, a 3% processing fee consumes 30% of your profit. To mitigate impact: negotiate lower rates based on volume; consider passing fees to customers where legal; optimize for lower-cost payment methods (ACH, bank transfer); set minimum order amounts for card payments; use fee comparison tools to find competitive processors. For international transactions, consider multi-currency processing to reduce conversion fees. Always factor these fees into your pricing—our calculator includes them to show true profitability.",
  },
];

export function ProfitMarginCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Basic inputs
  const [sellingPrice, setSellingPrice] = useState<string>("100");
  const [costOfGoods, setCostOfGoods] = useState<string>("60");
  const [quantity, setQuantity] = useState<string>("1");
  
  // Additional costs
  const [freightCost, setFreightCost] = useState<string>("5");
  const [customsDuty, setCustomsDuty] = useState<string>("3");
  const [insuranceCost, setInsuranceCost] = useState<string>("1");
  const [otherCosts, setOtherCosts] = useState<string>("2");
  
  // Operating costs
  const [marketingCost, setMarketingCost] = useState<string>("5");
  const [overheadCost, setOverheadCost] = useState<string>("3");
  const [paymentFees, setPaymentFees] = useState<string>("2.9");
  
  // Analysis parameters
  const [targetMargin, setTargetMargin] = useState<number>(30);
  const [volumeRange, setVolumeRange] = useState<number>(100);

  const parseNum = (val: string) => parseFloat(val) || 0;

  const calculation = useMemo((): MarginResult => {
    const price = parseNum(sellingPrice);
    const cogs = parseNum(costOfGoods);
    const qty = parseNum(quantity);
    const freight = parseNum(freightCost);
    const duty = parseNum(customsDuty);
    const insurance = parseNum(insuranceCost);
    const other = parseNum(otherCosts);
    const marketing = parseNum(marketingCost);
    const overhead = parseNum(overheadCost);
    const fees = parseNum(paymentFees);

    const revenue = price * qty;
    const totalLandedCost = cogs + freight + duty + insurance + other;
    const totalCost = (totalLandedCost + marketing + overhead + (price * fees / 100)) * qty;
    const grossProfit = (price - totalLandedCost) * qty;
    const grossMargin = grossProfit;
    const grossMarginPercent = price > 0 ? ((price - totalLandedCost) / price) * 100 : 0;
    const netProfit = revenue - totalCost;
    const netMargin = netProfit;
    const netMarginPercent = revenue > 0 ? (netProfit / revenue) * 100 : 0;
    const markup = price - totalLandedCost;
    const markupPercent = totalLandedCost > 0 ? ((price - totalLandedCost) / totalLandedCost) * 100 : 0;
    
    const fixedCosts = (marketing + overhead) * qty;
    const contributionMargin = price - totalLandedCost;
    const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
    const breakEvenRevenue = breakEvenUnits * price;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    const breakEvenPrice = totalLandedCost / (1 - targetMargin / 100);

    return {
      revenue,
      totalCost,
      grossProfit,
      grossMargin,
      grossMarginPercent,
      netProfit,
      netMargin,
      netMarginPercent,
      markup,
      markupPercent,
      breakEvenUnits,
      breakEvenRevenue,
      roi,
      breakEvenPrice,
    };
  }, [
    sellingPrice, costOfGoods, quantity, freightCost, customsDuty,
    insuranceCost, otherCosts, marketingCost, overheadCost, paymentFees, targetMargin
  ]);

  const costBreakdown = useMemo((): CostBreakdown[] => {
    const cogs = parseNum(costOfGoods);
    const freight = parseNum(freightCost);
    const duty = parseNum(customsDuty);
    const insurance = parseNum(insuranceCost);
    const other = parseNum(otherCosts);
    const marketing = parseNum(marketingCost);
    const overhead = parseNum(overheadCost);
    const price = parseNum(sellingPrice);
    
    const totalCost = cogs + freight + duty + insurance + other + marketing + overhead + (price * parseNum(paymentFees) / 100);
    
    const items: CostBreakdown[] = [
      { item: "Product Cost", amount: cogs, percentOfCost: totalCost > 0 ? (cogs / totalCost) * 100 : 0, percentOfRevenue: price > 0 ? (cogs / price) * 100 : 0 },
      { item: "Freight", amount: freight, percentOfCost: totalCost > 0 ? (freight / totalCost) * 100 : 0, percentOfRevenue: price > 0 ? (freight / price) * 100 : 0 },
      { item: "Customs Duty", amount: duty, percentOfCost: totalCost > 0 ? (duty / totalCost) * 100 : 0, percentOfRevenue: price > 0 ? (duty / price) * 100 : 0 },
      { item: "Insurance", amount: insurance, percentOfCost: totalCost > 0 ? (insurance / totalCost) * 100 : 0, percentOfRevenue: price > 0 ? (insurance / price) * 100 : 0 },
      { item: "Marketing", amount: marketing, percentOfCost: totalCost > 0 ? (marketing / totalCost) * 100 : 0, percentOfRevenue: price > 0 ? (marketing / price) * 100 : 0 },
      { item: "Overhead", amount: overhead, percentOfCost: totalCost > 0 ? (overhead / totalCost) * 100 : 0, percentOfRevenue: price > 0 ? (overhead / price) * 100 : 0 },
      { item: "Payment Fees", amount: price * parseNum(paymentFees) / 100, percentOfCost: totalCost > 0 ? ((price * parseNum(paymentFees) / 100) / totalCost) * 100 : 0, percentOfRevenue: parseNum(paymentFees) },
    ];
    
    return items.filter(item => item.amount > 0);
  }, [costOfGoods, freightCost, customsDuty, insuranceCost, otherCosts, marketingCost, overheadCost, paymentFees, sellingPrice]);

  // Pie chart data for cost breakdown
  const pieChartData = useMemo(() => {
    return costBreakdown.map((item, index) => ({
      name: item.item,
      value: item.amount,
      percent: item.percentOfCost,
    }));
  }, [costBreakdown]);

  const COLORS = [BRAND_COLORS.ocean, BRAND_COLORS.logistics, '#3b82f6', BRAND_COLORS.warning, '#8b5cf6', '#ec4899', '#6366f1'];

  // Margin vs Markup comparison data
  const marginMarkupData = useMemo(() => {
    const baseCost = parseNum(costOfGoods) + parseNum(freightCost) + parseNum(customsDuty) + parseNum(insuranceCost) + parseNum(otherCosts);
    const data = [];
    
    for (let markup = 10; markup <= 100; markup += 10) {
      const price = baseCost * (1 + markup / 100);
      const margin = price > 0 ? ((price - baseCost) / price) * 100 : 0;
      
      data.push({
        markup,
        margin: parseFloat(margin.toFixed(1)),
        price: parseFloat(price.toFixed(2)),
      });
    }
    
    return data;
  }, [costOfGoods, freightCost, customsDuty, insuranceCost, otherCosts]);

  // Sensitivity analysis data
  const sensitivityData = useMemo(() => {
    const basePrice = parseNum(sellingPrice);
    const data = [];
    
    for (let priceChange = -20; priceChange <= 20; priceChange += 5) {
      const adjustedPrice = basePrice * (1 + priceChange / 100);
      const cogs = parseNum(costOfGoods) + parseNum(freightCost) + parseNum(customsDuty) + parseNum(insuranceCost) + parseNum(otherCosts);
      const operatingCosts = parseNum(marketingCost) + parseNum(overheadCost) + (adjustedPrice * parseNum(paymentFees) / 100);
      const margin = adjustedPrice > 0 ? ((adjustedPrice - cogs - operatingCosts) / adjustedPrice) * 100 : 0;
      const profit = (adjustedPrice - cogs - operatingCosts) * parseNum(quantity);
      
      data.push({
        priceChange: `${priceChange > 0 ? '+' : ''}${priceChange}%`,
        margin: parseFloat(margin.toFixed(1)),
        profit: parseFloat(profit.toFixed(2)),
        price: parseFloat(adjustedPrice.toFixed(2)),
      });
    }
    
    return data;
  }, [sellingPrice, costOfGoods, freightCost, customsDuty, insuranceCost, otherCosts, marketingCost, overheadCost, paymentFees, quantity]);

  // Volume profitability data
  const volumeData = useMemo(() => {
    const baseQty = parseNum(quantity);
    const data = [];
    
    for (let mult = 1; mult <= 10; mult++) {
      const qty = baseQty * mult;
      const revenue = parseNum(sellingPrice) * qty;
      const cogs = (parseNum(costOfGoods) + parseNum(freightCost) + parseNum(customsDuty) + parseNum(insuranceCost) + parseNum(otherCosts)) * qty;
      const operatingCosts = (parseNum(marketingCost) + parseNum(overheadCost)) * qty + (revenue * parseNum(paymentFees) / 100);
      const profit = revenue - cogs - operatingCosts;
      
      data.push({
        volume: qty,
        revenue: parseFloat(revenue.toFixed(2)),
        cost: parseFloat((cogs + operatingCosts).toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        margin: revenue > 0 ? parseFloat(((profit / revenue) * 100).toFixed(1)) : 0,
      });
    }
    
    return data;
  }, [sellingPrice, costOfGoods, freightCost, customsDuty, insuranceCost, otherCosts, marketingCost, overheadCost, paymentFees, quantity]);

  const getMarginColor = (margin: number) => {
    if (margin >= 30) return "text-green-500";
    if (margin >= 15) return "text-yellow-500";
    return "text-red-500";
  };

  const getMarginBadge = (margin: number) => {
    if (margin >= 30) return <Badge className="bg-[var(--logistics)]">Healthy</Badge>;
    if (margin >= 15) return <Badge className="bg-yellow-500">Moderate</Badge>;
    return <Badge className="bg-red-500">Low</Badge>;
  };

  const handleReset = () => {
    setSellingPrice("100");
    setCostOfGoods("60");
    setQuantity("1");
    setFreightCost("5");
    setCustomsDuty("3");
    setInsuranceCost("1");
    setOtherCosts("2");
    setMarketingCost("5");
    setOverheadCost("3");
    setPaymentFees("2.9");
    setTargetMargin(30);
  };

  const handleExport = () => {
    const data = {
      inputs: {
        sellingPrice: parseNum(sellingPrice),
        costOfGoods: parseNum(costOfGoods),
        quantity: parseNum(quantity),
        freightCost: parseNum(freightCost),
        customsDuty: parseNum(customsDuty),
        insuranceCost: parseNum(insuranceCost),
        otherCosts: parseNum(otherCosts),
        marketingCost: parseNum(marketingCost),
        overheadCost: parseNum(overheadCost),
        paymentFees: parseNum(paymentFees),
      },
      results: calculation,
      currency,
      exportedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Profit Margin Analysis',
      text: `Check out my profit analysis: ${calculation.netMarginPercent.toFixed(1)}% net margin, ${calculation.roi.toFixed(1)}% ROI`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(`${shareData.title}: ${shareData.text}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge 
              variant="secondary" 
              className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30"
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center gap-1"
              >
                <TrendingUp className="h-3 w-3" />
                Profitability Analysis
              </motion.span>
            </Badge>
            
            <h1 className="text-3xl font-bold mb-2">Profit Margin Calculator</h1>
            <p className="text-white/80 max-w-2xl mb-6">
              Analyze your product profitability with comprehensive cost breakdowns, margin calculations, 
              and industry benchmarking for international trade and shipping businesses.
            </p>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/15 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Percent className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Gross Margin</span>
              </div>
              <p className="text-2xl font-bold">{calculation.grossMarginPercent.toFixed(1)}%</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/15 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <ArrowUpRight className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Markup</span>
              </div>
              <p className="text-2xl font-bold">{calculation.markupPercent.toFixed(1)}%</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/15 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">ROI</span>
              </div>
              <p className="text-2xl font-bold">{calculation.roi.toFixed(1)}%</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/15 backdrop-blur-sm rounded-lg p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Net Profit</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(calculation.netProfit, currency)}</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex flex-col items-center gap-1 py-2">
            <Calculator className="h-4 w-4" />
            <span className="text-xs">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex flex-col items-center gap-1 py-2">
            <PieChart className="h-4 w-4" />
            <span className="text-xs">Cost Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex flex-col items-center gap-1 py-2">
            <Scale className="h-4 w-4" />
            <span className="text-xs">Margin vs Markup</span>
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="flex flex-col items-center gap-1 py-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Benchmarks</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex flex-col items-center gap-1 py-2">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Input Parameters
                </CardTitle>
                <CardDescription>Enter your pricing and cost information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Label className="shrink-0">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.slice(0, 20).map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="sellingPrice">Selling Price (per unit)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="sellingPrice"
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="costOfGoods">Product Cost (per unit)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="costOfGoods"
                        type="number"
                        value={costOfGoods}
                        onChange={(e) => setCostOfGoods(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card style={{ borderColor: `${BRAND_COLORS.ocean}30` }} className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Profitability Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                      {formatCurrency(calculation.revenue, currency)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-2xl font-bold text-muted-foreground">
                      {formatCurrency(calculation.totalCost, currency)}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Gross Profit</p>
                    <p className={`text-xl font-bold ${calculation.grossProfit >= 0 ? '' : 'text-destructive'}`} style={calculation.grossProfit >= 0 ? { color: BRAND_COLORS.logistics } : {}}>
                      {formatCurrency(calculation.grossProfit, currency)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Gross Margin</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-xl font-bold ${getMarginColor(calculation.grossMarginPercent)}`}>
                        {calculation.grossMarginPercent.toFixed(1)}%
                      </p>
                      {getMarginBadge(calculation.grossMarginPercent)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Net Profit</span>
                    <span className={`text-xl font-bold ${calculation.netProfit >= 0 ? '' : 'text-destructive'}`} style={calculation.netProfit >= 0 ? { color: BRAND_COLORS.logistics } : {}}>
                      {formatCurrency(calculation.netProfit, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Net Margin</span>
                    <span className={`font-bold ${getMarginColor(calculation.netMarginPercent)}`}>
                      {calculation.netMarginPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Markup</span>
                    <span className="font-bold">{calculation.markupPercent.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ROI</span>
                    <span className={`font-bold ${calculation.roi >= 0 ? '' : 'text-destructive'}`} style={calculation.roi >= 0 ? { color: BRAND_COLORS.logistics } : {}}>
                      {calculation.roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Costs */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Landed Costs (per unit)
                </CardTitle>
                <CardDescription>Import and logistics costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="freightCost">Freight Cost</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="freightCost"
                        type="number"
                        value={freightCost}
                        onChange={(e) => setFreightCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customsDuty">Customs Duty</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="customsDuty"
                        type="number"
                        value={customsDuty}
                        onChange={(e) => setCustomsDuty(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="insuranceCost">Insurance</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="insuranceCost"
                        type="number"
                        value={insuranceCost}
                        onChange={(e) => setInsuranceCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="otherCosts">Other Import Costs</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otherCosts"
                        type="number"
                        value={otherCosts}
                        onChange={(e) => setOtherCosts(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Operating Costs
                </CardTitle>
                <CardDescription>Selling and administrative expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="marketingCost">Marketing Cost (per unit)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="marketingCost"
                        type="number"
                        value={marketingCost}
                        onChange={(e) => setMarketingCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="overheadCost">Overhead (per unit)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="overheadCost"
                        type="number"
                        value={overheadCost}
                        onChange={(e) => setOverheadCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentFees">Payment Processing Fee (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="paymentFees"
                        type="number"
                        step="0.1"
                        value={paymentFees}
                        onChange={(e) => setPaymentFees(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <Info className="h-3 w-3 inline mr-1" />
                      Typical fees: Stripe 2.9% + $0.30, PayPal 2.9% + $0.30
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Cost Analysis */}
        <TabsContent value="costs" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Cost Distribution
                </CardTitle>
                <CardDescription>Visual breakdown of your cost structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${percent.toFixed(1)}%`}
                        labelLine={true}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrency(value, currency),
                          name
                        ]}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown Details</CardTitle>
                <CardDescription>Itemized cost analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">Cost Item</th>
                        <th className="text-right py-3 px-2 font-semibold">Amount</th>
                        <th className="text-right py-3 px-2 font-semibold">% of Cost</th>
                        <th className="text-right py-3 px-2 font-semibold">% of Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costBreakdown.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-2 flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            {item.item}
                          </td>
                          <td className="text-right py-3 px-2 font-medium">
                            {formatCurrency(item.amount, currency)}
                          </td>
                          <td className="text-right py-3 px-2">
                            {item.percentOfCost.toFixed(1)}%
                          </td>
                          <td className="text-right py-3 px-2">
                            {item.percentOfRevenue.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profitability Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Profitability Trend by Volume
              </CardTitle>
              <CardDescription>How profit scales as you increase sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="volume" tickFormatter={(v) => v.toString()} label={{ value: 'Units', position: 'bottom', offset: -5 }} />
                    <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v, currency)} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "margin" ? `${value.toFixed(1)}%` : formatCurrency(value, currency),
                        name === "margin" ? "Margin %" : name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill={BRAND_COLORS.ocean} name="revenue" opacity={0.6} />
                    <Bar yAxisId="left" dataKey="cost" fill={BRAND_COLORS.danger} name="cost" opacity={0.6} />
                    <Line yAxisId="left" type="monotone" dataKey="profit" stroke={BRAND_COLORS.logistics} strokeWidth={3} name="profit" dot={{ fill: BRAND_COLORS.logistics }} />
                    <Line yAxisId="right" type="monotone" dataKey="margin" stroke={BRAND_COLORS.warning} strokeWidth={2} strokeDasharray="5 5" name="margin" dot={{ fill: BRAND_COLORS.warning }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Margin vs Markup */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-2" style={{ borderColor: `${BRAND_COLORS.ocean}30` }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Understanding Profit Margin vs Markup
              </CardTitle>
              <CardDescription>
                Master the fundamental concepts of pricing and profitability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  <strong>Profit Margin</strong> and <strong>Markup</strong> are two critical metrics that every business owner, trader, and financial professional must understand. While they both measure profitability, they do so from different perspectives and are calculated differently, leading to common confusion that can result in pricing errors and lost profits.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Profit Margin Formula
                    </h4>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded font-mono text-center text-lg mb-2">
                      Margin = (Price - Cost) / Price × 100
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Margin expresses profit as a percentage of the selling price. It tells you what portion of each dollar of revenue is profit.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4" />
                      Markup Formula
                    </h4>
                    <div className="bg-white dark:bg-gray-900 p-3 rounded font-mono text-center text-lg mb-2">
                      Markup = (Price - Cost) / Cost × 100
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      Markup expresses profit as a percentage of the cost. It tells you how much you've added to your cost to arrive at the selling price.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gross vs Net Profit Margin */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                Gross Profit vs Net Profit Margin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-lg border" style={{ borderColor: `${BRAND_COLORS.ocean}30`, backgroundColor: `${BRAND_COLORS.ocean}08` }}>
                  <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.ocean }}>Gross Profit Margin</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gross profit margin measures the percentage of revenue that exceeds the cost of goods sold (COGS). It reflects how efficiently a company produces or acquires its products. This metric only considers direct costs like raw materials, manufacturing labor, and direct production expenses. A healthy gross margin varies by industry—retail typically sees 25-35%, while software companies can achieve 70%+. Low gross margins indicate either pricing pressure, high production costs, or both.
                  </p>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded font-mono text-sm">
                    Gross Margin = (Revenue - COGS) / Revenue × 100
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border" style={{ borderColor: `${BRAND_COLORS.logistics}30`, backgroundColor: `${BRAND_COLORS.logistics}08` }}>
                  <h4 className="font-semibold mb-3" style={{ color: BRAND_COLORS.logistics }}>Net Profit Margin</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Net profit margin reflects the overall profitability after accounting for all expenses, including operating costs, interest, taxes, and one-time charges. It shows what percentage of each revenue dollar becomes actual profit. This is the "bottom line" metric that investors and lenders scrutinize most. A 10% net margin is generally considered healthy, while 20%+ indicates excellent operational efficiency. Businesses with healthy gross margins but poor net margins often have bloated operating expenses.
                  </p>
                  <div className="bg-white dark:bg-gray-900 p-2 rounded font-mono text-sm">
                    Net Margin = (Revenue - All Expenses) / Revenue × 100
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Margin vs Markup Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Margin vs Markup Relationship</CardTitle>
              <CardDescription>See how margin and markup values differ at various price points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={marginMarkupData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="markup" label={{ value: 'Markup %', position: 'bottom', offset: -5 }} />
                    <YAxis yAxisId="left" tickFormatter={(v) => `${v}%`} label={{ value: 'Margin %', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatCurrency(v, currency)} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "price" ? formatCurrency(value, currency) : `${value}%`,
                        name === "margin" ? "Margin %" : name === "markup" ? "Markup %" : "Price"
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="margin" fill={BRAND_COLORS.ocean} name="margin" opacity={0.7} />
                    <Line yAxisId="right" type="monotone" dataKey="price" stroke={BRAND_COLORS.logistics} strokeWidth={2} name="price" dot={{ fill: BRAND_COLORS.logistics }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Markup %</th>
                      <th className="text-left py-2 px-4">Margin %</th>
                      <th className="text-left py-2 px-4">Selling Price</th>
                      <th className="text-left py-2 px-4">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marginMarkupData.slice(0, 6).map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4 font-medium">{row.markup}%</td>
                        <td className="py-2 px-4" style={{ color: BRAND_COLORS.ocean }}>{row.margin}%</td>
                        <td className="py-2 px-4">{formatCurrency(row.price, currency)}</td>
                        <td className="py-2 px-4 text-muted-foreground">{(row.markup - row.margin).toFixed(1)}% difference</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* How to Improve Margins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                How to Improve Profit Margins
              </CardTitle>
              <CardDescription>Strategic approaches to enhance profitability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold" style={{ color: BRAND_COLORS.ocean }}>Revenue Optimization</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span><strong>Strategic Pricing:</strong> Implement value-based pricing by emphasizing quality, service, or exclusivity rather than competing solely on price.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span><strong>Product Mix:</strong> Shift focus to higher-margin products or services. Consider discontinuing low-margin items that consume resources.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span><strong>Reduce Discounting:</strong> Limit promotional activities and train sales teams to sell on value rather than price cuts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                      <span><strong>Bundling:</strong> Create product bundles that increase average order value while optimizing margin across the bundle.</span>
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold" style={{ color: BRAND_COLORS.logistics }}>Cost Reduction</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span><strong>Supplier Negotiation:</strong> Consolidate purchases, negotiate volume discounts, and explore alternative suppliers for better terms.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span><strong>Operational Efficiency:</strong> Automate processes, reduce waste, and optimize inventory management to lower carrying costs.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span><strong>Shipping Optimization:</strong> Consolidate shipments, negotiate freight rates, and use optimal Incoterms for your situation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      <span><strong>Overhead Control:</strong> Review fixed costs regularly, consider outsourcing non-core functions, and embrace remote work where possible.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Industry Benchmarks */}
        <TabsContent value="benchmarks" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Industry Profit Margin Benchmarks
              </CardTitle>
              <CardDescription>
                Compare your margins against industry standards and top performers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Industry</th>
                      <th className="text-right py-3 px-4 font-semibold">Avg Gross Margin</th>
                      <th className="text-right py-3 px-4 font-semibold">Avg Net Margin</th>
                      <th className="text-right py-3 px-4 font-semibold">Avg Markup</th>
                      <th className="text-right py-3 px-4 font-semibold">Top Performers</th>
                      <th className="text-left py-3 px-4 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {industryBenchmarks.map((industry, index) => {
                      const Icon = industry.icon;
                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                              >
                                <Icon className="h-4 w-4" style={{ color: COLORS[index % COLORS.length] }} />
                              </div>
                              <span className="font-medium">{industry.industry}</span>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 font-medium" style={{ color: BRAND_COLORS.ocean }}>
                            {industry.avgGrossMargin}
                          </td>
                          <td className="text-right py-3 px-4" style={{ color: BRAND_COLORS.logistics }}>
                            {industry.avgNetMargin}
                          </td>
                          <td className="text-right py-3 px-4">{industry.avgMarkup}</td>
                          <td className="text-right py-3 px-4 font-medium text-amber-600">{industry.topPerformers}</td>
                          <td className="py-3 px-4 text-muted-foreground text-xs max-w-xs">{industry.notes}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Your Position */}
          <Card style={{ borderColor: `${BRAND_COLORS.ocean}30` }} className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Your Position vs Industry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.ocean}08` }}>
                  <p className="text-sm text-muted-foreground mb-2">Your Gross Margin</p>
                  <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                    {calculation.grossMarginPercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {calculation.grossMarginPercent >= 30 ? "Above average" : calculation.grossMarginPercent >= 20 ? "Near average" : "Below average"}
                  </p>
                </div>
                
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.logistics}08` }}>
                  <p className="text-sm text-muted-foreground mb-2">Your Net Margin</p>
                  <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                    {calculation.netMarginPercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {calculation.netMarginPercent >= 15 ? "Excellent" : calculation.netMarginPercent >= 10 ? "Good" : calculation.netMarginPercent >= 5 ? "Average" : "Below average"}
                  </p>
                </div>
                
                <div className="text-center p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.warning}08` }}>
                  <p className="text-sm text-muted-foreground mb-2">Your Markup</p>
                  <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                    {calculation.markupPercent.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {calculation.markupPercent >= 50 ? "High margin business" : calculation.markupPercent >= 30 ? "Standard business" : "Low margin business"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Margin Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Target Margin Pricing
              </CardTitle>
              <CardDescription>Find your optimal selling price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Target Margin</Label>
                  <span className="font-bold" style={{ color: BRAND_COLORS.ocean }}>{targetMargin}%</span>
                </div>
                <Slider
                  value={[targetMargin]}
                  onValueChange={(v) => setTargetMargin(v[0])}
                  min={5}
                  max={60}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5%</span>
                  <span>60%</span>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.ocean}10` }}>
                <p className="text-sm text-muted-foreground mb-1">
                  To achieve {targetMargin}% margin:
                </p>
                <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                  Price: {formatCurrency(calculation.breakEvenPrice, currency)}
                </p>
              </div>

              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="priceChange" label={{ value: 'Price Change', position: 'bottom', offset: -5 }} />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "margin" ? `${value.toFixed(1)}%` : formatCurrency(value, currency),
                        name === "margin" ? "Net Margin" : "Profit"
                      ]}
                    />
                    <ReferenceLine y={targetMargin} stroke={BRAND_COLORS.ocean} strokeDasharray="5 5" label={{ value: `Target: ${targetMargin}%`, position: 'right' }} />
                    <Area
                      type="monotone"
                      dataKey="margin"
                      stroke={BRAND_COLORS.logistics}
                      fill={BRAND_COLORS.logistics}
                      fillOpacity={0.3}
                      name="margin"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about profit margins, markup, and pricing strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                    style={{ borderColor: expandedFaq === index ? BRAND_COLORS.ocean : undefined }}
                  >
                    <button
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    >
                      <span className="font-medium pr-4">{faq.question}</span>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-5 w-5 shrink-0" style={{ color: BRAND_COLORS.ocean }} />
                      ) : (
                        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4"
                      >
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" onClick={handleExport} className="text-white" style={{ backgroundColor: BRAND_COLORS.ocean }}>
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
      </div>
    </div>
  );
}
