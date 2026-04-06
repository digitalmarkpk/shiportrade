"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calculator,
  Package,
  Ruler,
  Weight,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Gauge,
  DollarSign,
  BarChart3,
  BookOpen,
  Layers,
  Truck,
  TrendingUp,
  Scale,
  Settings,
  HelpCircle,
  Zap,
  Target,
  Award,
  Lightbulb,
  Shield,
  FileText,
  ChevronRight,
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
  RadialBarChart,
  RadialBar,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Freight class definitions with density thresholds
const FREIGHT_CLASSES = [
  {
    class: 50,
    minDensity: 50,
    maxDensity: Infinity,
    label: "Class 50",
    description: "Very Dense",
    color: "#1E3A5F",
    examples: ["Steel bars", "Heavy machinery", "Engine blocks", "Lead ingots"],
  },
  {
    class: 55,
    minDensity: 35,
    maxDensity: 50,
    label: "Class 55",
    description: "Dense",
    color: OCEAN_BLUE,
    examples: ["Bricks", "Cement", "Lumber", "Hardware"],
  },
  {
    class: 60,
    minDensity: 30,
    maxDensity: 35,
    label: "Class 60",
    description: "Semi-Dense",
    color: LOGISTICS_GREEN,
    examples: ["Auto parts", "Beverages", "Canned goods"],
  },
  {
    class: 65,
    minDensity: 22.5,
    maxDensity: 30,
    label: "Class 65",
    description: "Medium-Dense",
    color: "#3BA55D",
    examples: ["Bottled products", "Books", "Ceramics"],
  },
  {
    class: 70,
    minDensity: 15,
    maxDensity: 22.5,
    label: "Class 70",
    description: "Medium",
    color: "#F59E0B",
    examples: ["Furniture", "Appliances", "Car parts"],
  },
  {
    class: 77.5,
    minDensity: 13.5,
    maxDensity: 15,
    label: "Class 77.5",
    description: "Medium-Light",
    color: "#F97316",
    examples: ["Tires", "Bathroom fixtures"],
  },
  {
    class: 85,
    minDensity: 12,
    maxDensity: 13.5,
    label: "Class 85",
    description: "Semi-Light",
    color: "#EF4444",
    examples: ["Crated machinery", "Small appliances"],
  },
  {
    class: 92.5,
    minDensity: 10.5,
    maxDensity: 12,
    label: "Class 92.5",
    description: "Light",
    color: "#DC2626",
    examples: ["Computers", "Refrigerators", "Washing machines"],
  },
  {
    class: 100,
    minDensity: 9,
    maxDensity: 10.5,
    label: "Class 100",
    description: "Lighter",
    color: "#B91C1C",
    examples: ["Boat covers", "Canvas", "Wood cabinets"],
  },
  {
    class: 110,
    minDensity: 8,
    maxDensity: 9,
    label: "Class 110",
    description: "Very Light",
    color: "#991B1B",
    examples: ["Cabinets", "Framed artwork"],
  },
  {
    class: 125,
    minDensity: 7,
    maxDensity: 8,
    label: "Class 125",
    description: "Ultra Light",
    color: "#7F1D1D",
    examples: ["Small household appliances", "Dresses"],
  },
  {
    class: 150,
    minDensity: 6,
    maxDensity: 7,
    label: "Class 150",
    description: "Extremely Light",
    color: "#5B21B6",
    examples: ["Auto sheet metal", "Bookcases", "Upholstered furniture"],
  },
  {
    class: 175,
    minDensity: 4,
    maxDensity: 6,
    label: "Class 175",
    description: "Low Density",
    color: "#7C3AED",
    examples: ["Clothing", "Furniture", "Aluminum sheet"],
  },
  {
    class: 200,
    minDensity: 3,
    maxDensity: 4,
    label: "Class 200",
    description: "Very Low Density",
    color: "#8B5CF6",
    examples: ["Aircraft parts", "Mattresses", "Box springs"],
  },
  {
    class: 250,
    minDensity: 2,
    maxDensity: 3,
    label: "Class 250",
    description: "Ultra Low Density",
    color: "#A78BFA",
    examples: ["Bamboo furniture", "Upholstered furniture", "Feathers"],
  },
  {
    class: 300,
    minDensity: 1,
    maxDensity: 2,
    label: "Class 300",
    description: "Extremely Low Density",
    color: "#C4B5FD",
    examples: ["Wicker furniture", "Wine tanks", "Wood furniture"],
  },
  {
    class: 400,
    minDensity: 0,
    maxDensity: 1,
    label: "Class 400",
    description: "Least Dense",
    color: "#DDD6FE",
    examples: ["Ping pong balls", "Styrofoam", "Empty drums"],
  },
];

// Commodity types with default NMFC item numbers
const COMMODITY_TYPES = [
  { id: "general", name: "General Freight", nmfc: "N/A", baseClass: 70 },
  {
    id: "machinery",
    name: "Machinery & Equipment",
    nmfc: "133300",
    baseClass: 70,
  },
  {
    id: "electronics",
    name: "Electronics & Computers",
    nmfc: "116000",
    baseClass: 92.5,
  },
  { id: "furniture", name: "Furniture", nmfc: "100000", baseClass: 150 },
  { id: "auto_parts", name: "Auto Parts", nmfc: "120000", baseClass: 85 },
  { id: "apparel", name: "Apparel & Clothing", nmfc: "112500", baseClass: 125 },
  {
    id: "food_beverage",
    name: "Food & Beverages",
    nmfc: "73360",
    baseClass: 70,
  },
  {
    id: "building_materials",
    name: "Building Materials",
    nmfc: "150000",
    baseClass: 55,
  },
  {
    id: "metal_products",
    name: "Metal Products",
    nmfc: "160000",
    baseClass: 50,
  },
  {
    id: "paper_products",
    name: "Paper Products",
    nmfc: "180000",
    baseClass: 70,
  },
  { id: "plastics", name: "Plastics & Rubber", nmfc: "170000", baseClass: 85 },
  {
    id: "hazardous",
    name: "Hazardous Materials",
    nmfc: "Varies",
    baseClass: 70,
  },
];

// Length unit conversions to inches
const LENGTH_UNITS: Record<string, { name: string; toInches: number }> = {
  in: { name: "Inches", toInches: 1 },
  ft: { name: "Feet", toInches: 12 },
  cm: { name: "Centimeters", toInches: 0.393701 },
  m: { name: "Meters", toInches: 39.3701 },
};

// Weight unit conversions to pounds
const WEIGHT_UNITS: Record<string, { name: string; toLbs: number }> = {
  lb: { name: "Pounds", toLbs: 1 },
  kg: { name: "Kilograms", toLbs: 2.20462 },
  t: { name: "Metric Tons", toLbs: 2204.62 },
};

// Carrier cost multipliers by freight class (relative to Class 50)
const CARRIER_COST_MULTIPLIERS: Record<number, number> = {
  50: 1.0,
  55: 1.05,
  60: 1.1,
  65: 1.15,
  70: 1.2,
  77.5: 1.3,
  85: 1.4,
  92.5: 1.5,
  100: 1.6,
  110: 1.75,
  125: 1.9,
  150: 2.1,
  175: 2.35,
  200: 2.6,
  250: 2.9,
  300: 3.3,
  400: 3.8,
};

// NMFC Classification factors
const CLASSIFICATION_FACTORS = {
  density: {
    weight: 0.5,
    description: "Primary factor - determines base class",
  },
  stowability: {
    weight: 0.2,
    description: "Ability to stack or load with other freight",
  },
  handling: { weight: 0.15, description: "Special handling requirements" },
  liability: { weight: 0.15, description: "Value, fragility, perishability" },
};

// FAQs data
const FAQS = [
  {
    question: "What is freight class and why does it matter?",
    answer:
      "Freight class is a standardized classification system developed by the National Motor Freight Traffic Association (NMFTA) to categorize commodities for shipping. It determines shipping costs based on density, stowability, handling, and liability. Lower freight classes cost less to ship, while higher classes cost more.",
  },
  {
    question: "How is freight class calculated?",
    answer:
      "Freight class is primarily determined by density (pounds per cubic foot). The formula is: Density = Total Weight (lbs) ÷ Cubic Feet. Higher density materials like steel (Class 50) ship cheaper than low-density items like feathers (Class 400). Other factors include stowability, handling requirements, and liability.",
  },
  {
    question: "What is an NMFC code?",
    answer:
      "The National Motor Freight Classification (NMFC) code is a standardized numeric identifier for commodities. It helps carriers and shippers communicate exactly what is being shipped. Each NMFC item has an associated freight class, though the actual class may vary based on density for some items.",
  },
  {
    question: "Can my freight class change after pickup?",
    answer:
      "Yes, carriers can reclassify your freight if the actual dimensions, weight, or commodity description differ from what was declared. This often results in additional charges. Always measure accurately and describe your shipment correctly to avoid reclassification fees.",
  },
  {
    question: "How can I reduce my freight costs?",
    answer:
      "To reduce costs: 1) Increase density by using smaller packaging, 2) Make shipments stackable, 3) Use standard pallet sizes (48×40), 4) Consolidate smaller shipments, 5) Know your correct NMFC code, 6) Measure dimensions accurately, and 7) Compare rates from multiple carriers.",
  },
  {
    question: "What happens if I declare the wrong freight class?",
    answer:
      "If you under-declare your freight class (claiming a lower class than actual), the carrier will likely reclassify it and charge additional fees. These include the rate difference plus potential penalties. Over-declaring means you pay more than necessary. Accuracy is essential.",
  },
  {
    question: "Do all carriers use the same freight classes?",
    answer:
      "Yes, freight classification is standardized across the LTL (Less-Than-Truckload) industry in the United States through the NMFTA. However, individual carriers may have different base rates and discount structures, so the actual cost can vary between carriers for the same freight class.",
  },
  {
    question: "Is dimensional weight the same as freight class?",
    answer:
      "No, they are different concepts. Freight class determines the rate multiplier based on commodity characteristics. Dimensional weight (DIM weight) is used to ensure lightweight but bulky shipments pay their fair share. Some carriers use DIM weight as a minimum chargeable weight.",
  },
];

interface FreightClassResult {
  cubicFeet: number;
  density: number;
  freightClass: (typeof FREIGHT_CLASSES)[0];
  densityPercentage: number;
  adjustedClass: number;
  handlingAdjustments: string[];
  suggestions: string[];
  costMultiplier: number;
  dimensionalWeight: number;
  chargeableWeight: number;
}

export function USFreightClassCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input dimensions
  const [length, setLength] = useState<string>("48");
  const [width, setWidth] = useState<string>("40");
  const [height, setHeight] = useState<string>("48");
  const [lengthUnit, setLengthUnit] = useState<string>("in");
  const [weight, setWeight] = useState<string>("1500");
  const [weightUnit, setWeightUnit] = useState<string>("lb");
  const [pieceCount, setPieceCount] = useState<string>("1");
  const [isPallet, setIsPallet] = useState(true);

  // Commodity and handling
  const [commodityType, setCommodityType] = useState<string>("general");
  const [isStackable, setIsStackable] = useState(true);
  const [isFragile, setIsFragile] = useState(false);
  const [isHazardous, setIsHazardous] = useState(false);
  const [hasSpecialHandling, setHasSpecialHandling] = useState(false);

  // Options
  const [baseRate, setBaseRate] = useState<string>("100");

  // Calculate freight class
  const result = useMemo((): FreightClassResult => {
    // Convert dimensions to inches
    const lengthInches = parseFloat(length) * LENGTH_UNITS[lengthUnit].toInches;
    const widthInches = parseFloat(width) * LENGTH_UNITS[lengthUnit].toInches;
    const heightInches = parseFloat(height) * LENGTH_UNITS[lengthUnit].toInches;

    // Convert weight to pounds
    const weightLbs = parseFloat(weight) * WEIGHT_UNITS[weightUnit].toLbs;
    const pieces = parseInt(pieceCount) || 1;
    const totalWeight = weightLbs * pieces;

    // Calculate cubic feet (cubic inches / 1728)
    const cubicInches = lengthInches * widthInches * heightInches * pieces;
    const cubicFeet = cubicInches / 1728;

    // Calculate density (lbs per cubic foot)
    const density = cubicFeet > 0 ? totalWeight / cubicFeet : 0;

    // Find freight class based on density
    const freightClass =
      FREIGHT_CLASSES.find(
        (fc) => density >= fc.minDensity && density < fc.maxDensity,
      ) || FREIGHT_CLASSES[FREIGHT_CLASSES.length - 1];

    // Calculate density percentage within class range
    const rangeSize = freightClass.maxDensity - freightClass.minDensity;
    const densityInRange = density - freightClass.minDensity;
    const densityPercentage =
      rangeSize > 0 ? (densityInRange / rangeSize) * 100 : 100;

    // Handling adjustments
    const handlingAdjustments: string[] = [];
    let classAdjustment = 0;

    if (!isStackable) {
      handlingAdjustments.push(
        "Non-stackable freight may increase class by 1-2 levels",
      );
      classAdjustment += 1;
    }
    if (isFragile) {
      handlingAdjustments.push("Fragile items require higher liability class");
      classAdjustment += 0.5;
    }
    if (isHazardous) {
      handlingAdjustments.push(
        "Hazardous materials require special handling provisions",
      );
      classAdjustment += 1;
    }
    if (hasSpecialHandling) {
      handlingAdjustments.push(
        "Special handling requirements may affect classification",
      );
      classAdjustment += 0.5;
    }

    // Calculate adjusted class
    const classIndex = FREIGHT_CLASSES.findIndex(
      (fc) => fc.class === freightClass.class,
    );
    const adjustedIndex = Math.min(
      classIndex + Math.floor(classAdjustment),
      FREIGHT_CLASSES.length - 1,
    );
    const adjustedClass = FREIGHT_CLASSES[adjustedIndex].class;

    // Dimensional weight (for LTL comparison)
    const dimensionalWeight = cubicFeet * 10; // Standard 10 lbs/cu ft

    // Chargeable weight is the higher of actual or dimensional
    const chargeableWeight = Math.max(totalWeight, dimensionalWeight);

    // Cost multiplier
    const costMultiplier = CARRIER_COST_MULTIPLIERS[adjustedClass] || 1.0;

    // Suggestions
    const suggestions: string[] = [];

    if (density < 6) {
      suggestions.push(
        "Consider densifying your packaging to reduce freight class",
      );
      suggestions.push(
        "Use smaller boxes or eliminate unnecessary packaging materials",
      );
    }
    if (
      density >= freightClass.minDensity &&
      density < freightClass.minDensity + 2
    ) {
      suggestions.push(
        `Increase density by just ${(freightClass.minDensity + 2 - density).toFixed(1)} lbs/cu ft to potentially qualify for Class ${FREIGHT_CLASSES[Math.max(0, classIndex - 1)].class}`,
      );
    }
    if (!isStackable) {
      suggestions.push(
        "If possible, design packaging to be stackable for potential savings",
      );
    }

    return {
      cubicFeet,
      density,
      freightClass,
      densityPercentage,
      adjustedClass,
      handlingAdjustments,
      suggestions,
      costMultiplier,
      dimensionalWeight,
      chargeableWeight,
    };
  }, [
    length,
    width,
    height,
    lengthUnit,
    weight,
    weightUnit,
    pieceCount,
    isStackable,
    isFragile,
    isHazardous,
    hasSpecialHandling,
  ]);

  // Class comparison for visualization
  const classComparisonData = useMemo(() => {
    return FREIGHT_CLASSES.slice(0, 10).map((fc) => ({
      name: `Class ${fc.class}`,
      multiplier: CARRIER_COST_MULTIPLIERS[fc.class],
      isCurrent: fc.class === result.adjustedClass,
    }));
  }, [result]);

  // Classification factors data for pie chart
  const factorsData = useMemo(() => {
    return [
      {
        name: "Density",
        value: CLASSIFICATION_FACTORS.density.weight * 100,
        color: OCEAN_BLUE,
      },
      {
        name: "Stowability",
        value: CLASSIFICATION_FACTORS.stowability.weight * 100,
        color: LOGISTICS_GREEN,
      },
      {
        name: "Handling",
        value: CLASSIFICATION_FACTORS.handling.weight * 100,
        color: "#F59E0B",
      },
      {
        name: "Liability",
        value: CLASSIFICATION_FACTORS.liability.weight * 100,
        color: "#EF4444",
      },
    ];
  }, []);

  // Density gauge data
  const densityGaugeData = useMemo(() => {
    const maxDensity = 55;
    const normalizedDensity = Math.min(
      (result.density / maxDensity) * 100,
      100,
    );
    return [
      {
        name: "Density",
        value: normalizedDensity,
        fill:
          result.density >= 15
            ? LOGISTICS_GREEN
            : result.density >= 6
              ? OCEAN_BLUE
              : "#F59E0B",
      },
    ];
  }, [result]);

  // Selected commodity info
  const selectedCommodity = useMemo(() => {
    return COMMODITY_TYPES.find((c) => c.id === commodityType);
  }, [commodityType]);

  // Cost savings potential data
  const savingsData = useMemo(() => {
    const currentRate = (parseFloat(baseRate) || 100) * result.costMultiplier;
    return FREIGHT_CLASSES.slice(0, 8).map((fc) => {
      const fcRate =
        (parseFloat(baseRate) || 100) *
        (CARRIER_COST_MULTIPLIERS[fc.class] || 1);
      const savings = currentRate - fcRate;
      return {
        name: `Class ${fc.class}`,
        savings: savings,
        isCurrent: fc.class === result.adjustedClass,
      };
    });
  }, [result, baseRate]);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-b-3xl">
        {/* Background gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, #1a5a9e 25%, ${LOGISTICS_GREEN} 75%, #34a06e 100%)`,
          }}
        />

        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative px-6 py-16 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge
              className="mb-6 px-4 py-1.5 text-sm font-medium border-0"
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "white",
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Industry-Standard Calculator
            </Badge>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              US Freight Class Calculator
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Accurately determine your NMFC freight class based on dimensions,
              weight, and commodity type. Optimize shipping costs and avoid
              reclassification fees.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  18
                </div>
                <div className="text-sm text-white/80">Freight Classes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {result.density.toFixed(1)}
                </div>
                <div className="text-sm text-white/80">lbs/cu ft</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  Class {result.adjustedClass}
                </div>
                <div className="text-sm text-white/80">Your Class</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {result.costMultiplier.toFixed(1)}x
                </div>
                <div className="text-sm text-white/80">Cost Factor</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="w-4 h-4 hidden sm:block" />
              <span>Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Gauge className="w-4 h-4 hidden sm:block" />
              <span>Results</span>
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 hidden sm:block" />
              <span>Cost</span>
            </TabsTrigger>
            <TabsTrigger value="reference" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 hidden sm:block" />
              <span>Reference</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 hidden sm:block" />
              <span>Learn</span>
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Dimensions Card */}
              <Card
                className="border-l-4"
                style={{ borderLeftColor: OCEAN_BLUE }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Cargo Dimensions
                  </CardTitle>
                  <CardDescription>
                    Enter the dimensions of a single piece or pallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Dimension Unit</Label>
                    <Select value={lengthUnit} onValueChange={setLengthUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(LENGTH_UNITS).map(([key, unit]) => (
                          <SelectItem key={key} value={key}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="length">Length</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                  </div>

                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${OCEAN_BLUE}10` }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Total Volume
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: OCEAN_BLUE }}
                      >
                        {result.cubicFeet.toFixed(2)} cu ft
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPallet"
                      checked={isPallet}
                      onCheckedChange={setIsPallet}
                    />
                    <Label htmlFor="isPallet" className="text-sm">
                      This is a palletized shipment
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Weight Card */}
              <Card
                className="border-l-4"
                style={{ borderLeftColor: LOGISTICS_GREEN }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Weight
                      className="h-5 w-5"
                      style={{ color: LOGISTICS_GREEN }}
                    />
                    Weight Information
                  </CardTitle>
                  <CardDescription>
                    Enter the weight of your shipment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight per Piece</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Weight Unit</Label>
                      <Select value={weightUnit} onValueChange={setWeightUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(WEIGHT_UNITS).map(([key, unit]) => (
                            <SelectItem key={key} value={key}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pieceCount">Number of Pieces</Label>
                    <Input
                      id="pieceCount"
                      type="number"
                      min="1"
                      value={pieceCount}
                      onChange={(e) => setPieceCount(e.target.value)}
                    />
                  </div>

                  <Separator />

                  <div
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: `${OCEAN_BLUE}08`,
                      borderColor: `${OCEAN_BLUE}30`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Calculated Density
                      </span>
                      <Badge
                        className="text-base px-3 py-1"
                        style={{ backgroundColor: OCEAN_BLUE }}
                      >
                        {result.density.toFixed(2)} lbs/cu ft
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Freight Class</span>
                      <Badge
                        className="text-base px-3 py-1"
                        style={{ backgroundColor: LOGISTICS_GREEN }}
                      >
                        Class {result.adjustedClass}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commodity and Handling */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package
                      className="h-5 w-5"
                      style={{ color: OCEAN_BLUE }}
                    />
                    Commodity Type
                  </CardTitle>
                  <CardDescription>
                    Select the type of commodity being shipped
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Commodity Category</Label>
                    <Select
                      value={commodityType}
                      onValueChange={setCommodityType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMODITY_TYPES.map((commodity) => (
                          <SelectItem key={commodity.id} value={commodity.id}>
                            <div className="flex items-center justify-between w-full gap-4">
                              <span>{commodity.name}</span>
                              <span className="text-muted-foreground text-xs">
                                NMFC: {commodity.nmfc}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCommodity && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">
                          Typical NMFC Item
                        </span>
                        <span className="font-medium">
                          {selectedCommodity.nmfc}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Base Class Reference
                        </span>
                        <span className="font-medium">
                          Class {selectedCommodity.baseClass}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings
                      className="h-5 w-5"
                      style={{ color: OCEAN_BLUE }}
                    />
                    Handling Characteristics
                  </CardTitle>
                  <CardDescription>
                    Special characteristics that may affect classification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="stackable" className="cursor-pointer">
                          Stackable
                        </Label>
                      </div>
                      <Switch
                        id="stackable"
                        checked={isStackable}
                        onCheckedChange={setIsStackable}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <Label htmlFor="fragile" className="cursor-pointer">
                          Fragile
                        </Label>
                      </div>
                      <Switch
                        id="fragile"
                        checked={isFragile}
                        onCheckedChange={setIsFragile}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <Label htmlFor="hazardous" className="cursor-pointer">
                          Hazardous Material
                        </Label>
                      </div>
                      <Switch
                        id="hazardous"
                        checked={isHazardous}
                        onCheckedChange={setIsHazardous}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <HelpCircle
                          className="h-4 w-4"
                          style={{ color: OCEAN_BLUE }}
                        />
                        <Label htmlFor="special" className="cursor-pointer">
                          Special Handling Required
                        </Label>
                      </div>
                      <Switch
                        id="special"
                        checked={hasSpecialHandling}
                        onCheckedChange={setHasSpecialHandling}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6 mt-6">
            {/* Main Result Card */}
            <Card
              className="border-2"
              style={{ borderColor: `${OCEAN_BLUE}30` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Freight Class Determination
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Density */}
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Calculated Density
                    </p>
                    <p
                      className="text-4xl font-bold"
                      style={{ color: OCEAN_BLUE }}
                    >
                      {result.density.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      lbs per cubic foot
                    </p>
                  </div>

                  {/* Freight Class */}
                  <div
                    className="text-center p-6 rounded-lg border-2"
                    style={{
                      backgroundColor: `${LOGISTICS_GREEN}10`,
                      borderColor: LOGISTICS_GREEN,
                    }}
                  >
                    <p className="text-sm text-muted-foreground mb-2">
                      Freight Class
                    </p>
                    <p
                      className="text-4xl font-bold"
                      style={{ color: LOGISTICS_GREEN }}
                    >
                      {result.adjustedClass}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.freightClass.description}
                    </p>
                  </div>

                  {/* Cubic Feet */}
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Total Volume
                    </p>
                    <p
                      className="text-4xl font-bold"
                      style={{ color: OCEAN_BLUE }}
                    >
                      {result.cubicFeet.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      cubic feet
                    </p>
                  </div>
                </div>

                {/* Density Meter */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Density Position
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {result.density.toFixed(2)} lbs/cu ft
                    </span>
                  </div>
                  <div
                    className="relative h-4 rounded-full overflow-hidden"
                    style={{
                      background: `linear-gradient(to right, #DDD6FE, #F59E0B, ${OCEAN_BLUE})`,
                    }}
                  >
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                      style={{
                        left: `${Math.min(100, (result.density / 55) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Class 400 (&lt;1)</span>
                    <span>Class 70 (15-22.5)</span>
                    <span>Class 50 (50+)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visualizations Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Density Gauge */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Density Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="90%"
                        startAngle={180}
                        endAngle={0}
                        data={densityGaugeData}
                      >
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={10}
                        />
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-3xl font-bold fill-current"
                        >
                          {result.density.toFixed(1)}
                        </text>
                        <text
                          x="50%"
                          y="60%"
                          textAnchor="middle"
                          className="text-sm fill-muted-foreground"
                        >
                          lbs/cu ft
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    {result.density >= 15 ? (
                      <span style={{ color: LOGISTICS_GREEN }}>
                        Excellent density - Lower shipping costs
                      </span>
                    ) : result.density >= 6 ? (
                      <span style={{ color: OCEAN_BLUE }}>
                        Good density - Consider optimization
                      </span>
                    ) : (
                      <span className="text-amber-500">
                        Low density - Higher shipping costs expected
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Classification Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award
                      className="h-5 w-5"
                      style={{ color: LOGISTICS_GREEN }}
                    />
                    Classification Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={factorsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {factorsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [`${value}%`, "Weight"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    {factorsData.map((factor) => (
                      <div
                        key={factor.name}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: factor.color }}
                        />
                        <span className="text-muted-foreground">
                          {factor.name}: {factor.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Handling Adjustments */}
            {result.handlingAdjustments.length > 0 && (
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-2">
                        Classification Adjustments
                      </h4>
                      <ul className="space-y-1">
                        {result.handlingAdjustments.map((adjustment, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            • {adjustment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <Card
                style={{
                  borderColor: `${OCEAN_BLUE}30`,
                  backgroundColor: `${OCEAN_BLUE}05`,
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      className="h-5 w-5 shrink-0 mt-0.5"
                      style={{ color: LOGISTICS_GREEN }}
                    />
                    <div>
                      <h4 className="font-medium mb-2">
                        Optimization Suggestions
                      </h4>
                      <ul className="space-y-1">
                        {result.suggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground"
                          >
                            • {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weight Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Weight Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Actual Weight
                    </p>
                    <p className="text-2xl font-bold">
                      {(
                        parseFloat(weight) *
                        WEIGHT_UNITS[weightUnit].toLbs *
                        (parseInt(pieceCount) || 1)
                      ).toFixed(0)}{" "}
                      lbs
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      Dimensional Weight
                    </p>
                    <p className="text-2xl font-bold">
                      {result.dimensionalWeight.toFixed(0)} lbs
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      @ 10 lbs/cu ft standard
                    </p>
                  </div>
                  <div
                    className="p-4 border rounded-lg"
                    style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}
                  >
                    <p className="text-sm text-muted-foreground mb-1">
                      Chargeable Weight
                    </p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: LOGISTICS_GREEN }}
                    >
                      {result.chargeableWeight.toFixed(0)} lbs
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Higher of actual vs dim weight
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cost Impact Tab */}
          <TabsContent value="cost" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Cost Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign
                      className="h-5 w-5"
                      style={{ color: OCEAN_BLUE }}
                    />
                    Cost Impact Calculator
                  </CardTitle>
                  <CardDescription>
                    See how freight class affects your shipping costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="baseRate">
                      Base Rate (per cwt for Class 50)
                    </Label>
                    <Input
                      id="baseRate"
                      type="number"
                      value={baseRate}
                      onChange={(e) => setBaseRate(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your carrier&apos;s base rate per hundredweight for
                      Class 50
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Your Freight Class</span>
                      <Badge style={{ backgroundColor: LOGISTICS_GREEN }}>
                        Class {result.adjustedClass}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Cost Multiplier</span>
                      <span className="font-medium">
                        {result.costMultiplier.toFixed(2)}x
                      </span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Estimated Rate
                      </span>
                      <span
                        className="text-xl font-bold"
                        style={{ color: OCEAN_BLUE }}
                      >
                        $
                        {(
                          (parseFloat(baseRate) || 100) * result.costMultiplier
                        ).toFixed(2)}
                        /cwt
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Class Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3
                      className="h-5 w-5"
                      style={{ color: OCEAN_BLUE }}
                    />
                    Cost Multiplier by Class
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classComparisonData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-muted"
                        />
                        <XAxis
                          dataKey="name"
                          className="text-xs"
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey="multiplier"
                          fill={OCEAN_BLUE}
                          radius={[4, 4, 0, 0]}
                        >
                          {classComparisonData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.isCurrent ? LOGISTICS_GREEN : OCEAN_BLUE
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Your current class highlighted in green
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Savings Potential Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp
                    className="h-5 w-5"
                    style={{ color: LOGISTICS_GREEN }}
                  />
                  Potential Savings Analysis
                </CardTitle>
                <CardDescription>
                  See how much you could save by optimizing your freight class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={savingsData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [
                          `$${Math.abs(value).toFixed(2)}`,
                          value >= 0 ? "Savings" : "Additional Cost",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="savings"
                        stroke={LOGISTICS_GREEN}
                        fill={LOGISTICS_GREEN}
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  Positive values indicate potential savings compared to your
                  current class
                </div>
              </CardContent>
            </Card>

            {/* Potential Savings Table */}
            <Card style={{ borderColor: `${LOGISTICS_GREEN}30` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp
                    className="h-5 w-5"
                    style={{ color: LOGISTICS_GREEN }}
                  />
                  Detailed Cost Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4">Class</th>
                        <th className="text-right py-3 px-4">
                          Density Required
                        </th>
                        <th className="text-right py-3 px-4">
                          Rate Multiplier
                        </th>
                        <th className="text-right py-3 px-4">
                          Est. Rate ($/cwt)
                        </th>
                        <th className="text-right py-3 px-4">vs. Your Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FREIGHT_CLASSES.slice(0, 12).map((fc) => {
                        const rate =
                          (parseFloat(baseRate) || 100) *
                          (CARRIER_COST_MULTIPLIERS[fc.class] || 1);
                        const yourRate =
                          (parseFloat(baseRate) || 100) * result.costMultiplier;
                        const savings = yourRate - rate;
                        const isYourClass = fc.class === result.adjustedClass;

                        return (
                          <tr
                            key={fc.class}
                            className={`border-b ${isYourClass ? "font-medium" : ""}`}
                            style={
                              isYourClass
                                ? { backgroundColor: `${LOGISTICS_GREEN}10` }
                                : {}
                            }
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {isYourClass && (
                                  <CheckCircle2
                                    className="h-4 w-4"
                                    style={{ color: LOGISTICS_GREEN }}
                                  />
                                )}
                                Class {fc.class}
                              </div>
                            </td>
                            <td className="text-right py-3 px-4">
                              {fc.minDensity === Infinity
                                ? "N/A"
                                : `${fc.minDensity}+ lbs/cu ft`}
                            </td>
                            <td className="text-right py-3 px-4">
                              {CARRIER_COST_MULTIPLIERS[fc.class]?.toFixed(2)}x
                            </td>
                            <td className="text-right py-3 px-4">
                              ${rate.toFixed(2)}
                            </td>
                            <td className="text-right py-3 px-4">
                              {savings > 0 ? (
                                <span style={{ color: LOGISTICS_GREEN }}>
                                  -${savings.toFixed(2)}
                                </span>
                              ) : savings < 0 ? (
                                <span className="text-red-500">
                                  +${Math.abs(savings).toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
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
            {/* Freight Class Reference Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  NMFC Freight Class Reference
                </CardTitle>
                <CardDescription>
                  Complete list of NMFC freight classes with density ranges and
                  examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 bg-muted/50">
                          Class
                        </th>
                        <th className="text-left py-3 px-4 bg-muted/50">
                          Description
                        </th>
                        <th className="text-left py-3 px-4 bg-muted/50">
                          Density Range
                        </th>
                        <th className="text-left py-3 px-4 bg-muted/50">
                          Example Commodities
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {FREIGHT_CLASSES.map((fc) => (
                        <tr
                          key={fc.class}
                          className={`border-b ${fc.class === result.adjustedClass ? "font-medium" : ""}`}
                          style={
                            fc.class === result.adjustedClass
                              ? { backgroundColor: `${LOGISTICS_GREEN}10` }
                              : {}
                          }
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: fc.color }}
                              />
                              <span>{fc.class}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">{fc.description}</td>
                          <td className="py-3 px-4">
                            {fc.maxDensity === Infinity
                              ? `${fc.minDensity}+ lbs/cu ft`
                              : `${fc.minDensity} - ${fc.maxDensity} lbs/cu ft`}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {fc.examples.join(", ")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Commodity Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Common NMFC Item Numbers
                </CardTitle>
                <CardDescription>
                  Reference guide for common commodity types and their typical
                  NMFC codes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {COMMODITY_TYPES.map((commodity) => (
                    <div
                      key={commodity.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{commodity.name}</h4>
                        <Badge variant="outline">
                          Class {commodity.baseClass}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        NMFC: {commodity.nmfc}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Classification Factors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield
                    className="h-5 w-5"
                    style={{ color: LOGISTICS_GREEN }}
                  />
                  Four Classification Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className="p-4 border rounded-lg"
                    style={{ borderLeftColor: OCEAN_BLUE, borderLeftWidth: 4 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: OCEAN_BLUE }}
                      >
                        D
                      </div>
                      <div>
                        <h4 className="font-medium">Density (50%)</h4>
                        <p className="text-xs text-muted-foreground">
                          Primary classification factor
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {CLASSIFICATION_FACTORS.density.description}
                    </p>
                  </div>

                  <div
                    className="p-4 border rounded-lg"
                    style={{
                      borderLeftColor: LOGISTICS_GREEN,
                      borderLeftWidth: 4,
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: LOGISTICS_GREEN }}
                      >
                        S
                      </div>
                      <div>
                        <h4 className="font-medium">Stowability (20%)</h4>
                        <p className="text-xs text-muted-foreground">
                          Loading efficiency factor
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {CLASSIFICATION_FACTORS.stowability.description}
                    </p>
                  </div>

                  <div
                    className="p-4 border rounded-lg"
                    style={{ borderLeftColor: "#F59E0B", borderLeftWidth: 4 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: "#F59E0B" }}
                      >
                        H
                      </div>
                      <div>
                        <h4 className="font-medium">Handling (15%)</h4>
                        <p className="text-xs text-muted-foreground">
                          Special requirements factor
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {CLASSIFICATION_FACTORS.handling.description}
                    </p>
                  </div>

                  <div
                    className="p-4 border rounded-lg"
                    style={{ borderLeftColor: "#EF4444", borderLeftWidth: 4 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: "#EF4444" }}
                      >
                        L
                      </div>
                      <div>
                        <h4 className="font-medium">Liability (15%)</h4>
                        <p className="text-xs text-muted-foreground">
                          Risk assessment factor
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {CLASSIFICATION_FACTORS.liability.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learn Tab */}
          <TabsContent value="learn" className="space-y-6 mt-6">
            {/* Quick Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb
                    className="h-5 w-5"
                    style={{ color: OCEAN_BLUE }}
                  />
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white"
                      style={{ backgroundColor: OCEAN_BLUE }}
                    >
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h4 className="font-medium mb-2">Enter Dimensions</h4>
                    <p className="text-sm text-muted-foreground">
                      Measure length, width, and height in inches
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white"
                      style={{ backgroundColor: LOGISTICS_GREEN }}
                    >
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <h4 className="font-medium mb-2">Add Weight</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter total weight in pounds
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white"
                      style={{ backgroundColor: OCEAN_BLUE }}
                    >
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <h4 className="font-medium mb-2">Get Your Class</h4>
                    <p className="text-sm text-muted-foreground">
                      View calculated freight class instantly
                    </p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg mt-4"
                  style={{
                    backgroundColor: `${OCEAN_BLUE}10`,
                    borderColor: `${OCEAN_BLUE}30`,
                    border: "1px solid",
                  }}
                >
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    Key Insight
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    A shipment with a higher freight class will cost more to
                    ship than the same weight of a lower freight class
                    commodity, because carriers consider it takes up more space
                    relative to its weight.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Density Calculation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator
                    className="h-5 w-5"
                    style={{ color: OCEAN_BLUE }}
                  />
                  How to Calculate Density
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg font-mono text-center">
                  <p className="text-lg mb-2">Density = Weight ÷ Volume</p>
                  <p className="text-sm text-muted-foreground">
                    Density (lbs/cu ft) = Total Weight (lbs) ÷ Cubic Feet
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg font-mono text-center">
                  <p className="text-lg mb-2">
                    Cubic Feet = (L × W × H) ÷ 1728
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Where L, W, H are in inches (1728 cubic inches = 1 cubic
                    foot)
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Example 1</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      A pallet measures 48&quot; × 40&quot; × 48&quot; and
                      weighs 1,500 lbs
                    </p>
                    <div className="text-sm space-y-1">
                      <p>Volume = (48 × 40 × 48) ÷ 1728 = 53.33 cu ft</p>
                      <p>Density = 1,500 ÷ 53.33 = 28.13 lbs/cu ft</p>
                      <p
                        className="font-medium"
                        style={{ color: LOGISTICS_GREEN }}
                      >
                        → Class 65
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Example 2</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      A box measures 24&quot; × 18&quot; × 12&quot; and weighs
                      10 lbs
                    </p>
                    <div className="text-sm space-y-1">
                      <p>Volume = (24 × 18 × 12) ÷ 1728 = 3 cu ft</p>
                      <p>Density = 10 ÷ 3 = 3.33 lbs/cu ft</p>
                      <p className="font-medium text-red-500">→ Class 200</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips to Reduce Costs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp
                    className="h-5 w-5"
                    style={{ color: LOGISTICS_GREEN }}
                  />
                  Tips to Reduce Freight Costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 mt-0.5"
                        style={{ color: LOGISTICS_GREEN }}
                      />
                      <div>
                        <h4 className="font-medium text-sm">
                          Optimize Packaging
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Use smaller boxes and eliminate void fill to increase
                          density
                        </p>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 mt-0.5"
                        style={{ color: LOGISTICS_GREEN }}
                      />
                      <div>
                        <h4 className="font-medium text-sm">
                          Stack When Possible
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Design packaging to be stackable to reduce handling
                          costs
                        </p>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 mt-0.5"
                        style={{ color: LOGISTICS_GREEN }}
                      />
                      <div>
                        <h4 className="font-medium text-sm">
                          Consolidate Shipments
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Combine smaller shipments into larger, denser loads
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 mt-0.5"
                        style={{ color: LOGISTICS_GREEN }}
                      />
                      <div>
                        <h4 className="font-medium text-sm">
                          Know Your NMFC Code
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Accurate NMFC item numbers prevent reclassification
                          fees
                        </p>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 mt-0.5"
                        style={{ color: LOGISTICS_GREEN }}
                      />
                      <div>
                        <h4 className="font-medium text-sm">
                          Use Standard Pallets
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Standard sizes (48×40) are easier to stack and load
                          efficiently
                        </p>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg flex items-start gap-3">
                      <CheckCircle2
                        className="h-5 w-5 shrink-0 mt-0.5"
                        style={{ color: LOGISTICS_GREEN }}
                      />
                      <div>
                        <h4 className="font-medium text-sm">
                          Measure Accurately
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Use actual dimensions; carriers will measure and
                          reclassify
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <h4 className="font-medium mb-1">Using Wrong NMFC Code</h4>
                    <p className="text-sm text-muted-foreground">
                      Incorrect classification can result in reclassification
                      fees and delayed shipments
                    </p>
                  </div>
                  <div className="p-3 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <h4 className="font-medium mb-1">Estimating Dimensions</h4>
                    <p className="text-sm text-muted-foreground">
                      Carriers measure everything. Guessing leads to unexpected
                      charges
                    </p>
                  </div>
                  <div className="p-3 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <h4 className="font-medium mb-1">Ignoring Density</h4>
                    <p className="text-sm text-muted-foreground">
                      Not calculating density beforehand can result in surprise
                      class changes
                    </p>
                  </div>
                  <div className="p-3 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <h4 className="font-medium mb-1">
                      Forgetting Handling Requirements
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Special handling needs can bump up your freight class
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle
                    className="h-5 w-5"
                    style={{ color: OCEAN_BLUE }}
                  />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find answers to common questions about freight classification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          {faq.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-6 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
