"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Anchor,
  Building2,
  Clock,
  Container,
  Gauge,
  MapPin,
  Ship,
  Star,
  Timer,
  Truck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Info,
  ArrowRightLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Clock4,
  Warehouse,
  Globe,
  Search,
  Filter,
  Award,
  Target,
  BarChart3,
  PieChart,
  TimerIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart,
  Line,
  Area,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants/chartColors";
import { PORTS, type Port } from "@/lib/constants/ports";

// Terminal data structure
interface Terminal {
  id: string;
  name: string;
  portCode: string;
  portName: string;
  operator: string;
  type: "container" | "multi-purpose" | "roro" | "bulk" | "tanker";
  
  // Capacity metrics
  annualCapacity: number; // TEU
  currentUtilization: number; // percentage
  berthLength: number; // meters
  maxDraft: number; // meters
  cranes: number;
  yardCapacity: number; // TEU ground slots
  reeferPoints: number;
  
  // Performance metrics
  productivity: number; // moves per hour
  dwellTime: number; // days
  vesselWaitTime: number; // hours
  gateTurnTime: number; // minutes
  truckTurnTime: number; // minutes
  
  // Costs
  thc: number; // Terminal Handling Charge per TEU
  storageRate: number; // per TEU per day
  demurrageFree: number; // free days
  demurrageRate: number; // per TEU per day after free days
  
  // Gate hours
  gateHours: {
    weekdays: string;
    weekends: string;
    holidays: string;
    extended: boolean;
  };
  
  // Equipment
  equipment: {
    rtg: number;
    straddleCarriers: number;
    reachStackers: number;
    forklifts: number;
    emptyHandlers: number;
  };
  
  // Carrier coverage
  carriers: string[];
  services: number; // number of weekly services
  
  // Features
  features: string[];
  
  // Rating
  overallRating: number; // 1-5
  reliability: number; // percentage
  customerSatisfaction: number; // percentage
  
  // Status
  congestion: "low" | "medium" | "high" | "critical";
  status: "operational" | "limited" | "congested" | "closed";
}

// Sample terminal data for major ports
const TERMINALS: Terminal[] = [
  // Shanghai Terminals
  {
    id: "CNSHA-YST",
    name: "Yangshan Shendong Terminal",
    portCode: "CNSHA",
    portName: "Shanghai",
    operator: "Shanghai International Port Group",
    type: "container",
    annualCapacity: 15000000,
    currentUtilization: 78,
    berthLength: 3000,
    maxDraft: 16.5,
    cranes: 34,
    yardCapacity: 45000,
    reeferPoints: 3200,
    productivity: 32,
    dwellTime: 4.2,
    vesselWaitTime: 6,
    gateTurnTime: 45,
    truckTurnTime: 75,
    thc: 185,
    storageRate: 8,
    demurrageFree: 7,
    demurrageRate: 25,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "06:00-18:00", extended: true },
    equipment: { rtg: 120, straddleCarriers: 0, reachStackers: 24, forklifts: 45, emptyHandlers: 30 },
    carriers: ["Maersk", "MSC", "CMA CGM", "COSCO", "ONE", "Evergreen", "Hapag-Lloyd", "Yang Ming"],
    services: 45,
    features: ["Automated Gates", "Deep Water", "Rail Access", "Barge Feeder", "Vessel Planning System"],
    overallRating: 4.5,
    reliability: 94,
    customerSatisfaction: 88,
    congestion: "low",
    status: "operational",
  },
  {
    id: "CNSHA-WGQ",
    name: "Waigaoqiao Terminal",
    portCode: "CNSHA",
    portName: "Shanghai",
    operator: "Shanghai International Port Group",
    type: "container",
    annualCapacity: 8000000,
    currentUtilization: 85,
    berthLength: 2400,
    maxDraft: 14.5,
    cranes: 26,
    yardCapacity: 28000,
    reeferPoints: 1800,
    productivity: 28,
    dwellTime: 5.1,
    vesselWaitTime: 12,
    gateTurnTime: 52,
    truckTurnTime: 88,
    thc: 165,
    storageRate: 7,
    demurrageFree: 5,
    demurrageRate: 22,
    gateHours: { weekdays: "06:00-22:00", weekends: "08:00-18:00", holidays: "Closed", extended: false },
    equipment: { rtg: 85, straddleCarriers: 12, reachStackers: 18, forklifts: 35, emptyHandlers: 22 },
    carriers: ["Maersk", "MSC", "CMA CGM", "COSCO", "ONE"],
    services: 28,
    features: ["Rail Access", "Barge Feeder", "Dangerous Cargo", "OOG Handling"],
    overallRating: 4.0,
    reliability: 90,
    customerSatisfaction: 82,
    congestion: "medium",
    status: "operational",
  },
  // Singapore Terminals
  {
    id: "SGSIN-PSA",
    name: "PSA Singapore Terminal",
    portCode: "SGSIN",
    portName: "Singapore",
    operator: "PSA International",
    type: "container",
    annualCapacity: 40000000,
    currentUtilization: 82,
    berthLength: 5500,
    maxDraft: 18.0,
    cranes: 70,
    yardCapacity: 120000,
    reeferPoints: 8500,
    productivity: 35,
    dwellTime: 3.5,
    vesselWaitTime: 4,
    gateTurnTime: 38,
    truckTurnTime: 62,
    thc: 210,
    storageRate: 10,
    demurrageFree: 5,
    demurrageRate: 30,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "00:00-24:00", extended: true },
    equipment: { rtg: 350, straddleCarriers: 80, reachStackers: 45, forklifts: 120, emptyHandlers: 65 },
    carriers: ["Maersk", "MSC", "CMA CGM", "ONE", "Evergreen", "Hapag-Lloyd", "Yang Ming", "HMM", "ZIM"],
    services: 85,
    features: ["Automated Gates", "Deep Water", "Transshipment Hub", "Rail Access", "Smart Port", "Remote Operations"],
    overallRating: 4.8,
    reliability: 97,
    customerSatisfaction: 92,
    congestion: "low",
    status: "operational",
  },
  {
    id: "SGSIN-TUAS",
    name: "Tuas Port Terminal",
    portCode: "SGSIN",
    portName: "Singapore",
    operator: "PSA International",
    type: "container",
    annualCapacity: 20000000,
    currentUtilization: 45,
    berthLength: 4000,
    maxDraft: 23.0,
    cranes: 45,
    yardCapacity: 65000,
    reeferPoints: 4200,
    productivity: 38,
    dwellTime: 2.8,
    vesselWaitTime: 2,
    gateTurnTime: 32,
    truckTurnTime: 55,
    thc: 225,
    storageRate: 12,
    demurrageFree: 7,
    demurrageRate: 35,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "00:00-24:00", extended: true },
    equipment: { rtg: 180, straddleCarriers: 40, reachStackers: 30, forklifts: 80, emptyHandlers: 40 },
    carriers: ["Maersk", "MSC", "CMA CGM", "ONE", "Hapag-Lloyd", "Yang Ming"],
    services: 42,
    features: ["Fully Automated", "Ultra Deep Water", "Megaship Ready", "Smart Port", "Zero Emission"],
    overallRating: 4.9,
    reliability: 98,
    customerSatisfaction: 95,
    congestion: "low",
    status: "operational",
  },
  // Rotterdam Terminals
  {
    id: "NLRTM-MV2",
    name: "Maasvlakte II Terminal",
    portCode: "NLRTM",
    portName: "Rotterdam",
    operator: "APM Terminals",
    type: "container",
    annualCapacity: 15000000,
    currentUtilization: 72,
    berthLength: 2000,
    maxDraft: 20.0,
    cranes: 28,
    yardCapacity: 48000,
    reeferPoints: 2800,
    productivity: 36,
    dwellTime: 4.8,
    vesselWaitTime: 5,
    gateTurnTime: 42,
    truckTurnTime: 70,
    thc: 235,
    storageRate: 11,
    demurrageFree: 5,
    demurrageRate: 28,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "08:00-20:00", extended: true },
    equipment: { rtg: 140, straddleCarriers: 0, reachStackers: 18, forklifts: 40, emptyHandlers: 25 },
    carriers: ["Maersk", "MSC", "CMA CGM", "ONE", "Hapag-Lloyd"],
    services: 38,
    features: ["Fully Automated", "Deep Water", "Rail Terminal", "Zero Emission", "Remote Crane Ops"],
    overallRating: 4.7,
    reliability: 96,
    customerSatisfaction: 91,
    congestion: "low",
    status: "operational",
  },
  {
    id: "NLRTM-RW",
    name: "RWG Terminal",
    portCode: "NLRTM",
    portName: "Rotterdam",
    operator: "Rotterdam World Gateway",
    type: "container",
    annualCapacity: 8000000,
    currentUtilization: 68,
    berthLength: 1500,
    maxDraft: 17.5,
    cranes: 20,
    yardCapacity: 28000,
    reeferPoints: 1600,
    productivity: 32,
    dwellTime: 5.2,
    vesselWaitTime: 8,
    gateTurnTime: 48,
    truckTurnTime: 78,
    thc: 220,
    storageRate: 10,
    demurrageFree: 5,
    demurrageRate: 25,
    gateHours: { weekdays: "06:00-22:00", weekends: "08:00-18:00", holidays: "Closed", extended: false },
    equipment: { rtg: 80, straddleCarriers: 30, reachStackers: 15, forklifts: 30, emptyHandlers: 18 },
    carriers: ["MSC", "CMA CGM", "ONE", "Evergreen"],
    services: 22,
    features: ["Automated Stacking", "Rail Access", "Barge Terminal", "Dangerous Cargo"],
    overallRating: 4.3,
    reliability: 92,
    customerSatisfaction: 86,
    congestion: "low",
    status: "operational",
  },
  // Los Angeles Terminals
  {
    id: "USLAX-APM",
    name: "APM Terminals Los Angeles",
    portCode: "USLAX",
    portName: "Los Angeles",
    operator: "APM Terminals",
    type: "container",
    annualCapacity: 5000000,
    currentUtilization: 88,
    berthLength: 1200,
    maxDraft: 16.0,
    cranes: 16,
    yardCapacity: 18000,
    reeferPoints: 1200,
    productivity: 28,
    dwellTime: 6.5,
    vesselWaitTime: 24,
    gateTurnTime: 65,
    truckTurnTime: 110,
    thc: 395,
    storageRate: 18,
    demurrageFree: 5,
    demurrageRate: 55,
    gateHours: { weekdays: "06:00-24:00", weekends: "08:00-18:00", holidays: "Closed", extended: true },
    equipment: { rtg: 65, straddleCarriers: 18, reachStackers: 12, forklifts: 25, emptyHandlers: 15 },
    carriers: ["Maersk", "MSC", "CMA CGM", "ONE", "Hapag-Lloyd"],
    services: 18,
    features: ["Rail Access", "Clean Truck Program", "On-Dock Rail", "Chassis Pool"],
    overallRating: 3.8,
    reliability: 85,
    customerSatisfaction: 75,
    congestion: "high",
    status: "congested",
  },
  {
    id: "USLAX-TI",
    name: "TraPac Terminal",
    portCode: "USLAX",
    portName: "Los Angeles",
    operator: "TraPac",
    type: "container",
    annualCapacity: 3500000,
    currentUtilization: 92,
    berthLength: 900,
    maxDraft: 14.5,
    cranes: 12,
    yardCapacity: 12000,
    reeferPoints: 850,
    productivity: 25,
    dwellTime: 7.2,
    vesselWaitTime: 36,
    gateTurnTime: 78,
    truckTurnTime: 125,
    thc: 385,
    storageRate: 16,
    demurrageFree: 4,
    demurrageRate: 50,
    gateHours: { weekdays: "08:00-18:00", weekends: "Closed", holidays: "Closed", extended: false },
    equipment: { rtg: 45, straddleCarriers: 12, reachStackers: 8, forklifts: 18, emptyHandlers: 10 },
    carriers: ["Evergreen", "Yang Ming", "ONE", "Wan Hai"],
    services: 12,
    features: ["Rail Access", "Chassis Pool", "Night Gates"],
    overallRating: 3.5,
    reliability: 78,
    customerSatisfaction: 70,
    congestion: "high",
    status: "congested",
  },
  // Long Beach Terminals
  {
    id: "USLGB-TTI",
    name: "TTI Long Beach",
    portCode: "USLGB",
    portName: "Long Beach",
    operator: "Total Terminals International",
    type: "container",
    annualCapacity: 4000000,
    currentUtilization: 85,
    berthLength: 1000,
    maxDraft: 15.5,
    cranes: 14,
    yardCapacity: 15000,
    reeferPoints: 1100,
    productivity: 27,
    dwellTime: 5.8,
    vesselWaitTime: 18,
    gateTurnTime: 58,
    truckTurnTime: 95,
    thc: 380,
    storageRate: 17,
    demurrageFree: 5,
    demurrageRate: 52,
    gateHours: { weekdays: "06:00-24:00", weekends: "08:00-18:00", holidays: "Closed", extended: true },
    equipment: { rtg: 55, straddleCarriers: 15, reachStackers: 10, forklifts: 22, emptyHandlers: 12 },
    carriers: ["Hanjin", "Yang Ming", "ONE", "Hapag-Lloyd"],
    services: 15,
    features: ["Rail Access", "On-Dock Rail", "Clean Trucks", "Extended Gates"],
    overallRating: 4.0,
    reliability: 88,
    customerSatisfaction: 80,
    congestion: "medium",
    status: "operational",
  },
  // Dubai Terminals
  {
    id: "AEJEA-JA1",
    name: "Jebel Ali Terminal 1",
    portCode: "AEJEA",
    portName: "Jebel Ali (Dubai)",
    operator: "DP World",
    type: "container",
    annualCapacity: 9000000,
    currentUtilization: 75,
    berthLength: 2800,
    maxDraft: 17.0,
    cranes: 32,
    yardCapacity: 38000,
    reeferPoints: 2500,
    productivity: 30,
    dwellTime: 4.5,
    vesselWaitTime: 8,
    gateTurnTime: 42,
    truckTurnTime: 72,
    thc: 195,
    storageRate: 9,
    demurrageFree: 7,
    demurrageRate: 28,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "00:00-24:00", extended: true },
    equipment: { rtg: 110, straddleCarriers: 25, reachStackers: 20, forklifts: 40, emptyHandlers: 28 },
    carriers: ["Maersk", "MSC", "CMA CGM", "ONE", "Hapag-Lloyd", "Evergreen", "PIL", "HMM"],
    services: 52,
    features: ["Automated Gates", "Free Zone", "Rail Access", "RoRo Facility", "Logistics Park"],
    overallRating: 4.6,
    reliability: 95,
    customerSatisfaction: 89,
    congestion: "low",
    status: "operational",
  },
  {
    id: "AEJEA-JA4",
    name: "Jebel Ali Terminal 4",
    portCode: "AEJEA",
    portName: "Jebel Ali (Dubai)",
    operator: "DP World",
    type: "container",
    annualCapacity: 7000000,
    currentUtilization: 62,
    berthLength: 1800,
    maxDraft: 18.5,
    cranes: 22,
    yardCapacity: 28000,
    reeferPoints: 1800,
    productivity: 34,
    dwellTime: 3.8,
    vesselWaitTime: 4,
    gateTurnTime: 38,
    truckTurnTime: 65,
    thc: 205,
    storageRate: 10,
    demurrageFree: 7,
    demurrageRate: 30,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "00:00-24:00", extended: true },
    equipment: { rtg: 85, straddleCarriers: 20, reachStackers: 15, forklifts: 30, emptyHandlers: 20 },
    carriers: ["Maersk", "MSC", "CMA CGM", "ONE", "Hapag-Lloyd"],
    services: 35,
    features: ["Semi-Automated", "Deep Water", "Megaship Ready", "Free Zone Access"],
    overallRating: 4.7,
    reliability: 96,
    customerSatisfaction: 92,
    congestion: "low",
    status: "operational",
  },
  // Hamburg Terminals
  {
    id: "DEHAM-CTA",
    name: "CTA Altenwerder",
    portCode: "DEHAM",
    portName: "Hamburg",
    operator: "HHLA",
    type: "container",
    annualCapacity: 4500000,
    currentUtilization: 78,
    berthLength: 1400,
    maxDraft: 16.7,
    cranes: 18,
    yardCapacity: 22000,
    reeferPoints: 1400,
    productivity: 34,
    dwellTime: 5.5,
    vesselWaitTime: 10,
    gateTurnTime: 48,
    truckTurnTime: 82,
    thc: 245,
    storageRate: 12,
    demurrageFree: 4,
    demurrageRate: 32,
    gateHours: { weekdays: "06:00-22:00", weekends: "08:00-18:00", holidays: "Closed", extended: false },
    equipment: { rtg: 0, straddleCarriers: 52, reachStackers: 8, forklifts: 20, emptyHandlers: 12 },
    carriers: ["Hapag-Lloyd", "Maersk", "MSC", "ONE", "Evergreen"],
    services: 22,
    features: ["Fully Automated", "Double Art. Cranes", "Rail Terminal", "Dangerous Cargo"],
    overallRating: 4.5,
    reliability: 94,
    customerSatisfaction: 88,
    congestion: "low",
    status: "operational",
  },
  // Antwerp Terminals
  {
    id: "BEANR-DEU",
    name: "Deurganck Dock Terminal",
    portCode: "BEANR",
    portName: "Antwerp",
    operator: "MPET (MSC PSA European Terminals)",
    type: "container",
    annualCapacity: 9000000,
    currentUtilization: 82,
    berthLength: 2600,
    maxDraft: 17.0,
    cranes: 30,
    yardCapacity: 35000,
    reeferPoints: 2200,
    productivity: 31,
    dwellTime: 4.8,
    vesselWaitTime: 8,
    gateTurnTime: 45,
    truckTurnTime: 75,
    thc: 225,
    storageRate: 10,
    demurrageFree: 5,
    demurrageRate: 26,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "08:00-20:00", extended: true },
    equipment: { rtg: 130, straddleCarriers: 35, reachStackers: 18, forklifts: 38, emptyHandlers: 22 },
    carriers: ["MSC", "CMA CGM", "ONE", "Evergreen", "Yang Ming"],
    services: 32,
    features: ["Deep Water", "Rail Access", "Barge Terminal", "RoRo Facility"],
    overallRating: 4.4,
    reliability: 93,
    customerSatisfaction: 87,
    congestion: "low",
    status: "operational",
  },
  // Busan Terminals
  {
    id: "KRPUS-GAM",
    name: "Gamman Terminal",
    portCode: "KRPUS",
    portName: "Busan",
    operator: "Busan Port Authority",
    type: "container",
    annualCapacity: 6000000,
    currentUtilization: 80,
    berthLength: 1800,
    maxDraft: 16.0,
    cranes: 22,
    yardCapacity: 25000,
    reeferPoints: 1500,
    productivity: 33,
    dwellTime: 3.2,
    vesselWaitTime: 5,
    gateTurnTime: 40,
    truckTurnTime: 68,
    thc: 175,
    storageRate: 7,
    demurrageFree: 7,
    demurrageRate: 22,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "08:00-18:00", extended: true },
    equipment: { rtg: 95, straddleCarriers: 22, reachStackers: 15, forklifts: 32, emptyHandlers: 18 },
    carriers: ["Maersk", "MSC", "CMA CGM", "COSCO", "ONE", "HMM", "Evergreen", "Yang Ming"],
    services: 38,
    features: ["Transshipment Hub", "Rail Access", "Automated Gates", "Dangerous Cargo"],
    overallRating: 4.4,
    reliability: 95,
    customerSatisfaction: 88,
    congestion: "low",
    status: "operational",
  },
  // Hong Kong Terminals
  {
    id: "HKHKG-KT",
    name: "Kwai Tsing Container Terminal",
    portCode: "HKHKG",
    portName: "Hong Kong",
    operator: "Modern Terminals / HIT",
    type: "container",
    annualCapacity: 12000000,
    currentUtilization: 72,
    berthLength: 3200,
    maxDraft: 15.5,
    cranes: 38,
    yardCapacity: 42000,
    reeferPoints: 2800,
    productivity: 30,
    dwellTime: 3.8,
    vesselWaitTime: 6,
    gateTurnTime: 38,
    truckTurnTime: 62,
    thc: 190,
    storageRate: 9,
    demurrageFree: 5,
    demurrageRate: 28,
    gateHours: { weekdays: "00:00-24:00", weekends: "00:00-24:00", holidays: "00:00-24:00", extended: true },
    equipment: { rtg: 145, straddleCarriers: 35, reachStackers: 22, forklifts: 48, emptyHandlers: 28 },
    carriers: ["Maersk", "MSC", "CMA CGM", "COSCO", "ONE", "Evergreen", "OOCL"],
    services: 42,
    features: ["Transshipment Hub", "Barge Operations", "Rail Access", "Dangerous Cargo"],
    overallRating: 4.3,
    reliability: 92,
    customerSatisfaction: 85,
    congestion: "low",
    status: "operational",
  },
  // New York Terminals
  {
    id: "USNYC-APM",
    name: "APM Terminals Elizabeth",
    portCode: "USNYC",
    portName: "New York/New Jersey",
    operator: "APM Terminals",
    type: "container",
    annualCapacity: 3500000,
    currentUtilization: 90,
    berthLength: 1100,
    maxDraft: 15.0,
    cranes: 14,
    yardCapacity: 14000,
    reeferPoints: 950,
    productivity: 26,
    dwellTime: 6.8,
    vesselWaitTime: 22,
    gateTurnTime: 68,
    truckTurnTime: 105,
    thc: 420,
    storageRate: 20,
    demurrageFree: 4,
    demurrageRate: 58,
    gateHours: { weekdays: "06:00-22:00", weekends: "08:00-18:00", holidays: "Closed", extended: true },
    equipment: { rtg: 52, straddleCarriers: 14, reachStackers: 10, forklifts: 22, emptyHandlers: 12 },
    carriers: ["Maersk", "MSC", "CMA CGM", "ONE", "Hapag-Lloyd"],
    services: 16,
    features: ["Rail Access", "Chassis Pool", "On-Dock Rail", "Extended Gates"],
    overallRating: 3.7,
    reliability: 82,
    customerSatisfaction: 72,
    congestion: "high",
    status: "congested",
  },
  {
    id: "USNYC-GCT",
    name: "GCT Bayonne",
    portCode: "USNYC",
    portName: "New York/New Jersey",
    operator: "Global Container Terminals",
    type: "container",
    annualCapacity: 2500000,
    currentUtilization: 82,
    berthLength: 900,
    maxDraft: 16.0,
    cranes: 12,
    yardCapacity: 10000,
    reeferPoints: 720,
    productivity: 28,
    dwellTime: 5.5,
    vesselWaitTime: 15,
    gateTurnTime: 55,
    truckTurnTime: 88,
    thc: 395,
    storageRate: 18,
    demurrageFree: 5,
    demurrageRate: 50,
    gateHours: { weekdays: "06:00-24:00", weekends: "08:00-18:00", holidays: "Closed", extended: true },
    equipment: { rtg: 40, straddleCarriers: 12, reachStackers: 8, forklifts: 18, emptyHandlers: 10 },
    carriers: ["COSCO", "ONE", "Evergreen", "Yang Ming"],
    services: 12,
    features: ["Deep Water", "Rail Access", "Clean Trucks", "Modern Facility"],
    overallRating: 4.0,
    reliability: 88,
    customerSatisfaction: 80,
    congestion: "medium",
    status: "operational",
  },
];

// Criteria weights for recommendation
interface CriteriaWeights {
  productivity: number;
  dwellTime: number;
  vesselWaitTime: number;
  cost: number;
  reliability: number;
  congestion: number;
}

// Carrier list
const MAJOR_CARRIERS = [
  "Maersk", "MSC", "CMA CGM", "COSCO", "ONE", "Hapag-Lloyd",
  "Evergreen", "Yang Ming", "HMM", "ZIM", "PIL", "OOCL", "Wan Hai"
];

export function PortTerminalSelector() {
  // State
  const [selectedPortCode, setSelectedPortCode] = useState<string>("");
  const [selectedTerminals, setSelectedTerminals] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("select");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("all");
  const [priorityMode, setPriorityMode] = useState<"balanced" | "speed" | "cost" | "reliability">("balanced");
  const [criteriaWeights, setCriteriaWeights] = useState<CriteriaWeights>({
    productivity: 15,
    dwellTime: 20,
    vesselWaitTime: 15,
    cost: 20,
    reliability: 20,
    congestion: 10,
  });

  // Get terminals for selected port
  const portTerminals = useMemo(() => {
    if (!selectedPortCode) return [];
    return TERMINALS.filter(t => t.portCode === selectedPortCode);
  }, [selectedPortCode]);

  // Get all unique ports with terminals
  const portsWithTerminals = useMemo(() => {
    const uniquePorts = new Set(TERMINALS.map(t => t.portCode));
    return PORTS.filter(p => uniquePorts.has(p.unLoCode));
  }, []);

  // Filter terminals based on search and carrier
  const filteredTerminals = useMemo(() => {
    let result = selectedPortCode ? portTerminals : TERMINALS;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.portName.toLowerCase().includes(query) ||
        t.operator.toLowerCase().includes(query)
      );
    }
    
    if (selectedCarrier !== "all") {
      result = result.filter(t => t.carriers.includes(selectedCarrier));
    }
    
    return result;
  }, [selectedPortCode, portTerminals, searchQuery, selectedCarrier]);

  // Calculate terminal scores for recommendation
  const terminalScores = useMemo(() => {
    return filteredTerminals.map(terminal => {
      // Normalize scores (0-100)
      const productivityScore = (terminal.productivity / 40) * 100;
      const dwellTimeScore = Math.max(0, 100 - (terminal.dwellTime / 10) * 100);
      const vesselWaitScore = Math.max(0, 100 - (terminal.vesselWaitTime / 48) * 100);
      const costScore = Math.max(0, 100 - ((terminal.thc - 150) / 300) * 100);
      const reliabilityScore = terminal.reliability;
      
      let congestionScore = 100;
      switch (terminal.congestion) {
        case "low": congestionScore = 100; break;
        case "medium": congestionScore = 60; break;
        case "high": congestionScore = 30; break;
        case "critical": congestionScore = 0; break;
      }

      // Calculate weighted score
      const totalWeight = criteriaWeights.productivity + criteriaWeights.dwellTime +
        criteriaWeights.vesselWaitTime + criteriaWeights.cost +
        criteriaWeights.reliability + criteriaWeights.congestion;

      const weightedScore = (
        productivityScore * criteriaWeights.productivity +
        dwellTimeScore * criteriaWeights.dwellTime +
        vesselWaitScore * criteriaWeights.vesselWaitTime +
        costScore * criteriaWeights.cost +
        reliabilityScore * criteriaWeights.reliability +
        congestionScore * criteriaWeights.congestion
      ) / totalWeight;

      return {
        terminal,
        scores: {
          productivity: productivityScore,
          dwellTime: dwellTimeScore,
          vesselWait: vesselWaitScore,
          cost: costScore,
          reliability: reliabilityScore,
          congestion: congestionScore,
        },
        weightedScore,
      };
    }).sort((a, b) => b.weightedScore - a.weightedScore);
  }, [filteredTerminals, criteriaWeights]);

  // Get selected terminal details
  const selectedTerminalDetails = useMemo(() => {
    return TERMINALS.filter(t => selectedTerminals.includes(t.id));
  }, [selectedTerminals]);

  // Comparison data for charts
  const comparisonChartData = useMemo(() => {
    if (selectedTerminalDetails.length === 0) return [];
    
    return selectedTerminalDetails.map(terminal => ({
      name: terminal.name.split(" ")[0],
      productivity: terminal.productivity,
      dwellTime: terminal.dwellTime,
      vesselWait: terminal.vesselWaitTime,
      reliability: terminal.reliability,
      thc: terminal.thc,
    }));
  }, [selectedTerminalDetails]);

  // Radar chart data for comparison
  const radarData = useMemo(() => {
    if (selectedTerminalDetails.length === 0) return [];
    
    const metrics = ["Productivity", "Dwell Time", "Wait Time", "Cost", "Reliability", "Capacity"];
    return metrics.map(metric => {
      const dataPoint: Record<string, string | number> = { metric };
      selectedTerminalDetails.forEach(terminal => {
        const shortName = terminal.name.split(" ")[0];
        switch (metric) {
          case "Productivity":
            dataPoint[shortName] = (terminal.productivity / 40) * 100;
            break;
          case "Dwell Time":
            dataPoint[shortName] = Math.max(0, 100 - terminal.dwellTime * 10);
            break;
          case "Wait Time":
            dataPoint[shortName] = Math.max(0, 100 - terminal.vesselWaitTime * 2);
            break;
          case "Cost":
            dataPoint[shortName] = Math.max(0, 100 - ((terminal.thc - 150) / 3));
            break;
          case "Reliability":
            dataPoint[shortName] = terminal.reliability;
            break;
          case "Capacity":
            dataPoint[shortName] = (terminal.currentUtilization / 100) * 100;
            break;
        }
      });
      return dataPoint;
    });
  }, [selectedTerminalDetails]);

  // Toggle terminal selection
  const toggleTerminalSelection = useCallback((terminalId: string) => {
    setSelectedTerminals(prev => {
      if (prev.includes(terminalId)) {
        return prev.filter(id => id !== terminalId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, terminalId];
    });
  }, []);

  // Apply preset weights
  const applyPresetWeights = useCallback((preset: typeof priorityMode) => {
    setPriorityMode(preset);
    switch (preset) {
      case "balanced":
        setCriteriaWeights({
          productivity: 15,
          dwellTime: 20,
          vesselWaitTime: 15,
          cost: 20,
          reliability: 20,
          congestion: 10,
        });
        break;
      case "speed":
        setCriteriaWeights({
          productivity: 30,
          dwellTime: 25,
          vesselWaitTime: 25,
          cost: 5,
          reliability: 10,
          congestion: 5,
        });
        break;
      case "cost":
        setCriteriaWeights({
          productivity: 10,
          dwellTime: 15,
          vesselWaitTime: 10,
          cost: 40,
          reliability: 15,
          congestion: 10,
        });
        break;
      case "reliability":
        setCriteriaWeights({
          productivity: 10,
          dwellTime: 15,
          vesselWaitTime: 10,
          cost: 10,
          reliability: 40,
          congestion: 15,
        });
        break;
    }
  }, []);

  // Get congestion color
  const getCongestionColor = (level: Terminal["congestion"]) => {
    switch (level) {
      case "low": return "text-[var(--logistics)]";
      case "medium": return "text-yellow-600";
      case "high": return "text-orange-500";
      case "critical": return "text-red-500";
    }
  };

  // Get congestion badge
  const getCongestionBadge = (level: Terminal["congestion"]) => {
    const colors: Record<Terminal["congestion"], string> = {
      low: "bg-[var(--logistics)]/10 text-[var(--logistics)]",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      critical: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    };
    return colors[level];
  };

  // Get status badge
  const getStatusBadge = (status: Terminal["status"]) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-[var(--logistics)]">Operational</Badge>;
      case "limited":
        return <Badge variant="secondary">Limited</Badge>;
      case "congested":
        return <Badge variant="destructive">Congested</Badge>;
      case "closed":
        return <Badge variant="destructive">Closed</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="select" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Select Port
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Compare
          </TabsTrigger>
          <TabsTrigger value="coverage" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Carriers
          </TabsTrigger>
          <TabsTrigger value="recommend" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Recommend
          </TabsTrigger>
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Learn
          </TabsTrigger>
        </TabsList>

        {/* Select Port Tab */}
        <TabsContent value="select" className="space-y-6 mt-6">
          {/* Port Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="h-5 w-5 text-[var(--ocean)]" />
                Select Port
              </CardTitle>
              <CardDescription>
                Choose a port to view available terminals and their details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Port</Label>
                  <Select value={selectedPortCode} onValueChange={setSelectedPortCode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a port..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Ports</SelectItem>
                      {portsWithTerminals.map(port => (
                        <SelectItem key={port.unLoCode} value={port.unLoCode}>
                          {port.name} ({port.unLoCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Filter by Carrier</Label>
                  <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                    <SelectTrigger>
                      <SelectValue placeholder="All carriers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Carriers</SelectItem>
                      {MAJOR_CARRIERS.map(carrier => (
                        <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search terminals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Terminals List */}
          <div className="grid lg:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTerminals.map((terminal, index) => (
                <motion.div
                  key={terminal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover:border-[var(--ocean)]/50 ${
                      selectedTerminals.includes(terminal.id) ? "border-[var(--ocean)] bg-[var(--ocean)]/5" : ""
                    }`}
                    onClick={() => toggleTerminalSelection(terminal.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{terminal.name}</h3>
                          <p className="text-sm text-muted-foreground">{terminal.portName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(terminal.status)}
                          {selectedTerminals.includes(terminal.id) && (
                            <Badge className="bg-[var(--ocean)]">Selected</Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Operator</span>
                            <span className="font-medium truncate ml-2">{terminal.operator}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Type</span>
                            <Badge variant="outline" className="capitalize">{terminal.type}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Utilization</span>
                            <span className={terminal.currentUtilization > 85 ? "text-orange-500" : ""}>
                              {terminal.currentUtilization}%
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">THC</span>
                            <span className="font-medium">${terminal.thc}/TEU</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Productivity</span>
                            <span>{terminal.productivity} MPH</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Dwell Time</span>
                            <span>{terminal.dwellTime} days</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-muted-foreground">Congestion</span>
                        <Badge className={getCongestionBadge(terminal.congestion)}>
                          {terminal.congestion.charAt(0).toUpperCase() + terminal.congestion.slice(1)}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {terminal.carriers.slice(0, 5).map(carrier => (
                          <Badge key={carrier} variant="secondary" className="text-xs">
                            {carrier}
                          </Badge>
                        ))}
                        {terminal.carriers.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{terminal.carriers.length - 5}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{terminal.overallRating}</span>
                        <span className="text-muted-foreground text-sm">
                          ({terminal.customerSatisfaction}% satisfaction)
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTerminals.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Anchor className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No terminals found matching your criteria</p>
              </CardContent>
            </Card>
          )}

          {/* Selection Summary */}
          {selectedTerminals.length > 0 && (
            <Card className="border-[var(--ocean)]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[var(--ocean)]" />
                    <span>
                      {selectedTerminals.length} terminal{selectedTerminals.length > 1 ? "s" : ""} selected for comparison
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedTerminals([])}>
                      Clear
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-[var(--ocean)]"
                      onClick={() => setActiveTab("compare")}
                    >
                      Compare Now
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare" className="space-y-6 mt-6">
          {selectedTerminalDetails.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground mb-4">Select terminals from the Select Port tab to compare</p>
                <Button onClick={() => setActiveTab("select")}>
                  Select Terminals
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Quick Stats Comparison */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedTerminalDetails.map(terminal => (
                  <Card key={terminal.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{terminal.name}</CardTitle>
                      <CardDescription>{terminal.portName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Productivity</p>
                          <p className="font-semibold">{terminal.productivity} MPH</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Dwell Time</p>
                          <p className="font-semibold">{terminal.dwellTime} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Wait Time</p>
                          <p className="font-semibold">{terminal.vesselWaitTime}h</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">THC</p>
                          <p className="font-semibold">${terminal.thc}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Reliability</span>
                          <span className="font-semibold text-[var(--logistics)]">{terminal.reliability}%</span>
                        </div>
                        <Progress value={terminal.reliability} className="h-2 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Detailed Comparison Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="sticky left-0 bg-background">Metric</TableHead>
                          {selectedTerminalDetails.map(t => (
                            <TableHead key={t.id} className="min-w-[150px]">{t.name.split(" ")[0]}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Operator</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.operator}</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Annual Capacity</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{(t.annualCapacity / 1000000).toFixed(1)}M TEU</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Utilization</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>
                              <span className={t.currentUtilization > 85 ? "text-orange-500" : ""}>
                                {t.currentUtilization}%
                              </span>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Berth Length</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.berthLength}m</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Max Draft</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.maxDraft}m</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Cranes</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.cranes}</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Yard Capacity</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.yardCapacity.toLocaleString()} slots</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Reefer Points</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.reeferPoints.toLocaleString()}</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Productivity</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.productivity} moves/hr</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Dwell Time</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.dwellTime} days</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Vessel Wait Time</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.vesselWaitTime} hrs</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Gate Turn Time</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.gateTurnTime} min</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">THC (per TEU)</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>${t.thc}</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Storage Rate</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>${t.storageRate}/day</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Demurrage Free</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.demurrageFree} days</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Demurrage Rate</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>${t.demurrageRate}/day</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Weekly Services</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.services}</TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Rating</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {t.overallRating}
                              </div>
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Reliability</TableCell>
                          {selectedTerminalDetails.map(t => (
                            <TableCell key={t.id}>{t.reliability}%</TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Performance Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={comparisonChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="productivity" name="Productivity (MPH)" fill="CHART_COLORS.ocean" />
                        <Bar dataKey="dwellTime" name="Dwell Time (days)" fill="CHART_COLORS.logistics" />
                        <Bar dataKey="vesselWait" name="Vessel Wait (hrs)" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Radar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Metric Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        {selectedTerminalDetails.map((terminal, index) => (
                          <Radar
                            key={terminal.id}
                            name={terminal.name.split(" ")[0]}
                            dataKey={terminal.name.split(" ")[0]}
                            stroke={index === 0 ? "CHART_COLORS.ocean" : index === 1 ? "CHART_COLORS.logistics" : "#F59E0B"}
                            fill={index === 0 ? "CHART_COLORS.ocean" : index === 1 ? "CHART_COLORS.logistics" : "#F59E0B"}
                            fillOpacity={0.2}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Gate Hours Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock4 className="h-5 w-5 text-[var(--ocean)]" />
                    Gate Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Terminal</TableHead>
                        <TableHead>Weekdays</TableHead>
                        <TableHead>Weekends</TableHead>
                        <TableHead>Holidays</TableHead>
                        <TableHead>Extended</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTerminalDetails.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.name}</TableCell>
                          <TableCell>{t.gateHours.weekdays}</TableCell>
                          <TableCell>{t.gateHours.weekends}</TableCell>
                          <TableCell>{t.gateHours.holidays}</TableCell>
                          <TableCell>
                            {t.gateHours.extended ? (
                              <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Equipment Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-[var(--ocean)]" />
                    Equipment Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Terminal</TableHead>
                        <TableHead>RTG</TableHead>
                        <TableHead>Straddle</TableHead>
                        <TableHead>Reach Stackers</TableHead>
                        <TableHead>Forklifts</TableHead>
                        <TableHead>Empty Handlers</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTerminalDetails.map(t => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.name}</TableCell>
                          <TableCell>{t.equipment.rtg}</TableCell>
                          <TableCell>{t.equipment.straddleCarriers}</TableCell>
                          <TableCell>{t.equipment.reachStackers}</TableCell>
                          <TableCell>{t.equipment.forklifts}</TableCell>
                          <TableCell>{t.equipment.emptyHandlers}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Carrier Coverage Tab */}
        <TabsContent value="coverage" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--ocean)]" />
                Carrier Service Coverage
              </CardTitle>
              <CardDescription>
                View which carriers serve each terminal and service frequency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filter by carrier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Carriers</SelectItem>
                    {MAJOR_CARRIERS.map(carrier => (
                      <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>Terminal</TableHead>
                      <TableHead>Port</TableHead>
                      <TableHead>Carriers</TableHead>
                      <TableHead>Weekly Services</TableHead>
                      <TableHead>Features</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTerminals.map(terminal => (
                      <TableRow key={terminal.id}>
                        <TableCell className="font-medium">{terminal.name}</TableCell>
                        <TableCell>{terminal.portName}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {terminal.carriers.map(carrier => (
                              <Badge 
                                key={carrier} 
                                variant={selectedCarrier === carrier ? "default" : "outline"}
                                className="text-xs"
                              >
                                {carrier}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[var(--ocean)]">{terminal.services}/wk</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {terminal.features.slice(0, 3).map(feature => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {terminal.features.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{terminal.features.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommend Tab */}
        <TabsContent value="recommend" className="space-y-6 mt-6">
          {/* Priority Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                Terminal Recommendation Engine
              </CardTitle>
              <CardDescription>
                Get personalized terminal recommendations based on your priorities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { id: "balanced", label: "Balanced", icon: ArrowRightLeft, desc: "Equal weight on all factors" },
                  { id: "speed", label: "Speed Priority", icon: Zap, desc: "Fastest operations & transit" },
                  { id: "cost", label: "Cost Priority", icon: DollarSign, desc: "Lowest terminal costs" },
                  { id: "reliability", label: "Reliability Priority", icon: Shield, desc: "Most dependable service" },
                ].map(preset => (
                  <Card 
                    key={preset.id}
                    className={`cursor-pointer transition-all ${
                      priorityMode === preset.id 
                        ? "border-[var(--ocean)] bg-[var(--ocean)]/5" 
                        : "hover:border-muted-foreground/50"
                    }`}
                    onClick={() => applyPresetWeights(preset.id as typeof priorityMode)}
                  >
                    <CardContent className="p-4 text-center">
                      <preset.icon className={`h-8 w-8 mx-auto mb-2 ${
                        priorityMode === preset.id ? "text-[var(--ocean)]" : "text-muted-foreground"
                      }`} />
                      <h3 className="font-semibold">{preset.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{preset.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Custom Weights */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  Custom Weights (Optional)
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: "productivity", label: "Productivity", icon: Gauge },
                    { key: "dwellTime", label: "Dwell Time", icon: Timer },
                    { key: "vesselWaitTime", label: "Vessel Wait Time", icon: Clock },
                    { key: "cost", label: "Cost", icon: DollarSign },
                    { key: "reliability", label: "Reliability", icon: Shield },
                    { key: "congestion", label: "Congestion Level", icon: TrendingUp },
                  ].map(criteria => (
                    <div key={criteria.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          <criteria.icon className="h-4 w-4 text-[var(--ocean)]" />
                          {criteria.label}
                        </Label>
                        <span className="text-sm font-medium">{criteriaWeights[criteria.key as keyof CriteriaWeights]}%</span>
                      </div>
                      <Slider
                        value={[criteriaWeights[criteria.key as keyof CriteriaWeights]]}
                        onValueChange={([value]) => 
                          setCriteriaWeights(prev => ({ ...prev, [criteria.key]: value }))
                        }
                        max={50}
                        step={5}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Recommended Terminals</CardTitle>
              <CardDescription>
                Ranked by your selected priorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {terminalScores.slice(0, 10).map((item, index) => (
                  <motion.div
                    key={item.terminal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={index === 0 ? "border-[var(--logistics)] bg-[var(--logistics)]/5" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {index === 0 ? (
                              <div className="w-10 h-10 rounded-full bg-[var(--logistics)] flex items-center justify-center">
                                <Award className="h-5 w-5 text-white" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <span className="font-semibold">{index + 1}</span>
                              </div>
                            )}
                            <div>
                              <h3 className="font-semibold">{item.terminal.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.terminal.portName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-[var(--ocean)]">
                              {item.weightedScore.toFixed(1)}
                            </div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-3">
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <Gauge className="h-4 w-4 mx-auto mb-1 text-[var(--ocean)]" />
                            <div className="text-xs text-muted-foreground">Productivity</div>
                            <div className="font-semibold">{item.scores.productivity.toFixed(0)}</div>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <Timer className="h-4 w-4 mx-auto mb-1 text-[var(--ocean)]" />
                            <div className="text-xs text-muted-foreground">Dwell</div>
                            <div className="font-semibold">{item.scores.dwellTime.toFixed(0)}</div>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <Clock className="h-4 w-4 mx-auto mb-1 text-[var(--ocean)]" />
                            <div className="text-xs text-muted-foreground">Wait</div>
                            <div className="font-semibold">{item.scores.vesselWait.toFixed(0)}</div>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <DollarSign className="h-4 w-4 mx-auto mb-1 text-[var(--ocean)]" />
                            <div className="text-xs text-muted-foreground">Cost</div>
                            <div className="font-semibold">{item.scores.cost.toFixed(0)}</div>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <Shield className="h-4 w-4 mx-auto mb-1 text-[var(--ocean)]" />
                            <div className="text-xs text-muted-foreground">Reliability</div>
                            <div className="font-semibold">{item.scores.reliability.toFixed(0)}</div>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-[var(--ocean)]" />
                            <div className="text-xs text-muted-foreground">Congestion</div>
                            <div className="font-semibold">{item.scores.congestion.toFixed(0)}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getCongestionBadge(item.terminal.congestion)}>
                              {item.terminal.congestion} congestion
                            </Badge>
                            {getStatusBadge(item.terminal.status)}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!selectedTerminals.includes(item.terminal.id)) {
                                toggleTerminalSelection(item.terminal.id);
                              }
                              setActiveTab("compare");
                            }}
                          >
                            Compare
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learn Tab */}
        <TabsContent value="learn" className="space-y-6 mt-6">
          {/* Terminal Selection Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                Terminal Selection Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Choosing the right terminal can significantly impact your supply chain efficiency, costs, and reliability. 
                Here are the key factors to consider when selecting a container terminal.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Productivity",
                    icon: Gauge,
                    desc: "Moves per hour (MPH) - Higher productivity means faster vessel turnaround and reduced delays.",
                    tip: "Look for terminals with >30 MPH for time-sensitive cargo.",
                  },
                  {
                    title: "Dwell Time",
                    icon: Timer,
                    desc: "Average time containers stay in the yard before being picked up. Lower is better.",
                    tip: "Dwell times under 5 days indicate efficient yard operations.",
                  },
                  {
                    title: "Vessel Wait Time",
                    icon: Clock,
                    desc: "Time vessels spend waiting for a berth. Lower times reduce schedule delays.",
                    tip: "Wait times under 12 hours are considered good performance.",
                  },
                  {
                    title: "Terminal Costs",
                    icon: DollarSign,
                    desc: "THC, storage rates, and demurrage charges can significantly impact landed costs.",
                    tip: "Factor in free days when comparing demurrage costs.",
                  },
                  {
                    title: "Reliability",
                    icon: Shield,
                    desc: "Consistency of service and adherence to schedules. Critical for supply chain planning.",
                    tip: "Terminals with >90% reliability offer predictable operations.",
                  },
                  {
                    title: "Congestion Level",
                    icon: TrendingUp,
                    desc: "Current yard utilization and operational constraints. High congestion causes delays.",
                    tip: "Avoid terminals with critical congestion levels during peak seasons.",
                  },
                ].map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <item.icon className="h-6 w-6 text-[var(--ocean)] shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                          <div className="mt-2 p-2 bg-[var(--ocean)]/10 rounded text-sm">
                            <strong>Tip:</strong> {item.tip}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Understanding Terminal Types */}
          <Card>
            <CardHeader>
              <CardTitle>Understanding Terminal Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: "Container Terminal", desc: "Dedicated to container handling with specialized equipment", suitable: "All containerized cargo" },
                  { type: "Multi-Purpose", desc: "Handles various cargo types including containers, breakbulk, and RoRo", suitable: "Mixed cargo shipments" },
                  { type: "RoRo Terminal", desc: "Specialized for roll-on/roll-off cargo like vehicles and trailers", suitable: "Automotive, project cargo" },
                  { type: "Bulk Terminal", desc: "Handles dry bulk commodities like grain, coal, and ores", suitable: "Bulk commodities" },
                  { type: "Tanker Terminal", desc: "Specialized for liquid bulk including petroleum and chemicals", suitable: "Liquid bulk, chemicals" },
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{item.type}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                    <Badge variant="outline">Best for: {item.suitable}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gate Hours Explained */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock4 className="h-5 w-5 text-[var(--ocean)]" />
                Gate Hours & Their Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Terminal gate hours determine when trucks can pick up or deliver containers. Extended gate hours 
                provide greater flexibility for shippers and can help avoid congestion during peak times.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-[var(--ocean)]" />
                    <h4 className="font-semibold">Standard Hours</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Typically 8am-5pm on weekdays. May require appointment systems during peak periods.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock4 className="h-8 w-8 mx-auto mb-2 text-[var(--logistics)]" />
                    <h4 className="font-semibold">Extended Hours</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Early morning to late evening operations. Better for time-sensitive deliveries and avoiding congestion.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <TimerIcon className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <h4 className="font-semibold">24/7 Operations</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      Round-the-clock gate access. Maximum flexibility for shippers and reduced wait times.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400">Peak Season Considerations</h4>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                      During peak shipping seasons (Q3-Q4), many terminals implement extended gate hours and appointment 
                      systems. Plan ahead and book slots early to avoid delays.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demurrage & Storage */}
          <Card>
            <CardHeader>
              <CardTitle>Understanding Demurrage & Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="demurrage">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[var(--ocean)]" />
                      What is Demurrage?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Demurrage is a charge imposed by the terminal when containers remain in the yard beyond 
                      the allowed free days. It&apos;s designed to encourage timely pickup and prevent yard congestion.
                    </p>
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <h5 className="font-semibold mb-2">Example Calculation:</h5>
                      <p className="text-sm">
                        If a terminal offers 5 free days and charges $25/TEU/day thereafter:
                      </p>
                      <ul className="text-sm mt-2 space-y-1">
                        <li>• Container picked up on day 4: <span className="text-[var(--logistics)]">$0 demurrage</span></li>
                        <li>• Container picked up on day 8: <span className="text-orange-500">$75 demurrage (3 days × $25)</span></li>
                        <li>• Container picked up on day 15: <span className="text-red-500">$250 demurrage (10 days × $25)</span></li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="storage">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Warehouse className="h-4 w-4 text-[var(--ocean)]" />
                      What is Storage?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Storage charges apply separately from demurrage and are based on the space your container 
                      occupies in the terminal yard. These charges may apply from day one or after a certain period.
                    </p>
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h5 className="font-semibold mb-2">Storage Types</h5>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Ground rent:</strong> Daily charge for yard space</li>
                          <li>• <strong>Reefer storage:</strong> Higher rate for reefer plugs</li>
                          <li>• <strong>Hazardous storage:</strong> Premium for dangerous goods</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h5 className="font-semibold mb-2">Tips to Minimize Costs</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Use terminals with longer free periods</li>
                          <li>• Coordinate pickup with vessel arrival</li>
                          <li>• Consider off-peak pickup times</li>
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="thc">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Container className="h-4 w-4 text-[var(--ocean)]" />
                      What is THC?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">
                      Terminal Handling Charge (THC) is a fee charged by the terminal for handling containers. 
                      It covers loading/unloading from vessels, yard handling, and gate operations.
                    </p>
                    <div className="mt-4">
                      <h5 className="font-semibold mb-2">THC Components:</h5>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <Ship className="h-6 w-6 mx-auto mb-2 text-[var(--ocean)]" />
                          <p className="text-sm font-medium">Quay Transfer</p>
                          <p className="text-xs text-muted-foreground">Vessel to yard</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <Warehouse className="h-6 w-6 mx-auto mb-2 text-[var(--ocean)]" />
                          <p className="text-sm font-medium">Yard Handling</p>
                          <p className="text-xs text-muted-foreground">Storage & stacking</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <Truck className="h-6 w-6 mx-auto mb-2 text-[var(--ocean)]" />
                          <p className="text-sm font-medium">Gate Operations</p>
                          <p className="text-xs text-muted-foreground">Check-in/out</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle>Best Practices for Terminal Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Plan for Peak Seasons",
                    tips: [
                      "Book slots early during Q3-Q4",
                      "Use terminals with extended gate hours",
                      "Consider alternative ports during congestion",
                    ],
                  },
                  {
                    title: "Consider Total Landed Cost",
                    tips: [
                      "Compare THC, storage, and demurrage rates",
                      "Factor in trucking costs from terminal",
                      "Include dwell time in inventory costs",
                    ],
                  },
                  {
                    title: "Match Terminal to Cargo Type",
                    tips: [
                      "Use reefer-capable terminals for perishables",
                      "Verify dangerous goods handling capabilities",
                      "Check OOG cargo facilities for oversized items",
                    ],
                  },
                  {
                    title: "Monitor Terminal Performance",
                    tips: [
                      "Track vessel wait times and delays",
                      "Monitor congestion levels regularly",
                      "Subscribe to terminal notifications",
                    ],
                  },
                ].map((section, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">{section.title}</h4>
                      <ul className="space-y-2">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Shield icon component (missing from lucide imports)
function Shield({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

// Sliders icon component
function Sliders({ className }: { className?: string }) {
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
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}
