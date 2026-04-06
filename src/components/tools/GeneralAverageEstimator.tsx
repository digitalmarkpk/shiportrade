"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Anchor,
  DollarSign,
  Percent,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  Calculator,
  RefreshCw,
  Scale,
  FileWarning,
  HelpCircle,
  Clock,
  Building2,
  Package,
  Shield,
  ChevronDown,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Users,
  BookOpen,
  Zap,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
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
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

interface CargoInterest {
  id: string;
  name: string;
  value: number;
  sacrificeValue: number;
  contribution: number;
}

interface GeneralAverageResult {
  totalValue: number;
  sacrificedValue: number;
  gaAdjustmentRate: number;
  totalGAfund: number;
  cargoInterests: CargoInterest[];
  shipContribution: number;
  freightContribution: number;
  process: {
    step: string;
    description: string;
    timeline: string;
  }[];
  yorkAntwerpRules: string[];
  averageGuarantee: number;
  depositRequired: number;
  timeLimit: string;
  exceptions: string[];
}

const sacrificeTypes = [
  {
    id: "jettison",
    name: "Jettison of Cargo",
    description: "Cargo thrown overboard to lighten ship",
    yorkRule: "Rule I",
  },
  {
    id: "extinguish",
    name: "Extinguishing Fire",
    description: "Damage from fire fighting efforts",
    yorkRule: "Rule III",
  },
  {
    id: "grounding",
    name: "Voluntary Grounding",
    description: "Intentional grounding to prevent sinking",
    yorkRule: "Rule V",
  },
  {
    id: "refloat",
    name: "Refloating Expenses",
    description: "Costs to refloat stranded vessel",
    yorkRule: "Rule VI",
  },
  {
    id: "engine",
    name: "Engine Damage",
    description: "Damage to engine while avoiding peril",
    yorkRule: "Rule VII",
  },
  {
    id: "port",
    name: "Port of Refuge Expenses",
    description: "Costs for emergency port call",
    yorkRule: "Rule X",
  },
];

const COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const faqs = [
  {
    question: "What is General Average?",
    answer: "General Average is a maritime principle where all parties in a sea venture proportionally share any losses resulting from a voluntary sacrifice of part of the ship or cargo to save the whole in an emergency. It dates back to ancient maritime law and is codified in the York-Antwerp Rules.",
  },
  {
    question: "When does General Average apply?",
    answer: "General Average applies when: (1) There is a common maritime adventure, (2) The sacrifice or expenditure is extraordinary, (3) It is intentionally and reasonably made, (4) It is for the common safety, and (5) It successfully preserves the property from peril.",
  },
  {
    question: "Who pays in a General Average event?",
    answer: "All parties with property at risk in the common maritime adventure contribute proportionally. This includes: shipowners (vessel value), cargo owners (cargo value), and freight interests (freight at risk). The contribution is based on each party's proportionate share of the total value at risk.",
  },
  {
    question: "What is a General Average Guarantee?",
    answer: "A General Average Guarantee is a security document provided by cargo owners to obtain release of their cargo before the final adjustment is completed. It guarantees payment of the assessed contribution. Insurance companies typically provide this on behalf of the cargo owner.",
  },
  {
    question: "What are York-Antwerp Rules?",
    answer: "The York-Antwerp Rules are an internationally recognized set of rules governing General Average. First established in 1864 and regularly updated (current version 2016), they provide standardized procedures for determining what losses qualify and how contributions are calculated.",
  },
  {
    question: "How long does a General Average adjustment take?",
    answer: "A General Average adjustment typically takes 12-18 months to complete. The process involves: declaration, appointment of an average adjuster, collection of securities, gathering documentation, preliminary adjustment, and final adjustment. Complex cases may take longer.",
  },
  {
    question: "Can cargo owners refuse to pay General Average?",
    answer: "No, cargo owners cannot refuse to pay their General Average contribution if it has been properly declared and adjusted according to York-Antwerp Rules. They must provide security (guarantee or deposit) before their cargo can be released. This is a binding maritime law obligation.",
  },
  {
    question: "What happens if the sacrificed cargo was underinsured?",
    answer: "If sacrificed cargo was underinsured, the cargo owner bears the uninsured portion of the loss. However, they are still entitled to receive a General Average contribution for their sacrifice. The contribution is based on the actual value of the sacrificed property, not the insured amount.",
  },
];

export default function GeneralAverageEstimator() {
  const [vesselValue, setVesselValue] = useState("25000000");
  const [freightValue, setFreightValue] = useState("500000");
  const [bunkersValue, setBunkersValue] = useState("300000");
  const [cargoValue, setCargoValue] = useState("15000000");
  const [sacrificeType, setSacrificeType] = useState("jettison");
  const [sacrificedCargoValue, setSacrificedCargoValue] = useState("2000000");
  const [salvageCost, setSalvageCost] = useState("800000");
  const [portRefugeCost, setPortRefugeCost] = useState("150000");
  const [numberOfCargoes, setNumberOfCargoes] = useState("12");

  const [result, setResult] = useState<GeneralAverageResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateGeneralAverage = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const vessel = parseFloat(vesselValue) || 25000000;
      const freight = parseFloat(freightValue) || 500000;
      const bunkers = parseFloat(bunkersValue) || 300000;
      const cargo = parseFloat(cargoValue) || 15000000;
      const sacrificed = parseFloat(sacrificedCargoValue) || 2000000;
      const salvage = parseFloat(salvageCost) || 800000;
      const portRefuge = parseFloat(portRefugeCost) || 150000;
      const numCargoes = parseFloat(numberOfCargoes) || 12;

      // Total property at risk
      const totalValue = vessel + freight + bunkers + cargo;

      // Total General Average sacrifice and expenses
      const totalGAfund = sacrificed + salvage + portRefuge;

      // General Average Adjustment Rate
      const gaAdjustmentRate = (totalGAfund / totalValue) * 100;

      // Generate cargo interests
      const avgCargoValue = cargo / numCargoes;
      const cargoInterests: CargoInterest[] = [];

      for (let i = 1; i <= numCargoes; i++) {
        const value = avgCargoValue * (0.8 + Math.random() * 0.4);
        const isSacrificed = i <= 2; // First 2 cargoes were sacrificed
        const sacrificeVal = isSacrificed ? value : 0;
        const contribution = value * (gaAdjustmentRate / 100);

        cargoInterests.push({
          id: `CARGO-${i.toString().padStart(3, "0")}`,
          name: `Cargo Owner ${i}`,
          value: Math.round(value),
          sacrificeValue: Math.round(sacrificeVal),
          contribution: Math.round(contribution),
        });
      }

      const shipContribution = vessel * (gaAdjustmentRate / 100);
      const freightContribution = freight * (gaAdjustmentRate / 100);

      // Process steps
      const process = [
        { step: "1. GA Declaration", description: "Master declares General Average", timeline: "Immediate" },
        { step: "2. Average Adjuster", description: "Appoint qualified average adjuster", timeline: "24-48 hours" },
        { step: "3. Security Collection", description: "Collect GA guarantees and deposits", timeline: "3-5 days" },
        { step: "4. Documentation", description: "Gather all supporting documents", timeline: "2-4 weeks" },
        { step: "5. Preliminary Adjustment", description: "Prepare preliminary GA statement", timeline: "3-6 months" },
        { step: "6. Final Adjustment", description: "Issue final GA adjustment", timeline: "12-18 months" },
      ];

      const yorkAntwerpRules = [
        "Rule A - Definition of General Average",
        "Rule B - Common Safety Exception",
        "Rule C - Losses Admitted as General Average",
        "Rule G - Provision of Funds",
        "Rule XI - Expenses at Port of Refuge",
        "Rule XIV - Temporary Repairs",
        "Rule XVI - Amount at Risk",
        "Rule XVII - Distribution of Contribution",
        "Rule XXI - Interest",
        "Rule XXII - Commission",
      ];

      const averageGuarantee = totalGAfund * 0.15;
      const depositRequired = totalGAfund * 0.05;

      const gaResult: GeneralAverageResult = {
        totalValue,
        sacrificedValue: sacrificed,
        gaAdjustmentRate,
        totalGAfund,
        cargoInterests,
        shipContribution: Math.round(shipContribution),
        freightContribution: Math.round(freightContribution),
        process,
        yorkAntwerpRules,
        averageGuarantee: Math.round(averageGuarantee),
        depositRequired: Math.round(depositRequired),
        timeLimit: "6 years from date of termination of the common adventure",
        exceptions: [
          "Losses not caused by sacrifice for common safety",
          "Damage caused by delay (Rule C)",
          "Fuel consumed during deviation (Rule VIII)",
          "Wages and maintenance of crew during delay (Rule XI)",
        ],
      };

      setResult(gaResult);
      setIsCalculating(false);
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 0) => {
    return value.toLocaleString("en-US", { maximumFractionDigits: decimals });
  };

  const pieData = result ? [
    { name: "Vessel", value: result.shipContribution, color: OCEAN_BLUE },
    { name: "Freight", value: result.freightContribution, color: LOGISTICS_GREEN },
    { name: "Cargo Interests", value: result.cargoInterests.reduce((sum, c) => sum + c.contribution, 0), color: "#F59E0B" },
  ] : [];

  const barData = result?.cargoInterests.slice(0, 8).map((c) => ({
    name: c.id,
    value: c.value,
    contribution: c.contribution,
  })) || [];

  // Area chart data for GA fund breakdown
  const areaData = result ? [
    { name: "Sacrificed Cargo", value: result.sacrificedValue, fill: OCEAN_BLUE },
    { name: "Salvage Costs", value: parseFloat(salvageCost) || 800000, fill: LOGISTICS_GREEN },
    { name: "Port of Refuge", value: parseFloat(portRefugeCost) || 150000, fill: "#F59E0B" },
  ] : [];

  // Timeline data
  const timelineData = result?.process.map((p, i) => ({
    step: `Step ${i + 1}`,
    duration: p.timeline,
    description: p.step.split(". ")[1],
  })) || [];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 right-10 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm"
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 px-6 py-12 md:px-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Scale className="h-4 w-4 mr-1.5" />
                Maritime Insurance Calculator
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                General Average
                <span className="block text-[#7dd3c0]">Estimator</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">
                Calculate contributions for maritime General Average events using York-Antwerp Rules. 
                Get instant estimates for vessel, freight, and cargo contributions.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Shield className="h-5 w-5 text-[#7dd3c0]" />
                  <span className="text-sm font-medium">York-Antwerp 2016</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Zap className="h-5 w-5 text-[#7dd3c0]" />
                  <span className="text-sm font-medium">Instant Calculation</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-4 py-2">
                  <Users className="h-5 w-5 text-[#7dd3c0]" />
                  <span className="text-sm font-medium">Multi-Party Analysis</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
            <Ship className="h-5 w-5" />
            General Average Parameters
          </CardTitle>
          <CardDescription>
            Enter the values for the maritime adventure and sacrifice details
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Values */}
            <div className="space-y-2">
              <Label htmlFor="vesselValue" className="flex items-center gap-2">
                <Ship className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                Vessel Value (USD)
              </Label>
              <Input
                id="vesselValue"
                type="number"
                value={vesselValue}
                onChange={(e) => setVesselValue(e.target.value)}
                placeholder="25,000,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="freightValue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Freight at Risk (USD)
              </Label>
              <Input
                id="freightValue"
                type="number"
                value={freightValue}
                onChange={(e) => setFreightValue(e.target.value)}
                placeholder="500,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bunkersValue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Bunkers/Fuel Value (USD)
              </Label>
              <Input
                id="bunkersValue"
                type="number"
                value={bunkersValue}
                onChange={(e) => setBunkersValue(e.target.value)}
                placeholder="300,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargoValue" className="flex items-center gap-2">
                <Package className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Total Cargo Value (USD)
              </Label>
              <Input
                id="cargoValue"
                type="number"
                value={cargoValue}
                onChange={(e) => setCargoValue(e.target.value)}
                placeholder="15,000,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfCargoes">Number of Cargo Interests</Label>
              <Input
                id="numberOfCargoes"
                type="number"
                value={numberOfCargoes}
                onChange={(e) => setNumberOfCargoes(e.target.value)}
                placeholder="12"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Sacrifice Type</Label>
              <Select value={sacrificeType} onValueChange={setSacrificeType}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sacrificeTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* GA Expenses */}
            <div className="space-y-2">
              <Label htmlFor="sacrificedCargoValue" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Sacrificed Cargo Value (USD)
              </Label>
              <Input
                id="sacrificedCargoValue"
                type="number"
                value={sacrificedCargoValue}
                onChange={(e) => setSacrificedCargoValue(e.target.value)}
                placeholder="2,000,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salvageCost" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Salvage Costs (USD)
              </Label>
              <Input
                id="salvageCost"
                type="number"
                value={salvageCost}
                onChange={(e) => setSalvageCost(e.target.value)}
                placeholder="800,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portRefugeCost" className="flex items-center gap-2">
                <Anchor className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Port of Refuge Expenses (USD)
              </Label>
              <Input
                id="portRefugeCost"
                type="number"
                value={portRefugeCost}
                onChange={(e) => setPortRefugeCost(e.target.value)}
                placeholder="150,000"
                className="h-11"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={calculateGeneralAverage}
              disabled={isCalculating}
              className="text-white px-8 py-6 text-lg"
              style={{ backgroundColor: OCEAN_BLUE }}
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Calculating General Average...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate General Average
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sacrifice Types Reference */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
            <FileWarning className="h-5 w-5" />
            Types of General Average Sacrifices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sacrificeTypes.map((type, index) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  sacrificeType === type.id
                    ? "border-[#0F4C81] bg-[#0F4C81]/5"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                onClick={() => setSacrificeType(type.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <h4 className="font-semibold text-sm">{type.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  York-Antwerp {type.yorkRule}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br text-white" style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${OCEAN_BLUE}dd)` }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Scale className="h-6 w-6 opacity-80" />
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Total at Risk</span>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(result.totalValue)}</p>
                  <p className="text-sm opacity-80 mt-1">Property at risk</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <AlertTriangle className="h-6 w-6 opacity-80" />
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Sacrifice</span>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(result.sacrificedValue)}</p>
                  <p className="text-sm opacity-80 mt-1">Cargo sacrificed</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Percent className="h-6 w-6 opacity-80" />
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">GA Rate</span>
                  </div>
                  <p className="text-xl font-bold">{result.gaAdjustmentRate.toFixed(2)}%</p>
                  <p className="text-sm opacity-80 mt-1">Adjustment rate</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br text-white" style={{ background: `linear-gradient(135deg, ${LOGISTICS_GREEN}, ${LOGISTICS_GREEN}dd)` }}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-6 w-6 opacity-80" />
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">GA Fund</span>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(result.totalGAfund)}</p>
                  <p className="text-sm opacity-80 mt-1">Total GA amount</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Shield className="h-6 w-6 opacity-80" />
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Guarantee</span>
                  </div>
                  <p className="text-xl font-bold">{formatCurrency(result.averageGuarantee)}</p>
                  <p className="text-sm opacity-80 mt-1">Security required</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis with 5 Tabs */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                  <BarChart3 className="h-5 w-5" />
                  General Average Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 h-12">
                    <TabsTrigger value="overview" className="flex items-center gap-1">
                      <PieChartIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="contributions" className="flex items-center gap-1">
                      <Scale className="h-4 w-4" />
                      <span className="hidden sm:inline">Contributions</span>
                    </TabsTrigger>
                    <TabsTrigger value="cargo" className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span className="hidden sm:inline">Cargo</span>
                    </TabsTrigger>
                    <TabsTrigger value="process" className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span className="hidden sm:inline">Process</span>
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="flex items-center gap-1">
                      <HelpCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">FAQs</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Contribution Pie Chart */}
                      <Card className="border border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <PieChartIcon className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                            Contribution Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={pieData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={100}
                                  paddingAngle={5}
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                                >
                                  {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* GA Fund Breakdown */}
                      <Card className="border border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                            GA Fund Breakdown
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={areaData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                                <YAxis type="category" dataKey="name" width={100} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                  {areaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quick Summary */}
                      <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Quick Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                              <div className="flex items-center gap-2 mb-2">
                                <Ship className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                                <span className="font-medium">Shipowner</span>
                              </div>
                              <p className="text-2xl font-bold">{formatCurrency(result.shipContribution)}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {((result.shipContribution / result.totalGAfund) * 100).toFixed(1)}% of GA fund
                              </p>
                            </div>
                            <div className="p-4 rounded-lg" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                                <span className="font-medium">Freight Interest</span>
                              </div>
                              <p className="text-2xl font-bold">{formatCurrency(result.freightContribution)}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {((result.freightContribution / result.totalGAfund) * 100).toFixed(1)}% of GA fund
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="h-5 w-5 text-amber-600" />
                                <span className="font-medium">Cargo Interests</span>
                              </div>
                              <p className="text-2xl font-bold">
                                {formatCurrency(result.cargoInterests.reduce((sum, c) => sum + c.contribution, 0))}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {result.cargoInterests.length} cargo owners contributing
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Contributions Tab */}
                  <TabsContent value="contributions" className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Contribution Breakdown */}
                      <div>
                        <h4 className="font-semibold mb-4">Contribution by Interest</h4>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => formatCurrency(value)} />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Summary Table */}
                      <div>
                        <h4 className="font-semibold mb-4">Contribution Summary</h4>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg border" style={{ borderColor: `${OCEAN_BLUE}30`, backgroundColor: `${OCEAN_BLUE}05` }}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Ship className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                                <span className="font-medium">Shipowner</span>
                              </div>
                              <span className="font-bold">{formatCurrency(result.shipContribution)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(parseFloat(vesselValue) || 25000000)} × {result.gaAdjustmentRate.toFixed(2)}%
                            </p>
                          </div>

                          <div className="p-4 rounded-lg border" style={{ borderColor: `${LOGISTICS_GREEN}30`, backgroundColor: `${LOGISTICS_GREEN}05` }}>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                                <span className="font-medium">Freight Interest</span>
                              </div>
                              <span className="font-bold">{formatCurrency(result.freightContribution)}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(parseFloat(freightValue) || 500000)} × {result.gaAdjustmentRate.toFixed(2)}%
                            </p>
                          </div>

                          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-amber-600" />
                                <span className="font-medium">Cargo Interests (Total)</span>
                              </div>
                              <span className="font-bold">{formatCurrency(result.cargoInterests.reduce((sum, c) => sum + c.contribution, 0))}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.cargoInterests.length} cargo interests contributing
                            </p>
                          </div>

                          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold">Total GA Fund</span>
                              <span className="font-bold text-lg">{formatCurrency(result.totalGAfund)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Cargo Interests Tab */}
                  <TabsContent value="cargo" className="pt-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold mb-4">Cargo Interest Contributions</h4>

                      {/* Bar Chart */}
                      <div className="h-72 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="value" name="Cargo Value" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="contribution" name="GA Contribution" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Detailed Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                              <th className="text-left py-3 px-4">Cargo ID</th>
                              <th className="text-left py-3 px-4">Owner</th>
                              <th className="text-right py-3 px-4">Cargo Value</th>
                              <th className="text-right py-3 px-4">Sacrificed</th>
                              <th className="text-right py-3 px-4">GA Contribution</th>
                              <th className="text-right py-3 px-4">Net Position</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.cargoInterests.map((cargo, index) => (
                              <motion.tr
                                key={cargo.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className={`border-b border-slate-100 dark:border-slate-800 ${
                                  cargo.sacrificeValue > 0 ? "bg-red-50 dark:bg-red-900/10" : ""
                                }`}
                              >
                                <td className="py-3 px-4 font-medium">{cargo.id}</td>
                                <td className="py-3 px-4">{cargo.name}</td>
                                <td className="text-right py-3 px-4">{formatCurrency(cargo.value)}</td>
                                <td className="text-right py-3 px-4">
                                  {cargo.sacrificeValue > 0 ? (
                                    <span className="text-red-500">-{formatCurrency(cargo.sacrificeValue)}</span>
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td className="text-right py-3 px-4">{formatCurrency(cargo.contribution)}</td>
                                <td className="text-right py-3 px-4">
                                  <span className={`font-medium ${
                                    cargo.sacrificeValue > cargo.contribution ? `text-[${LOGISTICS_GREEN}]` :
                                    cargo.sacrificeValue < cargo.contribution && cargo.sacrificeValue > 0 ? "text-amber-600" :
                                    "text-muted-foreground"
                                  }`}>
                                    {formatCurrency(cargo.sacrificeValue - cargo.contribution)}
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Process Tab */}
                  <TabsContent value="process" className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-4">General Average Process</h4>
                        <div className="space-y-4">
                          {result.process.map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex gap-4"
                            >
                              <div className="w-8 h-8 rounded-full text-white flex items-center justify-center shrink-0 text-sm font-medium" style={{ backgroundColor: OCEAN_BLUE }}>
                                {index + 1}
                              </div>
                              <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="font-medium">{step.step.split(". ")[1]}</p>
                                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${OCEAN_BLUE}15`, color: OCEAN_BLUE }}>
                                    {step.timeline}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-amber-800 dark:text-amber-200">Security Requirements</p>
                              <div className="mt-3 space-y-2 text-sm text-amber-700 dark:text-amber-300">
                                <div className="flex justify-between">
                                  <span>Average Guarantee Required:</span>
                                  <span className="font-medium">{formatCurrency(result.averageGuarantee)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Cash Deposit:</span>
                                  <span className="font-medium">{formatCurrency(result.depositRequired)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border" style={{ borderColor: `${OCEAN_BLUE}30`, backgroundColor: `${OCEAN_BLUE}05` }}>
                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 mt-0.5" style={{ color: OCEAN_BLUE }} />
                            <div>
                              <p className="font-medium" style={{ color: OCEAN_BLUE }}>Time Limitations</p>
                              <p className="text-sm text-muted-foreground mt-2">
                                {result.timeLimit}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="font-medium mb-3">Key Documents Required</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Bill of Lading</li>
                            <li>• Commercial Invoice</li>
                            <li>• Packing List</li>
                            <li>• Marine Insurance Certificate</li>
                            <li>• Average Bond</li>
                            <li>• Average Guarantee</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-red-800 dark:text-red-200">Exclusions from GA</p>
                              <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                                {result.exceptions.map((exc, i) => (
                                  <li key={i}>• {exc}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg border" style={{ borderColor: `${LOGISTICS_GREEN}30`, backgroundColor: `${LOGISTICS_GREEN}05` }}>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                            <div>
                              <p className="font-medium" style={{ color: LOGISTICS_GREEN }}>Key Principle (Rule A)</p>
                              <p className="text-sm text-muted-foreground mt-2">
                                &quot;There is a general average act when, and only when, any extraordinary sacrifice or expenditure
                                is intentionally and reasonably made or incurred for the common safety for the purpose of
                                preserving from peril the property involved in a common maritime adventure.&quot;
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* FAQs Tab */}
                  <TabsContent value="faq" className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                          Frequently Asked Questions
                        </h4>
                        <Accordion type="single" collapsible className="w-full space-y-2">
                          {faqs.map((faq, index) => (
                            <AccordionItem 
                              key={index} 
                              value={`item-${index}`}
                              className="border rounded-lg px-4 bg-slate-50 dark:bg-slate-800/50"
                            >
                              <AccordionTrigger className="hover:no-underline py-4">
                                <span className="text-left font-medium pr-4">{faq.question}</span>
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground pb-4">
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>

                      <div className="space-y-4">
                        <Card className="border border-slate-200 dark:border-slate-700">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <BookOpen className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                              York-Antwerp Rules
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                              {result.yorkAntwerpRules.map((rule, index) => (
                                <div
                                  key={index}
                                  className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-sm flex items-start gap-2"
                                >
                                  <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" style={{ color: LOGISTICS_GREEN }} />
                                  <span>{rule}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border border-slate-200 dark:border-slate-700">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                              <FileText className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                              Need More Help?
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                              Contact a certified average adjuster for professional assistance with your General Average case.
                            </p>
                            <Button className="w-full text-white" style={{ backgroundColor: OCEAN_BLUE }}>
                              Find an Adjuster
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static FAQ Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
            <HelpCircle className="h-5 w-5" />
            General Average FAQs
          </CardTitle>
          <CardDescription>
            Common questions about General Average and York-Antwerp Rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.slice(0, 4).map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
