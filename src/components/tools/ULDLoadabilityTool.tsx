"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Package,
  Plane,
  Weight,
  Ruler,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  Box,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Settings,
  BarChart3,
  FileText,
  Zap,
  Shield,
  Clock,
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
  Legend,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// ULD specifications
const ULD_TYPES: Record<string, {
  name: string;
  type: string;
  length: number;
  width: number;
  height: number;
  maxWeight: number;
  tareWeight: number;
  volume: number;
  compatibleAircraft: string[];
  contour: string;
  description: string;
}> = {
  AKE: {
    name: "AKE (LD3)",
    type: "Container",
    length: 1.53,
    width: 2.0,
    height: 1.62,
    maxWeight: 1588,
    tareWeight: 120,
    volume: 4.3,
    compatibleAircraft: ["B747", "B767", "B777", "A300", "A310", "A330", "A340", "A350"],
    contour: "Lower Deck",
    description: "The most common lower deck container, designed to fit the curved contour of wide-body aircraft lower cargo holds. Ideal for general cargo and baggage.",
  },
  ALF: {
    name: "ALF (LD6)",
    type: "Container",
    length: 3.18,
    width: 2.24,
    height: 1.62,
    maxWeight: 3175,
    tareWeight: 200,
    volume: 8.9,
    compatibleAircraft: ["B747", "B767", "B777", "A300", "A310", "A330", "A340", "A350"],
    contour: "Lower Deck",
    description: "A double-width container equivalent to two LD3 positions. Offers greater volume efficiency for larger shipments while maintaining lower deck compatibility.",
  },
  AAP: {
    name: "AAP (LD9)",
    type: "Container",
    length: 3.18,
    width: 2.24,
    height: 1.62,
    maxWeight: 4627,
    tareWeight: 280,
    volume: 10.7,
    compatibleAircraft: ["B747", "B767", "B777", "A300", "A310", "A330", "A340", "A350"],
    contour: "Lower Deck",
    description: "Higher capacity version of the LD6 with reinforced structure for heavier cargo. Commonly used for dense shipments requiring maximum weight utilization.",
  },
  AMA: {
    name: "AMA (LD11)",
    type: "Container",
    length: 3.18,
    width: 2.24,
    height: 2.44,
    maxWeight: 6804,
    tareWeight: 340,
    volume: 17.5,
    compatibleAircraft: ["B747F", "B777F"],
    contour: "Main Deck",
    description: "Full-height main deck container for freighter aircraft. Maximum volume capacity for lightweight, voluminous cargo. Only compatible with freighter-configured aircraft.",
  },
  AMJ: {
    name: "AMJ (LD29)",
    type: "Container",
    length: 3.18,
    width: 2.24,
    height: 2.44,
    maxWeight: 6804,
    tareWeight: 450,
    volume: 17.5,
    compatibleAircraft: ["B747F", "B777F"],
    contour: "Main Deck",
    description: "Structural version of the AMA with reinforced walls for heavy or outsized cargo. Features stronger construction for specialized freight requirements.",
  },
  PMC: {
    name: "PMC (P6P)",
    type: "Pallet",
    length: 3.18,
    width: 2.24,
    height: 2.44,
    maxWeight: 6804,
    tareWeight: 120,
    volume: 17.5,
    compatibleAircraft: ["B747F", "B777F", "MD11F"],
    contour: "Main Deck",
    description: "Standard 96x125 inch pallet with net restraint system. Versatile for various cargo types and shapes. Most economical option for freighter shipments.",
  },
  PAG: {
    name: "PAG (P7P)",
    type: "Pallet",
    length: 3.18,
    width: 2.24,
    height: 1.62,
    maxWeight: 4627,
    tareWeight: 100,
    volume: 10.7,
    compatibleAircraft: ["B747", "B767", "B777", "A300", "A310", "A330"],
    contour: "Lower Deck",
    description: "Lower deck pallet optimized for wide-body aircraft belly holds. Accepts both containerized and loose cargo with net restraint systems.",
  },
  PLA: {
    name: "PLA (P1P)",
    type: "Pallet",
    length: 3.18,
    width: 2.24,
    height: 1.62,
    maxWeight: 3175,
    tareWeight: 85,
    volume: 8.9,
    compatibleAircraft: ["B747", "B767", "B777", "A300", "A310"],
    contour: "Lower Deck",
    description: "Lightweight lower deck pallet for general cargo. Lower tare weight provides more payload capacity for medium-density shipments.",
  },
  RKN: {
    name: "RKN (LD3 Reefer)",
    type: "Reefer Container",
    length: 1.53,
    width: 2.0,
    height: 1.62,
    maxWeight: 1588,
    tareWeight: 250,
    volume: 3.8,
    compatibleAircraft: ["B747", "B767", "B777", "A300", "A310", "A330"],
    contour: "Lower Deck",
    description: "Insulated refrigerated container for temperature-sensitive cargo. Maintains precise temperature control for perishables, pharmaceuticals, and fresh produce.",
  },
  RAP: {
    name: "RAP (LD9 Reefer)",
    type: "Reefer Container",
    length: 3.18,
    width: 2.24,
    height: 1.62,
    maxWeight: 4627,
    tareWeight: 450,
    volume: 9.2,
    compatibleAircraft: ["B747", "B767", "B777", "A300", "A310", "A330"],
    contour: "Lower Deck",
    description: "Large refrigerated container for high-volume cold chain shipments. Double-width capacity ideal for substantial perishable cargo consignments.",
  },
};

// Aircraft cargo hold configurations
const AIRCRAFT_TYPES: Record<string, {
  name: string;
  mainDeck: { pallets: number; maxWeight: number };
  lowerDeck: { containers: number; maxWeight: number };
  totalCapacity: number;
  compatibleULDs: string[];
}> = {
  B747F: {
    name: "Boeing 747-400F",
    mainDeck: { pallets: 30, maxWeight: 112000 },
    lowerDeck: { containers: 14, maxWeight: 40000 },
    totalCapacity: 152000,
    compatibleULDs: ["AKE", "ALF", "AAP", "AMA", "AMJ", "PMC", "PAG", "PLA", "RKN", "RAP"],
  },
  B747BCF: {
    name: "Boeing 747-400BCF",
    mainDeck: { pallets: 29, maxWeight: 109000 },
    lowerDeck: { containers: 14, maxWeight: 40000 },
    totalCapacity: 149000,
    compatibleULDs: ["AKE", "ALF", "AAP", "AMA", "AMJ", "PMC", "PAG", "PLA", "RKN", "RAP"],
  },
  B777F: {
    name: "Boeing 777F",
    mainDeck: { pallets: 27, maxWeight: 103000 },
    lowerDeck: { containers: 10, maxWeight: 30000 },
    totalCapacity: 133000,
    compatibleULDs: ["AKE", "ALF", "AAP", "AMA", "AMJ", "PMC", "PAG", "PLA", "RKN", "RAP"],
  },
  MD11F: {
    name: "McDonnell Douglas MD-11F",
    mainDeck: { pallets: 26, maxWeight: 86000 },
    lowerDeck: { containers: 8, maxWeight: 26000 },
    totalCapacity: 112000,
    compatibleULDs: ["AKE", "ALF", "AAP", "PMC", "PAG", "PLA", "RKN", "RAP"],
  },
  A330F: {
    name: "Airbus A330-200F",
    mainDeck: { pallets: 23, maxWeight: 65000 },
    lowerDeck: { containers: 6, maxWeight: 20000 },
    totalCapacity: 85000,
    compatibleULDs: ["AKE", "ALF", "AAP", "PMC", "PAG", "PLA", "RKN", "RAP"],
  },
  B767F: {
    name: "Boeing 767-300F",
    mainDeck: { pallets: 24, maxWeight: 55000 },
    lowerDeck: { containers: 4, maxWeight: 15000 },
    totalCapacity: 70000,
    compatibleULDs: ["AKE", "ALF", "AAP", "PMC", "PAG", "PLA", "RKN", "RAP"],
  },
};

interface CargoItem {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  stackable: boolean;
}

interface ULDResult {
  totalVolume: number;
  totalWeight: number;
  volumeUtilization: number;
  weightUtilization: number;
  itemsFit: number;
  remainingVolume: number;
  remainingWeight: number;
  fitsDimensions: boolean;
  fitsWeight: boolean;
  recommendation: string;
  warningLevel: "safe" | "caution" | "danger";
}

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is a Unit Load Device (ULD) and why is it important in air cargo?",
    answer: "A Unit Load Device (ULD) is a standardized container or pallet used in air cargo operations to consolidate multiple pieces of cargo into a single unit for efficient loading and unloading. ULDs are essential in modern air freight because they enable faster turnaround times, protect cargo during transit, maximize aircraft space utilization, and reduce handling damage. The standardization of ULDs across the aviation industry allows for seamless interlining between different airlines and aircraft types, making global supply chains more efficient.",
  },
  {
    question: "How do I choose between a container and a pallet for my shipment?",
    answer: "The choice between containers and pallets depends on several factors including cargo type, protection requirements, and cost considerations. Containers offer better protection from weather, handling damage, and theft - ideal for high-value goods, fragile items, or cargo requiring temperature control. Pallets are more economical, offer greater flexibility for irregular-shaped cargo, and have lower tare weight, providing more payload capacity. For general cargo on freighter aircraft, pallets often provide the best value, while containers are preferred for passenger aircraft belly holds and sensitive shipments.",
  },
  {
    question: "What is the ULD code system and how do I read it?",
    answer: "The ULD code system uses three-letter designations following IATA standards to identify container and pallet types. The first letter indicates the category: 'A' for certified containers, 'P' for pallets, 'R' for refrigerated units, and 'M' for non-certified containers. The second and third letters specify the size and contour. For example, 'AKE' (commonly called LD3) is an A-category container for lower deck use, while 'PMC' is a pallet for main deck freighters. Parenthetical names like LD3, LD6, and LD9 are common industry terms that refer to specific ULD configurations.",
  },
  {
    question: "What are the weight and balance considerations for air cargo loading?",
    answer: "Weight and balance are critical safety factors in air cargo operations. Each ULD has a maximum structural weight limit that must not be exceeded. Beyond individual ULD limits, aircraft have specific weight distribution requirements: the center of gravity must fall within certified limits, and floor loading (weight per square meter) must not exceed aircraft structural limits. Heavy cargo should be distributed across multiple ULDs when possible, and loaded in positions that maintain aircraft trim. Airlines use load sheets to calculate and verify that weight and balance remain within safe operating limits before departure.",
  },
  {
    question: "Can I use any ULD type on any aircraft?",
    answer: "No, ULD compatibility is determined by aircraft cargo hold dimensions and loading systems. Wide-body aircraft like the Boeing 747, 777, and Airbus A330 have different lower deck contours and door sizes that affect which ULDs can be loaded. Main deck containers (AMA, AMJ) can only be used on freighter aircraft with large main deck cargo doors. Lower deck containers (AKE, ALF, AAP) are designed for the curved belly holds of wide-body aircraft and cannot be used on narrow-body planes. Always verify aircraft compatibility when planning shipments, as attempting to load incompatible ULDs can cause significant delays and operational issues.",
  },
  {
    question: "How is volumetric weight calculated for air cargo, and why does it matter?",
    answer: "Volumetric weight is calculated by multiplying a shipment's dimensions (L × W × H) and dividing by a dimensional factor, typically 6000 for air cargo (or 5000 for some carriers). The resulting value represents the cargo's weight if it were packed to standard density. Airlines charge based on whichever is higher: actual weight or volumetric weight. This pricing reflects the fact that aircraft have both weight and volume constraints. Light but bulky cargo consumes valuable volume capacity while contributing less to revenue on a per-kilogram basis. Understanding volumetric weight helps shippers optimize packaging to minimize shipping costs.",
  },
  {
    question: "What are the best practices for air cargo loading to prevent damage?",
    answer: "Effective air cargo loading requires attention to several key practices. First, ensure cargo is properly blocked and braced within the ULD to prevent movement during flight maneuvers, turbulence, and ground handling. Use appropriate restraint nets for palletized cargo, ensuring nets are correctly attached and tensioned. Distribute weight evenly across the ULD floor, avoiding point loads that could exceed floor bearing limits. Protect fragile items with adequate cushioning and consider double-stacking only when approved and structurally sound. Temperature-sensitive goods should be loaded in refrigerated ULDs with continuous temperature monitoring. Finally, proper documentation including special handling labels and shipper declarations helps ensure cargo receives appropriate care throughout the supply chain.",
  },
];

export function ULDLoadabilityTool() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [uldType, setUldType] = useState<string>("AKE");
  const [aircraftType, setAircraftType] = useState<string>("B747F");
  const [dimensionUnit, setDimensionUnit] = useState<"m" | "cm" | "in">("m");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">("kg");
  
  // Cargo items
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([
    { id: "1", name: "Box A", length: 0.6, width: 0.4, height: 0.4, weight: 30, quantity: 20, stackable: true },
  ]);

  const uld = ULD_TYPES[uldType];

  // Calculate loadability
  const result = useMemo((): ULDResult => {
    let totalVolume = 0;
    let totalWeight = 0;
    let itemsFit = 0;

    cargoItems.forEach((item) => {
      const itemVolume = item.length * item.width * item.height * item.quantity;
      const itemWeight = item.weight * item.quantity;
      totalVolume += itemVolume;
      totalWeight += itemWeight;
      itemsFit += item.quantity;
    });

    const volumeUtilization = (totalVolume / uld.volume) * 100;
    const weightUtilization = (totalWeight / uld.maxWeight) * 100;
    const remainingVolume = uld.volume - totalVolume;
    const remainingWeight = uld.maxWeight - totalWeight;

    // Check dimension fit
    let fitsDimensions = true;
    cargoItems.forEach((item) => {
      if (item.length > uld.length || item.width > uld.width || item.height > uld.height) {
        fitsDimensions = false;
      }
    });

    const fitsWeight = totalWeight <= uld.maxWeight;

    // Determine recommendation
    let recommendation = "";
    let warningLevel: "safe" | "caution" | "danger" = "safe";

    if (!fitsWeight) {
      recommendation = "OVERWEIGHT: Reduce cargo or use different ULD";
      warningLevel = "danger";
    } else if (!fitsDimensions) {
      recommendation = "OVERSIZED: Some items exceed ULD dimensions";
      warningLevel = "danger";
    } else if (volumeUtilization > 100) {
      recommendation = "OVERVOLUME: Cargo exceeds ULD capacity";
      warningLevel = "danger";
    } else if (weightUtilization > 90 && volumeUtilization < 60) {
      recommendation = "Weight-limited: Consider higher capacity ULD";
      warningLevel = "caution";
    } else if (volumeUtilization > 85 && weightUtilization < 60) {
      recommendation = "Volume-limited: Consider denser packing";
      warningLevel = "caution";
    } else if (volumeUtilization > 75 && weightUtilization > 75) {
      recommendation = "Excellent utilization";
      warningLevel = "safe";
    } else {
      recommendation = "Good utilization with optimization potential";
      warningLevel = "safe";
    }

    return {
      totalVolume,
      totalWeight,
      volumeUtilization: Math.min(volumeUtilization, 100),
      weightUtilization: Math.min(weightUtilization, 100),
      itemsFit,
      remainingVolume,
      remainingWeight,
      fitsDimensions,
      fitsWeight,
      recommendation,
      warningLevel,
    };
  }, [cargoItems, uld]);

  // ULD comparison data
  const uldComparison = useMemo(() => {
    return Object.entries(ULD_TYPES)
      .filter(([_, data]) => data.type === uld.type || uld.type === "Pallet")
      .map(([key, data]) => ({
        code: data.name.split(" ")[0],
        name: data.name,
        volume: data.volume,
        maxWeight: data.maxWeight,
        efficiency: data.volume > 0 ? (result.totalVolume / data.volume) * 100 : 0,
        current: key === uldType,
      }))
      .sort((a, b) => b.efficiency - a.efficiency);
  }, [result.totalVolume, uld.type, uldType]);

  // Chart data for ULD type comparison
  const uldTypeChartData = useMemo(() => {
    return Object.entries(ULD_TYPES).map(([key, data]) => ({
      name: data.name.split(" ")[0],
      volume: data.volume,
      maxWeight: data.maxWeight / 1000,
      type: data.type,
    }));
  }, []);

  // Volume utilization pie chart data
  const volumePieData = useMemo(() => {
    return [
      { name: "Used Volume", value: result.totalVolume, color: "#0F4C81" },
      { name: "Available Volume", value: Math.max(0, uld.volume - result.totalVolume), color: "#E5E7EB" },
    ];
  }, [result.totalVolume, uld.volume]);

  // Weight distribution chart data
  const weightDistData = useMemo(() => {
    return [
      { name: "Cargo Weight", value: result.totalWeight, fill: "#2E8B57" },
      { name: "Available Payload", value: Math.max(0, uld.maxWeight - result.totalWeight), fill: "#E5E7EB" },
    ];
  }, [result.totalWeight, uld.maxWeight]);

  // Aircraft radar data for compatibility
  const aircraftRadarData = useMemo(() => {
    const currentAircraft = AIRCRAFT_TYPES[aircraftType];
    return [
      { subject: "Main Deck Capacity", value: (currentAircraft.mainDeck.pallets / 30) * 100, fullMark: 100 },
      { subject: "Lower Deck Capacity", value: (currentAircraft.lowerDeck.containers / 14) * 100, fullMark: 100 },
      { subject: "Total Payload", value: (currentAircraft.totalCapacity / 152000) * 100, fullMark: 100 },
      { subject: "ULD Compatibility", value: (currentAircraft.compatibleULDs.length / 10) * 100, fullMark: 100 },
    ];
  }, [aircraftType]);

  const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  const addItem = () => {
    setCargoItems([
      ...cargoItems,
      {
        id: Date.now().toString(),
        name: `Item ${cargoItems.length + 1}`,
        length: 0.5,
        width: 0.4,
        height: 0.3,
        weight: 25,
        quantity: 10,
        stackable: true,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setCargoItems(cargoItems.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof CargoItem, value: string | number | boolean) => {
    setCargoItems(
      cargoItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const resetForm = () => {
    setCargoItems([
      { id: "1", name: "Box A", length: 0.6, width: 0.4, height: 0.4, weight: 30, quantity: 20, stackable: true },
    ]);
    setUldType("AKE");
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 mb-4 px-4 py-1.5">
              <Sparkles className="h-4 w-4 mr-2" />
              Air Cargo Planning
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              ULD Loadability Tool
            </h1>
            <p className="text-white/80 max-w-2xl text-lg mb-6">
              Calculate cargo loadability, compare ULD specifications, and optimize your air freight shipments with our comprehensive Unit Load Device planning tool.
            </p>
          </motion.div>

          {/* Key Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">ULD Type</p>
                    <p className="text-2xl font-bold">{uld.name.split(" ")[0]}</p>
                    <p className="text-xs text-white/60">{uld.type}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/50 flex items-center justify-center">
                    <Weight className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Max Weight</p>
                    <p className="text-2xl font-bold">{uld.maxWeight.toLocaleString()} kg</p>
                    <p className="text-xs text-white/60">{(uld.maxWeight / 2.205).toFixed(0)} lbs capacity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/50 flex items-center justify-center">
                    <Ruler className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Volume Used</p>
                    <p className="text-2xl font-bold">{result.volumeUtilization.toFixed(1)}%</p>
                    <p className="text-xs text-white/60">{result.totalVolume.toFixed(2)} m³ of {uld.volume} m³</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="uld-types" className="flex items-center gap-2 py-3">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">ULD Types</span>
          </TabsTrigger>
          <TabsTrigger value="aircraft" className="flex items-center gap-2 py-3">
            <Plane className="h-4 w-4" />
            <span className="hidden sm:inline">Aircraft</span>
          </TabsTrigger>
          <TabsTrigger value="loading-guide" className="flex items-center gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              {/* ULD Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Select ULD Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(ULD_TYPES).slice(0, 6).map(([key, data]) => (
                      <div
                        key={key}
                        onClick={() => setUldType(key)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          uldType === key
                            ? "border-[var(--ocean)] bg-[var(--ocean)]/10"
                            : "border-border hover:border-[var(--ocean)]/50"
                        }`}
                      >
                        <p className="font-bold text-sm">{data.name.split(" ")[0]}</p>
                        <p className="text-xs text-muted-foreground">{data.type}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-muted-foreground">Volume:</span> <strong>{uld.volume} m³</strong></div>
                      <div><span className="text-muted-foreground">Max Weight:</span> <strong>{uld.maxWeight} kg</strong></div>
                      <div><span className="text-muted-foreground">Dimensions:</span> <strong>{uld.length}×{uld.width}×{uld.height}m</strong></div>
                      <div><span className="text-muted-foreground">Position:</span> <strong>{uld.contour}</strong></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Units Configuration */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5 text-[var(--ocean)]" />
                    Units Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Dimension Unit</Label>
                      <Select value={dimensionUnit} onValueChange={(v) => setDimensionUnit(v as "m" | "cm" | "in")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="m">Meters (m)</SelectItem>
                          <SelectItem value="cm">Centimeters (cm)</SelectItem>
                          <SelectItem value="in">Inches (in)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Weight Unit</Label>
                      <Select value={weightUnit} onValueChange={(v) => setWeightUnit(v as "kg" | "lb")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="lb">Pounds (lb)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cargo Items */}
              {cargoItems.map((item, index) => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Box className="h-5 w-5 text-[var(--ocean)]" />
                        Cargo Item {index + 1}
                      </CardTitle>
                      {cargoItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Item Name</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <Label className="text-xs">L ({dimensionUnit})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.length}
                          onChange={(e) => updateItem(item.id, "length", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">W ({dimensionUnit})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.width}
                          onChange={(e) => updateItem(item.id, "width", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">H ({dimensionUnit})</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={item.height}
                          onChange={(e) => updateItem(item.id, "height", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Wt ({weightUnit})</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={item.weight}
                          onChange={(e) => updateItem(item.id, "weight", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                      <Switch
                        checked={item.stackable}
                        onCheckedChange={(v) => updateItem(item.id, "stackable", v)}
                      />
                      <Label className="text-sm">Stackable</Label>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addItem} variant="outline" className="w-full">
                <Package className="h-4 w-4 mr-2" />
                Add Another Cargo Item
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-[var(--ocean)]/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Volume</p>
                    <p className="text-2xl font-bold text-[var(--ocean)]">
                      {result.totalVolume.toFixed(2)} m³
                    </p>
                    <Progress value={result.volumeUtilization} className="mt-2 h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.volumeUtilization.toFixed(1)}% utilized
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-[var(--logistics)]/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Weight</p>
                    <p className="text-2xl font-bold text-[var(--logistics)]">
                      {result.totalWeight} kg
                    </p>
                    <Progress value={result.weightUtilization} className="mt-2 h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.weightUtilization.toFixed(1)}% of capacity
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Utilization Charts */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                    Utilization Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-48">
                      <p className="text-sm text-center text-muted-foreground mb-2">Volume</p>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={volumePieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {volumePieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value.toFixed(2)} m³`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="h-48">
                      <p className="text-sm text-center text-muted-foreground mb-2">Weight</p>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={weightDistData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {weightDistData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value} kg`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation */}
              <Card className={`border-2 ${result.warningLevel === "danger" ? "border-destructive" : result.warningLevel === "caution" ? "border-yellow-500" : "border-[var(--logistics)]/30"}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {result.warningLevel === "danger" ? (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : result.warningLevel === "caution" ? (
                      <Info className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    )}
                    Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-lg font-medium ${result.warningLevel === "danger" ? "text-destructive" : result.warningLevel === "caution" ? "text-yellow-600" : "text-[var(--logistics)]"}`}>
                    {result.recommendation}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Remaining Volume</p>
                      <p className="text-xl font-bold">{result.remainingVolume.toFixed(2)} m³</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">Remaining Weight</p>
                      <p className="text-xl font-bold">{result.remainingWeight} kg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ULD Comparison Table */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">ULD Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-2 px-3">ULD</th>
                          <th className="text-right py-2 px-3">Volume</th>
                          <th className="text-right py-2 px-3">Max Wt</th>
                          <th className="text-right py-2 px-3">Fit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uldComparison.slice(0, 5).map((row) => (
                          <tr key={row.code} className={`border-b ${row.current ? "bg-[var(--ocean)]/10" : ""}`}>
                            <td className="py-2 px-3 font-medium">
                              {row.code}
                              {row.current && <Badge className="ml-2" variant="outline">Current</Badge>}
                            </td>
                            <td className="text-right py-2 px-3">{row.volume} m³</td>
                            <td className="text-right py-2 px-3">{row.maxWeight} kg</td>
                            <td className="text-right py-2 px-3 text-[var(--ocean)] font-bold">
                              {row.efficiency > 100 ? "N/A" : `${row.efficiency.toFixed(0)}%`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: ULD Types */}
        <TabsContent value="uld-types" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Package className="h-6 w-6 text-[var(--ocean)]" />
                What is a Unit Load Device (ULD)?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                A Unit Load Device (ULD) is a standardized container or pallet used in the air cargo industry to consolidate individual pieces of cargo into a single unit for efficient loading, transport, and unloading on aircraft. ULDs are essential components of modern air freight operations, enabling airlines to maximize cargo capacity while minimizing handling time and protecting goods during transit.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The development of ULDs revolutionized air cargo operations by allowing ground handlers to prepare shipments before aircraft arrival, significantly reducing turnaround times at airports. Each ULD is designed to fit specific aircraft cargo compartments, with standardized dimensions that ensure compatibility across different aircraft types within the same family. The International Air Transport Association (IATA) establishes and maintains ULD standards to ensure global interoperability between airlines and ground handling services.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                ULDs fall into two main categories: containers and pallets. Containers are enclosed units with rigid walls and doors that provide protection from weather, handling damage, and theft. Pallets are flat platforms with net restraint systems that offer flexibility for irregular-shaped cargo. The choice between containers and pallets depends on factors such as cargo type, protection requirements, aircraft type, and cost considerations. Containers typically offer better protection but have higher tare weight, while pallets are more economical and versatile.
              </p>
            </CardContent>
          </Card>

          {/* ULD Type Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                ULD Type Comparison
              </CardTitle>
              <CardDescription>Volume and weight capacity comparison across ULD types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={uldTypeChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === "volume" ? `${value} m³` : `${value}t`,
                        name === "volume" ? "Volume" : "Max Weight"
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="volume" name="Volume (m³)" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="maxWeight" name="Max Weight (t)" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ULD Specifications Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--ocean)]" />
                ULD Specifications Reference
              </CardTitle>
              <CardDescription>Complete specifications for all standard ULD types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[var(--ocean)]/30 bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Code</th>
                      <th className="text-left py-3 px-4 font-semibold">Type</th>
                      <th className="text-center py-3 px-4 font-semibold">Dimensions (L×W×H)</th>
                      <th className="text-right py-3 px-4 font-semibold">Volume</th>
                      <th className="text-right py-3 px-4 font-semibold">Max Weight</th>
                      <th className="text-right py-3 px-4 font-semibold">Tare</th>
                      <th className="text-center py-3 px-4 font-semibold">Deck</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(ULD_TYPES).map(([key, data], index) => (
                      <tr 
                        key={key} 
                        className={`border-b hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                      >
                        <td className="py-3 px-4">
                          <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] hover:bg-[var(--ocean)]/20">
                            {data.name.split(" ")[0]}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{data.type}</td>
                        <td className="py-3 px-4 text-center font-mono text-xs">
                          {data.length}×{data.width}×{data.height}m
                        </td>
                        <td className="py-3 px-4 text-right font-medium">{data.volume} m³</td>
                        <td className="py-3 px-4 text-right font-medium text-[var(--logistics)]">{data.maxWeight} kg</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{data.tareWeight} kg</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline" className={data.contour === "Main Deck" ? "border-[var(--ocean)] text-[var(--ocean)]" : "border-[var(--logistics)] text-[var(--logistics)]"}>
                            {data.contour}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ULD Code System */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                ULD Code System Explained
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The ULD code system uses three-letter designations following IATA standards to identify container and pallet types. Understanding this coding system is essential for anyone working in air cargo logistics.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                  <h4 className="font-semibold text-[var(--ocean)] mb-2">First Letter (Category)</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li><strong>A</strong> - Certified containers (IGLOO)</li>
                    <li><strong>D</strong> - Non-certified containers</li>
                    <li><strong>M</strong> - Non-certified military containers</li>
                    <li><strong>P</strong> - Pallets</li>
                    <li><strong>R</strong> - Refrigerated containers</li>
                  </ul>
                </div>
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg">
                  <h4 className="font-semibold text-[var(--logistics)] mb-2">Common LD Codes</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li><strong>LD1/LD7</strong> - 88×125 inch pallet contour</li>
                    <li><strong>LD2/LD8</strong> - 96×125 inch pallet contour</li>
                    <li><strong>LD3</strong> - Lower deck container (AKE)</li>
                    <li><strong>LD6/LD9</strong> - Double-width containers</li>
                    <li><strong>LD11</strong> - Main deck container (AMA)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Aircraft Compatibility */}
        <TabsContent value="aircraft" className="space-y-6 mt-6">
          {/* Aircraft Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5 text-[var(--ocean)]" />
                Aircraft Cargo Configuration
              </CardTitle>
              <CardDescription>Select an aircraft to view cargo specifications and ULD compatibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Select Aircraft</Label>
                  <Select value={aircraftType} onValueChange={setAircraftType}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AIRCRAFT_TYPES).map(([key, data]) => (
                        <SelectItem key={key} value={key}>
                          {data.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(() => {
                const aircraft = AIRCRAFT_TYPES[aircraftType];
                return (
                  <>
                    {/* Deck Capacity Cards */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="bg-[var(--ocean)]/5 border-[var(--ocean)]/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Layers className="h-4 w-4 text-[var(--ocean)]" />
                            Main Deck
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Pallet Positions</span>
                              <span className="font-bold text-lg">{aircraft.mainDeck.pallets}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Max Weight</span>
                              <span className="font-bold text-lg">{(aircraft.mainDeck.maxWeight / 1000).toFixed(0)}t</span>
                            </div>
                            <Progress value={(aircraft.mainDeck.maxWeight / 112000) * 100} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="bg-[var(--logistics)]/5 border-[var(--logistics)]/20">
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Package className="h-4 w-4 text-[var(--logistics)]" />
                            Lower Deck
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Container Positions</span>
                              <span className="font-bold text-lg">{aircraft.lowerDeck.containers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Max Weight</span>
                              <span className="font-bold text-lg">{(aircraft.lowerDeck.maxWeight / 1000).toFixed(0)}t</span>
                            </div>
                            <Progress value={(aircraft.lowerDeck.maxWeight / 40000) * 100} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Total Capacity */}
                    <div className="p-6 bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 rounded-xl">
                      <p className="text-sm text-muted-foreground">Total Cargo Capacity</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] bg-clip-text text-transparent">
                        {(aircraft.totalCapacity / 1000).toFixed(0)} tonnes
                      </p>
                    </div>

                    {/* Radar Chart */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Aircraft Capability Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={aircraftRadarData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                              <Radar
                                name={aircraft.name}
                                dataKey="value"
                                stroke="#0F4C81"
                                fill="#0F4C81"
                                fillOpacity={0.3}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Compatible ULDs */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Compatible ULD Types</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {aircraft.compatibleULDs.map((uldCode) => (
                            <Badge 
                              key={uldCode} 
                              className="bg-[var(--ocean)]/10 text-[var(--ocean)] hover:bg-[var(--ocean)]/20 px-3 py-1.5"
                            >
                              {ULD_TYPES[uldCode]?.name.split(" ")[0]}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </CardContent>
          </Card>

          {/* Aircraft Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Aircraft Fleet Comparison</CardTitle>
              <CardDescription>Compare cargo specifications across freighter aircraft types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-[var(--ocean)]/30 bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Aircraft</th>
                      <th className="text-center py-3 px-4 font-semibold">Main Deck</th>
                      <th className="text-center py-3 px-4 font-semibold">Lower Deck</th>
                      <th className="text-right py-3 px-4 font-semibold">Total Capacity</th>
                      <th className="text-center py-3 px-4 font-semibold">ULDs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(AIRCRAFT_TYPES).map(([key, data], index) => (
                      <tr 
                        key={key}
                        className={`border-b hover:bg-muted/30 transition-colors cursor-pointer ${aircraftType === key ? "bg-[var(--ocean)]/10" : index % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                        onClick={() => setAircraftType(key)}
                      >
                        <td className="py-3 px-4 font-medium">{data.name}</td>
                        <td className="py-3 px-4 text-center">{data.mainDeck.pallets} pallets</td>
                        <td className="py-3 px-4 text-center">{data.lowerDeck.containers} containers</td>
                        <td className="py-3 px-4 text-right font-bold text-[var(--ocean)]">{(data.totalCapacity / 1000).toFixed(0)}t</td>
                        <td className="py-3 px-4 text-center">{data.compatibleULDs.length} types</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Loading Guide */}
        <TabsContent value="loading-guide" className="space-y-6 mt-6">
          {/* Weight and Balance */}
          <Card className="border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-6 w-6 text-[var(--ocean)]" />
                Weight and Balance Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Weight and balance are fundamental safety considerations in air cargo operations that directly impact flight safety, fuel efficiency, and aircraft performance. Every aircraft has defined weight limits including Maximum Takeoff Weight (MTOW), Maximum Landing Weight (MLW), and Maximum Zero Fuel Weight (MZFW) that must never be exceeded. Beyond these absolute limits, the distribution of weight throughout the aircraft - the balance - is equally critical.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The center of gravity (CG) must fall within a certified envelope defined by the aircraft manufacturer. A CG too far forward can cause difficulty in raising the nose during takeoff and may require excessive control inputs during landing. A CG too far aft can make the aircraft unstable and difficult to recover from stalls. Loadmasters and flight planners carefully calculate the CG position based on the weight and position of each ULD, fuel load, and other variable weights.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Floor loading limits are another critical consideration. Each square meter of aircraft floor has a maximum weight it can support, and exceeding these limits can cause structural damage. Heavy items must be placed over floor beams or distributed across a larger area using load spreaders. ULDs themselves have maximum weight ratings that must be respected, and the total weight in each cargo compartment must not exceed compartment limits established by the manufacturer.
              </p>
            </CardContent>
          </Card>

          {/* Air Cargo Loading Principles */}
          <Card className="border-[var(--logistics)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Zap className="h-6 w-6 text-[var(--logistics)]" />
                Air Cargo Loading Principles
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Effective air cargo loading follows a systematic approach designed to maximize space utilization, ensure flight safety, and protect cargo integrity. The loading process begins with understanding the cargo manifest and determining which ULDs will be used. Each piece of cargo must be weighed, measured, and assigned to a specific ULD position based on weight, dimensions, destination, and any special handling requirements.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                For palletized cargo, proper restraint is essential. Nets must be correctly installed and tensioned according to ULD manufacturer specifications. Heavy items should be placed near the pallet center with lighter items around the perimeter to maintain stability. Cargo should be built to a height that allows proper net attachment while staying within contour limits. Any gaps between items should be filled with dunnage or blocking material to prevent shifting during flight.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Containerized cargo offers built-in protection but still requires proper loading techniques. Items should be distributed evenly across the container floor to prevent point loading. Stackable items should be arranged with heavier items at the bottom, and all items should be secured to prevent movement during flight maneuvers and turbulence. Temperature-sensitive shipments in reefer containers require proper airflow around cargo to ensure even temperature distribution.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Documentation plays a crucial role in the loading process. Each ULD must have a valid tag showing its contents, weight, destination, and any special handling codes. The load sheet, prepared before departure, documents the position and weight of each ULD and verifies that the aircraft remains within weight and balance limits. Any last-minute changes to cargo must be reflected in updated documentation before the aircraft can depart.
              </p>
            </CardContent>
          </Card>

          {/* Best Practices Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-[var(--logistics)]">
                  <CheckCircle2 className="h-5 w-5" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Distribute weight evenly across the ULD floor",
                    "Place heavy items at the bottom, lighter items on top",
                    "Use proper blocking and bracing for all cargo",
                    "Ensure nets are correctly tensioned and secured",
                    "Fill gaps with dunnage to prevent shifting",
                    "Document all cargo weights and positions accurately",
                    "Verify aircraft weight and balance before departure",
                    "Follow manufacturer guidelines for floor loading limits",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Exceeding ULD maximum weight ratings",
                    "Placing heavy items on one side creating imbalance",
                    "Failing to properly secure loose cargo",
                    "Ignoring floor loading limitations",
                    "Building cargo above contour limits",
                    "Overlooking special handling requirements",
                    "Incorrect weight declarations on documentation",
                    "Not verifying aircraft compatibility for ULD type",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Special Cargo Handling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--ocean)]" />
                Special Cargo Handling Considerations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Perishables</h4>
                  <p className="text-sm text-muted-foreground">
                    Use refrigerated ULDs (RKN, RAP) with temperature monitoring. Ensure proper airflow around cargo and pre-cool containers before loading.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Dangerous Goods</h4>
                  <p className="text-sm text-muted-foreground">
                    Follow IATA DGR regulations strictly. Ensure proper documentation, labeling, and segregation from incompatible materials.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Live Animals</h4>
                  <p className="text-sm text-muted-foreground">
                    Use approved animal containers with adequate ventilation. Position for easy access and away from noise sources. Monitor throughout journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card className="border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HelpCircle className="h-6 w-6 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Get answers to common questions about ULD loadability and air cargo planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium hover:text-[var(--ocean)]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export/Share Actions */}
      <Card className="border-[var(--ocean)]/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Results are calculated in real-time based on your inputs
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={resetForm}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm" className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
