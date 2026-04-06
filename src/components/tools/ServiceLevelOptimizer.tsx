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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Target,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  BarChart3,
  Info,
  Calculator,
  Clock,
  DollarSign,
  Shield,
  RefreshCw,
  Download,
  Share2,
  Zap,
  LineChart,
  PieChart,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Activity,
  Gauge,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand Colors
const BRAND_COLORS = {
  oceanBlue: "#0F4C81",
  logisticsGreen: "#2E8B57",
  oceanBlueLight: "#1A6BA8",
  logisticsGreenLight: "#3DAA6A",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  oceanBlueAlpha10: "rgba(15, 76, 129, 0.1)",
  logisticsGreenAlpha10: "rgba(46, 139, 87, 0.1)",
};

interface ServiceLevelResult {
  optimalServiceLevel: number;
  currentServiceLevel: number;
  safetyStock: number;
  reorderPoint: number;
  expectedStockouts: number;
  fillRate: number;
  holdingCost: number;
  stockoutCost: number;
  totalRelevantCost: number;
  zScore: number;
  demandDuringLeadTime: number;
  coefficientOfVariation: number;
}

// Z-score lookup table for service levels
const serviceLevelData: { level: number; zScore: number }[] = [
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

// Get Z-score for a given service level
function getZScore(serviceLevel: number): number {
  if (serviceLevel <= 50) return 0;
  if (serviceLevel >= 99.9) return 3.09;

  // Find the two closest points and interpolate
  for (let i = 0; i < serviceLevelData.length - 1; i++) {
    if (serviceLevelData[i].level <= serviceLevel && serviceLevelData[i + 1].level >= serviceLevel) {
      const range = serviceLevelData[i + 1].level - serviceLevelData[i].level;
      const zRange = serviceLevelData[i + 1].zScore - serviceLevelData[i].zScore;
      const fraction = (serviceLevel - serviceLevelData[i].level) / range;
      return serviceLevelData[i].zScore + (zRange * fraction);
    }
  }
  return 2.33;
}

// Loss function for fill rate calculation (unit normal loss)
function unitNormalLoss(z: number): number {
  // Approximation of the unit normal loss function
  const phi = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  return phi - z * (1 - normalCDF(z));
}

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

// FAQ Data
const faqData = [
  {
    question: "What is the difference between Service Level and Fill Rate?",
    answer: "Service Level (Cycle Service Level) measures the probability of not having a stockout during a replenishment cycle - it's about the frequency of stockout events. Fill Rate measures the percentage of demand that can be fulfilled immediately from stock - it's about the volume of stockouts. A 95% service level typically results in a higher fill rate (often 98-99%) because when stockouts occur, they usually affect only a portion of the demand during that cycle."
  },
  {
    question: "How is the optimal service level calculated?",
    answer: "The optimal service level is calculated using the critical fractile formula: SL* = b / (b + h × C), where b is the stockout cost per unit, h is the holding cost rate (as a decimal), and C is the unit cost. This formula minimizes total cost by finding the point where the marginal cost of holding additional inventory equals the marginal benefit of avoiding stockouts."
  },
  {
    question: "Why does safety stock increase exponentially at higher service levels?",
    answer: "Safety stock is calculated as SS = Z × σ_DLT, where Z is the Z-score from the normal distribution. As you approach 100% service level, the Z-score increases dramatically due to the properties of the normal distribution. For example, going from 95% to 99% service level increases the Z-score from 1.65 to 2.33 - a 41% increase in safety stock. Going from 99% to 99.9% adds another 33% more safety stock."
  },
  {
    question: "What factors should I consider when setting service level targets?",
    answer: "Key factors include: (1) ABC classification - higher service levels for A items that drive most revenue; (2) Stockout costs - both direct costs (lost sales, expediting) and indirect costs (customer goodwill, reputation); (3) Lead time variability - less reliable suppliers need higher buffers; (4) Demand patterns - seasonal items may need dynamic service levels; (5) Competitive landscape - service as a differentiator; (6) Holding costs and capital constraints."
  },
  {
    question: "How does lead time variability affect safety stock?",
    answer: "Lead time variability significantly increases safety stock requirements. The formula σ_DLT = √(LT × σ_D² + D² × σ_LT²) shows that both demand variability and lead time variability contribute to total uncertainty. If lead time is highly variable (σ_LT is large), safety stock increases substantially. Reducing lead time variability through supplier partnerships can significantly reduce inventory costs."
  },
  {
    question: "Should I use continuous or periodic review for inventory management?",
    answer: "Continuous review (Q-system) triggers orders when inventory hits a reorder point - better for high-value items with stable demand. Periodic review (P-system) checks inventory at fixed intervals - simpler to manage but requires more safety stock to cover the review period. Choose continuous review when: ordering costs are low, demand is variable, or stockouts are costly. Choose periodic review when: ordering multiple items together, physical counts are required, or ordering costs are high."
  },
  {
    question: "How often should I review and adjust my service level targets?",
    answer: "Service level targets should be reviewed at least quarterly, or whenever significant changes occur: (1) Cost structure changes (holding costs, stockout costs); (2) Demand pattern shifts; (3) Supplier performance changes; (4) Competitive pressure; (5) Strategic initiatives (e.g., moving to lean inventory). Monitor actual fill rates vs. targets continuously and investigate systematic deviations."
  },
  {
    question: "What is the relationship between service level and working capital?",
    answer: "Higher service levels require more safety stock, which ties up working capital. The relationship is non-linear - moving from 95% to 99% might increase safety stock by 40%, while the last 0.9% to 99.9% could add another 30%. Companies must balance the working capital cost against the strategic value of high service levels. Sometimes accepting slightly lower service levels can free significant capital for other investments."
  },
];

export function ServiceLevelOptimizer() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");

  // Input parameters
  const [targetServiceLevel, setTargetServiceLevel] = useState<number>(95);
  const [demandMean, setDemandMean] = useState<string>("100");
  const [demandStdDev, setDemandStdDev] = useState<string>("25");
  const [leadTimeMean, setLeadTimeMean] = useState<string>("7");
  const [leadTimeStdDev, setLeadTimeStdDev] = useState<string>("2");
  const [unitCost, setUnitCost] = useState<string>("50");
  const [holdingCostRate, setHoldingCostRate] = useState<number>(25);
  const [stockoutCostPerUnit, setStockoutCostPerUnit] = useState<string>("20");
  const [reviewPeriodType, setReviewPeriodType] = useState<"continuous" | "periodic">("continuous");
  const [reviewPeriodDays, setReviewPeriodDays] = useState<number>(30);

  // Calculate results
  const result = useMemo<ServiceLevelResult>(() => {
    const d = parseFloat(demandMean) || 0;
    const sigmaD = parseFloat(demandStdDev) || 0;
    const LT = parseFloat(leadTimeMean) || 0;
    const sigmaLT = parseFloat(leadTimeStdDev) || 0;
    const C = parseFloat(unitCost) || 0;
    const h = holdingCostRate / 100;
    const b = parseFloat(stockoutCostPerUnit) || 0;
    const sl = targetServiceLevel;

    // Calculate standard deviation of demand during lead time
    const sigmaDLT = Math.sqrt(LT * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2));

    // Demand during lead time
    const demandDuringLT = d * LT;

    // Z-score for current service level
    const z = getZScore(sl);

    // Safety stock calculation
    let safetyStock: number;
    if (reviewPeriodType === "continuous") {
      safetyStock = z * sigmaDLT;
    } else {
      // For periodic review, add review period to lead time
      const TplusL = reviewPeriodDays + LT;
      const sigmaTplusL = Math.sqrt(TplusL * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2));
      safetyStock = z * sigmaTplusL;
    }

    // Reorder point (for continuous review)
    const reorderPoint = demandDuringLT + safetyStock;

    // Expected stockouts per year
    const annualDemand = d * 365;
    const ordersPerYear = annualDemand / demandDuringLT;
    const L_z = unitNormalLoss(z);
    const expectedStockoutsPerCycle = sigmaDLT * L_z;
    const expectedStockouts = expectedStockoutsPerCycle * ordersPerYear;

    // Fill rate calculation
    const fillRate = 1 - (expectedStockoutsPerCycle / demandDuringLT);

    // Calculate optimal service level using critical fractile
    // CSL* = b / (b + h * C)
    const annualHoldingCostPerUnit = C * h;
    const optimalServiceLevel = Math.min(99.9, Math.max(50, (b / (b + annualHoldingCostPerUnit)) * 100));

    // Costs
    const holdingCost = safetyStock * C * h;
    const stockoutCost = expectedStockouts * b;
    const totalRelevantCost = holdingCost + stockoutCost;

    // Coefficient of variation
    const cv = d > 0 ? (sigmaD / d) : 0;

    return {
      optimalServiceLevel: parseFloat(optimalServiceLevel.toFixed(1)),
      currentServiceLevel: sl,
      safetyStock: Math.round(safetyStock),
      reorderPoint: Math.round(reorderPoint),
      expectedStockouts: Math.round(expectedStockouts * 10) / 10,
      fillRate: Math.min(99.99, Math.max(0, fillRate * 100)),
      holdingCost,
      stockoutCost,
      totalRelevantCost,
      zScore: parseFloat(z.toFixed(2)),
      demandDuringLeadTime: Math.round(demandDuringLT),
      coefficientOfVariation: parseFloat((cv * 100).toFixed(1)),
    };
  }, [demandMean, demandStdDev, leadTimeMean, leadTimeStdDev, unitCost, holdingCostRate, stockoutCostPerUnit, targetServiceLevel, reviewPeriodType, reviewPeriodDays]);

  // Service level vs cost curve data
  const serviceLevelCostData = useMemo(() => {
    const d = parseFloat(demandMean) || 0;
    const sigmaD = parseFloat(demandStdDev) || 0;
    const LT = parseFloat(leadTimeMean) || 0;
    const sigmaLT = parseFloat(leadTimeStdDev) || 0;
    const C = parseFloat(unitCost) || 0;
    const h = holdingCostRate / 100;
    const b = parseFloat(stockoutCostPerUnit) || 0;

    const sigmaDLT = Math.sqrt(LT * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2));
    const demandDuringLT = d * LT;
    const annualDemand = d * 365;
    const ordersPerYear = annualDemand / demandDuringLT;

    const data = [];
    for (let sl = 50; sl <= 99.5; sl += 2.5) {
      const z = getZScore(sl);
      const ss = z * sigmaDLT;
      const L_z = unitNormalLoss(z);
      const expectedStockoutsPerCycle = sigmaDLT * L_z;
      const expStockouts = expectedStockoutsPerCycle * ordersPerYear;

      const holdingCost = ss * C * h;
      const stockoutCost = expStockouts * b;
      const totalCost = holdingCost + stockoutCost;

      data.push({
        serviceLevel: sl,
        holdingCost: Math.round(holdingCost),
        stockoutCost: Math.round(stockoutCost),
        totalCost: Math.round(totalCost),
        safetyStock: Math.round(ss),
      });
    }
    return data;
  }, [demandMean, demandStdDev, leadTimeMean, leadTimeStdDev, unitCost, holdingCostRate, stockoutCostPerUnit]);

  // Demand distribution data during lead time
  const demandDistributionData = useMemo(() => {
    const d = parseFloat(demandMean) || 0;
    const sigmaD = parseFloat(demandStdDev) || 0;
    const LT = parseFloat(leadTimeMean) || 0;
    const sigmaLT = parseFloat(leadTimeStdDev) || 0;

    const meanDLT = d * LT;
    const sigmaDLT = Math.sqrt(LT * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2));

    // Generate normal distribution points
    const data = [];
    const minVal = Math.max(0, meanDLT - 4 * sigmaDLT);
    const maxVal = meanDLT + 4 * sigmaDLT;
    const step = (maxVal - minVal) / 50;

    for (let x = minVal; x <= maxVal; x += step) {
      const z = (x - meanDLT) / sigmaDLT;
      const pdf = (1 / (sigmaDLT * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
      data.push({
        demand: Math.round(x),
        probability: pdf,
        isAboveROP: x >= result.reorderPoint,
      });
    }
    return data;
  }, [demandMean, demandStdDev, leadTimeMean, leadTimeStdDev, result.reorderPoint]);

  // Sensitivity analysis data
  const sensitivityData = useMemo(() => {
    const baseHoldingCost = result.totalRelevantCost;
    const variations = [-30, -20, -10, 0, 10, 20, 30];

    return variations.map(variation => {
      const adjustedStockoutCost = parseFloat(stockoutCostPerUnit) * (1 + variation / 100);
      const newOptimalSL = Math.min(99.9, Math.max(50, (adjustedStockoutCost / (adjustedStockoutCost + parseFloat(unitCost) * holdingCostRate / 100)) * 100));

      return {
        variation: `${variation > 0 ? '+' : ''}${variation}%`,
        stockoutCost: adjustedStockoutCost,
        optimalServiceLevel: parseFloat(newOptimalSL.toFixed(1)),
        costImpact: baseHoldingCost * (1 + variation * 0.01),
      };
    });
  }, [stockoutCostPerUnit, unitCost, holdingCostRate, result.totalRelevantCost]);

  // What-if scenarios
  const whatIfScenarios = useMemo(() => {
    const d = parseFloat(demandMean) || 0;
    const sigmaD = parseFloat(demandStdDev) || 0;
    const LT = parseFloat(leadTimeMean) || 0;
    const sigmaLT = parseFloat(leadTimeStdDev) || 0;
    const C = parseFloat(unitCost) || 0;
    const h = holdingCostRate / 100;
    const b = parseFloat(stockoutCostPerUnit) || 0;

    const sigmaDLT = Math.sqrt(LT * Math.pow(sigmaD, 2) + Math.pow(d, 2) * Math.pow(sigmaLT, 2));
    const demandDuringLT = d * LT;

    const scenarios = [
      { name: "Conservative (99%)", sl: 99 },
      { name: "Current Target", sl: targetServiceLevel },
      { name: "Optimal Level", sl: result.optimalServiceLevel },
      { name: "Cost-Effective (90%)", sl: 90 },
    ];

    return scenarios.map(scenario => {
      const z = getZScore(scenario.sl);
      const ss = z * sigmaDLT;
      const L_z = unitNormalLoss(z);
      const annualDemand = d * 365;
      const ordersPerYear = annualDemand / demandDuringLT;
      const expectedStockoutsPerCycle = sigmaDLT * L_z;
      const expStockouts = expectedStockoutsPerCycle * ordersPerYear;
      const holdingCost = ss * C * h;
      const stockoutCost = expStockouts * b;

      return {
        ...scenario,
        safetyStock: Math.round(ss),
        holdingCost: Math.round(holdingCost),
        stockoutCost: Math.round(stockoutCost),
        totalCost: Math.round(holdingCost + stockoutCost),
        expectedStockouts: Math.round(expStockouts * 10) / 10,
      };
    });
  }, [demandMean, demandStdDev, leadTimeMean, leadTimeStdDev, unitCost, holdingCostRate, stockoutCostPerUnit, targetServiceLevel, result.optimalServiceLevel]);

  // Cost breakdown pie chart data
  const costBreakdownData = useMemo(() => {
    return [
      { name: "Holding Cost", value: result.holdingCost, color: BRAND_COLORS.logisticsGreen },
      { name: "Stockout Cost", value: result.stockoutCost, color: BRAND_COLORS.warning },
    ];
  }, [result.holdingCost, result.stockoutCost]);

  // Radial gauge data for service level
  const radialGaugeData = useMemo(() => {
    return [
      {
        name: "Current",
        value: result.currentServiceLevel,
        fill: BRAND_COLORS.oceanBlue,
      },
      {
        name: "Optimal",
        value: result.optimalServiceLevel,
        fill: BRAND_COLORS.logisticsGreen,
      },
    ];
  }, [result.currentServiceLevel, result.optimalServiceLevel]);

  const getStatusBadge = (current: number, optimal: number) => {
    const diff = Math.abs(current - optimal);
    if (diff <= 2) return { variant: "default" as const, label: "Optimal", color: "bg-[#2E8B57]" };
    if (diff <= 5) return { variant: "secondary" as const, label: "Near Optimal", color: "bg-[#0F4C81]" };
    if (current < optimal) return { variant: "destructive" as const, label: "Below Optimal", color: "bg-amber-500" };
    return { variant: "outline" as const, label: "Above Optimal", color: "bg-purple-500" };
  };

  const statusBadge = getStatusBadge(result.currentServiceLevel, result.optimalServiceLevel);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl mb-6">
        {/* Background gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${BRAND_COLORS.oceanBlue} 0%, ${BRAND_COLORS.oceanBlueLight} 50%, ${BRAND_COLORS.logisticsGreen} 100%)`
          }}
        />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        <div className="relative px-6 py-12 md:px-10 md:py-16">
          <motion.div 
            className="max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Warehousing Intelligence</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Service Level Optimizer
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Calculate optimal service levels, safety stock, and reorder points to minimize total inventory costs while meeting customer demand requirements.
            </motion.p>

            {/* Quick Stats */}
            <motion.div 
              className="flex flex-wrap gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <Target className="h-5 w-5 text-white" />
                <div>
                  <p className="text-xs text-white/70">Optimal Level</p>
                  <p className="text-lg font-bold text-white">{result.optimalServiceLevel}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <Shield className="h-5 w-5 text-white" />
                <div>
                  <p className="text-xs text-white/70">Safety Stock</p>
                  <p className="text-lg font-bold text-white">{result.safetyStock} units</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <DollarSign className="h-5 w-5 text-white" />
                <div>
                  <p className="text-xs text-white/70">Annual Cost</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(result.totalRelevantCost, currency)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <Activity className="h-5 w-5 text-white" />
                <div>
                  <p className="text-xs text-white/70">Fill Rate</p>
                  <p className="text-lg font-bold text-white">{result.fillRate.toFixed(1)}%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative icons */}
          <motion.div 
            className="absolute top-8 right-8 md:top-12 md:right-12 opacity-20"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Gauge className="w-24 h-24 md:w-32 md:h-32 text-white" />
          </motion.div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="calculator" className="text-sm">Calculator</TabsTrigger>
          <TabsTrigger value="tradeoff" className="text-sm">Cost Trade-off</TabsTrigger>
          <TabsTrigger value="analysis" className="text-sm">Analysis</TabsTrigger>
          <TabsTrigger value="scenarios" className="text-sm">What-If</TabsTrigger>
          <TabsTrigger value="faq" className="text-sm">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="border-l-4 border-l-[#0F4C81]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Service Level Parameters
                </CardTitle>
                <CardDescription>Configure your inventory service level settings</CardDescription>
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

                {/* Target Service Level Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Target Service Level</Label>
                    <Badge style={{ backgroundColor: BRAND_COLORS.oceanBlue }}>{targetServiceLevel}%</Badge>
                  </div>
                  <Slider
                    value={[targetServiceLevel]}
                    onValueChange={(v) => setTargetServiceLevel(v[0])}
                    min={50}
                    max={99.9}
                    step={0.5}
                    className="[&_[role=slider]]:bg-[#0F4C81]"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>50%</span>
                    <span style={{ color: BRAND_COLORS.logisticsGreen }}>Optimal: {result.optimalServiceLevel}%</span>
                    <span>99.9%</span>
                  </div>
                </div>

                <Separator />

                {/* Demand Parameters */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                    Demand Parameters
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="demandMean" className="text-xs">Daily Demand (Mean)</Label>
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
                    CV: {result.coefficientOfVariation}% variability
                  </p>
                </div>

                {/* Lead Time Parameters */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    Lead Time Parameters
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

                {/* Cost Parameters */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" style={{ color: BRAND_COLORS.oceanBlue }} />
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
                          placeholder="20"
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
                        className="[&_[role=slider]]:bg-[#2E8B57]"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5%</span>
                        <span className="font-medium" style={{ color: BRAND_COLORS.oceanBlue }}>{holdingCostRate}%</span>
                        <span>50%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Review Period */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Review Period Type</Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="review-mode" className="text-xs">Periodic Review</Label>
                      <p className="text-xs text-muted-foreground">
                        {reviewPeriodType === "continuous" ? "Continuous (Q-system)" : `Periodic (P-system, ${reviewPeriodDays} days)`}
                      </p>
                    </div>
                    <Switch
                      id="review-mode"
                      checked={reviewPeriodType === "periodic"}
                      onCheckedChange={(checked) => setReviewPeriodType(checked ? "periodic" : "continuous")}
                    />
                  </div>
                  {reviewPeriodType === "periodic" && (
                    <div>
                      <Label htmlFor="reviewPeriod" className="text-xs">Review Period (days)</Label>
                      <Input
                        id="reviewPeriod"
                        type="number"
                        value={reviewPeriodDays}
                        onChange={(e) => setReviewPeriodDays(parseInt(e.target.value) || 30)}
                        placeholder="30"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card className="border-l-4 border-l-[#2E8B57]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Shield className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                      Optimization Results
                    </span>
                    <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Current vs Optimal */}
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground">Current Service Level</p>
                      <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>{result.currentServiceLevel}%</p>
                      <p className="text-xs text-muted-foreground">Z = {result.zScore}</p>
                    </div>
                    <div className="p-4 rounded-lg text-center" style={{ backgroundColor: BRAND_COLORS.logisticsGreenAlpha10 }}>
                      <p className="text-sm text-muted-foreground">Optimal Service Level</p>
                      <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>{result.optimalServiceLevel}%</p>
                      <p className="text-xs text-muted-foreground">Minimizes total cost</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>{result.safetyStock}</p>
                      <p className="text-xs text-muted-foreground">Safety Stock</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>{result.reorderPoint}</p>
                      <p className="text-xs text-muted-foreground">Reorder Point</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-500">{result.fillRate.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">Fill Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4" style={{ color: BRAND_COLORS.oceanBlue }} />
                    Annual Cost Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Holding Cost (Safety Stock)</span>
                      <span className="font-medium">{formatCurrency(result.holdingCost, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Expected Stockout Cost</span>
                      <span className="font-medium">{formatCurrency(result.stockoutCost, currency)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Relevant Cost</span>
                      <span className="font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>{formatCurrency(result.totalRelevantCost, currency)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Expected Stockouts/Year</span>
                      <span className="text-amber-500">{result.expectedStockouts} units</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Level Meter */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Service Level Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full">
                    <div
                      className="absolute top-6 w-3 h-6 rounded transform -translate-x-1/2"
                      style={{ left: `${result.currentServiceLevel}%`, backgroundColor: BRAND_COLORS.oceanBlue }}
                    />
                    <div
                      className="absolute top-6 w-3 h-6 rounded transform -translate-x-1/2 border-2 border-white"
                      style={{ left: `${result.optimalServiceLevel}%`, backgroundColor: BRAND_COLORS.logisticsGreen }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-8">
                    <span>50%</span>
                    <span>75%</span>
                    <span>90%</span>
                    <span>95%</span>
                    <span>99%</span>
                  </div>
                  <div className="flex justify-center gap-6 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: BRAND_COLORS.oceanBlue }} />
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded border-2 border-white" style={{ backgroundColor: BRAND_COLORS.logisticsGreen }} />
                      <span>Optimal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tradeoff" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-t-4 border-t-[#0F4C81]">
              <CardHeader>
                <CardTitle>Service Level vs Total Cost</CardTitle>
                <CardDescription>Trade-off between service level and total relevant cost</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={serviceLevelCostData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="serviceLevel"
                        label={{ value: 'Service Level (%)', position: 'bottom', offset: -5 }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                        labelFormatter={(label) => `Service Level: ${label}%`}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="totalCost" fill={BRAND_COLORS.oceanBlue} fillOpacity={0.2} stroke={BRAND_COLORS.oceanBlue} name="Total Cost" />
                      <Line type="monotone" dataKey="holdingCost" stroke={BRAND_COLORS.logisticsGreen} strokeWidth={2} name="Holding Cost" dot={false} />
                      <Line type="monotone" dataKey="stockoutCost" stroke={BRAND_COLORS.warning} strokeWidth={2} name="Stockout Cost" dot={false} />
                      <ReferenceLine x={result.optimalServiceLevel} stroke={BRAND_COLORS.logisticsGreen} strokeDasharray="5 5" label={{ value: 'Optimal', fill: BRAND_COLORS.logisticsGreen }} />
                      <ReferenceLine x={result.currentServiceLevel} stroke={BRAND_COLORS.oceanBlue} strokeDasharray="3 3" label={{ value: 'Current', fill: BRAND_COLORS.oceanBlue }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#2E8B57]">
              <CardHeader>
                <CardTitle>Safety Stock Requirements</CardTitle>
                <CardDescription>Safety stock needed at different service levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceLevelCostData.filter((_, i) => i % 2 === 0)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="serviceLevel"
                        tickFormatter={(v) => `${v}%`}
                      />
                      <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft' }} />
                      <Tooltip
                        formatter={(value: number) => `${value} units`}
                        labelFormatter={(label) => `Service Level: ${label}%`}
                      />
                      <Bar dataKey="safetyStock" fill={BRAND_COLORS.oceanBlue} name="Safety Stock" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demand Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Demand Distribution During Lead Time</CardTitle>
              <CardDescription>Probability distribution showing demand variability and reorder point position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demandDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="demand" label={{ value: 'Demand During Lead Time', position: 'bottom', offset: -5 }} />
                    <YAxis label={{ value: 'Probability', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: number) => value.toFixed(6)} />
                    <ReferenceLine x={result.reorderPoint} stroke={BRAND_COLORS.danger} strokeDasharray="5 5" label={{ value: 'ROP', fill: BRAND_COLORS.danger }} />
                    <ReferenceLine x={result.demandDuringLeadTime} stroke={BRAND_COLORS.logisticsGreen} label={{ value: 'Mean', fill: BRAND_COLORS.logisticsGreen }} />
                    <Area type="monotone" dataKey="probability" stroke={BRAND_COLORS.oceanBlue} fill={BRAND_COLORS.oceanBlue} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                <div className="p-2 bg-muted/50 rounded">
                  <p className="font-medium">Mean Demand (LT)</p>
                  <p style={{ color: BRAND_COLORS.logisticsGreen }}>{result.demandDuringLeadTime} units</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="font-medium">Reorder Point</p>
                  <p style={{ color: BRAND_COLORS.oceanBlue }}>{result.reorderPoint} units</p>
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <p className="font-medium">Safety Stock</p>
                  <p className="text-amber-500">{result.safetyStock} units</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Pie Chart */}
            <Card className="border-t-4 border-t-[#0F4C81]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg text-center" style={{ backgroundColor: BRAND_COLORS.logisticsGreenAlpha10 }}>
                    <p className="text-lg font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>{formatCurrency(result.holdingCost, currency)}</p>
                    <p className="text-xs text-muted-foreground">Holding Cost/Year</p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-lg text-center">
                    <p className="text-lg font-bold text-amber-500">{formatCurrency(result.stockoutCost, currency)}</p>
                    <p className="text-xs text-muted-foreground">Stockout Cost/Year</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sensitivity Analysis */}
            <Card className="border-t-4 border-t-[#2E8B57]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Stockout Cost Sensitivity
                </CardTitle>
                <CardDescription>Impact of stockout cost changes on optimal service level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={sensitivityData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="variation" label={{ value: 'Stockout Cost Change', position: 'bottom', offset: -5 }} />
                      <YAxis domain={[50, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === 'optimalServiceLevel' ? `${value.toFixed(1)}%` : formatCurrency(value, currency),
                          name === 'optimalServiceLevel' ? 'Optimal SL' : 'Cost'
                        ]}
                      />
                      <Line type="monotone" dataKey="optimalServiceLevel" stroke={BRAND_COLORS.oceanBlue} strokeWidth={3} dot={{ fill: BRAND_COLORS.oceanBlue }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm">
                    <Info className="h-4 w-4 inline mr-1" style={{ color: BRAND_COLORS.oceanBlue }} />
                    Higher stockout costs justify higher service levels to minimize total cost
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Service Level Radial Gauge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Service Level Gauge
              </CardTitle>
              <CardDescription>Visual comparison of current vs optimal service levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="30%" 
                    outerRadius="80%" 
                    data={radialGaugeData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                    />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: BRAND_COLORS.oceanBlue }} />
                  <span className="text-sm">Current: {result.currentServiceLevel}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: BRAND_COLORS.logisticsGreen }} />
                  <span className="text-sm">Optimal: {result.optimalServiceLevel}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Break-even Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Break-Even Analysis</CardTitle>
              <CardDescription>ROI of changing service level from current to optimal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Current Total Cost</p>
                  <p className="text-2xl font-bold">{formatCurrency(result.totalRelevantCost, currency)}</p>
                  <p className="text-xs text-muted-foreground">@ {result.currentServiceLevel}% SL</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: BRAND_COLORS.logisticsGreenAlpha10 }}>
                  <p className="text-sm text-muted-foreground">Optimal Total Cost</p>
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>{formatCurrency(
                    (() => {
                      const optimalScenario = whatIfScenarios.find(s => s.sl === result.optimalServiceLevel);
                      return optimalScenario?.totalCost || result.totalRelevantCost;
                    })(),
                    currency
                  )}</p>
                  <p className="text-xs text-muted-foreground">@ {result.optimalServiceLevel}% SL</p>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Cost Difference</p>
                  <p className="text-2xl font-bold text-amber-500">{formatCurrency(
                    result.totalRelevantCost - (whatIfScenarios.find(s => s.sl === result.optimalServiceLevel)?.totalCost || result.totalRelevantCost),
                    currency
                  )}</p>
                  <p className="text-xs text-muted-foreground">per year</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: BRAND_COLORS.oceanBlueAlpha10 }}>
                  <p className="text-sm text-muted-foreground">Service Level Change</p>
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {result.currentServiceLevel > result.optimalServiceLevel ? '-' : '+'}
                    {Math.abs(result.currentServiceLevel - result.optimalServiceLevel).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">adjustment needed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6 mt-6">
          <Card className="border-t-4 border-t-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                What-If Scenarios
              </CardTitle>
              <CardDescription>Compare different service level strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Scenario</th>
                      <th className="text-center py-3 px-4">Service Level</th>
                      <th className="text-right py-3 px-4">Safety Stock</th>
                      <th className="text-right py-3 px-4">Holding Cost</th>
                      <th className="text-right py-3 px-4">Stockout Cost</th>
                      <th className="text-right py-3 px-4">Total Cost</th>
                      <th className="text-right py-3 px-4">Stockouts/Yr</th>
                    </tr>
                  </thead>
                  <tbody>
                    {whatIfScenarios.map((scenario) => (
                      <tr
                        key={scenario.name}
                        className={`border-b ${
                          scenario.sl === result.optimalServiceLevel
                            ? "bg-[#2E8B57]/10"
                            : scenario.sl === result.currentServiceLevel
                            ? "bg-[#0F4C81]/5"
                            : ""
                        }`}
                      >
                        <td className="py-3 px-4 font-medium">
                          {scenario.name}
                          {scenario.sl === result.optimalServiceLevel && (
                            <Badge className="ml-2" style={{ backgroundColor: BRAND_COLORS.logisticsGreen }}>Optimal</Badge>
                          )}
                          {scenario.sl === result.currentServiceLevel && (
                            <Badge className="ml-2" style={{ backgroundColor: BRAND_COLORS.oceanBlue }}>Current</Badge>
                          )}
                        </td>
                        <td className="text-center py-3 px-4">{scenario.sl}%</td>
                        <td className="text-right py-3 px-4">{scenario.safetyStock} units</td>
                        <td className="text-right py-3 px-4">{formatCurrency(scenario.holdingCost, currency)}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(scenario.stockoutCost, currency)}</td>
                        <td className="text-right py-3 px-4 font-bold">{formatCurrency(scenario.totalCost, currency)}</td>
                        <td className="text-right py-3 px-4">{scenario.expectedStockouts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Cost Comparison Chart</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={whatIfScenarios}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" angle={-20} textAnchor="end" height={60} interval={0} tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Legend />
                      <Bar dataKey="holdingCost" stackId="a" fill={BRAND_COLORS.logisticsGreen} name="Holding Cost" />
                      <Bar dataKey="stockoutCost" stackId="a" fill={BRAND_COLORS.warning} name="Stockout Cost" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>ROI of Service Level Investment</CardTitle>
              <CardDescription>Cost-benefit analysis of improving service level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2" style={{ color: BRAND_COLORS.logisticsGreen }}>Moving to Optimal</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Change: {result.currentServiceLevel}% → {result.optimalServiceLevel}%</li>
                    <li>• Safety stock: {result.safetyStock} → {whatIfScenarios.find(s => Math.abs(s.sl - result.optimalServiceLevel) < 0.5)?.safetyStock || result.safetyStock} units</li>
                    <li>• Additional investment: {formatCurrency(Math.abs(
                      (whatIfScenarios.find(s => Math.abs(s.sl - result.optimalServiceLevel) < 0.5)?.holdingCost || result.holdingCost) - result.holdingCost
                    ), currency)}</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2" style={{ color: BRAND_COLORS.oceanBlue }}>Risk Reduction</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Stockout reduction: {Math.abs(result.expectedStockouts - (whatIfScenarios.find(s => Math.abs(s.sl - result.optimalServiceLevel) < 0.5)?.expectedStockouts || result.expectedStockouts)).toFixed(1)} units/year</li>
                    <li>• Fill rate improvement: {Math.abs(result.fillRate - (99.9 - (whatIfScenarios.find(s => Math.abs(s.sl - result.optimalServiceLevel) < 0.5)?.expectedStockouts || result.expectedStockouts) * 0.01)).toFixed(2)}%</li>
                    <li>• Customer satisfaction: Improved</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg" style={{ backgroundColor: BRAND_COLORS.logisticsGreenAlpha10 }}>
                  <h4 className="font-medium mb-2" style={{ color: BRAND_COLORS.logisticsGreen }}>Net Benefit</h4>
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>
                    {formatCurrency(
                      Math.abs(result.totalRelevantCost - (whatIfScenarios.find(s => Math.abs(s.sl - result.optimalServiceLevel) < 0.5)?.totalCost || result.totalRelevantCost)),
                      currency
                    )}/year
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.currentServiceLevel > result.optimalServiceLevel ? "Cost savings" : "Additional cost for better service"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6 mt-6">
          {/* FAQ Hero */}
          <Card className="border-l-4 border-l-[#0F4C81] bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Learn about service level optimization, safety stock calculations, and inventory management best practices
              </CardDescription>
            </CardHeader>
          </Card>

          {/* FAQ Accordion */}
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ backgroundColor: index % 2 === 0 ? BRAND_COLORS.oceanBlue : BRAND_COLORS.logisticsGreen }}
                        >
                          {index + 1}
                        </div>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-t-4 border-t-[#0F4C81]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Key Formulas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-mono">Optimal SL = b / (b + h × C)</p>
                  <p className="text-xs text-muted-foreground mt-1">Critical fractile formula for cost minimization</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-mono">Safety Stock = Z × σ<sub>DLT</sub></p>
                  <p className="text-xs text-muted-foreground mt-1">Buffer inventory for demand uncertainty</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-mono">σ<sub>DLT</sub> = √(LT × σ<sub>D</sub>² + D² × σ<sub>LT</sub>²)</p>
                  <p className="text-xs text-muted-foreground mt-1">Demand variability during lead time</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-[#2E8B57]">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Set higher service levels for A-class items",
                    "Review targets quarterly or when costs change",
                    "Monitor actual fill rate vs. targets",
                    "Account for lead time variability",
                    "Balance working capital with service needs",
                    "Use continuous review for high-value items"
                  ].map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logisticsGreen }} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Z-Score Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Z-Score Reference Table</CardTitle>
              <CardDescription>Quick reference for service level to Z-score conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {serviceLevelData.filter((_, i) => i % 2 === 0).map((item) => (
                  <div 
                    key={item.level} 
                    className={`p-3 rounded-lg text-center ${
                      item.level === 95 
                        ? "ring-2 ring-[#0F4C81] bg-[#0F4C81]/10" 
                        : item.level === 90 || item.level === 99
                        ? "bg-muted/50"
                        : "bg-muted/30"
                    }`}
                  >
                    <p className="text-lg font-bold" style={{ color: item.level === 95 ? BRAND_COLORS.oceanBlue : BRAND_COLORS.logisticsGreen }}>
                      {item.level}%
                    </p>
                    <p className="text-xs text-muted-foreground">Z = {item.zScore}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" style={{ backgroundColor: BRAND_COLORS.oceanBlue }} className="hover:opacity-90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
