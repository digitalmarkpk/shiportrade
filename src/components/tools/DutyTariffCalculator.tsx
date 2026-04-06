"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  DollarSign,
  Percent,
  Info,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Download,
  Share2,
  FileText,
  Globe,
  BookOpen,
  Sparkles,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Ship,
  Plane,
  Users,
  Building2,
  Scale,
  RefreshCw,
  Search,
  Package,
  Landmark,
  Receipt,
  Coins,
  CalculatorIcon,
  ArrowDownToLine,
  Zap,
  Shield,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface DutyResult {
  customsValue: number;
  dutyAmount: number;
  vatAmount: number;
  otherFees: number;
  totalDuties: number;
  landedCost: number;
}

// Sample duty rates by country and product category
const countryDutyRates: Record<string, { name: string; vatRate: number; categories: Record<string, number> }> = {
  US: {
    name: "United States",
    vatRate: 0,
    categories: {
      electronics: 0,
      textiles: 12,
      machinery: 2.5,
      chemicals: 5,
      food: 3,
      furniture: 3,
      auto_parts: 4,
      medical: 0,
    },
  },
  EU: {
    name: "European Union",
    vatRate: 21,
    categories: {
      electronics: 0,
      textiles: 12,
      machinery: 2.7,
      chemicals: 6.5,
      food: 8,
      furniture: 3,
      auto_parts: 4.5,
      medical: 0,
    },
  },
  UK: {
    name: "United Kingdom",
    vatRate: 20,
    categories: {
      electronics: 0,
      textiles: 12,
      machinery: 2.7,
      chemicals: 6.5,
      food: 8,
      furniture: 3,
      auto_parts: 4.5,
      medical: 0,
    },
  },
  CN: {
    name: "China",
    vatRate: 13,
    categories: {
      electronics: 0,
      textiles: 8,
      machinery: 6,
      chemicals: 8,
      food: 10,
      furniture: 8,
      auto_parts: 10,
      medical: 4,
    },
  },
  AU: {
    name: "Australia",
    vatRate: 10,
    categories: {
      electronics: 0,
      textiles: 5,
      machinery: 0,
      chemicals: 5,
      food: 5,
      furniture: 5,
      auto_parts: 5,
      medical: 0,
    },
  },
  CA: {
    name: "Canada",
    vatRate: 5,
    categories: {
      electronics: 0,
      textiles: 10,
      machinery: 0,
      chemicals: 5,
      food: 5,
      furniture: 6,
      auto_parts: 6,
      medical: 0,
    },
  },
  JP: {
    name: "Japan",
    vatRate: 10,
    categories: {
      electronics: 0,
      textiles: 8,
      machinery: 0,
      chemicals: 3,
      food: 12,
      furniture: 3,
      auto_parts: 0,
      medical: 0,
    },
  },
  IN: {
    name: "India",
    vatRate: 18,
    categories: {
      electronics: 10,
      textiles: 10,
      machinery: 7.5,
      chemicals: 10,
      food: 30,
      furniture: 20,
      auto_parts: 15,
      medical: 5,
    },
  },
};

const categoryNames: Record<string, string> = {
  electronics: "Electronics & Electrical Equipment",
  textiles: "Textiles & Apparel",
  machinery: "Machinery & Equipment",
  chemicals: "Chemicals & Pharmaceuticals",
  food: "Food & Agricultural Products",
  furniture: "Furniture & Home Goods",
  auto_parts: "Automotive Parts",
  medical: "Medical Devices & Supplies",
};

const incotermsDutyResponsibility: Record<string, { buyerPaysFreight: boolean; buyerPaysInsurance: boolean }> = {
  EXW: { buyerPaysFreight: true, buyerPaysInsurance: true },
  FCA: { buyerPaysFreight: true, buyerPaysInsurance: true },
  FAS: { buyerPaysFreight: true, buyerPaysInsurance: true },
  FOB: { buyerPaysFreight: true, buyerPaysInsurance: true },
  CFR: { buyerPaysFreight: false, buyerPaysInsurance: true },
  CIF: { buyerPaysFreight: false, buyerPaysInsurance: false },
  CPT: { buyerPaysFreight: false, buyerPaysInsurance: true },
  CIP: { buyerPaysFreight: false, buyerPaysInsurance: false },
  DAP: { buyerPaysFreight: false, buyerPaysInsurance: false },
  DPU: { buyerPaysFreight: false, buyerPaysInsurance: false },
  DDP: { buyerPaysFreight: false, buyerPaysInsurance: false },
};

// HS Code Chapter Reference Data
const hsCodeChapters = [
  { chapter: "01-05", description: "Animal & Animal Products", avgDuty: "0-12%", hsCode: "0101-0511" },
  { chapter: "06-14", description: "Vegetable Products", avgDuty: "0-15%", hsCode: "0601-1411" },
  { chapter: "15", description: "Animal or Vegetable Fats & Oils", avgDuty: "0-10%", hsCode: "1501-1522" },
  { chapter: "16-24", description: "Foodstuffs, Beverages & Tobacco", avgDuty: "5-25%", hsCode: "1601-2403" },
  { chapter: "25-27", description: "Mineral Products", avgDuty: "0-5%", hsCode: "2501-2716" },
  { chapter: "28-29", description: "Chemicals", avgDuty: "0-8%", hsCode: "2801-2942" },
  { chapter: "30", description: "Pharmaceuticals", avgDuty: "0-5%", hsCode: "3001-3006" },
  { chapter: "31-34", description: "Chemical Products", avgDuty: "3-12%", hsCode: "3101-3406" },
  { chapter: "35-40", description: "Plastics, Rubber & Chemicals", avgDuty: "0-10%", hsCode: "3501-4017" },
  { chapter: "41-43", description: "Raw Hides, Skins & Leather", avgDuty: "0-12%", hsCode: "4101-4305" },
  { chapter: "44-46", description: "Wood & Wood Products", avgDuty: "0-8%", hsCode: "4401-4602" },
  { chapter: "47-49", description: "Pulp, Paper & Printing", avgDuty: "0-5%", hsCode: "4701-4911" },
  { chapter: "50-63", description: "Textiles & Textile Articles", avgDuty: "5-15%", hsCode: "5001-6310" },
  { chapter: "64-67", description: "Footwear, Headgear & Accessories", avgDuty: "8-18%", hsCode: "6401-6704" },
  { chapter: "68-71", description: "Stone, Glass & Precious Metals", avgDuty: "0-10%", hsCode: "6801-7118" },
  { chapter: "72-83", description: "Base Metals & Articles", avgDuty: "0-8%", hsCode: "7201-8311" },
  { chapter: "84", description: "Machinery & Mechanical Appliances", avgDuty: "0-5%", hsCode: "8401-8487" },
  { chapter: "85", description: "Electrical Machinery & Equipment", avgDuty: "0-5%", hsCode: "8501-8548" },
  { chapter: "86-89", description: "Transport Equipment", avgDuty: "0-10%", hsCode: "8601-8908" },
  { chapter: "90-92", description: "Precision Instruments", avgDuty: "0-5%", hsCode: "9001-9213" },
  { chapter: "93", description: "Arms & Ammunition", avgDuty: "5-15%", hsCode: "9301-9307" },
  { chapter: "94-96", description: "Miscellaneous Manufactured Goods", avgDuty: "3-12%", hsCode: "9401-9619" },
  { chapter: "97", description: "Works of Art", avgDuty: "0-5%", hsCode: "9701-9706" },
];

// FTA Benefits Data
const ftaAgreements = [
  {
    name: "USMCA (NAFTA 2.0)",
    countries: ["United States", "Mexico", "Canada"],
    dutyReduction: "Up to 100%",
    keyBenefit: "Duty-free treatment for qualifying goods with rules of origin compliance",
    coverage: "Virtually all goods",
    requirements: "Certificate of Origin, Regional Value Content ≥ 60%",
  },
  {
    name: "EU-Japan EPA",
    countries: ["European Union", "Japan"],
    dutyReduction: "Up to 97%",
    keyBenefit: "Elimination of duties on cars, agricultural products, and services trade",
    coverage: "97% of tariff lines",
    requirements: "Origin declaration, Product-specific rules",
  },
  {
    name: "RCEP",
    countries: ["ASEAN", "China", "Japan", "Korea", "Australia", "New Zealand"],
    dutyReduction: "Up to 92%",
    keyBenefit: "Regional cumulation allows sourcing from any member country",
    coverage: "92% of tariff lines over 20 years",
    requirements: "Certificate of Origin, 40% regional value content",
  },
  {
    name: "CPTPP",
    countries: ["Australia", "Canada", "Japan", "Mexico", "Vietnam", "New Zealand", "Singapore", "Malaysia", "Brunei", "Chile", "Peru"],
    dutyReduction: "Up to 100%",
    keyBenefit: "High-standard rules, e-commerce, and intellectual property protections",
    coverage: "99% of tariff lines",
    requirements: "Certificate of Origin, Product-specific rules",
  },
  {
    name: "ASEAN Free Trade Area",
    countries: ["ASEAN Member States"],
    dutyReduction: "Up to 100%",
    keyBenefit: "Common Effective Preferential Tariff (CEPT) for intra-ASEAN trade",
    coverage: "99% of tariff lines",
    requirements: "Form D Certificate of Origin, 40% ASEAN value content",
  },
  {
    name: "EU-UK Trade Agreement",
    countries: ["European Union", "United Kingdom"],
    dutyReduction: "Up to 100%",
    keyBenefit: "Zero tariffs and quotas for goods meeting rules of origin",
    coverage: "All qualifying goods",
    requirements: "Origin declaration, Supplier declarations for cumulation",
  },
];

// Duty Type Explanations
const dutyTypes = [
  {
    type: "Ad Valorem Duty",
    icon: Percent,
    description: "Calculated as a percentage of the customs value of imported goods. This is the most common type of duty and provides predictable costs for importers.",
    formula: "Duty = Customs Value × Duty Rate",
    example: "$10,000 × 5% = $500",
    pros: ["Predictable calculation", "Proportional to value", "Easy to understand"],
    cons: ["May not reflect actual costs", "Higher duties on expensive goods"],
  },
  {
    type: "Specific Duty",
    icon: Scale,
    description: "A fixed amount charged per unit of measurement (weight, quantity, volume, etc.). Specific duties are common for agricultural products and raw materials.",
    formula: "Duty = Quantity × Fixed Rate",
    example: "1,000 kg × $2/kg = $2,000",
    pros: ["Easy to calculate", "Stable revenue", "Protects domestic producers"],
    cons: ["Doesn't adjust for quality", "May be regressive", "Can distort trade"],
  },
  {
    type: "Compound Duty",
    icon: Calculator,
    description: "Combines both ad valorem and specific duties. This hybrid approach provides balanced protection through both components.",
    formula: "Duty = (Quantity × Fixed Rate) + (Value × Percentage)",
    example: "(1000 kg × $0.50) + ($10,000 × 3%) = $800",
    pros: ["Balanced protection", "Addresses price fluctuations", "Dual revenue stream"],
    cons: ["Complex calculation", "Higher administrative burden", "May be harder to predict"],
  },
];

// FAQ Data
const faqData = [
  {
    question: "What is the difference between customs value and transaction value?",
    answer: "The transaction value is the price actually paid or payable for imported goods, while customs value is the total value used for duty calculation. Customs value includes the transaction value plus any additional costs such as commissions, packing costs, assists, royalties, and freight to the port of entry.",
    category: "Valuation",
  },
  {
    question: "How do I determine the correct HS code for my product?",
    answer: "Determining the correct Harmonized System (HS) code requires systematic analysis. Start by reviewing the Section and Chapter notes in the HS nomenclature. Use the General Interpretive Rules (GIRs) to classify your product. Many customs authorities offer advance ruling programs for official classification determination.",
    category: "Classification",
  },
  {
    question: "What documents do I need to claim FTA preferential duty rates?",
    answer: "To claim preferential duty rates under a Free Trade Agreement, you typically need a valid Certificate of Origin or origin declaration from the exporter or manufacturer. You must also maintain records proving the goods meet rules of origin requirements, including production records and supplier declarations.",
    category: "FTA",
  },
  {
    question: "Can I get a refund if I overpay customs duties?",
    answer: "Yes, most customs administrations allow importers to file for duty refunds under certain circumstances. Common grounds include clerical errors, retroactive duty reductions, goods damaged before clearance, and rejected goods returned to the supplier. Time limits typically range from 1-3 years from import.",
    category: "Refunds",
  },
  {
    question: "What is the difference between bonded warehouse and free trade zone?",
    answer: "Bonded warehouses are customs-controlled facilities where goods can be stored without paying duties for a limited time. FTZs are designated areas considered outside customs territory where goods can be stored, manipulated, manufactured, or re-exported without ever entering the country's commerce.",
    category: "Storage",
  },
  {
    question: "How do anti-dumping and countervailing duties affect my imports?",
    answer: "Anti-dumping (AD) and countervailing duties (CVD) are additional duties imposed on goods sold at less than fair value or subsidized by foreign governments. These duties can significantly increase landed costs - sometimes exceeding 100% of the customs value.",
    category: "Trade Remedies",
  },
  {
    question: "What are duty drawback programs and how do they work?",
    answer: "Duty drawback programs allow importers to recover duties paid on imported goods that are subsequently exported or destroyed. Common types include manufacturing drawback, rejected merchandise drawback, and substitution drawback. Recovery typically ranges from 99% of duties paid for direct identification.",
    category: "Drawback",
  },
  {
    question: "How does country of origin affect duty rates?",
    answer: "The country of origin determines which duty rates apply to your imports. Goods from FTA partner countries may qualify for preferential duty rates. Countries with Most Favored Nation (MFN) status receive standard duty rates, while others may face higher rates.",
    category: "Origin",
  },
];

// Chart colors - Using brand colors
const CHART_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  rose: "#F43F5E",
  teal: "#14B8A6",
  orange: "#F97316",
  cyan: "#06B6D4",
};

// Tab configuration
const tabsConfig = [
  { value: "calculator", label: "Calculator", icon: Calculator },
  { value: "duty-rates", label: "Duty Rates", icon: Percent },
  { value: "fta-benefits", label: "FTA Benefits", icon: Globe },
  { value: "methodology", label: "Methodology", icon: BookOpen },
  { value: "faq", label: "FAQ", icon: HelpCircle },
];

export function DutyTariffCalculator() {
  const [productValue, setProductValue] = useState<string>("10000");
  const [freightCost, setFreightCost] = useState<string>("500");
  const [insuranceCost, setInsuranceCost] = useState<string>("100");
  const [destinationCountry, setDestinationCountry] = useState<string>("US");
  const [productCategory, setProductCategory] = useState<string>("electronics");
  const [incoterm, setIncoterm] = useState<string>("FOB");
  const [customDutyRate, setCustomDutyRate] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("calculator");

  const selectedCountry = countryDutyRates[destinationCountry];
  const dutyRate = customDutyRate
    ? parseFloat(customDutyRate)
    : selectedCountry?.categories[productCategory] || 0;
  const vatRate = selectedCountry?.vatRate || 0;

  const calculation = useMemo<DutyResult>(() => {
    const value = parseFloat(productValue) || 0;
    const freight = parseFloat(freightCost) || 0;
    const insurance = parseFloat(insuranceCost) || 0;

    // Calculate customs value based on Incoterm
    const incotermRule = incotermsDutyResponsibility[incoterm] || { buyerPaysFreight: true, buyerPaysInsurance: true };
    
    let customsValue = value;
    if (!incotermRule.buyerPaysFreight) {
      customsValue = value;
    } else {
      customsValue = value + freight + insurance;
    }

    // Calculate duty
    const dutyAmount = (customsValue * dutyRate) / 100;
    
    // Calculate VAT
    const vatBase = customsValue + dutyAmount;
    const vatAmount = (vatBase * vatRate) / 100;

    // Other fees
    const processingFee = customsValue * 0.0025;
    const otherFees = processingFee;

    const totalDuties = dutyAmount + vatAmount + otherFees;
    const landedCost = customsValue + totalDuties;

    return {
      customsValue,
      dutyAmount,
      vatAmount,
      otherFees,
      totalDuties,
      landedCost,
    };
  }, [productValue, freightCost, insuranceCost, dutyRate, vatRate, incoterm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Chart data for duty rates by category
  const dutyRateChartData = useMemo(() => {
    return Object.entries(categoryNames).map(([key, name]) => ({
      name: name.split(" ")[0],
      fullName: name,
      rate: selectedCountry?.categories[key] || 0,
      fill: (selectedCountry?.categories[key] || 0) === dutyRate ? CHART_COLORS.ocean : CHART_COLORS.logistics,
    }));
  }, [selectedCountry, dutyRate]);

  // Cost breakdown pie chart data
  const costBreakdownData = useMemo(() => {
    const product = parseFloat(productValue) || 0;
    const freight = parseFloat(freightCost) || 0;
    const insurance = parseFloat(insuranceCost) || 0;
    
    return [
      { name: "Product Value", value: product, color: CHART_COLORS.ocean },
      { name: "Import Duty", value: calculation.dutyAmount, color: CHART_COLORS.logistics },
      { name: "VAT/GST", value: calculation.vatAmount, color: CHART_COLORS.amber },
      { name: "Freight & Insurance", value: freight + insurance, color: CHART_COLORS.purple },
      { name: "Other Fees", value: calculation.otherFees, color: CHART_COLORS.teal },
    ].filter(item => item.value > 0);
  }, [productValue, freightCost, insuranceCost, calculation]);

  // FTA Savings comparison data
  const ftaSavingsData = useMemo(() => {
    const baseDuty = calculation.dutyAmount;
    return [
      { name: "Standard Rate", duty: baseDuty, savings: 0, color: CHART_COLORS.ocean },
      { name: "FTA 50%", duty: baseDuty * 0.5, savings: baseDuty * 0.5, color: CHART_COLORS.logistics },
      { name: "FTA 75%", duty: baseDuty * 0.25, savings: baseDuty * 0.75, color: CHART_COLORS.amber },
      { name: "FTA 100%", duty: 0, savings: baseDuty, color: CHART_COLORS.teal },
    ];
  }, [calculation.dutyAmount]);

  // Radial chart for duty percentage
  const radialChartData = useMemo(() => {
    const dutyPercentage = (calculation.totalDuties / calculation.landedCost) * 100;
    return [
      {
        name: "Duty %",
        value: dutyPercentage,
        fill: CHART_COLORS.ocean,
      },
    ];
  }, [calculation]);

  // Export functionality
  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      inputs: {
        productValue,
        freightCost,
        insuranceCost,
        destinationCountry: selectedCountry?.name,
        productCategory: categoryNames[productCategory],
        incoterm,
        dutyRate,
        vatRate,
      },
      results: calculation,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `duty-calculation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: "Duty & Tariff Calculation",
      text: `Duty calculation: ${formatCurrency(calculation.totalDuties)} total duties for ${formatCurrency(parseFloat(productValue))} shipment to ${selectedCountry?.name}`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-2xl">
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%)] bg-[length:4px_4px]" />
        
        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/5 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-[#2E8B57]/20 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        {/* Floating Icons */}
        <motion.div
          className="absolute top-16 left-[15%] text-white/10"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Ship className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute top-24 right-[20%] text-white/10"
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
        >
          <Plane className="w-14 h-14" />
        </motion.div>
        <motion.div
          className="absolute bottom-16 right-[15%] text-white/10"
          animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <Package className="w-12 h-12" />
        </motion.div>
        
        <div className="relative z-10 p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge 
                variant="secondary" 
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Customs Calculator
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-[#2E8B57]/30 text-white border-[#2E8B57]/50 hover:bg-[#2E8B57]/40"
              >
                <Landmark className="h-3 w-3 mr-1" />
                180+ Countries
              </Badge>
            </div>
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white">
              Duty & Tariff Calculator
            </h2>
            <p className="text-white/80 max-w-2xl mb-8 text-lg">
              Calculate customs duties, VAT/GST, and total landed costs for international shipments. 
              Support for multiple countries, product categories, and Incoterms.
            </p>
          </motion.div>
          
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-white/70 font-medium">Total Duty</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{formatCurrency(calculation.totalDuties)}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#2E8B57]/40 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-white/70 font-medium">CIF Value</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{formatCurrency(calculation.customsValue)}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/40 flex items-center justify-center">
                  <Percent className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-white/70 font-medium">Duty Rate</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{dutyRate}%</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/40 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs text-white/70 font-medium">Duty % of Value</span>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">
                {((calculation.totalDuties / parseFloat(productValue || "1")) * 100).toFixed(1)}%
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Export/Share Buttons */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExport}
          className="border-[#0F4C81]/30 text-[#0F4C81] hover:bg-[#0F4C81]/5"
        >
          <Download className="h-4 w-4 mr-2" />
          Export JSON
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShare}
          className="border-[#2E8B57]/30 text-[#2E8B57] hover:bg-[#2E8B57]/5"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Enhanced Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
          {tabsConfig.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`
                  flex items-center gap-2 py-3 px-4 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card className="border-2 border-[#0F4C81]/10 hover:border-[#0F4C81]/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/70 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    Shipment Details
                  </CardTitle>
                  <CardDescription>
                    Enter the commercial value and shipping costs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="productValue" className="font-medium">Product Value (Invoice)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              The commercial invoice value of your goods
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Input
                      id="productValue"
                      type="number"
                      value={productValue}
                      onChange={(e) => setProductValue(e.target.value)}
                      placeholder="10000"
                      className="border-2 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="freightCost" className="font-medium">Freight Cost</Label>
                      <Input
                        id="freightCost"
                        type="number"
                        value={freightCost}
                        onChange={(e) => setFreightCost(e.target.value)}
                        placeholder="500"
                        className="border-2 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceCost" className="font-medium">Insurance Cost</Label>
                      <Input
                        id="insuranceCost"
                        type="number"
                        value={insuranceCost}
                        onChange={(e) => setInsuranceCost(e.target.value)}
                        placeholder="100"
                        className="border-2 focus:border-[#0F4C81] focus:ring-[#0F4C81]/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#2E8B57]/10 hover:border-[#2E8B57]/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/70 flex items-center justify-center">
                      <Percent className="h-4 w-4 text-white" />
                    </div>
                    Duty & Tax Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Destination Country</Label>
                      <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                        <SelectTrigger className="border-2 focus:border-[#2E8B57] focus:ring-[#2E8B57]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(countryDutyRates).map(([code, data]) => (
                            <SelectItem key={code} value={code}>
                              {data.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-medium">Product Category</Label>
                      <Select value={productCategory} onValueChange={setProductCategory}>
                        <SelectTrigger className="border-2 focus:border-[#2E8B57] focus:ring-[#2E8B57]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryNames).map(([key, name]) => (
                            <SelectItem key={key} value={key}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Incoterm</Label>
                      <Select value={incoterm} onValueChange={setIncoterm}>
                        <SelectTrigger className="border-2 focus:border-[#2E8B57] focus:ring-[#2E8B57]/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(incotermsDutyResponsibility).map((term) => (
                            <SelectItem key={term} value={term}>
                              {term}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="customDutyRate" className="font-medium">Custom Duty Rate (%)</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">
                                Leave empty to use estimated rate, or enter exact HS code duty
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        id="customDutyRate"
                        type="number"
                        step="0.1"
                        value={customDutyRate}
                        onChange={(e) => setCustomDutyRate(e.target.value)}
                        placeholder={`Est: ${dutyRate}%`}
                        className="border-2 focus:border-[#2E8B57] focus:ring-[#2E8B57]/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className="border-2 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 border-[#2E8B57]/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2E8B57] to-[#0F4C81] flex items-center justify-center">
                      <CalculatorIcon className="h-4 w-4 text-white" />
                    </div>
                    Duty Calculation Results
                  </CardTitle>
                  <CardDescription>
                    Estimated import duties and taxes for {selectedCountry?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {/* Customs Value */}
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-muted-foreground">Customs Value (CIF)</span>
                      <span className="font-medium">{formatCurrency(calculation.customsValue)}</span>
                    </div>
                    
                    {/* Import Duty */}
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Import Duty</span>
                        <Badge variant="secondary" className="text-xs bg-[#0F4C81]/10 text-[#0F4C81]">{dutyRate}%</Badge>
                      </div>
                      <span className="font-medium">{formatCurrency(calculation.dutyAmount)}</span>
                    </div>
                    
                    {/* VAT/GST */}
                    {vatRate > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-dashed">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">VAT/GST</span>
                          <Badge variant="secondary" className="text-xs bg-[#2E8B57]/10 text-[#2E8B57]">{vatRate}%</Badge>
                        </div>
                        <span className="font-medium">{formatCurrency(calculation.vatAmount)}</span>
                      </div>
                    )}
                    
                    {/* Processing Fees */}
                    <div className="flex justify-between items-center py-2 border-b border-dashed">
                      <span className="text-muted-foreground">Processing Fees</span>
                      <span className="font-medium">{formatCurrency(calculation.otherFees)}</span>
                    </div>

                    {/* Total Duties */}
                    <div className="flex justify-between items-center py-3 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg px-4 mt-4">
                      <span className="font-semibold">Total Duties & Taxes</span>
                      <span className="font-bold text-[#0F4C81] text-lg">
                        {formatCurrency(calculation.totalDuties)}
                      </span>
                    </div>

                    {/* Landed Cost */}
                    <div className="flex justify-between items-center py-4 bg-gradient-to-r from-[#2E8B57] to-[#0F4C81] rounded-lg px-4 text-white">
                      <span className="font-semibold">Total Landed Cost</span>
                      <span className="font-bold text-xl">
                        {formatCurrency(calculation.landedCost)}
                      </span>
                    </div>

                    {/* Duty Percentage */}
                    <div className="pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Duty as % of Value</span>
                        <span className="font-medium">
                          {((calculation.totalDuties / parseFloat(productValue || "1")) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min((calculation.totalDuties / parseFloat(productValue || "1")) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown Chart */}
              <Card className="border-2 border-[#0F4C81]/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4 text-[#0F4C81]" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: number) => formatCurrency(value)}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Disclaimer */}
          <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-semibold mb-2">Important Disclaimer</p>
                  <p>
                    This calculator provides estimates only. Actual duty rates may vary based on specific 
                    HS codes, trade agreements (FTAs), country of origin, and other factors. Always verify 
                    with a licensed customs broker or official government sources before making import decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Duty Rates */}
        <TabsContent value="duty-rates" className="space-y-6 mt-6">
          {/* Duty Rate by Category Chart */}
          <Card className="border-2 border-[#0F4C81]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                Duty Rates by Product Category
              </CardTitle>
              <CardDescription>
                Estimated duty rates for {selectedCountry?.name} across different product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dutyRateChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis unit="%" className="text-xs" />
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value}%`, "Duty Rate"]}
                      labelFormatter={(label) => dutyRateChartData.find(d => d.name === label)?.fullName}
                    />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                      {dutyRateChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Country Comparison */}
          <Card className="border-2 border-[#2E8B57]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#2E8B57]" />
                Country Duty Rate Comparison
              </CardTitle>
              <CardDescription>
                Compare duty rates for {categoryNames[productCategory]} across countries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(countryDutyRates).slice(0, 8).map(([code, data]) => (
                  <div 
                    key={code}
                    className={`
                      p-4 rounded-xl border-2 transition-all cursor-pointer
                      ${destinationCountry === code 
                        ? 'border-[#0F4C81] bg-[#0F4C81]/10' 
                        : 'border-muted hover:border-[#2E8B57]/50 hover:bg-[#2E8B57]/5'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{data.name}</span>
                      {destinationCountry === code && (
                        <Badge variant="secondary" className="text-xs bg-[#0F4C81] text-white">Selected</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-[#0F4C81]">
                      {data.categories[productCategory]}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      VAT: {data.vatRate}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* HS Code Reference Table */}
          <Card className="border-2 border-[#0F4C81]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2E8B57]" />
                HS Code Reference by Chapter
              </CardTitle>
              <CardDescription>
                Harmonized System chapters and typical duty rate ranges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Chapter</th>
                      <th className="text-left py-3 px-4 font-semibold">HS Code Range</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                      <th className="text-left py-3 px-4 font-semibold">Avg Duty Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hsCodeChapters.map((chapter, index) => (
                      <tr 
                        key={index} 
                        className="border-b hover:bg-[#0F4C81]/5 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-mono border-[#0F4C81]/30">
                            {chapter.chapter}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                          {chapter.hsCode}
                        </td>
                        <td className="py-3 px-4">{chapter.description}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="bg-[#2E8B57]/10 text-[#2E8B57]">{chapter.avgDuty}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: FTA Benefits */}
        <TabsContent value="fta-benefits" className="space-y-6 mt-6">
          {/* FTA Savings Comparison Chart */}
          <Card className="border-2 border-[#0F4C81]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                FTA Savings Comparison
              </CardTitle>
              <CardDescription>
                Potential duty savings with Free Trade Agreement preferential rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={ftaSavingsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="duty" name="Duty Payable" fill={CHART_COLORS.ocean} radius={[4, 4, 0, 0]} />
                    <Line dataKey="savings" name="Savings" type="monotone" stroke={CHART_COLORS.logistics} strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* FTA Agreements List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ftaAgreements.map((fta, index) => (
              <Card key={index} className="border-2 border-[#2E8B57]/10 hover:border-[#2E8B57]/30 hover:shadow-lg transition-all">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{fta.name}</CardTitle>
                    <Badge className="bg-gradient-to-r from-[#2E8B57] to-[#0F4C81] text-white">
                      {fta.dutyReduction}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {fta.countries.join(", ")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{fta.keyBenefit}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-[#2E8B57]" />
                      <span>Coverage: {fta.coverage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-3 w-3 text-[#0F4C81]" />
                      <span>Requirements: {fta.requirements}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FTA Tips */}
          <Card className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5 border-2 border-[#2E8B57]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                <Lightbulb className="h-5 w-5" />
                FTA Optimization Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                    <Zap className="h-4 w-4 text-[#0F4C81]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Rules of Origin</p>
                    <p className="text-xs text-muted-foreground">Ensure your products meet the specific origin criteria to qualify for preferential rates.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#2E8B57]/10 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-[#2E8B57]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Documentation</p>
                    <p className="text-xs text-muted-foreground">Maintain proper certificates of origin and supplier declarations for audit purposes.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Methodology */}
        <TabsContent value="methodology" className="space-y-6 mt-6">
          {/* Understanding Customs Duties */}
          <Card className="border-2 border-[#0F4C81]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#0F4C81]" />
                Understanding Customs Duties
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Customs duties are taxes imposed by governments on goods imported into their territory. These duties serve multiple purposes: generating revenue for the government, protecting domestic industries from foreign competition, and regulating the flow of certain goods across borders. Understanding how customs duties work is essential for any business engaged in international trade.
              </p>
              <p className="text-muted-foreground">
                The calculation of customs duties begins with determining the customs value of the imported goods. This value forms the base upon which ad valorem duties are calculated. The customs value typically includes the transaction value (price paid for the goods) plus certain additions such as commissions, packing costs, assists, royalties, and freight and insurance costs to the port of entry.
              </p>
            </CardContent>
          </Card>

          {/* Types of Duties */}
          <Card className="border-2 border-[#2E8B57]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[#2E8B57]" />
                Types of Customs Duties
              </CardTitle>
              <CardDescription>
                Understanding different duty calculation methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {dutyTypes.map((duty, index) => {
                  const Icon = duty.icon;
                  return (
                    <Card key={index} className="border-2 border-muted hover:border-[#0F4C81]/30 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <CardTitle className="text-base">{duty.type}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-xs text-muted-foreground">{duty.description}</p>
                        <div className="p-2 bg-muted rounded-lg">
                          <p className="text-xs font-mono">{duty.formula}</p>
                          <p className="text-xs font-mono text-[#2E8B57]">{duty.example}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold">Pros:</p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {duty.pros.map((pro, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-[#2E8B57]" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold">Cons:</p>
                          <ul className="text-xs text-muted-foreground space-y-0.5">
                            {duty.cons.map((con, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <XCircle className="h-3 w-3 text-destructive" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* CIF Value Calculation */}
          <Card className="border-2 border-[#0F4C81]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[#0F4C81]" />
                CIF Value Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                The CIF (Cost, Insurance, and Freight) value represents the total cost of importing goods to the port of destination. This value is critical because it forms the basis for calculating most customs duties and taxes.
              </p>
              <div className="p-4 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-lg mt-4">
                <p className="text-sm font-semibold mb-2">CIF Formula:</p>
                <p className="font-mono text-sm">
                  CIF Value = Product Cost + Insurance + Freight
                </p>
                <p className="font-mono text-sm text-[#2E8B57] mt-2">
                  Example: $10,000 + $100 + $500 = $10,600
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How to Find Correct Duty Rate */}
          <Card className="border-2 border-[#2E8B57]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-[#2E8B57]" />
                How to Find the Correct Duty Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Finding the correct duty rate for your product requires determining its Harmonized System (HS) code, a standardized numerical classification system used by customs authorities worldwide. The HS code is a 6-digit number at the international level, with countries often adding additional digits for further classification.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card className="border-2 border-[#0F4C81]/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about customs duties and import procedures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border-b border-muted">
                    <AccordionTrigger className="text-left hover:bg-[#0F4C81]/5 px-4 rounded-lg transition-colors">
                      <span className="flex items-center gap-3">
                        <Badge 
                          variant="outline" 
                          className="shrink-0 border-[#0F4C81]/30 text-[#0F4C81]"
                        >
                          Q{index + 1}
                        </Badge>
                        <span className="font-medium">{faq.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm dark:prose-invert max-w-none pl-10 pr-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-[#2E8B57]/10 text-[#2E8B57]"
                          >
                            {faq.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Can&apos;t find your answer? Contact our support team.
                </p>
                <Button variant="outline" className="border-[#0F4C81]/30 text-[#0F4C81]">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Quick Reference Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81]/5 to-[#0F4C81]/10 border-2 border-[#0F4C81]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0F4C81] flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Duty Calculation</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Duties are calculated based on the customs value, which includes the product cost, freight, and insurance to the port of entry.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-[#2E8B57]/5 to-[#2E8B57]/10 border-2 border-[#2E8B57]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2E8B57] flex items-center justify-center">
                    <Coins className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">VAT/GST</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Value Added Tax is typically calculated on the customs value plus any import duties, creating a compound tax effect.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-2 border-amber-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                    <ArrowDownToLine className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">Landed Cost</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  The total cost of a product once it has arrived at the buyer&apos;s door, including all transport fees and duties.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
