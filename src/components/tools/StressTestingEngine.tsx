"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Zap,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  LineChart,
  RefreshCw,
  Shield,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Info,
  ArrowDown,
  ArrowRight,
  Activity,
  Target,
  PieChart,
  Layers,
  GitBranch,
  Timer,
  Network,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
  ComposedChart,
  Line,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Risk factor definitions
const RISK_FACTORS = {
  supply_chain_disruption: {
    name: "Supply Chain Disruption",
    description: "Port closures, supplier failures, logistics bottlenecks",
    icon: Network,
    baseImpact: 0.15,
    maxSeverity: 0.5,
  },
  demand_shock: {
    name: "Demand Shock",
    description: "Sudden drop in customer demand, market contraction",
    icon: TrendingDown,
    baseImpact: 0.12,
    maxSeverity: 0.4,
  },
  cost_increase: {
    name: "Cost Increase",
    description: "Raw material prices, labor costs, energy costs",
    icon: DollarSign,
    baseImpact: 0.1,
    maxSeverity: 0.35,
  },
  fx_volatility: {
    name: "FX Volatility",
    description: "Currency fluctuations affecting trade costs",
    icon: Activity,
    baseImpact: 0.08,
    maxSeverity: 0.25,
  },
  regulatory_change: {
    name: "Regulatory Change",
    description: "New tariffs, trade restrictions, compliance costs",
    icon: Shield,
    baseImpact: 0.07,
    maxSeverity: 0.3,
  },
  weather_event: {
    name: "Weather/Climate Event",
    description: "Natural disasters, extreme weather affecting operations",
    icon: AlertTriangle,
    baseImpact: 0.09,
    maxSeverity: 0.45,
  },
};

// Severity level definitions
const SEVERITY_LEVELS = {
  mild: { name: "Mild", multiplier: 0.5, color: "#F59E0B", description: "Minor disruptions, quick recovery" },
  moderate: { name: "Moderate", multiplier: 1.0, color: "#F97316", description: "Significant impact, 1-3 month recovery" },
  severe: { name: "Severe", multiplier: 1.5, color: "#EF4444", description: "Major disruption, 3-6 month recovery" },
  extreme: { name: "Extreme", multiplier: 2.0, color: "#991B1B", description: "Catastrophic, 6+ month recovery" },
};

// Predefined stress scenarios
const PREDEFINED_SCENARIOS = {
  covid_like: {
    name: "COVID-like Pandemic",
    description: "Global supply chain disruption with demand collapse",
    factors: {
      supply_chain_disruption: { severity: "severe", active: true },
      demand_shock: { severity: "severe", active: true },
      cost_increase: { severity: "moderate", active: true },
      fx_volatility: { severity: "moderate", active: true },
    },
  },
  suez_blockage: {
    name: "Suez Canal Blockage",
    description: "Major trade route disruption",
    factors: {
      supply_chain_disruption: { severity: "severe", active: true },
      cost_increase: { severity: "moderate", active: true },
      demand_shock: { severity: "mild", active: true },
    },
  },
  trade_war: {
    name: "Trade War Escalation",
    description: "Tariff increases and trade restrictions",
    factors: {
      regulatory_change: { severity: "severe", active: true },
      cost_increase: { severity: "moderate", active: true },
      fx_volatility: { severity: "moderate", active: true },
      demand_shock: { severity: "moderate", active: true },
    },
  },
  recession: {
    name: "Economic Recession",
    description: "Demand collapse with cost pressures",
    factors: {
      demand_shock: { severity: "severe", active: true },
      cost_increase: { severity: "moderate", active: true },
      fx_volatility: { severity: "moderate", active: true },
    },
  },
  natural_disaster: {
    name: "Major Natural Disaster",
    description: "Regional supply chain disruption",
    factors: {
      weather_event: { severity: "severe", active: true },
      supply_chain_disruption: { severity: "moderate", active: true },
      cost_increase: { severity: "mild", active: true },
    },
  },
};

// Risk factor correlations (simplified correlation matrix)
const CORRELATION_MATRIX: Record<string, Record<string, number>> = {
  supply_chain_disruption: {
    demand_shock: 0.3,
    cost_increase: 0.6,
    fx_volatility: 0.2,
    regulatory_change: 0.25,
    weather_event: 0.5,
  },
  demand_shock: {
    supply_chain_disruption: 0.3,
    cost_increase: 0.4,
    fx_volatility: 0.35,
    regulatory_change: 0.45,
    weather_event: 0.15,
  },
  cost_increase: {
    supply_chain_disruption: 0.6,
    demand_shock: 0.4,
    fx_volatility: 0.5,
    regulatory_change: 0.55,
    weather_event: 0.3,
  },
  fx_volatility: {
    supply_chain_disruption: 0.2,
    demand_shock: 0.35,
    cost_increase: 0.5,
    regulatory_change: 0.6,
    weather_event: 0.1,
  },
  regulatory_change: {
    supply_chain_disruption: 0.25,
    demand_shock: 0.45,
    cost_increase: 0.55,
    fx_volatility: 0.6,
    weather_event: 0.05,
  },
  weather_event: {
    supply_chain_disruption: 0.5,
    demand_shock: 0.15,
    cost_increase: 0.3,
    fx_volatility: 0.1,
    regulatory_change: 0.05,
  },
};

interface RiskFactorConfig {
  severity: keyof typeof SEVERITY_LEVELS;
  active: boolean;
}

interface StressTestResult {
  baselineRevenue: number;
  totalImpact: number;
  impactPercentage: number;
  adjustedRevenue: number;
  factorImpacts: { factor: string; impact: number; percentage: number }[];
  propagationEffects: { stage: string; impact: number }[];
  recoveryTime: number; // in months
  recoveryCurve: { month: number; recovery: number }[];
  riskScore: number;
  correlations: { factor1: string; factor2: string; correlation: number }[];
  scenarioComparison: { scenario: string; impact: number }[];
  waterfallData: { name: string; value: number; type: string }[];
}

export function StressTestingEngine() {
  const [activeTab, setActiveTab] = useState("baseline");
  const [currency, setCurrency] = useState("USD");

  // Baseline parameters
  const [annualRevenue, setAnnualRevenue] = useState("10000000");
  const [operatingMargin, setOperatingMargin] = useState("15");
  const [inventoryValue, setInventoryValue] = useState("2000000");
  const [tradeVolume, setTradeVolume] = useState("500"); // containers per year

  // Risk factor configurations
  const [factorConfigs, setFactorConfigs] = useState<Record<string, RiskFactorConfig>>({
    supply_chain_disruption: { severity: "moderate", active: false },
    demand_shock: { severity: "moderate", active: false },
    cost_increase: { severity: "moderate", active: false },
    fx_volatility: { severity: "moderate", active: false },
    regulatory_change: { severity: "moderate", active: false },
    weather_event: { severity: "moderate", active: false },
  });

  // Selected predefined scenario
  const [selectedScenario, setSelectedScenario] = useState<string>("");

  const toggleFactor = (factorKey: string) => {
    setFactorConfigs((prev) => ({
      ...prev,
      [factorKey]: { ...prev[factorKey], active: !prev[factorKey].active },
    }));
  };

  const setFactorSeverity = (factorKey: string, severity: keyof typeof SEVERITY_LEVELS) => {
    setFactorConfigs((prev) => ({
      ...prev,
      [factorKey]: { ...prev[factorKey], severity },
    }));
  };

  const applyPredefinedScenario = (scenarioKey: string) => {
    if (!scenarioKey) return;
    const scenario = PREDEFINED_SCENARIOS[scenarioKey as keyof typeof PREDEFINED_SCENARIOS];
    if (!scenario) return;

    const newConfigs = { ...factorConfigs };
    Object.keys(newConfigs).forEach((key) => {
      newConfigs[key] = { severity: "moderate", active: false };
    });

    Object.entries(scenario.factors).forEach(([key, value]) => {
      newConfigs[key] = value as RiskFactorConfig;
    });

    setFactorConfigs(newConfigs);
    setSelectedScenario(scenarioKey);
  };

  // Calculate stress test results
  const result = useMemo<StressTestResult | null>(() => {
    const revenue = parseFloat(annualRevenue) || 10000000;
    const margin = parseFloat(operatingMargin) / 100 || 0.15;
    const inventory = parseFloat(inventoryValue) || 2000000;
    const volume = parseFloat(tradeVolume) || 500;

    // Calculate individual factor impacts
    const factorImpacts: { factor: string; impact: number; percentage: number }[] = [];
    let totalImpact = 0;

    Object.entries(factorConfigs).forEach(([key, config]) => {
      if (!config.active) return;

      const factor = RISK_FACTORS[key as keyof typeof RISK_FACTORS];
      const severity = SEVERITY_LEVELS[config.severity];
      const impactMultiplier = severity.multiplier;

      // Base impact calculation
      let factorImpact = revenue * factor.baseImpact * impactMultiplier;

      // Adjust for business characteristics
      if (key === "supply_chain_disruption") {
        factorImpact *= 1 + volume / 1000; // Higher volume = higher supply chain risk
      } else if (key === "demand_shock") {
        factorImpact *= margin; // Impact scales with margin
      } else if (key === "fx_volatility") {
        factorImpact *= 0.5; // Assume 50% international exposure
      }

      totalImpact += factorImpact;
      factorImpacts.push({
        factor: factor.name,
        impact: factorImpact,
        percentage: (factorImpact / revenue) * 100,
      });
    });

    // Apply correlation adjustments
    const activeFactors = Object.entries(factorConfigs)
      .filter(([, config]) => config.active)
      .map(([key]) => key);

    let correlationBoost = 1;
    if (activeFactors.length > 1) {
      for (let i = 0; i < activeFactors.length; i++) {
        for (let j = i + 1; j < activeFactors.length; j++) {
          const corr =
            CORRELATION_MATRIX[activeFactors[i]]?.[activeFactors[j]] || 0;
          correlationBoost += corr * 0.1; // Add correlation boost
        }
      }
    }

    totalImpact *= correlationBoost;
    const impactPercentage = (totalImpact / revenue) * 100;
    const adjustedRevenue = revenue - totalImpact;

    // Propagation effects (how impact spreads through supply chain)
    const propagationEffects = [
      { stage: "Direct Impact", impact: totalImpact * 0.6 },
      { stage: "Supplier Effects", impact: totalImpact * 0.2 },
      { stage: "Customer Effects", impact: totalImpact * 0.15 },
      { stage: "Market Effects", impact: totalImpact * 0.05 },
    ];

    // Recovery time estimation
    const avgSeverity = activeFactors.reduce((sum, key) => {
      const config = factorConfigs[key];
      return sum + SEVERITY_LEVELS[config.severity].multiplier;
    }, 0) / (activeFactors.length || 1);

    const baseRecoveryMonths = 2 + avgSeverity * 3;
    const recoveryTime = Math.ceil(baseRecoveryMonths * (1 + activeFactors.length * 0.2));

    // Recovery curve
    const recoveryCurve = [];
    for (let month = 0; month <= recoveryTime + 6; month++) {
      const progress = month / recoveryTime;
      const recovery = Math.min(100, 100 * (1 - Math.exp(-2 * progress)));
      recoveryCurve.push({ month, recovery });
    }

    // Risk score (1-100)
    const riskScore = Math.min(100, Math.round(
      (impactPercentage * 2) + (activeFactors.length * 5) + (avgSeverity * 20)
    ));

    // Correlations for active factors
    const correlations = [];
    for (let i = 0; i < activeFactors.length; i++) {
      for (let j = i + 1; j < activeFactors.length; j++) {
        const corr = CORRELATION_MATRIX[activeFactors[i]]?.[activeFactors[j]] || 0;
        correlations.push({
          factor1: RISK_FACTORS[activeFactors[i] as keyof typeof RISK_FACTORS].name,
          factor2: RISK_FACTORS[activeFactors[j] as keyof typeof RISK_FACTORS].name,
          correlation: corr,
        });
      }
    }

    // Scenario comparison
    const scenarioComparison = Object.entries(PREDEFINED_SCENARIOS).map(([key, scenario]) => {
      let scenarioImpact = 0;
      Object.entries(scenario.factors).forEach(([factorKey, factorConfig]) => {
        const factor = RISK_FACTORS[factorKey as keyof typeof RISK_FACTORS];
        const severity = SEVERITY_LEVELS[(factorConfig as RiskFactorConfig).severity];
        scenarioImpact += revenue * factor.baseImpact * severity.multiplier;
      });
      return {
        scenario: scenario.name,
        impact: scenarioImpact,
      };
    });

    // Waterfall chart data
    const waterfallData: { name: string; value: number; type: string }[] = [
      { name: "Baseline", value: revenue, type: "baseline" },
    ];

    factorImpacts.forEach((fi, index) => {
      waterfallData.push({
        name: fi.factor.split(" ")[0],
        value: -fi.impact,
        type: "impact",
      });
    });

    waterfallData.push({
      name: "Adjusted",
      value: adjustedRevenue,
      type: "result",
    });

    return {
      baselineRevenue: revenue,
      totalImpact,
      impactPercentage,
      adjustedRevenue,
      factorImpacts,
      propagationEffects,
      recoveryTime,
      recoveryCurve,
      riskScore,
      correlations,
      scenarioComparison,
      waterfallData,
    };
  }, [annualRevenue, operatingMargin, inventoryValue, tradeVolume, factorConfigs]);

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    accent: "#8B5CF6",
  };

  // Radar chart data for scenario comparison
  const radarData = useMemo(() => {
    if (!result) return [];

    const dimensions = [
      "Financial Impact",
      "Recovery Time",
      "Risk Score",
      "Factor Count",
      "Correlation Risk",
    ];

    return dimensions.map((dim) => {
      const activeFactors = Object.values(factorConfigs).filter((c) => c.active).length;
      const maxCorr = result.correlations.length > 0
        ? Math.max(...result.correlations.map((c) => c.correlation))
        : 0;

      const values: Record<string, number> = {
        "Financial Impact": Math.min(100, result.impactPercentage * 4),
        "Recovery Time": Math.min(100, result.recoveryTime * 8),
        "Risk Score": result.riskScore,
        "Factor Count": activeFactors * 16,
        "Correlation Risk": maxCorr * 100,
      };

      return {
        dimension: dim,
        value: values[dim] || 0,
        fullMark: 100,
      };
    });
  }, [result, factorConfigs]);

  const getRiskLevel = (score: number): { level: string; color: string } => {
    if (score < 30) return { level: "Low", color: chartColors.logistics };
    if (score < 50) return { level: "Moderate", color: chartColors.warning };
    if (score < 70) return { level: "High", color: "#F97316" };
    return { level: "Critical", color: chartColors.danger };
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="baseline">Baseline</TabsTrigger>
          <TabsTrigger value="scenarios">Stress Scenarios</TabsTrigger>
          <TabsTrigger value="results">Impact Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="learn">Learn</TabsTrigger>
        </TabsList>

        {/* Baseline Tab */}
        <TabsContent value="baseline" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Baseline Scenario
                </CardTitle>
                <CardDescription>
                  Define your normal operating conditions
                </CardDescription>
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

                <div>
                  <Label htmlFor="annualRevenue">Annual Revenue</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="annualRevenue"
                      type="number"
                      value={annualRevenue}
                      onChange={(e) => setAnnualRevenue(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="operatingMargin">Operating Margin (%)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[parseFloat(operatingMargin)]}
                      onValueChange={(v) => setOperatingMargin(v[0].toString())}
                      min={1}
                      max={40}
                      step={0.5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1%</span>
                      <span className="font-medium text-[var(--ocean)]">
                        {operatingMargin}%
                      </span>
                      <span>40%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="inventoryValue">Inventory Value</Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="inventoryValue"
                      type="number"
                      value={inventoryValue}
                      onChange={(e) => setInventoryValue(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tradeVolume">Annual Trade Volume (Containers)</Label>
                  <Input
                    id="tradeVolume"
                    type="number"
                    value={tradeVolume}
                    onChange={(e) => setTradeVolume(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--ocean)]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Baseline Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Annual Revenue</p>
                      <p className="text-2xl font-bold text-[var(--ocean)]">
                        {formatCurrency(parseFloat(annualRevenue) || 0, currency)}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Operating Profit</p>
                      <p className="text-2xl font-bold text-[var(--logistics)]">
                        {formatCurrency(
                          (parseFloat(annualRevenue) * parseFloat(operatingMargin)) / 100 || 0,
                          currency
                        )}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inventory Value</span>
                      <span className="font-medium">
                        {formatCurrency(parseFloat(inventoryValue) || 0, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trade Volume</span>
                      <span className="font-medium">{tradeVolume} containers/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Inventory Turnover</span>
                      <span className="font-medium">
                        {((parseFloat(annualRevenue) / parseFloat(inventoryValue)) || 0).toFixed(1)}x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue per Container</span>
                      <span className="font-medium">
                        {formatCurrency(
                          (parseFloat(annualRevenue) / parseFloat(tradeVolume)) || 0,
                          currency
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stress Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                Predefined Stress Scenarios
              </CardTitle>
              <CardDescription>
                Select a predefined scenario or customize your own
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {Object.entries(PREDEFINED_SCENARIOS).map(([key, scenario]) => (
                  <div
                    key={key}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedScenario === key
                        ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                        : "hover:border-[var(--ocean)]/50"
                    }`}
                    onClick={() => applyPredefinedScenario(key)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{scenario.name}</h4>
                      {selectedScenario === key && (
                        <CheckCircle2 className="h-5 w-5 text-[var(--ocean)]" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{scenario.description}</p>
                    <div className="flex gap-2 mt-3">
                      {Object.entries(scenario.factors).map(([factorKey, factorConfig]) => (
                        <Badge
                          key={factorKey}
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor:
                              SEVERITY_LEVELS[(factorConfig as RiskFactorConfig).severity].color,
                            color: SEVERITY_LEVELS[(factorConfig as RiskFactorConfig).severity].color,
                          }}
                        >
                          {(factorConfig as RiskFactorConfig).severity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                Custom Risk Factors
              </CardTitle>
              <CardDescription>
                Toggle and configure individual risk factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(RISK_FACTORS).map(([key, factor]) => {
                  const config = factorConfigs[key];
                  const Icon = factor.icon;

                  return (
                    <div
                      key={key}
                      className={`p-4 border rounded-lg ${
                        config.active ? "border-[var(--ocean)] bg-[var(--ocean)]/5" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-[var(--ocean)]" />
                          <div>
                            <h4 className="font-medium">{factor.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {factor.description}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={config.active}
                          onCheckedChange={() => toggleFactor(key)}
                        />
                      </div>

                      {config.active && (
                        <div className="mt-3 pt-3 border-t">
                          <Label className="text-sm">Severity Level</Label>
                          <div className="flex gap-2 mt-2">
                            {Object.entries(SEVERITY_LEVELS).map(([sevKey, sev]) => (
                              <Button
                                key={sevKey}
                                size="sm"
                                variant={config.severity === sevKey ? "default" : "outline"}
                                className={
                                  config.severity === sevKey
                                    ? "text-white"
                                    : ""
                                }
                                style={{
                                  backgroundColor:
                                    config.severity === sevKey ? sev.color : undefined,
                                  borderColor: sev.color,
                                  color:
                                    config.severity === sevKey ? "white" : sev.color,
                                }}
                                onClick={() =>
                                  setFactorSeverity(key, sevKey as keyof typeof SEVERITY_LEVELS)
                                }
                              >
                                {sev.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFactorConfigs({
                      supply_chain_disruption: { severity: "moderate", active: false },
                      demand_shock: { severity: "moderate", active: false },
                      cost_increase: { severity: "moderate", active: false },
                      fx_volatility: { severity: "moderate", active: false },
                      regulatory_change: { severity: "moderate", active: false },
                      weather_event: { severity: "moderate", active: false },
                    });
                    setSelectedScenario("");
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Analysis Tab */}
        <TabsContent value="results" className="space-y-6 mt-6">
          {result && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean)]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Baseline</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(result.baselineRevenue, currency)}
                    </p>
                    <p className="text-sm opacity-80 mt-1">Annual Revenue</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-destructive to-destructive/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingDown className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Impact</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {formatCurrency(result.totalImpact, currency)}
                    </p>
                    <p className="text-sm opacity-80 mt-1">
                      {result.impactPercentage.toFixed(1)}% of Revenue
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[var(--logistics)] to-[var(--logistics)]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Timer className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Recovery</span>
                    </div>
                    <p className="text-2xl font-bold">{result.recoveryTime} months</p>
                    <p className="text-sm opacity-80 mt-1">Estimated Recovery</p>
                  </CardContent>
                </Card>

                <Card
                  className="text-white"
                  style={{
                    background: `linear-gradient(to bottom right, ${
                      getRiskLevel(result.riskScore).color
                    }, ${getRiskLevel(result.riskScore).color}CC)`,
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTriangle className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Risk</span>
                    </div>
                    <p className="text-2xl font-bold">{result.riskScore}/100</p>
                    <p className="text-sm opacity-80 mt-1">
                      {getRiskLevel(result.riskScore).level} Risk
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Impact Waterfall Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                    Impact Waterfall Chart
                  </CardTitle>
                  <CardDescription>
                    Visual breakdown of how each risk factor affects revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={result.waterfallData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis
                          tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
                          tick={{ fontSize: 11 }}
                        />
                        <Tooltip
                          formatter={(value: number) => formatCurrency(Math.abs(value), currency)}
                        />
                        <Bar
                          dataKey="value"
                          radius={[4, 4, 0, 0]}
                          fill={chartColors.ocean}
                        >
                          {result.waterfallData.map((entry, index) => (
                            <rect
                              key={`cell-${index}`}
                              fill={
                                entry.type === "baseline"
                                  ? chartColors.logistics
                                  : entry.type === "impact"
                                  ? chartColors.danger
                                  : chartColors.ocean
                              }
                            />
                          ))}
                        </Bar>
                        <ReferenceLine y={0} stroke="#666" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Factor Impacts & Recovery */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-[var(--ocean)]" />
                      Factor Impact Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.factorImpacts.length > 0 ? (
                      <div className="space-y-4">
                        {result.factorImpacts.map((fi, index) => (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{fi.factor}</span>
                              <Badge variant="destructive">
                                {fi.percentage.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Impact Amount</span>
                              <span className="font-medium text-destructive">
                                -{formatCurrency(fi.impact, currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No risk factors selected</p>
                        <p className="text-sm">Select factors in the Stress Scenarios tab</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[var(--ocean)]" />
                      Recovery Curve
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={result.recoveryCurve}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                          <Tooltip
                            formatter={(value: number) => [`${value.toFixed(1)}%`, "Recovery"]}
                            labelFormatter={(label) => `Month ${label}`}
                          />
                          <Area
                            type="monotone"
                            dataKey="recovery"
                            stroke={chartColors.logistics}
                            fill={chartColors.logistics}
                            fillOpacity={0.3}
                          />
                          <ReferenceLine
                            y={100}
                            stroke={chartColors.logistics}
                            strokeDasharray="5 5"
                            label="Full Recovery"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Estimated {result.recoveryTime} months to 95% recovery
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Impact Propagation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-[var(--ocean)]" />
                    Impact Propagation Model
                  </CardTitle>
                  <CardDescription>
                    How stress impacts spread through your supply chain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    {result.propagationEffects.map((effect, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          <p className="font-medium text-sm mb-2">{effect.stage}</p>
                          <p className="text-xl font-bold text-destructive">
                            {formatCurrency(effect.impact, currency)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {((effect.impact / result.totalImpact) * 100).toFixed(0)}% of total
                          </p>
                        </div>
                        {index < result.propagationEffects.length - 1 && (
                          <ArrowRight className="absolute -right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hidden md:block" />
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {result.correlations.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Factor Correlation Alert</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Active risk factors have correlations ranging from{" "}
                            {(Math.min(...result.correlations.map((c) => c.correlation)) * 100).toFixed(0)}%
                            to {(Math.max(...result.correlations.map((c) => c.correlation)) * 100).toFixed(0)}%
                            . Combined impact may be amplified due to correlation effects.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-[var(--ocean)]" />
                    Scenario Comparison Radar
                  </CardTitle>
                  <CardDescription>
                    Visual comparison of stress test metrics across dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                          name="Stress Impact"
                          dataKey="value"
                          stroke={chartColors.ocean}
                          fill={chartColors.ocean}
                          fillOpacity={0.5}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                    Predefined Scenario Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.scenarioComparison} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                        <YAxis dataKey="scenario" type="category" width={150} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                        <Bar dataKey="impact" fill={chartColors.ocean} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 p-4 bg-[var(--ocean)]/5 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Interpreting Scenario Impacts</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Higher bars indicate more severe financial impact. Consider diversifying
                          risk exposure to reduce vulnerability to any single scenario type.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factor Correlation Matrix */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-[var(--ocean)]" />
                    Risk Factor Correlations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="p-2 text-left">Factor</th>
                          {Object.keys(RISK_FACTORS).map((key) => (
                            <th key={key} className="p-2 text-center text-xs">
                              {RISK_FACTORS[key as keyof typeof RISK_FACTORS].name.split(" ")[0]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(CORRELATION_MATRIX).map(([factor1, correlations]) => (
                          <tr key={factor1}>
                            <td className="p-2 font-medium text-xs">
                              {RISK_FACTORS[factor1 as keyof typeof RISK_FACTORS].name.split(" ")[0]}
                            </td>
                            {Object.keys(RISK_FACTORS).map((factor2) => {
                              const corr =
                                factor1 === factor2
                                  ? 1
                                  : correlations[factor2] ||
                                    CORRELATION_MATRIX[factor2]?.[factor1] ||
                                    0;
                              const intensity = Math.abs(corr);
                              const color =
                                factor1 === factor2
                                  ? "bg-[var(--ocean)]"
                                  : corr > 0.4
                                  ? "bg-destructive/50"
                                  : corr > 0.2
                                  ? "bg-yellow-500/50"
                                  : "bg-muted";

                              return (
                                <td key={factor2} className="p-1">
                                  <div
                                    className={`w-full h-8 flex items-center justify-center rounded ${color}`}
                                  >
                                    <span className="text-xs">{(corr * 100).toFixed(0)}%</span>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 flex gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-destructive/50 rounded" />
                      <span>High Correlation (&gt;40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500/50 rounded" />
                      <span>Moderate (20-40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-muted rounded" />
                      <span>Low (&lt;20%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Learn Tab */}
        <TabsContent value="learn" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                Understanding Supply Chain Stress Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="what-is">
                  <AccordionTrigger>What is Supply Chain Stress Testing?</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Supply chain stress testing is a risk management technique that simulates
                        extreme but plausible scenarios to assess potential financial impacts on
                        your supply chain operations.
                      </p>
                      <p>
                        Similar to stress tests conducted by banks and financial institutions, supply
                        chain stress tests help organizations identify vulnerabilities and prepare
                        contingency plans before disruptions occur.
                      </p>
                      <div className="p-4 bg-[var(--ocean)]/5 rounded-lg mt-4">
                        <p className="font-medium text-[var(--ocean)]">Key Benefits:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Identify critical vulnerabilities before they become problems</li>
                          <li>Quantify potential financial impacts of disruptions</li>
                          <li>Test effectiveness of risk mitigation strategies</li>
                          <li>Support informed decision-making for risk investments</li>
                          <li>Meet regulatory and stakeholder expectations</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="risk-factors">
                  <AccordionTrigger>Understanding Risk Factors</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {Object.entries(RISK_FACTORS).map(([key, factor]) => {
                        const Icon = factor.icon;
                        return (
                          <div key={key} className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className="h-5 w-5 text-[var(--ocean)]" />
                              <span className="font-medium">{factor.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {factor.description}
                            </p>
                            <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                              <span>Base Impact: {(factor.baseImpact * 100).toFixed(0)}%</span>
                              <span>Max Severity: {(factor.maxSeverity * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="severity">
                  <AccordionTrigger>Severity Levels Explained</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {Object.entries(SEVERITY_LEVELS).map(([key, level]) => (
                        <div
                          key={key}
                          className="p-4 rounded-lg border-l-4"
                          style={{ borderLeftColor: level.color }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{level.name}</span>
                            <Badge variant="outline" style={{ borderColor: level.color, color: level.color }}>
                              {level.multiplier}x multiplier
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="propagation">
                  <AccordionTrigger>Impact Propagation Model</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Supply chain disruptions rarely stay isolated. The impact propagation model
                        shows how initial shocks spread through interconnected supply chain networks:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="font-medium text-[var(--ocean)]">Direct Impact (60%)</p>
                          <p className="mt-1">
                            Immediate effects on your operations: lost sales, production downtime,
                            emergency procurement costs.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="font-medium text-[var(--ocean)]">Supplier Effects (20%)</p>
                          <p className="mt-1">
                            Cascading effects from supplier disruptions: quality issues, delays,
                            capacity constraints.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="font-medium text-[var(--ocean)]">Customer Effects (15%)</p>
                          <p className="mt-1">
                            Downstream impacts: lost customers, contractual penalties,
                            reputation damage.
                          </p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="font-medium text-[var(--ocean)]">Market Effects (5%)</p>
                          <p className="mt-1">
                            Broader market impacts: price changes, competitive shifts,
                            regulatory responses.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="recovery">
                  <AccordionTrigger>Recovery Time Estimation</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Recovery time is estimated based on the severity of stress factors and the
                        number of simultaneous disruptions. The model uses an exponential recovery
                        curve that reflects real-world supply chain recovery patterns.
                      </p>
                      <div className="p-4 bg-[var(--logistics)]/5 rounded-lg mt-4">
                        <p className="font-medium text-[var(--logistics)]">Recovery Factors:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Base recovery depends on average severity level</li>
                          <li>Multiple simultaneous factors extend recovery time</li>
                          <li>Correlation between factors can amplify recovery duration</li>
                          <li>Recovery typically follows an S-curve pattern</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="best-practices">
                  <AccordionTrigger>Best Practices for Stress Testing</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium text-[var(--ocean)]">1. Regular Testing Cadence</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Conduct stress tests at least quarterly and after significant changes to
                          your supply chain structure or market conditions.
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium text-[var(--ocean)]">2. Scenario Diversity</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Include both historical scenarios (what has happened) and hypothetical
                          scenarios (what could happen) to capture a full range of risks.
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium text-[var(--ocean)]">3. Cross-Functional Input</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Involve stakeholders from procurement, operations, finance, and risk
                          management to ensure comprehensive scenario coverage.
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium text-[var(--ocean)]">4. Action Planning</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use stress test results to develop specific mitigation strategies and
                          contingency plans with clear ownership and timelines.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
