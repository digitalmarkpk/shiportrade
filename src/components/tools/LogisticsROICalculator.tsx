"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  BarChart3,
  Download,
  Share2,
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  PieChart,
  LineChart as LineChartIcon,
  Zap,
  Building2,
  Truck,
  Warehouse,
} from "lucide-react";
import {
  LineChart,
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
  ReferenceLine,
  ComposedChart,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Types
interface InvestmentInputs {
  initialInvestment: number;
  implementationCost: number;
  trainingCost: number;
  integrationCost: number;
  ongoingCosts: number;
  projectLifespan: number;
  discountRate: number;
  taxRate: number;
}

interface SavingsInputs {
  laborSavings: number;
  freightSavings: number;
  inventorySavings: number;
  warehouseSavings: number;
  adminSavings: number;
  errorReduction: number;
  insuranceSavings: number;
  otherSavings: number;
}

interface CashFlow {
  year: number;
  investment: number;
  costs: number;
  savings: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  discountedCashFlow: number;
  cumulativeDiscounted: number;
}

interface ROIResults {
  totalInvestment: number;
  totalAnnualSavings: number;
  annualNetBenefit: number;
  simpleROI: number;
  paybackPeriod: number;
  discountedPayback: number;
  npv: number;
  irr: number;
  profitabilityIndex: number;
  breakEvenYear: number;
  fiveYearBenefit: number;
  tenYearBenefit: number;
  mvp: number;
  riskAdjustedROI: number;
}

const chartColors = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  teal: "#14B8A6",
};

const PIE_COLORS = [chartColors.ocean, chartColors.logistics, chartColors.warning, chartColors.purple, chartColors.teal, chartColors.danger, "#6366F1", "#EC4899"];

export function LogisticsROICalculator() {
  const [activeTab, setActiveTab] = useState("investment");
  const [currency, setCurrency] = useState("USD");

  // Investment inputs
  const [initialInvestment, setInitialInvestment] = useState("150000");
  const [implementationCost, setImplementationCost] = useState("25000");
  const [trainingCost, setTrainingCost] = useState("10000");
  const [integrationCost, setIntegrationCost] = useState("15000");
  const [ongoingCosts, setOngoingCosts] = useState("12000");
  const [projectLifespan, setProjectLifespan] = useState("5");
  const [discountRate, setDiscountRate] = useState("10");
  const [taxRate, setTaxRate] = useState("25");

  // Savings inputs
  const [laborSavings, setLaborSavings] = useState("45000");
  const [freightSavings, setFreightSavings] = useState("35000");
  const [inventorySavings, setInventorySavings] = useState("25000");
  const [warehouseSavings, setWarehouseSavings] = useState("18000");
  const [adminSavings, setAdminSavings] = useState("12000");
  const [errorReduction, setErrorReduction] = useState("8000");
  const [insuranceSavings, setInsuranceSavings] = useState("5000");
  const [otherSavings, setOtherSavings] = useState("2000");

  // Sensitivity inputs
  const [sensitivityRange, setSensitivityRange] = useState(30);

  const parseNum = (val: string) => parseFloat(val) || 0;

  // Calculate all results
  const results = useMemo((): ROIResults => {
    const investment: InvestmentInputs = {
      initialInvestment: parseNum(initialInvestment),
      implementationCost: parseNum(implementationCost),
      trainingCost: parseNum(trainingCost),
      integrationCost: parseNum(integrationCost),
      ongoingCosts: parseNum(ongoingCosts),
      projectLifespan: parseNum(projectLifespan),
      discountRate: parseNum(discountRate) / 100,
      taxRate: parseNum(taxRate) / 100,
    };

    const savings: SavingsInputs = {
      laborSavings: parseNum(laborSavings),
      freightSavings: parseNum(freightSavings),
      inventorySavings: parseNum(inventorySavings),
      warehouseSavings: parseNum(warehouseSavings),
      adminSavings: parseNum(adminSavings),
      errorReduction: parseNum(errorReduction),
      insuranceSavings: parseNum(insuranceSavings),
      otherSavings: parseNum(otherSavings),
    };

    const totalInvestment = investment.initialInvestment + investment.implementationCost + investment.trainingCost + investment.integrationCost;
    const totalAnnualSavings = Object.values(savings).reduce((a, b) => a + b, 0);
    const annualNetBenefit = (totalAnnualSavings - investment.ongoingCosts) * (1 - investment.taxRate);
    const simpleROI = totalInvestment > 0 ? (annualNetBenefit / totalInvestment) * 100 : 0;

    // Payback period
    const paybackPeriod = annualNetBenefit > 0 ? totalInvestment / annualNetBenefit : 999;

    // Calculate cash flows for NPV and IRR
    const years = investment.projectLifespan;
    const r = investment.discountRate;

    // NPV calculation
    let npv = -totalInvestment;
    for (let year = 1; year <= years; year++) {
      npv += annualNetBenefit / Math.pow(1 + r, year);
    }

    // IRR calculation using Newton-Raphson method
    const calculateIRR = (cashFlows: number[]): number => {
      let irr = 0.1; // Initial guess
      const maxIterations = 100;
      const tolerance = 0.0001;

      for (let i = 0; i < maxIterations; i++) {
        let npvAtIRR = 0;
        let derivativeNPV = 0;

        for (let j = 0; j < cashFlows.length; j++) {
          npvAtIRR += cashFlows[j] / Math.pow(1 + irr, j);
          derivativeNPV -= j * cashFlows[j] / Math.pow(1 + irr, j + 1);
        }

        if (Math.abs(npvAtIRR) < tolerance) break;
        if (Math.abs(derivativeNPV) < 1e-10) break;

        irr = irr - npvAtIRR / derivativeNPV;
        if (irr < -0.99) irr = -0.99;
        if (irr > 10) irr = 10;
      }

      return irr;
    };

    const cashFlows = [-totalInvestment];
    for (let year = 1; year <= years; year++) {
      cashFlows.push(annualNetBenefit);
    }
    const irr = calculateIRR(cashFlows);

    // Discounted payback period
    let cumulativeDiscounted = -totalInvestment;
    let discountedPayback = years;
    for (let year = 1; year <= years; year++) {
      cumulativeDiscounted += annualNetBenefit / Math.pow(1 + r, year);
      if (cumulativeDiscounted >= 0) {
        const prevCum = cumulativeDiscounted - annualNetBenefit / Math.pow(1 + r, year);
        discountedPayback = year - 1 + (Math.abs(prevCum) / (annualNetBenefit / Math.pow(1 + r, year)));
        break;
      }
    }

    // Profitability Index
    const pvOfBenefits = totalInvestment + npv;
    const profitabilityIndex = totalInvestment > 0 ? pvOfBenefits / totalInvestment : 0;

    // Break-even year
    const breakEvenYear = Math.ceil(paybackPeriod);

    // Multi-year benefits
    const fiveYearBenefit = annualNetBenefit * 5 - totalInvestment;
    const tenYearBenefit = annualNetBenefit * 10 - totalInvestment;

    // Maturity Value Projection (simplified)
    const mvp = totalAnnualSavings * years;

    // Risk-adjusted ROI (applying risk factor based on payback)
    const riskFactor = paybackPeriod <= 1 ? 1 : paybackPeriod <= 2 ? 0.95 : paybackPeriod <= 3 ? 0.85 : paybackPeriod <= 4 ? 0.75 : 0.65;
    const riskAdjustedROI = simpleROI * riskFactor;

    return {
      totalInvestment,
      totalAnnualSavings,
      annualNetBenefit,
      simpleROI,
      paybackPeriod,
      discountedPayback,
      npv,
      irr: irr * 100,
      profitabilityIndex,
      breakEvenYear,
      fiveYearBenefit,
      tenYearBenefit,
      mvp,
      riskAdjustedROI,
    };
  }, [
    initialInvestment, implementationCost, trainingCost, integrationCost,
    ongoingCosts, projectLifespan, discountRate, taxRate,
    laborSavings, freightSavings, inventorySavings, warehouseSavings,
    adminSavings, errorReduction, insuranceSavings, otherSavings
  ]);

  // Cash flow projections
  const cashFlows = useMemo((): CashFlow[] => {
    const years = parseNum(projectLifespan);
    const r = parseNum(discountRate) / 100;
    const totalInvestment = results.totalInvestment;
    const annualNetBenefit = results.annualNetBenefit;
    const ongoing = parseNum(ongoingCosts);

    const flows: CashFlow[] = [];
    let cumulativeCashFlow = -totalInvestment;
    let cumulativeDiscounted = -totalInvestment;

    // Year 0
    flows.push({
      year: 0,
      investment: totalInvestment,
      costs: 0,
      savings: 0,
      netCashFlow: -totalInvestment,
      cumulativeCashFlow: -totalInvestment,
      discountedCashFlow: -totalInvestment,
      cumulativeDiscounted: -totalInvestment,
    });

    for (let year = 1; year <= years; year++) {
      const netCF = annualNetBenefit;
      cumulativeCashFlow += netCF;
      const discountedCF = netCF / Math.pow(1 + r, year);
      cumulativeDiscounted += discountedCF;

      flows.push({
        year,
        investment: 0,
        costs: ongoing,
        savings: results.totalAnnualSavings,
        netCashFlow: netCF,
        cumulativeCashFlow,
        discountedCashFlow: discountedCF,
        cumulativeDiscounted,
      });
    }

    return flows;
  }, [results, projectLifespan, discountRate, ongoingCosts]);

  // Savings breakdown for pie chart
  const savingsBreakdown = useMemo(() => {
    const items = [
      { name: "Labor Savings", value: parseNum(laborSavings), icon: "👷" },
      { name: "Freight Savings", value: parseNum(freightSavings), icon: "🚢" },
      { name: "Inventory Savings", value: parseNum(inventorySavings), icon: "📦" },
      { name: "Warehouse Savings", value: parseNum(warehouseSavings), icon: "🏭" },
      { name: "Admin Savings", value: parseNum(adminSavings), icon: "📊" },
      { name: "Error Reduction", value: parseNum(errorReduction), icon: "✓" },
      { name: "Insurance Savings", value: parseNum(insuranceSavings), icon: "🛡️" },
      { name: "Other Savings", value: parseNum(otherSavings), icon: "💰" },
    ];
    return items.filter(item => item.value > 0);
  }, [laborSavings, freightSavings, inventorySavings, warehouseSavings, adminSavings, errorReduction, insuranceSavings, otherSavings]);

  // Investment breakdown
  const investmentBreakdown = useMemo(() => {
    return [
      { name: "Initial Investment", value: parseNum(initialInvestment) },
      { name: "Implementation", value: parseNum(implementationCost) },
      { name: "Training", value: parseNum(trainingCost) },
      { name: "Integration", value: parseNum(integrationCost) },
    ].filter(item => item.value > 0);
  }, [initialInvestment, implementationCost, trainingCost, integrationCost]);

  // Sensitivity analysis data
  const sensitivityData = useMemo(() => {
    const baseAnnualBenefit = results.annualNetBenefit;
    const totalInvestment = results.totalInvestment;
    const range = sensitivityRange;

    const data = [];
    for (let change = -range; change <= range; change += 5) {
      const adjustedBenefit = baseAnnualBenefit * (1 + change / 100);
      const adjustedROI = totalInvestment > 0 ? (adjustedBenefit / totalInvestment) * 100 : 0;
      const adjustedPayback = adjustedBenefit > 0 ? totalInvestment / adjustedBenefit : 99;
      const adjustedNPV = -totalInvestment + adjustedBenefit * (1 - Math.pow(1.1, -parseNum(projectLifespan))) / 0.1;

      data.push({
        change: `${change > 0 ? '+' : ''}${change}%`,
        roi: parseFloat(adjustedROI.toFixed(1)),
        payback: Math.min(adjustedPayback, 10),
        npv: adjustedNPV,
        benefit: adjustedBenefit,
      });
    }
    return data;
  }, [results, sensitivityRange, projectLifespan]);

  // Scenario comparison
  const scenarios = useMemo(() => {
    const base = results.annualNetBenefit;
    const inv = results.totalInvestment;

    return [
      {
        name: "Pessimistic (-20%)",
        benefit: base * 0.8,
        roi: ((base * 0.8) / inv) * 100,
        payback: inv / (base * 0.8),
        npv: -inv + base * 0.8 * (1 - Math.pow(1.1, -parseNum(projectLifespan))) / 0.1,
        color: chartColors.danger,
      },
      {
        name: "Conservative (-10%)",
        benefit: base * 0.9,
        roi: ((base * 0.9) / inv) * 100,
        payback: inv / (base * 0.9),
        npv: -inv + base * 0.9 * (1 - Math.pow(1.1, -parseNum(projectLifespan))) / 0.1,
        color: chartColors.warning,
      },
      {
        name: "Base Case",
        benefit: base,
        roi: (base / inv) * 100,
        payback: inv / base,
        npv: results.npv,
        color: chartColors.ocean,
      },
      {
        name: "Optimistic (+10%)",
        benefit: base * 1.1,
        roi: ((base * 1.1) / inv) * 100,
        payback: inv / (base * 1.1),
        npv: -inv + base * 1.1 * (1 - Math.pow(1.1, -parseNum(projectLifespan))) / 0.1,
        color: chartColors.logistics,
      },
    ];
  }, [results, projectLifespan]);

  // Helper functions
  const getROIColor = (roi: number) => {
    if (roi >= 30) return "text-green-500";
    if (roi >= 15) return "text-yellow-500";
    if (roi >= 0) return "text-orange-500";
    return "text-red-500";
  };

  const getROIBadge = (roi: number) => {
    if (roi >= 30) return <Badge className="bg-green-500">Excellent</Badge>;
    if (roi >= 15) return <Badge className="bg-yellow-500">Good</Badge>;
    if (roi >= 0) return <Badge className="bg-orange-500">Moderate</Badge>;
    return <Badge className="bg-red-500">Poor</Badge>;
  };

  const getPaybackColor = (years: number) => {
    if (years <= 1) return "text-green-500";
    if (years <= 2) return "text-yellow-500";
    if (years <= 3) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="investment">Investment</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
        </TabsList>

        {/* Investment Tab */}
        <TabsContent value="investment" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--ocean)]" />
                  Investment Details
                </CardTitle>
                <CardDescription>Enter your logistics investment parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <Label className="shrink-0">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.slice(0, 20).map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="initialInvestment">Initial Investment</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="initialInvestment"
                        type="number"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Software, equipment, or system purchase cost</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="implementationCost">Implementation</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="implementationCost"
                          type="number"
                          value={implementationCost}
                          onChange={(e) => setImplementationCost(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="trainingCost">Training</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="trainingCost"
                          type="number"
                          value={trainingCost}
                          onChange={(e) => setTrainingCost(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="integrationCost">Integration Cost</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="integrationCost"
                        type="number"
                        value={integrationCost}
                        onChange={(e) => setIntegrationCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ongoingCosts">Annual Ongoing Costs</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="ongoingCosts"
                        type="number"
                        value={ongoingCosts}
                        onChange={(e) => setOngoingCosts(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Maintenance, subscriptions, support</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                  Financial Parameters
                </CardTitle>
                <CardDescription>Project duration and financial assumptions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="projectLifespan">Project Lifespan (Years)</Label>
                      <span className="font-bold text-[var(--ocean)]">{projectLifespan} years</span>
                    </div>
                    <Slider
                      value={[parseNum(projectLifespan)]}
                      onValueChange={(v) => setProjectLifespan(v[0].toString())}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>1 year</span>
                      <span>10 years</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="discountRate">Discount Rate (WACC)</Label>
                      <span className="font-bold text-[var(--ocean)]">{discountRate}%</span>
                    </div>
                    <Slider
                      value={[parseNum(discountRate)]}
                      onValueChange={(v) => setDiscountRate(v[0].toString())}
                      min={1}
                      max={25}
                      step={0.5}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      <Info className="h-3 w-3 inline mr-1" />
                      Weighted Average Cost of Capital or hurdle rate
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="taxRate">Corporate Tax Rate</Label>
                      <span className="font-bold text-[var(--ocean)]">{taxRate}%</span>
                    </div>
                    <Slider
                      value={[parseNum(taxRate)]}
                      onValueChange={(v) => setTaxRate(v[0].toString())}
                      min={0}
                      max={40}
                      step={1}
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Total Investment Required</p>
                  <p className="text-3xl font-bold text-[var(--ocean)]">
                    {formatCurrency(results.totalInvestment, currency)}
                  </p>
                </div>

                {/* Investment Breakdown Mini Chart */}
                <div className="mt-4">
                  <p className="text-sm font-medium mb-3">Investment Breakdown</p>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={investmentBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {investmentBreakdown.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, currency)}
                        />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {investmentBreakdown.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Savings Tab */}
        <TabsContent value="savings" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Operational Savings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[var(--ocean)]" />
                  Operational Savings
                </CardTitle>
                <CardDescription>Annual savings from operational improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="laborSavings">Labor Cost Savings</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="laborSavings"
                        type="number"
                        value={laborSavings}
                        onChange={(e) => setLaborSavings(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Automation, efficiency gains, reduced headcount</p>
                  </div>

                  <div>
                    <Label htmlFor="freightSavings">Freight & Transportation</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="freightSavings"
                        type="number"
                        value={freightSavings}
                        onChange={(e) => setFreightSavings(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Better rates, route optimization, consolidation</p>
                  </div>

                  <div>
                    <Label htmlFor="inventorySavings">Inventory Carrying Cost</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="inventorySavings"
                        type="number"
                        value={inventorySavings}
                        onChange={(e) => setInventorySavings(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Reduced safety stock, better turnover</p>
                  </div>

                  <div>
                    <Label htmlFor="warehouseSavings">Warehouse Operations</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="warehouseSavings"
                        type="number"
                        value={warehouseSavings}
                        onChange={(e) => setWarehouseSavings(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Savings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-[var(--ocean)]" />
                  Additional Savings
                </CardTitle>
                <CardDescription>Other cost reductions and improvements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="adminSavings">Administrative Savings</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="adminSavings"
                        type="number"
                        value={adminSavings}
                        onChange={(e) => setAdminSavings(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Reduced paperwork, faster processing</p>
                  </div>

                  <div>
                    <Label htmlFor="errorReduction">Error Reduction Savings</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="errorReduction"
                        type="number"
                        value={errorReduction}
                        onChange={(e) => setErrorReduction(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Fewer mistakes, returns, rework</p>
                  </div>

                  <div>
                    <Label htmlFor="insuranceSavings">Insurance & Compliance</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="insuranceSavings"
                        type="number"
                        value={insuranceSavings}
                        onChange={(e) => setInsuranceSavings(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="otherSavings">Other Savings</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otherSavings"
                        type="number"
                        value={otherSavings}
                        onChange={(e) => setOtherSavings(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Savings Summary */}
          <Card className="border-[var(--logistics)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-[var(--logistics)]" />
                Annual Savings Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={savingsBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine
                      >
                        {savingsBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="p-4 bg-[var(--logistics)]/10 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground">Total Annual Savings</p>
                    <p className="text-3xl font-bold text-[var(--logistics)]">
                      {formatCurrency(results.totalAnnualSavings, currency)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {savingsBreakdown.map((item, index) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(item.value, currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6 mt-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-[var(--ocean)]/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Simple ROI</span>
                  {getROIBadge(results.simpleROI)}
                </div>
                <p className={`text-3xl font-bold ${getROIColor(results.simpleROI)}`}>
                  {results.simpleROI.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--ocean)]/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Payback Period</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className={`text-3xl font-bold ${getPaybackColor(results.paybackPeriod)}`}>
                  {results.paybackPeriod.toFixed(1)} years
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--ocean)]/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">NPV</span>
                  {results.npv >= 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className={`text-3xl font-bold ${results.npv >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(results.npv, currency)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--ocean)]/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">IRR</span>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className={`text-3xl font-bold ${getROIColor(results.irr)}`}>
                  {results.irr.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Investment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Total Investment</span>
                    <span className="font-bold">{formatCurrency(results.totalInvestment, currency)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Annual Gross Savings</span>
                    <span className="font-bold text-[var(--logistics)]">{formatCurrency(results.totalAnnualSavings, currency)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Annual Ongoing Costs</span>
                    <span className="font-bold text-red-500">-{formatCurrency(parseNum(ongoingCosts), currency)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[var(--ocean)]/10 rounded-lg">
                    <span className="text-sm font-medium">Net Annual Benefit (after tax)</span>
                    <span className="font-bold text-[var(--ocean)]">{formatCurrency(results.annualNetBenefit, currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Financial Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Simple ROI</span>
                    <span className={`font-bold ${getROIColor(results.simpleROI)}`}>{results.simpleROI.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Risk-Adjusted ROI</span>
                    <span className={`font-bold ${getROIColor(results.riskAdjustedROI)}`}>{results.riskAdjustedROI.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Discounted Payback</span>
                    <span className={`font-bold ${getPaybackColor(results.discountedPayback)}`}>{results.discountedPayback.toFixed(1)} years</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Profitability Index</span>
                    <span className={`font-bold ${results.profitabilityIndex >= 1 ? 'text-green-500' : 'text-red-500'}`}>
                      {results.profitabilityIndex.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Multi-Year Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Benefits Over Time</CardTitle>
              <CardDescription>Net benefit projection across project lifespan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">5-Year Net Benefit</p>
                  <p className={`text-2xl font-bold ${results.fiveYearBenefit >= 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                    {formatCurrency(results.fiveYearBenefit, currency)}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">10-Year Net Benefit</p>
                  <p className={`text-2xl font-bold ${results.tenYearBenefit >= 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                    {formatCurrency(results.tenYearBenefit, currency)}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total Value Projection</p>
                  <p className="text-2xl font-bold text-[var(--ocean)]">
                    {formatCurrency(results.mvp, currency)}
                  </p>
                </div>
              </div>

              {/* ROI Gauge */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">ROI Meter</span>
                  <span className={`font-bold ${getROIColor(results.simpleROI)}`}>{results.simpleROI.toFixed(1)}%</span>
                </div>
                <Progress
                  value={Math.min(Math.max(results.simpleROI, 0), 100)}
                  className="h-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%+</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Recommendation */}
          <Card className={`border-2 ${results.npv > 0 && results.irr > parseNum(discountRate) ? 'border-[var(--logistics)]' : 'border-red-500'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.npv > 0 && results.irr > parseNum(discountRate) ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    <span className="text-[var(--logistics)]">Investment Recommended</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="text-red-500">Investment Caution</span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.npv > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-[var(--logistics)]/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[var(--logistics)]">Positive NPV</p>
                      <p className="text-sm text-muted-foreground">
                        The investment creates value of {formatCurrency(results.npv, currency)} in present value terms.
                      </p>
                    </div>
                  </div>
                )}
                {results.irr > parseNum(discountRate) && (
                  <div className="flex items-start gap-3 p-3 bg-[var(--logistics)]/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[var(--logistics)]">IRR Exceeds Hurdle Rate</p>
                      <p className="text-sm text-muted-foreground">
                        IRR of {results.irr.toFixed(1)}% is greater than your discount rate of {discountRate}%.
                      </p>
                    </div>
                  </div>
                )}
                {results.paybackPeriod <= 2 && (
                  <div className="flex items-start gap-3 p-3 bg-[var(--ocean)]/10 rounded-lg">
                    <Clock className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-[var(--ocean)]">Quick Payback</p>
                      <p className="text-sm text-muted-foreground">
                        Investment recovers in {results.paybackPeriod.toFixed(1)} years.
                      </p>
                    </div>
                  </div>
                )}
                {results.npv <= 0 && (
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-500">Negative NPV</p>
                      <p className="text-sm text-muted-foreground">
                        The investment destroys value. Consider revising savings estimates or reducing investment.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                Cash Flow Projection
              </CardTitle>
              <CardDescription>Year-by-year cash flow analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={cashFlows}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="year" label={{ value: 'Year', position: 'bottom', offset: -5 }} />
                    <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value, currency),
                        name
                      ]}
                    />
                    <Legend />
                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                    <Bar dataKey="netCashFlow" name="Net Cash Flow" fill={chartColors.ocean} barSize={30} />
                    <Line
                      type="monotone"
                      dataKey="cumulativeCashFlow"
                      name="Cumulative Cash Flow"
                      stroke={chartColors.logistics}
                      strokeWidth={3}
                      dot={{ fill: chartColors.logistics }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cumulativeDiscounted"
                      name="Cumulative Discounted"
                      stroke={chartColors.purple}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: chartColors.purple }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Cash Flow Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Year</th>
                      <th className="text-right py-3 px-2">Investment</th>
                      <th className="text-right py-3 px-2">Savings</th>
                      <th className="text-right py-3 px-2">Costs</th>
                      <th className="text-right py-3 px-2">Net CF</th>
                      <th className="text-right py-3 px-2">Cumulative</th>
                      <th className="text-right py-3 px-2">Discounted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashFlows.map((cf, idx) => (
                      <tr key={idx} className={`border-b ${cf.year === Math.ceil(results.paybackPeriod) ? 'bg-[var(--logistics)]/10' : ''}`}>
                        <td className="py-3 px-2 font-medium">
                          Year {cf.year}
                          {cf.year === Math.ceil(results.paybackPeriod) && (
                            <Badge className="ml-2 bg-[var(--logistics)]">Break-even</Badge>
                          )}
                        </td>
                        <td className="text-right py-3 px-2 text-red-500">
                          {cf.investment > 0 ? `-${formatCurrency(cf.investment, currency)}` : '-'}
                        </td>
                        <td className="text-right py-3 px-2 text-[var(--logistics)]">
                          {cf.savings > 0 ? formatCurrency(cf.savings, currency) : '-'}
                        </td>
                        <td className="text-right py-3 px-2 text-orange-500">
                          {cf.costs > 0 ? `-${formatCurrency(cf.costs, currency)}` : '-'}
                        </td>
                        <td className={`text-right py-3 px-2 font-medium ${cf.netCashFlow >= 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                          {formatCurrency(cf.netCashFlow, currency)}
                        </td>
                        <td className={`text-right py-3 px-2 font-medium ${cf.cumulativeCashFlow >= 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                          {formatCurrency(cf.cumulativeCashFlow, currency)}
                        </td>
                        <td className={`text-right py-3 px-2 ${cf.cumulativeDiscounted >= 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                          {formatCurrency(cf.cumulativeDiscounted, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payback Visualization */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payback Period Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Simple Payback</span>
                      <span className={`text-xl font-bold ${getPaybackColor(results.paybackPeriod)}`}>
                        {results.paybackPeriod.toFixed(2)} years
                      </span>
                    </div>
                    <Progress
                      value={Math.min((results.paybackPeriod / 5) * 100, 100)}
                      className="h-2 mt-2"
                    />
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Discounted Payback</span>
                      <span className={`text-xl font-bold ${getPaybackColor(results.discountedPayback)}`}>
                        {results.discountedPayback.toFixed(2)} years
                      </span>
                    </div>
                    <Progress
                      value={Math.min((results.discountedPayback / 5) * 100, 100)}
                      className="h-2 mt-2"
                    />
                  </div>

                  <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Break-Even Year</p>
                    <p className="text-2xl font-bold text-[var(--ocean)]">Year {results.breakEvenYear}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NPV & IRR Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'NPV', value: results.npv, fill: results.npv >= 0 ? chartColors.logistics : chartColors.danger },
                        { name: 'IRR (%)', value: results.irr, fill: results.irr >= parseNum(discountRate) ? chartColors.ocean : chartColors.danger },
                        { name: 'Hurdle Rate (%)', value: parseNum(discountRate), fill: chartColors.warning },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === 'NPV' ? formatCurrency(value, currency) : `${value.toFixed(1)}%`,
                          name
                        ]}
                      />
                      <Bar dataKey="value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <Info className="h-4 w-4 inline mr-1" />
                    {results.irr >= parseNum(discountRate)
                      ? `IRR (${results.irr.toFixed(1)}%) exceeds hurdle rate (${discountRate}%), indicating a viable investment.`
                      : `IRR (${results.irr.toFixed(1)}%) is below hurdle rate (${discountRate}%), consider revising the project.`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sensitivity Tab */}
        <TabsContent value="sensitivity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                Sensitivity Analysis
              </CardTitle>
              <CardDescription>How changes in savings affect ROI metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Sensitivity Range</Label>
                  <span className="font-bold text-[var(--ocean)]">±{sensitivityRange}%</span>
                </div>
                <Slider
                  value={[sensitivityRange]}
                  onValueChange={(v) => setSensitivityRange(v[0])}
                  min={10}
                  max={50}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>±10%</span>
                  <span>±50%</span>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={sensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="change" label={{ value: 'Savings Change', position: 'bottom', offset: -5 }} />
                    <YAxis yAxisId="left" tickFormatter={(v) => `${v}%`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatCurrency(v, currency)} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'roi' || name === 'payback' ? `${value.toFixed(1)}${name === 'payback' ? ' yrs' : '%'}` : formatCurrency(value, currency),
                        name === 'roi' ? 'ROI' : name === 'payback' ? 'Payback' : name === 'npv' ? 'NPV' : 'Benefit'
                      ]}
                    />
                    <Legend />
                    <ReferenceLine y={parseNum(discountRate)} yAxisId="left" stroke={chartColors.warning} strokeDasharray="5 5" label="Hurdle Rate" />
                    <Bar yAxisId="right" dataKey="npv" name="npv" fill={chartColors.ocean} fillOpacity={0.6} barSize={20} />
                    <Line yAxisId="left" type="monotone" dataKey="roi" name="roi" stroke={chartColors.logistics} strokeWidth={3} dot={{ fill: chartColors.logistics }} />
                    <Line yAxisId="left" type="monotone" dataKey="payback" name="payback" stroke={chartColors.purple} strokeWidth={2} strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis</CardTitle>
              <CardDescription>Compare different outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarios}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'roi' ? `${value.toFixed(1)}%` : formatCurrency(value, currency),
                        name === 'roi' ? 'ROI' : 'NPV'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="roi" name="ROI (%)" fill={chartColors.ocean} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Scenario</th>
                      <th className="text-right py-3 px-2">Annual Benefit</th>
                      <th className="text-right py-3 px-2">ROI</th>
                      <th className="text-right py-3 px-2">Payback</th>
                      <th className="text-right py-3 px-2">NPV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((scenario, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: scenario.color }} />
                            <span className="font-medium">{scenario.name}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2">{formatCurrency(scenario.benefit, currency)}</td>
                        <td className={`text-right py-3 px-2 font-medium ${getROIColor(scenario.roi)}`}>
                          {scenario.roi.toFixed(1)}%
                        </td>
                        <td className={`text-right py-3 px-2 ${getPaybackColor(scenario.payback)}`}>
                          {scenario.payback.toFixed(1)} years
                        </td>
                        <td className={`text-right py-3 px-2 ${scenario.npv >= 0 ? 'text-[var(--logistics)]' : 'text-red-500'}`}>
                          {formatCurrency(scenario.npv, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
                Risk Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-[var(--ocean)]">Positive Factors</h4>
                  {results.paybackPeriod <= 2 && (
                    <div className="flex items-start gap-2 p-3 bg-[var(--logistics)]/10 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span className="text-sm">Quick payback reduces risk exposure</span>
                    </div>
                  )}
                  {results.profitabilityIndex >= 1.5 && (
                    <div className="flex items-start gap-2 p-3 bg-[var(--logistics)]/10 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span className="text-sm">High profitability index indicates strong returns</span>
                    </div>
                  )}
                  {results.irr >= parseNum(discountRate) * 1.5 && (
                    <div className="flex items-start gap-2 p-3 bg-[var(--logistics)]/10 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span className="text-sm">IRR significantly exceeds hurdle rate</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-red-500">Risk Factors</h4>
                  {results.paybackPeriod > 3 && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Long payback increases risk</span>
                    </div>
                  )}
                  {results.profitabilityIndex < 1.2 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Low profitability index limits margin of safety</span>
                    </div>
                  )}
                  {sensitivityData.find(d => d.change === '-20%') && sensitivityData.find(d => d.change === '-20%')!.npv < 0 && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-500/10 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                      <span className="text-sm">20% savings reduction leads to negative NPV</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => {
          setInitialInvestment("150000");
          setImplementationCost("25000");
          setTrainingCost("10000");
          setIntegrationCost("15000");
          setOngoingCosts("12000");
          setProjectLifespan("5");
          setDiscountRate("10");
          setTaxRate("25");
          setLaborSavings("45000");
          setFreightSavings("35000");
          setInventorySavings("25000");
          setWarehouseSavings("18000");
          setAdminSavings("12000");
          setErrorReduction("8000");
          setInsuranceSavings("5000");
          setOtherSavings("2000");
        }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="gradient-ocean">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>
    </div>
  );
}
