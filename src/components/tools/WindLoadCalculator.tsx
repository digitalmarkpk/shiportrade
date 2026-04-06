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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Wind,
  Gauge,
  Ruler,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Ship,
  Target,
  Zap,
  Compass,
  ArrowUp,
  Info,
  Anchor,
  Shield,
  TrendingUp,
  HelpCircle,
  BookOpen,
  BarChart3,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  Cell,
  PieChart,
  Pie,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants/chartColors";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Beaufort Scale data
const BEAUFORT_SCALE = [
  { scale: 0, description: "Calm", windRange: "< 1 km/h", msRange: "< 0.3 m/s", knotsRange: "< 1 kn", seaCondition: "Sea like a mirror" },
  { scale: 1, description: "Light Air", windRange: "1-5 km/h", msRange: "0.3-1.5 m/s", knotsRange: "1-3 kn", seaCondition: "Ripples with appearance of scales" },
  { scale: 2, description: "Light Breeze", windRange: "6-11 km/h", msRange: "1.6-3.3 m/s", knotsRange: "4-6 kn", seaCondition: "Small wavelets" },
  { scale: 3, description: "Gentle Breeze", windRange: "12-19 km/h", msRange: "3.4-5.4 m/s", knotsRange: "7-10 kn", seaCondition: "Large wavelets, crests begin to break" },
  { scale: 4, description: "Moderate Breeze", windRange: "20-28 km/h", msRange: "5.5-7.9 m/s", knotsRange: "11-16 kn", seaCondition: "Small waves, frequent white horses" },
  { scale: 5, description: "Fresh Breeze", windRange: "29-38 km/h", msRange: "8.0-10.7 m/s", knotsRange: "17-21 kn", seaCondition: "Moderate waves, many white horses" },
  { scale: 6, description: "Strong Breeze", windRange: "39-49 km/h", msRange: "10.8-13.8 m/s", knotsRange: "22-27 kn", seaCondition: "Large waves, extensive foam crests" },
  { scale: 7, description: "Near Gale", windRange: "50-61 km/h", msRange: "13.9-17.1 m/s", knotsRange: "28-33 kn", seaCondition: "Sea heaps up, foam blows in streaks" },
  { scale: 8, description: "Gale", windRange: "62-74 km/h", msRange: "17.2-20.7 m/s", knotsRange: "34-40 kn", seaCondition: "Moderately high waves, foam blown in streaks" },
  { scale: 9, description: "Strong Gale", windRange: "75-88 km/h", msRange: "20.8-24.4 m/s", knotsRange: "41-47 kn", seaCondition: "High waves, dense foam streaks" },
  { scale: 10, description: "Storm", windRange: "89-102 km/h", msRange: "24.5-28.4 m/s", knotsRange: "48-55 kn", seaCondition: "Very high waves, overhanging crests" },
  { scale: 11, description: "Violent Storm", windRange: "103-117 km/h", msRange: "28.5-32.6 m/s", knotsRange: "56-63 kn", seaCondition: "Exceptionally high waves" },
  { scale: 12, description: "Hurricane", windRange: "> 117 km/h", msRange: "> 32.7 m/s", knotsRange: "> 64 kn", seaCondition: "Air filled with foam and spray" },
];

// Shape factors (drag coefficients) for different cargo types
const SHAPE_FACTORS = [
  { type: "flat_plate", name: "Flat Plate/Square", cd: 1.28, description: "Large flat surfaces perpendicular to wind" },
  { type: "cube", name: "Cube/Box", cd: 1.05, description: "Standard container or box cargo" },
  { type: "cylinder_vertical", name: "Vertical Cylinder", cd: 0.82, description: "Tanks, pipes standing vertically" },
  { type: "cylinder_horizontal", name: "Horizontal Cylinder", cd: 0.60, description: "Pipes, tanks lying horizontally" },
  { type: "sphere", name: "Sphere", cd: 0.47, description: "Spherical containers or tanks" },
  { type: "angled_45", name: "Angled Surface (45°)", cd: 0.75, description: "Surfaces at 45° to wind" },
  { type: "streamlined", name: "Streamlined", cd: 0.35, description: "Aerodynamic shapes" },
  { type: "complex", name: "Complex Structure", cd: 1.20, description: "Machinery, irregular shapes" },
];

// Air density at different conditions
const AIR_DENSITY = {
  standard: { name: "Standard (15°C, sea level)", rho: 1.225 },
  cold: { name: "Cold (-15°C, sea level)", rho: 1.35 },
  hot: { name: "Hot (35°C, sea level)", rho: 1.15 },
  high_altitude: { name: "High Altitude (15°C, 2000m)", rho: 0.95 },
};

// Wind direction relative to ship
const WIND_DIRECTIONS = [
  { direction: "headwind", name: "Headwind (0°)", angle: 0, factor: 1.0, description: "Wind directly from bow" },
  { direction: "bow_quarter", name: "Bow Quarter (30°)", angle: 30, factor: 0.87, description: "Wind 30° off bow" },
  { direction: "beam", name: "Beam Wind (90°)", angle: 90, factor: 0.5, description: "Wind from side" },
  { direction: "stern_quarter", name: "Stern Quarter (150°)", angle: 150, factor: 0.13, description: "Wind 30° off stern" },
  { direction: "following", name: "Following Wind (180°)", angle: 180, factor: 0.0, description: "Wind from stern" },
];

// Risk level thresholds
const RISK_THRESHOLDS = {
  low: { maxForce: 50, color: LOGISTICS_GREEN, label: "Low Risk", description: "Standard lashing sufficient" },
  moderate: { maxForce: 100, color: "#F59E0B", label: "Moderate Risk", description: "Enhanced lashing recommended" },
  high: { maxForce: 200, color: "#EF4444", label: "High Risk", description: "Additional securing required" },
  critical: { maxForce: Infinity, color: "#991B1B", label: "Critical", description: "Unsafe conditions - delay departure" },
};

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is wind load and why is it important for cargo securing?",
    answer: "Wind load is the force exerted by wind on a surface. For maritime cargo, understanding wind load is critical because vessels at sea experience significant wind forces that can shift or damage improperly secured cargo. Wind force increases with the square of wind speed, meaning doubling wind speed quadruples the force on cargo. This makes proper calculation essential for safe transport."
  },
  {
    question: "How do I calculate the windward surface area of my cargo?",
    answer: "The windward surface area is the projected area of the cargo perpendicular to the wind direction. For a rectangular container, it would be length × height when wind hits the side, or width × height when wind hits the front/back. For complex shapes, use the largest projected area or consult engineering drawings. Always consider the worst-case orientation."
  },
  {
    question: "What is a shape factor (drag coefficient) and how do I choose the right one?",
    answer: "The shape factor (Cd) represents how aerodynamic an object is. Flat surfaces have high drag (Cd ≈ 1.28), while streamlined shapes have low drag (Cd ≈ 0.35). Choose based on your cargo's profile facing the wind: standard containers typically use Cd = 1.05, cylindrical tanks use 0.60-0.82 depending on orientation, and irregular machinery may use 1.20."
  },
  {
    question: "What is apparent wind and how does it affect wind load calculations?",
    answer: "Apparent wind is the wind experienced by a moving vessel, combining true wind with the effect of the ship's motion. When a ship sails into headwind, apparent wind speed increases, resulting in higher wind forces. Conversely, following winds reduce apparent wind speed. Always calculate wind loads using apparent wind, not just true wind."
  },
  {
    question: "What safety factor should I use for lashing calculations?",
    answer: "Industry standards recommend safety factors between 1.5-3.0 depending on conditions. Use 1.5 for standard conditions, 2.0 for normal operations (recommended minimum), 2.5 for heavy weather routes, and 3.0 for extreme conditions or critical cargo. The CSS Code provides detailed guidance on appropriate safety factors."
  },
  {
    question: "How does air density affect wind load calculations?",
    answer: "Air density varies with temperature and altitude. Standard conditions (15°C at sea level) use ρ = 1.225 kg/m³. Cold air is denser (up to 1.35 kg/m³ at -15°C), resulting in higher wind forces. Hot air is less dense (1.15 kg/m³ at 35°C), reducing forces. For accuracy, consider the expected voyage conditions."
  },
  {
    question: "What are the Beaufort Scale wind force categories?",
    answer: "The Beaufort Scale classifies winds from 0 (Calm) to 12 (Hurricane). Forces 0-5 are generally safe for cargo operations, 6-7 require enhanced precautions, and 8+ may require delaying operations. Each scale corresponds to specific wind speed ranges and sea conditions, helping crews assess operational risk."
  },
  {
    question: "How does cargo position on the ship affect wind exposure?",
    answer: "Deck cargo experiences full wind exposure and requires maximum securing. Semi-sheltered positions (behind forecastle or poop deck) have reduced but still significant wind loads. Below-deck cargo has minimal wind exposure but is affected by ship motion forces. Always position sensitive cargo in protected areas when possible."
  },
];

interface WindLoadResult {
  windSpeed: {
    ms: number;
    kmh: number;
    knots: number;
  };
  windPressure: number;
  windForce: number;
  windForceKn: number;
  apparentWind: {
    speed: number;
    angle: number;
  };
  beaufortScale: number;
  beaufortDescription: string;
  riskLevel: keyof typeof RISK_THRESHOLDS;
  lashingForce: number;
  safetyMargin: number;
  forcePerUnitArea: number;
}

export function WindLoadCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Input parameters
  const [windSpeed, setWindSpeed] = useState<string>("50");
  const [windSpeedUnit, setWindSpeedUnit] = useState<"kmh" | "ms" | "knots">("kmh");
  const [cargoArea, setCargoArea] = useState<string>("50");
  const [shapeFactor, setShapeFactor] = useState<string>("cube");
  const [airDensityType, setAirDensityType] = useState<keyof typeof AIR_DENSITY>("standard");
  const [windDirection, setWindDirection] = useState<string>("headwind");
  const [shipSpeed, setShipSpeed] = useState<string>("15");
  const [shipCourse, setShipCourse] = useState<string>("0");
  const [safetyFactor, setSafetyFactor] = useState<number>(1.5);
  const [cargoWeight, setCargoWeight] = useState<string>("25000");
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.4);

  // Convert wind speed to m/s
  const convertWindSpeed = useMemo(() => {
    const value = parseFloat(windSpeed) || 0;
    switch (windSpeedUnit) {
      case "kmh":
        return value / 3.6;
      case "knots":
        return value * 0.514444;
      case "ms":
      default:
        return value;
    }
  }, [windSpeed, windSpeedUnit]);

  // Calculate wind load
  const result = useMemo((): WindLoadResult => {
    const v = convertWindSpeed;
    const area = parseFloat(cargoArea) || 0;
    const shape = SHAPE_FACTORS.find(s => s.type === shapeFactor) || SHAPE_FACTORS[1];
    const rho = AIR_DENSITY[airDensityType].rho;
    const direction = WIND_DIRECTIONS.find(d => d.direction === windDirection) || WIND_DIRECTIONS[0];
    const shipV = (parseFloat(shipSpeed) || 0) * 0.514444;
    const weight = parseFloat(cargoWeight) || 0;
    
    const windPressure = 0.5 * rho * v * v;
    const windForce = windPressure * area * shape.cd;
    const windForceKn = windForce / 1000;
    
    const course = parseFloat(shipCourse) || 0;
    const courseRad = course * Math.PI / 180;
    
    const apparentSpeedMs = Math.sqrt(
      v * v + shipV * shipV - 2 * v * shipV * Math.cos(courseRad + Math.PI)
    );
    const apparentAngle = Math.atan2(
      shipV * Math.sin(courseRad),
      v - shipV * Math.cos(courseRad)
    ) * 180 / Math.PI;
    
    const directionFactor = direction.factor;
    const adjustedForce = windForceKn * directionFactor;
    
    const windSpeedKmh = v * 3.6;
    let beaufortScale = Math.min(12, Math.floor(Math.pow(windSpeedKmh / 3.6, 2/3)));
    if (windSpeedKmh > 117) beaufortScale = 12;
    
    const beaufortDescription = BEAUFORT_SCALE[beaufortScale]?.description || "Unknown";
    
    let riskLevel: keyof typeof RISK_THRESHOLDS = "low";
    if (adjustedForce > 200) riskLevel = "critical";
    else if (adjustedForce > 100) riskLevel = "high";
    else if (adjustedForce > 50) riskLevel = "moderate";
    
    const g = 9.81;
    const frictionForce = (weight * g * frictionCoeff) / 1000;
    const netForce = Math.max(0, adjustedForce - frictionForce);
    const lashingForce = netForce * safetyFactor;
    
    const safetyMargin = frictionForce > 0 ? ((frictionForce / adjustedForce) * 100) : 0;
    const forcePerUnitArea = windPressure * shape.cd;
    
    return {
      windSpeed: {
        ms: v,
        kmh: v * 3.6,
        knots: v * 1.94384,
      },
      windPressure,
      windForce,
      windForceKn: adjustedForce,
      apparentWind: {
        speed: apparentSpeedMs,
        angle: apparentAngle,
      },
      beaufortScale,
      beaufortDescription,
      riskLevel,
      lashingForce,
      safetyMargin,
      forcePerUnitArea,
    };
  }, [
    convertWindSpeed, cargoArea, shapeFactor, airDensityType, 
    windDirection, shipSpeed, shipCourse, safetyFactor, cargoWeight, frictionCoeff
  ]);

  // Force breakdown chart data
  const forceData = useMemo(() => [
    { component: "Wind Pressure", value: result.windPressure, unit: "Pa", color: OCEAN_BLUE },
    { component: "Wind Force", value: result.windForceKn * 100, unit: "kN×100", color: LOGISTICS_GREEN },
    { component: "Lashing Required", value: result.lashingForce * 100, unit: "kN×100", color: "#F59E0B" },
  ], [result]);

  // Wind speed comparison chart
  const windSpeedData = useMemo(() => {
    return [
      { label: "True Wind", speed: result.windSpeed.kmh, fill: OCEAN_BLUE },
      { label: "Apparent Wind", speed: result.apparentWind.speed * 3.6, fill: LOGISTICS_GREEN },
      { label: "Ship Speed", speed: (parseFloat(shipSpeed) || 0), fill: "#F59E0B" },
    ];
  }, [result, shipSpeed]);

  // Force vs wind speed chart
  const forceVsSpeedData = useMemo(() => {
    const data = [];
    for (let speed = 0; speed <= 120; speed += 10) {
      const v = speed / 3.6;
      const rho = AIR_DENSITY[airDensityType].rho;
      const area = parseFloat(cargoArea) || 0;
      const shape = SHAPE_FACTORS.find(s => s.type === shapeFactor) || SHAPE_FACTORS[1];
      const pressure = 0.5 * rho * v * v;
      const force = (pressure * area * shape.cd) / 1000;
      data.push({
        speed,
        force: parseFloat(force.toFixed(2)),
      });
    }
    return data;
  }, [airDensityType, cargoArea, shapeFactor]);

  // Risk distribution data for pie chart
  const riskDistributionData = useMemo(() => {
    const total = result.windForceKn + (result.safetyMargin / 100 * result.windForceKn);
    return [
      { name: "Wind Force", value: result.windForceKn, color: OCEAN_BLUE },
      { name: "Friction Benefit", value: total - result.windForceKn, color: LOGISTICS_GREEN },
    ];
  }, [result]);

  // Beaufort scale radar data
  const beaufortRadarData = useMemo(() => {
    const currentScale = result.beaufortScale;
    return [
      { subject: "Wind Speed", current: Math.min(currentScale / 12 * 100, 100), limit: 50 },
      { subject: "Sea State", current: Math.min(currentScale / 12 * 100, 100), limit: 50 },
      { subject: "Force Risk", current: Math.min(result.windForceKn / 2, 100), limit: 50 },
      { subject: "Lashing Need", current: Math.min(result.lashingForce / 2, 100), limit: 50 },
      { subject: "Operation Risk", current: currentScale >= 8 ? 100 : currentScale >= 6 ? 60 : 30, limit: 50 },
    ];
  }, [result]);

  // Beaufort scale colors
  const getBeaufortColor = (scale: number) => {
    if (scale <= 3) return LOGISTICS_GREEN;
    if (scale <= 5) return "#84CC16";
    if (scale <= 7) return "#F59E0B";
    if (scale <= 9) return "#EF4444";
    return "#991B1B";
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 md:p-12"
        style={{ 
          background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, #1a5f9e 50%, ${LOGISTICS_GREEN} 100%)` 
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 max-w-4xl">
          <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Wind className="h-3.5 w-3.5 mr-1.5" />
            Project Cargo Tool
          </Badge>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Wind Load Calculator
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl">
            Calculate wind forces on project cargo using Bernoulli&apos;s equation. 
            Determine lashing requirements and assess operational risks for maritime transport.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-white/80">
              <Shield className="h-5 w-5" />
              <span className="text-sm">CSS Code Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Target className="h-5 w-5" />
              <span className="text-sm">Beaufort Scale</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Force Analysis</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-1">Wind Pressure</p>
              <p className="text-2xl font-bold text-white">{result.windPressure.toFixed(0)} Pa</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-1">Wind Force</p>
              <p className="text-2xl font-bold text-white">{result.windForceKn.toFixed(2)} kN</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-1">Beaufort Scale</p>
              <p className="text-2xl font-bold text-white">Force {result.beaufortScale}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <p className="text-white/70 text-sm mb-1">Risk Level</p>
              <p className="text-2xl font-bold text-white">{RISK_THRESHOLDS[result.riskLevel].label}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex flex-col items-center gap-1 py-3">
            <Calculator className="h-4 w-4" />
            <span className="text-xs">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="beaufort" className="flex flex-col items-center gap-1 py-3">
            <Gauge className="h-4 w-4" />
            <span className="text-xs">Beaufort</span>
          </TabsTrigger>
          <TabsTrigger value="apparent" className="flex flex-col items-center gap-1 py-3">
            <Compass className="h-4 w-4" />
            <span className="text-xs">Apparent Wind</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex flex-col items-center gap-1 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex flex-col items-center gap-1 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">Resources</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Wind Load Parameters
                </CardTitle>
                <CardDescription>Enter wind and cargo parameters for calculation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {/* Wind Speed Input */}
                  <div>
                    <Label>Wind Speed</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        type="number"
                        value={windSpeed}
                        onChange={(e) => setWindSpeed(e.target.value)}
                        className="flex-1"
                      />
                      <Select value={windSpeedUnit} onValueChange={(v) => setWindSpeedUnit(v as typeof windSpeedUnit)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kmh">km/h</SelectItem>
                          <SelectItem value="ms">m/s</SelectItem>
                          <SelectItem value="knots">knots</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>{result.windSpeed.ms.toFixed(1)} m/s</span>
                      <span>{result.windSpeed.kmh.toFixed(1)} km/h</span>
                      <span>{result.windSpeed.knots.toFixed(1)} knots</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Cargo Surface Area */}
                  <div>
                    <Label htmlFor="cargoArea">Cargo Windward Surface Area (m²)</Label>
                    <Input
                      id="cargoArea"
                      type="number"
                      step="0.1"
                      value={cargoArea}
                      onChange={(e) => setCargoArea(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Projected area perpendicular to wind direction
                    </p>
                  </div>

                  {/* Shape Factor */}
                  <div>
                    <Label>Shape Factor (Drag Coefficient Cd)</Label>
                    <Select value={shapeFactor} onValueChange={setShapeFactor}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SHAPE_FACTORS.map((shape) => (
                          <SelectItem key={shape.type} value={shape.type}>
                            {shape.name} (Cd = {shape.cd})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Air Density */}
                  <div>
                    <Label>Air Density Condition</Label>
                    <Select value={airDensityType} onValueChange={(v) => setAirDensityType(v as keyof typeof AIR_DENSITY)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(AIR_DENSITY).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name} (ρ = {data.rho} kg/m³)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Wind Direction */}
                  <div>
                    <Label>Wind Direction Relative to Ship</Label>
                    <Select value={windDirection} onValueChange={setWindDirection}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {WIND_DIRECTIONS.map((dir) => (
                          <SelectItem key={dir.direction} value={dir.direction}>
                            {dir.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card style={{ borderColor: `${OCEAN_BLUE}30` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Wind Load Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Beaufort Scale Indicator */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Beaufort Scale</span>
                      <Badge 
                        style={{ backgroundColor: getBeaufortColor(result.beaufortScale) }}
                        className="text-white"
                      >
                        Force {result.beaufortScale}
                      </Badge>
                    </div>
                    <p className="font-medium">{result.beaufortDescription}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {BEAUFORT_SCALE[result.beaufortScale]?.seaCondition}
                    </p>
                  </div>

                  {/* Wind Pressure & Force */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                      <p className="text-xs text-muted-foreground">Wind Pressure</p>
                      <p className="text-xl font-bold" style={{ color: OCEAN_BLUE }}>
                        {result.windPressure.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Pa (N/m²)</p>
                    </div>
                    <div className="p-3 rounded-lg text-center" style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}>
                      <p className="text-xs text-muted-foreground">Wind Force</p>
                      <p className="text-xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                        {result.windForceKn.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">kN</p>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `${RISK_THRESHOLDS[result.riskLevel].color}15` }}
                  >
                    <div className="flex items-center gap-2">
                      {result.riskLevel === "low" ? (
                        <CheckCircle2 style={{ color: RISK_THRESHOLDS[result.riskLevel].color }} className="h-5 w-5" />
                      ) : (
                        <AlertTriangle style={{ color: RISK_THRESHOLDS[result.riskLevel].color }} className="h-5 w-5" />
                      )}
                      <div>
                        <p className="font-medium" style={{ color: RISK_THRESHOLDS[result.riskLevel].color }}>
                          {RISK_THRESHOLDS[result.riskLevel].label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {RISK_THRESHOLDS[result.riskLevel].description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lashing Requirement */}
                  <div className="p-4 bg-amber-500/10 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Lashing Force Required</p>
                      <Badge variant="outline" className="border-amber-500 text-amber-600">
                        SF = {safetyFactor}x
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">
                      {result.lashingForce.toFixed(2)} kN
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Friction contribution: {result.safetyMargin.toFixed(0)}%
                    </p>
                  </div>

                  {/* Force per unit area */}
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Force per m²</span>
                    <span className="font-bold">{result.forcePerUnitArea.toFixed(1)} N/m²</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cargo Weight and Safety Factor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Lashing Parameters
              </CardTitle>
              <CardDescription>Adjust cargo weight and safety factor for lashing calculation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cargoWeight">Cargo Weight (kg)</Label>
                  <Input
                    id="cargoWeight"
                    type="number"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(e.target.value)}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used for friction calculation
                  </p>
                </div>
                
                <div>
                  <Label>Friction Coefficient</Label>
                  <div className="mt-2">
                    <Slider
                      value={[frictionCoeff]}
                      onValueChange={(v) => setFrictionCoeff(v[0])}
                      min={0.1}
                      max={0.8}
                      step={0.05}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0.1 (Steel/Steel)</span>
                      <span className="font-medium" style={{ color: OCEAN_BLUE }}>{frictionCoeff.toFixed(2)}</span>
                      <span>0.8 (Rubber mat)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Safety Factor</Label>
                <Select value={safetyFactor.toString()} onValueChange={(v) => setSafetyFactor(parseFloat(v))}>
                  <SelectTrigger className="w-full mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">1.0 - No safety margin</SelectItem>
                    <SelectItem value="1.25">1.25 - Minimum</SelectItem>
                    <SelectItem value="1.5">1.5 - Standard</SelectItem>
                    <SelectItem value="2.0">2.0 - Recommended</SelectItem>
                    <SelectItem value="2.5">2.5 - Heavy weather</SelectItem>
                    <SelectItem value="3.0">3.0 - Extreme conditions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="beaufort" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Beaufort Wind Scale
              </CardTitle>
              <CardDescription>International scale for wind force classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Scale</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-center py-3 px-4">km/h</th>
                      <th className="text-center py-3 px-4">m/s</th>
                      <th className="text-center py-3 px-4">Knots</th>
                      <th className="text-left py-3 px-4">Sea Conditions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BEAUFORT_SCALE.map((item) => (
                      <tr 
                        key={item.scale} 
                        className={`border-b ${item.scale === result.beaufortScale ? `bg-[${OCEAN_BLUE}]/10 font-medium` : ""}`}
                        style={item.scale === result.beaufortScale ? { backgroundColor: `${OCEAN_BLUE}10` } : {}}
                      >
                        <td className="py-3 px-4">
                          <Badge 
                            style={{ backgroundColor: getBeaufortColor(item.scale) }}
                            className="text-white"
                          >
                            {item.scale}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="text-center py-3 px-4">{item.windRange}</td>
                        <td className="text-center py-3 px-4">{item.msRange}</td>
                        <td className="text-center py-3 px-4">{item.knotsRange}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.seaCondition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Visual Beaufort Scale */}
              <div className="mt-6">
                <h4 className="font-medium mb-4">Visual Wind Scale</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={BEAUFORT_SCALE.slice(0, 13)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" label={{ value: "Max Speed (km/h)", position: "bottom", fontSize: 12 }} />
                      <YAxis dataKey="description" type="category" width={100} tick={{ fontSize: 10 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value} km/h`, "Max Wind Speed"]}
                        labelFormatter={(label) => `Scale: ${label}`}
                      />
                      <Bar dataKey={(d) => d.scale < 12 ? parseInt(d.windRange.split("-")[1]?.replace(">", "") || "117") : 150} radius={[0, 4, 4, 0]}>
                        {BEAUFORT_SCALE.slice(0, 13).map((entry) => (
                          <Cell 
                            key={`cell-${entry.scale}`} 
                            fill={getBeaufortColor(entry.scale)} 
                            opacity={entry.scale === result.beaufortScale ? 1 : 0.5}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <p className="font-medium">Safe Operations (0-5)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Normal cargo operations can proceed. Standard lashing sufficient.
                  </p>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-5 w-5 text-amber-500" />
                    <p className="font-medium">Caution Required (6-7)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enhanced lashing required. Monitor weather closely.
                  </p>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <p className="font-medium">Dangerous (8+)</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Consider delaying operations. Extra securing measures essential.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apparent" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Compass className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Apparent Wind Calculator
              </CardTitle>
              <CardDescription>Calculate the effect of ship speed on apparent wind</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="shipSpeed">Ship Speed (knots)</Label>
                  <Input
                    id="shipSpeed"
                    type="number"
                    value={shipSpeed}
                    onChange={(e) => setShipSpeed(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="shipCourse">Ship Course Relative to True Wind (°)</Label>
                  <Input
                    id="shipCourse"
                    type="number"
                    min="0"
                    max="360"
                    value={shipCourse}
                    onChange={(e) => setShipCourse(e.target.value)}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    0° = heading into wind, 180° = following wind
                  </p>
                </div>
              </div>

              {/* Apparent Wind Results */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                  <p className="text-xs text-muted-foreground">True Wind</p>
                  <p className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>
                    {result.windSpeed.knots.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">knots</p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                  <p className="text-xs text-muted-foreground">Apparent Wind</p>
                  <p className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                    {(result.apparentWind.speed * 1.94384).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">knots</p>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Apparent Wind Angle</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {Math.abs(result.apparentWind.angle).toFixed(0)}°
                  </p>
                  <p className="text-xs text-muted-foreground">from bow</p>
                </div>
              </div>

              {/* Wind Speed Comparison Chart */}
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={windSpeedData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `${v} km/h`} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)} km/h`} />
                    <Bar dataKey="speed" radius={[4, 4, 0, 0]}>
                      {windSpeedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Apparent Wind Diagram */}
              <div className="p-6 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Compass className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Apparent Wind Concept
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      <strong>Apparent wind</strong> is the wind experienced by a moving object, 
                      combining true wind and the effect of motion.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Headwind: Apparent wind &gt; true wind
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Following wind: Apparent wind &lt; true wind
                    </p>
                    <p className="text-sm text-muted-foreground">
                      • Beam wind: Direction and speed both change
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/30 rounded-full" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Ship className="h-8 w-8" style={{ color: OCEAN_BLUE }} />
                      </div>
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <ArrowUp className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                        <span className="text-xs" style={{ color: LOGISTICS_GREEN }}>True Wind</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Force Analysis & Visualizations
              </CardTitle>
              <CardDescription>Visualize wind load components and relationships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Force Breakdown */}
                <div>
                  <h4 className="font-medium mb-4">Force Distribution</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => `${value.toFixed(2)} kN`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Force vs Wind Speed */}
                <div>
                  <h4 className="font-medium mb-4">Force vs Wind Speed</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forceVsSpeedData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="speed" label={{ value: "Wind Speed (km/h)", position: "bottom", fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => `${v} kN`} />
                        <Tooltip formatter={(value: number) => [`${value} kN`]} />
                        <ReferenceLine 
                          x={result.windSpeed.kmh} 
                          stroke={OCEAN_BLUE} 
                          strokeDasharray="5 5"
                          label={{ value: "Current", fontSize: 10 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="force" 
                          stroke={OCEAN_BLUE} 
                          fill={OCEAN_BLUE} 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Risk Radar Chart */}
              <div className="mt-6">
                <h4 className="font-medium mb-4">Risk Assessment Radar</h4>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={beaufortRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis tick={{ fontSize: 10 }} />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke={OCEAN_BLUE}
                        fill={OCEAN_BLUE}
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Safe Limit"
                        dataKey="limit"
                        stroke={LOGISTICS_GREEN}
                        fill={LOGISTICS_GREEN}
                        fillOpacity={0.2}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Shape Factor Comparison */}
              <div className="mt-6">
                <h4 className="font-medium mb-4">Shape Factor Comparison</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SHAPE_FACTORS.slice(0, 8).map((shape) => {
                    const v = convertWindSpeed;
                    const area = parseFloat(cargoArea) || 0;
                    const rho = AIR_DENSITY[airDensityType].rho;
                    const pressure = 0.5 * rho * v * v;
                    const force = (pressure * area * shape.cd) / 1000;
                    
                    return (
                      <div 
                        key={shape.type} 
                        className={`p-3 border rounded-lg ${shapeFactor === shape.type ? `border-[${OCEAN_BLUE}]` : ""}`}
                        style={shapeFactor === shape.type ? { borderColor: OCEAN_BLUE, backgroundColor: `${OCEAN_BLUE}08` } : {}}
                      >
                        <p className="text-sm font-medium">{shape.name}</p>
                        <p className="text-xs text-muted-foreground">Cd = {shape.cd}</p>
                        <p className="text-lg font-bold mt-1" style={{ color: OCEAN_BLUE }}>{force.toFixed(2)} kN</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bernoulli Equation Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Bernoulli&apos;s Equation for Wind Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-muted/50 rounded-lg font-mono text-center mb-4">
                <p className="text-2xl" style={{ color: OCEAN_BLUE }}>P = ½ × ρ × v²</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg" style={{ borderColor: `${OCEAN_BLUE}40` }}>
                  <p className="font-medium" style={{ color: OCEAN_BLUE }}>P = Wind Pressure</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Measured in Pascals (Pa) or N/m²
                  </p>
                </div>
                <div className="p-4 border rounded-lg" style={{ borderColor: `${LOGISTICS_GREEN}40` }}>
                  <p className="font-medium" style={{ color: LOGISTICS_GREEN }}>ρ = Air Density</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Standard: 1.225 kg/m³ at 15°C, sea level
                  </p>
                </div>
                <div className="p-4 border rounded-lg border-amber-400/40">
                  <p className="font-medium text-amber-600">v = Wind Speed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Measured in m/s (meters per second)
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-amber-500/10 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> Wind force increases with the <strong>square</strong> of wind speed. 
                  Doubling wind speed quadruples the force on cargo.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6 mt-6">
          {/* Guidelines Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Wind Load Guidelines for Project Cargo
              </CardTitle>
              <CardDescription>Best practices for securing cargo against wind forces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg" style={{ borderColor: `${LOGISTICS_GREEN}40` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <p className="font-medium">Do&apos;s</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Calculate wind loads for worst-case scenario</li>
                    <li>• Account for apparent wind from ship speed</li>
                    <li>• Use appropriate shape factor for cargo</li>
                    <li>• Consider increased exposure on deck</li>
                    <li>• Apply safety factor of 1.5-2.0 minimum</li>
                    <li>• Monitor weather forecasts throughout voyage</li>
                    <li>• Re-check lashings after heavy weather</li>
                    <li>• Document wind conditions and lashing plan</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg border-destructive/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <p className="font-medium">Don&apos;ts</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Don&apos;t underestimate wind force increase</li>
                    <li>• Don&apos;t ignore shape factor effects</li>
                    <li>• Don&apos;t assume calm weather entire voyage</li>
                    <li>• Don&apos;t forget apparent wind from ship motion</li>
                    <li>• Don&apos;t neglect friction benefits</li>
                    <li>• Don&apos;t use damaged or undersized equipment</li>
                    <li>• Don&apos;t delay operations in severe weather</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">CSS Code Reference</h4>
                <p className="text-sm text-muted-foreground">
                  The IMO Code of Safe Practice for Cargo Stowage and Securing (CSS Code) 
                  Annex 13 provides guidance for securing cargo against wind forces. 
                  Key considerations include:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Wind force calculation methodology</li>
                  <li>• Minimum safety factors for lashing equipment</li>
                  <li>• Consideration of voyage weather conditions</li>
                  <li>• Special provisions for deck cargo</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Risk Level Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Guidelines</CardTitle>
              <CardDescription>Action levels for wind force on cargo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(RISK_THRESHOLDS).map(([key, data]) => (
                  <div 
                    key={key} 
                    className="p-4 border rounded-lg"
                    style={{ borderColor: data.color, backgroundColor: `${data.color}10` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: data.color }}
                      />
                      <p className="font-medium" style={{ color: data.color }}>
                        {data.label}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{data.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {key === "critical" ? "> 200 kN" : 
                       key === "high" ? "100-200 kN" : 
                       key === "moderate" ? "50-100 kN" : 
                       "< 50 kN"}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deck Cargo Considerations */}
          <Card>
            <CardHeader>
              <CardTitle>Deck Cargo Wind Considerations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                    <Ship className="h-6 w-6 mb-2" style={{ color: OCEAN_BLUE }} />
                    <p className="font-medium">On Deck</p>
                    <p className="text-sm text-muted-foreground">
                      Full wind exposure. No shelter from ship structure. 
                      Maximum wind force exposure.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                    <Anchor className="h-6 w-6 mb-2" style={{ color: LOGISTICS_GREEN }} />
                    <p className="font-medium">Semi-Sheltered</p>
                    <p className="text-sm text-muted-foreground">
                      Partial shelter from forecastle or poop deck. 
                      Reduced but still significant wind loads.
                    </p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-lg">
                    <Ship className="h-6 w-6 text-amber-500 mb-2" />
                    <p className="font-medium">Below Deck</p>
                    <p className="text-sm text-muted-foreground">
                      Minimal wind exposure. Primary concern is ship motion forces.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about wind load calculations for maritime cargo</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" onClick={() => {
          setWindSpeed("50");
          setCargoArea("50");
          setShapeFactor("cube");
          setShipSpeed("15");
          setCargoWeight("25000");
          setSafetyFactor(1.5);
          setFrictionCoeff(0.4);
          setWindDirection("headwind");
          setAirDensityType("standard");
          setShipCourse("0");
        }}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
