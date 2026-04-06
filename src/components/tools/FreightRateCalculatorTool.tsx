"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  Ship,
  Container,
  TrendingUp,
  TrendingDown,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Globe,
  Package,
  Clock,
  Fuel,
  Scale,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Trade Lanes Data
const TRADE_LANES = {
  ASIA_EUROPE: {
    id: "ASIA_EUROPE",
    name: "Asia - Europe",
    origin: "Far East",
    destination: "North Europe",
    transitDays: 30,
    baseRate20GP: 1850,
    baseRate40GP: 2350,
    baseRate40HC: 2500,
    bafPerContainer: 720,
    cafPercent: 4.5,
    seasonalFactor: 1.15,
  },
  ASIA_USWC: {
    id: "ASIA_USWC",
    name: "Asia - US West Coast",
    origin: "Far East",
    destination: "US West Coast",
    transitDays: 14,
    baseRate20GP: 2450,
    baseRate40GP: 3100,
    baseRate40HC: 3300,
    bafPerContainer: 850,
    cafPercent: 3.2,
    seasonalFactor: 1.25,
  },
  ASIA_USEC: {
    id: "ASIA_USEC",
    name: "Asia - US East Coast",
    origin: "Far East",
    destination: "US East Coast",
    transitDays: 28,
    baseRate20GP: 2850,
    baseRate40GP: 3650,
    baseRate40HC: 3900,
    bafPerContainer: 980,
    cafPercent: 3.5,
    seasonalFactor: 1.2,
  },
  EUROPE_US: {
    id: "EUROPE_US",
    name: "Europe - US",
    origin: "North Europe",
    destination: "US East Coast",
    transitDays: 12,
    baseRate20GP: 1950,
    baseRate40GP: 2500,
    baseRate40HC: 2650,
    bafPerContainer: 680,
    cafPercent: 2.8,
    seasonalFactor: 1.1,
  },
  TRANS_PACIFIC: {
    id: "TRANS_PACIFIC",
    name: "Trans-Pacific",
    origin: "Various",
    destination: "Various Pacific",
    transitDays: 20,
    baseRate20GP: 2650,
    baseRate40GP: 3400,
    baseRate40HC: 3600,
    bafPerContainer: 920,
    cafPercent: 3.8,
    seasonalFactor: 1.3,
  },
  TRANS_ATLANTIC: {
    id: "TRANS_ATLANTIC",
    name: "Trans-Atlantic",
    origin: "Europe",
    destination: "North America",
    transitDays: 10,
    baseRate20GP: 1650,
    baseRate40GP: 2100,
    baseRate40HC: 2250,
    bafPerContainer: 580,
    cafPercent: 2.5,
    seasonalFactor: 1.05,
  },
  INTRA_ASIA: {
    id: "INTRA_ASIA",
    name: "Intra-Asia",
    origin: "Various Asia",
    destination: "Various Asia",
    transitDays: 7,
    baseRate20GP: 650,
    baseRate40GP: 850,
    baseRate40HC: 920,
    bafPerContainer: 280,
    cafPercent: 1.8,
    seasonalFactor: 1.0,
  },
  ASIA_MEA: {
    id: "ASIA_MEA",
    name: "Asia - Middle East",
    origin: "Far East",
    destination: "Middle East",
    transitDays: 14,
    baseRate20GP: 1250,
    baseRate40GP: 1600,
    baseRate40HC: 1720,
    bafPerContainer: 450,
    cafPercent: 2.2,
    seasonalFactor: 1.1,
  },
  ASIA_LATAM: {
    id: "ASIA_LATAM",
    name: "Asia - Latin America",
    origin: "Far East",
    destination: "South America",
    transitDays: 35,
    baseRate20GP: 2950,
    baseRate40GP: 3800,
    baseRate40HC: 4050,
    bafPerContainer: 1050,
    cafPercent: 4.0,
    seasonalFactor: 1.18,
  },
  EUROPE_AFRICA: {
    id: "EUROPE_AFRICA",
    name: "Europe - Africa",
    origin: "North Europe",
    destination: "West Africa",
    transitDays: 15,
    baseRate20GP: 1450,
    baseRate40GP: 1850,
    baseRate40HC: 1980,
    bafPerContainer: 520,
    cafPercent: 2.5,
    seasonalFactor: 1.08,
  },
};

// Container Types
const CONTAINER_TYPES = {
  GP20: {
    id: "20GP",
    name: "20' General Purpose",
    description: "Standard 20ft container",
    length: 20,
    maxPayload: 28180,
    cubicCapacity: 33.2,
    rateMultiplier: 1.0,
  },
  GP40: {
    id: "40GP",
    name: "40' General Purpose",
    description: "Standard 40ft container",
    length: 40,
    maxPayload: 28750,
    cubicCapacity: 67.7,
    rateMultiplier: 1.27,
  },
  HC40: {
    id: "40HC",
    name: "40' High Cube",
    description: "High cube 40ft container",
    length: 40,
    maxPayload: 28600,
    cubicCapacity: 76.3,
    rateMultiplier: 1.35,
  },
  HC45: {
    id: "45HC",
    name: "45' High Cube",
    description: "High cube 45ft container",
    length: 45,
    maxPayload: 27600,
    cubicCapacity: 86.1,
    rateMultiplier: 1.52,
  },
  RF20: {
    id: "20RF",
    name: "20' Refrigerated",
    description: "20ft reefer container",
    length: 20,
    maxPayload: 27400,
    cubicCapacity: 28.3,
    rateMultiplier: 2.2,
  },
  RF40: {
    id: "40RF",
    name: "40' Refrigerated",
    description: "40ft reefer container",
    length: 40,
    maxPayload: 29200,
    cubicCapacity: 59.0,
    rateMultiplier: 2.5,
  },
  OT20: {
    id: "20OT",
    name: "20' Open Top",
    description: "20ft open top container",
    length: 20,
    maxPayload: 28130,
    cubicCapacity: 33.2,
    rateMultiplier: 1.4,
  },
  OT40: {
    id: "40OT",
    name: "40' Open Top",
    description: "40ft open top container",
    length: 40,
    maxPayload: 28610,
    cubicCapacity: 66.7,
    rateMultiplier: 1.55,
  },
  FR20: {
    id: "20FR",
    name: "20' Flat Rack",
    description: "20ft flat rack container",
    length: 20,
    maxPayload: 31000,
    cubicCapacity: 0,
    rateMultiplier: 1.6,
  },
  FR40: {
    id: "40FR",
    name: "40' Flat Rack",
    description: "40ft flat rack container",
    length: 40,
    maxPayload: 40000,
    cubicCapacity: 0,
    rateMultiplier: 1.85,
  },
};

// Major Carriers
const CARRIERS = {
  MAERSK: {
    id: "MAERSK",
    name: "Maersk Line",
    logo: "MAERSK",
    country: "Denmark",
    marketShare: 16.8,
    reliabilityScore: 94,
    basePremium: 1.02,
  },
  MSC: {
    id: "MSC",
    name: "MSC",
    logo: "MSC",
    country: "Switzerland",
    marketShare: 17.2,
    reliabilityScore: 92,
    basePremium: 0.98,
  },
  CMA_CGM: {
    id: "CMA_CGM",
    name: "CMA CGM",
    logo: "CMA CGM",
    country: "France",
    marketShare: 12.5,
    reliabilityScore: 91,
    basePremium: 1.0,
  },
  COSCO: {
    id: "COSCO",
    name: "COSCO Shipping",
    logo: "COSCO",
    country: "China",
    marketShare: 11.8,
    reliabilityScore: 89,
    basePremium: 0.95,
  },
  HAPAG: {
    id: "HAPAG",
    name: "Hapag-Lloyd",
    logo: "Hapag-Lloyd",
    country: "Germany",
    marketShare: 9.5,
    reliabilityScore: 93,
    basePremium: 1.01,
  },
  EVERGREEN: {
    id: "EVERGREEN",
    name: "Evergreen",
    logo: "Evergreen",
    country: "Taiwan",
    marketShare: 5.8,
    reliabilityScore: 90,
    basePremium: 0.97,
  },
  ONE: {
    id: "ONE",
    name: "ONE",
    logo: "ONE",
    country: "Japan",
    marketShare: 6.8,
    reliabilityScore: 92,
    basePremium: 0.99,
  },
  YANG_MING: {
    id: "YANG_MING",
    name: "Yang Ming",
    logo: "Yang Ming",
    country: "Taiwan",
    marketShare: 2.8,
    reliabilityScore: 88,
    basePremium: 0.94,
  },
  HMM: {
    id: "HMM",
    name: "HMM",
    logo: "HMM",
    country: "South Korea",
    marketShare: 2.5,
    reliabilityScore: 91,
    basePremium: 0.96,
  },
  ZIM: {
    id: "ZIM",
    name: "ZIM",
    logo: "ZIM",
    country: "Israel",
    marketShare: 2.3,
    reliabilityScore: 87,
    basePremium: 0.93,
  },
};

// Surcharges
const SURCHARGES = {
  thc: { name: "Terminal Handling Charge (THC)", origin: 185, destination: 295 },
  doc: { name: "Documentation Fee", origin: 75, destination: 0 },
  isps: { name: "ISPS Security Surcharge", origin: 45, destination: 45 },
  seal: { name: "Seal Fee", origin: 25, destination: 0 },
  bl: { name: "Bill of Lading Fee", origin: 65, destination: 0 },
  vgm: { name: "VGM Verification Fee", origin: 35, destination: 0 },
  chas: { name: "Chassis Fee", origin: 0, destination: 125 },
  cims: { name: "Container Imbalance Surcharge", origin: 0, destination: 180 },
  pss: { name: "Peak Season Surcharge", enabled: false, amount: 350 },
  gri: { name: "General Rate Increase", enabled: false, amount: 500 },
};

// Historical Rate Trends (last 12 months)
const RATE_TRENDS = [
  { month: "Jan", asiaEurope: 1650, asiaUsWc: 2250, asiaUsEc: 2650, transAtlantic: 1450 },
  { month: "Feb", asiaEurope: 1720, asiaUsWc: 2350, asiaUsEc: 2720, transAtlantic: 1480 },
  { month: "Mar", asiaEurope: 1780, asiaUsWc: 2420, asiaUsEc: 2780, transAtlantic: 1520 },
  { month: "Apr", asiaEurope: 1850, asiaUsWc: 2480, asiaUsEc: 2850, transAtlantic: 1550 },
  { month: "May", asiaEurope: 1820, asiaUsWc: 2450, asiaUsEc: 2820, transAtlantic: 1530 },
  { month: "Jun", asiaEurope: 1780, asiaUsWc: 2380, asiaUsEc: 2780, transAtlantic: 1500 },
  { month: "Jul", asiaEurope: 1850, asiaUsWc: 2420, asiaUsEc: 2820, transAtlantic: 1540 },
  { month: "Aug", asiaEurope: 1920, asiaUsWc: 2500, asiaUsEc: 2900, transAtlantic: 1580 },
  { month: "Sep", asiaEurope: 2050, asiaUsWc: 2680, asiaUsEc: 3050, transAtlantic: 1620 },
  { month: "Oct", asiaEurope: 2180, asiaUsWc: 2850, asiaUsEc: 3220, transAtlantic: 1680 },
  { month: "Nov", asiaEurope: 2250, asiaUsWc: 2950, asiaUsEc: 3350, transAtlantic: 1720 },
  { month: "Dec", asiaEurope: 2350, asiaUsWc: 3100, asiaUsEc: 3500, transAtlantic: 1780 },
];

interface RateCalculation {
  baseRate: number;
  baf: number;
  caf: number;
  thcOrigin: number;
  thcDestination: number;
  documentation: number;
  security: number;
  otherFees: number;
  peakSeason: number;
  gri: number;
  totalRate: number;
  transitDays: number;
  costPerCBM: number;
  costPerTon: number;
}

interface CarrierRate extends RateCalculation {
  carrierId: string;
  carrierName: string;
  reliabilityScore: number;
  marketShare: number;
  premium: number;
}

export function FreightRateCalculatorTool() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");

  // Input states
  const [tradeLane, setTradeLane] = useState<keyof typeof TRADE_LANES>("ASIA_EUROPE");
  const [containerType, setContainerType] = useState<keyof typeof CONTAINER_TYPES>("HC40");
  const [containerCount, setContainerCount] = useState<string>("1");
  const [cargoWeight, setCargoWeight] = useState<string>("15000");
  const [cargoVolume, setCargoVolume] = useState<string>("50");
  const [includePeakSeason, setIncludePeakSeason] = useState(false);
  const [includeGRI, setIncludeGRI] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<keyof typeof CARRIERS>("MAERSK");

  // Chart colors
  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    secondary: "#6366F1",
    accent: "#8B5CF6",
  };

  // Calculate rates
  const calculation = useMemo((): RateCalculation => {
    const lane = TRADE_LANES[tradeLane];
    const container = CONTAINER_TYPES[containerType];
    const containers = parseInt(containerCount) || 1;

    // Base rate based on container type
    let baseRate = lane.baseRate40HC;
    if (containerType === "GP20") baseRate = lane.baseRate20GP;
    else if (containerType === "GP40") baseRate = lane.baseRate40GP;
    else if (containerType === "HC45") baseRate = lane.baseRate40HC * 1.12;
    else if (containerType.includes("RF")) baseRate = lane.baseRate40HC * container.rateMultiplier;
    else if (containerType.includes("OT")) baseRate = lane.baseRate40HC * container.rateMultiplier;
    else if (containerType.includes("FR")) baseRate = lane.baseRate40HC * container.rateMultiplier;

    // Surcharges
    const baf = lane.bafPerContainer * container.rateMultiplier;
    const caf = baseRate * (lane.cafPercent / 100);
    const thcOrigin = SURCHARGES.thc.origin * containers;
    const thcDestination = SURCHARGES.thc.destination * containers;
    const documentation = (SURCHARGES.doc.origin + SURCHARGES.bl.origin) * containers;
    const security = (SURCHARGES.isps.origin + SURCHARGES.isps.destination) * containers;
    const otherFees =
      (SURCHARGES.seal.origin + SURCHARGES.vgm.origin + SURCHARGES.chas.destination + SURCHARGES.cims.destination) * containers;

    // Optional surcharges
    const peakSeason = includePeakSeason ? SURCHARGES.pss.amount * containers : 0;
    const gri = includeGRI ? SURCHARGES.gri.amount * containers : 0;

    // Total
    const totalRate =
      (baseRate + baf + caf) * containers + thcOrigin + thcDestination + documentation + security + otherFees + peakSeason + gri;

    // Unit costs
    const weight = parseFloat(cargoWeight) || 0;
    const volume = parseFloat(cargoVolume) || 0;
    const costPerCBM = volume > 0 ? totalRate / volume : 0;
    const costPerTon = weight > 0 ? totalRate / (weight / 1000) : 0;

    return {
      baseRate: baseRate * containers,
      baf: baf * containers,
      caf,
      thcOrigin,
      thcDestination,
      documentation,
      security,
      otherFees,
      peakSeason,
      gri,
      totalRate,
      transitDays: lane.transitDays,
      costPerCBM,
      costPerTon,
    };
  }, [tradeLane, containerType, containerCount, cargoWeight, cargoVolume, includePeakSeason, includeGRI]);

  // Carrier comparison
  const carrierComparison = useMemo((): CarrierRate[] => {
    const lane = TRADE_LANES[tradeLane];
    const container = CONTAINER_TYPES[containerType];
    const containers = parseInt(containerCount) || 1;

    return Object.entries(CARRIERS).map(([key, carrier]) => {
      // Base rate with carrier premium
      let baseRate = lane.baseRate40HC * carrier.basePremium;
      if (containerType === "GP20") baseRate = lane.baseRate20GP * carrier.basePremium;
      else if (containerType === "GP40") baseRate = lane.baseRate40GP * carrier.basePremium;
      else if (containerType === "HC45") baseRate = lane.baseRate40HC * 1.12 * carrier.basePremium;
      else if (containerType.includes("RF")) baseRate = lane.baseRate40HC * container.rateMultiplier * carrier.basePremium;
      else if (containerType.includes("OT")) baseRate = lane.baseRate40HC * container.rateMultiplier * carrier.basePremium;
      else if (containerType.includes("FR")) baseRate = lane.baseRate40HC * container.rateMultiplier * carrier.basePremium;

      const baf = lane.bafPerContainer * container.rateMultiplier;
      const caf = baseRate * (lane.cafPercent / 100);
      const thcOrigin = SURCHARGES.thc.origin * containers;
      const thcDestination = SURCHARGES.thc.destination * containers;
      const documentation = (SURCHARGES.doc.origin + SURCHARGES.bl.origin) * containers;
      const security = (SURCHARGES.isps.origin + SURCHARGES.isps.destination) * containers;
      const otherFees =
        (SURCHARGES.seal.origin + SURCHARGES.vgm.origin + SURCHARGES.chas.destination + SURCHARGES.cims.destination) * containers;
      const peakSeason = includePeakSeason ? SURCHARGES.pss.amount * containers : 0;
      const gri = includeGRI ? SURCHARGES.gri.amount * containers : 0;

      const totalRate =
        (baseRate + baf + caf) * containers +
        thcOrigin +
        thcDestination +
        documentation +
        security +
        otherFees +
        peakSeason +
        gri;

      return {
        carrierId: key,
        carrierName: carrier.name,
        reliabilityScore: carrier.reliabilityScore,
        marketShare: carrier.marketShare,
        premium: carrier.basePremium,
        baseRate: baseRate * containers,
        baf: baf * containers,
        caf,
        thcOrigin,
        thcDestination,
        documentation,
        security,
        otherFees,
        peakSeason,
        gri,
        totalRate,
        transitDays: lane.transitDays,
        costPerCBM: 0,
        costPerTon: 0,
      };
    }).sort((a, b) => a.totalRate - b.totalRate);
  }, [tradeLane, containerType, containerCount, includePeakSeason, includeGRI]);

  // Pie chart data for cost breakdown
  const pieData = useMemo(() => {
    return [
      { name: "Base Freight", value: calculation.baseRate, color: chartColors.ocean },
      { name: "BAF", value: calculation.baf, color: chartColors.logistics },
      { name: "CAF", value: calculation.caf, color: chartColors.secondary },
      { name: "THC", value: calculation.thcOrigin + calculation.thcDestination, color: chartColors.warning },
      { name: "Doc & Security", value: calculation.documentation + calculation.security, color: chartColors.accent },
      { name: "Other Fees", value: calculation.otherFees + calculation.peakSeason + calculation.gri, color: chartColors.danger },
    ].filter((item) => item.value > 0);
  }, [calculation]);

  // Reset form
  const resetForm = () => {
    setContainerCount("1");
    setCargoWeight("15000");
    setCargoVolume("50");
    setIncludePeakSeason(false);
    setIncludeGRI(false);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Carrier Compare</TabsTrigger>
          <TabsTrigger value="surcharges">Surcharges</TabsTrigger>
          <TabsTrigger value="trends">Rate Trends</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-[#0F4C81]" />
                  Freight Rate Calculator
                </CardTitle>
                <CardDescription>Calculate ocean freight rates for your shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currency Selection */}
                <div className="flex items-center gap-4">
                  <Label className="shrink-0">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.slice(0, 15).map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Trade Lane Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#2E8B57]" />
                    Trade Lane
                  </Label>
                  <Select value={tradeLane} onValueChange={(v) => setTradeLane(v as keyof typeof TRADE_LANES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRADE_LANES).map(([key, lane]) => (
                        <SelectItem key={key} value={key}>
                          {lane.name} ({lane.transitDays} days)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Container Type */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Container className="h-4 w-4 text-[#0F4C81]" />
                    Container Type
                  </Label>
                  <Select value={containerType} onValueChange={(v) => setContainerType(v as keyof typeof CONTAINER_TYPES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CONTAINER_TYPES).map(([key, ct]) => (
                        <SelectItem key={key} value={key}>
                          {ct.name} - {ct.cubicCapacity > 0 ? `${ct.cubicCapacity} CBM` : "OOG"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Container Count & Cargo Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="containerCount">Containers</Label>
                    <Input
                      id="containerCount"
                      type="number"
                      value={containerCount}
                      onChange={(e) => setContainerCount(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargoWeight">Weight (kg)</Label>
                    <Input
                      id="cargoWeight"
                      type="number"
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargoVolume">Volume (CBM)</Label>
                    <Input
                      id="cargoVolume"
                      type="number"
                      value={cargoVolume}
                      onChange={(e) => setCargoVolume(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                {/* Carrier Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[#0F4C81]" />
                    Preferred Carrier
                  </Label>
                  <Select value={selectedCarrier} onValueChange={(v) => setSelectedCarrier(v as keyof typeof CARRIERS)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CARRIERS).map(([key, carrier]) => (
                        <SelectItem key={key} value={key}>
                          {carrier.name} ({carrier.reliabilityScore}% reliability)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Optional Surcharges */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                    Optional Surcharges
                  </Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Peak Season Surcharge</p>
                      <p className="text-xs text-muted-foreground">${SURCHARGES.pss.amount}/container</p>
                    </div>
                    <Switch checked={includePeakSeason} onCheckedChange={setIncludePeakSeason} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">General Rate Increase (GRI)</p>
                      <p className="text-xs text-muted-foreground">${SURCHARGES.gri.amount}/container</p>
                    </div>
                    <Switch checked={includeGRI} onCheckedChange={setIncludeGRI} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90">
                    <Calculator className="h-4 w-4 mr-2" />
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  Rate Breakdown
                </CardTitle>
                <CardDescription>
                  {TRADE_LANES[tradeLane].name} - {CONTAINER_TYPES[containerType].name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Total Rate */}
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl text-white text-center"
                >
                  <p className="text-sm opacity-90 mb-1">Total Freight Rate</p>
                  <p className="text-4xl font-bold">{formatCurrency(calculation.totalRate, currency)}</p>
                  <p className="text-sm opacity-75 mt-2">
                    {containerCount} x {CONTAINER_TYPES[containerType].name}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <Clock className="h-4 w-4 opacity-75" />
                    <span className="text-sm opacity-90">{calculation.transitDays} days transit</span>
                  </div>
                </motion.div>

                {/* Rate Components */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Rate Components
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Base Freight</span>
                      <Badge variant="secondary" className="font-mono">
                        {formatCurrency(calculation.baseRate, currency)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Fuel className="h-3 w-3" />
                        BAF (Bunker)
                      </span>
                      <Badge variant="secondary" className="font-mono">
                        {formatCurrency(calculation.baf, currency)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">CAF (Currency)</span>
                      <Badge variant="secondary" className="font-mono">
                        {formatCurrency(calculation.caf, currency)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">THC (Origin + Dest)</span>
                      <Badge variant="secondary" className="font-mono">
                        {formatCurrency(calculation.thcOrigin + calculation.thcDestination, currency)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-400">Documentation & Security</span>
                      <Badge variant="secondary" className="font-mono">
                        {formatCurrency(calculation.documentation + calculation.security, currency)}
                      </Badge>
                    </div>
                    {(calculation.peakSeason > 0 || calculation.gri > 0) && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-600 dark:text-slate-400">Optional Surcharges</span>
                        <Badge variant="secondary" className="font-mono">
                          {formatCurrency(calculation.peakSeason + calculation.gri, currency)}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Unit Costs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0F4C81]/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost per CBM</p>
                    <p className="text-xl font-bold text-[#0F4C81]">{formatCurrency(calculation.costPerCBM, currency)}</p>
                  </div>
                  <div className="p-4 bg-[#2E8B57]/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Cost per Ton</p>
                    <p className="text-xl font-bold text-[#2E8B57]">{formatCurrency(calculation.costPerTon, currency)}</p>
                  </div>
                </div>

                {/* Cost Breakdown Chart */}
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Carrier Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-[#0F4C81]" />
                Carrier Rate Comparison
              </CardTitle>
              <CardDescription>
                Compare rates across major shipping lines for {TRADE_LANES[tradeLane].name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={carrierComparison} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`} />
                    <YAxis dataKey="carrierName" type="category" width={100} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    <Legend />
                    <Bar dataKey="baseRate" fill={chartColors.ocean} name="Base Rate" />
                    <Bar dataKey="baf" fill={chartColors.logistics} name="BAF" />
                    <Bar dataKey="totalRate" fill={chartColors.secondary} name="Total Rate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Rank</th>
                      <th className="text-left py-3 px-4">Carrier</th>
                      <th className="text-center py-3 px-4">Reliability</th>
                      <th className="text-right py-3 px-4">Base Rate</th>
                      <th className="text-right py-3 px-4">BAF</th>
                      <th className="text-right py-3 px-4">Total Rate</th>
                      <th className="text-right py-3 px-4">vs Best</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrierComparison.map((carrier, idx) => {
                      const bestRate = carrierComparison[0].totalRate;
                      const diff = ((carrier.totalRate - bestRate) / bestRate) * 100;
                      return (
                        <tr
                          key={carrier.carrierId}
                          className={`border-b ${idx === 0 ? "bg-[#2E8B57]/10" : ""}`}
                        >
                          <td className="py-3 px-4">
                            {idx === 0 ? (
                              <Badge className="bg-[#2E8B57]">Best Rate</Badge>
                            ) : (
                              <span className="text-muted-foreground">#{idx + 1}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium">{carrier.carrierName}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge
                              variant="outline"
                              className={
                                carrier.reliabilityScore >= 93
                                  ? "border-[#2E8B57] text-[#2E8B57]"
                                  : carrier.reliabilityScore >= 90
                                    ? "border-[#0F4C81] text-[#0F4C81]"
                                    : ""
                              }
                            >
                              {carrier.reliabilityScore}%
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {formatCurrency(carrier.baseRate, currency)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {formatCurrency(carrier.baf, currency)}
                          </td>
                          <td className="py-3 px-4 text-right font-bold font-mono">
                            {formatCurrency(carrier.totalRate, currency)}
                          </td>
                          <td
                            className={`py-3 px-4 text-right ${diff > 0 ? "text-[#EF4444]" : "text-[#2E8B57]"}`}
                          >
                            {diff > 0 ? "+" : ""}
                            {diff.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Recommendation */}
              <div className="mt-6 p-4 bg-[#0F4C81]/10 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#0F4C81] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#0F4C81]">Recommendation</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {carrierComparison[0].carrierName} offers the best rate at{" "}
                      {formatCurrency(carrierComparison[0].totalRate, currency)} with {carrierComparison[0].reliabilityScore}%
                      reliability. Consider booking early to secure this rate.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Surcharges Tab */}
        <TabsContent value="surcharges" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                  Origin Surcharges
                </CardTitle>
                <CardDescription>Charges applied at the port of loading</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(SURCHARGES)
                    .filter(([_, surcharge]) => "origin" in surcharge && surcharge.origin > 0)
                    .map(([key, surcharge]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-600 dark:text-slate-400">{surcharge.name}</span>
                        <Badge variant="secondary">{formatCurrency(surcharge.origin, currency)}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#2E8B57]" />
                  Destination Surcharges
                </CardTitle>
                <CardDescription>Charges applied at the port of discharge</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(SURCHARGES)
                    .filter(([_, surcharge]) => "destination" in surcharge && surcharge.destination > 0)
                    .map(([key, surcharge]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-slate-600 dark:text-slate-400">{surcharge.name}</span>
                        <Badge variant="secondary">{formatCurrency(surcharge.destination, currency)}</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* BAF/CAF Explanation */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[#0F4C81]" />
                Understanding Freight Surcharges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-[#0F4C81]/10 rounded-lg">
                  <h5 className="font-semibold text-[#0F4C81] mb-2 flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    BAF (Bunker Adjustment Factor)
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    Compensates carriers for fluctuating fuel prices. Updated quarterly based on global fuel indices.
                    Currently averaging $700-$1,000 per container on major trade lanes.
                  </p>
                </div>
                <div className="p-4 bg-[#2E8B57]/10 rounded-lg">
                  <h5 className="font-semibold text-[#2E8B57] mb-2">CAF (Currency Adjustment Factor)</h5>
                  <p className="text-sm text-muted-foreground">
                    Adjusts for currency fluctuations between USD and other currencies. Typically 2-5% of base freight.
                    Higher on routes with volatile currency exposure.
                  </p>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-lg">
                  <h5 className="font-semibold text-amber-600 mb-2">PSS & GRI</h5>
                  <p className="text-sm text-muted-foreground">
                    Peak Season Surcharge (PSS) applies during high-demand periods. General Rate Increases (GRI) are
                    periodic adjustments by carriers to maintain profitability.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rate Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[#0F4C81]" />
                12-Month Rate Trends
              </CardTitle>
              <CardDescription>Historical freight rates for major trade lanes (per 40HC container)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={RATE_TRENDS}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="asiaEurope"
                      stroke={chartColors.ocean}
                      strokeWidth={2}
                      name="Asia-Europe"
                    />
                    <Line
                      type="monotone"
                      dataKey="asiaUsWc"
                      stroke={chartColors.logistics}
                      strokeWidth={2}
                      name="Asia-USWC"
                    />
                    <Line
                      type="monotone"
                      dataKey="asiaUsEc"
                      stroke={chartColors.secondary}
                      strokeWidth={2}
                      name="Asia-USEC"
                    />
                    <Line
                      type="monotone"
                      dataKey="transAtlantic"
                      stroke={chartColors.warning}
                      strokeWidth={2}
                      name="Trans-Atlantic"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              {/* Trend Summary */}
              <div className="mt-6 grid grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Asia-Europe YoY</p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-[#EF4444]" />
                    <span className="font-bold text-[#EF4444]">+42.4%</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Asia-USWC YoY</p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-[#EF4444]" />
                    <span className="font-bold text-[#EF4444]">+37.8%</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Asia-USEC YoY</p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-[#EF4444]" />
                    <span className="font-bold text-[#EF4444]">+32.1%</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground mb-1">Trans-Atlantic YoY</p>
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-4 w-4 text-[#EF4444]" />
                    <span className="font-bold text-[#EF4444]">+22.8%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6 mt-6">
          {/* Container Types Reference */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5 text-[#0F4C81]" />
                Container Types Reference
              </CardTitle>
              <CardDescription>Specifications and rate multipliers for container types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-center py-3 px-4">Length</th>
                      <th className="text-center py-3 px-4">Max Payload</th>
                      <th className="text-center py-3 px-4">Capacity</th>
                      <th className="text-center py-3 px-4">Rate Mult.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(CONTAINER_TYPES).map((ct) => (
                      <tr key={ct.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{ct.id}</td>
                        <td className="py-3 px-4 text-muted-foreground">{ct.description}</td>
                        <td className="py-3 px-4 text-center">{ct.length}&apos;</td>
                        <td className="py-3 px-4 text-center">{(ct.maxPayload / 1000).toFixed(1)}t</td>
                        <td className="py-3 px-4 text-center">{ct.cubicCapacity > 0 ? `${ct.cubicCapacity} CBM` : "OOG"}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline">{ct.rateMultiplier}x</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Trade Lanes Reference */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#2E8B57]" />
                Trade Lanes Reference
              </CardTitle>
              <CardDescription>Major trade routes with base rates and transit times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Trade Lane</th>
                      <th className="text-left py-3 px-4">Origin</th>
                      <th className="text-left py-3 px-4">Destination</th>
                      <th className="text-center py-3 px-4">Transit</th>
                      <th className="text-right py-3 px-4">20GP Rate</th>
                      <th className="text-right py-3 px-4">40HC Rate</th>
                      <th className="text-right py-3 px-4">BAF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(TRADE_LANES).map((lane) => (
                      <tr key={lane.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{lane.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{lane.origin}</td>
                        <td className="py-3 px-4 text-muted-foreground">{lane.destination}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline">{lane.transitDays} days</Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">{formatCurrency(lane.baseRate20GP, currency)}</td>
                        <td className="py-3 px-4 text-right font-mono">{formatCurrency(lane.baseRate40HC, currency)}</td>
                        <td className="py-3 px-4 text-right font-mono">{formatCurrency(lane.bafPerContainer, currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[#2E8B57]" />
                Rate Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <ArrowRight className="h-4 w-4 text-[#0F4C81] mt-1 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Book Early:</strong> Secure rates 4-6 weeks in advance to avoid peak
                    season surcharges.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <ArrowRight className="h-4 w-4 text-[#0F4C81] mt-1 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Compare Carriers:</strong> Rate differences of 10-15% are common
                    between carriers on the same route.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <ArrowRight className="h-4 w-4 text-[#0F4C81] mt-1 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Use Long-Term Contracts:</strong> Annual contracts can lock in
                    favorable rates and avoid spot market volatility.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <ArrowRight className="h-4 w-4 text-[#0F4C81] mt-1 shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Consider Alternative Ports:</strong> Nearby ports may offer lower
                    THC and congestion delays.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90">
          <Download className="h-4 w-4 mr-2" />
          Export Quote
        </Button>
      </div>
    </div>
  );
}

export default FreightRateCalculatorTool;
