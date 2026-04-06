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
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Ship,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  TrendingDown,
  MapPin,
  Route,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Globe,
  Anchor,
  Timer,
  Award,
  Zap,
  Target,
  Shield,
  Activity,
  ChevronRight,
  Info,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw,
  Waves,
  Container,
  Building2,
  Navigation,
} from "lucide-react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart,
  Pie,
} from "recharts";

// Shipping Lines Data
const SHIPPING_LINES = {
  MAERSK: {
    id: "MAERSK",
    name: "Maersk Line",
    code: "MSK",
    logo: "MAERSK",
    fleet: 708,
    teuCapacity: 4150000,
    region: "Global",
    headquarters: "Copenhagen, Denmark",
    established: 1904,
    alliance: "Gemini Cooperation",
    website: "maersk.com",
    description: "World's largest container shipping company with comprehensive global coverage.",
    specialties: ["Reefer", "Dangerous Goods", "Project Cargo", "E-commerce"],
  },
  MSC: {
    id: "MSC",
    name: "MSC",
    code: "MSC",
    logo: "MSC",
    fleet: 760,
    teuCapacity: 4800000,
    region: "Global",
    headquarters: "Geneva, Switzerland",
    established: 1970,
    alliance: "Independent",
    website: "msc.com",
    description: "Largest container shipping line by capacity with extensive global network.",
    specialties: ["Dry Cargo", "Reefer", "Breakbulk", "Liquid Bulk"],
  },
  CMA_CGM: {
    id: "CMA_CGM",
    name: "CMA CGM",
    code: "CMDU",
    logo: "CMA CGM",
    fleet: 566,
    teuCapacity: 3400000,
    region: "Global",
    headquarters: "Marseille, France",
    established: 1978,
    alliance: "Ocean Alliance",
    website: "cma-cgm.com",
    description: "French container shipping giant with strong Mediterranean presence.",
    specialties: ["Reefer", "Out of Gauge", "Hazardous Materials"],
  },
  COSCO: {
    id: "COSCO",
    name: "COSCO Shipping",
    code: "COS",
    logo: "COSCO",
    fleet: 507,
    teuCapacity: 2900000,
    region: "Global",
    headquarters: "Shanghai, China",
    established: 1961,
    alliance: "Ocean Alliance",
    website: "coscoshipping.com",
    description: "China's largest and world's fourth-largest container shipping company.",
    specialties: ["Dry Cargo", "Reefer", "Logistics Services"],
  },
  HAPAG: {
    id: "HAPAG",
    name: "Hapag-Lloyd",
    code: "HLCU",
    logo: "HAPAG",
    fleet: 260,
    teuCapacity: 2100000,
    region: "Global",
    headquarters: "Hamburg, Germany",
    established: 1847,
    alliance: "Gemini Cooperation",
    website: "hapag-lloyd.com",
    description: "Germany's leading shipping company with strong transatlantic presence.",
    specialties: ["Reefer", "Dangerous Goods", "Special Cargo"],
  },
  EVERGREEN: {
    id: "EVERGREEN",
    name: "Evergreen Line",
    code: "EGSU",
    logo: "EVERGREEN",
    fleet: 210,
    teuCapacity: 1650000,
    region: "Asia-Pacific",
    headquarters: "Taipei, Taiwan",
    established: 1968,
    alliance: "Ocean Alliance",
    website: "evergreen-line.com",
    description: "Taiwanese carrier known for reliability and trans-Pacific services.",
    specialties: ["Reefer", "Dry Cargo", "Logistics"],
  },
  ONE: {
    id: "ONE",
    name: "Ocean Network Express",
    code: "ONEY",
    logo: "ONE",
    fleet: 230,
    teuCapacity: 1600000,
    region: "Global",
    headquarters: "Singapore",
    established: 2017,
    alliance: "Ocean Alliance",
    website: "one-line.com",
    description: "Joint venture of Japanese carriers with modern fleet and technology.",
    specialties: ["Reefer", "Dangerous Goods", "Project Cargo"],
  },
  YANG_MING: {
    id: "YANG_MING",
    name: "Yang Ming",
    code: "YMLU",
    logo: "YML",
    fleet: 95,
    teuCapacity: 720000,
    region: "Asia-Pacific",
    headquarters: "Taipei, Taiwan",
    established: 1972,
    alliance: "THE Alliance",
    website: "yangming.com",
    description: "Taiwanese carrier with strong intra-Asia and trans-Pacific services.",
    specialties: ["Container Shipping", "Logistics"],
  },
  HMM: {
    id: "HMM",
    name: "HMM Co., Ltd.",
    code: "HMM",
    logo: "HMM",
    fleet: 78,
    teuCapacity: 820000,
    region: "Asia-Pacific",
    headquarters: "Seoul, South Korea",
    established: 1976,
    alliance: "Independent",
    website: "hmm21.com",
    description: "South Korea's largest container carrier with modern mega-vessels.",
    specialties: ["Trans-Pacific", "Asia-Europe", "Reefer"],
  },
  ZIM: {
    id: "ZIM",
    name: "ZIM Integrated Shipping",
    code: "ZIM",
    logo: "ZIM",
    fleet: 150,
    teuCapacity: 580000,
    region: "Global",
    headquarters: "Haifa, Israel",
    established: 1945,
    alliance: "Independent",
    website: "zim.com",
    description: "Israeli carrier with niche focus on select trade routes.",
    specialties: ["Trans-Pacific", "Mediterranean", "Specialized Cargo"],
  },
} as const;

// Service Routes
const SERVICE_ROUTES = [
  { id: "AE1", name: "Asia - Europe (North)", origin: "Shanghai", destination: "Rotterdam", frequency: "Weekly", carriers: ["MAERSK", "MSC", "CMA_CGM", "COSCO", "HAPAG", "EVERGREEN", "ONE", "YANG_MING", "HMM"] },
  { id: "AE2", name: "Asia - Europe (Mediterranean)", origin: "Shanghai", destination: "Genoa", frequency: "Weekly", carriers: ["MAERSK", "MSC", "CMA_CGM", "COSCO", "HAPAG", "EVERGREEN", "ONE", "ZIM"] },
  { id: "AW1", name: "Asia - US West Coast", origin: "Shanghai", destination: "Los Angeles", frequency: "Weekly", carriers: ["MAERSK", "MSC", "CMA_CGM", "COSCO", "HAPAG", "EVERGREEN", "ONE", "YANG_MING", "HMM", "ZIM"] },
  { id: "AE3", name: "Asia - US East Coast", origin: "Shanghai", destination: "New York", frequency: "Weekly", carriers: ["MAERSK", "MSC", "CMA_CGM", "COSCO", "HAPAG", "EVERGREEN", "ONE", "YANG_MING", "HMM", "ZIM"] },
  { id: "TA1", name: "Trans-Atlantic", origin: "Rotterdam", destination: "New York", frequency: "Weekly", carriers: ["MAERSK", "MSC", "CMA_CGM", "HAPAG", "ONE", "ZIM"] },
  { id: "IA1", name: "Intra-Asia", origin: "Shanghai", destination: "Singapore", frequency: "Daily", carriers: ["MAERSK", "MSC", "CMA_CGM", "COSCO", "EVERGREEN", "ONE", "YANG_MING", "HMM"] },
] as const;

// Performance Metrics
const PERFORMANCE_METRICS: Record<keyof typeof SHIPPING_LINES, {
  scheduleReliability: number;
  vesselOnTime: number;
  bookingAcceptance: number;
  documentationAccuracy: number;
  claimRatio: number;
  customerSatisfaction: number;
  digitalCapability: number;
  environmentalScore: number;
  overallScore: number;
  trend: "up" | "down" | "stable";
}> = {
  MAERSK: {
    scheduleReliability: 78.5,
    vesselOnTime: 82.3,
    bookingAcceptance: 91.2,
    documentationAccuracy: 96.8,
    claimRatio: 1.2,
    customerSatisfaction: 88,
    digitalCapability: 95,
    environmentalScore: 82,
    overallScore: 87.6,
    trend: "up",
  },
  MSC: {
    scheduleReliability: 72.1,
    vesselOnTime: 76.8,
    bookingAcceptance: 88.5,
    documentationAccuracy: 94.2,
    claimRatio: 1.8,
    customerSatisfaction: 82,
    digitalCapability: 78,
    environmentalScore: 75,
    overallScore: 82.1,
    trend: "stable",
  },
  CMA_CGM: {
    scheduleReliability: 75.8,
    vesselOnTime: 79.2,
    bookingAcceptance: 89.3,
    documentationAccuracy: 95.1,
    claimRatio: 1.5,
    customerSatisfaction: 85,
    digitalCapability: 88,
    environmentalScore: 79,
    overallScore: 84.3,
    trend: "up",
  },
  COSCO: {
    scheduleReliability: 74.2,
    vesselOnTime: 77.5,
    bookingAcceptance: 87.8,
    documentationAccuracy: 93.5,
    claimRatio: 1.6,
    customerSatisfaction: 80,
    digitalCapability: 82,
    environmentalScore: 76,
    overallScore: 81.9,
    trend: "up",
  },
  HAPAG: {
    scheduleReliability: 81.2,
    vesselOnTime: 84.6,
    bookingAcceptance: 92.1,
    documentationAccuracy: 97.2,
    claimRatio: 0.9,
    customerSatisfaction: 90,
    digitalCapability: 92,
    environmentalScore: 85,
    overallScore: 89.4,
    trend: "up",
  },
  EVERGREEN: {
    scheduleReliability: 76.5,
    vesselOnTime: 80.1,
    bookingAcceptance: 90.5,
    documentationAccuracy: 95.8,
    claimRatio: 1.3,
    customerSatisfaction: 86,
    digitalCapability: 80,
    environmentalScore: 81,
    overallScore: 85.8,
    trend: "stable",
  },
  ONE: {
    scheduleReliability: 79.8,
    vesselOnTime: 83.2,
    bookingAcceptance: 91.8,
    documentationAccuracy: 96.5,
    claimRatio: 1.1,
    customerSatisfaction: 89,
    digitalCapability: 90,
    environmentalScore: 83,
    overallScore: 88.2,
    trend: "up",
  },
  YANG_MING: {
    scheduleReliability: 71.3,
    vesselOnTime: 74.8,
    bookingAcceptance: 86.2,
    documentationAccuracy: 92.8,
    claimRatio: 2.1,
    customerSatisfaction: 78,
    digitalCapability: 75,
    environmentalScore: 72,
    overallScore: 79.2,
    trend: "down",
  },
  HMM: {
    scheduleReliability: 77.9,
    vesselOnTime: 81.5,
    bookingAcceptance: 89.7,
    documentationAccuracy: 95.3,
    claimRatio: 1.4,
    customerSatisfaction: 84,
    digitalCapability: 85,
    environmentalScore: 80,
    overallScore: 86.1,
    trend: "up",
  },
  ZIM: {
    scheduleReliability: 69.5,
    vesselOnTime: 73.2,
    bookingAcceptance: 85.8,
    documentationAccuracy: 91.5,
    claimRatio: 2.4,
    customerSatisfaction: 76,
    digitalCapability: 88,
    environmentalScore: 70,
    overallScore: 77.8,
    trend: "down",
  },
};

// Transit Times (days)
const TRANSIT_TIMES: Record<keyof typeof SHIPPING_LINES, Record<string, number>> = {
  MAERSK: { AE1: 32, AE2: 28, AW1: 14, AE3: 32, TA1: 12, IA1: 7 },
  MSC: { AE1: 34, AE2: 30, AW1: 15, AE3: 34, TA1: 13, IA1: 8 },
  CMA_CGM: { AE1: 31, AE2: 27, AW1: 14, AE3: 31, TA1: 11, IA1: 7 },
  COSCO: { AE1: 30, AE2: 26, AW1: 13, AE3: 30, TA1: 12, IA1: 6 },
  HAPAG: { AE1: 33, AE2: 29, AW1: 15, AE3: 33, TA1: 10, IA1: 8 },
  EVERGREEN: { AE1: 32, AE2: 28, AW1: 14, AE3: 32, TA1: 12, IA1: 6 },
  ONE: { AE1: 31, AE2: 27, AW1: 14, AE3: 31, TA1: 11, IA1: 7 },
  YANG_MING: { AE1: 34, AE2: 30, AW1: 16, AE3: 35, IA1: 8 },
  HMM: { AE1: 32, AE2: 28, AW1: 13, AE3: 32, IA1: 7 },
  ZIM: { AE2: 29, AW1: 14, AE3: 33, TA1: 12 },
};

// Pricing Data ($/TEU)
const PRICING_DATA: Record<keyof typeof SHIPPING_LINES, Record<string, { base: number; peak: number; offPeak: number }>> = {
  MAERSK: { AE1: { base: 1850, peak: 2800, offPeak: 1500 }, AE2: { base: 2100, peak: 3200, offPeak: 1700 }, AW1: { base: 2200, peak: 3500, offPeak: 1800 }, AE3: { base: 3200, peak: 4800, offPeak: 2600 }, TA1: { base: 1600, peak: 2400, offPeak: 1300 }, IA1: { base: 450, peak: 650, offPeak: 350 } },
  MSC: { AE1: { base: 1750, peak: 2700, offPeak: 1400 }, AE2: { base: 2000, peak: 3100, offPeak: 1600 }, AW1: { base: 2100, peak: 3400, offPeak: 1700 }, AE3: { base: 3100, peak: 4700, offPeak: 2500 }, TA1: { base: 1550, peak: 2350, offPeak: 1250 }, IA1: { base: 400, peak: 600, offPeak: 300 } },
  CMA_CGM: { AE1: { base: 1800, peak: 2750, offPeak: 1450 }, AE2: { base: 2050, peak: 3150, offPeak: 1650 }, AW1: { base: 2150, peak: 3450, offPeak: 1750 }, AE3: { base: 3150, peak: 4750, offPeak: 2550 }, TA1: { base: 1580, peak: 2380, offPeak: 1280 }, IA1: { base: 420, peak: 620, offPeak: 320 } },
  COSCO: { AE1: { base: 1700, peak: 2600, offPeak: 1350 }, AE2: { base: 1950, peak: 3000, offPeak: 1550 }, AW1: { base: 2050, peak: 3300, offPeak: 1650 }, AE3: { base: 3050, peak: 4600, offPeak: 2450 }, TA1: { base: 1500, peak: 2300, offPeak: 1200 }, IA1: { base: 380, peak: 580, offPeak: 280 } },
  HAPAG: { AE1: { base: 1900, peak: 2900, offPeak: 1550 }, AE2: { base: 2150, peak: 3250, offPeak: 1750 }, AW1: { base: 2250, peak: 3600, offPeak: 1850 }, AE3: { base: 3250, peak: 4900, offPeak: 2650 }, TA1: { base: 1650, peak: 2450, offPeak: 1350 }, IA1: { base: 480, peak: 680, offPeak: 380 } },
  EVERGREEN: { AE1: { base: 1820, peak: 2780, offPeak: 1480 }, AE2: { base: 2080, peak: 3180, offPeak: 1680 }, AW1: { base: 2180, peak: 3480, offPeak: 1780 }, AE3: { base: 3180, peak: 4780, offPeak: 2580 }, TA1: { base: 1600, peak: 2400, offPeak: 1300 }, IA1: { base: 400, peak: 600, offPeak: 300 } },
  ONE: { AE1: { base: 1830, peak: 2800, offPeak: 1490 }, AE2: { base: 2100, peak: 3200, offPeak: 1700 }, AW1: { base: 2200, peak: 3500, offPeak: 1800 }, AE3: { base: 3200, peak: 4800, offPeak: 2600 }, TA1: { base: 1620, peak: 2420, offPeak: 1320 }, IA1: { base: 410, peak: 610, offPeak: 310 } },
  YANG_MING: { AE1: { base: 1780, peak: 2700, offPeak: 1400 }, AE2: { base: 2000, peak: 3100, offPeak: 1600 }, AW1: { base: 2100, peak: 3400, offPeak: 1700 }, AE3: { base: 3100, peak: 4700, offPeak: 2500 }, IA1: { base: 390, peak: 590, offPeak: 290 } },
  HMM: { AE1: { base: 1760, peak: 2680, offPeak: 1380 }, AE2: { base: 1980, peak: 3050, offPeak: 1580 }, AW1: { base: 2080, peak: 3350, offPeak: 1680 }, AE3: { base: 3080, peak: 4650, offPeak: 2480 }, IA1: { base: 385, peak: 585, offPeak: 285 } },
  ZIM: { AE2: { base: 1920, peak: 2950, offPeak: 1520 }, AW1: { base: 2050, peak: 3300, offPeak: 1650 }, AE3: { base: 3020, peak: 4580, offPeak: 2420 }, TA1: { base: 1480, peak: 2280, offPeak: 1180 } },
};

// Vessel Schedule Data
const VESSEL_SCHEDULES: Record<keyof typeof SHIPPING_LINES, { vessels: string[]; avgAge: number; megaVessels: number }> = {
  MAERSK: { vessels: ["Maersk Mc-Kinney Moller", "Maersk Edmonton", "Maersk Eindhoven", "Maersk Edmonton"], avgAge: 8.5, megaVessels: 25 },
  MSC: { vessels: ["MSC Gülsün", "MSC Gerd", "MSC Amrita", "MSC Leyla"], avgAge: 10.2, megaVessels: 32 },
  CMA_CGM: { vessels: ["CMA CGM Jacques Saadé", "CMA CGM Antoine de Saint Exupéry", "CMA CGM Jean Mermoz"], avgAge: 7.8, megaVessels: 18 },
  COSCO: { vessels: ["COSCO Shipping Universe", "COSCO Shipping Galaxy", "COSCO Shipping Venus"], avgAge: 6.5, megaVessels: 22 },
  HAPAG: { vessels: ["Hamburg Express", "Al Qibla Express", "Dubai Express"], avgAge: 9.1, megaVessels: 15 },
  EVERGREEN: { vessels: ["Ever Ace", "Ever Act", "Ever Aim", "Ever Alot"], avgAge: 7.2, megaVessels: 12 },
  ONE: { vessels: ["ONE Trust", "ONE Commitment", "ONE Respect"], avgAge: 6.8, megaVessels: 14 },
  YANG_MING: { vessels: ["YM Warranty", "YM Wellbeing", "YM Wonderland"], avgAge: 11.5, megaVessels: 0 },
  HMM: { vessels: ["HMM Algeciras", "HMM Copenhagen", "HMM Oslo"], avgAge: 4.5, megaVessels: 12 },
  ZIM: { vessels: ["ZIM Kingston", "ZIM Charleston", "ZIM Tarragona"], avgAge: 12.3, megaVessels: 0 },
};

// Helper functions
const getRatingColor = (score: number): string => {
  if (score >= 90) return "#2E8B57"; // Logistics Green - Excellent
  if (score >= 80) return "#0F4C81"; // Ocean Blue - Good
  if (score >= 70) return "#F59E0B"; // Warning - Average
  if (score >= 60) return "#EF4444"; // Danger - Below Average
  return "#DC2626"; // Critical - Poor
};

const getRatingLabel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Average";
  if (score >= 60) return "Below Average";
  return "Poor";
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up": return <ArrowUpRight className="h-4 w-4 text-[#2E8B57]" />;
    case "down": return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    default: return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

const chartColors = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  secondary: "#6366F1",
};

interface ShippingLineSelectorProps {
  onLineSelect?: (lineId: string) => void;
}

export function ShippingLineSelector({ onLineSelect }: ShippingLineSelectorProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoute, setSelectedRoute] = useState<string>("AE1");
  const [containerType, setContainerType] = useState<"20GP" | "40GP" | "40HC">("40GP");
  const [containerCount, setContainerCount] = useState<number>(1);
  const [season, setSeason] = useState<"peak" | "offPeak" | "base">("base");
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  // Get carriers for selected route
  const availableLines = useMemo(() => {
    const route = SERVICE_ROUTES.find(r => r.id === selectedRoute);
    if (!route) return [];
    return route.carriers.map(carrierId => ({
      id: carrierId,
      ...SHIPPING_LINES[carrierId as keyof typeof SHIPPING_LINES],
      performance: PERFORMANCE_METRICS[carrierId as keyof typeof SHIPPING_LINES],
      transitTime: TRANSIT_TIMES[carrierId as keyof typeof SHIPPING_LINES]?.[selectedRoute] || 0,
      pricing: PRICING_DATA[carrierId as keyof typeof SHIPPING_LINES]?.[selectedRoute] || { base: 0, peak: 0, offPeak: 0 },
      schedule: VESSEL_SCHEDULES[carrierId as keyof typeof SHIPPING_LINES],
    }));
  }, [selectedRoute]);

  // Comparison data
  const comparisonData = useMemo(() => {
    return availableLines.map(line => ({
      name: line.code,
      "Reliability": line.performance.scheduleReliability,
      "On-Time": line.performance.vesselOnTime,
      "Satisfaction": line.performance.customerSatisfaction,
      "Digital": line.performance.digitalCapability,
    }));
  }, [availableLines]);

  // Pricing chart data
  const pricingChartData = useMemo(() => {
    return availableLines.map(line => ({
      name: line.code,
      "Base Rate": line.pricing.base,
      "Peak Season": line.pricing.peak,
      "Off-Peak": line.pricing.offPeak,
    }));
  }, [availableLines]);

  // Radar data for selected line
  const radarData = useMemo(() => {
    if (!selectedLine) return null;
    const line = availableLines.find(l => l.id === selectedLine);
    if (!line) return null;
    return [
      { metric: "Reliability", value: line.performance.scheduleReliability, fullMark: 100 },
      { metric: "On-Time", value: line.performance.vesselOnTime, fullMark: 100 },
      { metric: "Service", value: line.performance.customerSatisfaction, fullMark: 100 },
      { metric: "Digital", value: line.performance.digitalCapability, fullMark: 100 },
      { metric: "Eco Score", value: line.performance.environmentalScore, fullMark: 100 },
    ];
  }, [selectedLine, availableLines]);

  // Container multiplier
  const containerMultiplier = containerType === "40HC" ? 1.1 : containerType === "40GP" ? 1.0 : 0.6;

  const selectedRouteInfo = SERVICE_ROUTES.find(r => r.id === selectedRoute);
  const selectedLineData = selectedLine ? availableLines.find(l => l.id === selectedLine) : null;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Search Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-[#0F4C81]" />
                Route Selection
              </CardTitle>
              <CardDescription>Select your shipping route and requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label>Service Route</Label>
                  <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_ROUTES.map((route) => (
                        <SelectItem key={route.id} value={route.id}>
                          <div className="flex items-center gap-2">
                            <Navigation className="h-4 w-4" />
                            {route.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Container Type</Label>
                  <Select value={containerType} onValueChange={(v) => setContainerType(v as typeof containerType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20GP">20&apos; GP</SelectItem>
                      <SelectItem value="40GP">40&apos; GP</SelectItem>
                      <SelectItem value="40HC">40&apos; HC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Containers</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={containerCount}
                    onChange={(e) => setContainerCount(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div>
                  <Label>Season</Label>
                  <Select value={season} onValueChange={(v) => setSeason(v as typeof season)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base">Standard Season</SelectItem>
                      <SelectItem value="peak">Peak Season (Aug-Oct)</SelectItem>
                      <SelectItem value="offPeak">Off-Peak Season</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedRouteInfo && (
                <div className="p-4 bg-[#0F4C81]/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Waves className="h-5 w-5 text-[#0F4C81]" />
                    <span className="font-medium text-[#0F4C81]">Selected Route</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium">{selectedRouteInfo.origin}</span>
                    <ChevronRight className="h-4 w-4 text-[#2E8B57]" />
                    <span className="font-medium">{selectedRouteInfo.destination}</span>
                    <Badge variant="outline" className="ml-2">{selectedRouteInfo.frequency}</Badge>
                    <Badge variant="outline" className="ml-1">{availableLines.length} carriers</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Shipping Lines Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLines.map((line) => (
              <Card 
                key={line.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedLine === line.id ? 'border-[#0F4C81] ring-2 ring-[#0F4C81]/20' : ''}`}
                onClick={() => {
                  setSelectedLine(line.id);
                  onLineSelect?.(line.id);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-[#0F4C81] flex items-center justify-center text-white font-bold text-xs">
                        {line.code}
                      </div>
                      <div>
                        <h3 className="font-semibold">{line.name}</h3>
                        <p className="text-xs text-muted-foreground">{line.alliance}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(line.performance.trend)}
                      <span 
                        className="text-lg font-bold"
                        style={{ color: getRatingColor(line.performance.overallScore) }}
                      >
                        {line.performance.overallScore.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-xs text-muted-foreground">Transit Time</p>
                      <p className="font-semibold">{line.transitTime} days</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-xs text-muted-foreground">Est. Rate</p>
                      <p className="font-semibold text-[#0F4C81]">
                        ${Math.round(line.pricing[season] * containerMultiplier).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Schedule Reliability</span>
                      <span className="font-medium">{line.performance.scheduleReliability}%</span>
                    </div>
                    <Progress value={line.performance.scheduleReliability} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">On-Time Performance</span>
                      <span className="font-medium">{line.performance.vesselOnTime}%</span>
                    </div>
                    <Progress value={line.performance.vesselOnTime} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {line.specialties.slice(0, 3).map((spec, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{spec}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                Carrier Performance Comparison
              </CardTitle>
              <CardDescription>Compare key performance metrics across carriers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Carrier</th>
                      <th className="text-center p-3">Overall Score</th>
                      <th className="text-center p-3">Reliability</th>
                      <th className="text-center p-3">On-Time</th>
                      <th className="text-center p-3">Transit</th>
                      <th className="text-center p-3">Rate</th>
                      <th className="text-center p-3">Fleet</th>
                      <th className="text-center p-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableLines.map((line, index) => (
                      <tr 
                        key={line.id}
                        className={`border-b hover:bg-muted/50 cursor-pointer transition-colors ${index === 0 ? 'bg-[#2E8B57]/10' : ''}`}
                        onClick={() => setSelectedLine(line.id)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {index === 0 && (
                              <div className="w-6 h-6 rounded-full bg-[#2E8B57] flex items-center justify-center">
                                <Star className="h-3 w-3 text-white" />
                              </div>
                            )}
                            <div className="w-10 h-10 rounded bg-[#0F4C81] flex items-center justify-center text-white font-bold text-xs">
                              {line.code}
                            </div>
                            <div>
                              <p className="font-medium">{line.name}</p>
                              <p className="text-xs text-muted-foreground">{line.alliance}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <span 
                            className="text-lg font-bold"
                            style={{ color: getRatingColor(line.performance.overallScore) }}
                          >
                            {line.performance.overallScore.toFixed(1)}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Badge style={{ backgroundColor: getRatingColor(line.performance.scheduleReliability), color: 'white' }}>
                            {line.performance.scheduleReliability}%
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge style={{ backgroundColor: getRatingColor(line.performance.vesselOnTime), color: 'white' }}>
                            {line.performance.vesselOnTime}%
                          </Badge>
                        </td>
                        <td className="p-3 text-center font-medium">{line.transitTime} days</td>
                        <td className="p-3 text-center font-medium text-[#0F4C81]">
                          ${Math.round(line.pricing[season] * containerMultiplier).toLocaleString()}
                        </td>
                        <td className="p-3 text-center">{line.fleet}</td>
                        <td className="p-3 text-center">{getTrendIcon(line.performance.trend)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={comparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={50} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Reliability" fill={chartColors.ocean} />
                      <Bar dataKey="On-Time" fill={chartColors.logistics} />
                      <Bar dataKey="Satisfaction" fill={chartColors.warning} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {radarData && selectedLineData && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedLineData.name} - Performance Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                          name={selectedLineData.name}
                          dataKey="value"
                          stroke={chartColors.ocean}
                          fill={chartColors.ocean}
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#0F4C81]" />
                  Seasonal Pricing Comparison
                </CardTitle>
                <CardDescription>Rate variations across seasons</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={pricingChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="Base Rate" fill={chartColors.ocean} />
                      <Bar dataKey="Peak Season" fill={chartColors.danger} />
                      <Bar dataKey="Off-Peak" fill={chartColors.logistics} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Shipment Cost</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLineData && (
                  <>
                    <div className="p-4 bg-[#0F4C81]/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Selected Carrier</p>
                      <p className="text-lg font-bold">{selectedLineData.name}</p>
                      <p className="text-3xl font-bold text-[#0F4C81]">
                        ${Math.round(selectedLineData.pricing[season] * containerMultiplier * containerCount).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {containerCount} x {containerType} containers
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Base Rate</span>
                        <span>${Math.round(selectedLineData.pricing[season] * containerMultiplier)}/TEU</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Season Adjustment</span>
                        <span className={season === "peak" ? "text-red-500" : season === "offPeak" ? "text-[#2E8B57]" : ""}>
                          {season === "peak" ? "+52%" : season === "offPeak" ? "-19%" : "Base"}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total Estimated</span>
                        <span className="text-[#0F4C81]">
                          ${Math.round(selectedLineData.pricing[season] * containerMultiplier * containerCount).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        * Excludes origin/destination charges, BAF, CAF, and other surcharges
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transit Time Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#2E8B57]" />
                Transit Time Analysis
              </CardTitle>
              <CardDescription>Compare delivery speeds across carriers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={availableLines.map(l => ({ name: l.code, "Transit Days": l.transitTime }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="Transit Days" fill={chartColors.ocean}>
                      {availableLines.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? chartColors.logistics : chartColors.ocean} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-[#0F4C81]" />
                  Vessel Fleet Overview
                </CardTitle>
                <CardDescription>Fleet composition and capacity by carrier</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {availableLines.map((line) => (
                      <div key={line.id} className="p-4 border rounded-lg hover:border-[#0F4C81]/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-[#0F4C81] flex items-center justify-center text-white font-bold text-xs">
                              {line.code}
                            </div>
                            <div>
                              <p className="font-semibold">{line.name}</p>
                              <p className="text-xs text-muted-foreground">{line.fleet} vessels</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-[#0F4C81]">{(line.teuCapacity / 1000000).toFixed(1)}M</p>
                            <p className="text-xs text-muted-foreground">TEU Capacity</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-muted-foreground">Fleet Size</p>
                            <p className="font-medium">{line.fleet} vessels</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Avg. Vessel Age</p>
                            <p className="font-medium">{line.schedule.avgAge} years</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Mega Vessels</p>
                            <p className="font-medium">{line.schedule.megaVessels} (20k+ TEU)</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {line.schedule.vessels.map((vessel, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              <Anchor className="h-3 w-3 mr-1" />
                              {vessel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Route Map Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[#2E8B57]" />
                  Service Route
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRouteInfo && (
                  <>
                    <div className="p-4 bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-center">
                          <MapPin className="h-6 w-6 mx-auto mb-1 text-[#0F4C81]" />
                          <p className="font-semibold">{selectedRouteInfo.origin}</p>
                          <p className="text-xs text-muted-foreground">Origin</p>
                        </div>
                        <div className="flex-1 px-4">
                          <div className="border-t-2 border-dashed border-[#0F4C81]/30 relative">
                            <Waves className="h-4 w-4 absolute left-1/2 -translate-x-1/2 -top-2 text-[#0F4C81]" />
                          </div>
                        </div>
                        <div className="text-center">
                          <MapPin className="h-6 w-6 mx-auto mb-1 text-[#2E8B57]" />
                          <p className="font-semibold">{selectedRouteInfo.destination}</p>
                          <p className="text-xs text-muted-foreground">Destination</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Route ID</span>
                        <span className="font-medium">{selectedRouteInfo.id}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Frequency</span>
                        <span className="font-medium">{selectedRouteInfo.frequency}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available Carriers</span>
                        <span className="font-medium">{selectedRouteInfo.carriers.length}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium mb-2">Average Transit Times</p>
                      <div className="space-y-2">
                        {availableLines.slice(0, 3).map((line) => (
                          <div key={line.id} className="flex justify-between text-sm">
                            <span>{line.name}</span>
                            <span className="font-medium">{line.transitTime} days</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-6 mt-6">
          {/* Service Quality Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: "Avg. Schedule Reliability", value: `${(availableLines.reduce((sum, l) => sum + l.performance.scheduleReliability, 0) / availableLines.length).toFixed(1)}%`, icon: Clock, color: "#0F4C81" },
              { label: "Avg. On-Time Performance", value: `${(availableLines.reduce((sum, l) => sum + l.performance.vesselOnTime, 0) / availableLines.length).toFixed(1)}%`, icon: Timer, color: "#2E8B57" },
              { label: "Avg. Customer Satisfaction", value: `${(availableLines.reduce((sum, l) => sum + l.performance.customerSatisfaction, 0) / availableLines.length).toFixed(0)}%`, icon: Star, color: "#F59E0B" },
              { label: "Avg. Digital Score", value: `${(availableLines.reduce((sum, l) => sum + l.performance.digitalCapability, 0) / availableLines.length).toFixed(0)}%`, icon: Zap, color: "#6366F1" },
            ].map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                      <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Quality Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#0F4C81]" />
                Service Quality Metrics
              </CardTitle>
              <CardDescription>Detailed performance breakdown by carrier</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {availableLines.map((line) => (
                    <div key={line.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-[#0F4C81] flex items-center justify-center text-white font-bold text-xs">
                            {line.code}
                          </div>
                          <div>
                            <p className="font-semibold">{line.name}</p>
                            <p className="text-xs text-muted-foreground">{line.region}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span 
                            className="text-lg font-bold"
                            style={{ color: getRatingColor(line.performance.overallScore) }}
                          >
                            {line.performance.overallScore.toFixed(0)}
                          </span>
                          <Badge style={{ backgroundColor: getRatingColor(line.performance.overallScore), color: 'white' }}>
                            {getRatingLabel(line.performance.overallScore)}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Schedule Reliability</span>
                            <span className="font-medium">{line.performance.scheduleReliability}%</span>
                          </div>
                          <Progress value={line.performance.scheduleReliability} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">On-Time Performance</span>
                            <span className="font-medium">{line.performance.vesselOnTime}%</span>
                          </div>
                          <Progress value={line.performance.vesselOnTime} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Customer Satisfaction</span>
                            <span className="font-medium">{line.performance.customerSatisfaction}%</span>
                          </div>
                          <Progress value={line.performance.customerSatisfaction} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Digital Capability</span>
                            <span className="font-medium">{line.performance.digitalCapability}%</span>
                          </div>
                          <Progress value={line.performance.digitalCapability} className="h-2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                          <span>Booking: {line.performance.bookingAcceptance}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                          <span>Docs: {line.performance.documentationAccuracy}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {line.performance.claimRatio <= 1.5 ? (
                            <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                          <span>Claims: {line.performance.claimRatio}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-muted-foreground">Environmental Score:</span>
                        <Progress value={line.performance.environmentalScore} className="h-2 w-24" />
                        <span className="text-xs font-medium">{line.performance.environmentalScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quality Indicators Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quality Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                    Performance Thresholds
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#2E8B57]" />
                      Excellent (90+): Industry leading performance
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#0F4C81]" />
                      Good (80-89): Above average reliability
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                      Average (70-79): Acceptable performance
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                      Below Average (60-69): Needs improvement
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-[#0F4C81]" />
                    Metric Definitions
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Schedule Reliability:</strong> % of voyages arriving within 24h of schedule</li>
                    <li><strong>On-Time Performance:</strong> % of vessels departing on schedule</li>
                    <li><strong>Claim Ratio:</strong> Cargo claims per 1,000 TEU transported</li>
                    <li><strong>Digital Capability:</strong> Online booking, tracking, and documentation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
