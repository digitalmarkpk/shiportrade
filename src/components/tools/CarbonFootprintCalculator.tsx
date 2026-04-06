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
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Calculator,
  LineChart,
  Lightbulb,
  FileText,
  Recycle,
  Fuel,
  Target,
  Scale,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  LineChart as RechartsLineChart,
  Line,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CarbonResult {
  totalEmissions: number;
  emissionsPerKg: number;
  emissionsPerKm: number;
  treeOffset: number;
  carEquivalent: number;
  flightEquivalent: number;
  breakdown: {
    transport: number;
    handling: number;
    packaging: number;
  };
}

// CO2 emission factors (kg CO2e per tonne-km)
const emissionFactors = {
  ocean: {
    bulk: 0.0089,
    container: 0.0158,
    tanker: 0.0123,
    roro: 0.0189,
  },
  air: {
    belly: 0.602,
    freighter: 0.502,
    express: 0.704,
  },
  road: {
    truckLight: 0.209,
    truckMedium: 0.135,
    truckHeavy: 0.096,
    truckArticulated: 0.062,
  },
  rail: {
    diesel: 0.028,
    electric: 0.018,
    mixed: 0.023,
  },
};

// Country grid emission factors (kg CO2e per kWh)
const gridEmissions: Record<string, number> = {
  US: 0.417,
  CN: 0.555,
  EU: 0.255,
  UK: 0.233,
  JP: 0.464,
  AU: 0.730,
  IN: 0.708,
  BR: 0.089,
  DEFAULT: 0.475,
};

const transportModes = [
  { id: "ocean", name: "Ocean Freight", icon: Ship, color: "#0F4C81" },
  { id: "air", name: "Air Freight", icon: Plane, color: "#8b5cf6" },
  { id: "road", name: "Road Transport", icon: Truck, color: "#2E8B57" },
  { id: "rail", name: "Rail Transport", icon: Train, color: "#f59e0b" },
];

// Standard emission factors for comparison
const standardEmissionFactors = [
  { mode: "Ocean", factor: 0.015, color: "#0F4C81", icon: Ship, description: "Most efficient for long distances" },
  { mode: "Rail", factor: 0.030, color: "#f59e0b", icon: Train, description: "Efficient for land transport" },
  { mode: "Road", factor: 0.100, color: "#2E8B57", icon: Truck, description: "Flexible but higher emissions" },
  { mode: "Air", factor: 0.500, color: "#ef4444", icon: Plane, description: "Fastest but highest emissions" },
];

// FAQ data
const faqData = [
  {
    question: "What is a carbon footprint in logistics?",
    answer: "A carbon footprint in logistics refers to the total amount of greenhouse gases (primarily CO2) produced directly and indirectly by transportation and supply chain activities. This includes emissions from fuel combustion in vehicles, vessels, and aircraft, as well as indirect emissions from electricity used in warehouses, ports, and logistics facilities. Understanding your carbon footprint is essential for environmental compliance, cost management, and sustainable business practices. The logistics sector accounts for approximately 8-10% of global CO2 emissions, making it a critical area for carbon reduction initiatives."
  },
  {
    question: "How is CO2 calculated for freight transport?",
    answer: "CO2 emissions for freight transport are calculated using the formula: Emissions = Distance × Weight × Emission Factor. The emission factor represents the amount of CO2 emitted per tonne-kilometer of cargo transported and varies significantly by transport mode. For example, ocean freight has an emission factor of approximately 0.015 kg CO2/tonne-km, while air freight has a factor of 0.500 kg CO2/tonne-km - over 30 times higher. These factors are derived from the GLEC Framework (Global Logistics Emissions Council) and IMO data, considering fuel consumption, vehicle efficiency, load factors, and well-to-wheel emissions that include both fuel production and combustion."
  },
  {
    question: "Which transport mode has the lowest carbon footprint?",
    answer: "Ocean freight has the lowest carbon footprint among all transport modes, with approximately 0.015 kg CO2 per tonne-kilometer. Rail transport follows at about 0.030 kg CO2/tonne-km, making it the most environmentally friendly option for land-based transport. Road transport produces approximately 0.100 kg CO2/tonne-km, while air freight has the highest emissions at around 0.500 kg CO2/tonne-km. For context, shipping 1 tonne of cargo 10,000 km by ocean produces roughly 150 kg CO2, while the same shipment by air would produce about 5,000 kg CO2 - a difference of over 3,000%. This makes ocean and rail transport the preferred choices for environmentally conscious supply chains."
  },
  {
    question: "What are IMO 2020 and CII regulations?",
    answer: "IMO 2020 is a regulation from the International Maritime Organization that limits sulfur content in marine fuel to 0.5%, down from 3.5%. This has significantly reduced sulfur oxide emissions from ships but has also increased operational costs and led to changes in fuel types used. The Carbon Intensity Indicator (CII) is a newer IMO regulation that measures a ship's carbon efficiency, rating vessels from A to E based on their annual CO2 emissions per cargo-carrying capacity and nautical mile. Ships rated D for three consecutive years or E once must develop corrective action plans. These regulations are part of IMO's strategy to reduce shipping emissions by 40% by 2030 and 70% by 2050 compared to 2008 levels."
  },
  {
    question: "How can I reduce my supply chain carbon footprint?",
    answer: "Reducing your supply chain carbon footprint involves multiple strategies: (1) Mode shifting - transferring cargo from air to ocean or rail can reduce emissions by 80-95%; (2) Route optimization - direct routes and efficient logistics networks reduce total distance traveled; (3) Consolidation - combining shipments maximizes load efficiency and reduces per-unit emissions; (4) Carrier selection - working with carriers using newer, more efficient vessels and vehicles; (5) Alternative fuels - choosing carriers offering biofuels, LNG, or electric vehicles; (6) Packaging optimization - reducing packaging weight and volume; (7) Warehouse efficiency - using renewable energy and efficient lighting/HVAC in storage facilities. Many companies also invest in carbon offset programs for emissions that cannot be eliminated."
  },
  {
    question: "What are carbon offset programs for shipping?",
    answer: "Carbon offset programs allow companies to compensate for their unavoidable emissions by investing in environmental projects that reduce or remove CO2 from the atmosphere. For shipping, this typically involves purchasing carbon credits equivalent to the emissions generated by freight transport. Common offset projects include reforestation, renewable energy development, methane capture from landfills, and direct air capture technology. Major carriers like Maersk, MSC, and DHL offer carbon-neutral shipping options where they purchase offsets on behalf of customers. However, offsets should be viewed as a complement to, not a replacement for, actual emissions reduction. Look for verified programs with certifications like Gold Standard, Verra, or the American Carbon Registry to ensure credibility."
  },
  {
    question: "How accurate are carbon footprint calculations?",
    answer: "Carbon footprint calculations in logistics are estimates with typical accuracy ranges of ±15-25%. The accuracy depends on several factors: (1) Emission factor precision - factors are industry averages that may not reflect specific vessel/vehicle efficiency; (2) Load factor assumptions - actual load rates vary by shipment; (3) Route variations - actual distances may differ from planned routes; (4) Well-to-wheel vs tank-to-wheel - some calculations include fuel production emissions, others don't; (5) Ancillary operations - port handling, warehousing, and last-mile delivery emissions are often estimated. For more accurate calculations, use carrier-specific emissions data, real-time tracking, and life-cycle assessment (LCA) methodologies. The GLEC Framework provides standardized guidelines for consistent calculations across the industry."
  }
];

export function CarbonFootprintCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [transportMode, setTransportMode] = useState<string>("ocean");
  const [transportType, setTransportType] = useState<string>("container");
  const [cargoWeight, setCargoWeight] = useState<string>("10000");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [distance, setDistance] = useState<string>("10000");
  const [distanceUnit, setDistanceUnit] = useState<string>("km");
  const [originCountry, setOriginCountry] = useState<string>("CN");
  const [destCountry, setDestCountry] = useState<string>("US");
  const [includePackaging, setIncludePackaging] = useState(true);
  const [includeHandling, setIncludeHandling] = useState(true);
  const [copied, setCopied] = useState(false);

  const calculation = useMemo<CarbonResult>(() => {
    let weightKg = parseFloat(cargoWeight) || 0;
    const weightTonnes = weightUnit === "kg" ? weightKg / 1000 : weightKg;
    
    let distanceKm = parseFloat(distance) || 0;
    if (distanceUnit === "miles") {
      distanceKm *= 1.60934;
    } else if (distanceUnit === "nm") {
      distanceKm *= 1.852;
    }

    let emissionFactor = 0;
    if (transportMode === "ocean") {
      emissionFactor = emissionFactors.ocean[transportType as keyof typeof emissionFactors.ocean] || 0.0158;
    } else if (transportMode === "air") {
      emissionFactor = emissionFactors.air[transportType as keyof typeof emissionFactors.air] || 0.502;
    } else if (transportMode === "road") {
      emissionFactor = emissionFactors.road[transportType as keyof typeof emissionFactors.road] || 0.096;
    } else if (transportMode === "rail") {
      emissionFactor = emissionFactors.rail[transportType as keyof typeof emissionFactors.rail] || 0.023;
    }

    const transportEmissions = weightTonnes * distanceKm * emissionFactor;
    const handlingEmissions = includeHandling ? weightTonnes * 2.5 : 0;
    const packagingEmissions = includePackaging ? weightTonnes * 0.8 : 0;

    const totalEmissions = transportEmissions + handlingEmissions + packagingEmissions;
    const treeOffset = totalEmissions / 21;
    const carEquivalent = totalEmissions / 0.12;
    const flightEquivalent = totalEmissions / 1600;

    return {
      totalEmissions,
      emissionsPerKg: totalEmissions / weightKg,
      emissionsPerKm: totalEmissions / distanceKm,
      treeOffset,
      carEquivalent,
      flightEquivalent,
      breakdown: {
        transport: transportEmissions,
        handling: handlingEmissions,
        packaging: packagingEmissions,
      },
    };
  }, [transportMode, transportType, cargoWeight, weightUnit, distance, distanceUnit, includePackaging, includeHandling]);

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(decimals)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(decimals)}K`;
    }
    return num.toFixed(decimals);
  };

  const getTransportTypes = () => {
    if (transportMode === "ocean") {
      return [
        { value: "container", label: "Container Ship" },
        { value: "bulk", label: "Bulk Carrier" },
        { value: "tanker", label: "Tanker" },
        { value: "roro", label: "Ro-Ro Vessel" },
      ];
    } else if (transportMode === "air") {
      return [
        { value: "freighter", label: "Dedicated Freighter" },
        { value: "belly", label: "Belly Hold (Passenger)" },
        { value: "express", label: "Express/International" },
      ];
    } else if (transportMode === "road") {
      return [
        { value: "truckArticulated", label: "Articulated Truck (>16t)" },
        { value: "truckHeavy", label: "Heavy Truck (7.5-16t)" },
        { value: "truckMedium", label: "Medium Truck (3.5-7.5t)" },
        { value: "truckLight", label: "Light Truck (<3.5t)" },
      ];
    } else {
      return [
        { value: "electric", label: "Electric Train" },
        { value: "mixed", label: "Mixed Network" },
        { value: "diesel", label: "Diesel Train" },
      ];
    }
  };

  const selectedMode = transportModes.find((m) => m.id === transportMode);

  // Chart data for mode comparison
  const modeComparisonData = useMemo(() => {
    const weightTonnes = (weightUnit === "kg" ? parseFloat(cargoWeight) / 1000 : parseFloat(cargoWeight)) || 10;
    const distanceKm = parseFloat(distance) || 10000;
    
    return standardEmissionFactors.map(item => ({
      mode: item.mode,
      emissions: weightTonnes * distanceKm * item.factor,
      factor: item.factor,
      color: item.color,
    }));
  }, [cargoWeight, weightUnit, distance]);

  // Pie chart data for breakdown
  const breakdownData = useMemo(() => {
    const data = [
      { name: "Transport", value: calculation.breakdown.transport, color: "#0F4C81" },
    ];
    if (includeHandling) {
      data.push({ name: "Handling", value: calculation.breakdown.handling, color: "#2E8B57" });
    }
    if (includePackaging) {
      data.push({ name: "Packaging", value: calculation.breakdown.packaging, color: "#f59e0b" });
    }
    return data;
  }, [calculation, includeHandling, includePackaging]);

  // Distance vs emissions line chart data
  const distanceEmissionsData = useMemo(() => {
    const weightTonnes = (weightUnit === "kg" ? parseFloat(cargoWeight) / 1000 : parseFloat(cargoWeight)) || 10;
    const currentDistance = parseFloat(distance) || 10000;
    let emissionFactor = 0.015;
    
    if (transportMode === "ocean") {
      emissionFactor = emissionFactors.ocean[transportType as keyof typeof emissionFactors.ocean] || 0.0158;
    } else if (transportMode === "air") {
      emissionFactor = emissionFactors.air[transportType as keyof typeof emissionFactors.air] || 0.502;
    } else if (transportMode === "road") {
      emissionFactor = emissionFactors.road[transportType as keyof typeof emissionFactors.road] || 0.096;
    } else if (transportMode === "rail") {
      emissionFactor = emissionFactors.rail[transportType as keyof typeof emissionFactors.rail] || 0.023;
    }

    const distances = [0, 2500, 5000, 7500, 10000, 12500, 15000, 17500, 20000];
    return distances.map(d => ({
      distance: d,
      emissions: weightTonnes * d * emissionFactor,
      isCurrent: d === currentDistance,
    }));
  }, [cargoWeight, weightUnit, transportMode, transportType, distance]);

  const handleExport = () => {
    const data = {
      calculation: {
        totalEmissions: calculation.totalEmissions.toFixed(2) + " kg CO2e",
        emissionsPerKg: calculation.emissionsPerKg.toFixed(4) + " kg CO2e/kg",
        emissionsPerKm: calculation.emissionsPerKm.toFixed(4) + " kg CO2e/km",
        treeOffset: calculation.treeOffset.toFixed(0) + " trees/year",
        breakdown: {
          transport: calculation.breakdown.transport.toFixed(2) + " kg",
          handling: calculation.breakdown.handling.toFixed(2) + " kg",
          packaging: calculation.breakdown.packaging.toFixed(2) + " kg",
        }
      },
      inputs: {
        transportMode,
        transportType,
        cargoWeight: cargoWeight + " " + weightUnit,
        distance: distance + " " + distanceUnit,
        route: originCountry + " → " + destCountry,
      },
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "carbon-footprint-report.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `Carbon Footprint Calculation Results:
📦 Total Emissions: ${formatNumber(calculation.totalEmissions)} kg CO2e
🌍 Per kg cargo: ${formatNumber(calculation.emissionsPerKg * 1000, 3)} g CO2e
📏 Per km: ${formatNumber(calculation.emissionsPerKm, 4)} kg CO2e
🌳 Trees needed: ${formatNumber(calculation.treeOffset, 0)} trees/year

Calculated using Shiportrade.com Carbon Footprint Calculator`;

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge 
            variant="secondary" 
            className="mb-4 px-4 py-2 text-sm bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 border-[#2E8B57]/30"
          >
            <Leaf className="h-4 w-4 mr-2 text-[#2E8B57]" />
            Sustainability Tool
            <motion.span
              className="ml-2 inline-block"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🌱
            </motion.span>
          </Badge>
        </motion.div>
        
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Carbon Footprint Calculator
        </motion.h2>
        
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Measure and analyze the environmental impact of your freight shipments across all transport modes
        </motion.p>

        {/* Key Metrics Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-[#0F4C81] bg-gradient-to-br from-[#0F4C81]/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CO2 Emissions</p>
                  <p className="text-2xl font-bold text-[#0F4C81]">{formatNumber(calculation.totalEmissions)} kg</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-[#0F4C81]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-[#2E8B57] bg-gradient-to-br from-[#2E8B57]/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="text-2xl font-bold text-[#2E8B57]">{formatNumber(parseFloat(distance) || 0)} {distanceUnit}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#2E8B57]/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-[#2E8B57]" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 bg-gradient-to-br from-amber-500/5 to-transparent">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Mode</p>
                  <p className="text-2xl font-bold text-amber-600">Ocean</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Ship className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
            <Calculator className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
            <LineChart className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Methodology</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
            <Lightbulb className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Reduction Tips</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs sm:text-sm">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Transport Mode Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#2E8B57]" />
                    Transport Mode
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {transportModes.map((mode) => {
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
                              ? "border-[#2E8B57] bg-[#2E8B57]/5"
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
                            {type.label}
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
                    <Package className="h-5 w-5 text-[#0F4C81]" />
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
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="10000"
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Origin Country</Label>
                      <Select value={originCountry} onValueChange={setOriginCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CN">China</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="EU">European Union</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="IN">India</SelectItem>
                          <SelectItem value="BR">Brazil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination</Label>
                      <Select value={destCountry} onValueChange={setDestCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CN">China</SelectItem>
                          <SelectItem value="EU">European Union</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="JP">Japan</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                          <SelectItem value="IN">India</SelectItem>
                          <SelectItem value="BR">Brazil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Emissions</CardTitle>
                  <CardDescription>Include emissions from handling and packaging</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Include Handling</Label>
                      <p className="text-xs text-muted-foreground">
                        Loading/unloading at ports and terminals
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={includeHandling}
                      onChange={(e) => setIncludeHandling(e.target.checked)}
                      className="h-4 w-4 accent-[#2E8B57]"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Include Packaging</Label>
                      <p className="text-xs text-muted-foreground">
                        Packaging materials and processes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={includePackaging}
                      onChange={(e) => setIncludePackaging(e.target.checked)}
                      className="h-4 w-4 accent-[#2E8B57]"
                    />
                  </div>
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
                    Carbon Footprint Result
                  </CardTitle>
                  <CardDescription>
                    Total CO₂ equivalent emissions for this shipment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <motion.div
                      key={calculation.totalEmissions}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-bold text-green-600 dark:text-green-400"
                    >
                      {formatNumber(calculation.totalEmissions)}
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">kg CO₂e</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-lg font-semibold">
                        {formatNumber(calculation.emissionsPerKg * 1000, 3)}
                      </div>
                      <div className="text-xs text-muted-foreground">g CO₂e per kg cargo</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <div className="text-lg font-semibold">
                        {formatNumber(calculation.emissionsPerKm, 4)}
                      </div>
                      <div className="text-xs text-muted-foreground">kg CO₂e per km</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emissions Breakdown Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[#0F4C81]" />
                    Emissions Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={breakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {breakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value.toFixed(2)} kg`, "Emissions"]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Equivalents */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">What Does This Mean?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <TreePine className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{formatNumber(calculation.treeOffset, 0)} trees</div>
                        <div className="text-xs text-muted-foreground">needed to offset (per year)</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{formatNumber(calculation.carEquivalent, 0)} km</div>
                        <div className="text-xs text-muted-foreground">driven by average car</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Plane className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold">{formatNumber(calculation.flightEquivalent, 1)} flights</div>
                        <div className="text-xs text-muted-foreground">NYC to London (one-way)</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export/Share Buttons */}
              <div className="flex gap-4">
                <Button onClick={handleExport} variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  {copied ? "Copied!" : "Share Results"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Mode Comparison */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Emissions by Mode Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                  Emissions by Transport Mode
                </CardTitle>
                <CardDescription>
                  Comparing CO2 emissions across different transport modes for your shipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modeComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => formatNumber(value)} />
                      <YAxis dataKey="mode" type="category" width={60} />
                      <Tooltip 
                        formatter={(value: number) => [`${formatNumber(value)} kg CO2e`, "Emissions"]}
                      />
                      <Bar dataKey="emissions" radius={[0, 4, 4, 0]}>
                        {modeComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distance vs Emissions Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[#2E8B57]" />
                  Distance vs Emissions Relationship
                </CardTitle>
                <CardDescription>
                  How emissions scale with distance for the selected transport mode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={distanceEmissionsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="distance" 
                        tickFormatter={(value) => `${value/1000}k`}
                        label={{ value: "Distance (km)", position: "bottom", offset: -5 }}
                      />
                      <YAxis tickFormatter={(value) => formatNumber(value)} />
                      <Tooltip 
                        formatter={(value: number) => [`${formatNumber(value)} kg CO2e`, "Emissions"]}
                        labelFormatter={(label) => `Distance: ${formatNumber(label)} km`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="emissions" 
                        stroke="#0F4C81" 
                        fill="#0F4C8120"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emission Factors Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0F4C81]" />
                Transport Mode Emission Factors Reference
              </CardTitle>
              <CardDescription>
                Standard CO2 emission factors used in logistics calculations (kg CO2e per tonne-km)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Mode</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 font-semibold">Factor (kg CO2e/t-km)</th>
                      <th className="text-left py-3 px-4 font-semibold">Relative to Ocean</th>
                      <th className="text-left py-3 px-4 font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-[#0F4C81]/5">
                      <td className="py-3 px-4" rowSpan={4}>
                        <div className="flex items-center gap-2">
                          <Ship className="h-4 w-4 text-[#0F4C81]" />
                          <span className="font-medium">Ocean</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">Container Ship</td>
                      <td className="py-3 px-4 font-mono">0.0158</td>
                      <td className="py-3 px-4"><Badge variant="secondary">1.0x (Baseline)</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Long-distance, high volume</td>
                    </tr>
                    <tr className="border-b bg-[#0F4C81]/5">
                      <td className="py-3 px-4">Bulk Carrier</td>
                      <td className="py-3 px-4 font-mono">0.0089</td>
                      <td className="py-3 px-4"><Badge className="bg-green-100 text-green-700">0.6x (Best)</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Bulk commodities</td>
                    </tr>
                    <tr className="border-b bg-[#0F4C81]/5">
                      <td className="py-3 px-4">Tanker</td>
                      <td className="py-3 px-4 font-mono">0.0123</td>
                      <td className="py-3 px-4"><Badge variant="secondary">0.8x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Liquid cargo</td>
                    </tr>
                    <tr className="border-b bg-[#0F4C81]/5">
                      <td className="py-3 px-4">Ro-Ro Vessel</td>
                      <td className="py-3 px-4 font-mono">0.0189</td>
                      <td className="py-3 px-4"><Badge variant="secondary">1.2x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Vehicles, wheeled cargo</td>
                    </tr>
                    
                    <tr className="border-b bg-purple-50 dark:bg-purple-950/20">
                      <td className="py-3 px-4" rowSpan={3}>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4 text-purple-600" />
                          <span className="font-medium">Air</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">Dedicated Freighter</td>
                      <td className="py-3 px-4 font-mono">0.502</td>
                      <td className="py-3 px-4"><Badge className="bg-red-100 text-red-700">31.8x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Time-critical cargo</td>
                    </tr>
                    <tr className="border-b bg-purple-50 dark:bg-purple-950/20">
                      <td className="py-3 px-4">Belly Hold</td>
                      <td className="py-3 px-4 font-mono">0.602</td>
                      <td className="py-3 px-4"><Badge className="bg-red-100 text-red-700">38.1x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Smaller shipments</td>
                    </tr>
                    <tr className="border-b bg-purple-50 dark:bg-purple-950/20">
                      <td className="py-3 px-4">Express</td>
                      <td className="py-3 px-4 font-mono">0.704</td>
                      <td className="py-3 px-4"><Badge className="bg-red-100 text-red-700">44.6x (Highest)</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Express parcels</td>
                    </tr>
                    
                    <tr className="border-b bg-[#2E8B57]/5">
                      <td className="py-3 px-4" rowSpan={4}>
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-[#2E8B57]" />
                          <span className="font-medium">Road</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">Articulated Truck</td>
                      <td className="py-3 px-4 font-mono">0.062</td>
                      <td className="py-3 px-4"><Badge variant="secondary">3.9x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Full truckloads</td>
                    </tr>
                    <tr className="border-b bg-[#2E8B57]/5">
                      <td className="py-3 px-4">Heavy Truck</td>
                      <td className="py-3 px-4 font-mono">0.096</td>
                      <td className="py-3 px-4"><Badge variant="secondary">6.1x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Regional transport</td>
                    </tr>
                    <tr className="border-b bg-[#2E8B57]/5">
                      <td className="py-3 px-4">Medium Truck</td>
                      <td className="py-3 px-4 font-mono">0.135</td>
                      <td className="py-3 px-4"><Badge variant="secondary">8.5x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">LTL shipments</td>
                    </tr>
                    <tr className="border-b bg-[#2E8B57]/5">
                      <td className="py-3 px-4">Light Truck</td>
                      <td className="py-3 px-4 font-mono">0.209</td>
                      <td className="py-3 px-4"><Badge variant="secondary">13.2x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Last-mile delivery</td>
                    </tr>
                    
                    <tr className="border-b bg-amber-50 dark:bg-amber-950/20">
                      <td className="py-3 px-4" rowSpan={3}>
                        <div className="flex items-center gap-2">
                          <Train className="h-4 w-4 text-amber-600" />
                          <span className="font-medium">Rail</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">Electric Train</td>
                      <td className="py-3 px-4 font-mono">0.018</td>
                      <td className="py-3 px-4"><Badge className="bg-green-100 text-green-700">1.1x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Electrified routes</td>
                    </tr>
                    <tr className="border-b bg-amber-50 dark:bg-amber-950/20">
                      <td className="py-3 px-4">Mixed Network</td>
                      <td className="py-3 px-4 font-mono">0.023</td>
                      <td className="py-3 px-4"><Badge variant="secondary">1.5x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Cross-country routes</td>
                    </tr>
                    <tr className="border-b bg-amber-50 dark:bg-amber-950/20">
                      <td className="py-3 px-4">Diesel Train</td>
                      <td className="py-3 px-4 font-mono">0.028</td>
                      <td className="py-3 px-4"><Badge variant="secondary">1.8x</Badge></td>
                      <td className="py-3 px-4 text-muted-foreground">Non-electrified routes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Methodology */}
        <TabsContent value="methodology" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0F4C81]" />
                What is Carbon Footprint in Logistics?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                A carbon footprint in logistics represents the total greenhouse gas emissions generated by the transportation and handling of goods throughout the supply chain. This includes direct emissions from fuel combustion in vehicles, vessels, aircraft, and trains, as well as indirect emissions from electricity consumption at warehouses, ports, and distribution centers. The logistics sector is responsible for approximately 8-10% of global CO2 emissions, making it a critical focus area for sustainability initiatives and regulatory compliance.
              </p>
              <p className="text-muted-foreground mt-4">
                Understanding and measuring your logistics carbon footprint is essential for several reasons: regulatory compliance with increasingly stringent environmental regulations, corporate sustainability commitments and ESG reporting requirements, cost reduction through fuel efficiency improvements, customer expectations for sustainable supply chains, and competitive advantage in an environmentally conscious market. Carbon footprint calculations enable businesses to identify emission hotspots, prioritize reduction strategies, and track progress toward sustainability goals.
              </p>
              <p className="text-muted-foreground mt-4">
                The carbon footprint concept extends beyond just CO2 to include other greenhouse gases like methane (CH4) and nitrous oxide (N2O), converted to CO2 equivalent (CO2e) using global warming potential factors. This comprehensive approach ensures that all climate-relevant emissions are captured in a single metric, facilitating easier comparison and reporting across different transport modes and supply chain activities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#2E8B57]" />
                CO2 Calculation Formula
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg border">
                <p className="text-center text-xl font-mono font-bold">
                  Emissions = Distance (km) × Weight (tonnes) × Emission Factor (kg CO2e/tonne-km)
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-5 w-5 text-[#0F4C81]" />
                    <span className="font-semibold">Distance</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The total distance traveled by the cargo in kilometers. This can be the great circle distance between ports or the actual road/rail distance for land transport.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="h-5 w-5 text-[#2E8B57]" />
                    <span className="font-semibold">Weight</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The weight of cargo transported in metric tonnes. This represents the actual mass of goods being moved, not including packaging or container weight.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">Emission Factor</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The amount of CO2 emitted per tonne-kilometer, varying by transport mode, vehicle efficiency, fuel type, and load factor.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Info className="h-4 w-4" />
                  Well-to-Wheel vs Tank-to-Wheel
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Our calculations use well-to-wheel (WTW) emission factors, which include both fuel production (extraction, refining, transport) and combustion emissions. This provides a more complete picture of the total carbon impact compared to tank-to-wheel (TTW) factors that only account for combustion.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[#0F4C81]" />
                IMO 2020 and CII Regulations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-[#0F4C81]" />
                    IMO 2020
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The IMO 2020 regulation limits sulfur content in marine fuel to 0.5%, down from 3.5%. This landmark regulation has reduced sulfur oxide (SOx) emissions from ships by approximately 77%, equivalent to 8.5 million tonnes of SOx annually. The regulation has significant implications for shipping costs, fuel availability, and vessel operations.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ship operators have responded by switching to very low sulfur fuel oil (VLSFO), installing exhaust gas cleaning systems (scrubbers), or using alternative fuels like LNG. While IMO 2020 addresses air quality concerns, the IMO has also set ambitious targets for greenhouse gas reduction: 40% reduction by 2030 and 70% by 2050 compared to 2008 levels.
                  </p>
                </div>
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                    Carbon Intensity Indicator (CII)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The CII is a mandatory measure for ships of 5,000 GT and above, rating vessel efficiency on a scale from A (best) to E (worst) based on annual CO2 emissions per cargo-carrying capacity and nautical mile. The rating thresholds become progressively stricter each year to drive continuous improvement.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ships rated D for three consecutive years or E for a single year must develop a corrective action plan as part of their Ship Energy Efficiency Management Plan (SEEMP). This creates both regulatory pressure and market incentives for shipowners to improve efficiency through technical measures (hull optimization, propeller upgrades) and operational measures (speed optimization, weather routing).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-[#2E8B57]" />
                Carbon Offset Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Carbon offset programs enable organizations to compensate for unavoidable emissions by funding projects that reduce or remove greenhouse gases elsewhere. For logistics companies, carbon offsets can be an important component of a comprehensive sustainability strategy, particularly for emissions that cannot be eliminated through operational improvements.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Verified Carbon Standards</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2E8B57]" /> Gold Standard</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2E8B57]" /> Verra VCS</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2E8B57]" /> American Carbon Registry</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2E8B57]" /> Climate Action Reserve</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Common Offset Project Types</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-center gap-2"><TreePine className="h-4 w-4 text-green-600" /> Reforestation & Afforestation</li>
                    <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> Renewable Energy</li>
                    <li className="flex items-center gap-2"><Recycle className="h-4 w-4 text-blue-600" /> Methane Capture</li>
                    <li className="flex items-center gap-2"><Target className="h-4 w-4 text-purple-600" /> Direct Air Capture</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Reduction Tips */}
        <TabsContent value="tips" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-[#0F4C81]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Ship className="h-5 w-5 text-[#0F4C81]" />
                  Mode Shifting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  One of the most effective ways to reduce carbon emissions is to shift freight from high-emission modes to lower-emission alternatives. Ocean and rail transport produce 10-50 times less CO2 per tonne-kilometer than air freight, making mode shifting a powerful lever for emissions reduction without requiring significant infrastructure investment.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                    <span>Air to ocean freight can reduce emissions by 80-95%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                    <span>Road to rail for long-distance freight reduces emissions by 60-70%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                    <span>Consider intermodal solutions combining rail and road</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#2E8B57]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-[#2E8B57]" />
                  Consolidation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Freight consolidation maximizes vehicle utilization and reduces the number of partially-loaded trips. By combining shipments and optimizing load factors, you can significantly reduce per-unit emissions while also achieving cost savings through better space utilization and reduced transportation frequency.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span>Combine LTL shipments into FTL for better efficiency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span>Use cross-docking to optimize route consolidation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                    <span>Partner with other shippers for shared transport</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 text-amber-600" />
                  Route Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Advanced route planning and optimization can reduce total distance traveled, avoid congestion, and minimize fuel consumption. Modern logistics software uses algorithms to find the most efficient routes considering traffic, weather, delivery windows, and vehicle capacity constraints.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>Use GPS and traffic data for real-time route adjustments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>Plan direct routes whenever possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <span>Optimize delivery sequences to minimize backtracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Fuel className="h-5 w-5 text-purple-600" />
                  Alternative Fuels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Transitioning to alternative fuels and energy sources is essential for long-term decarbonization. Many carriers now offer low-carbon fuel options, and the industry is investing heavily in developing and scaling sustainable fuel technologies for all transport modes.
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                    <span>Choose carriers offering biofuel or LNG-powered vessels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                    <span>Partner with carriers using electric or hybrid vehicles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                    <span>Consider sustainable aviation fuel (SAF) for air freight</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[#0F4C81]" />
                Additional Reduction Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-[#2E8B57]" />
                    Speed Optimization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Slow steaming reduces fuel consumption by up to 30% for ocean vessels. Optimized truck speeds (55-65 mph) improve fuel efficiency significantly.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#0F4C81]" />
                    Packaging Optimization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Lighter, more compact packaging reduces weight and volume, improving load factors and reducing the number of shipments needed.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    Warehouse Efficiency
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Use renewable energy, LED lighting, and efficient HVAC systems in warehouses. Optimize inventory locations to minimize internal movements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-4 mt-6">
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-[#0F4C81]" />
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
