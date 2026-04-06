"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Truck,
  MapPin,
  Container,
  DollarSign,
  Clock,
  Fuel,
  Calculator,
  Info,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  RotateCcw,
  Building2,
  Route,
  Timer,
  CheckCircle2,
  Zap,
  Anchor,
  BarChart3,
  PieChart,
  HelpCircle,
  TrendingDown,
  Globe,
  Activity,
  BookOpen,
  Lightbulb,
  Target,
  Award,
  Layers,
  Navigation,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Chart Colors
const CHART_COLORS = [
  OCEAN_BLUE,
  LOGISTICS_GREEN,
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];

// Animated Badge Component
function AnimatedBadge({ 
  children, 
  delay = 0,
  variant = "default"
}: { 
  children: React.ReactNode; 
  delay?: number;
  variant?: "default" | "green" | "blue";
}) {
  const variantStyles = {
    default: "bg-white/10 text-white border-white/20",
    green: "bg-green-500/20 text-green-300 border-green-500/30",
    blue: "bg-blue-500/20 text-blue-300 border-blue-500/30"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.23, 1, 0.32, 1]
      }}
    >
      <Badge 
        className={`px-4 py-2 text-sm font-medium backdrop-blur-sm border ${variantStyles[variant]} animate-pulse`}
      >
        {children}
      </Badge>
    </motion.div>
  );
}

// Port/Terminal data with drayage-specific information
const PORT_TERMINALS: Record<string, {
  name: string;
  region: string;
  terminals: string[];
  baseRate: number;
  avgWaitTime: number;
  congestionFactor: number;
}> = {
  USLAX: {
    name: "Los Angeles",
    region: "West Coast",
    terminals: ["APM Terminals", "TraPac", "YTI", "Everport", "West Basin"],
    baseRate: 350,
    avgWaitTime: 4.5,
    congestionFactor: 1.15,
  },
  USLGB: {
    name: "Long Beach",
    region: "West Coast",
    terminals: ["TTI", "PCT", "ITS", "SSA Marine"],
    baseRate: 340,
    avgWaitTime: 4.0,
    congestionFactor: 1.12,
  },
  USNYC: {
    name: "New York/New Jersey",
    region: "East Coast",
    terminals: ["APM Terminal", "GCT Bayonne", "GCT New York", "PNCT", "Port Newark"],
    baseRate: 420,
    avgWaitTime: 3.5,
    congestionFactor: 1.08,
  },
  USSAV: {
    name: "Savannah",
    region: "East Coast",
    terminals: ["Garden City Terminal"],
    baseRate: 310,
    avgWaitTime: 2.5,
    congestionFactor: 1.05,
  },
  USOAK: {
    name: "Oakland",
    region: "West Coast",
    terminals: ["Oakland International Container Terminal", "TraPac Oakland"],
    baseRate: 380,
    avgWaitTime: 3.0,
    congestionFactor: 1.10,
  },
  USSEA: {
    name: "Seattle",
    region: "West Coast",
    terminals: ["T5", "T18", "T30", "T46"],
    baseRate: 360,
    avgWaitTime: 2.5,
    congestionFactor: 1.05,
  },
  USHOU: {
    name: "Houston",
    region: "Gulf Coast",
    terminals: ["Barbours Cut", "Bayport"],
    baseRate: 290,
    avgWaitTime: 2.0,
    congestionFactor: 1.03,
  },
  USCHS: {
    name: "Charleston",
    region: "East Coast",
    terminals: ["Wando Welch", "North Charleston", "Columbus Street"],
    baseRate: 300,
    avgWaitTime: 2.0,
    congestionFactor: 1.02,
  },
  USJAX: {
    name: "Jacksonville",
    region: "East Coast",
    terminals: ["Blount Island", "Dames Point", "Talleyrand"],
    baseRate: 280,
    avgWaitTime: 1.5,
    congestionFactor: 1.0,
  },
  USMIA: {
    name: "Miami",
    region: "East Coast",
    terminals: ["PortMiami"],
    baseRate: 320,
    avgWaitTime: 2.0,
    congestionFactor: 1.05,
  },
};

// Container types with specifications
const CONTAINER_TYPES = [
  { id: "20st", name: "20' Standard (20GP)", length: 20, weight: 1.0, chassisRate: 45 },
  { id: "40st", name: "40' Standard (40GP)", length: 40, weight: 1.0, chassisRate: 65 },
  { id: "40hc", name: "40' High Cube (40HC)", length: 40, weight: 1.0, chassisRate: 70 },
  { id: "45hc", name: "45' High Cube (45HC)", length: 45, weight: 1.1, chassisRate: 85 },
  { id: "20rf", name: "20' Refrigerated (20RF)", length: 20, weight: 1.2, chassisRate: 65 },
  { id: "40rf", name: "40' Refrigerated (40RF)", length: 40, weight: 1.2, chassisRate: 90 },
  { id: "20ot", name: "20' Open Top", length: 20, weight: 1.15, chassisRate: 55 },
  { id: "40ot", name: "40' Open Top", length: 40, weight: 1.15, chassisRate: 80 },
];

// Chassis types
const CHASSIS_TYPES = [
  { id: "standard", name: "Standard Chassis", dailyRate: 45, suitableFor: ["20st", "40st", "40hc"] },
  { id: "extended", name: "Extended Chassis (45')", dailyRate: 65, suitableFor: ["45hc"] },
  { id: "reefer", name: "Reefer Chassis", dailyRate: 75, suitableFor: ["20rf", "40rf"] },
  { id: "heavy", name: "Heavy-Duty Chassis", dailyRate: 85, suitableFor: ["20st", "40st"] },
];

interface DrayageCalculation {
  baseDrayage: number;
  distanceCost: number;
  chassisCost: number;
  fuelSurcharge: number;
  terminalFees: number;
  dwellTimeCost: number;
  waitTimeCost: number;
  totalCost: number;
  perMileRate: number;
  estimatedTime: number;
  roundTripMiles: number;
}

export function DrayageCalculator() {
  // Input states
  const [port, setPort] = useState<string>("USLAX");
  const [terminal, setTerminal] = useState<string>("");
  const [containerType, setContainerType] = useState<string>("40st");
  const [chassisType, setChassisType] = useState<string>("standard");
  const [distance, setDistance] = useState<string>("50");
  const [dwellTime, setDwellTime] = useState<number>(0);
  const [fuelSurchargePercent, setFuelSurchargePercent] = useState<string>("28");
  const [includeReturn, setIncludeReturn] = useState<boolean>(true);
  const [containerCount, setContainerCount] = useState<string>("1");

  // Get selected port data
  const selectedPort = PORT_TERMINALS[port];

  // Get suitable chassis types for selected container
  const suitableChassis = useMemo(() => {
    return CHASSIS_TYPES.filter((c) => c.suitableFor.includes(containerType));
  }, [containerType]);

  // Main calculation
  const calculation = useMemo<DrayageCalculation>(() => {
    const portData = PORT_TERMINALS[port];
    const container = CONTAINER_TYPES.find((c) => c.id === containerType);
    const chassis = CHASSIS_TYPES.find((c) => c.id === chassisType);
    const distanceNum = parseFloat(distance) || 0;
    const numContainers = parseInt(containerCount) || 1;
    const fuelPercent = parseFloat(fuelSurchargePercent) || 0;

    // Round trip distance
    const roundTripMiles = includeReturn ? distanceNum * 2 : distanceNum;

    // Base drayage rate (per mile)
    const basePerMile = 3.50;
    const baseDrayage = roundTripMiles * basePerMile * portData.congestionFactor;

    // Distance cost with container weight factor
    const distanceCost = baseDrayage * (container?.weight || 1);

    // Chassis daily fee
    const chassisDailyRate = chassis?.dailyRate || 45;
    const chassisDays = Math.max(1, Math.ceil(dwellTime / 24));
    const chassisCost = chassisDailyRate * chassisDays;

    // Fuel surcharge
    const fuelSurcharge = distanceCost * (fuelPercent / 100);

    // Terminal fees (approximate average)
    const terminalFees = 85 * numContainers;

    // Terminal wait time cost (driver hourly rate * wait time)
    const driverHourlyRate = 45;
    const waitTimeCost = portData.avgWaitTime * driverHourlyRate;

    // Dwell time cost (storage charges if exceeding free time)
    const freeTime = 5; // days free
    const dwellDays = Math.max(0, dwellTime - freeTime);
    const dailyStorageRate = 75;
    const dwellTimeCost = dwellDays * dailyStorageRate;

    // Total cost
    const totalCost = (
      distanceCost +
      chassisCost +
      fuelSurcharge +
      terminalFees +
      waitTimeCost +
      dwellTimeCost
    ) * numContainers;

    // Estimated total time (hours)
    const avgSpeed = 25; // mph average for drayage
    const driveTime = roundTripMiles / avgSpeed;
    const terminalTime = portData.avgWaitTime + 2; // loading/unloading
    const estimatedTime = driveTime + terminalTime;

    // Per mile rate
    const perMileRate = totalCost / roundTripMiles;

    return {
      baseDrayage,
      distanceCost,
      chassisCost,
      fuelSurcharge,
      terminalFees,
      dwellTimeCost,
      waitTimeCost,
      totalCost,
      perMileRate,
      estimatedTime,
      roundTripMiles,
    };
  }, [
    port,
    containerType,
    chassisType,
    distance,
    dwellTime,
    fuelSurchargePercent,
    includeReturn,
    containerCount,
  ]);

  // Port comparison data for visualization
  const portComparisonData = useMemo(() => {
    const distanceNum = parseFloat(distance) || 50;
    const container = CONTAINER_TYPES.find((c) => c.id === containerType);
    const chassis = CHASSIS_TYPES.find((c) => c.id === chassisType);
    const roundTripMiles = includeReturn ? distanceNum * 2 : distanceNum;
    const fuelPercent = parseFloat(fuelSurchargePercent) || 0;

    return Object.entries(PORT_TERMINALS).map(([code, data]) => {
      const baseDrayage = roundTripMiles * 3.50 * data.congestionFactor;
      const distanceCost = baseDrayage * (container?.weight || 1);
      const chassisCost = (chassis?.dailyRate || 45) * Math.max(1, Math.ceil(dwellTime / 24));
      const fuelSurcharge = distanceCost * (fuelPercent / 100);
      const terminalFees = 85;
      const waitTimeCost = data.avgWaitTime * 45;
      const freeTime = 5;
      const dwellDays = Math.max(0, dwellTime - freeTime);
      const dwellTimeCost = dwellDays * 75;

      return {
        code,
        name: data.name,
        region: data.region,
        totalCost: distanceCost + chassisCost + fuelSurcharge + terminalFees + waitTimeCost + dwellTimeCost,
        waitTime: data.avgWaitTime,
        congestion: ((data.congestionFactor - 1) * 100).toFixed(0),
        baseRate: data.baseRate,
      };
    }).sort((a, b) => a.totalCost - b.totalCost);
  }, [containerType, chassisType, distance, dwellTime, fuelSurchargePercent, includeReturn]);

  // Cost breakdown data for pie chart
  const costBreakdownData = useMemo(() => {
    return [
      { name: "Distance Cost", value: calculation.distanceCost, color: OCEAN_BLUE },
      { name: "Fuel Surcharge", value: calculation.fuelSurcharge, color: "#F59E0B" },
      { name: "Chassis Fee", value: calculation.chassisCost, color: LOGISTICS_GREEN },
      { name: "Terminal Fees", value: calculation.terminalFees, color: "#8B5CF6" },
      { name: "Wait Time Cost", value: calculation.waitTimeCost, color: "#EC4899" },
      ...(calculation.dwellTimeCost > 0 ? [{ name: "Dwell Time Charges", value: calculation.dwellTimeCost, color: "#EF4444" }] : []),
    ];
  }, [calculation]);

  // Distance vs cost sensitivity data
  const distanceSensitivityData = useMemo(() => {
    const distances = [25, 50, 75, 100, 150, 200];
    return distances.map(dist => {
      const portData = PORT_TERMINALS[port];
      const container = CONTAINER_TYPES.find((c) => c.id === containerType);
      const chassis = CHASSIS_TYPES.find((c) => c.id === chassisType);
      const roundTripMiles = includeReturn ? dist * 2 : dist;
      const fuelPercent = parseFloat(fuelSurchargePercent) || 0;

      const baseDrayage = roundTripMiles * 3.50 * portData.congestionFactor;
      const distanceCost = baseDrayage * (container?.weight || 1);
      const chassisCost = (chassis?.dailyRate || 45) * Math.max(1, Math.ceil(dwellTime / 24));
      const fuelSurcharge = distanceCost * (fuelPercent / 100);
      const terminalFees = 85;
      const waitTimeCost = portData.avgWaitTime * 45;
      const dwellDays = Math.max(0, dwellTime - 5);
      const dwellTimeCost = dwellDays * 75;

      return {
        distance: dist,
        roundTrip: roundTripMiles,
        totalCost: distanceCost + chassisCost + fuelSurcharge + terminalFees + waitTimeCost + dwellTimeCost,
        distanceCost,
        fuelSurcharge,
      };
    });
  }, [port, containerType, chassisType, dwellTime, fuelSurchargePercent, includeReturn]);

  // Radar chart data for port comparison
  const radarData = useMemo(() => {
    return Object.entries(PORT_TERMINALS).slice(0, 6).map(([code, data]) => ({
      name: data.name,
      cost: Math.round(100 - (data.baseRate / 5)),
      speed: Math.round(100 - (data.avgWaitTime * 15)),
      efficiency: Math.round(100 - ((data.congestionFactor - 1) * 500)),
      availability: Math.round(90 - (data.avgWaitTime * 5)),
      congestion: Math.round(100 - ((data.congestionFactor - 1) * 400)),
    }));
  }, []);

  // Radial bar data for cost breakdown
  const radialData = useMemo(() => {
    const total = calculation.totalCost || 1;
    return costBreakdownData.map((item, index) => ({
      name: item.name,
      value: (item.value / total) * 100,
      fill: item.color,
    }));
  }, [costBreakdownData, calculation.totalCost]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Update terminal when port changes
  const handlePortChange = (value: string) => {
    setPort(value);
    setTerminal(PORT_TERMINALS[value].terminals[0]);
  };

  // FAQs data
  const faqItems = [
    {
      question: "What is drayage and how does it differ from standard trucking?",
      answer: "Drayage is the transportation of freight over a short distance, typically from a port or rail terminal to a nearby warehouse or distribution center. Unlike standard trucking which involves long-haul transportation, drayage focuses on 'last mile' container movements within a port complex or between intermodal facilities, usually covering distances under 200 miles."
    },
    {
      question: "Why do drayage rates vary between ports?",
      answer: "Drayage rates vary significantly between ports due to several factors: terminal congestion levels, average wait times, local labor costs, equipment availability (chassis), regional regulations, and fuel prices. High-congestion ports like Los Angeles/Long Beach typically have higher rates due to longer wait times and congestion surcharges."
    },
    {
      question: "What is terminal dwell time and why does it matter?",
      answer: "Terminal dwell time is the duration a container remains at the terminal before being picked up. Most terminals offer 5-7 days of free storage. After this 'free time,' daily storage charges (demurrage) apply, which can significantly increase your total drayage costs. Planning pickups within free time is crucial for cost control."
    },
    {
      question: "How do chassis availability and type affect costs?",
      answer: "Chassis is the wheeled frame that carries containers during truck transport. Different container types require specific chassis (standard, extended, reefer, heavy-duty). Chassis shortages can lead to daily rental fees and delayed pickups. Using the wrong chassis type can result in terminal rejection and additional costs."
    },
    {
      question: "What is a 'turn' in drayage operations?",
      answer: "A 'turn' refers to a complete drayage cycle: picking up a container at the terminal, transporting it to the destination, and potentially returning the empty container. A 'double turn' involves two complete cycles in one shift. Turn time is a key efficiency metric, and optimizing turns reduces per-container costs."
    },
    {
      question: "How can I reduce my drayage costs?",
      answer: "Key cost reduction strategies include: 1) Booking terminal appointments in advance to reduce wait times, 2) Using off-peak gate hours (nights/weekends), 3) Pre-filing customs documents to minimize dwell time, 4) Considering dedicated chassis pools, 5) Planning pickups within free time to avoid demurrage, 6) Negotiating volume-based rates with carriers."
    },
    {
      question: "What fuel surcharges should I expect?",
      answer: "Fuel surcharges typically range from 20-35% of the base drayage rate, fluctuating with diesel prices. Carriers update fuel surcharges weekly or monthly based on DOE (Department of Energy) national average diesel prices. During periods of high fuel volatility, surcharges can change rapidly."
    },
    {
      question: "What's the difference between demurrage and detention?",
      answer: "Demurrage charges apply when containers remain at the terminal beyond the free time period. Detention charges apply when containers are kept outside the terminal (at your facility) beyond the allowed free days. Both can result in significant daily charges, so understanding your free time allowances is essential."
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0a3a63] to-[#2E8B57]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/5"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: `radial-gradient(circle, ${LOGISTICS_GREEN}10 0%, transparent 70%)` }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
        
        <div className="relative px-6 py-10 md:px-10 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-6">
              {/* Animated Badges */}
              <div className="flex flex-wrap gap-3">
                <AnimatedBadge delay={0}>
                  <Truck className="h-4 w-4 mr-2" />
                  Road Transport
                </AnimatedBadge>
                <AnimatedBadge delay={0.2} variant="green">
                  <Navigation className="h-4 w-4 mr-2" />
                  First/Last Mile
                </AnimatedBadge>
                <AnimatedBadge delay={0.4} variant="blue">
                  <Layers className="h-4 w-4 mr-2" />
                  Intermodal
                </AnimatedBadge>
              </div>

              <div className="flex items-center gap-4">
                <motion.div 
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Truck className="h-10 w-10 text-white" />
                </motion.div>
                <div>
                  <motion.h1 
                    className="text-4xl md:text-5xl font-bold text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Drayage Cost Calculator
                  </motion.h1>
                  <motion.p 
                    className="text-white/80 mt-2 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Estimate short-haul container transportation costs from ports
                  </motion.p>
                </div>
              </div>
              
              <motion.p 
                className="text-white/90 max-w-2xl text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Calculate accurate drayage costs including distance charges, fuel surcharges, terminal fees, 
                chassis rentals, and wait time costs. Compare rates across major US ports and optimize your 
                intermodal logistics operations with real-time calculations.
              </motion.p>
            </div>
            
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10">
                <Anchor className="h-8 w-8 text-white/80 mx-auto mb-3" />
                <motion.p 
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  10
                </motion.p>
                <p className="text-sm text-white/70 mt-1">Major Ports</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10">
                <Container className="h-8 w-8 text-white/80 mx-auto mb-3" />
                <motion.p 
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  8
                </motion.p>
                <p className="text-sm text-white/70 mt-1">Container Types</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/10">
                <Activity className="h-8 w-8 text-white/80 mx-auto mb-3" />
                <motion.p 
                  className="text-2xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                >
                  Live
                </motion.p>
                <p className="text-sm text-white/70 mt-1">Calculations</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto h-auto bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="calculator" className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Port & Terminal Selection */}
              <Card className="border-l-4" style={{ borderLeftColor: OCEAN_BLUE }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ship className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Port & Terminal Selection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Port</Label>
                      <Select value={port} onValueChange={handlePortChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PORT_TERMINALS).map(([code, data]) => (
                            <SelectItem key={code} value={code}>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                                <span>{data.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {data.region}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Terminal</Label>
                      <Select value={terminal} onValueChange={setTerminal}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select terminal" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedPort.terminals.map((term) => (
                            <SelectItem key={term} value={term}>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span>{term}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Port Info */}
                  <div className="grid grid-cols-3 gap-3 p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Base Rate</p>
                      <p className="font-semibold text-lg" style={{ color: OCEAN_BLUE }}>
                        {formatCurrency(selectedPort.baseRate)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Avg Wait</p>
                      <p className="font-semibold text-lg" style={{ color: LOGISTICS_GREEN }}>
                        {selectedPort.avgWaitTime}h
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Congestion</p>
                      <p className="font-semibold text-lg text-amber-600">
                        {((selectedPort.congestionFactor - 1) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Container & Chassis */}
              <Card className="border-l-4" style={{ borderLeftColor: LOGISTICS_GREEN }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Container className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Container & Chassis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Container Type</Label>
                      <Select value={containerType} onValueChange={setContainerType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTAINER_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                <Container className="h-4 w-4 text-muted-foreground" />
                                <span>{type.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Chassis Type</Label>
                      <Select value={chassisType} onValueChange={setChassisType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {suitableChassis.map((chassis) => (
                            <SelectItem key={chassis.id} value={chassis.id}>
                              {chassis.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="containerCount">Number of Containers</Label>
                    <Input
                      id="containerCount"
                      type="number"
                      min="1"
                      max="100"
                      value={containerCount}
                      onChange={(e) => setContainerCount(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Distance & Route */}
              <Card className="border-l-4" style={{ borderLeftColor: OCEAN_BLUE }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Route className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Distance & Route
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance to Destination (miles)</Label>
                    <Input
                      id="distance"
                      type="number"
                      min="1"
                      step="1"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      {[25, 50, 100, 150, 200].map((d) => (
                        <Button
                          key={d}
                          variant="outline"
                          size="sm"
                          onClick={() => setDistance(String(d))}
                          className="flex-1 hover:bg-muted"
                        >
                          {d} mi
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                      <span className="text-sm font-medium">Include Return Trip</span>
                    </div>
                    <Button
                      variant={includeReturn ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIncludeReturn(!includeReturn)}
                      className={includeReturn ? "text-white" : ""}
                      style={includeReturn ? { backgroundColor: LOGISTICS_GREEN } : {}}
                    >
                      {includeReturn ? "Yes" : "No"}
                    </Button>
                  </div>

                  <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Round Trip Distance:</span>
                      <span className="font-semibold text-lg" style={{ color: OCEAN_BLUE }}>
                        {calculation.roundTripMiles} miles
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fees & Surcharges */}
              <Card className="border-l-4" style={{ borderLeftColor: LOGISTICS_GREEN }}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Fees & Surcharges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Fuel Surcharge */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-amber-500" />
                        Fuel Surcharge
                      </Label>
                      <Badge variant="secondary" className="font-mono">{fuelSurchargePercent}%</Badge>
                    </div>
                    <Slider
                      value={[parseFloat(fuelSurchargePercent)]}
                      onValueChange={(v) => setFuelSurchargePercent(String(v[0]))}
                      min={0}
                      max={50}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Terminal Dwell Time */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        Terminal Dwell Time
                      </Label>
                      <Badge variant="secondary" className="font-mono">{dwellTime} days</Badge>
                    </div>
                    <Slider
                      value={[dwellTime]}
                      onValueChange={setDwellTime}
                      min={0}
                      max={14}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 days</span>
                      <span>5 (Free)</span>
                      <span>14 days</span>
                    </div>
                    {dwellTime > 5 && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 dark:bg-destructive/20 rounded-lg text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Storage fees apply after 5 free days</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card className="overflow-hidden shadow-lg">
                <div className="h-2 bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Drayage Cost Estimate
                  </CardTitle>
                  <CardDescription>
                    {selectedPort.name} {terminal && `• ${terminal}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Total Cost */}
                    <div className="text-center py-8 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl">
                      <motion.div
                        key={calculation.totalCost}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-bold"
                        style={{ color: OCEAN_BLUE }}
                      >
                        {formatCurrency(calculation.totalCost)}
                      </motion.div>
                      <div className="text-lg text-muted-foreground mt-2">
                        Total Drayage Cost
                      </div>
                      <div className="flex items-center justify-center gap-3 mt-4">
                        <Badge style={{ backgroundColor: LOGISTICS_GREEN }} className="text-white px-4 py-1 text-sm">
                          {calculation.roundTripMiles} miles
                        </Badge>
                        <Badge variant="outline" className="px-4 py-1 text-sm">
                          {formatCurrency(calculation.perMileRate)}/mile
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    {/* Cost Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Cost Breakdown</h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                          <div className="flex items-center gap-2">
                            <Route className="h-4 w-4 text-muted-foreground" />
                            <span>Distance Cost</span>
                            <Badge variant="secondary" className="text-xs">
                              {calculation.roundTripMiles} mi
                            </Badge>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(calculation.distanceCost)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                          <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4 text-amber-500" />
                            <span>Fuel Surcharge</span>
                            <Badge variant="secondary" className="text-xs">
                              {fuelSurchargePercent}%
                            </Badge>
                          </div>
                          <span className="font-medium text-amber-600">
                            {formatCurrency(calculation.fuelSurcharge)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>Chassis Fee</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.max(1, Math.ceil(dwellTime / 24))} day(s)
                            </Badge>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(calculation.chassisCost)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>Terminal Fees</span>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(calculation.terminalFees)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-dashed">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-purple-500" />
                            <span>Wait Time Cost</span>
                            <Badge variant="secondary" className="text-xs">
                              {selectedPort.avgWaitTime}h avg
                            </Badge>
                          </div>
                          <span className="font-medium text-purple-600">
                            {formatCurrency(calculation.waitTimeCost)}
                          </span>
                        </div>

                        {calculation.dwellTimeCost > 0 && (
                          <div className="flex justify-between items-center py-2 text-destructive">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Dwell Time Charges</span>
                            </div>
                            <span className="font-medium">
                              {formatCurrency(calculation.dwellTimeCost)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Turn Information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Timer className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    Turn Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                      <Clock className="h-6 w-6 mx-auto mb-2" style={{ color: OCEAN_BLUE }} />
                      <p className="text-xs text-muted-foreground">Est. Time</p>
                      <p className="font-bold text-xl" style={{ color: OCEAN_BLUE }}>
                        {calculation.estimatedTime.toFixed(1)}h
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                      <Truck className="h-6 w-6 mx-auto mb-2" style={{ color: LOGISTICS_GREEN }} />
                      <p className="text-xs text-muted-foreground">Round Trip</p>
                      <p className="font-bold text-xl" style={{ color: LOGISTICS_GREEN }}>
                        {calculation.roundTripMiles} mi
                      </p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                      <DollarSign className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                      <p className="text-xs text-muted-foreground">Per Mile</p>
                      <p className="font-bold text-xl text-amber-600">
                        {formatCurrency(calculation.perMileRate)}
                      </p>
                    </div>
                  </div>

                  {/* Turn Visualization */}
                  <div className="mt-4 p-4 border rounded-xl bg-muted/30">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Ship className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        <span>Port</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                        <span>Inland</span>
                      </div>
                      {includeReturn && (
                        <>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-2">
                            <RotateCcw className="h-4 w-4 text-purple-500" />
                            <span>Return</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Savings Tips */}
              <Card style={{ borderColor: LOGISTICS_GREEN, backgroundColor: "rgba(46, 139, 87, 0.05)" }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                    <TrendingUp className="h-4 w-4" />
                    Cost Optimization Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                      <span>Book terminal appointments in advance to reduce wait times</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                      <span>Utilize off-peak gate hours (nights/weekends) when available</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                      <span>Pre-file customs documents to minimize terminal dwell time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: LOGISTICS_GREEN }} />
                      <span>Consider dedicated chassis pools for faster turn times</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          {/* Educational Content Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Understanding Drayage Cost Analysis
              </CardTitle>
              <CardDescription>
                Learn how to interpret and optimize your drayage costs
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Drayage cost analysis is a critical component of supply chain management, particularly for businesses 
                that rely on intermodal transportation. The term "drayage" refers to the short-distance transportation 
                of freight, typically from a port or rail terminal to a nearby warehouse, distribution center, or 
                intermodal facility. Understanding the various cost components involved in drayage operations is 
                essential for logistics managers, freight forwarders, and supply chain professionals who need to 
                accurately budget and optimize their transportation expenses.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The cost structure of drayage operations is multifaceted, comprising several distinct elements that 
                each contribute to the total expense. Distance costs form the foundation of drayage pricing, calculated 
                based on the miles traveled between the port terminal and the final destination. These costs are 
                influenced by factors such as fuel prices, driver wages, and vehicle maintenance expenses. Fuel 
                surcharges represent a variable component that fluctuates with diesel prices, typically ranging from 
                20-35% of the base rate. Terminal fees cover the costs associated with processing containers through 
                port facilities, including documentation, security, and handling charges.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Terminal dwell time and wait times are often overlooked but can significantly impact total drayage costs. 
                When containers exceed their free storage time at terminals, demurrage charges accumulate rapidly. 
                Similarly, extended wait times for chassis or terminal entry can increase labor costs and reduce the 
                number of turns a driver can complete in a shift. Chassis fees, while relatively modest compared to 
                other components, can escalate quickly during periods of equipment shortages, adding unexpected costs 
                to drayage operations. By carefully analyzing each of these cost components, businesses can identify 
                opportunities for optimization and cost reduction.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Cost Distribution
                </CardTitle>
                <CardDescription>Visual breakdown of your drayage costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {costBreakdownData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}:</span>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Breakdown Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Detailed Cost Analysis
                </CardTitle>
                <CardDescription>Itemized breakdown with percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costBreakdownData.map((item, index) => {
                    const percentage = (item.value / calculation.totalCost) * 100;
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{formatCurrency(item.value)}</span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator className="my-6" />

                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Cost</span>
                  <span style={{ color: OCEAN_BLUE }}>{formatCurrency(calculation.totalCost)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radial Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Cost Composition Overview
              </CardTitle>
              <CardDescription>Visual representation of cost distribution percentages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="90%" 
                    data={radialData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarGrid background fill="hsl(var(--background))" />
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    {radialData.map((entry, index) => (
                      <RadialBar
                        key={`radial-${index}`}
                        dataKey="value"
                        cornerRadius={10}
                        fill={entry.fill}
                      />
                    ))}
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cost Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2" style={{ color: OCEAN_BLUE }} />
                  <p className="text-3xl font-bold" style={{ color: OCEAN_BLUE }}>
                    {formatCurrency(calculation.perMileRate)}
                  </p>
                  <p className="text-sm text-muted-foreground">Per Mile Rate</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2" style={{ color: LOGISTICS_GREEN }} />
                  <p className="text-3xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                    {calculation.estimatedTime.toFixed(1)}h
                  </p>
                  <p className="text-sm text-muted-foreground">Est. Turn Time</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Fuel className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                  <p className="text-3xl font-bold text-amber-600">
                    {fuelSurchargePercent}%
                  </p>
                  <p className="text-sm text-muted-foreground">Fuel Surcharge</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-3xl font-bold text-purple-600">
                    {calculation.roundTripMiles}
                  </p>
                  <p className="text-sm text-muted-foreground">Round Trip Miles</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          {/* Educational Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Port Comparison Analysis
              </CardTitle>
              <CardDescription>
                Understanding how different ports compare for your drayage operations
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Port selection is a strategic decision that can significantly impact your overall supply chain costs 
                and efficiency. Different ports offer varying advantages and disadvantages based on their geographic 
                location, infrastructure capacity, labor availability, and operational efficiency. The comparison 
                of ports for drayage operations requires a comprehensive analysis of multiple factors, including 
                distance to final destination, terminal congestion levels, average wait times, and associated costs.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Major container ports in the United States exhibit substantial variations in their operational 
                characteristics. Ports like Los Angeles and Long Beach, while handling the highest volumes of 
                container traffic, also experience significant congestion, leading to longer wait times and higher 
                drayage costs. In contrast, ports such as Jacksonville or Charleston may offer lower base rates 
                and reduced congestion, potentially resulting in cost savings for certain routes. However, the 
                selection of an alternative port must also consider the overall supply chain implications, 
                including vessel routing, transit times, and intermodal connections.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The congestion factor is a critical metric that reflects the additional time and costs associated 
                with operating through a particular port. Higher congestion factors indicate longer wait times, 
                more frequent delays, and increased labor costs for drivers. Ports with congestion factors above 
                10% typically pass these additional costs on to shippers and logistics providers. Understanding 
                these dynamics enables supply chain professionals to make informed decisions about port selection, 
                potentially routing cargo through less congested facilities during peak periods or negotiating 
                favorable terms based on volume commitments.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Port Cost Comparison
              </CardTitle>
              <CardDescription>
                Compare drayage costs across all major US ports with current parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={portComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="totalCost" fill={OCEAN_BLUE} radius={[0, 4, 4, 0]}>
                      {portComparisonData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.code === port ? LOGISTICS_GREEN : OCEAN_BLUE}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: LOGISTICS_GREEN }} />
                  <span>Selected Port</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: OCEAN_BLUE }} />
                  <span>Other Ports</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart for Port Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                Port Performance Metrics
              </CardTitle>
              <CardDescription>
                Multi-dimensional comparison of port efficiency factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Cost Efficiency"
                      dataKey="cost"
                      stroke={OCEAN_BLUE}
                      fill={OCEAN_BLUE}
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Speed"
                      dataKey="speed"
                      stroke={LOGISTICS_GREEN}
                      fill={LOGISTICS_GREEN}
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Efficiency"
                      dataKey="efficiency"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Port Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison Table</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Port</th>
                      <th className="text-left py-3 px-4 font-medium">Region</th>
                      <th className="text-right py-3 px-4 font-medium">Est. Cost</th>
                      <th className="text-right py-3 px-4 font-medium">Wait Time</th>
                      <th className="text-right py-3 px-4 font-medium">Congestion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portComparisonData.map((item) => (
                      <tr
                        key={item.code}
                        className={`border-b ${item.code === port ? "bg-muted/50" : ""}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" style={{ color: item.code === port ? LOGISTICS_GREEN : OCEAN_BLUE }} />
                            <span className="font-medium">{item.name}</span>
                            {item.code === port && (
                              <Badge variant="secondary" className="text-xs">Selected</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{item.region}</td>
                        <td className="py-3 px-4 text-right font-semibold" style={{ color: item.code === port ? LOGISTICS_GREEN : OCEAN_BLUE }}>
                          {formatCurrency(item.totalCost)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge variant="outline">{item.waitTime}h</Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Badge className={parseInt(item.congestion) > 10 ? "bg-amber-500" : "bg-green-500"} variant="secondary">
                            {item.congestion}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Distance Sensitivity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Distance vs Cost Analysis
              </CardTitle>
              <CardDescription>
                See how total cost changes with different distances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={distanceSensitivityData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis 
                      dataKey="distance" 
                      label={{ value: "One-way Distance (miles)", position: "bottom", offset: -5 }}
                    />
                    <YAxis 
                      yAxisId="left"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "totalCost" ? "Total Cost" : name
                      ]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="totalCost"
                      fill={OCEAN_BLUE}
                      stroke={OCEAN_BLUE}
                      fillOpacity={0.3}
                      name="Total Cost"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="distanceCost"
                      stroke={LOGISTICS_GREEN}
                      strokeWidth={2}
                      dot={{ fill: LOGISTICS_GREEN }}
                      name="Distance Cost"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="fuelSurcharge"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ fill: "#F59E0B" }}
                      name="Fuel Surcharge"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Wait Time Comparison */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Wait Time by Port
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(PORT_TERMINALS).map(([code, data]) => ({
                      name: data.name,
                      waitTime: data.avgWaitTime,
                      cost: data.avgWaitTime * 45,
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "waitTime" ? `${value}h` : formatCurrency(value),
                          name === "waitTime" ? "Wait Time" : "Wait Cost"
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="waitTime" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-500" />
                  Congestion Factor by Port
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(PORT_TERMINALS).map(([code, data]) => ({
                      name: data.name,
                      congestion: ((data.congestionFactor - 1) * 100),
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} interval={0} fontSize={10} />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(0)}%`, "Congestion"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="congestion" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Efficiency Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                Cost Efficiency Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-semibold">Best Value Port</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                    {portComparisonData[0]?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(portComparisonData[0]?.totalCost || 0)} total cost
                  </p>
                </div>
                
                <div className="p-4 border rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold">Highest Congestion</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">
                    {Object.entries(PORT_TERMINALS)
                      .sort((a, b) => b[1].congestionFactor - a[1].congestionFactor)[0]?.[1].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {((Object.entries(PORT_TERMINALS)
                      .sort((a, b) => b[1].congestionFactor - a[1].congestionFactor)[0]?.[1].congestionFactor || 1 - 1) * 100).toFixed(0)}% surcharge
                  </p>
                </div>
                
                <div className="p-4 border rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-500" />
                    <span className="font-semibold">Shortest Wait Time</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">
                    {Object.entries(PORT_TERMINALS)
                      .sort((a, b) => a[1].avgWaitTime - b[1].avgWaitTime)[0]?.[1].name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {Object.entries(PORT_TERMINALS)
                      .sort((a, b) => a[1].avgWaitTime - b[1].avgWaitTime)[0]?.[1].avgWaitTime}h average
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6">
          {/* What is Drayage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                What is Drayage?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Drayage is a specialized form of freight transportation that involves moving goods over short 
                distances, typically within the same metropolitan area or region. The term originates from the 
                historical practice of using horse-drawn carts (drays) to transport goods between ships and 
                warehouses. In modern logistics, drayage plays a crucial role in intermodal transportation, 
                serving as the critical link that connects ocean vessels, rail networks, and trucking operations.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Drayage services are essential for containerized cargo that arrives at ports via ocean vessels 
                and needs to be transported to distribution centers, warehouses, or rail terminals for further 
                transportation. Unlike long-haul trucking, drayage operations focus on efficiency and speed 
                within a localized area. Drivers typically complete multiple "turns" or trips per day, moving 
                containers between ports and nearby facilities. The average drayage distance ranges from 50 to 
                200 miles, though most operations occur within a 100-mile radius of the port.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The drayage industry has evolved significantly with the growth of global trade and containerization. 
                Today, drayage services handle millions of containers annually at major ports worldwide. The 
                efficiency of drayage operations directly impacts supply chain performance, affecting delivery 
                times, inventory levels, and overall logistics costs. Understanding the dynamics of drayage is 
                essential for anyone involved in import/export operations, supply chain management, or 
                transportation logistics.
              </p>
            </CardContent>
          </Card>

          {/* Cost Components */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                Understanding Drayage Cost Components
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Drayage costs comprise multiple components that together determine the total expense of moving 
                containers from port to destination. The base drayage rate forms the foundation of pricing, 
                calculated per mile and adjusted for factors such as container type, weight, and port 
                congestion. Distance costs increase proportionally with the miles traveled, typically ranging 
                from $3.00 to $5.00 per mile depending on market conditions and regional factors.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Fuel surcharges represent a significant variable component of drayage costs. These surcharges 
                fluctuate with diesel prices and are typically calculated as a percentage of the base rate. 
                Most carriers update their fuel surcharges weekly or monthly based on Department of Energy 
                national average diesel prices. During periods of fuel price volatility, surcharges can change 
                rapidly, impacting overall transportation budgets. Terminal fees cover various charges including 
                gate processing, documentation, and handling services at port facilities.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Chassis fees apply when carriers provide the wheeled frame necessary for container transport. 
                These fees can vary based on chassis type (standard, extended, reefer) and availability. During 
                chassis shortages, fees can increase significantly, and delays in obtaining equipment can 
                cascade through supply chains. Wait time costs accrue when drivers spend extended periods at 
                terminals waiting for container availability or gate access. Demurrage and detention charges 
                represent potentially significant costs when containers exceed their free time allowances at 
                terminals or customer facilities.
              </p>
            </CardContent>
          </Card>

          {/* Container Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Container Types and Their Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Different container types affect drayage operations and costs in various ways. The most common 
                container types include standard dry containers (20' and 40'), high cube containers that offer 
                additional height for voluminous cargo, refrigerated containers (reefers) for temperature-sensitive 
                goods, and specialized containers like open-top and flat-rack for oversized cargo. Each type 
                requires specific handling procedures, equipment, and expertise, which influence drayage costs.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {CONTAINER_TYPES.slice(0, 4).map((type) => (
                  <div key={type.id} className="p-4 border rounded-xl">
                    <Container className="h-8 w-8 mb-2" style={{ color: OCEAN_BLUE }} />
                    <h4 className="font-semibold">{type.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Length: {type.length}' | Weight Factor: {type.weight}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips and Best Practices */}
          <Card style={{ borderColor: LOGISTICS_GREEN }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                <Lightbulb className="h-5 w-5" />
                Tips for Reducing Drayage Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Implementing strategic practices can significantly reduce your drayage expenses while improving 
                operational efficiency. The key to cost reduction lies in understanding the factors that drive 
                costs and implementing targeted strategies to address each component. From terminal appointment 
                scheduling to equipment management, every aspect of the drayage process presents opportunities 
                for optimization.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-semibold">Schedule Terminal Appointments</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Book terminal appointments in advance to reduce wait times and avoid peak congestion periods. 
                    Many ports offer appointment systems that guarantee specific time slots for container pickup.
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-semibold">Use Off-Peak Gate Hours</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Many terminals offer extended gate hours during nights and weekends. Utilizing these off-peak 
                    periods can significantly reduce wait times and improve turn efficiency.
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-semibold">Pre-File Customs Documents</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ensure customs documentation is filed before vessel arrival to avoid delays at the terminal. 
                    Pre-filing allows for immediate container release upon discharge.
                  </p>
                </div>
                
                <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-semibold">Monitor Free Time</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Keep track of free time allowances for both demurrage (terminal storage) and detention 
                    (container use) to avoid costly daily charges that can accumulate rapidly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Industry Standards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Industry Standards and Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Understanding industry standards and benchmarks is essential for evaluating your drayage 
                operations against market norms. Average turn times vary by port and region, with efficient 
                operations completing turns in 2-4 hours, while congested ports may see turn times exceeding 
                6-8 hours. Per-mile rates typically range from $3.00 to $5.00, adjusted for regional factors 
                and market conditions. Fuel surcharges generally fall between 20-35% of the base rate.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Terminal free time allowances typically range from 5-7 days for demurrage and 3-5 days for 
                detention, though these can vary by shipping line and container type. Exceeding free time 
                results in daily charges that can range from $50-150 per day for demurrage and $75-200 per 
                day for detention. Chassis rental rates typically range from $45-85 per day depending on type 
                and availability. By monitoring these benchmarks, logistics professionals can identify areas 
                where their operations may be underperforming and implement targeted improvements.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          {/* Educational Intro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Everything you need to know about drayage costs and operations
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Drayage operations involve numerous complexities that can affect costs, efficiency, and overall 
                supply chain performance. The following frequently asked questions address the most common 
                concerns and inquiries from logistics professionals, freight forwarders, and supply chain 
                managers. Understanding these concepts is essential for making informed decisions about your 
                drayage operations and optimizing your intermodal transportation strategy.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Whether you are new to drayage operations or looking to improve your existing processes, these 
                FAQs provide valuable insights into the factors that influence costs, best practices for 
                operations, and strategies for dealing with common challenges. Each answer is designed to 
                provide practical, actionable information that you can apply to your specific situation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="flex items-center gap-3">
                        <Zap className="h-4 w-4 shrink-0" style={{ color: OCEAN_BLUE }} />
                        <span className="font-medium">{item.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground pl-7 leading-relaxed">{item.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Key Factors Accordion */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: OCEAN_BLUE }} />
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground mb-2">Understanding Drayage Costs</p>
                  <p className="leading-relaxed mb-2">
                    Drayage is the transportation of freight over a short distance, typically from a port 
                    or rail terminal to a nearby warehouse or distribution center. Costs vary based on 
                    distance, equipment needs, fuel prices, and terminal congestion.
                  </p>
                  <p className="leading-relaxed">
                    This calculator provides estimates based on industry averages and current market 
                    conditions. Actual costs may vary based on specific carrier rates, contract terms, 
                    and real-time terminal conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="drayage-factors">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  Key Factors Affecting Drayage Costs
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Truck className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                      Equipment Factors
                    </h4>
                    <ul className="space-y-1">
                      <li>• Container size and type (standard, reefer, oversized)</li>
                      <li>• Chassis availability and type requirements</li>
                      <li>• Weight and cargo characteristics</li>
                      <li>• Special handling requirements</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Building2 className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                      Terminal Factors
                    </h4>
                    <ul className="space-y-1">
                      <li>• Terminal congestion and wait times</li>
                      <li>• Gate hours and appointment availability</li>
                      <li>• Demurrage and detention charges</li>
                      <li>• Free time allowances</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Route className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                      Route Factors
                    </h4>
                    <ul className="space-y-1">
                      <li>• Distance from port to destination</li>
                      <li>• Traffic patterns and time of day</li>
                      <li>• Route restrictions (bridge heights, weight limits)</li>
                      <li>• Return trip requirements</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 dark:bg-muted/30 rounded-xl">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-amber-500" />
                      Market Factors
                    </h4>
                    <ul className="space-y-1">
                      <li>• Current fuel prices and surcharges</li>
                      <li>• Driver availability and labor rates</li>
                      <li>• Seasonal demand fluctuations</li>
                      <li>• Regional market conditions</li>
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="terminology">
              <AccordionTrigger>
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                  Drayage Terminology
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                      <strong className="text-foreground">Turn:</strong>
                      <p className="text-muted-foreground">A complete drayage cycle from port pickup to delivery and return.</p>
                    </div>
                    <div className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                      <strong className="text-foreground">Chassis:</strong>
                      <p className="text-muted-foreground">The wheeled frame that carries the container during truck transport.</p>
                    </div>
                    <div className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                      <strong className="text-foreground">Dwell Time:</strong>
                      <p className="text-muted-foreground">The time a container remains at the terminal before being picked up.</p>
                    </div>
                    <div className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                      <strong className="text-foreground">Free Time:</strong>
                      <p className="text-muted-foreground">The allowed days before demurrage or detention charges apply.</p>
                    </div>
                    <div className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                      <strong className="text-foreground">Demurrage:</strong>
                      <p className="text-muted-foreground">Charges for containers remaining at terminal beyond free time.</p>
                    </div>
                    <div className="p-3 bg-muted/50 dark:bg-muted/30 rounded-lg">
                      <strong className="text-foreground">Detention:</strong>
                      <p className="text-muted-foreground">Charges for keeping containers outside terminal beyond free time.</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Need More Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have additional questions about drayage operations or need assistance with complex 
                logistics scenarios, consider consulting with experienced freight forwarders or logistics 
                consultants who specialize in intermodal transportation. Professional guidance can help you 
                navigate the complexities of port operations, optimize your supply chain, and reduce 
                transportation costs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="px-4 py-2">
                  <Truck className="h-4 w-4 mr-2" style={{ color: OCEAN_BLUE }} />
                  Drayage Services
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Container className="h-4 w-4 mr-2" style={{ color: LOGISTICS_GREEN }} />
                  Container Management
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Ship className="h-4 w-4 mr-2" />
                  Port Operations
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Globe className="h-4 w-4 mr-2" />
                  Intermodal Transport
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
