"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Ship,
  Plane,
  Truck,
  Train,
  Package,
  Globe,
  Info,
  TrendingDown,
  TreePine,
  ArrowRight,
  BarChart3,
  DollarSign,
  Gauge,
  MapPin,
  RefreshCw,
  Calculator,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// CO2 emission factors (kg CO2e per tonne-km) - GLEC Framework
const EMISSION_FACTORS = {
  ocean: {
    container: { factor: 0.0158, name: "Container Ship", description: "Average container vessel" },
    bulk: { factor: 0.0089, name: "Bulk Carrier", description: "Dry bulk vessel" },
    tanker: { factor: 0.0123, name: "Tanker", description: "Liquid bulk vessel" },
    roro: { factor: 0.0189, name: "Ro-Ro Vessel", description: "Roll-on/roll-off" },
    reefer: { factor: 0.0225, name: "Reefer Vessel", description: "Refrigerated cargo" },
  },
  air: {
    freighter: { factor: 0.502, name: "Cargo Freighter", description: "Dedicated cargo aircraft" },
    belly: { factor: 0.602, name: "Belly Hold", description: "Passenger aircraft cargo" },
    express: { factor: 0.704, name: "Express Air", description: "Express/international" },
  },
  road: {
    truckHeavy: { factor: 0.062, name: "Heavy Truck (>16t)", description: "Articulated truck" },
    truckMedium: { factor: 0.096, name: "Medium Truck (7.5-16t)", description: "Rigid truck" },
    truckLight: { factor: 0.135, name: "Light Truck (3.5-7.5t)", description: "Small truck" },
    van: { factor: 0.209, name: "Van (<3.5t)", description: "Delivery van" },
  },
  rail: {
    electric: { factor: 0.018, name: "Electric Train", description: "Electric locomotive" },
    diesel: { factor: 0.028, name: "Diesel Train", description: "Diesel locomotive" },
    mixed: { factor: 0.023, name: "Mixed Network", description: "Mixed power sources" },
  },
};

// Major port distances (in km)
const PORT_DISTANCES: Record<string, Record<string, number>> = {
  "Shanghai": {
    "Los Angeles": 10400,
    "Rotterdam": 19200,
    "New York": 19300,
    "Hamburg": 19800,
    "Singapore": 3800,
    "Dubai": 8500,
  },
  "Singapore": {
    "Los Angeles": 13100,
    "Rotterdam": 15300,
    "New York": 17200,
    "Shanghai": 3800,
    "Dubai": 6200,
  },
  "Rotterdam": {
    "New York": 6100,
    "Shanghai": 19200,
    "Los Angeles": 16800,
    "Singapore": 15300,
    "Dubai": 11400,
  },
  "Los Angeles": {
    "Shanghai": 10400,
    "Rotterdam": 16800,
    "New York": 4800,
    "Singapore": 13100,
  },
  "New York": {
    "Rotterdam": 6100,
    "Shanghai": 19300,
    "Los Angeles": 4800,
    "Singapore": 17200,
  },
  "Dubai": {
    "Rotterdam": 11400,
    "Shanghai": 8500,
    "Singapore": 6200,
    "Los Angeles": 14800,
  },
};

// Air freight distances (approximate)
const AIR_DISTANCES: Record<string, Record<string, number>> = {
  "Shanghai": {
    "Los Angeles": 10400,
    "New York": 11900,
    "Frankfurt": 8800,
    "Singapore": 3800,
    "Dubai": 6500,
  },
  "Singapore": {
    "Los Angeles": 14100,
    "Frankfurt": 10300,
    "Shanghai": 3800,
    "Dubai": 5800,
  },
  "Frankfurt": {
    "New York": 6200,
    "Shanghai": 8800,
    "Los Angeles": 9300,
    "Singapore": 10300,
  },
  "Los Angeles": {
    "Shanghai": 10400,
    "Frankfurt": 9300,
    "New York": 4000,
  },
};

// Carbon offset prices per tonne CO2
const OFFSET_PRICES = {
  standard: { price: 15, name: "Standard Projects", description: "Renewable energy, efficiency" },
  premium: { price: 25, name: "Premium Projects", description: "Verified reforestation" },
  gold: { price: 45, name: "Gold Standard", description: "SDG certified projects" },
  corsia: { price: 18, name: "CORSIA Eligible", description: "Aviation compliant" },
};

// Transport mode icons and colors
const TRANSPORT_MODES = [
  { id: "ocean", name: "Ocean Freight", icon: Ship, color: "#0F4C81", description: "Most efficient for long distances" },
  { id: "air", name: "Air Freight", icon: Plane, color: "#8B5CF6", description: "Fastest but highest emissions" },
  { id: "road", name: "Road Transport", icon: Truck, color: "#2E8B57", description: "Flexible door-to-door" },
  { id: "rail", name: "Rail Transport", icon: Train, color: "#F59E0B", description: "Efficient overland option" },
];

interface CalculationResult {
  emissions: number;
  emissionPerKg: number;
  emissionPerKm: number;
  offsetCost: number;
  treeEquivalent: number;
  carKmEquivalent: number;
  sustainabilityScore: number;
  grade: string;
  modeComparisons: { mode: string; emissions: number; cost: number; factor: number }[];
}

export function LogisticsCarbonCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [transportMode, setTransportMode] = useState<string>("ocean");
  const [transportType, setTransportType] = useState<string>("container");
  const [cargoWeight, setCargoWeight] = useState<string>("10000");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [distance, setDistance] = useState<string>("10000");
  const [distanceUnit, setDistanceUnit] = useState<string>("km");
  const [originPort, setOriginPort] = useState<string>("");
  const [destPort, setDestPort] = useState<string>("");
  const [offsetType, setOffsetType] = useState<string>("premium");
  const [currency, setCurrency] = useState<string>("USD");
  const [returnJourney, setReturnJourney] = useState<boolean>(false);
  const [loadFactor, setLoadFactor] = useState<number>(70);

  // Get transport types for selected mode
  const getTransportTypes = () => {
    const mode = transportMode as keyof typeof EMISSION_FACTORS;
    return Object.entries(EMISSION_FACTORS[mode]).map(([key, data]) => ({
      value: key,
      label: data.name,
      description: data.description,
      factor: data.factor,
    }));
  };

  // Calculate distance from ports
  const calculatedDistance = useMemo(() => {
    if (originPort && destPort) {
      const distances = transportMode === "air" ? AIR_DISTANCES : PORT_DISTANCES;
      const originDistances = distances[originPort];
      if (originDistances && originDistances[destPort]) {
        return originDistances[destPort];
      }
    }
    return null;
  }, [originPort, destPort, transportMode]);

  // Main calculation
  const result = useMemo<CalculationResult>(() => {
    // Convert weight to kg
    let weightKg = parseFloat(cargoWeight) || 0;
    if (weightUnit === "tonnes") weightKg *= 1000;
    if (weightUnit === "lbs") weightKg *= 0.453592;
    const weightTonnes = weightKg / 1000;

    // Get distance
    let distanceKm = calculatedDistance || parseFloat(distance) || 0;
    if (distanceUnit === "miles") distanceKm *= 1.60934;
    if (distanceUnit === "nm") distanceKm *= 1.852;

    // Apply return journey
    const totalDistance = returnJourney ? distanceKm * 2 : distanceKm;

    // Get emission factor
    const mode = transportMode as keyof typeof EMISSION_FACTORS;
    const type = transportType as keyof typeof EMISSION_FACTORS[typeof mode];
    const emissionFactor = EMISSION_FACTORS[mode]?.[type]?.factor || 0.0158;

    // Adjust for load factor (higher load = more efficient per tonne)
    const adjustedFactor = emissionFactor * (70 / loadFactor);

    // Calculate emissions (tonne-km * factor = kg CO2e)
    const emissions = weightTonnes * totalDistance * adjustedFactor;
    const emissionPerKg = emissions / weightKg;
    const emissionPerKm = emissions / totalDistance;

    // Calculate offset cost
    const offsetPrice = OFFSET_PRICES[offsetType as keyof typeof OFFSET_PRICES]?.price || 25;
    const offsetCost = (emissions / 1000) * offsetPrice;

    // Tree equivalent (21 kg CO2 per tree per year)
    const treeEquivalent = emissions / 21;

    // Car equivalent (120g CO2 per km)
    const carKmEquivalent = emissions / 0.12;

    // Sustainability score (0-100)
    const baselineEmissions = weightTonnes * totalDistance * 0.1;
    const sustainabilityScore = Math.max(0, Math.min(100, 
      100 - (emissions / baselineEmissions) * 30 + (loadFactor / 100) * 10
    ));

    // Grade based on score
    let grade = "F";
    if (sustainabilityScore >= 90) grade = "A+";
    else if (sustainabilityScore >= 80) grade = "A";
    else if (sustainabilityScore >= 70) grade = "B";
    else if (sustainabilityScore >= 60) grade = "C";
    else if (sustainabilityScore >= 50) grade = "D";

    // Mode comparisons
    const modeComparisons = TRANSPORT_MODES.map((m) => {
      const modeKey = m.id as keyof typeof EMISSION_FACTORS;
      const firstType = Object.keys(EMISSION_FACTORS[modeKey])[0] as keyof typeof EMISSION_FACTORS[typeof modeKey];
      const factor = EMISSION_FACTORS[modeKey]?.[firstType]?.factor || 0.0158;
      const modeEmissions = weightTonnes * totalDistance * factor;
      return {
        mode: m.name,
        emissions: modeEmissions,
        cost: (modeEmissions / 1000) * offsetPrice,
        factor,
      };
    });

    return {
      emissions,
      emissionPerKg,
      emissionPerKm,
      offsetCost,
      treeEquivalent,
      carKmEquivalent,
      sustainabilityScore,
      grade,
      modeComparisons,
    };
  }, [transportMode, transportType, cargoWeight, weightUnit, distance, distanceUnit, calculatedDistance, returnJourney, loadFactor, offsetType]);

  // Chart data
  const modeComparisonData = result.modeComparisons.map((m, i) => ({
    ...m,
    current: m.mode === TRANSPORT_MODES.find(t => t.id === transportMode)?.name,
    fill: TRANSPORT_MODES[i]?.color || "#888",
  }));

  const pieColors = ["#0F4C81", "#2E8B57", "#F59E0B", "#8B5CF6"];

  const radarData = [
    { metric: "Emissions", value: 100 - (result.sustainabilityScore * 0.4), fullMark: 100 },
    { metric: "Efficiency", value: result.sustainabilityScore * 0.8, fullMark: 100 },
    { metric: "Cost", value: Math.max(0, 100 - result.offsetCost * 5), fullMark: 100 },
    { metric: "Distance", value: Math.min(100, (parseFloat(distance) || 0) / 100), fullMark: 100 },
    { metric: "Load Factor", value: loadFactor, fullMark: 100 },
  ];

  const formatNumber = (num: number, decimals = 2) => {
    if (Math.abs(num) >= 1000000) {
      return `${(num / 1000000).toFixed(decimals)}M`;
    } else if (Math.abs(num) >= 1000) {
      return `${(num / 1000).toFixed(decimals)}K`;
    }
    return num.toFixed(decimals);
  };

  const selectedMode = TRANSPORT_MODES.find((m) => m.id === transportMode);
  const TransportIcon = selectedMode?.icon || Ship;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Mode Comparison</TabsTrigger>
          <TabsTrigger value="offset">Carbon Offset</TabsTrigger>
          <TabsTrigger value="score">Sustainability Score</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Transport Mode Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[var(--logistics)]" />
                    Transport Mode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {TRANSPORT_MODES.map((mode) => {
                      const Icon = mode.icon;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => {
                            setTransportMode(mode.id);
                            setTransportType(getTransportTypes()[0].value);
                          }}
                          className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                            transportMode === mode.id
                              ? "border-[var(--logistics)] bg-[var(--logistics)]/5"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <Icon
                            className="h-6 w-6"
                            style={{ color: transportMode === mode.id ? mode.color : "currentColor" }}
                          />
                          <span className="text-xs font-medium text-center">{mode.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <Label>Transport Type</Label>
                    <Select value={transportType} onValueChange={setTransportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getTransportTypes().map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>{type.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {type.factor} kg/t-km
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Shipment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Shipment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="cargoWeight">Cargo Weight</Label>
                      <Input
                        id="cargoWeight"
                        type="number"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(e.target.value)}
                        placeholder="10000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={weightUnit} onValueChange={setWeightUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kg</SelectItem>
                          <SelectItem value="tonnes">Tonnes</SelectItem>
                          <SelectItem value="lbs">Lbs</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="distance">Distance</Label>
                      <Input
                        id="distance"
                        type="number"
                        value={calculatedDistance || distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="10000"
                        disabled={!!calculatedDistance}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="km">Km</SelectItem>
                          <SelectItem value="miles">Miles</SelectItem>
                          <SelectItem value="nm">Nautical Mi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[var(--logistics)]" />
                    Route Selection (Optional)
                  </CardTitle>
                  <CardDescription>Select ports to auto-calculate distance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Origin Port</Label>
                      <Select value={originPort} onValueChange={setOriginPort}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(transportMode === "air" ? AIR_DISTANCES : PORT_DISTANCES).map((port) => (
                            <SelectItem key={port} value={port}>
                              {port}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination Port</Label>
                      <Select value={destPort} onValueChange={setDestPort}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {originPort && (transportMode === "air" ? AIR_DISTANCES[originPort] : PORT_DISTANCES[originPort]) 
                            ? Object.keys(transportMode === "air" ? AIR_DISTANCES[originPort] : PORT_DISTANCES[originPort]).map((port) => (
                                <SelectItem key={port} value={port}>
                                  {port}
                                </SelectItem>
                              ))
                            : Object.keys(transportMode === "air" ? AIR_DISTANCES : PORT_DISTANCES).map((port) => (
                                <SelectItem key={port} value={port}>
                                  {port}
                                </SelectItem>
                              ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {calculatedDistance && (
                    <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-[var(--logistics)]" />
                        <span className="font-medium">Distance: {calculatedDistance.toLocaleString()} km</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="returnJourney"
                      checked={returnJourney}
                      onChange={(e) => setReturnJourney(e.target.checked)}
                      className="h-4 w-4 accent-[var(--logistics)]"
                    />
                    <Label htmlFor="returnJourney" className="text-sm font-normal cursor-pointer">
                      Include return journey (empty container return)
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Load Factor */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                    Load Factor
                  </CardTitle>
                  <CardDescription>Higher load factors improve efficiency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Load Factor</Label>
                      <span className="font-medium text-[var(--logistics)]">{loadFactor}%</span>
                    </div>
                    <Slider
                      value={[loadFactor]}
                      onValueChange={(v) => setLoadFactor(v[0])}
                      min={10}
                      max={100}
                      step={5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Lower load factors increase emissions per tonne of cargo due to underutilized capacity.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-600" />
                    CO₂ Emissions Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={result.emissions}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="text-5xl font-bold text-green-600 dark:text-green-400"
                      >
                        {formatNumber(result.emissions)}
                      </motion.div>
                    </AnimatePresence>
                    <div className="text-lg text-muted-foreground mt-1">kg CO₂e</div>
                    {returnJourney && (
                      <Badge variant="outline" className="mt-2">Includes return journey</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-lg font-semibold">
                        {formatNumber(result.emissionPerKg * 1000, 3)}
                      </div>
                      <div className="text-xs text-muted-foreground">g CO₂e per kg cargo</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-lg font-semibold">
                        {formatNumber(result.emissionPerKm, 4)}
                      </div>
                      <div className="text-xs text-muted-foreground">kg CO₂e per km</div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Emission Factor</span>
                      <span className="font-medium">
                        {EMISSION_FACTORS[transportMode as keyof typeof EMISSION_FACTORS]?.[transportType as keyof typeof EMISSION_FACTORS[typeof transportMode]]?.factor || 0} kg/t-km
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Carbon Offset Cost */}
              <Card className="border-[var(--logistics)]/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                    Carbon Offset Cost
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Offset Type</Label>
                      <Select value={offsetType} onValueChange={setOffsetType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(OFFSET_PRICES).map(([key, data]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex flex-col">
                                <span>{data.name}</span>
                                <span className="text-xs text-muted-foreground">${data.price}/tCO₂</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 10).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Estimated Offset Cost</p>
                    <p className="text-3xl font-bold text-[var(--logistics)]">
                      {formatCurrency(result.offsetCost, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on ${OFFSET_PRICES[offsetType as keyof typeof OFFSET_PRICES]?.price}/tonne CO₂
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Equivalents */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Environmental Equivalents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <TreePine className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{formatNumber(result.treeEquivalent, 0)} trees</div>
                        <div className="text-xs text-muted-foreground">needed to offset (per year)</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/20 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-[var(--ocean)]" />
                      </div>
                      <div>
                        <div className="font-semibold">{formatNumber(result.carKmEquivalent, 0)} km</div>
                        <div className="text-xs text-muted-foreground">driven by average car</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sustainability Score Preview */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sustainability Score</p>
                      <p className="text-3xl font-bold text-[var(--logistics)]">{result.sustainabilityScore.toFixed(0)}</p>
                    </div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                      result.grade.startsWith("A") ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                      result.grade === "B" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                      result.grade === "C" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {result.grade}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Mode Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Emissions by Transport Mode
              </CardTitle>
              <CardDescription>Compare CO₂ emissions across different transport modes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modeComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => `${formatNumber(v)} kg`} />
                    <YAxis dataKey="mode" type="category" width={120} />
                    <Tooltip
                      formatter={(value: number) => [`${formatNumber(value)} kg CO₂e`, "Emissions"]}
                      labelFormatter={(label) => `Mode: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="emissions" name="CO₂ Emissions (kg)" radius={[0, 4, 4, 0]}>
                      {modeComparisonData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.current ? "#2E8B57" : TRANSPORT_MODES[index]?.color || "#888"} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <Separator className="my-6" />

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Mode</th>
                      <th className="text-right py-3 px-4">Emission Factor</th>
                      <th className="text-right py-3 px-4">Emissions</th>
                      <th className="text-right py-3 px-4">Offset Cost</th>
                      <th className="text-right py-3 px-4">vs. Selected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modeComparisonData.map((row, i) => {
                      const currentEmissions = result.emissions;
                      const diff = currentEmissions > 0 ? ((row.emissions - currentEmissions) / currentEmissions) * 100 : 0;
                      return (
                        <tr key={row.mode} className={`border-b ${row.current ? "bg-[var(--logistics)]/10" : ""}`}>
                          <td className="py-3 px-4 font-medium flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: TRANSPORT_MODES[i]?.color }}
                            />
                            {row.mode}
                            {row.current && <Badge className="ml-2" variant="outline">Selected</Badge>}
                          </td>
                          <td className="text-right py-3 px-4">{row.factor.toFixed(4)} kg/t-km</td>
                          <td className="text-right py-3 px-4 text-[var(--logistics)] font-medium">
                            {formatNumber(row.emissions)} kg
                          </td>
                          <td className="text-right py-3 px-4">{formatCurrency(row.cost, currency)}</td>
                          <td className={`text-right py-3 px-4 font-medium ${
                            diff < 0 ? "text-green-600" : diff > 0 ? "text-red-500" : ""
                          }`}>
                            {row.current ? "-" : `${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke="#2E8B57"
                      fill="#2E8B57"
                      fillOpacity={0.5}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Carbon Offset Tab */}
        <TabsContent value="offset" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                Carbon Offset Options
              </CardTitle>
              <CardDescription>Choose a carbon offset program to neutralize your emissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(OFFSET_PRICES).map(([key, data]) => (
                  <div
                    key={key}
                    onClick={() => setOffsetType(key)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      offsetType === key 
                        ? "border-[var(--logistics)] bg-[var(--logistics)]/5" 
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{data.name}</h4>
                      <span className="text-lg font-bold text-[var(--logistics)]">${data.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">per tonne CO₂</p>
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm">
                        Your cost: <span className="font-bold text-[var(--ocean)]">
                          {formatCurrency((result.emissions / 1000) * data.price, currency)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Total Offset Cost</h3>
                <p className="text-4xl font-bold text-green-600 mb-2">
                  {formatCurrency(result.offsetCost, currency)}
                </p>
                <p className="text-sm text-muted-foreground">
                  to offset {formatNumber(result.emissions)} kg CO₂e
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Offset Impact */}
          <Card>
            <CardHeader>
              <CardTitle>Offset Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{formatNumber(result.treeEquivalent, 0)}</p>
                  <p className="text-sm text-muted-foreground">Trees planted equivalent</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{formatNumber(result.emissions * 3.6 / 1000, 1)}</p>
                  <p className="text-sm text-muted-foreground">MWh renewable energy</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Calculator className="h-8 w-8 text-[var(--ocean)] mx-auto mb-2" />
                  <p className="text-2xl font-bold">{formatNumber(result.carKmEquivalent, 0)}</p>
                  <p className="text-sm text-muted-foreground">Car km avoided</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sustainability Score Tab */}
        <TabsContent value="score" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                Sustainability Score Analysis
              </CardTitle>
              <CardDescription>Your shipment&apos;s environmental performance rating</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center text-5xl font-bold mb-4 ${
                  result.grade.startsWith("A") ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                  result.grade === "B" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                  result.grade === "C" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}>
                  {result.grade}
                </div>
                <p className="text-4xl font-bold text-[var(--logistics)]">{result.sustainabilityScore.toFixed(0)}</p>
                <p className="text-muted-foreground">out of 100</p>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Emissions Score</span>
                    <span className="font-medium">{Math.max(0, 100 - (result.sustainabilityScore * 0.4)).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--ocean)]"
                      style={{ width: `${Math.max(0, 100 - (result.sustainabilityScore * 0.4))}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Efficiency Score</span>
                    <span className="font-medium">{(result.sustainabilityScore * 0.8).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--logistics)]"
                      style={{ width: `${result.sustainabilityScore * 0.8}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Load Utilization</span>
                    <span className="font-medium">{loadFactor}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${loadFactor}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvement Suggestions */}
          <Card className="border-[var(--logistics)]/20">
            <CardHeader>
              <CardTitle className="text-[var(--logistics)]">Ways to Improve Your Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transportMode !== "ocean" && transportMode !== "rail" && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Ship className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Consider Ocean or Rail Transport</p>
                      <p className="text-sm text-muted-foreground">
                        These modes produce significantly lower emissions per tonne-km
                      </p>
                    </div>
                  </div>
                )}
                {loadFactor < 80 && (
                  <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Package className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Increase Load Factor</p>
                      <p className="text-sm text-muted-foreground">
                        Consolidate shipments or optimize container utilization
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Leaf className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Carbon Offsetting</p>
                    <p className="text-sm text-muted-foreground">
                      Purchase verified carbon credits to neutralize unavoidable emissions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Emission Factors Reference</CardTitle>
              <CardDescription>Based on GLEC Framework and IMO data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(EMISSION_FACTORS).map(([mode, types]) => {
                  const modeInfo = TRANSPORT_MODES.find(m => m.id === mode);
                  const Icon = modeInfo?.icon || Ship;
                  return (
                    <div key={mode}>
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-5 w-5" style={{ color: modeInfo?.color }} />
                        <h4 className="font-semibold">{modeInfo?.name || mode}</h4>
                      </div>
                      <div className="grid gap-2">
                        {Object.entries(types).map(([type, data]) => (
                          <div key={type} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium">{data.name}</p>
                              <p className="text-xs text-muted-foreground">{data.description}</p>
                            </div>
                            <Badge variant="outline">{data.factor} kg/t-km</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="methodology">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-[var(--ocean)]" />
                  Calculation Methodology
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Our carbon calculator uses emission factors from the <strong>GLEC Framework</strong> (Global 
                    Logistics Emissions Council) and <strong>IMO</strong> (International Maritime Organization) data. 
                    Emissions are calculated as:
                  </p>
                  <div className="p-3 bg-muted/50 rounded font-mono text-xs">
                    Emissions = Weight (tonnes) × Distance (km) × Emission Factor (kg CO₂e/tonne-km)
                  </div>
                  <p>
                    Emission factors vary by transport type, vessel/vehicle efficiency, fuel type, and load factors. 
                    Our default values represent industry averages for well-to-wheel (WTW) emissions.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="reduction">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  Tips to Reduce Emissions
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>Mode Shift:</strong> Ocean and rail produce 10-50x less CO₂ than air freight.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>Consolidation:</strong> Combine shipments to maximize load efficiency.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>Route Optimization:</strong> Direct routes reduce distance traveled.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>Sustainable Fuels:</strong> Ask carriers about biofuels and LNG options.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Leaf className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                      <span><strong>Carbon Offsetting:</strong> Purchase verified carbon credits for unavoidable emissions.</span>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => {
          setCargoWeight("10000");
          setDistance("10000");
          setLoadFactor(70);
          setReturnJourney(false);
          setOriginPort("");
          setDestPort("");
        }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}

export default LogisticsCarbonCalculator;
