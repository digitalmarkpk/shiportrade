"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Package,
  Ruler,
  Calculator,
  Info,
  AlertTriangle,
  Grid3X3,
  ArrowRight,
  CheckCircle2,
  Download,
  Share2,
  BarChart3,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Zap,
  DollarSign,
  RotateCcw,
  Scale,
  Target,
  Layers,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ComposedChart,
  Line,
  Area,
} from "recharts";

interface LDMResult {
  totalLDM: number;
  floorSpaceUsed: number;
  truckCapacity: number;
  utilizationPercent: number;
  remainingSpace: number;
  palletPositions: number;
  stackablePositions: number;
  isOverCapacity: boolean;
  costEstimate: number;
  ratePerLDM: number;
  efficiency: number;
  floorSpaceSqm: number;
}

// Standard truck dimensions and capacities
const truckTypes: Record<string, { name: string; length: number; width: number; height: number; capacity: number; ldmCapacity: number }> = {
  "solo_7_5t": { name: "Solo 7.5t", length: 7.0, width: 2.4, height: 2.4, capacity: 3000, ldmCapacity: 5.0 },
  "solo_12t": { name: "Solo 12t", length: 8.0, width: 2.4, height: 2.6, capacity: 5500, ldmCapacity: 6.5 },
  "solo_18t": { name: "Solo 18t", length: 9.0, width: 2.4, height: 2.7, capacity: 9000, ldmCapacity: 7.5 },
  "solo_26t": { name: "Solo 26t", length: 10.0, width: 2.4, height: 2.7, capacity: 14000, ldmCapacity: 10.0 },
  "articulated_40t": { name: "Articulated 40t", length: 13.6, width: 2.4, height: 2.7, capacity: 25000, ldmCapacity: 13.6 },
  "mega_trailer": { name: "Mega Trailer", length: 13.6, width: 2.48, height: 3.0, capacity: 25000, ldmCapacity: 13.6 },
  "jumbo": { name: "Jumbo Trailer", length: 13.6, width: 2.48, height: 3.0, capacity: 26000, ldmCapacity: 13.6 },
};

// Standard pallet types
const palletTypes: Record<string, { name: string; length: number; width: number; ldm: number }> = {
  "euro": { name: "Euro Pallet (120×80)", length: 120, width: 80, ldm: 0.4 },
  "industrial": { name: "Industrial Pallet (120×100)", length: 120, width: 100, ldm: 0.5 },
  "us": { name: "US Pallet (48×40 in)", length: 122, width: 102, ldm: 0.5 },
  "half_euro": { name: "Half Euro (60×80)", length: 60, width: 80, ldm: 0.2 },
  "custom": { name: "Custom Dimensions", length: 0, width: 0, ldm: 0 },
};

const FAQS = [
  {
    question: "What is a Loading Meter (LDM) and why is it important?",
    answer: "A Loading Meter (LDM or Lademeter) is a standardized unit of measurement used primarily in European road transport to calculate floor space occupied by cargo. One LDM equals one meter of trailer length multiplied by the standard trailer width of 2.4 meters, representing 2.4 m² of floor space. This measurement is crucial because it provides a fair and consistent way to price and plan cargo shipments, especially for volumetric cargo that doesn't fill a truck's weight capacity but occupies significant floor space.",
  },
  {
    question: "How is LDM calculated for pallets and loose cargo?",
    answer: "For palletized cargo, LDM is calculated as: (Pallet Length in meters × Number of Pallets) ÷ Stacking Factor. For example, a Euro pallet (1.2m length) = 0.4 LDM per pallet. For loose cargo, the formula is: (Cargo Length × Cargo Width) ÷ Standard Truck Width (2.4m). Stacking reduces LDM proportionally - double stacking halves your LDM usage, while triple stacking reduces it to one-third. Always consider cargo stability and height restrictions when stacking.",
  },
  {
    question: "What is the maximum LDM capacity for standard trucks?",
    answer: "Standard truck LDM capacities vary by type: Solo 7.5t (5.0 LDM), Solo 12t (6.5 LDM), Solo 18t (7.5 LDM), Solo 26t (10.0 LDM), Articulated 40t (13.6 LDM), Mega Trailer (13.6 LDM), and Jumbo Trailer (13.6 LDM). The most common configuration for full truck loads is the articulated trailer with 13.6 LDM capacity, which can accommodate approximately 33 Euro pallets or 26 Industrial pallets in a single layer.",
  },
  {
    question: "How does LDM pricing work in European road transport?",
    answer: "LDM pricing is calculated by multiplying the total LDM used by the rate per LDM. Rates vary based on route distance, fuel costs, seasonal demand, and carrier. For partial loads, you pay only for the LDM used, making it cost-effective for LTL shipments. Full truck loads (FTL) typically offer better per-LDM rates but require using the entire capacity. Current market rates range from €15-40 per LDM for domestic routes and €25-60 for international routes within Europe.",
  },
  {
    question: "When should I use LDM vs weight-based pricing?",
    answer: "LDM pricing is advantageous for volumetric cargo - lightweight but bulky items that occupy significant floor space relative to their weight. This includes furniture, insulation materials, packaging, and light manufactured goods. Weight-based pricing is better for dense cargo like metals, tiles, or machinery. Most carriers use a combination, charging based on whichever is higher: LDM or weight-based calculation. As a rule of thumb, if your cargo density is below 250 kg per LDM, LDM pricing will likely apply.",
  },
  {
    question: "What are the best practices for optimizing LDM utilization?",
    answer: "Key optimization strategies include: (1) Use standard pallet sizes for maximum compatibility, (2) Stack cargo when product integrity allows, potentially doubling capacity, (3) Consolidate multiple shipments to fill trucks efficiently, (4) Consider 'mega trailers' with extra height for tall cargo, (5) Plan loading sequences to minimize wasted space, (6) Use load planning software for complex shipments, and (7) Balance LDM optimization with weight limits to avoid overweight penalties.",
  },
];

const PRO_TIPS = [
  {
    title: "Stack Strategically",
    description: "Double stacking can halve your LDM usage. Always check cargo stability and truck height restrictions before stacking.",
    icon: Layers,
  },
  {
    title: "Choose Right Pallet",
    description: "Euro pallets use only 0.4 LDM each vs 0.5 LDM for industrial pallets. The 25% savings adds up significantly.",
    icon: Package,
  },
  {
    title: "Consolidate Shipments",
    description: "Combine multiple LTL shipments to achieve full truck load rates and better per-unit costs.",
    icon: Target,
  },
  {
    title: "Balance Weight & Space",
    description: "Always check weight limits alongside LDM. An overloaded truck faces penalties regardless of LDM utilization.",
    icon: Scale,
  },
  {
    title: "Plan Loading Sequence",
    description: "Proper sequencing prevents dead space and improves unloading efficiency at multiple delivery points.",
    icon: ArrowRight,
  },
];

export function LDMCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [calculationMode, setCalculationMode] = useState<string>("ldm");
  const [truckType, setTruckType] = useState<string>("articulated_40t");
  const [palletType, setPalletType] = useState<string>("euro");
  const [customLength, setCustomLength] = useState<string>("");
  const [customWidth, setCustomWidth] = useState<string>("");
  const [numberOfPallets, setNumberOfPallets] = useState<string>("10");
  const [stacking, setStacking] = useState<string>("1");
  const [totalLDMInput, setTotalLDMInput] = useState<string>("");
  const [ratePerLDM, setRatePerLDM] = useState<string>("25");

  const selectedTruck = truckTypes[truckType];
  const selectedPallet = palletTypes[palletType];

  const calculation = useMemo<LDMResult>(() => {
    const truck = selectedTruck;
    let totalLDM = 0;
    let palletPositions = 0;

    if (calculationMode === "ldm") {
      totalLDM = parseFloat(totalLDMInput) || 0;
    } else {
      // Calculate LDM from pallet dimensions
      const palletLength = palletType === "custom" 
        ? (parseFloat(customLength) || 0) / 100 // cm to m
        : selectedPallet.length / 100;
      const palletWidth = palletType === "custom"
        ? (parseFloat(customWidth) || 0) / 100
        : selectedPallet.width / 100;
      
      const numPallets = parseInt(numberOfPallets) || 0;
      const stackFactor = parseInt(stacking) || 1;
      
      // LDM calculation for pallets
      totalLDM = (palletLength * numPallets) / stackFactor;
      
      // Pallet positions (considering stacking)
      palletPositions = Math.ceil(numPallets / stackFactor);
    }

    const floorSpaceUsed = totalLDM;
    const capacity = truck.ldmCapacity;
    const utilization = (totalLDM / capacity) * 100;
    const remaining = Math.max(0, capacity - totalLDM);
    const isOverCapacity = totalLDM > capacity;

    // Calculate cost
    const rate = parseFloat(ratePerLDM) || 0;
    const cost = totalLDM * rate;

    // Calculate stackable positions
    const stackPositions = palletPositions > 0 ? palletPositions : Math.ceil(totalLDM / 2.4);

    // Efficiency score (0-100)
    const efficiency = Math.min(utilization, 100);

    // Floor space in square meters
    const floorSpaceSqm = totalLDM * 2.4;

    return {
      totalLDM: Math.round(totalLDM * 100) / 100,
      floorSpaceUsed,
      truckCapacity: capacity,
      utilizationPercent: Math.round(utilization * 10) / 10,
      remainingSpace: Math.round(remaining * 100) / 100,
      palletPositions: stackPositions,
      stackablePositions: Math.ceil(stackPositions / (parseInt(stacking) || 1)),
      isOverCapacity,
      costEstimate: cost,
      ratePerLDM: rate,
      efficiency,
      floorSpaceSqm: Math.round(floorSpaceSqm * 100) / 100,
    };
  }, [calculationMode, truckType, palletType, customLength, customWidth, numberOfPallets, stacking, totalLDMInput, ratePerLDM, selectedTruck, selectedPallet]);

  // Chart data
  const utilizationData = [
    { name: "Used", value: calculation.totalLDM, fill: "#2E8B57" },
    { name: "Available", value: calculation.remainingSpace, fill: "#E5E7EB" },
  ];

  const truckComparisonData = Object.entries(truckTypes).map(([key, truck]) => ({
    name: truck.name.split(" ").slice(-1)[0],
    ldm: truck.ldmCapacity,
    weight: truck.capacity / 1000,
  }));

  const palletLDMData = Object.entries(palletTypes)
    .filter(([key]) => key !== "custom")
    .map(([key, pallet]) => ({
      name: key === "euro" ? "Euro" : key === "industrial" ? "Industrial" : key === "us" ? "US" : "Half",
      ldm: pallet.ldm,
      width: pallet.width,
    }));

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "#10B981";
    if (efficiency >= 70) return "#22C55E";
    if (efficiency >= 50) return "#F59E0B";
    return "#EF4444";
  };

  const resetForm = () => {
    setTruckType("articulated_40t");
    setPalletType("euro");
    setCustomLength("");
    setCustomWidth("");
    setNumberOfPallets("10");
    setStacking("1");
    setTotalLDMInput("");
    setRatePerLDM("25");
    setCalculationMode("ldm");
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--logistics)]/5 via-background to-[var(--ocean)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[var(--logistics)] text-white">
                <Truck className="h-3 w-3 mr-1" />
                Road Transport
              </Badge>
              <Badge variant="outline" className="border-[var(--ocean)] text-[var(--ocean)]">
                <Zap className="h-3 w-3 mr-1" />
                European Standard
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              LDM (Loading Meter) Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Calculate loading meters for European road transport. Optimize truck utilization, 
              estimate costs, and plan efficient cargo loading for your shipments.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="trucks" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Trucks</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[var(--logistics)]" />
                    Truck Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Truck Type</Label>
                    <Select value={truckType} onValueChange={setTruckType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(truckTypes).map(([key, truck]) => (
                          <SelectItem key={key} value={key}>
                            {truck.name} - {truck.ldmCapacity} LDM
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-[var(--ocean)]">{selectedTruck.length}m</div>
                      <div className="text-xs text-muted-foreground">Length</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-[var(--ocean)]">{selectedTruck.width}m</div>
                      <div className="text-xs text-muted-foreground">Width</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-[var(--logistics)]">{selectedTruck.height}m</div>
                      <div className="text-xs text-muted-foreground">Height</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-[var(--logistics)]">{selectedTruck.capacity / 1000}t</div>
                      <div className="text-xs text-muted-foreground">Capacity</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Calculation Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCalculationMode("pallets")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        calculationMode === "pallets"
                          ? "border-[var(--logistics)] bg-[var(--logistics)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <Package className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">From Pallets</div>
                    </button>
                    <button
                      onClick={() => setCalculationMode("ldm")}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        calculationMode === "ldm"
                          ? "border-[var(--logistics)] bg-[var(--logistics)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <Ruler className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">Direct LDM</div>
                    </button>
                  </div>

                  {calculationMode === "pallets" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Pallet Type</Label>
                        <Select value={palletType} onValueChange={setPalletType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(palletTypes).map(([key, pallet]) => (
                              <SelectItem key={key} value={key}>
                                {pallet.name} {pallet.ldm > 0 && `(${pallet.ldm} LDM)`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {palletType === "custom" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Length (cm)</Label>
                            <Input
                              type="number"
                              value={customLength}
                              onChange={(e) => setCustomLength(e.target.value)}
                              placeholder="120"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Width (cm)</Label>
                            <Input
                              type="number"
                              value={customWidth}
                              onChange={(e) => setCustomWidth(e.target.value)}
                              placeholder="80"
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Number of Pallets</Label>
                          <Input
                            type="number"
                            value={numberOfPallets}
                            onChange={(e) => setNumberOfPallets(e.target.value)}
                            placeholder="10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Stacking Height</Label>
                          <Select value={stacking} onValueChange={setStacking}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Single (1x)</SelectItem>
                              <SelectItem value="2">Double (2x)</SelectItem>
                              <SelectItem value="3">Triple (3x)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label>Total Loading Meters (LDM)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={totalLDMInput}
                        onChange={(e) => setTotalLDMInput(e.target.value)}
                        placeholder="Enter total LDM"
                      />
                      <p className="text-xs text-muted-foreground">
                        LDM = (Cargo Length × Cargo Width) / Truck Width
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Rate per LDM</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={ratePerLDM}
                        onChange={(e) => setRatePerLDM(e.target.value)}
                        placeholder="25"
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€/LDM</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className={`overflow-hidden ${calculation.isOverCapacity ? "border-red-200 dark:border-red-800" : "border-[var(--logistics)]/20"}`}>
                <div className={`h-2 ${calculation.isOverCapacity ? "bg-red-500" : "bg-[var(--logistics)]"}`} />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    LDM Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-4">
                    <motion.div
                      key={calculation.totalLDM}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-5xl font-bold ${calculation.isOverCapacity ? "text-red-600" : "text-[var(--logistics)]"}`}
                    >
                      {calculation.totalLDM}
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">
                      Loading Meters (LDM)
                    </div>
                    {calculation.isOverCapacity ? (
                      <Badge variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Exceeds Truck Capacity
                      </Badge>
                    ) : (
                      <Badge className="mt-2 gradient-logistics text-white">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Fits in Selected Truck
                      </Badge>
                    )}
                  </div>

                  {/* Utilization Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Truck Utilization</span>
                      <span className="font-medium" style={{ color: getEfficiencyColor(calculation.utilizationPercent) }}>
                        {calculation.utilizationPercent}%
                      </span>
                    </div>
                    <Progress value={Math.min(calculation.utilizationPercent, 100)} className="h-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 LDM</span>
                      <span>{calculation.truckCapacity} LDM</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-[var(--ocean)]">
                        {calculation.remainingSpace}
                      </div>
                      <div className="text-xs text-muted-foreground">Remaining LDM</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold text-[var(--logistics)]">
                        {calculation.palletPositions}
                      </div>
                      <div className="text-xs text-muted-foreground">Floor Positions</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-xl font-bold" style={{ color: getEfficiencyColor(calculation.efficiency) }}>
                        {calculation.floorSpaceSqm}
                      </div>
                      <div className="text-xs text-muted-foreground">Floor Space m²</div>
                    </div>
                  </div>

                  {calculation.costEstimate > 0 && (
                    <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Estimated Transport Cost</span>
                        <span className="font-bold text-[var(--logistics)] text-xl">
                          €{calculation.costEstimate.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on €{calculation.ratePerLDM}/LDM rate
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Truck Visualization */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 text-[var(--ocean)]" />
                    Truck Floor Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="border-2 border-muted-foreground rounded-lg overflow-hidden">
                      <motion.div
                        className={`h-16 flex items-center justify-center text-sm font-medium ${
                          calculation.isOverCapacity ? "bg-red-200 dark:bg-red-900/40" : "bg-[var(--logistics)]/30"
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((calculation.totalLDM / calculation.truckCapacity) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      >
                        {calculation.totalLDM} LDM used
                      </motion.div>
                    </div>
                    
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${calculation.isOverCapacity ? "bg-red-300" : "bg-[var(--logistics)]/30"}`} />
                        <span>Cargo space</span>
                      </div>
                      <span>{selectedTruck.length}m × {selectedTruck.width}m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Capacity Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={utilizationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {utilizationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} LDM`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[var(--logistics)]" />
                  Pallet LDM Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={palletLDMData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 0.6]} />
                      <Tooltip formatter={(value: number) => `${value} LDM`} />
                      <Bar dataKey="ldm" name="LDM per Pallet" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">{calculation.totalLDM}</div>
                  <div className="text-sm text-muted-foreground">Total LDM</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">{calculation.floorSpaceSqm}</div>
                  <div className="text-sm text-muted-foreground">Floor Space (m²)</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold" style={{ color: getEfficiencyColor(calculation.efficiency) }}>
                    {calculation.efficiency.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Efficiency</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-500">€{calculation.costEstimate.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Est. Cost</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trucks Tab */}
        <TabsContent value="trucks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--logistics)]" />
                Truck Type Comparison
              </CardTitle>
              <CardDescription>
                Compare LDM capacity and weight limits across different truck types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={truckComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#2E8B57" />
                    <YAxis yAxisId="right" orientation="right" stroke="#0F4C81" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="ldm" name="LDM Capacity" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="weight" name="Max Weight (t)" stroke="#0F4C81" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Standard Truck Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Truck Type</th>
                      <th className="text-left p-2">Length</th>
                      <th className="text-left p-2">Width</th>
                      <th className="text-left p-2">Height</th>
                      <th className="text-left p-2">LDM</th>
                      <th className="text-left p-2">Max Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(truckTypes).map(([key, truck]) => (
                      <tr key={key} className={`border-b ${truckType === key ? 'bg-muted/50' : ''}`}>
                        <td className="p-2 font-medium">{truck.name}</td>
                        <td className="p-2">{truck.length}m</td>
                        <td className="p-2">{truck.width}m</td>
                        <td className="p-2">{truck.height}m</td>
                        <td className="p-2 font-bold text-[var(--logistics)]">{truck.ldmCapacity}</td>
                        <td className="p-2">{truck.capacity / 1000}t</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for LDM Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding LDM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  A Loading Meter (LDM or Lademeter in German) is a standardized unit of measurement used in European 
                  road transport to calculate floor space occupied by cargo. One LDM equals one meter of trailer length 
                  multiplied by the standard trailer width of 2.4 meters, representing 2.4 m² of floor space.
                </p>
                <p>
                  LDM is the primary pricing metric for less-than-truckload (LTL) shipments in Europe because it 
                  provides a fair way to charge for volumetric cargo that doesn't fill the weight capacity but 
                  occupies significant floor space. This ensures shippers pay proportionally for the space they use.
                </p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Formula:</h4>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs">
                    LDM = (Cargo Length × Cargo Width) / Truck Width (2.4m)
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs">
                    For Pallets: LDM = Pallet Length × Number of Pallets / Stacking Factor
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>LDM Reference Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pallet-ldm">
                  <AccordionTrigger>Standard Pallet LDM Values</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold">Pallet Type</div>
                        <div className="font-semibold">Dimensions</div>
                        <div className="font-semibold">LDM per Pallet</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-2">
                        <div>Euro Pallet</div>
                        <div>120 × 80 cm</div>
                        <div className="font-bold text-[var(--logistics)]">0.4 LDM</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-2">
                        <div>Industrial Pallet</div>
                        <div>120 × 100 cm</div>
                        <div className="font-bold text-[var(--logistics)]">0.5 LDM</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-2">
                        <div>US Pallet</div>
                        <div>48 × 40 in (122 × 102 cm)</div>
                        <div className="font-bold text-[var(--logistics)]">0.5 LDM</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 p-2">
                        <div>Half Euro</div>
                        <div>60 × 80 cm</div>
                        <div className="font-bold text-[var(--logistics)]">0.2 LDM</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="truck-capacity">
                  <AccordionTrigger>Maximum Pallets per Truck Type</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Based on standard trailer configurations:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li><strong>Articulated 40t (13.6 LDM):</strong> 33 Euro pallets or 26 Industrial pallets</li>
                        <li><strong>Mega Trailer (13.6 LDM):</strong> 33 Euro pallets or 26 Industrial pallets</li>
                        <li><strong>Solo 26t (10.0 LDM):</strong> 24 Euro pallets or 19 Industrial pallets</li>
                        <li><strong>Solo 18t (7.5 LDM):</strong> 18 Euro pallets or 14 Industrial pallets</li>
                        <li><strong>Solo 12t (6.5 LDM):</strong> 15 Euro pallets or 12 Industrial pallets</li>
                      </ul>
                      <p className="mt-2">Double stacking can double these numbers when cargo and height allow.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about loading meters and road transport optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
