"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Info,
  AlertTriangle,
  Shield,
  Calendar,
  ArrowRight,
  BarChart3,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Zap,
  Globe,
  RotateCcw,
  Download,
  Share2,
  Calculator,
  LineChart,
  PieChart,
  AlertCircle,
  CheckCircle2,
  Target,
  Scale,
  Layers,
  ArrowUpDown,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from "recharts";

interface ExchangeResult {
  convertedAmount: number;
  exchangeRate: number;
  rateDate: string;
  forwardRate: number;
  forwardPoints: number;
  hedgeCost: number;
  hedgeCostPercent: number;
  protectedAmount: number;
  potentialSavings: number;
  riskScenarios: {
    scenario: string;
    rateChange: number;
    impact: number;
  }[];
  recommendation: string;
}

// Exchange rates (simulated - in production would use API)
const exchangeRates: Record<string, { rate: number; forwardPremium: number; volatility: number }> = {
  "USD-EUR": { rate: 0.92, forwardPremium: 0.002, volatility: 0.08 },
  "USD-GBP": { rate: 0.79, forwardPremium: 0.003, volatility: 0.10 },
  "USD-CNY": { rate: 7.24, forwardPremium: -0.001, volatility: 0.05 },
  "USD-JPY": { rate: 149.5, forwardPremium: -0.005, volatility: 0.12 },
  "USD-HKD": { rate: 7.82, forwardPremium: 0.0001, volatility: 0.02 },
  "USD-SGD": { rate: 1.34, forwardPremium: 0.001, volatility: 0.06 },
  "USD-AUD": { rate: 1.53, forwardPremium: 0.002, volatility: 0.11 },
  "EUR-GBP": { rate: 0.86, forwardPremium: 0.001, volatility: 0.07 },
  "EUR-CNY": { rate: 7.87, forwardPremium: -0.002, volatility: 0.06 },
  "EUR-JPY": { rate: 162.5, forwardPremium: -0.004, volatility: 0.13 },
  "EUR-USD": { rate: 1.09, forwardPremium: -0.002, volatility: 0.08 },
  "GBP-USD": { rate: 1.27, forwardPremium: -0.003, volatility: 0.10 },
};

const currencyInfo = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
];

// Historical rate data for visualization
const historicalRatesData = [
  { month: "Jan", USD_EUR: 0.91, USD_GBP: 0.78, USD_CNY: 7.10, USD_JPY: 145.2 },
  { month: "Feb", USD_EUR: 0.92, USD_GBP: 0.79, USD_CNY: 7.15, USD_JPY: 147.8 },
  { month: "Mar", USD_EUR: 0.93, USD_GBP: 0.80, USD_CNY: 7.20, USD_JPY: 150.1 },
  { month: "Apr", USD_EUR: 0.91, USD_GBP: 0.79, USD_CNY: 7.18, USD_JPY: 151.5 },
  { month: "May", USD_EUR: 0.92, USD_GBP: 0.78, USD_CNY: 7.22, USD_JPY: 148.9 },
  { month: "Jun", USD_EUR: 0.92, USD_GBP: 0.79, USD_CNY: 7.24, USD_JPY: 149.5 },
];

// Rate comparison across currencies
const rateComparisonData = currencyInfo
  .filter((c) => c.code !== "USD")
  .slice(0, 6)
  .map((c) => {
    const rateKey = `USD-${c.code}`;
    const rate = exchangeRates[rateKey]?.rate || 1;
    return {
      name: c.code,
      rate: rate,
      volatility: (exchangeRates[rateKey]?.volatility || 0.05) * 100,
    };
  });

const FAQS = [
  {
    question: "What is a forward exchange contract and how does it protect my business?",
    answer: "A forward exchange contract is a binding agreement to exchange currencies at a predetermined rate on a future date. It protects your business by locking in the exchange rate today, eliminating uncertainty about future currency movements. For example, if you're a US importer with a €100,000 payment due in 90 days, a forward contract guarantees the USD amount you'll need, regardless of market fluctuations. This is particularly valuable for businesses with thin margins where a 5% currency swing could wipe out profits. Forward contracts typically require no upfront payment and are available for periods from a few days to several years.",
  },
  {
    question: "How do I decide between spot, forward, and options for currency exchange?",
    answer: "The choice depends on your risk tolerance, cash flow needs, and market outlook. Spot transactions are best for immediate payments when you need currency now and can accept current rates. Forward contracts are ideal for known future obligations where you want certainty—perfect for importers/exporters with fixed payment terms. FX options provide flexibility with protection—you pay a premium for the right (but not obligation) to exchange at a set rate, beneficial when you're uncertain about the transaction timing or want to benefit from favorable moves. Many businesses use a combination: forwards for committed amounts, options for uncertain portions, and spot for immediate needs.",
  },
  {
    question: "What factors cause exchange rates to fluctuate?",
    answer: "Exchange rates are influenced by multiple interconnected factors. Interest rate differentials between countries are primary drivers—higher rates attract foreign capital, strengthening the currency. Economic indicators like GDP growth, employment data, and trade balances signal economic health and affect investor confidence. Political stability and government policies, including central bank interventions and quantitative easing programs, create significant impacts. Market sentiment and speculation can cause short-term volatility, especially during crises or major events. Inflation differentials affect purchasing power parity, while commodity prices impact currencies of resource-exporting nations. Understanding these factors helps businesses anticipate potential risks and time their exchanges strategically.",
  },
  {
    question: "How much should I budget for currency hedging costs?",
    answer: "Hedging costs vary based on instrument, currency pair, and market conditions. Forward contracts typically cost 0.1-1% annually, embedded in the forward rate as forward points—this reflects interest rate differentials between currencies. FX options require upfront premiums, usually 0.5-3% of the notional amount, depending on volatility and duration. Cross-currency swaps for longer-term exposures may cost 0.2-0.5% annually. Budget 0.5-1.5% of your foreign currency exposure for comprehensive hedging. Remember that not hedging also has a 'cost'—the potential loss from adverse movements. A €100,000 exposure with 10% volatility represents €10,000 of potential loss, making a 1% hedging cost reasonable insurance.",
  },
  {
    question: "What is the difference between forward premium and forward discount?",
    answer: "Forward premium occurs when the forward rate is higher than the spot rate, indicating the foreign currency is trading at a premium for future delivery. This happens when the base currency has lower interest rates than the quote currency—you're essentially 'earning' the interest differential. Forward discount is the opposite: the forward rate is lower than spot, occurring when the base currency has higher interest rates. For example, USD/JPY typically trades at a forward discount because USD interest rates exceed JPY rates. This isn't a market prediction of currency direction—it's purely mathematical, based on covered interest rate parity. Understanding this helps you separate true hedging costs from interest rate differentials.",
  },
  {
    question: "How can I manage currency risk for recurring international payments?",
    answer: "For recurring payments, consider several strategies: (1) Use a rolling hedge program with layered forwards, hedging a portion of forecasted exposures at different maturities to average out rate fluctuations. (2) Set up multi-currency accounts to hold foreign currencies and time conversions strategically. (3) Negotiate with suppliers to invoice in your home currency, transferring exchange risk to them (though this may affect pricing). (4) Use target rate orders to automatically convert when rates reach your desired level. (5) Consider natural hedging by matching currency revenues with expenses. (6) Implement a formal FX policy defining hedge ratios, instruments, and review periods. Regular monitoring and adjustment ensure your strategy remains aligned with business conditions.",
  },
  {
    question: "What are the accounting and tax implications of currency hedging?",
    answer: "Currency hedging has significant accounting implications under standards like IFRS 9 or ASC 815. For hedge accounting treatment, you must document the hedging relationship, risk being hedged, and effectiveness testing methodology. Without hedge accounting, derivative gains/losses flow through earnings immediately, potentially causing volatility in reported results. Effective hedges can defer gains/losses or match them with the underlying exposure timing. For taxes, realized FX gains/losses are typically ordinary income/expense, but timing differs between cash and accrual basis. Forward contract gains may be taxable when locked in or when settled, depending on jurisdiction. Consult with accounting and tax professionals to understand implications for your specific situation and ensure proper documentation for audit purposes.",
  },
];

const PRO_TIPS = [
  {
    title: "Layer Your Hedges",
    description: "Don't hedge everything at once. Layer forwards at different maturities to average out entry points and reduce timing risk.",
    icon: Layers,
  },
  {
    title: "Monitor Volatility",
    description: "High volatility periods offer hedging opportunities but also increase costs. Track historical volatility to time your hedges.",
    icon: TrendingUp,
  },
  {
    title: "Review Regularly",
    description: "Mark-to-market your positions weekly. Adjust hedges when forecasts change to avoid over-hedging or under-hedging.",
    icon: Target,
  },
  {
    title: "Consider Total Cost",
    description: "Evaluate all-in costs including spreads, fees, and opportunity costs. The cheapest rate isn't always the best value.",
    icon: Scale,
  },
  {
    title: "Document Everything",
    description: "Maintain clear records of hedging decisions, rationale, and outcomes. This is essential for accounting and audit purposes.",
    icon: BookOpen,
  },
];

export function CurrencyExchangeCalculator() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("100000");
  const [hedgeDays, setHedgeDays] = useState("90");
  const [riskTolerance, setRiskTolerance] = useState<"low" | "medium" | "high">("medium");
  const [result, setResult] = useState<ExchangeResult | null>(null);
  const [activeTab, setActiveTab] = useState("calculator");

  const calculateExchange = () => {
    const amountNum = parseFloat(amount) || 0;
    const days = parseInt(hedgeDays) || 90;

    // Get exchange rate
    const rateKey = `${fromCurrency}-${toCurrency}`;
    let rateData = exchangeRates[rateKey];

    // If reverse rate needed
    if (!rateData) {
      const reverseKey = `${toCurrency}-${fromCurrency}`;
      if (exchangeRates[reverseKey]) {
        rateData = {
          rate: 1 / exchangeRates[reverseKey].rate,
          forwardPremium: -exchangeRates[reverseKey].forwardPremium,
          volatility: exchangeRates[reverseKey].volatility,
        };
      } else {
        rateData = { rate: 1, forwardPremium: 0, volatility: 0.05 };
      }
    }

    const convertedAmount = amountNum * rateData.rate;

    // Calculate forward rate
    const forwardPoints = rateData.forwardPremium * (days / 30);
    const forwardRate = rateData.rate * (1 + forwardPoints);

    // Hedge cost
    const hedgeCost = amountNum * Math.abs(forwardPoints);
    const hedgeCostPercent = Math.abs(forwardPoints) * 100;

    // Protected amount using forward
    const protectedAmount = amountNum * forwardRate;

    // Potential savings (based on volatility)
    const potentialSavings = amountNum * rateData.rate * rateData.volatility * (days / 365);

    // Risk scenarios
    const riskScenarios = [
      {
        scenario: "Adverse Movement (-5%)",
        rateChange: -5,
        impact: amountNum * rateData.rate * -0.05,
      },
      {
        scenario: "Adverse Movement (-10%)",
        rateChange: -10,
        impact: amountNum * rateData.rate * -0.1,
      },
      {
        scenario: "Favorable Movement (+5%)",
        rateChange: 5,
        impact: amountNum * rateData.rate * 0.05,
      },
    ];

    // Generate recommendation
    let recommendation = "";
    if (amountNum > 50000 && rateData.volatility > 0.08) {
      recommendation = "High-value transaction with volatile currency pair. Forward contract strongly recommended.";
    } else if (amountNum > 50000) {
      recommendation = "High-value transaction. Consider forward contract for rate protection.";
    } else if (days > 60 && rateData.volatility > 0.06) {
      recommendation = "Long-dated transaction with moderate volatility. Evaluate hedging options.";
    } else {
      recommendation = "Lower risk profile. Spot transaction may be sufficient.";
    }

    if (riskTolerance === "low") {
      recommendation += " Conservative approach: Consider full hedge coverage.";
    }

    setResult({
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      exchangeRate: rateData.rate,
      rateDate: new Date().toISOString().split("T")[0],
      forwardRate: Math.round(forwardRate * 10000) / 10000,
      forwardPoints: Math.round(forwardPoints * 10000) / 10000,
      hedgeCost: Math.round(hedgeCost * 100) / 100,
      hedgeCostPercent: Math.round(hedgeCostPercent * 1000) / 1000,
      protectedAmount: Math.round(protectedAmount * 100) / 100,
      potentialSavings: Math.round(potentialSavings * 100) / 100,
      riskScenarios: riskScenarios.map((s) => ({
        ...s,
        impact: Math.round(s.impact * 100) / 100,
      })),
      recommendation,
    });
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
  };

  const resetForm = () => {
    setAmount("100000");
    setHedgeDays("90");
    setRiskTolerance("medium");
    setResult(null);
    setFromCurrency("USD");
    setToCurrency("EUR");
  };

  const getCurrencySymbol = (code: string) => {
    return currencyInfo.find((c) => c.code === code)?.symbol || code;
  };

  const getCurrencyFlag = (code: string) => {
    return currencyInfo.find((c) => c.code === code)?.flag || "";
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return "#10B981";
    if (efficiency >= 60) return "#22C55E";
    if (efficiency >= 40) return "#F59E0B";
    return "#EF4444";
  };

  // Chart data for analysis
  const selectedRateData = historicalRatesData.map((item) => ({
    month: item.month,
    rate: item[`${fromCurrency}_${toCurrency}` as keyof typeof item] || item.USD_EUR,
  }));

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81]/5 via-background to-[#2E8B57]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F4C81]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2E8B57]/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[#0F4C81] text-white">
                  <Globe className="h-3 w-3 mr-1" />
                  International Trade
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="border-[#2E8B57] text-[#2E8B57]">
                  <Zap className="h-3 w-3 mr-1" />
                  FX Tools
                </Badge>
              </motion.div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Currency Exchange Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Calculate exchange rates, forward contracts, and currency risk exposure for international trade.
              Optimize your FX strategy with comprehensive analysis and hedging recommendations.
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
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Rates</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
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
                    <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                    Exchange Parameters
                  </CardTitle>
                  <CardDescription>Enter amount and currency details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        {getCurrencySymbol(fromCurrency)}
                      </span>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10"
                        placeholder="100,000"
                      />
                    </div>
                  </div>

                  {/* Currency Selection */}
                  <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                    <div className="space-y-2">
                      <Label>From</Label>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyInfo.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.code} - {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={swapCurrencies}
                      className="mb-0.5"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <Label>To</Label>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyInfo.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.flag} {c.code} - {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Hedging Parameters */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#2E8B57]" />
                      Hedging Options
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hedgeDays">Forward Period (Days)</Label>
                        <Select value={hedgeDays} onValueChange={setHedgeDays}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 Days</SelectItem>
                            <SelectItem value="60">60 Days</SelectItem>
                            <SelectItem value="90">90 Days</SelectItem>
                            <SelectItem value="180">180 Days</SelectItem>
                            <SelectItem value="365">365 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Risk Tolerance</Label>
                        <Select
                          value={riskTolerance}
                          onValueChange={(v: "low" | "medium" | "high") => setRiskTolerance(v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Conservative</SelectItem>
                            <SelectItem value="medium">Moderate</SelectItem>
                            <SelectItem value="high">Aggressive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={calculateExchange}
                      className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[#0F4C81]/20">
                <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                    Analysis Results
                  </CardTitle>
                  <CardDescription>Exchange rate analysis and hedging costs</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        {/* Primary Result */}
                        <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white text-center">
                          <p className="text-sm opacity-90 mb-2">Converted Amount</p>
                          <p className="text-4xl font-bold">
                            {getCurrencySymbol(toCurrency)}
                            {result.convertedAmount.toLocaleString()}
                          </p>
                          <p className="text-sm opacity-75 mt-2">
                            Rate: 1 {fromCurrency} = {result.exchangeRate.toFixed(4)} {toCurrency}
                          </p>
                        </div>

                        {/* Spot vs Forward */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <DollarSign className="h-4 w-4 text-[#0F4C81]" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Spot Rate
                              </span>
                            </div>
                            <p className="text-xl font-bold text-[#0F4C81]">
                              {result.exchangeRate.toFixed(4)}
                            </p>
                          </div>
                          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                Forward Rate
                              </span>
                            </div>
                            <p className="text-xl font-bold text-[#2E8B57]">
                              {result.forwardRate.toFixed(4)}
                            </p>
                          </div>
                        </div>

                        {/* Hedging Costs */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                            Hedging Analysis
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-600 dark:text-slate-400">
                                Forward Points
                              </span>
                              <Badge variant="outline">{result.forwardPoints.toFixed(4)}</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-600 dark:text-slate-400">Hedge Cost</span>
                              <Badge className="bg-[#0F4C81]/10 text-[#0F4C81]">
                                {getCurrencySymbol(toCurrency)}
                                {result.hedgeCost.toLocaleString()}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                              <span className="text-slate-600 dark:text-slate-400">
                                Cost Percentage
                              </span>
                              <Badge variant="secondary">{result.hedgeCostPercent}%</Badge>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-slate-600 dark:text-slate-400">
                                Protected Amount
                              </span>
                              <Badge className="bg-[#2E8B57]/10 text-[#2E8B57]">
                                {getCurrencySymbol(toCurrency)}
                                {result.protectedAmount.toLocaleString()}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Risk Scenarios */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                            Risk Scenarios
                          </h4>
                          <div className="space-y-2">
                            {result.riskScenarios.map((scenario, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center py-2 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                              >
                                <span className="text-sm">{scenario.scenario}</span>
                                <Badge
                                  className={
                                    scenario.impact < 0
                                      ? "bg-red-500"
                                      : "bg-emerald-500"
                                  }
                                >
                                  {scenario.impact >= 0 ? "+" : ""}
                                  {getCurrencySymbol(toCurrency)}
                                  {scenario.impact.toLocaleString()}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-amber-600" />
                            <p className="font-semibold text-amber-700 dark:text-amber-400">
                              Recommendation
                            </p>
                          </div>
                          <p className="text-sm text-amber-600 dark:text-amber-400">
                            {result.recommendation}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                      >
                        <DollarSign className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">
                          Enter parameters and click Calculate
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Rates Tab */}
        <TabsContent value="rates" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                  Live Exchange Rates
                </CardTitle>
                <CardDescription>Current exchange rates for major currency pairs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-background">
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold">Pair</th>
                        <th className="text-center py-3 px-4 font-semibold">Spot Rate</th>
                        <th className="text-center py-3 px-4 font-semibold">Volatility</th>
                        <th className="text-center py-3 px-4 font-semibold">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(exchangeRates).map(([pair, data], index) => (
                        <tr
                          key={pair}
                          className={`border-b border-slate-100 dark:border-slate-800 ${
                            index % 2 === 0 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-medium">{pair.replace("-", " → ")}</td>
                          <td className="text-center py-3 px-4">
                            <Badge className="bg-[#0F4C81]/10 text-[#0F4C81]">
                              {data.rate.toFixed(4)}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge
                              className={
                                data.volatility > 0.1
                                  ? "bg-red-500"
                                  : data.volatility > 0.05
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }
                            >
                              {(data.volatility * 100).toFixed(1)}%
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            {data.forwardPremium > 0 ? (
                              <div className="flex items-center justify-center gap-1 text-emerald-600">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm">Premium</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1 text-red-600">
                                <TrendingDown className="h-4 w-4" />
                                <span className="text-sm">Discount</span>
                              </div>
                            )}
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
                  <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  Rate Comparison
                </CardTitle>
                <CardDescription>Exchange rates across major currencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rateComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                      <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="rate"
                        name="Exchange Rate"
                        fill="#0F4C81"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="volatility"
                        name="Volatility %"
                        stroke="#2E8B57"
                        strokeWidth={2}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historical Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#0F4C81]" />
                Historical Rate Comparison
              </CardTitle>
              <CardDescription>6-month historical rates for major currency pairs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={historicalRatesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="USD_EUR"
                      name="USD/EUR"
                      stroke="#0F4C81"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="USD_GBP"
                      name="USD/GBP"
                      stroke="#2E8B57"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="USD_JPY"
                      name="USD/JPY (÷100)"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[#0F4C81]" />
                  Rate Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={selectedRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        name="Exchange Rate"
                        fill="#0F4C81"
                        fillOpacity={0.3}
                        stroke="#0F4C81"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[#2E8B57]" />
                  Volatility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={rateComparisonData.filter((d) => d.name !== "USD")}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 15]} />
                      <YAxis dataKey="name" type="category" width={50} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="volatility" name="Volatility %" fill="#2E8B57" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#0F4C81]">
                    {result?.exchangeRate.toFixed(4) || "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Spot Rate</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[#2E8B57]">
                    {result?.forwardRate.toFixed(4) || "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">Forward Rate</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {result?.hedgeCostPercent || "—"}%
                  </div>
                  <div className="text-sm text-muted-foreground">Hedge Cost</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {result?.potentialSavings?.toLocaleString() || "—"}
                  </div>
                  <div className="text-sm text-muted-foreground">Potential Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pro Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for FX Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[#2E8B57] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Understanding Exchange Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0F4C81]" />
                  Understanding Exchange Rates
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none text-sm">
                <p className="text-muted-foreground">
                  Exchange rates represent the value of one currency relative to another and serve as a
                  fundamental mechanism in international trade and finance. These rates fluctuate continuously
                  based on supply and demand dynamics in global foreign exchange markets, which operate 24 hours
                  a day across major financial centers worldwide. The spot rate represents the current market
                  price for immediate currency exchange, while forward rates lock in prices for future delivery.
                </p>
                <p className="text-muted-foreground mt-4">
                  For businesses engaged in international trade, understanding exchange rate mechanics is crucial
                  for accurate pricing, cost estimation, and risk management. A 5% adverse currency movement can
                  transform a profitable transaction into a loss, making currency risk assessment an essential
                  component of trade finance strategy. Forward contracts, options, and other hedging instruments
                  provide tools to manage this exposure effectively.
                </p>
              </CardContent>
            </Card>

            {/* Impact on International Trade */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#2E8B57]" />
                  Impact on International Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none text-sm">
                <p className="text-muted-foreground">
                  Currency exchange rates profoundly impact international trade competitiveness and profitability.
                  When a domestic currency strengthens, exports become more expensive for foreign buyers, potentially
                  reducing sales volumes and market share. Conversely, imports become cheaper, which can benefit
                  businesses sourcing goods abroad but may challenge domestic producers competing with foreign goods.
                </p>
                <p className="text-muted-foreground mt-4">
                  For importers, a strengthening domestic currency reduces the cost of foreign goods and services,
                  improving margins or allowing competitive pricing. However, this advantage can reverse quickly
                  during currency depreciation. Exporters face the opposite dynamics—favorable moves during
                  depreciation, challenges during appreciation. Smart businesses develop comprehensive FX strategies
                  that account for these dynamics and use hedging tools to stabilize costs and revenues regardless
                  of market movements.
                </p>
              </CardContent>
            </Card>

            {/* Hedging Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Hedging Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none text-sm">
                <p className="text-muted-foreground">
                  Effective currency hedging requires understanding the full toolkit of FX instruments and matching
                  them to specific business exposures. Forward contracts provide certainty by locking in rates for
                  known future cash flows—ideal for committed import/export payments. Options offer protection with
                  upside potential, suitable when transaction timing or amounts are uncertain. Cross-currency swaps
                  address longer-term exposures such as foreign investments or financing arrangements.
                </p>
                <p className="text-muted-foreground mt-4">
                  A layered hedging approach often proves most effective: hedge near-term exposures completely with
                  forwards, use options for medium-term uncertain exposures, and maintain flexibility for longer-dated
                  positions. The optimal hedge ratio—percentage of exposure covered—depends on risk tolerance, margin
                  sensitivity, and market conditions. Regular review and adjustment ensure the strategy remains
                  aligned with business objectives and evolving market dynamics.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0F4C81]" />
                Best Practices for FX Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <h5 className="font-semibold text-[#0F4C81] mb-2">Define Policy</h5>
                  <p className="text-sm text-muted-foreground">
                    Establish a formal FX policy with clear objectives, instruments, hedge ratios, and
                    approval processes. Document everything for audit trails.
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <h5 className="font-semibold text-[#2E8B57] mb-2">Identify Exposure</h5>
                  <p className="text-sm text-muted-foreground">
                    Map all currency exposures across the business. Differentiate between transaction,
                    translation, and economic exposure for appropriate management.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                  <h5 className="font-semibold text-purple-600 mb-2">Monitor Markets</h5>
                  <p className="text-sm text-muted-foreground">
                    Track market conditions, volatility trends, and central bank policies. Stay informed
                    to identify hedging opportunities and emerging risks.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <h5 className="font-semibold text-amber-600 mb-2">Review Regularly</h5>
                  <p className="text-sm text-muted-foreground">
                    Conduct regular reviews of hedge effectiveness, mark-to-market positions, and strategy
                    alignment. Adjust as business conditions evolve.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about currency exchange in international trade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CurrencyExchangeCalculator;
