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
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Globe,
  Plane,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Scale,
  DollarSign,
  TrendingUp,
  Package,
  Fuel,
  Shield,
  Zap,
  BookOpen,
  HelpCircle,
  Sparkles,
  BarChart3,
  ArrowUpDown,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand Colors
const BRAND_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  secondary: "#6366F1",
  light: "#E8F4FD",
};

// IATA Traffic Conference Areas
const IATA_AREAS = {
  TC1: {
    name: "Traffic Conference Area 1",
    description: "Western Hemisphere",
    color: BRAND_COLORS.ocean,
    subRegions: {
      NORTH_AMERICA: { name: "North America", countries: ["US", "CA", "MX"] },
      CENTRAL_AMERICA: { name: "Central America", countries: ["GT", "BZ", "HN", "SV", "NI", "CR", "PA"] },
      CARIBBEAN: { name: "Caribbean", countries: ["CU", "JM", "HT", "DO", "PR", "BS", "BB", "TT", "AW"] },
      SOUTH_AMERICA: { name: "South America", countries: ["BR", "AR", "CL", "CO", "PE", "VE", "EC", "BO", "PY", "UY", "GY", "SR"] },
    },
  },
  TC2: {
    name: "Traffic Conference Area 2",
    description: "Europe, Middle East & Africa",
    color: BRAND_COLORS.logistics,
    subRegions: {
      EUROPE: { name: "Europe", countries: ["GB", "DE", "FR", "IT", "ES", "NL", "BE", "CH", "AT", "SE", "NO", "DK", "FI", "PL", "PT", "GR", "IE", "CZ", "HU", "RO"] },
      MIDDLE_EAST: { name: "Middle East", countries: ["AE", "SA", "IL", "JO", "LB", "SY", "IQ", "KW", "QA", "BH", "OM", "YE"] },
      AFRICA: { name: "Africa", countries: ["ZA", "EG", "NG", "KE", "MA", "TN", "ET", "GH", "CI", "TZ", "UG", "SN", "CM", "AO", "MZ"] },
    },
  },
  TC3: {
    name: "Traffic Conference Area 3",
    description: "Asia, Oceania & Pacific",
    color: BRAND_COLORS.warning,
    subRegions: {
      EAST_ASIA: { name: "East Asia", countries: ["CN", "JP", "KR", "TW", "HK", "MO", "MN"] },
      SOUTHEAST_ASIA: { name: "Southeast Asia", countries: ["SG", "TH", "MY", "ID", "VN", "PH", "MM", "KH", "LA"] },
      SOUTH_ASIA: { name: "South Asia", countries: ["IN", "PK", "BD", "LK", "NP", "BT", "MV"] },
      OCEANIA: { name: "Oceania", countries: ["AU", "NZ", "PG", "FJ", "NC", "PF", "WS", "TO", "VU"] },
    },
  },
};

// Country to IATA Area mapping
const COUNTRY_TO_AREA: Record<string, { area: string; subRegion: string; name: string }> = {
  // TC1 - North America
  US: { area: "TC1", subRegion: "NORTH_AMERICA", name: "United States" },
  CA: { area: "TC1", subRegion: "NORTH_AMERICA", name: "Canada" },
  MX: { area: "TC1", subRegion: "NORTH_AMERICA", name: "Mexico" },
  // TC1 - Central America
  GT: { area: "TC1", subRegion: "CENTRAL_AMERICA", name: "Guatemala" },
  BZ: { area: "TC1", subRegion: "CENTRAL_AMERICA", name: "Belize" },
  HN: { area: "TC1", subRegion: "CENTRAL_AMERICA", name: "Honduras" },
  SV: { area: "TC1", subRegion: "CENTRAL_AMERICA", name: "El Salvador" },
  NI: { area: "TC1", subRegion: "CENTRAL_AMERICA", name: "Nicaragua" },
  CR: { area: "TC1", subRegion: "CENTRAL_AMERICA", name: "Costa Rica" },
  PA: { area: "TC1", subRegion: "CENTRAL_AMERICA", name: "Panama" },
  // TC1 - Caribbean
  CU: { area: "TC1", subRegion: "CARIBBEAN", name: "Cuba" },
  JM: { area: "TC1", subRegion: "CARIBBEAN", name: "Jamaica" },
  HT: { area: "TC1", subRegion: "CARIBBEAN", name: "Haiti" },
  DO: { area: "TC1", subRegion: "CARIBBEAN", name: "Dominican Republic" },
  PR: { area: "TC1", subRegion: "CARIBBEAN", name: "Puerto Rico" },
  BS: { area: "TC1", subRegion: "CARIBBEAN", name: "Bahamas" },
  BB: { area: "TC1", subRegion: "CARIBBEAN", name: "Barbados" },
  TT: { area: "TC1", subRegion: "CARIBBEAN", name: "Trinidad & Tobago" },
  // TC1 - South America
  BR: { area: "TC1", subRegion: "SOUTH_AMERICA", name: "Brazil" },
  AR: { area: "TC1", subRegion: "SOUTH_AMERICA", name: "Argentina" },
  CL: { area: "TC1", subRegion: "SOUTH_AMERICA", name: "Chile" },
  CO: { area: "TC1", subRegion: "SOUTH_AMERICA", name: "Colombia" },
  PE: { area: "TC1", subRegion: "SOUTH_AMERICA", name: "Peru" },
  VE: { area: "TC1", subRegion: "SOUTH_AMERICA", name: "Venezuela" },
  EC: { area: "TC1", subRegion: "SOUTH_AMERICA", name: "Ecuador" },
  // TC2 - Europe
  GB: { area: "TC2", subRegion: "EUROPE", name: "United Kingdom" },
  DE: { area: "TC2", subRegion: "EUROPE", name: "Germany" },
  FR: { area: "TC2", subRegion: "EUROPE", name: "France" },
  IT: { area: "TC2", subRegion: "EUROPE", name: "Italy" },
  ES: { area: "TC2", subRegion: "EUROPE", name: "Spain" },
  NL: { area: "TC2", subRegion: "EUROPE", name: "Netherlands" },
  BE: { area: "TC2", subRegion: "EUROPE", name: "Belgium" },
  CH: { area: "TC2", subRegion: "EUROPE", name: "Switzerland" },
  AT: { area: "TC2", subRegion: "EUROPE", name: "Austria" },
  SE: { area: "TC2", subRegion: "EUROPE", name: "Sweden" },
  NO: { area: "TC2", subRegion: "EUROPE", name: "Norway" },
  DK: { area: "TC2", subRegion: "EUROPE", name: "Denmark" },
  FI: { area: "TC2", subRegion: "EUROPE", name: "Finland" },
  PL: { area: "TC2", subRegion: "EUROPE", name: "Poland" },
  PT: { area: "TC2", subRegion: "EUROPE", name: "Portugal" },
  GR: { area: "TC2", subRegion: "EUROPE", name: "Greece" },
  IE: { area: "TC2", subRegion: "EUROPE", name: "Ireland" },
  CZ: { area: "TC2", subRegion: "EUROPE", name: "Czech Republic" },
  // TC2 - Middle East
  AE: { area: "TC2", subRegion: "MIDDLE_EAST", name: "UAE" },
  SA: { area: "TC2", subRegion: "MIDDLE_EAST", name: "Saudi Arabia" },
  IL: { area: "TC2", subRegion: "MIDDLE_EAST", name: "Israel" },
  JO: { area: "TC2", subRegion: "MIDDLE_EAST", name: "Jordan" },
  LB: { area: "TC2", subRegion: "MIDDLE_EAST", name: "Lebanon" },
  KW: { area: "TC2", subRegion: "MIDDLE_EAST", name: "Kuwait" },
  QA: { area: "TC2", subRegion: "MIDDLE_EAST", name: "Qatar" },
  BH: { area: "TC2", subRegion: "MIDDLE_EAST", name: "Bahrain" },
  OM: { area: "TC2", subRegion: "MIDDLE_EAST", name: "Oman" },
  // TC2 - Africa
  ZA: { area: "TC2", subRegion: "AFRICA", name: "South Africa" },
  EG: { area: "TC2", subRegion: "AFRICA", name: "Egypt" },
  NG: { area: "TC2", subRegion: "AFRICA", name: "Nigeria" },
  KE: { area: "TC2", subRegion: "AFRICA", name: "Kenya" },
  MA: { area: "TC2", subRegion: "AFRICA", name: "Morocco" },
  TN: { area: "TC2", subRegion: "AFRICA", name: "Tunisia" },
  ET: { area: "TC2", subRegion: "AFRICA", name: "Ethiopia" },
  GH: { area: "TC2", subRegion: "AFRICA", name: "Ghana" },
  // TC3 - East Asia
  CN: { area: "TC3", subRegion: "EAST_ASIA", name: "China" },
  JP: { area: "TC3", subRegion: "EAST_ASIA", name: "Japan" },
  KR: { area: "TC3", subRegion: "EAST_ASIA", name: "South Korea" },
  TW: { area: "TC3", subRegion: "EAST_ASIA", name: "Taiwan" },
  HK: { area: "TC3", subRegion: "EAST_ASIA", name: "Hong Kong" },
  MO: { area: "TC3", subRegion: "EAST_ASIA", name: "Macau" },
  // TC3 - Southeast Asia
  SG: { area: "TC3", subRegion: "SOUTHEAST_ASIA", name: "Singapore" },
  TH: { area: "TC3", subRegion: "SOUTHEAST_ASIA", name: "Thailand" },
  MY: { area: "TC3", subRegion: "SOUTHEAST_ASIA", name: "Malaysia" },
  ID: { area: "TC3", subRegion: "SOUTHEAST_ASIA", name: "Indonesia" },
  VN: { area: "TC3", subRegion: "SOUTHEAST_ASIA", name: "Vietnam" },
  PH: { area: "TC3", subRegion: "SOUTHEAST_ASIA", name: "Philippines" },
  MM: { area: "TC3", subRegion: "SOUTHEAST_ASIA", name: "Myanmar" },
  KH: { area: "TC3", subRegion: "SOUTHEAST_ASIA", name: "Cambodia" },
  // TC3 - South Asia
  IN: { area: "TC3", subRegion: "SOUTH_ASIA", name: "India" },
  PK: { area: "TC3", subRegion: "SOUTH_ASIA", name: "Pakistan" },
  BD: { area: "TC3", subRegion: "SOUTH_ASIA", name: "Bangladesh" },
  LK: { area: "TC3", subRegion: "SOUTH_ASIA", name: "Sri Lanka" },
  NP: { area: "TC3", subRegion: "SOUTH_ASIA", name: "Nepal" },
  // TC3 - Oceania
  AU: { area: "TC3", subRegion: "OCEANIA", name: "Australia" },
  NZ: { area: "TC3", subRegion: "OCEANIA", name: "New Zealand" },
  PG: { area: "TC3", subRegion: "OCEANIA", name: "Papua New Guinea" },
  FJ: { area: "TC3", subRegion: "OCEANIA", name: "Fiji" },
};

// Rate Class Codes
const RATE_CLASSES = {
  M: { name: "Minimum Charge", description: "Minimum charge per shipment", icon: DollarSign, color: BRAND_COLORS.danger },
  N: { name: "Normal Rate", description: "General cargo rate per kg", icon: Scale, color: BRAND_COLORS.ocean },
  Q45: { name: "Quantity Rate 45kg", description: "Reduced rate for 45kg+", icon: Package, color: BRAND_COLORS.logistics },
  Q100: { name: "Quantity Rate 100kg", description: "Reduced rate for 100kg+", icon: Package, color: BRAND_COLORS.logistics },
  Q300: { name: "Quantity Rate 300kg", description: "Reduced rate for 300kg+", icon: Package, color: BRAND_COLORS.logistics },
  Q500: { name: "Quantity Rate 500kg", description: "Reduced rate for 500kg+", icon: Package, color: BRAND_COLORS.logistics },
  Q1000: { name: "Quantity Rate 1000kg", description: "Reduced rate for 1000kg+", icon: Package, color: BRAND_COLORS.logistics },
  C: { name: "Specific Commodity Rate", description: "Special rates for specific goods", icon: Zap, color: BRAND_COLORS.warning },
  R: { name: "Class Rate Reduction", description: "Reduced class rate", icon: TrendingUp, color: BRAND_COLORS.secondary },
  S: { name: "Class Rate Surcharge", description: "Additional class rate", icon: AlertTriangle, color: BRAND_COLORS.danger },
};

// Commodity Types
const COMMODITY_TYPES = {
  GENERAL: { name: "General Cargo", factor: 1.0, description: "Standard cargo with no special requirements" },
  PERISHABLE: { name: "Perishables", factor: 1.15, description: "Temperature-sensitive goods (PER)" },
  VALUABLE: { name: "Valuable Cargo", factor: 1.25, description: "High-value items (VAL)" },
  LIVE_ANIMALS: { name: "Live Animals", factor: 1.30, description: "AVI - Special handling required" },
  DANGEROUS: { name: "Dangerous Goods", factor: 1.20, description: "DGR - Hazardous materials" },
  PHARMA: { name: "Pharmaceuticals", factor: 1.20, description: "Temperature-controlled pharma" },
  EXPRESS: { name: "Express", factor: 1.40, description: "Time-critical shipments" },
};

// Zone-to-Zone Base Rates (per kg)
const ZONE_RATES: Record<string, Record<string, { M: number; N: number; Q45: number; Q100: number; Q300: number; Q500: number; Q1000: number }>> = {
  // TC1 to other zones
  "TC1-TC1": { M: 75, N: 4.50, Q45: 3.80, Q100: 3.20, Q300: 2.80, Q500: 2.50, Q1000: 2.20 },
  "TC1-TC2": { M: 125, N: 5.80, Q45: 4.90, Q100: 4.20, Q300: 3.60, Q500: 3.20, Q1000: 2.90 },
  "TC1-TC3": { M: 135, N: 6.20, Q45: 5.30, Q100: 4.60, Q300: 3.90, Q500: 3.50, Q1000: 3.10 },
  // TC2 to other zones
  "TC2-TC1": { M: 125, N: 5.80, Q45: 4.90, Q100: 4.20, Q300: 3.60, Q500: 3.20, Q1000: 2.90 },
  "TC2-TC2": { M: 65, N: 3.80, Q45: 3.20, Q100: 2.70, Q300: 2.30, Q500: 2.00, Q1000: 1.80 },
  "TC2-TC3": { M: 95, N: 4.60, Q45: 3.90, Q100: 3.30, Q300: 2.80, Q500: 2.50, Q1000: 2.20 },
  // TC3 to other zones
  "TC3-TC1": { M: 135, N: 6.20, Q45: 5.30, Q100: 4.60, Q300: 3.90, Q500: 3.50, Q1000: 3.10 },
  "TC3-TC2": { M: 95, N: 4.60, Q45: 3.90, Q100: 3.30, Q300: 2.80, Q500: 2.50, Q1000: 2.20 },
  "TC3-TC3": { M: 55, N: 3.20, Q45: 2.70, Q100: 2.30, Q300: 1.90, Q500: 1.70, Q1000: 1.50 },
};

// Fuel and Security Surcharges
const SURCHARGES = {
  FSC: { rate: 0.95, name: "Fuel Surcharge", description: "Current IATA fuel surcharge per kg" },
  SSC: { rate: 0.25, name: "Security Surcharge", description: "Security screening charge per kg" },
};

// FAQ Data
const FAQ_DATA = [
  {
    question: "What are IATA Traffic Conference Areas?",
    answer: "IATA divides the world into three Traffic Conference Areas (TC1, TC2, TC3) for air cargo rate purposes. TC1 covers the Western Hemisphere (Americas), TC2 covers Europe, Middle East & Africa, and TC3 covers Asia & Oceania. These zones help standardize pricing across the global air freight industry."
  },
  {
    question: "How are IATA air freight rates calculated?",
    answer: "Air freight rates are calculated based on: (1) Origin and destination IATA zones, (2) Chargeable weight (actual or volumetric, whichever is greater), (3) Applicable weight break tier, (4) Commodity-specific adjustments, and (5) Fuel and security surcharges. The system automatically selects the most favorable rate."
  },
  {
    question: "What is the difference between actual weight and chargeable weight?",
    answer: "Actual weight is the physical weight measured on a scale. Chargeable weight is the greater of actual weight or volumetric weight (calculated as Length x Width x Height / 6000 for cm measurements). Airlines charge based on chargeable weight to account for bulky but light cargo."
  },
  {
    question: "What are weight breaks and how do they work?",
    answer: "Weight breaks are tiered pricing thresholds that offer lower per-kg rates as shipment weight increases. Common breaks are at 45kg, 100kg, 300kg, 500kg, and 1000kg. Higher weight breaks mean lower per-kg costs, so consolidating shipments can lead to significant savings."
  },
  {
    question: "What is a minimum charge (M rate)?",
    answer: "The minimum charge is the lowest amount an airline will charge for a shipment regardless of weight. If the calculated freight charge is less than the minimum, the minimum charge applies. This ensures carriers recover fixed handling costs for small shipments."
  },
  {
    question: "Why do commodity types affect rates?",
    answer: "Special commodities require additional handling, security measures, or certifications. For example, dangerous goods (DGR) need certified handling, perishables require temperature control, and valuable cargo needs enhanced security. These requirements result in surcharges or rate adjustments."
  },
  {
    question: "How often do fuel surcharges change?",
    answer: "Fuel surcharges (FSC) are typically updated monthly or bi-weekly by airlines based on jet fuel prices and market conditions. They are quoted per kg and added to the base freight charges. Security surcharges (SSC) are more stable and change less frequently."
  },
  {
    question: "Can I negotiate rates below published IATA rates?",
    answer: "Yes, large shippers and freight forwarders often negotiate contract rates with airlines that may be below published rates. These agreements typically involve volume commitments. Spot rates may also vary from published rates based on capacity availability."
  },
];

interface RateResult {
  baseFreight: number;
  applicableRate: number;
  weightBreak: string;
  minimumCharge: number;
  appliedMinimum: boolean;
  commodityCharge: number;
  fuelSurcharge: number;
  securitySurcharge: number;
  totalCharges: number;
  savings: number;
  savingsPercent: number;
}

export function IATAZoneRateTool() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  
  // Input parameters
  const [originCountry, setOriginCountry] = useState("US");
  const [destinationCountry, setDestinationCountry] = useState("CN");
  const [chargeableWeight, setChargeableWeight] = useState<string>("100");
  const [commodityType, setCommodityType] = useState<keyof typeof COMMODITY_TYPES>("GENERAL");
  const [includeSurcharges, setIncludeSurcharges] = useState(true);
  const [includeCommodityRate, setIncludeCommodityRate] = useState(true);

  // Get origin and destination info
  const originInfo = COUNTRY_TO_AREA[originCountry];
  const destInfo = COUNTRY_TO_AREA[destinationCountry];

  // Get zone pair key
  const zonePairKey = originInfo && destInfo 
    ? `${originInfo.area}-${destInfo.area}` as keyof typeof ZONE_RATES
    : null;

  // Get base rates for zone pair
  const baseRates = zonePairKey ? ZONE_RATES[zonePairKey] : null;

  // Calculate rates
  const result = useMemo((): RateResult | null => {
    if (!baseRates || !originInfo || !destInfo) return null;
    
    const weight = parseFloat(chargeableWeight) || 0;
    const commodity = COMMODITY_TYPES[commodityType];
    
    // Determine applicable weight break
    let applicableRate = baseRates.N;
    let weightBreak = "N";
    
    if (weight >= 1000) {
      applicableRate = baseRates.Q1000;
      weightBreak = "Q1000";
    } else if (weight >= 500) {
      applicableRate = baseRates.Q500;
      weightBreak = "Q500";
    } else if (weight >= 300) {
      applicableRate = baseRates.Q300;
      weightBreak = "Q300";
    } else if (weight >= 100) {
      applicableRate = baseRates.Q100;
      weightBreak = "Q100";
    } else if (weight >= 45) {
      applicableRate = baseRates.Q45;
      weightBreak = "Q45";
    }
    
    // Calculate base freight
    let baseFreight = weight * applicableRate;
    
    // Apply minimum charge if higher
    const minimumCharge = baseRates.M;
    const appliedMinimum = baseFreight < minimumCharge;
    if (appliedMinimum) {
      baseFreight = minimumCharge;
    }
    
    // Calculate commodity adjustment
    const commodityCharge = includeCommodityRate ? baseFreight * (commodity.factor - 1) : 0;
    
    // Calculate surcharges
    const fuelSurcharge = includeSurcharges ? weight * SURCHARGES.FSC.rate : 0;
    const securitySurcharge = includeSurcharges ? weight * SURCHARGES.SSC.rate : 0;
    
    // Total charges
    const totalCharges = baseFreight + commodityCharge + fuelSurcharge + securitySurcharge;
    
    // Calculate savings vs Normal rate
    const normalRateCost = weight * baseRates.N;
    const savings = Math.max(0, normalRateCost - baseFreight);
    const savingsPercent = normalRateCost > 0 ? (savings / normalRateCost) * 100 : 0;
    
    return {
      baseFreight,
      applicableRate,
      weightBreak,
      minimumCharge,
      appliedMinimum,
      commodityCharge,
      fuelSurcharge,
      securitySurcharge,
      totalCharges,
      savings,
      savingsPercent,
    };
  }, [baseRates, chargeableWeight, commodityType, includeSurcharges, includeCommodityRate, originInfo, destInfo]);

  // Weight break comparison data
  const weightBreakData = useMemo(() => {
    if (!baseRates) return [];
    
    return [
      { weight: "Min", rate: baseRates.M, label: "M", description: "Minimum" },
      { weight: "1kg", rate: baseRates.N, label: "N", description: "Normal" },
      { weight: "45kg", rate: baseRates.Q45, label: "Q45", description: "45+ kg" },
      { weight: "100kg", rate: baseRates.Q100, label: "Q100", description: "100+ kg" },
      { weight: "300kg", rate: baseRates.Q300, label: "Q300", description: "300+ kg" },
      { weight: "500kg", rate: baseRates.Q500, label: "Q500", description: "500+ kg" },
      { weight: "1000kg", rate: baseRates.Q1000, label: "Q1000", description: "1000+ kg" },
    ];
  }, [baseRates]);

  // Cost breakdown for pie chart
  const costBreakdownData = useMemo(() => {
    if (!result) return [];
    
    return [
      { name: "Base Freight", value: result.baseFreight, fill: BRAND_COLORS.ocean },
      ...(result.commodityCharge > 0 ? [{ name: "Commodity Adj", value: result.commodityCharge, fill: BRAND_COLORS.warning }] : []),
      ...(result.fuelSurcharge > 0 ? [{ name: "Fuel Surcharge", value: result.fuelSurcharge, fill: BRAND_COLORS.danger }] : []),
      ...(result.securitySurcharge > 0 ? [{ name: "Security Surcharge", value: result.securitySurcharge, fill: BRAND_COLORS.secondary }] : []),
    ];
  }, [result]);

  // Zone comparison radar data
  const zoneComparisonData = useMemo(() => {
    return [
      { zone: "TC1-TC1", rate: ZONE_RATES["TC1-TC1"].N, fullMark: 7 },
      { zone: "TC1-TC2", rate: ZONE_RATES["TC1-TC2"].N, fullMark: 7 },
      { zone: "TC1-TC3", rate: ZONE_RATES["TC1-TC3"].N, fullMark: 7 },
      { zone: "TC2-TC2", rate: ZONE_RATES["TC2-TC2"].N, fullMark: 7 },
      { zone: "TC2-TC3", rate: ZONE_RATES["TC2-TC3"].N, fullMark: 7 },
      { zone: "TC3-TC3", rate: ZONE_RATES["TC3-TC3"].N, fullMark: 7 },
    ];
  }, []);

  // Rate trend data for area chart
  const rateTrendData = useMemo(() => {
    if (!baseRates) return [];
    return [
      { weight: 0, rate: baseRates.N, label: "Normal" },
      { weight: 45, rate: baseRates.Q45, label: "Q45" },
      { weight: 100, rate: baseRates.Q100, label: "Q100" },
      { weight: 300, rate: baseRates.Q300, label: "Q300" },
      { weight: 500, rate: baseRates.Q500, label: "Q500" },
      { weight: 1000, rate: baseRates.Q1000, label: "Q1000" },
    ];
  }, [baseRates]);

  // Get sorted countries for dropdowns
  const sortedCountries = Object.entries(COUNTRY_TO_AREA)
    .map(([code, info]) => ({ code, ...info }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.ocean} 0%, ${BRAND_COLORS.logistics} 100%)` }}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                <Plane className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  IATA Rate Calculator
                </Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
                IATA Zone Rate Tool
              </h1>
              <p className="text-white/80 text-sm md:text-base max-w-2xl">
                Calculate accurate air freight rates across all IATA Traffic Conference Areas. 
                Compare weight breaks, analyze commodity adjustments, and optimize your shipping costs.
              </p>
            </div>
            <div className="hidden lg:flex flex-col gap-2">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Globe className="w-4 h-4 text-white/80" />
                <span className="text-white text-sm font-medium">3 Traffic Areas</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <BarChart3 className="w-4 h-4 text-white/80" />
                <span className="text-white text-sm font-medium">6 Weight Breaks</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <ArrowUpDown className="w-4 h-4 text-white/80" />
                <span className="text-white text-sm font-medium">7 Commodity Types</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="text-xs md:text-sm">Calculator</TabsTrigger>
          <TabsTrigger value="zones" className="text-xs md:text-sm">IATA Zones</TabsTrigger>
          <TabsTrigger value="rates" className="text-xs md:text-sm">Rate Analysis</TabsTrigger>
          <TabsTrigger value="classes" className="text-xs md:text-sm">Rate Classes</TabsTrigger>
          <TabsTrigger value="faq" className="text-xs md:text-sm">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Rate Calculator
                </CardTitle>
                <CardDescription>Calculate air freight rates based on IATA zones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
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

                <div className="grid gap-4">
                  {/* Origin Selection */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: BRAND_COLORS.ocean }} />
                      Origin Country
                    </Label>
                    <Select value={originCountry} onValueChange={setOriginCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedCountries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name} ({c.code}) - {IATA_AREAS[c.area].name.split(" ")[3]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {originInfo && (
                      <div className="flex gap-2 mt-2">
                        <Badge style={{ backgroundColor: IATA_AREAS[originInfo.area].color, color: "white" }}>
                          {originInfo.area}
                        </Badge>
                        <Badge variant="outline">{IATA_AREAS[originInfo.area].subRegions[originInfo.subRegion as keyof typeof IATA_AREAS.TC1.subRegions].name}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Destination Selection */}
                  <div>
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: BRAND_COLORS.logistics }} />
                      Destination Country
                    </Label>
                    <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortedCountries.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.name} ({c.code}) - {IATA_AREAS[c.area].name.split(" ")[3]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {destInfo && (
                      <div className="flex gap-2 mt-2">
                        <Badge style={{ backgroundColor: IATA_AREAS[destInfo.area].color, color: "white" }}>
                          {destInfo.area}
                        </Badge>
                        <Badge variant="outline">{IATA_AREAS[destInfo.area].subRegions[destInfo.subRegion as keyof typeof IATA_AREAS.TC1.subRegions].name}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Zone Pair Info */}
                  {zonePairKey && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Route Zone</span>
                        <span className="font-bold" style={{ color: BRAND_COLORS.ocean }}>{zonePairKey.replace("-", " → ")}</span>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Chargeable Weight */}
                  <div>
                    <Label htmlFor="chargeableWeight">Chargeable Weight (kg)</Label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="chargeableWeight"
                        type="number"
                        value={chargeableWeight}
                        onChange={(e) => setChargeableWeight(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Commodity Type */}
                  <div>
                    <Label>Commodity Type</Label>
                    <Select value={commodityType} onValueChange={(v) => setCommodityType(v as keyof typeof COMMODITY_TYPES)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(COMMODITY_TYPES).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name} ({data.factor > 1 ? `+${((data.factor - 1) * 100).toFixed(0)}%` : "Base Rate"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {COMMODITY_TYPES[commodityType].description}
                    </p>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <Label>Include Surcharges</Label>
                        <p className="text-xs text-muted-foreground">Fuel & Security</p>
                      </div>
                      <Switch checked={includeSurcharges} onCheckedChange={setIncludeSurcharges} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <Label>Apply Commodity Rate</Label>
                        <p className="text-xs text-muted-foreground">Special commodity adjustment</p>
                      </div>
                      <Switch checked={includeCommodityRate} onCheckedChange={setIncludeCommodityRate} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card style={{ borderColor: `${BRAND_COLORS.ocean}20` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Rate Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.ocean}15` }}>
                      <p className="text-sm text-muted-foreground">Total Freight Charges</p>
                      <p className="text-3xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                        {formatCurrency(result.totalCharges, currency)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        for {chargeableWeight} kg from {COUNTRY_TO_AREA[originCountry]?.name} to {COUNTRY_TO_AREA[destinationCountry]?.name}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Base Freight</p>
                          {result.appliedMinimum && (
                            <Badge variant="outline" className="text-xs">Min Applied</Badge>
                          )}
                        </div>
                        <p className="text-xl font-bold">
                          {formatCurrency(result.baseFreight, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @ ${result.applicableRate.toFixed(2)}/kg ({RATE_CLASSES[result.weightBreak as keyof typeof RATE_CLASSES]?.name})
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Rate Type</p>
                        <p className="text-xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                          {RATE_CLASSES[result.weightBreak as keyof typeof RATE_CLASSES]?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Best rate for {chargeableWeight}kg
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Charge Breakdown */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Charge Breakdown</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Freight ({chargeableWeight} kg × ${result.applicableRate.toFixed(2)})</span>
                          <span>{formatCurrency(result.baseFreight, currency)}</span>
                        </div>
                        {result.appliedMinimum && (
                          <div className="flex justify-between text-amber-600">
                            <span>Minimum Charge Applied</span>
                            <span>${result.minimumCharge}</span>
                          </div>
                        )}
                        {result.commodityCharge > 0 && (
                          <div className="flex justify-between text-amber-600">
                            <span>Commodity Adjustment ({COMMODITY_TYPES[commodityType].name})</span>
                            <span>+{formatCurrency(result.commodityCharge, currency)}</span>
                          </div>
                        )}
                        {result.fuelSurcharge > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fuel Surcharge ({chargeableWeight} kg × ${SURCHARGES.FSC.rate})</span>
                            <span>{formatCurrency(result.fuelSurcharge, currency)}</span>
                          </div>
                        )}
                        {result.securitySurcharge > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Security Surcharge ({chargeableWeight} kg × ${SURCHARGES.SSC.rate})</span>
                            <span>{formatCurrency(result.securitySurcharge, currency)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t font-bold">
                          <span>Total</span>
                          <span style={{ color: BRAND_COLORS.ocean }}>{formatCurrency(result.totalCharges, currency)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Savings Info */}
                    {result.savings > 0 && (
                      <div className="p-3 rounded-lg flex items-center gap-3" style={{ backgroundColor: `${BRAND_COLORS.logistics}15` }}>
                        <CheckCircle2 className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                        <div>
                          <p className="font-medium" style={{ color: BRAND_COLORS.logistics }}>
                            You save {formatCurrency(result.savings, currency)} ({result.savingsPercent.toFixed(1)}%)
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Compared to Normal (N) rate
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select origin and destination to calculate rates</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Cost Breakdown Chart */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Visual breakdown of your air freight charges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Rate Summary</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: BRAND_COLORS.ocean }} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Base Freight</p>
                          <p className="text-xs text-muted-foreground">Weight break optimized</p>
                        </div>
                        <span className="font-bold">{formatCurrency(result.baseFreight, currency)}</span>
                      </div>
                      {result.commodityCharge > 0 && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: BRAND_COLORS.warning }} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Commodity Adjustment</p>
                            <p className="text-xs text-muted-foreground">{COMMODITY_TYPES[commodityType].name}</p>
                          </div>
                          <span className="font-bold">+{formatCurrency(result.commodityCharge, currency)}</span>
                        </div>
                      )}
                      {includeSurcharges && (
                        <>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: BRAND_COLORS.danger }} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Fuel Surcharge</p>
                              <p className="text-xs text-muted-foreground">@ ${SURCHARGES.FSC.rate}/kg</p>
                            </div>
                            <span className="font-bold">{formatCurrency(result.fuelSurcharge, currency)}</span>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="w-4 h-4 rounded" style={{ backgroundColor: BRAND_COLORS.secondary }} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">Security Surcharge</p>
                              <p className="text-xs text-muted-foreground">@ ${SURCHARGES.SSC.rate}/kg</p>
                            </div>
                            <span className="font-bold">{formatCurrency(result.securitySurcharge, currency)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="zones" className="space-y-6 mt-6">
          {/* IATA Zone Map */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                IATA Traffic Conference Areas
              </CardTitle>
              <CardDescription>
                The world is divided into three IATA Traffic Conference Areas for rate purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(IATA_AREAS).map(([key, area]) => (
                  <Card key={key} className="overflow-hidden">
                    <div className="h-2" style={{ backgroundColor: area.color }} />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Badge style={{ backgroundColor: area.color, color: "white" }}>{key}</Badge>
                        {area.name.split(" ").slice(3).join(" ")}
                      </CardTitle>
                      <CardDescription>{area.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(area.subRegions).map(([subKey, subRegion]) => (
                        <div key={subKey} className="p-2 bg-muted/50 rounded">
                          <p className="font-medium text-sm">{subRegion.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {subRegion.countries.length} countries
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone Rate Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Zone Rate Comparison</CardTitle>
              <CardDescription>Normal (N) rates across different zone pairs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={zoneComparisonData}>
                    <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                    <PolarAngleAxis dataKey="zone" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis tickFormatter={(v) => `$${v}`} />
                    <Radar
                      name="Normal Rate ($/kg)"
                      dataKey="rate"
                      stroke={BRAND_COLORS.ocean}
                      fill={BRAND_COLORS.ocean}
                      fillOpacity={0.3}
                    />
                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}/kg`, "Rate"]} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Zone Distance Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Zone-to-Zone Rate Structure</CardTitle>
              <CardDescription>Base rates are determined by the traffic conference areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">From → To</th>
                      <th className="text-right py-3 px-4">Min (M)</th>
                      <th className="text-right py-3 px-4">Normal (N)</th>
                      <th className="text-right py-3 px-4">+45kg</th>
                      <th className="text-right py-3 px-4">+100kg</th>
                      <th className="text-right py-3 px-4">+300kg</th>
                      <th className="text-right py-3 px-4">+500kg</th>
                      <th className="text-right py-3 px-4">+1000kg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(ZONE_RATES).map(([route, rates]) => (
                      <tr key={route} className="border-b hover:bg-muted/30">
                        <td className="py-3 px-4 font-medium">{route.replace("-", " → ")}</td>
                        <td className="text-right py-3 px-4">${rates.M}</td>
                        <td className="text-right py-3 px-4">${rates.N.toFixed(2)}</td>
                        <td className="text-right py-3 px-4" style={{ color: BRAND_COLORS.logistics }}>${rates.Q45.toFixed(2)}</td>
                        <td className="text-right py-3 px-4" style={{ color: BRAND_COLORS.logistics }}>${rates.Q100.toFixed(2)}</td>
                        <td className="text-right py-3 px-4" style={{ color: BRAND_COLORS.logistics }}>${rates.Q300.toFixed(2)}</td>
                        <td className="text-right py-3 px-4" style={{ color: BRAND_COLORS.logistics }}>${rates.Q500.toFixed(2)}</td>
                        <td className="text-right py-3 px-4" style={{ color: BRAND_COLORS.logistics }}>${rates.Q1000.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-6 mt-6">
          {/* Weight Break Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Weight Break Rate Comparison
              </CardTitle>
              <CardDescription>
                See how rates decrease with higher weight breaks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {baseRates ? (
                <>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={rateTrendData}>
                        <defs>
                          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={BRAND_COLORS.ocean} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={BRAND_COLORS.ocean} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="weight" tickFormatter={(v) => `${v}kg`} />
                        <YAxis tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                          formatter={(value: number) => [`$${value.toFixed(2)}/kg`, "Rate"]}
                          labelFormatter={(label) => `Weight: ${label}kg`}
                        />
                        <Area
                          type="monotone"
                          dataKey="rate"
                          stroke={BRAND_COLORS.ocean}
                          fillOpacity={1}
                          fill="url(#colorRate)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: BRAND_COLORS.ocean }} />
                      <span>Rate per kg decreases with weight</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Select origin and destination to view rate comparison
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weight Break Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weight Break Pricing Tiers</CardTitle>
              <CardDescription>Visual comparison of rates across weight breaks</CardDescription>
            </CardHeader>
            <CardContent>
              {baseRates ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weightBreakData.slice(1)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="weight" />
                      <YAxis tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toFixed(2)}/kg`, "Rate"]}
                        labelFormatter={(label) => `Weight Break: ${label}`}
                      />
                      <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                        {weightBreakData.slice(1).map((entry, index) => {
                          const weight = parseFloat(chargeableWeight) || 0;
                          const isActive = 
                            (entry.label === "N" && weight < 45) ||
                            (entry.label === "Q45" && weight >= 45 && weight < 100) ||
                            (entry.label === "Q100" && weight >= 100 && weight < 300) ||
                            (entry.label === "Q300" && weight >= 300 && weight < 500) ||
                            (entry.label === "Q500" && weight >= 500 && weight < 1000) ||
                            (entry.label === "Q1000" && weight >= 1000);
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={isActive ? BRAND_COLORS.logistics : BRAND_COLORS.ocean}
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Select origin and destination to view chart
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weight Break Optimization */}
          <Card>
            <CardHeader>
              <CardTitle>Weight Break Optimization</CardTitle>
              <CardDescription>Find the most cost-effective weight break for your shipment</CardDescription>
            </CardHeader>
            <CardContent>
              {baseRates ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Current Weight: {chargeableWeight} kg</h4>
                    <p className="text-sm text-muted-foreground">
                      {(() => {
                        const weight = parseFloat(chargeableWeight) || 0;
                        if (weight < 45) return "Consider consolidating to 45kg for quantity rate discounts.";
                        if (weight < 100) return "Close to 100kg threshold - check if adding volume qualifies for lower rate.";
                        if (weight < 300) return "Good positioning for Q100 rate. Consider 300kg threshold for further savings.";
                        if (weight < 500) return "Qualified for Q300 rate. Check 500kg threshold for additional savings.";
                        if (weight < 1000) return "Qualified for Q500 rate. Consider consolidating for 1000kg threshold.";
                        return "Best rate tier achieved with Q1000 pricing.";
                      })()}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-3 px-4">Weight Break</th>
                          <th className="text-right py-3 px-4">Rate/kg</th>
                          <th className="text-right py-3 px-4">Total Cost</th>
                          <th className="text-right py-3 px-4">Savings vs N</th>
                          <th className="text-left py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weightBreakData.slice(1).map((wb) => {
                          const weight = parseFloat(chargeableWeight) || 0;
                          const cost = weight * wb.rate;
                          const savings = weight * baseRates.N - cost;
                          const isActive = 
                            (wb.label === "N" && weight < 45) ||
                            (wb.label === "Q45" && weight >= 45 && weight < 100) ||
                            (wb.label === "Q100" && weight >= 100 && weight < 300) ||
                            (wb.label === "Q300" && weight >= 300 && weight < 500) ||
                            (wb.label === "Q500" && weight >= 500 && weight < 1000) ||
                            (wb.label === "Q1000" && weight >= 1000);
                          
                          return (
                            <tr key={wb.label} className={`border-b ${isActive ? `bg-[${BRAND_COLORS.logistics}]/10` : ""}`}>
                              <td className="py-3 px-4 font-medium">{wb.description}</td>
                              <td className="text-right py-3 px-4">${wb.rate.toFixed(2)}</td>
                              <td className="text-right py-3 px-4">{formatCurrency(cost, currency)}</td>
                              <td className="text-right py-3 px-4" style={{ color: BRAND_COLORS.logistics }}>
                                {savings > 0 ? formatCurrency(savings, currency) : "-"}
                              </td>
                              <td className="py-3 px-4">
                                {isActive && (
                                  <Badge style={{ backgroundColor: BRAND_COLORS.logistics }}>Applied</Badge>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Select origin and destination to view optimization
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6 mt-6">
          {/* Rate Class Codes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                IATA Rate Class Codes
              </CardTitle>
              <CardDescription>
                Understanding the different rate classes used in air freight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(RATE_CLASSES).map(([code, data]) => {
                  const Icon = data.icon;
                  return (
                    <Card key={code} className="overflow-hidden">
                      <div className="h-1" style={{ backgroundColor: data.color }} />
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${data.color}20` }}>
                            <Icon className="h-5 w-5" style={{ color: data.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge style={{ backgroundColor: data.color, color: "white" }}>{code}</Badge>
                              <span className="font-medium">{data.name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{data.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Commodity Types */}
          <Card>
            <CardHeader>
              <CardTitle>Commodity-Specific Rates</CardTitle>
              <CardDescription>Special rates apply to different types of cargo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Commodity</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-right py-3 px-4">Rate Factor</th>
                      <th className="text-left py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(COMMODITY_TYPES).map(([key, data]) => (
                      <tr key={key} className={`border-b ${commodityType === key ? `bg-[${BRAND_COLORS.ocean}]/10` : ""}`}>
                        <td className="py-3 px-4 font-medium">{data.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{data.description}</td>
                        <td className="text-right py-3 px-4">
                          <Badge variant={data.factor > 1 ? "destructive" : "outline"}>
                            {data.factor > 1 ? `+${((data.factor - 1) * 100).toFixed(0)}%` : "Base"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-xs text-muted-foreground">
                          {key === "GENERAL" && "Standard GCR applies"}
                          {key === "PERISHABLE" && "Requires temperature control"}
                          {key === "VALUABLE" && "High security requirements"}
                          {key === "LIVE_ANIMALS" && "AVI special handling"}
                          {key === "DANGEROUS" && "DGR certification required"}
                          {key === "PHARMA" && "GDP compliant handling"}
                          {key === "EXPRESS" && "Priority handling"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Everything you need to know about IATA zone rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
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

          {/* Quick Tips */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card style={{ borderColor: `${BRAND_COLORS.logistics}30` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg" style={{ color: BRAND_COLORS.logistics }}>
                  <CheckCircle2 className="h-5 w-5" />
                  Pro Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span style={{ color: BRAND_COLORS.logistics }}>•</span>
                    <span>Always check if you&apos;re close to the next weight break threshold</span>
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: BRAND_COLORS.logistics }}>•</span>
                    <span>Consolidate shipments to achieve better weight break rates</span>
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: BRAND_COLORS.logistics }}>•</span>
                    <span>Consider volumetric weight - airlines charge on whichever is greater</span>
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: BRAND_COLORS.logistics }}>•</span>
                    <span>Book early during peak seasons for better rate availability</span>
                  </li>
                  <li className="flex gap-2">
                    <span style={{ color: BRAND_COLORS.logistics }}>•</span>
                    <span>Compare rates from multiple airlines on the same route</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card style={{ borderColor: `${BRAND_COLORS.danger}30` }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Common Mistakes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="text-destructive">✗</span>
                    <span>Ignoring minimum charge requirements</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">✗</span>
                    <span>Not accounting for surcharges in total cost</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">✗</span>
                    <span>Using actual weight instead of chargeable weight</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">✗</span>
                    <span>Assuming all airlines have the same rates</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">✗</span>
                    <span>Forgetting commodity-specific requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Surcharges Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Current Surcharges
              </CardTitle>
              <CardDescription>Additional charges applied to air freight shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Fuel className="h-5 w-5" style={{ color: BRAND_COLORS.danger }} />
                    <span className="font-medium">Fuel Surcharge (FSC)</span>
                  </div>
                  <p className="text-2xl font-bold">${SURCHARGES.FSC.rate}/kg</p>
                  <p className="text-sm text-muted-foreground mt-1">{SURCHARGES.FSC.description}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5" style={{ color: BRAND_COLORS.secondary }} />
                    <span className="font-medium">Security Surcharge (SSC)</span>
                  </div>
                  <p className="text-2xl font-bold">${SURCHARGES.SSC.rate}/kg</p>
                  <p className="text-sm text-muted-foreground mt-1">{SURCHARGES.SSC.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.ocean} 0%, ${BRAND_COLORS.logistics} 100%)`, color: "white" }}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
