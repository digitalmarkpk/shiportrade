"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Globe,
  Flag,
  Percent,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  BarChart3,
  FileText,
  Shield,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  GitCompare,
  Map,
  Layers,
  Calculator,
  Zap,
  Target,
  PieChart,
  LineChart,
  HelpCircle,
  ArrowLeftRight,
  Ship,
  Package,
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Country data with regions
const countries = [
  { code: "US", name: "United States", region: "North America", vatRate: 0 },
  { code: "CN", name: "China", region: "Asia", vatRate: 13 },
  { code: "JP", name: "Japan", region: "Asia", vatRate: 10 },
  { code: "KR", name: "South Korea", region: "Asia", vatRate: 10 },
  { code: "VN", name: "Vietnam", region: "Asia", vatRate: 10 },
  { code: "TH", name: "Thailand", region: "Asia", vatRate: 7 },
  { code: "SG", name: "Singapore", region: "Asia", vatRate: 8 },
  { code: "MY", name: "Malaysia", region: "Asia", vatRate: 6 },
  { code: "ID", name: "Indonesia", region: "Asia", vatRate: 11 },
  { code: "IN", name: "India", region: "Asia", vatRate: 18 },
  { code: "DE", name: "Germany", region: "Europe", vatRate: 19 },
  { code: "GB", name: "United Kingdom", region: "Europe", vatRate: 20 },
  { code: "FR", name: "France", region: "Europe", vatRate: 20 },
  { code: "NL", name: "Netherlands", region: "Europe", vatRate: 21 },
  { code: "IT", name: "Italy", region: "Europe", vatRate: 22 },
  { code: "ES", name: "Spain", region: "Europe", vatRate: 21 },
  { code: "AU", name: "Australia", region: "Oceania", vatRate: 10 },
  { code: "NZ", name: "New Zealand", region: "Oceania", vatRate: 15 },
  { code: "CA", name: "Canada", region: "North America", vatRate: 5 },
  { code: "MX", name: "Mexico", region: "North America", vatRate: 16 },
  { code: "BR", name: "Brazil", region: "South America", vatRate: 18 },
  { code: "AR", name: "Argentina", region: "South America", vatRate: 21 },
  { code: "ZA", name: "South Africa", region: "Africa", vatRate: 15 },
  { code: "AE", name: "UAE", region: "Middle East", vatRate: 5 },
  { code: "SA", name: "Saudi Arabia", region: "Middle East", vatRate: 15 },
];

// FTA data
const freeTradeAgreements = [
  {
    name: "USMCA",
    code: "USMCA",
    parties: ["US", "CA", "MX"],
    avgDutyReduction: 100,
    localContentReq: 75,
    certificate: "USMCA Certificate of Origin",
    effectiveDate: "2020-07-01",
  },
  {
    name: "CPTPP",
    code: "CPTPP",
    parties: ["JP", "VN", "AU", "NZ", "CA", "MX", "MY", "SG"],
    avgDutyReduction: 98,
    localContentReq: 40,
    certificate: "CPTPP Certificate of Origin",
    effectiveDate: "2018-12-30",
  },
  {
    name: "RCEP",
    code: "RCEP",
    parties: ["CN", "JP", "KR", "AU", "NZ", "VN", "TH", "SG", "MY", "ID"],
    avgDutyReduction: 92,
    localContentReq: 40,
    certificate: "RCEP Certificate of Origin",
    effectiveDate: "2022-01-01",
  },
  {
    name: "EU-Japan EPA",
    code: "EJ-EPA",
    parties: ["DE", "FR", "NL", "IT", "ES", "JP"],
    avgDutyReduction: 99,
    localContentReq: 50,
    certificate: "EUR.1 Movement Certificate",
    effectiveDate: "2019-02-01",
  },
  {
    name: "US-Korea FTA (KORUS)",
    code: "KORUS",
    parties: ["US", "KR"],
    avgDutyReduction: 95,
    localContentReq: 35,
    certificate: "Certificate of Origin",
    effectiveDate: "2012-03-15",
  },
  {
    name: "ASEAN Trade in Goods",
    code: "ATIGA",
    parties: ["VN", "TH", "SG", "MY", "ID"],
    avgDutyReduction: 99,
    localContentReq: 40,
    certificate: "ASEAN Certificate of Origin (Form D)",
    effectiveDate: "2010-01-01",
  },
  {
    name: "China-ASEAN FTA",
    code: "CAFTA",
    parties: ["CN", "VN", "TH", "SG", "MY", "ID"],
    avgDutyReduction: 90,
    localContentReq: 40,
    certificate: "Form E Certificate of Origin",
    effectiveDate: "2010-01-01",
  },
  {
    name: "EU-UK Trade Agreement",
    code: "EU-UK-TCA",
    parties: ["GB", "DE", "FR", "NL", "IT", "ES"],
    avgDutyReduction: 100,
    localContentReq: 50,
    certificate: "Origin Declaration",
    effectiveDate: "2021-01-01",
  },
  {
    name: "China-Australia FTA",
    code: "CHAFTA",
    parties: ["CN", "AU"],
    avgDutyReduction: 94,
    localContentReq: 40,
    certificate: "Certificate of Origin",
    effectiveDate: "2015-12-20",
  },
  {
    name: "Japan-Australia EPA",
    code: "JAEPA",
    parties: ["JP", "AU"],
    avgDutyReduction: 97,
    localContentReq: 50,
    certificate: "Certificate of Origin",
    effectiveDate: "2015-01-15",
  },
];

// MFN duty rates by HS code chapter (simplified)
const mfnRatesByChapter: Record<string, { chapter: string; description: string; rate: number }> = {
  "01": { chapter: "01", description: "Live Animals", rate: 0 },
  "02": { chapter: "02", description: "Meat and Edible Meat Offal", rate: 5 },
  "03": { chapter: "03", description: "Fish and Crustaceans", rate: 3 },
  "04": { chapter: "04", description: "Dairy Products", rate: 12 },
  "07": { chapter: "07", description: "Vegetables", rate: 8 },
  "08": { chapter: "08", description: "Fruit and Nuts", rate: 6 },
  "09": { chapter: "09", description: "Coffee, Tea, Spices", rate: 4 },
  "10": { chapter: "10", description: "Cereals", rate: 2 },
  "27": { chapter: "27", description: "Mineral Fuels, Oils", rate: 0 },
  "28": { chapter: "28", description: "Inorganic Chemicals", rate: 3 },
  "29": { chapter: "29", description: "Organic Chemicals", rate: 4 },
  "30": { chapter: "30", description: "Pharmaceuticals", rate: 0 },
  "32": { chapter: "32", description: "Dyes, Paints", rate: 5 },
  "33": { chapter: "33", description: "Essential Oils, Cosmetics", rate: 6 },
  "34": { chapter: "34", description: "Soaps, Detergents", rate: 5 },
  "38": { chapter: "38", description: "Miscellaneous Chemical", rate: 4 },
  "39": { chapter: "39", description: "Plastics and Articles", rate: 6.5 },
  "40": { chapter: "40", description: "Rubber and Articles", rate: 5 },
  "42": { chapter: "42", description: "Leather Articles", rate: 8 },
  "44": { chapter: "44", description: "Wood and Articles", rate: 3 },
  "48": { chapter: "48", description: "Paper and Paperboard", rate: 2 },
  "49": { chapter: "49", description: "Printed Books", rate: 0 },
  "52": { chapter: "52", description: "Cotton", rate: 8 },
  "54": { chapter: "54", description: "Man-Made Filaments", rate: 10 },
  "61": { chapter: "61", description: "Knitted Apparel", rate: 12 },
  "62": { chapter: "62", description: "Woven Apparel", rate: 12 },
  "63": { chapter: "63", description: "Other Textile Articles", rate: 10 },
  "64": { chapter: "64", description: "Footwear", rate: 15 },
  "68": { chapter: "68", description: "Stone, Cement", rate: 4 },
  "69": { chapter: "69", description: "Ceramic Products", rate: 6 },
  "70": { chapter: "70", description: "Glass and Glassware", rate: 5 },
  "72": { chapter: "72", description: "Iron and Steel", rate: 4 },
  "73": { chapter: "73", description: "Articles of Iron/Steel", rate: 5 },
  "74": { chapter: "74", description: "Copper and Articles", rate: 3 },
  "76": { chapter: "76", description: "Aluminum and Articles", rate: 3 },
  "82": { chapter: "82", description: "Tools, Cutlery", rate: 4 },
  "83": { chapter: "83", description: "Miscellaneous Metal", rate: 4 },
  "84": { chapter: "84", description: "Nuclear Reactors, Machinery", rate: 2.5 },
  "85": { chapter: "85", description: "Electrical Machinery", rate: 0 },
  "87": { chapter: "87", description: "Vehicles", rate: 4 },
  "90": { chapter: "90", description: "Optical, Medical Instruments", rate: 0 },
  "91": { chapter: "91", description: "Clocks and Watches", rate: 6 },
  "92": { chapter: "92", description: "Musical Instruments", rate: 4 },
  "94": { chapter: "94", description: "Furniture", rate: 3 },
  "95": { chapter: "95", description: "Toys and Games", rate: 0 },
  "96": { chapter: "96", description: "Miscellaneous Manufactured", rate: 5 },
};

// Anti-dumping duties by product/country
const antiDumpingDuties = [
  { hsCode: "7306", product: "Steel Pipes & Tubes", origin: "CN", rate: 63.9, destination: "US" },
  { hsCode: "7306", product: "Steel Pipes & Tubes", origin: "CN", rate: 48.7, destination: "EU" },
  { hsCode: "7208", product: "Hot-Rolled Steel", origin: "CN", rate: 76.3, destination: "US" },
  { hsCode: "7225", product: "Cold-Rolled Steel", origin: "CN", rate: 265.8, destination: "US" },
  { hsCode: "7208", product: "Hot-Rolled Steel", origin: "JP", rate: 0, destination: "US" },
  { hsCode: "3926", product: "Plastic Bags", origin: "CN", rate: 28.3, destination: "US" },
  { hsCode: "7326", product: "Steel Wire Garment Hangers", origin: "VN", rate: 187.3, destination: "US" },
  { hsCode: "5607", product: "Twine and Cordage", origin: "IN", rate: 44.5, destination: "US" },
  { hsCode: "6110", product: "Sweaters", origin: "CN", rate: 17.5, destination: "EU" },
  { hsCode: "6403", product: "Footwear", origin: "CN", rate: 22.7, destination: "EU" },
  { hsCode: "8708", product: "Auto Parts", origin: "CN", rate: 34.8, destination: "US" },
  { hsCode: "8504", product: "Power Transformers", origin: "KR", rate: 23.1, destination: "US" },
];

// Tariff escalation data (by processing level)
const tariffEscalation = [
  { level: "Raw Material", example: "Cotton (HS 5201)", rate: 0, description: "Unprocessed natural materials" },
  { level: "Semi-Processed", example: "Cotton Yarn (HS 5205)", rate: 4, description: "First stage of processing" },
  { level: "Intermediate", example: "Cotton Fabric (HS 5208)", rate: 8, description: "Manufactured components" },
  { level: "Finished", example: "Cotton Shirts (HS 6205)", rate: 12, description: "Final consumer goods" },
  { level: "Consumer Ready", example: "Branded Apparel", rate: 15, description: "Retail-ready products" },
];

// Historical tariff trend data
const tariffTrendData = [
  { year: "2019", mfnAvg: 5.2, ftaAvg: 0.8, tradeVolume: 1200 },
  { year: "2020", mfnAvg: 5.1, ftaAvg: 0.6, tradeVolume: 980 },
  { year: "2021", mfnAvg: 4.9, ftaAvg: 0.5, tradeVolume: 1350 },
  { year: "2022", mfnAvg: 4.7, ftaAvg: 0.4, tradeVolume: 1480 },
  { year: "2023", mfnAvg: 4.5, ftaAvg: 0.3, tradeVolume: 1620 },
  { year: "2024", mfnAvg: 4.3, ftaAvg: 0.2, tradeVolume: 1750 },
];

// FAQ data
const faqData = [
  {
    question: "What is the difference between MFN and FTA rates?",
    answer: "MFN (Most Favored Nation) rate is the standard tariff applied to all WTO members without preferential treatment. FTA (Free Trade Agreement) rates are preferential rates negotiated between member countries, often resulting in zero or significantly reduced tariffs for qualifying goods.",
    category: "Basics",
  },
  {
    question: "How do I know if my product qualifies for FTA benefits?",
    answer: "Products qualify for FTA benefits by meeting Rules of Origin requirements, which typically include: minimum local content percentage, specific manufacturing processes, or tariff shift rules. You'll need documentation like a Certificate of Origin to claim benefits.",
    category: "FTA",
  },
  {
    question: "What are anti-dumping duties and when do they apply?",
    answer: "Anti-dumping duties are additional tariffs imposed on imports sold below fair market value to protect domestic industries. They apply to specific products from certain countries and can be very high (50%+). They are determined through investigation by trade authorities.",
    category: "Trade Remedies",
  },
  {
    question: "How is the HS code determined for my product?",
    answer: "HS codes are determined by product characteristics, materials, and function. The first 2 digits indicate the chapter, first 4 the heading, and first 6 the international subheading. Proper classification is crucial - incorrect codes can lead to duty underpayments, penalties, or delays.",
    category: "Classification",
  },
  {
    question: "Can I reduce my tariff costs by changing the origin country?",
    answer: "Yes, sourcing from FTA partner countries can significantly reduce tariffs. However, consider total landed costs including transportation, quality, and supply chain reliability. Also check for anti-dumping duties that may apply to specific origins.",
    category: "Cost Optimization",
  },
  {
    question: "What documents do I need to claim FTA preferential rates?",
    answer: "Common documents include: Certificate of Origin (specific to each FTA), commercial invoice, bill of lading, packing list, and supplier declarations. Some FTAs allow self-certification while others require certification from authorized bodies.",
    category: "Documentation",
  },
  {
    question: "How often do tariff rates change?",
    answer: "MFN rates change through WTO negotiations and are generally stable. FTA rates follow phased reduction schedules. Anti-dumping duties are reviewed periodically (usually every 5 years). Always verify current rates before making trade decisions.",
    category: "Updates",
  },
  {
    question: "What is tariff escalation and why does it matter?",
    answer: "Tariff escalation is when tariffs increase with the level of processing - raw materials have low rates while finished goods have high rates. This protects domestic processing industries. Understanding this helps in supply chain planning - sometimes importing semi-processed goods is more cost-effective.",
    category: "Strategy",
  },
];

interface TariffResult {
  mfnRate: number;
  ftaRate: number;
  ftaEligible: boolean;
  applicableFTAs: string[];
  antiDumpingRate: number;
  totalDuty: number;
  savings: number;
  savingsPercent: number;
  warnings: string[];
}

interface CountryComparison {
  country: string;
  countryCode: string;
  mfnRate: number;
  ftaRate: number;
  totalDuty: number;
  hasFTA: boolean;
  antiDumping: boolean;
}

const COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#14B8A6"];

export default function TradeTariffComparison() {
  const [hsCode, setHsCode] = useState("847130");
  const [productValue, setProductValue] = useState("100000");
  const [originCountry, setOriginCountry] = useState("CN");
  const [destinationCountry, setDestinationCountry] = useState("US");
  const [localContent, setLocalContent] = useState("60");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<TariffResult | null>(null);
  const [countryComparisons, setCountryComparisons] = useState<CountryComparison[]>([]);

  const hsChapter = hsCode.substring(0, 2);
  const hsChapterInfo = mfnRatesByChapter[hsChapter] || { chapter: hsChapter, description: "Unknown", rate: 5 };

  const analyzeTariffs = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const value = parseFloat(productValue) || 100000;
      const localContentPct = parseFloat(localContent) || 60;
      
      // Get MFN rate
      const mfnRate = hsChapterInfo.rate;
      
      // Find applicable FTAs
      const applicableFTAs = freeTradeAgreements.filter(fta => 
        fta.parties.includes(originCountry) && fta.parties.includes(destinationCountry)
      );
      
      // Check FTA eligibility
      const eligibleFTAs = applicableFTAs.filter(fta => localContentPct >= fta.localContentReq);
      const ftaEligible = eligibleFTAs.length > 0;
      
      // FTA rate (0% if eligible, otherwise MFN)
      const ftaRate = ftaEligible ? 0 : (eligibleFTAs.length > 0 ? mfnRate * 0.5 : mfnRate);
      
      // Check anti-dumping
      const antiDumping = antiDumpingDuties.find(ad => 
        ad.hsCode.startsWith(hsChapter) && 
        ad.origin === originCountry && 
        ad.destination === destinationCountry
      );
      const antiDumpingRate = antiDumping?.rate || 0;
      
      // Calculate totals
      const totalDuty = ftaRate + antiDumpingRate;
      const savings = (mfnRate - totalDuty) / 100 * value;
      const savingsPercent = mfnRate > 0 ? ((mfnRate - totalDuty) / mfnRate) * 100 : 0;
      
      // Generate warnings
      const warnings: string[] = [];
      if (antiDumpingRate > 0) {
        warnings.push(`Anti-dumping duty of ${antiDumpingRate}% applies to this product from ${originCountry}`);
      }
      if (applicableFTAs.length > 0 && !ftaEligible) {
        warnings.push(`FTA available but local content requirement (${applicableFTAs[0].localContentReq}%) not met`);
      }
      if (mfnRate > 10) {
        warnings.push("High MFN duty rate - consider FTA optimization");
      }
      
      setResults({
        mfnRate,
        ftaRate,
        ftaEligible,
        applicableFTAs: eligibleFTAs.map(f => f.name),
        antiDumpingRate,
        totalDuty,
        savings,
        savingsPercent,
        warnings,
      });
      
      // Generate country comparison matrix
      const comparisons: CountryComparison[] = countries.slice(0, 15).map(country => {
        const hasFTA = freeTradeAgreements.some(fta => 
          fta.parties.includes(country.code) && fta.parties.includes(destinationCountry)
        );
        const countryAD = antiDumpingDuties.find(ad => 
          ad.hsCode.startsWith(hsChapter) && 
          ad.origin === country.code && 
          ad.destination === destinationCountry
        );
        const adRate = countryAD?.rate || 0;
        const ftaRateCountry = hasFTA ? 0 : mfnRate;
        
        return {
          country: country.name,
          countryCode: country.code,
          mfnRate,
          ftaRate: ftaRateCountry,
          totalDuty: ftaRateCountry + adRate,
          hasFTA,
          antiDumping: adRate > 0,
        };
      });
      
      setCountryComparisons(comparisons);
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

  const tariffComparisonData = useMemo(() => {
    if (!results) return [];
    return [
      { name: "MFN Rate", rate: results.mfnRate, color: "#EF4444" },
      { name: "FTA Rate", rate: results.ftaRate, color: LOGISTICS_GREEN },
      { name: "Anti-Dumping", rate: results.antiDumpingRate, color: "#F59E0B" },
      { name: "Total Duty", rate: results.totalDuty, color: OCEAN_BLUE },
    ];
  }, [results]);

  const pieChartData = useMemo(() => {
    if (!results) return [];
    const value = parseFloat(productValue) || 100000;
    return [
      { name: "Product Value", value: value, fill: OCEAN_BLUE },
      { name: "Duty Savings", value: Math.max(0, results.savings), fill: LOGISTICS_GREEN },
      { name: "Duty Paid", value: value * results.totalDuty / 100, fill: "#F59E0B" },
    ];
  }, [results, productValue]);

  const radialBarData = useMemo(() => {
    if (!results) return [];
    return [
      { name: "Savings", value: Math.min(100, results.savingsPercent), fill: LOGISTICS_GREEN },
      { name: "Duty", value: Math.min(100, results.totalDuty), fill: OCEAN_BLUE },
    ];
  }, [results]);

  const escalationData = tariffEscalation.map((item, idx) => ({
    ...item,
    fill: idx < 3 ? LOGISTICS_GREEN : idx < 4 ? "#F59E0B" : "#EF4444",
  }));

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        <div className="relative px-6 py-12 md:px-12 md:py-16">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Globe className="h-8 w-8" />
                </div>
                <Badge className="bg-[#2E8B57] text-white border-0 px-3 py-1">
                  Global Trade Intelligence
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                Trade Tariff Comparison Tool
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                Analyze and compare tariffs across countries, optimize your supply chain with FTA benefits, 
                and identify potential cost savings on international trade.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <Ship className="h-5 w-5 text-[#2E8B57]" />
                  <span className="text-sm">25+ Countries</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <FileText className="h-5 w-5 text-[#2E8B57]" />
                  <span className="text-sm">10 Major FTAs</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <Target className="h-5 w-5 text-[#2E8B57]" />
                  <span className="text-sm">Real-time Analysis</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E8B57]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Input Section */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
            <Search className="h-5 w-5" />
            Trade Tariff Analysis
          </CardTitle>
          <CardDescription>
            Enter HS code and trade route to compare tariffs and FTA eligibility
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* HS Code Input */}
            <div className="space-y-2">
              <Label htmlFor="hsCode" className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#2E8B57]" />
                HS Code (6-digit)
              </Label>
              <Input
                id="hsCode"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="847130"
                className="h-11 font-mono"
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Chapter {hsChapter}: {hsChapterInfo.description}
              </p>
            </div>

            {/* Product Value */}
            <div className="space-y-2">
              <Label htmlFor="productValue" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                Product Value (USD)
              </Label>
              <Input
                id="productValue"
                type="number"
                value={productValue}
                onChange={(e) => setProductValue(e.target.value)}
                placeholder="100,000"
                className="h-11"
              />
            </div>

            {/* Origin Country */}
            <div className="space-y-2">
              <Label htmlFor="originCountry" className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-[#2E8B57]" />
                Export Country (Origin)
              </Label>
              <Select value={originCountry} onValueChange={setOriginCountry}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination Country */}
            <div className="space-y-2">
              <Label htmlFor="destinationCountry" className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-[#EF4444]" />
                Import Country (Destination)
              </Label>
              <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Local Content */}
            <div className="space-y-2">
              <Label htmlFor="localContent" className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-[#2E8B57]" />
                Local Content (%)
              </Label>
              <Input
                id="localContent"
                type="number"
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                placeholder="60"
                className="h-11"
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground">
                Required for FTA eligibility
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button
              onClick={analyzeTariffs}
              disabled={isAnalyzing}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Tariffs...
                </>
              ) : (
                <>
                  <GitCompare className="mr-2 h-5 w-5" />
                  Compare Tariffs
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results && (
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
                  <Percent className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">MFN</span>
                </div>
                <p className="text-2xl font-bold">{results.mfnRate}%</p>
                <p className="text-sm opacity-80 mt-1">Standard Rate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">FTA</span>
                </div>
                <p className="text-2xl font-bold">{results.ftaRate}%</p>
                <p className="text-sm opacity-80 mt-1">
                  {results.ftaEligible ? "Eligible" : "Not Eligible"}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">AD</span>
                </div>
                <p className="text-2xl font-bold">{results.antiDumpingRate}%</p>
                <p className="text-sm opacity-80 mt-1">Anti-Dumping</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Total</span>
                </div>
                <p className="text-2xl font-bold">{results.totalDuty}%</p>
                <p className="text-sm opacity-80 mt-1">Total Duty</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingDown className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Savings</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(results.savings)}</p>
                <p className="text-sm opacity-80 mt-1">{results.savingsPercent.toFixed(1)}% Savings</p>
              </CardContent>
            </Card>
          </div>

          {/* Warnings */}
          {results.warnings.length > 0 && (
            <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Important Notices</p>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                      {results.warnings.map((warning, idx) => (
                        <li key={idx}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs for detailed analysis */}
          <Tabs defaultValue="comparison" className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="comparison" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Rate Comparison
              </TabsTrigger>
              <TabsTrigger value="country-matrix" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
                <Map className="h-4 w-4 mr-2" />
                Country Matrix
              </TabsTrigger>
              <TabsTrigger value="escalation" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tariff Escalation
              </TabsTrigger>
              <TabsTrigger value="fta" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
                <Globe className="h-4 w-4 mr-2" />
                FTA Details
              </TabsTrigger>
              <TabsTrigger value="trends" className="data-[state=active]:bg-[#0F4C81] data-[state=active]:text-white">
                <LineChart className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
            </TabsList>

            {/* Rate Comparison Tab */}
            <TabsContent value="comparison" className="pt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                      Tariff Rate Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tariffComparisonData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" unit="%" />
                          <YAxis dataKey="name" type="category" width={100} />
                          <Tooltip formatter={(value: number) => [`${value}%`, "Rate"]} />
                          <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                            {tariffComparisonData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-[#2E8B57]" />
                      Cost Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => formatCurrency(value)} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-base">Duty Calculation Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">Product Value</span>
                          <span className="font-medium">{formatCurrency(parseFloat(productValue) || 100000)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">MFN Duty ({results.mfnRate}%)</span>
                          <span className="font-medium">{formatCurrency((parseFloat(productValue) || 100000) * results.mfnRate / 100)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground">FTA Duty ({results.ftaRate}%)</span>
                          <span className="font-medium text-[#2E8B57]">{formatCurrency((parseFloat(productValue) || 100000) * results.ftaRate / 100)}</span>
                        </div>
                        {results.antiDumpingRate > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-muted-foreground">Anti-Dumping ({results.antiDumpingRate}%)</span>
                            <span className="font-medium text-amber-600">{formatCurrency((parseFloat(productValue) || 100000) * results.antiDumpingRate / 100)}</span>
                          </div>
                        )}
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">Total Duty (FTA)</span>
                            <span className="font-bold text-lg text-[#0F4C81]">
                              {formatCurrency((parseFloat(productValue) || 100000) * results.totalDuty / 100)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-[#2E8B57]/10 rounded-lg border border-[#2E8B57]/20">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingDown className="h-5 w-5 text-[#2E8B57]" />
                            <span className="font-semibold text-[#2E8B57]">Potential Savings</span>
                          </div>
                          <p className="text-2xl font-bold text-[#2E8B57]">{formatCurrency(results.savings)}</p>
                          <p className="text-sm text-muted-foreground">
                            {results.savingsPercent.toFixed(1)}% reduction vs MFN rate
                          </p>
                        </div>

                        {results.applicableFTAs.length > 0 && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Shield className="h-5 w-5 text-[#0F4C81]" />
                              <span className="font-semibold text-[#0F4C81]">Applicable FTAs</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {results.applicableFTAs.map((fta, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-[#0F4C81]/10 text-[#0F4C81]">
                                  {fta}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Country Matrix Tab */}
            <TabsContent value="country-matrix" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Map className="h-5 w-5 text-[#0F4C81]" />
                    Country Comparison Matrix
                  </CardTitle>
                  <CardDescription>
                    Compare tariff rates across different origin countries for the same HS code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={countryComparisons.slice(0, 12)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="countryCode" />
                        <YAxis unit="%" />
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value}%`, name]}
                          labelFormatter={(label) => {
                            const country = countryComparisons.find(c => c.countryCode === label);
                            return country?.country || String(label);
                          }}
                        />
                        <Legend />
                        <Bar dataKey="mfnRate" name="MFN Rate" fill="#EF4444" />
                        <Bar dataKey="ftaRate" name="FTA Rate" fill={LOGISTICS_GREEN} />
                        <Bar dataKey="totalDuty" name="Total Duty" fill={OCEAN_BLUE} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Country</th>
                          <th className="text-center py-3 px-4">MFN Rate</th>
                          <th className="text-center py-3 px-4">FTA Rate</th>
                          <th className="text-center py-3 px-4">Total Duty</th>
                          <th className="text-center py-3 px-4">FTA Status</th>
                          <th className="text-center py-3 px-4">Anti-Dumping</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countryComparisons.slice(0, 10).map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                            <td className="py-3 px-4 font-medium">{row.country}</td>
                            <td className="text-center py-3 px-4">{row.mfnRate}%</td>
                            <td className="text-center py-3 px-4">
                              <span className={row.ftaRate === 0 ? "text-[#2E8B57] font-semibold" : ""}>
                                {row.ftaRate}%
                              </span>
                            </td>
                            <td className="text-center py-3 px-4 font-semibold">{row.totalDuty}%</td>
                            <td className="text-center py-3 px-4">
                              {row.hasFTA ? (
                                <Badge className="bg-[#2E8B57]">Yes</Badge>
                              ) : (
                                <Badge variant="secondary">No</Badge>
                              )}
                            </td>
                            <td className="text-center py-3 px-4">
                              {row.antiDumping ? (
                                <Badge className="bg-amber-500">Active</Badge>
                              ) : (
                                <span className="text-muted-foreground">None</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tariff Escalation Tab */}
            <TabsContent value="escalation" className="pt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                      Tariff Escalation Analysis
                    </CardTitle>
                    <CardDescription>
                      How tariffs increase with processing levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 mb-6">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={escalationData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="level" />
                          <YAxis unit="%" />
                          <Tooltip formatter={(value: number) => [`${value}%`, "Duty Rate"]} />
                          <Area type="monotone" dataKey="rate" stroke={OCEAN_BLUE} fill={OCEAN_BLUE} fillOpacity={0.3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {escalationData.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{item.level}</span>
                            <Badge style={{ backgroundColor: item.fill, color: "white" }}>
                              {item.rate}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.example}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Understanding Tariff Escalation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-semibold text-[#0F4C81] mb-2">What is Tariff Escalation?</h4>
                          <p className="text-sm text-muted-foreground">
                            Tariff escalation is the practice of imposing higher tariffs on processed goods 
                            compared to raw materials. This protects domestic processing industries by 
                            making it more expensive to import finished products.
                          </p>
                        </div>

                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <h4 className="font-semibold text-amber-700 mb-2">Why It Matters</h4>
                          <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-start gap-2">
                              <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                              <span>Higher tariffs on finished goods encourage local manufacturing</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                              <span>Developing countries often face barriers to value-added exports</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <ArrowRight className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                              <span>FTAs often reduce or eliminate escalation through tariff elimination</span>
                            </li>
                          </ul>
                        </div>

                        <div className="p-4 bg-[#2E8B57]/10 rounded-lg border border-[#2E8B57]/20">
                          <h4 className="font-semibold text-[#2E8B57] mb-2">Strategic Implications</h4>
                          <ul className="text-sm text-muted-foreground space-y-2">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                              <span>Consider semi-processed goods for lower tariffs</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                              <span>FTAs can eliminate escalation - check eligibility</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                              <span>Local processing in destination country may be cost-effective</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* FTA Details Tab */}
            <TabsContent value="fta" className="pt-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="h-5 w-5 text-[#0F4C81]" />
                      Major Free Trade Agreements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {freeTradeAgreements.map((fta, idx) => (
                        <motion.div
                          key={fta.code}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            fta.parties.includes(originCountry) && fta.parties.includes(destinationCountry)
                              ? "border-[#2E8B57] bg-[#2E8B57]/5"
                              : "border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm">{fta.name}</h4>
                            {fta.parties.includes(originCountry) && fta.parties.includes(destinationCountry) && (
                              <Badge className="bg-[#2E8B57]">Active</Badge>
                            )}
                          </div>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            <p>Members: {fta.parties.length} countries</p>
                            <p>Duty reduction: ~{fta.avgDutyReduction}%</p>
                            <p>Local content: {fta.localContentReq}% min</p>
                            <p>Effective: {fta.effectiveDate}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-[#2E8B57]" />
                        Savings Gauge
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart 
                            cx="50%" 
                            cy="50%" 
                            innerRadius="30%" 
                            outerRadius="80%" 
                            data={radialBarData}
                            startAngle={180}
                            endAngle={0}
                          >
                            <RadialBar
                              background
                              dataKey="value"
                              cornerRadius={10}
                            />
                            <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, ""]} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#2E8B57]">{results?.savingsPercent.toFixed(1)}%</p>
                        <p className="text-sm text-muted-foreground">Potential Savings</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">FTA Benefits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 bg-[#2E8B57]/10 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                            <span className="font-medium text-sm">Duty Elimination</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Most FTAs eliminate duties on qualifying goods
                          </p>
                        </div>

                        <div className="p-3 bg-[#0F4C81]/10 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield className="h-4 w-4 text-[#0F4C81]" />
                            <span className="font-medium text-sm">Trade Certainty</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Predictable tariff treatment for planning
                          </p>
                        </div>

                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-amber-600" />
                            <span className="font-medium text-sm">Documentation Required</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Certificate of Origin must accompany shipment
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="pt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-[#0F4C81]" />
                      Tariff Rate Trends (2019-2024)
                    </CardTitle>
                    <CardDescription>
                      Historical average tariff rates across major trade routes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={tariffTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis yAxisId="left" unit="%" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="mfnAvg" 
                            name="MFN Avg %" 
                            stroke="#EF4444" 
                            strokeWidth={2}
                            dot={{ fill: "#EF4444" }}
                          />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="ftaAvg" 
                            name="FTA Avg %" 
                            stroke={LOGISTICS_GREEN} 
                            strokeWidth={2}
                            dot={{ fill: LOGISTICS_GREEN }}
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="tradeVolume" 
                            name="Trade Volume ($B)" 
                            stroke={OCEAN_BLUE} 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: OCEAN_BLUE }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#2E8B57]" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-[#2E8B57]/10 rounded-lg border border-[#2E8B57]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="h-5 w-5 text-[#2E8B57]" />
                          <span className="font-semibold text-[#2E8B57]">Declining MFN Rates</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Global average MFN rates have declined 17% since 2019, driven by WTO negotiations 
                          and unilateral liberalization.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0F4C81]/10 rounded-lg border border-[#0F4C81]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowLeftRight className="h-5 w-5 text-[#0F4C81]" />
                          <span className="font-semibold text-[#0F4C81]">FTA Rate Convergence</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          FTA preferential rates are approaching zero as more agreements implement 
                          full tariff elimination schedules.
                        </p>
                      </div>

                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-5 w-5 text-amber-600" />
                          <span className="font-semibold text-amber-700">Trade Volume Growth</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Despite temporary dips, global trade volume has grown 45% since 2019, 
                          with FTA utilization at record highs.
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-purple-700">Strategic Sourcing</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Companies actively leveraging FTA networks report 23% lower landed costs 
                          compared to MFN-based sourcing.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}

      {/* FAQ Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <HelpCircle className="h-6 w-6" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription className="text-white/80">
            Find answers to common questions about trade tariffs and FTA benefits
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {faqData.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={`faq-${idx}`} className="border rounded-lg px-4 mb-2">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-start gap-3 text-left">
                        <Badge 
                          variant="outline" 
                          className="shrink-0 border-[#0F4C81] text-[#0F4C81]"
                        >
                          {faq.category}
                        </Badge>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-[#0F4C81] hover:shadow-lg transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
                <Percent className="h-6 w-6 text-[#0F4C81]" />
              </div>
              <div>
                <p className="font-semibold">MFN Rates</p>
                <p className="text-sm text-muted-foreground">Standard WTO tariff rates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#2E8B57] hover:shadow-lg transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#2E8B57]/10 rounded-lg">
                <Shield className="h-6 w-6 text-[#2E8B57]" />
              </div>
              <div>
                <p className="font-semibold">FTA Benefits</p>
                <p className="text-sm text-muted-foreground">Preferential duty rates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold">Anti-Dumping</p>
                <p className="text-sm text-muted-foreground">Additional trade remedies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
