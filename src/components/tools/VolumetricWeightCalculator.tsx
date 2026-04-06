"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Scale,
  Box,
  RefreshCw,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  BarChart3,
  BookOpen,
  Lightbulb,
  HelpCircle,
  TrendingUp,
  Package,
  Zap,
  DollarSign,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { volumetricDivisors, lengthUnits } from "@/lib/constants/units";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Carrier data with detailed information
const carrierData = [
  { name: "IATA", divisor: 6000, color: "#0F4C81", description: "International Air Transport Association standard", marketShare: "Industry Standard" },
  { name: "DHL", divisor: 5000, color: "#FFCC00", description: "DHL Express - Most conservative divisor", marketShare: "~35%" },
  { name: "FedEx", divisor: 6000, color: "#4D148C", description: "FedEx International - Uses IATA standard", marketShare: "~25%" },
  { name: "UPS", divisor: 6000, color: "#351C15", description: "UPS International - Uses IATA standard", marketShare: "~20%" },
  { name: "TNT", divisor: 6000, color: "#FF6600", description: "TNT Express - Now part of FedEx", marketShare: "~10%" },
];

// FAQ Data
const faqData = [
  {
    question: "What is the difference between actual weight and volumetric weight?",
    answer: "Actual weight is the physical weight of your shipment measured on a scale, expressed in kilograms or pounds. Volumetric weight, also known as dimensional weight, is a calculated weight based on the package's dimensions. It represents the amount of space a package occupies in relation to its weight. Carriers use volumetric weight because large, lightweight packages take up significant cargo space but don't generate proportional revenue based on actual weight alone. The chargeable weight is always the greater of the two, ensuring carriers are compensated for the space your shipment occupies."
  },
  {
    question: "Why do different carriers use different volumetric divisors?",
    answer: "The volumetric divisor varies by carrier based on their operational costs, aircraft configurations, and pricing strategies. DHL Express uses a divisor of 5000, which results in higher volumetric weights compared to the IATA standard of 6000. This is because DHL operates a dedicated express network with premium pricing and smaller aircraft, where space efficiency is critical. FedEx, UPS, and other major integrators typically follow the IATA standard divisor of 6000. Understanding which divisor your carrier uses is essential for accurate cost estimation and comparing rates between different service providers."
  },
  {
    question: "How can I reduce the impact of volumetric weight charges?",
    answer: "There are several effective strategies to minimize volumetric weight charges. First, optimize your packaging by using the smallest possible box that safely contains your goods - every centimeter saved reduces volumetric weight. Consider vacuum-sealing compressible items to reduce their volume. Use custom-sized packaging instead of standard boxes that may be too large. Consolidate multiple small shipments into one larger shipment when possible. Evaluate whether your goods could be shipped disassembled to reduce package dimensions. Finally, compare rates across carriers since different divisors can significantly affect your final cost, especially for lightweight but bulky items."
  },
  {
    question: "When is volumetric weight likely to exceed actual weight?",
    answer: "Volumetric weight typically exceeds actual weight for lightweight, bulky items - commonly referred to as 'voluminous cargo.' This includes products like pillows, cushions, stuffed toys, empty plastic containers, foam products, insulation materials, hollow items, and certain types of clothing. A general rule of thumb is that if your package density is less than the carrier's threshold (approximately 167 kg/m³ for a 6000 divisor or 200 kg/m³ for a 5000 divisor), you'll be charged based on volumetric weight. For example, shipping a 5 kg box of pillows measuring 60×40×40 cm would result in a volumetric weight of 16 kg with IATA's 6000 divisor, meaning you'd pay for 16 kg instead of 5 kg."
  },
  {
    question: "What is the IATA volumetric weight formula and how was it derived?",
    answer: "The IATA volumetric weight formula is: Volumetric Weight (kg) = (Length × Width × Height) / 6000, where dimensions are in centimeters. The divisor of 6000 was established based on the average density of air cargo that carriers find economically viable to transport. This represents a density factor of approximately 167 kg per cubic meter (since 1,000,000 cm³ ÷ 6000 = 166.67 kg/m³). The rationale is that cargo with lower density than this threshold takes up space that could be used for denser, more profitable shipments. The IATA standard ensures consistency across the air freight industry and provides a fair basis for pricing dimensional cargo."
  },
  {
    question: "Does volumetric weight apply to all modes of transportation?",
    answer: "Volumetric weight principles apply differently across transportation modes. Air freight has the most stringent volumetric weight calculations due to limited aircraft cargo space and higher operational costs. Express courier services (DHL, FedEx, UPS) universally apply volumetric pricing. Ocean freight uses a different approach - it considers both weight (per metric ton) and volume (per CBM), charging whichever is higher, often called 'revenue ton' or 'freight ton.' Road and rail freight may also consider volumetric factors but typically with more flexible calculations. The general principle is consistent: carriers want to ensure revenue reflects both weight and space utilization."
  },
  {
    question: "How do I calculate volumetric weight for irregular-shaped packages?",
    answer: "For irregular-shaped packages, carriers typically require you to measure the maximum dimensions at the widest points, creating an imaginary rectangular box that would contain your shipment. Measure the longest length, widest width, and tallest height, then calculate volumetric weight using these maximum dimensions. For cylindrical items like tubes or rolls, measure the full diameter as both width and height. Some carriers may have specific rules for certain irregular shapes, so it's advisable to check with your carrier. Consider repacking irregular items in rectangular packaging if it reduces the overall dimensional footprint and provides better protection during transit."
  },
];

// Tips data
const packagingTips = [
  {
    title: "Right-Size Your Packaging",
    description: "Use the smallest box that safely contains your items. Measure the actual product dimensions and add only necessary clearance for protective materials.",
    icon: Package,
  },
  {
    title: "Compress When Possible",
    description: "For compressible items like textiles, foam, or soft goods, consider vacuum sealing or compression packaging to significantly reduce volume.",
    icon: Zap,
  },
  {
    title: "Compare Carrier Divisors",
    description: "Always calculate volumetric weight using each carrier's specific divisor. DHL's 5000 divisor can result in 20% higher charges than carriers using 6000.",
    icon: Calculator,
  },
  {
    title: "Consider Consolidation",
    description: "Combining multiple shipments into one can sometimes reduce total volumetric weight by eliminating extra packaging and utilizing space more efficiently.",
    icon: TrendingUp,
  },
];

export function VolumetricWeightCalculator() {
  const [length, setLength] = useState<string>("50");
  const [width, setWidth] = useState<string>("40");
  const [height, setHeight] = useState<string>("30");
  const [unit, setUnit] = useState<keyof typeof lengthUnits>("cm");
  const [actualWeight, setActualWeight] = useState<string>("5");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [divisor, setDivisor] = useState<string>("6000");
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [copied, setCopied] = useState(false);

  // Calculate volumetric weight
  const volumetricWeight = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const d = parseFloat(divisor) || 6000;
    
    // Convert to cm if needed
    let lCm = l;
    let wCm = w;
    let hCm = h;
    
    if (unit === "m") {
      lCm = l * 100;
      wCm = w * 100;
      hCm = h * 100;
    } else if (unit === "in") {
      lCm = l * 2.54;
      wCm = w * 2.54;
      hCm = h * 2.54;
    }
    
    return (lCm * wCm * hCm) / d;
  }, [length, width, height, unit, divisor]);

  // Convert actual weight to kg
  const actualWeightKg = useMemo(() => {
    const w = parseFloat(actualWeight) || 0;
    return weightUnit === "lb" ? w * 0.453592 : w;
  }, [actualWeight, weightUnit]);

  // Chargeable weight
  const chargeableWeight = Math.max(volumetricWeight, actualWeightKg);
  const isVolumetric = volumetricWeight > actualWeightKg;
  const weightDifference = Math.abs(volumetricWeight - actualWeightKg);
  const percentageDifference = actualWeightKg > 0 ? ((volumetricWeight - actualWeightKg) / actualWeightKg * 100) : 0;

  // Calculate volumetric weight for all carriers
  const carrierComparisonData = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    
    let lCm = l;
    let wCm = w;
    let hCm = h;
    
    if (unit === "m") {
      lCm = l * 100;
      wCm = w * 100;
      hCm = h * 100;
    } else if (unit === "in") {
      lCm = l * 2.54;
      wCm = w * 2.54;
      hCm = h * 2.54;
    }
    
    return carrierData.map(carrier => ({
      ...carrier,
      volumetricWeight: (lCm * wCm * hCm) / carrier.divisor,
      chargeableWeight: Math.max((lCm * wCm * hCm) / carrier.divisor, actualWeightKg),
    }));
  }, [length, width, height, unit, actualWeightKg]);

  // Weight comparison chart data
  const weightComparisonData = [
    { name: "Actual Weight", value: actualWeightKg, fill: "var(--logistics)" },
    { name: "Volumetric Weight", value: volumetricWeight, fill: "#F59E0B" },
    { name: "Chargeable Weight", value: chargeableWeight, fill: "var(--ocean)" },
  ];

  // Cost impact data (assuming $5/kg rate)
  const costImpactData = useMemo(() => {
    const ratePerKg = 5;
    return [
      { name: "Actual Weight Cost", cost: actualWeightKg * ratePerKg },
      { name: "Chargeable Cost", cost: chargeableWeight * ratePerKg },
      { name: "Difference", cost: (chargeableWeight - actualWeightKg) * ratePerKg },
    ];
  }, [actualWeightKg, chargeableWeight]);

  // Carrier divisor chart data
  const divisorChartData = carrierData.map(c => ({
    name: c.name,
    divisor: c.divisor,
    fill: c.color,
  }));

  // Handle export
  const handleExport = () => {
    const data = {
      dimensions: { length, width, height, unit },
      actualWeight: { value: actualWeight, unit: weightUnit },
      divisor,
      results: {
        volumetricWeight: volumetricWeight.toFixed(2) + " kg",
        actualWeightKg: actualWeightKg.toFixed(2) + " kg",
        chargeableWeight: chargeableWeight.toFixed(2) + " kg",
        isVolumetric,
      },
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volumetric-weight-calculation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle share
  const handleShare = async () => {
    const shareText = `Volumetric Weight Calculation:
Dimensions: ${length} × ${width} × ${height} ${unit}
Actual Weight: ${actualWeight} ${weightUnit}
Volumetric Weight: ${volumetricWeight.toFixed(2)} kg
Chargeable Weight: ${chargeableWeight.toFixed(2)} kg
Type: ${isVolumetric ? "Volumetric" : "Actual"}

Calculated using Shiportrade.com`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)] via-[var(--ocean)]/90 to-[var(--logistics)] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-20" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm animate-pulse">
              <Plane className="h-3 w-3 mr-1" />
              Air Freight Essential
            </Badge>
            
            <h2 className="text-3xl font-bold mb-2">Volumetric Weight Calculator</h2>
            <p className="text-white/80 max-w-2xl mb-6">
              Calculate chargeable weight for air freight shipments. Understand how carriers price 
              lightweight bulky cargo and optimize your packaging for cost savings.
            </p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Box className="h-4 w-4" />
                <span className="text-sm text-white/70">Volumetric Weight</span>
              </div>
              <div className="text-2xl font-bold">{volumetricWeight.toFixed(2)} kg</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Scale className="h-4 w-4" />
                <span className="text-sm text-white/70">Actual Weight</span>
              </div>
              <div className="text-2xl font-bold">{actualWeightKg.toFixed(2)} kg</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm text-white/70">Chargeable Weight</span>
              </div>
              <div className="text-2xl font-bold">{chargeableWeight.toFixed(2)} kg</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className={`bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 ${isVolumetric ? 'ring-2 ring-amber-400' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className={`h-4 w-4 ${isVolumetric ? 'text-amber-400' : ''}`} />
                <span className="text-sm text-white/70">Weight Type</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{isVolumetric ? 'Volumetric' : 'Actual'}</span>
                {isVolumetric && <Badge className="bg-amber-500 text-xs">+{percentageDifference.toFixed(0)}%</Badge>}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Carriers</span>
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Methodology</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 py-3">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-[var(--ocean)]" />
                    Package Dimensions
                  </CardTitle>
                  <CardDescription>
                    Enter dimensions to calculate volumetric weight for air freight
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dimension Inputs */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length</Label>
                      <Input
                        id="length"
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={unit} onValueChange={(v) => setUnit(v as keyof typeof lengthUnits)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="m">m</SelectItem>
                          <SelectItem value="in">inches</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Actual Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="actualWeight">Actual Weight</Label>
                      <Input
                        id="actualWeight"
                        type="number"
                        value={actualWeight}
                        onChange={(e) => setActualWeight(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight Unit</Label>
                      <Select value={weightUnit} onValueChange={setWeightUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lb">lb</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Divisor Selection */}
                  <div className="space-y-2">
                    <Label>Volumetric Divisor</Label>
                    <Select value={divisor} onValueChange={setDivisor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(volumetricDivisors).map(([key, value]) => (
                          <SelectItem key={key} value={String(value.divisor)}>
                            {value.name} ({value.divisor})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Different carriers use different divisors for calculating volumetric weight
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center justify-between">
                    <span>Chargeable Weight</span>
                    <Badge className={isVolumetric ? "bg-amber-500" : "bg-[var(--logistics)] text-white"}>
                      {isVolumetric ? "Volumetric" : "Actual"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    key={chargeableWeight}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center mb-6"
                  >
                    <div className="text-5xl font-bold text-[var(--ocean)]">
                      {chargeableWeight.toFixed(2)} kg
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      This is the weight you&apos;ll be charged for
                    </div>
                  </motion.div>

                  {/* Weight Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className={`p-4 rounded-lg ${!isVolumetric ? 'bg-[var(--logistics)]/10 border border-[var(--logistics)]/30' : 'bg-muted/30'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Scale className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">Actual Weight</span>
                        {!isVolumetric && <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] ml-auto" />}
                      </div>
                      <div className="text-xl font-semibold">{actualWeightKg.toFixed(2)} kg</div>
                    </div>
                    <div className={`p-4 rounded-lg ${isVolumetric ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-muted/30'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Box className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">Volumetric Weight</span>
                        {isVolumetric && <AlertTriangle className="h-4 w-4 text-amber-500 ml-auto" />}
                      </div>
                      <div className="text-xl font-semibold">{volumetricWeight.toFixed(2)} kg</div>
                    </div>
                  </div>

                  {isVolumetric && (
                    <div className="p-3 bg-amber-500/10 rounded-lg text-sm text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      You&apos;re being charged for volume, not actual weight. Consider optimizing packaging.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Calculation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Calculation Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm space-y-2">
                    <div>
                      <span className="text-[var(--ocean)]">Volumetric Weight</span> = (L × W × H) ÷ Divisor
                    </div>
                    <div className="text-muted-foreground">
                      = ({length} × {width} × {height}) ÷ {divisor}
                    </div>
                    <div>
                      = <span className="text-[var(--logistics)]">{volumetricWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="pt-2 border-t border-border mt-2">
                      <span className="text-[var(--ocean)]">Chargeable Weight</span> = Max(Volumetric, Actual)
                    </div>
                    <div>
                      = Max({volumetricWeight.toFixed(2)}, {actualWeightKg.toFixed(2)}) = <strong>{chargeableWeight.toFixed(2)} kg</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" /> : <Share2 className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => { setLength("50"); setWidth("40"); setHeight("30"); setActualWeight("5"); }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Weight Comparison Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weight Comparison Chart</CardTitle>
              <CardDescription>Visual comparison of actual, volumetric, and chargeable weights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weightComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" unit=" kg" className="text-xs" />
                    <YAxis type="category" dataKey="name" className="text-xs" width={120} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(2)} kg`, 'Weight']}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Carrier Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Carrier Divisor Comparison
              </CardTitle>
              <CardDescription>
                Compare how different carriers calculate volumetric weight with their specific divisors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Divisor Comparison Chart */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisorChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis reversed domain={[4000, 7000]} className="text-xs" label={{ value: 'Divisor', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Divisor']}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="divisor" radius={[4, 4, 0, 0]}>
                      {divisorChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Separator />

              {/* Volumetric Weight by Carrier */}
              <div>
                <h4 className="font-semibold mb-4">Volumetric Weight by Carrier (Your Shipment)</h4>
                <div className="grid md:grid-cols-5 gap-4">
                  {carrierComparisonData.map((carrier) => (
                    <Card key={carrier.name} className="relative overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 right-0 h-1"
                        style={{ backgroundColor: carrier.color }}
                      />
                      <CardContent className="pt-4">
                        <div className="font-semibold mb-1">{carrier.name}</div>
                        <div className="text-2xl font-bold mb-2" style={{ color: carrier.color }}>
                          {carrier.volumetricWeight.toFixed(2)} kg
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Divisor: {carrier.divisor}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="mt-2 text-xs"
                          style={{ 
                            borderColor: carrier.chargeableWeight > actualWeightKg ? '#F59E0B' : 'var(--logistics)',
                            color: carrier.chargeableWeight > actualWeightKg ? '#F59E0B' : 'var(--logistics)'
                          }}
                        >
                          {carrier.chargeableWeight > actualWeightKg ? 'Volumetric' : 'Actual'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Carrier Details Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Carrier</th>
                      <th className="text-left py-3 px-4 font-semibold">Divisor</th>
                      <th className="text-left py-3 px-4 font-semibold">Volumetric Weight</th>
                      <th className="text-left py-3 px-4 font-semibold">Chargeable Weight</th>
                      <th className="text-left py-3 px-4 font-semibold">Market Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrierComparisonData.map((carrier) => (
                      <tr key={carrier.name} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: carrier.color }} />
                            <span className="font-medium">{carrier.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{carrier.divisor}</td>
                        <td className="py-3 px-4">{carrier.volumetricWeight.toFixed(2)} kg</td>
                        <td className="py-3 px-4 font-semibold">{carrier.chargeableWeight.toFixed(2)} kg</td>
                        <td className="py-3 px-4 text-muted-foreground">{carrier.marketShare}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Cost Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cost Impact Analysis</CardTitle>
              <CardDescription>Based on estimated rate of $5/kg</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costImpactData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="cost" fill="var(--ocean)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Methodology */}
        <TabsContent value="methodology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Understanding Volumetric Weight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* What is Volumetric Weight */}
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-[var(--ocean)]">What is Volumetric Weight?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Volumetric weight, also known as dimensional weight, is a theoretical weight value calculated from the dimensions of a package rather than its actual mass. This concept was introduced by the air freight industry to ensure that lightweight but bulky shipments are priced fairly based on the space they occupy in aircraft cargo holds. In international shipping, cargo space is a precious and limited resource, and carriers need to maximize revenue from each flight. A large box of feathers might weigh only a few kilograms but could take up space that could otherwise hold hundreds of kilograms of denser cargo. Without volumetric weight pricing, carriers would lose money on such shipments, as they would be paid only for the actual weight while sacrificing valuable cargo capacity.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The volumetric weight calculation allows carriers to charge based on either the actual weight or the volumetric weight, whichever is greater. This ensures that shippers are incentivized to optimize their packaging and use space efficiently. For businesses engaged in international trade, understanding volumetric weight is crucial for accurate cost estimation, competitive pricing, and maintaining healthy profit margins on shipped goods.
                </p>
              </div>

              <Separator />

              {/* Formula Explanation */}
              <div>
                <h3 className="text-xl font-semibold text-[var(--ocean)] mb-4">The Volumetric Weight Formula</h3>
                <div className="bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 rounded-xl p-6 border border-[var(--ocean)]/20">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-mono font-bold text-[var(--ocean)]">
                      VW = (L × W × H) ÷ D
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <div className="font-bold text-[var(--ocean)]">VW</div>
                      <div className="text-muted-foreground">Volumetric Weight (kg)</div>
                    </div>
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <div className="font-bold text-[var(--ocean)]">L, W, H</div>
                      <div className="text-muted-foreground">Dimensions (cm)</div>
                    </div>
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <div className="font-bold text-[var(--ocean)]">D</div>
                      <div className="text-muted-foreground">Divisor (5000-6000)</div>
                    </div>
                    <div className="text-center p-3 bg-background/50 rounded-lg">
                      <div className="font-bold text-[var(--ocean)]">Result</div>
                      <div className="text-muted-foreground">Weight in kg</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Example Calculation:</h4>
                  <p className="text-muted-foreground mb-2">
                    A package measuring 60 cm × 40 cm × 30 cm with IATA divisor of 6000:
                  </p>
                  <div className="font-mono text-sm bg-background p-3 rounded">
                    VW = (60 × 40 × 30) ÷ 6000 = 72,000 ÷ 6000 = <strong className="text-[var(--logistics)]">12 kg</strong>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Why Carriers Use Volumetric Weight */}
              <div>
                <h3 className="text-xl font-semibold text-[var(--ocean)] mb-4">Why Do Carriers Use Volumetric Weight?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                      <Plane className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Limited Cargo Space</h4>
                      <p className="text-sm text-muted-foreground">
                        Aircraft have limited cargo capacity both by weight and volume. Volumetric pricing ensures carriers maximize revenue from available space.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-[var(--logistics)]/10 flex items-center justify-center shrink-0">
                      <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Fair Pricing Model</h4>
                      <p className="text-sm text-muted-foreground">
                        It creates a fair pricing system where shippers pay for the resources they actually use, whether it&apos;s weight capacity or volume capacity.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Encourages Efficiency</h4>
                      <p className="text-sm text-muted-foreground">
                        The system incentivizes shippers to optimize packaging, reducing wasted space and making global logistics more efficient overall.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Divisor Explanation */}
              <div>
                <h3 className="text-xl font-semibold text-[var(--ocean)] mb-4">Understanding the Divisor</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The divisor is the key factor that determines how your package&apos;s dimensions translate to volumetric weight. A lower divisor results in a higher volumetric weight, meaning you pay more for the same size package. The IATA standard divisor of 6000 is based on an industry-agreed density factor of approximately 167 kg per cubic meter. This represents the average density at which air cargo becomes economically viable for carriers to transport.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[var(--ocean)]">6000</div>
                        <div className="text-sm text-muted-foreground mb-2">IATA Standard</div>
                        <div className="text-xs bg-muted rounded p-2">
                          Used by FedEx, UPS, TNT, and most airlines. Results in lower volumetric weight.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-500">5000</div>
                        <div className="text-sm text-muted-foreground mb-2">DHL Express</div>
                        <div className="text-xs bg-muted rounded p-2">
                          More conservative divisor. Results in 20% higher volumetric weight than IATA.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--ocean)]" />
                Best Practices & Tips
              </CardTitle>
              <CardDescription>
                Strategies to optimize your packaging and minimize shipping costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tips Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {packagingTips.map((tip, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)]" />
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                          <tip.icon className="h-5 w-5 text-[var(--ocean)]" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">{tip.title}</h4>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Packaging Optimization */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Tips to Optimize Packaging</h3>
                <div className="space-y-3">
                  {[
                    "Measure products accurately before selecting packaging - even a 1cm reduction in each dimension can save significant costs",
                    "Use custom-fitted boxes for high-volume shipments - the initial investment pays off quickly in reduced shipping costs",
                    "Consider vacuum-sealing for textiles, bedding, and other compressible items - can reduce volume by 50-70%",
                    "Disassemble products when possible - shipping items flat often reduces dimensional weight significantly",
                    "Use protective materials strategically - bubble wrap in corners only vs full wrapping can save volume",
                    "Stack items efficiently - consider how products can be nested or stacked to minimize dead space",
                    "Test different box configurations - sometimes using two smaller boxes is cheaper than one large box",
                    "Work with your carrier - some offer packaging audits and recommendations for optimization",
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Common Mistakes */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Common Mistakes to Avoid</h3>
                <div className="space-y-3">
                  {[
                    { mistake: "Using standard box sizes without measuring the actual product", impact: "Can add 20-40% unnecessary volume" },
                    { mistake: "Ignoring carrier-specific divisors when comparing rates", impact: "DHL can be 20% more expensive for voluminous cargo" },
                    { mistake: "Not considering dimensional weight for international shipments", impact: "Unexpected chargeable weight increases" },
                    { mistake: "Over-packaging for protection when less would suffice", impact: "Paying for air instead of product" },
                    { mistake: "Failing to consolidate shipments when possible", impact: "Multiple minimum charges and excess packaging" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium text-sm">{item.mistake}</div>
                        <div className="text-xs text-red-600 dark:text-red-400">{item.impact}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Indicators */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Shipment Efficiency</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Volume Efficiency</span>
                      <span className="text-sm font-semibold">
                        {actualWeightKg > 0 ? Math.min(100, (actualWeightKg / chargeableWeight) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                    <Progress value={actualWeightKg > 0 ? Math.min(100, (actualWeightKg / chargeableWeight) * 100) : 0} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher is better - 100% means you&apos;re not paying for extra volume
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Cost Efficiency</span>
                      <span className="text-sm font-semibold">
                        {chargeableWeight > 0 ? Math.max(0, 100 - (weightDifference / chargeableWeight * 100)).toFixed(0) : 100}%
                      </span>
                    </div>
                    <Progress value={chargeableWeight > 0 ? Math.max(0, 100 - (weightDifference / chargeableWeight * 100)) : 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Measures how close your chargeable weight is to actual weight
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about volumetric weight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-[var(--ocean)]">{index + 1}</span>
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pl-11 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-3xl font-bold text-[var(--ocean)]">6000</div>
                  <div className="text-sm text-muted-foreground">IATA Standard Divisor</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-3xl font-bold text-amber-500">5000</div>
                  <div className="text-sm text-muted-foreground">DHL Express Divisor</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-3xl font-bold text-[var(--logistics)]">167</div>
                  <div className="text-sm text-muted-foreground">kg/m³ Density Threshold</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
