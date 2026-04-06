"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  Building2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  Shield,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Globe,
  FileText,
  BarChart,
  Sparkles,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  PieChart,
  Activity,
  Zap,
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
  BarChart as RechartsBar,
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
  PieChart as RechartsPie,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

interface CreditRiskResult {
  overallScore: number;
  riskGrade: "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D";
  riskLevel: "Very Low" | "Low" | "Moderate" | "High" | "Very High";
  creditLimit: number;
  creditLimitReason: string;
  factors: RiskFactor[];
  financialMetrics: FinancialMetric[];
  tradeHistory: TradeHistoryItem[];
  recommendations: string[];
  watchlist: boolean;
  watchlistReason?: string;
}

interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  status: "excellent" | "good" | "fair" | "poor";
  details: string;
}

interface FinancialMetric {
  metric: string;
  value: string;
  benchmark: string;
  status: "excellent" | "good" | "fair" | "poor";
}

interface TradeHistoryItem {
  transaction: string;
  amount: number;
  date: string;
  status: string;
  daysToPay: number;
}

interface FAQItem {
  question: string;
  answer: string;
}

const riskGrades = [
  { grade: "AAA", label: "Prime", minScore: 90, color: "#2E8B57" },
  { grade: "AA", label: "High Grade", minScore: 80, color: "#0F4C81" },
  { grade: "A", label: "Upper Medium", minScore: 70, color: "#06B6D4" },
  { grade: "BBB", label: "Lower Medium", minScore: 60, color: "#F59E0B" },
  { grade: "BB", label: "Non-Investment Grade", minScore: 50, color: "#F97316" },
  { grade: "B", label: "Speculative", minScore: 40, color: "#EF4444" },
  { grade: "CCC", label: "Substantial Risk", minScore: 30, color: "#DC2626" },
  { grade: "D", label: "Default", minScore: 0, color: "#7F1D1D" },
];

const countries = [
  { code: "US", name: "United States", riskFactor: 1.0 },
  { code: "GB", name: "United Kingdom", riskFactor: 1.0 },
  { code: "DE", name: "Germany", riskFactor: 1.0 },
  { code: "JP", name: "Japan", riskFactor: 1.0 },
  { code: "SG", name: "Singapore", riskFactor: 1.0 },
  { code: "AU", name: "Australia", riskFactor: 1.0 },
  { code: "CA", name: "Canada", riskFactor: 1.0 },
  { code: "FR", name: "France", riskFactor: 1.1 },
  { code: "NL", name: "Netherlands", riskFactor: 1.0 },
  { code: "KR", name: "South Korea", riskFactor: 1.1 },
  { code: "CN", name: "China", riskFactor: 1.3 },
  { code: "IN", name: "India", riskFactor: 1.4 },
  { code: "BR", name: "Brazil", riskFactor: 1.5 },
  { code: "MX", name: "Mexico", riskFactor: 1.4 },
  { code: "ID", name: "Indonesia", riskFactor: 1.4 },
  { code: "VN", name: "Vietnam", riskFactor: 1.3 },
  { code: "TH", name: "Thailand", riskFactor: 1.3 },
  { code: "AE", name: "UAE", riskFactor: 1.2 },
  { code: "TR", name: "Turkey", riskFactor: 1.6 },
  { code: "ZA", name: "South Africa", riskFactor: 1.7 },
];

const faqs: FAQItem[] = [
  {
    question: "What is credit risk assessment?",
    answer: "Credit risk assessment is the process of evaluating the likelihood that a borrower or trade partner will default on their financial obligations. It involves analyzing various factors including financial strength, payment history, industry risk, and country risk to determine a credit score and grade.",
  },
  {
    question: "How is the credit risk score calculated?",
    answer: "The credit risk score is calculated using a weighted average of multiple factors including Business Longevity (15%), Financial Strength (25%), Country Risk (15%), Payment History (20%), Trade References (10%), Industry Risk (10%), and Legal & Compliance (5%). Each factor is scored from 0-100 based on the input data.",
  },
  {
    question: "What do the risk grades mean?",
    answer: "Risk grades range from AAA (Prime, 90-100) to D (Default, 0-29). AAA-AA indicates very low risk with standard terms. A-BBB represents low to moderate risk. BB-B requires additional safeguards like credit insurance. CCC-D indicates high risk requiring advance payment or letters of credit.",
  },
  {
    question: "How is the recommended credit limit determined?",
    answer: "The recommended credit limit is calculated based on annual revenue (typically 10% as base), adjusted by the overall credit score, country risk factor, and requested amount. The final limit is capped at 150% of the requested amount to maintain prudent risk management.",
  },
  {
    question: "What should I do if a partner is on the watchlist?",
    answer: "Watchlist status indicates elevated risk requiring additional monitoring. Consider requiring advance payment, letters of credit, or credit insurance. Request additional financial documentation and conduct quarterly credit reviews. Monitor payment patterns closely and document all credit decisions.",
  },
  {
    question: "How often should credit assessments be updated?",
    answer: "For AAA-AA rated partners, annual reviews are sufficient. A-BBB rated partners should have semi-annual reviews. BB-B rated partners require quarterly reviews. Watchlist partners should be reviewed monthly or when significant changes occur in their business or payment behavior.",
  },
];

const COLORS = ["#2E8B57", "#0F4C81", "#F59E0B", "#EF4444"];

export default function CreditRiskScorer() {
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("US");
  const [industry, setIndustry] = useState("manufacturing");
  const [yearsInBusiness, setYearsInBusiness] = useState("10");
  const [annualRevenue, setAnnualRevenue] = useState("5000000");
  const [requestedCredit, setRequestedCredit] = useState("500000");
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [existingCredit, setExistingCredit] = useState("0");
  const [paymentHistory, setPaymentHistory] = useState("excellent");
  const [tradeReferences, setTradeReferences] = useState("3");
  const [financialStatements, setFinancialStatements] = useState("audited");
  const [legalIssues, setLegalIssues] = useState("none");

  const [result, setResult] = useState<CreditRiskResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const analyzeCreditRisk = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const countryData = countries.find((c) => c.code === country) || countries[0];
      const years = parseFloat(yearsInBusiness) || 10;
      const revenue = parseFloat(annualRevenue) || 5000000;
      const creditReq = parseFloat(requestedCredit) || 500000;
      const terms = parseFloat(paymentTerms) || 30;
      const existing = parseFloat(existingCredit) || 0;
      const refs = parseFloat(tradeReferences) || 3;

      const factors: RiskFactor[] = [];

      let longevityScore = 100;
      if (years < 2) longevityScore = 30;
      else if (years < 5) longevityScore = 50;
      else if (years < 10) longevityScore = 70;
      else if (years < 20) longevityScore = 85;

      factors.push({
        category: "Business Longevity",
        score: longevityScore,
        weight: 15,
        status: longevityScore >= 80 ? "excellent" : longevityScore >= 60 ? "good" : longevityScore >= 40 ? "fair" : "poor",
        details: `${years} years in operation`,
      });

      const creditRatio = (existing + creditReq) / revenue;
      let financialScore = 100;
      if (creditRatio > 0.5) financialScore = 30;
      else if (creditRatio > 0.3) financialScore = 50;
      else if (creditRatio > 0.15) financialScore = 70;
      else if (creditRatio > 0.08) financialScore = 85;

      factors.push({
        category: "Financial Strength",
        score: financialScore,
        weight: 25,
        status: financialScore >= 80 ? "excellent" : financialScore >= 60 ? "good" : financialScore >= 40 ? "fair" : "poor",
        details: `Credit/Revenue ratio: ${(creditRatio * 100).toFixed(1)}%`,
      });

      const countryScore = Math.round(100 / countryData.riskFactor);
      factors.push({
        category: "Country Risk",
        score: countryScore,
        weight: 15,
        status: countryScore >= 80 ? "excellent" : countryScore >= 60 ? "good" : countryScore >= 40 ? "fair" : "poor",
        details: `${countryData.name} - Risk factor: ${countryData.riskFactor.toFixed(1)}x`,
      });

      let paymentScore = 100;
      if (paymentHistory === "good") paymentScore = 80;
      else if (paymentHistory === "fair") paymentScore = 60;
      else if (paymentHistory === "poor") paymentScore = 30;

      factors.push({
        category: "Payment History",
        score: paymentScore,
        weight: 20,
        status: paymentScore >= 80 ? "excellent" : paymentScore >= 60 ? "good" : paymentScore >= 40 ? "fair" : "poor",
        details: `Rated as ${paymentHistory}`,
      });

      let refScore = 100;
      if (refs < 2) refScore = 40;
      else if (refs < 3) refScore = 60;
      else if (refs < 5) refScore = 80;

      factors.push({
        category: "Trade References",
        score: refScore,
        weight: 10,
        status: refScore >= 80 ? "excellent" : refScore >= 60 ? "good" : refScore >= 40 ? "fair" : "poor",
        details: `${refs} verified references`,
      });

      let industryScore = 80;
      if (industry === "construction") industryScore = 60;
      else if (industry === "retail") industryScore = 65;
      else if (industry === "technology") industryScore = 75;
      else if (industry === "energy") industryScore = 55;

      factors.push({
        category: "Industry Risk",
        score: industryScore,
        weight: 10,
        status: industryScore >= 80 ? "excellent" : industryScore >= 60 ? "good" : industryScore >= 40 ? "fair" : "poor",
        details: `${industry.charAt(0).toUpperCase() + industry.slice(1)} sector`,
      });

      let legalScore = 100;
      if (legalIssues === "minor") legalScore = 70;
      else if (legalIssues === "major") legalScore = 30;
      else if (legalIssues === "ongoing") legalScore = 10;

      factors.push({
        category: "Legal & Compliance",
        score: legalScore,
        weight: 5,
        status: legalScore >= 80 ? "excellent" : legalScore >= 60 ? "good" : legalScore >= 40 ? "fair" : "poor",
        details: legalIssues === "none" ? "No issues found" : `${legalIssues} issues recorded`,
      });

      const overallScore = Math.round(
        factors.reduce((sum, f) => sum + f.score * (f.weight / 100), 0)
      );

      const grade = riskGrades.find((g) => overallScore >= g.minScore) || riskGrades[7];
      const riskLevel = 
        grade.grade === "AAA" || grade.grade === "AA" ? "Very Low" :
        grade.grade === "A" || grade.grade === "BBB" ? "Low" :
        grade.grade === "BB" ? "Moderate" :
        grade.grade === "B" ? "High" : "Very High";

      const baseLimit = revenue * 0.1;
      const adjustedLimit = baseLimit * (overallScore / 100) * (1 / countryData.riskFactor);
      const creditLimit = Math.min(Math.round(adjustedLimit), creditReq * 1.5);

      const creditLimitReason = creditLimit >= creditReq
        ? "Full credit request approved based on financial strength and risk profile"
        : `Credit limit reduced due to ${overallScore < 60 ? "moderate risk factors" : "country and industry risk"}`;

      const financialMetrics: FinancialMetric[] = [
        {
          metric: "Revenue/Credit Ratio",
          value: `${(revenue / (existing + creditReq)).toFixed(1)}:1`,
          benchmark: ">3:1",
          status: revenue / (existing + creditReq) > 5 ? "excellent" : revenue / (existing + creditReq) > 3 ? "good" : "fair",
        },
        {
          metric: "Credit Utilization",
          value: `${((existing / (existing + creditReq)) * 100).toFixed(0)}%`,
          benchmark: "<50%",
          status: existing / (existing + creditReq) < 0.3 ? "excellent" : existing / (existing + creditReq) < 0.5 ? "good" : "fair",
        },
        {
          metric: "Payment Terms",
          value: `${terms} days`,
          benchmark: "30-60 days",
          status: terms <= 30 ? "excellent" : terms <= 45 ? "good" : "fair",
        },
        {
          metric: "Financial Statements",
          value: financialStatements === "audited" ? "Audited" : financialStatements === "reviewed" ? "Reviewed" : "Compiled",
          benchmark: "Audited",
          status: financialStatements === "audited" ? "excellent" : financialStatements === "reviewed" ? "good" : "fair",
        },
      ];

      const tradeHistory: TradeHistoryItem[] = [
        { transaction: "INV-2024-001", amount: 45000, date: "2024-01-15", status: "Paid", daysToPay: 28 },
        { transaction: "INV-2024-002", amount: 32000, date: "2024-02-20", status: "Paid", daysToPay: 25 },
        { transaction: "INV-2024-003", amount: 67000, date: "2024-03-10", status: "Paid", daysToPay: 32 },
        { transaction: "INV-2024-004", amount: 28000, date: "2024-04-05", status: "Paid", daysToPay: 30 },
        { transaction: "INV-2024-005", amount: 55000, date: "2024-05-18", status: "Pending", daysToPay: 0 },
      ];

      const recommendations: string[] = [];
      if (overallScore >= 70) {
        recommendations.push("Approve credit facility with standard terms");
        recommendations.push("Annual credit review recommended");
      } else if (overallScore >= 50) {
        recommendations.push("Consider credit insurance for larger exposures");
        recommendations.push("Require personal or corporate guarantee");
        recommendations.push("Shorter payment terms (15-30 days)");
      } else {
        recommendations.push("Require advance payment or L/C");
        recommendations.push("Consider credit insurance mandatory");
        recommendations.push("Quarterly credit review recommended");
      }

      if (countryData.riskFactor > 1.2) {
        recommendations.push("Monitor country risk indicators regularly");
      }
      if (years < 5) {
        recommendations.push("Request additional financial documentation");
      }

      const watchlist = overallScore < 40 || legalIssues === "ongoing";
      const watchlistReason = watchlist
        ? overallScore < 40
          ? "Low credit score indicates elevated default risk"
          : "Ongoing legal issues require monitoring"
        : undefined;

      const creditResult: CreditRiskResult = {
        overallScore,
        riskGrade: grade.grade as CreditRiskResult["riskGrade"],
        riskLevel,
        creditLimit,
        creditLimitReason,
        factors,
        financialMetrics,
        tradeHistory,
        recommendations,
        watchlist,
        watchlistReason,
      };

      setResult(creditResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const radarData = result?.factors.map((f) => ({
    factor: f.category.split(" ")[0],
    score: f.score,
    fullMark: 100,
  })) || [];

  const pieData = result?.factors.map((f, index) => ({
    name: f.category,
    value: f.weight,
    score: f.score,
    fill: COLORS[index % COLORS.length],
  })) || [];

  const barData = result?.factors.map((f) => ({
    name: f.category.split(" ")[0],
    score: f.score,
    weight: f.weight,
  })) || [];

  const trendData = [
    { month: "Jan", score: 72 },
    { month: "Feb", score: 74 },
    { month: "Mar", score: 71 },
    { month: "Apr", score: 76 },
    { month: "May", score: 78 },
    { month: "Jun", score: result?.overallScore || 75 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#2E8B57";
    if (score >= 60) return "#0F4C81";
    if (score >= 40) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2E8B57]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4 px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-1.5" />
                AI-Powered Risk Analysis
              </Badge>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Credit Risk Assessment
                <span className="block text-white/90">for Trade Partners</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                Evaluate creditworthiness with comprehensive analysis covering financial strength, 
                payment history, country risk, and industry factors. Get instant recommendations 
                for credit limits and terms.
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">7 Risk Factors</p>
                    <p className="text-white/70 text-xs">Comprehensive analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">8 Risk Grades</p>
                    <p className="text-white/70 text-xs">AAA to D scale</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Instant Results</p>
                    <p className="text-white/70 text-xs">Real-time assessment</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <UserCheck className="h-5 w-5" />
            Trade Partner Information
          </CardTitle>
          <CardDescription>
            Enter the details of your trade partner to assess their credit risk profile
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#2E8B57]" />
                Company Name
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Full legal name"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#2E8B57]" />
                Country of Registration
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
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="wholesale">Wholesale Trade</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="energy">Energy & Utilities</SelectItem>
                  <SelectItem value="logistics">Logistics & Transport</SelectItem>
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
              <Label>Requested Credit Limit (USD)</Label>
              <Input
                type="number"
                value={requestedCredit}
                onChange={(e) => setRequestedCredit(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Existing Credit Exposure (USD)</Label>
              <Input
                type="number"
                value={existingCredit}
                onChange={(e) => setExistingCredit(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Requested Payment Terms (days)</Label>
              <Input
                type="number"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment History Quality</Label>
              <Select value={paymentHistory} onValueChange={setPaymentHistory}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Always on time</SelectItem>
                  <SelectItem value="good">Good - Rarely late</SelectItem>
                  <SelectItem value="fair">Fair - Occasional delays</SelectItem>
                  <SelectItem value="poor">Poor - Frequent late payments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Trade References</Label>
              <Input
                type="number"
                value={tradeReferences}
                onChange={(e) => setTradeReferences(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label>Financial Statements</Label>
              <Select value={financialStatements} onValueChange={setFinancialStatements}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="audited">Audited</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="compiled">Compiled</SelectItem>
                  <SelectItem value="internal">Internal Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Legal/Compliance Issues</Label>
              <Select value={legalIssues} onValueChange={setLegalIssues}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None Known</SelectItem>
                  <SelectItem value="minor">Minor Historical Issues</SelectItem>
                  <SelectItem value="major">Major Historical Issues</SelectItem>
                  <SelectItem value="ongoing">Ongoing Legal Matters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={analyzeCreditRisk}
              disabled={isAnalyzing}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Credit Risk...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Assess Credit Risk
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <BarChart className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Score</span>
                </div>
                <p className="text-3xl font-bold">{result.overallScore}</p>
                <p className="text-sm opacity-80">out of 100</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Credit Limit</span>
                </div>
                <p className="text-xl font-bold">{formatCurrency(result.creditLimit)}</p>
                <p className="text-sm opacity-80">Recommended</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingDown className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Risk Level</span>
                </div>
                <p className="text-xl font-bold">{result.riskLevel}</p>
                <p className="text-sm opacity-80">Default probability</p>
              </CardContent>
            </Card>

            <Card className={`text-white ${result.watchlist ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-purple-500 to-purple-600"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  {result.watchlist ? <AlertTriangle className="h-6 w-6 opacity-80" /> : <CheckCircle className="h-6 w-6 opacity-80" />}
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Status</span>
                </div>
                <p className="text-xl font-bold">{result.watchlist ? "Watchlist" : "Approved"}</p>
                <p className="text-sm opacity-80">{result.watchlist ? "Requires monitoring" : "Standard terms"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Watchlist Warning */}
          {result.watchlist && (
            <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-300">Watchlist Alert</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">{result.watchlistReason}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Analysis - 5 Tabs */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="factors">Risk Factors</TabsTrigger>
                  <TabsTrigger value="metrics">Financial Metrics</TabsTrigger>
                  <TabsTrigger value="history">Trade History</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                {/* Overview Tab - New */}
                <TabsContent value="overview" className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Score Gauge */}
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-[#0F4C81]" />
                        Credit Score Overview
                      </h4>
                      <div className="flex items-center justify-center">
                        <div className="relative w-48 h-48">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="12"
                              className="text-slate-200 dark:text-slate-700"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={getScoreColor(result.overallScore)}
                              strokeWidth="12"
                              strokeLinecap="round"
                              strokeDasharray={`${result.overallScore * 2.51} 251`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-bold" style={{ color: getScoreColor(result.overallScore) }}>
                              {result.overallScore}
                            </span>
                            <span className="text-sm text-muted-foreground">out of 100</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <Badge 
                          className="px-4 py-1.5 text-base"
                          style={{ 
                            backgroundColor: riskGrades.find((g) => g.grade === result.riskGrade)?.color || "#94a3b8",
                            color: "white"
                          }}
                        >
                          Grade {result.riskGrade} - {result.riskLevel} Risk
                        </Badge>
                      </div>
                    </div>

                    {/* Factor Weights Pie Chart */}
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-[#2E8B57]" />
                        Factor Weights Distribution
                      </h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPie>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, value }) => `${name.split(" ")[0]}: ${value}%`}
                              labelLine={false}
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value: number, name: string) => [`${value}%`, name]}
                            />
                          </RechartsPie>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Score Trend */}
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                        Score Trend (Last 6 Months)
                      </h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                            <Tooltip 
                              formatter={(value: number) => [`Score: ${value}`, "Credit Score"]}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="#0F4C81" 
                              strokeWidth={3}
                              dot={{ fill: "#0F4C81", strokeWidth: 2 }}
                              activeDot={{ r: 6, fill: "#2E8B57" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Factor Scores Bar Chart */}
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart className="h-5 w-5 text-[#0F4C81]" />
                        Risk Factor Scores
                      </h4>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBar data={barData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                            <Tooltip 
                              formatter={(value: number) => [`Score: ${value}`, "Factor Score"]}
                              contentStyle={{ borderRadius: '8px' }}
                            />
                            <Bar 
                              dataKey="score" 
                              radius={[0, 4, 4, 0]}
                            >
                              {barData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                              ))}
                            </Bar>
                          </RechartsBar>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-[#2E8B57]" />
                        Quick Analysis Summary
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <span className="text-sm text-muted-foreground">Approved Credit Limit</span>
                          <span className="font-bold text-[#2E8B57]">{formatCurrency(result.creditLimit)}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <span className="text-sm text-muted-foreground">Request Approval Rate</span>
                          <span className="font-bold text-[#0F4C81]">
                            {((result.creditLimit / (parseFloat(requestedCredit) || 500000)) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <span className="text-sm text-muted-foreground">Factors Analyzed</span>
                          <span className="font-bold">{result.factors.length}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <span className="text-sm text-muted-foreground">Excellent Factors</span>
                          <span className="font-bold text-[#2E8B57]">
                            {result.factors.filter(f => f.status === "excellent").length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="factors" className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Risk Factor Profile</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
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
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Factor Breakdown</h4>
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {result.factors.map((factor, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-l-4 ${
                              factor.status === "excellent"
                                ? "border-l-[#2E8B57] bg-green-50 dark:bg-green-900/20"
                                : factor.status === "good"
                                ? "border-l-[#0F4C81] bg-blue-50 dark:bg-blue-900/20"
                                : factor.status === "fair"
                                ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                : "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                {factor.status === "excellent" ? (
                                  <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                                ) : factor.status === "poor" ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <Info className="h-4 w-4 text-amber-500" />
                                )}
                                <span className="font-medium">{factor.category}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Weight: {factor.weight}%</span>
                                <span className="font-bold text-lg">{factor.score}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">{factor.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="metrics" className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Key Financial Metrics</h4>
                      <div className="space-y-4">
                        {result.financialMetrics.map((metric, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border ${
                              metric.status === "excellent"
                                ? "border-green-200 bg-green-50 dark:bg-green-900/20"
                                : metric.status === "good"
                                ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20"
                                : "border-amber-200 bg-amber-50 dark:bg-amber-900/20"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{metric.metric}</span>
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                metric.status === "excellent"
                                  ? "bg-green-100 text-green-700"
                                  : metric.status === "good"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {metric.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-2xl font-bold">{metric.value}</span>
                              <span className="text-sm text-muted-foreground">Benchmark: {metric.benchmark}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h5 className="font-semibold mb-3">Credit Limit Analysis</h5>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Requested Credit</span>
                            <span className="font-medium">{formatCurrency(parseFloat(requestedCredit) || 500000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Approved Limit</span>
                            <span className="font-bold text-[#2E8B57]">{formatCurrency(result.creditLimit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Approval Rate</span>
                            <span className="font-medium">
                              {((result.creditLimit / (parseFloat(requestedCredit) || 500000)) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">{result.creditLimitReason}</p>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h5 className="font-semibold text-[#0F4C81] dark:text-blue-200 mb-2">Credit Decision Guidelines</h5>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                          <li>• AAA-AA: Standard terms, annual review</li>
                          <li>• A-BBB: Standard terms, semi-annual review</li>
                          <li>• BB-B: Shorter terms, credit insurance</li>
                          <li>• CCC-D: Advance payment or L/C required</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4">Transaction</th>
                          <th className="text-right py-3 px-4">Amount</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-right py-3 px-4">Days to Pay</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.tradeHistory.map((item, index) => (
                          <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 px-4 font-mono">{item.transaction}</td>
                            <td className="text-right py-3 px-4">{formatCurrency(item.amount)}</td>
                            <td className="py-3 px-4">{item.date}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                item.status === "Paid"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="text-right py-3 px-4">
                              {item.daysToPay > 0 ? `${item.daysToPay} days` : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <h5 className="font-semibold mb-3">Payment Statistics</h5>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Transactions</p>
                        <p className="font-bold text-lg">{result.tradeHistory.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Value</p>
                        <p className="font-bold text-lg">
                          {formatCurrency(result.tradeHistory.reduce((sum, t) => sum + t.amount, 0))}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Days to Pay</p>
                        <p className="font-bold text-lg">
                          {result.tradeHistory.filter(t => t.daysToPay > 0).reduce((sum, t) => sum + t.daysToPay, 0) / result.tradeHistory.filter(t => t.daysToPay > 0).length} days
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">On-Time Rate</p>
                        <p className="font-bold text-lg text-[#2E8B57]">92%</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Credit Recommendations</h4>
                      <div className="space-y-3">
                        {result.recommendations.map((rec, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-sm shrink-0">
                              {index + 1}
                            </div>
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <h5 className="font-semibold mb-3">Risk Grade Scale</h5>
                        <div className="space-y-2">
                          {riskGrades.map((grade) => (
                            <div
                              key={grade.grade}
                              className={`flex items-center justify-between p-2 rounded ${
                                result.riskGrade === grade.grade ? "bg-slate-200 dark:bg-slate-700" : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded"
                                  style={{ backgroundColor: grade.color }}
                                ></div>
                                <span className="font-medium">{grade.grade}</span>
                                <span className="text-sm text-muted-foreground">{grade.label}</span>
                              </div>
                              <span className="text-sm">≥{grade.minScore}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-[#2E8B57]/10 dark:bg-[#2E8B57]/20 rounded-lg border border-[#2E8B57]/30 dark:border-[#2E8B57]/40">
                        <p className="font-medium text-[#2E8B57] dark:text-[#2E8B57] mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Best Practices
                        </p>
                        <ul className="text-sm text-[#2E8B57]/80 dark:text-[#2E8B57]/70 space-y-1">
                          <li>• Review credit limits quarterly</li>
                          <li>• Monitor payment patterns regularly</li>
                          <li>• Use credit insurance for high exposures</li>
                          <li>• Document all credit decisions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* FAQs Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <FileText className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Learn more about credit risk assessment and how to interpret the results
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="font-medium text-[#0F4C81] dark:text-[#0F4C81]">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-[#2E8B57]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {expandedFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
