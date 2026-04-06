"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Package,
  Layers,
  Ruler,
  Weight,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Box,
  Grid3X3,
  ArrowUpRight,
  AlertOctagon,
  Settings,
  BarChart3,
  Truck,
  Warehouse,
  Container,
  Building2,
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
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
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Pallet Types Definition
const PALLET_TYPES = {
  euro: {
    name: "Euro Pallet",
    code: "EUR",
    length: 1.2,
    width: 0.8,
    height: 0.144,
    maxWeight: 1500,
    description: "Standard European pallet (800x1200mm)",
    color: OCEAN_BLUE,
  },
  us: {
    name: "Standard US Pallet",
    code: "GMA",
    length: 1.219,
    width: 1.016,
    height: 0.152,
    maxWeight: 2000,
    description: "North American standard (48x40 inches)",
    color: LOGISTICS_GREEN,
  },
  asia: {
    name: "Asian Pallet",
    code: "JIS",
    length: 1.1,
    width: 1.1,
    height: 0.144,
    maxWeight: 1000,
    description: "Japanese Industrial Standard (1100x1100mm)",
    color: "#F59E0B",
  },
};

// Height Limits
const HEIGHT_LIMITS = {
  standard: { max: 1.8, name: "Standard Warehouse", description: "Typical racking height", icon: Warehouse },
  highBay: { max: 2.4, name: "High-Bay Warehouse", description: "Tall racking systems", icon: Building2 },
  container: { max: 2.59, name: "Container Load", description: "40' High Cube container", icon: Container },
  truck: { max: 2.7, name: "Truck Load", description: "Standard truck height", icon: Truck },
};

// Stacking Pattern Options
const STACKING_PATTERNS = {
  column: { name: "Column Stack", description: "Direct stacking, maximum stability" },
  brick: { name: "Brick Pattern", description: "Interlocking pattern, better stability" },
  pinwheel: { name: "Pinwheel", description: "Rotated pattern for odd-shaped cartons" },
  optimal: { name: "Optimal Mix", description: "AI-recommended pattern" },
};

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is pallet utilization and why is it important?",
    answer: "Pallet utilization measures how efficiently the pallet surface area is being used. Higher utilization (ideally 80%+) means you're maximizing shipping efficiency and reducing costs per unit shipped. Low utilization results in wasted space and higher transportation costs.",
  },
  {
    question: "How do I choose the right pallet type?",
    answer: "Select pallets based on your shipping region (Euro for Europe, GMA for North America, JIS for Asia), weight requirements, and warehouse constraints. Consider the pallet dimensions relative to your carton sizes to maximize floor utilization.",
  },
  {
    question: "What is the maximum safe stacking height?",
    answer: "Safe stacking height depends on carton stability, weight distribution, and storage environment. Generally, maintain a height-to-base ratio under 6:1. For warehouse storage, standard height is 1.8m; for containers, up to 2.59m; for trucks, up to 2.7m.",
  },
  {
    question: "When should I allow overhang?",
    answer: "Overhang should be used cautiously when cartons slightly exceed pallet dimensions. Limit overhang to 5% maximum and ensure the load is properly secured with stretch wrap. Overhang can cause handling issues and product damage.",
  },
  {
    question: "What stacking pattern should I use?",
    answer: "Column stacking is best for heavy or fragile items. Brick pattern provides better stability for transport. Pinwheel works well for odd-shaped cartons. Optimal Mix uses AI to recommend the best pattern based on your configuration.",
  },
  {
    question: "How is pallet weight capacity calculated?",
    answer: "Pallet weight capacity = (Number of cartons x Carton weight) + Pallet weight (typically 25kg). Never exceed the pallet's rated capacity (1000-2000kg depending on type). Overloading causes structural failure and safety hazards.",
  },
  {
    question: "What affects load stability?",
    answer: "Key factors include: carton aspect ratio (should be under 3:1), stack height relative to base dimensions, floor utilization (above 70% is stable), weight distribution, and proper securing methods like stretch wrapping or strapping.",
  },
  {
    question: "How can I improve my pallet configuration?",
    answer: "To optimize: 1) Choose pallets that match your carton dimensions, 2) Test different carton orientations, 3) Use interlocking stacking patterns, 4) Ensure weight stays within limits, 5) Aim for 80%+ floor utilization, 6) Consider custom carton sizes.",
  },
];

interface PalletConfiguration {
  palletType: keyof typeof PALLET_TYPES;
  heightLimit: keyof typeof HEIGHT_LIMITS;
  cartonLength: number;
  cartonWidth: number;
  cartonHeight: number;
  cartonWeight: number;
  dimensionUnit: "mm" | "cm" | "in";
  weightUnit: "kg" | "lb";
  stackingPattern: keyof typeof STACKING_PATTERNS;
  allowOverhang: boolean;
  maxOverhangPercent: number;
}

interface CalculationResult {
  cartonsPerLayer: number;
  layersPerPallet: number;
  totalCartons: number;
  totalWeight: number;
  palletUtilization: number;
  volumeUtilization: number;
  heightUtilization: number;
  stackingHeight: number;
  isStable: boolean;
  stabilityScore: number;
  warnings: string[];
  suggestions: string[];
  optimalOrientation: { length: number; width: number };
  patternEfficiency: number;
}

export function PalletConfigurationTool() {
  const [activeTab, setActiveTab] = useState("configuration");
  const [config, setConfig] = useState<PalletConfiguration>({
    palletType: "euro",
    heightLimit: "standard",
    cartonLength: 400,
    cartonWidth: 300,
    cartonHeight: 250,
    cartonWeight: 5,
    dimensionUnit: "mm",
    weightUnit: "kg",
    stackingPattern: "optimal",
    allowOverhang: false,
    maxOverhangPercent: 5,
  });

  // Unit conversion helpers
  const convertToMeters = (value: number, unit: string): number => {
    switch (unit) {
      case "mm":
        return value / 1000;
      case "cm":
        return value / 100;
      case "in":
        return value * 0.0254;
      default:
        return value;
    }
  };

  const convertToKg = (value: number, unit: string): number => {
    return unit === "lb" ? value * 0.453592 : value;
  };

  // Main calculation
  const result = useMemo((): CalculationResult => {
    const pallet = PALLET_TYPES[config.palletType];
    const heightLimit = HEIGHT_LIMITS[config.heightLimit];

    // Convert dimensions to meters
    const cartonL = convertToMeters(config.cartonLength, config.dimensionUnit);
    const cartonW = convertToMeters(config.cartonWidth, config.dimensionUnit);
    const cartonH = convertToMeters(config.cartonHeight, config.dimensionUnit);
    const cartonWt = convertToKg(config.cartonWeight, config.weightUnit);

    // Calculate optimal orientation
    const palletArea = pallet.length * pallet.width;

    // Try both orientations
    const orientation1 = {
      length: cartonL,
      width: cartonW,
      fitLength: Math.floor(pallet.length / cartonL),
      fitWidth: Math.floor(pallet.width / cartonW),
    };

    const orientation2 = {
      length: cartonW,
      width: cartonL,
      fitLength: Math.floor(pallet.length / cartonW),
      fitWidth: Math.floor(pallet.width / cartonL),
    };

    const cartonsOrientation1 = orientation1.fitLength * orientation1.fitWidth;
    const cartonsOrientation2 = orientation2.fitLength * orientation2.fitWidth;

    // Choose best orientation
    let optimalOrientation;
    let cartonsPerLayer;

    if (cartonsOrientation1 >= cartonsOrientation2) {
      optimalOrientation = { length: cartonL, width: cartonW };
      cartonsPerLayer = cartonsOrientation1;
    } else {
      optimalOrientation = { length: cartonW, width: cartonL };
      cartonsPerLayer = cartonsOrientation2;
    }

    // Apply overhang if allowed
    if (config.allowOverhang && cartonsPerLayer === 0) {
      const overhangFactor = 1 + config.maxOverhangPercent / 100;
      const extendedLength = pallet.length * overhangFactor;
      const extendedWidth = pallet.width * overhangFactor;
      cartonsPerLayer = Math.floor(extendedLength / optimalOrientation.length) *
                        Math.floor(extendedWidth / optimalOrientation.width);
    }

    // Calculate layers
    const maxStackingHeight = heightLimit.max - pallet.height;
    const layersPerPallet = Math.floor(maxStackingHeight / cartonH);
    const stackingHeight = layersPerPallet * cartonH + pallet.height;

    // Total calculations
    const totalCartons = cartonsPerLayer * layersPerPallet;
    const totalWeight = totalCartons * cartonWt + 25;

    // Utilization calculations
    const cartonVolume = optimalOrientation.length * optimalOrientation.width * cartonH;
    const usedPalletArea = cartonsPerLayer * optimalOrientation.length * optimalOrientation.width;
    const palletVolume = pallet.length * pallet.width * maxStackingHeight;

    const volumeUtilization = palletVolume > 0 ? (totalCartons * cartonVolume / palletVolume) * 100 : 0;
    const palletUtilization = (usedPalletArea / palletArea) * 100;
    const heightUtilization = (stackingHeight / heightLimit.max) * 100;

    // Stability check
    const aspectRatio = Math.max(cartonL, cartonW) / Math.min(cartonL, cartonW);
    const stackHeightRatio = stackingHeight / Math.min(cartonL, cartonW);

    const stabilityFactors = {
      aspectRatio: aspectRatio <= 3,
      heightRatio: stackHeightRatio <= 8,
      weightLimit: totalWeight <= pallet.maxWeight,
      layerCoverage: palletUtilization >= 70,
    };

    const stabilityScore = Object.values(stabilityFactors).filter(Boolean).length / 4 * 100;
    const isStable = stabilityScore >= 75 && totalWeight <= pallet.maxWeight;

    // Warnings and suggestions
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (totalWeight > pallet.maxWeight) {
      warnings.push(`Total weight (${totalWeight.toFixed(1)}kg) exceeds pallet capacity (${pallet.maxWeight}kg)`);
      suggestions.push("Reduce layers or use a higher-capacity pallet type");
    }

    if (palletUtilization < 60) {
      warnings.push(`Low floor utilization (${palletUtilization.toFixed(1)}%)`);
      suggestions.push("Consider different carton dimensions or pallet type");
    }

    if (stackHeightRatio > 6) {
      warnings.push("High stack may be unstable during transport");
      suggestions.push("Use stretch wrapping or consider reducing layers");
    }

    if (!stabilityFactors.aspectRatio) {
      warnings.push("Carton aspect ratio may cause stacking instability");
    }

    if (cartonsPerLayer === 0) {
      warnings.push("Carton dimensions exceed pallet dimensions");
      suggestions.push("Use a larger pallet type or enable overhang option");
    }

    if (isStable && palletUtilization >= 80) {
      suggestions.push("Excellent configuration! Consider this layout for optimal efficiency.");
    }

    // Pattern efficiency based on stacking pattern
    const patternEfficiencyMap = {
      column: 1.0,
      brick: 0.95,
      pinwheel: 0.9,
      optimal: Math.max(0.92, 1 - (100 - palletUtilization) / 200),
    };

    return {
      cartonsPerLayer,
      layersPerPallet,
      totalCartons,
      totalWeight,
      palletUtilization,
      volumeUtilization,
      heightUtilization,
      stackingHeight,
      isStable,
      stabilityScore,
      warnings,
      suggestions,
      optimalOrientation,
      patternEfficiency: patternEfficiencyMap[config.stackingPattern] * 100,
    };
  }, [config]);

  // Chart data
  const utilizationData = [
    { name: "Floor", value: result.palletUtilization, fill: OCEAN_BLUE },
    { name: "Volume", value: result.volumeUtilization, fill: LOGISTICS_GREEN },
    { name: "Height", value: result.heightUtilization, fill: "#F59E0B" },
  ];

  const capacityData = [
    { name: "Used Weight", value: result.totalWeight, fill: OCEAN_BLUE },
    { name: "Available", value: Math.max(0, PALLET_TYPES[config.palletType].maxWeight - result.totalWeight), fill: "#E5E7EB" },
  ];

  // Radar chart data for performance metrics
  const radarData = [
    { metric: "Floor Util.", value: result.palletUtilization, fullMark: 100 },
    { metric: "Volume Util.", value: result.volumeUtilization, fullMark: 100 },
    { metric: "Stability", value: result.stabilityScore, fullMark: 100 },
    { metric: "Pattern Eff.", value: result.patternEfficiency, fullMark: 100 },
    { metric: "Height Util.", value: result.heightUtilization, fullMark: 100 },
  ];

  // Trend data for efficiency comparison
  const trendData = [
    { name: "Floor", current: result.palletUtilization, optimal: 85 },
    { name: "Volume", current: result.volumeUtilization, optimal: 80 },
    { name: "Weight", current: (result.totalWeight / PALLET_TYPES[config.palletType].maxWeight) * 100, optimal: 75 },
    { name: "Stability", current: result.stabilityScore, optimal: 90 },
  ];

  const updateConfig = (key: keyof PalletConfiguration, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        <div 
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, #1a5c94 50%, ${LOGISTICS_GREEN} 100%)` }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <Package className="h-8 w-8 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1">
                Professional Tool
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Pallet Configuration Tool
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
              Optimize your pallet loading with intelligent configuration analysis. 
              Calculate carton capacity, utilization rates, and stability scores for efficient logistics operations.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-white/80">
                <Target className="h-5 w-5" />
                <span>Optimize Space</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <TrendingUp className="h-5 w-5" />
                <span>Maximize Efficiency</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Zap className="h-5 w-5" />
                <span>Real-time Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <div 
            className="absolute top-0 left-0 w-1 h-full" 
            style={{ backgroundColor: OCEAN_BLUE }}
          />
          <CardContent className="p-4 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cartons/Layer</p>
                <p className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>
                  {result.cartonsPerLayer}
                </p>
              </div>
              <Grid3X3 className="h-8 w-8 opacity-20" style={{ color: OCEAN_BLUE }} />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <div 
            className="absolute top-0 left-0 w-1 h-full" 
            style={{ backgroundColor: LOGISTICS_GREEN }}
          />
          <CardContent className="p-4 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cartons</p>
                <p className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                  {result.totalCartons}
                </p>
              </div>
              <Package className="h-8 w-8 opacity-20" style={{ color: LOGISTICS_GREEN }} />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <div 
            className="absolute top-0 left-0 w-1 h-full" 
            style={{ backgroundColor: OCEAN_BLUE }}
          />
          <CardContent className="p-4 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Weight</p>
                <p className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>
                  {result.totalWeight.toFixed(0)} kg
                </p>
              </div>
              <Weight className="h-8 w-8 opacity-20" style={{ color: OCEAN_BLUE }} />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
          <div 
            className="absolute top-0 left-0 w-1 h-full" 
            style={{ backgroundColor: result.isStable ? LOGISTICS_GREEN : "#EF4444" }}
          />
          <CardContent className="p-4 pl-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stability</p>
                <p className="text-2xl font-bold" style={{ color: result.isStable ? LOGISTICS_GREEN : "#EF4444" }}>
                  {result.stabilityScore.toFixed(0)}%
                </p>
              </div>
              {result.isStable ? (
                <CheckCircle2 className="h-8 w-8 opacity-20" style={{ color: LOGISTICS_GREEN }} />
              ) : (
                <AlertTriangle className="h-8 w-8 opacity-20 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="configuration" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Configuration</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Results</span>
          </TabsTrigger>
          <TabsTrigger value="visualization" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            <span className="hidden sm:inline">3D View</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQs</span>
          </TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6 mt-6">
          {/* Pallet Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Pallet Type Selection
              </CardTitle>
              <CardDescription>Choose the pallet type for your configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(PALLET_TYPES).map(([key, pallet]) => (
                  <div
                    key={key}
                    onClick={() => updateConfig("palletType", key)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      config.palletType === key
                        ? "border-[var(--ocean)] bg-[var(--ocean)]/5 shadow-md"
                        : "border-border hover:border-[var(--ocean)]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold">{pallet.name}</p>
                      <Badge style={{ backgroundColor: pallet.color }} className="text-white">
                        {pallet.code}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{pallet.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Dims:</span>{" "}
                        {pallet.length}m x {pallet.width}m
                      </div>
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Max Load:</span>{" "}
                        {pallet.maxWeight}kg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Carton Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Carton Dimensions
              </CardTitle>
              <CardDescription>Enter the dimensions and weight of your carton</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Unit Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dimension Unit</Label>
                  <Select
                    value={config.dimensionUnit}
                    onValueChange={(v) => updateConfig("dimensionUnit", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">Millimeters (mm)</SelectItem>
                      <SelectItem value="cm">Centimeters (cm)</SelectItem>
                      <SelectItem value="in">Inches (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Weight Unit</Label>
                  <Select
                    value={config.weightUnit}
                    onValueChange={(v) => updateConfig("weightUnit", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Dimensions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Length ({config.dimensionUnit})</Label>
                  <Input
                    type="number"
                    value={config.cartonLength}
                    onChange={(e) => updateConfig("cartonLength", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Width ({config.dimensionUnit})</Label>
                  <Input
                    type="number"
                    value={config.cartonWidth}
                    onChange={(e) => updateConfig("cartonWidth", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Height ({config.dimensionUnit})</Label>
                  <Input
                    type="number"
                    value={config.cartonHeight}
                    onChange={(e) => updateConfig("cartonHeight", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Weight ({config.weightUnit})</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={config.cartonWeight}
                    onChange={(e) => updateConfig("cartonWeight", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Carton Volume & Weight Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Carton Volume</p>
                  <p className="text-xl font-bold" style={{ color: OCEAN_BLUE }}>
                    {(
                      convertToMeters(config.cartonLength, config.dimensionUnit) *
                      convertToMeters(config.cartonWidth, config.dimensionUnit) *
                      convertToMeters(config.cartonHeight, config.dimensionUnit) *
                      1000000
                    ).toFixed(0)}{" "}
                    cm3
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Carton Weight</p>
                  <p className="text-xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                    {config.cartonWeight} {config.weightUnit}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stacking Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Stacking Configuration
              </CardTitle>
              <CardDescription>Configure stacking pattern and height limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Height Limit */}
              <div>
                <Label>Maximum Height Limit</Label>
                <Select
                  value={config.heightLimit}
                  onValueChange={(v) => updateConfig("heightLimit", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(HEIGHT_LIMITS).map(([key, limit]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <limit.icon className="h-4 w-4" />
                          {limit.name} ({limit.max}m) - {limit.description}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Height Limit Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(HEIGHT_LIMITS).map(([key, limit]) => {
                  const Icon = limit.icon;
                  return (
                    <div
                      key={key}
                      onClick={() => updateConfig("heightLimit", key)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        config.heightLimit === key
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                          : "border-border hover:border-[var(--ocean)]/30"
                      }`}
                    >
                      <Icon className="h-5 w-5 mb-2" style={{ color: OCEAN_BLUE }} />
                      <p className="text-sm font-medium">{limit.name}</p>
                      <p className="text-xs text-muted-foreground">{limit.max}m max</p>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Stacking Pattern */}
              <div>
                <Label>Stacking Pattern</Label>
                <Select
                  value={config.stackingPattern}
                  onValueChange={(v) => updateConfig("stackingPattern", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STACKING_PATTERNS).map(([key, pattern]) => (
                      <SelectItem key={key} value={key}>
                        {pattern.name} - {pattern.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Overhang Option */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  <div>
                    <p className="font-medium">Allow Overhang</p>
                    <p className="text-sm text-muted-foreground">
                      Permit cartons to slightly extend beyond pallet edges
                    </p>
                  </div>
                </div>
                <Switch
                  checked={config.allowOverhang}
                  onCheckedChange={(v) => updateConfig("allowOverhang", v)}
                />
              </div>

              {config.allowOverhang && (
                <div className="space-y-2 p-4 bg-muted/30 rounded-xl">
                  <Label>Maximum Overhang: {config.maxOverhangPercent}%</Label>
                  <Slider
                    value={[config.maxOverhangPercent]}
                    onValueChange={(v) => updateConfig("maxOverhangPercent", v[0])}
                    min={1}
                    max={15}
                    step={1}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="overflow-hidden">
              <div className="h-1" style={{ backgroundColor: OCEAN_BLUE }} />
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Grid3X3 className="h-3 w-3" />
                  Cartons per Layer
                </p>
                <p className="text-3xl font-bold" style={{ color: OCEAN_BLUE }}>
                  {result.cartonsPerLayer}
                </p>
                <Progress value={result.palletUtilization} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {result.palletUtilization.toFixed(0)}% floor utilization
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1" style={{ backgroundColor: LOGISTICS_GREEN }} />
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  Layers per Pallet
                </p>
                <p className="text-3xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                  {result.layersPerPallet}
                </p>
                <Progress value={result.heightUtilization} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {result.stackingHeight.toFixed(2)}m total height
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1" style={{ backgroundColor: OCEAN_BLUE }} />
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Total Cartons
                </p>
                <p className="text-3xl font-bold">{result.totalCartons}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Per pallet configuration
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-1" style={{ backgroundColor: LOGISTICS_GREEN }} />
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Weight className="h-3 w-3" />
                  Total Weight
                </p>
                <p className="text-3xl font-bold">{result.totalWeight.toFixed(0)} kg</p>
                <Progress
                  value={(result.totalWeight / PALLET_TYPES[config.palletType].maxWeight) * 100}
                  className="mt-2 h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max: {PALLET_TYPES[config.palletType].maxWeight}kg
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stability Check */}
          <Card className={result.isStable ? "border-green-200 dark:border-green-900" : "border-red-200 dark:border-red-900"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.isStable ? (
                  <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                Stability Check
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <Progress value={result.stabilityScore} className="h-3" />
                </div>
                <Badge
                  className="text-white"
                  style={{ backgroundColor: result.isStable ? LOGISTICS_GREEN : "#EF4444" }}
                >
                  {result.stabilityScore.toFixed(0)}%
                </Badge>
              </div>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <div className="space-y-2 mb-4">
                  {result.warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900"
                    >
                      <AlertOctagon className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-red-700 dark:text-red-400">{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="space-y-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900"
                    >
                      <ArrowUpRight className="h-4 w-4 mt-0.5 shrink-0" style={{ color: OCEAN_BLUE }} />
                      <span className="text-sm text-muted-foreground">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Utilization Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilization Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={utilizationData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {utilizationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weight Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={capacityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(0)}kg`}
                      >
                        {capacityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)} kg`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimal Orientation Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Optimal Carton Orientation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">Length Direction</p>
                  <p className="text-xl font-bold" style={{ color: OCEAN_BLUE }}>
                    {(result.optimalOrientation.length * 1000).toFixed(0)} mm
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">Width Direction</p>
                  <p className="text-xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                    {(result.optimalOrientation.width * 1000).toFixed(0)} mm
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">Pattern Efficiency</p>
                  <p className="text-xl font-bold">{result.patternEfficiency.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3D Visualization Tab */}
        <TabsContent value="visualization" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                3D Pallet Visualization
              </CardTitle>
              <CardDescription>Visual representation of pallet configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-2xl relative overflow-hidden">
                {/* Pallet Base */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[80%] h-[60%]">
                    {/* Pallet Deck */}
                    <div
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-lg"
                      style={{
                        width: "100%",
                        height: "15%",
                        backgroundColor: `${OCEAN_BLUE}20`,
                        border: `2px solid ${OCEAN_BLUE}40`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium" style={{ color: OCEAN_BLUE }}>
                          {PALLET_TYPES[config.palletType].name}
                        </span>
                      </div>
                    </div>

                    {/* Carton Layers */}
                    {result.layersPerPallet > 0 && (
                      <div
                        className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2"
                        style={{ width: "90%" }}
                      >
                        {Array.from({ length: Math.min(result.layersPerPallet, 6) }).map((_, layerIdx) => (
                          <div
                            key={layerIdx}
                            className="rounded-sm mb-0.5 flex items-center justify-center"
                            style={{
                              height: `${(result.stackingHeight / HEIGHT_LIMITS[config.heightLimit].max) * 70 / Math.min(result.layersPerPallet, 6)}%`,
                              backgroundColor: `${LOGISTICS_GREEN}40`,
                              border: `1px solid ${LOGISTICS_GREEN}60`,
                            }}
                          >
                            <span className="text-xs text-white font-medium">
                              {result.cartonsPerLayer} cartons
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Height Indicator */}
                    <div className="absolute right-0 top-0 bottom-[15%] flex flex-col items-center justify-center">
                      <div className="h-full w-0.5 bg-border relative">
                        <div
                          className="absolute bottom-0 left-0 w-0.5"
                          style={{
                            height: `${result.heightUtilization}%`,
                            backgroundColor: OCEAN_BLUE,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {result.stackingHeight.toFixed(2)}m
                      </span>
                    </div>

                    {/* Top View Mini */}
                    <div className="absolute top-4 right-4 w-32 h-24 bg-background border rounded-xl p-2">
                      <p className="text-xs text-muted-foreground mb-1">Top View</p>
                      <div 
                        className="grid gap-0.5 h-14" 
                        style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(result.cartonsPerLayer))}, 1fr)` }}
                      >
                        {Array.from({ length: Math.min(result.cartonsPerLayer, 20) }).map((_, idx) => (
                          <div 
                            key={idx} 
                            className="rounded-sm" 
                            style={{ backgroundColor: `${LOGISTICS_GREEN}60` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-[15%] left-0 bg-background/80 backdrop-blur-sm rounded-xl p-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Layers:</span>{" "}
                          <span className="font-bold">{result.layersPerPallet}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total:</span>{" "}
                          <span className="font-bold">{result.totalCartons}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Weight:</span>{" "}
                          <span className="font-bold">{result.totalWeight.toFixed(0)}kg</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Util:</span>{" "}
                          <span className="font-bold">{result.volumeUtilization.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* No Fit Warning */}
                {result.cartonsPerLayer === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="text-center p-4">
                      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-2" />
                      <p className="font-medium text-red-500">Carton does not fit on pallet</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try a larger pallet type or enable overhang
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Visualization Legend */}
              <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-xl">
                  <div 
                    className="w-4 h-4 mx-auto mb-1 rounded" 
                    style={{ backgroundColor: `${OCEAN_BLUE}20`, border: `1px solid ${OCEAN_BLUE}40` }}
                  />
                  <p className="text-xs text-muted-foreground">Pallet Base</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <div 
                    className="w-4 h-4 mx-auto mb-1 rounded" 
                    style={{ backgroundColor: `${LOGISTICS_GREEN}40`, border: `1px solid ${LOGISTICS_GREEN}60` }}
                  />
                  <p className="text-xs text-muted-foreground">Carton Layers</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <div 
                    className="w-4 h-4 mx-auto mb-1 rounded" 
                    style={{ backgroundColor: OCEAN_BLUE }}
                  />
                  <p className="text-xs text-muted-foreground">Height Used</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-xl">
                  <div className="w-4 h-4 bg-border mx-auto mb-1 rounded" />
                  <p className="text-xs text-muted-foreground">Height Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Performance Radar */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="value"
                        stroke={OCEAN_BLUE}
                        fill={OCEAN_BLUE}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Efficiency Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="current" 
                        stroke={OCEAN_BLUE} 
                        strokeWidth={2}
                        name="Current"
                        dot={{ fill: OCEAN_BLUE, strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="optimal" 
                        stroke={LOGISTICS_GREEN} 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Optimal"
                        dot={{ fill: LOGISTICS_GREEN, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pattern Efficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Stacking Pattern Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Pattern Comparison</h4>
                  {Object.entries(STACKING_PATTERNS).map(([key, pattern]) => {
                    const efficiency = key === config.stackingPattern 
                      ? result.patternEfficiency 
                      : key === "column" 
                        ? 100 
                        : key === "brick" 
                          ? 95 
                          : 90;
                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          key === config.stackingPattern
                            ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{pattern.name}</span>
                          <Badge 
                            variant={key === config.stackingPattern ? "default" : "secondary"}
                            style={key === config.stackingPattern ? { backgroundColor: OCEAN_BLUE } : {}}
                          >
                            {efficiency.toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{pattern.description}</p>
                        {key === config.stackingPattern && (
                          <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: OCEAN_BLUE }}>
                            <CheckCircle2 className="h-3 w-3" />
                            Current selection
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Efficiency Metrics</h4>
                  <div className="space-y-3">
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Floor Space Efficiency</span>
                        <span className="font-bold" style={{ color: OCEAN_BLUE }}>
                          {result.palletUtilization.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={result.palletUtilization} className="h-2" />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Volume Efficiency</span>
                        <span className="font-bold" style={{ color: LOGISTICS_GREEN }}>
                          {result.volumeUtilization.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={result.volumeUtilization} className="h-2" />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Weight Efficiency</span>
                        <span className="font-bold" style={{ color: OCEAN_BLUE }}>
                          {((result.totalWeight / PALLET_TYPES[config.palletType].maxWeight) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(result.totalWeight / PALLET_TYPES[config.palletType].maxWeight) * 100} 
                        className="h-2" 
                      />
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Height Efficiency</span>
                        <span className="font-bold" style={{ color: LOGISTICS_GREEN }}>
                          {result.heightUtilization.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={result.heightUtilization} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.palletUtilization < 80 && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-700 dark:text-amber-400">Low Floor Utilization</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Consider rotating cartons or selecting a different pallet type to improve space efficiency.
                      </p>
                    </div>
                  </div>
                )}
                {result.totalWeight > PALLET_TYPES[config.palletType].maxWeight * 0.9 && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900">
                    <AlertOctagon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400">Approaching Weight Limit</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current weight is near maximum capacity. Consider reducing layers or using a higher-capacity pallet.
                      </p>
                    </div>
                  </div>
                )}
                {result.stabilityScore >= 75 && result.palletUtilization >= 80 && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                    <div>
                      <p className="font-medium" style={{ color: LOGISTICS_GREEN }}>Optimal Configuration</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your pallet configuration is well-optimized for both space utilization and stability.
                      </p>
                    </div>
                  </div>
                )}
                {result.heightUtilization < 70 && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900">
                    <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: OCEAN_BLUE }} />
                    <div>
                      <p className="font-medium" style={{ color: OCEAN_BLUE }}>Height Available</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        There is unused vertical space. Consider increasing stacking height or selecting a taller height limit.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6 mt-6">
          {/* FAQ Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div 
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: `${OCEAN_BLUE}15` }}
                >
                  <HelpCircle className="h-8 w-8" style={{ color: OCEAN_BLUE }} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground mt-1">
                    Find answers to common questions about pallet configuration and optimization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border rounded-xl px-4 data-[state=open]:bg-muted/30"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                          style={{ backgroundColor: index % 2 === 0 ? OCEAN_BLUE : LOGISTICS_GREEN }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pl-11">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <div className="h-2" style={{ backgroundColor: OCEAN_BLUE }} />
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  <h3 className="font-semibold">Best Practice</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Aim for at least 80% floor utilization to maximize shipping efficiency and minimize costs.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-2" style={{ backgroundColor: LOGISTICS_GREEN }} />
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  <h3 className="font-semibold">Safety First</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Always ensure stability score is above 75% and never exceed rated pallet weight capacity.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="h-2" style={{ backgroundColor: OCEAN_BLUE }} />
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  <h3 className="font-semibold">Pro Tip</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Use the Brick pattern for better stability during transport, especially for fragile goods.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}
                  >
                    <Sparkles className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Need More Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Our logistics experts are available to help optimize your pallet configurations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Documentation
                  </Button>
                  <Button 
                    className="flex items-center gap-2 text-white"
                    style={{ backgroundColor: OCEAN_BLUE }}
                  >
                    Contact Support
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
              <div>
                <p className="font-medium">Configuration Complete</p>
                <p className="text-sm text-muted-foreground">
                  {result.totalCartons} cartons per pallet | {result.volumeUtilization.toFixed(0)}% volume utilization
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setConfig({
                  palletType: "euro",
                  heightLimit: "standard",
                  cartonLength: 400,
                  cartonWidth: 300,
                  cartonHeight: 250,
                  cartonWeight: 5,
                  dimensionUnit: "mm",
                  weightUnit: "kg",
                  stackingPattern: "optimal",
                  allowOverhang: false,
                  maxOverhangPercent: 5,
                })}
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button 
                className="flex items-center gap-2 text-white"
                style={{ backgroundColor: LOGISTICS_GREEN }}
              >
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
