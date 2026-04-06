"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants/chartColors";
import {
  Package,
  TrendingDown,
  AlertTriangle,
  Download,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  MoreHorizontal,
  XCircle,
  Zap,
  Target,
  Layers,
  Info,
  Archive,
  TrendingUp,
  Activity,
  Database,
  LineChart as LineChartIcon,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Shield,
  ArrowRight,
} from "lucide-react";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors
const BRAND_COLORS = {
  ocean: "#0F4C81",
  oceanLight: "#4A90D9",
  oceanDark: "#0A3A63",
  logistics: "#2E8B57",
  logisticsLight: "#4CAF7E",
  logisticsDark: "#1E6B3F",
  warning: "#F59E0B",
  danger: "#EF4444",
};

// Types
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unitCost: number;
  dateReceived: Date;
  lastSaleDate: Date | null;
  abcClass: "A" | "B" | "C";
  location: string;
  supplier: string;
}

interface AgingBucket {
  label: string;
  minDays: number;
  maxDays: number;
  quantity: number;
  value: number;
  itemCount: number;
  color: string;
}

interface AnalysisResult {
  agingBuckets: AgingBucket[];
  totalQuantity: number;
  totalValue: number;
  writeOffRisk: number;
  slowMovingItems: InventoryItem[];
  liquidationCandidates: InventoryItem[];
  abcSummary: { class: string; count: number; value: number; percentage: number }[];
  agingDistribution: { name: string; value: number; color: string }[];
  valueAtRisk: number;
  averageAge: number;
  monthlyTrend: { month: string; value: number; quantity: number; avgAge: number }[];
  categoryBreakdown: { category: string; value: number; quantity: number; avgAge: number }[];
}

// Sample inventory data
const generateSampleData = (): InventoryItem[] => {
  const categories = ["Electronics", "Machinery", "Raw Materials", "Packaging", "Tools", "Safety Equipment"];
  const suppliers = ["Global Supply Co.", "Pacific Trading", "Euro Logistics", "Asian Imports", "Local Distributor"];
  const locations = ["Warehouse A", "Warehouse B", "Warehouse C", "Cold Storage"];
  
  const items: InventoryItem[] = [];
  const now = new Date();
  
  for (let i = 1; i <= 50; i++) {
    const daysOld = Math.floor(Math.random() * 150);
    const dateReceived = new Date(now.getTime() - daysOld * 24 * 60 * 60 * 1000);
    const hasSale = Math.random() > 0.3;
    const lastSaleDate = hasSale 
      ? new Date(now.getTime() - Math.floor(Math.random() * daysOld) * 24 * 60 * 60 * 1000)
      : null;
    
    items.push({
      id: `INV-${String(i).padStart(4, "0")}`,
      sku: `SKU-${String(i).padStart(5, "0")}`,
      name: `Product Item ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      quantity: Math.floor(Math.random() * 500) + 10,
      unitCost: Math.floor(Math.random() * 500) + 10,
      dateReceived,
      lastSaleDate,
      abcClass: i <= 10 ? "A" : i <= 30 ? "B" : "C",
      location: locations[Math.floor(Math.random() * locations.length)],
      supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    });
  }
  
  return items;
};

// FAQ Data
const faqData = [
  {
    question: "What is inventory aging analysis and why is it important?",
    answer: "Inventory aging analysis tracks how long items have been in stock by categorizing them into time buckets (0-30, 31-60, 61-90, 90+ days). It's crucial for identifying slow-moving stock, reducing carrying costs, preventing obsolescence, and optimizing cash flow. Regular aging analysis helps businesses make informed decisions about pricing, promotions, and liquidation strategies."
  },
  {
    question: "How do I interpret the aging buckets?",
    answer: "0-30 days represents fresh inventory with minimal risk. 31-60 days shows items that may need attention. 61-90 days indicates elevated risk where action should be considered. 90+ days represents critical aging where immediate action (discounts, promotions, or write-offs) is typically required to minimize losses."
  },
  {
    question: "What is ABC classification and how does it relate to aging?",
    answer: "ABC classification categorizes inventory by value: Class A items (top 20%) typically represent 80% of value and need tight control. Class B items (next 30%) represent 15% of value with moderate control. Class C items (bottom 50%) represent 5% of value with simplified controls. Combining ABC with aging helps prioritize which aged items need immediate attention based on their value contribution."
  },
  {
    question: "When should I consider liquidation for aged inventory?",
    answer: "Liquidation should be considered when: items are 90+ days old with no sales activity, carrying costs exceed potential recovery value, products are approaching expiration or obsolescence, the item is Class C (low value) with extended aging, or warehouse space is needed for higher-turnover products. The goal is to recover maximum value before items become unsellable."
  },
  {
    question: "How can I reduce the risk of inventory aging?",
    answer: "Key strategies include: implementing first-in-first-out (FIFO) practices, setting up automated reorder points based on demand forecasting, regular review of slow-moving items, dynamic pricing strategies, improving demand planning accuracy, establishing supplier agreements for returns or exchanges, and using safety stock calculations to avoid overstocking."
  },
  {
    question: "What metrics should I track alongside aging analysis?",
    answer: "Important complementary metrics include: Inventory Turnover Ratio (how quickly inventory sells), Days Sales of Inventory (DSI), Gross Margin Return on Investment (GMROI), Sell-Through Rate, Stock-to-Sales Ratio, Carrying Cost Percentage, and Write-Off Percentage. These metrics provide a holistic view of inventory health."
  },
  {
    question: "How often should I run inventory aging analysis?",
    answer: "For most businesses, weekly or bi-weekly analysis is recommended. High-volume or perishable goods businesses may need daily monitoring. The frequency should align with your inventory turnover rate and the perishability of your products. Monthly deep dives help identify trends and adjust strategies."
  },
  {
    question: "What is the difference between value at risk and write-off risk?",
    answer: "Value at Risk represents inventory that may require discounting or special handling (typically 60+ days old) but still has recovery potential. Write-off Risk represents inventory likely to be written off entirely (typically 90+ days old) where the probability of sale is minimal. Both metrics help quantify potential financial exposure but at different severity levels."
  }
];

export function InventoryAgingAnalysis() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currency, setCurrency] = useState("USD");
  const [sortField, setSortField] = useState<keyof InventoryItem>("dateReceived");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAbcClass, setFilterAbcClass] = useState("all");
  const [writeOffThreshold, setWriteOffThreshold] = useState(90);
  const [slowMovingDays, setSlowMovingDays] = useState(60);
  
  // Generate sample inventory
  const [inventory] = useState<InventoryItem[]>(generateSampleData);
  
  // Calculate days in inventory
  const getDaysInInventory = (dateReceived: Date): number => {
    const now = new Date();
    const diff = now.getTime() - new Date(dateReceived).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };
  
  // Get aging bucket for an item
  const getAgingBucket = (days: number): string => {
    if (days <= 30) return "0-30";
    if (days <= 60) return "31-60";
    if (days <= 90) return "61-90";
    return "90+";
  };
  
  // Analysis calculation
  const analysis = useMemo((): AnalysisResult => {
    const now = new Date();
    
    // Calculate aging buckets
    const bucketConfig = [
      { label: "0-30", minDays: 0, maxDays: 30, color: BRAND_COLORS.logistics },
      { label: "31-60", minDays: 31, maxDays: 60, color: BRAND_COLORS.ocean },
      { label: "61-90", minDays: 61, maxDays: 90, color: BRAND_COLORS.warning },
      { label: "90+", minDays: 91, maxDays: Infinity, color: BRAND_COLORS.danger },
    ];
    
    const buckets: AgingBucket[] = bucketConfig.map(config => ({
      ...config,
      quantity: 0,
      value: 0,
      itemCount: 0,
    }));
    
    let totalQuantity = 0;
    let totalValue = 0;
    let totalAge = 0;
    
    // Category breakdown
    const categoryMap = new Map<string, { value: number; quantity: number; ages: number[] }>();
    
    inventory.forEach(item => {
      const days = getDaysInInventory(item.dateReceived);
      const value = item.quantity * item.unitCost;
      
      totalQuantity += item.quantity;
      totalValue += value;
      totalAge += days;
      
      const bucketIndex = days <= 30 ? 0 : days <= 60 ? 1 : days <= 90 ? 2 : 3;
      buckets[bucketIndex].quantity += item.quantity;
      buckets[bucketIndex].value += value;
      buckets[bucketIndex].itemCount += 1;
      
      // Category tracking
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, { value: 0, quantity: 0, ages: [] });
      }
      const catData = categoryMap.get(item.category)!;
      catData.value += value;
      catData.quantity += item.quantity;
      catData.ages.push(days);
    });
    
    // Calculate write-off risk (items over threshold)
    const writeOffRisk = inventory
      .filter(item => getDaysInInventory(item.dateReceived) >= writeOffThreshold)
      .reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    
    // Identify slow-moving items
    const slowMovingItems = inventory
      .filter(item => {
        const daysSinceReceipt = getDaysInInventory(item.dateReceived);
        const daysSinceSale = item.lastSaleDate 
          ? Math.floor((now.getTime() - new Date(item.lastSaleDate).getTime()) / (1000 * 60 * 60 * 24))
          : daysSinceReceipt;
        return daysSinceSale >= slowMovingDays;
      })
      .sort((a, b) => getDaysInInventory(b.dateReceived) - getDaysInInventory(a.dateReceived));
    
    // Liquidation candidates (high age + low ABC class + no recent sales)
    const liquidationCandidates = inventory
      .filter(item => {
        const days = getDaysInInventory(item.dateReceived);
        const noRecentSale = !item.lastSaleDate || 
          Math.floor((now.getTime() - new Date(item.lastSaleDate).getTime()) / (1000 * 60 * 60 * 24)) > 45;
        return days > 60 && noRecentSale && item.abcClass === "C";
      })
      .sort((a, b) => (b.quantity * b.unitCost) - (a.quantity * a.unitCost));
    
    // ABC Summary
    const abcGroups = { A: { count: 0, value: 0 }, B: { count: 0, value: 0 }, C: { count: 0, value: 0 } };
    inventory.forEach(item => {
      const value = item.quantity * item.unitCost;
      abcGroups[item.abcClass].count += 1;
      abcGroups[item.abcClass].value += value;
    });
    
    const abcSummary = Object.entries(abcGroups).map(([cls, data]) => ({
      class: cls,
      count: data.count,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
    }));
    
    // Aging distribution for charts
    const agingDistribution = buckets.map(b => ({
      name: b.label,
      value: b.value,
      color: b.color,
    }));
    
    // Value at risk (items over 60 days)
    const valueAtRisk = buckets
      .filter(b => b.minDays > 60)
      .reduce((sum, b) => sum + b.value, 0);
    
    // Monthly trend (simulated)
    const monthlyTrend = [
      { month: "Jul", value: totalValue * 0.85, quantity: Math.floor(totalQuantity * 0.88), avgAge: 35 },
      { month: "Aug", value: totalValue * 0.90, quantity: Math.floor(totalQuantity * 0.92), avgAge: 42 },
      { month: "Sep", value: totalValue * 0.95, quantity: Math.floor(totalQuantity * 0.95), avgAge: 55 },
      { month: "Oct", value: totalValue * 0.98, quantity: Math.floor(totalQuantity * 0.97), avgAge: 62 },
      { month: "Nov", value: totalValue, quantity: totalQuantity, avgAge: Math.floor(totalAge / inventory.length) },
      { month: "Dec", value: totalValue * 1.05, quantity: Math.floor(totalQuantity * 1.02), avgAge: 58 },
    ];
    
    // Category breakdown
    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      value: data.value,
      quantity: data.quantity,
      avgAge: Math.floor(data.ages.reduce((a, b) => a + b, 0) / data.ages.length),
    }));
    
    return {
      agingBuckets: buckets,
      totalQuantity,
      totalValue,
      writeOffRisk,
      slowMovingItems: slowMovingItems.slice(0, 10),
      liquidationCandidates: liquidationCandidates.slice(0, 10),
      abcSummary,
      agingDistribution,
      valueAtRisk,
      averageAge: inventory.length > 0 ? totalAge / inventory.length : 0,
      monthlyTrend,
      categoryBreakdown,
    };
  }, [inventory, writeOffThreshold, slowMovingDays]);
  
  // Filtered and sorted inventory
  const filteredInventory = useMemo(() => {
    let result = [...inventory];
    
    if (filterCategory !== "all") {
      result = result.filter(item => item.category === filterCategory);
    }
    
    if (filterAbcClass !== "all") {
      result = result.filter(item => item.abcClass === filterAbcClass);
    }
    
    result.sort((a, b) => {
      let aValue: number | string | Date = a[sortField];
      let bValue: number | string | Date = b[sortField];
      
      if (sortField === "dateReceived" || sortField === "lastSaleDate") {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
    
    return result;
  }, [inventory, filterCategory, filterAbcClass, sortField, sortDirection]);
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(inventory.map(item => item.category));
    return Array.from(cats);
  }, [inventory]);
  
  // ABC class colors
  const getAbcColor = (cls: string): string => {
    switch (cls) {
      case "A": return BRAND_COLORS.ocean;
      case "B": return BRAND_COLORS.logistics;
      case "C": return BRAND_COLORS.warning;
      default: return "#6B7280";
    }
  };
  
  // Risk level badge
  const getRiskBadge = (days: number) => {
    if (days >= 90) return <Badge style={{ backgroundColor: BRAND_COLORS.danger }}>Critical</Badge>;
    if (days >= 60) return <Badge style={{ backgroundColor: BRAND_COLORS.warning }}>High</Badge>;
    if (days >= 30) return <Badge style={{ backgroundColor: BRAND_COLORS.ocean }}>Medium</Badge>;
    return <Badge style={{ backgroundColor: BRAND_COLORS.logistics }}>Low</Badge>;
  };
  
  // Liquidation recommendation badge
  const getLiquidationAction = (item: InventoryItem): { action: string; discount: number } => {
    const days = getDaysInInventory(item.dateReceived);
    if (days >= 120) return { action: "Deep Discount", discount: 50 };
    if (days >= 90) return { action: "Sale Price", discount: 30 };
    return { action: "Promotion", discount: 15 };
  };
  
  // Handle sort
  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.ocean} 0%, ${BRAND_COLORS.oceanDark} 50%, ${BRAND_COLORS.logisticsDark} 100%)` }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full opacity-20" style={{ background: BRAND_COLORS.logistics, filter: 'blur(40px)' }} />
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full opacity-20" style={{ background: BRAND_COLORS.oceanLight, filter: 'blur(50px)' }} />
        
        <div className="relative px-6 py-10 md:px-10 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <Package className="h-8 w-8 text-white" />
                </div>
                <Badge className="px-3 py-1 text-sm font-medium" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Analytics Tool
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Inventory Aging Analysis
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-6">
                Monitor inventory age distribution, identify slow-moving items, and optimize stock management with actionable insights.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Database className="h-4 w-4 text-white/70" />
                  <span className="text-white/90 text-sm">{inventory.length} Items Tracked</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Activity className="h-4 w-4 text-white/70" />
                  <span className="text-white/90 text-sm">Real-time Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <Shield className="h-4 w-4 text-white/70" />
                  <span className="text-white/90 text-sm">Risk Assessment</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 md:text-right">
              <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <p className="text-white/70 text-sm mb-1">Total Inventory Value</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(analysis.totalValue, currency)}</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-white/70 text-xs mb-1">Avg Age</p>
                  <p className="text-xl font-bold text-white">{Math.floor(analysis.averageAge)}d</p>
                </div>
                <div className="flex-1 p-3 rounded-lg text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-white/70 text-xs mb-1">At Risk</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(analysis.valueAtRisk, currency)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: BRAND_COLORS.logistics }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Healthy Stock</p>
                <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                  {formatCurrency(analysis.agingBuckets[0]?.value || 0, currency)}
                </p>
                <p className="text-xs text-muted-foreground">0-30 days</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: `${BRAND_COLORS.logistics}15` }}>
                <CheckCircle2 className="h-6 w-6" style={{ color: BRAND_COLORS.logistics }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4" style={{ borderLeftColor: BRAND_COLORS.ocean }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moderate Aging</p>
                <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                  {formatCurrency(analysis.agingBuckets[1]?.value || 0, currency)}
                </p>
                <p className="text-xs text-muted-foreground">31-60 days</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: `${BRAND_COLORS.ocean}15` }}>
                <Clock className="h-6 w-6" style={{ color: BRAND_COLORS.ocean }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4" style={{ borderLeftColor: BRAND_COLORS.warning }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Value at Risk</p>
                <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                  {formatCurrency(analysis.valueAtRisk, currency)}
                </p>
                <p className="text-xs text-muted-foreground">60+ days</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: `${BRAND_COLORS.warning}15` }}>
                <AlertTriangle className="h-6 w-6" style={{ color: BRAND_COLORS.warning }} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4" style={{ borderLeftColor: BRAND_COLORS.danger }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Write-off Risk</p>
                <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.danger }}>
                  {formatCurrency(analysis.writeOffRisk, currency)}
                </p>
                <p className="text-xs text-muted-foreground">90+ days</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: `${BRAND_COLORS.danger}15` }}>
                <XCircle className="h-6 w-6" style={{ color: BRAND_COLORS.danger }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="overview" className="text-sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="aging" className="text-sm">
            <Clock className="h-4 w-4 mr-2" />
            Aging
          </TabsTrigger>
          <TabsTrigger value="abc" className="text-sm">
            <Layers className="h-4 w-4 mr-2" />
            ABC
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="actions" className="text-sm">
            <Zap className="h-4 w-4 mr-2" />
            Actions
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Aging Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Value by Aging Bucket
                </CardTitle>
                <CardDescription>Inventory value distribution across aging periods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.agingDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {analysis.agingDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Aging Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                  Quantity by Age
                </CardTitle>
                <CardDescription>Units in each aging bucket</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysis.agingBuckets}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
                        {analysis.agingBuckets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Category Breakdown
              </CardTitle>
              <CardDescription>Inventory analysis by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analysis.categoryBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                    <YAxis dataKey="category" type="category" width={100} />
                    <Tooltip formatter={(value: number, name: string) => [name === 'value' ? formatCurrency(value, currency) : value, name === 'value' ? 'Value' : 'Qty']} />
                    <Bar dataKey="value" fill={BRAND_COLORS.ocean} radius={[0, 4, 4, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Aging Buckets Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Aging Summary</CardTitle>
              <CardDescription>Detailed breakdown by aging period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysis.agingBuckets.map((bucket) => (
                  <div
                    key={bucket.label}
                    className="p-4 rounded-xl border-2 transition-all hover:shadow-lg"
                    style={{ borderColor: bucket.color, background: `${bucket.color}08` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-lg" style={{ color: bucket.color }}>
                        {bucket.label} Days
                      </span>
                      <Badge variant="outline" style={{ borderColor: bucket.color, color: bucket.color }}>
                        {bucket.itemCount} items
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="text-xl font-semibold">{bucket.quantity.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Value</p>
                        <p className="text-xl font-semibold">{formatCurrency(bucket.value, currency)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">% of Total</p>
                        <Progress
                          value={analysis.totalValue > 0 ? (bucket.value / analysis.totalValue) * 100 : 0}
                          className="h-2"
                          style={{ background: `${bucket.color}20` }}
                        />
                        <p className="text-xs text-right mt-1 font-medium">
                          {analysis.totalValue > 0 ? ((bucket.value / analysis.totalValue) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Aging Analysis Tab */}
        <TabsContent value="aging" className="space-y-6 mt-6">
          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Analysis Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.slice(0, 10).map(c => (
                        <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Write-off Threshold (days)</Label>
                  <Input
                    type="number"
                    value={writeOffThreshold}
                    onChange={(e) => setWriteOffThreshold(parseInt(e.target.value) || 90)}
                  />
                </div>
                <div>
                  <Label>Slow-moving Threshold (days)</Label>
                  <Input
                    type="number"
                    value={slowMovingDays}
                    onChange={(e) => setSlowMovingDays(parseInt(e.target.value) || 60)}
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inventory Items</CardTitle>
                  <CardDescription>Detailed inventory aging by item</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterAbcClass} onValueChange={setFilterAbcClass}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="ABC Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="A">Class A</SelectItem>
                      <SelectItem value="B">Class B</SelectItem>
                      <SelectItem value="C">Class C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 font-medium"
                        onClick={() => handleSort("sku")}
                      >
                        <div className="flex items-center gap-1">
                          SKU
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="font-medium">Item Name</TableHead>
                      <TableHead className="font-medium">Category</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 font-medium"
                        onClick={() => handleSort("quantity")}
                      >
                        <div className="flex items-center gap-1">
                          Qty
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="font-medium">Unit Cost</TableHead>
                      <TableHead className="font-medium">Total Value</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 font-medium"
                        onClick={() => handleSort("dateReceived")}
                      >
                        <div className="flex items-center gap-1">
                          Date Received
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="font-medium">Days Old</TableHead>
                      <TableHead className="font-medium">Aging Bucket</TableHead>
                      <TableHead className="font-medium">Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.slice(0, 20).map((item) => {
                      const days = getDaysInInventory(item.dateReceived);
                      const bucket = getAgingBucket(days);
                      const bucketColor = analysis.agingBuckets.find(b => b.label === bucket)?.color || "#6B7280";
                      
                      return (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.quantity.toLocaleString()}</TableCell>
                          <TableCell>{formatCurrency(item.unitCost, currency)}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(item.quantity * item.unitCost, currency)}
                          </TableCell>
                          <TableCell>
                            {new Date(item.dateReceived).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              style={{ backgroundColor: bucketColor }}
                              className="text-white"
                            >
                              {days} days
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" style={{ borderColor: bucketColor, color: bucketColor }}>
                              {bucket}
                            </Badge>
                          </TableCell>
                          <TableCell>{getRiskBadge(days)}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {filteredInventory.length > 20 && (
                <p className="text-sm text-muted-foreground text-center mt-4">
                  Showing 20 of {filteredInventory.length} items
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* ABC Classification Tab */}
        <TabsContent value="abc" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* ABC Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  ABC Classification Summary
                </CardTitle>
                <CardDescription>
                  Pareto analysis of inventory value concentration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.abcSummary.map((item) => (
                    <div
                      key={item.class}
                      className="p-4 rounded-xl border-2 transition-all hover:shadow-md"
                      style={{ borderColor: getAbcColor(item.class), background: `${getAbcColor(item.class)}08` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{ backgroundColor: getAbcColor(item.class) }}
                            className="text-white"
                          >
                            Class {item.class}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.count} items
                          </span>
                        </div>
                        <span className="font-bold text-lg">
                          {formatCurrency(item.value, currency)}
                        </span>
                      </div>
                      <Progress
                        value={item.percentage}
                        className="h-3"
                        style={{ background: `${getAbcColor(item.class)}20` }}
                      />
                      <p className="text-xs text-right mt-1 text-muted-foreground">
                        {item.percentage.toFixed(1)}% of total value
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 rounded-xl bg-muted/50">
                  <h4 className="font-medium mb-3">ABC Classification Guide</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-center gap-2">
                      <Badge style={{ backgroundColor: getAbcColor("A") }} className="text-white text-xs">A</Badge>
                      High value items - Tight control, frequent review
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge style={{ backgroundColor: getAbcColor("B") }} className="text-white text-xs">B</Badge>
                      Moderate value - Standard controls
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge style={{ backgroundColor: getAbcColor("C") }} className="text-white text-xs">C</Badge>
                      Low value - Simplified controls, bulk orders
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            {/* ABC Value Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                  Value Distribution by Class
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analysis.abcSummary}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="class" />
                      <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {analysis.abcSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getAbcColor(entry.class)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* ABC Item Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Items by ABC Class</CardTitle>
              <CardDescription>Detailed breakdown of items in each classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-6">
                {["A", "B", "C"].map((cls) => {
                  const classItems = inventory.filter(i => i.abcClass === cls).slice(0, 5);
                  const totalItems = inventory.filter(i => i.abcClass === cls).length;
                  
                  return (
                    <div key={cls} className="rounded-xl border p-4" style={{ borderColor: getAbcColor(cls), background: `${getAbcColor(cls)}05` }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge
                          style={{ backgroundColor: getAbcColor(cls) }}
                          className="text-white"
                        >
                          Class {cls}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {totalItems} items
                        </span>
                      </div>
                      <div className="space-y-2">
                        {classItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-white dark:bg-gray-900 rounded-lg border"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-sm">{item.sku}</p>
                                <p className="text-xs text-muted-foreground">{item.name}</p>
                              </div>
                              <p className="text-sm font-semibold">
                                {formatCurrency(item.quantity * item.unitCost, currency)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Inventory Trend Analysis
              </CardTitle>
              <CardDescription>6-month inventory value and quantity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analysis.monthlyTrend}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND_COLORS.ocean} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={BRAND_COLORS.ocean} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND_COLORS.logistics} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={BRAND_COLORS.logistics} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v, currency)} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value: number, name: string) => [name === 'value' ? formatCurrency(value, currency) : value, name === 'value' ? 'Value' : 'Quantity']} />
                    <Area yAxisId="left" type="monotone" dataKey="value" stroke={BRAND_COLORS.ocean} fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
                    <Line yAxisId="right" type="monotone" dataKey="quantity" stroke={BRAND_COLORS.logistics} strokeWidth={2} dot={{ fill: BRAND_COLORS.logistics, strokeWidth: 2 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Average Age Trend */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                  Average Age Trend
                </CardTitle>
                <CardDescription>How inventory age has changed over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysis.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${value} days`, 'Avg Age']} />
                      <Line type="monotone" dataKey="avgAge" stroke={BRAND_COLORS.warning} strokeWidth={3} dot={{ fill: BRAND_COLORS.warning, strokeWidth: 2, r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                  Key Insights
                </CardTitle>
                <CardDescription>Actionable observations from trend analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border-l-4" style={{ borderColor: BRAND_COLORS.logistics, background: `${BRAND_COLORS.logistics}08` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4" style={{ color: BRAND_COLORS.logistics }} />
                      <span className="font-medium">Value Growth</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Inventory value has increased 23% over the past 6 months, indicating business growth.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border-l-4" style={{ borderColor: BRAND_COLORS.warning, background: `${BRAND_COLORS.warning}08` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4" style={{ color: BRAND_COLORS.warning }} />
                      <span className="font-medium">Age Alert</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average inventory age increased from 35 to 58 days. Consider reviewing procurement policies.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border-l-4" style={{ borderColor: BRAND_COLORS.ocean, background: `${BRAND_COLORS.ocean}08` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4" style={{ color: BRAND_COLORS.ocean }} />
                      <span className="font-medium">Turnover Opportunity</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Electronics category shows slower turnover. Consider promotional pricing for aged items.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-6 mt-6">
          {/* Slow Moving Items */}
          <Card className="border-l-4" style={{ borderLeftColor: BRAND_COLORS.warning }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                Slow-Moving Items
              </CardTitle>
              <CardDescription>
                Items with no sales activity in the last {slowMovingDays}+ days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl mb-6" style={{ background: `${BRAND_COLORS.warning}10` }}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6" style={{ color: BRAND_COLORS.warning }} />
                  <div>
                    <p className="font-medium" style={{ color: BRAND_COLORS.warning }}>
                      {analysis.slowMovingItems.length} slow-moving items identified
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Consider promotions or liquidation strategies for these items
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="max-h-72 overflow-y-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-medium">SKU</TableHead>
                      <TableHead className="font-medium">Item</TableHead>
                      <TableHead className="font-medium">Qty</TableHead>
                      <TableHead className="font-medium">Value</TableHead>
                      <TableHead className="font-medium">Days</TableHead>
                      <TableHead className="font-medium">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.slowMovingItems.slice(0, 10).map((item) => {
                      const days = getDaysInInventory(item.dateReceived);
                      return (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.quantity.toLocaleString()}</TableCell>
                          <TableCell>{formatCurrency(item.quantity * item.unitCost, currency)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" style={{ borderColor: BRAND_COLORS.warning, color: BRAND_COLORS.warning }}>
                              {days}d
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Mark for Promotion</DropdownMenuItem>
                                <DropdownMenuItem>Schedule Clearance</DropdownMenuItem>
                                <DropdownMenuItem>Contact Supplier</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">
                                  Write Off
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Liquidation Candidates */}
          <Card className="border-l-4" style={{ borderLeftColor: BRAND_COLORS.danger }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: BRAND_COLORS.danger }} />
                Liquidation Recommendations
              </CardTitle>
              <CardDescription>
                High-priority items for immediate action
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.liquidationCandidates.length > 0 ? (
                <div className="space-y-4">
                  {analysis.liquidationCandidates.slice(0, 5).map((item) => {
                    const days = getDaysInInventory(item.dateReceived);
                    const liquidation = getLiquidationAction(item);
                    
                    return (
                      <div
                        key={item.id}
                        className="p-4 border rounded-xl"
                        style={{ borderColor: `${BRAND_COLORS.danger}40`, background: `${BRAND_COLORS.danger}05` }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm text-muted-foreground">
                                {item.sku}
                              </span>
                              <Badge style={{ backgroundColor: BRAND_COLORS.danger }}>{days} days old</Badge>
                            </div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.category} • {item.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              {formatCurrency(item.quantity * item.unitCost, currency)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} units @ {formatCurrency(item.unitCost, currency)}
                            </p>
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="text-xs text-muted-foreground">Recommended Action</p>
                              <p className="font-medium" style={{ color: BRAND_COLORS.danger }}>{liquidation.action}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Suggested Discount</p>
                              <p className="font-medium" style={{ color: BRAND_COLORS.warning }}>{liquidation.discount}% off</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Recovery Value</p>
                              <p className="font-medium" style={{ color: BRAND_COLORS.logistics }}>
                                {formatCurrency(
                                  (item.quantity * item.unitCost) * (1 - liquidation.discount / 100),
                                  currency
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">View Details</Button>
                            <Button size="sm" style={{ background: BRAND_COLORS.danger }}>
                              <Zap className="h-4 w-4 mr-1" />
                              Initiate Sale
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4" style={{ color: BRAND_COLORS.logistics }} />
                  <p className="font-medium" style={{ color: BRAND_COLORS.logistics }}>
                    No liquidation candidates at this time
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All inventory items are within acceptable aging parameters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Liquidation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Liquidation Impact Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="p-5 rounded-xl text-center" style={{ background: `${BRAND_COLORS.danger}08` }}>
                  <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.danger }}>
                    {formatCurrency(
                      analysis.liquidationCandidates.reduce(
                        (sum, item) => sum + item.quantity * item.unitCost,
                        0
                      ),
                      currency
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">At-risk inventory</p>
                </div>
                <div className="p-5 rounded-xl text-center" style={{ background: `${BRAND_COLORS.warning}08` }}>
                  <p className="text-sm text-muted-foreground mb-1">Potential Recovery</p>
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                    {formatCurrency(
                      analysis.liquidationCandidates.reduce((sum, item) => {
                        const discount = getLiquidationAction(item).discount;
                        return sum + (item.quantity * item.unitCost) * (1 - discount / 100);
                      }, 0),
                      currency
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">With liquidation discounts</p>
                </div>
                <div className="p-5 rounded-xl text-center" style={{ background: `${BRAND_COLORS.logistics}08` }}>
                  <p className="text-sm text-muted-foreground mb-1">Write-off Avoided</p>
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                    {formatCurrency(
                      analysis.liquidationCandidates.reduce((sum, item) => {
                        const discount = getLiquidationAction(item).discount;
                        return sum + (item.quantity * item.unitCost) * (1 - discount / 100);
                      }, 0) - analysis.liquidationCandidates.reduce(
                        (sum, item) => sum + item.quantity * item.unitCost,
                        0
                      ),
                      currency
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">By taking action now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* FAQs Section */}
      <Card className="overflow-hidden">
        <div className="p-6" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.ocean}08 0%, ${BRAND_COLORS.logistics}08 100%)` }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg" style={{ background: BRAND_COLORS.ocean }}>
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
              <p className="text-sm text-muted-foreground">Everything you need to know about inventory aging analysis</p>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 data-[state=open]:bg-muted/30">
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-3 text-left">
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                    <span className="font-medium">{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pl-7">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button size="sm" style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.ocean} 0%, ${BRAND_COLORS.logistics} 100%)` }}>
          <Archive className="h-4 w-4 mr-2" />
          Generate Action Plan
        </Button>
      </div>
    </div>
  );
}
