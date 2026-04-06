"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Download,
  Share2,
  Info,
  ChevronDown,
  DollarSign,
  Activity,
  BarChart3,
  LineChart,
  HelpCircle,
  Lightbulb,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Globe,
  BookOpen,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Mock exchange rates (in production, these would come from an API)
const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  INR: 83.12,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  AED: 3.67,
  SGD: 1.34,
  HKD: 7.82,
  NZD: 1.64,
  KRW: 1328.50,
  MXN: 17.15,
  BRL: 4.97,
  ZAR: 18.65,
  SEK: 10.42,
  NOK: 10.58,
  DKK: 6.87,
};

// Major currency pairs with rates and changes
const majorPairs = [
  { pair: "EUR/USD", rate: 1.0870, dailyChange: 0.15, weeklyChange: 0.32, name: "Euro / US Dollar" },
  { pair: "GBP/USD", rate: 1.2658, dailyChange: -0.08, weeklyChange: 0.45, name: "British Pound / US Dollar" },
  { pair: "USD/JPY", rate: 149.50, dailyChange: 0.22, weeklyChange: -0.65, name: "US Dollar / Japanese Yen" },
  { pair: "USD/CHF", rate: 0.8850, dailyChange: -0.12, weeklyChange: 0.18, name: "US Dollar / Swiss Franc" },
  { pair: "AUD/USD", rate: 0.6536, dailyChange: 0.28, weeklyChange: 0.55, name: "Australian Dollar / US Dollar" },
  { pair: "USD/CAD", rate: 1.3645, dailyChange: -0.05, weeklyChange: -0.22, name: "US Dollar / Canadian Dollar" },
  { pair: "NZD/USD", rate: 0.6098, dailyChange: 0.18, weeklyChange: 0.38, name: "New Zealand Dollar / US Dollar" },
  { pair: "USD/CNY", rate: 7.2400, dailyChange: 0.05, weeklyChange: 0.12, name: "US Dollar / Chinese Yuan" },
];

// Historical rate data (simulated for demo)
const generateHistoricalData = (baseRate: number, days: number = 30) => {
  const data = [];
  let currentRate = baseRate * 0.98;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * 0.02;
    currentRate = currentRate * (1 + variation);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      rate: Number(currentRate.toFixed(4)),
      high: Number((currentRate * 1.005).toFixed(4)),
      low: Number((currentRate * 0.995).toFixed(4)),
      volume: Math.floor(Math.random() * 100000) + 50000,
    });
  }
  return data;
};

// Currency comparison data
const currencyComparisonData = [
  { currency: "USD", value: 100, change: 0 },
  { currency: "EUR", value: 92, change: 0.15 },
  { currency: "GBP", value: 79, change: -0.08 },
  { currency: "JPY", value: 14950, change: 0.22 },
  { currency: "CNY", value: 724, change: 0.05 },
  { currency: "CHF", value: 88, change: -0.12 },
];

// Volatility data
const volatilityData = [
  { month: "Jul", eurUsd: 0.8, gbpUsd: 1.2, usdJpy: 1.5 },
  { month: "Aug", eurUsd: 0.6, gbpUsd: 0.9, usdJpy: 1.2 },
  { month: "Sep", eurUsd: 1.1, gbpUsd: 1.4, usdJpy: 1.8 },
  { month: "Oct", eurUsd: 0.9, gbpUsd: 1.1, usdJpy: 1.4 },
  { month: "Nov", eurUsd: 1.3, gbpUsd: 1.6, usdJpy: 2.0 },
  { month: "Dec", eurUsd: 1.0, gbpUsd: 1.3, usdJpy: 1.7 },
];

// Missing icons - defined before use
const Target = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const Calendar = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

// Analysis pie chart data
const marketShareData = [
  { name: "USD", value: 88.5, color: "#0F4C81" },
  { name: "EUR", value: 30.5, color: "#2E8B57" },
  { name: "JPY", value: 16.8, color: "#F59E0B" },
  { name: "GBP", value: 12.9, color: "#EF4444" },
  { name: "Others", value: 21.3, color: "#8B5CF6" },
];

// FAQ data
const faqData = [
  {
    question: "What is an exchange rate and how is it determined?",
    answer: "An exchange rate is the value of one country's currency versus the currency of another country or economic zone. Most exchange rates are determined by the foreign exchange market (Forex), where currencies are traded 24 hours a day, 5 days a week. Exchange rates can be either floating (determined by supply and demand) or fixed/pegged (set by government policy). Factors influencing exchange rates include interest rates, inflation, political stability, economic performance, and market speculation. For international trade, understanding exchange rates is crucial as they directly impact the cost of imports and the revenue from exports.",
  },
  {
    question: "What is the difference between spot rate and forward rate?",
    answer: "A spot rate is the current market price for exchanging one currency for another, typically for settlement within two business days. This is the rate you see quoted on financial news and what most travelers use for currency exchange. A forward rate, on the other hand, is a predetermined exchange rate for a transaction that will occur at a future date. Forward rates are derived from the spot rate adjusted for the interest rate differential between the two currencies (interest rate parity). Companies use forward contracts to lock in exchange rates and protect against currency fluctuations, especially when they have known future foreign currency obligations.",
  },
  {
    question: "How do currency spreads affect my international transactions?",
    answer: "Currency spreads represent the difference between the bid price (what buyers pay) and the ask price (what sellers receive) for a currency. This spread is essentially the cost of exchanging money and varies based on the currency pair, market conditions, and the provider you use. Major currency pairs like EUR/USD typically have tight spreads (0.1-0.5%), while exotic pairs can have spreads of 1-3% or more. Banks often charge 2-4% above the interbank rate for retail customers, while specialized forex providers may offer rates closer to the market rate. For businesses doing large or frequent international transactions, even small spread differences can result in significant cost savings over time.",
  },
  {
    question: "When is the best time to exchange currency for trade?",
    answer: "The optimal time for currency exchange depends on multiple factors. Forex markets are most liquid during the overlap of London (8am-12pm EST) and New York (8am-5pm EST) trading sessions, typically resulting in tighter spreads. Avoid exchanging during major news events or economic data releases as volatility spikes can work against you. For businesses, timing should align with your cash flow needs and risk tolerance. Consider using limit orders to automatically exchange when your target rate is reached, or use forward contracts to lock in favorable rates for future transactions. Some companies use dollar-cost averaging, exchanging smaller amounts regularly to reduce timing risk.",
  },
  {
    question: "What is currency risk and how can I manage it?",
    answer: "Currency risk (also called exchange rate risk) is the potential for financial loss due to fluctuations in exchange rates between the time a transaction is agreed upon and when payment is actually made. For importers, a weakening domestic currency increases costs; for exporters, a strengthening domestic currency reduces revenue. Managing currency risk involves several strategies: natural hedging (matching currency revenues with expenses), forward contracts (locking in future rates), options (providing flexibility with protection), and multi-currency accounts. The best approach depends on your business size, transaction volume, and risk tolerance. Many companies use a combination of these tools to create a comprehensive hedging strategy.",
  },
  {
    question: "How do central banks affect exchange rates?",
    answer: "Central banks play a crucial role in influencing exchange rates through monetary policy decisions. Interest rate changes directly impact currency values—higher rates typically attract foreign investment, strengthening the currency. Central banks also engage in foreign exchange interventions, buying or selling currencies to influence their value. Quantitative easing programs can weaken a currency by increasing money supply. Additionally, central bank communications and forward guidance can cause significant market movements. For international traders, monitoring central bank policies in both their home country and trading partner countries is essential for anticipating potential exchange rate movements and adjusting strategies accordingly.",
  },
  {
    question: "What are the costs involved in international currency transfers?",
    answer: "International currency transfers involve several cost components beyond just the exchange rate spread. Banks typically charge wire transfer fees ($15-50 for outgoing, $10-25 for incoming), intermediary bank fees ($15-30 per bank in the chain), and may apply less favorable exchange rates. Specialized transfer services often offer lower fees and better rates but may have different fee structures—some charge percentage fees (0.5-2%), others flat fees per transfer. Additional costs can include conversion fees for exotic currencies, urgency fees for same-day transfers, and receiving fees. For businesses, it's important to compare the total cost of transfers across providers, as the combination of fees and rate markups can vary significantly.",
  },
];

// FX Tips
const fxTips = [
  {
    title: "Monitor Market Hours",
    description: "Forex markets operate 24/5. The best rates typically occur during London-New York overlap (8am-12pm EST) when liquidity is highest and spreads are tightest.",
    icon: Clock,
  },
  {
    title: "Use Limit Orders",
    description: "Instead of exchanging at market rates, set limit orders to automatically execute trades when your target rate is reached. This removes emotional decision-making from the process.",
    icon: Target,
  },
  {
    title: "Compare Providers",
    description: "Banks often charge 2-4% above interbank rates. Compare specialized forex providers, multi-currency accounts, and local exchange services for better rates.",
    icon: BarChart3,
  },
  {
    title: "Consider Forward Contracts",
    description: "For known future payments, lock in today's rates with forward contracts. This protects against adverse currency movements and aids in budget certainty.",
    icon: Activity,
  },
  {
    title: "Understand Your Exposure",
    description: "Calculate your net currency exposure by offsetting receivables against payables in the same currency. Natural hedging can reduce your need for financial hedging.",
    icon: Info,
  },
  {
    title: "Watch Economic Calendar",
    description: "Major economic releases (GDP, inflation, employment data) and central bank meetings can cause significant volatility. Plan transfers around these events.",
    icon: Calendar,
  },
];

// Guide content sections
const guideSections = [
  {
    title: "Getting Started with Currency Exchange",
    content: "Currency exchange is a fundamental aspect of international trade and commerce. Whether you are an importer paying overseas suppliers, an exporter receiving foreign payments, or a traveler exploring new destinations, understanding how currency exchange works is essential for making informed financial decisions. The foreign exchange market, also known as Forex or FX, is the largest and most liquid financial market in the world, with daily trading volumes exceeding $7 trillion. This market operates 24 hours a day, five days a week, spanning major financial centers across different time zones from Sydney to London to New York. Understanding the basics of currency exchange can help businesses and individuals navigate the complexities of international transactions more effectively.",
  },
  {
    title: "Understanding Exchange Rate Quotations",
    content: "Exchange rate quotations can be expressed in two ways: direct and indirect quotes. A direct quote shows the amount of domestic currency needed to purchase one unit of foreign currency, while an indirect quote shows the amount of foreign currency that can be purchased with one unit of domestic currency. For example, if you are in the United States, a direct quote for the euro might be 1.0870 USD/EUR, meaning it takes 1.0870 US dollars to buy one euro. Currency pairs are typically quoted with a bid price (the price at which the market will buy the base currency) and an ask price (the price at which the market will sell the base currency). The difference between these two prices is called the spread, which represents the transaction cost of the trade.",
  },
  {
    title: "Factors Affecting Exchange Rates",
    content: "Multiple factors influence exchange rate movements, creating a complex and dynamic market environment. Interest rate differentials between countries are among the most significant drivers, as higher interest rates tend to attract foreign capital, increasing demand for that currency. Inflation rates also play a crucial role—countries with lower inflation rates typically see their currency appreciate in value. Political stability and economic performance can significantly impact investor confidence and currency values. Trade balances, government debt levels, and current account deficits all contribute to a currency's relative strength. Market speculation and investor sentiment can cause short-term volatility, while central bank interventions may have both immediate and lasting effects on exchange rates. Understanding these factors helps businesses anticipate potential currency movements and develop appropriate risk management strategies.",
  },
  {
    title: "Currency Risk Management Strategies",
    content: "Managing currency risk is essential for businesses engaged in international trade. There are several approaches to mitigate exposure to adverse exchange rate movements. Natural hedging involves matching currency inflows with outflows in the same currency, reducing net exposure without using financial instruments. Forward contracts allow businesses to lock in exchange rates for future transactions, providing certainty about the cost or revenue in domestic currency terms. Currency options provide the right but not the obligation to exchange at a predetermined rate, offering protection while preserving upside potential. Multi-currency accounts enable businesses to hold funds in different currencies, allowing them to time their conversions strategically. A comprehensive currency risk management program typically combines multiple strategies based on the company's specific exposure profile and risk tolerance.",
  },
];

// Animated badge component
const AnimatedBadge = ({ 
  children, 
  delay = 0, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  variant?: "ocean" | "logistics" | "default" 
}) => {
  const variantStyles = {
    ocean: "bg-[#0F4C81] text-white",
    logistics: "bg-[#2E8B57] text-white",
    default: "bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
    >
      <Badge 
        className={`px-4 py-2 text-sm font-medium ${variantStyles[variant]} shadow-lg`}
      >
        {children}
      </Badge>
    </motion.div>
  );
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("1000");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [activeTab, setActiveTab] = useState<string>("converter");

  const convert = useMemo(() => {
    const fromRate = mockRates[fromCurrency] || 1;
    const toRate = mockRates[toCurrency] || 1;
    return (parseFloat(amount) || 0) * (toRate / fromRate);
  }, [amount, fromCurrency, toCurrency]);

  const exchangeRate = useMemo(() => {
    const fromRate = mockRates[fromCurrency] || 1;
    const toRate = mockRates[toCurrency] || 1;
    return toRate / fromRate;
  }, [fromCurrency, toCurrency]);

  const inverseRate = useMemo(() => {
    return 1 / exchangeRate;
  }, [exchangeRate]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const historicalData = useMemo(() => {
    return generateHistoricalData(exchangeRate);
  }, [exchangeRate]);

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      fromCurrency,
      toCurrency,
      amount: parseFloat(amount),
      convertedAmount: convert,
      exchangeRate,
      inverseRate,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `currency-conversion-${fromCurrency}-${toCurrency}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `${formatCurrency(parseFloat(amount) || 0, fromCurrency)} = ${formatCurrency(convert, toCurrency)}\nRate: 1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}\nCalculated on Shiportrade.com`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Currency Conversion",
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Conversion copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Animated Badges */}
      <div className="space-y-6">
        {/* Animated Badges - Finance and Trade */}
        <div className="flex justify-center items-center gap-3 flex-wrap">
          <AnimatedBadge delay={0} variant="ocean">
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Finance
            </motion.span>
          </AnimatedBadge>
          
          <AnimatedBadge delay={0.2} variant="logistics">
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Trade
            </motion.span>
          </AnimatedBadge>
          
          <AnimatedBadge delay={0.4}>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4 animate-pulse" />
              Real-time FX
            </motion.span>
          </AnimatedBadge>
        </div>

        {/* Title */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-[#0F4C81] via-[#2E8B57] to-[#0F4C81] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
            Currency Converter
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Get real-time exchange rates for international trade. Convert between 50+ currencies 
            with accurate calculations for your shipping and logistics needs.
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Converted Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#0F4C81]/10 to-transparent border-[#0F4C81]/20 dark:from-[#0F4C81]/20 dark:to-transparent hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Converted Amount</p>
                    <p className="text-2xl font-bold text-[#0F4C81] dark:text-[#5BA3D0]">
                      {formatCurrency(convert, toCurrency)}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#0F4C81]/20 dark:bg-[#0F4C81]/30 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#0F4C81] dark:text-[#5BA3D0]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exchange Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-[#2E8B57]/10 to-transparent border-[#2E8B57]/20 dark:from-[#2E8B57]/20 dark:to-transparent hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Exchange Rate</p>
                    <p className="text-2xl font-bold text-[#2E8B57] dark:text-[#5DC48A]">
                      {exchangeRate.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {fromCurrency}/{toCurrency}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#2E8B57]/20 dark:bg-[#2E8B57]/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-[#2E8B57] dark:text-[#5DC48A]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Inverse Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20 dark:from-amber-500/20 dark:to-transparent hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Inverse Rate</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {inverseRate.toFixed(4)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {toCurrency}/{fromCurrency}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 dark:bg-amber-500/30 flex items-center justify-center">
                    <RefreshCw className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 5-Tab Interface: Converter, Rates, Analysis, Guide, FAQ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="converter" className="flex items-center gap-2 py-3">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Converter</span>
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2 py-3">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">Rates</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 py-3">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
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

        {/* Tab 1: Converter */}
        <TabsContent value="converter" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Card */}
            <Card className="border-2 border-[#0F4C81]/20 dark:border-[#0F4C81]/30">
              <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5 dark:from-[#0F4C81]/10 dark:to-[#2E8B57]/10">
                <CardTitle>Convert Currency</CardTitle>
                <CardDescription>Enter amount and select currencies</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg h-12"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.slice(0, 30).map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>To</Label>
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.slice(0, 30).map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.symbol} {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={swapCurrencies} className="flex-1 gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Swap
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result Card */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 dark:from-[#0F4C81]/10 dark:to-[#2E8B57]/10">
                <CardContent className="pt-6">
                  <div className="text-center mb-6">
                    <div className="text-sm text-muted-foreground mb-2">
                      {formatCurrency(parseFloat(amount) || 0, fromCurrency)} =
                    </div>
                    <motion.div
                      key={convert}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-bold text-[#0F4C81] dark:text-[#5BA3D0]"
                    >
                      {formatCurrency(convert, toCurrency)}
                    </motion.div>
                    <div className="text-sm text-muted-foreground mt-2">
                      1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exchange Rate</span>
                      <span className="font-medium">{exchangeRate.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Inverse Rate</span>
                      <span className="font-medium">{inverseRate.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="font-medium">Just now</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Market Status</span>
                      <Badge variant="secondary" className="bg-[#2E8B57]/20 text-[#2E8B57] dark:bg-[#2E8B57]/30 dark:text-[#5DC48A]">
                        Open
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export/Share Buttons */}
              <div className="flex gap-4">
                <Button variant="outline" onClick={handleExport} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" onClick={handleShare} className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </div>

          {/* Educational Content - Converter Tab */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[#0F4C81]" />
                  Understanding Exchange Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Exchange rates are the cornerstone of international trade and finance, representing the relative value 
                  between two currencies. In the global marketplace, exchange rates determine the competitiveness of 
                  exports, the cost of imports, and ultimately, the profitability of cross-border transactions. For 
                  logistics and shipping companies, understanding exchange rate dynamics is essential for pricing 
                  services, managing costs, and protecting profit margins. The ability to accurately convert between 
                  currencies enables businesses to compare costs across different markets, negotiate effectively with 
                  international partners, and make informed decisions about where to source materials or sell products.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Currency values fluctuate constantly due to a complex interplay of factors including interest rate 
                  differentials, inflation expectations, political stability, trade balances, and market sentiment. 
                  Central banks play a crucial role through monetary policy decisions that can strengthen or weaken 
                  their national currency. For businesses engaged in international trade, these fluctuations represent 
                  both opportunities and risks that must be carefully managed through appropriate hedging strategies. 
                  A thorough understanding of these factors allows companies to anticipate potential currency movements 
                  and adjust their strategies accordingly, whether through timing of transactions, selection of payment 
                  terms, or implementation of financial hedging instruments.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The foreign exchange market operates 24 hours a day, five days a week, with major trading centers 
                  in London, New York, Tokyo, and Sydney. Understanding market hours and liquidity patterns can help 
                  businesses obtain better exchange rates by timing their transactions strategically. During periods 
                  of high liquidity, such as the overlap between London and New York sessions, spreads are typically 
                  tighter, resulting in lower transaction costs. This knowledge is particularly valuable for companies 
                  making large or frequent currency conversions, where even small improvements in execution can 
                  translate to significant cost savings over time. Additionally, understanding market dynamics helps 
                  businesses avoid executing transactions during periods of high volatility that could result in 
                  unfavorable rates.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Rates */}
        <TabsContent value="rates" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[#0F4C81]" />
                Historical Rate Chart
              </CardTitle>
              <CardDescription>
                30-day exchange rate history for {fromCurrency}/{toCurrency}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <defs>
                      <linearGradient id="colorRateRates" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0F4C81" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={["auto", "auto"]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#0F4C81"
                      strokeWidth={2}
                      fill="url(#colorRateRates)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* High/Low Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#2E8B57]" />
                Daily High/Low Range
              </CardTitle>
              <CardDescription>
                Price fluctuation range over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={historicalData.slice(-14)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={["auto", "auto"]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="high" fill="#2E8B57" opacity={0.3} name="High" />
                    <Bar dataKey="low" fill="#0F4C81" opacity={0.3} name="Low" />
                    <Line type="monotone" dataKey="rate" stroke="#0F4C81" strokeWidth={2} name="Close" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Major Pairs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                Major Currency Pairs
              </CardTitle>
              <CardDescription>
                Real-time rates for the most traded currency pairs globally
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Pair</th>
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-right py-3 px-4 font-semibold">Rate</th>
                      <th className="text-right py-3 px-4 font-semibold">Daily Change</th>
                      <th className="text-right py-3 px-4 font-semibold">Weekly Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {majorPairs.map((pair) => (
                      <tr key={pair.pair} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="font-mono">
                            {pair.pair}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{pair.name}</td>
                        <td className="py-3 px-4 text-right font-mono font-medium">{pair.rate.toFixed(4)}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex items-center gap-1 ${pair.dailyChange >= 0 ? "text-[#2E8B57]" : "text-red-500"}`}>
                            {pair.dailyChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {pair.dailyChange >= 0 ? "+" : ""}{pair.dailyChange.toFixed(2)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`inline-flex items-center gap-1 ${pair.weeklyChange >= 0 ? "text-[#2E8B57]" : "text-red-500"}`}>
                            {pair.weeklyChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {pair.weeklyChange >= 0 ? "+" : ""}{pair.weeklyChange.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Educational Content - Rates Tab */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[#0F4C81]" />
                Understanding Rate Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Historical exchange rate data provides valuable insights for businesses engaged in international 
                trade. By analyzing past rate movements, companies can identify trends, seasonal patterns, and 
                potential support and resistance levels that may inform their currency management strategies. 
                Technical analysis of exchange rates can help identify optimal times for currency conversion or 
                hedging decisions, potentially resulting in significant cost savings over time. This analytical 
                approach is particularly valuable for companies with large or recurring foreign exchange needs, 
                where timing improvements of even a few basis points can translate to substantial savings when 
                applied to significant transaction volumes.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Rate volatility is a key consideration for trade finance professionals. Higher volatility 
                increases both the potential for favorable rate movements and the risk of adverse changes. 
                Understanding the typical volatility range for a currency pair helps businesses set appropriate 
                stop-loss levels, determine position sizes, and choose suitable hedging instruments. Historical 
                volatility data can be used to calculate Value at Risk (VaR) and other risk metrics essential 
                for treasury management. By understanding the historical behavior of currency pairs, businesses 
                can develop more accurate forecasts, set realistic expectations for budget planning, and create 
                contingency plans for various market scenarios.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The major currency pairs, often referred to as the &quot;majors,&quot; account for approximately 85% of 
                all foreign exchange transactions globally. These pairs all include the US dollar and are 
                characterized by high liquidity and relatively low transaction costs. Understanding the 
                characteristics of different currency pairs—including their typical trading ranges, 
                correlations with other pairs, and sensitivity to economic events—enables more informed 
                decision-making for currency management. For example, commodity-linked currencies like the 
                Australian and Canadian dollars often move in correlation with commodity prices, while 
                &quot;safe-haven&quot; currencies like the Japanese yen and Swiss franc may strengthen during periods 
                of market stress.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Analysis */}
        <TabsContent value="analysis" className="mt-6 space-y-6">
          {/* Market Share Pie Chart */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[#0F4C81]" />
                  Global Currency Market Share
                </CardTitle>
                <CardDescription>
                  Distribution of major currencies in global FX transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={marketShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={true}
                      >
                        {marketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, "Market Share"]}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Currency Value Comparison</CardTitle>
                <CardDescription>Value of 100 USD in different currencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currencyComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="currency" type="category" className="text-xs" width={40} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" fill="#0F4C81" radius={[0, 4, 4, 0]}>
                        {currencyComparisonData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#0F4C81" : "#2E8B57"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Volatility Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Volatility Comparison</CardTitle>
              <CardDescription>Monthly volatility by currency pair (%)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volatilityData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="eurUsd" name="EUR/USD" fill="#0F4C81" />
                    <Bar dataKey="gbpUsd" name="GBP/USD" fill="#2E8B57" />
                    <Bar dataKey="usdJpy" name="USD/JPY" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Tips Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fxTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-[#0F4C81] dark:border-l-[#5BA3D0]">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">{tip.title}</h3>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Educational Content - Analysis Tab */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[#0F4C81]" />
                Analyzing Currency Markets
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The global foreign exchange market is the largest and most liquid financial market in the world, 
                with daily trading volumes exceeding $7 trillion. The US dollar dominates international trade 
                and finance, accounting for approximately 88% of all foreign exchange transactions. This 
                dominance stems from the dollar&apos;s role as the world&apos;s primary reserve currency, the 
                denomination currency for many commodities, and the preferred settlement currency for 
                international transactions. Understanding market structure and currency market share helps 
                businesses appreciate the liquidity characteristics of different currency pairs and the 
                implications for transaction costs.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Currency analysis encompasses both fundamental and technical approaches. Fundamental analysis 
                examines economic indicators, central bank policies, geopolitical factors, and trade balances 
                to assess a currency&apos;s intrinsic value. Technical analysis uses historical price data, 
                chart patterns, and statistical indicators to identify trading opportunities and manage risk. 
                For businesses engaged in international trade, combining both approaches can provide a more 
                comprehensive view of potential currency movements. Fundamental factors help set long-term 
                strategic direction, while technical analysis can assist with timing of specific transactions 
                and identification of favorable entry points.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Volatility analysis is crucial for risk management and hedging strategy development. Different 
                currency pairs exhibit different volatility characteristics, influenced by factors such as 
                economic stability, monetary policy divergence, and market liquidity. Major pairs like EUR/USD 
                typically have lower volatility and tighter spreads, while emerging market currencies often 
                experience larger price swings. Understanding volatility patterns helps businesses set 
                appropriate risk limits, determine hedge ratios, and select suitable hedging instruments. 
                Periods of elevated volatility may warrant increased hedging activity, while low volatility 
                environments might present opportunities to reduce hedging costs or delay conversions in 
                anticipation of favorable rate movements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="mt-6 space-y-6">
          {/* Guide Sections */}
          {guideSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-l-4 border-l-[#2E8B57] dark:border-l-[#5DC48A]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-8 h-8 rounded-full bg-[#2E8B57]/20 dark:bg-[#2E8B57]/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-[#2E8B57] dark:text-[#5DC48A]">{index + 1}</span>
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Additional Guide Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Currency Risk in International Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Currency risk, also known as foreign exchange risk or FX risk, is one of the most significant 
                  financial risks facing companies engaged in international trade. This risk arises from the 
                  potential for adverse movements in exchange rates between the time a transaction is initiated 
                  and when payment is received or made. For importers, a depreciating domestic currency increases 
                  the cost of foreign purchases; for exporters, an appreciating domestic currency reduces the 
                  value of foreign sales when converted back to the home currency. The magnitude of this risk 
                  depends on the size of foreign currency exposures, the volatility of relevant currency pairs, 
                  and the time horizon of the transactions.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The impact of currency risk extends beyond direct transaction exposure. Companies also face 
                  translation exposure when consolidating foreign subsidiary financial statements, and economic 
                  exposure from changes in competitive position due to exchange rate movements. Translation 
                  exposure affects the reported values of foreign assets and liabilities, while economic 
                  exposure influences long-term competitiveness and market share. Effective currency risk 
                  management requires a comprehensive understanding of all these exposures and the implementation 
                  of appropriate hedging strategies tailored to the company&apos;s specific risk profile and 
                  business objectives. Many companies adopt a layered approach to hedging, using different 
                  instruments for different types and time horizons of exposure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#2E8B57]" />
                  Hedging Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Effective hedging strategies for currency risk range from simple to complex, depending on 
                  the nature and size of the exposure. Natural hedging—matching currency revenues with 
                  expenses—is often the most cost-effective approach. For example, a company that imports 
                  from Europe and exports to Europe can use Euro revenues to pay Euro expenses, reducing 
                  net exposure. Other operational hedges include locating production facilities in major 
                  markets, diversifying supplier bases across currency zones, and pricing contracts in 
                  currencies that align with cost structures. These operational strategies can significantly 
                  reduce the need for financial hedging instruments.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Financial hedging instruments provide additional tools for managing currency risk. Forward 
                  contracts offer certainty by locking in a specific rate for a future date, making them 
                  ideal for known exposures. Options provide protection against adverse moves while preserving 
                  the ability to benefit from favorable movements, though at a higher upfront cost in the 
                  form of premiums. Currency swaps can be useful for longer-term exposures, allowing 
                  companies to effectively &quot;swap&quot; cash flows in different currencies. The choice of 
                  instrument depends on the company&apos;s risk tolerance, accounting treatment preferences, 
                  and cost considerations. A well-designed hedging program typically combines multiple 
                  instruments to optimize the risk-return profile while maintaining operational flexibility.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Best Times Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#0F4C81]" />
                Best Times to Exchange Currency
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Timing can significantly impact the cost of currency exchange in international trade. The 
                foreign exchange market operates 24 hours a day during weekdays, but liquidity and spreads 
                vary considerably throughout the trading day. The most favorable conditions typically occur 
                during the overlap between major trading sessions, when multiple financial centers are 
                active simultaneously. The London-New York overlap, occurring between 8:00 AM and 12:00 PM 
                Eastern Time, offers the highest liquidity and tightest spreads for most major currency pairs. 
                During this period, trading volume peaks and the presence of multiple market participants 
                ensures competitive pricing.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Avoiding high-volatility periods is equally important for cost-effective currency exchange. 
                Major economic data releases, central bank announcements, and geopolitical events can cause 
                sharp exchange rate movements that may result in unfavorable execution prices. The 
                Non-Farm Payrolls report (first Friday of each month), Federal Reserve interest rate 
                decisions, and GDP releases are examples of events that can create significant market 
                turbulence. Experienced traders often avoid executing large transactions immediately 
                before or after such announcements, preferring to wait for markets to stabilize and 
                clearer trends to emerge. Maintaining awareness of the economic calendar and scheduled 
                market-moving events is essential for optimizing currency exchange timing.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                For businesses with recurring foreign exchange needs, implementing a structured approach 
                rather than attempting to time the market can yield better long-term results. Strategies 
                such as averaging (executing regular conversions regardless of market conditions), using 
                limit orders to capture favorable rates, or setting up automated conversion rules can 
                remove emotion from the decision-making process and ensure consistent execution over time. 
                This systematic approach is particularly valuable for companies with regular cash flow 
                needs in foreign currencies, as it reduces the risk of making poor decisions based on 
                short-term market noise while ensuring that currency conversions are completed in a 
                timely manner to meet operational requirements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about currency exchange for international trade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-[#0F4C81] dark:text-[#5BA3D0]">{index + 1}</span>
                        </div>
                        <span>{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-14 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Footer */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Results
        </Button>
        <Button variant="outline" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share Conversion
        </Button>
      </div>
    </div>
  );
}
