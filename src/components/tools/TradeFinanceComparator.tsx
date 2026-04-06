"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  Building2,
  Clock,
  ArrowRight,
  PieChart,
  Scale,
  Shield,
  FileText,
  CreditCard,
  RefreshCw,
  BarChart3,
  Star,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Zap,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Legend,
  ComposedChart,
  Line,
  Area,
} from "recharts";

interface FinanceOption {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: React.ReactNode;
  typicalAdvanceRate: number;
  typicalFeeRange: [number, number];
  typicalTerms: [number, number];
  riskLevel: "low" | "medium" | "high";
  complexity: "low" | "medium" | "high";
  timeToFund: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  color: string;
}

const financeOptions: FinanceOption[] = [
  {
    id: "lc",
    name: "Letter of Credit",
    shortName: "L/C",
    description: "Bank-guaranteed payment instrument for secure international trade",
    icon: <FileText className="h-5 w-5" />,
    typicalAdvanceRate: 100,
    typicalFeeRange: [0.5, 2],
    typicalTerms: [30, 180],
    riskLevel: "low",
    complexity: "high",
    timeToFund: "Immediate upon compliance",
    pros: [
      "High payment security for both parties",
      "Widely accepted in international trade",
      "Reduces non-payment risk significantly",
      "Can be confirmed for additional security"
    ],
    cons: [
      "Complex documentation requirements",
      "Higher bank fees",
      "Strict compliance requirements",
      "Can cause payment delays if discrepancies"
    ],
    bestFor: [
      "New trading relationships",
      "High-value transactions",
      "Countries with payment risks",
      "First-time buyers"
    ],
    color: "#0F4C81"
  },
  {
    id: "factoring",
    name: "Invoice Factoring",
    shortName: "Factoring",
    description: "Sell your receivables to a factor for immediate working capital",
    icon: <CreditCard className="h-5 w-5" />,
    typicalAdvanceRate: 85,
    typicalFeeRange: [1.5, 5],
    typicalTerms: [30, 90],
    riskLevel: "medium",
    complexity: "low",
    timeToFund: "24-48 hours",
    pros: [
      "Fast access to working capital",
      "Outsourced accounts receivable management",
      "No additional debt on balance sheet",
      "Scalable with sales volume"
    ],
    cons: [
      "Higher cost than bank financing",
      "Customer notification required",
      "May affect customer relationships",
      "Recourse clauses may apply"
    ],
    bestFor: [
      "Growing businesses",
      "Long payment terms",
      "Cash flow gaps",
      "B2B transactions"
    ],
    color: "#2E8B57"
  },
  {
    id: "scf",
    name: "Supply Chain Finance",
    shortName: "SCF",
    description: "Buyer-led financing program for extended payment terms",
    icon: <RefreshCw className="h-5 w-5" />,
    typicalAdvanceRate: 100,
    typicalFeeRange: [1, 3],
    typicalTerms: [30, 120],
    riskLevel: "low",
    complexity: "medium",
    timeToFund: "2-5 business days",
    pros: [
      "Lower financing costs than factoring",
      "Extended payment terms for buyer",
      "Early payment option for supplier",
      "Strengthens supply chain relationships"
    ],
    cons: [
      "Requires buyer participation",
      "Limited to approved suppliers",
      "Platform integration needed",
      "Buyer creditworthiness dependent"
    ],
    bestFor: [
      "Established buyer relationships",
      "Large corporate buyers",
      "Recurring transactions",
      "Strategic suppliers"
    ],
    color: "#F59E0B"
  }
];

interface TradeParameters {
  transactionValue: number;
  paymentTerms: number;
  buyerCountry: string;
  buyerCreditRating: string;
  transactionType: string;
  urgencyLevel: string;
  relationshipType: string;
  industry: string;
}

interface CostBreakdown {
  optionId: string;
  totalCost: number;
  costPercentage: number;
  effectiveAPR: number;
  netProceeds: number;
  timeToCash: number;
  riskScore: number;
  complexityScore: number;
}

interface Recommendation {
  rank: number;
  optionId: string;
  score: number;
  reasons: string[];
  warnings: string[];
}

export default function TradeFinanceComparator() {
  const [parameters, setParameters] = useState<TradeParameters>({
    transactionValue: 250000,
    paymentTerms: 60,
    buyerCountry: "cn",
    buyerCreditRating: "medium",
    transactionType: "export",
    urgencyLevel: "normal",
    relationshipType: "established",
    industry: "manufacturing"
  });

  const [showResults, setShowResults] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const updateParameter = (key: keyof TradeParameters, value: any) => {
    setParameters(prev => ({ ...prev, [key]: value }));
    setShowResults(false);
  };

  const calculateCosts = useMemo((): CostBreakdown[] => {
    return financeOptions.map(option => {
      let totalCost = 0;
      let effectiveAPR = 0;
      let timeToCash = 0;

      switch (option.id) {
        case "lc":
          // LC costs: issuance fee + confirmation fee + amendment fees
          const lcIssuanceFee = parameters.transactionValue * 0.002;
          const lcConfirmationFee = parameters.transactionValue * 0.001;
          const lcAmendmentFee = 150;
          totalCost = lcIssuanceFee + lcConfirmationFee + lcAmendmentFee;
          effectiveAPR = (totalCost / parameters.transactionValue) * (365 / parameters.paymentTerms) * 100;
          timeToCash = parameters.paymentTerms;
          break;

        case "factoring":
          // Factoring costs: discount fee + interest on advance
          const advanceRate = option.typicalAdvanceRate / 100;
          const factoringFee = (option.typicalFeeRange[0] + option.typicalFeeRange[1]) / 2 / 100;
          const advanceAmount = parameters.transactionValue * advanceRate;
          const serviceFee = parameters.transactionValue * factoringFee;
          const interestRate = 0.12; // 12% annual
          const interestCost = advanceAmount * (interestRate / 365) * parameters.paymentTerms;
          totalCost = serviceFee + interestCost + 250; // Additional fees
          effectiveAPR = (totalCost / advanceAmount) * (365 / parameters.paymentTerms) * 100;
          timeToCash = 2; // Days to fund
          break;

        case "scf":
          // SCF costs: platform fee + financing cost
          const scfFee = (option.typicalFeeRange[0] + option.typicalFeeRange[1]) / 2 / 100;
          const platformFee = 200;
          const financingCost = parameters.transactionValue * scfFee * (parameters.paymentTerms / 90);
          totalCost = financingCost + platformFee;
          effectiveAPR = (totalCost / parameters.transactionValue) * (365 / parameters.paymentTerms) * 100;
          timeToCash = 3;
          break;
      }

      const netProceeds = parameters.transactionValue - totalCost;

      // Risk and complexity scores (1-10)
      const riskScore = option.riskLevel === "low" ? 9 : option.riskLevel === "medium" ? 6 : 3;
      const complexityScore = option.complexity === "low" ? 9 : option.complexity === "medium" ? 6 : 3;

      return {
        optionId: option.id,
        totalCost,
        costPercentage: (totalCost / parameters.transactionValue) * 100,
        effectiveAPR,
        netProceeds,
        timeToCash,
        riskScore,
        complexityScore
      };
    });
  }, [parameters]);

  const generateRecommendations = useMemo((): Recommendation[] => {
    const recommendations: Recommendation[] = financeOptions.map(option => {
      const cost = calculateCosts.find(c => c.optionId === option.id)!;
      let score = 50; // Base score
      const reasons: string[] = [];
      const warnings: string[] = [];

      // Factor in relationship type
      if (parameters.relationshipType === "new" && option.id === "lc") {
        score += 20;
        reasons.push("L/C ideal for new trading relationships");
      } else if (parameters.relationshipType === "established" && option.id === "scf") {
        score += 15;
        reasons.push("SCF works well with established relationships");
      }

      // Factor in urgency
      if (parameters.urgencyLevel === "urgent" && option.id === "factoring") {
        score += 15;
        reasons.push("Fastest access to working capital");
      } else if (parameters.urgencyLevel === "normal" && option.id === "lc") {
        score += 5;
      }

      // Factor in transaction value
      if (parameters.transactionValue > 500000 && option.id === "lc") {
        score += 10;
        reasons.push("Secure for high-value transactions");
      }

      // Factor in payment terms
      if (parameters.paymentTerms > 60 && option.id === "factoring") {
        score += 10;
        reasons.push("Helps manage long payment terms");
      }

      // Factor in buyer credit rating
      if (parameters.buyerCreditRating === "low" && option.id === "lc") {
        score += 15;
        reasons.push("Protects against buyer credit risk");
      } else if (parameters.buyerCreditRating === "high" && option.id === "scf") {
        score += 10;
        reasons.push("Leverages buyer's strong credit");
      }

      // Cost considerations
      if (cost.costPercentage < 1) {
        score += 10;
        reasons.push("Most cost-effective option");
      }

      // Warnings
      if (option.id === "factoring" && cost.effectiveAPR > 20) {
        warnings.push("High effective APR - consider alternatives");
        score -= 5;
      }

      if (option.id === "lc" && parameters.urgencyLevel === "urgent") {
        warnings.push("Documentation may cause delays");
        score -= 5;
      }

      if (option.id === "scf" && parameters.relationshipType === "new") {
        warnings.push("Requires buyer participation");
        score -= 10;
      }

      return {
        rank: 0,
        optionId: option.id,
        score: Math.max(0, Math.min(100, score)),
        reasons,
        warnings
      };
    });

    // Sort by score and assign ranks
    recommendations.sort((a, b) => b.score - a.score);
    recommendations.forEach((rec, index) => rec.rank = index + 1);

    return recommendations;
  }, [calculateCosts, parameters]);

  const handleCompare = () => {
    setShowResults(true);
    setSelectedOption(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const chartData = calculateCosts.map(cost => {
    const option = financeOptions.find(o => o.id === cost.optionId)!;
    return {
      name: option.shortName,
      totalCost: cost.totalCost,
      effectiveAPR: cost.effectiveAPR,
      netProceeds: cost.netProceeds,
      timeToCash: cost.timeToCash,
      riskScore: cost.riskScore,
      complexityScore: cost.complexityScore,
      color: option.color
    };
  });

  const radarData = calculateCosts.map(cost => {
    const option = financeOptions.find(o => o.id === cost.optionId)!;
    return {
      option: option.shortName,
      costEfficiency: 10 - Math.min(cost.costPercentage * 2, 10),
      speed: cost.timeToCash < 5 ? 10 : cost.timeToCash < 30 ? 7 : 4,
      security: cost.riskScore,
      simplicity: cost.complexityScore,
      flexibility: option.id === "factoring" ? 9 : option.id === "scf" ? 7 : 5
    };
  });

  const topRecommendation = generateRecommendations[0];
  const topOption = financeOptions.find(o => o.id === topRecommendation?.optionId);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Calculator className="h-5 w-5" />
            Trade Finance Parameters
          </CardTitle>
          <CardDescription>
            Enter your trade details to compare financing options and get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="transactionValue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                Transaction Value ($)
              </Label>
              <Input
                id="transactionValue"
                type="number"
                value={parameters.transactionValue}
                onChange={(e) => updateParameter("transactionValue", parseFloat(e.target.value) || 0)}
                placeholder="250,000"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#2E8B57]" />
                Payment Terms (Days)
              </Label>
              <Input
                id="paymentTerms"
                type="number"
                value={parameters.paymentTerms}
                onChange={(e) => updateParameter("paymentTerms", parseInt(e.target.value) || 0)}
                placeholder="60"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerCountry">Buyer Country/Region</Label>
              <Select value={parameters.buyerCountry} onValueChange={(v) => updateParameter("buyerCountry", v)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cn">China</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="eu">European Union</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="jp">Japan</SelectItem>
                  <SelectItem value="sea">Southeast Asia</SelectItem>
                  <SelectItem value="latam">Latin America</SelectItem>
                  <SelectItem value="africa">Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerCreditRating">Buyer Credit Rating</Label>
              <Select value={parameters.buyerCreditRating} onValueChange={(v) => updateParameter("buyerCreditRating", v)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High (Investment Grade)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low / Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select value={parameters.transactionType} onValueChange={(v) => updateParameter("transactionType", v)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="domestic">Domestic Trade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgencyLevel">Funding Urgency</Label>
              <Select value={parameters.urgencyLevel} onValueChange={(v) => updateParameter("urgencyLevel", v)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (Within days)</SelectItem>
                  <SelectItem value="normal">Normal (1-2 weeks)</SelectItem>
                  <SelectItem value="flexible">Flexible (No rush)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationshipType">Buyer Relationship</Label>
              <Select value={parameters.relationshipType} onValueChange={(v) => updateParameter("relationshipType", v)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Customer</SelectItem>
                  <SelectItem value="established">Established Relationship</SelectItem>
                  <SelectItem value="strategic">Strategic Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={parameters.industry} onValueChange={(v) => updateParameter("industry", v)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="commodities">Commodities</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleCompare}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              <Scale className="mr-2 h-5 w-5" />
              Compare Finance Options
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Finance Options Reference */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Info className="h-5 w-5" />
            Finance Options Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {financeOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedOption === option.id
                    ? "border-[#0F4C81] bg-[#0F4C81]/5"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                onClick={() => setSelectedOption(selectedOption === option.id ? null : option.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${option.color}20` }}>
                    <div style={{ color: option.color }}>{option.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: option.color }}>{option.shortName}</h4>
                    <p className="text-xs text-muted-foreground">{option.name}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Advance Rate:</span>
                    <span className="font-medium">{option.typicalAdvanceRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee Range:</span>
                    <span className="font-medium">{option.typicalFeeRange[0]}-{option.typicalFeeRange[1]}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terms:</span>
                    <span className="font-medium">{option.typicalTerms[0]}-{option.typicalTerms[1]} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level:</span>
                    <Badge variant={option.riskLevel === "low" ? "default" : option.riskLevel === "medium" ? "secondary" : "destructive"} className="text-xs">
                      {option.riskLevel}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Recommendation Card */}
            <Card className="border-2 border-[#2E8B57] bg-gradient-to-br from-[#2E8B57]/5 to-[#2E8B57]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                  <Star className="h-5 w-5" />
                  Top Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topOption && (
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-[#2E8B57]/20">
                          <div className="text-[#2E8B57]">{topOption.icon}</div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold" style={{ color: topOption.color }}>{topOption.name}</h3>
                          <p className="text-sm text-muted-foreground">{topOption.shortName}</p>
                        </div>
                        <Badge className="ml-auto bg-[#2E8B57]">
                          Score: {topRecommendation.score}/100
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{topOption.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                          <span className="text-muted-foreground">Total Cost:</span>
                          <p className="font-bold text-lg">
                            {formatCurrency(calculateCosts.find(c => c.optionId === topOption.id)?.totalCost || 0)}
                          </p>
                        </div>
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-lg">
                          <span className="text-muted-foreground">Net Proceeds:</span>
                          <p className="font-bold text-lg text-[#2E8B57]">
                            {formatCurrency(calculateCosts.find(c => c.optionId === topOption.id)?.netProceeds || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2 text-[#2E8B57]">
                          <CheckCircle className="h-4 w-4" /> Why This Option
                        </h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          {topRecommendation.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-[#2E8B57]">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {topRecommendation.warnings.length > 0 && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <h4 className="font-medium flex items-center gap-2 text-amber-600">
                            <AlertCircle className="h-4 w-4" /> Considerations
                          </h4>
                          <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-300">
                            {topRecommendation.warnings.map((warning, idx) => (
                              <li key={idx}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cost Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {calculateCosts.map((cost) => {
                const option = financeOptions.find(o => o.id === cost.optionId)!;
                return (
                  <Card key={cost.optionId} className="border-0 shadow-lg overflow-hidden">
                    <div className="h-2" style={{ backgroundColor: option.color }} />
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div style={{ color: option.color }}>{option.icon}</div>
                          <span className="font-semibold">{option.shortName}</span>
                        </div>
                        <Badge variant="outline">Rank #{generateRecommendations.find(r => r.optionId === cost.optionId)?.rank}</Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Cost</span>
                          <span className="font-bold">{formatCurrency(cost.totalCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cost %</span>
                          <span className="font-medium">{formatPercent(cost.costPercentage)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Effective APR</span>
                          <span className={`font-medium ${cost.effectiveAPR > 15 ? "text-red-500" : "text-[#2E8B57]"}`}>
                            {formatPercent(cost.effectiveAPR)}
                          </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Net Proceeds</span>
                          <span className="font-bold text-[#0F4C81]">{formatCurrency(cost.netProceeds)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time to Cash</span>
                          <span className="font-medium">{cost.timeToCash} days</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detailed Analysis Tabs */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <BarChart3 className="h-5 w-5" />
                  Detailed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="costs">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
                    <TabsTrigger value="terms">Terms Comparison</TabsTrigger>
                    <TabsTrigger value="comparison">Visual Comparison</TabsTrigger>
                    <TabsTrigger value="pros-cons">Pros & Cons</TabsTrigger>
                  </TabsList>

                  <TabsContent value="costs" className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-4">Total Cost by Option</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                              <Tooltip formatter={(value: number) => formatCurrency(value)} />
                              <Bar dataKey="totalCost" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-4">Effective APR Comparison</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis label={{ value: "APR (%)", angle: -90, position: "insideLeft" }} />
                              <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                              <Bar dataKey="effectiveAPR" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left py-3 px-4">Option</th>
                            <th className="text-right py-3 px-4">Transaction Value</th>
                            <th className="text-right py-3 px-4">Total Cost</th>
                            <th className="text-right py-3 px-4">Cost %</th>
                            <th className="text-right py-3 px-4">Effective APR</th>
                            <th className="text-right py-3 px-4">Net Proceeds</th>
                          </tr>
                        </thead>
                        <tbody>
                          {calculateCosts.map((cost) => {
                            const option = financeOptions.find(o => o.id === cost.optionId)!;
                            return (
                              <tr key={cost.optionId} className="border-b border-slate-100 dark:border-slate-800">
                                <td className="py-3 px-4 font-medium">
                                  <div className="flex items-center gap-2">
                                    <div style={{ color: option.color }}>{option.icon}</div>
                                    {option.shortName}
                                  </div>
                                </td>
                                <td className="text-right py-3 px-4">{formatCurrency(parameters.transactionValue)}</td>
                                <td className="text-right py-3 px-4 text-red-500">{formatCurrency(cost.totalCost)}</td>
                                <td className="text-right py-3 px-4">{formatPercent(cost.costPercentage)}</td>
                                <td className="text-right py-3 px-4">{formatPercent(cost.effectiveAPR)}</td>
                                <td className="text-right py-3 px-4 text-[#2E8B57] font-medium">{formatCurrency(cost.netProceeds)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="terms" className="pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-4">Time to Cash Comparison</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" label={{ value: "Days", position: "bottom" }} />
                              <YAxis dataKey="name" type="category" width={80} />
                              <Tooltip formatter={(value: number) => `${value} days`} />
                              <Bar dataKey="timeToCash" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-4">Risk & Complexity Scores</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 10]} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="riskScore" name="Risk Score" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                              <Line dataKey="complexityScore" name="Simplicity Score" stroke="#2E8B57" strokeWidth={3} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      {financeOptions.map(option => {
                        const cost = calculateCosts.find(c => c.optionId === option.id)!;
                        return (
                          <Card key={option.id} className="p-4">
                            <h5 className="font-semibold mb-3 flex items-center gap-2" style={{ color: option.color }}>
                              {option.icon} {option.shortName}
                            </h5>
                            <div className="space-y-3 text-sm">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Payment Security</span>
                                  <span className="font-medium">{cost.riskScore}/10</span>
                                </div>
                                <Progress value={cost.riskScore * 10} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span>Ease of Setup</span>
                                  <span className="font-medium">{cost.complexityScore}/10</span>
                                </div>
                                <Progress value={cost.complexityScore * 10} className="h-2" />
                              </div>
                              <div className="pt-2 border-t">
                                <div className="flex justify-between">
                                  <span>Typical Terms</span>
                                  <span className="font-medium">{option.typicalTerms[0]}-{option.typicalTerms[1]} days</span>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between">
                                  <span>Advance Rate</span>
                                  <span className="font-medium">{option.typicalAdvanceRate}%</span>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between">
                                  <span>Time to Fund</span>
                                  <span className="font-medium">{option.timeToFund}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="comparison" className="pt-6">
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={[
                          { metric: "Cost Efficiency", lc: 9, factoring: 6, scf: 8 },
                          { metric: "Speed", lc: 4, factoring: 9, scf: 7 },
                          { metric: "Security", lc: 10, factoring: 7, scf: 8 },
                          { metric: "Simplicity", lc: 4, factoring: 8, scf: 6 },
                          { metric: "Flexibility", lc: 5, factoring: 9, scf: 7 },
                        ]}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="metric" />
                          <PolarRadiusAxis domain={[0, 10]} />
                          <Radar name="L/C" dataKey="lc" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.3} />
                          <Radar name="Factoring" dataKey="factoring" stroke="#2E8B57" fill="#2E8B57" fillOpacity={0.3} />
                          <Radar name="SCF" dataKey="scf" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-2">
                      {[
                        { label: "Cost Efficiency", desc: "Lower total cost relative to transaction" },
                        { label: "Speed", desc: "How quickly funds become available" },
                        { label: "Security", desc: "Protection against non-payment" },
                        { label: "Simplicity", desc: "Ease of setup and documentation" },
                        { label: "Flexibility", desc: "Adaptability to different scenarios" }
                      ].map(metric => (
                        <div key={metric.label} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                          <p className="font-medium text-sm">{metric.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{metric.desc}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="pros-cons" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {financeOptions.map(option => {
                        const rec = generateRecommendations.find(r => r.optionId === option.id)!;
                        return (
                          <Card key={option.id} className="overflow-hidden">
                            <div className="h-2" style={{ backgroundColor: option.color }} />
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <div style={{ color: option.color }}>{option.icon}</div>
                                {option.shortName}
                              </CardTitle>
                              <CardDescription>{option.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-medium text-[#2E8B57] flex items-center gap-1 mb-2">
                                    <CheckCircle className="h-4 w-4" /> Advantages
                                  </h5>
                                  <ul className="text-sm space-y-1">
                                    {option.pros.map((pro, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-[#2E8B57] mt-1">✓</span>
                                        {pro}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="font-medium text-red-500 flex items-center gap-1 mb-2">
                                    <AlertCircle className="h-4 w-4" /> Disadvantages
                                  </h5>
                                  <ul className="text-sm space-y-1">
                                    {option.cons.map((con, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">✗</span>
                                        {con}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="pt-2 border-t">
                                  <h5 className="font-medium text-[#0F4C81] flex items-center gap-1 mb-2">
                                    <Target className="h-4 w-4" /> Best For
                                  </h5>
                                  <div className="flex flex-wrap gap-1">
                                    {option.bestFor.map((use, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">{use}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* All Recommendations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Lightbulb className="h-5 w-5" />
                  Complete Recommendation Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {generateRecommendations.map((rec, index) => {
                    const option = financeOptions.find(o => o.id === rec.optionId)!;
                    return (
                      <AccordionItem key={rec.optionId} value={rec.optionId} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-white"
                                 style={{ backgroundColor: index === 0 ? "#2E8B57" : index === 1 ? "#F59E0B" : "#6B7280" }}>
                              {rec.rank}
                            </div>
                            <div className="flex items-center gap-2" style={{ color: option.color }}>
                              {option.icon}
                              <span className="font-semibold">{option.name}</span>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              Score: {rec.score}/100
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 pb-2">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-[#2E8B57] mb-2">Reasons for this ranking:</h5>
                              <ul className="space-y-1 text-sm">
                                {rec.reasons.length > 0 ? rec.reasons.map((reason, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                                    {reason}
                                  </li>
                                )) : (
                                  <li className="text-muted-foreground">Standard option based on your parameters</li>
                                )}
                              </ul>
                            </div>
                            <div>
                              {rec.warnings.length > 0 && (
                                <>
                                  <h5 className="font-medium text-amber-600 mb-2">Considerations:</h5>
                                  <ul className="space-y-1 text-sm">
                                    {rec.warnings.map((warning, idx) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                        {warning}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Total Cost:</span>
                                  <span className="font-medium">{formatCurrency(calculateCosts.find(c => c.optionId === rec.optionId)?.totalCost || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Net Proceeds:</span>
                                  <span className="font-medium text-[#2E8B57]">{formatCurrency(calculateCosts.find(c => c.optionId === rec.optionId)?.netProceeds || 0)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Time to Cash:</span>
                                  <span className="font-medium">{calculateCosts.find(c => c.optionId === rec.optionId)?.timeToCash} days</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="h-8 w-8 opacity-80" />
                    <div>
                      <p className="text-sm opacity-80">Fastest Access to Cash</p>
                      <p className="text-2xl font-bold">Invoice Factoring</p>
                    </div>
                  </div>
                  <p className="text-sm opacity-80">
                    Get funded within 24-48 hours, ideal for urgent working capital needs.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-8 w-8 opacity-80" />
                    <div>
                      <p className="text-sm opacity-80">Most Secure Option</p>
                      <p className="text-2xl font-bold">Letter of Credit</p>
                    </div>
                  </div>
                  <p className="text-sm opacity-80">
                    Bank-guaranteed payment protection for high-value or new trading relationships.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
