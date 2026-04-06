"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Legend,
  ReferenceLine,
  ComposedChart,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
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
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Target,
  Activity,
  Zap,
  ChevronDown,
  Copy,
  CheckCircle2,
  ArrowLeftRight,
  Database,
  LineChartIcon,
  PieChartIcon,
  Layers,
  RefreshCw,
  DollarSign,
  Percent,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  FileText,
  Users,
  Settings,
  Award,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  ThumbsUp,
  Play,
  ArrowRight,
  BarChart2,
  TrendingUpIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SafetyStockResult {
  safetyStock: number;
  reorderPoint: number;
  averageDemand: number;
  demandDuringLeadTime: number;
  serviceLevel: number;
  zScore: number;
  demandVariability: number;
  leadTimeVariability: number;
  stockoutRisk: number;
  holdingCost: number;
  totalInventoryValue: number;
  daysOfSupply: number;
  fillRate: number;
}

// Extended Z-scores for different service levels
const serviceLevelZScores: Record<string, { label: string; zScore: number; risk: number; description: string }> = {
  "90": { label: "90%", zScore: 1.28, risk: 10, description: "Acceptable for non-critical items with stable demand" },
  "95": { label: "95%", zScore: 1.65, risk: 5, description: "Standard service level for most inventory items" },
  "97.5": { label: "97.5%", zScore: 1.96, risk: 2.5, description: "Higher service for important items" },
  "99": { label: "99%", zScore: 2.33, risk: 1, description: "Critical items or high stockout costs" },
  "99.5": { label: "99.5%", zScore: 2.58, risk: 0.5, description: "Very high service requirement" },
  "99.9": { label: "99.9%", zScore: 3.09, risk: 0.1, description: "Essential items with zero tolerance for stockout" },
};

// Complete Z-score reference table
const zScoreReferenceTable = [
  { serviceLevel: "80%", zScore: 0.84, risk: "20%", stockoutPeriods: "1 in 5" },
  { serviceLevel: "85%", zScore: 1.04, risk: "15%", stockoutPeriods: "3 in 20" },
  { serviceLevel: "90%", zScore: 1.28, risk: "10%", stockoutPeriods: "1 in 10" },
  { serviceLevel: "92%", zScore: 1.41, risk: "8%", stockoutPeriods: "2 in 25" },
  { serviceLevel: "95%", zScore: 1.65, risk: "5%", stockoutPeriods: "1 in 20" },
  { serviceLevel: "97.5%", zScore: 1.96, risk: "2.5%", stockoutPeriods: "1 in 40" },
  { serviceLevel: "98%", zScore: 2.05, risk: "2%", stockoutPeriods: "1 in 50" },
  { serviceLevel: "99%", zScore: 2.33, risk: "1%", stockoutPeriods: "1 in 100" },
  { serviceLevel: "99.5%", zScore: 2.58, risk: "0.5%", stockoutPeriods: "1 in 200" },
  { serviceLevel: "99.9%", zScore: 3.09, risk: "0.1%", stockoutPeriods: "1 in 1000" },
];

// Enhanced FAQ data with comprehensive answers
const faqData = [
  {
    question: "What is the difference between safety stock and buffer stock?",
    answer: "While these terms are often used interchangeably, there is a subtle distinction. Safety stock specifically refers to inventory held to protect against uncertainties in demand and supply (statistical variations). Buffer stock, in a broader sense, can include any extra inventory held for various reasons including production smoothing, bulk purchasing discounts, or anticipated price increases. In inventory management practice, safety stock is calculated using statistical methods based on demand variability and lead time variability, while buffer stock might be determined by other business considerations. For most practical purposes in supply chain management, the terms are treated synonymously when discussing inventory protection strategies.",
    category: "Basics",
  },
  {
    question: "How often should I recalculate my safety stock levels?",
    answer: "Safety stock levels should be reviewed and recalculated on a regular cadence, typically monthly or quarterly depending on your business dynamics. However, you should also recalculate immediately when significant changes occur: new suppliers with different lead times, seasonal demand shifts, changes in product mix, supply chain disruptions, or when actual stockout rates differ significantly from expected. Best practice is to implement a rolling review process where you analyze actual demand variability vs. forecasted variability, and adjust parameters accordingly. Many modern inventory management systems automate this by continuously updating standard deviations based on actual vs. forecast demand.",
    category: "Process",
  },
  {
    question: "What service level should I target for different types of products?",
    answer: "Service level targets should be differentiated based on product criticality and business impact. Class A items (high value, high volume) typically target 97-99% service level due to their revenue impact. Class B items (moderate value) usually target 95-97%. Class C items (low value, high volume) might only need 90-95% service levels. For spare parts and maintenance items, critical components that halt production should have 99%+ service levels, while non-critical parts might target 90-95%. E-commerce retailers often target 95-98% for fast-moving items and 85-90% for long-tail products. Perishable goods require careful balancing as excess safety stock leads to spoilage - typically 90-95% for fresh items.",
    category: "Strategy",
  },
  {
    question: "Why does the simple method give different results than the statistical method?",
    answer: "The simple (max-average) method and statistical method approach the problem from different angles. The simple method uses observed maximums: SS = (Max Daily Demand × Max Lead Time) - (Avg Daily Demand × Avg Lead Time). This is conservative but doesn't account for the probability of both maximums occurring simultaneously. The statistical method SS = Z × √(LT × σ²d + d² × σ²LT) uses standard deviations and the Z-score to model the combined variability more precisely. The statistical method typically yields lower safety stock for the same service level because it accounts for the low probability of worst-case scenarios coinciding. However, the simple method is easier to implement and communicate, making it useful when statistical expertise or historical data is limited.",
    category: "Methodology",
  },
  {
    question: "How does lead time variability affect safety stock requirements?",
    answer: "Lead time variability has a significant and often underestimated impact on safety stock. In the statistical formula, lead time variability appears as σ²LT (variance of lead time), multiplied by the square of average demand. This means that even small increases in lead time uncertainty can substantially increase safety stock requirements. For example, if your average lead time is 7 days with a standard deviation of 2 days versus 1 day, the safety stock increase can be 40-60% or more. This is why supplier reliability programs, vendor-managed inventory (VMI), and closer supplier relationships that reduce lead time uncertainty can significantly reduce inventory carrying costs. International supply chains with ocean freight often face higher lead time variability due to port delays, customs clearance, and transportation disruptions.",
    category: "Variables",
  },
  {
    question: "What are the hidden costs of holding safety stock?",
    answer: "Beyond the obvious holding costs (warehousing, insurance, taxes), safety stock carries several hidden costs. Opportunity cost: capital tied up in safety stock cannot be invested elsewhere - typically 8-15% annually. Obsolescence risk: products may become outdated, expired, or superseded, especially in technology and fashion industries. Shrinkage: theft, damage, and administrative errors increase with inventory volume. Administrative overhead: more inventory requires more cycle counting, reconciliation, and management attention. Quality degradation: some products deteriorate over time. Storage complexity: safety stock may require special handling or storage conditions. These hidden costs often total 25-35% of inventory value annually, making the true cost of safety stock significantly higher than just the holding rate percentage.",
    category: "Costs",
  },
  {
    question: "Can I use safety stock calculation for make-to-order (MTO) products?",
    answer: "Traditional safety stock calculations are designed for make-to-stock (MTS) environments where inventory is held to meet immediate demand. For make-to-order products, the concept still applies but with modifications. Instead of finished goods safety stock, you would calculate safety stock for critical components or raw materials needed for production. The calculation parameters change: demand variability becomes the variability in order quantities or production requirements, and lead time includes both supplier lead time and your manufacturing lead time. Some MTO operations maintain 'safety capacity' instead of safety stock - reserving production capacity for unexpected orders. The service level concept also shifts from 'probability of meeting demand from stock' to 'probability of meeting quoted lead time.' Advanced planning systems often use a hybrid approach with safety stock for common components and assemble-to-order strategies.",
    category: "Applications",
  },
  {
    question: "How do I calculate standard deviation for demand and lead time?",
    answer: "Calculating standard deviation requires historical data. For demand variability, collect daily or weekly demand data over a representative period (typically 3-12 months). Calculate the mean demand, then for each period, find the difference between actual and mean, square it, sum all squared differences, divide by the number of periods minus one, and take the square root. Most spreadsheet software has a STDEV function that automates this. For lead time variability, record actual lead times for multiple orders from each supplier. The same calculation applies, but be sure to use consistent time units (days). A practical tip: if you have seasonal demand, calculate separate standard deviations for different seasons, or deseasonalize your data first. For new products without history, use analogous products as proxies or start with a conservative estimate and adjust based on actual performance.",
    category: "Data",
  },
  {
    question: "What is the relationship between safety stock and reorder point?",
    answer: "The reorder point (ROP) is the inventory level at which you trigger a new replenishment order. It consists of two components: demand during lead time (the average amount you expect to sell while waiting for the order to arrive) plus safety stock (the buffer for uncertainty). The formula is ROP = (Average Daily Demand × Average Lead Time) + Safety Stock. This relationship is fundamental to inventory management: without safety stock, you would reorder when inventory reaches exactly the expected lead time demand, which would result in stockouts 50% of the time due to the normal distribution of demand. Safety stock raises the reorder point to provide the desired service level. When inventory reaches the ROP, you place an order, and during the lead time, you draw down both the expected demand and potentially some safety stock, ideally never running out.",
    category: "Basics",
  },
  {
    question: "How should I handle seasonal demand in safety stock calculations?",
    answer: "Seasonal demand requires special treatment in safety stock calculations. The standard formula assumes relatively stable demand patterns, which breaks down with significant seasonality. Several approaches exist: First, calculate seasonal indices and deseasonalize your demand data before computing standard deviation, then re-seasonalize for planning. Second, maintain separate safety stock calculations for different seasons (high season, low season, transitions). Third, use a rolling forecast that incorporates seasonal patterns into expected demand, and calculate safety stock against the forecast error rather than raw demand variability. Fourth, consider seasonal safety stock builds where you accumulate additional inventory before peak seasons. The most sophisticated approach combines demand forecasting with safety stock optimization, adjusting both the base stock level and safety stock dynamically throughout the year.",
    category: "Seasonality",
  },
];

// Best practices data
const bestPractices = [
  {
    title: "Regular Review Cycles",
    icon: RefreshCw,
    color: "#2E8B57",
    description: "Establish monthly or quarterly reviews of safety stock parameters.",
    details: "Track actual demand variability against forecasts and adjust standard deviation estimates accordingly. Seasonal businesses should align reviews with seasonal transitions. Document all changes and their rationale for future reference.",
  },
  {
    title: "Segmented Service Levels",
    icon: Target,
    color: "#0F4C81",
    description: "Apply different service level targets based on item classification.",
    details: "ABC analysis helps prioritize resources—A items deserve higher service levels and more frequent review, while C items can tolerate lower service levels to reduce costs. Consider customer segmentation as well.",
  },
  {
    title: "Monitor Supplier Performance",
    icon: Activity,
    color: "#F59E0B",
    description: "Track actual lead times against quoted lead times consistently.",
    details: "Supplier reliability directly impacts lead time variability and therefore safety stock requirements. Consider supplier scorecards and use actual performance data in calculations rather than relying solely on quoted lead times.",
  },
  {
    title: "Improve Demand Forecasting",
    icon: TrendingUp,
    color: "#8B5CF6",
    description: "Invest in improving forecast accuracy to reduce safety stock needs.",
    details: "Better forecasts reduce demand variability, which directly reduces safety stock requirements. Consider collaborative planning with key customers, incorporate market intelligence, and apply seasonal adjustment factors.",
  },
  {
    title: "Lead Time Reduction",
    icon: Zap,
    color: "#06B6D4",
    description: "Work with suppliers to reduce lead times and lead time variability.",
    details: "Shorter, more predictable lead times dramatically reduce safety stock. Consider local sourcing, vendor-managed inventory, consignment arrangements, or closer supplier relationships with performance incentives.",
  },
  {
    title: "Distinguish Safety vs Excess",
    icon: Layers,
    color: "#EC4899",
    description: "Separate calculated safety stock from other excess inventory.",
    details: "Safety stock should be planned and visible; unplanned excess often indicates forecasting issues or purchasing problems that should be addressed separately. Regular inventory stratification helps identify true safety stock.",
  },
];

// Common mistakes data
const commonMistakes = [
  {
    title: "Using Point Estimates Only",
    description: "Using only average values without considering variability leads to chronic stockouts. Always estimate and include standard deviations for both demand and lead time in your calculations.",
    severity: "high",
  },
  {
    title: "Ignoring Lead Time Variability",
    description: "Many calculators only consider demand variability. Lead time variability can be equally significant, especially in international supply chains with ocean freight, customs delays, and port congestion.",
    severity: "high",
  },
  {
    title: "Indiscriminate High Service Levels",
    description: "Higher service levels require exponentially more inventory. Apply 99%+ service levels only to truly critical items where stockout costs justify the investment.",
    severity: "medium",
  },
  {
    title: "Not Updating Parameters",
    description: "Market conditions, supplier performance, and demand patterns change over time. Safety stock parameters should be reviewed and updated regularly to reflect current realities.",
    severity: "medium",
  },
];

// Key features for hero section
const keyFeatures = [
  { icon: Calculator, label: "Statistical Method", description: "Z-score based calculation" },
  { icon: TrendingUp, label: "Service Level Analysis", description: "Cost vs service trade-off" },
  { icon: DollarSign, label: "Cost Optimization", description: "Minimize carrying costs" },
  { icon: Shield, label: "Risk Assessment", description: "Stockout probability analysis" },
];

export function SafetyStockCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [calculationMethod, setCalculationMethod] = useState<string>("statistical");
  const [averageDailyDemand, setAverageDailyDemand] = useState<string>("100");
  const [demandStdDev, setDemandStdDev] = useState<string>("20");
  const [leadTime, setLeadTime] = useState<string>("7");
  const [leadTimeStdDev, setLeadTimeStdDev] = useState<string>("2");
  const [serviceLevel, setServiceLevel] = useState<string>("95");
  const [unitCost, setUnitCost] = useState<string>("50");
  const [holdingRate, setHoldingRate] = useState<string>("25");
  const [maxDailyDemand, setMaxDailyDemand] = useState<string>("150");
  const [maxLeadTime, setMaxLeadTime] = useState<string>("14");
  const [copied, setCopied] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const calculation = useMemo<SafetyStockResult>(() => {
    const avgD = parseFloat(averageDailyDemand) || 0;
    const stdD = parseFloat(demandStdDev) || 0;
    const LT = parseFloat(leadTime) || 0;
    const stdLT = parseFloat(leadTimeStdDev) || 0;
    const sl = serviceLevelZScores[serviceLevel] || { zScore: 1.65, risk: 5 };
    const cost = parseFloat(unitCost) || 0;
    const holdRate = parseFloat(holdingRate) || 0;

    let safetyStock = 0;

    if (calculationMethod === "statistical") {
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
    const totalInventoryValue = safetyStock * cost;
    const daysOfSupply = avgD > 0 ? safetyStock / avgD : 0;
    const fillRate = 100 - (sl.risk * 0.5); // Approximate fill rate

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
      totalInventoryValue,
      daysOfSupply: Math.round(daysOfSupply * 10) / 10,
      fillRate,
    };
  }, [calculationMethod, averageDailyDemand, demandStdDev, leadTime, leadTimeStdDev, serviceLevel, unitCost, holdingRate, maxDailyDemand, maxLeadTime]);

  // Generate service level vs safety stock curve data
  const serviceLevelCurveData = useMemo(() => {
    const avgD = parseFloat(averageDailyDemand) || 100;
    const stdD = parseFloat(demandStdDev) || 20;
    const LT = parseFloat(leadTime) || 7;
    const stdLT = parseFloat(leadTimeStdDev) || 2;
    const cost = parseFloat(unitCost) || 50;
    const holdRate = parseFloat(holdingRate) || 25;

    const serviceLevels = [80, 85, 90, 92, 95, 97.5, 98, 99, 99.5, 99.9];
    const zScores = [0.84, 1.04, 1.28, 1.41, 1.65, 1.96, 2.05, 2.33, 2.58, 3.09];

    return serviceLevels.map((sl, index) => {
      const ss = zScores[index] * Math.sqrt(LT * Math.pow(stdD, 2) + Math.pow(avgD, 2) * Math.pow(stdLT, 2));
      return {
        serviceLevel: sl,
        safetyStock: Math.round(ss),
        holdingCost: Math.round(ss * cost * (holdRate / 100)),
      };
    });
  }, [averageDailyDemand, demandStdDev, leadTime, leadTimeStdDev, unitCost, holdingRate]);

  // Z-score comparison data
  const zScoreComparisonData = useMemo(() => {
    return Object.entries(serviceLevelZScores).map(([key, data]) => ({
      name: data.label,
      zScore: data.zScore,
      risk: data.risk,
      fill: serviceLevel === key ? "#0F4C81" : "#2E8B57",
    }));
  }, [serviceLevel]);

  // Demand variability impact data
  const demandVariabilityData = useMemo(() => {
    const avgD = parseFloat(averageDailyDemand) || 100;
    const LT = parseFloat(leadTime) || 7;
    const stdLT = parseFloat(leadTimeStdDev) || 2;
    const zScore = serviceLevelZScores[serviceLevel]?.zScore || 1.65;

    const variabilityPercents = [10, 15, 20, 25, 30, 35, 40];
    return variabilityPercents.map((variability) => {
      const stdD = avgD * (variability / 100);
      const ss = zScore * Math.sqrt(LT * Math.pow(stdD, 2) + Math.pow(avgD, 2) * Math.pow(stdLT, 2));
      return {
        variability: `${variability}%`,
        safetyStock: Math.round(ss),
        current: variability === Math.round((parseFloat(demandStdDev) / parseFloat(averageDailyDemand)) * 100),
      };
    });
  }, [averageDailyDemand, leadTime, leadTimeStdDev, serviceLevel, demandStdDev]);

  // Inventory breakdown data for pie chart
  const inventoryBreakdownData = useMemo(() => {
    return [
      { name: "Safety Stock", value: calculation.safetyStock, color: "#0F4C81" },
      { name: "Lead Time Demand", value: calculation.demandDuringLeadTime, color: "#2E8B57" },
    ];
  }, [calculation]);

  // Cost analysis data
  const costAnalysisData = useMemo(() => {
    return [
      {
        name: "Daily Holding",
        value: (calculation.holdingCost) / 365,
      },
      {
        name: "Monthly Holding",
        value: (calculation.holdingCost) / 12,
      },
      {
        name: "Annual Holding",
        value: calculation.holdingCost,
      },
    ];
  }, [calculation]);

  // Radar chart data for multi-dimensional analysis
  const radarData = useMemo(() => {
    return [
      { subject: "Service Level", A: calculation.serviceLevel, fullMark: 100 },
      { subject: "Fill Rate", A: calculation.fillRate, fullMark: 100 },
      { subject: "Cost Efficiency", A: Math.max(0, 100 - (calculation.holdingCost / (calculation.totalInventoryValue || 1)) * 100), fullMark: 100 },
      { subject: "Demand Stability", A: Math.max(0, 100 - calculation.demandVariability * 2), fullMark: 100 },
      { subject: "Supply Reliability", A: Math.max(0, 100 - calculation.leadTimeVariability * 2), fullMark: 100 },
      { subject: "Days Coverage", A: Math.min(100, calculation.daysOfSupply * 5), fullMark: 100 },
    ];
  }, [calculation]);

  // Sensitivity analysis data
  const sensitivityData = useMemo(() => {
    const avgD = parseFloat(averageDailyDemand) || 100;
    const stdD = parseFloat(demandStdDev) || 20;
    const LT = parseFloat(leadTime) || 7;
    const stdLT = parseFloat(leadTimeStdDev) || 2;
    const zScore = serviceLevelZScores[serviceLevel]?.zScore || 1.65;

    const scenarios = [
      { label: "Best Case", demandMultiplier: 0.8, leadTimeMultiplier: 0.9 },
      { label: "Expected", demandMultiplier: 1.0, leadTimeMultiplier: 1.0 },
      { label: "Moderate Risk", demandMultiplier: 1.2, leadTimeMultiplier: 1.1 },
      { label: "High Risk", demandMultiplier: 1.4, leadTimeMultiplier: 1.3 },
      { label: "Worst Case", demandMultiplier: 1.6, leadTimeMultiplier: 1.5 },
    ];

    return scenarios.map((scenario) => {
      const adjustedStdD = stdD * scenario.demandMultiplier;
      const adjustedStdLT = stdLT * scenario.leadTimeMultiplier;
      const ss = zScore * Math.sqrt(LT * Math.pow(adjustedStdD, 2) + Math.pow(avgD, 2) * Math.pow(adjustedStdLT, 2));
      return {
        scenario: scenario.label,
        safetyStock: Math.round(ss),
        cost: Math.round(ss * (parseFloat(unitCost) || 50) * ((parseFloat(holdingRate) || 25) / 100)),
      };
    });
  }, [averageDailyDemand, demandStdDev, leadTime, leadTimeStdDev, serviceLevel, unitCost, holdingRate]);

  // Filter FAQs by category
  const filteredFaqs = useMemo(() => {
    if (selectedCategory === "All") return faqData;
    return faqData.filter((faq) => faq.category === selectedCategory);
  }, [selectedCategory]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(faqData.map((faq) => faq.category));
    return ["All", ...Array.from(cats)];
  }, []);

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

  const handleExport = () => {
    const data = {
      calculationMethod,
      inputs: {
        averageDailyDemand,
        demandStdDev: calculationMethod === "statistical" ? demandStdDev : null,
        maxDailyDemand: calculationMethod === "simple" ? maxDailyDemand : null,
        leadTime,
        leadTimeStdDev: calculationMethod === "statistical" ? leadTimeStdDev : null,
        maxLeadTime: calculationMethod === "simple" ? maxLeadTime : null,
        serviceLevel,
        unitCost,
        holdingRate,
      },
      results: calculation,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `safety-stock-calculation-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `Safety Stock Calculation Results:
- Safety Stock: ${formatNumber(calculation.safetyStock)} units
- Reorder Point: ${formatNumber(calculation.reorderPoint)} units
- Service Level: ${serviceLevelZScores[serviceLevel]?.label}
- Annual Holding Cost: ${formatCurrency(calculation.holdingCost)}
Calculated at Shiportrade.com`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Brand colors
  const OCEAN_BLUE = "#0F4C81";
  const LOGISTICS_GREEN = "#2E8B57";

  return (
    <div className="space-y-8">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0a3a61] to-[#2E8B57] p-8 lg:p-12 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2E8B57]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 to-transparent rounded-full" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge and Title */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 px-4 py-1.5 text-sm">
                <Sparkles className="h-4 w-4 mr-1.5" />
                Professional Tool
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-4 py-1.5 text-sm">
                <Shield className="h-4 w-4 mr-1.5" />
                Inventory Optimization
              </Badge>
              <Badge className="bg-[#2E8B57]/30 hover:bg-[#2E8B57]/40 text-white border-[#2E8B57]/30 px-4 py-1.5 text-sm">
                <Calculator className="h-4 w-4 mr-1.5" />
                Statistical Method
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Safety Stock Calculator
            </h1>
            <p className="text-white/80 max-w-3xl text-lg lg:text-xl leading-relaxed mb-8">
              Calculate optimal safety stock levels using industry-standard statistical methods. 
              Protect against demand variability and lead time uncertainty to maintain your target service levels 
              while minimizing carrying costs.
            </p>
          </motion.div>

          {/* Key Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {keyFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <div className="p-2.5 rounded-lg bg-white/15">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{feature.label}</div>
                  <div className="text-xs text-white/60">{feature.description}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Shield className="h-5 w-5 text-amber-300" />
                </div>
                <span className="text-sm text-white/70">Safety Stock</span>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white">{formatNumber(calculation.safetyStock)}</div>
              <div className="text-xs text-white/60 mt-1">units buffer stock</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-[#2E8B57]/30">
                  <Target className="h-5 w-5 text-green-300" />
                </div>
                <span className="text-sm text-white/70">Reorder Point</span>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white">{formatNumber(calculation.reorderPoint)}</div>
              <div className="text-xs text-white/60 mt-1">units trigger level</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <DollarSign className="h-5 w-5 text-blue-300" />
                </div>
                <span className="text-sm text-white/70">Holding Cost</span>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white">{formatCurrency(calculation.holdingCost)}</div>
              <div className="text-xs text-white/60 mt-1">per year</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Percent className="h-5 w-5 text-purple-300" />
                </div>
                <span className="text-sm text-white/70">Service Level</span>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-white">{serviceLevelZScores[serviceLevel]?.label}</div>
              <div className="text-xs text-white/60 mt-1">Z = {calculation.zScore}</div>
            </motion.div>
          </div>

          {/* Service Level Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-6 bg-white/5 rounded-xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/70">Service Level Progress</span>
              <span className="text-sm font-medium text-white">{serviceLevelZScores[serviceLevel]?.label} Target</span>
            </div>
            <div className="h-4 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calculation.serviceLevel}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className="h-full bg-gradient-to-r from-[#2E8B57] to-[#0F4C81] rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-2">
              <span>80% Minimum</span>
              <span>99.9% Maximum</span>
            </div>
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex flex-wrap gap-3"
          >
            <Button
              size="lg"
              className="bg-white text-[#0F4C81] hover:bg-white/90 gap-2"
              onClick={() => setActiveTab("calculator")}
            >
              <Play className="h-4 w-4" />
              Start Calculating
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 gap-2"
              onClick={() => setActiveTab("methodology")}
            >
              <BookOpen className="h-4 w-4" />
              Learn Methodology
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 gap-2"
              onClick={handleShare}
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
              {copied ? "Copied!" : "Share Results"}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleShare} className="gap-2">
                {copied ? <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Results"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy results to clipboard</TooltipContent>
          </UITooltip>
        </TooltipProvider>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download calculation as JSON file</TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="gap-2 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="methodology" className="gap-2 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Methodology</span>
          </TabsTrigger>
          <TabsTrigger value="practices" className="gap-2 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Best Practices</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2 py-3 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Calculation Method Card */}
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Calculation Method
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Select value={calculationMethod} onValueChange={setCalculationMethod}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="statistical">
                        <div className="flex items-center gap-2">
                          <LineChartIcon className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                          <span>Statistical Method (Recommended)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="simple">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-amber-500" />
                          <span>Simple Max-Average Method</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-3 bg-muted/50 p-3 rounded-lg">
                    {calculationMethod === "statistical"
                      ? "Uses standard deviation and Z-scores for more accurate results. Requires historical data for demand and lead time variability."
                      : "Uses maximum observed values for conservative estimates. Easier to implement when statistical data is unavailable."}
                  </p>
                </CardContent>
              </Card>

              {/* Demand Parameters Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Demand Parameters
                  </CardTitle>
                  <CardDescription>
                    Enter your average daily demand and variability measures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="avgDemand" className="flex items-center gap-2">
                        Average Daily Demand
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>The mean number of units demanded per day</TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="avgDemand"
                        type="number"
                        value={averageDailyDemand}
                        onChange={(e) => setAverageDailyDemand(e.target.value)}
                        placeholder="100"
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">Units per day</p>
                    </div>
                    {calculationMethod === "statistical" ? (
                      <div className="space-y-2">
                        <Label htmlFor="demandStdDev" className="flex items-center gap-2">
                          Demand Std. Deviation
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>Standard deviation of daily demand</TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="demandStdDev"
                          type="number"
                          value={demandStdDev}
                          onChange={(e) => setDemandStdDev(e.target.value)}
                          placeholder="20"
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                          ~{formatNumber(calculation.demandVariability)}% variability (CV)
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
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">Highest observed demand</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Variability Indicator */}
                  {calculationMethod === "statistical" && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Demand Variability Assessment</span>
                        <Badge variant={calculation.demandVariability > 30 ? "destructive" : calculation.demandVariability > 20 ? "secondary" : "default"}>
                          {calculation.demandVariability > 30 ? "High" : calculation.demandVariability > 20 ? "Moderate" : "Low"}
                        </Badge>
                      </div>
                      <Progress value={Math.min(calculation.demandVariability * 2, 100)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {calculation.demandVariability > 30 
                          ? "High variability significantly increases safety stock requirements. Consider demand smoothing strategies."
                          : calculation.demandVariability > 20 
                          ? "Moderate variability is typical for most products. Monitor for seasonal patterns."
                          : "Low variability means stable demand patterns. Safety stock can be optimized further."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lead Time Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    Lead Time Parameters
                  </CardTitle>
                  <CardDescription>
                    Supplier delivery time and reliability measures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="leadTime" className="flex items-center gap-2">
                        Average Lead Time
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Mean time between order placement and receipt</TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="leadTime"
                        type="number"
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value)}
                        placeholder="7"
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground">Days from order to delivery</p>
                    </div>
                    {calculationMethod === "statistical" ? (
                      <div className="space-y-2">
                        <Label htmlFor="leadTimeStdDev" className="flex items-center gap-2">
                          Lead Time Std. Deviation
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger>
                                <Info className="h-3 w-3 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>Standard deviation of lead time in days</TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="leadTimeStdDev"
                          type="number"
                          value={leadTimeStdDev}
                          onChange={(e) => setLeadTimeStdDev(e.target.value)}
                          placeholder="2"
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                          ~{formatNumber(calculation.leadTimeVariability)}% variability
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="maxLeadTime">Max Lead Time</Label>
                        <Input
                          id="maxLeadTime"
                          type="number"
                          value={maxLeadTime}
                          onChange={(e) => setMaxLeadTime(e.target.value)}
                          placeholder="14"
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">Longest observed lead time</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Service Level & Costs Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Service Level & Costs
                  </CardTitle>
                  <CardDescription>
                    Target service level and inventory carrying costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Target Service Level
                      <TooltipProvider>
                        <UITooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Probability of not experiencing a stockout during lead time</TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </Label>
                    <Select value={serviceLevel} onValueChange={setServiceLevel}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(serviceLevelZScores).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>{data.label} service level</span>
                              <span className="text-muted-foreground text-xs">Z = {data.zScore}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded mt-2">
                      {serviceLevelZScores[serviceLevel]?.description}
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unitCost" className="flex items-center gap-2">
                        Unit Cost ($)
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Cost per unit of inventory</TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="unitCost"
                        type="number"
                        value={unitCost}
                        onChange={(e) => setUnitCost(e.target.value)}
                        placeholder="50"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holdingRate" className="flex items-center gap-2">
                        Holding Rate (%/year)
                        <TooltipProvider>
                          <UITooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>Annual carrying cost as percentage of unit cost</TooltipContent>
                          </UITooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="holdingRate"
                        type="number"
                        value={holdingRate}
                        onChange={(e) => setHoldingRate(e.target.value)}
                        placeholder="25"
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Result Card */}
              <Card className="overflow-hidden border-2" style={{ borderColor: `${OCEAN_BLUE}30` }}>
                <div className="bg-gradient-to-br from-[#0F4C81]/5 via-transparent to-[#2E8B57]/5 p-1">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Shield className="h-6 w-6 text-amber-600" />
                      Safety Stock Result
                    </CardTitle>
                    <CardDescription>
                      Recommended buffer stock for {serviceLevelZScores[serviceLevel]?.label} service level
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="space-y-6 pt-6">
                  {/* Primary Result */}
                  <div className="text-center py-8 bg-gradient-to-b from-muted/50 to-transparent rounded-xl">
                    <motion.div
                      key={calculation.safetyStock}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent"
                    >
                      {formatNumber(calculation.safetyStock)}
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-2">
                      Units Safety Stock
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Badge className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white px-4 py-1">
                        {serviceLevelZScores[serviceLevel]?.label} Service Level
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Z = {calculation.zScore}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-xl border" style={{ backgroundColor: `${OCEAN_BLUE}08`, borderColor: `${OCEAN_BLUE}20` }}>
                      <div className="text-3xl font-bold" style={{ color: OCEAN_BLUE }}>
                        {formatNumber(calculation.reorderPoint)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Reorder Point</div>
                      <div className="text-xs text-muted-foreground/70">Units</div>
                    </div>
                    <div className="text-center p-4 rounded-xl border" style={{ backgroundColor: `${LOGISTICS_GREEN}08`, borderColor: `${LOGISTICS_GREEN}20` }}>
                      <div className="text-3xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                        {formatNumber(calculation.demandDuringLeadTime)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Lead Time Demand</div>
                      <div className="text-xs text-muted-foreground/70">Units during {leadTime} days</div>
                    </div>
                  </div>

                  {/* Cost Summary */}
                  <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-muted-foreground">Annual Holding Cost</span>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Cost to maintain {formatNumber(calculation.safetyStock)} units
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-amber-600">{formatCurrency(calculation.holdingCost)}</span>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-semibold">{formatCurrency(calculation.totalInventoryValue)}</div>
                      <div className="text-xs text-muted-foreground">Inventory Value</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-semibold">{calculation.daysOfSupply}</div>
                      <div className="text-xs text-muted-foreground">Days of Supply</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-semibold">{calculation.fillRate.toFixed(1)}%</div>
                      <div className="text-xs text-muted-foreground">Fill Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Stockout Risk</span>
                      <Badge 
                        variant={calculation.stockoutRisk <= 1 ? "default" : calculation.stockoutRisk <= 5 ? "secondary" : "destructive"}
                        className="px-3"
                      >
                        {calculation.stockoutRisk}% chance per cycle
                      </Badge>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${calculation.serviceLevel}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full ${
                          calculation.serviceLevel >= 99 
                            ? "bg-gradient-to-r from-[#2E8B57] to-green-400" 
                            : calculation.serviceLevel >= 95 
                            ? "bg-gradient-to-r from-[#0F4C81] to-[#2E8B57]" 
                            : "bg-gradient-to-r from-amber-500 to-orange-500"
                        }`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Higher Risk</span>
                      <span>Lower Risk</span>
                    </div>
                    
                    {/* Risk Interpretation */}
                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {calculation.stockoutRisk <= 1 
                          ? "Excellent protection level. This service level is appropriate for critical items with high stockout costs."
                          : calculation.stockoutRisk <= 5 
                          ? "Standard protection suitable for most inventory items. Balance between carrying costs and service."
                          : "Lower protection level. Consider increasing for important items or accepting for low-value commodities."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Level Comparison Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Gauge className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    Service Level Impact Analysis
                  </CardTitle>
                  <CardDescription>
                    How different service levels would affect your safety stock
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(serviceLevelZScores)
                      .slice(0, 4)
                      .map(([key, data]) => {
                        let ss = 0;
                        if (calculationMethod === "statistical") {
                          const avgD = parseFloat(averageDailyDemand) || 0;
                          const stdD = parseFloat(demandStdDev) || 0;
                          const LT = parseFloat(leadTime) || 0;
                          const stdLT = parseFloat(leadTimeStdDev) || 0;
                          ss = data.zScore * Math.sqrt(LT * Math.pow(stdD, 2) + Math.pow(avgD, 2) * Math.pow(stdLT, 2));
                        }
                        const isSelected = serviceLevel === key;
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: parseInt(key) * 0.01 }}
                            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                              isSelected 
                                ? "bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 border-2 font-medium" 
                                : "bg-muted/50 hover:bg-muted/70"
                            }`}
                            style={isSelected ? { borderColor: `${OCEAN_BLUE}30` } : {}}
                          >
                            <div className="flex items-center gap-3">
                              {isSelected ? (
                                <CheckCircle className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                              ) : (
                                <Minus className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={isSelected ? "font-medium" : ""}>{data.label}</span>
                            </div>
                            <div className="text-right">
                              <span className={isSelected ? "font-bold" : ""} style={isSelected ? { color: OCEAN_BLUE } : {}}>
                                {formatNumber(ss)} units
                              </span>
                              {isSelected && (
                                <Badge variant="secondary" className="ml-2 text-xs">Current</Badge>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded-lg">
                    <Lightbulb className="h-3 w-3 inline mr-1" />
                    Higher service levels require exponentially more safety stock. Choose based on item criticality and stockout costs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="mt-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                    <Shield className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatNumber(calculation.safetyStock)}</div>
                    <div className="text-xs text-muted-foreground">Safety Stock</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#2E8B57]/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}>
                    <Target className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatNumber(calculation.reorderPoint)}</div>
                    <div className="text-xs text-muted-foreground">Reorder Point</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-amber-500/10">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatCurrency(calculation.holdingCost)}</div>
                    <div className="text-xs text-muted-foreground">Annual Cost</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/5 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10">
                    <Percent className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{serviceLevelZScores[serviceLevel]?.label}</div>
                    <div className="text-xs text-muted-foreground">Service Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Service Level vs Safety Stock Curve */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  Service Level vs Safety Stock
                </CardTitle>
                <CardDescription>
                  Non-linear relationship showing exponential increase at higher service levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={serviceLevelCurveData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="serviceLevel" 
                        tickFormatter={(value) => `${value}%`}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value: number, name: string) => [
                          name === "safetyStock" ? `${formatNumber(value)} units` : formatCurrency(value),
                          name === "safetyStock" ? "Safety Stock" : "Holding Cost"
                        ]}
                        labelFormatter={(label) => `Service Level: ${label}%`}
                      />
                      <ReferenceLine
                        x={calculation.serviceLevel}
                        stroke={OCEAN_BLUE}
                        strokeDasharray="5 5"
                        label={{ value: "Current", position: "top", fill: OCEAN_BLUE }}
                      />
                      <Line
                        type="monotone"
                        dataKey="safetyStock"
                        stroke={LOGISTICS_GREEN}
                        strokeWidth={3}
                        dot={{ r: 4, fill: LOGISTICS_GREEN }}
                        activeDot={{ r: 6, fill: OCEAN_BLUE }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Key Insight:</strong> Moving from 95% to 99% service level may increase safety stock by 40-50%, 
                    while the incremental benefit is only 4% fewer stockouts.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Z-Score Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                  Z-Score Comparison
                </CardTitle>
                <CardDescription>
                  Z-scores and corresponding stockout risk at different service levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={zScoreComparisonData} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" width={60} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value: number, name: string) => [
                          name === "zScore" ? value.toFixed(2) : `${value}%`,
                          name === "zScore" ? "Z-Score" : "Stockout Risk"
                        ]}
                      />
                      <Bar dataKey="zScore" radius={[0, 4, 4, 0]}>
                        {zScoreComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart for Multi-dimensional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart2 className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                Multi-Dimensional Performance Analysis
              </CardTitle>
              <CardDescription>
                Comprehensive view of your inventory performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="A"
                        stroke={OCEAN_BLUE}
                        fill={OCEAN_BLUE}
                        fillOpacity={0.5}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {radarData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <span className="text-sm font-medium">{item.subject}</span>
                      <div className="flex items-center gap-3">
                        <Progress value={item.A} className="w-24 h-2" />
                        <span className="text-sm text-muted-foreground w-12 text-right">
                          {item.A.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sensitivity Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUpIcon className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Scenario Sensitivity Analysis
              </CardTitle>
              <CardDescription>
                How safety stock changes under different demand and lead time scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={sensitivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="scenario" className="text-xs" />
                    <YAxis yAxisId="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="safetyStock" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} name="Safety Stock (units)" />
                    <Line yAxisId="right" type="monotone" dataKey="cost" stroke={LOGISTICS_GREEN} strokeWidth={3} name="Holding Cost ($)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Demand Variability Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Demand Variability Impact Analysis
              </CardTitle>
              <CardDescription>
                How demand variability (coefficient of variation) affects safety stock requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demandVariabilityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSafety" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={OCEAN_BLUE} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={OCEAN_BLUE} stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="variability" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`${formatNumber(value)} units`, "Safety Stock"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="safetyStock"
                      stroke={OCEAN_BLUE}
                      fill="url(#colorSafety)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline" style={{ backgroundColor: `${OCEAN_BLUE}10`, color: OCEAN_BLUE }}>
                  Current: {formatNumber(calculation.demandVariability)}%
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Your demand variability is {calculation.demandVariability > 25 ? "above" : "below"} average. 
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Breakdown and Cost Analysis */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                  Reorder Point Breakdown
                </CardTitle>
                <CardDescription>
                  Composition of your total reorder point
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {inventoryBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${formatNumber(value)} units`, ""]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}08` }}>
                    <div className="text-sm font-medium" style={{ color: OCEAN_BLUE }}>
                      {((calculation.safetyStock / calculation.reorderPoint) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Safety Stock Portion</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${LOGISTICS_GREEN}08` }}>
                    <div className="text-sm font-medium" style={{ color: LOGISTICS_GREEN }}>
                      {((calculation.demandDuringLeadTime / calculation.reorderPoint) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Lead Time Demand</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  Holding Cost Analysis
                </CardTitle>
                <CardDescription>
                  Time-based breakdown of safety stock carrying costs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costAnalysisData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `$${value.toFixed(0)}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                        formatter={(value: number) => [formatCurrency(value), "Cost"]}
                      />
                      <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium text-sm">Cost Impact</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your annual holding cost of {formatCurrency(calculation.holdingCost)} represents the cost to maintain your safety stock buffer.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Z-Score Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                Complete Z-Score Reference Table
              </CardTitle>
              <CardDescription>
                Standard normal distribution Z-scores for common service levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Service Level</th>
                      <th className="text-left py-3 px-4 font-semibold">Z-Score</th>
                      <th className="text-left py-3 px-4 font-semibold">Stockout Risk</th>
                      <th className="text-left py-3 px-4 font-semibold">Stockout Periods</th>
                      <th className="text-left py-3 px-4 font-semibold">Recommended For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zScoreReferenceTable.map((row, index) => (
                      <tr
                        key={index}
                        className={`border-b transition-colors ${
                          row.serviceLevel === serviceLevelZScores[serviceLevel]?.label
                            ? "bg-[#0F4C81]/10 font-medium"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <td className="py-3 px-4">
                          <Badge
                            variant={row.serviceLevel === serviceLevelZScores[serviceLevel]?.label ? "default" : "outline"}
                          >
                            {row.serviceLevel}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono">{row.zScore.toFixed(2)}</td>
                        <td className="py-3 px-4">{row.risk}</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.stockoutPeriods}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">
                          {index < 3 && "Non-critical items, commodities"}
                          {index >= 3 && index < 6 && "Standard inventory, B-items"}
                          {index >= 6 && index < 8 && "Important items, A-items"}
                          {index >= 8 && "Critical items, safety-related"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Methodology */}
        <TabsContent value="methodology" className="mt-6 space-y-6">
          {/* What is Safety Stock */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5 p-px">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  What is Safety Stock?
                </CardTitle>
              </CardHeader>
            </div>
            <CardContent className="pt-6">
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Safety stock is a critical component of inventory management that serves as a buffer against uncertainty 
                  in both demand and supply. It represents additional units of inventory held beyond expected demand to 
                  protect against stockouts when actual conditions differ from forecasts. In international trade and 
                  logistics, where lead times can span weeks and demand patterns may shift rapidly due to market conditions, 
                  safety stock becomes even more crucial for maintaining customer service levels and avoiding costly 
                  disruptions to supply chains.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The fundamental purpose of safety stock is to absorb variability. Demand variability occurs when customer 
                  orders fluctuate around the forecasted average. Supply variability arises from uncertainties in lead time. 
                  Safety stock provides a cushion against both types of variability, ensuring that you can continue to 
                  fulfill customer orders even when conditions deviate from expectations.
                </p>
              </div>
              
              {/* Key Benefits */}
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: `${OCEAN_BLUE}05`, borderColor: `${OCEAN_BLUE}15` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-medium text-sm">Prevent Stockouts</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maintain customer satisfaction by avoiding lost sales and backorders during demand spikes
                  </p>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: `${LOGISTICS_GREEN}05`, borderColor: `${LOGISTICS_GREEN}15` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-medium text-sm">Buffer Variability</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Protect against both demand uncertainty and supply chain disruptions
                  </p>
                </div>
                <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-medium text-sm">Optimize Costs</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Balance carrying costs against stockout risks using statistical methods
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistical Formula */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calculator className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                Statistical Formula Method
              </CardTitle>
              <CardDescription>
                The gold standard for safety stock calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-xl border">
                <div className="text-center font-mono text-2xl mb-4" style={{ color: OCEAN_BLUE }}>
                  SS = Z × √(LT × σ²<sub>d</sub> + d² × σ²<sub>LT</sub>)
                </div>
                <div className="text-sm text-muted-foreground text-center space-y-1">
                  <p><strong>SS</strong> = Safety Stock</p>
                  <p><strong>Z</strong> = Z-score for desired service level</p>
                  <p><strong>LT</strong> = Average Lead Time (days)</p>
                  <p><strong>σ<sub>d</sub></strong> = Standard Deviation of Demand</p>
                  <p><strong>d</strong> = Average Daily Demand</p>
                  <p><strong>σ<sub>LT</sub></strong> = Standard Deviation of Lead Time</p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  The statistical method is the gold standard for safety stock calculation because it accounts for both 
                  demand variability and lead time variability simultaneously. The formula derives from the properties 
                  of the normal distribution and uses the Z-score to translate your desired service level into the 
                  appropriate inventory buffer.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-5 border rounded-xl" style={{ backgroundColor: `${OCEAN_BLUE}05` }}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                    <CheckCircle className="h-4 w-4" />
                    When to Use
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="h-3 w-3 mt-1" style={{ color: LOGISTICS_GREEN }} />
                      Historical demand data available
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="h-3 w-3 mt-1" style={{ color: LOGISTICS_GREEN }} />
                      Can calculate standard deviation
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="h-3 w-3 mt-1" style={{ color: LOGISTICS_GREEN }} />
                      Need precise optimization
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowUpRight className="h-3 w-3 mt-1" style={{ color: LOGISTICS_GREEN }} />
                      Variable demand and lead times
                    </li>
                  </ul>
                </div>
                <div className="p-5 border rounded-xl" style={{ backgroundColor: `${LOGISTICS_GREEN}05` }}>
                  <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                    <Award className="h-4 w-4" />
                    Advantages
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 mt-1 text-amber-500" />
                      Statistically rigorous approach
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 mt-1 text-amber-500" />
                      Optimizes inventory investment
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 mt-1 text-amber-500" />
                      Accounts for combined variability
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-3 w-3 mt-1 text-amber-500" />
                      Adjustable service level targets
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Simple Method */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Simple Max-Average Method
              </CardTitle>
              <CardDescription>
                A straightforward approach for quick estimates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="text-center font-mono text-xl mb-4 text-amber-700 dark:text-amber-400">
                  SS = (Max Demand × Max Lead Time) - (Avg Demand × Avg Lead Time)
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Simple approach using observed maximums for conservative estimates
                </p>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground">
                <p className="leading-relaxed">
                  The simple method takes a more conservative approach by using maximum observed values rather than 
                  statistical distributions. It calculates safety stock as the difference between the worst-case 
                  scenario and the average scenario. This method is easier to understand and communicate.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Service Level and Z-Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Service Level and Z-Score Relationship
              </CardTitle>
              <CardDescription>
                Understanding the connection between service targets and inventory investment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The service level represents the probability of not experiencing a stockout during a replenishment cycle. 
                For example, a 95% service level means that out of 100 replenishment cycles, you would expect to meet 
                all customer demand without running out of stock in 95 of those cycles.
              </p>

              <div className="p-5 bg-muted/50 rounded-xl mt-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Choosing the Right Service Level
                </h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: `${LOGISTICS_GREEN}10`, borderColor: `${LOGISTICS_GREEN}20` }}>
                    <div className="font-medium text-lg mb-2" style={{ color: LOGISTICS_GREEN }}>90-95%</div>
                    <p className="text-muted-foreground">
                      Standard items, competitive markets, C-class items, commodities
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: `${OCEAN_BLUE}10`, borderColor: `${OCEAN_BLUE}20` }}>
                    <div className="font-medium text-lg mb-2" style={{ color: OCEAN_BLUE }}>95-98%</div>
                    <p className="text-muted-foreground">
                      Important items, B-class items, branded products
                    </p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <div className="font-medium text-amber-600 text-lg mb-2">98-99.9%</div>
                    <p className="text-muted-foreground">
                      Critical items, A-class items, safety-related
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Best Practices */}
        <TabsContent value="practices" className="mt-6 space-y-6">
          {/* Best Practices Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Inventory Management Best Practices
              </CardTitle>
              <CardDescription>
                Key strategies for optimizing safety stock and inventory performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bestPractices.map((practice, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-3 rounded-xl transition-transform group-hover:scale-110" 
                            style={{ backgroundColor: `${practice.color}15` }}
                          >
                            <practice.icon className="h-5 w-5" style={{ color: practice.color }} />
                          </div>
                          <CardTitle className="text-base">{practice.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">
                          {practice.description}
                        </p>
                        <p className="text-xs text-muted-foreground/70 leading-relaxed">
                          {practice.details}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Implementation Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Implementation Guide
              </CardTitle>
              <CardDescription>
                Step-by-step process for implementing safety stock in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Data Collection", desc: "Gather historical demand data, lead time records, and cost information for each SKU" },
                  { step: 2, title: "Calculate Variability", desc: "Compute standard deviations for demand and lead time from your historical data" },
                  { step: 3, title: "Set Service Levels", desc: "Define appropriate service level targets based on item classification and business impact" },
                  { step: 4, title: "Calculate Safety Stock", desc: "Use the statistical method to calculate optimal safety stock for each item" },
                  { step: 5, title: "Integrate with Systems", desc: "Update your ERP or inventory management system with calculated reorder points" },
                  { step: 6, title: "Monitor & Adjust", desc: "Track actual performance and adjust parameters based on changing conditions" },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>
                Pitfalls that can undermine your safety stock strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {commonMistakes.map((mistake, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      mistake.severity === "high" 
                        ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800" 
                        : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className={`h-4 w-4 ${mistake.severity === "high" ? "text-red-500" : "text-amber-500"}`} />
                      <h4 className={`font-semibold text-sm ${mistake.severity === "high" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>
                        {mistake.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {mistake.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                Key Performance Metrics to Track
              </CardTitle>
              <CardDescription>
                Monitor these metrics to ensure your safety stock strategy is effective
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { metric: "Fill Rate", target: ">95%", icon: Percent, color: LOGISTICS_GREEN },
                  { metric: "Stockout Rate", target: "<5%", icon: XCircle, color: "#EF4444" },
                  { metric: "Inventory Turn", target: "6-12x/year", icon: RefreshCw, color: OCEAN_BLUE },
                  { metric: "Days of Supply", target: "30-60 days", icon: Clock, color: "#F59E0B" },
                ].map((item, index) => (
                  <div key={index} className="text-center p-4 bg-muted/30 rounded-xl">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <div className="font-medium">{item.metric}</div>
                    <div className="text-sm text-muted-foreground">Target: {item.target}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common safety stock and inventory management questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <Badge 
                    key={category} 
                    variant={selectedCategory === category ? "default" : "outline"} 
                    className="cursor-pointer hover:bg-muted px-4 py-1.5 text-sm"
                    style={selectedCategory === category ? { backgroundColor: OCEAN_BLUE } : {}}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              <AnimatePresence mode="wait">
                <Accordion type="single" collapsible className="w-full" key={selectedCategory}>
                  {filteredFaqs.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b">
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="shrink-0 px-2 py-0.5 text-xs">
                            Q{index + 1}
                          </Badge>
                          <Badge variant="secondary" className="shrink-0 text-xs">
                            {item.category}
                          </Badge>
                          <span className="font-medium">{item.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="text-sm text-muted-foreground pl-10 pr-4 leading-relaxed pb-4">
                          {item.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AnimatePresence>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 p-6">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Found these answers helpful?</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Yes</Button>
                  <Button variant="outline" size="sm">Need More Help</Button>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Additional Resources */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <FileText className="h-8 w-8 mb-3" style={{ color: OCEAN_BLUE }} />
                  <h4 className="font-medium mb-1">Methodology Guide</h4>
                  <p className="text-sm text-muted-foreground">Deep dive into statistical methods and formulas</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Users className="h-8 w-8 mb-3" style={{ color: LOGISTICS_GREEN }} />
                  <h4 className="font-medium mb-1">Community Forum</h4>
                  <p className="text-sm text-muted-foreground">Connect with supply chain professionals</p>
                </div>
                <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Database className="h-8 w-8 text-amber-500 mb-3" />
                  <h4 className="font-medium mb-1">Industry Benchmarks</h4>
                  <p className="text-sm text-muted-foreground">Compare your metrics to industry standards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
