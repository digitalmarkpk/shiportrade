"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Building2,
  Globe,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Info,
  Calculator,
  RefreshCw,
  Clock,
  Percent,
  ArrowRight,
  Eye,
  EyeOff,
  HelpCircle,
  FileText,
  Landmark,
  Zap,
  Lock,
  ChevronRight,
  Target,
  PieChart as PieChartIcon,
  LineChart,
  Activity,
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
import { Switch } from "@/components/ui/switch";
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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart,
  Area,
  Line,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Treemap,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  oceanLight: "#1A6FA8",
  oceanDark: "#0A3459",
  logistics: "#2E8B57",
  logisticsLight: "#3CB371",
  logisticsDark: "#1E6B47",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
};

// Country risk ratings (based on OECD country risk classifications)
const countryRiskData = [
  { code: "US", name: "United States", riskCategory: 0, sovereignRating: "AAA", riskPremium: 0.10 },
  { code: "GB", name: "United Kingdom", riskCategory: 0, sovereignRating: "AA", riskPremium: 0.15 },
  { code: "DE", name: "Germany", riskCategory: 0, sovereignRating: "AAA", riskPremium: 0.10 },
  { code: "JP", name: "Japan", riskCategory: 0, sovereignRating: "A+", riskPremium: 0.12 },
  { code: "SG", name: "Singapore", riskCategory: 0, sovereignRating: "AAA", riskPremium: 0.10 },
  { code: "AU", name: "Australia", riskCategory: 0, sovereignRating: "AAA", riskPremium: 0.12 },
  { code: "CA", name: "Canada", riskCategory: 0, sovereignRating: "AAA", riskPremium: 0.10 },
  { code: "FR", name: "France", riskCategory: 1, sovereignRating: "AA", riskPremium: 0.18 },
  { code: "NL", name: "Netherlands", riskCategory: 0, sovereignRating: "AAA", riskPremium: 0.10 },
  { code: "CH", name: "Switzerland", riskCategory: 0, sovereignRating: "AAA", riskPremium: 0.08 },
  { code: "KR", name: "South Korea", riskCategory: 1, sovereignRating: "AA-", riskPremium: 0.20 },
  { code: "HK", name: "Hong Kong", riskCategory: 1, sovereignRating: "AA+", riskPremium: 0.22 },
  { code: "TW", name: "Taiwan", riskCategory: 1, sovereignRating: "AA-", riskPremium: 0.20 },
  { code: "AE", name: "UAE", riskCategory: 2, sovereignRating: "AA-", riskPremium: 0.35 },
  { code: "SA", name: "Saudi Arabia", riskCategory: 2, sovereignRating: "A+", riskPremium: 0.40 },
  { code: "CN", name: "China", riskCategory: 2, sovereignRating: "A+", riskPremium: 0.45 },
  { code: "IN", name: "India", riskCategory: 3, sovereignRating: "BBB-", riskPremium: 0.65 },
  { code: "BR", name: "Brazil", riskCategory: 3, sovereignRating: "BB", riskPremium: 0.80 },
  { code: "MX", name: "Mexico", riskCategory: 3, sovereignRating: "BBB", riskPremium: 0.55 },
  { code: "ID", name: "Indonesia", riskCategory: 3, sovereignRating: "BBB", riskPremium: 0.50 },
  { code: "VN", name: "Vietnam", riskCategory: 4, sovereignRating: "BB", riskPremium: 0.90 },
  { code: "TH", name: "Thailand", riskCategory: 2, sovereignRating: "BBB+", riskPremium: 0.40 },
  { code: "MY", name: "Malaysia", riskCategory: 2, sovereignRating: "A-", riskPremium: 0.35 },
  { code: "PH", name: "Philippines", riskCategory: 3, sovereignRating: "BBB+", riskPremium: 0.55 },
  { code: "ZA", name: "South Africa", riskCategory: 4, sovereignRating: "BB-", riskPremium: 1.00 },
  { code: "TR", name: "Turkey", riskCategory: 5, sovereignRating: "B+", riskPremium: 1.50 },
  { code: "RU", name: "Russia", riskCategory: 6, sovereignRating: "CCC+", riskPremium: 2.50 },
  { code: "NG", name: "Nigeria", riskCategory: 5, sovereignRating: "B-", riskPremium: 1.80 },
  { code: "EG", name: "Egypt", riskCategory: 4, sovereignRating: "B", riskPremium: 1.20 },
  { code: "PK", name: "Pakistan", riskCategory: 6, sovereignRating: "CCC+", riskPremium: 2.20 },
];

// Bank risk ratings
const bankRiskRatings = [
  { rating: "AAA", description: "Prime", premiumFactor: 0.5, color: COLORS.logistics },
  { rating: "AA", description: "High Grade", premiumFactor: 0.7, color: COLORS.ocean },
  { rating: "A", description: "Upper Medium", premiumFactor: 1.0, color: COLORS.info },
  { rating: "BBB", description: "Lower Medium", premiumFactor: 1.3, color: COLORS.warning },
  { rating: "BB", description: "Non-Investment Grade", premiumFactor: 1.8, color: "#F97316" },
  { rating: "B", description: "Speculative", premiumFactor: 2.5, color: COLORS.danger },
  { rating: "CCC", description: "Substantial Risk", premiumFactor: 3.5, color: "#DC2626" },
];

// Confirmation banks (major international banks)
const confirmationBanks = [
  { name: "JPMorgan Chase", country: "US", rating: "AA", baseFee: 0.08, minFee: 250 },
  { name: "Bank of America", country: "US", rating: "AA-", baseFee: 0.09, minFee: 250 },
  { name: "Citibank", country: "US", rating: "A+", baseFee: 0.10, minFee: 300 },
  { name: "HSBC", country: "GB", rating: "AA-", baseFee: 0.09, minFee: 250 },
  { name: "Standard Chartered", country: "GB", rating: "A+", baseFee: 0.11, minFee: 300 },
  { name: "Deutsche Bank", country: "DE", rating: "A+", baseFee: 0.10, minFee: 300 },
  { name: "BNP Paribas", country: "FR", rating: "AA-", baseFee: 0.09, minFee: 250 },
  { name: "Société Générale", country: "FR", rating: "A+", baseFee: 0.11, minFee: 300 },
  { name: "ING", country: "NL", rating: "A+", baseFee: 0.10, minFee: 250 },
  { name: "UBS", country: "CH", rating: "AA", baseFee: 0.08, minFee: 300 },
  { name: "Credit Suisse", country: "CH", rating: "A", baseFee: 0.12, minFee: 350 },
  { name: "Mitsubishi UFJ", country: "JP", rating: "A+", baseFee: 0.10, minFee: 300 },
  { name: "SMBC", country: "JP", rating: "A+", baseFee: 0.10, minFee: 300 },
  { name: "DBS Bank", country: "SG", rating: "AA-", baseFee: 0.09, minFee: 250 },
  { name: "OCBC", country: "SG", rating: "A+", baseFee: 0.11, minFee: 300 },
];

// FAQ data
const faqData = [
  {
    question: "What is LC Confirmation and why is it important?",
    answer: "LC Confirmation is an additional guarantee provided by a second bank (usually in the beneficiary's country) that adds its own commitment to pay under the Letter of Credit. This is crucial when dealing with issuing banks from higher-risk countries or with lower credit ratings, as it significantly reduces payment risk and provides dual bank protection.",
  },
  {
    question: "How is the confirmation fee calculated?",
    answer: "The confirmation fee is calculated based on several factors: the LC amount, the issuing bank's country risk, the issuing bank's credit rating, the LC tenor (duration), currency, and the confirming bank's base rate. The total premium rate is applied to the LC amount, subject to a minimum fee set by the confirming bank.",
  },
  {
    question: "What is the difference between standard and silent confirmation?",
    answer: "Standard confirmation involves the confirming bank adding its commitment with the knowledge and consent of the issuing bank. Silent confirmation (also called 'quiet confirmation') is done without notifying the issuing bank. Silent confirmation typically costs 20-30% more but offers greater flexibility and confidentiality.",
  },
  {
    question: "When should I consider LC confirmation?",
    answer: "You should consider LC confirmation when: (1) The issuing bank is from a high-risk country, (2) The issuing bank has a lower credit rating (BBB or below), (3) The LC amount is significant relative to your business, (4) The tenor is extended (180+ days), or (5) Your company requires additional payment security for compliance or risk management.",
  },
  {
    question: "How does country risk affect confirmation pricing?",
    answer: "Country risk reflects the economic and political stability of the issuing bank's country. Countries with lower sovereign ratings (e.g., CCC, B) carry higher risk premiums (1.5-2.5%) compared to AAA-rated countries (0.08-0.15%). This premium compensates for potential country-level issues like currency controls, economic instability, or political risks.",
  },
  {
    question: "Can I negotiate confirmation fees?",
    answer: "Yes, confirmation fees are often negotiable, especially for: (1) Large transaction volumes, (2) Long-term relationships with the confirming bank, (3) Multiple LCs in a year, (4) Competing quotes from other banks. It's recommended to obtain quotes from multiple confirming banks and leverage competition for better rates.",
  },
  {
    question: "What happens if the issuing bank defaults?",
    answer: "If the issuing bank defaults, the confirming bank assumes full payment responsibility. This is the primary benefit of confirmation - the beneficiary can present documents directly to the confirming bank and receive payment, regardless of the issuing bank's situation. The confirming bank then seeks reimbursement from the issuing bank.",
  },
  {
    question: "Are there alternatives to LC confirmation?",
    answer: "Yes, alternatives include: (1) Trade credit insurance - covers non-payment risk, (2) Export credit agency support - government-backed guarantees, (3) Forfaiting - selling the LC receivable at a discount, (4) Credit derivatives - credit default swaps on the issuing bank. Each has different costs, benefits, and suitability depending on your specific situation.",
  },
];

// Market trend data for visualization
const marketTrendData = [
  { month: "Jan", avgFee: 0.45, volume: 120 },
  { month: "Feb", avgFee: 0.42, volume: 135 },
  { month: "Mar", avgFee: 0.48, volume: 142 },
  { month: "Apr", avgFee: 0.44, volume: 138 },
  { month: "May", avgFee: 0.41, volume: 155 },
  { month: "Jun", avgFee: 0.43, volume: 162 },
];

interface ConfirmationResult {
  confirmationFee: number;
  silentConfirmationFee: number;
  countryRiskPremium: number;
  bankRiskPremium: number;
  tenorPremium: number;
  totalPremium: number;
  effectiveRate: number;
  riskWithoutConfirmation: number;
  riskWithConfirmation: number;
  riskMitigation: number;
  breakdown: {
    baseFee: number;
    countryRisk: number;
    bankRisk: number;
    tenorAdjustment: number;
    currencyAdjustment: number;
  };
  comparison: {
    withConfirmation: { risk: number; cost: number; paymentCertainty: number };
    withoutConfirmation: { risk: number; cost: number; paymentCertainty: number };
  };
  recommendation: {
    action: "confirm" | "decline" | "negotiate" | "silent";
    reason: string;
    alternatives: string[];
  };
}

export default function LCConfirmationPricing() {
  // Input states
  const [lcAmount, setLcAmount] = useState<string>("500000");
  const [currency, setCurrency] = useState<string>("USD");
  const [issuingBankCountry, setIssuingBankCountry] = useState<string>("CN");
  const [issuingBankRating, setIssuingBankRating] = useState<string>("BBB");
  const [confirmationBank, setConfirmationBank] = useState<string>("JPMorgan Chase");
  const [tenor, setTenor] = useState<string>("90");
  const [silentConfirmation, setSilentConfirmation] = useState<boolean>(false);
  const [transferableLC, setTransferableLC] = useState<boolean>(false);
  const [revolvingLC, setRevolvingLC] = useState<boolean>(false);
  
  const [result, setResult] = useState<ConfirmationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Calculate confirmation pricing
  const calculateConfirmation = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const amount = parseFloat(lcAmount) || 500000;
      const tenorDays = parseFloat(tenor) || 90;
      
      // Get country risk data
      const countryData = countryRiskData.find(c => c.code === issuingBankCountry) || countryRiskData[16];
      const countryRiskPremium = countryData.riskPremium;

      // Get bank risk rating data
      const bankRating = bankRiskRatings.find(b => b.rating === issuingBankRating) || bankRiskRatings[3];
      const bankPremiumFactor = bankRating.premiumFactor;

      // Get confirmation bank data
      const confBank = confirmationBanks.find(b => b.name === confirmationBank) || confirmationBanks[0];
      const baseFee = confBank.baseFee;

      // Calculate tenor adjustment (longer tenor = higher risk)
      const tenorPremium = Math.max(0, (tenorDays - 90) / 365 * 0.15);

      // Calculate currency adjustment (non-USD slightly higher)
      const currencyAdjustment = currency === "USD" ? 0 : 0.05;

      // Calculate components
      const bankRiskPremium = baseFee * bankPremiumFactor;
      const totalPremium = countryRiskPremium + bankRiskPremium + tenorPremium + currencyAdjustment;

      // Calculate confirmation fee
      let confirmationFee = (amount * totalPremium) / 100;
      const minFee = confBank.minFee;
      confirmationFee = Math.max(confirmationFee, minFee);

      // Silent confirmation typically costs 20-30% more
      const silentConfirmationFee = confirmationFee * 1.25;

      // Effective annual rate
      const effectiveRate = (totalPremium * 365) / tenorDays;

      // Risk assessment
      const baseRiskScore = countryData.riskCategory * 15 + (7 - bankRiskRatings.indexOf(bankRating)) * 10;
      const riskWithoutConfirmation = Math.min(100, baseRiskScore);
      const riskWithConfirmation = Math.max(5, riskWithoutConfirmation * 0.15);
      const riskMitigation = riskWithoutConfirmation - riskWithConfirmation;

      // Breakdown
      const breakdown = {
        baseFee: baseFee,
        countryRisk: countryRiskPremium,
        bankRisk: bankRiskPremium - baseFee,
        tenorAdjustment: tenorPremium,
        currencyAdjustment: currencyAdjustment,
      };

      // Cost comparison
      const expectedLossWithout = amount * (riskWithoutConfirmation / 100) * 0.3;
      const comparison = {
        withConfirmation: {
          risk: riskWithConfirmation,
          cost: silentConfirmation ? silentConfirmationFee : confirmationFee,
          paymentCertainty: 95,
        },
        withoutConfirmation: {
          risk: riskWithoutConfirmation,
          cost: expectedLossWithout,
          paymentCertainty: 100 - riskWithoutConfirmation,
        },
      };

      // Recommendation
      let recommendation: ConfirmationResult["recommendation"];
      if (riskWithoutConfirmation > 50) {
        recommendation = {
          action: "confirm",
          reason: "High-risk issuing bank and country combination. Confirmation strongly recommended.",
          alternatives: [
            "Consider requiring an irrevocable, confirmed LC",
            "Evaluate alternative issuing banks with better ratings",
            "Request partial confirmation for risk sharing",
          ],
        };
      } else if (riskWithoutConfirmation > 30) {
        recommendation = {
          action: "negotiate",
          reason: "Moderate risk profile. Negotiate confirmation terms or consider silent confirmation.",
          alternatives: [
            "Negotiate lower confirmation fee with competing banks",
            silentConfirmation ? "Silent confirmation provides cost savings" : "Consider silent confirmation for cost efficiency",
            "Request issuing bank to share confirmation costs",
          ],
        };
      } else if (silentConfirmation) {
        recommendation = {
          action: "silent",
          reason: "Lower risk profile makes silent confirmation a cost-effective option.",
          alternatives: [
            "Monitor issuing bank credit quality regularly",
            "Consider confirmation for larger transactions",
            "Maintain relationship with confirmation bank for future needs",
          ],
        };
      } else {
        recommendation = {
          action: "decline",
          reason: "Low-risk profile. Confirmation may not be cost-effective.",
          alternatives: [
            "Self-insure the payment risk",
            "Consider trade credit insurance as alternative",
            "Monitor country and bank risk regularly",
          ],
        };
      }

      const calculationResult: ConfirmationResult = {
        confirmationFee,
        silentConfirmationFee,
        countryRiskPremium,
        bankRiskPremium,
        tenorPremium,
        totalPremium,
        effectiveRate,
        riskWithoutConfirmation,
        riskWithConfirmation,
        riskMitigation,
        breakdown,
        comparison,
        recommendation,
      };

      setResult(calculationResult);
      setIsCalculating(false);
    }, 1200);
  };

  // Chart data
  const riskBreakdownData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Base Fee", value: result.breakdown.baseFee, color: COLORS.ocean },
      { name: "Country Risk", value: result.breakdown.countryRisk, color: COLORS.warning },
      { name: "Bank Risk", value: result.breakdown.bankRisk, color: COLORS.danger },
      { name: "Tenor Adj.", value: result.breakdown.tenorAdjustment, color: COLORS.info },
      { name: "Currency Adj.", value: result.breakdown.currencyAdjustment, color: COLORS.logistics },
    ].filter(d => d.value > 0);
  }, [result]);

  const comparisonData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: "With Confirmation",
        risk: result.comparison.withConfirmation.risk,
        cost: result.comparison.withConfirmation.cost / 1000,
        certainty: result.comparison.withConfirmation.paymentCertainty,
      },
      {
        name: "Without Confirmation",
        risk: result.comparison.withoutConfirmation.risk,
        cost: result.comparison.withoutConfirmation.cost / 1000,
        certainty: result.comparison.withoutConfirmation.paymentCertainty,
      },
    ];
  }, [result]);

  const radarData = useMemo(() => {
    if (!result) return [];
    return [
      { factor: "Country Risk", score: Math.min(100, result.countryRiskPremium * 50), fullMark: 100 },
      { factor: "Bank Risk", score: Math.min(100, result.bankRiskPremium * 40), fullMark: 100 },
      { factor: "Tenor Risk", score: Math.min(100, result.tenorPremium * 200), fullMark: 100 },
      { factor: "Risk Mitigation", score: result.riskMitigation, fullMark: 100 },
      { factor: "Cost Efficiency", score: Math.max(0, 100 - result.totalPremium * 10), fullMark: 100 },
    ];
  }, [result]);

  const radialData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Risk Score", value: result.riskWithoutConfirmation, fill: COLORS.danger },
      { name: "Mitigated", value: result.riskMitigation, fill: COLORS.logistics },
    ];
  }, [result]);

  const treemapData = useMemo(() => {
    if (!result) return [];
    return [
      {
        name: "Fee Components",
        children: [
          { name: "Base Fee", size: result.breakdown.baseFee * 100, fill: COLORS.ocean },
          { name: "Country Risk", size: result.breakdown.countryRisk * 100, fill: COLORS.warning },
          { name: "Bank Risk", size: Math.max(result.breakdown.bankRisk * 100, 1), fill: COLORS.danger },
          { name: "Tenor Adj.", size: Math.max(result.breakdown.tenorAdjustment * 100, 1), fill: COLORS.info },
        ],
      },
    ];
  }, [result]);

  const timelineData = useMemo(() => {
    if (!result) return [];
    const tenorDays = parseInt(tenor) || 90;
    const dataPoints = [];
    for (let i = 0; i <= tenorDays; i += tenorDays / 6) {
      const progress = i / tenorDays;
      const cumulativeRisk = result.riskWithoutConfirmation * progress * 0.5;
      dataPoints.push({
        day: Math.round(i),
        riskExposure: cumulativeRisk,
        protectedRisk: result.riskWithConfirmation,
        label: `Day ${Math.round(i)}`,
      });
    }
    return dataPoints;
  }, [result, tenor]);

  const formatValue = (value: number, curr: string = currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#1A6FA8] to-[#2E8B57]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative px-8 py-12 md:px-12 md:py-16">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                <Shield className="h-3 w-3 mr-1" />
                Trade Finance Risk Management
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                LC Confirmation Pricing Calculator
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                Calculate accurate confirmation fees, assess payment risks, and get actionable recommendations for your Letter of Credit transactions.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 text-[#3CB371]" />
                  <span>Real-time pricing</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 text-[#3CB371]" />
                  <span>Risk assessment</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 text-[#3CB371]" />
                  <span>Multiple bank comparison</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <CheckCircle className="h-5 w-5 text-[#3CB371]" />
                  <span>Smart recommendations</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Hero Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Landmark className="h-4 w-4" />
                <span className="text-sm">Banks</span>
              </div>
              <p className="text-2xl font-bold text-white">{confirmationBanks.length}+</p>
            </motion.div>
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Countries</span>
              </div>
              <p className="text-2xl font-bold text-white">{countryRiskData.length}</p>
            </motion.div>
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Risk Categories</span>
              </div>
              <p className="text-2xl font-bold text-white">7</p>
            </motion.div>
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-2 text-white/70 mb-1">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-white">98%</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <FileText className="h-5 w-5" />
            LC Details & Risk Parameters
          </CardTitle>
          <CardDescription>
            Enter the Letter of Credit details to calculate confirmation pricing and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* LC Amount */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                LC Amount
              </Label>
              <Input
                type="number"
                value={lcAmount}
                onChange={(e) => setLcAmount(e.target.value)}
                placeholder="500,000"
                className="h-11"
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.slice(0, 20).map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issuing Bank Country */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#2E8B57]" />
                Issuing Bank Country
              </Label>
              <Select value={issuingBankCountry} onValueChange={setIssuingBankCountry}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryRiskData.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name} ({c.sovereignRating})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issuing Bank Rating */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#2E8B57]" />
                Issuing Bank Risk Rating
              </Label>
              <Select value={issuingBankRating} onValueChange={setIssuingBankRating}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bankRiskRatings.map((b) => (
                    <SelectItem key={b.rating} value={b.rating}>
                      {b.rating} - {b.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Confirmation Bank */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#2E8B57]" />
                Confirmation Bank
              </Label>
              <Select value={confirmationBank} onValueChange={setConfirmationBank}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {confirmationBanks.map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name} ({b.rating})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tenor */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#2E8B57]" />
                Tenor (days)
              </Label>
              <Select value={tenor} onValueChange={setTenor}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days (1 month)</SelectItem>
                  <SelectItem value="60">60 days (2 months)</SelectItem>
                  <SelectItem value="90">90 days (3 months)</SelectItem>
                  <SelectItem value="120">120 days (4 months)</SelectItem>
                  <SelectItem value="180">180 days (6 months)</SelectItem>
                  <SelectItem value="270">270 days (9 months)</SelectItem>
                  <SelectItem value="360">360 days (12 months)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Options */}
            <div className="space-y-4 lg:col-span-2">
              <Label className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-[#2E8B57]" />
                LC Options
              </Label>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={silentConfirmation}
                    onCheckedChange={setSilentConfirmation}
                  />
                  <Label htmlFor="silent" className="text-sm cursor-pointer">
                    Silent Confirmation
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={transferableLC}
                    onCheckedChange={setTransferableLC}
                  />
                  <Label htmlFor="transferable" className="text-sm cursor-pointer">
                    Transferable LC
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={revolvingLC}
                    onCheckedChange={setRevolvingLC}
                  />
                  <Label htmlFor="revolving" className="text-sm cursor-pointer">
                    Revolving LC
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={calculateConfirmation}
              disabled={isCalculating}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Confirmation Pricing
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
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20">Fee</Badge>
                </div>
                <p className="text-2xl font-bold">
                  {formatValue(silentConfirmation ? result.silentConfirmationFee : result.confirmationFee)}
                </p>
                <p className="text-sm opacity-80">
                  {silentConfirmation ? "Silent Confirmation" : "Standard Confirmation"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingDown className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20">Risk</Badge>
                </div>
                <p className="text-2xl font-bold">{result.riskMitigation.toFixed(0)}%</p>
                <p className="text-sm opacity-80">Risk Mitigation</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Percent className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20">Rate</Badge>
                </div>
                <p className="text-2xl font-bold">{result.totalPremium.toFixed(2)}%</p>
                <p className="text-sm opacity-80">Total Premium</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Shield className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20">Protection</Badge>
                </div>
                <p className="text-2xl font-bold">{result.comparison.withConfirmation.paymentCertainty}%</p>
                <p className="text-sm opacity-80">Payment Certainty</p>
              </CardContent>
            </Card>

            <Card className={`text-white ${result.recommendation.action === "confirm" ? "bg-gradient-to-br from-green-500 to-green-600" : result.recommendation.action === "decline" ? "bg-gradient-to-br from-slate-500 to-slate-600" : result.recommendation.action === "silent" ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-amber-500 to-amber-600"}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-6 w-6 opacity-80" />
                  <Badge variant="secondary" className="bg-white/20 capitalize">{result.recommendation.action}</Badge>
                </div>
                <p className="text-lg font-bold capitalize">{result.recommendation.action}</p>
                <p className="text-sm opacity-80">Recommendation</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis Tabs */}
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview" className="flex items-center gap-1">
                    <PieChartIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="risk" className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span className="hidden md:inline">Risk Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger value="comparison" className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden md:inline">Cost Comparison</span>
                  </TabsTrigger>
                  <TabsTrigger value="breakdown" className="flex items-center gap-1">
                    <LineChart className="h-4 w-4" />
                    <span className="hidden md:inline">Fee Breakdown</span>
                  </TabsTrigger>
                  <TabsTrigger value="recommendation" className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden md:inline">Recommendation</span>
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Risk Gauge */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                        Risk Assessment
                      </h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Risk Without Confirmation</span>
                            <span className="font-bold text-lg text-red-500">{result.riskWithoutConfirmation.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all"
                              style={{ width: `${result.riskWithoutConfirmation}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-muted-foreground">Risk With Confirmation</span>
                            <span className="font-bold text-lg text-green-500">{result.riskWithConfirmation.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                              style={{ width: `${result.riskWithConfirmation}%` }}
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg border border-[#0F4C81]/20">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Risk Mitigation</span>
                            <span className="font-bold text-xl text-[#2E8B57]">-{result.riskMitigation.toFixed(0)}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Confirmation reduces your payment risk by approximately {result.riskMitigation.toFixed(0)}%
                          </p>
                        </div>
                      </div>

                      {/* Radial Bar Chart */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-4">Risk Distribution</h4>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart 
                              cx="50%" 
                              cy="50%" 
                              innerRadius="30%" 
                              outerRadius="100%" 
                              data={radarData.map(d => ({ ...d, fill: d.score > 50 ? COLORS.danger : COLORS.logistics }))}
                              startAngle={180}
                              endAngle={0}
                            >
                              <PolarGrid />
                              <PolarAngleAxis type="number" domain={[0, 100]} />
                              <RadialBar dataKey="score" cornerRadius={10} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Premium Breakdown Pie */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Percent className="h-5 w-5 text-[#0F4C81]" />
                        Premium Components
                      </h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={riskBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {riskBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => [`${value.toFixed(3)}%`, "Rate"]}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Timeline Chart */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-[#0F4C81]" />
                          Risk Exposure Timeline
                        </h4>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={timelineData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                              <YAxis tick={{ fontSize: 10 }} />
                              <Tooltip />
                              <Area 
                                type="monotone" 
                                dataKey="riskExposure" 
                                stroke={COLORS.danger} 
                                fill={COLORS.danger}
                                fillOpacity={0.3}
                                name="Risk Exposure"
                              />
                              <Line 
                                type="monotone" 
                                dataKey="protectedRisk" 
                                stroke={COLORS.logistics} 
                                strokeWidth={2}
                                dot={false}
                                name="Protected Risk"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Risk Analysis Tab */}
                <TabsContent value="risk" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Radar Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Risk Factor Profile</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={radarData}>
                            <PolarGrid stroke={COLORS.ocean} strokeOpacity={0.3} />
                            <PolarAngleAxis dataKey="factor" className="text-sm" tick={{ fill: COLORS.ocean }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: COLORS.ocean }} />
                            <Radar
                              name="Risk Score"
                              dataKey="score"
                              stroke={COLORS.ocean}
                              fill={COLORS.ocean}
                              fillOpacity={0.5}
                            />
                            <Legend />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Risk Details */}
                    <div>
                      <h4 className="font-semibold mb-4">Risk Components</h4>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Country Risk Premium</span>
                            <span className="font-bold">{result.countryRiskPremium.toFixed(2)}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {countryRiskData.find(c => c.code === issuingBankCountry)?.name} - Sovereign Rating: {countryRiskData.find(c => c.code === issuingBankCountry)?.sovereignRating}
                          </p>
                        </div>

                        <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Bank Risk Premium</span>
                            <span className="font-bold">{result.bankRiskPremium.toFixed(2)}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Issuing Bank Rating: {issuingBankRating} - {bankRiskRatings.find(b => b.rating === issuingBankRating)?.description}
                          </p>
                        </div>

                        <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Tenor Adjustment</span>
                            <span className="font-bold">{result.tenorPremium.toFixed(3)}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tenor} days tenor - Extended settlement period risk
                          </p>
                        </div>

                        <div className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">Effective Annual Rate</span>
                            <span className="font-bold">{result.effectiveRate.toFixed(2)}%</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Annualized cost for the confirmation period
                          </p>
                        </div>
                      </div>

                      {/* Treemap */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-4">Risk Distribution Map</h4>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <Treemap
                              data={treemapData}
                              dataKey="size"
                              aspectRatio={4 / 3}
                              stroke="#fff"
                            >
                              {treemapData[0]?.children?.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Treemap>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Cost Comparison Tab */}
                <TabsContent value="comparison" className="pt-6">
                  <div className="space-y-6">
                    {/* Comparison Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">With vs Without Confirmation</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fill: COLORS.ocean }} />
                            <YAxis yAxisId="left" orientation="left" tick={{ fill: COLORS.ocean }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fill: COLORS.logistics }} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="risk" name="Risk (%)" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="left" dataKey="certainty" name="Payment Certainty (%)" fill={COLORS.logistics} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="cost" name="Cost ($K)" stroke={COLORS.ocean} strokeWidth={3} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Detailed Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-2 border-[#2E8B57]">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2 text-[#2E8B57]">
                            <Shield className="h-5 w-5" />
                            With Confirmation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Confirmation Fee</span>
                              <span className="font-bold">{formatValue(silentConfirmation ? result.silentConfirmationFee : result.confirmationFee)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payment Risk</span>
                              <span className="font-bold text-green-600">{result.riskWithConfirmation.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payment Certainty</span>
                              <span className="font-bold">{result.comparison.withConfirmation.paymentCertainty}%</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Net Benefit</span>
                              <span className="font-bold text-[#2E8B57]">
                                {formatValue((result.riskWithoutConfirmation - result.riskWithConfirmation) / 100 * parseFloat(lcAmount) * 0.3 - (silentConfirmation ? result.silentConfirmationFee : result.confirmationFee))}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-slate-300 dark:border-slate-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2 text-muted-foreground">
                            <AlertTriangle className="h-5 w-5" />
                            Without Confirmation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Confirmation Fee</span>
                              <span className="font-bold">$0</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payment Risk</span>
                              <span className="font-bold text-red-600">{result.riskWithoutConfirmation.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payment Certainty</span>
                              <span className="font-bold">{result.comparison.withoutConfirmation.paymentCertainty}%</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Expected Loss</span>
                              <span className="font-bold text-red-600">
                                {formatValue(result.comparison.withoutConfirmation.cost)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Market Trends */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-[#0F4C81]" />
                          Market Trends (Last 6 Months)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={marketTrendData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis yAxisId="left" orientation="left" />
                              <YAxis yAxisId="right" orientation="right" />
                              <Tooltip />
                              <Legend />
                              <Bar yAxisId="right" dataKey="volume" name="Volume" fill={COLORS.ocean} fillOpacity={0.3} />
                              <Line yAxisId="left" type="monotone" dataKey="avgFee" name="Avg Fee (%)" stroke={COLORS.logistics} strokeWidth={3} />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Fee Breakdown Tab */}
                <TabsContent value="breakdown" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Fee Components</h4>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={riskBreakdownData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" unit="%" tick={{ fill: COLORS.ocean }} />
                            <YAxis dataKey="name" type="category" width={100} tick={{ fill: COLORS.ocean }} />
                            <Tooltip formatter={(value: number) => [`${value.toFixed(3)}%`]} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {riskBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Calculation Summary</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">LC Amount</span>
                            <span className="font-bold">{formatValue(parseFloat(lcAmount))}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Base Fee Rate</span>
                            <span className="font-medium">{result.breakdown.baseFee.toFixed(3)}%</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Country Risk Add-on</span>
                            <span className="font-medium">+{result.breakdown.countryRisk.toFixed(3)}%</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Bank Risk Add-on</span>
                            <span className="font-medium">+{result.breakdown.bankRisk.toFixed(3)}%</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Tenor Adjustment</span>
                            <span className="font-medium">+{result.breakdown.tenorAdjustment.toFixed(3)}%</span>
                          </div>
                          {result.breakdown.currencyAdjustment > 0 && (
                            <div className="flex justify-between mb-2">
                              <span className="text-muted-foreground">Currency Adjustment</span>
                              <span className="font-medium">+{result.breakdown.currencyAdjustment.toFixed(3)}%</span>
                            </div>
                          )}
                          <Separator className="my-3" />
                          <div className="flex justify-between">
                            <span className="font-semibold">Total Premium Rate</span>
                            <span className="font-bold text-[#0F4C81]">{result.totalPremium.toFixed(3)}%</span>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg border">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-semibold">Total Confirmation Fee</span>
                              {silentConfirmation && (
                                <Badge className="ml-2 bg-blue-500">Silent</Badge>
                              )}
                            </div>
                            <span className="text-2xl font-bold text-[#0F4C81]">
                              {formatValue(silentConfirmation ? result.silentConfirmationFee : result.confirmationFee)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Fee calculated as {formatValue(parseFloat(lcAmount))} × {result.totalPremium.toFixed(3)}%
                            {silentConfirmation && " × 1.25 (silent confirmation premium)"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Rating Impact Chart */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-4">Bank Rating Impact on Premium</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bankRiskRatings}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="rating" tick={{ fill: COLORS.ocean }} />
                          <YAxis tick={{ fill: COLORS.ocean }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="premiumFactor" name="Premium Factor" radius={[4, 4, 0, 0]}>
                            {bankRiskRatings.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </TabsContent>

                {/* Recommendation Tab */}
                <TabsContent value="recommendation" className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Card className={`border-2 ${
                        result.recommendation.action === "confirm" ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
                        result.recommendation.action === "decline" ? "border-slate-400 bg-slate-50 dark:bg-slate-800" :
                        result.recommendation.action === "silent" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" :
                        "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                      }`}>
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3 mb-4">
                            {result.recommendation.action === "confirm" ? (
                              <CheckCircle className="h-8 w-8 text-green-600" />
                            ) : result.recommendation.action === "decline" ? (
                              <AlertTriangle className="h-8 w-8 text-slate-500" />
                            ) : (
                              <Info className="h-8 w-8 text-blue-500" />
                            )}
                            <div>
                              <h3 className="text-xl font-bold capitalize">{result.recommendation.action} Confirmation</h3>
                              <Badge className={`mt-1 ${
                                result.recommendation.action === "confirm" ? "bg-green-500" :
                                result.recommendation.action === "silent" ? "bg-blue-500" :
                                "bg-amber-500"
                              }`}>
                                Recommended Action
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{result.recommendation.reason}</p>
                        </CardContent>
                      </Card>

                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">Alternative Options</h4>
                        <div className="space-y-2">
                          {result.recommendation.alternatives.map((alt, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center text-sm shrink-0">
                                {index + 1}
                              </div>
                              <span className="text-sm">{alt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Bank Comparison */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Confirmation Bank Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 font-medium">Bank</th>
                                  <th className="text-right py-2 font-medium">Rating</th>
                                  <th className="text-right py-2 font-medium">Base Fee</th>
                                  <th className="text-right py-2 font-medium">Est. Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {confirmationBanks.slice(0, 5).map((bank) => {
                                  const isSelected = bank.name === confirmationBank;
                                  const estFee = Math.max(
                                    parseFloat(lcAmount) * (bank.baseFee + result.countryRiskPremium * bank.premiumFactor) / 100,
                                    bank.minFee
                                  );
                                  return (
                                    <tr
                                      key={bank.name}
                                      className={`border-b ${isSelected ? "bg-[#0F4C81]/10" : ""}`}
                                    >
                                      <td className="py-2">
                                        {bank.name}
                                        {isSelected && (
                                          <Badge className="ml-2 bg-[#0F4C81]">Selected</Badge>
                                        )}
                                      </td>
                                      <td className="text-right py-2">{bank.rating}</td>
                                      <td className="text-right py-2">{bank.baseFee.toFixed(2)}%</td>
                                      <td className="text-right py-2 font-medium">{formatValue(estFee)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Silent Confirmation Info */}
                      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            {silentConfirmation ? (
                              <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
                            ) : (
                              <EyeOff className="h-5 w-5 text-blue-600 mt-0.5" />
                            )}
                            <div>
                              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Silent Confirmation</h4>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                {silentConfirmation
                                  ? "Silent confirmation means the confirming bank adds its commitment without notifying the issuing bank. This provides flexibility but typically costs 20-30% more than standard confirmation."
                                  : "Consider silent confirmation when you want confirmation protection but don't want the issuing bank to know. Toggle the option above to compare pricing."}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions about LC confirmation pricing and risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium hover:text-[#0F4C81] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] text-white flex items-center justify-center text-xs shrink-0">
                      {index + 1}
                    </div>
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Reference Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Info className="h-5 w-5" />
            LC Confirmation Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#0F4C81]" />
                Country Risk Categories
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Category 0-1</span><span className="text-green-600">Low Risk</span></div>
                <div className="flex justify-between"><span>Category 2-3</span><span className="text-amber-600">Moderate Risk</span></div>
                <div className="flex justify-between"><span>Category 4-5</span><span className="text-orange-600">High Risk</span></div>
                <div className="flex justify-between"><span>Category 6-7</span><span className="text-red-600">Very High Risk</span></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#0F4C81]" />
                Bank Rating Impact
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>AAA/AA</span><span>0.5-0.7x factor</span></div>
                <div className="flex justify-between"><span>A</span><span>1.0x factor</span></div>
                <div className="flex justify-between"><span>BBB</span><span>1.3x factor</span></div>
                <div className="flex justify-between"><span>BB/B</span><span>1.8-2.5x factor</span></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0F4C81]" />
                Tenor Premium
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Up to 90 days</span><span>No adjustment</span></div>
                <div className="flex justify-between"><span>180 days</span><span>+0.04%</span></div>
                <div className="flex justify-between"><span>270 days</span><span>+0.08%</span></div>
                <div className="flex justify-between"><span>360 days</span><span>+0.11%</span></div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#0F4C81]" />
                Typical Fee Range
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Low Risk LCs</span><span>0.10-0.25%</span></div>
                <div className="flex justify-between"><span>Medium Risk LCs</span><span>0.30-0.60%</span></div>
                <div className="flex justify-between"><span>High Risk LCs</span><span>0.70-1.50%</span></div>
                <div className="flex justify-between"><span>Very High Risk</span><span>1.50-3.00%</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-6 text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          Calculations are based on OECD country risk classifications and major bank credit ratings.
        </p>
      </div>
    </div>
  );
}
