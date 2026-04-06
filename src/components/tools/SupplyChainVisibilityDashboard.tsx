"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Package,
  Warehouse,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  MapPin,
  Building2,
  Truck,
  Container,
  Calendar,
  ArrowRight,
  Bell,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Download,
  Eye,
  Globe,
  Navigation,
  Anchor,
  BoxIcon,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  Shield,
  AlertCircle,
  Info,
  ExternalLink,
  Zap,
  Layers,
  Users,
  DollarSign,
  Percent,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { format, parseISO, differenceInDays, addDays } from "date-fns";

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  oceanLight: "#3B7CB8",
  logisticsLight: "#4CAF7D",
  warning: "#F59E0B",
  danger: "#EF4444",
  critical: "#DC2626",
  neutral: "#6B7280",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

// Types
type ShipmentStatus = "in-transit" | "at-port" | "delivered" | "delayed" | "customs" | "loading";
type RiskLevel = "low" | "medium" | "high" | "critical";
type SupplierStatus = "active" | "at-risk" | "inactive" | "preferred";

interface Shipment {
  id: string;
  containerNumber: string;
  bookingNumber: string;
  carrier: string;
  origin: string;
  originPort: string;
  destination: string;
  destinationPort: string;
  eta: string;
  etd: string;
  status: ShipmentStatus;
  progress: number;
  cargoType: string;
  weight: string;
  value: string;
  route: string;
  lastUpdated: string;
  delayDays?: number;
  delayReason?: string;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  status: string;
  location: string;
  date: string;
  time: string;
  type: "departure" | "arrival" | "transit" | "customs" | "delivery" | "port" | "warehouse";
  completed: boolean;
}

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  quantity: number;
  reorderPoint: number;
  maxStock: number;
  status: "optimal" | "low" | "critical" | "overstock";
  value: number;
  leadTime: number;
  supplier: string;
}

interface Supplier {
  id: string;
  name: string;
  country: string;
  status: SupplierStatus;
  riskScore: number;
  onTimeDelivery: number;
  qualityRating: number;
  totalOrders: number;
  activeOrders: number;
  lastDelivery: string;
  category: string;
  leadTime: number;
}

interface RiskAlert {
  id: string;
  type: "shipment" | "inventory" | "supplier" | "route" | "customs";
  severity: RiskLevel;
  title: string;
  message: string;
  timestamp: string;
  source: string;
  acknowledged: boolean;
  action?: string;
}

interface KPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
  icon: typeof Ship;
}

// Sample Data
const SHIPMENTS: Shipment[] = [
  {
    id: "SHP001",
    containerNumber: "MSCU7654321",
    bookingNumber: "BK202401001",
    carrier: "MSC",
    origin: "Shanghai, China",
    originPort: "CNSHA",
    destination: "Los Angeles, USA",
    destinationPort: "USLAX",
    eta: "2024-03-15",
    etd: "2024-02-20",
    status: "in-transit",
    progress: 65,
    cargoType: "Electronics",
    weight: "22,500 kg",
    value: "$485,000",
    route: "Asia - North America",
    lastUpdated: "15 mins ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Shanghai Port", date: "2024-02-20", time: "14:00", type: "loading", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Shanghai Port", date: "2024-02-21", time: "08:00", type: "departure", completed: true },
      { id: "M3", status: "Transit - Pacific", location: "Pacific Ocean", date: "2024-03-01", time: "—", type: "transit", completed: true },
      { id: "M4", status: "Arriving at Port", location: "Los Angeles", date: "2024-03-15", time: "Est. 06:00", type: "arrival", completed: false },
      { id: "M5", status: "Customs Clearance", location: "Los Angeles", date: "Est. 2024-03-16", time: "—", type: "customs", completed: false },
      { id: "M6", status: "Delivery", location: "Distribution Center", date: "Est. 2024-03-18", time: "—", type: "delivery", completed: false },
    ],
  },
  {
    id: "SHP002",
    containerNumber: "MAEU1234567",
    bookingNumber: "BK202401002",
    carrier: "Maersk",
    origin: "Rotterdam, Netherlands",
    originPort: "NLRTM",
    destination: "New York, USA",
    destinationPort: "USNYC",
    eta: "2024-03-08",
    etd: "2024-02-22",
    status: "customs",
    progress: 85,
    cargoType: "Machinery",
    weight: "18,200 kg",
    value: "$320,000",
    route: "Europe - North America",
    lastUpdated: "2 hours ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Rotterdam Port", date: "2024-02-22", time: "10:00", type: "loading", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Rotterdam Port", date: "2024-02-23", time: "16:00", type: "departure", completed: true },
      { id: "M3", status: "Vessel Arrived", location: "New York Port", date: "2024-03-07", time: "14:00", type: "arrival", completed: true },
      { id: "M4", status: "Customs Clearance", location: "New York", date: "2024-03-08", time: "In Progress", type: "customs", completed: false },
      { id: "M5", status: "Delivery", location: "Warehouse", date: "Est. 2024-03-10", time: "—", type: "delivery", completed: false },
    ],
  },
  {
    id: "SHP003",
    containerNumber: "CMAU9876543",
    bookingNumber: "BK202401003",
    carrier: "CMA CGM",
    origin: "Hamburg, Germany",
    originPort: "DEHAM",
    destination: "Long Beach, USA",
    destinationPort: "USLGB",
    eta: "2024-03-01",
    etd: "2024-02-10",
    status: "delivered",
    progress: 100,
    cargoType: "Auto Parts",
    weight: "24,100 kg",
    value: "$275,000",
    route: "Europe - North America",
    lastUpdated: "1 day ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Hamburg Port", date: "2024-02-10", time: "09:00", type: "loading", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Hamburg Port", date: "2024-02-11", time: "12:00", type: "departure", completed: true },
      { id: "M3", status: "Vessel Arrived", location: "Long Beach", date: "2024-02-28", time: "08:00", type: "arrival", completed: true },
      { id: "M4", status: "Customs Cleared", location: "Long Beach", date: "2024-03-01", time: "10:00", type: "customs", completed: true },
      { id: "M5", status: "Delivered", location: "Distribution Center", date: "2024-03-01", time: "16:00", type: "delivery", completed: true },
    ],
  },
  {
    id: "SHP004",
    containerNumber: "COSU2468135",
    bookingNumber: "BK202401004",
    carrier: "COSCO",
    origin: "Shenzhen, China",
    originPort: "CNSZX",
    destination: "Rotterdam, Netherlands",
    destinationPort: "NLRTM",
    eta: "2024-03-25",
    etd: "2024-02-28",
    status: "delayed",
    progress: 40,
    cargoType: "Consumer Goods",
    weight: "28,800 kg",
    value: "$420,000",
    route: "Asia - Europe",
    lastUpdated: "4 hours ago",
    delayDays: 5,
    delayReason: "Port congestion at transshipment hub",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Shenzhen Port", date: "2024-02-28", time: "12:00", type: "loading", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Shenzhen Port", date: "2024-02-29", time: "06:00", type: "departure", completed: true },
      { id: "M3", status: "Delayed - Congestion", location: "Singapore Hub", date: "2024-03-05", time: "—", type: "transit", completed: true },
      { id: "M4", status: "In Transit", location: "Indian Ocean", date: "2024-03-10", time: "—", type: "transit", completed: false },
      { id: "M5", status: "Arriving at Port", location: "Rotterdam", date: "Est. 2024-03-30", time: "—", type: "arrival", completed: false },
      { id: "M6", status: "Delivery", location: "Warehouse", date: "Est. 2024-04-02", time: "—", type: "delivery", completed: false },
    ],
  },
  {
    id: "SHP005",
    containerNumber: "OOLU1357924",
    bookingNumber: "BK202401005",
    carrier: "ONE",
    origin: "Tokyo, Japan",
    originPort: "JPTYO",
    destination: "Singapore",
    destinationPort: "SGSIN",
    eta: "2024-03-10",
    etd: "2024-03-01",
    status: "at-port",
    progress: 92,
    cargoType: "Electronics",
    weight: "15,600 kg",
    value: "$580,000",
    route: "Asia - Asia",
    lastUpdated: "30 mins ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Tokyo Port", date: "2024-03-01", time: "08:00", type: "loading", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Tokyo Port", date: "2024-03-01", time: "20:00", type: "departure", completed: true },
      { id: "M3", status: "Vessel Arrived", location: "Singapore Port", date: "2024-03-10", time: "06:00", type: "arrival", completed: true },
      { id: "M4", status: "Awaiting Discharge", location: "Singapore Port", date: "2024-03-10", time: "In Queue", type: "port", completed: false },
      { id: "M5", status: "Delivery", location: "Warehouse", date: "Est. 2024-03-11", time: "—", type: "delivery", completed: false },
    ],
  },
];

const INVENTORY: InventoryItem[] = [
  { id: "INV001", sku: "SKU-001", name: "Electronic Components A", category: "Electronics", warehouse: "Shanghai DC", quantity: 450, reorderPoint: 200, maxStock: 1000, status: "optimal", value: 22500, leadTime: 14, supplier: "TechPro Ltd" },
  { id: "INV002", sku: "SKU-002", name: "Auto Parts B", category: "Auto Parts", warehouse: "LA DC", quantity: 120, reorderPoint: 150, maxStock: 500, status: "low", value: 36000, leadTime: 21, supplier: "AutoMax Inc" },
  { id: "INV003", sku: "SKU-003", name: "Consumer Goods C", category: "Consumer", warehouse: "Rotterdam Hub", quantity: 50, reorderPoint: 100, maxStock: 400, status: "critical", value: 7500, leadTime: 18, supplier: "GlobalTrade Co" },
  { id: "INV004", sku: "SKU-004", name: "Machinery Parts D", category: "Machinery", warehouse: "Singapore Hub", quantity: 850, reorderPoint: 300, maxStock: 600, status: "overstock", value: 127500, leadTime: 12, supplier: "MachineWorks" },
  { id: "INV005", sku: "SKU-005", name: "Raw Materials E", category: "Raw Materials", warehouse: "Shanghai DC", quantity: 280, reorderPoint: 200, maxStock: 800, status: "optimal", value: 42000, leadTime: 10, supplier: "RawSource Ltd" },
  { id: "INV006", sku: "SKU-006", name: "Packaging Materials F", category: "Packaging", warehouse: "LA DC", quantity: 95, reorderPoint: 100, maxStock: 500, status: "low", value: 4750, leadTime: 7, supplier: "PackRight Inc" },
  { id: "INV007", sku: "SKU-007", name: "Electronic Components G", category: "Electronics", warehouse: "Singapore Hub", quantity: 620, reorderPoint: 250, maxStock: 900, status: "optimal", value: 93000, leadTime: 16, supplier: "ElectroTech" },
  { id: "INV008", sku: "SKU-008", name: "Textile Products H", category: "Textiles", warehouse: "Rotterdam Hub", quantity: 30, reorderPoint: 80, maxStock: 300, status: "critical", value: 9000, leadTime: 25, supplier: "TextileWorld" },
];

const SUPPLIERS: Supplier[] = [
  { id: "SUP001", name: "TechPro Ltd", country: "China", status: "preferred", riskScore: 15, onTimeDelivery: 96.5, qualityRating: 98.2, totalOrders: 245, activeOrders: 12, lastDelivery: "2024-03-08", category: "Electronics", leadTime: 14 },
  { id: "SUP002", name: "AutoMax Inc", country: "Germany", status: "active", riskScore: 25, onTimeDelivery: 92.1, qualityRating: 95.8, totalOrders: 180, activeOrders: 8, lastDelivery: "2024-03-05", category: "Auto Parts", leadTime: 21 },
  { id: "SUP003", name: "GlobalTrade Co", country: "Vietnam", status: "at-risk", riskScore: 65, onTimeDelivery: 78.3, qualityRating: 85.4, totalOrders: 95, activeOrders: 5, lastDelivery: "2024-02-28", category: "Consumer", leadTime: 18 },
  { id: "SUP004", name: "MachineWorks", country: "Japan", status: "preferred", riskScore: 10, onTimeDelivery: 98.7, qualityRating: 99.1, totalOrders: 320, activeOrders: 15, lastDelivery: "2024-03-10", category: "Machinery", leadTime: 12 },
  { id: "SUP005", name: "RawSource Ltd", country: "India", status: "active", riskScore: 35, onTimeDelivery: 88.5, qualityRating: 91.2, totalOrders: 156, activeOrders: 7, lastDelivery: "2024-03-03", category: "Raw Materials", leadTime: 10 },
  { id: "SUP006", name: "PackRight Inc", country: "Thailand", status: "active", riskScore: 30, onTimeDelivery: 90.2, qualityRating: 93.5, totalOrders: 112, activeOrders: 4, lastDelivery: "2024-03-07", category: "Packaging", leadTime: 7 },
  { id: "SUP007", name: "ElectroTech", country: "South Korea", status: "preferred", riskScore: 12, onTimeDelivery: 97.8, qualityRating: 98.5, totalOrders: 289, activeOrders: 14, lastDelivery: "2024-03-09", category: "Electronics", leadTime: 16 },
  { id: "SUP008", name: "TextileWorld", country: "Bangladesh", status: "at-risk", riskScore: 72, onTimeDelivery: 72.4, qualityRating: 82.1, totalOrders: 68, activeOrders: 3, lastDelivery: "2024-02-20", category: "Textiles", leadTime: 25 },
];

const RISK_ALERTS: RiskAlert[] = [
  { id: "ALT001", type: "shipment", severity: "critical", title: "Shipment Severely Delayed", message: "Container COSU2468135 delayed by 5 days due to port congestion at Singapore hub", timestamp: "2 hours ago", source: "Carrier API", acknowledged: false, action: "Contact carrier for ETA update" },
  { id: "ALT002", type: "inventory", severity: "critical", title: "Critical Stock Level", message: "SKU-003 (Consumer Goods C) below reorder point. Current: 50 units, Reorder Point: 100", timestamp: "4 hours ago", source: "Inventory System", acknowledged: false, action: "Place emergency order" },
  { id: "ALT003", type: "supplier", severity: "high", title: "High-Risk Supplier Alert", message: "TextileWorld risk score increased to 72 (Critical). OTD dropped to 72.4%", timestamp: "6 hours ago", source: "Supplier Monitor", acknowledged: false, action: "Review supplier contract" },
  { id: "ALT004", type: "route", severity: "medium", title: "Route Disruption Warning", message: "Suez Canal transit delays affecting Asia-Europe routes. Average delay: 3-5 days", timestamp: "1 day ago", source: "Route Intelligence", acknowledged: true },
  { id: "ALT005", type: "customs", severity: "medium", title: "Customs Hold", message: "Container MAEU1234567 under customs inspection at New York. Additional documentation required", timestamp: "3 hours ago", source: "Customs Broker", acknowledged: false, action: "Submit required documents" },
  { id: "ALT006", type: "inventory", severity: "high", title: "Low Stock Alert", message: "SKU-006 (Packaging Materials) approaching reorder point. Current: 95 units", timestamp: "5 hours ago", source: "Inventory System", acknowledged: true, action: "Schedule replenishment order" },
  { id: "ALT007", type: "shipment", severity: "low", title: "ETA Update", message: "Container MSCU7654321 ETA revised to March 15 (2 days earlier than expected)", timestamp: "1 hour ago", source: "Carrier API", acknowledged: false },
  { id: "ALT008", type: "supplier", severity: "low", title: "New Preferred Supplier", message: "ElectroTech has been upgraded to Preferred status based on performance metrics", timestamp: "2 days ago", source: "Supplier Management", acknowledged: true },
];

const KPIS: KPI[] = [
  { name: "On-Time Delivery", value: 94.2, target: 95, unit: "%", trend: "up", change: 2.1, icon: Truck },
  { name: "Inventory Accuracy", value: 98.5, target: 99, unit: "%", trend: "up", change: 0.8, icon: Package },
  { name: "Supplier Performance", value: 89.3, target: 90, unit: "%", trend: "stable", change: 0.2, icon: Building2 },
  { name: "Order Fill Rate", value: 96.8, target: 98, unit: "%", trend: "up", change: 1.5, icon: BoxIcon },
  { name: "Transit Time Variance", value: 2.3, target: 2, unit: "days", trend: "down", change: -0.5, icon: Clock },
  { name: "Risk Score", value: 28, target: 25, unit: "", trend: "down", change: -3, icon: Shield },
];

// Trend data for charts
const TREND_DATA = [
  { month: "Jan", otd: 91.2, inventory: 97.5, suppliers: 85.3, fillRate: 94.2 },
  { month: "Feb", otd: 92.5, inventory: 97.8, suppliers: 86.1, fillRate: 95.0 },
  { month: "Mar", otd: 93.8, inventory: 98.1, suppliers: 87.5, fillRate: 95.8 },
  { month: "Apr", otd: 92.1, inventory: 97.9, suppliers: 88.2, fillRate: 95.5 },
  { month: "May", otd: 93.5, inventory: 98.3, suppliers: 88.8, fillRate: 96.2 },
  { month: "Jun", otd: 94.2, inventory: 98.5, suppliers: 89.3, fillRate: 96.8 },
];

const ROUTE_PERFORMANCE = [
  { route: "Asia - NA", shipments: 45, avgDays: 22, onTime: 92, cost: 3200 },
  { route: "Asia - EU", shipments: 38, avgDays: 28, onTime: 88, cost: 2800 },
  { route: "EU - NA", shipments: 22, avgDays: 14, onTime: 95, cost: 2100 },
  { route: "Asia - Asia", shipments: 35, avgDays: 7, onTime: 97, cost: 850 },
  { route: "Intra-EU", shipments: 18, avgDays: 5, onTime: 98, cost: 650 },
];

// Status configs
const SHIPMENT_STATUS_CONFIG: Record<ShipmentStatus, { color: string; bgColor: string; label: string }> = {
  "in-transit": { color: COLORS.ocean, bgColor: `${COLORS.ocean}15`, label: "In Transit" },
  "at-port": { color: COLORS.logistics, bgColor: `${COLORS.logistics}15`, label: "At Port" },
  "delivered": { color: COLORS.logistics, bgColor: `${COLORS.logistics}15`, label: "Delivered" },
  "delayed": { color: COLORS.danger, bgColor: `${COLORS.danger}15`, label: "Delayed" },
  "customs": { color: COLORS.warning, bgColor: `${COLORS.warning}15`, label: "Customs" },
  "loading": { color: COLORS.purple, bgColor: `${COLORS.purple}15`, label: "Loading" },
};

const INVENTORY_STATUS_CONFIG: Record<string, { color: string; bgColor: string; label: string }> = {
  optimal: { color: COLORS.logistics, bgColor: `${COLORS.logistics}15`, label: "Optimal" },
  low: { color: COLORS.warning, bgColor: `${COLORS.warning}15`, label: "Low" },
  critical: { color: COLORS.danger, bgColor: `${COLORS.danger}15`, label: "Critical" },
  overstock: { color: COLORS.purple, bgColor: `${COLORS.purple}15`, label: "Overstock" },
};

const SUPPLIER_STATUS_CONFIG: Record<SupplierStatus, { color: string; bgColor: string; label: string }> = {
  preferred: { color: COLORS.logistics, bgColor: `${COLORS.logistics}15`, label: "Preferred" },
  active: { color: COLORS.ocean, bgColor: `${COLORS.ocean}15`, label: "Active" },
  "at-risk": { color: COLORS.warning, bgColor: `${COLORS.warning}15`, label: "At Risk" },
  inactive: { color: COLORS.neutral, bgColor: `${COLORS.neutral}15`, label: "Inactive" },
};

const RISK_SEVERITY_CONFIG: Record<RiskLevel, { color: string; bgColor: string; icon: typeof AlertTriangle }> = {
  low: { color: COLORS.logistics, bgColor: `${COLORS.logistics}15`, icon: Info },
  medium: { color: COLORS.warning, bgColor: `${COLORS.warning}15`, icon: AlertCircle },
  high: { color: "#F97316", bgColor: "#F9731615", icon: AlertTriangle },
  critical: { color: COLORS.danger, bgColor: `${COLORS.danger}15`, icon: AlertTriangle },
};

// Helper functions
const formatDate = (dateStr: string) => {
  try {
    return format(parseISO(dateStr.replace("Est. ", "")), "MMM dd, yyyy");
  } catch {
    return dateStr;
  }
};

const getRiskColor = (score: number): string => {
  if (score <= 20) return COLORS.logistics;
  if (score <= 40) return COLORS.ocean;
  if (score <= 60) return COLORS.warning;
  return COLORS.danger;
};

// Components
function KPICard({ kpi }: { kpi: KPI }) {
  const Icon = kpi.icon;
  const progressPercent = kpi.unit === "days" 
    ? ((kpi.target - kpi.value + 5) / 5) * 100 
    : (kpi.value / kpi.target) * 100;
  const isGood = kpi.unit === "days" ? kpi.value <= kpi.target : kpi.value >= kpi.target;

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS.ocean}15` }}>
              <Icon className="h-4 w-4" style={{ color: COLORS.ocean }} />
            </div>
            <span className="text-sm font-medium">{kpi.name}</span>
          </div>
          {kpi.trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-[var(--logistics)]" />
          ) : kpi.trend === "down" ? (
            <TrendingDown className="h-4 w-4 text-red-500" />
          ) : (
            <Activity className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-2xl font-bold" style={{ color: isGood ? COLORS.logistics : COLORS.warning }}>
              {kpi.value}{kpi.unit}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Target: {kpi.target}{kpi.unit}</span>
        </div>
        <Progress value={Math.min(progressPercent, 100)} className="h-1.5" />
        <div className="flex items-center gap-1 mt-2 text-xs">
          <span style={{ color: kpi.change > 0 ? COLORS.logistics : COLORS.danger }}>
            {kpi.change > 0 ? "+" : ""}{kpi.change}{kpi.unit === "%" ? "%" : kpi.unit}
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ShipmentCard({ shipment, onClick }: { shipment: Shipment; onClick: () => void }) {
  const config = SHIPMENT_STATUS_CONFIG[shipment.status];

  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold text-sm">{shipment.containerNumber}</span>
              <Badge variant="outline" style={{ borderColor: config.color, color: config.color }}>
                {shipment.carrier}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{shipment.bookingNumber}</p>
          </div>
          <Badge style={{ backgroundColor: config.color, color: "white" }}>
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm mb-3">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="truncate text-xs">{shipment.origin}</span>
          <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="truncate text-xs">{shipment.destination}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">ETA: {formatDate(shipment.eta)}</span>
            <span className="font-medium">{shipment.value}</span>
          </div>
          <Progress value={shipment.progress} className="h-1.5" />
        </div>

        {shipment.status === "delayed" && shipment.delayReason && (
          <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
            <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
            <span>Delayed {shipment.delayDays} days: {shipment.delayReason}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="relative">
      {milestones.map((milestone, index) => {
        const isLast = index === milestones.length - 1;
        const Icon = milestone.type === "departure" ? Ship : 
                     milestone.type === "arrival" ? Anchor :
                     milestone.type === "customs" ? Building2 :
                     milestone.type === "delivery" ? Truck :
                     milestone.type === "warehouse" ? Warehouse : Navigation;

        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative flex gap-3 pb-4"
          >
            {!isLast && (
              <div
                className={`absolute left-[14px] top-8 w-0.5 h-full ${
                  milestone.completed ? "bg-[var(--logistics)]" : "bg-muted"
                }`}
              />
            )}
            <div
              className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                milestone.completed
                  ? "bg-[var(--logistics)] text-white"
                  : "bg-muted text-muted-foreground border border-dashed border-muted-foreground/30"
              }`}
            >
              {milestone.completed ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Icon className="h-3 w-3" />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium text-sm">{milestone.status}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{milestone.location}</span>
                  </div>
                </div>
                <div className="text-right text-xs shrink-0">
                  <div className={milestone.completed ? "font-medium" : "text-muted-foreground"}>
                    {milestone.date.replace("Est. ", "")}
                  </div>
                  <div className="text-muted-foreground text-xs">{milestone.time}</div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function InventoryCard({ item }: { item: InventoryItem }) {
  const config = INVENTORY_STATUS_CONFIG[item.status];
  const fillPercent = (item.quantity / item.maxStock) * 100;

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-medium text-sm">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.sku}</div>
          </div>
          <Badge style={{ backgroundColor: config.bgColor, color: config.color }}>
            {config.label}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-medium">{item.quantity} / {item.maxStock}</span>
          </div>
          <Progress value={fillPercent} className="h-1.5" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Reorder Point</span>
            <span>{item.reorderPoint}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Value</span>
            <span className="font-medium">${item.value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Warehouse</span>
            <span>{item.warehouse}</span>
          </div>
        </div>
        {item.status === "critical" && (
          <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-950/30 text-xs text-red-700 dark:text-red-400">
            Immediate reorder required
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const config = SUPPLIER_STATUS_CONFIG[supplier.status];

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-medium text-sm">{supplier.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              {supplier.country}
            </div>
          </div>
          <Badge style={{ backgroundColor: config.bgColor, color: config.color }}>
            {config.label}
          </Badge>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Risk Score</span>
            <span className="font-medium" style={{ color: getRiskColor(supplier.riskScore) }}>
              {supplier.riskScore}
            </span>
          </div>
          <Progress value={100 - supplier.riskScore} className="h-1.5" />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">OTD</span>
            <div className="font-medium">{supplier.onTimeDelivery}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Quality</span>
            <div className="font-medium">{supplier.qualityRating}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Active Orders</span>
            <div className="font-medium">{supplier.activeOrders}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Lead Time</span>
            <div className="font-medium">{supplier.leadTime} days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskAlertCard({ alert, onAcknowledge }: { alert: RiskAlert; onAcknowledge: () => void }) {
  const config = RISK_SEVERITY_CONFIG[alert.severity];
  const Icon = config.icon;

  return (
    <div
      className={`p-3 rounded-lg border ${
        alert.severity === "critical" ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" :
        alert.severity === "high" ? "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800" :
        alert.severity === "medium" ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800" :
        "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
      } ${!alert.acknowledged ? "ring-2 ring-[var(--ocean)]/20" : ""}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 shrink-0" style={{ color: config.color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">{alert.title}</span>
            {!alert.acknowledged && (
              <Badge variant="outline" className="text-xs">New</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{alert.timestamp}</span>
            <span>•</span>
            <span>{alert.source}</span>
          </div>
          {alert.action && !alert.acknowledged && (
            <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" onClick={onAcknowledge}>
              {alert.action}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Component
export function SupplyChainVisibilityDashboard() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [alerts, setAlerts] = useState<RiskAlert[]>(RISK_ALERTS);
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate status counts
  const shipmentStatusCounts = useMemo(() => {
    const counts: Record<ShipmentStatus, number> = {
      "in-transit": 0, "at-port": 0, "delivered": 0, "delayed": 0, "customs": 0, "loading": 0
    };
    SHIPMENTS.forEach(s => counts[s.status]++);
    return counts;
  }, []);

  // Calculate inventory status counts
  const inventoryStatusCounts = useMemo(() => {
    const counts = { optimal: 0, low: 0, critical: 0, overstock: 0 };
    INVENTORY.forEach(i => counts[i.status as keyof typeof counts]++);
    return counts;
  }, []);

  // Filter shipments
  const filteredShipments = useMemo(() => {
    return SHIPMENTS.filter(shipment => {
      if (searchQuery && !shipment.containerNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !shipment.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (statusFilter !== "all" && shipment.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [searchQuery, statusFilter]);

  // Acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  };

  // Pie chart data for inventory
  const inventoryPieData = [
    { name: "Optimal", value: inventoryStatusCounts.optimal, color: COLORS.logistics },
    { name: "Low", value: inventoryStatusCounts.low, color: COLORS.warning },
    { name: "Critical", value: inventoryStatusCounts.critical, color: COLORS.danger },
    { name: "Overstock", value: inventoryStatusCounts.overstock, color: COLORS.purple },
  ];

  // Total inventory value
  const totalInventoryValue = INVENTORY.reduce((sum, item) => sum + item.value, 0);
  const activeShipmentsValue = SHIPMENTS.filter(s => s.status !== "delivered").length;
  const criticalAlerts = alerts.filter(a => !a.acknowledged && (a.severity === "critical" || a.severity === "high")).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-7 w-7 text-[var(--ocean)]" />
            Supply Chain Visibility Dashboard
          </h1>
          <p className="text-muted-foreground">End-to-end visibility across your global supply chain</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button className="bg-[var(--ocean)] hover:bg-[var(--ocean-dark)]">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
            {criticalAlerts > 0 && (
              <Badge className="ml-2 bg-red-500">{criticalAlerts}</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPIS.map(kpi => (
          <KPICard key={kpi.name} kpi={kpi} />
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[var(--ocean)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                <Ship className="h-5 w-5 text-[var(--ocean)]" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeShipmentsValue}</div>
                <div className="text-sm text-muted-foreground">Active Shipments</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[var(--logistics)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--logistics)]/10">
                <Package className="h-5 w-5 text-[var(--logistics)]" />
              </div>
              <div>
                <div className="text-2xl font-bold">${(totalInventoryValue / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">Inventory Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-[var(--warning)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--warning)]/10">
                <Users className="h-5 w-5 text-[var(--warning)]" />
              </div>
              <div>
                <div className="text-2xl font-bold">{SUPPLIERS.length}</div>
                <div className="text-sm text-muted-foreground">Active Suppliers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{criticalAlerts}</div>
                <div className="text-sm text-muted-foreground">Critical Alerts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Shipment Status & Alerts */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Shipment Status Cards */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-[var(--ocean)]" />
                  Shipment Status Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {(Object.keys(shipmentStatusCounts) as ShipmentStatus[]).map(status => {
                    const config = SHIPMENT_STATUS_CONFIG[status];
                    const count = shipmentStatusCounts[status];
                    return (
                      <div key={status} className="text-center p-3 rounded-lg" style={{ backgroundColor: config.bgColor }}>
                        <div className="text-2xl font-bold" style={{ color: config.color }}>{count}</div>
                        <div className="text-xs text-muted-foreground">{config.label}</div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Recent Shipments */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Recent Active Shipments</h4>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SHIPMENTS.slice(0, 4).map(shipment => (
                      <ShipmentCard 
                        key={shipment.id} 
                        shipment={shipment} 
                        onClick={() => setSelectedShipment(shipment)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-[var(--ocean)]" />
                  Risk Alerts
                </CardTitle>
                <CardDescription>
                  {alerts.filter(a => !a.acknowledged).length} unacknowledged
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {alerts.slice(0, 5).map(alert => (
                      <RiskAlertCard 
                        key={alert.id} 
                        alert={alert} 
                        onAcknowledge={() => acknowledgeAlert(alert.id)}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Trend Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={TREND_DATA}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="fillRate" name="Fill Rate %" stroke={COLORS.logistics} fill={COLORS.logistics} fillOpacity={0.2} />
                      <Line type="monotone" dataKey="otd" name="OTD %" stroke={COLORS.ocean} strokeWidth={2} dot={{ fill: COLORS.ocean }} />
                      <Line type="monotone" dataKey="suppliers" name="Supplier Perf %" stroke={COLORS.warning} strokeWidth={2} dot={{ fill: COLORS.warning }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Inventory Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inventoryPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {inventoryPieData.map((entry, index) => (
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
          </div>
        </TabsContent>

        {/* Shipments Tab */}
        <TabsContent value="shipments" className="space-y-6 mt-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by container or booking number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {(Object.keys(SHIPMENT_STATUS_CONFIG) as ShipmentStatus[]).map(status => (
                      <SelectItem key={status} value={status}>
                        {SHIPMENT_STATUS_CONFIG[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Shipments Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShipments.map(shipment => (
              <ShipmentCard 
                key={shipment.id} 
                shipment={shipment} 
                onClick={() => setSelectedShipment(shipment)}
              />
            ))}
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6 mt-6">
          {/* Inventory Summary */}
          <div className="grid sm:grid-cols-4 gap-4">
            {Object.entries(inventoryStatusCounts).map(([status, count]) => {
              const config = INVENTORY_STATUS_CONFIG[status];
              return (
                <Card key={status}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: config.bgColor }}>
                        <Package className="h-4 w-4" style={{ color: config.color }} />
                      </div>
                      <div>
                        <div className="text-xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground">{config.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Inventory Items */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INVENTORY.map(item => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-6 mt-6">
          {/* Supplier Summary */}
          <div className="grid sm:grid-cols-4 gap-4">
            {Object.entries(SUPPLIER_STATUS_CONFIG).map(([status, config]) => {
              const count = SUPPLIERS.filter(s => s.status === status).length;
              return (
                <Card key={status}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: config.bgColor }}>
                        <Building2 className="h-4 w-4" style={{ color: config.color }} />
                      </div>
                      <div>
                        <div className="text-xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground">{config.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Supplier Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SUPPLIERS.map(supplier => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6 mt-6">
          {/* Alert Summary */}
          <div className="grid sm:grid-cols-4 gap-4">
            {(["critical", "high", "medium", "low"] as RiskLevel[]).map(severity => {
              const config = RISK_SEVERITY_CONFIG[severity];
              const count = alerts.filter(a => a.severity === severity && !a.acknowledged).length;
              return (
                <Card key={severity}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: config.bgColor }}>
                        <AlertTriangle className="h-4 w-4" style={{ color: config.color }} />
                      </div>
                      <div>
                        <div className="text-xl font-bold">{count}</div>
                        <div className="text-sm text-muted-foreground capitalize">{severity}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Alert List */}
          <Card>
            <CardHeader>
              <CardTitle>All Risk Alerts</CardTitle>
              <CardDescription>Monitor and manage supply chain risks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map(alert => (
                  <RiskAlertCard 
                    key={alert.id} 
                    alert={alert} 
                    onAcknowledge={() => acknowledgeAlert(alert.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-[var(--ocean)]" />
                Route Performance
              </CardTitle>
              <CardDescription>Performance metrics by trade lane</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ROUTE_PERFORMANCE} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="route" type="category" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="shipments" name="Shipments" fill={COLORS.ocean} radius={[0, 4, 4, 0]} />
                    <Bar dataKey="onTime" name="On-Time %" fill={COLORS.logistics} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Route Details Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Route</th>
                      <th className="text-center py-3 px-4">Shipments</th>
                      <th className="text-center py-3 px-4">Avg Transit</th>
                      <th className="text-center py-3 px-4">On-Time %</th>
                      <th className="text-center py-3 px-4">Avg Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROUTE_PERFORMANCE.map(route => (
                      <tr key={route.route} className="border-b">
                        <td className="py-3 px-4 font-medium">{route.route}</td>
                        <td className="text-center py-3 px-4">{route.shipments}</td>
                        <td className="text-center py-3 px-4">{route.avgDays} days</td>
                        <td className="text-center py-3 px-4">
                          <Badge style={{ backgroundColor: route.onTime >= 95 ? COLORS.logistics : route.onTime >= 90 ? COLORS.ocean : COLORS.warning }}>
                            {route.onTime}%
                          </Badge>
                        </td>
                        <td className="text-center py-3 px-4">${route.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Shipment Detail Dialog */}
      <Dialog open={!!selectedShipment} onOpenChange={() => setSelectedShipment(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Container className="h-5 w-5 text-[var(--ocean)]" />
              Shipment Details
            </DialogTitle>
            <DialogDescription>
              {selectedShipment?.containerNumber} - {selectedShipment?.bookingNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <Badge style={{ backgroundColor: SHIPMENT_STATUS_CONFIG[selectedShipment.status].color, color: "white" }} className="text-sm py-1 px-3">
                  {SHIPMENT_STATUS_CONFIG[selectedShipment.status].label}
                </Badge>
                <span className="text-sm text-muted-foreground">Last updated: {selectedShipment.lastUpdated}</span>
              </div>

              {/* Route Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Origin</div>
                  <div className="font-medium">{selectedShipment.origin}</div>
                  <div className="text-sm text-muted-foreground">{selectedShipment.originPort}</div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground mb-1">Destination</div>
                  <div className="font-medium">{selectedShipment.destination}</div>
                  <div className="text-sm text-muted-foreground">{selectedShipment.destinationPort}</div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Carrier</span>
                  <div className="font-medium">{selectedShipment.carrier}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Cargo Type</span>
                  <div className="font-medium">{selectedShipment.cargoType}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Weight</span>
                  <div className="font-medium">{selectedShipment.weight}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Value</span>
                  <div className="font-medium">{selectedShipment.value}</div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="font-medium">{selectedShipment.progress}%</span>
                </div>
                <Progress value={selectedShipment.progress} className="h-2" />
              </div>

              {/* Dates */}
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>ETD: {formatDate(selectedShipment.etd)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>ETA: {formatDate(selectedShipment.eta)}</span>
                </div>
              </div>

              {/* Milestones */}
              <div>
                <h4 className="font-medium mb-4">Milestones Timeline</h4>
                <MilestoneTimeline milestones={selectedShipment.milestones} />
              </div>

              {/* Delay Info */}
              {selectedShipment.status === "delayed" && selectedShipment.delayReason && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-medium mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    Delay Alert
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    This shipment is delayed by {selectedShipment.delayDays} days. Reason: {selectedShipment.delayReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
