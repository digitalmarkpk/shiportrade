"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Ship,
  BarChart3,
  LineChart,
  Activity,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Globe,
  Anchor,
  Container,
  Gauge,
  Waves,
  PieChart,
  Zap,
  Target,
  Clock,
  HelpCircle,
  ChevronRight,
  TrendingUpIcon,
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
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#22C55E",
  neutral: "#6B7280",
  bdi: "#0F4C81",
  scfi: "#2E8B57",
  fbx: "#8B5CF6",
  wci: "#F59E0B",
};

// Freight Index Types
interface FreightIndex {
  code: string;
  name: string;
  fullName: string;
  description: string;
  currentValue: number;
  previousClose: number;
  change: number;
  changePercent: number;
  yoyChange: number;
  yoyChangePercent: number;
  momChange: number;
  momChangePercent: number;
  high52Week: number;
  low52Week: number;
  unit: string;
  category: string;
  lastUpdated: string;
  trend: "up" | "down" | "stable";
  sentiment: "bullish" | "bearish" | "neutral";
}

// Generate 12-month historical data
const generateMonthlyData = (baseValue: number, volatility: number, months: number = 12) => {
  const data = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);

    const seasonalFactor = Math.sin((i / 12) * Math.PI * 2) * 0.15;
    const randomFactor = (Math.random() - 0.5) * volatility;
    const trendFactor = (months - i) * (Math.random() > 0.5 ? 0.02 : -0.01);

    const value = Math.max(100, baseValue * (1 + seasonalFactor + randomFactor + trendFactor));

    data.push({
      month: date.toLocaleDateString("en-US", { month: "short" }),
      monthFull: date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
};

// Freight Indices Data
const FREIGHT_INDICES: FreightIndex[] = [
  {
    code: "BDI",
    name: "Baltic Dry Index",
    fullName: "Baltic Dry Index (BDI)",
    description: "A shipping and trade index created by the Baltic Exchange. It measures the cost of transporting raw materials by sea.",
    currentValue: 1824,
    previousClose: 1798,
    change: 26,
    changePercent: 1.45,
    yoyChange: -456,
    yoyChangePercent: -20.0,
    momChange: 142,
    momChangePercent: 8.44,
    high52Week: 2567,
    low52Week: 1128,
    unit: "points",
    category: "Dry Bulk",
    lastUpdated: "2024-01-15T16:00:00Z",
    trend: "up",
    sentiment: "neutral",
  },
  {
    code: "SCFI",
    name: "Shanghai Containerized Freight Index",
    fullName: "Shanghai Containerized Freight Index (SCFI)",
    description: "Published by the Shanghai Shipping Exchange, it reflects spot rates for container shipping from Shanghai to major global ports.",
    currentValue: 2138,
    previousClose: 2105,
    change: 33,
    changePercent: 1.57,
    yoyChange: 428,
    yoyChangePercent: 25.0,
    momChange: 156,
    momChangePercent: 7.86,
    high52Week: 3245,
    low52Week: 982,
    unit: "points",
    category: "Container",
    lastUpdated: "2024-01-15T15:30:00Z",
    trend: "up",
    sentiment: "bullish",
  },
  {
    code: "FBX",
    name: "Freightos Baltic Index",
    fullName: "Freightos Baltic Index (FBX)",
    description: "A global container freight index providing real-time pricing data for major container shipping routes.",
    currentValue: 2847,
    previousClose: 2812,
    change: 35,
    changePercent: 1.24,
    yoyChange: -623,
    yoyChangePercent: -17.96,
    momChange: 89,
    momChangePercent: 3.23,
    high52Week: 4125,
    low52Week: 1567,
    unit: "USD/FEU",
    category: "Container",
    lastUpdated: "2024-01-15T16:15:00Z",
    trend: "up",
    sentiment: "neutral",
  },
  {
    code: "WCI",
    name: "World Container Index",
    fullName: "World Container Index (WCI)",
    description: "Published by Drewry, it assesses container freight rates on major East-West trade routes.",
    currentValue: 3654,
    previousClose: 3598,
    change: 56,
    changePercent: 1.56,
    yoyChange: -1245,
    yoyChangePercent: -25.42,
    momChange: 234,
    momChangePercent: 6.84,
    high52Week: 5234,
    low52Week: 1876,
    unit: "USD/FEU",
    category: "Container",
    lastUpdated: "2024-01-15T15:45:00Z",
    trend: "up",
    sentiment: "neutral",
  },
];

// Index Historical Data (generated for demo)
const INDEX_HISTORICAL_DATA: Record<string, { month: string; value: number }[]> = {
  BDI: generateMonthlyData(1824, 0.15),
  SCFI: generateMonthlyData(2138, 0.2),
  FBX: generateMonthlyData(2847, 0.18),
  WCI: generateMonthlyData(3654, 0.22),
};

// Correlation Matrix Data
const CORRELATION_DATA = [
  { from: "BDI", to: "SCFI", correlation: 0.72, strength: "Strong" },
  { from: "BDI", to: "FBX", correlation: 0.65, strength: "Moderate" },
  { from: "BDI", to: "WCI", correlation: 0.58, strength: "Moderate" },
  { from: "SCFI", to: "FBX", correlation: 0.91, strength: "Very Strong" },
  { from: "SCFI", to: "WCI", correlation: 0.88, strength: "Strong" },
  { from: "FBX", to: "WCI", correlation: 0.95, strength: "Very Strong" },
];

// Market Insights
const MARKET_INSIGHTS = [
  {
    id: 1,
    type: "trend",
    title: "Container Rates Rising",
    description: "All container indices showing upward momentum driven by Red Sea diversions adding 10-14 days to Asia-Europe routes.",
    impact: "positive",
    timestamp: "2024-01-15T14:00:00Z",
  },
  {
    id: 2,
    type: "alert",
    title: "BDI Recovery Signals",
    description: "Dry bulk rates recovering from Q4 lows as China stimulus measures boost iron ore and coal imports.",
    impact: "positive",
    timestamp: "2024-01-15T12:30:00Z",
  },
  {
    id: 3,
    type: "warning",
    title: "Capacity Constraints",
    description: "Global fleet utilization approaching 90% on major trade lanes, potentially supporting rate increases.",
    impact: "neutral",
    timestamp: "2024-01-15T11:00:00Z",
  },
  {
    id: 4,
    type: "info",
    title: "Seasonal Patterns",
    description: "Historical data suggests typical pre-Chinese New Year rate spike 2-3 weeks before holiday period.",
    impact: "neutral",
    timestamp: "2024-01-15T10:00:00Z",
  },
  {
    id: 5,
    type: "trend",
    title: "Transpacific Stability",
    description: "Asia-US West Coast rates stabilizing after volatile Q4, with contracting season approaching.",
    impact: "positive",
    timestamp: "2024-01-15T09:00:00Z",
  },
];

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is the Baltic Dry Index (BDI)?",
    answer: "The Baltic Dry Index (BDI) is a shipping and trade index created by the Baltic Exchange. It measures the cost of transporting various raw materials by sea, including coal, iron ore, and grain. The BDI is considered a leading economic indicator because it reflects global trade activity.",
  },
  {
    question: "How often are freight indices updated?",
    answer: "Most freight indices are updated daily on business days. The BDI is published by the Baltic Exchange at 13:00 London time. The SCFI is released weekly on Fridays. The FBX and WCI are updated daily to reflect current market conditions.",
  },
  {
    question: "What factors influence freight index movements?",
    answer: "Freight indices are influenced by multiple factors including: supply and demand for vessel capacity, fuel prices, geopolitical events, seasonal patterns, weather conditions, global economic activity, and trade policies. Supply chain disruptions like the recent Red Sea situation can significantly impact rates.",
  },
  {
    question: "How do I interpret correlation between indices?",
    answer: "A correlation coefficient ranges from -1 to 1. A value of 1 indicates perfect positive correlation, -1 indicates perfect negative correlation, and 0 means no correlation. High correlation between container indices (SCFI, FBX, WCI) suggests similar market drivers, while BDI often moves differently as it tracks dry bulk commodities.",
  },
  {
    question: "What is the difference between spot and contract rates?",
    answer: "Spot rates are for immediate shipment and fluctuate daily based on market conditions. Contract rates are negotiated for longer periods (typically 3-12 months) and provide rate stability. Indices like SCFI primarily track spot rates, while some contracts reference index values.",
  },
  {
    question: "How do seasonal patterns affect freight rates?",
    answer: "Freight rates typically show seasonal patterns: rates often rise before Chinese New Year (January-February) due to restocking, weaken during summer months, and can strengthen in Q4 ahead of holiday seasons. Agricultural commodity seasons also influence dry bulk rates.",
  },
  {
    question: "What is FEU and TEU in container shipping?",
    answer: "TEU (Twenty-foot Equivalent Unit) is a standard unit for container capacity, representing one 20-foot container. FEU (Forty-foot Equivalent Unit) equals two TEUs. Most freight indices quote rates per FEU. A standard 40-foot container carries approximately 2,400 cartons of consumer goods.",
  },
  {
    question: "How can I use freight indices for business planning?",
    answer: "Freight indices help businesses: 1) Budget shipping costs by tracking rate trends, 2) Time shipments to avoid peak rate periods, 3) Negotiate contract rates with carriers, 4) Hedge against rate volatility using freight derivatives, and 5) Make sourcing decisions based on transportation costs.",
  },
];

// Market Share Data for Pie Chart
const MARKET_SHARE_DATA = [
  { name: "Container", value: 45, color: COLORS.ocean },
  { name: "Dry Bulk", value: 28, color: COLORS.logistics },
  { name: "Tanker", value: 18, color: COLORS.warning },
  { name: "Other", value: 9, color: COLORS.neutral },
];

// Regional Route Data
const REGIONAL_ROUTE_DATA = [
  { route: "Asia-Europe", rate: 3654, change: 12.5, volume: "High" },
  { route: "Asia-US West", rate: 2890, change: 8.2, volume: "High" },
  { route: "Asia-US East", rate: 4125, change: 15.3, volume: "Medium" },
  { route: "Transatlantic", rate: 1856, change: -2.1, volume: "Medium" },
  { route: "Intra-Asia", rate: 890, change: 5.8, volume: "High" },
];

// Quarterly Performance Data
const QUARTERLY_DATA = [
  { quarter: "Q1 2023", bdi: 1420, scfi: 1850, fbx: 2450, wci: 3200 },
  { quarter: "Q2 2023", bdi: 1580, scfi: 1920, fbx: 2680, wci: 3450 },
  { quarter: "Q3 2023", bdi: 1650, scfi: 1980, fbx: 2720, wci: 3580 },
  { quarter: "Q4 2023", bdi: 1682, scfi: 1982, fbx: 2758, wci: 3420 },
  { quarter: "Q1 2024", bdi: 1824, scfi: 2138, fbx: 2847, wci: 3654 },
];

// Get change color
const getChangeColor = (value: number) => {
  if (value > 0) return COLORS.success;
  if (value < 0) return COLORS.danger;
  return COLORS.neutral;
};

// Get trend icon
const getTrendIcon = (trend: string, size: "sm" | "md" = "md") => {
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  switch (trend) {
    case "up":
      return <TrendingUp className={`${iconSize} text-green-500`} />;
    case "down":
      return <TrendingDown className={`${iconSize} text-red-500`} />;
    default:
      return <Minus className={`${iconSize} text-gray-500`} />;
  }
};

// Get sentiment badge
const getSentimentBadge = (sentiment: string) => {
  switch (sentiment) {
    case "bullish":
      return <Badge className="bg-green-500 text-white">Bullish</Badge>;
    case "bearish":
      return <Badge className="bg-red-500 text-white">Bearish</Badge>;
    default:
      return <Badge variant="secondary">Neutral</Badge>;
  }
};

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Index Card Component
const IndexCard = ({
  index,
  isSelected,
  onClick,
}: {
  index: FreightIndex;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const changeColor = getChangeColor(index.change);
  const indexColor = COLORS[index.code.toLowerCase() as keyof typeof COLORS] || COLORS.ocean;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-offset-2" : ""
      }`}
      style={{ borderColor: isSelected ? indexColor : undefined }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: indexColor }}
            >
              {index.code}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{index.name}</h3>
              <p className="text-xs text-muted-foreground">{index.category}</p>
            </div>
          </div>
          {getTrendIcon(index.trend)}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">{index.currentValue.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">{index.unit}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1" style={{ color: changeColor }}>
              {index.change >= 0 ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span className="text-sm font-medium">
                {index.change >= 0 ? "+" : ""}
                {index.change.toLocaleString()}
              </span>
              <span className="text-sm">
                ({index.changePercent >= 0 ? "+" : ""}
                {index.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">MoM</p>
              <p className="text-sm font-medium" style={{ color: getChangeColor(index.momChangePercent) }}>
                {index.momChangePercent >= 0 ? "+" : ""}
                {index.momChangePercent.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">YoY</p>
              <p className="text-sm font-medium" style={{ color: getChangeColor(index.yoyChangePercent) }}>
                {index.yoyChangePercent >= 0 ? "+" : ""}
                {index.yoyChangePercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// 12-Month Trend Chart
const TrendChart = ({ data, color, name }: { data: { month: string; value: number }[]; color: string; name: string }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${name}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(value) => value.toLocaleString()} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          name={name}
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill={`url(#gradient-${name})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Comparison Chart (All Indices)
const ComparisonChart = () => {
  const combinedData = useMemo(() => {
    const months = INDEX_HISTORICAL_DATA.BDI.map((d) => d.month);
    return months.map((month, idx) => ({
      month,
      BDI: INDEX_HISTORICAL_DATA.BDI[idx]?.value,
      SCFI: INDEX_HISTORICAL_DATA.SCFI[idx]?.value,
      FBX: INDEX_HISTORICAL_DATA.FBX[idx]?.value,
      WCI: INDEX_HISTORICAL_DATA.WCI[idx]?.value,
    }));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsLineChart data={combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(value) => value.toLocaleString()} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="BDI" stroke={COLORS.bdi} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="SCFI" stroke={COLORS.scfi} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="FBX" stroke={COLORS.fbx} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="WCI" stroke={COLORS.wci} strokeWidth={2} dot={false} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

// Correlation Heatmap
const CorrelationMatrix = () => {
  const indices = ["BDI", "SCFI", "FBX", "WCI"];

  const getCorrelation = (from: string, to: string) => {
    if (from === to) return 1;
    const correlation = CORRELATION_DATA.find(
      (c) => (c.from === from && c.to === to) || (c.from === to && c.to === from)
    );
    return correlation?.correlation || 0;
  };

  const getCorrelationColor = (value: number) => {
    if (value >= 0.8) return "bg-green-600";
    if (value >= 0.6) return "bg-green-400";
    if (value >= 0.4) return "bg-yellow-300";
    if (value >= 0.2) return "bg-orange-300";
    return "bg-red-300";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="p-2"></th>
            {indices.map((idx) => (
              <th key={idx} className="p-2 text-center font-medium">
                {idx}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {indices.map((row) => (
            <tr key={row}>
              <td className="p-2 font-medium">{row}</td>
              {indices.map((col) => {
                const corr = getCorrelation(row, col);
                return (
                  <td key={col} className="p-1">
                    <div
                      className={`${getCorrelationColor(corr)} rounded p-2 text-center text-white font-medium text-xs`}
                    >
                      {corr.toFixed(2)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Market Insight Card
const InsightCard = ({
  insight,
}: {
  insight: (typeof MARKET_INSIGHTS)[0];
}) => {
  const getIcon = () => {
    switch (insight.type) {
      case "trend":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-medium text-sm">{insight.title}</h4>
              <Badge
                variant={
                  insight.impact === "positive"
                    ? "default"
                    : insight.impact === "negative"
                    ? "destructive"
                    : "secondary"
                }
                className="text-xs"
              >
                {insight.impact}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{insight.description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              <Calendar className="h-3 w-3 inline mr-1" />
              {new Date(insight.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Market Share Pie Chart Component
const MarketShareChart = () => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsPieChart>
        <Pie
          data={MARKET_SHARE_DATA}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {MARKET_SHARE_DATA.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                  <p className="text-sm font-medium">{data.name}</p>
                  <p className="text-sm" style={{ color: data.color }}>
                    Market Share: {data.value}%
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

// Regional Route Bar Chart
const RegionalRouteChart = () => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={REGIONAL_ROUTE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="route" tick={{ fontSize: 11 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(value) => `$${value}`} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-sm" style={{ color: COLORS.ocean }}>
                    Rate: ${data.rate.toLocaleString()}/FEU
                  </p>
                  <p className="text-sm" style={{ color: data.change >= 0 ? COLORS.success : COLORS.danger }}>
                    Change: {data.change >= 0 ? "+" : ""}{data.change}%
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="rate" fill={COLORS.ocean} radius={[4, 4, 0, 0]}>
          {REGIONAL_ROUTE_DATA.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.change >= 0 ? COLORS.logistics : COLORS.danger}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Quarterly Performance Chart
const QuarterlyPerformanceChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={QUARTERLY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="quarter" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(value) => value.toLocaleString()} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="bdi" name="BDI" fill={COLORS.bdi} radius={[2, 2, 0, 0]} />
        <Bar dataKey="scfi" name="SCFI" fill={COLORS.scfi} radius={[2, 2, 0, 0]} />
        <Bar dataKey="fbx" name="FBX" fill={COLORS.fbx} radius={[2, 2, 0, 0]} />
        <Bar dataKey="wci" name="WCI" fill={COLORS.wci} radius={[2, 2, 0, 0]} />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

// Market Sentiment Gauge
const MarketSentimentGauge = () => {
  const sentimentScore = 72; // 0-100 scale

  const data = [
    {
      name: "sentiment",
      value: sentimentScore,
      fill: sentimentScore >= 60 ? COLORS.logistics : sentimentScore >= 40 ? COLORS.warning : COLORS.danger,
    },
  ];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart
          cx="50%"
          cy="100%"
          innerRadius="60%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          data={data}
        >
          <RadialBar
            background={{ fill: "#e5e7eb" }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center -mt-12">
        <p className="text-3xl font-bold" style={{ color: data[0].fill }}>
          {sentimentScore}
        </p>
        <p className="text-sm text-muted-foreground">Market Sentiment</p>
        <Badge className="mt-2" style={{ backgroundColor: data[0].fill }}>
          Bullish
        </Badge>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-8 mb-6"
      style={{
        background: `linear-gradient(135deg, ${COLORS.ocean} 0%, ${COLORS.logistics} 100%)`,
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Waves className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">Freight Index Tracker</h1>
                <p className="text-white/80 mt-1">Real-time global shipping intelligence</p>
              </div>
            </div>
            <p className="text-white/90 max-w-2xl text-sm lg:text-base">
              Monitor major freight indices including BDI, SCFI, FBX, and WCI. Track trends,
              analyze correlations, and stay informed with market insights to make data-driven
              logistics decisions.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>4 Major Indices</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>12-Month Historical Data</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Market Insights</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Ship className="h-4 w-4" />
                <span className="text-xs opacity-80">Active Vessels</span>
              </div>
              <p className="text-2xl font-bold">5,432</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Container className="h-4 w-4" />
                <span className="text-xs opacity-80">Utilization</span>
              </div>
              <p className="text-2xl font-bold">89%</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-4 w-4" />
                <span className="text-xs opacity-80">Routes</span>
              </div>
              <p className="text-2xl font-bold">28</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-1">
                <Anchor className="h-4 w-4" />
                <span className="text-xs opacity-80">Ports</span>
              </div>
              <p className="text-2xl font-bold">142</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// FAQs Section Component
const FAQsSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" style={{ color: COLORS.ocean }} />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription>
          Common questions about freight indices and shipping intelligence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {FAQ_DATA.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pl-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

// Main Component
export function FreightIndexTracker() {
  const [selectedIndex, setSelectedIndex] = useState<string>("BDI");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedIndexData = useMemo(() => {
    return FREIGHT_INDICES.find((idx) => idx.code === selectedIndex) || FREIGHT_INDICES[0];
  }, [selectedIndex]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      {/* Hero Section */}
      <HeroSection />

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
            Index Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Select an index to view detailed analytics
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Index Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FREIGHT_INDICES.map((index) => (
          <IndexCard
            key={index.code}
            index={index}
            isSelected={selectedIndex === index.code}
            onClick={() => setSelectedIndex(index.code)}
          />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="correlation">Correlations</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Selected Index Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: COLORS[selectedIndex.toLowerCase() as keyof typeof COLORS] || COLORS.ocean }}
                      >
                        {selectedIndex}
                      </div>
                      {selectedIndexData.fullName}
                    </CardTitle>
                    <CardDescription className="mt-1">{selectedIndexData.description}</CardDescription>
                  </div>
                  {getSentimentBadge(selectedIndexData.sentiment)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                    <p className="text-xl font-bold">{selectedIndexData.currentValue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{selectedIndexData.unit}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Daily Change</p>
                    <p
                      className="text-xl font-bold"
                      style={{ color: getChangeColor(selectedIndexData.change) }}
                    >
                      {selectedIndexData.change >= 0 ? "+" : ""}
                      {selectedIndexData.change.toLocaleString()}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: getChangeColor(selectedIndexData.changePercent) }}
                    >
                      {selectedIndexData.changePercent >= 0 ? "+" : ""}
                      {selectedIndexData.changePercent.toFixed(2)}%
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">52W High</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedIndexData.high52Week.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">52W Low</p>
                    <p className="text-xl font-bold text-red-600">
                      {selectedIndexData.low52Week.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Mini Trend Chart */}
                <div className="h-48">
                  <TrendChart
                    data={INDEX_HISTORICAL_DATA[selectedIndex] || []}
                    color={COLORS[selectedIndex.toLowerCase() as keyof typeof COLORS] || COLORS.ocean}
                    name={selectedIndex}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Key Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Key Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="outline">{selectedIndexData.category}</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">MoM Change</span>
                  <span
                    className="font-medium"
                    style={{ color: getChangeColor(selectedIndexData.momChangePercent) }}
                  >
                    {selectedIndexData.momChangePercent >= 0 ? "+" : ""}
                    {selectedIndexData.momChangePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">YoY Change</span>
                  <span
                    className="font-medium"
                    style={{ color: getChangeColor(selectedIndexData.yoyChangePercent) }}
                  >
                    {selectedIndexData.yoyChangePercent >= 0 ? "+" : ""}
                    {selectedIndexData.yoyChangePercent.toFixed(1)}%
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Trend</span>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(selectedIndexData.trend)}
                    <span className="capitalize">{selectedIndexData.trend}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm">
                    {new Date(selectedIndexData.lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 12-Month Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" style={{ color: COLORS.ocean }} />
                All Indices Comparison (12 Months)
              </CardTitle>
              <CardDescription>
                Compare the performance of major freight indices over the past year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ComparisonChart />
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {FREIGHT_INDICES.map((index) => (
              <Card key={index.code}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: COLORS[index.code.toLowerCase() as keyof typeof COLORS] || COLORS.ocean }}
                    >
                      {index.code}
                    </div>
                    {index.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <TrendChart
                      data={INDEX_HISTORICAL_DATA[index.code] || []}
                      color={COLORS[index.code.toLowerCase() as keyof typeof COLORS] || COLORS.ocean}
                      name={index.code}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Market Share */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Market Share by Segment
                </CardTitle>
                <CardDescription>
                  Global shipping market distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketShareChart />
              </CardContent>
            </Card>

            {/* Market Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Market Sentiment
                </CardTitle>
                <CardDescription>
                  Overall market outlook score
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketSentimentGauge />
              </CardContent>
            </Card>

            {/* Quick Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" style={{ color: COLORS.warning }} />
                  Quick Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4" style={{ color: COLORS.logistics }} />
                    <span className="text-sm">Avg Rate Change</span>
                  </div>
                  <span className="font-bold text-green-600">+5.8%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: COLORS.ocean }} />
                    <span className="text-sm">Avg Transit Time</span>
                  </div>
                  <span className="font-bold">32 days</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" style={{ color: COLORS.fbx }} />
                    <span className="text-sm">Volatility Index</span>
                  </div>
                  <span className="font-bold text-yellow-600">Medium</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Waves className="h-4 w-4" style={{ color: COLORS.wci }} />
                    <span className="text-sm">Peak Season</span>
                  </div>
                  <span className="font-bold">Q4 2024</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Regional Route Analysis
              </CardTitle>
              <CardDescription>
                Container rates by major trade route (USD/FEU)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegionalRouteChart />
            </CardContent>
          </Card>

          {/* Quarterly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: COLORS.logistics }} />
                Quarterly Performance Comparison
              </CardTitle>
              <CardDescription>
                Index values across recent quarters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuarterlyPerformanceChart />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Correlations Tab */}
        <TabsContent value="correlation" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Correlation Matrix
                </CardTitle>
                <CardDescription>
                  Inter-index correlation coefficients (12-month rolling window)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CorrelationMatrix />
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-600" />
                    <span>0.80-1.00 (Very Strong)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-400" />
                    <span>0.60-0.79 (Strong)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-300" />
                    <span>0.40-0.59 (Moderate)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Correlation Insights
                </CardTitle>
                <CardDescription>
                  Key correlation relationships between freight indices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  <div className="space-y-3">
                    {CORRELATION_DATA.sort((a, b) => b.correlation - a.correlation).map((item, idx) => (
                      <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {item.from}
                            </Badge>
                            <span className="text-muted-foreground">→</span>
                            <Badge variant="outline" className="text-xs">
                              {item.to}
                            </Badge>
                          </div>
                          <Badge
                            className={
                              item.correlation >= 0.8
                                ? "bg-green-500"
                                : item.correlation >= 0.6
                                ? "bg-green-400"
                                : "bg-yellow-400"
                            }
                          >
                            {item.correlation.toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.strength} correlation between {item.from} and {item.to}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Market Insights Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Market Insights & Analysis
              </CardTitle>
              <CardDescription>
                Latest market commentary and trend analysis for freight markets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96 overflow-y-auto">
                <div className="space-y-4 pr-4">
                  {MARKET_INSIGHTS.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Ship className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.ocean }} />
                <p className="text-2xl font-bold">5,432</p>
                <p className="text-xs text-muted-foreground">Active Vessels</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Container className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.logistics }} />
                <p className="text-2xl font-bold">89%</p>
                <p className="text-xs text-muted-foreground">Fleet Utilization</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Anchor className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.warning }} />
                <p className="text-2xl font-bold">142</p>
                <p className="text-xs text-muted-foreground">Ports Tracked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Globe className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.fbx }} />
                <p className="text-2xl font-bold">28</p>
                <p className="text-xs text-muted-foreground">Trade Routes</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* FAQs Section */}
      <FAQsSection />

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Data updated in real-time
          </span>
          <span className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            For informational purposes only
          </span>
        </div>
        <span>© 2024 Shiportrade.com - Freight Intelligence</span>
      </div>
    </div>
  );
}

export default FreightIndexTracker;
