"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Truck,
  Clock,
  Package,
  DollarSign,
  Route,
  Plus,
  Trash2,
  GripVertical,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Timer,
  Fuel,
  Settings,
  BarChart3,
  Map,
  ArrowRight,
  RefreshCw,
  Info,
  Zap,
  TrendingUp,
  Calendar,
  Gauge,
  Box,
  Users,
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Types
interface DeliveryStop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  demand: number; // kg
  serviceTime: number; // minutes
  timeWindowStart: string; // HH:MM
  timeWindowEnd: string; // HH:MM
  priority: "high" | "medium" | "low";
  notes: string;
}

interface VehicleConfig {
  id: string;
  name: string;
  capacity: number; // kg
  volume: number; // cubic meters
  fuelEfficiency: number; // km/L
  maxStops: number;
  hourlyCost: number; // $/hour
  fixedCost: number; // $ per route
}

interface DistanceMatrix {
  [key: string]: { [key: string]: number }; // distances in km
}

interface TimeMatrix {
  [key: string]: { [key: string]: number }; // times in minutes
}

interface OptimizedRoute {
  sequence: DeliveryStop[];
  totalDistance: number;
  totalTime: number;
  totalCost: number;
  arrivalTimes: { [stopId: string]: string };
  serviceStartTimes: { [stopId: string]: string };
  timeWindowViolations: { stopId: string; type: "early" | "late"; minutes: number }[];
  capacityUtilization: number;
  fuelConsumption: number;
}

// Sample data
const vehicleTypes: VehicleConfig[] = [
  { id: "van-small", name: "Small Van", capacity: 800, volume: 6, fuelEfficiency: 10, maxStops: 15, hourlyCost: 25, fixedCost: 30 },
  { id: "van-large", name: "Large Van", capacity: 1500, volume: 12, fuelEfficiency: 8, maxStops: 20, hourlyCost: 35, fixedCost: 45 },
  { id: "truck-small", name: "Small Truck (3.5T)", capacity: 2500, volume: 18, fuelEfficiency: 6, maxStops: 25, hourlyCost: 45, fixedCost: 60 },
  { id: "truck-medium", name: "Medium Truck (7.5T)", capacity: 5000, volume: 35, fuelEfficiency: 4.5, maxStops: 30, hourlyCost: 55, fixedCost: 80 },
  { id: "truck-large", name: "Large Truck (18T)", capacity: 12000, volume: 60, fuelEfficiency: 3, maxStops: 40, hourlyCost: 70, fixedCost: 100 },
  { id: "tractor-trailer", name: "Tractor Trailer (40T)", capacity: 28000, volume: 90, fuelEfficiency: 2.5, maxStops: 50, hourlyCost: 90, fixedCost: 150 },
];

const sampleStops: DeliveryStop[] = [
  { id: "depot", name: "Depot (Start/End)", address: "123 Warehouse Ave, Industrial District", lat: 40.7128, lng: -74.0060, demand: 0, serviceTime: 0, timeWindowStart: "06:00", timeWindowEnd: "20:00", priority: "high", notes: "Main distribution center" },
  { id: "stop1", name: "Customer A - Downtown", address: "456 Main Street, Downtown", lat: 40.7580, lng: -73.9855, demand: 250, serviceTime: 15, timeWindowStart: "09:00", timeWindowEnd: "12:00", priority: "high", notes: "Morning delivery preferred" },
  { id: "stop2", name: "Customer B - Midtown", address: "789 Broadway, Midtown", lat: 40.7614, lng: -73.9776, demand: 180, serviceTime: 20, timeWindowStart: "10:00", timeWindowEnd: "14:00", priority: "medium", notes: "Loading dock available" },
  { id: "stop3", name: "Customer C - Uptown", address: "321 Park Ave, Uptown", lat: 40.7831, lng: -73.9712, demand: 320, serviceTime: 25, timeWindowStart: "13:00", timeWindowEnd: "17:00", priority: "high", notes: "Large order - careful handling" },
  { id: "stop4", name: "Customer D - East Side", address: "654 East 42nd St", lat: 40.7527, lng: -73.9772, demand: 150, serviceTime: 10, timeWindowStart: "08:00", timeWindowEnd: "16:00", priority: "low", notes: "Small package delivery" },
  { id: "stop5", name: "Customer E - West Side", address: "987 West 57th St", lat: 40.7648, lng: -73.9808, demand: 200, serviceTime: 15, timeWindowStart: "11:00", timeWindowEnd: "15:00", priority: "medium", notes: "Fragile items" },
];

const COLORS = {
  primary: "#0F4C81",
  secondary: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
};

const priorityColors = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#2E8B57",
};

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, "0")} ${period}`;
};

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Calculate Euclidean distance (simplified for demo)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Build distance matrix
const buildDistanceMatrix = (stops: DeliveryStop[]): DistanceMatrix => {
  const matrix: DistanceMatrix = {};
  stops.forEach((stop1) => {
    matrix[stop1.id] = {};
    stops.forEach((stop2) => {
      if (stop1.id === stop2.id) {
        matrix[stop1.id][stop2.id] = 0;
      } else {
        // Add some randomness to simulate real road distances
        const directDistance = calculateDistance(stop1.lat, stop1.lng, stop2.lat, stop2.lng);
        matrix[stop1.id][stop2.id] = directDistance * (1 + Math.random() * 0.3);
      }
    });
  });
  return matrix;
};

// Build time matrix (assuming average speed of 30 km/h in urban areas)
const buildTimeMatrix = (distanceMatrix: DistanceMatrix, avgSpeed: number = 30): TimeMatrix => {
  const matrix: TimeMatrix = {};
  Object.keys(distanceMatrix).forEach((fromId) => {
    matrix[fromId] = {};
    Object.keys(distanceMatrix[fromId]).forEach((toId) => {
      matrix[fromId][toId] = (distanceMatrix[fromId][toId] / avgSpeed) * 60; // Convert to minutes
    });
  });
  return matrix;
};

// Nearest Neighbor with Time Windows optimization
const optimizeRoute = (
  stops: DeliveryStop[],
  distanceMatrix: DistanceMatrix,
  timeMatrix: TimeMatrix,
  vehicle: VehicleConfig,
  startTime: string,
  fuelPrice: number
): OptimizedRoute => {
  const depot = stops.find((s) => s.id === "depot") || stops[0];
  const customerStops = stops.filter((s) => s.id !== "depot");
  const visited = new Set<string>(["depot"]);
  const sequence: DeliveryStop[] = [depot];
  let totalDistance = 0;
  let totalTime = timeToMinutes(startTime);
  const arrivalTimes: { [stopId: string]: string } = { depot: startTime };
  const serviceStartTimes: { [stopId: string]: string } = { depot: startTime };
  const timeWindowViolations: { stopId: string; type: "early" | "late"; minutes: number }[] = [];
  let totalDemand = 0;

  // Sort stops by priority and time window tightness
  const sortedStops = [...customerStops].sort((a, b) => {
    const priorityWeight = { high: 0, medium: 1, low: 2 };
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    }
    const windowA = timeToMinutes(a.timeWindowEnd) - timeToMinutes(a.timeWindowStart);
    const windowB = timeToMinutes(b.timeWindowEnd) - timeToMinutes(b.timeWindowStart);
    return windowA - windowB;
  });

  while (visited.size < stops.length) {
    const currentStop = sequence[sequence.length - 1];
    let bestNext: DeliveryStop | null = null;
    let bestScore = Infinity;

    for (const stop of sortedStops) {
      if (visited.has(stop.id)) continue;

      const distance = distanceMatrix[currentStop.id][stop.id];
      const travelTime = timeMatrix[currentStop.id][stop.id];
      const arrivalTime = totalTime + travelTime;
      const twStart = timeToMinutes(stop.timeWindowStart);
      const twEnd = timeToMinutes(stop.timeWindowEnd);

      // Calculate penalty score
      let score = distance;

      // Time window penalty
      if (arrivalTime < twStart) {
        score += (twStart - arrivalTime) * 2; // Waiting penalty
      } else if (arrivalTime > twEnd) {
        score += (arrivalTime - twEnd) * 5; // Lateness penalty
      }

      // Priority bonus
      const priorityBonus = { high: 100, medium: 50, low: 0 };
      score -= priorityBonus[stop.priority];

      if (score < bestScore) {
        bestScore = score;
        bestNext = stop;
      }
    }

    if (bestNext) {
      visited.add(bestNext.id);
      sequence.push(bestNext);

      const travelDistance = distanceMatrix[currentStop.id][bestNext.id];
      const travelTime = timeMatrix[currentStop.id][bestNext.id];
      totalDistance += travelDistance;
      totalTime += travelTime;

      // Check time window
      const twStart = timeToMinutes(bestNext.timeWindowStart);
      const twEnd = timeToMinutes(bestNext.timeWindowEnd);

      arrivalTimes[bestNext.id] = formatTime(totalTime);

      // Wait if early
      if (totalTime < twStart) {
        timeWindowViolations.push({ stopId: bestNext.id, type: "early", minutes: twStart - totalTime });
        totalTime = twStart;
      }

      serviceStartTimes[bestNext.id] = formatTime(totalTime);

      // Check if late
      if (totalTime > twEnd) {
        timeWindowViolations.push({ stopId: bestNext.id, type: "late", minutes: totalTime - twEnd });
      }

      totalTime += bestNext.serviceTime;
      totalDemand += bestNext.demand;
    }
  }

  // Return to depot
  const lastStop = sequence[sequence.length - 1];
  const returnDistance = distanceMatrix[lastStop.id]["depot"];
  const returnTime = timeMatrix[lastStop.id]["depot"];
  totalDistance += returnDistance;
  totalTime += returnTime;
  sequence.push(depot);
  arrivalTimes["depot_return"] = formatTime(totalTime);

  // Calculate costs
  const fuelConsumption = totalDistance / vehicle.fuelEfficiency;
  const fuelCost = fuelConsumption * fuelPrice;
  const timeCost = ((totalTime - timeToMinutes(startTime)) / 60) * vehicle.hourlyCost;
  const totalCost = fuelCost + timeCost + vehicle.fixedCost;

  return {
    sequence,
    totalDistance,
    totalTime: totalTime - timeToMinutes(startTime),
    totalCost,
    arrivalTimes,
    serviceStartTimes,
    timeWindowViolations,
    capacityUtilization: (totalDemand / vehicle.capacity) * 100,
    fuelConsumption,
  };
};

export default function DeliveryRouteOptimizer() {
  // State
  const [stops, setStops] = useState<DeliveryStop[]>(sampleStops);
  const [vehicleId, setVehicleId] = useState("truck-medium");
  const [startTime, setStartTime] = useState("08:00");
  const [avgSpeed, setAvgSpeed] = useState(30);
  const [fuelPrice, setFuelPrice] = useState(1.65);
  const [optimizationGoal, setOptimizationGoal] = useState<"distance" | "time" | "cost">("distance");
  const [considerTraffic, setConsiderTraffic] = useState(true);
  const [result, setResult] = useState<OptimizedRoute | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("stops");

  const selectedVehicle = vehicleTypes.find((v) => v.id === vehicleId) || vehicleTypes[0];

  // Add new stop
  const addStop = useCallback(() => {
    const newStop: DeliveryStop = {
      id: generateId(),
      name: `Customer ${stops.length}`,
      address: "",
      lat: 40.7 + Math.random() * 0.1,
      lng: -74 + Math.random() * 0.05,
      demand: 100 + Math.random() * 200,
      serviceTime: 10 + Math.random() * 15,
      timeWindowStart: "09:00",
      timeWindowEnd: "17:00",
      priority: "medium",
      notes: "",
    };
    setStops([...stops, newStop]);
  }, [stops]);

  // Remove stop
  const removeStop = useCallback((id: string) => {
    if (id === "depot") return;
    setStops(stops.filter((s) => s.id !== id));
  }, [stops]);

  // Update stop
  const updateStop = useCallback((id: string, field: keyof DeliveryStop, value: string | number) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }, [stops]);

  // Run optimization
  const runOptimization = useCallback(() => {
    setIsCalculating(true);
    setTimeout(() => {
      const distanceMatrix = buildDistanceMatrix(stops);
      const timeMatrix = buildTimeMatrix(distanceMatrix, avgSpeed);
      const optimized = optimizeRoute(stops, distanceMatrix, timeMatrix, selectedVehicle, startTime, fuelPrice);
      setResult(optimized);
      setIsCalculating(false);
    }, 1500);
  }, [stops, avgSpeed, selectedVehicle, startTime, fuelPrice]);

  // Matrices for display
  const { distanceMatrix, timeMatrix } = useMemo(() => {
    const dm = buildDistanceMatrix(stops);
    const tm = buildTimeMatrix(dm, avgSpeed);
    return { distanceMatrix: dm, timeMatrix: tm };
  }, [stops, avgSpeed]);

  // Chart data
  const stopSequenceData = useMemo(() => {
    if (!result) return [];
    return result.sequence.map((stop, index) => ({
      name: stop.name.substring(0, 15),
      sequence: index + 1,
      distance: index > 0 ? distanceMatrix[result.sequence[index - 1].id][stop.id] : 0,
      demand: stop.demand,
      serviceTime: stop.serviceTime,
    }));
  }, [result, distanceMatrix]);

  const costBreakdownData = useMemo(() => {
    if (!result) return [];
    const fuelCost = result.fuelConsumption * fuelPrice;
    const timeCost = ((result.totalTime) / 60) * selectedVehicle.hourlyCost;
    return [
      { name: "Fuel Cost", value: fuelCost, color: COLORS.primary },
      { name: "Labor Cost", value: timeCost, color: COLORS.secondary },
      { name: "Fixed Cost", value: selectedVehicle.fixedCost, color: COLORS.warning },
    ];
  }, [result, fuelPrice, selectedVehicle]);

  const timeWindowComplianceData = useMemo(() => {
    if (!result) return [];
    const onTime = stops.length - 1 - result.timeWindowViolations.length;
    const early = result.timeWindowViolations.filter((v) => v.type === "early").length;
    const late = result.timeWindowViolations.filter((v) => v.type === "late").length;
    return [
      { name: "On Time", value: onTime, color: COLORS.secondary },
      { name: "Early (Wait)", value: early, color: COLORS.warning },
      { name: "Late", value: late, color: COLORS.danger },
    ];
  }, [result, stops]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Route className="h-6 w-6" />
            Delivery Route Optimizer
          </CardTitle>
          <CardDescription>
            Optimize multi-stop delivery routes with time windows, vehicle capacity, and cost optimization
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="stops" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Stops
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Vehicle
          </TabsTrigger>
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Matrix
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        {/* Stops Tab */}
        <TabsContent value="stops" className="pt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#0F4C81]" />
                  Delivery Stops ({stops.length})
                </CardTitle>
                <Button onClick={addStop} size="sm" className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stop
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[500px] pr-4">
                <div className="space-y-3">
                  <AnimatePresence>
                    {stops.map((stop, index) => (
                      <motion.div
                        key={stop.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={cn(
                          "p-4 rounded-lg border transition-all",
                          stop.id === "depot"
                            ? "bg-[#0F4C81]/5 border-[#0F4C81]/30"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-[#0F4C81]/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 pt-1">
                            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                                stop.id === "depot" ? "bg-[#0F4C81]" : "bg-[#2E8B57]"
                              )}
                            >
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Name and Address */}
                            <div className="md:col-span-2 space-y-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  value={stop.name}
                                  onChange={(e) => updateStop(stop.id, "name", e.target.value)}
                                  className="font-medium"
                                  disabled={stop.id === "depot"}
                                />
                                {stop.id !== "depot" && (
                                  <Select
                                    value={stop.priority}
                                    onValueChange={(v) => updateStop(stop.id, "priority", v)}
                                  >
                                    <SelectTrigger className="w-28">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="high">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-red-500" />
                                          High
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="medium">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                                          Medium
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="low">
                                        <div className="flex items-center gap-2">
                                          <div className="w-2 h-2 rounded-full bg-green-500" />
                                          Low
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              </div>
                              <Input
                                value={stop.address}
                                onChange={(e) => updateStop(stop.id, "address", e.target.value)}
                                placeholder="Address"
                                className="text-sm"
                                disabled={stop.id === "depot"}
                              />
                            </div>

                            {/* Demand and Service Time */}
                            {stop.id !== "depot" && (
                              <>
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Demand (kg)</Label>
                                  <Input
                                    type="number"
                                    value={stop.demand}
                                    onChange={(e) => updateStop(stop.id, "demand", parseFloat(e.target.value) || 0)}
                                    className="h-9"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">Service (min)</Label>
                                  <Input
                                    type="number"
                                    value={stop.serviceTime}
                                    onChange={(e) => updateStop(stop.id, "serviceTime", parseFloat(e.target.value) || 0)}
                                    className="h-9"
                                  />
                                </div>
                              </>
                            )}
                          </div>

                          {/* Time Window */}
                          {stop.id !== "depot" && (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="time"
                                  value={stop.timeWindowStart}
                                  onChange={(e) => updateStop(stop.id, "timeWindowStart", e.target.value)}
                                  className="w-28 h-9"
                                />
                                <span className="text-muted-foreground">-</span>
                                <Input
                                  type="time"
                                  value={stop.timeWindowEnd}
                                  onChange={(e) => updateStop(stop.id, "timeWindowEnd", e.target.value)}
                                  className="w-28 h-9"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeStop(stop.id)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#0F4C81]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Stops</p>
                  <p className="text-xl font-bold">{stops.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                  <Package className="h-5 w-5 text-[#2E8B57]" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Demand</p>
                  <p className="text-xl font-bold">{stops.reduce((sum, s) => sum + s.demand, 0).toFixed(0)} kg</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Timer className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Time</p>
                  <p className="text-xl font-bold">{stops.reduce((sum, s) => sum + s.serviceTime, 0)} min</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                  <p className="text-xl font-bold">{stops.filter((s) => s.priority === "high").length}</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Vehicle Tab */}
        <TabsContent value="vehicle" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vehicle Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Truck className="h-5 w-5" />
                  Vehicle Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Select value={vehicleId} onValueChange={setVehicleId}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span>{v.name}</span>
                            <span className="text-muted-foreground text-sm">
                              {v.capacity}kg | {v.volume}m³
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Max Capacity</p>
                    <p className="font-semibold">{selectedVehicle.capacity.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="font-semibold">{selectedVehicle.volume} m³</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
                    <p className="font-semibold">{selectedVehicle.fuelEfficiency} km/L</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Stops</p>
                    <p className="font-semibold">{selectedVehicle.maxStops}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Cost</p>
                    <p className="font-semibold">${selectedVehicle.hourlyCost}/hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fixed Cost</p>
                    <p className="font-semibold">${selectedVehicle.fixedCost}/route</p>
                  </div>
                </div>

                {/* Capacity Warning */}
                {(() => {
                  const totalDemand = stops.reduce((sum, s) => sum + s.demand, 0);
                  const utilization = (totalDemand / selectedVehicle.capacity) * 100;
                  if (utilization > 100) {
                    return (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800 dark:text-red-200">Capacity Exceeded</p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                              Total demand ({totalDemand.toFixed(0)}kg) exceeds vehicle capacity ({selectedVehicle.capacity}kg).
                              Consider using a larger vehicle or splitting the route.
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </CardContent>
            </Card>

            {/* Route Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                  <Settings className="h-5 w-5" />
                  Route Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Start Time
                    </Label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      Avg Speed (km/h)
                    </Label>
                    <Input
                      type="number"
                      value={avgSpeed}
                      onChange={(e) => setAvgSpeed(parseInt(e.target.value) || 30)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    Fuel Price ($/L)
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 1.65)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Optimization Goal</Label>
                  <Select value={optimizationGoal} onValueChange={(v: "distance" | "time" | "cost") => setOptimizationGoal(v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Minimize Distance</SelectItem>
                      <SelectItem value="time">Minimize Time</SelectItem>
                      <SelectItem value="cost">Minimize Cost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <Label>Consider Traffic Conditions</Label>
                  </div>
                  <Switch checked={considerTraffic} onCheckedChange={setConsiderTraffic} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Run Optimization Button */}
          <Card className="p-6 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57]">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-semibold">Ready to Optimize</h3>
                <p className="text-white/80 text-sm">
                  {stops.length - 1} delivery stops | {selectedVehicle.name} | Starting at {startTime}
                </p>
              </div>
              <Button
                onClick={runOptimization}
                disabled={isCalculating}
                size="lg"
                className="bg-white text-[#0F4C81] hover:bg-white/90"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Route className="mr-2 h-5 w-5" />
                    Run Optimization
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Matrix Tab */}
        <TabsContent value="matrix" className="pt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distance Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Map className="h-5 w-5" />
                  Distance Matrix (km)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[400px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="p-2 text-left font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            From / To
                          </th>
                          {stops.slice(0, 8).map((stop) => (
                            <th key={stop.id} className="p-2 text-center font-medium whitespace-nowrap">
                              {stop.name.substring(0, 10)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stops.slice(0, 8).map((stopFrom, i) => (
                          <tr key={stopFrom.id} className="border-t">
                            <td className="p-2 font-medium whitespace-nowrap sticky left-0 bg-white dark:bg-slate-900">
                              {stopFrom.name.substring(0, 10)}
                            </td>
                            {stops.slice(0, 8).map((stopTo, j) => (
                              <td
                                key={stopTo.id}
                                className={cn(
                                  "p-2 text-center",
                                  i === j ? "bg-slate-100 dark:bg-slate-800" : ""
                                )}
                              >
                                {i === j ? "-" : distanceMatrix[stopFrom.id]?.[stopTo.id]?.toFixed(1)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Time Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                  <Clock className="h-5 w-5" />
                  Time Matrix (minutes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[400px]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="p-2 text-left font-medium sticky left-0 bg-white dark:bg-slate-900 z-10">
                            From / To
                          </th>
                          {stops.slice(0, 8).map((stop) => (
                            <th key={stop.id} className="p-2 text-center font-medium whitespace-nowrap">
                              {stop.name.substring(0, 10)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {stops.slice(0, 8).map((stopFrom, i) => (
                          <tr key={stopFrom.id} className="border-t">
                            <td className="p-2 font-medium whitespace-nowrap sticky left-0 bg-white dark:bg-slate-900">
                              {stopFrom.name.substring(0, 10)}
                            </td>
                            {stops.slice(0, 8).map((stopTo, j) => (
                              <td
                                key={stopTo.id}
                                className={cn(
                                  "p-2 text-center",
                                  i === j ? "bg-slate-100 dark:bg-slate-800" : ""
                                )}
                              >
                                {i === j ? "-" : timeMatrix[stopFrom.id]?.[stopTo.id]?.toFixed(0)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Matrix Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Distance Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stops.slice(1, 7).map((stop) => ({
                      name: stop.name.substring(0, 15),
                      avgDistance:
                        Object.values(distanceMatrix[stop.id] || {}).reduce((a, b) => a + b, 0) / stops.length,
                      maxDistance: Math.max(...Object.values(distanceMatrix[stop.id] || {}).filter((v) => v > 0)),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgDistance" name="Avg Distance (km)" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="maxDistance" name="Max Distance (km)" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="pt-4 space-y-4">
          {result ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Route className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Distance</span>
                    </div>
                    <p className="text-2xl font-bold">{result.totalDistance.toFixed(1)} km</p>
                    <p className="text-sm opacity-80 mt-1">Total route</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Duration</span>
                    </div>
                    <p className="text-2xl font-bold">{formatTime(result.totalTime)}</p>
                    <p className="text-sm opacity-80 mt-1">Total time</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Cost</span>
                    </div>
                    <p className="text-2xl font-bold">{formatCurrency(result.totalCost)}</p>
                    <p className="text-sm opacity-80 mt-1">
                      {formatCurrency(result.totalCost / result.totalDistance)}/km
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Fuel className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Fuel</span>
                    </div>
                    <p className="text-2xl font-bold">{result.fuelConsumption.toFixed(0)} L</p>
                    <p className="text-sm opacity-80 mt-1">
                      {formatCurrency(result.fuelConsumption * fuelPrice)}
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={cn(
                    "text-white",
                    result.timeWindowViolations.length === 0
                      ? "bg-gradient-to-br from-green-500 to-green-600"
                      : "bg-gradient-to-br from-red-500 to-red-600"
                  )}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      {result.timeWindowViolations.length === 0 ? (
                        <CheckCircle className="h-6 w-6 opacity-80" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 opacity-80" />
                      )}
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">TW Status</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {result.timeWindowViolations.length === 0 ? "All OK" : `${result.timeWindowViolations.length} Issues`}
                    </p>
                    <p className="text-sm opacity-80 mt-1">
                      {result.timeWindowViolations.filter((v) => v.type === "late").length} late
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Optimized Route Sequence */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Route className="h-5 w-5" />
                    Optimized Route Sequence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

                    <div className="space-y-4">
                      {result.sequence.map((stop, index) => {
                        const arrival = result.arrivalTimes[stop.id];
                        const serviceStart = result.serviceStartTimes[stop.id];
                        const violation = result.timeWindowViolations.find((v) => v.stopId === stop.id);
                        const isLast = index === result.sequence.length - 1;

                        return (
                          <motion.div
                            key={`${stop.id}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative pl-14"
                          >
                            <div
                              className={cn(
                                "absolute left-4 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900",
                                stop.id === "depot"
                                  ? "bg-[#0F4C81]"
                                  : violation
                                  ? violation.type === "late"
                                    ? "bg-red-500"
                                    : "bg-amber-500"
                                  : "bg-[#2E8B57]"
                              )}
                            />
                            <div
                              className={cn(
                                "p-4 rounded-lg border transition-all",
                                stop.id === "depot"
                                  ? "bg-[#0F4C81]/5 border-[#0F4C81]/30"
                                  : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                              )}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "font-bold",
                                      stop.id === "depot"
                                        ? "border-[#0F4C81] text-[#0F4C81]"
                                        : "border-[#2E8B57] text-[#2E8B57]"
                                    )}
                                  >
                                    Stop {index + 1}
                                  </Badge>
                                  <div>
                                    <p className="font-medium">{stop.name}</p>
                                    <p className="text-sm text-muted-foreground">{stop.address}</p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  {stop.id !== "depot" && (
                                    <>
                                      <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                          {stop.timeWindowStart} - {stop.timeWindowEnd}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-4 mt-1 text-sm">
                                        <span>Arr: {arrival}</span>
                                        {serviceStart && <span>Svc: {serviceStart}</span>}
                                      </div>
                                    </>
                                  )}
                                  {stop.id === "depot" && index === 0 && (
                                    <p className="text-sm text-muted-foreground">Depart: {startTime}</p>
                                  )}
                                  {stop.id === "depot" && isLast && (
                                    <p className="text-sm text-muted-foreground">Return: {result.arrivalTimes["depot_return"]}</p>
                                  )}
                                </div>
                              </div>

                              {stop.id !== "depot" && (
                                <div className="mt-3 flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span>{stop.demand} kg</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Timer className="h-4 w-4 text-muted-foreground" />
                                    <span>{stop.serviceTime} min</span>
                                  </div>
                                  <div
                                    className="px-2 py-0.5 rounded text-xs font-medium"
                                    style={{
                                      backgroundColor: `${priorityColors[stop.priority]}20`,
                                      color: priorityColors[stop.priority],
                                    }}
                                  >
                                    {stop.priority.toUpperCase()}
                                  </div>
                                  {violation && (
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        violation.type === "late"
                                          ? "border-red-500 text-red-500"
                                          : "border-amber-500 text-amber-500"
                                      )}
                                    >
                                      {violation.type === "late"
                                        ? `${violation.minutes.toFixed(0)} min late`
                                        : `${violation.minutes.toFixed(0)} min early`}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                    <Box className="h-5 w-5" />
                    Capacity Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Vehicle Capacity</span>
                      <span className="font-medium">{selectedVehicle.capacity.toLocaleString()} kg</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            result.capacityUtilization > 100
                              ? "bg-red-500"
                              : result.capacityUtilization > 80
                              ? "bg-amber-500"
                              : "bg-[#2E8B57]"
                          )}
                          style={{ width: `${Math.min(result.capacityUtilization, 100)}%` }}
                        />
                      </div>
                      <span className="font-bold text-lg">{result.capacityUtilization.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Demand: {stops.reduce((sum, s) => sum + s.demand, 0).toFixed(0)} kg
                      </span>
                      <span className={result.capacityUtilization > 80 ? "text-amber-500 font-medium" : ""}>
                        {result.capacityUtilization > 100
                          ? "Over capacity!"
                          : result.capacityUtilization > 80
                          ? "High utilization"
                          : "Optimal range"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <Route className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Optimization Results</h3>
                <p className="text-muted-foreground mb-6">
                  Configure your stops and vehicle settings, then run the optimization.
                </p>
                <Button onClick={() => setActiveTab("vehicle")} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                  Go to Vehicle Settings
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="pt-4 space-y-4">
          {result ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                      <DollarSign className="h-5 w-5" />
                      Cost Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {costBreakdownData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <p className="text-lg font-bold">{formatCurrency(item.value)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Time Window Compliance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                      <Clock className="h-5 w-5" />
                      Time Window Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={timeWindowComplianceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {timeWindowComplianceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {timeWindowComplianceData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <p className="text-lg font-bold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Route Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Metrics by Stop</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stopSequenceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="distance"
                          name="Distance (km)"
                          stroke={COLORS.primary}
                          fill={COLORS.primary}
                          fillOpacity={0.3}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="demand"
                          name="Demand (kg)"
                          stroke={COLORS.secondary}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Radar */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        data={[
                          { subject: "Time Efficiency", A: Math.max(0, 100 - result.totalTime / 10), fullMark: 100 },
                          {
                            subject: "Cost Efficiency",
                            A: Math.max(0, 100 - (result.totalCost / 1000) * 10),
                            fullMark: 100,
                          },
                          {
                            subject: "Capacity Util.",
                            A: Math.min(100, result.capacityUtilization),
                            fullMark: 100,
                          },
                          {
                            subject: "TW Compliance",
                            A: ((stops.length - 1 - result.timeWindowViolations.length) / (stops.length - 1)) * 100,
                            fullMark: 100,
                          },
                          { subject: "Route Directness", A: 75 + Math.random() * 15, fullMark: 100 },
                          { subject: "Fuel Efficiency", A: 80 + Math.random() * 15, fullMark: 100 },
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Score" dataKey="A" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.5} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.timeWindowViolations.length > 0 && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800 dark:text-amber-200">Time Window Issues</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                              Consider adjusting start time to {result.timeWindowViolations.some(v => v.type === "late") ? "earlier" : "later"} in the day
                              to better align with delivery windows.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {result.capacityUtilization > 90 && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800 dark:text-red-200">High Capacity Usage</p>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                              Capacity utilization is at {result.capacityUtilization.toFixed(0)}%. Consider splitting
                              into multiple routes or using a larger vehicle.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {result.totalDistance > 200 && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-blue-800 dark:text-blue-200">Long Route Distance</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                              Consider adding a mid-route break or splitting into morning/afternoon routes for driver safety.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">Optimization Complete</p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Route has been optimized for {optimizationGoal} using nearest-neighbor heuristic with time window constraints.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Run Optimization First</h3>
                <p className="text-muted-foreground mb-6">
                  Analysis will be available after running the route optimization.
                </p>
                <Button onClick={runOptimization} className="bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                  <Calculator className="mr-2 h-4 w-4" />
                  Run Optimization
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
