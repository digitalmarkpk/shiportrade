"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Clock,
  RefreshCw,
  Download,
  Filter,
  Search,
  Box,
  Boxes,
  Warehouse,
  Target,
  PieChart,
  LineChart,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  Zap,
  Shield,
  BarChart2,
  TrendingUpIcon,
  HelpCircle,
  ChevronRight,
  Database,
  Truck,
  ClipboardList,
  Settings,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ReferenceLine,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Types
interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxStock: number;
  unitCost: number;
  unitPrice: number;
  monthlyDemand: number;
  lastRestockDate: string;
  leadTime: number;
  abcClass: "A" | "B" | "C";
  turnoverRate: number;
  daysOfStock: number;
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstocked";
}

interface DashboardMetrics {
  totalItems: number;
  totalStockValue: number;
  averageTurnover: number;
  lowStockCount: number;
  outOfStockCount: number;
  overstockedCount: number;
  averageDaysOfStock: number;
  stockHealthScore: number;
}

// Sample inventory data
const generateInventoryData = (): InventoryItem[] => {
  const items: InventoryItem[] = [
    { id: "1", sku: "ELEC-001", name: "Wireless Bluetooth Headphones", category: "Electronics", currentStock: 450, reorderPoint: 100, maxStock: 800, unitCost: 25, unitPrice: 59.99, monthlyDemand: 320, lastRestockDate: "2024-01-15", leadTime: 7, abcClass: "A", turnoverRate: 8.5, daysOfStock: 42, status: "in_stock" },
    { id: "2", sku: "ELEC-002", name: "USB-C Charging Cable 6ft", category: "Electronics", currentStock: 85, reorderPoint: 200, maxStock: 1000, unitCost: 3.5, unitPrice: 12.99, monthlyDemand: 450, lastRestockDate: "2024-01-10", leadTime: 5, abcClass: "A", turnoverRate: 12.3, daysOfStock: 6, status: "low_stock" },
    { id: "3", sku: "ELEC-003", name: "Portable Power Bank 20000mAh", category: "Electronics", currentStock: 0, reorderPoint: 50, maxStock: 200, unitCost: 18, unitPrice: 45.99, monthlyDemand: 85, lastRestockDate: "2023-12-20", leadTime: 10, abcClass: "B", turnoverRate: 4.2, daysOfStock: 0, status: "out_of_stock" },
    { id: "4", sku: "CLTH-001", name: "Premium Cotton T-Shirt", category: "Clothing", currentStock: 1200, reorderPoint: 300, maxStock: 1500, unitCost: 8, unitPrice: 24.99, monthlyDemand: 280, lastRestockDate: "2024-01-18", leadTime: 14, abcClass: "A", turnoverRate: 6.1, daysOfStock: 128, status: "overstocked" },
    { id: "5", sku: "CLTH-002", name: "Denim Jeans Classic Fit", category: "Clothing", currentStock: 340, reorderPoint: 100, maxStock: 400, unitCost: 22, unitPrice: 59.99, monthlyDemand: 120, lastRestockDate: "2024-01-05", leadTime: 21, abcClass: "B", turnoverRate: 3.8, daysOfStock: 85, status: "in_stock" },
    { id: "6", sku: "HOME-001", name: "Stainless Steel Water Bottle", category: "Home & Garden", currentStock: 580, reorderPoint: 150, maxStock: 600, unitCost: 6, unitPrice: 19.99, monthlyDemand: 200, lastRestockDate: "2024-01-12", leadTime: 12, abcClass: "A", turnoverRate: 4.1, daysOfStock: 87, status: "in_stock" },
    { id: "7", sku: "HOME-002", name: "LED Desk Lamp Adjustable", category: "Home & Garden", currentStock: 45, reorderPoint: 80, maxStock: 250, unitCost: 15, unitPrice: 39.99, monthlyDemand: 95, lastRestockDate: "2024-01-08", leadTime: 18, abcClass: "B", turnoverRate: 5.2, daysOfStock: 14, status: "low_stock" },
    { id: "8", sku: "SPRT-001", name: "Yoga Mat Premium 6mm", category: "Sports", currentStock: 220, reorderPoint: 80, maxStock: 300, unitCost: 12, unitPrice: 34.99, monthlyDemand: 110, lastRestockDate: "2024-01-20", leadTime: 10, abcClass: "B", turnoverRate: 5.0, daysOfStock: 60, status: "in_stock" },
    { id: "9", sku: "SPRT-002", name: "Resistance Bands Set", category: "Sports", currentStock: 95, reorderPoint: 50, maxStock: 200, unitCost: 8, unitPrice: 24.99, monthlyDemand: 75, lastRestockDate: "2024-01-14", leadTime: 8, abcClass: "C", turnoverRate: 7.8, daysOfStock: 38, status: "in_stock" },
    { id: "10", sku: "AUTO-001", name: "Car Phone Mount Universal", category: "Automotive", currentStock: 0, reorderPoint: 100, maxStock: 400, unitCost: 5, unitPrice: 18.99, monthlyDemand: 180, lastRestockDate: "2023-12-28", leadTime: 15, abcClass: "A", turnoverRate: 9.5, daysOfStock: 0, status: "out_of_stock" },
    { id: "11", sku: "AUTO-002", name: "LED Interior Light Kit", category: "Automotive", currentStock: 160, reorderPoint: 60, maxStock: 200, unitCost: 10, unitPrice: 29.99, monthlyDemand: 90, lastRestockDate: "2024-01-16", leadTime: 12, abcClass: "C", turnoverRate: 6.7, daysOfStock: 53, status: "in_stock" },
    { id: "12", sku: "HLTH-001", name: "Digital Body Scale", category: "Health & Beauty", currentStock: 75, reorderPoint: 40, maxStock: 150, unitCost: 14, unitPrice: 35.99, monthlyDemand: 55, lastRestockDate: "2024-01-11", leadTime: 14, abcClass: "C", turnoverRate: 7.3, daysOfStock: 41, status: "in_stock" },
    { id: "13", sku: "HLTH-002", name: "Essential Oil Diffuser", category: "Health & Beauty", currentStock: 25, reorderPoint: 60, maxStock: 180, unitCost: 11, unitPrice: 32.99, monthlyDemand: 70, lastRestockDate: "2024-01-02", leadTime: 16, abcClass: "B", turnoverRate: 8.1, daysOfStock: 11, status: "low_stock" },
    { id: "14", sku: "ELEC-004", name: "Smart Watch Basic", category: "Electronics", currentStock: 180, reorderPoint: 80, maxStock: 300, unitCost: 35, unitPrice: 89.99, monthlyDemand: 95, lastRestockDate: "2024-01-19", leadTime: 14, abcClass: "A", turnoverRate: 5.3, daysOfStock: 57, status: "in_stock" },
    { id: "15", sku: "HOME-003", name: "Memory Foam Pillow", category: "Home & Garden", currentStock: 420, reorderPoint: 100, maxStock: 350, unitCost: 18, unitPrice: 49.99, monthlyDemand: 85, lastRestockDate: "2024-01-17", leadTime: 18, abcClass: "C", turnoverRate: 2.4, daysOfStock: 148, status: "overstocked" },
  ];
  return items;
};

// Generate trend data for the last 12 months
const generateTrendData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => ({
    month,
    stockValue: 85000 + Math.random() * 20000 - index * 500 + Math.sin(index / 2) * 5000,
    turnoverRate: 4.5 + Math.random() * 2 - 0.3,
    stockouts: Math.floor(Math.random() * 8),
    overstock: Math.floor(Math.random() * 5),
    itemsInStock: 2800 + Math.floor(Math.random() * 400) - index * 20,
    demand: 1200 + Math.floor(Math.random() * 300) + index * 30,
    fillRate: 85 + Math.floor(Math.random() * 12),
  }));
};

// ABC Analysis data
const abcAnalysisData = [
  { class: "A", itemCount: 4, percentage: 26.7, valuePercentage: 70, color: "#0F4C81", description: "High value, critical items" },
  { class: "B", itemCount: 5, percentage: 33.3, valuePercentage: 20, color: "#2E8B57", description: "Medium value, moderate importance" },
  { class: "C", itemCount: 6, percentage: 40, valuePercentage: 10, color: "#F59E0B", description: "Low value, high volume" },
];

// Category performance data
const categoryPerformance = [
  { category: "Electronics", stockValue: 28500, turnover: 7.2, items: 4, lowStock: 1, fillRate: 94 },
  { category: "Clothing", stockValue: 18200, turnover: 4.8, items: 2, lowStock: 0, fillRate: 100 },
  { category: "Home & Garden", stockValue: 15800, turnover: 3.9, items: 3, lowStock: 1, fillRate: 88 },
  { category: "Sports", stockValue: 6800, turnover: 6.4, items: 2, lowStock: 0, fillRate: 100 },
  { category: "Automotive", stockValue: 4200, turnover: 8.1, items: 2, lowStock: 0, fillRate: 50 },
  { category: "Health & Beauty", stockValue: 5100, turnover: 7.7, items: 2, lowStock: 1, fillRate: 50 },
];

// FAQs data
const faqData = [
  {
    question: "What is ABC Analysis and how is it used in inventory management?",
    answer: "ABC Analysis is an inventory categorization method that divides items into three categories (A, B, C) based on their importance. Class A items are high-value, critical items that require tight control. Class B items have medium value and moderate importance. Class C items are low-value but high-volume items that require simple controls.",
  },
  {
    question: "How is the Reorder Point (ROP) calculated?",
    answer: "The Reorder Point is calculated as: ROP = (Average Daily Demand × Lead Time) + Safety Stock. It represents the inventory level at which a new order should be placed to avoid stockouts during the lead time period.",
  },
  {
    question: "What does Turnover Rate indicate?",
    answer: "Inventory Turnover Rate measures how many times inventory is sold and replaced over a period. A higher turnover rate generally indicates efficient inventory management. The formula is: Turnover Rate = Cost of Goods Sold / Average Inventory Value.",
  },
  {
    question: "What is the ideal Days of Stock metric?",
    answer: "Days of Stock (also called Days of Supply) indicates how many days the current inventory will last at the current demand rate. An ideal range is typically 30-60 days, though this varies by industry. Too low indicates stockout risk; too high suggests overstocking.",
  },
  {
    question: "How does the Stock Health Score work?",
    answer: "The Stock Health Score is a percentage that reflects the proportion of items in optimal stock condition. It considers items that are in-stock (not low, out, or overstocked). A score above 80% is generally considered healthy.",
  },
  {
    question: "What actions should I take for low stock items?",
    answer: "For low stock items, you should: 1) Review historical demand patterns, 2) Check lead times with suppliers, 3) Place replenishment orders promptly, 4) Consider safety stock adjustments, and 5) Monitor closely until restocked.",
  },
];

// Hero features data
const heroFeatures = [
  { icon: BarChart3, title: "Real-time Analytics", description: "Monitor stock levels and trends", color: "text-[#0F4C81]" },
  { icon: AlertTriangle, title: "Smart Alerts", description: "Proactive reorder notifications", color: "text-[#F59E0B]" },
  { icon: Layers, title: "ABC Classification", description: "Prioritize critical inventory", color: "text-[#2E8B57]" },
  { icon: TrendingUp, title: "Demand Forecasting", description: "Predict future needs", color: "text-[#8B5CF6]" },
];

export function InventoryManagementDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currency, setCurrency] = useState("USD");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [abcFilter, setAbcFilter] = useState("all");

  const inventoryData = useMemo(() => generateInventoryData(), []);
  const trendData = useMemo(() => generateTrendData(), []);

  // Calculate dashboard metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const totalStockValue = inventoryData.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);
    const avgTurnover = inventoryData.reduce((sum, item) => sum + item.turnoverRate, 0) / inventoryData.length;
    const lowStock = inventoryData.filter(i => i.status === "low_stock").length;
    const outOfStock = inventoryData.filter(i => i.status === "out_of_stock").length;
    const overstocked = inventoryData.filter(i => i.status === "overstocked").length;
    const avgDaysOfStock = inventoryData.reduce((sum, item) => sum + item.daysOfStock, 0) / inventoryData.length;
    const inStockItems = inventoryData.filter(i => i.status === "in_stock").length;
    const stockHealthScore = (inStockItems / inventoryData.length) * 100;

    return {
      totalItems: inventoryData.length,
      totalStockValue,
      averageTurnover: parseFloat(avgTurnover.toFixed(1)),
      lowStockCount: lowStock,
      outOfStockCount: outOfStock,
      overstockedCount: overstocked,
      averageDaysOfStock: parseFloat(avgDaysOfStock.toFixed(1)),
      stockHealthScore: parseFloat(stockHealthScore.toFixed(1)),
    };
  }, [inventoryData]);

  // Filtered inventory items
  const filteredItems = useMemo(() => {
    return inventoryData.filter(item => {
      const matchesSearch = searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesAbc = abcFilter === "all" || item.abcClass === abcFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesAbc;
    });
  }, [inventoryData, searchQuery, categoryFilter, statusFilter, abcFilter]);

  // Reorder alerts
  const reorderAlerts = useMemo(() => {
    return inventoryData
      .filter(item => item.status === "low_stock" || item.status === "out_of_stock")
      .sort((a, b) => {
        if (a.status === "out_of_stock" && b.status !== "out_of_stock") return -1;
        if (a.status !== "out_of_stock" && b.status === "out_of_stock") return 1;
        return (a.currentStock / a.reorderPoint) - (b.currentStock / b.reorderPoint);
      });
  }, [inventoryData]);

  // Stock value by ABC class
  const stockValueByClass = useMemo(() => {
    return abcAnalysisData.map(abc => {
      const items = inventoryData.filter(i => i.abcClass === abc.class);
      const value = items.reduce((sum, i) => sum + i.currentStock * i.unitCost, 0);
      return { ...abc, value };
    });
  }, [inventoryData]);

  // Turnover distribution data
  const turnoverDistribution = useMemo(() => {
    const ranges = [
      { range: "0-3", label: "Very Low (<3)", count: 0, color: "#EF4444" },
      { range: "3-6", label: "Low (3-6)", count: 0, color: "#F59E0B" },
      { range: "6-9", label: "Good (6-9)", count: 0, color: "#2E8B57" },
      { range: "9+", label: "Excellent (>9)", count: 0, color: "#0F4C81" },
    ];
    inventoryData.forEach(item => {
      if (item.turnoverRate < 3) ranges[0].count++;
      else if (item.turnoverRate < 6) ranges[1].count++;
      else if (item.turnoverRate < 9) ranges[2].count++;
      else ranges[3].count++;
    });
    return ranges;
  }, [inventoryData]);

  // Radial bar data for health score
  const healthScoreData = [
    { name: "Health", value: metrics.stockHealthScore, fill: "#2E8B57" },
  ];

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    purple: "#8B5CF6",
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_stock":
        return { variant: "default" as const, label: "In Stock", color: "bg-[#2E8B57]", icon: CheckCircle2 };
      case "low_stock":
        return { variant: "secondary" as const, label: "Low Stock", color: "bg-amber-500", icon: AlertTriangle };
      case "out_of_stock":
        return { variant: "destructive" as const, label: "Out of Stock", color: "bg-red-500", icon: XCircle };
      case "overstocked":
        return { variant: "outline" as const, label: "Overstocked", color: "bg-purple-500", icon: AlertCircle };
      default:
        return { variant: "default" as const, label: status, color: "bg-gray-500", icon: Package };
    }
  };

  const getAbcBadge = (abcClass: string) => {
    switch (abcClass) {
      case "A":
        return <Badge className="bg-[#0F4C81]">A</Badge>;
      case "B":
        return <Badge className="bg-[#2E8B57]">B</Badge>;
      case "C":
        return <Badge className="bg-amber-500">C</Badge>;
      default:
        return <Badge>{abcClass}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#2E8B57]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            <Badge className="bg-white/20 text-white border-white/30">Inventory Dashboard</Badge>
          </div>
          
          <h1 className="text-4xl font-bold mb-3">
            Inventory Management
            <span className="block text-2xl font-normal text-white/80 mt-1">
              Real-time Control & Analytics
            </span>
          </h1>
          
          <p className="text-white/70 max-w-2xl mb-6">
            Monitor stock levels, optimize turnover rates, and never miss a reorder with intelligent alerts and comprehensive ABC analysis.
          </p>
          
          {/* Quick Stats in Hero */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-white/70" />
                <span className="text-sm text-white/70">Stock Value</span>
              </div>
              <p className="text-2xl font-bold">{formatCurrency(metrics.totalStockValue, currency)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Boxes className="h-5 w-5 text-white/70" />
                <span className="text-sm text-white/70">Total Items</span>
              </div>
              <p className="text-2xl font-bold">{metrics.totalItems}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-5 w-5 text-white/70" />
                <span className="text-sm text-white/70">Avg Turnover</span>
              </div>
              <p className="text-2xl font-bold">{metrics.averageTurnover}x</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-white/70" />
                <span className="text-sm text-white/70">Health Score</span>
              </div>
              <p className="text-2xl font-bold">{metrics.stockHealthScore}%</p>
            </div>
          </div>
          
          {/* Hero Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {heroFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <feature.icon className="h-5 w-5 text-white" />
                <div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-white/60">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-muted/50">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="stock-levels" className="flex items-center gap-2">
            <Boxes className="h-4 w-4" />
            <span className="hidden sm:inline">Stock Levels</span>
          </TabsTrigger>
          <TabsTrigger value="reorder-alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="abc-analysis" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">ABC Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-[#0F4C81]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Stock Value</p>
                    <p className="text-2xl font-bold text-[#0F4C81]">
                      {formatCurrency(metrics.totalStockValue, currency)}
                    </p>
                  </div>
                  <div className="p-3 bg-[#0F4C81]/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-[#0F4C81]" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-[#2E8B57]">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+12.5% vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#2E8B57]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Turnover Rate</p>
                    <p className="text-2xl font-bold text-[#2E8B57]">
                      {metrics.averageTurnover}x
                    </p>
                  </div>
                  <div className="p-3 bg-[#2E8B57]/10 rounded-full">
                    <RefreshCw className="h-6 w-6 text-[#2E8B57]" />
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-[#2E8B57]">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+0.8x vs target</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#2E8B57]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Stock Health</p>
                    <p className="text-2xl font-bold text-[#2E8B57]">
                      {metrics.stockHealthScore}%
                    </p>
                  </div>
                  <div className="p-3 bg-[#2E8B57]/10 rounded-full">
                    <Activity className="h-6 w-6 text-[#2E8B57]" />
                  </div>
                </div>
                <Progress value={metrics.stockHealthScore} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Days of Stock</p>
                    <p className="text-2xl font-bold text-amber-500">
                      {metrics.averageDaysOfStock}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-500/10 rounded-full">
                    <Clock className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Average across all items</p>
              </CardContent>
            </Card>
          </div>

          {/* Alert Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-500">{metrics.outOfStockCount}</p>
                    <p className="text-sm text-muted-foreground">Out of Stock Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-full">
                    <AlertTriangle className="h-8 w-8 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-amber-500">{metrics.lowStockCount}</p>
                    <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-purple-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-full">
                    <AlertCircle className="h-8 w-8 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-500">{metrics.overstockedCount}</p>
                    <p className="text-sm text-muted-foreground">Overstocked Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Stock Value Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                  Stock Value Trend
                </CardTitle>
                <CardDescription>Monthly stock value over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Area type="monotone" dataKey="stockValue" stroke={chartColors.ocean} fill={chartColors.ocean} fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                  Category Performance
                </CardTitle>
                <CardDescription>Stock value and turnover by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={categoryPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <YAxis dataKey="category" type="category" width={80} />
                      <Tooltip formatter={(value: number, name: string) => [
                        name === "stockValue" ? formatCurrency(value, currency) : `${value.toFixed(1)}x`,
                        name === "stockValue" ? "Stock Value" : "Turnover"
                      ]} />
                      <Legend />
                      <Bar dataKey="stockValue" fill={chartColors.ocean} name="Stock Value" radius={[0, 4, 4, 0]} />
                      <Line dataKey="turnover" stroke={chartColors.logistics} strokeWidth={2} name="Turnover" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ABC Summary & Turnover Distribution */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#0F4C81]" />
                  ABC Classification Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={stockValueByClass}
                        dataKey="value"
                        nameKey="class"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label={({ class: cls, value }) => `${cls}: ${formatCurrency(value, currency)}`}
                      >
                        {stockValueByClass.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {stockValueByClass.map(abc => (
                    <div key={abc.class} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: abc.color }} />
                        <span className="text-sm">Class {abc.class}</span>
                        <span className="text-xs text-muted-foreground">({abc.itemCount} items)</span>
                      </div>
                      <span className="font-medium">{formatCurrency(abc.value, currency)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-[#2E8B57]" />
                  Turnover Rate Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={turnoverDistribution}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Items" radius={[4, 4, 0, 0]}>
                        {turnoverDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                  {turnoverDistribution.map(t => (
                    <div key={t.range} className="p-2 bg-muted/50 rounded">
                      <p className="font-bold text-lg" style={{ color: t.color }}>{t.count}</p>
                      <p className="text-muted-foreground">{t.range}x</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Stock Levels Tab */}
        <TabsContent value="stock-levels" className="space-y-6 mt-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by SKU or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                    <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="overstocked">Overstocked</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={abcFilter} onValueChange={setAbcFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="ABC Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="A">Class A</SelectItem>
                    <SelectItem value="B">Class B</SelectItem>
                    <SelectItem value="C">Class C</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.slice(0, 10).map((c) => (
                      <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stock Levels Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const statusBadge = getStatusBadge(item.status);
              const StatusIcon = statusBadge.icon;
              const stockPercentage = (item.currentStock / item.maxStock) * 100;
              const reorderPercentage = (item.reorderPoint / item.maxStock) * 100;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`h-full ${item.status === "out_of_stock" ? "border-red-500/50" : item.status === "low_stock" ? "border-amber-500/50" : ""}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                          <CardDescription className="text-xs">{item.sku}</CardDescription>
                        </div>
                        <div className="flex gap-1">
                          {getAbcBadge(item.abcClass)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={statusBadge.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>

                      {/* Stock Level Bar */}
                      <div className="relative">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${stockPercentage}%`,
                              backgroundColor: item.status === "out_of_stock" ? chartColors.danger :
                                item.status === "low_stock" ? chartColors.warning :
                                item.status === "overstocked" ? chartColors.purple : chartColors.logistics
                            }}
                          />
                        </div>
                        <div
                          className="absolute top-0 h-3 w-0.5 bg-red-500"
                          style={{ left: `${reorderPercentage}%` }}
                          title="Reorder Point"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div>
                          <p className="font-bold text-lg">{item.currentStock}</p>
                          <p className="text-muted-foreground">Current</p>
                        </div>
                        <div>
                          <p className="font-bold text-lg text-amber-500">{item.reorderPoint}</p>
                          <p className="text-muted-foreground">ROP</p>
                        </div>
                        <div>
                          <p className="font-bold text-lg">{item.maxStock}</p>
                          <p className="text-muted-foreground">Max</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="font-medium">{formatCurrency(item.currentStock * item.unitCost, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Turnover:</span>
                          <span className="font-medium">{item.turnoverRate}x</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Days Stock:</span>
                          <span className={`font-medium ${item.daysOfStock < 14 ? "text-red-500" : item.daysOfStock < 30 ? "text-amber-500" : ""}`}>
                            {item.daysOfStock}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lead Time:</span>
                          <span className="font-medium">{item.leadTime}d</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Reorder Alerts Tab */}
        <TabsContent value="reorder-alerts" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Alert Summary */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Alert Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-500/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Critical</span>
                    </div>
                    <Badge className="bg-red-500">{metrics.outOfStockCount}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Items with zero stock - immediate action required</p>
                </div>

                <div className="p-4 bg-amber-500/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">Warning</span>
                    </div>
                    <Badge className="bg-amber-500">{metrics.lowStockCount}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Items below reorder point - order soon</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Quick Actions</h4>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Reorder List
                  </Button>
                  <Button className="w-full bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                    <Package className="h-4 w-4 mr-2" />
                    Generate Purchase Orders
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Alert Items List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Items Requiring Attention</CardTitle>
                <CardDescription>Sorted by urgency - most critical first</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {reorderAlerts.map((item) => {
                      const statusBadge = getStatusBadge(item.status);
                      const StatusIcon = statusBadge.icon;
                      const shortage = item.reorderPoint - item.currentStock;
                      const orderQuantity = Math.max(shortage, Math.ceil(item.monthlyDemand * (item.leadTime / 30) * 1.5));

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-lg border ${
                            item.status === "out_of_stock"
                              ? "bg-red-500/5 border-red-500/30"
                              : "bg-amber-500/5 border-amber-500/30"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <StatusIcon className={`h-4 w-4 ${item.status === "out_of_stock" ? "text-red-500" : "text-amber-500"}`} />
                                <span className="font-medium">{item.name}</span>
                                {getAbcBadge(item.abcClass)}
                              </div>
                              <p className="text-xs text-muted-foreground">{item.sku} • {item.category}</p>
                            </div>
                            <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
                          </div>

                          <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Current Stock</p>
                              <p className="font-bold">{item.currentStock}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Reorder Point</p>
                              <p className="font-bold text-amber-500">{item.reorderPoint}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Shortage</p>
                              <p className="font-bold text-red-500">{shortage}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Suggested Order</p>
                              <p className="font-bold text-[#2E8B57]">{orderQuantity}</p>
                            </div>
                          </div>

                          <div className="mt-3 flex gap-2">
                            <Button size="sm" className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                              <Package className="h-3 w-3 mr-1" />
                              Order Now
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ABC Analysis Tab */}
        <TabsContent value="abc-analysis" className="space-y-6 mt-6">
          {/* ABC Overview Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {abcAnalysisData.map((abc) => (
              <Card key={abc.class} className="relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: abc.color }}
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: abc.color }}
                      >
                        {abc.class}
                      </div>
                      Class {abc.class}
                    </CardTitle>
                    <Badge style={{ backgroundColor: abc.color }}>
                      {abc.percentage}%
                    </Badge>
                  </div>
                  <CardDescription>{abc.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-medium">{abc.itemCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Value Contribution:</span>
                      <span className="font-medium">{abc.valuePercentage}%</span>
                    </div>
                    <Progress value={abc.valuePercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed ABC Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed ABC Classification</CardTitle>
              <CardDescription>Complete breakdown of items by classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {["A", "B", "C"].map((cls) => {
                  const classItems = inventoryData.filter(i => i.abcClass === cls);
                  const classInfo = abcAnalysisData.find(a => a.class === cls);
                  
                  return (
                    <div key={cls}>
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: classInfo?.color }}
                        >
                          {cls}
                        </div>
                        <h3 className="font-medium">Class {cls} Items ({classItems.length})</h3>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {classItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg border bg-muted/30"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.sku}</p>
                              </div>
                              <Badge className={getStatusBadge(item.status).color}>
                                {getStatusBadge(item.status).label}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <p className="text-muted-foreground">Stock Value</p>
                                <p className="font-medium">{formatCurrency(item.currentStock * item.unitCost, currency)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Turnover</p>
                                <p className="font-medium">{item.turnoverRate}x</p>
                              </div>
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
          {/* Stock Value Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                Stock Value Trend
              </CardTitle>
              <CardDescription>Historical stock value and demand patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "stockValue" ? formatCurrency(value, currency) :
                        name === "demand" ? `${value} units` : value,
                        name === "stockValue" ? "Stock Value" : name === "demand" ? "Demand" : "Items"
                      ]}
                    />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="stockValue" fill={chartColors.ocean} fillOpacity={0.3} stroke={chartColors.ocean} name="Stock Value" />
                    <Line yAxisId="right" type="monotone" dataKey="demand" stroke={chartColors.logistics} strokeWidth={2} name="Demand" dot={{ fill: chartColors.logistics }} />
                    <Line yAxisId="right" type="monotone" dataKey="itemsInStock" stroke={chartColors.purple} strokeWidth={2} name="Items in Stock" dot={{ fill: chartColors.purple }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Turnover Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-[#2E8B57]" />
                Turnover Rate Trend
              </CardTitle>
              <CardDescription>Monthly inventory turnover performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 10]} tickFormatter={(v) => `${v}x`} />
                    <Tooltip formatter={(value: number) => `${value.toFixed(1)}x`} />
                    <ReferenceLine y={5} stroke={chartColors.warning} strokeDasharray="5 5" label={{ value: "Target", fill: chartColors.warning }} />
                    <Area type="monotone" dataKey="turnoverRate" stroke={chartColors.logistics} fill={chartColors.logistics} fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Stock Issues Trend */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Stockout Incidents
                </CardTitle>
                <CardDescription>Monthly stockout occurrences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="stockouts" fill={chartColors.danger} name="Stockouts" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-500" />
                  Overstock Incidents
                </CardTitle>
                <CardDescription>Monthly overstock occurrences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="overstock" fill={chartColors.purple} name="Overstock Items" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-[#0F4C81]" />
                Category Stock Value Distribution
              </CardTitle>
              <CardDescription>Current stock value breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryPerformance}
                        dataKey="stockValue"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ category, stockValue }) => `${category}: ${formatCurrency(stockValue, currency)}`}
                      >
                        <Cell fill={chartColors.ocean} />
                        <Cell fill={chartColors.logistics} />
                        <Cell fill={chartColors.warning} />
                        <Cell fill={chartColors.purple} />
                        <Cell fill="#06B6D4" />
                        <Cell fill="#EC4899" />
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {categoryPerformance.map((cat, index) => {
                    const colors = [chartColors.ocean, chartColors.logistics, chartColors.warning, chartColors.purple, "#06B6D4", "#EC4899"];
                    return (
                      <div key={cat.category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors[index] }} />
                          <div>
                            <p className="font-medium">{cat.category}</p>
                            <p className="text-xs text-muted-foreground">{cat.items} items • {cat.turnover}x turnover</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(cat.stockValue, currency)}</p>
                          <p className="text-xs text-muted-foreground">{cat.fillRate}% fill rate</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQs Section */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0F4C81]/10 rounded-lg">
              <HelpCircle className="h-6 w-6 text-[#0F4C81]" />
            </div>
            <div>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Learn more about inventory management concepts</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-[#0F4C81]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[#0F4C81]">{index + 1}</span>
                    </div>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Footer Section */}
      <div className="text-center py-6 border-t">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Package className="h-4 w-4 text-[#0F4C81]" />
          <span className="text-sm">Inventory Management Dashboard</span>
          <span className="text-xs">•</span>
          <span className="text-sm">Powered by</span>
          <span className="text-sm font-medium text-[#2E8B57]">LogiTrack Pro</span>
        </div>
      </div>
    </div>
  );
}
