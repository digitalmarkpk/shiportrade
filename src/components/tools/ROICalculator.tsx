"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  Info,
  RefreshCw,
  Calendar,
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle2,
  LineChart,
  Layers,
  Scale,
  Clock,
  Award,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  ComposedChart,
  Area,
  Line,
  LineChart as RechartsLineChart,
} from "recharts";
import { currencies } from "@/lib/constants/currencies";

interface InvestmentResult {
  // ROI
  totalInvestment: number;
  totalReturns: number;
  netProfit: number;
  roi: number;
  annualizedRoi: number;
  
  // NPV
  npv: number;
  presentValues: number[];
  
  // IRR
  irr: number;
  
  // Payback
  paybackPeriod: number;
  cumulativeCashFlows: number[];
  
  // Profitability Index
  profitabilityIndex: number;
  
  // Analysis
  investmentGrade: 'excellent' | 'good' | 'moderate' | 'poor';
  recommendation: string;
  riskFactors: string[];
  yearlyData: YearlyDataPoint[];
}

interface YearlyDataPoint {
  year: number;
  cashFlow: number;
  presentValue: number;
  cumulative: number;
  discountFactor: number;
}

interface ScenarioData {
  name: string;
  roi: number;
  npv: number;
  irr: number;
  payback: number;
  totalReturn: number;
  grade: string;
}

const FAQS = [
  {
    question: "What is ROI and how is it different from other investment metrics?",
    answer: "Return on Investment (ROI) measures the profitability of an investment as a percentage of the initial cost. Unlike NPV (which gives an absolute dollar value) or IRR (which provides a rate of return), ROI offers a simple, intuitive percentage that's easy to compare across different investments. ROI = ((Total Returns - Initial Investment) / Initial Investment) × 100%. However, ROI doesn't account for the time value of money or investment duration, making Annualized ROI a more accurate measure for comparing investments with different time horizons. For comprehensive analysis, ROI should be used alongside NPV and IRR to get a complete picture of investment performance.",
  },
  {
    question: "What is Net Present Value (NPV) and why is it important?",
    answer: "Net Present Value (NPV) is the sum of all future cash flows discounted back to their present value, minus the initial investment. It represents the absolute value created (or destroyed) by an investment in today's dollars. NPV is considered the gold standard for investment decisions because it accounts for the time value of money—a dollar received today is worth more than a dollar received in the future. A positive NPV indicates the investment creates value and should be accepted. A negative NPV suggests value destruction. NPV is particularly crucial for long-term investments, capital budgeting decisions, and comparing projects with different cash flow patterns. The discount rate used (often WACC) significantly impacts NPV calculations.",
  },
  {
    question: "How is Internal Rate of Return (IRR) calculated and interpreted?",
    answer: "Internal Rate of Return (IRR) is the discount rate that makes the NPV of all cash flows equal to zero. It represents the expected compound annual rate of return on the investment. IRR is calculated iteratively using numerical methods (like Newton-Raphson) since there's no closed-form solution. To interpret IRR, compare it to your required rate of return (hurdle rate) or Weighted Average Cost of Capital (WACC). If IRR exceeds your hurdle rate, the investment creates value. IRR is useful because it provides a single percentage figure that's easy to communicate and compare. However, IRR can be misleading for projects with unconventional cash flows (multiple sign changes) or when comparing mutually exclusive projects with different scales or durations.",
  },
  {
    question: "What is the Payback Period and when should I use it?",
    answer: "Payback Period measures how long it takes to recover the initial investment from cash inflows. It's a simple, intuitive metric that's particularly useful for assessing liquidity risk and investment recovery. Shorter payback periods indicate lower risk and faster capital recovery. However, payback period has significant limitations: it ignores the time value of money (unless using discounted payback), ignores all cash flows after the payback point, and doesn't measure profitability. Despite these limitations, payback period is valuable for cash-constrained businesses, industries with rapid technological change, or situations where investment risk decreases substantially after capital recovery. A common rule of thumb is that projects should have payback periods shorter than half the project duration.",
  },
  {
    question: "How do I choose the right discount rate for NPV calculations?",
    answer: "The discount rate represents your opportunity cost of capital—the return you could earn on alternative investments of similar risk. For businesses, Weighted Average Cost of Capital (WACC) is commonly used, blending the cost of equity and debt financing weighted by their proportions in the capital structure. For personal investments, consider your required rate of return based on risk tolerance and alternative opportunities. Higher-risk projects warrant higher discount rates (15-25%), while stable, established operations may use lower rates (8-12%). Trade finance projects typically use 10-18% depending on country risk, counterparty risk, and market volatility. Always perform sensitivity analysis with different discount rates to understand how rate changes affect NPV.",
  },
  {
    question: "What is the Profitability Index and how does it differ from NPV?",
    answer: "Profitability Index (PI) is the ratio of the present value of future cash flows to the initial investment: PI = PV of Cash Flows / Initial Investment. A PI greater than 1.0 indicates a positive NPV and value creation. While NPV gives an absolute value, PI provides a relative measure useful for comparing projects of different sizes or when capital is limited. PI is particularly valuable for capital rationing—when you have a budget constraint and need to select the best combination of projects. Projects with higher PI should be prioritized. For example, if Project A has PI of 1.5 and Project B has PI of 1.3, Project A creates more value per dollar invested, making it preferable when you can't fund both.",
  },
  {
    question: "How should I interpret conflicting signals between NPV and IRR?",
    answer: "NPV and IRR can give conflicting signals when comparing mutually exclusive projects, especially when projects differ significantly in scale (investment size), timing of cash flows, or duration. This is known as the 'NPV-IRR conflict.' When they conflict, NPV should be the primary decision criterion because it directly measures value creation in dollar terms. IRR can be misleading because it assumes reinvestment at the IRR rate, while NPV assumes reinvestment at the discount rate (which is more realistic). Additionally, projects with non-conventional cash flows (multiple sign changes) can have multiple IRRs or no real IRR, making NPV the more reliable metric. Use IRR as supplementary information and for communication purposes, but rely on NPV for investment decisions.",
  },
];

const PRO_TIPS = [
  {
    title: "Use Multiple Metrics",
    description: "Never rely on a single metric. Combine ROI, NPV, IRR, and Payback Period for a complete investment picture. Each metric captures different aspects of investment performance.",
    icon: BarChart3,
  },
  {
    title: "Perform Sensitivity Analysis",
    description: "Test your assumptions by varying key inputs like discount rate, cash flows, and project duration. This reveals which variables most impact your investment outcomes.",
    icon: Target,
  },
  {
    title: "Consider Risk-Adjusted Returns",
    description: "Higher returns usually come with higher risk. Adjust your required return based on project risk, or use risk-adjusted metrics like risk-adjusted NPV or certainty equivalents.",
    icon: Scale,
  },
  {
    title: "Account for Working Capital",
    description: "Many investments require working capital that ties up cash. Include this in your initial investment and remember it's typically recovered at project end.",
    icon: DollarSign,
  },
  {
    title: "Time Your Cash Flows Correctly",
    description: "Be precise about when cash flows occur—beginning, middle, or end of periods. This timing significantly affects NPV and IRR calculations for long-term projects.",
    icon: Clock,
  },
];

const INVESTMENT_BENCHMARKS = [
  { sector: "Trading/Import", irrRange: "15-25%", paybackRange: "6-18 months", risk: "Medium" },
  { sector: "Manufacturing", irrRange: "12-20%", paybackRange: "3-5 years", risk: "Medium-High" },
  { sector: "Logistics", irrRange: "10-15%", paybackRange: "4-7 years", risk: "Medium" },
  { sector: "Warehousing", irrRange: "8-12%", paybackRange: "5-10 years", risk: "Low-Medium" },
  { sector: "Technology", irrRange: "20-35%", paybackRange: "2-4 years", risk: "High" },
  { sector: "Real Estate", irrRange: "8-15%", paybackRange: "7-15 years", risk: "Low-Medium" },
];

const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  excellent: "#10B981",
  good: "#22C55E",
  moderate: "#F59E0B",
  poor: "#EF4444",
};

export default function ROICalculator() {
  const [initialInvestment, setInitialInvestment] = useState("100000");
  const [annualCashFlow, setAnnualCashFlow] = useState("30000");
  const [projectYears, setProjectYears] = useState("5");
  const [salvageValue, setSalvageValue] = useState("10000");
  const [discountRate, setDiscountRate] = useState("10");
  const [currency, setCurrency] = useState("USD");
  const [activeTab, setActiveTab] = useState("calculator");
  const [calculatedResult, setCalculatedResult] = useState<InvestmentResult | null>(null);

  const calculateInvestment = useMemo(() => {
    const investment = parseFloat(initialInvestment) || 0;
    const cashFlow = parseFloat(annualCashFlow) || 0;
    const years = parseInt(projectYears) || 1;
    const salvage = parseFloat(salvageValue) || 0;
    const rate = parseFloat(discountRate) || 0;

    // Total returns
    const totalReturns = cashFlow * years + salvage;
    const netProfit = totalReturns - investment;

    // ROI
    const roi = investment > 0 ? (netProfit / investment) * 100 : 0;
    const annualizedRoi = investment > 0 && totalReturns > 0 
      ? (Math.pow(totalReturns / investment, 1 / years) - 1) * 100 
      : 0;

    // Present values and cumulative cash flows
    const presentValues: number[] = [];
    const cumulativeCashFlows: number[] = [];
    const yearlyData: YearlyDataPoint[] = [];
    
    let cumulative = -investment;
    
    for (let i = 1; i <= years; i++) {
      const yearCashFlow = i === years ? cashFlow + salvage : cashFlow;
      const discountFactor = 1 / Math.pow(1 + rate / 100, i);
      const pv = yearCashFlow * discountFactor;
      presentValues.push(pv);
      
      cumulative += yearCashFlow;
      cumulativeCashFlows.push(cumulative);
      
      yearlyData.push({
        year: i,
        cashFlow: yearCashFlow,
        presentValue: pv,
        cumulative,
        discountFactor,
      });
    }

    // NPV
    const npv = presentValues.reduce((sum, pv) => sum + pv, 0) - investment;

    // Payback period
    let paybackPeriod = 0;
    let remaining = investment;
    for (let i = 1; i <= years; i++) {
      const yearCash = i === years ? cashFlow + salvage : cashFlow;
      if (remaining > 0) {
        if (yearCash >= remaining) {
          paybackPeriod = i - 1 + remaining / yearCash;
          remaining = 0;
        } else {
          remaining -= yearCash;
        }
      }
    }
    if (remaining > 0) paybackPeriod = years + remaining / cashFlow;

    // IRR calculation (Newton-Raphson method)
    let irrGuess = 0.1;
    for (let iter = 0; iter < 100; iter++) {
      let npvAtGuess = -investment;
      let derivativeNpv = 0;
      
      for (let i = 1; i <= years; i++) {
        const yearCashFlow = i === years ? cashFlow + salvage : cashFlow;
        npvAtGuess += yearCashFlow / Math.pow(1 + irrGuess, i);
        derivativeNpv -= i * yearCashFlow / Math.pow(1 + irrGuess, i + 1);
      }
      
      if (Math.abs(npvAtGuess) < 0.0001) break;
      if (derivativeNpv !== 0) {
        irrGuess = irrGuess - npvAtGuess / derivativeNpv;
      }
    }
    const irr = irrGuess * 100;

    // Profitability Index
    const pvOfCashFlows = presentValues.reduce((sum, pv) => sum + pv, 0);
    const profitabilityIndex = investment > 0 ? pvOfCashFlows / investment : 0;

    // Investment Grade
    let investmentGrade: 'excellent' | 'good' | 'moderate' | 'poor';
    if (npv > investment * 0.3 && irr > rate * 1.5) {
      investmentGrade = 'excellent';
    } else if (npv > 0 && irr > rate) {
      investmentGrade = 'good';
    } else if (npv >= -investment * 0.1) {
      investmentGrade = 'moderate';
    } else {
      investmentGrade = 'poor';
    }

    // Risk factors
    const riskFactors: string[] = [];
    if (paybackPeriod > years * 0.7) {
      riskFactors.push('Long payback period increases investment risk');
    }
    if (irr < rate) {
      riskFactors.push('IRR below required return rate');
    }
    if (profitabilityIndex < 1) {
      riskFactors.push('Profitability index below 1.0 indicates negative value creation');
    }
    if (years > 5) {
      riskFactors.push('Long project duration increases uncertainty');
    }
    if (salvage > investment * 0.3) {
      riskFactors.push('High reliance on salvage value for returns');
    }

    // Recommendation
    let recommendation = '';
    if (investmentGrade === 'excellent') {
      recommendation = 'Strong investment opportunity with excellent returns. Consider increasing investment allocation and prioritize this project in your capital budget.';
    } else if (investmentGrade === 'good') {
      recommendation = 'Attractive investment with positive expected returns. Proceed with due diligence and consider risk mitigation strategies.';
    } else if (investmentGrade === 'moderate') {
      recommendation = 'Marginal investment. Consider risk mitigation strategies, renegotiate terms, or explore alternative opportunities with better returns.';
    } else {
      recommendation = 'Investment does not meet minimum return criteria. Strongly consider alternative uses of capital or significant project restructuring.';
    }

    return {
      totalInvestment: investment,
      totalReturns,
      netProfit,
      roi,
      annualizedRoi,
      npv,
      presentValues,
      irr,
      paybackPeriod,
      cumulativeCashFlows,
      profitabilityIndex,
      investmentGrade,
      recommendation,
      riskFactors,
      yearlyData,
    };
  }, [initialInvestment, annualCashFlow, projectYears, salvageValue, discountRate]);

  const handleCalculate = () => {
    setCalculatedResult(calculateInvestment);
  };

  const resetForm = () => {
    setInitialInvestment("100000");
    setAnnualCashFlow("30000");
    setProjectYears("5");
    setSalvageValue("10000");
    setDiscountRate("10");
    setCalculatedResult(null);
  };

  const currencyData = currencies.find(c => c.code === currency);
  const currencySymbol = currencyData?.symbol || "$";

  // Chart data
  const cashFlowChartData = calculateInvestment.yearlyData.map((item) => ({
    name: `Year ${item.year}`,
    cashFlow: item.cashFlow,
    presentValue: item.presentValue,
    cumulative: item.cumulative,
  }));

  const roiComparisonData = [
    { name: "Your Investment", roi: calculateInvestment.roi, fill: COLORS.ocean },
    { name: "Market Average", roi: 15, fill: COLORS.logistics },
    { name: "Risk-Free Rate", roi: 5, fill: "#94A3B8" },
  ];

  const costBreakdownData = [
    { name: "Initial Investment", value: calculateInvestment.totalInvestment, fill: COLORS.poor },
    { name: "Net Profit", value: Math.max(0, calculateInvestment.netProfit), fill: COLORS.excellent },
  ];

  // Scenario analysis
  const scenarios: ScenarioData[] = useMemo(() => {
    const investment = parseFloat(initialInvestment) || 100000;
    const years = parseInt(projectYears) || 5;
    const salvage = parseFloat(salvageValue) || 10000;
    const rate = parseFloat(discountRate) || 10;
    
    const scenarioCashFlows = [
      { name: "Conservative (-20%)", multiplier: 0.8 },
      { name: "Base Case", multiplier: 1.0 },
      { name: "Optimistic (+20%)", multiplier: 1.2 },
      { name: "Best Case (+40%)", multiplier: 1.4 },
    ];

    return scenarioCashFlows.map((scenario) => {
      const adjCashFlow = (parseFloat(annualCashFlow) || 30000) * scenario.multiplier;
      const totalReturn = adjCashFlow * years + salvage;
      const netProfit = totalReturn - investment;
      const roi = (netProfit / investment) * 100;
      
      // Calculate NPV for scenario
      let npv = -investment;
      for (let i = 1; i <= years; i++) {
        const cf = i === years ? adjCashFlow + salvage : adjCashFlow;
        npv += cf / Math.pow(1 + rate / 100, i);
      }
      
      // Calculate IRR for scenario
      let irrGuess = 0.1;
      for (let iter = 0; iter < 50; iter++) {
        let npvAtGuess = -investment;
        let deriv = 0;
        for (let i = 1; i <= years; i++) {
          const cf = i === years ? adjCashFlow + salvage : adjCashFlow;
          npvAtGuess += cf / Math.pow(1 + irrGuess, i);
          deriv -= i * cf / Math.pow(1 + irrGuess, i + 1);
        }
        if (Math.abs(npvAtGuess) < 0.0001) break;
        if (deriv !== 0) irrGuess = irrGuess - npvAtGuess / deriv;
      }
      
      // Payback for scenario
      let payback = 0;
      let remaining = investment;
      for (let i = 1; i <= years; i++) {
        const cf = i === years ? adjCashFlow + salvage : adjCashFlow;
        if (remaining > 0) {
          if (cf >= remaining) {
            payback = i - 1 + remaining / cf;
            remaining = 0;
          } else {
            remaining -= cf;
          }
        }
      }
      
      let grade = "Poor";
      if (npv > investment * 0.3) grade = "Excellent";
      else if (npv > 0) grade = "Good";
      else if (npv > -investment * 0.1) grade = "Moderate";
      
      return {
        name: scenario.name,
        roi: roi,
        npv: npv,
        irr: irrGuess * 100,
        payback: payback,
        totalReturn: totalReturn,
        grade: grade,
      };
    });
  }, [initialInvestment, annualCashFlow, projectYears, salvageValue, discountRate]);

  const getGradeColor = (grade: string) => {
    switch (grade.toLowerCase()) {
      case 'excellent': return COLORS.excellent;
      case 'good': return COLORS.good;
      case 'moderate': return COLORS.moderate;
      case 'poor': return COLORS.poor;
      default: return COLORS.moderate;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[var(--ocean)] text-white">
                <BarChart3 className="h-3 w-3 mr-1" />
                Financial Analysis
              </Badge>
              <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                <Zap className="h-3 w-3 mr-1" />
                Investment
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              ROI / NPV / IRR Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Comprehensive investment analysis for capital budgeting decisions. Calculate Return on Investment, 
              Net Present Value, Internal Rate of Return, and Payback Period with detailed scenario analysis.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Scenarios</span>
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

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                    Investment Parameters
                  </CardTitle>
                  <CardDescription>Enter your project financial details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.slice(0, 20).map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code} ({c.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Investment Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-[var(--ocean)]" />
                      Investment Details
                    </h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="initialInvestment">Initial Investment *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                        <Input
                          id="initialInvestment"
                          type="number"
                          value={initialInvestment}
                          onChange={(e) => setInitialInvestment(e.target.value)}
                          className="pl-8"
                          placeholder="100000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="annualCashFlow">Annual Cash Flow</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                          <Input
                            id="annualCashFlow"
                            type="number"
                            value={annualCashFlow}
                            onChange={(e) => setAnnualCashFlow(e.target.value)}
                            className="pl-8"
                            placeholder="30000"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectYears">Project Years</Label>
                        <Input
                          id="projectYears"
                          type="number"
                          min="1"
                          max="30"
                          value={projectYears}
                          onChange={(e) => setProjectYears(e.target.value)}
                          placeholder="5"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salvageValue">Salvage/Terminal Value</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                        <Input
                          id="salvageValue"
                          type="number"
                          value={salvageValue}
                          onChange={(e) => setSalvageValue(e.target.value)}
                          className="pl-8"
                          placeholder="10000"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Residual value at project end</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Discount Rate */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-[var(--ocean)]" />
                      Required Return
                    </h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discountRate">Discount Rate (WACC)</Label>
                      <div className="relative">
                        <Input
                          id="discountRate"
                          type="number"
                          step="0.5"
                          value={discountRate}
                          onChange={(e) => setDiscountRate(e.target.value)}
                          placeholder="10"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Weighted Average Cost of Capital or required return rate</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCalculate}
                      className="flex-1 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] hover:opacity-90"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Analyze Investment
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                    Investment Analysis Results
                  </CardTitle>
                  <CardDescription>Key financial metrics and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Primary Metrics */}
                  <div className="grid grid-cols-3 gap-3">
                    <motion.div
                      key={calculateInvestment.roi}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className={`rounded-xl p-4 text-center text-white ${
                        calculateInvestment.investmentGrade === 'excellent' ? 'bg-emerald-500' :
                        calculateInvestment.investmentGrade === 'good' ? 'bg-[var(--logistics)]' :
                        calculateInvestment.investmentGrade === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    >
                      <p className="text-sm opacity-90 mb-1">ROI</p>
                      <p className="text-2xl font-bold">{calculateInvestment.roi.toFixed(1)}%</p>
                    </motion.div>
                    <motion.div
                      key={calculateInvestment.npv}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean)]/80 rounded-xl p-4 text-white text-center"
                    >
                      <p className="text-sm opacity-90 mb-1">NPV</p>
                      <p className="text-xl font-bold">{currencySymbol}{calculateInvestment.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </motion.div>
                    <motion.div
                      key={calculateInvestment.irr}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-br from-[var(--logistics)] to-[var(--logistics)]/80 rounded-xl p-4 text-white text-center"
                    >
                      <p className="text-sm opacity-90 mb-1">IRR</p>
                      <p className="text-2xl font-bold">{calculateInvestment.irr.toFixed(1)}%</p>
                    </motion.div>
                  </div>

                  {/* Investment Grade */}
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Investment Grade</p>
                    <Badge className={`text-lg px-4 py-2 ${
                      calculateInvestment.investmentGrade === 'excellent' ? 'bg-emerald-500' :
                      calculateInvestment.investmentGrade === 'good' ? 'bg-[var(--logistics)]' :
                      calculateInvestment.investmentGrade === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                    }`}>
                      <Award className="h-4 w-4 mr-2" />
                      {calculateInvestment.investmentGrade.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-[var(--ocean)]" />
                        <span className="text-sm text-muted-foreground">Payback Period</span>
                      </div>
                      <p className="text-xl font-bold text-[var(--ocean)]">{calculateInvestment.paybackPeriod.toFixed(1)} years</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <PieChart className="h-4 w-4 text-[var(--logistics)]" />
                        <span className="text-sm text-muted-foreground">Profitability Index</span>
                      </div>
                      <p className="text-xl font-bold text-[var(--logistics)]">{calculateInvestment.profitabilityIndex.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Investment</span>
                      <span className="font-medium">{currencySymbol}{calculateInvestment.totalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Total Returns</span>
                      <span className="font-medium">{currencySymbol}{calculateInvestment.totalReturns.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Net Profit</span>
                      <span className={`font-bold ${calculateInvestment.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {currencySymbol}{calculateInvestment.netProfit.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Annualized ROI</span>
                      <Badge variant="secondary">{calculateInvestment.annualizedRoi.toFixed(1)}%</Badge>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className={`rounded-lg p-4 ${
                    calculateInvestment.investmentGrade === 'excellent' || calculateInvestment.investmentGrade === 'good' 
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800' 
                      : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Info className={`h-4 w-4 ${
                        calculateInvestment.investmentGrade === 'excellent' || calculateInvestment.investmentGrade === 'good'
                          ? 'text-emerald-600' : 'text-amber-600'
                      }`} />
                      <p className={`font-semibold ${
                        calculateInvestment.investmentGrade === 'excellent' || calculateInvestment.investmentGrade === 'good'
                          ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                      }`}>Recommendation</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{calculateInvestment.recommendation}</p>
                  </div>

                  {/* Risk Factors */}
                  {calculateInvestment.riskFactors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <p className="font-semibold text-red-700 dark:text-red-400">Risk Factors</p>
                      </div>
                      <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                        {calculateInvestment.riskFactors.map((factor, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <ArrowDownRight className="h-4 w-4 shrink-0 mt-0.5" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cash Flow Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                  Cash Flow Timeline
                </CardTitle>
                <CardDescription>Year-by-year cash flow and cumulative returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={cashFlowChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke={COLORS.ocean} />
                      <YAxis yAxisId="right" orientation="right" stroke={COLORS.logistics} />
                      <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="cashFlow" name="Annual Cash Flow" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Cumulative" stroke={COLORS.logistics} strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Present Value Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Present Value Analysis
                </CardTitle>
                <CardDescription>Discounted value of future cash flows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cashFlowChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="presentValue" name="Present Value" fill={COLORS.logistics} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* ROI Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  ROI Comparison
                </CardTitle>
                <CardDescription>Your investment vs. benchmark returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roiComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, Math.max(calculateInvestment.roi + 10, 30)]} />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="roi" name="ROI %" radius={[4, 4, 0, 0]}>
                        {roiComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-[var(--logistics)]" />
                  Investment Breakdown
                </CardTitle>
                <CardDescription>Capital allocation analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--logistics)]" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">{calculateInvestment.roi.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Total ROI</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">{calculateInvestment.annualizedRoi.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Annualized ROI</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">{calculateInvestment.paybackPeriod.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Years to Payback</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold" style={{ color: getGradeColor(calculateInvestment.investmentGrade) }}>
                    {calculateInvestment.investmentGrade.toUpperCase()}
                  </div>
                  <div className="text-sm text-muted-foreground">Investment Grade</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                What-If Scenario Analysis
              </CardTitle>
              <CardDescription>
                Compare investment outcomes under different cash flow assumptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Scenario</th>
                      <th className="text-center py-3 px-4 font-semibold">ROI</th>
                      <th className="text-center py-3 px-4 font-semibold">NPV</th>
                      <th className="text-center py-3 px-4 font-semibold">IRR</th>
                      <th className="text-center py-3 px-4 font-semibold">Payback</th>
                      <th className="text-center py-3 px-4 font-semibold">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((scenario, index) => (
                      <motion.tr
                        key={scenario.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border-b border-border ${scenario.name === "Base Case" ? "bg-muted/30" : ""}`}
                      >
                        <td className="py-3 px-4 font-medium">
                          {scenario.name === "Base Case" && (
                            <Badge className="mr-2 bg-[var(--ocean)]">Current</Badge>
                          )}
                          {scenario.name}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={scenario.roi >= 0 ? "text-[var(--logistics)]" : "text-red-600"}>
                            {scenario.roi.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={scenario.npv >= 0 ? "text-[var(--logistics)]" : "text-red-600"}>
                            {currencySymbol}{scenario.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className={scenario.irr >= parseFloat(discountRate) ? "text-[var(--logistics)]" : "text-red-600"}>
                            {scenario.irr.toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          {scenario.payback.toFixed(1)} yrs
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge style={{ backgroundColor: getGradeColor(scenario.grade), color: "white" }}>
                            {scenario.grade}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Visualization */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ROI by Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                      <Bar dataKey="roi" name="ROI %" fill={COLORS.ocean} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>NPV by Scenario</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                      <Bar dataKey="npv" name="NPV" fill={COLORS.logistics} radius={[4, 4, 0, 0]}>
                        {scenarios.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.npv >= 0 ? COLORS.logistics : COLORS.poor} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pro Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Investment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Explained */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding Investment Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Investment analysis uses multiple metrics to evaluate project viability. Understanding each metric 
                  helps make better capital allocation decisions and ensures comprehensive risk assessment. Each metric 
                  captures different aspects of investment performance, and using them together provides a complete picture.
                </p>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                    <div>
                      <strong>ROI (Return on Investment):</strong>
                      <span className="text-muted-foreground"> Simple return percentage over the entire investment period. Best for quick comparisons but ignores time value of money.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                    <div>
                      <strong>NPV (Net Present Value):</strong>
                      <span className="text-muted-foreground"> Sum of discounted future cash flows minus investment. The gold standard for investment decisions—positive NPV creates value.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                    <div>
                      <strong>IRR (Internal Rate of Return):</strong>
                      <span className="text-muted-foreground"> The discount rate where NPV equals zero. Compare against your hurdle rate—higher is better.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                    <div>
                      <strong>Payback Period:</strong>
                      <span className="text-muted-foreground"> Time to recover initial investment. Useful for liquidity assessment but ignores post-payback returns.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowUpRight className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                    <div>
                      <strong>Profitability Index:</strong>
                      <span className="text-muted-foreground"> Ratio of PV benefits to costs. Greater than 1.0 indicates value creation; useful for capital rationing.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decision Criteria */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                  Decision Criteria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  When evaluating investments, use these criteria to make informed decisions. A combination of positive 
                  indicators strengthens the investment case, while any red flags warrant additional due diligence or risk mitigation strategies.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                    <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm"><strong>Accept if:</strong> NPV &gt; 0 and IRR &gt; WACC (discount rate)</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                    <span className="text-sm"><strong>Reject if:</strong> NPV &lt; 0 or IRR &lt; WACC (discount rate)</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <Calendar className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="text-sm"><strong>Payback:</strong> Shorter is better; compare to target recovery period</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                    <PieChart className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="text-sm"><strong>PI &gt; 1:</strong> Creates value per dollar invested; PI &lt; 1 destroys value</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industry Benchmarks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Industry Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2">Sector</th>
                        <th className="text-center p-2">Target IRR</th>
                        <th className="text-center p-2">Payback Range</th>
                        <th className="text-center p-2">Risk Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVESTMENT_BENCHMARKS.map((benchmark, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="p-2 font-medium">{benchmark.sector}</td>
                          <td className="text-center p-2 text-[var(--logistics)]">{benchmark.irrRange}</td>
                          <td className="text-center p-2">{benchmark.paybackRange}</td>
                          <td className="text-center p-2">
                            <Badge variant="outline" className="text-xs">{benchmark.risk}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about investment analysis and capital budgeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                          <HelpCircle className="h-4 w-4 text-[var(--ocean)]" />
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-12">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[var(--ocean)]/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-[var(--ocean)]" />
                  Key Formulas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="font-mono text-xs bg-muted/50 p-2 rounded">
                  ROI = (Net Profit / Investment) × 100
                </div>
                <div className="font-mono text-xs bg-muted/50 p-2 rounded">
                  NPV = Σ(CF_t / (1+r)^t) - I₀
                </div>
                <div className="font-mono text-xs bg-muted/50 p-2 rounded">
                  PI = PV(Cash Flows) / Initial Investment
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[var(--logistics)]/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
                  Decision Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  NPV &gt; 0 → Accept
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  IRR &gt; WACC → Accept
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  PI &gt; 1.0 → Accept
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500/5 to-transparent">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Common Pitfalls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  Ignoring time value of money
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  Using wrong discount rate
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  Overestimating cash flows
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
