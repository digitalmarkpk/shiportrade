"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Container,
  Ship,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Download,
  Lightbulb,
  Target,
  Gauge,
  Globe,
  Warehouse,
  Route,
  Zap,
  AlertCircle,
  Info,
  Minus,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  ComposedChart,
  Area,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Container types data
const CONTAINER_TYPES = [
  { id: "20gp", name: "20' GP", capacity: 33.2, payload: 28180, teu: 1 },
  { id: "40gp", name: "40' GP", capacity: 67.7, payload: 28750, teu: 2 },
  { id: "40hc", name: "40' HC", capacity: 76.3, payload: 28600, teu: 2 },
  { id: "45hc", name: "45' HC", capacity: 86.0, payload: 27600, teu: 2.25 },
  { id: "20rf", name: "20' Reefer", capacity: 28.4, payload: 27400, teu: 1 },
  { id: "40rf", name: "40' Reefer", capacity: 59.1, payload: 28200, teu: 2 },
  { id: "20ot", name: "20' Open Top", capacity: 32.5, payload: 28000, teu: 1 },
  { id: "40ot", name: "40' Open Top", capacity: 66.5, payload: 28400, teu: 2 },
  { id: "20fr", name: "20' Flat Rack", capacity: 31.8, payload: 31000, teu: 1 },
  { id: "40fr", name: "40' Flat Rack", capacity: 65.5, payload: 40000, teu: 2 },
];

// Regions data
const REGIONS = [
  { id: "asia", name: "Asia Pacific", ports: ["Shanghai", "Singapore", "Shenzhen", "Busan", "Hong Kong"] },
  { id: "europe", name: "Europe", ports: ["Rotterdam", "Hamburg", "Antwerp", "Felixstowe", "Le Havre"] },
  { id: "namerica", name: "North America", ports: ["Los Angeles", "Long Beach", "New York", "Savannah", "Seattle"] },
  { id: "samerica", name: "South America", ports: ["Santos", "Buenos Aires", "Valparaíso", "Callao", "Cartagena"] },
  { id: "middleeast", name: "Middle East", ports: ["Dubai", "Jeddah", "Doha", "Abu Dhabi", "Kuwait"] },
  { id: "africa", name: "Africa", ports: ["Durban", "Lagos", "Mombasa", "Tangier", "Alexandria"] },
];

// Fleet inventory data
const FLEET_DATA = {
  total: 1250,
  available: 425,
  inTransit: 520,
  idle: 180,
  maintenance: 65,
  outOfService: 60,
  byType: [
    { type: "20' GP", count: 280, available: 95, inTransit: 120, idle: 45, maintenance: 15, outOfService: 5 },
    { type: "40' GP", count: 310, available: 105, inTransit: 130, idle: 50, maintenance: 18, outOfService: 7 },
    { type: "40' HC", count: 350, available: 120, inTransit: 145, idle: 55, maintenance: 20, outOfService: 10 },
    { type: "45' HC", count: 85, available: 30, inTransit: 35, idle: 12, maintenance: 5, outOfService: 3 },
    { type: "20' Reefer", count: 60, available: 20, inTransit: 25, idle: 8, maintenance: 4, outOfService: 3 },
    { type: "40' Reefer", count: 75, available: 25, inTransit: 30, idle: 12, maintenance: 5, outOfService: 3 },
    { type: "20' Open Top", count: 35, available: 12, inTransit: 15, idle: 5, maintenance: 2, outOfService: 1 },
    { type: "40' Open Top", count: 25, available: 8, inTransit: 10, idle: 4, maintenance: 2, outOfService: 1 },
    { type: "20' Flat Rack", count: 15, available: 5, inTransit: 6, idle: 2, maintenance: 1, outOfService: 1 },
    { type: "40' Flat Rack", count: 15, available: 5, inTransit: 4, idle: 2, maintenance: 3, outOfService: 1 },
  ],
  byRegion: [
    { region: "Asia Pacific", total: 380, available: 130, inTransit: 160, idle: 55 },
    { region: "Europe", total: 285, available: 95, inTransit: 120, idle: 45 },
    { region: "North America", total: 245, available: 85, inTransit: 105, idle: 35 },
    { region: "South America", total: 125, available: 45, inTransit: 50, idle: 20 },
    { region: "Middle East", total: 135, available: 45, inTransit: 55, idle: 18 },
    { region: "Africa", total: 80, available: 25, inTransit: 30, idle: 17 },
  ],
};

// Utilization metrics
const UTILIZATION_METRICS = {
  overall: 68.4,
  byType: [
    { type: "20' GP", utilization: 72.1, trend: "up", change: 2.5 },
    { type: "40' GP", utilization: 69.8, trend: "up", change: 1.8 },
    { type: "40' HC", utilization: 71.2, trend: "up", change: 3.2 },
    { type: "45' HC", utilization: 64.5, trend: "down", change: -1.2 },
    { type: "20' Reefer", utilization: 75.4, trend: "up", change: 4.1 },
    { type: "40' Reefer", utilization: 73.8, trend: "up", change: 2.8 },
    { type: "20' Open Top", utilization: 58.2, trend: "stable", change: 0.3 },
    { type: "40' Open Top", utilization: 55.6, trend: "down", change: -0.8 },
    { type: "20' Flat Rack", utilization: 52.4, trend: "stable", change: 0.1 },
    { type: "40' Flat Rack", utilization: 48.9, trend: "down", change: -1.5 },
  ],
  byRegion: [
    { region: "Asia Pacific", utilization: 75.2, trend: "up", change: 3.5 },
    { region: "Europe", utilization: 72.8, trend: "up", change: 2.1 },
    { region: "North America", utilization: 70.5, trend: "up", change: 1.8 },
    { region: "South America", utilization: 65.2, trend: "stable", change: 0.4 },
    { region: "Middle East", utilization: 62.8, trend: "down", change: -0.9 },
    { region: "Africa", utilization: 58.4, trend: "stable", change: 0.2 },
  ],
  monthly: [
    { month: "Jan", utilization: 62.5, available: 450, inTransit: 480 },
    { month: "Feb", utilization: 63.8, available: 440, inTransit: 495 },
    { month: "Mar", utilization: 65.2, available: 435, inTransit: 510 },
    { month: "Apr", utilization: 64.8, available: 440, inTransit: 505 },
    { month: "May", utilization: 66.5, available: 430, inTransit: 520 },
    { month: "Jun", utilization: 67.2, available: 428, inTransit: 518 },
    { month: "Jul", utilization: 66.8, available: 432, inTransit: 515 },
    { month: "Aug", utilization: 68.1, available: 425, inTransit: 522 },
    { month: "Sep", utilization: 67.5, available: 428, inTransit: 518 },
    { month: "Oct", utilization: 68.0, available: 426, inTransit: 520 },
    { month: "Nov", utilization: 68.2, available: 425, inTransit: 522 },
    { month: "Dec", utilization: 68.4, available: 425, inTransit: 520 },
  ],
};

// Idle time data
const IDLE_TIME_DATA = {
  averageDays: 12.8,
  byDuration: [
    { range: "0-3 days", count: 85, percentage: 18.4 },
    { range: "4-7 days", count: 125, percentage: 27.1 },
    { range: "8-14 days", count: 145, percentage: 31.4 },
    { range: "15-21 days", count: 65, percentage: 14.1 },
    { range: "22-30 days", count: 28, percentage: 6.1 },
    { range: "30+ days", count: 12, percentage: 2.9 },
  ],
  byLocation: [
    { port: "Shanghai", containers: 35, avgDays: 8.2, trend: "down" },
    { port: "Singapore", containers: 28, avgDays: 10.5, trend: "stable" },
    { port: "Rotterdam", containers: 25, avgDays: 14.2, trend: "up" },
    { port: "Los Angeles", containers: 22, avgDays: 11.8, trend: "stable" },
    { port: "Hamburg", containers: 18, avgDays: 15.4, trend: "up" },
    { port: "Dubai", containers: 15, avgDays: 12.1, trend: "down" },
    { port: "New York", containers: 12, avgDays: 13.5, trend: "stable" },
    { port: "Santos", containers: 10, avgDays: 18.2, trend: "up" },
  ],
  costImpact: {
    dailyStorage: 45, // USD per container
    monthlyTotal: 243000,
    ytdTotal: 2850000,
  },
};

// Repositioning costs
const REPOSITIONING_DATA = {
  totalMonthly: 485000,
  costPerMove: {
    "Asia-Europe": 1850,
    "Asia-North America": 2150,
    "Europe-Asia": 1650,
    "North America-Asia": 1950,
    "Intra-Asia": 650,
    "Intra-Europe": 750,
    "Trans-Atlantic": 1450,
  },
  movesByRoute: [
    { route: "Asia → Europe", moves: 125, cost: 231250, imbalance: -15 },
    { route: "Asia → North America", moves: 95, cost: 204250, imbalance: -22 },
    { route: "Europe → Asia", moves: 85, cost: 140250, imbalance: 12 },
    { route: "North America → Asia", moves: 65, cost: 126750, imbalance: 18 },
    { route: "Intra-Asia", moves: 180, cost: 117000, imbalance: 5 },
    { route: "Intra-Europe", moves: 95, cost: 71250, imbalance: -3 },
    { route: "Trans-Atlantic", moves: 55, cost: 79750, imbalance: -8 },
  ],
  imbalanceByRegion: [
    { region: "Asia Pacific", imbalance: -320, trend: "worsening" },
    { region: "Europe", imbalance: 180, trend: "improving" },
    { region: "North America", imbalance: 145, trend: "stable" },
    { region: "South America", imbalance: -35, trend: "stable" },
    { region: "Middle East", imbalance: 25, trend: "improving" },
    { region: "Africa", imbalance: 5, trend: "stable" },
  ],
  monthlyTrend: [
    { month: "Jan", cost: 425000, moves: 650 },
    { month: "Feb", cost: 445000, moves: 680 },
    { month: "Mar", cost: 460000, moves: 705 },
    { month: "Apr", cost: 455000, moves: 695 },
    { month: "May", cost: 470000, moves: 720 },
    { month: "Jun", cost: 465000, moves: 715 },
    { month: "Jul", cost: 475000, moves: 730 },
    { month: "Aug", cost: 480000, moves: 740 },
    { month: "Sep", cost: 478000, moves: 735 },
    { month: "Oct", cost: 482000, moves: 745 },
    { month: "Nov", cost: 483000, moves: 748 },
    { month: "Dec", cost: 485000, moves: 750 },
  ],
};

// Demand forecast
const DEMAND_FORECAST = {
  nextQuarter: {
    total: 3850,
    growth: 8.2,
    confidence: 85,
  },
  byRegion: [
    { region: "Asia Pacific", demand: 1450, growth: 10.5, trend: "up" },
    { region: "Europe", demand: 980, growth: 6.8, trend: "up" },
    { region: "North America", demand: 750, growth: 7.2, trend: "up" },
    { region: "South America", demand: 320, growth: 5.5, trend: "stable" },
    { region: "Middle East", demand: 220, growth: 4.2, trend: "stable" },
    { region: "Africa", demand: 130, growth: 3.8, trend: "down" },
  ],
  byType: [
    { type: "20' GP", demand: 780, shortage: -45, recommendation: "Increase" },
    { type: "40' GP", demand: 920, shortage: -30, recommendation: "Maintain" },
    { type: "40' HC", demand: 1150, shortage: -85, recommendation: "Increase" },
    { type: "45' HC", demand: 280, shortage: 15, recommendation: "Reduce" },
    { type: "20' Reefer", demand: 185, shortage: -25, recommendation: "Increase" },
    { type: "40' Reefer", demand: 240, shortage: -18, recommendation: "Maintain" },
    { type: "Special Equipment", demand: 295, shortage: 12, recommendation: "Reduce" },
  ],
  forecastMonths: [
    { month: "Jan (Act)", demand: 2950, supply: 2800, gap: -150 },
    { month: "Feb (Act)", demand: 3020, supply: 2900, gap: -120 },
    { month: "Mar (Act)", demand: 3180, supply: 3050, gap: -130 },
    { month: "Apr (Fcst)", demand: 3350, supply: 3150, gap: -200 },
    { month: "May (Fcst)", demand: 3520, supply: 3300, gap: -220 },
    { month: "Jun (Fcst)", demand: 3680, supply: 3450, gap: -230 },
  ],
};

// Optimization tips
const OPTIMIZATION_TIPS = [
  {
    id: 1,
    title: "Reduce Idle Time at High-Duration Ports",
    description: "Rotterdam and Hamburg show above-average idle times. Consider incentive programs for faster container returns.",
    impact: "high",
    savings: 45000,
    effort: "medium",
    category: "utilization",
  },
  {
    id: 2,
    title: "Optimize 40' HC Fleet Allocation",
    description: "High-demand container type with 85 TEU shortage. Recommend leasing additional units for Q2.",
    impact: "high",
    savings: 68000,
    effort: "low",
    category: "demand",
  },
  {
    id: 3,
    title: "Reduce Asia-Europe Repositioning",
    description: "320 TEU imbalance in Asia Pacific. Negotiate backhaul rates to reduce empty repositioning costs.",
    impact: "high",
    savings: 125000,
    effort: "high",
    category: "repositioning",
  },
  {
    id: 4,
    title: "Increase Reefer Fleet Utilization",
    description: "Reefer containers show 75% utilization. Consider seasonal leasing to meet peak demand.",
    impact: "medium",
    savings: 28000,
    effort: "low",
    category: "utilization",
  },
  {
    id: 5,
    title: "Consolidate Special Equipment",
    description: "Open Top and Flat Rack underutilized at 50-58%. Evaluate demand vs. holding costs.",
    impact: "medium",
    savings: 32000,
    effort: "medium",
    category: "utilization",
  },
  {
    id: 6,
    title: "Implement Street Turn Programs",
    description: "Enable direct container interchange to reduce empty trips and improve availability.",
    impact: "high",
    savings: 85000,
    effort: "medium",
    category: "utilization",
  },
  {
    id: 7,
    title: "Review 45' HC Fleet Composition",
    description: "15 TEU surplus with lower utilization. Consider converting to 40' HC or subleasing.",
    impact: "low",
    savings: 15000,
    effort: "low",
    category: "demand",
  },
  {
    id: 8,
    title: "Optimize Transit Times to LATAM",
    description: "Longer idle times in Santos and South American ports. Review carrier schedules.",
    impact: "medium",
    savings: 38000,
    effort: "medium",
    category: "idle",
  },
];

// Colors
const CHART_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  pink: "#EC4899",
};

const STATUS_COLORS = {
  available: "#2E8B57",
  inTransit: "#0F4C81",
  idle: "#F59E0B",
  maintenance: "#8B5CF6",
  outOfService: "#EF4444",
};

// Helper functions
const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
    case "improving":
      return <ArrowUpRight className="h-4 w-4 text-[var(--logistics)]" />;
    case "down":
    case "worsening":
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    default:
      return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "bg-[var(--logistics)] text-white";
    case "medium":
      return "bg-[var(--ocean)] text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

const getEffortBadge = (effort: string) => {
  switch (effort) {
    case "low":
      return <Badge className="bg-[var(--logistics)] text-white">Quick Win</Badge>;
    case "medium":
      return <Badge className="bg-[var(--ocean)] text-white">Moderate</Badge>;
    default:
      return <Badge className="bg-[var(--warning)] text-white">Complex</Badge>;
  }
};

export function ContainerUtilizationTracker() {
  const [activeTab, setActiveTab] = useState("fleet");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedContainerType, setSelectedContainerType] = useState("all");

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const utilizationRate = UTILIZATION_METRICS.overall;
    const idlePercentage = (FLEET_DATA.idle / FLEET_DATA.total) * 100;
    const availablePercentage = (FLEET_DATA.available / FLEET_DATA.total) * 100;
    const inTransitPercentage = (FLEET_DATA.inTransit / FLEET_DATA.total) * 100;

    return {
      utilizationRate,
      idlePercentage,
      availablePercentage,
      inTransitPercentage,
      totalFleet: FLEET_DATA.total,
      potentialSavings: OPTIMIZATION_TIPS.reduce((sum, tip) => sum + tip.savings, 0),
    };
  }, []);

  // Fleet status pie chart data
  const fleetStatusData = useMemo(() => [
    { name: "Available", value: FLEET_DATA.available, color: STATUS_COLORS.available },
    { name: "In Transit", value: FLEET_DATA.inTransit, color: STATUS_COLORS.inTransit },
    { name: "Idle", value: FLEET_DATA.idle, color: STATUS_COLORS.idle },
    { name: "Maintenance", value: FLEET_DATA.maintenance, color: STATUS_COLORS.maintenance },
    { name: "Out of Service", value: FLEET_DATA.outOfService, color: STATUS_COLORS.outOfService },
  ], []);

  // Radar chart data for utilization
  const utilizationRadarData = useMemo(() => {
    return UTILIZATION_METRICS.byRegion.slice(0, 6).map((r) => ({
      region: r.region.split(" ")[0],
      utilization: r.utilization,
      fullMark: 100,
    }));
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean)]/80 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Fleet</p>
                  <p className="text-2xl font-bold">{summaryMetrics.totalFleet}</p>
                  <p className="text-xs opacity-70">TEU capacity</p>
                </div>
                <Container className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-[var(--logistics)] to-[var(--logistics)]/80 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Utilization</p>
                  <p className="text-2xl font-bold">{summaryMetrics.utilizationRate}%</p>
                  <p className="text-xs opacity-70">+2.1% vs last month</p>
                </div>
                <Gauge className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold text-[var(--ocean)]">{FLEET_DATA.inTransit}</p>
                  <p className="text-xs text-muted-foreground">{summaryMetrics.inTransitPercentage.toFixed(1)}%</p>
                </div>
                <Ship className="h-8 w-8 text-[var(--ocean)]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Idle</p>
                  <p className="text-2xl font-bold text-yellow-500">{FLEET_DATA.idle}</p>
                  <p className="text-xs text-muted-foreground">{summaryMetrics.idlePercentage.toFixed(1)}%</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Repositioning</p>
                  <p className="text-2xl font-bold text-red-500">
                    ${(REPOSITIONING_DATA.totalMonthly / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">Monthly cost</p>
                </div>
                <Route className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-[var(--logistics)]/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Potential Savings</p>
                  <p className="text-2xl font-bold text-[var(--logistics)]">
                    ${(summaryMetrics.potentialSavings / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">Monthly</p>
                </div>
                <Lightbulb className="h-8 w-8 text-[var(--logistics)]" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
          <TabsTrigger value="fleet" className="flex items-center gap-1">
            <Container className="h-4 w-4" />
            <span className="hidden sm:inline">Fleet</span>
          </TabsTrigger>
          <TabsTrigger value="utilization" className="flex items-center gap-1">
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Utilization</span>
          </TabsTrigger>
          <TabsTrigger value="idle" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Idle Time</span>
          </TabsTrigger>
          <TabsTrigger value="repositioning" className="flex items-center gap-1">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Repositioning</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Optimize</span>
          </TabsTrigger>
        </TabsList>

        {/* Fleet Tab */}
        <TabsContent value="fleet" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Fleet Overview Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Container className="h-5 w-5 text-[var(--ocean)]" />
                  Fleet Status Overview
                </CardTitle>
                <CardDescription>Current distribution of container fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={fleetStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {fleetStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Legend */}
                  <div className="flex flex-col justify-center space-y-3">
                    {fleetStatusData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.value}</span>
                          <span className="text-sm text-muted-foreground">
                            ({((item.value / FLEET_DATA.total) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fleet by Region */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[var(--logistics)]" />
                  By Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {FLEET_DATA.byRegion.map((region) => (
                    <div key={region.region} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{region.region}</span>
                        <span className="font-medium">{region.total}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                        <div
                          className="bg-[var(--logistics)]"
                          style={{ width: `${(region.available / region.total) * 100}%` }}
                        />
                        <div
                          className="bg-[var(--ocean)]"
                          style={{ width: `${(region.inTransit / region.total) * 100}%` }}
                        />
                        <div
                          className="bg-yellow-500"
                          style={{ width: `${(region.idle / region.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--logistics)]" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-[var(--ocean)]" />
                    <span>In Transit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span>Idle</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fleet by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Fleet by Container Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={FLEET_DATA.byType}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={70} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="available" stackId="a" fill={STATUS_COLORS.available} name="Available" />
                    <Bar dataKey="inTransit" stackId="a" fill={STATUS_COLORS.inTransit} name="In Transit" />
                    <Bar dataKey="idle" stackId="a" fill={STATUS_COLORS.idle} name="Idle" />
                    <Bar dataKey="maintenance" stackId="a" fill={STATUS_COLORS.maintenance} name="Maintenance" />
                    <Bar dataKey="outOfService" stackId="a" fill={STATUS_COLORS.outOfService} name="Out of Service" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilization Tab */}
        <TabsContent value="utilization" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Overall Utilization Gauge */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--logistics)]" />
                  Overall Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div
                      className="w-40 h-40 rounded-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(${CHART_COLORS.logistics} ${summaryMetrics.utilizationRate * 3.6}deg, oklch(0.93 0.005 240) 0deg)`,
                      }}
                    >
                      <div className="w-32 h-32 rounded-full bg-card flex items-center justify-center">
                        <div className="text-center">
                          <span
                            className="text-4xl font-bold"
                            style={{ color: CHART_COLORS.logistics }}
                          >
                            {summaryMetrics.utilizationRate.toFixed(1)}%
                          </span>
                          <p className="text-sm text-muted-foreground">Target: 75%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gap to Target</span>
                    <span className="font-medium text-yellow-500">
                      {(75 - summaryMetrics.utilizationRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Improvement</span>
                    <span className="font-medium text-[var(--logistics)]">+2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Utilization by Region Radar */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Utilization by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={utilizationRadarData}>
                      <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                      <PolarAngleAxis dataKey="region" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Utilization"
                        dataKey="utilization"
                        stroke={CHART_COLORS.ocean}
                        fill={CHART_COLORS.ocean}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Utilization Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Utilization Trend (12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={UTILIZATION_METRICS.monthly}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="right" dataKey="available" fill={CHART_COLORS.logistics} name="Available" opacity={0.7} />
                    <Bar yAxisId="right" dataKey="inTransit" fill={CHART_COLORS.ocean} name="In Transit" opacity={0.7} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="utilization"
                      stroke={CHART_COLORS.warning}
                      strokeWidth={3}
                      name="Utilization %"
                      dot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Utilization by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Utilization by Container Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {UTILIZATION_METRICS.byType.map((type) => (
                  <Card key={type.type} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{type.type}</span>
                        {getTrendIcon(type.trend)}
                      </div>
                      <div className="text-2xl font-bold mb-2" style={{ color: CHART_COLORS.logistics }}>
                        {type.utilization}%
                      </div>
                      <Progress value={type.utilization} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Change:</span>
                        <span className={type.change >= 0 ? "text-[var(--logistics)]" : "text-red-500"}>
                          {type.change >= 0 ? "+" : ""}{type.change}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Idle Time Tab */}
        <TabsContent value="idle" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Idle Time Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Idle Time Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Idle Time</p>
                  <p className="text-4xl font-bold text-yellow-500">
                    {IDLE_TIME_DATA.averageDays}
                  </p>
                  <p className="text-sm text-muted-foreground">days</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Storage Cost</span>
                    <span className="font-medium">${IDLE_TIME_DATA.costImpact.dailyStorage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Cost</span>
                    <span className="font-medium text-red-500">
                      ${(IDLE_TIME_DATA.costImpact.monthlyTotal / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">YTD Cost</span>
                    <span className="font-medium text-red-500">
                      ${(IDLE_TIME_DATA.costImpact.ytdTotal / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Idle by Duration */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Idle Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={IDLE_TIME_DATA.byDuration}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill={CHART_COLORS.warning}>
                        {IDLE_TIME_DATA.byDuration.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index > 3 ? CHART_COLORS.danger : CHART_COLORS.warning}
                          />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {IDLE_TIME_DATA.byDuration.slice(0, 3).map((d) => (
                    <div key={d.range} className="text-center p-2 bg-muted/30 rounded">
                      <p className="text-xs text-muted-foreground">{d.range}</p>
                      <p className="font-medium">{d.count} containers</p>
                      <p className="text-xs text-muted-foreground">{d.percentage}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Idle by Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--logistics)]" />
                Idle Containers by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Port</th>
                      <th className="text-center py-3 px-4">Containers</th>
                      <th className="text-center py-3 px-4">Avg Days</th>
                      <th className="text-center py-3 px-4">Trend</th>
                      <th className="text-right py-3 px-4">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {IDLE_TIME_DATA.byLocation.map((loc) => (
                      <tr key={loc.port} className="border-b">
                        <td className="py-3 px-4 font-medium">{loc.port}</td>
                        <td className="text-center py-3 px-4">{loc.containers}</td>
                        <td className="text-center py-3 px-4">
                          <span className={loc.avgDays > 14 ? "text-red-500" : loc.avgDays > 10 ? "text-yellow-500" : "text-[var(--logistics)]"}>
                            {loc.avgDays}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">{getTrendIcon(loc.trend)}</td>
                        <td className="text-right py-3 px-4">
                          ${(loc.containers * loc.avgDays * IDLE_TIME_DATA.costImpact.dailyStorage).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Repositioning Tab */}
        <TabsContent value="repositioning" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Repositioning Cost Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-red-500" />
                  Monthly Repositioning Cost
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-red-500/10 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-4xl font-bold text-red-500">
                    ${(REPOSITIONING_DATA.totalMonthly / 1000).toFixed(0)}K
                  </p>
                </div>
                <Separator />
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium">Cost per Move by Route:</p>
                  {Object.entries(REPOSITIONING_DATA.costPerMove).slice(0, 4).map(([route, cost]) => (
                    <div key={route} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{route}</span>
                      <span className="font-medium">${cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Imbalance by Region */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Container Imbalance by Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {REPOSITIONING_DATA.imbalanceByRegion.map((region) => (
                    <div
                      key={region.region}
                      className={`p-4 rounded-lg border ${
                        Math.abs(region.imbalance) > 100
                          ? "border-red-500/50 bg-red-500/5"
                          : Math.abs(region.imbalance) > 50
                          ? "border-yellow-500/50 bg-yellow-500/5"
                          : "border-muted bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{region.region}</span>
                        {getTrendIcon(region.trend)}
                      </div>
                      <div className="text-2xl font-bold" style={{ color: region.imbalance < 0 ? CHART_COLORS.danger : CHART_COLORS.logistics }}>
                        {region.imbalance > 0 ? "+" : ""}{region.imbalance}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {region.imbalance < 0 ? "Surplus (outbound)" : "Deficit (inbound)"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Repositioning Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Repositioning Cost Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={REPOSITIONING_DATA.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="cost"
                      fill={CHART_COLORS.danger}
                      stroke={CHART_COLORS.danger}
                      fillOpacity={0.3}
                      name="Cost ($)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="moves"
                      stroke={CHART_COLORS.ocean}
                      strokeWidth={2}
                      name="Moves"
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Moves by Route */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-[var(--logistics)]" />
                Repositioning Moves by Route
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={REPOSITIONING_DATA.movesByRoute} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" />
                    <YAxis dataKey="route" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="moves" fill={CHART_COLORS.ocean} name="Moves" />
                    <Bar dataKey="cost" fill={CHART_COLORS.warning} name="Cost ($)" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecast Tab */}
        <TabsContent value="forecast" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Forecast Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Next Quarter Forecast
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-[var(--logistics)]/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Projected Demand</p>
                  <p className="text-4xl font-bold text-[var(--logistics)]">
                    {DEMAND_FORECAST.nextQuarter.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">TEU</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground">Growth</p>
                    <p className="text-xl font-bold text-[var(--logistics)]">
                      +{DEMAND_FORECAST.nextQuarter.growth}%
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <p className="text-xl font-bold text-[var(--ocean)]">
                      {DEMAND_FORECAST.nextQuarter.confidence}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demand vs Supply Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[var(--ocean)]" />
                  Demand vs Supply Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={DEMAND_FORECAST.forecastMonths}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="demand" fill={CHART_COLORS.ocean} name="Demand" />
                      <Bar dataKey="supply" fill={CHART_COLORS.logistics} name="Supply" />
                      <Line
                        type="monotone"
                        dataKey="gap"
                        stroke={CHART_COLORS.danger}
                        strokeWidth={2}
                        name="Gap"
                        dot={{ r: 3 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demand by Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--logistics)]" />
                Demand Forecast by Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DEMAND_FORECAST.byRegion.map((region) => (
                  <Card key={region.region} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{region.region}</span>
                        {getTrendIcon(region.trend)}
                      </div>
                      <div className="text-2xl font-bold text-[var(--ocean)] mb-2">
                        {region.demand.toLocaleString()} TEU
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={region.growth > 5 ? "bg-[var(--logistics)]" : "bg-[var(--ocean)]"}>
                          +{region.growth}% growth
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shortage by Type */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Container Type Shortage/Surplus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Container Type</th>
                      <th className="text-center py-3 px-4">Demand</th>
                      <th className="text-center py-3 px-4">Shortage/Surplus</th>
                      <th className="text-center py-3 px-4">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMAND_FORECAST.byType.map((type) => (
                      <tr key={type.type} className="border-b">
                        <td className="py-3 px-4 font-medium">{type.type}</td>
                        <td className="text-center py-3 px-4">{type.demand} TEU</td>
                        <td className="text-center py-3 px-4">
                          <span className={type.shortage < 0 ? "text-red-500" : "text-[var(--logistics)]"}>
                            {type.shortage > 0 ? "+" : ""}{type.shortage}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <Badge className={
                            type.recommendation === "Increase" ? "bg-red-500" :
                            type.recommendation === "Reduce" ? "bg-[var(--logistics)]" :
                            "bg-[var(--ocean)]"
                          }>
                            {type.recommendation}
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

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6 mt-6">
          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--logistics)] flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Optimization Recommendations</h3>
                    <p className="text-muted-foreground">
                      {OPTIMIZATION_TIPS.length} actionable suggestions with potential monthly savings of ${(summaryMetrics.potentialSavings / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
                <Button className="bg-[var(--logistics)] hover:bg-[var(--logistics)]/90">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Optimization Tips Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {OPTIMIZATION_TIPS.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getImpactColor(tip.impact)}>
                          {tip.impact.charAt(0).toUpperCase() + tip.impact.slice(1)} Impact
                        </Badge>
                        {getEffortBadge(tip.effort)}
                      </div>
                      <span className="text-lg font-bold text-[var(--logistics)]">
                        ${tip.savings.toLocaleString()}
                      </span>
                    </div>
                    <h4 className="font-medium mb-2">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        {tip.category}
                      </Badge>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        Details
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Prioritized Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                Prioritized Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {OPTIMIZATION_TIPS.filter(tip => tip.impact === "high").slice(0, 4).map((tip, index) => (
                  <div key={tip.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[var(--logistics)] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{tip.title}</h4>
                        <span className="font-bold text-[var(--logistics)]">${tip.savings.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getImpactColor(tip.impact)}>{tip.impact} impact</Badge>
                        {getEffortBadge(tip.effort)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
