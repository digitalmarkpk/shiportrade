"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Package,
  Clock,
  AlertTriangle,
  Bell,
  BellRing,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Snowflake,
  Sun,
  RefreshCw,
  Settings,
  Shield,
  Calendar,
  Gauge,
  Info,
  BarChart3,
  LineChart,
  Zap,
  Truck,
  MapPin,
  Anchor,
  Plane,
  Ship,
  HelpCircle,
  ChevronRight,
  PieChart,
  Target,
  Award,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Product type definitions with temperature requirements
const productTypes = {
  fresh_produce: {
    name: "Fresh Produce",
    icon: "🥬",
    category: "Fresh",
    tempMin: 0,
    tempMax: 12,
    humidityMin: 85,
    humidityMax: 95,
    maxShelfLife: 21,
    riskLevel: "medium",
    regulations: ["HACCP", "FDA Food Safety"],
  },
  frozen_foods: {
    name: "Frozen Foods",
    icon: "🧊",
    category: "Frozen",
    tempMin: -25,
    tempMax: -18,
    humidityMin: 0,
    humidityMax: 100,
    maxShelfLife: 365,
    riskLevel: "high",
    regulations: ["FDA Frozen Food", "HACCP"],
  },
  dairy_products: {
    name: "Dairy Products",
    icon: "🧀",
    category: "Chilled",
    tempMin: 0,
    tempMax: 4,
    humidityMin: 80,
    humidityMax: 90,
    maxShelfLife: 30,
    riskLevel: "high",
    regulations: ["FDA Dairy", "Pasteurized Milk Ordinance"],
  },
  meat_poultry: {
    name: "Meat & Poultry",
    icon: "🥩",
    category: "Chilled",
    tempMin: -2,
    tempMax: 4,
    humidityMin: 85,
    humidityMax: 95,
    maxShelfLife: 14,
    riskLevel: "critical",
    regulations: ["USDA FSIS", "HACCP", "FDA Food Safety"],
  },
  seafood: {
    name: "Seafood",
    icon: "🐟",
    category: "Chilled",
    tempMin: -2,
    tempMax: 2,
    humidityMin: 90,
    humidityMax: 100,
    maxShelfLife: 7,
    riskLevel: "critical",
    regulations: ["FDA Seafood HACCP", "EU Regulation 853/2004"],
  },
  pharmaceuticals: {
    name: "Pharmaceuticals",
    icon: "💊",
    category: "Pharma",
    tempMin: 2,
    tempMax: 8,
    humidityMin: 30,
    humidityMax: 65,
    maxShelfLife: 730,
    riskLevel: "critical",
    regulations: ["GDP", "WHO TRS 961", "EU GDP Guidelines"],
  },
  vaccines: {
    name: "Vaccines",
    icon: "💉",
    category: "Pharma",
    tempMin: 2,
    tempMax: 8,
    humidityMin: 20,
    humidityMax: 60,
    maxShelfLife: 365,
    riskLevel: "critical",
    regulations: ["WHO PQS", "UNICEF SDP", "GDP"],
  },
  beverages: {
    name: "Beverages",
    icon: "🥤",
    category: "Chilled",
    tempMin: 2,
    tempMax: 8,
    humidityMin: 50,
    humidityMax: 80,
    maxShelfLife: 180,
    riskLevel: "low",
    regulations: ["FDA Beverages"],
  },
  chocolates: {
    name: "Chocolates & Confectionery",
    icon: "🍫",
    category: "Temperature Sensitive",
    tempMin: 10,
    tempMax: 18,
    humidityMin: 40,
    humidityMax: 70,
    maxShelfLife: 365,
    riskLevel: "medium",
    regulations: ["FDA Food Safety"],
  },
  chemicals: {
    name: "Temperature-Sensitive Chemicals",
    icon: "🧪",
    category: "Industrial",
    tempMin: 5,
    tempMax: 25,
    humidityMin: 30,
    humidityMax: 70,
    maxShelfLife: 365,
    riskLevel: "high",
    regulations: ["REACH", "OSHA"],
  },
};

// Temperature excursion record
interface ExcursionRecord {
  id: string;
  timestamp: Date;
  type: "high" | "low";
  duration: number;
  deviation: number;
  resolved: boolean;
  location: string;
}

// Alert configuration
interface AlertConfig {
  id: string;
  type: "temperature" | "humidity" | "duration";
  threshold: number;
  enabled: boolean;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyDashboard: boolean;
}

// Compliance check result
interface ComplianceResult {
  standard: string;
  status: "compliant" | "warning" | "violation";
  details: string;
  lastCheck: Date;
}

// FAQ item
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

// Mock data generators
const generateTemperatureData = (baseTemp: number, hours: number = 48) => {
  const data = [];
  const now = new Date();
  for (let i = hours; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    const variation = (Math.random() - 0.5) * 3;
    data.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      fullTime: time,
      temperature: baseTemp + variation,
      humidity: 85 + (Math.random() - 0.5) * 10,
      setpoint: baseTemp,
    });
  }
  return data;
};

const generateExcursions = (baseTemp: number, tempMin: number, tempMax: number): ExcursionRecord[] => {
  const excursions: ExcursionRecord[] = [];
  const now = new Date();
  
  const numExcursions = Math.floor(Math.random() * 4);
  for (let i = 0; i < numExcursions; i++) {
    const hoursAgo = Math.floor(Math.random() * 48);
    const isHigh = Math.random() > 0.5;
    excursions.push({
      id: `ex-${i}`,
      timestamp: new Date(now.getTime() - hoursAgo * 60 * 60 * 1000),
      type: isHigh ? "high" : "low",
      duration: Math.floor(Math.random() * 120) + 5,
      deviation: Math.random() * 5 + 1,
      resolved: Math.random() > 0.3,
      location: ["Warehouse A", "Transit - Port", "Container #RFEU1234567"][Math.floor(Math.random() * 3)],
    });
  }
  return excursions;
};

const generateComplianceHistory = () => {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: 85 + Math.random() * 15,
      excursions: Math.floor(Math.random() * 3),
    });
  }
  return data;
};

// FAQ data
const faqData: FAQItem[] = [
  {
    question: "What is cold chain monitoring?",
    answer: "Cold chain monitoring is the process of tracking temperature-sensitive products throughout the supply chain to ensure they remain within required temperature ranges. This involves using sensors, data loggers, and monitoring systems to track temperature, humidity, and other environmental conditions from production to final delivery.",
    category: "Basics",
  },
  {
    question: "Why is temperature control important in cold chain logistics?",
    answer: "Temperature control is critical because deviations can lead to product spoilage, reduced efficacy (especially for pharmaceuticals), food safety risks, and regulatory non-compliance. Even brief temperature excursions can compromise product quality and safety, leading to financial losses and potential health hazards.",
    category: "Basics",
  },
  {
    question: "What is the Q10 rule in shelf life calculation?",
    answer: "The Q10 rule states that for every 10°C increase in temperature, the rate of quality deterioration typically doubles (Q10 ≈ 2). This means that if a product has a 30-day shelf life at 4°C but is stored at 14°C (10°C higher), the shelf life would be reduced to approximately 15 days.",
    category: "Shelf Life",
  },
  {
    question: "What are the regulatory requirements for pharmaceutical cold chain?",
    answer: "Key pharmaceutical cold chain regulations include: Good Distribution Practice (GDP) guidelines, WHO TRS 961 technical requirements, 21 CFR Part 211 for cGMP compliance, and EU GDP Guidelines. These require temperature monitoring, documentation, validated equipment, and trained personnel.",
    category: "Regulations",
  },
  {
    question: "How do I handle a temperature excursion?",
    answer: "When a temperature excursion occurs: 1) Document the event immediately with timestamp and duration, 2) Assess the deviation magnitude and product impact, 3) Quarantine affected products, 4) Consult stability data to determine product viability, 5) Implement corrective actions, 6) Report to relevant authorities if required by regulations.",
    category: "Operations",
  },
  {
    question: "What is the difference between shelf life and remaining shelf life?",
    answer: "Shelf life is the total duration a product can be stored under specified conditions while maintaining quality. Remaining shelf life is the time left before the product expires, which can be reduced by temperature excursions, transit time, and storage conditions. Our calculator uses the Q10 rule to estimate impact on remaining shelf life.",
    category: "Shelf Life",
  },
  {
    question: "How often should temperature readings be recorded?",
    answer: "Recording frequency depends on the product and regulations. FDA FSMA requires 'adequate frequency' - typically every 15-30 minutes for perishables. GDP guidelines recommend continuous monitoring with recordings at least every 15 minutes for pharmaceuticals. High-risk products may require more frequent monitoring.",
    category: "Operations",
  },
  {
    question: "What are the most common cold chain mistakes?",
    answer: "Common mistakes include: insufficient pre-cooling of containers, gaps in monitoring during transfers, improper calibration of sensors, inadequate staff training, lack of contingency plans for delays, and poor documentation practices. Many losses can be prevented with proper planning and monitoring.",
    category: "Best Practices",
  },
];

export function ColdChainMonitor() {
  // Core state
  const [productType, setProductType] = useState<string>("fresh_produce");
  const [currentTemp, setCurrentTemp] = useState<number>(4.2);
  const [currentHumidity, setCurrentHumidity] = useState<number>(88);
  const [transitDuration, setTransitDuration] = useState<number>(14);
  const [elapsedTime, setElapsedTime] = useState<number>(6);
  const [originLocation, setOriginLocation] = useState<string>("Shanghai, CN");
  const [destinationLocation, setDestinationLocation] = useState<string>("Los Angeles, US");
  const [containerId, setContainerId] = useState<string>("RFEU1234567");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Alert state
  const [alerts, setAlerts] = useState<AlertConfig[]>([
    { id: "temp-high", type: "temperature", threshold: 2, enabled: true, notifyEmail: true, notifySms: false, notifyDashboard: true },
    { id: "temp-low", type: "temperature", threshold: 2, enabled: true, notifyEmail: true, notifySms: true, notifyDashboard: true },
    { id: "humidity-high", type: "humidity", threshold: 10, enabled: true, notifyEmail: false, notifySms: false, notifyDashboard: true },
    { id: "duration-exceeded", type: "duration", threshold: 100, enabled: true, notifyEmail: true, notifySms: true, notifyDashboard: true },
  ]);
  
  // UI state
  const [showAlertConfig, setShowAlertConfig] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [temperatureData, setTemperatureData] = useState<Array<{time: string; fullTime: Date; temperature: number; humidity: number; setpoint: number}>>([]);
  const [excursions, setExcursions] = useState<ExcursionRecord[]>([]);
  const [complianceHistory, setComplianceHistory] = useState<Array<{date: string; score: number; excursions: number}>>([]);

  // Get selected product configuration
  const selectedProduct = productTypes[productType as keyof typeof productTypes];

  // Initialize data on product change
  useEffect(() => {
    const avgTemp = (selectedProduct.tempMin + selectedProduct.tempMax) / 2;
    const data = generateTemperatureData(avgTemp);
    const timeoutId = setTimeout(() => {
      setTemperatureData(data);
      setExcursions(generateExcursions(avgTemp, selectedProduct.tempMin, selectedProduct.tempMax));
      setComplianceHistory(generateComplianceHistory());
      setCurrentTemp(avgTemp + (Math.random() - 0.5) * 2);
      setCurrentHumidity((selectedProduct.humidityMin + selectedProduct.humidityMax) / 2);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [productType, selectedProduct]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoring) return;
    
    const interval = setInterval(() => {
      const avgTemp = (selectedProduct.tempMin + selectedProduct.tempMax) / 2;
      setCurrentTemp(prev => avgTemp + (Math.random() - 0.5) * 2);
      setCurrentHumidity(prev => {
        const avgHumidity = (selectedProduct.humidityMin + selectedProduct.humidityMax) / 2;
        return avgHumidity + (Math.random() - 0.5) * 5;
      });
      setElapsedTime(prev => Math.min(prev + 1/60, transitDuration * 24));
    }, 5000);

    return () => clearInterval(interval);
  }, [isMonitoring, selectedProduct, transitDuration]);

  // Calculate shelf life impact
  const shelfLifeImpact = useMemo(() => {
    const tempDeviation = Math.max(
      0,
      currentTemp - selectedProduct.tempMax,
      selectedProduct.tempMin - currentTemp
    );
    
    const q10Factor = Math.pow(2, tempDeviation / 10);
    const remainingShelfLife = selectedProduct.maxShelfLife / q10Factor;
    const reductionPercent = ((selectedProduct.maxShelfLife - remainingShelfLife) / selectedProduct.maxShelfLife) * 100;
    const transitImpact = (elapsedTime / 24) / selectedProduct.maxShelfLife * 100;
    
    return {
      originalShelfLife: selectedProduct.maxShelfLife,
      remainingShelfLife: Math.max(0, remainingShelfLife - elapsedTime / 24),
      reductionPercent,
      transitImpact,
      totalImpact: Math.min(100, reductionPercent + transitImpact * 10),
      qualityScore: Math.max(0, 100 - reductionPercent - transitImpact * 5),
    };
  }, [currentTemp, selectedProduct, elapsedTime]);

  // Calculate compliance status
  const complianceStatus = useMemo<ComplianceResult[]>(() => {
    const results: ComplianceResult[] = [];
    const now = new Date();
    
    const tempInRange = currentTemp >= selectedProduct.tempMin && currentTemp <= selectedProduct.tempMax;
    results.push({
      standard: "Temperature Range",
      status: tempInRange ? "compliant" : "violation",
      details: tempInRange 
        ? `Temperature ${currentTemp.toFixed(1)}°C within range [${selectedProduct.tempMin}°C to ${selectedProduct.tempMax}°C]`
        : `Temperature ${currentTemp.toFixed(1)}°C outside required range`,
      lastCheck: now,
    });

    const humidityInRange = currentHumidity >= selectedProduct.humidityMin && currentHumidity <= selectedProduct.humidityMax;
    results.push({
      standard: "Humidity Range",
      status: humidityInRange ? "compliant" : "warning",
      details: humidityInRange
        ? `Humidity ${currentHumidity.toFixed(0)}% within range [${selectedProduct.humidityMin}% to ${selectedProduct.humidityMax}%]`
        : `Humidity ${currentHumidity.toFixed(0)}% outside optimal range`,
      lastCheck: now,
    });

    const durationOk = elapsedTime / 24 <= transitDuration;
    results.push({
      standard: "Transit Duration",
      status: durationOk ? "compliant" : "warning",
      details: durationOk
        ? `Transit ${(elapsedTime / 24).toFixed(1)} days within planned ${transitDuration} days`
        : `Transit duration approaching limit`,
      lastCheck: now,
    });

    const unresolvedExcursions = excursions.filter(e => !e.resolved).length;
    results.push({
      standard: "Temperature Excursions",
      status: unresolvedExcursions === 0 ? "compliant" : unresolvedExcursions < 2 ? "warning" : "violation",
      details: unresolvedExcursions === 0
        ? "No unresolved temperature excursions"
        : `${unresolvedExcursions} unresolved excursion(s) detected`,
      lastCheck: now,
    });

    selectedProduct.regulations.forEach((reg) => {
      results.push({
        standard: reg,
        status: tempInRange && humidityInRange ? "compliant" : "warning",
        details: tempInRange && humidityInRange
          ? "All parameters within specifications"
          : "Parameters require attention",
        lastCheck: now,
      });
    });

    return results;
  }, [currentTemp, currentHumidity, selectedProduct, elapsedTime, transitDuration, excursions]);

  // Get temperature status
  const getTempStatus = () => {
    if (currentTemp < selectedProduct.tempMin) return "low";
    if (currentTemp > selectedProduct.tempMax) return "high";
    return "optimal";
  };

  // Get humidity status
  const getHumidityStatus = () => {
    if (currentHumidity < selectedProduct.humidityMin) return "low";
    if (currentHumidity > selectedProduct.humidityMax) return "high";
    return "optimal";
  };

  // Get risk level color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-amber-500";
      case "low": return "text-green-500";
      default: return "text-muted-foreground";
    }
  };

  const getRiskBg = (risk: string) => {
    switch (risk) {
      case "critical": return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
      case "high": return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
      case "medium": return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
      case "low": return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
      default: return "bg-muted";
    }
  };

  const tempStatus = getTempStatus();
  const humidityStatus = getHumidityStatus();

  // Pie chart data for cost breakdown
  const costBreakdownData = [
    { name: "Refrigeration", value: 45, color: OCEAN_BLUE },
    { name: "Monitoring", value: 20, color: LOGISTICS_GREEN },
    { name: "Handling", value: 15, color: "#F59E0B" },
    { name: "Insurance", value: 12, color: "#8B5CF6" },
    { name: "Documentation", value: 8, color: "#EC4899" },
  ];

  // Journey milestones
  const journeyMilestones = [
    { id: 1, name: "Origin Warehouse", location: originLocation, status: "completed", time: "Day 0" },
    { id: 2, name: "Port of Loading", location: "Shanghai Port", status: "completed", time: "Day 2" },
    { id: 3, name: "In Transit", location: "Pacific Ocean", status: "active", time: `Day ${(elapsedTime / 24).toFixed(0)}` },
    { id: 4, name: "Port of Discharge", location: "Los Angeles Port", status: "pending", time: `Est. Day ${transitDuration - 2}` },
    { id: 5, name: "Final Destination", location: destinationLocation, status: "pending", time: `Est. Day ${transitDuration}` },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Snowflake className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Cold Chain Monitor</h1>
                  <p className="text-white/80 text-sm">Real-time temperature & compliance tracking</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {selectedProduct.icon} {selectedProduct.name}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  Container: {containerId}
                </Badge>
                <Badge className={`${isMonitoring ? "bg-[#2E8B57]" : "bg-gray-500"} text-white border-0`}>
                  {isMonitoring ? "● Live" : "○ Paused"}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <motion.div
                  key={currentTemp}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold"
                >
                  {currentTemp.toFixed(1)}°C
                </motion.div>
                <div className="text-xs text-white/70 mt-1">Temperature</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <motion.div
                  key={currentHumidity}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-3xl font-bold"
                >
                  {currentHumidity.toFixed(0)}%
                </motion.div>
                <div className="text-xs text-white/70 mt-1">Humidity</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{(elapsedTime / 24).toFixed(1)}</div>
                <div className="text-xs text-white/70 mt-1">Days in Transit</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl font-bold">{complianceStatus.filter(c => c.status === "compliant").length}</div>
                <div className="text-xs text-white/70 mt-1">Compliance Items</div>
              </div>
            </div>
          </div>
          
          {/* Journey Progress Bar */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {originLocation}
              </span>
              <span className="flex items-center gap-2">
                {destinationLocation}
                <MapPin className="h-4 w-4" />
              </span>
            </div>
            <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full bg-[#2E8B57] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(elapsedTime / 24) / transitDuration * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute right-0 h-full w-4 bg-white/30 rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-2">
              <span>Departed: 6 days ago</span>
              <span>ETA: {transitDuration - Math.floor(elapsedTime / 24)} days remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Monitoring</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-[#0F4C81]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
                    <Thermometer className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Temperature</div>
                    <div className="font-semibold text-lg">{currentTemp.toFixed(1)}°C</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#2E8B57]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#2E8B57]/10 flex items-center justify-center">
                    <Droplets className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="font-semibold text-lg">{currentHumidity.toFixed(0)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Excursions</div>
                    <div className="font-semibold text-lg">{excursions.filter(e => !e.resolved).length} Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Quality Score</div>
                    <div className="font-semibold text-lg">{shelfLifeImpact.qualityScore.toFixed(0)}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Product Configuration */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Product Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Product Type</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {Object.entries(productTypes).map(([key, product]) => (
                        <SelectItem key={key} value={key}>
                          {product.icon} {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className={`p-3 rounded-lg ${getRiskBg(selectedProduct.riskLevel)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{selectedProduct.icon} {selectedProduct.name}</span>
                    <Badge variant="outline" className={getRiskColor(selectedProduct.riskLevel)}>
                      {selectedProduct.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Temp: {selectedProduct.tempMin}°C to {selectedProduct.tempMax}°C</div>
                    <div>Humidity: {selectedProduct.humidityMin}% to {selectedProduct.humidityMax}%</div>
                    <div>Max Shelf: {selectedProduct.maxShelfLife} days</div>
                    <div>Category: {selectedProduct.category}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="container">Container ID</Label>
                    <Input
                      id="container"
                      value={containerId}
                      onChange={(e) => setContainerId(e.target.value)}
                      placeholder="RFEU1234567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transit">Transit (days)</Label>
                    <Input
                      id="transit"
                      type="number"
                      value={transitDuration}
                      onChange={(e) => setTransitDuration(parseInt(e.target.value) || 1)}
                      min={1}
                      max={60}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Temperature Gauge */}
            <Card className={tempStatus !== "optimal" ? "border-red-200 dark:border-red-800" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Thermometer className="h-5 w-5" style={{ color: tempStatus === "optimal" ? LOGISTICS_GREEN : "#ef4444" }} />
                    Temperature
                  </CardTitle>
                  <Badge 
                    variant={tempStatus === "optimal" ? "default" : "destructive"}
                    style={tempStatus === "optimal" ? { backgroundColor: LOGISTICS_GREEN } : {}}
                  >
                    {tempStatus === "optimal" ? "OPTIMAL" : tempStatus === "high" ? "HIGH" : "LOW"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <motion.div
                    key={currentTemp}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-bold"
                    style={{ color: tempStatus === "optimal" ? LOGISTICS_GREEN : "#ef4444" }}
                  >
                    {currentTemp.toFixed(1)}°C
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Target: {selectedProduct.tempMin}°C to {selectedProduct.tempMax}°C
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Snowflake className="h-4 w-4 text-blue-400" />
                      Min Threshold
                    </span>
                    <span className={currentTemp < selectedProduct.tempMin ? "text-red-500 font-medium" : ""}>
                      {selectedProduct.tempMin}°C
                    </span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-to-r from-blue-400 to-red-400 opacity-30"
                      style={{ left: `${Math.max(0, (selectedProduct.tempMin + 30) / 60 * 100)}%`, right: `${Math.max(0, 100 - (selectedProduct.tempMax + 30) / 60 * 100)}%` }}
                    />
                    <div 
                      className="absolute h-full"
                      style={{ 
                        left: `${Math.max(0, (selectedProduct.tempMin + 30) / 60 * 100)}%`, 
                        right: `${Math.max(0, 100 - (selectedProduct.tempMax + 30) / 60 * 100)}%`,
                        backgroundColor: LOGISTICS_GREEN,
                        opacity: 0.5
                      }}
                    />
                    <motion.div
                      className="absolute top-1/2 w-4 h-4 bg-white border-2 rounded-full shadow-lg"
                      style={{ 
                        left: `${Math.min(100, Math.max(0, (currentTemp + 30) / 60 * 100))}%`, 
                        transform: "translateX(-50%) translateY(-50%)",
                        borderColor: tempStatus === "optimal" ? LOGISTICS_GREEN : "#ef4444"
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Sun className="h-4 w-4 text-orange-400" />
                      Max Threshold
                    </span>
                    <span className={currentTemp > selectedProduct.tempMax ? "text-red-500 font-medium" : ""}>
                      {selectedProduct.tempMax}°C
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Humidity Gauge */}
            <Card className={humidityStatus !== "optimal" && selectedProduct.humidityMax < 100 ? "border-amber-200 dark:border-amber-800" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Droplets className="h-5 w-5" style={{ color: humidityStatus === "optimal" ? OCEAN_BLUE : "#f59e0b" }} />
                    Humidity
                  </CardTitle>
                  <Badge 
                    variant={humidityStatus === "optimal" ? "secondary" : "outline"}
                    className={humidityStatus !== "optimal" ? "border-amber-500 text-amber-600" : ""}
                  >
                    {humidityStatus === "optimal" ? "OPTIMAL" : humidityStatus === "high" ? "HIGH" : "LOW"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <motion.div
                    key={currentHumidity}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-bold"
                    style={{ color: humidityStatus === "optimal" ? OCEAN_BLUE : "#f59e0b" }}
                  >
                    {currentHumidity.toFixed(0)}%
                  </motion.div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Target: {selectedProduct.humidityMin}% to {selectedProduct.humidityMax}%
                  </div>
                </div>

                <div className="space-y-3">
                  <Progress 
                    value={currentHumidity} 
                    className="h-3"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Dry</span>
                    <span>Optimal Zone</span>
                    <span>Humid</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shelf Life & Journey */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Shelf Life Impact */}
            <Card className={getRiskBg(selectedProduct.riskLevel)}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Shelf Life Impact
                </CardTitle>
                <CardDescription>Estimated remaining shelf life based on conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-foreground">
                    {shelfLifeImpact.remainingShelfLife.toFixed(0)} days
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    of {selectedProduct.maxShelfLife} days remaining
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Quality Score</span>
                      <span className="font-medium">{shelfLifeImpact.qualityScore.toFixed(0)}%</span>
                    </div>
                    <Progress value={shelfLifeImpact.qualityScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Transit Progress</span>
                      <span className="font-medium">{((elapsedTime / 24) / transitDuration * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(elapsedTime / 24) / transitDuration * 100} className="h-2" />
                  </div>
                </div>

                {shelfLifeImpact.reductionPercent > 5 && (
                  <div className="p-3 bg-amber-500/10 rounded-lg flex gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-700 dark:text-amber-300">
                      Temperature conditions have reduced shelf life by {shelfLifeImpact.reductionPercent.toFixed(1)}%
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Journey Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Shipment Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {journeyMilestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.status === "completed" 
                            ? "bg-[#2E8B57] text-white" 
                            : milestone.status === "active"
                            ? "bg-[#0F4C81] text-white ring-4 ring-[#0F4C81]/20"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {milestone.status === "completed" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : milestone.status === "active" ? (
                            <Activity className="h-4 w-4 animate-pulse" />
                          ) : (
                            <MapPin className="h-4 w-4" />
                          )}
                        </div>
                        {index < journeyMilestones.length - 1 && (
                          <div className={`w-0.5 h-8 ${
                            milestone.status === "completed" ? "bg-[#2E8B57]" : "bg-muted"
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{milestone.name}</span>
                          <Badge variant="outline" className="text-xs">{milestone.time}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{milestone.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Temperature Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Temperature Trend (48h)
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: OCEAN_BLUE }} />
                      Temperature
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LOGISTICS_GREEN }} />
                      Setpoint
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={temperatureData.slice(-48)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 10 }}
                        interval={5}
                      />
                      <YAxis 
                        domain={[selectedProduct.tempMin - 5, selectedProduct.tempMax + 5]}
                        tick={{ fontSize: 10 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke={OCEAN_BLUE}
                        strokeWidth={2}
                        dot={false}
                        name="Temperature (°C)"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="setpoint" 
                        stroke={LOGISTICS_GREEN}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Setpoint"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-amber-500" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tempStatus !== "optimal" || excursions.filter(e => !e.resolved).length > 0 ? (
                  <div className="space-y-3">
                    {tempStatus !== "optimal" && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-start gap-2"
                      >
                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-red-700 dark:text-red-300">
                          Temperature {tempStatus === "high" ? "above maximum" : "below minimum"} threshold
                        </div>
                      </motion.div>
                    )}
                    {excursions.filter(e => !e.resolved).length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg flex items-start gap-2"
                      >
                        <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-700 dark:text-amber-300">
                          {excursions.filter(e => !e.resolved).length} unresolved excursion(s) require attention
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mb-3" style={{ color: LOGISTICS_GREEN }} />
                    <p className="text-sm font-medium">All Systems Normal</p>
                    <p className="text-xs mt-1">No active alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Excursions List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Temperature Excursions
                </CardTitle>
                <Badge variant="outline" className="border-amber-500 text-amber-600">
                  {excursions.length} Events
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                {excursions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mb-2" style={{ color: LOGISTICS_GREEN }} />
                    <p className="text-sm">No temperature excursions detected</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {excursions.map((excursion) => (
                      <div
                        key={excursion.id}
                        className={`p-3 rounded-lg border ${
                          excursion.resolved 
                            ? "bg-muted/30 border-muted" 
                            : excursion.type === "high"
                            ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                            : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {excursion.type === "high" ? (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-blue-500" />
                            )}
                            <span className="text-sm font-medium">
                              {excursion.type === "high" ? "High Temperature" : "Low Temperature"}
                            </span>
                          </div>
                          {excursion.resolved ? (
                            <Badge variant="outline" style={{ borderColor: LOGISTICS_GREEN, color: LOGISTICS_GREEN }}>
                              Resolved
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Active</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div>{excursion.timestamp.toLocaleString()}</div>
                          <div>Duration: {excursion.duration} min | Deviation: {excursion.deviation.toFixed(1)}°C</div>
                          <div>Location: {excursion.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Live Monitoring</Label>
                  <p className="text-xs text-muted-foreground">Enable real-time tracking</p>
                </div>
                <Switch
                  checked={isMonitoring}
                  onCheckedChange={setIsMonitoring}
                />
              </div>
              <Separator />
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const avgTemp = (selectedProduct.tempMin + selectedProduct.tempMax) / 2;
                  setCurrentTemp(avgTemp);
                  setExcursions([]);
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Simulated Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="mt-6 space-y-6">
          {/* Compliance Score */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={LOGISTICS_GREEN}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${(complianceStatus.filter(c => c.status === "compliant").length / complianceStatus.length) * 352} 352`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">
                        {Math.round((complianceStatus.filter(c => c.status === "compliant").length / complianceStatus.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    {complianceStatus.filter(c => c.status === "compliant").length} of {complianceStatus.length} checks passed
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {complianceStatus.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        {item.status === "compliant" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        ) : item.status === "warning" ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium">{item.standard}</div>
                          <div className="text-xs text-muted-foreground">{item.details}</div>
                        </div>
                        <Badge 
                          variant="outline"
                          className={
                            item.status === "compliant" 
                              ? "border-green-500 text-green-600" 
                              : item.status === "warning"
                              ? "border-amber-500 text-amber-600"
                              : "border-red-500 text-red-600"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Regulations Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gauge className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Regulatory Requirements by Industry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Ship className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    Food & Beverage
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>FDA FSMA:</strong> Preventive controls for temperature-sensitive foods</li>
                    <li><strong>HACCP:</strong> Hazard Analysis Critical Control Points</li>
                    <li><strong>EU Regulation 853/2004:</strong> Hygiene rules for food</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                    Pharmaceuticals
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>GDP:</strong> Good Distribution Practice guidelines</li>
                    <li><strong>WHO TRS 961:</strong> Technical requirements</li>
                    <li><strong>21 CFR Part 211:</strong> FDA cGMP compliance</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    Vaccines & Biologics
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>WHO PQS:</strong> Performance, Quality and Safety</li>
                    <li><strong>UNICEF SDP:</strong> Vaccine storage standards</li>
                    <li><strong>ICH Guidelines:</strong> Stability testing requirements</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Compliance History Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Compliance Score History (30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={complianceHistory}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis domain={[70, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke={LOGISTICS_GREEN}
                        fill={LOGISTICS_GREEN}
                        fillOpacity={0.2}
                        name="Compliance Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Cold Chain Cost Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Excursion Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                Temperature Excursions Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-foreground">{excursions.length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Total Excursions</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-500">{excursions.filter(e => e.type === "high").length}</div>
                  <div className="text-xs text-muted-foreground mt-1">High Temperature</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-500">{excursions.filter(e => e.type === "low").length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Low Temperature</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                  <div className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>{excursions.filter(e => e.resolved).length}</div>
                  <div className="text-xs text-muted-foreground mt-1">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Humidity Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplets className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Humidity & Temperature Correlation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={temperatureData.slice(-24)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="right" dataKey="humidity" fill={OCEAN_BLUE} fillOpacity={0.6} name="Humidity (%)" />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" stroke={LOGISTICS_GREEN} strokeWidth={2} name="Temperature (°C)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="mt-6 space-y-6">
          {/* FAQ Categories */}
          <div className="flex flex-wrap gap-2">
            {["All", "Basics", "Shelf Life", "Regulations", "Operations", "Best Practices"].map((category) => (
              <Badge 
                key={category}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* FAQ Accordion */}
          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 text-left">
                        <HelpCircle className="h-5 w-5 shrink-0" style={{ color: OCEAN_BLUE }} />
                        <div>
                          <span className="font-medium">{faq.question}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Need More Help */}
          <Card className="bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center shrink-0">
                  <Info className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Need More Help?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our cold chain experts are available to help you optimize your temperature-sensitive logistics operations.
                    Contact our support team for personalized assistance with regulatory compliance, route planning, and 
                    monitoring best practices.
                  </p>
                  <Button className="mt-4" style={{ backgroundColor: OCEAN_BLUE }}>
                    Contact Support
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ColdChainMonitor;
