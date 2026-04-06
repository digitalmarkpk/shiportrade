"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Package,
  TrendingUp,
  AlertCircle,
  Info,
  ArrowRight,
  DollarSign,
  BarChart3,
  Clock,
  Calendar,
  Warehouse,
  Scale,
  Ruler,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Amazon FBA Storage Rates by Marketplace (per cubic foot per month)
const storageRates = {
  US: {
    standard: { janSep: 0.87, octDec: 2.40 },
    oversize: { janSep: 0.56, octDec: 1.40 },
    extraOversize: { janSep: 0.43, octDec: 1.10 },
    currency: "USD",
    longTermThreshold: 365,
    longTermFee: 6.90, // per cubic foot or $0.15 per unit, whichever is greater
  },
  EU: {
    standard: { janSep: 0.75, octDec: 2.10 },
    oversize: { janSep: 0.50, octDec: 1.30 },
    extraOversize: { janSep: 0.40, octDec: 1.00 },
    currency: "EUR",
    longTermThreshold: 365,
    longTermFee: 6.50,
  },
  UK: {
    standard: { janSep: 0.65, octDec: 1.85 },
    oversize: { janSep: 0.45, octDec: 1.15 },
    extraOversize: { janSep: 0.35, octDec: 0.90 },
    currency: "GBP",
    longTermThreshold: 365,
    longTermFee: 5.80,
  },
  JP: {
    standard: { janSep: 95, octDec: 265 }, // in JPY
    oversize: { janSep: 65, octDec: 180 },
    extraOversize: { janSep: 50, octDec: 140 },
    currency: "JPY",
    longTermThreshold: 365,
    longTermFee: 850,
  },
};

// Size tier boundaries (in inches and lbs)
const sizeTierBoundaries = {
  US: {
    standard: {
      longestSide: 18,
      medianSide: 14,
      shortestSide: 8,
      weight: 20,
    },
    oversize: {
      longestSide: 108,
      longestSideGirth: 165, // longest side + girth
      weight: 150,
    },
    extraOversize: {
      longestSide: 108,
      longestSideGirth: 205,
      weight: 150,
    },
  },
  EU: {
    standard: {
      longestSide: 45, // cm
      medianSide: 34,
      shortestSide: 26,
      weight: 12, // kg
    },
    oversize: {
      longestSide: 270,
      longestSideGirth: 419,
      weight: 68,
    },
    extraOversize: {
      longestSide: 270,
      longestSideGirth: 520,
      weight: 68,
    },
  },
  UK: {
    standard: {
      longestSide: 45,
      medianSide: 34,
      shortestSide: 26,
      weight: 12,
    },
    oversize: {
      longestSide: 270,
      longestSideGirth: 419,
      weight: 68,
    },
    extraOversize: {
      longestSide: 270,
      longestSideGirth: 520,
      weight: 68,
    },
  },
  JP: {
    standard: {
      longestSide: 45,
      medianSide: 34,
      shortestSide: 26,
      weight: 12,
    },
    oversize: {
      longestSide: 270,
      longestSideGirth: 419,
      weight: 68,
    },
    extraOversize: {
      longestSide: 270,
      longestSideGirth: 520,
      weight: 68,
    },
  },
};

// Peak season dates
const peakSeason = {
  startMonth: 10, // October
  endMonth: 12,   // December
};

type Marketplace = keyof typeof storageRates;
type SizeTier = "standard" | "oversize" | "extraOversize";
type DimensionUnit = "in" | "cm";
type WeightUnit = "lbs" | "kg";

interface FBAStorageInputs {
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  storageDuration: number; // months
  inventoryAge: number; // days
  marketplace: Marketplace;
  dimensionUnit: DimensionUnit;
  weightUnit: WeightUnit;
  isQ4Storage: boolean;
}

interface StorageFeeBreakdown {
  monthlyStorage: number;
  peakSeasonStorage: number;
  longTermStorage: number;
  totalStorage: number;
  cubicFeet: number;
  sizeTier: SizeTier;
  averageMonthlyCost: number;
  costPerUnit: number;
}

// Convert cm to inches
function cmToInches(cm: number): number {
  return cm / 2.54;
}

// Convert kg to lbs
function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

// Convert inches to feet
function inchesToFeet(inches: number): number {
  return inches / 12;
}

// Calculate cubic feet
function calculateCubicFeet(lengthIn: number, widthIn: number, heightIn: number): number {
  return (lengthIn * widthIn * heightIn) / 1728; // 1728 = 12^3
}

// Determine size tier
function determineSizeTier(
  length: number,
  width: number,
  height: number,
  weight: number,
  marketplace: Marketplace,
  dimensionUnit: DimensionUnit,
  weightUnit: WeightUnit
): SizeTier {
  // Convert to inches/lbs if needed
  const lengthIn = dimensionUnit === "cm" ? cmToInches(length) : length;
  const widthIn = dimensionUnit === "cm" ? cmToInches(width) : width;
  const heightIn = dimensionUnit === "cm" ? cmToInches(height) : height;
  const weightLbs = weightUnit === "kg" ? kgToLbs(weight) : weight;

  const longestSide = Math.max(lengthIn, widthIn, heightIn);
  const shortestSide = Math.min(lengthIn, widthIn, heightIn);
  const sides = [lengthIn, widthIn, heightIn].sort((a, b) => a - b);
  const medianSide = sides[1];
  const girth = 2 * (widthIn + heightIn);
  const longestSideGirth = longestSide + girth;

  const boundaries = sizeTierBoundaries.US; // Use US as reference for size tiers

  // Check Extra Oversize first
  if (
    longestSide > boundaries.extraOversize.longestSide ||
    longestSideGirth > boundaries.extraOversize.longestSideGirth ||
    weightLbs > boundaries.extraOversize.weight
  ) {
    return "extraOversize";
  }

  // Check Oversize
  if (
    longestSide > boundaries.oversize.longestSide ||
    longestSideGirth > boundaries.oversize.longestSideGirth ||
    weightLbs > boundaries.oversize.weight
  ) {
    return "oversize";
  }

  // Check Standard
  if (
    longestSide > boundaries.standard.longestSide ||
    medianSide > boundaries.standard.medianSide ||
    shortestSide > boundaries.standard.shortestSide ||
    weightLbs > boundaries.standard.weight
  ) {
    return "oversize";
  }

  return "standard";
}

// Calculate storage fees
function calculateStorageFees(inputs: FBAStorageInputs): StorageFeeBreakdown {
  // Convert dimensions to inches for cubic feet calculation
  const lengthIn = inputs.dimensionUnit === "cm" ? cmToInches(inputs.length) : inputs.length;
  const widthIn = inputs.dimensionUnit === "cm" ? cmToInches(inputs.width) : inputs.width;
  const heightIn = inputs.dimensionUnit === "cm" ? cmToInches(inputs.height) : inputs.height;

  // Calculate cubic feet
  const cubicFeet = calculateCubicFeet(lengthIn, widthIn, heightIn);
  const totalCubicFeet = cubicFeet * inputs.quantity;

  // Determine size tier
  const sizeTier = determineSizeTier(
    inputs.length,
    inputs.width,
    inputs.height,
    inputs.weight,
    inputs.marketplace,
    inputs.dimensionUnit,
    inputs.weightUnit
  );

  // Get rates for marketplace and size tier
  const marketplaceRates = storageRates[inputs.marketplace];
  const tierRates = marketplaceRates[sizeTier];

  // Calculate monthly storage fee
  const monthlyRate = inputs.isQ4Storage ? tierRates.octDec : tierRates.janSep;
  const monthlyStorageFee = totalCubicFeet * monthlyRate;

  // Calculate peak season adjustment
  const peakMonths = inputs.isQ4Storage ? inputs.storageDuration : 0;
  const nonPeakMonths = inputs.isQ4Storage ? 0 : inputs.storageDuration;

  const peakSeasonStorage = totalCubicFeet * tierRates.octDec * peakMonths;
  const monthlyStorage = totalCubicFeet * tierRates.janSep * nonPeakMonths;

  // Calculate long-term storage fee (if applicable)
  let longTermStorage = 0;
  if (inputs.inventoryAge > marketplaceRates.longTermThreshold) {
    // Long-term storage fee: minimum of $6.90 per cubic foot or $0.15 per unit
    const feeByVolume = totalCubicFeet * marketplaceRates.longTermFee;
    const feeByUnit = inputs.quantity * 0.15;
    longTermStorage = Math.max(feeByVolume, feeByUnit);
  }

  const totalStorage = monthlyStorage + peakSeasonStorage + longTermStorage;
  const averageMonthlyCost = inputs.storageDuration > 0 ? totalStorage / inputs.storageDuration : 0;
  const costPerUnit = inputs.quantity > 0 ? totalStorage / inputs.quantity : 0;

  return {
    monthlyStorage,
    peakSeasonStorage,
    longTermStorage,
    totalStorage,
    cubicFeet: totalCubicFeet,
    sizeTier,
    averageMonthlyCost,
    costPerUnit,
  };
}

export function FBAStorageFeeEstimator() {
  const [activeTab, setActiveTab] = useState("calculator");

  const [inputs, setInputs] = useState<FBAStorageInputs>({
    length: 10,
    width: 8,
    height: 6,
    weight: 2,
    quantity: 100,
    storageDuration: 3,
    inventoryAge: 180,
    marketplace: "US",
    dimensionUnit: "in",
    weightUnit: "lbs",
    isQ4Storage: false,
  });

  const results = useMemo(() => calculateStorageFees(inputs), [inputs]);

  const updateInput = <K extends keyof FBAStorageInputs>(field: K, value: FBAStorageInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Cost breakdown data for pie chart
  const costBreakdownData = useMemo(() => {
    const data = [];
    if (results.monthlyStorage > 0) {
      data.push({ name: "Monthly Storage", value: results.monthlyStorage, color: "#0F4C81" });
    }
    if (results.peakSeasonStorage > 0) {
      data.push({ name: "Peak Season", value: results.peakSeasonStorage, color: "#2E8B57" });
    }
    if (results.longTermStorage > 0) {
      data.push({ name: "Long-Term", value: results.longTermStorage, color: "#F59E0B" });
    }
    return data;
  }, [results]);

  // Monthly projection data
  const monthlyProjectionData = useMemo(() => {
    const marketplaceRates = storageRates[inputs.marketplace];
    const tierRates = marketplaceRates[results.sizeTier];
    const cubicFeetPerUnit = results.cubicFeet / inputs.quantity;

    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const isPeakMonth = month >= peakSeason.startMonth && month <= peakSeason.endMonth;
      const rate = isPeakMonth ? tierRates.octDec : tierRates.janSep;
      const monthlyCost = cubicFeetPerUnit * inputs.quantity * rate;

      return {
        month: new Date(2024, i).toLocaleString("default", { month: "short" }),
        cost: monthlyCost,
        isPeak: isPeakMonth,
        rate,
      };
    });
  }, [inputs, results]);

  // Size tier comparison data
  const sizeTierComparisonData = useMemo(() => {
    const marketplaceRates = storageRates[inputs.marketplace];
    const cubicFeetPerUnit = results.cubicFeet / inputs.quantity;

    return ["standard", "oversize", "extraOversize"].map((tier) => {
      const tierRates = marketplaceRates[tier as SizeTier];
      const avgRate = (tierRates.janSep * 9 + tierRates.octDec * 3) / 12;
      return {
        tier: tier === "standard" ? "Standard" : tier === "oversize" ? "Oversize" : "Extra Oversize",
        avgMonthly: cubicFeetPerUnit * inputs.quantity * avgRate,
        peakMonthly: cubicFeetPerUnit * inputs.quantity * tierRates.octDec,
        nonPeakMonthly: cubicFeetPerUnit * inputs.quantity * tierRates.janSep,
        isCurrent: tier === results.sizeTier,
      };
    });
  }, [inputs, results]);

  // Fee timeline data
  const feeTimelineData = useMemo(() => {
    const data = [];
    let cumulativeCost = 0;
    const cubicFeetPerUnit = results.cubicFeet / inputs.quantity;
    const marketplaceRates = storageRates[inputs.marketplace];
    const tierRates = marketplaceRates[results.sizeTier];

    for (let day = 0; day <= Math.max(inputs.storageDuration * 30, inputs.inventoryAge); day += 30) {
      const month = Math.floor(day / 30);
      let monthlyCost = cubicFeetPerUnit * inputs.quantity * tierRates.janSep;

      // Check if this month falls in peak season
      const simulatedMonth = ((new Date().getMonth() + month) % 12) + 1;
      if (simulatedMonth >= peakSeason.startMonth && simulatedMonth <= peakSeason.endMonth) {
        monthlyCost = cubicFeetPerUnit * inputs.quantity * tierRates.octDec;
      }

      // Add long-term fee at 365 days
      if (day >= marketplaceRates.longTermThreshold && day < marketplaceRates.longTermThreshold + 30) {
        monthlyCost += marketplaceRates.longTermFee * results.cubicFeet;
      }

      cumulativeCost += monthlyCost;

      data.push({
        day,
        month,
        monthlyCost,
        cumulativeCost,
        isLongTerm: day >= marketplaceRates.longTermThreshold,
      });
    }

    return data;
  }, [inputs, results]);

  const formatMoney = (value: number) => {
    const currency = storageRates[inputs.marketplace].currency;
    return formatCurrency(value, currency);
  };

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    peak: "#DC2626",
    nonPeak: "#3B82F6",
  };

  const resetCalculator = () => {
    setInputs({
      length: 10,
      width: 8,
      height: 6,
      weight: 2,
      quantity: 100,
      storageDuration: 3,
      inventoryAge: 180,
      marketplace: "US",
      dimensionUnit: "in",
      weightUnit: "lbs",
      isQ4Storage: false,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Product Details
                  </CardTitle>
                  <CardDescription>
                    Enter product dimensions and weight
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Marketplace */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Marketplace
                    </Label>
                    <Select
                      value={inputs.marketplace}
                      onValueChange={(v) => updateInput("marketplace", v as Marketplace)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States (USD)</SelectItem>
                        <SelectItem value="EU">Europe (EUR)</SelectItem>
                        <SelectItem value="UK">United Kingdom (GBP)</SelectItem>
                        <SelectItem value="JP">Japan (JPY)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Dimensions
                    </Label>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Length</Label>
                          <Input
                            type="number"
                            value={inputs.length}
                            onChange={(e) => updateInput("length", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Width</Label>
                          <Input
                            type="number"
                            value={inputs.width}
                            onChange={(e) => updateInput("width", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Height</Label>
                          <Input
                            type="number"
                            value={inputs.height}
                            onChange={(e) => updateInput("height", parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                      <Select
                        value={inputs.dimensionUnit}
                        onValueChange={(v) => updateInput("dimensionUnit", v as DimensionUnit)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in">in</SelectItem>
                          <SelectItem value="cm">cm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Scale className="h-4 w-4" />
                      Product Weight
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={inputs.weight}
                        onChange={(e) => updateInput("weight", parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <Select
                        value={inputs.weightUnit}
                        onValueChange={(v) => updateInput("weightUnit", v as WeightUnit)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Size Tier Badge */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Size Tier:</span>
                    <Badge
                      variant={
                        results.sizeTier === "standard"
                          ? "default"
                          : results.sizeTier === "oversize"
                          ? "secondary"
                          : "destructive"
                      }
                      className={
                        results.sizeTier === "standard"
                          ? "bg-[var(--logistics)]"
                          : results.sizeTier === "oversize"
                          ? "bg-[var(--ocean)]"
                          : ""
                      }
                    >
                      {results.sizeTier === "extraOversize"
                        ? "Extra Oversize"
                        : results.sizeTier.charAt(0).toUpperCase() + results.sizeTier.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-[var(--logistics)]" />
                    Inventory Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity in FBA</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={inputs.quantity}
                      onChange={(e) => updateInput("quantity", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Storage Duration */}
                  <div className="space-y-2">
                    <Label>Storage Duration (months)</Label>
                    <div className="pt-2">
                      <Slider
                        value={[inputs.storageDuration]}
                        onValueChange={(v) => updateInput("storageDuration", v[0])}
                        min={1}
                        max={24}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1 month</span>
                        <span className="font-medium text-[var(--ocean)]">{inputs.storageDuration} months</span>
                        <span>24 months</span>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Age */}
                  <div className="space-y-2">
                    <Label htmlFor="inventoryAge">Current Inventory Age (days)</Label>
                    <Input
                      id="inventoryAge"
                      type="number"
                      value={inputs.inventoryAge}
                      onChange={(e) => updateInput("inventoryAge", parseInt(e.target.value) || 0)}
                    />
                    {inputs.inventoryAge > 270 && inputs.inventoryAge < 365 && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Long-term storage fee approaching at 365 days
                      </p>
                    )}
                    {inputs.inventoryAge >= 365 && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Long-term storage fees apply!
                      </p>
                    )}
                  </div>

                  {/* Q4 Storage Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Peak Season Storage (Q4)</Label>
                      <p className="text-xs text-muted-foreground">Oct-Dec storage has higher rates</p>
                    </div>
                    <Switch
                      checked={inputs.isQ4Storage}
                      onCheckedChange={(v) => updateInput("isQ4Storage", v)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Storage Fee Estimate
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Total Storage Cost */}
                  <motion.div
                    key={results.totalStorage}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-6 rounded-xl bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--logistics)]/10"
                  >
                    <div className="text-sm text-muted-foreground mb-1">Total Estimated Storage Cost</div>
                    <div className="text-4xl font-bold text-[var(--ocean)]">
                      {formatMoney(results.totalStorage)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      for {inputs.storageDuration} months
                    </div>
                  </motion.div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Volume</div>
                      <div className="text-xl font-bold">{results.cubicFeet.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">cubic ft</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Monthly Avg</div>
                      <div className="text-xl font-bold">{formatMoney(results.averageMonthlyCost)}</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Per Unit</div>
                      <div className="text-xl font-bold">{formatMoney(results.costPerUnit)}</div>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Fee Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Storage</span>
                        <span className="font-medium">{formatMoney(results.monthlyStorage)}</span>
                      </div>
                      {inputs.isQ4Storage && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Peak Season (Q4)</span>
                          <span className="font-medium text-amber-600">{formatMoney(results.peakSeasonStorage)}</span>
                        </div>
                      )}
                      {results.longTermStorage > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Long-Term Storage</span>
                          <span className="font-medium text-destructive">{formatMoney(results.longTermStorage)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-[var(--ocean)]">{formatMoney(results.totalStorage)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown Pie Chart */}
                  {costBreakdownData.length > 0 && (
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatMoney(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Warnings */}
              {inputs.inventoryAge >= 365 && (
                <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                      <div className="text-sm text-red-700 dark:text-red-300">
                        <p className="font-semibold mb-1">Long-Term Storage Fee Warning</p>
                        <p>
                          Your inventory has exceeded the 365-day threshold. Long-term storage fees 
                          of {formatMoney(storageRates[inputs.marketplace].longTermFee)}/cubic foot 
                          will be charged on the 15th of each month until inventory is reduced.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {results.sizeTier !== "standard" && (
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        <p className="font-semibold mb-1">Oversize Product</p>
                        <p>
                          This product qualifies as {results.sizeTier === "extraOversize" ? "Extra Oversize" : "Oversize"}. 
                          Consider optimizing packaging to potentially reduce to a smaller tier and save on storage costs.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Monthly Cost Projection
              </CardTitle>
              <CardDescription>
                Projected storage costs throughout the year based on current inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyProjectionData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => formatMoney(v)} />
                    <Tooltip
                      formatter={(value: number) => formatMoney(value)}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="cost"
                      name="Monthly Cost"
                      fill={chartColors.ocean}
                      radius={[4, 4, 0, 0]}
                    >
                      {monthlyProjectionData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isPeak ? chartColors.peak : chartColors.ocean}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.ocean }} />
                  <span className="text-sm text-muted-foreground">Non-Peak (Jan-Sep)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.peak }} />
                  <span className="text-sm text-muted-foreground">Peak Season (Oct-Dec)</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Peak Season Impact</h4>
                <p className="text-sm text-muted-foreground">
                  During Q4 (October-December), storage fees increase by approximately{" "}
                  {((storageRates[inputs.marketplace][results.sizeTier].octDec / 
                    storageRates[inputs.marketplace][results.sizeTier].janSep - 1) * 100).toFixed(0)}%. 
                  Plan inventory levels carefully to minimize peak season costs.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Size Tier Comparison
              </CardTitle>
              <CardDescription>
                Compare storage costs across different size tiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sizeTierComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => formatMoney(v)} />
                    <YAxis dataKey="tier" type="category" width={100} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Legend />
                    <Bar dataKey="nonPeakMonthly" name="Non-Peak Monthly" fill={chartColors.nonPeak} />
                    <Bar dataKey="peakMonthly" name="Peak Monthly" fill={chartColors.peak} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Size Tier</th>
                      <th className="text-right py-3 px-4">Non-Peak Monthly</th>
                      <th className="text-right py-3 px-4">Peak Monthly</th>
                      <th className="text-right py-3 px-4">Annual Estimate</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeTierComparisonData.map((row) => (
                      <tr
                        key={row.tier}
                        className={`border-b ${row.isCurrent ? "bg-[var(--logistics)]/10" : ""}`}
                      >
                        <td className="py-3 px-4 font-medium">{row.tier}</td>
                        <td className="text-right py-3 px-4">{formatMoney(row.nonPeakMonthly)}</td>
                        <td className="text-right py-3 px-4">{formatMoney(row.peakMonthly)}</td>
                        <td className="text-right py-3 px-4 font-medium">
                          {formatMoney((row.nonPeakMonthly * 9 + row.peakMonthly * 3))}
                        </td>
                        <td className="text-center py-3 px-4">
                          {row.isCurrent ? (
                            <Badge className="bg-[var(--logistics)]">Current</Badge>
                          ) : (
                            <Badge variant="outline">-</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Size Tier Classification Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="standard">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--logistics)]">Standard</Badge>
                      <span>Small to medium products</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Requirements:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Longest side ≤ 18 inches</li>
                        <li>Median side ≤ 14 inches</li>
                        <li>Shortest side ≤ 8 inches</li>
                        <li>Weight ≤ 20 lbs</li>
                      </ul>
                      <p className="mt-2">
                        <strong>Examples:</strong> Books, electronics, small appliances, clothing items
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="oversize">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[var(--ocean)]">Oversize</Badge>
                      <span>Large products exceeding standard limits</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Exceeds Standard limits AND:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Longest side ≤ 108 inches</li>
                        <li>Longest side + girth ≤ 165 inches</li>
                        <li>Weight ≤ 150 lbs</li>
                      </ul>
                      <p className="mt-2">
                        <strong>Examples:</strong> Furniture, large electronics, exercise equipment, rugs
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="extraOversize">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Extra Oversize</Badge>
                      <span>Very large or heavy items</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Exceeds Oversize limits:</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Longest side &gt; 108 inches, OR</li>
                        <li>Longest side + girth &gt; 165 inches, OR</li>
                        <li>Weight &gt; 150 lbs</li>
                      </ul>
                      <p className="mt-2">
                        <strong>Examples:</strong> Large furniture, appliances, industrial equipment
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--ocean)]" />
                Storage Fee Timeline
              </CardTitle>
              <CardDescription>
                Track cumulative storage costs over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={feeTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="day"
                      label={{ value: "Days in Storage", position: "bottom", offset: -5 }}
                    />
                    <YAxis tickFormatter={(v) => formatMoney(v)} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatMoney(value),
                        name === "cumulativeCost" ? "Cumulative Cost" : "Monthly Cost"
                      ]}
                    />
                    <ReferenceLine
                      x={storageRates[inputs.marketplace].longTermThreshold}
                      stroke={chartColors.danger}
                      strokeDasharray="5 5"
                      label={{ value: "Long-Term Threshold", angle: 90, position: "insideTopLeft" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulativeCost"
                      stroke={chartColors.ocean}
                      fill={chartColors.ocean}
                      fillOpacity={0.3}
                      name="Cumulative Cost"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Long-Term Storage Threshold</h4>
                <p className="text-sm text-muted-foreground">
                  Inventory stored for more than {storageRates[inputs.marketplace].longTermThreshold} days 
                  is subject to long-term storage fees. These fees are charged on the 15th of each month 
                  at a rate of {formatMoney(storageRates[inputs.marketplace].longTermFee)}/cubic foot 
                  (minimum {formatMoney(0.15)} per unit).
                </p>
              </div>

              {/* Timeline Events */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Key Timeline Events</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-[var(--logistics)]/20 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                    </div>
                    <div>
                      <p className="font-medium">Day 1 - Initial Storage</p>
                      <p className="text-sm text-muted-foreground">
                        Monthly storage fees begin accruing based on product volume and size tier
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Day 270 - Warning Threshold</p>
                      <p className="text-sm text-muted-foreground">
                        Amazon sends notifications for inventory approaching long-term storage fees
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-200">
                    <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">Day 365+ - Long-Term Storage</p>
                      <p className="text-sm text-muted-foreground">
                        Additional long-term storage fees apply. Consider creating removal orders 
                        or running promotions to reduce aged inventory
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reference" className="space-y-6 mt-6">
          {/* Storage Rates Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                Amazon FBA Storage Rates by Marketplace
              </CardTitle>
              <CardDescription>
                Current storage fee rates per cubic foot per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Marketplace</th>
                      <th className="text-left py-3 px-4">Size Tier</th>
                      <th className="text-right py-3 px-4">Jan-Sep Rate</th>
                      <th className="text-right py-3 px-4">Oct-Dec Rate</th>
                      <th className="text-right py-3 px-4">Long-Term Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(storageRates).map(([marketplace, rates]) => (
                      <>
                        <tr key={`${marketplace}-standard`} className="border-b">
                          <td className="py-3 px-4" rowSpan={3}>
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              {marketplace === "US" ? "United States" : 
                               marketplace === "EU" ? "Europe" : 
                               marketplace === "UK" ? "United Kingdom" : "Japan"}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className="bg-[var(--logistics)]">Standard</Badge>
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatCurrency(rates.standard.janSep, rates.currency)}/ft³
                          </td>
                          <td className="text-right py-3 px-4 text-amber-600">
                            {formatCurrency(rates.standard.octDec, rates.currency)}/ft³
                          </td>
                          <td className="text-right py-3 px-4 text-red-600">
                            {formatCurrency(rates.longTermFee, rates.currency)}/ft³
                          </td>
                        </tr>
                        <tr key={`${marketplace}-oversize`} className="border-b bg-muted/20">
                          <td className="py-3 px-4">
                            <Badge className="bg-[var(--ocean)]">Oversize</Badge>
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatCurrency(rates.oversize.janSep, rates.currency)}/ft³
                          </td>
                          <td className="text-right py-3 px-4 text-amber-600">
                            {formatCurrency(rates.oversize.octDec, rates.currency)}/ft³
                          </td>
                          <td className="text-right py-3 px-4 text-red-600">
                            {formatCurrency(rates.longTermFee, rates.currency)}/ft³
                          </td>
                        </tr>
                        <tr key={`${marketplace}-extraOversize`} className="border-b bg-muted/40">
                          <td className="py-3 px-4">
                            <Badge variant="destructive">Extra Oversize</Badge>
                          </td>
                          <td className="text-right py-3 px-4">
                            {formatCurrency(rates.extraOversize.janSep, rates.currency)}/ft³
                          </td>
                          <td className="text-right py-3 px-4 text-amber-600">
                            {formatCurrency(rates.extraOversize.octDec, rates.currency)}/ft³
                          </td>
                          <td className="text-right py-3 px-4 text-red-600">
                            {formatCurrency(rates.longTermFee, rates.currency)}/ft³
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Size Tier Boundaries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Size Tier Boundaries (US Marketplace)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Size Tier</th>
                      <th className="text-right py-3 px-4">Longest Side</th>
                      <th className="text-right py-3 px-4">Median Side</th>
                      <th className="text-right py-3 px-4">Shortest Side</th>
                      <th className="text-right py-3 px-4">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">
                        <Badge className="bg-[var(--logistics)]">Standard</Badge>
                      </td>
                      <td className="text-right py-3 px-4">≤ 18 in</td>
                      <td className="text-right py-3 px-4">≤ 14 in</td>
                      <td className="text-right py-3 px-4">≤ 8 in</td>
                      <td className="text-right py-3 px-4">≤ 20 lbs</td>
                    </tr>
                    <tr className="border-b bg-muted/20">
                      <td className="py-3 px-4">
                        <Badge className="bg-[var(--ocean)]">Oversize</Badge>
                      </td>
                      <td className="text-right py-3 px-4">≤ 108 in</td>
                      <td className="text-right py-3 px-4">-</td>
                      <td className="text-right py-3 px-4">Length + Girth ≤ 165 in</td>
                      <td className="text-right py-3 px-4">≤ 150 lbs</td>
                    </tr>
                    <tr className="border-b bg-muted/40">
                      <td className="py-3 px-4">
                        <Badge variant="destructive">Extra Oversize</Badge>
                      </td>
                      <td className="text-right py-3 px-4">&gt; 108 in</td>
                      <td className="text-right py-3 px-4">-</td>
                      <td className="text-right py-3 px-4">Length + Girth &gt; 165 in</td>
                      <td className="text-right py-3 px-4">&gt; 150 lbs</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Girth = 2 × (width + height). The longest side + girth calculation 
                  helps determine if your product fits on standard conveyor systems.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tips to Reduce Storage Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Tips to Reduce Storage Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Optimize Packaging</p>
                      <p className="text-sm text-muted-foreground">
                        Reducing product dimensions can move you to a smaller size tier, 
                        significantly lowering storage costs.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Monitor Inventory Age</p>
                      <p className="text-sm text-muted-foreground">
                        Keep inventory turnover high. Create removal orders for items 
                        approaching 365 days to avoid long-term fees.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Plan for Q4</p>
                      <p className="text-sm text-muted-foreground">
                        Reduce inventory levels before October to minimize peak season 
                        storage fees which are 2-3x higher.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Use Inventory Reports</p>
                      <p className="text-sm text-muted-foreground">
                        Regularly check FBA inventory age reports to identify slow-moving 
                        items before they incur long-term fees.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Run Promotions</p>
                      <p className="text-sm text-muted-foreground">
                        Offer discounts or coupons for aged inventory to increase sales 
                        velocity and reduce storage duration.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Consider Multi-Channel</p>
                      <p className="text-sm text-muted-foreground">
                        Distribute inventory across multiple fulfillment channels to 
                        reduce concentration in FBA warehouses.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={resetCalculator}>
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
