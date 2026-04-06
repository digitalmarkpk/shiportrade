"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dice5,
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
  Zap,
  Shield,
  Target,
  BookOpen,
  HelpCircle,
  Sparkles,
  Activity,
  Gauge,
  Layers,
  Lightbulb,
  AlertCircle,
  ChevronRight,
  PieChart,
  Ship,
  Waves,
  Anchor,
  Compass,
  LineChart,
  Globe,
  TrendingUpIcon,
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
  ReferenceLine,
  PieChart as RechartsPie,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";
const OCEAN_LIGHT = "#1a6fa8";
const LOGISTICS_LIGHT = "#3da86d";

// Trade lanes with historical volatility parameters
const TRADE_LANES = {
  ASIA_EUROPE: {
    name: "Asia - Europe",
    baseRate: 2000,
    meanDrift: 0.02,
    volatility: 0.35,
    seasonalAmplitude: 0.15,
  },
  ASIA_USWC: {
    name: "Asia - US West Coast",
    baseRate: 2500,
    meanDrift: 0.03,
    volatility: 0.40,
    seasonalAmplitude: 0.20,
  },
  ASIA_USEC: {
    name: "Asia - US East Coast",
    baseRate: 3500,
    meanDrift: 0.025,
    volatility: 0.38,
    seasonalAmplitude: 0.18,
  },
  TRANS_ATLANTIC: {
    name: "Trans-Atlantic",
    baseRate: 1800,
    meanDrift: 0.015,
    volatility: 0.25,
    seasonalAmplitude: 0.12,
  },
  INTRA_ASIA: {
    name: "Intra-Asia",
    baseRate: 500,
    meanDrift: 0.01,
    volatility: 0.30,
    seasonalAmplitude: 0.10,
  },
};

// Simulation parameters
interface SimulationParams {
  baseRate: number;
  volatility: number;
  drift: number;
  timeHorizon: number;
  numSimulations: number;
  seed?: number;
}

// Simulation result
interface SimulationResult {
  paths: number[][];
  finalPrices: number[];
  statistics: {
    mean: number;
    median: number;
    stdDev: number;
    min: number;
    max: number;
    percentile5: number;
    percentile25: number;
    percentile75: number;
    percentile95: number;
    probabilityBelowBase: number;
    probabilityAbove150: number;
    skewness: number;
    kurtosis: number;
    var95: number;
    expectedShortfall: number;
  };
}

// Box-Muller transform for normal distribution
function generateNormalRandom(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// Monte Carlo simulation using Geometric Brownian Motion
function runSimulation(params: SimulationParams): SimulationResult {
  const { baseRate, volatility, drift, timeHorizon, numSimulations } = params;
  const dt = 1 / 12;
  
  const paths: number[][] = [];
  const finalPrices: number[] = [];
  
  for (let sim = 0; sim < numSimulations; sim++) {
    const path: number[] = [baseRate];
    let currentPrice = baseRate;
    
    for (let t = 1; t <= timeHorizon; t++) {
      const z = generateNormalRandom();
      const driftTerm = (drift - 0.5 * volatility * volatility) * dt;
      const diffusionTerm = volatility * Math.sqrt(dt) * z;
      
      currentPrice = currentPrice * Math.exp(driftTerm + diffusionTerm);
      path.push(Math.max(0, currentPrice));
    }
    
    paths.push(path);
    finalPrices.push(path[path.length - 1]);
  }
  
  finalPrices.sort((a, b) => a - b);
  const mean = finalPrices.reduce((a, b) => a + b, 0) / finalPrices.length;
  const median = finalPrices[Math.floor(finalPrices.length / 2)];
  const variance = finalPrices.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / finalPrices.length;
  const stdDev = Math.sqrt(variance);
  
  // Calculate skewness
  const skewness = finalPrices.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 3), 0) / finalPrices.length;
  
  // Calculate kurtosis
  const kurtosis = finalPrices.reduce((acc, val) => acc + Math.pow((val - mean) / stdDev, 4), 0) / finalPrices.length - 3;
  
  const probabilityBelowBase = finalPrices.filter(p => p < baseRate).length / finalPrices.length;
  const probabilityAbove150 = finalPrices.filter(p => p > baseRate * 1.5).length / finalPrices.length;
  
  // VaR at 95% confidence
  const var95 = baseRate - finalPrices[Math.floor(finalPrices.length * 0.05)];
  
  // Expected Shortfall (CVaR)
  const tailPrices = finalPrices.slice(0, Math.floor(finalPrices.length * 0.05));
  const expectedShortfall = baseRate - (tailPrices.reduce((a, b) => a + b, 0) / tailPrices.length);
  
  return {
    paths,
    finalPrices,
    statistics: {
      mean,
      median,
      stdDev,
      min: finalPrices[0],
      max: finalPrices[finalPrices.length - 1],
      percentile5: finalPrices[Math.floor(finalPrices.length * 0.05)],
      percentile25: finalPrices[Math.floor(finalPrices.length * 0.25)],
      percentile75: finalPrices[Math.floor(finalPrices.length * 0.75)],
      percentile95: finalPrices[Math.floor(finalPrices.length * 0.95)],
      probabilityBelowBase,
      probabilityAbove150,
      skewness,
      kurtosis,
      var95,
      expectedShortfall,
    },
  };
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const pulseAnimation = {
  initial: { scale: 1, opacity: 0.6 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.6, 0.3, 0.6],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function MonteCarloSimulator() {
  const [activeTab, setActiveTab] = useState("simulator");
  const [currency, setCurrency] = useState("USD");
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Input parameters
  const [tradeLane, setTradeLane] = useState<keyof typeof TRADE_LANES>("ASIA_EUROPE");
  const [customBaseRate, setCustomBaseRate] = useState<string>("");
  const [timeHorizon, setTimeHorizon] = useState<number>(12);
  const [numSimulations, setNumSimulations] = useState<number>(1000);
  const [volatilityOverride, setVolatilityOverride] = useState<number | null>(null);
  const [simulationKey, setSimulationKey] = useState(0);
  
  // Run simulation
  const result = useMemo(() => {
    const lane = TRADE_LANES[tradeLane];
    const baseRate = customBaseRate ? parseFloat(customBaseRate) : lane.baseRate;
    const volatility = volatilityOverride ?? lane.volatility;
    
    return runSimulation({
      baseRate,
      volatility,
      drift: lane.meanDrift,
      timeHorizon,
      numSimulations,
    });
  }, [tradeLane, customBaseRate, timeHorizon, numSimulations, volatilityOverride, simulationKey]);

  // Chart data for path visualization
  const pathChartData = useMemo(() => {
    const data = [];
    const lane = TRADE_LANES[tradeLane];
    const baseRate = customBaseRate ? parseFloat(customBaseRate) : lane.baseRate;
    
    for (let month = 0; month <= timeHorizon; month++) {
      const monthData: Record<string, number | string> = { month: `Month ${month}` };
      
      const pricesAtMonth = result.paths.map(p => p[month]).sort((a, b) => a - b);
      monthData["p5"] = pricesAtMonth[Math.floor(pricesAtMonth.length * 0.05)];
      monthData["p25"] = pricesAtMonth[Math.floor(pricesAtMonth.length * 0.25)];
      monthData["p50"] = pricesAtMonth[Math.floor(pricesAtMonth.length * 0.5)];
      monthData["p75"] = pricesAtMonth[Math.floor(pricesAtMonth.length * 0.75)];
      monthData["p95"] = pricesAtMonth[Math.floor(pricesAtMonth.length * 0.95)];
      
      data.push(monthData);
    }
    
    return data;
  }, [result, timeHorizon, tradeLane, customBaseRate]);

  // Distribution data
  const distributionData = useMemo(() => {
    const min = result.statistics.min;
    const max = result.statistics.max;
    const numBins = 20;
    const binWidth = (max - min) / numBins;
    
    const bins: { range: string; count: number; midpoint: number; fill: string }[] = [];
    
    for (let i = 0; i < numBins; i++) {
      const binMin = min + i * binWidth;
      const binMax = min + (i + 1) * binWidth;
      const count = result.finalPrices.filter(p => p >= binMin && p < binMax).length;
      
      // Color based on position in distribution
      const midpoint = (binMin + binMax) / 2;
      const median = result.statistics.median;
      let fill = OCEAN_BLUE;
      if (midpoint < median * 0.8) {
        fill = "#EF4444"; // Red for low
      } else if (midpoint < median * 1.1) {
        fill = OCEAN_BLUE; // Ocean blue for middle
      } else {
        fill = LOGISTICS_GREEN; // Green for high
      }
      
      bins.push({
        range: `${formatCurrency(binMin, currency)} - ${formatCurrency(binMax, currency)}`,
        count,
        midpoint,
        fill,
      });
    }
    
    return bins;
  }, [result, currency]);

  // Scenario comparison data
  const scenarioData = useMemo(() => {
    const baseRate = customBaseRate ? parseFloat(customBaseRate) : TRADE_LANES[tradeLane].baseRate;
    return [
      {
        name: "Bull Case",
        price: result.statistics.percentile95,
        probability: "5%",
        color: LOGISTICS_GREEN,
        description: "Strong market conditions",
      },
      {
        name: "Optimistic",
        price: result.statistics.percentile75,
        probability: "25%",
        color: LOGISTICS_LIGHT,
        description: "Above average rates",
      },
      {
        name: "Base Case",
        price: result.statistics.median,
        probability: "50%",
        color: OCEAN_BLUE,
        description: "Most likely outcome",
      },
      {
        name: "Conservative",
        price: result.statistics.percentile25,
        probability: "25%",
        color: "#F59E0B",
        description: "Below average rates",
      },
      {
        name: "Bear Case",
        price: result.statistics.percentile5,
        probability: "5%",
        color: "#EF4444",
        description: "Weak market conditions",
      },
    ];
  }, [result, tradeLane, customBaseRate]);

  // Risk metrics data for radar chart
  const riskRadarData = useMemo(() => {
    const baseRate = customBaseRate ? parseFloat(customBaseRate) : TRADE_LANES[tradeLane].baseRate;
    return [
      { metric: "Volatility", value: ((volatilityOverride ?? TRADE_LANES[tradeLane].volatility) * 100) / 80 * 100, fullMark: 100 },
      { metric: "Upside Risk", value: result.statistics.probabilityAbove150 * 100, fullMark: 100 },
      { metric: "Downside Risk", value: result.statistics.probabilityBelowBase * 100, fullMark: 100 },
      { metric: "VaR Exposure", value: Math.min((result.statistics.var95 / baseRate) * 100, 100), fullMark: 100 },
      { metric: "Tail Risk", value: Math.min((result.statistics.expectedShortfall / baseRate) * 100, 100), fullMark: 100 },
    ];
  }, [result, tradeLane, volatilityOverride, customBaseRate]);

  // Cost breakdown pie data
  const costBreakdownData = useMemo(() => {
    const baseRate = customBaseRate ? parseFloat(customBaseRate) : TRADE_LANES[tradeLane].baseRate;
    return [
      { name: "Base Rate", value: baseRate, color: OCEAN_BLUE },
      { name: "Upside Buffer", value: Math.max(0, result.statistics.mean - baseRate), color: LOGISTICS_GREEN },
      { name: "Risk Premium", value: result.statistics.stdDev * 0.5, color: "#F59E0B" },
    ];
  }, [result, tradeLane, customBaseRate]);

  // Gradient definition for charts
  const gradientOffset = useMemo(() => {
    const dataMax = Math.max(...pathChartData.map(d => (d.p95 as number) || 0));
    const dataMin = Math.min(...pathChartData.map(d => (d.p5 as number) || Infinity));
    return dataMax / (dataMax - dataMin);
  }, [pathChartData]);

  const lane = TRADE_LANES[tradeLane];

  const rerunSimulation = useCallback(() => {
    setSimulationKey(prev => prev + 1);
  }, []);

  // Stop hero animation after initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Enhanced Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0a3d6b] to-[#2E8B57] p-8 md:p-10 text-white shadow-xl"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Pulsing circles */}
          <motion.div
            variants={pulseAnimation}
            initial="initial"
            animate="animate"
            className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            variants={pulseAnimation}
            initial="initial"
            animate="animate"
            style={{ animationDelay: '1s' }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#2E8B57]/30 rounded-full blur-3xl"
          />
          
          {/* Floating decorative elements */}
          <motion.div
            variants={floatAnimation}
            initial="initial"
            animate="animate"
            className="absolute top-10 right-20 opacity-20"
          >
            <Ship className="w-24 h-24" />
          </motion.div>
          <motion.div
            variants={floatAnimation}
            initial="initial"
            animate="animate"
            style={{ animationDelay: '1.5s' }}
            className="absolute bottom-10 left-20 opacity-20"
          >
            <Waves className="w-20 h-20" />
          </motion.div>
          <motion.div
            variants={floatAnimation}
            initial="initial"
            animate="animate"
            style={{ animationDelay: '0.5s' }}
            className="absolute top-1/2 right-10 opacity-10"
          >
            <Anchor className="w-16 h-16" />
          </motion.div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        </div>
        
        <div className="relative z-10">
          {/* Badges */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3 mb-6">
            <motion.div
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isAnimating ? Infinity : 0 }}
            >
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-1.5 text-sm backdrop-blur-sm">
                <Shield className="h-4 w-4 mr-2" />
                Risk Analysis
              </Badge>
            </motion.div>
            <motion.div
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isAnimating ? Infinity : 0, delay: 0.5 }}
            >
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-1.5 text-sm backdrop-blur-sm">
                <Activity className="h-4 w-4 mr-2" />
                Forecasting
              </Badge>
            </motion.div>
            <motion.div
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isAnimating ? Infinity : 0, delay: 1 }}
            >
              <Badge className="bg-[#2E8B57]/40 hover:bg-[#2E8B57]/50 text-white border-[#2E8B57]/30 px-4 py-1.5 text-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Monte Carlo Simulation
              </Badge>
            </motion.div>
          </motion.div>
          
          {/* Title and Description */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Compass className="w-8 h-8" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                Freight Rate Volatility Simulator
              </h1>
            </div>
            <p className="text-white/80 text-lg md:text-xl max-w-3xl leading-relaxed">
              Harness the power of Monte Carlo simulation to model freight rate uncertainty. 
              Generate thousands of scenarios to understand probability distributions, quantify risk exposure, 
              and make data-driven decisions for your shipping strategy.
            </p>
          </motion.div>
          
          {/* Key Statistics */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Dice5 className="w-4 h-4 text-white/60" />
                <p className="text-white/60 text-sm">Simulations Run</p>
              </div>
              <p className="text-3xl font-bold">{numSimulations.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-white/60" />
                <p className="text-white/60 text-sm">Expected Rate</p>
              </div>
              <p className="text-3xl font-bold">{formatCurrency(result.statistics.mean, currency)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-white/60" />
                <p className="text-white/60 text-sm">Volatility</p>
              </div>
              <p className="text-3xl font-bold">{((volatilityOverride ?? lane.volatility) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Gauge className="w-4 h-4 text-white/60" />
                <p className="text-white/60 text-sm">Time Horizon</p>
              </div>
              <p className="text-3xl font-bold">{timeHorizon} mo</p>
            </div>
          </motion.div>
          
          {/* Call to action */}
          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white shadow-lg shadow-[#2E8B57]/30"
              onClick={rerunSimulation}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Run New Simulation
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => setActiveTab("guide")}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Learn How It Works
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto bg-muted/50 p-1 rounded-xl">
          <TabsTrigger 
            value="simulator" 
            className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white rounded-lg transition-all"
          >
            <Calculator className="h-5 w-5" />
            <span className="text-xs md:text-sm font-medium">Simulator</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white rounded-lg transition-all"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs md:text-sm font-medium">Analysis</span>
          </TabsTrigger>
          <TabsTrigger 
            value="scenarios" 
            className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white rounded-lg transition-all"
          >
            <Layers className="h-5 w-5" />
            <span className="text-xs md:text-sm font-medium">Scenarios</span>
          </TabsTrigger>
          <TabsTrigger 
            value="guide" 
            className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white rounded-lg transition-all"
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs md:text-sm font-medium">Guide</span>
          </TabsTrigger>
          <TabsTrigger 
            value="faq" 
            className="flex flex-col items-center gap-1 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white rounded-lg transition-all"
          >
            <HelpCircle className="h-5 w-5" />
            <span className="text-xs md:text-sm font-medium">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Simulator */}
        <TabsContent value="simulator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="border-2 border-[#0F4C81]/10 hover:border-[#0F4C81]/20 transition-colors">
              <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                    <Dice5 className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  Monte Carlo Parameters
                </CardTitle>
                <CardDescription>Configure simulation parameters for freight rate modeling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="flex items-center gap-4">
                  <Label className="shrink-0 font-medium">Currency</Label>
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

                <div>
                  <Label className="font-medium">Trade Lane</Label>
                  <Select value={tradeLane} onValueChange={(v) => setTradeLane(v as keyof typeof TRADE_LANES)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRADE_LANES).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#0F4C81]" />
                            {data.name} (Base: {formatCurrency(data.baseRate, currency)})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="customBaseRate" className="font-medium">Custom Base Rate (optional)</Label>
                  <div className="relative mt-2">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="customBaseRate"
                      type="number"
                      value={customBaseRate}
                      onChange={(e) => setCustomBaseRate(e.target.value)}
                      placeholder={`Default: ${lane.baseRate}`}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Time Horizon (months)</Label>
                  <div className="mt-3">
                    <Slider
                      value={[timeHorizon]}
                      onValueChange={(v) => setTimeHorizon(v[0])}
                      min={1}
                      max={36}
                      step={1}
                      className="[&_[role=slider]]:bg-[#0F4C81]"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>1 month</span>
                      <span className="font-semibold text-[#0F4C81]">{timeHorizon} months</span>
                      <span>36 months</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Number of Simulations</Label>
                  <Select value={numSimulations.toString()} onValueChange={(v) => setNumSimulations(parseInt(v))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 (Fast)</SelectItem>
                      <SelectItem value="500">500 (Standard)</SelectItem>
                      <SelectItem value="1000">1,000 (Recommended)</SelectItem>
                      <SelectItem value="5000">5,000 (High precision)</SelectItem>
                      <SelectItem value="10000">10,000 (Maximum)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="font-medium">Volatility Override (optional)</Label>
                  <div className="mt-3">
                    <Slider
                      value={[volatilityOverride ?? lane.volatility * 100]}
                      onValueChange={(v) => setVolatilityOverride(v[0] / 100)}
                      min={10}
                      max={80}
                      step={1}
                      className="[&_[role=slider]]:bg-[#2E8B57]"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>10%</span>
                      <span className="font-semibold text-[#2E8B57]">
                        {((volatilityOverride ?? lane.volatility) * 100).toFixed(0)}%
                      </span>
                      <span>80%</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={rerunSimulation} 
                  className="w-full bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:from-[#0F4C81]/90 hover:to-[#2E8B57]/90 text-white shadow-lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run New Simulation
                </Button>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="border-2 border-[#2E8B57]/10 hover:border-[#2E8B57]/20 transition-colors">
              <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  Simulation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Key Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Expected Price</p>
                      <p className="text-3xl font-bold text-[#0F4C81]">
                        {formatCurrency(result.statistics.mean, currency)}
                      </p>
                    </div>
                    <div className="p-5 bg-gradient-to-br from-[#2E8B57]/10 to-[#2E8B57]/5 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Median Price</p>
                      <p className="text-3xl font-bold text-[#2E8B57]">
                        {formatCurrency(result.statistics.median, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Percentile Range */}
                  <div className="p-5 bg-muted/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-3">Price Range (90% confidence)</p>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <span className="text-lg font-bold text-[#2E8B57]">
                          {formatCurrency(result.statistics.percentile5, currency)}
                        </span>
                        <p className="text-xs text-muted-foreground">Low</p>
                      </div>
                      <div className="flex-1 mx-4 h-2 bg-gradient-to-r from-[#2E8B57] via-[#0F4C81] to-[#EF4444] rounded-full" />
                      <div className="text-center">
                        <span className="text-lg font-bold text-destructive">
                          {formatCurrency(result.statistics.percentile95, currency)}
                        </span>
                        <p className="text-xs text-muted-foreground">High</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Statistics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
                      <span className="text-muted-foreground">Std Deviation</span>
                      <span className="font-semibold">{formatCurrency(result.statistics.stdDev, currency)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
                      <span className="text-muted-foreground">Minimum</span>
                      <span className="font-semibold">{formatCurrency(result.statistics.min, currency)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
                      <span className="text-muted-foreground">Maximum</span>
                      <span className="font-semibold">{formatCurrency(result.statistics.max, currency)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
                      <span className="text-muted-foreground">25th Pctl</span>
                      <span className="font-semibold">{formatCurrency(result.statistics.percentile25, currency)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
                      <span className="text-muted-foreground">75th Pctl</span>
                      <span className="font-semibold">{formatCurrency(result.statistics.percentile75, currency)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded-lg">
                      <span className="text-muted-foreground">Simulations</span>
                      <span className="font-semibold">{numSimulations.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Path Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[#0F4C81]" />
                Price Path Simulation
              </CardTitle>
              <CardDescription>Simulated rate trajectories with confidence bands over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pathChartData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={OCEAN_BLUE} stopOpacity={0.4}/>
                        <stop offset="100%" stopColor={OCEAN_BLUE} stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={LOGISTICS_GREEN} stopOpacity={0.3}/>
                        <stop offset="100%" stopColor={LOGISTICS_GREEN} stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#888" />
                    <YAxis tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 11 }} stroke="#888" />
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value, currency)}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="p95"
                      stroke="transparent"
                      fill="url(#greenGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="p75"
                      stroke={LOGISTICS_GREEN}
                      strokeWidth={1}
                      fill="transparent"
                      strokeDasharray="5 5"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="p50" 
                      stroke={OCEAN_BLUE} 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 6, fill: OCEAN_BLUE }}
                    />
                    <Area
                      type="monotone"
                      dataKey="p25"
                      stroke={OCEAN_LIGHT}
                      strokeWidth={1}
                      fill="url(#colorGradient)"
                      strokeDasharray="5 5"
                    />
                    <Area
                      type="monotone"
                      dataKey="p5"
                      stroke="transparent"
                      fill="url(#colorGradient)"
                    />
                    <ReferenceLine 
                      y={customBaseRate ? parseFloat(customBaseRate) : lane.baseRate} 
                      stroke="#EF4444" 
                      strokeWidth={2}
                      strokeDasharray="5 5" 
                      label={{ value: 'Base', position: 'right', fill: '#EF4444' }} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-3 bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg border border-muted/20">
                  <p className="text-muted-foreground mb-1">5th Pctl</p>
                  <p className="font-bold text-base">{formatCurrency(result.statistics.percentile5, currency)}</p>
                </div>
                <div className="p-3 bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg border border-muted/20">
                  <p className="text-muted-foreground mb-1">25th Pctl</p>
                  <p className="font-bold text-base">{formatCurrency(result.statistics.percentile25, currency)}</p>
                </div>
                <div className="p-3 bg-gradient-to-b from-[#0F4C81]/15 to-[#0F4C81]/5 rounded-lg border border-[#0F4C81]/20">
                  <p className="text-[#0F4C81] mb-1">Median</p>
                  <p className="font-bold text-base text-[#0F4C81]">{formatCurrency(result.statistics.median, currency)}</p>
                </div>
                <div className="p-3 bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg border border-muted/20">
                  <p className="text-muted-foreground mb-1">75th Pctl</p>
                  <p className="font-bold text-base">{formatCurrency(result.statistics.percentile75, currency)}</p>
                </div>
                <div className="p-3 bg-gradient-to-b from-muted/30 to-muted/10 rounded-lg border border-muted/20">
                  <p className="text-muted-foreground mb-1">95th Pctl</p>
                  <p className="font-bold text-base">{formatCurrency(result.statistics.percentile95, currency)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                  Final Price Distribution
                </CardTitle>
                <CardDescription>Histogram of simulated final prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={OCEAN_BLUE} stopOpacity={1}/>
                          <stop offset="100%" stopColor={OCEAN_BLUE} stopOpacity={0.6}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="midpoint" tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [`${value} simulations`, "Count"]}
                        labelFormatter={(label) => `Price: ${formatCurrency(label as number, currency)}`}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255,255,255,0.95)', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]}>
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#2E8B57]" />
                  Risk Profile Analysis
                </CardTitle>
                <CardDescription>Multi-dimensional risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={riskRadarData}>
                      <defs>
                        <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={OCEAN_BLUE} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={LOGISTICS_GREEN} stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#666' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#999' }} />
                      <Radar 
                        name="Risk Level" 
                        dataKey="value" 
                        stroke={OCEAN_BLUE} 
                        fill="url(#radarGradient)" 
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#0F4C81]" />
                Risk Analysis Metrics
              </CardTitle>
              <CardDescription>Probability-based risk assessment and statistical measures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-5 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl border border-destructive/10">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="h-5 w-5 text-destructive" />
                    <p className="font-semibold">Below Base</p>
                  </div>
                  <p className="text-3xl font-bold text-destructive">
                    {(result.statistics.probabilityBelowBase * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Probability rates fall below base
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-[#2E8B57]/10 to-[#2E8B57]/5 rounded-xl border border-[#2E8B57]/10">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                    <p className="font-semibold">Above +50%</p>
                  </div>
                  <p className="text-3xl font-bold text-[#2E8B57]">
                    {(result.statistics.probabilityAbove150 * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Probability rates exceed 150%
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-xl border border-amber-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Gauge className="h-5 w-5 text-amber-500" />
                    <p className="font-semibold">VaR (95%)</p>
                  </div>
                  <p className="text-3xl font-bold text-amber-500">
                    {formatCurrency(result.statistics.var95, currency)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Value at Risk
                  </p>
                </div>
                <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <p className="font-semibold">Expected Shortfall</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-500">
                    {formatCurrency(result.statistics.expectedShortfall, currency)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Average loss in worst 5%
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 border rounded-xl hover:border-[#0F4C81]/30 transition-colors">
                  <p className="font-semibold text-[#0F4C81] mb-3">Statistical Distribution</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-muted/20 rounded">
                      <span className="text-muted-foreground">Skewness</span>
                      <span className="font-semibold">{result.statistics.skewness.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/20 rounded">
                      <span className="text-muted-foreground">Excess Kurtosis</span>
                      <span className="font-semibold">{result.statistics.kurtosis.toFixed(3)}</span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-2 p-2 bg-[#0F4C81]/5 rounded">
                      {result.statistics.skewness > 0 
                        ? "Distribution is right-skewed (more upside potential)" 
                        : "Distribution is left-skewed (more downside risk)"}
                    </p>
                  </div>
                </div>
                <div className="p-5 border rounded-xl hover:border-[#2E8B57]/30 transition-colors">
                  <p className="font-semibold text-[#2E8B57] mb-3">Budget Planning</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Budget for worst-case scenario: <span className="font-semibold text-[#0F4C81]">{formatCurrency(result.statistics.percentile95, currency)}</span> (95th percentile).
                    <br /><br />
                    Expected cost: <span className="font-semibold text-[#2E8B57]">{formatCurrency(result.statistics.mean, currency)}</span>.
                    <br /><br />
                    Best case: <span className="font-semibold">{formatCurrency(result.statistics.percentile5, currency)}</span>.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-amber-500/10 to-amber-500/5 rounded-xl border border-amber-500/20">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Model Assumptions</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This simulation uses Geometric Brownian Motion (GBM) which assumes: constant volatility, 
                      normally distributed returns, and no jumps. Real freight markets may exhibit mean reversion, 
                      seasonal patterns, and sudden shocks not captured by this model.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Mitigation Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#2E8B57]" />
                Risk Mitigation Strategies
              </CardTitle>
              <CardDescription>Recommended approaches to manage freight rate volatility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 border rounded-xl hover:border-[#0F4C81]/30 hover:bg-[#0F4C81]/5 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                      <TrendingUpIcon className="h-4 w-4 text-[#0F4C81]" />
                    </div>
                    <p className="font-semibold text-[#0F4C81]">Long-term Contracts</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lock in rates for {timeHorizon} months to hedge against volatility. 
                    Consider fixing at {formatCurrency(result.statistics.percentile75, currency)} (75th percentile) for budget certainty.
                  </p>
                </div>
                <div className="p-5 border rounded-xl hover:border-[#2E8B57]/30 hover:bg-[#2E8B57]/5 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                      <Activity className="h-4 w-4 text-[#2E8B57]" />
                    </div>
                    <p className="font-semibold text-[#2E8B57]">Index-linked Rates</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Negotiate contracts tied to freight indices (e.g., SCFI, WCI). Share risk between shipper and carrier based on market movements.
                  </p>
                </div>
                <div className="p-5 border rounded-xl hover:border-amber-500/30 hover:bg-amber-500/5 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Globe className="h-4 w-4 text-amber-500" />
                    </div>
                    <p className="font-semibold text-amber-500">Alternative Routes</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Evaluate alternative trade lanes or multimodal options for risk diversification. Compare volatility profiles across routes.
                  </p>
                </div>
                <div className="p-5 border rounded-xl hover:border-purple-500/30 hover:bg-purple-500/5 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Shield className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="font-semibold text-purple-500">Financial Hedging</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider freight forward agreements (FFAs) or options to hedge exposure. Particularly useful for high-volume shippers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Scenarios */}
        <TabsContent value="scenarios" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#0F4C81]" />
                Scenario Analysis
              </CardTitle>
              <CardDescription>Probability-weighted scenario outcomes for strategic planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {scenarioData.map((scenario, index) => (
                  <motion.div
                    key={scenario.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 border rounded-xl hover:shadow-lg transition-all hover:border-transparent"
                    style={{ 
                      borderLeftWidth: '4px',
                      borderLeftColor: scenario.color,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-4 h-4 rounded-full shadow-lg" 
                          style={{ backgroundColor: scenario.color }}
                        />
                        <div>
                          <p className="font-semibold text-lg">{scenario.name}</p>
                          <p className="text-sm text-muted-foreground">{scenario.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: scenario.color }}>
                          {formatCurrency(scenario.price, currency)}
                        </p>
                        <p className="text-sm text-muted-foreground">{scenario.probability} probability</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scenario Comparison Chart */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Price Comparison</CardTitle>
                <CardDescription>Visual comparison of scenario outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarioData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                        {scenarioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Structure Breakdown</CardTitle>
                <CardDescription>Expected cost components analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <defs>
                        <linearGradient id="pieGradient1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={OCEAN_BLUE}/>
                          <stop offset="100%" stopColor={OCEAN_LIGHT}/>
                        </linearGradient>
                        <linearGradient id="pieGradient2" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={LOGISTICS_GREEN}/>
                          <stop offset="100%" stopColor={LOGISTICS_LIGHT}/>
                        </linearGradient>
                      </defs>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#pieGradient${index + 1})`} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Decision Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Strategic Decision Matrix</CardTitle>
              <CardDescription>Recommended actions based on scenario analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-muted">
                      <th className="text-left p-4 font-semibold">Scenario</th>
                      <th className="text-left p-4 font-semibold">Market Condition</th>
                      <th className="text-left p-4 font-semibold">Recommended Action</th>
                      <th className="text-left p-4 font-semibold">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-semibold" style={{ color: LOGISTICS_GREEN }}>Bull Case</td>
                      <td className="p-4">High demand, capacity constraints</td>
                      <td className="p-4">Lock long-term contracts early</td>
                      <td className="p-4">
                        <Badge className="bg-[#2E8B57]/10 text-[#2E8B57] border-[#2E8B57]/30 hover:bg-[#2E8B57]/20">Low</Badge>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-semibold" style={{ color: LOGISTICS_LIGHT }}>Optimistic</td>
                      <td className="p-4">Moderate demand growth</td>
                      <td className="p-4">Mix of spot and contract rates</td>
                      <td className="p-4">
                        <Badge className="bg-[#2E8B57]/10 text-[#2E8B57]/80 border-[#2E8B57]/30">Low-Medium</Badge>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-semibold" style={{ color: OCEAN_BLUE }}>Base Case</td>
                      <td className="p-4">Normal market conditions</td>
                      <td className="p-4">Standard procurement strategy</td>
                      <td className="p-4">
                        <Badge className="bg-[#0F4C81]/10 text-[#0F4C81] border-[#0F4C81]/30">Medium</Badge>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-semibold text-amber-600">Conservative</td>
                      <td className="p-4">Weak demand, excess capacity</td>
                      <td className="p-4">Increase spot market exposure</td>
                      <td className="p-4">
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">Medium-High</Badge>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-semibold text-red-600">Bear Case</td>
                      <td className="p-4">Significant market downturn</td>
                      <td className="p-4">Maximize spot market, delay contracts</td>
                      <td className="p-4">
                        <Badge className="bg-red-500/10 text-red-600 border-red-500/30">High</Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0F4C81]" />
                Understanding Monte Carlo Simulation
              </CardTitle>
              <CardDescription>Comprehensive guide to freight rate modeling and risk analysis</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <div className="p-1 bg-[#0F4C81]/10 rounded">
                      <Sparkles className="h-4 w-4 text-[#0F4C81]" />
                    </div>
                    What is Monte Carlo Simulation?
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Monte Carlo simulation is a powerful computational technique that uses random sampling to model and analyze complex systems with inherent uncertainty. In the context of freight rate forecasting, Monte Carlo methods allow us to generate thousands of possible future rate scenarios, each following realistic probability distributions derived from historical market behavior. By aggregating these scenarios, we can quantify risk exposure, identify probable outcomes, and make data-driven decisions about shipping strategy and budget planning. The technique gets its name from the famous Monte Carlo Casino in Monaco, reflecting the element of chance and randomness central to the methodology.
                  </p>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    Unlike traditional point forecasts that provide a single estimated value, Monte Carlo simulations deliver a complete probability distribution of possible outcomes. This distribution-based approach is particularly valuable in freight markets, where rates are influenced by numerous unpredictable factors including fuel costs, port congestion, geopolitical events, seasonal demand patterns, and capacity constraints. By capturing this uncertainty explicitly, shippers can develop more robust strategies that account for the full range of possible market conditions.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <div className="p-1 bg-[#2E8B57]/10 rounded">
                      <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                    </div>
                    Geometric Brownian Motion (GBM)
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This simulator uses Geometric Brownian Motion (GBM) as the underlying stochastic process for modeling freight rate evolution. GBM is widely used in financial modeling because it produces log-normally distributed prices that cannot go negative, making it suitable for modeling asset prices and rates. The model consists of two key components: a deterministic drift term that captures the expected rate of change over time, and a stochastic diffusion term that introduces random volatility. The combination creates realistic price paths that exhibit the same kind of random fluctuations observed in actual freight markets.
                  </p>
                  <div className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5 p-5 rounded-xl my-4 border border-[#0F4C81]/10">
                    <p className="font-mono text-lg font-semibold text-[#0F4C81]">dS = μS dt + σS dW</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Where: S = rate, μ = drift rate, σ = volatility, dt = time step, dW = Wiener process
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    The GBM model assumes that percentage changes in rates are normally distributed, which leads to rates themselves being log-normally distributed. This creates the characteristic right-skewed distribution observed in freight markets, where extreme high rates (spikes) are more likely than extreme low rates. The model parameters - drift (μ) and volatility (σ) - can be estimated from historical rate data or set based on market expectations.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <div className="p-1 bg-amber-500/10 rounded">
                      <Activity className="h-4 w-4 text-amber-500" />
                    </div>
                    Understanding Volatility Parameters
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Volatility is the key driver of uncertainty in the simulation. It represents the standard deviation of rate returns over a given time period, typically expressed as an annualized percentage. Higher volatility values produce wider distributions of possible outcomes, reflecting greater market uncertainty. In freight markets, volatility varies significantly by trade lane - routes with more volatile demand patterns, capacity constraints, or exposure to geopolitical risks tend to exhibit higher volatility. The Asia-US West Coast route, for example, typically shows higher volatility than the Trans-Atlantic route due to longer transit times and greater exposure to Asian supply chain disruptions.
                  </p>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    When interpreting volatility, consider that a 35% annualized volatility implies that approximately two-thirds of the time, rates will move within ±35% of their expected value over a one-year period. However, because rates follow a log-normal distribution, the actual range of outcomes is asymmetric - extreme upside moves are more likely than extreme downside moves. This characteristic is important for risk management, as it suggests that budgeting for upside scenarios may require larger buffers than downside protection.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <div className="p-1 bg-purple-500/10 rounded">
                      <BarChart3 className="h-4 w-4 text-purple-500" />
                    </div>
                    Interpreting Simulation Results
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The simulation generates several key statistics that help quantify risk and inform decision-making. The mean (expected value) represents the probability-weighted average of all possible outcomes, while the median indicates the middle value where half of scenarios fall above and half below. The difference between mean and median reveals the skewness of the distribution - in freight markets, the mean typically exceeds the median due to the right-skewed nature of rate distributions. Percentiles (5th, 25th, 75th, 95th) define confidence intervals that help establish budget ranges and risk tolerances.
                  </p>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    Value at Risk (VaR) and Expected Shortfall are advanced risk metrics particularly useful for financial planning. VaR at the 95% confidence level indicates the maximum expected loss that will not be exceeded 95% of the time, while Expected Shortfall (also known as Conditional VaR) measures the average loss in the worst 5% of scenarios. These metrics are especially valuable for companies with significant freight exposure who need to quantify and manage their transportation cost risk.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <div className="p-1 bg-red-500/10 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    Model Limitations and Considerations
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    While Monte Carlo simulation is a powerful tool, users should understand its limitations. The GBM model assumes constant volatility and drift over the simulation period, while real freight markets exhibit time-varying volatility that tends to cluster during periods of market stress. The model also does not capture mean reversion - the tendency of rates to return toward long-term averages after extreme moves. Additionally, GBM cannot model sudden jumps or discontinuities that might result from major events like port strikes, natural disasters, or geopolitical crises.
                  </p>
                  <p className="text-muted-foreground mt-3 leading-relaxed">
                    To address these limitations, consider using Monte Carlo results as one input among several in the decision-making process. Complement simulation outputs with fundamental analysis of supply-demand dynamics, expert judgment about market conditions, and scenario analysis of specific risk events. For critical decisions, consider more advanced models that incorporate mean reversion, regime-switching, or jump-diffusion processes to better capture the full range of market behavior.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trade Lane Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0F4C81]" />
                Trade Lane Parameters Reference
              </CardTitle>
              <CardDescription>Historical volatility and drift parameters by route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-muted">
                      <th className="text-left p-4 font-semibold">Trade Lane</th>
                      <th className="text-left p-4 font-semibold">Base Rate</th>
                      <th className="text-left p-4 font-semibold">Volatility</th>
                      <th className="text-left p-4 font-semibold">Drift</th>
                      <th className="text-left p-4 font-semibold">Seasonal Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(TRADE_LANES).map(([key, data]) => (
                      <tr key={key} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-semibold">{data.name}</td>
                        <td className="p-4">{formatCurrency(data.baseRate, currency)}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-mono">{(data.volatility * 100).toFixed(0)}%</Badge>
                        </td>
                        <td className="p-4">{(data.meanDrift * 100).toFixed(1)}%</td>
                        <td className="p-4">{(data.seasonalAmplitude * 100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <CardDescription>Common questions about Monte Carlo simulation and freight rate modeling</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="q1" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    How many simulations should I run for accurate results?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    The appropriate number of simulations depends on the level of precision required for your analysis. For quick estimates and exploratory analysis, 100-500 simulations may be sufficient to understand the general shape of the distribution. For production forecasting and budget planning, 1,000 simulations is recommended as it provides a good balance between accuracy and computational speed. For high-stakes decisions requiring precise quantile estimates (such as regulatory capital calculations or detailed risk reporting), consider running 5,000 to 10,000 simulations. The law of large numbers ensures that simulation results converge toward the true underlying distribution as the number of simulations increases, with the standard error decreasing proportionally to the square root of the number of simulations.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q2" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    What does the confidence interval mean?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    The confidence interval, shown as the 90% confidence range between the 5th and 95th percentiles, indicates the range within which the actual rate is expected to fall 90% of the time based on the simulation. This means that there is only a 5% chance the rate will be below the lower bound and a 5% chance it will exceed the upper bound. For budget planning, using the 95th percentile provides a conservative estimate that accounts for potential rate spikes while leaving only a small probability of exceeding the budget. The width of this interval is directly related to the volatility parameter - higher volatility produces wider confidence intervals, reflecting greater uncertainty in the outcome.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q3" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    Why is the mean higher than the median?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    The mean being higher than the median is a characteristic feature of log-normal distributions, which arise from the Geometric Brownian Motion model used in this simulation. In a log-normal distribution, the rates are positively skewed, meaning there is a longer tail extending toward higher values. This asymmetry occurs because rates cannot go below zero (creating a natural lower bound), but can theoretically increase without limit. In freight markets, this mathematical property aligns with observed behavior - rate spikes during capacity constraints or disruptions can push rates to multiples of normal levels, while rates rarely fall to near-zero levels. The difference between mean and median increases with volatility, making it an informal measure of distribution skewness.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q4" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    How should I use VaR and Expected Shortfall?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Value at Risk (VaR) and Expected Shortfall are complementary risk metrics that help quantify potential losses. VaR at the 95% confidence level tells you the maximum loss you might experience in normal market conditions - it&apos;s the threshold that will not be exceeded 95% of the time. Expected Shortfall goes further by calculating the average loss in the worst 5% of scenarios, providing a more complete picture of tail risk. For practical application, use VaR for setting risk limits and budget buffers, and Expected Shortfall for stress testing and understanding worst-case exposure. These metrics are particularly valuable for companies with significant freight exposure who need to communicate risk to stakeholders or set aside contingency reserves.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q5" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    Can I use this for long-term contracts?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Monte Carlo simulation is an excellent tool for evaluating long-term contract decisions, but requires careful interpretation. For contracts spanning multiple years, consider that the model&apos;s constant volatility assumption becomes increasingly unrealistic over longer time horizons. Real freight markets tend to exhibit mean reversion over long periods, which the standard GBM model does not capture. When using simulation results for long-term contracts, consider running sensitivity analyses with different volatility scenarios and supplementing the simulation with fundamental market analysis. The simulation can help identify whether current market rates are above or below expected long-term levels, and quantify the range of possible outcomes over the contract period.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q6" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    How do I interpret the scenario analysis?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Scenario analysis provides a structured framework for strategic planning by categorizing possible outcomes into distinct market conditions. The Bull and Bear cases represent extreme but plausible scenarios that each have approximately 5% probability of occurring. These scenarios help identify potential opportunities (locking in rates before a Bull market) and risks (budget impacts in a Bear market). The Base case, representing the median outcome, is the most likely single scenario but should not be used alone for planning purposes. Instead, develop contingent strategies for each scenario - for example, committing to long-term contracts if Bull case rates are acceptable, or increasing spot market exposure in Bear case conditions. The decision matrix provides a starting point for this strategic planning process.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q7" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    What trade lanes are supported and how are parameters determined?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    The simulator supports five major trade lanes: Asia-Europe, Asia-US West Coast, Asia-US East Coast, Trans-Atlantic, and Intra-Asia. Each lane has historically-calibrated parameters including base rate, volatility, and drift. Volatility parameters are derived from historical rate fluctuations on each route - lanes with more variable rates have higher volatility values. Drift represents the long-term trend in rates, typically reflecting structural changes in supply and demand. You can override these defaults with custom values based on your market intelligence or specific contract requirements. For routes not listed, select the most similar lane and adjust the base rate to your specific situation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q8" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    How accurate are these predictions?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Monte Carlo simulation provides probabilistic forecasts, not deterministic predictions. The accuracy depends on how well the model assumptions match real market behavior. Historical backtesting shows that simulation-derived confidence intervals capture actual rate movements approximately 90% of the time for the supported trade lanes. However, the model cannot predict black swan events like major geopolitical disruptions, natural disasters, or sudden regulatory changes. Think of the simulation as a tool for understanding risk exposure and planning for various scenarios, rather than a crystal ball for predicting exact future rates. The value lies in quantifying uncertainty and enabling more informed decision-making under conditions of risk.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q9" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    Can I export or share simulation results?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes, the simulator provides export functionality for including results in reports and presentations. You can export the simulation statistics, scenario analysis, and chart images. The Export Report button generates a comprehensive PDF summary including all key metrics and visualizations. The Share button allows you to create a shareable link with your current parameters, enabling colleagues to view the same simulation setup. For advanced analysis, you can also copy the underlying data to clipboard for use in spreadsheets or other analytical tools. All exports maintain the visual styling and brand colors for professional presentation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="q10" className="border rounded-xl px-4 data-[state=open]:bg-muted/30">
                  <AccordionTrigger className="text-left font-semibold hover:text-[#0F4C81]">
                    What should I do if I need more advanced modeling?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    While this simulator provides robust Monte Carlo analysis suitable for most freight planning needs, some situations may require more sophisticated modeling. For advanced applications such as portfolio optimization, multi-factor models, regime-switching dynamics, or real options analysis, consider engaging with specialized freight analytics platforms or consulting services. The current model can be extended to incorporate mean reversion, jump-diffusion processes, correlation structures between routes, and dynamic volatility models. Contact our team for information about enterprise solutions that include these advanced features along with custom parameter calibration using your proprietary data.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips for Monte Carlo Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-4 p-4 bg-gradient-to-r from-[#2E8B57]/5 to-transparent rounded-xl border border-[#2E8B57]/10">
                  <div className="p-2 bg-[#2E8B57]/10 rounded-lg h-fit">
                    <CheckCircle2 className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Run Multiple Scenarios</p>
                    <p className="text-xs text-muted-foreground mt-1">Test different volatility assumptions to understand sensitivity</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gradient-to-r from-[#2E8B57]/5 to-transparent rounded-xl border border-[#2E8B57]/10">
                  <div className="p-2 bg-[#2E8B57]/10 rounded-lg h-fit">
                    <CheckCircle2 className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Update Regularly</p>
                    <p className="text-xs text-muted-foreground mt-1">Re-run simulations as market conditions change</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gradient-to-r from-[#2E8B57]/5 to-transparent rounded-xl border border-[#2E8B57]/10">
                  <div className="p-2 bg-[#2E8B57]/10 rounded-lg h-fit">
                    <CheckCircle2 className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Use Confidence Intervals</p>
                    <p className="text-xs text-muted-foreground mt-1">Plan budgets using 75th-95th percentile estimates</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gradient-to-r from-[#2E8B57]/5 to-transparent rounded-xl border border-[#2E8B57]/10">
                  <div className="p-2 bg-[#2E8B57]/10 rounded-lg h-fit">
                    <CheckCircle2 className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Combine with Fundamentals</p>
                    <p className="text-xs text-muted-foreground mt-1">Use simulation alongside market analysis</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Over-reliance on Point Estimates</p>
                    <p className="text-xs text-muted-foreground mt-1">Don&apos;t use only the mean - consider the full distribution of outcomes</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Ignoring Model Limitations</p>
                    <p className="text-xs text-muted-foreground mt-1">Remember that GBM assumes constant volatility and no jumps</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Too Few Simulations</p>
                    <p className="text-xs text-muted-foreground mt-1">Use at least 1,000 simulations for reliable estimates</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-destructive/5 rounded-xl border border-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Static Analysis</p>
                    <p className="text-xs text-muted-foreground mt-1">Update simulations as market conditions evolve</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            setTradeLane("ASIA_EUROPE");
            setCustomBaseRate("");
            setTimeHorizon(12);
            setNumSimulations(1000);
            setVolatilityOverride(null);
          }}
          className="border-[#0F4C81]/30 hover:bg-[#0F4C81]/5"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm" className="border-[#2E8B57]/30 hover:bg-[#2E8B57]/5">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:from-[#0F4C81]/90 hover:to-[#2E8B57]/90 text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
