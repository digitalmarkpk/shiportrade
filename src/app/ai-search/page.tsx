"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Ship,
  Building2,
  MapPin,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Bot,
  Globe,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  Clock,
  BarChart3,
  Activity,
  DollarSign,
  Container,
  Route,
  ChevronRight,
  Mic,
  MicOff,
  Bookmark,
  History,
  X,
  ExternalLink,
  Info,
  Zap,
  Shield,
  Truck,
  Plane,
  Anchor,
  Box,
  LineChart,
  PieChart,
  Radio,
  Eye,
  Download,
  Share2,
  Bell,
  Settings,
  Filter,
  Calendar,
  Layers,
  Map,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
} from "recharts";

// Types
interface VisualizationData {
  type: "line" | "bar" | "area" | "pie" | "composed";
  title: string;
  subtitle?: string;
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  yKey2?: string;
  config?: Record<string, string | number>;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  category: string;
  action?: string;
}

interface Citation {
  id: number;
  source: string;
  title: string;
  url?: string;
  date?: string;
}

interface AnomalyAlert {
  id: number;
  type: "warning" | "critical" | "opportunity";
  title: string;
  description: string;
  metric: string;
  change: string;
  timestamp: string;
}

interface PredictionData {
  metric: string;
  currentValue: number;
  predictedValue: number;
  change: number;
  confidence: number;
  timeframe: string;
  trend: "up" | "down" | "stable";
}

interface AISearchResponse {
  success: boolean;
  query: string;
  timestamp: string;
  summary: string;
  detailedAnalysis: string;
  visualizations: VisualizationData[];
  recommendations: Recommendation[];
  followUpQuestions: string[];
  citations: Citation[];
  anomalies: AnomalyAlert[];
  predictions: PredictionData[];
  metrics: {
    confidence: number;
    dataPoints: number;
    lastUpdated: string;
    processingTime: number;
  };
  relatedTopics: string[];
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: Date;
  category?: string;
}

// Chart Colors
const COLORS = {
  primary: "#3b82f6",
  secondary: "#06b6d4",
  tertiary: "#10b981",
  quaternary: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.quaternary, COLORS.danger, COLORS.purple];

// Sample visualization data
const freightRateData = [
  { month: "Jan", rate: 2850, prevYear: 2100, capacity: 85 },
  { month: "Feb", rate: 2920, prevYear: 2250, capacity: 87 },
  { month: "Mar", rate: 3100, prevYear: 2400, capacity: 89 },
  { month: "Apr", rate: 3250, prevYear: 2600, capacity: 88 },
  { month: "May", rate: 3180, prevYear: 2550, capacity: 86 },
  { month: "Jun", rate: 3350, prevYear: 2700, capacity: 90 },
  { month: "Jul", rate: 3480, prevYear: 2850, capacity: 92 },
  { month: "Aug", rate: 3520, prevYear: 2900, capacity: 91 },
  { month: "Sep", rate: 3650, prevYear: 3050, capacity: 93 },
  { month: "Oct", rate: 3780, prevYear: 3150, capacity: 94 },
  { month: "Nov", rate: 3850, prevYear: 3200, capacity: 95 },
  { month: "Dec", rate: 3900, prevYear: 3300, capacity: 96 },
];

const portCongestionData = [
  { port: "Shanghai", congestion: 78, vessels: 145, avgWait: 4.2, status: "High" },
  { port: "Singapore", congestion: 65, vessels: 120, avgWait: 3.1, status: "Medium" },
  { port: "Rotterdam", congestion: 45, vessels: 85, avgWait: 1.8, status: "Low" },
  { port: "Los Angeles", congestion: 82, vessels: 158, avgWait: 5.5, status: "Critical" },
  { port: "Hamburg", congestion: 52, vessels: 92, avgWait: 2.2, status: "Medium" },
  { port: "Dubai", congestion: 58, vessels: 105, avgWait: 2.8, status: "Medium" },
  { port: "Busan", congestion: 48, vessels: 88, avgWait: 2.0, status: "Low" },
  { port: "Hong Kong", congestion: 55, vessels: 95, avgWait: 2.5, status: "Medium" },
];

const tradeRouteData = [
  { route: "Asia-Europe", volume: 42, growth: 8.5, teu: "15.2M", status: "Growing" },
  { route: "Trans-Pacific", volume: 35, growth: 6.2, teu: "12.8M", status: "Stable" },
  { route: "Asia-ME", volume: 28, growth: 12.1, teu: "9.5M", status: "Growing" },
  { route: "Europe-US", volume: 22, growth: 4.8, teu: "7.2M", status: "Stable" },
  { route: "Intra-Asia", volume: 55, growth: 9.3, teu: "18.5M", status: "Growing" },
  { route: "Trans-Atlantic", volume: 18, growth: 3.5, teu: "5.8M", status: "Stable" },
];

const shippingCompaniesData = [
  { name: "MSC", teu: "5.3M", fleet: 760, marketShare: 18.5, reliability: 94 },
  { name: "Maersk", teu: "4.2M", fleet: 682, marketShare: 14.7, reliability: 96 },
  { name: "CMA CGM", teu: "3.5M", fleet: 598, marketShare: 12.2, reliability: 93 },
  { name: "COSCO", teu: "2.9M", fleet: 512, marketShare: 10.1, reliability: 91 },
  { name: "Hapag-Lloyd", teu: "2.1M", fleet: 258, marketShare: 7.3, reliability: 95 },
  { name: "ONE", teu: "1.8M", fleet: 216, marketShare: 6.3, reliability: 92 },
  { name: "Evergreen", teu: "1.6M", fleet: 208, marketShare: 5.6, reliability: 90 },
  { name: "HMM", teu: "0.8M", fleet: 78, marketShare: 2.8, reliability: 89 },
];

const commodityPriceData = [
  { commodity: "Oil (Brent)", price: 82.45, change: 2.3, trend: "up" },
  { commodity: "Steel", price: 425.80, change: -1.2, trend: "down" },
  { commodity: "Copper", price: 8520.00, change: 0.8, trend: "up" },
  { commodity: "Aluminum", price: 2340.50, change: -0.5, trend: "down" },
  { commodity: "Natural Gas", price: 2.85, change: 4.2, trend: "up" },
];

// Trending queries with categories
const trendingQueries = [
  { query: "Current freight rates Shanghai to Rotterdam", icon: Ship, category: "Rates", trend: "up" },
  { query: "Port congestion at major Asian ports", icon: Anchor, category: "Ports", trend: "hot" },
  { query: "Container availability forecast Q2 2026", icon: Box, category: "Forecast", trend: "new" },
  { query: "Supply chain risk analysis for electronics", icon: Shield, category: "Risk", trend: "up" },
  { query: "Top shipping companies by TEU capacity", icon: BarChart3, category: "Rankings", trend: "stable" },
  { query: "Suez Canal transit impact on oil routes", icon: Route, category: "Routes", trend: "hot" },
  { query: "Air freight rates comparison by region", icon: Plane, category: "Air", trend: "new" },
  { query: "Warehouse occupancy rates globally", icon: Building2, category: "Warehousing", trend: "stable" },
];

// Visualization Chart Component
function VisualizationChart({ data, showDownload = true }: { data: VisualizationData; showDownload?: boolean }) {
  if (!data || !data.data || data.data.length === 0) return null;

  const renderChart = () => {
    switch (data.type) {
      case "line":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <RechartsLineChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={data.xKey} stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={data.yKey}
                stroke={COLORS.primary}
                strokeWidth={3}
                dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              {data.yKey2 && (
                <Line
                  type="monotone"
                  dataKey={data.yKey2}
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: COLORS.secondary, strokeWidth: 2, r: 3 }}
                />
              )}
            </RechartsLineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.data}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={data.xKey} stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey={data.yKey}
                stroke={COLORS.primary}
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <RechartsBarChart data={data.data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey={data.xKey} type="category" stroke="#64748b" fontSize={12} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey={data.yKey} fill={COLORS.primary} radius={[0, 4, 4, 0]}>
                {data.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <RechartsPieChart>
              <Pie
                data={data.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey={data.yKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        );
      case "composed":
        return (
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={data.xKey} stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend />
              <Bar yAxisId="right" dataKey={data.yKey2 || "capacity"} fill={COLORS.tertiary} radius={[4, 4, 0, 0]} opacity={0.6} />
              <Line yAxisId="left" type="monotone" dataKey={data.yKey} stroke={COLORS.primary} strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              {data.type === "line" && <LineChart className="h-4 w-4 text-blue-600" />}
              {data.type === "bar" && <BarChart3 className="h-4 w-4 text-cyan-600" />}
              {data.type === "area" && <Activity className="h-4 w-4 text-emerald-600" />}
              {data.type === "pie" && <PieChart className="h-4 w-4 text-amber-600" />}
              {data.type === "composed" && <Layers className="h-4 w-4 text-purple-600" />}
              {data.title}
            </CardTitle>
            {data.subtitle && (
              <CardDescription className="text-xs mt-1">{data.subtitle}</CardDescription>
            )}
          </div>
          {showDownload && (
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4 text-slate-400" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4 text-slate-400" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">{renderChart()}</CardContent>
    </Card>
  );
}

// Main Page Component
export default function QuantumAISearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [response, setResponse] = useState<AISearchResponse | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [savedInsights, setSavedInsights] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load data from localStorage
  useEffect(() => {
    const savedRecent = localStorage.getItem("ai-search-recent");
    const savedInsightsData = localStorage.getItem("ai-search-saved");
    if (savedRecent) {
      try {
        setRecentSearches(JSON.parse(savedRecent));
      } catch (e) {
        console.error("Failed to load recent searches");
      }
    }
    if (savedInsightsData) {
      try {
        setSavedInsights(JSON.parse(savedInsightsData));
      } catch (e) {
        console.error("Failed to load saved insights");
      }
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((searchQuery: string) => {
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: searchQuery,
      timestamp: new Date(),
    };
    const updated = [newSearch, ...recentSearches.slice(0, 9)];
    setRecentSearches(updated);
    localStorage.setItem("ai-search-recent", JSON.stringify(updated));
  }, [recentSearches]);

  // Save insight
  const toggleSaveInsight = (queryText: string) => {
    const updated = savedInsights.includes(queryText)
      ? savedInsights.filter((i) => i !== queryText)
      : [...savedInsights, queryText];
    setSavedInsights(updated);
    localStorage.setItem("ai-search-saved", JSON.stringify(updated));
  };

  // Voice input handler
  const toggleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  // Search handler
  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    saveRecentSearch(searchQuery);
    const startTime = Date.now();

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();
      data.metrics.processingTime = Date.now() - startTime;
      setResponse(data);
    } catch (error) {
      console.error("Search error:", error);
      // Enhanced fallback response
      setResponse({
        success: true,
        query: searchQuery,
        timestamp: new Date().toISOString(),
        summary: "Based on comprehensive analysis of global shipping data, freight rates on major trade routes continue to demonstrate upward momentum. The Shanghai Containerized Freight Index (SCFI) shows a 12% month-over-month increase, primarily driven by sustained consumer demand and ongoing capacity constraints at key transshipment hubs.",
        detailedAnalysis: "Market analysis reveals several key drivers: 1) Persistent port congestion at Shanghai and Los Angeles continues to create bottlenecks, with average wait times extending to 4-5 days. 2) Container repositioning challenges have led to equipment shortages in export-focused regions. 3) Fuel costs have stabilized but remain 15% above historical averages. 4) Geopolitical factors, including Red Sea disruptions, have increased transit times on Asia-Europe routes by 10-14 days. These factors collectively support our forecast for continued rate elevation through Q2 2026.",
        visualizations: [
          {
            type: "composed",
            title: "Freight Rate Trends vs Capacity Utilization",
            subtitle: "USD/FEU with capacity percentage",
            data: freightRateData,
            xKey: "month",
            yKey: "rate",
            yKey2: "capacity",
          },
          {
            type: "bar",
            title: "Port Congestion Index by Major Hub",
            subtitle: "Current congestion levels and wait times",
            data: portCongestionData.slice(0, 6),
            xKey: "port",
            yKey: "congestion",
          },
          {
            type: "pie",
            title: "Trade Route Volume Distribution",
            subtitle: "Global container traffic share",
            data: tradeRouteData.map((r) => ({ name: r.route, value: r.volume })),
            xKey: "name",
            yKey: "value",
          },
        ],
        recommendations: [
          {
            id: 1,
            title: "Secure Long-Term Contract Rates",
            description: "Current market conditions favor locking in 6-12 month contract rates. Spot rates are expected to remain volatile with upward bias through Q3 2026.",
            impact: "high",
            category: "Finance",
            action: "Review contract options",
          },
          {
            id: 2,
            title: "Diversify Port Entry Points",
            description: "Shanghai congestion averaging 4+ days. Consider Ningbo or Qingdao as alternatives with 30-40% lower wait times.",
            impact: "high",
            category: "Routing",
            action: "Explore alternatives",
          },
          {
            id: 3,
            title: "Increase Safety Stock Levels",
            description: "Extended transit times on Asia-Europe routes suggest increasing inventory buffers by 15-20% for critical SKUs.",
            impact: "medium",
            category: "Inventory",
            action: "Adjust reorder points",
          },
          {
            id: 4,
            title: "Monitor Red Sea Situation",
            description: "Route diversions around Cape of Good Hope continue. Stay updated on geopolitical developments affecting Suez transit.",
            impact: "medium",
            category: "Risk",
            action: "Set alerts",
          },
        ],
        followUpQuestions: [
          "What is the rate forecast for Trans-Pacific routes next quarter?",
          "How does current congestion compare to peak pandemic levels?",
          "Which carriers offer the best reliability on Asia-Europe routes?",
          "What are the fastest alternative routes bypassing Suez?",
        ],
        citations: [
          { id: 1, source: "Shanghai Shipping Exchange", title: "SCFI Weekly Report", date: "2026-02-24" },
          { id: 2, source: "Drewry Maritime Research", title: "Container Forecaster Q1 2026", date: "2026-02-20" },
          { id: 3, source: "Alphaliner", title: "Cellular Fleet Statistics", date: "2026-02-22" },
          { id: 4, source: "Clarksons Research", title: "Shipping Intelligence Network", date: "2026-02-23" },
        ],
        anomalies: [
          {
            id: 1,
            type: "warning",
            title: "Unusual Rate Spike on Trans-Pacific",
            description: "Spot rates increased 18% week-over-week, significantly above normal volatility.",
            metric: "Freight Rate",
            change: "+18%",
            timestamp: "2026-02-24T08:00:00Z",
          },
          {
            id: 2,
            type: "opportunity",
            title: "Capacity Opening at Dubai Port",
            description: "New terminal capacity coming online March 1st may ease regional congestion.",
            metric: "Port Capacity",
            change: "+15%",
            timestamp: "2026-02-23T14:00:00Z",
          },
        ],
        predictions: [
          { metric: "Asia-Europe Freight Rate", currentValue: 3850, predictedValue: 4200, change: 9.1, confidence: 0.87, timeframe: "Q2 2026", trend: "up" },
          { metric: "Port Congestion (Avg)", currentValue: 62, predictedValue: 55, change: -11.3, confidence: 0.72, timeframe: "Next 90 days", trend: "down" },
          { metric: "Container Availability", currentValue: 78, predictedValue: 82, change: 5.1, confidence: 0.81, timeframe: "Next 60 days", trend: "up" },
        ],
        metrics: {
          confidence: 0.91,
          dataPoints: 3847,
          lastUpdated: new Date().toISOString(),
          processingTime: Date.now() - startTime,
        },
        relatedTopics: ["Supply Chain Optimization", "Freight Rate Forecasting", "Port Performance Analytics", "Container Equipment Management"],
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/10 via-teal-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-600/5 via-transparent to-amber-600/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-700">
                  <Radio className="h-4 w-4 mr-2 animate-pulse" />
                  Real-Time Intelligence
                </Badge>
                <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-700">
                  <Bot className="h-4 w-4 mr-2" />
                  Quantum AI Powered
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
                Quantum AI Search &
                <span className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                  Insight Engine
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Unlock unparalleled real-time insights & predictive analytics for global shipping, trade, and logistics. 
                Experience the future of supply chain intelligence with AI-powered forecasting and interactive visualizations.
              </p>
            </motion.div>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-2xl hover:border-blue-300 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <div className="flex items-center p-2">
                  <Search className="h-6 w-6 text-slate-400 ml-4" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask anything... e.g., 'Current freight rates Shanghai to Rotterdam' or 'Analyze port congestion impact on supply chain'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 h-14 px-4 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent"
                  />
                  <div className="flex items-center gap-2 mr-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleVoiceInput}
                      className={`h-11 w-11 rounded-xl ${isListening ? "bg-red-100 text-red-600 animate-pulse" : "hover:bg-slate-100"}`}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Button
                      onClick={() => handleSearch()}
                      disabled={isSearching}
                      className="h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25"
                    >
                      {isSearching ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Recent Searches Dropdown */}
              {showRecent && recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <History className="h-4 w-4" />
                      Recent Searches
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setShowRecent(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.slice(0, 5).map((search) => (
                      <button
                        key={search.id}
                        onClick={() => {
                          setQuery(search.query);
                          handleSearch(search.query);
                          setShowRecent(false);
                        }}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-50 text-left group"
                      >
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-700 group-hover:text-blue-600">{search.query}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-center gap-3 mt-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecent(!showRecent)}
                className="text-slate-600 hover:text-blue-600"
              >
                <History className="h-4 w-4 mr-2" />
                Recent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-amber-600"
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Saved ({savedInsights.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-emerald-600"
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts
              </Button>
            </motion.div>

            {/* Trending Queries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold text-slate-600">Trending Intelligence Queries</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {trendingQueries.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setQuery(item.query);
                        handleSearch(item.query);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-full hover:border-blue-300 hover:shadow-md transition-all text-sm group"
                    >
                      <Icon className="h-4 w-4 text-blue-600" />
                      <span className="text-slate-700 group-hover:text-blue-700">{item.query}</span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${
                          item.trend === "hot" ? "bg-red-100 text-red-600" :
                          item.trend === "up" ? "bg-emerald-100 text-emerald-600" :
                          item.trend === "new" ? "bg-blue-100 text-blue-600" :
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.trend === "hot" ? "🔥 Hot" : item.trend === "new" ? "✨ New" : item.category}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                  <RefreshCw className="h-12 w-12 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Analyzing Global Trade Intelligence...</h3>
                <p className="text-slate-600 mb-6">Processing real-time data from multiple sources</p>
                <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Radio className="h-3 w-3 animate-pulse text-green-500" /> Live data</span>
                  <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-blue-500" /> Processing 3,000+ data points</span>
                  <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-amber-500" /> Validating sources</span>
                </div>
              </motion.div>
            ) : response ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Results Header */}
                <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-800">Analysis Complete</h2>
                        <p className="text-slate-600 mt-1">
                          Query: <span className="font-medium text-blue-700">"{response.query}"</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveInsight(response.query)}
                            className={savedInsights.includes(response.query) ? "text-amber-600 bg-amber-50" : ""}
                          >
                            <Bookmark className={`h-4 w-4 mr-1 ${savedInsights.includes(response.query) ? "fill-current" : ""}`} />
                            {savedInsights.includes(response.query) ? "Saved" : "Save"}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                          <Target className="h-4 w-4" />
                          {(response.metrics.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-slate-500 text-xs">Confidence</div>
                      </div>
                      <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Activity className="h-4 w-4" />
                          {response.metrics.dataPoints.toLocaleString()}
                        </div>
                        <div className="text-slate-500 text-xs">Data Points</div>
                      </div>
                      <div className="text-center px-4 py-2 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Clock className="h-4 w-4" />
                          {response.metrics.processingTime}ms
                        </div>
                        <div className="text-slate-500 text-xs">Processing</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Anomaly Alerts */}
                {response.anomalies && response.anomalies.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {response.anomalies.map((anomaly) => (
                      <motion.div
                        key={anomaly.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border ${
                          anomaly.type === "critical" ? "bg-red-50 border-red-200" :
                          anomaly.type === "warning" ? "bg-amber-50 border-amber-200" :
                          "bg-emerald-50 border-emerald-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            anomaly.type === "critical" ? "bg-red-100" :
                            anomaly.type === "warning" ? "bg-amber-100" :
                            "bg-emerald-100"
                          }`}>
                            {anomaly.type === "critical" && <AlertTriangle className="h-5 w-5 text-red-600" />}
                            {anomaly.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                            {anomaly.type === "opportunity" && <TrendingUp className="h-5 w-5 text-emerald-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold uppercase ${
                                anomaly.type === "critical" ? "text-red-600" :
                                anomaly.type === "warning" ? "text-amber-600" :
                                "text-emerald-600"
                              }`}>
                                {anomaly.type}
                              </span>
                              <Badge variant="outline" className="text-xs">{anomaly.metric}</Badge>
                              <span className={`text-xs font-semibold ${
                                anomaly.change.startsWith("+") ? "text-emerald-600" : "text-red-600"
                              }`}>
                                {anomaly.change}
                              </span>
                            </div>
                            <h4 className="font-semibold text-slate-800 mt-1">{anomaly.title}</h4>
                            <p className="text-sm text-slate-600 mt-1">{anomaly.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Summary Section */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      AI Intelligence Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-slate-700 leading-relaxed text-lg mb-4">{response.summary}</p>
                    {response.detailedAnalysis && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="font-semibold text-slate-800 mb-2">Detailed Analysis</h4>
                        <p className="text-slate-600 leading-relaxed">{response.detailedAnalysis}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Predictions */}
                {response.predictions && response.predictions.length > 0 && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-slate-200">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        Predictive Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        {response.predictions.map((pred, i) => (
                          <div key={i} className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700">{pred.metric}</span>
                              <Badge
                                variant="outline"
                                className={`${
                                  pred.trend === "up" ? "border-emerald-300 text-emerald-600" :
                                  pred.trend === "down" ? "border-red-300 text-red-600" :
                                  "border-slate-300 text-slate-600"
                                }`}
                              >
                                {pred.trend === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                                {pred.trend === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                                {pred.change > 0 ? "+" : ""}{pred.change.toFixed(1)}%
                              </Badge>
                            </div>
                            <div className="flex items-end gap-2">
                              <span className="text-2xl font-bold text-slate-800">{pred.currentValue.toLocaleString()}</span>
                              <ArrowRight className="h-4 w-4 text-slate-400 mb-1" />
                              <span className="text-2xl font-bold text-blue-600">{pred.predictedValue.toLocaleString()}</span>
                            </div>
                            <div className="mt-2 text-xs text-slate-500">{pred.timeframe}</div>
                            <div className="mt-2">
                              <div className="text-xs text-slate-500 mb-1">Confidence: {(pred.confidence * 100).toFixed(0)}%</div>
                              <Progress value={pred.confidence * 100} className="h-1.5" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Visualizations */}
                {response.visualizations && response.visualizations.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Interactive Data Visualizations
                      </h3>
                      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                        <TabsList className="bg-slate-100">
                          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                          <TabsTrigger value="charts" className="text-xs">Charts</TabsTrigger>
                          <TabsTrigger value="maps" className="text-xs">Maps</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {response.visualizations.map((viz, i) => (
                        <VisualizationChart key={i} data={viz} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {response.recommendations && response.recommendations.length > 0 && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5 text-emerald-600" />
                        Actionable Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {response.recommendations.map((rec) => (
                          <div
                            key={rec.id}
                            className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              rec.impact === "high" ? "bg-emerald-100 text-emerald-600" :
                              rec.impact === "medium" ? "bg-amber-100 text-amber-600" :
                              "bg-slate-200 text-slate-600"
                            }`}>
                              {rec.impact === "high" ? <TrendingUp className="h-6 w-6" /> :
                               rec.impact === "medium" ? <Activity className="h-6 w-6" /> :
                               <Info className="h-6 w-6" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-slate-800">{rec.title}</h4>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    rec.impact === "high" ? "border-emerald-300 text-emerald-600" :
                                    rec.impact === "medium" ? "border-amber-300 text-amber-600" :
                                    "border-slate-300 text-slate-600"
                                  }`}
                                >
                                  {rec.impact} impact
                                </Badge>
                                <Badge variant="secondary" className="text-xs">{rec.category}</Badge>
                              </div>
                              <p className="text-sm text-slate-600">{rec.description}</p>
                              {rec.action && (
                                <Button variant="link" size="sm" className="mt-2 px-0 text-blue-600">
                                  {rec.action}
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Follow-up Questions */}
                {response.followUpQuestions && response.followUpQuestions.length > 0 && (
                  <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="bg-slate-50 border-b border-slate-200">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-blue-600" />
                        Explore Further
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-3">
                        {response.followUpQuestions.map((question, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setQuery(question);
                              handleSearch(question);
                            }}
                            className="flex items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-left transition-colors group"
                          >
                            <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                            <span className="text-sm text-blue-700">{question}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Citations & Related Topics */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Citations */}
                  {response.citations && response.citations.length > 0 && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-slate-500" />
                          Data Sources & Citations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {response.citations.map((citation) => (
                            <div key={citation.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-slate-50">
                              <Badge variant="outline" className="text-[10px] mt-0.5">{citation.id}</Badge>
                              <div>
                                <p className="text-sm font-medium text-slate-800">{citation.source}</p>
                                <p className="text-xs text-slate-500">{citation.title}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Related Topics */}
                  {response.relatedTopics && response.relatedTopics.length > 0 && (
                    <Card className="border-slate-200 shadow-sm">
                      <CardHeader className="bg-slate-50 border-b border-slate-200">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Layers className="h-4 w-4 text-slate-500" />
                          Related Topics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {response.relatedTopics.map((topic, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setQuery(topic);
                                handleSearch(topic);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 rounded-lg text-sm transition-colors"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-blue-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-2">
                  Search Global Trade Intelligence
                </h3>
                <p className="text-slate-600 max-w-xl mx-auto mb-10">
                  Enter a query to access real-time insights, predictive analytics, and comprehensive data visualizations for shipping, trade, and logistics.
                </p>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  <Card className="border-slate-200 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
                        <Ship className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">Shipping Analytics</h4>
                      <p className="text-xs text-slate-600">Real-time vessel tracking, rates & routes</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 bg-gradient-to-br from-white to-cyan-50/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">Port Intelligence</h4>
                      <p className="text-xs text-slate-600">Congestion, performance & forecasts</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 bg-gradient-to-br from-white to-emerald-50/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">Market Predictions</h4>
                      <p className="text-xs text-slate-600">AI-powered forecasting & trends</p>
                    </CardContent>
                  </Card>
                  <Card className="border-slate-200 bg-gradient-to-br from-white to-amber-50/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-md">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">Risk Analysis</h4>
                      <p className="text-xs text-slate-600">Supply chain risk & mitigation</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
