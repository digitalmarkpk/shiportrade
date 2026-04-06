"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Plane,
  Truck,
  Train,
  ArrowRight,
  MapPin,
  Package,
  Weight,
  Ruler,
  Calculator,
  DollarSign,
  RefreshCw,
  Download,
  Share2,
  Info,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Clock,
  Fuel,
  Shield,
  FileText,
  Warehouse,
  Container,
  Boxes,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";
import { incoterms } from "@/lib/constants/units";

// Transport Modes
type TransportMode = "air" | "sea_fcl" | "sea_lcl" | "road" | "rail" | "multimodal";

interface TransportModeInfo {
  id: TransportMode;
  name: string;
  icon: React.ReactNode;
  description: string;
  baseRatePerKg: number;
  minTransitDays: number;
  maxTransitDays: number;
  reliability: number;
}

const transportModes: TransportModeInfo[] = [
  {
    id: "air",
    name: "Air Freight",
    icon: <Plane className="h-5 w-5" />,
    description: "Fast but expensive, ideal for urgent shipments",
    baseRatePerKg: 4.50,
    minTransitDays: 1,
    maxTransitDays: 5,
    reliability: 95,
  },
  {
    id: "sea_fcl",
    name: "Sea FCL",
    icon: <Container className="h-5 w-5" />,
    description: "Full container load, cost-effective for large volumes",
    baseRatePerKg: 0.15,
    minTransitDays: 15,
    maxTransitDays: 45,
    reliability: 85,
  },
  {
    id: "sea_lcl",
    name: "Sea LCL",
    icon: <Boxes className="h-5 w-5" />,
    description: "Less than container load, for smaller shipments",
    baseRatePerKg: 0.25,
    minTransitDays: 20,
    maxTransitDays: 50,
    reliability: 80,
  },
  {
    id: "road",
    name: "Road Transport",
    icon: <Truck className="h-5 w-5" />,
    description: "Flexible door-to-door for regional shipments",
    baseRatePerKg: 0.35,
    minTransitDays: 2,
    maxTransitDays: 14,
    reliability: 88,
  },
  {
    id: "rail",
    name: "Rail Freight",
    icon: <Train className="h-5 w-5" />,
    description: "Balanced cost-speed for continental routes",
    baseRatePerKg: 0.20,
    minTransitDays: 7,
    maxTransitDays: 21,
    reliability: 90,
  },
  {
    id: "multimodal",
    name: "Multimodal",
    icon: <Route className="h-5 w-5" />,
    description: "Combined transport modes for optimal routing",
    baseRatePerKg: 0.30,
    minTransitDays: 10,
    maxTransitDays: 30,
    reliability: 85,
  },
];

// Origin/Destination Data
const regions = [
  { code: "EAST_ASIA", name: "East Asia", countries: ["CN", "JP", "KR", "TW", "HK"] },
  { code: "SE_ASIA", name: "Southeast Asia", countries: ["SG", "TH", "VN", "MY", "ID", "PH"] },
  { code: "S_ASIA", name: "South Asia", countries: ["IN", "PK", "BD", "LK"] },
  { code: "EUROPE", name: "Europe", countries: ["DE", "NL", "BE", "FR", "GB", "IT", "ES", "PL"] },
  { code: "N_AMERICA", name: "North America", countries: ["US", "CA", "MX"] },
  { code: "S_AMERICA", name: "South America", countries: ["BR", "AR", "CL", "CO"] },
  { code: "MIDDLE_EAST", name: "Middle East", countries: ["AE", "SA", "IL", "TR"] },
  { code: "AFRICA", name: "Africa", countries: ["ZA", "EG", "NG", "KE", "MA"] },
  { code: "OCEANIA", name: "Oceania", countries: ["AU", "NZ"] },
];

const countries = [
  { code: "CN", name: "China", region: "EAST_ASIA" },
  { code: "JP", name: "Japan", region: "EAST_ASIA" },
  { code: "KR", name: "South Korea", region: "EAST_ASIA" },
  { code: "TW", name: "Taiwan", region: "EAST_ASIA" },
  { code: "HK", name: "Hong Kong", region: "EAST_ASIA" },
  { code: "SG", name: "Singapore", region: "SE_ASIA" },
  { code: "TH", name: "Thailand", region: "SE_ASIA" },
  { code: "VN", name: "Vietnam", region: "SE_ASIA" },
  { code: "MY", name: "Malaysia", region: "SE_ASIA" },
  { code: "ID", name: "Indonesia", region: "SE_ASIA" },
  { code: "PH", name: "Philippines", region: "SE_ASIA" },
  { code: "IN", name: "India", region: "S_ASIA" },
  { code: "PK", name: "Pakistan", region: "S_ASIA" },
  { code: "BD", name: "Bangladesh", region: "S_ASIA" },
  { code: "LK", name: "Sri Lanka", region: "S_ASIA" },
  { code: "DE", name: "Germany", region: "EUROPE" },
  { code: "NL", name: "Netherlands", region: "EUROPE" },
  { code: "BE", name: "Belgium", region: "EUROPE" },
  { code: "FR", name: "France", region: "EUROPE" },
  { code: "GB", name: "United Kingdom", region: "EUROPE" },
  { code: "IT", name: "Italy", region: "EUROPE" },
  { code: "ES", name: "Spain", region: "EUROPE" },
  { code: "PL", name: "Poland", region: "EUROPE" },
  { code: "US", name: "United States", region: "N_AMERICA" },
  { code: "CA", name: "Canada", region: "N_AMERICA" },
  { code: "MX", name: "Mexico", region: "N_AMERICA" },
  { code: "BR", name: "Brazil", region: "S_AMERICA" },
  { code: "AR", name: "Argentina", region: "S_AMERICA" },
  { code: "CL", name: "Chile", region: "S_AMERICA" },
  { code: "CO", name: "Colombia", region: "S_AMERICA" },
  { code: "AE", name: "UAE", region: "MIDDLE_EAST" },
  { code: "SA", name: "Saudi Arabia", region: "MIDDLE_EAST" },
  { code: "IL", name: "Israel", region: "MIDDLE_EAST" },
  { code: "TR", name: "Turkey", region: "MIDDLE_EAST" },
  { code: "ZA", name: "South Africa", region: "AFRICA" },
  { code: "EG", name: "Egypt", region: "AFRICA" },
  { code: "NG", name: "Nigeria", region: "AFRICA" },
  { code: "KE", name: "Kenya", region: "AFRICA" },
  { code: "MA", name: "Morocco", region: "AFRICA" },
  { code: "AU", name: "Australia", region: "OCEANIA" },
  { code: "NZ", name: "New Zealand", region: "OCEANIA" },
];

// Container Types for FCL
const containerTypes = [
  { id: "20gp", name: "20' GP", maxWeight: 28000, cbm: 33, price: 1200 },
  { id: "40gp", name: "40' GP", maxWeight: 26000, cbm: 67, price: 1800 },
  { id: "40hc", name: "40' HC", maxWeight: 26000, cbm: 76, price: 2100 },
  { id: "45hc", name: "45' HC", maxWeight: 25000, cbm: 86, price: 2400 },
];

// Surcharges Configuration
interface SurchargeType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  applicability: TransportMode[];
  calculation: "per_kg" | "per_container" | "percentage" | "flat";
  value: number;
}

const surchargeTypes: SurchargeType[] = [
  {
    id: "fsc",
    name: "Fuel Surcharge (FSC)",
    description: "Variable charge based on fuel prices",
    icon: <Fuel className="h-4 w-4" />,
    applicability: ["air", "sea_fcl", "sea_lcl", "road", "rail", "multimodal"],
    calculation: "per_kg",
    value: 0.85,
  },
  {
    id: "ssc",
    name: "Security Surcharge",
    description: "Security screening and handling",
    icon: <Shield className="h-4 w-4" />,
    applicability: ["air", "sea_fcl", "sea_lcl", "multimodal"],
    calculation: "per_kg",
    value: 0.15,
  },
  {
    id: "thc_origin",
    name: "Terminal Handling (Origin)",
    description: "Port/terminal handling at origin",
    icon: <Warehouse className="h-4 w-4" />,
    applicability: ["sea_fcl", "sea_lcl", "multimodal"],
    calculation: "per_container",
    value: 250,
  },
  {
    id: "thc_dest",
    name: "Terminal Handling (Dest.)",
    description: "Port/terminal handling at destination",
    icon: <Warehouse className="h-4 w-4" />,
    applicability: ["sea_fcl", "sea_lcl", "multimodal"],
    calculation: "per_container",
    value: 350,
  },
  {
    id: "doc_fee",
    name: "Documentation Fee",
    description: "B/L, customs docs, certificates",
    icon: <FileText className="h-4 w-4" />,
    applicability: ["air", "sea_fcl", "sea_lcl", "road", "rail", "multimodal"],
    calculation: "flat",
    value: 75,
  },
  {
    id: "baf",
    name: "BAF (Bunker Adjustment)",
    description: "Bunker adjustment factor for sea freight",
    icon: <Fuel className="h-4 w-4" />,
    applicability: ["sea_fcl", "sea_lcl", "multimodal"],
    calculation: "percentage",
    value: 8,
  },
  {
    id: "caf",
    name: "CAF (Currency Adjustment)",
    description: "Currency adjustment factor",
    icon: <DollarSign className="h-4 w-4" />,
    applicability: ["sea_fcl", "sea_lcl", "multimodal"],
    calculation: "percentage",
    value: 3,
  },
  {
    id: "pickup",
    name: "Pickup Service",
    description: "Cargo pickup from shipper location",
    icon: <Truck className="h-4 w-4" />,
    applicability: ["air", "sea_fcl", "sea_lcl", "road", "rail", "multimodal"],
    calculation: "flat",
    value: 150,
  },
  {
    id: "delivery",
    name: "Delivery Service",
    description: "Cargo delivery to consignee location",
    icon: <Truck className="h-4 w-4" />,
    applicability: ["air", "sea_fcl", "sea_lcl", "road", "rail", "multimodal"],
    calculation: "flat",
    value: 175,
  },
];

// Route Distance Matrix (simplified, in km)
const getDistanceFactor = (originRegion: string, destRegion: string): number => {
  const distanceMatrix: Record<string, Record<string, number>> = {
    "EAST_ASIA": { "EAST_ASIA": 0.3, "SE_ASIA": 0.5, "S_ASIA": 0.7, "EUROPE": 1.8, "N_AMERICA": 1.5, "S_AMERICA": 2.0, "MIDDLE_EAST": 1.0, "AFRICA": 1.6, "OCEANIA": 1.0 },
    "SE_ASIA": { "EAST_ASIA": 0.5, "SE_ASIA": 0.3, "S_ASIA": 0.5, "EUROPE": 1.5, "N_AMERICA": 1.8, "S_AMERICA": 2.2, "MIDDLE_EAST": 0.8, "AFRICA": 1.4, "OCEANIA": 0.8 },
    "S_ASIA": { "EAST_ASIA": 0.7, "SE_ASIA": 0.5, "S_ASIA": 0.3, "EUROPE": 1.0, "N_AMERICA": 1.8, "S_AMERICA": 2.0, "MIDDLE_EAST": 0.5, "AFRICA": 1.0, "OCEANIA": 1.2 },
    "EUROPE": { "EAST_ASIA": 1.8, "SE_ASIA": 1.5, "S_ASIA": 1.0, "EUROPE": 0.3, "N_AMERICA": 1.0, "S_AMERICA": 1.2, "MIDDLE_EAST": 0.5, "AFRICA": 0.7, "OCEANIA": 2.0 },
    "N_AMERICA": { "EAST_ASIA": 1.5, "SE_ASIA": 1.8, "S_ASIA": 1.8, "EUROPE": 1.0, "N_AMERICA": 0.3, "S_AMERICA": 0.8, "MIDDLE_EAST": 1.5, "AFRICA": 1.3, "OCEANIA": 1.5 },
    "S_AMERICA": { "EAST_ASIA": 2.0, "SE_ASIA": 2.2, "S_ASIA": 2.0, "EUROPE": 1.2, "N_AMERICA": 0.8, "S_AMERICA": 0.4, "MIDDLE_EAST": 1.8, "AFRICA": 1.0, "OCEANIA": 1.8 },
    "MIDDLE_EAST": { "EAST_ASIA": 1.0, "SE_ASIA": 0.8, "S_ASIA": 0.5, "EUROPE": 0.5, "N_AMERICA": 1.5, "S_AMERICA": 1.8, "MIDDLE_EAST": 0.3, "AFRICA": 0.6, "OCEANIA": 1.4 },
    "AFRICA": { "EAST_ASIA": 1.6, "SE_ASIA": 1.4, "S_ASIA": 1.0, "EUROPE": 0.7, "N_AMERICA": 1.3, "S_AMERICA": 1.0, "MIDDLE_EAST": 0.6, "AFRICA": 0.4, "OCEANIA": 1.6 },
    "OCEANIA": { "EAST_ASIA": 1.0, "SE_ASIA": 0.8, "S_ASIA": 1.2, "EUROPE": 2.0, "N_AMERICA": 1.5, "S_AMERICA": 1.8, "MIDDLE_EAST": 1.4, "AFRICA": 1.6, "OCEANIA": 0.3 },
  };
  return distanceMatrix[originRegion]?.[destRegion] || 1.0;
};

// Incoterms impact on cost allocation
const incotermsCostImpact: Record<string, { buyerPays: string[]; sellerPays: string[] }> = {
  "EXW": { buyerPays: ["freight", "insurance", "export_clearance", "import_clearance", "delivery"], sellerPays: [] },
  "FCA": { buyerPays: ["main_carriage", "insurance", "import_clearance", "delivery"], sellerPays: ["export_clearance"] },
  "FAS": { buyerPays: ["loading", "main_carriage", "insurance", "import_clearance", "delivery"], sellerPays: [] },
  "FOB": { buyerPays: ["main_carriage", "insurance", "import_clearance", "delivery"], sellerPays: ["loading", "export_clearance"] },
  "CFR": { buyerPays: ["insurance", "import_clearance", "delivery"], sellerPays: ["freight", "loading", "export_clearance"] },
  "CIF": { buyerPays: ["import_clearance", "delivery"], sellerPays: ["freight", "insurance", "loading", "export_clearance"] },
  "CPT": { buyerPays: ["insurance", "import_clearance", "delivery"], sellerPays: ["freight", "export_clearance"] },
  "CIP": { buyerPays: ["import_clearance", "delivery"], sellerPays: ["freight", "insurance", "export_clearance"] },
  "DAP": { buyerPays: ["import_clearance"], sellerPays: ["freight", "delivery", "export_clearance"] },
  "DPU": { buyerPays: ["import_clearance"], sellerPays: ["freight", "unloading", "delivery", "export_clearance"] },
  "DDP": { buyerPays: [], sellerPays: ["freight", "insurance", "import_clearance", "delivery", "export_clearance"] },
};

const COLORS = [
  "var(--ocean)",
  "var(--logistics)",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

export function ShipmentCostCalculator() {
  // Origin & Destination
  const [originCountry, setOriginCountry] = useState<string>("CN");
  const [destCountry, setDestCountry] = useState<string>("US");
  
  // Cargo Details
  const [cargoWeight, setCargoWeight] = useState<string>("500");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [cargoLength, setCargoLength] = useState<string>("100");
  const [cargoWidth, setCargoWidth] = useState<string>("80");
  const [cargoHeight, setCargoHeight] = useState<string>("60");
  const [dimUnit, setDimUnit] = useState<string>("cm");
  const [cargoValue, setCargoValue] = useState<string>("15000");
  const [currency, setCurrency] = useState<string>("USD");
  const [cargoQty, setCargoQty] = useState<string>("10");
  const [stackable, setStackable] = useState(false);
  const [hazardous, setHazardous] = useState(false);
  const [temperatureControlled, setTemperatureControlled] = useState(false);
  
  // Transport Options
  const [selectedMode, setSelectedMode] = useState<TransportMode>("sea_fcl");
  const [containerType, setContainerType] = useState<string>("40hc");
  const [selectedIncoterm, setSelectedIncoterm] = useState<string>("FOB");
  
  // Service Options
  const [insuranceEnabled, setInsuranceEnabled] = useState(true);
  const [customsClearance, setCustomsClearance] = useState(true);
  const [doorToDoor, setDoorToDoor] = useState(false);
  
  // Get country info
  const originInfo = countries.find(c => c.code === originCountry);
  const destInfo = countries.find(c => c.code === destCountry);
  const selectedCurrency = currencies.find(c => c.code === currency);
  
  // Calculate volume in CBM
  const calculateVolume = useMemo(() => {
    const l = parseFloat(cargoLength) || 0;
    const w = parseFloat(cargoWidth) || 0;
    const h = parseFloat(cargoHeight) || 0;
    const qty = parseFloat(cargoQty) || 1;
    
    // Convert to meters
    let lengthM = l;
    let widthM = w;
    let heightM = h;
    
    if (dimUnit === "cm") {
      lengthM = l / 100;
      widthM = w / 100;
      heightM = h / 100;
    } else if (dimUnit === "in") {
      lengthM = l * 0.0254;
      widthM = w * 0.0254;
      heightM = h * 0.0254;
    } else if (dimUnit === "ft") {
      lengthM = l * 0.3048;
      widthM = w * 0.3048;
      heightM = h * 0.3048;
    }
    
    return lengthM * widthM * heightM * qty;
  }, [cargoLength, cargoWidth, cargoHeight, cargoQty, dimUnit]);
  
  // Calculate total weight in kg
  const calculateWeight = useMemo(() => {
    const weight = parseFloat(cargoWeight) || 0;
    const qty = parseFloat(cargoQty) || 1;
    
    if (weightUnit === "lb") {
      return weight * 0.453592 * qty;
    } else if (weightUnit === "t") {
      return weight * 1000 * qty;
    }
    return weight * qty;
  }, [cargoWeight, cargoQty, weightUnit]);
  
  // Calculate volumetric weight
  const volumetricWeight = useMemo(() => {
    // Air: 6000 cc/kg, Sea: 1000 cc/kg
    const divisor = selectedMode === "air" ? 6000 : 1000;
    return (calculateVolume * 1000000) / divisor; // Convert CBM to cc then divide
  }, [calculateVolume, selectedMode]);
  
  // Chargeable weight (higher of actual vs volumetric)
  const chargeableWeight = useMemo(() => {
    return Math.max(calculateWeight, volumetricWeight);
  }, [calculateWeight, volumetricWeight]);
  
  // Distance factor based on regions
  const distanceFactor = useMemo(() => {
    if (!originInfo || !destInfo) return 1.0;
    return getDistanceFactor(originInfo.region, destInfo.region);
  }, [originInfo, destInfo]);
  
  // Calculate costs for selected mode
  const calculateModeCost = (mode: TransportMode) => {
    const modeInfo = transportModes.find(m => m.id === mode);
    if (!modeInfo) return null;
    
    let baseFreight = 0;
    let surcharges: { name: string; amount: number }[] = [];
    
    // Base freight calculation
    if (mode === "sea_fcl") {
      const container = containerTypes.find(c => c.id === containerType);
      const containerPrice = container ? container.price : 1800;
      baseFreight = containerPrice * distanceFactor;
      
      // FCL surcharges
      surcharges.push({ name: "Fuel Surcharge (FSC)", amount: Math.round(baseFreight * 0.15) });
      surcharges.push({ name: "BAF", amount: Math.round(baseFreight * 0.08) });
      surcharges.push({ name: "CAF", amount: Math.round(baseFreight * 0.03) });
      surcharges.push({ name: "THC Origin", amount: 250 });
      surcharges.push({ name: "THC Destination", amount: 350 });
      surcharges.push({ name: "Documentation Fee", amount: 75 });
      
    } else if (mode === "sea_lcl") {
      baseFreight = chargeableWeight * modeInfo.baseRatePerKg * distanceFactor;
      
      surcharges.push({ name: "Fuel Surcharge (FSC)", amount: Math.round(chargeableWeight * 0.12) });
      surcharges.push({ name: "CFS Handling", amount: Math.round(calculateVolume * 35) });
      surcharges.push({ name: "THC Origin", amount: 150 });
      surcharges.push({ name: "THC Destination", amount: 200 });
      surcharges.push({ name: "Documentation Fee", amount: 75 });
      
    } else if (mode === "air") {
      baseFreight = chargeableWeight * modeInfo.baseRatePerKg * distanceFactor;
      
      surcharges.push({ name: "Fuel Surcharge (FSC)", amount: Math.round(chargeableWeight * 0.85) });
      surcharges.push({ name: "Security Surcharge", amount: Math.round(chargeableWeight * 0.15) });
      surcharges.push({ name: "Air Waybill Fee", amount: 50 });
      surcharges.push({ name: "Documentation Fee", amount: 75 });
      
    } else if (mode === "road") {
      baseFreight = chargeableWeight * modeInfo.baseRatePerKg * distanceFactor;
      
      surcharges.push({ name: "Fuel Surcharge", amount: Math.round(baseFreight * 0.12) });
      surcharges.push({ name: "Documentation Fee", amount: 50 });
      
    } else if (mode === "rail") {
      baseFreight = chargeableWeight * modeInfo.baseRatePerKg * distanceFactor;
      
      surcharges.push({ name: "Rail Terminal Fee", amount: Math.round(calculateVolume * 15) });
      surcharges.push({ name: "Documentation Fee", amount: 75 });
      
    } else if (mode === "multimodal") {
      baseFreight = chargeableWeight * modeInfo.baseRatePerKg * distanceFactor;
      
      surcharges.push({ name: "Fuel Surcharge", amount: Math.round(baseFreight * 0.10) });
      surcharges.push({ name: "Transfer Handling", amount: Math.round(baseFreight * 0.05) });
      surcharges.push({ name: "THC Origin", amount: 200 });
      surcharges.push({ name: "THC Destination", amount: 250 });
      surcharges.push({ name: "Documentation Fee", amount: 100 });
    }
    
    // Add optional services
    if (insuranceEnabled) {
      const insuranceValue = parseFloat(cargoValue) * 0.005; // 0.5% of cargo value
      surcharges.push({ name: "Marine Insurance", amount: Math.round(insuranceValue) });
    }
    
    if (customsClearance) {
      surcharges.push({ name: "Customs Clearance", amount: 150 });
      surcharges.push({ name: "Import Duty Processing", amount: 75 });
    }
    
    if (doorToDoor) {
      surcharges.push({ name: "Pickup Service", amount: 150 });
      surcharges.push({ name: "Delivery Service", amount: 175 });
    }
    
    // Hazardous cargo surcharge
    if (hazardous) {
      surcharges.push({ name: "DG Handling Fee", amount: Math.round(baseFreight * 0.25) });
    }
    
    // Temperature controlled surcharge
    if (temperatureControlled) {
      surcharges.push({ name: "Reefer Surcharge", amount: Math.round(baseFreight * 0.35) });
    }
    
    const totalSurcharges = surcharges.reduce((sum, s) => sum + s.amount, 0);
    const totalCost = baseFreight + totalSurcharges;
    
    return {
      mode: modeInfo,
      baseFreight,
      surcharges,
      totalSurcharges,
      totalCost,
      transitDaysMin: Math.round(modeInfo.minTransitDays * distanceFactor),
      transitDaysMax: Math.round(modeInfo.maxTransitDays * distanceFactor),
    };
  };
  
  // Calculate costs for all modes for comparison
  const allModeCosts = transportModes.map(mode => ({
    mode: mode,
    ...calculateModeCost(mode.id),
  })).filter(result => result.totalCost !== undefined) as {
    mode: TransportModeInfo;
    baseFreight: number;
    surcharges: { name: string; amount: number }[];
    totalSurcharges: number;
    totalCost: number;
    transitDaysMin: number;
    transitDaysMax: number;
  }[];
  
  // Current selected mode cost
  const currentCost = calculateModeCost(selectedMode);
  
  // Sort modes by cost
  const sortedModes = [...allModeCosts].sort((a, b) => a.totalCost - b.totalCost);
  
  // Chart data for cost breakdown
  const costBreakdownData = (() => {
    if (!currentCost) return [];
    
    const data = [
      { name: "Base Freight", value: currentCost.baseFreight, color: "var(--ocean)" },
    ];
    
    currentCost.surcharges.forEach((s, i) => {
      data.push({ name: s.name, value: s.amount, color: COLORS[(i + 1) % COLORS.length] });
    });
    
    return data.filter(d => d.value > 0);
  })();
  
  // Mode comparison chart data
  const modeComparisonData = allModeCosts.map(m => ({
    name: m.mode.name,
    cost: m.totalCost,
    transit: (m.transitDaysMin + m.transitDaysMax) / 2,
    reliability: m.mode.reliability,
  }));
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="h-4 w-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="comparison" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Mode Comparison
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Cost Breakdown
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <Clock className="h-4 w-4" />
            Transit Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-4">
              {/* Origin & Destination */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                    Origin & Destination
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Origin Country</Label>
                      <Select value={originCountry} onValueChange={setOriginCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(c => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination Country</Label>
                      <Select value={destCountry} onValueChange={setDestCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map(c => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline">{originInfo?.name}</Badge>
                      <ArrowRight className="h-4 w-4" />
                      <Badge variant="outline">{destInfo?.name}</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Incoterms</Label>
                    <Select value={selectedIncoterm} onValueChange={setSelectedIncoterm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {incoterms.map(term => (
                          <SelectItem key={term.code} value={term.code}>
                            {term.code} - {term.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cargo Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Cargo Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Weight className="h-4 w-4" />
                        Total Weight
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={cargoWeight}
                          onChange={(e) => setCargoWeight(e.target.value)}
                          placeholder="Weight"
                          className="flex-1"
                        />
                        <Select value={weightUnit} onValueChange={setWeightUnit}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                            <SelectItem value="t">t</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={cargoQty}
                        onChange={(e) => setCargoQty(e.target.value)}
                        placeholder="Qty"
                      />
                    </div>
                  </div>
                  
                  {/* Dimensions */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Ruler className="h-4 w-4" />
                      Dimensions (per piece)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={cargoLength}
                        onChange={(e) => setCargoLength(e.target.value)}
                        placeholder="L"
                        className="flex-1"
                      />
                      <span className="flex items-center text-muted-foreground">×</span>
                      <Input
                        type="number"
                        value={cargoWidth}
                        onChange={(e) => setCargoWidth(e.target.value)}
                        placeholder="W"
                        className="flex-1"
                      />
                      <span className="flex items-center text-muted-foreground">×</span>
                      <Input
                        type="number"
                        value={cargoHeight}
                        onChange={(e) => setCargoHeight(e.target.value)}
                        placeholder="H"
                        className="flex-1"
                      />
                      <Select value={dimUnit} onValueChange={setDimUnit}>
                        <SelectTrigger className="w-16">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">cm</SelectItem>
                          <SelectItem value="in">in</SelectItem>
                          <SelectItem value="ft">ft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Cargo Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Cargo Value
                      </Label>
                      <Input
                        type="number"
                        value={cargoValue}
                        onChange={(e) => setCargoValue(e.target.value)}
                        placeholder="Value"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 15).map(c => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Cargo Options */}
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="stackable" className="text-sm">Stackable</Label>
                      <Switch id="stackable" checked={stackable} onCheckedChange={setStackable} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="hazardous" className="text-sm">Hazardous</Label>
                      <Switch id="hazardous" checked={hazardous} onCheckedChange={setHazardous} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label htmlFor="temp" className="text-sm">Reefer</Label>
                      <Switch id="temp" checked={temperatureControlled} onCheckedChange={setTemperatureControlled} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Transport Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Route className="h-5 w-5 text-[var(--ocean)]" />
                    Transport Mode
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {transportModes.map((mode) => (
                      <Button
                        key={mode.id}
                        variant={selectedMode === mode.id ? "default" : "outline"}
                        className={`h-auto py-3 flex-col gap-1 ${selectedMode === mode.id ? "bg-[var(--ocean)] hover:bg-[var(--ocean)]/90" : ""}`}
                        onClick={() => setSelectedMode(mode.id)}
                      >
                        {mode.icon}
                        <span className="text-xs">{mode.name}</span>
                      </Button>
                    ))}
                  </div>
                  
                  {selectedMode === "sea_fcl" && (
                    <div className="space-y-2 pt-2">
                      <Label>Container Type</Label>
                      <Select value={containerType} onValueChange={setContainerType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {containerTypes.map(c => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} - {c.cbm} CBM, Max {c.maxWeight}kg
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {/* Service Options */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[var(--logistics)]" />
                        <Label className="text-sm">Insurance (0.5%)</Label>
                      </div>
                      <Switch checked={insuranceEnabled} onCheckedChange={setInsuranceEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[var(--logistics)]" />
                        <Label className="text-sm">Customs Clearance</Label>
                      </div>
                      <Switch checked={customsClearance} onCheckedChange={setCustomsClearance} />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[var(--logistics)]" />
                        <Label className="text-sm">Door-to-Door</Label>
                      </div>
                      <Switch checked={doorToDoor} onCheckedChange={setDoorToDoor} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Results Panel */}
            <div className="space-y-4">
              {/* Cargo Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[var(--ocean)]">{calculateVolume.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">CBM</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[var(--logistics)]">{calculateWeight.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">kg (Actual)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-amber-500">{volumetricWeight.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">kg (Vol.)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-500">{chargeableWeight.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">kg (Chargeable)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Cost Summary */}
              {currentCost && (
                <Card className="border-2 border-[var(--ocean)]/20">
                  <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                    <CardTitle className="flex items-center justify-between">
                      <span>Total Shipment Cost</span>
                      <Badge className="gradient-ocean text-white">
                        {currentCost.mode.name}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <motion.div
                      key={currentCost.totalCost}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center mb-6"
                    >
                      <div className="text-4xl font-bold text-[var(--ocean)]">
                        {formatCurrency(currentCost.totalCost, currency)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Transit: {currentCost.transitDaysMin}-{currentCost.transitDaysMax} days
                      </div>
                    </motion.div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Freight</span>
                        <span className="font-medium">{formatCurrency(currentCost.baseFreight, currency)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Surcharges ({currentCost.surcharges.length})</span>
                        <span className="font-medium text-[var(--logistics)]">
                          +{formatCurrency(currentCost.totalSurcharges, currency)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Surcharges Breakdown */}
              {currentCost && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Surcharges Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2" style={{
                      scrollbarWidth: 'thin',
                    }}>
                      {currentCost.surcharges.map((surcharge, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[(index + 1) % COLORS.length] }}
                            />
                            <span className="text-sm">{surcharge.name}</span>
                          </div>
                          <span className="text-sm font-medium">
                            {formatCurrency(surcharge.amount, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  Export Quote
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="comparison">
          <div className="space-y-6">
            {/* Mode Comparison Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedModes.map((result, index) => (
                <motion.div
                  key={result.mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedMode === result.mode.id 
                        ? "border-2 border-[var(--ocean)]" 
                        : index === 0 
                          ? "border-[var(--logistics)]/50 bg-[var(--logistics)]/5" 
                          : ""
                    }`}
                    onClick={() => setSelectedMode(result.mode.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${selectedMode === result.mode.id ? "bg-[var(--ocean)] text-white" : "bg-muted"}`}>
                            {result.mode.icon}
                          </div>
                          <CardTitle className="text-base">{result.mode.name}</CardTitle>
                        </div>
                        {index === 0 && (
                          <Badge className="bg-[var(--logistics)] text-white">Best Value</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-[var(--ocean)] mb-3">
                        {formatCurrency(result.totalCost, currency)}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transit Time</span>
                          <span className="font-medium">{result.transitDaysMin}-{result.transitDaysMax} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reliability</span>
                          <span className="font-medium">{result.mode.reliability}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Freight</span>
                          <span className="font-medium">{formatCurrency(result.baseFreight, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Surcharges</span>
                          <span className="font-medium">{formatCurrency(result.totalSurcharges, currency)}</span>
                        </div>
                      </div>
                      
                      {/* Cost per kg */}
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cost per kg</span>
                          <span className="font-bold text-[var(--logistics)]">
                            {formatCurrency(result.totalCost / chargeableWeight, currency)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Cost vs Transit Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cost vs Transit Time Comparison</CardTitle>
                <CardDescription>Compare total cost and delivery speed across transport modes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={modeComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={12} />
                      <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `$${v}`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v} days`} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cost" name="Total Cost ($)" fill="var(--ocean)" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="transit" name="Transit Days" stroke="var(--logistics)" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="breakdown">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
                <CardDescription>Visual breakdown of shipment costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percentage }) => `${name}: ${percentage?.toFixed(1)}%`}
                        labelLine={false}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Components</CardTitle>
                <CardDescription>Detailed breakdown of each cost element</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costBreakdownData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis dataKey="name" type="category" width={120} fontSize={11} />
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Detailed Breakdown Table */}
          {currentCost && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Complete Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Cost Element</th>
                        <th className="text-right py-2">Amount ({currency})</th>
                        <th className="text-right py-2">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 font-medium">Base Freight</td>
                        <td className="text-right">{formatCurrency(currentCost.baseFreight, currency)}</td>
                        <td className="text-right">{((currentCost.baseFreight / currentCost.totalCost) * 100).toFixed(1)}%</td>
                      </tr>
                      {currentCost.surcharges.map((surcharge, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 pl-4">{surcharge.name}</td>
                          <td className="text-right">{formatCurrency(surcharge.amount, currency)}</td>
                          <td className="text-right">{((surcharge.amount / currentCost.totalCost) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-muted/50">
                        <td className="py-3">TOTAL</td>
                        <td className="text-right">{formatCurrency(currentCost.totalCost, currency)}</td>
                        <td className="text-right">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="space-y-6">
            {/* Transit Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Transit Time Comparison</CardTitle>
                <CardDescription>Estimated delivery times by transport mode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={allModeCosts.map(m => ({
                      name: m.mode.name,
                      min: m.transitDaysMin,
                      max: m.transitDaysMax,
                      avg: (m.transitDaysMin + m.transitDaysMax) / 2,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="min" name="Min Days" fill="var(--logistics)" />
                      <Bar dataKey="max" name="Max Days" fill="var(--ocean)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Mode Attributes */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allModeCosts.map((result) => (
                <Card key={result.mode.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <span className={`p-1.5 rounded-lg ${selectedMode === result.mode.id ? "bg-[var(--ocean)] text-white" : "bg-muted"}`}>
                        {result.mode.icon}
                      </span>
                      {result.mode.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reliability</span>
                        <span className="font-medium">{result.mode.reliability}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[var(--logistics)] rounded-full transition-all"
                          style={{ width: `${result.mode.reliability}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transit</span>
                        <span>{result.transitDaysMin}-{result.transitDaysMax} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost/kg</span>
                        <span>{formatCurrency(result.totalCost / chargeableWeight, currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total</span>
                        <span className="font-bold">{formatCurrency(result.totalCost, currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Recommendations */}
            <Card className="border-[var(--logistics)]/30 bg-[var(--logistics)]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                  <CheckCircle2 className="h-5 w-5" />
                  Mode Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Best for Cost Savings</h4>
                    <p className="text-sm text-muted-foreground">
                      {sortedModes[0]?.mode.name} offers the lowest total cost at {formatCurrency(sortedModes[0]?.totalCost || 0, currency)}, 
                      but requires {sortedModes[0]?.transitDaysMax} days transit time.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Best for Speed</h4>
                    <p className="text-sm text-muted-foreground">
                      Air Freight offers the fastest delivery at {transportModes.find(m => m.id === 'air')?.minTransitDays}-{transportModes.find(m => m.id === 'air')?.maxTransitDays} days,
                      but at a premium cost.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
