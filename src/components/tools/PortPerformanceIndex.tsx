"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Ship,
  Clock,
  Container,
  Anchor,
  Globe,
  Activity,
  RefreshCw,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Gauge,
  Calendar,
  MapPin,
  Zap,
  Target,
  BarChart2,
  LineChart,
  PieChart,
  TrendingUp as TrendIcon,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Download,
  Star,
  StarOff,
  Share2,
  RotateCcw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  AlertCircle,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  AreaChart,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts";

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  success: "#22C55E",
  neutral: "#6B7280",
  excellent: "#10B981",
  good: "#0F4C81",
  average: "#F59E0B",
  below: "#F97316",
  poor: "#EF4444",
};

// Port Performance Data Interface
interface PortPerformance {
  rank: number;
  code: string;
  name: string;
  country: string;
  region: string;
  throughput: number;
  throughputYoY: number;
  vesselTurnaround: number;
  vesselTurnaroundYoY: number;
  berthProductivity: number;
  berthProductivityYoY: number;
  craneProductivity: number;
  yardUtilization: number;
  efficiencyScore: number;
  overallScore: number;
  trend: "up" | "down" | "stable";
  status: "excellent" | "good" | "average" | "below" | "poor";
  lat: number;
  lng: number;
  terminals: number;
  berths: number;
  maxDraft: number;
  lastUpdated: string;
}

// Port data
const PORTS: PortPerformance[] = [
  {
    rank: 1,
    code: "CNSHA",
    name: "Shanghai",
    country: "China",
    region: "Asia",
    throughput: 47300000,
    throughputYoY: 3.2,
    vesselTurnaround: 18.5,
    vesselTurnaroundYoY: -5.2,
    berthProductivity: 42.8,
    berthProductivityYoY: 4.1,
    craneProductivity: 35.2,
    yardUtilization: 78,
    efficiencyScore: 94.5,
    overallScore: 95.2,
    trend: "up",
    status: "excellent",
    lat: 31.2304,
    lng: 121.4737,
    terminals: 25,
    berths: 125,
    maxDraft: 16.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 2,
    code: "SGSIN",
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    throughput: 37800000,
    throughputYoY: 1.8,
    vesselTurnaround: 14.2,
    vesselTurnaroundYoY: -3.8,
    berthProductivity: 48.5,
    berthProductivityYoY: 5.2,
    craneProductivity: 38.6,
    yardUtilization: 82,
    efficiencyScore: 96.8,
    overallScore: 94.8,
    trend: "up",
    status: "excellent",
    lat: 1.2644,
    lng: 103.8185,
    terminals: 6,
    berths: 67,
    maxDraft: 18.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 3,
    code: "CNNGB",
    name: "Ningbo-Zhoushan",
    country: "China",
    region: "Asia",
    throughput: 35800000,
    throughputYoY: 5.1,
    vesselTurnaround: 19.8,
    vesselTurnaroundYoY: -4.2,
    berthProductivity: 40.2,
    berthProductivityYoY: 3.8,
    craneProductivity: 33.8,
    yardUtilization: 75,
    efficiencyScore: 92.1,
    overallScore: 93.5,
    trend: "up",
    status: "excellent",
    lat: 29.8683,
    lng: 121.5440,
    terminals: 18,
    berths: 98,
    maxDraft: 17.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 4,
    code: "CNSZX",
    name: "Shenzhen",
    country: "China",
    region: "Asia",
    throughput: 30000000,
    throughputYoY: 2.4,
    vesselTurnaround: 22.5,
    vesselTurnaroundYoY: -2.8,
    berthProductivity: 38.6,
    berthProductivityYoY: 2.9,
    craneProductivity: 32.4,
    yardUtilization: 80,
    efficiencyScore: 89.2,
    overallScore: 91.8,
    trend: "up",
    status: "excellent",
    lat: 22.5431,
    lng: 114.0579,
    terminals: 15,
    berths: 78,
    maxDraft: 15.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 5,
    code: "KRPUS",
    name: "Busan",
    country: "South Korea",
    region: "Asia",
    throughput: 22100000,
    throughputYoY: 1.5,
    vesselTurnaround: 16.8,
    vesselTurnaroundYoY: -4.5,
    berthProductivity: 44.2,
    berthProductivityYoY: 4.8,
    craneProductivity: 36.8,
    yardUtilization: 76,
    efficiencyScore: 93.5,
    overallScore: 92.4,
    trend: "stable",
    status: "excellent",
    lat: 35.0714,
    lng: 129.0320,
    terminals: 9,
    berths: 52,
    maxDraft: 16.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 6,
    code: "NLRTM",
    name: "Rotterdam",
    country: "Netherlands",
    region: "Europe",
    throughput: 14450000,
    throughputYoY: -2.1,
    vesselTurnaround: 24.5,
    vesselTurnaroundYoY: 2.3,
    berthProductivity: 36.8,
    berthProductivityYoY: 1.2,
    craneProductivity: 30.2,
    yardUtilization: 68,
    efficiencyScore: 86.5,
    overallScore: 88.2,
    trend: "down",
    status: "good",
    lat: 51.9054,
    lng: 4.4454,
    terminals: 13,
    berths: 68,
    maxDraft: 22.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 7,
    code: "HKHKG",
    name: "Hong Kong",
    country: "Hong Kong",
    region: "Asia",
    throughput: 16800000,
    throughputYoY: -4.2,
    vesselTurnaround: 17.5,
    vesselTurnaroundYoY: -1.5,
    berthProductivity: 42.5,
    berthProductivityYoY: 2.1,
    craneProductivity: 34.8,
    yardUtilization: 72,
    efficiencyScore: 88.8,
    overallScore: 87.5,
    trend: "down",
    status: "good",
    lat: 22.2855,
    lng: 114.1577,
    terminals: 9,
    berths: 24,
    maxDraft: 15.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 8,
    code: "USLAX",
    name: "Los Angeles",
    country: "United States",
    region: "North America",
    throughput: 9280000,
    throughputYoY: -8.5,
    vesselTurnaround: 28.5,
    vesselTurnaroundYoY: 12.5,
    berthProductivity: 32.4,
    berthProductivityYoY: -2.1,
    craneProductivity: 28.6,
    yardUtilization: 85,
    efficiencyScore: 78.5,
    overallScore: 82.4,
    trend: "down",
    status: "good",
    lat: 33.7361,
    lng: -118.2628,
    terminals: 13,
    berths: 42,
    maxDraft: 15.2,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 9,
    code: "BEANR",
    name: "Antwerp",
    country: "Belgium",
    region: "Europe",
    throughput: 12000000,
    throughputYoY: 2.8,
    vesselTurnaround: 21.2,
    vesselTurnaroundYoY: -3.5,
    berthProductivity: 35.8,
    berthProductivityYoY: 3.2,
    craneProductivity: 29.5,
    yardUtilization: 71,
    efficiencyScore: 85.2,
    overallScore: 86.8,
    trend: "up",
    status: "good",
    lat: 51.2640,
    lng: 4.3983,
    terminals: 12,
    berths: 58,
    maxDraft: 17.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 10,
    code: "DEHAM",
    name: "Hamburg",
    country: "Germany",
    region: "Europe",
    throughput: 8500000,
    throughputYoY: -5.2,
    vesselTurnaround: 26.8,
    vesselTurnaroundYoY: 4.8,
    berthProductivity: 32.5,
    berthProductivityYoY: -1.5,
    craneProductivity: 27.2,
    yardUtilization: 70,
    efficiencyScore: 79.5,
    overallScore: 83.2,
    trend: "down",
    status: "good",
    lat: 53.5397,
    lng: 9.9918,
    terminals: 4,
    berths: 35,
    maxDraft: 14.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 11,
    code: "USLGB",
    name: "Long Beach",
    country: "United States",
    region: "North America",
    throughput: 8450000,
    throughputYoY: -7.2,
    vesselTurnaround: 27.2,
    vesselTurnaroundYoY: 8.5,
    berthProductivity: 33.8,
    berthProductivityYoY: -1.8,
    craneProductivity: 29.2,
    yardUtilization: 82,
    efficiencyScore: 77.8,
    overallScore: 81.5,
    trend: "down",
    status: "good",
    lat: 33.7540,
    lng: -118.2170,
    terminals: 12,
    berths: 38,
    maxDraft: 15.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 12,
    code: "TWKHH",
    name: "Kaohsiung",
    country: "Taiwan",
    region: "Asia",
    throughput: 9850000,
    throughputYoY: 0.8,
    vesselTurnaround: 18.8,
    vesselTurnaroundYoY: -2.2,
    berthProductivity: 40.5,
    berthProductivityYoY: 2.5,
    craneProductivity: 33.5,
    yardUtilization: 74,
    efficiencyScore: 88.2,
    overallScore: 87.8,
    trend: "stable",
    status: "good",
    lat: 22.6163,
    lng: 120.2935,
    terminals: 6,
    berths: 42,
    maxDraft: 16.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 13,
    code: "MYTPP",
    name: "Port Klang",
    country: "Malaysia",
    region: "Asia",
    throughput: 13800000,
    throughputYoY: 4.5,
    vesselTurnaround: 19.5,
    vesselTurnaroundYoY: -3.2,
    berthProductivity: 38.2,
    berthProductivityYoY: 3.5,
    craneProductivity: 31.8,
    yardUtilization: 73,
    efficiencyScore: 87.5,
    overallScore: 86.2,
    trend: "up",
    status: "good",
    lat: 3.0010,
    lng: 101.3930,
    terminals: 8,
    berths: 45,
    maxDraft: 15.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 14,
    code: "AEJEA",
    name: "Jebel Ali",
    country: "UAE",
    region: "Middle East",
    throughput: 13900000,
    throughputYoY: 3.2,
    vesselTurnaround: 20.5,
    vesselTurnaroundYoY: -4.5,
    berthProductivity: 36.5,
    berthProductivityYoY: 4.2,
    craneProductivity: 30.5,
    yardUtilization: 75,
    efficiencyScore: 85.8,
    overallScore: 85.5,
    trend: "up",
    status: "good",
    lat: 25.0072,
    lng: 55.0273,
    terminals: 4,
    berths: 35,
    maxDraft: 17.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 15,
    code: "CNTXG",
    name: "Tianjin",
    country: "China",
    region: "Asia",
    throughput: 21000000,
    throughputYoY: 1.2,
    vesselTurnaround: 21.5,
    vesselTurnaroundYoY: -1.8,
    berthProductivity: 37.2,
    berthProductivityYoY: 2.5,
    craneProductivity: 31.2,
    yardUtilization: 77,
    efficiencyScore: 86.5,
    overallScore: 85.2,
    trend: "stable",
    status: "good",
    lat: 38.9837,
    lng: 117.7081,
    terminals: 10,
    berths: 52,
    maxDraft: 15.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 16,
    code: "ESBAR",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    throughput: 3600000,
    throughputYoY: 5.5,
    vesselTurnaround: 18.2,
    vesselTurnaroundYoY: -6.5,
    berthProductivity: 38.5,
    berthProductivityYoY: 5.8,
    craneProductivity: 32.2,
    yardUtilization: 65,
    efficiencyScore: 89.5,
    overallScore: 84.8,
    trend: "up",
    status: "good",
    lat: 41.3463,
    lng: 2.1503,
    terminals: 3,
    berths: 22,
    maxDraft: 16.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 17,
    code: "USNYC",
    name: "New York/New Jersey",
    country: "United States",
    region: "North America",
    throughput: 7850000,
    throughputYoY: -6.8,
    vesselTurnaround: 32.5,
    vesselTurnaroundYoY: 15.2,
    berthProductivity: 28.5,
    berthProductivityYoY: -3.5,
    craneProductivity: 25.8,
    yardUtilization: 88,
    efficiencyScore: 72.5,
    overallScore: 76.8,
    trend: "down",
    status: "average",
    lat: 40.6657,
    lng: -74.0450,
    terminals: 5,
    berths: 32,
    maxDraft: 15.2,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 18,
    code: "THLCH",
    name: "Laem Chabang",
    country: "Thailand",
    region: "Asia",
    throughput: 8500000,
    throughputYoY: 2.8,
    vesselTurnaround: 22.5,
    vesselTurnaroundYoY: -2.5,
    berthProductivity: 35.5,
    berthProductivityYoY: 2.8,
    craneProductivity: 29.5,
    yardUtilization: 72,
    efficiencyScore: 83.5,
    overallScore: 82.5,
    trend: "up",
    status: "good",
    lat: 13.0891,
    lng: 100.8848,
    terminals: 6,
    berths: 28,
    maxDraft: 16.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 19,
    code: "INNSA",
    name: "Jawaharlal Nehru",
    country: "India",
    region: "Asia",
    throughput: 6400000,
    throughputYoY: 6.2,
    vesselTurnaround: 28.5,
    vesselTurnaroundYoY: -5.8,
    berthProductivity: 32.2,
    berthProductivityYoY: 4.5,
    craneProductivity: 27.5,
    yardUtilization: 78,
    efficiencyScore: 78.8,
    overallScore: 80.5,
    trend: "up",
    status: "good",
    lat: 18.9524,
    lng: 72.9483,
    terminals: 3,
    berths: 24,
    maxDraft: 14.0,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
  {
    rank: 20,
    code: "BRSSZ",
    name: "Santos",
    country: "Brazil",
    region: "South America",
    throughput: 4800000,
    throughputYoY: 3.5,
    vesselTurnaround: 35.5,
    vesselTurnaroundYoY: -2.2,
    berthProductivity: 28.5,
    berthProductivityYoY: 3.2,
    craneProductivity: 24.5,
    yardUtilization: 68,
    efficiencyScore: 72.5,
    overallScore: 75.2,
    trend: "up",
    status: "average",
    lat: -23.9480,
    lng: -46.3003,
    terminals: 6,
    berths: 22,
    maxDraft: 14.5,
    lastUpdated: "2024-01-15T10:00:00Z",
  },
];

// Historical throughput data (12 months)
const THROUGHPUT_TRENDS: Record<string, Array<{ month: string; throughput: number }>> = {
  CNSHA: [
    { month: "Jan", throughput: 3850000 },
    { month: "Feb", throughput: 3720000 },
    { month: "Mar", throughput: 4010000 },
    { month: "Apr", throughput: 3980000 },
    { month: "May", throughput: 4050000 },
    { month: "Jun", throughput: 3920000 },
    { month: "Jul", throughput: 4150000 },
    { month: "Aug", throughput: 4080000 },
    { month: "Sep", throughput: 4020000 },
    { month: "Oct", throughput: 4180000 },
    { month: "Nov", throughput: 4250000 },
    { month: "Dec", throughput: 4200000 },
  ],
  SGSIN: [
    { month: "Jan", throughput: 3050000 },
    { month: "Feb", throughput: 2980000 },
    { month: "Mar", throughput: 3150000 },
    { month: "Apr", throughput: 3100000 },
    { month: "May", throughput: 3180000 },
    { month: "Jun", throughput: 3080000 },
    { month: "Jul", throughput: 3220000 },
    { month: "Aug", throughput: 3160000 },
    { month: "Sep", throughput: 3120000 },
    { month: "Oct", throughput: 3250000 },
    { month: "Nov", throughput: 3320000 },
    { month: "Dec", throughput: 3280000 },
  ],
  NLRTM: [
    { month: "Jan", throughput: 1250000 },
    { month: "Feb", throughput: 1180000 },
    { month: "Mar", throughput: 1220000 },
    { month: "Apr", throughput: 1190000 },
    { month: "May", throughput: 1240000 },
    { month: "Jun", throughput: 1150000 },
    { month: "Jul", throughput: 1210000 },
    { month: "Aug", throughput: 1180000 },
    { month: "Sep", throughput: 1160000 },
    { month: "Oct", throughput: 1200000 },
    { month: "Nov", throughput: 1230000 },
    { month: "Dec", throughput: 1190000 },
  ],
};

// Efficiency trends
const EFFICIENCY_TRENDS: Record<string, Array<{ month: string; efficiency: number; turnaround: number; productivity: number }>> = {
  CNSHA: [
    { month: "Jan", efficiency: 92.5, turnaround: 19.2, productivity: 40.5 },
    { month: "Feb", efficiency: 93.1, turnaround: 18.8, productivity: 41.2 },
    { month: "Mar", efficiency: 93.5, turnaround: 18.5, productivity: 41.8 },
    { month: "Apr", efficiency: 93.8, turnaround: 18.2, productivity: 42.0 },
    { month: "May", efficiency: 94.0, turnaround: 18.0, productivity: 42.2 },
    { month: "Jun", efficiency: 94.2, turnaround: 17.8, productivity: 42.5 },
    { month: "Jul", efficiency: 94.3, turnaround: 18.2, productivity: 42.6 },
    { month: "Aug", efficiency: 94.4, turnaround: 18.5, productivity: 42.7 },
    { month: "Sep", efficiency: 94.3, turnaround: 18.8, productivity: 42.6 },
    { month: "Oct", efficiency: 94.4, turnaround: 18.2, productivity: 42.7 },
    { month: "Nov", efficiency: 94.5, turnaround: 18.0, productivity: 42.8 },
    { month: "Dec", efficiency: 94.5, turnaround: 18.5, productivity: 42.8 },
  ],
  SGSIN: [
    { month: "Jan", efficiency: 95.8, turnaround: 14.8, productivity: 47.2 },
    { month: "Feb", efficiency: 96.0, turnaround: 14.5, productivity: 47.8 },
    { month: "Mar", efficiency: 96.2, turnaround: 14.2, productivity: 48.2 },
    { month: "Apr", efficiency: 96.3, turnaround: 14.0, productivity: 48.3 },
    { month: "May", efficiency: 96.4, turnaround: 13.8, productivity: 48.4 },
    { month: "Jun", efficiency: 96.5, turnaround: 14.0, productivity: 48.5 },
    { month: "Jul", efficiency: 96.6, turnaround: 14.2, productivity: 48.5 },
    { month: "Aug", efficiency: 96.7, turnaround: 14.5, productivity: 48.6 },
    { month: "Sep", efficiency: 96.6, turnaround: 14.2, productivity: 48.5 },
    { month: "Oct", efficiency: 96.7, turnaround: 14.0, productivity: 48.5 },
    { month: "Nov", efficiency: 96.8, turnaround: 14.2, productivity: 48.5 },
    { month: "Dec", efficiency: 96.8, turnaround: 14.2, productivity: 48.5 },
  ],
};

// Regions filter
const REGIONS = ["All", "Asia", "Europe", "North America", "South America", "Middle East", "Africa", "Oceania"];

// Selection criteria weights
interface CriteriaWeights {
  throughput: number;
  turnaround: number;
  productivity: number;
  efficiency: number;
  utilization: number;
}

// Get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case "excellent":
      return COLORS.excellent;
    case "good":
      return COLORS.good;
    case "average":
      return COLORS.average;
    case "below":
      return COLORS.below;
    case "poor":
      return COLORS.poor;
    default:
      return COLORS.neutral;
  }
};

// Get trend icon
const getTrendIcon = (trend: string, size: "sm" | "md" = "md") => {
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  switch (trend) {
    case "up":
      return <TrendingUp className={`${iconSize} text-[var(--logistics)]`} />;
    case "down":
      return <TrendingDown className={`${iconSize} text-red-500`} />;
    default:
      return <Minus className={`${iconSize} text-yellow-500`} />;
  }
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-card-foreground mb-1">{label}</p>
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

// Pro Tips Data
const PRO_TIPS = [
  {
    icon: Target,
    title: "Prioritize Turnaround Time",
    description: "Vessel turnaround time directly impacts your supply chain efficiency. Ports with turnaround under 20 hours typically offer better scheduling predictability and reduced demurrage risk for your shipments."
  },
  {
    icon: Gauge,
    title: "Monitor Berth Productivity",
    description: "High berth productivity (40+ moves/hour) indicates efficient loading/unloading operations. This translates to faster cargo release and reduced port dwell times for your containers."
  },
  {
    icon: Activity,
    title: "Track Yard Utilization Trends",
    description: "Yard utilization between 70-80% is optimal. Higher rates may indicate congestion risk, while lower rates suggest underutilized capacity. Consider alternate ports during peak seasons."
  },
  {
    icon: TrendingUp,
    title: "Consider Year-over-Year Trends",
    description: "Ports with positive YoY growth in efficiency scores are investing in infrastructure. These ports often provide better long-term reliability for your regular shipping routes."
  },
  {
    icon: Globe,
    title: "Diversify Your Port Portfolio",
    description: "Don't rely on a single port. Maintain relationships with 2-3 ports per region to ensure supply chain resilience during disruptions, strikes, or capacity constraints."
  },
  {
    icon: Clock,
    title: "Factor in Regional Differences",
    description: "Asian ports generally have faster turnaround times but higher utilization. European ports may offer more buffer capacity. Match your cargo urgency to port characteristics."
  }
];

// Common Mistakes Data
const COMMON_MISTAKES = [
  {
    icon: AlertTriangle,
    title: "Focusing Only on Throughput Volume",
    description: "While high throughput indicates capacity, it doesn't guarantee efficiency. A port handling 30M TEU with 30-hour turnaround may be worse for your business than a 10M TEU port with 15-hour turnaround. Always consider multiple metrics together."
  },
  {
    icon: XCircle,
    title: "Ignoring Yard Utilization Rates",
    description: "High yard utilization (above 85%) often leads to congestion, delayed container pickup, and increased demurrage charges. Always check yard utilization before routing cargo through a port, especially during peak seasons."
  },
  {
    icon: AlertCircle,
    title: "Overlooking Infrastructure Limitations",
    description: "A port may have excellent productivity scores but limited draft for large vessels. Ensure the port's max draft accommodates your vessel size, particularly for 18,000+ TEU ships requiring 16+ meter drafts."
  },
  {
    icon: Minus,
    title: "Neglecting Year-over-Year Trends",
    description: "A port's current score is just a snapshot. Declining efficiency trends may indicate underlying issues like labor disputes, outdated equipment, or capacity constraints. Always review 12-month trends before making routing decisions."
  },
  {
    icon: Filter,
    title: "Using Generic Weightings for All Cargo",
    description: "Different cargo types have different priorities. Perishable goods need fast turnaround, while project cargo may prioritize equipment availability. Customize your criteria weights based on your specific shipment requirements."
  }
];

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is the Port Performance Index and why is it important for logistics planning?",
    answer: "The Port Performance Index is a comprehensive measurement system that evaluates global container ports based on multiple operational metrics including throughput capacity, vessel turnaround time, berth productivity, and efficiency scores. This index is crucial for logistics planning because it helps shippers and freight forwarders make informed decisions about port selection, optimize supply chain routes, and anticipate potential delays. By understanding port performance metrics, businesses can reduce demurrage costs, improve delivery predictability, and build more resilient supply chains. The index aggregates data from port authorities, terminal operators, and shipping lines to provide standardized comparisons across different regions and operational contexts."
  },
  {
    question: "How is vessel turnaround time calculated and what does it indicate?",
    answer: "Vessel turnaround time measures the total duration a ship spends at a port from arrival to departure, including pilotage, berthing, loading/unloading operations, and departure procedures. This metric is typically calculated as the average across all vessel calls during a reporting period. Lower turnaround times generally indicate more efficient port operations, better coordination between terminal operators and shipping lines, and modern cargo handling equipment. For shippers, faster turnaround means more predictable schedules, reduced risk of cascading delays, and lower potential for demurrage charges. The global average for major container ports ranges from 15-35 hours, with top-performing Asian ports achieving under 20 hours consistently."
  },
  {
    question: "What factors influence berth productivity and how does it affect my shipments?",
    answer: "Berth productivity is measured in container moves per hour and depends on several key factors: the number and capacity of quay cranes, crane operator skill levels, yard equipment efficiency, IT systems integration, and vessel stowage planning. Modern ports with automated cranes can achieve 40-50 moves per hour, while older facilities may operate at 20-30 moves per hour. Higher berth productivity directly impacts your shipments by reducing the time your cargo spends at port, minimizing the window for potential disruptions, and enabling faster container availability for pickup. This metric is particularly important for time-sensitive cargo or when you have tight connection schedules with feeder vessels or inland transportation."
  },
  {
    question: "How should I interpret yard utilization percentages when selecting ports?",
    answer: "Yard utilization represents the percentage of available storage capacity being used at any given time. The optimal range is typically 70-80%, which provides sufficient buffer for operational flexibility without excessive congestion. Ports operating above 85% utilization often experience container retrieval delays, gate congestion, and increased risk of operational disruptions. During peak seasons or supply chain disruptions, high-utilization ports may impose restrictions or experience extended dwell times. When selecting ports, consider yard utilization trends alongside your cargo sensitivity. For regular shipments, moderate utilization ports offer reliability; for urgent cargo, lower utilization ports provide more flexibility and faster processing."
  },
  {
    question: "What is the difference between efficiency score and overall score in port rankings?",
    answer: "The efficiency score specifically measures operational performance metrics such as berth productivity, crane productivity, yard efficiency, and resource utilization. This score focuses on how well a port uses its resources and executes operations. The overall score is a broader assessment that includes efficiency metrics but also factors in infrastructure capacity, connectivity, service quality, and growth trajectory. While efficiency scores highlight operational excellence, overall scores provide a more comprehensive view of a port's total capability. For day-to-day shipping decisions, efficiency scores may be more relevant, while overall scores better indicate long-term reliability and capacity for scaling operations."
  },
  {
    question: "How do regional differences affect port performance and what should I consider?",
    answer: "Regional differences significantly impact port performance due to varying labor practices, infrastructure investment levels, regulatory environments, and cargo mix patterns. Asian ports typically lead in operational efficiency due to heavy automation investment, 24/7 operations, and high-volume throughput that enables economies of scale. European ports often emphasize sustainability and may have longer turnaround times due to environmental regulations and labor agreements. North American ports face unique challenges including chassis availability, drayage capacity, and longer dwell times. When planning routes, consider that regional patterns are consistent—a port performing above regional average is likely reliable, while underperformers in efficient regions may have specific issues."
  },
  {
    question: "How can I use the Port Performance Index for supply chain risk management?",
    answer: "The Port Performance Index serves as a valuable risk management tool by identifying potential bottlenecks and enabling proactive contingency planning. Use the index to identify backup ports in each region where you operate, ensuring alternative routes during disruptions. Monitor efficiency trends to detect declining performance before it impacts your shipments. Cross-reference utilization rates with your cargo urgency to avoid congested ports during critical deliveries. Additionally, the index helps in contract negotiations by providing objective performance benchmarks. Regular review of port performance data enables early warning of emerging issues like labor disputes (often preceded by efficiency declines) or capacity constraints (indicated by rising utilization rates)."
  },
  {
    question: "What criteria weights should I use for different types of cargo or shipping scenarios?",
    answer: "Criteria weights should be customized based on your specific shipping requirements. For time-sensitive cargo like perishables or fashion goods, prioritize turnaround time (40%) and berth productivity (30%) to ensure rapid processing. For project cargo or heavy equipment, increase the weight on infrastructure capability and yard capacity utilization. For high-volume commodity shipments, throughput capacity and efficiency scores become more important. During peak seasons, emphasize utilization rates to avoid congestion. The calculator allows you to adjust weights based on scenarios—experiment with different combinations to see how port rankings change. Document your optimal weightings for different cargo types to standardize decision-making across your organization."
  }
];

// Educational Content Sections
const EDUCATIONAL_SECTIONS = [
  {
    title: "Understanding Port Performance",
    content: "Port performance measurement has evolved from simple throughput counting to comprehensive multi-dimensional assessment systems. Modern port performance indices evaluate operational efficiency, infrastructure utilization, and service quality to provide stakeholders with actionable insights. The complexity of port operations—encompassing vessel handling, cargo transfer, storage management, and landside connectivity—requires integrated metrics that capture both capacity and efficiency dimensions. Understanding these measurements is essential for logistics professionals who need to optimize routing decisions, manage supply chain risks, and negotiate service agreements. The shift toward data-driven port selection represents a fundamental change in maritime logistics, moving from relationship-based decisions to objective, performance-based criteria. This evolution benefits both shippers seeking reliable service and ports competing for cargo volume, creating a more transparent and efficient global trading system."
  },
  {
    title: "Key Performance Indicators",
    content: "Port KPIs fall into several categories measuring different aspects of operations. Throughput metrics (TEU volumes) indicate capacity and market position but don't reflect operational quality. Turnaround time measures service speed and directly impacts vessel schedule reliability. Productivity metrics (moves per hour) assess operational efficiency and equipment utilization. Utilization rates reveal capacity constraints and congestion risk. Efficiency scores combine multiple factors to provide overall operational assessment. Each KPI serves specific analytical purposes—turnaround time for time-sensitive decisions, productivity for operational planning, utilization for capacity management. Sophisticated analysis requires examining KPIs together rather than in isolation, as trade-offs exist between metrics. High throughput often correlates with congestion, while excellent turnaround may indicate underutilized capacity. Understanding these relationships enables more nuanced port selection strategies."
  },
  {
    title: "Port Selection Criteria",
    content: "Effective port selection requires balancing multiple criteria based on specific shipment requirements. Operational factors include turnaround time, productivity rates, reliability scores, and capacity availability. Cost considerations encompass terminal handling charges, pilotage fees, and potential demurrage exposure. Geographic factors include proximity to origin/destination, feeder connections, and inland transportation options. Strategic considerations involve carrier service levels, value-added services, and long-term relationship potential. The optimal selection varies by cargo type, urgency, volume, and route structure. High-value time-sensitive cargo prioritizes speed and reliability, accepting higher costs. Commodity shipments focus on cost efficiency and capacity reliability. Project cargo requires specialized equipment and handling expertise. Developing selection criteria frameworks for different scenarios standardizes decision-making and enables consistent performance evaluation across your port portfolio."
  },
  {
    title: "Industry Benchmarks",
    content: "Global port performance benchmarks provide context for evaluating specific ports. Top-tier container ports achieve turnaround times under 18 hours, berth productivity exceeding 45 moves per hour, and efficiency scores above 90. Regional variations exist—Asian ports average 18-hour turnaround while European ports average 24 hours, reflecting different operational models and labor practices. Industry benchmarks also vary by port size; smaller ports may achieve excellent productivity despite lower absolute volumes. Understanding percentile distributions helps calibrate expectations—ports in the 75th percentile for turnaround time perform better than three-quarters of global ports. Benchmark data enables meaningful comparisons across different contexts and helps identify both overperformers and underperformers. Regular benchmark review keeps your port evaluation criteria current with evolving industry standards and best practices."
  }
];

// Main Component
export function PortPerformanceIndex() {
  const [selectedPort, setSelectedPort] = useState<string>("CNSHA");
  const [comparePorts, setComparePorts] = useState<string[]>(["CNSHA", "SGSIN"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [criteriaWeights, setCriteriaWeights] = useState<CriteriaWeights>({
    throughput: 20,
    turnaround: 25,
    productivity: 20,
    efficiency: 25,
    utilization: 10,
  });
  const [activeTab, setActiveTab] = useState<string>("calculator");

  const selectedPortData = useMemo(() => {
    return PORTS.find((p) => p.code === selectedPort) || PORTS[0];
  }, [selectedPort]);

  const filteredPorts = useMemo(() => {
    return PORTS.filter((port) => {
      const matchesSearch =
        port.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        port.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        port.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === "All" || port.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  // Calculate weighted scores for ports
  const rankedPorts = useMemo(() => {
    const maxThroughput = Math.max(...PORTS.map(p => p.throughput));
    const minTurnaround = Math.min(...PORTS.map(p => p.vesselTurnaround));
    const maxProductivity = Math.max(...PORTS.map(p => p.berthProductivity));
    const maxEfficiency = Math.max(...PORTS.map(p => p.efficiencyScore));

    return PORTS.map(port => {
      const throughputScore = (port.throughput / maxThroughput) * 100;
      const turnaroundScore = (minTurnaround / port.vesselTurnaround) * 100;
      const productivityScore = (port.berthProductivity / maxProductivity) * 100;
      const efficiencyScore = (port.efficiencyScore / maxEfficiency) * 100;
      const utilizationScore = 100 - Math.abs(port.yardUtilization - 75);

      const weightedScore = 
        (throughputScore * criteriaWeights.throughput / 100) +
        (turnaroundScore * criteriaWeights.turnaround / 100) +
        (productivityScore * criteriaWeights.productivity / 100) +
        (efficiencyScore * criteriaWeights.efficiency / 100) +
        (utilizationScore * criteriaWeights.utilization / 100);

      return {
        ...port,
        weightedScore,
        throughputScore,
        turnaroundScore,
        productivityScore,
        efficiencyScore,
        utilizationScore
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore);
  }, [criteriaWeights]);

  const topPerformers = useMemo(() => {
    return {
      throughput: [...PORTS].sort((a, b) => b.throughput - a.throughput).slice(0, 5),
      efficiency: [...PORTS].sort((a, b) => b.efficiencyScore - a.efficiencyScore).slice(0, 5),
      turnaround: [...PORTS].sort((a, b) => a.vesselTurnaround - b.vesselTurnaround).slice(0, 5),
      productivity: [...PORTS].sort((a, b) => b.berthProductivity - a.berthProductivity).slice(0, 5),
    };
  }, []);

  const toggleComparePort = useCallback((code: string) => {
    setComparePorts((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }, []);

  const handleReset = useCallback(() => {
    setCriteriaWeights({
      throughput: 20,
      turnaround: 25,
      productivity: 20,
      efficiency: 25,
      utilization: 10,
    });
    setSelectedPort("CNSHA");
    setComparePorts(["CNSHA", "SGSIN"]);
    setSearchQuery("");
    setSelectedRegion("All");
  }, []);

  const handleExport = useCallback(() => {
    const data = {
      ports: rankedPorts.slice(0, 10),
      weights: criteriaWeights,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "port-performance-analysis.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [rankedPorts, criteriaWeights]);

  const handleShare = useCallback(() => {
    const shareData = {
      title: "Port Performance Index Analysis",
      text: "Check out this port performance analysis",
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }, []);

  // Radar chart data for selected port
  const radarData = useMemo(() => {
    if (!selectedPortData) return [];
    return [
      { metric: "Efficiency", value: selectedPortData.efficiencyScore, fullMark: 100 },
      { metric: "Turnaround", value: 100 - selectedPortData.vesselTurnaround, fullMark: 100 },
      { metric: "Productivity", value: selectedPortData.berthProductivity * 2, fullMark: 100 },
      { metric: "Utilization", value: 100 - Math.abs(selectedPortData.yardUtilization - 75), fullMark: 100 },
      { metric: "Growth", value: selectedPortData.throughputYoY >= 0 ? 50 + selectedPortData.throughputYoY * 5 : 50 - Math.abs(selectedPortData.throughputYoY) * 5, fullMark: 100 },
    ];
  }, [selectedPortData]);

  // Comparison data
  const comparisonData = useMemo(() => {
    return comparePorts.map(code => PORTS.find(p => p.code === code)).filter(Boolean);
  }, [comparePorts]);

  // Region throughput data for charts
  const regionData = useMemo(() => {
    return Array.from(new Set(PORTS.map(p => p.region))).map(region => ({
      region,
      throughput: PORTS.filter(p => p.region === region).reduce((sum, p) => sum + p.throughput, 0) / 1000000,
      ports: PORTS.filter(p => p.region === region).length,
      avgEfficiency: PORTS.filter(p => p.region === region).reduce((sum, p) => sum + p.efficiencyScore, 0) / PORTS.filter(p => p.region === region).length,
    }));
  }, []);

  const throughputData = selectedPortData ? (THROUGHPUT_TRENDS[selectedPortData.code] || THROUGHPUT_TRENDS.CNSHA) : THROUGHPUT_TRENDS.CNSHA;
  const efficiencyData = selectedPortData ? (EFFICIENCY_TRENDS[selectedPortData.code] || EFFICIENCY_TRENDS.CNSHA) : EFFICIENCY_TRENDS.CNSHA;

  return (
    <div className="space-y-6">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border border-border/50">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-[var(--ocean)] text-white animate-pulse">
                <Sparkles className="h-3 w-3 mr-1" />
                Port Analytics
              </Badge>
              <Badge className="bg-[var(--logistics)] text-white">
                <Gauge className="h-3 w-3 mr-1" />
                Performance Index
              </Badge>
              <Badge variant="outline" className="border-[var(--ocean)]/30 text-[var(--ocean)]">
                <Ship className="h-3 w-3 mr-1" />
                Maritime Intelligence
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="h-8 w-8" style={{ color: COLORS.ocean }} />
              Port Performance Index
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Analyze and compare global container port performance metrics including throughput efficiency,
              vessel turnaround times, berth productivity, and operational effectiveness across major world ports.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Ship className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.ocean }} />
              <p className="text-2xl font-bold">{PORTS.length}</p>
              <p className="text-xs text-muted-foreground">Ports Tracked</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Container className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.logistics }} />
              <p className="text-2xl font-bold">
                {(PORTS.reduce((sum, p) => sum + p.throughput, 0) / 1000000000).toFixed(1)}B
              </p>
              <p className="text-xs text-muted-foreground">Total TEU</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Globe className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.ocean }} />
              <p className="text-2xl font-bold">
                {new Set(PORTS.map(p => p.region)).size}
              </p>
              <p className="text-xs text-muted-foreground">Regions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 mx-auto mb-2" style={{ color: COLORS.logistics }} />
              <p className="text-2xl font-bold">
                {(PORTS.reduce((sum, p) => sum + p.efficiencyScore, 0) / PORTS.length).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Avg Score</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Tabs - 5 Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="flex items-center gap-1 py-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1 py-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1 py-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1 py-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1 py-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Port Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Anchor className="h-5 w-5 text-[var(--ocean)]" />
                  Port Selection
                </CardTitle>
                <CardDescription>Select ports and configure filters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPort} onValueChange={setSelectedPort}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Port" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPorts.map((port) => (
                      <SelectItem key={port.code} value={port.code}>
                        #{port.rank} - {port.name}, {port.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Criteria Weights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--logistics)]" />
                  Criteria Weights
                </CardTitle>
                <CardDescription>Adjust importance of each factor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Throughput Volume</Label>
                    <span className="text-sm font-medium">{criteriaWeights.throughput}%</span>
                  </div>
                  <Slider
                    value={[criteriaWeights.throughput]}
                    onValueChange={([value]) => setCriteriaWeights(prev => ({ ...prev, throughput: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Turnaround Time</Label>
                    <span className="text-sm font-medium">{criteriaWeights.turnaround}%</span>
                  </div>
                  <Slider
                    value={[criteriaWeights.turnaround]}
                    onValueChange={([value]) => setCriteriaWeights(prev => ({ ...prev, turnaround: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Berth Productivity</Label>
                    <span className="text-sm font-medium">{criteriaWeights.productivity}%</span>
                  </div>
                  <Slider
                    value={[criteriaWeights.productivity]}
                    onValueChange={([value]) => setCriteriaWeights(prev => ({ ...prev, productivity: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Efficiency Score</Label>
                    <span className="text-sm font-medium">{criteriaWeights.efficiency}%</span>
                  </div>
                  <Slider
                    value={[criteriaWeights.efficiency]}
                    onValueChange={([value]) => setCriteriaWeights(prev => ({ ...prev, efficiency: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-sm">Yard Utilization</Label>
                    <span className="text-sm font-medium">{criteriaWeights.utilization}%</span>
                  </div>
                  <Slider
                    value={[criteriaWeights.utilization]}
                    onValueChange={([value]) => setCriteriaWeights(prev => ({ ...prev, utilization: value }))}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Selected Port Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-[var(--ocean)]" />
                  Selected Port
                </CardTitle>
                <CardDescription>Performance details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPortData && (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: getStatusColor(selectedPortData.status) }}
                      >
                        #{selectedPortData.rank}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{selectedPortData.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedPortData.country} • {selectedPortData.region}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Throughput</p>
                        <p className="font-bold">{(selectedPortData.throughput / 1000000).toFixed(1)}M TEU</p>
                        <p className={`text-xs ${selectedPortData.throughputYoY >= 0 ? "text-[var(--logistics)]" : "text-red-500"}`}>
                          {selectedPortData.throughputYoY >= 0 ? "+" : ""}{selectedPortData.throughputYoY}% YoY
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Turnaround</p>
                        <p className="font-bold">{selectedPortData.vesselTurnaround}h</p>
                        <p className={`text-xs ${selectedPortData.vesselTurnaroundYoY <= 0 ? "text-[var(--logistics)]" : "text-red-500"}`}>
                          {selectedPortData.vesselTurnaroundYoY >= 0 ? "+" : ""}{selectedPortData.vesselTurnaroundYoY}% YoY
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Productivity</p>
                        <p className="font-bold">{selectedPortData.berthProductivity} moves/h</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground">Efficiency</p>
                        <p className="font-bold" style={{ color: getStatusColor(selectedPortData.status) }}>
                          {selectedPortData.efficiencyScore.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <Progress value={selectedPortData.overallScore} className="h-2" />
                    <div className="flex justify-between">
                      <Badge style={{ backgroundColor: getStatusColor(selectedPortData.status) }} className="text-white">
                        {selectedPortData.status.charAt(0).toUpperCase() + selectedPortData.status.slice(1)}
                      </Badge>
                      {getTrendIcon(selectedPortData.trend)}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Radar Chart */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--logistics)]" />
                  Performance Radar
                </CardTitle>
                <CardDescription>Multi-dimensional performance assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid strokeDasharray="3 3" className="stroke-border" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                      <Radar
                        name={selectedPortData?.name || "Port"}
                        dataKey="value"
                        stroke={COLORS.logistics}
                        fill={COLORS.logistics}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-[var(--ocean)]" />
                  Custom Weighted Rankings
                </CardTitle>
                <CardDescription>Ports ranked by your criteria weights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={rankedPorts.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="weightedScore" name="Score" fill={COLORS.ocean}>
                        {rankedPorts.slice(0, 10).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.logistics : COLORS.ocean} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Port Cards Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-[var(--ocean)]" />
                All Ports
              </CardTitle>
              <CardDescription>Click to select or star to compare</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pr-4">
                  {filteredPorts.map((port) => (
                    <Card
                      key={port.code}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedPort === port.code ? "ring-2 ring-[var(--ocean)] ring-offset-2" : ""
                      }`}
                      onClick={() => setSelectedPort(port.code)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: getStatusColor(port.status) }}
                            >
                              #{port.rank}
                            </div>
                            <div>
                              <h3 className="font-semibold">{port.name}</h3>
                              <p className="text-xs text-muted-foreground">{port.country}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComparePort(port.code);
                              }}
                            >
                              {comparePorts.includes(port.code) ? (
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                            {getTrendIcon(port.trend)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className="text-white text-xs" style={{ backgroundColor: getStatusColor(port.status) }}>
                            {port.status.charAt(0).toUpperCase() + port.status.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{(port.throughput / 1000000).toFixed(1)}M TEU</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Performance Trend Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                  Throughput Trends
                </CardTitle>
                <CardDescription>12-month container volume trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={throughputData}>
                      <defs>
                        <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.ocean} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={COLORS.ocean} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="throughput"
                        name="Throughput"
                        stroke={COLORS.ocean}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#throughputGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[var(--logistics)]" />
                  Efficiency Metrics
                </CardTitle>
                <CardDescription>Operational efficiency over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line type="monotone" dataKey="efficiency" name="Efficiency" stroke={COLORS.ocean} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="turnaround" name="Turnaround (h)" stroke={COLORS.logistics} strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="productivity" name="Productivity" stroke={COLORS.warning} strokeWidth={2} dot={false} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Container className="h-4 w-4 text-[var(--ocean)]" />
                  Top Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPerformers.throughput.slice(0, 5).map((port, idx) => (
                    <div key={port.code} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: idx === 0 ? COLORS.ocean : COLORS.neutral }}>
                          {idx + 1}
                        </span>
                        <span className="truncate">{port.name}</span>
                      </div>
                      <span className="font-medium">{(port.throughput / 1000000).toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-[var(--logistics)]" />
                  Top Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPerformers.efficiency.slice(0, 5).map((port, idx) => (
                    <div key={port.code} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: idx === 0 ? COLORS.logistics : COLORS.neutral }}>
                          {idx + 1}
                        </span>
                        <span className="truncate">{port.name}</span>
                      </div>
                      <span className="font-medium">{port.efficiencyScore.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--ocean)]" />
                  Fastest Turnaround
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPerformers.turnaround.slice(0, 5).map((port, idx) => (
                    <div key={port.code} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: idx === 0 ? COLORS.ocean : COLORS.neutral }}>
                          {idx + 1}
                        </span>
                        <span className="truncate">{port.name}</span>
                      </div>
                      <span className="font-medium">{port.vesselTurnaround}h</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[var(--logistics)]" />
                  Top Productivity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topPerformers.productivity.slice(0, 5).map((port, idx) => (
                    <div key={port.code} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-white text-xs" style={{ backgroundColor: idx === 0 ? COLORS.logistics : COLORS.neutral }}>
                          {idx + 1}
                        </span>
                        <span className="truncate">{port.name}</span>
                      </div>
                      <span className="font-medium">{port.berthProductivity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Regional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--ocean)]" />
                Regional Performance Distribution
              </CardTitle>
              <CardDescription>Throughput and efficiency by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={regionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                    <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} className="fill-muted-foreground" width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="throughput" name="Throughput (M TEU)" fill={COLORS.ocean} />
                    <Bar dataKey="avgEfficiency" name="Avg Efficiency" fill={COLORS.logistics} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Efficiency Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[var(--logistics)]" />
                Efficiency Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {["excellent", "good", "average", "below", "poor"].map((status) => {
                  const count = PORTS.filter((p) => p.status === status).length;
                  return (
                    <div key={status} className="text-center">
                      <div
                        className="w-full h-24 rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-2"
                        style={{ backgroundColor: getStatusColor(status) }}
                      >
                        {count}
                      </div>
                      <p className="text-sm font-medium capitalize">{status}</p>
                      <p className="text-xs text-muted-foreground">
                        {((count / PORTS.length) * 100).toFixed(0)}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          {comparePorts.length < 2 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Select Ports to Compare</h3>
                <p className="text-muted-foreground mb-4">
                  Click the star icon on port cards to add them to comparison (minimum 2 required)
                </p>
                <Badge variant="outline">{comparePorts.length} port(s) selected</Badge>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Comparison Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {comparisonData.map((port) => port && (
                  <Card key={port.code} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: getStatusColor(port.status) }} />
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: getStatusColor(port.status) }}>
                            #{port.rank}
                          </span>
                          <div>
                            <CardTitle className="text-lg">{port.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{port.country}</p>
                          </div>
                        </div>
                        {getTrendIcon(port.trend)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Throughput</span>
                          <span className="font-semibold">{(port.throughput / 1000000).toFixed(1)}M TEU</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Turnaround</span>
                          <span className="font-semibold">{port.vesselTurnaround}h</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Productivity</span>
                          <span className="font-semibold">{port.berthProductivity} moves/h</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Efficiency</span>
                          <span className="font-semibold" style={{ color: getStatusColor(port.status) }}>{port.efficiencyScore.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Overall</span>
                          <span className="font-bold" style={{ color: getStatusColor(port.status) }}>{port.overallScore.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Comparison Charts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                    Performance Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={comparisonData.filter(Boolean).map(port => ({
                        name: port?.name,
                        throughput: port ? port.throughput / 1000000 : 0,
                        turnaround: port?.vesselTurnaround || 0,
                        productivity: port?.berthProductivity || 0,
                        efficiency: port?.efficiencyScore || 0,
                      }))} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} className="fill-muted-foreground" width={80} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="throughput" name="Throughput (M TEU)" fill={COLORS.ocean} />
                        <Bar dataKey="turnaround" name="Turnaround (h)" fill={COLORS.warning} />
                        <Bar dataKey="productivity" name="Productivity" fill={COLORS.logistics} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Educational Content */}
          <div className="grid gap-6">
            {EDUCATIONAL_SECTIONS.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--logistics)]" />
                Pro Tips & Best Practices
              </CardTitle>
              <CardDescription>Actionable insights for port selection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <div key={index} className="flex gap-3 p-4 bg-muted/50 rounded-lg">
                    <tip.icon className="h-5 w-5 text-[var(--logistics)] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Pitfalls that can impact your supply chain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <div key={index} className="flex gap-3 p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                    <mistake.icon className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">{mistake.title}</h4>
                      <p className="text-sm text-muted-foreground">{mistake.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Comprehensive answers to common questions about port performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Activity className="h-4 w-4 text-[var(--logistics)]" />
            Real-time port data
          </span>
          <span className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            For informational purposes
          </span>
        </div>
        <span>&copy; 2024 Shiportrade.com - Port Intelligence</span>
      </div>
    </div>
  );
}

export default PortPerformanceIndex;
