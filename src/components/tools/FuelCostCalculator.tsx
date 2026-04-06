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
import {
  Truck,
  Fuel,
  Calculator,
  RefreshCw,
  Info,
  Gauge,
  MapPin,
  ArrowRight,
  DollarSign,
  Leaf,
  TrendingUp,
  BarChart3,
  BookOpen,
  Zap,
  Train,
  Car,
  Droplet,
  Battery,
  Flame,
  Percent,
  Route,
  AlertCircle,
  CheckCircle2,
  ArrowLeftRight,
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
  Legend,
  ComposedChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// Vehicle types configuration
const VEHICLE_TYPES = {
  TRUCK_SMALL: {
    id: "TRUCK_SMALL",
    name: "Small Truck",
    description: "Light commercial vehicle (3.5-7.5t)",
    icon: "🚚",
    defaultEfficiency: { diesel: 8, gasoline: 6, lpg: 5, electric: 2.5 }, // km per unit (L or kWh)
    co2Factor: { diesel: 2.68, gasoline: 2.31, lpg: 1.51, electric: 0.4 }, // kg CO2 per unit
  },
  TRUCK_MEDIUM: {
    id: "TRUCK_MEDIUM",
    name: "Medium Truck",
    description: "Medium goods vehicle (7.5-18t)",
    icon: "🚛",
    defaultEfficiency: { diesel: 5, gasoline: 4, lpg: 3.5, electric: 1.8 },
    co2Factor: { diesel: 2.68, gasoline: 2.31, lpg: 1.51, electric: 0.4 },
  },
  TRUCK_LARGE: {
    id: "TRUCK_LARGE",
    name: "Large Truck",
    description: "Heavy goods vehicle (18t+)",
    icon: "🚛",
    defaultEfficiency: { diesel: 3.5, gasoline: 2.8, lpg: 2.5, electric: 1.2 },
    co2Factor: { diesel: 2.68, gasoline: 2.31, lpg: 1.51, electric: 0.4 },
  },
  VAN: {
    id: "VAN",
    name: "Delivery Van",
    description: "Small delivery vehicle (<3.5t)",
    icon: "🚐",
    defaultEfficiency: { diesel: 12, gasoline: 10, lpg: 8, electric: 5 },
    co2Factor: { diesel: 2.68, gasoline: 2.31, lpg: 1.51, electric: 0.4 },
  },
  RAIL_FREIGHT: {
    id: "RAIL_FREIGHT",
    name: "Rail Freight",
    description: "Train cargo per container",
    icon: "🚂",
    defaultEfficiency: { diesel: 45, electric: 30 }, // km per liter or kWh per km (different scale)
    co2Factor: { diesel: 2.68, electric: 0.15 }, // Lower for electric rail
  },
};

// Fuel types configuration
const FUEL_TYPES = {
  DIESEL: {
    id: "DIESEL",
    name: "Diesel",
    icon: Droplet,
    color: "#1E3A5F",
    unit: "liter",
    unitShort: "L",
    priceUnit: "L",
    defaultPrice: 1.65, // USD per liter
    energyDensity: 36, // MJ per liter
  },
  GASOLINE: {
    id: "GASOLINE",
    name: "Gasoline",
    icon: Fuel,
    color: "#E85D04",
    unit: "liter",
    unitShort: "L",
    priceUnit: "L",
    defaultPrice: 1.75,
    energyDensity: 34,
  },
  LPG: {
    id: "LPG",
    name: "LPG",
    icon: Flame,
    color: "#2E8B57",
    unit: "liter",
    unitShort: "L",
    priceUnit: "L",
    defaultPrice: 0.95,
    energyDensity: 25,
  },
  ELECTRIC: {
    id: "ELECTRIC",
    name: "Electric",
    icon: Battery,
    color: "#10B981",
    unit: "kWh",
    unitShort: "kWh",
    priceUnit: "kWh",
    defaultPrice: 0.15,
    energyDensity: 3.6, // MJ per kWh
  },
};

// Distance units
const DISTANCE_UNITS = {
  KM: { name: "Kilometers", short: "km", factor: 1 },
  MILES: { name: "Miles", short: "mi", factor: 1.60934 },
};

// Volume units for fuel price
const PRICE_UNITS = {
  PER_LITER: { name: "Per Liter", short: "/L", factor: 1 },
  PER_GALLON: { name: "Per Gallon (US)", short: "/gal", factor: 3.78541 },
};

// Efficiency units
const EFFICIENCY_UNITS = {
  KM_PER_L: { name: "km/L", factor: 1, type: "metric" },
  MPG_US: { name: "MPG (US)", factor: 0.425144, type: "imperial" },
  MPG_UK: { name: "MPG (UK)", factor: 0.354006, type: "imperial" },
  KM_PER_KWH: { name: "km/kWh", factor: 1, type: "electric" },
  KWH_PER_100KM: { name: "kWh/100km", factor: 0.01, type: "electric_inverse" },
};

interface CalculationResult {
  totalFuelConsumed: number;
  totalFuelCost: number;
  costPerKm: number;
  co2Emissions: number;
  fuelEfficiencyUsed: number;
  breakdown: {
    fuelCost: number;
    maintenance?: number;
    insurance?: number;
    depreciation?: number;
  };
}

interface ComparisonData {
  fuelType: string;
  fuelName: string;
  totalCost: number;
  costPerKm: number;
  co2Emissions: number;
  savings: number;
  color: string;
}

export function FuelCostCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input states
  const [vehicleType, setVehicleType] = useState<keyof typeof VEHICLE_TYPES>("TRUCK_MEDIUM");
  const [fuelType, setFuelType] = useState<keyof typeof FUEL_TYPES>("DIESEL");
  const [distance, setDistance] = useState<string>("500");
  const [distanceUnit, setDistanceUnit] = useState<keyof typeof DISTANCE_UNITS>("KM");
  const [fuelPrice, setFuelPrice] = useState<string>("1.65");
  const [priceUnit, setPriceUnit] = useState<keyof typeof PRICE_UNITS>("PER_LITER");
  const [fuelEfficiency, setFuelEfficiency] = useState<string>("");
  const [efficiencyUnit, setEfficiencyUnit] = useState<keyof typeof EFFICIENCY_UNITS>("KM_PER_L");
  const [useDefaultEfficiency, setUseDefaultEfficiency] = useState(true);

  // Advanced options
  const [includeMaintenance, setIncludeMaintenance] = useState(false);
  const [maintenanceRate, setMaintenanceRate] = useState<string>("0.15"); // per km
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [insuranceRate, setInsuranceRate] = useState<string>("0.05"); // per km
  const [includeDepreciation, setIncludeDepreciation] = useState(false);
  const [depreciationRate, setDepreciationRate] = useState<string>("0.10"); // per km

  // Get available fuel types for selected vehicle
  const availableFuelTypes = useMemo(() => {
    const vehicle = VEHICLE_TYPES[vehicleType];
    return Object.entries(FUEL_TYPES).filter(([key]) =>
      key in vehicle.defaultEfficiency
    );
  }, [vehicleType]);

  // Get effective efficiency
  const effectiveEfficiency = useMemo(() => {
    if (useDefaultEfficiency || !fuelEfficiency) {
      return VEHICLE_TYPES[vehicleType].defaultEfficiency[fuelType as keyof typeof VEHICLE_TYPES[typeof vehicleType]["defaultEfficiency"]] || 10;
    }

    // Convert efficiency based on unit
    const effValue = parseFloat(fuelEfficiency) || 0;
    const unit = EFFICIENCY_UNITS[efficiencyUnit];

    if (unit.type === "electric_inverse") {
      // kWh/100km -> km/kWh
      return effValue > 0 ? 100 / effValue : 0;
    }

    // Convert to km per unit
    return effValue * unit.factor;
  }, [useDefaultEfficiency, fuelEfficiency, efficiencyUnit, vehicleType, fuelType]);

  // Get effective fuel price
  const effectiveFuelPrice = useMemo(() => {
    const price = parseFloat(fuelPrice) || FUEL_TYPES[fuelType].defaultPrice;
    const unit = PRICE_UNITS[priceUnit];
    return price / unit.factor; // Convert to per liter
  }, [fuelPrice, priceUnit, fuelType]);

  // Calculate results
  const result = useMemo((): CalculationResult => {
    const distanceKm = (parseFloat(distance) || 0) * DISTANCE_UNITS[distanceUnit].factor;
    const vehicle = VEHICLE_TYPES[vehicleType];
    const fuel = FUEL_TYPES[fuelType];

    // Calculate fuel consumed
    const totalFuelConsumed = distanceKm / effectiveEfficiency;

    // Calculate total cost
    const totalFuelCost = totalFuelConsumed * effectiveFuelPrice;
    const costPerKm = distanceKm > 0 ? totalFuelCost / distanceKm : 0;

    // Calculate CO2 emissions
    const co2Factor = vehicle.co2Factor[fuelType as keyof typeof vehicle.co2Factor] || 0;
    const co2Emissions = totalFuelConsumed * co2Factor;

    // Calculate additional costs
    const maintenance = includeMaintenance ? distanceKm * (parseFloat(maintenanceRate) || 0) : 0;
    const insurance = includeInsurance ? distanceKm * (parseFloat(insuranceRate) || 0) : 0;
    const depreciation = includeDepreciation ? distanceKm * (parseFloat(depreciationRate) || 0) : 0;

    return {
      totalFuelConsumed,
      totalFuelCost,
      costPerKm,
      co2Emissions,
      fuelEfficiencyUsed: effectiveEfficiency,
      breakdown: {
        fuelCost: totalFuelCost,
        maintenance,
        insurance,
        depreciation,
      },
    };
  }, [
    distance, distanceUnit, vehicleType, fuelType, effectiveEfficiency, effectiveFuelPrice,
    includeMaintenance, maintenanceRate, includeInsurance, insuranceRate, includeDepreciation, depreciationRate
  ]);

  // Calculate comparison across fuel types
  const comparisonData = useMemo((): ComparisonData[] => {
    const distanceKm = (parseFloat(distance) || 0) * DISTANCE_UNITS[distanceUnit].factor;
    const vehicle = VEHICLE_TYPES[vehicleType];
    const currentFuelCost = result.totalFuelCost;

    return Object.entries(FUEL_TYPES)
      .filter(([key]) => key in vehicle.defaultEfficiency)
      .map(([key, fuel]) => {
        const efficiency = vehicle.defaultEfficiency[key as keyof typeof vehicle.defaultEfficiency] || 10;
        const fuelConsumed = distanceKm / efficiency;
        const price = fuel.defaultPrice;
        const totalCost = fuelConsumed * price;
        const co2Factor = vehicle.co2Factor[key as keyof typeof vehicle.co2Factor] || 0;
        const co2 = fuelConsumed * co2Factor;

        return {
          fuelType: key,
          fuelName: fuel.name,
          totalCost,
          costPerKm: distanceKm > 0 ? totalCost / distanceKm : 0,
          co2Emissions: co2,
          savings: currentFuelCost - totalCost,
          color: fuel.color,
        };
      })
      .sort((a, b) => a.totalCost - b.totalCost);
  }, [distance, distanceUnit, vehicleType, result.totalFuelCost]);

  // Chart data for cost breakdown
  const costBreakdownData = useMemo(() => {
    const data = [
      { name: "Fuel Cost", value: result.breakdown.fuelCost, color: FUEL_TYPES[fuelType].color },
    ];

    if (includeMaintenance && result.breakdown.maintenance) {
      data.push({ name: "Maintenance", value: result.breakdown.maintenance, color: "#F59E0B" });
    }
    if (includeInsurance && result.breakdown.insurance) {
      data.push({ name: "Insurance", value: result.breakdown.insurance, color: "#8B5CF6" });
    }
    if (includeDepreciation && result.breakdown.depreciation) {
      data.push({ name: "Depreciation", value: result.breakdown.depreciation, color: "#EC4899" });
    }

    return data;
  }, [result, fuelType, includeMaintenance, includeInsurance, includeDepreciation]);

  // Distance sensitivity data
  const sensitivityData = useMemo(() => {
    const baseDistance = parseFloat(distance) || 500;
    return [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(multiplier => {
      const dist = baseDistance * multiplier * DISTANCE_UNITS[distanceUnit].factor;
      const fuelConsumed = dist / effectiveEfficiency;
      const cost = fuelConsumed * effectiveFuelPrice;
      const co2 = fuelConsumed * (VEHICLE_TYPES[vehicleType].co2Factor[fuelType as keyof typeof VEHICLE_TYPES[typeof vehicleType]["co2Factor"]] || 0);

      return {
        distance: Math.round(dist),
        cost: Math.round(cost * 100) / 100,
        co2: Math.round(co2),
        label: `${Math.round(baseDistance * multiplier)} ${DISTANCE_UNITS[distanceUnit].short}`,
      };
    });
  }, [distance, distanceUnit, effectiveEfficiency, effectiveFuelPrice, vehicleType, fuelType]);

  // Reset efficiency when vehicle or fuel type changes
  const handleVehicleChange = (value: keyof typeof VEHICLE_TYPES) => {
    setVehicleType(value);
    const vehicle = VEHICLE_TYPES[value];
    const availableFuels = Object.keys(vehicle.defaultEfficiency);
    if (!availableFuels.includes(fuelType)) {
      setFuelType(availableFuels[0] as keyof typeof FUEL_TYPES);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Fuel Comparison</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
          <TabsTrigger value="emissions">CO2 Emissions</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Vehicle & Fuel Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[var(--ocean)]" />
                  Vehicle & Fuel Configuration
                </CardTitle>
                <CardDescription>Select vehicle type and fuel specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Vehicle Type</Label>
                  <Select value={vehicleType} onValueChange={(v) => handleVehicleChange(v as keyof typeof VEHICLE_TYPES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(VEHICLE_TYPES).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span>{config.icon}</span>
                            <span>{config.name}</span>
                            <span className="text-muted-foreground text-xs">
                              ({config.description})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fuel Type</Label>
                  <Select value={fuelType} onValueChange={(v) => setFuelType(v as keyof typeof FUEL_TYPES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFuelTypes.map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" style={{ color: config.color }} />
                              <span>{config.name}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="distance">Distance</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select value={distanceUnit} onValueChange={(v) => setDistanceUnit(v as keyof typeof DISTANCE_UNITS)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DISTANCE_UNITS).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fuel Price & Efficiency */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                  Fuel Price & Efficiency
                </CardTitle>
                <CardDescription>Configure fuel price and vehicle efficiency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fuelPrice">Fuel Price</Label>
                    <Input
                      id="fuelPrice"
                      type="number"
                      step="0.01"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Price Unit</Label>
                    <Select value={priceUnit} onValueChange={(v) => setPriceUnit(v as keyof typeof PRICE_UNITS)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PRICE_UNITS).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            USD{config.short}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                  <span className="text-sm">Use default efficiency</span>
                  <Switch
                    checked={useDefaultEfficiency}
                    onCheckedChange={setUseDefaultEfficiency}
                  />
                </div>

                <AnimatePresence>
                  {!useDefaultEfficiency && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="efficiency">Fuel Efficiency</Label>
                          <Input
                            id="efficiency"
                            type="number"
                            step="0.1"
                            value={fuelEfficiency}
                            onChange={(e) => setFuelEfficiency(e.target.value)}
                            placeholder={String(VEHICLE_TYPES[vehicleType].defaultEfficiency[fuelType as keyof typeof VEHICLE_TYPES[typeof vehicleType]["defaultEfficiency"]] || 10)}
                          />
                        </div>
                        <div>
                          <Label>Efficiency Unit</Label>
                          <Select value={efficiencyUnit} onValueChange={(v) => setEfficiencyUnit(v as keyof typeof EFFICIENCY_UNITS)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fuelType === "ELECTRIC" ? (
                                <>
                                  <SelectItem value="KM_PER_KWH">{EFFICIENCY_UNITS.KM_PER_KWH.name}</SelectItem>
                                  <SelectItem value="KWH_PER_100KM">{EFFICIENCY_UNITS.KWH_PER_100KM.name}</SelectItem>
                                </>
                              ) : (
                                <>
                                  <SelectItem value="KM_PER_L">{EFFICIENCY_UNITS.KM_PER_L.name}</SelectItem>
                                  <SelectItem value="MPG_US">{EFFICIENCY_UNITS.MPG_US.name}</SelectItem>
                                  <SelectItem value="MPG_UK">{EFFICIENCY_UNITS.MPG_UK.name}</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-3 bg-[var(--ocean)]/10 rounded-lg border border-[var(--ocean)]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="text-sm font-medium">Effective Efficiency</span>
                  </div>
                  <p className="text-lg font-bold text-[var(--ocean)]">
                    {effectiveEfficiency.toFixed(2)} km/{FUEL_TYPES[fuelType].unitShort}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[var(--ocean)]" />
                Additional Cost Components (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Fuel className="h-4 w-4" />
                      Maintenance
                    </Label>
                    <Switch checked={includeMaintenance} onCheckedChange={setIncludeMaintenance} />
                  </div>
                  {includeMaintenance && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={maintenanceRate}
                        onChange={(e) => setMaintenanceRate(e.target.value)}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">/km</span>
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Insurance
                    </Label>
                    <Switch checked={includeInsurance} onCheckedChange={setIncludeInsurance} />
                  </div>
                  {includeInsurance && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={insuranceRate}
                        onChange={(e) => setInsuranceRate(e.target.value)}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">/km</span>
                    </div>
                  )}
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Depreciation
                    </Label>
                    <Switch checked={includeDepreciation} onCheckedChange={setIncludeDepreciation} />
                  </div>
                  {includeDepreciation && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        value={depreciationRate}
                        onChange={(e) => setDepreciationRate(e.target.value)}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">/km</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Result */}
            <Card className="lg:col-span-2 border-[var(--ocean)]/20">
              <CardHeader className="bg-[var(--ocean)]/5">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                  Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    key={result.totalFuelCost}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-[var(--ocean)]/10 rounded-xl border border-[var(--ocean)]/20"
                  >
                    <p className="text-sm text-muted-foreground mb-1">Total Fuel Cost</p>
                    <p className="text-3xl font-bold text-[var(--ocean)]">
                      {formatCurrency(result.totalFuelCost)}
                    </p>
                  </motion.div>

                  <motion.div
                    key={result.costPerKm}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-[var(--logistics)]/10 rounded-xl border border-[var(--logistics)]/20"
                  >
                    <p className="text-sm text-muted-foreground mb-1">Cost per Kilometer</p>
                    <p className="text-3xl font-bold text-[var(--logistics)]">
                      {formatCurrency(result.costPerKm)}
                    </p>
                  </motion.div>
                </div>

                <Separator className="my-6" />

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Fuel Consumed</span>
                    </div>
                    <p className="text-xl font-bold">
                      {result.totalFuelConsumed.toFixed(2)} {FUEL_TYPES[fuelType].unitShort}
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Distance</span>
                    </div>
                    <p className="text-xl font-bold">
                      {(parseFloat(distance) * DISTANCE_UNITS[distanceUnit].factor).toFixed(0)} km
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">CO2 Emissions</span>
                    </div>
                    <p className="text-xl font-bold">
                      {result.co2Emissions.toFixed(1)} kg
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  {costBreakdownData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fuel Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-[var(--ocean)]" />
                Fuel Type Cost Comparison
              </CardTitle>
              <CardDescription>
                Compare total fuel costs across available fuel types for your selected vehicle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} />
                    <YAxis dataKey="fuelName" type="category" width={80} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="totalCost" radius={[0, 4, 4, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {comparisonData.map((fuel, index) => (
                  <motion.div
                    key={fuel.fuelType}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 ${
                      fuel.fuelType === fuelType ? "border-[var(--ocean)] bg-[var(--ocean)]/5" : "border-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{fuel.fuelName}</span>
                      {fuel.fuelType === fuelType && (
                        <Badge className="bg-[var(--ocean)]">Selected</Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Cost</span>
                        <span className="font-bold">{formatCurrency(fuel.totalCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Per km</span>
                        <span>{formatCurrency(fuel.costPerKm)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">CO2</span>
                        <span>{fuel.co2Emissions.toFixed(1)} kg</span>
                      </div>
                      {index > 0 && (
                        <div className="pt-2 border-t mt-2">
                          <span className={`text-xs ${fuel.savings > 0 ? "text-[var(--logistics)]" : "text-red-500"}`}>
                            {fuel.savings > 0 ? "Save" : "Extra"} {formatCurrency(Math.abs(fuel.savings))}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Best Option Highlight */}
              {comparisonData.length > 1 && (
                <div className="mt-6 p-4 bg-[var(--logistics)]/10 border border-[var(--logistics)]/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    <span className="font-medium">
                      Most Cost-Effective: {comparisonData[0].fuelName}
                    </span>
                    <Badge className="bg-[var(--logistics)]">
                      {formatCurrency(comparisonData[0].totalCost)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Switching from {FUEL_TYPES[fuelType].name} to {comparisonData[0].fuelName} could save you{" "}
                    {formatCurrency(result.totalFuelCost - comparisonData[0].totalCost)} on this trip.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* CO2 Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-[var(--logistics)]" />
                CO2 Emissions Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fuelName" />
                  <YAxis label={{ value: "kg CO2", angle: -90, position: "insideLeft" }} />
                  <Tooltip formatter={(value: number) => `${value.toFixed(1)} kg`} />
                  <Bar dataKey="co2Emissions" name="CO2 Emissions" fill="#2E8B57" radius={[4, 4, 0, 0]}>
                    {comparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fuelType === "ELECTRIC" ? "#10B981" : entry.color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex gap-2">
                  <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>Green tip:</strong> Electric vehicles produce significantly less CO2 emissions.
                    Consider electrification for routes with charging infrastructure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sensitivity Analysis Tab */}
        <TabsContent value="sensitivity" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Distance Sensitivity Analysis
              </CardTitle>
              <CardDescription>
                See how fuel costs and emissions change with different distances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={sensitivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v)} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}kg`} />
                  <Tooltip
                    formatter={(value: number, name) =>
                      name === "cost" ? formatCurrency(value) : `${value} kg CO2`
                    }
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="cost"
                    name="Fuel Cost"
                    fill="#0F4C81"
                    fillOpacity={0.3}
                    stroke="#0F4C81"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="co2"
                    name="CO2 Emissions"
                    stroke="#2E8B57"
                    strokeWidth={2}
                    dot={{ fill: "#2E8B57" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3">Distance</th>
                      <th className="text-right py-2 px-3">Fuel Cost</th>
                      <th className="text-right py-2 px-3">CO2 Emissions</th>
                      <th className="text-right py-2 px-3">Cost/km</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sensitivityData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-3">{row.distance} km</td>
                        <td className="text-right py-2 px-3">{formatCurrency(row.cost)}</td>
                        <td className="text-right py-2 px-3">{row.co2} kg</td>
                        <td className="text-right py-2 px-3">{formatCurrency(row.cost / row.distance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                Fuel Efficiency Impact
              </CardTitle>
              <CardDescription>
                How improving fuel efficiency affects your costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const baseDistance = (parseFloat(distance) || 500) * DISTANCE_UNITS[distanceUnit].factor;
                const efficiencies = [0.7, 0.85, 1, 1.15, 1.3]; // -30% to +30% efficiency
                const effData = efficiencies.map(mult => ({
                  label: `${mult > 1 ? "+" : ""}${Math.round((mult - 1) * 100)}%`,
                  efficiency: effectiveEfficiency * mult,
                  cost: (baseDistance / (effectiveEfficiency * mult)) * effectiveFuelPrice,
                  savings: result.totalFuelCost - (baseDistance / (effectiveEfficiency * mult)) * effectiveFuelPrice,
                }));

                return (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={effData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" label={{ value: "Efficiency Change", position: "bottom", offset: 0 }} />
                        <YAxis tickFormatter={(v) => formatCurrency(v)} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="cost" name="Total Cost" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">If you improve efficiency by 30%</p>
                        <p className="text-lg font-bold text-[var(--logistics)]">
                          Save {formatCurrency(result.totalFuelCost * 0.23)} per trip
                        </p>
                      </div>
                      <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">If efficiency drops by 30%</p>
                        <p className="text-lg font-bold text-red-600">
                          Extra {formatCurrency(result.totalFuelCost * 0.43)} per trip
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CO2 Emissions Tab */}
        <TabsContent value="emissions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-[var(--logistics)]" />
                CO2 Emissions Analysis
              </CardTitle>
              <CardDescription>
                Understand and offset your carbon footprint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="p-6 bg-[var(--logistics)]/10 rounded-xl border border-[var(--logistics)]/20">
                  <div className="flex items-center gap-3 mb-2">
                    <Leaf className="h-6 w-6 text-[var(--logistics)]" />
                    <span className="text-muted-foreground">Total CO2 Emissions</span>
                  </div>
                  <p className="text-4xl font-bold text-[var(--logistics)]">
                    {result.co2Emissions.toFixed(1)} kg
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    = {(result.co2Emissions / 1000).toFixed(3)} tonnes
                  </p>
                </div>

                <div className="p-6 bg-muted/50 rounded-xl border">
                  <div className="flex items-center gap-3 mb-2">
                    <Gauge className="h-6 w-6 text-muted-foreground" />
                    <span className="text-muted-foreground">CO2 per Kilometer</span>
                  </div>
                  <p className="text-4xl font-bold">
                    {(result.co2Emissions / ((parseFloat(distance) || 500) * DISTANCE_UNITS[distanceUnit].factor)).toFixed(3)} kg
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Average emission rate
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-[var(--ocean)]" />
                  Emissions Equivalents
                </h4>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-[var(--ocean)]">
                      {(result.co2Emissions / 0.5).toFixed(0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Trees needed to offset (per year)</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold text-[var(--logistics)]">
                      {(result.co2Emissions / 21).toFixed(0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Days of average car use</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-2xl font-bold">
                      {(result.co2Emissions / 0.1).toFixed(0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Hours of home heating</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-700 dark:text-amber-300">
                      Carbon Offset Recommendation
                    </p>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                      Consider purchasing carbon credits to offset this journey. At approximately
                      $15-30 per tonne of CO2, offsetting this trip would cost{" "}
                      <strong>${(result.co2Emissions / 1000 * 22.5).toFixed(2)}</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emission Factors Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CO2 Emission Factors by Fuel Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Fuel Type</th>
                      <th className="text-right py-3 px-4">CO2 per Liter/kWh</th>
                      <th className="text-right py-3 px-4">Your Trip Emissions</th>
                      <th className="text-right py-3 px-4">% of Highest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData
                      .sort((a, b) => b.co2Emissions - a.co2Emissions)
                      .map((fuel, index, arr) => {
                        const maxEmissions = arr[0].co2Emissions;
                        const percentage = maxEmissions > 0 ? (fuel.co2Emissions / maxEmissions) * 100 : 0;
                        return (
                          <tr key={fuel.fuelType} className="border-b">
                            <td className="py-3 px-4 font-medium">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fuel.color }} />
                                {fuel.fuelName}
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">
                              {FUEL_TYPES[fuel.fuelType as keyof typeof FUEL_TYPES] &&
                                `${FUEL_TYPES[fuel.fuelType as keyof typeof FUEL_TYPES].unit === "kWh" ? "0.15" : FUEL_TYPES[fuel.fuelType as keyof typeof FUEL_TYPES].unit === "L" ? "2.68" : "1.51"} kg`}
                            </td>
                            <td className="text-right py-3 px-4 font-medium">
                              {fuel.co2Emissions.toFixed(1)} kg
                            </td>
                            <td className="text-right py-3 px-4">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full"
                                    style={{ width: `${percentage}%`, backgroundColor: fuel.color }}
                                  />
                                </div>
                                <span className="w-12">{percentage.toFixed(0)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6 mt-6">
          {/* Vehicle Types Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--ocean)]" />
                Vehicle Types Reference
              </CardTitle>
              <CardDescription>Typical fuel efficiency by vehicle type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Vehicle Type</th>
                      <th className="text-right py-3 px-4">Diesel (km/L)</th>
                      <th className="text-right py-3 px-4">Gasoline (km/L)</th>
                      <th className="text-right py-3 px-4">LPG (km/L)</th>
                      <th className="text-right py-3 px-4">Electric (km/kWh)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(VEHICLE_TYPES).map(([key, config]) => (
                      <tr key={key} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span>{config.icon}</span>
                            <div>
                              <p className="font-medium">{config.name}</p>
                              <p className="text-xs text-muted-foreground">{config.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">{config.defaultEfficiency.diesel || "-"}</td>
                        <td className="text-right py-3 px-4">{config.defaultEfficiency.gasoline || "-"}</td>
                        <td className="text-right py-3 px-4">{config.defaultEfficiency.lpg || "-"}</td>
                        <td className="text-right py-3 px-4">{config.defaultEfficiency.electric || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Fuel Prices Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                Reference Fuel Prices
              </CardTitle>
              <CardDescription>Approximate global average prices (subject to change)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(FUEL_TYPES).map(([key, fuel]) => {
                  const Icon = fuel.icon;
                  return (
                    <div key={key} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5" style={{ color: fuel.color }} />
                        <span className="font-medium">{fuel.name}</span>
                      </div>
                      <p className="text-2xl font-bold">${fuel.defaultPrice.toFixed(2)}/{fuel.unitShort}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Energy: {fuel.energyDensity} MJ/{fuel.unitShort}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Prices are approximate and vary significantly by region. Always use local prices for accurate calculations.
              </p>
            </CardContent>
          </Card>

          {/* Tips for Fuel Cost Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Fuel Cost Management Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2 text-[var(--logistics)]">
                    <CheckCircle2 className="h-4 w-4" />
                    Cost Reduction Strategies
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Maintain proper tire pressure (can improve efficiency by 3%)
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Use cruise control on highways for consistent fuel consumption
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Reduce idling time; turn off engine for stops over 30 seconds
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Plan routes to avoid traffic congestion and unnecessary miles
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-[var(--logistics)] shrink-0" />
                      Regular maintenance keeps engines running efficiently
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2 text-amber-500">
                    <AlertCircle className="h-4 w-4" />
                    Common Efficiency Mistakes
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                      Overloading vehicles beyond optimal capacity
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                      Aggressive acceleration and braking
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                      Using incorrect fuel grade for the vehicle
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                      Ignoring aerodynamic drag from roof racks or open windows
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                      Not comparing fuel prices at different stations
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unit Conversions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Unit Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Distance</p>
                  <p className="text-sm">1 mile = 1.60934 km</p>
                  <p className="text-sm">100 km = 62.14 miles</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Volume</p>
                  <p className="text-sm">1 US gallon = 3.78541 L</p>
                  <p className="text-sm">1 UK gallon = 4.54609 L</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium mb-2">Efficiency</p>
                  <p className="text-sm">10 km/L = 23.5 MPG (US)</p>
                  <p className="text-sm">1 kWh/100km = 100 km/kWh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
