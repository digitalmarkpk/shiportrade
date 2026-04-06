"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Ship,
  Bell,
  BellRing,
  RefreshCw,
  Download,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Globe,
  Anchor,
  Container,
  BarChart3,
  Target,
  Zap,
  AlertCircle,
  Clock,
  DollarSign,
  Percent,
  ChevronRight,
  Settings,
  Plus,
  Trash2,
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
  ComposedChart,
  Bar,
  Legend,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  oceanLight: "#1A6FA8",
  logistics: "#2E8B57",
  logisticsLight: "#3CB371",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#22C55E",
  neutral: "#6B7280",
  purple: "#8B5CF6",
};

// Trade lanes data
const TRADE_LANES = [
  { id: "asia-europe", name: "Asia - Europe", origin: "Shanghai", destination: "Rotterdam", distance: 10500 },
  { id: "asia-med", name: "Asia - Mediterranean", origin: "Shanghai", destination: "Genoa", distance: 9800 },
  { id: "asia-usc", name: "Asia - US West Coast", origin: "Shanghai", destination: "Los Angeles", distance: 6500 },
  { id: "asia-usec", name: "Asia - US East Coast", origin: "Shanghai", destination: "New York", distance: 11000 },
  { id: "europe-usc", name: "Europe - US West Coast", origin: "Rotterdam", destination: "Los Angeles", distance: 7800 },
  { id: "europe-usec", name: "Europe - US East Coast", origin: "Rotterdam", destination: "New York", distance: 3500 },
  { id: "transpacific", name: "Transpacific", origin: "Busan", destination: "Long Beach", distance: 5200 },
  { id: "intra-asia", name: "Intra-Asia", origin: "Singapore", destination: "Hong Kong", distance: 1600 },
];

// Container types
const CONTAINER_TYPES = [
  { id: "20gp", name: "20' GP", description: "20-foot General Purpose" },
  { id: "40gp", name: "40' GP", description: "40-foot General Purpose" },
  { id: "40hc", name: "40' HC", description: "40-foot High Cube" },
];

// Generate historical rate data
function generateHistoricalRates(baseRate: number, months: number = 24): { month: string; rate: number; year: number }[] {
  const data: { month: string; rate: number; year: number }[] = [];
  const today = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    
    // Seasonal patterns
    const monthIndex = date.getMonth();
    const seasonalFactor = 
      monthIndex >= 7 && monthIndex <= 9 ? 0.15 : // Peak season Aug-Oct
      monthIndex >= 0 && monthIndex <= 1 ? -0.10 : // Post-holiday dip Jan-Feb
      monthIndex >= 10 && monthIndex <= 11 ? 0.08 : // Pre-holiday surge Nov-Dec
      0;
    
    // Random volatility
    const volatility = (Math.random() - 0.5) * 0.2;
    
    // Trend component
    const trendFactor = (months - i) * 0.005;
    
    const rate = baseRate * (1 + seasonalFactor + volatility + trendFactor);
    
    data.push({
      month: monthNames[monthIndex],
      rate: Math.round(rate),
      year: date.getFullYear(),
    });
  }
  
  return data;
}

// Generate forecast data
function generateForecast(
  historicalRates: number[],
  horizon: number
): { forecasts: number[]; lowerBound: number[]; upperBound: number[] } {
  const avg = historicalRates.reduce((a, b) => a + b, 0) / historicalRates.length;
  const stdDev = Math.sqrt(historicalRates.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / historicalRates.length);
  
  // Linear trend from historical data
  const n = historicalRates.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += historicalRates[i];
    sumXY += i * historicalRates[i];
    sumX2 += i * i;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  const forecasts: number[] = [];
  const lowerBound: number[] = [];
  const upperBound: number[] = [];
  
  const lastRate = historicalRates[historicalRates.length - 1];
  
  for (let i = 0; i < horizon; i++) {
    // Add seasonal component
    const futureMonth = (new Date().getMonth() + i + 1) % 12;
    const seasonalFactor = 
      futureMonth >= 7 && futureMonth <= 9 ? 0.12 :
      futureMonth >= 0 && futureMonth <= 1 ? -0.08 :
      futureMonth >= 10 && futureMonth <= 11 ? 0.06 :
      0;
    
    const forecast = intercept + slope * (n + i) * (1 + seasonalFactor);
    
    // Expanding confidence interval
    const ciMultiplier = 1.96;
    const expandingStdDev = stdDev * Math.sqrt(1 + (i + 1) * 0.15);
    
    forecasts.push(Math.round(Math.max(forecast, avg * 0.5)));
    lowerBound.push(Math.round(Math.max(forecast - ciMultiplier * expandingStdDev, avg * 0.3)));
    upperBound.push(Math.round(forecast + ciMultiplier * expandingStdDev));
  }
  
  return { forecasts, lowerBound, upperBound };
}

// Calculate seasonal indices
function calculateSeasonalIndices(rates: { month: string; rate: number }[]): { month: string; index: number; trend: "up" | "down" | "neutral" }[] {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyAvg: Record<string, number[]> = {};
  
  rates.forEach(r => {
    if (!monthlyAvg[r.month]) monthlyAvg[r.month] = [];
    monthlyAvg[r.month].push(r.rate);
  });
  
  const overallAvg = rates.reduce((a, b) => a + b.rate, 0) / rates.length;
  
  return monthNames.map(month => {
    const monthRates = monthlyAvg[month] || [overallAvg];
    const avg = monthRates.reduce((a, b) => a + b, 0) / monthRates.length;
    const index = avg / overallAvg;
    
    return {
      month,
      index: Math.round(index * 100),
      trend: index > 1.05 ? "up" : index < 0.95 ? "down" : "neutral",
    };
  });
}

// Market drivers
const MARKET_DRIVERS = [
  {
    id: "fuel-prices",
    name: "Bunker Fuel Prices",
    impact: "high",
    direction: "up",
    change: 8.5,
    description: "IFO 380 prices increased 8.5% last month, pushing up BAF surcharges",
  },
  {
    id: "capacity",
    name: "Global Fleet Capacity",
    impact: "medium",
    direction: "up",
    change: 3.2,
    description: "New vessel deliveries up 3.2% YoY, adding capacity pressure",
  },
  {
    id: "demand",
    name: "Container Demand",
    impact: "high",
    direction: "up",
    change: 5.8,
    description: "US import volumes up 5.8%, driving spot rate increases",
  },
  {
    id: "congestion",
    name: "Port Congestion",
    impact: "medium",
    direction: "down",
    change: -12.3,
    description: "Average congestion index down 12.3%, improving vessel availability",
  },
  {
    id: "alliances",
    name: "Alliance Restructuring",
    impact: "high",
    direction: "neutral",
    change: 0,
    description: "2M Alliance dissolution affecting capacity allocation on key routes",
  },
  {
    id: "suez",
    name: "Suez/Routing Impact",
    impact: "high",
    direction: "up",
    change: 15.0,
    description: "Red Sea diversions adding 10-14 days transit, increasing costs",
  },
];

// Rate alert interface
interface RateAlert {
  id: string;
  tradeLane: string;
  containerType: string;
  targetRate: number;
  condition: "above" | "below";
  active: boolean;
  createdAt: Date;
}

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function FreightRateForecast() {
  const [selectedLane, setSelectedLane] = useState(TRADE_LANES[0].id);
  const [selectedContainer, setSelectedContainer] = useState("40hc");
  const [forecastHorizon, setForecastHorizon] = useState(6);
  const [alerts, setAlerts] = useState<RateAlert[]>([]);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("forecast");
  
  // Alert form state
  const [alertLane, setAlertLane] = useState("");
  const [alertContainer, setAlertContainer] = useState("40hc");
  const [alertRate, setAlertRate] = useState("");
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above");
  
  // Get base rate for selected lane
  const getBaseRate = useCallback((laneId: string, containerType: string) => {
    const lane = TRADE_LANES.find(l => l.id === laneId);
    const container = CONTAINER_TYPES.find(c => c.id === containerType);
    
    // Base rates per FEU for different lanes
    const baseRates: Record<string, number> = {
      "asia-europe": 2800,
      "asia-med": 2600,
      "asia-usc": 3200,
      "asia-usec": 4500,
      "europe-usc": 2500,
      "europe-usec": 1800,
      "transpacific": 3500,
      "intra-asia": 600,
    };
    
    let rate = baseRates[laneId] || 2000;
    
    // Adjust for container type
    if (containerType === "20gp") rate *= 0.6;
    else if (containerType === "40gp") rate *= 0.9;
    
    return Math.round(rate);
  }, []);
  
  // Generate data
  const historicalData = useMemo(() => {
    const baseRate = getBaseRate(selectedLane, selectedContainer);
    return generateHistoricalRates(baseRate);
  }, [selectedLane, selectedContainer, getBaseRate]);
  
  const forecastData = useMemo(() => {
    const rates = historicalData.map(d => d.rate);
    return generateForecast(rates, forecastHorizon);
  }, [historicalData, forecastHorizon]);
  
  const seasonalIndices = useMemo(() => {
    return calculateSeasonalIndices(historicalData);
  }, [historicalData]);
  
  // Combined chart data
  const chartData = useMemo(() => {
    const data: { month: string; historical: number | null; forecast: number | null; lower: number | null; upper: number | null }[] = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Historical data
    historicalData.forEach((d, idx) => {
      data.push({
        month: `${d.month} ${d.year.toString().slice(-2)}`,
        historical: d.rate,
        forecast: null,
        lower: null,
        upper: null,
      });
    });
    
    // Forecast data
    const lastMonth = historicalData[historicalData.length - 1];
    const lastMonthIndex = monthNames.indexOf(lastMonth.month);
    
    forecastData.forecasts.forEach((forecast, idx) => {
      const monthIndex = (lastMonthIndex + idx + 1) % 12;
      const year = idx + lastMonthIndex + 1 >= 12 ? lastMonth.year + 1 : lastMonth.year;
      
      data.push({
        month: `${monthNames[monthIndex]} ${year.toString().slice(-2)}`,
        historical: null,
        forecast,
        lower: forecastData.lowerBound[idx],
        upper: forecastData.upperBound[idx],
      });
    });
    
    return data;
  }, [historicalData, forecastData]);
  
  // Statistics
  const stats = useMemo(() => {
    const rates = historicalData.map(d => d.rate);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const max = Math.max(...rates);
    const min = Math.min(...rates);
    const lastRate = rates[rates.length - 1];
    const prevRate = rates[rates.length - 2];
    const changePercent = ((lastRate - prevRate) / prevRate) * 100;
    
    return {
      current: lastRate,
      avg: Math.round(avg),
      max,
      min,
      change: changePercent,
      forecastAvg: Math.round(forecastData.forecasts.reduce((a, b) => a + b, 0) / forecastData.forecasts.length),
    };
  }, [historicalData, forecastData]);
  
  // Alert management
  const addAlert = useCallback(() => {
    if (!alertLane || !alertRate) return;
    
    const newAlert: RateAlert = {
      id: Date.now().toString(),
      tradeLane: alertLane,
      containerType: alertContainer,
      targetRate: parseInt(alertRate),
      condition: alertCondition,
      active: true,
      createdAt: new Date(),
    };
    
    setAlerts(prev => [...prev, newAlert]);
    setIsAlertDialogOpen(false);
    setAlertLane("");
    setAlertRate("");
  }, [alertLane, alertContainer, alertRate, alertCondition]);
  
  const toggleAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  }, []);
  
  const deleteAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);
  
  const selectedLaneData = TRADE_LANES.find(l => l.id === selectedLane);
  
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" style={{ color: COLORS.ocean }} />
            Freight Rate Forecast
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered rate forecasting with seasonal patterns and market drivers analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Lane & Container Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" style={{ color: COLORS.ocean }} />
              Trade Lane
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedLane} onValueChange={setSelectedLane}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRADE_LANES.map(lane => (
                  <SelectItem key={lane.id} value={lane.id}>
                    {lane.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLaneData && (
              <p className="text-xs text-muted-foreground mt-2">
                {selectedLaneData.origin} → {selectedLaneData.destination} ({selectedLaneData.distance.toLocaleString()} nm)
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Container className="h-4 w-4" style={{ color: COLORS.logistics }} />
              Container Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedContainer} onValueChange={setSelectedContainer}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTAINER_TYPES.map(type => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              {CONTAINER_TYPES.find(c => c.id === selectedContainer)?.description}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" style={{ color: COLORS.warning }} />
              Forecast Horizon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Slider
                value={[forecastHorizon]}
                onValueChange={(v) => setForecastHorizon(v[0])}
                min={3}
                max={12}
                step={1}
                className="flex-1"
              />
              <span className="font-medium text-sm" style={{ color: COLORS.ocean }}>
                {forecastHorizon} mo
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Forecast period: {forecastHorizon} months
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-l-4" style={{ borderLeftColor: COLORS.ocean }}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Current Rate</p>
            <p className="text-2xl font-bold">${stats.current.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-1" style={{ color: stats.change >= 0 ? COLORS.success : COLORS.danger }}>
              {stats.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              <span className="text-sm font-medium">{stats.change >= 0 ? "+" : ""}{stats.change.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4" style={{ borderLeftColor: COLORS.logistics }}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg Rate (24mo)</p>
            <p className="text-2xl font-bold">${stats.avg.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Per FEU</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">24-Month High</p>
            <p className="text-2xl font-bold text-green-600">${stats.max.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">24-Month Low</p>
            <p className="text-2xl font-bold text-red-600">${stats.min.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4" style={{ borderLeftColor: COLORS.purple }}>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Forecast Avg</p>
            <p className="text-2xl font-bold">${stats.forecastAvg.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Next {forecastHorizon} months</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="forecast">Rate Forecast</TabsTrigger>
          <TabsTrigger value="seasonality">Seasonal Patterns</TabsTrigger>
          <TabsTrigger value="drivers">Market Drivers</TabsTrigger>
          <TabsTrigger value="alerts">Rate Alerts</TabsTrigger>
          <TabsTrigger value="analysis">Trend Analysis</TabsTrigger>
        </TabsList>
        
        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Historical & Forecast Rates
              </CardTitle>
              <CardDescription>
                {forecastHorizon}-month forecast with 95% confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.ocean} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.ocean} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.logistics} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.logistics} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    
                    {/* Confidence Interval Area */}
                    <Area
                      type="monotone"
                      dataKey="upper"
                      stroke="transparent"
                      fill={COLORS.logistics}
                      fillOpacity={0.1}
                      name="Upper 95% CI"
                    />
                    <Area
                      type="monotone"
                      dataKey="lower"
                      stroke="transparent"
                      fill={COLORS.logistics}
                      fillOpacity={0.1}
                      name="Lower 95% CI"
                    />
                    
                    {/* Historical Line */}
                    <Line
                      type="monotone"
                      dataKey="historical"
                      stroke={COLORS.ocean}
                      strokeWidth={2}
                      dot={{ fill: COLORS.ocean, strokeWidth: 0, r: 3 }}
                      name="Historical Rate"
                      connectNulls={false}
                    />
                    
                    {/* Forecast Line */}
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke={COLORS.logistics}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: COLORS.logistics, strokeWidth: 0, r: 3 }}
                      name="Forecast Rate"
                    />
                    
                    {/* Reference line at forecast start */}
                    <ReferenceLine
                      x={chartData.find(d => d.forecast !== null)?.month}
                      stroke={COLORS.warning}
                      strokeDasharray="3 3"
                      label={{ value: "Forecast Start", fill: COLORS.warning, fontSize: 10 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5" style={{ backgroundColor: COLORS.ocean }} />
                  <span>Historical Rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-dashed border-t-2" style={{ borderColor: COLORS.logistics }} />
                  <span>Forecast</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 opacity-20" style={{ backgroundColor: COLORS.logistics }} />
                  <span>95% Confidence Interval</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Forecast Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Forecast Details</CardTitle>
              <CardDescription>Forecasted rates with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Month</th>
                      <th className="text-right py-3 px-4">Forecast</th>
                      <th className="text-right py-3 px-4">Lower 95%</th>
                      <th className="text-right py-3 px-4">Upper 95%</th>
                      <th className="text-right py-3 px-4">CI Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecastData.forecasts.map((forecast, idx) => {
                      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                      const lastMonthIndex = monthNames.indexOf(historicalData[historicalData.length - 1].month);
                      const monthIndex = (lastMonthIndex + idx + 1) % 12;
                      const nextYear = lastMonthIndex + idx + 1 >= 12;
                      const year = nextYear ? new Date().getFullYear() + 1 : new Date().getFullYear();
                      
                      return (
                        <tr key={idx} className="border-b">
                          <td className="py-3 px-4 font-medium">
                            {monthNames[monthIndex]} {year}
                          </td>
                          <td className="text-right py-3 px-4 font-medium" style={{ color: COLORS.logistics }}>
                            ${Math.round(forecast).toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 text-muted-foreground">
                            ${Math.round(forecastData.lowerBound[idx]).toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 text-muted-foreground">
                            ${Math.round(forecastData.upperBound[idx]).toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4">
                            <Badge variant="outline">
                              ±${Math.round((forecastData.upperBound[idx] - forecastData.lowerBound[idx]) / 2).toLocaleString()}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Seasonality Tab */}
        <TabsContent value="seasonality" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Seasonal Index by Month
                </CardTitle>
                <CardDescription>
                  Relative rate levels compared to annual average
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={seasonalIndices}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <YAxis domain={[80, 120]} tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Seasonal Index"]}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <ReferenceLine y={100} stroke={COLORS.neutral} strokeDasharray="3 3" label={{ value: "Average", fill: COLORS.neutral, fontSize: 10 }} />
                      <Line
                        type="monotone"
                        dataKey="index"
                        stroke={COLORS.ocean}
                        strokeWidth={2}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          const color = payload.trend === "up" ? COLORS.success : payload.trend === "down" ? COLORS.danger : COLORS.neutral;
                          return (
                            <svg x={cx - 6} y={cy - 6} width={12} height={12}>
                              <circle cx="6" cy="6" r="5" fill={color} />
                            </svg>
                          );
                        }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Seasonal Insights
                </CardTitle>
                <CardDescription>
                  Key seasonal patterns and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">Peak Season (Aug-Oct)</span>
                      </div>
                      <p className="text-sm text-green-700">
                        Rates typically 12-18% above annual average. Book early for holiday season shipments.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Pre-Holiday Surge (Nov-Dec)</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Moderate increase of 6-10% as shippers rush before Chinese New Year.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-800">Post-Holiday Dip (Jan-Feb)</span>
                      </div>
                      <p className="text-sm text-orange-700">
                        Rates 8-12% below average. Good time for non-urgent shipments and negotiations.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-800">Stable Period (Mar-Jul)</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Rates near annual average. Predictable pricing, good for contract negotiations.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          {/* Monthly Seasonal Index Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Seasonal Index</CardTitle>
              <CardDescription>Index values relative to 100 (annual average)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
                {seasonalIndices.map((item) => (
                  <div
                    key={item.month}
                    className={`p-3 rounded-lg text-center ${
                      item.index > 105 ? "bg-green-100 border border-green-300" :
                      item.index < 95 ? "bg-red-100 border border-red-300" :
                      "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <p className="font-medium text-sm">{item.month}</p>
                    <p className={`text-lg font-bold ${
                      item.index > 105 ? "text-green-700" :
                      item.index < 95 ? "text-red-700" :
                      "text-gray-700"
                    }`}>
                      {item.index}%
                    </p>
                    <div className="mt-1">
                      {item.trend === "up" && <ArrowUpRight className="h-3 w-3 mx-auto text-green-600" />}
                      {item.trend === "down" && <ArrowDownRight className="h-3 w-3 mx-auto text-red-600" />}
                      {item.trend === "neutral" && <Activity className="h-3 w-3 mx-auto text-gray-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Market Drivers Tab */}
        <TabsContent value="drivers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Market Drivers Impact Analysis
              </CardTitle>
              <CardDescription>
                Key factors influencing freight rates on {selectedLaneData?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MARKET_DRIVERS.map((driver) => (
                  <div key={driver.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{driver.name}</span>
                          <Badge
                            variant={driver.impact === "high" ? "destructive" : driver.impact === "medium" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {driver.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{driver.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`flex items-center gap-1 ${
                          driver.direction === "up" ? "text-green-600" :
                          driver.direction === "down" ? "text-red-600" :
                          "text-gray-500"
                        }`}>
                          {driver.direction === "up" ? (
                            <>
                              <ArrowUpRight className="h-4 w-4" />
                              <span className="font-bold">+{driver.change}%</span>
                            </>
                          ) : driver.direction === "down" ? (
                            <>
                              <ArrowDownRight className="h-4 w-4" />
                              <span className="font-bold">{driver.change}%</span>
                            </>
                          ) : (
                            <span className="font-medium text-gray-500">No change</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Impact Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-l-4" style={{ borderLeftColor: COLORS.danger }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5" style={{ color: COLORS.danger }} />
                  <span className="font-medium">Upward Pressure</span>
                </div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">Drivers pushing rates higher</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4" style={{ borderLeftColor: COLORS.success }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5" style={{ color: COLORS.success }} />
                  <span className="font-medium">Downward Pressure</span>
                </div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-xs text-muted-foreground">Drivers pushing rates lower</p>
              </CardContent>
            </Card>
            
            <Card className="border-l-4" style={{ borderLeftColor: COLORS.neutral }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5" style={{ color: COLORS.neutral }} />
                  <span className="font-medium">Neutral</span>
                </div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Drivers with uncertain impact</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Rate Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Rate Alerts</h3>
              <p className="text-sm text-muted-foreground">Get notified when rates reach your target</p>
            </div>
            
            <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: COLORS.ocean }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Rate Alert</DialogTitle>
                  <DialogDescription>
                    Set up an alert to be notified when rates reach your target
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div>
                    <Label>Trade Lane</Label>
                    <Select value={alertLane} onValueChange={setAlertLane}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trade lane" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRADE_LANES.map(lane => (
                          <SelectItem key={lane.id} value={lane.id}>
                            {lane.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Container Type</Label>
                    <Select value={alertContainer} onValueChange={setAlertContainer}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONTAINER_TYPES.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Target Rate (USD)</Label>
                    <Input
                      type="number"
                      value={alertRate}
                      onChange={(e) => setAlertRate(e.target.value)}
                      placeholder="e.g., 2500"
                    />
                  </div>
                  
                  <div>
                    <Label>Alert Condition</Label>
                    <Select value={alertCondition} onValueChange={(v) => setAlertCondition(v as "above" | "below")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Rate goes above target</SelectItem>
                        <SelectItem value="below">Rate goes below target</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAlertDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addAlert} style={{ backgroundColor: COLORS.ocean }}>
                    Create Alert
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">No alerts configured</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first rate alert to get notified when prices reach your target
                </p>
                <Button onClick={() => setIsAlertDialogOpen(true)} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const lane = TRADE_LANES.find(l => l.id === alert.tradeLane);
                const container = CONTAINER_TYPES.find(c => c.id === alert.containerType);
                
                return (
                  <Card key={alert.id} className={!alert.active ? "opacity-60" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${alert.active ? "bg-ocean/10" : "bg-gray-100"}`}>
                            {alert.active ? (
                              <BellRing className="h-5 w-5" style={{ color: COLORS.ocean }} />
                            ) : (
                              <Bell className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{lane?.name}</span>
                              <Badge variant="outline">{container?.name}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Alert when rate goes <span className="font-medium">{alert.condition}</span> ${alert.targetRate.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={alert.active}
                            onCheckedChange={() => toggleAlert(alert.id)}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteAlert(alert.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        {/* Trend Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Rate Distribution
                </CardTitle>
                <CardDescription>
                  Rate frequency over the past 24 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={(() => {
                      const rates = historicalData.map(d => d.rate);
                      const min = Math.min(...rates);
                      const max = Math.max(...rates);
                      const buckets = 10;
                      const bucketSize = (max - min) / buckets;
                      const distribution: { range: string; count: number }[] = [];
                      
                      for (let i = 0; i < buckets; i++) {
                        const rangeStart = min + i * bucketSize;
                        const rangeEnd = min + (i + 1) * bucketSize;
                        const count = rates.filter(r => r >= rangeStart && r < rangeEnd).length;
                        distribution.push({
                          range: `$${Math.round(rangeStart / 100)}-${Math.round(rangeEnd / 100)}`,
                          count,
                        });
                      }
                      
                      return distribution;
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="range" tick={{ fontSize: 10 }} stroke="#9ca3af" />
                      <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={COLORS.ocean}
                        fill={COLORS.ocean}
                        fillOpacity={0.3}
                        name="Frequency"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Trend Analysis Summary
                </CardTitle>
                <CardDescription>
                  Statistical analysis of rate trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Trend Direction</span>
                      {stats.change >= 0 ? (
                        <Badge className="bg-green-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Upward
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Downward
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">
                      Rates have {stats.change >= 0 ? "increased" : "decreased"} by {Math.abs(stats.change).toFixed(1)}% month-over-month
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Volatility</span>
                      <Badge variant="outline">
                      {(() => {
                        const rates = historicalData.map(d => d.rate);
                        const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
                        const variance = rates.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / rates.length;
                        const cv = (Math.sqrt(variance) / avg) * 100;
                        return cv > 20 ? "High" : cv > 10 ? "Moderate" : "Low";
                      })()} volatility
                      </Badge>
                    </div>
                    <p className="text-sm">
                      Rate stability indicator based on coefficient of variation
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Current vs Average</span>
                      <span className={`font-medium ${stats.current > stats.avg ? "text-red-600" : "text-green-600"}`}>
                        {stats.current > stats.avg ? "+" : ""}{((stats.current - stats.avg) / stats.avg * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm">
                      Current rate compared to 24-month average
                    </p>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Forecast vs Current</span>
                      <span className={`font-medium ${stats.forecastAvg > stats.current ? "text-red-600" : "text-green-600"}`}>
                        {stats.forecastAvg > stats.current ? "+" : ""}{((stats.forecastAvg - stats.current) / stats.current * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-sm">
                      Expected change over the forecast period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: COLORS.warning }} />
                Strategic Recommendations
              </CardTitle>
              <CardDescription>
                Data-driven insights for your shipping strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Contract Strategy</span>
                  </div>
                  <p className="text-sm text-green-700">
                    {stats.current < stats.avg 
                      ? "Current rates are below average. Consider locking in contract rates for the next 6-12 months."
                      : "Rates are elevated. Consider spot market flexibility or shorter contract terms."
                    }
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Timing Recommendation</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Based on seasonal patterns, rates typically dip in Jan-Feb. Plan non-urgent shipments accordingly.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span className="font-medium text-amber-800">Risk Alert</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    Red Sea routing disruptions continue to impact transit times and rates. Monitor closely for updates.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg border border-purple-200 bg-purple-50">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">Budget Planning</span>
                  </div>
                  <p className="text-sm text-purple-700">
                    Budget ${Math.round(stats.forecastAvg * 1.1).toLocaleString()}/FEU for the next {forecastHorizon} months to account for potential volatility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Data updated: {new Date().toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            Forecasts are estimates based on historical patterns
          </span>
        </div>
        <span>© 2024 Shiportrade.com - Freight Intelligence</span>
      </div>
    </div>
  );
}

export default FreightRateForecast;
