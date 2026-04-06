"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Ban,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileWarning,
  Globe,
  HelpCircle,
  Info,
  Lightbulb,
  Package,
  RefreshCw,
  Scale,
  Search,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Siren,
  Truck,
  XCircle,
  AlertCircle,
  FileText,
  Link2,
  MapPin,
  BookOpen,
  Zap,
  X,
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
import { Progress } from "@/components/ui/progress";
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
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { toast } from "sonner";

// Types
interface RestrictedGoodsResult {
  overallStatus: "allowed" | "restricted" | "prohibited" | "requires_license";
  severityScore: number;
  restrictionDetails: RestrictionDetail[];
  licenseRequirements: LicenseRequirement[];
  exemptions: Exemption[];
  regulatoryAuthorities: RegulatoryAuthority[];
  sanctionsFlags: SanctionsFlag[];
  recommendations: string[];
  alternativeOptions: string[];
}

interface RestrictionDetail {
  category: string;
  type: "prohibited" | "restricted" | "license_required" | "allowed";
  reason: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  direction: "import" | "export" | "both";
}

interface LicenseRequirement {
  licenseType: string;
  issuingAuthority: string;
  processingTime: string;
  validityPeriod: string;
  cost: string;
  requiredDocuments: string[];
  applicationUrl?: string;
}

interface Exemption {
  name: string;
  description: string;
  conditions: string[];
  applicability: string;
}

interface RegulatoryAuthority {
  name: string;
  country: string;
  website: string;
  contact: string;
  jurisdiction: string;
}

interface SanctionsFlag {
  type: string;
  description: string;
  severity: "info" | "warning" | "critical";
  source: string;
}

interface RestrictedGoodsCategory {
  id: string;
  name: string;
  hsCodePrefix: string;
  description: string;
  restrictions: RestrictionInfo[];
  icon: string;
}

interface RestrictionInfo {
  countries: string[];
  type: "prohibited" | "restricted" | "license_required";
  reason: string;
  authority: string;
}

interface CountryData {
  code: string;
  name: string;
  region: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  sanctionsPrograms: string[];
  majorRestrictions: string[];
}

// Sample Data
const restrictedGoodsCategories: RestrictedGoodsCategory[] = [
  {
    id: "dual-use",
    name: "Dual-Use Goods",
    hsCodePrefix: "84, 85, 90",
    description: "Items with both civilian and military applications",
    icon: "⚙️",
    restrictions: [
      { countries: ["IR", "KP", "CU", "SY"], type: "prohibited", reason: "Comprehensive sanctions", authority: "BIS/OFAC" },
      { countries: ["RU", "BY"], type: "restricted", reason: "Export controls", authority: "BIS" },
      { countries: ["CN"], type: "license_required", reason: "End-use verification", authority: "BIS" },
    ],
  },
  {
    id: "hazardous",
    name: "Hazardous Materials",
    hsCodePrefix: "28, 29, 38",
    description: "Chemicals, toxic substances, and dangerous goods",
    icon: "☢️",
    restrictions: [
      { countries: ["ALL"], type: "license_required", reason: "Safety regulations", authority: "EPA/DOT" },
      { countries: ["IR", "KP"], type: "prohibited", reason: "Sanctions", authority: "OFAC" },
    ],
  },
  {
    id: "endangered",
    name: "Endangered Species",
    hsCodePrefix: "01, 02, 05, 41, 43",
    description: "Wildlife and products from protected species",
    icon: "🦏",
    restrictions: [
      { countries: ["ALL"], type: "license_required", reason: "CITES Convention", authority: "CITES" },
      { countries: ["ALL"], type: "restricted", reason: "Conservation laws", authority: "USFWS" },
    ],
  },
  {
    id: "pharmaceuticals",
    name: "Pharmaceuticals & Drugs",
    hsCodePrefix: "29, 30",
    description: "Medicines, controlled substances, precursors",
    icon: "💊",
    restrictions: [
      { countries: ["ALL"], type: "license_required", reason: "Drug enforcement", authority: "DEA/FDA" },
      { countries: ["IR", "KP", "CU"], type: "restricted", reason: "Sanctions", authority: "OFAC" },
    ],
  },
  {
    id: "weapons",
    name: "Weapons & Ammunition",
    hsCodePrefix: "93",
    description: "Firearms, ammunition, and defense articles",
    icon: "🔫",
    restrictions: [
      { countries: ["ALL"], type: "license_required", reason: "Arms control", authority: "DDTC/BIS" },
      { countries: ["IR", "KP", "CU", "SY"], type: "prohibited", reason: "Arms embargo", authority: "UN/OFAC" },
    ],
  },
  {
    id: "nuclear",
    name: "Nuclear Materials",
    hsCodePrefix: "28.44, 28.45",
    description: "Radioactive materials and nuclear equipment",
    icon: "☢️",
    restrictions: [
      { countries: ["ALL"], type: "license_required", reason: "Non-proliferation", authority: "NRC/IAEA" },
      { countries: ["IR", "KP"], type: "prohibited", reason: "Nuclear sanctions", authority: "UN/IAEA" },
    ],
  },
  {
    id: "cultural",
    name: "Cultural Artifacts",
    hsCodePrefix: "97",
    description: "Antiquities, artworks, and cultural property",
    icon: "🏺",
    restrictions: [
      { countries: ["SY", "IQ", "LY", "YE"], type: "prohibited", reason: "Cultural property protection", authority: "CBP/UNESCO" },
      { countries: ["EG", "TR", "IT", "GR"], type: "restricted", reason: "Heritage laws", authority: "National Authorities" },
    ],
  },
  {
    id: "cryptocurrency",
    name: "Cryptocurrency Hardware",
    hsCodePrefix: "84.71",
    description: "Hardware wallets, mining equipment",
    icon: "🔐",
    restrictions: [
      { countries: ["IR", "KP"], type: "prohibited", reason: "Financial sanctions", authority: "OFAC" },
      { countries: ["CN"], type: "restricted", reason: "Export controls", authority: "BIS" },
    ],
  },
  {
    id: "precious-materials",
    name: "Precious Metals & Stones",
    hsCodePrefix: "71",
    description: "Gold, diamonds, precious metals and stones",
    icon: "💎",
    restrictions: [
      { countries: ["IR", "KP", "RU"], type: "restricted", reason: "Sanctions evasion prevention", authority: "OFAC" },
      { countries: ["ZW", "MM", "VE"], type: "license_required", reason: "Conflict minerals", authority: "SEC/DOL" },
    ],
  },
  {
    id: "agricultural",
    name: "Agricultural Products",
    hsCodePrefix: "01-24",
    description: "Plants, seeds, livestock, food products",
    icon: "🌾",
    restrictions: [
      { countries: ["ALL"], type: "license_required", reason: "Phytosanitary requirements", authority: "USDA/APHIS" },
      { countries: ["IR", "KP", "CU"], type: "restricted", reason: "Trade restrictions", authority: "OFAC" },
    ],
  },
];

const countries: CountryData[] = [
  { code: "US", name: "United States", region: "North America", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "GB", name: "United Kingdom", region: "Europe", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "DE", name: "Germany", region: "Europe", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "FR", name: "France", region: "Europe", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "CN", name: "China", region: "Asia", riskLevel: "medium", sanctionsPrograms: ["Export Controls", "Entity List"], majorRestrictions: ["Dual-use items", "Technology transfer"] },
  { code: "RU", name: "Russia", region: "Europe/Asia", riskLevel: "critical", sanctionsPrograms: ["Comprehensive Sectoral Sanctions", "SWIFT Ban"], majorRestrictions: ["Oil/gas equipment", "Financial services", "Technology"] },
  { code: "IR", name: "Iran", region: "Middle East", riskLevel: "critical", sanctionsPrograms: ["Comprehensive Sanctions", "Secondary Sanctions"], majorRestrictions: ["Almost all trade", "Financial transactions", "Oil exports"] },
  { code: "KP", name: "North Korea", region: "Asia", riskLevel: "critical", sanctionsPrograms: ["UN Security Council", "Comprehensive Embargo"], majorRestrictions: ["All trade", "Financial services", "Arms"] },
  { code: "CU", name: "Cuba", region: "Caribbean", riskLevel: "high", sanctionsPrograms: ["US Embargo", "Trade Restrictions"], majorRestrictions: ["Most goods", "Financial services"] },
  { code: "SY", name: "Syria", region: "Middle East", riskLevel: "critical", sanctionsPrograms: ["Comprehensive Sanctions"], majorRestrictions: ["Oil, arms, financial"] },
  { code: "BY", name: "Belarus", region: "Europe", riskLevel: "high", sanctionsPrograms: ["Sectoral Sanctions"], majorRestrictions: ["Financial services", "Potash", "Oil"] },
  { code: "MM", name: "Myanmar", region: "Asia", riskLevel: "high", sanctionsPrograms: ["Targeted Sanctions"], majorRestrictions: ["Arms", "Dual-use goods"] },
  { code: "VE", name: "Venezuela", region: "South America", riskLevel: "medium", sanctionsPrograms: ["Targeted Sanctions"], majorRestrictions: ["Oil sector", "Government entities"] },
  { code: "AE", name: "UAE", region: "Middle East", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "SG", name: "Singapore", region: "Asia", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "JP", name: "Japan", region: "Asia", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "KR", name: "South Korea", region: "Asia", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "IN", name: "India", region: "Asia", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "BR", name: "Brazil", region: "South America", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "AU", name: "Australia", region: "Oceania", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "CA", name: "Canada", region: "North America", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "MX", name: "Mexico", region: "North America", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "HK", name: "Hong Kong", region: "Asia", riskLevel: "medium", sanctionsPrograms: ["Enhanced Monitoring"], majorRestrictions: ["Technology exports"] },
  { code: "TW", name: "Taiwan", region: "Asia", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "ZA", name: "South Africa", region: "Africa", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "NG", name: "Nigeria", region: "Africa", riskLevel: "medium", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "TR", name: "Turkey", region: "Europe/Asia", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "SA", name: "Saudi Arabia", region: "Middle East", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "IL", name: "Israel", region: "Middle East", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
  { code: "EG", name: "Egypt", region: "Africa", riskLevel: "low", sanctionsPrograms: [], majorRestrictions: [] },
];

const regulatoryAuthorities: RegulatoryAuthority[] = [
  { name: "Bureau of Industry and Security (BIS)", country: "US", website: "https://bis.doc.gov", contact: "exportcounselors@bis.doc.gov", jurisdiction: "Dual-use exports, EAR" },
  { name: "Office of Foreign Assets Control (OFAC)", country: "US", website: "https://treasury.gov/ofac", contact: "ofac_feedback@treasury.gov", jurisdiction: "Sanctions enforcement" },
  { name: "Directorate of Defense Trade Controls (DDTC)", country: "US", website: "https://pmddtc.state.gov", contact: "DDTCResponseTeam@state.gov", jurisdiction: "Defense articles, ITAR" },
  { name: "Drug Enforcement Administration (DEA)", country: "US", website: "https://dea.gov", contact: "import.export@usdoj.gov", jurisdiction: "Controlled substances" },
  { name: "Food and Drug Administration (FDA)", country: "US", website: "https://fda.gov", contact: "import@fda.gov", jurisdiction: "Food, drugs, medical devices" },
  { name: "U.S. Customs and Border Protection", country: "US", website: "https://cbp.gov", contact: "AskCBP@cbp.dhs.gov", jurisdiction: "Import enforcement" },
  { name: "U.S. Fish and Wildlife Service", country: "US", website: "https://fws.gov", contact: "permits@fws.gov", jurisdiction: "Wildlife, CITES" },
  { name: "European Commission DG TRADE", country: "EU", website: "https://ec.europa.eu/trade", contact: "trade@ec.europa.eu", jurisdiction: "EU dual-use exports" },
  { name: "UK Export Control Joint Unit", country: "UK", website: "https://gov.uk/guidance/export-controls", contact: "ecju@businessandtrade.gov.uk", jurisdiction: "UK export controls" },
  { name: "UN Security Council", country: "UN", website: "https://un.org/sc/suborg/en/sanctions", contact: "sanctions@un.org", jurisdiction: "UN sanctions regimes" },
  { name: "CITES Secretariat", country: "International", website: "https://cites.org", contact: "info@cites.org", jurisdiction: "Endangered species trade" },
  { name: "International Atomic Energy Agency", country: "International", website: "https://iaea.org", contact: "info@iaea.org", jurisdiction: "Nuclear materials" },
];

const COLORS = {
  prohibited: "#EF4444",
  restricted: "#F59E0B",
  license_required: "#3B82F6",
  allowed: "#2E8B57",
  low: "#2E8B57",
  medium: "#F59E0B",
  high: "#EF4444",
  critical: "#7F1D1D",
};

const SEVERITY_COLORS = ["#2E8B57", "#F59E0B", "#EF4444", "#7F1D1D"];

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

export default function RestrictedGoodsChecker() {
  const [hsCode, setHsCode] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [originCountry, setOriginCountry] = useState("CN");
  const [destinationCountry, setDestinationCountry] = useState("US");
  const [tradeDirection, setTradeDirection] = useState<"import" | "export">("import");
  const [endUse, setEndUse] = useState("commercial");
  const [result, setResult] = useState<RestrictedGoodsResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("checker");

  const analyzeRestrictions = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const origin = countries.find((c) => c.code === originCountry) || countries[4];
      const destination = countries.find((c) => c.code === destinationCountry) || countries[0];

      // Determine product category
      let matchedCategory: RestrictedGoodsCategory | null = null;
      if (productCategory) {
        matchedCategory = restrictedGoodsCategories.find((c) => c.id === productCategory) || null;
      } else if (hsCode) {
        matchedCategory = restrictedGoodsCategories.find((c) =>
          c.hsCodePrefix.split(", ").some((prefix) => hsCode.startsWith(prefix))
        ) || null;
      }

      // Calculate restriction details
      const restrictionDetails: RestrictionDetail[] = [];

      // Country-based restrictions
      if (destination.riskLevel === "critical") {
        restrictionDetails.push({
          category: "Country Sanctions",
          type: "prohibited",
          reason: `${destination.name} is subject to comprehensive sanctions`,
          description: `Trade with ${destination.name} is heavily restricted under ${destination.sanctionsPrograms.join(", ")}`,
          severity: "critical",
          direction: "both",
        });
      } else if (destination.riskLevel === "high") {
        restrictionDetails.push({
          category: "Country Restrictions",
          type: "restricted",
          reason: `${destination.name} is subject to targeted sanctions`,
          description: `Certain goods and transactions require additional licenses and due diligence`,
          severity: "high",
          direction: "both",
        });
      }

      // Product-based restrictions
      if (matchedCategory) {
        const productRestriction = matchedCategory.restrictions.find((r) =>
          r.countries.includes("ALL") || r.countries.includes(destination.code)
        );

        if (productRestriction) {
          restrictionDetails.push({
            category: matchedCategory.name,
            type: productRestriction.type,
            reason: productRestriction.reason,
            description: `${matchedCategory.description} - Authority: ${productRestriction.authority}`,
            severity: productRestriction.type === "prohibited" ? "critical" : productRestriction.type === "restricted" ? "high" : "medium",
            direction: tradeDirection,
          });
        }
      }

      // End-use restrictions
      if (endUse === "military") {
        restrictionDetails.push({
          category: "End-Use Concern",
          type: "license_required",
          reason: "Military end-use requires additional authorization",
          description: "Goods intended for military applications are subject to ITAR/EAR controls",
          severity: "high",
          direction: "export",
        });
      }

      // Calculate overall status
      let overallStatus: RestrictedGoodsResult["overallStatus"] = "allowed";
      let severityScore = 0;

      if (restrictionDetails.some((r) => r.type === "prohibited")) {
        overallStatus = "prohibited";
        severityScore = 100;
      } else if (restrictionDetails.some((r) => r.type === "restricted")) {
        overallStatus = "restricted";
        severityScore = 70;
      } else if (restrictionDetails.some((r) => r.type === "license_required")) {
        overallStatus = "requires_license";
        severityScore = 50;
      } else {
        severityScore = 20;
      }

      // Generate license requirements
      const licenseRequirements: LicenseRequirement[] = [];
      if (matchedCategory) {
        if (matchedCategory.id === "dual-use") {
          licenseRequirements.push({
            licenseType: "BIS Export License (EAR)",
            issuingAuthority: "Bureau of Industry and Security",
            processingTime: "30-90 days",
            validityPeriod: "2 years",
            cost: "No fee",
            requiredDocuments: ["End-Use Certificate", "Purchase Order", "BIS-711 Statement"],
            applicationUrl: "https://snapr.bis.doc.gov",
          });
        }
        if (matchedCategory.id === "weapons") {
          licenseRequirements.push({
            licenseType: "DDTC License (ITAR)",
            issuingAuthority: "Directorate of Defense Trade Controls",
            processingTime: "60-120 days",
            validityPeriod: "4 years",
            cost: "$250 - $2,500",
            requiredDocuments: ["DSP-5 Form", "End-User Certificate", "Purchase Agreement", "Technical Specifications"],
            applicationUrl: "https://decons3.visa.com",
          });
        }
        if (matchedCategory.id === "hazardous") {
          licenseRequirements.push({
            licenseType: "Hazardous Materials Permit",
            issuingAuthority: "EPA/DOT",
            processingTime: "45-60 days",
            validityPeriod: "1-3 years",
            cost: "$100 - $500",
            requiredDocuments: ["Material Safety Data Sheet", "Emergency Response Plan", "Training Certificates"],
          });
        }
        if (matchedCategory.id === "endangered") {
          licenseRequirements.push({
            licenseType: "CITES Permit",
            issuingAuthority: "U.S. Fish and Wildlife Service",
            processingTime: "60-90 days",
            validityPeriod: "6 months - 2 years",
            cost: "$100 - $500",
            requiredDocuments: ["Scientific Name Documentation", "Origin Certificate", "Purpose Declaration"],
            applicationUrl: "https://fws.gov/permits",
          });
        }
        if (matchedCategory.id === "pharmaceuticals") {
          licenseRequirements.push(
            {
              licenseType: "DEA Registration",
              issuingAuthority: "Drug Enforcement Administration",
              processingTime: "45-90 days",
              validityPeriod: "1 year",
              cost: "$888",
              requiredDocuments: ["DEA-225 Form", "State License", "Background Check"],
            },
            {
              licenseType: "FDA Import Permit",
              issuingAuthority: "Food and Drug Administration",
              processingTime: "30-60 days",
              validityPeriod: "Per shipment",
              cost: "No fee",
              requiredDocuments: ["Product Registration", "Labeling Compliance", "Prior Notice"],
            }
          );
        }
      }

      // Generate exemptions
      const exemptions: Exemption[] = [];
      if (overallStatus !== "prohibited") {
        if (matchedCategory?.id === "dual-use") {
          exemptions.push({
            name: "EAR99 Items",
            description: "Items not specifically listed on the CCL may be exported without a license to most destinations",
            conditions: ["Item not on Commerce Control List", "No sanctioned end-user", "No prohibited end-use"],
            applicability: "Most countries except sanctioned destinations",
          });
        }
        exemptions.push({
          name: "Temporary Export/Import",
          description: "Goods intended for temporary use and return within 12 months",
          conditions: ["Return within 12 months", "No modification", "No change in ownership"],
          applicability: "Most goods excluding controlled substances",
        });
        exemptions.push({
          name: "Humanitarian Exemption",
          description: "Certain humanitarian goods may be exempt from sanctions restrictions",
          conditions: ["Food and medicine", "Licensed NGO", "End-user verification"],
          applicability: "Food, medicine, humanitarian supplies",
        });
        exemptions.push({
          name: "Low-Value Shipment",
          description: "Shipments below de minimis value thresholds",
          conditions: ["Value below $2,500", "No controlled items", "Single shipment per year"],
          applicability: "Most non-controlled goods",
        });
      }

      // Sanctions flags
      const sanctionsFlags: SanctionsFlag[] = [];
      if (destination.sanctionsPrograms.length > 0) {
        sanctionsFlags.push({
          type: "Sanctioned Destination",
          description: `${destination.name} is subject to: ${destination.sanctionsPrograms.join(", ")}`,
          severity: destination.riskLevel === "critical" ? "critical" : "warning",
          source: "OFAC/UN Sanctions Lists",
        });
      }
      if (origin.riskLevel === "critical" || origin.riskLevel === "high") {
        sanctionsFlags.push({
          type: "High-Risk Origin",
          description: `Goods originating from ${origin.name} may be subject to additional scrutiny`,
          severity: "warning",
          source: "Customs Regulations",
        });
      }
      if (endUse === "military") {
        sanctionsFlags.push({
          type: "Military End-Use",
          description: "Military end-use may trigger additional export controls under ITAR/EAR",
          severity: "critical",
          source: "ITAR/EAR Regulations",
        });
      }

      // Recommendations
      const recommendations: string[] = [];
      if (overallStatus === "prohibited") {
        recommendations.push("This transaction cannot proceed due to comprehensive sanctions");
        recommendations.push("Consider alternative destinations not subject to sanctions");
        recommendations.push("Consult with legal counsel before taking any action");
      } else if (overallStatus === "restricted") {
        recommendations.push("Apply for the necessary licenses before proceeding");
        recommendations.push("Conduct enhanced due diligence on all parties");
        recommendations.push("Document the entire transaction thoroughly");
      } else if (overallStatus === "requires_license") {
        recommendations.push("Apply for export/import licenses well in advance");
        recommendations.push("Ensure all required documentation is complete");
        recommendations.push("Verify end-use and end-user before shipment");
      } else {
        recommendations.push("Transaction appears permissible under current regulations");
        recommendations.push("Maintain proper documentation for compliance records");
        recommendations.push("Screen all parties against sanctions lists");
      }

      // Alternative options
      const alternativeOptions: string[] = [];
      if (overallStatus === "prohibited") {
        alternativeOptions.push("Consider alternative destinations with no sanctions");
        alternativeOptions.push("Explore if humanitarian exemptions apply");
        alternativeOptions.push("Wait for potential regulatory changes");
      } else if (overallStatus === "restricted" || overallStatus === "requires_license") {
        alternativeOptions.push("Check if EAR99 or other exemptions apply");
        alternativeOptions.push("Consider re-routing through compliant third countries");
        alternativeOptions.push("Explore license exception options");
      }

      // Filter relevant authorities
      const relevantAuthorities = regulatoryAuthorities.filter((auth) => {
        if (matchedCategory?.id === "dual-use" || matchedCategory?.id === "cryptocurrency") {
          return auth.name.includes("BIS") || auth.name.includes("OFAC") || auth.jurisdiction.includes("dual-use");
        }
        if (matchedCategory?.id === "weapons") {
          return auth.name.includes("DDTC") || auth.name.includes("BIS") || auth.jurisdiction.includes("Defense");
        }
        if (matchedCategory?.id === "hazardous") {
          return auth.jurisdiction.includes("Safety") || auth.jurisdiction.includes("Environmental");
        }
        if (matchedCategory?.id === "pharmaceuticals") {
          return auth.name.includes("DEA") || auth.name.includes("FDA");
        }
        if (matchedCategory?.id === "endangered") {
          return auth.name.includes("Fish") || auth.name.includes("CITES");
        }
        return auth.country === "US" || auth.country === destination.code;
      });

      const restrictedGoodsResult: RestrictedGoodsResult = {
        overallStatus,
        severityScore,
        restrictionDetails,
        licenseRequirements,
        exemptions,
        regulatoryAuthorities: relevantAuthorities.slice(0, 6),
        sanctionsFlags,
        recommendations,
        alternativeOptions,
      };

      setResult(restrictedGoodsResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const resetForm = () => {
    setHsCode("");
    setProductCategory("");
    setProductDescription("");
    setOriginCountry("CN");
    setDestinationCountry("US");
    setTradeDirection("import");
    setEndUse("commercial");
    setResult(null);
    toast.success("Form has been reset");
  };

  const exportResults = () => {
    if (!result) {
      toast.error("No results to export");
      return;
    }
    const data = {
      timestamp: new Date().toISOString(),
      product: {
        category: productCategory,
        hsCode: hsCode,
        description: productDescription,
      },
      trade: {
        origin: originCountry,
        destination: destinationCountry,
        direction: tradeDirection,
        endUse: endUse,
      },
      result: result,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `restricted-goods-check-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Results exported successfully");
  };

  const shareResults = async () => {
    if (!result) {
      toast.error("No results to share");
      return;
    }
    const shareText = `Restricted Goods Check Results:
Status: ${result.overallStatus.toUpperCase()}
Severity Score: ${result.severityScore}/100
Restrictions: ${result.restrictionDetails.length} found
Licenses Required: ${result.licenseRequirements.length}

Checked on Shiportrade.com Restricted Goods Checker`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Restricted Goods Check Results",
          text: shareText,
        });
        toast.success("Shared successfully");
      } catch {
        await navigator.clipboard.writeText(shareText);
        toast.success("Results copied to clipboard");
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Results copied to clipboard");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "prohibited":
        return COLORS.prohibited;
      case "restricted":
        return COLORS.restricted;
      case "requires_license":
        return COLORS.license_required;
      case "allowed":
        return COLORS.allowed;
      default:
        return "#94a3b8";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "prohibited":
        return <ShieldX className="h-5 w-5" />;
      case "restricted":
        return <ShieldAlert className="h-5 w-5" />;
      case "requires_license":
        return <Shield className="h-5 w-5" />;
      case "allowed":
        return <ShieldCheck className="h-5 w-5" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "prohibited":
        return "Prohibited";
      case "restricted":
        return "Restricted";
      case "requires_license":
        return "License Required";
      case "allowed":
        return "Allowed";
      default:
        return "Unknown";
    }
  };

  // Chart data for restrictions
  const restrictionChartData = useMemo(() => {
    if (!result) return [];
    return result.restrictionDetails.map((r) => ({
      name: r.category.split(" ")[0],
      severity: r.severity === "critical" ? 100 : r.severity === "high" ? 75 : r.severity === "medium" ? 50 : 25,
      type: r.type,
    }));
  }, [result]);

  // Country comparison data
  const countryComparisonData = useMemo(() => {
    return countries.slice(0, 8).map((c) => ({
      name: c.code,
      fullName: c.name,
      riskScore: c.riskLevel === "critical" ? 100 : c.riskLevel === "high" ? 70 : c.riskLevel === "medium" ? 40 : 10,
      restrictions: c.majorRestrictions.length + c.sanctionsPrograms.length,
    }));
  }, []);

  // Severity distribution
  const severityDistributionData = useMemo(() => {
    if (!result) return [];
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    result.restrictionDetails.forEach((r) => {
      counts[r.severity]++;
    });
    return [
      { name: "Critical", value: counts.critical, color: COLORS.critical },
      { name: "High", value: counts.high, color: COLORS.high },
      { name: "Medium", value: counts.medium, color: COLORS.medium },
      { name: "Low", value: counts.low, color: COLORS.low },
    ].filter((d) => d.value > 0);
  }, [result]);

  // Restriction categories pie chart data
  const restrictionCategoryData = useMemo(() => {
    return [
      { name: "Dual-Use", value: 35, color: OCEAN_BLUE },
      { name: "Hazardous", value: 20, color: COLORS.high },
      { name: "Pharmaceuticals", value: 15, color: LOGISTICS_GREEN },
      { name: "Weapons", value: 12, color: COLORS.prohibited },
      { name: "Endangered Species", value: 10, color: "#F59E0B" },
      { name: "Other", value: 8, color: "#94a3b8" },
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 hover:bg-[var(--ocean)]/20">
                    Trade Compliance
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20 hover:bg-[var(--logistics)]/20">
                    Restricted Goods
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
                    Import/Export
                  </Badge>
                </motion.div>
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Restricted Goods Checker
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Verify import/export restrictions, sanctions compliance, and license requirements for your products. 
                Check against international regulations including EAR, ITAR, OFAC sanctions, and CITES.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" onClick={exportResults} disabled={!result}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90" onClick={shareResults} disabled={!result}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="checker" className="text-sm">
            <Search className="h-4 w-4 mr-2" />
            Checker
          </TabsTrigger>
          <TabsTrigger value="results" className="text-sm">
            <FileWarning className="h-4 w-4 mr-2" />
            Results
          </TabsTrigger>
          <TabsTrigger value="regulations" className="text-sm">
            <Scale className="h-4 w-4 mr-2" />
            Regulations
          </TabsTrigger>
          <TabsTrigger value="guide" className="text-sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-sm">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Checker Tab */}
        <TabsContent value="checker" className="mt-6 space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Package className="h-5 w-5" />
                Product & Trade Details
              </CardTitle>
              <CardDescription>
                Enter product information and trade route to check restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Product Category */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--logistics)]" />
                    Product Category
                  </Label>
                  <Select value={productCategory} onValueChange={setProductCategory}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {restrictedGoodsCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* HS Code */}
                <div className="space-y-2">
                  <Label htmlFor="hsCode" className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-[var(--logistics)]" />
                    HS Code (optional)
                  </Label>
                  <Input
                    id="hsCode"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="e.g., 8471.30"
                    className="h-11"
                  />
                </div>

                {/* Product Description */}
                <div className="space-y-2">
                  <Label htmlFor="productDesc" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--logistics)]" />
                    Product Description
                  </Label>
                  <Input
                    id="productDesc"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Brief description..."
                    className="h-11"
                  />
                </div>

                {/* Origin Country */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[var(--logistics)]" />
                    Origin Country
                  </Label>
                  <Select value={originCountry} onValueChange={setOriginCountry}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span>{country.name}</span>
                            {country.riskLevel !== "low" && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs"
                                style={{
                                  borderColor: COLORS[country.riskLevel],
                                  color: COLORS[country.riskLevel],
                                }}
                              >
                                {country.riskLevel}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination Country */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[var(--logistics)]" />
                    Destination Country
                  </Label>
                  <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span>{country.name}</span>
                            {country.riskLevel !== "low" && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs"
                                style={{
                                  borderColor: COLORS[country.riskLevel],
                                  color: COLORS[country.riskLevel],
                                }}
                              >
                                {country.riskLevel}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Trade Direction */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-[var(--logistics)]" />
                    Trade Direction
                  </Label>
                  <Select
                    value={tradeDirection}
                    onValueChange={(v) => setTradeDirection(v as "import" | "export")}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="import">Import</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* End Use */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[var(--logistics)]" />
                    End Use Type
                  </Label>
                  <Select value={endUse} onValueChange={setEndUse}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="personal">Personal Use</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="military">Military/Defense</SelectItem>
                      <SelectItem value="research">Research/Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={analyzeRestrictions}
                  disabled={isAnalyzing || (!productCategory && !hsCode)}
                  className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white px-8 py-6 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Checking Restrictions...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="mr-2 h-5 w-5" />
                      Check Restrictions
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Reference Categories */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Package className="h-5 w-5" />
                Common Restricted Goods Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {restrictedGoodsCategories.map((cat) => (
                  <motion.div
                    key={cat.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      productCategory === cat.id
                        ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                        : "border-slate-200 dark:border-slate-700 hover:border-[var(--logistics)]"
                    }`}
                    onClick={() => setProductCategory(cat.id)}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <h4 className="font-medium text-sm">{cat.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {cat.description}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        HS: {cat.hsCodePrefix.split(",")[0]}...
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="mt-6 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Status Banner */}
                <Card
                  className="text-white border-0 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${getStatusColor(result.overallStatus)}, ${getStatusColor(result.overallStatus)}dd)`,
                  }}
                >
                  <CardContent className="pt-8 pb-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-full">
                          {getStatusIcon(result.overallStatus)}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{getStatusLabel(result.overallStatus)}</h2>
                          <p className="text-white/80 mt-1">
                            {productCategory
                              ? restrictedGoodsCategories.find((c) => c.id === productCategory)?.name
                              : "Product"}{" "}
                            - {tradeDirection === "import" ? "Import to" : "Export from"}{" "}
                            {countries.find((c) => c.code === destinationCountry)?.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold">{result.severityScore}</p>
                        <p className="text-white/80 text-sm">Severity Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                          <Ban className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {result.restrictionDetails.filter((r) => r.type === "prohibited").length}
                          </p>
                          <p className="text-sm text-muted-foreground">Prohibitions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">
                            {result.restrictionDetails.filter((r) => r.type === "restricted").length}
                          </p>
                          <p className="text-sm text-muted-foreground">Restrictions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <FileText className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{result.licenseRequirements.length}</p>
                          <p className="text-sm text-muted-foreground">Licenses Required</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{result.exemptions.length}</p>
                          <p className="text-sm text-muted-foreground">Potential Exemptions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Pie Chart - Restriction Categories */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-[var(--ocean)]">Restriction Categories Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={restrictionCategoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {restrictionCategoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bar Chart - Country Comparison */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-[var(--ocean)]">Country Risk Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={countryComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" orientation="left" stroke={OCEAN_BLUE} />
                            <YAxis yAxisId="right" orientation="right" stroke={LOGISTICS_GREEN} />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border">
                                      <p className="font-medium">{data.fullName}</p>
                                      <p className="text-sm" style={{ color: OCEAN_BLUE }}>
                                        Risk Score: {data.riskScore}
                                      </p>
                                      <p className="text-sm" style={{ color: LOGISTICS_GREEN }}>
                                        Restrictions: {data.restrictions}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="riskScore" name="Risk Score" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="restrictions" name="Restrictions Count" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Restriction Details */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <FileWarning className="h-5 w-5" />
                      Restriction Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result.restrictionDetails.length > 0 ? (
                      <div className="space-y-4">
                        {result.restrictionDetails.map((detail, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border-l-4 ${
                              detail.severity === "critical"
                                ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                                : detail.severity === "high"
                                ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                : detail.severity === "medium"
                                ? "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {detail.type === "prohibited" ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : detail.type === "restricted" ? (
                                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                                ) : (
                                  <Info className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{detail.category}</h4>
                                  <Badge
                                    variant="outline"
                                    style={{
                                      borderColor: getStatusColor(detail.type),
                                      color: getStatusColor(detail.type),
                                    }}
                                  >
                                    {detail.type.replace("_", " ")}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {detail.direction}
                                  </Badge>
                                </div>
                                <p className="text-sm font-medium text-foreground mb-1">
                                  {detail.reason}
                                </p>
                                <p className="text-sm text-muted-foreground">{detail.description}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          No specific restrictions found for this product/trade route.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Severity Distribution Chart */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-[var(--ocean)]">Severity Distribution Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      {severityDistributionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={severityDistributionData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} />
                            <Tooltip />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {severityDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No restrictions to analyze</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Sanctions Flags */}
                {result.sanctionsFlags.length > 0 && (
                  <Card className="border-0 shadow-lg border-l-4 border-l-amber-500">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                        <Siren className="h-5 w-5" />
                        Sanctions Screening Results
                        <Badge variant="outline" className="ml-2">
                          Placeholder Integration
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {result.sanctionsFlags.map((flag, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-lg ${
                              flag.severity === "critical"
                                ? "bg-red-50 dark:bg-red-900/20"
                                : flag.severity === "warning"
                                ? "bg-amber-50 dark:bg-amber-900/20"
                                : "bg-blue-50 dark:bg-blue-900/20"
                            }`}
                          >
                            <AlertCircle
                              className={`h-5 w-5 ${
                                flag.severity === "critical"
                                  ? "text-red-500"
                                  : flag.severity === "warning"
                                  ? "text-amber-500"
                                  : "text-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{flag.type}</span>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    flag.severity === "critical"
                                      ? "border-red-500 text-red-500"
                                      : flag.severity === "warning"
                                      ? "border-amber-500 text-amber-500"
                                      : "border-blue-500 text-blue-500"
                                  }`}
                                >
                                  {flag.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{flag.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">Source: {flag.source}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <ChevronRight className="h-5 w-5" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Action Items
                        </h4>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-[var(--logistics)] mt-2" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {result.alternativeOptions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-blue-500" />
                            Alternative Options
                          </h4>
                          <ul className="space-y-2">
                            {result.alternativeOptions.map((opt, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Exemptions */}
                {result.exemptions.length > 0 && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                        <CheckCircle className="h-5 w-5" />
                        Potential Exemptions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {result.exemptions.map((exemption, index) => (
                          <AccordionItem key={index} value={`exemption-${index}`}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                                  {exemption.name}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {exemption.applicability}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <p className="text-sm text-muted-foreground mb-3">
                                {exemption.description}
                              </p>
                              <div>
                                <p className="text-sm font-medium mb-2">Conditions:</p>
                                <ul className="space-y-1">
                                  {exemption.conditions.map((condition, i) => (
                                    <li key={i} className="text-sm flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                      {condition}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  No analysis results yet
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter product details and click &quot;Check Restrictions&quot; to begin
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Regulations Tab */}
        <TabsContent value="regulations" className="mt-6 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Scale className="h-5 w-5" />
                Country-Specific Regulations
              </CardTitle>
              <CardDescription>
                Overview of import/export regulations by destination country
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Sanctions Programs</TableHead>
                    <TableHead>Major Restrictions</TableHead>
                    <TableHead>Authorities</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.slice(0, 15).map((country) => (
                    <TableRow key={country.code}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{country.name}</span>
                          <Badge variant="outline" className="text-xs">{country.code}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: COLORS[country.riskLevel],
                            color: COLORS[country.riskLevel],
                          }}
                        >
                          {country.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {country.sanctionsPrograms.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {country.sanctionsPrograms.slice(0, 2).map((program, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {program}
                              </Badge>
                            ))}
                            {country.sanctionsPrograms.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{country.sanctionsPrograms.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {country.majorRestrictions.length > 0 ? (
                          <div className="max-w-xs">
                            <p className="text-sm truncate">{country.majorRestrictions.slice(0, 2).join(", ")}</p>
                            {country.majorRestrictions.length > 2 && (
                              <p className="text-xs text-muted-foreground">+{country.majorRestrictions.length - 2} more</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`https://www.google.com/search?q=export+regulations+${country.name}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Key Regulations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Scale className="h-5 w-5" />
                Key International Regulations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "EAR (Export Administration Regulations)", desc: "US dual-use export controls administered by BIS", icon: "🇺🇸" },
                  { name: "ITAR (International Traffic in Arms Regulations)", desc: "US defense articles and services controls", icon: "🇺🇸" },
                  { name: "EU Dual-Use Regulation", desc: "European Union export controls on dual-use items", icon: "🇪🇺" },
                  { name: "CITES Convention", desc: "International wildlife trade regulations", icon: "🌍" },
                  { name: "UN Sanctions Regimes", desc: "Security Council sanctions programs", icon: "🇺🇳" },
                  { name: "OFAC Regulations", desc: "US sanctions and embargoes", icon: "🇺🇸" },
                ].map((reg, idx) => (
                  <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{reg.icon}</span>
                      <h4 className="font-semibold">{reg.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{reg.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Authorities Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Building2 className="h-5 w-5" />
                Regulatory Authorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Authority</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Jurisdiction</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Website</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regulatoryAuthorities.map((authority, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{authority.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{authority.country}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{authority.jurisdiction}</TableCell>
                      <TableCell className="text-sm">{authority.contact}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={authority.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="mt-6 space-y-6">
          {/* Understanding Restricted Goods */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Info className="h-5 w-5" />
                Understanding Restricted Goods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Restricted goods are items subject to specific regulations, controls, or prohibitions when being imported, exported, or transported across international borders. These restrictions exist to protect national security, public health, environmental resources, and to enforce international agreements. Understanding the full scope of restricted goods is essential for any business engaged in international trade, as violations can result in severe penalties including substantial fines, criminal prosecution, and loss of export privileges.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The classification of restricted goods varies significantly by country and can change based on geopolitical developments. What may be freely traded with one country could be completely prohibited with another. Businesses must maintain constant vigilance and implement robust compliance programs to navigate this complex regulatory landscape effectively. This includes regular screening of all parties involved in transactions, proper classification of goods, and thorough documentation of compliance efforts.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                    <Ban className="h-4 w-4" />
                    Prohibited Goods
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Completely banned from import/export under any circumstances. Examples: illicit
                    drugs, certain weapons, goods to comprehensively sanctioned countries.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Restricted Goods
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Allowed with specific conditions, permits, or limitations. Examples: alcohol,
                    tobacco, certain chemicals, agricultural products.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    License Required
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    May be imported/exported but requires prior authorization. Examples: dual-use
                    items, pharmaceuticals, endangered species products.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Allowed Goods
                  </h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    Generally permitted without special restrictions, subject to standard customs
                    procedures and documentation requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Restrictions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <AlertTriangle className="h-5 w-5" />
                Common Restrictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                International trade restrictions generally fall into several key categories, each with its own set of rules and regulatory bodies. Sanctions and embargoes represent the most severe form of trade restriction, prohibiting or severely limiting trade with specific countries, entities, or individuals. These are typically implemented for foreign policy, national security, or human rights reasons and are enforced by agencies like OFAC in the United States.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Export controls on dual-use items represent another major category of restrictions. Dual-use goods are items that have both civilian and military applications, such as certain electronics, chemicals, and manufacturing equipment. The export of these items is controlled to prevent them from being used for weapons development or other military purposes. Companies must obtain licenses before exporting controlled items to many destinations.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Health and safety restrictions apply to a wide range of products including pharmaceuticals, food products, and medical devices. Environmental restrictions protect endangered species, regulate hazardous waste, and control the trade of ozone-depleting substances. Cultural property restrictions aim to prevent the illicit trade in antiquities and culturally significant artifacts, protecting the heritage of nations around the world.
              </p>
            </CardContent>
          </Card>

          {/* Documentation Requirements */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <FileText className="h-5 w-5" />
                Documentation Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Proper documentation is the foundation of compliant international trade. For restricted goods, the documentation requirements are typically more extensive and must be prepared with greater care. The basic documents required for most international shipments include commercial invoices, packing lists, bills of lading or airway bills, and certificates of origin. However, restricted goods shipments often require additional specialized documentation.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Export licenses are required for controlled items and must be obtained before shipment. The application process can take anywhere from 30 to 120 days depending on the type of license and the complexity of the transaction. End-use certificates may be required to verify that the goods will be used only for their stated purpose. For dual-use items, a BIS-711 statement may be required to certify the end-use and end-user.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Other common documentation includes CITES permits for wildlife products, DEA registration for controlled substances, FDA prior notice for food products, and phytosanitary certificates for agricultural products. It is essential to verify all documentation requirements before shipping, as missing or incorrect documentation can result in shipment delays, fines, or even seizure of goods. Maintaining copies of all documentation for the required retention period (typically 5 years or more) is also crucial for compliance audits.
              </p>
            </CardContent>
          </Card>

          {/* Compliance Best Practices */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <ShieldCheck className="h-5 w-5" />
                Compliance Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Building a robust trade compliance program requires a systematic approach that addresses all aspects of restricted goods management. The foundation of any compliance program is a thorough understanding of applicable regulations and continuous monitoring of regulatory changes. This includes staying informed about changes to sanctions lists, export control classifications, and documentation requirements.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Implementing a comprehensive screening process is essential for identifying potential compliance issues before they become problems. This includes screening all parties involved in transactions against restricted party lists, verifying end-use statements, and conducting due diligence on new customers and business partners. Technology solutions can help automate these processes and ensure consistent application of compliance procedures.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Regular training for employees involved in international trade operations is crucial. Staff should understand the consequences of non-compliance and be empowered to escalate concerns. Maintaining detailed records of all compliance activities, including screening results, license applications, and internal approvals, provides evidence of due diligence and supports audit readiness. Finally, conducting periodic compliance audits helps identify gaps and areas for improvement in your trade compliance program.
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Lightbulb className="h-5 w-5" />
                Pro Tips for Restricted Goods Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Search, tip: "Always verify classification", detail: "Incorrect HS codes can lead to penalties and delays. Use official classification tools and consult with customs brokers when in doubt." },
                  { icon: Clock, tip: "Apply for licenses early", detail: "Processing can take 30-120 days depending on the type. Plan ahead to avoid shipment delays." },
                  { icon: Shield, tip: "Screen against all lists", detail: "Use multiple sanctions lists for comprehensive screening. Check both government and international restricted party lists." },
                  { icon: FileText, tip: "Keep records for 5+ years", detail: "Most regulations require maintaining compliance records. Organize documents for easy retrieval during audits." },
                  { icon: Scale, tip: "Consult legal experts", detail: "Complex transactions may require specialized legal advice. Don&apos;t hesitate to seek expert guidance for high-risk shipments." },
                  { icon: RefreshCw, tip: "Stay updated on changes", detail: "Sanctions and regulations change frequently. Subscribe to regulatory updates and implement changes promptly." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-[var(--logistics)]" />
                    </div>
                    <div>
                      <p className="font-medium">{item.tip}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    mistake: "Assuming goods are not restricted", 
                    explanation: "Many businesses assume their products are not subject to restrictions without proper verification. Even seemingly benign items can be controlled due to their potential applications. Always conduct a thorough classification analysis and consult the relevant control lists before proceeding with any international transaction."
                  },
                  { 
                    mistake: "Incomplete party screening", 
                    explanation: "Screening only the immediate customer while ignoring other parties in the supply chain is a common oversight. You must screen all parties including consignees, end-users, freight forwarders, and financial institutions. Third-party intermediaries can introduce compliance risks that need to be identified and addressed."
                  },
                  { 
                    mistake: "Neglecting end-use verification", 
                    explanation: "Failing to verify the stated end-use of exported goods can lead to diversion to prohibited end-users or applications. Implement robust end-use verification procedures including obtaining written statements, conducting site visits when appropriate, and following up on red flags."
                  },
                  { 
                    mistake: "Inadequate record keeping", 
                    explanation: "Poor documentation practices can result in inability to demonstrate compliance during audits or investigations. Maintain complete records of all compliance activities, including screening results, license applications, end-user statements, and export documentation for the required retention period."
                  },
                  { 
                    mistake: "Ignoring red flags", 
                    explanation: "Dismissing warning signs such as unusual payment methods, reluctance to provide end-user information, or orders inconsistent with the customer&apos;s business can lead to violations. Train staff to recognize and escalate red flags, and implement clear procedures for investigating suspicious transactions."
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <X className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-700 dark:text-red-400">{item.mistake}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about restricted goods and trade compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="faq-1" className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">1</Badge>
                      <span className="font-semibold">What are the main categories of restricted goods in international trade?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Restricted goods in international trade fall into several major categories, each governed by specific regulations and enforcement agencies. The primary categories include dual-use items, which have both civilian and military applications. These are controlled under the Export Administration Regulations (EAR) in the United States and similar frameworks in other countries. Examples include certain electronics, chemicals, software, and manufacturing equipment that could potentially be used for weapons development.
                    </p>
                    <p>
                      Weapons and defense articles represent another major category, controlled under the International Traffic in Arms Regulations (ITAR) in the US and similar regulations worldwide. This category includes firearms, ammunition, military vehicles, and related technology. Sanctioned goods encompass items that are restricted or prohibited from trade with specific countries, entities, or individuals due to foreign policy or national security concerns. Hazardous materials, including chemicals, radioactive substances, and biological agents, are controlled for safety and environmental reasons.
                    </p>
                    <p>
                      Additional categories include pharmaceuticals and controlled substances regulated by agencies like the FDA and DEA; endangered species and wildlife products protected under CITES; cultural artifacts and antiquities protected by various national and international laws; and agricultural products subject to phytosanitary requirements. Each category has its own set of licensing requirements, documentation standards, and regulatory authorities that must be consulted before trade can proceed.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-2" className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">2</Badge>
                      <span className="font-semibold">How do I determine if my product requires an export license?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Determining whether your product requires an export license involves a systematic analysis of several factors. The first step is to correctly classify your product using the appropriate classification system. In the United States, this typically means determining the Export Control Classification Number (ECCN) under the Commerce Control List (CCL) for dual-use items, or the United States Munitions List (USML) category for defense articles. The classification determines the level of control and the reasons for control that apply to your item.
                    </p>
                    <p>
                      Once you have classified your product, you must evaluate the destination country. Different countries have different licensing requirements based on their perceived risk level and existing sanctions programs. For example, exports to comprehensively sanctioned countries like Iran or North Korea face severe restrictions regardless of the product classification. You must also consider the end-use and end-user of your product. Even items that would normally not require a license may need one if they are destined for a prohibited end-use, such as weapons development, or if the end-user appears on a restricted party list.
                    </p>
                    <p>
                      The analysis process should include checking all relevant restricted party lists (OFAC SDN List, Entity List, Denied Persons List, etc.), evaluating any red flags that might indicate potential diversion or misuse, and determining if any license exceptions might apply. Many companies use automated screening tools and classification software to assist with this process. When in doubt, it is advisable to seek a formal classification ruling from the relevant authority or consult with export control legal counsel.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-3" className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">3</Badge>
                      <span className="font-semibold">What are the penalties for violating export control regulations?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Violations of export control regulations can result in severe penalties that affect both companies and individuals. Civil penalties can be substantial, with fines reaching hundreds of thousands or even millions of dollars per violation. Under the Export Control Reform Act (ECRA), civil penalties can reach up to $300,000 per violation or twice the value of the transaction, whichever is greater. OFAC violations can result in civil penalties of over $300,000 per violation or more. These penalties can quickly accumulate as each shipment may constitute a separate violation.
                    </p>
                    <p>
                      Criminal penalties are also possible, particularly for willful violations. Individuals can face prison sentences of up to 20 years for criminal export violations, and companies can face fines of up to $1 million per violation. Criminal prosecutions are more likely in cases involving deliberate circumvention of controls, false statements, or knowing violations of sanctions. Additionally, both civil and criminal penalties can be imposed for the same conduct, meaning a company could face both types of penalties for a single violation.
                    </p>
                    <p>
                      Beyond monetary penalties and imprisonment, violators may face denial of export privileges, which can effectively put a company out of business if it relies on international trade. Companies and individuals may be placed on restricted party lists, preventing them from participating in export transactions. Reputational damage can be significant and long-lasting, affecting relationships with customers, suppliers, and financial institutions. Companies may also face debarment from government contracts and loss of security clearances. The comprehensive nature of these penalties underscores the importance of maintaining robust compliance programs.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-4" className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">4</Badge>
                      <span className="font-semibold">How often do sanctions and export controls change?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Sanctions and export controls change frequently, often in response to geopolitical developments, and businesses must be prepared to adapt quickly. In recent years, changes have occurred on an almost daily basis during periods of significant international tension. For example, the sanctions programs targeting Russia have seen numerous expansions and modifications following various geopolitical events. New designations to restricted party lists can be added at any time, and existing restrictions can be tightened or relaxed based on policy decisions.
                    </p>
                    <p>
                      Major regulatory changes are typically announced through official channels such as the Federal Register in the United States, with advance notice provided for some changes but not others. Emergency sanctions can be implemented immediately, sometimes with retroactive effect. Export control classifications can change as technology evolves, with new items being added to control lists and others being removed. Staying informed about these changes requires active monitoring of regulatory announcements from agencies like the Bureau of Industry and Security (BIS), Office of Foreign Assets Control (OFAC), and equivalent authorities in other countries.
                    </p>
                    <p>
                      Best practices for staying current include subscribing to email alerts from regulatory agencies, following trade compliance news sources, participating in industry associations and compliance forums, and engaging with legal counsel who specialize in trade compliance. Many companies implement internal procedures to review regulatory updates and assess their impact on ongoing and planned transactions. Technology solutions can help automate the monitoring process and flag transactions that may be affected by recent regulatory changes.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-5" className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">5</Badge>
                      <span className="font-semibold">What is the difference between the Entity List and the SDN List?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      The Entity List and the Specially Designated Nationals (SDN) List are two distinct but important restricted party lists maintained by different US government agencies, each with different implications for international trade. The Entity List is maintained by the Bureau of Industry and Security (BIS) under the Department of Commerce and primarily relates to export controls. Parties on the Entity List are subject to license requirements for the export, re-export, or transfer of specified items. The licenses required for Entity List parties often face a presumption of denial, meaning they are difficult to obtain.
                    </p>
                    <p>
                      The SDN List is maintained by the Office of Foreign Assets Control (OFAC) under the Department of the Treasury and relates to sanctions programs. Parties on the SDN List are essentially blocked, meaning US persons are generally prohibited from engaging in any transactions with them. Assets of SDN parties that come under US jurisdiction must be frozen. Unlike Entity List designations, which focus on specific export transactions, SDN List designations create a broader prohibition that affects virtually all dealings with the designated party.
                    </p>
                    <p>
                      The practical implications differ significantly. If your customer is on the Entity List, you may be able to export certain items to them with a license, though obtaining that license may be difficult. If your customer is on the SDN List, you generally cannot conduct any business with them at all, including receiving payment, shipping goods, or providing services. Additionally, OFAC maintains other lists beyond the SDN List, such as the Sectoral Sanctions Identifications (SSI) List and the Foreign Sanctions Evaders (FSE) List, each with its own set of restrictions. A comprehensive screening program should check all relevant lists.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-6" className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">6</Badge>
                      <span className="font-semibold">How should I screen customers and transactions for compliance?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      Effective screening requires a comprehensive approach that covers all parties involved in a transaction and uses reliable, up-to-date data sources. At a minimum, you should screen all customers, consignees, end-users, freight forwarders, financial institutions, and any other parties involved against all relevant restricted party lists. This includes US lists such as the OFAC SDN List, Entity List, Denied Persons List, Unverified List, and various non-US lists maintained by other governments and international organizations.
                    </p>
                    <p>
                      Screening should be conducted at multiple points in the transaction lifecycle, including during customer onboarding, at the time of order, before shipment, and periodically for ongoing relationships. Many companies use automated screening software that can quickly check parties against multiple lists simultaneously and flag potential matches for human review. When potential matches are identified, trained compliance personnel should conduct a detailed review to determine if a true match exists and what actions are required.
                    </p>
                    <p>
                      Beyond list screening, effective compliance requires evaluating the overall risk profile of transactions. This includes assessing whether the transaction makes commercial sense, whether the customer&apos;s stated use of the product is consistent with their business, and whether any red flags exist such as unusual payment methods, reluctance to provide end-user information, or requests to route shipments through unusual transit points. Document all screening activities, including the results and any decisions made, to demonstrate due diligence in the event of an audit or investigation.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-7" className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">7</Badge>
                      <span className="font-semibold">What is deemed export and why does it matter?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      A deemed export refers to the release of controlled technology or source code to a foreign national within the United States, which is treated as if the technology were being exported to the foreign national&apos;s home country. This concept is crucial because export controls apply not only to the physical movement of goods across borders but also to the transfer of knowledge and technology to foreign persons, regardless of where that transfer occurs. Under US export control regulations, a deemed export license may be required before sharing controlled information with foreign nationals, even if they are your employees.
                    </p>
                    <p>
                      The deemed export rule has significant implications for companies with international workforces, academic institutions with foreign students and researchers, and any organization that employs or hosts foreign nationals who may have access to controlled technology. The nationality of the foreign national determines the licensing requirements, not their immigration status. This means that a foreign national who is a lawful permanent resident or holds a valid work visa still triggers deemed export considerations based on their country of citizenship or nationality.
                    </p>
                    <p>
                      Companies should implement internal controls to identify potential deemed export situations, including technology control plans that restrict access to controlled information based on export control considerations, non-disclosure agreements that address export control requirements, and procedures for evaluating deemed export license requirements when hiring or assigning foreign nationals to projects involving controlled technology. Certain exceptions exist, including for foreign nationals from countries that are members of multilateral export control regimes, but these exceptions are limited and should be carefully evaluated with the assistance of export control counsel.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq-8" className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">8</Badge>
                      <span className="font-semibold">What should I do if I discover a potential violation?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-3">
                    <p>
                      If you discover a potential violation of export control or sanctions regulations, immediate action is essential to mitigate potential penalties and demonstrate good faith. The first step is to stop any ongoing transactions that may be in violation and preserve all relevant documentation. Do not attempt to cover up or minimize the violation, as this can lead to more serious consequences. Consult with export control legal counsel experienced in handling violations to assess the situation and develop an appropriate response strategy.
                    </p>
                    <p>
                      Voluntary self-disclosure is an important consideration. Both BIS and OFAC have voluntary self-disclosure programs that can result in significant penalty reductions for companies that proactively report violations. BIS generally considers voluntary self-disclosure as a mitigating factor that can substantially reduce penalties, and in many cases involving non-egregious violations, may result in no penalty at all. OFAC similarly considers voluntary self-disclosure as a significant mitigating factor, though the specific benefits vary depending on the nature of the violation.
                    </p>
                    <p>
                      The disclosure process requires a thorough internal investigation to determine the full scope of the violation, including how it occurred, whether similar violations may have occurred, and what remedial measures have been implemented. The disclosure should include detailed information about the violation, the results of your internal investigation, and the corrective actions you have taken. Following the disclosure, you should cooperate fully with any government investigation and continue to strengthen your compliance program to prevent future violations. Legal counsel is essential throughout this process to protect your interests and ensure the best possible outcome.
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
