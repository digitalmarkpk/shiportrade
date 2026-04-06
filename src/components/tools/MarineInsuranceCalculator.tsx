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
  FileText,
  HelpCircle,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  Anchor,
  Waves,
  Zap,
  Copy,
  Check,
  ChevronRight,
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts";

interface InsuranceResult {
  basePremium: number;
  warRiskPremium: number;
  strikesPremium: number;
  totalPremium: number;
  premiumRate: number;
  coverageAmount: number;
  deductible: number;
}

// Base premium rates (percentage of cargo value)
const baseRates: Record<string, { name: string; rate: number }> = {
  electronics: { name: "Electronics & High Value", rate: 0.45 },
  machinery: { name: "Machinery & Equipment", rate: 0.25 },
  textiles: { name: "Textiles & Apparel", rate: 0.20 },
  food: { name: "Food & Agricultural", rate: 0.35 },
  chemicals: { name: "Chemicals & Hazardous", rate: 0.65 },
  furniture: { name: "Furniture & Home Goods", rate: 0.18 },
  auto_parts: { name: "Automotive Parts", rate: 0.22 },
  general: { name: "General Cargo", rate: 0.20 },
};

// Transport mode adjustments
const transportModifiers: Record<string, { name: string; modifier: number }> = {
  ocean_fcl: { name: "Ocean FCL", modifier: 1.0 },
  ocean_lcl: { name: "Ocean LCL", modifier: 1.1 },
  air: { name: "Air Freight", modifier: 0.85 },
  road: { name: "Road Transport", modifier: 1.05 },
  rail: { name: "Rail Transport", modifier: 0.95 },
  multimodal: { name: "Multimodal", modifier: 1.0 },
};

// Route risk factors
const routeRiskFactors: Record<string, { name: string; factor: number; warRisk: number }> = {
  asia_americas: { name: "Asia to Americas", factor: 1.0, warRisk: 0.01 },
  asia_europe: { name: "Asia to Europe", factor: 1.0, warRisk: 0.015 },
  europe_americas: { name: "Europe to Americas", factor: 0.95, warRisk: 0.005 },
  intra_asia: { name: "Intra-Asia", factor: 0.9, warRisk: 0.01 },
  intra_europe: { name: "Intra-Europe", factor: 0.85, warRisk: 0.005 },
  middle_east: { name: "Middle East Routes", factor: 1.25, warRisk: 0.08 },
  africa: { name: "Africa Routes", factor: 1.2, warRisk: 0.06 },
  global: { name: "Other Routes", factor: 1.0, warRisk: 0.02 },
};

// Coverage types
const coverageTypes = [
  { value: "icc_a", name: "ICC (A) - All Risks", deductible: 0.1 },
  { value: "icc_b", name: "ICC (B) - Intermediate", deductible: 0.15 },
  { value: "icc_c", name: "ICC (C) - Basic", deductible: 0.2 },
];

// ICC Coverage Comparison Data
const iccCoverageData = {
  icc_a: {
    name: "ICC (A) - All Risks",
    description: "The most comprehensive marine insurance coverage available, providing protection against all risks of physical loss or damage from external causes.",
    covered: [
      "All risks of loss or damage to insured goods",
      "Fire, explosion, and lightning",
      "Stranding, sinking, or collision of vessel",
      "Jettison and washing overboard",
      "Earthquake, volcanic eruption, or tsunami",
      "General average sacrifice and salvage charges",
      "Theft, pilferage, and non-delivery",
      "Water damage from any cause",
      "Hook damage, breakage, and crushing",
      "Contact with other cargo",
      "Sweat and heating damage",
      "Shortage at destination",
    ],
    excluded: [
      "Willful misconduct of the assured",
      "Ordinary leakage or loss in weight",
      "Inherent vice of the goods",
      "Delay in transit",
      "Insolvency or financial default of carriers",
      "Nuclear weapons and nuclear fallout",
      "Unseaworthiness or unfitness (if known)",
    ],
    premiumFactor: 1.0,
    color: "#0F4C81",
  },
  icc_b: {
    name: "ICC (B) - Intermediate",
    description: "A middle-tier coverage that protects against named perils, offering a balance between comprehensive coverage and cost-effectiveness for moderate-risk cargo.",
    covered: [
      "Fire or explosion",
      "Stranding, sinking, or collision",
      "Overturning or derailment of land conveyance",
      "Collision or contact with external object",
      "Earthquake, volcanic eruption, or tsunami",
      "Jettison and washing overboard",
      "General average sacrifice",
      "Entry of water into vessel",
      "Total loss of package during loading/unloading",
    ],
    excluded: [
      "Willful misconduct of the assured",
      "Ordinary leakage or loss in weight",
      "Inherent vice of the goods",
      "Delay in transit",
      "Insolvency or financial default of carriers",
      "Theft, pilferage, and non-delivery",
      "Partial loss (unless from stranding, etc.)",
      "Damage from hook or breakage",
      "Sweat and heating damage",
    ],
    premiumFactor: 0.85,
    color: "#2E8B57",
  },
  icc_c: {
    name: "ICC (C) - Basic Coverage",
    description: "The most economical coverage option, protecting only against major casualties and catastrophic events. Suitable for low-value or robust cargo.",
    covered: [
      "Fire or explosion",
      "Stranding, sinking, or collision of vessel",
      "Overturning or derailment of land conveyance",
      "Collision or contact with external object",
      "General average sacrifice",
      "Jettison",
    ],
    excluded: [
      "All ICC (B) exclusions",
      "Earthquake, volcanic eruption, or tsunami",
      "Washing overboard",
      "Entry of water into vessel",
      "Partial loss from any cause",
      "Theft, pilferage, non-delivery",
      "Water damage",
    ],
    premiumFactor: 0.65,
    color: "#F59E0B",
  },
};

// FAQ Data
const faqData = [
  {
    question: "What is the difference between ICC (A), (B), and (C) coverage?",
    answer: "ICC (A) provides 'all risks' coverage, protecting against any physical loss or damage not specifically excluded. ICC (B) offers named perils coverage including fire, explosion, stranding, earthquake, and general average. ICC (C) is the most basic, covering only major casualties like fire, explosion, stranding, and collision. The premium rates reflect the coverage breadth: ICC (A) is most expensive, ICC (C) least expensive. Choose ICC (A) for high-value or fragile goods, ICC (B) for moderate-risk cargo, and ICC (C) for low-value, robust shipments.",
  },
  {
    question: "How is marine insurance premium calculated?",
    answer: "Marine insurance premium is calculated based on several factors: cargo value (CIF - Cost, Insurance, Freight), cargo type (fragile, hazardous, or general goods have different risk profiles), transport mode (ocean, air, road, rail have varying risk levels), voyage route (certain routes have higher war risk or piracy risk), coverage type (ICC A/B/C), and additional coverages like War Risk and SRCC (Strikes, Riots, Civil Commotion). The base premium rate typically ranges from 0.15% to 0.65% of cargo value, modified by these factors. Insurers also consider claims history, packaging quality, and carrier reputation.",
  },
  {
    question: "What is General Average and does insurance cover it?",
    answer: "General Average is a maritime principle where all parties in a sea venture proportionally share losses resulting from a voluntary sacrifice of part of the ship or cargo to save the whole in an emergency. For example, if cargo is jettisoned to save a ship during a storm, all cargo owners must contribute to compensate the affected party. Marine insurance covers General Average contributions under all ICC clauses, but you must provide a General Average guarantee and average bond. The insurance company pays your contribution once the adjustment is finalized, which can take several years.",
  },
  {
    question: "What documents are required to file a marine insurance claim?",
    answer: "To file a marine insurance claim, you need: (1) Original insurance policy or certificate, (2) Bill of Lading or other transport documents, (3) Commercial invoice showing cargo value, (4) Packing list, (5) Survey report or damage inspection certificate, (6) Photos of damaged goods and packaging, (7) Copy of the cargo manifest, (8) Letter of claim against carrier (if applicable), (9) Repair or replacement quotes, (10) Proof of delivery showing damage remarks. For total losses, you may need to assign salvage rights to the insurer. Claims must be filed within the policy's time limit, typically 12 months from the date of loss.",
  },
  {
    question: "What is War Risk coverage and do I need it?",
    answer: "War Risk coverage protects against losses caused by war, civil war, revolution, rebellion, insurrection, civil strife, piracy, terrorism, and hostile acts by belligerent powers. Standard marine insurance excludes these perils. You should consider War Risk coverage if: shipping through high-risk areas (Gulf of Aden, Red Sea, Black Sea), your cargo is high-value, your contract requires it, or the destination country has political instability. War risk premiums are quoted separately and can range from 0.01% to over 0.10% of cargo value depending on the route. Some routes through conflict zones may have coverage restrictions.",
  },
  {
    question: "How long do I have to file a marine insurance claim?",
    answer: "The standard time limit for filing marine insurance claims is 12 months from the date of loss or from when the loss was discovered. However, this can vary: some policies offer 24 months, while others may have shorter periods for certain types of claims. For constructive total losses, notice must be given promptly. Claims against carriers have different deadlines (typically 3 days for damage notification, 7 days for written claim). It's crucial to notify your insurer immediately upon discovering damage, conduct a joint survey with the carrier, and submit all required documents promptly. Delays can result in claim denial.",
  },
  {
    question: "What is the difference between Total Loss and Partial Loss?",
    answer: "Total Loss occurs when the insured property is completely destroyed, irretrievably lost, or so damaged it ceases to be a thing of the kind insured. There are two types: Actual Total Loss (the cargo is physically destroyed or impossible to recover) and Constructive Total Loss (the cost of recovery or repair would exceed the insured value). Partial Loss covers damage that doesn't amount to a total loss. Under ICC (A), partial losses are covered. Under ICC (B), partial losses are only covered if resulting from specified perils. Under ICC (C), partial losses are only covered if resulting from major casualties like stranding or collision.",
  },
];

// Claims Process Steps
const claimsProcessSteps = [
  {
    step: 1,
    title: "Immediate Notification",
    description: "Notify your insurer immediately upon discovering damage or loss. Most policies require notification within 24-72 hours. Document the damage with photos before any disposal or repairs.",
    documents: ["Photos of damage", "Initial damage report"],
    timeline: "Within 24-72 hours",
  },
  {
    step: 2,
    title: "Survey and Inspection",
    description: "Arrange for a joint survey with the carrier and/or a marine surveyor. The surveyor will assess the extent of damage, probable cause, and responsibility. Do not dispose of damaged goods without insurer consent.",
    documents: ["Survey request", "Survey appointment confirmation"],
    timeline: "1-3 business days",
  },
  {
    step: 3,
    title: "Document Collection",
    description: "Gather all required documentation including the original policy, bill of lading, commercial invoice, packing list, and any carrier correspondence. Ensure all documents are complete and accurate.",
    documents: ["Insurance policy/certificate", "Bill of Lading", "Commercial invoice", "Packing list", "Delivery receipt with remarks"],
    timeline: "3-7 days",
  },
  {
    step: 4,
    title: "Submit Claim",
    description: "Submit a formal claim to your insurer including all supporting documents, survey report, repair/replacement quotes, and proof of loss. Include a detailed statement of the circumstances of loss.",
    documents: ["Claim form", "Survey report", "Repair/replace quotes", "Statement of loss"],
    timeline: "Within 30 days of loss",
  },
  {
    step: 5,
    title: "Claim Processing",
    description: "The insurer will review your claim, verify coverage, and assess liability. They may request additional information or clarification. Complex claims may take longer to process.",
    documents: ["Additional documents as requested"],
    timeline: "15-45 business days",
  },
  {
    step: 6,
    title: "Settlement",
    description: "Once approved, the insurer will issue payment. For partial losses, this is typically the repair cost minus deductible. For total losses, payment is usually the insured value. You may need to assign salvage rights for total losses.",
    documents: ["Settlement letter", "Release form", "Salvage assignment (if applicable)"],
    timeline: "5-15 business days after approval",
  },
];

// Risk Factors Data for Charts
const riskFactorsData = [
  { factor: "Cargo Type", impact: 35, description: "Fragile, hazardous, high-value goods" },
  { factor: "Voyage Route", impact: 25, description: "Piracy zones, war risk areas" },
  { factor: "Transport Mode", impact: 15, description: "Ocean, air, road, rail" },
  { factor: "Coverage Level", impact: 15, description: "ICC A, B, or C" },
  { factor: "Packaging", impact: 10, description: "Quality of packaging" },
];

// Claims Ratio Data by Cargo Type
const claimsRatioData = [
  { cargo: "Electronics", ratio: 4.2, color: "#0F4C81" },
  { cargo: "Chemicals", ratio: 3.8, color: "#2E8B57" },
  { cargo: "Food & Agri", ratio: 3.5, color: "#F59E0B" },
  { cargo: "Machinery", ratio: 2.9, color: "#EF4444" },
  { cargo: "Textiles", ratio: 2.4, color: "#8B5CF6" },
  { cargo: "General Cargo", ratio: 1.8, color: "#06B6D4" },
  { cargo: "Furniture", ratio: 1.5, color: "#EC4899" },
  { cargo: "Auto Parts", ratio: 1.2, color: "#10B981" },
];

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6"];

export function MarineInsuranceCalculator() {
  const [cargoValue, setCargoValue] = useState<string>("100000");
  const [currency, setCurrency] = useState<string>("USD");
  const [cargoType, setCargoType] = useState<string>("general");
  const [transportMode, setTransportMode] = useState<string>("ocean_fcl");
  const [route, setRoute] = useState<string>("asia_americas");
  const [coverageType, setCoverageType] = useState<string>("icc_a");
  const [includeWarRisk, setIncludeWarRisk] = useState(true);
  const [includeStrikes, setIncludeStrikes] = useState(true);
  const [voyageDate, setVoyageDate] = useState<string>("");
  const [customRate, setCustomRate] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  const calculation = useMemo<InsuranceResult>(() => {
    const value = parseFloat(cargoValue) || 0;
    const selectedCargo = baseRates[cargoType];
    const selectedTransport = transportModifiers[transportMode];
    const selectedRoute = routeRiskFactors[route];
    const selectedCoverage = coverageTypes.find((c) => c.value === coverageType);

    // Calculate base premium rate
    let baseRate = customRate
      ? parseFloat(customRate) / 100
      : (selectedCargo?.rate || 0.2) / 100;

    // Apply modifiers
    baseRate *= selectedTransport?.modifier || 1;
    baseRate *= selectedRoute?.factor || 1;

    // Coverage type adjustment
    if (coverageType === "icc_b") baseRate *= 0.85;
    if (coverageType === "icc_c") baseRate *= 0.65;

    const basePremium = value * baseRate;

    // War risk premium (typically 0.01% - 0.08%)
    const warRiskPremium = includeWarRisk
      ? value * (selectedRoute?.warRisk || 0.02) / 100
      : 0;

    // Strikes, riots, civil commotion (typically 0.01%)
    const strikesPremium = includeStrikes
      ? value * 0.01 / 100
      : 0;

    const totalPremium = basePremium + warRiskPremium + strikesPremium;
    const premiumRate = (totalPremium / value) * 100;
    const deductible = value * (selectedCoverage?.deductible || 0.1);

    return {
      basePremium,
      warRiskPremium,
      strikesPremium,
      totalPremium,
      premiumRate,
      coverageAmount: value,
      deductible,
    };
  }, [cargoValue, cargoType, transportMode, route, coverageType, includeWarRisk, includeStrikes, customRate]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Premium vs Coverage comparison data
  const premiumVsCoverageData = [
    { coverage: "ICC (A)", premium: calculation.basePremium, rate: calculation.premiumRate.toFixed(3) },
    { coverage: "ICC (B)", premium: calculation.basePremium * 0.85, rate: (calculation.premiumRate * 0.85).toFixed(3) },
    { coverage: "ICC (C)", premium: calculation.basePremium * 0.65, rate: (calculation.premiumRate * 0.65).toFixed(3) },
  ];

  // Cost breakdown for pie chart
  const costBreakdownData = [
    { name: "Base Premium", value: calculation.basePremium, color: "#0F4C81" },
    { name: "War Risk", value: calculation.warRiskPremium, color: "#F59E0B" },
    { name: "SRCC", value: calculation.strikesPremium, color: "#2E8B57" },
  ].filter(item => item.value > 0);

  const handleExport = () => {
    const data = {
      cargoValue,
      currency,
      cargoType: baseRates[cargoType]?.name,
      transportMode: transportModifiers[transportMode]?.name,
      route: routeRiskFactors[route]?.name,
      coverageType: coverageTypes.find(c => c.value === coverageType)?.name,
      includeWarRisk,
      includeStrikes,
      calculation: {
        totalPremium: formatCurrency(calculation.totalPremium),
        premiumRate: `${calculation.premiumRate.toFixed(3)}%`,
        coverageAmount: formatCurrency(calculation.coverageAmount),
        deductible: formatCurrency(calculation.deductible),
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marine-insurance-quote-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: "Marine Insurance Quote",
      text: `Marine Insurance Quote: ${formatCurrency(calculation.totalPremium)} (${calculation.premiumRate.toFixed(3)}%) for ${formatCurrency(calculation.coverageAmount)} cargo value`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        `Marine Insurance Quote\nPremium: ${formatCurrency(calculation.totalPremium)}\nRate: ${calculation.premiumRate.toFixed(3)}%\nCoverage: ${formatCurrency(calculation.coverageAmount)}\nCalculated at: ${window.location.href}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/30 animate-pulse">
              <Shield className="h-3 w-3 mr-1" />
              Cargo Protection
            </Badge>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold mb-2">Marine Insurance Calculator</h2>
            <p className="text-white/80 max-w-2xl">
              Calculate accurate marine insurance premiums for your cargo shipments. Get instant quotes for ICC (A), (B), and (C) coverage with war risk and SRCC options.
            </p>
          </motion.div>

          {/* Key Metrics Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-3 gap-4 mt-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Premium</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(calculation.totalPremium)}</div>
              <div className="text-xs text-white/60 mt-1">{calculation.premiumRate.toFixed(3)}% rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Coverage</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(calculation.coverageAmount)}</div>
              <div className="text-xs text-white/60 mt-1">Insured Value</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Rate</span>
              </div>
              <div className="text-2xl font-bold">{calculation.premiumRate.toFixed(3)}%</div>
              <div className="text-xs text-white/60 mt-1">Of cargo value</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="coverage" className="flex items-center gap-2 py-3">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Coverage</span>
          </TabsTrigger>
          <TabsTrigger value="claims" className="flex items-center gap-2 py-3">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Claims</span>
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-2 py-3">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Methodology</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#2E8B57]" />
                    Cargo Value
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 space-y-2">
                      <Label htmlFor="cargoValue">Insured Value (CIF)</Label>
                      <Input
                        id="cargoValue"
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
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the CIF value (Cost + Insurance + Freight) of your shipment
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#0F4C81]" />
                    Shipment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Cargo Type</Label>
                    <Select value={cargoType} onValueChange={setCargoType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(baseRates).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Transport Mode</Label>
                    <Select value={transportMode} onValueChange={setTransportMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(transportModifiers).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Route</Label>
                    <Select value={route} onValueChange={setRoute}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(routeRiskFactors).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name}
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
                    <Shield className="h-5 w-5 text-[#2E8B57]" />
                    Coverage Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Coverage Type</Label>
                    <Select value={coverageType} onValueChange={setCoverageType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {coverageTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>War Risk Coverage</Label>
                        <p className="text-xs text-muted-foreground">
                          War, capture, piracy, terrorism
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={includeWarRisk}
                        onChange={(e) => setIncludeWarRisk(e.target.checked)}
                        className="h-4 w-4 accent-[#2E8B57]"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Strikes, Riots & Civil Commotion</Label>
                        <p className="text-xs text-muted-foreground">
                          SRCC coverage
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={includeStrikes}
                        onChange={(e) => setIncludeStrikes(e.target.checked)}
                        className="h-4 w-4 accent-[#2E8B57]"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="customRate">Custom Rate (%) - Optional</Label>
                    <Input
                      id="customRate"
                      type="number"
                      step="0.01"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder={`Est: ${((baseRates[cargoType]?.rate || 0.2)).toFixed(2)}%`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Override estimated rate with your negotiated rate
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 border-[#2E8B57]/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#2E8B57]" />
                    Insurance Premium Estimate
                  </CardTitle>
                  <CardDescription>
                    Estimated premium based on provided details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-bold text-[#2E8B57]"
                    >
                      {formatCurrency(calculation.totalPremium)}
                    </motion.div>
                    <div className="text-lg text-muted-foreground mt-1">
                      Annual Premium
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {calculation.premiumRate.toFixed(3)}% of cargo value
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#0F4C81]" />
                        <span>Base Premium</span>
                      </div>
                      <span className="font-medium">{formatCurrency(calculation.basePremium)}</span>
                    </div>

                    {includeWarRisk && (
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span>War Risk</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculation.warRiskPremium)}</span>
                      </div>
                    )}

                    {includeStrikes && (
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-purple-500" />
                          <span>SRCC</span>
                        </div>
                        <span className="font-medium">{formatCurrency(calculation.strikesPremium)}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold">{formatCurrency(calculation.coverageAmount)}</div>
                      <div className="text-xs text-muted-foreground">Coverage Amount</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-semibold">{formatCurrency(calculation.deductible)}</div>
                      <div className="text-xs text-muted-foreground">Est. Deductible</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Charts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#0F4C81]" />
                    Premium vs Coverage Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={premiumVsCoverageData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`} />
                        <YAxis dataKey="coverage" type="category" width={60} />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          labelFormatter={(label) => `${label} Coverage`}
                        />
                        <Bar dataKey="premium" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown Pie Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Export/Share Buttons */}
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Quote
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Quote
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-semibold mb-2">Important Disclaimer</p>
                  <p>
                    This calculator provides estimates only. Actual premiums may vary based on underwriting 
                    criteria, claims history, insurer risk appetite, and specific policy terms. Always 
                    consult with a licensed insurance broker for accurate quotes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Coverage Types */}
        <TabsContent value="coverage" className="space-y-6 mt-6">
          {/* What is Marine Insurance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="h-5 w-5 text-[#0F4C81]" />
                What is Marine Insurance?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Marine insurance is a specialized form of insurance that covers loss or damage to ships, cargo, 
                terminals, and any transport or property by which cargo is transferred, acquired, or held 
                between points of origin and final destination. As one of the oldest forms of insurance, it 
                traces its roots back to ancient maritime trade practices and has evolved into a sophisticated 
                risk management tool essential for modern international trade.
              </p>
              <p>
                The fundamental principle of marine insurance is to protect the financial interests of cargo 
                owners, shipowners, and other parties involved in the transportation of goods. It provides 
                coverage against perils of the sea, including storms, collisions, fires, and other hazards 
                that can cause loss or damage during transit. Without adequate marine insurance, businesses 
                engaged in international trade would face significant financial exposure, potentially losing 
                entire shipments worth millions of dollars.
              </p>
              <p>
                Modern marine insurance policies are typically based on the Institute Cargo Clauses (ICC), 
                standardized clauses developed by the Institute of London Underwriters. These clauses define 
                the scope of coverage, exclusions, and conditions under which claims are payable. The three 
                main types are ICC (A), ICC (B), and ICC (C), each offering different levels of protection 
                to suit various cargo types and risk profiles.
              </p>
            </CardContent>
          </Card>

          {/* ICC Coverage Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5 text-[#2E8B57]" />
                Institute Cargo Clauses (ICC) Comparison
              </CardTitle>
              <CardDescription>
                Detailed comparison of ICC (A), (B), and (C) coverage types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Risk/Peril</th>
                      <th className="text-center py-3 px-4 font-semibold">
                        <Badge style={{ backgroundColor: "#0F4C81" }}>ICC (A)</Badge>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold">
                        <Badge style={{ backgroundColor: "#2E8B57" }}>ICC (B)</Badge>
                      </th>
                      <th className="text-center py-3 px-4 font-semibold">
                        <Badge style={{ backgroundColor: "#F59E0B" }}>ICC (C)</Badge>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { peril: "Fire, Explosion", a: true, b: true, c: true },
                      { peril: "Stranding, Sinking, Collision", a: true, b: true, c: true },
                      { peril: "Overturning/Derailment", a: true, b: true, c: true },
                      { peril: "Collision with External Object", a: true, b: true, c: true },
                      { peril: "General Average Sacrifice", a: true, b: true, c: true },
                      { peril: "Jettison", a: true, b: true, c: true },
                      { peril: "Earthquake, Volcanic Eruption", a: true, b: true, c: false },
                      { peril: "Washing Overboard", a: true, b: true, c: false },
                      { peril: "Sea Water Damage", a: true, b: true, c: false },
                      { peril: "Total Loss During Loading/Unloading", a: true, b: true, c: false },
                      { peril: "Theft, Pilferage, Non-delivery", a: true, b: false, c: false },
                      { peril: "Water Damage (Any Cause)", a: true, b: false, c: false },
                      { peril: "Breakage, Crushing, Hook Damage", a: true, b: false, c: false },
                      { peril: "Sweat and Heating Damage", a: true, b: false, c: false },
                      { peril: "Shortage at Destination", a: true, b: false, c: false },
                      { peril: "Partial Loss (from any cause)", a: true, b: false, c: false },
                    ].map((row, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{row.peril}</td>
                        <td className="text-center py-3 px-4">
                          {row.a ? (
                            <CheckCircle2 className="h-5 w-5 mx-auto text-[#0F4C81]" />
                          ) : (
                            <XCircle className="h-5 w-5 mx-auto text-muted-foreground" />
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          {row.b ? (
                            <CheckCircle2 className="h-5 w-5 mx-auto text-[#2E8B57]" />
                          ) : (
                            <XCircle className="h-5 w-5 mx-auto text-muted-foreground" />
                          )}
                        </td>
                        <td className="text-center py-3 px-4">
                          {row.c ? (
                            <CheckCircle2 className="h-5 w-5 mx-auto text-[#F59E0B]" />
                          ) : (
                            <XCircle className="h-5 w-5 mx-auto text-muted-foreground" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ICC Details Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(iccCoverageData).map(([key, data]) => (
              <Card key={key} className="overflow-hidden">
                <div className="h-2" style={{ backgroundColor: data.color }} />
                <CardHeader>
                  <CardTitle className="text-base" style={{ color: data.color }}>
                    {data.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-2">
                    Premium Factor: {(data.premiumFactor * 100).toFixed(0)}%
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{data.description}</p>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-600 dark:text-green-400">Covered:</h4>
                    <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                      {data.covered.slice(0, 6).map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {data.covered.length > 6 && (
                        <li className="text-muted-foreground">+{data.covered.length - 6} more</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">Excluded:</h4>
                    <ul className="text-xs space-y-1">
                      {data.excluded.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <XCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Claims Process */}
        <TabsContent value="claims" className="space-y-6 mt-6">
          {/* Claims Process Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#0F4C81]" />
                How to File a Marine Insurance Claim
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Filing a marine insurance claim requires prompt action, thorough documentation, and adherence 
                to specific procedures outlined in your policy. The claims process can be complex, especially 
                for international shipments involving multiple parties and jurisdictions. Understanding the 
                proper steps can significantly improve your chances of a successful claim settlement.
              </p>
              <p>
                Time is of the essence in marine insurance claims. Most policies require immediate notification 
                of any loss or damage, typically within 24 to 72 hours of discovery. Failure to provide timely 
                notice may result in claim denial. Additionally, claims against carriers have strict deadlines 
                under international conventions and local laws, making it crucial to act quickly.
              </p>
            </CardContent>
          </Card>

          {/* Claims Process Steps */}
          <div className="space-y-4">
            {claimsProcessSteps.map((step, index) => (
              <Card key={step.step} className="overflow-hidden">
                <div className="flex">
                  <div 
                    className="w-16 shrink-0 flex items-center justify-center text-2xl font-bold text-white"
                    style={{ backgroundColor: index % 2 === 0 ? "#0F4C81" : "#2E8B57" }}
                  >
                    {step.step}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 ml-4">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.timeline}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-medium mb-2">Required Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {step.documents.map((doc, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Documentation Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2E8B57]" />
                Claims Documentation Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Proper documentation is essential for successful marine insurance claims. Each document serves 
                a specific purpose in establishing the facts of the loss, the value of the goods, and the 
                circumstances surrounding the damage. Incomplete or inaccurate documentation is one of the 
                leading causes of claim delays and denials.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Primary Documents</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                      Original insurance policy or certificate
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                      Bill of Lading or transport document
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                      Commercial invoice
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                      Packing list
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                      Survey report
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Supporting Documents</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0F4C81]" />
                      Photos of damage
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0F4C81]" />
                      Delivery receipt with remarks
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0F4C81]" />
                      Repair/replacement quotes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0F4C81]" />
                      Letter of claim to carrier
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0F4C81]" />
                      Statement of circumstances
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Methodology */}
        <TabsContent value="methodology" className="space-y-6 mt-6">
          {/* How Premiums are Calculated */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#0F4C81]" />
                How Marine Insurance Premiums are Calculated
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                Marine insurance premiums are calculated through a sophisticated process that takes into 
                account multiple risk factors. Unlike standard property insurance, marine insurance premiums 
                are highly variable and depend on the specific characteristics of each shipment. Understanding 
                these factors can help you make informed decisions about your coverage and potentially reduce 
                your insurance costs.
              </p>
              <p>
                The basic premium calculation follows this formula: Premium = Cargo Value × Base Rate × 
                Modifiers. The base rate is determined by the type of cargo, with hazardous materials and 
                fragile goods commanding higher rates. Modifiers adjust the rate based on factors such as 
                transport mode, voyage route, and coverage level selected.
              </p>
            </CardContent>
          </Card>

          {/* Risk Factors Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                Risk Factors Impact on Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskFactorsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 40]} tickFormatter={(value) => `${value}%`} />
                    <YAxis dataKey="factor" type="category" width={100} />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, "Impact"]}
                      labelFormatter={(label) => {
                        const item = riskFactorsData.find(d => d.factor === label);
                        return item ? `${label}: ${item.description}` : label;
                      }}
                    />
                    <Bar dataKey="impact" fill="#0F4C81" radius={[0, 4, 4, 0]}>
                      {riskFactorsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                {riskFactorsData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.factor}: {item.impact}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Claims Ratio by Cargo Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Claims Ratio by Cargo Type
              </CardTitle>
              <CardDescription>
                Average claims frequency per 100 shipments by cargo category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={claimsRatioData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cargo" angle={-45} textAnchor="end" height={80} fontSize={12} />
                    <YAxis label={{ value: "Claims per 100 shipments", angle: -90, position: "insideLeft", fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [value, "Claims Ratio"]} />
                    <Bar dataKey="ratio" radius={[4, 4, 0, 0]}>
                      {claimsRatioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Premium Factors Detail */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Calculation Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-[#0F4C81]" />
                      Cargo Type
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      The nature of goods being shipped significantly affects premium rates. Fragile items, 
                      hazardous materials, and high-value electronics carry higher risk profiles and thus 
                      higher premiums. General cargo typically has the lowest rates, while chemicals and 
                      electronics have the highest.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Ship className="h-4 w-4 text-[#0F4C81]" />
                      Transport Mode
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Different transport modes present different risk levels. Ocean freight generally has 
                      higher premiums due to longer transit times and exposure to maritime perils. Air freight 
                      typically has lower premiums due to shorter transit times and better security controls.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Waves className="h-4 w-4 text-[#0F4C81]" />
                      Voyage Route
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Routes passing through high-risk areas such as piracy zones or war-affected regions 
                      attract higher premiums. Middle East routes typically have the highest war risk 
                      surcharges, while intra-European routes have the lowest risk factors.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-[#2E8B57]" />
                      Coverage Level
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      ICC (A) All Risks coverage commands the highest premium but provides the most 
                      comprehensive protection. ICC (B) and ICC (C) offer progressively lower coverage 
                      at reduced premiums, suitable for lower-risk cargo.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-[#2E8B57]" />
                      War Risk & SRCC
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      War Risk and Strikes, Riots, Civil Commotion (SRCC) coverage are optional add-ons 
                      that provide protection against political and social risks. These coverages are 
                      particularly important for shipments to or through unstable regions.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-[#2E8B57]" />
                      Claims History
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Insureds with favorable claims history may qualify for premium discounts. Conversely, 
                      a history of frequent claims may result in higher premiums or difficulty obtaining 
                      coverage. Building a good track record can significantly reduce insurance costs.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* General Average Explanation */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Anchor className="h-5 w-5" />
                Understanding General Average
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 dark:text-blue-300 space-y-4">
              <p>
                General Average is a principle of maritime law that requires all parties in a sea venture 
                to proportionally share any losses resulting from a voluntary sacrifice of part of the ship 
                or cargo to save the whole in an emergency. This ancient maritime doctrine dates back to 
                the Rhodian Law of approximately 800 BC and remains a fundamental concept in modern marine 
                insurance.
              </p>
              <p>
                When a General Average event occurs, all cargo owners must contribute to the losses, 
                regardless of whether their cargo was sacrificed or saved. For example, if containers are 
                jettisoned to stabilize a ship during a storm, all cargo owners on that voyage must 
                contribute to compensate the owners of the jettisoned cargo. The contribution is typically 
                calculated as a percentage of the cargo&apos;s value.
              </p>
              <p>
                Marine insurance policies cover General Average contributions under all ICC clauses. However, 
                cargo owners must provide a General Average guarantee and average bond before their cargo 
                can be released at the destination. The insurance company will pay the contribution once 
                the General Average adjustment is finalized, which can take several years. This is why 
                it&apos;s crucial to work with insurers who can provide prompt guarantee letters to avoid 
                cargo detention.
              </p>
              <div className="mt-4 p-4 bg-white/50 dark:bg-white/10 rounded-lg">
                <h4 className="font-semibold mb-2">General Average Key Points:</h4>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5" />
                    All cargo owners share losses proportionally
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5" />
                    Covered under all ICC clauses
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5" />
                    Requires guarantee before cargo release
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 mt-0.5" />
                    Adjustment process can take years
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about marine insurance answered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center gap-2">
                        <Badge variant="outline" className="shrink-0">Q{index + 1}</Badge>
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-muted-foreground pl-8">
                        {item.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border hover:border-[#0F4C81] transition-colors cursor-pointer">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#0F4C81]" />
                    ICC Clauses Full Text
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Access the complete Institute Cargo Clauses documentation from the Institute of London Underwriters.
                  </p>
                </div>
                <div className="p-4 rounded-lg border hover:border-[#2E8B57] transition-colors cursor-pointer">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#2E8B57]" />
                    Find a Marine Insurance Broker
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect with licensed marine insurance professionals for personalized quotes and advice.
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
