"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  DollarSign,
  Percent,
  Ship,
  Shield,
  MapPin,
  Hash,
  RefreshCw,
  Download,
  Share2,
  Info,
  TrendingUp,
  PieChart as PieChartIcon,
  BookOpen,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Globe,
  Building2,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { currencies, formatCurrency } from "@/lib/constants/currencies";
import { incoterms } from "@/lib/constants/units";
import { calculateLandedCost, getEstimatedDutyRate, getVatRateByCountry } from "@/lib/calculations/landedCost";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ComposedChart,
  Line,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants/chartColors";

const countries = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "AE", name: "UAE" },
  { code: "SG", name: "Singapore" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "NL", name: "Netherlands" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
];

// HS Code Reference Data
const hsCodeReference = [
  { chapter: "01-05", description: "Live Animals & Animal Products", dutyRange: "0-15%", avgDuty: "5%" },
  { chapter: "06-14", description: "Vegetable Products", dutyRange: "0-20%", avgDuty: "8%" },
  { chapter: "15", description: "Animal/Vegetable Fats & Oils", dutyRange: "0-15%", avgDuty: "6%" },
  { chapter: "16-24", description: "Foodstuffs, Beverages & Tobacco", dutyRange: "5-30%", avgDuty: "12%" },
  { chapter: "25-27", description: "Mineral Products", dutyRange: "0-10%", avgDuty: "4%" },
  { chapter: "28-29", description: "Chemicals", dutyRange: "0-8%", avgDuty: "4%" },
  { chapter: "30", description: "Pharmaceuticals", dutyRange: "0-5%", avgDuty: "2%" },
  { chapter: "31-33", description: "Fertilizers, Dyes, Cosmetics", dutyRange: "3-12%", avgDuty: "6%" },
  { chapter: "39-40", description: "Plastics & Rubber", dutyRange: "3-10%", avgDuty: "6%" },
  { chapter: "41-43", description: "Raw Hides, Leather, Furs", dutyRange: "3-12%", avgDuty: "7%" },
  { chapter: "44-46", description: "Wood & Wood Products", dutyRange: "0-10%", avgDuty: "5%" },
  { chapter: "47-49", description: "Pulp, Paper & Printed Matter", dutyRange: "0-8%", avgDuty: "4%" },
  { chapter: "50-63", description: "Textiles & Clothing", dutyRange: "5-25%", avgDuty: "12%" },
  { chapter: "64-67", description: "Footwear, Headgear, etc.", dutyRange: "8-18%", avgDuty: "12%" },
  { chapter: "68-71", description: "Stone, Glass, Precious Metals", dutyRange: "3-12%", avgDuty: "6%" },
  { chapter: "72-73", description: "Iron, Steel & Articles", dutyRange: "2-10%", avgDuty: "5%" },
  { chapter: "84", description: "Machinery & Equipment", dutyRange: "0-8%", avgDuty: "3%" },
  { chapter: "85", description: "Electrical Equipment", dutyRange: "0-8%", avgDuty: "3%" },
  { chapter: "86-89", description: "Vehicles & Transport", dutyRange: "3-15%", avgDuty: "8%" },
  { chapter: "90-92", description: "Instruments, Clocks, Musical", dutyRange: "0-8%", avgDuty: "4%" },
  { chapter: "94-96", description: "Furniture, Toys, Misc", dutyRange: "3-12%", avgDuty: "6%" },
];

// VAT/GST Rates by Country
const vatGstRates = [
  { country: "United States", code: "US", rate: "0%", note: "No federal VAT; state sales taxes apply" },
  { country: "United Kingdom", code: "GB", rate: "20%", note: "Standard rate; 5% reduced, 0% zero-rated" },
  { country: "Germany", code: "DE", rate: "19%", note: "Standard rate; 7% reduced for essentials" },
  { country: "France", code: "FR", rate: "20%", note: "Standard rate; 5.5% reduced, 2.1% super-reduced" },
  { country: "Italy", code: "IT", rate: "22%", note: "Standard rate; 10%/5% reduced rates" },
  { country: "Spain", code: "ES", rate: "21%", note: "Standard rate; 10%/4% reduced rates" },
  { country: "Netherlands", code: "NL", rate: "21%", note: "Standard rate; 9% reduced rate" },
  { country: "Belgium", code: "BE", rate: "21%", note: "Standard rate; 12%/6% reduced" },
  { country: "Poland", code: "PL", rate: "23%", note: "Standard rate; 8%/5% reduced" },
  { country: "China", code: "CN", rate: "13%", note: "Standard VAT; 9% for goods, 6% for services" },
  { country: "Japan", code: "JP", rate: "10%", note: "Standard rate; 8% reduced for food" },
  { country: "South Korea", code: "KR", rate: "10%", note: "Standard VAT rate" },
  { country: "India", code: "IN", rate: "18%", note: "GST: 5%, 12%, 18%, 28% slabs" },
  { country: "Singapore", code: "SG", rate: "8%", note: "GST increasing to 9% by 2024" },
  { country: "Australia", code: "AU", rate: "10%", note: "GST on most goods/services" },
  { country: "New Zealand", code: "NZ", rate: "15%", note: "GST on all goods/services" },
  { country: "Canada", code: "CA", rate: "5%", note: "Federal GST; provinces add PST/HST" },
  { country: "Brazil", code: "BR", rate: "18%", note: "ICMS varies by state (17-20%)" },
  { country: "Mexico", code: "MX", rate: "16%", note: "IVA standard rate" },
  { country: "UAE", code: "AE", rate: "5%", note: "VAT introduced in 2018" },
];

const COLORS = [
  CHART_COLORS.ocean,
  CHART_COLORS.logistics,
  CHART_COLORS.amber,
  CHART_COLORS.purple,
  CHART_COLORS.red,
  CHART_COLORS.cyan,
];

// FAQ Data
const faqData = [
  {
    question: "What is landed cost and why is it important?",
    answer: "Landed cost is the total price of a product once it has arrived at a buyer's door, encompassing the original purchase price plus all associated costs for shipping, insurance, customs duties, taxes, and handling fees. Understanding your landed cost is crucial for determining the true profitability of imported goods, setting appropriate retail prices, and making informed sourcing decisions. Many businesses underestimate their true costs by only considering the purchase price and freight, leading to margin erosion and pricing errors. A comprehensive landed cost analysis helps you identify hidden costs, compare suppliers from different countries accurately, and optimize your supply chain for maximum profitability. It also ensures compliance with customs regulations and helps prevent unexpected charges at destination.",
  },
  {
    question: "How is CIF value calculated and how does it differ from FOB?",
    answer: "CIF (Cost, Insurance, and Freight) value represents the total value of goods including the purchase price, insurance costs, and freight charges to the destination port. It's calculated as: CIF = Product Value + Freight Cost + Insurance Cost. This differs from FOB (Free on Board), where the seller's responsibility ends when goods are loaded on the vessel at origin. Under CIF, the seller pays for freight and insurance to the destination port, but risk transfers to the buyer once goods pass the ship's rail at origin. For customs purposes, most countries use CIF value as the basis for calculating import duties and taxes because it represents the complete transaction value. Understanding this distinction is essential for accurate duty calculations and for comparing quotes from different suppliers using different Incoterms.",
  },
  {
    question: "How do I find the correct HS code for my product?",
    answer: "Finding the correct HS (Harmonized System) code requires careful analysis of your product's characteristics, composition, and intended use. Start by consulting the official HS code database or your country's customs tariff schedule. The first 4-6 digits are internationally standardized, while additional digits vary by country. Consider the product's essential character, manufacturing process, and primary function when classifying. For complex products, consider ruling requests or binding tariff information (BTI) from customs authorities to ensure accuracy. Incorrect classification can result in underpayment or overpayment of duties, compliance issues, and potential penalties. Many customs brokers and trade consultants can assist with classification, and some countries offer advance ruling services. Keep documentation of your classification rationale for audit purposes.",
  },
  {
    question: "Why do different countries have different duty rates for the same HS code?",
    answer: "Duty rates vary between countries due to several factors including trade agreements, domestic industry protection policies, and economic development strategies. Free Trade Agreements (FTAs) often reduce or eliminate duties between member countries, creating preferential rates for qualifying goods. Countries may impose higher duties to protect domestic industries from foreign competition, particularly in sensitive sectors like agriculture, textiles, or automotive. Developing countries may use tariff policies to encourage local manufacturing or generate government revenue. Additionally, countries maintain their own tariff schedules with specific rates, concessions, and quotas. Understanding these variations helps businesses optimize sourcing decisions, utilize trade agreements effectively, and plan for duty costs across different markets.",
  },
  {
    question: "How does VAT/GST apply to imported goods?",
    answer: "Value Added Tax (VAT) or Goods and Services Tax (GST) is typically applied to imports at the point of customs clearance, calculated on the CIF value plus any applicable customs duties. This means you pay tax not just on the product value, but on the total cost including shipping and insurance. The rate depends on the destination country's tax system, with rates ranging from 0% in some jurisdictions to over 25% in others. Some goods may qualify for reduced rates or exemptions, particularly essential items like food, books, or medical supplies. For businesses registered for VAT/GST, the import tax can often be recovered as input tax credit, though this varies by jurisdiction. Understanding the timing and calculation of import taxes is essential for cash flow planning and pricing decisions.",
  },
  {
    question: "What are anti-dumping duties and when do they apply?",
    answer: "Anti-dumping duties are additional tariffs imposed on imported goods sold below their normal value (often below production cost) in the exporting country. These duties protect domestic industries from unfair competition caused by artificially low-priced imports. They apply when a country's trade authority determines that foreign producers are dumping goods and causing material injury to domestic producers. The investigation process involves comparing export prices to normal values and assessing injury to domestic industry. Anti-dumping duties can significantly increase landed costs and are specific to particular products and countries of origin. Staying informed about current trade remedies and anti-dumping cases affecting your products is crucial for accurate cost planning and compliance.",
  },
  {
    question: "How do Incoterms affect landed cost calculations?",
    answer: "Incoterms (International Commercial Terms) significantly impact landed cost calculations by determining which party bears various costs and risks at each stage of the shipping process. For example, EXW (Ex Works) places all shipping, insurance, and export/import responsibility on the buyer, while DDP (Delivered Duty Paid) includes all costs up to the destination door. The choice of Incoterm affects which costs appear on your invoice versus additional charges you'll pay separately. Under CIF terms, insurance and freight are included in the invoice value, while under FOB, these are separate charges. Understanding Incoterms helps ensure accurate cost allocation, prevents double-counting or omission of costs, and facilitates accurate comparison of supplier quotes. It also clarifies responsibility for customs clearance and duty payment.",
  },
];

export function LandedCostCalculator() {
  const [productValue, setProductValue] = useState<string>("10000");
  const [currency, setCurrency] = useState<string>("USD");
  const [hsCode, setHsCode] = useState<string>("8471");
  const [originCountry, setOriginCountry] = useState<string>("CN");
  const [destinationCountry, setDestinationCountry] = useState<string>("US");
  const [freightCost, setFreightCost] = useState<string>("1500");
  const [insuranceCost, setInsuranceCost] = useState<string>("100");
  const [dutyRate, setDutyRate] = useState<string>("");
  const [vatRate, setVatRate] = useState<string>("");
  const [otherCharges, setOtherCharges] = useState<string>("0");
  const [activeTab, setActiveTab] = useState<string>("calculator");

  // Auto-calculate duty and VAT rates when countries change
  const autoRates = useMemo(() => {
    const duty = dutyRate ? parseFloat(dutyRate) : getEstimatedDutyRate(hsCode, originCountry, destinationCountry);
    const vat = vatRate ? parseFloat(vatRate) : getVatRateByCountry(destinationCountry);
    return { duty, vat };
  }, [hsCode, originCountry, destinationCountry, dutyRate, vatRate]);

  // Calculate results
  const result = useMemo(() => {
    return calculateLandedCost({
      productValue: parseFloat(productValue) || 0,
      currency,
      hsCode,
      originCountry,
      destinationCountry,
      freightCost: parseFloat(freightCost) || 0,
      insuranceCost: parseFloat(insuranceCost) || 0,
      dutyRate: autoRates.duty,
      vatRate: autoRates.vat,
      otherCharges: parseFloat(otherCharges) || 0,
    });
  }, [productValue, currency, hsCode, originCountry, destinationCountry, freightCost, insuranceCost, otherCharges, autoRates]);

  const selectedCurrency = currencies.find((c) => c.code === currency);

  // Calculate cost increase percentage
  const costIncrease = useMemo(() => {
    if (result.productValue === 0) return 0;
    return ((result.totalLandedCost - result.productValue) / result.productValue) * 100;
  }, [result]);

  // Comparison data for with/without duties
  const comparisonData = useMemo(() => [
    {
      name: "Product Only",
      value: result.productValue,
      color: CHART_COLORS.ocean,
    },
    {
      name: "With Duties & Taxes",
      value: result.totalLandedCost - result.productValue,
      color: CHART_COLORS.amber,
    },
  ], [result]);

  // Handle export
  const handleExport = () => {
    const data = {
      calculation: {
        productValue: result.productValue,
        currency,
        hsCode,
        originCountry,
        destinationCountry,
        freightCost: result.freightCost,
        insuranceCost: result.insuranceCost,
        dutyRate: result.dutyRate,
        vatRate: result.vatRate,
        customsDuty: result.customsDuty,
        vatAmount: result.vatAmount,
        otherCharges: result.otherCharges,
        cifValue: result.cifValue,
        totalLandedCost: result.totalLandedCost,
      },
      costBreakdown: result.costBreakdown,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landed-cost-calculation-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle share
  const handleShare = async () => {
    const shareText = `Landed Cost Calculation:
Product Value: ${formatCurrency(result.productValue, currency)}
CIF Value: ${formatCurrency(result.cifValue, currency)}
Total Landed Cost: ${formatCurrency(result.totalLandedCost, currency)}
Duties & Taxes: ${formatCurrency(result.customsDuty + result.vatAmount, currency)}
Cost Increase: ${costIncrease.toFixed(1)}%`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Landed Cost Calculation",
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all animate-pulse">
              <TrendingUp className="h-3 w-3 mr-1" />
              Import Cost Analysis
            </Badge>
            <h2 className="text-3xl font-bold mb-2">Landed Cost Calculator</h2>
            <p className="text-white/80 max-w-2xl">
              Calculate the true total cost of your imports including product value, shipping, customs duties, VAT/GST, and all associated fees. Make informed sourcing decisions with accurate cost projections.
            </p>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="text-white/60 text-sm mb-1">Total Landed Cost</div>
              <div className="text-2xl font-bold">{formatCurrency(result.totalLandedCost, currency)}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="text-white/60 text-sm mb-1">CIF Value</div>
              <div className="text-2xl font-bold">{formatCurrency(result.cifValue, currency)}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="text-white/60 text-sm mb-1">Duties & Taxes</div>
              <div className="text-2xl font-bold">{formatCurrency(result.customsDuty + result.vatAmount, currency)}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="text-white/60 text-sm mb-1">Cost Increase</div>
              <div className="text-2xl font-bold">{costIncrease.toFixed(1)}%</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2 py-3">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Breakdown</span>
          </TabsTrigger>
          <TabsTrigger value="duties" className="flex items-center gap-2 py-3">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Duties & Taxes</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Input Parameters
                  </CardTitle>
                  <CardDescription>
                    Enter the details of your shipment to calculate total landed cost
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Product Value & Currency */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="productValue" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Product Value
                      </Label>
                      <Input
                        id="productValue"
                        type="number"
                        value={productValue}
                        onChange={(e) => setProductValue(e.target.value)}
                        placeholder="Enter product value"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 20).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* HS Code */}
                  <div className="space-y-2">
                    <Label htmlFor="hsCode" className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      HS Code
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              Harmonized System code for product classification. 
                              First 4-6 digits are internationally standardized.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input
                      id="hsCode"
                      value={hsCode}
                      onChange={(e) => setHsCode(e.target.value)}
                      placeholder="Enter HS code (e.g., 8471.30)"
                    />
                  </div>

                  {/* Origin & Destination */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Origin Country
                      </Label>
                      <Select value={originCountry} onValueChange={setOriginCountry}>
                        <SelectTrigger>
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
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Destination Country
                      </Label>
                      <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                        <SelectTrigger>
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
                  </div>

                  <Separator />

                  {/* Freight & Insurance */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="freightCost" className="flex items-center gap-2">
                        <Ship className="h-4 w-4" />
                        Freight Cost ({selectedCurrency?.symbol})
                      </Label>
                      <Input
                        id="freightCost"
                        type="number"
                        value={freightCost}
                        onChange={(e) => setFreightCost(e.target.value)}
                        placeholder="Freight cost"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insuranceCost" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Insurance ({selectedCurrency?.symbol})
                      </Label>
                      <Input
                        id="insuranceCost"
                        type="number"
                        value={insuranceCost}
                        onChange={(e) => setInsuranceCost(e.target.value)}
                        placeholder="Insurance cost"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Duty & VAT Rates */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dutyRate" className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Customs Duty Rate (%)
                        <Badge variant="secondary" className="text-xs">
                          Est: {autoRates.duty}%
                        </Badge>
                      </Label>
                      <Input
                        id="dutyRate"
                        type="number"
                        step="0.1"
                        value={dutyRate}
                        onChange={(e) => setDutyRate(e.target.value)}
                        placeholder={`${autoRates.duty}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vatRate" className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        VAT/GST Rate (%)
                        <Badge variant="secondary" className="text-xs">
                          Est: {autoRates.vat}%
                        </Badge>
                      </Label>
                      <Input
                        id="vatRate"
                        type="number"
                        step="0.1"
                        value={vatRate}
                        onChange={(e) => setVatRate(e.target.value)}
                        placeholder={`${autoRates.vat}`}
                      />
                    </div>
                  </div>

                  {/* Other Charges */}
                  <div className="space-y-2">
                    <Label htmlFor="otherCharges" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Other Charges ({selectedCurrency?.symbol})
                    </Label>
                    <Input
                      id="otherCharges"
                      type="number"
                      value={otherCharges}
                      onChange={(e) => setOtherCharges(e.target.value)}
                      placeholder="Handling, port charges, etc."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Summary Card */}
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center justify-between">
                    <span>Total Landed Cost</span>
                    <Badge className="gradient-ocean text-white">
                      {result.totalLandedCost > 0 ? "Calculated" : "Enter Data"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    key={result.totalLandedCost}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center mb-6"
                  >
                    <div className="text-4xl font-bold text-[var(--ocean)]">
                      {formatCurrency(result.totalLandedCost, currency)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      CIF Value: {formatCurrency(result.cifValue, currency)}
                    </div>
                  </motion.div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Product Value</span>
                      <span className="font-medium">{formatCurrency(result.productValue, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Freight Cost</span>
                      <span className="font-medium">{formatCurrency(result.freightCost, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Insurance Cost</span>
                      <span className="font-medium">{formatCurrency(result.insuranceCost, currency)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Customs Duty ({result.dutyRate}%)</span>
                      <span className="font-medium text-[var(--logistics)]">+{formatCurrency(result.customsDuty, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">VAT/GST ({result.vatRate}%)</span>
                      <span className="font-medium text-[var(--logistics)]">+{formatCurrency(result.vatAmount, currency)}</span>
                    </div>
                    {result.otherCharges > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Other Charges</span>
                        <span className="font-medium">+{formatCurrency(result.otherCharges, currency)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cost Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="pie">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                      <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pie" className="h-[300px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={result.costBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="label"
                            label={({ label, percentage }) => `${label}: ${percentage.toFixed(1)}%`}
                          >
                            {result.costBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip 
                            formatter={(value: number) => formatCurrency(value, currency)}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="bar" className="h-[300px] mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.costBreakdown} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                          <YAxis dataKey="label" type="category" width={100} />
                          <RechartsTooltip formatter={(value: number) => formatCurrency(value, currency)} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {result.costBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => {
                  setProductValue("10000");
                  setHsCode("8471");
                  setOriginCountry("CN");
                  setDestinationCountry("US");
                  setFreightCost("1500");
                  setInsuranceCost("100");
                  setDutyRate("");
                  setVatRate("");
                  setOtherCharges("0");
                }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Cost Breakdown */}
        <TabsContent value="breakdown" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Detailed Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
                <CardDescription>Visual breakdown of all cost components</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={result.costBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="label"
                    >
                      {result.costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => formatCurrency(value, currency)}
                      contentStyle={{ borderRadius: "8px" }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span className="text-sm">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cost Components Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Components</CardTitle>
                <CardDescription>Compare individual cost elements</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={result.costBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="label" className="text-xs" />
                    <YAxis tickFormatter={(v) => formatCurrency(v, currency)} className="text-xs" />
                    <RechartsTooltip 
                      formatter={(value: number) => formatCurrency(value, currency)}
                      contentStyle={{ borderRadius: "8px" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {result.costBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Product Cost vs Total Landed Cost</CardTitle>
              <CardDescription>See the impact of duties, taxes, and other charges</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={[{ name: "Cost Comparison", ...comparisonData.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {} as Record<string, number>), total: result.totalLandedCost }]}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                  <RechartsTooltip 
                    formatter={(value: number) => formatCurrency(value, currency)}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Bar dataKey="Product Only" stackId="a" fill={CHART_COLORS.ocean} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="With Duties & Taxes" stackId="a" fill={CHART_COLORS.amber} radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="total" stroke={CHART_COLORS.logistics} strokeWidth={3} dot={{ fill: CHART_COLORS.logistics, strokeWidth: 2 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Cost Analysis</CardTitle>
              <CardDescription>Itemized breakdown with percentages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Component</th>
                      <th className="text-right py-3 px-4 font-semibold">Amount</th>
                      <th className="text-right py-3 px-4 font-semibold">Percentage</th>
                      <th className="text-left py-3 px-4 font-semibold">Visual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.costBreakdown.map((item, index) => (
                      <tr key={item.label} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          {item.label}
                        </td>
                        <td className="text-right py-3 px-4 font-medium">
                          {formatCurrency(item.value, currency)}
                        </td>
                        <td className="text-right py-3 px-4 text-muted-foreground">
                          {item.percentage.toFixed(1)}%
                        </td>
                        <td className="py-3 px-4">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500"
                              style={{ 
                                width: `${item.percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Duties & Taxes */}
        <TabsContent value="duties" className="mt-6 space-y-6">
          {/* HS Code Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-[var(--ocean)]" />
                HS Code Duty Rate Reference
              </CardTitle>
              <CardDescription>
                Estimated duty rates by HS code chapter. Actual rates may vary based on trade agreements and specific product classifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Chapter</th>
                      <th className="text-left py-3 px-4 font-semibold">Description</th>
                      <th className="text-left py-3 px-4 font-semibold">Duty Range</th>
                      <th className="text-left py-3 px-4 font-semibold">Avg Duty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hsCodeReference.map((item) => (
                      <tr key={item.chapter} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4">
                          <Badge variant="outline">{item.chapter}</Badge>
                        </td>
                        <td className="py-3 px-4">{item.description}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.dutyRange}</td>
                        <td className="py-3 px-4">
                          <Badge style={{ backgroundColor: CHART_COLORS.ocean, color: "white" }}>
                            {item.avgDuty}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* VAT/GST Rates by Country */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--logistics)]" />
                VAT/GST Rates by Country
              </CardTitle>
              <CardDescription>
                Standard VAT or GST rates for major trading nations. Some countries have reduced rates for specific goods.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Country</th>
                      <th className="text-left py-3 px-4 font-semibold">Code</th>
                      <th className="text-left py-3 px-4 font-semibold">Rate</th>
                      <th className="text-left py-3 px-4 font-semibold">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vatGstRates.map((item) => (
                      <tr key={item.code} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-medium">{item.country}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{item.code}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge style={{ backgroundColor: CHART_COLORS.logistics, color: "white" }}>
                            {item.rate}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Duty Calculation Formula */}
          <Card className="border-2 border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--ocean)]" />
                Duty & Tax Calculation Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-semibold mb-2">CIF Value</h4>
                  <code className="text-sm bg-background p-2 rounded block">
                    CIF = Product + Freight + Insurance
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    The Customs value used as the base for duty calculation.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-semibold mb-2">Customs Duty</h4>
                  <code className="text-sm bg-background p-2 rounded block">
                    Duty = CIF × Duty Rate
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    Applied as a percentage of the CIF value.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-semibold mb-2">VAT/GST</h4>
                  <code className="text-sm bg-background p-2 rounded block">
                    VAT = (CIF + Duty) × VAT Rate
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    Tax applied to the CIF value plus customs duty.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-semibold mb-2">Total Landed Cost</h4>
                  <code className="text-sm bg-background p-2 rounded block">
                    Total = CIF + Duty + VAT + Other
                  </code>
                  <p className="text-sm text-muted-foreground mt-2">
                    The complete cost to bring goods to destination.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="mt-6 space-y-6">
          {/* What is Landed Cost */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                What is Landed Cost?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Landed cost represents the total expense incurred to bring a product from its origin to its final destination, ready for sale or use. This comprehensive metric goes far beyond the simple purchase price to encompass every cost element encountered along the supply chain journey. For importers and international traders, understanding landed cost is essential for accurate pricing, profitability analysis, and strategic sourcing decisions.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The concept originated from the recognition that the price paid to a supplier is only the beginning of the true cost story. Shipping charges, insurance premiums, customs duties, taxes, handling fees, and various ancillary costs all contribute to the final expense. Without accounting for these elements, businesses risk underpricing their products, eroding profit margins, and making poor sourcing decisions based on incomplete financial data.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Modern supply chains involve multiple stakeholders, complex logistics networks, and varying regulatory requirements across different markets. A thorough landed cost analysis provides visibility into each cost component, enabling businesses to identify opportunities for optimization, negotiate better terms with suppliers, and ensure compliance with customs and tax regulations. It serves as a foundation for informed decision-making in international trade.
              </p>
            </CardContent>
          </Card>

          {/* The Formula */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[var(--logistics)]" />
                The Landed Cost Formula
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 border">
                <code className="text-lg font-mono block text-center">
                  Landed Cost = Product Cost + Shipping + Customs + Duties + Taxes + Fees
                </code>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-semibold">Product Cost</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The purchase price paid to the supplier, including any packaging or preparation costs at origin.
                  </p>
                </div>
                <div className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-semibold">Shipping</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All transportation costs including freight, loading/unloading, terminal handling, and delivery charges.
                  </p>
                </div>
                <div className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-semibold">Insurance</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Marine or cargo insurance protecting against loss or damage during transit.
                  </p>
                </div>
                <div className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-semibold">Customs Duty</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Import duties based on HS code classification and country of origin.
                  </p>
                </div>
                <div className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-semibold">VAT/GST</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Value-added tax or goods and services tax applied at import.
                  </p>
                </div>
                <div className="p-4 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-semibold">Other Fees</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Port charges, documentation fees, customs broker fees, and handling charges.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HS Code Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-[var(--ocean)]" />
                Understanding HS Codes & Duty Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                The Harmonized System (HS) code is an internationally standardized numerical system for classifying traded products, maintained by the World Customs Organization. This six to ten-digit code determines the customs duty rate applied to imported goods and is fundamental to landed cost calculations. The first six digits are standardized worldwide, while additional digits may vary by country for more specific classification.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Duty rates vary significantly based on HS code classification, ranging from zero percent for certain essential goods to over 30% for some protected industries. The rate applied depends on multiple factors including the product&apos;s nature, composition, intended use, and the trade relationship between the exporting and importing countries. Free Trade Agreements (FTAs) often provide preferential or zero-duty rates for goods meeting origin requirements.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Correct HS code classification is critical for compliance and cost accuracy. Misclassification can result in underpayment penalties, shipment delays, or overpayment of duties. Businesses should maintain documentation supporting their classification decisions and consider seeking binding rulings from customs authorities for complex products. Regular review of classifications is advisable as tariff schedules and product characteristics may change over time.
              </p>
            </CardContent>
          </Card>

          {/* VAT/GST Methodology */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-[var(--logistics)]" />
                VAT/GST Calculation Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Value Added Tax (VAT) and Goods and Services Tax (GST) are consumption taxes applied to imported goods at the point of entry into a country. Unlike domestic purchases where VAT/GST is included in the transaction price, imports typically require payment of these taxes during customs clearance. The calculation method varies by jurisdiction but commonly involves applying the tax rate to the sum of the CIF value and any applicable customs duties.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The tax base for VAT/GST on imports typically includes the customs value (CIF), customs duties, and sometimes excise taxes. This cascading effect means you pay tax not just on the product value but on all the costs accumulated during shipping. For example, a product with CIF value of $10,000 and 5% duty arriving in a 20% VAT country would incur: Duty = $500, VAT = ($10,000 + $500) × 20% = $2,100.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Businesses registered for VAT/GST may be able to reclaim import taxes as input credits, depending on local regulations. Some countries offer deferred payment schemes or simplified procedures for regular importers. Understanding the specific rules in your destination country is essential for cash flow planning and compliance. Reduced rates or exemptions may apply to certain categories of goods such as food, books, or medical supplies.
              </p>
            </CardContent>
          </Card>

          {/* Incoterms Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-[var(--ocean)]" />
                Incoterms Impact on Landed Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Incoterms (International Commercial Terms) define the responsibilities and cost allocations between buyers and sellers in international transactions. The choice of Incoterm significantly impacts which costs are included in the supplier&apos;s invoice versus costs the buyer must arrange separately. Understanding these distinctions is crucial for accurate landed cost calculations and fair comparison of supplier quotes.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-lg border border-[var(--ocean)]/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="gradient-ocean text-white">EXW</Badge>
                    Ex Works
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Buyer bears all costs from seller&apos;s premises. Maximum control but maximum responsibility. Highest landed cost visibility needed.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-blue-500 text-white">FOB</Badge>
                    Free On Board
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Seller handles origin costs and loading. Buyer arranges and pays for ocean freight and insurance. Common for sea freight.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--logistics)]/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="gradient-logistics text-white">CIF</Badge>
                    Cost, Insurance, Freight
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Seller pays freight and insurance to destination port. Risk transfers at origin. Convenient but verify insurance adequacy.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-amber-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Badge className="bg-amber-500 text-white">DDP</Badge>
                    Delivered Duty Paid
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Seller bears all costs including duties. Buyer receives goods cleared. Lowest landed cost visibility but most convenient.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 mt-6">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Important Note
                </h4>
                <p className="text-sm text-muted-foreground">
                  Always clarify Incoterms in supplier negotiations and ensure landed cost calculations align with the cost allocation defined by the chosen term. Converting quotes between Incoterms enables true apples-to-apples comparison.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about landed cost calculations and import pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-medium">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed pt-2">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                Quick Tips for Accurate Calculations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--logistics)]/5">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Verify HS Codes</p>
                    <p className="text-sm text-muted-foreground">Double-check classifications with official tariff databases or seek binding rulings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--logistics)]/5">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Check Trade Agreements</p>
                    <p className="text-sm text-muted-foreground">FTAs can reduce or eliminate duties with proper documentation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--logistics)]/5">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Include All Costs</p>
                    <p className="text-sm text-muted-foreground">Don&apos;t forget broker fees, port charges, and handling costs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--logistics)]/5">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Update Regularly</p>
                    <p className="text-sm text-muted-foreground">Rates and regulations change; review calculations periodically.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
