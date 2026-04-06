"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Package,
  Ruler,
  Calculator,
  Thermometer,
  ArrowRight,
  RefreshCcw,
  Download,
  Share2,
  BarChart3,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Zap,
  Grid3X3,
  Table,
  FileText,
  Layers,
  Globe,
  Target,
  Info,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Milestone,
  Droplet,
  AreaChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { toast } from "sonner";

interface ConversionResult {
  inputValue: number;
  inputUnit: string;
  outputValue: number;
  outputUnit: string;
  category: string;
  formula: string;
  allConversions: { unit: string; value: number; symbol: string }[];
}

interface BatchConversion {
  id: string;
  category: string;
  inputValue: number;
  inputUnit: string;
  outputUnit: string;
  result: number;
}

// Conversion units and factors
const weightUnits = [
  { value: "kg", label: "Kilogram (kg)", factor: 1, system: "metric" },
  { value: "g", label: "Gram (g)", factor: 0.001, system: "metric" },
  { value: "mg", label: "Milligram (mg)", factor: 0.000001, system: "metric" },
  { value: "lb", label: "Pound (lb)", factor: 0.453592, system: "imperial" },
  { value: "oz", label: "Ounce (oz)", factor: 0.0283495, system: "imperial" },
  { value: "ton", label: "Metric Ton (t)", factor: 1000, system: "metric" },
  { value: "st", label: "Short Ton (US)", factor: 907.185, system: "imperial" },
  { value: "lt", label: "Long Ton (UK)", factor: 1016.05, system: "imperial" },
  { value: "cwt", label: "Hundredweight", factor: 50.8023, system: "imperial" },
  { value: "ct", label: "Carat (ct)", factor: 0.0002, system: "metric" },
];

const volumeUnits = [
  { value: "cbm", label: "Cubic Meter (m³)", factor: 1, system: "metric" },
  { value: "l", label: "Liter (L)", factor: 0.001, system: "metric" },
  { value: "ml", label: "Milliliter (mL)", factor: 0.000001, system: "metric" },
  { value: "gal_us", label: "US Gallon", factor: 0.00378541, system: "imperial" },
  { value: "gal_uk", label: "UK Gallon", factor: 0.00454609, system: "imperial" },
  { value: "ft3", label: "Cubic Foot (ft³)", factor: 0.0283168, system: "imperial" },
  { value: "in3", label: "Cubic Inch (in³)", factor: 0.0000163871, system: "imperial" },
  { value: "yd3", label: "Cubic Yard (yd³)", factor: 0.764555, system: "imperial" },
  { value: "fl_oz", label: "Fluid Ounce (US)", factor: 0.0000295735, system: "imperial" },
  { value: "bbl", label: "Barrel (oil)", factor: 0.158987, system: "imperial" },
];

const lengthUnits = [
  { value: "m", label: "Meter (m)", factor: 1, system: "metric" },
  { value: "cm", label: "Centimeter (cm)", factor: 0.01, system: "metric" },
  { value: "mm", label: "Millimeter (mm)", factor: 0.001, system: "metric" },
  { value: "km", label: "Kilometer (km)", factor: 1000, system: "metric" },
  { value: "in", label: "Inch (in)", factor: 0.0254, system: "imperial" },
  { value: "ft", label: "Foot (ft)", factor: 0.3048, system: "imperial" },
  { value: "yd", label: "Yard (yd)", factor: 0.9144, system: "imperial" },
  { value: "mi", label: "Mile (mi)", factor: 1609.34, system: "imperial" },
  { value: "nmi", label: "Nautical Mile", factor: 1852, system: "nautical" },
  { value: "dm", label: "Decimeter (dm)", factor: 0.1, system: "metric" },
];

const areaUnits = [
  { value: "m2", label: "Square Meter (m²)", factor: 1, system: "metric" },
  { value: "cm2", label: "Square Centimeter (cm²)", factor: 0.0001, system: "metric" },
  { value: "km2", label: "Square Kilometer (km²)", factor: 1000000, system: "metric" },
  { value: "ft2", label: "Square Foot (ft²)", factor: 0.092903, system: "imperial" },
  { value: "yd2", label: "Square Yard (yd²)", factor: 0.836127, system: "imperial" },
  { value: "ac", label: "Acre", factor: 4046.86, system: "imperial" },
  { value: "ha", label: "Hectare (ha)", factor: 10000, system: "metric" },
  { value: "in2", label: "Square Inch (in²)", factor: 0.00064516, system: "imperial" },
  { value: "mi2", label: "Square Mile (mi²)", factor: 2589988.11, system: "imperial" },
];

const temperatureUnits = [
  { value: "c", label: "Celsius (°C)", symbol: "°C", system: "metric" },
  { value: "f", label: "Fahrenheit (°F)", symbol: "°F", system: "imperial" },
  { value: "k", label: "Kelvin (K)", symbol: "K", system: "scientific" },
];

const speedUnits = [
  { value: "mps", label: "Meters per Second (m/s)", factor: 1, system: "metric" },
  { value: "kmh", label: "Kilometers per Hour (km/h)", factor: 0.277778, system: "metric" },
  { value: "mph", label: "Miles per Hour (mph)", factor: 0.44704, system: "imperial" },
  { value: "knot", label: "Knot (kn)", factor: 0.514444, system: "nautical" },
  { value: "fps", label: "Feet per Second (ft/s)", factor: 0.3048, system: "imperial" },
];

const pressureUnits = [
  { value: "pa", label: "Pascal (Pa)", factor: 1, system: "metric" },
  { value: "kpa", label: "Kilopascal (kPa)", factor: 1000, system: "metric" },
  { value: "bar", label: "Bar", factor: 100000, system: "metric" },
  { value: "psi", label: "PSI (lb/in²)", factor: 6894.76, system: "imperial" },
  { value: "atm", label: "Atmosphere (atm)", factor: 101325, system: "metric" },
  { value: "mmhg", label: "mmHg (Torr)", factor: 133.322, system: "metric" },
];

const categoryConfig = {
  weight: { name: "Weight", icon: Scale, color: "#0F4C81", description: "Mass and weight conversions" },
  volume: { name: "Volume", icon: Package, color: "#2E8B57", description: "Liquid and volume measurements" },
  length: { name: "Length", icon: Ruler, color: "#0F4C81", description: "Distance and length units" },
  area: { name: "Area", icon: AreaChart, color: "#2E8B57", description: "Surface area calculations" },
  temperature: { name: "Temperature", icon: Thermometer, color: "#F59E0B", description: "Temperature scales" },
  speed: { name: "Speed", icon: Milestone, color: "#8B5CF6", description: "Velocity conversions" },
  pressure: { name: "Pressure", icon: Droplet, color: "#EC4899", description: "Pressure units" },
};

const FAQS = [
  {
    question: "What is the difference between metric and imperial measurement systems?",
    answer: "The metric system is a decimal-based measurement system used globally, featuring units like meters, liters, and grams with prefixes (kilo-, centi-, milli-) for scaling. It's used in almost all countries worldwide and is the standard for scientific work. The imperial system, primarily used in the United States and a few other countries, uses units like feet, pounds, and gallons with non-decimal conversion factors (12 inches per foot, 16 ounces per pound). For international trade, understanding both systems is essential as different markets and industries may prefer different units.",
  },
  {
    question: "How do I convert between Fahrenheit and Celsius temperatures?",
    answer: "To convert Fahrenheit to Celsius, use the formula: °C = (°F - 32) × 5/9. To convert Celsius to Fahrenheit: °F = (°C × 9/5) + 32. Key reference points: water freezes at 0°C (32°F) and boils at 100°C (212°F) at sea level. Room temperature is approximately 20-22°C (68-72°F). Body temperature is around 37°C (98.6°F). In logistics, temperature-sensitive cargo often uses Celsius globally, though Fahrenheit remains common in US domestic shipments. Always specify the scale when documenting temperatures to avoid costly mistakes with perishable goods.",
  },
  {
    question: "What are the most common weight conversions in international trade?",
    answer: "The most critical weight conversions in trade include: 1 kilogram = 2.20462 pounds (the most frequent conversion); 1 metric ton = 1,000 kg = 2,204.62 lbs; 1 short ton (US) = 2,000 lbs = 907.185 kg; 1 long ton (UK) = 2,240 lbs = 1,016.05 kg. The distinction between metric ton, short ton, and long ton is crucial in shipping contracts. A misunderstanding can lead to significant discrepancies in cargo weight declarations. Most international shipping now uses metric tons, but US domestic shipping may reference short tons, while some UK contracts may still use long tons.",
  },
  {
    question: "How do I calculate cubic meters (CBM) from package dimensions?",
    answer: "To calculate CBM: CBM = Length (m) × Width (m) × Height (m). If dimensions are in centimeters, divide by 1,000,000 or multiply the result in cubic centimeters by 0.000001. For inches, multiply by 0.0000163871 per cubic inch. For example, a pallet measuring 120cm × 80cm × 100cm = 0.96 CBM. In shipping, CBM determines volumetric weight for air freight and space allocation in containers. Sea freight typically uses CBM for calculating freight charges on volumetric cargo. Understanding CBM calculations helps optimize packaging and estimate shipping costs accurately.",
  },
  {
    question: "Why are there different gallon measurements (US vs UK)?",
    answer: "The US gallon and UK (imperial) gallon have different origins and volumes. The US gallon equals 3.785 liters, while the UK gallon equals 4.546 liters - a difference of about 20%. The US gallon is based on the historical wine gallon, while the imperial gallon was defined in 1824 as the volume of 10 pounds of water at a specific temperature. This difference extends to all derived units: a US quart, pint, and fluid ounce are all proportionally smaller than their UK counterparts. In fuel and liquid bulk shipping, confusing these units can lead to significant quantity errors, making it essential to specify which gallon is referenced in contracts.",
  },
  {
    question: "What is the relationship between metric and nautical measurements in shipping?",
    answer: "Nautical measurements remain standard in maritime and aviation despite global metric adoption. A nautical mile (1,852 meters or 6,076 feet) is based on one minute of latitude, making it ideal for navigation. Speed in knots equals nautical miles per hour. Ship capacities are often measured in deadweight tons (DWT) - the weight a ship can carry - while container volumes use metric TEU (Twenty-foot Equivalent Unit). Understanding both systems is essential: vessel speeds are discussed in knots, port distances in nautical miles, but cargo weights in metric tons and container volumes in CBM. This dual system persists because nautical units have practical navigational significance that metric units don't directly provide.",
  },
  {
    question: "How do pressure conversions apply to logistics and shipping?",
    answer: "Pressure conversions are critical in several logistics contexts: tire pressure (PSI vs bar) for trucks and handling equipment; container pressure equalization for sealed shipments; refrigerated container specifications; hydraulic systems on forklifts and cranes. Standard atmospheric pressure is 1 atm = 101.325 kPa = 14.696 PSI = 1.01325 bar. Tire pressures are typically 30-35 PSI (~2-2.4 bar) for trucks. Refrigerated containers may specify pressure requirements in different units depending on manufacturer origin. Understanding these conversions helps ensure equipment is properly maintained and cargo specifications are correctly followed across different technical documentation systems.",
  },
];

const PRO_TIPS = [
  {
    title: "Document Units Clearly",
    description: "Always specify units in all documentation. Write '100 kg' not just '100'. This prevents costly misunderstandings in international shipments.",
    icon: FileText,
  },
  {
    title: "Use Metric for International",
    description: "Default to metric units for international trade. It's the global standard and reduces conversion errors across supply chain partners.",
    icon: Globe,
  },
  {
    title: "Double-Check Critical Conversions",
    description: "Verify weight and volume conversions before cargo booking. A small error can lead to capacity issues or overweight penalties.",
    icon: Target,
  },
  {
    title: "Know Your Ton Types",
    description: "Remember: Metric ton (1,000 kg), Short ton (907 kg), Long ton (1,016 kg). Always clarify which ton is specified in contracts.",
    icon: Scale,
  },
  {
    title: "Calculate CBM Accurately",
    description: "CBM is crucial for shipping costs. Include packaging, pallets, and any overhang in your measurements for accurate quotes.",
    icon: Package,
  },
];

// Common conversions for quick tools
const commonConversions = [
  { from: "kg", to: "lb", category: "weight", value: 1, label: "1 kg to lbs" },
  { from: "lb", to: "kg", category: "weight", value: 1, label: "1 lb to kg" },
  { from: "m", to: "ft", category: "length", value: 1, label: "1 m to ft" },
  { from: "ft", to: "m", category: "length", value: 1, label: "1 ft to m" },
  { from: "cbm", to: "ft3", category: "volume", value: 1, label: "1 m³ to ft³" },
  { from: "c", to: "f", category: "temperature", value: 0, label: "0°C to °F" },
  { from: "c", to: "f", category: "temperature", value: 100, label: "100°C to °F" },
  { from: "km", to: "mi", category: "length", value: 1, label: "1 km to miles" },
  { from: "l", to: "gal_us", category: "volume", value: 1, label: "1 L to US gal" },
  { from: "gal_us", to: "l", category: "volume", value: 1, label: "1 US gal to L" },
  { from: "ton", to: "lb", category: "weight", value: 1, label: "1 metric ton to lbs" },
  { from: "st", to: "kg", category: "weight", value: 1, label: "1 short ton to kg" },
];

export default function UnitConverter() {
  const [category, setCategory] = useState<"weight" | "volume" | "length" | "area" | "temperature" | "speed" | "pressure">("weight");
  const [inputValue, setInputValue] = useState("1000");
  const [inputUnit, setInputUnit] = useState("kg");
  const [outputUnit, setOutputUnit] = useState("lb");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [activeTab, setActiveTab] = useState("converter");
  const [copied, setCopied] = useState<string | null>(null);
  const [batchConversions, setBatchConversions] = useState<BatchConversion[]>([]);
  const [history, setHistory] = useState<BatchConversion[]>([]);

  const getUnitsForCategory = useCallback((cat: string) => {
    switch (cat) {
      case "weight": return weightUnits;
      case "volume": return volumeUnits;
      case "length": return lengthUnits;
      case "area": return areaUnits;
      case "temperature": return temperatureUnits;
      case "speed": return speedUnits;
      case "pressure": return pressureUnits;
      default: return weightUnits;
    }
  }, []);

  const getUnits = useCallback(() => {
    return getUnitsForCategory(category);
  }, [category, getUnitsForCategory]);

  const convertValue = useCallback((value: number, fromUnit: string, toUnit: string, cat: string): number => {
    const units = getUnitsForCategory(cat);
    
    if (cat === "temperature") {
      let celsius: number;
      switch (fromUnit) {
        case "c": celsius = value; break;
        case "f": celsius = (value - 32) * 5 / 9; break;
        case "k": celsius = value - 273.15; break;
        default: celsius = value;
      }
      switch (toUnit) {
        case "c": return celsius;
        case "f": return celsius * 9 / 5 + 32;
        case "k": return celsius + 273.15;
        default: return celsius;
      }
    }

    const inputFactor = units.find(u => u.value === fromUnit)?.factor || 1;
    const outputFactor = units.find(u => u.value === toUnit)?.factor || 1;
    return (value * inputFactor) / outputFactor;
  }, [getUnitsForCategory]);

  const convert = useCallback(() => {
    const value = parseFloat(inputValue) || 0;
    const units = getUnits();
    
    let outputValue: number;
    let allConversions: { unit: string; value: number; symbol: string }[] = [];

    if (category === "temperature") {
      let celsius: number;
      
      switch (inputUnit) {
        case "c": celsius = value; break;
        case "f": celsius = (value - 32) * 5 / 9; break;
        case "k": celsius = value - 273.15; break;
        default: celsius = value;
      }

      switch (outputUnit) {
        case "c": outputValue = celsius; break;
        case "f": outputValue = celsius * 9 / 5 + 32; break;
        case "k": outputValue = celsius + 273.15; break;
        default: outputValue = celsius;
      }

      allConversions = [
        { unit: "Celsius", value: celsius, symbol: "°C" },
        { unit: "Fahrenheit", value: celsius * 9 / 5 + 32, symbol: "°F" },
        { unit: "Kelvin", value: celsius + 273.15, symbol: "K" },
      ];
    } else {
      const inputFactor = units.find(u => u.value === inputUnit)?.factor || 1;
      const outputFactor = units.find(u => u.value === outputUnit)?.factor || 1;
      
      const baseValue = value * inputFactor;
      outputValue = baseValue / outputFactor;

      allConversions = units.map(u => ({
        unit: u.label,
        value: baseValue / u.factor,
        symbol: u.value,
      }));
    }

    const inputUnitLabel = units.find(u => u.value === inputUnit)?.label || inputUnit;
    const outputUnitLabel = units.find(u => u.value === outputUnit)?.label || outputUnit;

    let formula = "";
    if (category === "temperature") {
      if (inputUnit === "c" && outputUnit === "f") formula = "°F = °C × 9/5 + 32";
      else if (inputUnit === "f" && outputUnit === "c") formula = "°C = (°F - 32) × 5/9";
      else if (inputUnit === "c" && outputUnit === "k") formula = "K = °C + 273.15";
      else if (inputUnit === "k" && outputUnit === "c") formula = "°C = K - 273.15";
      else if (inputUnit === "f" && outputUnit === "k") formula = "K = (°F - 32) × 5/9 + 273.15";
      else if (inputUnit === "k" && outputUnit === "f") formula = "°F = (K - 273.15) × 9/5 + 32";
      else formula = "Same unit";
    } else {
      const inputFactor = units.find(u => u.value === inputUnit)?.factor || 1;
      const outputFactor = units.find(u => u.value === outputUnit)?.factor || 1;
      const ratio = inputFactor / outputFactor;
      formula = `1 ${inputUnit} = ${ratio.toFixed(6)} ${outputUnit}`;
    }

    const newResult: ConversionResult = {
      inputValue: value,
      inputUnit: inputUnitLabel,
      outputValue: Math.round(outputValue * 100000) / 100000,
      outputUnit: outputUnitLabel,
      category,
      formula,
      allConversions,
    };

    setResult(newResult);

    // Add to history
    const historyEntry: BatchConversion = {
      id: crypto.randomUUID(),
      category,
      inputValue: value,
      inputUnit,
      outputUnit,
      result: Math.round(outputValue * 100000) / 100000,
    };
    setHistory(prev => [historyEntry, ...prev.slice(0, 9)]);
  }, [inputValue, inputUnit, outputUnit, category, getUnits]);

  const swapUnits = () => {
    const temp = inputUnit;
    setInputUnit(outputUnit);
    setOutputUnit(temp);
    setResult(null);
  };

  const resetForm = () => {
    setInputValue("1000");
    setDefaultUnits(category);
    setResult(null);
  };

  const setDefaultUnits = (cat: typeof category) => {
    switch (cat) {
      case "weight":
        setInputUnit("kg");
        setOutputUnit("lb");
        break;
      case "volume":
        setInputUnit("cbm");
        setOutputUnit("ft3");
        break;
      case "length":
        setInputUnit("m");
        setOutputUnit("ft");
        break;
      case "area":
        setInputUnit("m2");
        setOutputUnit("ft2");
        break;
      case "temperature":
        setInputUnit("c");
        setOutputUnit("f");
        break;
      case "speed":
        setInputUnit("kmh");
        setOutputUnit("mph");
        break;
      case "pressure":
        setInputUnit("bar");
        setOutputUnit("psi");
        break;
    }
  };

  const handleCategoryChange = (newCategory: typeof category) => {
    setCategory(newCategory);
    setDefaultUnits(newCategory);
    setResult(null);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };

  const addBatchConversion = () => {
    if (result) {
      const batchEntry: BatchConversion = {
        id: crypto.randomUUID(),
        category,
        inputValue: result.inputValue,
        inputUnit,
        outputUnit,
        result: result.outputValue,
      };
      setBatchConversions(prev => [...prev, batchEntry]);
    }
  };

  const clearBatch = () => {
    setBatchConversions([]);
  };

  const handleQuickConversion = (conv: typeof commonConversions[0]) => {
    setCategory(conv.category as typeof category);
    setInputValue(conv.value.toString());
    setInputUnit(conv.from);
    setOutputUnit(conv.to);
    setTimeout(() => {
      convert();
    }, 100);
  };

  // Chart data for visualizations
  const categoryData = useMemo(() => {
    return Object.entries(categoryConfig).map(([key, config]) => ({
      name: config.name,
      units: getUnitsForCategory(key).length,
      color: config.color,
    }));
  }, []);

  const conversionHistoryData = useMemo(() => {
    return history.slice(0, 5).map((h, i) => ({
      name: `${h.inputValue} ${h.inputUnit}`,
      result: h.result,
      category: h.category,
    }));
  }, [history]);

  const CategoryIcon = categoryConfig[category].icon;

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[var(--ocean)] text-white">
                <Calculator className="h-3 w-3 mr-1" />
                Tools
              </Badge>
              <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                <Zap className="h-3 w-3 mr-1" />
                Quick Reference
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Unit Converter
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Comprehensive unit conversion tool for international trade. Convert weights, volumes, lengths, 
              temperatures, and more between metric and imperial systems.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={() => result && copyToClipboard(`${result.inputValue} ${inputUnit} = ${result.outputValue} ${outputUnit}`, "result")}>
              {copied === "result" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="converter" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Converter</span>
          </TabsTrigger>
          <TabsTrigger value="reference" className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            <span className="hidden sm:inline">Reference</span>
          </TabsTrigger>
          <TabsTrigger value="quicktools" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Quick Tools</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Converter Tab */}
        <TabsContent value="converter" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5 text-[var(--ocean)]" />
                    Category Selection
                  </CardTitle>
                  <CardDescription>
                    Choose a measurement category to convert
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {Object.entries(categoryConfig).map(([key, config]) => {
                      const Icon = config.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => handleCategoryChange(key as typeof category)}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                            category === key
                              ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${category === key ? "text-[var(--ocean)]" : ""}`} />
                          <span className="text-xs">{config.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon className="h-4 w-4 text-[var(--ocean)]" />
                      <span className="font-medium">{categoryConfig[category].name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {categoryConfig[category].description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {getUnits().length} units available
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getUnits().filter(u => u.system === "metric").length} metric | {getUnits().filter(u => u.system === "imperial").length} imperial
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[var(--logistics)]" />
                    Conversion Input
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Value Input */}
                  <div className="space-y-2">
                    <Label htmlFor="inputValue">Value</Label>
                    <Input
                      id="inputValue"
                      type="number"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter value"
                      className="text-lg"
                    />
                  </div>

                  {/* Unit Selection */}
                  <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
                    <div className="space-y-2">
                      <Label>From</Label>
                      <Select value={inputUnit} onValueChange={setInputUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getUnits().map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              <div className="flex items-center gap-2">
                                <span>{unit.label}</span>
                                {unit.system && (
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    {unit.system}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={swapUnits}
                      className="mb-0.5"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <div className="space-y-2">
                      <Label>To</Label>
                      <Select value={outputUnit} onValueChange={setOutputUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getUnits().map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              <div className="flex items-center gap-2">
                                <span>{unit.label}</span>
                                {unit.system && (
                                  <Badge variant="outline" className="text-xs ml-auto">
                                    {unit.system}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={convert}
                      className="flex-1 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] hover:opacity-90"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Convert
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetForm}
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className={`border-2 ${result ? "border-[var(--logistics)]/30" : ""}`}>
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <CategoryIcon className="h-5 w-5 text-[var(--ocean)]" />
                    Conversion Result
                  </CardTitle>
                  <CardDescription>
                    {result ? `${categoryConfig[category].name} conversion result` : "Enter value and click Convert"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {result ? (
                    <div className="space-y-6">
                      {/* Primary Result */}
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-br from-[var(--ocean)] to-[var(--logistics)] rounded-xl p-6 text-white text-center"
                      >
                        <p className="text-sm opacity-90 mb-2">
                          {result.inputValue} {result.inputUnit}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <ArrowRight className="h-6 w-6" />
                          <p className="text-4xl font-bold">{result.outputValue.toLocaleString()}</p>
                        </div>
                        <p className="text-sm opacity-75 mt-2">{result.outputUnit}</p>
                      </motion.div>

                      {/* Formula */}
                      <div className="bg-muted/30 rounded-lg p-4 text-center">
                        <p className="text-sm text-muted-foreground">Formula</p>
                        <p className="font-mono text-sm mt-1">{result.formula}</p>
                      </div>

                      {/* All Conversions */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">All Conversions</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={addBatchConversion}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add to Batch
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                          {result.allConversions.map((conv, index) => (
                            <div
                              key={index}
                              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                                conv.symbol === outputUnit
                                  ? "bg-[var(--logistics)]/10 border border-[var(--logistics)]"
                                  : "bg-muted/30 hover:bg-muted/50"
                              }`}
                              onClick={() => copyToClipboard(`${conv.value} ${conv.symbol}`, `conv-${index}`)}
                            >
                              <p className="text-xs text-muted-foreground">{conv.unit}</p>
                              <p className="font-medium text-sm">
                                {conv.value < 0.01 && conv.value > 0
                                  ? conv.value.toExponential(2)
                                  : conv.value.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Scale className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        Enter a value and click Convert to see results
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Conversion History */}
              {history.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Grid3X3 className="h-4 w-4 text-[var(--ocean)]" />
                      Recent Conversions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {history.slice(0, 5).map((h, index) => (
                        <div
                          key={h.id}
                          className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm"
                        >
                          <span className="text-muted-foreground">
                            {h.inputValue} {h.inputUnit}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">
                            {h.result} {h.outputUnit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Weight Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-[var(--ocean)]" />
                  Weight Conversions
                </CardTitle>
                <CardDescription>Common weight unit conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3">Unit</th>
                        <th className="text-center py-2 px-3">Kilograms</th>
                        <th className="text-center py-2 px-3">Pounds</th>
                        <th className="text-center py-2 px-3">Metric Tons</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">1 Kilogram</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 kg</Badge></td>
                        <td className="text-center py-2 px-3">2.20462 lb</td>
                        <td className="text-center py-2 px-3">0.001 t</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-2 px-3">1 Pound</td>
                        <td className="text-center py-2 px-3">0.45359 kg</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 lb</Badge></td>
                        <td className="text-center py-2 px-3">0.000454 t</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">1 Metric Ton</td>
                        <td className="text-center py-2 px-3">1,000 kg</td>
                        <td className="text-center py-2 px-3">2,204.62 lb</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 t</Badge></td>
                      </tr>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-2 px-3">1 Short Ton (US)</td>
                        <td className="text-center py-2 px-3">907.185 kg</td>
                        <td className="text-center py-2 px-3">2,000 lb</td>
                        <td className="text-center py-2 px-3">0.907 t</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">1 Long Ton (UK)</td>
                        <td className="text-center py-2 px-3">1,016.05 kg</td>
                        <td className="text-center py-2 px-3">2,240 lb</td>
                        <td className="text-center py-2 px-3">1.016 t</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Volume Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[var(--logistics)]" />
                  Volume Conversions
                </CardTitle>
                <CardDescription>Common volume unit conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3">Unit</th>
                        <th className="text-center py-2 px-3">Cubic Meters</th>
                        <th className="text-center py-2 px-3">Liters</th>
                        <th className="text-center py-2 px-3">US Gallons</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">1 Cubic Meter</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 m³</Badge></td>
                        <td className="text-center py-2 px-3">1,000 L</td>
                        <td className="text-center py-2 px-3">264.172 gal</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-2 px-3">1 Liter</td>
                        <td className="text-center py-2 px-3">0.001 m³</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 L</Badge></td>
                        <td className="text-center py-2 px-3">0.264 gal</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">1 US Gallon</td>
                        <td className="text-center py-2 px-3">0.00379 m³</td>
                        <td className="text-center py-2 px-3">3.785 L</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 gal</Badge></td>
                      </tr>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-2 px-3">1 UK Gallon</td>
                        <td className="text-center py-2 px-3">0.00455 m³</td>
                        <td className="text-center py-2 px-3">4.546 L</td>
                        <td className="text-center py-2 px-3">1.201 gal</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">1 Cubic Foot</td>
                        <td className="text-center py-2 px-3">0.0283 m³</td>
                        <td className="text-center py-2 px-3">28.317 L</td>
                        <td className="text-center py-2 px-3">7.481 gal</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Length Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-[var(--ocean)]" />
                  Length Conversions
                </CardTitle>
                <CardDescription>Common length unit conversions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3">Unit</th>
                        <th className="text-center py-2 px-3">Meters</th>
                        <th className="text-center py-2 px-3">Feet</th>
                        <th className="text-center py-2 px-3">Inches</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">1 Meter</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 m</Badge></td>
                        <td className="text-center py-2 px-3">3.281 ft</td>
                        <td className="text-center py-2 px-3">39.37 in</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-2 px-3">1 Foot</td>
                        <td className="text-center py-2 px-3">0.3048 m</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 ft</Badge></td>
                        <td className="text-center py-2 px-3">12 in</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">1 Inch</td>
                        <td className="text-center py-2 px-3">0.0254 m</td>
                        <td className="text-center py-2 px-3">0.0833 ft</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">1 in</Badge></td>
                      </tr>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-2 px-3">1 Mile</td>
                        <td className="text-center py-2 px-3">1,609.34 m</td>
                        <td className="text-center py-2 px-3">5,280 ft</td>
                        <td className="text-center py-2 px-3">63,360 in</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">1 Nautical Mile</td>
                        <td className="text-center py-2 px-3">1,852 m</td>
                        <td className="text-center py-2 px-3">6,076 ft</td>
                        <td className="text-center py-2 px-3">72,913 in</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Temperature Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-amber-500" />
                  Temperature Scales
                </CardTitle>
                <CardDescription>Temperature conversion reference</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3">Reference Point</th>
                        <th className="text-center py-2 px-3">Celsius</th>
                        <th className="text-center py-2 px-3">Fahrenheit</th>
                        <th className="text-center py-2 px-3">Kelvin</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">Absolute Zero</td>
                        <td className="text-center py-2 px-3">-273.15°C</td>
                        <td className="text-center py-2 px-3">-459.67°F</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">0 K</Badge></td>
                      </tr>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-2 px-3">Water Freezes</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">0°C</Badge></td>
                        <td className="text-center py-2 px-3">32°F</td>
                        <td className="text-center py-2 px-3">273.15 K</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-3">Room Temperature</td>
                        <td className="text-center py-2 px-3">20-22°C</td>
                        <td className="text-center py-2 px-3">68-72°F</td>
                        <td className="text-center py-2 px-3">293-295 K</td>
                      </tr>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <td className="py-2 px-3">Body Temperature</td>
                        <td className="text-center py-2 px-3">37°C</td>
                        <td className="text-center py-2 px-3">98.6°F</td>
                        <td className="text-center py-2 px-3">310.15 K</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Water Boils</td>
                        <td className="text-center py-2 px-3"><Badge variant="outline">100°C</Badge></td>
                        <td className="text-center py-2 px-3">212°F</td>
                        <td className="text-center py-2 px-3">373.15 K</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Container Dimensions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--logistics)]" />
                Standard Container Dimensions
              </CardTitle>
              <CardDescription>ISO container specifications for shipping</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3">Container Type</th>
                      <th className="text-center py-2 px-3">Internal (L×W×H)</th>
                      <th className="text-center py-2 px-3">Capacity (CBM)</th>
                      <th className="text-center py-2 px-3">Max Payload (kg)</th>
                      <th className="text-center py-2 px-3">Door Opening</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-3 font-medium">20ft Standard</td>
                      <td className="text-center py-2 px-3">5.90×2.35×2.39 m</td>
                      <td className="text-center py-2 px-3 font-bold text-[var(--ocean)]">33.2 m³</td>
                      <td className="text-center py-2 px-3">21,900 kg</td>
                      <td className="text-center py-2 px-3">2.34×2.28 m</td>
                    </tr>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <td className="py-2 px-3 font-medium">40ft Standard</td>
                      <td className="text-center py-2 px-3">12.03×2.35×2.39 m</td>
                      <td className="text-center py-2 px-3 font-bold text-[var(--ocean)]">67.7 m³</td>
                      <td className="text-center py-2 px-3">26,630 kg</td>
                      <td className="text-center py-2 px-3">2.34×2.28 m</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2 px-3 font-medium">40ft High Cube</td>
                      <td className="text-center py-2 px-3">12.03×2.35×2.69 m</td>
                      <td className="text-center py-2 px-3 font-bold text-[var(--logistics)]">76.3 m³</td>
                      <td className="text-center py-2 px-3">26,330 kg</td>
                      <td className="text-center py-2 px-3">2.34×2.58 m</td>
                    </tr>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <td className="py-2 px-3 font-medium">45ft High Cube</td>
                      <td className="text-center py-2 px-3">13.56×2.35×2.69 m</td>
                      <td className="text-center py-2 px-3 font-bold text-[var(--logistics)]">86.1 m³</td>
                      <td className="text-center py-2 px-3">25,500 kg</td>
                      <td className="text-center py-2 px-3">2.34×2.58 m</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-medium">20ft Refrigerated</td>
                      <td className="text-center py-2 px-3">5.42×2.29×2.27 m</td>
                      <td className="text-center py-2 px-3 font-bold text-[var(--ocean)]">28.2 m³</td>
                      <td className="text-center py-2 px-3">21,970 kg</td>
                      <td className="text-center py-2 px-3">2.29×2.18 m</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Units by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={10} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="units" name="Available Units" radius={[4, 4, 0, 0]}>
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
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
                  <Globe className="h-5 w-5 text-[var(--logistics)]" />
                  Measurement Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { category: "Weight", metric: 6, imperial: 4 },
                      { category: "Volume", metric: 4, imperial: 6 },
                      { category: "Length", metric: 5, imperial: 4 },
                      { category: "Area", metric: 4, imperial: 5 },
                      { category: "Speed", metric: 2, imperial: 2 },
                      { category: "Pressure", metric: 4, imperial: 1 },
                    ]}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis />
                      <Radar name="Metric" dataKey="metric" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.5} />
                      <Radar name="Imperial" dataKey="imperial" stroke="#2E8B57" fill="#2E8B57" fillOpacity={0.5} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quick Tools Tab */}
        <TabsContent value="quicktools" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Conversions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Quick Conversions
                </CardTitle>
                <CardDescription>Common conversions at your fingertips</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {commonConversions.map((conv, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickConversion(conv)}
                      className="p-3 rounded-lg border border-border hover:border-[var(--ocean)] hover:bg-[var(--ocean)]/5 transition-all text-left"
                    >
                      <div className="font-medium text-sm">{conv.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        = {convertValue(conv.value, conv.from, conv.to, conv.category).toFixed(4)} {conv.to}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Batch Conversion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[var(--logistics)]" />
                  Batch Conversion
                </CardTitle>
                <CardDescription>Track multiple conversions together</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {batchConversions.length > 0 ? (
                  <>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {batchConversions.map((batch, index) => (
                        <div
                          key={batch.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">
                              {categoryConfig[batch.category as keyof typeof categoryConfig]?.name}
                            </Badge>
                            <div className="text-sm">
                              {batch.inputValue} {batch.inputUnit} → {batch.result} {batch.outputUnit}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBatchConversions(prev => prev.filter(b => b.id !== batch.id))}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearBatch}
                        className="flex-1"
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const text = batchConversions
                            .map(b => `${b.inputValue} ${b.inputUnit} = ${b.result} ${b.outputUnit}`)
                            .join("\n");
                          copyToClipboard(text, "batch");
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy All
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No batch conversions yet</p>
                    <p className="text-xs">Click "Add to Batch" after converting to track multiple conversions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Key Formulas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--ocean)]" />
                Key Conversion Formulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-amber-500" />
                    Temperature
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p>°F = (°C × 9/5) + 32</p>
                    <p>°C = (°F - 32) × 5/9</p>
                    <p>K = °C + 273.15</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-[var(--ocean)]" />
                    Weight
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p>1 kg = 2.20462 lb</p>
                    <p>1 t = 1,000 kg</p>
                    <p>1 st (US) = 907.185 kg</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--logistics)]" />
                    Volume
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p>CBM = L × W × H (m)</p>
                    <p>1 m³ = 35.315 ft³</p>
                    <p>1 L = 0.264 US gal</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-[var(--ocean)]" />
                    Length
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p>1 m = 3.28084 ft</p>
                    <p>1 in = 2.54 cm</p>
                    <p>1 nmi = 1.852 km</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Milestone className="h-4 w-4 text-purple-500" />
                    Speed
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p>1 km/h = 0.621 mph</p>
                    <p>1 knot = 1.852 km/h</p>
                    <p>1 m/s = 3.6 km/h</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-pink-500" />
                    Pressure
                  </h4>
                  <div className="space-y-1 text-xs font-mono">
                    <p>1 bar = 14.504 psi</p>
                    <p>1 atm = 101.325 kPa</p>
                    <p>1 psi = 6.895 kPa</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding Unit Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The modern world primarily uses two measurement systems: the metric system (SI units) and the 
                  imperial system. Understanding both is essential for international trade and logistics, where 
                  different regions and industries may prefer different units. The metric system, based on powers 
                  of 10, is used by approximately 95% of the world's population and is the standard for scientific 
                  work. It features straightforward conversions between units using decimal prefixes like kilo-, 
                  centi-, and milli-.
                </p>
                <p className="text-sm text-muted-foreground">
                  The imperial system, derived from historical English units, remains prevalent in the United States 
                  and some Commonwealth countries. While less intuitive for conversions, many imperial units have 
                  practical origins - for example, a foot was originally based on the length of a human foot, and 
                  a gallon was defined by the volume of eight pounds of wine. In shipping and logistics, you'll 
                  frequently encounter both systems, making conversion skills essential for accurate documentation, 
                  cargo planning, and cost calculations.
                </p>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--ocean)]/10 rounded-lg">
                    <h4 className="font-medium text-sm text-[var(--ocean)]">Metric System</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• Base 10 system</li>
                      <li>• Used in 95% of countries</li>
                      <li>• SI standard units</li>
                      <li>• Scientific standard</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-[var(--logistics)]/10 rounded-lg">
                    <h4 className="font-medium text-sm text-[var(--logistics)]">Imperial System</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• Historical English units</li>
                      <li>• US, UK partial use</li>
                      <li>• Industry-specific</li>
                      <li>• Legacy infrastructure</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Unit Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--logistics)]" />
                  Best Practices for International Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  In international trade and logistics, unit conversion errors can lead to significant financial 
                  losses, shipment delays, and contractual disputes. A seemingly small mistake in converting tons 
                  (metric ton vs. short ton) can result in weight discrepancies of over 10%, potentially causing 
                  overweight penalties or cargo rejection at ports. Similarly, confusion between US and UK gallons 
                  can lead to 20% volume discrepancies in liquid bulk shipments.
                </p>
                <p className="text-sm text-muted-foreground">
                  To minimize errors, always follow these best practices: First, explicitly state units in all 
                  documentation, including contracts, invoices, and shipping documents. Use the format "100 kg" 
                  rather than just "100". Second, when in doubt, default to metric units as the international 
                  standard. Third, implement double-check procedures for critical conversions, especially for 
                  weight and volume calculations that determine freight costs. Fourth, maintain conversion logs 
                  for audit trails and dispute resolution. Finally, train staff on the specific unit conventions 
                  used by your trading partners and in your target markets.
                </p>
                <Separator />
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mb-2" />
                    <h4 className="font-medium text-sm">Do</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• Always specify units explicitly</li>
                      <li>• Use metric for international trade</li>
                      <li>• Double-check critical conversions</li>
                      <li>• Keep conversion records</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-amber-500 mb-2" />
                    <h4 className="font-medium text-sm">Caution</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• Ton types differ by 10%+</li>
                      <li>• Gallons differ by 20%</li>
                      <li>• Temperature scales non-linear</li>
                      <li>• Regional conventions vary</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-500 mb-2" />
                    <h4 className="font-medium text-sm">Don't</h4>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• Assume unit type</li>
                      <li>• Skip conversions in docs</li>
                      <li>• Mix systems in one document</li>
                      <li>• Ignore precision requirements</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about unit conversions in international trade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQS.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-left font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <BookOpen className="h-8 w-8 text-[var(--ocean)] mx-auto mb-2" />
                  <h4 className="font-medium text-sm">SI Unit Standards</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    International System of Units reference
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <Globe className="h-8 w-8 text-[var(--logistics)] mx-auto mb-2" />
                  <h4 className="font-medium text-sm">Country Standards</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Regional measurement conventions
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <FileText className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-medium text-sm">Trade Documentation</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Best practices for unit notation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper Plus icon component
function Plus({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
