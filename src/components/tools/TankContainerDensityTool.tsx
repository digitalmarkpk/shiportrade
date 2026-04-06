"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Droplets,
  Thermometer,
  Scale,
  AlertTriangle,
  CheckCircle2,
  Info,
  Beaker,
  Container,
  Fuel,
  Settings,
  Gauge,
  TrendingUp,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
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
  LineChart,
  Line,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";

// Tank container specifications
const TANK_CONTAINERS = {
  "20ft_iso": {
    name: "20' ISO Tank Container",
    capacity: 24000, // liters
    maxPayload: 26000, // kg
    tareWeight: 3600, // kg
    maxGrossWeight: 30480, // kg
    length: 6.058,
    width: 2.438,
    height: 2.591,
    pressure: "3-4 bar",
    workingPressure: 4, // bar
    testPressure: 6, // bar
    description: "Standard 20ft ISO tank for liquid chemicals and food products",
    maxSG: 1.8,
  },
  "20ft_highpressure": {
    name: "20' High Pressure Tank",
    capacity: 21000, // liters
    maxPayload: 28000, // kg
    tareWeight: 4200, // kg
    maxGrossWeight: 30480, // kg
    length: 6.058,
    width: 2.438,
    height: 2.591,
    pressure: "10-24 bar",
    workingPressure: 24, // bar
    testPressure: 36, // bar
    description: "High pressure tank for LPG, ammonia, and compressed gases",
    maxSG: 2.0,
  },
  "30ft_iso": {
    name: "30' ISO Tank Container",
    capacity: 35000, // liters
    maxPayload: 30000, // kg
    tareWeight: 5000, // kg
    maxGrossWeight: 35000, // kg
    length: 9.125,
    width: 2.438,
    height: 2.591,
    pressure: "3-4 bar",
    workingPressure: 4, // bar
    testPressure: 6, // bar
    description: "Larger capacity tank for bulk liquid transport",
    maxSG: 1.6,
  },
  "20ft_reversible": {
    name: "20' Reversible Coil Tank",
    capacity: 23000, // liters
    maxPayload: 25500, // kg
    tareWeight: 3800, // kg
    maxGrossWeight: 30480, // kg
    length: 6.058,
    width: 2.438,
    height: 2.591,
    pressure: "3-4 bar",
    workingPressure: 4, // bar
    testPressure: 6, // bar
    description: "Heated tank with reversible coils for viscous products",
    maxSG: 1.9,
  },
  "20ft_gas": {
    name: "20' Gas Tank Container",
    capacity: 24000, // liters (water capacity)
    maxPayload: 24000, // kg
    tareWeight: 4500, // kg
    maxGrossWeight: 30480, // kg
    length: 6.058,
    width: 2.438,
    height: 2.591,
    pressure: "17-24 bar",
    workingPressure: 24, // bar
    testPressure: 36, // bar
    description: "Cryogenic/gas tank for LNG, ethylene, propylene",
    maxSG: 1.5,
  },
};

// Temperature correction factors for common products
const TEMPERATURE_COEFFICIENTS: Record<string, { name: string; coeff: number; baseTemp: number }> = {
  "crude_oil": { name: "Crude Oil", coeff: 0.00075, baseTemp: 15 },
  "diesel": { name: "Diesel Fuel", coeff: 0.00080, baseTemp: 15 },
  "gasoline": { name: "Gasoline", coeff: 0.00100, baseTemp: 15 },
  "fuel_oil": { name: "Heavy Fuel Oil", coeff: 0.00065, baseTemp: 15 },
  "chemical_general": { name: "General Chemicals", coeff: 0.00085, baseTemp: 15 },
  "edible_oil": { name: "Edible Oil", coeff: 0.00070, baseTemp: 20 },
  "methanol": { name: "Methanol", coeff: 0.00120, baseTemp: 15 },
  "ethanol": { name: "Ethanol", coeff: 0.00110, baseTemp: 15 },
  "glycol": { name: "Glycol", coeff: 0.00060, baseTemp: 20 },
  "acid_sulfuric": { name: "Sulfuric Acid", coeff: 0.00055, baseTemp: 15 },
  "acid_phosphoric": { name: "Phosphoric Acid", coeff: 0.00050, baseTemp: 15 },
  "caustic_soda": { name: "Caustic Soda Solution", coeff: 0.00045, baseTemp: 15 },
  "liquid_fertilizer": { name: "Liquid Fertilizer", coeff: 0.00070, baseTemp: 15 },
  "latex": { name: "Latex", coeff: 0.00090, baseTemp: 20 },
};

// Hazard classes (IMDG)
const HAZARD_CLASSES: Record<string, { name: string; class: string; restrictions: string[]; compatible: string[] }> = {
  "non_hazardous": {
    name: "Non-Hazardous",
    class: "N/A",
    restrictions: [],
    compatible: ["all"],
  },
  "class_3_flammable": {
    name: "Class 3 - Flammable Liquids",
    class: "3",
    restrictions: ["No smoking", "Keep away from heat", "Ground container"],
    compatible: ["class_3_flammable", "class_6_toxic", "class_8_corrosive"],
  },
  "class_6_toxic": {
    name: "Class 6 - Toxic Substances",
    class: "6.1",
    restrictions: ["Avoid inhalation", "Protective equipment required", "Segregate from food"],
    compatible: ["class_3_flammable", "class_6_toxic"],
  },
  "class_8_corrosive": {
    name: "Class 8 - Corrosive Substances",
    class: "8",
    restrictions: ["Handle with care", "Protective clothing required", "Neutralization equipment available"],
    compatible: ["class_8_corrosive"],
  },
  "class_5_oxidizer": {
    name: "Class 5 - Oxidizing Substances",
    class: "5.1",
    restrictions: ["Keep away from combustibles", "No organic materials", "Separate storage"],
    compatible: [],
  },
  "class_2_gas": {
    name: "Class 2 - Gases",
    class: "2",
    restrictions: ["Pressure vessel", "Temperature control", "Valve protection"],
    compatible: ["class_2_gas"],
  },
  "class_9_misc": {
    name: "Class 9 - Miscellaneous",
    class: "9",
    restrictions: ["Case-by-case assessment", "Check SDS", "Temperature monitoring"],
    compatible: ["class_9_misc", "non_hazardous"],
  },
};

// Common product densities reference
const PRODUCT_DENSITIES: { product: string; sgMin: number; sgMax: number; temp: number; hazard: string }[] = [
  { product: "Water", sgMin: 1.0, sgMax: 1.0, temp: 4, hazard: "non_hazardous" },
  { product: "Diesel Fuel", sgMin: 0.82, sgMax: 0.86, temp: 15, hazard: "class_3_flammable" },
  { product: "Gasoline", sgMin: 0.71, sgMax: 0.77, temp: 15, hazard: "class_3_flammable" },
  { product: "Crude Oil", sgMin: 0.80, sgMax: 0.97, temp: 15, hazard: "class_3_flammable" },
  { product: "Heavy Fuel Oil", sgMin: 0.92, sgMax: 1.01, temp: 15, hazard: "class_3_flammable" },
  { product: "Methanol", sgMin: 0.791, sgMax: 0.791, temp: 20, hazard: "class_3_flammable" },
  { product: "Ethanol", sgMin: 0.789, sgMax: 0.789, temp: 20, hazard: "class_3_flammable" },
  { product: "Sulfuric Acid 98%", sgMin: 1.84, sgMax: 1.84, temp: 20, hazard: "class_8_corrosive" },
  { product: "Phosphoric Acid 85%", sgMin: 1.685, sgMax: 1.685, temp: 20, hazard: "class_8_corrosive" },
  { product: "Caustic Soda 50%", sgMin: 1.52, sgMax: 1.52, temp: 20, hazard: "class_8_corrosive" },
  { product: "Palm Oil", sgMin: 0.89, sgMax: 0.92, temp: 40, hazard: "non_hazardous" },
  { product: "Soybean Oil", sgMin: 0.91, sgMax: 0.93, temp: 20, hazard: "non_hazardous" },
  { product: "Glycol (MEG)", sgMin: 1.11, sgMax: 1.12, temp: 20, hazard: "non_hazardous" },
  { product: "Acetone", sgMin: 0.784, sgMax: 0.786, temp: 20, hazard: "class_3_flammable" },
  { product: "Toluene", sgMin: 0.866, sgMax: 0.867, temp: 20, hazard: "class_3_flammable" },
  { product: "Xylene", sgMin: 0.86, sgMax: 0.88, temp: 20, hazard: "class_3_flammable" },
  { product: "Latex", sgMin: 0.96, sgMax: 0.98, temp: 20, hazard: "non_hazardous" },
  { product: "Liquid Fertilizer (UAN)", sgMin: 1.28, sgMax: 1.33, temp: 20, hazard: "non_hazardous" },
];

interface CalculationResult {
  // Volume calculations
  fillVolume: number; // liters at fill ratio
  actualVolume: number; // liters at actual density
  
  // Weight calculations
  cargoWeight: number; // kg
  weightUtilization: number; // %
  volumeUtilization: number; // %
  
  // Temperature adjusted
  adjustedSG: number;
  temperatureCorrection: number;
  
  // Ullage
  ullageVolume: number; // liters
  ullagePercentage: number; // %
  
  // Limitation
  limitationType: "weight" | "volume" | "balanced";
  maxAllowableCargo: number; // kg
  
  // Warnings and recommendations
  warnings: string[];
  recommendations: string[];
  
  // Compliance
  sgCompliant: boolean;
  hazardCompatible: boolean;
}

export function TankContainerDensityTool() {
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Tank selection
  const [tankType, setTankType] = useState<keyof typeof TANK_CONTAINERS>("20ft_iso");
  
  // Product inputs
  const [productName, setProductName] = useState("");
  const [specificGravity, setSpecificGravity] = useState("1.0");
  const [temperature, setTemperature] = useState("15");
  const [referenceTemp, setReferenceTemp] = useState("15");
  const [productType, setProductType] = useState("chemical_general");
  
  // Filling parameters
  const [fillRatio, setFillRatio] = useState(96); // percentage
  const [hazardClass, setHazardClass] = useState("non_hazardous");
  
  // Get tank details
  const tank = TANK_CONTAINERS[tankType];
  
  // Calculate results
  const result = useMemo<CalculationResult>(() => {
    const sg = parseFloat(specificGravity) || 1.0;
    const temp = parseFloat(temperature) || 15;
    const refTemp = parseFloat(referenceTemp) || 15;
    const tempCoeff = TEMPERATURE_COEFFICIENTS[productType]?.coeff || 0.00085;
    
    // Temperature correction: SG at temp = SG at ref * (1 - coeff * (temp - refTemp))
    const tempDiff = temp - refTemp;
    const temperatureCorrection = -tempCoeff * tempDiff;
    const adjustedSG = sg * (1 + temperatureCorrection);
    
    // Volume at fill ratio
    const fillVolume = (tank.capacity * fillRatio) / 100;
    
    // Weight calculation (using adjusted SG)
    const cargoWeight = fillVolume * adjustedSG;
    
    // Ullage calculation
    const ullageVolume = tank.capacity - fillVolume;
    const ullagePercentage = ((ullageVolume / tank.capacity) * 100);
    
    // Utilizations
    const volumeUtilization = fillRatio;
    const weightUtilization = (cargoWeight / tank.maxPayload) * 100;
    
    // Determine limitation type
    let limitationType: "weight" | "volume" | "balanced";
    const maxWeightByVolume = tank.capacity * adjustedSG;
    const maxVolumeByWeight = tank.maxPayload / adjustedSG;
    
    if (maxWeightByVolume < tank.maxPayload) {
      limitationType = "volume";
    } else if (maxVolumeByWeight < tank.capacity) {
      limitationType = "weight";
    } else {
      limitationType = "balanced";
    }
    
    // Maximum allowable cargo
    const maxAllowableCargo = Math.min(maxWeightByVolume, tank.maxPayload);
    
    // Warnings
    const warnings: string[] = [];
    if (adjustedSG > tank.maxSG) {
      warnings.push(`Adjusted SG (${adjustedSG.toFixed(3)}) exceeds tank maximum (${tank.maxSG})`);
    }
    if (cargoWeight > tank.maxPayload) {
      warnings.push(`Cargo weight (${cargoWeight.toFixed(0)} kg) exceeds max payload (${tank.maxPayload} kg)`);
    }
    if (fillRatio > 98) {
      warnings.push("Fill ratio above 98% - insufficient ullage for thermal expansion");
    }
    if (fillRatio < 80 && hazardClass === "class_3_flammable") {
      warnings.push("Low fill ratio for flammable liquids - check vapor space requirements");
    }
    if (tempDiff > 30 || tempDiff < -30) {
      warnings.push(`Large temperature difference (${tempDiff.toFixed(0)}°C) - verify thermal correction`);
    }
    
    // Recommendations
    const recommendations: string[] = [];
    if (limitationType === "weight") {
      recommendations.push(`Weight limited - consider higher SG product or smaller tank`);
      const optimalFill = (tank.maxPayload / adjustedSG / tank.capacity) * 100;
      recommendations.push(`Optimal fill ratio: ${optimalFill.toFixed(1)}% for weight limit`);
    } else if (limitationType === "volume") {
      recommendations.push(`Volume limited - consider larger capacity tank`);
    }
    
    if (adjustedSG > 1.5) {
      recommendations.push("High SG product - verify tank structural integrity");
    }
    if (temp > 40) {
      recommendations.push("Elevated temperature - ensure heated tank capability");
    }
    
    // Check hazard compatibility
    const hazardInfo = HAZARD_CLASSES[hazardClass];
    const hazardCompatible = hazardInfo.compatible.includes("all") || 
      hazardInfo.compatible.length === 0 || 
      hazardClass === "non_hazardous";
    
    // SG compliance
    const sgCompliant = adjustedSG <= tank.maxSG;
    
    return {
      fillVolume,
      actualVolume: fillVolume,
      cargoWeight,
      weightUtilization: Math.min(weightUtilization, 100),
      volumeUtilization,
      adjustedSG,
      temperatureCorrection: temperatureCorrection * 100, // as percentage
      ullageVolume,
      ullagePercentage,
      limitationType,
      maxAllowableCargo,
      warnings,
      recommendations,
      sgCompliant,
      hazardCompatible,
    };
  }, [tankType, specificGravity, temperature, referenceTemp, productType, fillRatio, hazardClass, tank]);

  // Chart data
  const utilizationData = [
    { name: "Volume", value: result.volumeUtilization, fill: "#0F4C81" },
    { name: "Weight", value: result.weightUtilization, fill: "#2E8B57" },
  ];

  const fillBreakdownData = [
    { name: "Filled", value: result.fillVolume, fill: "#0F4C81" },
    { name: "Ullage", value: result.ullageVolume, fill: "#E5E7EB" },
  ];

  // Temperature effect data for chart
  const temperatureEffectData = useMemo(() => {
    const baseSG = parseFloat(specificGravity) || 1.0;
    const coeff = TEMPERATURE_COEFFICIENTS[productType]?.coeff || 0.00085;
    return Array.from({ length: 21 }, (_, i) => {
      const temp = -10 + i * 5; // -10 to 90°C
      const adjusted = baseSG * (1 - coeff * (temp - (parseFloat(referenceTemp) || 15)));
      return {
        temperature: temp,
        sg: adjusted,
        fill: 100 - (adjusted - baseSG) / baseSG * 100 * 5, // Visual fill change
      };
    });
  }, [specificGravity, productType, referenceTemp]);

  const COLORS = ["#0F4C81", "#E5E7EB"];

  // Handle product preset selection
  const handleProductPreset = (product: typeof PRODUCT_DENSITIES[0]) => {
    setSpecificGravity(product.sgMin.toString());
    setTemperature(product.temp.toString());
    setReferenceTemp(product.temp.toString());
    setHazardClass(product.hazard);
    setProductName(product.product);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="visual">Tank View</TabsTrigger>
          <TabsTrigger value="hazmat">Hazmat</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Tank Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Container className="h-5 w-5 text-[var(--ocean)]" />
                    Tank Container Selection
                  </CardTitle>
                  <CardDescription>Choose the appropriate tank type for your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(TANK_CONTAINERS).map(([key, t]) => (
                      <div
                        key={key}
                        onClick={() => setTankType(key as keyof typeof TANK_CONTAINERS)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          tankType === key
                            ? "border-[var(--ocean)] bg-[var(--ocean)]/10"
                            : "border-border hover:border-[var(--ocean)]/50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-sm">{t.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                          </div>
                          {tankType === key && (
                            <CheckCircle2 className="h-5 w-5 text-[var(--ocean)]" />
                          )}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs">
                          <span className="text-muted-foreground">Capacity: {(t.capacity / 1000).toFixed(0)}kL</span>
                          <span className="text-muted-foreground">Max Payload: {(t.maxPayload / 1000).toFixed(1)}t</span>
                          <span className="text-muted-foreground">Max SG: {t.maxSG}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Product Properties */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-[var(--logistics)]" />
                    Product Properties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Name (Optional)</Label>
                      <Input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Product Type</Label>
                      <Select value={productType} onValueChange={setProductType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TEMPERATURE_COEFFICIENTS).map(([key, val]) => (
                            <SelectItem key={key} value={key}>{val.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Specific Gravity (SG)</Label>
                      <Input
                        type="number"
                        step="0.001"
                        value={specificGravity}
                        onChange={(e) => setSpecificGravity(e.target.value)}
                        placeholder="1.000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Temperature (°C)</Label>
                      <Input
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Reference Temp (°C)</Label>
                      <Input
                        type="number"
                        value={referenceTemp}
                        onChange={(e) => setReferenceTemp(e.target.value)}
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Maximum Fill Ratio</Label>
                      <span className="text-sm font-medium text-[var(--ocean)]">{fillRatio}%</span>
                    </div>
                    <Slider
                      value={[fillRatio]}
                      onValueChange={(v) => setFillRatio(v[0])}
                      min={80}
                      max={99}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>80% (Conservative)</span>
                      <span>95-98% (Typical)</span>
                      <span>99% (Maximum)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Hazard Classification</Label>
                    <Select value={hazardClass} onValueChange={setHazardClass}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(HAZARD_CLASSES).map(([key, val]) => (
                          <SelectItem key={key} value={key}>
                            {val.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Results */}
              <Card className="border-[var(--ocean)]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                    Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Cargo Weight</p>
                      <p className="text-2xl font-bold text-[var(--ocean)]">
                        {result.cargoWeight.toFixed(0)} kg
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(result.cargoWeight / 1000).toFixed(2)} tonnes
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Fill Volume</p>
                      <p className="text-2xl font-bold text-[var(--logistics)]">
                        {result.fillVolume.toFixed(0)} L
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(result.fillVolume / 1000).toFixed(2)} m³
                      </p>
                    </div>
                  </div>

                  {/* Temperature Adjusted SG */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Temperature Adjusted SG</span>
                      <span className="font-bold">{result.adjustedSG.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">Correction Factor</span>
                      <span className={`text-xs ${result.temperatureCorrection >= 0 ? "text-green-500" : "text-amber-500"}`}>
                        {result.temperatureCorrection >= 0 ? "+" : ""}{result.temperatureCorrection.toFixed(3)}%
                      </span>
                    </div>
                  </div>

                  {/* Utilization Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Volume Utilization</span>
                        <span className="text-sm font-medium">{result.volumeUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress value={result.volumeUtilization} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Weight Utilization</span>
                        <span className={`text-sm font-medium ${result.weightUtilization > 100 ? "text-destructive" : ""}`}>
                          {result.weightUtilization.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(result.weightUtilization, 100)} 
                        className={`h-2 ${result.weightUtilization > 100 ? "[&>div]:bg-destructive" : "[&>div]:bg-[var(--logistics)]"}`} 
                      />
                    </div>
                  </div>

                  {/* Limitation Type */}
                  <div className={`p-4 rounded-lg ${
                    result.limitationType === "weight" 
                      ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" 
                      : result.limitationType === "volume"
                      ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                      : "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5" />
                      <span className="font-semibold">
                        {result.limitationType === "weight" 
                          ? "Weight Limited" 
                          : result.limitationType === "volume"
                          ? "Volume Limited"
                          : "Balanced Loading"}
                      </span>
                    </div>
                    <p className="text-sm mt-1 opacity-80">
                      Maximum allowable cargo: {(result.maxAllowableCargo / 1000).toFixed(2)} tonnes
                    </p>
                  </div>

                  {/* Ullage Info */}
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Ullage Space</p>
                      <p className="text-xs text-muted-foreground">Required for thermal expansion</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{result.ullageVolume.toFixed(0)} L</p>
                      <p className="text-xs text-muted-foreground">{result.ullagePercentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warnings */}
              {result.warnings.length > 0 && (
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        {result.warnings.map((warning, i) => (
                          <p key={i} className="text-sm text-amber-700 dark:text-amber-300">
                            {warning}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <p key={i} className="text-sm text-blue-700 dark:text-blue-300">
                            {rec}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Utilization Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Utilization Analysis</CardTitle>
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
        </TabsContent>

        {/* Temperature Tab */}
        <TabsContent value="temperature" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-[var(--ocean)]" />
                Temperature Effect on Density
              </CardTitle>
              <CardDescription>
                Visualizing how temperature changes affect specific gravity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={temperatureEffectData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="temperature" 
                      label={{ value: "Temperature (°C)", position: "bottom", offset: -5 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      label={{ value: "Specific Gravity", angle: -90, position: "insideLeft" }}
                      domain={["auto", "auto"]}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      label={{ value: "Fill Impact (%)", angle: 90, position: "insideRight" }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === "sg" ? value.toFixed(4) : value.toFixed(2),
                        name === "sg" ? "SG" : "Fill Impact"
                      ]}
                    />
                    <ReferenceLine 
                      x={parseFloat(temperature)} 
                      stroke="#2E8B57" 
                      strokeDasharray="5 5"
                      label={{ value: "Current Temp", position: "top" }}
                    />
                    <ReferenceLine 
                      yAxisId="left"
                      y={parseFloat(specificGravity)} 
                      stroke="#0F4C81" 
                      strokeDasharray="5 5"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="sg" 
                      stroke="#0F4C81" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="fill" 
                      fill="#2E8B5720" 
                      stroke="#2E8B57"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Temperature Correction Formula</h4>
                <code className="text-sm bg-background p-2 rounded block">
                  SG<sub>adjusted</sub> = SG<sub>base</sub> × (1 - α × ΔT)
                </code>
                <p className="text-sm text-muted-foreground mt-2">
                  Where α is the thermal expansion coefficient ({(TEMPERATURE_COEFFICIENTS[productType]?.coeff || 0.00085).toFixed(5)} /°C for {TEMPERATURE_COEFFICIENTS[productType]?.name || "General Chemicals"})
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Temperature Coefficients Table */}
          <Card>
            <CardHeader>
              <CardTitle>Thermal Expansion Coefficients</CardTitle>
              <CardDescription>Common product temperature correction factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Product</th>
                      <th className="text-right py-2 px-2">Coefficient (α)</th>
                      <th className="text-right py-2 px-2">Base Temp</th>
                      <th className="text-right py-2 px-2">Typical SG Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(TEMPERATURE_COEFFICIENTS).map(([key, val]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 px-2">{val.name}</td>
                        <td className="text-right py-2 px-2 font-mono">{val.coeff.toFixed(5)}</td>
                        <td className="text-right py-2 px-2">{val.baseTemp}°C</td>
                        <td className="text-right py-2 px-2">
                          {PRODUCT_DENSITIES.filter(p => p.product.toLowerCase().includes(key.split("_")[0])).map(p => p.sgMin).join(", ") || "Varies"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visual Tab */}
        <TabsContent value="visual" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5 text-[var(--ocean)]" />
                Tank Fill Level Visualization
              </CardTitle>
              <CardDescription>
                {tank.name} - {tank.capacity.toLocaleString()} liters capacity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tank Diagram */}
              <div className="relative mx-auto max-w-3xl">
                {/* Tank Container Shape */}
                <div className="relative aspect-[3/1] bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 rounded-lg border-4 border-slate-400 dark:border-slate-600 overflow-hidden">
                  {/* Fill Level */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${result.volumeUtilization}%` }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[var(--ocean)] to-[var(--ocean)]/70"
                  >
                    {/* Wave Animation */}
                    <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
                      <div className="absolute inset-0 bg-[var(--ocean)]/30 animate-wave" />
                    </div>
                  </motion.div>
                  
                  {/* Ullage Space Indicator */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-background/80 rounded-lg px-3 py-1">
                    <Fuel className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Ullage: {result.ullagePercentage.toFixed(1)}%</span>
                  </div>
                  
                  {/* Tank Markings */}
                  <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-between py-4">
                    <div className="text-xs text-muted-foreground">100%</div>
                    <div className="text-xs text-muted-foreground">75%</div>
                    <div className="text-xs text-muted-foreground">50%</div>
                    <div className="text-xs text-muted-foreground">25%</div>
                    <div className="text-xs text-muted-foreground">0%</div>
                  </div>
                  
                  {/* Center Info */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-4xl font-bold text-white drop-shadow-lg">
                      {result.volumeUtilization.toFixed(0)}%
                    </p>
                    <p className="text-white/80 text-sm">FILLED</p>
                  </div>
                </div>
                
                {/* Tank Info Below */}
                <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Capacity</p>
                    <p className="font-bold">{(tank.capacity / 1000).toFixed(0)}k L</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Filled</p>
                    <p className="font-bold text-[var(--ocean)]">{(result.fillVolume / 1000).toFixed(1)}k L</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="font-bold text-[var(--logistics)]">{(result.cargoWeight / 1000).toFixed(2)}t</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Max Payload</p>
                    <p className="font-bold">{(tank.maxPayload / 1000).toFixed(1)}t</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tank Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Tank Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Container className="h-4 w-4 text-[var(--ocean)]" />
                    Dimensions
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Length:</span>
                      <span className="ml-2 font-medium">{tank.length}m</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Width:</span>
                      <span className="ml-2 font-medium">{tank.width}m</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Height:</span>
                      <span className="ml-2 font-medium">{tank.height}m</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="ml-2 font-medium">{tank.capacity.toLocaleString()}L</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Scale className="h-4 w-4 text-[var(--logistics)]" />
                    Weight Limits
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Tare:</span>
                      <span className="ml-2 font-medium">{(tank.tareWeight / 1000).toFixed(1)}t</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Max Payload:</span>
                      <span className="ml-2 font-medium">{(tank.maxPayload / 1000).toFixed(1)}t</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Max Gross:</span>
                      <span className="ml-2 font-medium">{(tank.maxGrossWeight / 1000).toFixed(1)}t</span>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <span className="text-muted-foreground">Max SG:</span>
                      <span className="ml-2 font-medium">{tank.maxSG}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Pressure Rating</h4>
                  <div className="flex justify-between text-sm">
                    <span>Working Pressure:</span>
                    <span className="font-medium">{tank.workingPressure} bar</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Test Pressure:</span>
                    <span className="font-medium">{tank.testPressure} bar</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{tank.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hazmat Tab */}
        <TabsContent value="hazmat" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[var(--logistics)]" />
                Hazardous Material Classification
              </CardTitle>
              <CardDescription>
                IMDG Code classification and compatibility requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Hazard Class */}
              <div className={`p-4 rounded-lg ${
                hazardClass === "non_hazardous" 
                  ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
                  : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
              }`}>
                <div className="flex items-center gap-3">
                  <Shield className={`h-8 w-8 ${hazardClass === "non_hazardous" ? "text-green-500" : "text-amber-500"}`} />
                  <div>
                    <p className="font-semibold">{HAZARD_CLASSES[hazardClass].name}</p>
                    <p className="text-sm text-muted-foreground">
                      IMDG Class: {HAZARD_CLASSES[hazardClass].class}
                    </p>
                  </div>
                </div>
              </div>

              {/* Restrictions */}
              {HAZARD_CLASSES[hazardClass].restrictions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Handling Requirements</h4>
                  <ul className="space-y-2">
                    {HAZARD_CLASSES[hazardClass].restrictions.map((restriction, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compatibility */}
              <div>
                <h4 className="font-semibold mb-2">Compatible Cargo Classes</h4>
                <div className="flex flex-wrap gap-2">
                  {HAZARD_CLASSES[hazardClass].compatible.length === 0 || HAZARD_CLASSES[hazardClass].compatible.includes("all") ? (
                    <Badge variant="secondary">All Classes Compatible</Badge>
                  ) : (
                    HAZARD_CLASSES[hazardClass].compatible.map((compatible, i) => (
                      <Badge key={i} variant="secondary">
                        {HAZARD_CLASSES[compatible]?.name || compatible}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Hazard Classes Reference */}
          <Card>
            <CardHeader>
              <CardTitle>IMDG Hazard Classes Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Class</th>
                      <th className="text-left py-2 px-2">Name</th>
                      <th className="text-left py-2 px-2">Key Requirements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(HAZARD_CLASSES).map(([key, val]) => (
                      <tr key={key} className={`border-b ${hazardClass === key ? "bg-[var(--ocean)]/10" : ""}`}>
                        <td className="py-3 px-2">
                          <Badge variant={key === hazardClass ? "default" : "outline"}>
                            {val.class}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 font-medium">{val.name}</td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {val.restrictions.slice(0, 2).join(", ") || "Standard handling"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6 mt-6">
          {/* Product Densities Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-[var(--ocean)]" />
                Common Product Densities
              </CardTitle>
              <CardDescription>Click to use as preset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {PRODUCT_DENSITIES.map((product, i) => (
                  <div
                    key={i}
                    onClick={() => handleProductPreset(product)}
                    className="p-3 rounded-lg border cursor-pointer hover:border-[var(--ocean)] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{product.product}</p>
                      <Badge variant="outline" className="text-xs">
                        SG: {product.sgMin === product.sgMax ? product.sgMin : `${product.sgMin}-${product.sgMax}`}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{product.temp}°C</span>
                      {product.hazard !== "non_hazardous" && (
                        <Badge variant="destructive" className="text-xs">
                          {HAZARD_CLASSES[product.hazard]?.class}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filling Ratio Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Maximum Filling Ratio Guidelines</CardTitle>
              <CardDescription>
                Recommended fill ratios based on product type and conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-2xl font-bold text-green-600">95-97%</p>
                    <p className="text-sm text-muted-foreground">Standard Liquids</p>
                    <p className="text-xs mt-1">Low thermal expansion</p>
                  </div>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-2xl font-bold text-amber-600">90-95%</p>
                    <p className="text-sm text-muted-foreground">High Expansion</p>
                    <p className="text-xs mt-1">LNG, LPG, ammonia</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-2xl font-bold text-blue-600">97-98%</p>
                    <p className="text-sm text-muted-foreground">Temperature Controlled</p>
                    <p className="text-xs mt-1">Heated products</p>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Ullage Calculation</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Minimum ullage requirements based on IMDG Code:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li>• <strong>General liquids:</strong> 2-5% ullage minimum</li>
                    <li>• <strong>Flammable liquids:</strong> 3-5% ullage minimum</li>
                    <li>• <strong>Liquefied gases:</strong> Refer to IGC Code</li>
                    <li>• <strong>Temperature-sensitive:</strong> Additional 1-2% per 10°C range</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tank Container Education */}
          <Card>
            <CardHeader>
              <CardTitle>Understanding Tank Containers</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-tank">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Container className="h-4 w-4 text-[var(--ocean)]" />
                      What is a Tank Container?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        A tank container (ISO tank) is a stainless steel vessel enclosed in a protective steel frame 
                        that conforms to ISO container dimensions. It&apos;s designed for the transport of bulk liquids, 
                        gases, and powders.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h5 className="font-semibold text-foreground mb-1">Advantages</h5>
                          <ul className="space-y-1">
                            <li>✓ Intermodal transport (sea, road, rail)</li>
                            <li>✓ No product transfer needed</li>
                            <li>✓ Reduced contamination risk</li>
                            <li>✓ Efficient loading/unloading</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <h5 className="font-semibold text-foreground mb-1">Common Uses</h5>
                          <ul className="space-y-1">
                            <li>• Chemical transport</li>
                            <li>• Food-grade liquids</li>
                            <li>• Petroleum products</li>
                            <li>• Liquefied gases</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="filling-ratio">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-[var(--logistics)]" />
                      Why is Filling Ratio Important?
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        The filling ratio determines how much of the tank&apos;s capacity is utilized. Proper filling 
                        is critical for safety and regulatory compliance:
                      </p>
                      <div className="space-y-2">
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                          <h5 className="font-semibold text-amber-700 dark:text-amber-300 mb-1">⚠️ Overfilling Risks</h5>
                          <ul className="space-y-1 text-amber-700 dark:text-amber-300">
                            <li>• Insufficient ullage for thermal expansion</li>
                            <li>• Pressure buildup in transit</li>
                            <li>• Potential structural damage</li>
                            <li>• Regulatory violations</li>
                          </ul>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">❄️ Underfilling Issues</h5>
                          <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                            <li>• Product surge during transit</li>
                            <li>• Inefficient use of container</li>
                            <li>• Increased per-unit transport cost</li>
                            <li>• Vapor space for flammables</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="weight-volume">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[var(--ocean)]" />
                      Weight vs Volume Limitation
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Tank containers are subject to both weight and volume constraints. Understanding which 
                        limitation applies helps optimize loading:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                          <h5 className="font-semibold text-foreground mb-2">Volume Limited</h5>
                          <p className="text-xs mb-2">When SG × Capacity &lt; Max Payload</p>
                          <p className="text-xs">
                            Common for light products (SG &lt; 1.0): gasoline, ethanol, some chemicals.
                            You run out of space before hitting weight limit.
                          </p>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                          <h5 className="font-semibold text-foreground mb-2">Weight Limited</h5>
                          <p className="text-xs mb-2">When SG × Capacity &gt; Max Payload</p>
                          <p className="text-xs">
                            Common for heavy products (SG &gt; 1.3): acids, caustic soda, some oils.
                            You hit weight limit before tank is full.
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="font-medium">Optimal Loading:</p>
                        <p className="text-xs mt-1">
                          For weight-limited cargo, calculate fill ratio as: (Max Payload ÷ (SG × Capacity)) × 100
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sg-importance">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Beaker className="h-4 w-4 text-[var(--logistics)]" />
                      Understanding Specific Gravity (SG)
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Specific Gravity (SG) is the ratio of a substance&apos;s density to the density of water 
                        at a reference temperature (typically 15°C or 20°C).
                      </p>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <code className="text-sm">SG = ρ<sub>substance</sub> / ρ<sub>water</sub></code>
                      </div>
                      <div className="space-y-2">
                        <p><strong>SG &lt; 1.0:</strong> Product floats on water (lighter than water)</p>
                        <p><strong>SG = 1.0:</strong> Product has same density as water</p>
                        <p><strong>SG &gt; 1.0:</strong> Product sinks in water (heavier than water)</p>
                      </div>
                      <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="font-medium text-amber-700 dark:text-amber-300">Important:</p>
                        <p className="text-xs mt-1 text-amber-700 dark:text-amber-300">
                          Tank containers have a maximum SG rating. Exceeding this can cause structural 
                          failure. Always check the tank&apos;s max SG before loading heavy products.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => {
          setSpecificGravity("1.0");
          setTemperature("15");
          setReferenceTemp("15");
          setFillRatio(96);
          setHazardClass("non_hazardous");
          setProductName("");
        }}>
          Reset
        </Button>
        <Button size="sm" className="gradient-ocean">
          Export Report
        </Button>
      </div>
    </div>
  );
}
