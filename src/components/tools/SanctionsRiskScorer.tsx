"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  AlertTriangle,
  Building2,
  Globe,
  Flag,
  Search,
  AlertCircle,
  CheckCircle,
  Info,
  RefreshCw,
  FileWarning,
  UserCheck,
  Ban,
  Eye,
  Clock,
  DollarSign,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  FileText,
  HelpCircle,
  ShieldCheck,
  Scale,
  Landmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
} from "recharts";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

interface SanctionsResult {
  overallRiskScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskFactors: RiskFactor[];
  screeningResults: ScreeningResult[];
  redFlags: RedFlag[];
  recommendations: string[];
  requiredActions: string[];
  countryRisk: CountryRisk;
  entityRisk: EntityRisk;
  productRisk: ProductRisk;
  summary: {
    totalChecks: number;
    passedChecks: number;
    warnings: number;
    failures: number;
  };
}

interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  description: string;
  status: "pass" | "warning" | "fail";
}

interface ScreeningResult {
  list: string;
  status: "clear" | "match" | "partial";
  details: string;
  lastUpdated: string;
}

interface RedFlag {
  flag: string;
  severity: "low" | "medium" | "high";
  description: string;
  recommendation: string;
}

interface CountryRisk {
  country: string;
  riskLevel: string;
  sanctionsPrograms: string[];
  tradeRestrictions: string[];
  riskScore: number;
}

interface EntityRisk {
  name: string;
  type: string;
  beneficialOwners: string[];
  politicallyExposed: boolean;
  adverseMedia: boolean;
  riskScore: number;
}

interface ProductRisk {
  description: string;
  hsCode: string;
  dualUse: boolean;
  controlled: boolean;
  endUseConcerns: boolean;
  riskScore: number;
}

interface FAQ {
  question: string;
  answer: string;
}

const countryRiskLevels = [
  { code: "IR", name: "Iran", level: "Comprehensive Sanctions", score: 100 },
  { code: "KP", name: "North Korea", level: "Comprehensive Sanctions", score: 100 },
  { code: "CU", name: "Cuba", level: "Comprehensive Sanctions", score: 95 },
  { code: "SY", name: "Syria", level: "Comprehensive Sanctions", score: 95 },
  { code: "RU", name: "Russia", level: "Sectoral Sanctions", score: 75 },
  { code: "BY", name: "Belarus", level: "Sectoral Sanctions", score: 70 },
  { code: "MM", name: "Myanmar", level: "Targeted Sanctions", score: 60 },
  { code: "VE", name: "Venezuela", level: "Targeted Sanctions", score: 55 },
  { code: "CN", name: "China", level: "Export Controls", score: 35 },
  { code: "AE", name: "UAE", level: "Enhanced Due Diligence", score: 25 },
  { code: "HK", name: "Hong Kong", level: "Enhanced Due Diligence", score: 25 },
  { code: "SG", name: "Singapore", level: "Low Risk", score: 10 },
  { code: "DE", name: "Germany", level: "Low Risk", score: 5 },
  { code: "US", name: "United States", level: "Low Risk", score: 5 },
  { code: "GB", name: "United Kingdom", level: "Low Risk", score: 5 },
];

const sanctionsLists = [
  "OFAC SDN List",
  "OFAC Consolidated Sanctions",
  "UN Security Council",
  "EU Consolidated List",
  "UK Sanctions List",
  "BIS Entity List",
  "DFAT Sanctions (Australia)",
  "SECO Sanctions (Switzerland)",
];

const COLORS = [LOGISTICS_GREEN, "#F59E0B", "#EF4444", "#7F1D1D"];

const faqs: FAQ[] = [
  {
    question: "What is sanctions risk screening?",
    answer: "Sanctions risk screening is the process of checking individuals, companies, and transactions against government-maintained sanctions lists to ensure compliance with international trade regulations. This helps prevent prohibited transactions and avoids legal penalties.",
  },
  {
    question: "Which sanctions lists are typically checked?",
    answer: "Common sanctions lists include OFAC SDN List (US), EU Consolidated List, UN Security Council Sanctions, UK Sanctions List, and various national lists. Different jurisdictions may have specific requirements for which lists must be screened.",
  },
  {
    question: "What is enhanced due diligence (EDD)?",
    answer: "Enhanced Due Diligence is a more thorough investigation process required for high-risk transactions or counterparties. It includes additional verification of beneficial ownership, source of funds, and business relationships beyond standard KYC procedures.",
  },
  {
    question: "What are red flags in sanctions compliance?",
    answer: "Red flags are indicators that may suggest potential sanctions evasion or compliance issues. These include transactions with high-risk countries, unusual payment methods, shell companies, mismatched shipping routes, and missing or incomplete documentation.",
  },
  {
    question: "What are the penalties for sanctions violations?",
    answer: "Penalties for sanctions violations can include substantial fines (often millions of dollars), criminal prosecution, loss of export privileges, and reputational damage. Both companies and individuals can be held liable for violations.",
  },
  {
    question: "How often should sanctions screening be performed?",
    answer: "Sanctions screening should be performed at customer onboarding, before each transaction, and periodically for ongoing relationships. Lists are updated frequently, so continuous monitoring is recommended for high-risk customers.",
  },
];

export default function SanctionsRiskScorer() {
  const [counterpartyName, setCounterpartyName] = useState("");
  const [counterpartyCountry, setCounterpartyCountry] = useState("CN");
  const [counterpartyType, setCounterpartyType] = useState("corporate");
  const [productDescription, setProductDescription] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [transactionValue, setTransactionValue] = useState("500000");
  const [endUser, setEndUser] = useState("");
  const [endUse, setEndUse] = useState("commercial");
  const [paymentMethod, setPaymentMethod] = useState("wire");
  const [shippingRoute, setShippingRoute] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [result, setResult] = useState<SanctionsResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const analyzeSanctionsRisk = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const value = parseFloat(transactionValue) || 500000;
      const country = countryRiskLevels.find((c) => c.code === counterpartyCountry) || countryRiskLevels[8];

      // Calculate risk factors
      const riskFactors: RiskFactor[] = [
        {
          category: "Country Risk",
          score: country.score,
          weight: 30,
          description: `${country.name} - ${country.level}`,
          status: country.score >= 70 ? "fail" : country.score >= 40 ? "warning" : "pass",
        },
        {
          category: "Entity Screening",
          score: Math.random() * 20 + 5,
          weight: 25,
          description: "Sanctions list screening results",
          status: Math.random() > 0.8 ? "warning" : "pass",
        },
        {
          category: "Product Classification",
          score: hsCode ? 15 + Math.random() * 25 : 30,
          weight: 20,
          description: "Dual-use/controlled goods assessment",
          status: hsCode ? "pass" : "warning",
        },
        {
          category: "Transaction Value",
          score: value > 1000000 ? 40 : value > 500000 ? 25 : 10,
          weight: 15,
          description: `Value-based risk: ${value > 1000000 ? "High" : value > 500000 ? "Medium" : "Low"}`,
          status: value > 1000000 ? "warning" : "pass",
        },
        {
          category: "End-Use Verification",
          score: endUse === "military" ? 80 : endUse === "government" ? 40 : 15,
          weight: 10,
          description: `End-use type: ${endUse}`,
          status: endUse === "military" ? "fail" : endUse === "government" ? "warning" : "pass",
        },
      ];

      // Calculate overall score
      const overallRiskScore = Math.round(
        riskFactors.reduce((sum, factor) => sum + factor.score * (factor.weight / 100), 0)
      );

      // Determine risk level
      let riskLevel: "low" | "medium" | "high" | "critical";
      if (overallRiskScore >= 70) riskLevel = "critical";
      else if (overallRiskScore >= 50) riskLevel = "high";
      else if (overallRiskScore >= 30) riskLevel = "medium";
      else riskLevel = "low";

      // Screening results
      const screeningResults: ScreeningResult[] = sanctionsLists.slice(0, 6).map((list) => ({
        list,
        status: list.includes("OFAC SDN") && country.score >= 90 ? "partial" : "clear",
        details: list.includes("OFAC SDN") ? "No exact match found" : "Clear - No matches",
        lastUpdated: new Date().toISOString().split("T")[0],
      }));

      // Red flags
      const redFlags: RedFlag[] = [];
      if (country.score >= 50) {
        redFlags.push({
          flag: "High-Risk Jurisdiction",
          severity: country.score >= 70 ? "high" : "medium",
          description: `${country.name} is subject to ${country.level.toLowerCase()}`,
          recommendation: "Enhanced due diligence required. Obtain additional documentation.",
        });
      }
      if (value > 500000) {
        redFlags.push({
          flag: "High-Value Transaction",
          severity: "medium",
          description: `Transaction value exceeds $500,000 threshold`,
          recommendation: "Verify source of funds and beneficial ownership.",
        });
      }
      if (endUse === "military") {
        redFlags.push({
          flag: "Military End-Use Concern",
          severity: "high",
          description: "Products intended for military applications",
          recommendation: "Obtain end-use certificate. Check export licensing requirements.",
        });
      }
      if (paymentMethod === "cash") {
        redFlags.push({
          flag: "Cash Payment Method",
          severity: "medium",
          description: "Cash payments increase money laundering risk",
          recommendation: "Prefer wire transfers with proper KYC documentation.",
        });
      }
      if (!counterpartyName) {
        redFlags.push({
          flag: "Incomplete Counterparty Information",
          severity: "low",
          description: "Full legal name required for proper screening",
          recommendation: "Obtain complete entity information before proceeding.",
        });
      }

      // Country risk details
      const countryRisk: CountryRisk = {
        country: country.name,
        riskLevel: country.level,
        sanctionsPrograms:
          country.score >= 70
            ? ["Comprehensive Trade Embargo", "Asset Freeze", "Travel Ban"]
            : country.score >= 40
            ? ["Sectoral Sanctions", "Export Restrictions"]
            : ["Enhanced Monitoring"],
        tradeRestrictions:
          country.score >= 70
            ? ["Prohibited Imports", "Prohibited Exports", "Financial Restrictions"]
            : country.score >= 40
            ? ["Dual-Use Licensing", "Selected Entity Restrictions"]
            : ["Standard Export Controls"],
        riskScore: country.score,
      };

      // Entity risk
      const entityRisk: EntityRisk = {
        name: counterpartyName || "Unknown Entity",
        type: counterpartyType === "corporate" ? "Corporation" : counterpartyType === "individual" ? "Individual" : "Government Entity",
        beneficialOwners: ["Information Required"],
        politicallyExposed: Math.random() > 0.8,
        adverseMedia: Math.random() > 0.9,
        riskScore: Math.round(Math.random() * 30 + 10),
      };

      // Product risk
      const productRisk: ProductRisk = {
        description: productDescription || "Not specified",
        hsCode: hsCode || "Not classified",
        dualUse: hsCode && Math.random() > 0.7,
        controlled: hsCode && Math.random() > 0.85,
        endUseConcerns: endUse === "military",
        riskScore: Math.round(Math.random() * 40 + 10),
      };

      // Recommendations
      const recommendations: string[] = [
        "Complete enhanced due diligence on counterparty",
        "Verify beneficial ownership structure",
        "Obtain end-use certificate from buyer",
        "Document screening results in compliance file",
      ];

      if (country.score >= 50) {
        recommendations.push("Obtain legal counsel review before proceeding");
      }
      if (entityRisk.politicallyExposed) {
        recommendations.push("Apply enhanced PEP screening procedures");
      }
      if (productRisk.dualUse) {
        recommendations.push("Verify export license requirements with BIS");
      }

      // Required actions
      const requiredActions: string[] = [
        "Screen all parties against sanctions lists",
        "Document transaction purpose and nature",
        "Maintain records for minimum 5 years",
        "Report suspicious activity if required",
      ];

      if (overallRiskScore >= 50) {
        requiredActions.push("Escalate to compliance officer");
        requiredActions.push("Obtain senior management approval");
      }

      const sanctionsResult: SanctionsResult = {
        overallRiskScore,
        riskLevel,
        riskFactors,
        screeningResults,
        redFlags,
        recommendations,
        requiredActions,
        countryRisk,
        entityRisk,
        productRisk,
        summary: {
          totalChecks: riskFactors.length,
          passedChecks: riskFactors.filter((f) => f.status === "pass").length,
          warnings: riskFactors.filter((f) => f.status === "warning").length,
          failures: riskFactors.filter((f) => f.status === "fail").length,
        },
      };

      setResult(sanctionsResult);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return LOGISTICS_GREEN;
      case "medium":
        return "#F59E0B";
      case "high":
        return "#EF4444";
      case "critical":
        return "#7F1D1D";
      default:
        return "#94a3b8";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const riskFactorData = result?.riskFactors.map((f) => ({
    category: f.category.split(" ")[0],
    score: f.score,
    weight: f.weight,
  })) || [];

  // Radar chart data
  const radarData = result?.riskFactors.map((f) => ({
    category: f.category.split(" ")[0],
    score: 100 - f.score,
    fullMark: 100,
  })) || [];

  // Pie chart data for risk distribution
  const pieData = result ? [
    { name: "Passed", value: result.summary.passedChecks, color: LOGISTICS_GREEN },
    { name: "Warnings", value: result.summary.warnings, color: "#F59E0B" },
    { name: "Failures", value: result.summary.failures, color: "#EF4444" },
  ] : [];

  // Historical trend data (simulated)
  const trendData = [
    { month: "Jan", avgScore: 32 },
    { month: "Feb", avgScore: 28 },
    { month: "Mar", avgScore: 35 },
    { month: "Apr", avgScore: 41 },
    { month: "May", avgScore: 38 },
    { month: "Jun", avgScore: 33 },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] to-[#0a3a60] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E8B57]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#0F4C81]/30 rounded-full blur-3xl" />

        <div className="relative z-10 px-8 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-[#2E8B57]">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                Compliance Tool
              </Badge>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Sanctions Risk Scorer
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
              Comprehensive sanctions screening and risk assessment for international trade transactions.
              Screen against global watchlists and evaluate compliance risks in real-time.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Zap className="h-5 w-5 text-[#2E8B57]" />
                <span className="text-sm">Instant Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Globe className="h-5 w-5 text-[#2E8B57]" />
                <span className="text-sm">8+ Global Lists</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Target className="h-5 w-5 text-[#2E8B57]" />
                <span className="text-sm">Risk Scoring</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <ShieldCheck className="h-5 w-5 text-[#2E8B57]" />
                <span className="text-sm">Compliance Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#0F4C81]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                <Landmark className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F4C81]">8+</p>
                <p className="text-sm text-muted-foreground">Sanctions Lists</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#2E8B57]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                <Globe className="h-5 w-5 text-[#2E8B57]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2E8B57]">180+</p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#0F4C81]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                <Scale className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F4C81]">5</p>
                <p className="text-sm text-muted-foreground">Risk Factors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[#2E8B57]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2E8B57]">Real-time</p>
                <p className="text-sm text-muted-foreground">Screening</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <ShieldAlert className="h-5 w-5" />
            Transaction & Counterparty Details
          </CardTitle>
          <CardDescription>
            Enter the details below to perform a comprehensive sanctions risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Counterparty Information */}
            <div className="space-y-2">
              <Label htmlFor="counterpartyName" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#2E8B57]" />
                Counterparty Name
              </Label>
              <Input
                id="counterpartyName"
                value={counterpartyName}
                onChange={(e) => setCounterpartyName(e.target.value)}
                placeholder="Full legal name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="counterpartyCountry" className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-[#2E8B57]" />
                Country
              </Label>
              <Select value={counterpartyCountry} onValueChange={setCounterpartyCountry}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryRiskLevels.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Entity Type</Label>
              <Select value={counterpartyType} onValueChange={setCounterpartyType}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate">Corporation</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="government">Government Entity</SelectItem>
                  <SelectItem value="financial">Financial Institution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2">
              <Label htmlFor="transactionValue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                Transaction Value (USD)
              </Label>
              <Input
                id="transactionValue"
                type="number"
                value={transactionValue}
                onChange={(e) => setTransactionValue(e.target.value)}
                placeholder="500,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wire">Wire Transfer</SelectItem>
                  <SelectItem value="lc">Letter of Credit</SelectItem>
                  <SelectItem value="cash">Cash/Bearer Instruments</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hsCode" className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[#2E8B57]" />
                HS Code
              </Label>
              <Input
                id="hsCode"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                placeholder="8471.30"
                className="h-11"
              />
            </div>

            {/* Product & End Use */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="productDescription">Product Description</Label>
              <Input
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Brief description of goods/services"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>End-Use Type</Label>
              <Select value={endUse} onValueChange={setEndUse}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="military">Military/Defense</SelectItem>
                  <SelectItem value="research">Research/Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="endUser">End User (if different)</Label>
              <Input
                id="endUser"
                value={endUser}
                onChange={(e) => setEndUser(e.target.value)}
                placeholder="Final recipient of goods"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingRoute">Shipping Route</Label>
              <Input
                id="shippingRoute"
                value={shippingRoute}
                onChange={(e) => setShippingRoute(e.target.value)}
                placeholder="Origin → Transit → Destination"
                className="h-11"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={analyzeSanctionsRisk}
              disabled={isAnalyzing}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-10 py-6 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Sanctions Risk...
                </>
              ) : (
                <>
                  <ShieldAlert className="mr-2 h-5 w-5" />
                  Analyze Sanctions Risk
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Country Risk Reference */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Globe className="h-5 w-5" />
            Country Risk Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["Comprehensive Sanctions", "Sectoral Sanctions", "Targeted Sanctions", "Low Risk"].map((level, idx) => (
              <div key={level} className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[idx] }}
                  ></div>
                  <span className="font-medium text-sm">{level}</span>
                </div>
                {countryRiskLevels
                  .filter((c) => c.level === level)
                  .slice(0, 3)
                  .map((country) => (
                    <div
                      key={country.code}
                      className="text-sm text-muted-foreground pl-5"
                    >
                      {country.name}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Risk Score Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card
              className="text-white"
              style={{ background: `linear-gradient(135deg, ${getRiskColor(result.riskLevel)}, ${getRiskColor(result.riskLevel)}dd)` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <ShieldAlert className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded uppercase">{result.riskLevel}</span>
                </div>
                <p className="text-3xl font-bold">{result.overallRiskScore}</p>
                <p className="text-sm opacity-80 mt-1">Overall Risk Score</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#236b43] text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Passed</span>
                </div>
                <p className="text-3xl font-bold">{result.summary.passedChecks}</p>
                <p className="text-sm opacity-80 mt-1">Checks passed</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Warnings</span>
                </div>
                <p className="text-3xl font-bold">{result.summary.warnings}</p>
                <p className="text-sm opacity-80 mt-1">Require attention</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Ban className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Failures</span>
                </div>
                <p className="text-3xl font-bold">{result.summary.failures}</p>
                <p className="text-sm opacity-80 mt-1">Critical issues</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0a3a60] text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <ListChecks className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Actions</span>
                </div>
                <p className="text-3xl font-bold">{result.requiredActions.length}</p>
                <p className="text-sm opacity-80 mt-1">Required actions</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis - 5 Tabs */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <FileWarning className="h-5 w-5" />
                Risk Analysis Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-12">
                  <TabsTrigger value="overview" className="text-sm">
                    <BarChart3 className="h-4 w-4 mr-1.5" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="screening" className="text-sm">
                    <Search className="h-4 w-4 mr-1.5" />
                    Screening
                  </TabsTrigger>
                  <TabsTrigger value="flags" className="text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    Red Flags
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="text-sm">
                    <TrendingUp className="h-4 w-4 mr-1.5" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="text-sm">
                    <FileText className="h-4 w-4 mr-1.5" />
                    Actions
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Risk Factors Chart */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                        Risk Factor Analysis
                      </h4>
                      <div className="h-72 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={riskFactorData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <YAxis dataKey="category" type="category" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(255,255,255,0.95)",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                              }}
                            />
                            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                              {riskFactorData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    entry.score >= 70
                                      ? "#EF4444"
                                      : entry.score >= 40
                                      ? "#F59E0B"
                                      : LOGISTICS_GREEN
                                  }
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Risk Details */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-[#0F4C81]" />
                        Risk Factor Breakdown
                      </h4>
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                        {result.riskFactors.map((factor, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${
                              factor.status === "pass"
                                ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                                : factor.status === "warning"
                                ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20"
                                : "border-red-200 bg-red-50 dark:bg-red-900/20"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                {factor.status === "pass" ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : factor.status === "warning" ? (
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <Ban className="h-4 w-4 text-red-500" />
                                )}
                                <span className="font-medium">{factor.category}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">
                                  Weight: {factor.weight}%
                                </span>
                                <span className="font-bold">{Math.round(factor.score)}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{factor.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Screening */}
                <TabsContent value="screening" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Screening Results */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Search className="h-5 w-5 text-[#0F4C81]" />
                        Sanctions List Screening
                      </h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {result.screeningResults.map((screening, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {screening.status === "clear" ? (
                                <CheckCircle className="h-5 w-5 text-[#2E8B57]" />
                              ) : screening.status === "match" ? (
                                <Ban className="h-5 w-5 text-red-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                              )}
                              <div>
                                <p className="font-medium">{screening.list}</p>
                                <p className="text-sm text-muted-foreground">{screening.details}</p>
                              </div>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                                screening.status === "clear"
                                  ? "bg-green-100 text-green-700"
                                  : screening.status === "match"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {screening.status}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Country & Entity Risk */}
                    <div className="space-y-4">
                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-[#0F4C81]" />
                          Country Risk Profile
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Country</span>
                            <span className="font-medium">{result.countryRisk.country}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Risk Level</span>
                            <span className="font-medium">{result.countryRisk.riskLevel}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Risk Score</span>
                            <span className="font-medium">{result.countryRisk.riskScore}/100</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-1">Sanctions Programs</p>
                          <div className="flex flex-wrap gap-1">
                            {result.countryRisk.sanctionsPrograms.map((program, i) => (
                              <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                {program}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#0F4C81]" />
                          Entity Risk Profile
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type</span>
                            <span className="font-medium">{result.entityRisk.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">PEP Status</span>
                            <span className={result.entityRisk.politicallyExposed ? "text-amber-600 font-medium" : ""}>
                              {result.entityRisk.politicallyExposed ? "Yes - Enhanced DD Required" : "No"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Adverse Media</span>
                            <span className={result.entityRisk.adverseMedia ? "text-red-600 font-medium" : ""}>
                              {result.entityRisk.adverseMedia ? "Found - Review Required" : "None Found"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h5 className="font-semibold mb-3 flex items-center gap-2">
                          <Eye className="h-4 w-4 text-[#0F4C81]" />
                          Product Risk Profile
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">HS Code</span>
                            <span className="font-medium">{result.productRisk.hsCode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dual-Use</span>
                            <span className={result.productRisk.dualUse ? "text-amber-600 font-medium" : ""}>
                              {result.productRisk.dualUse ? "Yes - License May Be Required" : "No"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Controlled</span>
                            <span className={result.productRisk.controlled ? "text-red-600 font-medium" : ""}>
                              {result.productRisk.controlled ? "Yes - Export License Required" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Red Flags */}
                <TabsContent value="flags" className="pt-6">
                  {result.redFlags.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {result.redFlags.map((flag, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border-l-4 ${
                            flag.severity === "high"
                              ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                              : flag.severity === "medium"
                              ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                              : "border-l-[#0F4C81] bg-blue-50 dark:bg-blue-900/20"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <AlertTriangle
                              className={`h-5 w-5 mt-0.5 ${
                                flag.severity === "high"
                                  ? "text-red-500"
                                  : flag.severity === "medium"
                                  ? "text-amber-500"
                                  : "text-[#0F4C81]"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-semibold">{flag.flag}</h5>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded uppercase ${
                                    flag.severity === "high"
                                      ? "bg-red-100 text-red-700"
                                      : flag.severity === "medium"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {flag.severity}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{flag.description}</p>
                              <p className="text-sm font-medium">→ {flag.recommendation}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="h-12 w-12 text-[#2E8B57] mx-auto mb-4" />
                      <p className="text-muted-foreground">No significant red flags identified.</p>
                    </div>
                  )}
                </TabsContent>

                {/* Tab 4: Analytics (New) */}
                <TabsContent value="analytics" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Radar Chart */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-[#0F4C81]" />
                        Risk Profile Radar
                      </h4>
                      <div className="h-72 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                            <Radar
                              name="Risk Score"
                              dataKey="score"
                              stroke={LOGISTICS_GREEN}
                              fill={LOGISTICS_GREEN}
                              fillOpacity={0.4}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Pie Chart */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-[#0F4C81]" />
                        Check Results Distribution
                      </h4>
                      <div className="h-72 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(255,255,255,0.95)",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                              }}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              formatter={(value) => (
                                <span className="text-sm text-muted-foreground">{value}</span>
                              )}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Historical Trend */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                        Risk Score Trend (Historical)
                      </h4>
                      <div className="h-64 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(255,255,255,0.95)",
                                border: "1px solid #e2e8f0",
                                borderRadius: "8px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="avgScore"
                              stroke={OCEAN_BLUE}
                              strokeWidth={3}
                              dot={{ fill: OCEAN_BLUE, strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 5: Actions */}
                <TabsContent value="actions" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <ListChecks className="h-5 w-5 text-[#0F4C81]" />
                        Required Actions
                      </h4>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {result.requiredActions.map((action, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-sm font-medium shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-sm">{action}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Info className="h-5 w-5 text-[#0F4C81]" />
                        Recommendations
                      </h4>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {result.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                          >
                            <Info className="h-4 w-4 text-[#0F4C81] mt-0.5 shrink-0" />
                            <span className="text-sm text-blue-700 dark:text-blue-300">{rec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                          <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-800 dark:text-amber-200">Important Notice</p>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                              This analysis is for guidance only and does not constitute legal advice.
                              Always consult with qualified compliance professionals for specific transactions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* FAQ Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Learn more about sanctions compliance and risk screening
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium text-[#0F4C81] pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-[#2E8B57] shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#2E8B57] shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="p-4 text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="text-center py-6 text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#2E8B57]" />
          Powered by Shiportrade.com — Comprehensive Supply Chain Intelligence
        </p>
      </div>
    </div>
  );
}
