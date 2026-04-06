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

// Return reason categories with typical percentages
const returnReasons = [
  { id: "defect", name: "Defective/Damaged", typicalPercent: 15, color: "#EF4444", resaleValue: 0 },
  { id: "wrongItem", name: "Wrong Item Received", typicalPercent: 10, color: "#F59E0B", resaleValue: 0.85 },
  { id: "changedMind", name: "Changed Mind", typicalPercent: 35, color: "#3B82F6", resaleValue: 0.90 },
  { id: "notAsDescribed", name: "Not as Described", typicalPercent: 20, color: "#8B5CF6", resaleValue: 0.75 },
  { id: "qualityIssue", name: "Quality Issue", typicalPercent: 12, color: "#EC4899", resaleValue: 0.60 },
  { id: "sizeFit", name: "Size/Fit Issue", typicalPercent: 8, color: "#14B8A6", resaleValue: 0.85 },
];

// Industry benchmarks for return rates
const industryBenchmarks = [
  { industry: "Electronics", avgReturnRate: 15, highRiskRate: 25 },
  { industry: "Apparel", avgReturnRate: 25, highRiskRate: 40 },
  { industry: "Shoes", avgReturnRate: 20, highRiskRate: 35 },
  { industry: "Home & Garden", avgReturnRate: 10, highRiskRate: 18 },
  { industry: "Health & Beauty", avgReturnRate: 5, highRiskRate: 12 },
  { industry: "Toys & Games", avgReturnRate: 8, highRiskRate: 15 },
  { industry: "Books", avgReturnRate: 3, highRiskRate: 8 },
  { industry: "Sports Equipment", avgReturnRate: 12, highRiskRate: 20 },
  { industry: "Jewelry", avgReturnRate: 8, highRiskRate: 15 },
  { industry: "Furniture", avgReturnRate: 18, highRiskRate: 30 },
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

interface ReturnInputs {
  productPrice: number;
  productCost: number;
  unitsSold: number;
  returnRate: number;
  returnReasons: ReturnReasonBreakdown;
  refundRate: number; // percentage of returns that are refunds vs exchanges
  exchangeRate: number; // percentage of returns that become exchanges
  processingCostPerReturn: number;
  shippingCostPerReturn: number;
  inspectionCost: number;
  restockingCost: number;
  averageResaleValuePercent: number;
  currency: Currency;
}

interface ReturnImpactResults {
  totalReturns: number;
  refundCount: number;
  exchangeCount: number;
  grossRevenue: number;
  netRevenue: number;
  totalReturnCost: number;
  returnProcessingCost: number;
  returnShippingCost: number;
  lostRevenue: number;
  resaleRevenue: number;
  grossMarginPercent: number;
  adjustedMarginPercent: number;
  marginErosion: number;
  profitPerUnit: number;
  adjustedProfitPerUnit: number;
  breakEvenReturnRate: number;
  returnReasonCosts: { name: string; cost: number; count: number; color: string }[];
  scenarioData: { rate: number; netProfit: number; margin: number }[];
}

// Calculate return impact
function calculateReturnImpact(inputs: ReturnInputs): ReturnImpactResults {
  const {
    productPrice,
    productCost,
    unitsSold,
    returnRate,
    refundRate,
    exchangeRate,
    processingCostPerReturn,
    shippingCostPerReturn,
    inspectionCost,
    restockingCost,
    averageResaleValuePercent,
  } = inputs;

  // Basic calculations
  const totalReturns = Math.round((unitsSold * returnRate) / 100);
  const refundCount = Math.round((totalReturns * refundRate) / 100);
  const exchangeCount = Math.round((totalReturns * exchangeRate) / 100);

  // Revenue calculations
  const grossRevenue = productPrice * unitsSold;
  const lostRevenueFromReturns = productPrice * refundCount;
  const resaleRevenue = productPrice * refundCount * (averageResaleValuePercent / 100);
  const netRevenue = grossRevenue - lostRevenueFromReturns + resaleRevenue;

  // Cost calculations
  const returnProcessingCost = totalReturns * processingCostPerReturn;
  const returnShippingCost = totalReturns * shippingCostPerReturn;
  const totalInspectionCost = totalReturns * inspectionCost;
  const totalRestockingCost = refundCount * restockingCost;
  
  // Product cost for returned items (can't recover)
  const lostProductCost = refundCount * productCost;
  
  const totalReturnCost = returnProcessingCost + returnShippingCost + 
    totalInspectionCost + totalRestockingCost + lostProductCost;

  // Margin calculations
  const grossProfit = (productPrice - productCost) * unitsSold;
  const grossMarginPercent = ((productPrice - productCost) / productPrice) * 100;
  
  const adjustedProfit = grossProfit - totalReturnCost;
  const adjustedMarginPercent = (adjustedProfit / grossRevenue) * 100;
  const marginErosion = grossMarginPercent - adjustedMarginPercent;

  const profitPerUnit = productPrice - productCost;
  const adjustedProfitPerUnit = adjustedProfit / unitsSold;

  // Break-even return rate calculation
  // At what return rate does profit become zero?
  // grossProfit - (returnRate/100 * unitsSold * costPerReturn) = 0
  const avgCostPerReturn = processingCostPerReturn + shippingCostPerReturn + 
    inspectionCost + (restockingCost * refundRate / 100) + 
    (productCost * refundRate / 100) - 
    (productPrice * averageResaleValuePercent / 100 * refundRate / 100);
  
  const breakEvenReturnRate = (grossProfit / (unitsSold * Math.abs(avgCostPerReturn))) * 100;
  const cappedBreakEvenRate = Math.min(breakEvenReturnRate, 100);

  // Return reason costs
  const returnReasonCosts = returnReasons.map((reason) => {
    const reasonPercent = inputs.returnReasons[reason.id as keyof ReturnReasonBreakdown] || 0;
    const reasonCount = Math.round((totalReturns * reasonPercent) / 100);
    const resaleValue = reason.resaleValue;
    const costPerReturn = processingCostPerReturn + shippingCostPerReturn + 
      inspectionCost + (restockingCost * refundRate / 100) + 
      (productCost * refundRate / 100) - 
      (productPrice * resaleValue * refundRate / 100);
    const cost = reasonCount * costPerReturn;
    
    return {
      name: reason.name,
      cost,
      count: reasonCount,
      color: reason.color,
    };
  });

  // Scenario analysis
  const scenarioData = [];
  for (let rate = 0; rate <= 50; rate += 5) {
    const scenarioReturns = Math.round((unitsSold * rate) / 100);
    const scenarioRefunds = Math.round((scenarioReturns * refundRate) / 100);
    const scenarioLostRevenue = productPrice * scenarioRefunds;
    const scenarioResaleRevenue = productPrice * scenarioRefunds * (averageResaleValuePercent / 100);
    const scenarioReturnCost = scenarioReturns * (processingCostPerReturn + shippingCostPerReturn + inspectionCost) +
      scenarioRefunds * restockingCost + scenarioRefunds * productCost;
    const scenarioProfit = grossProfit - scenarioReturnCost + scenarioResaleRevenue - (scenarioLostRevenue - scenarioResaleRevenue);
    const scenarioMargin = (scenarioProfit / grossRevenue) * 100;
    
    scenarioData.push({
      rate,
      netProfit: scenarioProfit,
      margin: scenarioMargin,
    });
  }

  return {
    totalReturns,
    refundCount,
    exchangeCount,
    grossRevenue,
    netRevenue,
    totalReturnCost,
    returnProcessingCost,
    returnShippingCost,
    lostRevenue: lostRevenueFromReturns,
    resaleRevenue,
    grossMarginPercent,
    adjustedMarginPercent,
    marginErosion,
    profitPerUnit,
    adjustedProfitPerUnit,
    breakEvenReturnRate: cappedBreakEvenRate,
    returnReasonCosts,
    scenarioData,
  };
}

export function ReturnRateProfitImpact() {
  const [activeTab, setActiveTab] = useState("calculator");

  const [inputs, setInputs] = useState<ReturnInputs>({
    productPrice: 50,
    productCost: 25,
    unitsSold: 1000,
    returnRate: 15,
    returnReasons: {
      defect: 15,
      wrongItem: 10,
      changedMind: 35,
      notAsDescribed: 20,
      qualityIssue: 12,
      sizeFit: 8,
    },
    refundRate: 70,
    exchangeRate: 30,
    processingCostPerReturn: 5,
    shippingCostPerReturn: 8,
    inspectionCost: 2,
    restockingCost: 3,
    averageResaleValuePercent: 70,
    currency: "USD",
  });

  const results = useMemo(() => calculateReturnImpact(inputs), [inputs]);

  const updateInput = <K extends keyof ReturnInputs>(field: K, value: ReturnInputs[K]) => {
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

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    primary: "#3B82F6",
    secondary: "#8B5CF6",
  };

  // Cost breakdown for pie chart
  const costBreakdownData = useMemo(() => [
    { name: "Processing", value: results.returnProcessingCost, color: chartColors.ocean },
    { name: "Shipping", value: results.returnShippingCost, color: chartColors.logistics },
    { name: "Lost Product Cost", value: inputs.productCost * results.refundCount, color: chartColors.danger },
    { name: "Restocking", value: inputs.restockingCost * results.refundCount, color: chartColors.warning },
    { name: "Inspection", value: inputs.inspectionCost * results.totalReturns, color: chartColors.secondary },
  ].filter(d => d.value > 0), [results, inputs, chartColors]);

  // Return reason breakdown for chart
  const returnReasonData = useMemo(() => 
    returnReasons.map((reason) => ({
      name: reason.name,
      value: inputs.returnReasons[reason.id as keyof ReturnReasonBreakdown] || 0,
      color: reason.color,
    })),
    [inputs.returnReasons]
  );

  // Profit erosion data
  const profitErosionData = useMemo(() => {
    return results.scenarioData.map((d) => ({
      rate: `${d.rate}%`,
      profit: d.netProfit,
      margin: d.margin,
      isCurrent: d.rate === inputs.returnRate,
    }));
  }, [results.scenarioData, inputs.returnRate]);

  // Margin comparison
  const marginComparisonData = useMemo(() => [
    { name: "Original Margin", value: results.grossMarginPercent, fill: chartColors.ocean },
    { name: "Adjusted Margin", value: results.adjustedMarginPercent, fill: chartColors.logistics },
  ], [results, chartColors]);

  const resetCalculator = () => {
    setInputs({
      productPrice: 50,
      productCost: 25,
      unitsSold: 1000,
      returnRate: 15,
      returnReasons: {
        defect: 15,
        wrongItem: 10,
        changedMind: 35,
        notAsDescribed: 20,
        qualityIssue: 12,
        sizeFit: 8,
      },
      refundRate: 70,
      exchangeRate: 30,
      processingCostPerReturn: 5,
      shippingCostPerReturn: 8,
      inspectionCost: 2,
      restockingCost: 3,
      averageResaleValuePercent: 70,
      currency: "USD",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="breakeven">Break-Even</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Product Details
                  </CardTitle>
                  <CardDescription>
                    Enter product pricing and sales volume
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

                  {/* Units Sold */}
                  <div className="space-y-2">
                    <Label htmlFor="unitsSold">Units Sold (per period)</Label>
                    <Input
                      id="unitsSold"
                      type="number"
                      value={inputs.unitsSold}
                      onChange={(e) => updateInput("unitsSold", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Margin Preview */}
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Gross Margin</span>
                      <Badge className="bg-[var(--logistics)]">{results.grossMarginPercent.toFixed(1)}%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Profit per Unit</span>
                      <span className="font-medium">{formatMoney(results.profitPerUnit)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RotateCcw className="h-5 w-5 text-[var(--logistics)]" />
                    Return Rate Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        <span className="font-medium text-[var(--ocean)]">{inputs.returnRate}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>

                  {/* Refund vs Exchange */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="refundRate">Refund Rate (%)</Label>
                      <Input
                        id="refundRate"
                        type="number"
                        value={inputs.refundRate}
                        onChange={(e) => {
                          const refund = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setInputs((prev) => ({
                            ...prev,
                            refundRate: refund,
                            exchangeRate: 100 - refund,
                          }));
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exchangeRate">Exchange Rate (%)</Label>
                      <Input
                        id="exchangeRate"
                        type="number"
                        value={inputs.exchangeRate}
                        onChange={(e) => {
                          const exchange = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                          setInputs((prev) => ({
                            ...prev,
                            exchangeRate: exchange,
                            refundRate: 100 - exchange,
                          }));
                        }}
                      />
                    </div>
                  </div>

                  {/* Return Count Preview */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--ocean)]">{results.totalReturns}</div>
                      <div className="text-xs text-muted-foreground">Total Returns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{results.refundCount}</div>
                      <div className="text-xs text-muted-foreground">Refunds</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--logistics)]">{results.exchangeCount}</div>
                      <div className="text-xs text-muted-foreground">Exchanges</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                    Processing Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="processingCost">Processing Cost/Return</Label>
                      <Input
                        id="processingCost"
                        type="number"
                        value={inputs.processingCostPerReturn}
                        onChange={(e) => updateInput("processingCostPerReturn", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingCost">Shipping Cost/Return</Label>
                      <Input
                        id="shippingCost"
                        type="number"
                        value={inputs.shippingCostPerReturn}
                        onChange={(e) => updateInput("shippingCostPerReturn", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="inspectionCost">Inspection Cost</Label>
                      <Input
                        id="inspectionCost"
                        type="number"
                        value={inputs.inspectionCost}
                        onChange={(e) => updateInput("inspectionCost", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restockingCost">Restocking Cost</Label>
                      <Input
                        id="restockingCost"
                        type="number"
                        value={inputs.restockingCost}
                        onChange={(e) => updateInput("restockingCost", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resaleValue">Average Resale Value (%)</Label>
                    <Input
                      id="resaleValue"
                      type="number"
                      value={inputs.averageResaleValuePercent}
                      onChange={(e) => updateInput("averageResaleValuePercent", parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Percentage of original price recovered when reselling returned items
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Return Impact Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Total Cost Impact */}
                  <motion.div
                    key={results.totalReturnCost}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-6 rounded-xl bg-gradient-to-br from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30"
                  >
                    <div className="text-sm text-muted-foreground mb-1">Total Return Cost Impact</div>
                    <div className="text-4xl font-bold text-red-600">
                      {formatMoney(results.totalReturnCost)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {((results.totalReturnCost / results.grossRevenue) * 100).toFixed(1)}% of gross revenue
                    </div>
                  </motion.div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Gross Revenue</div>
                      <div className="text-xl font-bold text-[var(--ocean)]">{formatMoney(results.grossRevenue)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Lost Revenue</div>
                      <div className="text-xl font-bold text-red-500">{formatMoney(results.lostRevenue)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Resale Revenue</div>
                      <div className="text-xl font-bold text-[var(--logistics)]">{formatMoney(results.resaleRevenue)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Cost per Return</div>
                      <div className="text-xl font-bold">
                        {formatMoney(results.totalReturnCost / (results.totalReturns || 1))}
                      </div>
                    </div>
                  </div>

                  {/* Margin Impact */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Margin Impact</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Original Gross Margin</span>
                        <span className="font-medium">{results.grossMarginPercent.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Adjusted Margin</span>
                        <span className="font-medium text-amber-600">{results.adjustedMarginPercent.toFixed(2)}%</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-sm">
                        <span>Margin Erosion</span>
                        <span className="text-red-500">-{results.marginErosion.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Margin Comparison Chart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={marginComparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                        <YAxis dataKey="name" type="category" width={120} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {marginComparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Break-Even Info */}
                  <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-[var(--ocean)]" />
                      <span className="font-medium text-sm">Break-Even Return Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--ocean)]">
                      {results.breakEvenReturnRate.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      At this return rate, returns would eliminate all profit
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Warning if margin erosion is high */}
              {results.marginErosion > 10 && (
                <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                      <div className="text-sm text-red-700 dark:text-red-300">
                        <p className="font-semibold mb-1">High Return Impact Warning</p>
                        <p>
                          Your return rate is eroding more than 10% of your gross margin. 
                          Consider strategies to reduce returns such as improved product descriptions, 
                          better sizing guides, or quality control improvements.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Cost Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Return Cost Breakdown
                </CardTitle>
                <CardDescription>
                  How return costs are distributed across different categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
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
                        labelLine={false}
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
                    <span>Total</span>
                    <span>{formatMoney(results.totalReturnCost)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[var(--logistics)]" />
                  Return Reason Analysis
                </CardTitle>
                <CardDescription>
                  Breakdown by return reason and associated costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
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

                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-sm">Cost by Return Reason</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {results.returnReasonCosts.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                          <div>
                            <span>{item.name}</span>
                            <span className="text-muted-foreground ml-2">({item.count} units)</span>
                          </div>
                        </div>
                        <span className="font-medium">{formatMoney(item.cost)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Return Reason Breakdown Input */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Return Reason Distribution
              </CardTitle>
              <CardDescription>
                Adjust the percentage breakdown of why customers return products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {returnReasons.map((reason) => (
                  <div key={reason.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2">
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
                    <p className="text-xs text-muted-foreground">
                      Typical: {reason.typicalPercent}% | Resale: {(reason.resaleValue * 100).toFixed(0)}%
                    </p>
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
                  Normalize to 100%
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                Profit Erosion by Return Rate
              </CardTitle>
              <CardDescription>
                See how different return rates impact your profitability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={profitErosionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="rate" />
                    <YAxis yAxisId="left" tickFormatter={(v) => formatMoney(v)} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value: number, name) => 
                        name === "Net Profit" ? formatMoney(value) : `${value.toFixed(1)}%`
                      }
                    />
                    <Legend />
                    <ReferenceLine
                      y={0}
                      stroke="#EF4444"
                      strokeDasharray="5 5"
                      yAxisId="left"
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="profit"
                      name="Net Profit"
                      fill={chartColors.ocean}
                      fillOpacity={0.3}
                      stroke={chartColors.ocean}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="margin"
                      name="Margin %"
                      stroke={chartColors.logistics}
                      strokeWidth={2}
                      dot={false}
                    />
                    {profitErosionData.map((entry, index) =>
                      entry.isCurrent ? (
                        <ReferenceLine
                          key={`current-${index}`}
                          x={entry.rate}
                          stroke="#F59E0B"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          label={{ value: "Current", position: "top" }}
                        />
                      ) : null
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.ocean }} />
                  <span className="text-sm text-muted-foreground">Net Profit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.logistics }} />
                  <span className="text-sm text-muted-foreground">Margin %</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-1 bg-amber-500" />
                  <span className="text-sm text-muted-foreground">Current Rate</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scenario Comparison</CardTitle>
              <CardDescription>
                Compare profitability across different return rate scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Return Rate</th>
                      <th className="text-right py-3 px-4">Net Profit</th>
                      <th className="text-right py-3 px-4">Margin</th>
                      <th className="text-right py-3 px-4">Profit Change</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.scenarioData.map((scenario, index) => {
                      const baseProfit = results.scenarioData[0].netProfit;
                      const profitChange = scenario.netProfit - baseProfit;
                      const isCurrent = scenario.rate === inputs.returnRate;
                      
                      return (
                        <tr
                          key={index}
                          className={`border-b ${isCurrent ? "bg-[var(--ocean)]/10" : ""}`}
                        >
                          <td className="py-3 px-4 font-medium">{scenario.rate}%</td>
                          <td className="text-right py-3 px-4">{formatMoney(scenario.netProfit)}</td>
                          <td className="text-right py-3 px-4">{scenario.margin.toFixed(1)}%</td>
                          <td className={`text-right py-3 px-4 ${profitChange < 0 ? "text-red-500" : "text-[var(--logistics)]"}`}>
                            {profitChange >= 0 ? "+" : ""}{formatMoney(profitChange)}
                          </td>
                          <td className="text-center py-3 px-4">
                            {isCurrent ? (
                              <Badge className="bg-[var(--ocean)]">Current</Badge>
                            ) : scenario.netProfit < 0 ? (
                              <Badge variant="destructive">Loss</Badge>
                            ) : (
                              <Badge variant="outline">-</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Break-Even Tab */}
        <TabsContent value="breakeven" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Break-Even Return Rate Analysis
              </CardTitle>
              <CardDescription>
                Find the return rate threshold where profitability turns negative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Break-Even Display */}
              <div className="text-center p-8 rounded-xl bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--logistics)]/10">
                <div className="text-sm text-muted-foreground mb-2">Break-Even Return Rate</div>
                <div className="text-5xl font-bold text-[var(--ocean)]">
                  {results.breakEvenReturnRate.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  At this return rate, the total cost of returns would eliminate all gross profit 
                  from your sales volume.
                </p>
              </div>

              {/* Safety Margin */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Current Rate</div>
                  <div className="text-2xl font-bold">{inputs.returnRate}%</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Break-Even Rate</div>
                  <div className="text-2xl font-bold text-[var(--ocean)]">{results.breakEvenReturnRate.toFixed(1)}%</div>
                </div>
                <div className={`p-4 rounded-lg ${
                  results.breakEvenReturnRate - inputs.returnRate > 10 
                    ? "bg-green-50 dark:bg-green-950/30" 
                    : results.breakEvenReturnRate - inputs.returnRate > 5 
                    ? "bg-amber-50 dark:bg-amber-950/30"
                    : "bg-red-50 dark:bg-red-950/30"
                }`}>
                  <div className="text-xs text-muted-foreground mb-1">Safety Margin</div>
                  <div className={`text-2xl font-bold ${
                    results.breakEvenReturnRate - inputs.returnRate > 10 
                      ? "text-green-600" 
                      : results.breakEvenReturnRate - inputs.returnRate > 5 
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}>
                    {(results.breakEvenReturnRate - inputs.returnRate).toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Rate</span>
                  <span>Break-Even</span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--logistics)] to-amber-500"
                    style={{ width: `${Math.min((inputs.returnRate / results.breakEvenReturnRate) * 100, 100)}%` }}
                  />
                  <div
                    className="absolute top-0 h-full w-1 bg-[var(--ocean)]"
                    style={{ left: `${Math.min((inputs.returnRate / results.breakEvenReturnRate) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {(inputs.returnRate / results.breakEvenReturnRate * 100).toFixed(0)}% of break-even threshold
                </p>
              </div>

              {/* Risk Assessment */}
              <div className={`p-4 rounded-lg ${
                results.breakEvenReturnRate - inputs.returnRate > 10 
                  ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800" 
                  : results.breakEvenReturnRate - inputs.returnRate > 5 
                  ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
                  : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
              }`}>
                <div className="flex gap-3">
                  {results.breakEvenReturnRate - inputs.returnRate > 10 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  ) : results.breakEvenReturnRate - inputs.returnRate > 5 ? (
                    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                  )}
                  <div className="text-sm">
                    <p className="font-semibold mb-1">
                      {results.breakEvenReturnRate - inputs.returnRate > 10 
                        ? "Healthy Return Rate" 
                        : results.breakEvenReturnRate - inputs.returnRate > 5 
                        ? "Moderate Risk" 
                        : "High Risk"}
                    </p>
                    <p className="text-muted-foreground">
                      {results.breakEvenReturnRate - inputs.returnRate > 10 
                        ? "Your return rate is well within safe limits. You have significant buffer before reaching break-even." 
                        : results.breakEvenReturnRate - inputs.returnRate > 5 
                        ? "Your return rate is approaching concerning levels. Monitor closely and implement return reduction strategies." 
                        : "Your return rate is very close to break-even. Immediate action needed to reduce returns and protect margins."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                Industry Return Rate Benchmarks
              </CardTitle>
              <CardDescription>
                Compare your return rate against industry averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Industry</th>
                      <th className="text-right py-3 px-4">Avg Return Rate</th>
                      <th className="text-right py-3 px-4">High Risk Rate</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {industryBenchmarks.map((industry, index) => {
                      const isHigherThanAvg = inputs.returnRate > industry.avgReturnRate;
                      const isHighRisk = inputs.returnRate >= industry.highRiskRate;
                      
                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 font-medium">{industry.industry}</td>
                          <td className="text-right py-3 px-4">{industry.avgReturnRate}%</td>
                          <td className="text-right py-3 px-4 text-red-500">{industry.highRiskRate}%</td>
                          <td className="text-center py-3 px-4">
                            {isHighRisk ? (
                              <Badge variant="destructive">High Risk</Badge>
                            ) : isHigherThanAvg ? (
                              <Badge variant="secondary" className="bg-amber-500">Above Avg</Badge>
                            ) : (
                              <Badge className="bg-[var(--logistics)]">Below Avg</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Strategies to Reduce Return Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="quality">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--logistics)]">1</Badge>
                      <span>Improve Product Quality Control</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Defect-related returns can be minimized through:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Pre-shipment quality inspections</li>
                        <li>Better packaging to prevent shipping damage</li>
                        <li>Working with suppliers on quality standards</li>
                        <li>Implementing quality control checkpoints</li>
                      </ul>
                      <p className="mt-2"><strong>Impact:</strong> Can reduce defect returns by 30-50%</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="description">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--logistics)]">2</Badge>
                      <span>Enhance Product Descriptions & Images</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>&quot;Not as described&quot; returns can be reduced by:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>High-quality product photos from multiple angles</li>
                        <li>Accurate sizing charts and measurements</li>
                        <li>Detailed material and feature descriptions</li>
                        <li>Customer reviews and Q&amp;A sections</li>
                      </ul>
                      <p className="mt-2"><strong>Impact:</strong> Can reduce description-related returns by 20-40%</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sizing">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--logistics)]">3</Badge>
                      <span>Implement Size Guides & Fit Tools</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Size/fit issues are common in apparel. Solutions include:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Interactive size recommendation tools</li>
                        <li>Model measurements with each product</li>
                        <li>Customer-submitted fit reviews</li>
                        <li>Virtual try-on technology</li>
                      </ul>
                      <p className="mt-2"><strong>Impact:</strong> Can reduce size-related returns by 25-45%</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="exchange">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--logistics)]">4</Badge>
                      <span>Promote Exchanges Over Refunds</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Converting refunds to exchanges preserves revenue:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Easy self-service exchange process</li>
                        <li>Free exchange shipping</li>
                        <li>Instant store credit option</li>
                        <li>Product recommendations during return process</li>
                      </ul>
                      <p className="mt-2"><strong>Impact:</strong> Can increase exchange rate by 15-30%</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="processing">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--logistics)]">5</Badge>
                      <span>Optimize Return Processing</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Reduce processing costs and increase resale value:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Automated return authorization</li>
                        <li>Fast inspection and restocking</li>
                        <li>Refurbishment programs</li>
                        <li>Liquidation channels for unsellable items</li>
                      </ul>
                      <p className="mt-2"><strong>Impact:</strong> Can reduce processing costs by 20-35%</p>
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
