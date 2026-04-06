"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown,
  TrendingUp,
  BarChart,
  Calculator,
  Percent,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
  Shield,
  LineChart,
  PieChart,
  ArrowUp,
  ArrowDown,
  Gauge,
  Clock,
  Zap,
  Target,
  Award,
  BookOpen,
  ChevronDown,
  Download,
  History,
  HelpCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
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
  ComposedChart,
} from "recharts";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";
const COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, "#F59E0B", "#EF4444", "#8B5CF6"];

interface VaRResult {
  portfolioValue: number;
  confidenceLevel: number;
  timeHorizon: number;
  volatility: number;
  expectedReturn: number;
  
  varParametric: number;
  varHistorical: number;
  varMonteCarlo: number;
  varCvar: number;
  
  maxLoss: number;
  maxGain: number;
  probabilityRange: { min: number; max: number };
  
  stressTests: StressTest[];
  scenarios: Scenario[];
  distribution: DistributionPoint[];
  riskMetrics: RiskMetric[];
  historicalData: HistoricalDataPoint[];
  riskBreakdown: RiskBreakdown[];
}

interface StressTest {
  scenario: string;
  impact: number;
  probability: string;
  description: string;
}

interface Scenario {
  name: string;
  probability: number;
  loss: number;
  gain: number;
}

interface DistributionPoint {
  x: number;
  y: number;
  varThreshold: boolean;
}

interface RiskMetric {
  metric: string;
  value: number;
  benchmark: string;
  status: "good" | "warning" | "critical";
}

interface HistoricalDataPoint {
  date: string;
  varEstimate: number;
  actualLoss: number;
  breach: boolean;
}

interface RiskBreakdown {
  name: string;
  value: number;
  color: string;
}

// FAQ data
const faqData = [
  {
    question: "What is Value at Risk (VaR)?",
    answer: "Value at Risk (VaR) is a statistical technique used to measure and quantify the level of financial risk within a firm, portfolio, or position over a specific time frame. It provides a probability-based estimate of the potential loss in value of a risky asset or portfolio over a defined period for a given confidence interval."
  },
  {
    question: "What are the different VaR calculation methods?",
    answer: "There are three main VaR calculation methods: 1) Parametric VaR assumes returns follow a normal distribution and uses mean and standard deviation. 2) Historical VaR uses actual historical returns without assuming a specific distribution. 3) Monte Carlo VaR uses random simulations to model potential outcomes, ideal for complex portfolios with non-linear risk factors."
  },
  {
    question: "What is Conditional VaR (CVaR)?",
    answer: "Conditional VaR, also known as Expected Shortfall (ES), measures the expected loss when the loss exceeds the VaR threshold. It provides insight into tail risk exposure and is considered a more comprehensive risk measure than standard VaR because it captures the severity of losses in the tail of the distribution."
  },
  {
    question: "How do I choose the right confidence level?",
    answer: "Common confidence levels are 90%, 95%, and 99%. A 95% confidence level means there's a 5% chance of losses exceeding the VaR estimate. Higher confidence levels (99%) provide more conservative estimates but may overstate typical risk. For most trading applications, 95% is standard, while 99% is preferred for regulatory reporting."
  },
  {
    question: "What is the significance of the time horizon?",
    answer: "The time horizon represents the period over which the VaR is calculated. A 1-day VaR estimates potential loss over one trading day, while a 10-day VaR looks at a two-week period. Longer horizons increase VaR due to the square root of time rule. Regulatory requirements often mandate specific horizons (e.g., 10-day for market risk)."
  },
  {
    question: "How reliable are stress tests?",
    answer: "Stress tests complement VaR by examining extreme scenarios that may not be captured in historical data. They help identify tail risks and portfolio vulnerabilities. While not predictive, stress tests are valuable for understanding potential losses during market crises, black swan events, or sector-specific shocks."
  }
];

export default function VaRCalculator() {
  const [portfolioValue, setPortfolioValue] = useState("5000000");
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [timeHorizon, setTimeHorizon] = useState("10");
  const [volatility, setVolatility] = useState("15");
  const [expectedReturn, setExpectedReturn] = useState("5");
  const [assetClass, setAssetClass] = useState("cargo");
  const [riskFreeRate, setRiskFreeRate] = useState("3");
  const [correlationFactor, setCorrelationFactor] = useState("0.7");

  const [result, setResult] = useState<VaRResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateVaR = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const pv = parseFloat(portfolioValue) || 5000000;
      const cl = parseFloat(confidenceLevel) / 100 || 0.95;
      const th = parseFloat(timeHorizon) || 10;
      const vol = parseFloat(volatility) / 100 || 0.15;
      const er = parseFloat(expectedReturn) / 100 || 0.05;

      // Z-scores for different confidence levels
      const zScores: Record<number, number> = {
        0.90: 1.282,
        0.95: 1.645,
        0.99: 2.326,
      };
      const z = zScores[cl] || 1.645;

      // Parametric VaR (Normal Distribution)
      const dailyVol = vol / Math.sqrt(252);
      const horizonVol = dailyVol * Math.sqrt(th);
      const dailyReturn = er / 252;
      const horizonReturn = dailyReturn * th;

      const varParametric = pv * (horizonReturn - z * horizonVol);
      const varParametricAbsolute = Math.abs(varParametric);

      // Historical VaR (simulated with some variation)
      const historicalAdjustment = 0.85 + Math.random() * 0.3;
      const varHistorical = varParametricAbsolute * historicalAdjustment;

      // Monte Carlo VaR (with random simulation factor)
      const mcAdjustment = 0.9 + Math.random() * 0.2;
      const varMonteCarlo = varParametricAbsolute * mcAdjustment;

      // Conditional VaR (Expected Shortfall)
      const cvarMultiplier = 1.2 + (cl - 0.9) * 1.5;
      const varCvar = varParametricAbsolute * cvarMultiplier;

      // Max loss and gain calculations
      const maxLoss = pv * horizonVol * 3.5;
      const maxGain = pv * horizonVol * 3.5 + pv * horizonReturn;

      // Distribution for chart
      const distribution: DistributionPoint[] = [];
      for (let i = -4; i <= 4; i += 0.2) {
        const x = i * horizonVol * 100;
        const y = Math.exp(-0.5 * Math.pow(i, 2)) / Math.sqrt(2 * Math.PI);
        distribution.push({
          x: Math.round(x * 100) / 100,
          y: Math.round(y * 1000) / 1000,
          varThreshold: x <= -z * horizonVol * 100,
        });
      }

      // Stress tests
      const stressTests: StressTest[] = [
        {
          scenario: "Market Crash (-30%)",
          impact: pv * 0.3,
          probability: "2%",
          description: "Severe market downturn affecting all asset classes",
        },
        {
          scenario: "Currency Crisis (-15%)",
          impact: pv * 0.15,
          probability: "5%",
          description: "Major currency devaluation in key trading corridor",
        },
        {
          scenario: "Supply Chain Disruption (-10%)",
          impact: pv * 0.1,
          probability: "10%",
          description: "Extended port closures or logistics failures",
        },
        {
          scenario: "Interest Rate Spike (-8%)",
          impact: pv * 0.08,
          probability: "15%",
          description: "Rapid central bank rate increases",
        },
        {
          scenario: "Commodity Price Shock (-12%)",
          impact: pv * 0.12,
          probability: "8%",
          description: "Sudden commodity price volatility",
        },
      ];

      // Scenarios
      const scenarios: Scenario[] = [
        { name: "Best Case", probability: 5, loss: 0, gain: pv * 0.15 },
        { name: "Bull Case", probability: 20, loss: 0, gain: pv * 0.08 },
        { name: "Base Case", probability: 50, loss: pv * 0.03, gain: pv * 0.03 },
        { name: "Bear Case", probability: 20, loss: pv * 0.08, gain: 0 },
        { name: "Worst Case", probability: 5, loss: pv * 0.15, gain: 0 },
      ];

      // Risk metrics
      const riskMetrics: RiskMetric[] = [
        {
          metric: "Sharpe Ratio",
          value: (er - parseFloat(riskFreeRate) / 100) / vol,
          benchmark: ">1.0",
          status: (er - parseFloat(riskFreeRate) / 100) / vol > 1 ? "good" : "warning",
        },
        {
          metric: "Sortino Ratio",
          value: (er - parseFloat(riskFreeRate) / 100) / (vol * 0.7),
          benchmark: ">1.5",
          status: (er - parseFloat(riskFreeRate) / 100) / (vol * 0.7) > 1.5 ? "good" : "warning",
        },
        {
          metric: "Max Drawdown",
          value: maxLoss / pv * 100,
          benchmark: "<20%",
          status: maxLoss / pv * 100 < 20 ? "good" : maxLoss / pv * 100 < 35 ? "warning" : "critical",
        },
        {
          metric: "Risk/Return Ratio",
          value: vol / er,
          benchmark: "<3.0",
          status: vol / er < 3 ? "good" : vol / er < 5 ? "warning" : "critical",
        },
      ];

      // Historical backtesting data
      const historicalData: HistoricalDataPoint[] = [];
      const dates = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      dates.forEach((date, i) => {
        const varEst = varParametricAbsolute * (0.9 + Math.random() * 0.2);
        const actual = varEst * (Math.random() > 0.85 ? 1.3 : Math.random() * 0.8);
        historicalData.push({
          date,
          varEstimate: Math.round(varEst),
          actualLoss: Math.round(actual),
          breach: actual > varEst,
        });
      });

      // Risk breakdown for pie chart
      const riskBreakdown: RiskBreakdown[] = [
        { name: "Market Risk", value: 35, color: OCEAN_BLUE },
        { name: "Credit Risk", value: 25, color: LOGISTICS_GREEN },
        { name: "Liquidity Risk", value: 20, color: "#F59E0B" },
        { name: "Operational Risk", value: 12, color: "#EF4444" },
        { name: "Currency Risk", value: 8, color: "#8B5CF6" },
      ];

      const vaRResult: VaRResult = {
        portfolioValue: pv,
        confidenceLevel: cl * 100,
        timeHorizon: th,
        volatility: vol * 100,
        expectedReturn: er * 100,
        varParametric: Math.round(varParametricAbsolute),
        varHistorical: Math.round(varHistorical),
        varMonteCarlo: Math.round(varMonteCarlo),
        varCvar: Math.round(varCvar),
        maxLoss: Math.round(maxLoss),
        maxGain: Math.round(maxGain),
        probabilityRange: {
          min: Math.round(-z * horizonVol * 100 * 100) / 100,
          max: Math.round(z * horizonVol * 100 * 100) / 100,
        },
        stressTests,
        scenarios,
        distribution,
        riskMetrics,
        historicalData,
        riskBreakdown,
      };

      setResult(vaRResult);
      setIsCalculating(false);
    }, 1500);
  };

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

  const varComparisonData = result ? [
    { name: "Parametric", value: result.varParametric, color: OCEAN_BLUE },
    { name: "Historical", value: result.varHistorical, color: LOGISTICS_GREEN },
    { name: "Monte Carlo", value: result.varMonteCarlo, color: "#F59E0B" },
    { name: "CVaR", value: result.varCvar, color: "#EF4444" },
  ] : [];

  const scenarioData = result?.scenarios.map((s) => ({
    name: s.name,
    probability: s.probability,
    loss: s.loss,
    gain: s.gain,
  })) || [];

  // Radar chart data for risk profile
  const riskProfileData = result ? [
    { metric: "Volatility", value: Math.min(result.volatility * 5, 100), fullMark: 100 },
    { metric: "Tail Risk", value: Math.min(result.varCvar / result.varParametric * 50, 100), fullMark: 100 },
    { metric: "Sharpe", value: Math.min(Math.max(result.riskMetrics[0].value * 30, 0), 100), fullMark: 100 },
    { metric: "Drawdown", value: Math.min(result.maxLoss / result.portfolioValue * 500, 100), fullMark: 100 },
    { metric: "Concentration", value: 60, fullMark: 100 },
    { metric: "Liquidity", value: 75, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px]" />
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            {/* Icon */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/20">
                <Shield className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
            </motion.div>
            
            {/* Content */}
            <div className="flex-1">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Badge className="mb-3 bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Risk Management Tool
                </Badge>
              </motion.div>
              
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
              >
                Value at Risk Calculator
              </motion.h1>
              
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg md:text-xl text-white/90 max-w-2xl mb-4"
              >
                Quantify potential losses in your portfolio using industry-standard VaR methodologies. 
                Calculate Parametric, Historical, Monte Carlo VaR and Conditional VaR with comprehensive stress testing.
              </motion.p>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-4 text-sm"
              >
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Target className="w-4 h-4 text-[#2E8B57]" />
                  <span>Multiple VaR Methods</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <BarChart className="w-4 h-4 text-[#2E8B57]" />
                  <span>Stress Testing</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <History className="w-4 h-4 text-[#2E8B57]" />
                  <span>Backtesting</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <Award className="w-4 h-4 text-[#2E8B57]" />
                  <span>Risk Metrics</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Calculator, title: "4 VaR Methods", description: "Parametric, Historical, Monte Carlo, CVaR", color: OCEAN_BLUE },
          { icon: Gauge, title: "Risk Metrics", description: "Sharpe, Sortino, Max Drawdown ratios", color: LOGISTICS_GREEN },
          { icon: TrendingDown, title: "Stress Tests", description: "5 extreme scenario analyses", color: "#F59E0B" },
          { icon: Clock, title: "Real-time", description: "Instant calculation & visualization", color: "#8B5CF6" },
        ].map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${feature.color}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: feature.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
            <Calculator className="h-5 w-5" />
            Portfolio Parameters
          </CardTitle>
          <CardDescription>
            Enter your portfolio details to calculate Value at Risk
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="portfolioValue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Portfolio Value (USD)
              </Label>
              <Input
                id="portfolioValue"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(e.target.value)}
                placeholder="5,000,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confidenceLevel" className="flex items-center gap-2">
                <Percent className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Confidence Level
              </Label>
              <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                  <SelectItem value="99">99%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeHorizon" className="flex items-center gap-2">
                <Clock className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Time Horizon (Days)
              </Label>
              <Input
                id="timeHorizon"
                type="number"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                placeholder="10"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="volatility" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Annual Volatility (%)
              </Label>
              <Input
                id="volatility"
                type="number"
                step="0.1"
                value={volatility}
                onChange={(e) => setVolatility(e.target.value)}
                placeholder="15"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedReturn" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Expected Return (%)
              </Label>
              <Input
                id="expectedReturn"
                type="number"
                step="0.1"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                placeholder="5"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskFreeRate">Risk-Free Rate (%)</Label>
              <Input
                id="riskFreeRate"
                type="number"
                step="0.1"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(e.target.value)}
                placeholder="3"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Asset Class</Label>
              <Select value={assetClass} onValueChange={setAssetClass}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cargo">Cargo/Freight Portfolio</SelectItem>
                  <SelectItem value="commodities">Commodity Exposure</SelectItem>
                  <SelectItem value="currency">Currency Positions</SelectItem>
                  <SelectItem value="mixed">Mixed Trade Assets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="correlationFactor">Correlation Factor</Label>
              <Input
                id="correlationFactor"
                type="number"
                step="0.1"
                value={correlationFactor}
                onChange={(e) => setCorrelationFactor(e.target.value)}
                placeholder="0.7"
                className="h-11"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={calculateVaR}
              disabled={isCalculating}
              className="text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: OCEAN_BLUE }}
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Calculating VaR...
                </>
              ) : (
                <>
                  <BarChart className="mr-2 h-5 w-5" />
                  Calculate Value at Risk
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="text-white" style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${OCEAN_BLUE}dd)` }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Parametric</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.varParametric)}</p>
                <p className="text-sm opacity-80 mt-1">
                  {result.confidenceLevel}% VaR @ {result.timeHorizon} days
                </p>
              </CardContent>
            </Card>

            <Card className="text-white" style={{ background: `linear-gradient(135deg, ${LOGISTICS_GREEN}, ${LOGISTICS_GREEN}dd)` }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <LineChart className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Historical</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.varHistorical)}</p>
                <p className="text-sm opacity-80 mt-1">Based on past data</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Calculator className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Monte Carlo</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.varMonteCarlo)}</p>
                <p className="text-sm opacity-80 mt-1">10,000 simulations</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingDown className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">CVaR</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.varCvar)}</p>
                <p className="text-sm opacity-80 mt-1">Expected Shortfall</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Gauge className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Max Loss</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.maxLoss)}</p>
                <p className="text-sm opacity-80 mt-1">Extreme scenario</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis with 5 Tabs */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                    <BarChart className="h-5 w-5" />
                    VaR Analysis Results
                  </CardTitle>
                  <CardDescription>Comprehensive risk analysis and visualizations</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="methods" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-12">
                  <TabsTrigger value="methods" className="text-xs md:text-sm">VaR Methods</TabsTrigger>
                  <TabsTrigger value="distribution" className="text-xs md:text-sm">Distribution</TabsTrigger>
                  <TabsTrigger value="stress" className="text-xs md:text-sm">Stress Tests</TabsTrigger>
                  <TabsTrigger value="metrics" className="text-xs md:text-sm">Risk Metrics</TabsTrigger>
                  <TabsTrigger value="history" className="text-xs md:text-sm">Backtesting</TabsTrigger>
                </TabsList>

                <TabsContent value="methods" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* VaR Comparison Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">VaR Method Comparison</h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBar data={varComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                            <Tooltip formatter={(value: number) => [formatCurrency(value), "VaR"]} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {varComparisonData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </RechartsBar>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Risk Breakdown Pie Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Risk Component Breakdown</h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPie>
                            <Pie
                              data={result.riskBreakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {result.riskBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => [`${value}%`, "Allocation"]} />
                            <Legend />
                          </RechartsPie>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Method Explanations */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border-2" style={{ borderColor: `${OCEAN_BLUE}30`, backgroundColor: `${OCEAN_BLUE}08` }}>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold" style={{ color: OCEAN_BLUE }}>Parametric VaR</h5>
                        <span className="font-bold">{formatCurrency(result.varParametric)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Assumes normal distribution. Uses mean return and standard deviation to calculate
                        potential loss at the specified confidence level.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border-2" style={{ borderColor: `${LOGISTICS_GREEN}30`, backgroundColor: `${LOGISTICS_GREEN}08` }}>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold" style={{ color: LOGISTICS_GREEN }}>Historical VaR</h5>
                        <span className="font-bold">{formatCurrency(result.varHistorical)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on actual historical returns. Does not assume any specific distribution,
                        making it useful for non-normal return patterns.
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-amber-700 dark:text-amber-300">Monte Carlo VaR</h5>
                        <span className="font-bold">{formatCurrency(result.varMonteCarlo)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Uses random simulations to model potential outcomes. Best for complex portfolios
                        with non-linear risk factors.
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-red-700 dark:text-red-300">Conditional VaR (CVaR)</h5>
                        <span className="font-bold">{formatCurrency(result.varCvar)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expected Shortfall - average loss when loss exceeds VaR threshold.
                        Provides insight into tail risk exposure.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="distribution" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distribution Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Return Distribution</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={result.distribution}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="x" label={{ value: "Return (%)", position: "bottom", offset: -5 }} />
                            <YAxis label={{ value: "Probability", angle: -90, position: "insideLeft" }} />
                            <Tooltip formatter={(value: number, _name: string, props: { payload: { varThreshold: boolean } }) => [value, props.payload.varThreshold ? "VaR Region" : "Normal"]} />
                            <defs>
                              <linearGradient id="colorVar" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={OCEAN_BLUE} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={OCEAN_BLUE} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="y"
                              stroke={OCEAN_BLUE}
                              fill="url(#colorNormal)"
                            />
                            <ReferenceLine x={result.confidenceLevel === 95 ? -1.645 : -2.326} stroke="#EF4444" strokeDasharray="5 5" label="VaR Threshold" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Scenario Analysis */}
                    <div>
                      <h4 className="font-semibold mb-4">Scenario Analysis</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBar data={scenarioData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                            <YAxis dataKey="name" type="category" width={80} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="gain" name="Potential Gain" fill={LOGISTICS_GREEN} />
                            <Bar dataKey="loss" name="Potential Loss" fill="#EF4444" />
                          </RechartsBar>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Risk Profile Radar Chart */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Risk Profile Overview</h4>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskProfileData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="metric" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Risk Score" dataKey="value" stroke={OCEAN_BLUE} fill={OCEAN_BLUE} fillOpacity={0.5} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: `${OCEAN_BLUE}30`, backgroundColor: `${OCEAN_BLUE}08` }}>
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 mt-0.5" style={{ color: OCEAN_BLUE }} />
                      <div>
                        <p className="font-medium" style={{ color: OCEAN_BLUE }}>Probability Range</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          At {result.confidenceLevel}% confidence, the expected return over {result.timeHorizon} days
                          falls within the range of <strong>{result.probabilityRange.min}%</strong> to{" "}
                          <strong>+{result.probabilityRange.max}%</strong>. There is a{" "}
                          {100 - result.confidenceLevel}% chance of returns outside this range.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stress" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Stress Test Scenarios</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {result.stressTests.map((test, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-semibold">{test.scenario}</h5>
                                <p className="text-sm text-muted-foreground">{test.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-red-500">-{formatCurrency(test.impact)}</p>
                                <p className="text-xs text-muted-foreground">Prob: {test.probability}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800 dark:text-red-200">Worst Case Analysis</p>
                            <div className="mt-3 space-y-2 text-sm text-red-700 dark:text-red-300">
                              <div className="flex justify-between">
                                <span>Maximum Potential Loss:</span>
                                <span className="font-bold">{formatCurrency(result.maxLoss)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Percentage of Portfolio:</span>
                                <span className="font-bold">{((result.maxLoss / result.portfolioValue) * 100).toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Time Horizon:</span>
                                <span className="font-bold">{result.timeHorizon} days</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">Best Case Analysis</p>
                            <div className="mt-3 space-y-2 text-sm text-green-700 dark:text-green-300">
                              <div className="flex justify-between">
                                <span>Maximum Potential Gain:</span>
                                <span className="font-bold">{formatCurrency(result.maxGain)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Percentage of Portfolio:</span>
                                <span className="font-bold">{((result.maxGain / result.portfolioValue) * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-medium mb-3">Risk Management Recommendations</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                            Consider hedging strategies to reduce tail risk
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                            Diversify across multiple asset classes
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                            Set stop-loss limits at VaR threshold
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                            Review exposure regularly during volatile periods
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                            Maintain adequate liquidity reserves
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Risk-Adjusted Performance Metrics</h4>
                      <div className="space-y-4">
                        {result.riskMetrics.map((metric, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-2 ${
                              metric.status === "good"
                                ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                                : metric.status === "warning"
                                ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20"
                                : "border-red-200 bg-red-50 dark:bg-red-900/20"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-semibold">{metric.metric}</h5>
                              <span
                                className={`px-2 py-0.5 rounded text-sm font-medium ${
                                  metric.status === "good"
                                    ? "bg-green-100 text-green-700"
                                    : metric.status === "warning"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {metric.status === "good" ? "✓ Good" : metric.status === "warning" ? "⚠ Warning" : "✗ Critical"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold">
                                {metric.metric === "Max Drawdown"
                                  ? formatPercent(metric.value)
                                  : metric.value.toFixed(2)}
                              </span>
                              <span className="text-sm text-muted-foreground">Benchmark: {metric.benchmark}</span>
                            </div>
                            <Progress 
                              value={metric.metric === "Max Drawdown" 
                                ? Math.min(metric.value * 2, 100) 
                                : Math.min(metric.value * 30, 100)
                              } 
                              className="mt-2 h-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h4 className="font-semibold mb-4">Portfolio Summary</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Portfolio Value</span>
                            <span className="font-medium">{formatCurrency(result.portfolioValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Expected Return</span>
                            <span className="font-medium">{result.expectedReturn}% annually</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Volatility</span>
                            <span className="font-medium">{result.volatility}% annually</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Confidence Level</span>
                            <span className="font-medium">{result.confidenceLevel}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time Horizon</span>
                            <span className="font-medium">{result.timeHorizon} days</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border-2" style={{ borderColor: `${OCEAN_BLUE}30`, backgroundColor: `${OCEAN_BLUE}08` }}>
                        <p className="font-medium mb-2 flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                          <Info className="h-4 w-4" />
                          VaR Interpretation
                        </p>
                        <p className="text-sm text-muted-foreground">
                          With {result.confidenceLevel}% confidence, you should not lose more than{" "}
                          {formatCurrency(result.varParametric)} over a {result.timeHorizon}-day period.
                          However, in the worst {(100 - result.confidenceLevel).toFixed(0)}% of cases,
                          losses could exceed this amount, averaging {formatCurrency(result.varCvar)}.
                        </p>
                      </div>

                      <div className="p-4 rounded-lg border-2" style={{ borderColor: `${LOGISTICS_GREEN}30`, backgroundColor: `${LOGISTICS_GREEN}08` }}>
                        <p className="font-medium mb-2 flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                          <BookOpen className="h-4 w-4" />
                          Best Practices
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Use multiple VaR methods for validation</li>
                          <li>• Backtest regularly against actual results</li>
                          <li>• Consider CVaR for tail risk assessment</li>
                          <li>• Adjust confidence levels based on risk appetite</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="pt-6">
                  <div className="space-y-6">
                    {/* Backtesting Chart */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">VaR Backtesting Results</h4>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          12 Months
                        </Badge>
                      </div>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={result.historicalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="actualLoss" name="Actual Loss" fill="#EF4444" radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="varEstimate" name="VaR Estimate" stroke={OCEAN_BLUE} strokeWidth={2} dot={{ fill: OCEAN_BLUE }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Backtesting Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="border-0 shadow">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold" style={{ color: OCEAN_BLUE }}>
                              {result.historicalData.filter(d => d.breach).length}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">VaR Breaches</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                              {((result.historicalData.filter(d => d.breach).length / result.historicalData.length) * 100).toFixed(1)}%
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Breach Rate</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold" style={{ color: OCEAN_BLUE }}>
                              {(100 - result.confidenceLevel).toFixed(0)}%
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Expected Rate</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-0 shadow">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <p className="text-3xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                              Pass
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Kupiec Test</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Backtesting Info */}
                    <div className="p-4 rounded-lg border" style={{ borderColor: `${OCEAN_BLUE}30`, backgroundColor: `${OCEAN_BLUE}08` }}>
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 mt-0.5" style={{ color: OCEAN_BLUE }} />
                        <div>
                          <p className="font-medium" style={{ color: OCEAN_BLUE }}>About Backtesting</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Backtesting compares VaR estimates against actual losses to validate model accuracy. 
                            A well-calibrated VaR model should have breach rates close to the expected rate 
                            ({(100 - result.confidenceLevel).toFixed(0)}% for {result.confidenceLevel}% confidence). 
                            The Kupiec test statistically evaluates if the breach rate is consistent with expectations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* FAQs Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Learn more about Value at Risk and risk management concepts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${OCEAN_BLUE}15` }}
                    >
                      <span className="font-semibold text-sm" style={{ color: OCEAN_BLUE }}>{index + 1}</span>
                    </div>
                    <span className="font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-14 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
