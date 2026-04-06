"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Ship,
  Container,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Package,
  Calendar,
  Info,
  Lightbulb,
  ArrowRight,
  BarChart3,
  Zap,
  Timer,
  CheckCircle2,
  XCircle,
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  Line,
} from "recharts";

// Port dwell time data
interface PortDwellData {
  code: string;
  name: string;
  region: string;
  avgDwellTime: number; // in days
  peakDwellTime: number;
  storageCostPerDay: number; // USD per TEU
  demurrageStartDay: number;
  congestionLevel: "low" | "medium" | "high" | "critical";
  efficiency: number; // percentage
  typicalFreeDays: number;
}

const PORT_DWELL_DATA: PortDwellData[] = [
  // Asia
  { code: "CNSHA", name: "Shanghai", region: "Asia", avgDwellTime: 3.2, peakDwellTime: 7, storageCostPerDay: 45, demurrageStartDay: 7, congestionLevel: "low", efficiency: 92, typicalFreeDays: 7 },
  { code: "CNSZX", name: "Shenzhen", region: "Asia", avgDwellTime: 2.8, peakDwellTime: 6, storageCostPerDay: 40, demurrageStartDay: 7, congestionLevel: "low", efficiency: 94, typicalFreeDays: 7 },
  { code: "CNNGB", name: "Ningbo-Zhoushan", region: "Asia", avgDwellTime: 3.0, peakDwellTime: 6, storageCostPerDay: 42, demurrageStartDay: 7, congestionLevel: "low", efficiency: 93, typicalFreeDays: 7 },
  { code: "SGSIN", name: "Singapore", region: "Asia", avgDwellTime: 2.1, peakDwellTime: 5, storageCostPerDay: 55, demurrageStartDay: 5, congestionLevel: "low", efficiency: 96, typicalFreeDays: 5 },
  { code: "KRPUS", name: "Busan", region: "Asia", avgDwellTime: 2.5, peakDwellTime: 5, storageCostPerDay: 50, demurrageStartDay: 7, congestionLevel: "low", efficiency: 95, typicalFreeDays: 7 },
  { code: "HKHKG", name: "Hong Kong", region: "Asia", avgDwellTime: 2.3, peakDwellTime: 5, storageCostPerDay: 60, demurrageStartDay: 5, congestionLevel: "low", efficiency: 94, typicalFreeDays: 5 },
  { code: "MYPKG", name: "Port Klang", region: "Asia", avgDwellTime: 3.5, peakDwellTime: 7, storageCostPerDay: 35, demurrageStartDay: 7, congestionLevel: "medium", efficiency: 88, typicalFreeDays: 7 },
  { code: "THBKK", name: "Laem Chabang", region: "Asia", avgDwellTime: 3.8, peakDwellTime: 8, storageCostPerDay: 38, demurrageStartDay: 7, congestionLevel: "medium", efficiency: 86, typicalFreeDays: 7 },
  { code: "VNHPH", name: "Haiphong", region: "Asia", avgDwellTime: 4.2, peakDwellTime: 9, storageCostPerDay: 32, demurrageStartDay: 7, congestionLevel: "medium", efficiency: 82, typicalFreeDays: 7 },
  { code: "VNSGN", name: "Ho Chi Minh City", region: "Asia", avgDwellTime: 4.0, peakDwellTime: 8, storageCostPerDay: 34, demurrageStartDay: 7, congestionLevel: "medium", efficiency: 84, typicalFreeDays: 7 },
  // Middle East
  { code: "AEJEA", name: "Jebel Ali", region: "Middle East", avgDwellTime: 3.5, peakDwellTime: 7, storageCostPerDay: 48, demurrageStartDay: 7, congestionLevel: "low", efficiency: 90, typicalFreeDays: 7 },
  { code: "SAJED", name: "Jeddah", region: "Middle East", avgDwellTime: 5.0, peakDwellTime: 10, storageCostPerDay: 42, demurrageStartDay: 7, congestionLevel: "medium", efficiency: 80, typicalFreeDays: 7 },
  // Europe
  { code: "NLRTM", name: "Rotterdam", region: "Europe", avgDwellTime: 2.8, peakDwellTime: 6, storageCostPerDay: 65, demurrageStartDay: 4, congestionLevel: "low", efficiency: 94, typicalFreeDays: 4 },
  { code: "BEANR", name: "Antwerp", region: "Europe", avgDwellTime: 3.0, peakDwellTime: 6, storageCostPerDay: 60, demurrageStartDay: 4, congestionLevel: "low", efficiency: 92, typicalFreeDays: 4 },
  { code: "DEHAM", name: "Hamburg", region: "Europe", avgDwellTime: 3.2, peakDwellTime: 7, storageCostPerDay: 68, demurrageStartDay: 4, congestionLevel: "medium", efficiency: 90, typicalFreeDays: 4 },
  { code: "ESALG", name: "Algeciras", region: "Europe", avgDwellTime: 2.5, peakDwellTime: 5, storageCostPerDay: 55, demurrageStartDay: 5, congestionLevel: "low", efficiency: 93, typicalFreeDays: 5 },
  { code: "ESBAR", name: "Barcelona", region: "Europe", avgDwellTime: 3.0, peakDwellTime: 6, storageCostPerDay: 58, demurrageStartDay: 5, congestionLevel: "low", efficiency: 91, typicalFreeDays: 5 },
  { code: "GBFXT", name: "Felixstowe", region: "Europe", avgDwellTime: 4.5, peakDwellTime: 9, storageCostPerDay: 72, demurrageStartDay: 4, congestionLevel: "medium", efficiency: 82, typicalFreeDays: 4 },
  { code: "GRPIR", name: "Piraeus", region: "Europe", avgDwellTime: 3.0, peakDwellTime: 6, storageCostPerDay: 52, demurrageStartDay: 5, congestionLevel: "low", efficiency: 90, typicalFreeDays: 5 },
  // North America
  { code: "USLAX", name: "Los Angeles", region: "North America", avgDwellTime: 5.5, peakDwellTime: 12, storageCostPerDay: 95, demurrageStartDay: 5, congestionLevel: "high", efficiency: 75, typicalFreeDays: 5 },
  { code: "USLGB", name: "Long Beach", region: "North America", avgDwellTime: 5.8, peakDwellTime: 13, storageCostPerDay: 92, demurrageStartDay: 5, congestionLevel: "high", efficiency: 73, typicalFreeDays: 5 },
  { code: "USNYC", name: "New York/New Jersey", region: "North America", avgDwellTime: 4.8, peakDwellTime: 10, storageCostPerDay: 85, demurrageStartDay: 5, congestionLevel: "medium", efficiency: 80, typicalFreeDays: 5 },
  { code: "USSAV", name: "Savannah", region: "North America", avgDwellTime: 3.5, peakDwellTime: 7, storageCostPerDay: 75, demurrageStartDay: 5, congestionLevel: "low", efficiency: 88, typicalFreeDays: 5 },
  { code: "USOAK", name: "Oakland", region: "North America", avgDwellTime: 4.2, peakDwellTime: 9, storageCostPerDay: 80, demurrageStartDay: 5, congestionLevel: "medium", efficiency: 82, typicalFreeDays: 5 },
  // South America
  { code: "BRSSZ", name: "Santos", region: "South America", avgDwellTime: 5.5, peakDwellTime: 11, storageCostPerDay: 55, demurrageStartDay: 5, congestionLevel: "medium", efficiency: 78, typicalFreeDays: 5 },
  // Oceania
  { code: "AUSYD", name: "Sydney", region: "Oceania", avgDwellTime: 3.8, peakDwellTime: 8, storageCostPerDay: 78, demurrageStartDay: 3, congestionLevel: "medium", efficiency: 85, typicalFreeDays: 3 },
  { code: "AUMEL", name: "Melbourne", region: "Oceania", avgDwellTime: 3.5, peakDwellTime: 7, storageCostPerDay: 75, demurrageStartDay: 3, congestionLevel: "low", efficiency: 87, typicalFreeDays: 3 },
];

// Cargo types with dwell time multipliers
const CARGO_TYPES = [
  { id: "general", name: "General Cargo", multiplier: 1.0, icon: "📦" },
  { id: "reefer", name: "Refrigerated", multiplier: 1.3, icon: "🧊" },
  { id: "hazardous", name: "Hazardous (IMDG)", multiplier: 1.5, icon: "☢️" },
  { id: "oog", name: "Out of Gauge (OOG)", multiplier: 1.4, icon: "📏" },
  { id: "fragile", name: "Fragile Goods", multiplier: 1.2, icon: "⚠️" },
  { id: "valuable", name: "High Value", multiplier: 1.1, icon: "💎" },
  { id: "bulk", name: "Bulk Cargo", multiplier: 1.0, icon: "⚖️" },
  { id: "vehicles", name: "Vehicles (RoRo)", multiplier: 1.2, icon: "🚗" },
];

// Container types
const CONTAINER_TYPES = [
  { id: "20st", name: "20' Standard", teu: 1, costMultiplier: 0.8 },
  { id: "40st", name: "40' Standard", teu: 2, costMultiplier: 1.0 },
  { id: "40hc", name: "40' High Cube", teu: 2, costMultiplier: 1.1 },
  { id: "45hc", name: "45' High Cube", teu: 2.25, costMultiplier: 1.2 },
  { id: "20rf", name: "20' Reefer", teu: 1, costMultiplier: 1.4 },
  { id: "40rf", name: "40' Reefer", teu: 2, costMultiplier: 1.6 },
  { id: "20ot", name: "20' Open Top", teu: 1, costMultiplier: 1.3 },
  { id: "40ot", name: "40' Open Top", teu: 2, costMultiplier: 1.5 },
  { id: "20fr", name: "20' Flat Rack", teu: 1, costMultiplier: 1.4 },
  { id: "40fr", name: "40' Flat Rack", teu: 2, costMultiplier: 1.6 },
];

// Optimization tips based on scenario
const OPTIMIZATION_TIPS = [
  {
    condition: "high_congestion",
    title: "Congestion Mitigation",
    tips: [
      "Consider alternative ports with lower congestion",
      "Pre-file customs documentation 48+ hours before arrival",
      "Book terminal appointments in advance",
      "Use night gate operations when available",
      "Arrange dedicated chassis for faster pickup",
    ],
  },
  {
    condition: "exceeded_free_time",
    title: "Free Time Management",
    tips: [
      "Negotiate extended free time in service contracts",
      "Split container pickups across multiple days",
      "Utilize bonded warehouse storage",
      "Coordinate with trucking for same-day pickup",
      "Monitor real-time vessel schedules for accurate planning",
    ],
  },
  {
    condition: "high_storage_cost",
    title: "Cost Reduction Strategies",
    tips: [
      "Optimize inventory to reduce container count",
      "Use container freight stations (CFS) for LCL",
      "Consider transloading at port to reduce storage fees",
      "Negotiate volume discounts with terminals",
      "Implement just-in-time pickup schedules",
    ],
  },
  {
    condition: "special_cargo",
    title: "Special Cargo Handling",
    tips: [
      "Pre-arrange specialized equipment and handling",
      "Ensure all permits and documentation are ready",
      "Coordinate with terminal for priority placement",
      "Consider dedicated berth arrangements",
      "Plan for additional inspection time",
    ],
  },
  {
    condition: "general",
    title: "General Best Practices",
    tips: [
      "Track container status in real-time",
      "Maintain buffer time in logistics planning",
      "Build relationships with terminal operators",
      "Use digital platforms for document submission",
      "Consider peak season surcharges in budgeting",
    ],
  },
];

const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#22C55E",
  chart: ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6"],
};

export function PortDwellTimeCalculator() {
  const [selectedPort, setSelectedPort] = useState<string>("USLAX");
  const [cargoType, setCargoType] = useState<string>("general");
  const [containerType, setContainerType] = useState<string>("40st");
  const [containerCount, setContainerCount] = useState<string>("1");
  const [estimatedDwellDays, setEstimatedDwellDays] = useState<string>("");
  const [customFreeDays, setCustomFreeDays] = useState<string>("");
  const [demurrageRate, setDemurrageRate] = useState<string>("");
  const [includeWeekends, setIncludeWeekends] = useState<boolean>(true);
  const [peakSeason, setPeakSeason] = useState<boolean>(false);

  // Get port data
  const portData = useMemo(() => {
    return PORT_DWELL_DATA.find(p => p.code === selectedPort) || PORT_DWELL_DATA[0];
  }, [selectedPort]);

  // Get cargo type data
  const cargoData = useMemo(() => {
    return CARGO_TYPES.find(c => c.id === cargoType) || CARGO_TYPES[0];
  }, [cargoType]);

  // Get container type data
  const containerData = useMemo(() => {
    return CONTAINER_TYPES.find(c => c.id === containerType) || CONTAINER_TYPES[0];
  }, [containerType]);

  // Calculate results
  const calculations = useMemo(() => {
    const numContainers = parseInt(containerCount) || 1;
    const freeDays = customFreeDays ? parseInt(customFreeDays) : portData.typicalFreeDays;
    const userDwellDays = estimatedDwellDays ? parseFloat(estimatedDwellDays) : portData.avgDwellTime;
    
    // Adjust dwell time based on cargo type
    const adjustedDwellTime = userDwellDays * cargoData.multiplier * (peakSeason ? 1.25 : 1);
    
    // Calculate excess days
    const excessDays = Math.max(0, adjustedDwellTime - freeDays);
    
    // Calculate storage costs
    const storageDays = Math.min(adjustedDwellTime, freeDays);
    const storageCost = storageDays * portData.storageCostPerDay * containerData.costMultiplier * numContainers;
    
    // Calculate demurrage
    const demurrageRateValue = demurrageRate ? parseFloat(demurrageRate) : portData.storageCostPerDay * 1.5;
    const demurrageCost = excessDays * demurrageRateValue * containerData.costMultiplier * numContainers;
    
    // Total cost
    const totalCost = storageCost + demurrageCost;
    
    // Efficiency score (how well they're using free time)
    const efficiencyScore = Math.max(0, Math.min(100, ((freeDays - adjustedDwellTime) / freeDays) * 100 + 50));
    
    // Risk assessment
    const riskLevel = excessDays > 5 ? "high" : excessDays > 2 ? "medium" : "low";
    
    // Potential savings if optimized
    const potentialSavings = excessDays > 0 ? demurrageCost * 0.4 : 0;

    return {
      adjustedDwellTime,
      freeDays,
      excessDays,
      storageDays,
      storageCost,
      demurrageCost,
      totalCost,
      efficiencyScore,
      riskLevel,
      potentialSavings,
      demurrageRate: demurrageRateValue,
    };
  }, [selectedPort, cargoType, containerType, containerCount, estimatedDwellDays, customFreeDays, demurrageRate, peakSeason, portData, cargoData, containerData]);

  // Get applicable optimization tips
  const applicableTips = useMemo(() => {
    const tips: typeof OPTIMIZATION_TIPS = [];
    
    if (portData.congestionLevel === "high" || portData.congestionLevel === "critical") {
      tips.push(OPTIMIZATION_TIPS.find(t => t.condition === "high_congestion")!);
    }
    if (calculations.excessDays > 0) {
      tips.push(OPTIMIZATION_TIPS.find(t => t.condition === "exceeded_free_time")!);
    }
    if (portData.storageCostPerDay > 70) {
      tips.push(OPTIMIZATION_TIPS.find(t => t.condition === "high_storage_cost")!);
    }
    if (cargoType !== "general" && cargoType !== "bulk") {
      tips.push(OPTIMIZATION_TIPS.find(t => t.condition === "special_cargo")!);
    }
    
    tips.push(OPTIMIZATION_TIPS.find(t => t.condition === "general")!);
    
    return tips.slice(0, 3);
  }, [portData, calculations, cargoType]);

  // Prepare chart data
  const dwellComparisonData = useMemo(() => {
    return PORT_DWELL_DATA.filter(p => p.region === portData.region).map(p => ({
      name: p.name.split(" ")[0],
      avgDwell: p.avgDwellTime,
      peakDwell: p.peakDwellTime,
      isCurrent: p.code === selectedPort,
    }));
  }, [portData, selectedPort]);

  const costBreakdownData = useMemo(() => [
    { name: "Storage", value: calculations.storageCost, color: COLORS.ocean },
    { name: "Demurrage", value: calculations.demurrageCost, color: COLORS.danger },
  ], [calculations]);

  const weeklyTrendData = useMemo(() => {
    const weeks = [];
    for (let i = 5; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * 2;
      weeks.push({
        week: `W${6 - i}`,
        dwell: Math.max(1, portData.avgDwellTime + variance),
        target: portData.typicalFreeDays,
      });
    }
    return weeks;
  }, [portData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case "low": return "bg-green-500";
      case "medium": return "bg-amber-500";
      case "high": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-green-600 dark:text-green-400";
      case "medium": return "text-amber-600 dark:text-amber-400";
      case "high": return "text-red-600 dark:text-red-400";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="calculator" className="text-xs md:text-sm">
            <Calculator className="h-4 w-4 mr-2" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs md:text-sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs md:text-sm">
            <MapPin className="h-4 w-4 mr-2" />
            Compare Ports
          </TabsTrigger>
          <TabsTrigger value="optimization" className="text-xs md:text-sm">
            <Lightbulb className="h-4 w-4 mr-2" />
            Optimize
          </TabsTrigger>
          <TabsTrigger value="reference" className="text-xs md:text-sm">
            <Info className="h-4 w-4 mr-2" />
            Reference
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Port Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ship className="h-5 w-5 text-[var(--ocean)]" />
                    Port Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Port of Discharge</Label>
                    <Select value={selectedPort} onValueChange={setSelectedPort}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {Object.entries(
                          PORT_DWELL_DATA.reduce((acc, port) => {
                            if (!acc[port.region]) acc[port.region] = [];
                            acc[port.region].push(port);
                            return acc;
                          }, {} as Record<string, typeof PORT_DWELL_DATA>)
                        ).map(([region, ports]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground bg-muted">
                              {region}
                            </div>
                            {ports.map(port => (
                              <SelectItem key={port.code} value={port.code}>
                                <div className="flex items-center justify-between w-full gap-4">
                                  <span>{port.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {port.avgDwellTime}d avg
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Avg Dwell Time</div>
                      <div className="text-xl font-bold">{portData.avgDwellTime} days</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Free Days</div>
                      <div className="text-xl font-bold">{portData.typicalFreeDays} days</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Congestion Level</span>
                    <Badge className={`${getCongestionColor(portData.congestionLevel)} text-white`}>
                      {portData.congestionLevel.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Port Efficiency</span>
                      <span className="font-medium">{portData.efficiency}%</span>
                    </div>
                    <Progress value={portData.efficiency} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Cargo & Container */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--logistics)]" />
                    Cargo Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Cargo Type</Label>
                      <Select value={cargoType} onValueChange={setCargoType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CARGO_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              <span className="flex items-center gap-2">
                                <span>{type.icon}</span>
                                <span>{type.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Container Type</Label>
                      <Select value={containerType} onValueChange={setContainerType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTAINER_TYPES.map(type => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="containerCount">Number of Containers</Label>
                    <Input
                      id="containerCount"
                      type="number"
                      min="1"
                      value={containerCount}
                      onChange={(e) => setContainerCount(e.target.value)}
                    />
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <span>
                        {cargoData.name} cargo has a {((cargoData.multiplier - 1) * 100).toFixed(0)}% dwell time increase
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Timer className="h-5 w-5 text-[var(--ocean)]" />
                    Time & Rates (Optional)
                  </CardTitle>
                  <CardDescription>Customize parameters for accurate estimates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dwellDays">Estimated Dwell Days</Label>
                      <Input
                        id="dwellDays"
                        type="number"
                        step="0.5"
                        placeholder={`Avg: ${portData.avgDwellTime}`}
                        value={estimatedDwellDays}
                        onChange={(e) => setEstimatedDwellDays(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freeDays">Contract Free Days</Label>
                      <Input
                        id="freeDays"
                        type="number"
                        placeholder={String(portData.typicalFreeDays)}
                        value={customFreeDays}
                        onChange={(e) => setCustomFreeDays(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demRate">Demurrage Rate ($/day/container)</Label>
                    <Input
                      id="demRate"
                      type="number"
                      placeholder={`Est: $${(portData.storageCostPerDay * 1.5).toFixed(0)}`}
                      value={demurrageRate}
                      onChange={(e) => setDemurrageRate(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="peakSeason" className="cursor-pointer">
                      Peak Season Adjustment (+25%)
                    </Label>
                    <input
                      id="peakSeason"
                      type="checkbox"
                      checked={peakSeason}
                      onChange={(e) => setPeakSeason(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Result Card */}
              <Card className={`overflow-hidden ${calculations.totalCost > 0 ? "border-amber-200 dark:border-amber-800" : ""}`}>
                <div className={`h-2 ${
                  calculations.riskLevel === "high" ? "bg-red-500" :
                  calculations.riskLevel === "medium" ? "bg-amber-500" : "bg-green-500"
                }`} />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Estimated Costs
                  </CardTitle>
                  <CardDescription>
                    {portData.name} • {containerCount} x {containerData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`text-5xl font-bold ${
                        calculations.totalCost > 500 ? "text-red-600 dark:text-red-400" :
                        calculations.totalCost > 0 ? "text-amber-600 dark:text-amber-400" :
                        "text-green-600 dark:text-green-400"
                      }`}
                    >
                      {formatCurrency(calculations.totalCost)}
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">
                      Total Estimated Cost
                    </div>
                    <Badge variant="outline" className={`mt-2 ${getRiskColor(calculations.riskLevel)}`}>
                      {calculations.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Adjusted Dwell Time</span>
                      </div>
                      <span className="font-medium">
                        {calculations.adjustedDwellTime.toFixed(1)} days
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <Container className="h-4 w-4 text-muted-foreground" />
                        <span>Storage Cost</span>
                        <Badge variant="secondary" className="text-xs">
                          {calculations.storageDays.toFixed(1)} days
                        </Badge>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(calculations.storageCost)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span>Demurrage</span>
                        {calculations.excessDays > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            +{calculations.excessDays.toFixed(1)} days
                          </Badge>
                        )}
                      </div>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        {formatCurrency(calculations.demurrageCost)}
                      </span>
                    </div>
                  </div>

                  {calculations.potentialSavings > 0 && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <TrendingDown className="h-5 w-5" />
                        <span className="font-semibold">
                          Potential Savings: {formatCurrency(calculations.potentialSavings)}
                        </span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        By reducing dwell time by 40%, you could save this amount
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timeline Visualization */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--logistics)]" />
                    Dwell Time Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                      <span>Arrival</span>
                      <span>Free Time End</span>
                      <span>Pickup</span>
                    </div>
                    <div className="h-8 bg-muted rounded-lg overflow-hidden flex relative">
                      {/* Free time (green) */}
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ width: `${Math.min(100, (calculations.freeDays / (calculations.adjustedDwellTime + 2)) * 100)}%` }}
                      >
                        Free
                      </div>
                      {/* Demurrage (red) */}
                      {calculations.excessDays > 0 && (
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-400 h-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ width: `${Math.min(50, (calculations.excessDays / (calculations.adjustedDwellTime + 2)) * 100)}%` }}
                        >
                          D&D
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-2 text-xs">
                      <span className="text-green-600">0 - {calculations.freeDays}d</span>
                      {calculations.excessDays > 0 && (
                        <span className="text-red-600">+{calculations.excessDays.toFixed(1)}d</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-[var(--ocean)]">
                      {portData.typicalFreeDays}
                    </div>
                    <div className="text-xs text-muted-foreground">Free Days</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold text-[var(--logistics)]">
                      ${portData.storageCostPerDay}
                    </div>
                    <div className="text-xs text-muted-foreground">Storage/Day</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 text-center">
                    <div className="text-2xl font-bold">
                      {portData.avgDwellTime}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Dwell</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Breakdown</CardTitle>
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
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
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

            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dwell Time Trend (Last 6 Weeks)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="dwell"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.3}
                        name="Actual Dwell"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke={COLORS.danger}
                        strokeDasharray="5 5"
                        name="Free Time Limit"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {portData.region} Ports - Dwell Time Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dwellComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgDwell" name="Avg Dwell" fill={COLORS.ocean} />
                    <Bar dataKey="peakDwell" name="Peak Dwell" fill={COLORS.warning} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Compare Ports by Region</CardTitle>
              <CardDescription>
                Select a region to compare dwell times across ports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Port</th>
                      <th className="text-left py-3 px-4">Region</th>
                      <th className="text-center py-3 px-4">Avg Dwell</th>
                      <th className="text-center py-3 px-4">Peak Dwell</th>
                      <th className="text-center py-3 px-4">Free Days</th>
                      <th className="text-center py-3 px-4">Storage/Day</th>
                      <th className="text-center py-3 px-4">Congestion</th>
                      <th className="text-center py-3 px-4">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PORT_DWELL_DATA.map(port => (
                      <tr
                        key={port.code}
                        className={`border-b cursor-pointer hover:bg-muted/50 ${
                          port.code === selectedPort ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedPort(port.code)}
                      >
                        <td className="py-3 px-4 font-medium">
                          {port.name}
                          {port.code === selectedPort && (
                            <Badge className="ml-2 bg-[var(--ocean)]">Selected</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{port.region}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={port.avgDwellTime > 4 ? "text-red-600" : ""}>
                            {port.avgDwellTime}d
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{port.peakDwellTime}d</td>
                        <td className="py-3 px-4 text-center">{port.typicalFreeDays}d</td>
                        <td className="py-3 px-4 text-center">${port.storageCostPerDay}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={`${getCongestionColor(port.congestionLevel)} text-white text-xs`}>
                            {port.congestionLevel}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Progress value={port.efficiency} className="w-16 h-2" />
                            <span className="text-xs">{port.efficiency}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {applicableTips.map((tip, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tip.tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="bg-[var(--ocean)]/5 border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                Quick Optimization Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start h-auto py-3">
                  <Calendar className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Pre-file Documents</div>
                    <div className="text-xs text-muted-foreground">Submit customs 48h early</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3">
                  <MapPin className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Alternative Ports</div>
                    <div className="text-xs text-muted-foreground">View nearby options</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-3">
                  <Clock className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Schedule Pickup</div>
                    <div className="text-xs text-muted-foreground">Book terminal appointment</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reference" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Dwell Time Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Factors Affecting Dwell Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <div className="font-medium">Port Congestion</div>
                    <div className="text-sm text-muted-foreground">
                      High vessel volumes, labor shortages, equipment availability
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <div className="font-medium">Customs Clearance</div>
                    <div className="text-sm text-muted-foreground">
                      Documentation accuracy, inspection requirements, bond status
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Container className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-medium">Cargo Type</div>
                    <div className="text-sm text-muted-foreground">
                      Special handling, permits, inspections for hazardous/refer cargo
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                    <Ship className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium">Terminal Operations</div>
                    <div className="text-sm text-muted-foreground">
                      Gate capacity, yard space, crane availability, chassis pools
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Port Cost Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="storage">
                    <AccordionTrigger className="text-sm">
                      Storage Charges
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      <p className="mb-2">
                        Storage fees are charged by the terminal for containers occupying space
                        beyond the free time period. Rates vary by container size and type.
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Standard containers: Lower rate per TEU</li>
                        <li>Reefer containers: Higher rate (includes power)</li>
                        <li>OOG containers: May require additional space fees</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="demurrage">
                    <AccordionTrigger className="text-sm">
                      Demurrage vs Detention
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground mb-1">Demurrage</div>
                          <p>Charged while container is at the terminal, before pickup.</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <div className="font-medium text-foreground mb-1">Detention</div>
                          <p>Charged after pickup, while container is outside the terminal.</p>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-[var(--ocean)]/5 rounded-lg">
                          <span className="text-[var(--ocean)] font-medium">DEM</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">PICKUP</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="text-orange-500 font-medium">DET</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="freetime">
                    <AccordionTrigger className="text-sm">
                      Free Time Negotiation
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      <p className="mb-2">Tips for negotiating better free time:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Include free time clauses in service contracts</li>
                        <li>Request extended time for seasonal peaks</li>
                        <li>Bundle volume commitments for better terms</li>
                        <li>Consider dedicated carrier relationships</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Regional Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Regional Dwell Time Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Region</th>
                      <th className="text-center py-3 px-4">Avg Dwell</th>
                      <th className="text-center py-3 px-4">Min</th>
                      <th className="text-center py-3 px-4">Max</th>
                      <th className="text-center py-3 px-4">Avg Free Days</th>
                      <th className="text-center py-3 px-4">Avg Storage Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      PORT_DWELL_DATA.reduce((acc, port) => {
                        if (!acc[port.region]) {
                          acc[port.region] = { total: 0, count: 0, min: Infinity, max: 0, freeDays: 0, cost: 0 };
                        }
                        acc[port.region].total += port.avgDwellTime;
                        acc[port.region].count += 1;
                        acc[port.region].min = Math.min(acc[port.region].min, port.avgDwellTime);
                        acc[port.region].max = Math.max(acc[port.region].max, port.avgDwellTime);
                        acc[port.region].freeDays += port.typicalFreeDays;
                        acc[port.region].cost += port.storageCostPerDay;
                        return acc;
                      }, {} as Record<string, { total: number; count: number; min: number; max: number; freeDays: number; cost: number }>)
                    ).map(([region, data]) => (
                      <tr key={region} className="border-b">
                        <td className="py-3 px-4 font-medium">{region}</td>
                        <td className="py-3 px-4 text-center">
                          {(data.total / data.count).toFixed(1)}d
                        </td>
                        <td className="py-3 px-4 text-center text-green-600">{data.min.toFixed(1)}d</td>
                        <td className="py-3 px-4 text-center text-red-600">{data.max.toFixed(1)}d</td>
                        <td className="py-3 px-4 text-center">
                          {(data.freeDays / data.count).toFixed(0)}d
                        </td>
                        <td className="py-3 px-4 text-center">
                          ${(data.cost / data.count).toFixed(0)}/day
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Calculator icon
function Calculator({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}
