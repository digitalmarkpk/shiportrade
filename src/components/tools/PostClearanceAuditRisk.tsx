"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  Building2,
  Globe,
  FileSearch,
  TrendingUp,
  ClipboardList,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  FileWarning,
  Clock,
  DollarSign,
  Target,
  AlertCircle,
  BookOpen,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Award,
  Scale,
  FileCheck,
  ListChecks,
  ArrowRight,
  Download,
  Share2,
  RotateCcw,
  Lightbulb,
  XCircle as MistakeIcon,
  HelpCircle,
  Zap,
  FileText,
  Users,
  Settings,
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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";

interface AuditRiskResult {
  overallRiskScore: number;
  riskCategory: "low" | "medium" | "high" | "critical";
  auditProbability: number;
  riskFactors: RiskFactorDetail[];
  complianceScore: number;
  companyRiskProfile: CompanyRiskProfile;
  recommendations: Recommendation[];
  checklist: ChecklistItem[];
  documentationGaps: DocumentationGap[];
  auditTimeline: AuditEvent[];
  mitigationStrategies: MitigationStrategy[];
  summary: {
    totalFactors: number;
    lowRiskFactors: number;
    mediumRiskFactors: number;
    highRiskFactors: number;
    criticalRiskFactors: number;
  };
}

interface RiskFactorDetail {
  category: string;
  name: string;
  score: number;
  weight: number;
  weightedScore: number;
  status: "low" | "medium" | "high" | "critical";
  description: string;
  impact: string;
  mitigation: string;
}

interface CompanyRiskProfile {
  volumeRisk: number;
  hsCodeDiversityRisk: number;
  countryRisk: number;
  complianceHistoryRisk: number;
  overallProfile: string;
}

interface Recommendation {
  priority: "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  timeline: string;
}

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  status: "complete" | "partial" | "missing";
  importance: "critical" | "important" | "recommended";
  notes: string;
}

interface DocumentationGap {
  document: string;
  status: "missing" | "incomplete" | "outdated" | "adequate";
  risk: string;
  action: string;
}

interface AuditEvent {
  year: number;
  type: string;
  outcome: string;
  findings: number;
  adjustments: number;
}

interface MitigationStrategy {
  strategy: string;
  category: string;
  currentScore: number;
  targetScore: number;
  potentialReduction: number;
  cost: string;
  difficulty: string;
}

// Country risk data for customs compliance
const countryRiskData = [
  { code: "CN", name: "China", riskLevel: "High", score: 75, issues: ["AD/CVD cases", "IPR concerns", "Valuation scrutiny"] },
  { code: "VN", name: "Vietnam", riskLevel: "Medium-High", score: 60, issues: ["Transshipment concerns", "Origin verification"] },
  { code: "IN", name: "India", riskLevel: "Medium", score: 50, issues: ["Classification disputes", "Valuation issues"] },
  { code: "TW", name: "Taiwan", riskLevel: "Medium", score: 45, issues: ["Origin documentation"] },
  { code: "KR", name: "South Korea", riskLevel: "Low-Medium", score: 35, issues: ["FTA documentation"] },
  { code: "JP", name: "Japan", riskLevel: "Low", score: 20, issues: ["Minimal"] },
  { code: "DE", name: "Germany", riskLevel: "Low", score: 15, issues: ["Minimal"] },
  { code: "MX", name: "Mexico", riskLevel: "Medium", score: 40, issues: ["USMCA compliance", "Origin documentation"] },
  { code: "BR", name: "Brazil", riskLevel: "Medium-High", score: 55, issues: ["Classification", "Valuation"] },
  { code: "TH", name: "Thailand", riskLevel: "Medium", score: 40, issues: ["Origin documentation"] },
  { code: "MY", name: "Malaysia", riskLevel: "Low-Medium", score: 30, issues: ["Minimal"] },
  { code: "SG", name: "Singapore", riskLevel: "Low", score: 15, issues: ["Minimal"] },
  { code: "AU", name: "Australia", riskLevel: "Low", score: 15, issues: ["Minimal"] },
  { code: "UK", name: "United Kingdom", riskLevel: "Low", score: 20, issues: ["Post-Brexit documentation"] },
  { code: "CA", name: "Canada", riskLevel: "Low", score: 15, issues: ["USMCA compliance"] },
  { code: "OTHER", name: "Other Countries", riskLevel: "Varies", score: 40, issues: ["Case-by-case assessment"] },
];

// Import volume tiers
const volumeTiers = [
  { range: "< $1M", label: "Low Volume", score: 10 },
  { range: "$1M - $10M", label: "Medium Volume", score: 25 },
  { range: "$10M - $50M", label: "High Volume", score: 45 },
  { range: "$50M - $100M", label: "Very High Volume", score: 60 },
  { range: "> $100M", label: "Enterprise Volume", score: 75 },
];

// HS Code diversity risk
const hsDiversityLevels = [
  { count: "1-5 HS codes", label: "Low Diversity", score: 15, risk: "Low" },
  { count: "6-20 HS codes", label: "Medium Diversity", score: 30, risk: "Medium" },
  { count: "21-50 HS codes", label: "High Diversity", score: 50, risk: "High" },
  { count: "51-100 HS codes", label: "Very High Diversity", score: 65, risk: "High" },
  { count: "> 100 HS codes", label: "Extreme Diversity", score: 80, risk: "Critical" },
];

const COLORS = {
  low: "#2E8B57",
  medium: "#F59E0B",
  high: "#EF4444",
  critical: "#7F1D1D",
};

const BRAND_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
};

// Animated badge component
const AnimatedBadge = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ scale: 1.05 }}
  >
    <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
      {children}
    </Badge>
  </motion.div>
);

// FAQ data with comprehensive answers
const faqData = [
  {
    question: "What is a post-clearance audit and why do customs authorities conduct them?",
    answer: "A post-clearance audit (PCA) is a systematic examination of a company's import and export records after goods have been cleared through customs. Customs authorities conduct these audits to verify the accuracy of declared values, classifications, origins, and compliance with trade regulations. Unlike pre-clearance inspections that occur at the border, PCAs take place at the importer's premises, typically within 3-5 years after importation. These audits serve multiple purposes: ensuring proper duty collection, detecting fraud or non-compliance, verifying FTA claims, and maintaining the integrity of the customs system. Companies with high import volumes, complex supply chains, or previous compliance issues are more likely to be selected for audits. Understanding PCA procedures and maintaining organized records is essential for successful audit outcomes and minimizing potential penalties or duty assessments."
  },
  {
    question: "What are the most common triggers for a post-clearance audit selection?",
    answer: "Customs authorities use sophisticated risk assessment algorithms to select companies for post-clearance audits. The most common triggers include: high import volumes that exceed typical thresholds for your industry; imports from countries with known compliance risks such as China, Vietnam, or other regions with high AD/CVD case activity; significant use of free trade agreement preferences without robust documentation; complex valuation scenarios involving related parties, assists, royalties, or buying commissions; previous audit findings or penalties in your compliance history; HS code classifications that appear inconsistent with industry norms; large volumes of duty drawback or duty deferral program usage; and random selection based on statistical sampling. Additionally, tip-offs from competitors, discrepancies between import and export data in bilateral trade statistics, or referrals from other government agencies can trigger audits. Companies should proactively assess these risk factors and address any gaps in their compliance programs."
  },
  {
    question: "How far back can customs authorities audit and what records must be retained?",
    answer: "In most jurisdictions, customs authorities can audit import records for a period extending back 3 to 5 years from the date of importation, though some countries may have longer lookback periods. In the United States, CBP requires importers to retain records for 5 years from the date of entry, as mandated by 19 CFR 163.4. The European Union maintains a similar 3-year minimum, though member states may extend this. Required records include: entry summaries and customs declarations; commercial invoices showing all required elements; packing lists; bills of lading or air waybills; certificates of origin for FTA claims; import permits and licenses; valuation worksheets and supporting documentation; classification rationale and binding ruling copies; proof of payment for duties and fees; and any correspondence with customs authorities. Failure to produce requested records during an audit can result in penalties and adverse assumptions about the content of missing documents. Implementing a robust document management system with proper indexing and retrieval capabilities is essential for compliance."
  },
  {
    question: "What are the potential consequences of a post-clearance audit finding?",
    answer: "Post-clearance audit findings can result in a range of consequences depending on the severity and nature of non-compliance. Monetary consequences include: payment of additional duties, taxes, and fees that should have been paid; interest charges on unpaid amounts calculated from the original due date; administrative penalties ranging from warning letters to substantial fines; and potential exclusion from trusted trader programs like C-TPAT. For serious violations, customs may impose punitive penalties that can reach 4 times the lost revenue or more in cases of fraud. Non-monetary consequences include: increased scrutiny of future importations; suspension or revocation of import privileges; removal from preferred trader programs; mandatory implementation of compliance improvements; and reputational damage within the industry. In cases involving fraud, smuggling, or serious violations, criminal prosecution may be pursued. Additionally, audit findings can trigger secondary investigations into related transactions, expand the scope of review to other business units, or result in referrals to other government agencies such as the IRS, FDA, or EPA depending on the nature of imported goods."
  },
  {
    question: "How can companies effectively prepare for and survive a post-clearance audit?",
    answer: "Effective preparation for post-clearance audits requires a comprehensive, proactive approach to customs compliance. Start by implementing a formal import compliance program with written policies and procedures covering all aspects of the import process. Conduct regular internal audits, ideally annually, to identify and correct issues before they are discovered by customs authorities. Maintain organized, accessible records with clear indexing and retrieval systems. Establish clear documentation of classification decisions, valuation methodologies, and origin claims. Train import staff regularly on compliance requirements and changes in customs regulations. Consider obtaining binding rulings for ambiguous classifications to provide certainty and protection. For related-party transactions, maintain robust transfer pricing documentation and customs valuation adjustments. Consider participating in trusted trader programs like C-TPAT, which can provide benefits including reduced audit frequency. When an audit notice is received, respond promptly and professionally, designate a single point of contact for customs, provide complete and accurate responses to all requests, and consider engaging experienced customs counsel for complex matters. Demonstrating a commitment to compliance and cooperation can positively influence audit outcomes."
  },
  {
    question: "What role do Free Trade Agreements play in post-clearance audit risk?",
    answer: "Free Trade Agreements significantly impact post-clearance audit risk because they involve preferential duty treatment that customs authorities must verify. When a company claims FTA preferences, they are essentially certifying that goods meet specific origin criteria, and this self-declaration becomes a primary target for audit verification. Key risk factors include: insufficient documentation of origin qualification such as missing certificates of origin or inadequate producer certifications; failure to maintain required supporting records for the retention period; incorrect application of origin rules including de minimis calculations, regional value content, or tariff shift requirements; reliance on supplier claims without independent verification; and failure to monitor ongoing compliance as origin rules or supply chains change. Companies with high FTA utilization rates face elevated audit scrutiny, as customs authorities seek to verify that preferential treatment is properly claimed. To mitigate risk, implement robust origin management systems, obtain and retain certificates of origin, conduct periodic origin audits of supplier claims, and maintain clear documentation of qualification methodology for each product claiming preference."
  },
  {
    question: "How does C-TPAT certification affect post-clearance audit probability and outcomes?",
    answer: "C-TPAT (Customs-Trade Partnership Against Terrorism) certification can significantly reduce both the likelihood of post-clearance audits and improve outcomes when audits do occur. As a voluntary government-business initiative, C-TPAT members agree to implement enhanced supply chain security measures in exchange for various benefits including reduced examination rates, access to FAST lanes at land borders, and a reduction in post-clearance audit frequency. Statistics indicate that C-TPAT certified importers experience approximately 30-40% fewer audits compared to non-certified importers of similar size and risk profile. When audits are conducted, certified companies receive certain considerations: advance notice of audits, designated C-TPAT points of contact, potential for expedited resolution, and recognition of existing security and compliance measures. However, C-TPAT membership does not provide immunity from audits, particularly if risk indicators suggest potential compliance issues. Certified companies must maintain their security standards and report any security incidents or changes in business practices. Loss of C-TPAT status can result in immediate return to higher scrutiny levels and may trigger focused reviews of import activities during the certification period."
  },
  {
    question: "What is the difference between a focused audit and a comprehensive post-clearance audit?",
    answer: "Customs authorities conduct different types of post-clearance audits depending on identified risks and compliance concerns. A focused audit, also known as a single-issue or topic-specific audit, examines a particular aspect of import compliance such as classification, valuation, origin, or specific tariff provisions. Focused audits are typically shorter in duration, lasting from several weeks to a few months, and concentrate on a specific period, product line, or issue area. These audits are often triggered by specific risk indicators or data anomalies identified through automated screening systems. In contrast, a comprehensive post-clearance audit examines all aspects of an importer's customs compliance over an extended period, typically covering 3-5 years of import activity. Comprehensive audits review classification practices, valuation methodologies, origin documentation, duty deferral programs, record-keeping compliance, and internal controls. These audits can last 6-18 months and involve extensive document requests, on-site visits, and detailed testing of transactions. Companies facing comprehensive audits should expect significant resource demands, including dedicated personnel, document production, and potential adjustments across multiple areas of their import operations."
  }
];

export default function PostClearanceAuditRisk() {
  // Company Profile State
  const [companyName, setCompanyName] = useState("");
  const [importVolume, setImportVolume] = useState("3");
  const [hsCodeCount, setHsCodeCount] = useState("2");
  const [primaryCountry, setPrimaryCountry] = useState("CN");

  // Compliance History State
  const [priorAudits, setPriorAudits] = useState("0");
  const [auditFindings, setAuditFindings] = useState("0");
  const [penaltyHistory, setPenaltyHistory] = useState("none");
  const [correctionsFiled, setCorrectionsFiled] = useState("0");
  const [cTpaticertified, setCtpatCertified] = useState(false);
  const [aeroCertified, setAeroCertified] = useState(false);

  // Risk Factor State
  const [valuationRisk, setValuationRisk] = useState("medium");
  const [classificationRisk, setClassificationRisk] = useState("medium");
  const [originRisk, setOriginRisk] = useState("medium");
  const [dutyReliefRisk, setDutyReliefRisk] = useState("low");
  const [transferPricingRisk, setTransferPricingRisk] = useState(false);
  const [relatedPartyTransactions, setRelatedPartyTransactions] = useState(false);
  const [firstSaleAppraisal, setFirstSaleAppraisal] = useState(false);
  const [dutyDrawback, setDutyDrawback] = useState(false);
  const [ftaUtilization, setFtaUtilization] = useState("0");

  // Documentation State
  const [entryDocumentation, setEntryDocumentation] = useState("partial");
  const [commercialInvoices, setCommercialInvoices] = useState("adequate");
  const [packingLists, setPackingLists] = useState("adequate");
  const [certificatesOfOrigin, setCertificatesOfOrigin] = useState("partial");
  const [valuationSupport, setValuationSupport] = useState("partial");

  // Results State
  const [result, setResult] = useState<AuditRiskResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  const analyzeAuditRisk = useCallback(() => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // Get country risk
      const countryData = countryRiskData.find((c) => c.code === primaryCountry) || countryRiskData[0];
      const volumeTier = volumeTiers[parseInt(importVolume)] || volumeTiers[0];
      const hsDiversity = hsDiversityLevels[parseInt(hsCodeCount)] || hsDiversityLevels[0];

      // Calculate Risk Factors
      const riskFactors: RiskFactorDetail[] = [
        // Company Profile Factors
        {
          category: "Company Profile",
          name: "Import Volume",
          score: volumeTier.score,
          weight: 15,
          weightedScore: volumeTier.score * 0.15,
          status: volumeTier.score >= 60 ? "high" : volumeTier.score >= 30 ? "medium" : "low",
          description: `Annual import value: ${volumeTier.range}`,
          impact: volumeTier.score >= 45 ? "Higher volume increases audit visibility" : "Lower volume reduces audit probability",
          mitigation: "Maintain detailed transaction records for high-volume periods",
        },
        {
          category: "Company Profile",
          name: "HS Code Diversity",
          score: hsDiversity.score,
          weight: 12,
          weightedScore: hsDiversity.score * 0.12,
          status: hsDiversity.score >= 50 ? "high" : hsDiversity.score >= 30 ? "medium" : "low",
          description: `${hsDiversity.count} across product lines`,
          impact: "More HS codes = more classification opportunities for errors",
          mitigation: "Implement HS code review process and regular training",
        },
        {
          category: "Company Profile",
          name: "Country of Origin Risk",
          score: countryData.score,
          weight: 18,
          weightedScore: countryData.score * 0.18,
          status: countryData.score >= 60 ? "high" : countryData.score >= 40 ? "medium" : "low",
          description: `Primary sourcing from ${countryData.name}`,
          impact: countryData.issues.join(", "),
          mitigation: "Enhanced due diligence on origin documentation",
        },
        // Compliance History Factors
        {
          category: "Compliance History",
          name: "Prior Audit History",
          score: parseInt(priorAudits) > 2 ? 70 : parseInt(priorAudits) > 0 ? 40 : 15,
          weight: 20,
          weightedScore: (parseInt(priorAudits) > 2 ? 70 : parseInt(priorAudits) > 0 ? 40 : 15) * 0.20,
          status: parseInt(priorAudits) > 2 ? "high" : parseInt(priorAudits) > 0 ? "medium" : "low",
          description: `${priorAudits} prior audit(s) conducted`,
          impact: "Prior audits with findings increase future audit probability",
          mitigation: "Address all prior findings and document corrective actions",
        },
        {
          category: "Compliance History",
          name: "Penalty History",
          score: penaltyHistory === "major" ? 85 : penaltyHistory === "minor" ? 50 : penaltyHistory === "warning" ? 30 : 10,
          weight: 15,
          weightedScore: (penaltyHistory === "major" ? 85 : penaltyHistory === "minor" ? 50 : penaltyHistory === "warning" ? 30 : 10) * 0.15,
          status: penaltyHistory === "major" ? "critical" : penaltyHistory === "minor" ? "high" : penaltyHistory === "warning" ? "medium" : "low",
          description: `Penalty history: ${penaltyHistory}`,
          impact: "Penalties significantly increase compliance risk score",
          mitigation: "Implement robust compliance program to prevent future penalties",
        },
        // Risk Factor Assessment
        {
          category: "Risk Assessment",
          name: "Valuation Risk",
          score: valuationRisk === "high" ? 75 : valuationRisk === "medium" ? 45 : 20,
          weight: 10,
          weightedScore: (valuationRisk === "high" ? 75 : valuationRisk === "medium" ? 45 : 20) * 0.10,
          status: valuationRisk as "low" | "medium" | "high",
          description: `Valuation complexity: ${valuationRisk}`,
          impact: "Complex valuations attract audit attention",
          mitigation: "Maintain comprehensive valuation records and support",
        },
        {
          category: "Risk Assessment",
          name: "Classification Risk",
          score: classificationRisk === "high" ? 70 : classificationRisk === "medium" ? 40 : 15,
          weight: 8,
          weightedScore: (classificationRisk === "high" ? 70 : classificationRisk === "medium" ? 40 : 15) * 0.08,
          status: classificationRisk as "low" | "medium" | "high",
          description: `Classification complexity: ${classificationRisk}`,
          impact: "Misclassification leads to duty errors",
          mitigation: "Regular classification reviews and binding ruling requests",
        },
        {
          category: "Risk Assessment",
          name: "Origin Risk",
          score: originRisk === "high" ? 65 : originRisk === "medium" ? 40 : 20,
          weight: 10,
          weightedScore: (originRisk === "high" ? 65 : originRisk === "medium" ? 40 : 20) * 0.10,
          status: originRisk as "low" | "medium" | "high",
          description: `Origin verification complexity: ${originRisk}`,
          impact: "FTA claims require robust origin documentation",
          mitigation: "Obtain and maintain certificates of origin for all FTA claims",
        },
        {
          category: "Risk Assessment",
          name: "Duty Relief Programs",
          score: dutyReliefRisk === "high" ? 55 : dutyReliefRisk === "medium" ? 35 : 15,
          weight: 7,
          weightedScore: (dutyReliefRisk === "high" ? 55 : dutyReliefRisk === "medium" ? 35 : 15) * 0.07,
          status: dutyReliefRisk as "low" | "medium" | "high",
          description: `Duty relief complexity: ${dutyReliefRisk}`,
          impact: "Duty deferral programs require strict compliance",
          mitigation: "Regular reconciliation of duty-deferred entries",
        },
        // Special Programs
        {
          category: "Special Programs",
          name: "Related Party Transactions",
          score: relatedPartyTransactions ? 55 : 10,
          weight: 8,
          weightedScore: (relatedPartyTransactions ? 55 : 10) * 0.08,
          status: relatedPartyTransactions ? "medium" : "low",
          description: relatedPartyTransactions ? "Related party imports present" : "No related party imports",
          impact: "Related party pricing requires transfer pricing analysis",
          mitigation: "Maintain transfer pricing documentation and adjustments",
        },
        {
          category: "Special Programs",
          name: "C-TPAT Certification",
          score: cTpaticertified ? -20 : 15,
          weight: 7,
          weightedScore: (cTpaticertified ? -20 : 15) * 0.07,
          status: cTpaticertified ? "low" : "medium",
          description: cTpaticertified ? "C-TPAT certified" : "Not C-TPAT certified",
          impact: "C-TPAT certification reduces audit probability",
          mitigation: "Consider C-TPAT certification for audit risk reduction",
        },
        {
          category: "Special Programs",
          name: "FTA Utilization",
          score: parseInt(ftaUtilization) > 50 ? 45 : parseInt(ftaUtilization) > 20 ? 30 : 15,
          weight: 5,
          weightedScore: (parseInt(ftaUtilization) > 50 ? 45 : parseInt(ftaUtilization) > 20 ? 30 : 15) * 0.05,
          status: parseInt(ftaUtilization) > 50 ? "medium" : "low",
          description: `${ftaUtilization}% of entries claim FTA preference`,
          impact: "High FTA utilization increases origin verification scrutiny",
          mitigation: "Maintain robust origin documentation for all FTA claims",
        },
      ];

      // Calculate overall risk score
      const totalWeightedScore = riskFactors.reduce((sum, f) => sum + f.weightedScore, 0);
      const totalWeight = riskFactors.reduce((sum, f) => sum + f.weight, 0);
      const overallRiskScore = Math.min(100, Math.max(0, Math.round(totalWeightedScore / totalWeight * 100)));

      // Determine risk category
      let riskCategory: "low" | "medium" | "high" | "critical";
      if (overallRiskScore >= 70) riskCategory = "critical";
      else if (overallRiskScore >= 50) riskCategory = "high";
      else if (overallRiskScore >= 30) riskCategory = "medium";
      else riskCategory = "low";

      // Calculate audit probability
      const auditProbability = Math.min(95, Math.max(5,
        overallRiskScore * 0.8 +
        (parseInt(priorAudits) > 0 ? 10 : 0) +
        (penaltyHistory !== "none" ? 15 : 0) -
        (cTpaticertified ? 10 : 0)
      ));

      // Company risk profile
      const companyRiskProfile: CompanyRiskProfile = {
        volumeRisk: volumeTier.score,
        hsCodeDiversityRisk: hsDiversity.score,
        countryRisk: countryData.score,
        complianceHistoryRisk: parseInt(priorAudits) > 0 ? 50 : 20,
        overallProfile: riskCategory === "low" ? "Low Risk" : riskCategory === "medium" ? "Moderate Risk" : riskCategory === "high" ? "Elevated Risk" : "High Risk",
      };

      // Generate recommendations
      const recommendations: Recommendation[] = [
        {
          priority: "high",
          category: "Documentation",
          title: "Strengthen Entry Documentation",
          description: "Ensure all entry documentation is complete, accurate, and readily accessible",
          impact: "High - Reduces audit risk by 15-20%",
          effort: "Medium",
          timeline: "1-2 months",
        },
        {
          priority: "high",
          category: "Classification",
          title: "Implement Classification Review Process",
          description: "Establish regular HS code classification reviews and consider binding ruling requests for ambiguous items",
          impact: "Medium - Reduces classification errors",
          effort: "Medium",
          timeline: "2-3 months",
        },
        {
          priority: relatedPartyTransactions ? "high" : "medium",
          category: "Valuation",
          title: "Document Transfer Pricing",
          description: relatedPartyTransactions ? "Maintain comprehensive transfer pricing documentation and customs valuation adjustments" : "Review valuation methods and support documentation",
          impact: relatedPartyTransactions ? "High - Critical for related party" : "Medium",
          effort: relatedPartyTransactions ? "High" : "Low",
          timeline: relatedPartyTransactions ? "3-6 months" : "1 month",
        },
        {
          priority: parseInt(ftaUtilization) > 30 ? "high" : "medium",
          category: "Origin",
          title: "Enhance Origin Documentation",
          description: "Implement robust origin verification procedures for FTA claims",
          impact: "Medium - Protects FTA benefits",
          effort: "Medium",
          timeline: "1-2 months",
        },
        {
          priority: !cTpaticertified ? "medium" : "low",
          category: "Security",
          title: "C-TPAT Certification",
          description: "Consider C-TPAT certification to reduce audit probability and gain supply chain benefits",
          impact: "Medium - 10-15% audit reduction",
          effort: "High",
          timeline: "6-12 months",
        },
        {
          priority: "medium",
          category: "Compliance",
          title: "Implement Compliance Training",
          description: "Regular training for import staff on classification, valuation, and documentation requirements",
          impact: "Medium - Reduces errors",
          effort: "Low",
          timeline: "Ongoing",
        },
      ];

      // Generate checklist
      const checklist: ChecklistItem[] = [
        {
          id: "1",
          category: "Entry Documentation",
          item: "Entry summaries retained for 5 years",
          status: entryDocumentation === "adequate" ? "complete" : entryDocumentation === "partial" ? "partial" : "missing",
          importance: "critical",
          notes: "19 CFR 163.4(a)(1)(i) requirement",
        },
        {
          id: "2",
          category: "Entry Documentation",
          item: "Commercial invoices with required elements",
          status: commercialInvoices === "adequate" ? "complete" : commercialInvoices === "partial" ? "partial" : "missing",
          importance: "critical",
          notes: "19 CFR 141.86 requirements",
        },
        {
          id: "3",
          category: "Entry Documentation",
          item: "Packing lists available",
          status: packingLists === "adequate" ? "complete" : packingLists === "partial" ? "partial" : "missing",
          importance: "important",
          notes: "Supports quantity verification",
        },
        {
          id: "4",
          category: "Origin Documentation",
          item: "Certificates of Origin for FTA claims",
          status: certificatesOfOrigin === "adequate" ? "complete" : certificatesOfOrigin === "partial" ? "partial" : "missing",
          importance: parseInt(ftaUtilization) > 20 ? "critical" : "important",
          notes: "Required for preferential treatment",
        },
        {
          id: "5",
          category: "Valuation Documentation",
          item: "Transaction value support documentation",
          status: valuationSupport === "adequate" ? "complete" : valuationSupport === "partial" ? "partial" : "missing",
          importance: "critical",
          notes: "19 CFR 152 requirements",
        },
        {
          id: "6",
          category: "Classification",
          item: "HS code classifications documented",
          status: "partial",
          importance: "critical",
          notes: "Include rationale and support",
        },
        {
          id: "7",
          category: "Classification",
          item: "Binding ruling requests for ambiguous items",
          status: "missing",
          importance: "recommended",
          notes: "Protects against classification disputes",
        },
        {
          id: "8",
          category: "Compliance Program",
          item: "Written import compliance procedures",
          status: "partial",
          importance: "critical",
          notes: "Demonstrates reasonable care",
        },
        {
          id: "9",
          category: "Compliance Program",
          item: "Regular compliance audits conducted",
          status: priorAudits !== "0" ? "complete" : "missing",
          importance: "important",
          notes: "Internal audits recommended annually",
        },
        {
          id: "10",
          category: "Compliance Program",
          item: "Staff training records maintained",
          status: "partial",
          importance: "important",
          notes: "Document all compliance training",
        },
      ];

      // Documentation gaps
      const documentationGaps: DocumentationGap[] = [
        {
          document: "Entry Summaries",
          status: entryDocumentation as "missing" | "incomplete" | "outdated" | "adequate",
          risk: entryDocumentation !== "adequate" ? "High - Required for audit defense" : "Low",
          action: entryDocumentation !== "adequate" ? "Organize and index all entry summaries" : "Maintain current practices",
        },
        {
          document: "Commercial Invoices",
          status: commercialInvoices as "missing" | "incomplete" | "outdated" | "adequate",
          risk: commercialInvoices !== "adequate" ? "High - Core valuation support" : "Low",
          action: commercialInvoices !== "adequate" ? "Ensure all required elements are present" : "Maintain current practices",
        },
        {
          document: "Certificates of Origin",
          status: certificatesOfOrigin as "missing" | "incomplete" | "outdated" | "adequate",
          risk: certificatesOfOrigin !== "adequate" && parseInt(ftaUtilization) > 20 ? "High - FTA benefits at risk" : "Medium",
          action: certificatesOfOrigin !== "adequate" ? "Obtain and file COOs for all FTA claims" : "Maintain current practices",
        },
        {
          document: "Valuation Support",
          status: valuationSupport as "missing" | "incomplete" | "outdated" | "adequate",
          risk: valuationSupport !== "adequate" ? "High - Audit red flag" : "Low",
          action: valuationSupport !== "adequate" ? "Compile assists, royalties, buying commissions" : "Maintain current practices",
        },
        {
          document: "Classification Records",
          status: "incomplete",
          risk: "Medium - Common audit focus",
          action: "Document classification rationale for each HS code",
        },
      ];

      // Audit timeline (simulated historical data)
      const auditTimeline: AuditEvent[] = [
        { year: 2020, type: "None", outcome: "N/A", findings: 0, adjustments: 0 },
        { year: 2021, type: "None", outcome: "N/A", findings: 0, adjustments: 0 },
        { year: 2022, type: parseInt(priorAudits) >= 1 ? "Focused Audit" : "None", outcome: parseInt(priorAudits) >= 1 ? "Completed" : "N/A", findings: parseInt(auditFindings) || 0, adjustments: parseInt(auditFindings) * 25000 },
        { year: 2023, type: parseInt(priorAudits) >= 2 ? "Comprehensive Audit" : "None", outcome: parseInt(priorAudits) >= 2 ? "Completed" : "N/A", findings: parseInt(priorAudits) >= 2 ? parseInt(auditFindings) : 0, adjustments: parseInt(priorAudits) >= 2 ? parseInt(auditFindings) * 35000 : 0 },
        { year: 2024, type: overallRiskScore >= 50 ? "Potential Audit" : "Low Risk", outcome: "Pending", findings: 0, adjustments: 0 },
      ];

      // Mitigation strategies
      const mitigationStrategies: MitigationStrategy[] = [
        {
          strategy: "C-TPAT Certification",
          category: "Security",
          currentScore: overallRiskScore,
          targetScore: Math.max(10, overallRiskScore - 15),
          potentialReduction: 15,
          cost: "$5,000 - $15,000",
          difficulty: "Medium",
        },
        {
          strategy: "Classification Review Program",
          category: "Compliance",
          currentScore: overallRiskScore,
          targetScore: Math.max(10, overallRiskScore - 10),
          potentialReduction: 10,
          cost: "$10,000 - $25,000",
          difficulty: "Medium",
        },
        {
          strategy: "Enhanced Documentation",
          category: "Documentation",
          currentScore: overallRiskScore,
          targetScore: Math.max(10, overallRiskScore - 12),
          potentialReduction: 12,
          cost: "$5,000 - $10,000",
          difficulty: "Low",
        },
        {
          strategy: "Third-Party Compliance Audit",
          category: "Compliance",
          currentScore: overallRiskScore,
          targetScore: Math.max(10, overallRiskScore - 8),
          potentialReduction: 8,
          cost: "$15,000 - $50,000",
          difficulty: "Low",
        },
        {
          strategy: "Import Management Software",
          category: "Technology",
          currentScore: overallRiskScore,
          targetScore: Math.max(10, overallRiskScore - 10),
          potentialReduction: 10,
          cost: "$20,000 - $100,000/year",
          difficulty: "High",
        },
      ];

      // Summary counts
      const summary = {
        totalFactors: riskFactors.length,
        lowRiskFactors: riskFactors.filter((f) => f.status === "low").length,
        mediumRiskFactors: riskFactors.filter((f) => f.status === "medium").length,
        highRiskFactors: riskFactors.filter((f) => f.status === "high").length,
        criticalRiskFactors: riskFactors.filter((f) => f.status === "critical").length,
      };

      const auditResult: AuditRiskResult = {
        overallRiskScore,
        riskCategory,
        auditProbability: Math.round(auditProbability),
        riskFactors,
        complianceScore: Math.max(0, 100 - overallRiskScore),
        companyRiskProfile,
        recommendations: recommendations.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }),
        checklist,
        documentationGaps,
        auditTimeline,
        mitigationStrategies,
        summary,
      };

      setResult(auditResult);
      setIsAnalyzing(false);
      setActiveTab("analysis");
    }, 2500);
  }, [primaryCountry, importVolume, hsCodeCount, priorAudits, penaltyHistory, valuationRisk, classificationRisk, originRisk, dutyReliefRisk, relatedPartyTransactions, cTpaticertified, ftaUtilization, entryDocumentation, commercialInvoices, packingLists, certificatesOfOrigin, valuationSupport, auditFindings]);

  const resetForm = useCallback(() => {
    setCompanyName("");
    setImportVolume("3");
    setHsCodeCount("2");
    setPrimaryCountry("CN");
    setPriorAudits("0");
    setAuditFindings("0");
    setPenaltyHistory("none");
    setCorrectionsFiled("0");
    setCtpatCertified(false);
    setAeroCertified(false);
    setValuationRisk("medium");
    setClassificationRisk("medium");
    setOriginRisk("medium");
    setDutyReliefRisk("low");
    setTransferPricingRisk(false);
    setRelatedPartyTransactions(false);
    setFirstSaleAppraisal(false);
    setDutyDrawback(false);
    setFtaUtilization("0");
    setEntryDocumentation("partial");
    setCommercialInvoices("adequate");
    setPackingLists("adequate");
    setCertificatesOfOrigin("partial");
    setValuationSupport("partial");
    setResult(null);
    setActiveTab("calculator");
  }, []);

  const exportResults = useCallback(() => {
    if (!result) return;

    const exportData = {
      companyName,
      analysisDate: new Date().toISOString(),
      riskAssessment: {
        overallRiskScore: result.overallRiskScore,
        riskCategory: result.riskCategory,
        auditProbability: result.auditProbability,
        complianceScore: result.complianceScore,
      },
      riskFactors: result.riskFactors,
      recommendations: result.recommendations,
      mitigationStrategies: result.mitigationStrategies,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-risk-assessment-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result, companyName]);

  const shareResults = useCallback(() => {
    if (!result) return;

    const shareText = `Post-Clearance Audit Risk Assessment
Overall Risk Score: ${result.overallRiskScore} (${result.riskCategory.toUpperCase()})
Audit Probability: ${result.auditProbability}%
Compliance Score: ${result.complianceScore}

Key Risk Factors:
${result.riskFactors.slice(0, 3).map(f => `- ${f.name}: ${f.status.toUpperCase()} (${Math.round(f.score)})`).join("\n")}

Generated using Shiportrade Audit Risk Calculator`;

    if (navigator.share) {
      navigator.share({
        title: "Audit Risk Assessment Results",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Results copied to clipboard!");
    }
  }, [result]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return COLORS.low;
      case "medium":
        return COLORS.medium;
      case "high":
        return COLORS.high;
      case "critical":
        return COLORS.critical;
      default:
        return "#94a3b8";
    }
  };

  // Chart data computations
  const radarData = useMemo(() => {
    if (!result?.riskFactors) return [];
    return result.riskFactors.reduce((acc: { category: string; score: number; fullMark: number }[], factor) => {
      const existing = acc.find((item) => item.category === factor.category);
      if (existing) {
        existing.score = (existing.score + factor.score) / 2;
      } else {
        acc.push({
          category: factor.category,
          score: factor.score,
          fullMark: 100,
        });
      }
      return acc;
    }, []);
  }, [result]);

  const factorBreakdownData = useMemo(() => {
    if (!result?.riskFactors) return [];
    return result.riskFactors.map((f) => ({
      name: f.name.length > 15 ? f.name.substring(0, 15) + "..." : f.name,
      score: f.score,
      weight: f.weight,
      weightedScore: Math.round(f.weightedScore),
    }));
  }, [result]);

  const pieChartData = useMemo(() => {
    if (!result?.summary) return [];
    return [
      { name: "Low Risk", value: result.summary.lowRiskFactors, color: COLORS.low },
      { name: "Medium Risk", value: result.summary.mediumRiskFactors, color: COLORS.medium },
      { name: "High Risk", value: result.summary.highRiskFactors, color: COLORS.high },
      { name: "Critical", value: result.summary.criticalRiskFactors, color: COLORS.critical },
    ];
  }, [result]);

  const complianceAreaData = useMemo(() => {
    if (!result?.riskFactors) return [];
    const categories = result.riskFactors.reduce((acc: Record<string, { total: number; count: number }>, f) => {
      if (!acc[f.category]) {
        acc[f.category] = { total: 0, count: 0 };
      }
      acc[f.category].total += f.score;
      acc[f.category].count += 1;
      return acc;
    }, {});

    return Object.entries(categories).map(([name, data]) => ({
      name: name.length > 12 ? name.substring(0, 12) + "..." : name,
      score: Math.round(data.total / data.count),
      fill: BRAND_COLORS.ocean,
    }));
  }, [result]);

  const auditProbabilityData = [
    { name: "Low Risk", probability: 8, fill: COLORS.low },
    { name: "Medium Risk", probability: 25, fill: COLORS.medium },
    { name: "High Risk", probability: 50, fill: COLORS.high },
    { name: "Critical Risk", probability: 75, fill: COLORS.critical },
    { name: "Your Risk", probability: result?.auditProbability || 0, fill: BRAND_COLORS.ocean },
  ];

  // Gauge chart data
  const gaugeData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Risk", value: result.overallRiskScore, fill: getRiskColor(result.riskCategory) },
    ];
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border border-border/50"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <AnimatedBadge delay={0}>
                <ShieldCheck className="h-3 w-3 mr-1" />
                Customs Compliance
              </AnimatedBadge>
              <AnimatedBadge delay={0.1}>
                <AlertTriangle className="h-3 w-3 mr-1" />
                Audit Risk
              </AnimatedBadge>
              <AnimatedBadge delay={0.2}>
                <Scale className="h-3 w-3 mr-1" />
                Trade Compliance
              </AnimatedBadge>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[var(--ocean)]">Post-Clearance Audit Risk Calculator</h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Comprehensive assessment tool to evaluate your customs audit risk profile, identify compliance gaps,
                and develop mitigation strategies to protect your business.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportResults}
                disabled={!result}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareResults}
                disabled={!result}
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-shrink-0"
            >
              <Card
                className="text-white min-w-[200px]"
                style={{ background: `linear-gradient(135deg, ${getRiskColor(result.riskCategory)}, ${getRiskColor(result.riskCategory)}dd)` }}
              >
                <CardContent className="pt-6">
                  <div className="text-center">
                    <ShieldCheck className="h-10 w-10 mx-auto mb-2 opacity-80" />
                    <p className="text-4xl font-bold">{result.overallRiskScore}</p>
                    <p className="text-sm opacity-80 mt-1">Risk Score</p>
                    <Badge className="mt-2 bg-white/20 text-white uppercase">
                      {result.riskCategory}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Risk Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="mitigation" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Mitigation</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Company Profile Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Building2 className="h-5 w-5" />
                  Company Profile
                </CardTitle>
                <CardDescription>
                  Enter your company&apos;s import profile to assess audit risk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                      Annual Import Value
                    </Label>
                    <Select value={importVolume} onValueChange={setImportVolume}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {volumeTiers.map((tier, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {tier.range} - {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-[#2E8B57]" />
                      HS Code Diversity
                    </Label>
                    <Select value={hsCodeCount} onValueChange={setHsCodeCount}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hsDiversityLevels.map((level, idx) => (
                          <SelectItem key={idx} value={idx.toString()}>
                            {level.count} - {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#2E8B57]" />
                      Primary Source Country
                    </Label>
                    <Select value={primaryCountry} onValueChange={setPrimaryCountry}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryRiskData.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.name} ({country.riskLevel} Risk)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance History Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <FileSearch className="h-5 w-5" />
                  Compliance History
                </CardTitle>
                <CardDescription>
                  Your compliance track record significantly impacts audit probability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#2E8B57]" />
                      Prior Audits (5 Years)
                    </Label>
                    <Select value={priorAudits} onValueChange={setPriorAudits}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 - No prior audits</SelectItem>
                        <SelectItem value="1">1 - Single audit</SelectItem>
                        <SelectItem value="2">2 - Multiple audits</SelectItem>
                        <SelectItem value="3">3+ - Frequent audits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Penalty History</Label>
                    <Select value={penaltyHistory} onValueChange={setPenaltyHistory}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None - Clean record</SelectItem>
                        <SelectItem value="warning">Warning letters only</SelectItem>
                        <SelectItem value="minor">Minor penalties</SelectItem>
                        <SelectItem value="major">Major penalties</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div>
                      <p className="font-medium text-sm">C-TPAT Certified</p>
                    </div>
                    <Switch checked={cTpaticertified} onCheckedChange={setCtpatCertified} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div>
                      <p className="font-medium text-sm">AEO Certified</p>
                    </div>
                    <Switch checked={aeroCertified} onCheckedChange={setAeroCertified} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Factor Assessment */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <AlertTriangle className="h-5 w-5" />
                  Risk Factor Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valuation Risk</Label>
                    <Select value={valuationRisk} onValueChange={setValuationRisk}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Standard</SelectItem>
                        <SelectItem value="medium">Medium - Some complexity</SelectItem>
                        <SelectItem value="high">High - Complex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Classification Risk</Label>
                    <Select value={classificationRisk} onValueChange={setClassificationRisk}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Simple products</SelectItem>
                        <SelectItem value="medium">Medium - Mixed</SelectItem>
                        <SelectItem value="high">High - Complex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Origin Risk</Label>
                    <Select value={originRisk} onValueChange={setOriginRisk}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Single origin</SelectItem>
                        <SelectItem value="medium">Medium - Multi-country</SelectItem>
                        <SelectItem value="high">High - Complex chain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Duty Relief Programs</Label>
                    <Select value={dutyReliefRisk} onValueChange={setDutyReliefRisk}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - None</SelectItem>
                        <SelectItem value="medium">Medium - FTZ/Bonded</SelectItem>
                        <SelectItem value="high">High - Drawback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Related Party Transactions</Label>
                    <Switch checked={relatedPartyTransactions} onCheckedChange={setRelatedPartyTransactions} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">FTA Utilization: {ftaUtilization}%</Label>
                    <Slider
                      value={[parseInt(ftaUtilization)]}
                      onValueChange={(v) => setFtaUtilization(v[0].toString())}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation Assessment */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <FileCheck className="h-5 w-5" />
                  Documentation Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Entry Documentation</Label>
                    <Select value={entryDocumentation} onValueChange={setEntryDocumentation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adequate">Adequate</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Commercial Invoices</Label>
                    <Select value={commercialInvoices} onValueChange={setCommercialInvoices}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adequate">Adequate</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Certificates of Origin</Label>
                    <Select value={certificatesOfOrigin} onValueChange={setCertificatesOfOrigin}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adequate">Adequate</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valuation Support</Label>
                    <Select value={valuationSupport} onValueChange={setValuationSupport}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adequate">Adequate</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="missing">Missing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analyze Button */}
          <Card className="border-0 shadow-lg">
            <CardContent className="py-8">
              <div className="text-center">
                <Button
                  onClick={analyzeAuditRisk}
                  disabled={isAnalyzing}
                  className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 h-12"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Audit Risk...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Analyze Audit Risk
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground mt-3">
                  Complete all sections above and click to generate your comprehensive risk assessment
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Risk Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          {!result ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <Target className="h-16 w-16 text-[#0F4C81] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No Analysis Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete the calculator inputs and run the analysis to view your risk assessment.
                  </p>
                  <Button onClick={() => setActiveTab("calculator")} variant="outline">
                    Go to Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Risk Score Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card
                  className="text-white col-span-2"
                  style={{ background: `linear-gradient(135deg, ${getRiskColor(result.riskCategory)}, ${getRiskColor(result.riskCategory)}dd)` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <ShieldCheck className="h-8 w-8 opacity-80" />
                      <Badge className="bg-white/20 text-white uppercase">{result.riskCategory}</Badge>
                    </div>
                    <p className="text-4xl font-bold">{result.overallRiskScore}</p>
                    <p className="text-sm opacity-80 mt-1">Overall Risk Score</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
                  <CardContent className="pt-6">
                    <Target className="h-6 w-6 opacity-80 mb-2" />
                    <p className="text-2xl font-bold">{result.auditProbability}%</p>
                    <p className="text-xs opacity-80">Audit Probability</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
                  <CardContent className="pt-6">
                    <Award className="h-6 w-6 opacity-80 mb-2" />
                    <p className="text-2xl font-bold">{result.complianceScore}</p>
                    <p className="text-xs opacity-80">Compliance Score</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <CardContent className="pt-6">
                    <AlertTriangle className="h-6 w-6 opacity-80 mb-2" />
                    <p className="text-2xl font-bold">{result.summary.highRiskFactors + result.summary.criticalRiskFactors}</p>
                    <p className="text-xs opacity-80">High/Critical Factors</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <ListChecks className="h-6 w-6 opacity-80 mb-2" />
                    <p className="text-2xl font-bold">{result.checklist.filter(c => c.status !== "complete").length}</p>
                    <p className="text-xs opacity-80">Checklist Gaps</p>
                  </CardContent>
                </Card>
              </div>

              {/* Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart - Risk Factor Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                      <PieChartIcon className="h-5 w-5" />
                      Risk Factor Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Bar Chart - Compliance Area Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                      <BarChart3 className="h-5 w-5" />
                      Compliance Area Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={complianceAreaData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]} fill="#0F4C81" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Gauge Chart - Overall Risk Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                      <Target className="h-5 w-5" />
                      Overall Risk Gauge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex flex-col items-center justify-center">
                      <div className="relative w-48 h-24 overflow-hidden">
                        <div className="absolute inset-0">
                          <svg viewBox="0 0 200 100" className="w-full h-full">
                            {/* Background arc */}
                            <path
                              d="M 20 100 A 80 80 0 0 1 180 100"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="16"
                              className="text-slate-200 dark:text-slate-700"
                            />
                            {/* Colored arc */}
                            <path
                              d="M 20 100 A 80 80 0 0 1 180 100"
                              fill="none"
                              stroke={getRiskColor(result.riskCategory)}
                              strokeWidth="16"
                              strokeDasharray={`${result.overallRiskScore * 2.51} 251`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
                          <span className="text-4xl font-bold" style={{ color: getRiskColor(result.riskCategory) }}>
                            {result.overallRiskScore}
                          </span>
                        </div>
                      </div>
                      <Badge
                        className="mt-4 uppercase"
                        style={{ backgroundColor: getRiskColor(result.riskCategory), color: "white" }}
                      >
                        {result.riskCategory} Risk
                      </Badge>
                      <div className="flex justify-between w-48 mt-4 text-xs text-muted-foreground">
                        <span>Low (0-29)</span>
                        <span>High (50-69)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Radar Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                      <PieChartIcon className="h-5 w-5" />
                      Risk Factor Radar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Risk Score"
                            dataKey="score"
                            stroke="#0F4C81"
                            fill="#0F4C81"
                            fillOpacity={0.5}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                      <BarChart3 className="h-5 w-5" />
                      Factor Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={factorBreakdownData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                            {factorBreakdownData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.score >= 70
                                    ? COLORS.critical
                                    : entry.score >= 50
                                    ? COLORS.high
                                    : entry.score >= 30
                                    ? COLORS.medium
                                    : COLORS.low
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Factor Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Factor Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {result.riskFactors.map((factor, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          factor.status === "low"
                            ? "border-l-[#2E8B57] bg-green-50 dark:bg-green-900/20"
                            : factor.status === "medium"
                            ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : factor.status === "high"
                            ? "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                            : "border-l-red-800 bg-red-100 dark:bg-red-900/30"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="outline" className="mb-1">{factor.category}</Badge>
                            <h5 className="font-semibold">{factor.name}</h5>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold" style={{ color: getRiskColor(factor.status) }}>
                              {Math.round(factor.score)}
                            </span>
                            <p className="text-xs text-muted-foreground">Weight: {factor.weight}%</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{factor.description}</p>
                        <div className="flex gap-4 text-xs">
                          <div>
                            <span className="font-medium">Impact:</span> {factor.impact}
                          </div>
                          <div>
                            <span className="font-medium">Mitigation:</span> {factor.mitigation}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Tab 3: Mitigation */}
        <TabsContent value="mitigation" className="space-y-6">
          {!result ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <ShieldCheck className="h-16 w-16 text-[#0F4C81] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Run Analysis First</h3>
                  <p className="text-muted-foreground mb-6">
                    Complete the calculator to receive personalized mitigation strategies.
                  </p>
                  <Button onClick={() => setActiveTab("calculator")} variant="outline">
                    Go to Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                    <ArrowRight className="h-5 w-5" />
                    Prioritized Mitigation Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.recommendations.slice(0, 6).map((rec, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                          rec.priority === "high" ? "bg-red-500" : rec.priority === "medium" ? "bg-amber-500" : "bg-[#2E8B57]"
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold">{rec.title}</h5>
                            <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Impact: {rec.impact}</span>
                            <span>Effort: {rec.effort}</span>
                            <span>Timeline: {rec.timeline}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mitigation Strategies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                    <TrendingUp className="h-5 w-5" />
                    Mitigation Strategy Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.mitigationStrategies.map((strategy, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-semibold">{strategy.strategy}</h5>
                          <Badge>{strategy.category}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current Score:</span>
                            <span className="font-medium">{strategy.currentScore}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Target Score:</span>
                            <span className="font-medium text-[#2E8B57]">{strategy.targetScore}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Potential Reduction:</span>
                            <span className="font-medium text-[#0F4C81]">-{strategy.potentialReduction}%</span>
                          </div>
                          <Progress value={((strategy.currentScore - strategy.targetScore) / strategy.currentScore) * 100} className="h-2 mt-2" />
                          <div className="pt-2 border-t text-xs text-muted-foreground">
                            <p>Cost: {strategy.cost} | Difficulty: {strategy.difficulty}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                    <ListChecks className="h-5 w-5" />
                    Compliance Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.checklist.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        {item.status === "complete" ? (
                          <CheckCircle className="h-5 w-5 text-[#2E8B57]" />
                        ) : item.status === "partial" ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{item.item}</p>
                            <Badge variant={item.importance === "critical" ? "destructive" : "secondary"} className="text-xs">
                              {item.importance}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.notes}</p>
                        </div>
                        <Badge variant={item.status === "complete" ? "default" : "outline"}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pro Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                    <Lightbulb className="h-5 w-5" />
                    Pro Tips for Audit Preparedness
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: FileText, tip: "Document Everything", description: "Maintain detailed records of all classification decisions, valuation methodologies, and origin claims." },
                      { icon: Users, tip: "Train Your Team", description: "Conduct regular compliance training for all staff involved in import operations." },
                      { icon: Clock, tip: "Regular Internal Audits", description: "Perform internal compliance audits at least annually to identify and correct issues proactively." },
                      { icon: ShieldCheck, tip: "Seek Binding Rulings", description: "Request binding rulings for ambiguous classifications to protect against disputes." },
                      { icon: Zap, tip: "Implement Technology", description: "Use import management software to automate compliance checks and maintain audit trails." },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <item.icon className="h-5 w-5 text-[#2E8B57] flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-sm">{item.tip}</h5>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Common Mistakes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                    <MistakeIcon className="h-5 w-5" />
                    Common Mistakes to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Incomplete Record Keeping", description: "Failing to maintain all required documentation for the full 5-year retention period can result in penalties and adverse assumptions during audits." },
                      { title: "Neglecting Transfer Pricing", description: "For related-party transactions, not properly documenting transfer pricing adjustments for customs purposes is a common audit finding." },
                      { title: "Overlooking Origin Documentation", description: "Claiming FTA preferences without maintaining proper certificates of origin and supporting documentation exposes the company to significant duty liability." },
                      { title: "Classification Complacency", description: "Relying on outdated or unverified HS codes without regular review can lead to systematic errors that compound over multiple entries." },
                      { title: "Ignoring Prior Findings", description: "Failing to address and correct issues identified in previous audits demonstrates lack of reasonable care and increases future audit probability." },
                    ].map((mistake, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-sm">{mistake.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1">{mistake.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#0F4C81]">Understanding Post-Clearance Audits</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Post-clearance audits (PCAs) represent a critical component of modern customs administration, shifting compliance verification from the border to the importer&apos;s premises. Unlike traditional pre-clearance inspections that occur at ports of entry, PCAs allow customs authorities to conduct thorough examinations of import records, internal controls, and compliance systems after goods have been released. This approach recognizes that most legitimate trade should flow freely while enabling authorities to focus resources on higher-risk traders identified through sophisticated risk assessment algorithms. For importers, understanding the PCA process is essential for maintaining compliance, avoiding penalties, and protecting business interests. PCAs typically examine the accuracy of declared values, correct classification of goods under the Harmonized Tariff System, validity of origin claims for preferential duty treatment, proper use of duty deferral programs, and adherence to all regulatory requirements. Companies selected for audits should respond professionally and transparently, as the audit outcome can significantly impact future trade operations and customs relationship.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#0F4C81]">Common Audit Triggers</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Customs authorities employ sophisticated risk-based targeting systems to identify importers for post-clearance audits. Understanding these triggers can help companies assess their own risk profile and take proactive measures. High import volumes automatically elevate a company&apos;s profile, as the sheer number of transactions increases both revenue at stake and the statistical likelihood of errors. Imports from countries associated with compliance risks—such as China for AD/CVD concerns, transshipment hubs for origin fraud, or regions with intellectual property issues—attract additional scrutiny. Complex supply chains involving multiple processing countries create origin verification challenges that customs authorities often target. Related-party transactions trigger valuation concerns, as transfer pricing between affiliates may not reflect fair market value for customs purposes. High utilization of free trade agreement preferences signals potential origin verification needs. Previous audit findings or penalties create compliance history that influences future selection probability. Industry-specific risks, such as products subject to frequent classification disputes or those covered by trade remedies, can also increase audit likelihood. Companies should regularly assess these factors in their own operations and address any areas of vulnerability before they become audit issues.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#0F4C81]">Preparing for an Audit</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Effective preparation for a post-clearance audit begins long before any audit notice is received. Companies should establish a comprehensive import compliance program with clearly documented policies and procedures governing all aspects of the import process. This program should address classification practices, valuation methodologies, origin determination and documentation, duty deferral program management, and record-keeping requirements. Regular internal audits, ideally conducted annually by qualified professionals, help identify compliance gaps before they become significant issues. Document management systems should ensure that all required records are maintained for the full retention period—typically five years from the date of entry—and can be readily retrieved in response to audit requests. Staff training programs should keep all personnel involved in import operations current on regulatory requirements and company procedures. For companies with complex transactions, obtaining binding rulings from customs authorities provides certainty and protection against future disputes. When an audit notice is received, designate a single point of contact to coordinate all communications with customs, gather requested documents promptly and completely, and consider engaging experienced customs counsel for complex matters. Demonstrating a commitment to compliance and cooperation throughout the audit process can positively influence outcomes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#0F4C81]">Best Practices for Compliance</CardTitle>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Establishing and maintaining robust customs compliance practices protects companies from audit risks while improving operational efficiency. The foundation of good compliance is a documented import compliance manual that covers all aspects of the import process, from pre-import planning through post-entry reconciliation. This manual should be regularly reviewed and updated to reflect regulatory changes and operational developments. Classification management requires maintaining documented rationale for each HS code used, requesting binding rulings for ambiguous products, and conducting periodic reviews to ensure continued accuracy. Valuation compliance demands careful attention to transaction value elements, including assists, royalties, buying commissions, and related-party pricing adjustments. Origin management for FTA preferences requires obtaining and maintaining proper certificates, understanding product-specific rules of origin, and verifying supplier claims rather than accepting them uncritically. Record-keeping systems should be designed with audit readiness in mind, ensuring documents are organized, accessible, and retained for the required period. Staff training should be ongoing, not just a one-time onboarding activity, with records maintained of all training provided. Finally, companies should consider participating in trusted trader programs like C-TPAT, which provide benefits including reduced audit frequency while demonstrating commitment to compliance excellence.
              </p>
            </CardContent>
          </Card>

          {/* Reference Tables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0F4C81]">Country Risk Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Country</th>
                      <th className="text-left p-3">Risk Level</th>
                      <th className="text-left p-3">Risk Score</th>
                      <th className="text-left p-3">Key Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryRiskData.slice(0, 10).map((country, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-3 font-medium">{country.name}</td>
                        <td className="p-3">
                          <Badge variant={country.score >= 60 ? "destructive" : country.score >= 40 ? "secondary" : "default"}>
                            {country.riskLevel}
                          </Badge>
                        </td>
                        <td className="p-3">{country.score}</td>
                        <td className="p-3 text-muted-foreground text-xs">{country.issues.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-[#0F4C81]">Frequently Asked Questions</CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about post-clearance audits and customs compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-semibold text-[#0F4C81] hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
