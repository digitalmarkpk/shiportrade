"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Ship,
  Plane,
  Truck,
  Train,
  Package,
  DollarSign,
  AlertTriangle,
  Info,
  TrendingUp,
  Shield,
  Calculator,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  BookOpen,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  Globe,
  Clock,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  AreaChart,
  Area,
  ReferenceLine,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// SDR Exchange rates (approximate, should be updated regularly)
const SDR_RATES: Record<string, number> = {
  USD: 1.35,
  EUR: 1.24,
  GBP: 1.07,
  JPY: 203.45,
  CNY: 9.78,
  CHF: 1.19,
  HKD: 10.55,
  SGD: 1.82,
  AUD: 2.08,
  CAD: 1.85,
  INR: 112.35,
  AED: 4.96,
};

// Transport modes with icons and colors
const TRANSPORT_MODES = {
  sea: { name: "Sea Freight", icon: Ship, color: OCEAN_BLUE },
  air: { name: "Air Freight", icon: Plane, color: LOGISTICS_GREEN },
  road: { name: "Road Transport", icon: Truck, color: "#F59E0B" },
  rail: { name: "Rail Transport", icon: Train, color: "#8B5CF6" },
};

// Liability conventions with detailed limits
const CONVENTIONS = {
  sea: {
    "hague-visby": {
      name: "Hague-Visby Rules",
      sdrPerKg: 2,
      sdrPerPackage: 666.67,
      year: 1968,
      description: "Most widely adopted international convention for sea carriage",
      countries: "Most maritime nations",
      noticeDays: 3,
      limitationPeriod: "1 year",
    },
    hamburg: {
      name: "Hamburg Rules",
      sdrPerKg: 2.5,
      sdrPerPackage: 835,
      year: 1978,
      description: "More cargo-friendly than Hague-Visby, higher limits",
      countries: "Developing nations, limited adoption",
      noticeDays: 15,
      limitationPeriod: "2 years",
    },
    rotterdam: {
      name: "Rotterdam Rules",
      sdrPerKg: 3,
      sdrPerPackage: 875,
      year: 2008,
      description: "Modern convention for door-to-door carriage",
      countries: "Limited ratification",
      noticeDays: 21,
      limitationPeriod: "2 years",
    },
    hague: {
      name: "Hague Rules (Original)",
      sdrPerKg: 0.67,
      sdrPerPackage: 500,
      year: 1924,
      description: "Original convention, very limited carrier liability",
      countries: "Legacy, rarely applied now",
      noticeDays: 3,
      limitationPeriod: "1 year",
    },
  },
  air: {
    montreal: {
      name: "Montreal Convention",
      sdrPerKg: 22,
      sdrPerPackage: null,
      year: 1999,
      description: "Standard convention for international air carriage",
      countries: "Most nations with international aviation",
      noticeDays: 21,
      limitationPeriod: "2 years",
    },
    warsaw: {
      name: "Warsaw Convention",
      sdrPerKg: 17,
      sdrPerPackage: null,
      year: 1929,
      description: "Legacy convention, lower limits",
      countries: "Limited use, mainly domestic",
      noticeDays: 14,
      limitationPeriod: "2 years",
    },
  },
  road: {
    cmr: {
      name: "CMR Convention",
      sdrPerKg: 8.33,
      sdrPerPackage: null,
      year: 1956,
      description: "European convention for road transport",
      countries: "Most European countries",
      noticeDays: 7,
      limitationPeriod: "1 year",
    },
  },
  rail: {
    cim: {
      name: "CIM Convention (COTIF)",
      sdrPerKg: 17,
      sdrPerPackage: null,
      year: 1980,
      description: "European convention for rail transport",
      countries: "European railway network",
      noticeDays: 7,
      limitationPeriod: "1 year",
    },
    smgs: {
      name: "SMGS Agreement",
      sdrPerKg: 15,
      sdrPerPackage: null,
      year: 1951,
      description: "Railway agreement for CIS and Asian countries",
      countries: "CIS, China, Iran, Turkey",
      noticeDays: 6,
      limitationPeriod: "9 months",
    },
  },
};

// Insurance recommendations based on coverage gap
const getInsuranceRecommendation = (
  coverageGap: number,
  gapPercentage: number,
  _cargoValue: number
): {
  level: "critical" | "high" | "moderate" | "low";
  title: string;
  description: string;
  actions: string[];
} => {
  if (gapPercentage >= 80) {
    return {
      level: "critical",
      title: "Critical Insurance Gap",
      description: `Your cargo has minimal carrier liability coverage. A loss could result in significant financial exposure.`,
      actions: [
        "Obtain comprehensive marine cargo insurance immediately",
        "Consider ICC (A) All Risks coverage for maximum protection",
        "Ensure coverage includes general average contribution",
        "Add war risk and strikes clauses for high-risk routes",
      ],
    };
  } else if (gapPercentage >= 50) {
    return {
      level: "high",
      title: "High Insurance Gap",
      description: "Carrier liability covers less than half your cargo value. Insurance is strongly recommended.",
      actions: [
        "Obtain marine cargo insurance for the gap amount",
        "Consider ICC (B) or ICC (A) coverage",
        "Review policy deductibles and ensure they're reasonable",
        "Document cargo condition before shipment",
      ],
    };
  } else if (gapPercentage >= 20) {
    return {
      level: "moderate",
      title: "Moderate Insurance Gap",
      description: "Carrier liability provides reasonable coverage, but insurance adds important protection.",
      actions: [
        "Consider cargo insurance for complete protection",
        "ICC (C) may be sufficient for low-risk cargo",
        "Ensure proper packaging to avoid carrier defenses",
        "Maintain detailed shipping records",
      ],
    };
  } else {
    return {
      level: "low",
      title: "Low Insurance Gap",
      description: "Carrier liability provides good coverage, but insurance still recommended for full protection.",
      actions: [
        "Consider insurance for complete peace of mind",
        "Focus on proper packaging and documentation",
        "Ensure accurate cargo declaration",
        "Review carrier's liability terms in contract of carriage",
      ],
    };
  }
};

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is carrier liability and why does it matter?",
    answer: "Carrier liability is the legal responsibility a transport provider has for loss, damage, or delay of cargo during transit. It matters because it determines the maximum compensation you can receive if something goes wrong with your shipment. Unlike full-value insurance, carrier liability is often limited to a fraction of your cargo's actual value, calculated per kilogram or per package based on international conventions.",
  },
  {
    question: "Why are liability limits calculated in SDR (Special Drawing Rights)?",
    answer: "SDR is an international reserve asset created by the IMF, used as a stable unit of account for international conventions. Using SDR eliminates currency fluctuations in legal documents and ensures consistent liability calculations worldwide. One SDR is currently equivalent to approximately 1.35 USD. This standardization allows carriers and shippers to have predictable liability regardless of their location or currency.",
  },
  {
    question: "What is the difference between Hague-Visby and Rotterdam Rules?",
    answer: "Hague-Visby Rules (1968) are the most widely adopted sea transport convention with limits of 2 SDR/kg or 666.67 SDR/package. Rotterdam Rules (2008) are more modern with higher limits (3 SDR/kg or 875 SDR/package) and cover door-to-door multimodal transport. However, Rotterdam Rules have limited ratification. Hague-Visby remains the industry standard in most major shipping nations.",
  },
  {
    question: "Can I increase carrier liability beyond the standard limits?",
    answer: "Yes, you can declare a higher value for carriage before shipment. This is known as 'declared value for carriage' and requires the carrier's agreement. You'll typically pay an additional freight charge for the increased liability coverage. However, this is still not a substitute for cargo insurance, as carrier defenses (like perils of the sea) may still apply. Always consider this option for high-value shipments.",
  },
  {
    question: "What happens if my carrier is found negligent?",
    answer: "If the carrier is proven negligent (failure to exercise due diligence, unseaworthy vessel, improper handling), they may lose their right to limit liability. This means you could potentially recover the full value of your cargo. However, proving negligence can be complex and may require legal action. The burden of proof typically falls on the cargo owner, making cargo insurance a more reliable protection.",
  },
  {
    question: "How does package vs weight-based liability calculation work?",
    answer: "Under most conventions, carrier liability is the higher of the two calculations: weight-based (SDR per kilogram × total weight) or package-based (SDR per package × number of packages). For example, under Hague-Visby: 5000 kg cargo in 50 packages = max(5000 × 2, 50 × 666.67) = max(10,000, 33,333) = 33,333 SDR. Package limits often benefit breakbulk or unitized cargo.",
  },
  {
    question: "Do I still need insurance if carrier liability covers my cargo value?",
    answer: "Even if carrier liability appears sufficient, insurance is recommended because: (1) Carrier defenses may void liability (Act of God, perils of the sea, inherent vice), (2) Proving carrier fault can be legally challenging, (3) Insurance provides faster claims settlement, (4) Insurance covers costs carrier liability doesn't (general average, salvage charges, survey fees), and (5) Higher deductibles may apply to carrier liability claims.",
  },
  {
    question: "What are the time limits for filing a carrier liability claim?",
    answer: "Time limits vary by convention. Notice of loss must typically be given within 3 days (sea) to 21 days (air). The limitation period for legal action ranges from 9 months to 2 years depending on the convention. Missing these deadlines may bar your claim entirely. Montreal Convention has a strict 2-year limitation period. Always document and report damage immediately upon discovery.",
  },
];

export function LiabilityLimitCalculator() {
  // Input states
  const [transportMode, setTransportMode] = useState<keyof typeof TRANSPORT_MODES>("sea");
  const [convention, setConvention] = useState<string>("hague-visby");
  const [cargoValue, setCargoValue] = useState<string>("100000");
  const [currency, setCurrency] = useState<string>("USD");
  const [grossWeight, setGrossWeight] = useState<string>("5000");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [numberOfPackages, setNumberOfPackages] = useState<string>("50");
  const [packageUnit, setPackageUnit] = useState<string>("cartons");
  const [activeTab, setActiveTab] = useState<string>("calculator");

  // Get available conventions for selected transport mode
  const availableConventions = useMemo(() => {
    return CONVENTIONS[transportMode] || {};
  }, [transportMode]);

  // Set default convention when transport mode changes
  const handleTransportModeChange = (mode: keyof typeof TRANSPORT_MODES) => {
    setTransportMode(mode);
    const conventions = Object.keys(CONVENTIONS[mode]);
    if (conventions.length > 0) {
      setConvention(conventions[0]);
    }
  };

  // Convert weight to kg
  const weightInKg = useMemo(() => {
    const weight = parseFloat(grossWeight) || 0;
    switch (weightUnit) {
      case "lb":
        return weight * 0.453592;
      case "t":
        return weight * 1000;
      default:
        return weight;
    }
  }, [grossWeight, weightUnit]);

  // Main calculation
  const calculation = useMemo(() => {
    const cargoValueNum = parseFloat(cargoValue) || 0;
    const packages = parseFloat(numberOfPackages) || 0;
    const sdrRate = SDR_RATES[currency] || 1.35;

    // Get convention data
    const conventionData = (CONVENTIONS[transportMode] as Record<string, unknown>)?.[convention] as {
      sdrPerKg: number;
      sdrPerPackage: number | null;
      year: number;
      name: string;
      description: string;
      countries: string;
      noticeDays: number;
      limitationPeriod: string;
    } | undefined;

    if (!conventionData) {
      return null;
    }

    // Calculate weight-based limit
    const weightBasedLimitSDR = conventionData.sdrPerKg * weightInKg;
    const weightBasedLimitLocal = weightBasedLimitSDR * sdrRate;

    // Calculate package-based limit (if applicable)
    const packageBasedLimitSDR = conventionData.sdrPerPackage ? conventionData.sdrPerPackage * packages : 0;
    const packageBasedLimitLocal = packageBasedLimitSDR * sdrRate;

    // Carrier liability is the higher of the two
    const carrierLiabilitySDR = Math.max(weightBasedLimitSDR, packageBasedLimitSDR);
    const carrierLiabilityLocal = carrierLiabilitySDR * sdrRate;

    // Coverage gap analysis
    const coverageGap = Math.max(0, cargoValueNum - carrierLiabilityLocal);
    const gapPercentage = cargoValueNum > 0 ? (coverageGap / cargoValueNum) * 100 : 0;
    const coveragePercentage = cargoValueNum > 0 ? ((carrierLiabilityLocal / cargoValueNum) * 100) : 0;

    // Insurance recommendation
    const recommendation = getInsuranceRecommendation(coverageGap, gapPercentage, cargoValueNum);

    // For visualization - comparison data
    const comparisonData = [
      {
        name: "Cargo Value",
        value: cargoValueNum,
        color: "#F59E0B",
      },
      {
        name: "Carrier Liability",
        value: Math.min(carrierLiabilityLocal, cargoValueNum),
        color: OCEAN_BLUE,
      },
      {
        name: "Coverage Gap",
        value: coverageGap,
        color: "#EF4444",
      },
    ];

    // For coverage breakdown
    const coverageBreakdown = [
      {
        name: "Covered by Carrier",
        value: Math.min(carrierLiabilityLocal, cargoValueNum),
        percentage: Math.min(100, coveragePercentage),
      },
      {
        name: "Uncovered Gap",
        value: coverageGap,
        percentage: gapPercentage,
      },
    ];

    // Comparison across conventions
    const conventionComparison = Object.entries(CONVENTIONS[transportMode] || {}).map(([key, conv]) => {
      const convData = conv as { sdrPerKg: number; sdrPerPackage: number | null; name: string };
      const weightLimit = convData.sdrPerKg * weightInKg * sdrRate;
      const pkgLimit = convData.sdrPerPackage ? convData.sdrPerPackage * packages * sdrRate : 0;
      const totalLimit = Math.max(weightLimit, pkgLimit);
      return {
        key,
        name: convData.name,
        limit: totalLimit,
        coverage: Math.min(100, (totalLimit / cargoValueNum) * 100),
      };
    });

    // Mode comparison data for radar chart
    const modeComparisonData = Object.entries(CONVENTIONS).map(([mode, convs]) => {
      const modeConvs = convs as Record<string, { sdrPerKg: number; sdrPerPackage: number | null; name: string }>;
      const firstConv = Object.values(modeConvs)[0];
      const limit = firstConv ? Math.max(
        firstConv.sdrPerKg * weightInKg * sdrRate,
        firstConv.sdrPerPackage ? firstConv.sdrPerPackage * packages * sdrRate : 0
      ) : 0;
      return {
        mode: mode.charAt(0).toUpperCase() + mode.slice(1),
        limit: Math.min(100, (limit / cargoValueNum) * 100),
        absoluteLimit: limit,
      };
    });

    // Time value analysis
    const timeValueData = Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      potentialLoss: cargoValueNum * (1 - coveragePercentage / 100),
      protectedValue: Math.min(carrierLiabilityLocal, cargoValueNum),
      cumulativeRisk: cargoValueNum * (1 - coveragePercentage / 100) * (i + 1) / 12,
    }));

    // Risk assessment radar
    const riskRadarData = [
      { subject: "Coverage", value: coveragePercentage, fullMark: 100 },
      { subject: "Speed to Claim", value: 60, fullMark: 100 },
      { subject: "Documentation", value: 75, fullMark: 100 },
      { subject: "Legal Certainty", value: 55, fullMark: 100 },
      { subject: "Cost Efficiency", value: 80, fullMark: 100 },
    ];

    return {
      cargoValue: cargoValueNum,
      weightInKg,
      packages,
      sdrRate,
      conventionData,
      weightBasedLimitSDR,
      weightBasedLimitLocal,
      packageBasedLimitSDR,
      packageBasedLimitLocal,
      carrierLiabilitySDR,
      carrierLiabilityLocal,
      coverageGap,
      gapPercentage,
      coveragePercentage,
      recommendation,
      comparisonData,
      coverageBreakdown,
      conventionComparison,
      modeComparisonData,
      timeValueData,
      riskRadarData,
    };
  }, [transportMode, convention, cargoValue, currency, weightInKg, numberOfPackages]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const TransportIcon = TRANSPORT_MODES[transportMode]?.icon || Ship;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#1a5a8f] to-[#2E8B57] p-8 md:p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Carrier Liability Calculator
              </h1>
              <p className="text-white/80 mt-1">
                Calculate carrier liability limits under international transport conventions
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Ship className="h-5 w-5 text-white/70" />
                <span className="text-white/70 text-sm">Sea Freight</span>
              </div>
              <p className="text-white font-bold text-lg">2-3 SDR/kg</p>
              <p className="text-white/60 text-xs">Hague-Visby / Rotterdam</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="h-5 w-5 text-white/70" />
                <span className="text-white/70 text-sm">Air Freight</span>
              </div>
              <p className="text-white font-bold text-lg">17-22 SDR/kg</p>
              <p className="text-white/60 text-xs">Warsaw / Montreal</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-white/70" />
                <span className="text-white/70 text-sm">Road Transport</span>
              </div>
              <p className="text-white font-bold text-lg">8.33 SDR/kg</p>
              <p className="text-white/60 text-xs">CMR Convention</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Train className="h-5 w-5 text-white/70" />
                <span className="text-white/70 text-sm">Rail Transport</span>
              </div>
              <p className="text-white font-bold text-lg">15-17 SDR/kg</p>
              <p className="text-white/60 text-xs">CIM / SMGS</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Globe className="h-4 w-4" />
              <span>4 Transport Modes</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <BookOpen className="h-4 w-4" />
              <span>9 International Conventions</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Shield className="h-4 w-4" />
              <span>Insurance Gap Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <Clock className="h-4 w-4" />
              <span>Time Limits Reference</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Gap Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Compare</span>
          </TabsTrigger>
          <TabsTrigger value="visualizations" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Visuals</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Liability Parameters
                </CardTitle>
                <CardDescription>Enter shipment details to calculate carrier liability limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transport Mode Selection */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <TransportIcon className="h-4 w-4" style={{ color: TRANSPORT_MODES[transportMode]?.color }} />
                    Transport Mode
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(TRANSPORT_MODES).map(([key, mode]) => {
                      const Icon = mode.icon;
                      const isActive = transportMode === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleTransportModeChange(key as keyof typeof TRANSPORT_MODES)}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                            isActive
                              ? "border-[#0F4C81] bg-[#0F4C81]/10"
                              : "border-slate-200 dark:border-slate-700 hover:border-[#0F4C81]/50"
                          }`}
                        >
                          <Icon
                            className="h-5 w-5"
                            style={{ color: isActive ? OCEAN_BLUE : mode.color }}
                          />
                          <span className="text-xs font-medium">{mode.name.split(" ")[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Convention Selection */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Scale className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    Liability Convention
                  </h4>
                  <Select value={convention} onValueChange={setConvention}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(availableConventions).map(([key, conv]) => {
                        const convData = conv as { name: string; year: number };
                        return (
                          <SelectItem key={key} value={key}>
                            {convData.name} ({convData.year})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {calculation?.conventionData && (
                    <p className="text-xs text-muted-foreground">
                      {calculation.conventionData.description}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Cargo Value */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    Cargo Value
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 space-y-2">
                      <Label>Total Cargo Value</Label>
                      <Input
                        type="number"
                        value={cargoValue}
                        onChange={(e) => setCargoValue(e.target.value)}
                        placeholder="100000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CNY">CNY</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                          <SelectItem value="AED">AED</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Weight & Packages */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Package className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    Weight & Packages
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gross Weight</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={grossWeight}
                          onChange={(e) => setGrossWeight(e.target.value)}
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
                      <Label>Number of Packages</Label>
                      <Input
                        type="number"
                        value={numberOfPackages}
                        onChange={(e) => setNumberOfPackages(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Package unit: {packageUnit}
                  </p>
                </div>

                {/* SDR Rate Info */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    <span className="text-slate-600 dark:text-slate-400">
                      Current SDR rate: 1 SDR = {formatNumber(SDR_RATES[currency] || 1.35, 4)} {currency}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Liability Calculation
                </CardTitle>
                <CardDescription>Carrier liability limits under selected convention</CardDescription>
              </CardHeader>
              <CardContent>
                {calculation && (
                  <div className="space-y-6">
                    {/* Main Result */}
                    <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white">
                      <div className="text-center">
                        <p className="text-sm opacity-90 mb-1">Maximum Carrier Liability</p>
                        <motion.p
                          key={calculation.carrierLiabilityLocal}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-4xl font-bold"
                        >
                          {formatCurrency(calculation.carrierLiabilityLocal)}
                        </motion.p>
                        <p className="text-sm opacity-90 mt-2">
                          {formatNumber(calculation.carrierLiabilitySDR, 2)} SDR
                        </p>
                      </div>
                    </div>

                    {/* Calculation Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                        Calculation Breakdown
                      </h4>

                      {/* Weight-based */}
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium" style={{ color: OCEAN_BLUE }}>Weight-based Limit</p>
                            <p className="text-sm text-slate-500">
                              {calculation.conventionData.sdrPerKg} SDR/kg × {formatNumber(calculation.weightInKg)} kg
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold" style={{ color: OCEAN_BLUE }}>{formatCurrency(calculation.weightBasedLimitLocal)}</p>
                            <p className="text-sm text-slate-500">{formatNumber(calculation.weightBasedLimitSDR)} SDR</p>
                          </div>
                        </div>
                      </div>

                      {/* Package-based (if applicable) */}
                      {calculation.conventionData.sdrPerPackage && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium" style={{ color: LOGISTICS_GREEN }}>Package-based Limit</p>
                              <p className="text-sm text-slate-500">
                                {calculation.conventionData.sdrPerPackage} SDR/package × {calculation.packages} packages
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold" style={{ color: LOGISTICS_GREEN }}>{formatCurrency(calculation.packageBasedLimitLocal)}</p>
                              <p className="text-sm text-slate-500">{formatNumber(calculation.packageBasedLimitSDR)} SDR</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Applied Limit */}
                      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">Applied Limit (Higher of two)</p>
                          </div>
                          <Badge style={{ backgroundColor: OCEAN_BLUE }}>
                            {calculation.weightBasedLimitLocal >= calculation.packageBasedLimitLocal ? "Weight-based" : "Package-based"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Gap Summary */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                        Coverage Gap Analysis
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-500">Cargo Value</p>
                          <p className="font-bold text-amber-600">{formatCurrency(calculation.cargoValue)}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-500">Carrier Covers</p>
                          <p className="font-bold" style={{ color: OCEAN_BLUE }}>{formatNumber(calculation.coveragePercentage, 1)}%</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-3 text-center">
                          <p className="text-xs text-slate-500">Uncovered Gap</p>
                          <p className="font-bold text-red-600">{formatNumber(calculation.gapPercentage, 1)}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation Badge */}
                    <div
                      className={`rounded-lg p-4 ${
                        calculation.recommendation.level === "critical"
                          ? "bg-red-50 dark:bg-red-950/30"
                          : calculation.recommendation.level === "high"
                          ? "bg-orange-50 dark:bg-orange-950/30"
                          : calculation.recommendation.level === "moderate"
                          ? "bg-amber-50 dark:bg-amber-950/30"
                          : "bg-green-50 dark:bg-green-950/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {calculation.recommendation.level === "critical" || calculation.recommendation.level === "high" ? (
                          <AlertCircle className="h-6 w-6 text-red-500" />
                        ) : calculation.recommendation.level === "moderate" ? (
                          <AlertTriangle className="h-6 w-6 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        )}
                        <div>
                          <p className="font-semibold">{calculation.recommendation.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {calculation.recommendation.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Gap Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {calculation && (
            <>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Coverage Gap Visualization */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                      Coverage Gap Analysis
                    </CardTitle>
                    <CardDescription>Visual breakdown of carrier liability vs cargo value</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={calculation.comparisonData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis type="number" tickFormatter={(v) => `${currency} ${formatNumber(v, 0)}`} />
                          <YAxis type="category" dataKey="name" width={100} />
                          <Tooltip
                            formatter={(value: number) => [formatCurrency(value), "Amount"]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {calculation.comparisonData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Coverage Pie Chart */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                      Coverage Breakdown
                    </CardTitle>
                    <CardDescription>Percentage of cargo covered by carrier liability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={calculation.coverageBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill={OCEAN_BLUE} />
                            <Cell fill="#EF4444" />
                          </Pie>
                          <Tooltip
                            formatter={(value: number, name: string) => [
                              formatCurrency(value),
                              name,
                            ]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-lg font-bold" style={{ color: OCEAN_BLUE }}>
                        {formatNumber(calculation.coveragePercentage, 1)}% Covered
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatNumber(calculation.gapPercentage, 1)}% Gap = {formatCurrency(calculation.coverageGap)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insurance Recommendation */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Insurance Recommendation
                  </CardTitle>
                  <CardDescription>Based on your coverage gap analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div
                      className={`p-6 rounded-xl ${
                        calculation.recommendation.level === "critical"
                          ? "bg-red-50 dark:bg-red-950/30"
                          : calculation.recommendation.level === "high"
                          ? "bg-orange-50 dark:bg-orange-950/30"
                          : calculation.recommendation.level === "moderate"
                          ? "bg-amber-50 dark:bg-amber-950/30"
                          : "bg-green-50 dark:bg-green-950/30"
                      }`}
                    >
                      <h4 className="font-semibold text-lg mb-2">{calculation.recommendation.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {calculation.recommendation.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-sm font-medium">Coverage Gap:</span>
                        <Badge
                          className={
                            calculation.recommendation.level === "critical"
                              ? "bg-red-500"
                              : calculation.recommendation.level === "high"
                              ? "bg-orange-500"
                              : calculation.recommendation.level === "moderate"
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }
                        >
                          {formatCurrency(calculation.coverageGap)}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Recommended Actions</h4>
                      <ul className="space-y-2">
                        {calculation.recommendation.actions.map((action, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: LOGISTICS_GREEN }} />
                            <span className="text-sm text-slate-600 dark:text-slate-400">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coverage Gap Diagram */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Coverage Gap Diagram</CardTitle>
                  <CardDescription>Visual representation of your protection levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-16 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, calculation.coveragePercentage)}%` }}
                      transition={{ duration: 0.5 }}
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#0F4C81] to-[#2E8B57]"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calculation.gapPercentage}%` }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="absolute right-0 top-0 h-full bg-red-200 dark:bg-red-900/50"
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-4 text-sm font-medium">
                      <span className="text-white drop-shadow-md">
                        Carrier: {formatNumber(calculation.coveragePercentage, 1)}%
                      </span>
                      {calculation.gapPercentage > 0 && (
                        <span className="text-red-700 dark:text-red-300 drop-shadow-md">
                          Gap: {formatNumber(calculation.gapPercentage, 1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-4 text-sm text-slate-500">
                    <span>Carrier Liability: {formatCurrency(Math.min(calculation.carrierLiabilityLocal, calculation.cargoValue))}</span>
                    <span>Total Value: {formatCurrency(calculation.cargoValue)}</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Convention Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          {calculation && (
            <>
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Convention Comparison
                  </CardTitle>
                  <CardDescription>
                    Compare liability limits across different conventions for {TRANSPORT_MODES[transportMode]?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={calculation.conventionComparison}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => `${currency} ${formatNumber(v, 0)}`} />
                        <Tooltip
                          formatter={(value: number) => [formatCurrency(value), "Liability Limit"]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <ReferenceLine y={calculation.cargoValue} stroke="#F59E0B" strokeDasharray="5 5" label="Cargo Value" />
                        <Bar dataKey="limit" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]}>
                          {calculation.conventionComparison.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.key === convention ? LOGISTICS_GREEN : OCEAN_BLUE}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Convention Table */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Convention Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4 font-semibold">Convention</th>
                          <th className="text-center py-3 px-4 font-semibold">SDR/kg</th>
                          <th className="text-center py-3 px-4 font-semibold">SDR/Package</th>
                          <th className="text-center py-3 px-4 font-semibold">Notice Period</th>
                          <th className="text-center py-3 px-4 font-semibold">Limitation Period</th>
                          <th className="text-right py-3 px-4 font-semibold">Calculated Limit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(CONVENTIONS[transportMode] || {}).map(([key, conv]) => {
                          const convData = conv as {
                            sdrPerKg: number;
                            sdrPerPackage: number | null;
                            name: string;
                            year: number;
                            noticeDays: number;
                            limitationPeriod: string;
                          };
                          const weightLimit = convData.sdrPerKg * calculation.weightInKg * calculation.sdrRate;
                          const pkgLimit = convData.sdrPerPackage
                            ? convData.sdrPerPackage * calculation.packages * calculation.sdrRate
                            : 0;
                          const totalLimit = Math.max(weightLimit, pkgLimit);
                          const isSelected = key === convention;

                          return (
                            <tr
                              key={key}
                              className={`border-b border-slate-100 dark:border-slate-800 cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-[#2E8B57]/10"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              }`}
                              onClick={() => setConvention(key)}
                            >
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LOGISTICS_GREEN }} />
                                  )}
                                  <span className="font-medium">{convData.name}</span>
                                  <span className="text-xs text-slate-500">({convData.year})</span>
                                </div>
                              </td>
                              <td className="text-center py-3 px-4">
                                <Badge variant="outline">{convData.sdrPerKg}</Badge>
                              </td>
                              <td className="text-center py-3 px-4">
                                <Badge variant="outline">
                                  {convData.sdrPerPackage || "N/A"}
                                </Badge>
                              </td>
                              <td className="text-center py-3 px-4">
                                <Badge variant="secondary">{convData.noticeDays} days</Badge>
                              </td>
                              <td className="text-center py-3 px-4">
                                <Badge variant="secondary">{convData.limitationPeriod}</Badge>
                              </td>
                              <td className="text-right py-3 px-4">
                                <span className="font-bold" style={{ color: OCEAN_BLUE }}>
                                  {formatCurrency(totalLimit)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* International Conventions Overview */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Understanding Carrier Liability Limits
                  </CardTitle>
                  <CardDescription>
                    Learn about international conventions that limit carrier liability for cargo loss or damage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6">
                        <h4 className="font-semibold mb-3" style={{ color: OCEAN_BLUE }}>What are Liability Limits?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Carrier liability limits are the maximum amounts a carrier can be held responsible
                          for when cargo is lost or damaged during transport. These limits are established
                          by international conventions and are typically based on weight or package count.
                        </p>
                      </div>
                      <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-6">
                        <h4 className="font-semibold mb-3" style={{ color: LOGISTICS_GREEN }}>Why Do Limits Exist?</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Liability limits were created to balance the interests of shippers and carriers.
                          They allow carriers to operate without unlimited liability exposure while providing
                          shippers with predictable minimum compensation levels.
                        </p>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-6">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">
                            Key Limitation: Carrier vs. Full Value
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Under most conventions, carrier liability is significantly less than the actual
                            value of cargo. For example, under Hague-Visby Rules, the limit is approximately
                            2 SDR per kg (roughly $2.70/kg). A 1,000 kg shipment worth $100,000 would only
                            have carrier coverage of about $2,700 - leaving a 97% coverage gap.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Visualizations Tab */}
        <TabsContent value="visualizations" className="space-y-6">
          {calculation && (
            <>
              {/* Risk Radar & Mode Comparison */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Risk Assessment Radar */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                      Protection Assessment
                    </CardTitle>
                    <CardDescription>Risk factors evaluation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={calculation.riskRadarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Assessment"
                            dataKey="value"
                            stroke={OCEAN_BLUE}
                            fill={OCEAN_BLUE}
                            fillOpacity={0.5}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Mode Comparison */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                      Transport Mode Coverage Comparison
                    </CardTitle>
                    <CardDescription>Coverage percentage across transport modes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={calculation.modeComparisonData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                          <YAxis type="category" dataKey="mode" width={60} />
                          <Tooltip
                            formatter={(value: number) => [`${formatNumber(value, 1)}%`, "Coverage"]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="limit" fill={LOGISTICS_GREEN} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Time Value Analysis */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Risk Exposure Over Time
                  </CardTitle>
                  <CardDescription>Monthly exposure analysis showing potential unprotected value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={calculation.timeValueData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `${currency} ${formatNumber(v, 0)}`} />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatCurrency(value),
                            name === "potentialLoss" ? "Potential Loss" : name === "protectedValue" ? "Protected Value" : "Cumulative Risk"
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="protectedValue"
                          stackId="1"
                          stroke={OCEAN_BLUE}
                          fill={OCEAN_BLUE}
                          fillOpacity={0.6}
                          name="Protected Value"
                        />
                        <Area
                          type="monotone"
                          dataKey="potentialLoss"
                          stackId="1"
                          stroke="#EF4444"
                          fill="#EF4444"
                          fillOpacity={0.4}
                          name="Potential Loss"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Convention Timeline */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Convention Evolution Timeline
                  </CardTitle>
                  <CardDescription>Historical development of carrier liability conventions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={[
                          { year: 1924, name: "Hague", limit: 0.67, type: "Sea" },
                          { year: 1929, name: "Warsaw", limit: 17, type: "Air" },
                          { year: 1956, name: "CMR", limit: 8.33, type: "Road" },
                          { year: 1968, name: "Hague-Visby", limit: 2, type: "Sea" },
                          { year: 1978, name: "Hamburg", limit: 2.5, type: "Sea" },
                          { year: 1999, name: "Montreal", limit: 22, type: "Air" },
                          { year: 2008, name: "Rotterdam", limit: 3, type: "Sea" },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="year" />
                        <YAxis yAxisId="left" orientation="left" stroke={OCEAN_BLUE} />
                        <YAxis yAxisId="right" orientation="right" stroke={LOGISTICS_GREEN} />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name === "limit" ? `${value} SDR/kg` : value,
                            name === "limit" ? "Liability Limit" : "Year"
                          ]}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="limit" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} name="SDR/kg Limit" />
                        <Line yAxisId="right" type="monotone" dataKey="year" stroke={LOGISTICS_GREEN} strokeWidth={2} name="Year" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* SDR Rates Overview */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    SDR Exchange Rates
                  </CardTitle>
                  <CardDescription>Current Special Drawing Rights exchange rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {Object.entries(SDR_RATES).map(([curr, rate]) => (
                      <div key={curr} className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="font-bold text-lg" style={{ color: OCEAN_BLUE }}>{curr}</p>
                        <p className="text-sm text-slate-500">{formatNumber(rate, 4)}</p>
                        <p className="text-xs text-slate-400 mt-1">per 1 SDR</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about carrier liability and international transport conventions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: index % 2 === 0 ? `${OCEAN_BLUE}20` : `${LOGISTICS_GREEN}20` }}
                        >
                          <span
                            className="font-bold text-sm"
                            style={{ color: index % 2 === 0 ? OCEAN_BLUE : LOGISTICS_GREEN }}
                          >
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Help Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    <span className="text-sm">Consult with a maritime lawyer for specific legal advice</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    <span className="text-sm">Contact your freight forwarder for carrier-specific terms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    <span className="text-sm">Review your cargo insurance policy for comprehensive coverage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    <span className="text-sm">Check the latest SDR rates from the IMF website</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 leading-relaxed">
                  Always obtain cargo insurance for shipments where the carrier liability limit is significantly 
                  below the cargo value. Insurance provides protection against carrier defenses and offers 
                  faster claims resolution. The small premium cost is worth the peace of mind for high-value cargo.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/50" />
                  <span className="text-sm text-white/70">Industry Best Practice</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Convention Quick Reference */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Convention Quick Reference
              </CardTitle>
              <CardDescription>Key details for major transport conventions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {/* Sea Conventions */}
                <AccordionItem value="sea">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Ship className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                      Sea Transport Conventions
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm text-muted-foreground">
                      <div className="grid gap-4">
                        {Object.entries(CONVENTIONS.sea).map(([key, conv]) => {
                          const convData = conv as {
                            name: string;
                            year: number;
                            description: string;
                            sdrPerKg: number;
                            sdrPerPackage: number | null;
                            noticeDays: number;
                            limitationPeriod: string;
                            countries: string;
                          };
                          return (
                            <div key={key} className="p-4 bg-muted/50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <h5 className="font-semibold text-foreground">{convData.name} ({convData.year})</h5>
                                <Badge variant="outline">{convData.noticeDays} days notice</Badge>
                              </div>
                              <p className="mb-2">{convData.description}</p>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="font-medium">Weight Limit:</span> {convData.sdrPerKg} SDR/kg
                                </div>
                                <div>
                                  <span className="font-medium">Package Limit:</span> {convData.sdrPerPackage || "N/A"} SDR
                                </div>
                              </div>
                              <p className="text-xs mt-2">
                                <span className="font-medium">Adopted by:</span> {convData.countries}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Air Conventions */}
                <AccordionItem value="air">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Plane className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                      Air Transport Conventions
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm text-muted-foreground">
                      {Object.entries(CONVENTIONS.air).map(([key, conv]) => {
                        const convData = conv as {
                          name: string;
                          year: number;
                          description: string;
                          sdrPerKg: number;
                          noticeDays: number;
                          countries: string;
                        };
                        return (
                          <div key={key} className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-foreground">{convData.name} ({convData.year})</h5>
                              <Badge variant="outline">{convData.noticeDays} days notice</Badge>
                            </div>
                            <p className="mb-2">{convData.description}</p>
                            <div className="text-xs">
                              <span className="font-medium">Weight Limit:</span> {convData.sdrPerKg} SDR/kg
                            </div>
                            <p className="text-xs mt-2">
                              <span className="font-medium">Adopted by:</span> {convData.countries}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Road Conventions */}
                <AccordionItem value="road">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-amber-500" />
                      Road Transport Conventions
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm text-muted-foreground">
                      {Object.entries(CONVENTIONS.road).map(([key, conv]) => {
                        const convData = conv as {
                          name: string;
                          year: number;
                          description: string;
                          sdrPerKg: number;
                          noticeDays: number;
                          countries: string;
                        };
                        return (
                          <div key={key} className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-foreground">{convData.name} ({convData.year})</h5>
                              <Badge variant="outline">{convData.noticeDays} days notice</Badge>
                            </div>
                            <p className="mb-2">{convData.description}</p>
                            <div className="text-xs">
                              <span className="font-medium">Weight Limit:</span> {convData.sdrPerKg} SDR/kg
                            </div>
                            <p className="text-xs mt-2">
                              <span className="font-medium">Adopted by:</span> {convData.countries}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Rail Conventions */}
                <AccordionItem value="rail">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-purple-500" />
                      Rail Transport Conventions
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm text-muted-foreground">
                      {Object.entries(CONVENTIONS.rail).map(([key, conv]) => {
                        const convData = conv as {
                          name: string;
                          year: number;
                          description: string;
                          sdrPerKg: number;
                          noticeDays: number;
                          countries: string;
                        };
                        return (
                          <div key={key} className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-foreground">{convData.name} ({convData.year})</h5>
                              <Badge variant="outline">{convData.noticeDays} days notice</Badge>
                            </div>
                            <p className="mb-2">{convData.description}</p>
                            <div className="text-xs">
                              <span className="font-medium">Weight Limit:</span> {convData.sdrPerKg} SDR/kg
                            </div>
                            <p className="text-xs mt-2">
                              <span className="font-medium">Adopted by:</span> {convData.countries}
                            </p>
                          </div>
                        );
                      })}
                    </div>
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
