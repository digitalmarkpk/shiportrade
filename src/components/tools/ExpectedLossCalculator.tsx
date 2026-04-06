"use client";

import { useState, useMemo, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Calculator,
  TrendingDown,
  TrendingUp,
  Shield,
  AlertTriangle,
  Info,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
  RefreshCw,
  Download,
  Share2,
  DollarSign,
  Percent,
  Gauge,
  Target,
  Zap,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
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
  ComposedChart,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Types
interface LossParameters {
  probabilityOfLoss: number; // Annual probability (0-1)
  meanSeverity: number; // Mean loss amount
  severityStdDev: number; // Standard deviation
  distributionType: "normal" | "lognormal" | "exponential" | "pareto";
  paretoAlpha?: number; // Shape parameter for Pareto
  numExposures: number; // Number of exposure units
}

interface VaRResult {
  var95: number;
  var99: number;
  cvar95: number;
  cvar99: number;
}

interface TotalCostOfRisk {
  expectedLoss: number;
  riskMargin: number;
  costOfCapital: number;
  adminCosts: number;
  totalCost: number;
}

interface InsuranceComparison {
  premium: number;
  deductible: number;
  coverage: number;
  netBenefit: number;
  transferCost: number;
}

interface RiskRetentionAnalysis {
  retentionLevel: number;
  expectedRetainedLoss: number;
  premiumSavings: number;
  netPosition: number;
  efficiency: number;
}

interface MonteCarloResult {
  losses: number[];
  meanLoss: number;
  stdDev: number;
  percentiles: {
    p5: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
    p99: number;
  };
  distribution: { range: string; count: number; midpoint: number }[];
}

// Distribution functions
const generateNormal = (): number => {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
};

const generateLogNormal = (mean: number, stdDev: number): number => {
  const mu = Math.log(mean ** 2 / Math.sqrt(stdDev ** 2 + mean ** 2));
  const sigma = Math.sqrt(Math.log(1 + stdDev ** 2 / mean ** 2));
  return Math.exp(mu + sigma * generateNormal());
};

const generateExponential = (mean: number): number => {
  return -mean * Math.log(Math.random());
};

const generatePareto = (mean: number, alpha: number): number => {
  const xm = mean * (alpha - 1) / alpha;
  return xm / Math.pow(Math.random(), 1 / alpha);
};

// Z-score lookup for confidence levels
const zScores: Record<number, number> = {
  0.90: 1.282,
  0.95: 1.645,
  0.99: 2.326,
  0.995: 2.576,
};

// Monte Carlo simulation for loss distribution
function runMonteCarloSimulation(
  params: LossParameters,
  numSimulations: number = 10000
): MonteCarloResult {
  const losses: number[] = [];
  
  for (let i = 0; i < numSimulations; i++) {
    let totalLoss = 0;
    
    for (let e = 0; e < params.numExposures; e++) {
      // Determine if loss event occurs
      if (Math.random() < params.probabilityOfLoss) {
        // Generate severity based on distribution
        let severity: number;
        switch (params.distributionType) {
          case "lognormal":
            severity = generateLogNormal(params.meanSeverity, params.severityStdDev);
            break;
          case "exponential":
            severity = generateExponential(params.meanSeverity);
            break;
          case "pareto":
            severity = generatePareto(params.meanSeverity, params.paretoAlpha || 2.5);
            break;
          default: // normal
            severity = Math.max(
              0,
              params.meanSeverity + params.severityStdDev * generateNormal()
            );
        }
        totalLoss += severity;
      }
    }
    losses.push(totalLoss);
  }
  
  losses.sort((a, b) => a - b);
  const meanLoss = losses.reduce((a, b) => a + b, 0) / losses.length;
  const variance = losses.reduce((acc, val) => acc + Math.pow(val - meanLoss, 2), 0) / losses.length;
  const stdDev = Math.sqrt(variance);
  
  // Create distribution bins
  const min = losses[0];
  const max = losses[losses.length - 1];
  const numBins = 25;
  const binWidth = (max - min) / numBins;
  const distribution: { range: string; count: number; midpoint: number }[] = [];
  
  for (let i = 0; i < numBins; i++) {
    const binMin = min + i * binWidth;
    const binMax = min + (i + 1) * binWidth;
    const count = losses.filter((l) => l >= binMin && l < binMax).length;
    distribution.push({
      range: `${formatCurrency(binMin, "USD")} - ${formatCurrency(binMax, "USD")}`,
      count,
      midpoint: (binMin + binMax) / 2,
    });
  }
  
  return {
    losses,
    meanLoss,
    stdDev,
    percentiles: {
      p5: losses[Math.floor(losses.length * 0.05)],
      p25: losses[Math.floor(losses.length * 0.25)],
      p50: losses[Math.floor(losses.length * 0.5)],
      p75: losses[Math.floor(losses.length * 0.75)],
      p95: losses[Math.floor(losses.length * 0.95)],
      p99: losses[Math.floor(losses.length * 0.99)],
    },
    distribution,
  };
}

// Calculate VaR from Monte Carlo results
function calculateVaR(mcResult: MonteCarloResult): VaRResult {
  return {
    var95: mcResult.percentiles.p95,
    var99: mcResult.percentiles.p99,
    cvar95: mcResult.losses.filter((l) => l >= mcResult.percentiles.p95).reduce((a, b) => a + b, 0) / 
            (mcResult.losses.length * 0.05),
    cvar99: mcResult.losses.filter((l) => l >= mcResult.percentiles.p99).reduce((a, b) => a + b, 0) / 
            (mcResult.losses.length * 0.01),
  };
}

// Risk matrix data
const RISK_MATRIX_DATA = [
  { probability: 0.9, severity: 10000, name: "High Freq / Low Sev", color: "#F59E0B" },
  { probability: 0.5, severity: 50000, name: "Medium / Medium", color: "#2E8B57" },
  { probability: 0.1, severity: 100000, name: "Low Freq / High Sev", color: "#0F4C81" },
  { probability: 0.01, severity: 500000, name: "Rare / Catastrophic", color: "#EF4444" },
];

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

export default function ExpectedLossCalculator() {
  // State
  const [currency, setCurrency] = useState("USD");
  const [probabilityOfLoss, setProbabilityOfLoss] = useState("0.15");
  const [meanSeverity, setMeanSeverity] = useState("50000");
  const [severityStdDev, setSeverityStdDev] = useState("25000");
  const [distributionType, setDistributionType] = useState<"normal" | "lognormal" | "exponential" | "pareto">("lognormal");
  const [paretoAlpha, setParetoAlpha] = useState("2.5");
  const [numExposures, setNumExposures] = useState("10");
  const [confidenceLevel, setConfidenceLevel] = useState("95");
  const [riskFreeRate, setRiskFreeRate] = useState("5");
  const [costOfCapital, setCostOfCapital] = useState("12");
  const [adminCostPercent, setAdminCostPercent] = useState("10");
  
  // Insurance parameters
  const [insurancePremium, setInsurancePremium] = useState("15000");
  const [insuranceDeductible, setInsuranceDeductible] = useState("10000");
  const [insuranceCoverage, setInsuranceCoverage] = useState("500000");
  
  // Simulation settings
  const [numSimulations, setNumSimulations] = useState(5000);
  const [runSimulation, setRunSimulation] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Derived parameters
  const params: LossParameters = useMemo(() => ({
    probabilityOfLoss: parseFloat(probabilityOfLoss) || 0,
    meanSeverity: parseFloat(meanSeverity) || 0,
    severityStdDev: parseFloat(severityStdDev) || 0,
    distributionType,
    paretoAlpha: parseFloat(paretoAlpha) || 2.5,
    numExposures: parseInt(numExposures) || 1,
  }), [probabilityOfLoss, meanSeverity, severityStdDev, distributionType, paretoAlpha, numExposures]);
  
  // Expected Loss calculation
  const expectedLoss = useMemo(() => {
    return params.probabilityOfLoss * params.meanSeverity * params.numExposures;
  }, [params]);
  
  // Monte Carlo simulation
  const mcResult = useMemo(() => {
    return runMonteCarloSimulation(params, numSimulations);
  }, [params, numSimulations, runSimulation]);
  
  // VaR calculation
  const varResult = useMemo(() => calculateVaR(mcResult), [mcResult]);
  
  // Total Cost of Risk
  const totalCostOfRisk = useMemo<TotalCostOfRisk>(() => {
    const el = expectedLoss;
    const riskMargin = varResult.cvar95 - el;
    const coc = (el + riskMargin * 0.5) * (parseFloat(costOfCapital) / 100);
    const admin = el * (parseFloat(adminCostPercent) / 100);
    return {
      expectedLoss: el,
      riskMargin,
      costOfCapital: coc,
      adminCosts: admin,
      totalCost: el + riskMargin + coc + admin,
    };
  }, [expectedLoss, varResult, costOfCapital, adminCostPercent]);
  
  // Insurance comparison
  const insuranceAnalysis = useMemo<InsuranceComparison>(() => {
    const premium = parseFloat(insurancePremium) || 0;
    const deductible = parseFloat(insuranceDeductible) || 0;
    const coverage = parseFloat(insuranceCoverage) || 0;
    
    const expectedClaim = Math.max(0, expectedLoss - deductible * params.probabilityOfLoss);
    const netBenefit = expectedClaim - premium;
    const transferCost = premium - expectedClaim;
    
    return {
      premium,
      deductible,
      coverage,
      netBenefit,
      transferCost,
    };
  }, [expectedLoss, insurancePremium, insuranceDeductible, insuranceCoverage, params]);
  
  // Risk retention analysis
  const retentionAnalysis = useMemo<RiskRetentionAnalysis[]>(() => {
    const retentionLevels = [0, 5000, 10000, 25000, 50000, 100000];
    
    return retentionLevels.map((level) => {
      const expectedRetainedLoss = Math.min(expectedLoss, level + (expectedLoss - level) * 0.1);
      const premiumSavings = level > 0 ? expectedLoss * 0.15 * (level / 50000) : 0;
      const netPosition = expectedRetainedLoss - premiumSavings;
      const efficiency = premiumSavings > 0 ? (premiumSavings / expectedRetainedLoss) * 100 : 0;
      
      return {
        retentionLevel: level,
        expectedRetainedLoss,
        premiumSavings,
        netPosition,
        efficiency,
      };
    });
  }, [expectedLoss]);
  
  // Sensitivity analysis
  const sensitivityData = useMemo(() => {
    const baseEL = expectedLoss;
    const variations = [
      { param: "Probability +50%", value: baseEL * 1.5 },
      { param: "Probability -50%", value: baseEL * 0.5 },
      { param: "Severity +25%", value: params.probabilityOfLoss * params.meanSeverity * 1.25 * params.numExposures },
      { param: "Severity -25%", value: params.probabilityOfLoss * params.meanSeverity * 0.75 * params.numExposures },
      { param: "Exposures +100%", value: baseEL * 2 },
      { param: "Exposures -50%", value: baseEL * 0.5 },
    ];
    
    return variations.map((v) => ({
      ...v,
      change: ((v.value - baseEL) / baseEL) * 100,
    }));
  }, [expectedLoss, params]);
  
  // Cost breakdown for pie chart
  const costBreakdownData = [
    { name: "Expected Loss", value: totalCostOfRisk.expectedLoss, color: "#0F4C81" },
    { name: "Risk Margin", value: Math.max(0, totalCostOfRisk.riskMargin), color: "#F59E0B" },
    { name: "Cost of Capital", value: totalCostOfRisk.costOfCapital, color: "#2E8B57" },
    { name: "Admin Costs", value: totalCostOfRisk.adminCosts, color: "#8B5CF6" },
  ];
  
  const rerunSimulation = useCallback(() => {
    setRunSimulation((prev) => !prev);
  }, []);
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="var">VaR Analysis</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
        </TabsList>
        
        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                  Loss Parameters
                </CardTitle>
                <CardDescription>
                  Configure loss frequency and severity parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency Selection */}
                <div className="flex items-center gap-4">
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
                
                <Separator />
                
                {/* Loss Frequency */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-[var(--logistics)]" />
                    Loss Frequency
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="probability">Probability of Loss (Annual)</Label>
                      <div className="relative">
                        <Input
                          id="probability"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={probabilityOfLoss}
                          onChange={(e) => setProbabilityOfLoss(e.target.value)}
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          ({(parseFloat(probabilityOfLoss) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Annual probability of loss occurrence (0-1)
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="exposures">Number of Exposures</Label>
                      <Input
                        id="exposures"
                        type="number"
                        min="1"
                        value={numExposures}
                        onChange={(e) => setNumExposures(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Independent exposure units
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Severity Distribution */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[var(--ocean)]" />
                    Severity Distribution
                  </h4>
                  
                  <div className="space-y-2">
                    <Label>Distribution Type</Label>
                    <Select value={distributionType} onValueChange={(v) => setDistributionType(v as typeof distributionType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal (Gaussian)</SelectItem>
                        <SelectItem value="lognormal">Log-Normal</SelectItem>
                        <SelectItem value="exponential">Exponential</SelectItem>
                        <SelectItem value="pareto">Pareto (Heavy Tail)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meanSeverity">Mean Severity</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="meanSeverity"
                          type="number"
                          value={meanSeverity}
                          onChange={(e) => setMeanSeverity(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stdDev">Standard Deviation</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="stdDev"
                          type="number"
                          value={severityStdDev}
                          onChange={(e) => setSeverityStdDev(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {distributionType === "pareto" && (
                    <div className="space-y-2">
                      <Label htmlFor="paretoAlpha">Pareto Shape (α)</Label>
                      <Input
                        id="paretoAlpha"
                        type="number"
                        step="0.1"
                        min="1.1"
                        value={paretoAlpha}
                        onChange={(e) => setParetoAlpha(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower α = heavier tail. Typical: 2-3 for insurance losses
                      </p>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Cost Parameters */}
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-[var(--logistics)]" />
                    Cost Parameters
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="costOfCapital">Cost of Capital (%)</Label>
                      <Input
                        id="costOfCapital"
                        type="number"
                        step="0.5"
                        value={costOfCapital}
                        onChange={(e) => setCostOfCapital(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adminCost">Admin Costs (%)</Label>
                      <Input
                        id="adminCost"
                        type="number"
                        step="1"
                        value={adminCostPercent}
                        onChange={(e) => setAdminCostPercent(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Results Card */}
            <div className="space-y-6">
              {/* Expected Loss Result */}
              <Card className="border-[var(--ocean)]/20 bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[var(--ocean)]" />
                    Expected Loss Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-4">
                    <motion.div
                      key={expectedLoss}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-bold text-[var(--ocean)]"
                    >
                      {formatCurrency(expectedLoss, currency)}
                    </motion.div>
                    <p className="text-muted-foreground mt-2">Annual Expected Loss</p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Formula:</span>
                      <span className="font-mono">EL = P × S × N</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Probability (P):</span>
                      <span>{(params.probabilityOfLoss * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mean Severity (S):</span>
                      <span>{formatCurrency(params.meanSeverity, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exposures (N):</span>
                      <span>{params.numExposures}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-[var(--ocean)]/10 rounded-lg">
                      <div className="text-lg font-semibold text-[var(--ocean)]">
                        {(params.probabilityOfLoss * params.numExposures).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">Expected Events/Year</div>
                    </div>
                    <div className="text-center p-3 bg-[var(--logistics)]/10 rounded-lg">
                      <div className="text-lg font-semibold text-[var(--logistics)]">
                        {formatCurrency(params.meanSeverity, currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg. Loss per Event</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Total Cost of Risk */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-[var(--logistics)]" />
                    Total Cost of Risk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#0F4C81]" />
                        <span>Expected Loss</span>
                      </div>
                      <span className="font-medium">{formatCurrency(totalCostOfRisk.expectedLoss, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                        <span>Risk Margin</span>
                      </div>
                      <span className="font-medium">{formatCurrency(Math.max(0, totalCostOfRisk.riskMargin), currency)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#2E8B57]" />
                        <span>Cost of Capital</span>
                      </div>
                      <span className="font-medium">{formatCurrency(totalCostOfRisk.costOfCapital, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
                        <span>Admin Costs</span>
                      </div>
                      <span className="font-medium">{formatCurrency(totalCostOfRisk.adminCosts, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-[var(--ocean)]/10 rounded-lg px-3 mt-2">
                      <span className="font-semibold">Total Cost of Risk</span>
                      <span className="font-bold text-[var(--ocean)] text-lg">
                        {formatCurrency(totalCostOfRisk.totalCost, currency)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData.filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Sensitivity Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                Sensitivity Analysis
              </CardTitle>
              <CardDescription>Impact of parameter changes on expected loss</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sensitivityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                    <YAxis dataKey="param" type="category" width={140} />
                    <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    <ReferenceLine x={expectedLoss} stroke="#EF4444" strokeDasharray="5 5" label="Base EL" />
                    <Bar dataKey="value" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* VaR Analysis Tab */}
        <TabsContent value="var" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* VaR Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                  VaR Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Confidence Level</Label>
                  <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                      <SelectItem value="99">99%</SelectItem>
                      <SelectItem value="99.5">99.5%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Number of Simulations</Label>
                  <Select value={numSimulations.toString()} onValueChange={(v) => setNumSimulations(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">1,000 (Fast)</SelectItem>
                      <SelectItem value="5000">5,000 (Standard)</SelectItem>
                      <SelectItem value="10000">10,000 (Recommended)</SelectItem>
                      <SelectItem value="50000">50,000 (High Precision)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={rerunSimulation} className="w-full gradient-ocean">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Simulation
                </Button>
              </CardContent>
            </Card>
            
            {/* VaR Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-[var(--logistics)]" />
                  VaR Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">VaR (95%)</p>
                    <p className="text-2xl font-bold text-[var(--ocean)]">
                      {formatCurrency(varResult.var95, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">5% chance of exceeding</p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">VaR (99%)</p>
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(varResult.var99, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">1% chance of exceeding</p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">CVaR (95%)</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {formatCurrency(varResult.cvar95, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Expected Shortfall</p>
                  </div>
                  <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">CVaR (99%)</p>
                    <p className="text-2xl font-bold text-[var(--logistics)]">
                      {formatCurrency(varResult.cvar99, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Tail Expected Loss</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mean Annual Loss:</span>
                    <span className="font-medium">{formatCurrency(mcResult.meanLoss, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Standard Deviation:</span>
                    <span className="font-medium">{formatCurrency(mcResult.stdDev, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Loss Ratio (VaR/EL):</span>
                    <span className="font-medium">{(varResult.var95 / expectedLoss).toFixed(2)}x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Loss Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Simulated Loss Distribution</CardTitle>
              <CardDescription>Monte Carlo simulation results ({numSimulations.toLocaleString()} runs)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mcResult.distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="midpoint" tickFormatter={(v) => formatCurrency(v, currency)} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value} simulations`, "Count"]}
                      labelFormatter={(label) => `Loss: ${formatCurrency(label as number, currency)}`}
                    />
                    <Area type="monotone" dataKey="count" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.4} />
                    <ReferenceLine x={varResult.var95} stroke="#EF4444" strokeDasharray="5 5" label="VaR 95%" />
                    <ReferenceLine x={expectedLoss} stroke="#2E8B57" strokeDasharray="5 5" label="Expected Loss" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-muted-foreground">5th Pctl</p>
                  <p className="font-bold">{formatCurrency(mcResult.percentiles.p5, currency)}</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-muted-foreground">25th Pctl</p>
                  <p className="font-bold">{formatCurrency(mcResult.percentiles.p25, currency)}</p>
                </div>
                <div className="p-2 bg-[var(--ocean)]/10 rounded">
                  <p className="text-muted-foreground">Median</p>
                  <p className="font-bold text-[var(--ocean)]">{formatCurrency(mcResult.percentiles.p50, currency)}</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="text-muted-foreground">75th Pctl</p>
                  <p className="font-bold">{formatCurrency(mcResult.percentiles.p75, currency)}</p>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <p className="text-muted-foreground">95th Pctl</p>
                  <p className="font-bold text-red-600">{formatCurrency(mcResult.percentiles.p95, currency)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Risk Matrix */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Risk Matrix: Probability vs Severity
              </CardTitle>
              <CardDescription>Visualizing your risk position relative to common risk categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      type="number" 
                      dataKey="probability" 
                      name="Probability" 
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                      label={{ value: "Probability of Occurrence", position: "bottom", offset: 40 }}
                      domain={[0, 1]}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="severity" 
                      name="Severity" 
                      tickFormatter={(v) => formatCurrency(v, currency)}
                      label={{ value: "Severity (Loss Amount)", angle: -90, position: "insideLeft" }}
                    />
                    <ZAxis range={[100, 400]} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === "probability" ? `${(value * 100).toFixed(1)}%` : formatCurrency(value, currency),
                        name === "probability" ? "Probability" : "Severity"
                      ]}
                    />
                    <Scatter name="Risk Categories" data={RISK_MATRIX_DATA} fill="#8884d8">
                      {RISK_MATRIX_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Scatter>
                    <Scatter 
                      name="Your Risk" 
                      data={[{ 
                        probability: params.probabilityOfLoss, 
                        severity: params.meanSeverity, 
                        name: "Current Risk" 
                      }]} 
                      fill="#EF4444"
                      shape="star"
                    />
                    <ReferenceLine y={params.meanSeverity} stroke="#EF4444" strokeDasharray="3 3" />
                    <ReferenceLine x={params.probabilityOfLoss} stroke="#EF4444" strokeDasharray="3 3" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                {RISK_MATRIX_DATA.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Insurance Comparison Tab */}
        <TabsContent value="insurance" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Insurance Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--logistics)]" />
                  Insurance Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="insurancePremium">Annual Premium</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="insurancePremium"
                      type="number"
                      value={insurancePremium}
                      onChange={(e) => setInsurancePremium(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insuranceDeductible">Deductible per Claim</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="insuranceDeductible"
                      type="number"
                      value={insuranceDeductible}
                      onChange={(e) => setInsuranceDeductible(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insuranceCoverage">Coverage Limit</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="insuranceCoverage"
                      type="number"
                      value={insuranceCoverage}
                      onChange={(e) => setInsuranceCoverage(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Insurance Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[var(--ocean)]" />
                  Insurance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Expected Claims</p>
                    <p className="text-2xl font-bold text-[var(--logistics)]">
                      {formatCurrency(Math.max(0, expectedLoss - insuranceAnalysis.deductible * params.probabilityOfLoss), currency)}
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Net Benefit</p>
                    <p className={`text-2xl font-bold ${insuranceAnalysis.netBenefit >= 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                      {formatCurrency(insuranceAnalysis.netBenefit, currency)}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Premium Paid:</span>
                    <span className="font-medium">{formatCurrency(insuranceAnalysis.premium, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Deductible Exposure:</span>
                    <span className="font-medium">{formatCurrency(insuranceAnalysis.deductible * params.probabilityOfLoss, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coverage Limit:</span>
                    <span className="font-medium">{formatCurrency(insuranceAnalysis.coverage, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transfer Cost:</span>
                    <span className={`font-medium ${insuranceAnalysis.transferCost > 0 ? 'text-red-500' : 'text-[var(--logistics)]'}`}>
                      {formatCurrency(insuranceAnalysis.transferCost, currency)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Insurance Efficiency Ratio</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-muted rounded-full h-3">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)]"
                        style={{ width: `${Math.min(100, (expectedLoss / insuranceAnalysis.premium) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {((expectedLoss / insuranceAnalysis.premium) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {expectedLoss > insuranceAnalysis.premium 
                      ? "Expected loss exceeds premium - insurance appears favorable"
                      : "Premium exceeds expected loss - paying for risk transfer"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Transfer vs Retention Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={[
                    { name: "No Insurance", loss: expectedLoss, premium: 0 },
                    { name: "With Insurance", loss: insuranceAnalysis.deductible * params.probabilityOfLoss, premium: insuranceAnalysis.premium },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                    <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    <Legend />
                    <Bar dataKey="loss" name="Retained Loss" fill="#EF4444" />
                    <Bar dataKey="premium" name="Premium Paid" fill="#0F4C81" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Without Insurance</p>
                  <p className="text-xl font-bold">{formatCurrency(expectedLoss, currency)}</p>
                  <p className="text-xs text-muted-foreground">Full risk exposure</p>
                </div>
                <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">With Insurance</p>
                  <p className="text-xl font-bold text-[var(--ocean)]">
                    {formatCurrency(insuranceAnalysis.premium + insuranceAnalysis.deductible * params.probabilityOfLoss, currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">Premium + Deductible exposure</p>
                </div>
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Net Difference</p>
                  <p className={`text-xl font-bold ${expectedLoss - insuranceAnalysis.premium > 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                    {formatCurrency(expectedLoss - insuranceAnalysis.premium - insuranceAnalysis.deductible * params.probabilityOfLoss, currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {expectedLoss - insuranceAnalysis.premium > 0 ? 'Insurance favorable' : 'Retention favorable'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Risk Retention Tab */}
        <TabsContent value="retention" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Risk Retention Analysis
              </CardTitle>
              <CardDescription>
                Optimize your risk retention level to balance premium savings vs retained losses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={retentionAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="retentionLevel" 
                      tickFormatter={(v) => formatCurrency(v, currency)}
                      label={{ value: "Retention Level", position: "bottom", offset: -5 }}
                    />
                    <YAxis 
                      tickFormatter={(v) => formatCurrency(v, currency)}
                      label={{ value: "Amount", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    <Legend />
                    <Bar dataKey="expectedRetainedLoss" name="Retained Loss" fill="#EF4444" />
                    <Bar dataKey="premiumSavings" name="Premium Savings" fill="#2E8B57" />
                    <Line type="monotone" dataKey="netPosition" name="Net Position" stroke="#0F4C81" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Retention Level</th>
                      <th className="text-right py-2 px-3">Expected Retained Loss</th>
                      <th className="text-right py-2 px-3">Premium Savings</th>
                      <th className="text-right py-2 px-3">Net Position</th>
                      <th className="text-right py-2 px-3">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {retentionAnalysis.map((row, i) => (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-3 font-medium">{formatCurrency(row.retentionLevel, currency)}</td>
                        <td className="text-right py-2 px-3">{formatCurrency(row.expectedRetainedLoss, currency)}</td>
                        <td className="text-right py-2 px-3 text-[var(--logistics)]">+{formatCurrency(row.premiumSavings, currency)}</td>
                        <td className={`text-right py-2 px-3 font-medium ${row.netPosition < expectedLoss ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                          {formatCurrency(row.netPosition, currency)}
                        </td>
                        <td className="text-right py-2 px-3">{row.efficiency.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {/* Retention Recommendation */}
          <Card className="bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Retention Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-[var(--ocean)] mb-2">Conservative</h4>
                  <p className="text-2xl font-bold">{formatCurrency(0, currency)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Full transfer. Best for risk-averse organizations or when premium is affordable.
                  </p>
                </div>
                <div className="p-4 bg-[var(--ocean)]/10 rounded-lg border-2 border-[var(--ocean)]">
                  <h4 className="font-medium text-[var(--ocean)] mb-2">Recommended</h4>
                  <p className="text-2xl font-bold text-[var(--ocean)]">
                    {formatCurrency(Math.min(...retentionAnalysis.map(r => r.netPosition)) !== retentionAnalysis[0].netPosition 
                      ? retentionAnalysis.find(r => r.netPosition === Math.min(...retentionAnalysis.map(r => r.netPosition)))?.retentionLevel || 0
                      : 0, currency)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Optimal balance between premium savings and retained risk.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-amber-500 mb-2">Aggressive</h4>
                  <p className="text-2xl font-bold">{formatCurrency(100000, currency)}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    High retention. Best for financially strong organizations with risk appetite.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-700 dark:text-yellow-300">
                    <p className="font-medium">Important Considerations</p>
                    <ul className="mt-2 space-y-1">
                      <li>• Consider your organization&apos;s risk appetite and financial strength</li>
                      <li>• Higher retention may reduce premiums but increases volatility</li>
                      <li>• Ensure adequate reserves for retained losses</li>
                      <li>• Review retention strategy annually based on claims experience</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Monte Carlo Simulation Tab */}
        <TabsContent value="simulation" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-[var(--ocean)]" />
                Monte Carlo Simulation Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Number of Simulations</Label>
                  <Select value={numSimulations.toString()} onValueChange={(v) => setNumSimulations(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000">1,000 (Fast)</SelectItem>
                      <SelectItem value="5000">5,000 (Standard)</SelectItem>
                      <SelectItem value="10000">10,000 (Recommended)</SelectItem>
                      <SelectItem value="50000">50,000 (High Precision)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Distribution Type</Label>
                  <Select value={distributionType} onValueChange={(v) => setDistributionType(v as typeof distributionType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (Gaussian)</SelectItem>
                      <SelectItem value="lognormal">Log-Normal</SelectItem>
                      <SelectItem value="exponential">Exponential</SelectItem>
                      <SelectItem value="pareto">Pareto (Heavy Tail)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={rerunSimulation} className="w-full gradient-ocean">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Mean Loss</p>
                    <p className="text-xl font-bold">{formatCurrency(mcResult.meanLoss, currency)}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Std Deviation</p>
                    <p className="text-xl font-bold">{formatCurrency(mcResult.stdDev, currency)}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Minimum</p>
                    <p className="text-xl font-bold">{formatCurrency(mcResult.percentiles.p5, currency)}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Maximum</p>
                    <p className="text-xl font-bold">{formatCurrency(mcResult.percentiles.p99, currency)}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Coefficient of Variation:</span>
                    <span className="font-medium">{((mcResult.stdDev / mcResult.meanLoss) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Skewness:</span>
                    <span className="font-medium">{distributionType === "pareto" ? "Heavy right tail" : distributionType === "lognormal" ? "Moderate right skew" : "Symmetric"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Simulations Run:</span>
                    <span className="font-medium">{numSimulations.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Percentile Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={[
                        { percentile: "5th", value: mcResult.percentiles.p5 },
                        { percentile: "25th", value: mcResult.percentiles.p25 },
                        { percentile: "50th", value: mcResult.percentiles.p50 },
                        { percentile: "75th", value: mcResult.percentiles.p75 },
                        { percentile: "95th", value: mcResult.percentiles.p95 },
                        { percentile: "99th", value: mcResult.percentiles.p99 },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis dataKey="percentile" type="category" width={50} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Bar dataKey="value" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Distribution Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution Comparison</CardTitle>
              <CardDescription>
                How different severity distributions affect the loss profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {["normal", "lognormal", "exponential", "pareto"].map((dist) => {
                  const testParams = { ...params, distributionType: dist as typeof distributionType };
                  const testResult = runMonteCarloSimulation(testParams, 5000);
                  return (
                    <div 
                      key={dist} 
                      className={`p-4 rounded-lg border-2 transition-all ${
                        distributionType === dist 
                          ? 'border-[var(--ocean)] bg-[var(--ocean)]/5' 
                          : 'border-muted'
                      }`}
                    >
                      <h4 className="font-medium capitalize mb-2">{dist}</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mean:</span>
                          <span className="font-medium">{formatCurrency(testResult.meanLoss, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">VaR 95%:</span>
                          <span className="font-medium">{formatCurrency(testResult.percentiles.p95, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CVaR 95%:</span>
                          <span className="font-medium">{formatCurrency(
                            testResult.losses.filter((l) => l >= testResult.percentiles.p95).reduce((a, b) => a + b, 0) / 
                            (testResult.losses.length * 0.05), currency
                          )}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium">About Severity Distributions</p>
                    <ul className="mt-2 space-y-1">
                      <li><strong>Normal:</strong> Symmetric distribution, good for moderate severity losses</li>
                      <li><strong>Log-Normal:</strong> Right-skewed, common for insurance losses (always positive)</li>
                      <li><strong>Exponential:</strong> Memoryless property, good for time-between-events</li>
                      <li><strong>Pareto:</strong> Heavy tail, best for catastrophic losses with extreme outliers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
