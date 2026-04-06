"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Search,
  Globe,
  Flag,
  DollarSign,
  Percent,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  History,
  TrendingUp,
  AlertCircle,
  Building2,
  BookOpen,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Share2,
  Calculator,
  LineChart,
  Lightbulb,
  AlertOctagon,
  X,
  Copy,
  Check,
  Zap,
  Target,
  TrendingDown,
  Users,
  Gavel,
  ClipboardList,
  FileSearch,
  RotateCcw,
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
  LineChart as RechartsLineChart,
  Line,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
  ComposedChart,
  Area,
} from "recharts";

// Types
interface AntiDumpingDuty {
  id: string;
  productCategory: string;
  hsCode: string;
  productName: string;
  originCountry: string;
  destinationMarket: string;
  dutyRate: number;
  dutyType: "ad" | "cvd" | "both";
  status: "active" | "expired" | "under_review" | "sunset_review" | "new_investigation";
  effectiveDate: string;
  expiryDate?: string;
  investigationNumber: string;
  authority: string;
  historicalRates: { year: number; rate: number; status: string }[];
  exporterSpecificRates: { exporter: string; rate: number; notes: string }[];
  exemptionAvailable: boolean;
  exemptionType?: string;
  notes: string;
}

// Sample Anti-Dumping Duty Data
const antiDumpingDuties: AntiDumpingDuty[] = [
  // US Market
  {
    id: "us-cn-steel-1",
    productCategory: "Steel Products",
    hsCode: "7208",
    productName: "Hot-Rolled Steel Flat Products",
    originCountry: "CN",
    destinationMarket: "US",
    dutyRate: 248.66,
    dutyType: "both",
    status: "active",
    effectiveDate: "2018-03-20",
    expiryDate: "2028-03-20",
    investigationNumber: "A-570-916",
    authority: "US DOC / ITC",
    historicalRates: [
      { year: 2018, rate: 248.66, status: "active" },
      { year: 2020, rate: 248.66, status: "active" },
      { year: 2022, rate: 248.66, status: "active" },
      { year: 2024, rate: 248.66, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 248.66, notes: "Country-wide rate" },
      { exporter: "Baoshan Iron & Steel", rate: 206.63, notes: "Individual rate" },
      { exporter: "Anshan Iron & Steel", rate: 236.91, notes: "Individual rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Section 232 tariffs of 25% may also apply in addition to AD/CVD duties.",
  },
  {
    id: "us-cn-aluminum-1",
    productCategory: "Aluminum Products",
    hsCode: "7606",
    productName: "Aluminum Alloy Sheets",
    originCountry: "CN",
    destinationMarket: "US",
    dutyRate: 177.40,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2021-04-30",
    expiryDate: "2031-04-30",
    investigationNumber: "A-570-112",
    authority: "US DOC / ITC",
    historicalRates: [
      { year: 2021, rate: 177.40, status: "active" },
      { year: 2022, rate: 177.40, status: "active" },
      { year: 2023, rate: 177.40, status: "active" },
      { year: 2024, rate: 177.40, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 177.40, notes: "Country-wide rate" },
      { exporter: "Henan Mingtai", rate: 59.72, notes: "Individual rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Section 232 tariffs of 10% may also apply.",
  },
  {
    id: "us-cn-solar-1",
    productCategory: "Solar Panels",
    hsCode: "8541.40",
    productName: "Crystalline Silicon Photovoltaic Cells",
    originCountry: "CN",
    destinationMarket: "US",
    dutyRate: 165.42,
    dutyType: "both",
    status: "active",
    effectiveDate: "2018-01-15",
    expiryDate: "2028-01-15",
    investigationNumber: "A-570-985",
    authority: "US DOC / ITC",
    historicalRates: [
      { year: 2018, rate: 165.42, status: "active" },
      { year: 2020, rate: 165.42, status: "active" },
      { year: 2022, rate: 165.42, status: "active" },
      { year: 2024, rate: 165.42, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 165.42, notes: "Country-wide rate" },
      { exporter: "Trina Solar", rate: 18.32, notes: "Individual rate" },
      { exporter: "Jinko Solar", rate: 9.89, notes: "Individual rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "UFLPA restrictions may also apply for forced labor concerns.",
  },
  {
    id: "us-vn-steel-1",
    productCategory: "Steel Products",
    hsCode: "7210",
    productName: "Corrosion-Resistant Steel",
    originCountry: "VN",
    destinationMarket: "US",
    dutyRate: 459.41,
    dutyType: "both",
    status: "active",
    effectiveDate: "2021-12-02",
    expiryDate: "2031-12-02",
    investigationNumber: "A-552-841",
    authority: "US DOC / ITC",
    historicalRates: [
      { year: 2021, rate: 459.41, status: "active" },
      { year: 2022, rate: 459.41, status: "active" },
      { year: 2024, rate: 459.41, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 459.41, notes: "Country-wide rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "High rates due to circumvention findings from China.",
  },
  // EU Market
  {
    id: "eu-cn-steel-1",
    productCategory: "Steel Products",
    hsCode: "7225",
    productName: "Cold-Rolled Flat Steel",
    originCountry: "CN",
    destinationMarket: "EU",
    dutyRate: 53.1,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2016-02-13",
    expiryDate: "2026-02-13",
    investigationNumber: "AD592",
    authority: "European Commission",
    historicalRates: [
      { year: 2016, rate: 53.1, status: "active" },
      { year: 2018, rate: 53.1, status: "active" },
      { year: 2020, rate: 53.1, status: "active" },
      { year: 2022, rate: 53.1, status: "active" },
      { year: 2024, rate: 53.1, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 53.1, notes: "Country-wide rate" },
      { exporter: "Tianjin Iron & Steel", rate: 21.1, notes: "Individual rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Subject to periodic reviews by European Commission.",
  },
  {
    id: "eu-cn-aluminum-1",
    productCategory: "Aluminum Products",
    hsCode: "7604",
    productName: "Aluminum Extrusions",
    originCountry: "CN",
    destinationMarket: "EU",
    dutyRate: 48.7,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2021-04-12",
    expiryDate: "2031-04-12",
    investigationNumber: "AD632",
    authority: "European Commission",
    historicalRates: [
      { year: 2021, rate: 48.7, status: "active" },
      { year: 2022, rate: 48.7, status: "active" },
      { year: 2023, rate: 48.7, status: "active" },
      { year: 2024, rate: 48.7, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 48.7, notes: "Country-wide rate" },
      { exporter: "Guangdong Jianmei", rate: 28.3, notes: "Individual rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Covers profiles, bars, rods, and tubes.",
  },
  {
    id: "eu-cn-solar-1",
    productCategory: "Solar Panels",
    hsCode: "8541.40",
    productName: "Solar Panels and Cells",
    originCountry: "CN",
    destinationMarket: "EU",
    dutyRate: 47.6,
    dutyType: "both",
    status: "active",
    effectiveDate: "2013-12-02",
    expiryDate: "2025-09-01",
    investigationNumber: "AD479/CVD460",
    authority: "European Commission",
    historicalRates: [
      { year: 2013, rate: 64.9, status: "active" },
      { year: 2017, rate: 47.6, status: "active" },
      { year: 2020, rate: 47.6, status: "active" },
      { year: 2024, rate: 47.6, status: "under_review" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 47.6, notes: "Minimum import price may apply" },
      { exporter: "Trina Solar", rate: 25.5, notes: "Undertaking rate" },
    ],
    exemptionAvailable: false,
    notes: "MIP (Minimum Import Price) undertaking alternative to duties.",
  },
  {
    id: "eu-cn-wind-1",
    productCategory: "Wind Turbines",
    hsCode: "8502.31",
    productName: "Wind Turbines and Components",
    originCountry: "CN",
    destinationMarket: "EU",
    dutyRate: 0,
    dutyType: "ad",
    status: "under_review",
    effectiveDate: "2024-04-03",
    investigationNumber: "AD692",
    authority: "European Commission",
    historicalRates: [
      { year: 2024, rate: 0, status: "under_review" },
    ],
    exporterSpecificRates: [
      { exporter: "TBD", rate: 0, notes: "Investigation ongoing" },
    ],
    exemptionAvailable: false,
    notes: "New investigation initiated April 2024. Provisional measures may apply.",
  },
  // UK Market
  {
    id: "uk-cn-steel-1",
    productCategory: "Steel Products",
    hsCode: "7208",
    productName: "Hot-Rolled Steel",
    originCountry: "CN",
    destinationMarket: "UK",
    dutyRate: 38.1,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2021-01-01",
    expiryDate: "2031-01-01",
    investigationNumber: "AD2607",
    authority: "TRAB UK",
    historicalRates: [
      { year: 2021, rate: 38.1, status: "active" },
      { year: 2022, rate: 38.1, status: "active" },
      { year: 2024, rate: 38.1, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 38.1, notes: "Country-wide rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Post-Brexit UK-specific measures.",
  },
  {
    id: "uk-cn-aluminum-1",
    productCategory: "Aluminum Products",
    hsCode: "7604",
    productName: "Aluminum Extrusions",
    originCountry: "CN",
    destinationMarket: "UK",
    dutyRate: 51.4,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2022-06-15",
    expiryDate: "2032-06-15",
    investigationNumber: "AD2609",
    authority: "TRAB UK",
    historicalRates: [
      { year: 2022, rate: 51.4, status: "active" },
      { year: 2023, rate: 51.4, status: "active" },
      { year: 2024, rate: 51.4, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 51.4, notes: "Country-wide rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Inherited and adapted from EU measures post-Brexit.",
  },
  // Australia Market
  {
    id: "au-cn-steel-1",
    productCategory: "Steel Products",
    hsCode: "7210",
    productName: "Galvanized Steel",
    originCountry: "CN",
    destinationMarket: "AU",
    dutyRate: 27.4,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2019-04-16",
    expiryDate: "2029-04-16",
    investigationNumber: "534",
    authority: "Anti-Dumping Commission",
    historicalRates: [
      { year: 2019, rate: 27.4, status: "active" },
      { year: 2021, rate: 27.4, status: "active" },
      { year: 2024, rate: 27.4, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 27.4, notes: "Country-wide rate" },
      { exporter: "Baosteel", rate: 15.2, notes: "Individual rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Subject to continuation inquiries every 5 years.",
  },
  {
    id: "au-cn-aluminum-1",
    productCategory: "Aluminum Products",
    hsCode: "7604",
    productName: "Aluminum Extrusions",
    originCountry: "CN",
    destinationMarket: "AU",
    dutyRate: 34.7,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2016-10-18",
    expiryDate: "2026-10-18",
    investigationNumber: "469",
    authority: "Anti-Dumping Commission",
    historicalRates: [
      { year: 2016, rate: 34.7, status: "active" },
      { year: 2018, rate: 34.7, status: "active" },
      { year: 2020, rate: 34.7, status: "active" },
      { year: 2022, rate: 34.7, status: "active" },
      { year: 2024, rate: 34.7, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 34.7, notes: "Country-wide rate" },
      { exporter: "Guangdong Xingfa", rate: 22.1, notes: "Individual rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "One of Australia's longest-running AD measures.",
  },
  // India Market
  {
    id: "in-cn-steel-1",
    productCategory: "Steel Products",
    hsCode: "7208",
    productName: "Hot-Rolled Steel Coils",
    originCountry: "CN",
    destinationMarket: "IN",
    dutyRate: 485.27,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2022-11-29",
    expiryDate: "2027-11-29",
    investigationNumber: "ORA-I-48/2021",
    authority: "DGTR India",
    historicalRates: [
      { year: 2022, rate: 485.27, status: "active" },
      { year: 2023, rate: 485.27, status: "active" },
      { year: 2024, rate: 485.27, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 485.27, notes: "Country-wide rate (USD/MT)" },
    ],
    exemptionAvailable: false,
    notes: "Quasi-specific duty rate per metric ton rather than ad valorem.",
  },
  {
    id: "in-cn-chemicals-1",
    productCategory: "Chemicals",
    hsCode: "2905.11",
    productName: "Methanol",
    originCountry: "CN",
    destinationMarket: "IN",
    dutyRate: 128.48,
    dutyType: "ad",
    status: "active",
    effectiveDate: "2023-02-09",
    expiryDate: "2028-02-09",
    investigationNumber: "ORA-I-23/2022",
    authority: "DGTR India",
    historicalRates: [
      { year: 2023, rate: 128.48, status: "active" },
      { year: 2024, rate: 128.48, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 128.48, notes: "Country-wide rate (USD/MT)" },
    ],
    exemptionAvailable: false,
    notes: "Specific duty in USD per metric ton.",
  },
  // Additional US Measures
  {
    id: "us-cn-wind-1",
    productCategory: "Wind Turbines",
    hsCode: "8502.31",
    productName: "Wind Towers",
    originCountry: "CN",
    destinationMarket: "US",
    dutyRate: 214.89,
    dutyType: "both",
    status: "active",
    effectiveDate: "2021-02-10",
    expiryDate: "2031-02-10",
    investigationNumber: "A-570-106",
    authority: "US DOC / ITC",
    historicalRates: [
      { year: 2021, rate: 214.89, status: "active" },
      { year: 2022, rate: 214.89, status: "active" },
      { year: 2024, rate: 214.89, status: "active" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 214.89, notes: "Country-wide rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Covers utility-scale wind towers.",
  },
  {
    id: "us-cn-tires-1",
    productCategory: "Automotive",
    hsCode: "4011",
    productName: "Passenger Vehicle Tires",
    originCountry: "CN",
    destinationMarket: "US",
    dutyRate: 87.99,
    dutyType: "both",
    status: "active",
    effectiveDate: "2015-07-01",
    expiryDate: "2025-07-01",
    investigationNumber: "A-570-931",
    authority: "US DOC / ITC",
    historicalRates: [
      { year: 2015, rate: 87.99, status: "active" },
      { year: 2018, rate: 87.99, status: "active" },
      { year: 2020, rate: 87.99, status: "active" },
      { year: 2024, rate: 87.99, status: "sunset_review" },
    ],
    exporterSpecificRates: [
      { exporter: "All Others", rate: 87.99, notes: "Country-wide rate" },
      { exporter: "Giti Tire", rate: 33.08, notes: "Individual rate" },
    ],
    exemptionAvailable: true,
    exemptionType: "New Exporter Review",
    notes: "Sunset review pending for continuation beyond 2025.",
  },
];

// Countries list
const countries = [
  { code: "CN", name: "China", region: "Asia" },
  { code: "VN", name: "Vietnam", region: "Asia" },
  { code: "KR", name: "South Korea", region: "Asia" },
  { code: "TW", name: "Taiwan", region: "Asia" },
  { code: "IN", name: "India", region: "Asia" },
  { code: "JP", name: "Japan", region: "Asia" },
  { code: "DE", name: "Germany", region: "Europe" },
  { code: "RU", name: "Russia", region: "Europe" },
  { code: "BR", name: "Brazil", region: "South America" },
  { code: "TR", name: "Turkey", region: "Middle East" },
];

// Destination markets
const destinationMarkets = [
  { code: "US", name: "United States", authority: "US Department of Commerce" },
  { code: "EU", name: "European Union", authority: "European Commission" },
  { code: "UK", name: "United Kingdom", authority: "TRAB UK" },
  { code: "AU", name: "Australia", authority: "Anti-Dumping Commission" },
  { code: "IN", name: "India", authority: "DGTR India" },
  { code: "CA", name: "Canada", authority: "CBSA" },
  { code: "MX", name: "Mexico", authority: "SAT" },
  { code: "JP", name: "Japan", authority: "MOF Japan" },
];

// Product categories
const productCategories = [
  { code: "steel", name: "Steel Products", hsCodeRange: "7204-7229" },
  { code: "aluminum", name: "Aluminum Products", hsCodeRange: "7601-7616" },
  { code: "solar", name: "Solar Panels & Cells", hsCodeRange: "8541.40" },
  { code: "wind", name: "Wind Turbines", hsCodeRange: "8502.31" },
  { code: "chemicals", name: "Chemicals", hsCodeRange: "2801-2942" },
  { code: "automotive", name: "Automotive Parts", hsCodeRange: "8701-8716" },
  { code: "textiles", name: "Textiles & Apparel", hsCodeRange: "5201-6310" },
  { code: "electronics", name: "Electronics", hsCodeRange: "8501-8548" },
];

// Status colors
const statusColors: Record<string, string> = {
  active: "#2E8B57",
  expired: "#94a3b8",
  under_review: "#F59E0B",
  sunset_review: "#8B5CF6",
  new_investigation: "#EF4444",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  expired: "Expired",
  under_review: "Under Review",
  sunset_review: "Sunset Review",
  new_investigation: "New Investigation",
};

const dutyTypeColors: Record<string, string> = {
  ad: "#0F4C81",
  cvd: "#8B5CF6",
  both: "#EF4444",
};

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899"];

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

export default function AntiDumpingDutyChecker() {
  const [hsCode, setHsCode] = useState("");
  const [productCategory, setProductCategory] = useState("steel");
  const [originCountry, setOriginCountry] = useState("CN");
  const [destinationMarket, setDestinationMarket] = useState("US");
  const [productValue, setProductValue] = useState("100000");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find matching AD duties
  const matchingDuties = useMemo(() => {
    let results = antiDumpingDuties.filter((duty) => {
      const matchesCategory = !productCategory || duty.productCategory.toLowerCase().includes(productCategory.toLowerCase());
      const matchesOrigin = !originCountry || duty.originCountry === originCountry;
      const matchesDestination = !destinationMarket || duty.destinationMarket === destinationMarket;
      const matchesHsCode = !hsCode || duty.hsCode.startsWith(hsCode.replace(".", ""));
      return matchesCategory && matchesOrigin && matchesDestination && matchesHsCode;
    });
    
    if (searchTerm) {
      results = results.filter(
        (duty) =>
          duty.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          duty.hsCode.includes(searchTerm)
      );
    }
    
    return results;
  }, [productCategory, originCountry, destinationMarket, hsCode, searchTerm]);

  // Calculate duty impact
  const dutyImpact = useMemo(() => {
    if (matchingDuties.length === 0) return null;
    
    const value = parseFloat(productValue) || 100000;
    const primaryDuty = matchingDuties[0];
    const dutyAmount = (value * primaryDuty.dutyRate) / 100;
    
    return {
      productValue: value,
      adDutyRate: primaryDuty.dutyRate,
      adDutyAmount: dutyAmount,
      totalWithDuty: value + dutyAmount,
    };
  }, [matchingDuties, productValue]);

  // Historical chart data
  const historicalChartData = useMemo(() => {
    if (matchingDuties.length === 0 || !matchingDuties[0].historicalRates) return [];
    return matchingDuties[0].historicalRates.map((h) => ({
      year: h.year,
      rate: h.rate,
      status: h.status,
    }));
  }, [matchingDuties]);

  // Country comparison data
  const countryComparisonData = useMemo(() => {
    const countryDuties: Record<string, { country: string; avgRate: number; count: number; totalRate: number }> = {};
    
    antiDumpingDuties.forEach((duty) => {
      if (!countryDuties[duty.originCountry]) {
        countryDuties[duty.originCountry] = {
          country: countries.find((c) => c.code === duty.originCountry)?.name || duty.originCountry,
          avgRate: 0,
          count: 0,
          totalRate: 0,
        };
      }
      countryDuties[duty.originCountry].count++;
      countryDuties[duty.originCountry].totalRate += duty.dutyRate;
    });
    
    return Object.values(countryDuties)
      .map((c) => ({
        ...c,
        avgRate: c.totalRate / c.count,
      }))
      .sort((a, b) => b.avgRate - a.avgRate);
  }, []);

  // Market comparison data
  const marketComparisonData = useMemo(() => {
    const marketDuties: Record<string, { market: string; avgRate: number; count: number; totalRate: number }> = {};
    
    antiDumpingDuties.forEach((duty) => {
      if (!marketDuties[duty.destinationMarket]) {
        marketDuties[duty.destinationMarket] = {
          market: destinationMarkets.find((m) => m.code === duty.destinationMarket)?.name || duty.destinationMarket,
          avgRate: 0,
          count: 0,
          totalRate: 0,
        };
      }
      marketDuties[duty.destinationMarket].count++;
      marketDuties[duty.destinationMarket].totalRate += duty.dutyRate;
    });
    
    return Object.values(marketDuties)
      .map((m) => ({
        ...m,
        avgRate: m.totalRate / m.count,
      }))
      .sort((a, b) => b.avgRate - a.avgRate);
  }, []);

  // Duty breakdown for pie chart
  const dutyBreakdownData = useMemo(() => {
    if (!dutyImpact) return [];
    return [
      { name: "Product Value", value: dutyImpact.productValue, color: OCEAN_BLUE },
      { name: "AD/CVD Duty", value: dutyImpact.adDutyAmount, color: LOGISTICS_GREEN },
    ];
  }, [dutyImpact]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 800);
  };

  const handleReset = () => {
    setHsCode("");
    setProductCategory("steel");
    setOriginCountry("CN");
    setDestinationMarket("US");
    setProductValue("100000");
    setSearchTerm("");
  };

  const handleExport = useCallback(() => {
    if (matchingDuties.length === 0) return;
    
    const exportData = {
      exportDate: new Date().toISOString(),
      searchCriteria: {
        productCategory,
        hsCode,
        originCountry,
        destinationMarket,
        productValue,
      },
      results: matchingDuties.map(duty => ({
        productName: duty.productName,
        hsCode: duty.hsCode,
        dutyRate: duty.dutyRate,
        dutyType: duty.dutyType,
        status: duty.status,
        effectiveDate: duty.effectiveDate,
        expiryDate: duty.expiryDate,
        investigationNumber: duty.investigationNumber,
        authority: duty.authority,
      })),
      calculations: dutyImpact ? {
        productValue: dutyImpact.productValue,
        adDutyAmount: dutyImpact.adDutyAmount,
        totalWithDuty: dutyImpact.totalWithDuty,
      } : null,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anti-dumping-duty-report-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [matchingDuties, productCategory, hsCode, originCountry, destinationMarket, productValue, dutyImpact]);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const copyShareLink = useCallback(() => {
    const params = new URLSearchParams({
      cat: productCategory,
      hs: hsCode,
      origin: originCountry,
      dest: destinationMarket,
      value: productValue,
    });
    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [productCategory, hsCode, originCountry, destinationMarket, productValue]);

  // Pro Tips
  const proTips = [
    {
      icon: <Search className="h-5 w-5" />,
      title: "Verify HS Code Accuracy",
      description: "Ensure your HS code classification is accurate. Anti-dumping orders are HS code specific, and misclassification can lead to unexpected duty liability or penalties.",
    },
    {
      icon: <Building2 className="h-5 w-5" />,
      title: "Check Exporter-Specific Rates",
      description: "Individual exporters may have significantly lower duty rates than the country-wide rate. Always verify if your supplier qualifies for an individual rate.",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Monitor Review Schedules",
      description: "Administrative reviews can result in retroactive duty adjustments. Stay informed about upcoming reviews that may affect your imports.",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Consider Alternative Sourcing",
      description: "Countries without AD measures may offer cost advantages. Evaluate total landed cost from alternative origin countries.",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Document Everything",
      description: "Maintain detailed records of all import transactions, including certificates of origin, commercial invoices, and correspondence with customs authorities.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Engage Legal Counsel Early",
      description: "For high-value imports subject to AD duties, consider consulting trade compliance attorneys to explore exemption opportunities and ensure compliance.",
    },
  ];

  // Common Mistakes
  const commonMistakes = [
    {
      icon: <XCircle className="h-5 w-5" />,
      title: "Assuming FTA Benefits Override AD Duties",
      description: "Free Trade Agreement preferential rates typically do NOT apply to products subject to AD/CVD orders. AD duties are applied regardless of FTA status, leading to unexpected costs for uninformed importers.",
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      title: "Ignoring Cumulative Duty Impact",
      description: "AD/CVD duties stack with normal customs duties AND any applicable Section 301 or Section 232 tariffs. A product can easily face 300%+ total duties when all measures apply simultaneously.",
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      title: "Underestimating Retroactive Adjustments",
      description: "Administrative reviews can result in duty rate changes applied retroactively to entries made during the review period. Importers must post cash deposits and may face additional bills years after import.",
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: "Overlooking Circumvention Risks",
      description: "Transshipment through third countries to avoid AD duties is illegal and actively investigated. Customs authorities impose severe penalties, including higher duties, fines, and criminal prosecution for circumvention schemes.",
    },
    {
      icon: <FileSearch className="h-5 w-5" />,
      title: "Neglecting New Exporter Review Opportunities",
      description: "Many importers miss the opportunity to apply for New Exporter Review, which can result in individual duty rates significantly lower than country-wide rates for exporters who didn't ship during the investigation period.",
    },
  ];

  // FAQ Data (150+ words each)
  const faqData = [
    {
      question: "What are anti-dumping duties and why do they exist?",
      answer: `Anti-dumping duties are special tariffs imposed by governments on imported goods that are priced below their fair market value in the exporting country. These measures exist to protect domestic industries from unfair trade practices where foreign producers sell products at artificially low prices to gain market share, often referred to as "dumping." 

The World Trade Organization (WTO) permits member countries to impose anti-dumping duties under specific conditions when domestic producers can demonstrate material injury caused by dumped imports. The duty rate typically equals the calculated "dumping margin" - the difference between the normal value (home market price or cost of production) and the export price to the importing country.

Anti-dumping measures have been in use since the early 20th century and have become increasingly common in global trade. Major users include the United States, European Union, India, and Australia. These measures can remain in effect for decades through periodic "sunset reviews" that determine whether revocation would lead to continuation of dumping.

For importers, understanding anti-dumping duties is crucial because they can dramatically increase landed costs, affect sourcing decisions, and require careful compliance with customs procedures to avoid penalties and delays.`,
    },
    {
      question: "How are anti-dumping duty rates calculated?",
      answer: `Anti-dumping duty rates are calculated through a detailed investigation process that determines the "dumping margin" - the difference between what a product sells for in the exporter's home market (normal value) and the price at which it's sold in the importing country (export price).

The calculation methodology involves several steps. First, investigators establish the normal value, typically using the exporter's domestic sales prices, third-country market prices, or a "constructed value" based on production costs plus reasonable profit. Then they determine the export price, adjusted for all costs between the factory and the import destination.

The dumping margin percentage is calculated as: (Normal Value - Export Price) / Export Price × 100. This percentage becomes the anti-dumping duty rate. For example, if a product normally sells for $100 domestically but is exported at $60, the dumping margin is 66.67%.

Individual exporters who cooperate with investigations may receive company-specific rates, while non-cooperating exporters receive an "all-others" country-wide rate, often the highest rate calculated. This creates significant incentives for exporters to participate in investigations and demonstrate their pricing practices are fair.

Duty rates can change through administrative reviews, where actual export data from subsequent periods is analyzed to update the margin calculation.`,
    },
    {
      question: "What is the difference between AD and CVD duties?",
      answer: `Anti-Dumping (AD) and Countervailing (CVD) duties are both trade remedies that can apply to imports, but they address different unfair trade practices and are calculated differently.

Anti-Dumping duties address price discrimination by foreign exporters - when products are sold in the importing country at prices lower than in the home market or below cost. The focus is on company behavior and pricing decisions. AD duty rates are based on the dumping margin calculation.

Countervailing duties address government subsidies that benefit foreign producers. If a government provides financial assistance, tax breaks, or other benefits to domestic producers, this creates an unfair advantage in international trade. CVD rates are based on the calculated benefit received from subsidies, expressed as a percentage of the product value.

A single product can be subject to both AD and CVD duties simultaneously, as they address different distortions. For example, Chinese steel products in the US often face both duties, resulting in combined rates exceeding 200% in some cases.

The investigation processes are similar but involve different evidence. AD cases require showing price discrimination, while CVD cases require identifying specific subsidy programs and calculating their value. Both require demonstrating material injury to the domestic industry.

Understanding this distinction is crucial for importers, as the strategies for addressing each type of duty differ - AD duties may be reduced by working with exporters on pricing practices, while CVD duties require changes to government subsidy programs.`,
    },
    {
      question: "How long do anti-dumping duties remain in effect?",
      answer: `Anti-dumping duties typically remain in effect for at least five years from the date of the original order, but many orders have been in place for decades through the sunset review process.

The standard timeline works as follows: After an investigation concludes and duties are imposed, the order remains active for five years. At the five-year mark, a "sunset review" determines whether revoking the order would likely lead to continuation or recurrence of dumping and material injury. If the reviewing authority finds this likelihood, the order continues for another five years.

Many AD orders from the 1990s and earlier remain in effect today through repeated sunset reviews. For example, US anti-dumping orders on Chinese bicycles have been in place since 1995, and certain steel product orders date back even further.

Beyond sunset reviews, duty rates can change through annual administrative reviews, where actual export data from specific periods is analyzed to recalculate margins. These reviews can result in retroactive duty adjustments - importers may receive refunds or face additional bills years after import.

New shipper reviews allow previously unknown exporters to obtain individual rates. Changed circumstances reviews can modify or revoke orders based on significant changes in market conditions or company structures.

For strategic planning, importers should assume AD duties will persist indefinitely unless actively working to demonstrate changed circumstances or supporting domestic industry competitive recovery.`,
    },
    {
      question: "What is a New Exporter Review and how can it benefit importers?",
      answer: `A New Exporter Review (NER), also called "New Shipper Review" in some jurisdictions, is a special administrative process that allows exporters who did not ship the subject merchandise during the original investigation period to obtain an individual anti-dumping duty rate rather than being subject to the country-wide rate.

This process is significant because country-wide rates are often extremely high, calculated based on adverse inferences from non-cooperating parties. Individual rates obtained through NER can be dramatically lower, sometimes even zero if the exporter can demonstrate they're selling at fair value.

To qualify for NER, exporters typically must demonstrate: (1) They did not export the product during the period of investigation; (2) They are not affiliated with any exporter or producer already subject to the order; (3) They have a bona fide intent to export in the future; and (4) They can provide complete sales and cost data for review.

For importers, working with NER-qualified exporters presents a major cost-saving opportunity. A supplier subject to a 200% country-wide rate might qualify for a 20% or lower individual rate through this process.

However, NER requires careful planning and documentation. The review process takes 6-12 months, during which provisional duties may apply. Importers should work with customs brokers and trade attorneys experienced in AD proceedings to navigate the application process and ensure compliance with all requirements.

Not all jurisdictions offer NER provisions, and eligibility criteria vary. Importers should verify the specific procedures in their destination market.`,
    },
    {
      question: "How do administrative reviews affect existing AD duty rates?",
      answer: `Administrative reviews are periodic reassessments of anti-dumping duty rates that can significantly change the duty liability for entries made during the review period. Understanding this process is essential for importers' financial planning and risk management.

In most jurisdictions, annual administrative reviews examine the actual export transactions from a specific period (usually the most recent 12-month period). The reviewing authority recalculates the dumping margin based on verified sales data from participating exporters. This can result in higher or lower duty rates compared to the current rate.

The critical aspect for importers is that these rate changes apply retroactively. When goods enter during a review period, importers post a cash deposit at the current rate. After the review concludes, if the new rate differs, importers receive a bill for additional duties or a refund for overpayment. This process can take 18-24 months, meaning importers may face unexpected costs long after goods have been sold.

For example, an importer who entered goods with a 50% cash deposit rate might later receive a bill for an additional 30% if the administrative review establishes a new rate of 80%. Conversely, the rate could decrease, resulting in a refund.

Importers should maintain cash reserves for potential retroactive duty bills, monitor review schedules for products they import, and consider working with exporters who actively participate in reviews to ensure fair rate calculations. Some importers negotiate contracts that pass retroactive duty risk to foreign suppliers.`,
    },
    {
      question: "What are the compliance requirements for importing goods subject to AD duties?",
      answer: `Importing goods subject to anti-dumping duties requires careful attention to compliance procedures to avoid penalties, delays, and potential legal issues. The specific requirements vary by jurisdiction but share common elements.

First and foremost, importers must properly classify goods under the applicable tariff schedule and identify whether products fall within the scope of existing AD orders. This requires comparing product specifications against order descriptions, which can be technically complex. Misclassification, whether intentional or accidental, can result in penalties including fines up to four times the underpaid duties and potential criminal prosecution.

At entry, importers must report AD/CVD liability and post cash deposits at the applicable rate. The entry documentation must identify the correct case number and rate. For US imports, this involves the ACE system and specific CBP forms. European imports require similar declarations through national customs authorities.

Record-keeping is critical. Importers must maintain documentation including commercial invoices, certificates of origin, bills of lading, entry summaries, and correspondence with customs authorities. These records must be retained for five years (US) or as required by local law.

Importers must also monitor for scope rulings that may add or remove products from coverage, administrative reviews that change rates, and sunset reviews that could revoke or continue orders. Many companies engage customs brokers and trade counsel specifically to track these developments.

Special procedures apply when claiming individual exporter rates, requesting scope exclusions, or participating in exemption programs. Each requires specific documentation and deadlines that must be strictly observed.`,
    },
    {
      question: "Can anti-dumping duties be avoided legally?",
      answer: `While outright evasion of anti-dumping duties through misrepresentation or transshipment is illegal and subject to severe penalties, there are legitimate strategies importers can employ to minimize or eliminate AD duty liability.

The most straightforward approach is sourcing from countries without AD measures on the product. If equivalent products are available from non-subject countries, total landed cost may be lower even if base prices are higher, due to the absence of AD duties. However, importers must ensure goods genuinely originate in the claimed country, not merely transshipped to circumvent duties.

Another strategy involves working with exporters who have individual rates significantly lower than country-wide rates. The New Exporter Review process allows qualified suppliers to obtain individual rates based on their actual pricing practices. Some Chinese exporters have obtained rates near zero through this process.

Scope exclusions may be available for products that differ technically from those covered by the order. If your product has different specifications, uses, or characteristics, you may qualify for exclusion. This requires a formal scope ruling request with detailed product documentation.

Some jurisdictions offer duty deferral programs through bonded warehouses or foreign trade zones, allowing duties to be postponed until goods enter domestic commerce. This doesn't eliminate duties but improves cash flow.

Finally, engage in the policy process. Importers can participate in sunset reviews arguing for revocation, submit comments on scope issues, or support domestic industry development that reduces the rationale for protection. These strategies require long-term commitment but can lead to permanent duty elimination.

All strategies should be implemented with guidance from trade compliance professionals to ensure they remain within legal boundaries.`,
    },
  ];

  // Educational Content
  const educationalContent = {
    whatIsAd: {
      title: "What are Anti-Dumping Duties?",
      content: `Anti-dumping duties are protectionist tariffs imposed by domestic governments on foreign imports believed to be priced below fair market value. Under World Trade Organization (WTO) rules, member countries may impose these duties when domestic industries demonstrate material injury from dumped imports.

The practice of "dumping" occurs when exporters sell products in foreign markets at prices lower than in their home market or below cost of production. This can harm domestic producers who cannot compete with artificially low prices, potentially leading to job losses and industry decline.

Anti-dumping measures serve to "level the playing field" by imposing additional duties equal to the calculated dumping margin. For example, if an investigation determines that a product is being sold at 50% below fair value, a 50% AD duty may be imposed.

These measures have become increasingly common in global trade. The United States, European Union, India, and Australia are among the most active users of anti-dumping measures. Products frequently subject to AD duties include steel, aluminum, chemicals, and solar panels.

For importers and supply chain professionals, understanding AD duties is essential for accurate cost planning, sourcing decisions, and compliance. Failure to account for these duties can result in significant unexpected costs and regulatory issues.`,
    },
    howCalculated: {
      title: "How are Anti-Dumping Duties Calculated?",
      content: `The calculation of anti-dumping duties follows a structured methodology established by WTO agreements and implemented through national legislation. Understanding this process helps importers anticipate potential duty rates and plan accordingly.

The fundamental calculation compares the "normal value" against the "export price." Normal value typically represents the price at which the product is sold in the exporter's home market. When home market sales are insufficient or unreliable, authorities may use third-country prices or "constructed value" based on production costs plus reasonable profit margins.

The dumping margin formula is straightforward: (Normal Value - Export Price) / Export Price × 100. This percentage becomes the AD duty rate.

Investigations involve extensive data collection from exporters, including detailed cost accounting, sales records, and pricing information. Exporters who cooperate fully may receive individual rates reflecting their actual pricing practices. Non-cooperating exporters receive adverse rates based on "facts available," often the highest rates calculated from cooperating parties.

For example, during a US investigation of Chinese steel products, cooperating exporters received individual rates ranging from 32% to 180%, while the "all-others" rate for non-cooperators was set at 248%.

Importers should understand that rates can change through administrative reviews. Annual reviews examine actual transaction data and may result in retroactive adjustments, creating both refund opportunities and additional liability risks.`,
    },
    investigationProcess: {
      title: "The Anti-Dumping Investigation Process",
      content: `The anti-dumping investigation process is a formal legal proceeding that determines whether dumping has occurred and whether domestic industry has suffered material injury. Understanding this timeline helps importers anticipate when duties may apply.

The process typically begins with a petition filed by domestic producers alleging dumping and injury. The investigating authority (such as the US Department of Commerce or European Commission) reviews the petition for sufficiency and, if adequate, initiates an investigation within 20-45 days.

Following initiation, questionnaires are sent to foreign producers and exporters requesting detailed sales and cost data. The investigation period usually covers the most recent 6-12 months of transactions. Simultaneously, the injury determination authority (US ITC or equivalent) examines whether domestic producers have suffered material injury due to imports.

Preliminary determinations are issued within 45-160 days, depending on jurisdiction. If affirmative, provisional duties may apply to entries from that point. Final determinations follow within additional months, considering verified data and submitted arguments.

If both dumping and injury are affirmatively determined, an anti-dumping order is issued, requiring cash deposits on entries. The order remains in effect for at least five years, subject to administrative and sunset reviews.

For importers, understanding this timeline is crucial. Goods entering before provisional measures are not subject to duties, while entries after that date may require cash deposits. Strategic timing of shipments can significantly impact costs during active investigations.`,
    },
    impactOnImporters: {
      title: "Impact of Anti-Dumping Duties on Importers",
      content: `Anti-dumping duties have profound implications for importers, affecting landed costs, sourcing strategies, cash flow, and compliance obligations. Understanding these impacts is essential for effective supply chain management.

The most direct impact is cost. AD duties can add 50% to over 400% to the cost of imported goods. For products already subject to normal customs duties and potentially Section 301 or 232 tariffs, total duty burden can exceed 300% of the product value. This fundamentally changes cost-benefit analyses for sourcing decisions.

Cash flow implications are significant. Unlike most customs duties paid at entry finalization, AD duties require cash deposits at the time of entry. These deposits may be adjusted years later through administrative reviews, creating uncertainty and potential liability. Importers must maintain reserves for retroactive duty bills.

Compliance requirements add administrative burden. Importers must accurately classify goods, verify scope coverage, document transactions thoroughly, and file specialized customs entries. Errors can result in penalties, delays, and even criminal prosecution for intentional violations.

Sourcing flexibility is constrained. Products from countries with AD measures become less competitive, potentially requiring supply chain restructuring. However, circumvention through transshipment is illegal and actively prosecuted, limiting options for cost avoidance.

Despite these challenges, importers can manage AD impacts through strategies including: working with exporters who have individual lower rates, applying for scope exclusions where products differ, utilizing duty deferral programs, and participating in review proceedings to advocate for rate reductions.`,
    },
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5">
        <CardContent className="pt-8 pb-6">
          <div className="text-center space-y-4">
            {/* Animated Badges */}
            <div className="flex flex-wrap justify-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  Trade Compliance
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Badge className="bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white px-3 py-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Anti-Dumping
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1">
                  <Calculator className="h-3 w-3 mr-1" />
                  Duty Calculator
                </Badge>
              </motion.div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-[#0F4C81] dark:text-[#5B9BD5] flex items-center justify-center gap-3">
                <Shield className="h-8 w-8" />
                Anti-Dumping Duty Checker
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Check anti-dumping and countervailing duties by product, origin country, and destination market. 
                Calculate duty impact and understand compliance requirements.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={matchingDuties.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleShare}
                disabled={matchingDuties.length === 0}
                className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs - 5 Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Comparison
          </TabsTrigger>
          <TabsTrigger value="reference" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Reference
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="pt-6 space-y-6">
          {/* Input Section */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Search className="h-5 w-5" />
                Anti-Dumping Duty Lookup
              </CardTitle>
              <CardDescription>
                Check anti-dumping and countervailing duties by product, origin country, and destination market
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Product Category */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#2E8B57]" />
                    Product Category
                  </Label>
                  <Select value={productCategory} onValueChange={setProductCategory}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((cat) => (
                        <SelectItem key={cat.code} value={cat.code}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* HS Code */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#2E8B57]" />
                    HS Code (Optional)
                  </Label>
                  <Input
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="e.g., 7208 or 8541.40"
                    className="h-11"
                  />
                </div>

                {/* Origin Country */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-[#2E8B57]" />
                    Origin Country
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

                {/* Destination Market */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#0F4C81]" />
                    Destination Market
                  </Label>
                  <Select value={destinationMarket} onValueChange={setDestinationMarket}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {destinationMarkets.map((market) => (
                        <SelectItem key={market.code} value={market.code}>
                          {market.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Product Value */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                    Product Value (USD)
                  </Label>
                  <Input
                    type="number"
                    value={productValue}
                    onChange={(e) => setProductValue(e.target.value)}
                    placeholder="100,000"
                    className="h-11"
                  />
                </div>

                {/* Quick Search */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Quick Search</Label>
                  <div className="flex gap-2">
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search product name or HS code..."
                      className="h-11"
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 h-11"
                    >
                      {isSearching ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {matchingDuties.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">AD Measures</span>
                    </div>
                    <p className="text-2xl font-bold">{matchingDuties.length}</p>
                    <p className="text-sm opacity-80 mt-1">Found for this route</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Percent className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Highest Rate</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {Math.max(...matchingDuties.map((d) => d.dutyRate)).toFixed(2)}%
                    </p>
                    <p className="text-sm opacity-80 mt-1">AD/CVD duty</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Duty Impact</span>
                    </div>
                    <p className="text-2xl font-bold">
                      {dutyImpact ? formatCurrency(dutyImpact.adDutyAmount) : "N/A"}
                    </p>
                    <p className="text-sm opacity-80 mt-1">On {formatCurrency(parseFloat(productValue) || 100000)}</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <AlertCircle className="h-6 w-6 opacity-80" />
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">Status</span>
                    </div>
                    <p className="text-xl font-bold">{matchingDuties[0].status.replace("_", " ")}</p>
                    <p className="text-sm opacity-80 mt-1">
                      Until {matchingDuties[0].expiryDate || "TBD"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Results */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <FileText className="h-5 w-5" />
                    Matching Anti-Dumping Measures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {matchingDuties.map((duty, index) => (
                      <motion.div
                        key={duty.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                      >
                        {/* Header */}
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-lg">{duty.productName}</h4>
                            <p className="text-sm text-muted-foreground">
                              HS Code: {duty.hsCode} | {duty.productCategory}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              style={{ backgroundColor: statusColors[duty.status] }}
                              className="text-white"
                            >
                              {statusLabels[duty.status]}
                            </Badge>
                            <Badge
                              style={{ backgroundColor: dutyTypeColors[duty.dutyType] }}
                              className="text-white"
                            >
                              {duty.dutyType === "ad" ? "AD Duty" : duty.dutyType === "cvd" ? "CVD" : "AD + CVD"}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <p className="text-sm text-muted-foreground">Duty Rate</p>
                              <p className="text-2xl font-bold text-[#0F4C81]">{duty.dutyRate}%</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <p className="text-sm text-muted-foreground">Effective Date</p>
                              <p className="font-semibold">{duty.effectiveDate}</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <p className="text-sm text-muted-foreground">Expiry Date</p>
                              <p className="font-semibold">{duty.expiryDate || "TBD"}</p>
                            </div>
                            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <p className="text-sm text-muted-foreground">Investigation #</p>
                              <p className="font-semibold text-sm">{duty.investigationNumber}</p>
                            </div>
                          </div>

                          {/* Exporter Specific Rates */}
                          {duty.exporterSpecificRates.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium mb-2 flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-[#2E8B57]" />
                                Exporter-Specific Rates
                              </h5>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b dark:border-slate-700">
                                      <th className="text-left py-2 px-3">Exporter</th>
                                      <th className="text-right py-2 px-3">Rate</th>
                                      <th className="text-left py-2 px-3">Notes</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {duty.exporterSpecificRates.map((exp, idx) => (
                                      <tr key={idx} className="border-b dark:border-slate-700/50">
                                        <td className="py-2 px-3">{exp.exporter}</td>
                                        <td className="text-right py-2 px-3 font-medium">{exp.rate}%</td>
                                        <td className="py-2 px-3 text-muted-foreground">{exp.notes}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-start gap-2">
                              <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                              <p className="text-sm text-amber-700 dark:text-amber-300">{duty.notes}</p>
                            </div>
                          </div>

                          {/* Exemption Badge */}
                          {duty.exemptionAvailable && (
                            <div className="mt-4 flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-[#2E8B57]" />
                              <span className="text-sm text-[#2E8B57] font-medium">
                                Exemption Available: {duty.exemptionType}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Anti-Dumping Measures Found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    No anti-dumping or countervailing duties were found for the selected combination.
                    This may indicate that standard MFN duty rates apply, or the product is not subject to AD measures.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="pt-6 space-y-6">
          {matchingDuties.length > 0 && dutyImpact ? (
            <>
              {/* Duty Breakdown Pie Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                      <PieChartIcon className="h-5 w-5" />
                      Duty Cost Breakdown
                    </CardTitle>
                    <CardDescription>Visual breakdown of total landed cost</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                          <Pie
                            data={dutyBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          >
                            {dutyBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                          />
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      {dutyBreakdownData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Historical Duty Trends */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                      <History className="h-5 w-5" />
                      Historical Duty Rates
                    </CardTitle>
                    <CardDescription>Duty rate changes over time for {matchingDuties[0]?.productName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={historicalChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis tickFormatter={(v) => `${v}%`} />
                          <Tooltip
                            formatter={(value: number) => [`${value.toFixed(2)}%`, "Duty Rate"]}
                            labelFormatter={(label) => `Year: ${label}`}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="rate"
                            stroke={OCEAN_BLUE}
                            strokeWidth={3}
                            dot={{ fill: OCEAN_BLUE, strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8 }}
                            name="AD Duty Rate"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Analysis Cards */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <DollarSign className="h-5 w-5" />
                    Detailed Cost Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Product Value</p>
                      <p className="text-3xl font-bold text-[#0F4C81]">{formatCurrency(dutyImpact.productValue)}</p>
                      <p className="text-sm text-muted-foreground mt-2">Base customs value</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">AD/CVD Duty</p>
                      <p className="text-3xl font-bold text-amber-600">{formatCurrency(dutyImpact.adDutyAmount)}</p>
                      <p className="text-sm text-muted-foreground mt-2">At {dutyImpact.adDutyRate.toFixed(2)}% rate</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5 rounded-lg border-2 border-[#0F4C81]/20">
                      <p className="text-sm text-muted-foreground mb-2">Total Landed Cost</p>
                      <p className="text-3xl font-bold text-[#2E8B57]">{formatCurrency(dutyImpact.totalWithDuty)}</p>
                      <p className="text-sm text-muted-foreground mt-2">Including AD duties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Data for Analysis</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Select a product combination in the Calculator tab to view duty analysis and visualizations.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Comparison */}
        <TabsContent value="comparison" className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country Comparison */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Flag className="h-5 w-5" />
                  Average AD Duty by Origin Country
                </CardTitle>
                <CardDescription>Comparing anti-dumping duty rates across countries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => `${v.toFixed(0)}%`} />
                      <YAxis dataKey="country" type="category" width={80} />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(2)}%`, "Avg AD Rate"]}
                        labelFormatter={(label) => `Country: ${label}`}
                      />
                      <Bar dataKey="avgRate" radius={[0, 4, 4, 0]}>
                        {countryComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Market Comparison */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Globe className="h-5 w-5" />
                  Average AD Duty by Destination Market
                </CardTitle>
                <CardDescription>Comparing duty rates imposed by different markets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(v) => `${v.toFixed(0)}%`} />
                      <YAxis dataKey="market" type="category" width={100} />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(2)}%`, "Avg AD Rate"]}
                        labelFormatter={(label) => `Market: ${label}`}
                      />
                      <Bar dataKey="avgRate" radius={[0, 4, 4, 0]}>
                        {marketComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? OCEAN_BLUE : LOGISTICS_GREEN} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Comparison */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <BarChart3 className="h-5 w-5" />
                AD Duty Comparison by Product Category
              </CardTitle>
              <CardDescription>Highest duty rates for each product category in our database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={productCategories.map((cat) => {
                      const matchingProducts = antiDumpingDuties.filter(
                        (d) => d.productCategory.toLowerCase().includes(cat.code)
                      );
                      const highestRate = matchingProducts.length > 0
                        ? Math.max(...matchingProducts.map((d) => d.dutyRate))
                        : 0;
                      return {
                        name: cat.name.split(" ")[0],
                        highestRate,
                        measureCount: matchingProducts.length,
                      };
                    }).filter((d) => d.measureCount > 0)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" tickFormatter={(v) => `${v}%`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "highestRate" ? `${value.toFixed(2)}%` : value,
                        name === "highestRate" ? "Highest Rate" : "# Measures"
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="highestRate" fill={OCEAN_BLUE} name="Highest Rate" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="measureCount" stroke={LOGISTICS_GREEN} strokeWidth={2} name="# Measures" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Duty Rates Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Reference: AD Duty Rates by Market</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-slate-700">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Origin</th>
                      <th className="text-left py-3 px-4">Market</th>
                      <th className="text-right py-3 px-4">Duty Rate</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {antiDumpingDuties.slice(0, 8).map((duty) => (
                      <tr key={duty.id} className="border-b dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4">{duty.productName}</td>
                        <td className="py-3 px-4">{countries.find((c) => c.code === duty.originCountry)?.name || duty.originCountry}</td>
                        <td className="py-3 px-4">{destinationMarkets.find((m) => m.code === duty.destinationMarket)?.name || duty.destinationMarket}</td>
                        <td className="text-right py-3 px-4 font-semibold text-[#0F4C81]">{duty.dutyRate}%</td>
                        <td className="py-3 px-4">
                          <Badge style={{ backgroundColor: dutyTypeColors[duty.dutyType] }} className="text-white text-xs">
                            {duty.dutyType.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge style={{ backgroundColor: statusColors[duty.status] }} className="text-white text-xs">
                            {statusLabels[duty.status]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Reference */}
        <TabsContent value="reference" className="pt-6 space-y-6">
          {/* Educational Content */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <BookOpen className="h-5 w-5" />
                Understanding Anti-Dumping Duties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-ad">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-[#0F4C81]" />
                      {educationalContent.whatIsAd.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {educationalContent.whatIsAd.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-calculated">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-[#0F4C81]" />
                      {educationalContent.howCalculated.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {educationalContent.howCalculated.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="investigation-process">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-[#0F4C81]" />
                      {educationalContent.investigationProcess.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {educationalContent.investigationProcess.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="impact">
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-[#0F4C81]" />
                      {educationalContent.impactOnImporters.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {educationalContent.impactOnImporters.content}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                <Lightbulb className="h-5 w-5" />
                Pro Tips & Best Practices
              </CardTitle>
              <CardDescription>Actionable tips for managing anti-dumping duties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-[#2E8B57] rounded-lg text-white">
                        {tip.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#2E8B57]">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertOctagon className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Critical errors that can result in penalties and compliance issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500 rounded-lg text-white">
                        {mistake.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Authority References */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Official Resources</CardTitle>
              <CardDescription>Government authorities responsible for anti-dumping measures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {destinationMarkets.map((market) => (
                  <div
                    key={market.code}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-[#0F4C81] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Flag className="h-5 w-5 text-[#0F4C81]" />
                      <h4 className="font-semibold">{market.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{market.authority}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="pt-6 space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Comprehensive answers to common questions about anti-dumping duties</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border border-slate-200 dark:border-slate-700 rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="flex items-center gap-2 text-left">
                        <Badge className="bg-[#0F4C81] text-white">{index + 1}</Badge>
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pt-2">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Calculation</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Copy this link to share your anti-dumping duty calculation with others.
              </p>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}${window.location.pathname}?cat=${productCategory}&hs=${hsCode}&origin=${originCountry}&dest=${destinationMarket}&value=${productValue}`}
                  className="flex-1"
                />
                <Button onClick={copyShareLink} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && (
                <p className="text-sm text-[#2E8B57] mt-2 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Link copied to clipboard!
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
