"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  TrendingUp,
  TrendingDown,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  BarChart3,
  Package,
  Percent,
  Clock,
  Target,
  LineChart,
  PiggyBank,
  Building2,
  Ship,
  Thermometer,
  Droplet,
  Box,
  Zap,
  Lightbulb,
  XCircle,
  BookOpen,
  HelpCircle,
  DollarSign as FinanceIcon,
  Scale,
  TrendingUp as GrowthIcon,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency, getCurrencyByCode } from "@/lib/constants/currencies";

// Container types with specifications
type ContainerType = "20GP" | "40GP" | "40HC" | "reefer" | "tank" | "special";

interface ContainerSpec {
  code: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  purchasePrice: number; // USD
  leaseRatePerDay: number; // USD
  residualValuePercent: number; // Percentage of purchase price
  maintenanceCostPercent: number; // Annual percentage of purchase price
  lifespan: number; // Years
  insuranceRatePercent: number; // Annual percentage
  typicalDemand: string;
}

const CONTAINER_SPECS: Record<ContainerType, ContainerSpec> = {
  "20GP": {
    code: "20GP",
    name: "20' General Purpose",
    description: "Standard 20-foot dry container for general cargo",
    icon: <Box className="h-5 w-5" />,
    purchasePrice: 2500,
    leaseRatePerDay: 8,
    residualValuePercent: 25,
    maintenanceCostPercent: 2,
    lifespan: 15,
    insuranceRatePercent: 0.5,
    typicalDemand: "Very High",
  },
  "40GP": {
    code: "40GP",
    name: "40' General Purpose",
    description: "Standard 40-foot dry container for general cargo",
    icon: <Box className="h-5 w-5" />,
    purchasePrice: 3500,
    leaseRatePerDay: 12,
    residualValuePercent: 22,
    maintenanceCostPercent: 2,
    lifespan: 15,
    insuranceRatePercent: 0.5,
    typicalDemand: "Very High",
  },
  "40HC": {
    code: "40HC",
    name: "40' High Cube",
    description: "High cube container for voluminous cargo",
    icon: <Package className="h-5 w-5" />,
    purchasePrice: 4500,
    leaseRatePerDay: 15,
    residualValuePercent: 20,
    maintenanceCostPercent: 2.5,
    lifespan: 15,
    insuranceRatePercent: 0.6,
    typicalDemand: "High",
  },
  "reefer": {
    code: "RF",
    name: "Refrigerated Container",
    description: "Temperature-controlled container for perishables",
    icon: <Thermometer className="h-5 w-5" />,
    purchasePrice: 18000,
    leaseRatePerDay: 45,
    residualValuePercent: 15,
    maintenanceCostPercent: 5,
    lifespan: 12,
    insuranceRatePercent: 1.0,
    typicalDemand: "Medium-High",
  },
  "tank": {
    code: "ISO Tank",
    name: "Tank Container",
    description: "ISO tank for liquid and gas transport",
    icon: <Droplet className="h-5 w-5" />,
    purchasePrice: 35000,
    leaseRatePerDay: 65,
    residualValuePercent: 18,
    maintenanceCostPercent: 4,
    lifespan: 20,
    insuranceRatePercent: 1.5,
    typicalDemand: "Medium",
  },
  "special": {
    code: "Special",
    name: "Special Container",
    description: "Open-top, flat rack, or other special containers",
    icon: <Ship className="h-5 w-5" />,
    purchasePrice: 6000,
    leaseRatePerDay: 22,
    residualValuePercent: 20,
    maintenanceCostPercent: 3,
    lifespan: 15,
    insuranceRatePercent: 0.8,
    typicalDemand: "Low-Medium",
  },
};

// Calculation interfaces
interface LeaseCalculation {
  // Purchase option
  totalPurchaseCost: number;
  annualDepreciation: number;
  annualMaintenance: number;
  annualInsurance: number;
  totalAnnualCostBuy: number;
  residualValue: number;
  netCostBuy: number;

  // Lease option
  annualLeaseCost: number;
  totalLeaseCost: number;

  // Comparison
  annualSavings: number;
  breakevenUtilization: number;
  paybackPeriodYears: number;

  // ROI metrics
  roiPercent: number;
  npv: number;
  irr: number;

  // Cash flow projections
  cashFlowProjections: Array<{
    year: number;
    buyCost: number;
    leaseCost: number;
    savings: number;
    cumulativeSavings: number;
    depreciation: number;
    residual: number;
  }>;

  // Utilization analysis
  utilizationScenarios: Array<{
    utilization: number;
    leaseCost: number;
    buyCost: number;
    savings: number;
    recommendBuy: boolean;
  }>;
}

// NPV calculation
function calculateNPV(cashFlows: number[], discountRate: number): number {
  return cashFlows.reduce((npv, cf, index) => {
    return npv + cf / Math.pow(1 + discountRate, index);
  }, 0);
}

// IRR calculation using Newton-Raphson method
function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
  const maxIterations = 100;
  const tolerance = 0.0001;

  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let j = 0; j < cashFlows.length; j++) {
      const factor = Math.pow(1 + rate, j);
      npv += cashFlows[j] / factor;
      if (j > 0) {
        dnpv -= (j * cashFlows[j]) / Math.pow(1 + rate, j + 1);
      }
    }

    const newRate = rate - npv / dnpv;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate;
    }

    rate = newRate;
  }

  return rate;
}

export function ContainerLeasingROI() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input state
  const [containerType, setContainerType] = useState<ContainerType>("40GP");
  const [numberOfContainers, setNumberOfContainers] = useState<string>("10");
  const [purchasePrice, setPurchasePrice] = useState<string>("");
  const [residualValuePercent, setResidualValuePercent] = useState<string>("");
  const [dailyLeaseRate, setDailyLeaseRate] = useState<string>("");
  const [utilizationRate, setUtilizationRate] = useState<number>(80);
  const [annualMaintenancePercent, setAnnualMaintenancePercent] = useState<string>("");
  const [insuranceRatePercent, setInsuranceRatePercent] = useState<string>("");
  const [analysisPeriod, setAnalysisPeriod] = useState<number>(10);
  const [discountRate, setDiscountRate] = useState<number>(8);
  const [containerLifespan, setContainerLifespan] = useState<string>("");
  const [currency, setCurrency] = useState("USD");
  const [includeResidual, setIncludeResidual] = useState(true);
  const [considerDowntime, setConsiderDowntime] = useState(true);

  // Get container spec defaults
  const spec = CONTAINER_SPECS[containerType];

  // Calculations
  const calculations = useMemo<LeaseCalculation>(() => {
    const containers = parseInt(numberOfContainers) || 1;
    const price = parseFloat(purchasePrice) || spec.purchasePrice;
    const residualPercent = parseFloat(residualValuePercent) || spec.residualValuePercent;
    const leaseRate = parseFloat(dailyLeaseRate) || spec.leaseRatePerDay;
    const maintenancePercent = parseFloat(annualMaintenancePercent) || spec.maintenanceCostPercent;
    const insurancePercent = parseFloat(insuranceRatePercent) || spec.insuranceRatePercent;
    const lifespan = parseInt(containerLifespan) || spec.lifespan;

    const totalPurchase = price * containers;
    const residualValue = (totalPurchase * residualPercent) / 100;
    const annualDepreciation = (totalPurchase - residualValue) / lifespan;

    // Annual costs for buying
    const annualMaintenance = (totalPurchase * maintenancePercent) / 100;
    const annualInsurance = (totalPurchase * insurancePercent) / 100;

    // Utilization-adjusted costs
    const effectiveUtilization = considerDowntime ? utilizationRate / 100 : 1;
    const operationalDays = 365 * effectiveUtilization;

    // Lease costs
    const annualLeaseCost = leaseRate * operationalDays * containers;
    const totalLeaseCost = annualLeaseCost * analysisPeriod;

    // Buy costs
    const totalAnnualCostBuy = annualDepreciation + annualMaintenance + annualInsurance;
    const totalBuyCost = totalAnnualCostBuy * analysisPeriod;
    const netCostBuy = includeResidual ? totalBuyCost - residualValue : totalBuyCost;

    // Comparison
    const annualSavings = annualLeaseCost - totalAnnualCostBuy;

    // Break-even utilization
    const dailyOwnershipCost = totalAnnualCostBuy / 365;
    const breakevenUtilization = (dailyOwnershipCost / leaseRate) * 100;

    // Payback period
    const paybackPeriodYears = annualSavings > 0 ? totalPurchase / annualSavings : 999;

    // Cash flow projections
    const cashFlowProjections = [];
    let cumulativeSavings = -totalPurchase; // Initial investment

    for (let year = 0; year <= analysisPeriod; year++) {
      if (year === 0) {
        cashFlowProjections.push({
          year: 0,
          buyCost: totalPurchase,
          leaseCost: 0,
          savings: -totalPurchase,
          cumulativeSavings: -totalPurchase,
          depreciation: 0,
          residual: totalPurchase,
        });
      } else {
        const yearlyBuyCost = annualDepreciation + annualMaintenance + annualInsurance;
        const yearlyLeaseCost = annualLeaseCost;
        const yearlySavings = yearlyLeaseCost - yearlyBuyCost;

        cumulativeSavings += yearlySavings;

        const currentResidual = includeResidual
          ? totalPurchase - (annualDepreciation * year)
          : 0;

        cashFlowProjections.push({
          year,
          buyCost: yearlyBuyCost,
          leaseCost: yearlyLeaseCost,
          savings: yearlySavings,
          cumulativeSavings,
          depreciation: annualDepreciation,
          residual: Math.max(currentResidual, residualValue),
        });
      }
    }

    // ROI calculation
    const totalSavings = annualSavings * analysisPeriod;
    const roiPercent = (totalSavings / totalPurchase) * 100;

    // NPV calculation
    const cashFlows = [-totalPurchase];
    for (let year = 1; year <= analysisPeriod; year++) {
      const yearlySavings = annualLeaseCost - totalAnnualCostBuy;
      cashFlows.push(yearlySavings);
    }
    if (includeResidual) {
      cashFlows[cashFlows.length - 1] += residualValue;
    }
    const npv = calculateNPV(cashFlows, discountRate / 100);

    // IRR calculation
    const irr = calculateIRR(cashFlows);

    // Utilization scenarios
    const utilizationScenarios = [];
    for (let u = 40; u <= 100; u += 10) {
      const utilRatio = u / 100;
      const opDays = 365 * utilRatio;
      const leaseC = leaseRate * opDays * containers;
      const buyC = totalAnnualCostBuy;
      const sav = leaseC - buyC;
      utilizationScenarios.push({
        utilization: u,
        leaseCost: leaseC,
        buyCost: buyC,
        savings: sav,
        recommendBuy: sav > 0,
      });
    }

    return {
      totalPurchaseCost: totalPurchase,
      annualDepreciation,
      annualMaintenance,
      annualInsurance,
      totalAnnualCostBuy,
      residualValue,
      netCostBuy,
      annualLeaseCost,
      totalLeaseCost,
      annualSavings,
      breakevenUtilization,
      paybackPeriodYears,
      roiPercent,
      npv,
      irr: irr * 100,
      cashFlowProjections,
      utilizationScenarios,
    };
  }, [
    numberOfContainers,
    purchasePrice,
    residualValuePercent,
    dailyLeaseRate,
    utilizationRate,
    annualMaintenancePercent,
    insuranceRatePercent,
    analysisPeriod,
    discountRate,
    containerLifespan,
    spec,
    includeResidual,
    considerDowntime,
  ]);

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    area: "rgba(15, 76, 129, 0.2)",
    lease: "#EF4444",
    buy: "#0F4C81",
    savings: "#2E8B57",
  };

  const handleReset = useCallback(() => {
    setContainerType("40GP");
    setNumberOfContainers("10");
    setPurchasePrice("");
    setResidualValuePercent("");
    setDailyLeaseRate("");
    setUtilizationRate(80);
    setAnnualMaintenancePercent("");
    setInsuranceRatePercent("");
    setAnalysisPeriod(10);
    setDiscountRate(8);
    setContainerLifespan("");
    setIncludeResidual(true);
    setConsiderDowntime(true);
  }, []);

  const handleUseDefaults = useCallback(() => {
    setPurchasePrice(spec.purchasePrice.toString());
    setResidualValuePercent(spec.residualValuePercent.toString());
    setDailyLeaseRate(spec.leaseRatePerDay.toString());
    setAnnualMaintenancePercent(spec.maintenanceCostPercent.toString());
    setInsuranceRatePercent(spec.insuranceRatePercent.toString());
    setContainerLifespan(spec.lifespan.toString());
  }, [spec]);

  const handleExport = useCallback(() => {
    const data = {
      containerType,
      numberOfContainers,
      purchasePrice: parseFloat(purchasePrice) || spec.purchasePrice,
      residualValuePercent: parseFloat(residualValuePercent) || spec.residualValuePercent,
      dailyLeaseRate: parseFloat(dailyLeaseRate) || spec.leaseRatePerDay,
      utilizationRate,
      analysisPeriod,
      discountRate,
      currency,
      calculations: {
        totalInvestment: calculations.totalPurchaseCost,
        annualLeaseCost: calculations.annualLeaseCost,
        annualOwnershipCost: calculations.totalAnnualCostBuy,
        annualSavings: calculations.annualSavings,
        roi: calculations.roiPercent,
        npv: calculations.npv,
        irr: calculations.irr,
        paybackPeriod: calculations.paybackPeriodYears,
        breakevenUtilization: calculations.breakevenUtilization,
      },
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `container-leasing-analysis-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [containerType, numberOfContainers, purchasePrice, residualValuePercent, dailyLeaseRate, utilizationRate, analysisPeriod, discountRate, currency, calculations, spec]);

  const handleShare = useCallback(() => {
    const shareData = {
      title: "Container Leasing ROI Analysis",
      text: `ROI: ${calculations.roiPercent.toFixed(1)}% | Annual Savings: ${formatCurrency(calculations.annualSavings, currency)} | Payback: ${calculations.paybackPeriodYears.toFixed(1)} years`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    }
  }, [calculations, currency]);

  const currencyInfo = getCurrencyByCode(currency);

  // Cost breakdown for pie chart
  const costBreakdown = useMemo(() => [
    { name: "Depreciation", value: calculations.annualDepreciation, color: chartColors.ocean },
    { name: "Maintenance", value: calculations.annualMaintenance, color: chartColors.logistics },
    { name: "Insurance", value: calculations.annualInsurance, color: chartColors.warning },
  ], [calculations]);

  // Pro Tips
  const proTips = [
    {
      icon: <Target className="h-5 w-5 text-[var(--ocean)]" />,
      title: "Monitor Utilization Thresholds",
      description: "Track your actual container utilization closely. If utilization consistently exceeds the break-even point, purchasing becomes more attractive. Set alerts when utilization drops below critical levels to reassess your strategy."
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />,
      title: "Consider Market Cycles",
      description: "Container prices and lease rates fluctuate with global trade cycles. During market downturns, purchase prices may drop significantly while lease rates remain relatively stable. Time your investments strategically."
    },
    {
      icon: <PiggyBank className="h-5 w-5 text-[var(--ocean)]" />,
      title: "Factor in Hidden Costs",
      description: "Beyond purchase price, account for depot storage fees, repositioning costs, inspection charges, and repair reserves. These can add 5-15% to your total cost of ownership and significantly impact ROI calculations."
    },
    {
      icon: <Scale className="h-5 w-5 text-[var(--logistics)]" />,
      title: "Diversify Your Fleet",
      description: "Mix owned and leased containers to balance risk. A common strategy is owning 60-70% of your core fleet while leasing the remainder for seasonal demand spikes. This provides flexibility while capturing ownership benefits."
    },
    {
      icon: <Clock className="h-5 w-5 text-[var(--ocean)]" />,
      title: "Plan for End-of-Life",
      description: "Container resale values vary significantly by condition and market demand. Factor in refurbishment costs before sale, and track the used container market to optimize your exit timing. Well-maintained containers retain 20-30% value."
    },
    {
      icon: <Zap className="h-5 w-5 text-[var(--logistics)]" />,
      title: "Negotiate Lease Terms",
      description: "Long-term leases often come with significant discounts (10-25% off daily rates). If your operations require containers for extended periods, negotiate master lease agreements with volume commitments and preferential terms."
    }
  ];

  // Common Mistakes
  const commonMistakes = [
    {
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      title: "Ignoring Utilization Variability",
      description: "Many buyers assume 100% utilization when calculating ROI. In reality, containers sit idle during repositioning, maintenance, and seasonal lulls. Use realistic utilization rates (typically 70-85%) to avoid overstating potential returns."
    },
    {
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      title: "Underestimating Maintenance Costs",
      description: "Containers require regular inspections, cleaning, painting, and repairs. Specialized containers like reefers have significantly higher maintenance requirements. Budget 2-5% of purchase price annually for dry containers, and up to 8% for specialized units."
    },
    {
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      title: "Overlooking Financing Impact",
      description: "If you need to finance container purchases, the interest expense can dramatically change the buy vs lease equation. Calculate the true cost of capital and compare it against lease rates. Sometimes a financed purchase costs more than leasing."
    },
    {
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      title: "Neglecting Opportunity Cost",
      description: "Capital tied up in containers could be deployed elsewhere in your business. Calculate the opportunity cost of ownership by considering what return that capital could generate in alternative investments or operations expansion."
    },
    {
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      title: "Failing to Account for Technology Changes",
      description: "Container technology evolves - new tracking systems, improved insulation for reefers, and smart container features. Owning older containers may limit your competitive advantage as customers demand modern features."
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "What is container leasing and how does it work?",
      answer: "Container leasing is a business arrangement where shipping lines, freight forwarders, or other logistics companies rent containers from leasing companies rather than purchasing them outright. The leasing industry represents approximately 50-55% of the global container fleet. Leases typically fall into three categories: master leases (flexible, with multiple pickup and drop-off locations), term leases (fixed duration with predetermined rates), and one-way leases (designed for specific routes with pickup at origin and drop-off at destination). Leasing companies manage large fleets and offer containers at various depots worldwide, providing flexibility that ownership cannot match. Daily rates vary based on container type, lease duration, and market conditions. This arrangement allows companies to scale their container fleet up or down based on seasonal demand without the capital commitment of ownership."
    },
    {
      question: "What factors should I consider when deciding between buying and leasing containers?",
      answer: "The buy vs lease decision depends on multiple interrelated factors that require careful analysis. First, consider your utilization rate - high utilization (typically above 70-80%) favors buying, while lower utilization makes leasing more attractive. Second, evaluate your capital availability and cost - purchasing requires significant upfront investment that could be deployed elsewhere. Third, analyze your operational flexibility needs - leasing offers easy scaling and variety of container types without long-term commitment. Fourth, consider geographic considerations - if you operate in regions with container imbalances, leasing provides flexibility for repositioning. Fifth, assess your technical capabilities - owned containers require maintenance management, inspection programs, and repair networks. Sixth, factor in market conditions - container prices fluctuate with steel prices and trade volumes, creating timing opportunities for buyers. Finally, consider tax implications - lease payments are operating expenses, while purchases offer depreciation benefits. Use this calculator to model different scenarios and find your optimal strategy."
    },
    {
      question: "How is container depreciation calculated and what affects residual values?",
      answer: "Container depreciation is typically calculated using the straight-line method over the container's useful life, which ranges from 10-15 years for standard dry containers and 8-12 years for specialized units like reefers. The annual depreciation equals (Purchase Price - Residual Value) / Useful Life. Residual values are influenced by several factors: container condition (measured by survey grades A, B, C), market demand for used containers, steel prices (as containers are often sold for scrap), and geographic location. Standard dry containers typically retain 15-25% of their value after full depreciation, while specialized containers like reefers may retain only 10-15% due to higher maintenance costs and faster technological obsolescence. The used container market is active, with trading companies specializing in buying and selling second-hand units. Well-maintained containers with valid CSC plates command premium prices. When calculating ROI, use conservative residual estimates and consider that selling costs (commissions, transportation, repairs) will reduce net proceeds."
    },
    {
      question: "What is a good ROI for container investment?",
      answer: "A good ROI for container investment depends on your risk tolerance, alternative investment opportunities, and operational context. Generally, container investments should yield higher returns than low-risk investments like government bonds (4-6%) to compensate for operational risks. Industry benchmarks suggest that well-managed container portfolios can achieve ROI of 10-25% annually, though this varies significantly with market conditions. During peak shipping seasons or supply chain disruptions, returns can exceed 30% due to elevated lease rates. Consider comparing your container investment ROI against your company's weighted average cost of capital (WACC) - investments should exceed WACC to create shareholder value. Also compare against industry-specific alternatives: if you're a shipping line, compare against vessel investments; if you're a leasing company, compare against other asset classes. The ROI calculation should include all costs: depreciation, maintenance, insurance, repositioning, and administrative overhead. Use sensitivity analysis to understand how changes in utilization, lease rates, and residual values affect your returns."
    },
    {
      question: "How does container utilization rate impact the buy vs lease decision?",
      answer: "Utilization rate is perhaps the single most critical factor in the buy vs lease analysis. When you own containers, you bear the cost of ownership (depreciation, maintenance, insurance) regardless of whether the container is generating revenue. When leasing, you only pay for days the container is in use. This creates a break-even utilization rate - the threshold above which buying becomes more economical. For example, if daily ownership cost is $3 and daily lease rate is $10, the break-even is 30% utilization. Above this rate, ownership costs less per day of use. However, the calculation is more nuanced. Consider repositioning: owned containers must be moved empty to their next assignment, incurring costs without revenue. Leased containers can be dropped off at convenient depots. Consider seasonal variations: if utilization drops significantly during off-peak seasons, the flexibility of leasing becomes more valuable. Our analysis shows that for most standard containers, buying becomes attractive when sustained utilization exceeds 65-75%. For specialized containers with higher maintenance costs, the threshold may be higher. Use this calculator's utilization scenario analysis to understand your specific break-even point."
    },
    {
      question: "What are the tax implications of buying versus leasing containers?",
      answer: "The tax treatment differs significantly between owned and leased containers, and the optimal choice depends on your company's tax situation and jurisdiction. For owned containers: You can claim depreciation as a tax-deductible expense. In most jurisdictions, containers are depreciated over 10-15 years using straight-line or accelerated methods. Interest on financing for purchases is typically deductible. When you sell containers, you may face recapture of depreciation if sold above book value, or claim a loss if sold below. For leased containers: Lease payments are generally fully deductible as operating expenses in the year incurred. There's no capital gains exposure since you don't own the asset. The treatment can provide more predictable tax planning. From a cash flow perspective, leasing deductions are spread evenly, while ownership concentrates deductions in depreciation schedules. Some jurisdictions offer investment tax credits for equipment purchases that favor buying. International operations add complexity - different countries have different rules for container depreciation and lease expense deductibility. Consult with a tax advisor to model the after-tax impact of each option for your specific situation."
    },
    {
      question: "How do I account for maintenance and repair costs in my analysis?",
      answer: "Maintenance and repair costs are a significant component of container ownership that must be accurately estimated for reliable ROI calculations. Industry standards suggest budgeting 2-3% of purchase price annually for dry containers, 4-6% for reefers, and 3-5% for tank containers. These costs include: regular inspections (required for CSC certification, typically $50-150 per inspection), cleaning between uses ($20-100 for dry containers, $200-500 for reefers), repairs (flooring replacement, door gaskets, structural repairs), painting and rebranding when needed, and refrigeration system maintenance for reefers (compressor servicing, refrigerant replacement). Costs vary by trade route - containers on routes with handling intensive cargo or harsh environments require more maintenance. Build a maintenance reserve fund by setting aside a portion of lease revenue or budgeting monthly provisions. Track actual costs against your estimates and adjust your analysis accordingly. For leased containers, maintenance is typically the lessor's responsibility under master lease agreements, though you may be charged for damage beyond normal wear and tear. Some leasing companies offer maintenance-inclusive rates that simplify budgeting."
    },
    {
      question: "What happens to my analysis if market conditions change?",
      answer: "Market conditions can significantly impact your container investment analysis, and it's essential to model various scenarios. Key market variables include: Container prices - influenced by steel prices, manufacturing capacity in China, and global trade volumes. Prices can swing 20-40% within a single year. Lease rates - driven by supply/demand imbalances, seasonal patterns, and major events like the 2021-2022 supply chain crisis that saw rates increase 5-10x. Utilization rates - affected by trade lane imbalances, seasonal cargo patterns, and economic cycles. Residual values - impacted by used container market dynamics and steel scrap prices. Your analysis should include sensitivity testing: What if lease rates drop 20%? What if utilization falls to 60%? What if container prices decline, affecting residual values? The calculator's NPV and IRR calculations help by incorporating the time value of money, making them more robust to timing variations. Consider creating contingency plans: if you buy, could you enter the leasing market if utilization drops? If you lease, do you have purchase options if rates spike? Monitor leading indicators like manufacturing PMI, trade volumes, and container order books to anticipate market shifts."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8 border border-[var(--ocean)]/10">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 animate-pulse">
            Container Finance
          </Badge>
          <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20">
            ROI Analysis
          </Badge>
          <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20">
            Asset Management
          </Badge>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Container Leasing ROI Calculator
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-3xl mb-6">
          Make informed decisions about container ownership vs leasing. Calculate ROI, NPV, IRR, and break-even utilization 
          to optimize your container fleet investment strategy.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleShare} variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="guide">Guide</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[var(--ocean)]" />
                  Container Investment Parameters
                </CardTitle>
                <CardDescription>Configure your container investment analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Container Type Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Container Type</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(Object.keys(CONTAINER_SPECS) as ContainerType[]).map((key) => {
                      const container = CONTAINER_SPECS[key];
                      return (
                        <Button
                          key={key}
                          variant={containerType === key ? "default" : "outline"}
                          className={`h-auto py-3 px-3 flex flex-col items-start gap-1 ${
                            containerType === key ? "gradient-ocean text-white" : ""
                          }`}
                          onClick={() => setContainerType(key)}
                        >
                          <div className="flex items-center gap-2">
                            {container.icon}
                            <span className="font-medium text-xs">{container.name}</span>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">{spec.description}</p>
                </div>

                <Separator />

                {/* Container Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="numContainers">Number of Containers</Label>
                    <Input
                      id="numContainers"
                      type="number"
                      value={numberOfContainers}
                      onChange={(e) => setNumberOfContainers(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.slice(0, 15).map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code} - {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Purchase Parameters */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Purchase Parameters</Label>
                    <Button variant="ghost" size="sm" onClick={handleUseDefaults}>
                      Use Defaults
                    </Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="purchasePrice">Purchase Price (per container)</Label>
                      <div className="relative mt-1.5">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="purchasePrice"
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(e.target.value)}
                          placeholder={`Default: ${spec.purchasePrice}`}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="residualValue">Residual Value (%)</Label>
                      <div className="relative mt-1.5">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="residualValue"
                          type="number"
                          value={residualValuePercent}
                          onChange={(e) => setResidualValuePercent(e.target.value)}
                          placeholder={`Default: ${spec.residualValuePercent}`}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lifespan">Container Lifespan (years)</Label>
                    <Input
                      id="lifespan"
                      type="number"
                      value={containerLifespan}
                      onChange={(e) => setContainerLifespan(e.target.value)}
                      placeholder={`Default: ${spec.lifespan}`}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <Separator />

                {/* Lease Parameters */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Lease Parameters</Label>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dailyLeaseRate">Daily Lease Rate (per container)</Label>
                      <div className="relative mt-1.5">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="dailyLeaseRate"
                          type="number"
                          step="0.5"
                          value={dailyLeaseRate}
                          onChange={(e) => setDailyLeaseRate(e.target.value)}
                          placeholder={`Default: ${spec.leaseRatePerDay}`}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Utilization Rate: {utilizationRate}%</Label>
                      <Slider
                        value={[utilizationRate]}
                        onValueChange={(v) => setUtilizationRate(v[0])}
                        min={40}
                        max={100}
                        step={5}
                        className="mt-4"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Operating Costs */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Operating Costs (Annual % of Purchase)</Label>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maintenance">Maintenance Cost (%)</Label>
                      <div className="relative mt-1.5">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="maintenance"
                          type="number"
                          step="0.1"
                          value={annualMaintenancePercent}
                          onChange={(e) => setAnnualMaintenancePercent(e.target.value)}
                          placeholder={`Default: ${spec.maintenanceCostPercent}`}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="insurance">Insurance Rate (%)</Label>
                      <div className="relative mt-1.5">
                        <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="insurance"
                          type="number"
                          step="0.1"
                          value={insuranceRatePercent}
                          onChange={(e) => setInsuranceRatePercent(e.target.value)}
                          placeholder={`Default: ${spec.insuranceRatePercent}`}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Analysis Parameters */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Analysis Parameters</Label>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Analysis Period: {analysisPeriod} years</Label>
                      <Slider
                        value={[analysisPeriod]}
                        onValueChange={(v) => setAnalysisPeriod(v[0])}
                        min={3}
                        max={20}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Discount Rate: {discountRate}%</Label>
                      <Slider
                        value={[discountRate]}
                        onValueChange={(v) => setDiscountRate(v[0])}
                        min={3}
                        max={15}
                        step={0.5}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="includeResidual" className="text-sm">Include Residual Value in NPV</Label>
                      <Switch
                        id="includeResidual"
                        checked={includeResidual}
                        onCheckedChange={setIncludeResidual}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="considerDowntime" className="text-sm">Consider Utilization for Lease</Label>
                      <Switch
                        id="considerDowntime"
                        checked={considerDowntime}
                        onCheckedChange={setConsiderDowntime}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleReset} variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Calculator
                </Button>
              </CardContent>
            </Card>

            {/* Results Card */}
            <div className="space-y-6">
              <Card className="border-[var(--ocean)]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Investment Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Total Investment */}
                    <div className="p-4 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Investment</p>
                      <p className="text-2xl font-bold text-[var(--ocean)]">
                        {formatCurrency(calculations.totalPurchaseCost, currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {numberOfContainers} x {spec.name}
                      </p>
                    </div>

                    {/* Residual Value */}
                    <div className="p-4 bg-muted/50 dark:bg-muted/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Residual Value</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(calculations.residualValue, currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {parseFloat(residualValuePercent) || spec.residualValuePercent}% of purchase
                      </p>
                    </div>

                    {/* Annual Lease Cost */}
                    <div className="p-4 bg-destructive/10 dark:bg-destructive/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Annual Lease Cost</p>
                      <p className="text-2xl font-bold text-destructive">
                        {formatCurrency(calculations.annualLeaseCost, currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        @ {utilizationRate}% utilization
                      </p>
                    </div>

                    {/* Annual Buy Cost */}
                    <div className="p-4 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Annual Ownership Cost</p>
                      <p className="text-2xl font-bold text-[var(--logistics)]">
                        {formatCurrency(calculations.totalAnnualCostBuy, currency)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dep. + Maint. + Insurance
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Key Metrics */}
                  <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 dark:from-[var(--ocean)]/20 dark:to-[var(--logistics)]/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-[var(--ocean)]" />
                      <Label className="text-base font-medium">Key Decision Metrics</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Annual Savings (Buy vs Lease)</p>
                        <p className={`text-xl font-bold ${calculations.annualSavings > 0 ? "text-[var(--logistics)]" : "text-destructive"}`}>
                          {calculations.annualSavings > 0 ? "+" : ""}{formatCurrency(calculations.annualSavings, currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Break-Even Utilization</p>
                        <p className="text-xl font-bold text-[var(--ocean)]">
                          {calculations.breakevenUtilization.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Payback Period</p>
                        <p className="text-xl font-bold">
                          {calculations.paybackPeriodYears > 20 ? "> 20 years" : `${calculations.paybackPeriodYears.toFixed(1)} years`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className={`text-xl font-bold ${calculations.roiPercent > 0 ? "text-[var(--logistics)]" : "text-destructive"}`}>
                          {calculations.roiPercent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className={`mt-4 p-4 rounded-lg ${
                    calculations.annualSavings > 0
                      ? "bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/20 border border-[var(--logistics)]/20"
                      : "bg-destructive/10 dark:bg-destructive/20 border border-destructive/20"
                  }`}>
                    <div className="flex items-start gap-3">
                      {calculations.annualSavings > 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">
                          {calculations.annualSavings > 0 ? "Buying Recommended" : "Leasing Recommended"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {calculations.annualSavings > 0
                            ? `Buying containers saves ${formatCurrency(calculations.annualSavings, currency)}/year compared to leasing at current utilization.`
                            : `Leasing is more cost-effective at ${utilizationRate}% utilization. Buy when utilization exceeds ${calculations.breakevenUtilization.toFixed(0)}%.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Container Spec Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    {spec.icon}
                    {spec.name} Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Purchase Price</p>
                      <p className="font-medium">{formatCurrency(spec.purchasePrice, "USD")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Daily Lease Rate</p>
                      <p className="font-medium">{formatCurrency(spec.leaseRatePerDay, "USD")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lifespan</p>
                      <p className="font-medium">{spec.lifespan} years</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Market Demand</p>
                      <Badge variant="outline">{spec.typicalDemand}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* ROI Metrics Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/20 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Return on Investment</p>
                    <p className={`text-2xl font-bold ${calculations.roiPercent > 0 ? "text-[var(--logistics)]" : "text-destructive"}`}>
                      {calculations.roiPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/20 rounded-lg">
                    <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Present Value</p>
                    <p className={`text-2xl font-bold ${calculations.npv > 0 ? "text-[var(--logistics)]" : "text-destructive"}`}>
                      {formatCurrency(calculations.npv, currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/20 rounded-lg">
                    <GrowthIcon className="h-5 w-5 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Internal Rate of Return</p>
                    <p className={`text-2xl font-bold ${calculations.irr > 0 ? "text-[var(--logistics)]" : "text-destructive"}`}>
                      {calculations.irr.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/20 rounded-lg">
                    <Clock className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payback Period</p>
                    <p className="text-2xl font-bold">
                      {calculations.paybackPeriodYears > 20 ? "> 20 yrs" : `${calculations.paybackPeriodYears.toFixed(1)} yrs`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Break-Even Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Break-Even Analysis
              </CardTitle>
              <CardDescription>
                Understanding your break-even utilization point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/20 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Break-Even Utilization</p>
                    <p className="text-4xl font-bold text-[var(--ocean)]">
                      {calculations.breakevenUtilization.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      At your current configuration, you need containers to be utilized at least{" "}
                      <strong className="text-foreground">{calculations.breakevenUtilization.toFixed(1)}%</strong> of the time 
                      for buying to be more economical than leasing.
                    </p>
                    <p>
                      Your current utilization setting is <strong className="text-foreground">{utilizationRate}%</strong>, 
                      which is {utilizationRate >= calculations.breakevenUtilization ? 
                        <span className="text-[var(--logistics)] font-medium">above the break-even point</span> : 
                        <span className="text-destructive font-medium">below the break-even point</span>}.
                    </p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={calculations.utilizationScenarios}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="utilization" tickFormatter={(v) => `${v}%`} />
                      <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                        labelFormatter={(label) => `Utilization: ${label}%`}
                      />
                      <ReferenceLine
                        x={calculations.breakevenUtilization}
                        stroke={chartColors.ocean}
                        strokeDasharray="5 5"
                        label={{ value: "Break-Even", position: "top" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="leaseCost"
                        stroke={chartColors.lease}
                        fill={chartColors.lease}
                        fillOpacity={0.2}
                        name="Lease Cost"
                      />
                      <ReferenceLine
                        y={calculations.totalAnnualCostBuy}
                        stroke={chartColors.buy}
                        strokeDasharray="5 5"
                        label={{ value: "Ownership Cost", position: "right" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                ROI Comparison
              </CardTitle>
              <CardDescription>
                Comparing returns across different metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "ROI",
                        value: calculations.roiPercent,
                        color: chartColors.logistics,
                      },
                      {
                        name: "IRR",
                        value: calculations.irr,
                        color: chartColors.ocean,
                      },
                      {
                        name: "Discount Rate",
                        value: discountRate,
                        color: chartColors.warning,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      <Cell fill={chartColors.logistics} />
                      <Cell fill={chartColors.ocean} />
                      <Cell fill={chartColors.warning} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cumulative Returns Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                Cumulative Returns Over Time
              </CardTitle>
              <CardDescription>
                Track cumulative savings and returns throughout the analysis period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={calculations.cashFlowProjections}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="year" tickFormatter={(v) => `Year ${v}`} />
                    <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, currency)}
                      labelFormatter={(label) => `Year ${label}`}
                    />
                    <Legend />
                    <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="cumulativeSavings"
                      stroke={chartColors.savings}
                      strokeWidth={2}
                      dot={{ fill: chartColors.savings }}
                      name="Cumulative Savings"
                    />
                    <Line
                      type="monotone"
                      dataKey="residual"
                      stroke={chartColors.ocean}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: chartColors.ocean }}
                      name="Residual Value"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Comparison */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Annual Cost Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Annual Cost Comparison</CardTitle>
                <CardDescription>Compare ownership vs leasing costs per year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          category: "Leasing",
                          cost: calculations.annualLeaseCost,
                          color: chartColors.lease,
                        },
                        {
                          category: "Ownership",
                          cost: calculations.totalAnnualCostBuy,
                          color: chartColors.buy,
                        },
                      ]}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis dataKey="category" type="category" width={80} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                        labelFormatter={(label) => `${label} Cost`}
                      />
                      <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                        <Cell fill={chartColors.lease} />
                        <Cell fill={chartColors.buy} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-destructive/10 dark:bg-destructive/20 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Annual Lease</p>
                    <p className="font-bold text-destructive">
                      {formatCurrency(calculations.annualLeaseCost, currency)}
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/20 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Annual Ownership</p>
                    <p className="font-bold text-[var(--ocean)]">
                      {formatCurrency(calculations.totalAnnualCostBuy, currency)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Ownership Cost Breakdown</CardTitle>
                <CardDescription>Where your money goes when owning containers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-4">
                  {costBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.value, currency)}
                      </span>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Annual Cost</span>
                    <span>{formatCurrency(calculations.totalAnnualCostBuy, currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Utilization Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Utilization Scenarios</CardTitle>
              <CardDescription>How utilization rate affects buy vs lease decision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={calculations.utilizationScenarios}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="utilization" tickFormatter={(v) => `${v}%`} />
                    <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value, currency)}
                      labelFormatter={(label) => `Utilization: ${label}%`}
                    />
                    <Legend />
                    <ReferenceLine
                      y={calculations.totalAnnualCostBuy}
                      stroke={chartColors.buy}
                      strokeDasharray="5 5"
                      label={{ value: "Ownership Cost", position: "right" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="leaseCost"
                      stroke={chartColors.lease}
                      strokeWidth={2}
                      dot={{ fill: chartColors.lease }}
                      name="Lease Cost"
                    />
                    <Bar dataKey="buyCost" fill={chartColors.buy} fillOpacity={0.3} name="Buy Cost" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">Utilization</th>
                      <th className="text-right py-2 px-3">Lease Cost</th>
                      <th className="text-right py-2 px-3">Buy Cost</th>
                      <th className="text-right py-2 px-3">Annual Savings</th>
                      <th className="text-center py-2 px-3">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.utilizationScenarios.map((scenario, index) => (
                      <tr key={index} className={`border-b ${scenario.utilization === utilizationRate ? "bg-muted/50" : ""}`}>
                        <td className="py-2 px-3 font-medium">{scenario.utilization}%</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(scenario.leaseCost, currency)}</td>
                        <td className="py-2 px-3 text-right">{formatCurrency(scenario.buyCost, currency)}</td>
                        <td className={`py-2 px-3 text-right ${scenario.savings > 0 ? "text-[var(--logistics)]" : "text-destructive"}`}>
                          {scenario.savings > 0 ? "+" : ""}{formatCurrency(scenario.savings, currency)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Badge variant={scenario.recommendBuy ? "default" : "destructive"}>
                            {scenario.recommendBuy ? "Buy" : "Lease"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Total Cost Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Total Cost Over {analysisPeriod} Years</CardTitle>
              <CardDescription>Long-term financial comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-[var(--ocean)]/10 dark:bg-[var(--ocean)]/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="h-6 w-6 text-[var(--ocean)]" />
                    <h3 className="font-semibold text-lg">Ownership Path</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Investment</span>
                      <span className="font-medium">{formatCurrency(calculations.totalPurchaseCost, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Operating Costs ({analysisPeriod} yrs)</span>
                      <span className="font-medium">{formatCurrency(calculations.totalAnnualCostBuy * analysisPeriod, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Less: Residual Value</span>
                      <span className="font-medium text-[var(--logistics)]">-{formatCurrency(calculations.residualValue, currency)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Net Total Cost</span>
                      <span>{formatCurrency(calculations.netCostBuy, currency)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-destructive/10 dark:bg-destructive/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Ship className="h-6 w-6 text-destructive" />
                    <h3 className="font-semibold text-lg">Leasing Path</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Initial Investment</span>
                      <span className="font-medium">{formatCurrency(0, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lease Payments ({analysisPeriod} yrs)</span>
                      <span className="font-medium">{formatCurrency(calculations.totalLeaseCost, currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Residual Value</span>
                      <span className="font-medium">{formatCurrency(0, currency)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Net Total Cost</span>
                      <span>{formatCurrency(calculations.totalLeaseCost, currency)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg ${
                calculations.netCostBuy < calculations.totalLeaseCost
                  ? "bg-[var(--logistics)]/10 dark:bg-[var(--logistics)]/20 border border-[var(--logistics)]/20"
                  : "bg-destructive/10 dark:bg-destructive/20 border border-destructive/20"
              }`}>
                <div className="flex items-center gap-3">
                  {calculations.netCostBuy < calculations.totalLeaseCost ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">
                      {calculations.netCostBuy < calculations.totalLeaseCost ? "Ownership saves money" : "Leasing saves money"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {calculations.netCostBuy < calculations.totalLeaseCost
                        ? `Buying saves ${formatCurrency(calculations.totalLeaseCost - calculations.netCostBuy, currency)} over ${analysisPeriod} years`
                        : `Leasing saves ${formatCurrency(calculations.netCostBuy - calculations.totalLeaseCost, currency)} over ${analysisPeriod} years`
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Educational Content Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Understanding Container Leasing
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Container leasing is a fundamental component of the global shipping industry, accounting for approximately 50-55% of the world&apos;s container fleet. The leasing model provides shipping lines, freight forwarders, and logistics companies with flexible access to containers without the capital intensity of ownership. The three primary lease structures include master leases, which offer maximum flexibility with multiple pickup and drop-off locations worldwide; term leases, which provide fixed rates for specified durations typically ranging from one to five years; and one-way leases, designed for specific trade routes where containers can be picked up at origin and dropped off at destination. Each structure serves different operational needs and risk profiles. Understanding the economics of leasing versus ownership requires analyzing utilization rates, capital costs, maintenance obligations, and market conditions. Leasing companies manage massive fleets across global depot networks, providing availability that individual companies cannot match. This calculator helps you model the financial implications of each approach based on your specific operational parameters.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[var(--logistics)]" />
                Lease vs Buy Decision Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The decision between leasing and buying containers involves multiple interconnected factors that extend beyond simple cost calculations. Utilization rate is paramount - owned containers generate costs regardless of use, while leased containers only incur charges when deployed. Companies with highly variable demand patterns benefit from leasing flexibility, while those with stable, high-volume operations often find ownership more economical. Capital availability and cost represent another critical factor - purchasing requires significant upfront investment that could otherwise fund operations or growth initiatives. The weighted average cost of capital (WACC) should be compared against potential returns from container ownership. Operational flexibility needs vary by company - some require rapid fleet scaling capabilities, while others prefer asset stability. Geographic considerations matter enormously - companies operating on trade lanes with severe container imbalances may find leasing more advantageous due to repositioning flexibility. Technical capabilities for maintenance management, inspection programs, and repair networks are essential for owners but not required for lessees. Market timing presents both opportunity and risk - container prices fluctuate with steel prices, manufacturing capacity, and global trade volumes. Finally, tax implications differ significantly between the two approaches, with lease payments typically deductible as operating expenses while ownership offers depreciation benefits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-[var(--ocean)]" />
                Container Depreciation
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Container depreciation follows the straight-line method in most financial analyses, spreading the cost of the container over its useful life while accounting for residual value. Standard dry containers typically have useful lives of 12-15 years, while specialized containers like reefers and tanks may have shorter lives of 8-12 years due to higher maintenance requirements and faster technological obsolescence. The annual depreciation charge equals the purchase price minus the estimated residual value, divided by the useful life. Residual values typically range from 15-25% for standard containers and 10-18% for specialized units, though these estimates should be conservative given market volatility. The used container market is active and global, with trading companies specializing in buying, refurbishing, and reselling second-hand units. Container condition is graded (A, B, C) based on structural integrity, cosmetic appearance, and certification status. Well-maintained containers with valid CSC (Convention for Safe Containers) plates command premium prices. Steel scrap value provides a floor for residual values, but transportation costs to scrap yards can significantly reduce net proceeds. When modeling depreciation, consider that maintenance quality directly impacts residual values - neglected containers may sell for far less than well-maintained peers. Also factor in potential refurbishment costs before sale, which typically range from $100-500 per container depending on work required.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                ROI Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Return on Investment (ROI) for container assets requires a comprehensive analysis that accounts for all costs and benefits over the investment horizon. The basic ROI formula compares cumulative savings from ownership versus leasing against the initial investment, but this simplified approach misses important nuances. Net Present Value (NPV) provides a more sophisticated measure by discounting future cash flows to present value, accounting for the time value of money. A positive NPV indicates that ownership creates value above the required rate of return. Internal Rate of Return (IRR) shows the effective annual return on the investment, which can be compared against alternative investment opportunities or the company&apos;s cost of capital. Payback period indicates how quickly the initial investment is recovered, useful for companies with shorter planning horizons or higher risk tolerance. When calculating ROI, include all relevant costs: purchase price, financing costs if applicable, maintenance, insurance, repositioning, depot storage, inspections, repairs, and administrative overhead. On the benefit side, compare against lease payments that would otherwise be incurred, and include residual value at the end of the analysis period. Sensitivity analysis is essential - model how ROI changes under different utilization scenarios, lease rate environments, and residual value assumptions. Industry benchmarks suggest well-managed container portfolios can achieve returns of 10-25% annually, though results vary significantly with market conditions and operational efficiency.
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--ocean)]" />
                Pro Tips and Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {proTips.map((tip, index) => (
                  <div key={index} className="p-4 bg-muted/50 dark:bg-muted/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{tip.icon}</div>
                      <div>
                        <h4 className="font-medium mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <div key={index} className="p-4 bg-destructive/5 dark:bg-destructive/10 rounded-lg border border-destructive/10">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{mistake.icon}</div>
                      <div>
                        <h4 className="font-medium mb-1">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about container leasing and ROI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed pt-2">
                        {faq.answer}
                      </p>
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
