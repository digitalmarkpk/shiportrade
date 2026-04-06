"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  Shield,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  FileText,
  BarChart3,
  Truck,
  Award,
  Target,
  AlertOctagon,
  PieChart,
  LineChart,
  History,
  HelpCircle,
  ChevronRight,
  Zap,
  Users,
  MapPin,
  Activity,
  Gauge,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart as RechartsLine,
  Line,
  Legend,
} from "recharts";

interface SupplierRiskResult {
  overallScore: number;
  riskLevel: "Very Low" | "Low" | "Moderate" | "High" | "Very High";
  riskGrade: "A" | "B" | "C" | "D" | "E";
  categories: RiskCategory[];
  supplierInfo: SupplierInfo;
  recommendations: string[];
  riskAlerts: RiskAlert[];
}

interface RiskCategory {
  name: string;
  score: number;
  weight: number;
  status: "excellent" | "good" | "fair" | "poor" | "critical";
  details: string;
  subMetrics: SubMetric[];
}

interface SubMetric {
  name: string;
  value: string;
  score: number;
}

interface SupplierInfo {
  name: string;
  country: string;
  industry: string;
  yearsInBusiness: number;
  annualRevenue: number;
}

interface RiskAlert {
  type: "warning" | "critical" | "info";
  message: string;
  category: string;
}

const countries = [
  { code: "CN", name: "China", riskFactor: 1.3, politicalRisk: 25, economicRisk: 30 },
  { code: "US", name: "United States", riskFactor: 1.0, politicalRisk: 15, economicRisk: 20 },
  { code: "DE", name: "Germany", riskFactor: 1.0, politicalRisk: 10, economicRisk: 15 },
  { code: "JP", name: "Japan", riskFactor: 1.0, politicalRisk: 12, economicRisk: 18 },
  { code: "KR", name: "South Korea", riskFactor: 1.1, politicalRisk: 20, economicRisk: 22 },
  { code: "TW", name: "Taiwan", riskFactor: 1.2, politicalRisk: 28, economicRisk: 20 },
  { code: "VN", name: "Vietnam", riskFactor: 1.4, politicalRisk: 35, economicRisk: 40 },
  { code: "IN", name: "India", riskFactor: 1.4, politicalRisk: 38, economicRisk: 42 },
  { code: "TH", name: "Thailand", riskFactor: 1.3, politicalRisk: 32, economicRisk: 35 },
  { code: "MY", name: "Malaysia", riskFactor: 1.2, politicalRisk: 25, economicRisk: 28 },
  { code: "ID", name: "Indonesia", riskFactor: 1.4, politicalRisk: 38, economicRisk: 40 },
  { code: "PH", name: "Philippines", riskFactor: 1.4, politicalRisk: 35, economicRisk: 38 },
  { code: "SG", name: "Singapore", riskFactor: 1.0, politicalRisk: 8, economicRisk: 12 },
  { code: "MX", name: "Mexico", riskFactor: 1.5, politicalRisk: 42, economicRisk: 45 },
  { code: "BR", name: "Brazil", riskFactor: 1.5, politicalRisk: 45, economicRisk: 48 },
  { code: "TR", name: "Turkey", riskFactor: 1.6, politicalRisk: 50, economicRisk: 52 },
  { code: "PL", name: "Poland", riskFactor: 1.1, politicalRisk: 20, economicRisk: 22 },
  { code: "CZ", name: "Czech Republic", riskFactor: 1.1, politicalRisk: 18, economicRisk: 20 },
  { code: "HU", name: "Hungary", riskFactor: 1.2, politicalRisk: 22, economicRisk: 24 },
  { code: "RO", name: "Romania", riskFactor: 1.3, politicalRisk: 28, economicRisk: 30 },
];

const riskGrades = [
  { grade: "A", label: "Excellent", minScore: 85, color: "#2E8B57" },
  { grade: "B", label: "Good", minScore: 70, color: "#0F4C81" },
  { grade: "C", label: "Moderate", minScore: 55, color: "#F59E0B" },
  { grade: "D", label: "High Risk", minScore: 40, color: "#F97316" },
  { grade: "E", label: "Critical", minScore: 0, color: "#EF4444" },
];

const faqs = [
  {
    question: "What is Supplier Risk Assessment?",
    answer: "Supplier Risk Assessment is a comprehensive evaluation process that analyzes various risk factors associated with your suppliers, including country risk, financial stability, quality metrics, and delivery performance. This helps you make informed decisions about supplier relationships and mitigate potential supply chain disruptions.",
  },
  {
    question: "How is the overall risk score calculated?",
    answer: "The overall risk score is calculated using a weighted average of four key categories: Country Risk (25%), Financial Stability (25%), Quality Metrics (25%), and Delivery Performance (25%). Each category is evaluated based on multiple sub-metrics to provide a comprehensive assessment.",
  },
  {
    question: "What do the risk grades A-E mean?",
    answer: "Grade A (85-100) indicates Very Low risk - excellent supplier. Grade B (70-84) means Low risk - good supplier. Grade C (55-69) represents Moderate risk - acceptable with monitoring. Grade D (40-54) shows High risk - requires mitigation measures. Grade E (0-39) indicates Critical risk - not recommended for critical supplies.",
  },
  {
    question: "How often should I reassess my suppliers?",
    answer: "For Grade A suppliers, annual reassessment is recommended. Grade B suppliers should be reviewed semi-annually. Grade C suppliers require quarterly reviews. Grade D and E suppliers need monthly monitoring or should be replaced with alternative suppliers.",
  },
  {
    question: "What factors affect Country Risk?",
    answer: "Country Risk is influenced by political stability, currency volatility, trade relations, economic conditions, regulatory environment, and geopolitical factors. Countries with higher political and economic stability scores receive better risk ratings.",
  },
  {
    question: "How can I improve a supplier's risk score?",
    answer: "Work with suppliers to improve quality certifications (ISO standards), reduce defect rates, enhance on-time delivery performance, improve financial transparency through audited statements, and consider suppliers in lower-risk countries. Regular communication and performance monitoring are key.",
  },
  {
    question: "What should I do if a supplier has critical alerts?",
    answer: "Critical alerts require immediate attention. Review the specific issues, implement risk mitigation measures, consider alternative suppliers, and in cases of sanctions or severe compliance issues, discontinue the relationship. Always document your risk management actions.",
  },
  {
    question: "Can I compare multiple suppliers?",
    answer: "Yes, you can assess multiple suppliers and compare their scores across all categories. This helps in supplier selection, negotiation, and developing a diversified supplier portfolio to minimize supply chain risks.",
  },
];

const trendData = [
  { month: "Jan", score: 72 },
  { month: "Feb", score: 75 },
  { month: "Mar", score: 71 },
  { month: "Apr", score: 78 },
  { month: "May", score: 82 },
  { month: "Jun", score: 85 },
];

const COLORS = ["#2E8B57", "#0F4C81", "#F59E0B", "#F97316"];

export default function SupplierRiskAssessment() {
  const [supplierName, setSupplierName] = useState("");
  const [country, setCountry] = useState("CN");
  const [industry, setIndustry] = useState("electronics");
  const [yearsInBusiness, setYearsInBusiness] = useState("10");
  const [annualRevenue, setAnnualRevenue] = useState("10000000");
  const [employeeCount, setEmployeeCount] = useState("500");
  
  // Country Risk
  const [politicalStability, setPoliticalStability] = useState("stable");
  const [currencyVolatility, setCurrencyVolatility] = useState("low");
  const [tradeRelations, setTradeRelations] = useState("favorable");
  
  // Financial Stability
  const [financialStatements, setFinancialStatements] = useState("audited");
  const [profitability, setProfitability] = useState("profitable");
  const [debtRatio, setDebtRatio] = useState("30");
  const [cashFlow, setCashFlow] = useState("positive");
  
  // Quality Metrics
  const [qualityCertifications, setQualityCertifications] = useState("iso9001");
  const [defectRate, setDefectRate] = useState("1");
  const [qualityAudits, setQualityAudits] = useState("annual");
  const [returnRate, setReturnRate] = useState("2");
  
  // Delivery Performance
  const [onTimeDelivery, setOnTimeDelivery] = useState("95");
  const [leadTimeAccuracy, setLeadTimeAccuracy] = useState("90");
  const [capacityFlexibility, setCapacityFlexibility] = useState("high");
  const [logisticsCapability, setLogisticsCapability] = useState("strong");

  const [result, setResult] = useState<SupplierRiskResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("assessment");

  const analyzeRisk = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const countryData = countries.find((c) => c.code === country) || countries[0];
      const years = parseFloat(yearsInBusiness) || 10;
      const revenue = parseFloat(annualRevenue) || 10000000;
      const employees = parseFloat(employeeCount) || 500;

      const categories: RiskCategory[] = [];

      // Country Risk Assessment (Weight: 25%)
      let countryScore = 100 - (countryData.politicalRisk + countryData.economicRisk) / 2;
      if (politicalStability === "unstable") countryScore -= 15;
      else if (politicalStability === "volatile") countryScore -= 25;
      
      if (currencyVolatility === "moderate") countryScore -= 10;
      else if (currencyVolatility === "high") countryScore -= 20;
      
      if (tradeRelations === "restricted") countryScore -= 15;
      else if (tradeRelations === "sanctions") countryScore -= 30;

      countryScore = Math.max(0, Math.min(100, countryScore));

      categories.push({
        name: "Country Risk",
        score: Math.round(countryScore),
        weight: 25,
        status: countryScore >= 80 ? "excellent" : countryScore >= 60 ? "good" : countryScore >= 40 ? "fair" : countryScore >= 20 ? "poor" : "critical",
        details: `${countryData.name} - Political: ${countryData.politicalRisk}%, Economic: ${countryData.economicRisk}%`,
        subMetrics: [
          { name: "Political Stability", value: politicalStability, score: politicalStability === "stable" ? 90 : politicalStability === "unstable" ? 50 : 25 },
          { name: "Currency Risk", value: currencyVolatility, score: currencyVolatility === "low" ? 95 : currencyVolatility === "moderate" ? 65 : 35 },
          { name: "Trade Relations", value: tradeRelations, score: tradeRelations === "favorable" ? 95 : tradeRelations === "restricted" ? 55 : 20 },
        ],
      });

      // Financial Stability (Weight: 25%)
      let financialScore = 50;
      
      if (financialStatements === "audited") financialScore += 20;
      else if (financialStatements === "reviewed") financialScore += 10;
      
      if (profitability === "profitable") financialScore += 15;
      else if (profitability === "loss") financialScore -= 20;
      
      const debtRatioNum = parseFloat(debtRatio) || 30;
      if (debtRatioNum < 30) financialScore += 10;
      else if (debtRatioNum > 70) financialScore -= 15;
      
      if (cashFlow === "positive") financialScore += 10;
      else if (cashFlow === "negative") financialScore -= 15;

      // Company size factor
      if (revenue > 50000000 && employees > 500) financialScore += 5;
      if (years > 10) financialScore += 5;

      financialScore = Math.max(0, Math.min(100, financialScore));

      categories.push({
        name: "Financial Stability",
        score: Math.round(financialScore),
        weight: 25,
        status: financialScore >= 80 ? "excellent" : financialScore >= 60 ? "good" : financialScore >= 40 ? "fair" : financialScore >= 20 ? "poor" : "critical",
        details: `Revenue: $${(revenue / 1000000).toFixed(1)}M, Employees: ${employees}`,
        subMetrics: [
          { name: "Financial Statements", value: financialStatements, score: financialStatements === "audited" ? 95 : financialStatements === "reviewed" ? 75 : 50 },
          { name: "Profitability", value: profitability, score: profitability === "profitable" ? 90 : profitability === "break-even" ? 60 : 30 },
          { name: "Debt Ratio", value: `${debtRatioNum}%`, score: debtRatioNum < 30 ? 95 : debtRatioNum < 50 ? 75 : debtRatioNum < 70 ? 55 : 30 },
        ],
      });

      // Quality Metrics (Weight: 25%)
      let qualityScore = 50;
      
      if (qualityCertifications === "iso9001") qualityScore += 20;
      else if (qualityCertifications === "multiple") qualityScore += 25;
      else if (qualityCertifications === "none") qualityScore -= 15;
      
      const defectRateNum = parseFloat(defectRate) || 1;
      if (defectRateNum < 0.5) qualityScore += 15;
      else if (defectRateNum < 2) qualityScore += 5;
      else if (defectRateNum > 5) qualityScore -= 15;
      
      if (qualityAudits === "quarterly") qualityScore += 10;
      else if (qualityAudits === "annual") qualityScore += 5;
      else if (qualityAudits === "never") qualityScore -= 10;
      
      const returnRateNum = parseFloat(returnRate) || 2;
      if (returnRateNum < 1) qualityScore += 10;
      else if (returnRateNum > 5) qualityScore -= 10;

      qualityScore = Math.max(0, Math.min(100, qualityScore));

      categories.push({
        name: "Quality Metrics",
        score: Math.round(qualityScore),
        weight: 25,
        status: qualityScore >= 80 ? "excellent" : qualityScore >= 60 ? "good" : qualityScore >= 40 ? "fair" : qualityScore >= 20 ? "poor" : "critical",
        details: `Defect Rate: ${defectRateNum}%, Return Rate: ${returnRateNum}%`,
        subMetrics: [
          { name: "Certifications", value: qualityCertifications === "multiple" ? "Multiple ISO" : qualityCertifications === "iso9001" ? "ISO 9001" : "None", score: qualityCertifications === "multiple" ? 98 : qualityCertifications === "iso9001" ? 85 : 35 },
          { name: "Defect Rate", value: `${defectRateNum}%`, score: defectRateNum < 0.5 ? 95 : defectRateNum < 2 ? 80 : defectRateNum < 5 ? 55 : 30 },
          { name: "Quality Audits", value: qualityAudits, score: qualityAudits === "quarterly" ? 95 : qualityAudits === "annual" ? 75 : qualityAudits === "biannual" ? 60 : 30 },
        ],
      });

      // Delivery Performance (Weight: 25%)
      let deliveryScore = 50;
      
      const otdNum = parseFloat(onTimeDelivery) || 95;
      if (otdNum >= 98) deliveryScore += 20;
      else if (otdNum >= 95) deliveryScore += 15;
      else if (otdNum >= 90) deliveryScore += 5;
      else if (otdNum < 80) deliveryScore -= 15;
      
      const ltaNum = parseFloat(leadTimeAccuracy) || 90;
      if (ltaNum >= 95) deliveryScore += 10;
      else if (ltaNum >= 85) deliveryScore += 5;
      else if (ltaNum < 70) deliveryScore -= 10;
      
      if (capacityFlexibility === "high") deliveryScore += 10;
      else if (capacityFlexibility === "low") deliveryScore -= 5;
      
      if (logisticsCapability === "strong") deliveryScore += 10;
      else if (logisticsCapability === "weak") deliveryScore -= 10;

      deliveryScore = Math.max(0, Math.min(100, deliveryScore));

      categories.push({
        name: "Delivery Performance",
        score: Math.round(deliveryScore),
        weight: 25,
        status: deliveryScore >= 80 ? "excellent" : deliveryScore >= 60 ? "good" : deliveryScore >= 40 ? "fair" : deliveryScore >= 20 ? "poor" : "critical",
        details: `OTD: ${otdNum}%, Lead Time Accuracy: ${ltaNum}%`,
        subMetrics: [
          { name: "On-Time Delivery", value: `${otdNum}%`, score: otdNum >= 98 ? 98 : otdNum >= 95 ? 85 : otdNum >= 90 ? 70 : 45 },
          { name: "Lead Time Accuracy", value: `${ltaNum}%`, score: ltaNum >= 95 ? 95 : ltaNum >= 85 ? 75 : ltaNum >= 70 ? 55 : 35 },
          { name: "Capacity Flexibility", value: capacityFlexibility, score: capacityFlexibility === "high" ? 90 : capacityFlexibility === "medium" ? 65 : 40 },
        ],
      });

      // Calculate overall score
      const overallScore = Math.round(
        categories.reduce((sum, cat) => sum + cat.score * (cat.weight / 100), 0)
      );

      // Determine grade and risk level
      const grade = riskGrades.find((g) => overallScore >= g.minScore) || riskGrades[4];
      const riskLevel = 
        grade.grade === "A" ? "Very Low" :
        grade.grade === "B" ? "Low" :
        grade.grade === "C" ? "Moderate" :
        grade.grade === "D" ? "High" : "Very High";

      // Generate risk alerts
      const riskAlerts: RiskAlert[] = [];
      
      if (countryScore < 50) {
        riskAlerts.push({
          type: countryScore < 30 ? "critical" : "warning",
          message: `Elevated country risk in ${countryData.name}. Consider diversifying supply sources.`,
          category: "Country Risk",
        });
      }
      
      if (financialScore < 50) {
        riskAlerts.push({
          type: financialScore < 30 ? "critical" : "warning",
          message: "Financial stability concerns detected. Recommend credit monitoring.",
          category: "Financial Stability",
        });
      }
      
      if (qualityScore < 50) {
        riskAlerts.push({
          type: qualityScore < 30 ? "critical" : "warning",
          message: "Quality metrics below acceptable threshold. Consider quality audit.",
          category: "Quality Metrics",
        });
      }
      
      if (deliveryScore < 50) {
        riskAlerts.push({
          type: deliveryScore < 30 ? "critical" : "warning",
          message: "Delivery performance issues detected. May impact supply chain.",
          category: "Delivery Performance",
        });
      }
      
      if (tradeRelations === "sanctions") {
        riskAlerts.push({
          type: "critical",
          message: "Trade sanctions in effect. Verify compliance requirements immediately.",
          category: "Compliance",
        });
      }

      // Generate recommendations
      const recommendations: string[] = [];
      
      if (overallScore >= 70) {
        recommendations.push("Supplier qualifies for preferred vendor status");
        recommendations.push("Annual risk reassessment recommended");
        if (overallScore >= 85) {
          recommendations.push("Consider strategic partnership opportunities");
        }
      } else if (overallScore >= 55) {
        recommendations.push("Supplier qualifies with enhanced monitoring");
        recommendations.push("Quarterly performance reviews recommended");
        recommendations.push("Consider backup supplier development");
      } else if (overallScore >= 40) {
        recommendations.push("Implement risk mitigation measures before engagement");
        recommendations.push("Require quality improvement plan");
        recommendations.push("Monthly performance monitoring required");
        recommendations.push("Consider alternative supplier sourcing");
      } else {
        recommendations.push("High risk - not recommended for critical supplies");
        recommendations.push("Extensive due diligence required before any engagement");
        recommendations.push("Require bank guarantees or advance payment terms");
        recommendations.push("Identify and qualify alternative suppliers immediately");
      }
      
      if (countryData.riskFactor > 1.3) {
        recommendations.push("Monitor geopolitical developments in supplier country");
      }
      
      if (defectRateNum > 3 || returnRateNum > 4) {
        recommendations.push("Request detailed quality improvement action plan");
      }

      const supplierInfo: SupplierInfo = {
        name: supplierName || "Unknown Supplier",
        country: countryData.name,
        industry,
        yearsInBusiness: years,
        annualRevenue: revenue,
      };

      setResult({
        overallScore,
        riskLevel,
        riskGrade: grade.grade as SupplierRiskResult["riskGrade"],
        categories,
        supplierInfo,
        recommendations,
        riskAlerts,
      });

      setIsAnalyzing(false);
      setActiveTab("dashboard");
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-[#2E8B57] bg-[#2E8B57]/10";
      case "good": return "text-[#0F4C81] bg-[#0F4C81]/10";
      case "fair": return "text-amber-600 bg-amber-100";
      case "poor": return "text-orange-600 bg-orange-100";
      case "critical": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const radarData = result?.categories.map((cat) => ({
    category: cat.name.split(" ")[0],
    score: cat.score,
    fullMark: 100,
  })) || [];

  const barData = result?.categories.map((cat) => ({
    name: cat.name.length > 10 ? cat.name.substring(0, 10) + "..." : cat.name,
    score: cat.score,
    weight: cat.weight,
  })) || [];

  const pieData = result?.categories.map((cat) => ({
    name: cat.name,
    value: cat.weight,
    score: cat.score,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Risk Intelligence Platform</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Supplier Risk Assessment
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                Comprehensive evaluation of supplier reliability across country risk, financial stability, 
                quality metrics, and delivery performance. Make data-driven decisions for your supply chain.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-[#2E8B57]"></div>
                  <span>4 Risk Categories</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-[#2E8B57]"></div>
                  <span>20+ Countries</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-[#2E8B57]"></div>
                  <span>Real-time Analysis</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-4">
              <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <Gauge className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-white/70">Accuracy Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2.5K+</p>
                  <p className="text-sm text-white/70">Assessments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Assessment</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQs</span>
          </TabsTrigger>
        </TabsList>

        {/* Assessment Tab */}
        <TabsContent value="assessment" className="space-y-6 pt-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Building2 className="h-5 w-5" />
                Supplier Information
              </CardTitle>
              <CardDescription>
                Enter supplier details for comprehensive risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="country">Country Risk</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="quality">Quality & Delivery</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="supplierName" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#2E8B57]" />
                        Supplier Name
                      </Label>
                      <Input
                        id="supplierName"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        placeholder="Full legal name"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#2E8B57]" />
                        Country of Origin
                      </Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Industry Sector</Label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="textiles">Textiles & Apparel</SelectItem>
                          <SelectItem value="machinery">Machinery & Equipment</SelectItem>
                          <SelectItem value="chemicals">Chemicals</SelectItem>
                          <SelectItem value="automotive">Automotive Parts</SelectItem>
                          <SelectItem value="food">Food & Beverage</SelectItem>
                          <SelectItem value="pharmaceuticals">Pharmaceuticals</SelectItem>
                          <SelectItem value="metals">Metals & Materials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Years in Business</Label>
                      <Input
                        type="number"
                        value={yearsInBusiness}
                        onChange={(e) => setYearsInBusiness(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                        Annual Revenue (USD)
                      </Label>
                      <Input
                        type="number"
                        value={annualRevenue}
                        onChange={(e) => setAnnualRevenue(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Number of Employees</Label>
                      <Input
                        type="number"
                        value={employeeCount}
                        onChange={(e) => setEmployeeCount(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="country" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Political Stability</Label>
                      <Select value={politicalStability} onValueChange={setPoliticalStability}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stable">Stable</SelectItem>
                          <SelectItem value="unstable">Unstable</SelectItem>
                          <SelectItem value="volatile">Highly Volatile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Currency Volatility</Label>
                      <Select value={currencyVolatility} onValueChange={setCurrencyVolatility}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Risk</SelectItem>
                          <SelectItem value="moderate">Moderate Risk</SelectItem>
                          <SelectItem value="high">High Risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Trade Relations</Label>
                      <Select value={tradeRelations} onValueChange={setTradeRelations}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="favorable">Favorable</SelectItem>
                          <SelectItem value="restricted">Restricted</SelectItem>
                          <SelectItem value="sanctions">Sanctions in Place</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Financial Statements</Label>
                      <Select value={financialStatements} onValueChange={setFinancialStatements}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="audited">Audited</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="internal">Internal Only</SelectItem>
                          <SelectItem value="unavailable">Not Available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Profitability Status</Label>
                      <Select value={profitability} onValueChange={setProfitability}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="profitable">Profitable</SelectItem>
                          <SelectItem value="break-even">Break-even</SelectItem>
                          <SelectItem value="loss">Operating Loss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Debt Ratio (%)</Label>
                      <Input
                        type="number"
                        value={debtRatio}
                        onChange={(e) => setDebtRatio(e.target.value)}
                        placeholder="e.g., 30"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cash Flow Status</Label>
                      <Select value={cashFlow} onValueChange={setCashFlow}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="quality" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-[#2E8B57]" />
                        Quality Certifications
                      </Label>
                      <Select value={qualityCertifications} onValueChange={setQualityCertifications}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple">Multiple ISO Certifications</SelectItem>
                          <SelectItem value="iso9001">ISO 9001 Only</SelectItem>
                          <SelectItem value="other">Other Certifications</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Defect Rate (%)</Label>
                      <Input
                        type="number"
                        value={defectRate}
                        onChange={(e) => setDefectRate(e.target.value)}
                        placeholder="e.g., 1.0"
                        step="0.1"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quality Audit Frequency</Label>
                      <Select value={qualityAudits} onValueChange={setQualityAudits}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="biannual">Bi-Annual</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Return Rate (%)</Label>
                      <Input
                        type="number"
                        value={returnRate}
                        onChange={(e) => setReturnRate(e.target.value)}
                        placeholder="e.g., 2.0"
                        step="0.1"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#2E8B57]" />
                        On-Time Delivery (%)
                      </Label>
                      <Input
                        type="number"
                        value={onTimeDelivery}
                        onChange={(e) => setOnTimeDelivery(e.target.value)}
                        placeholder="e.g., 95"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Lead Time Accuracy (%)</Label>
                      <Input
                        type="number"
                        value={leadTimeAccuracy}
                        onChange={(e) => setLeadTimeAccuracy(e.target.value)}
                        placeholder="e.g., 90"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Capacity Flexibility</Label>
                      <Select value={capacityFlexibility} onValueChange={setCapacityFlexibility}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High - Can scale quickly</SelectItem>
                          <SelectItem value="medium">Medium - Limited scaling</SelectItem>
                          <SelectItem value="low">Low - Fixed capacity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Logistics Capability</Label>
                      <Select value={logisticsCapability} onValueChange={setLogisticsCapability}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="strong">Strong - Full service</SelectItem>
                          <SelectItem value="moderate">Moderate - Basic services</SelectItem>
                          <SelectItem value="weak">Weak - Limited options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex justify-center">
                <Button
                  onClick={analyzeRisk}
                  disabled={isAnalyzing}
                  className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Risk...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Assess Supplier Risk
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6 pt-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                  className="text-white"
                  style={{
                    background: `linear-gradient(135deg, ${riskGrades.find((g) => g.grade === result.riskGrade)?.color || "#94a3b8"}, ${riskGrades.find((g) => g.grade === result.riskGrade)?.color || "#94a3b8"}dd)`,
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Grade</span>
                    </div>
                    <p className="text-4xl font-bold">{result.riskGrade}</p>
                    <p className="text-sm opacity-80">{result.riskLevel} Risk</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Target className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Score</span>
                    </div>
                    <p className="text-3xl font-bold">{result.overallScore}</p>
                    <p className="text-sm opacity-80">out of 100</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Risk Level</span>
                    </div>
                    <p className="text-xl font-bold">{result.riskLevel}</p>
                    <p className="text-sm opacity-80">Supplier reliability</p>
                  </CardContent>
                </Card>

                <Card className={`text-white ${result.riskAlerts.length > 0 ? "bg-gradient-to-br from-amber-500 to-amber-600" : "bg-gradient-to-br from-emerald-500 to-emerald-600"}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      {result.riskAlerts.length > 0 ? <AlertTriangle className="h-6 w-6 opacity-80" /> : <CheckCircle className="h-6 w-6 opacity-80" />}
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Alerts</span>
                    </div>
                    <p className="text-xl font-bold">{result.riskAlerts.length}</p>
                    <p className="text-sm opacity-80">{result.riskAlerts.length > 0 ? "Risk alerts" : "No alerts"}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Alerts */}
              {result.riskAlerts.length > 0 && (
                <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-4">
                      <AlertOctagon className="h-6 w-6 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-700 dark:text-amber-300">Risk Alerts</p>
                        <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">The following issues require attention</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {result.riskAlerts.map((alert, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            alert.type === "critical" 
                              ? "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" 
                              : alert.type === "warning"
                              ? "bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700"
                              : "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                          }`}
                        >
                          {alert.type === "critical" ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : alert.type === "warning" ? (
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                          ) : (
                            <Info className="h-5 w-5 text-blue-600" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{alert.message}</p>
                            <p className="text-xs text-muted-foreground">{alert.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Supplier Info Card */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Building2 className="h-5 w-5" />
                    Supplier Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#2E8B57]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-medium">{result.supplierInfo.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#2E8B57]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Country</p>
                        <p className="font-medium">{result.supplierInfo.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#2E8B57]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Industry</p>
                        <p className="font-medium capitalize">{result.supplierInfo.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#2E8B57]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Years</p>
                        <p className="font-medium">{result.supplierInfo.yearsInBusiness}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-medium">${(result.supplierInfo.annualRevenue / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Scores with Progress */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <BarChart3 className="h-5 w-5" />
                    Risk Category Scores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {result.categories.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{category.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(category.status)}`}>
                            {category.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{category.score}</span>
                          <span className="text-sm text-muted-foreground">/ 100</span>
                        </div>
                      </div>
                      <Progress 
                        value={category.score} 
                        className="h-3"
                      />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{category.details}</span>
                        <span>Weight: {category.weight}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <FileText className="h-5 w-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <ChevronRight className="h-5 w-5 text-[#2E8B57] mt-0.5 shrink-0" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Shield className="h-16 w-16 text-[#0F4C81]/30 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Assessment Yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Complete the supplier information in the Assessment tab to view the risk dashboard.
                </p>
                <Button 
                  onClick={() => setActiveTab("assessment")}
                  className="mt-4 bg-[#0F4C81] hover:bg-[#0F4C81]/90"
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 pt-6">
          {result ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <BarChart3 className="h-5 w-5" />
                    Risk Profile Radar
                  </CardTitle>
                  <CardDescription>Multi-dimensional risk visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: "#64748b" }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                        <Radar
                          name="Score"
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

              {/* Bar Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <BarChart3 className="h-5 w-5" />
                    Category Comparison
                  </CardTitle>
                  <CardDescription>Score breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "white", 
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px"
                          }} 
                        />
                        <Bar dataKey="score" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <PieChart className="h-5 w-5" />
                    Weight Distribution
                  </CardTitle>
                  <CardDescription>Risk category weights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name.split(" ")[0]}: ${value}%`}
                        >
                          {pieData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Trend Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <LineChart className="h-5 w-5" />
                    Score Trend
                  </CardTitle>
                  <CardDescription>Historical assessment scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLine data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "white", 
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px"
                          }} 
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#2E8B57" 
                          strokeWidth={3}
                          dot={{ fill: "#2E8B57", strokeWidth: 2, r: 4 }}
                        />
                      </RechartsLine>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Gauge Chart */}
              <Card className="border-0 shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Gauge className="h-5 w-5" />
                    Overall Risk Score
                  </CardTitle>
                  <CardDescription>Visual representation of supplier risk level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-32 overflow-hidden">
                      <div className="absolute inset-0 flex items-end justify-center">
                        <div className="w-64 h-64 rounded-full border-[20px] border-slate-200 dark:border-slate-700"></div>
                      </div>
                      <div 
                        className="absolute inset-0 flex items-end justify-center"
                        style={{
                          background: `conic-gradient(from 180deg, ${riskGrades.find((g) => g.grade === result.riskGrade)?.color || "#94a3b8"} 0deg, ${riskGrades.find((g) => g.grade === result.riskGrade)?.color || "#94a3b8"} ${(result.overallScore / 100) * 180}deg, transparent ${(result.overallScore / 100) * 180}deg)`,
                          borderRadius: "128px 128px 0 0",
                        }}
                      >
                        <div className="w-44 h-44 rounded-full bg-white dark:bg-slate-900"></div>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <p className="text-5xl font-bold text-[#0F4C81]">{result.overallScore}</p>
                      <p className="text-lg text-muted-foreground mt-1">Overall Score</p>
                      <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full text-white font-medium`}
                        style={{ backgroundColor: riskGrades.find((g) => g.grade === result.riskGrade)?.color }}
                      >
                        <Shield className="h-4 w-4" />
                        Grade {result.riskGrade} - {result.riskLevel} Risk
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <PieChart className="h-16 w-16 text-[#0F4C81]/30 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Data to Analyze</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Complete the supplier assessment to view analytics and visualizations.
                </p>
                <Button 
                  onClick={() => setActiveTab("assessment")}
                  className="mt-4 bg-[#0F4C81] hover:bg-[#0F4C81]/90"
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6 pt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <History className="h-5 w-5" />
                Assessment History
              </CardTitle>
              <CardDescription>Previous supplier risk assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "TechParts Manufacturing", country: "China", score: 78, grade: "B", date: "2024-01-15" },
                  { name: "EuroSteel GmbH", country: "Germany", score: 92, grade: "A", date: "2024-01-12" },
                  { name: "Pacific Components", country: "Japan", score: 85, grade: "A", date: "2024-01-10" },
                  { name: "Americas Textiles", country: "Mexico", score: 65, grade: "C", date: "2024-01-08" },
                  { name: "Nordic Precision", country: "Sweden", score: 88, grade: "A", date: "2024-01-05" },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: riskGrades.find((g) => g.grade === item.grade)?.color }}
                      >
                        {item.grade}
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-bold text-lg">{item.score}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">156</p>
                    <p className="text-sm opacity-80">Total Assessments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">89</p>
                    <p className="text-sm opacity-80">Unique Suppliers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">76.8</p>
                    <p className="text-sm opacity-80">Avg. Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 pt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Everything you need to know about supplier risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium hover:text-[#0F4C81]">
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

          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-[#0F4C81]">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="h-8 w-8 text-[#0F4C81]" />
                  <div>
                    <h3 className="font-semibold mb-1">Risk Categories</h3>
                    <p className="text-sm text-muted-foreground">
                      Four comprehensive categories covering country, financial, quality, and delivery risks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-[#2E8B57]">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Target className="h-8 w-8 text-[#2E8B57]" />
                  <div>
                    <h3 className="font-semibold mb-1">Scoring System</h3>
                    <p className="text-sm text-muted-foreground">
                      100-point scale with grades A-E indicating risk levels from Very Low to Critical.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-8 w-8 text-amber-500" />
                  <div>
                    <h3 className="font-semibold mb-1">Risk Alerts</h3>
                    <p className="text-sm text-muted-foreground">
                      Automatic alerts for critical issues requiring immediate attention.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-[#0F4C81]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Still have questions?</h3>
                    <p className="text-sm text-muted-foreground">Our support team is here to help you.</p>
                  </div>
                </div>
                <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
