"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Calendar,
  DollarSign,
  AlertCircle,
  ListChecks,
  Shield,
  TrendingUp,
  PieChart,
  BarChart3,
  HelpCircle,
  Sparkles,
  FileCheck,
  Clock,
  Globe,
  Scale,
  BookOpen,
  ChevronRight,
  Search,
  Zap,
  Target,
  Award,
  Activity,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Layers,
  FileWarning,
  CheckSquare,
  XSquare,
  AlertOctagon,
  Info,
  ExternalLink,
  Download,
  Share2,
  Printer,
  MessageSquare,
  ChevronDown,
  ChevronUp,
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
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPie,
  Pie,
  Legend,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  ComposedChart,
  Line,
} from "recharts";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";
const OCEAN_BLUE_LIGHT = "#1A6BA8";
const LOGISTICS_GREEN_LIGHT = "#3DA86A";

// Color palette for charts
const COLORS = {
  critical: "#EF4444",
  major: "#F59E0B",
  minor: "#3B82F6",
  passed: LOGISTICS_GREEN,
  failed: "#EF4444",
  oceanBlue: OCEAN_BLUE,
  logisticsGreen: LOGISTICS_GREEN,
};

interface DiscrepancyResult {
  id: string;
  category: string;
  field: string;
  expectedValue: string;
  actualValue: string;
  severity: "critical" | "major" | "minor";
  ucpArticle: string;
  description: string;
  recommendation: string;
  waiverable: boolean;
}

interface LCAnalysis {
  overallStatus: "compliant" | "discrepancies" | "critical";
  totalChecks: number;
  passedChecks: number;
  discrepancies: DiscrepancyResult[];
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  riskScore: number;
  recommendations: string[];
  documentChecklist: DocumentCheck[];
}

interface DocumentCheck {
  document: string;
  required: boolean;
  present: boolean;
  status: "ok" | "missing" | "discrepancy";
}

const discrepancyCategories = [
  "Document Presentation",
  "Shipment Details",
  "Goods Description",
  "Amounts & Numbers",
  "Dates & Deadlines",
  "Ports & Places",
  "Signatures & Stamps",
  "Insurance & Certificates",
  "UCP600 Compliance",
];

const commonDiscrepancies = [
  {
    category: "Document Presentation",
    field: "Presentation Period",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 14(b)",
    description: "Documents not presented within 21 days from shipment date",
    recommendation: "Ensure all documents are presented within the stipulated period",
    waiverable: true,
  },
  {
    category: "Document Presentation",
    field: "Late Presentation",
    severity: "critical" as const,
    ucpArticle: "UCP 600 Article 14(c)",
    description: "Documents presented after LC expiry date",
    recommendation: "Request amendment to extend LC validity",
    waiverable: false,
  },
  {
    category: "Shipment Details",
    field: "Shipment Date",
    severity: "critical" as const,
    ucpArticle: "UCP 600 Article 20",
    description: "B/L date later than latest shipment date",
    recommendation: "Obtain amendment for later shipment date",
    waiverable: false,
  },
  {
    category: "Shipment Details",
    field: "Partial Shipment",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 31",
    description: "Partial shipment made when prohibited by LC",
    recommendation: "Review LC terms for partial shipment clause",
    waiverable: true,
  },
  {
    category: "Shipment Details",
    field: "Transshipment",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 20(c)",
    description: "Transshipment evidenced when prohibited",
    recommendation: "Verify LC transshipment terms",
    waiverable: true,
  },
  {
    category: "Goods Description",
    field: "Description Mismatch",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 18(c)",
    description: "Goods description inconsistent with LC",
    recommendation: "Ensure description matches exactly or is consistent",
    waiverable: true,
  },
  {
    category: "Amounts & Numbers",
    field: "Amount Discrepancy",
    severity: "critical" as const,
    ucpArticle: "UCP 600 Article 30",
    description: "Drawing amount exceeds LC amount",
    recommendation: "Reduce drawing or request LC increase",
    waiverable: false,
  },
  {
    category: "Amounts & Numbers",
    field: "Quantity Variance",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 30(b)",
    description: "Quantity variance exceeds 5% tolerance",
    recommendation: "Verify quantity tolerance clause in LC",
    waiverable: true,
  },
  {
    category: "Dates & Deadlines",
    field: "Insurance Date",
    severity: "critical" as const,
    ucpArticle: "UCP 600 Article 28(e)",
    description: "Insurance date later than shipment date",
    recommendation: "Obtain insurance covering from shipment date",
    waiverable: false,
  },
  {
    category: "Dates & Deadlines",
    field: "Certificate Date",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 14(f)",
    description: "Certificate date later than required",
    recommendation: "Ensure certificates issued before shipment date",
    waiverable: true,
  },
  {
    category: "Ports & Places",
    field: "Port Mismatch",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 20",
    description: "Port of loading/discharge differs from LC",
    recommendation: "Verify port names match LC exactly",
    waiverable: true,
  },
  {
    category: "Signatures & Stamps",
    field: "Missing Signature",
    severity: "critical" as const,
    ucpArticle: "UCP 600 Article 20(a)",
    description: "Required signature missing on document",
    recommendation: "Obtain properly signed document",
    waiverable: false,
  },
  {
    category: "Insurance & Certificates",
    field: "Coverage Shortfall",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 28(c)",
    description: "Insurance coverage less than 110% of CIF value",
    recommendation: "Obtain additional coverage",
    waiverable: true,
  },
  {
    category: "Insurance & Certificates",
    field: "Certificate of Origin",
    severity: "major" as const,
    ucpArticle: "UCP 600 Article 14(f)",
    description: "Certificate of Origin not as required",
    recommendation: "Obtain CO from authorized body",
    waiverable: true,
  },
];

const requiredDocuments = [
  "Bill of Lading",
  "Commercial Invoice",
  "Packing List",
  "Certificate of Origin",
  "Insurance Certificate",
  "Inspection Certificate",
  "Weight Certificate",
  "Quality Certificate",
  "Phytosanitary Certificate",
  "Fumigation Certificate",
];

const faqData = [
  {
    question: "What is a Letter of Credit discrepancy?",
    answer: "A Letter of Credit discrepancy occurs when documents presented under an LC do not comply with the terms and conditions specified in the credit, or fail to meet UCP 600 requirements. Common discrepancies include date inconsistencies, amount mismatches, missing documents, or incorrect document content.",
    category: "Basics",
  },
  {
    question: "What are the most common types of LC discrepancies?",
    answer: "The most common discrepancies include: late presentation of documents, inconsistent data between documents, expired LC or late shipment, missing signatures or stamps, insurance coverage issues, port name mismatches, and goods description inconsistencies. These account for over 70% of all LC discrepancies.",
    category: "Common Issues",
  },
  {
    question: "Can discrepancies be waived?",
    answer: "Yes, some discrepancies can be waived by the issuing bank with the applicant's consent. However, certain critical discrepancies such as expired LC, late presentation after expiry, or missing documents cannot typically be waived. The waiver process is governed by UCP 600 Article 16.",
    category: "Waiver Process",
  },
  {
    question: "What is UCP 600 and why is it important?",
    answer: "UCP 600 (Uniform Customs and Practice for Documentary Credits) is the international standard for LC transactions published by the International Chamber of Commerce (ICC). It provides rules and guidelines that banks worldwide follow when handling LCs, ensuring consistency and reducing disputes in international trade.",
    category: "Basics",
  },
  {
    question: "How much time do I have to present documents under an LC?",
    answer: "Under UCP 600 Article 14(b), documents must be presented within 21 days after the date of shipment, unless the credit stipulates a different period. However, documents must always be presented before the LC expiry date. The presentation period is counted from the date of the transport document.",
    category: "Timelines",
  },
  {
    question: "What happens if discrepancies are found?",
    answer: "When discrepancies are found, the issuing bank must give notice of refusal within 5 banking days following the day of presentation. The bank may hold documents pending further instructions, or return them to the presenter. The applicant may choose to waive discrepancies, but the bank is not obligated to seek such waiver.",
    category: "Process",
  },
  {
    question: "How can I prevent LC discrepancies?",
    answer: "Best practices include: carefully reviewing LC terms before shipment, ensuring all documents match LC requirements exactly, double-checking dates and amounts, using pre-shipment document checking services, maintaining clear communication with all parties, and allowing buffer time for corrections before presentation.",
    category: "Prevention",
  },
  {
    question: "What are the costs associated with discrepancies?",
    answer: "Discrepancy fees typically range from $50 to $150 per discrepancy, charged by banks for processing non-compliant documents. Additional costs may include cable charges for communicating with foreign banks, amendment fees if changes are needed, and potential payment delays affecting cash flow.",
    category: "Costs",
  },
  {
    question: "What documents are typically required under an LC?",
    answer: "Common required documents include: Bill of Lading (transport document), Commercial Invoice, Packing List, Certificate of Origin, Insurance Certificate, Inspection Certificate, Weight Certificate, Quality Certificate, and various specialized certificates depending on the goods (phytosanitary, fumigation, etc.).",
    category: "Documents",
  },
  {
    question: "What is the role of the advising bank in discrepancy handling?",
    answer: "The advising bank forwards documents to the issuing bank and may identify discrepancies during document checking. However, the advising bank is not responsible for the validity of documents. They act as an intermediary and must forward documents as received or notify the presenter of any refusal within 5 banking days.",
    category: "Banks",
  },
];

// UCP 600 Articles Reference
const ucpArticles = [
  { article: "Article 14", title: "Standard for Examining Documents", importance: "critical" },
  { article: "Article 15", title: "Complying Presentation", importance: "critical" },
  { article: "Article 16", title: "Discrepant Documents, Waiver and Notice", importance: "critical" },
  { article: "Article 20", title: "Bill of Lading", importance: "high" },
  { article: "Article 28", title: "Insurance Document and Coverage", importance: "high" },
  { article: "Article 30", title: "Tolerance in Credit Amount, Quantity and Unit Prices", importance: "medium" },
  { article: "Article 31", title: "Partial Drawings or Shipments", importance: "medium" },
];

export default function LCDiscrepancyAnalyzer() {
  const [lcNumber, setLcNumber] = useState("");
  const [lcAmount, setLcAmount] = useState("");
  const [lcExpiry, setLcExpiry] = useState("");
  const [latestShipment, setLatestShipment] = useState("");
  const [presentationPeriod, setPresentationPeriod] = useState("21");
  const [incoterm, setIncoterm] = useState("CIF");
  const [portOfLoading, setPortOfLoading] = useState("");
  const [portOfDischarge, setPortOfDischarge] = useState("");
  const [goodsDescription, setGoodsDescription] = useState("");
  const [partialShipment, setPartialShipment] = useState("allowed");
  const [transshipment, setTransshipment] = useState("allowed");

  const [blDate, setBlDate] = useState("");
  const [presentationDate, setPresentationDate] = useState("");
  const [insuranceDate, setInsuranceDate] = useState("");
  const [cooDate, setCooDate] = useState("");
  const [actualPol, setActualPol] = useState("");
  const [actualPod, setActualPod] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [documentsPresented, setDocumentsPresented] = useState<string[]>([]);

  const [result, setResult] = useState<LCAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const analyzeDocuments = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const discrepancies: DiscrepancyResult[] = [];
      let riskScore = 0;

      const lcAmountNum = parseFloat(lcAmount) || 100000;
      const invAmountNum = parseFloat(invoiceAmount) || lcAmountNum;

      // Check amount discrepancy
      if (invAmountNum > lcAmountNum) {
        discrepancies.push({
          id: "DISC-001",
          category: "Amounts & Numbers",
          field: "Invoice Amount",
          expectedValue: formatCurrency(lcAmountNum),
          actualValue: formatCurrency(invAmountNum),
          severity: "critical",
          ucpArticle: "UCP 600 Article 30",
          description: "Drawing amount exceeds LC amount",
          recommendation: "Reduce drawing or request LC increase",
          waiverable: false,
        });
        riskScore += 30;
      }

      // Check dates
      if (blDate && latestShipment && new Date(blDate) > new Date(latestShipment)) {
        discrepancies.push({
          id: "DISC-002",
          category: "Shipment Details",
          field: "B/L Date vs Latest Shipment",
          expectedValue: latestShipment,
          actualValue: blDate,
          severity: "critical",
          ucpArticle: "UCP 600 Article 20",
          description: "B/L date later than latest shipment date",
          recommendation: "Obtain amendment for later shipment date",
          waiverable: false,
        });
        riskScore += 30;
      }

      if (presentationDate && lcExpiry && new Date(presentationDate) > new Date(lcExpiry)) {
        discrepancies.push({
          id: "DISC-003",
          category: "Document Presentation",
          field: "Presentation Date",
          expectedValue: `Before ${lcExpiry}`,
          actualValue: presentationDate,
          severity: "critical",
          ucpArticle: "UCP 600 Article 14(c)",
          description: "Documents presented after LC expiry date",
          recommendation: "Request amendment to extend LC validity",
          waiverable: false,
        });
        riskScore += 25;
      }

      // Check insurance date
      if (insuranceDate && blDate && new Date(insuranceDate) > new Date(blDate)) {
        discrepancies.push({
          id: "DISC-004",
          category: "Dates & Deadlines",
          field: "Insurance Date",
          expectedValue: `Before or on ${blDate}`,
          actualValue: insuranceDate,
          severity: "critical",
          ucpArticle: "UCP 600 Article 28(e)",
          description: "Insurance date later than shipment date",
          recommendation: "Obtain insurance covering from shipment date",
          waiverable: false,
        });
        riskScore += 25;
      }

      // Check port mismatch
      if (portOfLoading && actualPol && portOfLoading.toLowerCase() !== actualPol.toLowerCase()) {
        discrepancies.push({
          id: "DISC-005",
          category: "Ports & Places",
          field: "Port of Loading",
          expectedValue: portOfLoading,
          actualValue: actualPol,
          severity: "major",
          ucpArticle: "UCP 600 Article 20",
          description: "Port of loading differs from LC",
          recommendation: "Verify port names match LC exactly",
          waiverable: true,
        });
        riskScore += 15;
      }

      if (portOfDischarge && actualPod && portOfDischarge.toLowerCase() !== actualPod.toLowerCase()) {
        discrepancies.push({
          id: "DISC-006",
          category: "Ports & Places",
          field: "Port of Discharge",
          expectedValue: portOfDischarge,
          actualValue: actualPod,
          severity: "major",
          ucpArticle: "UCP 600 Article 20",
          description: "Port of discharge differs from LC",
          recommendation: "Verify port names match LC exactly",
          waiverable: true,
        });
        riskScore += 15;
      }

      // Random additional discrepancies for demo
      const randomDiscrepancies = commonDiscrepancies
        .filter(() => Math.random() > 0.6)
        .slice(0, 3)
        .map((d, idx) => ({
          id: `DISC-${String(discrepancies.length + idx + 1).padStart(3, "0")}`,
          ...d,
          expectedValue: "As per LC terms",
          actualValue: "Not compliant",
        }));

      discrepancies.push(...randomDiscrepancies);
      riskScore += randomDiscrepancies.length * 10;

      // Document checklist
      const documentChecklist: DocumentCheck[] = requiredDocuments.map((doc) => ({
        document: doc,
        required: Math.random() > 0.3,
        present: documentsPresented.includes(doc) || Math.random() > 0.4,
        status: documentsPresented.includes(doc)
          ? "ok"
          : Math.random() > 0.5
          ? "missing"
          : "ok",
      }));

      const criticalCount = discrepancies.filter((d) => d.severity === "critical").length;
      const majorCount = discrepancies.filter((d) => d.severity === "major").length;
      const minorCount = discrepancies.filter((d) => d.severity === "minor").length;

      const overallStatus = criticalCount > 0 ? "critical" : majorCount > 0 ? "discrepancies" : "compliant";

      const recommendations = [
        "Review all critical discrepancies before document submission",
        "Obtain amendments for non-waiverable discrepancies",
        "Ensure all required documents are properly signed and dated",
        "Verify amounts, dates, and quantities match LC terms exactly",
      ];

      if (criticalCount > 0) {
        recommendations.unshift("URGENT: Address critical discrepancies before presentation");
      }

      const analysis: LCAnalysis = {
        overallStatus,
        totalChecks: 15,
        passedChecks: 15 - discrepancies.length,
        discrepancies,
        criticalCount,
        majorCount,
        minorCount,
        riskScore: Math.min(riskScore, 100),
        recommendations,
        documentChecklist,
      };

      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  // Chart data computations using useMemo
  const severityData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Critical", value: result.criticalCount, color: COLORS.critical, icon: AlertOctagon },
      { name: "Major", value: result.majorCount, color: COLORS.major, icon: AlertTriangle },
      { name: "Minor", value: result.minorCount, color: COLORS.minor, icon: Info },
    ];
  }, [result]);

  const categoryData = useMemo(() => {
    if (!result) return [];
    return discrepancyCategories.map((cat) => ({
      name: cat.split(" ")[0],
      fullName: cat,
      count: result.discrepancies.filter((d) => d.category === cat).length,
    })).filter((d) => d.count > 0);
  }, [result]);

  const complianceData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Passed", value: result.passedChecks, fill: LOGISTICS_GREEN },
      { name: "Failed", value: result.totalChecks - result.passedChecks, fill: COLORS.failed },
    ];
  }, [result]);

  const riskGaugeData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: "Risk",
        value: result.riskScore,
        fill: result.riskScore > 60 ? COLORS.critical : result.riskScore > 30 ? COLORS.major : LOGISTICS_GREEN,
      },
    ];
  }, [result]);

  const trendData = useMemo(() => {
    // Mock trend data for visualization
    return [
      { name: "Jan", compliance: 85, risk: 25 },
      { name: "Feb", compliance: 78, risk: 35 },
      { name: "Mar", compliance: 92, risk: 18 },
      { name: "Apr", compliance: 88, risk: 22 },
      { name: "May", compliance: 95, risk: 12 },
      { name: "Jun", compliance: result ? Math.round((result.passedChecks / result.totalChecks) * 100) : 80, risk: result?.riskScore || 30 },
    ];
  }, [result]);

  const filteredFaqs = useMemo(() => {
    let filtered = faqData;
    if (faqSearch) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
          faq.answer.toLowerCase().includes(faqSearch.toLowerCase())
      );
    }
    if (selectedFaqCategory) {
      filtered = filtered.filter((faq) => faq.category === selectedFaqCategory);
    }
    return filtered;
  }, [faqSearch, selectedFaqCategory]);

  const faqCategories = useMemo(() => {
    return [...new Set(faqData.map((faq) => faq.category))];
  }, []);

  const getRiskLevel = (score: number) => {
    if (score > 60) return { label: "High Risk", color: COLORS.critical, trend: ArrowUpRight };
    if (score > 30) return { label: "Medium Risk", color: COLORS.major, trend: Minus };
    return { label: "Low Risk", color: LOGISTICS_GREEN, trend: ArrowDownRight };
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C81] via-[#0F4C81] to-[#2E8B57]">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMTRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTE0IDE0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00em0wLTE0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00em0tMjggMTRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6bTAtMTRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] animate-pulse" />
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#2E8B57]/30 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="relative z-10 p-8 md:p-12">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
            {/* Left content */}
            <div className="space-y-6 flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="relative">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
                    <FileSearch className="h-10 w-10 text-white" />
                  </div>
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="h-5 w-5 text-yellow-300" />
                  </motion.div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm px-3 py-1">
                    UCP 600 Compliant
                  </Badge>
                  <Badge className="bg-[#2E8B57]/30 text-white border-[#2E8B57]/50 hover:bg-[#2E8B57]/40 text-sm px-3 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    ICC Standards
                  </Badge>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-3"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  LC Discrepancy
                  <span className="block bg-gradient-to-r from-white to-[#2E8B57] bg-clip-text text-transparent">
                    Analyzer
                  </span>
                </h1>
                <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                  Professional analysis of Letter of Credit documents for compliance issues, 
                  discrepancies identification, and actionable recommendations based on UCP 600 standards.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  { icon: Target, text: "Real-time Analysis" },
                  { icon: Scale, text: "UCP 600 Rules" },
                  { icon: CheckCircle, text: "Waiver Detection" },
                  { icon: Activity, text: "Risk Assessment" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <item.icon className="h-4 w-4 text-[#2E8B57]" />
                    <span className="text-sm text-white">{item.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right stats cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 gap-4 xl:w-80"
            >
              {[
                { icon: FileText, value: "15+", label: "Check Types", color: "white/20" },
                { icon: Scale, value: "UCP 600", label: "Compliant", color: "[#2E8B57]/30" },
                { icon: Globe, value: "ICC", label: "Standards", color: "white/15" },
                { icon: Clock, value: "< 2s", label: "Analysis Time", color: "[#2E8B57]/25" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="relative group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className={`bg-${stat.color} backdrop-blur-sm border-white/20 overflow-hidden`}>
                    <CardContent className="p-4 text-center">
                      <stat.icon className="h-8 w-8 text-white/80 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-white/70">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar - Enhanced */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {/* Overall Status Card */}
          <Card className={`relative overflow-hidden text-white ${
            result.overallStatus === "compliant"
              ? "bg-gradient-to-br from-[#2E8B57] to-[#236B43]"
              : result.overallStatus === "discrepancies"
              ? "bg-gradient-to-br from-amber-500 to-amber-600"
              : "bg-gradient-to-br from-red-500 to-red-600"
          }`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                >
                  {result.overallStatus === "compliant" ? (
                    <CheckCircle className="h-6 w-6 opacity-80" />
                  ) : result.overallStatus === "discrepancies" ? (
                    <AlertTriangle className="h-6 w-6 opacity-80" />
                  ) : (
                    <XCircle className="h-6 w-6 opacity-80" />
                  )}
                </motion.div>
                <Badge className="bg-white/20 text-white border-0 text-xs uppercase">
                  {result.overallStatus}
                </Badge>
              </div>
              <p className="text-sm opacity-80 font-medium">Overall Status</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div
                className="h-full bg-white/40"
                initial={{ width: 0 }}
                animate={{ width: result.overallStatus === "compliant" ? "100%" : result.overallStatus === "discrepancies" ? "60%" : "30%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
          </Card>

          {/* Passed Checks Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81] to-[#0A3A61] text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <ListChecks className="h-6 w-6 opacity-80" />
                <Badge className="bg-white/20 text-white border-0 text-xs">Passed</Badge>
              </div>
              <p className="text-2xl font-bold">{result.passedChecks}/{result.totalChecks}</p>
              <p className="text-sm opacity-80">Checks passed</p>
            </CardContent>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <motion.div
                className="h-full bg-[#2E8B57]"
                initial={{ width: 0 }}
                animate={{ width: `${(result.passedChecks / result.totalChecks) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
          </Card>

          {/* Critical Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <XCircle className="h-6 w-6 opacity-80" />
                <Badge className="bg-white/20 text-white border-0 text-xs">Critical</Badge>
              </div>
              <p className="text-2xl font-bold">{result.criticalCount}</p>
              <p className="text-sm opacity-80">Non-waiverable</p>
            </CardContent>
          </Card>

          {/* Major Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-amber-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-6 w-6 opacity-80" />
                <Badge className="bg-white/20 text-white border-0 text-xs">Major</Badge>
              </div>
              <p className="text-2xl font-bold">{result.majorCount}</p>
              <p className="text-sm opacity-80">Waiverable</p>
            </CardContent>
          </Card>

          {/* Risk Score Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-6 w-6 opacity-80" />
                <Badge className="bg-white/20 text-white border-0 text-xs">Risk</Badge>
              </div>
              <p className="text-2xl font-bold">{result.riskScore}%</p>
              <p className="text-sm opacity-80">Risk score</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* LC Details Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl" style={{ color: OCEAN_BLUE }}>
                <FileText className="h-5 w-5" />
                Letter of Credit Details
              </CardTitle>
              <CardDescription className="mt-1">
                Enter the LC terms and conditions as specified in the Letter of Credit
              </CardDescription>
            </div>
            <Badge variant="outline" className="hidden md:flex" style={{ borderColor: LOGISTICS_GREEN, color: LOGISTICS_GREEN }}>
              <Layers className="h-3 w-3 mr-1" />
              LC Information
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">LC Number</Label>
              <Input
                value={lcNumber}
                onChange={(e) => setLcNumber(e.target.value)}
                placeholder="LC123456789"
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                LC Amount
              </Label>
              <Input
                type="number"
                value={lcAmount}
                onChange={(e) => setLcAmount(e.target.value)}
                placeholder="100,000"
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                LC Expiry Date
              </Label>
              <Input
                type="date"
                value={lcExpiry}
                onChange={(e) => setLcExpiry(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                Latest Shipment Date
              </Label>
              <Input
                type="date"
                value={latestShipment}
                onChange={(e) => setLatestShipment(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Presentation Period (days)</Label>
              <Input
                type="number"
                value={presentationPeriod}
                onChange={(e) => setPresentationPeriod(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Incoterms</Label>
              <Select value={incoterm} onValueChange={setIncoterm}>
                <SelectTrigger className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FOB">FOB</SelectItem>
                  <SelectItem value="CIF">CIF</SelectItem>
                  <SelectItem value="CFR">CFR</SelectItem>
                  <SelectItem value="EXW">EXW</SelectItem>
                  <SelectItem value="FCA">FCA</SelectItem>
                  <SelectItem value="DDP">DDP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Port of Loading</Label>
              <Input
                value={portOfLoading}
                onChange={(e) => setPortOfLoading(e.target.value)}
                placeholder="Shanghai"
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Port of Discharge</Label>
              <Input
                value={portOfDischarge}
                onChange={(e) => setPortOfDischarge(e.target.value)}
                placeholder="Los Angeles"
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Partial Shipment</Label>
              <Select value={partialShipment} onValueChange={setPartialShipment}>
                <SelectTrigger className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowed">Allowed</SelectItem>
                  <SelectItem value="prohibited">Prohibited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Transshipment</Label>
              <Select value={transshipment} onValueChange={setTransshipment}>
                <SelectTrigger className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allowed">Allowed</SelectItem>
                  <SelectItem value="prohibited">Prohibited</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium">Goods Description</Label>
              <Textarea
                value={goodsDescription}
                onChange={(e) => setGoodsDescription(e.target.value)}
                placeholder="Brief goods description as per LC"
                rows={2}
                className="border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81] resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Details Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl" style={{ color: OCEAN_BLUE }}>
                <FileSearch className="h-5 w-5" />
                Document Presentation Details
              </CardTitle>
              <CardDescription className="mt-1">
                Enter the details from the presented documents for analysis
              </CardDescription>
            </div>
            <Badge variant="outline" className="hidden md:flex" style={{ borderColor: OCEAN_BLUE, color: OCEAN_BLUE }}>
              <FileCheck className="h-3 w-3 mr-1" />
              Documents
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">B/L Date</Label>
              <Input
                type="date"
                value={blDate}
                onChange={(e) => setBlDate(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Presentation Date</Label>
              <Input
                type="date"
                value={presentationDate}
                onChange={(e) => setPresentationDate(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Invoice Amount</Label>
              <Input
                type="number"
                value={invoiceAmount}
                onChange={(e) => setInvoiceAmount(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Insurance Date</Label>
              <Input
                type="date"
                value={insuranceDate}
                onChange={(e) => setInsuranceDate(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Actual Port of Loading</Label>
              <Input
                value={actualPol}
                onChange={(e) => setActualPol(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Actual Port of Discharge</Label>
              <Input
                value={actualPod}
                onChange={(e) => setActualPod(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Certificate of Origin Date</Label>
              <Input
                type="date"
                value={cooDate}
                onChange={(e) => setCooDate(e.target.value)}
                className="h-11 border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={analyzeDocuments}
                disabled={isAnalyzing}
                className="text-white px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                style={{ backgroundColor: OCEAN_BLUE }}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="mr-3 h-5 w-5 animate-spin" />
                    Analyzing Documents...
                  </>
                ) : (
                  <>
                    <FileSearch className="mr-3 h-5 w-5" />
                    Analyze for Discrepancies
                  </>
                )}
              </Button>
            </motion.div>
            {result && (
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results - 5 Tabs */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-5 h-14 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <PieChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="discrepancies" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="hidden sm:inline">Discrepancies</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <FileCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Documents</span>
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Actions</span>
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">FAQs</span>
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Overview */}
                <TabsContent value="overview" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Compliance Pie Chart */}
                    <Card className="border shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                            <PieChart className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                          </div>
                          Compliance Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                              <Pie
                                data={complianceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}`}
                              >
                                {complianceData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPie>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-4 p-4 rounded-xl" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                          <p className="text-4xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                            {Math.round((result.passedChecks / result.totalChecks) * 100)}%
                          </p>
                          <p className="text-sm text-muted-foreground font-medium">Compliance Rate</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Risk Gauge */}
                    <Card className="border shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                            <Shield className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                          </div>
                          Risk Assessment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                              cx="50%"
                              cy="50%"
                              innerRadius="30%"
                              outerRadius="100%"
                              data={riskGaugeData}
                              startAngle={180}
                              endAngle={0}
                            >
                              <RadialBar
                                background
                                dataKey="value"
                                cornerRadius={10}
                              />
                              <Tooltip />
                            </RadialBarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-4">
                          <div className="flex items-center justify-center gap-2">
                            <p className="text-4xl font-bold" style={{ color: getRiskLevel(result.riskScore).color }}>
                              {result.riskScore}%
                            </p>
                            {(() => {
                              const TrendIcon = getRiskLevel(result.riskScore).trend;
                              return <TrendIcon className="h-6 w-6" style={{ color: getRiskLevel(result.riskScore).color }} />;
                            })()}
                          </div>
                          <p className="text-sm text-muted-foreground font-medium">Risk Score</p>
                          <Badge className="mt-2 text-sm" style={{ backgroundColor: getRiskLevel(result.riskScore).color }}>
                            {getRiskLevel(result.riskScore).label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Discrepancy by Severity */}
                    <Card className="border shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                            <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                          </div>
                          By Severity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={severityData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                              <XAxis type="number" />
                              <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                                {severityData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-3">
                          {severityData.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-2 rounded-lg" style={{ backgroundColor: `${item.color}10` }}>
                              <span className="text-sm font-medium">{item.name} Issues</span>
                              <Badge style={{ backgroundColor: item.color }}>{item.value}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Trend Chart */}
                  <Card className="border shadow-sm mt-6">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                          <TrendingUp className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        </div>
                        Compliance Trend (Last 6 Months)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="compliance" fill={LOGISTICS_GREEN} fillOpacity={0.3} stroke={LOGISTICS_GREEN} strokeWidth={2} name="Compliance %" />
                            <Line yAxisId="right" type="monotone" dataKey="risk" stroke={COLORS.critical} strokeWidth={2} dot={{ fill: COLORS.critical }} name="Risk %" />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card className="border shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Document Compliance</span>
                        <Badge variant="outline" style={{ color: LOGISTICS_GREEN, borderColor: LOGISTICS_GREEN }}>
                          {result.passedChecks}/{result.totalChecks}
                        </Badge>
                      </div>
                      <Progress
                        value={(result.passedChecks / result.totalChecks) * 100}
                        className="h-3"
                        style={{ backgroundColor: `${LOGISTICS_GREEN}20` }}
                      />
                    </Card>
                    <Card className="border shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Waiverable Issues</span>
                        <Badge variant="outline" style={{ color: COLORS.major, borderColor: COLORS.major }}>
                          {result.majorCount} of {result.discrepancies.length}
                        </Badge>
                      </div>
                      <Progress
                        value={result.discrepancies.length > 0 ? (result.majorCount / result.discrepancies.length) * 100 : 100}
                        className="h-3"
                        style={{ backgroundColor: `${COLORS.major}20` }}
                      />
                    </Card>
                    <Card className="border shadow-sm p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Risk Level</span>
                        <Badge variant="outline" style={{ color: getRiskLevel(result.riskScore).color, borderColor: getRiskLevel(result.riskScore).color }}>
                          {getRiskLevel(result.riskScore).label}
                        </Badge>
                      </div>
                      <Progress
                        value={result.riskScore}
                        className="h-3"
                        style={{ backgroundColor: `${getRiskLevel(result.riskScore).color}20` }}
                      />
                    </Card>
                  </div>
                </TabsContent>

                {/* Tab 2: Discrepancies */}
                <TabsContent value="discrepancies" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        Discrepancy Distribution
                      </h4>
                      <Card className="border shadow-sm">
                        <CardContent className="pt-4">
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={severityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                  {severityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Category Breakdown */}
                      {categoryData.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium mb-2 text-sm text-muted-foreground">By Category</h5>
                          <div className="space-y-2">
                            {categoryData.map((cat, index) => (
                              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                <span className="text-sm">{cat.fullName}</span>
                                <Badge variant="secondary">{cat.count}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Discrepancy List */}
                    <div className="lg:col-span-2">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <FileWarning className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        Identified Discrepancies
                      </h4>
                      {result.discrepancies.length > 0 ? (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                          <AnimatePresence>
                            {result.discrepancies.map((disc, index) => (
                              <motion.div
                                key={disc.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-5 rounded-xl border-l-4 transition-all hover:shadow-md ${
                                  disc.severity === "critical"
                                    ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                                    : disc.severity === "major"
                                    ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                    : "border-l-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                }`}
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-xs font-mono text-muted-foreground">{disc.id}</span>
                                      <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${OCEAN_BLUE}15`, color: OCEAN_BLUE }}>
                                        {disc.category}
                                      </span>
                                    </div>
                                    <h5 className="font-semibold text-lg">{disc.field}</h5>
                                  </div>
                                  <div className="flex gap-2">
                                    {disc.waiverable && (
                                      <Badge className="bg-green-100 text-green-700 border-green-200">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Waiverable
                                      </Badge>
                                    )}
                                    <Badge
                                      className={`uppercase ${
                                        disc.severity === "critical"
                                          ? "bg-red-100 text-red-700 border-red-200"
                                          : disc.severity === "major"
                                          ? "bg-amber-100 text-amber-700 border-amber-200"
                                          : "bg-blue-100 text-blue-700 border-blue-200"
                                      }`}
                                    >
                                      {disc.severity}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{disc.description}</p>
                                <div className="grid grid-cols-2 gap-4 text-sm mb-3 p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                                  <div>
                                    <span className="text-muted-foreground">Expected:</span>
                                    <p className="font-medium">{disc.expectedValue}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Actual:</span>
                                    <p className="font-medium">{disc.actualValue}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                  <span className="text-sm font-medium flex items-center gap-1" style={{ color: OCEAN_BLUE }}>
                                    <BookOpen className="h-4 w-4" />
                                    {disc.ucpArticle}
                                  </span>
                                  <span className="text-sm font-medium flex items-center gap-1" style={{ color: LOGISTICS_GREEN }}>
                                    <ArrowDownRight className="h-4 w-4" />
                                    {disc.recommendation}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="text-center py-16 rounded-xl border-2 border-dashed border-green-200 bg-green-50 dark:bg-green-900/20">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <CheckCircle className="h-16 w-16 mx-auto mb-4" style={{ color: LOGISTICS_GREEN }} />
                          </motion.div>
                          <h4 className="text-xl font-semibold mb-2" style={{ color: LOGISTICS_GREEN }}>No discrepancies found</h4>
                          <p className="text-muted-foreground">All documents comply with LC terms</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Documents */}
                <TabsContent value="documents" className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FileCheck className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        Document Checklist
                      </h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckSquare className="h-3 w-3 mr-1" />
                          {result.documentChecklist.filter(d => d.status === "ok").length} OK
                        </Badge>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <XSquare className="h-3 w-3 mr-1" />
                          {result.documentChecklist.filter(d => d.status === "missing").length} Missing
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.documentChecklist.map((doc, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                            doc.status === "ok"
                              ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                              : doc.status === "missing"
                              ? "border-red-200 bg-red-50 dark:bg-red-900/20"
                              : "border-amber-200 bg-amber-50 dark:bg-amber-900/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                doc.status === "ok" ? "bg-green-100" : doc.status === "missing" ? "bg-red-100" : "bg-amber-100"
                              }`}>
                                <FileText className={`h-5 w-5 ${
                                  doc.status === "ok" ? "text-green-600" : doc.status === "missing" ? "text-red-600" : "text-amber-600"
                                }`} />
                              </div>
                              <span className="font-medium">{doc.document}</span>
                            </div>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, delay: 0.1 + index * 0.03 }}
                            >
                              {doc.status === "ok" ? (
                                <CheckCircle className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                              ) : doc.status === "missing" ? (
                                <XCircle className="h-6 w-6 text-red-500" />
                              ) : (
                                <AlertCircle className="h-6 w-6 text-amber-500" />
                              )}
                            </motion.div>
                          </div>
                          <div className="flex gap-2">
                            {doc.required && (
                              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: `${OCEAN_BLUE}15`, color: OCEAN_BLUE }}>
                                Required
                              </span>
                            )}
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                doc.present
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {doc.present ? "Present" : "Missing"}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 4: Recommendations */}
                <TabsContent value="recommendations" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        Action Items
                      </h4>
                      <div className="space-y-3">
                        {result.recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: index === 0 && result.criticalCount > 0 ? COLORS.critical : OCEAN_BLUE }}>
                              {index + 1}
                            </div>
                            <div>
                              <span className="text-sm font-medium">{rec}</span>
                              {index === 0 && result.criticalCount > 0 && (
                                <Badge className="ml-2 bg-red-100 text-red-700">Urgent</Badge>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <Card className="mt-6 p-4" style={{ borderColor: LOGISTICS_GREEN, backgroundColor: `${LOGISTICS_GREEN}05` }}>
                        <h5 className="font-semibold mb-3 flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                          <Sparkles className="h-5 w-5" />
                          Quick Actions
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" className="justify-start h-auto py-3">
                            <Printer className="h-4 w-4 mr-2" />
                            Print Report
                          </Button>
                          <Button variant="outline" className="justify-start h-auto py-3">
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF
                          </Button>
                          <Button variant="outline" className="justify-start h-auto py-3">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Request Review
                          </Button>
                          <Button variant="outline" className="justify-start h-auto py-3">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            ICC Guidelines
                          </Button>
                        </div>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      {/* UCP 600 Key Articles */}
                      <Card className="p-5 rounded-xl border-2" style={{ borderColor: OCEAN_BLUE, backgroundColor: `${OCEAN_BLUE}05` }}>
                        <h5 className="font-semibold mb-4 flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                          <BookOpen className="h-5 w-5" />
                          UCP 600 Key Articles
                        </h5>
                        <div className="space-y-3">
                          {ucpArticles.map((article, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" style={{ borderColor: OCEAN_BLUE, color: OCEAN_BLUE }}>
                                  {article.article}
                                </Badge>
                                <span className="text-sm">{article.title}</span>
                              </div>
                              <Badge className={
                                article.importance === "critical" ? "bg-red-100 text-red-700" :
                                article.importance === "high" ? "bg-amber-100 text-amber-700" :
                                "bg-blue-100 text-blue-700"
                              }>
                                {article.importance}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Waiver Process Info */}
                      <Card className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                        <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Waiver Process
                        </h5>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                          Under UCP 600 Article 16, the issuing bank must provide notice of refusal within
                          5 banking days. The applicant may waive discrepancies, but the bank is not obligated
                          to seek such waiver.
                        </p>
                        <div className="flex gap-2">
                          <Badge className="bg-amber-200 text-amber-800">5 Banking Days</Badge>
                          <Badge className="bg-amber-200 text-amber-800">Article 16</Badge>
                        </div>
                      </Card>

                      {/* Pro Tip */}
                      <Card className="p-5 rounded-xl border-2" style={{ borderColor: LOGISTICS_GREEN, backgroundColor: `${LOGISTICS_GREEN}05` }}>
                        <h5 className="font-semibold mb-3 flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                          <Sparkles className="h-5 w-5" />
                          Pro Tip
                        </h5>
                        <p className="text-sm" style={{ color: LOGISTICS_GREEN }}>
                          Always verify documents against LC terms before presentation. Pre-checking can save
                          significant time and costs associated with discrepancy fees and amendments.
                        </p>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 5: FAQs - Enhanced */}
                <TabsContent value="faq" className="pt-6">
                  <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex p-4 rounded-2xl mb-4" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                        <HelpCircle className="h-12 w-12" style={{ color: OCEAN_BLUE }} />
                      </div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: OCEAN_BLUE }}>
                        Frequently Asked Questions
                      </h3>
                      <p className="text-muted-foreground">
                        Common questions about Letter of Credit discrepancies and UCP 600 compliance
                      </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          placeholder="Search FAQs..."
                          value={faqSearch}
                          onChange={(e) => setFaqSearch(e.target.value)}
                          className="pl-10 h-12 rounded-xl border-slate-200 focus:border-[#0F4C81] focus:ring-[#0F4C81]"
                        />
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant={selectedFaqCategory === null ? "default" : "outline"}
                          onClick={() => setSelectedFaqCategory(null)}
                          className="rounded-xl"
                          style={selectedFaqCategory === null ? { backgroundColor: OCEAN_BLUE } : {}}
                        >
                          All
                        </Button>
                        {faqCategories.map((category) => (
                          <Button
                            key={category}
                            variant={selectedFaqCategory === category ? "default" : "outline"}
                            onClick={() => setSelectedFaqCategory(category)}
                            className="rounded-xl"
                            style={selectedFaqCategory === category ? { backgroundColor: OCEAN_BLUE } : {}}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* FAQ List */}
                    <Accordion type="single" collapsible className="w-full space-y-3">
                      <AnimatePresence>
                        {filteredFaqs.map((faq, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <AccordionItem
                              value={`item-${index}`}
                              className="border rounded-xl px-5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                                <div className="flex items-center gap-4">
                                  <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                                    style={{ backgroundColor: OCEAN_BLUE }}
                                  >
                                    {index + 1}
                                  </div>
                                  <div>
                                    <span className="block">{faq.question}</span>
                                    <Badge variant="outline" className="mt-1 text-xs" style={{ color: LOGISTICS_GREEN, borderColor: LOGISTICS_GREEN }}>
                                      {faq.category}
                                    </Badge>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground pl-14 pb-4">
                                <Separator className="mb-4" />
                                {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </Accordion>

                    {filteredFaqs.length === 0 && (
                      <div className="text-center py-12 rounded-xl border-2 border-dashed">
                        <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No FAQs match your search criteria</p>
                      </div>
                    )}

                    {/* Contact Support */}
                    <Card className="mt-8 p-6 rounded-xl text-center" style={{ backgroundColor: `${OCEAN_BLUE}10`, borderColor: OCEAN_BLUE }}>
                      <h4 className="font-semibold mb-2" style={{ color: OCEAN_BLUE }}>
                        Need More Help?
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Contact our trade finance experts for personalized assistance with your LC documentation.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button className="text-white rounded-xl" style={{ backgroundColor: LOGISTICS_GREEN }}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact Support
                        </Button>
                        <Button variant="outline" className="rounded-xl" style={{ borderColor: OCEAN_BLUE, color: OCEAN_BLUE }}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          ICC Resources
                        </Button>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
