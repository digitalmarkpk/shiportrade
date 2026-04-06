"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Plane,
  Train,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Route,
  Zap,
  BarChart3,
  RefreshCw,
  Star,
  Shield,
  Leaf,
  Gauge,
  Box,
  Weight,
  Thermometer,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
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
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Cell,
} from "recharts";

// Types
interface TransportMode {
  id: string;
  name: string;
  icon: React.ElementType;
  speed: number; // km/h average
  costPerKg: number; // $ per kg per 1000km
  co2PerKg: number; // kg CO2 per kg per 1000km
  reliability: number; // percentage
  capacity: string;
  avgDelay: number; // days
  minWeight: number; // kg
  maxWeight: number; // kg
  optimalDistance: { min: number; max: number }; // km
  description: string;
}

interface CargoCharacteristics {
  weight: number;
  volume: number;
  value: number;
  type: string;
  temperatureSensitive: boolean;
  hazardous: boolean;
  fragile: boolean;
  timeSensitive: boolean;
}

interface Priorities {
  transitTime: number; // 0-100
  cost: number; // 0-100
  reliability: number; // 0-100
  sustainability: number; // 0-100
}

interface ModeResult {
  mode: TransportMode;
  totalCost: number;
  transitDays: number;
  co2Emissions: number;
  reliabilityScore: number;
  overallScore: number;
  recommendation: string;
  pros: string[];
  cons: string[];
  isRecommended: boolean;
}

interface ComparisonMatrix {
  cost: { [key: string]: number };
  time: { [key: string]: number };
  reliability: { [key: string]: number };
  sustainability: { [key: string]: number };
}

// Transport Modes Data
const transportModes: TransportMode[] = [
  {
    id: "sea",
    name: "Sea Freight",
    icon: Ship,
    speed: 25,
    costPerKg: 0.015,
    co2PerKg: 0.012,
    reliability: 91,
    capacity: "Up to 250,000 tons/vessel",
    avgDelay: 3,
    minWeight: 500,
    maxWeight: 250000000,
    optimalDistance: { min: 3000, max: 25000 },
    description: "Ocean shipping for large volumes and long distances",
  },
  {
    id: "air",
    name: "Air Freight",
    icon: Plane,
    speed: 850,
    costPerKg: 4.5,
    co2PerKg: 0.502,
    reliability: 97,
    capacity: "Up to 120 tons/flight",
    avgDelay: 0.5,
    minWeight: 1,
    maxWeight: 120000,
    optimalDistance: { min: 500, max: 15000 },
    description: "Fast air transport for time-critical shipments",
  },
  {
    id: "rail",
    name: "Rail Freight",
    icon: Train,
    speed: 45,
    costPerKg: 0.035,
    co2PerKg: 0.028,
    reliability: 89,
    capacity: "Up to 5,000 tons/train",
    avgDelay: 1.5,
    minWeight: 1000,
    maxWeight: 5000000,
    optimalDistance: { min: 500, max: 8000 },
    description: "Rail transport for efficient long-distance land routes",
  },
  {
    id: "road",
    name: "Road Freight",
    icon: Truck,
    speed: 65,
    costPerKg: 0.075,
    co2PerKg: 0.062,
    reliability: 92,
    capacity: "Up to 25 tons/truck",
    avgDelay: 0.5,
    minWeight: 50,
    maxWeight: 25000,
    optimalDistance: { min: 50, max: 2500 },
    description: "Flexible door-to-door road transport",
  },
];

// Cargo Types
const cargoTypes = [
  { id: "general", name: "General Cargo", icon: Package },
  { id: "perishable", name: "Perishable Goods", icon: Thermometer },
  { id: "hazardous", name: "Dangerous Goods", icon: AlertTriangle },
  { id: "fragile", name: "Fragile Items", icon: Box },
  { id: "high-value", name: "High-Value Electronics", icon: Star },
  { id: "textiles", name: "Textiles & Apparel", icon: Box },
  { id: "machinery", name: "Machinery & Equipment", icon: Gauge },
  { id: "bulk", name: "Bulk Commodities", icon: Weight },
];

// Predefined Routes
const popularRoutes = [
  { origin: "Shanghai, CN", destination: "Rotterdam, NL", distance: 10800 },
  { origin: "Shenzhen, CN", destination: "Los Angeles, US", distance: 11500 },
  { origin: "Frankfurt, DE", destination: "New York, US", distance: 6200 },
  { origin: "Shanghai, CN", destination: "Hamburg, DE (Rail)", distance: 11000 },
  { origin: "London, UK", destination: "Paris, FR", distance: 460 },
  { origin: "Chicago, US", destination: "Los Angeles, US", distance: 2800 },
  { origin: "Singapore, SG", destination: "Sydney, AU", distance: 6300 },
  { origin: "Dubai, AE", destination: "Mumbai, IN", distance: 2200 },
];

const COLORS = {
  primary: "#0F4C81",
  secondary: "#2E8B57",
  accent: "#F59E0B",
  warning: "#EF4444",
  modes: {
    sea: "#0F4C81",
    air: "#8B5CF6",
    rail: "#2E8B57",
    road: "#F59E0B",
  },
};

export default function TransportModeSelector() {
  // State
  const [origin, setOrigin] = useState("Shanghai, CN");
  const [destination, setDestination] = useState("Rotterdam, NL");
  const [distance, setDistance] = useState(10800);
  const [cargo, setCargo] = useState<CargoCharacteristics>({
    weight: 15000,
    volume: 45,
    value: 250000,
    type: "general",
    temperatureSensitive: false,
    hazardous: false,
    fragile: false,
    timeSensitive: false,
  });
  const [priorities, setPriorities] = useState<Priorities>({
    transitTime: 30,
    cost: 40,
    reliability: 20,
    sustainability: 10,
  });
  const [results, setResults] = useState<ModeResult[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvancedCargo, setShowAdvancedCargo] = useState(false);

  // Calculate results
  const calculateRecommendations = useCallback(() => {
    setIsCalculating(true);

    setTimeout(() => {
      const totalPriorities = priorities.transitTime + priorities.cost + priorities.reliability + priorities.sustainability;
      const normPriorities = {
        transitTime: priorities.transitTime / totalPriorities,
        cost: priorities.cost / totalPriorities,
        reliability: priorities.reliability / totalPriorities,
        sustainability: priorities.sustainability / totalPriorities,
      };

      const modeResults: ModeResult[] = transportModes.map((mode) => {
        // Calculate transit time (days)
        let transitDays = distance / (mode.speed * 24) + mode.avgDelay;

        // Adjust for cargo type
        if (cargo.temperatureSensitive && mode.id !== "air" && mode.id !== "road") {
          transitDays += 1; // Extra handling time
        }
        if (cargo.hazardous && mode.id === "air") {
          transitDays += 2; // Special handling
        }

        // Calculate cost
        let costMultiplier = 1;
        if (cargo.hazardous) costMultiplier *= 1.25;
        if (cargo.fragile) costMultiplier *= 1.15;
        if (cargo.temperatureSensitive) costMultiplier *= 1.3;
        if (cargo.timeSensitive) costMultiplier *= 1.1;

        const totalCost = cargo.weight * mode.costPerKg * (distance / 1000) * costMultiplier;

        // Calculate CO2 emissions
        const co2Emissions = cargo.weight * mode.co2PerKg * (distance / 1000);

        // Calculate reliability score (adjusted for cargo type)
        let reliabilityScore = mode.reliability;
        if (cargo.hazardous && mode.id === "air") reliabilityScore -= 3;
        if (cargo.fragile && mode.id === "road") reliabilityScore -= 2;
        if (cargo.temperatureSensitive && mode.id === "sea") reliabilityScore -= 5;

        // Calculate overall score
        const costScore = Math.max(0, 100 - (totalCost / 50000) * 10);
        const timeScore = Math.max(0, 100 - transitDays * 3);
        const sustainScore = Math.max(0, 100 - co2Emissions / 100);
        const relScore = reliabilityScore;

        const overallScore =
          costScore * normPriorities.cost +
          timeScore * normPriorities.transitTime +
          sustainScore * normPriorities.sustainability +
          relScore * normPriorities.reliability;

        // Determine pros and cons
        const pros: string[] = [];
        const cons: string[] = [];

        if (mode.id === "sea") {
          pros.push("Lowest cost per unit", "High capacity availability", "Ideal for bulk shipments");
          if (distance > 5000) pros.push("Optimal for long distances");
          cons.push("Longest transit time", "Port congestion risks", "Requires intermodal connections");
          if (cargo.timeSensitive) cons.push("Not suitable for time-sensitive cargo");
        } else if (mode.id === "air") {
          pros.push("Fastest transit time", "High security", "Global network coverage");
          if (cargo.value > 100000) pros.push("Ideal for high-value goods");
          cons.push("Highest cost", "Weight restrictions", "Limited cargo capacity");
          if (cargo.weight > 50000) cons.push("Weight may exceed limits");
        } else if (mode.id === "rail") {
          pros.push("Cost-effective for land routes", "Lower emissions than road", "Reliable schedules");
          if (distance > 500 && distance < 5000) pros.push("Optimal distance range");
          cons.push("Limited route flexibility", "Fixed schedules", "Requires intermodal handling");
        } else if (mode.id === "road") {
          pros.push("Door-to-door service", "Flexible scheduling", "Short lead times");
          pros.push("Best for short distances");
          cons.push("Higher emissions per kg", "Traffic delays possible", "Driver regulations");
          if (distance > 2000) cons.push("Consider rail for longer distances");
        }

        // Generate recommendation
        let recommendation = "";
        if (cargo.timeSensitive && mode.id === "air") {
          recommendation = "Best choice for time-sensitive cargo";
        } else if (cargo.hazardous && mode.id === "sea") {
          recommendation = "Suitable for hazardous materials with proper documentation";
        } else if (cargo.value / cargo.weight > 100 && mode.id === "air") {
          recommendation = "High value-to-weight ratio justifies air freight";
        } else if (distance > 3000 && mode.id === "sea" && !cargo.timeSensitive) {
          recommendation = "Most economical for long-distance shipping";
        } else if (distance < 1000 && mode.id === "road") {
          recommendation = "Ideal for short-distance door-to-door delivery";
        } else if (mode.id === "rail" && distance > 500 && distance < 5000) {
          recommendation = "Efficient balance of cost and time for medium distances";
        }

        // Check feasibility
        const isFeasible = cargo.weight >= mode.minWeight && cargo.weight <= mode.maxWeight;
        if (!isFeasible) {
          cons.push("Weight outside optimal range");
        }

        return {
          mode,
          totalCost: Math.round(totalCost),
          transitDays: Math.round(transitDays * 10) / 10,
          co2Emissions: Math.round(co2Emissions),
          reliabilityScore,
          overallScore: Math.round(overallScore * 10) / 10,
          recommendation,
          pros,
          cons,
          isRecommended: false,
        };
      });

      // Sort by score and mark recommended
      modeResults.sort((a, b) => b.overallScore - a.overallScore);
      if (modeResults.length > 0) {
        modeResults[0].isRecommended = true;
      }

      setResults(modeResults);
      setIsCalculating(false);
    }, 1200);
  }, [distance, cargo, priorities]);

  // Matrix data
  const matrixData: ComparisonMatrix | null = useMemo(() => {
    if (!results) return null;

    return {
      cost: Object.fromEntries(results.map((r) => [r.mode.id, r.totalCost])),
      time: Object.fromEntries(results.map((r) => [r.mode.id, r.transitDays])),
      reliability: Object.fromEntries(results.map((r) => [r.mode.id, r.reliabilityScore])),
      sustainability: Object.fromEntries(
        results.map((r) => [r.mode.id, Math.max(0, 100 - r.co2Emissions / 100)])
      ),
    };
  }, [results]);

  // Chart data
  const chartData = useMemo(() => {
    if (!results) return [];
    return results.map((r) => ({
      name: r.mode.name.split(" ")[0],
      cost: r.totalCost / 1000,
      time: r.transitDays,
      co2: r.co2Emissions / 100,
      score: r.overallScore,
    }));
  }, [results]);

  const radarData = useMemo(() => {
    if (!results) return [];
    const maxCost = Math.max(...results.map((r) => r.totalCost));
    const maxTime = Math.max(...results.map((r) => r.transitDays));
    const maxCO2 = Math.max(...results.map((r) => r.co2Emissions));

    return results.map((r) => ({
      mode: r.mode.name.split(" ")[0],
      costEfficiency: Math.round((1 - r.totalCost / maxCost) * 100),
      timeEfficiency: Math.round((1 - r.transitDays / maxTime) * 100),
      reliability: r.reliabilityScore,
      sustainability: Math.round((1 - r.co2Emissions / maxCO2) * 100),
    }));
  }, [results]);

  // Format helpers
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

  const ModeIcon = ({ modeId, className = "h-5 w-5" }: { modeId: string; className?: string }) => {
    const mode = transportModes.find((m) => m.id === modeId);
    if (!mode) return null;
    const Icon = mode.icon;
    return <Icon className={className} />;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Route className="h-5 w-5" />
            Shipment Details
          </CardTitle>
          <CardDescription>Enter origin, destination, and cargo information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Route Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="origin" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#2E8B57]" />
                Origin
              </Label>
              <Input
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="City, Country"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                Destination
              </Label>
              <Input
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="City, Country"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="distance" className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-[#0F4C81]" />
                Distance (km)
              </Label>
              <Input
                id="distance"
                type="number"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value) || 0)}
                placeholder="10000"
                className="h-11"
              />
            </div>
          </div>

          {/* Popular Routes Quick Select */}
          <div className="mb-6">
            <Label className="text-sm text-muted-foreground mb-2 block">Quick Select Route</Label>
            <div className="flex flex-wrap gap-2">
              {popularRoutes.slice(0, 5).map((route, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOrigin(route.origin);
                    setDestination(route.destination);
                    setDistance(route.distance);
                  }}
                  className="text-xs"
                >
                  {route.origin.split(",")[0]} → {route.destination.split(",")[0]}
                </Button>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Cargo Characteristics */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-[#0F4C81]">
              <Package className="h-5 w-5" />
              Cargo Characteristics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={cargo.weight}
                  onChange={(e) => setCargo({ ...cargo, weight: parseFloat(e.target.value) || 0 })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volume" className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  Volume (CBM)
                </Label>
                <Input
                  id="volume"
                  type="number"
                  value={cargo.volume}
                  onChange={(e) => setCargo({ ...cargo, volume: parseFloat(e.target.value) || 0 })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Value (USD)
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={cargo.value}
                  onChange={(e) => setCargo({ ...cargo, value: parseFloat(e.target.value) || 0 })}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Cargo Type
                </Label>
                <Select
                  value={cargo.type}
                  onValueChange={(v) => setCargo({ ...cargo, type: v })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cargoTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Cargo Options */}
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedCargo(!showAdvancedCargo)}
                className="text-muted-foreground"
              >
                Advanced Options {showAdvancedCargo ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </Button>
              <AnimatePresence>
                {showAdvancedCargo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          cargo.temperatureSensitive
                            ? "border-[#0F4C81] bg-[#0F4C81]/5"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        onClick={() =>
                          setCargo({ ...cargo, temperatureSensitive: !cargo.temperatureSensitive })
                        }
                      >
                        <Thermometer className="h-5 w-5 mb-2 text-[#0F4C81]" />
                        <p className="text-sm font-medium">Temperature Sensitive</p>
                      </div>
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          cargo.hazardous
                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        onClick={() => setCargo({ ...cargo, hazardous: !cargo.hazardous })}
                      >
                        <AlertTriangle className="h-5 w-5 mb-2 text-red-500" />
                        <p className="text-sm font-medium">Hazardous Material</p>
                      </div>
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          cargo.fragile
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        onClick={() => setCargo({ ...cargo, fragile: !cargo.fragile })}
                      >
                        <Box className="h-5 w-5 mb-2 text-amber-500" />
                        <p className="text-sm font-medium">Fragile Items</p>
                      </div>
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          cargo.timeSensitive
                            ? "border-[#2E8B57] bg-[#2E8B57]/10"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                        onClick={() => setCargo({ ...cargo, timeSensitive: !cargo.timeSensitive })}
                      >
                        <Clock className="h-5 w-5 mb-2 text-[#2E8B57]" />
                        <p className="text-sm font-medium">Time Sensitive</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Priorities Section */}
          <div className="mb-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2 text-[#0F4C81]">
              <Star className="h-5 w-5" />
              Priority Settings
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust sliders to set your priorities (total should equal 100%)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#0F4C81]" />
                      Transit Time Priority
                    </Label>
                    <span className="font-semibold text-[#0F4C81]">{priorities.transitTime}%</span>
                  </div>
                  <Slider
                    value={[priorities.transitTime]}
                    onValueChange={(v) => setPriorities({ ...priorities, transitTime: v[0] })}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                      Cost Priority
                    </Label>
                    <span className="font-semibold text-[#2E8B57]">{priorities.cost}%</span>
                  </div>
                  <Slider
                    value={[priorities.cost]}
                    onValueChange={(v) => setPriorities({ ...priorities, cost: v[0] })}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-500" />
                      Reliability Priority
                    </Label>
                    <span className="font-semibold text-amber-500">{priorities.reliability}%</span>
                  </div>
                  <Slider
                    value={[priorities.reliability]}
                    onValueChange={(v) => setPriorities({ ...priorities, reliability: v[0] })}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      Sustainability Priority
                    </Label>
                    <span className="font-semibold text-green-500">{priorities.sustainability}%</span>
                  </div>
                  <Slider
                    value={[priorities.sustainability]}
                    onValueChange={(v) => setPriorities({ ...priorities, sustainability: v[0] })}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Priority</span>
                <span className="font-semibold">
                  {priorities.transitTime + priorities.cost + priorities.reliability + priorities.sustainability}%
                </span>
              </div>
              <Progress
                value={priorities.transitTime + priorities.cost + priorities.reliability + priorities.sustainability}
                className="mt-2 h-2"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <Button
              onClick={calculateRecommendations}
              disabled={isCalculating}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Options...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Get Recommendations
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-6 w-6 opacity-80" />
                  <Badge className="bg-white/20 text-white">Best Value</Badge>
                </div>
                <p className="text-xl font-bold">{results[0]?.mode.name}</p>
                <p className="text-sm opacity-80 mt-1">Score: {results[0]?.overallScore}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-6 w-6 opacity-80" />
                  <Badge className="bg-white/20 text-white">Fastest</Badge>
                </div>
                <p className="text-xl font-bold">
                  {[...results].sort((a, b) => a.transitDays - b.transitDays)[0]?.mode.name}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  {[...results].sort((a, b) => a.transitDays - b.transitDays)[0]?.transitDays} days
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Leaf className="h-6 w-6 opacity-80" />
                  <Badge className="bg-white/20 text-white">Greenest</Badge>
                </div>
                <p className="text-xl font-bold">
                  {[...results].sort((a, b) => a.co2Emissions - b.co2Emissions)[0]?.mode.name}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  {[...results].sort((a, b) => a.co2Emissions - b.co2Emissions)[0]?.co2Emissions} kg CO₂
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="h-6 w-6 opacity-80" />
                  <Badge className="bg-white/20 text-white">Most Reliable</Badge>
                </div>
                <p className="text-xl font-bold">
                  {[...results].sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0]?.mode.name}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  {[...results].sort((a, b) => b.reliabilityScore - a.reliabilityScore)[0]?.reliabilityScore}% reliability
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis Tabs */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <BarChart3 className="h-5 w-5" />
                Transport Mode Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="comparison">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="comparison">Comparison</TabsTrigger>
                  <TabsTrigger value="matrix">Matrix</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                {/* Comparison Tab */}
                <TabsContent value="comparison" className="pt-4">
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.mode.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-lg border-2 ${
                          result.isRecommended
                            ? "border-[#0F4C81] bg-[#0F4C81]/5"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: `${COLORS.modes[result.mode.id as keyof typeof COLORS.modes]}20` }}
                            >
                              <ModeIcon modeId={result.mode.id} className="h-7 w-7" style={{ color: COLORS.modes[result.mode.id as keyof typeof COLORS.modes] }} />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg flex items-center gap-2">
                                {result.mode.name}
                                {result.isRecommended && (
                                  <Badge className="bg-[#2E8B57] text-white">Recommended</Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground">{result.mode.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-[#0F4C81]">{result.overallScore}</p>
                            <p className="text-xs text-muted-foreground">Overall Score</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-xs text-muted-foreground">Total Cost</p>
                            <p className="font-bold text-lg">{formatCurrency(result.totalCost)}</p>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-xs text-muted-foreground">Transit Time</p>
                            <p className="font-bold text-lg">{result.transitDays} days</p>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-xs text-muted-foreground">CO₂ Emissions</p>
                            <p className="font-bold text-lg">{formatNumber(result.co2Emissions)} kg</p>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <p className="text-xs text-muted-foreground">Reliability</p>
                            <p className="font-bold text-lg">{result.reliabilityScore}%</p>
                          </div>
                        </div>

                        {result.recommendation && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              <Info className="h-4 w-4 inline mr-1" />
                              {result.recommendation}
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-[#2E8B57] mb-2">Advantages</p>
                            <ul className="text-sm space-y-1">
                              {result.pros.slice(0, 3).map((pro, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-500 mb-2">Considerations</p>
                            <ul className="text-sm space-y-1">
                              {result.cons.slice(0, 3).map((con, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                {/* Matrix Tab */}
                <TabsContent value="matrix" className="pt-4">
                  {matrixData && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-4 px-4 font-semibold">Metric</th>
                            {results.map((r) => (
                              <th key={r.mode.id} className="text-center py-4 px-4 font-semibold">
                                <div className="flex items-center justify-center gap-2">
                                  <ModeIcon modeId={r.mode.id} className="h-4 w-4" />
                                  {r.mode.name.split(" ")[0]}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-4 px-4 flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-[#0F4C81]" />
                              Cost (USD)
                            </td>
                            {results.map((r) => (
                              <td key={r.mode.id} className="text-center py-4 px-4">
                                <span className={`font-semibold ${
                                  r.totalCost === Math.min(...results.map(x => x.totalCost))
                                    ? "text-[#2E8B57]"
                                    : ""
                                }`}>
                                  {formatCurrency(r.totalCost)}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-4 px-4 flex items-center gap-2">
                              <Clock className="h-4 w-4 text-[#2E8B57]" />
                              Transit Time (days)
                            </td>
                            {results.map((r) => (
                              <td key={r.mode.id} className="text-center py-4 px-4">
                                <span className={`font-semibold ${
                                  r.transitDays === Math.min(...results.map(x => x.transitDays))
                                    ? "text-[#2E8B57]"
                                    : ""
                                }`}>
                                  {r.transitDays}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-4 px-4 flex items-center gap-2">
                              <Shield className="h-4 w-4 text-amber-500" />
                              Reliability (%)
                            </td>
                            {results.map((r) => (
                              <td key={r.mode.id} className="text-center py-4 px-4">
                                <span className={`font-semibold ${
                                  r.reliabilityScore === Math.max(...results.map(x => x.reliabilityScore))
                                    ? "text-[#2E8B57]"
                                    : ""
                                }`}>
                                  {r.reliabilityScore}%
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-4 px-4 flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-green-500" />
                              CO₂ Emissions (kg)
                            </td>
                            {results.map((r) => (
                              <td key={r.mode.id} className="text-center py-4 px-4">
                                <span className={`font-semibold ${
                                  r.co2Emissions === Math.min(...results.map(x => x.co2Emissions))
                                    ? "text-[#2E8B57]"
                                    : ""
                                }`}>
                                  {formatNumber(r.co2Emissions)}
                                </span>
                              </td>
                            ))}
                          </tr>
                          <tr className="bg-slate-50 dark:bg-slate-800/50">
                            <td className="py-4 px-4 flex items-center gap-2 font-bold">
                              <Star className="h-4 w-4 text-[#0F4C81]" />
                              Overall Score
                            </td>
                            {results.map((r) => (
                              <td key={r.mode.id} className="text-center py-4 px-4">
                                <span className={`text-xl font-bold ${
                                  r.isRecommended ? "text-[#0F4C81]" : ""
                                }`}>
                                  {r.overallScore}
                                </span>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Visual Matrix Bars */}
                  <div className="mt-6 space-y-6">
                    <h4 className="font-semibold">Visual Comparison</h4>
                    {["cost", "time", "reliability", "sustainability"].map((metric) => {
                      const maxVal = Math.max(...results.map((r) => {
                        if (metric === "cost") return r.totalCost;
                        if (metric === "time") return r.transitDays;
                        if (metric === "reliability") return r.reliabilityScore;
                        return Math.max(0, 100 - r.co2Emissions / 100);
                      }));

                      return (
                        <div key={metric}>
                          <p className="text-sm font-medium capitalize mb-2">
                            {metric === "cost" && "Cost Efficiency"}
                            {metric === "time" && "Transit Time Efficiency"}
                            {metric === "reliability" && "Reliability Score"}
                            {metric === "sustainability" && "Sustainability Score"}
                          </p>
                          <div className="space-y-2">
                            {results.map((r) => {
                              const value = metric === "cost"
                                ? Math.max(0, 100 - (r.totalCost / maxVal) * 100)
                                : metric === "time"
                                ? Math.max(0, 100 - (r.transitDays / maxVal) * 100)
                                : metric === "reliability"
                                ? r.reliabilityScore
                                : Math.max(0, 100 - r.co2Emissions / 100);

                              return (
                                <div key={r.mode.id} className="flex items-center gap-4">
                                  <div className="w-20 text-sm flex items-center gap-2">
                                    <ModeIcon modeId={r.mode.id} className="h-4 w-4" />
                                    <span>{r.mode.name.split(" ")[0]}</span>
                                  </div>
                                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${value}%` }}
                                      transition={{ duration: 0.5, delay: 0.2 }}
                                      className="h-full rounded-full"
                                      style={{ backgroundColor: COLORS.modes[r.mode.id as keyof typeof COLORS.modes] }}
                                    />
                                  </div>
                                  <span className="w-12 text-right text-sm font-medium">
                                    {Math.round(value)}%
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Charts Tab */}
                <TabsContent value="charts" className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Cost & Time Comparison</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                            <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="cost" name="Cost ($K)" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="time" name="Time (days)" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Radar Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Performance Radar</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="mode" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name="Cost Efficiency" dataKey="costEfficiency" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.3} />
                            <Radar name="Time Efficiency" dataKey="timeEfficiency" stroke="#2E8B57" fill="#2E8B57" fillOpacity={0.3} />
                            <Radar name="Reliability" dataKey="reliability" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                            <Radar name="Sustainability" dataKey="sustainability" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Score Comparison */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Overall Score Comparison</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {results.map((r) => (
                        <div
                          key={r.mode.id}
                          className={`p-6 rounded-lg border-2 text-center ${
                            r.isRecommended
                              ? "border-[#0F4C81] bg-[#0F4C81]/5"
                              : "border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <div className="flex justify-center mb-3">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${COLORS.modes[r.mode.id as keyof typeof COLORS.modes]}20` }}
                            >
                              <ModeIcon modeId={r.mode.id} className="h-6 w-6" style={{ color: COLORS.modes[r.mode.id as keyof typeof COLORS.modes] }} />
                            </div>
                          </div>
                          <p className="font-semibold mb-2">{r.mode.name}</p>
                          <div className="relative w-24 h-24 mx-auto mb-3">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-200 dark:text-slate-700"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke={COLORS.modes[r.mode.id as keyof typeof COLORS.modes]}
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={`${(r.overallScore / 100) * 251.2} 251.2`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-2xl font-bold">{r.overallScore}</span>
                            </div>
                          </div>
                          {r.isRecommended && (
                            <Badge className="bg-[#2E8B57] text-white">Best Match</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shipment Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#0F4C81]">Shipment Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Route</span>
                            <span className="font-medium">{origin} → {destination}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Distance</span>
                            <span className="font-medium">{formatNumber(distance)} km</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Cargo Weight</span>
                            <span className="font-medium">{formatNumber(cargo.weight)} kg</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Cargo Volume</span>
                            <span className="font-medium">{cargo.volume} CBM</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Cargo Value</span>
                            <span className="font-medium">{formatCurrency(cargo.value)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Value Density</span>
                            <span className="font-medium">{formatCurrency(cargo.value / cargo.weight)}/kg</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Cargo Type</span>
                            <span className="font-medium capitalize">{cargo.type.replace("-", " ")}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {cargo.temperatureSensitive && (
                              <Badge variant="outline" className="text-[#0F4C81]">Temperature Sensitive</Badge>
                            )}
                            {cargo.hazardous && (
                              <Badge variant="outline" className="text-red-500">Hazardous</Badge>
                            )}
                            {cargo.fragile && (
                              <Badge variant="outline" className="text-amber-500">Fragile</Badge>
                            )}
                            {cargo.timeSensitive && (
                              <Badge variant="outline" className="text-[#2E8B57]">Time Sensitive</Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Priority Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#0F4C81]">Priority Configuration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Transit Time</span>
                              <span className="text-sm font-medium">{priorities.transitTime}%</span>
                            </div>
                            <Progress value={priorities.transitTime} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Cost</span>
                              <span className="text-sm font-medium">{priorities.cost}%</span>
                            </div>
                            <Progress value={priorities.cost} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Reliability</span>
                              <span className="text-sm font-medium">{priorities.reliability}%</span>
                            </div>
                            <Progress value={priorities.reliability} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm">Sustainability</span>
                              <span className="text-sm font-medium">{priorities.sustainability}%</span>
                            </div>
                            <Progress value={priorities.sustainability} className="h-2" />
                          </div>
                        </div>

                        <Separator className="my-6" />

                        {/* Recommendation Box */}
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-medium text-green-800 dark:text-green-200">
                                Recommended: {results[0]?.mode.name}
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                Based on your priorities, {results[0]?.mode.name} offers the best balance of cost, transit time, reliability, and environmental impact for this shipment.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Potential Savings */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-[#0F4C81] flex items-center gap-2">
                        <TrendingDown className="h-5 w-5" />
                        Potential Savings Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Cost Savings Potential</p>
                          <p className="text-2xl font-bold text-[#2E8B57]">
                            {formatCurrency(
                              Math.max(...results.map((r) => r.totalCost)) -
                                Math.min(...results.map((r) => r.totalCost))
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            By choosing {results.sort((a, b) => a.totalCost - b.totalCost)[0]?.mode.name}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">Time Savings Potential</p>
                          <p className="text-2xl font-bold text-[#0F4C81]">
                            {Math.round(
                              Math.max(...results.map((r) => r.transitDays)) -
                                Math.min(...results.map((r) => r.transitDays))
                            )}{" "}
                            days
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            By choosing {[...results].sort((a, b) => a.transitDays - b.transitDays)[0]?.mode.name}
                          </p>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-2">CO₂ Reduction Potential</p>
                          <p className="text-2xl font-bold text-green-500">
                            {formatNumber(
                              Math.max(...results.map((r) => r.co2Emissions)) -
                                Math.min(...results.map((r) => r.co2Emissions))
                            )}{" "}
                            kg
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            By choosing {[...results].sort((a, b) => a.co2Emissions - b.co2Emissions)[0]?.mode.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
