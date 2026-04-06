"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
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
  Ship,
  Wind,
  Target,
  Zap,
  Anchor,
  BarChart3,
  BookOpen,
  HelpCircle,
  Wrench,
  Shield,
  TrendingUp,
  Settings,
  AlertCircle,
  Compass,
  ChevronRight,
  Waves,
  Gauge,
  CircleDot,
  Move3d,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  Area,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
} from "recharts";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";
const AMBER = "#F59E0B";

// Lashing equipment specifications
const LASHING_EQUIPMENT = {
  WIRE_ROPE_16: { name: "Wire Rope 16mm", mbl: 14700, swl: 12250, unit: "kg", category: "wire" },
  WIRE_ROPE_20: { name: "Wire Rope 20mm", mbl: 23000, swl: 19170, unit: "kg", category: "wire" },
  WIRE_ROPE_24: { name: "Wire Rope 24mm", mbl: 33100, swl: 27580, unit: "kg", category: "wire" },
  CHAIN_13: { name: "Chain 13mm Grade 8", mbl: 33400, swl: 16700, unit: "kg", category: "chain" },
  CHAIN_16: { name: "Chain 16mm Grade 8", mbl: 51200, swl: 25600, unit: "kg", category: "chain" },
  CHAIN_20: { name: "Chain 20mm Grade 8", mbl: 80000, swl: 40000, unit: "kg", category: "chain" },
  WEBBING_50: { name: "Webbing 50mm", mbl: 5000, swl: 2500, unit: "kg", category: "webbing" },
  WEBBING_75: { name: "Webbing 75mm", mbl: 7500, swl: 3750, unit: "kg", category: "webbing" },
  WEBBING_100: { name: "Webbing 100mm", mbl: 10000, swl: 5000, unit: "kg", category: "webbing" },
  TURNBUCKLE_22: { name: "Turnbuckle 22mm", mbl: 23500, swl: 15700, unit: "kg", category: "turnbuckle" },
  TURNBUCKLE_30: { name: "Turnbuckle 30mm", mbl: 43500, swl: 29000, unit: "kg", category: "turnbuckle" },
  TURNBUCKLE_36: { name: "Turnbuckle 36mm", mbl: 62800, swl: 41900, unit: "kg", category: "turnbuckle" },
};

// Acceleration coefficients for different ship types and positions
const ACCELERATION_FACTORS = {
  BULK_CARRIER: {
    name: "Bulk Carrier",
    longitudinal: 0.5,
    transverse: 0.7,
    vertical: 1.0,
    description: "Large vessel for bulk commodities like grain, coal, or ore",
  },
  CONTAINER: {
    name: "Container Ship",
    longitudinal: 0.4,
    transverse: 0.7,
    vertical: 1.0,
    description: "Specialized vessel for containerized cargo",
  },
  GENERAL_CARGO: {
    name: "General Cargo",
    longitudinal: 0.4,
    transverse: 0.8,
    vertical: 1.0,
    description: "Multi-purpose vessel for various cargo types",
  },
  RO_RO: {
    name: "Ro-Ro Vessel",
    longitudinal: 0.3,
    transverse: 0.5,
    vertical: 0.8,
    description: "Roll-on/roll-off vessel for vehicles and wheeled cargo",
  },
  HEAVY_LIFT: {
    name: "Heavy Lift Vessel",
    longitudinal: 0.3,
    transverse: 0.5,
    vertical: 0.6,
    description: "Specialized vessel for oversized and heavy cargo",
  },
};

// Deck positions
const DECK_POSITIONS = {
  ON_DECK: { name: "On Deck", positionFactor: 1.0, description: "Exposed to weather, highest forces" },
  BELOW_DECK: { name: "Below Deck", positionFactor: 0.8, description: "Protected from weather, reduced forces" },
  TANK_TOP: { name: "Tank Top", positionFactor: 0.7, description: "Lowest position, minimal motion" },
  BETWEEN_DECK: { name: "Between Deck", positionFactor: 0.75, description: "Intermediate deck position" },
};

// Friction coefficients reference
const FRICTION_COEFFICIENTS = [
  { material: "Steel on Steel (dry)", coefficient: 0.15, condition: "Clean, dry surfaces" },
  { material: "Steel on Steel (wet)", coefficient: 0.10, condition: "Moisture present" },
  { material: "Steel on Steel (greasy)", coefficient: 0.05, condition: "Oil or grease contamination" },
  { material: "Steel on Wood", coefficient: 0.40, condition: "Dry timber dunnage" },
  { material: "Rubber on Steel", coefficient: 0.70, condition: "Rubber matting" },
  { material: "Wood on Steel", coefficient: 0.45, condition: "Dry wood dunnage" },
  { material: "Steel on Painted Steel", coefficient: 0.30, condition: "Painted surfaces" },
  { material: "Plastic on Steel", coefficient: 0.35, condition: "Plastic sheeting" },
];

// Pro Tips for lashing
const PRO_TIPS = [
  {
    title: "Optimal Lashing Angle",
    description: "A 45-degree angle provides the best balance between horizontal restraint and vertical clamping force. Angles below 30° lose vertical effectiveness; angles above 60° reduce horizontal restraint.",
    icon: Target,
  },
  {
    title: "Pre-Tension Correctly",
    description: "Apply appropriate pre-tension to eliminate slack. Over-tensioning can damage cargo or equipment; under-tensioning reduces effectiveness. Use calibrated tensioning tools for consistency.",
    icon: Wrench,
  },
  {
    title: "Distribute Forces Evenly",
    description: "Space lashings uniformly around the cargo to distribute forces. Avoid concentrating lashings at strong points only—this can create stress concentrations and inadequate overall securing.",
    icon: Shield,
  },
  {
    title: "Account for Friction",
    description: "Utilize appropriate friction materials between cargo and deck. Timber dunnage, rubber matting, or friction coatings can significantly reduce the number of lashings required.",
    icon: Compass,
  },
  {
    title: "Consider Weather Routes",
    description: "Increase safety factors for voyages through heavy weather zones. North Atlantic winter routes may require 20-30% additional lashing capacity compared to calm season routes.",
    icon: Wind,
  },
  {
    title: "Inspect Regularly",
    description: "Check lashings at regular intervals during the voyage, especially after heavy weather. Tighten any slack lashings and replace damaged equipment immediately.",
    icon: RefreshCw,
  },
];

// Common mistakes
const COMMON_MISTAKES = [
  {
    title: "Ignoring Friction Benefits",
    description: "Failing to account for friction between cargo and deck can lead to over-lashing, increasing costs and potentially damaging cargo from excessive clamping forces.",
  },
  {
    title: "Wrong Lashing Angle",
    description: "Using lashing angles that are too steep (>60°) reduces horizontal effectiveness, while shallow angles (<30°) provide insufficient vertical clamping force.",
  },
  {
    title: "Uneven Force Distribution",
    description: "Concentrating lashings on one side creates imbalance. Always distribute lashings symmetrically to ensure even force application during ship motions.",
  },
  {
    title: "Using Damaged Equipment",
    description: "Never use wire ropes with broken strands, stretched chains, or webbing with cuts. Damaged equipment can fail catastrophically under load, jeopardizing the entire securing arrangement.",
  },
  {
    title: "Overlooking Weather Forecasts",
    description: "Not adjusting lashing arrangements based on anticipated weather conditions can lead to cargo damage or loss. Always consider the route's seasonal weather patterns.",
  },
];

// FAQ data
const FAQS = [
  {
    question: "What is the CSS Code and why is it important for cargo securing?",
    answer: "The Code of Safe Practice for Cargo Stowage and Securing (CSS Code) is an IMO instrument that provides international guidelines for the safe stowage and securing of cargo on ships. It establishes minimum safety factors (typically 1.5-2.0), calculation methodologies, and best practices for securing arrangements. Compliance with the CSS Code is mandatory under SOLAS regulations and helps prevent cargo shift, damage, and vessel instability. The Code applies to all cargo except solid bulk cargoes, liquid cargoes, and gases carried in bulk.",
  },
  {
    question: "How are acceleration forces calculated for different ship types?",
    answer: "Ship acceleration forces are calculated based on the vessel's characteristics, speed, and operating conditions. The CSS Code provides standard acceleration coefficients for different ship types: longitudinal forces (fore-aft) typically range from 0.3g to 0.5g, transverse forces (athwartship) from 0.5g to 0.8g, and vertical forces from 0.6g to 1.0g. These coefficients are multiplied by the cargo weight and gravity (9.81 m/s²) to determine forces in kN. Factors affecting accelerations include ship length, speed, stability characteristics, and deck position.",
  },
  {
    question: "What is the difference between MBL and SWL for lashing equipment?",
    answer: "Minimum Breaking Load (MBL) is the minimum force at which the equipment will fail or break, representing the absolute maximum load the equipment can withstand. Safe Working Load (SWL), also known as Working Load Limit (WLL), is the maximum load that should be applied during normal use. SWL is typically calculated as MBL divided by a safety factor (usually 4-5 for chains, 5-6 for wire ropes). Never exceed SWL during cargo operations—this ensures a safety margin for dynamic loads, equipment wear, and unexpected situations.",
  },
  {
    question: "How does deck position affect lashing requirements?",
    answer: "Deck position significantly impacts acceleration forces and thus lashing requirements. On-deck cargo experiences full ship motions and weather exposure, requiring maximum securing (position factor 1.0). Below-deck positions benefit from the ship's structure damping motions (factor 0.8). Tank top positions, being closest to the vessel's center of gravity and protected by multiple decks, experience minimal accelerations (factor 0.7). When stowing on deck, consider additional factors like green water exposure, wind forces, and temperature variations.",
  },
  {
    question: "What safety factors should be applied for lashing calculations?",
    answer: "The CSS Code specifies minimum safety factors based on voyage conditions and cargo characteristics. Standard conditions require a safety factor of 1.5-2.0. Heavy weather routes (North Atlantic winter, Southern Ocean) warrant factors of 2.5-3.0. Fragile or dangerous goods may require higher factors. When using multiple lashings, apply a reduction factor (typically 0.8-0.9) to account for uneven load distribution. Always verify classification society requirements and carrier-specific rules, which may impose higher safety factors.",
  },
  {
    question: "When should I use chain versus wire rope for lashing?",
    answer: "Chain lashings (Grade 8 or 10) are preferred for heavy, rigid cargo with sharp edges, as chains are resistant to abrasion and cutting. They maintain tension well and are easy to adjust. Wire ropes offer flexibility for irregular shapes and can absorb shock loads better due to elasticity. Use wire ropes for lightweight cargo, complex geometries, or when weight savings matter. Webbing straps are suitable for delicate cargo surfaces but have lower SWL. Consider turnbuckles for adjustable tension and shackles for connection points.",
  },
  {
    question: "How do I calculate the optimal number of lashings?",
    answer: "To calculate the optimal number of lashings: (1) Determine the forces acting on the cargo using ship acceleration coefficients. (2) Account for friction between cargo and deck. (3) Calculate the net force that lashings must resist. (4) Apply the appropriate safety factor. (5) Divide by the effective strength of a single lashing (SWL × cos(angle)). (6) Round up to the nearest whole number. Always ensure lashings are distributed symmetrically and consider redundancy for critical securing points.",
  },
  {
    question: "What inspections are required during a voyage?",
    answer: "Regular lashing inspections are critical for voyage safety. Check lashings: (1) Before departure - verify all lashings are properly tensioned. (2) Daily during normal conditions. (3) Every 4-6 hours in heavy weather. (4) After any significant weather event. Look for: slack lashings, damaged equipment (broken wires, stretched chains), shifting cargo, chafing or abrasion points, and loose connection points. Maintain a lashing inspection log and retighten or replace equipment as needed.",
  },
];

interface LashingResult {
  forces: {
    longitudinal: number;
    transverse: number;
    vertical: number;
  };
  requiredLashing: {
    longitudinal: number;
    transverse: number;
    vertical: number;
  };
  totalLashingForce: number;
  safetyFactor: number;
  frictionBenefit: number;
  numberOfLashings: number;
  equipmentRequired: {
    type: string;
    quantity: number;
    totalWll: number;
  };
  complianceStatus: "safe" | "marginal" | "unsafe";
}

export function LashingForceCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input parameters
  const [cargoWeight, setCargoWeight] = useState<string>("50000"); // kg
  const [cargoLength, setCargoLength] = useState<string>("10"); // meters
  const [cargoWidth, setCargoWidth] = useState<string>("4"); // meters
  const [cargoHeight, setCargoHeight] = useState<string>("4"); // meters
  const [cogHeight, setCogHeight] = useState<string>("2"); // meters from base
  const [shipType, setShipType] = useState<keyof typeof ACCELERATION_FACTORS>("BULK_CARRIER");
  const [deckPosition, setDeckPosition] = useState<keyof typeof DECK_POSITIONS>("ON_DECK");
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.4);
  const [lashingEquipment, setLashingEquipment] = useState<keyof typeof LASHING_EQUIPMENT>("WIRE_ROPE_20");
  const [lashingAngle, setLashingAngle] = useState<number>(45); // degrees
  const [safetyFactor, setSafetyFactor] = useState<number>(2.0);

  // Calculate lashing forces
  const result = useMemo((): LashingResult => {
    const weight = parseFloat(cargoWeight) || 0;
    const cog = parseFloat(cogHeight) || 0;
    const angle = lashingAngle * Math.PI / 180; // Convert to radians

    const ship = ACCELERATION_FACTORS[shipType];
    const position = DECK_POSITIONS[deckPosition];
    const equipment = LASHING_EQUIPMENT[lashingEquipment];

    // Base acceleration due to gravity
    const g = 9.81; // m/s²

    // Calculate forces (in kN)
    const forces = {
      longitudinal: (weight * g * ship.longitudinal * position.positionFactor) / 1000,
      transverse: (weight * g * ship.transverse * position.positionFactor) / 1000,
      vertical: (weight * g * ship.vertical * position.positionFactor) / 1000,
    };

    // Friction force available
    const frictionForce = (weight * g * frictionCoeff) / 1000;

    // Net forces after friction (friction helps with transverse and longitudinal)
    const netLongitudinal = Math.max(0, forces.longitudinal - frictionForce * 0.5);
    const netTransverse = Math.max(0, forces.transverse - frictionForce);

    // Lashing effectiveness based on angle
    const lashingEfficiency = {
      horizontal: Math.cos(angle),
      vertical: Math.sin(angle),
    };

    // Required lashing force (accounting for angle and safety factor)
    const requiredLashing = {
      longitudinal: netLongitudinal * safetyFactor / lashingEfficiency.horizontal,
      transverse: netTransverse * safetyFactor / lashingEfficiency.horizontal,
      vertical: forces.vertical * safetyFactor,
    };

    // Total lashing force needed
    const totalLashingForce = requiredLashing.transverse + requiredLashing.longitudinal * 0.5;

    // Calculate number of lashings needed
    const swl = equipment.swl / 1000; // Convert to kN
    const numberOfLashings = Math.ceil(totalLashingForce / (swl * lashingEfficiency.horizontal));

    // Calculate actual safety factor with lashings
    const actualSwl = numberOfLashings * swl * lashingEfficiency.horizontal;
    const actualSafetyFactor = actualSwl / Math.max(netTransverse, netLongitudinal);

    // Friction benefit
    const frictionBenefit = (frictionForce / forces.transverse) * 100;

    // Compliance status
    let complianceStatus: "safe" | "marginal" | "unsafe" = "safe";
    if (actualSafetyFactor < 1.5) complianceStatus = "unsafe";
    else if (actualSafetyFactor < 2.0) complianceStatus = "marginal";

    return {
      forces,
      requiredLashing,
      totalLashingForce,
      safetyFactor: actualSafetyFactor,
      frictionBenefit,
      numberOfLashings,
      equipmentRequired: {
        type: equipment.name,
        quantity: numberOfLashings,
        totalWll: numberOfLashings * equipment.swl,
      },
      complianceStatus,
    };
  }, [
    cargoWeight, cargoLength, cargoWidth, cargoHeight, cogHeight,
    shipType, deckPosition, frictionCoeff, lashingEquipment, lashingAngle, safetyFactor
  ]);

  // Force distribution chart data
  const forceData = useMemo(() => [
    { direction: "Longitudinal", force: result.forces.longitudinal.toFixed(1), color: OCEAN_BLUE, value: result.forces.longitudinal },
    { direction: "Transverse", force: result.forces.transverse.toFixed(1), color: LOGISTICS_GREEN, value: result.forces.transverse },
    { direction: "Vertical", force: result.forces.vertical.toFixed(1), color: AMBER, value: result.forces.vertical },
  ], [result]);

  // Radar chart data for ship comparison
  const shipComparisonData = useMemo(() => {
    return Object.entries(ACCELERATION_FACTORS).map(([key, data]) => ({
      shipType: data.name,
      longitudinal: data.longitudinal * 100,
      transverse: data.transverse * 100,
      vertical: data.vertical * 100,
      selected: key === shipType,
    }));
  }, [shipType]);

  // Equipment comparison data
  const equipmentComparison = useMemo(() => {
    return Object.entries(LASHING_EQUIPMENT).map(([key, data]) => {
      const swl = data.swl / 1000;
      const angle = lashingAngle * Math.PI / 180;
      const efficiency = Math.cos(angle);
      const lashings = Math.ceil(result.totalLashingForce / (swl * efficiency));
      return {
        type: data.name,
        swl: data.swl,
        mbl: data.mbl,
        lashings,
        totalForce: lashings * data.swl,
        category: data.category,
      };
    });
  }, [result.totalLashingForce, lashingAngle]);

  // Angle efficiency data
  const angleEfficiencyData = useMemo(() => {
    return Array.from({ length: 13 }, (_, i) => {
      const angle = 15 + i * 5;
      const horizontal = Math.cos(angle * Math.PI / 180);
      const vertical = Math.sin(angle * Math.PI / 180);
      return {
        angle,
        horizontal: parseFloat((horizontal * 100).toFixed(1)),
        vertical: parseFloat((vertical * 100).toFixed(1)),
        combined: parseFloat(((horizontal + vertical) / 2 * 100).toFixed(1)),
      };
    });
  }, []);

  // Cost breakdown data
  const costBreakdownData = useMemo(() => [
    { name: "Base Lashing", value: result.totalLashingForce * 0.6, fill: OCEAN_BLUE },
    { name: "Safety Margin", value: result.totalLashingForce * 0.25, fill: LOGISTICS_GREEN },
    { name: "Equipment Cost", value: result.totalLashingForce * 0.15, fill: AMBER },
  ], [result.totalLashingForce]);

  // Trend data for force visualization
  const forceTrendData = useMemo(() => {
    const baseForces = result.forces;
    return Array.from({ length: 12 }, (_, i) => ({
      month: `M${i + 1}`,
      longitudinal: baseForces.longitudinal * (1 + Math.sin(i * 0.5) * 0.1),
      transverse: baseForces.transverse * (1 + Math.cos(i * 0.5) * 0.15),
      vertical: baseForces.vertical * (1 + Math.sin(i * 0.3) * 0.05),
    }));
  }, [result.forces]);

  const COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, AMBER];

  const resetForm = () => {
    setCargoWeight("50000");
    setCargoLength("10");
    setCargoWidth("4");
    setCargoHeight("4");
    setCogHeight("2");
    setShipType("BULK_CARRIER");
    setDeckPosition("ON_DECK");
    setFrictionCoeff(0.4);
    setLashingEquipment("WIRE_ROPE_20");
    setLashingAngle(45);
    setSafetyFactor(2.0);
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "safe": return LOGISTICS_GREEN;
      case "marginal": return AMBER;
      case "unsafe": return "#EF4444";
      default: return "#6B7280";
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/80 to-[#2E8B57]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-30" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#2E8B57]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" />
        
        <div className="relative p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 flex-wrap">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Anchor className="h-3 w-3 mr-1.5" />
                    Maritime Safety
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Shield className="h-3 w-3 mr-1.5" />
                    CSS Code Compliant
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Zap className="h-3 w-3 mr-1.5" />
                    IMO Standards
                  </Badge>
                </motion.div>
              </div>
              
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold text-white tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Lashing Force Calculator
              </motion.h1>
              
              <motion.p 
                className="text-white/80 max-w-2xl text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Calculate required lashing forces for project cargo securing based on IMO CSS Code standards.
                Analyze ship accelerations, select appropriate equipment, and ensure compliance with maritime safety regulations.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-6 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 text-white/90">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Ship className="h-5 w-5" />
                  </div>
                  <span className="text-sm">5 Ship Types</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <span className="text-sm">11 Equipment Types</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <span className="text-sm">CSS Code Formulas</span>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="secondary" size="lg" onClick={resetForm} className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="secondary" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="lg" className="bg-white text-[#0F4C81] hover:bg-white/90">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{result.numberOfLashings}</div>
              <div className="text-sm text-white/60">Lashings Required</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{result.totalLashingForce.toFixed(1)} kN</div>
              <div className="text-sm text-white/60">Total Force</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{result.safetyFactor.toFixed(2)}</div>
              <div className="text-sm text-white/60">Safety Factor</div>
            </div>
            <div className="text-center">
              <Badge className={`text-lg px-4 py-1 ${
                result.complianceStatus === "safe" ? "bg-[#2E8B57] text-white" :
                result.complianceStatus === "marginal" ? "bg-amber-500 text-white" :
                "bg-red-500 text-white"
              }`}>
                {result.complianceStatus.toUpperCase()}
              </Badge>
              <div className="text-sm text-white/60 mt-1">Compliance</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl h-12 bg-muted/50">
          <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <Wrench className="h-4 w-4" />
            <span className="hidden sm:inline">Equipment</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <div className="space-y-6">
              <Card className="border-l-4 border-l-[#0F4C81]">
                <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                      <Weight className="h-5 w-5 text-[#0F4C81]" />
                    </div>
                    Cargo Parameters
                  </CardTitle>
                  <CardDescription>Enter cargo dimensions and weight</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="cargoWeight" className="text-base font-medium">Cargo Weight (kg)</Label>
                      <Input
                        id="cargoWeight"
                        type="number"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(e.target.value)}
                        className="mt-2 h-11"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="cargoLength">Length (m)</Label>
                        <Input
                          id="cargoLength"
                          type="number"
                          step="0.1"
                          value={cargoLength}
                          onChange={(e) => setCargoLength(e.target.value)}
                          className="mt-2"
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
                          className="mt-2"
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
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cogHeight">Center of Gravity Height (m)</Label>
                      <Input
                        id="cogHeight"
                        type="number"
                        step="0.1"
                        value={cogHeight}
                        onChange={(e) => setCogHeight(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Height of CoG from base of cargo
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#0F4C81]">
                <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                      <Ship className="h-5 w-5 text-[#0F4C81]" />
                    </div>
                    Vessel Configuration
                  </CardTitle>
                  <CardDescription>Select ship type and deck position</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <Label>Ship Type</Label>
                    <Select value={shipType} onValueChange={(v) => setShipType(v as keyof typeof ACCELERATION_FACTORS)}>
                      <SelectTrigger className="mt-2 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ACCELERATION_FACTORS).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ACCELERATION_FACTORS[shipType].description}
                    </p>
                  </div>

                  <div>
                    <Label>Deck Position</Label>
                    <Select value={deckPosition} onValueChange={(v) => setDeckPosition(v as keyof typeof DECK_POSITIONS)}>
                      <SelectTrigger className="mt-2 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DECK_POSITIONS).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {DECK_POSITIONS[deckPosition].description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 rounded-xl border">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Longitudinal</div>
                      <div className="text-2xl font-bold text-[#0F4C81]">
                        {ACCELERATION_FACTORS[shipType].longitudinal}g
                      </div>
                      <Move3d className="h-4 w-4 mx-auto mt-1 text-[#0F4C81]" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Transverse</div>
                      <div className="text-2xl font-bold text-[#2E8B57]">
                        {ACCELERATION_FACTORS[shipType].transverse}g
                      </div>
                      <Move3d className="h-4 w-4 mx-auto mt-1 text-[#2E8B57] style={{transform: 'rotate(90deg)'" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Vertical</div>
                      <div className="text-2xl font-bold text-amber-500">
                        {ACCELERATION_FACTORS[shipType].vertical}g
                      </div>
                      <ArrowDownRight className="h-4 w-4 mx-auto mt-1 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#2E8B57]">
                <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                      <Settings className="h-5 w-5 text-[#2E8B57]" />
                    </div>
                    Calculation Parameters
                  </CardTitle>
                  <CardDescription>Adjust friction coefficient and lashing angle</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <Label className="text-base font-medium">Friction Coefficient (μ)</Label>
                    <div className="mt-3">
                      <Slider
                        value={[frictionCoeff]}
                        onValueChange={(v) => setFrictionCoeff(v[0])}
                        min={0.1}
                        max={0.7}
                        step={0.05}
                        className="[&_[role=slider]]:bg-[#0F4C81] [&_.bg-primary]:bg-[#0F4C81]"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>0.1 (Steel on Steel)</span>
                        <span className="font-semibold text-[#0F4C81] text-base">{frictionCoeff.toFixed(2)}</span>
                        <span>0.7 (Rubber on Steel)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Lashing Angle (degrees from horizontal)</Label>
                    <div className="mt-3">
                      <Slider
                        value={[lashingAngle]}
                        onValueChange={(v) => setLashingAngle(v[0])}
                        min={15}
                        max={75}
                        step={5}
                        className="[&_[role=slider]]:bg-[#2E8B57] [&_.bg-primary]:bg-[#2E8B57]"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>15°</span>
                        <span className="font-semibold text-[#2E8B57] text-base">{lashingAngle}°</span>
                        <span>75°</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Optimal angle: 45° (balanced horizontal/vertical restraint)
                    </p>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Safety Factor</Label>
                    <Select value={safetyFactor.toString()} onValueChange={(v) => setSafetyFactor(parseFloat(v))}>
                      <SelectTrigger className="w-full mt-2 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.5">1.5 - Minimum (CSS Code)</SelectItem>
                        <SelectItem value="2.0">2.0 - Standard (Recommended)</SelectItem>
                        <SelectItem value="2.5">2.5 - Conservative</SelectItem>
                        <SelectItem value="3.0">3.0 - Heavy Weather</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[#0F4C81]/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[#0F4C81]/10 via-[#0F4C81]/5 to-[#2E8B57]/5">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                      <Calculator className="h-5 w-5 text-[#0F4C81]" />
                    </div>
                    Lashing Results
                  </CardTitle>
                  <CardDescription>Calculated lashing requirements</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Forces Summary */}
                  <div className="grid grid-cols-3 gap-3">
                    {forceData.map((item, idx) => (
                      <motion.div
                        key={item.direction}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 rounded-xl text-center border-2 border-transparent hover:border-current/20 transition-colors"
                        style={{ backgroundColor: `${item.color}10` }}
                      >
                        <p className="text-xs text-muted-foreground mb-1">{item.direction}</p>
                        <p className="text-2xl font-bold" style={{ color: item.color }}>
                          {item.force}
                        </p>
                        <p className="text-xs text-muted-foreground">kN</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Required Lashing */}
                  <motion.div
                    key={result.numberOfLashings}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="p-5 bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5 rounded-xl border border-[#0F4C81]/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-muted-foreground">Total Lashing Required</p>
                      <Badge className="bg-[#0F4C81] text-white text-base px-3 py-1">{result.numberOfLashings} lashings</Badge>
                    </div>
                    <p className="text-3xl font-bold text-[#0F4C81]">
                      {result.totalLashingForce.toFixed(1)} kN
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Equipment: {result.equipmentRequired.type}
                    </p>
                  </motion.div>

                  {/* Safety Factor */}
                  <div 
                    className="p-5 rounded-xl border-2"
                    style={{ 
                      backgroundColor: `${getComplianceColor(result.complianceStatus)}10`,
                      borderColor: `${getComplianceColor(result.complianceStatus)}30`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {result.complianceStatus === "safe" ? (
                        <div className="p-3 rounded-full bg-[#2E8B57]/20">
                          <CheckCircle2 className="h-8 w-8 text-[#2E8B57]" />
                        </div>
                      ) : result.complianceStatus === "marginal" ? (
                        <div className="p-3 rounded-full bg-amber-500/20">
                          <Info className="h-8 w-8 text-amber-500" />
                        </div>
                      ) : (
                        <div className="p-3 rounded-full bg-red-500/20">
                          <AlertTriangle className="h-8 w-8 text-red-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-2xl">
                          Safety Factor: {result.safetyFactor.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result.complianceStatus === "safe" ? "Compliant with CSS Code" :
                           result.complianceStatus === "marginal" ? "Marginal - Review recommended" :
                           "Non-compliant - Increase lashings"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Friction Benefit */}
                  <div className="p-5 bg-muted/30 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Friction Contribution</span>
                      <span className="font-bold text-lg text-[#2E8B57]">{result.frictionBenefit.toFixed(0)}%</span>
                    </div>
                    <Progress value={result.frictionBenefit} className="h-3 [&>div]:bg-[#2E8B57]" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Friction reduces required lashing force by {result.frictionBenefit.toFixed(0)}%
                    </p>
                  </div>

                  {/* Efficiency Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-[#0F4C81]/5 to-[#0F4C81]/10 rounded-xl text-center border border-[#0F4C81]/20">
                      <div className="text-3xl font-bold text-[#0F4C81]">
                        {lashingAngle}°
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Lashing Angle</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {lashingAngle === 45 ? "✓ Optimal" : lashingAngle < 45 ? "↗ More vertical needed" : "↘ Less steep recommended"}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#2E8B57]/5 to-[#2E8B57]/10 rounded-xl text-center border border-[#2E8B57]/20">
                      <div className="text-3xl font-bold text-[#2E8B57]">
                        {frictionCoeff.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Friction Coeff</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {frictionCoeff >= 0.4 ? "✓ Good friction" : "⚠ Low friction"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Reference Card */}
              <Card className="border-l-4 border-l-[#2E8B57]">
                <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                      <Info className="h-5 w-5 text-[#2E8B57]" />
                    </div>
                    Quick Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 p-2 rounded-lg bg-[#2E8B57]/5">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Minimum safety factor: 1.5 (CSS Code)</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded-lg bg-[#2E8B57]/5">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Optimal lashing angle: 45° from horizontal</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded-lg bg-[#2E8B57]/5">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Heavy weather routes: Use SF 2.5-3.0</span>
                    </div>
                    <div className="flex items-start gap-3 p-2 rounded-lg bg-amber-500/5">
                      <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>Always use certified lashing equipment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Force Distribution Chart */}
            <Card className="border-l-4 border-l-[#0F4C81]">
              <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  Force Distribution
                </CardTitle>
                <CardDescription>Calculated forces acting on cargo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={forceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="direction" tick={{ fontSize: 12 }} />
                      <YAxis tickFormatter={(v) => `${v} kN`} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: number) => [`${value} kN`, "Force"]} 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {forceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Force Allocation Pie Chart */}
            <Card className="border-l-4 border-l-[#2E8B57]">
              <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  Force Allocation
                </CardTitle>
                <CardDescription>Distribution of required lashing force</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)} kN`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ship Comparison Radar */}
            <Card className="border-l-4 border-l-[#0F4C81]">
              <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                    <Compass className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  Ship Type Comparison
                </CardTitle>
                <CardDescription>Acceleration factors by ship type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={shipComparisonData.filter(s => s.selected)}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="shipType" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Longitudinal" dataKey="longitudinal" stroke={OCEAN_BLUE} fill={OCEAN_BLUE} fillOpacity={0.5} />
                      <Radar name="Transverse" dataKey="transverse" stroke={LOGISTICS_GREEN} fill={LOGISTICS_GREEN} fillOpacity={0.5} />
                      <Radar name="Vertical" dataKey="vertical" stroke={AMBER} fill={AMBER} fillOpacity={0.5} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Angle Efficiency Chart */}
            <Card className="border-l-4 border-l-[#2E8B57]">
              <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                    <Target className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  Angle Efficiency Analysis
                </CardTitle>
                <CardDescription>Lashing efficiency by angle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={angleEfficiencyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="angle" label={{ value: "Angle (°)", position: "bottom", offset: 0, fontSize: 12 }} tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => `${value}%`} />
                      <Legend />
                      <Area type="monotone" dataKey="combined" fill={OCEAN_BLUE} fillOpacity={0.2} name="Combined" />
                      <Line type="monotone" dataKey="horizontal" stroke={OCEAN_BLUE} strokeWidth={2} name="Horizontal" dot={false} />
                      <Line type="monotone" dataKey="vertical" stroke={LOGISTICS_GREEN} strokeWidth={2} name="Vertical" dot={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ship Acceleration Factors Table */}
            <Card className="lg:col-span-2 border-l-4 border-l-[#0F4C81]">
              <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                    <Ship className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  Ship Motion Acceleration Factors
                </CardTitle>
                <CardDescription>Based on IMO CSS Code and ship type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                        <th className="text-left py-4 px-4 font-semibold">Ship Type</th>
                        <th className="text-center py-4 px-4 font-semibold">Longitudinal</th>
                        <th className="text-center py-4 px-4 font-semibold">Transverse</th>
                        <th className="text-center py-4 px-4 font-semibold">Vertical</th>
                        <th className="text-center py-4 px-4 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(ACCELERATION_FACTORS).map(([key, data]) => (
                        <tr key={key} className={`border-b transition-colors ${key === shipType ? "bg-[#0F4C81]/10" : "hover:bg-muted/50"}`}>
                          <td className="py-3 px-4 font-medium flex items-center gap-2">
                            {key === shipType && <CheckCircle2 className="h-4 w-4 text-[#0F4C81]" />}
                            {data.name}
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline" style={{ borderColor: OCEAN_BLUE, color: OCEAN_BLUE }}>
                              {data.longitudinal}g
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline" style={{ borderColor: LOGISTICS_GREEN, color: LOGISTICS_GREEN }}>
                              {data.transverse}g
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline" style={{ borderColor: AMBER, color: AMBER }}>
                              {data.vertical}g
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4 text-muted-foreground text-xs">{data.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          <Card className="border-l-4 border-l-[#2E8B57]">
            <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                </div>
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-5 bg-gradient-to-br from-[#0F4C81]/5 to-[#0F4C81]/10 rounded-xl text-center border border-[#0F4C81]/20">
                  <div className="text-3xl font-bold text-[#0F4C81]">{result.forces.longitudinal.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Longitudinal Force (kN)</div>
                </div>
                <div className="p-5 bg-gradient-to-br from-[#2E8B57]/5 to-[#2E8B57]/10 rounded-xl text-center border border-[#2E8B57]/20">
                  <div className="text-3xl font-bold text-[#2E8B57]">{result.forces.transverse.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Transverse Force (kN)</div>
                </div>
                <div className="p-5 bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-xl text-center border border-amber-500/20">
                  <div className="text-3xl font-bold text-amber-500">{result.forces.vertical.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Vertical Force (kN)</div>
                </div>
                <div className="p-5 bg-muted/30 rounded-xl text-center border">
                  <div className="text-3xl font-bold" style={{ color: getComplianceColor(result.complianceStatus) }}>
                    {result.safetyFactor.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Safety Factor</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Tab */}
        <TabsContent value="equipment" className="space-y-6">
          <Card className="border-l-4 border-l-[#0F4C81]">
            <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                  <Wrench className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Lashing Equipment Selection
              </CardTitle>
              <CardDescription>Choose appropriate equipment for your cargo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Equipment Type</Label>
                <Select value={lashingEquipment} onValueChange={(v) => setLashingEquipment(v as keyof typeof LASHING_EQUIPMENT)}>
                  <SelectTrigger className="mt-2 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LASHING_EQUIPMENT).map(([key, data]) => (
                      <SelectItem key={key} value={key}>
                        {data.name} - SWL: {data.swl.toLocaleString()} kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={equipmentComparison.slice(0, 6)} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "lashings" ? value : `${value.toLocaleString()} kg`,
                        name === "lashings" ? "Lashings Required" : "SWL"
                      ]}
                    />
                    <Bar dataKey="lashings" fill={OCEAN_BLUE} name="lashings" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                      <th className="text-left py-3 px-4">Equipment</th>
                      <th className="text-right py-3 px-4">MBL (kg)</th>
                      <th className="text-right py-3 px-4">SWL (kg)</th>
                      <th className="text-right py-3 px-4">Lashings Needed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipmentComparison.slice(0, 8).map((item) => (
                      <tr key={item.type} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{item.type}</td>
                        <td className="text-right py-3 px-4">{item.mbl.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">{item.swl.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <span className="font-bold text-[#0F4C81] bg-[#0F4C81]/10 px-2 py-1 rounded">{item.lashings}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Friction Reference */}
          <Card className="border-l-4 border-l-[#2E8B57]">
            <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                  <Ruler className="h-5 w-5 text-[#2E8B57]" />
                </div>
                Friction Coefficient Reference
              </CardTitle>
              <CardDescription>Common friction coefficients for cargo securing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                      <th className="text-left py-3 px-4">Material Combination</th>
                      <th className="text-center py-3 px-4">Coefficient (μ)</th>
                      <th className="text-left py-3 px-4">Condition</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FRICTION_COEFFICIENTS.map((item) => (
                      <tr key={item.material} className={`border-b transition-colors ${Math.abs(item.coefficient - frictionCoeff) < 0.05 ? "bg-[#0F4C81]/10" : "hover:bg-muted/50"}`}>
                        <td className="py-3 px-4 font-medium">{item.material}</td>
                        <td className="text-center py-3 px-4">
                          <Badge variant={Math.abs(item.coefficient - frictionCoeff) < 0.05 ? "default" : "outline"} 
                            style={Math.abs(item.coefficient - frictionCoeff) < 0.05 ? { backgroundColor: OCEAN_BLUE } : {}}>
                            {item.coefficient.toFixed(2)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{item.condition}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Types Guide */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-[#0F4C81]">
              <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                    <Link className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  Wire Rope Lashings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Wire ropes are the most common lashing material for general cargo. They offer excellent strength-to-weight ratio
                    and flexibility for complex cargo shapes. Available in various diameters, typically 16-24mm for heavy cargo.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-[#2E8B57]/5 rounded-lg border border-[#2E8B57]/20">
                      <span className="font-medium text-foreground text-[#2E8B57]">Pros:</span>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-[#2E8B57]" /> High strength</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-[#2E8B57]" /> Flexible</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-[#2E8B57]" /> Cost-effective</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                      <span className="font-medium text-foreground text-red-500">Cons:</span>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center gap-2"><AlertCircle className="h-3 w-3 text-red-500" /> Can damage cargo</li>
                        <li className="flex items-center gap-2"><AlertCircle className="h-3 w-3 text-red-500" /> Requires tensioning</li>
                        <li className="flex items-center gap-2"><AlertCircle className="h-3 w-3 text-red-500" /> Susceptible to corrosion</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#2E8B57]">
              <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                    <Link className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  Chain Lashings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Grade 8 or Grade 10 chains are preferred for heavy machinery and project cargo. They maintain tension better
                    than wire ropes and are more resistant to abrasion and cutting. Common sizes range from 13mm to 20mm.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-[#2E8B57]/5 rounded-lg border border-[#2E8B57]/20">
                      <span className="font-medium text-foreground text-[#2E8B57]">Pros:</span>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-[#2E8B57]" /> Maintains tension</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-[#2E8B57]" /> Abrasion resistant</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-[#2E8B57]" /> Easy to adjust</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                      <span className="font-medium text-foreground text-red-500">Cons:</span>
                      <ul className="mt-2 space-y-1">
                        <li className="flex items-center gap-2"><AlertCircle className="h-3 w-3 text-red-500" /> Heavy</li>
                        <li className="flex items-center gap-2"><AlertCircle className="h-3 w-3 text-red-500" /> More expensive</li>
                        <li className="flex items-center gap-2"><AlertCircle className="h-3 w-3 text-red-500" /> Less flexible</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          {/* Best Practices */}
          <Card className="border-l-4 border-l-[#0F4C81]">
            <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Lashing Best Practices
              </CardTitle>
              <CardDescription>Do&apos;s and Don&apos;ts for cargo securing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 border-2 rounded-xl border-[#2E8B57]/20 bg-gradient-to-br from-[#2E8B57]/5 to-transparent">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-[#2E8B57]" />
                    <p className="font-semibold text-lg text-[#2E8B57]">Do&apos;s</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Distribute lashings evenly around cargo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Use proper lashing angles (30-60°)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Pre-tension lashings correctly</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Check lashings regularly during voyage</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Protect lashings from sharp edges</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Use timber for friction and protection</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                      <span>Document lashing plan thoroughly</span>
                    </li>
                  </ul>
                </div>
                <div className="p-5 border-2 rounded-xl border-red-200 dark:border-red-800 bg-gradient-to-br from-red-500/5 to-transparent">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <p className="font-semibold text-lg text-red-500">Don&apos;ts</p>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-3">
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Don&apos;t exceed equipment SWL</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Don&apos;t use damaged equipment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Don&apos;t mix different equipment types</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Don&apos;t over-tension lashings</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Don&apos;t ignore friction benefits</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Don&apos;t lash to weak points</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                      <span>Don&apos;t forget to account for weather</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-l-4 border-l-[#2E8B57]">
            <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                  <Target className="h-5 w-5 text-[#2E8B57]" />
                </div>
                Pro Tips
              </CardTitle>
              <CardDescription>Expert recommendations for optimal cargo securing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-5 border rounded-xl hover:border-[#0F4C81]/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 rounded-xl shadow-lg">
                        <tip.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">{tip.title}</p>
                        <p className="text-sm text-muted-foreground mt-2">{tip.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="bg-gradient-to-r from-amber-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from frequent errors in cargo lashing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <div key={mistake.title} className="p-5 border border-amber-200 dark:border-amber-800 rounded-xl bg-gradient-to-r from-amber-50 to-transparent dark:from-amber-950/20">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold">{mistake.title}</p>
                        <p className="text-sm text-muted-foreground mt-2">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CSS Code Reference */}
          <Card className="border-l-4 border-l-[#0F4C81]">
            <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                  <Shield className="h-5 w-5 text-[#0F4C81]" />
                </div>
                CSS Code Reference
              </CardTitle>
              <CardDescription>IMO Code of Safe Practice for Cargo Stowage and Securing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-6">
                  The IMO Code of Safe Practice for Cargo Stowage and Securing (CSS Code) provides guidelines for cargo securing
                  arrangements. Key requirements include minimum safety factors, consideration of ship motions and accelerations,
                  proper documentation of lashing arrangements, and regular inspection during voyage.
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                      Key Requirements:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                        Minimum safety factor of 1.5 for lashings
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                        Consideration of ship motions and accelerations
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                        Proper documentation of lashing arrangements
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                        Regular inspection during voyage
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <p className="font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-[#0F4C81]" />
                      Documentation Should Include:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                        Cargo securing manual
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                        Lashing plan with equipment details
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                        Calculations and safety factors used
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                        Inspection and maintenance records
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="border-l-4 border-l-[#0F4C81]">
            <CardHeader className="bg-gradient-to-r from-[#0F4C81]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                  <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about lashing force calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0">
                    <AccordionTrigger className="text-left py-4 hover:no-underline hover:bg-muted/30 px-4 rounded-lg transition-colors">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card className="border-l-4 border-l-[#2E8B57]">
            <CardHeader className="bg-gradient-to-r from-[#2E8B57]/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-[#2E8B57]" />
                </div>
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 border rounded-xl hover:border-[#0F4C81]/50 transition-all hover:shadow-lg group">
                  <h4 className="font-semibold mb-2 group-hover:text-[#0F4C81] transition-colors">IMO Publications</h4>
                  <p className="text-sm text-muted-foreground">
                    Official IMO publications including the CSS Code, SOLAS regulations, and guidance documents for cargo securing.
                  </p>
                </div>
                <div className="p-5 border rounded-xl hover:border-[#0F4C81]/50 transition-all hover:shadow-lg group">
                  <h4 className="font-semibold mb-2 group-hover:text-[#0F4C81] transition-colors">Classification Societies</h4>
                  <p className="text-sm text-muted-foreground">
                    Rules and guidelines from major classification societies (DNV, ABS, LR, BV) for cargo securing arrangements.
                  </p>
                </div>
                <div className="p-5 border rounded-xl hover:border-[#0F4C81]/50 transition-all hover:shadow-lg group">
                  <h4 className="font-semibold mb-2 group-hover:text-[#0F4C81] transition-colors">Industry Standards</h4>
                  <p className="text-sm text-muted-foreground">
                    Industry best practices and standards from organizations like ICS, SIGTTO, and TT Club for safe cargo operations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/90 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Gauge className="h-5 w-5" />
                  Safety Factor Quick Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">Standard Conditions</span>
                    <Badge className="bg-white/20 text-white">1.5 - 2.0</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">Conservative</span>
                    <Badge className="bg-white/20 text-white">2.0 - 2.5</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">Heavy Weather Routes</span>
                    <Badge className="bg-white/20 text-white">2.5 - 3.0</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/80">Dangerous Goods</span>
                    <Badge className="bg-white/20 text-white">3.0+</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/90 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5" />
                  Lashing Angle Quick Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">15° - 30°</span>
                    <Badge className="bg-amber-500/80 text-white">High horizontal, Low vertical</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">30° - 45°</span>
                    <Badge className="bg-white/20 text-white">Good balance</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="text-white/80">45°</span>
                    <Badge className="bg-white text-[#2E8B57]">Optimal</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-white/80">45° - 75°</span>
                    <Badge className="bg-amber-500/80 text-white">Low horizontal, High vertical</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={resetForm}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
