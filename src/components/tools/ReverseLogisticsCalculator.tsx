"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  ArrowRight,
  DollarSign,
  BarChart3,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  Target,
  Percent,
  ShoppingCart,
  Warehouse,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Download,
  Share2,
  Layers,
  PieChart as PieChartIcon,
  LineChart,
  BarChart,
  Lightbulb,
  Recycle,
  Trash2,
  Leaf,
  Truck,
  Factory,
  Settings,
  Gauge,
  Zap,
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  teal: "#14B8A6",
  pink: "#EC4899",
};

// Return reason categories with typical percentages and recovery rates
const returnReasons = [
  { id: "defect", name: "Defective/Damaged", typicalPercent: 15, color: COLORS.danger, recoveryRate: 0.20, refurbishable: true },
  { id: "wrongItem", name: "Wrong Item Received", typicalPercent: 10, color: COLORS.warning, recoveryRate: 0.95, refurbishable: false },
  { id: "changedMind", name: "Changed Mind", typicalPercent: 35, color: COLORS.ocean, recoveryRate: 0.90, refurbishable: false },
  { id: "notAsDescribed", name: "Not as Described", typicalPercent: 20, color: COLORS.secondary, recoveryRate: 0.75, refurbishable: true },
  { id: "qualityIssue", name: "Quality Issue", typicalPercent: 12, color: COLORS.pink, recoveryRate: 0.60, refurbishable: true },
  { id: "sizeFit", name: "Size/Fit Issue", typicalPercent: 8, color: COLORS.teal, recoveryRate: 0.85, refurbishable: false },
];

// Disposal methods with environmental impact factors
const disposalMethods = [
  { id: "landfill", name: "Landfill", costFactor: 1.0, co2PerKg: 0.5, recoveryRate: 0 },
  { id: "recycle", name: "Recycling", costFactor: 0.8, co2PerKg: 0.1, recoveryRate: 0.15 },
  { id: "donate", name: "Donation", costFactor: 0.3, co2PerKg: 0.05, recoveryRate: 0.25 },
  { id: "liquidate", name: "Liquidation", costFactor: 0.2, co2PerKg: 0.15, recoveryRate: 0.35 },
  { id: "refurbish", name: "Refurbishment", costFactor: 0.6, co2PerKg: 0.2, recoveryRate: 0.70 },
];

// Industry benchmarks for reverse logistics
const industryBenchmarks = [
  { industry: "Electronics", avgReturnRate: 15, processingCost: 15, recoveryRate: 45 },
  { industry: "Apparel", avgReturnRate: 25, processingCost: 8, recoveryRate: 65 },
  { industry: "Home & Garden", avgReturnRate: 10, processingCost: 12, recoveryRate: 55 },
  { industry: "Health & Beauty", avgReturnRate: 5, processingCost: 6, recoveryRate: 30 },
  { industry: "Sports Equipment", avgReturnRate: 12, processingCost: 10, recoveryRate: 60 },
  { industry: "Furniture", avgReturnRate: 18, processingCost: 25, recoveryRate: 50 },
];

type Currency = keyof typeof currencies;

interface ReturnReasonBreakdown {
  defect: number;
  wrongItem: number;
  changedMind: number;
  notAsDescribed: number;
  qualityIssue: number;
  sizeFit: number;
}

interface ReverseLogisticsInputs {
  // Product details
  productPrice: number;
  productCost: number;
  productWeight: number; // kg
  unitsSold: number;
  returnRate: number;
  currency: Currency;
  
  // Return reasons
  returnReasons: ReturnReasonBreakdown;
  
  // Processing costs
  returnShippingCost: number;
  inspectionCost: number;
  sortingCost: number;
  testingCost: number;
  repackagingCost: number;
  
  // Recovery options
  refurbishmentCost: number;
  refurbishmentRate: number; // % of items that can be refurbished
  resaleDiscount: number; // % discount for refurbished items
  
  // Disposal
  disposalMethod: string;
  disposalCostPerUnit: number;
  
  // Environmental settings
  carbonTaxPerKg: number;
  targetRecoveryRate: number;
}

interface ReverseLogisticsResults {
  // Volume metrics
  totalReturns: number;
  returnsByReason: { name: string; count: number; color: string }[];
  
  // Cost breakdown
  totalProcessingCost: number;
  totalRefurbishmentCost: number;
  totalDisposalCost: number;
  totalReverseLogisticsCost: number;
  
  // Recovery metrics
  totalRecoveryValue: number;
  refurbishedUnits: number;
  resoldUnits: number;
  disposedUnits: number;
  donatedUnits: number;
  
  // Net recovery
  netRecovery: number;
  recoveryRate: number;
  costPerReturn: number;
  
  // Environmental impact
  totalCO2Emissions: number; // kg
  co2Saved: number; // kg compared to landfill
  carbonTaxImpact: number;
  wasteDiverted: number; // kg
  recyclingRate: number;
  
  // Optimization metrics
  recommendedActions: { action: string; impact: number; description: string }[];
  efficiencyScore: number;
}

// Calculate reverse logistics metrics
function calculateReverseLogistics(inputs: ReverseLogisticsInputs): ReverseLogisticsResults {
  const {
    productPrice,
    productCost,
    productWeight,
    unitsSold,
    returnRate,
    returnReasons: reasons,
    returnShippingCost,
    inspectionCost,
    sortingCost,
    testingCost,
    repackagingCost,
    refurbishmentCost,
    refurbishmentRate,
    resaleDiscount,
    disposalMethod,
    disposalCostPerUnit,
    carbonTaxPerKg,
    targetRecoveryRate,
  } = inputs;

  // Total returns
  const totalReturns = Math.round((unitsSold * returnRate) / 100);
  
  // Returns by reason
  const returnsByReason = returnReasons.map((reason) => ({
    name: reason.name,
    count: Math.round((totalReturns * (reasons[reason.id as keyof ReturnReasonBreakdown] || 0)) / 100),
    color: reason.color,
  }));

  // Processing costs
  const processingCostPerUnit = inspectionCost + sortingCost + testingCost + repackagingCost;
  const totalProcessingCost = totalReturns * (returnShippingCost + processingCostPerUnit);
  
  // Calculate units by destination
  const refurbishableReasons = returnReasons.filter(r => r.refurbishable);
  const refurbishableCount = refurbishableReasons.reduce((sum, r) => {
    return sum + Math.round((totalReturns * (reasons[r.id as keyof ReturnReasonBreakdown] || 0)) / 100);
  }, 0);
  
  const refurbishedUnits = Math.round(refurbishableCount * (refurbishmentRate / 100));
  const resoldUnits = Math.round(refurbishedUnits * 0.85); // 85% of refurbished items resell
  
  // Calculate remaining units for disposal/donation
  const processedUnits = refurbishedUnits;
  const remainingUnits = totalReturns - processedUnits;
  
  // Disposal method distribution
  let disposedUnits = 0;
  let donatedUnits = 0;
  let recycledUnits = 0;
  
  const selectedDisposal = disposalMethods.find(d => d.id === disposalMethod) || disposalMethods[0];
  
  switch (disposalMethod) {
    case "landfill":
      disposedUnits = remainingUnits;
      break;
    case "recycle":
      recycledUnits = Math.round(remainingUnits * 0.7);
      disposedUnits = remainingUnits - recycledUnits;
      break;
    case "donate":
      donatedUnits = Math.round(remainingUnits * 0.8);
      disposedUnits = remainingUnits - donatedUnits;
      break;
    case "liquidate":
      donatedUnits = Math.round(remainingUnits * 0.5);
      disposedUnits = remainingUnits - donatedUnits;
      break;
    case "refurbish":
      const additionalRefurb = Math.round(remainingUnits * 0.5);
      donatedUnits = remainingUnits - additionalRefurb;
      break;
    default:
      disposedUnits = remainingUnits;
  }

  // Refurbishment costs
  const totalRefurbishmentCost = refurbishedUnits * refurbishmentCost;
  
  // Disposal costs
  const totalDisposalCost = disposedUnits * disposalCostPerUnit;
  
  // Total reverse logistics cost
  const totalReverseLogisticsCost = totalProcessingCost + totalRefurbishmentCost + totalDisposalCost;
  
  // Recovery value calculation
  const avgRecoveryRate = returnReasons.reduce((sum, r) => {
    return sum + (r.recoveryRate * (reasons[r.id as keyof ReturnReasonBreakdown] || 0));
  }, 0) / 100;
  
  const refurbishedResalePrice = productPrice * (1 - resaleDiscount / 100);
  const recoveryFromRefurbished = resoldUnits * refurbishedResalePrice;
  const recoveryFromLiquidation = donatedUnits * productCost * selectedDisposal.recoveryRate;
  
  const totalRecoveryValue = recoveryFromRefurbished + recoveryFromLiquidation;
  
  // Net recovery
  const netRecovery = totalRecoveryValue - totalReverseLogisticsCost;
  const recoveryRate = totalReturns > 0 ? (netRecovery / (totalReturns * productPrice)) * 100 : 0;
  const costPerReturn = totalReturns > 0 ? totalReverseLogisticsCost / totalReturns : 0;
  
  // Environmental impact
  const totalCO2Emissions = (disposedUnits * productWeight * selectedDisposal.co2PerKg) +
    (refurbishedUnits * productWeight * 0.3) +
    (recycledUnits * productWeight * 0.1);
  
  const landfillCO2 = totalReturns * productWeight * 0.5; // Baseline landfill CO2
  const co2Saved = landfillCO2 - totalCO2Emissions;
  
  const carbonTaxImpact = totalCO2Emissions * carbonTaxPerKg;
  
  const wasteDiverted = (recycledUnits + donatedUnits + refurbishedUnits) * productWeight;
  const recyclingRate = totalReturns > 0 ? (wasteDiverted / (totalReturns * productWeight)) * 100 : 0;
  
  // Optimization recommendations
  const recommendedActions = [];
  
  if (recoveryRate < targetRecoveryRate) {
    recommendedActions.push({
      action: "Improve Refurbishment Rate",
      impact: (targetRecoveryRate - recoveryRate) * totalReturns * productPrice / 100,
      description: "Increase refurbishment success rate to meet recovery targets"
    });
  }
  
  if (disposedUnits > totalReturns * 0.3) {
    recommendedActions.push({
      action: "Reduce Landfill Disposal",
      impact: disposedUnits * disposalCostPerUnit * 0.5,
      description: "Partner with recycling facilities or donation centers"
    });
  }
  
  if (refurbishmentCost > productPrice * 0.4) {
    recommendedActions.push({
      action: "Optimize Refurbishment Process",
      impact: (refurbishmentCost - productPrice * 0.3) * refurbishedUnits,
      description: "Streamline repair process to reduce per-unit cost"
    });
  }
  
  if (returnRate > 15) {
    recommendedActions.push({
      action: "Reduce Return Rate",
      impact: (returnRate - 15) / 100 * unitsSold * costPerReturn,
      description: "Address root causes of returns through product improvements"
    });
  }
  
  // Efficiency score (0-100)
  const recoveryScore = Math.min(recoveryRate / targetRecoveryRate, 1) * 40;
  const environmentalScore = Math.min(recyclingRate / 80, 1) * 30;
  const costScore = Math.max(0, 1 - (costPerReturn / productPrice)) * 30;
  const efficiencyScore = Math.round(recoveryScore + environmentalScore + costScore);
  
  return {
    totalReturns,
    returnsByReason,
    totalProcessingCost,
    totalRefurbishmentCost,
    totalDisposalCost,
    totalReverseLogisticsCost,
    totalRecoveryValue,
    refurbishedUnits,
    resoldUnits,
    disposedUnits,
    donatedUnits,
    netRecovery,
    recoveryRate,
    costPerReturn,
    totalCO2Emissions,
    co2Saved,
    carbonTaxImpact,
    wasteDiverted,
    recyclingRate,
    recommendedActions,
    efficiencyScore,
  };
}

export function ReverseLogisticsCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");

  const [inputs, setInputs] = useState<ReverseLogisticsInputs>({
    productPrice: 100,
    productCost: 45,
    productWeight: 2.5,
    unitsSold: 1000,
    returnRate: 15,
    currency: "USD",
    returnReasons: {
      defect: 15,
      wrongItem: 10,
      changedMind: 35,
      notAsDescribed: 20,
      qualityIssue: 12,
      sizeFit: 8,
    },
    returnShippingCost: 8,
    inspectionCost: 3,
    sortingCost: 2,
    testingCost: 4,
    repackagingCost: 3,
    refurbishmentCost: 15,
    refurbishmentRate: 60,
    resaleDiscount: 25,
    disposalMethod: "recycle",
    disposalCostPerUnit: 5,
    carbonTaxPerKg: 0.05,
    targetRecoveryRate: 50,
  });

  const results = useMemo(() => calculateReverseLogistics(inputs), [inputs]);

  const updateInput = <K extends keyof ReverseLogisticsInputs>(field: K, value: ReverseLogisticsInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const updateReturnReason = (reason: keyof ReturnReasonBreakdown, value: number) => {
    setInputs((prev) => ({
      ...prev,
      returnReasons: {
        ...prev.returnReasons,
        [reason]: value,
      },
    }));
  };

  const normalizeReturnReasons = () => {
    const total = Object.values(inputs.returnReasons).reduce((a, b) => a + b, 0);
    if (total !== 100 && total > 0) {
      const normalized = {} as ReturnReasonBreakdown;
      (Object.keys(inputs.returnReasons) as (keyof ReturnReasonBreakdown)[]).forEach((key) => {
        normalized[key] = Math.round((inputs.returnReasons[key] / total) * 100);
      });
      setInputs((prev) => ({ ...prev, returnReasons: normalized }));
    }
  };

  const formatMoney = (value: number) => {
    return formatCurrency(value, inputs.currency);
  };

  // Cost breakdown for pie chart
  const costBreakdownData = useMemo(() => [
    { name: "Processing", value: results.totalProcessingCost, color: COLORS.ocean },
    { name: "Refurbishment", value: results.totalRefurbishmentCost, color: COLORS.logistics },
    { name: "Disposal", value: results.totalDisposalCost, color: COLORS.warning },
  ].filter(d => d.value > 0), [results]);

  // Return reason breakdown for chart
  const returnReasonData = useMemo(() => 
    returnReasons.map((reason) => ({
      name: reason.name,
      value: inputs.returnReasons[reason.id as keyof ReturnReasonBreakdown] || 0,
      color: reason.color,
    })),
    [inputs.returnReasons]
  );

  // Recovery flow data
  const recoveryFlowData = useMemo(() => [
    { name: "Refurbished & Resold", value: results.resoldUnits, color: COLORS.logistics },
    { name: "Donated/Liquidated", value: results.donatedUnits, color: COLORS.teal },
    { name: "Recycled", value: Math.round((results.totalReturns - results.disposedUnits - results.donatedUnits - results.resoldUnits) * 0.5), color: COLORS.secondary },
    { name: "Disposed", value: results.disposedUnits, color: COLORS.danger },
  ].filter(d => d.value > 0), [results]);

  // Environmental impact data
  const environmentalData = useMemo(() => [
    { name: "CO2 Emissions", value: results.totalCO2Emissions, unit: "kg", color: COLORS.danger },
    { name: "CO2 Saved", value: results.co2Saved, unit: "kg", color: COLORS.logistics },
    { name: "Waste Diverted", value: results.wasteDiverted, unit: "kg", color: COLORS.ocean },
  ], [results]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" style={{ color: COLORS.ocean }} />
                    Product Details
                  </CardTitle>
                  <CardDescription>
                    Enter product information and return volume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Currency
                    </Label>
                    <Select
                      value={inputs.currency}
                      onValueChange={(v) => updateInput("currency", v as Currency)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Product Price & Cost */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Selling Price</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        value={inputs.productPrice}
                        onChange={(e) => updateInput("productPrice", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productCost">Product Cost</Label>
                      <Input
                        id="productCost"
                        type="number"
                        value={inputs.productCost}
                        onChange={(e) => updateInput("productCost", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Units Sold & Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unitsSold">Units Sold</Label>
                      <Input
                        id="unitsSold"
                        type="number"
                        value={inputs.unitsSold}
                        onChange={(e) => updateInput("unitsSold", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productWeight">Weight (kg)</Label>
                      <Input
                        id="productWeight"
                        type="number"
                        step="0.1"
                        value={inputs.productWeight}
                        onChange={(e) => updateInput("productWeight", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  {/* Return Rate Slider */}
                  <div className="space-y-2">
                    <Label>Return Rate</Label>
                    <div className="pt-2">
                      <Slider
                        value={[inputs.returnRate]}
                        onValueChange={(v) => updateInput("returnRate", v[0])}
                        min={0}
                        max={50}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span className="font-medium" style={{ color: COLORS.ocean }}>{inputs.returnRate}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>

                  {/* Return Count Preview */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Returns</span>
                      <span className="text-2xl font-bold" style={{ color: COLORS.ocean }}>{results.totalReturns}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">Total Weight</span>
                      <span className="font-medium">{(results.totalReturns * inputs.productWeight).toFixed(1)} kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" style={{ color: COLORS.logistics }} />
                    Return Reasons Breakdown
                  </CardTitle>
                  <CardDescription>
                    Distribution of return reasons affects recovery potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {returnReasons.map((reason) => (
                      <div key={reason.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: reason.color }} />
                            {reason.name}
                          </Label>
                          <span className="text-sm font-medium">
                            {inputs.returnReasons[reason.id as keyof ReturnReasonBreakdown]}%
                          </span>
                        </div>
                        <Slider
                          value={[inputs.returnReasons[reason.id as keyof ReturnReasonBreakdown] || 0]}
                          onValueChange={(v) => updateReturnReason(reason.id as keyof ReturnReasonBreakdown, v[0])}
                          max={100}
                          step={1}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Total: {Object.values(inputs.returnReasons).reduce((a, b) => a + b, 0)}%
                      {Object.values(inputs.returnReasons).reduce((a, b) => a + b, 0) !== 100 && (
                        <span className="text-amber-600 ml-2">(should equal 100%)</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={normalizeReturnReasons}>
                      Normalize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2" style={{ borderColor: `${COLORS.ocean}33` }}>
                <CardHeader style={{ background: `linear-gradient(to right, ${COLORS.ocean}10, ${COLORS.logistics}10)` }}>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" style={{ color: COLORS.ocean }} />
                    Reverse Logistics Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Net Recovery */}
                  <motion.div
                    key={results.netRecovery}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-6 rounded-xl"
                    style={{ background: results.netRecovery >= 0 ? `linear-gradient(135deg, ${COLORS.logistics}15, ${COLORS.teal}15)` : `linear-gradient(135deg, ${COLORS.danger}15, ${COLORS.warning}15)` }}
                  >
                    <div className="text-sm text-muted-foreground mb-1">Net Recovery Value</div>
                    <div className="text-4xl font-bold" style={{ color: results.netRecovery >= 0 ? COLORS.logistics : COLORS.danger }}>
                      {formatMoney(results.netRecovery)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Recovery Rate: {results.recoveryRate.toFixed(1)}%
                    </div>
                  </motion.div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowDownCircle className="h-4 w-4" style={{ color: COLORS.danger }} />
                        <span className="text-xs text-muted-foreground">Total Costs</span>
                      </div>
                      <div className="text-xl font-bold" style={{ color: COLORS.danger }}>{formatMoney(results.totalReverseLogisticsCost)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUpCircle className="h-4 w-4" style={{ color: COLORS.logistics }} />
                        <span className="text-xs text-muted-foreground">Total Recovery</span>
                      </div>
                      <div className="text-xl font-bold" style={{ color: COLORS.logistics }}>{formatMoney(results.totalRecoveryValue)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Cost per Return</div>
                      <div className="text-xl font-bold">{formatMoney(results.costPerReturn)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-2">Efficiency Score</div>
                      <div className="text-xl font-bold" style={{ color: results.efficiencyScore >= 70 ? COLORS.logistics : results.efficiencyScore >= 40 ? COLORS.warning : COLORS.danger }}>
                        {results.efficiencyScore}/100
                      </div>
                    </div>
                  </div>

                  {/* Recovery Flow Visualization */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={recoveryFlowData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                          labelLine={false}
                        >
                          {recoveryFlowData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value} units`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Unit Distribution */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="text-lg font-bold" style={{ color: COLORS.logistics }}>{results.resoldUnits}</div>
                      <div className="text-xs text-muted-foreground">Resold</div>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="text-lg font-bold" style={{ color: COLORS.teal }}>{results.donatedUnits}</div>
                      <div className="text-xs text-muted-foreground">Donated</div>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="text-lg font-bold" style={{ color: COLORS.secondary }}>{results.refurbishedUnits}</div>
                      <div className="text-xs text-muted-foreground">Refurbished</div>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="text-lg font-bold" style={{ color: COLORS.danger }}>{results.disposedUnits}</div>
                      <div className="text-xs text-muted-foreground">Disposed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Efficiency Warning */}
              {results.efficiencyScore < 50 && (
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        <p className="font-semibold mb-1">Low Recovery Efficiency</p>
                        <p>
                          Your reverse logistics efficiency is below optimal. Consider improving refurbishment processes,
                          exploring alternative disposal methods, or reducing return rates.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Processing Costs Tab */}
        <TabsContent value="processing" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Processing Costs Configuration
                </CardTitle>
                <CardDescription>
                  Set costs for each stage of the reverse logistics process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="returnShipping">Return Shipping</Label>
                    <Input
                      id="returnShipping"
                      type="number"
                      value={inputs.returnShippingCost}
                      onChange={(e) => updateInput("returnShippingCost", parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">Per unit inbound shipping</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inspection">Inspection</Label>
                    <Input
                      id="inspection"
                      type="number"
                      value={inputs.inspectionCost}
                      onChange={(e) => updateInput("inspectionCost", parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">Quality check per unit</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sorting">Sorting</Label>
                    <Input
                      id="sorting"
                      type="number"
                      value={inputs.sortingCost}
                      onChange={(e) => updateInput("sortingCost", parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">Categorization per unit</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testing">Testing</Label>
                    <Input
                      id="testing"
                      type="number"
                      value={inputs.testingCost}
                      onChange={(e) => updateInput("testingCost", parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">Functionality testing</p>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="repackaging">Repackaging</Label>
                    <Input
                      id="repackaging"
                      type="number"
                      value={inputs.repackagingCost}
                      onChange={(e) => updateInput("repackagingCost", parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">New packaging materials and labor</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Processing Cost per Unit</span>
                    <span className="font-bold" style={{ color: COLORS.ocean }}>
                      {formatMoney(inputs.returnShippingCost + inputs.inspectionCost + inputs.sortingCost + inputs.testingCost + inputs.repackagingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Processing Cost</span>
                    <span className="font-bold" style={{ color: COLORS.danger }}>
                      {formatMoney(results.totalProcessingCost)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Cost Breakdown Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatMoney(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 space-y-2">
                  {costBreakdownData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{formatMoney(item.value)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Reverse Logistics Cost</span>
                    <span style={{ color: COLORS.danger }}>{formatMoney(results.totalReverseLogisticsCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Returns by Reason Cost Impact */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Return Reason Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={returnReasonData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                      <YAxis tickFormatter={(v) => `${v}%`} />
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      <Bar dataKey="value" name="Percentage" radius={[4, 4, 0, 0]}>
                        {returnReasonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-2 px-3">Reason</th>
                        <th className="text-right py-2 px-3">Units</th>
                        <th className="text-right py-2 px-3">Recovery Rate</th>
                        <th className="text-right py-2 px-3">Potential Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {returnReasons.map((reason) => {
                        const units = Math.round((results.totalReturns * (inputs.returnReasons[reason.id as keyof ReturnReasonBreakdown] || 0)) / 100);
                        const potentialValue = units * inputs.productPrice * reason.recoveryRate;
                        return (
                          <tr key={reason.id} className="border-b">
                            <td className="py-2 px-3 flex items-center gap-2">
                              <div className="w-3 h-3 rounded" style={{ backgroundColor: reason.color }} />
                              {reason.name}
                            </td>
                            <td className="text-right py-2 px-3">{units}</td>
                            <td className="text-right py-2 px-3">{(reason.recoveryRate * 100).toFixed(0)}%</td>
                            <td className="text-right py-2 px-3 font-medium" style={{ color: COLORS.logistics }}>{formatMoney(potentialValue)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Factory className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Refurbishment Settings
                </CardTitle>
                <CardDescription>
                  Configure refurbishment process and recovery options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="refurbCost">Refurbishment Cost/Unit</Label>
                    <Input
                      id="refurbCost"
                      type="number"
                      value={inputs.refurbishmentCost}
                      onChange={(e) => updateInput("refurbishmentCost", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refurbRate">Refurbishment Rate (%)</Label>
                    <Input
                      id="refurbRate"
                      type="number"
                      value={inputs.refurbishmentRate}
                      onChange={(e) => updateInput("refurbishmentRate", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resaleDiscount">Resale Discount (%)</Label>
                  <Input
                    id="resaleDiscount"
                    type="number"
                    value={inputs.resaleDiscount}
                    onChange={(e) => updateInput("resaleDiscount", parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Discount applied to refurbished items for resale
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Refurbished Units:</span>
                      <span className="font-bold ml-2" style={{ color: COLORS.logistics }}>{results.refurbishedUnits}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Successfully Resold:</span>
                      <span className="font-bold ml-2" style={{ color: COLORS.logistics }}>{results.resoldUnits}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Resale Price:</span>
                      <span className="font-bold ml-2">{formatMoney(inputs.productPrice * (1 - inputs.resaleDiscount / 100))}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Refurbishment Cost:</span>
                      <span className="font-bold ml-2" style={{ color: COLORS.danger }}>{formatMoney(results.totalRefurbishmentCost)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trash2 className="h-5 w-5" style={{ color: COLORS.warning }} />
                  Disposal Configuration
                </CardTitle>
                <CardDescription>
                  Select disposal method and associated costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Disposal Method</Label>
                  <Select
                    value={inputs.disposalMethod}
                    onValueChange={(v) => updateInput("disposalMethod", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {disposalMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name} - {(method.recoveryRate * 100).toFixed(0)}% recovery potential
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disposalCost">Disposal Cost/Unit</Label>
                  <Input
                    id="disposalCost"
                    type="number"
                    value={inputs.disposalCostPerUnit}
                    onChange={(e) => updateInput("disposalCostPerUnit", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-3 text-sm">Disposal Method Comparison</h4>
                  <div className="space-y-2 text-sm">
                    {disposalMethods.map((method) => (
                      <div key={method.id} className={`p-2 rounded ${inputs.disposalMethod === method.id ? 'bg-muted' : ''}`}>
                        <div className="flex justify-between items-center">
                          <span>{method.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">CO2: {method.co2PerKg} kg/kg</span>
                            <Badge variant="outline" style={{ color: method.recoveryRate > 0.3 ? COLORS.logistics : COLORS.warning }}>
                              {(method.recoveryRate * 100).toFixed(0)}% recovery
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recovery Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Recovery Value Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground mb-1">Total Recovery Value</div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.logistics }}>{formatMoney(results.totalRecoveryValue)}</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground mb-1">Net Recovery</div>
                    <div className="text-2xl font-bold" style={{ color: results.netRecovery >= 0 ? COLORS.logistics : COLORS.danger }}>
                      {formatMoney(results.netRecovery)}
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground mb-1">Recovery Rate</div>
                    <div className="text-2xl font-bold" style={{ color: COLORS.ocean }}>{results.recoveryRate.toFixed(1)}%</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-xs text-muted-foreground mb-1">Target Gap</div>
                    <div className="text-2xl font-bold" style={{ color: results.recoveryRate >= inputs.targetRecoveryRate ? COLORS.logistics : COLORS.warning }}>
                      {(results.recoveryRate - inputs.targetRecoveryRate).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Target Recovery Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Target Recovery Rate</Label>
                    <span className="font-medium">{inputs.targetRecoveryRate}%</span>
                  </div>
                  <Slider
                    value={[inputs.targetRecoveryRate]}
                    onValueChange={(v) => updateInput("targetRecoveryRate", v[0])}
                    min={0}
                    max={100}
                    step={5}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Environmental Tab */}
        <TabsContent value="environmental" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Leaf className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Environmental Impact
                </CardTitle>
                <CardDescription>
                  Carbon footprint and sustainability metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {environmentalData.map((item, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold" style={{ color: item.color }}>{item.value.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">{item.unit}</div>
                      <div className="text-sm mt-1">{item.name}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carbonTax">Carbon Tax ($/kg CO2)</Label>
                  <Input
                    id="carbonTax"
                    type="number"
                    step="0.01"
                    value={inputs.carbonTaxPerKg}
                    onChange={(e) => updateInput("carbonTaxPerKg", parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Carbon tax or internal carbon pricing
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Carbon Tax Impact</span>
                    <span className="font-bold" style={{ color: COLORS.danger }}>{formatMoney(results.carbonTaxImpact)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Recycling Rate</span>
                    <span className="font-bold" style={{ color: COLORS.logistics }}>{results.recyclingRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Waste Diverted</span>
                    <span className="font-bold" style={{ color: COLORS.ocean }}>{results.wasteDiverted.toFixed(1)} kg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Recycle className="h-5 w-5" style={{ color: COLORS.teal }} />
                  Sustainability Scorecard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg" style={{ background: `linear-gradient(135deg, ${COLORS.logistics}15, ${COLORS.teal}15)` }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Environmental Efficiency</span>
                      <span className="text-2xl font-bold" style={{ color: COLORS.logistics }}>{results.recyclingRate.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all" 
                        style={{ width: `${results.recyclingRate}%`, backgroundColor: COLORS.logistics }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {results.recyclingRate >= 70 ? "Excellent - Leading sustainability practices" : 
                       results.recyclingRate >= 50 ? "Good - Above average waste diversion" :
                       results.recyclingRate >= 30 ? "Fair - Room for improvement" : "Needs Attention - High disposal rate"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="h-4 w-4" style={{ color: COLORS.logistics }} />
                        <span className="text-sm font-medium">CO2 Saved</span>
                      </div>
                      <div className="text-xl font-bold" style={{ color: COLORS.logistics }}>
                        {results.co2Saved.toFixed(1)} kg
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        vs. 100% landfill disposal
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Recycle className="h-4 w-4" style={{ color: COLORS.teal }} />
                        <span className="text-sm font-medium">Circular Economy</span>
                      </div>
                      <div className="text-xl font-bold" style={{ color: COLORS.teal }}>
                        {((results.resoldUnits + results.donatedUnits) / (results.totalReturns || 1) * 100).toFixed(0)}%
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Products kept in use
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Impact Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Environmental Impact Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={[
                      { name: "CO2 Emissions", value: results.totalCO2Emissions, fill: COLORS.danger },
                      { name: "CO2 Saved", value: results.co2Saved, fill: COLORS.logistics },
                      { name: "Waste Diverted", value: results.wasteDiverted, fill: COLORS.ocean },
                    ]} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)} kg`} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" style={{ color: COLORS.warning }} />
                  Reverse Flow Optimization
                </CardTitle>
                <CardDescription>
                  Recommendations to improve reverse logistics efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.recommendedActions.length > 0 ? (
                    results.recommendedActions.map((action, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" style={{ color: COLORS.logistics }} />
                            {action.action}
                          </h4>
                          <Badge style={{ backgroundColor: COLORS.logistics, color: 'white' }}>
                            +{formatMoney(action.impact)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.logistics }} />
                      <p className="font-medium">Optimization Complete</p>
                      <p className="text-sm text-muted-foreground">Your reverse logistics process is well optimized</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Efficiency Scorecard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="relative w-40 h-40 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-muted"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        fill="none"
                        stroke={results.efficiencyScore >= 70 ? COLORS.logistics : results.efficiencyScore >= 40 ? COLORS.warning : COLORS.danger}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${results.efficiencyScore * 4.4} 440`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className="text-3xl font-bold" style={{ color: results.efficiencyScore >= 70 ? COLORS.logistics : results.efficiencyScore >= 40 ? COLORS.warning : COLORS.danger }}>
                          {results.efficiencyScore}
                        </div>
                        <div className="text-xs text-muted-foreground">out of 100</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Recovery Efficiency</span>
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${Math.min(results.recoveryRate / inputs.targetRecoveryRate * 100, 100)}%`, backgroundColor: COLORS.logistics }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Environmental Score</span>
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${Math.min(results.recyclingRate / 80 * 100, 100)}%`, backgroundColor: COLORS.teal }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost Efficiency</span>
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${Math.max(0, (1 - results.costPerReturn / inputs.productPrice) * 100)}%`, backgroundColor: COLORS.ocean }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industry Benchmarks */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Industry Benchmarks
                </CardTitle>
                <CardDescription>
                  Compare your metrics against industry standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4">Industry</th>
                        <th className="text-right py-3 px-4">Avg Return Rate</th>
                        <th className="text-right py-3 px-4">Processing Cost</th>
                        <th className="text-right py-3 px-4">Recovery Rate</th>
                        <th className="text-right py-3 px-4">Your Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {industryBenchmarks.map((benchmark, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 font-medium">{benchmark.industry}</td>
                          <td className="text-right py-3 px-4">{benchmark.avgReturnRate}%</td>
                          <td className="text-right py-3 px-4">{formatMoney(benchmark.processingCost)}</td>
                          <td className="text-right py-3 px-4">{benchmark.recoveryRate}%</td>
                          <td className="text-right py-3 px-4">
                            <Badge 
                              variant="outline"
                              style={{ 
                                color: results.recoveryRate >= benchmark.recoveryRate ? COLORS.logistics : COLORS.warning,
                                borderColor: results.recoveryRate >= benchmark.recoveryRate ? COLORS.logistics : COLORS.warning
                              }}
                            >
                              {results.recoveryRate >= benchmark.recoveryRate ? 'Above Avg' : 'Below Avg'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
