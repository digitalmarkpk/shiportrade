"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck,
  Train,
  Ship,
  Anchor,
  MapPin,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  Leaf,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Route,
  Zap,
  Layers,
  Calculator,
  BarChart3,
  PieChart,
  Map,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  Target,
  Scale,
  Gauge,
  Package,
  ArrowLeftRight,
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Types
interface Waypoint {
  id: string;
  name: string;
  type: "origin" | "destination" | "transit";
}

interface TransportMode {
  id: string;
  name: string;
  icon: React.ElementType;
  speed: number;
  costPerKm: number;
  costPerHour: number;
  handlingCost: number;
  co2PerKm: number;
  reliability: number;
  minDistance: number;
  maxDistance: number;
  capacity: number;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

interface RouteSegment {
  id: string;
  fromWaypoint: string;
  toWaypoint: string;
  mode: string;
  distance: number;
  notes: string;
}

interface CostBreakdown {
  transportCost: number;
  handlingCost: number;
  waitingCost: number;
  totalCost: number;
}

interface SimulationResult {
  totalCost: number;
  totalTime: number;
  totalCO2: number;
  totalDistance: number;
  segmentResults: SegmentResult[];
  costBreakdown: CostBreakdown;
  modeBreakdown: { mode: string; cost: number; percentage: number }[];
  tradeOffScore: number;
  recommendations: string[];
}

interface SegmentResult {
  segmentId: string;
  mode: string;
  modeName: string;
  distance: number;
  cost: number;
  time: number;
  co2: number;
  handlingCost: number;
}

// Transport Modes Data
const transportModes: TransportMode[] = [
  {
    id: "truck",
    name: "Truck",
    icon: Truck,
    speed: 60,
    costPerKm: 1.20,
    costPerHour: 45,
    handlingCost: 150,
    co2PerKm: 0.62,
    reliability: 92,
    minDistance: 0,
    maxDistance: 2000,
    capacity: 25,
    description: "Road transport, door-to-door flexibility",
    advantages: ["Door-to-door delivery", "Flexible scheduling", "Fast for short distances", "Easy tracking"],
    disadvantages: ["Higher cost per km", "Traffic delays", "Driver rest requirements", "Weather dependent"],
  },
  {
    id: "rail",
    name: "Rail",
    icon: Train,
    speed: 40,
    costPerKm: 0.35,
    costPerHour: 30,
    handlingCost: 350,
    co2PerKm: 0.18,
    reliability: 88,
    minDistance: 300,
    maxDistance: 5000,
    capacity: 100,
    description: "Rail freight, efficient for long distances",
    advantages: ["Low cost per km", "Low emissions", "High capacity", "Scheduled services"],
    disadvantages: ["Fixed routes", "Requires intermodal transfer", "Less flexible timing", "Infrastructure dependent"],
  },
  {
    id: "barge",
    name: "Barge",
    icon: Ship,
    speed: 12,
    costPerHour: 20,
    costPerKm: 0.15,
    handlingCost: 500,
    co2PerKm: 0.08,
    reliability: 85,
    minDistance: 200,
    maxDistance: 3000,
    capacity: 500,
    description: "Inland waterway transport, very low cost",
    advantages: ["Lowest cost option", "Lowest emissions", "Very high capacity", "Reliable scheduling"],
    disadvantages: ["Slow transit times", "Limited routes", "Weather dependent", "Seasonal restrictions"],
  },
  {
    id: "shortsea",
    name: "Short-Sea",
    icon: Anchor,
    speed: 20,
    costPerKm: 0.20,
    costPerHour: 25,
    handlingCost: 600,
    co2PerKm: 0.12,
    reliability: 86,
    minDistance: 500,
    maxDistance: 5000,
    capacity: 800,
    description: "Coastal shipping, feeder services",
    advantages: ["Cost effective for coastal routes", "Medium capacity", "Lower emissions than truck", "Avoids road congestion"],
    disadvantages: ["Port handling required", "Weather delays", "Limited to coastal areas", "Port congestion risks"],
  },
];

// Predefined routes for quick selection
const predefinedRoutes = [
  {
    name: "Rotterdam to Munich (Rail)",
    waypoints: [
      { id: "1", name: "Rotterdam Port", type: "origin" as const },
      { id: "2", name: "Munich Distribution Center", type: "destination" as const },
    ],
    segments: [
      { fromWaypoint: "1", toWaypoint: "2", mode: "rail", distance: 850 },
    ],
  },
  {
    name: "Shanghai to Chengdu (Multimodal)",
    waypoints: [
      { id: "1", name: "Shanghai Port", type: "origin" as const },
      { id: "2", name: "Wuhan Terminal", type: "transit" as const },
      { id: "3", name: "Chengdu Warehouse", type: "destination" as const },
    ],
    segments: [
      { fromWaypoint: "1", toWaypoint: "2", mode: "barge", distance: 1100 },
      { fromWaypoint: "2", toWaypoint: "3", mode: "rail", distance: 1200 },
    ],
  },
  {
    name: "Hamburg to Prague (Truck-Rail)",
    waypoints: [
      { id: "1", name: "Hamburg Port", type: "origin" as const },
      { id: "2", name: "Berlin Rail Hub", type: "transit" as const },
      { id: "3", name: "Prague Distribution", type: "destination" as const },
    ],
    segments: [
      { fromWaypoint: "1", toWaypoint: "2", mode: "rail", distance: 290 },
      { fromWaypoint: "2", toWaypoint: "3", mode: "truck", distance: 350 },
    ],
  },
  {
    name: "Antwerp to Geneva (Multi-mode)",
    waypoints: [
      { id: "1", name: "Antwerp Port", type: "origin" as const },
      { id: "2", name: "Basel Terminal", type: "transit" as const },
      { id: "3", name: "Geneva Warehouse", type: "destination" as const },
    ],
    segments: [
      { fromWaypoint: "1", toWaypoint: "2", mode: "barge", distance: 600 },
      { fromWaypoint: "2", toWaypoint: "3", mode: "truck", distance: 260 },
    ],
  },
];

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#8B5CF6", "#EF4444"];

// Animated badge variants
const badgeVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  hover: { scale: 1.05 },
};

export default function IntermodalCostSimulation() {
  // State
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { id: "1", name: "Rotterdam Port", type: "origin" },
    { id: "2", name: "Duisburg Terminal", type: "transit" },
    { id: "3", name: "Munich Distribution", type: "destination" },
  ]);

  const [segments, setSegments] = useState<RouteSegment[]>([
    { id: "1", fromWaypoint: "1", toWaypoint: "2", mode: "barge", distance: 230, notes: "" },
    { id: "2", fromWaypoint: "2", toWaypoint: "3", mode: "rail", distance: 620, notes: "" },
  ]);

  const [cargoWeight, setCargoWeight] = useState("25");
  const [containerCount, setContainerCount] = useState("2");
  const [valuePerKg, setValuePerKg] = useState("50");
  const [priority, setPriority] = useState<"cost" | "balanced" | "time" | "emissions">("balanced");
  const [showCustomCosts, setShowCustomCosts] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  const [modeCosts, setModeCosts] = useState<Record<string, { perKm: number; perHour: number; handling: number }>>({
    truck: { perKm: 1.20, perHour: 45, handling: 150 },
    rail: { perKm: 0.35, perHour: 30, handling: 350 },
    barge: { perKm: 0.15, perHour: 20, handling: 500 },
    shortsea: { perKm: 0.20, perHour: 25, handling: 600 },
  });

  // Generate unique ID
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Add waypoint
  const addWaypoint = useCallback(() => {
    const newId = generateId();
    const newWaypoint: Waypoint = {
      id: newId,
      name: `New Location`,
      type: "transit",
    };
    setWaypoints(prev => {
      const updated = [...prev];
      const destIndex = updated.findIndex(w => w.type === "destination");
      updated.splice(destIndex, 0, newWaypoint);
      return updated;
    });
  }, []);

  // Remove waypoint
  const removeWaypoint = useCallback((id: string) => {
    setWaypoints(prev => prev.filter(w => w.id !== id));
    setSegments(prev => prev.filter(s => s.fromWaypoint !== id && s.toWaypoint !== id));
  }, []);

  // Update waypoint
  const updateWaypoint = useCallback((id: string, field: keyof Waypoint, value: string) => {
    setWaypoints(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  }, []);

  // Add segment
  const addSegment = useCallback(() => {
    const availablePairs: { from: string; to: string }[] = [];
    for (let i = 0; i < waypoints.length - 1; i++) {
      const fromId = waypoints[i].id;
      const toId = waypoints[i + 1].id;
      if (!segments.some(s => s.fromWaypoint === fromId && s.toWaypoint === toId)) {
        availablePairs.push({ from: fromId, to: toId });
      }
    }
    if (availablePairs.length > 0) {
      const pair = availablePairs[0];
      setSegments(prev => [...prev, {
        id: generateId(),
        fromWaypoint: pair.from,
        toWaypoint: pair.to,
        mode: "truck",
        distance: 100,
        notes: "",
      }]);
    }
  }, [waypoints, segments]);

  // Remove segment
  const removeSegment = useCallback((id: string) => {
    setSegments(prev => prev.filter(s => s.id !== id));
  }, []);

  // Update segment
  const updateSegment = useCallback((id: string, field: keyof RouteSegment, value: string | number) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  // Load predefined route
  const loadPredefinedRoute = useCallback((route: typeof predefinedRoutes[0]) => {
    const newWaypoints = route.waypoints.map(w => ({ ...w, id: generateId() }));
    const idMap: Record<string, string> = {};
    route.waypoints.forEach((w, i) => {
      idMap[w.id] = newWaypoints[i].id;
    });
    setWaypoints(newWaypoints);
    setSegments(route.segments.map(s => ({
      id: generateId(),
      fromWaypoint: idMap[s.fromWaypoint] || generateId(),
      toWaypoint: idMap[s.toWaypoint] || generateId(),
      mode: s.mode,
      distance: s.distance,
      notes: "",
    })));
  }, []);

  // Get mode info
  const getModeInfo = useCallback((modeId: string) => {
    return transportModes.find(m => m.id === modeId) || transportModes[0];
  }, []);

  // Calculate simulation
  const calculateSimulation = useCallback(() => {
    setIsCalculating(true);

    setTimeout(() => {
      const weight = parseFloat(cargoWeight) || 25;
      const containers = parseInt(containerCount) || 2;
      const valueDensity = parseFloat(valuePerKg) || 50;

      const segmentResults: SegmentResult[] = segments.map(segment => {
        const mode = getModeInfo(segment.mode);
        const costs = modeCosts[segment.mode] || { perKm: mode.costPerKm, perHour: mode.costPerHour, handling: mode.handlingCost };

        const transportCost = segment.distance * costs.perKm * containers;
        const handlingCost = costs.handling * containers;
        const time = (segment.distance / mode.speed) + 2;
        const waitingCost = time * costs.perHour * 0.5;

        return {
          segmentId: segment.id,
          mode: segment.id,
          modeName: mode.name,
          distance: segment.distance,
          cost: transportCost + handlingCost + waitingCost,
          time,
          co2: segment.distance * mode.co2PerKm * containers * weight,
          handlingCost,
        };
      });

      const totalCost = segmentResults.reduce((sum, r) => sum + r.cost, 0);
      const totalTime = segmentResults.reduce((sum, r) => sum + r.time, 0);
      const totalCO2 = segmentResults.reduce((sum, r) => sum + r.co2, 0);
      const totalDistance = segmentResults.reduce((sum, r) => sum + r.distance, 0);

      const modeBreakdown: { mode: string; cost: number; percentage: number }[] = [];
      const modeCostsMap: Record<string, number> = {};
      segmentResults.forEach(r => {
        if (!modeCostsMap[r.modeName]) modeCostsMap[r.modeName] = 0;
        modeCostsMap[r.modeName] += r.cost;
      });
      Object.entries(modeCostsMap).forEach(([mode, cost]) => {
        modeBreakdown.push({
          mode,
          cost,
          percentage: (cost / totalCost) * 100,
        });
      });

      let tradeOffScore = 50;

      const recommendations: string[] = [];
      const truckSegments = segments.filter(s => s.mode === "truck");

      if (truckSegments.some(s => s.distance > 500)) {
        recommendations.push("Consider switching truck segments over 500km to rail for cost savings");
      }
      if (!segments.some(s => s.mode === "barge") && segments.length > 1) {
        recommendations.push("Adding barge transport could reduce costs by up to 30% where waterways are available");
      }
      if (totalTime > 48 && priority === "time") {
        recommendations.push("Current route exceeds 48 hours - consider direct truck service for time-critical shipments");
      }
      if (totalCO2 > 5000) {
        recommendations.push("High CO2 emissions detected - modal shift to rail/barge can reduce emissions significantly");
      }
      if (segments.length > 3) {
        recommendations.push("Multiple handling points increase risk - consider consolidating segments");
      }
      if (valueDensity > 100 && priority !== "time") {
        recommendations.push("High-value cargo benefits from faster transit to reduce insurance and capital costs");
      }

      const costBreakdown: CostBreakdown = {
        transportCost: segmentResults.reduce((sum, r) => sum + (r.cost - r.handlingCost), 0),
        handlingCost: segmentResults.reduce((sum, r) => sum + r.handlingCost, 0),
        waitingCost: segmentResults.reduce((sum, r) => sum + r.time * (modeCosts[r.mode]?.perHour || 30) * 0.5, 0),
        totalCost,
      };

      const simulationResult: SimulationResult = {
        totalCost,
        totalTime,
        totalCO2,
        totalDistance,
        segmentResults,
        costBreakdown,
        modeBreakdown,
        tradeOffScore,
        recommendations,
      };

      setResult(simulationResult);
      setIsCalculating(false);
    }, 1000);
  }, [segments, cargoWeight, containerCount, valuePerKg, priority, modeCosts, getModeInfo]);

  // Reset form
  const resetForm = useCallback(() => {
    setWaypoints([
      { id: "1", name: "Rotterdam Port", type: "origin" },
      { id: "2", name: "Duisburg Terminal", type: "transit" },
      { id: "3", name: "Munich Distribution", type: "destination" },
    ]);
    setSegments([
      { id: "1", fromWaypoint: "1", toWaypoint: "2", mode: "barge", distance: 230, notes: "" },
      { id: "2", fromWaypoint: "2", toWaypoint: "3", mode: "rail", distance: 620, notes: "" },
    ]);
    setCargoWeight("25");
    setContainerCount("2");
    setValuePerKg("50");
    setPriority("balanced");
    setResult(null);
    toast.success("Form has been reset");
  }, []);

  // Export results as JSON
  const exportResults = useCallback(() => {
    if (!result) {
      toast.error("No results to export. Please run simulation first.");
      return;
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      route: {
        waypoints: waypoints.map(w => ({ name: w.name, type: w.type })),
        segments: segments.map(s => ({
          from: waypoints.find(w => w.id === s.fromWaypoint)?.name,
          to: waypoints.find(w => w.id === s.toWaypoint)?.name,
          mode: s.mode,
          distance: s.distance,
        })),
      },
      cargo: {
        weight: parseFloat(cargoWeight),
        containers: parseInt(containerCount),
        valuePerKg: parseFloat(valuePerKg),
        priority,
      },
      results: result,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `intermodal-simulation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results exported successfully");
  }, [result, waypoints, segments, cargoWeight, containerCount, valuePerKg, priority]);

  // Share results
  const shareResults = useCallback(() => {
    if (!result) {
      toast.error("No results to share. Please run simulation first.");
      return;
    }

    const shareText = `Intermodal Cost Simulation Results:
Total Cost: $${result.totalCost.toFixed(2)}
Total Time: ${result.totalTime.toFixed(1)} hours
Total Distance: ${result.totalDistance} km
CO2 Emissions: ${result.totalCO2.toFixed(1)} kg
Route: ${waypoints.map(w => w.name).join(" → ")}
Calculated on Shiportrade.com`;

    if (navigator.share) {
      navigator.share({
        title: "Intermodal Cost Simulation",
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        toast.success("Results copied to clipboard");
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Results copied to clipboard");
    }
  }, [result, waypoints]);

  // Chart data
  const costComparisonData = useMemo(() => {
    if (!result) return [];
    return result.segmentResults.map((r, i) => ({
      name: `Segment ${i + 1}`,
      cost: r.cost,
      time: r.time,
      co2: r.co2 / 100,
      mode: r.modeName,
    }));
  }, [result]);

  const pieChartData = useMemo(() => {
    if (!result) return [];
    return result.modeBreakdown.map((m, i) => ({
      name: m.mode,
      value: m.cost,
      percentage: m.percentage,
    }));
  }, [result]);

  const costVsTimeData = useMemo(() => {
    if (!result) return [];
    // Generate trade-off curve data
    const data = [];
    for (let i = 0; i <= 10; i++) {
      const multiplier = i / 10;
      data.push({
        scenario: `${i * 10}%`,
        cost: result.totalCost * (1 - multiplier * 0.3),
        time: result.totalTime * (1 + multiplier * 0.5),
      });
    }
    return data;
  }, [result]);

  const modeComparisonData = useMemo(() => {
    return transportModes.map(mode => ({
      name: mode.name,
      costPerKm: mode.costPerKm,
      speed: mode.speed,
      co2: mode.co2PerKm * 100,
      reliability: mode.reliability,
    }));
  }, []);

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

  const ModeIcon = ({ modeId }: { modeId: string }) => {
    const mode = getModeInfo(modeId);
    const Icon = mode.icon;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 overflow-hidden">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Intermodal Transport", color: "bg-[var(--ocean)]" },
                  { label: "Cost Simulation", color: "bg-[var(--logistics)]" },
                  { label: "Mode Optimization", color: "bg-amber-500" },
                ].map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    variants={badgeVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge className={`${badge.color} text-white px-3 py-1 text-sm`}>
                      {badge.label}
                    </Badge>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/20 flex items-center justify-center">
                  <Layers className="h-8 w-8 text-[var(--ocean)]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Intermodal Cost Simulation</h1>
                  <p className="text-muted-foreground mt-1">
                    Build, analyze, and optimize multi-modal transport routes with comprehensive cost and time analysis
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={resetForm} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" onClick={exportResults} disabled={!result} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button onClick={shareResults} disabled={!result} className="gap-2 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs - 5 Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-[var(--ocean)] data-[state=active]:text-white">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-[var(--ocean)] data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="modes" className="flex items-center gap-2 data-[state=active]:bg-[var(--ocean)] data-[state=active]:text-white">
            <ArrowLeftRight className="h-4 w-4" />
            <span className="hidden sm:inline">Modes</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 data-[state=active]:bg-[var(--ocean)] data-[state=active]:text-white">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 data-[state=active]:bg-[var(--ocean)] data-[state=active]:text-white">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          {/* Quick Load Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Load Routes
              </CardTitle>
              <CardDescription>Select a predefined route template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {predefinedRoutes.map((route, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => loadPredefinedRoute(route)}
                    className="p-4 rounded-lg border border-border cursor-pointer hover:border-[var(--ocean)] transition-colors bg-card"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="h-4 w-4 text-[var(--ocean)]" />
                      <span className="font-medium text-sm">{route.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {route.waypoints.map((w, i) => (
                        <span key={i} className="flex items-center">
                          {i > 0 && <ArrowRight className="h-3 w-3 mx-1" />}
                          {w.name.split(" ")[0]}
                        </span>
                      ))}
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {route.segments.length} segment{route.segments.length > 1 ? "s" : ""}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Waypoints Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Route Waypoints
                  </CardTitle>
                  <CardDescription>Define origin, transit points, and destination</CardDescription>
                </div>
                <Button onClick={addWaypoint} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Waypoint
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {waypoints.map((waypoint, index) => (
                    <motion.div
                      key={waypoint.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          waypoint.type === "origin" ? "bg-[var(--logistics)] text-white" :
                          waypoint.type === "destination" ? "bg-red-500 text-white" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {waypoint.type === "origin" ? <MapPin className="h-5 w-5" /> :
                           waypoint.type === "destination" ? <MapPin className="h-5 w-5" /> :
                           index + 1}
                        </div>
                        {index < waypoints.length - 1 && (
                          <div className="w-0.5 h-8 bg-border my-1" />
                        )}
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            {waypoint.type.charAt(0).toUpperCase() + waypoint.type.slice(1)}
                          </Label>
                          <Input
                            value={waypoint.name}
                            onChange={(e) => updateWaypoint(waypoint.id, "name", e.target.value)}
                            placeholder="Location name"
                            className="mt-1"
                          />
                        </div>
                        {waypoint.type === "transit" && (
                          <div className="md:col-span-2 flex items-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWaypoint(waypoint.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Transport Segments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Transport Segments
                  </CardTitle>
                  <CardDescription>Configure mode and distance for each leg</CardDescription>
                </div>
                <Button onClick={addSegment} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Segment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {segments.map((segment, index) => {
                  const fromWaypoint = waypoints.find(w => w.id === segment.fromWaypoint);
                  const toWaypoint = waypoints.find(w => w.id === segment.toWaypoint);
                  const mode = getModeInfo(segment.mode);

                  return (
                    <motion.div
                      key={segment.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20">
                            {fromWaypoint?.name || "Origin"}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20">
                            {toWaypoint?.name || "Destination"}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSegment(segment.id)}
                          className="ml-auto text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>From Waypoint</Label>
                          <Select
                            value={segment.fromWaypoint}
                            onValueChange={(v) => updateSegment(segment.id, "fromWaypoint", v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {waypoints.map((w) => (
                                <SelectItem key={w.id} value={w.id}>
                                  {w.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>To Waypoint</Label>
                          <Select
                            value={segment.toWaypoint}
                            onValueChange={(v) => updateSegment(segment.id, "toWaypoint", v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {waypoints.map((w) => (
                                <SelectItem key={w.id} value={w.id}>
                                  {w.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Transport Mode</Label>
                          <Select
                            value={segment.mode}
                            onValueChange={(v) => updateSegment(segment.id, "mode", v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {transportModes.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                  <div className="flex items-center gap-2">
                                    <m.icon className="h-4 w-4" />
                                    {m.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Distance (km)</Label>
                          <Input
                            type="number"
                            value={segment.distance}
                            onChange={(e) => updateSegment(segment.id, "distance", parseFloat(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ModeIcon modeId={segment.mode} />
                          {mode.name}
                        </span>
                        <span>Speed: {mode.speed} km/h</span>
                        <span>Est. Time: {formatNumber(segment.distance / mode.speed, 1)} hrs</span>
                        <span>CO2: {formatNumber(segment.distance * mode.co2PerKm)} kg/container</span>
                      </div>
                    </motion.div>
                  );
                })}
                {segments.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No segments defined. Add waypoints and create segments to build your route.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cargo Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <Package className="h-5 w-5" />
                Cargo & Priority Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label>Cargo Weight (tons)</Label>
                  <Input
                    type="number"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Container Count</Label>
                  <Input
                    type="number"
                    value={containerCount}
                    onChange={(e) => setContainerCount(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Value per kg (USD)</Label>
                  <Input
                    type="number"
                    value={valuePerKg}
                    onChange={(e) => setValuePerKg(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v: typeof priority) => setPriority(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cost">Cost Minimization</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="time">Time Critical</SelectItem>
                      <SelectItem value="emissions">Low Emissions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={calculateSimulation}
                  disabled={isCalculating || segments.length === 0}
                  className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white px-8 py-6 text-lg"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Run Simulation
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <Card className="bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--ocean)]/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Cost</p>
                      <p className="text-2xl font-bold text-[var(--ocean)]">{formatCurrency(result.totalCost)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-[var(--ocean)]/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-[var(--logistics)]/10 to-[var(--logistics)]/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Time</p>
                      <p className="text-2xl font-bold text-[var(--logistics)]">{formatNumber(result.totalTime, 1)} hrs</p>
                    </div>
                    <Clock className="h-8 w-8 text-[var(--logistics)]/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Distance</p>
                      <p className="text-2xl font-bold text-amber-600">{formatNumber(result.totalDistance)} km</p>
                    </div>
                    <Route className="h-8 w-8 text-amber-500/50" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">CO2 Emissions</p>
                      <p className="text-2xl font-bold text-green-600">{formatNumber(result.totalCO2)} kg</p>
                    </div>
                    <Leaf className="h-8 w-8 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          {!result ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                  <p className="text-muted-foreground mb-4">Run a simulation in the Calculator tab to see detailed analysis</p>
                  <Button onClick={() => setActiveTab("calculator")}>
                    Go to Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Cost Breakdown Pie Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Cost by Mode
                    </CardTitle>
                    <CardDescription>Distribution of transport costs by mode</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown Bar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Segment Comparison
                    </CardTitle>
                    <CardDescription>Cost, time, and emissions by segment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                          <YAxis stroke="hsl(var(--muted-foreground))" />
                          <Tooltip
                            contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                          />
                          <Legend />
                          <Bar dataKey="cost" name="Cost ($)" fill="#0F4C81" />
                          <Bar dataKey="time" name="Time (hrs)" fill="#2E8B57" />
                          <Bar dataKey="co2" name="CO2 (kg/100)" fill="#F59E0B" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost vs Time Trade-off Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Cost vs Time Trade-off Analysis
                  </CardTitle>
                  <CardDescription>Understanding the relationship between cost optimization and transit time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costVsTimeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="scenario" stroke="hsl(var(--muted-foreground))" />
                        <YAxis yAxisId="left" stroke="#0F4C81" />
                        <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                        <Tooltip
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                        />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="cost"
                          name="Cost ($)"
                          stroke="#0F4C81"
                          strokeWidth={3}
                          dot={{ fill: "#0F4C81" }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="time"
                          name="Time (hrs)"
                          stroke="#2E8B57"
                          strokeWidth={3}
                          dot={{ fill: "#2E8B57" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-[var(--ocean)]">Detailed Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-[var(--ocean)]/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Route className="h-5 w-5 text-[var(--ocean)]" />
                          <span className="font-medium">Transport Cost</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--ocean)]">{formatCurrency(result.costBreakdown.transportCost)}</p>
                        <p className="text-sm text-muted-foreground">{((result.costBreakdown.transportCost / result.totalCost) * 100).toFixed(1)}% of total</p>
                      </div>
                      <div className="p-4 rounded-lg bg-[var(--logistics)]/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Layers className="h-5 w-5 text-[var(--logistics)]" />
                          <span className="font-medium">Handling Cost</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--logistics)]">{formatCurrency(result.costBreakdown.handlingCost)}</p>
                        <p className="text-sm text-muted-foreground">{((result.costBreakdown.handlingCost / result.totalCost) * 100).toFixed(1)}% of total</p>
                      </div>
                      <div className="p-4 rounded-lg bg-amber-500/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-amber-600" />
                          <span className="font-medium">Waiting Cost</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-600">{formatCurrency(result.costBreakdown.waitingCost)}</p>
                        <p className="text-sm text-muted-foreground">{((result.costBreakdown.waitingCost / result.totalCost) * 100).toFixed(1)}% of total</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Optimization Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <CheckCircle className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Tab 3: Modes */}
        <TabsContent value="modes" className="space-y-6">
          {/* Mode Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Mode Comparison
              </CardTitle>
              <CardDescription>Compare key metrics across all transport modes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modeComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Legend />
                    <Bar dataKey="costPerKm" name="Cost per km ($)" fill="#0F4C81" />
                    <Bar dataKey="speed" name="Speed (km/h)" fill="#2E8B57" />
                    <Bar dataKey="reliability" name="Reliability (%)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Individual Mode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transportModes.map((mode) => (
              <Card key={mode.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--ocean)]/20 flex items-center justify-center">
                      <mode.icon className="h-6 w-6 text-[var(--ocean)]" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mode.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mode.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Cost per km</p>
                      <p className="text-lg font-semibold">{formatCurrency(mode.costPerKm)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Speed</p>
                      <p className="text-lg font-semibold">{mode.speed} km/h</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">CO2 per km</p>
                      <p className="text-lg font-semibold">{mode.co2PerKm} kg</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Reliability</p>
                      <p className="text-lg font-semibold">{mode.reliability}%</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Advantages</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {mode.advantages.map((adv, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {adv}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Disadvantages</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {mode.disadvantages.map((dis, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-red-500" />
                            {dis}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Optimal distance:</span>
                      <span className="font-medium">{mode.minDistance} - {mode.maxDistance} km</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">{mode.capacity} {mode.id === "truck" ? "tons" : "TEU"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mode Selection Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <Target className="h-5 w-5" />
                Mode Selection Decision Guide
              </CardTitle>
              <CardDescription>When to choose each transport mode</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3">Scenario</th>
                      <th className="text-left p-3">Best Mode</th>
                      <th className="text-left p-3">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-3">Distance &lt; 300km</td>
                      <td className="p-3"><Badge className="bg-[var(--ocean)]">Truck</Badge></td>
                      <td className="p-3 text-muted-foreground">Direct delivery, no handling costs offset benefits</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Distance 300-2000km, cost priority</td>
                      <td className="p-3"><Badge className="bg-[var(--logistics)]">Rail</Badge></td>
                      <td className="p-3 text-muted-foreground">Lower per-km cost offsets handling</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Waterway available, time flexible</td>
                      <td className="p-3"><Badge className="bg-amber-500">Barge</Badge></td>
                      <td className="p-3 text-muted-foreground">Lowest cost and emissions option</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-3">Time-critical, any distance</td>
                      <td className="p-3"><Badge className="bg-[var(--ocean)]">Truck</Badge></td>
                      <td className="p-3 text-muted-foreground">Fastest door-to-door option</td>
                    </tr>
                    <tr>
                      <td className="p-3">Sustainability priority</td>
                      <td className="p-3"><Badge className="bg-[var(--logistics)]">Rail/Barge</Badge></td>
                      <td className="p-3 text-muted-foreground">70-80% lower CO2 emissions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6">
          {/* Understanding Intermodal Transport */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Understanding Intermodal Transport
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Intermodal transport refers to the movement of freight using multiple modes of transportation—such as trucks, trains, ships, and barges—without handling the freight itself when changing modes. This approach leverages the strengths of each transportation mode while minimizing their individual weaknesses. The concept originated in the 1930s with the development of standardized shipping containers, which revolutionized global trade by enabling seamless transfers between ships, trains, and trucks. Today, intermodal transport is a cornerstone of modern supply chains, offering businesses the ability to optimize for cost, speed, reliability, and environmental impact simultaneously. The key to successful intermodal transport lies in understanding the break-even points where the lower per-kilometer costs of rail and barge offset the higher handling and transfer costs compared to direct truck transport. For distances over 300-500 kilometers, intermodal solutions typically become cost-effective, with savings increasing proportionally to distance. The European intermodal network has grown significantly, with major rail corridors connecting ports to inland terminals, while China&apos;s Belt and Road Initiative has created new intermodal opportunities across Eurasia.
              </p>
            </CardContent>
          </Card>

          {/* Benefits and Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Benefits and Challenges of Intermodal Transport
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Intermodal transport offers compelling benefits that make it increasingly attractive for modern supply chains. Cost savings of 20-40% over long distances are common, as rail and barge rates per kilometer are significantly lower than trucking. Environmental benefits are equally impressive, with rail producing approximately 70% less CO2 per ton-kilometer than trucking, and barge achieving up to 80% reduction. Reliability can also be higher, as rail and barge services run on fixed schedules, avoiding the variability of road congestion, driver rest requirements, and weather-related delays. However, intermodal transport also presents challenges that must be carefully managed. Transit times are typically longer, adding 1-3 days for routes under 1000 kilometers, which may not suit time-critical shipments. The need for transshipment at terminals introduces handling risks and potential delays, while fixed route networks limit flexibility compared to door-to-door trucking. Successful intermodal implementation requires careful route planning, reliable terminal partners, and realistic expectations about transit times.
              </p>
            </CardContent>
          </Card>

          {/* Mode Selection Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <Target className="h-5 w-5" />
                Mode Selection Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Choosing the right transport mode or combination requires evaluating multiple factors specific to each shipment and business context. Distance is the primary determinant: under 300 kilometers, direct trucking is almost always optimal due to minimal handling costs; between 300-2000 kilometers, rail becomes competitive and often superior on cost; over 2000 kilometers, multi-modal solutions combining rail, barge, and short-sea shipping typically offer the best value. Shipment urgency also plays a critical role—time-critical cargo may require air or direct truck service regardless of distance, while planned shipments can leverage slower but cheaper modes. Cargo characteristics matter significantly: high-value goods justify faster transport to minimize inventory carrying costs and insurance exposure, while low-value bulk commodities can absorb longer transit times. The availability of infrastructure is another key factor—rail requires access to terminals with intermodal capability, while barge transport is limited to navigable waterways with adequate depth and lock capacity. Seasonal variations, such as low water levels in summer or frozen waterways in winter, must also be factored into mode selection decisions.
              </p>
            </CardContent>
          </Card>

          {/* Cost Optimization Strategies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Cost Optimization Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Maximizing cost efficiency in intermodal transport requires a systematic approach that addresses multiple aspects of the supply chain. Consolidation is fundamental—combining smaller shipments into full container loads (FCL) or full truck loads (FTL) achieves better utilization and lower per-unit costs. Container selection also matters: choosing the right container size and type for your cargo prevents paying for unused capacity or incurring special equipment surcharges. Terminal selection can significantly impact overall costs—some terminals offer faster handling and better rail connections, reducing dwell time and drayage distances. Route optimization through simulation tools, like this calculator, helps identify the most cost-effective combination of modes and waypoints. Timing strategies include shipping during off-peak periods when capacity is more readily available and rates are lower. Backhaul optimization—finding return loads for otherwise empty containers or trucks—can reduce net transport costs by 20-30%. Finally, long-term contracts with carriers and terminals often provide preferential rates compared to spot market bookings, particularly for high-volume shippers who can commit to regular volumes.
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Pro Tips for Intermodal Success
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Start with the break-even analysis",
                    description: "Calculate the distance at which intermodal becomes cheaper than direct truck: Break-even = Total handling costs / (Truck rate - Intermodal rate per km).",
                    icon: Calculator,
                  },
                  {
                    title: "Choose terminals strategically",
                    description: "Select terminals with efficient handling, good rail connections, and reasonable drayage distances to minimize total transit time and costs.",
                    icon: MapPin,
                  },
                  {
                    title: "Plan for buffer time",
                    description: "Add 1-2 days buffer to intermodal transit times for handling delays, terminal congestion, and potential scheduling variations.",
                    icon: Clock,
                  },
                  {
                    title: "Consider reverse logistics",
                    description: "Plan return journeys to avoid empty container repositioning costs, which can add 20-30% to total transport expenses.",
                    icon: RefreshCw,
                  },
                  {
                    title: "Track and measure performance",
                    description: "Monitor on-time delivery rates, cost per km, and emissions per shipment to continuously optimize your intermodal strategy.",
                    icon: TrendingUp,
                  },
                  {
                    title: "Build carrier relationships",
                    description: "Develop strong partnerships with rail and barge operators for better rates, priority service, and reliability during peak seasons.",
                    icon: Target,
                  },
                ].map((tip, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-border hover:border-[var(--ocean)] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                        <tip.icon className="h-5 w-5 text-[var(--ocean)]" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Ignoring total landed costs",
                    description: "Focusing only on transport rates while ignoring handling fees, drayage costs, and inventory carrying costs can lead to suboptimal mode choices. Always calculate the total door-to-door cost including all intermediate steps.",
                  },
                  {
                    title: "Underestimating transit time variability",
                    description: "Intermodal transit times can vary significantly due to terminal congestion, rail delays, or weather conditions. Failing to account for this variability can result in missed delivery windows and customer dissatisfaction.",
                  },
                  {
                    title: "Overlooking cargo characteristics",
                    description: "High-value, time-sensitive, or fragile cargo may not be suitable for intermodal transport despite cost advantages. The risk of damage during handling and the cost of capital tied up in transit must be considered.",
                  },
                  {
                    title: "Not planning for contingencies",
                    description: "Intermodal routes can be disrupted by labor strikes, infrastructure failures, or natural disasters. Having backup routes and carrier alternatives is essential for supply chain resilience.",
                  },
                  {
                    title: "Neglecting environmental metrics",
                    description: "With increasing regulatory pressure and customer expectations around sustainability, ignoring CO2 emissions in mode selection can create future liabilities and missed opportunities for carbon reduction.",
                  },
                ].map((mistake, index) => (
                  <div key={index} className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[var(--ocean)] flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Comprehensive answers to common questions about intermodal transport</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="faq-1" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                    What is intermodal transport and how does it differ from multimodal transport?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    <p className="leading-relaxed">
                      While the terms are often used interchangeably, there is a technical distinction. Intermodal transport specifically refers to freight movement using multiple modes where the freight is transported in a single loading unit (typically a container or swap body) that is transferred between modes without unpacking the goods. The key feature is that the freight itself is not handled during modal transfers—only the container moves. This contrasts with multimodal transport, which may involve multiple modes but could include breaking bulk or repackaging goods between modes. In practice, intermodal transport offers greater security, reduced handling damage, and faster transfers because containers are designed to move seamlessly between ships, trains, and trucks using standardized handling equipment. The standardization of container dimensions (ISO containers) has been fundamental to intermodal success, enabling global supply chains to operate efficiently. Today&apos;s intermodal systems handle everything from consumer goods to automotive parts to temperature-sensitive products, all benefiting from the ability to optimize each segment of the journey for its particular strengths.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                    How do I calculate whether intermodal is cost-effective for my route?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    <p className="leading-relaxed">
                      Determining intermodal cost-effectiveness requires comparing total door-to-door costs, not just per-kilometer rates. The break-even analysis formula is: Break-even Distance = Total Fixed Costs / (Truck Rate - Intermodal Rate per km). Fixed costs include terminal handling fees (typically $150-600 per transfer), drayage charges to/from terminals, and any additional insurance or documentation costs. For example, if handling costs total $500 and the truck rate is $1.20/km while intermodal is $0.35/km, the break-even distance is approximately 588 km. Beyond this distance, intermodal becomes increasingly attractive. However, you must also consider the value of time: high-value cargo incurs inventory carrying costs during extended transit, which can be calculated as: Daily Carrying Cost = Cargo Value × Annual Carrying Cost Rate / 365. If cargo worth $100,000 has a 15% annual carrying cost, each additional day in transit costs approximately $41. This calculation helps determine whether the cost savings of intermodal justify the longer transit time for your specific cargo and business context.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                    What are the environmental benefits of intermodal transport?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    <p className="leading-relaxed">
                      Intermodal transport offers significant environmental advantages, primarily through modal shift from road to rail or water transport. Rail freight produces approximately 0.18 kg of CO2 per ton-kilometer compared to 0.62 kg for trucking—a 70% reduction. Barge transport is even cleaner at approximately 0.08 kg CO2 per ton-kilometer, representing an 87% reduction. Beyond carbon emissions, intermodal transport reduces other environmental impacts: lower particulate matter and NOx emissions improve air quality, reduced road congestion decreases overall transport system emissions, and less road wear extends infrastructure lifespan. Many companies now include intermodal strategies in their sustainability reporting and carbon reduction commitments. The EU&apos;s Green Deal and similar regulations are accelerating this shift by internalizing environmental costs through carbon pricing and emissions trading schemes. For companies with science-based targets or net-zero commitments, intermodal transport is often essential for achieving Scope 3 emissions reductions. Additionally, rail and water transport produce significantly less noise pollution, making them more suitable for operations near residential areas or during nighttime hours when truck restrictions may apply.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                    How reliable is intermodal transport compared to direct trucking?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    <p className="leading-relaxed">
                      Intermodal reliability depends on multiple factors but generally ranges from 85-92% on-time delivery for well-established routes. This compares favorably to long-haul trucking, which faces challenges including driver availability, hours-of-service regulations, traffic congestion, and weather-related delays. Rail services run on published schedules that are largely independent of road conditions, providing more predictable transit times. Major intermodal corridors in Europe and North America have invested heavily in terminal efficiency and track capacity, achieving reliability rates above 90%. However, reliability varies significantly by route—well-served corridors with frequent departures and efficient terminals perform better than routes with limited service or congested terminals. To maximize reliability, work with established intermodal operators who have terminal partnerships and contingency plans for disruptions. Real-time tracking has improved intermodal visibility, allowing proactive management of delays. For time-critical shipments, consider guaranteed service options that many rail operators offer, which provide priority handling and compensation for delays, bringing reliability closer to 95% or higher.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                    What types of cargo are best suited for intermodal transport?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    <p className="leading-relaxed">
                      Intermodal transport excels with cargo types that can tolerate longer transit times and benefit from cost savings or improved security. Containerized consumer goods, automotive parts, electronics, and non-perishable foods are ideal candidates. These commodities typically have predictable demand patterns that allow advance planning for intermodal transit times. Bulk commodities in specialized containers—such as chemicals, grains, or resins—also work well, particularly over long distances where per-unit cost savings are significant. Temperature-controlled intermodal service has improved dramatically, making refrigerated goods increasingly viable. Cargo that is less suitable includes time-sensitive goods (unless using expedited intermodal services), fragile items with high handling damage risk, irregularly shaped cargo that doesn&apos;t containerize efficiently, and very high-value goods where insurance and security costs favor faster transport. The decision should also consider cargo value density—low-value, high-weight cargo benefits most from intermodal&apos;s lower rates, while high-value, low-weight cargo may justify premium transport to minimize inventory costs and risk exposure.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-6" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                    How do seasonal factors affect intermodal transport planning?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    <p className="leading-relaxed">
                      Seasonal variations significantly impact intermodal operations and should be factored into planning. Peak shipping seasons—typically Q4 holiday buildup and spring agricultural movements—create capacity constraints and rate increases across all modes. Booking intermodal capacity early (4-6 weeks ahead) is advisable during these periods. Barge transport faces unique seasonal challenges: European rivers experience low water levels in late summer that may restrict vessel loading, while winter ice can close northern waterways entirely. Rail intermodal is more consistent year-round but can face capacity constraints during peak seasons and may experience delays during extreme weather. Understanding these patterns allows strategic planning: building inventory during off-peak periods, securing long-term capacity contracts for predictable volumes, and maintaining flexibility with spot market bookings for variable demand. Some shippers use intermodal for baseline volumes while maintaining trucking contracts for peak overflow and expedited needs. Climate change is increasing weather-related disruptions, making diversification and contingency planning more important than ever for resilient supply chains.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-7" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                    What infrastructure is needed for intermodal operations?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    <p className="leading-relaxed">
                      Successful intermodal operations require coordinated infrastructure across multiple nodes. Terminals are the critical interface points—they need container handling equipment (gantry cranes, reach stackers), storage yards for container staging, and efficient gate systems for truck processing. Rail-served terminals require track infrastructure with sufficient length for full trains and multiple loading/unloading positions. Inland terminals or dry ports extend intermodal reach beyond coastal areas, providing rail access for landlocked regions. Connecting infrastructure includes dedicated rail freight corridors that separate cargo from passenger traffic, improving reliability and capacity. Port infrastructure must accommodate both deep-sea vessels and intermodal connections, with efficient container flow between ship, rail, and truck modes. Information systems are equally important—terminal operating systems, train scheduling software, and customer visibility platforms enable efficient coordination. For shippers considering intermodal, evaluate the quality and capacity of terminals along your route, the frequency and reliability of rail or barge services, and the quality of first/last-mile road connections to your facilities.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-8" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                    How is technology transforming intermodal transport?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    <p className="leading-relaxed">
                      Technology is revolutionizing intermodal operations across multiple dimensions. Real-time tracking through GPS, IoT sensors, and smart containers provides unprecedented visibility into cargo location and condition. This enables proactive exception management when delays occur and supports supply chain optimization through better data. Terminal automation is improving handling efficiency—with automated gantry cranes, yard management systems, and digital gate processes reducing dwell times by 20-30%. Digital platforms are streamlining booking, documentation, and invoicing processes that previously required manual intervention. Blockchain technology is being piloted for secure, transparent documentation that could replace paper bills of lading. Predictive analytics help optimize route selection, predict delays, and schedule maintenance to prevent equipment failures. Autonomous vehicles are being tested for first/last-mile drayage operations, potentially reducing costs and improving terminal connectivity. For shippers, these advances mean better reliability, lower costs, and improved visibility—but also require investment in digital integration with carrier systems. The companies gaining the most from intermodal are those embracing these technologies while maintaining the human expertise needed for complex logistics decisions.
                    </p>
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
