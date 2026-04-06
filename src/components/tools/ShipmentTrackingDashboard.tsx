"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Container,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Anchor,
  Navigation,
  Search,
  Calendar,
  Package,
  Building2,
  ArrowRight,
  RefreshCw,
  Info,
  AlertTriangle,
  Bell,
  Globe,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  ExternalLink,
  Plane,
  Route,
  Box,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Map,
  Layers,
  ZoomIn,
  ZoomOut,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { DateRange } from "react-day-picker";

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
};

// Shipment status types
type ShipmentStatus = "in-transit" | "at-port" | "delivered" | "delayed" | "customs";

// Milestone interface
interface Milestone {
  id: string;
  status: string;
  location: string;
  date: string;
  time: string;
  type: "departure" | "arrival" | "transit" | "customs" | "delivery" | "port";
  completed: boolean;
}

// Shipment interface
interface Shipment {
  id: string;
  containerNumber: string;
  bookingNumber: string;
  billOfLading: string;
  vessel: string;
  voyage: string;
  carrier: string;
  carrierLogo: string;
  origin: string;
  originPort: string;
  destination: string;
  destinationPort: string;
  eta: string;
  etd: string;
  ata?: string;
  status: ShipmentStatus;
  progress: number;
  cargoType: string;
  weight: string;
  volume: string;
  milestones: Milestone[];
  route: string;
  lastUpdated: string;
  delayReason?: string;
  delayedDays?: number;
}

// Alert interface
interface ShipmentAlert {
  id: string;
  shipmentId: string;
  type: "warning" | "critical" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Carrier integration placeholder
interface CarrierIntegration {
  name: string;
  code: string;
  connected: boolean;
  lastSync: string;
  apiStatus: "online" | "offline" | "maintenance";
}

// Mock data
const CARRIER_INTEGRATIONS: CarrierIntegration[] = [
  { name: "MSC", code: "MSCU", connected: true, lastSync: "5 mins ago", apiStatus: "online" },
  { name: "Maersk", code: "MAEU", connected: true, lastSync: "10 mins ago", apiStatus: "online" },
  { name: "CMA CGM", code: "CMAU", connected: true, lastSync: "15 mins ago", apiStatus: "online" },
  { name: "COSCO", code: "COSU", connected: true, lastSync: "20 mins ago", apiStatus: "online" },
  { name: "Hapag-Lloyd", code: "HLCU", connected: false, lastSync: "N/A", apiStatus: "offline" },
  { name: "ONE", code: "OOLU", connected: true, lastSync: "8 mins ago", apiStatus: "online" },
  { name: "Evergreen", code: "EGSU", connected: true, lastSync: "12 mins ago", apiStatus: "online" },
  { name: "Yang Ming", code: "YMLU", connected: false, lastSync: "N/A", apiStatus: "maintenance" },
];

// Sample shipments data
const SHIPMENTS: Shipment[] = [
  {
    id: "SHP001",
    containerNumber: "MSCU1234567",
    bookingNumber: "BK2024001234",
    billOfLading: "BL2024001234",
    vessel: "MSC GÜLSÜN",
    voyage: "V.245E",
    carrier: "MSC",
    carrierLogo: "MSC",
    origin: "Shanghai, China",
    originPort: "CNSHA",
    destination: "Los Angeles, USA",
    destinationPort: "USLAX",
    eta: "2024-02-15",
    etd: "2024-01-20",
    status: "in-transit",
    progress: 65,
    cargoType: "FCL",
    weight: "24,500 kg",
    volume: "67 CBM",
    route: "Asia - North America",
    lastUpdated: "10 mins ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Shanghai Port, China", date: "2024-01-20", time: "14:30", type: "departure", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Shanghai Port, China", date: "2024-01-21", time: "08:00", type: "departure", completed: true },
      { id: "M3", status: "Transit - Pacific Ocean", location: "Pacific Ocean", date: "2024-01-28", time: "—", type: "transit", completed: true },
      { id: "M4", status: "Arriving at Port", location: "Los Angeles Port, USA", date: "2024-02-15", time: "Est. 06:00", type: "arrival", completed: false },
      { id: "M5", status: "Customs Clearance", location: "Los Angeles, USA", date: "Est. 2024-02-16", time: "—", type: "customs", completed: false },
      { id: "M6", status: "Out for Delivery", location: "Los Angeles, USA", date: "Est. 2024-02-18", time: "—", type: "delivery", completed: false },
    ],
  },
  {
    id: "SHP002",
    containerNumber: "MAEU7654321",
    bookingNumber: "BK2024005678",
    billOfLading: "BL2024005678",
    vessel: "MAERSK EDINBURGH",
    voyage: "V.128S",
    carrier: "Maersk",
    carrierLogo: "Maersk",
    origin: "Rotterdam, Netherlands",
    originPort: "NLRTM",
    destination: "New York, USA",
    destinationPort: "USNYC",
    eta: "2024-02-10",
    etd: "2024-01-25",
    ata: "2024-02-08",
    status: "customs",
    progress: 85,
    cargoType: "FCL",
    weight: "18,200 kg",
    volume: "45 CBM",
    route: "Europe - North America",
    lastUpdated: "2 hours ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Rotterdam Port, Netherlands", date: "2024-01-25", time: "10:00", type: "departure", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Rotterdam Port, Netherlands", date: "2024-01-26", time: "18:30", type: "departure", completed: true },
      { id: "M3", status: "Vessel Arrived", location: "New York Port, USA", date: "2024-02-08", time: "14:00", type: "arrival", completed: true },
      { id: "M4", status: "Container Discharged", location: "New York Port, USA", date: "2024-02-09", time: "08:30", type: "port", completed: true },
      { id: "M5", status: "Customs Clearance", location: "New York, USA", date: "2024-02-10", time: "In Progress", type: "customs", completed: false },
      { id: "M6", status: "Out for Delivery", location: "New York, USA", date: "Est. 2024-02-12", time: "—", type: "delivery", completed: false },
    ],
  },
  {
    id: "SHP003",
    containerNumber: "CMAU9876543",
    bookingNumber: "BK2024009012",
    billOfLading: "BL2024009012",
    vessel: "CMA CGM MARCO POLO",
    voyage: "V.052W",
    carrier: "CMA CGM",
    carrierLogo: "CMA CGM",
    origin: "Hamburg, Germany",
    originPort: "DEHAM",
    destination: "Long Beach, USA",
    destinationPort: "USLGB",
    eta: "2024-02-05",
    etd: "2024-01-10",
    status: "delivered",
    progress: 100,
    cargoType: "FCL",
    weight: "22,100 kg",
    volume: "58 CBM",
    route: "Europe - North America",
    lastUpdated: "1 day ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Hamburg Port, Germany", date: "2024-01-10", time: "09:00", type: "departure", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Hamburg Port, Germany", date: "2024-01-11", time: "16:00", type: "departure", completed: true },
      { id: "M3", status: "Vessel Arrived", location: "Long Beach Port, USA", date: "2024-02-03", time: "08:00", type: "arrival", completed: true },
      { id: "M4", status: "Container Discharged", location: "Long Beach Port, USA", date: "2024-02-03", time: "14:00", type: "port", completed: true },
      { id: "M5", status: "Customs Cleared", location: "Long Beach, USA", date: "2024-02-04", time: "10:00", type: "customs", completed: true },
      { id: "M6", status: "Delivered", location: "Los Angeles, USA", date: "2024-02-05", time: "15:30", type: "delivery", completed: true },
    ],
  },
  {
    id: "SHP004",
    containerNumber: "COSU2468135",
    bookingNumber: "BK2024003456",
    billOfLading: "BL2024003456",
    vessel: "COSCO SHIPPING UNIVERSE",
    voyage: "V.089E",
    carrier: "COSCO",
    carrierLogo: "COSCO",
    origin: "Shenzhen, China",
    originPort: "CNSZX",
    destination: "Rotterdam, Netherlands",
    destinationPort: "NLRTM",
    eta: "2024-02-20",
    etd: "2024-01-28",
    status: "delayed",
    progress: 45,
    cargoType: "FCL",
    weight: "26,800 kg",
    volume: "72 CBM",
    route: "Asia - Europe",
    lastUpdated: "4 hours ago",
    delayReason: "Adverse weather conditions - Storm in Pacific",
    delayedDays: 3,
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Shenzhen Port, China", date: "2024-01-28", time: "12:00", type: "departure", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Shenzhen Port, China", date: "2024-01-29", time: "06:00", type: "departure", completed: true },
      { id: "M3", status: "Delayed - Weather", location: "South China Sea", date: "2024-02-01", time: "—", type: "transit", completed: true },
      { id: "M4", status: "Resuming Transit", location: "Indian Ocean", date: "2024-02-05", time: "—", type: "transit", completed: false },
      { id: "M5", status: "Arriving at Port", location: "Rotterdam Port, Netherlands", date: "Est. 2024-02-23", time: "—", type: "arrival", completed: false },
      { id: "M6", status: "Delivery", location: "Rotterdam, Netherlands", date: "Est. 2024-02-25", time: "—", type: "delivery", completed: false },
    ],
  },
  {
    id: "SHP005",
    containerNumber: "OOLU1357924",
    bookingNumber: "BK2024007890",
    billOfLading: "BL2024007890",
    vessel: "ONE COMMITMENT",
    voyage: "V.156S",
    carrier: "ONE",
    carrierLogo: "ONE",
    origin: "Tokyo, Japan",
    originPort: "JPTYO",
    destination: "Singapore",
    destinationPort: "SGSIN",
    eta: "2024-02-08",
    etd: "2024-02-01",
    status: "at-port",
    progress: 90,
    cargoType: "FCL",
    weight: "15,600 kg",
    volume: "38 CBM",
    route: "Asia - Asia",
    lastUpdated: "30 mins ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Tokyo Port, Japan", date: "2024-02-01", time: "08:00", type: "departure", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Tokyo Port, Japan", date: "2024-02-01", time: "20:00", type: "departure", completed: true },
      { id: "M3", status: "Vessel Arrived", location: "Singapore Port", date: "2024-02-08", time: "06:00", type: "arrival", completed: true },
      { id: "M4", status: "Awaiting Discharge", location: "Singapore Port", date: "2024-02-08", time: "In Queue", type: "port", completed: false },
      { id: "M5", status: "Customs Clearance", location: "Singapore", date: "Est. 2024-02-09", time: "—", type: "customs", completed: false },
      { id: "M6", status: "Delivery", location: "Singapore", date: "Est. 2024-02-10", time: "—", type: "delivery", completed: false },
    ],
  },
  {
    id: "SHP006",
    containerNumber: "EGSU8642097",
    bookingNumber: "BK2024002345",
    billOfLading: "BL2024002345",
    vessel: "EVER GOLDEN",
    voyage: "V.201W",
    carrier: "Evergreen",
    carrierLogo: "Evergreen",
    origin: "Busan, South Korea",
    originPort: "KRPUS",
    destination: "Hamburg, Germany",
    destinationPort: "DEHAM",
    eta: "2024-02-28",
    etd: "2024-02-05",
    status: "in-transit",
    progress: 20,
    cargoType: "FCL",
    weight: "21,300 kg",
    volume: "55 CBM",
    route: "Asia - Europe",
    lastUpdated: "1 hour ago",
    milestones: [
      { id: "M1", status: "Container Loaded", location: "Busan Port, South Korea", date: "2024-02-05", time: "10:00", type: "departure", completed: true },
      { id: "M2", status: "Vessel Departed", location: "Busan Port, South Korea", date: "2024-02-06", time: "04:00", type: "departure", completed: true },
      { id: "M3", status: "In Transit", location: "East China Sea", date: "2024-02-08", time: "—", type: "transit", completed: false },
      { id: "M4", status: "Transit - Suez Canal", location: "Suez Canal", date: "Est. 2024-02-18", time: "—", type: "transit", completed: false },
      { id: "M5", status: "Arriving at Port", location: "Hamburg Port, Germany", date: "Est. 2024-02-28", time: "—", type: "arrival", completed: false },
      { id: "M6", status: "Delivery", location: "Hamburg, Germany", date: "Est. 2024-03-02", time: "—", type: "delivery", completed: false },
    ],
  },
];

// Sample alerts
const ALERTS: ShipmentAlert[] = [
  { id: "ALT001", shipmentId: "SHP004", type: "critical", title: "Shipment Delayed", message: "Container COSU2468135 delayed by 3 days due to adverse weather conditions", timestamp: "4 hours ago", read: false },
  { id: "ALT002", shipmentId: "SHP001", type: "info", title: "ETA Update", message: "Container MSCU1234567 ETA updated to Feb 15, 2024", timestamp: "10 mins ago", read: false },
  { id: "ALT003", shipmentId: "SHP002", type: "warning", title: "Customs Hold", message: "Container MAEU7654321 under customs inspection - additional documentation required", timestamp: "2 hours ago", read: false },
  { id: "ALT004", shipmentId: "SHP005", type: "success", title: "Arrived at Port", message: "Container OOLU1357924 has arrived at Singapore Port", timestamp: "30 mins ago", read: true },
  { id: "ALT005", shipmentId: "SHP003", type: "success", title: "Delivered", message: "Container CMAU9876543 has been successfully delivered", timestamp: "1 day ago", read: true },
];

// Status colors and labels
const STATUS_CONFIG: Record<ShipmentStatus, { color: string; bgColor: string; label: string; icon: typeof Ship }> = {
  "in-transit": { color: COLORS.ocean, bgColor: `${COLORS.ocean}15`, label: "In Transit", icon: Ship },
  "at-port": { color: COLORS.logistics, bgColor: `${COLORS.logistics}15`, label: "At Port", icon: Anchor },
  "delivered": { color: COLORS.logistics, bgColor: `${COLORS.logistics}15`, label: "Delivered", icon: CheckCircle2 },
  "delayed": { color: COLORS.danger, bgColor: `${COLORS.danger}15`, label: "Delayed", icon: AlertTriangle },
  "customs": { color: COLORS.warning, bgColor: `${COLORS.warning}15`, label: "Customs", icon: Building2 },
};

// Milestone type icons
const MILESTONE_ICONS: Record<string, typeof Ship> = {
  departure: Ship,
  arrival: Anchor,
  transit: Navigation,
  customs: Building2,
  delivery: Truck,
  port: Container,
};

// Routes for filtering
const ROUTES = [
  { id: "all", name: "All Routes" },
  { id: "asia-na", name: "Asia - North America" },
  { id: "asia-eu", name: "Asia - Europe" },
  { id: "eu-na", name: "Europe - North America" },
  { id: "asia-asia", name: "Asia - Asia" },
  { id: "intra-eu", name: "Intra-Europe" },
];

// Helper functions
const formatDate = (dateStr: string) => {
  try {
    const date = parseISO(dateStr.replace("Est. ", ""));
    return format(date, "MMM dd, yyyy");
  } catch {
    return dateStr;
  }
};

const getDaysUntil = (dateStr: string): number => {
  try {
    const date = parseISO(dateStr.replace("Est. ", ""));
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

// Status Overview Card Component
function StatusOverviewCard({ status, count, total }: { status: ShipmentStatus; count: number; total: number }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <Card className="card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ backgroundColor: config.bgColor }}>
              <Icon className="h-5 w-5" style={{ color: config.color }} />
            </div>
            <span className="font-medium text-sm">{config.label}</span>
          </div>
          <Badge style={{ backgroundColor: config.bgColor, color: config.color }}>
            {count}
          </Badge>
        </div>
        <Progress value={percentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          {percentage.toFixed(0)}% of total shipments
        </p>
      </CardContent>
    </Card>
  );
}

// Shipment Card Component
function ShipmentCard({
  shipment,
  isSelected,
  onClick,
}: {
  shipment: Shipment;
  isSelected: boolean;
  onClick: () => void;
}) {
  const config = STATUS_CONFIG[shipment.status];
  const StatusIcon = config.icon;
  const daysUntilETA = getDaysUntil(shipment.eta);

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isSelected ? "ring-2 ring-[var(--ocean)]" : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono font-bold">{shipment.containerNumber}</span>
              <Badge
                variant="outline"
                className="text-xs"
                style={{ borderColor: config.color, color: config.color }}
              >
                {shipment.carrier}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Booking: {shipment.bookingNumber}
            </p>
          </div>
          <Badge style={{ backgroundColor: config.color, color: "white" }}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="truncate">{shipment.origin}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="truncate">{shipment.destination}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Ship className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{shipment.vessel}</span>
            </div>
            <span className="text-xs text-muted-foreground">{shipment.voyage}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>ETA: {formatDate(shipment.eta)}</span>
            </div>
            {shipment.status !== "delivered" && (
              <span
                className="text-xs font-medium"
                style={{
                  color: daysUntilETA < 0 ? COLORS.danger : daysUntilETA <= 3 ? COLORS.warning : COLORS.logistics,
                }}
              >
                {daysUntilETA < 0
                  ? `${Math.abs(daysUntilETA)} days overdue`
                  : `${daysUntilETA} days left`}
              </span>
            )}
          </div>

          <Progress value={shipment.progress} className="h-1.5" />
        </div>

        {shipment.status === "delayed" && shipment.delayReason && (
          <div className="mt-3 p-2 rounded bg-red-50 dark:bg-red-950/30 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div className="text-xs text-red-700 dark:text-red-400">
              <span className="font-medium">Delayed {shipment.delayedDays} days: </span>
              {shipment.delayReason}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Milestone Timeline Component
function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="relative">
      {milestones.map((milestone, index) => {
        const Icon = MILESTONE_ICONS[milestone.type] || Navigation;
        const isLast = index === milestones.length - 1;

        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4 pb-6"
          >
            {!isLast && (
              <div
                className={`absolute left-[18px] top-10 w-0.5 h-full ${
                  milestone.completed ? "bg-[var(--logistics)]" : "bg-muted"
                }`}
              />
            )}

            <div
              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                milestone.completed
                  ? "bg-[var(--logistics)] text-white"
                  : "bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30"
              }`}
            >
              {milestone.completed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{milestone.status}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{milestone.location}</span>
                  </div>
                </div>
                <div className="text-right text-sm shrink-0">
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

// Map Placeholder Component
function MapPlaceholder() {
  return (
    <Card className="h-full min-h-[400px] relative overflow-hidden">
      <CardContent className="p-0 h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-4">
              <Globe className="h-24 w-24 text-[var(--ocean)] mx-auto opacity-20" />
              <Ship className="h-8 w-8 text-[var(--ocean)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-wave" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Interactive Map View
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Real-time vessel tracking map with route visualization coming soon
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled>
                <Layers className="h-4 w-4 mr-2" />
                Layers
              </Button>
              <Button variant="outline" size="sm" disabled>
                <ZoomIn className="h-4 w-4 mr-2" />
                Zoom
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative route lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLORS.ocean} stopOpacity="0.5" />
              <stop offset="100%" stopColor={COLORS.logistics} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <path
            d="M50,150 Q200,50 350,180 T600,120"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="2"
            strokeDasharray="8,4"
            className="opacity-30"
          />
        </svg>
      </CardContent>
    </Card>
  );
}

// Alert Notification Component
function AlertNotification({
  alert,
  onMarkRead,
}: {
  alert: ShipmentAlert;
  onMarkRead: () => void;
}) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-[var(--logistics)]" />;
      default:
        return <Info className="h-5 w-5 text-[var(--ocean)]" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
      case "success":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
      default:
        return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border ${getAlertBg(alert.type)} ${
        !alert.read ? "ring-2 ring-[var(--ocean)]/20" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {getAlertIcon(alert.type)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium text-sm">{alert.title}</span>
            {!alert.read && (
              <Badge variant="outline" className="text-xs shrink-0">
                New
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{alert.message}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs font-mono">{alert.shipmentId}</span>
          </div>
        </div>
        {!alert.read && (
          <Button variant="ghost" size="sm" onClick={onMarkRead}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Carrier Integration Card
function CarrierIntegrationCard({ carrier }: { carrier: CarrierIntegration }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-xs">
          {carrier.code}
        </div>
        <div>
          <div className="font-medium text-sm">{carrier.name}</div>
          <div className="text-xs text-muted-foreground">
            {carrier.connected ? `Synced: ${carrier.lastSync}` : "Not connected"}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor(carrier.apiStatus)}`} />
        <Button variant="ghost" size="sm" disabled={!carrier.connected}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Main Dashboard Component
export function ShipmentTrackingDashboard() {
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [routeFilter, setRouteFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [alerts, setAlerts] = useState<ShipmentAlert[]>(ALERTS);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("shipments");

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<ShipmentStatus, number> = {
      "in-transit": 0,
      "at-port": 0,
      "delivered": 0,
      "delayed": 0,
      "customs": 0,
    };
    SHIPMENTS.forEach((s) => {
      counts[s.status]++;
    });
    return counts;
  }, []);

  // Filter shipments
  const filteredShipments = useMemo(() => {
    return SHIPMENTS.filter((shipment) => {
      // Search filter (by container, booking, BL number, or vessel)
      if (
        searchQuery &&
        !shipment.containerNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !shipment.bookingNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !shipment.billOfLading.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !shipment.vessel.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && shipment.status !== statusFilter) {
        return false;
      }

      // Route filter
      if (routeFilter !== "all") {
        const routeMap: Record<string, string[]> = {
          "asia-na": ["Asia - North America"],
          "asia-eu": ["Asia - Europe"],
          "eu-na": ["Europe - North America"],
          "asia-asia": ["Asia - Asia"],
          "intra-eu": ["Intra-Europe"],
        };
        if (!routeMap[routeFilter]?.includes(shipment.route)) {
          return false;
        }
      }

      // Date range filter
      if (dateRange?.from) {
        const eta = parseISO(shipment.eta);
        if (dateRange.to) {
          if (isBefore(eta, dateRange.from) || isAfter(eta, dateRange.to)) {
            return false;
          }
        } else {
          if (isBefore(eta, dateRange.from)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [searchQuery, statusFilter, routeFilter, dateRange]);

  // Mark alert as read
  const markAlertRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, read: true } : a))
    );
  };

  const unreadAlerts = alerts.filter((a) => !a.read);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Ship className="h-7 w-7 text-[var(--ocean)]" />
            Shipment Tracking Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track and manage all your ocean freight shipments in real-time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Bell className="h-4 w-4" />
                {unreadAlerts.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500">
                    {unreadAlerts.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {unreadAlerts.length} unread alerts
                </p>
              </div>
              <ScrollArea className="h-80">
                <div className="p-2 space-y-2">
                  {alerts.map((alert) => (
                    <AlertNotification
                      key={alert.id}
                      alert={alert}
                      onMarkRead={() => markAlertRead(alert.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <Button className="bg-[var(--ocean)] hover:bg-[var(--ocean-dark)]">
            <Plus className="h-4 w-4 mr-2" />
            Add Shipment
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {(Object.keys(statusCounts) as ShipmentStatus[]).map((status) => (
          <StatusOverviewCard
            key={status}
            status={status}
            count={statusCounts[status]}
            total={SHIPMENTS.length}
          />
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by container, BL number, booking, or vessel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {showFilters ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {(Object.keys(STATUS_CONFIG) as ShipmentStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {STATUS_CONFIG[status].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Route</label>
                    <Select value={routeFilter} onValueChange={setRouteFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROUTES.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ETA Date Range</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[240px] justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          {dateRange?.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                              </>
                            ) : (
                              format(dateRange.from, "MMM dd, yyyy")
                            )
                          ) : (
                            "Select date range"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStatusFilter("all");
                        setRouteFilter("all");
                        setDateRange(undefined);
                        setSearchQuery("");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="shipments">
            <Package className="h-4 w-4 mr-2" />
            Shipments ({filteredShipments.length})
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="h-4 w-4 mr-2" />
            Map View
          </TabsTrigger>
          <TabsTrigger value="carriers">
            <Building2 className="h-4 w-4 mr-2" />
            Carrier Integrations
          </TabsTrigger>
        </TabsList>

        {/* Shipments Tab */}
        <TabsContent value="shipments" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Shipment List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Active Shipments</h3>
                <span className="text-sm text-muted-foreground">
                  {filteredShipments.length} of {SHIPMENTS.length} shipments
                </span>
              </div>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filteredShipments.map((shipment) => (
                    <ShipmentCard
                      key={shipment.id}
                      shipment={shipment}
                      isSelected={selectedShipment?.id === shipment.id}
                      onClick={() => setSelectedShipment(shipment)}
                    />
                  ))}
                  {filteredShipments.length === 0 && (
                    <Card className="bg-muted/30">
                      <CardContent className="py-12 text-center">
                        <Container className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Shipments Found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search or filter criteria
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Shipment Details */}
            <div>
              {selectedShipment ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-mono">
                            {selectedShipment.containerNumber}
                          </CardTitle>
                          <CardDescription>
                            Booking: {selectedShipment.bookingNumber} • B/L: {selectedShipment.billOfLading}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Full Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Shipment
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Track on {selectedShipment.carrier}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Route */}
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Origin</div>
                          <div className="font-medium">{selectedShipment.originPort}</div>
                          <div className="text-xs text-muted-foreground">{selectedShipment.origin}</div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[var(--ocean)]" />
                            <div className="w-20 h-0.5 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)]" />
                            <Plane className="h-4 w-4 text-[var(--logistics)] rotate-90" />
                            <div className="w-20 h-0.5 bg-gradient-to-r from-[var(--logistics)] to-[var(--logistics)]" />
                            <div className="w-2 h-2 rounded-full bg-[var(--logistics)]" />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">Destination</div>
                          <div className="font-medium">{selectedShipment.destinationPort}</div>
                          <div className="text-xs text-muted-foreground">{selectedShipment.destination}</div>
                        </div>
                      </div>

                      {/* Status and Progress */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Status</span>
                          <Badge
                            style={{
                              backgroundColor: STATUS_CONFIG[selectedShipment.status].bgColor,
                              color: STATUS_CONFIG[selectedShipment.status].color,
                            }}
                          >
                            {STATUS_CONFIG[selectedShipment.status].label}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs text-muted-foreground">Progress</span>
                          <div className="flex items-center gap-2">
                            <Progress value={selectedShipment.progress} className="h-2 flex-1" />
                            <span className="text-sm font-medium">{selectedShipment.progress}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Vessel</div>
                          <div className="font-medium">{selectedShipment.vessel}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Voyage</div>
                          <div className="font-medium">{selectedShipment.voyage}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">ETD</div>
                          <div className="font-medium">{formatDate(selectedShipment.etd)}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">ETA</div>
                          <div className="font-medium">{formatDate(selectedShipment.eta)}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Cargo Type</div>
                          <div className="font-medium">{selectedShipment.cargoType}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Weight</div>
                          <div className="font-medium">{selectedShipment.weight}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Volume</div>
                          <div className="font-medium">{selectedShipment.volume}</div>
                        </div>
                        <div className="p-2 rounded bg-muted/50">
                          <div className="text-xs text-muted-foreground">Last Updated</div>
                          <div className="font-medium">{selectedShipment.lastUpdated}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Milestone Timeline */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[var(--ocean)]" />
                        Tracking Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MilestoneTimeline milestones={selectedShipment.milestones} />
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Track on {selectedShipment.carrier}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="py-12 text-center">
                    <Container className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Select a Shipment</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Choose a shipment from the list to view detailed tracking information and milestone timeline
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Map View Tab */}
        <TabsContent value="map" className="mt-6">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <MapPlaceholder />
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Active Routes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ROUTES.filter((r) => r.id !== "all").map((route) => {
                    const count = SHIPMENTS.filter((s) => s.route === route.name).length;
                    return (
                      <div
                        key={route.id}
                        className="flex items-center justify-between p-2 rounded bg-muted/50"
                      >
                        <div className="flex items-center gap-2">
                          <Route className="h-4 w-4 text-[var(--ocean)]" />
                          <span className="text-sm">{route.name}</span>
                        </div>
                        <Badge variant="secondary">{count} vessels</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Vessel Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {SHIPMENTS.filter((s) => s.status === "in-transit").map((shipment) => (
                        <div
                          key={shipment.id}
                          className="flex items-center justify-between p-2 rounded bg-muted/50"
                        >
                          <div>
                            <div className="font-medium text-sm">{shipment.vessel}</div>
                            <div className="text-xs text-muted-foreground">
                              {shipment.containerNumber}
                            </div>
                          </div>
                          <Navigation className="h-4 w-4 text-[var(--ocean)] animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Carrier Integrations Tab */}
        <TabsContent value="carriers" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--ocean)]" />
                  Carrier Integrations
                </CardTitle>
                <CardDescription>
                  API connection status for carrier tracking systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {CARRIER_INTEGRATIONS.map((carrier) => (
                  <CarrierIntegrationCard key={carrier.code} carrier={carrier} />
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-[var(--logistics)]" />
                  Sync Settings
                </CardTitle>
                <CardDescription>
                  Configure automatic tracking updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Auto-sync Interval</span>
                    <Select defaultValue="15">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 minutes</SelectItem>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Tracking data will be refreshed automatically at the selected interval
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Webhook Notifications</span>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Receive real-time updates via webhook for status changes
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">API Rate Limit</span>
                    <span className="text-sm text-[var(--logistics)]">8,500 / 10,000</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    API calls used today (resets at midnight UTC)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ShipmentTrackingDashboard;
