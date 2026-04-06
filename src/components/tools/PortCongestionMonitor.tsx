"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  Anchor,
  ArrowRight,
  BarChart3,
  Building2,
  Clock,
  Container,
  Gauge,
  MapPin,
  RefreshCw,
  Ship,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info,
  Calendar,
  Activity,
  Loader2,
  Globe,
  Waves,
  Zap,
  Target,
  LineChart,
  PieChart as PieChartIcon,
  HelpCircle,
  ChevronRight,
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
  Cell,
  PieChart,
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
  critical: "#DC2626",
  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",
  criticalLevel: "#991B1B",
};

// Congestion levels
type CongestionLevel = "low" | "medium" | "high" | "critical";

interface PortCongestionData {
  unLoCode: string;
  name: string;
  country: string;
  region: string;
  congestionLevel: CongestionLevel;
  congestionScore: number; // 0-100
  avgWaitTime: number; // hours
  berthOccupancy: number; // percentage
  yardUtilization: number; // percentage
  craneProductivity: number; // moves per hour
  vesselsAtAnchor: number;
  vesselsAtBerth: number;
  vesselsWaiting: number;
  avgBerthWait: number; // hours
  trend: "improving" | "stable" | "worsening";
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
  timezone: string;
}

// 50+ Major Global Ports with congestion data
const PORTS_DATA: PortCongestionData[] = [
  // Asia
  { unLoCode: "CNSHA", name: "Shanghai", country: "China", region: "Asia", congestionLevel: "high", congestionScore: 72, avgWaitTime: 48, berthOccupancy: 92, yardUtilization: 88, craneProductivity: 28, vesselsAtAnchor: 45, vesselsAtBerth: 128, vesselsWaiting: 12, avgBerthWait: 36, trend: "worsening", lastUpdated: "2024-01-15T10:30:00Z", coordinates: { lat: 31.3614, lng: 121.5878 }, timezone: "Asia/Shanghai" },
  { unLoCode: "CNSZX", name: "Shenzhen", country: "China", region: "Asia", congestionLevel: "medium", congestionScore: 58, avgWaitTime: 32, berthOccupancy: 85, yardUtilization: 82, craneProductivity: 32, vesselsAtAnchor: 28, vesselsAtBerth: 95, vesselsWaiting: 8, avgBerthWait: 24, trend: "stable", lastUpdated: "2024-01-15T10:15:00Z", coordinates: { lat: 22.4797, lng: 113.9064 }, timezone: "Asia/Shanghai" },
  { unLoCode: "CNNGB", name: "Ningbo-Zhoushan", country: "China", region: "Asia", congestionLevel: "medium", congestionScore: 55, avgWaitTime: 28, berthOccupancy: 83, yardUtilization: 78, craneProductivity: 30, vesselsAtAnchor: 22, vesselsAtBerth: 88, vesselsWaiting: 6, avgBerthWait: 20, trend: "improving", lastUpdated: "2024-01-15T10:20:00Z", coordinates: { lat: 29.8683, lng: 121.5440 }, timezone: "Asia/Shanghai" },
  { unLoCode: "CNQIN", name: "Qingdao", country: "China", region: "Asia", congestionLevel: "low", congestionScore: 35, avgWaitTime: 12, berthOccupancy: 72, yardUtilization: 68, craneProductivity: 35, vesselsAtAnchor: 8, vesselsAtBerth: 52, vesselsWaiting: 2, avgBerthWait: 8, trend: "improving", lastUpdated: "2024-01-15T10:25:00Z", coordinates: { lat: 36.0671, lng: 120.3826 }, timezone: "Asia/Shanghai" },
  { unLoCode: "CNGZH", name: "Guangzhou", country: "China", region: "Asia", congestionLevel: "medium", congestionScore: 52, avgWaitTime: 24, berthOccupancy: 80, yardUtilization: 75, craneProductivity: 29, vesselsAtAnchor: 18, vesselsAtBerth: 68, vesselsWaiting: 5, avgBerthWait: 18, trend: "stable", lastUpdated: "2024-01-15T09:45:00Z", coordinates: { lat: 22.9458, lng: 113.5208 }, timezone: "Asia/Shanghai" },
  { unLoCode: "CNTXG", name: "Tianjin", country: "China", region: "Asia", congestionLevel: "medium", congestionScore: 48, avgWaitTime: 20, berthOccupancy: 78, yardUtilization: 72, craneProductivity: 27, vesselsAtAnchor: 15, vesselsAtBerth: 58, vesselsWaiting: 4, avgBerthWait: 15, trend: "improving", lastUpdated: "2024-01-15T09:30:00Z", coordinates: { lat: 38.9788, lng: 117.7823 }, timezone: "Asia/Shanghai" },
  { unLoCode: "SGSIN", name: "Singapore", country: "Singapore", region: "Asia", congestionLevel: "high", congestionScore: 68, avgWaitTime: 42, berthOccupancy: 90, yardUtilization: 85, craneProductivity: 35, vesselsAtAnchor: 52, vesselsAtBerth: 145, vesselsWaiting: 15, avgBerthWait: 32, trend: "stable", lastUpdated: "2024-01-15T10:35:00Z", coordinates: { lat: 1.2644, lng: 103.8198 }, timezone: "Asia/Singapore" },
  { unLoCode: "KRPUS", name: "Busan", country: "South Korea", region: "Asia", congestionLevel: "low", congestionScore: 32, avgWaitTime: 10, berthOccupancy: 70, yardUtilization: 65, craneProductivity: 33, vesselsAtAnchor: 6, vesselsAtBerth: 45, vesselsWaiting: 2, avgBerthWait: 6, trend: "improving", lastUpdated: "2024-01-15T10:00:00Z", coordinates: { lat: 35.1026, lng: 129.0403 }, timezone: "Asia/Seoul" },
  { unLoCode: "HKHKG", name: "Hong Kong", country: "Hong Kong", region: "Asia", congestionLevel: "medium", congestionScore: 45, avgWaitTime: 18, berthOccupancy: 76, yardUtilization: 72, craneProductivity: 31, vesselsAtAnchor: 12, vesselsAtBerth: 48, vesselsWaiting: 3, avgBerthWait: 12, trend: "stable", lastUpdated: "2024-01-15T09:50:00Z", coordinates: { lat: 22.2855, lng: 114.1577 }, timezone: "Asia/Hong_Kong" },
  { unLoCode: "JPYOK", name: "Yokohama", country: "Japan", region: "Asia", congestionLevel: "low", congestionScore: 28, avgWaitTime: 8, berthOccupancy: 65, yardUtilization: 60, craneProductivity: 30, vesselsAtAnchor: 4, vesselsAtBerth: 32, vesselsWaiting: 1, avgBerthWait: 4, trend: "improving", lastUpdated: "2024-01-15T10:10:00Z", coordinates: { lat: 35.4603, lng: 139.7644 }, timezone: "Asia/Tokyo" },
  { unLoCode: "JPTYO", name: "Tokyo", country: "Japan", region: "Asia", congestionLevel: "low", congestionScore: 25, avgWaitTime: 6, berthOccupancy: 62, yardUtilization: 58, craneProductivity: 32, vesselsAtAnchor: 3, vesselsAtBerth: 28, vesselsWaiting: 1, avgBerthWait: 3, trend: "stable", lastUpdated: "2024-01-15T10:05:00Z", coordinates: { lat: 35.6528, lng: 139.7914 }, timezone: "Asia/Tokyo" },
  { unLoCode: "TWKHH", name: "Kaohsiung", country: "Taiwan", region: "Asia", congestionLevel: "medium", congestionScore: 50, avgWaitTime: 22, berthOccupancy: 79, yardUtilization: 74, craneProductivity: 28, vesselsAtAnchor: 14, vesselsAtBerth: 55, vesselsWaiting: 4, avgBerthWait: 16, trend: "worsening", lastUpdated: "2024-01-15T09:40:00Z", coordinates: { lat: 22.5619, lng: 120.3147 }, timezone: "Asia/Taipei" },
  { unLoCode: "MYPKG", name: "Port Klang", country: "Malaysia", region: "Asia", congestionLevel: "medium", congestionScore: 55, avgWaitTime: 26, berthOccupancy: 82, yardUtilization: 78, craneProductivity: 26, vesselsAtAnchor: 20, vesselsAtBerth: 72, vesselsWaiting: 6, avgBerthWait: 18, trend: "stable", lastUpdated: "2024-01-15T10:20:00Z", coordinates: { lat: 3.0019, lng: 101.3933 }, timezone: "Asia/Kuala_Lumpur" },
  { unLoCode: "THBKK", name: "Laem Chabang", country: "Thailand", region: "Asia", congestionLevel: "low", congestionScore: 38, avgWaitTime: 14, berthOccupancy: 74, yardUtilization: 70, craneProductivity: 25, vesselsAtAnchor: 8, vesselsAtBerth: 42, vesselsWaiting: 2, avgBerthWait: 10, trend: "improving", lastUpdated: "2024-01-15T09:55:00Z", coordinates: { lat: 13.1014, lng: 100.8858 }, timezone: "Asia/Bangkok" },
  { unLoCode: "VNHPH", name: "Haiphong", country: "Vietnam", region: "Asia", congestionLevel: "medium", congestionScore: 48, avgWaitTime: 20, berthOccupancy: 78, yardUtilization: 74, craneProductivity: 22, vesselsAtAnchor: 12, vesselsAtBerth: 45, vesselsWaiting: 4, avgBerthWait: 14, trend: "worsening", lastUpdated: "2024-01-15T09:30:00Z", coordinates: { lat: 20.8519, lng: 106.7042 }, timezone: "Asia/Bangkok" },
  { unLoCode: "VNSGN", name: "Ho Chi Minh City", country: "Vietnam", region: "Asia", congestionLevel: "high", congestionScore: 62, avgWaitTime: 36, berthOccupancy: 88, yardUtilization: 82, craneProductivity: 24, vesselsAtAnchor: 25, vesselsAtBerth: 68, vesselsWaiting: 8, avgBerthWait: 28, trend: "worsening", lastUpdated: "2024-01-15T09:45:00Z", coordinates: { lat: 10.7802, lng: 106.7003 }, timezone: "Asia/Bangkok" },
  { unLoCode: "IDJKT", name: "Jakarta (Tanjung Priok)", country: "Indonesia", region: "Asia", congestionLevel: "medium", congestionScore: 52, avgWaitTime: 24, berthOccupancy: 80, yardUtilization: 76, craneProductivity: 23, vesselsAtAnchor: 16, vesselsAtBerth: 52, vesselsWaiting: 5, avgBerthWait: 18, trend: "stable", lastUpdated: "2024-01-15T09:20:00Z", coordinates: { lat: -6.1017, lng: 106.8842 }, timezone: "Asia/Jakarta" },
  { unLoCode: "PHMNL", name: "Manila", country: "Philippines", region: "Asia", congestionLevel: "critical", congestionScore: 85, avgWaitTime: 72, berthOccupancy: 98, yardUtilization: 95, craneProductivity: 18, vesselsAtAnchor: 38, vesselsAtBerth: 45, vesselsWaiting: 18, avgBerthWait: 56, trend: "worsening", lastUpdated: "2024-01-15T09:00:00Z", coordinates: { lat: 14.5944, lng: 120.9704 }, timezone: "Asia/Manila" },
  { unLoCode: "INNSA", name: "Nhava Sheva (JNPT)", country: "India", region: "Asia", congestionLevel: "medium", congestionScore: 58, avgWaitTime: 30, berthOccupancy: 84, yardUtilization: 80, craneProductivity: 25, vesselsAtAnchor: 22, vesselsAtBerth: 58, vesselsWaiting: 7, avgBerthWait: 22, trend: "stable", lastUpdated: "2024-01-15T09:15:00Z", coordinates: { lat: 18.9639, lng: 72.9492 }, timezone: "Asia/Kolkata" },
  { unLoCode: "INMAA", name: "Chennai", country: "India", region: "Asia", congestionLevel: "high", congestionScore: 65, avgWaitTime: 38, berthOccupancy: 88, yardUtilization: 85, craneProductivity: 22, vesselsAtAnchor: 28, vesselsAtBerth: 48, vesselsWaiting: 10, avgBerthWait: 28, trend: "worsening", lastUpdated: "2024-01-15T09:10:00Z", coordinates: { lat: 13.1239, lng: 80.3003 }, timezone: "Asia/Kolkata" },
  { unLoCode: "LKCMB", name: "Colombo", country: "Sri Lanka", region: "Asia", congestionLevel: "low", congestionScore: 30, avgWaitTime: 10, berthOccupancy: 68, yardUtilization: 62, craneProductivity: 28, vesselsAtAnchor: 5, vesselsAtBerth: 35, vesselsWaiting: 1, avgBerthWait: 6, trend: "improving", lastUpdated: "2024-01-15T08:45:00Z", coordinates: { lat: 6.9471, lng: 79.8458 }, timezone: "Asia/Colombo" },
  { unLoCode: "BDCGP", name: "Chittagong", country: "Bangladesh", region: "Asia", congestionLevel: "high", congestionScore: 70, avgWaitTime: 45, berthOccupancy: 90, yardUtilization: 88, craneProductivity: 20, vesselsAtAnchor: 32, vesselsAtBerth: 38, vesselsWaiting: 12, avgBerthWait: 35, trend: "worsening", lastUpdated: "2024-01-15T08:30:00Z", coordinates: { lat: 22.3071, lng: 91.7769 }, timezone: "Asia/Dhaka" },

  // Middle East
  { unLoCode: "AEJEA", name: "Jebel Ali (Dubai)", country: "UAE", region: "Middle East", congestionLevel: "medium", congestionScore: 52, avgWaitTime: 22, berthOccupancy: 80, yardUtilization: 75, craneProductivity: 30, vesselsAtAnchor: 18, vesselsAtBerth: 78, vesselsWaiting: 5, avgBerthWait: 16, trend: "stable", lastUpdated: "2024-01-15T10:00:00Z", coordinates: { lat: 25.0072, lng: 55.0266 }, timezone: "Asia/Dubai" },
  { unLoCode: "SAJED", name: "Jeddah", country: "Saudi Arabia", region: "Middle East", congestionLevel: "low", congestionScore: 35, avgWaitTime: 12, berthOccupancy: 72, yardUtilization: 68, craneProductivity: 26, vesselsAtAnchor: 8, vesselsAtBerth: 42, vesselsWaiting: 2, avgBerthWait: 8, trend: "improving", lastUpdated: "2024-01-15T09:30:00Z", coordinates: { lat: 21.4814, lng: 39.1822 }, timezone: "Asia/Riyadh" },
  { unLoCode: "QAHMD", name: "Hamad Port", country: "Qatar", region: "Middle East", congestionLevel: "low", congestionScore: 28, avgWaitTime: 8, berthOccupancy: 65, yardUtilization: 60, craneProductivity: 32, vesselsAtAnchor: 4, vesselsAtBerth: 35, vesselsWaiting: 1, avgBerthWait: 5, trend: "stable", lastUpdated: "2024-01-15T09:45:00Z", coordinates: { lat: 25.0500, lng: 51.6500 }, timezone: "Asia/Qatar" },
  { unLoCode: "OMSLL", name: "Salalah", country: "Oman", region: "Middle East", congestionLevel: "low", congestionScore: 32, avgWaitTime: 10, berthOccupancy: 70, yardUtilization: 65, craneProductivity: 28, vesselsAtAnchor: 6, vesselsAtBerth: 38, vesselsWaiting: 2, avgBerthWait: 6, trend: "improving", lastUpdated: "2024-01-15T09:20:00Z", coordinates: { lat: 16.9361, lng: 53.9889 }, timezone: "Asia/Muscat" },

  // Europe
  { unLoCode: "NLRTM", name: "Rotterdam", country: "Netherlands", region: "Europe", congestionLevel: "medium", congestionScore: 48, avgWaitTime: 18, berthOccupancy: 78, yardUtilization: 72, craneProductivity: 32, vesselsAtAnchor: 14, vesselsAtBerth: 85, vesselsWaiting: 4, avgBerthWait: 12, trend: "improving", lastUpdated: "2024-01-15T10:30:00Z", coordinates: { lat: 51.9054, lng: 4.4454 }, timezone: "Europe/Amsterdam" },
  { unLoCode: "BEANR", name: "Antwerp", country: "Belgium", region: "Europe", congestionLevel: "medium", congestionScore: 52, avgWaitTime: 22, berthOccupancy: 82, yardUtilization: 78, craneProductivity: 30, vesselsAtAnchor: 16, vesselsAtBerth: 72, vesselsWaiting: 5, avgBerthWait: 16, trend: "stable", lastUpdated: "2024-01-15T10:25:00Z", coordinates: { lat: 51.2640, lng: 4.3983 }, timezone: "Europe/Brussels" },
  { unLoCode: "DEHAM", name: "Hamburg", country: "Germany", region: "Europe", congestionLevel: "high", congestionScore: 62, avgWaitTime: 35, berthOccupancy: 88, yardUtilization: 85, craneProductivity: 28, vesselsAtAnchor: 25, vesselsAtBerth: 68, vesselsWaiting: 9, avgBerthWait: 26, trend: "worsening", lastUpdated: "2024-01-15T10:20:00Z", coordinates: { lat: 53.5397, lng: 9.9918 }, timezone: "Europe/Berlin" },
  { unLoCode: "DEBRV", name: "Bremerhaven", country: "Germany", region: "Europe", congestionLevel: "medium", congestionScore: 45, avgWaitTime: 16, berthOccupancy: 76, yardUtilization: 70, craneProductivity: 30, vesselsAtAnchor: 10, vesselsAtBerth: 52, vesselsWaiting: 3, avgBerthWait: 12, trend: "improving", lastUpdated: "2024-01-15T10:15:00Z", coordinates: { lat: 53.5667, lng: 8.5667 }, timezone: "Europe/Berlin" },
  { unLoCode: "GBFXT", name: "Felixstowe", country: "UK", region: "Europe", congestionLevel: "medium", congestionScore: 55, avgWaitTime: 26, berthOccupancy: 84, yardUtilization: 80, craneProductivity: 29, vesselsAtAnchor: 18, vesselsAtBerth: 58, vesselsWaiting: 6, avgBerthWait: 20, trend: "stable", lastUpdated: "2024-01-15T10:10:00Z", coordinates: { lat: 51.9537, lng: 1.3511 }, timezone: "Europe/London" },
  { unLoCode: "GBSOU", name: "Southampton", country: "UK", region: "Europe", congestionLevel: "low", congestionScore: 38, avgWaitTime: 14, berthOccupancy: 74, yardUtilization: 68, craneProductivity: 31, vesselsAtAnchor: 8, vesselsAtBerth: 42, vesselsWaiting: 2, avgBerthWait: 10, trend: "improving", lastUpdated: "2024-01-15T10:05:00Z", coordinates: { lat: 50.9000, lng: -1.4167 }, timezone: "Europe/London" },
  { unLoCode: "FRMRS", name: "Marseille", country: "France", region: "Europe", congestionLevel: "low", congestionScore: 32, avgWaitTime: 10, berthOccupancy: 70, yardUtilization: 65, craneProductivity: 27, vesselsAtAnchor: 6, vesselsAtBerth: 38, vesselsWaiting: 2, avgBerthWait: 6, trend: "stable", lastUpdated: "2024-01-15T10:00:00Z", coordinates: { lat: 43.2964, lng: 5.3700 }, timezone: "Europe/Paris" },
  { unLoCode: "FRLEH", name: "Le Havre", country: "France", region: "Europe", congestionLevel: "medium", congestionScore: 50, avgWaitTime: 24, berthOccupancy: 80, yardUtilization: 75, craneProductivity: 28, vesselsAtAnchor: 14, vesselsAtBerth: 55, vesselsWaiting: 4, avgBerthWait: 18, trend: "stable", lastUpdated: "2024-01-15T09:55:00Z", coordinates: { lat: 49.4833, lng: 0.1167 }, timezone: "Europe/Paris" },
  { unLoCode: "ESALG", name: "Algeciras", country: "Spain", region: "Europe", congestionLevel: "low", congestionScore: 28, avgWaitTime: 8, berthOccupancy: 68, yardUtilization: 62, craneProductivity: 34, vesselsAtAnchor: 4, vesselsAtBerth: 48, vesselsWaiting: 1, avgBerthWait: 5, trend: "improving", lastUpdated: "2024-01-15T09:50:00Z", coordinates: { lat: 36.1333, lng: -5.4500 }, timezone: "Europe/Madrid" },
  { unLoCode: "ESBAR", name: "Barcelona", country: "Spain", region: "Europe", congestionLevel: "medium", congestionScore: 45, avgWaitTime: 18, berthOccupancy: 76, yardUtilization: 72, craneProductivity: 26, vesselsAtAnchor: 10, vesselsAtBerth: 45, vesselsWaiting: 3, avgBerthWait: 12, trend: "stable", lastUpdated: "2024-01-15T09:45:00Z", coordinates: { lat: 41.3500, lng: 2.1500 }, timezone: "Europe/Madrid" },
  { unLoCode: "ESVLC", name: "Valencia", country: "Spain", region: "Europe", congestionLevel: "low", congestionScore: 35, avgWaitTime: 12, berthOccupancy: 72, yardUtilization: 68, craneProductivity: 29, vesselsAtAnchor: 7, vesselsAtBerth: 42, vesselsWaiting: 2, avgBerthWait: 8, trend: "improving", lastUpdated: "2024-01-15T09:40:00Z", coordinates: { lat: 39.4500, lng: -0.3333 }, timezone: "Europe/Madrid" },
  { unLoCode: "ITGOA", name: "Genoa", country: "Italy", region: "Europe", congestionLevel: "medium", congestionScore: 48, avgWaitTime: 20, berthOccupancy: 78, yardUtilization: 74, craneProductivity: 25, vesselsAtAnchor: 12, vesselsAtBerth: 48, vesselsWaiting: 4, avgBerthWait: 14, trend: "stable", lastUpdated: "2024-01-15T09:35:00Z", coordinates: { lat: 44.4000, lng: 8.9167 }, timezone: "Europe/Rome" },
  { unLoCode: "GRPIR", name: "Piraeus", country: "Greece", region: "Europe", congestionLevel: "medium", congestionScore: 52, avgWaitTime: 24, berthOccupancy: 82, yardUtilization: 78, craneProductivity: 27, vesselsAtAnchor: 15, vesselsAtBerth: 55, vesselsWaiting: 5, avgBerthWait: 18, trend: "worsening", lastUpdated: "2024-01-15T09:30:00Z", coordinates: { lat: 37.9500, lng: 23.6500 }, timezone: "Europe/Athens" },
  { unLoCode: "TRIST", name: "Istanbul", country: "Turkey", region: "Europe", congestionLevel: "high", congestionScore: 65, avgWaitTime: 38, berthOccupancy: 88, yardUtilization: 85, craneProductivity: 24, vesselsAtAnchor: 22, vesselsAtBerth: 52, vesselsWaiting: 8, avgBerthWait: 28, trend: "worsening", lastUpdated: "2024-01-15T09:25:00Z", coordinates: { lat: 41.0000, lng: 29.0000 }, timezone: "Europe/Istanbul" },

  // North America
  { unLoCode: "USLAX", name: "Los Angeles", country: "USA", region: "North America", congestionLevel: "medium", congestionScore: 55, avgWaitTime: 28, berthOccupancy: 82, yardUtilization: 78, craneProductivity: 30, vesselsAtAnchor: 20, vesselsAtBerth: 72, vesselsWaiting: 6, avgBerthWait: 20, trend: "improving", lastUpdated: "2024-01-15T10:30:00Z", coordinates: { lat: 33.7405, lng: -118.2716 }, timezone: "America/Los_Angeles" },
  { unLoCode: "USLGB", name: "Long Beach", country: "USA", region: "North America", congestionLevel: "medium", congestionScore: 52, avgWaitTime: 24, berthOccupancy: 80, yardUtilization: 76, craneProductivity: 31, vesselsAtAnchor: 16, vesselsAtBerth: 68, vesselsWaiting: 5, avgBerthWait: 18, trend: "improving", lastUpdated: "2024-01-15T10:25:00Z", coordinates: { lat: 33.7541, lng: -118.2171 }, timezone: "America/Los_Angeles" },
  { unLoCode: "USNYC", name: "New York/New Jersey", country: "USA", region: "North America", congestionLevel: "high", congestionScore: 62, avgWaitTime: 35, berthOccupancy: 86, yardUtilization: 82, craneProductivity: 28, vesselsAtAnchor: 24, vesselsAtBerth: 65, vesselsWaiting: 8, avgBerthWait: 26, trend: "stable", lastUpdated: "2024-01-15T10:20:00Z", coordinates: { lat: 40.6659, lng: -74.0450 }, timezone: "America/New_York" },
  { unLoCode: "USSAV", name: "Savannah", country: "USA", region: "North America", congestionLevel: "low", congestionScore: 38, avgWaitTime: 14, berthOccupancy: 74, yardUtilization: 70, craneProductivity: 29, vesselsAtAnchor: 8, vesselsAtBerth: 48, vesselsWaiting: 2, avgBerthWait: 10, trend: "improving", lastUpdated: "2024-01-15T10:15:00Z", coordinates: { lat: 32.0809, lng: -81.0875 }, timezone: "America/New_York" },
  { unLoCode: "USOAK", name: "Oakland", country: "USA", region: "North America", congestionLevel: "medium", congestionScore: 48, avgWaitTime: 20, berthOccupancy: 78, yardUtilization: 74, craneProductivity: 27, vesselsAtAnchor: 12, vesselsAtBerth: 52, vesselsWaiting: 4, avgBerthWait: 14, trend: "stable", lastUpdated: "2024-01-15T10:10:00Z", coordinates: { lat: 37.8000, lng: -122.3000 }, timezone: "America/Los_Angeles" },
  { unLoCode: "USSEA", name: "Seattle", country: "USA", region: "North America", congestionLevel: "low", congestionScore: 35, avgWaitTime: 12, berthOccupancy: 72, yardUtilization: 68, craneProductivity: 28, vesselsAtAnchor: 6, vesselsAtBerth: 45, vesselsWaiting: 2, avgBerthWait: 8, trend: "improving", lastUpdated: "2024-01-15T10:05:00Z", coordinates: { lat: 47.6062, lng: -122.3321 }, timezone: "America/Los_Angeles" },
  { unLoCode: "CAMTR", name: "Montreal", country: "Canada", region: "North America", congestionLevel: "low", congestionScore: 30, avgWaitTime: 10, berthOccupancy: 70, yardUtilization: 65, craneProductivity: 26, vesselsAtAnchor: 5, vesselsAtBerth: 38, vesselsWaiting: 1, avgBerthWait: 6, trend: "stable", lastUpdated: "2024-01-15T10:00:00Z", coordinates: { lat: 45.5017, lng: -73.5673 }, timezone: "America/Montreal" },
  { unLoCode: "CAVAN", name: "Vancouver", country: "Canada", region: "North America", congestionLevel: "medium", congestionScore: 50, avgWaitTime: 22, berthOccupancy: 80, yardUtilization: 76, craneProductivity: 25, vesselsAtAnchor: 14, vesselsAtBerth: 52, vesselsWaiting: 4, avgBerthWait: 16, trend: "stable", lastUpdated: "2024-01-15T09:55:00Z", coordinates: { lat: 49.2827, lng: -123.1207 }, timezone: "America/Vancouver" },
  { unLoCode: "MXMZL", name: "Manzanillo", country: "Mexico", region: "North America", congestionLevel: "high", congestionScore: 68, avgWaitTime: 42, berthOccupancy: 90, yardUtilization: 86, craneProductivity: 23, vesselsAtAnchor: 28, vesselsAtBerth: 48, vesselsWaiting: 10, avgBerthWait: 32, trend: "worsening", lastUpdated: "2024-01-15T09:50:00Z", coordinates: { lat: 19.0544, lng: -104.3213 }, timezone: "America/Mexico_City" },

  // South America
  { unLoCode: "BRSSZ", name: "Santos", country: "Brazil", region: "South America", congestionLevel: "medium", congestionScore: 52, avgWaitTime: 26, berthOccupancy: 82, yardUtilization: 78, craneProductivity: 24, vesselsAtAnchor: 16, vesselsAtBerth: 52, vesselsWaiting: 5, avgBerthWait: 18, trend: "stable", lastUpdated: "2024-01-15T10:00:00Z", coordinates: { lat: -23.9618, lng: -46.2833 }, timezone: "America/Sao_Paulo" },
  { unLoCode: "ARRIQ", name: "Rio de la Plata", country: "Argentina", region: "South America", congestionLevel: "low", congestionScore: 35, avgWaitTime: 12, berthOccupancy: 72, yardUtilization: 68, craneProductivity: 22, vesselsAtAnchor: 6, vesselsAtBerth: 35, vesselsWaiting: 2, avgBerthWait: 8, trend: "improving", lastUpdated: "2024-01-15T09:30:00Z", coordinates: { lat: -34.6037, lng: -58.3816 }, timezone: "America/Argentina/Buenos_Aires" },
  { unLoCode: "CLSAI", name: "San Antonio", country: "Chile", region: "South America", congestionLevel: "low", congestionScore: 28, avgWaitTime: 8, berthOccupancy: 68, yardUtilization: 62, craneProductivity: 25, vesselsAtAnchor: 4, vesselsAtBerth: 28, vesselsWaiting: 1, avgBerthWait: 5, trend: "stable", lastUpdated: "2024-01-15T09:00:00Z", coordinates: { lat: -33.4489, lng: -70.6693 }, timezone: "America/Santiago" },

  // Africa
  { unLoCode: "ZADUR", name: "Durban", country: "South Africa", region: "Africa", congestionLevel: "critical", congestionScore: 82, avgWaitTime: 68, berthOccupancy: 96, yardUtilization: 92, craneProductivity: 19, vesselsAtAnchor: 42, vesselsAtBerth: 45, vesselsWaiting: 16, avgBerthWait: 52, trend: "worsening", lastUpdated: "2024-01-15T10:00:00Z", coordinates: { lat: -29.8587, lng: 31.0218 }, timezone: "Africa/Johannesburg" },
  { unLoCode: "EGSCA", name: "Suez Canal", country: "Egypt", region: "Africa", congestionLevel: "medium", congestionScore: 55, avgWaitTime: 28, berthOccupancy: 80, yardUtilization: 75, craneProductivity: 26, vesselsAtAnchor: 18, vesselsAtBerth: 55, vesselsWaiting: 6, avgBerthWait: 20, trend: "stable", lastUpdated: "2024-01-15T09:30:00Z", coordinates: { lat: 30.0444, lng: 31.2357 }, timezone: "Africa/Cairo" },
  { unLoCode: "MAPTM", name: "Tanger Med", country: "Morocco", region: "Africa", congestionLevel: "low", congestionScore: 32, avgWaitTime: 10, berthOccupancy: 70, yardUtilization: 65, craneProductivity: 30, vesselsAtAnchor: 5, vesselsAtBerth: 42, vesselsWaiting: 1, avgBerthWait: 6, trend: "improving", lastUpdated: "2024-01-15T09:00:00Z", coordinates: { lat: 35.8595, lng: -5.5334 }, timezone: "Africa/Casablanca" },
  { unLoCode: "NGLOS", name: "Lagos (Apapa)", country: "Nigeria", region: "Africa", congestionLevel: "critical", congestionScore: 88, avgWaitTime: 96, berthOccupancy: 99, yardUtilization: 97, craneProductivity: 15, vesselsAtAnchor: 52, vesselsAtBerth: 28, vesselsWaiting: 22, avgBerthWait: 72, trend: "worsening", lastUpdated: "2024-01-15T08:30:00Z", coordinates: { lat: 6.4281, lng: 3.4219 }, timezone: "Africa/Lagos" },

  // Oceania
  { unLoCode: "AUSYD", name: "Sydney", country: "Australia", region: "Oceania", congestionLevel: "low", congestionScore: 32, avgWaitTime: 10, berthOccupancy: 70, yardUtilization: 65, craneProductivity: 27, vesselsAtAnchor: 5, vesselsAtBerth: 38, vesselsWaiting: 1, avgBerthWait: 6, trend: "stable", lastUpdated: "2024-01-15T10:00:00Z", coordinates: { lat: -33.8688, lng: 151.2093 }, timezone: "Australia/Sydney" },
  { unLoCode: "AUBNE", name: "Brisbane", country: "Australia", region: "Oceania", congestionLevel: "low", congestionScore: 28, avgWaitTime: 8, berthOccupancy: 68, yardUtilization: 62, craneProductivity: 28, vesselsAtAnchor: 4, vesselsAtBerth: 32, vesselsWaiting: 1, avgBerthWait: 5, trend: "improving", lastUpdated: "2024-01-15T09:30:00Z", coordinates: { lat: -27.4698, lng: 153.0251 }, timezone: "Australia/Brisbane" },
  { unLoCode: "AUMEL", name: "Melbourne", country: "Australia", region: "Oceania", congestionLevel: "medium", congestionScore: 48, avgWaitTime: 20, berthOccupancy: 78, yardUtilization: 74, craneProductivity: 26, vesselsAtAnchor: 12, vesselsAtBerth: 45, vesselsWaiting: 4, avgBerthWait: 14, trend: "stable", lastUpdated: "2024-01-15T09:00:00Z", coordinates: { lat: -37.8136, lng: 144.9631 }, timezone: "Australia/Melbourne" },
];

// Generate 30-day historical data
const generateHistoricalData = (currentScore: number, trend: string) => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    let score: number;
    if (trend === "improving") {
      score = Math.max(10, currentScore + Math.floor((i / 29) * 20) - 10);
    } else if (trend === "worsening") {
      score = Math.max(10, currentScore - Math.floor((i / 29) * 20) + 10);
    } else {
      score = currentScore + Math.floor((Math.random() - 0.5) * 10);
    }

    score = Math.max(10, Math.min(95, score + Math.floor((Math.random() - 0.5) * 8)));

    data.push({
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      congestionScore: score,
      waitTime: Math.floor(score * 0.7 + Math.random() * 10),
      berthOccupancy: Math.min(99, Math.max(50, 60 + score * 0.35 + Math.random() * 5)),
    });
  }

  return data;
};

// Generate 7-day prediction
const generatePrediction = (historicalData: { congestionScore: number }[], trend: string) => {
  const predictions = [];
  const lastScore = historicalData[historicalData.length - 1].congestionScore;
  const today = new Date();

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    let predictedScore: number;
    if (trend === "improving") {
      predictedScore = Math.max(10, lastScore - i * 2 + Math.random() * 5);
    } else if (trend === "worsening") {
      predictedScore = Math.min(95, lastScore + i * 3 + Math.random() * 5);
    } else {
      predictedScore = lastScore + (Math.random() - 0.5) * 10;
    }

    predictedScore = Math.max(10, Math.min(95, predictedScore));

    predictions.push({
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      predictedScore: Math.floor(predictedScore),
      confidence: Math.max(50, 90 - i * 5),
    });
  }

  return predictions;
};

// Get congestion color
const getCongestionColor = (level: CongestionLevel) => {
  switch (level) {
    case "low": return COLORS.low;
    case "medium": return COLORS.medium;
    case "high": return COLORS.high;
    case "critical": return COLORS.criticalLevel;
  }
};

// Get congestion badge variant
const getCongestionBadge = (level: CongestionLevel) => {
  switch (level) {
    case "low":
      return <Badge className="bg-green-500 text-white">Low</Badge>;
    case "medium":
      return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
    case "high":
      return <Badge className="bg-red-500 text-white">High</Badge>;
    case "critical":
      return <Badge className="bg-red-900 text-white animate-pulse">Critical</Badge>;
  }
};

// Gauge Chart Component
const CongestionGauge = ({ value, level }: { value: number; level: CongestionLevel }) => {
  const data = [
    { name: "congestion", value: value },
    { name: "remaining", value: 100 - value },
  ];

  const color = getCongestionColor(level);

  return (
    <div className="relative h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color }}>
            {value}
          </div>
          <div className="text-sm text-muted-foreground">Congestion Index</div>
        </div>
      </div>
    </div>
  );
};

// Alternative Port Card
const AlternativePortCard = ({ port, currentPort }: { port: PortCongestionData; currentPort: PortCongestionData }) => {
  const savings = currentPort.avgWaitTime - port.avgWaitTime;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-medium">{port.name}</h4>
            <p className="text-sm text-muted-foreground">{port.country}</p>
          </div>
          {getCongestionBadge(port.congestionLevel)}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Wait Time:</span>
            <span className="ml-1 font-medium">{port.avgWaitTime}h</span>
          </div>
          <div>
            <span className="text-muted-foreground">Berth:</span>
            <span className="ml-1 font-medium">{port.berthOccupancy}%</span>
          </div>
        </div>
        {savings > 0 && (
          <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
            <TrendingDown className="h-3 w-3" />
            <span>Save {savings}h vs current</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is port congestion and why does it matter?",
    answer: "Port congestion occurs when the number of vessels arriving at a port exceeds its capacity to handle them efficiently. This leads to longer wait times, delayed shipments, increased costs, and supply chain disruptions. Monitoring congestion helps shippers make informed decisions about routing and scheduling.",
  },
  {
    question: "How is the congestion index calculated?",
    answer: "The congestion index is a composite score (0-100) that considers multiple factors: berth occupancy rate, yard utilization, vessel waiting times, anchor time, and crane productivity. Higher scores indicate more severe congestion. The index is updated in real-time based on AIS data and port reports.",
  },
  {
    question: "What do the different congestion levels mean?",
    answer: "Low (0-34): Minimal delays, efficient operations. Medium (35-54): Some delays expected, plan for buffer time. High (55-69): Significant delays, consider alternative ports. Critical (70+): Severe congestion, expect major delays and consider rerouting shipments.",
  },
  {
    question: "How accurate are the 7-day forecasts?",
    answer: "Our AI-powered forecasts analyze historical patterns, scheduled vessel arrivals, weather data, and port operational capacity. Accuracy is highest for the first 2-3 days (85-90%) and decreases for longer forecasts. We recommend using predictions as guidance while monitoring real-time updates.",
  },
  {
    question: "How often is the data updated?",
    answer: "Port congestion data is updated every 15-30 minutes based on AIS transmissions and port authority reports. Historical trends are recalculated daily. Predictions are refreshed every hour to incorporate the latest vessel scheduling information.",
  },
  {
    question: "Can I set up alerts for specific ports?",
    answer: "Yes, you can configure custom alerts for congestion threshold breaches, trend changes, or wait time increases. Alerts can be delivered via email, SMS, or integrated into your supply chain management system through our API.",
  },
  {
    question: "What factors cause port congestion?",
    answer: "Common causes include: surge in container volumes, labor shortages, equipment breakdowns, weather disruptions, customs delays, vessel size increases, seasonal peaks, and infrastructure limitations. Our system monitors all these factors to provide comprehensive congestion analysis.",
  },
  {
    question: "How can I use this data to optimize my supply chain?",
    answer: "Use congestion data to: 1) Select optimal ports for your shipments, 2) Adjust lead times and buffer stock, 3) Plan alternative routing strategies, 4) Negotiate better terms with carriers, 5) Communicate accurate ETAs to customers, and 6) Identify emerging bottlenecks before they impact your operations.",
  },
];

// Global Stats Component
const GlobalStatsBar = () => {
  const stats = useMemo(() => {
    const totalPorts = PORTS_DATA.length;
    const criticalPorts = PORTS_DATA.filter(p => p.congestionLevel === "critical").length;
    const highPorts = PORTS_DATA.filter(p => p.congestionLevel === "high").length;
    const avgWaitTime = Math.round(PORTS_DATA.reduce((sum, p) => sum + p.avgWaitTime, 0) / totalPorts);
    const totalVesselsWaiting = PORTS_DATA.reduce((sum, p) => sum + p.vesselsWaiting, 0);
    const improvingPorts = PORTS_DATA.filter(p => p.trend === "improving").length;

    return { totalPorts, criticalPorts, highPorts, avgWaitTime, totalVesselsWaiting, improvingPorts };
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="h-4 w-4" style={{ color: COLORS.ocean }} />
          <span className="text-sm text-muted-foreground">Total Ports</span>
        </div>
        <p className="text-2xl font-bold" style={{ color: COLORS.ocean }}>{stats.totalPorts}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-muted-foreground">Critical</span>
        </div>
        <p className="text-2xl font-bold text-red-500">{stats.criticalPorts}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-muted-foreground">High</span>
        </div>
        <p className="text-2xl font-bold text-orange-500">{stats.highPorts}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4" style={{ color: COLORS.ocean }} />
          <span className="text-sm text-muted-foreground">Avg Wait</span>
        </div>
        <p className="text-2xl font-bold" style={{ color: COLORS.ocean }}>{stats.avgWaitTime}h</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <Ship className="h-4 w-4" style={{ color: COLORS.logistics }} />
          <span className="text-sm text-muted-foreground">Vessels Waiting</span>
        </div>
        <p className="text-2xl font-bold" style={{ color: COLORS.logistics }}>{stats.totalVesselsWaiting}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown className="h-4 w-4 text-green-500" />
          <span className="text-sm text-muted-foreground">Improving</span>
        </div>
        <p className="text-2xl font-bold text-green-500">{stats.improvingPorts}</p>
      </div>
    </div>
  );
};

// Regional Distribution Chart
const RegionalDistributionChart = () => {
  const regionalData = useMemo(() => {
    const regions = [...new Set(PORTS_DATA.map(p => p.region))];
    return regions.map(region => {
      const ports = PORTS_DATA.filter(p => p.region === region);
      return {
        name: region,
        avgCongestion: Math.round(ports.reduce((sum, p) => sum + p.congestionScore, 0) / ports.length),
        portCount: ports.length,
      };
    }).sort((a, b) => b.avgCongestion - a.avgCongestion);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={regionalData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-background border rounded-lg p-3 shadow-lg">
                  <p className="font-medium">{data.name}</p>
                  <p className="text-sm">Avg Congestion: <span className="font-bold">{data.avgCongestion}</span></p>
                  <p className="text-sm">Ports: <span className="font-bold">{data.portCount}</span></p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="avgCongestion" radius={[4, 4, 0, 0]}>
          {regionalData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.avgCongestion >= 70 ? COLORS.criticalLevel : entry.avgCongestion >= 55 ? COLORS.high : entry.avgCongestion >= 35 ? COLORS.medium : COLORS.low}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

// Congestion Level Distribution Pie Chart
const CongestionDistributionChart = () => {
  const distributionData = useMemo(() => {
    return [
      { name: "Low", value: PORTS_DATA.filter(p => p.congestionLevel === "low").length, fill: COLORS.low },
      { name: "Medium", value: PORTS_DATA.filter(p => p.congestionLevel === "medium").length, fill: COLORS.medium },
      { name: "High", value: PORTS_DATA.filter(p => p.congestionLevel === "high").length, fill: COLORS.high },
      { name: "Critical", value: PORTS_DATA.filter(p => p.congestionLevel === "critical").length, fill: COLORS.criticalLevel },
    ];
  }, []);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={distributionData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
        >
          {distributionData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-background border rounded-lg p-2 shadow-lg">
                  <p className="font-medium">{data.name}</p>
                  <p className="text-sm">{data.value} ports</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Efficiency Radial Chart
const EfficiencyRadialChart = ({ port }: { port: PortCongestionData }) => {
  const data = [
    { name: "Berth", value: port.berthOccupancy, fill: COLORS.ocean },
    { name: "Yard", value: port.yardUtilization, fill: COLORS.logistics },
    { name: "Crane", value: Math.min(100, (port.craneProductivity / 40) * 100), fill: COLORS.medium },
  ];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="30%"
        outerRadius="90%"
        data={data}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar
          background
          dataKey="value"
          cornerRadius={10}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-background border rounded-lg p-2 shadow-lg">
                  <p className="font-medium">{data.name}</p>
                  <p className="text-sm">{Math.round(data.value)}%</p>
                </div>
              );
            }
            return null;
          }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

interface PortCongestionMonitorProps {
  onPortSelect?: (port: PortCongestionData) => void;
}

export function PortCongestionMonitor({ onPortSelect }: PortCongestionMonitorProps) {
  const [selectedPortCode, setSelectedPortCode] = useState<string>("CNSHA");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Get selected port data
  const selectedPort = useMemo(() => {
    return PORTS_DATA.find((p) => p.unLoCode === selectedPortCode) || PORTS_DATA[0];
  }, [selectedPortCode]);

  // Generate historical and prediction data
  const historicalData = useMemo(() => {
    return generateHistoricalData(selectedPort.congestionScore, selectedPort.trend);
  }, [selectedPort]);

  const predictionData = useMemo(() => {
    return generatePrediction(historicalData, selectedPort.trend);
  }, [historicalData, selectedPort.trend]);

  // Get alternative ports (same region, lower congestion)
  const alternativePorts = useMemo(() => {
    return PORTS_DATA
      .filter((p) => p.region === selectedPort.region && p.unLoCode !== selectedPort.unLoCode)
      .filter((p) => p.congestionScore < selectedPort.congestionScore)
      .sort((a, b) => a.congestionScore - b.congestionScore)
      .slice(0, 4);
  }, [selectedPort]);

  // Filter ports by region
  const filteredPorts = useMemo(() => {
    if (selectedRegion === "all") return PORTS_DATA;
    return PORTS_DATA.filter((p) => p.region === selectedRegion);
  }, [selectedRegion]);

  // Port comparison data (top congested vs selected)
  const comparisonData = useMemo(() => {
    const topCongested = [...PORTS_DATA]
      .sort((a, b) => b.congestionScore - a.congestionScore)
      .slice(0, 10);

    if (!topCongested.find((p) => p.unLoCode === selectedPortCode)) {
      topCongested.pop();
      topCongested.push(selectedPort);
    }

    return topCongested;
  }, [selectedPortCode, selectedPort]);

  // Regions list
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(PORTS_DATA.map((p) => p.region))];
    return ["all", ...uniqueRegions];
  }, []);

  // Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      case "worsening":
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Format last updated time
  const formatLastUpdated = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div
        className="rounded-2xl p-8 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS.ocean} 0%, ${COLORS.logistics} 100%)`
        }}
      >
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Waves className="w-full h-full" />
        </div>
        <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
          <Ship className="w-full h-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Anchor className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Port Congestion Monitor</h1>
              <p className="text-white/80 text-lg">Real-time global port analytics & predictions</p>
            </div>
          </div>

          <p className="text-white/90 max-w-3xl mb-6">
            Monitor congestion levels across 55+ major global ports in real-time. Make data-driven decisions
            to optimize your supply chain, reduce delays, and identify alternative routing options.
          </p>

          {/* Quick Stats in Hero */}
          <GlobalStatsBar />

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="text-sm">Real-time Updates</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <Target className="h-5 w-5 text-green-300" />
              <span className="text-sm">AI Predictions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <LineChart className="h-5 w-5 text-blue-300" />
              <span className="text-sm">Historical Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
              <Globe className="h-5 w-5 text-purple-300" />
              <span className="text-sm">55+ Global Ports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-1 max-w-md">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === "all" ? "All Regions" : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 max-w-md">
            <Select value={selectedPortCode} onValueChange={setSelectedPortCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select a port" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-64">
                  {filteredPorts.map((port) => (
                    <SelectItem key={port.unLoCode} value={port.unLoCode}>
                      <div className="flex items-center gap-2">
                        <span>{port.name}</span>
                        <span className="text-muted-foreground text-xs">({port.country})</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="shrink-0"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Main Content Tabs - 5 Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Historical Trends</TabsTrigger>
          <TabsTrigger value="prediction">7-Day Forecast</TabsTrigger>
          <TabsTrigger value="comparison">Port Comparison</TabsTrigger>
          <TabsTrigger value="insights">Global Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Gauge & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" style={{ color: COLORS.ocean }} />
                    Congestion Level
                  </span>
                  {getCongestionBadge(selectedPort.congestionLevel)}
                </CardTitle>
                <CardDescription>
                  {selectedPort.name}, {selectedPort.country}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CongestionGauge value={selectedPort.congestionScore} level={selectedPort.congestionLevel} />

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(selectedPort.trend)}
                    <span className="capitalize">{selectedPort.trend}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatLastUpdated(selectedPort.lastUpdated)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Middle Column - Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Average Wait Time */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" style={{ color: COLORS.ocean }} />
                      <span className="text-sm">Avg. Wait Time</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPort.avgWaitTime}h</span>
                  </div>
                  <Progress value={(selectedPort.avgWaitTime / 100) * 100} className="h-2" />
                </div>

                {/* Berth Occupancy */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Anchor className="h-4 w-4" style={{ color: COLORS.logistics }} />
                      <span className="text-sm">Berth Occupancy</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPort.berthOccupancy}%</span>
                  </div>
                  <Progress
                    value={selectedPort.berthOccupancy}
                    className="h-2"
                  />
                </div>

                {/* Yard Utilization */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Container className="h-4 w-4" style={{ color: COLORS.ocean }} />
                      <span className="text-sm">Yard Utilization</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPort.yardUtilization}%</span>
                  </div>
                  <Progress value={selectedPort.yardUtilization} className="h-2" />
                </div>

                {/* Crane Productivity */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" style={{ color: COLORS.logistics }} />
                      <span className="text-sm">Crane Productivity</span>
                    </div>
                    <span className="font-bold text-lg">{selectedPort.craneProductivity} mph</span>
                  </div>
                  <Progress value={(selectedPort.craneProductivity / 40) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Vessel Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Vessel Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${COLORS.ocean}15` }}>
                    <Anchor className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.ocean }} />
                    <p className="text-2xl font-bold" style={{ color: COLORS.ocean }}>{selectedPort.vesselsAtAnchor}</p>
                    <p className="text-sm text-muted-foreground">At Anchor</p>
                  </div>
                  <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${COLORS.logistics}15` }}>
                    <Ship className="h-6 w-6 mx-auto mb-2" style={{ color: COLORS.logistics }} />
                    <p className="text-2xl font-bold" style={{ color: COLORS.logistics }}>{selectedPort.vesselsAtBerth}</p>
                    <p className="text-sm text-muted-foreground">At Berth</p>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Waiting for Berth</span>
                  </div>
                  <p className="text-3xl font-bold">{selectedPort.vesselsWaiting}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Avg. wait: {selectedPort.avgBerthWait} hours
                  </p>
                </div>

                {selectedPort.congestionLevel === "critical" && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-700 dark:text-red-400">Critical Alert</span>
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      Severe congestion detected. Consider alternative ports.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Alternative Ports */}
          {alternativePorts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Alternative Ports in {selectedPort.region}
                </CardTitle>
                <CardDescription>
                  Less congested alternatives with shorter wait times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {alternativePorts.map((port) => (
                    <AlternativePortCard key={port.unLoCode} port={port} currentPort={selectedPort} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mini Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                7-Day Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={historicalData.slice(-7)}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg">
                              <p className="font-medium">{label}</p>
                              <p className="text-sm" style={{ color: COLORS.ocean }}>
                                Congestion: {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="congestionScore"
                      stroke={COLORS.ocean}
                      strokeWidth={2}
                      dot={{ fill: COLORS.ocean }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historical Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" style={{ color: COLORS.ocean }} />
                30-Day Congestion History
              </CardTitle>
              <CardDescription>
                Historical congestion index and wait times for {selectedPort.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis yAxisId="left" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium mb-2">{label}</p>
                              <div className="space-y-1 text-sm">
                                <p>Congestion: <span className="font-medium">{data.congestionScore}</span></p>
                                <p>Wait Time: <span className="font-medium">{data.waitTime}h</span></p>
                                <p>Berth: <span className="font-medium">{Math.round(data.berthOccupancy)}%</span></p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="congestionScore"
                      fill={COLORS.ocean}
                      fillOpacity={0.2}
                      stroke={COLORS.ocean}
                      strokeWidth={2}
                      name="Congestion Index"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="waitTime"
                      stroke={COLORS.logistics}
                      strokeWidth={2}
                      dot={false}
                      name="Wait Time (h)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${COLORS.ocean}15` }}>
                  <p className="text-sm text-muted-foreground">Avg. Congestion</p>
                  <p className="text-xl font-bold" style={{ color: COLORS.ocean }}>
                    {Math.round(historicalData.reduce((sum, d) => sum + d.congestionScore, 0) / historicalData.length)}
                  </p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${COLORS.logistics}15` }}>
                  <p className="text-sm text-muted-foreground">Avg. Wait Time</p>
                  <p className="text-xl font-bold" style={{ color: COLORS.logistics }}>
                    {Math.round(historicalData.reduce((sum, d) => sum + d.waitTime, 0) / historicalData.length)}h
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Peak Congestion</p>
                  <p className="text-xl font-bold">
                    {Math.max(...historicalData.map((d) => d.congestionScore))}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Min Congestion</p>
                  <p className="text-xl font-bold">
                    {Math.min(...historicalData.map((d) => d.congestionScore))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prediction Tab */}
        <TabsContent value="prediction" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: COLORS.ocean }} />
                7-Day Congestion Forecast
              </CardTitle>
              <CardDescription>
                AI-powered prediction based on historical patterns and scheduling data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={[...historicalData.slice(-7), ...predictionData.map((d) => ({ ...d, congestionScore: d.predictedScore }))]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium mb-2">{data.date || label}</p>
                              <div className="space-y-1 text-sm">
                                {data.congestionScore && (
                                  <p>Actual: <span className="font-medium">{data.congestionScore}</span></p>
                                )}
                                {data.predictedScore && (
                                  <>
                                    <p style={{ color: COLORS.ocean }}>
                                      Predicted: <span className="font-medium">{data.predictedScore}</span>
                                    </p>
                                    <p className="text-muted-foreground">
                                      Confidence: {data.confidence}%
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="congestionScore"
                      stroke={COLORS.ocean}
                      strokeWidth={2}
                      dot={{ fill: COLORS.ocean }}
                      name="Historical"
                    />
                    <Line
                      type="monotone"
                      dataKey="predictedScore"
                      stroke={COLORS.logistics}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: COLORS.logistics }}
                      name="Predicted"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              {/* Prediction Cards */}
              <div className="grid grid-cols-7 gap-2 mt-6">
                {predictionData.map((day, idx) => {
                  let level: CongestionLevel = "low";
                  if (day.predictedScore >= 70) level = "critical";
                  else if (day.predictedScore >= 55) level = "high";
                  else if (day.predictedScore >= 35) level = "medium";

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg text-center"
                      style={{ backgroundColor: `${getCongestionColor(level)}15` }}
                    >
                      <p className="text-xs text-muted-foreground">{day.day}</p>
                      <p className="text-lg font-bold" style={{ color: getCongestionColor(level) }}>
                        {day.predictedScore}
                      </p>
                      <p className="text-xs text-muted-foreground">{day.confidence}% conf.</p>
                    </div>
                  );
                })}
              </div>

              {/* Disclaimer */}
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-semibold mb-1">About Predictions</p>
                    <p>
                      Predictions are based on historical patterns, vessel schedules, and current port conditions.
                      Actual conditions may vary. Confidence decreases for longer forecast periods.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Global Port Congestion Comparison
              </CardTitle>
              <CardDescription>
                Compare congestion levels across major world ports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={comparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-3 shadow-lg">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm text-muted-foreground">{data.country}</p>
                              <div className="mt-2 space-y-1 text-sm">
                                <p>Congestion: <span className="font-medium">{data.congestionScore}</span></p>
                                <p>Wait Time: <span className="font-medium">{data.avgWaitTime}h</span></p>
                                <p>Level: <span className="font-medium capitalize">{data.congestionLevel}</span></p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="congestionScore" radius={[0, 4, 4, 0]}>
                      {comparisonData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.unLoCode === selectedPortCode ? COLORS.ocean : getCongestionColor(entry.congestionLevel)}
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.low }} />
                  <span>Low (0-34)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.medium }} />
                  <span>Medium (35-54)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.high }} />
                  <span>High (55-69)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.criticalLevel }} />
                  <span>Critical (70+)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Regional Summary */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.filter((r) => r !== "all").map((region) => {
              const regionPorts = PORTS_DATA.filter((p) => p.region === region);
              const avgCongestion = Math.round(
                regionPorts.reduce((sum, p) => sum + p.congestionScore, 0) / regionPorts.length
              );
              const avgWait = Math.round(
                regionPorts.reduce((sum, p) => sum + p.avgWaitTime, 0) / regionPorts.length
              );
              const criticalCount = regionPorts.filter((p) => p.congestionLevel === "critical").length;

              return (
                <Card key={region}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{region}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold" style={{ color: COLORS.ocean }}>{avgCongestion}</p>
                        <p className="text-xs text-muted-foreground">Avg. Index</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold" style={{ color: COLORS.logistics }}>{avgWait}h</p>
                        <p className="text-xs text-muted-foreground">Avg. Wait</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-500">{criticalCount}</p>
                        <p className="text-xs text-muted-foreground">Critical</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Global Insights Tab - NEW 5th Tab */}
        <TabsContent value="insights" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Regional Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Regional Congestion Analysis
                </CardTitle>
                <CardDescription>Average congestion by region</CardDescription>
              </CardHeader>
              <CardContent>
                <RegionalDistributionChart />
              </CardContent>
            </Card>

            {/* Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Congestion Level Distribution
                </CardTitle>
                <CardDescription>Global port status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <CongestionDistributionChart />
              </CardContent>
            </Card>
          </div>

          {/* Port Efficiency Radial Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Port Efficiency Metrics
              </CardTitle>
              <CardDescription>Berth, yard, and crane utilization for {selectedPort.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <EfficiencyRadialChart port={selectedPort} />
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.ocean}15` }}>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.ocean }} />
                    <div>
                      <p className="font-medium">Berth Occupancy</p>
                      <p className="text-sm text-muted-foreground">{selectedPort.berthOccupancy}% of berths in use</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.logistics}15` }}>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.logistics }} />
                    <div>
                      <p className="font-medium">Yard Utilization</p>
                      <p className="text-sm text-muted-foreground">{selectedPort.yardUtilization}% of yard capacity used</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.medium}15` }}>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.medium }} />
                    <div>
                      <p className="font-medium">Crane Efficiency</p>
                      <p className="text-sm text-muted-foreground">{selectedPort.craneProductivity} moves per hour</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Ports to Avoid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Ports to Monitor Closely
              </CardTitle>
              <CardDescription>High congestion ports requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PORTS_DATA
                  .filter(p => p.congestionLevel === "critical" || p.congestionLevel === "high")
                  .sort((a, b) => b.congestionScore - a.congestionScore)
                  .slice(0, 6)
                  .map(port => (
                    <div
                      key={port.unLoCode}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedPortCode(port.unLoCode)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{port.name}</h4>
                          <p className="text-sm text-muted-foreground">{port.country}</p>
                        </div>
                        {getCongestionBadge(port.congestionLevel)}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{port.avgWaitTime}h wait</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(port.trend)}
                          <span className="capitalize">{port.trend}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                  <MapPin className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  <div className="text-left">
                    <p className="font-medium">Find Alternative Ports</p>
                    <p className="text-sm text-muted-foreground">Discover less congested options</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                  <Calendar className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  <div className="text-left">
                    <p className="font-medium">Schedule Analysis</p>
                    <p className="text-sm text-muted-foreground">Optimize arrival times</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                  <Activity className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  <div className="text-left">
                    <p className="font-medium">Set Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified on changes</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  <div className="text-left">
                    <p className="font-medium">Export Report</p>
                    <p className="text-sm text-muted-foreground">Download congestion data</p>
                  </div>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" style={{ color: COLORS.ocean }} />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Learn more about port congestion monitoring and how to use this tool effectively
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <span className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground py-4 border-t">
        <p>
          Data updated in real-time from AIS signals and port authority reports.
          <span className="mx-2">|</span>
          Last system update: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default PortCongestionMonitor;
