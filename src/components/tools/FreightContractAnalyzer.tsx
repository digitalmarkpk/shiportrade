"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  Calculator,
  RefreshCw,
  Percent,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Lightbulb,
  Scale,
  Layers,
  Eye,
  Award,
  ChevronUp,
  ChevronDown,
  Clock,
  Ship,
  Container,
  Globe,
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { currencies } from "@/lib/constants/currencies";

// Carrier data for benchmarking
const carrierData = [
  { name: "Maersk", baseRate: 2450, baf: 420, caf: 180, isps: 50, docs: 75, reliability: 94, transit: 28 },
  { name: "MSC", baseRate: 2380, baf: 395, caf: 165, isps: 50, docs: 65, reliability: 91, transit: 30 },
  { name: "CMA CGM", baseRate: 2520, baf: 410, caf: 175, isps: 55, docs: 70, reliability: 93, transit: 27 },
  { name: "COSCO", baseRate: 2350, baf: 380, caf: 155, isps: 45, docs: 60, reliability: 89, transit: 32 },
  { name: "Hapag-Lloyd", baseRate: 2580, baf: 435, caf: 190, isps: 55, docs: 80, reliability: 95, transit: 26 },
  { name: "ONE", baseRate: 2490, baf: 405, caf: 170, isps: 50, docs: 70, reliability: 92, transit: 28 },
  { name: "Evergreen", baseRate: 2420, baf: 390, caf: 160, isps: 48, docs: 65, reliability: 90, transit: 29 },
  { name: "Yang Ming", baseRate: 2290, baf: 375, caf: 150, isps: 45, docs: 55, reliability: 87, transit: 33 },
];

// Common surcharge types
const surchargeTypes = [
  { code: "BAF", name: "Bunker Adjustment Factor", description: "Fuel cost adjustment" },
  { code: "CAF", name: "Currency Adjustment Factor", description: "Exchange rate fluctuation" },
  { code: "ISPS", name: "ISPS Code Surcharge", description: "Security compliance" },
  { code: "DOC", name: "Documentation Fee", description: "Bill of Lading processing" },
  { code: "THC", name: "Terminal Handling Charge", description: "Port terminal operations" },
  { code: "PCS", name: "Peak Season Surcharge", description: "High demand periods" },
  { code: "PSS", name: "Port Congestion Surcharge", description: "Port delays" },
  { code: "LIS", name: "Low Sulphur Surcharge", description: "IMO 2020 compliance" },
  { code: "WRS", name: "War Risk Surcharge", description: "Route security risk" },
  { code: "EIS", name: "Equipment Imbalance Surcharge", description: "Container availability" },
];

// Trade lanes with benchmark rates
const tradeLanes = [
  { route: "Asia - North America West", code: "Trans-Pacific WB", avgRate: 2850, volatility: 0.25 },
  { route: "North America West - Asia", code: "Trans-Pacific EB", avgRate: 1450, volatility: 0.18 },
  { route: "Asia - Europe", code: "Far East-Europe", avgRate: 2150, volatility: 0.22 },
  { route: "Europe - Asia", code: "Europe-Far East", avgRate: 1100, volatility: 0.15 },
  { route: "Asia - Mediterranean", code: "Far East-Med", avgRate: 2350, volatility: 0.20 },
  { route: "North America East - Europe", code: "Trans-Atlantic WB", avgRate: 2650, volatility: 0.12 },
  { route: "Europe - North America East", code: "Trans-Atlantic EB", avgRate: 1850, volatility: 0.10 },
  { route: "Intra-Asia", code: "Intra-Asia", avgRate: 650, volatility: 0.30 },
];

// Container types
const containerTypes = [
  { code: "20GP", name: "20' Standard", teu: 1, maxWeight: 28180 },
  { code: "40GP", name: "40' Standard", teu: 2, maxWeight: 26740 },
  { code: "40HC", name: "40' High Cube", teu: 2.25, maxWeight: 26630 },
  { code: "45HC", name: "45' High Cube", teu: 2.5, maxWeight: 25580 },
  { code: "20RF", name: "20' Refrigerated", teu: 1.5, maxWeight: 27390 },
  { code: "40RF", name: "40' Refrigerated", teu: 2.5, maxWeight: 25980 },
];

const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  purple: "#8B5CF6",
};

interface ContractAnalysis {
  totalCost: number;
  costPerTEU: number;
  costPerContainer: number;
  surchargeRatio: number;
  volumeDiscount: number;
  benchmarkComparison: number;
  contractScore: number;
  hiddenCosts: {
    item: string;
    amount: number;
    description: string;
  }[];
  recommendations: {
    category: string;
    suggestion: string;
    potentialSavings: number;
    priority: "high" | "medium" | "low";
  }[];
  surchargeBreakdown: {
    name: string;
    amount: number;
    percentage: number;
  }[];
  rateStructure: {
    component: string;
    rate: number;
    benchmark: number;
    variance: number;
  }[];
  volumeCommitment: {
    committed: number;
    utilized: number;
    utilizationRate: number;
    shortfallPenalty: number;
  };
}

export default function FreightContractAnalyzer() {
  // Input states
  const [contractName, setContractName] = useState<string>("Annual Service Contract 2024");
  const [carrier, setCarrier] = useState<string>("Maersk");
  const [tradeLane, setTradeLane] = useState<string>("Asia - North America West");
  const [containerType, setContainerType] = useState<string>("40HC");
  const [baseRate, setBaseRate] = useState<string>("2500");
  const [volumeCommitment, setVolumeCommitment] = useState<string>("500");
  const [actualVolume, setActualVolume] = useState<string>("420");
  const [contractDuration, setContractDuration] = useState<string>("12");
  const [currency, setCurrency] = useState<string>("USD");
  
  // Surcharge inputs
  const [bafRate, setBafRate] = useState<string>("420");
  const [cafRate, setCafRate] = useState<string>("180");
  const [thcOrigin, setThcOrigin] = useState<string>("185");
  const [thcDestination, setThcDestination] = useState<string>("225");
  const [docsFee, setDocsFee] = useState<string>("75");
  const [ispsFee, setIspsFee] = useState<string>("50");
  const [peakSeasonSurcharge, setPeakSeasonSurcharge] = useState<string>("0");
  const [lowSulphurSurcharge, setLowSulphurSurcharge] = useState<string>("85");
  const [otherSurcharges, setOtherSurcharges] = useState<string>("0");
  
  // Options
  const [peakSeasonApplicable, setPeakSeasonApplicable] = useState<boolean>(false);
  const [volumeDiscount, setVolumeDiscount] = useState<string>("5");
  const [shortfallPenalty, setShortfallPenalty] = useState<string>("15");
  
  const [result, setResult] = useState<ContractAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Calculate contract analysis
  const analyzeContract = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const baseRateValue = parseFloat(baseRate) || 2500;
      const volumeCommitted = parseFloat(volumeCommitment) || 500;
      const volumeActual = parseFloat(actualVolume) || 420;
      const duration = parseFloat(contractDuration) || 12;
      const discount = parseFloat(volumeDiscount) || 5;
      const penalty = parseFloat(shortfallPenalty) || 15;
      
      // Calculate surcharges
      const baf = parseFloat(bafRate) || 420;
      const caf = parseFloat(cafRate) || 180;
      const thc = (parseFloat(thcOrigin) || 185) + (parseFloat(thcDestination) || 225);
      const docs = parseFloat(docsFee) || 75;
      const isps = parseFloat(ispsFee) || 50;
      const pss = peakSeasonApplicable ? (parseFloat(peakSeasonSurcharge) || 350) : 0;
      const lss = parseFloat(lowSulphurSurcharge) || 85;
      const other = parseFloat(otherSurcharges) || 0;
      
      const totalSurcharges = baf + caf + thc + docs + isps + pss + lss + other;
      const totalCostPerContainer = baseRateValue + totalSurcharges;
      
      // Volume analysis
      const utilizationRate = (volumeActual / volumeCommitted) * 100;
      const shortfall = Math.max(0, volumeCommitted - volumeActual);
      const shortfallPenaltyCost = shortfall * totalCostPerContainer * (penalty / 100);
      
      // Apply volume discount
      const effectiveBaseRate = baseRateValue * (1 - discount / 100);
      const effectiveTotalCost = effectiveBaseRate + totalSurcharges;
      
      // Benchmark comparison
      const selectedLane = tradeLanes.find(t => t.route === tradeLane) || tradeLanes[0];
      const benchmarkDiff = ((effectiveTotalCost - selectedLane.avgRate) / selectedLane.avgRate) * 100;
      
      // Hidden costs identification
      const hiddenCosts: ContractAnalysis["hiddenCosts"] = [];
      
      if (baf > 400) {
        hiddenCosts.push({
          item: "High BAF Rate",
          amount: (baf - 400) * volumeActual,
          description: "BAF above market average. Negotiate fuel pass-through mechanism."
        });
      }
      
      if (thc > 450) {
        hiddenCosts.push({
          item: "Elevated THC",
          amount: (thc - 450) * volumeActual,
          description: "Terminal handling above benchmark. Consider alternative terminals."
        });
      }
      
      if (utilizationRate < 90) {
        hiddenCosts.push({
          item: "Volume Shortfall Penalty",
          amount: shortfallPenaltyCost,
          description: `Penalty for ${shortfall} TEU shortfall at ${penalty}% rate.`
        });
      }
      
      if (pss > 300) {
        hiddenCosts.push({
          item: "Peak Season Exposure",
          amount: pss * volumeActual * 0.25,
          description: "High peak season rates. Consider off-peak shipments."
        });
      }
      
      if (lss > 75) {
        hiddenCosts.push({
          item: "Low Sulphur Premium",
          amount: (lss - 75) * volumeActual,
          description: "LSS above IMO 2020 standard rates."
        });
      }
      
      // Surcharge breakdown
      const surchargeBreakdown = [
        { name: "BAF", amount: baf, percentage: (baf / totalSurcharges) * 100 },
        { name: "CAF", amount: caf, percentage: (caf / totalSurcharges) * 100 },
        { name: "THC", amount: thc, percentage: (thc / totalSurcharges) * 100 },
        { name: "Documentation", amount: docs, percentage: (docs / totalSurcharges) * 100 },
        { name: "ISPS", amount: isps, percentage: (isps / totalSurcharges) * 100 },
        { name: "LSS", amount: lss, percentage: (lss / totalSurcharges) * 100 },
      ];
      
      if (pss > 0) {
        surchargeBreakdown.push({ name: "Peak Season", amount: pss, percentage: (pss / totalSurcharges) * 100 });
      }
      if (other > 0) {
        surchargeBreakdown.push({ name: "Other", amount: other, percentage: (other / totalSurcharges) * 100 });
      }
      
      // Rate structure analysis
      const selectedCarrier = carrierData.find(c => c.name === carrier) || carrierData[0];
      const rateStructure = [
        { component: "Base Rate", rate: baseRateValue, benchmark: selectedCarrier.baseRate, variance: ((baseRateValue - selectedCarrier.baseRate) / selectedCarrier.baseRate) * 100 },
        { component: "BAF", rate: baf, benchmark: selectedCarrier.baf, variance: ((baf - selectedCarrier.baf) / selectedCarrier.baf) * 100 },
        { component: "CAF", rate: caf, benchmark: selectedCarrier.caf, variance: ((caf - selectedCarrier.caf) / selectedCarrier.caf) * 100 },
        { component: "ISPS", rate: isps, benchmark: selectedCarrier.isps, variance: ((isps - selectedCarrier.isps) / selectedCarrier.isps) * 100 },
        { component: "Documentation", rate: docs, benchmark: selectedCarrier.docs, variance: ((docs - selectedCarrier.docs) / selectedCarrier.docs) * 100 },
      ];
      
      // Generate recommendations
      const recommendations: ContractAnalysis["recommendations"] = [];
      
      if (benchmarkDiff > 10) {
        recommendations.push({
          category: "Rate Negotiation",
          suggestion: "Contract rates are significantly above market. Request rate revision or seek competitive quotes.",
          potentialSavings: (benchmarkDiff / 100) * effectiveTotalCost * volumeActual,
          priority: "high"
        });
      } else if (benchmarkDiff > 5) {
        recommendations.push({
          category: "Rate Negotiation",
          suggestion: "Rates slightly above market. Consider negotiating 3-5% reduction.",
          potentialSavings: effectiveTotalCost * 0.05 * volumeActual,
          priority: "medium"
        });
      }
      
      if (utilizationRate < 80) {
        recommendations.push({
          category: "Volume Management",
          suggestion: "Low volume utilization. Consider reducing commitment or negotiating more flexible terms.",
          potentialSavings: shortfallPenaltyCost * 0.5,
          priority: "high"
        });
      }
      
      if (surchargeBreakdown[0].percentage > 40) {
        recommendations.push({
          category: "BAF Optimization",
          suggestion: "High BAF ratio. Negotiate fuel index-linked adjustment mechanism.",
          potentialSavings: baf * 0.1 * volumeActual,
          priority: "high"
        });
      }
      
      if (discount < 5) {
        recommendations.push({
          category: "Volume Discount",
          suggestion: "Volume discount below industry standard. Request tiered pricing structure.",
          potentialSavings: effectiveTotalCost * 0.03 * volumeActual,
          priority: "medium"
        });
      }
      
      if (!peakSeasonApplicable && selectedLane.volatility > 0.2) {
        recommendations.push({
          category: "Seasonal Planning",
          suggestion: "High volatility route. Consider fixing peak season rates in advance.",
          potentialSavings: totalCostPerContainer * 0.15 * volumeActual * 0.25,
          priority: "low"
        });
      }
      
      // Calculate contract score (0-100)
      let score = 70; // Base score
      
      // Rate competitiveness (+/- 15 points)
      score -= Math.min(15, Math.max(-10, benchmarkDiff * 1.5));
      
      // Volume utilization (+/- 10 points)
      if (utilizationRate >= 95) score += 10;
      else if (utilizationRate >= 85) score += 5;
      else if (utilizationRate < 80) score -= 10;
      
      // Surcharge transparency (+/- 5 points)
      if (hiddenCosts.length <= 2) score += 5;
      else if (hiddenCosts.length > 4) score -= 5;
      
      // Volume discount bonus (+5 points max)
      if (discount >= 8) score += 5;
      else if (discount >= 5) score += 2;
      
      // Cap score
      score = Math.min(100, Math.max(0, score));
      
      const analysis: ContractAnalysis = {
        totalCost: effectiveTotalCost * volumeActual,
        costPerTEU: effectiveTotalCost,
        costPerContainer: effectiveTotalCost,
        surchargeRatio: (totalSurcharges / effectiveTotalCost) * 100,
        volumeDiscount: discount,
        benchmarkComparison: benchmarkDiff,
        contractScore: score,
        hiddenCosts,
        recommendations,
        surchargeBreakdown,
        rateStructure,
        volumeCommitment: {
          committed: volumeCommitted,
          utilized: volumeActual,
          utilizationRate,
          shortfallPenalty: shortfallPenaltyCost
        }
      };
      
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Chart data
  const surchargeChartData = useMemo(() => {
    if (!result) return [];
    return result.surchargeBreakdown.map(s => ({
      name: s.name,
      value: s.amount,
      fill: s.name === "BAF" ? COLORS.ocean : 
            s.name === "CAF" ? COLORS.logistics : 
            s.name === "THC" ? COLORS.warning :
            s.name === "Documentation" ? COLORS.info :
            s.name === "ISPS" ? COLORS.purple :
            s.name === "LSS" ? "#06B6D4" :
            s.name === "Peak Season" ? COLORS.danger : "#94A3B8"
    }));
  }, [result]);

  const benchmarkComparisonData = useMemo(() => {
    if (!result) return [];
    return result.rateStructure.map(r => ({
      name: r.component,
      Contract: r.rate,
      Benchmark: r.benchmark,
    }));
  }, [result]);

  const volumeTrendData = useMemo(() => {
    if (!result) return [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.slice(0, Math.min(12, parseFloat(contractDuration))).map((month, i) => {
      const committed = parseFloat(volumeCommitment) / parseFloat(contractDuration);
      const actualVariation = 0.85 + Math.random() * 0.3;
      return {
        month,
        committed: Math.round(committed),
        actual: Math.round(committed * actualVariation),
      };
    });
  }, [result, volumeCommitment, contractDuration]);

  const carrierComparisonData = useMemo(() => {
    const currentCarrier = carrierData.find(c => c.name === carrier) || carrierData[0];
    return carrierData.map(c => ({
      name: c.name,
      totalRate: c.baseRate + c.baf + c.caf + c.isps + c.docs,
      reliability: c.reliability,
      isCurrent: c.name === carrier
    }));
  }, [carrier]);

  const formatValue = (value: number, curr: string = currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return COLORS.logistics;
    if (score >= 60) return COLORS.warning;
    return COLORS.danger;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 55) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <FileText className="h-5 w-5" />
            Contract Details
          </CardTitle>
          <CardDescription>
            Enter your freight contract details for comprehensive analysis and benchmarking
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="basic">Basic Terms</TabsTrigger>
              <TabsTrigger value="rates">Rate Structure</TabsTrigger>
              <TabsTrigger value="surcharges">Surcharges</TabsTrigger>
              <TabsTrigger value="volume">Volume Commitment</TabsTrigger>
            </TabsList>

            {/* Basic Terms Tab */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#2E8B57]" />
                    Contract Name
                  </Label>
                  <Input
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    placeholder="Annual Service Contract"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[#2E8B57]" />
                    Carrier
                  </Label>
                  <Select value={carrier} onValueChange={setCarrier}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {carrierData.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name} ({c.reliability}% reliability)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#2E8B57]" />
                    Trade Lane
                  </Label>
                  <Select value={tradeLane} onValueChange={setTradeLane}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tradeLanes.map((t) => (
                        <SelectItem key={t.route} value={t.route}>
                          {t.route} ({formatValue(t.avgRate)}/FEU)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Container className="h-4 w-4 text-[#2E8B57]" />
                    Container Type
                  </Label>
                  <Select value={containerType} onValueChange={setContainerType}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {containerTypes.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name} ({c.teu} TEU)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                    Base Rate (per container)
                  </Label>
                  <Input
                    type="number"
                    value={baseRate}
                    onChange={(e) => setBaseRate(e.target.value)}
                    placeholder="2500"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#2E8B57]" />
                    Contract Duration (months)
                  </Label>
                  <Select value={contractDuration} onValueChange={setContractDuration}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Rate Structure Tab */}
            <TabsContent value="rates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-11">
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

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-[#2E8B57]" />
                    Volume Discount (%)
                  </Label>
                  <Input
                    type="number"
                    value={volumeDiscount}
                    onChange={(e) => setVolumeDiscount(e.target.value)}
                    placeholder="5"
                    min="0"
                    max="30"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Shortfall Penalty (%)
                  </Label>
                  <Input
                    type="number"
                    value={shortfallPenalty}
                    onChange={(e) => setShortfallPenalty(e.target.value)}
                    placeholder="15"
                    min="0"
                    max="50"
                    className="h-11"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Surcharges Tab */}
            <TabsContent value="surcharges" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label>BAF (Bunker Adjustment)</Label>
                  <Input
                    type="number"
                    value={bafRate}
                    onChange={(e) => setBafRate(e.target.value)}
                    placeholder="420"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>CAF (Currency Adjustment)</Label>
                  <Input
                    type="number"
                    value={cafRate}
                    onChange={(e) => setCafRate(e.target.value)}
                    placeholder="180"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>THC Origin</Label>
                  <Input
                    type="number"
                    value={thcOrigin}
                    onChange={(e) => setThcOrigin(e.target.value)}
                    placeholder="185"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>THC Destination</Label>
                  <Input
                    type="number"
                    value={thcDestination}
                    onChange={(e) => setThcDestination(e.target.value)}
                    placeholder="225"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Documentation Fee</Label>
                  <Input
                    type="number"
                    value={docsFee}
                    onChange={(e) => setDocsFee(e.target.value)}
                    placeholder="75"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>ISPS Code Surcharge</Label>
                  <Input
                    type="number"
                    value={ispsFee}
                    onChange={(e) => setIspsFee(e.target.value)}
                    placeholder="50"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Low Sulphur Surcharge</Label>
                  <Input
                    type="number"
                    value={lowSulphurSurcharge}
                    onChange={(e) => setLowSulphurSurcharge(e.target.value)}
                    placeholder="85"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Other Surcharges</Label>
                  <Input
                    type="number"
                    value={otherSurcharges}
                    onChange={(e) => setOtherSurcharges(e.target.value)}
                    placeholder="0"
                    className="h-11"
                  />
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={peakSeasonApplicable}
                      onCheckedChange={setPeakSeasonApplicable}
                    />
                    <Label htmlFor="peak" className="cursor-pointer">Peak Season Surcharge Applicable</Label>
                  </div>
                  {peakSeasonApplicable && (
                    <Input
                      type="number"
                      value={peakSeasonSurcharge}
                      onChange={(e) => setPeakSeasonSurcharge(e.target.value)}
                      placeholder="350"
                      className="h-11"
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Volume Commitment Tab */}
            <TabsContent value="volume" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#2E8B57]" />
                    Committed Volume (TEU)
                  </Label>
                  <Input
                    type="number"
                    value={volumeCommitment}
                    onChange={(e) => setVolumeCommitment(e.target.value)}
                    placeholder="500"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#2E8B57]" />
                    Actual Volume (TEU)
                  </Label>
                  <Input
                    type="number"
                    value={actualVolume}
                    onChange={(e) => setActualVolume(e.target.value)}
                    placeholder="420"
                    className="h-11"
                  />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Label className="text-sm text-muted-foreground">Volume Utilization</Label>
                  {volumeCommitment && actualVolume && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-2xl font-bold">
                          {((parseFloat(actualVolume) / parseFloat(volumeCommitment)) * 100 || 0).toFixed(0)}%
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {actualVolume} / {volumeCommitment} TEU
                        </span>
                      </div>
                      <Progress 
                        value={(parseFloat(actualVolume) / parseFloat(volumeCommitment)) * 100 || 0}
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={analyzeContract}
              disabled={isAnalyzing}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Contract...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Analyze Contract
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Contract Score */}
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20">{getScoreLabel(result.contractScore)}</Badge>
                </div>
                <p className="text-3xl font-bold">{result.contractScore}</p>
                <p className="text-sm opacity-80">Contract Score</p>
              </CardContent>
            </Card>

            {/* Total Contract Value */}
            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20">Total</Badge>
                </div>
                <p className="text-2xl font-bold">{formatValue(result.totalCost)}</p>
                <p className="text-sm opacity-80">Contract Value</p>
              </CardContent>
            </Card>

            {/* Cost per TEU */}
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Container className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20">Per Unit</Badge>
                </div>
                <p className="text-2xl font-bold">{formatValue(result.costPerTEU)}</p>
                <p className="text-sm opacity-80">Cost per Container</p>
              </CardContent>
            </Card>

            {/* Benchmark Comparison */}
            <Card className={`${result.benchmarkComparison > 0 ? "bg-gradient-to-br from-amber-500 to-amber-600" : "bg-gradient-to-br from-green-500 to-green-600"} text-white`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  {result.benchmarkComparison > 0 ? <TrendingUp className="h-6 w-6 opacity-80" /> : <TrendingDown className="h-6 w-6 opacity-80" />}
                  <Badge variant="secondary" className="bg-white/20">vs Market</Badge>
                </div>
                <p className="text-2xl font-bold">
                  {result.benchmarkComparison > 0 ? "+" : ""}{result.benchmarkComparison.toFixed(1)}%
                </p>
                <p className="text-sm opacity-80">vs Benchmark</p>
              </CardContent>
            </Card>

            {/* Surcharge Ratio */}
            <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Layers className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20">Surcharges</Badge>
                </div>
                <p className="text-2xl font-bold">{result.surchargeRatio.toFixed(0)}%</p>
                <p className="text-sm opacity-80">Surcharge Ratio</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="rates">Rate Analysis</TabsTrigger>
                  <TabsTrigger value="surcharges">Surcharges</TabsTrigger>
                  <TabsTrigger value="hidden">Hidden Costs</TabsTrigger>
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contract Score Gauge */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-[#0F4C81]" />
                        Contract Score Breakdown
                      </h4>
                      <div className="relative h-64 flex items-center justify-center">
                        <div className="relative">
                          <svg viewBox="0 0 100 100" className="w-48 h-48">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="12"
                              className="dark:stroke-slate-700"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={getScoreColor(result.contractScore)}
                              strokeWidth="12"
                              strokeLinecap="round"
                              strokeDasharray={`${(result.contractScore / 100) * 251.2} 251.2`}
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold" style={{ color: getScoreColor(result.contractScore) }}>
                              {result.contractScore}
                            </span>
                            <span className="text-sm text-muted-foreground">{getScoreLabel(result.contractScore)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-sm text-muted-foreground">Rate Competitiveness</span>
                          <p className={`font-bold ${result.benchmarkComparison < 0 ? "text-green-600" : "text-amber-600"}`}>
                            {result.benchmarkComparison > 0 ? "Above" : "Below"} Market
                          </p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-sm text-muted-foreground">Volume Utilization</span>
                          <p className={`font-bold ${result.volumeCommitment.utilizationRate >= 90 ? "text-green-600" : "text-amber-600"}`}>
                            {result.volumeCommitment.utilizationRate.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Carrier Comparison */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Scale className="h-5 w-5 text-[#0F4C81]" />
                        Carrier Comparison
                      </h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={carrierComparisonData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} fontSize={11} />
                            <Tooltip formatter={(value: number) => formatValue(value)} />
                            <Bar dataKey="totalRate" name="Total Rate">
                              {carrierComparisonData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.isCurrent ? COLORS.ocean : "#94A3B8"} 
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Rate Analysis Tab */}
                <TabsContent value="rates" className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                        Contract Rates vs Benchmark
                      </h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={benchmarkComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => formatValue(value)} />
                            <Legend />
                            <Bar dataKey="Contract" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Benchmark" fill={COLORS.logistics} radius={[4, 4, 0, 0]} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Rate Variance Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4 font-medium">Component</th>
                            <th className="text-right py-3 px-4 font-medium">Contract Rate</th>
                            <th className="text-right py-3 px-4 font-medium">Benchmark</th>
                            <th className="text-right py-3 px-4 font-medium">Variance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.rateStructure.map((r, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                              <td className="py-3 px-4">{r.component}</td>
                              <td className="text-right py-3 px-4 font-medium">{formatValue(r.rate)}</td>
                              <td className="text-right py-3 px-4 text-muted-foreground">{formatValue(r.benchmark)}</td>
                              <td className="text-right py-3 px-4">
                                <span className={`font-medium ${r.variance > 0 ? "text-red-500" : "text-green-500"}`}>
                                  {r.variance > 0 ? "+" : ""}{r.variance.toFixed(1)}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                {/* Surcharges Tab */}
                <TabsContent value="surcharges" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Surcharge Breakdown Pie */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-[#0F4C81]" />
                        Surcharge Distribution
                      </h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={surchargeChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {surchargeChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatValue(value)} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Surcharge Details */}
                    <div>
                      <h4 className="font-semibold mb-4">Surcharge Breakdown</h4>
                      <div className="space-y-3">
                        {result.surchargeBreakdown.map((s, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: surchargeChartData[i]?.fill || "#94A3B8" }}
                              />
                              <span className="font-medium">{s.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">{formatValue(s.amount)}</span>
                              <span className="text-sm text-muted-foreground ml-2">({s.percentage.toFixed(1)}%)</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Hidden Costs Tab */}
                <TabsContent value="hidden" className="pt-6">
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="p-6 bg-gradient-to-r from-amber-50 to-red-50 dark:from-amber-900/20 dark:to-red-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            <Eye className="h-5 w-5 text-amber-600" />
                            Identified Hidden Costs
                          </h4>
                          <p className="text-muted-foreground mt-1">
                            {result.hiddenCosts.length} potential cost items identified
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-amber-600">
                            {formatValue(result.hiddenCosts.reduce((sum, h) => sum + h.amount, 0))}
                          </p>
                          <p className="text-sm text-muted-foreground">Total Exposure</p>
                        </div>
                      </div>
                    </div>

                    {/* Hidden Cost Items */}
                    {result.hiddenCosts.length > 0 ? (
                      <div className="space-y-4">
                        {result.hiddenCosts.map((h, i) => (
                          <Card key={i} className="border-l-4 border-l-amber-500">
                            <CardContent className="pt-4 pb-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-semibold">{h.item}</h5>
                                  <p className="text-sm text-muted-foreground mt-1">{h.description}</p>
                                </div>
                                <span className="font-bold text-lg text-amber-600">{formatValue(h.amount)}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <h5 className="font-semibold text-green-700 dark:text-green-400">No Hidden Costs Identified</h5>
                        <p className="text-sm text-muted-foreground mt-1">Your contract appears to have transparent pricing.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Volume Tab */}
                <TabsContent value="volume" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Volume Utilization */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-[#0F4C81]" />
                        Volume Commitment Status
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Utilization Rate</span>
                            <span className={`font-bold text-lg ${result.volumeCommitment.utilizationRate >= 90 ? "text-green-600" : result.volumeCommitment.utilizationRate >= 80 ? "text-amber-600" : "text-red-600"}`}>
                              {result.volumeCommitment.utilizationRate.toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={result.volumeCommitment.utilizationRate}
                            className="h-3"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-2xl font-bold">{result.volumeCommitment.committed}</p>
                            <p className="text-sm text-muted-foreground">Committed TEU</p>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                            <p className="text-2xl font-bold">{result.volumeCommitment.utilized}</p>
                            <p className="text-sm text-muted-foreground">Actual TEU</p>
                          </div>
                        </div>

                        {result.volumeCommitment.shortfallPenalty > 0 && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-5 w-5" />
                              <span className="font-semibold">Shortfall Penalty Exposure</span>
                            </div>
                            <p className="text-2xl font-bold text-red-600 mt-2">
                              {formatValue(result.volumeCommitment.shortfallPenalty)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Potential penalty for {result.volumeCommitment.committed - result.volumeCommitment.utilized} TEU shortfall
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Volume Trend */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                        Volume Trend
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={volumeTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="committed" 
                              stroke={COLORS.logistics} 
                              strokeDasharray="5 5"
                              strokeWidth={2}
                              dot={false}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="actual" 
                              stroke={COLORS.ocean} 
                              strokeWidth={2}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Recommendations Tab */}
                <TabsContent value="recommendations" className="pt-6">
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="p-6 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-xl border border-[#0F4C81]/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-[#2E8B57]" />
                            Negotiation Recommendations
                          </h4>
                          <p className="text-muted-foreground mt-1">
                            {result.recommendations.length} actionable recommendations
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-[#2E8B57]">
                            {formatValue(result.recommendations.reduce((sum, r) => sum + r.potentialSavings, 0))}
                          </p>
                          <p className="text-sm text-muted-foreground">Potential Savings</p>
                        </div>
                      </div>
                    </div>

                    {/* Recommendations List */}
                    {result.recommendations.length > 0 ? (
                      <div className="space-y-4">
                        {result.recommendations.map((r, i) => (
                          <Card key={i} className={`border-l-4 ${r.priority === "high" ? "border-l-red-500" : r.priority === "medium" ? "border-l-amber-500" : "border-l-blue-500"}`}>
                            <CardContent className="pt-4 pb-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={`${r.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : r.priority === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                                      {r.priority.toUpperCase()}
                                    </Badge>
                                    <span className="font-semibold">{r.category}</span>
                                  </div>
                                  <p className="text-muted-foreground">{r.suggestion}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <p className="font-bold text-[#2E8B57]">{formatValue(r.potentialSavings)}</p>
                                  <p className="text-xs text-muted-foreground">potential savings</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <h5 className="font-semibold text-green-700 dark:text-green-400">Contract Well Optimized</h5>
                        <p className="text-sm text-muted-foreground mt-1">No major improvements recommended at this time.</p>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <Card className="bg-slate-50 dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-base">Quick Negotiation Checklist</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {[
                            "Request fuel index-linked BAF mechanism",
                            "Negotiate tiered volume discounts",
                            "Include force majeure clauses",
                            "Define clear free time terms",
                            "Establish rate review mechanisms",
                            "Include performance guarantees",
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
