"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calculator,
  TrendingDown,
  TrendingUp,
  Shield,
  AlertTriangle,
  Info,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
  RefreshCw,
  Download,
  Share2,
  DollarSign,
  Percent,
  Gauge,
  Target,
  Zap,
  ArrowRight,
  Building,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Settings,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Award,
  Users,
  Globe,
  Lock,
  PieChart,
  TrendingUp as TrendUpIcon,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLine,
  Line,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";
const COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

// Types
interface TCORInputs {
  // Insurance Premium Costs
  propertyInsurance: number;
  liabilityInsurance: number;
  cargoInsurance: number;
  workersComp: number;
  autoInsurance: number;
  otherInsurance: number;

  // Retained Losses
  deductiblesPaid: number;
  selfInsuredLosses: number;
  uninsuredLosses: number;
  retentionDeductible: number;

  // Risk Control Costs
  safetyPrograms: number;
  trainingCosts: number;
  securitySystems: number;
  consultingFees: number;
  lossPrevention: number;

  // Administrative Costs
  claimsManagement: number;
  riskManagementStaff: number;
  insuranceAdministration: number;
  legalFees: number;
  complianceCosts: number;

  // Opportunity Costs
  costOfCapital: number;
  collateralRequirements: number;
  timeValueOfMoney: number;

  // Company Data
  annualRevenue: number;
  currency: string;
}

interface TCORResult {
  insurancePremiums: number;
  retainedLosses: number;
  riskControlCosts: number;
  administrativeCosts: number;
  opportunityCosts: number;
  totalCostOfRisk: number;
  tcorAsPercentOfRevenue: number;
  costPerEmployee: number;
}

interface BenchmarkData {
  industry: string;
  tcorPercent: number;
  description: string;
}

interface TrendData {
  year: number;
  insurancePremiums: number;
  retainedLosses: number;
  riskControlCosts: number;
  administrativeCosts: number;
  total: number;
}

interface FinancingAlternative {
  type: string;
  description: string;
  pros: string[];
  cons: string[];
  suitable: boolean;
  savingsEstimate: number;
}

// Industry benchmarks
const INDUSTRY_BENCHMARKS: BenchmarkData[] = [
  { industry: "Logistics & Transportation", tcorPercent: 3.2, description: "High risk industry with cargo and liability exposures" },
  { industry: "Manufacturing", tcorPercent: 2.5, description: "Property and workers' compensation focus" },
  { industry: "Retail & E-Commerce", tcorPercent: 1.8, description: "Lower risk but high cargo insurance needs" },
  { industry: "Construction", tcorPercent: 4.5, description: "Highest risk due to project and safety exposures" },
  { industry: "Technology", tcorPercent: 1.2, description: "Low physical risk, high cyber/liability focus" },
  { industry: "Healthcare", tcorPercent: 3.8, description: "Professional liability and workers' comp focus" },
  { industry: "Wholesale Trade", tcorPercent: 2.0, description: "Moderate risk with inventory exposure" },
];

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is Total Cost of Risk (TCOR) and why is it important for my business?",
    answer: "Total Cost of Risk (TCOR) is a comprehensive metric that measures the complete financial impact of risk management on your organization. Unlike traditional insurance cost analysis, TCOR encompasses all costs associated with managing risk, including insurance premiums, retained losses (deductibles and self-insured amounts), risk control investments, administrative expenses, and often-overlooked opportunity costs. Understanding your TCOR is crucial because it reveals the true cost of your risk management strategy, enables meaningful benchmarking against industry peers, identifies opportunities for cost optimization, and supports data-driven decisions about risk financing alternatives. Companies that actively manage their TCOR typically achieve 15-25% cost savings while maintaining or improving their risk profile. TCOR analysis is particularly valuable for organizations with revenues exceeding $10 million, where the complexity of risk exposures justifies a holistic approach to risk cost management."
  },
  {
    question: "How do I calculate my company's TCOR percentage and what does it mean?",
    answer: "Your TCOR percentage is calculated by dividing your Total Cost of Risk by your annual revenue and multiplying by 100. For example, if your TCOR is $800,000 and your revenue is $25,000,000, your TCOR percentage would be 3.2%. This percentage serves as a powerful benchmarking tool, allowing you to compare your risk management efficiency against industry standards and best-in-class performers. Generally, a lower TCOR percentage indicates more efficient risk management, though this must be balanced against your risk appetite and coverage adequacy. Industry averages typically range from 1.2% for low-risk sectors like technology to 4.5% for high-risk industries like construction. If your TCOR percentage exceeds industry averages, it may indicate opportunities for improvement through better loss control, alternative risk financing, or coverage optimization. Conversely, an unusually low TCOR might suggest underinsurance or inadequate risk transfer."
  },
  {
    question: "What are the main components of TCOR and how do they interact?",
    answer: "TCOR consists of five interconnected components that together represent your total risk management expenditure. Insurance Premiums represent the cost of transferring risk to insurers, including property, liability, cargo, workers' compensation, auto, and specialty coverages. Retained Losses include deductibles paid, self-insured losses, uninsured exposures, and retention deductibles - these are costs you absorb directly. Risk Control Costs encompass proactive investments in safety programs, training, security systems, consulting fees, and loss prevention initiatives. Administrative Costs cover internal expenses for claims management, risk management staff, insurance administration, legal fees, and compliance. Finally, Opportunity Costs represent the hidden cost of capital tied up in collateral requirements and reserves, as well as the time value of money. These components often trade off against each other - for example, higher deductibles reduce premiums but increase retained losses, while investments in risk control may reduce both premiums and losses over time."
  },
  {
    question: "When should my company consider alternative risk financing strategies?",
    answer: "Alternative risk financing strategies become attractive when your company reaches certain thresholds in size, risk profile, or TCOR performance. Consider exploring alternatives when your annual revenue exceeds $20 million, your TCOR percentage is above industry average, your loss history is better than industry norms, or you have consistent cash flows to support retained risk. Captive insurance companies are suitable for organizations with revenues over $50 million and TCOR exceeding $2 million, offering potential savings of 20-35% through premium tax advantages and investment income. High-deductible programs can benefit companies with strong balance sheets, providing 15-30% premium reductions. Risk Retention Groups work well for homogeneous industries with shared liability exposures. Self-insurance may be appropriate for very large organizations with substantial reserves and sophisticated risk management capabilities. The key is matching your risk financing structure to your risk appetite, financial capacity, and strategic objectives while ensuring adequate protection against catastrophic losses."
  },
  {
    question: "How can I reduce my TCOR without increasing my risk exposure?",
    answer: "Reducing TCOR while maintaining appropriate risk protection requires a strategic, multi-faceted approach. Start with loss prevention investments - every dollar spent on safety programs, employee training, and security systems typically generates $3-5 in reduced losses and premiums. Review your insurance program structure to eliminate coverage gaps and overlaps, optimize deductibles based on your risk tolerance and financial capacity, and consolidate policies with fewer carriers for volume discounts. Implement robust claims management processes to reduce claims costs by 15-25% through early intervention, return-to-work programs, and aggressive fraud detection. Consider alternative risk financing mechanisms like captives or high-deductible programs if your loss experience is better than average. Negotiate premium credits for risk management improvements such as safety certifications, quality management systems, and business continuity plans. Finally, benchmark your administrative costs against industry peers and consider outsourcing non-core functions if more cost-effective. The most successful TCOR optimization programs achieve sustainable reductions of 20-40% over 3-5 years."
  },
  {
    question: "How often should I review and update my TCOR analysis?",
    answer: "TCOR analysis should be performed at multiple intervals to support both strategic planning and operational decision-making. A comprehensive annual TCOR review is essential, typically aligned with your insurance renewal cycle to inform coverage decisions and negotiations. This annual review should include updated financial data, loss analysis, benchmark comparisons, and assessment of risk financing alternatives. Quarterly reviews of key metrics like loss ratios, claims costs, and budget variances enable early detection of trends requiring intervention. Major business changes such as acquisitions, new product lines, geographic expansion, or significant revenue shifts should trigger immediate TCOR reassessment. Additionally, monitor external factors including insurance market conditions, regulatory changes, and industry loss trends that may impact your TCOR. Many organizations integrate TCOR tracking into their enterprise risk management framework, with dashboards providing real-time visibility into risk costs. This systematic approach ensures TCOR remains a strategic tool rather than an annual exercise."
  }
];

// Educational content for each section
const EDUCATIONAL_CONTENT = {
  calculator: {
    title: "Understanding the TCOR Calculator Framework",
    content: `The Total Cost of Risk (TCOR) Calculator provides a comprehensive framework for measuring and analyzing all costs associated with managing organizational risk. This powerful financial tool goes beyond simple insurance premium tracking to capture the complete picture of your risk management expenditure, enabling strategic decision-making and performance optimization.

The calculator incorporates five essential cost categories that together form your complete TCOR profile. Insurance Premium Costs represent your traditional risk transfer expenses, including property, liability, cargo, workers' compensation, auto, and specialty coverages. These premiums are typically the most visible component of TCOR but often represent only 50-60% of total risk costs.

Retained Losses capture the costs you absorb directly through deductibles, self-insured retentions, and uninsured exposures. Understanding this component is crucial because many organizations underestimate their actual retained risk, particularly when high deductibles are used to reduce premiums. Risk Control Costs document your proactive investments in safety programs, training, security systems, consulting services, and loss prevention initiatives. While these represent current expenditures, they often generate significant returns through reduced future losses and premiums.

Administrative Costs encompass the internal resources dedicated to managing risk, including claims management, risk management staff, insurance administration, legal fees, and compliance activities. Finally, Opportunity Costs recognize the financial impact of capital tied up in collateral requirements and reserves, providing a complete picture of the true cost of your risk management strategy.`
  },
  breakdown: {
    title: "Analyzing Your TCOR Component Distribution",
    content: `The Breakdown Analysis provides granular visibility into how your total cost of risk is distributed across different components and subcategories. This detailed decomposition is essential for identifying optimization opportunities and understanding the drivers behind your overall TCOR performance.

The pie chart visualization reveals the proportional relationship between your five major TCOR components. Insurance premiums typically dominate, representing 40-60% of total TCOR for most organizations. However, companies with high deductibles or self-insured programs may see retained losses representing a larger share. Risk control investments, while representing a smaller percentage, are particularly important because they often generate the highest return on investment through loss reduction.

The detailed breakdown charts enable component-specific analysis. The Insurance Premium breakdown shows how your premium dollars are allocated across coverage lines, helping identify areas where coverage optimization might reduce costs. For logistics companies, cargo and auto insurance often represent significant exposures, while manufacturers may see higher property and workers' compensation costs.

The Retained Losses breakdown reveals where your direct loss exposure originates. High deductible costs might suggest an opportunity to adjust retention levels, while substantial self-insured losses could indicate a need for improved loss control. The Cost Composition Analysis provides a linear view that makes it easy to compare relative magnitudes and track changes over time. Organizations that regularly analyze their TCOR breakdown typically identify 15-25% cost reduction opportunities within the first year of systematic review.`
  },
  trends: {
    title: "Interpreting TCOR Trends and Projections",
    content: `The Trend Analysis module transforms your TCOR data into actionable intelligence by revealing patterns, trajectories, and opportunities for improvement over time. Understanding these trends is essential for strategic planning, budgeting, and demonstrating the value of risk management investments to stakeholders.

The stacked area chart visualizes how your TCOR components have evolved over the analysis period, typically five years. This view reveals the relative contribution of each component to your total TCOR and how those relationships have changed. A growing retained losses segment, for example, might indicate that cost-saving measures like higher deductibles have shifted rather than reduced total risk costs.

The total TCOR line chart provides a clear view of your overall trajectory. Flat or declining TCOR while revenues grow indicates improving risk management efficiency. Rising TCOR may signal increased exposure, deteriorating loss experience, or hardening insurance markets requiring strategic response.

Year-over-year analysis quantifies the rate of change and identifies significant inflection points. Sudden increases might correspond to specific loss events or market changes, while gradual increases could indicate underlying exposure growth. Decreasing trends validate the effectiveness of risk management initiatives and support continued investment.

The projection capabilities help you anticipate future costs and plan accordingly. By modeling different scenarios - such as implementing a new safety program, changing retention levels, or exploring alternative financing - you can quantify potential impacts before committing resources. Organizations that systematically track TCOR trends are better positioned to navigate insurance market cycles and maintain cost-efficient risk management programs.`
  },
  benchmarks: {
    title: "Understanding Industry Benchmark Comparisons",
    content: `The Benchmarks module positions your TCOR performance within the broader industry context, enabling meaningful comparison with peers and identification of improvement opportunities. Benchmarking is one of the most powerful tools for strategic risk management, providing external validation and goal-setting guidance.

Your TCOR percentage is compared against industry averages to determine relative performance. Performing better than industry average indicates efficient risk management, while underperformance suggests opportunities for improvement. However, benchmark interpretation requires nuance - a high TCOR percentage might be appropriate for companies with aggressive growth strategies or above-average risk tolerance, while a very low TCOR could indicate underinsurance.

The industry reference table provides benchmark data across major sectors, from low-risk technology companies averaging 1.2% TCOR to high-risk construction firms averaging 4.5%. This context helps calibrate expectations and identify appropriate performance targets. Logistics and transportation companies typically face TCOR percentages of 2.5-4.0% due to significant cargo, auto, and liability exposures.

The visual comparison chart includes a "Best in Class" benchmark representing top quartile performance within your industry. Achieving best-in-class TCOR typically requires excellence across all five components: competitive insurance purchasing, effective loss control, efficient claims management, optimized administrative processes, and strategic risk financing.

Organizations that regularly benchmark their TCOR performance and pursue improvement initiatives typically achieve 10-20% cost reductions over 2-3 years while maintaining or improving their risk profile. The key is treating benchmarks as diagnostic tools rather than ends in themselves, using them to identify specific areas for improvement.`
  },
  financing: {
    title: "Evaluating Risk Financing Alternatives",
    content: `The Financing Alternatives module analyzes your TCOR profile against various risk financing strategies to identify optimal approaches for your organization. Risk financing decisions have profound implications for both cost efficiency and risk protection, making this analysis essential for strategic risk management.

Traditional insurance represents the baseline, offering full risk transfer with predictable costs but potentially higher premiums. This approach is appropriate for organizations with limited risk management resources or exposure to low-frequency, high-severity losses that could threaten financial stability.

High-deductible programs reduce premiums by 15-30% in exchange for increased retained losses. This strategy works well for organizations with strong balance sheets and predictable loss experience. The key is ensuring adequate reserves for retained losses while capturing the premium savings.

Captive insurance companies provide premium tax advantages, investment income, and direct access to reinsurance markets. Captives are suitable for organizations with revenues exceeding $50 million and TCOR over $2 million. While capital intensive to establish, captives often generate 20-35% savings over time and provide flexibility in coverage design.

Risk Retention Groups offer an alternative for homogeneous industries with shared liability exposures, providing member control and regulatory efficiency. Self-insurance represents the ultimate retention strategy, offering maximum control and cost savings for very large organizations with sophisticated risk management capabilities.

The implementation roadmap provides a structured approach to evaluating and implementing optimal strategies, from initial assessment through ongoing monitoring. Organizations that optimize their risk financing structure typically achieve significant savings while maintaining appropriate protection against catastrophic losses.`
  }
};

export default function TCORCalculator() {
  // State
  const [currency, setCurrency] = useState("USD");
  const [activeTab, setActiveTab] = useState("calculator");
  const [numberOfEmployees, setNumberOfEmployees] = useState("100");

  // Insurance Premium Costs
  const [propertyInsurance, setPropertyInsurance] = useState("150000");
  const [liabilityInsurance, setLiabilityInsurance] = useState("85000");
  const [cargoInsurance, setCargoInsurance] = useState("120000");
  const [workersComp, setWorkersComp] = useState("95000");
  const [autoInsurance, setAutoInsurance] = useState("45000");
  const [otherInsurance, setOtherInsurance] = useState("25000");

  // Retained Losses
  const [deductiblesPaid, setDeductiblesPaid] = useState("35000");
  const [selfInsuredLosses, setSelfInsuredLosses] = useState("50000");
  const [uninsuredLosses, setUninsuredLosses] = useState("15000");
  const [retentionDeductible, setRetentionDeductible] = useState("25000");

  // Risk Control Costs
  const [safetyPrograms, setSafetyPrograms] = useState("28000");
  const [trainingCosts, setTrainingCosts] = useState("18000");
  const [securitySystems, setSecuritySystems] = useState("22000");
  const [consultingFees, setConsultingFees] = useState("12000");
  const [lossPrevention, setLossPrevention] = useState("15000");

  // Administrative Costs
  const [claimsManagement, setClaimsManagement] = useState("25000");
  const [riskManagementStaff, setRiskManagementStaff] = useState("85000");
  const [insuranceAdministration, setInsuranceAdministration] = useState("12000");
  const [legalFees, setLegalFees] = useState("20000");
  const [complianceCosts, setComplianceCosts] = useState("8000");

  // Opportunity Costs
  const [costOfCapital, setCostOfCapital] = useState("45000");
  const [collateralRequirements, setCollateralRequirements] = useState("30000");
  const [timeValueOfMoney, setTimeValueOfMoney] = useState("12000");

  // Company Data
  const [annualRevenue, setAnnualRevenue] = useState("25000000");
  const [selectedIndustry, setSelectedIndustry] = useState("Logistics & Transportation");

  // Parse numbers helper
  const parseNum = (val: string) => parseFloat(val) || 0;

  // TCOR Calculation
  const tcorResult = useMemo<TCORResult>(() => {
    const insurancePremiums =
      parseNum(propertyInsurance) +
      parseNum(liabilityInsurance) +
      parseNum(cargoInsurance) +
      parseNum(workersComp) +
      parseNum(autoInsurance) +
      parseNum(otherInsurance);

    const retainedLosses =
      parseNum(deductiblesPaid) +
      parseNum(selfInsuredLosses) +
      parseNum(uninsuredLosses) +
      parseNum(retentionDeductible);

    const riskControlCosts =
      parseNum(safetyPrograms) +
      parseNum(trainingCosts) +
      parseNum(securitySystems) +
      parseNum(consultingFees) +
      parseNum(lossPrevention);

    const administrativeCosts =
      parseNum(claimsManagement) +
      parseNum(riskManagementStaff) +
      parseNum(insuranceAdministration) +
      parseNum(legalFees) +
      parseNum(complianceCosts);

    const opportunityCosts =
      parseNum(costOfCapital) +
      parseNum(collateralRequirements) +
      parseNum(timeValueOfMoney);

    const totalCostOfRisk =
      insurancePremiums +
      retainedLosses +
      riskControlCosts +
      administrativeCosts +
      opportunityCosts;

    const revenue = parseNum(annualRevenue);
    const tcorAsPercentOfRevenue = revenue > 0 ? (totalCostOfRisk / revenue) * 100 : 0;
    const costPerEmployee = totalCostOfRisk / (parseNum(numberOfEmployees) || 1);

    return {
      insurancePremiums,
      retainedLosses,
      riskControlCosts,
      administrativeCosts,
      opportunityCosts,
      totalCostOfRisk,
      tcorAsPercentOfRevenue,
      costPerEmployee,
    };
  }, [
    propertyInsurance, liabilityInsurance, cargoInsurance, workersComp, autoInsurance, otherInsurance,
    deductiblesPaid, selfInsuredLosses, uninsuredLosses, retentionDeductible,
    safetyPrograms, trainingCosts, securitySystems, consultingFees, lossPrevention,
    claimsManagement, riskManagementStaff, insuranceAdministration, legalFees, complianceCosts,
    costOfCapital, collateralRequirements, timeValueOfMoney,
    annualRevenue, numberOfEmployees,
  ]);

  // TCOR Breakdown for Pie Chart
  const tcorBreakdownData = useMemo(() => [
    { name: "Insurance Premiums", value: tcorResult.insurancePremiums, color: OCEAN_BLUE },
    { name: "Retained Losses", value: tcorResult.retainedLosses, color: "#EF4444" },
    { name: "Risk Control", value: tcorResult.riskControlCosts, color: LOGISTICS_GREEN },
    { name: "Administrative", value: tcorResult.administrativeCosts, color: "#F59E0B" },
    { name: "Opportunity Costs", value: tcorResult.opportunityCosts, color: "#8B5CF6" },
  ], [tcorResult]);

  // Detailed breakdown for insurance
  const insuranceBreakdown = useMemo(() => [
    { name: "Property", value: parseNum(propertyInsurance) },
    { name: "Liability", value: parseNum(liabilityInsurance) },
    { name: "Cargo", value: parseNum(cargoInsurance) },
    { name: "Workers Comp", value: parseNum(workersComp) },
    { name: "Auto", value: parseNum(autoInsurance) },
    { name: "Other", value: parseNum(otherInsurance) },
  ], [propertyInsurance, liabilityInsurance, cargoInsurance, workersComp, autoInsurance, otherInsurance]);

  // Detailed breakdown for retained losses
  const retainedBreakdown = useMemo(() => [
    { name: "Deductibles", value: parseNum(deductiblesPaid) },
    { name: "Self-Insured", value: parseNum(selfInsuredLosses) },
    { name: "Uninsured", value: parseNum(uninsuredLosses) },
    { name: "Retention", value: parseNum(retentionDeductible) },
  ], [deductiblesPaid, selfInsuredLosses, uninsuredLosses, retentionDeductible]);

  // Trend data (simulated 5-year trend)
  const trendData = useMemo<TrendData[]>(() => {
    const baseYear = new Date().getFullYear();
    return [0, 1, 2, 3, 4].map((i) => {
      const factor = 1 + (i - 2) * 0.08;
      const trendFactor = 1 + (i - 2) * 0.05;
      return {
        year: baseYear - 4 + i,
        insurancePremiums: Math.round(tcorResult.insurancePremiums * factor),
        retainedLosses: Math.round(tcorResult.retainedLosses * (factor * 1.1)),
        riskControlCosts: Math.round(tcorResult.riskControlCosts * trendFactor),
        administrativeCosts: Math.round(tcorResult.administrativeCosts * factor),
        total: Math.round(tcorResult.totalCostOfRisk * factor),
      };
    });
  }, [tcorResult]);

  // Risk financing alternatives
  const financingAlternatives = useMemo<FinancingAlternative[]>(() => {
    const tcor = tcorResult.totalCostOfRisk;
    const revenue = parseNum(annualRevenue);
    const tcorPercent = tcorResult.tcorAsPercentOfRevenue;

    return [
      {
        type: "Traditional Insurance",
        description: "Standard commercial insurance policies with full transfer of risk",
        pros: ["Full risk transfer", "Predictable costs", "Access to insurer expertise"],
        cons: ["Higher premiums", "Less control over claims", "Market volatility"],
        suitable: true,
        savingsEstimate: 0,
      },
      {
        type: "High Deductible Plans",
        description: "Higher deductibles in exchange for lower premiums",
        pros: ["Lower premiums (15-30%)", "Retain investment income", "Better claims control"],
        cons: ["Higher retained losses", "Capital requirements", "Cash flow volatility"],
        suitable: tcorPercent > 2,
        savingsEstimate: Math.round(tcor * 0.15),
      },
      {
        type: "Captive Insurance",
        description: "Form own insurance subsidiary to insure parent company risks",
        pros: ["Premium tax savings", "Investment income", "Tailored coverage", "Risk control incentives"],
        cons: ["Capital intensive ($250K+)", "Regulatory compliance", "Management overhead"],
        suitable: revenue > 10000000 && tcorPercent > 2.5,
        savingsEstimate: Math.round(tcor * 0.25),
      },
      {
        type: "Risk Retention Group",
        description: "Liability insurance company owned by member organizations",
        pros: ["Lower costs", "Stable pricing", "Member control", "Regulatory efficiency"],
        cons: ["Limited scope (liability only)", "Member liability", "Capital calls possible"],
        suitable: tcorPercent > 2,
        savingsEstimate: Math.round(tcor * 0.2),
      },
      {
        type: "Self-Insurance",
        description: "Set aside reserves to cover potential losses directly",
        pros: ["Maximum control", "No premiums", "Investment income on reserves"],
        cons: ["High capital requirements", "Full exposure to volatility", "Regulatory approval needed"],
        suitable: revenue > 50000000,
        savingsEstimate: Math.round(tcor * 0.35),
      },
      {
        type: "Hybrid Program",
        description: "Combination of insurance, captive, and retention strategies",
        pros: ["Optimized cost structure", "Flexible risk management", "Best of multiple approaches"],
        cons: ["Complex administration", "Requires expertise", "Multiple relationships"],
        suitable: revenue > 20000000,
        savingsEstimate: Math.round(tcor * 0.28),
      },
    ];
  }, [tcorResult, annualRevenue]);

  // Benchmark comparison
  const benchmarkComparison = useMemo(() => {
    const selected = INDUSTRY_BENCHMARKS.find((b) => b.industry === selectedIndustry);
    const yourTCOR = tcorResult.tcorAsPercentOfRevenue;
    const industryTCOR = selected?.tcorPercent || 2.5;

    return {
      yourTCOR,
      industryTCOR,
      difference: yourTCOR - industryTCOR,
      performance: yourTCOR < industryTCOR ? "better" : yourTCOR > industryTCOR ? "worse" : "equal",
    };
  }, [tcorResult.tcorAsPercentOfRevenue, selectedIndustry]);

  // Reset all values
  const resetValues = useCallback(() => {
    setPropertyInsurance("150000");
    setLiabilityInsurance("85000");
    setCargoInsurance("120000");
    setWorkersComp("95000");
    setAutoInsurance("45000");
    setOtherInsurance("25000");
    setDeductiblesPaid("35000");
    setSelfInsuredLosses("50000");
    setUninsuredLosses("15000");
    setRetentionDeductible("25000");
    setSafetyPrograms("28000");
    setTrainingCosts("18000");
    setSecuritySystems("22000");
    setConsultingFees("12000");
    setLossPrevention("15000");
    setClaimsManagement("25000");
    setRiskManagementStaff("85000");
    setInsuranceAdministration("12000");
    setLegalFees("20000");
    setComplianceCosts("8000");
    setCostOfCapital("45000");
    setCollateralRequirements("30000");
    setTimeValueOfMoney("12000");
    setAnnualRevenue("25000000");
    setNumberOfEmployees("100");
  }, []);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F4C81]/10 via-background to-[#2E8B57]/10 dark:from-[#0F4C81]/20 dark:via-background dark:to-[#2E8B57]/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,76,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,76,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_110%)]" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 opacity-10 dark:opacity-20"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Shield className="w-20 h-20 text-[#0F4C81]" />
        </motion.div>
        <motion.div
          className="absolute top-32 right-16 opacity-10 dark:opacity-20"
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <TrendingUp className="w-16 h-16 text-[#2E8B57]" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 opacity-10 dark:opacity-20"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <PieChart className="w-14 h-14 text-[#0F4C81]" />
        </motion.div>

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 border-[#0F4C81]/20 gap-2">
                <Sparkles className="h-4 w-4 text-[#2E8B57]" />
                <span>Professional Risk Management Tool</span>
              </Badge>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="block">Total Cost of Risk</span>
              <span className="block mt-2 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
                Calculator & Analyzer
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Comprehensive TCOR analysis across five dimensions: insurance premiums, retained losses, 
              risk control costs, administrative expenses, and opportunity costs. Benchmark your performance 
              against industry standards and discover optimization opportunities.
            </p>

            {/* Quick Stats */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: BarChart3, label: "5 Cost Categories", value: "Comprehensive" },
                { icon: Globe, label: "7 Industries", value: "Benchmarks" },
                { icon: Target, label: "6 Financing", value: "Alternatives" },
                { icon: Activity, label: "5-Year", value: "Trend Analysis" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <Icon className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                    <span className="font-semibold text-[#0F4C81] dark:text-[#5B9BD5]">{stat.value}</span>
                    <span className="text-muted-foreground text-sm">{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:from-[#0F4C81]/90 hover:to-[#2E8B57]/90 text-white gap-2 h-12 px-8"
                onClick={() => document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calculator className="h-5 w-5" />
                Start Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Calculator Section */}
      <section id="calculator-section" className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
            <TabsTrigger value="calculator" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
              <Calculator className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
              <PieChartIcon className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
              <LineChart className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="benchmarks" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
              <Gauge className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Benchmarks</span>
            </TabsTrigger>
            <TabsTrigger value="alternatives" className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm">
              <Zap className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Financing</span>
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6 mt-6">
            {/* Educational Section */}
            <Card className="border-l-4 border-l-[#0F4C81] bg-gradient-to-r from-[#0F4C81]/5 to-transparent dark:from-[#0F4C81]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-[#0F4C81] dark:text-[#5B9BD5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-[#0F4C81] dark:text-[#5B9BD5]">
                      {EDUCATIONAL_CONTENT.calculator.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {EDUCATIONAL_CONTENT.calculator.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Card */}
              <div className="space-y-6">
                {/* Company Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.slice(0, 15).map((c) => (
                              <SelectItem key={c.code} value={c.code}>
                                {c.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Industry</Label>
                        <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {INDUSTRY_BENCHMARKS.map((b) => (
                              <SelectItem key={b.industry} value={b.industry}>
                                {b.industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="revenue">Annual Revenue</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="revenue"
                            type="number"
                            value={annualRevenue}
                            onChange={(e) => setAnnualRevenue(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employees">Number of Employees</Label>
                        <Input
                          id="employees"
                          type="number"
                          value={numberOfEmployees}
                          onChange={(e) => setNumberOfEmployees(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Insurance Premium Costs */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Shield className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                      Insurance Premium Costs
                    </CardTitle>
                    <CardDescription>Annual insurance premiums across all lines</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="property">Property Insurance</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="property"
                            type="number"
                            value={propertyInsurance}
                            onChange={(e) => setPropertyInsurance(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="liability">Liability Insurance</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="liability"
                            type="number"
                            value={liabilityInsurance}
                            onChange={(e) => setLiabilityInsurance(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cargo">Cargo Insurance</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="cargo"
                            type="number"
                            value={cargoInsurance}
                            onChange={(e) => setCargoInsurance(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workerscomp">Workers&apos; Comp</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="workerscomp"
                            type="number"
                            value={workersComp}
                            onChange={(e) => setWorkersComp(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="auto">Auto Insurance</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="auto"
                            type="number"
                            value={autoInsurance}
                            onChange={(e) => setAutoInsurance(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="other">Other Insurance</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="other"
                            type="number"
                            value={otherInsurance}
                            onChange={(e) => setOtherInsurance(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Retained Losses */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      Retained Losses
                    </CardTitle>
                    <CardDescription>Losses not covered by insurance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="deductibles">Deductibles Paid</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="deductibles"
                            type="number"
                            value={deductiblesPaid}
                            onChange={(e) => setDeductiblesPaid(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="selfinsured">Self-Insured Losses</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="selfinsured"
                            type="number"
                            value={selfInsuredLosses}
                            onChange={(e) => setSelfInsuredLosses(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="uninsured">Uninsured Losses</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="uninsured"
                            type="number"
                            value={uninsuredLosses}
                            onChange={(e) => setUninsuredLosses(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="retention">Retention Deductible</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="retention"
                            type="number"
                            value={retentionDeductible}
                            onChange={(e) => setRetentionDeductible(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Risk Control Costs */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Settings className="h-5 w-5 text-[#2E8B57] dark:text-[#4ADE80]" />
                      Risk Control Costs
                    </CardTitle>
                    <CardDescription>Investments in loss prevention and mitigation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="safety">Safety Programs</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="safety"
                            type="number"
                            value={safetyPrograms}
                            onChange={(e) => setSafetyPrograms(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="training">Training Costs</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="training"
                            type="number"
                            value={trainingCosts}
                            onChange={(e) => setTrainingCosts(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="security">Security Systems</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="security"
                            type="number"
                            value={securitySystems}
                            onChange={(e) => setSecuritySystems(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="consulting">Consulting Fees</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="consulting"
                            type="number"
                            value={consultingFees}
                            onChange={(e) => setConsultingFees(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="lossprev">Loss Prevention Programs</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="lossprev"
                            type="number"
                            value={lossPrevention}
                            onChange={(e) => setLossPrevention(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Administrative Costs */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileCheck className="h-5 w-5 text-amber-500" />
                      Administrative Costs
                    </CardTitle>
                    <CardDescription>Internal costs of managing risk and insurance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="claims">Claims Management</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="claims"
                            type="number"
                            value={claimsManagement}
                            onChange={(e) => setClaimsManagement(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staff">Risk Mgmt Staff</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="staff"
                            type="number"
                            value={riskManagementStaff}
                            onChange={(e) => setRiskManagementStaff(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insadmin">Insurance Admin</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="insadmin"
                            type="number"
                            value={insuranceAdministration}
                            onChange={(e) => setInsuranceAdministration(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="legal">Legal Fees</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="legal"
                            type="number"
                            value={legalFees}
                            onChange={(e) => setLegalFees(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="compliance">Compliance Costs</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="compliance"
                            type="number"
                            value={complianceCosts}
                            onChange={(e) => setComplianceCosts(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Opportunity Costs */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      Opportunity Costs
                    </CardTitle>
                    <CardDescription>Hidden costs of capital tied up in risk management</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="coc">Cost of Capital</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="coc"
                            type="number"
                            value={costOfCapital}
                            onChange={(e) => setCostOfCapital(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="collateral">Collateral</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="collateral"
                            type="number"
                            value={collateralRequirements}
                            onChange={(e) => setCollateralRequirements(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tvm">Time Value</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="tvm"
                            type="number"
                            value={timeValueOfMoney}
                            onChange={(e) => setTimeValueOfMoney(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Results Summary */}
            <Card className="border-[#0F4C81]/20 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 dark:from-[#0F4C81]/10 dark:to-[#2E8B57]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                  Total Cost of Risk Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="space-y-3">
                      {tcorBreakdownData.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-foreground">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              {((item.value / tcorResult.totalCostOfRisk) * 100).toFixed(1)}%
                            </span>
                            <span className="font-medium w-32 text-right text-foreground">
                              {formatCurrency(item.value, currency)}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-3 bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20 rounded-lg px-3">
                        <span className="font-semibold text-foreground">Total Cost of Risk</span>
                        <span className="font-bold text-[#0F4C81] dark:text-[#5B9BD5] text-xl">
                          {formatCurrency(tcorResult.totalCostOfRisk, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-[#0F4C81] dark:text-[#5B9BD5]">
                        {tcorResult.tcorAsPercentOfRevenue.toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">TCOR as % of Revenue</div>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-[#2E8B57] dark:text-[#4ADE80]">
                        {formatCurrency(tcorResult.costPerEmployee, currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">Cost per Employee</div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={resetValues}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Values
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6 mt-6">
            {/* Educational Section */}
            <Card className="border-l-4 border-l-[#2E8B57] bg-gradient-to-r from-[#2E8B57]/5 to-transparent dark:from-[#2E8B57]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-[#2E8B57] dark:text-[#4ADE80]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-[#2E8B57] dark:text-[#4ADE80]">
                      {EDUCATIONAL_CONTENT.breakdown.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {EDUCATIONAL_CONTENT.breakdown.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* TCOR Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                    TCOR Breakdown
                  </CardTitle>
                  <CardDescription>Distribution of total cost of risk components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={tcorBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          labelLine={true}
                        >
                          {tcorBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                    Insurance Premium Breakdown
                  </CardTitle>
                  <CardDescription>Detailed view of insurance costs by line</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={insuranceBreakdown} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} className="text-xs" />
                        <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                        <Bar dataKey="value" fill={OCEAN_BLUE} radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Retained Losses Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Retained Losses Breakdown
                  </CardTitle>
                  <CardDescription>Sources of losses not covered by insurance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={retainedBreakdown} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} className="text-xs" />
                        <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                        <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Composition */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#2E8B57] dark:text-[#4ADE80]" />
                    Cost Composition Analysis
                  </CardTitle>
                  <CardDescription>Understanding where your risk costs originate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tcorBreakdownData.map((item, idx) => {
                      const percentage = (item.value / tcorResult.totalCostOfRisk) * 100;
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2 text-foreground">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span className="font-medium text-foreground">{formatCurrency(item.value, currency)}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: idx * 0.1 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6 mt-6">
            {/* Educational Section */}
            <Card className="border-l-4 border-l-[#0F4C81] bg-gradient-to-r from-[#0F4C81]/5 to-transparent dark:from-[#0F4C81]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-[#0F4C81] dark:text-[#5B9BD5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-[#0F4C81] dark:text-[#5B9BD5]">
                      {EDUCATIONAL_CONTENT.trends.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {EDUCATIONAL_CONTENT.trends.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                  TCOR Trend Analysis
                </CardTitle>
                <CardDescription>5-year historical trend and projection of cost components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="year" className="text-xs" />
                      <YAxis tickFormatter={(v) => formatCurrency(v, currency)} className="text-xs" />
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="insurancePremiums"
                        stackId="1"
                        stroke={OCEAN_BLUE}
                        fill={OCEAN_BLUE}
                        fillOpacity={0.6}
                        name="Insurance"
                      />
                      <Area
                        type="monotone"
                        dataKey="retainedLosses"
                        stackId="1"
                        stroke="#EF4444"
                        fill="#EF4444"
                        fillOpacity={0.6}
                        name="Retained Losses"
                      />
                      <Area
                        type="monotone"
                        dataKey="riskControlCosts"
                        stackId="1"
                        stroke={LOGISTICS_GREEN}
                        fill={LOGISTICS_GREEN}
                        fillOpacity={0.6}
                        name="Risk Control"
                      />
                      <Area
                        type="monotone"
                        dataKey="administrativeCosts"
                        stackId="1"
                        stroke="#F59E0B"
                        fill="#F59E0B"
                        fillOpacity={0.6}
                        name="Administrative"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Total TCOR Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Total TCOR Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLine data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                        <XAxis dataKey="year" className="text-xs" />
                        <YAxis tickFormatter={(v) => formatCurrency(v, currency)} className="text-xs" />
                        <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke={OCEAN_BLUE}
                          strokeWidth={3}
                          dot={{ fill: OCEAN_BLUE, strokeWidth: 2 }}
                          name="Total TCOR"
                        />
                      </RechartsLine>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Year-over-Year Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Year-over-Year Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {trendData.slice(1).map((year, idx) => {
                      const prevYear = trendData[idx];
                      const change = ((year.total - prevYear.total) / prevYear.total) * 100;
                      const isPositive = change > 0;
                      return (
                        <div key={year.year} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{year.year}</span>
                            <span className="text-muted-foreground">vs {prevYear.year}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{formatCurrency(year.total, currency)}</span>
                            <Badge variant={isPositive ? "destructive" : "default"}>
                              {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                              {Math.abs(change).toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Benchmarks Tab */}
          <TabsContent value="benchmarks" className="space-y-6 mt-6">
            {/* Educational Section */}
            <Card className="border-l-4 border-l-[#2E8B57] bg-gradient-to-r from-[#2E8B57]/5 to-transparent dark:from-[#2E8B57]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#2E8B57]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-[#2E8B57] dark:text-[#4ADE80]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-[#2E8B57] dark:text-[#4ADE80]">
                      {EDUCATIONAL_CONTENT.benchmarks.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {EDUCATIONAL_CONTENT.benchmarks.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className={benchmarkComparison.performance === "better" ? "border-[#2E8B57]/30" : benchmarkComparison.performance === "worse" ? "border-red-500/30" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                  Benchmark Performance
                </CardTitle>
                <CardDescription>How your TCOR compares to industry standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <div className="text-4xl font-bold text-[#0F4C81] dark:text-[#5B9BD5]">
                      {benchmarkComparison.yourTCOR.toFixed(2)}%
                    </div>
                    <div className="text-muted-foreground mt-2">Your TCOR %</div>
                  </div>
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <div className="text-4xl font-bold text-[#2E8B57] dark:text-[#4ADE80]">
                      {benchmarkComparison.industryTCOR.toFixed(2)}%
                    </div>
                    <div className="text-muted-foreground mt-2">Industry Average</div>
                  </div>
                  <div className={`text-center p-6 rounded-lg ${
                    benchmarkComparison.performance === "better" ? "bg-green-50 dark:bg-green-900/20" :
                    benchmarkComparison.performance === "worse" ? "bg-red-50 dark:bg-red-900/20" :
                    "bg-muted/50"
                  }`}>
                    <div className={`text-4xl font-bold ${
                      benchmarkComparison.performance === "better" ? "text-green-600" :
                      benchmarkComparison.performance === "worse" ? "text-red-600" :
                      "text-muted-foreground"
                    }`}>
                      {benchmarkComparison.difference > 0 ? "+" : ""}{benchmarkComparison.difference.toFixed(2)}%
                    </div>
                    <div className="text-muted-foreground mt-2">Difference</div>
                    <Badge className="mt-2" variant={benchmarkComparison.performance === "better" ? "default" : "destructive"}>
                      {benchmarkComparison.performance === "better" ? (
                        <><CheckCircle2 className="h-3 w-3 mr-1" /> Performing Better</>
                      ) : benchmarkComparison.performance === "worse" ? (
                        <><AlertCircle className="h-3 w-3 mr-1" /> Room for Improvement</>
                      ) : (
                        "At Industry Average"
                      )}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industry Benchmarks Table */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Benchmark Reference</CardTitle>
                <CardDescription>TCOR as percentage of revenue by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-foreground">Industry</th>
                        <th className="text-center py-3 px-4 text-foreground">TCOR %</th>
                        <th className="text-left py-3 px-4 text-foreground">Description</th>
                        <th className="text-center py-3 px-4 text-foreground">Comparison</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INDUSTRY_BENCHMARKS.map((benchmark) => {
                        const isSelected = benchmark.industry === selectedIndustry;
                        const comparison = tcorResult.tcorAsPercentOfRevenue - benchmark.tcorPercent;
                        return (
                          <tr
                            key={benchmark.industry}
                            className={`border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-muted/50 transition-colors ${isSelected ? "bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20" : ""}`}
                            onClick={() => setSelectedIndustry(benchmark.industry)}
                          >
                            <td className="py-3 px-4 font-medium text-foreground">{benchmark.industry}</td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="secondary">{benchmark.tcorPercent.toFixed(1)}%</Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">{benchmark.description}</td>
                            <td className="text-center py-3 px-4">
                              {isSelected && (
                                <Badge variant={comparison < 0 ? "default" : "destructive"}>
                                  {comparison < 0 ? "Better" : "Worse"} by {Math.abs(comparison).toFixed(2)}%
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Visual Benchmark */}
            <Card>
              <CardHeader>
                <CardTitle>Visual Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Your TCOR", value: tcorResult.tcorAsPercentOfRevenue, fill: OCEAN_BLUE },
                        { name: "Industry Avg", value: benchmarkComparison.industryTCOR, fill: LOGISTICS_GREEN },
                        { name: "Best in Class", value: benchmarkComparison.industryTCOR * 0.7, fill: "#10B981" },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis tickFormatter={(v) => `${v.toFixed(1)}%`} className="text-xs" />
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        <Cell fill={OCEAN_BLUE} />
                        <Cell fill={LOGISTICS_GREEN} />
                        <Cell fill="#10B981" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financing Alternatives Tab */}
          <TabsContent value="alternatives" className="space-y-6 mt-6">
            {/* Educational Section */}
            <Card className="border-l-4 border-l-[#0F4C81] bg-gradient-to-r from-[#0F4C81]/5 to-transparent dark:from-[#0F4C81]/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-6 w-6 text-[#0F4C81] dark:text-[#5B9BD5]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-[#0F4C81] dark:text-[#5B9BD5]">
                      {EDUCATIONAL_CONTENT.financing.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {EDUCATIONAL_CONTENT.financing.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className="border-[#0F4C81]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#2E8B57] dark:text-[#4ADE80]" />
                  Risk Financing Recommendation
                </CardTitle>
                <CardDescription>Based on your company profile and TCOR analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-foreground">Your Profile</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Annual Revenue:</span>
                        <span className="font-medium text-foreground">{formatCurrency(parseNum(annualRevenue), currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Cost of Risk:</span>
                        <span className="font-medium text-foreground">{formatCurrency(tcorResult.totalCostOfRisk, currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">TCOR % of Revenue:</span>
                        <span className="font-medium text-foreground">{tcorResult.tcorAsPercentOfRevenue.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Industry:</span>
                        <span className="font-medium text-foreground">{selectedIndustry}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-[#2E8B57]/10 dark:bg-[#2E8B57]/20 rounded-lg border border-[#2E8B57]/20">
                    <h4 className="font-medium text-[#2E8B57] dark:text-[#4ADE80] mb-2">Potential Annual Savings</h4>
                    <div className="text-3xl font-bold text-[#2E8B57] dark:text-[#4ADE80]">
                      {formatCurrency(Math.max(...financingAlternatives.filter(a => a.suitable).map(a => a.savingsEstimate)), currency)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      By optimizing your risk financing strategy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternatives Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {financingAlternatives.map((alt, idx) => (
                <Card key={idx} className={alt.suitable ? "border-[#0F4C81]/30" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-foreground">{alt.type}</CardTitle>
                      {alt.suitable && (
                        <Badge className="bg-[#2E8B57] text-white hover:bg-[#2E8B57]/90">Recommended</Badge>
                      )}
                    </div>
                    <CardDescription>{alt.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-[#2E8B57] dark:text-[#4ADE80] mb-2">Advantages</h5>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {alt.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <CheckCircle2 className="h-3 w-3 text-[#2E8B57] dark:text-[#4ADE80] mt-0.5 shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-red-500 mb-2">Considerations</h5>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {alt.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {alt.savingsEstimate > 0 && (
                      <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Est. Annual Savings:</span>
                        <span className="font-bold text-[#2E8B57] dark:text-[#4ADE80]">
                          {formatCurrency(alt.savingsEstimate, currency)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Implementation Roadmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                  Implementation Roadmap
                </CardTitle>
                <CardDescription>Steps to optimize your risk financing strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { step: 1, title: "Assess Current State", desc: "Document all current insurance policies, retention levels, and risk exposures", time: "1-2 weeks" },
                    { step: 2, title: "Identify Gaps & Opportunities", desc: "Compare against benchmarks and identify areas for improvement", time: "2-3 weeks" },
                    { step: 3, title: "Evaluate Alternatives", desc: "Model different risk financing scenarios and their financial impact", time: "3-4 weeks" },
                    { step: 4, title: "Develop Strategy", desc: "Create a multi-year risk financing plan aligned with business goals", time: "2-3 weeks" },
                    { step: 5, title: "Implement Changes", desc: "Work with brokers, insurers, and internal teams to execute the strategy", time: "3-6 months" },
                    { step: 6, title: "Monitor & Adjust", desc: "Track performance metrics and adjust strategy as needed", time: "Ongoing" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <Badge variant="outline">{item.time}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
          <CardHeader className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-1.5 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 text-foreground border-[#0F4C81]/20">
                <HelpCircle className="h-4 w-4 mr-1.5 text-[#0F4C81] dark:text-[#5B9BD5]" />
                Frequently Asked Questions
              </Badge>
              <CardTitle className="text-2xl md:text-3xl mb-2">
                TCOR <span className="text-[#0F4C81] dark:text-[#5B9BD5]">Knowledge Base</span>
              </CardTitle>
              <CardDescription className="max-w-2xl mx-auto">
                Comprehensive answers to common questions about Total Cost of Risk analysis and optimization
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {FAQ_DATA.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-lg px-4 border border-gray-200 dark:border-gray-700"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-[#0F4C81] dark:hover:text-[#5B9BD5] py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* Footer CTA */}
      <section className="container mx-auto px-4 py-8">
        <Card className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
          
          <CardContent className="p-8 md:p-12 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Award className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Optimize Your Cost of Risk?
                </h2>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Use the calculator above to analyze your TCOR and identify opportunities for cost reduction. 
                  Our comprehensive tool helps you understand your risk management costs and compare them against industry benchmarks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-[#0F4C81] hover:bg-gray-100 gap-2"
                    onClick={() => setActiveTab("calculator")}
                  >
                    <Calculator className="h-5 w-5" />
                    Calculate Your TCOR
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/10 gap-2"
                    onClick={() => setActiveTab("alternatives")}
                  >
                    <Zap className="h-5 w-5" />
                    Explore Financing Options
                  </Button>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
