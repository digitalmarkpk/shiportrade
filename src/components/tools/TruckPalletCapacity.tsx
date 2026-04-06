"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Package,
  Ruler,
  Calculator,
  Info,
  AlertTriangle,
  Grid3X3,
  ArrowRight,
  CheckCircle2,
  Weight,
  Layers,
  LayoutGrid,
  Gauge,
  Box,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants/chartColors";

// Truck Types with detailed specifications
const truckTypes: Record<string, {
  name: string;
  length: number; // meters
  width: number; // meters
  height: number; // meters
  maxPayload: number; // kg
  tareWeight: number; // kg
  description: string;
}> = {
  "solo_7_5t": {
    name: "Solo 7.5t",
    length: 7.0,
    width: 2.4,
    height: 2.4,
    maxPayload: 3000,
    tareWeight: 4500,
    description: "Small delivery truck, ideal for urban deliveries",
  },
  "solo_12t": {
    name: "Solo 12t",
    length: 8.0,
    width: 2.4,
    height: 2.6,
    maxPayload: 5500,
    tareWeight: 6500,
    description: "Medium rigid truck for regional distribution",
  },
  "solo_18t": {
    name: "Solo 18t",
    length: 9.0,
    width: 2.4,
    height: 2.7,
    maxPayload: 9000,
    tareWeight: 9000,
    description: "Large rigid truck for national distribution",
  },
  "solo_26t": {
    name: "Solo 26t",
    length: 10.0,
    width: 2.4,
    height: 2.7,
    maxPayload: 14000,
    tareWeight: 12000,
    description: "Maximum weight rigid truck",
  },
  "articulated_40t": {
    name: "Articulated 40t (13.6m)",
    length: 13.6,
    width: 2.4,
    height: 2.7,
    maxPayload: 25000,
    tareWeight: 15000,
    description: "Standard semi-trailer, most common in Europe",
  },
  "mega_trailer": {
    name: "Mega Trailer",
    length: 13.6,
    width: 2.48,
    height: 3.0,
    maxPayload: 25000,
    tareWeight: 15000,
    description: "High cube trailer for voluminous cargo",
  },
  "jumbo": {
    name: "Jumbo Trailer",
    length: 13.6,
    width: 2.48,
    height: 3.0,
    maxPayload: 26000,
    tareWeight: 14000,
    description: "Extra payload capacity with lightweight design",
  },
  "curtain_sider": {
    name: "Curtain Sider",
    length: 13.6,
    width: 2.48,
    height: 2.7,
    maxPayload: 24000,
    tareWeight: 16000,
    description: "Side-loading capability for easy access",
  },
  "box_truck": {
    name: "Box Truck",
    length: 13.6,
    width: 2.45,
    height: 2.6,
    maxPayload: 24000,
    tareWeight: 16000,
    description: "Enclosed body for weather protection",
  },
  "double_deck": {
    name: "Double Deck Trailer",
    length: 13.6,
    width: 2.48,
    height: 4.0,
    maxPayload: 22000,
    tareWeight: 18000,
    description: "Two levels for maximum pallet capacity",
  },
};

// Pallet Types
const palletPresets: Record<string, {
  name: string;
  length: number; // cm
  width: number; // cm
  height: number; // cm
  description: string;
}> = {
  "euro": {
    name: "Euro Pallet (1200×800)",
    length: 120,
    width: 80,
    height: 15,
    description: "Standard European pallet, widely used in Europe",
  },
  "industrial": {
    name: "Industrial Pallet (1200×1000)",
    length: 120,
    width: 100,
    height: 15,
    description: "Larger pallet for heavier goods",
  },
  "us": {
    name: "US Pallet (48×40 in)",
    length: 122,
    width: 102,
    height: 15,
    description: "North American standard (GMA pallet)",
  },
  "asia": {
    name: "Asian Pallet (1100×1100)",
    length: 110,
    width: 110,
    height: 15,
    description: "Square pallet common in Asia",
  },
  "half_euro": {
    name: "Half Euro (800×600)",
    length: 80,
    width: 60,
    height: 15,
    description: "Half-size Euro pallet for smaller loads",
  },
  "custom": {
    name: "Custom Dimensions",
    length: 100,
    width: 100,
    height: 15,
    description: "Enter your own pallet dimensions",
  },
};

interface PalletPosition {
  x: number;
  y: number;
  rotated: boolean;
  row: number;
  col: number;
}

interface CalculationResult {
  maxPalletsVolume: number;
  maxPalletsWeight: number;
  actualMaxPallets: number;
  limitingFactor: "volume" | "weight";
  floorSpaceUsed: number; // m²
  floorSpaceTotal: number; // m²
  utilizationPercent: number;
  totalWeight: number;
  weightUtilization: number;
  palletPositions: PalletPosition[];
  arrangement: {
    rowsLengthwise: number;
    colsWidthwise: number;
    orientation: string;
  };
  canStack: boolean;
  stackHeight: number;
  totalStackedPallets: number;
  remainingSpace: {
    length: number;
    width: number;
  };
}

export function TruckPalletCapacity() {
  const [truckType, setTruckType] = useState<string>("articulated_40t");
  const [palletType, setPalletType] = useState<string>("euro");
  const [customLength, setCustomLength] = useState<string>("100");
  const [customWidth, setCustomWidth] = useState<string>("100");
  const [customHeight, setCustomHeight] = useState<string>("15");
  const [palletWeight, setPalletWeight] = useState<string>("500");
  const [stackable, setStackable] = useState<boolean>(false);
  const [stackHeight, setStackHeight] = useState<number>(2);
  const [weightUnit, setWeightUnit] = useState<string>("kg");

  const selectedTruck = truckTypes[truckType];
  const selectedPallet = palletPresets[palletType];

  // Get actual pallet dimensions
  const palletLength = palletType === "custom" ? parseFloat(customLength) || 100 : selectedPallet.length;
  const palletWidth = palletType === "custom" ? parseFloat(customWidth) || 100 : selectedPallet.width;
  const palletHeight = palletType === "custom" ? parseFloat(customHeight) || 15 : selectedPallet.height;

  // Convert weight to kg
  const weightPerPallet = useMemo(() => {
    const weight = parseFloat(palletWeight) || 0;
    if (weightUnit === "lb") return weight * 0.453592;
    if (weightUnit === "t") return weight * 1000;
    return weight;
  }, [palletWeight, weightUnit]);

  // Calculate optimal pallet arrangement
  const calculation = useMemo<CalculationResult>(() => {
    const truck = selectedTruck;
    
    // Pallet dimensions in meters
    const pLength = palletLength / 100;
    const pWidth = palletWidth / 100;
    const pHeight = palletHeight / 100;
    
    // Truck internal dimensions (account for clearance)
    const clearance = 0.05; // 5cm clearance
    const truckLength = truck.length - clearance;
    const truckWidth = truck.width - clearance;
    const truckHeight = truck.height - clearance;
    
    // Calculate pallets that fit - try both orientations
    // Orientation 1: pallets lengthwise along truck length
    const lengthwiseLength = Math.floor(truckLength / pLength);
    const lengthwiseWidth = Math.floor(truckWidth / pWidth);
    const countOrientation1 = lengthwiseLength * lengthwiseWidth;
    
    // Orientation 2: pallets rotated 90 degrees
    const rotatedLength = Math.floor(truckLength / pWidth);
    const rotatedWidth = Math.floor(truckWidth / pLength);
    const countOrientation2 = rotatedLength * rotatedWidth;
    
    // Orientation 3: Mixed layout (some rotated)
    // Try placing pallets lengthwise and filling gaps with rotated
    const mixedLayoutLengthwise = Math.floor(truckLength / pLength);
    const remainingLength = truckLength - (mixedLayoutLengthwise * pLength);
    const canFitRotatedInGap = remainingLength >= pWidth ? Math.floor(truckWidth / pLength) : 0;
    
    // Orientation 4: Try alternating rows
    let bestCount = Math.max(countOrientation1, countOrientation2);
    let bestRows = 0;
    let bestCols = 0;
    let bestRotated = false;
    
    if (countOrientation1 >= countOrientation2) {
      bestRows = lengthwiseLength;
      bestCols = lengthwiseWidth;
      bestRotated = false;
    } else {
      bestRows = rotatedLength;
      bestCols = rotatedWidth;
      bestRotated = true;
    }
    
    // Try optimizing with row-by-row placement
    const positions: PalletPosition[] = [];
    let currentX = 0;
    let currentY = 0;
    let row = 0;
    let col = 0;
    
    // Simple greedy placement algorithm
    while (currentY + (bestRotated ? pLength : pWidth) <= truckWidth) {
      currentX = 0;
      col = 0;
      while (currentX + (bestRotated ? pWidth : pLength) <= truckLength) {
        positions.push({
          x: currentX,
          y: currentY,
          rotated: bestRotated,
          row,
          col,
        });
        currentX += bestRotated ? pWidth : pLength;
        col++;
      }
      currentY += bestRotated ? pLength : pWidth;
      row++;
    }
    
    const maxPalletsVolume = positions.length;
    
    // Calculate weight limit
    const maxPalletsWeight = Math.floor(truck.maxPayload / weightPerPallet);
    
    // Determine limiting factor
    const actualMaxPallets = Math.min(maxPalletsVolume, maxPalletsWeight);
    const limitingFactor = maxPalletsVolume <= maxPalletsWeight ? "volume" : "weight";
    
    // Floor space calculations
    const floorSpaceTotal = truckLength * truckWidth;
    const palletFloorArea = pLength * pWidth;
    const floorSpaceUsed = actualMaxPallets * palletFloorArea;
    const utilizationPercent = (floorSpaceUsed / floorSpaceTotal) * 100;
    
    // Weight calculations
    const totalWeight = actualMaxPallets * weightPerPallet;
    const weightUtilization = (totalWeight / truck.maxPayload) * 100;
    
    // Stacking calculations
    const maxStackLayers = stackable 
      ? Math.min(stackHeight, Math.floor(truckHeight / pHeight))
      : 1;
    const totalStackedPallets = actualMaxPallets * maxStackLayers;
    
    // Check if stacking is possible
    const canStack = stackable && pHeight > 0 && (truckHeight / pHeight) >= 2;
    
    // Remaining space
    const usedLength = (bestRotated ? pWidth : pLength) * Math.ceil(actualMaxPallets / Math.ceil(truckWidth / (bestRotated ? pLength : pWidth)));
    const usedWidth = (bestRotated ? pLength : pWidth) * Math.ceil(truckWidth / (bestRotated ? pLength : pWidth));
    
    return {
      maxPalletsVolume,
      maxPalletsWeight,
      actualMaxPallets,
      limitingFactor,
      floorSpaceUsed,
      floorSpaceTotal,
      utilizationPercent,
      totalWeight,
      weightUtilization,
      palletPositions: positions.slice(0, actualMaxPallets),
      arrangement: {
        rowsLengthwise: bestRows,
        colsWidthwise: bestCols,
        orientation: bestRotated ? "Rotated 90°" : "Standard",
      },
      canStack,
      stackHeight: maxStackLayers,
      totalStackedPallets,
      remainingSpace: {
        length: truckLength - usedLength,
        width: truckWidth - usedWidth,
      },
    };
  }, [selectedTruck, palletLength, palletWidth, palletHeight, weightPerPallet, stackable, stackHeight]);

  // Chart data
  const utilizationData = [
    { name: "Used", value: calculation.utilizationPercent, color: "CHART_COLORS.logistics" },
    { name: "Empty", value: 100 - calculation.utilizationPercent, color: "CHART_COLORS.muted" },
  ];

  const limitData = [
    {
      name: "Volume Limit",
      pallets: calculation.maxPalletsVolume,
      fill: "CHART_COLORS.ocean",
    },
    {
      name: "Weight Limit",
      pallets: calculation.maxPalletsWeight,
      fill: "CHART_COLORS.logistics",
    },
    {
      name: "Actual",
      pallets: calculation.actualMaxPallets,
      fill: "var(--accent)",
    },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="arrangement">Arrangement</TabsTrigger>
          <TabsTrigger value="comparison">Limits</TabsTrigger>
          <TabsTrigger value="visualization">3D View</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Truck Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[var(--ocean)]" />
                    Truck Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Truck Type</Label>
                    <Select value={truckType} onValueChange={setTruckType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(truckTypes).map(([key, truck]) => (
                          <SelectItem key={key} value={key}>
                            {truck.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">{selectedTruck.description}</p>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-[var(--ocean)]">{selectedTruck.length}m</div>
                        <div className="text-xs text-muted-foreground">Length</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-[var(--ocean)]">{selectedTruck.width}m</div>
                        <div className="text-xs text-muted-foreground">Width</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-[var(--ocean)]">{selectedTruck.height}m</div>
                        <div className="text-xs text-muted-foreground">Height</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-[var(--logistics)]">{(selectedTruck.maxPayload / 1000).toFixed(0)}t</div>
                        <div className="text-xs text-muted-foreground">Max Payload</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pallet Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--logistics)]" />
                    Pallet Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pallet Type</Label>
                    <Select value={palletType} onValueChange={setPalletType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(palletPresets).map(([key, pallet]) => (
                          <SelectItem key={key} value={key}>
                            {pallet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">{selectedPallet.description}</p>
                  </div>

                  {palletType === "custom" && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Length (cm)</Label>
                        <Input
                          type="number"
                          value={customLength}
                          onChange={(e) => setCustomLength(e.target.value)}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Width (cm)</Label>
                        <Input
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(e.target.value)}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height (cm)</Label>
                        <Input
                          type="number"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(e.target.value)}
                          placeholder="15"
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Weight per Pallet</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={palletWeight}
                          onChange={(e) => setPalletWeight(e.target.value)}
                          placeholder="500"
                          className="flex-1"
                        />
                        <Select value={weightUnit} onValueChange={setWeightUnit}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                            <SelectItem value="t">t</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Stackable</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Switch
                          checked={stackable}
                          onCheckedChange={setStackable}
                        />
                        {stackable && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setStackHeight(Math.max(2, stackHeight - 1))}
                              disabled={stackHeight <= 2}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold">{stackHeight}x</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setStackHeight(Math.min(5, stackHeight + 1))}
                              disabled={stackHeight >= 5}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pallet Preview */}
                  <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 border-2 border-[var(--logistics)] rounded flex items-center justify-center text-xs font-medium">
                        {(palletLength / 100).toFixed(1)}m
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                      <div className="text-sm">
                        <div className="font-medium">{palletLength} × {palletWidth} × {palletHeight} cm</div>
                        <div className="text-xs text-muted-foreground">{weightPerPallet.toFixed(0)} kg per pallet</div>
                      </div>
                    </div>
                    {stackable && (
                      <Badge className="gradient-logistics text-white">
                        <Layers className="h-3 w-3 mr-1" />
                        {stackHeight}x Stack
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card className={`overflow-hidden ${calculation.limitingFactor === "weight" ? "border-amber-500/30" : "border-[var(--logistics)]/20"}`}>
                <div className={`h-2 ${calculation.limitingFactor === "weight" ? "bg-amber-500" : "bg-[var(--logistics)]"}`} />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Capacity Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Max Pallets */}
                  <div className="text-center py-4">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-bold text-[var(--logistics)]"
                    >
                      {calculation.actualMaxPallets}
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">
                      Maximum Pallets
                    </div>
                    <Badge 
                      className={`mt-2 ${calculation.limitingFactor === "weight" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" : "gradient-logistics text-white"}`}
                    >
                      {calculation.limitingFactor === "weight" ? (
                        <>
                          <Weight className="h-4 w-4 mr-1" />
                          Weight Limited
                        </>
                      ) : (
                        <>
                          <Box className="h-4 w-4 mr-1" />
                          Volume Limited
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Stacking Info */}
                  {calculation.canStack && (
                    <div className="p-3 bg-[var(--logistics)]/10 rounded-lg text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Layers className="h-5 w-5 text-[var(--logistics)]" />
                        <span className="font-semibold text-[var(--logistics)]">
                          {calculation.totalStackedPallets} Total Pallets with {calculation.stackHeight}x Stacking
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Stacking {calculation.stackHeight} layers × {calculation.actualMaxPallets} floor positions
                      </p>
                    </div>
                  )}

                  {/* Utilization Bars */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <LayoutGrid className="h-4 w-4" />
                          Floor Space Utilization
                        </span>
                        <span className="font-medium">{calculation.utilizationPercent.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-[var(--ocean)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(calculation.utilizationPercent, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Weight className="h-4 w-4" />
                          Weight Utilization
                        </span>
                        <span className="font-medium">{calculation.weightUtilization.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full ${calculation.weightUtilization > 95 ? "bg-red-500" : calculation.weightUtilization > 80 ? "bg-amber-500" : "bg-[var(--logistics)]"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(calculation.weightUtilization, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-[var(--ocean)]">
                        {calculation.totalWeight.toFixed(0)} kg
                      </div>
                      <div className="text-xs text-muted-foreground">Total Cargo Weight</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-[var(--logistics)]">
                        {calculation.floorSpaceUsed.toFixed(1)} m²
                      </div>
                      <div className="text-xs text-muted-foreground">Floor Space Used</div>
                    </div>
                  </div>

                  {/* Limiting Factor Warning */}
                  {calculation.limitingFactor === "weight" && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-600 dark:text-amber-400">Weight Limitation Active</p>
                          <p className="text-muted-foreground">
                            You could fit {calculation.maxPalletsVolume} pallets by volume, but weight limits 
                            restrict you to {calculation.maxPalletsWeight} pallets.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Arrangement Info */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 text-[var(--ocean)]" />
                    Pallet Arrangement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold">{calculation.arrangement.rowsLengthwise}</div>
                      <div className="text-xs text-muted-foreground">Rows (length)</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold">{calculation.arrangement.colsWidthwise}</div>
                      <div className="text-xs text-muted-foreground">Cols (width)</div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold">{calculation.arrangement.orientation}</div>
                      <div className="text-xs text-muted-foreground">Orientation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Arrangement Tab */}
        <TabsContent value="arrangement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Grid3X3 className="h-5 w-5 text-[var(--ocean)]" />
                Truck Floor Plan - Pallet Positions
              </CardTitle>
              <CardDescription>
                Visual representation of optimal pallet arrangement on the truck floor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Floor Plan Visualization */}
                <div 
                  className="relative border-2 border-[var(--ocean)] rounded-lg overflow-hidden mx-auto"
                  style={{ 
                    width: "100%",
                    maxWidth: "800px",
                    aspectRatio: `${selectedTruck.length}/${selectedTruck.width}`,
                  }}
                >
                  {/* Truck interior */}
                  <div className="absolute inset-0 bg-muted/30">
                    {/* Pallet positions */}
                    {calculation.palletPositions.map((pos, index) => {
                      const pLength = (palletLength / 100) / selectedTruck.length * 100;
                      const pWidth = (palletWidth / 100) / selectedTruck.width * 100;
                      const pLengthRotated = (palletWidth / 100) / selectedTruck.length * 100;
                      const pWidthRotated = (palletLength / 100) / selectedTruck.width * 100;
                      
                      return (
                        <div
                          key={index}
                          className="absolute border border-[var(--logistics)] bg-[var(--logistics)]/20 hover:bg-[var(--logistics)]/40 transition-colors flex items-center justify-center text-xs font-medium"
                          style={{
                            left: `${(pos.x / selectedTruck.length) * 100}%`,
                            top: `${(pos.y / selectedTruck.width) * 100}%`,
                            width: pos.rotated ? `${pLengthRotated}%` : `${pLength}%`,
                            height: pos.rotated ? `${pWidthRotated}%` : `${pWidth}%`,
                          }}
                        >
                          {index + 1}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Truck cab indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-[var(--ocean)]/30 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-[var(--ocean)] rotate-90" />
                  </div>
                  
                  {/* Door indicator */}
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-muted-foreground/30" />
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 border border-[var(--logistics)] bg-[var(--logistics)]/20" />
                    <span className="text-muted-foreground">Pallet Position</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-[var(--ocean)]/30" />
                    <span className="text-muted-foreground">Cab (Front)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-muted-foreground/30" />
                    <span className="text-muted-foreground">Door (Rear)</span>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <div className="font-semibold text-[var(--ocean)]">{selectedTruck.length}m</div>
                    <div className="text-xs text-muted-foreground">Truck Length</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <div className="font-semibold text-[var(--ocean)]">{selectedTruck.width}m</div>
                    <div className="text-xs text-muted-foreground">Truck Width</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Arrangement Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Remaining Space Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Length unused:</span>
                    <span className="font-medium">{calculation.remainingSpace.length.toFixed(2)}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Width unused:</span>
                    <span className="font-medium">{calculation.remainingSpace.width.toFixed(2)}m</span>
                  </div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    {calculation.utilizationPercent > 90 
                      ? "Excellent utilization! Very little wasted space."
                      : calculation.utilizationPercent > 75
                        ? "Good utilization. Consider if remaining space is usable."
                        : "Moderate utilization. Review pallet arrangement or size."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Optimization Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {calculation.limitingFactor === "weight" && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>Consider lighter packaging to increase pallet count</span>
                    </li>
                  )}
                  {calculation.utilizationPercent < 80 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>Try a different pallet type for better fit</span>
                    </li>
                  )}
                  {!stackable && calculation.actualMaxPallets < 20 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>Enable stacking if your cargo allows it</span>
                    </li>
                  )}
                  {calculation.remainingSpace.length > 0.5 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <span>Consider mixing pallet sizes to fill gaps</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Volume vs Weight Limits</CardTitle>
                <CardDescription>Compare your pallet count against different constraints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={limitData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="pallets" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Floor Space Utilization</CardTitle>
                <CardDescription>How efficiently space is being used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={utilizationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {utilizationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? "#2E8B57" : "#e5e7eb"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center -mt-8">
                  <div className="text-3xl font-bold text-[var(--logistics)]">{calculation.utilizationPercent.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Space Utilization</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Limit Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Factor</th>
                      <th className="text-right py-3 px-4">Maximum</th>
                      <th className="text-right py-3 px-4">Current</th>
                      <th className="text-right py-3 px-4">Utilization</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        <Box className="h-4 w-4 text-[var(--ocean)]" />
                        Volume (pallets)
                      </td>
                      <td className="text-right py-3 px-4">{calculation.maxPalletsVolume}</td>
                      <td className="text-right py-3 px-4">{calculation.actualMaxPallets}</td>
                      <td className="text-right py-3 px-4">
                        {((calculation.actualMaxPallets / calculation.maxPalletsVolume) * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        {calculation.limitingFactor === "volume" ? (
                          <Badge className="bg-amber-100 text-amber-800">Limiting</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[var(--logistics)]">OK</Badge>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        <Weight className="h-4 w-4 text-[var(--logistics)]" />
                        Weight (pallets)
                      </td>
                      <td className="text-right py-3 px-4">{calculation.maxPalletsWeight}</td>
                      <td className="text-right py-3 px-4">{calculation.actualMaxPallets}</td>
                      <td className="text-right py-3 px-4">
                        {((calculation.actualMaxPallets / calculation.maxPalletsWeight) * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        {calculation.limitingFactor === "weight" ? (
                          <Badge className="bg-amber-100 text-amber-800">Limiting</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[var(--logistics)]">OK</Badge>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-[var(--ocean)]" />
                        Floor Space
                      </td>
                      <td className="text-right py-3 px-4">{calculation.floorSpaceTotal.toFixed(2)} m²</td>
                      <td className="text-right py-3 px-4">{calculation.floorSpaceUsed.toFixed(2)} m²</td>
                      <td className="text-right py-3 px-4">{calculation.utilizationPercent.toFixed(1)}%</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[var(--logistics)]">OK</Badge>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-[var(--logistics)]" />
                        Payload Weight
                      </td>
                      <td className="text-right py-3 px-4">{selectedTruck.maxPayload} kg</td>
                      <td className="text-right py-3 px-4">{calculation.totalWeight.toFixed(0)} kg</td>
                      <td className="text-right py-3 px-4">{calculation.weightUtilization.toFixed(1)}%</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className={calculation.weightUtilization > 95 ? "text-red-600 border-red-300" : "text-[var(--logistics)]"}>
                          {calculation.weightUtilization > 95 ? "Near Limit" : "OK"}
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visualization Tab */}
        <TabsContent value="visualization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Box className="h-5 w-5 text-[var(--ocean)]" />
                3D Truck View
              </CardTitle>
              <CardDescription>Side and top-down views of the loaded truck</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Side View */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Side View</h4>
                  <div className="relative h-32 border-2 border-[var(--ocean)] rounded-lg bg-muted/20 overflow-hidden">
                    {/* Ground line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/50" />
                    
                    {/* Wheels */}
                    <div className="absolute bottom-0 left-8 w-6 h-6 bg-muted-foreground rounded-full border-2 border-background" />
                    <div className="absolute bottom-0 right-16 w-6 h-6 bg-muted-foreground rounded-full border-2 border-background" />
                    <div className="absolute bottom-0 right-6 w-4 h-4 bg-muted-foreground rounded-full border-2 border-background" />
                    
                    {/* Pallets */}
                    <div className="absolute bottom-2 left-16 right-20 h-24 flex gap-0.5">
                      {Array.from({ length: Math.min(calculation.actualMaxPallets, 20) }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-[var(--logistics)]/30 border border-[var(--logistics)] rounded-sm"
                          style={{ height: stackable ? "100%" : "50%" }}
                        />
                      ))}
                    </div>
                    
                    {/* Cab */}
                    <div className="absolute bottom-1 left-0 w-12 h-20 bg-[var(--ocean)]/20 border-r-2 border-[var(--ocean)]" />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0m</span>
                    <span>{selectedTruck.length}m</span>
                  </div>
                </div>

                {/* Top View */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Top View</h4>
                  <div 
                    className="relative border-2 border-[var(--ocean)] rounded-lg bg-muted/20 mx-auto"
                    style={{ 
                      width: "100%",
                      maxWidth: "600px",
                      height: `${(selectedTruck.width / selectedTruck.length) * 600}px`,
                    }}
                  >
                    {/* Pallet grid */}
                    <div className="absolute inset-2 grid gap-0.5" 
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(calculation.actualMaxPallets, 10)}, 1fr)`,
                      }}
                    >
                      {Array.from({ length: calculation.actualMaxPallets }).map((_, i) => (
                        <div
                          key={i}
                          className="bg-[var(--logistics)]/30 border border-[var(--logistics)] rounded-sm flex items-center justify-center text-xs font-medium"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    
                    {/* Direction arrow */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs text-muted-foreground">
                      <ArrowRight className="h-4 w-4" />
                      <span>Direction of travel</span>
                    </div>
                  </div>
                </div>

                {/* Cross Section */}
                <div>
                  <h4 className="text-sm font-medium mb-3 text-muted-foreground">Cross Section (Front View)</h4>
                  <div 
                    className="relative border-2 border-[var(--ocean)] rounded-lg bg-muted/20 mx-auto"
                    style={{ 
                      width: "200px",
                      height: `${(selectedTruck.height / selectedTruck.width) * 200}px`,
                    }}
                  >
                    {/* Floor */}
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-muted-foreground/50" />
                    
                    {/* Pallets */}
                    <div className="absolute bottom-2 left-2 right-2 top-2 flex justify-center items-end gap-1">
                      {Array.from({ length: calculation.arrangement.colsWidthwise }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-[var(--logistics)]/30 border border-[var(--logistics)] rounded-t-sm"
                          style={{ 
                            height: stackable ? "100%" : `${(palletHeight / 100) / selectedTruck.height * 100}%`,
                            maxHeight: `${(palletHeight / 100) / selectedTruck.height * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
                    <span>0m</span>
                    <span>{selectedTruck.width}m</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6">
          {/* Pallet Types Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--ocean)]" />
                Standard Pallet Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-right py-3 px-4">Dimensions</th>
                      <th className="text-right py-3 px-4">Area</th>
                      <th className="text-right py-3 px-4">LDM</th>
                      <th className="text-left py-3 px-4">Common Use</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Euro Pallet</td>
                      <td className="text-right py-3 px-4">120×80×15 cm</td>
                      <td className="text-right py-3 px-4">0.96 m²</td>
                      <td className="text-right py-3 px-4">0.4 LDM</td>
                      <td className="py-3 px-4 text-muted-foreground">Europe, most common</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Industrial</td>
                      <td className="text-right py-3 px-4">120×100×15 cm</td>
                      <td className="text-right py-3 px-4">1.20 m²</td>
                      <td className="text-right py-3 px-4">0.5 LDM</td>
                      <td className="py-3 px-4 text-muted-foreground">Heavy industrial goods</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">US/GMA</td>
                      <td className="text-right py-3 px-4">122×102×15 cm</td>
                      <td className="text-right py-3 px-4">1.24 m²</td>
                      <td className="text-right py-3 px-4">0.51 LDM</td>
                      <td className="py-3 px-4 text-muted-foreground">North America</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Asian</td>
                      <td className="text-right py-3 px-4">110×110×15 cm</td>
                      <td className="text-right py-3 px-4">1.21 m²</td>
                      <td className="text-right py-3 px-4">0.46 LDM</td>
                      <td className="py-3 px-4 text-muted-foreground">Japan, Korea, Taiwan</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Half Euro</td>
                      <td className="text-right py-3 px-4">80×60×15 cm</td>
                      <td className="text-right py-3 px-4">0.48 m²</td>
                      <td className="text-right py-3 px-4">0.2 LDM</td>
                      <td className="py-3 px-4 text-muted-foreground">Small shipments</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Truck Types Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--logistics)]" />
                Truck Types Reference
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-right py-3 px-4">Length</th>
                      <th className="text-right py-3 px-4">Width</th>
                      <th className="text-right py-3 px-4">Height</th>
                      <th className="text-right py-3 px-4">Payload</th>
                      <th className="text-right py-3 px-4">Max Euro Pallets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(truckTypes).map(([key, truck]) => {
                      const maxEuroPallets = Math.floor((truck.length * truck.width) / (1.2 * 0.8));
                      return (
                        <tr key={key} className="border-b">
                          <td className="py-3 px-4 font-medium">{truck.name}</td>
                          <td className="text-right py-3 px-4">{truck.length}m</td>
                          <td className="text-right py-3 px-4">{truck.width}m</td>
                          <td className="text-right py-3 px-4">{truck.height}m</td>
                          <td className="text-right py-3 px-4">{(truck.maxPayload / 1000).toFixed(0)}t</td>
                          <td className="text-right py-3 px-4">{maxEuroPallets}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                Pallet Loading Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-[var(--logistics)]">Optimization Tips</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                      <span>Use the smallest pallet that fits your cargo to maximize floor space</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                      <span>Stack pallets when cargo stability and height allow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                      <span>Consider mixed pallet sizes to fill gaps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 shrink-0 text-[var(--logistics)]" />
                      <span>Use shrink wrap or strapping for stackable loads</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-500">Common Mistakes</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                      <span>Ignoring weight limits - can result in fines and safety issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                      <span>Overestimating stacking capability - cargo may shift in transit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                      <span>Not accounting for pallet overhang from packaging</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" />
                      <span>Forgetting to account for loading/unloading access space</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Educational Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-pallet-capacity">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[var(--ocean)]" />
              What is Truck Pallet Capacity?
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Truck pallet capacity refers to the maximum number of pallets that can be loaded onto a truck
                trailer, considering both physical space (volume) and weight limitations. Understanding this
                is crucial for:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Optimizing load planning and reducing transportation costs</li>
                <li>Ensuring compliance with legal weight limits</li>
                <li>Maximizing trailer utilization efficiency</li>
                <li>Planning multi-stop deliveries effectively</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="calculation-methods">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[var(--logistics)]" />
              How is Pallet Capacity Calculated?
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Volume-Based Calculation</h4>
                <div className="font-mono text-xs mb-2">
                  Max Pallets (Volume) = ⌊Truck Length / Pallet Length⌋ × ⌊Truck Width / Pallet Width⌋
                </div>
                <p>This gives the maximum pallets that physically fit on the floor.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Weight-Based Calculation</h4>
                <div className="font-mono text-xs mb-2">
                  Max Pallets (Weight) = ⌊Max Payload / Weight per Pallet⌋
                </div>
                <p>This gives the maximum pallets based on weight constraints.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Actual Capacity</h4>
                <div className="font-mono text-xs mb-2">
                  Actual Max Pallets = Min(Volume Limit, Weight Limit)
                </div>
                <p>The true capacity is the lower of the two limits.</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="stacking">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[var(--ocean)]" />
              When Should I Stack Pallets?
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Stacking pallets can double or triple your capacity, but it&apos;s not always appropriate:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                  <span><strong>Good for stacking:</strong> Stable goods, uniform boxes, shrink-wrapped loads, non-fragile items</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Avoid stacking:</strong> Fragile goods, liquids, irregular shapes, top-heavy items, crushable products</span>
                </li>
              </ul>
              <p className="text-xs">
                Always check height clearance and ensure your cargo can support the weight of pallets above.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
