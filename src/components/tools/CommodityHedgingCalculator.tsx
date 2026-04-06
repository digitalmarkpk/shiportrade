"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
  Droplets,
  Coins,
  Wheat,
  Coffee,
  LineChart,
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

// Commodity types
type CommodityCategory = "oil" | "metals" | "agricultural" | "soft";
type HedgeInstrument = "futures" | "options" | "swaps";

// Commodity configuration
interface CommodityConfig {
  name: string;
  unit: string;
  category: CommodityCategory;
  icon: React.ReactNode;
  basePrice: number;
  volatility: number; // Annual volatility %
  storageCost: number; // Annual storage cost %
  convenienceYield: number; // Convenience yield %
}

const COMMODITIES: Record<string, CommodityConfig> = {
  // Oil
  brent: {
    name: "Brent Crude Oil",
    unit: "BBL",
    category: "oil",
    icon: <Droplets className="h-4 w-4" />,
    basePrice: 82.50,
    volatility: 28,
    storageCost: 4.5,
    convenienceYield: 2.0,
  },
  wti: {
    name: "WTI Crude Oil",
    unit: "BBL",
    category: "oil",
    icon: <Droplets className="h-4 w-4" />,
    basePrice: 78.50,
    volatility: 30,
    storageCost: 4.0,
    convenienceYield: 1.8,
  },
  // Metals
  gold: {
    name: "Gold",
    unit: "TROY OZ",
    category: "metals",
    icon: <Coins className="h-4 w-4" />,
    basePrice: 2025.00,
    volatility: 15,
    storageCost: 0.5,
    convenienceYield: 0,
  },
  silver: {
    name: "Silver",
    unit: "TROY OZ",
    category: "metals",
    icon: <Coins className="h-4 w-4" />,
    basePrice: 23.50,
    volatility: 25,
    storageCost: 0.8,
    convenienceYield: 0,
  },
  copper: {
    name: "Copper",
    unit: "LB",
    category: "metals",
    icon: <Coins className="h-4 w-4" />,
    basePrice: 3.85,
    volatility: 22,
    storageCost: 1.2,
    convenienceYield: 0.5,
  },
  aluminum: {
    name: "Aluminum",
    unit: "MT",
    category: "metals",
    icon: <Coins className="h-4 w-4" />,
    basePrice: 2350.00,
    volatility: 18,
    storageCost: 1.5,
    convenienceYield: 0.3,
  },
  // Agricultural
  corn: {
    name: "Corn",
    unit: "BUSHEL",
    category: "agricultural",
    icon: <Wheat className="h-4 w-4" />,
    basePrice: 4.75,
    volatility: 24,
    storageCost: 3.0,
    convenienceYield: 1.5,
  },
  wheat: {
    name: "Wheat",
    unit: "BUSHEL",
    category: "agricultural",
    icon: <Wheat className="h-4 w-4" />,
    basePrice: 6.25,
    volatility: 28,
    storageCost: 3.5,
    convenienceYield: 1.2,
  },
  soybeans: {
    name: "Soybeans",
    unit: "BUSHEL",
    category: "agricultural",
    icon: <Wheat className="h-4 w-4" />,
    basePrice: 12.50,
    volatility: 22,
    storageCost: 2.8,
    convenienceYield: 1.0,
  },
  rice: {
    name: "Rice",
    unit: "CWT",
    category: "agricultural",
    icon: <Wheat className="h-4 w-4" />,
    basePrice: 17.25,
    volatility: 20,
    storageCost: 4.0,
    convenienceYield: 1.8,
  },
  // Soft Commodities
  coffee: {
    name: "Coffee",
    unit: "LB",
    category: "soft",
    icon: <Coffee className="h-4 w-4" />,
    basePrice: 1.85,
    volatility: 35,
    storageCost: 2.5,
    convenienceYield: 0.8,
  },
  sugar: {
    name: "Sugar",
    unit: "LB",
    category: "soft",
    icon: <Coffee className="h-4 w-4" />,
    basePrice: 0.25,
    volatility: 26,
    storageCost: 3.2,
    convenienceYield: 0.5,
  },
  cocoa: {
    name: "Cocoa",
    unit: "MT",
    category: "soft",
    icon: <Coffee className="h-4 w-4" />,
    basePrice: 4500.00,
    volatility: 32,
    storageCost: 2.0,
    convenienceYield: 0.6,
  },
  cotton: {
    name: "Cotton",
    unit: "LB",
    category: "soft",
    icon: <Coffee className="h-4 w-4" />,
    basePrice: 0.85,
    volatility: 22,
    storageCost: 2.0,
    convenienceYield: 0.4,
  },
};

// Hedge instrument configurations
const HEDGE_INSTRUMENTS: Record<HedgeInstrument, {
  name: string;
  description: string;
  premiumType: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}> = {
  futures: {
    name: "Futures Contract",
    description: "Standardized contract to buy/sell commodity at predetermined price on future date",
    premiumType: "Margin deposit (typically 5-15%)",
    pros: ["High liquidity", "Transparent pricing", "Low transaction costs", "Easy to offset"],
    cons: ["Margin calls possible", "Mark-to-market daily", "Fixed contract sizes", "Basis risk"],
    bestFor: "Price certainty for known production/consumption",
  },
  options: {
    name: "Commodity Options",
    description: "Right but not obligation to buy (call) or sell (put) at strike price",
    premiumType: "Premium paid upfront",
    pros: ["Downside protection", "Upside potential", "No margin calls", "Flexible strategies"],
    cons: ["Premium cost", "Time decay", "Liquidity varies", "Complex pricing"],
    bestFor: "Protection with ability to benefit from favorable moves",
  },
  swaps: {
    name: "Commodity Swap",
    description: "OTC agreement to exchange floating price for fixed price",
    premiumType: "No upfront cost (credit line required)",
    pros: ["Customizable terms", "No daily settlement", "Exact match exposure", "No basis risk"],
    cons: ["Counterparty risk", "Less liquid", "Higher minimums", "Documentation required"],
    bestFor: "Long-term hedging with customized exposure",
  },
};

// Risk-free rates by currency (annual %)
const RISK_FREE_RATES: Record<string, number> = {
  USD: 5.25,
  EUR: 4.0,
  GBP: 5.0,
  JPY: 0.1,
  CNY: 3.45,
};

// Calculation interfaces
interface HedgeCalculation {
  forwardPrice: number;
  basis: number;
  hedgeCost: number;
  hedgeCostPercent: number;
  breakEvenPrice: number;
  effectivePrice: number;
  exposureCovered: number;
  premium: number;
  scenarios: {
    best: { price: number; pnl: number; description: string };
    expected: { price: number; pnl: number; description: string };
    worst: { price: number; pnl: number; description: string };
  };
  pricePath: Array<{
    month: number;
    spotPrice: number;
    forwardPrice: number;
    upperBound: number;
    lowerBound: number;
  }>;
  hedgeEffectiveness: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

// Calculate forward price using cost-of-carry model
function calculateForwardPrice(
  spotPrice: number,
  riskFreeRate: number,
  storageCost: number,
  convenienceYield: number,
  periodMonths: number
): { forwardPrice: number; basis: number } {
  const T = periodMonths / 12; // Time in years
  // Forward price formula: F = S * e^((r + u - y) * T)
  // where r = risk-free rate, u = storage cost, y = convenience yield
  const carryCost = (riskFreeRate + storageCost - convenienceYield) / 100;
  const forwardPrice = spotPrice * Math.exp(carryCost * T);
  const basis = forwardPrice - spotPrice;

  return { forwardPrice, basis };
}

// Normal CDF for option pricing
function normalCDF(x: number): number {
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
}

// Calculate option premium using Black-76 model (for commodity futures options)
function calculateOptionPremium(
  futuresPrice: number,
  strikePrice: number,
  timeToExpiry: number, // in years
  volatility: number, // annual volatility as decimal
  riskFreeRate: number,
  isCall: boolean
): { premium: number; delta: number; gamma: number; theta: number; vega: number } {
  const T = timeToExpiry;
  const sigma = volatility;
  
  if (T <= 0 || sigma <= 0) {
    return { premium: 0, delta: 0, gamma: 0, theta: 0, vega: 0 };
  }

  const d1 = (Math.log(futuresPrice / strikePrice) + 0.5 * sigma * sigma * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const N = normalCDF;
  const Nprime = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

  // Black-76 model
  const callPrice = Math.exp(-riskFreeRate * T) * (futuresPrice * N(d1) - strikePrice * N(d2));
  const putPrice = Math.exp(-riskFreeRate * T) * (strikePrice * N(-d2) - futuresPrice * N(-d1));

  const premium = isCall ? callPrice : putPrice;

  // Greeks
  const delta = isCall ? Math.exp(-riskFreeRate * T) * N(d1) : -Math.exp(-riskFreeRate * T) * N(-d1);
  const gamma = Math.exp(-riskFreeRate * T) * Nprime(d1) / (futuresPrice * sigma * Math.sqrt(T));
  const vega = futuresPrice * Math.exp(-riskFreeRate * T) * Nprime(d1) * Math.sqrt(T);
  
  // Theta (per day)
  const thetaPart1 = -futuresPrice * Math.exp(-riskFreeRate * T) * Nprime(d1) * sigma / (2 * Math.sqrt(T));
  const thetaPart2 = riskFreeRate * premium;
  const theta = (thetaPart1 + thetaPart2) / 365;

  return { premium, delta, gamma, theta, vega };
}

// Generate price path with confidence intervals
function generatePricePath(
  spotPrice: number,
  forwardPrice: number,
  volatility: number,
  periodMonths: number
): Array<{ month: number; spotPrice: number; forwardPrice: number; upperBound: number; lowerBound: number }> {
  const path = [];
  const monthlyVol = volatility / 100 / Math.sqrt(12);

  for (let i = 0; i <= periodMonths; i++) {
    const T = i / 12;
    const timeDecay = i / periodMonths;
    const expectedSpot = spotPrice + (forwardPrice - spotPrice) * timeDecay;
    
    // 95% confidence interval (±1.96 standard deviations)
    const stdDev = expectedSpot * monthlyVol * Math.sqrt(i);
    
    path.push({
      month: i,
      spotPrice: expectedSpot,
      forwardPrice: forwardPrice,
      upperBound: expectedSpot + 1.96 * stdDev,
      lowerBound: Math.max(0, expectedSpot - 1.96 * stdDev),
    });
  }

  return path;
}

export function CommodityHedgingCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input state
  const [commodity, setCommodity] = useState("brent");
  const [spotPrice, setSpotPrice] = useState<string>("");
  const [hedgeAmount, setHedgeAmount] = useState<string>("10000");
  const [hedgePeriod, setHedgePeriod] = useState<number>(3);
  const [hedgeInstrument, setHedgeInstrument] = useState<HedgeInstrument>("futures");
  const [hedgePercentage, setHedgePercentage] = useState<number>(80);
  const [currency, setCurrency] = useState("USD");
  const [isCall, setIsCall] = useState(true);
  const [strikePrice, setStrikePrice] = useState<string>("");
  const [customVolatility, setCustomVolatility] = useState<string>("");

  // Get commodity config
  const commodityConfig = COMMODITIES[commodity];

  // Update spot price when commodity changes
  const handleCommodityChange = useCallback((newCommodity: string) => {
    setCommodity(newCommodity);
    setSpotPrice(COMMODITIES[newCommodity].basePrice.toString());
    setCustomVolatility("");
    setStrikePrice("");
  }, []);

  // Initialize spot price when commodity changes
  useEffect(() => {
    setSpotPrice(commodityConfig.basePrice.toString());
  }, [commodityConfig]);

  // Calculations
  const calculations = useMemo<HedgeCalculation>(() => {
    const spot = parseFloat(spotPrice) || commodityConfig.basePrice;
    const amount = parseFloat(hedgeAmount) || 0;
    const strike = strikePrice ? parseFloat(strikePrice) : spot;
    const vol = customVolatility ? parseFloat(customVolatility) : commodityConfig.volatility;
    const riskFreeRate = RISK_FREE_RATES[currency] || 5.25;

    // Calculate forward price
    const { forwardPrice, basis } = calculateForwardPrice(
      spot,
      riskFreeRate,
      commodityConfig.storageCost,
      commodityConfig.convenienceYield,
      hedgePeriod
    );

    // Hedge cost and premium based on instrument
    let hedgeCost = 0;
    let hedgeCostPercent = 0;
    let premium = 0;
    let delta = 0;
    let gamma = 0;
    let theta = 0;
    let vega = 0;

    if (hedgeInstrument === "options") {
      const T = hedgePeriod / 12;
      const optionResult = calculateOptionPremium(
        forwardPrice,
        strike,
        T,
        vol / 100,
        riskFreeRate / 100,
        isCall
      );
      premium = optionResult.premium;
      delta = optionResult.delta;
      gamma = optionResult.gamma;
      theta = optionResult.theta;
      vega = optionResult.vega;
      hedgeCost = premium * amount;
      hedgeCostPercent = (premium / spot) * 100;
    } else if (hedgeInstrument === "swaps") {
      // Swap cost is the basis difference (essentially the carry cost)
      hedgeCost = Math.abs(basis) * amount;
      hedgeCostPercent = Math.abs(basis / spot) * 100;
    } else {
      // Futures - opportunity cost/implicit cost
      hedgeCost = Math.abs(basis) * amount * 0.5; // Simplified estimate
      hedgeCostPercent = Math.abs(basis / spot) * 100 * 0.5;
    }

    // Exposure covered
    const exposureCovered = (amount * hedgePercentage) / 100;

    // Break-even price
    const breakEvenPrice = hedgeInstrument === "options"
      ? (isCall ? strike + premium : strike - premium)
      : forwardPrice;

    // Effective price after hedging
    const effectivePrice = hedgeInstrument === "options" ? strike : forwardPrice;

    // Generate price path
    const pricePath = generatePricePath(spot, forwardPrice, vol, hedgePeriod);

    // Calculate scenarios
    const volatilityAdjustment = vol / 100 * Math.sqrt(hedgePeriod / 12);
    const bestPrice = spot * (1 + volatilityAdjustment);
    const worstPrice = spot * (1 - volatilityAdjustment);
    const expectedPrice = spot;

    let bestPn = 0;
    let expectedPn = 0;
    let worstPn = 0;

    if (hedgeInstrument === "futures") {
      // Futures lock in the forward price
      bestPn = (bestPrice - forwardPrice) * exposureCovered;
      expectedPn = (expectedPrice - forwardPrice) * exposureCovered;
      worstPn = (worstPrice - forwardPrice) * exposureCovered;
    } else if (hedgeInstrument === "options") {
      if (isCall) {
        // Call option: right to buy at strike
        bestPn = Math.max(0, bestPrice - strike) * exposureCovered - hedgeCost;
        expectedPn = -hedgeCost; // Option expires worthless at spot
        worstPn = -hedgeCost;
      } else {
        // Put option: right to sell at strike
        bestPn = -hedgeCost;
        expectedPn = -hedgeCost;
        worstPn = Math.max(0, strike - worstPrice) * exposureCovered - hedgeCost;
      }
    } else {
      // Swaps: receive fixed, pay floating
      bestPn = (bestPrice - forwardPrice) * exposureCovered;
      expectedPn = 0;
      worstPn = (worstPrice - forwardPrice) * exposureCovered;
    }

    // Hedge effectiveness (ratio of variance reduction)
    const hedgeEffectiveness = hedgePercentage; // Simplified for demo

    return {
      forwardPrice,
      basis,
      hedgeCost,
      hedgeCostPercent,
      breakEvenPrice,
      effectivePrice,
      exposureCovered,
      premium,
      scenarios: {
        best: {
          price: bestPrice,
          pnl: bestPn,
          description: isCall ? "Strong price increase" : "Price stability",
        },
        expected: {
          price: expectedPrice,
          pnl: expectedPn,
          description: "Market remains stable",
        },
        worst: {
          price: worstPrice,
          pnl: worstPn,
          description: isCall ? "Price decline" : "Strong price decline",
        },
      },
      pricePath,
      hedgeEffectiveness,
      delta,
      gamma,
      theta,
      vega,
    };
  }, [
    spotPrice,
    hedgeAmount,
    hedgePeriod,
    hedgeInstrument,
    hedgePercentage,
    commodityConfig,
    currency,
    isCall,
    strikePrice,
    customVolatility,
  ]);

  // Cost breakdown for pie chart
  const costBreakdown = useMemo(() => {
    const data = [];

    if (hedgeInstrument === "options") {
      data.push({ name: "Option Premium", value: calculations.hedgeCost, color: "#0F4C81" });
      data.push({ name: "Time Decay Risk", value: calculations.theta * 30 * parseFloat(hedgeAmount), color: "#F59E0B" });
    } else if (hedgeInstrument === "swaps") {
      data.push({ name: "Basis Cost", value: Math.abs(calculations.basis) * parseFloat(hedgeAmount), color: "#0F4C81" });
      data.push({ name: "Counterparty Risk Buffer", value: calculations.hedgeCost * 0.1, color: "#F59E0B" });
    } else {
      data.push({ name: "Margin Requirement", value: parseFloat(hedgeAmount) * 0.1, color: "#0F4C81" });
      data.push({ name: "Basis Risk", value: Math.abs(calculations.basis) * parseFloat(hedgeAmount) * 0.5, color: "#2E8B57" });
    }

    if (calculations.scenarios.worst.pnl < 0) {
      data.push({ name: "Potential Loss Protection", value: Math.abs(calculations.scenarios.worst.pnl), color: "#EF4444" });
    }

    return data;
  }, [calculations, hedgeInstrument, hedgeAmount]);

  // P&L distribution data
  const pnlDistribution = useMemo(() => {
    const spot = parseFloat(spotPrice) || commodityConfig.basePrice;
    const vol = customVolatility ? parseFloat(customVolatility) : commodityConfig.volatility;
    const data = [];
    const steps = 20;
    const priceRange = spot * (vol / 100);

    for (let i = -steps; i <= steps; i++) {
      const price = spot + (priceRange * i / steps);
      let pnl = 0;

      if (hedgeInstrument === "futures") {
        pnl = (price - calculations.forwardPrice) * calculations.exposureCovered;
      } else if (hedgeInstrument === "options") {
        if (isCall) {
          pnl = Math.max(0, price - (strikePrice ? parseFloat(strikePrice) : spot)) * calculations.exposureCovered - calculations.hedgeCost;
        } else {
          pnl = Math.max(0, (strikePrice ? parseFloat(strikePrice) : spot) - price) * calculations.exposureCovered - calculations.hedgeCost;
        }
      } else {
        pnl = (price - calculations.forwardPrice) * calculations.exposureCovered;
      }

      // Normal distribution weight
      const probability = Math.exp(-0.5 * Math.pow(i / (steps * 0.4), 2));

      data.push({
        price,
        pnl,
        probability: probability * 100,
      });
    }

    return data;
  }, [spotPrice, commodityConfig, customVolatility, calculations, hedgeInstrument, isCall, strikePrice]);

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    area: "rgba(15, 76, 129, 0.2)",
    upperBound: "rgba(46, 139, 87, 0.3)",
    lowerBound: "rgba(239, 68, 68, 0.3)",
  };

  const handleReset = useCallback(() => {
    setSpotPrice(commodityConfig.basePrice.toString());
    setHedgeAmount("10000");
    setHedgePeriod(3);
    setHedgeInstrument("futures");
    setHedgePercentage(80);
    setCurrency("USD");
    setIsCall(true);
    setStrikePrice("");
    setCustomVolatility("");
  }, [commodityConfig]);

  // Get category icon
  const getCategoryIcon = (category: CommodityCategory) => {
    switch (category) {
      case "oil":
        return <Droplets className="h-4 w-4" />;
      case "metals":
        return <Coins className="h-4 w-4" />;
      case "agricultural":
        return <Wheat className="h-4 w-4" />;
      case "soft":
        return <Coffee className="h-4 w-4" />;
    }
  };

  // Format price with units
  const formatPrice = (price: number) => {
    return `${currency === "USD" ? "$" : ""}${price.toFixed(2)} ${commodityConfig.unit}`;
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="scenarios">P&L Scenarios</TabsTrigger>
          <TabsTrigger value="analysis">Price Analysis</TabsTrigger>
          <TabsTrigger value="instruments">Instruments</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--ocean)]" />
                  Commodity Hedge Configuration
                </CardTitle>
                <CardDescription>Configure your commodity hedging strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Commodity Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Commodity Type</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(["oil", "metals", "agricultural", "soft"] as CommodityCategory[]).map((cat) => (
                      <Button
                        key={cat}
                        variant={commodityConfig.category === cat ? "default" : "outline"}
                        className={`h-auto py-2 flex flex-col items-center gap-1 ${
                          commodityConfig.category === cat ? "gradient-ocean text-white" : ""
                        }`}
                        onClick={() => {
                          // Set first commodity of selected category
                          const firstCommodity = Object.entries(COMMODITIES).find(
                            ([_, config]) => config.category === cat
                          );
                          if (firstCommodity) handleCommodityChange(firstCommodity[0]);
                        }}
                      >
                        {getCategoryIcon(cat)}
                        <span className="text-xs capitalize">{cat}</span>
                      </Button>
                    ))}
                  </div>
                  <Select value={commodity} onValueChange={handleCommodityChange}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(COMMODITIES)
                        .filter(([_, config]) => config.category === commodityConfig.category)
                        .map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.name} ({config.unit})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Price Input */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="spotPrice">Current Market Price ({currency})</Label>
                    <div className="relative mt-1.5">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="spotPrice"
                        type="number"
                        step="0.01"
                        value={spotPrice}
                        onChange={(e) => setSpotPrice(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reference: {formatCurrency(commodityConfig.basePrice, currency)}/{commodityConfig.unit}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="currency">Settlement Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.slice(0, 10).map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="hedgeAmount">Hedge Amount ({commodityConfig.unit})</Label>
                  <Input
                    id="hedgeAmount"
                    type="number"
                    value={hedgeAmount}
                    onChange={(e) => setHedgeAmount(e.target.value)}
                    className="mt-1.5"
                  />
                </div>

                <Separator />

                {/* Hedge Instrument Selection */}
                <div>
                  <Label className="text-base font-medium">Hedge Instrument</Label>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {(Object.keys(HEDGE_INSTRUMENTS) as HedgeInstrument[]).map((key) => {
                      const inst = HEDGE_INSTRUMENTS[key];
                      return (
                        <Button
                          key={key}
                          variant={hedgeInstrument === key ? "default" : "outline"}
                          className={`h-auto py-3 px-3 flex flex-col items-start gap-1 ${
                            hedgeInstrument === key ? "gradient-ocean text-white" : ""
                          }`}
                          onClick={() => setHedgeInstrument(key)}
                        >
                          <span className="font-medium text-xs">{inst.name}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Options-specific settings */}
                {hedgeInstrument === "options" && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Option Type</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant={isCall ? "default" : "outline"} className={isCall ? "gradient-ocean text-white" : ""}>
                          Call
                        </Badge>
                        <Switch
                          checked={!isCall}
                          onCheckedChange={(checked) => setIsCall(!checked)}
                        />
                        <Badge variant={!isCall ? "default" : "outline"} className={!isCall ? "gradient-logistics text-white" : ""}>
                          Put
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="strikePrice">Strike Price (Optional)</Label>
                      <Input
                        id="strikePrice"
                        type="number"
                        step="0.01"
                        value={strikePrice}
                        onChange={(e) => setStrikePrice(e.target.value)}
                        placeholder={`Default: Spot (${spotPrice})`}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Volatility: {customVolatility || commodityConfig.volatility}%</Label>
                      <Slider
                        value={[parseFloat(customVolatility) || commodityConfig.volatility]}
                        onValueChange={(v) => setCustomVolatility(v[0].toString())}
                        min={5}
                        max={50}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Historical: {commodityConfig.volatility}%
                      </p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Hedge Parameters */}
                <div className="space-y-4">
                  <div>
                    <Label>Hedge Duration: {hedgePeriod} months</Label>
                    <Slider
                      value={[hedgePeriod]}
                      onValueChange={(v) => setHedgePeriod(v[0])}
                      min={1}
                      max={24}
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
                      step={5}
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
              <Card className="border-[var(--ocean)]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Hedge Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Forward Price */}
                    <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Forward Price</p>
                      <p className="text-2xl font-bold text-[var(--ocean)]">
                        {formatCurrency(calculations.forwardPrice, currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculations.basis > 0 ? "+" : ""}{formatCurrency(calculations.basis, currency)} basis
                      </p>
                    </div>

                    {/* Hedge Cost */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Hedge Cost</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(calculations.hedgeCost, currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {calculations.hedgeCostPercent.toFixed(2)}% of notional
                      </p>
                    </div>

                    {/* Break-Even Price */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Break-Even Price</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(calculations.breakEvenPrice, currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Price to recover hedge cost
                      </p>
                    </div>

                    {/* Exposure Covered */}
                    <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Exposure Covered</p>
                      <p className="text-2xl font-bold text-[var(--logistics)]">
                        {calculations.exposureCovered.toLocaleString()} {commodityConfig.unit}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {hedgePercentage}% of total
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Hedge Effectiveness Meter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Hedge Effectiveness Ratio</Label>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-logistics transition-all duration-500"
                        style={{ width: `${calculations.hedgeEffectiveness}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Protected: {hedgePercentage}%</span>
                      <span>Effectiveness: {calculations.hedgeEffectiveness.toFixed(0)}%</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Effective Price */}
                  <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Effective Hedge Price</p>
                        <p className="text-3xl font-bold text-[var(--ocean)]">
                          {formatCurrency(calculations.effectivePrice, currency)}
                        </p>
                      </div>
                      <Target className="h-10 w-10 text-[var(--logistics)] opacity-50" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      The price you&apos;ll achieve after hedging costs
                    </p>
                  </div>

                  {/* Options Greeks (if applicable) */}
                  {hedgeInstrument === "options" && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm font-medium mb-3">Option Greeks</p>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div>
                          <p className="text-muted-foreground">Delta</p>
                          <p className="font-bold">{calculations.delta.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Gamma</p>
                          <p className="font-bold">{calculations.gamma.toFixed(4)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Theta</p>
                          <p className="font-bold">{calculations.theta.toFixed(2)}/day</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Vega</p>
                          <p className="font-bold">{calculations.vega.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Instrument Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{HEDGE_INSTRUMENTS[hedgeInstrument].name}</CardTitle>
                  <CardDescription>{HEDGE_INSTRUMENTS[hedgeInstrument].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{HEDGE_INSTRUMENTS[hedgeInstrument].premiumType}</Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    <strong>Best for:</strong> {HEDGE_INSTRUMENTS[hedgeInstrument].bestFor}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* P&L Scenarios Chart */}
            <Card>
              <CardHeader>
                <CardTitle>P&L Scenario Analysis</CardTitle>
                <CardDescription>Potential outcomes based on market movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          scenario: "Best Case",
                          pnl: calculations.scenarios.best.pnl,
                          price: calculations.scenarios.best.price.toFixed(2),
                          color: chartColors.logistics,
                        },
                        {
                          scenario: "Expected",
                          pnl: calculations.scenarios.expected.pnl,
                          price: calculations.scenarios.expected.price.toFixed(2),
                          color: chartColors.ocean,
                        },
                        {
                          scenario: "Worst Case",
                          pnl: calculations.scenarios.worst.pnl,
                          price: calculations.scenarios.worst.price.toFixed(2),
                          color: chartColors.danger,
                        },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis dataKey="scenario" type="category" width={80} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "pnl" ? formatCurrency(value, currency) : `${value} ${commodityConfig.unit}`,
                          name === "pnl" ? "P&L" : "Price",
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
                  <div className="p-3 bg-[var(--logistics)]/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Best Case</p>
                    <p className="font-bold text-[var(--logistics)]">
                      {formatCurrency(calculations.scenarios.best.pnl, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{formatCurrency(calculations.scenarios.best.price, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{calculations.scenarios.best.description}</p>
                  </div>
                  <div className="p-3 bg-[var(--ocean)]/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Expected</p>
                    <p className="font-bold text-[var(--ocean)]">
                      {formatCurrency(calculations.scenarios.expected.pnl, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{formatCurrency(calculations.scenarios.expected.price, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{calculations.scenarios.expected.description}</p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Worst Case</p>
                    <p className="font-bold text-destructive">
                      {formatCurrency(calculations.scenarios.worst.pnl, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{formatCurrency(calculations.scenarios.worst.price, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{calculations.scenarios.worst.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* P&L Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>P&L Distribution</CardTitle>
                <CardDescription>Probability-weighted outcomes across price scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={pnlDistribution}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="price"
                        tickFormatter={(v) => `$${v.toFixed(0)}`}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        yAxisId="left"
                        tickFormatter={(v) => formatCurrency(v, currency)}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(v) => `${v.toFixed(0)}%`}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "pnl" ? formatCurrency(value, currency) : `${value.toFixed(1)}%`,
                          name === "pnl" ? "P&L" : "Probability",
                        ]}
                        labelFormatter={(label) => `Price: ${formatCurrency(label as number, currency)}`}
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="probability"
                        fill="rgba(15, 76, 129, 0.1)"
                        stroke="transparent"
                        name="Probability"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="pnl"
                        stroke={chartColors.ocean}
                        strokeWidth={2}
                        dot={false}
                        name="P&L"
                      />
                      <ReferenceLine yAxisId="left" y={0} stroke="#666" strokeDasharray="3 3" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Probability distribution shows likelihood of each price scenario
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                Cost Breakdown
              </CardTitle>
              <CardDescription>Hedge cost components and protection value</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
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
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {costBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.value, currency)}
                      </span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between text-sm p-3 bg-[var(--ocean)]/10 rounded-lg font-medium">
                    <span>Total Hedge Cost</span>
                    <span className="text-[var(--ocean)]">
                      {formatCurrency(calculations.hedgeCost, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                Risk Assessment Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                    <p className="text-sm font-medium">Upside Potential</p>
                  </div>
                  <p className="text-xl font-bold text-[var(--logistics)]">
                    {formatCurrency(Math.max(0, calculations.scenarios.best.pnl), currency)}
                  </p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-destructive" />
                    <p className="text-sm font-medium">Downside Risk</p>
                  </div>
                  <p className="text-xl font-bold text-destructive">
                    {formatCurrency(Math.min(0, calculations.scenarios.worst.pnl), currency)}
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
                <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-[var(--ocean)]" />
                    <p className="text-sm font-medium">Protection Level</p>
                  </div>
                  <p className="text-xl font-bold text-[var(--ocean)]">
                    {hedgePercentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Scenarios Chart</CardTitle>
              <CardDescription>Projected price movements with confidence intervals during hedge period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calculations.pricePath}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="month"
                      tickFormatter={(v) => `M${v}`}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tickFormatter={(v) => formatCurrency(v, currency)}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value, currency),
                        name === "spotPrice" ? "Expected Spot" :
                        name === "forwardPrice" ? "Forward Price" :
                        name === "upperBound" ? "Upper Bound (95%)" : "Lower Bound (95%)",
                      ]}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="transparent"
                      fill={chartColors.upperBound}
                      name="Upper Bound (95%)"
                    />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="transparent"
                      fill={chartColors.lowerBound}
                      name="Lower Bound (95%)"
                    />
                    <Line
                      type="monotone"
                      dataKey="spotPrice"
                      stroke={chartColors.ocean}
                      strokeWidth={2}
                      dot={false}
                      name="Expected Spot"
                    />
                    <Line
                      type="monotone"
                      dataKey="forwardPrice"
                      stroke={chartColors.logistics}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="Forward Price"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Current Spot</p>
                  <p className="font-bold">{formatCurrency(parseFloat(spotPrice) || commodityConfig.basePrice, currency)}</p>
                </div>
                <div className="p-3 bg-[var(--ocean)]/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Forward Price</p>
                  <p className="font-bold text-[var(--ocean)]">{formatCurrency(calculations.forwardPrice, currency)}</p>
                </div>
                <div className="p-3 bg-[var(--logistics)]/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Price Differential</p>
                  <p className="font-bold text-[var(--logistics)]">
                    {((calculations.forwardPrice / (parseFloat(spotPrice) || commodityConfig.basePrice) - 1) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost of Carry Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                Forward Price Calculation (Cost of Carry Model)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div className="text-lg font-bold">Forward Price Formula</div>
                  <div className="pt-2 border-t border-border">
                    F = S × e<sup>(r + u - y) × T</sup>
                  </div>
                  <div className="pt-2 border-t border-border text-xs space-y-1">
                    <div>F = Forward Price</div>
                    <div>S = Spot Price ({formatCurrency(parseFloat(spotPrice) || commodityConfig.basePrice, currency)})</div>
                    <div>r = Risk-free rate ({RISK_FREE_RATES[currency] || 5.25}%)</div>
                    <div>u = Storage cost ({commodityConfig.storageCost}%)</div>
                    <div>y = Convenience yield ({commodityConfig.convenienceYield}%)</div>
                    <div>T = Time to maturity ({hedgePeriod}/12 years)</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                    <p className="text-sm font-medium">Calculated Forward Price</p>
                    <p className="text-xl font-bold text-[var(--ocean)]">
                      {formatCurrency(calculations.forwardPrice, currency)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Market Condition</p>
                    <p className="text-sm text-muted-foreground">
                      {calculations.basis > 0 ? (
                        <>
                          <strong>Contango</strong> - Forward price above spot price.
                          Common in markets with high storage costs or oversupply.
                        </>
                      ) : (
                        <>
                          <strong>Backwardation</strong> - Forward price below spot price.
                          Common in tight markets with high convenience yield.
                        </>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                    <p className="text-sm font-medium">Implications for Hedgers</p>
                    <p className="text-sm text-muted-foreground">
                      {calculations.basis > 0 ? (
                        <>
                          Buyers benefit from locking in forward prices.
                          Sellers face roll yield costs.
                        </>
                      ) : (
                        <>
                          Sellers benefit from backwardation.
                          Buyers may prefer shorter-term hedges.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commodity Specs */}
          <Card>
            <CardHeader>
              <CardTitle>Commodity Specifications</CardTitle>
              <CardDescription>Key parameters affecting forward pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Commodity</p>
                  <p className="font-bold">{commodityConfig.name}</p>
                  <p className="text-xs text-muted-foreground">Unit: {commodityConfig.unit}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Historical Volatility</p>
                  <p className="font-bold">{commodityConfig.volatility}%</p>
                  <p className="text-xs text-muted-foreground">Annual</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Storage Cost</p>
                  <p className="font-bold">{commodityConfig.storageCost}%</p>
                  <p className="text-xs text-muted-foreground">Annual</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Convenience Yield</p>
                  <p className="font-bold">{commodityConfig.convenienceYield}%</p>
                  <p className="text-xs text-muted-foreground">Annual</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instruments" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {(Object.keys(HEDGE_INSTRUMENTS) as HedgeInstrument[]).map((key) => {
              const inst = HEDGE_INSTRUMENTS[key];
              return (
                <Card key={key} className={hedgeInstrument === key ? "border-[var(--ocean)]" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg">{inst.name}</CardTitle>
                    <CardDescription>{inst.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="outline">{inst.premiumType}</Badge>

                    <div>
                      <p className="text-sm font-medium text-[var(--logistics)] mb-2">Advantages</p>
                      <ul className="space-y-1">
                        {inst.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-destructive mb-2">Considerations</p>
                      <ul className="space-y-1">
                        {inst.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Best for:</strong> {inst.bestFor}
                      </p>
                    </div>

                    <Button
                      variant={hedgeInstrument === key ? "default" : "outline"}
                      className={`w-full ${hedgeInstrument === key ? "gradient-ocean text-white" : ""}`}
                      onClick={() => setHedgeInstrument(key)}
                    >
                      {hedgeInstrument === key ? "Selected" : "Select Instrument"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Instrument Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of hedging instruments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Feature</th>
                      <th className="text-left p-3 font-medium">Futures</th>
                      <th className="text-left p-3 font-medium">Options</th>
                      <th className="text-left p-3 font-medium">Swaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Upfront Cost</td>
                      <td className="p-3 text-muted-foreground">Margin (5-15%)</td>
                      <td className="p-3 text-muted-foreground">Premium</td>
                      <td className="p-3 text-muted-foreground">None (credit line)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Price Certainty</td>
                      <td className="p-3 text-muted-foreground">High</td>
                      <td className="p-3 text-muted-foreground">Medium</td>
                      <td className="p-3 text-muted-foreground">High</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Upside Potential</td>
                      <td className="p-3 text-muted-foreground">No</td>
                      <td className="p-3 text-muted-foreground">Yes</td>
                      <td className="p-3 text-muted-foreground">No</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Liquidity</td>
                      <td className="p-3 text-muted-foreground">High</td>
                      <td className="p-3 text-muted-foreground">Medium</td>
                      <td className="p-3 text-muted-foreground">Low</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">Customization</td>
                      <td className="p-3 text-muted-foreground">Low</td>
                      <td className="p-3 text-muted-foreground">Medium</td>
                      <td className="p-3 text-muted-foreground">High</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Complexity</td>
                      <td className="p-3 text-muted-foreground">Low</td>
                      <td className="p-3 text-muted-foreground">High</td>
                      <td className="p-3 text-muted-foreground">Medium</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Commodity Hedging</CardTitle>
              <CardDescription>Learn how commodity hedging works</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <h4>What is Commodity Hedging?</h4>
              <p className="text-muted-foreground">
                Commodity hedging is a risk management strategy used by producers, consumers, and traders
                to protect against adverse price movements in raw materials. By locking in prices today
                for future delivery, businesses can stabilize costs and revenues.
              </p>

              <h4 className="mt-4">Why Hedge Commodities?</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Price Stability:</strong> Lock in costs for budgeting certainty</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Margin Protection:</strong> Protect profit margins from volatility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Cash Flow Management:</strong> Predictable future cash flows</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <span><strong>Competitive Advantage:</strong> Offer stable pricing to customers</span>
                </li>
              </ul>

              <h4 className="mt-4">Key Concepts</h4>
              <div className="grid sm:grid-cols-2 gap-4 not-prose">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">Contango</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    When futures prices are higher than spot prices. Common in markets with high storage costs.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">Backwardation</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    When futures prices are lower than spot prices. Indicates supply tightness.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">Basis Risk</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Risk that the hedging instrument doesn&apos;t perfectly match the underlying exposure.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">Roll Yield</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gain or loss from rolling futures contracts. Positive in backwardation, negative in contango.
                  </p>
                </div>
              </div>

              <h4 className="mt-4">Market Structure Impact</h4>
              <p className="text-muted-foreground">
                The relationship between spot and futures prices significantly affects hedging costs:
              </p>
              <ul className="space-y-2 text-muted-foreground mt-2">
                <li><strong>Producers</strong> benefit from selling futures in contango markets</li>
                <li><strong>Consumers</strong> benefit from buying futures in backwardation markets</li>
                <li><strong>Roll costs</strong> can erode hedge returns over multiple periods</li>
              </ul>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                Hedging Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="font-medium text-[var(--logistics)]">Do&apos;s</p>
                  <ul className="space-y-2">
                    {[
                      "Match hedge maturity with underlying exposure",
                      "Consider basis risk when selecting instruments",
                      "Review and adjust positions regularly",
                      "Document hedge accounting properly",
                      "Start with simple strategies before complex ones",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="font-medium text-destructive">Don&apos;ts</p>
                  <ul className="space-y-2">
                    {[
                      "Over-hedge beyond actual exposure",
                      "Ignore margin call requirements",
                      "Speculate with hedging instruments",
                      "Forget transaction costs in analysis",
                      "Neglect counterparty risk in OTC contracts",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Use Cases</CardTitle>
              <CardDescription>How different industries use commodity hedging</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Airlines",
                    commodity: "Jet Fuel",
                    strategy: "Use swaps and collars to manage fuel costs",
                    icon: <TrendingUp className="h-5 w-5" />,
                  },
                  {
                    title: "Food Processors",
                    commodity: "Grains",
                    strategy: "Lock in input costs with futures contracts",
                    icon: <Wheat className="h-5 w-5" />,
                  },
                  {
                    title: "Mining Companies",
                    commodity: "Metals",
                    strategy: "Forward sales to secure revenue",
                    icon: <Coins className="h-5 w-5" />,
                  },
                  {
                    title: "Refineries",
                    commodity: "Crude Oil",
                    strategy: "Crack spread hedging for margins",
                    icon: <Droplets className="h-5 w-5" />,
                  },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-[var(--ocean)]">{item.icon}</div>
                      <p className="font-medium">{item.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <strong>Commodity:</strong> {item.commodity}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Strategy:</strong> {item.strategy}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
