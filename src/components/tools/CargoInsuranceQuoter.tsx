"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Ship,
  Plane,
  Truck,
  Package,
  AlertTriangle,
  Info,
  Percent,
  DollarSign,
  TrendingUp,
  Calculator,
  Check,
  Clock,
  MapPin,
  ArrowRight,
  FileText,
  Building2,
  ChevronDown,
  RefreshCw,
  Download,
  Share2,
  Sparkles,
  BookOpen,
  HelpCircle,
  BarChart3,
  PieChart as PieChartIcon,
  AlertCircle,
  Lightbulb,
  XCircle,
  Target,
  Zap,
  Award,
  Scale,
  Globe,
  Anchor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Cargo type categories with risk factors
const cargoTypes: Record<string, { name: string; category: string; baseRate: number; riskLevel: string }> = {
  // General Cargo
  general_dry: { name: "General Dry Cargo", category: "General", baseRate: 0.15, riskLevel: "low" },
  general_packed: { name: "Packed Goods", category: "General", baseRate: 0.18, riskLevel: "low" },
  
  // Electronics
  electronics_consumer: { name: "Consumer Electronics", category: "Electronics", baseRate: 0.35, riskLevel: "high" },
  electronics_industrial: { name: "Industrial Electronics", category: "Electronics", baseRate: 0.40, riskLevel: "high" },
  electronics_telecom: { name: "Telecom Equipment", category: "Electronics", baseRate: 0.38, riskLevel: "high" },
  
  // Machinery
  machinery_heavy: { name: "Heavy Machinery", category: "Machinery", baseRate: 0.22, riskLevel: "medium" },
  machinery_parts: { name: "Machinery Parts", category: "Machinery", baseRate: 0.20, riskLevel: "medium" },
  machinery_precision: { name: "Precision Equipment", category: "Machinery", baseRate: 0.30, riskLevel: "medium" },
  
  // Textiles & Apparel
  textiles_raw: { name: "Raw Textiles", category: "Textiles", baseRate: 0.12, riskLevel: "low" },
  textiles_finished: { name: "Finished Apparel", category: "Textiles", baseRate: 0.15, riskLevel: "low" },
  
  // Food & Agriculture
  food_perishable: { name: "Perishable Food", category: "Food & Agri", baseRate: 0.45, riskLevel: "high" },
  food_nonperishable: { name: "Non-Perishable Food", category: "Food & Agri", baseRate: 0.25, riskLevel: "medium" },
  agriculture_bulk: { name: "Bulk Agricultural", category: "Food & Agri", baseRate: 0.20, riskLevel: "medium" },
  
  // Chemicals
  chemicals_hazardous: { name: "Hazardous Chemicals", category: "Chemicals", baseRate: 0.80, riskLevel: "critical" },
  chemicals_nonhazardous: { name: "Non-Hazardous Chemicals", category: "Chemicals", baseRate: 0.35, riskLevel: "medium" },
  chemicals_pharmaceuticals: { name: "Pharmaceuticals", category: "Chemicals", baseRate: 0.50, riskLevel: "high" },
  
  // Automotive
  auto_vehicles: { name: "Vehicles", category: "Automotive", baseRate: 0.28, riskLevel: "medium" },
  auto_parts: { name: "Auto Parts", category: "Automotive", baseRate: 0.18, riskLevel: "low" },
  
  // Construction
  construction_materials: { name: "Building Materials", category: "Construction", baseRate: 0.15, riskLevel: "low" },
  construction_equipment: { name: "Construction Equipment", category: "Construction", baseRate: 0.25, riskLevel: "medium" },
  
  // Metals
  metals_raw: { name: "Raw Metals", category: "Metals", baseRate: 0.12, riskLevel: "low" },
  metals_finished: { name: "Finished Metal Products", category: "Metals", baseRate: 0.18, riskLevel: "medium" },
  
  // High Value
  luxury_goods: { name: "Luxury Goods", category: "High Value", baseRate: 0.55, riskLevel: "critical" },
  artwork: { name: "Artwork & Antiques", category: "High Value", baseRate: 0.75, riskLevel: "critical" },
  precious_metals: { name: "Precious Metals & Stones", category: "High Value", baseRate: 0.60, riskLevel: "critical" },
};

// Transport modes
const transportModes: Record<string, { name: string; icon: React.ReactNode; modifier: number }> = {
  ocean_fcl: { name: "Ocean FCL", icon: <Ship className="h-4 w-4" />, modifier: 1.0 },
  ocean_lcl: { name: "Ocean LCL", icon: <Ship className="h-4 w-4" />, modifier: 1.15 },
  air: { name: "Air Freight", icon: <Plane className="h-4 w-4" />, modifier: 0.85 },
  road: { name: "Road Transport", icon: <Truck className="h-4 w-4" />, modifier: 1.05 },
  rail: { name: "Rail Transport", icon: <Package className="h-4 w-4" />, modifier: 0.95 },
  multimodal: { name: "Multimodal", icon: <Package className="h-4 w-4" />, modifier: 1.0 },
};

// Route risk factors
const routeRiskFactors: Record<string, { name: string; factor: number; warRisk: number; piracyRisk: number }> = {
  asia_americas: { name: "Asia to Americas", factor: 1.0, warRisk: 0.01, piracyRisk: 0.005 },
  asia_europe: { name: "Asia to Europe", factor: 1.0, warRisk: 0.02, piracyRisk: 0.01 },
  europe_americas: { name: "Europe to Americas", factor: 0.95, warRisk: 0.005, piracyRisk: 0.002 },
  intra_asia: { name: "Intra-Asia", factor: 0.9, warRisk: 0.015, piracyRisk: 0.02 },
  intra_europe: { name: "Intra-Europe", factor: 0.85, warRisk: 0.005, piracyRisk: 0.001 },
  middle_east: { name: "Middle East Routes", factor: 1.35, warRisk: 0.12, piracyRisk: 0.03 },
  africa: { name: "Africa Routes", factor: 1.25, warRisk: 0.08, piracyRisk: 0.05 },
  south_america: { name: "South America Routes", factor: 1.1, warRisk: 0.02, piracyRisk: 0.01 },
  trans_pacific: { name: "Trans-Pacific", factor: 1.0, warRisk: 0.01, piracyRisk: 0.005 },
  global: { name: "Other Global Routes", factor: 1.0, warRisk: 0.02, piracyRisk: 0.01 },
};

// ICC Coverage Types
const iccCoverages = {
  icc_a: {
    name: "ICC (A) - All Risks",
    description: "Most comprehensive coverage. Covers all risks of loss or damage except specifically excluded perils.",
    rateFactor: 1.0,
    deductible: 0.1,
    includes: [
      "All risks of loss or damage",
      "Fire, explosion, lightning",
      "Perils of the sea (sinking, stranding, collision)",
      "Earthquake, volcanic eruption",
      "General average sacrifice",
      "Jettison and washing overboard",
      "Theft, pilferage, and non-delivery",
      "Water damage from any cause",
      "Breakage and crushing",
      "Hook damage",
    ],
    excludes: [
      "Willful misconduct",
      "Ordinary leakage/wear and tear",
      "Inherent vice",
      "Delay",
      "Insolvency of carrier",
      "Nuclear incidents",
    ],
  },
  icc_b: {
    name: "ICC (B) - Intermediate",
    description: "Named perils coverage. Balanced protection at moderate premium.",
    rateFactor: 0.75,
    deductible: 0.15,
    includes: [
      "Fire, explosion",
      "Vessel sinking, stranding",
      "Collision with external object",
      "Earthquake, volcanic eruption",
      "Lightning",
      "Jettison",
      "General average sacrifice",
      "Washing overboard",
      "Entry of sea/lake water",
      "Total loss during loading/unloading",
    ],
    excludes: [
      "Theft, pilferage, non-delivery",
      "Water damage (partial)",
      "Breakage (partial loss)",
      "Delay and inherent vice",
      "Willful misconduct",
    ],
  },
  icc_c: {
    name: "ICC (C) - Basic",
    description: "Minimum coverage for major casualties only. Lowest premium option.",
    rateFactor: 0.55,
    deductible: 0.2,
    includes: [
      "Fire, explosion",
      "Vessel sinking, stranding",
      "Collision with external object",
      "General average sacrifice",
      "Jettison",
    ],
    excludes: [
      "Earthquake, volcanic eruption",
      "Lightning",
      "Washing overboard",
      "Theft, pilferage",
      "Water damage",
      "Breakage",
      "Partial loss during loading/unloading",
    ],
  },
};

// Deductible options
const deductibleOptions = [
  { value: "none", label: "No Deductible", rateAdjustment: 1.15 },
  { value: "standard", label: "Standard (0.1%)", rateAdjustment: 1.0 },
  { value: "medium", label: "Medium (0.25%)", rateAdjustment: 0.92 },
  { value: "high", label: "High (0.5%)", rateAdjustment: 0.85 },
  { value: "custom", label: "Custom Amount", rateAdjustment: 1.0 },
];

// Insurance carriers for comparison
const insuranceCarriers = [
  { id: "allianz", name: "Allianz Global Corporate", rating: "AA", minPremium: 150, baseRate: 0.18 },
  { id: "axa", name: "AXA XL", rating: "AA-", minPremium: 125, baseRate: 0.17 },
  { id: "chubb", name: "Chubb", rating: "AA+", minPremium: 175, baseRate: 0.19 },
  { id: "munich", name: "Munich Re", rating: "AA", minPremium: 200, baseRate: 0.165 },
  { id: "zurich", name: "Zurich Insurance", rating: "AA-", minPremium: 140, baseRate: 0.175 },
  { id: "aig", name: "AIG", rating: "A+", minPremium: 130, baseRate: 0.185 },
  { id: "tokio", name: "Tokio Marine", rating: "AA-", minPremium: 135, baseRate: 0.17 },
  { id: "generali", name: "Generali", rating: "A+", minPremium: 120, baseRate: 0.18 },
];

// Popular ports for quick selection
const popularPorts = [
  { code: "CNSHA", name: "Shanghai", country: "China" },
  { code: "SGSIN", name: "Singapore", country: "Singapore" },
  { code: "NLRTM", name: "Rotterdam", country: "Netherlands" },
  { code: "USNYC", name: "New York", country: "USA" },
  { code: "USLAX", name: "Los Angeles", country: "USA" },
  { code: "DEHAM", name: "Hamburg", country: "Germany" },
  { code: "HKHKG", name: "Hong Kong", country: "Hong Kong" },
  { code: "AEDXB", name: "Dubai", country: "UAE" },
];

// Pro tips data
const proTips = [
  {
    icon: <Target className="h-5 w-5" />,
    title: "Insure for CIF + 10%",
    description: "Always insure your cargo for at least CIF value plus 10% to cover claim processing costs, inspection fees, and other expenses that may arise during a claim settlement.",
  },
  {
    icon: <Camera className="h-5 w-5" />,
    title: "Document Everything",
    description: "Take photos of cargo condition before loading and after unloading. Maintain detailed packing lists and keep all shipping documents organized for faster claims processing.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Report Damages Immediately",
    description: "Notify your insurer within 24 hours of discovering any damage or loss. Delayed reporting can result in claim denial or reduced settlements.",
  },
  {
    icon: <Scale className="h-5 w-5" />,
    title: "Understand Carrier Liability Limits",
    description: "Carrier liability is often limited by weight or per package. Don't assume the carrier will fully compensate you for losses - marine insurance fills this gap.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Monitor Geopolitical Risks",
    description: "Stay informed about route-specific risks like war zones, piracy hotspots, and political instability. Adjust coverage and routing accordingly.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Optimize Deductibles",
    description: "Higher deductibles lower premiums but increase out-of-pocket costs during claims. Find the right balance based on your cargo value and risk tolerance.",
  },
];

// Common mistakes data
const commonMistakes = [
  {
    title: "Underinsuring Cargo",
    description: "One of the most costly mistakes is insuring for less than the actual cargo value. This not only leaves you exposed to losses but may trigger the average clause, reducing claim payouts proportionally even for partial losses. Always insure for full CIF value plus 10%.",
  },
  {
    title: "Ignoring General Average",
    description: "Many shippers don't realize that if a vessel declares general average, all cargo owners must contribute to salvage costs - even if their cargo wasn't damaged. Without proper insurance coverage for general average contributions, you could face significant unexpected costs.",
  },
  {
    title: "Choosing Coverage Based Only on Price",
    description: "Selecting the cheapest policy without understanding coverage limitations can be devastating. ICC (C) may seem attractive due to lower premiums, but it only covers major casualties. For valuable or fragile cargo, the savings are not worth the risk exposure.",
  },
  {
    title: "Missing the Claims Deadline",
    description: "Insurance policies have strict notification requirements. Failing to report damages within the specified timeframe (often 24-72 hours) can result in claim denial. Document everything immediately upon discovery of damage and notify all parties promptly.",
  },
  {
    title: "Not Reviewing Policy Exclusions",
    description: "Every policy has exclusions that may not be obvious. Common exclusions include inherent vice, delay, improper packing, and carrier insolvency. Understanding these exclusions before shipment allows you to address gaps with additional coverage or risk mitigation.",
  },
];

// Import Camera icon
import { Camera } from "lucide-react";

interface QuoteResult {
  basePremium: number;
  warRiskPremium: number;
  strikesPremium: number;
  piracyPremium: number;
  totalPremium: number;
  premiumRate: number;
  coverageAmount: number;
  deductible: number;
  carrierQuotes: Array<{
    carrier: typeof insuranceCarriers[0];
    premium: number;
    rate: number;
    savings: number;
  }>;
  riskScore: number;
  recommendation: string;
}

export function CargoInsuranceQuoter() {
  // State
  const [activeTab, setActiveTab] = useState("calculator");
  const [cargoValue, setCargoValue] = useState<string>("150000");
  const [currency, setCurrency] = useState<string>("USD");
  const [cargoType, setCargoType] = useState<string>("general_dry");
  const [transportMode, setTransportMode] = useState<string>("ocean_fcl");
  const [route, setRoute] = useState<string>("asia_americas");
  const [coverageType, setCoverageType] = useState<string>("icc_a");
  const [includeWarRisk, setIncludeWarRisk] = useState(true);
  const [includeStrikes, setIncludeStrikes] = useState(true);
  const [includePiracy, setIncludePiracy] = useState(true);
  const [deductibleOption, setDeductibleOption] = useState<string>("standard");
  const [customDeductible, setCustomDeductible] = useState<string>("500");
  const [originPort, setOriginPort] = useState<string>("");
  const [destinationPort, setDestinationPort] = useState<string>("");
  const [vesselName, setVesselName] = useState<string>("");
  const [voyageNumber, setVoyageNumber] = useState<string>("");
  const [etd, setEtd] = useState<string>("");
  const [eta, setEta] = useState<string>("");
  const [packagingType, setPackagingType] = useState<string>("standard");
  const [customRate, setCustomRate] = useState<string>("");
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Calculate quote
  const calculation = useMemo<QuoteResult>(() => {
    const value = parseFloat(cargoValue) || 0;
    const selectedCargo = cargoTypes[cargoType];
    const selectedTransport = transportModes[transportMode];
    const selectedRoute = routeRiskFactors[route];
    const selectedCoverage = iccCoverages[coverageType as keyof typeof iccCoverages];
    const selectedDeductible = deductibleOptions.find((d) => d.value === deductibleOption);

    // Calculate base premium rate
    let baseRate = customRate
      ? parseFloat(customRate) / 100
      : (selectedCargo?.baseRate || 0.15) / 100;

    // Apply coverage type factor
    baseRate *= selectedCoverage?.rateFactor || 1;
    
    // Apply transport mode modifier
    baseRate *= selectedTransport?.modifier || 1;
    
    // Apply route risk factor
    baseRate *= selectedRoute?.factor || 1;
    
    // Apply deductible adjustment
    baseRate *= selectedDeductible?.rateAdjustment || 1;
    
    // Packaging discount
    if (packagingType === "export") baseRate *= 0.95;
    if (packagingType === "premium") baseRate *= 0.90;

    const basePremium = value * baseRate;

    // War risk premium
    const warRiskPremium = includeWarRisk
      ? value * (selectedRoute?.warRisk || 0.02) / 100
      : 0;

    // Strikes, riots, civil commotion premium
    const strikesPremium = includeStrikes
      ? value * 0.015 / 100
      : 0;

    // Piracy premium
    const piracyPremium = includePiracy
      ? value * (selectedRoute?.piracyRisk || 0.01) / 100
      : 0;

    const totalPremium = basePremium + warRiskPremium + strikesPremium + piracyPremium;
    const premiumRate = (totalPremium / value) * 100;
    
    // Calculate deductible amount
    let deductibleAmount = 0;
    if (deductibleOption === "custom") {
      deductibleAmount = parseFloat(customDeductible) || 0;
    } else if (deductibleOption === "none") {
      deductibleAmount = 0;
    } else {
      const deductiblePerc = deductibleOption === "standard" ? 0.001 : 
                            deductibleOption === "medium" ? 0.0025 : 0.005;
      deductibleAmount = value * deductiblePerc;
    }

    // Calculate carrier quotes
    const carrierQuotes = insuranceCarriers.map((carrier) => {
      const carrierRate = carrier.baseRate * (selectedCoverage?.rateFactor || 1) * 
                         (selectedTransport?.modifier || 1) * (selectedRoute?.factor || 1);
      let premium = value * carrierRate / 100;
      premium = Math.max(premium, carrier.minPremium);
      
      // Add additional coverage
      if (includeWarRisk) premium += value * (selectedRoute?.warRisk || 0.02) / 100;
      if (includeStrikes) premium += value * 0.015 / 100;
      if (includePiracy) premium += value * (selectedRoute?.piracyRisk || 0.01) / 100;
      
      return {
        carrier,
        premium,
        rate: (premium / value) * 100,
        savings: totalPremium - premium,
      };
    });

    // Risk score (0-100, lower is better)
    const riskScore = Math.min(100, Math.round(
      (selectedCargo?.baseRate || 0.15) * 100 +
      ((selectedRoute?.factor || 1) - 1) * 100 +
      (selectedCargo?.riskLevel === "high" ? 15 : selectedCargo?.riskLevel === "critical" ? 30 : 0)
    ));

    // Recommendation
    let recommendation = "";
    if (riskScore < 30) {
      recommendation = "Low risk shipment. Standard coverage recommended.";
    } else if (riskScore < 50) {
      recommendation = "Moderate risk. Consider ICC (A) for comprehensive protection.";
    } else if (riskScore < 70) {
      recommendation = "Elevated risk. ICC (A) with War Risk and SRCC strongly recommended.";
    } else {
      recommendation = "High risk shipment. Full coverage with all additional clauses essential.";
    }

    return {
      basePremium,
      warRiskPremium,
      strikesPremium,
      piracyPremium,
      totalPremium,
      premiumRate,
      coverageAmount: value,
      deductible: deductibleAmount,
      carrierQuotes: carrierQuotes.sort((a, b) => a.premium - b.premium),
      riskScore,
      recommendation,
    };
  }, [cargoValue, cargoType, transportMode, route, coverageType, includeWarRisk, 
      includeStrikes, includePiracy, deductibleOption, customDeductible, customRate, packagingType]);

  const formatValue = (amount: number) => {
    return formatCurrency(amount, currency);
  };

  const generateQuote = () => {
    setQuoteGenerated(true);
  };

  const resetForm = () => {
    setCargoValue("150000");
    setCargoType("general_dry");
    setTransportMode("ocean_fcl");
    setRoute("asia_americas");
    setCoverageType("icc_a");
    setIncludeWarRisk(true);
    setIncludeStrikes(true);
    setIncludePiracy(true);
    setDeductibleOption("standard");
    setOriginPort("");
    setDestinationPort("");
    setVesselName("");
    setVoyageNumber("");
    setEtd("");
    setEta("");
    setCustomRate("");
    setQuoteGenerated(false);
  };

  // Export functionality
  const exportQuote = () => {
    const quoteData = {
      timestamp: new Date().toISOString(),
      cargo: {
        value: parseFloat(cargoValue),
        currency,
        type: cargoTypes[cargoType]?.name,
        category: cargoTypes[cargoType]?.category,
        packagingType,
      },
      transit: {
        mode: transportModes[transportMode]?.name,
        route: routeRiskFactors[route]?.name,
        originPort: popularPorts.find(p => p.code === originPort)?.name || originPort,
        destinationPort: popularPorts.find(p => p.code === destinationPort)?.name || destinationPort,
        vesselName,
        voyageNumber,
        etd,
        eta,
      },
      coverage: {
        type: iccCoverages[coverageType as keyof typeof iccCoverages].name,
        includeWarRisk,
        includeStrikes,
        includePiracy,
        deductibleOption,
        customDeductible: deductibleOption === "custom" ? customDeductible : null,
      },
      calculation: {
        basePremium: calculation.basePremium,
        warRiskPremium: calculation.warRiskPremium,
        strikesPremium: calculation.strikesPremium,
        piracyPremium: calculation.piracyPremium,
        totalPremium: calculation.totalPremium,
        premiumRate: calculation.premiumRate,
        coverageAmount: calculation.coverageAmount,
        deductible: calculation.deductible,
        riskScore: calculation.riskScore,
        recommendation: calculation.recommendation,
      },
      carrierQuotes: calculation.carrierQuotes.slice(0, 5).map(q => ({
        carrier: q.carrier.name,
        rating: q.carrier.rating,
        premium: q.premium,
        rate: q.rate,
      })),
    };

    const blob = new Blob([JSON.stringify(quoteData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cargo-insurance-quote-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  // Share functionality
  const shareQuote = async () => {
    const shareData = {
      title: "Cargo Insurance Quote",
      text: `Insurance quote for ${cargoTypes[cargoType]?.name} valued at ${formatValue(parseFloat(cargoValue))}: Premium ${formatValue(calculation.totalPremium)} (${calculation.premiumRate.toFixed(3)}%)`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareSuccess(true);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `Cargo Insurance Quote\n` +
        `Cargo: ${cargoTypes[cargoType]?.name}\n` +
        `Value: ${formatValue(parseFloat(cargoValue))}\n` +
        `Premium: ${formatValue(calculation.totalPremium)}\n` +
        `Rate: ${calculation.premiumRate.toFixed(3)}%\n` +
        `Coverage: ${iccCoverages[coverageType as keyof typeof iccCoverages].name}`
      );
      setShareSuccess(true);
    }
    setTimeout(() => setShareSuccess(false), 3000);
  };

  // Chart data
  const costBreakdownData = [
    { name: "Base Premium", value: calculation.basePremium, color: OCEAN_BLUE },
    { name: "War Risk", value: calculation.warRiskPremium, color: "#DC2626" },
    { name: "SRCC", value: calculation.strikesPremium, color: "#F59E0B" },
    { name: "Piracy", value: calculation.piracyPremium, color: LOGISTICS_GREEN },
  ].filter(d => d.value > 0);

  const carrierComparisonData = calculation.carrierQuotes.slice(0, 6).map(q => ({
    name: q.carrier.name.split(" ")[0],
    premium: q.premium,
    rate: q.rate,
  }));

  // Coverage type comparison data
  const coverageComparisonData = [
    { name: "ICC (A)", premium: calculation.totalPremium, color: OCEAN_BLUE },
    { name: "ICC (B)", premium: calculation.totalPremium * 0.75, color: LOGISTICS_GREEN },
    { name: "ICC (C)", premium: calculation.totalPremium * 0.55, color: "#F59E0B" },
  ];

  // Risk assessment data for area chart
  const riskAssessmentData = [
    { name: "Cargo Risk", score: Math.min(100, (cargoTypes[cargoType]?.baseRate || 0.15) * 200), fullMark: 100 },
    { name: "Route Risk", score: Math.min(100, ((routeRiskFactors[route]?.factor || 1) - 0.85) * 400), fullMark: 100 },
    { name: "Transit Risk", score: transportMode === "air" ? 15 : transportMode === "ocean_fcl" ? 35 : 50, fullMark: 100 },
    { name: "Coverage Gap", score: coverageType === "icc_a" ? 10 : coverageType === "icc_b" ? 40 : 70, fullMark: 100 },
    { name: "Overall", score: calculation.riskScore, fullMark: 100 },
  ];

  // Animated badges for hero
  const heroBadges = [
    { label: "Marine Insurance", icon: <Anchor className="h-3 w-3" /> },
    { label: "Cargo Protection", icon: <Shield className="h-3 w-3" /> },
    { label: "Risk Coverage", icon: <AlertTriangle className="h-3 w-3" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8 border border-[var(--ocean)]/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {heroBadges.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="bg-[var(--ocean)]/10 text-[var(--ocean)] dark:bg-[var(--ocean)]/20 dark:text-[var(--ocean)] gap-1 px-3 py-1"
                  >
                    {badge.icon}
                    {badge.label}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Cargo Insurance Quoter
              </h1>
              <p className="text-muted-foreground mt-1 max-w-xl">
                Calculate marine insurance premiums with precision. Get instant quotes based on cargo type, 
                transit route, and coverage options. Compare rates from leading insurance carriers.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={resetForm} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              onClick={exportQuote} 
              className={`gap-2 ${exportSuccess ? "border-green-500 text-green-600" : ""}`}
            >
              <Download className="h-4 w-4" />
              {exportSuccess ? "Exported!" : "Export"}
            </Button>
            <Button 
              variant="outline" 
              onClick={shareQuote}
              className={`gap-2 ${shareSuccess ? "border-green-500 text-green-600" : ""}`}
            >
              <Share2 className="h-4 w-4" />
              {shareSuccess ? "Shared!" : "Share"}
            </Button>
          </div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="gap-1 md:gap-2">
            <Calculator className="h-4 w-4 hidden sm:block" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-1 md:gap-2">
            <BarChart3 className="h-4 w-4 hidden sm:block" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="coverage" className="gap-1 md:gap-2">
            <Shield className="h-4 w-4 hidden sm:block" />
            Coverage
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-1 md:gap-2">
            <BookOpen className="h-4 w-4 hidden sm:block" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-1 md:gap-2">
            <HelpCircle className="h-4 w-4 hidden sm:block" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Cargo Value & Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-3 space-y-2">
                      <Label htmlFor="cargoValue">Insured Value (CIF)</Label>
                      <Input
                        id="cargoValue"
                        type="number"
                        value={cargoValue}
                        onChange={(e) => setCargoValue(e.target.value)}
                        placeholder="Enter cargo value"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
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
                  </div>

                  <div className="space-y-2">
                    <Label>Cargo Type</Label>
                    <Select value={cargoType} onValueChange={setCargoType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(cargoTypes).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span>{data.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {data.category}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Base rate: {(cargoTypes[cargoType]?.baseRate || 0.15).toFixed(2)}%</span>
                      <Badge 
                        variant={
                          cargoTypes[cargoType]?.riskLevel === "low" ? "default" :
                          cargoTypes[cargoType]?.riskLevel === "medium" ? "secondary" :
                          cargoTypes[cargoType]?.riskLevel === "high" ? "destructive" : "destructive"
                        }
                        className="text-xs"
                      >
                        {cargoTypes[cargoType]?.riskLevel} risk
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Packaging Quality</Label>
                    <Select value={packagingType} onValueChange={setPackagingType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Packaging</SelectItem>
                        <SelectItem value="export">Export Quality (-5%)</SelectItem>
                        <SelectItem value="premium">Premium Packaging (-10%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ship className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Transport & Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Transport Mode</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(transportModes).slice(0, 6).map(([key, data]) => (
                        <Button
                          key={key}
                          variant={transportMode === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTransportMode(key)}
                          style={transportMode === key ? { backgroundColor: OCEAN_BLUE } : {}}
                          className="flex items-center gap-2"
                        >
                          {data.icon}
                          <span className="text-xs">{data.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Route / Trade Lane</Label>
                    <Select value={route} onValueChange={setRoute}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(routeRiskFactors).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center justify-between gap-4">
                              <span>{data.name}</span>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {data.warRisk > 0.05 && (
                                  <Badge variant="destructive" className="text-xs">War Risk</Badge>
                                )}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Voyage Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Origin Port</Label>
                      <Select value={originPort} onValueChange={setOriginPort}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select origin" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularPorts.map((port) => (
                            <SelectItem key={port.code} value={port.code}>
                              {port.name}, {port.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination Port</Label>
                      <Select value={destinationPort} onValueChange={setDestinationPort}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {popularPorts.map((port) => (
                            <SelectItem key={port.code} value={port.code}>
                              {port.name}, {port.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ETD</Label>
                      <Input type="date" value={etd} onChange={(e) => setEtd(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>ETA</Label>
                      <Input type="date" value={eta} onChange={(e) => setEta(e.target.value)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5 border-[var(--logistics)]/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Premium Estimate
                  </CardTitle>
                  <CardDescription>
                    Estimated insurance premium based on provided details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <motion.div
                      key={calculation.totalPremium}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-4xl font-bold"
                      style={{ color: LOGISTICS_GREEN }}
                    >
                      {formatValue(calculation.totalPremium)}
                    </motion.div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Estimated Premium
                    </div>
                    <Badge variant="secondary" className="mt-2" style={{ backgroundColor: `rgba(15, 76, 129, 0.1)`, color: OCEAN_BLUE }}>
                      {calculation.premiumRate.toFixed(3)}% of cargo value
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        <span>Base Premium</span>
                      </div>
                      <span className="font-medium">{formatValue(calculation.basePremium)}</span>
                    </div>

                    {includeWarRisk && (
                      <div className="flex justify-between items-center py-1.5 text-sm">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span>War Risk</span>
                        </div>
                        <span className="font-medium">{formatValue(calculation.warRiskPremium)}</span>
                      </div>
                    )}

                    {includeStrikes && (
                      <div className="flex justify-between items-center py-1.5 text-sm">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-amber-500" />
                          <span>SRCC</span>
                        </div>
                        <span className="font-medium">{formatValue(calculation.strikesPremium)}</span>
                      </div>
                    )}

                    {includePiracy && (
                      <div className="flex justify-between items-center py-1.5 text-sm">
                        <div className="flex items-center gap-2">
                          <Ship className="h-4 w-4 text-purple-500" />
                          <span>Piracy Risk</span>
                        </div>
                        <span className="font-medium">{formatValue(calculation.piracyPremium)}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-lg font-semibold">{formatValue(calculation.coverageAmount)}</div>
                      <div className="text-xs text-muted-foreground">Coverage Amount</div>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                      <div className="text-lg font-semibold">{formatValue(calculation.deductible)}</div>
                      <div className="text-xs text-muted-foreground">Deductible</div>
                    </div>
                  </div>

                  {/* Risk Score */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Risk Score</span>
                      <span className={`text-sm font-bold ${
                        calculation.riskScore < 30 ? "text-green-600" :
                        calculation.riskScore < 50 ? "text-amber-600" :
                        calculation.riskScore < 70 ? "text-orange-600" : "text-red-600"
                      }`}>
                        {calculation.riskScore}/100
                      </span>
                    </div>
                    <Progress 
                      value={calculation.riskScore} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {calculation.recommendation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  style={{ backgroundColor: LOGISTICS_GREEN }}
                  onClick={generateQuote}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Quote
                </Button>
              </div>

              {/* Premium Breakdown Pie Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    Premium Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatValue(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Carrier Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Carrier Comparison
                </CardTitle>
                <CardDescription>
                  Compare premiums from leading marine insurance providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={carrierComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" tickFormatter={(v) => formatValue(v)} />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value: number) => formatValue(value)} />
                      <Bar dataKey="premium" fill={OCEAN_BLUE} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {calculation.carrierQuotes.slice(0, 3).map((quote, index) => (
                    <div
                      key={quote.carrier.id}
                      className={`p-3 border rounded-lg ${index === 0 ? "border-green-500 bg-green-50 dark:bg-green-950/30" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {index === 0 && <Badge style={{ backgroundColor: LOGISTICS_GREEN }}>Best Rate</Badge>}
                          <span className="font-medium">{quote.carrier.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold" style={{ color: OCEAN_BLUE }}>{formatValue(quote.premium)}</div>
                          <div className="text-xs text-muted-foreground">{quote.rate.toFixed(3)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coverage Type Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Coverage Type Comparison
                </CardTitle>
                <CardDescription>
                  Premium comparison across ICC coverage types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coverageComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(v) => formatValue(v)} />
                      <Tooltip formatter={(value: number) => formatValue(value)} />
                      <Bar dataKey="premium" radius={[4, 4, 0, 0]}>
                        {coverageComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {coverageComparisonData.map((item) => (
                    <div key={item.name} className="p-2 bg-muted/50 rounded-lg">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground">{formatValue(item.premium)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment Area Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Risk Assessment Visualization
                </CardTitle>
                <CardDescription>
                  Multi-dimensional risk analysis for your shipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={riskAssessmentData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke={OCEAN_BLUE} 
                        fill={OCEAN_BLUE}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {riskAssessmentData.map((item) => (
                    <div key={item.name} className="text-center p-2 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground">{item.name}</div>
                      <div className={`text-lg font-bold ${
                        item.score < 30 ? "text-green-600" :
                        item.score < 50 ? "text-amber-600" :
                        item.score < 70 ? "text-orange-600" : "text-red-600"
                      }`}>
                        {item.score}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Coverage Tab */}
        <TabsContent value="coverage" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    ICC Coverage Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(iccCoverages).map(([key, data]) => (
                    <div
                      key={key}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        coverageType === key 
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                          : "border-border hover:border-[var(--ocean)]/50"
                      }`}
                      onClick={() => setCoverageType(key)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {coverageType === key && (
                            <Check className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                          )}
                          <span className="font-medium">{data.name}</span>
                        </div>
                        <Badge variant={key === "icc_a" ? "default" : key === "icc_b" ? "secondary" : "outline"}>
                          {(data.rateFactor * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{data.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Deductible Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {deductibleOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={deductibleOption === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDeductibleOption(option.value)}
                        style={deductibleOption === option.value ? { backgroundColor: OCEAN_BLUE } : {}}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  
                  {deductibleOption === "custom" && (
                    <div className="space-y-2">
                      <Label htmlFor="customDeductible">Custom Deductible Amount</Label>
                      <Input
                        id="customDeductible"
                        type="number"
                        value={customDeductible}
                        onChange={(e) => setCustomDeductible(e.target.value)}
                        placeholder="Enter amount"
                      />
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Higher deductible = Lower premium. Current: {formatValue(calculation.deductible)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Coverage</CardTitle>
                  <CardDescription>
                    Extend your policy with specialized clauses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <Label>War Risk Coverage</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        War, capture, piracy, terrorism, mines
                      </p>
                    </div>
                    <Switch
                      checked={includeWarRisk}
                      onCheckedChange={setIncludeWarRisk}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-amber-500" />
                        <Label>Strikes, Riots & Civil Commotion</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        SRCC coverage for labor disputes
                      </p>
                    </div>
                    <Switch
                      checked={includeStrikes}
                      onCheckedChange={setIncludeStrikes}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Ship className="h-4 w-4 text-purple-500" />
                        <Label>Piracy Risk</Label>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Hijacking and piracy incidents
                      </p>
                    </div>
                    <Switch
                      checked={includePiracy}
                      onCheckedChange={setIncludePiracy}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Coverage Summary - {iccCoverages[coverageType as keyof typeof iccCoverages].name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">COVERED</div>
                      <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                        {iccCoverages[coverageType as keyof typeof iccCoverages].includes.map((item, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-2">EXCLUDED</div>
                      <div className="grid grid-cols-2 gap-1">
                        {iccCoverages[coverageType as keyof typeof iccCoverages].excludes.map((item, i) => (
                          <div key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
                            <AlertTriangle className="h-3 w-3 text-red-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Custom Rate Override</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="customRate">Negotiated Rate (%)</Label>
                    <Input
                      id="customRate"
                      type="number"
                      step="0.01"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder={`Est: ${(cargoTypes[cargoType]?.baseRate || 0.15).toFixed(2)}%`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your negotiated rate to override the estimated rate
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {/* Educational Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  What is Cargo Insurance?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Cargo insurance, also known as marine cargo insurance, is a type of property insurance that protects goods 
                  while they are being transported from one location to another. This coverage applies to shipments traveling 
                  by sea, air, rail, or road, and protects against loss or damage caused by various perils during transit. 
                  Unlike carrier liability, which is often limited by international conventions and weight-based calculations, 
                  cargo insurance provides comprehensive protection based on the actual value of your goods.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The fundamental principle behind cargo insurance is risk transfer. When you ship goods internationally, 
                  numerous risks exist including vessel accidents, port handling damage, theft, piracy, natural disasters, 
                  and even war-related incidents. By purchasing cargo insurance, you transfer these risks from your business 
                  to the insurance company in exchange for a premium payment. This allows businesses to protect their profit 
                  margins and maintain financial stability even when shipments encounter problems. Cargo insurance is particularly 
                  important because most sales contracts (under Incoterms) require either the buyer or seller to arrange 
                  insurance coverage, and the terms of coverage can significantly impact the total landed cost of goods.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Ship className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Types of Marine Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Marine insurance encompasses several distinct types of coverage, each designed for specific transportation 
                  scenarios and cargo characteristics. The most common classification divides marine insurance into three 
                  main categories: voyage policies, time policies, and mixed policies. A voyage policy covers a specific 
                  shipment from origin to destination, making it ideal for one-time or irregular shippers. Time policies 
                  provide coverage for all shipments made during a specified period (typically one year), offering convenience 
                  and often better rates for frequent shippers. Mixed policies combine elements of both, providing flexibility 
                  for businesses with varying shipping patterns.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Beyond these structural classifications, marine insurance also varies by the type of coverage provided. 
                  Open cargo policies (also called floating policies) automatically cover all shipments within defined 
                  parameters, requiring only declaration of individual shipments. Single voyage policies cover individual 
                  shipments and must be arranged separately for each transit. Specialized coverage types include warehouse 
                  to warehouse coverage (extending protection from the seller&apos;s warehouse to the buyer&apos;s warehouse), 
                  contingent insurance (providing backup coverage when primary insurance fails), and reinsurance (where 
                  insurers transfer portions of their risk to other insurers). Understanding these options helps shippers 
                  select the most appropriate and cost-effective coverage for their specific needs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Scale className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Understanding Institute Cargo Clauses (A, B, C)
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  The Institute Cargo Clauses (ICC) are standardized insurance policy wordings developed by the Institute 
                  of London Underwriters and now maintained by the International Underwriting Association. These clauses 
                  provide a consistent framework for marine cargo insurance, making it easier for shippers, brokers, and 
                  insurers to understand coverage terms. The three main clauses - ICC (A), ICC (B), and ICC (C) - represent 
                  different levels of coverage, with ICC (A) being the most comprehensive and ICC (C) being the most basic.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">ICC (A) - All Risks</h4>
                    <p className="text-sm text-muted-foreground">
                      The most comprehensive coverage available. Covers all risks of loss or damage except those specifically 
                      excluded. Best suited for high-value, fragile, or sensitive cargo. Premium rates are highest but provide 
                      maximum peace of mind.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">ICC (B) - Intermediate</h4>
                    <p className="text-sm text-muted-foreground">
                      Named perils coverage that strikes a balance between protection and cost. Covers major casualties like 
                      fire, explosion, sinking, and natural disasters. Does not cover theft, pilferage, or partial water damage.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">ICC (C) - Basic</h4>
                    <p className="text-sm text-muted-foreground">
                      The most economical option covering only major catastrophes: fire, explosion, sinking, stranding, 
                      collision, and general average sacrifice. Suitable for robust, low-value cargo that can withstand 
                      normal handling.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Claims Process
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Filing a cargo insurance claim requires prompt action and thorough documentation. The process typically 
                  begins immediately upon discovery of loss or damage. First, the insured must notify the insurance company 
                  or broker within the timeframe specified in the policy (usually 24-72 hours). Failure to provide timely 
                  notice can result in claim denial. Simultaneously, the carrier should be notified in writing to preserve 
                  rights of recovery against them.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The documentation required for a claim typically includes: the original insurance policy or certificate, 
                  the commercial invoice showing the value of goods, the bill of lading or other transport documents, 
                  packing lists, a survey report (for visible damage), the carrier&apos;s delivery receipt with damage notations, 
                  photographs of damage, and repair or replacement quotes. For total losses, additional documentation may 
                  include proof of abandonment or sale of salvage. The claims process concludes with the insurer&apos;s assessment 
                  and payment, which may take weeks to months depending on the complexity of the claim and the cooperation 
                  of all parties involved.
                </p>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Cargo Insurance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proTips.map((tip, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2" style={{ color: OCEAN_BLUE }}>
                        {tip.icon}
                        <span className="font-medium">{tip.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {commonMistakes.map((mistake, index) => (
                    <AccordionItem key={index} value={`mistake-${index}`}>
                      <AccordionTrigger className="text-left">
                        <span className="font-medium">{mistake.title}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{mistake.description}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about cargo insurance answered in detail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="faq-1" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">What is the difference between ICC (A), ICC (B), and ICC (C) coverage?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      The Institute Cargo Clauses represent three distinct levels of coverage, each designed for different 
                      risk profiles and cargo types. ICC (A), often called &quot;All Risks&quot; coverage, provides the most 
                      comprehensive protection. It covers all risks of loss or damage to cargo during transit, except for 
                      specifically excluded perils such as willful misconduct, inherent vice, delay, and nuclear incidents. 
                      This coverage is ideal for high-value goods, electronics, fragile items, and cargo where partial damage 
                      is likely and costly.
                    </p>
                    <p className="mb-3">
                      ICC (B) offers named perils coverage, meaning it only covers risks specifically listed in the policy. 
                      These include fire, explosion, vessel sinking or stranding, collision, earthquake, volcanic eruption, 
                      lightning, general average sacrifice, jettison, washing overboard, and entry of seawater. It does NOT 
                      cover theft, pilferage, non-delivery, or partial water damage - making it unsuitable for theft-prone 
                      cargo or goods susceptible to water damage.
                    </p>
                    <p>
                      ICC (C) provides the most basic coverage, protecting only against major catastrophes like fire, explosion, 
                      sinking, stranding, collision, and general average sacrifice. It&apos;s the most economical option but 
                      leaves significant gaps in coverage. This is best suited for bulk commodities, raw materials, and 
                      low-value robust cargo where partial loss is unlikely or acceptable.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">Why should I insure for CIF value plus 10%?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Insuring your cargo for Cost, Insurance, and Freight (CIF) value plus 10% is a widely recommended 
                      practice that provides crucial financial protection beyond just the cargo value. The additional 10% 
                      serves multiple important purposes that can significantly impact your financial recovery in the event 
                      of a claim.
                    </p>
                    <p className="mb-3">
                      First, when a loss occurs, there are typically additional expenses beyond the cargo value itself. These 
                      include survey fees to assess the damage, inspection costs, claims processing fees, and sometimes legal 
                      fees if disputes arise. Without the additional 10% coverage, these expenses would come out of your own 
                      pocket, reducing your effective recovery.
                    </p>
                    <p className="mb-3">
                      Second, the concept of &quot;average&quot; in marine insurance means that if you underinsure your cargo, 
                      any claim payment will be proportionally reduced. For example, if you insure for 90% of the actual value 
                      and suffer a partial loss, your claim will only pay 90% of the loss amount. The 10% buffer helps ensure 
                      you&apos;re fully covered and won&apos;t face average deductions.
                    </p>
                    <p>
                      Third, market fluctuations can increase cargo value between the time insurance is purchased and when 
                      a loss occurs. The 10% margin provides protection against such increases. Additionally, some insurance 
                      policies require minimum coverage levels, and the CIF + 10% standard ensures compliance with these 
                      requirements while providing comprehensive protection.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">What is General Average and why do I need coverage for it?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      General Average is a principle of maritime law that dates back to ancient times and remains relevant 
                      today. When a ship encounters an emergency situation where the captain must intentionally sacrifice 
                      part of the cargo, equipment, or incur extraordinary expenses to save the vessel and remaining cargo, 
                      all parties with an interest in the voyage must contribute proportionally to cover the losses - even 
                      if their specific cargo was not sacrificed or damaged.
                    </p>
                    <p className="mb-3">
                      For example, if a vessel encounters heavy weather and the captain decides to jettison (throw overboard) 
                      some containers to lighten the ship and prevent sinking, the owners of the remaining cargo must 
                      contribute to compensate the owners of the sacrificed cargo. Similarly, if a ship must divert to a 
                      port of refuge for emergency repairs, all cargo owners share the costs of the diversion and delays.
                    </p>
                    <p className="mb-3">
                      Without General Average coverage, you could face significant unexpected costs even when your cargo 
                      arrives safely. General Average contributions are calculated based on the value of your cargo relative 
                      to the total value of ship and cargo, which can result in substantial payments. A General Average 
                      declaration requires cargo owners to post a security deposit (cash or bond) before their cargo can be 
                      released - a process that can take weeks or months.
                    </p>
                    <p>
                      Marine cargo insurance with General Average coverage handles these contributions on your behalf, 
                      eliminating the financial burden and administrative complexity. The insurer posts the required security, 
                      calculates and pays your contribution, and manages the entire process. This coverage is included in 
                      standard Institute Cargo Clauses but may require special attention in policies with limited coverage.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">How do deductibles affect my cargo insurance premium?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Deductibles represent the portion of any loss that you, as the insured, agree to bear before the 
                      insurance coverage kicks in. In cargo insurance, deductibles serve as a risk-sharing mechanism that 
                      benefits both the insurer and the insured when structured appropriately. Understanding how deductibles 
                      work helps you optimize your insurance costs while maintaining adequate protection.
                    </p>
                    <p className="mb-3">
                      The basic principle is straightforward: higher deductibles result in lower premiums. This happens because 
                      you&apos;re taking on more of the risk yourself, reducing the insurer&apos;s expected payout frequency 
                      and amount. For cargo insurance, a typical deductible might be expressed as a percentage of the insured 
                      value (e.g., 0.1% or 0.5%) or as a fixed monetary amount per shipment or per claim.
                    </p>
                    <p className="mb-3">
                      When choosing a deductible level, consider your loss history, cargo value, and financial capacity. If 
                      you ship frequently with minimal claims history, a higher deductible can generate significant premium 
                      savings over time. However, ensure the deductible amount is affordable if a loss occurs. For high-value 
                      shipments, even a small percentage deductible can represent a substantial sum.
                    </p>
                    <p>
                      Some policies offer franchise deductibles, where losses below the deductible amount are not paid, but 
                      losses above it are paid in full. Others use straight deductibles where the deductible amount is 
                      subtracted from every claim regardless of size. Understanding which type applies to your policy is 
                      essential for proper risk management. Also note that some types of losses (like General Average 
                      contributions) may not be subject to deductibles depending on your policy terms.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">When should I add War Risk and SRCC coverage to my policy?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      War Risk and Strikes, Riots, and Civil Commotion (SRCC) coverage are additional clauses that extend 
                      your cargo insurance beyond standard perils. Understanding when to add these coverages is crucial for 
                      comprehensive protection, as standard Institute Cargo Clauses exclude losses caused by war, civil war, 
                      revolution, rebellion, insurrection, strikes, riots, and civil commotion.
                    </p>
                    <p className="mb-3">
                      War Risk coverage becomes essential when your cargo transits through or near areas of armed conflict, 
                      political instability, or heightened military activity. Current high-risk areas include the Red Sea 
                      and Gulf of Aden (due to attacks on commercial shipping), the Persian Gulf region, areas around Ukraine, 
                      and certain African coastal waters. Even if your cargo&apos;s destination is peaceful, the route may 
                      pass through dangerous waters. War Risk premiums are quoted separately and can change rapidly based on 
                      geopolitical developments.
                    </p>
                    <p className="mb-3">
                      SRCC coverage protects against losses from labor disputes, political unrest, and civil disturbances. 
                      Consider this coverage when shipping to or through regions with political instability, active labor 
                      movements, or recent civil unrest. Ports in developing nations, areas with contested elections, or 
                      regions experiencing economic hardship may present elevated SRCC risks. The relatively low cost of 
                      SRCC coverage compared to potential losses makes it a wise addition for most international shipments.
                    </p>
                    <p>
                      Many experienced shippers include both War Risk and SRCC coverage as standard practice for all 
                      international shipments, given the unpredictable nature of geopolitical events. The cost is typically 
                      modest relative to total premium, and the protection provides peace of mind. Work with your insurance 
                      broker to stay informed about current risk zones and ensure your coverage is activated before your 
                      cargo begins its journey.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-6" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">How does carrier liability differ from cargo insurance?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Understanding the distinction between carrier liability and cargo insurance is fundamental to protecting 
                      your goods in transit. Many shippers mistakenly believe that if something happens to their cargo, the 
                      carrier will fully compensate them for the loss. This assumption can lead to significant financial 
                      exposure, as carrier liability is often severely limited by international conventions and contractual 
                      terms.
                    </p>
                    <p className="mb-3">
                      Ocean carriers operate under the Hague-Visby Rules or similar conventions, which limit their liability 
                      to approximately $667 per package or $2 per kilogram of cargo weight, whichever is higher. This means 
                      a container of electronics worth $200,000 but weighing only 5,000 kg would result in maximum carrier 
                      liability of just $10,000 - a fraction of the actual value. Air carriers have their own limitation 
                      formulas under the Montreal Convention, typically around 22 SDR (Special Drawing Rights) per kilogram. 
                      Road and rail carriers have similar limitations under their respective conventions.
                    </p>
                    <p className="mb-3">
                      Moreover, carriers can often avoid liability entirely by proving the loss resulted from causes beyond 
                      their control, including perils of the sea, act of God, act of war, fault of the shipper, or inherent 
                      vice of the goods. Even when carriers are liable, the claims process can be lengthy and contentious, 
                      requiring proof of carrier negligence.
                    </p>
                    <p>
                      Cargo insurance, in contrast, provides coverage based on the actual value of your goods regardless of 
                      carrier fault (except for excluded perils). The claims process is typically more straightforward, and 
                      you&apos;re protected even when carriers deny liability. Cargo insurance also covers risks that carrier 
                      liability never would, such as theft, pilferage, and damage during transshipment. This fundamental 
                      difference makes cargo insurance essential for any serious international shipper.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-7" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">What factors affect my cargo insurance premium rate?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Cargo insurance premiums are calculated based on multiple factors that assess the risk of loss or 
                      damage during transit. Understanding these factors helps you make informed decisions about coverage 
                      and identify opportunities to reduce costs while maintaining adequate protection.
                    </p>
                    <p className="mb-3">
                      <strong>Cargo characteristics</strong> significantly impact rates. High-value goods naturally command 
                      higher premiums due to the greater potential loss amount. Fragile items, perishables, and goods 
                      susceptible to temperature or humidity damage carry elevated risk scores. Hazardous materials require 
                      specialized coverage and higher premiums due to the potential for catastrophic losses and regulatory 
                      complications. Conversely, robust, low-value commodities like bulk grains or raw materials typically 
                      qualify for lower rates.
                    </p>
                    <p className="mb-3">
                      <strong>Transit factors</strong> include the mode of transport, route, distance, and seasonal timing. 
                      Air freight typically has lower risk scores than ocean freight due to shorter transit times and 
                      generally better handling, though air shipments of certain commodities may face higher rates. Routes 
                      through high-risk areas (piracy zones, war zones, regions with poor port infrastructure) attract 
                      additional premiums. Weather seasons also matter - monsoon season shipments may carry higher rates.
                    </p>
                    <p>
                      <strong>Policy factors</strong> include coverage type (ICC A/B/C), deductible level, claims history, 
                      and policy volume. Shippers with clean claims records can negotiate better rates, while those with 
                      frequent claims face higher premiums. High-volume shippers benefit from economies of scale and can 
                      secure favorable terms through annual policies. Packaging quality, security measures, and carrier 
                      selection also influence rates - shippers who demonstrate strong risk management practices often 
                      receive preferred pricing.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-8" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="font-medium">How quickly must I report damage to file a successful claim?</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-3">
                      Timely reporting of cargo damage or loss is one of the most critical aspects of the claims process. 
                      Insurance policies typically specify strict notification requirements, and failure to comply can result 
                      in claim denial regardless of the claim&apos;s validity. Understanding these timelines and taking 
                      prompt action significantly improves your chances of a successful claim outcome.
                    </p>
                    <p className="mb-3">
                      Most cargo insurance policies require notification to the insurer within 24 to 72 hours of discovering 
                      damage or loss. Some policies specify immediate notification, while others allow reasonable time based 
                      on circumstances. The notification should include basic information about the shipment, the nature of 
                      the loss, and any actions taken. Initial notification doesn&apos;t need to include full documentation - 
                      that can follow later - but it must be timely to preserve your rights under the policy.
                    </p>
                    <p className="mb-3">
                      Simultaneously, you must notify the carrier in writing within the timeframe specified by applicable 
                      transport conventions. For ocean shipments under Hague-Visby Rules, damage must be noted on the delivery 
                      receipt or reported in writing within 3 days of delivery. For air shipments, written notice to the 
                      carrier must typically be given within 14 days. Missing these deadlines can compromise your ability 
                      to recover from the carrier, which may affect your insurance claim.
                    </p>
                    <p>
                      Best practice is to inspect shipments immediately upon arrival and document any visible damage with 
                      photographs and detailed written notes on the delivery receipt. For concealed damage discovered after 
                      unpacking, report immediately upon discovery - the clock starts when you discover or should have 
                      discovered the damage. Having clear internal procedures for receiving and inspecting shipments helps 
                      ensure timely reporting and protects your insurance rights.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CargoInsuranceQuoter;
