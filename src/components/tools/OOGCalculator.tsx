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
  Container,
  Box,
  Weight,
  Ruler,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Package,
  Ship,
  ArrowRight,
  Layers,
  Move,
  DollarSign,
  AlertCircle,
  FileText,
  Shield,
  Eye,
  RotateCcw,
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
} from "recharts";

// Container specifications with OOG limits
const OOG_CONTAINERS = {
  "20GP": {
    name: "20' General Purpose",
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.393,
    externalLength: 6.058,
    externalWidth: 2.438,
    externalHeight: 2.591,
    capacity: 33.2,
    maxPayload: 21700,
    tareWeight: 2300,
    doorWidth: 2.343,
    doorHeight: 2.280,
    maxOverhangWidth: 0.3, // per side in meters
    maxOverhangHeight: 0.3,
    maxOverhangLength: 0.6,
    supportsOOG: false,
  },
  "40GP": {
    name: "40' General Purpose",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.393,
    externalLength: 12.192,
    externalWidth: 2.438,
    externalHeight: 2.591,
    capacity: 67.7,
    maxPayload: 25800,
    tareWeight: 3750,
    doorWidth: 2.343,
    doorHeight: 2.280,
    maxOverhangWidth: 0.3,
    maxOverhangHeight: 0.3,
    maxOverhangLength: 0.6,
    supportsOOG: false,
  },
  "40HC": {
    name: "40' High Cube",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.698,
    externalLength: 12.192,
    externalWidth: 2.438,
    externalHeight: 2.896,
    capacity: 76.3,
    maxPayload: 26330,
    tareWeight: 3950,
    doorWidth: 2.343,
    doorHeight: 2.585,
    maxOverhangWidth: 0.3,
    maxOverhangHeight: 0.3,
    maxOverhangLength: 0.6,
    supportsOOG: false,
  },
  "20OT": {
    name: "20' Open Top",
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.346,
    externalLength: 6.058,
    externalWidth: 2.438,
    externalHeight: 2.591,
    capacity: 32.7,
    maxPayload: 21740,
    tareWeight: 2360,
    doorWidth: 2.340,
    doorHeight: 2.330,
    maxOverhangWidth: 0.5,
    maxOverhangHeight: 1.5, // Unlimited above with tarp
    maxOverhangLength: 0.6,
    supportsOOG: true,
  },
  "40OT": {
    name: "40' Open Top",
    internalLength: 12.032,
    internalWidth: 2.340,
    internalHeight: 2.350,
    externalLength: 12.192,
    externalWidth: 2.438,
    externalHeight: 2.591,
    capacity: 66.2,
    maxPayload: 26140,
    tareWeight: 3860,
    doorWidth: 2.330,
    doorHeight: 2.340,
    maxOverhangWidth: 0.5,
    maxOverhangHeight: 1.5,
    maxOverhangLength: 0.6,
    supportsOOG: true,
  },
  "20FR": {
    name: "20' Flat Rack",
    internalLength: 5.634,
    internalWidth: 2.210,
    internalHeight: 2.127,
    externalLength: 6.058,
    externalWidth: 2.438,
    externalHeight: 2.591,
    capacity: 26.5,
    maxPayload: 22110,
    tareWeight: 2690,
    doorWidth: 0,
    doorHeight: 0,
    maxOverhangWidth: 0.76, // Can overhang beyond platform
    maxOverhangHeight: 3.0, // Unlimited above
    maxOverhangLength: 1.5,
    supportsOOG: true,
  },
  "40FR": {
    name: "40' Flat Rack",
    internalLength: 11.752,
    internalWidth: 2.124,
    internalHeight: 1.965,
    externalLength: 12.192,
    externalWidth: 2.438,
    externalHeight: 2.438,
    capacity: 49.0,
    maxPayload: 39400,
    tareWeight: 5500,
    doorWidth: 0,
    doorHeight: 0,
    maxOverhangWidth: 0.76,
    maxOverhangHeight: 3.0,
    maxOverhangLength: 2.0,
    supportsOOG: true,
  },
  "20PL": {
    name: "20' Platform",
    internalLength: 5.946,
    internalWidth: 2.134,
    internalHeight: 0,
    externalLength: 6.058,
    externalWidth: 2.438,
    externalHeight: 0.381,
    capacity: 0,
    maxPayload: 27400,
    tareWeight: 2600,
    doorWidth: 0,
    doorHeight: 0,
    maxOverhangWidth: 1.0,
    maxOverhangHeight: 4.0,
    maxOverhangLength: 2.0,
    supportsOOG: true,
  },
  "40PL": {
    name: "40' Platform",
    internalLength: 12.080,
    internalWidth: 2.104,
    internalHeight: 0,
    externalLength: 12.192,
    externalWidth: 2.438,
    externalHeight: 0.635,
    capacity: 0,
    maxPayload: 40000,
    tareWeight: 5400,
    doorWidth: 0,
    doorHeight: 0,
    maxOverhangWidth: 1.0,
    maxOverhangHeight: 4.0,
    maxOverhangLength: 3.0,
    supportsOOG: true,
  },
};

// OOG Surcharge rates by carrier (per CBM or per TEU)
const CARRIER_SURCHARGES = [
  { carrier: "Maersk", baseRate: 150, widthSurcharge: 200, heightSurcharge: 180, lengthSurcharge: 160, currency: "USD", unit: "per CBM" },
  { carrier: "MSC", baseRate: 130, widthSurcharge: 180, heightSurcharge: 160, lengthSurcharge: 140, currency: "USD", unit: "per CBM" },
  { carrier: "CMA CGM", baseRate: 145, widthSurcharge: 190, heightSurcharge: 170, lengthSurcharge: 150, currency: "USD", unit: "per CBM" },
  { carrier: "COSCO", baseRate: 140, widthSurcharge: 185, heightSurcharge: 165, lengthSurcharge: 145, currency: "USD", unit: "per CBM" },
  { carrier: "Hapag-Lloyd", baseRate: 160, widthSurcharge: 210, heightSurcharge: 190, lengthSurcharge: 170, currency: "USD", unit: "per CBM" },
  { carrier: "ONE", baseRate: 155, widthSurcharge: 205, heightSurcharge: 185, lengthSurcharge: 165, currency: "USD", unit: "per CBM" },
  { carrier: "Evergreen", baseRate: 135, widthSurcharge: 175, heightSurcharge: 155, lengthSurcharge: 135, currency: "USD", unit: "per CBM" },
  { carrier: "Yang Ming", baseRate: 125, widthSurcharge: 170, heightSurcharge: 150, lengthSurcharge: 130, currency: "USD", unit: "per CBM" },
];

// Lashing equipment requirements
const LASHING_EQUIPMENT = [
  { type: "Wire Rope Lashing", minOverhang: 0.3, maxOverhang: 1.0, strength: "5000 kg", costPerUnit: 25 },
  { type: "Chain Lashing", minOverhang: 0.5, maxOverhang: 1.5, strength: "10000 kg", costPerUnit: 45 },
  { type: "Webbing Straps", minOverhang: 0.2, maxOverhang: 0.8, strength: "2500 kg", costPerUnit: 15 },
  { type: "Twist Locks", minOverhang: 0, maxOverhang: 0.3, strength: "Container rated", costPerUnit: 10 },
  { type: "Turnbuckles", minOverhang: 0.3, maxOverhang: 2.0, strength: "Variable", costPerUnit: 35 },
  { type: "Dunnage Wood", minOverhang: 0, maxOverhang: 3.0, strength: "Support only", costPerUnit: 5 },
];

interface OOGDimensions {
  leftWidth: number;
  rightWidth: number;
  topHeight: number;
  frontLength: number;
  backLength: number;
}

interface CalculationResult {
  totalWidth: number;
  totalHeight: number;
  totalLength: number;
  widthOverhang: number;
  heightOverhang: number;
  lengthOverhang: number;
  slotsRequired: number;
  slotUtilization: number;
  isOOG: boolean;
  severity: "none" | "minor" | "moderate" | "major" | "critical";
  surcharges: Array<{
    carrier: string;
    baseCost: number;
    oogSurcharge: number;
    totalCost: number;
  }>;
  lashingRequired: boolean;
  lashingEquipment: Array<{
    type: string;
    quantity: number;
    costPerUnit: number;
    totalCost: number;
  }>;
  vesselCompatible: boolean;
  recommendations: string[];
  warnings: string[];
}

export function OOGCalculator() {
  const [activeTab, setActiveTab] = useState("input");
  const [containerType, setContainerType] = useState<keyof typeof OOG_CONTAINERS>("20FR");
  const [dimensionUnit, setDimensionUnit] = useState<"m" | "cm" | "ft" | "in">("m");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb" | "t">("kg");

  // Cargo dimensions
  const [cargoLength, setCargoLength] = useState(5.5);
  const [cargoWidth, setCargoWidth] = useState(2.8);
  const [cargoHeight, setCargoHeight] = useState(3.0);
  const [cargoWeight, setCargoWeight] = useState(15000);

  // Overhang settings
  const [overhang, setOverhang] = useState<OOGDimensions>({
    leftWidth: 0.3,
    rightWidth: 0.25,
    topHeight: 0.5,
    frontLength: 0.2,
    backLength: 0.1,
  });

  // Position settings
  const [deckPosition, setDeckPosition] = useState<"on-deck" | "below-deck">("on-deck");
  const [includeLashing, setIncludeLashing] = useState(true);
  const [selectedCarrier, setSelectedCarrier] = useState("Maersk");

  const container = OOG_CONTAINERS[containerType];

  // Calculate results
  const result = useMemo((): CalculationResult => {
    // Convert to meters if needed
    const convertToM = (value: number): number => {
      switch (dimensionUnit) {
        case "cm": return value / 100;
        case "ft": return value * 0.3048;
        case "in": return value * 0.0254;
        default: return value;
      }
    };

    const convertToKg = (value: number): number => {
      switch (weightUnit) {
        case "lb": return value * 0.453592;
        case "t": return value * 1000;
        default: return value;
      }
    };

    const cargoL = convertToM(cargoLength);
    const cargoW = convertToM(cargoWidth);
    const cargoH = convertToM(cargoHeight);
    const weight = convertToKg(cargoWeight);

    // Calculate total dimensions including overhang
    const totalWidth = cargoW;
    const totalHeight = cargoH;
    const totalLength = cargoL;

    // Calculate overhang beyond container
    const widthOverhang = Math.max(0, totalWidth - container.externalWidth);
    const heightOverhang = Math.max(0, totalHeight - container.externalHeight);
    const lengthOverhang = Math.max(0, totalLength - container.externalLength);

    // Check if OOG
    const isOOG = widthOverhang > 0 || heightOverhang > 0 || lengthOverhang > 0;

    // Calculate slots required
    const slotsRequired = widthOverhang > 0.3 ? 2 : 1;

    // Determine severity
    let severity: CalculationResult["severity"] = "none";
    if (isOOG) {
      const maxOverhang = Math.max(widthOverhang, heightOverhang, lengthOverhang);
      if (maxOverhang > 2.0) severity = "critical";
      else if (maxOverhang > 1.5) severity = "major";
      else if (maxOverhang > 1.0) severity = "moderate";
      else severity = "minor";
    }

    // Calculate surcharges
    const surcharges = CARRIER_SURCHARGES.map((carrier) => {
      let baseCost = carrier.baseRate * (totalLength * totalWidth * totalHeight);
      let oogSurcharge = 0;

      if (widthOverhang > 0) {
        oogSurcharge += carrier.widthSurcharge * (widthOverhang * totalLength * totalHeight);
      }
      if (heightOverhang > 0) {
        oogSurcharge += carrier.heightSurcharge * (heightOverhang * totalLength * totalWidth);
      }
      if (lengthOverhang > 0) {
        oogSurcharge += carrier.lengthSurcharge * (lengthOverhang * totalWidth * totalHeight);
      }

      return {
        carrier: carrier.carrier,
        baseCost: Math.round(baseCost),
        oogSurcharge: Math.round(oogSurcharge),
        totalCost: Math.round(baseCost + oogSurcharge),
      };
    });

    // Determine lashing requirements
    const lashingRequired = isOOG || weight > container.maxPayload * 0.8;
    const lashingEquipment: CalculationResult["lashingEquipment"] = [];

    if (lashingRequired && includeLashing) {
      // Add wire rope lashing for all OOG
      if (severity !== "none") {
        lashingEquipment.push({
          type: "Wire Rope Lashing",
          quantity: 4,
          costPerUnit: 25,
          totalCost: 100,
        });
      }

      // Add chain lashing for moderate+ severity
      if (severity === "moderate" || severity === "major" || severity === "critical") {
        lashingEquipment.push({
          type: "Chain Lashing",
          quantity: 4,
          costPerUnit: 45,
          totalCost: 180,
        });
      }

      // Add turnbuckles for major+
      if (severity === "major" || severity === "critical") {
        lashingEquipment.push({
          type: "Turnbuckles",
          quantity: 4,
          costPerUnit: 35,
          totalCost: 140,
        });
      }

      // Always add dunnage
      lashingEquipment.push({
        type: "Dunnage Wood",
        quantity: 8,
        costPerUnit: 5,
        totalCost: 40,
      });
    }

    // Check vessel compatibility
    const vesselCompatible = deckPosition === "on-deck" || (heightOverhang < 0.5 && widthOverhang < 0.3);

    // Generate recommendations
    const recommendations: string[] = [];
    const warnings: string[] = [];

    if (!isOOG) {
      recommendations.push("Cargo fits within standard container dimensions - no OOG charges apply.");
    } else {
      if (severity === "minor") {
        recommendations.push("Minor overhang - standard OOG surcharges apply.");
      } else if (severity === "moderate") {
        recommendations.push("Moderate overhang - may require special stowage arrangements.");
      } else if (severity === "major") {
        recommendations.push("Major overhang - consider using flat rack or platform container.");
      } else {
        recommendations.push("Critical overhang - project cargo handling may be required.");
      }

      if (widthOverhang > 0.5) {
        recommendations.push(`Width overhang of ${widthOverhang.toFixed(2)}m requires adjacent slot booking.`);
      }

      if (deckPosition === "below-deck" && heightOverhang > 0) {
        warnings.push("Height overhang cannot be stowed below deck - must be on-deck cargo.");
      }
    }

    if (weight > container.maxPayload) {
      warnings.push(`Cargo weight (${(weight / 1000).toFixed(1)}t) exceeds container payload (${(container.maxPayload / 1000).toFixed(1)}t).`);
    }

    if (widthOverhang > container.maxOverhangWidth) {
      warnings.push(`Width overhang exceeds maximum allowed for ${container.name}.`);
    }

    if (heightOverhang > container.maxOverhangHeight) {
      warnings.push(`Height overhang exceeds recommended limit for ${container.name}.`);
    }

    if (!vesselCompatible) {
      warnings.push("Current configuration not compatible with below-deck stowage.");
    }

    return {
      totalWidth,
      totalHeight,
      totalLength,
      widthOverhang,
      heightOverhang,
      lengthOverhang,
      slotsRequired,
      slotUtilization: (1 / slotsRequired) * 100,
      isOOG,
      severity,
      surcharges,
      lashingRequired,
      lashingEquipment,
      vesselCompatible,
      recommendations,
      warnings,
    };
  }, [containerType, dimensionUnit, weightUnit, cargoLength, cargoWidth, cargoHeight, cargoWeight, deckPosition, includeLashing, container]);

  // Get severity color
  const getSeverityColor = (severity: CalculationResult["severity"]) => {
    switch (severity) {
      case "critical": return "text-red-500";
      case "major": return "text-orange-500";
      case "moderate": return "text-yellow-500";
      case "minor": return "text-blue-500";
      default: return "text-[var(--logistics)]";
    }
  };

  const getSeverityBadge = (severity: CalculationResult["severity"]) => {
    switch (severity) {
      case "critical": return "bg-red-500 text-white";
      case "major": return "bg-orange-500 text-white";
      case "moderate": return "bg-yellow-500 text-black";
      case "minor": return "bg-blue-500 text-white";
      default: return "bg-[var(--logistics)] text-white";
    }
  };

  // Chart data
  const overhangData = [
    { name: "Width", overhang: result.widthOverhang, limit: container.maxOverhangWidth, fill: result.widthOverhang > container.maxOverhangWidth ? "#EF4444" : "#0F4C81" },
    { name: "Height", overhang: result.heightOverhang, limit: container.maxOverhangHeight, fill: result.heightOverhang > container.maxOverhangHeight ? "#EF4444" : "#2E8B57" },
    { name: "Length", overhang: result.lengthOverhang, limit: container.maxOverhangLength, fill: result.lengthOverhang > container.maxOverhangLength ? "#EF4444" : "#0F4C81" },
  ];

  const costComparisonData = result.surcharges.slice(0, 6).map(s => ({
    name: s.carrier,
    base: s.baseCost,
    oog: s.oogSurcharge,
    total: s.totalCost,
  }));

  const totalLashingCost = result.lashingEquipment.reduce((sum, e) => sum + e.totalCost, 0);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="input">Cargo Input</TabsTrigger>
          <TabsTrigger value="results">Calculations</TabsTrigger>
          <TabsTrigger value="visualization">3D View</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Input Tab */}
        <TabsContent value="input" className="space-y-6 mt-6">
          {/* Container Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5 text-[var(--ocean)]" />
                Container Type
              </CardTitle>
              <CardDescription>Select the appropriate container type for your cargo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(OOG_CONTAINERS).map(([key, c]) => (
                  <div
                    key={key}
                    onClick={() => setContainerType(key as keyof typeof OOG_CONTAINERS)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      containerType === key
                        ? "border-[var(--ocean)] bg-[var(--ocean)]/10"
                        : "border-border hover:border-[var(--ocean)]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm">{key}</p>
                      {c.supportsOOG && (
                        <Badge variant="outline" className="text-xs bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/30">
                          OOG
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{c.name.split(" ")[1]}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs">Ext: {c.externalLength.toFixed(1)}×{c.externalWidth.toFixed(1)}×{c.externalHeight.toFixed(1)}m</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unit Selection */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Dimension Unit</Label>
                  <Select value={dimensionUnit} onValueChange={(v) => setDimensionUnit(v as typeof dimensionUnit)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">Meters (m)</SelectItem>
                      <SelectItem value="cm">Centimeters (cm)</SelectItem>
                      <SelectItem value="ft">Feet (ft)</SelectItem>
                      <SelectItem value="in">Inches (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Weight Unit</Label>
                  <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as typeof weightUnit)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                      <SelectItem value="t">Metric Tons (t)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-[var(--ocean)]" />
                Cargo Dimensions
              </CardTitle>
              <CardDescription>Enter the total dimensions of your cargo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Length ({dimensionUnit})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cargoLength}
                    onChange={(e) => setCargoLength(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Width ({dimensionUnit})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cargoWidth}
                    onChange={(e) => setCargoWidth(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Height ({dimensionUnit})</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={cargoHeight}
                    onChange={(e) => setCargoHeight(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Weight ({weightUnit})</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler className="h-4 w-4 text-[var(--ocean)]" />
                  <span className="font-medium">Container vs Cargo Comparison</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Container External</p>
                    <p className="font-medium">{container.externalLength.toFixed(2)} × {container.externalWidth.toFixed(2)} × {container.externalHeight.toFixed(2)} m</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cargo Size</p>
                    <p className={`font-medium ${result.isOOG ? "text-orange-500" : "text-[var(--logistics)]"}`}>
                      {result.totalLength.toFixed(2)} × {result.totalWidth.toFixed(2)} × {result.totalHeight.toFixed(2)} m
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Payload</p>
                    <p className="font-medium">{(container.maxPayload / 1000).toFixed(1)} t</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Position Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-[var(--ocean)]" />
                Loading Position
              </CardTitle>
              <CardDescription>Specify where the container will be stowed on the vessel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setDeckPosition("on-deck")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    deckPosition === "on-deck"
                      ? "border-[var(--ocean)] bg-[var(--ocean)]/10"
                      : "border-border hover:border-[var(--ocean)]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="h-6 w-6 text-[var(--ocean)]" />
                    <div>
                      <p className="font-medium">On Deck</p>
                      <p className="text-xs text-muted-foreground">Stowed above deck level</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>• Suitable for OOG cargo</p>
                    <p>• Weather exposure</p>
                    <p>• Lower stowage priority</p>
                  </div>
                </div>
                <div
                  onClick={() => setDeckPosition("below-deck")}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    deckPosition === "below-deck"
                      ? "border-[var(--ocean)] bg-[var(--ocean)]/10"
                      : "border-border hover:border-[var(--ocean)]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-[var(--ocean)]" />
                    <div>
                      <p className="font-medium">Below Deck</p>
                      <p className="text-xs text-muted-foreground">Stowed in cargo hold</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>• Weather protected</p>
                    <p>• Limited height clearance</p>
                    <p>• Not suitable for height OOG</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg mt-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-[var(--ocean)]" />
                  <div>
                    <p className="font-medium">Include Lashing Requirements</p>
                    <p className="text-sm text-muted-foreground">Calculate lashing equipment and costs</p>
                  </div>
                </div>
                <Switch
                  checked={includeLashing}
                  onCheckedChange={setIncludeLashing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className={`${result.isOOG ? "border-orange-500/30" : "border-[var(--logistics)]/30"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">OOG Status</p>
                  {result.isOOG && <Move className="h-4 w-4 text-orange-500" />}
                </div>
                <Badge className={getSeverityBadge(result.severity)}>
                  {result.isOOG ? result.severity.toUpperCase() : "STANDARD"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-2">
                  {result.isOOG ? "Out of Gauge cargo" : "In-gauge cargo"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Slots Required</p>
                <p className="text-2xl font-bold text-[var(--ocean)]">{result.slotsRequired}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.slotsRequired > 1 ? "Adjacent slot booking needed" : "Single slot"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Slot Utilization</p>
                <p className="text-2xl font-bold text-[var(--logistics)]">{result.slotUtilization.toFixed(0)}%</p>
                <Progress value={result.slotUtilization} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Vessel Compatible</p>
                <div className="flex items-center gap-2">
                  {result.vesselCompatible ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                      <span className="text-lg font-bold text-[var(--logistics)]">Yes</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <span className="text-lg font-bold text-destructive">No</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {deckPosition === "on-deck" ? "On-deck stowage" : "Below-deck stowage"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Overhang Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Move className="h-5 w-5 text-[var(--ocean)]" />
                Overhang Analysis
              </CardTitle>
              <CardDescription>Detailed breakdown of cargo overhang by dimension</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Width Overhang */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Width Overhang</span>
                    <Badge variant={result.widthOverhang > container.maxOverhangWidth ? "destructive" : "outline"}>
                      {result.widthOverhang > container.maxOverhangWidth ? "Exceeded" : "Within Limit"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cargo Width:</span>
                      <span className="font-medium">{result.totalWidth.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Container Width:</span>
                      <span>{container.externalWidth.toFixed(2)} m</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overhang:</span>
                      <span className={`font-bold ${result.widthOverhang > 0 ? "text-orange-500" : "text-[var(--logistics)]"}`}>
                        {result.widthOverhang.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Allowed:</span>
                      <span>{container.maxOverhangWidth.toFixed(2)} m</span>
                    </div>
                  </div>
                  <Progress
                    value={(result.widthOverhang / container.maxOverhangWidth) * 100}
                    className={`mt-3 h-2 ${result.widthOverhang > container.maxOverhangWidth ? "[&>div]:bg-red-500" : ""}`}
                  />
                </div>

                {/* Height Overhang */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Height Overhang</span>
                    <Badge variant={result.heightOverhang > container.maxOverhangHeight ? "destructive" : "outline"}>
                      {result.heightOverhang > container.maxOverhangHeight ? "Exceeded" : "Within Limit"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cargo Height:</span>
                      <span className="font-medium">{result.totalHeight.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Container Height:</span>
                      <span>{container.externalHeight.toFixed(2)} m</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overhang:</span>
                      <span className={`font-bold ${result.heightOverhang > 0 ? "text-orange-500" : "text-[var(--logistics)]"}`}>
                        {result.heightOverhang.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Allowed:</span>
                      <span>{container.maxOverhangHeight.toFixed(2)} m</span>
                    </div>
                  </div>
                  <Progress
                    value={(result.heightOverhang / container.maxOverhangHeight) * 100}
                    className={`mt-3 h-2 ${result.heightOverhang > container.maxOverhangHeight ? "[&>div]:bg-red-500" : ""}`}
                  />
                </div>

                {/* Length Overhang */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">Length Overhang</span>
                    <Badge variant={result.lengthOverhang > container.maxOverhangLength ? "destructive" : "outline"}>
                      {result.lengthOverhang > container.maxOverhangLength ? "Exceeded" : "Within Limit"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cargo Length:</span>
                      <span className="font-medium">{result.totalLength.toFixed(2)} m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Container Length:</span>
                      <span>{container.externalLength.toFixed(2)} m</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Overhang:</span>
                      <span className={`font-bold ${result.lengthOverhang > 0 ? "text-orange-500" : "text-[var(--logistics)]"}`}>
                        {result.lengthOverhang.toFixed(2)} m
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Allowed:</span>
                      <span>{container.maxOverhangLength.toFixed(2)} m</span>
                    </div>
                  </div>
                  <Progress
                    value={(result.lengthOverhang / container.maxOverhangLength) * 100}
                    className={`mt-3 h-2 ${result.lengthOverhang > container.maxOverhangLength ? "[&>div]:bg-red-500" : ""}`}
                  />
                </div>
              </div>

              {/* Overhang Chart */}
              <div className="mt-6 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overhangData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: "Meters", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(2)} m`} />
                    <Legend />
                    <Bar dataKey="overhang" name="Actual Overhang" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="limit" name="Maximum Allowed" fill="#2E8B57" opacity={0.5} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lashing Requirements */}
          {result.lashingRequired && includeLashing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--ocean)]" />
                  Lashing Requirements
                </CardTitle>
                <CardDescription>Recommended lashing equipment for cargo securing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4">Equipment Type</th>
                        <th className="text-center py-3 px-4">Quantity</th>
                        <th className="text-right py-3 px-4">Unit Cost</th>
                        <th className="text-right py-3 px-4">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.lashingEquipment.map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-3 px-4 font-medium">{item.type}</td>
                          <td className="text-center py-3 px-4">{item.quantity}</td>
                          <td className="text-right py-3 px-4">${item.costPerUnit}</td>
                          <td className="text-right py-3 px-4">${item.totalCost}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-bold bg-muted/30">
                        <td className="py-3 px-4">Total Lashing Cost</td>
                        <td></td>
                        <td></td>
                        <td className="text-right py-3 px-4 text-[var(--ocean)]">${totalLashingCost}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations and Warnings */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-[var(--logistics)]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-[var(--logistics)]">
                  <CheckCircle2 className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.recommendations.length > 0 ? (
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-[var(--logistics)]">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific recommendations.</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.warnings.length > 0 ? (
                  <ul className="space-y-3">
                    {result.warnings.map((warning, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-destructive">⚠</span>
                        {warning}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No warnings - cargo configuration is acceptable.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Visualization Tab */}
        <TabsContent value="visualization" className="space-y-6 mt-6">
          {/* 3D Container View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-[var(--ocean)]" />
                3D Container Visualization
              </CardTitle>
              <CardDescription>Visual representation of cargo and overhang</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Main 3D View */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg relative overflow-hidden mb-6">
                {/* Container outline */}
                <div className="absolute inset-8 border-2 border-[var(--ocean)]/30 rounded-lg">
                  {/* Container label */}
                  <div className="absolute -top-6 left-0 text-xs text-muted-foreground">
                    {container.name} ({container.externalLength.toFixed(1)}×{container.externalWidth.toFixed(1)}×{container.externalHeight.toFixed(1)}m)
                  </div>

                  {/* Cargo representation */}
                  <div
                    className={`absolute bg-[var(--ocean)]/60 rounded transition-all duration-300 ${
                      result.isOOG ? "border-2 border-orange-500" : "border border-[var(--logistics)]"
                    }`}
                    style={{
                      left: `${((container.externalLength - result.totalLength) / 2 / container.externalLength) * 100}%`,
                      right: `${((container.externalLength - result.totalLength) / 2 / container.externalLength) * 100}%`,
                      top: `${((container.externalHeight - result.totalHeight) / container.externalHeight) * 100}%`,
                      bottom: "0%",
                    }}
                  >
                    {/* Overhang indicators */}
                    {result.widthOverhang > 0 && (
                      <div className="absolute -left-4 top-0 bottom-0 w-4 bg-orange-500/40 border-l-2 border-orange-500 flex items-center justify-center">
                        <span className="text-xs text-orange-600 font-bold rotate-90">{result.widthOverhang.toFixed(1)}m</span>
                      </div>
                    )}
                    {result.widthOverhang > 0 && (
                      <div className="absolute -right-4 top-0 bottom-0 w-4 bg-orange-500/40 border-r-2 border-orange-500 flex items-center justify-center">
                        <span className="text-xs text-orange-600 font-bold rotate-90">{result.widthOverhang.toFixed(1)}m</span>
                      </div>
                    )}
                    {result.heightOverhang > 0 && (
                      <div className="absolute -top-6 left-0 right-0 h-6 bg-orange-500/40 border-t-2 border-orange-500 flex items-center justify-center">
                        <span className="text-xs text-orange-600 font-bold">{result.heightOverhang.toFixed(1)}m over</span>
                      </div>
                    )}
                    {result.lengthOverhang > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-4 bg-orange-500/40 border-b-2 border-orange-500 flex items-center justify-center translate-y-full">
                        <span className="text-xs text-orange-600 font-bold">{result.lengthOverhang.toFixed(1)}m</span>
                      </div>
                    )}
                  </div>

                  {/* Dimension labels */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                    L: {result.totalLength.toFixed(2)}m
                  </div>
                  <div className="absolute top-1/2 -left-8 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
                    W: {result.totalWidth.toFixed(2)}m
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    H: {result.totalHeight.toFixed(2)}m
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute top-4 right-4 bg-background/80 p-3 rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[var(--ocean)]/60 rounded"></div>
                    <span>Cargo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500/40 rounded border border-orange-500"></div>
                    <span>Overhang</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[var(--ocean)]/30 rounded"></div>
                    <span>Container</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge className={getSeverityBadge(result.severity)}>
                    {result.isOOG ? "OOG CARGO" : "IN-GAUGE"}
                  </Badge>
                </div>
              </div>

              {/* Top-Down View */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Top-Down View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-muted/50 rounded-lg relative p-4">
                      {/* Container outline (top view) */}
                      <div className="absolute inset-4 border-2 border-[var(--ocean)]/30">
                        <div className="absolute -top-5 left-0 text-xs text-muted-foreground">Container Width: {container.externalWidth.toFixed(1)}m</div>

                        {/* Cargo (top view) */}
                        <div
                          className="absolute bg-[var(--ocean)]/60 rounded border border-[var(--ocean)]"
                          style={{
                            left: `${((container.externalLength - result.totalLength) / 2 / container.externalLength) * 100}%`,
                            right: `${((container.externalLength - result.totalLength) / 2 / container.externalLength) * 100}%`,
                            top: `${((container.externalWidth - result.totalWidth) / 2 / container.externalWidth) * 100}%`,
                            bottom: `${((container.externalWidth - result.totalWidth) / 2 / container.externalWidth) * 100}%`,
                          }}
                        >
                          {/* Width overhang indicators */}
                          {result.widthOverhang > 0 && (
                            <>
                              <div className="absolute -left-1 top-0 bottom-0 w-1 bg-orange-500"></div>
                              <div className="absolute -right-1 top-0 bottom-0 w-1 bg-orange-500"></div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Width labels */}
                      <div className="absolute top-1/2 -left-2 -translate-y-1/2 text-xs text-muted-foreground -rotate-90">
                        {result.totalWidth.toFixed(1)}m
                      </div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {result.totalLength.toFixed(1)}m
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Side View</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-muted/50 rounded-lg relative p-4">
                      {/* Container outline (side view) */}
                      <div className="absolute inset-4 border-2 border-[var(--ocean)]/30">
                        <div className="absolute -top-5 left-0 text-xs text-muted-foreground">Container Height: {container.externalHeight.toFixed(1)}m</div>

                        {/* Cargo (side view) */}
                        <div
                          className="absolute bg-[var(--ocean)]/60 rounded border border-[var(--ocean)]"
                          style={{
                            left: `${((container.externalLength - result.totalLength) / 2 / container.externalLength) * 100}%`,
                            right: `${((container.externalLength - result.totalLength) / 2 / container.externalLength) * 100}%`,
                            top: `${((container.externalHeight - result.totalHeight) / container.externalHeight) * 100}%`,
                            bottom: "0%",
                          }}
                        >
                          {/* Height overhang indicator */}
                          {result.heightOverhang > 0 && (
                            <div className="absolute -top-1 left-0 right-0 h-1 bg-orange-500"></div>
                          )}
                        </div>
                      </div>

                      {/* Height label */}
                      <div className="absolute top-1/2 -left-2 -translate-y-1/2 text-xs text-muted-foreground -rotate-90">
                        {result.totalHeight.toFixed(1)}m
                      </div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                        {result.totalLength.toFixed(1)}m
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Slot Utilization Diagram */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[var(--ocean)]" />
                    Slot Utilization Diagram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2 p-4">
                    {Array.from({ length: result.slotsRequired }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`relative w-24 h-32 border-2 rounded ${
                          idx === 0 ? "border-[var(--ocean)] bg-[var(--ocean)]/20" : "border-orange-500 bg-orange-500/10"
                        }`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">Slot {idx + 1}</span>
                        </div>
                        {idx === 0 && (
                          <div className="absolute inset-2 bg-[var(--ocean)]/40 rounded flex items-center justify-center">
                            <span className="text-xs text-white font-medium">Cargo</span>
                          </div>
                        )}
                        {idx === 1 && result.widthOverhang > 0 && (
                          <div className="absolute inset-y-2 left-0 w-1/3 bg-orange-500/40 rounded-l flex items-center justify-center">
                            <span className="text-xs text-orange-600 font-medium rotate-90">Overhang</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    {result.slotsRequired === 1
                      ? "Single slot booking sufficient"
                      : `${result.slotsRequired} adjacent slots required due to width overhang`}
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Costs Tab */}
        <TabsContent value="costs" className="space-y-6 mt-6">
          {/* Cost Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                Cost Analysis
              </CardTitle>
              <CardDescription>OOG surcharge estimates by carrier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Base Freight Cost</p>
                  <p className="text-2xl font-bold text-[var(--ocean)]">
                    ${result.surcharges.find(s => s.carrier === selectedCarrier)?.baseCost || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Estimated standard rate</p>
                </div>
                <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                  <p className="text-sm text-muted-foreground">OOG Surcharge</p>
                  <p className="text-2xl font-bold text-orange-500">
                    ${result.surcharges.find(s => s.carrier === selectedCarrier)?.oogSurcharge || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Additional OOG costs</p>
                </div>
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg border border-[var(--logistics)]/30">
                  <p className="text-sm text-muted-foreground">Total Estimated</p>
                  <p className="text-2xl font-bold text-[var(--logistics)]">
                    ${result.surcharges.find(s => s.carrier === selectedCarrier)?.totalCost || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Freight + OOG charges</p>
                </div>
              </div>

              <div className="mb-4">
                <Label>Select Carrier for Detailed Quote</Label>
                <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CARRIER_SURCHARGES.map((carrier) => (
                      <SelectItem key={carrier.carrier} value={carrier.carrier}>
                        {carrier.carrier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Carrier Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Carrier Comparison</CardTitle>
              <CardDescription>Compare OOG surcharges across major carriers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value: number) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="base" name="Base Rate" fill="#0F4C81" stackId="a" />
                    <Bar dataKey="oog" name="OOG Surcharge" fill="#F97316" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Carrier Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Carrier Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Carrier</th>
                      <th className="text-right py-3 px-4">Base Rate</th>
                      <th className="text-right py-3 px-4">Width Surcharge</th>
                      <th className="text-right py-3 px-4">Height Surcharge</th>
                      <th className="text-right py-3 px-4">Length Surcharge</th>
                      <th className="text-right py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.surcharges.map((s) => {
                      const carrier = CARRIER_SURCHARGES.find(c => c.carrier === s.carrier);
                      return (
                        <tr key={s.carrier} className={`border-b ${selectedCarrier === s.carrier ? "bg-[var(--ocean)]/10" : ""}`}>
                          <td className="py-3 px-4 font-medium">{s.carrier}</td>
                          <td className="text-right py-3 px-4">${carrier?.baseRate || 0}/CBM</td>
                          <td className="text-right py-3 px-4">${carrier?.widthSurcharge || 0}/CBM</td>
                          <td className="text-right py-3 px-4">${carrier?.heightSurcharge || 0}/CBM</td>
                          <td className="text-right py-3 px-4">${carrier?.lengthSurcharge || 0}/CBM</td>
                          <td className="text-right py-3 px-4 font-bold text-[var(--ocean)]">${s.totalCost}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown Pie */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Base Freight", value: result.surcharges.find(s => s.carrier === selectedCarrier)?.baseCost || 0 },
                          { name: "OOG Surcharge", value: result.surcharges.find(s => s.carrier === selectedCarrier)?.oogSurcharge || 0 },
                          { name: "Lashing", value: totalLashingCost },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: $${value}`}
                      >
                        <Cell fill="#0F4C81" />
                        <Cell fill="#F97316" />
                        <Cell fill="#2E8B57" />
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Standard vs OOG Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Standard Shipment</p>
                        <p className="text-sm text-muted-foreground">In-gauge cargo (no overhang)</p>
                      </div>
                      <p className="text-xl font-bold">${result.surcharges.find(s => s.carrier === selectedCarrier)?.baseCost || 0}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-orange-500">OOG Shipment</p>
                        <p className="text-sm text-muted-foreground">With overhang surcharges</p>
                      </div>
                      <p className="text-xl font-bold text-orange-500">${result.surcharges.find(s => s.carrier === selectedCarrier)?.totalCost || 0}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                    <span className="font-medium">Additional Cost</span>
                    <span className="text-xl font-bold text-destructive">
                      +${(result.surcharges.find(s => s.carrier === selectedCarrier)?.totalCost || 0) - (result.surcharges.find(s => s.carrier === selectedCarrier)?.baseCost || 0)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    OOG cargo costs approximately {result.isOOG ? Math.round(((result.surcharges.find(s => s.carrier === selectedCarrier)?.totalCost || 1) / (result.surcharges.find(s => s.carrier === selectedCarrier)?.baseCost || 1) - 1) * 100) : 0}% more than standard cargo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6 mt-6">
          {/* Maximum Overhang Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-[var(--ocean)]" />
                Maximum Overhang Limits by Container Type
              </CardTitle>
              <CardDescription>Standard limits for OOG cargo planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Container Type</th>
                      <th className="text-center py-3 px-4">Max Width Overhang</th>
                      <th className="text-center py-3 px-4">Max Height Overhang</th>
                      <th className="text-center py-3 px-4">Max Length Overhang</th>
                      <th className="text-center py-3 px-4">OOG Capable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(OOG_CONTAINERS).map(([key, c]) => (
                      <tr key={key} className="border-b">
                        <td className="py-3 px-4 font-medium">{c.name}</td>
                        <td className="text-center py-3 px-4">{c.maxOverhangWidth.toFixed(2)} m</td>
                        <td className="text-center py-3 px-4">{c.maxOverhangHeight.toFixed(2)} m</td>
                        <td className="text-center py-3 px-4">{c.maxOverhangLength.toFixed(2)} m</td>
                        <td className="text-center py-3 px-4">
                          {c.supportsOOG ? (
                            <Badge className="bg-[var(--logistics)] text-white">Yes</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">Limited</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* OOG Surcharge Rates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                Carrier OOG Surcharge Rates
              </CardTitle>
              <CardDescription>Typical surcharge rates by carrier (per CBM overhang)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Carrier</th>
                      <th className="text-center py-3 px-4">Base Rate</th>
                      <th className="text-center py-3 px-4">Width Surcharge</th>
                      <th className="text-center py-3 px-4">Height Surcharge</th>
                      <th className="text-center py-3 px-4">Length Surcharge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CARRIER_SURCHARGES.map((carrier) => (
                      <tr key={carrier.carrier} className="border-b">
                        <td className="py-3 px-4 font-medium">{carrier.carrier}</td>
                        <td className="text-center py-3 px-4">${carrier.baseRate}/{carrier.unit}</td>
                        <td className="text-center py-3 px-4">${carrier.widthSurcharge}/{carrier.unit}</td>
                        <td className="text-center py-3 px-4">${carrier.heightSurcharge}/{carrier.unit}</td>
                        <td className="text-center py-3 px-4">${carrier.lengthSurcharge}/{carrier.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Rates are indicative and subject to change. Contact carriers for actual quotes.
              </p>
            </CardContent>
          </Card>

          {/* Lashing Equipment Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[var(--ocean)]" />
                Lashing Equipment Specifications
              </CardTitle>
              <CardDescription>Recommended equipment for cargo securing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Equipment Type</th>
                      <th className="text-center py-3 px-4">Min Overhang</th>
                      <th className="text-center py-3 px-4">Max Overhang</th>
                      <th className="text-center py-3 px-4">Strength</th>
                      <th className="text-right py-3 px-4">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LASHING_EQUIPMENT.map((item) => (
                      <tr key={item.type} className="border-b">
                        <td className="py-3 px-4 font-medium">{item.type}</td>
                        <td className="text-center py-3 px-4">{item.minOverhang.toFixed(1)} m</td>
                        <td className="text-center py-3 px-4">{item.maxOverhang.toFixed(1)} m</td>
                        <td className="text-center py-3 px-4">{item.strength}</td>
                        <td className="text-right py-3 px-4">${item.costPerUnit}/unit</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Port Handling Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-[var(--ocean)]" />
                Port Handling Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Equipment Requirements</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Mobile harbor cranes for heavy lift cargo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Spreaders with adjustable width for wide cargo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Special handling gear for project cargo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>Adequate terminal storage space</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Documentation Required</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <span>Cargo manifest with exact dimensions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <span>Stowage plan approval from carrier</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <span>Lashing certificate from certified surveyor</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                      <span>Special cargo insurance endorsement</span>
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
        <Button variant="outline" size="sm" onClick={() => {
          setContainerType("20FR");
          setCargoLength(5.5);
          setCargoWidth(2.8);
          setCargoHeight(3.0);
          setCargoWeight(15000);
        }}>
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
