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
  Weight,
  Ruler,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Layers,
  Square,
  Shield,
  Gauge,
  AlertCircle,
  Box,
  CircleDot,
  Target,
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
  Legend,
  ComposedChart,
  Line,
  Area,
  ReferenceLine,
} from "recharts";

// Ground types with bearing capacity
const GROUND_TYPES = {
  SOFT_CLAY: {
    name: "Soft Clay/Silt",
    capacityPsi: 5,
    capacityKgCm2: 0.35,
    color: "#EF4444",
    risk: "high",
    description: "Very low bearing capacity, requires extensive preparation"
  },
  FIRM_CLAY: {
    name: "Firm Clay",
    capacityPsi: 15,
    capacityKgCm2: 1.05,
    color: "#F97316",
    risk: "medium",
    description: "Moderate capacity, may need ground improvement"
  },
  LOOSE_SAND: {
    name: "Loose Sand",
    capacityPsi: 10,
    capacityKgCm2: 0.70,
    color: "#F59E0B",
    risk: "medium-high",
    description: "Can settle under load, requires compaction"
  },
  DENSE_SAND: {
    name: "Dense Sand/Gravel",
    capacityPsi: 30,
    capacityKgCm2: 2.11,
    color: "#22C55E",
    risk: "low",
    description: "Good bearing capacity for most loads"
  },
  COMPACTED_FILL: {
    name: "Compacted Fill",
    capacityPsi: 25,
    capacityKgCm2: 1.76,
    color: "#2E8B57",
    risk: "low-medium",
    description: "Engineered fill with controlled compaction"
  },
  CONCRETE: {
    name: "Concrete/Paved",
    capacityPsi: 50,
    capacityKgCm2: 3.52,
    color: "#0F4C81",
    risk: "very-low",
    description: "High capacity, ideal for heavy lift operations"
  },
  ROCK: {
    name: "Bedrock",
    capacityPsi: 100,
    capacityKgCm2: 7.03,
    color: "#6366F1",
    risk: "very-low",
    description: "Highest capacity, excellent for all operations"
  },
  CRUSHED_STONE: {
    name: "Crushed Stone Base",
    capacityPsi: 35,
    capacityKgCm2: 2.46,
    color: "#8B5CF6",
    risk: "low",
    description: "Good drainage and load distribution"
  },
};

// Outrigger pad types
const PAD_TYPES = {
  STEEL_PLATE: {
    name: "Steel Plate",
    thickness: "25mm",
    loadSpread: 1.0,
    description: "Standard steel spreader plate"
  },
  TIMBER: {
    name: "Timber Mat",
    thickness: "150mm",
    loadSpread: 1.5,
    description: "Wood cribbing for load distribution"
  },
  COMPOSITE: {
    name: "Composite Pad",
    thickness: "75mm",
    loadSpread: 1.8,
    description: "HDPE composite with high load spread"
  },
  STEEL_BOX: {
    name: "Steel Box Pad",
    thickness: "300mm",
    loadSpread: 2.0,
    description: "Steel box with timber fill"
  },
  ALUMINUM: {
    name: "Aluminum Spreader",
    thickness: "100mm",
    loadSpread: 1.6,
    description: "Lightweight with good distribution"
  },
};

// Support/outrigger configurations
const SUPPORT_CONFIGS = {
  CRANE_4POINT: {
    name: "Crane 4-Point Outrigger",
    points: 4,
    description: "Standard mobile crane configuration"
  },
  CRANE_6POINT: {
    name: "Crane 6-Point Outrigger",
    points: 6,
    description: "Heavy lift crane with additional supports"
  },
  SPMT: {
    name: "SPMT (Self-Propelled)",
    points: 16,
    description: "Self-propelled modular transporter"
  },
  JACKING_SYSTEM: {
    name: "Jacking System",
    points: 4,
    description: "Hydraulic jack system"
  },
  SKID_SHOES: {
    name: "Skid Shoes/Tracks",
    points: 2,
    description: "Continuous track loading"
  },
  CRANE_8POINT: {
    name: "Crane 8-Point Outrigger",
    points: 8,
    description: "Large crawler crane setup"
  },
};

interface GroundPressureResult {
  totalWeight: number; // kg
  weightPerPoint: number; // kg
  contactArea: number; // cm²
  effectiveArea: number; // cm² (after pad spread)
  groundPressurePsi: number;
  groundPressureKgCm2: number;
  safetyFactor: number;
  groundUtilization: number; // percentage
  riskLevel: "safe" | "caution" | "danger" | "critical";
  recommendedPadSize: number; // cm
  groundCapacity: {
    psi: number;
    kgCm2: number;
  };
  failureRisk: number; // percentage
}

export function GroundPressureCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input parameters
  const [cargoWeight, setCargoWeight] = useState<string>("150000"); // kg
  const [riggingWeight, setRiggingWeight] = useState<string>("5000"); // kg
  const [supportConfig, setSupportConfig] = useState<keyof typeof SUPPORT_CONFIGS>("CRANE_4POINT");
  const [groundType, setGroundType] = useState<keyof typeof GROUND_TYPES>("FIRM_CLAY");
  const [padType, setPadType] = useState<keyof typeof PAD_TYPES>("STEEL_PLATE");
  const [padWidth, setPadWidth] = useState<string>("100"); // cm
  const [padLength, setPadLength] = useState<string>("100"); // cm
  const [loadDistribution, setLoadDistribution] = useState<number>(80); // % on main supports
  const [safetyFactorTarget, setSafetyFactorTarget] = useState<number>(2.0);
  const [useUnevenLoad, setUseUnevenLoad] = useState(false);
  const [unevenFactor, setUnevenFactor] = useState<number>(1.3);

  // Calculate ground pressure
  const result = useMemo((): GroundPressureResult => {
    const cargo = parseFloat(cargoWeight) || 0;
    const rigging = parseFloat(riggingWeight) || 0;
    const totalWeight = cargo + rigging;

    const config = SUPPORT_CONFIGS[supportConfig];
    const ground = GROUND_TYPES[groundType];
    const pad = PAD_TYPES[padType];

    const width = parseFloat(padWidth) || 100;
    const length = parseFloat(padLength) || 100;

    // Contact area in cm²
    const contactArea = width * length;

    // Effective area considering pad load spread
    const spreadFactor = pad.loadSpread;
    const effectiveWidth = width + (spreadFactor * 10); // Add spread per side
    const effectiveLength = length + (spreadFactor * 10);
    const effectiveArea = effectiveWidth * effectiveLength;

    // Weight per support point
    const baseWeightPerPoint = (totalWeight * (loadDistribution / 100)) / config.points;

    // Apply uneven load factor if enabled
    const weightPerPoint = useUnevenLoad ? baseWeightPerPoint * unevenFactor : baseWeightPerPoint;

    // Ground pressure calculations
    // Pressure = Force / Area
    // In kg/cm²
    const groundPressureKgCm2 = weightPerPoint / effectiveArea;

    // Convert to PSI: 1 kg/cm² = 14.2233 psi
    const groundPressurePsi = groundPressureKgCm2 * 14.2233;

    // Safety factor = Ground capacity / Actual pressure
    const safetyFactor = ground.capacityKgCm2 / groundPressureKgCm2;

    // Ground utilization percentage
    const groundUtilization = (groundPressureKgCm2 / ground.capacityKgCm2) * 100;

    // Failure risk (inverse of safety factor as percentage)
    const failureRisk = Math.min(100, (1 / safetyFactor) * 100);

    // Risk level assessment
    let riskLevel: "safe" | "caution" | "danger" | "critical";
    if (safetyFactor >= 2.0) {
      riskLevel = "safe";
    } else if (safetyFactor >= 1.5) {
      riskLevel = "caution";
    } else if (safetyFactor >= 1.0) {
      riskLevel = "danger";
    } else {
      riskLevel = "critical";
    }

    // Calculate recommended pad size
    // Required area = Weight per point / (Ground capacity / Safety factor target)
    const requiredPressure = ground.capacityKgCm2 / safetyFactorTarget;
    const requiredArea = weightPerPoint / requiredPressure;
    const recommendedPadSize = Math.ceil(Math.sqrt(requiredArea));

    return {
      totalWeight,
      weightPerPoint,
      contactArea,
      effectiveArea,
      groundPressurePsi,
      groundPressureKgCm2,
      safetyFactor,
      groundUtilization,
      riskLevel,
      recommendedPadSize,
      groundCapacity: {
        psi: ground.capacityPsi,
        kgCm2: ground.capacityKgCm2,
      },
      failureRisk,
    };
  }, [
    cargoWeight,
    riggingWeight,
    supportConfig,
    groundType,
    padType,
    padWidth,
    padLength,
    loadDistribution,
    safetyFactorTarget,
    useUnevenLoad,
    unevenFactor,
  ]);

  // Ground comparison chart data
  const groundComparisonData = useMemo(() => {
    return Object.entries(GROUND_TYPES).map(([key, data]) => ({
      name: data.name.split("/")[0],
      capacity: data.capacityPsi,
      pressure: result.groundPressurePsi,
      color: data.color,
      isCurrent: key === groundType,
    }));
  }, [result.groundPressurePsi, groundType]);

  // Pressure distribution chart data
  const pressureDistributionData = useMemo(() => {
    const points = SUPPORT_CONFIGS[supportConfig].points;
    const baseWeight = result.weightPerPoint;
    const variation = useUnevenLoad ? 0.3 : 0.1;

    return Array.from({ length: Math.min(points, 8) }, (_, i) => {
      const variance = useUnevenLoad ? (i % 2 === 0 ? 1 + variation : 1 - variation * 0.5) : 1;
      return {
        point: `Point ${i + 1}`,
        pressure: (baseWeight * variance) / result.effectiveArea * 14.2233,
        load: baseWeight * variance,
      };
    });
  }, [supportConfig, result.weightPerPoint, result.effectiveArea, useUnevenLoad]);

  // Pad sizing recommendations
  const padRecommendations = useMemo(() => {
    const ground = GROUND_TYPES[groundType];
    const weightPerPoint = result.weightPerPoint;

    return Object.entries(PAD_TYPES).map(([key, pad]) => {
      const requiredPressure = ground.capacityKgCm2 / safetyFactorTarget;
      const baseArea = weightPerPoint / requiredPressure;
      const spreadWidth = pad.loadSpread * 10;
      const requiredBaseSize = Math.sqrt(baseArea) - spreadWidth;
      const recommendedSize = Math.max(50, Math.ceil(requiredBaseSize / 10) * 10);

      return {
        type: pad.name,
        recommendedSize,
        spreadFactor: pad.loadSpread,
        thickness: pad.thickness,
      };
    });
  }, [groundType, result.weightPerPoint, safetyFactorTarget]);

  const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6", "#6366F1"];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "safe":
        return "var(--logistics)";
      case "caution":
        return "#F59E0B";
      case "danger":
        return "#F97316";
      case "critical":
        return "var(--destructive)";
      default:
        return "var(--muted-foreground)";
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case "safe":
        return "default" as const;
      case "caution":
        return "secondary" as const;
      case "danger":
        return "outline" as const;
      case "critical":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="analysis">Pressure Analysis</TabsTrigger>
          <TabsTrigger value="pads">Pad Sizing</TabsTrigger>
          <TabsTrigger value="ground">Ground Types</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Weight className="h-5 w-5 text-[var(--ocean)]" />
                  Ground Pressure Calculator
                </CardTitle>
                <CardDescription>Calculate ground pressure for heavy lift operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {/* Weight Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cargoWeight">Cargo Weight (kg)</Label>
                      <Input
                        id="cargoWeight"
                        type="number"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="riggingWeight">Rigging Weight (kg)</Label>
                      <Input
                        id="riggingWeight"
                        type="number"
                        value={riggingWeight}
                        onChange={(e) => setRiggingWeight(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Total Weight Display */}
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Weight</span>
                    <span className="font-bold text-[var(--ocean)]">
                      {(result.totalWeight / 1000).toFixed(1)} tonnes
                    </span>
                  </div>

                  <Separator />

                  {/* Support Configuration */}
                  <div>
                    <Label>Support/Outrigger Configuration</Label>
                    <Select value={supportConfig} onValueChange={(v) => setSupportConfig(v as keyof typeof SUPPORT_CONFIGS)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(SUPPORT_CONFIGS).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name} ({data.points} points)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {SUPPORT_CONFIGS[supportConfig].description}
                    </p>
                  </div>

                  {/* Ground Type */}
                  <div>
                    <Label>Ground Type</Label>
                    <Select value={groundType} onValueChange={(v) => setGroundType(v as keyof typeof GROUND_TYPES)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(GROUND_TYPES).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: data.color }}
                              />
                              {data.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {GROUND_TYPES[groundType].description}
                    </p>
                  </div>

                  <Separator />

                  {/* Pad Dimensions */}
                  <div>
                    <Label>Outrigger Pad Type</Label>
                    <Select value={padType} onValueChange={(v) => setPadType(v as keyof typeof PAD_TYPES)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAD_TYPES).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name} ({data.thickness})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="padWidth">Pad Width (cm)</Label>
                      <Input
                        id="padWidth"
                        type="number"
                        value={padWidth}
                        onChange={(e) => setPadWidth(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="padLength">Pad Length (cm)</Label>
                      <Input
                        id="padLength"
                        type="number"
                        value={padLength}
                        onChange={(e) => setPadLength(e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Advanced Options */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Load Distribution on Supports</Label>
                        <span className="text-sm font-medium text-[var(--ocean)]">{loadDistribution}%</span>
                      </div>
                      <Slider
                        value={[loadDistribution]}
                        onValueChange={(v) => setLoadDistribution(v[0])}
                        min={50}
                        max={100}
                        step={5}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Percentage of total weight on primary supports
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <Label htmlFor="unevenLoad" className="cursor-pointer">Uneven Load Factor</Label>
                        <p className="text-xs text-muted-foreground">Account for asymmetric loading</p>
                      </div>
                      <Switch
                        id="unevenLoad"
                        checked={useUnevenLoad}
                        onCheckedChange={setUseUnevenLoad}
                      />
                    </div>

                    {useUnevenLoad && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Uneven Factor</Label>
                          <span className="text-sm font-medium text-[var(--ocean)]">{unevenFactor.toFixed(1)}x</span>
                        </div>
                        <Slider
                          value={[unevenFactor]}
                          onValueChange={(v) => setUnevenFactor(v[0])}
                          min={1.0}
                          max={2.0}
                          step={0.1}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="border-[var(--ocean)]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                  Ground Pressure Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pressure Display */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Ground Pressure</p>
                      <p className="text-2xl font-bold text-[var(--ocean)]">
                        {result.groundPressurePsi.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">PSI</p>
                    </div>
                    <div className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Ground Pressure</p>
                      <p className="text-2xl font-bold text-[var(--logistics)]">
                        {result.groundPressureKgCm2.toFixed(3)}
                      </p>
                      <p className="text-xs text-muted-foreground">kg/cm²</p>
                    </div>
                  </div>

                  {/* Safety Factor */}
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `${getRiskColor(result.riskLevel)}15` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5" style={{ color: getRiskColor(result.riskLevel) }} />
                        <div>
                          <p className="font-medium">Safety Factor</p>
                          <p className="text-sm text-muted-foreground">
                            Target: {safetyFactorTarget.toFixed(1)}x
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: getRiskColor(result.riskLevel) }}>
                          {result.safetyFactor.toFixed(2)}
                        </p>
                        <Badge variant={getRiskBadgeVariant(result.riskLevel)}>
                          {result.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Ground Utilization */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Ground Capacity Utilization</span>
                      <span className="font-bold text-[var(--ocean)]">
                        {result.groundUtilization.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, result.groundUtilization)}%`,
                          backgroundColor: getRiskColor(result.riskLevel),
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Square className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contact Area</p>
                          <p className="font-bold">{result.contactArea.toLocaleString()} cm²</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Effective Area</p>
                          <p className="font-bold">{result.effectiveArea.toLocaleString()} cm²</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CircleDot className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Load per Point</p>
                          <p className="font-bold">{(result.weightPerPoint / 1000).toFixed(2)} t</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Failure Risk</p>
                          <p className="font-bold" style={{ color: getRiskColor(result.riskLevel) }}>
                            {result.failureRisk.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  {result.safetyFactor < safetyFactorTarget && (
                    <div className="p-4 border border-[var(--ocean)]/30 bg-[var(--ocean)]/5 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-[var(--ocean)]">Recommendation</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Increase pad size to approximately <strong>{result.recommendedPadSize}×{result.recommendedPadSize} cm</strong> or
                            use additional ground preparation to achieve the target safety factor of {safetyFactorTarget}x.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ground Capacity Info */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Ground Bearing Capacity</p>
                    <p className="font-medium">
                      {GROUND_TYPES[groundType].name}: {result.groundCapacity.psi} psi ({result.groundCapacity.kgCm2} kg/cm²)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Target Safety Factor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Safety Factor Settings
              </CardTitle>
              <CardDescription>Adjust target safety factor based on operation requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Target Safety Factor</Label>
                  <Select
                    value={safetyFactorTarget.toString()}
                    onValueChange={(v) => setSafetyFactorTarget(parseFloat(v))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.5">1.5 - Minimum (Code compliance)</SelectItem>
                      <SelectItem value="2.0">2.0 - Standard (Recommended)</SelectItem>
                      <SelectItem value="2.5">2.5 - Conservative</SelectItem>
                      <SelectItem value="3.0">3.0 - High risk operations</SelectItem>
                      <SelectItem value="4.0">4.0 - Critical lifts</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Higher safety factors are recommended for critical lifts, uncertain ground conditions,
                    or operations near sensitive structures.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-medium mb-2">Safety Factor Guidelines</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>1.5x:</strong> Minimum per industry standards</li>
                    <li>• <strong>2.0x:</strong> Standard practice for general operations</li>
                    <li>• <strong>2.5x:</strong> Conservative for uncertain conditions</li>
                    <li>• <strong>3.0x:</strong> High risk or engineered foundations</li>
                    <li>• <strong>4.0x:</strong> Critical lifts with high consequences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Pressure Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Pressure Distribution by Support Point</CardTitle>
              <CardDescription>Ground pressure at each outrigger/support location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={pressureDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="point" />
                    <YAxis yAxisId="left" tickFormatter={(v) => `${v} psi`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${(v/1000).toFixed(0)}t`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "pressure" ? `${value.toFixed(2)} psi` : `${(value/1000).toFixed(2)} t`,
                        name === "pressure" ? "Pressure" : "Load"
                      ]}
                    />
                    <Legend />
                    <ReferenceLine
                      yAxisId="left"
                      y={result.groundCapacity.psi}
                      stroke="#EF4444"
                      strokeDasharray="5 5"
                      label={{ value: "Ground Limit", position: "right", fill: "#EF4444" }}
                    />
                    <Bar yAxisId="left" dataKey="pressure" fill="#0F4C81" name="pressure" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="load" stroke="#2E8B57" strokeWidth={2} name="load" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Ground Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Ground Type Comparison</CardTitle>
              <CardDescription>Compare calculated pressure against ground bearing capacities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={groundComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => `${v} psi`} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(1)} psi`,
                        name === "capacity" ? "Capacity" : "Your Pressure"
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="capacity" fill="#2E8B57" name="capacity" radius={[0, 4, 4, 0]} />
                    <ReferenceLine
                      x={result.groundPressurePsi}
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      label={{ value: "Your Pressure", position: "top", fill: "#EF4444" }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[var(--ocean)]" />
                Ground Failure Risk Assessment
              </CardTitle>
              <CardDescription>Analysis of potential ground failure scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg border border-[var(--logistics)]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    <p className="font-medium">Safe Zone</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Safety Factor ≥ 2.0
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Low risk of ground failure. Standard monitoring sufficient.
                  </p>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-yellow-500" />
                    <p className="font-medium">Caution Zone</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Safety Factor 1.5 - 2.0
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Increased monitoring required. Consider ground improvement.
                  </p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <p className="font-medium">Danger Zone</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Safety Factor &lt; 1.5
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Immediate action required. Redesign or ground reinforcement.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Current Assessment</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Safety Factor</p>
                    <p className="text-xl font-bold" style={{ color: getRiskColor(result.riskLevel) }}>
                      {result.safetyFactor.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className="text-xl font-bold" style={{ color: getRiskColor(result.riskLevel) }}>
                      {result.riskLevel.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Failure Risk</p>
                    <p className="text-xl font-bold" style={{ color: getRiskColor(result.riskLevel) }}>
                      {result.failureRisk.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ground Utilization</p>
                    <p className="text-xl font-bold" style={{ color: getRiskColor(result.riskLevel) }}>
                      {result.groundUtilization.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pads" className="space-y-6 mt-6">
          {/* Pad Sizing Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Square className="h-5 w-5 text-[var(--ocean)]" />
                Outrigger Pad Sizing Recommendations
              </CardTitle>
              <CardDescription>
                Recommended pad sizes for {GROUND_TYPES[groundType].name} with {safetyFactorTarget}x safety factor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Pad Type</th>
                      <th className="text-left py-3 px-4">Thickness</th>
                      <th className="text-left py-3 px-4">Load Spread Factor</th>
                      <th className="text-right py-3 px-4">Recommended Size</th>
                      <th className="text-right py-3 px-4">Area</th>
                    </tr>
                  </thead>
                  <tbody>
                    {padRecommendations.map((pad, idx) => (
                      <tr key={pad.type} className={`border-b ${idx === 0 ? "bg-[var(--ocean)]/5" : ""}`}>
                        <td className="py-3 px-4 font-medium">{pad.type}</td>
                        <td className="py-3 px-4">{pad.thickness}</td>
                        <td className="py-3 px-4">{pad.spreadFactor}x</td>
                        <td className="text-right py-3 px-4 font-bold text-[var(--ocean)]">
                          {pad.recommendedSize}×{pad.recommendedSize} cm
                        </td>
                        <td className="text-right py-3 px-4">
                          {(pad.recommendedSize * pad.recommendedSize / 10000).toFixed(2)} m²
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Current Configuration</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Pad Type</p>
                    <p className="font-medium">{PAD_TYPES[padType].name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Size</p>
                    <p className="font-medium">{padWidth}×{padLength} cm</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Recommended Size</p>
                    <p className="font-medium text-[var(--ocean)]">
                      {result.recommendedPadSize}×{result.recommendedPadSize} cm
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-medium" style={{ color: getRiskColor(result.riskLevel) }}>
                      {result.safetyFactor >= safetyFactorTarget ? "Adequate" : "Undersized"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pad Type Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Load Spread Comparison</CardTitle>
              <CardDescription>How different pad types distribute load into the ground</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.entries(PAD_TYPES).map(([key, data]) => ({
                      name: data.name,
                      spread: data.loadSpread,
                      pressure: result.groundPressurePsi / data.loadSpread,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tickFormatter={(v) => `${v}x`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v.toFixed(0)} psi`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "spread" ? `${value}x` : `${value.toFixed(1)} psi`,
                        name === "spread" ? "Spread Factor" : "Effective Pressure"
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="spread" fill="#0F4C81" name="spread" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#EF4444" strokeWidth={2} name="pressure" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
                <h4 className="font-medium text-[var(--ocean)] mb-2">Understanding Load Spread</h4>
                <p className="text-sm text-muted-foreground">
                  Load spread factor indicates how much the pad distributes the load horizontally into the ground.
                  A higher factor means the effective bearing area is larger, reducing ground pressure.
                  Composite pads and steel box pads typically offer the best load distribution.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ground" className="space-y-6 mt-6">
          {/* Ground Types Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Ground Bearing Capacity Reference</CardTitle>
              <CardDescription>Typical bearing capacities for different ground types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(GROUND_TYPES).map(([key, data]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      key === groundType
                        ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                        : "border-transparent bg-muted/50 hover:border-muted"
                    }`}
                    onClick={() => setGroundType(key as keyof typeof GROUND_TYPES)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <p className="font-medium text-sm">{data.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-bold" style={{ color: data.color }}>
                        {data.capacityPsi} psi
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {data.capacityKgCm2} kg/cm²
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: data.risk.includes("high") ? "#EF4444" : data.risk.includes("low") ? "#22C55E" : "#F59E0B",
                          color: data.risk.includes("high") ? "#EF4444" : data.risk.includes("low") ? "#22C55E" : "#F59E0B"
                        }}
                      >
                        {data.risk.replace("-", " ").toUpperCase()} RISK
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{data.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ground Preparation Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Ground Preparation Recommendations</CardTitle>
              <CardDescription>Best practices for different ground conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Weak Ground (SF &lt; 1.5)
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Use larger outrigger pads or crane mats</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Install temporary ground reinforcement (steel plates, timber mats)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Consider ground improvement: compaction, geotextiles, stone columns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Reduce crane configuration or use alternative lift method</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-yellow-500" />
                    Marginal Ground (SF 1.5-2.0)
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Increase pad size by 20-30%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Use composite or timber pads for better load spread</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Monitor ground settlement during operation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Have contingency plan for unexpected settlement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-6 mt-6">
          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Ground Pressure Best Practices</CardTitle>
              <CardDescription>Industry guidelines for heavy lift ground operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg border-[var(--logistics)]/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    <p className="font-medium">Do's</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Conduct ground survey before heavy lift operations</li>
                    <li>• Verify ground conditions match design assumptions</li>
                    <li>• Use appropriate pad type for ground conditions</li>
                    <li>• Monitor for settlement during operation</li>
                    <li>• Maintain minimum 1.5x safety factor (2.0x preferred)</li>
                    <li>• Document ground conditions with photos</li>
                    <li>• Consider seasonal variations (frost, rain)</li>
                    <li>• Use ground protection mats on sensitive surfaces</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg border-destructive/20">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <p className="font-medium">Don'ts</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Don't assume all paved areas have equal capacity</li>
                    <li>• Don't ignore signs of ground distress</li>
                    <li>• Don't exceed rated pad capacity</li>
                    <li>• Don't position outriggers over underground services</li>
                    <li>• Don't operate on frozen ground without assessment</li>
                    <li>• Don't neglect drainage considerations</li>
                    <li>• Don't forget to check for underground voids</li>
                    <li>• Don't proceed if unsure about ground conditions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ground Pressure Formula */}
          <Card>
            <CardHeader>
              <CardTitle>Understanding Ground Pressure</CardTitle>
              <CardDescription>Key concepts and formulas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Basic Formula</h4>
                <div className="bg-background p-4 rounded font-mono text-center text-lg">
                  Pressure = Force ÷ Area
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  <p><strong>Pressure</strong> is measured in psi (pounds per square inch) or kg/cm² (kilograms per square centimeter)</p>
                  <p className="mt-1"><strong>Force</strong> is the load applied through each outrigger or support point</p>
                  <p className="mt-1"><strong>Area</strong> is the effective contact area including load spread</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Safety Factor</h4>
                  <div className="bg-background p-4 rounded font-mono text-center">
                    SF = Ground Capacity ÷ Actual Pressure
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The safety factor must be ≥ 1.5 per industry standards.
                    A factor of 2.0 or higher is recommended for most operations.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Required Pad Area</h4>
                  <div className="bg-background p-4 rounded font-mono text-center">
                    Area = Load ÷ (Capacity ÷ SF)
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Calculate the minimum pad size needed to achieve your target
                    safety factor based on ground bearing capacity.
                  </p>
                </div>
              </div>

              <div className="p-4 border border-[var(--ocean)]/30 bg-[var(--ocean)]/5 rounded-lg">
                <h4 className="font-medium text-[var(--ocean)] mb-2">Conversion Factors</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Pressure</p>
                    <p className="text-muted-foreground">1 kg/cm² = 14.2233 psi</p>
                    <p className="text-muted-foreground">1 psi = 0.0703 kg/cm²</p>
                  </div>
                  <div>
                    <p className="font-medium">Area</p>
                    <p className="text-muted-foreground">1 m² = 10,000 cm²</p>
                    <p className="text-muted-foreground">1 ft² = 929 cm²</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Failure Modes */}
          <Card>
            <CardHeader>
              <CardTitle>Ground Failure Modes</CardTitle>
              <CardDescription>Understanding how ground can fail under excessive pressure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">General Shear Failure</h4>
                  <p className="text-sm text-muted-foreground">
                    Sudden catastrophic failure where ground bulges and heaves around the loaded area.
                    Most common in dense/stiff soils under high loads.
                  </p>
                  <div className="mt-3 p-2 bg-destructive/10 rounded text-xs text-destructive">
                    High Risk - No Warning
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Local Shear Failure</h4>
                  <p className="text-sm text-muted-foreground">
                    Progressive failure with significant settlement and surface bulging.
                    Occurs in loose/soft soils under moderate loads.
                  </p>
                  <div className="mt-3 p-2 bg-yellow-500/10 rounded text-xs text-yellow-600">
                    Medium Risk - Some Warning
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Punching Shear Failure</h4>
                  <p className="text-sm text-muted-foreground">
                    Vertical penetration with little surface heave. Common in very soft soils
                    or loose sands. Can be sudden with little warning.
                  </p>
                  <div className="mt-3 p-2 bg-orange-500/10 rounded text-xs text-orange-600">
                    Variable Risk - Monitor Settlement
                  </div>
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
            setCargoWeight("150000");
            setRiggingWeight("5000");
            setSupportConfig("CRANE_4POINT");
            setGroundType("FIRM_CLAY");
            setPadType("STEEL_PLATE");
            setPadWidth("100");
            setPadLength("100");
            setLoadDistribution(80);
            setSafetyFactorTarget(2.0);
            setUseUnevenLoad(false);
            setUnevenFactor(1.3);
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="gradient-ocean">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
