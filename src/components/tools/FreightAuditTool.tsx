"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Copy,
  Search,
  Shield,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Download,
  Filter,
  Eye,
  ChevronDown,
  ChevronUp,
  Package,
  Ship,
  Truck,
  Plane,
  Calculator,
  Target,
  Clock,
  FileWarning,
  BadgeCheck,
  Layers,
  ArrowRight,
  Info,
  Zap,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Legend,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";

// Types
interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  carrier: string;
  origin: string;
  destination: string;
  mode: "sea" | "air" | "road" | "rail";
  shipmentDate: string;
  containerType: string;
  chargeableWeight: number;
  baseRate: number;
  baseRateBilled: number;
  surcharges: Surcharge[];
  totalBilled: number;
  contractRate: number;
  marketRate: number;
  currency: string;
  status: "pending" | "verified" | "discrepancy" | "duplicate" | "approved";
  issues: Issue[];
  potentialSavings: number;
  route: string;
}

interface Surcharge {
  name: string;
  code: string;
  billedAmount: number;
  expectedAmount: number;
  isValid: boolean;
  category: "fuel" | "security" | "handling" | "documentation" | "accessorial" | "other";
  notes: string;
}

interface Issue {
  type: "rate" | "surcharge" | "duplicate" | "calculation" | "missing" | "invalid";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  amount: number;
  recommendation: string;
}

interface AuditResult {
  overallScore: number;
  scoreGrade: "A" | "B" | "C" | "D" | "F";
  totalInvoices: number;
  totalBilled: number;
  totalExpected: number;
  totalSavings: number;
  savingsPercentage: number;
  rateAccuracy: number;
  surchargeAccuracy: number;
  duplicateCount: number;
  duplicateAmount: number;
  issuesBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  issuesByType: {
    rate: number;
    surcharge: number;
    duplicate: number;
    calculation: number;
    missing: number;
    invalid: number;
  };
  carrierPerformance: CarrierPerformance[];
  monthlyTrend: MonthlyData[];
  savingsByCategory: SavingsCategory[];
}

interface CarrierPerformance {
  carrier: string;
  invoiceCount: number;
  totalBilled: number;
  accuracy: number;
  savings: number;
  issueCount: number;
}

interface MonthlyData {
  month: string;
  billed: number;
  expected: number;
  savings: number;
}

interface SavingsCategory {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

// Sample data generators
const carriers = [
  { name: "Maersk Line", code: "MAEU", contractRates: { "20GP": 1850, "40GP": 2450, "40HC": 2650 } },
  { name: "MSC", code: "MSCU", contractRates: { "20GP": 1780, "40GP": 2380, "40HC": 2580 } },
  { name: "CMA CGM", code: "CMAU", contractRates: { "20GP": 1920, "40GP": 2520, "40HC": 2720 } },
  { name: "COSCO", code: "COSU", contractRates: { "20GP": 1750, "40GP": 2350, "40HC": 2550 } },
  { name: "Hapag-Lloyd", code: "HLCU", contractRates: { "20GP": 1890, "40GP": 2490, "40HC": 2690 } },
  { name: "ONE Line", code: "OOLU", contractRates: { "20GP": 1820, "40GP": 2420, "40HC": 2620 } },
  { name: "Evergreen", code: "EGSU", contractRates: { "20GP": 1760, "40GP": 2360, "40HC": 2560 } },
  { name: "Yang Ming", code: "YMLU", contractRates: { "20GP": 1720, "40GP": 2320, "40HC": 2520 } },
];

const routes = [
  { origin: "CNSHA", destination: "USLAX", name: "Shanghai - Los Angeles" },
  { origin: "CNSHA", destination: "USNYC", name: "Shanghai - New York" },
  { origin: "CNYTN", destination: "EUROT", name: "Yantian - Rotterdam" },
  { origin: "SGSIN", destination: "USLAX", name: "Singapore - Los Angeles" },
  { origin: "HKHKG", destination: "EUHMB", name: "Hong Kong - Hamburg" },
  { origin: "KRPUS", destination: "USLGB", name: "Busan - Long Beach" },
  { origin: "INNSA", destination: "GBFXT", name: "Nhava Sheva - Felixstowe" },
  { origin: "MYPKG", destination: "USNYC", name: "Port Klang - New York" },
];

const surchargeTypes = [
  { name: "BAF (Bunker Adjustment Factor)", code: "BAF", category: "fuel", typicalRange: [150, 450] },
  { name: "CAF (Currency Adjustment Factor)", code: "CAF", category: "fuel", typicalRange: [50, 200] },
  { name: "THC (Terminal Handling Charge)", code: "THC", category: "handling", typicalRange: [100, 350] },
  { name: "Documentation Fee", code: "DOC", category: "documentation", typicalRange: [50, 150] },
  { name: "Security Surcharge", code: "SEC", category: "security", typicalRange: [25, 75] },
  { name: "ISPS Security", code: "ISPS", category: "security", typicalRange: [30, 80] },
  { name: "Chassis Fee", code: "CHS", category: "accessorial", typicalRange: [50, 150] },
  { name: "Demurrage", code: "DEM", category: "accessorial", typicalRange: [100, 500] },
  { name: "Detention", code: "DET", category: "accessorial", typicalRange: [75, 300] },
  { name: "Seal Fee", code: "SEAL", category: "documentation", typicalRange: [10, 35] },
];

const COLORS = {
  primary: "#0F4C81",
  secondary: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  critical: "#7F1D1D",
  success: "#22C55E",
};

const MODE_ICONS = {
  sea: Ship,
  air: Plane,
  road: Truck,
  rail: Truck,
};

// Generate sample invoices
const generateSampleInvoices = (count: number): InvoiceItem[] => {
  const invoices: InvoiceItem[] = [];
  
  for (let i = 0; i < count; i++) {
    const carrier = carriers[Math.floor(Math.random() * carriers.length)];
    const route = routes[Math.floor(Math.random() * routes.length)];
    const containerType = Math.random() > 0.6 ? "40HC" : Math.random() > 0.3 ? "40GP" : "20GP";
    const contractRate = carrier.contractRates[containerType as keyof typeof carrier.contractRates] || 2000;
    
    // Random discrepancies
    const rateDiscrepancy = Math.random() > 0.7 ? (Math.random() * 0.15 + 0.05) : 0;
    const baseRateBilled = contractRate * (1 + rateDiscrepancy);
    
    // Generate surcharges
    const surchargeCount = Math.floor(Math.random() * 4) + 3;
    const selectedSurcharges = surchargeTypes.sort(() => Math.random() - 0.5).slice(0, surchargeCount);
    const surcharges: Surcharge[] = selectedSurcharges.map(s => {
      const expectedAmount = s.typicalRange[0] + Math.random() * (s.typicalRange[1] - s.typicalRange[0]);
      const hasIssue = Math.random() > 0.75;
      const billedAmount = hasIssue ? expectedAmount * (1 + Math.random() * 0.3) : expectedAmount;
      return {
        name: s.name,
        code: s.code,
        billedAmount: Math.round(billedAmount * 100) / 100,
        expectedAmount: Math.round(expectedAmount * 100) / 100,
        isValid: !hasIssue,
        category: s.category as Surcharge["category"],
        notes: hasIssue ? "Amount exceeds typical range" : "",
      };
    });
    
    const totalBilled = baseRateBilled + surcharges.reduce((sum, s) => sum + s.billedAmount, 0);
    const totalExpected = contractRate + surcharges.reduce((sum, s) => sum + s.expectedAmount, 0);
    
    const issues: Issue[] = [];
    if (rateDiscrepancy > 0) {
      issues.push({
        type: "rate",
        severity: rateDiscrepancy > 0.12 ? "high" : rateDiscrepancy > 0.08 ? "medium" : "low",
        description: `Base rate exceeds contract by ${(rateDiscrepancy * 100).toFixed(1)}%`,
        amount: baseRateBilled - contractRate,
        recommendation: "Verify contract terms and request rate adjustment",
      });
    }
    
    surcharges.forEach(s => {
      if (!s.isValid) {
        const overcharge = s.billedAmount - s.expectedAmount;
        issues.push({
          type: "surcharge",
          severity: overcharge > 100 ? "high" : overcharge > 50 ? "medium" : "low",
          description: `${s.name} exceeds expected amount by $${overcharge.toFixed(2)}`,
          amount: overcharge,
          recommendation: "Request surcharge breakdown and justification",
        });
      }
    });
    
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(i + 1001).padStart(5, "0")}`;
    
    invoices.push({
      id: `inv-${i}`,
      invoiceNumber,
      carrier: carrier.name,
      origin: route.origin,
      destination: route.destination,
      mode: "sea",
      shipmentDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      containerType,
      chargeableWeight: Math.floor(Math.random() * 20000) + 5000,
      baseRate: contractRate,
      baseRateBilled: Math.round(baseRateBilled * 100) / 100,
      surcharges,
      totalBilled: Math.round(totalBilled * 100) / 100,
      contractRate,
      marketRate: contractRate * (0.9 + Math.random() * 0.3),
      currency: "USD",
      status: issues.length > 0 ? "discrepancy" : "verified",
      issues,
      potentialSavings: Math.round((totalBilled - totalExpected) * 100) / 100,
      route: route.name,
    });
  }
  
  // Add some duplicates
  if (count >= 10) {
    const duplicateIndex = Math.floor(Math.random() * (count / 2));
    invoices.push({
      ...invoices[duplicateIndex],
      id: `inv-${count}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(count + 1001).padStart(5, "0")}`,
      status: "duplicate",
      issues: [
        ...invoices[duplicateIndex].issues,
        {
          type: "duplicate",
          severity: "critical",
          description: `Potential duplicate of invoice ${invoices[duplicateIndex].invoiceNumber}`,
          amount: invoices[duplicateIndex].totalBilled,
          recommendation: "Verify shipment and payment records before processing",
        },
      ],
    });
  }
  
  return invoices;
};

export default function FreightAuditTool() {
  // State
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCarrier, setFilterCarrier] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  
  // Upload simulation state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [invoiceCount, setInvoiceCount] = useState(15);
  
  // Process invoices and calculate audit result
  const processedResult = useMemo(() => {
    if (invoices.length === 0) return null;
    
    const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalBilled, 0);
    const totalExpected = invoices.reduce((sum, inv) => {
      const expectedSurcharges = inv.surcharges.reduce((s, sur) => s + sur.expectedAmount, 0);
      return sum + inv.contractRate + expectedSurcharges;
    }, 0);
    const totalSavings = totalBilled - totalExpected;
    
    // Rate accuracy
    const rateAccurateInvoices = invoices.filter(inv => 
      Math.abs(inv.baseRateBilled - inv.contractRate) / inv.contractRate < 0.03
    ).length;
    const rateAccuracy = (rateAccurateInvoices / invoices.length) * 100;
    
    // Surcharge accuracy
    let totalSurchargesBilled = 0;
    let totalValidSurcharges = 0;
    invoices.forEach(inv => {
      inv.surcharges.forEach(s => {
        totalSurchargesBilled++;
        if (s.isValid) totalValidSurcharges++;
      });
    });
    const surchargeAccuracy = totalSurchargesBilled > 0 
      ? (totalValidSurcharges / totalSurchargesBilled) * 100 
      : 100;
    
    // Duplicates
    const duplicates = invoices.filter(inv => inv.status === "duplicate");
    const duplicateAmount = duplicates.reduce((sum, inv) => sum + inv.totalBilled, 0);
    
    // Issues by severity
    const allIssues = invoices.flatMap(inv => inv.issues);
    const issuesBySeverity = {
      critical: allIssues.filter(i => i.severity === "critical").length,
      high: allIssues.filter(i => i.severity === "high").length,
      medium: allIssues.filter(i => i.severity === "medium").length,
      low: allIssues.filter(i => i.severity === "low").length,
    };
    
    // Issues by type
    const issuesByType = {
      rate: allIssues.filter(i => i.type === "rate").length,
      surcharge: allIssues.filter(i => i.type === "surcharge").length,
      duplicate: allIssues.filter(i => i.type === "duplicate").length,
      calculation: allIssues.filter(i => i.type === "calculation").length,
      missing: allIssues.filter(i => i.type === "missing").length,
      invalid: allIssues.filter(i => i.type === "invalid").length,
    };
    
    // Carrier performance
    const carrierMap = new Map<string, CarrierPerformance>();
    invoices.forEach(inv => {
      const existing = carrierMap.get(inv.carrier) || {
        carrier: inv.carrier,
        invoiceCount: 0,
        totalBilled: 0,
        accuracy: 0,
        savings: 0,
        issueCount: 0,
      };
      existing.invoiceCount++;
      existing.totalBilled += inv.totalBilled;
      existing.savings += inv.potentialSavings;
      existing.issueCount += inv.issues.length;
      carrierMap.set(inv.carrier, existing);
    });
    
    const carrierPerformance = Array.from(carrierMap.values()).map(c => ({
      ...c,
      accuracy: Math.max(0, 100 - (c.issueCount / c.invoiceCount) * 20),
    }));
    
    // Monthly trend
    const monthlyData: MonthlyData[] = [
      { month: "Jan", billed: 45000, expected: 42500, savings: 2500 },
      { month: "Feb", billed: 52000, expected: 48000, savings: 4000 },
      { month: "Mar", billed: 48000, expected: 46000, savings: 2000 },
      { month: "Apr", billed: 55000, expected: 52000, savings: 3000 },
      { month: "May", billed: 61000, expected: 57000, savings: 4000 },
      { month: "Jun", billed: totalBilled / 6, expected: totalExpected / 6, savings: totalSavings / 6 },
    ];
    
    // Savings by category
    const savingsByCategory: SavingsCategory[] = [
      {
        category: "Rate Overcharges",
        amount: allIssues.filter(i => i.type === "rate").reduce((s, i) => s + i.amount, 0),
        count: allIssues.filter(i => i.type === "rate").length,
        percentage: 0,
      },
      {
        category: "Surcharge Errors",
        amount: allIssues.filter(i => i.type === "surcharge").reduce((s, i) => s + i.amount, 0),
        count: allIssues.filter(i => i.type === "surcharge").length,
        percentage: 0,
      },
      {
        category: "Duplicates",
        amount: duplicateAmount,
        count: duplicates.length,
        percentage: 0,
      },
      {
        category: "Calculation Errors",
        amount: allIssues.filter(i => i.type === "calculation").reduce((s, i) => s + i.amount, 0),
        count: allIssues.filter(i => i.type === "calculation").length,
        percentage: 0,
      },
    ];
    
    const totalSavingsAmount = savingsByCategory.reduce((s, c) => s + c.amount, 0);
    savingsByCategory.forEach(c => {
      c.percentage = totalSavingsAmount > 0 ? (c.amount / totalSavingsAmount) * 100 : 0;
    });
    
    // Calculate overall score
    const score = Math.max(0, Math.min(100,
      100 
      - (issuesBySeverity.critical * 15)
      - (issuesBySeverity.high * 8)
      - (issuesBySeverity.medium * 3)
      - (issuesBySeverity.low * 1)
      - ((100 - rateAccuracy) * 0.3)
      - ((100 - surchargeAccuracy) * 0.2)
    ));
    
    let scoreGrade: "A" | "B" | "C" | "D" | "F";
    if (score >= 90) scoreGrade = "A";
    else if (score >= 80) scoreGrade = "B";
    else if (score >= 70) scoreGrade = "C";
    else if (score >= 60) scoreGrade = "D";
    else scoreGrade = "F";
    
    return {
      overallScore: Math.round(score),
      scoreGrade,
      totalInvoices: invoices.length,
      totalBilled,
      totalExpected,
      totalSavings,
      savingsPercentage: totalBilled > 0 ? (totalSavings / totalBilled) * 100 : 0,
      rateAccuracy,
      surchargeAccuracy,
      duplicateCount: duplicates.length,
      duplicateAmount,
      issuesBySeverity,
      issuesByType,
      carrierPerformance,
      monthlyTrend: monthlyData,
      savingsByCategory: savingsByCategory.filter(c => c.amount > 0),
    };
  }, [invoices]);
  
  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (filterStatus !== "all" && inv.status !== filterStatus) return false;
      if (filterCarrier !== "all" && inv.carrier !== filterCarrier) return false;
      if (searchTerm && !inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !inv.carrier.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !inv.route.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [invoices, filterStatus, filterCarrier, searchTerm]);
  
  // Simulate file upload
  const handleFileUpload = () => {
    setIsProcessing(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newInvoices = generateSampleInvoices(invoiceCount);
            setInvoices(newInvoices);
            setUploadedFiles(prev => [...prev, `freight_invoices_${new Date().toISOString().split('T')[0]}.csv`]);
            setIsProcessing(false);
            setActiveTab("results");
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Get status badge
  const getStatusBadge = (status: InvoiceItem["status"]) => {
    const config = {
      pending: { label: "Pending", color: "bg-slate-100 text-slate-700" },
      verified: { label: "Verified", color: "bg-green-100 text-green-700" },
      discrepancy: { label: "Discrepancy", color: "bg-amber-100 text-amber-700" },
      duplicate: { label: "Duplicate", color: "bg-red-100 text-red-700" },
      approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
    };
    const { label, color } = config[status];
    return <Badge className={color}>{label}</Badge>;
  };
  
  // Get severity color
  const getSeverityColor = (severity: Issue["severity"]) => {
    switch (severity) {
      case "critical": return COLORS.critical;
      case "high": return COLORS.danger;
      case "medium": return COLORS.warning;
      case "low": return COLORS.primary;
      default: return "#94a3b8";
    }
  };
  
  const scoreColor = processedResult 
    ? processedResult.overallScore >= 90 ? COLORS.success
    : processedResult.overallScore >= 80 ? COLORS.secondary
    : processedResult.overallScore >= 70 ? COLORS.warning
    : processedResult.overallScore >= 60 ? COLORS.primary
    : COLORS.danger
    : COLORS.primary;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Audit Score</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="reference" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Reference</span>
          </TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Upload className="h-5 w-5" />
                Invoice Upload
              </CardTitle>
              <CardDescription>
                Upload freight invoices for comprehensive audit analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-[#0F4C81] transition-colors cursor-pointer">
                <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drag and drop invoice files here</p>
                <p className="text-sm text-muted-foreground mb-4">Supports CSV, Excel, PDF formats</p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" onClick={() => document.getElementById("file-input")?.click()}>
                    Browse Files
                  </Button>
                  <Button onClick={handleFileUpload} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Simulate Upload
                      </>
                    )}
                  </Button>
                </div>
                <input id="file-input" type="file" className="hidden" accept=".csv,.xlsx,.pdf" />
              </div>
              
              {/* Upload Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing invoices...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
              
              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Number of Invoices to Simulate</Label>
                    <Input
                      type="number"
                      value={invoiceCount}
                      onChange={(e) => setInvoiceCount(parseInt(e.target.value) || 10)}
                      min={5}
                      max={100}
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Invoice Date Range</Label>
                    <Select defaultValue="90">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="60">Last 60 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                        <SelectItem value="180">Last 6 months</SelectItem>
                        <SelectItem value="365">Last 12 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Transport Mode</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="sea">Ocean Freight</SelectItem>
                        <SelectItem value="air">Air Freight</SelectItem>
                        <SelectItem value="road">Road Freight</SelectItem>
                        <SelectItem value="rail">Rail Freight</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-detect">Auto-detect Duplicates</Label>
                    <Switch id="auto-detect" defaultChecked />
                  </div>
                </div>
              </div>
              
              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <Label>Uploaded Files</Label>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <FileText className="h-5 w-5 text-[#0F4C81]" />
                        <span className="flex-1">{file}</span>
                        <CheckCircle className="h-5 w-5 text-[#2E8B57]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Stats */}
          {invoices.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto text-[#0F4C81] mb-2" />
                    <p className="text-2xl font-bold">{invoices.length}</p>
                    <p className="text-sm text-muted-foreground">Invoices Loaded</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 mx-auto text-[#2E8B57] mb-2" />
                    <p className="text-2xl font-bold">${processedResult?.totalBilled.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Billed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingDown className="h-8 w-8 mx-auto text-[#2E8B57] mb-2" />
                    <p className="text-2xl font-bold text-[#2E8B57]">${processedResult?.totalSavings.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                    <p className="text-2xl font-bold">{processedResult?.issuesBySeverity.high + processedResult?.issuesBySeverity.critical}</p>
                    <p className="text-sm text-muted-foreground">Critical Issues</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Results Tab - Audit Score */}
        <TabsContent value="results" className="space-y-6">
          {invoices.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <FileWarning className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <p className="text-lg font-medium mb-2">No Invoices Loaded</p>
                <p className="text-muted-foreground mb-4">Upload invoices to see audit results</p>
                <Button onClick={() => setActiveTab("upload")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Invoices
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overall Score Card */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#0F4C81] to-[#0F4C81]/80 text-white p-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div 
                        className="w-32 h-32 rounded-full flex items-center justify-center border-4"
                        style={{ borderColor: scoreColor, backgroundColor: `${scoreColor}20` }}
                      >
                        <div className="text-center">
                          <p className="text-4xl font-bold" style={{ color: scoreColor }}>
                            {processedResult?.overallScore}
                          </p>
                          <p className="text-lg font-semibold" style={{ color: scoreColor }}>
                            Grade: {processedResult?.scoreGrade}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Freight Audit Score</h2>
                        <p className="text-white/80">
                          Based on {processedResult?.totalInvoices} invoices analyzed
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Badge className="bg-white/20 text-white">
                            {processedResult?.rateAccuracy.toFixed(1)}% Rate Accuracy
                          </Badge>
                          <Badge className="bg-white/20 text-white">
                            {processedResult?.surchargeAccuracy.toFixed(1)}% Surcharge Accuracy
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-white/60">Potential Savings</p>
                      <p className="text-4xl font-bold text-[#2E8B57]">
                        ${processedResult?.totalSavings.toLocaleString()}
                      </p>
                      <p className="text-sm text-white/80">
                        ({processedResult?.savingsPercentage.toFixed(2)}% of total billed)
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Score Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Issues by Severity */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0F4C81]">Issues by Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Critical", count: processedResult?.issuesBySeverity.critical || 0, color: COLORS.critical },
                        { label: "High", count: processedResult?.issuesBySeverity.high || 0, color: COLORS.danger },
                        { label: "Medium", count: processedResult?.issuesBySeverity.medium || 0, color: COLORS.warning },
                        { label: "Low", count: processedResult?.issuesBySeverity.low || 0, color: COLORS.primary },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                          <span className="flex-1">{item.label}</span>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Critical", value: processedResult?.issuesBySeverity.critical || 0, fill: COLORS.critical },
                              { name: "High", value: processedResult?.issuesBySeverity.high || 0, fill: COLORS.danger },
                              { name: "Medium", value: processedResult?.issuesBySeverity.medium || 0, fill: COLORS.warning },
                              { name: "Low", value: processedResult?.issuesBySeverity.low || 0, fill: COLORS.primary },
                            ].filter(d => d.value > 0)}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                          >
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Issues by Type */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0F4C81]">Issues by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Rate", count: processedResult?.issuesByType.rate || 0, fill: COLORS.primary },
                            { name: "Surcharge", count: processedResult?.issuesByType.surcharge || 0, fill: COLORS.secondary },
                            { name: "Duplicate", count: processedResult?.issuesByType.duplicate || 0, fill: COLORS.danger },
                            { name: "Calc", count: processedResult?.issuesByType.calculation || 0, fill: COLORS.warning },
                          ].filter(d => d.count > 0)}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="name" width={80} />
                          <Tooltip />
                          <Bar dataKey="count" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Savings by Category */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0F4C81]">Savings Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {processedResult?.savingsByCategory.map((cat, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{cat.category}</span>
                            <span className="font-medium">${cat.amount.toFixed(2)}</span>
                          </div>
                          <Progress 
                            value={cat.percentage} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Carrier Performance */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0F4C81]">Carrier Performance</CardTitle>
                  <CardDescription>Invoice accuracy and savings potential by carrier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={processedResult?.carrierPerformance.slice(0, 6)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="carrier" angle={-45} textAnchor="end" height={80} />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="totalBilled" fill={COLORS.primary} name="Total Billed ($)" radius={[4, 4, 0, 0]} />
                        <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke={COLORS.secondary} strokeWidth={2} name="Accuracy %" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0F4C81]">Monthly Savings Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={processedResult?.monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="billed" fill={COLORS.primary} name="Billed ($)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expected" fill={COLORS.secondary} name="Expected ($)" radius={[4, 4, 0, 0]} />
                        <Line type="monotone" dataKey="savings" stroke={COLORS.danger} strokeWidth={2} name="Savings ($)" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          {invoices.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <FileWarning className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <p className="text-lg font-medium mb-2">No Invoices Loaded</p>
                <p className="text-muted-foreground mb-4">Upload invoices to view and analyze</p>
                <Button onClick={() => setActiveTab("upload")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Invoices
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Filters */}
              <Card className="border-0 shadow-lg">
                <CardContent className="py-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search invoices..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="discrepancy">Discrepancy</SelectItem>
                        <SelectItem value="duplicate">Duplicate</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCarrier} onValueChange={setFilterCarrier}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Carriers</SelectItem>
                        {carriers.map(c => (
                          <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Table */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0F4C81]">
                    Invoice Details ({filteredInvoices.length} of {invoices.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Carrier</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Billed</TableHead>
                          <TableHead className="text-right">Expected</TableHead>
                          <TableHead className="text-right">Savings</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvoices.map((invoice) => (
                          <TableRow 
                            key={invoice.id}
                            className={selectedInvoice?.id === invoice.id ? "bg-slate-100 dark:bg-slate-800" : ""}
                          >
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.carrier}</TableCell>
                            <TableCell>
                              <span className="text-sm">{invoice.route}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{invoice.containerType}</Badge>
                            </TableCell>
                            <TableCell className="text-right">${invoice.totalBilled.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              ${(invoice.contractRate + invoice.surcharges.reduce((s, sur) => s + sur.expectedAmount, 0)).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={invoice.potentialSavings > 0 ? "text-[#2E8B57] font-medium" : ""}>
                                ${invoice.potentialSavings.toFixed(2)}
                              </span>
                            </TableCell>
                            <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedInvoice(invoice)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Selected Invoice Detail */}
              <AnimatePresence>
                {selectedInvoice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-[#0F4C81]">
                            Invoice Detail: {selectedInvoice.invoiceNumber}
                          </CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(null)}>
                            Close
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Invoice Info */}
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
                              <h4 className="font-medium text-[#0F4C81]">Invoice Information</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Carrier:</span>
                                <span>{selectedInvoice.carrier}</span>
                                <span className="text-muted-foreground">Route:</span>
                                <span>{selectedInvoice.route}</span>
                                <span className="text-muted-foreground">Container:</span>
                                <span>{selectedInvoice.containerType}</span>
                                <span className="text-muted-foreground">Date:</span>
                                <span>{selectedInvoice.shipmentDate}</span>
                              </div>
                            </div>
                            
                            {/* Rate Comparison */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
                              <h4 className="font-medium text-[#0F4C81]">Rate Verification</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Contract Rate:</span>
                                  <span className="font-medium">${selectedInvoice.contractRate.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Billed Rate:</span>
                                  <span className={`font-medium ${selectedInvoice.baseRateBilled > selectedInvoice.contractRate ? "text-red-600" : "text-[#2E8B57]"}`}>
                                    ${selectedInvoice.baseRateBilled.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Difference:</span>
                                  <span className={`font-medium ${selectedInvoice.baseRateBilled - selectedInvoice.contractRate > 0 ? "text-red-600" : "text-[#2E8B57]"}`}>
                                    ${(selectedInvoice.baseRateBilled - selectedInvoice.contractRate).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Surcharges */}
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-3">
                              <h4 className="font-medium text-[#0F4C81]">Surcharge Validation</h4>
                              <div className="space-y-2">
                                {selectedInvoice.surcharges.map((sur, idx) => (
                                  <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 rounded">
                                    <div className="flex items-center gap-2">
                                      {sur.isValid ? (
                                        <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      )}
                                      <span className="text-sm">{sur.code}</span>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium">${sur.billedAmount.toFixed(2)}</p>
                                      {!sur.isValid && (
                                        <p className="text-xs text-red-500">Expected: ${sur.expectedAmount.toFixed(2)}</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Issues */}
                        {selectedInvoice.issues.length > 0 && (
                          <div className="mt-6 space-y-3">
                            <h4 className="font-medium text-[#0F4C81]">Identified Issues</h4>
                            <div className="space-y-2">
                              {selectedInvoice.issues.map((issue, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-start gap-3 p-3 rounded-lg border-l-4"
                                  style={{ borderColor: getSeverityColor(issue.severity) }}
                                >
                                  <AlertTriangle className="h-5 w-5 mt-0.5" style={{ color: getSeverityColor(issue.severity) }} />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="font-medium">{issue.description}</p>
                                      <Badge 
                                        style={{ backgroundColor: getSeverityColor(issue.severity), color: "white" }}
                                      >
                                        {issue.severity}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Amount: ${issue.amount.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-[#0F4C81] mt-1">
                                      Recommendation: {issue.recommendation}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {invoices.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <Search className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <p className="text-lg font-medium mb-2">No Data for Analysis</p>
                <p className="text-muted-foreground mb-4">Upload invoices to perform detailed analysis</p>
                <Button onClick={() => setActiveTab("upload")}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Invoices
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Rate Verification Analysis */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Target className="h-5 w-5" />
                    Rate Verification Analysis
                  </CardTitle>
                  <CardDescription>
                    Comparison of billed rates against contract and market rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={invoices.slice(0, 10).map(inv => ({
                          name: inv.invoiceNumber.split("-")[2],
                          billed: inv.baseRateBilled,
                          contract: inv.contractRate,
                          market: inv.marketRate,
                        }))}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="billed" fill={COLORS.primary} name="Billed Rate" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="contract" fill={COLORS.secondary} name="Contract Rate" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="market" fill={COLORS.warning} name="Market Rate" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Surcharge Validation */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Layers className="h-5 w-5" />
                    Surcharge Validation Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {surchargeTypes.slice(0, 6).map((surType, idx) => {
                      const allSurcharges = invoices.flatMap(inv => inv.surcharges);
                      const matchingSurcharges = allSurcharges.filter(s => s.code === surType.code);
                      const invalidCount = matchingSurcharges.filter(s => !s.isValid).length;
                      const totalBilled = matchingSurcharges.reduce((sum, s) => sum + s.billedAmount, 0);
                      const totalExpected = matchingSurcharges.reduce((sum, s) => sum + s.expectedAmount, 0);
                      
                      return (
                        <Card key={idx} className="border">
                          <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-medium">{surType.code}</p>
                                <p className="text-xs text-muted-foreground">{surType.name.split("(")[0]}</p>
                              </div>
                              {invalidCount > 0 ? (
                                <Badge className="bg-red-100 text-red-700">{invalidCount} issues</Badge>
                              ) : (
                                <Badge className="bg-green-100 text-green-700">Valid</Badge>
                              )}
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Billed:</span>
                                <span className="font-medium">${totalBilled.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Expected:</span>
                                <span className="font-medium">${totalExpected.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Typical Range:</span>
                                <span>${surType.typicalRange[0]} - ${surType.typicalRange[1]}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Duplicate Detection */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <Copy className="h-5 w-5" />
                    Duplicate Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {processedResult?.duplicateCount === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 mx-auto text-[#2E8B57] mb-4" />
                      <p className="font-medium">No Duplicates Detected</p>
                      <p className="text-sm text-muted-foreground">All invoices appear to be unique</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                          <div>
                            <p className="font-medium text-red-600">
                              {processedResult?.duplicateCount} Potential Duplicate(s) Found
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total duplicate amount: ${processedResult?.duplicateAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {invoices.filter(inv => inv.status === "duplicate").map(inv => (
                          <div key={inv.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{inv.invoiceNumber}</p>
                                <p className="text-sm text-muted-foreground">{inv.carrier} - {inv.route}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${inv.totalBilled.toLocaleString()}</p>
                                <p className="text-sm text-red-600">Potential Duplicate</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Savings Identification */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                    <TrendingDown className="h-5 w-5" />
                    Savings Identification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-[#2E8B57]/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Potential Savings</p>
                        <p className="text-3xl font-bold text-[#2E8B57]">
                          ${processedResult?.totalSavings.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {processedResult?.savingsPercentage.toFixed(2)}% of total billed amount
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium">Savings Breakdown</h4>
                        {processedResult?.savingsByCategory.map((cat, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{cat.category}</span>
                                <span className="text-sm font-medium">${cat.amount.toFixed(2)}</span>
                              </div>
                              <Progress value={cat.percentage} className="h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Top Savings Opportunities</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {invoices
                          .filter(inv => inv.potentialSavings > 0)
                          .sort((a, b) => b.potentialSavings - a.potentialSavings)
                          .slice(0, 8)
                          .map(inv => (
                            <div key={inv.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-sm">{inv.invoiceNumber}</p>
                                  <p className="text-xs text-muted-foreground">{inv.carrier}</p>
                                </div>
                                <p className="font-medium text-[#2E8B57]">
                                  ${inv.potentialSavings.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Common Freight Surcharges Reference</CardTitle>
              <CardDescription>Typical ranges and validation criteria for common surcharges</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Typical Range (USD)</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {surchargeTypes.map((sur, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{sur.code}</TableCell>
                      <TableCell>{sur.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{sur.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${sur.typicalRange[0]} - ${sur.typicalRange[1]}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {sur.code === "BAF" && "Varies with fuel prices"}
                        {sur.code === "CAF" && "Varies with exchange rates"}
                        {sur.code === "THC" && "Port-specific rates"}
                        {sur.code === "DEM" && "Per day charges"}
                        {sur.code === "DET" && "Per day charges"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Contract Rate Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {carriers.slice(0, 8).map((carrier, idx) => (
                  <Card key={idx} className="border">
                    <CardContent className="pt-4">
                      <h4 className="font-medium text-[#0F4C81] mb-3">{carrier.name}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">20&apos;GP:</span>
                          <span className="font-medium">${carrier.contractRates["20GP"].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">40&apos;GP:</span>
                          <span className="font-medium">${carrier.contractRates["40GP"].toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">40&apos;HC:</span>
                          <span className="font-medium">${carrier.contractRates["40HC"].toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#0F4C81]">Audit Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="rate-check">
                  <AccordionTrigger className="hover:text-[#0F4C81]">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Rate Verification Checklist
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {[
                        "Compare billed rate against contract rate",
                        "Check for rate increases without notification",
                        "Verify currency conversion rates",
                        "Validate peak season surcharges are properly applied",
                        "Confirm volume-based discounts are applied",
                        "Check for correct container type pricing",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="surcharge-check">
                  <AccordionTrigger className="hover:text-[#0F4C81]">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Surcharge Validation Checklist
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {[
                        "Verify BAF/CAF rates against published indices",
                        "Check THC against terminal published rates",
                        "Validate security surcharges",
                        "Review demurrage/detention calculations",
                        "Confirm documentation fees are reasonable",
                        "Check for duplicate surcharge charges",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="duplicate-check">
                  <AccordionTrigger className="hover:text-[#0F4C81]">
                    <div className="flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Duplicate Detection Checklist
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {[
                        "Check for same invoice number from same carrier",
                        "Verify same shipment on different invoices",
                        "Look for duplicate BL/container numbers",
                        "Check for same amount on different dates",
                        "Review similar route/amount combinations",
                        "Cross-reference with payment records",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import BookOpen icon
import { BookOpen } from "lucide-react";
