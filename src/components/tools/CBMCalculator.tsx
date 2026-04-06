"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Box,
  Container,
  Layers,
  Ruler,
  RefreshCw,
  Download,
  Share2,
  ChevronRight,
  Calculator,
  BarChart3,
  Ship,
  BookOpen,
  HelpCircle,
  Anchor,
  Package,
  Truck,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { calculateCBMResult, ContainerFit, PalletFit, CBMResult } from "@/lib/calculations/cbm";
import { containerSpecs, lengthUnits, palletTypes } from "@/lib/constants/units";
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const COLORS = ["var(--ocean)", "var(--logistics)", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4"];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Badge animation variants
const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut" as const,
    },
  }),
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

export function CBMCalculator() {
  const [length, setLength] = useState<string>("100");
  const [width, setWidth] = useState<string>("80");
  const [height, setHeight] = useState<string>("60");
  const [quantity, setQuantity] = useState<string>("10");
  const [unit, setUnit] = useState<keyof typeof lengthUnits>("cm");
  const [stackable, setStackable] = useState(true);
  const [activeTab, setActiveTab] = useState("calculator");

  const result = useMemo(() => {
    return calculateCBMResult({
      length: parseFloat(length) || 0,
      width: parseFloat(width) || 0,
      height: parseFloat(height) || 0,
      quantity: parseInt(quantity) || 1,
      unit,
      stackable,
    });
  }, [length, width, height, quantity, unit, stackable]);

  const selectedUnit = lengthUnits[unit];

  // Prepare chart data
  const containerChartData = result.containerFits.slice(0, 6).map((fit) => ({
    name: fit.name.replace("'", ""),
    capacity: fit.capacity,
    used: fit.usedSpace,
    remaining: fit.remainingSpace,
    efficiency: fit.efficiency,
    fits: fit.fits,
  }));

  const efficiencyData = result.containerFits.slice(0, 6).map((fit, index) => ({
    container: fit.name.replace("'", ""),
    efficiency: fit.efficiency,
    fill: COLORS[index % COLORS.length],
  }));

  const palletComparisonData = result.palletFits.map((fit) => ({
    name: fit.name,
    units: fit.totalUnits,
    cbm: fit.usedCBM,
    perLayer: fit.perLayer,
    layers: fit.layersPossible,
  }));

  const volumeDistributionData = [
    { name: "Total CBM", value: result.totalCBM, color: "var(--ocean)" },
    { name: "Remaining in 40'HC", value: Math.max(0, 76.3 - result.totalCBM), color: "var(--logistics)" },
  ];

  // Radar chart data for container comparison
  const radarData = result.containerFits.slice(0, 4).map((fit) => ({
    metric: fit.name.split(" ")[0],
    efficiency: fit.efficiency,
    utilization: (fit.usedSpace / fit.capacity) * 100,
    fits: (fit.fits / 1000) * 100,
  }));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)] via-[var(--ocean-dark)] to-[var(--logistics)] p-8 text-white"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-1/3 top-1/2 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="relative z-10">
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Box className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">CBM Calculator</h1>
              <p className="text-white/80">Cubic Meter Volume & Container Loadability</p>
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-lg text-white/90 mb-6 max-w-2xl">
            Calculate the cubic meter volume of your cargo and determine optimal container utilization.
            Our advanced calculator helps you plan shipments efficiently, estimate costs accurately, and
            maximize container space utilization for ocean freight logistics.
          </motion.p>

          {/* Animated Badges */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
            {[
              { icon: Ship, label: "Ocean Freight", color: "from-blue-400 to-cyan-400" },
              { icon: Package, label: "Volume Calculation", color: "from-emerald-400 to-teal-400" },
              { icon: Container, label: "Container Loadability", color: "from-amber-400 to-orange-400" },
              { icon: Truck, label: "Multi-Modal Support", color: "from-purple-400 to-pink-400" },
            ].map((badge, i) => (
              <motion.div
                key={badge.label}
                custom={i}
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Badge
                  className={`bg-gradient-to-r ${badge.color} text-white px-4 py-2 text-sm font-medium shadow-lg`}
                >
                  <badge.icon className="h-4 w-4 mr-2" />
                  {badge.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="containers" className="gap-2">
            <Container className="h-4 w-4" />
            <span className="hidden sm:inline">Containers</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Box className="h-5 w-5 text-[var(--ocean)]" />
                    Cargo Dimensions
                  </CardTitle>
                  <CardDescription>
                    Enter the dimensions of your cargo to calculate CBM and container loadability
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Dimension Inputs */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length</Label>
                      <Input
                        id="length"
                        type="number"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        placeholder="Length"
                        className="focus:border-[var(--ocean)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        placeholder="Width"
                        className="focus:border-[var(--ocean)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        placeholder="Height"
                        className="focus:border-[var(--ocean)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={unit} onValueChange={(v) => setUnit(v as keyof typeof lengthUnits)}>
                        <SelectTrigger className="focus:border-[var(--ocean)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="m">m</SelectItem>
                          <SelectItem value="in">inches</SelectItem>
                          <SelectItem value="ft">feet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity and Stackable */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity (pieces)</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Number of items"
                        className="focus:border-[var(--ocean)]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stackable" className="flex items-center justify-between">
                        <span>Stackable Cargo</span>
                        <Switch
                          id="stackable"
                          checked={stackable}
                          onCheckedChange={setStackable}
                        />
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Enable if cargo can be stacked for better space utilization
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Summary */}
              <Card className="border-2 border-[var(--logistics)]/30">
                <CardHeader className="bg-gradient-to-r from-[var(--logistics)]/5 to-[var(--ocean)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[var(--logistics)]" />
                    CBM Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div
                      key={result.singleCBM}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center p-4 bg-muted/30 rounded-lg border border-[var(--ocean)]/20"
                    >
                      <div className="text-3xl font-bold text-[var(--ocean)]">
                        {result.singleCBM.toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">CBM per piece</div>
                    </motion.div>
                    <motion.div
                      key={result.totalCBM}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center p-4 bg-[var(--logistics)]/10 rounded-lg border border-[var(--logistics)]/30"
                    >
                      <div className="text-3xl font-bold text-[var(--logistics)]">
                        {result.totalCBM.toFixed(4)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Total CBM</div>
                    </motion.div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Dimensions (m):</span>
                      <span className="font-medium">
                        {(parseFloat(length) * lengthUnits[unit].toBase).toFixed(2)} × {" "}
                        {(parseFloat(width) * lengthUnits[unit].toBase).toFixed(2)} × {" "}
                        {(parseFloat(height) * lengthUnits[unit].toBase).toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Total Items:</span>
                      <span className="font-medium">{quantity} pieces</span>
                    </div>
                  </div>

                  {/* Quick Container Fit Summary */}
                  <div className="mt-4 p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-[var(--ocean)]" />
                      <span className="font-medium text-sm">Quick Container Match</span>
                    </div>
                    {result.containerFits.slice(0, 3).map((fit) => (
                      <div key={fit.type} className="flex items-center justify-between py-1">
                        <span className="text-sm text-muted-foreground">{fit.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{fit.fits} pcs</span>
                          <Badge variant="outline" className="text-xs">
                            {fit.efficiency}% eff.
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2 border-[var(--ocean)]/30 hover:bg-[var(--ocean)]/10">
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button variant="outline" className="flex-1 gap-2 border-[var(--logistics)]/30 hover:bg-[var(--logistics)]/10">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => {
                  setLength("100");
                  setWidth("80");
                  setHeight("60");
                  setQuantity("10");
                }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Container Loadability */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Container className="h-5 w-5 text-[var(--ocean)]" />
                    Container Loadability
                  </CardTitle>
                  <CardDescription>
                    How many pieces fit in each container type based on your cargo dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {result.containerFits.slice(0, 5).map((fit) => (
                      <ContainerFitCard key={fit.type} fit={fit} totalCBM={result.totalCBM} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pallet Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="h-5 w-5 text-[var(--logistics)]" />
                    Pallet Configuration
                  </CardTitle>
                  <CardDescription>
                    Estimated pallet loading options for different pallet standards
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.palletFits.map((fit) => (
                      <motion.div
                        key={fit.type}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <div className="font-medium">{fit.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {fit.perLayer} per layer × {fit.layersPossible} layers
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-[var(--logistics)]">{fit.totalUnits} pcs</div>
                          <div className="text-xs text-muted-foreground">{fit.usedCBM.toFixed(3)} CBM</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="mt-6 space-y-6">
          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Container Utilization Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Container Space Utilization
                </CardTitle>
                <CardDescription>
                  Compare used vs remaining space across container types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={containerChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="used" name="Used Space (CBM)" fill="var(--ocean)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="remaining" name="Remaining (CBM)" fill="var(--logistics)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Efficiency Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Efficiency Analysis
                </CardTitle>
                <CardDescription>
                  Container efficiency comparison for your cargo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={efficiencyData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="container" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Efficiency %"
                        dataKey="efficiency"
                        stroke="var(--ocean)"
                        fill="var(--ocean)"
                        fillOpacity={0.4}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Volume Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieChart className="h-5 w-5 text-[var(--ocean)]" />
                  Volume Distribution
                </CardTitle>
                <CardDescription>
                  Cargo volume vs available container space
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={volumeDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {volumeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => `${value.toFixed(3)} CBM`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pallet Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="h-5 w-5 text-[var(--logistics)]" />
                  Pallet Type Comparison
                </CardTitle>
                <CardDescription>
                  Units per pallet by pallet type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={palletComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="units"
                        name="Units per Pallet"
                        stroke="var(--logistics)"
                        fill="var(--logistics)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Statistics */}
          <Card className="border-2 border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">{result.totalCBM.toFixed(3)}</div>
                  <div className="text-sm text-muted-foreground">Total CBM</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">
                    {Math.max(...result.containerFits.map((f) => f.fits))}
                  </div>
                  <div className="text-sm text-muted-foreground">Max Items/Container</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">
                    {result.containerFits[0]?.efficiency.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Best Efficiency</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">
                    {Math.ceil(result.totalCBM / 76.3)}
                  </div>
                  <div className="text-sm text-muted-foreground">40'HC Needed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Containers Tab */}
        <TabsContent value="containers" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Container className="h-6 w-6 text-[var(--ocean)]" />
                ISO Container Specifications
              </CardTitle>
              <CardDescription>
                Complete reference for standard container types and their specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Type</th>
                        <th className="px-4 py-3 text-left font-medium">Internal (L×W×H)</th>
                        <th className="px-4 py-3 text-right font-medium">Capacity</th>
                        <th className="px-4 py-3 text-right font-medium">Max Payload</th>
                        <th className="px-4 py-3 text-right font-medium">Tare Weight</th>
                        <th className="px-4 py-3 text-center font-medium">TEU</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {Object.entries(containerSpecs).map(([key, spec]) => (
                        <tr key={key} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[var(--ocean)]" />
                              <span className="font-medium">{spec.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{spec.type}</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {spec.internalLength}×{spec.internalWidth}×{spec.internalHeight}m
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-[var(--ocean)]">
                            {spec.capacity} CBM
                          </td>
                          <td className="px-4 py-3 text-right">{spec.maxPayload.toLocaleString()} kg</td>
                          <td className="px-4 py-3 text-right">{spec.tareWeight.toLocaleString()} kg</td>
                          <td className="px-4 py-3 text-center">
                            <Badge variant="outline">{spec.teu}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pallet Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Layers className="h-6 w-6 text-[var(--logistics)]" />
                Standard Pallet Types
              </CardTitle>
              <CardDescription>
                Common pallet dimensions used in international shipping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(palletTypes).map(([key, spec]) => (
                  <div
                    key={key}
                    className="p-4 rounded-lg border border-[var(--logistics)]/20 bg-[var(--logistics)]/5 hover:border-[var(--logistics)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-[var(--logistics)]" />
                      <span className="font-medium">{spec.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {spec.length}m × {spec.width}m × {spec.height}m
                    </div>
                    <div className="mt-2 text-xs">
                      Area: <span className="font-medium">{(spec.length * spec.width).toFixed(2)} m²</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Container Selection Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-6 w-6 text-[var(--ocean)]" />
                Container Selection Guide
              </CardTitle>
              <CardDescription>
                When to use each container type based on your cargo requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-[var(--ocean)]/20">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--ocean)]" />
                    20' Standard Container
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ideal for heavy, dense cargo. Maximum payload of 28,180 kg makes it perfect for
                    machinery, metals, and construction materials. The smaller size allows easier
                    transport to inland destinations with weight restrictions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Heavy Cargo</Badge>
                    <Badge variant="outline" className="text-xs">Dense Goods</Badge>
                    <Badge variant="outline" className="text-xs">Inland Delivery</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-[var(--logistics)]/20">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--logistics)]" />
                    40' High Cube Container
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Most popular for lightweight, voluminous cargo. Extra 30cm height provides 13%
                    more volume than standard 40'. Perfect for furniture, apparel, and consumer
                    goods. Best value for volume-based shipments.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Light Cargo</Badge>
                    <Badge variant="outline" className="text-xs">Maximum Volume</Badge>
                    <Badge variant="outline" className="text-xs">Consumer Goods</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-amber-500/20">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    Refrigerated Container (Reefer)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Essential for temperature-sensitive cargo. Maintains temperatures from -35°C to
                    +30°C. Required for perishable foods, pharmaceuticals, and chemicals. Note
                    reduced internal dimensions due to insulation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Perishables</Badge>
                    <Badge variant="outline" className="text-xs">Pharma</Badge>
                    <Badge variant="outline" className="text-xs">Temperature Control</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-purple-500/20">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    Open Top & Flat Rack
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Designed for oversized cargo that won't fit through standard doors. Open tops
                    allow top-loading with cranes. Flat racks handle heavy machinery and project
                    cargo. Requires special handling and premium rates.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Oversized</Badge>
                    <Badge variant="outline" className="text-xs">Project Cargo</Badge>
                    <Badge variant="outline" className="text-xs">Heavy Machinery</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="mt-6 space-y-6">
          {/* What is CBM */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-6 w-6 text-[var(--ocean)]" />
                Understanding Cubic Meters (CBM)
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                A Cubic Meter (CBM) is the standard unit of volume measurement used in international
                shipping and logistics. One cubic meter equals the volume of a cube with sides
                measuring one meter each (1m × 1m × 1m = 1 CBM). Understanding CBM is fundamental
                to ocean freight logistics because shipping costs are calculated based on either
                the actual weight or the volumetric weight of cargo, whichever is greater. This
                practice ensures fair pricing for both dense and lightweight shipments.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The CBM calculation directly impacts your shipping costs, container utilization
                planning, and overall logistics strategy. For example, lightweight but bulky items
                like cotton, foam, or empty plastic containers may have low actual weight but
                occupy significant container space. In such cases, carriers charge based on the
                volume (CBM) rather than weight. Conversely, dense cargo like steel coils or
                machinery may be charged by weight. This concept is known as "chargeable weight"
                and is a critical factor in freight cost estimation.
              </p>

              <Alert className="mt-6 bg-[var(--ocean)]/5 border-[var(--ocean)]/20">
                <Info className="h-4 w-4 text-[var(--ocean)]" />
                <AlertTitle>Pro Tip</AlertTitle>
                <AlertDescription>
                  Always calculate CBM before booking to accurately estimate shipping costs and
                  determine the most economical container type for your cargo.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* CBM Formula */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-6 w-6 text-[var(--logistics)]" />
                CBM Calculation Formula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <code className="text-xl font-mono bg-background px-4 py-2 rounded-lg">
                    CBM = Length (m) × Width (m) × Height (m) × Quantity
                  </code>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  The formula calculates volume by multiplying the three dimensions. When dimensions
                  are in centimeters, divide by 1,000,000 (100³) to convert to cubic meters. For
                  inches, multiply by 0.0283 to get cubic meters (since 1 cubic foot = 0.0283 CBM).
                  Understanding these conversions is essential when working with international
                  suppliers who may use different measurement systems.
                </p>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 rounded-lg border border-[var(--ocean)]/20 bg-[var(--ocean)]/5">
                    <h4 className="font-medium mb-2">Example 1: Single Item</h4>
                    <p className="text-sm text-muted-foreground">
                      A crate measuring 120cm × 80cm × 60cm:<br />
                      CBM = 1.2 × 0.8 × 0.6 = <strong>0.576 CBM</strong>
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--logistics)]/20 bg-[var(--logistics)]/5">
                    <h4 className="font-medium mb-2">Example 2: Multiple Items</h4>
                    <p className="text-sm text-muted-foreground">
                      50 boxes, each 40cm × 30cm × 25cm:<br />
                      CBM = (0.4 × 0.3 × 0.25) × 50 = <strong>1.5 CBM</strong>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Container Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Container className="h-6 w-6 text-[var(--ocean)]" />
                Container Utilization Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Maximizing container utilization is crucial for cost-effective shipping. A well-planned
                shipment can significantly reduce per-unit shipping costs by optimizing the use of
                available container space. Container utilization is typically measured as a percentage
                of the total container capacity used. Industry best practices target 80-90% utilization
                for cost efficiency while maintaining practical loading constraints.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    <span className="font-medium">Good Utilization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    80-95% space utilization. Cargo fits well with minimal wasted space. Loading
                    and unloading remain practical. This is the target range for most shipments.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="font-medium">Under-utilization</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Below 70% utilization indicates potential for consolidation with other
                    shipments or choosing a smaller container. Consider LCL options.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Over-utilization Risk</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Attempting 100% utilization often causes practical issues with loading,
                    air circulation for certain goods, and compliance with weight limits.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg border border-[var(--logistics)]/20 bg-[var(--logistics)]/5">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[var(--logistics)]" />
                  Optimization Tips
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)]" />
                    <span>Stack cargo when possible to maximize vertical space utilization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)]" />
                    <span>Use standard pallet sizes for easier loading and better space efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)]" />
                    <span>Consider cargo orientation - sometimes rotating items improves fit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)]" />
                    <span>Account for dunnage and securing materials in your calculations</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Industry Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6 text-[var(--ocean)]" />
                Industry Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Following industry best practices ensures smooth shipping operations and helps
                  avoid costly mistakes. These guidelines have been developed through decades of
                  international trade experience and are recognized by major shipping lines, freight
                  forwarders, and logistics professionals worldwide.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-[var(--ocean)]/20">
                    <h4 className="font-medium mb-2 text-[var(--ocean)]">Documentation Accuracy</h4>
                    <p className="text-sm text-muted-foreground">
                      Always ensure CBM calculations match between commercial invoices, packing
                      lists, and booking confirmations. Discrepancies can cause delays, additional
                      charges, or customs holds. Double-check all measurements before finalizing
                      documents.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--logistics)]/20">
                    <h4 className="font-medium mb-2 text-[var(--logistics)]">Weight Considerations</h4>
                    <p className="text-sm text-muted-foreground">
                      Never exceed container payload limits regardless of available volume. A 40'HC
                      has 76.3 CBM capacity but only 28,600 kg payload. Dense cargo may hit weight
                      limits before filling the container volume. Always calculate both constraints.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--ocean)]/20">
                    <h4 className="font-medium mb-2 text-[var(--ocean)]">Palletization Strategy</h4>
                    <p className="text-sm text-muted-foreground">
                      Standard pallets (120×100cm or 120×80cm) maximize container space. Non-standard
                      pallets create wasted space and higher costs. Plan packaging dimensions to fit
                      pallet configurations efficiently from the start of product design.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--logistics)]/20">
                    <h4 className="font-medium mb-2 text-[var(--logistics)]">Insurance Calculations</h4>
                    <p className="text-sm text-muted-foreground">
                      Cargo insurance premiums often factor in CBM for valuation. Under-declaring
                      CBM may lead to coverage disputes during claims. Maintain accurate records
                      of actual measurements and packing configurations for all shipments.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HelpCircle className="h-6 w-6 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about CBM calculations and container shipping
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="faq-1" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-[var(--ocean)]">1</span>
                      </div>
                      <span>Why do shipping lines charge by CBM instead of weight?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 text-muted-foreground">
                    <p className="mb-3">
                      Shipping lines charge by CBM because vessel capacity is limited by space, not
                      just weight. A container filled with feather pillows weighs far less than one
                      filled with steel, but both occupy the same space on a vessel. CBM-based pricing
                      ensures fair allocation of container space costs.
                    </p>
                    <p>
                      In practice, carriers use a "chargeable weight" system - they calculate both
                      the actual weight and volumetric weight, then charge based on whichever is
                      greater. This protects carriers from carrying lightweight but bulky cargo at
                      unfairly low rates while ensuring shippers of dense goods aren't overcharged.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-[var(--logistics)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-[var(--logistics)]">2</span>
                      </div>
                      <span>How accurate do my CBM calculations need to be?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 text-muted-foreground">
                    <p className="mb-3">
                      CBM calculations should be as accurate as possible, typically within 1-2% of
                      actual measurements. Small errors can compound significantly: a 10% under-calculation
                      on a 40'HC could result in unexpected costs of several hundred dollars or
                      leave cargo stranded.
                    </p>
                    <p>
                      For booking purposes, always round up to the nearest 0.1 CBM. This provides
                      a safety margin for variations in packaging, pallet arrangement, and securing
                      materials. Remember to include pallets, dunnage, and any protective packaging
                      in your measurements.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-[var(--ocean)]">3</span>
                      </div>
                      <span>What's the difference between 20' and 40' container CBM costs?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 text-muted-foreground">
                    <p className="mb-3">
                      While a 40' container has roughly double the capacity of a 20' (67.7 vs 33.2 CBM),
                      freight rates for 40' containers are typically only 50-80% higher than 20' rates.
                      This makes 40' containers more economical per CBM for large shipments.
                    </p>
                    <p>
                      However, for heavy cargo, a 20' container often makes more sense. It has a higher
                      payload-to-volume ratio and is easier to handle at destinations with limited
                      equipment. Consider both CBM and weight when choosing container size, and always
                      calculate the cost per CBM for comparison.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-[var(--logistics)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-[var(--logistics)]">4</span>
                      </div>
                      <span>How do pallets affect CBM calculations?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 text-muted-foreground">
                    <p className="mb-3">
                      Pallets add to both the volume and weight of your shipment. A standard Euro
                      pallet (120×80cm) adds approximately 0.014 CBM and 20-25 kg per pallet. Always
                      include pallets in your calculations, especially for large shipments where
                      hundreds of pallets can significantly impact total CBM.
                    </p>
                    <p>
                      Palletization also affects container utilization. Floor-based loading typically
                      achieves higher space utilization (85-90%), while palletized cargo may only
                      reach 75-80% due to pallet gaps. However, pallets offer faster loading/unloading
                      and better cargo protection, often justifying the slight space efficiency trade-off.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-[var(--ocean)]">5</span>
                      </div>
                      <span>What is LCL and how does CBM affect LCL rates?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 text-muted-foreground">
                    <p className="mb-3">
                      LCL (Less than Container Load) is a shipping option for cargo that doesn't fill
                      an entire container. Your goods share container space with other shippers' cargo.
                      LCL rates are quoted per CBM, making accurate CBM calculation critical for
                      cost estimation.
                    </p>
                    <p>
                      LCL typically becomes cost-effective for shipments under 10-15 CBM. Beyond this
                      threshold, FCL (Full Container Load) often offers better value. LCL rates also
                      include minimum charges - even if your cargo is only 0.5 CBM, you might pay for
                      a 1 CBM minimum. Compare LCL vs FCL costs at different volume breakpoints.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-6" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-8 h-8 rounded-full bg-[var(--logistics)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-[var(--logistics)]">6</span>
                      </div>
                      <span>Why do my calculations show different CBM than my freight forwarder?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-11 text-muted-foreground">
                    <p className="mb-3">
                      Discrepancies between your CBM calculations and your freight forwarder's often
                      stem from different measurement approaches. Forwarders may include additional
                      factors like packaging bulge, irregular shapes, or stacking patterns that
                      affect real-world space requirements.
                    </p>
                    <p>
                      Some carriers apply "measurement rules" that round up dimensions or use standard
                      package sizes for common items. For example, a slightly bulging carton might be
                      measured at its widest point rather than nominal dimensions. Always clarify
                      measurement methodology with your forwarder and request detailed breakdowns if
                      discrepancies exceed 5%.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Help */}
          <Card className="border-2 border-[var(--ocean)]/20 bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <h3 className="font-medium">Still have questions?</h3>
                    <p className="text-sm text-muted-foreground">
                      Our logistics experts are here to help with complex calculations.
                    </p>
                  </div>
                </div>
                <Button className="bg-[var(--ocean)] hover:bg-[var(--ocean-dark)] text-white gap-2">
                  Contact Support
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Container Fit Card Component
function ContainerFitCard({ fit, totalCBM }: { fit: ContainerFit; totalCBM: number }) {
  const percentage = Math.min((totalCBM / fit.capacity) * 100, 100);
  const neededContainers = Math.ceil(totalCBM / fit.capacity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{fit.name}</div>
        <Badge
          variant={neededContainers <= 1 ? "default" : "secondary"}
          className={neededContainers <= 1 ? "bg-[var(--logistics)] hover:bg-[var(--logistics-dark)]" : ""}
        >
          {neededContainers} {neededContainers === 1 ? "container" : "containers"}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm mb-3">
        <div>
          <div className="text-muted-foreground">Capacity</div>
          <div className="font-medium">{fit.capacity} CBM</div>
        </div>
        <div>
          <div className="text-muted-foreground">Fits</div>
          <div className="font-medium text-[var(--ocean)]">{fit.fits} pcs</div>
        </div>
        <div>
          <div className="text-muted-foreground">Efficiency</div>
          <div className="font-medium text-[var(--logistics)]">{fit.efficiency}%</div>
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{percentage.toFixed(1)}% filled</span>
        <span>{fit.remainingSpace} CBM remaining</span>
      </div>
    </motion.div>
  );
}

export default CBMCalculator;
