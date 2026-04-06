"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Container,
  Package,
  Layers,
  RotateCcw,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Download,
  Share2,
  Calculator,
  BarChart3,
  BookOpen,
  Lightbulb,
  HelpCircle,
  TrendingUp,
  Zap,
  DollarSign,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  Ship,
  Scale,
  Grid3X3,
  ArrowRight,
  Target,
  AlertTriangle,
  Settings,
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
import { containerSpecs, lengthUnits, weightUnits } from "@/lib/constants/units";
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
  Area,
  Line,
} from "recharts";

type ContainerType = keyof typeof containerSpecs;

interface CargoItem {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  stackable: boolean;
  unit: keyof typeof lengthUnits;
}

interface LoadResult {
  totalCBM: number;
  totalWeight: number;
  containerCBM: number;
  containerPayload: number;
  volumeUtilization: number;
  weightUtilization: number;
  itemsFit: number;
  recommendation: string;
  warnings: string[];
  efficiency: number;
  remainingCapacity: number;
  remainingWeight: number;
}

const defaultCargoItem = (): CargoItem => ({
  id: crypto.randomUUID(),
  name: "",
  length: 100,
  width: 80,
  height: 60,
  weight: 25,
  quantity: 10,
  stackable: true,
  unit: "cm",
});

// Container comparison data for visualization
const containerComparisonData = Object.entries(containerSpecs).map(([key, spec]) => ({
  name: spec.name.split("'")[0] + "'",
  capacity: spec.capacity,
  payload: spec.maxPayload / 1000,
  efficiency: (spec.maxPayload / 1000) / spec.capacity,
}));

// Efficiency color thresholds
const EFFICIENCY_COLORS = {
  excellent: "#10B981",
  good: "#22C55E",
  moderate: "#F59E0B",
  low: "#EF4444",
};

const FAQS = [
  {
    question: "What is container loading optimization?",
    answer: "Container loading optimization is the process of maximizing the use of container space (volume) and weight capacity while ensuring cargo safety and compliance with shipping regulations. It involves strategic placement of cargo items to minimize wasted space, prevent damage during transit, and optimize shipping costs. Proper loading optimization can reduce shipping costs by 10-30% and minimize the risk of cargo damage.",
  },
  {
    question: "How is container utilization calculated?",
    answer: "Container utilization is calculated as the ratio of actual cargo volume or weight to the container's maximum capacity. Volume utilization = (Total CBM / Container Capacity) × 100%. Weight utilization = (Total Weight / Max Payload) × 100%. The ideal scenario is to maximize both metrics, but typically one becomes the limiting factor. Understanding which constraint limits your shipment helps in optimizing load planning.",
  },
  {
    question: "What is the difference between volume-limited and weight-limited shipments?",
    answer: "Volume-limited shipments reach the container's cubic capacity before hitting weight limits, common with lightweight, bulky cargo like cotton, insulation materials, or empty packaging. Weight-limited shipments max out payload before filling space, typical for dense cargo like metals, tiles, or machinery. Identifying your limitation type helps optimize: volume-limited shipments benefit from better packing, while weight-limited shipments may allow consolidating additional lightweight items.",
  },
  {
    question: "What safety factors should I consider when loading containers?",
    answer: "Industry best practices recommend a 5-15% safety buffer to account for: measurement inaccuracies, irregular cargo shapes, dunnage and securing materials, weight distribution requirements, and customs inspection needs. For fragile goods, consider larger buffers. The calculator allows adjusting from 80-100% to match your risk tolerance and cargo characteristics.",
  },
  {
    question: "How does stackability affect loading calculations?",
    answer: "Stackable cargo can significantly increase container utilization by using vertical space. Non-stackable items consume full height capacity for a single layer, drastically reducing efficiency. When marking items as stackable, consider: packaging strength, maximum stacking height, weight of items above, and crushability. Overestimating stackability can result in damaged goods, while underestimating wastes valuable container space.",
  },
  {
    question: "What are the standard container types and their capacities?",
    answer: "Standard containers include: 20'GP (33.2 CBM, 21.8 MT), 40'GP (67.7 CBM, 26.6 MT), 40'HC (76.3 CBM, 26.5 MT) for general cargo. Specialized containers include: Refrigerated (Reefer) for temperature-sensitive goods, Open Top for tall cargo, Flat Rack for oversized items, and Tank containers for liquids. High Cube containers offer 12% more volume than standard containers at similar payload capacity.",
  },
];

const PRO_TIPS = [
  {
    title: "Measure Accurately",
    description: "Include packaging, pallets, and any dunnage in your measurements. A 5% measurement error can result in significant loading issues.",
    icon: Target,
  },
  {
    title: "Distribute Weight Evenly",
    description: "Center heavy items in the container and distribute weight across the floor area. Uneven weight distribution can cause handling issues.",
    icon: Scale,
  },
  {
    title: "Consider Unloading Sequence",
    description: "Load items that will be unloaded first near the doors. This reduces handling time and costs at destination.",
    icon: ArrowRight,
  },
  {
    title: "Use Standard Pallets",
    description: "Standard pallets (1200×1000mm or 48×40\") maximize container floor utilization. Custom sizes often create wasted space.",
    icon: Grid3X3,
  },
  {
    title: "Document Everything",
    description: "Photograph loaded containers before sealing. This protects against damage claims and aids in dispute resolution.",
    icon: FileText,
  },
];

export function ContainerLoadingCalculator() {
  const [containerType, setContainerType] = useState<ContainerType>("40hc");
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([defaultCargoItem()]);
  const [safetyFactor, setSafetyFactor] = useState<number>(0.9);
  const [activeTab, setActiveTab] = useState("calculator");

  const container = containerSpecs[containerType];

  const results = useMemo<LoadResult>(() => {
    let totalCBM = 0;
    let totalWeight = 0;
    const warnings: string[] = [];

    cargoItems.forEach((item) => {
      const l = item.length * lengthUnits[item.unit].toBase;
      const w = item.width * lengthUnits[item.unit].toBase;
      const h = item.height * lengthUnits[item.unit].toBase;
      
      const itemCBM = l * w * h * item.quantity;
      totalCBM += itemCBM;
      totalWeight += item.weight * item.quantity;
    });

    const volumeUtilization = Math.min((totalCBM / container.capacity) * 100, 100);
    const weightUtilization = Math.min((totalWeight / container.maxPayload) * 100, 100);

    // Estimate items that can fit
    const cbmLimit = container.capacity * safetyFactor;
    const weightLimit = container.maxPayload * safetyFactor;
    
    let effectiveItems = 0;
    cargoItems.forEach((item) => {
      const l = item.length * lengthUnits[item.unit].toBase;
      const w = item.width * lengthUnits[item.unit].toBase;
      const h = item.height * lengthUnits[item.unit].toBase;
      const itemCBM = l * w * h;
      
      const cbmFit = Math.floor(cbmLimit / itemCBM);
      const weightFit = Math.floor(weightLimit / item.weight);
      effectiveItems += Math.min(cbmFit, weightFit);
    });

    // Calculate efficiency score
    const efficiency = (volumeUtilization + weightUtilization) / 2;

    // Generate recommendation
    let recommendation = "";
    if (totalCBM > container.capacity) {
      recommendation = "Cargo exceeds container volume capacity. Consider multiple containers, a larger container type, or optimize packaging to reduce volume.";
      warnings.push("Volume exceeds container capacity");
    } else if (totalWeight > container.maxPayload) {
      recommendation = "Cargo weight exceeds payload limit. Reduce quantity, use weight-efficient packaging, or distribute across multiple containers.";
      warnings.push("Weight exceeds payload limit");
    } else if (volumeUtilization > 90 && weightUtilization < 70) {
      recommendation = "Volume optimized but underutilizing weight capacity. This is ideal for lightweight cargo. Consider consolidating with other shipments heading to the same destination.";
    } else if (weightUtilization > 90 && volumeUtilization < 70) {
      recommendation = "Weight optimized but underutilizing volume. Consider adding lighter cargo to maximize container economics and reduce per-unit shipping cost.";
    } else if (volumeUtilization > 80 && weightUtilization > 80) {
      recommendation = "Excellent utilization! Both volume and weight are well balanced. This represents optimal container efficiency.";
    } else if (efficiency > 60) {
      recommendation = "Good utilization with room for improvement. Review packaging options or consider consolidating with compatible cargo.";
    } else {
      recommendation = "Container is significantly underutilized. Consider consolidating shipments, using a smaller container, or reviewing packaging efficiency.";
    }

    if (totalWeight > container.maxPayload) {
      warnings.push("Overweight container - may incur additional charges, be refused by carrier, or face regulatory penalties");
    }

    return {
      totalCBM,
      totalWeight,
      containerCBM: container.capacity,
      containerPayload: container.maxPayload,
      volumeUtilization,
      weightUtilization,
      itemsFit: effectiveItems,
      recommendation,
      warnings,
      efficiency,
      remainingCapacity: Math.max(0, container.capacity - totalCBM),
      remainingWeight: Math.max(0, container.maxPayload - totalWeight),
    };
  }, [cargoItems, container, safetyFactor]);

  // Chart data
  const utilizationData = [
    { name: "Volume", actual: results.volumeUtilization, max: 100, fill: "#0F4C81" },
    { name: "Weight", actual: results.weightUtilization, max: 100, fill: "#2E8B57" },
  ];

  const cargoBreakdownData = cargoItems.map((item, index) => {
    const l = item.length * lengthUnits[item.unit].toBase;
    const w = item.width * lengthUnits[item.unit].toBase;
    const h = item.height * lengthUnits[item.unit].toBase;
    const cbm = l * w * h * item.quantity;
    return {
      name: item.name || `Item ${index + 1}`,
      cbm: parseFloat(cbm.toFixed(3)),
      weight: item.weight * item.quantity,
    };
  });

  const containerCapacityData = [
    { name: "Used", value: results.totalCBM, fill: "#0F4C81" },
    { name: "Available", value: results.remainingCapacity, fill: "#E5E7EB" },
  ];

  const updateItem = (id: string, field: keyof CargoItem, value: string | number | boolean) => {
    setCargoItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setCargoItems((prev) => [...prev, defaultCargoItem()]);
  };

  const removeItem = (id: string) => {
    setCargoItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetForm = () => {
    setCargoItems([defaultCargoItem()]);
    setContainerType("40hc");
    setSafetyFactor(0.9);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return EFFICIENCY_COLORS.excellent;
    if (efficiency >= 60) return EFFICIENCY_COLORS.good;
    if (efficiency >= 40) return EFFICIENCY_COLORS.moderate;
    return EFFICIENCY_COLORS.low;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[var(--ocean)] text-white">
                <Container className="h-3 w-3 mr-1" />
                Ocean Freight
              </Badge>
              <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                <Zap className="h-3 w-3 mr-1" />
                Smart Optimization
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Container Loading Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Optimize your container utilization with intelligent load planning. Calculate volume and weight capacity, 
              visualize loading efficiency, and get recommendations for maximizing container space.
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
          <TabsTrigger value="containers" className="flex items-center gap-2">
            <Container className="h-4 w-4" />
            <span className="hidden sm:inline">Containers</span>
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
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Container className="h-5 w-5 text-[var(--ocean)]" />
                    Container Selection
                  </CardTitle>
                  <CardDescription>
                    Choose the container type for your shipment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Container Type</Label>
                    <Select value={containerType} onValueChange={(v) => setContainerType(v as ContainerType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(containerSpecs).map(([key, spec]) => (
                          <SelectItem key={key} value={key}>
                            {spec.name} - {spec.capacity} CBM, {(spec.maxPayload / 1000).toFixed(0)} MT
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Capacity</div>
                      <div className="text-xl font-bold text-[var(--ocean)]">{container.capacity} CBM</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Max Payload</div>
                      <div className="text-xl font-bold text-[var(--logistics)]">{(container.maxPayload / 1000).toFixed(1)} MT</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Efficiency</div>
                      <div className="text-xl font-bold" style={{ color: getEfficiencyColor(results.efficiency) }}>
                        {results.efficiency.toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Safety Factor</Label>
                      <Badge variant="outline">{(safetyFactor * 100).toFixed(0)}%</Badge>
                    </div>
                    <Select value={safetyFactor.toString()} onValueChange={(v) => setSafetyFactor(parseFloat(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">100% (No buffer)</SelectItem>
                        <SelectItem value="0.95">95% (5% buffer)</SelectItem>
                        <SelectItem value="0.9">90% (10% buffer)</SelectItem>
                        <SelectItem value="0.85">85% (15% buffer)</SelectItem>
                        <SelectItem value="0.8">80% (20% buffer)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Safety buffer accounts for dunnage, securing materials, and measurement tolerances
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--logistics)]" />
                    Cargo Items
                    <Badge variant="secondary" className="ml-auto">{cargoItems.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {cargoItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Item {index + 1}</span>
                          {cargoItems.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateItem(item.id, "name", e.target.value)}
                            placeholder="Product description"
                          />
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          <div className="space-y-2">
                            <Label className="text-xs">L</Label>
                            <Input
                              type="number"
                              value={item.length}
                              onChange={(e) => updateItem(item.id, "length", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">W</Label>
                            <Input
                              type="number"
                              value={item.width}
                              onChange={(e) => updateItem(item.id, "width", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">H</Label>
                            <Input
                              type="number"
                              value={item.height}
                              onChange={(e) => updateItem(item.id, "height", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Unit</Label>
                            <Select
                              value={item.unit}
                              onValueChange={(v) => updateItem(item.id, "unit", v)}
                            >
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cm">cm</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                                <SelectItem value="in">in</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Qty</Label>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Weight per unit (kg)</Label>
                            <Input
                              type="number"
                              value={item.weight}
                              onChange={(e) => updateItem(item.id, "weight", parseFloat(e.target.value) || 0)}
                            />
                          </div>
                          <div className="space-y-2 flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={item.stackable}
                                onChange={(e) => updateItem(item.id, "stackable", e.target.checked)}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">Stackable</span>
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <Button variant="outline" onClick={addItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cargo Item
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-[var(--ocean)]" />
                    Loading Analysis
                  </CardTitle>
                  <CardDescription>
                    {container.name} capacity analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Utilization Bars */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-[var(--ocean)]" />
                          Volume Utilization
                        </span>
                        <span className="font-medium">
                          {results.totalCBM.toFixed(2)} / {results.containerCBM} CBM
                        </span>
                      </div>
                      <Progress
                        value={Math.min(results.volumeUtilization, 100)}
                        className="h-3"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{Math.min(results.volumeUtilization, 100).toFixed(1)}%</span>
                        {results.volumeUtilization > 100 && (
                          <span className="text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Over capacity!
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-[var(--logistics)]" />
                          Weight Utilization
                        </span>
                        <span className="font-medium">
                          {(results.totalWeight / 1000).toFixed(2)} / {(results.containerPayload / 1000).toFixed(1)} MT
                        </span>
                      </div>
                      <Progress
                        value={Math.min(results.weightUtilization, 100)}
                        className="h-3"
                        style={{ 
                          // @ts-expect-error CSS custom property
                          "--progress-background": results.weightUtilization > 100 ? "#ef4444" : "var(--logistics)"
                        }}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{Math.min(results.weightUtilization, 100).toFixed(1)}%</span>
                        {results.weightUtilization > 100 && (
                          <span className="text-red-500 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Overweight!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Key Numbers */}
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      key={results.totalCBM}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center"
                    >
                      <div className="text-2xl font-bold text-[var(--ocean)]">
                        {results.totalCBM.toFixed(3)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total CBM</div>
                    </motion.div>
                    <motion.div
                      key={results.totalWeight}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center"
                    >
                      <div className="text-2xl font-bold text-[var(--logistics)]">
                        {(results.totalWeight / 1000).toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Weight (MT)</div>
                    </motion.div>
                  </div>

                  {/* Efficiency Score */}
                  <div className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Efficiency Score</span>
                      <span className="text-2xl font-bold" style={{ color: getEfficiencyColor(results.efficiency) }}>
                        {results.efficiency.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={results.efficiency} className="h-2" />
                  </div>

                  {/* Recommendation */}
                  <div className={`p-4 rounded-lg ${
                    results.warnings.length > 0 
                      ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800" 
                      : "bg-[var(--logistics)]/5 border border-[var(--logistics)]/20"
                  }`}>
                    <div className="flex items-start gap-3">
                      {results.warnings.length > 0 ? (
                        <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      )}
                      <div className="text-sm">
                        {results.warnings.length > 0 ? (
                          <div className="text-red-700 dark:text-red-300">
                            <p className="font-semibold mb-1">Warnings</p>
                            <ul className="space-y-1">
                              {results.warnings.map((warning, i) => (
                                <li key={i}>• {warning}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <p className="text-muted-foreground">{results.recommendation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Container Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-5 w-5 text-[var(--ocean)]" />
                    Container Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-[2.5/1] border-2 border-dashed border-[var(--ocean)]/30 rounded-lg overflow-hidden">
                    {/* Fill visualization */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--ocean)]/30 to-[var(--logistics)]/20 transition-all duration-500"
                      style={{ height: `${Math.min(results.volumeUtilization, 100)}%` }}
                    />
                    
                    {/* Weight indicator line */}
                    <motion.div
                      className="absolute left-0 right-0 border-t-2 border-dashed border-[var(--logistics)]"
                      style={{ bottom: `${Math.min(results.weightUtilization, 100)}%` }}
                    />
                    
                    {/* Container info overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-[var(--ocean)]">
                          {Math.min(results.volumeUtilization, 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {results.totalCBM.toFixed(2)} of {container.capacity} CBM
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="absolute bottom-2 right-2 flex gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-[var(--ocean)]/30 rounded" />
                        <span>Volume</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border-t-2 border-dashed border-[var(--logistics)]" />
                        <span>Weight</span>
                      </div>
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
                  Utilization Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={utilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="actual" name="Utilization" radius={[4, 4, 0, 0]}>
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
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[var(--logistics)]" />
                  Capacity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={containerCapacityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {containerCapacityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} CBM`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[var(--ocean)]" />
                  Cargo Item Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={cargoBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                      <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cbm" name="CBM" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="weight" name="Weight (kg)" stroke="#2E8B57" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
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
                  <div className="text-2xl font-bold text-[var(--ocean)]">{results.remainingCapacity.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Remaining CBM</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">{(results.remainingWeight / 1000).toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Remaining MT</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold" style={{ color: getEfficiencyColor(results.efficiency) }}>
                    {results.efficiency.toFixed(0)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Efficiency Score</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">{cargoItems.length}</div>
                  <div className="text-sm text-muted-foreground">Cargo Types</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Containers Tab */}
        <TabsContent value="containers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-[var(--ocean)]" />
                Container Type Comparison
              </CardTitle>
              <CardDescription>
                Compare different container types to find the best fit for your cargo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={containerComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={60} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="capacity" name="Capacity (CBM)" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="payload" name="Payload (MT)" fill="#2E8B57" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Standard Container Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Container Type</th>
                      <th className="text-left p-2">Internal Length</th>
                      <th className="text-left p-2">Internal Width</th>
                      <th className="text-left p-2">Internal Height</th>
                      <th className="text-left p-2">Capacity</th>
                      <th className="text-left p-2">Max Payload</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(containerSpecs).map(([key, spec]) => (
                      <tr key={key} className={`border-b ${containerType === key ? 'bg-muted/50' : ''}`}>
                        <td className="p-2 font-medium">{spec.name}</td>
                        <td className="p-2">{spec.internalLength?.toFixed(2) || 'N/A'} m</td>
                        <td className="p-2">{spec.internalWidth?.toFixed(2) || 'N/A'} m</td>
                        <td className="p-2">{spec.internalHeight?.toFixed(2) || 'N/A'} m</td>
                        <td className="p-2">{spec.capacity} CBM</td>
                        <td className="p-2">{(spec.maxPayload / 1000).toFixed(1)} MT</td>
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
                  Pro Tips for Container Loading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
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
                  Understanding Container Loading
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Container loading optimization is a critical aspect of international shipping that directly impacts 
                  your transportation costs and cargo safety. Proper load planning ensures maximum utilization of 
                  container space while maintaining the structural integrity of your goods during transit.
                </p>
                <p>
                  The two primary constraints in container loading are <strong>volume capacity</strong> (cubic meters) 
                  and <strong>weight capacity</strong> (payload in metric tons). Understanding which constraint limits 
                  your shipment helps you make informed decisions about packaging, consolidation, and container selection.
                </p>
                <p>
                  High-value, lightweight cargo typically hits volume limits before weight limits, making High Cube 
                  containers attractive despite similar payload ratings. Dense cargo like metals or construction 
                  materials often max out weight while leaving significant unused volume.
                </p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Formula:</h4>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs">
                    CBM = Length × Width × Height (in meters)
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs">
                    Utilization % = (Total CBM / Container Capacity) × 100
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Container Loading Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="weight-distribution">
                  <AccordionTrigger>Weight Distribution Guidelines</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Proper weight distribution is essential for safe handling and transport. Follow these guidelines:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Distribute weight evenly across the container floor</li>
                      <li>Place heavy items at the bottom and center of the container</li>
                      <li>Avoid concentrated loads - spread weight over larger floor area</li>
                      <li>Keep center of gravity low and centered</li>
                      <li>Maximum floor load: typically 4.5-7.5 tons per linear meter</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="securing">
                  <AccordionTrigger>Cargo Securing Methods</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Proper securing prevents cargo shift during transport. Common methods include:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Blocking and bracing with wooden structures</li>
                      <li>Strapping with steel or polyester bands</li>
                      <li>Dunnage bags for void filling</li>
                      <li>Shrink wrapping for unitized loads</li>
                      <li>Lashing for heavy machinery and project cargo</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="documentation">
                  <AccordionTrigger>Required Documentation</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ensure you have proper documentation for loaded containers:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Packing list with detailed cargo manifest</li>
                      <li>Container weight declaration (VGM)</li>
                      <li>Hazardous materials declaration (if applicable)</li>
                      <li>Temperature requirements for reefer cargo</li>
                      <li>Loading photos for insurance purposes</li>
                    </ul>
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
                Common questions about container loading and optimization
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
