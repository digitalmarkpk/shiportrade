"use client";

import { useState, useMemo } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  BarChart3,
  Calculator,
  ChartLine,
  Clock,
  DollarSign,
  Download,
  Info,
  LineChart,
  Package,
  Percent,
  Play,
  RefreshCw,
  Share2,
  Shield,
  TrendingDown,
  TrendingUp,
  Zap,
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
  Legend,
  ComposedChart,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

interface StockoutResult {
  stockoutProbability: number;
  expectedStockoutUnits: number;
  fillRate: number;
  serviceLevel: number;
  zScore: number;
  safetyStock: number;
  demandDuringLeadTime: number;
  stdDevDuringLeadTime: number;
  daysOfStock: number;
  daysToStockout: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  inventoryStatus: "surplus" | "adequate" | "low" | "critical";
  stockoutCost: number;
  holdingCost: number;
  totalCost: number;
}

// Z-score lookup table for service levels
const serviceLevelZScores: { level: number; zScore: number }[] = [
  { level: 50, zScore: 0.00 },
  { level: 60, zScore: 0.25 },
  { level: 70, zScore: 0.52 },
  { level: 75, zScore: 0.67 },
  { level: 80, zScore: 0.84 },
  { level: 85, zScore: 1.04 },
  { level: 90, zScore: 1.28 },
  { level: 92, zScore: 1.41 },
  { level: 94, zScore: 1.55 },
  { level: 95, zScore: 1.65 },
  { level: 96, zScore: 1.75 },
  { level: 97, zScore: 1.88 },
  { level: 97.5, zScore: 1.96 },
  { level: 98, zScore: 2.05 },
  { level: 98.5, zScore: 2.17 },
  { level: 99, zScore: 2.33 },
  { level: 99.5, zScore: 2.58 },
  { level: 99.9, zScore: 3.09 },
];

// Standard normal CDF
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

// Inverse normal CDF (quantile function)
function inverseNormalCDF(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;

  // Rational approximation for lower region
  const q = Math.min(p, 1 - p);
  let u, t;

  if (q > 0.02425) {
    // Rational approximation for central region
    t = q - 0.5;
    u = t * t;
    return t * ((((((((0.0001244508 * u + -0.001073238) * u + 0.005198776) * u + -0.019198352) * u + 0.059054046) * u + -0.151012933) * u + 0.31915293) * u + -0.53192355) * u + 0.79788487);
  } else {
    // Rational approximation for tail region
    u = Math.sqrt(-2 * Math.log(q));
    t = ((((((((0.0001244508 * u + -0.001073238) * u + 0.005198776) * u + -0.019198352) * u + 0.059054046) * u + -0.151012933) * u + 0.31915293) * u + -0.53192355) * u + 0.79788487);
    return p > 0.5 ? u / t : -u / t;
  }
}

// Unit normal loss function for fill rate calculation
function unitNormalLoss(z: number): number {
  const phi = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  return phi - z * (1 - normalCDF(z));
}

// Get Z-score for a given service level
function getZScoreForServiceLevel(serviceLevel: number): number {
  if (serviceLevel <= 50) return 0;
  if (serviceLevel >= 99.9) return 3.09;

  for (let i = 0; i < serviceLevelZScores.length - 1; i++) {
    if (serviceLevelZScores[i].level <= serviceLevel && serviceLevelZScores[i + 1].level >= serviceLevel) {
      const range = serviceLevelZScores[i + 1].level - serviceLevelZScores[i].level;
      const zRange = serviceLevelZScores[i + 1].zScore - serviceLevelZScores[i].zScore;
      const fraction = (serviceLevel - serviceLevelZScores[i].level) / range;
      return serviceLevelZScores[i].zScore + (zRange * fraction);
    }
  }
  return 2.33;
}

// Get service level for a given Z-score
function getServiceLevelForZScore(z: number): number {
  if (z <= 0) return 50;
  if (z >= 3.09) return 99.9;

  for (let i = 0; i < serviceLevelZScores.length - 1; i++) {
    if (serviceLevelZScores[i].zScore <= z && serviceLevelZScores[i + 1].zScore >= z) {
      const range = serviceLevelZScores[i + 1].zScore - serviceLevelZScores[i].zScore;
      const slRange = serviceLevelZScores[i + 1].level - serviceLevelZScores[i].level;
      const fraction = (z - serviceLevelZScores[i].zScore) / range;
      return serviceLevelZScores[i].level + (slRange * fraction);
    }
  }
  return 99;
}

export function StockoutProbabilityModel() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");

  // Input parameters
  const [demandMean, setDemandMean] = useState<string>("100");
  const [demandStdDev, setDemandStdDev] = useState<string>("25");
  const [leadTimeMean, setLeadTimeMean] = useState<string>("7");
  const [leadTimeStdDev, setLeadTimeStdDev] = useState<string>("2");
  const [currentInventory, setCurrentInventory] = useState<string>("800");
  const [safetyStock, setSafetyStock] = useState<string>("200");
  const [unitCost, setUnitCost] = useState<string>("50");
  const [stockoutCostPerUnit, setStockoutCostPerUnit] = useState<string>("25");
  const [holdingCostRate, setHoldingCostRate] = useState<number>(25);
  const [targetServiceLevel, setTargetServiceLevel] = useState<number>(95);
  const [useCalculatedSafetyStock, setUseCalculatedSafetyStock] = useState(false);

  // Calculate results
  const result = useMemo<StockoutResult>(() => {
    const d = parseFloat(demandMean) || 0;
    const sigmaD = parseFloat(demandStdDev) || 0;
    const LT = parseFloat(leadTimeMean) || 0;
    const sigmaLT = parseFloat(leadTimeStdDev) || 0;
    const inv = parseFloat(currentInventory) || 0;
    const ss = useCalculatedSafetyStock
      ? getZScoreForServiceLevel(targetServiceLevel) * Math.sqrt(LT * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2))
      : (parseFloat(safetyStock) || 0);
    const C = parseFloat(unitCost) || 0;
    const b = parseFloat(stockoutCostPerUnit) || 0;
    const h = holdingCostRate / 100;

    // Demand during lead time
    const demandDuringLT = d * LT;

    // Standard deviation of demand during lead time
    const sigmaDLT = Math.sqrt(LT * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2));

    // Reorder point (demand during lead time + safety stock)
    const reorderPoint = demandDuringLT + ss;

    // Z-score based on current inventory level relative to demand during lead time
    // If inventory is below demand during lead time, we're at risk
    const inventoryAboveDemand = Math.max(0, inv - demandDuringLT);

    // Z-score calculation: how many standard deviations above mean demand we have
    const z = sigmaDLT > 0 ? inventoryAboveDemand / sigmaDLT : 0;

    // Stockout probability = P(Demand > Inventory during lead time)
    // = 1 - CDF(z)
    const stockoutProbability = Math.max(0, Math.min(100, (1 - normalCDF(z)) * 100));

    // Service level achieved (probability of no stockout)
    const serviceLevel = Math.max(0, Math.min(100, normalCDF(z) * 100));

    // Expected stockout units (using unit normal loss function)
    const L_z = unitNormalLoss(z);
    const expectedStockoutUnits = sigmaDLT * L_z;

    // Fill rate calculation
    const fillRate = demandDuringLT > 0 ? Math.max(0, Math.min(100, (1 - expectedStockoutUnits / demandDuringLT) * 100)) : 100;

    // Days of stock remaining
    const daysOfStock = d > 0 ? inv / d : Infinity;

    // Days until stockout (considering safety stock)
    const daysToStockout = d > 0 ? (inv - ss) / d : Infinity;

    // Risk level assessment
    let riskLevel: "low" | "medium" | "high" | "critical";
    if (stockoutProbability < 5) {
      riskLevel = "low";
    } else if (stockoutProbability < 15) {
      riskLevel = "medium";
    } else if (stockoutProbability < 30) {
      riskLevel = "high";
    } else {
      riskLevel = "critical";
    }

    // Inventory status
    let inventoryStatus: "surplus" | "adequate" | "low" | "critical";
    if (inv > reorderPoint * 1.5) {
      inventoryStatus = "surplus";
    } else if (inv >= reorderPoint) {
      inventoryStatus = "adequate";
    } else if (inv >= demandDuringLT) {
      inventoryStatus = "low";
    } else {
      inventoryStatus = "critical";
    }

    // Cost calculations
    const stockoutCost = expectedStockoutUnits * b;
    const holdingCost = inv * C * h;
    const totalCost = stockoutCost + holdingCost;

    return {
      stockoutProbability: parseFloat(stockoutProbability.toFixed(2)),
      expectedStockoutUnits: parseFloat(expectedStockoutUnits.toFixed(2)),
      fillRate: parseFloat(fillRate.toFixed(2)),
      serviceLevel: parseFloat(serviceLevel.toFixed(2)),
      zScore: parseFloat(z.toFixed(2)),
      safetyStock: Math.round(ss),
      demandDuringLeadTime: Math.round(demandDuringLT),
      stdDevDuringLeadTime: parseFloat(sigmaDLT.toFixed(2)),
      daysOfStock: parseFloat(daysOfStock.toFixed(1)),
      daysToStockout: parseFloat(Math.max(0, daysToStockout).toFixed(1)),
      riskLevel,
      inventoryStatus,
      stockoutCost,
      holdingCost: holdingCost / 12, // Monthly holding cost
      totalCost,
    };
  }, [demandMean, demandStdDev, leadTimeMean, leadTimeStdDev, currentInventory, safetyStock, unitCost, stockoutCostPerUnit, holdingCostRate, targetServiceLevel, useCalculatedSafetyStock]);

  // Probability distribution data
  const probabilityDistributionData = useMemo(() => {
    const mean = result.demandDuringLeadTime;
    const stdDev = result.stdDevDuringLeadTime;
    const inv = parseFloat(currentInventory) || 0;

    if (stdDev <= 0) return [];

    const data = [];
    const minVal = Math.max(0, mean - 4 * stdDev);
    const maxVal = mean + 4 * stdDev;
    const step = (maxVal - minVal) / 80;

    for (let x = minVal; x <= maxVal; x += step) {
      const z = (x - mean) / stdDev;
      const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
      const isStockout = x > inv;

      data.push({
        demand: Math.round(x),
        probability: pdf,
        isStockout,
        fillOpacity: isStockout ? 1 : 0.3,
      });
    }
    return data;
  }, [result.demandDuringLeadTime, result.stdDevDuringLeadTime, currentInventory]);

  // Inventory depletion curve
  const inventoryDepletionData = useMemo(() => {
    const d = parseFloat(demandMean) || 0;
    const inv = parseFloat(currentInventory) || 0;
    const ss = result.safetyStock;
    const lt = parseFloat(leadTimeMean) || 0;

    if (d <= 0) return [];

    const data = [];
    const days = Math.ceil(Math.max(inv / d + 10, 30));

    for (let day = 0; day <= days; day++) {
      const avgInventory = Math.max(0, inv - d * day);
      const highDemand = Math.max(0, inv - (d + parseFloat(demandStdDev) || 0) * day);
      const lowDemand = Math.max(0, inv - Math.max(0, d - parseFloat(demandStdDev) || 0) * day);

      data.push({
        day,
        expected: avgInventory,
        highDemand,
        lowDemand,
        safetyStock: ss,
        reorderPoint: result.demandDuringLeadTime + ss,
        isLeadTime: day <= lt,
      });
    }
    return data;
  }, [demandMean, demandStdDev, currentInventory, result.safetyStock, result.demandDuringLeadTime, leadTimeMean]);

  // What-if scenarios
  const whatIfScenarios = useMemo(() => {
    const baseInv = parseFloat(currentInventory) || 0;
    const variations = [-50, -30, -20, -10, 0, 10, 20, 30, 50];

    return variations.map(variation => {
      const newInv = Math.max(0, baseInv * (1 + variation / 100));
      const d = parseFloat(demandMean) || 0;
      const LT = parseFloat(leadTimeMean) || 0;
      const sigmaD = parseFloat(demandStdDev) || 0;
      const sigmaLT = parseFloat(leadTimeStdDev) || 0;

      const demandDuringLT = d * LT;
      const sigmaDLT = Math.sqrt(LT * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2));
      const inventoryAboveDemand = Math.max(0, newInv - demandDuringLT);
      const z = sigmaDLT > 0 ? inventoryAboveDemand / sigmaDLT : 0;
      const stockoutProb = Math.max(0, Math.min(100, (1 - normalCDF(z)) * 100));
      const L_z = unitNormalLoss(z);
      const expectedStockout = sigmaDLT * L_z;

      return {
        variation: `${variation > 0 ? '+' : ''}${variation}%`,
        inventory: Math.round(newInv),
        stockoutProbability: parseFloat(stockoutProb.toFixed(1)),
        serviceLevel: parseFloat((normalCDF(z) * 100).toFixed(1)),
        expectedStockout: parseFloat(expectedStockout.toFixed(1)),
        riskLevel: stockoutProb < 5 ? "Low" : stockoutProb < 15 ? "Medium" : stockoutProb < 30 ? "High" : "Critical",
      };
    });
  }, [currentInventory, demandMean, demandStdDev, leadTimeMean, leadTimeStdDev]);

  // Service level correlation data
  const serviceLevelCorrelation = useMemo(() => {
    const d = parseFloat(demandMean) || 0;
    const sigmaD = parseFloat(demandStdDev) || 0;
    const LT = parseFloat(leadTimeMean) || 0;
    const sigmaLT = parseFloat(leadTimeStdDev) || 0;
    const inv = parseFloat(currentInventory) || 0;

    const demandDuringLT = d * LT;
    const sigmaDLT = Math.sqrt(LT * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2));
    const inventoryAboveDemand = Math.max(0, inv - demandDuringLT);
    const currentZ = sigmaDLT > 0 ? inventoryAboveDemand / sigmaDLT : 0;

    const sls = [50, 60, 70, 80, 85, 90, 92, 94, 95, 96, 97, 98, 99, 99.5];

    return sls.map(sl => {
      const z = getZScoreForServiceLevel(sl);
      const requiredSS = z * sigmaDLT;
      const requiredInventory = demandDuringLT + requiredSS;
      const gap = requiredInventory - inv;
      const L_z = unitNormalLoss(z);
      const expectedStockout = sigmaDLT * L_z;
      const fillRate = demandDuringLT > 0 ? (1 - expectedStockout / demandDuringLT) * 100 : 100;

      return {
        serviceLevel: sl,
        zScore: z,
        requiredSafetyStock: Math.round(requiredSS),
        requiredInventory: Math.round(requiredInventory),
        gap: Math.round(gap),
        fillRate: parseFloat(fillRate.toFixed(1)),
        isCurrent: Math.abs(z - currentZ) < 0.1,
      };
    });
  }, [demandMean, demandStdDev, leadTimeMean, leadTimeStdDev, currentInventory]);

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    purple: "#8B5CF6",
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-[var(--logistics)]">Low Risk</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium Risk</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High Risk</Badge>;
      case "critical":
        return <Badge className="bg-destructive">Critical Risk</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "surplus":
        return <Badge variant="secondary">Surplus</Badge>;
      case "adequate":
        return <Badge className="bg-[var(--logistics)]">Adequate</Badge>;
      case "low":
        return <Badge className="bg-amber-500">Low</Badge>;
      case "critical":
        return <Badge className="bg-destructive">Critical</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="depletion">Depletion</TabsTrigger>
          <TabsTrigger value="scenarios">What-If</TabsTrigger>
          <TabsTrigger value="education">Learn</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                  Stockout Parameters
                </CardTitle>
                <CardDescription>Configure your inventory and demand parameters</CardDescription>
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

                {/* Current Inventory */}
                <div className="space-y-2 p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
                  <Label htmlFor="currentInventory" className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--ocean)]" />
                    Current Inventory Level
                  </Label>
                  <Input
                    id="currentInventory"
                    type="number"
                    value={currentInventory}
                    onChange={(e) => setCurrentInventory(e.target.value)}
                    placeholder="800"
                    className="text-lg font-semibold"
                  />
                  <p className="text-xs text-muted-foreground">
                    Days of stock: {result.daysOfStock} days
                  </p>
                </div>

                <Separator />

                {/* Demand Parameters */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                    Demand Distribution
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="demandMean" className="text-xs">Mean Daily Demand</Label>
                      <Input
                        id="demandMean"
                        type="number"
                        value={demandMean}
                        onChange={(e) => setDemandMean(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="demandStdDev" className="text-xs">Std. Deviation</Label>
                      <Input
                        id="demandStdDev"
                        type="number"
                        value={demandStdDev}
                        onChange={(e) => setDemandStdDev(e.target.value)}
                        placeholder="25"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    CV: {((parseFloat(demandStdDev) / (parseFloat(demandMean) || 1)) * 100).toFixed(1)}% demand variability
                  </p>
                </div>

                {/* Lead Time Parameters */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Lead Time Distribution
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="leadTimeMean" className="text-xs">Mean Lead Time (days)</Label>
                      <Input
                        id="leadTimeMean"
                        type="number"
                        value={leadTimeMean}
                        onChange={(e) => setLeadTimeMean(e.target.value)}
                        placeholder="7"
                      />
                    </div>
                    <div>
                      <Label htmlFor="leadTimeStdDev" className="text-xs">Std. Deviation (days)</Label>
                      <Input
                        id="leadTimeStdDev"
                        type="number"
                        value={leadTimeStdDev}
                        onChange={(e) => setLeadTimeStdDev(e.target.value)}
                        placeholder="2"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Safety Stock */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[var(--logistics)]" />
                      Safety Stock
                    </Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="auto-ss" className="text-xs">Auto-calculate</Label>
                      <Switch
                        id="auto-ss"
                        checked={useCalculatedSafetyStock}
                        onCheckedChange={setUseCalculatedSafetyStock}
                      />
                    </div>
                  </div>
                  {useCalculatedSafetyStock ? (
                    <div className="space-y-2">
                      <Label>Target Service Level</Label>
                      <Slider
                        value={[targetServiceLevel]}
                        onValueChange={(v) => setTargetServiceLevel(v[0])}
                        min={50}
                        max={99.9}
                        step={0.5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>50%</span>
                        <span className="font-medium text-[var(--logistics)]">{targetServiceLevel}%</span>
                        <span>99.9%</span>
                      </div>
                      <p className="text-sm font-medium p-2 bg-muted rounded">
                        Calculated Safety Stock: {result.safetyStock} units
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="safetyStock" className="text-xs">Safety Stock (units)</Label>
                      <Input
                        id="safetyStock"
                        type="number"
                        value={safetyStock}
                        onChange={(e) => setSafetyStock(e.target.value)}
                        placeholder="200"
                      />
                    </div>
                  )}
                </div>

                <Separator />

                {/* Cost Parameters */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--ocean)]" />
                    Cost Parameters
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unitCost" className="text-xs">Unit Cost</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="unitCost"
                          type="number"
                          value={unitCost}
                          onChange={(e) => setUnitCost(e.target.value)}
                          className="pl-10"
                          placeholder="50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="stockoutCost" className="text-xs">Stockout Cost/Unit</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="stockoutCost"
                          type="number"
                          value={stockoutCostPerUnit}
                          onChange={(e) => setStockoutCostPerUnit(e.target.value)}
                          className="pl-10"
                          placeholder="25"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Holding Cost Rate (% per year)</Label>
                    <div className="mt-2">
                      <Slider
                        value={[holdingCostRate]}
                        onValueChange={(v) => setHoldingCostRate(v[0])}
                        min={5}
                        max={50}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5%</span>
                        <span className="font-medium text-[var(--ocean)]">{holdingCostRate}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <div className="space-y-6">
              {/* Main Stockout Risk */}
              <Card className={`border-2 ${
                result.riskLevel === "critical" ? "border-destructive bg-destructive/5" :
                result.riskLevel === "high" ? "border-orange-500 bg-orange-500/5" :
                result.riskLevel === "medium" ? "border-amber-500 bg-amber-500/5" :
                "border-[var(--logistics)] bg-[var(--logistics)]/5"
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${
                        result.riskLevel === "critical" ? "text-destructive" :
                        result.riskLevel === "high" ? "text-orange-500" :
                        result.riskLevel === "medium" ? "text-amber-500" :
                        "text-[var(--logistics)]"
                      }`} />
                      Stockout Risk Assessment
                    </span>
                    {getRiskBadge(result.riskLevel)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <motion.div
                      key={result.stockoutProbability}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-5xl font-bold ${
                        result.riskLevel === "critical" ? "text-destructive" :
                        result.riskLevel === "high" ? "text-orange-500" :
                        result.riskLevel === "medium" ? "text-amber-500" :
                        "text-[var(--logistics)]"
                      }`}
                    >
                      {result.stockoutProbability.toFixed(1)}%
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">
                      Stockout Probability
                    </div>
                    <div className="flex justify-center gap-2 mt-3">
                      {getRiskBadge(result.riskLevel)}
                      {getStatusBadge(result.inventoryStatus)}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-[var(--ocean)]">{result.serviceLevel.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Service Level</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-[var(--logistics)]">{result.fillRate.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Fill Rate</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-500">{result.expectedStockoutUnits.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">Exp. Stockout Units</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Key Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="h-4 w-4 text-[var(--ocean)]" />
                        <span className="text-xs text-muted-foreground">Demand During LT</span>
                      </div>
                      <div className="text-xl font-bold">{result.demandDuringLeadTime} units</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="h-4 w-4 text-[var(--logistics)]" />
                        <span className="text-xs text-muted-foreground">Safety Stock</span>
                      </div>
                      <div className="text-xl font-bold">{result.safetyStock} units</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-muted-foreground">Days to Stockout</span>
                      </div>
                      <div className="text-xl font-bold">{result.daysToStockout} days</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <ChartLine className="h-4 w-4 text-[var(--ocean)]" />
                        <span className="text-xs text-muted-foreground">Z-Score</span>
                      </div>
                      <div className="text-xl font-bold">{result.zScore}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--ocean)]" />
                    Cost Analysis (Monthly)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Holding Cost</span>
                      <span className="font-medium">{formatCurrency(result.holdingCost, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expected Stockout Cost</span>
                      <span className="font-medium text-amber-500">{formatCurrency(result.stockoutCost, currency)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Risk Cost</span>
                      <span className="font-bold text-[var(--ocean)]">{formatCurrency(result.holdingCost + result.stockoutCost, currency)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Demand Distribution During Lead Time
              </CardTitle>
              <CardDescription>
                Probability distribution showing the likelihood of different demand levels during lead time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={probabilityDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="demand"
                      label={{ value: 'Demand During Lead Time', position: 'bottom', offset: -5 }}
                    />
                    <YAxis
                      label={{ value: 'Probability Density', angle: -90, position: 'insideLeft' }}
                      tickFormatter={(v) => v.toFixed(4)}
                    />
                    <Tooltip
                      formatter={(value: number) => value.toFixed(6)}
                      labelFormatter={(label) => `Demand: ${label} units`}
                    />
                    <ReferenceLine
                      x={parseFloat(currentInventory)}
                      stroke={chartColors.danger}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      label={{ value: 'Current Inventory', fill: chartColors.danger, position: 'top' }}
                    />
                    <ReferenceLine
                      x={result.demandDuringLeadTime}
                      stroke={chartColors.logistics}
                      label={{ value: 'Mean Demand', fill: chartColors.logistics, position: 'top' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="probability"
                      stroke={chartColors.ocean}
                      fill={chartColors.ocean}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Interpretation</p>
                    <p className="text-muted-foreground">
                      The shaded area to the right of the current inventory line represents the
                      probability of stockout ({result.stockoutProbability.toFixed(1)}%). This occurs when
                      demand during lead time exceeds available inventory.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-4">
                <div className="p-3 bg-[var(--ocean)]/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Mean Demand</p>
                  <p className="text-xl font-bold text-[var(--ocean)]">{result.demandDuringLeadTime}</p>
                </div>
                <div className="p-3 bg-[var(--logistics)]/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Std. Deviation</p>
                  <p className="text-xl font-bold text-[var(--logistics)]">{result.stdDevDuringLeadTime.toFixed(1)}</p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Current Inventory</p>
                  <p className="text-xl font-bold text-amber-500">{currentInventory}</p>
                </div>
                <div className="p-3 bg-destructive/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Stockout Risk</p>
                  <p className="text-xl font-bold text-destructive">{result.stockoutProbability.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Level Correlation */}
          <Card>
            <CardHeader>
              <CardTitle>Service Level & Fill Rate Correlation</CardTitle>
              <CardDescription>
                How different service level targets affect safety stock requirements and fill rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Service Level</th>
                      <th className="text-center py-3 px-4">Z-Score</th>
                      <th className="text-center py-3 px-4">Required SS</th>
                      <th className="text-center py-3 px-4">Required Inv.</th>
                      <th className="text-center py-3 px-4">Fill Rate</th>
                      <th className="text-center py-3 px-4">Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceLevelCorrelation.map((row) => (
                      <tr
                        key={row.serviceLevel}
                        className={`border-b ${row.isCurrent ? "bg-[var(--ocean)]/10 font-medium" : ""}`}
                      >
                        <td className="py-3 px-4">
                          <Badge className={row.isCurrent ? "bg-[var(--ocean)]" : "bg-muted"}>
                            {row.serviceLevel}%
                            {row.isCurrent && " (Current)"}
                          </Badge>
                        </td>
                        <td className="text-center py-3 px-4">{row.zScore.toFixed(2)}</td>
                        <td className="text-center py-3 px-4">{row.requiredSafetyStock} units</td>
                        <td className="text-center py-3 px-4">{row.requiredInventory} units</td>
                        <td className="text-center py-3 px-4">{row.fillRate}%</td>
                        <td className="text-center py-3 px-4">
                          <span className={row.gap > 0 ? "text-amber-500" : "text-[var(--logistics)]"}>
                            {row.gap > 0 ? `+${row.gap}` : row.gap}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depletion" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                Inventory Depletion Curve
              </CardTitle>
              <CardDescription>
                Projected inventory levels over time showing expected, high, and low demand scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={inventoryDepletionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="day"
                      label={{ value: 'Days', position: 'bottom', offset: -5 }}
                    />
                    <YAxis label={{ value: 'Inventory Level', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${Math.round(value)} units`,
                        name === 'expected' ? 'Expected' :
                        name === 'highDemand' ? 'High Demand' :
                        name === 'lowDemand' ? 'Low Demand' : name
                      ]}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Legend />
                    <ReferenceLine
                      y={result.safetyStock}
                      stroke={chartColors.warning}
                      strokeDasharray="5 5"
                      label={{ value: 'Safety Stock', fill: chartColors.warning }}
                    />
                    <ReferenceLine
                      y={result.demandDuringLeadTime + result.safetyStock}
                      stroke={chartColors.logistics}
                      strokeDasharray="5 5"
                      label={{ value: 'Reorder Point', fill: chartColors.logistics }}
                    />
                    <ReferenceLine
                      y={0}
                      stroke={chartColors.danger}
                      strokeWidth={2}
                    />
                    {/* Lead time shaded area */}
                    <ReferenceArea
                      x1={0}
                      x2={parseFloat(leadTimeMean)}
                      fill={chartColors.ocean}
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="lowDemand"
                      stroke={chartColors.logistics}
                      fill={chartColors.logistics}
                      fillOpacity={0.1}
                      name="Low Demand"
                    />
                    <Area
                      type="monotone"
                      dataKey="highDemand"
                      stroke={chartColors.danger}
                      fill={chartColors.danger}
                      fillOpacity={0.1}
                      name="High Demand"
                    />
                    <Line
                      type="monotone"
                      dataKey="expected"
                      stroke={chartColors.ocean}
                      strokeWidth={3}
                      dot={false}
                      name="Expected"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Safety Stock Level</span>
                  </div>
                  <p className="text-2xl font-bold">{result.safetyStock} units</p>
                  <p className="text-xs text-muted-foreground">Buffer against variability</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Reorder Point</span>
                  </div>
                  <p className="text-2xl font-bold">{result.demandDuringLeadTime + result.safetyStock} units</p>
                  <p className="text-xs text-muted-foreground">Trigger new order</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Lead Time</span>
                  </div>
                  <p className="text-2xl font-bold">{leadTimeMean} days</p>
                  <p className="text-xs text-muted-foreground">Shaded area on chart</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Key Insight</p>
                    <p className="text-muted-foreground">
                      The shaded region (first {leadTimeMean} days) represents the lead time period.
                      If inventory drops below the reorder point during this window, a stockout becomes
                      increasingly likely before the next order arrives.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-[var(--ocean)]" />
                What-If Analysis
              </CardTitle>
              <CardDescription>
                Explore how different inventory levels affect stockout probability and service level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={whatIfScenarios}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="variation" label={{ value: 'Inventory Change', position: 'bottom', offset: -5 }} />
                    <YAxis yAxisId="left" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'stockoutProbability' || name === 'serviceLevel' ? `${value.toFixed(1)}%` :
                        name === 'inventory' ? `${value} units` : value.toFixed(1),
                        name === 'stockoutProbability' ? 'Stockout Prob.' :
                        name === 'serviceLevel' ? 'Service Level' :
                        name === 'inventory' ? 'Inventory' : name
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="right" dataKey="inventory" fill={chartColors.ocean} fillOpacity={0.3} name="Inventory" />
                    <Line yAxisId="left" type="monotone" dataKey="stockoutProbability" stroke={chartColors.danger} strokeWidth={2} name="Stockout Prob." dot={{ fill: chartColors.danger }} />
                    <Line yAxisId="left" type="monotone" dataKey="serviceLevel" stroke={chartColors.logistics} strokeWidth={2} name="Service Level" dot={{ fill: chartColors.logistics }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Change</th>
                      <th className="text-center py-3 px-4">Inventory</th>
                      <th className="text-center py-3 px-4">Stockout Prob.</th>
                      <th className="text-center py-3 px-4">Service Level</th>
                      <th className="text-center py-3 px-4">Exp. Stockout</th>
                      <th className="text-center py-3 px-4">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whatIfScenarios.map((row) => (
                      <tr
                        key={row.variation}
                        className={`border-b ${row.variation === "0%" ? "bg-[var(--ocean)]/10 font-medium" : ""}`}
                      >
                        <td className="py-3 px-4 font-medium">{row.variation}</td>
                        <td className="text-center py-3 px-4">{row.inventory} units</td>
                        <td className="text-center py-3 px-4">
                          <span className={row.stockoutProbability > 15 ? "text-destructive" : row.stockoutProbability > 5 ? "text-amber-500" : "text-[var(--logistics)]"}>
                            {row.stockoutProbability}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">{row.serviceLevel}%</td>
                        <td className="text-center py-3 px-4">{row.expectedStockout} units</td>
                        <td className="text-center py-3 px-4">
                          <Badge className={
                            row.riskLevel === "Critical" ? "bg-destructive" :
                            row.riskLevel === "High" ? "bg-orange-500" :
                            row.riskLevel === "Medium" ? "bg-amber-500" :
                            "bg-[var(--logistics)]"
                          }>
                            {row.riskLevel}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sensitivity Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Impact of Demand Variability</CardTitle>
                <CardDescription>How demand uncertainty affects stockout risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Low (10%)", "Medium (25%)", "High (40%)", "Very High (60%)"].map((level, i) => {
                    const factors = [0.1, 0.25, 0.4, 0.6];
                    const newStdDev = parseFloat(demandMean) * factors[i];
                    const newSigmaDLT = Math.sqrt(
                      parseFloat(leadTimeMean) * Math.pow(newStdDev, 2) +
                      Math.pow(parseFloat(demandMean), 2) * Math.pow(parseFloat(leadTimeStdDev), 2)
                    );
                    const invAboveDemand = Math.max(0, parseFloat(currentInventory) - parseFloat(demandMean) * parseFloat(leadTimeMean));
                    const z = newSigmaDLT > 0 ? invAboveDemand / newSigmaDLT : 0;
                    const prob = Math.max(0, Math.min(100, (1 - normalCDF(z)) * 100));

                    return (
                      <div key={level} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">{level}</span>
                        <div className="flex items-center gap-4">
                          <Badge variant={prob < 5 ? "default" : prob < 15 ? "secondary" : "destructive"}>
                            {prob.toFixed(1)}% risk
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Impact of Lead Time Variability</CardTitle>
                <CardDescription>How supply uncertainty affects stockout risk</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Stable (1 day)", "Normal (2 days)", "Variable (3 days)", "Unreliable (5 days)"].map((level, i) => {
                    const ltStdDevs = [1, 2, 3, 5];
                    const newSigmaDLT = Math.sqrt(
                      parseFloat(leadTimeMean) * Math.pow(parseFloat(demandStdDev), 2) +
                      Math.pow(parseFloat(demandMean), 2) * Math.pow(ltStdDevs[i], 2)
                    );
                    const invAboveDemand = Math.max(0, parseFloat(currentInventory) - parseFloat(demandMean) * parseFloat(leadTimeMean));
                    const z = newSigmaDLT > 0 ? invAboveDemand / newSigmaDLT : 0;
                    const prob = Math.max(0, Math.min(100, (1 - normalCDF(z)) * 100));

                    return (
                      <div key={level} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="font-medium">{level}</span>
                        <div className="flex items-center gap-4">
                          <Badge variant={prob < 5 ? "default" : prob < 15 ? "secondary" : "destructive"}>
                            {prob.toFixed(1)}% risk
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="education" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[var(--ocean)]" />
                  What is Stockout Probability?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert">
                <p className="text-muted-foreground">
                  <strong>Stockout probability</strong> is the likelihood that demand during a replenishment
                  period will exceed available inventory. It represents the risk of being unable to fulfill
                  customer orders from stock.
                </p>
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <p className="font-mono text-sm">
                    Stockout Prob. = 1 - CDF(Inventory Level - Mean Demand / Std Dev)
                  </p>
                </div>
                <p className="text-muted-foreground mt-3">
                  The calculation uses the normal distribution, assuming demand follows a bell curve
                  around the mean with variability captured by the standard deviation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-[var(--logistics)]" />
                  Service Level vs Fill Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                    <p className="font-semibold mb-1">Service Level (Cycle Service Level)</p>
                    <p className="text-sm text-muted-foreground">
                      Probability of NOT experiencing a stockout during a replenishment cycle.
                      A 95% service level means 95 out of 100 cycles will have no stockout.
                    </p>
                  </div>
                  <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                    <p className="font-semibold mb-1">Fill Rate</p>
                    <p className="text-sm text-muted-foreground">
                      Percentage of total demand fulfilled immediately from stock.
                      Usually higher than service level because partial fulfillment counts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <p className="text-sm">
                      Fill rate is typically 1-3% higher than service level for the same inventory.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Stockout Risk Management Framework</CardTitle>
              <CardDescription>Best practices for managing and mitigating stockout risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: "Monitor Demand",
                    icon: TrendingUp,
                    description: "Track demand patterns and variability. Use historical data to improve forecasts.",
                    tip: "Update demand parameters monthly"
                  },
                  {
                    title: "Manage Lead Time",
                    icon: Clock,
                    description: "Work with suppliers to reduce lead time variability. Have backup suppliers.",
                    tip: "Build supplier relationships"
                  },
                  {
                    title: "Set Safety Stock",
                    icon: Shield,
                    description: "Maintain adequate safety stock based on desired service level.",
                    tip: "Use statistical methods"
                  },
                  {
                    title: "Monitor Inventory",
                    icon: Package,
                    description: "Track inventory levels in real-time. Set alerts at reorder points.",
                    tip: "Implement automated alerts"
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-[var(--ocean)]" />
                        <p className="font-medium">{item.title}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <p className="text-xs italic text-[var(--logistics)]">{item.tip}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Classification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  {
                    level: "Low",
                    probability: "< 5%",
                    color: "bg-[var(--logistics)]",
                    description: "Minimal stockout risk. Inventory adequate for most demand scenarios.",
                    action: "Maintain current levels"
                  },
                  {
                    level: "Medium",
                    probability: "5-15%",
                    color: "bg-amber-500",
                    description: "Moderate risk. Stockout possible during high demand periods.",
                    action: "Consider increasing safety stock"
                  },
                  {
                    level: "High",
                    probability: "15-30%",
                    color: "bg-orange-500",
                    description: "Significant risk. High likelihood of stockout during lead time.",
                    action: "Urgently review inventory policy"
                  },
                  {
                    level: "Critical",
                    probability: "> 30%",
                    color: "bg-destructive",
                    description: "Severe risk. Stockout highly likely. Immediate action required.",
                    action: "Expedite replenishment immediately"
                  },
                ].map((risk) => (
                  <div key={risk.level} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={risk.color}>{risk.level}</Badge>
                      <span className="text-sm">{risk.probability}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                    <p className="text-xs font-medium text-[var(--ocean)]">{risk.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formulas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[var(--logistics)]" />
                Key Formulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold mb-1">Demand During Lead Time</p>
                  <p className="font-mono text-sm">D_LT = d × LT</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Where d = daily demand, LT = lead time in days
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold mb-1">Standard Deviation During Lead Time</p>
                  <p className="font-mono text-sm">σ_DLT = √(LT × σ_d² + d² × σ_LT²)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Combines demand and lead time variability
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold mb-1">Stockout Probability</p>
                  <p className="font-mono text-sm">P(stockout) = 1 - Φ(z)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Where z = (Inventory - D_LT) / σ_DLT, Φ is the normal CDF
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold mb-1">Fill Rate</p>
                  <p className="font-mono text-sm">FR = 1 - (σ_DLT × L(z) / D_LT)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Where L(z) is the unit normal loss function
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
