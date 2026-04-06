"use client";

import { useState, useMemo, useCallback } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Ship,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
  FileCheck,
  FileX,
  Award,
  Target,
  Timer,
  Building2,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Info,
  Download,
  Share2,
  RefreshCw,
  Shield,
  Gauge,
  Percent,
  Activity,
  Sparkles,
  ChevronRight,
  Zap,
  Users,
  BarChart2,
  PieChart,
  LineChart,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Lightbulb,
  AlertCircle,
  Copy,
  Check,
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
  PieChart as RechartsPieChart,
  Pie,
} from "recharts";

// Brand Colors
const BRAND_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  oceanLight: "rgba(15, 76, 129, 0.1)",
  logisticsLight: "rgba(46, 139, 87, 0.1)",
  warning: "#F59E0B",
  danger: "#EF4444",
};

// Major Ocean Carriers with performance data
const CARRIERS = {
  MAERSK: {
    name: "Maersk Line",
    code: "MSK",
    logo: "MAERSK",
    fleet: 708,
    teu: 4150000,
    region: "Global",
    established: 1904,
  },
  MSC: {
    name: "MSC",
    code: "MSC",
    logo: "MSC",
    fleet: 760,
    teu: 4800000,
    region: "Global",
    established: 1970,
  },
  CMA_CGM: {
    name: "CMA CGM",
    code: "CMDU",
    logo: "CMA CGM",
    fleet: 566,
    teu: 3400000,
    region: "Global",
    established: 1978,
  },
  COSCO: {
    name: "COSCO Shipping",
    code: "COS",
    logo: "COSCO",
    fleet: 507,
    teu: 2900000,
    region: "Global",
    established: 1961,
  },
  HAPAG: {
    name: "Hapag-Lloyd",
    code: "HLCU",
    logo: "HAPAG",
    fleet: 260,
    teu: 2100000,
    region: "Global",
    established: 1847,
  },
  EVERGREEN: {
    name: "Evergreen",
    code: "EGSU",
    logo: "EVERGREEN",
    fleet: 210,
    teu: 1650000,
    region: "Asia-Pacific",
    established: 1968,
  },
  ONE: {
    name: "ONE",
    code: "ONEY",
    logo: "ONE",
    fleet: 230,
    teu: 1600000,
    region: "Global",
    established: 2017,
  },
  YANG_MING: {
    name: "Yang Ming",
    code: "YMLU",
    logo: "YANG MING",
    fleet: 95,
    teu: 720000,
    region: "Asia-Pacific",
    established: 1972,
  },
  HMM: {
    name: "HMM",
    code: "HMM",
    logo: "HMM",
    fleet: 78,
    teu: 820000,
    region: "Asia-Pacific",
    established: 1976,
  },
  ZIM: {
    name: "ZIM",
    code: "ZIM",
    logo: "ZIM",
    fleet: 150,
    teu: 580000,
    region: "Global",
    established: 1945,
  },
} as const;

// Performance metrics for each carrier
const CARRIER_PERFORMANCE: Record<keyof typeof CARRIERS, {
  scheduleReliability: number;
  vesselOnTime: number;
  bookingAcceptance: number;
  documentationAccuracy: number;
  claimRatio: number;
  overallScore: number;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}> = {
  MAERSK: {
    scheduleReliability: 78.5,
    vesselOnTime: 82.3,
    bookingAcceptance: 91.2,
    documentationAccuracy: 96.8,
    claimRatio: 1.2,
    overallScore: 87.6,
    trend: "up",
    lastUpdated: "2024-01-15",
  },
  MSC: {
    scheduleReliability: 72.1,
    vesselOnTime: 76.8,
    bookingAcceptance: 88.5,
    documentationAccuracy: 94.2,
    claimRatio: 1.8,
    overallScore: 82.1,
    trend: "stable",
    lastUpdated: "2024-01-15",
  },
  CMA_CGM: {
    scheduleReliability: 75.8,
    vesselOnTime: 79.2,
    bookingAcceptance: 89.3,
    documentationAccuracy: 95.1,
    claimRatio: 1.5,
    overallScore: 84.3,
    trend: "up",
    lastUpdated: "2024-01-15",
  },
  COSCO: {
    scheduleReliability: 74.2,
    vesselOnTime: 77.5,
    bookingAcceptance: 87.8,
    documentationAccuracy: 93.5,
    claimRatio: 1.6,
    overallScore: 81.9,
    trend: "up",
    lastUpdated: "2024-01-15",
  },
  HAPAG: {
    scheduleReliability: 81.2,
    vesselOnTime: 84.6,
    bookingAcceptance: 92.1,
    documentationAccuracy: 97.2,
    claimRatio: 0.9,
    overallScore: 89.4,
    trend: "up",
    lastUpdated: "2024-01-15",
  },
  EVERGREEN: {
    scheduleReliability: 76.5,
    vesselOnTime: 80.1,
    bookingAcceptance: 90.5,
    documentationAccuracy: 95.8,
    claimRatio: 1.3,
    overallScore: 85.8,
    trend: "stable",
    lastUpdated: "2024-01-15",
  },
  ONE: {
    scheduleReliability: 79.8,
    vesselOnTime: 83.2,
    bookingAcceptance: 91.8,
    documentationAccuracy: 96.5,
    claimRatio: 1.1,
    overallScore: 88.2,
    trend: "up",
    lastUpdated: "2024-01-15",
  },
  YANG_MING: {
    scheduleReliability: 71.3,
    vesselOnTime: 74.8,
    bookingAcceptance: 86.2,
    documentationAccuracy: 92.8,
    claimRatio: 2.1,
    overallScore: 79.2,
    trend: "down",
    lastUpdated: "2024-01-15",
  },
  HMM: {
    scheduleReliability: 77.9,
    vesselOnTime: 81.5,
    bookingAcceptance: 89.7,
    documentationAccuracy: 95.3,
    claimRatio: 1.4,
    overallScore: 86.1,
    trend: "up",
    lastUpdated: "2024-01-15",
  },
  ZIM: {
    scheduleReliability: 69.5,
    vesselOnTime: 73.2,
    bookingAcceptance: 85.8,
    documentationAccuracy: 91.5,
    claimRatio: 2.4,
    overallScore: 77.8,
    trend: "down",
    lastUpdated: "2024-01-15",
  },
};

// Historical performance data (12 months)
const HISTORICAL_PERFORMANCE: Record<keyof typeof CARRIERS, Array<{
  month: string;
  scheduleReliability: number;
  vesselOnTime: number;
  overallScore: number;
}>> = {
  MAERSK: [
    { month: "Jan", scheduleReliability: 75.2, vesselOnTime: 79.1, overallScore: 85.2 },
    { month: "Feb", scheduleReliability: 76.5, vesselOnTime: 80.3, overallScore: 86.1 },
    { month: "Mar", scheduleReliability: 77.1, vesselOnTime: 81.2, overallScore: 86.8 },
    { month: "Apr", scheduleReliability: 76.8, vesselOnTime: 80.8, overallScore: 86.5 },
    { month: "May", scheduleReliability: 77.5, vesselOnTime: 81.5, overallScore: 87.0 },
    { month: "Jun", scheduleReliability: 78.2, vesselOnTime: 82.1, overallScore: 87.4 },
    { month: "Jul", scheduleReliability: 77.8, vesselOnTime: 81.8, overallScore: 87.1 },
    { month: "Aug", scheduleReliability: 78.5, vesselOnTime: 82.5, overallScore: 87.8 },
    { month: "Sep", scheduleReliability: 78.1, vesselOnTime: 82.2, overallScore: 87.5 },
    { month: "Oct", scheduleReliability: 78.8, vesselOnTime: 82.8, overallScore: 88.0 },
    { month: "Nov", scheduleReliability: 78.2, vesselOnTime: 82.4, overallScore: 87.6 },
    { month: "Dec", scheduleReliability: 78.5, vesselOnTime: 82.3, overallScore: 87.6 },
  ],
  MSC: [
    { month: "Jan", scheduleReliability: 70.8, vesselOnTime: 75.2, overallScore: 80.5 },
    { month: "Feb", scheduleReliability: 71.2, vesselOnTime: 75.8, overallScore: 81.0 },
    { month: "Mar", scheduleReliability: 71.5, vesselOnTime: 76.1, overallScore: 81.3 },
    { month: "Apr", scheduleReliability: 71.8, vesselOnTime: 76.5, overallScore: 81.6 },
    { month: "May", scheduleReliability: 72.1, vesselOnTime: 76.8, overallScore: 81.9 },
    { month: "Jun", scheduleReliability: 72.5, vesselOnTime: 77.2, overallScore: 82.3 },
    { month: "Jul", scheduleReliability: 72.2, vesselOnTime: 76.9, overallScore: 82.0 },
    { month: "Aug", scheduleReliability: 72.8, vesselOnTime: 77.5, overallScore: 82.6 },
    { month: "Sep", scheduleReliability: 72.4, vesselOnTime: 77.1, overallScore: 82.2 },
    { month: "Oct", scheduleReliability: 72.6, vesselOnTime: 77.3, overallScore: 82.4 },
    { month: "Nov", scheduleReliability: 72.3, vesselOnTime: 77.0, overallScore: 82.1 },
    { month: "Dec", scheduleReliability: 72.1, vesselOnTime: 76.8, overallScore: 82.1 },
  ],
  CMA_CGM: [
    { month: "Jan", scheduleReliability: 73.5, vesselOnTime: 77.2, overallScore: 82.5 },
    { month: "Feb", scheduleReliability: 74.1, vesselOnTime: 77.8, overallScore: 83.1 },
    { month: "Mar", scheduleReliability: 74.8, vesselOnTime: 78.5, overallScore: 83.8 },
    { month: "Apr", scheduleReliability: 75.2, vesselOnTime: 79.0, overallScore: 84.2 },
    { month: "May", scheduleReliability: 75.5, vesselOnTime: 79.2, overallScore: 84.5 },
    { month: "Jun", scheduleReliability: 75.8, vesselOnTime: 79.5, overallScore: 84.8 },
    { month: "Jul", scheduleReliability: 75.4, vesselOnTime: 79.1, overallScore: 84.4 },
    { month: "Aug", scheduleReliability: 76.1, vesselOnTime: 79.8, overallScore: 85.1 },
    { month: "Sep", scheduleReliability: 75.6, vesselOnTime: 79.3, overallScore: 84.6 },
    { month: "Oct", scheduleReliability: 76.0, vesselOnTime: 79.7, overallScore: 85.0 },
    { month: "Nov", scheduleReliability: 75.8, vesselOnTime: 79.5, overallScore: 84.8 },
    { month: "Dec", scheduleReliability: 75.8, vesselOnTime: 79.2, overallScore: 84.3 },
  ],
  COSCO: [
    { month: "Jan", scheduleReliability: 72.5, vesselOnTime: 76.1, overallScore: 80.2 },
    { month: "Feb", scheduleReliability: 73.1, vesselOnTime: 76.8, overallScore: 80.8 },
    { month: "Mar", scheduleReliability: 73.5, vesselOnTime: 77.2, overallScore: 81.2 },
    { month: "Apr", scheduleReliability: 73.8, vesselOnTime: 77.5, overallScore: 81.5 },
    { month: "May", scheduleReliability: 74.0, vesselOnTime: 77.7, overallScore: 81.7 },
    { month: "Jun", scheduleReliability: 74.2, vesselOnTime: 77.9, overallScore: 81.9 },
    { month: "Jul", scheduleReliability: 73.9, vesselOnTime: 77.6, overallScore: 81.6 },
    { month: "Aug", scheduleReliability: 74.5, vesselOnTime: 78.2, overallScore: 82.2 },
    { month: "Sep", scheduleReliability: 74.1, vesselOnTime: 77.8, overallScore: 81.8 },
    { month: "Oct", scheduleReliability: 74.3, vesselOnTime: 78.0, overallScore: 82.0 },
    { month: "Nov", scheduleReliability: 74.0, vesselOnTime: 77.7, overallScore: 81.7 },
    { month: "Dec", scheduleReliability: 74.2, vesselOnTime: 77.5, overallScore: 81.9 },
  ],
  HAPAG: [
    { month: "Jan", scheduleReliability: 79.5, vesselOnTime: 83.1, overallScore: 88.0 },
    { month: "Feb", scheduleReliability: 80.1, vesselOnTime: 83.8, overallScore: 88.6 },
    { month: "Mar", scheduleReliability: 80.5, vesselOnTime: 84.2, overallScore: 89.0 },
    { month: "Apr", scheduleReliability: 80.8, vesselOnTime: 84.5, overallScore: 89.3 },
    { month: "May", scheduleReliability: 81.0, vesselOnTime: 84.7, overallScore: 89.5 },
    { month: "Jun", scheduleReliability: 81.2, vesselOnTime: 84.9, overallScore: 89.7 },
    { month: "Jul", scheduleReliability: 80.9, vesselOnTime: 84.6, overallScore: 89.4 },
    { month: "Aug", scheduleReliability: 81.5, vesselOnTime: 85.2, overallScore: 90.0 },
    { month: "Sep", scheduleReliability: 81.0, vesselOnTime: 84.7, overallScore: 89.5 },
    { month: "Oct", scheduleReliability: 81.3, vesselOnTime: 85.0, overallScore: 89.8 },
    { month: "Nov", scheduleReliability: 81.1, vesselOnTime: 84.8, overallScore: 89.6 },
    { month: "Dec", scheduleReliability: 81.2, vesselOnTime: 84.6, overallScore: 89.4 },
  ],
  EVERGREEN: [
    { month: "Jan", scheduleReliability: 75.1, vesselOnTime: 78.8, overallScore: 84.5 },
    { month: "Feb", scheduleReliability: 75.5, vesselOnTime: 79.2, overallScore: 84.9 },
    { month: "Mar", scheduleReliability: 75.8, vesselOnTime: 79.6, overallScore: 85.2 },
    { month: "Apr", scheduleReliability: 76.0, vesselOnTime: 79.8, overallScore: 85.4 },
    { month: "May", scheduleReliability: 76.2, vesselOnTime: 80.0, overallScore: 85.6 },
    { month: "Jun", scheduleReliability: 76.5, vesselOnTime: 80.3, overallScore: 85.9 },
    { month: "Jul", scheduleReliability: 76.1, vesselOnTime: 79.9, overallScore: 85.5 },
    { month: "Aug", scheduleReliability: 76.8, vesselOnTime: 80.6, overallScore: 86.2 },
    { month: "Sep", scheduleReliability: 76.4, vesselOnTime: 80.2, overallScore: 85.8 },
    { month: "Oct", scheduleReliability: 76.6, vesselOnTime: 80.4, overallScore: 86.0 },
    { month: "Nov", scheduleReliability: 76.3, vesselOnTime: 80.1, overallScore: 85.7 },
    { month: "Dec", scheduleReliability: 76.5, vesselOnTime: 80.1, overallScore: 85.8 },
  ],
  ONE: [
    { month: "Jan", scheduleReliability: 78.1, vesselOnTime: 81.8, overallScore: 86.8 },
    { month: "Feb", scheduleReliability: 78.5, vesselOnTime: 82.2, overallScore: 87.2 },
    { month: "Mar", scheduleReliability: 78.9, vesselOnTime: 82.6, overallScore: 87.6 },
    { month: "Apr", scheduleReliability: 79.2, vesselOnTime: 82.9, overallScore: 87.9 },
    { month: "May", scheduleReliability: 79.5, vesselOnTime: 83.2, overallScore: 88.2 },
    { month: "Jun", scheduleReliability: 79.8, vesselOnTime: 83.5, overallScore: 88.5 },
    { month: "Jul", scheduleReliability: 79.4, vesselOnTime: 83.1, overallScore: 88.1 },
    { month: "Aug", scheduleReliability: 80.1, vesselOnTime: 83.8, overallScore: 88.8 },
    { month: "Sep", scheduleReliability: 79.6, vesselOnTime: 83.3, overallScore: 88.3 },
    { month: "Oct", scheduleReliability: 79.9, vesselOnTime: 83.6, overallScore: 88.6 },
    { month: "Nov", scheduleReliability: 79.7, vesselOnTime: 83.4, overallScore: 88.4 },
    { month: "Dec", scheduleReliability: 79.8, vesselOnTime: 83.2, overallScore: 88.2 },
  ],
  YANG_MING: [
    { month: "Jan", scheduleReliability: 70.2, vesselOnTime: 73.8, overallScore: 78.5 },
    { month: "Feb", scheduleReliability: 70.5, vesselOnTime: 74.1, overallScore: 78.8 },
    { month: "Mar", scheduleReliability: 70.8, vesselOnTime: 74.5, overallScore: 79.2 },
    { month: "Apr", scheduleReliability: 71.1, vesselOnTime: 74.8, overallScore: 79.5 },
    { month: "May", scheduleReliability: 71.5, vesselOnTime: 75.2, overallScore: 79.9 },
    { month: "Jun", scheduleReliability: 71.8, vesselOnTime: 75.6, overallScore: 80.2 },
    { month: "Jul", scheduleReliability: 71.2, vesselOnTime: 75.0, overallScore: 79.6 },
    { month: "Aug", scheduleReliability: 72.0, vesselOnTime: 75.8, overallScore: 80.4 },
    { month: "Sep", scheduleReliability: 71.5, vesselOnTime: 75.3, overallScore: 79.9 },
    { month: "Oct", scheduleReliability: 71.8, vesselOnTime: 75.6, overallScore: 80.2 },
    { month: "Nov", scheduleReliability: 71.2, vesselOnTime: 75.0, overallScore: 79.6 },
    { month: "Dec", scheduleReliability: 71.3, vesselOnTime: 74.8, overallScore: 79.2 },
  ],
  HMM: [
    { month: "Jan", scheduleReliability: 76.1, vesselOnTime: 79.8, overallScore: 84.8 },
    { month: "Feb", scheduleReliability: 76.5, vesselOnTime: 80.2, overallScore: 85.2 },
    { month: "Mar", scheduleReliability: 76.9, vesselOnTime: 80.6, overallScore: 85.6 },
    { month: "Apr", scheduleReliability: 77.2, vesselOnTime: 80.9, overallScore: 85.9 },
    { month: "May", scheduleReliability: 77.5, vesselOnTime: 81.2, overallScore: 86.2 },
    { month: "Jun", scheduleReliability: 77.8, vesselOnTime: 81.5, overallScore: 86.5 },
    { month: "Jul", scheduleReliability: 77.4, vesselOnTime: 81.1, overallScore: 86.1 },
    { month: "Aug", scheduleReliability: 78.1, vesselOnTime: 81.8, overallScore: 86.8 },
    { month: "Sep", scheduleReliability: 77.6, vesselOnTime: 81.3, overallScore: 86.3 },
    { month: "Oct", scheduleReliability: 77.9, vesselOnTime: 81.6, overallScore: 86.6 },
    { month: "Nov", scheduleReliability: 77.6, vesselOnTime: 81.3, overallScore: 86.3 },
    { month: "Dec", scheduleReliability: 77.9, vesselOnTime: 81.5, overallScore: 86.1 },
  ],
  ZIM: [
    { month: "Jan", scheduleReliability: 68.2, vesselOnTime: 71.8, overallScore: 76.5 },
    { month: "Feb", scheduleReliability: 68.5, vesselOnTime: 72.1, overallScore: 76.8 },
    { month: "Mar", scheduleReliability: 68.9, vesselOnTime: 72.5, overallScore: 77.2 },
    { month: "Apr", scheduleReliability: 69.2, vesselOnTime: 72.8, overallScore: 77.5 },
    { month: "May", scheduleReliability: 69.5, vesselOnTime: 73.2, overallScore: 77.9 },
    { month: "Jun", scheduleReliability: 69.8, vesselOnTime: 73.5, overallScore: 78.2 },
    { month: "Jul", scheduleReliability: 69.2, vesselOnTime: 72.9, overallScore: 77.6 },
    { month: "Aug", scheduleReliability: 70.0, vesselOnTime: 73.8, overallScore: 78.4 },
    { month: "Sep", scheduleReliability: 69.5, vesselOnTime: 73.2, overallScore: 77.9 },
    { month: "Oct", scheduleReliability: 69.8, vesselOnTime: 73.5, overallScore: 78.2 },
    { month: "Nov", scheduleReliability: 69.3, vesselOnTime: 73.0, overallScore: 77.7 },
    { month: "Dec", scheduleReliability: 69.5, vesselOnTime: 73.2, overallScore: 77.8 },
  ],
};

// Trade lanes for filtering
const TRADE_LANES = [
  { id: "all", name: "All Trade Lanes" },
  { id: "asia-europe", name: "Asia - Europe" },
  { id: "asia-uswc", name: "Asia - US West Coast" },
  { id: "asia-usec", name: "Asia - US East Coast" },
  { id: "trans-atlantic", name: "Trans-Atlantic" },
  { id: "intra-asia", name: "Intra-Asia" },
] as const;

// Pro Tips Data
const PRO_TIPS = [
  {
    icon: TrendingUp,
    title: "Monitor Trends Over Time",
    description: "Don't rely on single data points. Track carrier performance trends over 3-6 months to identify consistent patterns and avoid making decisions based on temporary fluctuations.",
  },
  {
    icon: Target,
    title: "Match Carrier to Route Needs",
    description: "Different carriers excel on different trade lanes. A carrier with excellent Trans-Pacific performance may struggle on Asia-Europe routes. Always analyze performance by specific trade lane.",
  },
  {
    icon: Shield,
    title: "Diversify Your Carrier Portfolio",
    description: "Avoid over-reliance on a single carrier. Maintain relationships with 2-3 carriers per trade lane to mitigate risks from service disruptions, labor disputes, or capacity constraints.",
  },
  {
    icon: FileCheck,
    title: "Review Documentation Metrics",
    description: "Poor documentation accuracy leads to customs delays and demurrage charges. Prioritize carriers with documentation accuracy above 95% for time-sensitive or regulated cargo.",
  },
  {
    icon: Zap,
    title: "Consider Booking Acceptance Rates",
    description: "High booking rejection rates during peak seasons can disrupt your supply chain. Build relationships with carriers that maintain above 90% booking acceptance even during capacity crunches.",
  },
  {
    icon: Globe,
    title: "Factor in Regional Strengths",
    description: "Carriers often have regional operational advantages. Asian carriers typically perform better on intra-Asia routes, while European carriers may have advantages in Europe-focused trade lanes.",
  },
];

// Common Mistakes Data
const COMMON_MISTAKES = [
  {
    title: "Focusing Only on Price",
    description: "Selecting carriers based solely on freight rates often leads to higher total costs. Schedule unreliability causes inventory stockouts, production delays, and expedited shipping costs that far exceed rate differences. Always factor in reliability scores when comparing carriers.",
  },
  {
    title: "Ignoring Claim Ratios",
    description: "A carrier with a low overall score but acceptable major metrics may have hidden issues. High claim ratios indicate poor cargo handling practices that can result in damage, losses, and insurance complications. Review claim ratios alongside performance scores.",
  },
  {
    title: "Overlooking Trend Indicators",
    description: "A carrier with stable performance is often more reliable than one with fluctuating scores, even if the average is similar. Declining trends can signal operational problems, fleet issues, or management challenges that may worsen over time.",
  },
  {
    title: "Not Considering Trade Lane Specifics",
    description: "Industry-wide performance data may not reflect actual performance on your specific routes. Port congestion, terminal efficiency, and vessel deployment strategies vary by trade lane. Always request lane-specific performance data.",
  },
  {
    title: "Neglecting Relationship Building",
    description: "Treating carrier selection as purely transactional ignores the value of partnerships. Strong carrier relationships provide access to capacity during shortages, better rates, priority handling, and faster problem resolution during disruptions.",
  },
];

// Educational Content Sections
const EDUCATIONAL_SECTIONS = [
  {
    title: "Understanding Carrier Performance",
    content: `Carrier performance measurement is a critical component of effective supply chain management, providing shippers with objective data to evaluate and compare ocean freight carriers. Performance tracking encompasses multiple dimensions including schedule reliability, vessel on-time performance, booking acceptance rates, documentation accuracy, and cargo claim ratios. These metrics collectively provide a comprehensive view of a carrier's operational excellence and service quality. Understanding carrier performance enables shippers to make informed decisions that balance cost considerations with service reliability, ultimately protecting supply chain continuity and reducing total landed costs. Modern performance tracking systems aggregate data from multiple sources including vessel tracking systems, port authority records, and shipper-reported metrics to create standardized performance benchmarks. The most sophisticated systems provide both historical trend analysis and predictive insights, allowing shippers to anticipate potential service disruptions and proactively adjust their logistics strategies. Effective performance tracking also supports carrier negotiations, provides leverage for service level agreements, and helps identify opportunities for supply chain optimization.`,
  },
  {
    title: "Key Performance Indicators",
    content: `Key Performance Indicators (KPIs) for ocean carriers provide quantifiable measures of service quality and operational efficiency. Schedule reliability measures the percentage of vessel arrivals within a defined window of the published schedule, typically within 24 hours for port calls. This metric directly impacts supply chain planning, inventory management, and customer service commitments. Vessel on-time performance focuses specifically on departure and arrival punctuality, capturing the carrier's ability to maintain published schedules. Booking acceptance rate measures the percentage of cargo bookings that are confirmed without rollover or rejection, indicating capacity availability and carrier commitment. Documentation accuracy tracks the correctness of shipping documents including bills of lading, manifests, and certificates, with errors potentially causing customs delays and compliance issues. Claim ratio measures the frequency of cargo damage, loss, or shortage claims relative to total shipments, reflecting cargo handling quality. Each KPI carries different weight depending on cargo type, trade lane, and shipper priorities. Sophisticated shippers develop weighted scoring models that align KPI emphasis with their specific supply chain requirements and risk tolerance.`,
  },
  {
    title: "Measuring On-Time Performance",
    content: `On-time performance measurement requires clear definitions and consistent methodology to produce meaningful comparisons across carriers. The industry standard defines on-time arrival as any vessel arrival within 24 hours of the published schedule, though some shippers apply stricter criteria for time-sensitive cargo. On-time departure is typically measured against the published sailing schedule, with delays categorized by cause including port congestion, weather, vessel maintenance, and cargo operations. Effective measurement systems capture both the frequency of delays and their magnitude, recognizing that a carrier with fewer but longer delays may be preferable to one with frequent minor delays depending on cargo characteristics. Port-specific performance analysis reveals how carriers perform at individual terminals, important for shippers with specific port preferences or constraints. Trade lane analysis identifies performance variations across different routes, enabling route-specific carrier selection. Advanced analytics correlate on-time performance with external factors including seasonal patterns, weather events, and port congestion indices, providing context for performance variations and supporting more accurate predictions. Shippers should establish their own performance baselines based on historical data and set realistic improvement targets in carrier negotiations.`,
  },
  {
    title: "Building Carrier Relationships",
    content: `Strategic carrier relationships extend beyond transactional shipping arrangements to create mutually beneficial partnerships that enhance supply chain resilience and service quality. Effective relationship building begins with transparent communication about shipping volumes, seasonal patterns, and service expectations, enabling carriers to plan capacity allocation and prioritize service commitments. Regular performance reviews provide structured opportunities to address issues, recognize achievements, and collaboratively develop improvement plans. Volume commitments and long-term contracts demonstrate shipper commitment, often securing preferential rates and capacity guarantees that protect against market volatility. Joint innovation initiatives such as digital documentation, real-time tracking, and automated booking systems create operational efficiencies that benefit both parties. Relationship investment during favorable market conditions builds goodwill and carrier loyalty that proves invaluable during capacity crunches and market disruptions. Understanding carrier business strategies, fleet deployment plans, and network development enables shippers to align their logistics strategies with carrier capabilities. Cultural factors including communication styles, decision-making processes, and business practices vary significantly across carriers, particularly between regional and global operators, requiring relationship managers with cross-cultural competence and industry expertise.`,
  },
];

// FAQ Data - Comprehensive (150+ words each)
const FAQS = [
  {
    question: "What is carrier performance tracking and why is it essential for supply chain management?",
    answer: `Carrier performance tracking is the systematic collection, analysis, and reporting of key metrics that measure how effectively ocean freight carriers deliver their services. This includes schedule reliability, on-time performance, booking acceptance rates, documentation accuracy, and cargo handling quality. For supply chain professionals, performance tracking provides the objective data needed to make informed carrier selection decisions, negotiate service level agreements, and protect supply chain continuity. Without systematic tracking, shippers often make decisions based on anecdotal evidence or price alone, potentially selecting carriers that cause costly disruptions. Performance data enables shippers to quantify the total cost of carrier service, including the hidden costs of delays, documentation errors, and cargo damage. Modern supply chains operate with lean inventories and tight production schedules, making carrier reliability a critical success factor. Performance tracking also supports continuous improvement by identifying trends, benchmarking against industry standards, and highlighting areas requiring attention. Sophisticated tracking systems provide predictive insights that help shippers anticipate problems and take preventive action, transforming carrier management from reactive to proactive.`,
  },
  {
    question: "How is schedule reliability calculated and what constitutes a 'reliable' carrier?",
    answer: `Schedule reliability is calculated as the percentage of vessel port calls that arrive within a defined tolerance window of the published schedule, typically within 24 hours. For example, if a carrier makes 100 port calls in a month and 78 arrive within 24 hours of the scheduled time, the schedule reliability would be 78%. The calculation methodology can vary, with some systems using narrower windows (12 hours) for time-sensitive cargo or wider windows (48 hours) for less critical shipments. A 'reliable' carrier typically maintains schedule reliability above 75%, though this benchmark varies by trade lane and market conditions. During periods of port congestion or supply chain disruption, industry-wide reliability may drop significantly, making relative performance comparison more meaningful than absolute thresholds. Top-performing carriers like Hapag-Lloyd and ONE regularly achieve reliability scores above 80%, while the industry average typically hovers around 70-75%. Shippers should establish their own reliability requirements based on supply chain characteristics, recognizing that higher reliability often comes at a premium. For just-in-time manufacturing or perishable goods, the reliability threshold may need to be 85% or higher.`,
  },
  {
    question: "What factors cause carrier performance variations across different trade lanes?",
    answer: `Carrier performance varies significantly across trade lanes due to multiple interconnected factors. Port infrastructure quality differs dramatically between regions, with modern automated terminals enabling faster vessel handling and older facilities creating bottlenecks. Vessel deployment strategies vary, with carriers assigning newer, more reliable vessels to high-volume routes while older vessels serve secondary markets. Distance and transit times affect cumulative delay risk, with longer voyages providing more opportunity to recover from schedule disruptions. Port congestion patterns vary by region and season, with major hubs like Los Angeles/Long Beach, Rotterdam, and Singapore experiencing periodic backlogs. Weather patterns create seasonal variations, with typhoon season affecting Asian routes and winter storms impacting North Atlantic crossings. Terminal operator relationships influence service quality, with carriers having stronger partnerships at some ports than others. Cargo mix affects vessel loading efficiency, with homogeneous container loads enabling faster handling than mixed commodity shipments. Understanding these factors helps shippers set realistic performance expectations for specific routes and identify which carriers have competitive advantages on their trade lanes of interest.`,
  },
  {
    question: "How should shippers use performance data in carrier negotiations?",
    answer: `Performance data provides powerful leverage in carrier negotiations when used strategically. Begin by establishing baseline performance metrics for current carriers and benchmark competitors, documenting specific instances where performance issues caused business impact. This creates objective evidence for service improvement requests and supports requests for service level agreements (SLAs) with performance guarantees. Negotiate specific, measurable commitments with defined tolerance thresholds and reporting requirements rather than vague service promises. Request lane-specific performance data rather than accepting system-wide averages, as this reveals the carrier's actual capability on your routes. Link performance commitments to commercial terms, such as rate adjustments tied to reliability thresholds or penalties for chronic underperformance. Structure contracts to provide incentives for exceeding targets, not just penalties for missing them, creating alignment between carrier and shipper interests. Request regular performance review meetings with operational data sharing and root cause analysis for service issues. Understand what the carrier can realistically deliver based on their network and capabilities, avoiding commitments that cannot be sustained. Document all performance-related agreements in writing and establish clear measurement methodologies to prevent disputes.`,
  },
  {
    question: "What is the relationship between carrier performance and total landed cost?",
    answer: `Carrier performance directly impacts total landed cost through multiple channels that often exceed the visible freight rate differential. Schedule delays create downstream costs including production interruptions, expedited shipping for urgent materials, customer service costs, and potential lost sales. Inventory carrying costs increase when shipments are delayed, requiring higher safety stock to maintain service levels. Documentation errors cause customs delays that generate demurrage, detention, and storage charges, often exceeding the freight cost differential. Cargo damage and loss from poor handling practices result in insurance claims, replacement costs, and customer dissatisfaction. These hidden costs can significantly exceed the savings from selecting a lower-cost but less reliable carrier. Sophisticated shippers develop total cost models that quantify the cost of unreliability, enabling apples-to-apples comparisons between carriers with different rate and performance profiles. For example, a carrier charging $100 more per container but with 85% reliability versus a competitor at 70% reliability may actually deliver lower total cost by avoiding delay-related expenses. The optimal carrier choice depends on cargo characteristics, supply chain flexibility, and customer service requirements.`,
  },
  {
    question: "How do seasonal factors and market conditions affect carrier performance?",
    answer: `Seasonal factors and market conditions create significant variations in carrier performance that shippers must anticipate and plan for. Peak shipping seasons, particularly the pre-holiday period from August through October, strain carrier capacity and reduce schedule reliability as vessels operate at maximum utilization. Port congestion intensifies during peak periods, creating cascading delays that compound schedule disruptions. Weather patterns create predictable performance variations, with typhoon season (June-November) affecting Asian routes and winter storms impacting Northern Hemisphere trade lanes. Carrier financial conditions affect maintenance investment and fleet quality, with financially stressed carriers sometimes sacrificing service quality to reduce operating costs. Capacity fluctuations driven by vessel ordering cycles, scrapping rates, and carrier consolidation affect service reliability. Fuel price volatility influences sailing speed decisions, with higher prices prompting slow steaming that extends transit times and reduces schedule buffer. Shippers should develop seasonal performance expectations and adjust supply chain planning accordingly, building additional buffer during high-risk periods and negotiating seasonal service commitments with carriers. Monitoring leading indicators such as port congestion indices and carrier financial reports provides early warning of developing performance issues.`,
  },
  {
    question: "What role does technology play in modern carrier performance tracking?",
    answer: `Technology has transformed carrier performance tracking from manual, retrospective reporting to real-time, predictive analytics that enable proactive supply chain management. Automatic Identification System (AIS) vessel tracking provides continuous position data that enables precise schedule adherence measurement and early detection of delays. Port community systems integrate carrier, terminal, and customs data to provide end-to-end visibility and identify bottlenecks. Machine learning algorithms analyze historical performance patterns to predict future reliability, enabling shippers to anticipate issues before they impact operations. Digital documentation platforms track accuracy metrics and identify common error patterns for targeted improvement. Cloud-based analytics platforms aggregate performance data across shippers to create industry benchmarks while protecting confidential commercial information. API integrations enable real-time performance data sharing between carrier systems and shipper TMS/ERP platforms, automating tracking and reporting. Blockchain technology is emerging as a solution for creating trusted, immutable performance records that support contract enforcement and dispute resolution. These technologies collectively enable more granular, accurate, and timely performance measurement than was previously possible, while reducing the manual effort required for tracking and analysis.`,
  },
  {
    question: "How should shippers balance performance metrics when selecting carriers?",
    answer: `Balancing performance metrics requires understanding which factors most impact your specific supply chain and developing weighted scoring models that reflect your priorities. Begin by analyzing the business impact of different performance dimensions: schedule reliability for time-sensitive cargo, documentation accuracy for regulated goods, claim ratios for high-value or fragile items. Assign weights to each metric based on this impact analysis, recognizing that priorities vary significantly by cargo type and business context. For example, a manufacturer with just-in-time production might weight schedule reliability at 50%, while a commodity shipper might prioritize booking acceptance and rate competitiveness. Develop minimum threshold requirements for each metric to eliminate carriers that cannot meet basic service standards regardless of other strengths. Consider performance trends alongside current scores, giving preference to carriers showing improvement over those with declining trajectories. Factor in route-specific performance, as a carrier excelling system-wide may underperform on your specific trade lanes. Include qualitative factors such as relationship quality, communication effectiveness, and problem resolution capability in your assessment. Review and adjust your weighting model periodically as business requirements evolve and market conditions change.`,
  },
];

// Get rating badge color
const getRatingColor = (score: number): string => {
  if (score >= 90) return BRAND_COLORS.logistics;
  if (score >= 80) return BRAND_COLORS.ocean;
  if (score >= 70) return BRAND_COLORS.warning;
  if (score >= 60) return BRAND_COLORS.danger;
  return "#DC2626";
};

const getRatingLabel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Average";
  if (score >= 60) return "Below Average";
  return "Poor";
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up": return <ArrowUpRight className="h-4 w-4" style={{ color: BRAND_COLORS.logistics }} />;
    case "down": return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    default: return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

interface CarrierPerformanceTrackerProps {
  onCarrierSelect?: (carrier: string, performance: typeof CARRIER_PERFORMANCE[keyof typeof CARRIER_PERFORMANCE]) => void;
}

export function CarrierPerformanceTracker({ onCarrierSelect }: CarrierPerformanceTrackerProps) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCarrier, setSelectedCarrier] = useState<keyof typeof CARRIERS>("MAERSK");
  const [selectedLane, setSelectedLane] = useState<string>("all");
  const [compareCarriers, setCompareCarriers] = useState<string[]>(["MAERSK", "MSC"]);
  const [copiedShare, setCopiedShare] = useState(false);

  // Export data as JSON
  const handleExport = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      selectedCarrier: selectedCarrier,
      carrierInfo: CARRIERS[selectedCarrier],
      performance: CARRIER_PERFORMANCE[selectedCarrier],
      historicalPerformance: HISTORICAL_PERFORMANCE[selectedCarrier],
      industryAverages: {
        scheduleReliability: (Object.values(CARRIER_PERFORMANCE).reduce((sum, c) => sum + c.scheduleReliability, 0) / Object.keys(CARRIER_PERFORMANCE).length).toFixed(1),
        vesselOnTime: (Object.values(CARRIER_PERFORMANCE).reduce((sum, c) => sum + c.vesselOnTime, 0) / Object.keys(CARRIER_PERFORMANCE).length).toFixed(1),
        overallScore: (Object.values(CARRIER_PERFORMANCE).reduce((sum, c) => sum + c.overallScore, 0) / Object.keys(CARRIER_PERFORMANCE).length).toFixed(1),
      },
      allCarriers: Object.entries(CARRIERS).map(([key, info]) => ({
        key,
        ...info,
        performance: CARRIER_PERFORMANCE[key as keyof typeof CARRIER_PERFORMANCE],
      })).sort((a, b) => b.performance.overallScore - a.performance.overallScore),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carrier-performance-${selectedCarrier.toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [selectedCarrier]);

  // Share functionality
  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?carrier=${selectedCarrier}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  }, [selectedCarrier]);

  // Reset to default state
  const handleReset = useCallback(() => {
    setSelectedCarrier("MAERSK");
    setSelectedLane("all");
    setCompareCarriers(["MAERSK", "MSC"]);
    setActiveTab("dashboard");
  }, []);

  // Get selected carrier data
  const carrierData = useMemo(() => {
    return {
      info: CARRIERS[selectedCarrier],
      performance: CARRIER_PERFORMANCE[selectedCarrier],
      historical: HISTORICAL_PERFORMANCE[selectedCarrier],
    };
  }, [selectedCarrier]);

  // Get all carriers sorted by overall score
  const rankedCarriers = useMemo(() => {
    return Object.entries(CARRIERS)
      .map(([key, info]) => ({
        key,
        ...info,
        performance: CARRIER_PERFORMANCE[key as keyof typeof CARRIER_PERFORMANCE],
      }))
      .sort((a, b) => b.performance.overallScore - a.performance.overallScore);
  }, []);

  // Radar chart data for selected carrier
  const radarData = useMemo(() => {
    const perf = carrierData.performance;
    return [
      { metric: "Schedule Reliability", value: perf.scheduleReliability, fullMark: 100 },
      { metric: "On-Time Performance", value: perf.vesselOnTime, fullMark: 100 },
      { metric: "Booking Acceptance", value: perf.bookingAcceptance, fullMark: 100 },
      { metric: "Doc Accuracy", value: perf.documentationAccuracy, fullMark: 100 },
      { metric: "Low Claims", value: 100 - (perf.claimRatio * 20), fullMark: 100 },
    ];
  }, [carrierData]);

  // Comparison radar data
  const comparisonRadarData = useMemo(() => {
    return [
      { metric: "Schedule", carrier1: CARRIER_PERFORMANCE[compareCarriers[0] as keyof typeof CARRIER_PERFORMANCE]?.scheduleReliability || 0, carrier2: CARRIER_PERFORMANCE[compareCarriers[1] as keyof typeof CARRIER_PERFORMANCE]?.scheduleReliability || 0 },
      { metric: "On-Time", carrier1: CARRIER_PERFORMANCE[compareCarriers[0] as keyof typeof CARRIER_PERFORMANCE]?.vesselOnTime || 0, carrier2: CARRIER_PERFORMANCE[compareCarriers[1] as keyof typeof CARRIER_PERFORMANCE]?.vesselOnTime || 0 },
      { metric: "Booking", carrier1: CARRIER_PERFORMANCE[compareCarriers[0] as keyof typeof CARRIER_PERFORMANCE]?.bookingAcceptance || 0, carrier2: CARRIER_PERFORMANCE[compareCarriers[1] as keyof typeof CARRIER_PERFORMANCE]?.bookingAcceptance || 0 },
      { metric: "Docs", carrier1: CARRIER_PERFORMANCE[compareCarriers[0] as keyof typeof CARRIER_PERFORMANCE]?.documentationAccuracy || 0, carrier2: CARRIER_PERFORMANCE[compareCarriers[1] as keyof typeof CARRIER_PERFORMANCE]?.documentationAccuracy || 0 },
      { metric: "Claims", carrier1: 100 - (CARRIER_PERFORMANCE[compareCarriers[0] as keyof typeof CARRIER_PERFORMANCE]?.claimRatio * 20 || 0), carrier2: 100 - (CARRIER_PERFORMANCE[compareCarriers[1] as keyof typeof CARRIER_PERFORMANCE]?.claimRatio * 20 || 0) },
    ];
  }, [compareCarriers]);

  // Bar chart data for carrier comparison
  const barChartData = useMemo(() => {
    return rankedCarriers.slice(0, 8).map(c => ({
      name: c.code,
      fullName: c.name,
      score: c.performance.overallScore,
      schedule: c.performance.scheduleReliability,
      onTime: c.performance.vesselOnTime,
    }));
  }, [rankedCarriers]);

  // Pie chart data for performance distribution
  const pieData = useMemo(() => {
    const excellent = rankedCarriers.filter(c => c.performance.overallScore >= 90).length;
    const good = rankedCarriers.filter(c => c.performance.overallScore >= 80 && c.performance.overallScore < 90).length;
    const average = rankedCarriers.filter(c => c.performance.overallScore >= 70 && c.performance.overallScore < 80).length;
    const belowAvg = rankedCarriers.filter(c => c.performance.overallScore < 70).length;
    return [
      { name: "Excellent (90+)", value: excellent, color: BRAND_COLORS.logistics },
      { name: "Good (80-89)", value: good, color: BRAND_COLORS.ocean },
      { name: "Average (70-79)", value: average, color: BRAND_COLORS.warning },
      { name: "Below Average (<70)", value: belowAvg, color: BRAND_COLORS.danger },
    ];
  }, [rankedCarriers]);

  // Industry averages
  const industryAverages = useMemo(() => {
    const carriers = Object.values(CARRIER_PERFORMANCE);
    return {
      scheduleReliability: (carriers.reduce((sum, c) => sum + c.scheduleReliability, 0) / carriers.length).toFixed(1),
      vesselOnTime: (carriers.reduce((sum, c) => sum + c.vesselOnTime, 0) / carriers.length).toFixed(1),
      bookingAcceptance: (carriers.reduce((sum, c) => sum + c.bookingAcceptance, 0) / carriers.length).toFixed(1),
      documentationAccuracy: (carriers.reduce((sum, c) => sum + c.documentationAccuracy, 0) / carriers.length).toFixed(1),
      overallScore: (carriers.reduce((sum, c) => sum + c.overallScore, 0) / carriers.length).toFixed(1),
    };
  }, []);

  const chartColors = {
    ocean: BRAND_COLORS.ocean,
    logistics: BRAND_COLORS.logistics,
    warning: BRAND_COLORS.warning,
    danger: BRAND_COLORS.danger,
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 md:p-10 bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 border border-border/50"
      >
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              {/* Animated Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Carrier Analytics
                </Badge>
                <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20 animate-pulse" style={{ animationDelay: "0.5s" }}>
                  <Gauge className="h-3.5 w-3.5 mr-1" />
                  Performance KPIs
                </Badge>
                <Badge className="bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20 animate-pulse" style={{ animationDelay: "1s" }}>
                  <Building2 className="h-3.5 w-3.5 mr-1" />
                  Vendor Management
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Carrier Performance Tracker
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Monitor and compare performance metrics of major ocean carriers worldwide. 
                Make data-driven decisions for your supply chain with comprehensive analytics.
              </p>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6">
                <Button variant="outline" className="gap-2" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button variant="outline" className="gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button className="gap-2 text-white" style={{ backgroundColor: BRAND_COLORS.ocean }} onClick={handleShare}>
                  {copiedShare ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {copiedShare ? "Copied!" : "Share"}
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border/50">
                <Ship className="h-6 w-6 text-[var(--ocean)] mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{Object.keys(CARRIERS).length}</p>
                <p className="text-xs text-muted-foreground">Carriers</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border/50">
                <Globe className="h-6 w-6 text-[var(--logistics)] mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">6</p>
                <p className="text-xs text-muted-foreground">Trade Lanes</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border/50">
                <Activity className="h-6 w-6 text-[var(--ocean)] mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{industryAverages.overallScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 text-center border border-border/50">
                <Users className="h-6 w-6 text-[var(--logistics)] mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">24.3M</p>
                <p className="text-xs text-muted-foreground">Total TEU</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Avg Schedule Reliability", value: `${industryAverages.scheduleReliability}%`, icon: Clock, color: BRAND_COLORS.ocean },
          { label: "Avg On-Time Performance", value: `${industryAverages.vesselOnTime}%`, icon: Ship, color: BRAND_COLORS.logistics },
          { label: "Avg Booking Acceptance", value: `${industryAverages.bookingAcceptance}%`, icon: CheckCircle2, color: BRAND_COLORS.ocean },
          { label: "Avg Doc Accuracy", value: `${industryAverages.documentationAccuracy}%`, icon: FileCheck, color: BRAND_COLORS.logistics },
          { label: "Industry Average", value: `${industryAverages.overallScore}/100`, icon: Gauge, color: BRAND_COLORS.ocean },
        ].map((metric) => (
          <Card key={metric.label} className="border-l-4" style={{ borderLeftColor: metric.color }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}15` }}>
                  <metric.icon className="h-5 w-5" style={{ color: metric.color }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-bold" style={{ color: metric.color }}>{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs - 5 Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="dashboard" className="text-xs md:text-sm py-2">Dashboard</TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs md:text-sm py-2">Analysis</TabsTrigger>
          <TabsTrigger value="comparison" className="text-xs md:text-sm py-2">Comparison</TabsTrigger>
          <TabsTrigger value="guide" className="text-xs md:text-sm py-2">Guide</TabsTrigger>
          <TabsTrigger value="faq" className="text-xs md:text-sm py-2">FAQ</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Carrier Selection */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--ocean)]" />
                  Select Carrier
                </CardTitle>
                <CardDescription>Choose a carrier to view performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Carrier</Label>
                  <Select value={selectedCarrier} onValueChange={(v) => {
                    setSelectedCarrier(v as keyof typeof CARRIERS);
                    onCarrierSelect?.(v, CARRIER_PERFORMANCE[v as keyof typeof CARRIER_PERFORMANCE]);
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CARRIERS).map(([key, carrier]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <span>{carrier.name}</span>
                            <Badge variant="outline" className="text-xs">{carrier.code}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Trade Lane Filter</Label>
                  <Select value={selectedLane} onValueChange={setSelectedLane}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_LANES.map((lane) => (
                        <SelectItem key={lane.id} value={lane.id}>
                          {lane.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Carrier Info */}
                <div className="p-4 rounded-lg bg-[var(--ocean)]/5 border border-[var(--ocean)]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: BRAND_COLORS.ocean }}>
                      {carrierData.info.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{carrierData.info.name}</h3>
                      <p className="text-sm text-muted-foreground">Est. {carrierData.info.established}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fleet:</span>
                      <span className="font-medium text-foreground">{carrierData.info.fleet} vessels</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium text-foreground">{(carrierData.info.teu / 1000000).toFixed(1)}M TEU</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Region:</span>
                      <span className="font-medium text-foreground">{carrierData.info.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium text-foreground">{carrierData.performance.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Score Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-[var(--logistics)]" />
                    Performance Score
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(carrierData.performance.trend)}
                    <Badge 
                      className="text-white"
                      style={{ backgroundColor: getRatingColor(carrierData.performance.overallScore) }}
                    >
                      {getRatingLabel(carrierData.performance.overallScore)}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div 
                      className="w-40 h-40 rounded-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(${getRatingColor(carrierData.performance.overallScore)} ${carrierData.performance.overallScore * 3.6}deg, hsl(var(--muted)) 0deg)`
                      }}
                    >
                      <div className="w-32 h-32 rounded-full bg-card flex items-center justify-center">
                        <div className="text-center">
                          <span 
                            className="text-4xl font-bold"
                            style={{ color: getRatingColor(carrierData.performance.overallScore) }}
                          >
                            {carrierData.performance.overallScore.toFixed(1)}
                          </span>
                          <p className="text-sm text-muted-foreground">/ 100</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: Clock, label: "Schedule Reliability", value: carrierData.performance.scheduleReliability, color: BRAND_COLORS.ocean },
                    { icon: Ship, label: "Vessel On-Time", value: carrierData.performance.vesselOnTime, color: BRAND_COLORS.logistics },
                    { icon: CheckCircle2, label: "Booking Acceptance", value: carrierData.performance.bookingAcceptance, color: BRAND_COLORS.ocean },
                    { icon: FileCheck, label: "Doc Accuracy", value: carrierData.performance.documentationAccuracy, color: BRAND_COLORS.logistics },
                    { icon: FileX, label: "Claim Ratio", value: carrierData.performance.claimRatio, color: BRAND_COLORS.danger, isInverse: true },
                    { icon: Gauge, label: "Overall Score", value: carrierData.performance.overallScore, color: BRAND_COLORS.ocean, highlight: true },
                  ].map((metric) => (
                    <div 
                      key={metric.label} 
                      className={`p-4 rounded-lg ${metric.highlight ? 'bg-[var(--ocean)]/5 border border-[var(--ocean)]/10' : 'bg-muted/50'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon className="h-4 w-4" style={{ color: metric.color }} />
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: metric.color }}>
                        {metric.value}{metric.isInverse ? "%" : "%"}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Performance Radar
              </CardTitle>
              <CardDescription>Multi-factor analysis of carrier performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid strokeDasharray="3 3" className="stroke-border opacity-30" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Radar
                      name={carrierData.info.name}
                      dataKey="value"
                      stroke={BRAND_COLORS.ocean}
                      fill={BRAND_COLORS.ocean}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Performers Quick View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[var(--logistics)]" />
                Top Performers
              </CardTitle>
              <CardDescription>Leading carriers by overall performance score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {rankedCarriers.slice(0, 3).map((carrier, index) => (
                  <div 
                    key={carrier.key}
                    className={`p-4 rounded-lg border ${index === 0 ? 'bg-[var(--logistics)]/5 border-[var(--logistics)]/20' : index === 1 ? 'bg-[var(--ocean)]/5 border-[var(--ocean)]/20' : 'bg-muted/50 border-border'}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white`}
                        style={{ backgroundColor: index === 0 ? BRAND_COLORS.logistics : index === 1 ? BRAND_COLORS.ocean : BRAND_COLORS.warning }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{carrier.name}</h4>
                        <p className="text-xs text-muted-foreground">{carrier.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold" style={{ color: getRatingColor(carrier.performance.overallScore) }}>
                        {carrier.performance.overallScore}
                      </span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(carrier.performance.trend)}
                        <Badge variant="outline" className="text-xs">{getRatingLabel(carrier.performance.overallScore)}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Schedule Reliability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--ocean)]" />
                  Schedule Reliability
                </CardTitle>
                <CardDescription>Percentage of voyages arriving within 24 hours of scheduled arrival</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold" style={{ color: getRatingColor(carrierData.performance.scheduleReliability) }}>
                    {carrierData.performance.scheduleReliability}%
                  </span>
                  <Badge variant="outline" style={{ color: carrierData.performance.scheduleReliability >= 80 ? BRAND_COLORS.logistics : BRAND_COLORS.warning }}>
                    Industry Avg: 75%
                  </Badge>
                </div>
                <Progress value={carrierData.performance.scheduleReliability} className="h-3" />
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 rounded text-center bg-[var(--logistics)]/10">
                    <p className="text-xs text-muted-foreground">On Time</p>
                    <p className="font-bold text-[var(--logistics)]">{Math.round(carrierData.performance.scheduleReliability * 0.9)}%</p>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded text-center">
                    <p className="text-xs text-muted-foreground">Delayed 1-3d</p>
                    <p className="font-bold text-yellow-500">{Math.round((100 - carrierData.performance.scheduleReliability) * 0.6)}%</p>
                  </div>
                  <div className="p-2 bg-red-500/10 rounded text-center">
                    <p className="text-xs text-muted-foreground">Delayed 3+d</p>
                    <p className="font-bold text-red-500">{Math.round((100 - carrierData.performance.scheduleReliability) * 0.4)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vessel On-Time Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-[var(--logistics)]" />
                  Vessel On-Time Performance
                </CardTitle>
                <CardDescription>Vessel departure and arrival punctuality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold" style={{ color: getRatingColor(carrierData.performance.vesselOnTime) }}>
                    {carrierData.performance.vesselOnTime}%
                  </span>
                  <Badge variant="outline" style={{ color: carrierData.performance.vesselOnTime >= 80 ? BRAND_COLORS.logistics : BRAND_COLORS.warning }}>
                    Industry Avg: 78%
                  </Badge>
                </div>
                <Progress value={carrierData.performance.vesselOnTime} className="h-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Early Departures</span>
                    <span className="font-medium text-[var(--logistics)]">{Math.round(carrierData.performance.vesselOnTime * 0.1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">On-Time Departures</span>
                    <span className="font-medium text-[var(--ocean)]">{Math.round(carrierData.performance.vesselOnTime * 0.85)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Late Departures</span>
                    <span className="font-medium text-red-500">{Math.round((100 - carrierData.performance.vesselOnTime) * 0.9)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Acceptance Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--ocean)]" />
                  Booking Acceptance Rate
                </CardTitle>
                <CardDescription>Percentage of bookings accepted without issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold" style={{ color: getRatingColor(carrierData.performance.bookingAcceptance) }}>
                    {carrierData.performance.bookingAcceptance}%
                  </span>
                  <Badge variant="outline" style={{ color: carrierData.performance.bookingAcceptance >= 90 ? BRAND_COLORS.logistics : BRAND_COLORS.warning }}>
                    Industry Avg: 88%
                  </Badge>
                </div>
                <Progress value={carrierData.performance.bookingAcceptance} className="h-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">First Attempt</span>
                    <span className="font-medium text-[var(--logistics)]">{Math.round(carrierData.performance.bookingAcceptance * 0.95)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">After Rollover</span>
                    <span className="font-medium text-yellow-500">{Math.round((100 - carrierData.performance.bookingAcceptance) * 0.3)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rejected</span>
                    <span className="font-medium text-red-500">{Math.round((100 - carrierData.performance.bookingAcceptance) * 0.7)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documentation Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-[var(--logistics)]" />
                  Documentation Accuracy
                </CardTitle>
                <CardDescription>Correctness of shipping documents provided</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold" style={{ color: getRatingColor(carrierData.performance.documentationAccuracy) }}>
                    {carrierData.performance.documentationAccuracy}%
                  </span>
                  <Badge variant="outline" className="text-[var(--logistics)]">
                    Industry Avg: 94%
                  </Badge>
                </div>
                <Progress value={carrierData.performance.documentationAccuracy} className="h-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Error-Free</span>
                    <span className="font-medium text-[var(--logistics)]">{carrierData.performance.documentationAccuracy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Minor Corrections</span>
                    <span className="font-medium text-yellow-500">{Math.round((100 - carrierData.performance.documentationAccuracy) * 0.7)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Major Issues</span>
                    <span className="font-medium text-red-500">{Math.round((100 - carrierData.performance.documentationAccuracy) * 0.3)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historical Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                  12-Month Performance Trend
                </CardTitle>
                <CardDescription>Historical performance metrics for {carrierData.info.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={carrierData.historical}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-30" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="overallScore" 
                        fill={BRAND_COLORS.ocean}
                        stroke={BRAND_COLORS.ocean}
                        fillOpacity={0.2}
                        name="Overall Score"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="scheduleReliability" 
                        stroke={BRAND_COLORS.logistics}
                        strokeWidth={2}
                        dot={{ fill: BRAND_COLORS.logistics, strokeWidth: 2 }}
                        name="Schedule Reliability"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vesselOnTime" 
                        stroke={BRAND_COLORS.warning}
                        strokeWidth={2}
                        dot={{ fill: BRAND_COLORS.warning, strokeWidth: 2 }}
                        name="Vessel On-Time"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carrier Scores Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--logistics)]" />
                Carrier Scores Comparison
              </CardTitle>
              <CardDescription>Overall performance scores by carrier (Bar Chart)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string) => [`${value}`, name]}
                      labelFormatter={(label) => barChartData.find(d => d.name === label)?.fullName || label}
                    />
                    <Legend />
                    <Bar dataKey="score" name="Overall Score" radius={[4, 4, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getRatingColor(entry.score)} />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Carrier Selection for Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--ocean)]" />
                  Select Carriers to Compare
                </CardTitle>
                <CardDescription>Choose two carriers for side-by-side comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Carrier 1</Label>
                  <Select value={compareCarriers[0]} onValueChange={(v) => setCompareCarriers([v, compareCarriers[1]])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CARRIERS).map(([key, carrier]) => (
                        <SelectItem key={key} value={key}>
                          {carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Carrier 2</Label>
                  <Select value={compareCarriers[1]} onValueChange={(v) => setCompareCarriers([compareCarriers[0], v])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CARRIERS).map(([key, carrier]) => (
                        <SelectItem key={key} value={key}>
                          {carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--logistics)]" />
                  Performance Comparison
                </CardTitle>
                <CardDescription>Radar chart comparing multi-factor performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={comparisonRadarData}>
                      <PolarGrid strokeDasharray="3 3" className="stroke-border opacity-30" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <Radar
                        name={CARRIERS[compareCarriers[0] as keyof typeof CARRIERS]?.name || "Carrier 1"}
                        dataKey="carrier1"
                        stroke={BRAND_COLORS.ocean}
                        fill={BRAND_COLORS.ocean}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Radar
                        name={CARRIERS[compareCarriers[1] as keyof typeof CARRIERS]?.name || "Carrier 2"}
                        dataKey="carrier2"
                        stroke={BRAND_COLORS.logistics}
                        fill={BRAND_COLORS.logistics}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-[var(--ocean)]" />
                Detailed Metrics Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium text-muted-foreground">Metric</th>
                      <th className="text-center p-3 font-medium" style={{ color: BRAND_COLORS.ocean }}>
                        {CARRIERS[compareCarriers[0] as keyof typeof CARRIERS]?.name}
                      </th>
                      <th className="text-center p-3 font-medium" style={{ color: BRAND_COLORS.logistics }}>
                        {CARRIERS[compareCarriers[1] as keyof typeof CARRIERS]?.name}
                      </th>
                      <th className="text-center p-3 font-medium text-muted-foreground">Difference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Schedule Reliability", key: "scheduleReliability", unit: "%" },
                      { label: "Vessel On-Time", key: "vesselOnTime", unit: "%" },
                      { label: "Booking Acceptance", key: "bookingAcceptance", unit: "%" },
                      { label: "Doc Accuracy", key: "documentationAccuracy", unit: "%" },
                      { label: "Claim Ratio", key: "claimRatio", unit: "%" },
                      { label: "Overall Score", key: "overallScore", unit: "" },
                    ].map((metric) => {
                      const carrier1Value = CARRIER_PERFORMANCE[compareCarriers[0] as keyof typeof CARRIER_PERFORMANCE]?.[metric.key as keyof typeof CARRIER_PERFORMANCE[keyof typeof CARRIER_PERFORMANCE]] || 0;
                      const carrier2Value = CARRIER_PERFORMANCE[compareCarriers[1] as keyof typeof CARRIER_PERFORMANCE]?.[metric.key as keyof typeof CARRIER_PERFORMANCE[keyof typeof CARRIER_PERFORMANCE]] || 0;
                      const diff = carrier1Value - carrier2Value;
                      return (
                        <tr key={metric.key} className="border-b border-border last:border-0">
                          <td className="p-3 text-muted-foreground">{metric.label}</td>
                          <td className="p-3 text-center font-medium" style={{ color: BRAND_COLORS.ocean }}>
                            {carrier1Value}{metric.unit}
                          </td>
                          <td className="p-3 text-center font-medium" style={{ color: BRAND_COLORS.logistics }}>
                            {carrier2Value}{metric.unit}
                          </td>
                          <td className="p-3 text-center">
                            <span className={`inline-flex items-center gap-1 ${diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                              {diff > 0 ? <ArrowUpRight className="h-3 w-3" /> : diff < 0 ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                              {Math.abs(diff).toFixed(1)}{metric.unit}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-[var(--ocean)]" />
                Carrier Score Distribution
              </CardTitle>
              <CardDescription>Performance distribution across all carriers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="font-bold text-foreground">{item.value} carriers</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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

          {/* Pro Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--warning)]" />
                Pro Tips & Best Practices
              </CardTitle>
              <CardDescription>Actionable tips for effective carrier management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[var(--warning)]/10">
                        <tip.icon className="h-5 w-5 text-[var(--warning)]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Critical pitfalls in carrier selection and management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <div key={index} className="p-4 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Carrier Rankings Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--logistics)]" />
                Carrier Rankings Reference
              </CardTitle>
              <CardDescription>Complete rankings by overall performance score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {rankedCarriers.map((carrier, index) => (
                  <div 
                    key={carrier.key}
                    className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${selectedCarrier === carrier.key ? 'border-2 border-[var(--ocean)]' : 'border-border'}`}
                    onClick={() => setSelectedCarrier(carrier.key as keyof typeof CARRIERS)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index < 3 ? 'text-white' : 'text-muted-foreground'}`}
                          style={{ backgroundColor: index === 0 ? BRAND_COLORS.logistics : index < 3 ? BRAND_COLORS.ocean : 'hsl(var(--muted))' }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{carrier.name}</h4>
                          <p className="text-xs text-muted-foreground">{carrier.region} • Est. {carrier.established}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: getRatingColor(carrier.performance.overallScore) }}>
                          {carrier.performance.overallScore}
                        </p>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(carrier.performance.trend)}
                          <Badge variant="outline" className="text-xs">
                            {getRatingLabel(carrier.performance.overallScore)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-muted-foreground">Schedule</p>
                        <p className="font-medium text-foreground">{carrier.performance.scheduleReliability}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">On-Time</p>
                        <p className="font-medium text-foreground">{carrier.performance.vesselOnTime}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Booking</p>
                        <p className="font-medium text-foreground">{carrier.performance.bookingAcceptance}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Docs</p>
                        <p className="font-medium text-foreground">{carrier.performance.documentationAccuracy}%</p>
                      </div>
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
              <CardDescription>Comprehensive answers to common questions about carrier performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-foreground">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-6 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer CTA */}
      <div 
        className="rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-border bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-card shadow-lg border border-border">
            <RefreshCw className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Stay Updated</h3>
            <p className="text-muted-foreground text-sm">Performance data is updated monthly with the latest carrier metrics.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Last Updated: Jan 15, 2024
          </Button>
          <Button className="gap-2 text-white" style={{ backgroundColor: BRAND_COLORS.ocean }} onClick={handleExport}>
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}

// Add missing Trophy import
function Trophy({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
