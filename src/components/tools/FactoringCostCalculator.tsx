"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info,
  RefreshCcw,
  Building2,
  Clock,
  ArrowRight,
  PieChart,
  Download,
  Share2,
  BarChart3,
  BookOpen,
  HelpCircle,
  Zap,
  Wallet,
  LineChart as LineChartIcon,
  Shield,
  Target,
  AlertTriangle,
  FileText,
  Scale,
  Users,
  CreditCard,
  Banknote,
  ArrowUpRight,
  Sparkles,
  TrendingDown,
  Activity,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  ReferenceLine,
} from "recharts";

interface FactoringResult {
  totalInvoices: number;
  advanceAmount: number;
  reserveAmount: number;
  factoringFee: number;
  discountRate: number;
  effectiveAPR: number;
  netCashReceived: number;
  averageCollectionPeriod: number;
  annualizedCost: number;
  breakDown: {
    serviceFee: number;
    interestCost: number;
    additionalFees: number;
  };
}

interface ScenarioData {
  name: string;
  apr: number;
  netCash: number;
  totalFees: number;
  advanceAmount: number;
}

const factoringTypes = [
  {
    id: "recourse",
    name: "Recourse Factoring",
    description: "You buy back unpaid invoices",
    risk: "Lower cost, higher risk",
    advanceRate: "80-90%",
    feeRange: "1-3%",
    icon: Shield,
    color: "#0F4C81",
  },
  {
    id: "non-recourse",
    name: "Non-Recourse Factoring",
    description: "Factor assumes credit risk",
    risk: "Higher cost, no risk",
    advanceRate: "75-85%",
    feeRange: "2-5%",
    icon: Wallet,
    color: "#2E8B57",
  },
  {
    id: "spot",
    name: "Spot Factoring",
    description: "Factor single invoices",
    risk: "Flexible, higher per-invoice cost",
    advanceRate: "70-85%",
    feeRange: "3-6%",
    icon: Target,
    color: "#F59E0B",
  },
  {
    id: "maturity",
    name: "Maturity Factoring",
    description: "Payment on fixed date",
    risk: "Predictable timing",
    advanceRate: "75-90%",
    feeRange: "1.5-3%",
    icon: Calendar,
    color: "#8B5CF6",
  }
];

const FAQS = [
  {
    question: "What is invoice factoring and how does it work?",
    answer: "Invoice factoring is a financial transaction where businesses sell their accounts receivable (invoices) to a third party (called a factor) at a discount. This provides immediate cash flow instead of waiting 30, 60, or 90 days for customer payment. The factor typically advances 70-90% of the invoice value upfront, then collects payment from your customers. Once paid, the factor releases the remaining balance minus their fees. It's an effective way for businesses to improve cash flow without taking on additional debt. Factoring is particularly popular in industries with long payment cycles such as manufacturing, transportation, staffing, and wholesale distribution. The process is straightforward: you submit your invoices to the factor, receive an advance within 24-48 hours, and the factor handles collections from your customers.",
  },
  {
    question: "What's the difference between recourse and non-recourse factoring?",
    answer: "In recourse factoring, your business must buy back any invoices that the factor cannot collect from your customers. This means you bear the credit risk, but the fees are lower (typically 1-3%). Non-recourse factoring means the factor assumes the credit risk - if your customer doesn't pay due to insolvency, the factor absorbs the loss. This provides greater protection but comes with higher fees (typically 2-5%) and stricter customer credit requirements. Recourse factoring is ideal for businesses with creditworthy customers and a desire to minimize costs. Non-recourse is better when dealing with new customers, industries with higher insolvency rates, or when you want to eliminate credit risk entirely. Some factors offer modified recourse arrangements that provide partial protection against specific risks.",
  },
  {
    question: "How is the effective APR calculated for factoring?",
    answer: "The effective APR for factoring is calculated by annualizing the total cost relative to the advance amount and the time period. The formula is: APR = (Total Fees / Advance Amount) × (365 / Collection Days) × 100. For example, if you pay $2,500 in fees on a $85,000 advance for a 45-day collection period, the APR would be approximately 23.8%. This helps you compare factoring costs with other financing options like bank loans or lines of credit. It's important to include ALL fees in this calculation: the factoring fee, interest charges, wire transfer fees, application fees, and any other charges. Some factors advertise low fees but add numerous ancillary charges, making the true APR much higher than advertised. Always request a full breakdown of all costs.",
  },
  {
    question: "What are typical factoring fees and advance rates?",
    answer: "Factoring fees typically range from 1% to 5% of the invoice value, depending on the factoring type, your customers' creditworthiness, invoice volume, and industry. Advance rates generally range from 70% to 90%. Recourse factoring offers the best rates (80-90% advance, 1-3% fees), while spot factoring is most expensive (70-85% advance, 3-6% fees). Factors also charge interest on the advance amount during the collection period, which adds to the total cost. The monthly volume of invoices you factor significantly impacts pricing - businesses factoring $100,000+ monthly typically receive better rates than those factoring sporadically. Industry risk profiles also matter; staffing and transportation companies often see higher rates than established manufacturers. Building a track record with a factor can lead to improved terms over time.",
  },
  {
    question: "Is factoring right for my business?",
    answer: "Factoring works best for B2B businesses with reliable customers but long payment terms that strain cash flow. It's particularly useful for startups without credit history, seasonal businesses with uneven revenue, and companies experiencing rapid growth. However, it's not ideal if your margins are too thin to absorb factoring costs, your customers have poor credit, or you're uncomfortable with the factor contacting your customers for payment. Consider your profit margins carefully - if factoring costs consume 3-5% of your revenue, you need sufficient margins to remain profitable. Factoring is also valuable when traditional bank financing isn't available due to limited operating history or collateral. The decision should factor in not just costs, but the value of predictable cash flow, outsourced collections, and the ability to take on larger orders or clients without cash constraints.",
  },
  {
    question: "How does factoring affect my customer relationships?",
    answer: "With notification factoring (most common), the factor contacts your customers directly for payment, which some businesses prefer as it outsources collections. This is transparent and customers understand it's a financial arrangement. With non-notification factoring, you continue collecting payments, maintaining the customer relationship directly. Most customers today are familiar with factoring and view it as a normal business practice, especially in industries like manufacturing, transportation, and staffing. The key is communication - informing customers beforehand that you're working with a factor prevents confusion when they receive payment instructions from a third party. Many businesses find that factoring actually improves customer relationships by allowing them to offer more flexible payment terms, fulfill orders faster, and focus on service rather than collections.",
  },
];

// Handshake icon fallback
const Handshake = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 17a1 1 0 0 1 2 0" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    <path d="m9 12 3-3 3 3" />
    <path d="M5 21h14" />
    <path d="M3 12h18" />
  </svg>
);

const PRO_TIPS = [
  {
    title: "Compare Multiple Factors",
    description: "Get quotes from at least 3-5 factoring companies. Rates can vary significantly based on your industry, customer base, and monthly volume. Don't just compare the factoring fee percentage - look at the total cost including interest rates, wire fees, and any monthly minimums.",
    icon: Scale,
  },
  {
    title: "Negotiate Volume Discounts",
    description: "If you have consistent invoice volume, negotiate lower fees. Factors often offer tiered pricing for high-volume clients. Committing to a minimum monthly volume can unlock significantly better rates and higher advance percentages.",
    icon: TrendingUp,
  },
  {
    title: "Check Customer Credit",
    description: "Factors evaluate your customers' creditworthiness, not yours. Ensure your customers have good credit to qualify for better rates. Consider using credit reporting services to pre-screen customers before extending terms.",
    icon: Users,
  },
  {
    title: "Understand All Fees",
    description: "Beyond the factoring fee, watch for application fees, minimum monthly fees, wire transfer charges, and early termination penalties. Request a complete fee schedule in writing before signing any agreement.",
    icon: AlertCircle,
  },
  {
    title: "Time Your Factoring",
    description: "Factor invoices right after delivery to minimize the collection period and reduce interest costs. Don't wait until invoices are already aging - older invoices may be rejected or priced higher.",
    icon: Clock,
  },
  {
    title: "Build a Strong Relationship",
    description: "Factors reward loyalty. After establishing a good track record with consistent volume and low dispute rates, you'll be in a position to negotiate better terms. Long-term relationships often lead to higher advances and lower fees.",
    icon: Handshake,
  },
];

const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  light: "#E5E7EB",
  purple: "#8B5CF6",
};

// Animated badge component
const AnimatedBadge = ({ children, variant = "default", delay = 0 }: { children: React.ReactNode; variant?: "default" | "outline"; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
  >
    <Badge 
      className={variant === "default" 
        ? "bg-[#0F4C81] text-white animate-pulse" 
        : "border-[#2E8B57] text-[#2E8B57] dark:text-[#2E8B57]"
      }
    >
      {children}
    </Badge>
  </motion.div>
);

export default function FactoringCostCalculator() {
  const [invoiceAmount, setInvoiceAmount] = useState<string>("100000");
  const [advanceRate, setAdvanceRate] = useState<string>("85");
  const [factoringFee, setFactoringFee] = useState<string>("2.5");
  const [collectionDays, setCollectionDays] = useState<string>("45");
  const [interestRate, setInterestRate] = useState<string>("12");
  const [factoringType, setFactoringType] = useState<string>("recourse");
  const [additionalFees, setAdditionalFees] = useState<string>("250");
  const [numberOfInvoices, setNumberOfInvoices] = useState<string>("5");
  const [activeTab, setActiveTab] = useState("calculator");

  const result = useMemo<FactoringResult | null>(() => {
    const invoice = parseFloat(invoiceAmount) || 0;
    const advance = parseFloat(advanceRate) / 100 || 0.85;
    const fee = parseFloat(factoringFee) / 100 || 0.025;
    const days = parseFloat(collectionDays) || 45;
    const interest = parseFloat(interestRate) / 100 || 0.12;
    const addFees = parseFloat(additionalFees) || 250;
    const numInvoices = parseFloat(numberOfInvoices) || 5;

    if (invoice === 0) return null;

    const totalInvoices = invoice * numInvoices;
    const advanceAmount = totalInvoices * advance;
    const reserveAmount = totalInvoices - advanceAmount;

    // Factoring fee (discount fee)
    const serviceFee = totalInvoices * fee;

    // Interest on advance (for the period until collection)
    const interestCost = advanceAmount * (interest / 365) * days;

    const totalFactoringFee = serviceFee + interestCost + addFees;

    // Effective APR calculation
    const effectiveAPR = (totalFactoringFee / advanceAmount) * (365 / days) * 100;

    // Net cash received (advance minus interest, plus reserve minus fees)
    const netCashReceived = advanceAmount + reserveAmount - totalFactoringFee;

    // Annualized cost
    const annualizedCost = totalFactoringFee;

    return {
      totalInvoices,
      advanceAmount,
      reserveAmount,
      factoringFee: totalFactoringFee,
      discountRate: (totalFactoringFee / totalInvoices) * 100,
      effectiveAPR,
      netCashReceived,
      averageCollectionPeriod: days,
      annualizedCost,
      breakDown: {
        serviceFee,
        interestCost,
        additionalFees: addFees
      }
    };
  }, [invoiceAmount, advanceRate, factoringFee, collectionDays, interestRate, additionalFees, numberOfInvoices]);

  // Chart data
  const comparisonData = useMemo(() => {
    if (!result) return [];
    
    const invoice = parseFloat(invoiceAmount) || 0;
    const numInvoices = parseFloat(numberOfInvoices) || 5;
    const totalInvoices = invoice * numInvoices;
    const fee = parseFloat(factoringFee) / 100 || 0.025;
    const interest = parseFloat(interestRate) / 100 || 0.12;
    const days = parseFloat(collectionDays) || 45;
    const addFees = parseFloat(additionalFees) || 250;

    const data = [];
    for (let rate = 70; rate <= 95; rate += 5) {
      const advAmt = totalInvoices * (rate / 100);
      const resAmt = totalInvoices - advAmt;
      const svcFee = totalInvoices * fee;
      const intCost = advAmt * (interest / 365) * days;
      const totalFee = svcFee + intCost + addFees;
      const netCash = advAmt + resAmt - totalFee;
      const apr = (totalFee / advAmt) * (365 / days) * 100;

      data.push({
        advanceRate: rate,
        advanceAmount: advAmt,
        totalFees: totalFee,
        netCash,
        effectiveAPR: apr
      });
    }
    return data;
  }, [result, invoiceAmount, numberOfInvoices, factoringFee, interestRate, collectionDays, additionalFees]);

  const costBreakdownData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Service Fee", value: result.breakDown.serviceFee, fill: COLORS.ocean },
      { name: "Interest Cost", value: result.breakDown.interestCost, fill: COLORS.logistics },
      { name: "Additional Fees", value: result.breakDown.additionalFees, fill: COLORS.warning },
    ];
  }, [result]);

  const cashFlowData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Advance", value: result.advanceAmount, fill: COLORS.ocean },
      { name: "Reserve", value: result.reserveAmount, fill: COLORS.logistics },
      { name: "Fees", value: result.factoringFee, fill: COLORS.danger },
    ];
  }, [result]);

  const aprComparisonData = useMemo(() => {
    return [
      { name: "Factoring", apr: result?.effectiveAPR || 0, fill: COLORS.ocean },
      { name: "Bank Loan", apr: 8, fill: COLORS.logistics },
      { name: "Credit Card", apr: 24, fill: COLORS.warning },
      { name: "Merchant Cash", apr: 50, fill: COLORS.danger },
    ];
  }, [result]);

  // Scenario comparison data
  const scenarioData = useMemo<ScenarioData[]>(() => {
    if (!result) return [];
    
    const invoice = parseFloat(invoiceAmount) || 0;
    const numInvoices = parseFloat(numberOfInvoices) || 5;
    const totalInvoices = invoice * numInvoices;
    const days = parseFloat(collectionDays) || 45;

    const scenarios = [
      { name: "Conservative", advanceRate: 0.75, feeRate: 0.02, interestRate: 0.10 },
      { name: "Current Setup", advanceRate: parseFloat(advanceRate) / 100, feeRate: parseFloat(factoringFee) / 100, interestRate: parseFloat(interestRate) / 100 },
      { name: "Aggressive", advanceRate: 0.90, feeRate: 0.035, interestRate: 0.15 },
    ];

    return scenarios.map(s => {
      const adv = totalInvoices * s.advanceRate;
      const svcFee = totalInvoices * s.feeRate;
      const intCost = adv * (s.interestRate / 365) * days;
      const totalFees = svcFee + intCost + parseFloat(additionalFees);
      const apr = (totalFees / adv) * (365 / days) * 100;
      const netCash = totalInvoices - totalFees;
      
      return {
        name: s.name,
        apr,
        netCash,
        totalFees,
        advanceAmount: adv,
      };
    });
  }, [result, invoiceAmount, numberOfInvoices, advanceRate, factoringFee, interestRate, collectionDays, additionalFees]);

  // Timeline data for cash flow projection
  const timelineData = useMemo(() => {
    if (!result) return [];
    
    const days = parseFloat(collectionDays) || 45;
    const data = [];
    
    for (let day = 0; day <= days; day += Math.ceil(days / 10)) {
      const interestAccumulated = result.advanceAmount * (parseFloat(interestRate) / 100 / 365) * day;
      const effectiveCash = day === 0 ? result.advanceAmount : result.advanceAmount - interestAccumulated;
      
      data.push({
        day,
        advance: result.advanceAmount,
        interestAccumulated,
        effectiveCash,
        reserve: result.reserveAmount,
      });
    }
    
    return data;
  }, [result, interestRate, collectionDays]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const resetForm = () => {
    setInvoiceAmount("100000");
    setAdvanceRate("85");
    setFactoringFee("2.5");
    setCollectionDays("45");
    setInterestRate("12");
    setFactoringType("recourse");
    setAdditionalFees("250");
    setNumberOfInvoices("5");
  };

  const getAPRColor = (apr: number) => {
    if (apr <= 15) return COLORS.logistics;
    if (apr <= 25) return COLORS.warning;
    return COLORS.danger;
  };

  const getAPRRating = (apr: number) => {
    if (apr <= 15) return { label: "Excellent", color: COLORS.logistics };
    if (apr <= 20) return { label: "Good", color: "#22C55E" };
    if (apr <= 25) return { label: "Fair", color: COLORS.warning };
    if (apr <= 35) return { label: "High", color: "#F97316" };
    return { label: "Very High", color: COLORS.danger };
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81]/10 via-background to-[#2E8B57]/10 dark:from-[#0F4C81]/20 dark:via-background dark:to-[#2E8B57]/20 rounded-xl p-6 lg:p-8 border border-[#0F4C81]/20"
      >
        {/* Animated background elements */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-64 h-64 bg-[#0F4C81]/10 rounded-full blur-3xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-0 left-0 w-48 h-48 bg-[#2E8B57]/10 rounded-full blur-3xl" 
        />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <AnimatedBadge variant="default" delay={0}>
                <Globe className="h-3 w-3 mr-1" />
                Trade Finance
              </AnimatedBadge>
              <AnimatedBadge variant="outline" delay={0.1}>
                <Zap className="h-3 w-3 mr-1" />
                Cash Flow
              </AnimatedBadge>
              <AnimatedBadge variant="default" delay={0.2}>
                <Sparkles className="h-3 w-3 mr-1" />
                Working Capital
              </AnimatedBadge>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent"
            >
              Factoring Cost Calculator
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground max-w-2xl text-sm lg:text-base"
            >
              Calculate the true cost of invoice factoring including service fees, interest charges, and effective APR. 
              Compare different factoring scenarios and optimize your working capital strategy with our comprehensive analysis tools.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-2 flex-wrap"
          >
            <Button variant="outline" size="sm" onClick={resetForm} className="border-[#0F4C81]/30 hover:bg-[#0F4C81]/10">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" className="border-[#2E8B57]/30 hover:bg-[#2E8B57]/10">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-[#0F4C81]/30 hover:bg-[#0F4C81]/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl bg-muted/50">
          <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 data-[state=active]:bg-[#2E8B57] data-[state=active]:text-white">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 data-[state=active]:bg-[#2E8B57] data-[state=active]:text-white">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card className="border-[#0F4C81]/20">
                <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                    Invoice Details
                  </CardTitle>
                  <CardDescription>
                    Enter your invoice information and factoring parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceAmount" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                        Avg. Invoice Amount ($)
                      </Label>
                      <Input
                        id="invoiceAmount"
                        type="number"
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        placeholder="100,000"
                        className="h-11 focus:border-[#0F4C81]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfInvoices" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#2E8B57]" />
                        Number of Invoices
                      </Label>
                      <Input
                        id="numberOfInvoices"
                        type="number"
                        value={numberOfInvoices}
                        onChange={(e) => setNumberOfInvoices(e.target.value)}
                        placeholder="5"
                        className="h-11 focus:border-[#0F4C81]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="advanceRate" className="flex items-center gap-2">
                        <Percent className="h-4 w-4 text-[#2E8B57]" />
                        Advance Rate (%)
                      </Label>
                      <Input
                        id="advanceRate"
                        type="number"
                        value={advanceRate}
                        onChange={(e) => setAdvanceRate(e.target.value)}
                        placeholder="85"
                        min="70"
                        max="95"
                        className="h-11 focus:border-[#0F4C81]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="factoringFee" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                        Factoring Fee (%)
                      </Label>
                      <Input
                        id="factoringFee"
                        type="number"
                        step="0.1"
                        value={factoringFee}
                        onChange={(e) => setFactoringFee(e.target.value)}
                        placeholder="2.5"
                        className="h-11 focus:border-[#0F4C81]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="collectionDays" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#2E8B57]" />
                        Collection Period (Days)
                      </Label>
                      <Input
                        id="collectionDays"
                        type="number"
                        value={collectionDays}
                        onChange={(e) => setCollectionDays(e.target.value)}
                        placeholder="45"
                        className="h-11 focus:border-[#0F4C81]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interestRate" className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#2E8B57]" />
                        Interest Rate (Annual %)
                      </Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.5"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="12"
                        className="h-11 focus:border-[#0F4C81]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="factoringType">Factoring Type</Label>
                    <Select value={factoringType} onValueChange={setFactoringType}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select factoring type" />
                      </SelectTrigger>
                      <SelectContent>
                        {factoringTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalFees" className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-[#2E8B57]" />
                      Additional Fees ($)
                    </Label>
                    <Input
                      id="additionalFees"
                      type="number"
                      value={additionalFees}
                      onChange={(e) => setAdditionalFees(e.target.value)}
                      placeholder="250"
                      className="h-11 focus:border-[#0F4C81]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Include processing, wire transfer, and other ancillary fees
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Factoring Types Reference */}
              <Card className="border-[#2E8B57]/20">
                <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-[#2E8B57]" />
                    Factoring Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {factoringTypes.map((type, index) => (
                      <motion.div
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          factoringType === type.id
                            ? "border-[#0F4C81] bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10"
                            : "border-border hover:border-[#0F4C81]/50"
                        }`}
                        onClick={() => setFactoringType(type.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <type.icon className="h-5 w-5" style={{ color: type.color }} />
                          <h4 className="font-semibold text-sm">{type.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{type.description}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Advance:</span>
                            <span className="font-medium">{type.advanceRate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fee Range:</span>
                            <span className="font-medium">{type.feeRange}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white rounded-lg p-5 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <DollarSign className="h-7 w-7 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Advance</span>
                        </div>
                        <p className="text-3xl font-bold">{formatCurrency(result.advanceAmount)}</p>
                        <p className="text-sm opacity-80 mt-2">
                          {advanceRate}% of {formatCurrency(result.totalInvoices)}
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white rounded-lg p-5 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <PieChart className="h-7 w-7 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Reserve</span>
                        </div>
                        <p className="text-3xl font-bold">{formatCurrency(result.reserveAmount)}</p>
                        <p className="text-sm opacity-80 mt-2">
                          Held until collection
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg p-5 shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <TrendingUp className="h-7 w-7 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total Cost</span>
                        </div>
                        <p className="text-3xl font-bold">{formatCurrency(result.factoringFee)}</p>
                        <p className="text-sm opacity-80 mt-2">
                          {formatPercent(result.discountRate)} of invoice value
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="text-white rounded-lg p-5 shadow-lg"
                        style={{ 
                          background: `linear-gradient(135deg, ${getAPRColor(result.effectiveAPR)}, ${getAPRColor(result.effectiveAPR)}cc)` 
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <Percent className="h-7 w-7 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Effective APR</span>
                        </div>
                        <p className="text-3xl font-bold">{formatPercent(result.effectiveAPR)}</p>
                        <p className="text-sm opacity-80 mt-2">
                          {getAPRRating(result.effectiveAPR).label} rate
                        </p>
                      </motion.div>
                    </div>

                    {/* APR Rating Meter */}
                    <Card className="border-[#0F4C81]/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Activity className="h-4 w-4 text-[#0F4C81]" />
                          APR Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Progress 
                            value={Math.min((result.effectiveAPR / 50) * 100, 100)} 
                            className="h-3"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Excellent (0-15%)</span>
                            <span>Fair (20-25%)</span>
                            <span>High (35%+)</span>
                          </div>
                          <div className="mt-3 p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              {result.effectiveAPR <= 20 ? (
                                <CheckCircle2 className="h-5 w-5 text-[#2E8B57]" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                              )}
                              <span className="font-medium">
                                {result.effectiveAPR <= 15 
                                  ? "Competitive factoring rate - well-positioned for cost-effective financing"
                                  : result.effectiveAPR <= 25
                                  ? "Market-rate factoring costs - consider negotiating for better terms"
                                  : "High factoring costs - explore alternatives or renegotiate terms"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Cost Breakdown */}
                    <Card className="border-2 border-[#0F4C81]/20">
                      <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
                        <CardTitle className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-[#0F4C81]" />
                          Cost Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-[#0F4C81] rounded-full"></div>
                              <div>
                                <p className="font-medium">Service/Discount Fee</p>
                                <p className="text-xs text-muted-foreground">{factoringFee}% of invoice value</p>
                              </div>
                            </div>
                            <span className="font-bold text-lg">{formatCurrency(result.breakDown.serviceFee)}</span>
                          </div>

                          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-[#2E8B57] rounded-full"></div>
                              <div>
                                <p className="font-medium">Interest on Advance</p>
                                <p className="text-xs text-muted-foreground">{interestRate}% annual for {collectionDays} days</p>
                              </div>
                            </div>
                            <span className="font-bold text-lg">{formatCurrency(result.breakDown.interestCost)}</span>
                          </div>

                          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                              <div>
                                <p className="font-medium">Additional Fees</p>
                                <p className="text-xs text-muted-foreground">Processing, wire transfers, etc.</p>
                              </div>
                            </div>
                            <span className="font-bold text-lg">{formatCurrency(result.breakDown.additionalFees)}</span>
                          </div>

                          <Separator />

                          <div className="flex justify-between items-center p-5 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg border-2 border-[#0F4C81]/30">
                            <div className="flex items-center gap-3">
                              <ArrowRight className="h-6 w-6 text-[#0F4C81]" />
                              <span className="font-semibold text-lg">Total Factoring Cost</span>
                            </div>
                            <span className="font-bold text-2xl text-[#0F4C81]">{formatCurrency(result.factoringFee)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Cash Flow Summary */}
                    <Card className="border-[#2E8B57]/20">
                      <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Wallet className="h-5 w-5 text-[#2E8B57]" />
                          Cash Flow Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center pb-4 border-b">
                            <span className="text-muted-foreground">Total Invoices</span>
                            <span className="font-semibold text-lg">{formatCurrency(result.totalInvoices)}</span>
                          </div>
                          <div className="flex justify-between items-center pb-4 border-b">
                            <span className="text-muted-foreground">Immediate Cash (Advance)</span>
                            <span className="font-semibold text-[#0F4C81] text-lg">{formatCurrency(result.advanceAmount)}</span>
                          </div>
                          <div className="flex justify-between items-center pb-4 border-b">
                            <span className="text-muted-foreground">Reserve Held</span>
                            <span className="font-semibold text-[#2E8B57] text-lg">{formatCurrency(result.reserveAmount)}</span>
                          </div>
                          <div className="flex justify-between items-center pb-4 border-b">
                            <span className="text-muted-foreground">Less: Total Fees</span>
                            <span className="font-semibold text-red-500 text-lg">-{formatCurrency(result.factoringFee)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 p-4 rounded-lg">
                            <span className="font-semibold text-lg">Net Cash Received</span>
                            <span className="font-bold text-2xl text-[#0F4C81]">{formatCurrency(result.netCashReceived)}</span>
                          </div>
                        </div>

                        <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-semibold text-amber-800 dark:text-amber-200 text-lg">Effective Annual Cost</p>
                              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                The effective APR of {formatPercent(result.effectiveAPR)} reflects the true annualized cost of factoring your invoices. 
                                This rate helps you compare factoring against other financing alternatives like bank loans, lines of credit, or merchant cash advances.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card className="border-dashed border-2">
                      <CardContent className="pt-16 pb-16 text-center">
                        <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                          Enter invoice details to calculate factoring costs
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Chart */}
            <Card className="border-[#0F4C81]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[#0F4C81]" />
                  Cost Breakdown
                </CardTitle>
                <CardDescription>
                  Visual representation of where your factoring costs go
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Distribution */}
            <Card className="border-[#2E8B57]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  Cash Flow Distribution
                </CardTitle>
                <CardDescription>
                  How your invoice value is distributed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashFlowData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {cashFlowData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* APR Comparison */}
            <Card className="lg:col-span-2 border-[#0F4C81]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-[#0F4C81]" />
                  APR Comparison with Other Financing Options
                </CardTitle>
                <CardDescription>
                  Compare factoring costs with alternative financing methods to make informed decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={aprComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 'auto']} label={{ value: 'APR (%)', position: 'bottom' }} />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}% APR`} />
                      <Bar dataKey="apr" name="APR %" radius={[0, 8, 8, 0]} barSize={40}>
                        {aprComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scenario Comparison */}
          {result && (
            <Card className="border-[#2E8B57]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                  Scenario Analysis
                </CardTitle>
                <CardDescription>
                  Compare different factoring configurations and their impact on your bottom line
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={scenarioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                      <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="apr" name="APR %" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="netCash" name="Net Cash" stroke="#2E8B57" strokeWidth={3} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Scenario</th>
                        <th className="text-right py-3 px-4">Advance Amount</th>
                        <th className="text-right py-3 px-4">Total Fees</th>
                        <th className="text-right py-3 px-4">Net Cash</th>
                        <th className="text-right py-3 px-4">Effective APR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarioData.map((row, index) => (
                        <tr key={index} className={`border-b border-border ${index === 1 ? 'bg-[#0F4C81]/10 font-medium' : ''}`}>
                          <td className="py-3 px-4">
                            {row.name}
                            {index === 1 && (
                              <span className="ml-2 text-xs bg-[#0F4C81] text-white px-2 py-0.5 rounded">Current</span>
                            )}
                          </td>
                          <td className="text-right py-3 px-4">{formatCurrency(row.advanceAmount)}</td>
                          <td className="text-right py-3 px-4 text-red-500">{formatCurrency(row.totalFees)}</td>
                          <td className="text-right py-3 px-4 text-[#2E8B57]">{formatCurrency(row.netCash)}</td>
                          <td className="text-right py-3 px-4" style={{ color: getAPRColor(row.apr) }}>{row.apr.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Summary */}
          {result && (
            <Card className="border-[#0F4C81]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                  Comprehensive Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-5 bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5 rounded-lg text-center border border-[#0F4C81]/20">
                    <div className="text-3xl font-bold text-[#0F4C81]">{formatCurrency(result.advanceAmount)}</div>
                    <div className="text-sm text-muted-foreground mt-1">Immediate Cash</div>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-[#2E8B57]/10 to-[#2E8B57]/5 rounded-lg text-center border border-[#2E8B57]/20">
                    <div className="text-3xl font-bold text-[#2E8B57]">{formatCurrency(result.factoringFee)}</div>
                    <div className="text-sm text-muted-foreground mt-1">Total Factoring Cost</div>
                  </div>
                  <div className="p-5 bg-muted/30 rounded-lg text-center border">
                    <div className="text-3xl font-bold" style={{ color: getAPRColor(result.effectiveAPR) }}>
                      {formatPercent(result.effectiveAPR)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Effective APR</div>
                  </div>
                  <div className="p-5 bg-muted/30 rounded-lg text-center border">
                    <div className="text-3xl font-bold text-[#0F4C81]">{result.averageCollectionPeriod}</div>
                    <div className="text-sm text-muted-foreground mt-1">Days to Collect</div>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-[#2E8B57]/5 to-[#0F4C81]/5 rounded-lg border border-[#2E8B57]/20">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-[#2E8B57] shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-lg mb-2">Cost Efficiency Assessment</p>
                      <p className="text-muted-foreground">
                        {result.effectiveAPR <= 15 
                          ? "This factoring arrangement offers competitive rates compared to market alternatives. The effective APR is within the lower range for invoice factoring, making it a cost-effective working capital solution. Your business is well-positioned to benefit from improved cash flow while maintaining reasonable financing costs."
                          : result.effectiveAPR <= 25
                          ? "The factoring cost is within the typical market range for invoice factoring services. Consider negotiating for better rates if you have consistent invoice volume or strong customer credit profiles. Building a relationship with your factor over time often leads to improved terms and pricing."
                          : "The effective APR is higher than average for factoring arrangements. Explore ways to reduce costs: shorter collection terms, lower advance rates, negotiating volume discounts, or considering recourse factoring if your customers have strong creditworthiness. Alternative financing options may also be worth exploring."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card className="border-[#0F4C81]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#0F4C81]" />
                Advance Rate Comparison
              </CardTitle>
              <CardDescription>
                See how different advance rates affect your costs and net cash received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4 text-lg">Effective APR by Advance Rate</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="advanceRate" label={{ value: "Advance Rate (%)", position: "bottom", offset: -5 }} />
                        <YAxis label={{ value: "APR (%)", angle: -90, position: "insideLeft" }} />
                        <Tooltip
                          formatter={(value: number) => [`${value.toFixed(2)}%`, "Effective APR"]}
                          labelFormatter={(label) => `Advance Rate: ${label}%`}
                        />
                        <ReferenceLine y={15} stroke="#2E8B57" strokeDasharray="5 5" label="Excellent" />
                        <ReferenceLine y={25} stroke="#F59E0B" strokeDasharray="5 5" label="Fair" />
                        <Line
                          type="monotone"
                          dataKey="effectiveAPR"
                          stroke="#0F4C81"
                          strokeWidth={3}
                          dot={{ fill: "#0F4C81", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: "#2E8B57" }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 text-lg">Net Cash by Advance Rate</h4>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="advanceRate" />
                        <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), "Net Cash"]}
                          labelFormatter={(label) => `Advance Rate: ${label}%`}
                        />
                        <Area
                          type="monotone"
                          dataKey="netCash"
                          stroke="#2E8B57"
                          fill="#2E8B57"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 font-semibold">Advance Rate</th>
                      <th className="text-right py-4 px-4 font-semibold">Advance Amount</th>
                      <th className="text-right py-4 px-4 font-semibold">Total Fees</th>
                      <th className="text-right py-4 px-4 font-semibold">Net Cash</th>
                      <th className="text-right py-4 px-4 font-semibold">Effective APR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row) => (
                      <tr
                        key={row.advanceRate}
                        className={`border-b border-border transition-colors ${
                          row.advanceRate === Number(advanceRate) ? "bg-[#0F4C81]/10 font-medium" : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="py-4 px-4">
                          <span className="flex items-center gap-2">
                            {row.advanceRate}%
                            {row.advanceRate === Number(advanceRate) && (
                              <span className="text-xs bg-[#0F4C81] text-white px-2 py-1 rounded-full">Selected</span>
                            )}
                          </span>
                        </td>
                        <td className="text-right py-4 px-4">{formatCurrency(row.advanceAmount)}</td>
                        <td className="text-right py-4 px-4 text-red-500">{formatCurrency(row.totalFees)}</td>
                        <td className="text-right py-4 px-4 text-[#2E8B57] font-semibold">{formatCurrency(row.netCash)}</td>
                        <td className="text-right py-4 px-4" style={{ color: getAPRColor(row.effectiveAPR), fontWeight: 600 }}>
                          {row.effectiveAPR.toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Factoring Type Comparison */}
          <Card className="border-[#2E8B57]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#2E8B57]" />
                Factoring Type Comparison
              </CardTitle>
              <CardDescription>
                Understanding the different types of factoring arrangements and when to use each
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold">Type</th>
                      <th className="text-left p-4 font-semibold">Description</th>
                      <th className="text-left p-4 font-semibold">Advance Rate</th>
                      <th className="text-left p-4 font-semibold">Fee Range</th>
                      <th className="text-left p-4 font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {factoringTypes.map((type) => (
                      <tr key={type.id} className={`border-b border-border transition-colors ${factoringType === type.id ? 'bg-[#0F4C81]/5' : 'hover:bg-muted/30'}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <type.icon className="h-5 w-5" style={{ color: type.color }} />
                            <span className="font-medium">{type.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{type.description}</td>
                        <td className="p-4 font-medium">{type.advanceRate}</td>
                        <td className="p-4 font-medium">{type.feeRange}</td>
                        <td className="p-4 text-muted-foreground">{type.risk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab - Enhanced with 150+ words per section */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-[#F59E0B]/20">
              <CardHeader className="bg-gradient-to-r from-amber-500/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-500" />
                  Pro Tips for Factoring Success
                </CardTitle>
                <CardDescription>
                  Expert strategies to maximize value and minimize costs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <tip.icon className="h-6 w-6 text-[#0F4C81] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#0F4C81]/20">
              <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0F4C81]" />
                  Understanding Invoice Factoring
                </CardTitle>
                <CardDescription>
                  A comprehensive guide to factoring fundamentals
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  Invoice factoring is a powerful financial tool that allows businesses to convert their accounts 
                  receivable into immediate cash flow. Rather than waiting 30, 60, or even 90 days for customer payments, 
                  companies can sell their invoices to a factoring company and receive a significant portion of the 
                  invoice value within 24-48 hours. This type of financing has been used for centuries, dating back to 
                  ancient Mesopotamia, and remains a vital source of working capital for businesses across virtually 
                  every industry today.
                </p>
                <p className="leading-relaxed">
                  The factoring process involves three main components that determine your total cost and cash flow benefit. 
                  The <strong className="text-foreground">advance rate</strong> (typically 70-90% of invoice value paid upfront) 
                  represents the immediate cash you receive when submitting invoices. The <strong className="text-foreground">factoring fee</strong> 
                  (a percentage of the invoice value, usually 1-5%) compensates the factor for their services and risk assumption. 
                  The <strong className="text-foreground">reserve</strong> is the remaining balance held until customer payment 
                  is collected, minus any applicable fees.
                </p>
                <p className="leading-relaxed">
                  Understanding the true cost of factoring requires looking beyond just the factoring fee percentage. 
                  The <strong className="text-foreground">effective APR</strong> provides a more accurate picture by annualizing all costs 
                  including service fees, interest charges, and additional fees. This allows for meaningful comparison 
                  with other financing options like bank loans, lines of credit, or merchant cash advances. A factoring 
                  arrangement with a 2.5% fee over 45 days might seem reasonable, but the effective APR could exceed 20% 
                  when all costs are included.
                </p>
                <Separator />
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground text-base">Key Formulas:</h4>
                  <div className="p-4 bg-muted/50 rounded-lg font-mono text-xs">
                    <p className="mb-2">Effective APR = (Total Fees / Advance) × (365 / Days) × 100</p>
                    <p className="mb-2">Net Cash = Advance + Reserve - Total Fees</p>
                    <p>Total Cost = Service Fee + Interest + Additional Fees</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Educational Content Section */}
          <Card className="border-[#2E8B57]/20">
            <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#2E8B57]" />
                Invoice Factoring: A Complete Educational Guide
              </CardTitle>
              <CardDescription>
                Everything you need to know about factoring to make informed decisions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold text-foreground mb-3">What is Invoice Factoring and How Does It Work?</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Invoice factoring, also known as accounts receivable factoring or debt factoring, is a financial transaction 
                  where a business sells its accounts receivable (invoices) to a third party (called a factor) at a discount. 
                  This practice provides businesses with immediate working capital instead of waiting for customers to pay their 
                  invoices according to the agreed payment terms. The factoring industry has grown significantly over the past 
                  few decades, with global factoring volume exceeding €3 trillion annually. Businesses of all sizes use factoring, 
                  from small startups to large multinational corporations, particularly in industries with extended payment terms 
                  such as manufacturing, transportation, staffing, and wholesale distribution.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The factoring process typically follows a standard workflow. First, you deliver goods or services to your 
                  customer and generate an invoice. Next, you submit the invoice to the factor for verification and approval. 
                  Once approved, the factor advances a percentage of the invoice value (typically 70-90%) to your business within 
                  24-48 hours. The factor then collects payment from your customer according to the invoice terms. Finally, 
                  when the customer pays, the factor releases the remaining balance (reserve) minus their fees. This entire 
                  process can be completed quickly and with minimal paperwork compared to traditional bank financing.
                </p>
              </div>
              
              <Separator />
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold text-foreground mb-3">Types of Factoring Arrangements</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Understanding the different types of factoring is essential for choosing the right arrangement for your 
                  business. <strong className="text-foreground">Recourse factoring</strong> is the most common and least expensive 
                  option, where you agree to buy back any invoices the factor cannot collect. This shifts the credit risk back 
                  to you but results in lower fees and higher advance rates. <strong className="text-foreground">Non-recourse 
                  factoring</strong> provides protection against customer non-payment due to insolvency, with the factor absorbing 
                  the loss. This comes at a higher cost but offers peace of mind, particularly when dealing with new customers 
                  or industries with higher default rates.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Spot factoring</strong> allows you to factor individual invoices as needed 
                  rather than committing to ongoing arrangements. This flexibility comes at a premium cost but is ideal for 
                  businesses with sporadic cash flow needs. <strong className="text-foreground">Maturity factoring</strong> provides 
                  payment on a fixed date regardless of when customers pay, offering predictable cash flow timing. Each type 
                  serves different business needs, and many factors offer hybrid arrangements that combine features of multiple types.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#0F4C81]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#0F4C81]" />
                Factoring Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="choosing-factor">
                  <AccordionTrigger className="text-left font-semibold">Choosing the Right Factoring Company</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="leading-relaxed">
                        Selecting the right factoring partner is crucial for a successful long-term relationship. The ideal 
                        factor should have deep experience in your specific industry, as industry expertise translates to 
                        better understanding of your customers, invoice verification processes, and collection practices. 
                        Look for factors who have worked with businesses similar to yours and can provide references from 
                        satisfied clients in your sector.
                      </p>
                      <p className="leading-relaxed mb-3">
                        Evaluate potential factors based on these key criteria:
                      </p>
                      <ul className="space-y-2 list-disc list-inside">
                        <li>Industry expertise and experience with your customer base</li>
                        <li>Transparent fee structure with no hidden charges or surprise costs</li>
                        <li>Flexible contract terms without restrictive long-term lock-ins</li>
                        <li>Modern technology integration for easy invoice submission and tracking</li>
                        <li>Strong customer service reputation and professional collection practices</li>
                        <li>Financial stability and adequate funding capacity for your volume</li>
                        <li>Clear communication about the factoring relationship with your customers</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="reducing-costs">
                  <AccordionTrigger className="text-left font-semibold">Strategies to Reduce Factoring Costs</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="leading-relaxed">
                        While factoring provides valuable cash flow benefits, minimizing costs improves your bottom line. 
                        The most effective strategy is negotiating volume discounts - factors typically offer tiered pricing 
                        where higher monthly invoice volumes unlock better rates. If your business consistently factors 
                        significant invoice volume, you have leverage to negotiate lower fees and higher advance rates.
                      </p>
                      <p className="leading-relaxed mb-3">
                        Implement these proven cost reduction strategies:
                      </p>
                      <ul className="space-y-2 list-disc list-inside">
                        <li>Negotiate volume discounts for consistent invoice flow (commitment = better rates)</li>
                        <li>Shorten customer payment terms to reduce interest charges over time</li>
                        <li>Selectively factor only invoices from slower-paying customers, maintaining some direct collections</li>
                        <li>Improve customer credit quality to qualify for better rates and higher advances</li>
                        <li>Consider recourse factoring if your customers have reliable payment histories</li>
                        <li>Factor invoices immediately upon delivery, not after aging, to avoid higher fees on older invoices</li>
                        <li>Build a track record with your factor to demonstrate reliability and earn better terms</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="when-to-factor">
                  <AccordionTrigger className="text-left font-semibold">When Factoring Makes Sense for Your Business</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="leading-relaxed">
                        Factoring is not the right solution for every business situation, but it excels in specific scenarios. 
                        Understanding when factoring provides the most value helps you make informed financing decisions. 
                        The ideal candidate for factoring is a B2B business with creditworthy customers, reliable delivery of 
                        goods or services, and payment terms that strain cash flow.
                      </p>
                      <p className="leading-relaxed mb-3">
                        Factoring is particularly beneficial in these situations:
                      </p>
                      <ul className="space-y-2 list-disc list-inside">
                        <li>Rapid growth creating cash flow gaps between order fulfillment and payment</li>
                        <li>Seasonal business with uneven revenue patterns requiring flexible financing</li>
                        <li>Startups and young companies without established credit history for bank loans</li>
                        <li>B2B companies with reliable but slow-paying customers (30-90 day terms)</li>
                        <li>Opportunities requiring quick access to working capital (large orders, expansions)</li>
                        <li>Businesses unable to secure traditional bank financing due to limited collateral</li>
                        <li>Companies wanting to outsource collections and accounts receivable management</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="avoiding-pitfalls">
                  <AccordionTrigger className="text-left font-semibold">Common Pitfalls to Avoid</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p className="leading-relaxed">
                        Many businesses enter factoring arrangements without fully understanding the implications, leading to 
                        unexpected costs and complications. Being aware of common pitfalls helps you navigate the factoring 
                        landscape more effectively and avoid costly mistakes that could impact your business operations and 
                        customer relationships.
                      </p>
                      <p className="leading-relaxed mb-3">
                        Watch out for these common mistakes:
                      </p>
                      <ul className="space-y-2 list-disc list-inside">
                        <li>Not reading the fine print - understand all fees, termination clauses, and minimum requirements</li>
                        <li>Assuming the lowest fee rate means lowest total cost - consider APR including all charges</li>
                        <li>Factoring invoices from customers with poor credit - leads to higher fees or rejection</li>
                        <li>Waiting too long to factor invoices - older invoices cost more and may be rejected</li>
                        <li>Not communicating with customers about the factoring arrangement</li>
                        <li>Signing long-term contracts without understanding termination penalties</li>
                        <li>Over-relying on factoring when other financing options might be more cost-effective</li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="border-[#0F4C81]/20">
            <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about invoice factoring and cost calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border-b border-border">
                    <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional FAQ Card */}
          <Card className="border-[#2E8B57]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-[#2E8B57]" />
                Need More Help?
              </CardTitle>
              <CardDescription>
                We are here to assist with your factoring questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#0F4C81]" />
                    Educational Resources
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Browse our comprehensive guides on trade finance, working capital management, and invoice factoring best practices.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#2E8B57]" />
                    Expert Consultation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with our trade finance experts for personalized guidance on your factoring needs and working capital strategy.
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

// Additional icons
const GraduationCap = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const Settings = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
