"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  BarChart3,
  Info,
  Calculator,
  Clock,
  DollarSign,
  Target,
  Layers,
  PieChart,
  RefreshCw,
  Download,
  Share2,
  Zap,
  Database,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  ComposedChart,
  Area,
  ReferenceLine,
} from "recharts";

// Brand Colors
const BRAND_COLORS = {
  oceanBlue: "#2B4570",
  sustainabilityGreen: "#4CAF50",
  oceanBlueLight: "#3D5A80",
  greenLight: "#66BB6A",
  warning: "#F59E0B",
  danger: "#EF4444",
};

// Z-scores for different service levels
const serviceLevelZScores: Record<string, { label: string; zScore: number; risk: number }> = {
  "90": { label: "90%", zScore: 1.28, risk: 10 },
  "95": { label: "95%", zScore: 1.65, risk: 5 },
  "97.5": { label: "97.5%", zScore: 1.96, risk: 2.5 },
  "99": { label: "99%", zScore: 2.33, risk: 1 },
  "99.5": { label: "99.5%", zScore: 2.58, risk: 0.5 },
  "99.9": { label: "99.9%", zScore: 3.09, risk: 0.1 },
};

// ABC Analysis sample data structure
interface ABCItem {
  id: string;
  name: string;
  annualUsage: number;
  unitCost: number;
  annualValue: number;
  category: "A" | "B" | "C";
  cumulativeValue: number;
  cumulativePercent: number;
}

// Demand forecast data point
interface DemandForecastPoint {
  period: string;
  historical: number;
  forecast: number;
  lowerBound: number;
  upperBound: number;
}

export function InventoryOptimizationTool() {
  const [activeTab, setActiveTab] = useState("safety-stock");

  // ==================== SAFETY STOCK STATE ====================
  const [ssCalculationMethod, setSsCalculationMethod] = useState<string>("statistical");
  const [averageDailyDemand, setAverageDailyDemand] = useState<string>("100");
  const [demandStdDev, setDemandStdDev] = useState<string>("20");
  const [leadTime, setLeadTime] = useState<string>("7");
  const [leadTimeStdDev, setLeadTimeStdDev] = useState<string>("2");
  const [serviceLevel, setServiceLevel] = useState<string>("95");
  const [unitCost, setUnitCost] = useState<string>("50");
  const [holdingRate, setHoldingRate] = useState<string>("25");
  const [maxDailyDemand, setMaxDailyDemand] = useState<string>("150");
  const [maxLeadTime, setMaxLeadTime] = useState<string>("14");

  // ==================== REORDER POINT STATE ====================
  const [ropDailyDemand, setRopDailyDemand] = useState<string>("50");
  const [ropLeadTime, setRopLeadTime] = useState<string>("5");
  const [ropSafetyStock, setRopSafetyStock] = useState<string>("100");
  const [ropReviewPeriod, setRopReviewPeriod] = useState<string>("7");

  // ==================== ABC ANALYSIS STATE ====================
  const [abcItems, setAbcItems] = useState<ABCItem[]>([
    { id: "1", name: "Product A", annualUsage: 1000, unitCost: 150, annualValue: 150000, category: "A", cumulativeValue: 0, cumulativePercent: 0 },
    { id: "2", name: "Product B", annualUsage: 500, unitCost: 200, annualValue: 100000, category: "A", cumulativeValue: 0, cumulativePercent: 0 },
    { id: "3", name: "Product C", annualUsage: 2000, unitCost: 40, annualValue: 80000, category: "B", cumulativeValue: 0, cumulativePercent: 0 },
    { id: "4", name: "Product D", annualUsage: 800, unitCost: 50, annualValue: 40000, category: "B", cumulativeValue: 0, cumulativePercent: 0 },
    { id: "5", name: "Product E", annualUsage: 3000, unitCost: 10, annualValue: 30000, category: "C", cumulativeValue: 0, cumulativePercent: 0 },
    { id: "6", name: "Product F", annualUsage: 1500, unitCost: 15, annualValue: 22500, category: "C", cumulativeValue: 0, cumulativePercent: 0 },
  ]);

  // ==================== DEMAND FORECAST STATE ====================
  const [forecastMethod, setForecastMethod] = useState<string>("moving-average");
  const [historicalPeriods, setHistoricalPeriods] = useState<string>("12");
  const [growthRate, setGrowthRate] = useState<string>("5");
  const [seasonality, setSeasonality] = useState<string>("10");
  const [baseDemand, setBaseDemand] = useState<string>("1000");

  // ==================== INVENTORY TURNOVER STATE ====================
  const [cogs, setCogs] = useState<string>("1200000");
  const [avgInventory, setAvgInventory] = useState<string>("200000");
  const [salesRevenue, setSalesRevenue] = useState<string>("2000000");

  // ==================== CARRYING COST STATE ====================
  const [ccAvgInventoryValue, setCcAvgInventoryValue] = useState<string>("500000");
  const [ccStorageRate, setCcStorageRate] = useState<string>("5");
  const [ccInsuranceRate, setCcInsuranceRate] = useState<string>("1");
  const [ccObsolescenceRate, setCcObsolescenceRate] = useState<string>("3");
  const [ccCapitalRate, setCcCapitalRate] = useState<string>("8");
  const [ccHandlingRate, setCcHandlingRate] = useState<string>("2");

  // ==================== SAFETY STOCK CALCULATION ====================
  const safetyStockResult = useMemo(() => {
    const avgD = parseFloat(averageDailyDemand) || 0;
    const stdD = parseFloat(demandStdDev) || 0;
    const LT = parseFloat(leadTime) || 0;
    const stdLT = parseFloat(leadTimeStdDev) || 0;
    const sl = serviceLevelZScores[serviceLevel] || { zScore: 1.65, risk: 5 };
    const cost = parseFloat(unitCost) || 0;
    const holdRate = parseFloat(holdingRate) || 0;

    let safetyStock = 0;

    if (ssCalculationMethod === "statistical") {
      safetyStock = sl.zScore * Math.sqrt(
        LT * Math.pow(stdD, 2) + Math.pow(avgD, 2) * Math.pow(stdLT, 2)
      );
    } else {
      const maxD = parseFloat(maxDailyDemand) || avgD;
      const maxLT = parseFloat(maxLeadTime) || LT;
      safetyStock = (maxD * maxLT) - (avgD * LT);
    }

    const demandDuringLeadTime = avgD * LT;
    const reorderPoint = demandDuringLeadTime + safetyStock;
    const holdingCost = safetyStock * cost * (holdRate / 100);
    const demandVariability = avgD > 0 ? (stdD / avgD) * 100 : 0;
    const leadTimeVariability = LT > 0 ? (stdLT / LT) * 100 : 0;

    return {
      safetyStock: Math.round(safetyStock),
      reorderPoint: Math.round(reorderPoint),
      averageDemand: avgD,
      demandDuringLeadTime: Math.round(demandDuringLeadTime),
      serviceLevel: parseFloat(serviceLevel),
      zScore: sl.zScore,
      demandVariability,
      leadTimeVariability,
      stockoutRisk: sl.risk,
      holdingCost,
    };
  }, [ssCalculationMethod, averageDailyDemand, demandStdDev, leadTime, leadTimeStdDev, serviceLevel, unitCost, holdingRate, maxDailyDemand, maxLeadTime]);

  // ==================== REORDER POINT CALCULATION ====================
  const reorderPointResult = useMemo(() => {
    const dailyDemand = parseFloat(ropDailyDemand) || 0;
    const lt = parseFloat(ropLeadTime) || 0;
    const ss = parseFloat(ropSafetyStock) || 0;
    const reviewPeriod = parseFloat(ropReviewPeriod) || 0;

    const leadTimeDemand = dailyDemand * lt;
    const reorderPoint = leadTimeDemand + ss;
    const maxInventory = reorderPoint + (dailyDemand * reviewPeriod);
    const avgInventory = ss + (leadTimeDemand / 2);

    return {
      leadTimeDemand: Math.round(leadTimeDemand),
      reorderPoint: Math.round(reorderPoint),
      maxInventory: Math.round(maxInventory),
      avgInventory: Math.round(avgInventory),
      safetyStock: ss,
      reviewPeriodDemand: Math.round(dailyDemand * reviewPeriod),
    };
  }, [ropDailyDemand, ropLeadTime, ropSafetyStock, ropReviewPeriod]);

  // ==================== ABC ANALYSIS CALCULATION ====================
  const abcAnalysisResult = useMemo(() => {
    const sortedItems = [...abcItems].sort((a, b) => b.annualValue - a.annualValue);
    const totalValue = sortedItems.reduce((sum, item) => sum + item.annualValue, 0);
    
    // Use reduce to maintain immutability
    const { items: classifiedItems } = sortedItems.reduce<{ items: typeof sortedItems; cumulativeValue: number }>(
      (acc, item) => {
        const newCumulativeValue = acc.cumulativeValue + item.annualValue;
        const cumulativePercent = (newCumulativeValue / totalValue) * 100;
        
        const category: "A" | "B" | "C" = 
          cumulativePercent <= 80 ? "A" : 
          cumulativePercent <= 95 ? "B" : "C";
        
        return {
          cumulativeValue: newCumulativeValue,
          items: [...acc.items, {
            ...item,
            category,
            cumulativeValue: newCumulativeValue,
            cumulativePercent,
          }],
        };
      },
      { items: [], cumulativeValue: 0 }
    );

    const categoryA = classifiedItems.filter(i => i.category === "A");
    const categoryB = classifiedItems.filter(i => i.category === "B");
    const categoryC = classifiedItems.filter(i => i.category === "C");

    return {
      items: classifiedItems,
      totalValue,
      categoryA: {
        count: categoryA.length,
        value: categoryA.reduce((sum, i) => sum + i.annualValue, 0),
        percent: (categoryA.reduce((sum, i) => sum + i.annualValue, 0) / totalValue) * 100,
      },
      categoryB: {
        count: categoryB.length,
        value: categoryB.reduce((sum, i) => sum + i.annualValue, 0),
        percent: (categoryB.reduce((sum, i) => sum + i.annualValue, 0) / totalValue) * 100,
      },
      categoryC: {
        count: categoryC.length,
        value: categoryC.reduce((sum, i) => sum + i.annualValue, 0),
        percent: (categoryC.reduce((sum, i) => sum + i.annualValue, 0) / totalValue) * 100,
      },
    };
  }, [abcItems]);

  const abcChartData = useMemo(() => [
    { name: "Category A", value: abcAnalysisResult.categoryA.percent, count: abcAnalysisResult.categoryA.count, color: BRAND_COLORS.oceanBlue },
    { name: "Category B", value: abcAnalysisResult.categoryB.percent, count: abcAnalysisResult.categoryB.count, color: BRAND_COLORS.sustainabilityGreen },
    { name: "Category C", value: abcAnalysisResult.categoryC.percent, count: abcAnalysisResult.categoryC.count, color: BRAND_COLORS.warning },
  ], [abcAnalysisResult]);

  // ==================== DEMAND FORECAST CALCULATION ====================
  const demandForecastResult = useMemo(() => {
    const periods = parseInt(historicalPeriods) || 12;
    const growth = parseFloat(growthRate) || 0;
    const seasonalityFactor = parseFloat(seasonality) || 0;
    const base = parseFloat(baseDemand) || 1000;

    const forecastData: DemandForecastPoint[] = [];
    
    // Generate historical data
    for (let i = -6; i <= 0; i++) {
      const seasonalMultiplier = 1 + (Math.sin((i / 12) * 2 * Math.PI) * seasonalityFactor / 100);
      const historicalValue = base * Math.pow(1 + growth / 100, i) * seasonalMultiplier;
      forecastData.push({
        period: `Month ${i + 7}`,
        historical: Math.round(historicalValue),
        forecast: 0,
        lowerBound: 0,
        upperBound: 0,
      });
    }

    // Generate forecast
    for (let i = 1; i <= 6; i++) {
      const seasonalMultiplier = 1 + (Math.sin((i / 12) * 2 * Math.PI) * seasonalityFactor / 100);
      const forecastValue = base * Math.pow(1 + growth / 100, i) * seasonalMultiplier;
      const variance = forecastValue * 0.1;
      forecastData.push({
        period: `Month ${i + 6}`,
        historical: 0,
        forecast: Math.round(forecastValue),
        lowerBound: Math.round(forecastValue - variance),
        upperBound: Math.round(forecastValue + variance),
      });
    }

    const avgForecast = forecastData.slice(7).reduce((sum, d) => sum + d.forecast, 0) / 6;
    const totalForecast = avgForecast * 6;

    return {
      data: forecastData,
      avgForecast: Math.round(avgForecast),
      totalForecast: Math.round(totalForecast),
      growthTrend: growth,
    };
  }, [historicalPeriods, growthRate, seasonality, baseDemand]);

  // ==================== INVENTORY TURNOVER CALCULATION ====================
  const turnoverResult = useMemo(() => {
    const cogsValue = parseFloat(cogs) || 0;
    const avgInvValue = parseFloat(avgInventory) || 0;
    const salesValue = parseFloat(salesRevenue) || 0;

    const turnoverRatio = avgInvValue > 0 ? cogsValue / avgInvValue : 0;
    const daysInventoryOutstanding = turnoverRatio > 0 ? 365 / turnoverRatio : 0;
    const grossMargin = salesValue > 0 ? ((salesValue - cogsValue) / salesValue) * 100 : 0;
    const gmroi = avgInvValue > 0 ? (salesValue - cogsValue) / avgInvValue : 0;

    let performance: "excellent" | "good" | "needs-improvement" | "poor" = "poor";
    if (turnoverRatio >= 8) performance = "excellent";
    else if (turnoverRatio >= 5) performance = "good";
    else if (turnoverRatio >= 3) performance = "needs-improvement";

    return {
      turnoverRatio: turnoverRatio.toFixed(2),
      daysInventoryOutstanding: Math.round(daysInventoryOutstanding),
      grossMargin: grossMargin.toFixed(1),
      gmroi: gmroi.toFixed(2),
      performance,
    };
  }, [cogs, avgInventory, salesRevenue]);

  // ==================== CARRYING COST CALCULATION ====================
  const carryingCostResult = useMemo(() => {
    const inventoryValue = parseFloat(ccAvgInventoryValue) || 0;
    const storage = parseFloat(ccStorageRate) || 0;
    const insurance = parseFloat(ccInsuranceRate) || 0;
    const obsolescence = parseFloat(ccObsolescenceRate) || 0;
    const capital = parseFloat(ccCapitalRate) || 0;
    const handling = parseFloat(ccHandlingRate) || 0;

    const totalRate = storage + insurance + obsolescence + capital + handling;
    const storageCost = (inventoryValue * storage) / 100;
    const insuranceCost = (inventoryValue * insurance) / 100;
    const obsolescenceCost = (inventoryValue * obsolescence) / 100;
    const capitalCost = (inventoryValue * capital) / 100;
    const handlingCost = (inventoryValue * handling) / 100;
    const totalCost = (inventoryValue * totalRate) / 100;

    return {
      totalRate,
      totalCost: Math.round(totalCost),
      breakdown: [
        { name: "Storage", cost: Math.round(storageCost), rate: storage, color: BRAND_COLORS.oceanBlue },
        { name: "Insurance", cost: Math.round(insuranceCost), rate: insurance, color: BRAND_COLORS.sustainabilityGreen },
        { name: "Obsolescence", cost: Math.round(obsolescenceCost), rate: obsolescence, color: BRAND_COLORS.warning },
        { name: "Capital Cost", cost: Math.round(capitalCost), rate: capital, color: BRAND_COLORS.danger },
        { name: "Handling", cost: Math.round(handlingCost), rate: handling, color: BRAND_COLORS.oceanBlueLight },
      ],
    };
  }, [ccAvgInventoryValue, ccStorageRate, ccInsuranceRate, ccObsolescenceRate, ccCapitalRate, ccHandlingRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(num));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="safety-stock" className="text-xs md:text-sm">
            <Shield className="h-4 w-4 mr-1 hidden md:inline" />
            Safety Stock
          </TabsTrigger>
          <TabsTrigger value="reorder-point" className="text-xs md:text-sm">
            <Target className="h-4 w-4 mr-1 hidden md:inline" />
            Reorder Point
          </TabsTrigger>
          <TabsTrigger value="abc-analysis" className="text-xs md:text-sm">
            <Layers className="h-4 w-4 mr-1 hidden md:inline" />
            ABC Analysis
          </TabsTrigger>
          <TabsTrigger value="demand-forecast" className="text-xs md:text-sm">
            <LineChart className="h-4 w-4 mr-1 hidden md:inline" />
            Forecast
          </TabsTrigger>
          <TabsTrigger value="turnover" className="text-xs md:text-sm">
            <TrendingUp className="h-4 w-4 mr-1 hidden md:inline" />
            Turnover
          </TabsTrigger>
          <TabsTrigger value="carrying-cost" className="text-xs md:text-sm">
            <DollarSign className="h-4 w-4 mr-1 hidden md:inline" />
            Carrying Cost
          </TabsTrigger>
        </TabsList>

        {/* ==================== SAFETY STOCK TAB ==================== */}
        <TabsContent value="safety-stock" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                    Calculation Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={ssCalculationMethod} onValueChange={setSsCalculationMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statistical">Statistical Method (Recommended)</SelectItem>
                      <SelectItem value="simple">Simple Max-Average Method</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {ssCalculationMethod === "statistical" 
                      ? "Uses standard deviation for more accurate results"
                      : "Uses maximum values for conservative estimates"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                    Demand Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="avgDemand">Average Daily Demand</Label>
                      <Input
                        id="avgDemand"
                        type="number"
                        value={averageDailyDemand}
                        onChange={(e) => setAverageDailyDemand(e.target.value)}
                        placeholder="100"
                      />
                    </div>
                    {ssCalculationMethod === "statistical" ? (
                      <div className="space-y-2">
                        <Label htmlFor="demandStdDev">Demand Std. Deviation</Label>
                        <Input
                          id="demandStdDev"
                          type="number"
                          value={demandStdDev}
                          onChange={(e) => setDemandStdDev(e.target.value)}
                          placeholder="20"
                        />
                        <p className="text-xs text-muted-foreground">
                          ~{formatNumber(safetyStockResult.demandVariability)}% variability
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="maxDemand">Max Daily Demand</Label>
                        <Input
                          id="maxDemand"
                          type="number"
                          value={maxDailyDemand}
                          onChange={(e) => setMaxDailyDemand(e.target.value)}
                          placeholder="150"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                    Lead Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leadTime">Average Lead Time (Days)</Label>
                      <Input
                        id="leadTime"
                        type="number"
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value)}
                        placeholder="7"
                      />
                    </div>
                    {ssCalculationMethod === "statistical" ? (
                      <div className="space-y-2">
                        <Label htmlFor="leadTimeStdDev">Lead Time Std. Deviation</Label>
                        <Input
                          id="leadTimeStdDev"
                          type="number"
                          value={leadTimeStdDev}
                          onChange={(e) => setLeadTimeStdDev(e.target.value)}
                          placeholder="2"
                        />
                        <p className="text-xs text-muted-foreground">
                          ~{formatNumber(safetyStockResult.leadTimeVariability)}% variability
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="maxLeadTime">Max Lead Time (Days)</Label>
                        <Input
                          id="maxLeadTime"
                          type="number"
                          value={maxLeadTime}
                          onChange={(e) => setMaxLeadTime(e.target.value)}
                          placeholder="14"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: BRAND_COLORS.sustainabilityGreen }} />
                    Service Level & Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Target Service Level</Label>
                    <Select value={serviceLevel} onValueChange={setServiceLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(serviceLevelZScores).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.label} service level (Z = {data.zScore})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unitCost">Unit Cost ($)</Label>
                      <Input
                        id="unitCost"
                        type="number"
                        value={unitCost}
                        onChange={(e) => setUnitCost(e.target.value)}
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holdingRate">Holding Rate (%/year)</Label>
                      <Input
                        id="holdingRate"
                        type="number"
                        value={holdingRate}
                        onChange={(e) => setHoldingRate(e.target.value)}
                        placeholder="25"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className="border-2" style={{ borderColor: BRAND_COLORS.sustainabilityGreen }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: BRAND_COLORS.sustainabilityGreen }} />
                    Safety Stock Result
                  </CardTitle>
                  <CardDescription>
                    Recommended buffer stock for {serviceLevelZScores[serviceLevel]?.label} service level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-bold"
                      style={{ color: BRAND_COLORS.sustainabilityGreen }}
                    >
                      {formatNumber(safetyStockResult.safetyStock)}
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">
                      Units Safety Stock
                    </div>
                    <Badge className="mt-2 text-white" style={{ backgroundColor: BRAND_COLORS.sustainabilityGreen }}>
                      {serviceLevelZScores[serviceLevel]?.label} Service Level
                    </Badge>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                        {formatNumber(safetyStockResult.reorderPoint)}
                      </div>
                      <div className="text-xs text-muted-foreground">Reorder Point</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold" style={{ color: BRAND_COLORS.sustainabilityGreen }}>
                        {formatNumber(safetyStockResult.demandDuringLeadTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">Lead Time Demand</div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Annual Holding Cost</span>
                      <span className="font-bold" style={{ color: BRAND_COLORS.sustainabilityGreen }}>
                        {formatCurrency(safetyStockResult.holdingCost)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" style={{ color: BRAND_COLORS.warning }} />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Stockout Risk</span>
                      <Badge variant={safetyStockResult.stockoutRisk <= 1 ? "default" : safetyStockResult.stockoutRisk <= 5 ? "secondary" : "destructive"}>
                        {safetyStockResult.stockoutRisk}% chance
                      </Badge>
                    </div>
                    <Progress 
                      value={safetyStockResult.serviceLevel} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Lower Service Level</span>
                      <span>Higher Service Level</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==================== REORDER POINT TAB ==================== */}
        <TabsContent value="reorder-point" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Reorder Point Parameters
                </CardTitle>
                <CardDescription>Configure your inventory replenishment triggers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ropDailyDemand">Daily Demand (units)</Label>
                    <Input
                      id="ropDailyDemand"
                      type="number"
                      value={ropDailyDemand}
                      onChange={(e) => setRopDailyDemand(e.target.value)}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ropLeadTime">Lead Time (days)</Label>
                    <Input
                      id="ropLeadTime"
                      type="number"
                      value={ropLeadTime}
                      onChange={(e) => setRopLeadTime(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ropSafetyStock">Safety Stock (units)</Label>
                    <Input
                      id="ropSafetyStock"
                      type="number"
                      value={ropSafetyStock}
                      onChange={(e) => setRopSafetyStock(e.target.value)}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ropReviewPeriod">Review Period (days)</Label>
                    <Input
                      id="ropReviewPeriod"
                      type="number"
                      value={ropReviewPeriod}
                      onChange={(e) => setRopReviewPeriod(e.target.value)}
                      placeholder="7"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.oceanBlue }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Reorder Point Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${BRAND_COLORS.oceanBlue}20` }}>
                    <p className="text-sm text-muted-foreground">Reorder Point</p>
                    <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                      {formatNumber(reorderPointResult.reorderPoint)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">units</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${BRAND_COLORS.sustainabilityGreen}20` }}>
                    <p className="text-sm text-muted-foreground">Lead Time Demand</p>
                    <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.sustainabilityGreen }}>
                      {formatNumber(reorderPointResult.leadTimeDemand)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">units</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Safety Stock</p>
                    <p className="text-xl font-bold">{formatNumber(reorderPointResult.safetyStock)}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Max Inventory</p>
                    <p className="text-xl font-bold">{formatNumber(reorderPointResult.maxInventory)}</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg Inventory</p>
                    <p className="text-xl font-bold">{formatNumber(reorderPointResult.avgInventory)}</p>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Reorder Point Formula</h4>
                  <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                    ROP = (Daily Demand × Lead Time) + Safety Stock
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== ABC ANALYSIS TAB ==================== */}
        <TabsContent value="abc-analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Category Summary Cards */}
            <Card className="border-2" style={{ borderColor: BRAND_COLORS.oceanBlue }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge style={{ backgroundColor: BRAND_COLORS.oceanBlue }}>A</Badge>
                  Category A - Critical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {abcAnalysisResult.categoryA.percent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">of total value</div>
                  <Separator className="my-3" />
                  <div className="text-lg font-medium">
                    {abcAnalysisResult.categoryA.count} items
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(abcAnalysisResult.categoryA.value)} value
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  High-value items requiring tight control
                </p>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.sustainabilityGreen }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge style={{ backgroundColor: BRAND_COLORS.sustainabilityGreen }}>B</Badge>
                  Category B - Important
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold" style={{ color: BRAND_COLORS.sustainabilityGreen }}>
                    {abcAnalysisResult.categoryB.percent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">of total value</div>
                  <Separator className="my-3" />
                  <div className="text-lg font-medium">
                    {abcAnalysisResult.categoryB.count} items
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(abcAnalysisResult.categoryB.value)} value
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Moderate-value items with regular review
                </p>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.warning }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge style={{ backgroundColor: BRAND_COLORS.warning }}>C</Badge>
                  Category C - Standard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="text-3xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                    {abcAnalysisResult.categoryC.percent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">of total value</div>
                  <Separator className="my-3" />
                  <div className="text-lg font-medium">
                    {abcAnalysisResult.categoryC.count} items
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(abcAnalysisResult.categoryC.value)} value
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Low-value items with simplified control
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Value Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={abcChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      >
                        {abcChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.sustainabilityGreen }} />
                  Pareto Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={abcAnalysisResult.items}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="annualValue" fill={BRAND_COLORS.oceanBlue} name="Annual Value" />
                      <Line yAxisId="right" type="monotone" dataKey="cumulativePercent" stroke={BRAND_COLORS.sustainabilityGreen} strokeWidth={2} name="Cumulative %" />
                      <ReferenceLine yAxisId="right" y={80} stroke={BRAND_COLORS.danger} strokeDasharray="5 5" label="80% threshold" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Item Classification Details</CardTitle>
              <CardDescription>Items sorted by annual value (Pareto principle)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Item</th>
                      <th className="text-right py-2 px-3">Annual Usage</th>
                      <th className="text-right py-2 px-3">Unit Cost</th>
                      <th className="text-right py-2 px-3">Annual Value</th>
                      <th className="text-right py-2 px-3">Cumulative %</th>
                      <th className="text-center py-2 px-3">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {abcAnalysisResult.items.map((item, index) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-3 font-medium">{item.name}</td>
                        <td className="text-right py-2 px-3">{formatNumber(item.annualUsage)}</td>
                        <td className="text-right py-2 px-3">{formatCurrency(item.unitCost)}</td>
                        <td className="text-right py-2 px-3">{formatCurrency(item.annualValue)}</td>
                        <td className="text-right py-2 px-3">{item.cumulativePercent.toFixed(1)}%</td>
                        <td className="text-center py-2 px-3">
                          <Badge style={{ 
                            backgroundColor: item.category === "A" ? BRAND_COLORS.oceanBlue : 
                              item.category === "B" ? BRAND_COLORS.sustainabilityGreen : BRAND_COLORS.warning 
                          }}>
                            {item.category}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== DEMAND FORECAST TAB ==================== */}
        <TabsContent value="demand-forecast" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Forecast Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Forecast Method</Label>
                  <Select value={forecastMethod} onValueChange={setForecastMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moving-average">Moving Average</SelectItem>
                      <SelectItem value="exponential">Exponential Smoothing</SelectItem>
                      <SelectItem value="trend">Trend Projection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseDemand">Base Demand</Label>
                  <Input
                    id="baseDemand"
                    type="number"
                    value={baseDemand}
                    onChange={(e) => setBaseDemand(e.target.value)}
                    placeholder="1000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="growthRate">Annual Growth Rate (%)</Label>
                  <Input
                    id="growthRate"
                    type="number"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(e.target.value)}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seasonality">Seasonality Factor (%)</Label>
                  <Input
                    id="seasonality"
                    type="number"
                    value={seasonality}
                    onChange={(e) => setSeasonality(e.target.value)}
                    placeholder="10"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="h-5 w-5" style={{ color: BRAND_COLORS.sustainabilityGreen }} />
                  Demand Forecast Chart
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={demandForecastResult.data}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="historical" 
                        stroke={BRAND_COLORS.oceanBlue} 
                        strokeWidth={2}
                        name="Historical"
                        dot={{ fill: BRAND_COLORS.oceanBlue }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="forecast" 
                        stroke={BRAND_COLORS.sustainabilityGreen} 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Forecast"
                        dot={{ fill: BRAND_COLORS.sustainabilityGreen }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="upperBound" 
                        stroke={BRAND_COLORS.sustainabilityGreen} 
                        strokeOpacity={0.3}
                        name="Upper Bound"
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lowerBound" 
                        stroke={BRAND_COLORS.sustainabilityGreen} 
                        strokeOpacity={0.3}
                        name="Lower Bound"
                        dot={false}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average Forecast (6 months)</p>
                  <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {formatNumber(demandForecastResult.avgForecast)}
                  </p>
                  <p className="text-xs text-muted-foreground">units/month</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Forecast (6 months)</p>
                  <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.sustainabilityGreen }}>
                    {formatNumber(demandForecastResult.totalForecast)}
                  </p>
                  <p className="text-xs text-muted-foreground">units</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Growth Trend</p>
                  <p className="text-3xl font-bold" style={{ color: demandForecastResult.growthTrend >= 0 ? BRAND_COLORS.sustainabilityGreen : BRAND_COLORS.danger }}>
                    {demandForecastResult.growthTrend >= 0 ? "+" : ""}{demandForecastResult.growthTrend}%
                  </p>
                  <p className="text-xs text-muted-foreground">annual growth</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== INVENTORY TURNOVER TAB ==================== */}
        <TabsContent value="turnover" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Turnover Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cogs">Cost of Goods Sold (COGS)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cogs"
                      type="number"
                      value={cogs}
                      onChange={(e) => setCogs(e.target.value)}
                      className="pl-10"
                      placeholder="1,200,000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="avgInventory">Average Inventory Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="avgInventory"
                      type="number"
                      value={avgInventory}
                      onChange={(e) => setAvgInventory(e.target.value)}
                      className="pl-10"
                      placeholder="200,000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salesRevenue">Sales Revenue</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="salesRevenue"
                      type="number"
                      value={salesRevenue}
                      onChange={(e) => setSalesRevenue(e.target.value)}
                      className="pl-10"
                      placeholder="2,000,000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2" style={{ borderColor: BRAND_COLORS.oceanBlue }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Turnover Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${BRAND_COLORS.oceanBlue}20` }}>
                    <p className="text-sm text-muted-foreground">Turnover Ratio</p>
                    <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                      {turnoverResult.turnoverRatio}x
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">times per year</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${BRAND_COLORS.sustainabilityGreen}20` }}>
                    <p className="text-sm text-muted-foreground">Days Inventory Outstanding</p>
                    <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.sustainabilityGreen }}>
                      {turnoverResult.daysInventoryOutstanding}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">days</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Gross Margin</p>
                    <p className="text-xl font-bold">{turnoverResult.grossMargin}%</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">GMROI</p>
                    <p className="text-xl font-bold">{turnoverResult.gmroi}x</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ 
                  backgroundColor: turnoverResult.performance === "excellent" ? `${BRAND_COLORS.sustainabilityGreen}20` :
                    turnoverResult.performance === "good" ? `${BRAND_COLORS.oceanBlue}20` :
                    turnoverResult.performance === "needs-improvement" ? `${BRAND_COLORS.warning}20` : `${BRAND_COLORS.danger}20`
                }}>
                  <div className="flex items-center gap-2">
                    {turnoverResult.performance === "excellent" || turnoverResult.performance === "good" ? (
                      <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.sustainabilityGreen }} />
                    ) : (
                      <TrendingDown className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                    )}
                    <div>
                      <p className="font-medium capitalize">{turnoverResult.performance.replace("-", " ")}</p>
                      <p className="text-sm text-muted-foreground">
                        {turnoverResult.performance === "excellent" ? "Outstanding inventory efficiency!" :
                          turnoverResult.performance === "good" ? "Good turnover rate, keep optimizing" :
                          turnoverResult.performance === "needs-improvement" ? "Consider reducing inventory levels" :
                          "Urgent: Review inventory management strategy"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ==================== CARRYING COST TAB ==================== */}
        <TabsContent value="carrying-cost" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Carrying Cost Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ccAvgInventoryValue">Average Inventory Value</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="ccAvgInventoryValue"
                      type="number"
                      value={ccAvgInventoryValue}
                      onChange={(e) => setCcAvgInventoryValue(e.target.value)}
                      className="pl-10"
                      placeholder="500,000"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ccStorageRate">Storage Cost (%)</Label>
                    <Input
                      id="ccStorageRate"
                      type="number"
                      value={ccStorageRate}
                      onChange={(e) => setCcStorageRate(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ccInsuranceRate">Insurance (%)</Label>
                    <Input
                      id="ccInsuranceRate"
                      type="number"
                      value={ccInsuranceRate}
                      onChange={(e) => setCcInsuranceRate(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ccObsolescenceRate">Obsolescence (%)</Label>
                    <Input
                      id="ccObsolescenceRate"
                      type="number"
                      value={ccObsolescenceRate}
                      onChange={(e) => setCcObsolescenceRate(e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ccCapitalRate">Cost of Capital (%)</Label>
                    <Input
                      id="ccCapitalRate"
                      type="number"
                      value={ccCapitalRate}
                      onChange={(e) => setCcCapitalRate(e.target.value)}
                      placeholder="8"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ccHandlingRate">Handling (%)</Label>
                    <Input
                      id="ccHandlingRate"
                      type="number"
                      value={ccHandlingRate}
                      onChange={(e) => setCcHandlingRate(e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="w-full p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Total Rate</p>
                      <p className="text-xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                        {carryingCostResult.totalRate}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-2" style={{ borderColor: BRAND_COLORS.sustainabilityGreen }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.sustainabilityGreen }} />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={carryingCostResult.breakdown} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                          {carryingCostResult.breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Annual Carrying Cost</p>
                    <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.danger }}>
                      {formatCurrency(carryingCostResult.totalCost)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {carryingCostResult.totalRate}% of inventory value
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cost Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Cost Component</th>
                      <th className="text-right py-2 px-3">Rate (%)</th>
                      <th className="text-right py-2 px-3">Annual Cost</th>
                      <th className="text-right py-2 px-3">% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carryingCostResult.breakdown.map((item) => (
                      <tr key={item.name} className="border-b">
                        <td className="py-2 px-3 font-medium">{item.name}</td>
                        <td className="text-right py-2 px-3">{item.rate}%</td>
                        <td className="text-right py-2 px-3">{formatCurrency(item.cost)}</td>
                        <td className="text-right py-2 px-3">
                          {((item.cost / carryingCostResult.totalCost) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold">
                      <td className="py-2 px-3">Total</td>
                      <td className="text-right py-2 px-3">{carryingCostResult.totalRate}%</td>
                      <td className="text-right py-2 px-3">{formatCurrency(carryingCostResult.totalCost)}</td>
                      <td className="text-right py-2 px-3">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset All
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" style={{ backgroundColor: BRAND_COLORS.oceanBlue }} className="text-white hover:opacity-90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
