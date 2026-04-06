"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  BarChart3,
  Shield,
  ArrowUpDown,
  PieChart as PieChartIcon,
  Target,
  Zap,
  Percent,
  Clock,
  Sparkles,
  HelpCircle,
  BookOpen,
  FileText,
  Scale,
  Globe,
  ArrowLeftRight,
  AlertCircle,
  Wallet,
  LineChart,
  Layers,
} from "lucide-react";
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
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency, getCurrencyByCode } from "@/lib/constants/currencies";

// Hedge instrument types
type HedgeInstrument = "forward" | "call_option" | "put_option" | "fx_swap" | "natural";

// Interest rate differentials for major currency pairs (annualized)
const INTEREST_RATES: Record<string, number> = {
  USD: 5.25,
  EUR: 4.0,
  GBP: 5.0,
  JPY: 0.1,
  CNY: 3.45,
  CHF: 1.75,
  AUD: 4.35,
  CAD: 4.75,
  SGD: 3.5,
  HKD: 4.75,
  INR: 6.5,
  AED: 4.4,
  SAR: 5.0,
};

// Hedge instrument configurations with detailed information
const HEDGE_INSTRUMENTS: Record<HedgeInstrument, {
  name: string;
  description: string;
  premiumType: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  riskLevel: string;
  flexibility: string;
  typicalCost: string;
}> = {
  forward: {
    name: "Forward Contract",
    description: "A forward contract is a binding agreement to exchange currencies at a predetermined rate on a specified future date. Unlike options, forwards create an obligation for both parties to complete the transaction, making them ideal for businesses with known future currency needs. Forward contracts are traded over-the-counter (OTC) and can be customized to match exact amounts and maturity dates.",
    premiumType: "No upfront premium",
    pros: ["Zero upfront cost - no initial cash outlay required", "Locked-in exchange rate provides certainty for budgeting", "Fully customizable amount and settlement date", "No margin calls for typical trade finance forwards", "Simple to understand and execute", "Widely available from all major banks"],
    cons: ["Obligation to fulfill even if market moves favorably", "No upside potential if rates improve", "Credit risk with counterparty (bank)", "Cannot be cancelled or modified easily", "May require credit facility approval", "Opportunity cost if spot rate exceeds forward rate"],
    bestFor: "Known future payments with fixed dates and amounts",
    riskLevel: "Low",
    flexibility: "Low",
    typicalCost: "Embedded in forward points (0.1-2% annually)",
  },
  call_option: {
    name: "Call Option",
    description: "A call option gives the holder the right (but not obligation) to buy a currency at a predetermined strike price before or at expiration. This instrument is particularly valuable for protecting against rising foreign currency costs while retaining the ability to benefit from favorable rate movements. Call options are ideal when you need protection but want to participate in beneficial market moves.",
    premiumType: "Premium paid upfront",
    pros: ["Unlimited upside potential - benefit from favorable moves", "No obligation to exercise if rate moves favorably", "Known maximum cost from the start", "Flexible - can be sold back to market", "No credit line required", "Can be structured with various strike prices"],
    cons: ["Upfront premium cost that may be substantial", "Time decay reduces option value over time", "Strike rate selection is critical and complex", "May expire worthless if not exercised", "Premium is sunk cost regardless of outcome", "Complex pricing requires expertise"],
    bestFor: "Protecting against rising rates while retaining upside",
    riskLevel: "Medium",
    flexibility: "High",
    typicalCost: "1-5% of notional (varies by volatility)",
  },
  put_option: {
    name: "Put Option",
    description: "A put option provides the right (but not obligation) to sell a currency at a predetermined strike price. Exporters and companies receiving foreign currency use put options to protect against adverse currency depreciation while maintaining the ability to benefit if the foreign currency strengthens. Put options create a floor for receivables without capping upside potential.",
    premiumType: "Premium paid upfront",
    pros: ["Protects against adverse rate movements", "No obligation to exercise", "Retains unlimited upside potential", "Liquid secondary markets for major pairs", "Known maximum loss (premium paid)", "Can be combined with calls for zero-cost collars"],
    cons: ["Premium cost regardless of outcome", "Complex Black-Scholes pricing", "Strike selection requires analysis", "Counterparty risk with OTC options", "Time decay accelerates near expiration", "May require margin for writing options"],
    bestFor: "Protecting receivables against falling rates",
    riskLevel: "Medium",
    flexibility: "High",
    typicalCost: "1-5% of notional (varies by volatility)",
  },
  fx_swap: {
    name: "FX Swap",
    description: "An FX swap combines a spot foreign exchange transaction with a simultaneous forward transaction in the opposite direction. This structure effectively rolls a forward contract forward or creates a synthetic loan in a foreign currency. FX swaps are extensively used in trade finance for managing timing mismatches between payment dates and for adjusting hedge positions without realizing gains or losses.",
    premiumType: "Swap points (can be positive or negative)",
    pros: ["Matches cash flows exactly with operational needs", "Lower transaction costs vs separate trades", "Rolling hedge capability for uncertain dates", "Common and well-understood in trade finance", "No net currency position created", "Efficient for adjusting hedge timing"],
    cons: ["Requires settlement of first leg", "Two transaction dates to manage", "More complex than simple forwards", "Rollover risk if rates change", "May trigger accounting requirements", "Swap points can be negative (costly)"],
    bestFor: "Rolling hedges, timing flexibility, synthetic funding",
    riskLevel: "Low",
    flexibility: "Medium",
    typicalCost: "Swap spread (0.05-0.5% per transaction)",
  },
  natural: {
    name: "Natural Hedge",
    description: "A natural hedge involves structuring business operations to offset currency exposure without using financial instruments. This can include matching currency revenues with expenses, sourcing inputs in the same currency as sales, or locating production facilities in major markets. Natural hedging provides permanent protection without ongoing costs but requires significant operational changes and may not cover all exposure.",
    premiumType: "No direct cost",
    pros: ["Zero transaction cost - no premiums or spreads", "No counterparty risk", "Permanent operational solution", "Improves overall business efficiency", "No accounting complexity", "Can enhance customer/supplier relationships"],
    cons: ["Requires matching currency flows", "Operational complexity and restructuring", "May not cover all currency exposure", "Limited flexibility once implemented", "May conflict with optimal sourcing strategy", "Geographic constraints may apply"],
    bestFor: "Companies with balanced currency inflows/outflows",
    riskLevel: "Very Low",
    flexibility: "Very Low",
    typicalCost: "Operational costs only",
  },
};

// FAQ data with comprehensive answers
const FAQ_DATA = [
  {
    question: "What is the difference between a forward contract and an FX option?",
    answer: "A forward contract is a binding obligation to exchange currencies at a predetermined rate on a future date. You must complete the transaction regardless of market conditions, which eliminates both downside risk and upside potential. In contrast, an FX option gives you the right but not the obligation to exchange currencies at a specified rate. With an option, you pay an upfront premium to protect against adverse moves while retaining the ability to benefit from favorable rate movements. Forwards are typically best when you have firm commitments and want zero upfront cost, while options are preferable when you want flexibility or have uncertain cash flows.",
  },
  {
    question: "How is the forward exchange rate calculated?",
    answer: "The forward exchange rate is calculated using Interest Rate Parity (IRP), which ensures that the forward rate reflects the interest rate differential between two currencies. The formula is: Forward Rate = Spot Rate × (1 + r_quote × T) / (1 + r_base × T), where r_quote is the quote currency interest rate, r_base is the base currency rate, and T is the time to maturity in years. For example, if the USD/EUR spot rate is 1.0850, USD rates are 5.25%, EUR rates are 4.0%, and the forward period is 6 months (0.5 years), the forward rate would be approximately 1.0808. This reflects that the higher-yielding currency (USD) trades at a forward discount.",
  },
  {
    question: "When should a company hedge its foreign exchange exposure?",
    answer: "Companies should consider hedging when: (1) Currency volatility could significantly impact profit margins or cash flows - typically when FX exposure exceeds 5-10% of revenue; (2) There are known future receivables or payables in foreign currencies with fixed dates; (3) The business operates on thin margins where currency movements could turn profitable transactions into losses; (4) The company has specific budget requirements or debt covenants that require predictable cash flows; (5) Management wants to reduce earnings volatility for investors. However, hedging should be part of a defined risk management policy, not speculation. The decision should consider the cost of hedging versus the potential impact of unhedged exposure, the company's risk tolerance, and accounting treatment implications.",
  },
  {
    question: "What are the main costs associated with FX hedging?",
    answer: "FX hedging costs vary by instrument: (1) Forward contracts have no upfront premium but embed costs in the forward points (the difference between spot and forward rates), typically 0.1-2% annually depending on interest rate differentials; (2) Options require upfront premium payments, usually 1-5% of the notional amount depending on volatility, strike price, and tenor; (3) FX swaps involve swap points which can be positive or negative depending on interest rate differentials; (4) Natural hedges have no direct financial cost but may involve operational restructuring expenses. Additionally, all instruments involve bid-offer spreads (typically 0.02-0.10% for major pairs), potential credit facility fees for forwards, and administrative costs for hedge documentation and accounting compliance.",
  },
  {
    question: "How do I determine the optimal hedge ratio for my exposure?",
    answer: "The optimal hedge ratio depends on several factors: (1) Risk tolerance - more conservative companies may hedge 70-100% of known exposure, while others may hedge 30-50%; (2) Certainty of cash flows - firm commitments warrant higher hedge ratios than forecasted transactions; (3) Hedge accounting requirements - to qualify for hedge accounting, documentation must demonstrate effectiveness, typically requiring 80-125% coverage; (4) Layering strategies - many companies hedge incrementally over time (e.g., 50% at 12 months, 75% at 6 months, 100% at 3 months) to balance cost and flexibility; (5) Currency volatility - more volatile pairs may warrant higher hedge ratios. A common approach is to maintain a core hedge of 60-80% and adjust based on market conditions and business outlook.",
  },
  {
    question: "What is hedge accounting and why is it important?",
    answer: "Hedge accounting is a special accounting treatment under IFRS 9 and ASC 815 that allows companies to match the timing of hedge gains/losses with the underlying exposure in financial statements. Without hedge accounting, derivatives are marked-to-market each period, potentially creating significant earnings volatility even when the hedge is effective. To qualify for hedge accounting, companies must: (1) Formally document the hedging relationship, risk management objective, and hedge effectiveness testing methodology at inception; (2) Demonstrate that the hedge is highly effective (80-125% effectiveness ratio); (3) Ongoing effectiveness testing and documentation. While hedge accounting adds complexity, it provides a more accurate representation of economic hedging results and is often required by investors and lenders.",
  },
  {
    question: "How do interest rate changes affect my hedging strategy?",
    answer: "Interest rates directly impact FX hedging through Interest Rate Parity: (1) Forward rates adjust based on interest rate differentials - higher rates in one currency cause it to trade at a forward discount; (2) Rising US rates relative to other currencies will push USD forward rates lower, making USD receivables hedging less attractive and USD payables hedging more attractive; (3) Option premiums are affected by interest rate differentials through the cost of carry in pricing models; (4) Central bank policy changes can create sudden shifts in forward points, affecting the cost of rolling hedges; (5) In high-interest-rate environments, the 'carry' cost of hedging increases. Companies should monitor interest rate expectations when planning hedge tenors and consider using shorter-dated instruments when rate differentials are unfavorable.",
  },
];

// Calculation interfaces
interface HedgeCalculation {
  forwardRate: number;
  forwardPoints: number;
  hedgeCost: number;
  hedgeCostPercent: number;
  breakEvenRate: number;
  effectiveRate: number;
  exposureCovered: number;
  potentialGain: number;
  potentialLoss: number;
  scenarios: {
    best: { rate: number; pnl: number };
    expected: { rate: number; pnl: number };
    worst: { rate: number; pnl: number };
  };
  monthlyData: Array<{
    month: number;
    spotRate: number;
    forwardRate: number;
    hedgeCost: number;
    cumulativeCost: number;
  }>;
}

// Calculate forward rate using interest rate parity
function calculateForwardRate(
  spotRate: number,
  baseCurrency: string,
  quoteCurrency: string,
  periodMonths: number
): { forwardRate: number; forwardPoints: number } {
  const baseRate = INTEREST_RATES[baseCurrency] ?? 5.0;
  const quoteRate = INTEREST_RATES[quoteCurrency] ?? 5.0;
  
  // Interest rate parity: F = S * (1 + r_quote * T) / (1 + r_base * T)
  const T = periodMonths / 12; // Time in years
  const forwardRate = spotRate * ((1 + (quoteRate / 100) * T) / (1 + (baseRate / 100) * T));
  const forwardPoints = (forwardRate - spotRate) * 10000; // In pips
  
  return { forwardRate, forwardPoints };
}

// Calculate option premium using simplified Black-Scholes
function calculateOptionPremium(
  spotRate: number,
  strikeRate: number,
  periodMonths: number,
  volatility: number,
  isCall: boolean
): number {
  // Simplified calculation for demo purposes
  const T = periodMonths / 12;
  const d1 = (Math.log(spotRate / strikeRate) + (0.5 * volatility * volatility) * T) / (volatility * Math.sqrt(T));
  const d2 = d1 - volatility * Math.sqrt(T);
  
  // Standard normal CDF approximation
  const N = (x: number) => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1.0 + sign * y);
  };
  
  const callPrice = spotRate * N(d1) - strikeRate * Math.exp(-INTEREST_RATES.USD / 100 * T) * N(d2);
  const putPrice = strikeRate * Math.exp(-INTEREST_RATES.USD / 100 * T) * N(-d2) - spotRate * N(-d1);
  
  return Math.max(0, isCall ? callPrice : putPrice) * spotRate * 0.02; // Scale to percentage
}

export function FXHedgingCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Input state
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [quoteCurrency, setQuoteCurrency] = useState("EUR");
  const [spotRate, setSpotRate] = useState<string>("1.0850");
  const [forwardRateInput, setForwardRateInput] = useState<string>("");
  const [hedgeAmount, setHedgeAmount] = useState<string>("1000000");
  const [hedgePeriod, setHedgePeriod] = useState<number>(6);
  const [hedgeInstrument, setHedgeInstrument] = useState<HedgeInstrument>("forward");
  const [hedgePercentage, setHedgePercentage] = useState<number>(100);
  const [volatility, setVolatility] = useState<number>(10);
  const [strikeRate, setStrikeRate] = useState<string>("");
  
  // Calculations
  const calculations = useMemo<HedgeCalculation>(() => {
    const spot = parseFloat(spotRate) || 1.0;
    const amount = parseFloat(hedgeAmount) || 0;
    const forwardInput = forwardRateInput ? parseFloat(forwardRateInput) : null;
    const strike = strikeRate ? parseFloat(strikeRate) : spot;
    
    // Calculate forward rate
    const { forwardRate: calcForwardRate, forwardPoints } = calculateForwardRate(
      spot,
      baseCurrency,
      quoteCurrency,
      hedgePeriod
    );
    const forwardRate = forwardInput ?? calcForwardRate;
    
    // Hedge cost based on instrument
    let hedgeCost = 0;
    let hedgeCostPercent = 0;
    
    if (hedgeInstrument === "call_option" || hedgeInstrument === "put_option") {
      const isCall = hedgeInstrument === "call_option";
      hedgeCost = calculateOptionPremium(spot, strike, hedgePeriod, volatility / 100, isCall) * amount;
      hedgeCostPercent = (hedgeCost / amount) * 100;
    } else if (hedgeInstrument === "fx_swap") {
      hedgeCost = Math.abs((forwardRate - spot) * amount);
      hedgeCostPercent = Math.abs((forwardRate - spot) / spot) * 100;
    } else if (hedgeInstrument === "natural") {
      hedgeCost = 0;
      hedgeCostPercent = 0;
    } else {
      hedgeCost = Math.abs((forwardRate - spot) * amount);
      hedgeCostPercent = Math.abs((forwardRate - spot) / spot) * 100;
    }
    
    // Break-even rate
    const breakEvenRate = hedgeInstrument.includes("option")
      ? strike + (hedgeCost / amount)
      : forwardRate;
    
    // Effective rate after hedging
    const effectiveRate = hedgeInstrument.includes("option")
      ? strike
      : forwardRate;
    
    // Exposure covered
    const exposureCovered = (amount * hedgePercentage) / 100;
    
    // Scenarios (best, expected, worst case)
    const bestCaseMove = spot * (1 + volatility / 100);
    const worstCaseMove = spot * (1 - volatility / 100);
    
    let bestPn = 0;
    let expectedPn = 0;
    let worstPn = 0;
    
    if (hedgeInstrument === "forward") {
      bestPn = (bestCaseMove - forwardRate) * exposureCovered;
      expectedPn = 0;
      worstPn = (worstCaseMove - forwardRate) * exposureCovered;
    } else if (hedgeInstrument === "call_option") {
      bestPn = Math.max(0, bestCaseMove - strike) * exposureCovered - hedgeCost;
      expectedPn = -hedgeCost;
      worstPn = -hedgeCost;
    } else if (hedgeInstrument === "put_option") {
      bestPn = -hedgeCost;
      expectedPn = -hedgeCost;
      worstPn = Math.max(0, strike - worstCaseMove) * exposureCovered - hedgeCost;
    } else if (hedgeInstrument === "natural") {
      bestPn = (bestCaseMove - spot) * exposureCovered;
      expectedPn = 0;
      worstPn = (worstCaseMove - spot) * exposureCovered;
    } else {
      bestPn = (bestCaseMove - forwardRate) * exposureCovered / 2;
      expectedPn = 0;
      worstPn = (worstCaseMove - forwardRate) * exposureCovered / 2;
    }
    
    // Monthly data for chart
    const monthlyData = [];
    const monthlyCost = hedgeCost / hedgePeriod;
    let cumulativeCost = 0;
    
    for (let i = 0; i <= hedgePeriod; i++) {
      const rateProgression = spot + ((forwardRate - spot) * i / hedgePeriod);
      cumulativeCost += monthlyCost;
      
      monthlyData.push({
        month: i,
        spotRate: spot * (1 + (Math.random() - 0.5) * 0.02 * i),
        forwardRate: rateProgression,
        hedgeCost: monthlyCost,
        cumulativeCost,
      });
    }
    
    return {
      forwardRate,
      forwardPoints,
      hedgeCost,
      hedgeCostPercent,
      breakEvenRate,
      effectiveRate,
      exposureCovered,
      potentialGain: Math.max(0, bestPn),
      potentialLoss: Math.min(0, worstPn),
      scenarios: {
        best: { rate: bestCaseMove, pnl: bestPn },
        expected: { rate: spot, pnl: expectedPn },
        worst: { rate: worstCaseMove, pnl: worstPn },
      },
      monthlyData,
    };
  }, [
    spotRate,
    hedgeAmount,
    forwardRateInput,
    baseCurrency,
    quoteCurrency,
    hedgePeriod,
    hedgeInstrument,
    hedgePercentage,
    volatility,
    strikeRate,
  ]);
  
  // Cost breakdown for pie chart
  const costBreakdown = useMemo(() => {
    const data = [];
    
    if (hedgeInstrument.includes("option")) {
      data.push({ name: "Option Premium", value: calculations.hedgeCost, color: "#0F4C81" });
    }
    
    if (hedgeInstrument === "forward" || hedgeInstrument === "fx_swap") {
      data.push({ name: "Forward Points", value: Math.abs(calculations.forwardPoints) * parseFloat(hedgeAmount) / 10000, color: "#0F4C81" });
      data.push({ name: "Opportunity Cost", value: calculations.potentialGain, color: "#2E8B57" });
    }
    
    if (calculations.potentialLoss < 0) {
      data.push({ name: "Downside Protection", value: Math.abs(calculations.potentialLoss), color: "#F59E0B" });
    }
    
    if (data.length === 0) {
      data.push({ name: "No Direct Cost", value: 1, color: "#94a3b8" });
    }
    
    return data;
  }, [calculations, hedgeInstrument, hedgeAmount]);
  
  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    area: "rgba(15, 76, 129, 0.2)",
  };
  
  const baseCurrencyInfo = getCurrencyByCode(baseCurrency);
  const quoteCurrencyInfo = getCurrencyByCode(quoteCurrency);
  
  const handleSwapCurrencies = useCallback(() => {
    setBaseCurrency(quoteCurrency);
    setQuoteCurrency(baseCurrency);
    setSpotRate((parseFloat(spotRate) > 0 ? (1 / parseFloat(spotRate)).toFixed(4) : "1"));
  }, [baseCurrency, quoteCurrency, spotRate]);
  
  const handleReset = useCallback(() => {
    setSpotRate("1.0850");
    setForwardRateInput("");
    setHedgeAmount("1000000");
    setHedgePeriod(6);
    setHedgeInstrument("forward");
    setHedgePercentage(100);
    setVolatility(10);
    setStrikeRate("");
  }, []);

  // Instrument comparison data for table
  const instrumentComparisonData = useMemo(() => {
    return Object.entries(HEDGE_INSTRUMENTS).map(([key, inst]) => ({
      instrument: inst.name,
      key,
      costType: inst.premiumType,
      typicalCost: inst.typicalCost,
      riskLevel: inst.riskLevel,
      flexibility: inst.flexibility,
      bestFor: inst.bestFor,
    }));
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 mr-2" />
              Currency Risk Management
            </Badge>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-2">FX Hedging Calculator</h2>
            <p className="text-white/80 max-w-2xl text-lg">
              Plan your foreign exchange hedging strategy with precision. Calculate forward rates, 
              compare instruments, and analyze P&L scenarios for international trade transactions.
            </p>
          </motion.div>
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/70 text-sm">Hedge Cost</span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(calculations.hedgeCost, baseCurrency)}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {calculations.hedgeCostPercent.toFixed(2)}% of notional
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-[#2E8B57]/30 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/70 text-sm">Protected Amount</span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(calculations.exposureCovered, baseCurrency)}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {hedgePercentage}% coverage
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/70 text-sm">Break-Even Rate</span>
              </div>
              <div className="text-2xl font-bold">
                {calculations.breakEvenRate.toFixed(4)}
              </div>
              <div className="text-white/60 text-sm mt-1">
                {baseCurrency}/{quoteCurrency}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="instruments" className="flex items-center gap-2 py-3">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Instruments</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">P&L Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Methodology</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--ocean)]" />
                  FX Hedge Configuration
                </CardTitle>
                <CardDescription>Configure your foreign exchange hedging strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Currency Pair Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Currency Pair</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground mb-1 block">Base Currency</Label>
                      <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 20).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.code} - {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mt-5 shrink-0"
                      onClick={handleSwapCurrencies}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground mb-1 block">Quote Currency</Label>
                      <Select value={quoteCurrency} onValueChange={setQuoteCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 20).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.code} - {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Rate Inputs */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spotRate">Current Spot Rate</Label>
                    <div className="relative mt-1.5">
                      <span className="absolute left-3 top-3 text-muted-foreground text-sm">
                        {baseCurrency}/{quoteCurrency}
                      </span>
                      <Input
                        id="spotRate"
                        type="number"
                        step="0.0001"
                        value={spotRate}
                        onChange={(e) => setSpotRate(e.target.value)}
                        className="pl-16"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="forwardRate">Forward Rate (Optional)</Label>
                    <Input
                      id="forwardRate"
                      type="number"
                      step="0.0001"
                      value={forwardRateInput}
                      onChange={(e) => setForwardRateInput(e.target.value)}
                      placeholder={`Calculated: ${calculations.forwardRate.toFixed(4)}`}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hedgeAmount">Hedge Amount ({baseCurrency})</Label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="hedgeAmount"
                      type="number"
                      value={hedgeAmount}
                      onChange={(e) => setHedgeAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                {/* Hedge Instrument Selection */}
                <div>
                  <Label className="text-base font-medium">Hedge Instrument</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    {(Object.keys(HEDGE_INSTRUMENTS) as HedgeInstrument[]).map((key) => {
                      const inst = HEDGE_INSTRUMENTS[key];
                      return (
                        <Button
                          key={key}
                          variant={hedgeInstrument === key ? "default" : "outline"}
                          className={`h-auto py-3 px-3 flex flex-col items-start gap-1 ${
                            hedgeInstrument === key ? "bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white" : ""
                          }`}
                          onClick={() => setHedgeInstrument(key)}
                        >
                          <span className="font-medium text-xs">{inst.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Instrument-specific options */}
                {(hedgeInstrument === "call_option" || hedgeInstrument === "put_option") && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label htmlFor="strikeRate">Strike Rate (Optional)</Label>
                      <Input
                        id="strikeRate"
                        type="number"
                        step="0.0001"
                        value={strikeRate}
                        onChange={(e) => setStrikeRate(e.target.value)}
                        placeholder={`Default: Spot (${spotRate})`}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Implied Volatility: {volatility}%</Label>
                      <Slider
                        value={[volatility]}
                        onValueChange={(v) => setVolatility(v[0])}
                        min={5}
                        max={30}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                <Separator />

                {/* Hedge Parameters */}
                <div className="space-y-4">
                  <div>
                    <Label>Hedge Period: {hedgePeriod} months</Label>
                    <Slider
                      value={[hedgePeriod]}
                      onValueChange={(v) => setHedgePeriod(v[0])}
                      min={1}
                      max={12}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Percentage Covered: {hedgePercentage}%</Label>
                    <Slider
                      value={[hedgePercentage]}
                      onValueChange={(v) => setHedgePercentage(v[0])}
                      min={10}
                      max={100}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Calculator
                </Button>
              </CardContent>
            </Card>

            {/* Results Card */}
            <div className="space-y-6">
              <Card className="border-[#0F4C81]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[#0F4C81]" />
                    Hedge Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Forward Rate */}
                    <div className="p-4 bg-[#0F4C81]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Forward Rate</p>
                      <p className="text-2xl font-bold text-[#0F4C81]">
                        {calculations.forwardRate.toFixed(4)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculations.forwardPoints > 0 ? "+" : ""}
                        {calculations.forwardPoints.toFixed(1)} pips
                      </p>
                    </div>

                    {/* Hedge Cost */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Hedge Cost</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(calculations.hedgeCost, baseCurrency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculations.hedgeCostPercent.toFixed(2)}% of notional
                      </p>
                    </div>

                    {/* Break-Even Rate */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Break-Even Rate</p>
                      <p className="text-2xl font-bold">
                        {calculations.breakEvenRate.toFixed(4)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Rate to recover hedge cost
                      </p>
                    </div>

                    {/* Exposure Covered */}
                    <div className="p-4 bg-[#2E8B57]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Exposure Covered</p>
                      <p className="text-2xl font-bold text-[#2E8B57]">
                        {formatCurrency(calculations.exposureCovered, baseCurrency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {hedgePercentage}% of total
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Hedge Effectiveness Meter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Hedge Effectiveness</Label>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2E8B57] transition-all duration-500"
                        style={{ width: `${hedgePercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Protected: {hedgePercentage}%</span>
                      <span>Unprotected: {100 - hedgePercentage}%</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Effective Rate */}
                  <div className="p-4 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Effective Exchange Rate</p>
                        <p className="text-3xl font-bold text-[#0F4C81]">
                          {calculations.effectiveRate.toFixed(4)}
                        </p>
                      </div>
                      <Target className="h-10 w-10 text-[#2E8B57] opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      The rate you&apos;ll achieve after hedging costs
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Instrument Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{HEDGE_INSTRUMENTS[hedgeInstrument].name}</CardTitle>
                  <CardDescription>{HEDGE_INSTRUMENTS[hedgeInstrument].description.slice(0, 100)}...</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{HEDGE_INSTRUMENTS[hedgeInstrument].premiumType}</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Hedge Instruments */}
        <TabsContent value="instruments" className="space-y-6 mt-6">
          {/* Instrument Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#0F4C81]" />
                Hedge Instrument Comparison
              </CardTitle>
              <CardDescription>Compare different hedging strategies and their characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Instrument</th>
                      <th className="text-left p-4 font-semibold">Cost Type</th>
                      <th className="text-left p-4 font-semibold">Typical Cost</th>
                      <th className="text-left p-4 font-semibold">Risk Level</th>
                      <th className="text-left p-4 font-semibold">Flexibility</th>
                      <th className="text-left p-4 font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {instrumentComparisonData.map((row) => (
                      <tr
                        key={row.key}
                        className={`border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                          hedgeInstrument === row.key ? "bg-[#0F4C81]/5" : ""
                        }`}
                        onClick={() => setHedgeInstrument(row.key as HedgeInstrument)}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {hedgeInstrument === row.key && (
                              <CheckCircle2 className="h-4 w-4 text-[#0F4C81]" />
                            )}
                            <span className="font-medium">{row.instrument}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="text-xs">{row.costType}</Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">{row.typicalCost}</td>
                        <td className="p-4">
                          <Badge className={`
                            ${row.riskLevel === 'Very Low' ? 'bg-[#2E8B57] text-white' : ''}
                            ${row.riskLevel === 'Low' ? 'bg-[#2E8B57]/80 text-white' : ''}
                            ${row.riskLevel === 'Medium' ? 'bg-[#F59E0B] text-white' : ''}
                            ${row.riskLevel === 'High' ? 'bg-[#EF4444] text-white' : ''}
                          `}>
                            {row.riskLevel}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {row.flexibility === 'Very High' && <><div className="w-2 h-2 rounded-full bg-[#2E8B57]" /><div className="w-2 h-2 rounded-full bg-[#2E8B57]" /><div className="w-2 h-2 rounded-full bg-[#2E8B57]" /><div className="w-2 h-2 rounded-full bg-[#2E8B57]" /></>}
                            {row.flexibility === 'High' && <><div className="w-2 h-2 rounded-full bg-[#2E8B57]" /><div className="w-2 h-2 rounded-full bg-[#2F4C81]" /><div className="w-2 h-2 rounded-full bg-[#0F4C81]" /><div className="w-2 h-2 rounded-full bg-muted" /></>}
                            {row.flexibility === 'Medium' && <><div className="w-2 h-2 rounded-full bg-[#F59E0B]" /><div className="w-2 h-2 rounded-full bg-[#F59E0B]" /><div className="w-2 h-2 rounded-full bg-muted" /><div className="w-2 h-2 rounded-full bg-muted" /></>}
                            {row.flexibility === 'Low' && <><div className="w-2 h-2 rounded-full bg-[#EF4444]" /><div className="w-2 h-2 rounded-full bg-muted" /><div className="w-2 h-2 rounded-full bg-muted" /><div className="w-2 h-2 rounded-full bg-muted" /></>}
                            {row.flexibility === 'Very Low' && <><div className="w-2 h-2 rounded-full bg-[#EF4444]" /><div className="w-2 h-2 rounded-full bg-muted" /><div className="w-2 h-2 rounded-full bg-muted" /><div className="w-2 h-2 rounded-full bg-muted" /></>}
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">{row.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Instrument Cards */}
          <div className="space-y-6">
            {Object.entries(HEDGE_INSTRUMENTS).map(([key, inst]) => (
              <Card key={key} className={`${hedgeInstrument === key ? 'border-[#0F4C81]/30 ring-2 ring-[#0F4C81]/10' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {inst.name}
                        {hedgeInstrument === key && (
                          <Badge className="bg-[#0F4C81] text-white text-xs">Selected</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">{inst.description}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHedgeInstrument(key as HedgeInstrument)}
                    >
                      Select
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pros */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-[#2E8B57]">
                        <CheckCircle2 className="h-4 w-4" />
                        Advantages
                      </h4>
                      <ul className="space-y-2">
                        {inst.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                            <span className="text-sm">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        Considerations
                      </h4>
                      <ul className="space-y-2">
                        {inst.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                            <span className="text-sm">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: P&L Scenarios */}
        <TabsContent value="scenarios" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* P&L Scenarios Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                  P&L Scenario Analysis
                </CardTitle>
                <CardDescription>Potential outcomes based on market movements ({volatility}% volatility)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          scenario: "Best Case",
                          pnl: calculations.scenarios.best.pnl,
                          rate: calculations.scenarios.best.rate.toFixed(4),
                          color: chartColors.logistics,
                        },
                        {
                          scenario: "Expected",
                          pnl: calculations.scenarios.expected.pnl,
                          rate: calculations.scenarios.expected.rate.toFixed(4),
                          color: chartColors.ocean,
                        },
                        {
                          scenario: "Worst Case",
                          pnl: calculations.scenarios.worst.pnl,
                          rate: calculations.scenarios.worst.rate.toFixed(4),
                          color: chartColors.danger,
                        },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, baseCurrency)} />
                      <YAxis dataKey="scenario" type="category" width={80} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "pnl" ? formatCurrency(value, baseCurrency) : value,
                          name === "pnl" ? "P&L" : "Rate",
                        ]}
                        labelFormatter={(label) => `Scenario: ${label}`}
                      />
                      <Bar dataKey="pnl" radius={[0, 4, 4, 0]}>
                        <Cell fill={chartColors.logistics} />
                        <Cell fill={chartColors.ocean} />
                        <Cell fill={chartColors.danger} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-[#2E8B57]/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Best Case</p>
                    <p className="font-bold text-[#2E8B57]">
                      {formatCurrency(calculations.scenarios.best.pnl, baseCurrency)}
                    </p>
                    <p className="text-xs text-muted-foreground">Rate: {calculations.scenarios.best.rate.toFixed(4)}</p>
                  </div>
                  <div className="p-3 bg-[#0F4C81]/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Expected</p>
                    <p className="font-bold text-[#0F4C81]">
                      {formatCurrency(calculations.scenarios.expected.pnl, baseCurrency)}
                    </p>
                    <p className="text-xs text-muted-foreground">Rate: {calculations.scenarios.expected.rate.toFixed(4)}</p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Worst Case</p>
                    <p className="font-bold text-destructive">
                      {formatCurrency(calculations.scenarios.worst.pnl, baseCurrency)}
                    </p>
                    <p className="text-xs text-muted-foreground">Rate: {calculations.scenarios.worst.rate.toFixed(4)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[#0F4C81]" />
                  Hedge Cost Breakdown
                </CardTitle>
                <CardDescription>Hedge cost components and protection value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, baseCurrency)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-4">
                  {costBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.value, baseCurrency)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forward vs Spot Rate Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[#0F4C81]" />
                Forward Rate vs Spot Rate Over Time
              </CardTitle>
              <CardDescription>Projected rate movements during hedge period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculations.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tickFormatter={(v) => `M${v}`} />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "spotRate" || name === "forwardRate" ? value.toFixed(4) : formatCurrency(value, baseCurrency),
                        name === "spotRate" ? "Spot Rate" : name === "forwardRate" ? "Forward Rate" : "Cumulative Cost",
                      ]}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="spotRate"
                      stroke={chartColors.ocean}
                      fill={chartColors.area}
                      name="Spot Rate"
                    />
                    <Line
                      type="monotone"
                      dataKey="forwardRate"
                      stroke={chartColors.logistics}
                      strokeWidth={2}
                      dot={false}
                      name="Forward Rate"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Current Spot</p>
                  <p className="font-bold">{parseFloat(spotRate || "0").toFixed(4)}</p>
                </div>
                <div className="p-3 bg-[#0F4C81]/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Forward Rate</p>
                  <p className="font-bold text-[#0F4C81]">{calculations.forwardRate.toFixed(4)}</p>
                </div>
                <div className="p-3 bg-[#2E8B57]/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Rate Differential</p>
                  <p className="font-bold text-[#2E8B57]">
                    {((calculations.forwardRate / parseFloat(spotRate || "1") - 1) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#0F4C81]" />
                Risk Assessment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[#2E8B57]/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                    <p className="text-sm font-medium">Upside Potential</p>
                  </div>
                  <p className="text-xl font-bold text-[#2E8B57]">
                    {formatCurrency(calculations.potentialGain, baseCurrency)}
                  </p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <p className="text-sm font-medium">Downside Risk</p>
                  </div>
                  <p className="text-xl font-bold text-destructive">
                    {formatCurrency(calculations.potentialLoss, baseCurrency)}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Cost as % of Notional</p>
                  </div>
                  <p className="text-xl font-bold">
                    {calculations.hedgeCostPercent.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 bg-[#0F4C81]/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-[#0F4C81]" />
                    <p className="text-sm font-medium">Protection Level</p>
                  </div>
                  <p className="text-xl font-bold text-[#0F4C81]">
                    {hedgePercentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Methodology */}
        <TabsContent value="methodology" className="space-y-6 mt-6">
          {/* What is FX Hedging */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#0F4C81]" />
                What is FX Hedging?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                <strong>Foreign Exchange (FX) hedging</strong> is a critical risk management strategy employed by businesses engaged in international trade to protect against adverse currency movements. In today&apos;s globalized economy, companies that operate across borders face significant exposure to currency fluctuations that can dramatically impact profit margins, cash flow predictability, and overall financial performance.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                When a company enters into a transaction denominated in a foreign currency, it assumes currency risk from the moment the transaction is agreed upon until payment is received or made. During this period, exchange rates can move significantly, potentially turning a profitable transaction into a loss. For example, an exporter who agrees to receive payment in euros three months from now faces the risk that the euro could depreciate against their home currency, reducing the actual value received.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                FX hedging instruments such as forward contracts, options, and swaps allow businesses to lock in exchange rates for future transactions, transforming uncertain future cash flows into predictable amounts. This certainty enables better financial planning, more accurate pricing decisions, and protection of profit margins. However, hedging is not about speculating on currency movements or maximizing gains—it&apos;s about managing risk and ensuring business stability.
              </p>
              <div className="bg-[#0F4C81]/10 p-4 rounded-lg mt-6">
                <p className="font-medium text-[#0F4C81]">Key Principle</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Effective hedging doesn&apos;t eliminate all risk—it transforms currency price risk into known costs that can be budgeted and managed. The goal is to convert uncertain future exchange rates into predictable expenses, allowing businesses to focus on their core operations rather than speculating on currency markets.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Types of Hedge Instruments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#2E8B57]" />
                Types of Hedge Instruments
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The foreign exchange market offers several instruments for hedging currency risk, each with distinct characteristics, costs, and applications. Understanding these instruments is essential for developing an effective hedging strategy that aligns with your company&apos;s risk tolerance, cash flow patterns, and financial objectives.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-[#0F4C81] mb-2">Forward Contracts</h4>
                  <p className="text-sm text-muted-foreground">
                    The most common hedging instrument, forward contracts are binding agreements to exchange currencies at a predetermined rate on a future date. They&apos;re ideal for known exposures with fixed amounts and dates. Cost is embedded in forward points, with no upfront premium required.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-[#0F4C81] mb-2">Currency Options</h4>
                  <p className="text-sm text-muted-foreground">
                    Options provide the right but not obligation to exchange at a specified rate. Call options protect against rising rates; put options protect against falling rates. They offer flexibility and upside potential but require upfront premium payment, typically 1-5% of notional.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-[#0F4C81] mb-2">FX Swaps</h4>
                  <p className="text-sm text-muted-foreground">
                    Combining a spot transaction with a simultaneous forward in the opposite direction, FX swaps are useful for rolling hedges, managing timing mismatches, or creating synthetic foreign currency loans. Common in trade finance with lower transaction costs.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-[#0F4C81] mb-2">Natural Hedges</h4>
                  <p className="text-sm text-muted-foreground">
                    Operational strategies that match currency inflows with outflows without financial instruments. Examples include sourcing in the same currency as sales or locating production in major markets. Zero cost but requires operational restructuring and may not cover all exposure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forward Rate Calculation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#0F4C81]" />
                Forward Rate Calculation: Interest Rate Parity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Forward exchange rates are determined by the principle of Interest Rate Parity (IRP), a fundamental concept in international finance that ensures no arbitrage opportunities exist between spot and forward markets. The theory states that the forward rate should reflect the interest rate differential between two currencies, adjusted for the time to maturity.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/50 rounded-lg p-5 font-mono text-sm space-y-3">
                  <div className="text-lg font-bold text-[#0F4C81]">Interest Rate Parity Formula</div>
                  <div className="pt-3 border-t border-border text-lg">
                    F = S × <span className="text-[#2E8B57]">(1 + r<sub>quote</sub> × T)</span> / <span className="text-[#0F4C81]">(1 + r<sub>base</sub> × T)</span>
                  </div>
                  <div className="pt-3 border-t border-border text-xs space-y-1.5">
                    <div><strong>F</strong> = Forward Rate</div>
                    <div><strong>S</strong> = Spot Rate ({parseFloat(spotRate || "1").toFixed(4)})</div>
                    <div><strong>r<sub>{baseCurrency}</sub></strong> = {INTEREST_RATES[baseCurrency] ?? 5.0}% (base currency rate)</div>
                    <div><strong>r<sub>{quoteCurrency}</sub></strong> = {INTEREST_RATES[quoteCurrency] ?? 5.0}% (quote currency rate)</div>
                    <div><strong>T</strong> = {hedgePeriod}/12 = {(hedgePeriod / 12).toFixed(2)} years</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#0F4C81]/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Calculated Forward Rate</p>
                    <p className="text-2xl font-bold text-[#0F4C81]">
                      {calculations.forwardRate.toFixed(4)}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Forward Points (in pips)</p>
                    <p className="text-xl font-bold">
                      {calculations.forwardPoints > 0 ? "+" : ""}
                      {calculations.forwardPoints.toFixed(1)} pips
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {baseCurrency} trading at {calculations.forwardPoints > 0 ? "premium" : "discount"} to {quoteCurrency}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#2E8B57]/10 rounded-lg">
                <h4 className="font-semibold text-[#2E8B57] mb-2">Understanding the Relationship</h4>
                <p className="text-sm text-muted-foreground">
                  When a currency has higher interest rates, it trades at a forward discount (the forward rate is lower than spot). Conversely, currencies with lower interest rates trade at a forward premium. This relationship exists because investors must be compensated for the opportunity cost of holding lower-yielding currencies. The forward market effectively equalizes returns across currencies when considering both interest income and exchange rate changes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* When to Hedge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#F59E0B]" />
                When to Hedge: Strategic Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Determining the optimal timing and extent of hedging requires careful consideration of multiple factors. There is no one-size-fits-all approach—the right strategy depends on your company&apos;s specific circumstances, risk tolerance, and market outlook. Below are key considerations for developing a hedging strategy.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#2E8B57]/10 rounded-lg">
                  <h4 className="font-semibold text-[#2E8B57] mb-2">When to Hedge</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      Known future receivables or payables with fixed dates
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      Thin profit margins vulnerable to FX movements
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      Debt covenants requiring predictable cash flows
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      High currency volatility periods
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      Long-term contracts with significant amounts
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-[#F59E0B]/10 rounded-lg">
                  <h4 className="font-semibold text-[#F59E0B] mb-2">Considerations Before Hedging</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#F59E0B] mt-0.5 shrink-0" />
                      Assess the cost vs. potential impact of unhedged exposure
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#F59E0B] mt-0.5 shrink-0" />
                      Evaluate certainty of future cash flows
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#F59E0B] mt-0.5 shrink-0" />
                      Consider accounting implications (hedge accounting)
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#F59E0B] mt-0.5 shrink-0" />
                      Review existing natural hedges
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#F59E0B] mt-0.5 shrink-0" />
                      Align with risk management policy
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-3">Recommended Layering Strategy</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Many companies use a layered hedging approach to balance cost and flexibility:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-[#0F4C81]">12 months out: 50%</Badge>
                  <Badge className="bg-[#0F4C81]/80">9 months out: 60%</Badge>
                  <Badge className="bg-[#0F4C81]/60">6 months out: 75%</Badge>
                  <Badge className="bg-[#2E8B57]">3 months out: 100%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hedging Costs and Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#0F4C81]" />
                Hedging Costs and Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Understanding the full cost-benefit equation of hedging is essential for making informed decisions. The costs of hedging extend beyond the direct financial outlay to include opportunity costs, operational complexity, and accounting considerations. Similarly, benefits include not just risk reduction but also improved business planning and stakeholder confidence.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#EF4444] flex items-center gap-2">
                    <TrendingDown className="h-5 w-5" />
                    Costs of Hedging
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <p className="font-medium text-sm">Direct Costs</p>
                      <p className="text-xs text-muted-foreground">Option premiums (1-5%), forward points, bid-offer spreads</p>
                    </div>
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <p className="font-medium text-sm">Opportunity Cost</p>
                      <p className="text-xs text-muted-foreground">Foregone gains if market moves favorably</p>
                    </div>
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <p className="font-medium text-sm">Operational Costs</p>
                      <p className="text-xs text-muted-foreground">Systems, personnel, documentation, reporting</p>
                    </div>
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <p className="font-medium text-sm">Counterparty Risk</p>
                      <p className="text-xs text-muted-foreground">Risk of hedge provider default</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-[#2E8B57] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Benefits of Hedging
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#2E8B57]/5 rounded-lg">
                      <p className="font-medium text-sm">Cash Flow Certainty</p>
                      <p className="text-xs text-muted-foreground">Predictable future cash flows for planning</p>
                    </div>
                    <div className="p-3 bg-[#2E8B57]/5 rounded-lg">
                      <p className="font-medium text-sm">Margin Protection</p>
                      <p className="text-xs text-muted-foreground">Shield profit margins from FX volatility</p>
                    </div>
                    <div className="p-3 bg-[#2E8B57]/5 rounded-lg">
                      <p className="font-medium text-sm">Competitive Pricing</p>
                      <p className="text-xs text-muted-foreground">Confidence to price internationally</p>
                    </div>
                    <div className="p-3 bg-[#2E8B57]/5 rounded-lg">
                      <p className="font-medium text-sm">Reduced Earnings Volatility</p>
                      <p className="text-xs text-muted-foreground">Smoother financial results for investors</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#0F4C81]/10 rounded-lg">
                <h4 className="font-semibold text-[#0F4C81] mb-2">Industry Perspective</h4>
                <p className="text-sm text-muted-foreground">
                  According to the 2023 AFP Risk Survey, 72% of companies with significant international exposure use FX hedging. The most common approach is a combination of forwards for known exposures (85%) and options for uncertain cash flows (35%). Companies that hedge report 40% lower earnings volatility from currency movements compared to non-hedgers.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about FX hedging strategies and implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
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
                <BookOpen className="h-5 w-5 text-[#2E8B57]" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:border-[#0F4C81]/30 transition-colors">
                  <FileText className="h-8 w-8 text-[#0F4C81] mb-3" />
                  <h4 className="font-medium mb-1">Hedge Accounting Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    Understanding IFRS 9 and ASC 815 requirements for hedge accounting designation and effectiveness testing.
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:border-[#2E8B57]/30 transition-colors">
                  <Globe className="h-8 w-8 text-[#2E8B57] mb-3" />
                  <h4 className="font-medium mb-1">Currency Risk Assessment</h4>
                  <p className="text-sm text-muted-foreground">
                    Framework for identifying, measuring, and prioritizing currency exposures in your business.
                  </p>
                </div>
                <div className="p-4 border rounded-lg hover:border-[#F59E0B]/30 transition-colors">
                  <AlertCircle className="h-8 w-8 text-[#F59E0B] mb-3" />
                  <h4 className="font-medium mb-1">Hedging Policy Template</h4>
                  <p className="text-sm text-muted-foreground">
                    Sample treasury policy document for establishing FX hedging guidelines and governance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
