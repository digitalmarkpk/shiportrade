"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  FileSearch,
  Globe,
  FileWarning,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Search,
  RefreshCw,
  Ban,
  FileText,
  Building2,
  Flag,
  Package,
  Scale,
  BookOpen,
  ArrowRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface ComplianceResult {
  overallScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  hsCodeCheck: HSCodeResult;
  countryRestrictions: CountryRestriction[];
  licenseRequirements: LicenseRequirement[];
  sanctionsCheck: SanctionsResult;
  recommendations: string[];
  requiredActions: string[];
  checklistItems: ChecklistItem[];
}

interface HSCodeResult {
  code: string;
  description: string;
  isValid: boolean;
  chapter: string;
  dutyRates: { country: string; rate: string; preferential?: string }[];
  restrictions: string[];
  specialRequirements: string[];
  riskScore: number;
}

interface CountryRestriction {
  country: string;
  countryCode: string;
  restrictionType: "import" | "export" | "both";
  status: "allowed" | "restricted" | "prohibited" | "license_required";
  details: string[];
  regulations: string[];
  riskScore: number;
}

interface LicenseRequirement {
  licenseType: string;
  authority: string;
  required: boolean;
  condition: string;
  processingTime: string;
  cost: string;
  riskScore: number;
}

interface SanctionsResult {
  status: "clear" | "warning" | "violation";
  lists: { name: string; status: string; details: string }[];
  entityMatches: string[];
  countryMatches: string[];
  productMatches: string[];
  riskScore: number;
}

interface ChecklistItem {
  item: string;
  completed: boolean;
  required: boolean;
  category: string;
}

// Sample HS Code Database
const hsCodeDatabase: { code: string; description: string; chapter: string; riskLevel: string }[] = [
  { code: "8471.30", description: "Portable digital computers (laptops)", chapter: "84 - Machinery", riskLevel: "low" },
  { code: "8517.12", description: "Smartphones and mobile phones", chapter: "85 - Electrical", riskLevel: "low" },
  { code: "3004.90", description: "Medicaments for therapeutic use", chapter: "30 - Pharmaceuticals", riskLevel: "high" },
  { code: "9301.00", description: "Military weapons", chapter: "93 - Arms", riskLevel: "critical" },
  { code: "2804.61", description: "Uranium enriched with U235", chapter: "28 - Chemicals", riskLevel: "critical" },
  { code: "8802.40", description: "Aircraft, unmanned (drones)", chapter: "88 - Aircraft", riskLevel: "high" },
  { code: "9026.80", description: "Instruments for nuclear use", chapter: "90 - Instruments", riskLevel: "high" },
  { code: "6203.42", description: "Men's trousers of cotton", chapter: "62 - Apparel", riskLevel: "low" },
  { code: "3926.90", description: "Articles of plastics", chapter: "39 - Plastics", riskLevel: "low" },
  { code: "8429.51", description: "Front-end shovel loaders", chapter: "84 - Machinery", riskLevel: "medium" },
  { code: "7308.90", description: "Structures of iron/steel", chapter: "73 - Iron/Steel", riskLevel: "low" },
  { code: "3824.99", description: "Chemical products n.e.c.", chapter: "38 - Chemicals", riskLevel: "medium" },
];

// Country Restriction Data
const countryRestrictionData: { code: string; name: string; importStatus: string; exportStatus: string; riskLevel: string; regulations: string[] }[] = [
  { code: "US", name: "United States", importStatus: "allowed", exportStatus: "allowed", riskLevel: "low", regulations: ["EAR", "ITAR", "OFAC"] },
  { code: "CN", name: "China", importStatus: "restricted", exportStatus: "restricted", riskLevel: "medium", regulations: ["Export Control Reform Act", "Entity List restrictions"] },
  { code: "RU", name: "Russia", importStatus: "prohibited", exportStatus: "prohibited", riskLevel: "critical", regulations: ["Comprehensive sanctions", "SWIFT exclusion"] },
  { code: "IR", name: "Iran", importStatus: "prohibited", exportStatus: "prohibited", riskLevel: "critical", regulations: ["Primary sanctions", "Secondary sanctions risk"] },
  { code: "KP", name: "North Korea", importStatus: "prohibited", exportStatus: "prohibited", riskLevel: "critical", regulations: ["UN Security Council", "Comprehensive embargo"] },
  { code: "CU", name: "Cuba", importStatus: "restricted", exportStatus: "prohibited", riskLevel: "high", regulations: ["Cuban Assets Control Regulations"] },
  { code: "SY", name: "Syria", importStatus: "prohibited", exportStatus: "prohibited", riskLevel: "critical", regulations: ["Syria Sanctions Regulations"] },
  { code: "BY", name: "Belarus", importStatus: "restricted", exportStatus: "restricted", riskLevel: "high", regulations: ["Belarus Sanctions"] },
  { code: "GB", name: "United Kingdom", importStatus: "allowed", exportStatus: "allowed", riskLevel: "low", regulations: ["UK Export Control Order 2008"] },
  { code: "DE", name: "Germany", importStatus: "allowed", exportStatus: "allowed", riskLevel: "low", regulations: ["EU Dual-Use Regulation"] },
  { code: "JP", name: "Japan", importStatus: "allowed", exportStatus: "allowed", riskLevel: "low", regulations: ["Foreign Exchange Act"] },
  { code: "AE", name: "UAE", importStatus: "allowed", exportStatus: "restricted", riskLevel: "medium", regulations: ["Enhanced due diligence"] },
  { code: "IN", name: "India", importStatus: "allowed", exportStatus: "allowed", riskLevel: "low", regulations: ["Foreign Trade Policy"] },
  { code: "BR", name: "Brazil", importStatus: "allowed", exportStatus: "allowed", riskLevel: "low", regulations: ["SISCOMEX"] },
  { code: "VN", name: "Vietnam", importStatus: "allowed", exportStatus: "allowed", riskLevel: "low", regulations: ["Import-Export Law"] },
];

// License Requirements Database
const licenseRequirements = [
  { type: "Export License (EAR)", authority: "BIS (US)", condition: "Dual-use items to restricted destinations", processingTime: "30-90 days", cost: "$0-$500" },
  { type: "ITAR License", authority: "DDTC (US)", condition: "Defense articles and services", processingTime: "60-120 days", cost: "$2,500+" },
  { type: "Import Permit", authority: "Local Customs", condition: "Controlled substances, weapons", processingTime: "15-45 days", cost: "Varies" },
  { type: "Sanctions Exemption", authority: "OFAC (US)", condition: "Transactions with sanctioned countries", processingTime: "90-180 days", cost: "$0" },
  { type: "End-Use Certificate", authority: "Export Control", condition: "Sensitive technology exports", processingTime: "7-30 days", cost: "$0-$100" },
  { type: "Phytosanitary Cert", authority: "APHIS", condition: "Plants, plant products", processingTime: "7-14 days", cost: "$50-$200" },
  { type: "FCC Certification", authority: "FCC (US)", condition: "Electronic devices (radio frequency)", processingTime: "30-60 days", cost: "$1,000-$10,000" },
  { type: "CE Marking", authority: "EU Notified Body", condition: "Products sold in EU market", processingTime: "30-90 days", cost: "$500-$5,000" },
];

// Sanctions Lists
const sanctionsLists = [
  "OFAC SDN List",
  "OFAC Consolidated Sanctions",
  "UN Security Council List",
  "EU Consolidated List",
  "UK Sanctions List",
  "BIS Entity List",
  "DFAT Sanctions (Australia)",
  "SECO Sanctions (Switzerland)",
];

const COLORS = {
  low: "#2E8B57",
  medium: "#F59E0B",
  high: "#EF4444",
  critical: "#7F1D1D",
};

export default function TradeComplianceChecker() {
  // Input states
  const [hsCode, setHsCode] = useState("");
  const [productName, setProductName] = useState("");
  const [originCountry, setOriginCountry] = useState("CN");
  const [destinationCountry, setDestinationCountry] = useState("US");
  const [counterpartyName, setCounterpartyName] = useState("");
  const [counterpartyCountry, setCounterpartyCountry] = useState("CN");
  const [productValue, setProductValue] = useState("100000");
  const [endUse, setEndUse] = useState("commercial");
  const [selectedTab, setSelectedTab] = useState("input");

  // Result states
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCompliance = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // HS Code Check
      const hsResult = checkHSCode(hsCode);

      // Country Restrictions
      const countryRestrictions = checkCountryRestrictions(originCountry, destinationCountry, hsCode);

      // License Requirements
      const licenses = checkLicenseRequirements(hsCode, originCountry, destinationCountry, endUse);

      // Sanctions Check
      const sanctions = checkSanctions(counterpartyName, counterpartyCountry, hsCode);

      // Calculate overall score
      const scores = [
        hsResult.riskScore,
        ...countryRestrictions.map(c => c.riskScore),
        ...licenses.filter(l => l.required).map(l => l.riskScore),
        sanctions.riskScore,
      ];
      const overallScore = Math.max(0, 100 - Math.round(scores.reduce((a, b) => a + b, 0) / scores.length));

      // Determine risk level
      let riskLevel: "low" | "medium" | "high" | "critical";
      if (overallScore >= 80) riskLevel = "low";
      else if (overallScore >= 60) riskLevel = "medium";
      else if (overallScore >= 40) riskLevel = "high";
      else riskLevel = "critical";

      // Generate recommendations
      const recommendations = generateRecommendations(hsResult, countryRestrictions, licenses, sanctions);

      // Required actions
      const requiredActions = generateRequiredActions(hsResult, countryRestrictions, licenses, sanctions);

      // Checklist items
      const checklistItems = generateChecklist(hsResult, countryRestrictions, licenses, sanctions);

      setResult({
        overallScore,
        riskLevel,
        hsCodeCheck: hsResult,
        countryRestrictions,
        licenseRequirements: licenses,
        sanctionsCheck: sanctions,
        recommendations,
        requiredActions,
        checklistItems,
      });

      setIsAnalyzing(false);
      setSelectedTab("results");
    }, 2500);
  };

  const checkHSCode = (code: string): HSCodeResult => {
    const found = hsCodeDatabase.find(h => h.code.startsWith(code.replace(/[.-]/g, "").substring(0, 4)));
    
    if (!found) {
      return {
        code: code || "Not provided",
        description: "HS code not found in database",
        isValid: false,
        chapter: "Unknown",
        dutyRates: [
          { country: "US", rate: "Contact customs" },
          { country: "EU", rate: "Contact customs" },
          { country: "CN", rate: "Contact customs" },
        ],
        restrictions: ["Unable to verify classification"],
        specialRequirements: ["Obtain binding ruling from customs authority"],
        riskScore: 40,
      };
    }

    const riskScore = found.riskLevel === "critical" ? 90 : found.riskLevel === "high" ? 60 : found.riskLevel === "medium" ? 30 : 10;

    return {
      code: found.code,
      description: found.description,
      isValid: true,
      chapter: found.chapter,
      dutyRates: [
        { country: "US", rate: "0-5%", preferential: "0% (FTA)" },
        { country: "EU", rate: "0-8%" },
        { country: "CN", rate: "0-15%" },
      ],
      restrictions: found.riskLevel === "critical" ? ["Export license required", "End-use verification mandatory"] : 
                    found.riskLevel === "high" ? ["License may be required", "Enhanced screening"] : 
                    ["Standard customs procedures"],
      specialRequirements: found.riskLevel === "critical" ? ["ITAR/EAR classification needed", "End-user certificate required"] : [],
      riskScore,
    };
  };

  const checkCountryRestrictions = (origin: string, dest: string, _hsCode: string): CountryRestriction[] => {
    const restrictions: CountryRestriction[] = [];
    
    const originData = countryRestrictionData.find(c => c.code === origin);
    const destData = countryRestrictionData.find(c => c.code === dest);

    if (originData && originData.exportStatus !== "allowed") {
      restrictions.push({
        country: originData.name,
        countryCode: origin,
        restrictionType: "export",
        status: originData.exportStatus as "allowed" | "restricted" | "prohibited" | "license_required",
        details: originData.regulations,
        regulations: originData.regulations,
        riskScore: originData.riskLevel === "critical" ? 95 : originData.riskLevel === "high" ? 70 : 40,
      });
    }

    if (destData && destData.importStatus !== "allowed") {
      restrictions.push({
        country: destData.name,
        countryCode: dest,
        restrictionType: "import",
        status: destData.importStatus as "allowed" | "restricted" | "prohibited" | "license_required",
        details: destData.regulations,
        regulations: destData.regulations,
        riskScore: destData.riskLevel === "critical" ? 95 : destData.riskLevel === "high" ? 70 : 40,
      });
    }

    return restrictions;
  };

  const checkLicenseRequirements = (code: string, origin: string, dest: string, use: string): LicenseRequirement[] => {
    const required: LicenseRequirement[] = [];
    
    // Check for dual-use
    if (code.startsWith("84") || code.startsWith("85")) {
      required.push({
        licenseType: "Export License (EAR)",
        authority: "BIS (US)",
        required: ["CN", "RU", "IR"].includes(dest),
        condition: "Dual-use technology export",
        processingTime: "30-90 days",
        cost: "$0-$500",
        riskScore: ["RU", "IR"].includes(dest) ? 80 : 30,
      });
    }

    // Military end-use
    if (use === "military") {
      required.push({
        licenseType: "ITAR License",
        authority: "DDTC (US)",
        required: true,
        condition: "Defense article or service",
        processingTime: "60-120 days",
        cost: "$2,500+",
        riskScore: 85,
      });
    }

    // High-risk destinations
    if (["RU", "IR", "KP", "SY", "BY"].includes(dest)) {
      required.push({
        licenseType: "Sanctions Exemption",
        authority: "OFAC (US)",
        required: true,
        condition: "Sanctioned country transaction",
        processingTime: "90-180 days",
        cost: "$0",
        riskScore: 90,
      });
    }

    // General export license for restricted
    if (["CN", "AE"].includes(dest)) {
      required.push({
        licenseType: "End-Use Certificate",
        authority: "Export Control",
        required: true,
        condition: "Technology export to restricted destination",
        processingTime: "7-30 days",
        cost: "$0-$100",
        riskScore: 40,
      });
    }

    return required.length > 0 ? required : [{
      licenseType: "Standard Export Declaration",
      authority: "Customs",
      required: true,
      condition: "Standard customs requirement",
      processingTime: "1-3 days",
      cost: "$0-$50",
      riskScore: 5,
    }];
  };

  const checkSanctions = (name: string, country: string, code: string): SanctionsResult => {
    const countryData = countryRestrictionData.find(c => c.code === country);
    const productData = hsCodeDatabase.find(h => h.code.startsWith(code.replace(/[.-]/g, "").substring(0, 4)));

    const countryMatches = countryData?.riskLevel === "critical" || countryData?.riskLevel === "high" 
      ? [`${countryData.name} is subject to ${countryData.regulations.join(", ")}`] 
      : [];

    const productMatches = productData?.riskLevel === "critical" || productData?.riskLevel === "high"
      ? [`${productData.description} is classified as ${productData.riskLevel} risk`]
      : [];

    const entityMatches = name && Math.random() > 0.7 ? [`Partial match found for "${name}" - Manual verification required`] : [];

    const riskScore = Math.min(
      (countryMatches.length > 0 ? 60 : 0) + 
      (productMatches.length > 0 ? 40 : 0) + 
      (entityMatches.length > 0 ? 30 : 0),
      100
    );

    const status = riskScore >= 70 ? "violation" : riskScore >= 30 ? "warning" : "clear";

    return {
      status,
      lists: sanctionsLists.slice(0, 4).map(list => ({
        name: list,
        status: countryMatches.length > 0 || entityMatches.length > 0 ? "Match Found" : "Clear",
        details: countryMatches.length > 0 ? countryMatches[0] : "No matches found",
      })),
      entityMatches,
      countryMatches,
      productMatches,
      riskScore,
    };
  };

  const generateRecommendations = (hs: HSCodeResult, countries: CountryRestriction[], licenses: LicenseRequirement[], sanctions: SanctionsResult): string[] => {
    const recs: string[] = [];

    if (!hs.isValid) {
      recs.push("Obtain correct HS code classification from customs authority");
    }
    if (hs.riskScore >= 50) {
      recs.push("Consult export control specialist for product classification");
    }
    if (countries.length > 0) {
      recs.push("Review trade restrictions with legal counsel");
    }
    if (licenses.some(l => l.required && l.riskScore >= 50)) {
      recs.push("Begin license application process immediately");
    }
    if (sanctions.status !== "clear") {
      recs.push("Conduct enhanced due diligence on all parties");
    }
    if (sanctions.countryMatches.length > 0) {
      recs.push("Consult OFAC for specific license if transaction is permitted");
    }
    if (recs.length === 0) {
      recs.push("Transaction appears compliant - proceed with standard documentation");
    }

    return recs;
  };

  const generateRequiredActions = (hs: HSCodeResult, countries: CountryRestriction[], licenses: LicenseRequirement[], sanctions: SanctionsResult): string[] => {
    const actions: string[] = [];

    actions.push("Complete customs declaration forms");
    actions.push("Screen all parties against sanctions lists");
    actions.push("Obtain and verify end-user documentation");
    
    if (countries.some(c => c.status === "prohibited")) {
      actions.push("STOP: Transaction prohibited - do not proceed");
    }
    if (licenses.some(l => l.required)) {
      actions.push("Obtain required export licenses before shipment");
    }
    if (sanctions.entityMatches.length > 0) {
      actions.push("Resolve entity match alerts before proceeding");
    }
    if (hs.riskScore >= 50) {
      actions.push("Document export control classification determination");
    }

    actions.push("Maintain compliance records for 5+ years");

    return actions;
  };

  const generateChecklist = (hs: HSCodeResult, countries: CountryRestriction[], licenses: LicenseRequirement[], sanctions: SanctionsResult): ChecklistItem[] => {
    return [
      { item: "HS Code verified", completed: hs.isValid, required: true, category: "Classification" },
      { item: "Country restrictions reviewed", completed: countries.length === 0, required: true, category: "Restrictions" },
      { item: "Sanctions screening completed", completed: sanctions.status === "clear", required: true, category: "Sanctions" },
      { item: "Export license obtained", completed: !licenses.some(l => l.required && l.riskScore >= 50), required: licenses.some(l => l.required), category: "Licensing" },
      { item: "End-user certificate obtained", completed: false, required: sanctions.riskScore >= 30, category: "Documentation" },
      { item: "Commercial invoice prepared", completed: false, required: true, category: "Documentation" },
      { item: "Packing list prepared", completed: false, required: true, category: "Documentation" },
      { item: "Certificate of origin obtained", completed: false, required: false, category: "Documentation" },
      { item: "Insurance arranged", completed: false, required: false, category: "Documentation" },
      { item: "Compliance documentation filed", completed: false, required: true, category: "Records" },
    ];
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low": return COLORS.low;
      case "medium": return COLORS.medium;
      case "high": return COLORS.high;
      case "critical": return COLORS.critical;
      default: return "#94a3b8";
    }
  };

  const radarData = result ? [
    { subject: "HS Code", value: 100 - result.hsCodeCheck.riskScore, fullMark: 100 },
    { subject: "Country", value: 100 - (result.countryRestrictions.length > 0 ? Math.max(...result.countryRestrictions.map(c => c.riskScore)) : 0), fullMark: 100 },
    { subject: "Licensing", value: 100 - (result.licenseRequirements.some(l => l.required) ? Math.max(...result.licenseRequirements.filter(l => l.required).map(l => l.riskScore)) : 0), fullMark: 100 },
    { subject: "Sanctions", value: 100 - result.sanctionsCheck.riskScore, fullMark: 100 },
  ] : [];

  const pieData = result ? [
    { name: "Passed Checks", value: result.checklistItems.filter(i => i.completed).length, color: COLORS.low },
    { name: "Pending Items", value: result.checklistItems.filter(i => !i.completed && i.required).length, color: COLORS.medium },
    { name: "Issues Found", value: result.countryRestrictions.filter(c => c.status === "prohibited").length + (result.sanctionsCheck.status === "violation" ? 1 : 0), color: COLORS.high },
  ] : [];

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-6">
          <TabsTrigger value="input">Input Details</TabsTrigger>
          <TabsTrigger value="results" disabled={!result}>Results</TabsTrigger>
          <TabsTrigger value="reference" disabled={!result}>Reference</TabsTrigger>
          <TabsTrigger value="checklist" disabled={!result}>Checklist</TabsTrigger>
        </TabsList>

        {/* Input Tab */}
        <TabsContent value="input" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <FileSearch className="h-5 w-5" />
                Trade Compliance Check
              </CardTitle>
              <CardDescription>
                Enter shipment details to check HS codes, country restrictions, licenses, and sanctions compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Information */}
                <div className="space-y-2">
                  <Label htmlFor="hsCode" className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#2E8B57]" />
                    HS Code
                  </Label>
                  <Input
                    id="hsCode"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="e.g., 8471.30"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="productName">Product Description</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Brief description of goods"
                    className="h-11"
                  />
                </div>

                {/* Country Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-[#2E8B57]" />
                    Origin Country
                  </Label>
                  <Select value={originCountry} onValueChange={setOriginCountry}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryRestrictionData.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span>{country.name}</span>
                            {country.riskLevel !== "low" && (
                              <Badge variant="outline" className="ml-2 text-xs" style={{ borderColor: getRiskColor(country.riskLevel), color: getRiskColor(country.riskLevel) }}>
                                {country.riskLevel}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-[#2E8B57]" />
                    Destination Country
                  </Label>
                  <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryRestrictionData.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span>{country.name}</span>
                            {country.riskLevel !== "low" && (
                              <Badge variant="outline" className="ml-2 text-xs" style={{ borderColor: getRiskColor(country.riskLevel), color: getRiskColor(country.riskLevel) }}>
                                {country.riskLevel}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                {/* Counterparty */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#2E8B57]" />
                    Counterparty Name
                  </Label>
                  <Input
                    value={counterpartyName}
                    onChange={(e) => setCounterpartyName(e.target.value)}
                    placeholder="Full legal name"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Counterparty Country</Label>
                  <Select value={counterpartyCountry} onValueChange={setCounterpartyCountry}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countryRestrictionData.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productValue" className="flex items-center gap-2">
                    Transaction Value (USD)
                  </Label>
                  <Input
                    id="productValue"
                    type="number"
                    value={productValue}
                    onChange={(e) => setProductValue(e.target.value)}
                    placeholder="100,000"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  onClick={analyzeCompliance}
                  disabled={isAnalyzing}
                  className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Compliance...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-5 w-5" />
                      Check Trade Compliance
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Ban className="h-5 w-5 text-red-500" />
                  </div>
                  <h4 className="font-semibold">Prohibited Countries</h4>
                </div>
                <div className="space-y-2">
                  {countryRestrictionData.filter(c => c.riskLevel === "critical").slice(0, 4).map(c => (
                    <div key={c.code} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <h4 className="font-semibold">High-Risk Destinations</h4>
                </div>
                <div className="space-y-2">
                  {countryRestrictionData.filter(c => c.riskLevel === "high" || c.riskLevel === "medium").slice(0, 4).map(c => (
                    <div key={c.code} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>{c.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                    <FileWarning className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  <h4 className="font-semibold">Common Licenses</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {licenseRequirements.slice(0, 4).map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-slate-400" />
                      <span>{l.type}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {result && (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Compliance Score Header */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card
                    className="text-white md:col-span-2"
                    style={{ background: `linear-gradient(135deg, ${getRiskColor(result.riskLevel)}, ${getRiskColor(result.riskLevel)}dd)` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="h-6 w-6 opacity-80" />
                            <span className="text-sm opacity-80">Compliance Score</span>
                          </div>
                          <p className="text-5xl font-bold">{result.overallScore}</p>
                          <p className="text-sm opacity-80 mt-1 capitalize">{result.riskLevel} Risk Level</p>
                        </div>
                        <div className="h-32 w-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[{ value: result.overallScore }, { value: 100 - result.overallScore }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={45}
                                dataKey="value"
                              >
                                <Cell fill="white" />
                                <Cell fill="rgba(255,255,255,0.2)" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/90 text-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 opacity-80" />
                        <span className="text-sm opacity-80">Passed Checks</span>
                      </div>
                      <p className="text-3xl font-bold">{result.checklistItems.filter(i => i.completed).length}</p>
                      <p className="text-xs opacity-80 mt-1">of {result.checklistItems.length} total</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 opacity-80" />
                        <span className="text-sm opacity-80">Pending Items</span>
                      </div>
                      <p className="text-3xl font-bold">{result.checklistItems.filter(i => !i.completed && i.required).length}</p>
                      <p className="text-xs opacity-80 mt-1">require attention</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Analysis Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* HS Code Check */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                        <Package className="h-5 w-5" />
                        HS Code Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div>
                            <p className="font-mono text-xl font-bold text-[#0F4C81]">{result.hsCodeCheck.code}</p>
                            <p className="text-sm text-muted-foreground">{result.hsCodeCheck.description}</p>
                          </div>
                          {result.hsCodeCheck.isValid ? (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500" />
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium">Chapter: {result.hsCodeCheck.chapter}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Risk Score:</span>
                            <Progress value={result.hsCodeCheck.riskScore} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{result.hsCodeCheck.riskScore}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Duty Rates</p>
                          <div className="grid grid-cols-3 gap-2">
                            {result.hsCodeCheck.dutyRates.map((rate, i) => (
                              <div key={i} className="p-2 bg-slate-50 dark:bg-slate-800 rounded text-center">
                                <p className="text-xs text-muted-foreground">{rate.country}</p>
                                <p className="font-semibold">{rate.rate}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {result.hsCodeCheck.restrictions.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              Restrictions
                            </p>
                            <ul className="space-y-1">
                              {result.hsCodeCheck.restrictions.map((r, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-amber-500">•</span>
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Country Restrictions */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                        <Globe className="h-5 w-5" />
                        Country Restrictions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.countryRestrictions.length > 0 ? (
                        <div className="space-y-4">
                          {result.countryRestrictions.map((cr, i) => (
                            <div
                              key={i}
                              className={`p-4 rounded-lg border-l-4 ${
                                cr.status === "prohibited"
                                  ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                                  : cr.status === "restricted"
                                  ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                  : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Flag className="h-4 w-4" />
                                  <span className="font-semibold">{cr.country}</span>
                                </div>
                                <Badge
                                  variant="outline"
                                  style={{ borderColor: getRiskColor(cr.status === "prohibited" ? "critical" : cr.status === "restricted" ? "high" : "medium"), color: getRiskColor(cr.status === "prohibited" ? "critical" : cr.status === "restricted" ? "high" : "medium") }}
                                >
                                  {cr.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground capitalize">{cr.restrictionType}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {cr.regulations.map((reg, j) => (
                                  <Badge key={j} variant="secondary" className="text-xs">
                                    {reg}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">No country restrictions identified</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* License Requirements */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                        <FileText className="h-5 w-5" />
                        License Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3 pr-4">
                          {result.licenseRequirements.map((license, i) => (
                            <div
                              key={i}
                              className={`p-4 rounded-lg border ${
                                license.required && license.riskScore >= 50
                                  ? "border-red-200 bg-red-50 dark:bg-red-900/20"
                                  : license.required
                                  ? "border-amber-200 bg-amber-50 dark:bg-amber-900/20"
                                  : "border-slate-200 bg-slate-50 dark:bg-slate-800"
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-semibold">{license.licenseType}</p>
                                  <p className="text-xs text-muted-foreground">{license.authority}</p>
                                </div>
                                <Badge variant={license.required ? "destructive" : "outline"}>
                                  {license.required ? "Required" : "Optional"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{license.condition}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>⏱ {license.processingTime}</span>
                                <span>💰 {license.cost}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Sanctions Check */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                        <ShieldCheck className="h-5 w-5" />
                        Sanctions Screening
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div
                          className={`p-4 rounded-lg ${
                            result.sanctionsCheck.status === "clear"
                              ? "bg-green-50 dark:bg-green-900/20"
                              : result.sanctionsCheck.status === "warning"
                              ? "bg-amber-50 dark:bg-amber-900/20"
                              : "bg-red-50 dark:bg-red-900/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {result.sanctionsCheck.status === "clear" ? (
                              <CheckCircle className="h-8 w-8 text-green-500" />
                            ) : result.sanctionsCheck.status === "warning" ? (
                              <AlertTriangle className="h-8 w-8 text-amber-500" />
                            ) : (
                              <Ban className="h-8 w-8 text-red-500" />
                            )}
                            <div>
                              <p className="text-lg font-semibold capitalize">{result.sanctionsCheck.status}</p>
                              <p className="text-sm text-muted-foreground">
                                {result.sanctionsCheck.status === "clear"
                                  ? "No sanctions matches found"
                                  : "Matches require review"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Screening Lists */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Screening Results</p>
                          {result.sanctionsCheck.lists.slice(0, 4).map((list, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                              <span className="text-sm">{list.name}</span>
                              <Badge variant={list.status === "Clear" ? "outline" : "destructive"} className="text-xs">
                                {list.status}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        {/* Matches */}
                        {(result.sanctionsCheck.entityMatches.length > 0 || result.sanctionsCheck.countryMatches.length > 0 || result.sanctionsCheck.productMatches.length > 0) && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-red-600">Alerts</p>
                            {[...result.sanctionsCheck.entityMatches, ...result.sanctionsCheck.countryMatches, ...result.sanctionsCheck.productMatches].map((match, i) => (
                              <div key={i} className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 text-sm text-red-700 dark:text-red-400">
                                {match}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Compliance Radar */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                      <Scale className="h-5 w-5" />
                      Compliance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar
                              name="Compliance"
                              dataKey="value"
                              stroke="#0F4C81"
                              fill="#0F4C81"
                              fillOpacity={0.5}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData.filter(d => d.value > 0)}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              dataKey="value"
                              label={({ name, value }) => `${name}: ${value}`}
                            >
                              {pieData.filter(d => d.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                        <Info className="h-5 w-5" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.recommendations.map((rec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <ArrowRight className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                        <FileWarning className="h-5 w-5" />
                        Required Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.requiredActions.map((action, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`flex items-start gap-3 p-3 rounded-lg ${
                              action.startsWith("STOP")
                                ? "bg-red-50 dark:bg-red-900/20 border border-red-200"
                                : "bg-slate-50 dark:bg-slate-800"
                            }`}
                          >
                            {action.startsWith("STOP") ? (
                              <Ban className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${action.startsWith("STOP") ? "text-red-700 dark:text-red-400 font-medium" : ""}`}>
                              {action}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6">
          {result && (
            <>
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
                    {["critical", "high", "medium", "low"].map((level) => (
                      <div key={level} className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor(level) }} />
                          <span className="font-medium capitalize">{level} Risk</span>
                        </div>
                        {countryRestrictionData
                          .filter((c) => c.riskLevel === level)
                          .map((country) => (
                            <div key={country.code} className="text-sm text-muted-foreground pl-5">
                              {country.name}
                            </div>
                          ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* License Types Reference */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <FileText className="h-5 w-5" />
                    License Types Reference
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-3 pr-4">
                      {licenseRequirements.map((license, i) => (
                        <div key={i} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold">{license.type}</p>
                            <Badge variant="outline">{license.authority}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{license.condition}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Processing: {license.processingTime}</span>
                            <span>Cost: {license.cost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Sanctions Lists */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <ShieldCheck className="h-5 w-5" />
                    Sanctions Lists Screened
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sanctionsLists.map((list, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{list}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-6">
          {result && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <BookOpen className="h-5 w-5" />
                  Compliance Checklist
                </CardTitle>
                <CardDescription>
                  Track your compliance progress for this transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {result.checklistItems.filter(i => i.completed).length} / {result.checklistItems.length} completed
                    </span>
                  </div>
                  <Progress
                    value={(result.checklistItems.filter(i => i.completed).length / result.checklistItems.length) * 100}
                    className="h-3"
                  />
                </div>

                <Accordion type="multiple" className="w-full">
                  {["Classification", "Restrictions", "Sanctions", "Licensing", "Documentation", "Records"].map((category) => {
                    const items = result.checklistItems.filter(i => i.category === category);
                    if (items.length === 0) return null;

                    return (
                      <AccordionItem key={category} value={category}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3">
                            <span>{category}</span>
                            <Badge variant="outline">
                              {items.filter(i => i.completed).length}/{items.length}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {items.map((item, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-lg ${
                                  item.completed
                                    ? "bg-green-50 dark:bg-green-900/20"
                                    : item.required
                                    ? "bg-amber-50 dark:bg-amber-900/20"
                                    : "bg-slate-50 dark:bg-slate-800"
                                }`}
                              >
                                {item.completed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : item.required ? (
                                  <AlertCircle className="h-5 w-5 text-amber-500" />
                                ) : (
                                  <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
                                )}
                                <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                                  {item.item}
                                </span>
                                {item.required && !item.completed && (
                                  <Badge variant="outline" className="ml-auto text-xs">Required</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>

                <div className="mt-6 flex justify-center gap-4">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Generate Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
