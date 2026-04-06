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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Truck,
  Weight,
  Ruler,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Info,
  Gauge,
  MapPin,
  ArrowRight,
  AlertCircle,
  Scale,
  ArrowLeftRight,
  CircleDot,
  BarChart3,
  BookOpen,
  Settings,
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
  ReferenceLine,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// Truck configurations
const TRUCK_TYPES = {
  TWO_AXLE: {
    id: "TWO_AXLE",
    name: "2-Axle Straight Truck",
    description: "Single unit truck with 2 axles",
    axles: 2,
    defaultAxleSpacing: [4.5], // meters between axles
    defaultTareWeight: 6000, // kg
    maxGVW: 18000, // kg
    icon: "🚚",
  },
  THREE_AXLE: {
    id: "THREE_AXLE",
    name: "3-Axle Straight Truck",
    description: "Single unit truck with 3 axles",
    axles: 3,
    defaultAxleSpacing: [4.5, 1.4],
    defaultTareWeight: 9000,
    maxGVW: 26000,
    icon: "🚚",
  },
  FOUR_AXLE: {
    id: "FOUR_AXLE",
    name: "4-Axle Semi-Trailer",
    description: "Tractor with 2 axles + 2-axle trailer",
    axles: 4,
    defaultAxleSpacing: [3.5, 7.0, 1.3],
    defaultTareWeight: 14000,
    maxGVW: 36000,
    icon: "🚛",
  },
  FIVE_AXLE: {
    id: "FIVE_AXLE",
    name: "5-Axle Semi-Trailer",
    description: "Tractor with 2 axles + 3-axle trailer",
    axles: 5,
    defaultAxleSpacing: [3.5, 7.0, 1.3, 1.3],
    defaultTareWeight: 16000,
    maxGVW: 44000,
    icon: "🚛",
  },
  B_DOUBLE: {
    id: "B_DOUBLE",
    name: "B-Double (Road Train)",
    description: "Tractor with 2 trailers",
    axles: 7,
    defaultAxleSpacing: [3.5, 7.0, 1.3, 6.5, 1.3, 1.3],
    defaultTareWeight: 22000,
    maxGVW: 62500,
    icon: "🚛",
  },
};

// Trailer types
const TRAILER_TYPES = {
  FLATBED: { name: "Flatbed", length: 13.6, width: 2.45, tareWeight: 6000 },
  CURTAIN_SIDE: { name: "Curtain Side", length: 13.6, width: 2.45, tareWeight: 6500 },
  BOX: { name: "Box Trailer", length: 13.6, width: 2.45, tareWeight: 7000 },
  LOW_LOADER: { name: "Low Loader", length: 12.0, width: 2.80, tareWeight: 8000 },
  REFRIGERATED: { name: "Refrigerated", length: 13.6, width: 2.45, tareWeight: 8500 },
};

// Legal axle weight limits by region (kg)
const LEGAL_LIMITS = {
  US: {
    name: "United States",
    singleAxle: 20000, // lbs 20,000
    tandemAxle: 34000, // lbs 34,000
    tridemAxle: 51000, // lbs 51,000
    maxGVW: 80000, // lbs 80,000
    bridgeFormula: true,
  },
  EU: {
    name: "European Union",
    singleAxle: 11500,
    tandemAxle: 19000,
    tridemAxle: 27000,
    driveAxle: 11500,
    maxGVW: 40000,
    bridgeFormula: false,
  },
  UK: {
    name: "United Kingdom",
    singleAxle: 11500,
    tandemAxle: 19000,
    tridemAxle: 27000,
    maxGVW: 44000,
    bridgeFormula: false,
  },
  AU: {
    name: "Australia",
    singleAxle: 9000,
    tandemAxle: 16500,
    tridemAxle: 22500,
    maxGVW: 62500,
    bridgeFormula: false,
  },
};

// Bridge formula calculation (US Federal Bridge Formula)
// W = 500 * ((L*N)/(N-1) + 12*N + 36)
function calculateBridgeFormula(axleSpacing: number[], weight: number[]): { maxWeight: number; compliant: boolean }[] {
  const results: { maxWeight: number; compliant: boolean }[] = [];

  for (let i = 0; i < weight.length; i++) {
    // For single axle
    if (i === 0 || i === weight.length - 1) {
      const maxWeight = 20000; // 20,000 lbs single axle limit
      results.push({
        maxWeight: Math.round(maxWeight * 0.453592), // Convert to kg
        compliant: weight[i] <= maxWeight * 0.453592,
      });
    } else {
      // For tandem/tridem groups
      const spacing = axleSpacing[i - 1] || 1.3;
      const L = spacing * 3.28084; // Convert meters to feet
      const N = 2; // Number of axles in group
      const maxWeight = 500 * ((L * N) / (N - 1) + 12 * N + 36);
      results.push({
        maxWeight: Math.round(maxWeight * 0.453592),
        compliant: weight[i] <= maxWeight * 0.453592,
      });
    }
  }

  return results;
}

interface AxleLoadResult {
  axleLoads: number[];
  grossVehicleWeight: number;
  loadDistribution: number[];
  complianceStatus: {
    axle: { compliant: boolean; status: "safe" | "warning" | "overload"; limit: number }[];
    gvw: { compliant: boolean; status: "safe" | "warning" | "overload" };
  };
  bridgeFormulaResults?: { maxWeight: number; compliant: boolean }[];
  utilizationPercentage: number[];
  warnings: string[];
  suggestions: string[];
}

export function AxleLoadCalculator() {
  const [activeTab, setActiveTab] = useState("configuration");

  // Truck configuration
  const [truckType, setTruckType] = useState<keyof typeof TRUCK_TYPES>("FIVE_AXLE");
  const [trailerType, setTrailerType] = useState<keyof typeof TRAILER_TYPES>("FLATBED");
  const [tareWeight, setTareWeight] = useState<string>("16000");
  const [axleSpacing, setAxleSpacing] = useState<number[]>(TRUCK_TYPES.FIVE_AXLE.defaultAxleSpacing);
  const [region, setRegion] = useState<keyof typeof LEGAL_LIMITS>("EU");

  // Cargo input
  const [cargoWeight, setCargoWeight] = useState<string>("20000");
  const [cargoLength, setCargoLength] = useState<string>("10");
  const [cargoWidth, setCargoWidth] = useState<string>("2.4");
  const [cargoHeight, setCargoHeight] = useState<string>("2.5");
  const [loadPositions, setLoadPositions] = useState<number>(1);
  const [positionOffsets, setPositionOffsets] = useState<number[]>([0]); // Distance from front
  const [positionWeights, setPositionWeights] = useState<number[]>([100]); // Percentage per position

  // Options
  const [useBridgeFormula, setUseBridgeFormula] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Derived values for axle spacing based on truck type
  const currentAxleSpacing = useMemo(() => {
    return axleSpacing;
  }, [axleSpacing]);

  // Derived values for position arrays
  const currentPositionOffsets = useMemo(() => {
    return Array(loadPositions).fill(0).map((_, i) => positionOffsets[i] || 0);
  }, [loadPositions, positionOffsets]);

  const currentPositionWeights = useMemo(() => {
    const newWeights = Array(loadPositions).fill(0).map((_, i) => {
      const existing = positionWeights[i];
      if (existing !== undefined) return existing;
      return Math.round(100 / loadPositions);
    });
    const sum = newWeights.reduce((a, b) => a + b, 0);
    return newWeights.map(w => Math.round((w / sum) * 100));
  }, [loadPositions, positionWeights]);

  // Calculate axle load distribution
  const result = useMemo((): AxleLoadResult => {
    const truck = TRUCK_TYPES[truckType];
    const limits = LEGAL_LIMITS[region];
    const totalCargoWeight = parseFloat(cargoWeight) || 0;
    const vehicleTare = parseFloat(tareWeight) || 0;
    const cargoLen = parseFloat(cargoLength) || 0;

    // Calculate total vehicle length from axle spacing
    const totalLength = axleSpacing.reduce((a, b) => a + b, 0) + 3; // Add wheelbase for front overhang

    // Calculate axle positions from front
    let axlePosition = 1.5; // Front overhang
    const axlePositions = [axlePosition];
    for (const spacing of axleSpacing) {
      axlePosition += spacing;
      axlePositions.push(axlePosition);
    }

    // Calculate load distribution using moment method
    // Each axle carries load based on its distance from the center of gravity
    const axleLoads: number[] = [];
    const gvw = vehicleTare + totalCargoWeight;

    // Tare weight distribution (approximate based on truck type)
    const tareDistribution = Array(truck.axles).fill(vehicleTare / truck.axles);

    // Adjust for engine weight (front axles carry more tare weight)
    tareDistribution[0] = vehicleTare * 0.25; // Front axle (steering)
    if (truck.axles > 1) {
      tareDistribution[1] = vehicleTare * 0.35; // Drive axle
    }
    const remainingTare = vehicleTare - tareDistribution[0] - (truck.axles > 1 ? tareDistribution[1] : 0);
    for (let i = 2; i < truck.axles; i++) {
      tareDistribution[i] = remainingTare / (truck.axles - 2);
    }

    // Calculate cargo load distribution to each axle
    const cargoLoads: number[] = Array(truck.axles).fill(0);

    for (let pos = 0; pos < loadPositions; pos++) {
      const posWeight = (positionWeights[pos] / 100) * totalCargoWeight;
      const posOffset = (positionOffsets[pos] / 100) * totalLength; // Convert percentage to meters
      const cargoCenterOfGravity = posOffset + (cargoLen / 2);

      // Calculate load on each axle using lever arm principle
      // Moment about each axle point
      let totalMoment = 0;
      const momentArms: number[] = [];

      for (let i = 0; i < truck.axles; i++) {
        const arm = cargoCenterOfGravity - axlePositions[i];
        momentArms.push(arm);
        totalMoment += Math.abs(arm);
      }

      // Distribute weight based on moment arms (inverse - closer axles take more load)
      for (let i = 0; i < truck.axles; i++) {
        const normalizedArm = 1 - (Math.abs(momentArms[i]) / totalLength);
        cargoLoads[i] += posWeight * normalizedArm / truck.axles;
      }
    }

    // Combine tare and cargo loads
    for (let i = 0; i < truck.axles; i++) {
      axleLoads.push(Math.round(tareDistribution[i] + cargoLoads[i]));
    }

    // Normalize if GVW doesn't match
    const calculatedGVW = axleLoads.reduce((a, b) => a + b, 0);
    const correctionFactor = gvw / calculatedGVW;
    const correctedLoads = axleLoads.map(load => Math.round(load * correctionFactor));

    // Check compliance
    const axleCompliance = correctedLoads.map((load, index) => {
      let limit = limits.singleAxle;

      // Check for tandem/tridem groups
      if (index > 0 && index < truck.axles - 1) {
        // Consider as tandem if spacing is small
        const avgSpacing = axleSpacing[index - 1] || 1.3;
        if (avgSpacing < 2.0) {
          limit = limits.tandemAxle / 2;
        }
      }

      const utilization = (load / limit) * 100;
      let status: "safe" | "warning" | "overload" = "safe";
      if (utilization > 100) status = "overload";
      else if (utilization > 90) status = "warning";

      return { compliant: load <= limit, status, limit };
    });

    const gvwCompliance = {
      compliant: gvw <= limits.maxGVW,
      status: gvw > limits.maxGVW ? "overload" as const : gvw > limits.maxGVW * 0.9 ? "warning" as const : "safe" as const,
    };

    // Bridge formula calculation (US only)
    let bridgeFormulaResults: { maxWeight: number; compliant: boolean }[] | undefined;
    if (region === "US" && useBridgeFormula) {
      bridgeFormulaResults = calculateBridgeFormula(axleSpacing, correctedLoads);
    }

    // Utilization percentages
    const utilizationPercentages = correctedLoads.map((load, index) => {
      const limit = axleCompliance[index].limit;
      return Math.round((load / limit) * 100);
    });

    // Generate warnings and suggestions
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (gvw > limits.maxGVW) {
      warnings.push(`Gross Vehicle Weight exceeds legal limit by ${(gvw - limits.maxGVW).toLocaleString()} kg`);
      suggestions.push("Reduce cargo weight or use a higher capacity vehicle configuration");
    }

    correctedLoads.forEach((load, index) => {
      if (load > axleCompliance[index].limit) {
        warnings.push(`Axle ${index + 1} overloaded by ${(load - axleCompliance[index].limit).toLocaleString()} kg`);
      }
    });

    if (correctedLoads[0] < 0.25 * gvw) {
      suggestions.push("Consider moving load forward to improve steering axle traction");
    }

    if (correctedLoads[truck.axles - 1] > correctedLoads[0] * 1.5) {
      suggestions.push("Load distribution is rear-heavy; consider shifting cargo forward for better stability");
    }

    return {
      axleLoads: correctedLoads,
      grossVehicleWeight: Math.round(gvw),
      loadDistribution: positionWeights,
      complianceStatus: {
        axle: axleCompliance,
        gvw: gvwCompliance,
      },
      bridgeFormulaResults,
      utilizationPercentage: utilizationPercentages,
      warnings,
      suggestions,
    };
  }, [
    truckType, trailerType, tareWeight, axleSpacing, region,
    cargoWeight, cargoLength, cargoWidth, cargoHeight,
    loadPositions, positionOffsets, positionWeights, useBridgeFormula
  ]);

  // Chart data for axle loads
  const axleChartData = useMemo(() => {
    return result.axleLoads.map((load, index) => ({
      name: `Axle ${index + 1}`,
      load,
      limit: result.complianceStatus.axle[index].limit,
      utilization: result.utilizationPercentage[index],
      color: result.complianceStatus.axle[index].status === "safe" ? "#2E8B57" :
             result.complianceStatus.axle[index].status === "warning" ? "#F59E0B" : "#EF4444",
    }));
  }, [result]);

  // Compliance gauge data
  const gaugeData = useMemo(() => {
    const avgUtilization = result.utilizationPercentage.reduce((a, b) => a + b, 0) / result.utilizationPercentage.length;
    const gvwUtilization = Math.round((result.grossVehicleWeight / LEGAL_LIMITS[region].maxGVW) * 100);

    return [
      { name: "Axle Load", value: Math.min(avgUtilization, 120), fullMark: 100 },
      { name: "GVW", value: Math.min(gvwUtilization, 120), fullMark: 100 },
    ];
  }, [result, region]);

  // Weight distribution data for pie chart
  const weightDistributionData = useMemo(() => {
    const totalTare = parseFloat(tareWeight) || 0;
    const totalCargo = parseFloat(cargoWeight) || 0;
    return [
      { name: "Tare Weight", value: totalTare, color: "#0F4C81" },
      { name: "Cargo Weight", value: totalCargo, color: "#2E8B57" },
    ];
  }, [tareWeight, cargoWeight]);



  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="cargo">Cargo Input</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Truck Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[var(--ocean)]" />
                  Truck Configuration
                </CardTitle>
                <CardDescription>Select truck type and trailer configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Truck Type</Label>
                  <Select value={truckType} onValueChange={(v) => setTruckType(v as keyof typeof TRUCK_TYPES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRUCK_TYPES).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span>{config.icon}</span>
                            <span>{config.name}</span>
                            <span className="text-muted-foreground text-xs">
                              (Max {config.maxGVW / 1000}t)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Trailer Type</Label>
                  <Select value={trailerType} onValueChange={(v) => setTrailerType(v as keyof typeof TRAILER_TYPES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRAILER_TYPES).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.name} ({config.length}m × {config.width}m)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tareWeight">Vehicle Tare Weight (kg)</Label>
                  <Input
                    id="tareWeight"
                    type="number"
                    value={tareWeight}
                    onChange={(e) => setTareWeight(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Empty vehicle weight including trailer
                  </p>
                </div>

                <div>
                  <Label>Regulatory Region</Label>
                  <Select value={region} onValueChange={(v) => setRegion(v as keyof typeof LEGAL_LIMITS)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LEGAL_LIMITS).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {config.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {region === "US" && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bridge-formula"
                      checked={useBridgeFormula}
                      onCheckedChange={setUseBridgeFormula}
                    />
                    <Label htmlFor="bridge-formula" className="text-sm">
                      Apply Federal Bridge Formula
                    </Label>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Axle Spacing Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-[var(--ocean)]" />
                  Axle Spacing
                </CardTitle>
                <CardDescription>Configure distances between axles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Number of Axles</span>
                    <Badge className="bg-[var(--ocean)]">{TRUCK_TYPES[truckType].axles}</Badge>
                  </div>

                  <div className="space-y-3">
                    {axleSpacing.map((spacing, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-24">
                          Axle {index + 1} → {index + 2}:
                        </span>
                        <Input
                          type="number"
                          step="0.1"
                          value={spacing}
                          onChange={(e) => {
                            const newSpacing = [...axleSpacing];
                            newSpacing[index] = parseFloat(e.target.value) || 0;
                            setAxleSpacing(newSpacing);
                          }}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">meters</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Wheelbase</span>
                    <span className="font-bold text-[var(--ocean)]">
                      {axleSpacing.reduce((a, b) => a + b, 0).toFixed(1)}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Max Legal GVW</span>
                    <span className="font-bold text-[var(--logistics)]">
                      {(LEGAL_LIMITS[region].maxGVW / 1000).toFixed(0)} tonnes
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setAxleSpacing(TRUCK_TYPES[truckType].defaultAxleSpacing)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Default Spacing
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cargo Input Tab */}
        <TabsContent value="cargo" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cargo Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-[var(--ocean)]" />
                  Cargo Details
                </CardTitle>
                <CardDescription>Enter cargo weight and dimensions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cargoWeight">Total Cargo Weight (kg)</Label>
                  <Input
                    id="cargoWeight"
                    type="number"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cargoLength">Length (m)</Label>
                    <Input
                      id="cargoLength"
                      type="number"
                      step="0.1"
                      value={cargoLength}
                      onChange={(e) => setCargoLength(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargoWidth">Width (m)</Label>
                    <Input
                      id="cargoWidth"
                      type="number"
                      step="0.1"
                      value={cargoWidth}
                      onChange={(e) => setCargoWidth(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cargoHeight">Height (m)</Label>
                    <Input
                      id="cargoHeight"
                      type="number"
                      step="0.1"
                      value={cargoHeight}
                      onChange={(e) => setCargoHeight(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cargo Volume</span>
                    <span className="font-medium">
                      {(parseFloat(cargoLength) * parseFloat(cargoWidth) * parseFloat(cargoHeight)).toFixed(2)} m³
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Load Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Load Distribution
                </CardTitle>
                <CardDescription>Configure loading positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Number of Loading Positions</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[loadPositions]}
                      onValueChange={(v) => setLoadPositions(v[0])}
                      min={1}
                      max={4}
                      step={1}
                      className="flex-1"
                    />
                    <Badge className="bg-[var(--ocean)]">{loadPositions}</Badge>
                  </div>
                </div>

                <Separator />

                {Array.from({ length: loadPositions }).map((_, index) => (
                  <div key={index} className="p-3 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Position {index + 1}</span>
                      <Badge variant="outline">{positionWeights[index]}% of cargo</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Offset from Front (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={positionOffsets[index]}
                          onChange={(e) => {
                            const newOffsets = [...positionOffsets];
                            newOffsets[index] = parseInt(e.target.value) || 0;
                            setPositionOffsets(newOffsets);
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Weight (%)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={positionWeights[index]}
                          onChange={(e) => {
                            const newWeights = [...positionWeights];
                            newWeights[index] = parseInt(e.target.value) || 0;
                            setPositionWeights(newWeights);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Position offset is measured from the front of the trailer (0% = front, 100% = rear).
                      Weight percentages should total 100%.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6 mt-6">
          {/* Truck Diagram */}
          <Card className="border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--ocean)]" />
                Vehicle Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Truck Diagram */}
              <div className="relative w-full h-48 bg-muted/30 rounded-lg overflow-hidden">
                {/* Ground line */}
                <div className="absolute bottom-10 left-0 right-0 h-0.5 bg-border" />

                {/* Truck body */}
                <div className="absolute bottom-12 left-5 right-5">
                  {/* Tractor */}
                  <div className="absolute left-0 w-[20%] h-16 bg-[var(--ocean)] rounded-t-lg rounded-b-sm">
                    <div className="absolute top-1 left-2 right-2 h-8 bg-[var(--ocean)]/80 rounded-t-sm" />
                    <div className="absolute top-2 left-3 right-3 h-6 bg-blue-300/30 rounded-t-sm" />
                  </div>

                  {/* Trailer */}
                  <div className="absolute left-[22%] right-0 h-14 bg-[var(--logistics)]/80 rounded-t-sm">
                    <div className="absolute inset-1 border border-dashed border-white/30 rounded-sm" />
                  </div>

                  {/* Axles and wheels */}
                  {result.axleLoads.map((load, index) => {
                    const truck = TRUCK_TYPES[truckType];
                    const position = (index / Math.max(truck.axles - 1, 1)) * 70 + 8;
                    const status = result.complianceStatus.axle[index].status;
                    const wheelColor = status === "safe" ? "#2E8B57" :
                                      status === "warning" ? "#F59E0B" : "#EF4444";

                    return (
                      <div key={index}>
                        {/* Axle line */}
                        <div
                          className="absolute bottom-0 w-0.5 h-6 bg-gray-600"
                          style={{ left: `${position}%` }}
                        />
                        {/* Wheels */}
                        <div
                          className="absolute -bottom-2 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                          style={{
                            left: `calc(${position}% - 12px)`,
                            backgroundColor: wheelColor + "20",
                            borderColor: wheelColor,
                          }}
                        >
                          <CircleDot className="h-3 w-3" style={{ color: wheelColor }} />
                        </div>
                        {/* Load indicator */}
                        <div
                          className="absolute -top-8 text-xs font-bold px-1.5 py-0.5 rounded"
                          style={{
                            left: `calc(${position}% - 20px)`,
                            backgroundColor: wheelColor + "20",
                            color: wheelColor,
                          }}
                        >
                          {(load / 1000).toFixed(1)}t
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Weight labels */}
                <div className="absolute top-4 right-4 text-right">
                  <p className="text-sm text-muted-foreground">Gross Vehicle Weight</p>
                  <p className={`text-xl font-bold ${
                    result.complianceStatus.gvw.status === "safe" ? "text-[var(--logistics)]" :
                    result.complianceStatus.gvw.status === "warning" ? "text-amber-500" : "text-red-500"
                  }`}>
                    {result.grossVehicleWeight.toLocaleString()} kg
                  </p>
                </div>

                {/* Status indicator */}
                <div className="absolute top-4 left-4">
                  <Badge className={
                    result.complianceStatus.gvw.status === "safe" ? "bg-[var(--logistics)]" :
                    result.complianceStatus.gvw.status === "warning" ? "bg-amber-500" : "bg-red-500"
                  }>
                    {result.complianceStatus.gvw.status === "safe" ? "Compliant" :
                     result.complianceStatus.gvw.status === "warning" ? "Near Limit" : "Overloaded"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {result.warnings.map((warning, index) => (
                    <div key={index} className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <span className="text-sm">{warning}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Info className="h-5 w-5 shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Axle Load Results */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[var(--ocean)]" />
                  Per-Axle Load Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.axleLoads.map((load, index) => {
                    const status = result.complianceStatus.axle[index].status;
                    const limit = result.complianceStatus.axle[index].limit;
                    const utilization = result.utilizationPercentage[index];

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${
                          status === "safe" ? "border-[var(--logistics)]/30 bg-[var(--logistics)]/5" :
                          status === "warning" ? "border-amber-500/30 bg-amber-500/5" :
                          "border-red-500/30 bg-red-500/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Axle {index + 1}</span>
                          <div className="flex items-center gap-2">
                            {status === "safe" && <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />}
                            {status === "warning" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                            {status === "overload" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            <Badge className={
                              status === "safe" ? "bg-[var(--logistics)]" :
                              status === "warning" ? "bg-amber-500" : "bg-red-500"
                            }>
                              {utilization}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Load: <strong>{load.toLocaleString()} kg</strong></span>
                          <span className="text-muted-foreground">Limit: {limit.toLocaleString()} kg</span>
                        </div>
                        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(utilization, 100)}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`h-full rounded-full ${
                              status === "safe" ? "bg-[var(--logistics)]" :
                              status === "warning" ? "bg-amber-500" : "bg-red-500"
                            }`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                  Compliance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  result.complianceStatus.gvw.status === "safe" ? "bg-[var(--logistics)]/10" :
                  result.complianceStatus.gvw.status === "warning" ? "bg-amber-500/10" :
                  "bg-red-500/10"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Gross Vehicle Weight</p>
                      <p className="text-2xl font-bold">{result.grossVehicleWeight.toLocaleString()} kg</p>
                    </div>
                    {result.complianceStatus.gvw.status === "safe" ? (
                      <CheckCircle2 className="h-8 w-8 text-[var(--logistics)]" />
                    ) : result.complianceStatus.gvw.status === "warning" ? (
                      <AlertCircle className="h-8 w-8 text-amber-500" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Legal Limit: {LEGAL_LIMITS[region].maxGVW.toLocaleString()} kg
                    </span>
                    <span className={`font-medium ${
                      result.complianceStatus.gvw.status === "safe" ? "text-[var(--logistics)]" :
                      result.complianceStatus.gvw.status === "warning" ? "text-amber-500" : "text-red-500"
                    }`}>
                      {Math.round((result.grossVehicleWeight / LEGAL_LIMITS[region].maxGVW) * 100)}% utilized
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Tare Weight</p>
                    <p className="text-lg font-bold text-[var(--ocean)]">
                      {parseFloat(tareWeight).toLocaleString()} kg
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Cargo Weight</p>
                    <p className="text-lg font-bold text-[var(--logistics)]">
                      {parseFloat(cargoWeight).toLocaleString()} kg
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Axle Load</span>
                    <span className="font-medium">
                      {Math.round(result.axleLoads.reduce((a, b) => a + b, 0) / result.axleLoads.length).toLocaleString()} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lightest Axle</span>
                    <span className="font-medium text-[var(--logistics)]">
                      {Math.min(...result.axleLoads).toLocaleString()} kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">Heaviest Axle</span>
                    <span className="font-medium text-amber-600">
                      {Math.max(...result.axleLoads).toLocaleString()} kg
                    </span>
                  </div>
                </div>

                {result.bridgeFormulaResults && (
                  <>
                    <Separator />
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                        Bridge Formula Compliance (US)
                      </p>
                      {result.bridgeFormulaResults.map((bf, index) => (
                        <div key={index} className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Axle {index + 1}</span>
                          <span className={bf.compliant ? "text-[var(--logistics)]" : "text-red-500"}>
                            {bf.compliant ? "Compliant" : "Non-Compliant"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Visualizations Tab */}
        <TabsContent value="visualizations" className="space-y-6 mt-6">
          {/* Axle Load Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Axle Load Distribution
              </CardTitle>
              <CardDescription>Visual representation of load per axle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={axleChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `${v / 1000}t`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value.toLocaleString()} kg`,
                        name === "load" ? "Current Load" : "Legal Limit"
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="load" name="Current Load" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="limit" name="Legal Limit" fill="#94a3b8" opacity={0.3} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weight Distribution */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[var(--ocean)]" />
                  Weight Composition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={weightDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {weightDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} kg`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                  Utilization Meter
                </CardTitle>
                <CardDescription>Axle and GVW utilization percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* GVW Gauge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">GVW Utilization</span>
                      <span className="font-bold">
                        {Math.round((result.grossVehicleWeight / LEGAL_LIMITS[region].maxGVW) * 100)}%
                      </span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((result.grossVehicleWeight / LEGAL_LIMITS[region].maxGVW) * 100, 100)}%`
                        }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          result.grossVehicleWeight > LEGAL_LIMITS[region].maxGVW ? "bg-red-500" :
                          result.grossVehicleWeight > LEGAL_LIMITS[region].maxGVW * 0.9 ? "bg-amber-500" :
                          "bg-[var(--logistics)]"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Axle Utilization Bars */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Axle Utilization</p>
                    {result.utilizationPercentage.map((util, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Axle {index + 1}</span>
                          <span className={`text-sm font-medium ${
                            util > 100 ? "text-red-500" : util > 90 ? "text-amber-500" : "text-[var(--logistics)]"
                          }`}>
                            {util}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(util, 100)}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`h-full rounded-full ${
                              util > 100 ? "bg-red-500" : util > 90 ? "bg-amber-500" : "bg-[var(--logistics)]"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Load Transfer Diagram */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-[var(--ocean)]" />
                Load Transfer Analysis
              </CardTitle>
              <CardDescription>How weight distributes across axles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={axleChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `${v / 1000}t`} />
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} kg`} />
                    <Area
                      type="monotone"
                      dataKey="load"
                      stroke="#0F4C81"
                      fill="#0F4C81"
                      fillOpacity={0.3}
                    />
                    <ReferenceLine
                      y={LEGAL_LIMITS[region].singleAxle}
                      stroke="#EF4444"
                      strokeDasharray="5 5"
                      label={{ value: "Limit", fill: "#EF4444", fontSize: 12 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6 mt-6">
          {/* Legal Limits by Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Legal Weight Limits by Region
              </CardTitle>
              <CardDescription>Maximum allowable weights for compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Region</th>
                      <th className="text-right py-3 px-4">Single Axle</th>
                      <th className="text-right py-3 px-4">Tandem Axle</th>
                      <th className="text-right py-3 px-4">Tridem Axle</th>
                      <th className="text-right py-3 px-4">Max GVW</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(LEGAL_LIMITS).map(([key, config]) => (
                      <tr
                        key={key}
                        className={`border-b ${key === region ? "bg-[var(--ocean)]/10" : ""}`}
                      >
                        <td className="py-3 px-4 font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {config.name}
                          {key === region && (
                            <Badge className="bg-[var(--ocean)] ml-2">Selected</Badge>
                          )}
                        </td>
                        <td className="text-right py-3 px-4">{config.singleAxle.toLocaleString()} kg</td>
                        <td className="text-right py-3 px-4">{config.tandemAxle.toLocaleString()} kg</td>
                        <td className="text-right py-3 px-4">{config.tridemAxle.toLocaleString()} kg</td>
                        <td className="text-right py-3 px-4 font-bold">{config.maxGVW.toLocaleString()} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Bridge Formula Explanation */}
          {region === "US" && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Info className="h-5 w-5" />
                  US Federal Bridge Formula
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    The Federal Bridge Formula determines the maximum allowable weight for a group of
                    consecutive axles based on axle spacing. This protects bridges from excessive stress.
                  </p>
                  <div className="p-4 bg-muted/50 rounded-lg font-mono text-center">
                    <p className="text-lg">W = 500 × ((L×N)/(N-1) + 12N + 36)</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">W</p>
                      <p className="text-muted-foreground">Maximum weight in pounds</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">L</p>
                      <p className="text-muted-foreground">Distance between extreme axles (feet)</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="font-medium">N</p>
                      <p className="text-muted-foreground">Number of axles in group</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    The formula ensures that weight is distributed over enough length to protect
                    bridge structures. Longer axle spacing allows for higher weight limits.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Common Configurations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--ocean)]" />
                Common Truck Configurations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(TRUCK_TYPES).map(([key, config]) => (
                  <div
                    key={key}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      key === truckType ? "border-[var(--ocean)] bg-[var(--ocean)]/5" : "hover:border-muted-foreground/50"
                    }`}
                    onClick={() => setTruckType(key as keyof typeof TRUCK_TYPES)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{config.icon}</span>
                      <span className="font-medium">{config.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{config.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>{config.axles} axles</span>
                      <span className="font-medium">Max {config.maxGVW / 1000}t</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[var(--ocean)]" />
                Load Distribution Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                    Do's
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Distribute load evenly across the trailer bed
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Position heavy items close to axles for stability
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Keep front axle at minimum 20% of GVW for steering
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Verify compliance before each trip
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Account for fuel weight changes during journey
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Don'ts
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                      Concentrate all weight in one area
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                      Exceed individual axle limits even if GVW is under
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                      Ignore uneven weight distribution
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                      Forget to account for tare weight changes
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-red-500 shrink-0" />
                      Assume all regions have the same limits
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCargoWeight("20000");
            setTareWeight(TRUCK_TYPES[truckType].defaultTareWeight.toString());
            setLoadPositions(1);
            setPositionOffsets([0]);
            setPositionWeights([100]);
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
