"use client";

import { useState, useMemo, useCallback } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Truck,
  Container,
  Package,
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
  ArrowRight,
  Layers,
  Grid3X3,
  RotateCcw,
  AlertCircle,
  Zap,
  BarChart3,
  PieChart,
  Settings2,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Eye,
  Move3D,
  Gauge,
  Scale,
  PackageCheck,
  Layers3,
  AlertOctagon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";

// Vehicle/Container specifications
const VEHICLES = {
  // Trucks
  "truck_small": {
    name: "Small Truck (3.5t)",
    type: "truck",
    internalLength: 4.2,
    internalWidth: 2.0,
    internalHeight: 2.2,
    capacity: 18.5,
    maxPayload: 3500,
    tareWeight: 1500,
    axleLimit: 3500,
  },
  "truck_medium": {
    name: "Medium Truck (7.5t)",
    type: "truck",
    internalLength: 6.0,
    internalWidth: 2.4,
    internalHeight: 2.5,
    capacity: 36.0,
    maxPayload: 7500,
    tareWeight: 3000,
    axleLimit: 7500,
  },
  "truck_large": {
    name: "Large Truck (18t)",
    type: "truck",
    internalLength: 8.5,
    internalWidth: 2.5,
    internalHeight: 2.7,
    capacity: 57.4,
    maxPayload: 18000,
    tareWeight: 8000,
    axleLimit: 18000,
  },
  "truck_semi": {
    name: "Semi-Trailer (40t)",
    type: "truck",
    internalLength: 13.6,
    internalWidth: 2.48,
    internalHeight: 2.7,
    capacity: 91.0,
    maxPayload: 28000,
    tareWeight: 12000,
    axleLimit: 40000,
  },
  // Containers
  "container_20gp": {
    name: "20' GP Container",
    type: "container",
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 33.2,
    maxPayload: 21700,
    tareWeight: 2300,
    axleLimit: 0,
  },
  "container_40gp": {
    name: "40' GP Container",
    type: "container",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.393,
    capacity: 67.7,
    maxPayload: 25800,
    tareWeight: 3750,
    axleLimit: 0,
  },
  "container_40hc": {
    name: "40' HC Container",
    type: "container",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.698,
    capacity: 76.3,
    maxPayload: 26330,
    tareWeight: 3950,
    axleLimit: 0,
  },
  "container_45hc": {
    name: "45' HC Container",
    type: "container",
    internalLength: 13.556,
    internalWidth: 2.352,
    internalHeight: 2.698,
    capacity: 86.0,
    maxPayload: 25500,
    tareWeight: 4700,
    axleLimit: 0,
  },
};

// Cargo types with compatibility rules
const CARGO_TYPES = {
  "general": { name: "General Cargo", hazardous: false, fragile: false, stackable: true },
  "fragile": { name: "Fragile Goods", hazardous: false, fragile: true, stackable: false },
  "hazardous": { name: "Hazardous Materials", hazardous: true, fragile: false, stackable: true },
  "hazardous_fragile": { name: "Hazardous & Fragile", hazardous: true, fragile: true, stackable: false },
  "liquid": { name: "Liquid/Tank", hazardous: false, fragile: false, stackable: false },
  "perishable": { name: "Perishable Goods", hazardous: false, fragile: true, stackable: true },
  "heavy": { name: "Heavy Machinery", hazardous: false, fragile: false, stackable: false },
  "oversized": { name: "Oversized Cargo", hazardous: false, fragile: false, stackable: false },
};

interface CargoItem {
  id: string;
  name: string;
  cargoType: keyof typeof CARGO_TYPES;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  stackable: boolean;
  stackLimit: number;
  priority: "high" | "medium" | "low";
  rotation: boolean;
}

interface PlacedCargo extends CargoItem {
  x: number;
  y: number;
  z: number;
  rotated: boolean;
}

interface WeightDistribution {
  frontPercentage: number;
  rearPercentage: number;
  leftPercentage: number;
  rightPercentage: number;
  isBalanced: boolean;
  warning: string | null;
}

interface LoadSequence {
  sequence: number;
  itemId: string;
  itemName: string;
  reason: string;
  position: { x: number; y: number; z: number };
}

interface CompatibilityIssue {
  itemId1: string;
  itemId2: string;
  itemName1: string;
  itemName2: string;
  issue: string;
  severity: "warning" | "error";
}

interface LoadResult {
  totalVolume: number;
  totalWeight: number;
  volumeUtilization: number;
  weightUtilization: number;
  itemsPlaced: number;
  remainingVolume: number;
  remainingWeight: number;
  weightDistribution: WeightDistribution;
  loadSequence: LoadSequence[];
  compatibilityIssues: CompatibilityIssue[];
  recommendation: string;
  warningLevel: "safe" | "caution" | "danger";
  placedCargo: PlacedCargo[];
}

export function LoadPlanningOptimizer() {
  const [activeTab, setActiveTab] = useState("cargo");
  const [vehicleType, setVehicleType] = useState<keyof typeof VEHICLES>("truck_semi");
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([
    {
      id: "1",
      name: "Electronics Boxes",
      cargoType: "fragile",
      length: 0.6,
      width: 0.4,
      height: 0.4,
      weight: 25,
      quantity: 20,
      stackable: false,
      stackLimit: 1,
      priority: "high",
      rotation: true,
    },
  ]);
  const [dimensionUnit, setDimensionUnit] = useState<"m" | "cm" | "ft">("m");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  const [viewAngle, setViewAngle] = useState<"front" | "side" | "top" | "3d">("3d");

  const vehicle = VEHICLES[vehicleType];

  // Calculate load optimization
  const result = useMemo((): LoadResult => {
    let totalVolume = 0;
    let totalWeight = 0;
    const placedCargo: PlacedCargo[] = [];
    let currentX = 0;
    let currentY = 0;
    let currentZ = 0;
    let rowHeight = 0;

    // Sort items by priority (high first) and weight (heavy at bottom)
    const sortedItems = [...cargoItems].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.weight - a.weight; // Heavy items first
    });

    // Place cargo items
    sortedItems.forEach((item) => {
      const itemVolume = item.length * item.width * item.height;
      const itemWeight = item.weight;
      totalVolume += itemVolume * item.quantity;
      totalWeight += itemWeight * item.quantity;

      for (let i = 0; i < item.quantity; i++) {
        let placed = false;
        let rotated = false;

        // Try to fit item in current position
        const tryFit = (l: number, w: number, h: number, rotate: boolean) => {
          if (currentX + l <= vehicle.internalLength && currentY + w <= vehicle.internalWidth) {
            placedCargo.push({
              ...item,
              x: currentX,
              y: currentY,
              z: currentZ,
              rotated: rotate,
              id: `${item.id}-${i}`,
            });
            currentX += l + 0.02; // Small gap
            rowHeight = Math.max(rowHeight, h);
            placed = true;
            return true;
          }
          return false;
        };

        // Try normal orientation first, then rotated
        if (item.rotation) {
          if (tryFit(item.length, item.width, item.height, false) || 
              tryFit(item.width, item.length, item.height, true)) {
            placed = true;
          }
        } else {
          placed = tryFit(item.length, item.width, item.height, false);
        }

        // Move to next row if current row is full
        if (!placed) {
          currentX = 0;
          currentY += rowHeight + 0.02;
          rowHeight = 0;

          if (item.rotation) {
            placed = tryFit(item.length, item.width, item.height, false) ||
                     tryFit(item.width, item.length, item.height, true);
          } else {
            placed = tryFit(item.length, item.width, item.height, false);
          }

          // Move to next layer if row is full
          if (!placed) {
            currentX = 0;
            currentY = 0;
            currentZ += rowHeight + 0.02;
            rowHeight = 0;

            if (item.rotation) {
              if (!tryFit(item.length, item.width, item.height, false)) {
                tryFit(item.width, item.length, item.height, true);
              }
            } else {
              tryFit(item.length, item.width, item.height, false);
            }
          }
        }
      }
    });

    // Calculate weight distribution
    const midLength = vehicle.internalLength / 2;
    const midWidth = vehicle.internalWidth / 2;
    let frontWeight = 0;
    let rearWeight = 0;
    let leftWeight = 0;
    let rightWeight = 0;

    placedCargo.forEach((item) => {
      const itemCenterX = item.x + (item.rotated ? item.width : item.length) / 2;
      const itemCenterY = item.y + (item.rotated ? item.length : item.width) / 2;

      if (itemCenterX < midLength) {
        frontWeight += item.weight;
      } else {
        rearWeight += item.weight;
      }

      if (itemCenterY < midWidth) {
        leftWeight += item.weight;
      } else {
        rightWeight += item.weight;
      }
    });

    const totalPlacedWeight = frontWeight + rearWeight;
    const weightDistribution: WeightDistribution = {
      frontPercentage: totalPlacedWeight > 0 ? (frontWeight / totalPlacedWeight) * 100 : 50,
      rearPercentage: totalPlacedWeight > 0 ? (rearWeight / totalPlacedWeight) * 100 : 50,
      leftPercentage: totalPlacedWeight > 0 ? (leftWeight / totalPlacedWeight) * 100 : 50,
      rightPercentage: totalPlacedWeight > 0 ? (rightWeight / totalPlacedWeight) * 100 : 50,
      isBalanced: false,
      warning: null,
    };

    weightDistribution.isBalanced = 
      Math.abs(weightDistribution.frontPercentage - weightDistribution.rearPercentage) < 15 &&
      Math.abs(weightDistribution.leftPercentage - weightDistribution.rightPercentage) < 10;

    if (Math.abs(weightDistribution.frontPercentage - weightDistribution.rearPercentage) > 20) {
      weightDistribution.warning = "Significant front/rear weight imbalance detected";
    } else if (Math.abs(weightDistribution.leftPercentage - weightDistribution.rightPercentage) > 15) {
      weightDistribution.warning = "Significant left/right weight imbalance detected";
    }

    // Generate load sequence
    const loadSequence: LoadSequence[] = sortedItems.map((item, index) => ({
      sequence: index + 1,
      itemId: item.id,
      itemName: item.name,
      reason: item.priority === "high" ? "High priority - load last for easy access" :
              item.cargoType === "heavy" ? "Heavy item - load first at bottom" :
              item.cargoType === "fragile" ? "Fragile - protect from other cargo" :
              "Standard loading order",
      position: { x: 0, y: 0, z: 0 },
    }));

    // Check compatibility issues
    const compatibilityIssues: CompatibilityIssue[] = [];
    for (let i = 0; i < cargoItems.length; i++) {
      for (let j = i + 1; j < cargoItems.length; j++) {
        const item1 = cargoItems[i];
        const item2 = cargoItems[j];
        const type1 = CARGO_TYPES[item1.cargoType];
        const type2 = CARGO_TYPES[item2.cargoType];

        // Hazardous materials check
        if (type1.hazardous && type2.hazardous) {
          compatibilityIssues.push({
            itemId1: item1.id,
            itemId2: item2.id,
            itemName1: item1.name,
            itemName2: item2.name,
            issue: "Both items are hazardous - ensure proper segregation",
            severity: "warning",
          });
        }

        // Fragile items check
        if (type1.fragile && !type2.fragile && item2.stackable) {
          compatibilityIssues.push({
            itemId1: item1.id,
            itemId2: item2.id,
            itemName1: item1.name,
            itemName2: item2.name,
            issue: `${item1.name} is fragile - do not stack with ${item2.name}`,
            severity: "warning",
          });
        }

        // Heavy on fragile check
        if (type2.fragile && item1.weight > item2.weight * 2) {
          compatibilityIssues.push({
            itemId1: item1.id,
            itemId2: item2.id,
            itemName1: item1.name,
            itemName2: item2.name,
            issue: `Heavy item ${item1.name} should not be placed on fragile ${item2.name}`,
            severity: "error",
          });
        }
      }
    }

    // Calculate utilization
    const volumeUtilization = (totalVolume / vehicle.capacity) * 100;
    const weightUtilization = (totalWeight / vehicle.maxPayload) * 100;
    const remainingVolume = vehicle.capacity - totalVolume;
    const remainingWeight = vehicle.maxPayload - totalWeight;

    // Determine recommendation
    let recommendation = "";
    let warningLevel: "safe" | "caution" | "danger" = "safe";

    if (weightUtilization > 100) {
      recommendation = "OVERWEIGHT: Reduce cargo weight or use multiple vehicles";
      warningLevel = "danger";
    } else if (volumeUtilization > 100) {
      recommendation = "OVERVOLUME: Cargo exceeds vehicle capacity";
      warningLevel = "danger";
    } else if (weightUtilization > 90 && volumeUtilization < 70) {
      recommendation = "Weight-limited: Consider using a larger vehicle or splitting the load";
      warningLevel = "caution";
    } else if (volumeUtilization > 90 && weightUtilization < 70) {
      recommendation = "Volume-limited: Good for light, bulky cargo - consider denser packing";
      warningLevel = "caution";
    } else if (!weightDistribution.isBalanced) {
      recommendation = "Weight imbalance detected: Rearrange cargo for better balance";
      warningLevel = "caution";
    } else if (volumeUtilization > 80 && weightUtilization > 80) {
      recommendation = "Excellent utilization: Both volume and weight optimized";
      warningLevel = "safe";
    } else {
      recommendation = "Good utilization with room for optimization";
      warningLevel = "safe";
    }

    return {
      totalVolume,
      totalWeight,
      volumeUtilization: Math.min(volumeUtilization, 100),
      weightUtilization: Math.min(weightUtilization, 100),
      itemsPlaced: cargoItems.reduce((acc, item) => acc + item.quantity, 0),
      remainingVolume,
      remainingWeight,
      weightDistribution,
      loadSequence,
      compatibilityIssues,
      recommendation,
      warningLevel,
      placedCargo,
    };
  }, [cargoItems, vehicle]);

  // Chart data
  const utilizationData = [
    { name: "Volume", value: result.volumeUtilization, fill: "#0F4C81" },
    { name: "Weight", value: result.weightUtilization, fill: "#2E8B57" },
  ];

  const spaceData = [
    { name: "Used", value: result.totalVolume, fill: "#0F4C81" },
    { name: "Available", value: Math.max(result.remainingVolume, 0), fill: "#E5E7EB" },
  ];

  const COLORS = ["#0F4C81", "#E5E7EB"];

  const addItem = () => {
    setCargoItems([
      ...cargoItems,
      {
        id: Date.now().toString(),
        name: `Cargo Item ${cargoItems.length + 1}`,
        cargoType: "general",
        length: 0.5,
        width: 0.4,
        height: 0.3,
        weight: 20,
        quantity: 10,
        stackable: true,
        stackLimit: 3,
        priority: "medium",
        rotation: true,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setCargoItems(cargoItems.filter((item) => item.id !== id));
  };

  const updateItem = useCallback((id: string, field: keyof CargoItem, value: string | number | boolean) => {
    setCargoItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        // Auto-set stackable based on cargo type
        if (field === "cargoType") {
          const cargoType = CARGO_TYPES[value as keyof typeof CARGO_TYPES];
          updated.stackable = cargoType.stackable;
          if (!cargoType.stackable) {
            updated.stackLimit = 1;
          }
        }
        return updated;
      })
    );
  }, []);

  const getWarningColor = (level: "safe" | "caution" | "danger") => {
    switch (level) {
      case "danger":
        return "text-destructive";
      case "caution":
        return "text-yellow-500";
      default:
        return "text-[var(--logistics)]";
    }
  };

  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    const colors = {
      high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    };
    return colors[priority];
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cargo">Cargo Items</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          <TabsTrigger value="visualization">3D View</TabsTrigger>
          <TabsTrigger value="sequence">Load Sequence</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        {/* Cargo Input Tab */}
        <TabsContent value="cargo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--ocean)]" />
                Cargo Configuration
              </CardTitle>
              <CardDescription>Add your cargo items with dimensions and weight specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Unit Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Dimension Unit</Label>
                  <Select value={dimensionUnit} onValueChange={(v) => setDimensionUnit(v as "m" | "cm" | "ft")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m">Meters (m)</SelectItem>
                      <SelectItem value="cm">Centimeters (cm)</SelectItem>
                      <SelectItem value="ft">Feet (ft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Weight Unit</Label>
                  <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as "kg" | "lb")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Items List */}
          <ScrollArea className="max-h-[600px] pr-4">
            {cargoItems.map((item, index) => (
              <Card key={item.id} className="mb-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Box className="h-5 w-5 text-[var(--ocean)]" />
                      {item.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityBadge(item.priority)}>
                        {item.priority.toUpperCase()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Item Name</Label>
                      <Input
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Cargo Type</Label>
                      <Select
                        value={item.cargoType}
                        onValueChange={(v) => updateItem(item.id, "cargoType", v as keyof typeof CARGO_TYPES)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CARGO_TYPES).map(([key, type]) => (
                            <SelectItem key={key} value={key}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select
                        value={item.priority}
                        onValueChange={(v) => updateItem(item.id, "priority", v as "high" | "medium" | "low")}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label>Length ({dimensionUnit})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.length}
                        onChange={(e) => updateItem(item.id, "length", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Width ({dimensionUnit})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.width}
                        onChange={(e) => updateItem(item.id, "width", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Height ({dimensionUnit})</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={item.height}
                        onChange={(e) => updateItem(item.id, "height", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Weight ({weightUnit})</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={item.weight}
                        onChange={(e) => updateItem(item.id, "weight", parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={item.stackable}
                        onCheckedChange={(v) => updateItem(item.id, "stackable", v)}
                      />
                      <Label className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Stackable
                      </Label>
                    </div>
                    {item.stackable && (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Max Stack:</Label>
                        <Input
                          type="number"
                          className="w-16"
                          value={item.stackLimit}
                          onChange={(e) => updateItem(item.id, "stackLimit", parseInt(e.target.value) || 1)}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={item.rotation}
                        onCheckedChange={(v) => updateItem(item.id, "rotation", v)}
                      />
                      <Label className="flex items-center gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Allow Rotation
                      </Label>
                    </div>
                  </div>

                  {/* Item Summary */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="p-2 bg-[var(--ocean)]/10 rounded text-center">
                      <p className="text-muted-foreground">Unit Volume</p>
                      <p className="font-bold text-[var(--ocean)]">
                        {(item.length * item.width * item.height).toFixed(3)} m³
                      </p>
                    </div>
                    <div className="p-2 bg-[var(--logistics)]/10 rounded text-center">
                      <p className="text-muted-foreground">Total Volume</p>
                      <p className="font-bold text-[var(--logistics)]">
                        {(item.length * item.width * item.height * item.quantity).toFixed(2)} m³
                      </p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded text-center">
                      <p className="text-muted-foreground">Total Weight</p>
                      <p className="font-bold">
                        {(item.weight * item.quantity).toFixed(1)} {weightUnit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>

          <Button onClick={addItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Cargo Item
          </Button>
        </TabsContent>

        {/* Vehicle Selection Tab */}
        <TabsContent value="vehicle" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {vehicle.type === "truck" ? (
                  <Truck className="h-5 w-5 text-[var(--ocean)]" />
                ) : (
                  <Container className="h-5 w-5 text-[var(--ocean)]" />
                )}
                Vehicle/Container Selection
              </CardTitle>
              <CardDescription>Choose the transport vehicle or container for your shipment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vehicle Type Filter */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={vehicle.type === "truck" ? "default" : "outline"}
                  onClick={() => setVehicleType("truck_small")}
                  className="flex items-center gap-2"
                >
                  <Truck className="h-4 w-4" />
                  Trucks
                </Button>
                <Button
                  variant={vehicle.type === "container" ? "default" : "outline"}
                  onClick={() => setVehicleType("container_20gp")}
                  className="flex items-center gap-2"
                >
                  <Container className="h-4 w-4" />
                  Containers
                </Button>
              </div>

              {/* Vehicle Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(VEHICLES)
                  .filter(([_, v]) => v.type === vehicle.type)
                  .map(([key, v]) => (
                    <div
                      key={key}
                      onClick={() => setVehicleType(key as keyof typeof VEHICLES)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        vehicleType === key
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/10"
                          : "border-border hover:border-[var(--ocean)]/50"
                      }`}
                    >
                      <p className="font-bold text-sm">{v.name}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-muted-foreground">{v.capacity} m³ capacity</p>
                        <p className="text-xs text-muted-foreground">{(v.maxPayload / 1000).toFixed(1)}t payload</p>
                      </div>
                    </div>
                  ))}
              </div>

              <Separator />

              {/* Vehicle Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-[var(--ocean)]" />
                    Internal Dimensions
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Length</p>
                      <p className="text-lg font-bold">{vehicle.internalLength}m</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Width</p>
                      <p className="text-lg font-bold">{vehicle.internalWidth}m</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="text-lg font-bold">{vehicle.internalHeight}m</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Weight className="h-4 w-4 text-[var(--ocean)]" />
                    Weight Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Max Payload</p>
                      <p className="text-lg font-bold">{(vehicle.maxPayload / 1000).toFixed(1)}t</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg text-center">
                      <p className="text-xs text-muted-foreground">Tare Weight</p>
                      <p className="text-lg font-bold">{(vehicle.tareWeight / 1000).toFixed(1)}t</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-[var(--ocean)]">Total Capacity</p>
                    <p className="text-sm text-muted-foreground">Maximum volumetric capacity</p>
                  </div>
                  <p className="text-3xl font-bold text-[var(--ocean)]">{vehicle.capacity} m³</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3D Visualization Tab */}
        <TabsContent value="visualization" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-[var(--ocean)]" />
                3D Load Visualization
              </CardTitle>
              <CardDescription>Visual representation of cargo placement</CardDescription>
            </CardHeader>
            <CardContent>
              {/* View Controls */}
              <div className="flex gap-2 mb-4">
                {(["front", "side", "top", "3d"] as const).map((view) => (
                  <Button
                    key={view}
                    variant={viewAngle === view ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewAngle(view)}
                    className="uppercase"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {view}
                  </Button>
                ))}
              </div>

              {/* 3D Container Visualization */}
              <div 
                className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg relative overflow-hidden"
                style={{ perspective: "1000px" }}
              >
                {/* Container Outline */}
                <div
                  className={`absolute inset-4 border-2 border-[var(--ocean)]/30 rounded-lg transition-transform duration-500 ${
                    viewAngle === "3d" 
                      ? "transform rotate-y-12 rotate-x-12" 
                      : viewAngle === "side" 
                        ? "" 
                        : viewAngle === "front"
                          ? "transform rotate-y-90"
                          : "transform rotate-x-90"
                  }`}
                  style={{
                    transform: viewAngle === "3d" 
                      ? "rotateY(-25deg) rotateX(15deg)" 
                      : viewAngle === "front" 
                        ? "rotateY(0deg)"
                        : viewAngle === "side"
                          ? "rotateY(-90deg)"
                          : "rotateX(90deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Grid Lines */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `linear-gradient(to right, var(--ocean) 1px, transparent 1px), linear-gradient(to bottom, var(--ocean) 1px, transparent 1px)`,
                      backgroundSize: `${100 / 10}% ${100 / 10}%`,
                    }} />
                  </div>

                  {/* Cargo Items */}
                  <div className="absolute bottom-2 left-2 right-2 space-y-1">
                    {result.placedCargo.slice(0, 20).map((cargo, idx) => {
                      const colorIndex = idx % 5;
                      const colors = [
                        "bg-[var(--ocean)]/60",
                        "bg-[var(--logistics)]/60", 
                        "bg-amber-500/60",
                        "bg-purple-500/60",
                        "bg-rose-500/60",
                      ];
                      const widthPercent = ((cargo.rotated ? cargo.width : cargo.length) / vehicle.internalLength) * 100;
                      const heightPercent = ((cargo.rotated ? cargo.length : cargo.width) / vehicle.internalWidth) * 100;
                      
                      return (
                        <div
                          key={cargo.id}
                          className={`${colors[colorIndex]} rounded flex items-center px-2 py-1 transition-all hover:opacity-80`}
                          style={{
                            width: `${Math.min(widthPercent, 100)}%`,
                            minHeight: "24px",
                          }}
                          title={`${cargo.name}: ${cargo.length}m × ${cargo.width}m × ${cargo.height}m`}
                        >
                          <span className="text-xs text-white font-medium truncate">
                            {cargo.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Utilization Display */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-5xl font-bold text-[var(--ocean)]">{result.volumeUtilization.toFixed(0)}%</p>
                    <p className="text-sm text-muted-foreground">Space Utilized</p>
                  </div>

                  {/* Vehicle Label */}
                  <div className="absolute top-0 left-0 bg-[var(--ocean)]/10 p-2 rounded-br">
                    {vehicle.type === "truck" ? (
                      <Truck className="h-4 w-4 text-[var(--ocean)]" />
                    ) : (
                      <Container className="h-4 w-4 text-[var(--ocean)]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Below */}
              <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                  <p className="font-bold text-sm">{vehicle.name}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Capacity</p>
                  <p className="font-bold">{vehicle.capacity} m³</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Loaded</p>
                  <p className="font-bold">{result.totalVolume.toFixed(1)} m³</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Items</p>
                  <p className="font-bold">{result.placedCargo.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Load Sequence Tab */}
        <TabsContent value="sequence" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                Optimized Load Sequence
              </CardTitle>
              <CardDescription>Recommended order for loading cargo items</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {result.loadSequence.map((seq, index) => (
                    <div
                      key={seq.itemId}
                      className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--ocean)] flex items-center justify-center text-white font-bold">
                        {seq.sequence}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{seq.itemName}</p>
                        <p className="text-sm text-muted-foreground">{seq.reason}</p>
                      </div>
                      <Badge variant="outline">
                        {index < result.loadSequence.length / 3 ? "First" : 
                         index < (result.loadSequence.length * 2) / 3 ? "Middle" : "Last"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Compatibility Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-[var(--ocean)]" />
                Cargo Compatibility Check
              </CardTitle>
              <CardDescription>Analysis of potential cargo conflicts</CardDescription>
            </CardHeader>
            <CardContent>
              {result.compatibilityIssues.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-[var(--logistics)]/10 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-[var(--logistics)]" />
                  <div>
                    <p className="font-medium text-[var(--logistics)]">No Compatibility Issues</p>
                    <p className="text-sm text-muted-foreground">All cargo items are compatible for transport</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {result.compatibilityIssues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        issue.severity === "error" 
                          ? "bg-destructive/10 border border-destructive/20" 
                          : "bg-yellow-500/10 border border-yellow-500/20"
                      }`}
                    >
                      {issue.severity === "error" ? (
                        <AlertOctagon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${
                          issue.severity === "error" ? "text-destructive" : "text-yellow-600 dark:text-yellow-400"
                        }`}>
                          {issue.itemName1} ↔ {issue.itemName2}
                        </p>
                        <p className="text-sm text-muted-foreground">{issue.issue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-[var(--ocean)]/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Ruler className="h-4 w-4" /> Total Volume
                </p>
                <p className="text-2xl font-bold text-[var(--ocean)]">
                  {result.totalVolume.toFixed(2)} m³
                </p>
                <Progress value={result.volumeUtilization} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {result.volumeUtilization.toFixed(1)}% of capacity
                </p>
              </CardContent>
            </Card>

            <Card className="border-[var(--logistics)]/20">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Weight className="h-4 w-4" /> Total Weight
                </p>
                <p className="text-2xl font-bold text-[var(--logistics)]">
                  {(result.totalWeight / 1000).toFixed(2)}t
                </p>
                <Progress value={result.weightUtilization} className="mt-2 h-2 bg-[var(--logistics)]/20" />
                <p className="text-xs text-muted-foreground mt-1">
                  {result.weightUtilization.toFixed(1)}% of payload
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="h-4 w-4" /> Items Placed
                </p>
                <p className="text-2xl font-bold">{result.itemsPlaced}</p>
                <p className="text-xs text-muted-foreground mt-3">
                  Across {cargoItems.length} item types
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Layers3 className="h-4 w-4" /> Space Left
                </p>
                <p className="text-2xl font-bold">{Math.max(result.remainingVolume, 0).toFixed(1)} m³</p>
                <p className="text-xs text-muted-foreground mt-3">
                  {Math.max(result.remainingWeight / 1000, 0).toFixed(1)}t weight capacity
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Weight Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[var(--ocean)]" />
                Weight Distribution Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Front/Rear Distribution */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Front / Rear Balance</h4>
                  <div className="flex h-8 rounded-lg overflow-hidden bg-muted">
                    <div
                      className="bg-[var(--ocean)] flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${result.weightDistribution.frontPercentage}%` }}
                    >
                      {result.weightDistribution.frontPercentage.toFixed(0)}%
                    </div>
                    <div
                      className="bg-[var(--logistics)] flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${result.weightDistribution.rearPercentage}%` }}
                    >
                      {result.weightDistribution.rearPercentage.toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Front</span>
                    <span>Rear</span>
                  </div>
                </div>

                {/* Left/Right Distribution */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Left / Right Balance</h4>
                  <div className="flex h-8 rounded-lg overflow-hidden bg-muted">
                    <div
                      className="bg-amber-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${result.weightDistribution.leftPercentage}%` }}
                    >
                      {result.weightDistribution.leftPercentage.toFixed(0)}%
                    </div>
                    <div
                      className="bg-purple-500 flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${result.weightDistribution.rightPercentage}%` }}
                    >
                      {result.weightDistribution.rightPercentage.toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Left</span>
                    <span>Right</span>
                  </div>
                </div>
              </div>

              {result.weightDistribution.warning && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    {result.weightDistribution.warning}
                  </p>
                </div>
              )}

              {result.weightDistribution.isBalanced && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-[var(--logistics)]/10 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                  <p className="text-sm text-[var(--logistics)]">Weight distribution is well balanced</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts */}
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
                    <BarChart data={utilizationData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
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
                  <PieChart className="h-5 w-5 text-[var(--ocean)]" />
                  Space Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={spaceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)} m³`}
                      >
                        {spaceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} m³`} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendation */}
          <Card className={`border-${result.warningLevel === "danger" ? "destructive" : result.warningLevel === "caution" ? "yellow-500" : "[var(--logistics)]"}/20`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.warningLevel === "danger" ? (
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                ) : result.warningLevel === "caution" ? (
                  <Info className="h-5 w-5 text-yellow-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                )}
                Optimization Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-lg ${getWarningColor(result.warningLevel)}`}>
                {result.recommendation}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Remaining Volume</p>
                  <p className="text-xl font-bold">{Math.max(result.remainingVolume, 0).toFixed(2)} m³</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Remaining Weight</p>
                  <p className="text-xl font-bold">{Math.max(result.remainingWeight / 1000, 0).toFixed(2)}t</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cargo Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Dimensions</th>
                      <th className="text-right py-2">Total Vol.</th>
                      <th className="text-right py-2">Total Wt.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cargoItems.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 font-medium">{item.name}</td>
                        <td className="py-2">
                          <Badge variant="outline">{CARGO_TYPES[item.cargoType].name}</Badge>
                        </td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">
                          {item.length}×{item.width}×{item.height}m
                        </td>
                        <td className="text-right text-[var(--ocean)]">
                          {(item.length * item.width * item.height * item.quantity).toFixed(2)} m³
                        </td>
                        <td className="text-right text-[var(--logistics)]">
                          {(item.weight * item.quantity).toFixed(1)} {weightUnit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-muted/50">
                      <td className="py-2">Total</td>
                      <td></td>
                      <td className="text-right">{result.itemsPlaced}</td>
                      <td></td>
                      <td className="text-right text-[var(--ocean)]">{result.totalVolume.toFixed(2)} m³</td>
                      <td className="text-right text-[var(--logistics)]">{result.totalWeight.toFixed(1)} {weightUnit}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => {
          setCargoItems([{
            id: "1",
            name: "Electronics Boxes",
            cargoType: "fragile",
            length: 0.6,
            width: 0.4,
            height: 0.4,
            weight: 25,
            quantity: 20,
            stackable: false,
            stackLimit: 1,
            priority: "high",
            rotation: true,
          }]);
        }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="gradient-ocean text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
