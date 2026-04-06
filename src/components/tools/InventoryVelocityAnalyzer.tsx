'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Target,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Filter,
  Download,
  Info,
  ShoppingCart,
  Gauge,
  Layers,
  DollarSign,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Area,
  ScatterChart,
  Scatter,
  ReferenceLine,
} from 'recharts';
import { currencies, formatCurrency } from '@/lib/constants/currencies';

// Types
interface SKUData {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  avgDailyDemand: number;
  daysOfStock: number;
  turnoverRate: number;
  velocity: 'fast' | 'medium' | 'slow';
  lastSaleDate: Date | null;
  lastRestockDate: Date;
  unitCost: number;
  sellingPrice: number;
  leadTime: number;
  reorderPoint: number;
  suggestedOrderQty: number;
  stockStatus: 'overstocked' | 'optimal' | 'understocked' | 'critical';
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  monthlyDemand: number[];
}

interface VelocityAnalysisResult {
  fastMoving: SKUData[];
  mediumMoving: SKUData[];
  slowMoving: SKUData[];
  criticalItems: SKUData[];
  overstockedItems: SKUData[];
  understockedItems: SKUData[];
  avgTurnoverRate: number;
  totalSKUValue: number;
  velocityDistribution: { name: string; value: number; color: string }[];
  demandPatterns: { category: string; trend: string; change: number }[];
  reorderRecommendations: { sku: string; name: string; currentStock: number; suggestedQty: number; urgency: string }[];
}

// Sample data generator
const generateSampleSKUData = (): SKUData[] => {
  const categories = ['Electronics', 'Apparel', 'Home & Garden', 'Sports', 'Automotive', 'Health & Beauty'];
  const skus: SKUData[] = [];
  
  for (let i = 1; i <= 30; i++) {
    const avgDailyDemand = Math.floor(Math.random() * 50) + 1;
    const currentStock = Math.floor(Math.random() * 500) + 10;
    const daysOfStock = avgDailyDemand > 0 ? Math.floor(currentStock / avgDailyDemand) : 999;
    const leadTime = Math.floor(Math.random() * 14) + 3;
    
    // Generate monthly demand pattern
    const baseDemand = avgDailyDemand * 30;
    const monthlyDemand = Array.from({ length: 6 }, () => 
      Math.floor(baseDemand * (0.8 + Math.random() * 0.4))
    );
    
    // Determine velocity
    let velocity: 'fast' | 'medium' | 'slow';
    if (avgDailyDemand >= 20) velocity = 'fast';
    else if (avgDailyDemand >= 8) velocity = 'medium';
    else velocity = 'slow';
    
    // Determine stock status
    let stockStatus: 'overstocked' | 'optimal' | 'understocked' | 'critical';
    const safetyStock = avgDailyDemand * leadTime * 1.5;
    const reorderPoint = avgDailyDemand * leadTime + safetyStock;
    
    if (daysOfStock > 90) stockStatus = 'overstocked';
    else if (currentStock < safetyStock * 0.5) stockStatus = 'critical';
    else if (currentStock < reorderPoint) stockStatus = 'understocked';
    else stockStatus = 'optimal';
    
    // Determine demand trend
    const recentTrend = monthlyDemand.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const earlierTrend = monthlyDemand.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    let demandTrend: 'increasing' | 'stable' | 'decreasing';
    if (recentTrend > earlierTrend * 1.1) demandTrend = 'increasing';
    else if (recentTrend < earlierTrend * 0.9) demandTrend = 'decreasing';
    else demandTrend = 'stable';
    
    skus.push({
      id: `SKU-${String(i).padStart(5, '0')}`,
      sku: `SKU-${String(i).padStart(5, '0')}`,
      name: `Product Item ${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      currentStock,
      avgDailyDemand,
      daysOfStock,
      turnoverRate: avgDailyDemand > 0 ? Math.round((365 / (currentStock / avgDailyDemand)) * 10) / 10 : 0,
      velocity,
      lastSaleDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      lastRestockDate: new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000),
      unitCost: Math.floor(Math.random() * 100) + 10,
      sellingPrice: Math.floor(Math.random() * 200) + 50,
      leadTime,
      reorderPoint: Math.round(reorderPoint),
      suggestedOrderQty: Math.round(avgDailyDemand * 30 * 1.2),
      stockStatus,
      demandTrend,
      monthlyDemand,
    });
  }
  
  return skus;
};

// Brand colors
const COLORS = {
  ocean: '#0F4C81',
  logistics: '#2E8B57',
  warning: '#F59E0B',
  danger: '#EF4444',
  success: '#10B981',
  fast: '#10B981',
  medium: '#0F4C81',
  slow: '#F59E0B',
};

export default function InventoryVelocityAnalyzer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currency, setCurrency] = useState('USD');
  const [fastThreshold, setFastThreshold] = useState(20);
  const [slowThreshold, setSlowThreshold] = useState(8);
  const [criticalDays, setCriticalDays] = useState(7);
  const [overstockDays, setOverstockDays] = useState(90);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVelocity, setFilterVelocity] = useState('all');
  const [sortField, setSortField] = useState<keyof SKUData>('turnoverRate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Generate sample data
  const [skuData] = useState<SKUData[]>(generateSampleSKUData);
  
  // Velocity Analysis
  const analysis = useMemo((): VelocityAnalysisResult => {
    // Classify by velocity
    const fastMoving = skuData.filter(s => s.velocity === 'fast');
    const mediumMoving = skuData.filter(s => s.velocity === 'medium');
    const slowMoving = skuData.filter(s => s.velocity === 'slow');
    
    // Critical items (low stock)
    const criticalItems = skuData.filter(s => s.stockStatus === 'critical' || s.daysOfStock <= criticalDays);
    
    // Overstocked items
    const overstockedItems = skuData.filter(s => s.daysOfStock >= overstockDays);
    
    // Understocked items
    const understockedItems = skuData.filter(s => s.stockStatus === 'understocked');
    
    // Average turnover rate
    const avgTurnoverRate = skuData.reduce((sum, s) => sum + s.turnoverRate, 0) / skuData.length;
    
    // Total SKU value
    const totalSKUValue = skuData.reduce((sum, s) => sum + s.currentStock * s.unitCost, 0);
    
    // Velocity distribution for pie chart
    const velocityDistribution = [
      { name: 'Fast Moving', value: fastMoving.length, color: COLORS.fast },
      { name: 'Medium Moving', value: mediumMoving.length, color: COLORS.medium },
      { name: 'Slow Moving', value: slowMoving.length, color: COLORS.slow },
    ];
    
    // Demand patterns by category
    const categoryPatterns = new Map<string, { total: number; count: number; trends: string[] }>();
    skuData.forEach(s => {
      if (!categoryPatterns.has(s.category)) {
        categoryPatterns.set(s.category, { total: 0, count: 0, trends: [] });
      }
      const cat = categoryPatterns.get(s.category)!;
      cat.total += s.avgDailyDemand;
      cat.count += 1;
      cat.trends.push(s.demandTrend);
    });
    
    const demandPatterns = Array.from(categoryPatterns.entries()).map(([category, data]) => {
      const increasing = data.trends.filter(t => t === 'increasing').length;
      const trend = increasing > data.count / 2 ? 'Rising' : 
                    increasing < data.count / 3 ? 'Falling' : 'Stable';
      const change = trend === 'Rising' ? Math.random() * 15 + 5 :
                     trend === 'Falling' ? -(Math.random() * 15 + 5) : 
                     (Math.random() * 6 - 3);
      return { category, trend, change: Math.round(change * 10) / 10 };
    });
    
    // Reorder recommendations
    const reorderRecommendations = skuData
      .filter(s => s.stockStatus === 'critical' || s.stockStatus === 'understocked')
      .sort((a, b) => a.daysOfStock - b.daysOfStock)
      .map(s => ({
        sku: s.sku,
        name: s.name,
        currentStock: s.currentStock,
        suggestedQty: s.suggestedOrderQty,
        urgency: s.daysOfStock <= criticalDays ? 'Critical' : 
                 s.daysOfStock <= s.leadTime ? 'High' : 'Medium',
      }));
    
    return {
      fastMoving,
      mediumMoving,
      slowMoving,
      criticalItems,
      overstockedItems,
      understockedItems,
      avgTurnoverRate,
      totalSKUValue,
      velocityDistribution,
      demandPatterns,
      reorderRecommendations,
    };
  }, [skuData, criticalDays, overstockDays]);
  
  // Filtered and sorted data
  const filteredData = useMemo(() => {
    let result = [...skuData];
    
    if (filterCategory !== 'all') {
      result = result.filter(s => s.category === filterCategory);
    }
    
    if (filterVelocity !== 'all') {
      result = result.filter(s => s.velocity === filterVelocity);
    }
    
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return 0;
    });
    
    return result;
  }, [skuData, filterCategory, filterVelocity, sortField, sortDirection]);
  
  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(skuData.map(s => s.category)));
  }, [skuData]);
  
  // Turnover distribution chart data
  const turnoverDistribution = useMemo(() => {
    const bins = [
      { range: '0-2', count: 0, color: COLORS.danger },
      { range: '2-5', count: 0, color: COLORS.slow },
      { range: '5-10', count: 0, color: COLORS.medium },
      { range: '10-20', count: 0, color: COLORS.logistics },
      { range: '20+', count: 0, color: COLORS.fast },
    ];
    
    skuData.forEach(s => {
      if (s.turnoverRate < 2) bins[0].count++;
      else if (s.turnoverRate < 5) bins[1].count++;
      else if (s.turnoverRate < 10) bins[2].count++;
      else if (s.turnoverRate < 20) bins[3].count++;
      else bins[4].count++;
    });
    
    return bins;
  }, [skuData]);
  
  // Handle sort
  const handleSort = (field: keyof SKUData) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Get velocity badge
  const getVelocityBadge = (velocity: string) => {
    switch (velocity) {
      case 'fast':
        return <Badge className="bg-emerald-500">Fast</Badge>;
      case 'medium':
        return <Badge style={{ backgroundColor: COLORS.ocean }}>Medium</Badge>;
      case 'slow':
        return <Badge className="bg-amber-500">Slow</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get stock status badge
  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge className="bg-red-500">Critical</Badge>;
      case 'understocked':
        return <Badge className="bg-amber-500">Understocked</Badge>;
      case 'optimal':
        return <Badge className="bg-emerald-500">Optimal</Badge>;
      case 'overstocked':
        return <Badge className="bg-blue-500">Overstocked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <Gauge className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Inventory Velocity Analyzer
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Analyze SKU movement patterns, identify slow and fast-moving items, and optimize your inventory turnover
          </p>
        </motion.div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="velocity">Velocity Analysis</TabsTrigger>
            <TabsTrigger value="slow-moving">Slow Moving</TabsTrigger>
            <TabsTrigger value="fast-moving">Fast Moving</TabsTrigger>
            <TabsTrigger value="reorder">Reorder Suggestions</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Average Turnover</p>
                      <p className="text-2xl font-bold text-[#0F4C81]">
                        {analysis.avgTurnoverRate.toFixed(1)}x
                      </p>
                      <p className="text-xs text-slate-400">per year</p>
                    </div>
                    <RefreshCw className="h-10 w-10 text-[#0F4C81]/20" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Total Inventory Value</p>
                      <p className="text-2xl font-bold text-[#2E8B57]">
                        {formatCurrency(analysis.totalSKUValue, currency)}
                      </p>
                      <p className="text-xs text-slate-400">{skuData.length} SKUs</p>
                    </div>
                    <DollarSign className="h-10 w-10 text-[#2E8B57]/20" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg border-amber-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Slow Moving Items</p>
                      <p className="text-2xl font-bold text-amber-500">
                        {analysis.slowMoving.length}
                      </p>
                      <p className="text-xs text-slate-400">need attention</p>
                    </div>
                    <AlertTriangle className="h-10 w-10 text-amber-500/20" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg border-red-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">Critical Stock Items</p>
                      <p className="text-2xl font-bold text-red-500">
                        {analysis.criticalItems.length}
                      </p>
                      <p className="text-xs text-slate-400">reorder now</p>
                    </div>
                    <AlertCircle className="h-10 w-10 text-red-500/20" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Velocity Distribution Pie Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-[#0F4C81]" />
                    Velocity Distribution
                  </CardTitle>
                  <CardDescription>SKU count by velocity classification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={analysis.velocityDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {analysis.velocityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Turnover Distribution Bar Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
                    Turnover Rate Distribution
                  </CardTitle>
                  <CardDescription>SKU count by turnover rate range</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={turnoverDistribution}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {turnoverDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Demand Patterns */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                  Demand Patterns by Category
                </CardTitle>
                <CardDescription>Trend analysis across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {analysis.demandPatterns.map((pattern) => (
                    <div
                      key={pattern.category}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{pattern.category}</span>
                        {getTrendIcon(pattern.change > 0 ? 'increasing' : pattern.change < 0 ? 'decreasing' : 'stable')}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            pattern.trend === 'Rising' ? 'bg-emerald-500' :
                            pattern.trend === 'Falling' ? 'bg-red-500' : 'bg-slate-500'
                          }
                        >
                          {pattern.trend}
                        </Badge>
                        <span className={`text-sm ${pattern.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {pattern.change >= 0 ? '+' : ''}{pattern.change}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/20 rounded-lg">
                      <Zap className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">{analysis.fastMoving.length}</p>
                      <p className="text-sm text-slate-600">Fast Moving SKUs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#0F4C81]/20 rounded-lg">
                      <Activity className="h-6 w-6 text-[#0F4C81]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#0F4C81]">{analysis.mediumMoving.length}</p>
                      <p className="text-sm text-slate-600">Medium Moving SKUs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-lg">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600">{analysis.slowMoving.length}</p>
                      <p className="text-sm text-slate-600">Slow Moving SKUs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Velocity Analysis Tab */}
          <TabsContent value="velocity" className="space-y-6">
            {/* Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[#0F4C81]" />
                  Analysis Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <Label>Fast Moving Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={fastThreshold}
                        onChange={(e) => setFastThreshold(parseInt(e.target.value) || 20)}
                      />
                      <span className="text-sm text-slate-500">units/day</span>
                    </div>
                  </div>
                  <div>
                    <Label>Slow Moving Threshold</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={slowThreshold}
                        onChange={(e) => setSlowThreshold(parseInt(e.target.value) || 8)}
                      />
                      <span className="text-sm text-slate-500">units/day</span>
                    </div>
                  </div>
                  <div>
                    <Label>Critical Days</Label>
                    <Input
                      type="number"
                      value={criticalDays}
                      onChange={(e) => setCriticalDays(parseInt(e.target.value) || 7)}
                    />
                  </div>
                  <div>
                    <Label>Overstock Days</Label>
                    <Input
                      type="number"
                      value={overstockDays}
                      onChange={(e) => setOverstockDays(parseInt(e.target.value) || 90)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Filters */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterVelocity} onValueChange={setFilterVelocity}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Velocity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Velocities</SelectItem>
                      <SelectItem value="fast">Fast Moving</SelectItem>
                      <SelectItem value="medium">Medium Moving</SelectItem>
                      <SelectItem value="slow">Slow Moving</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* SKU Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>SKU Velocity Analysis</CardTitle>
                <CardDescription>
                  Showing {filteredData.length} of {skuData.length} SKUs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('sku')}
                        >
                          <div className="flex items-center gap-1">
                            SKU <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('currentStock')}
                        >
                          <div className="flex items-center gap-1">
                            Stock <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('avgDailyDemand')}
                        >
                          <div className="flex items-center gap-1">
                            Daily Demand <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('turnoverRate')}
                        >
                          <div className="flex items-center gap-1">
                            Turnover <ArrowUpDown className="h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Days of Stock</TableHead>
                        <TableHead>Velocity</TableHead>
                        <TableHead>Stock Status</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.slice(0, 20).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.currentStock.toLocaleString()}</TableCell>
                          <TableCell className="font-medium">{item.avgDailyDemand}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {item.turnoverRate.toFixed(1)}x
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                item.daysOfStock <= 7 ? 'bg-red-500' :
                                item.daysOfStock <= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                              }
                            >
                              {item.daysOfStock} days
                            </Badge>
                          </TableCell>
                          <TableCell>{getVelocityBadge(item.velocity)}</TableCell>
                          <TableCell>{getStockStatusBadge(item.stockStatus)}</TableCell>
                          <TableCell>{getTrendIcon(item.demandTrend)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {filteredData.length > 20 && (
                  <p className="text-sm text-slate-500 text-center mt-4">
                    Showing 20 of {filteredData.length} items
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Slow Moving Tab */}
          <TabsContent value="slow-moving" className="space-y-6">
            <Card className="border-0 shadow-lg border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Slow-Moving Inventory Analysis
                </CardTitle>
                <CardDescription>
                  Items with low velocity requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                    <div>
                      <p className="font-medium text-amber-700 dark:text-amber-400">
                        {analysis.slowMoving.length} slow-moving items identified
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Consider promotions, bundling, or liquidation strategies for these items
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Daily Demand</TableHead>
                        <TableHead>Days of Stock</TableHead>
                        <TableHead>Inventory Value</TableHead>
                        <TableHead>Last Sale</TableHead>
                        <TableHead>Recommendation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.slowMoving.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.currentStock.toLocaleString()}</TableCell>
                          <TableCell>{item.avgDailyDemand}</TableCell>
                          <TableCell>
                            <Badge className="bg-amber-500">{item.daysOfStock} days</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(item.currentStock * item.unitCost, currency)}
                          </TableCell>
                          <TableCell>
                            {item.lastSaleDate
                              ? new Date(item.lastSaleDate).toLocaleDateString()
                              : <span className="text-red-500">Never</span>
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                              {item.daysOfStock > 180 ? 'Liquidate' : 'Promote'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            {/* Overstocked Items */}
            <Card className="border-0 shadow-lg border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Overstocked Items ({overstockDays}+ days of stock)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Days of Stock</TableHead>
                        <TableHead>Value Tied Up</TableHead>
                        <TableHead>Carrying Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.overstockedItems.slice(0, 10).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell>{item.currentStock.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-500">{item.daysOfStock} days</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(item.currentStock * item.unitCost, currency)}
                          </TableCell>
                          <TableCell className="text-red-500">
                            {formatCurrency(item.currentStock * item.unitCost * 0.25, currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Fast Moving Tab */}
          <TabsContent value="fast-moving" className="space-y-6">
            <Card className="border-0 shadow-lg border-emerald-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-500" />
                  Fast-Moving Inventory Analysis
                </CardTitle>
                <CardDescription>
                  High-velocity items requiring close monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    <div>
                      <p className="font-medium text-emerald-700 dark:text-emerald-400">
                        {analysis.fastMoving.length} fast-moving items driving revenue
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Monitor stock levels closely to avoid stockouts
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Fast Moving Table */}
                  <div className="max-h-80 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>SKU</TableHead>
                          <TableHead>Daily Demand</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Days Left</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analysis.fastMoving.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                            <TableCell className="font-medium text-emerald-600">
                              {item.avgDailyDemand}
                            </TableCell>
                            <TableCell>{item.currentStock.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  item.daysOfStock <= 7 ? 'bg-red-500' :
                                  item.daysOfStock <= 14 ? 'bg-amber-500' : 'bg-emerald-500'
                                }
                              >
                                {item.daysOfStock} days
                              </Badge>
                            </TableCell>
                            <TableCell>{getStockStatusBadge(item.stockStatus)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Demand Chart */}
                  <div>
                    <h4 className="font-semibold mb-4">Fast Mover Demand Trend</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analysis.fastMoving.slice(0, 5).map((item, idx) => ({
                            name: item.sku,
                            month1: item.monthlyDemand[0],
                            month2: item.monthlyDemand[1],
                            month3: item.monthlyDemand[2],
                            month4: item.monthlyDemand[3],
                            month5: item.monthlyDemand[4],
                            month6: item.monthlyDemand[5],
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="month1" stroke={COLORS.ocean} strokeWidth={2} />
                          <Line type="monotone" dataKey="month2" stroke={COLORS.logistics} strokeWidth={2} />
                          <Line type="monotone" dataKey="month3" stroke={COLORS.warning} strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Fast Moving Performance Metrics */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Avg Turnover (Fast)</p>
                    <p className="text-3xl font-bold text-emerald-500">
                      {(analysis.fastMoving.reduce((sum, s) => sum + s.turnoverRate, 0) / analysis.fastMoving.length || 0).toFixed(1)}x
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Total Daily Demand</p>
                    <p className="text-3xl font-bold text-[#0F4C81]">
                      {analysis.fastMoving.reduce((sum, s) => sum + s.avgDailyDemand, 0).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-slate-500">Stock Value</p>
                    <p className="text-3xl font-bold text-[#2E8B57]">
                      {formatCurrency(analysis.fastMoving.reduce((sum, s) => sum + s.currentStock * s.unitCost, 0), currency)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Reorder Suggestions Tab */}
          <TabsContent value="reorder" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-[#0F4C81]" />
                  Reorder Suggestions
                </CardTitle>
                <CardDescription>
                  Items requiring immediate or upcoming reorder
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Urgency Summary */}
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-700 dark:text-red-400">Critical</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">
                      {analysis.reorderRecommendations.filter(r => r.urgency === 'Critical').length}
                    </p>
                    <p className="text-xs text-slate-500">Reorder immediately</p>
                  </div>
                  
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="font-semibold text-amber-700 dark:text-amber-400">High</span>
                    </div>
                    <p className="text-2xl font-bold text-amber-600">
                      {analysis.reorderRecommendations.filter(r => r.urgency === 'High').length}
                    </p>
                    <p className="text-xs text-slate-500">Order within days</p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-blue-700 dark:text-blue-400">Medium</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {analysis.reorderRecommendations.filter(r => r.urgency === 'Medium').length}
                    </p>
                    <p className="text-xs text-slate-500">Order within weeks</p>
                  </div>
                </div>
                
                {/* Reorder Table */}
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Suggested Order Qty</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.reorderRecommendations.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.currentStock.toLocaleString()}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-[#2E8B57]">
                            {item.suggestedQty.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                item.urgency === 'Critical' ? 'bg-red-500' :
                                item.urgency === 'High' ? 'bg-amber-500' : 'bg-blue-500'
                              }
                            >
                              {item.urgency}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57]">
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Create PO
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            {/* Reorder Parameters Guide */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#0F4C81]" />
                  Reorder Calculation Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Reorder Point Formula</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Reorder Point = (Average Daily Demand × Lead Time) + Safety Stock
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-700 rounded text-xs font-mono">
                      RP = (D × L) + SS
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Safety Stock Calculation</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Safety Stock = Average Daily Demand × Lead Time × Safety Factor
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-700 rounded text-xs font-mono">
                      SS = D × L × 1.5
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Suggested Order Quantity</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Based on 30-day demand coverage with 20% buffer
                    </p>
                    <div className="p-2 bg-white dark:bg-slate-700 rounded text-xs font-mono">
                      Q = D × 30 × 1.2
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
