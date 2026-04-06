"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Truck,
  Clock,
  Users,
  DollarSign,
  Building2,
  Calendar,
  ArrowRightLeft,
  Package,
  Warehouse,
  Timer,
  Gauge,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowRight,
  ArrowLeft,
  Settings,
  Calculator,
  Download,
  Share2,
  Plus,
  Minus,
  TimerIcon,
  RefreshCw,
  Lightbulb,
  XCircle,
  BookOpen,
  HelpCircle,
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
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  ReferenceLine,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Types
interface InboundTruck {
  id: string;
  arrivalTime: string;
  pallets: number;
  cargoType: string;
  priority: "high" | "medium" | "low";
  assignedDoor: number | null;
  unloadTime: number;
  status: "pending" | "unloading" | "completed";
}

interface OutboundTruck {
  id: string;
  departureTime: string;
  pallets: number;
  destination: string;
  assignedDoor: number | null;
  loadTime: number;
  status: "pending" | "loading" | "completed";
}

interface CrossDockingResult {
  totalProcessingTime: number;
  avgTruckTurnaround: number;
  peakUtilization: number;
  laborHours: number;
  laborCost: number;
  crossDockCost: number;
  traditionalCost: number;
  costSavings: number;
  savingsPercent: number;
  efficiency: number;
  throughputPerHour: number;
  dockUtilization: number;
}

// Dock door types
const dockDoorTypes = [
  { value: "flexible", label: "Flexible (Both Directions)" },
  { value: "inbound", label: "Inbound Only" },
  { value: "outbound", label: "Outbound Only" },
];

// Cargo types with handling times
const cargoTypes = [
  { type: "Palletized", unloadTime: 1.5, loadTime: 1.2 },
  { type: "Floor Loaded", unloadTime: 2.5, loadTime: 2.0 },
  { type: "Containerized", unloadTime: 2.0, loadTime: 1.8 },
  { type: "Refrigerated", unloadTime: 2.2, loadTime: 1.8 },
  { type: "Hazardous", unloadTime: 3.0, loadTime: 2.5 },
  { type: "Fragile", unloadTime: 2.8, loadTime: 2.2 },
];

// Labor rates by region
const laborRates = [
  { region: "US - Average", rate: 25 },
  { region: "US - West Coast", rate: 32 },
  { region: "US - East Coast", rate: 28 },
  { region: "EU - Average", rate: 22 },
  { region: "UK", rate: 20 },
  { region: "Asia - Average", rate: 12 },
  { region: "Custom", rate: 0 },
];

// Storage costs by region ($/pallet/day)
const storageCosts = [
  { region: "US - Average", cost: 0.85 },
  { region: "US - West Coast", cost: 1.10 },
  { region: "US - East Coast", cost: 0.95 },
  { region: "EU - Average", cost: 0.75 },
  { region: "UK", cost: 0.80 },
  { region: "Asia - Average", cost: 0.50 },
  { region: "Custom", cost: 0 },
];

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const chartColors = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
};

// Pro Tips Data
const proTips = [
  {
    icon: Clock,
    title: "Stagger Truck Arrivals",
    description: "Schedule inbound trucks 30-60 minutes apart to prevent dock congestion and allow smooth unloading operations. This simple adjustment can improve throughput by up to 25%.",
  },
  {
    icon: Users,
    title: "Cross-Train Your Workforce",
    description: "Train workers to handle both loading and unloading tasks. This flexibility allows you to shift labor resources based on real-time demands, reducing idle time and improving overall efficiency.",
  },
  {
    icon: Package,
    title: "Pre-Stage Outbound Cargo",
    description: "Position cargo for outbound trucks near their assigned dock doors before truck arrival. This reduces loading time significantly and enables faster truck turnaround.",
  },
  {
    icon: Gauge,
    title: "Monitor Real-Time KPIs",
    description: "Implement real-time dashboards showing dock utilization, truck wait times, and throughput rates. Quick access to this data enables proactive adjustments during peak periods.",
  },
  {
    icon: Building2,
    title: "Optimize Dock Door Assignment",
    description: "Assign dock doors based on cargo destination to minimize internal travel distance. Group similar destinations together to streamline the cross-docking process.",
  },
  {
    icon: Zap,
    title: "Leverage Flexible Doors",
    description: "Maintain 20-30% of dock doors as flexible to handle unpredictable volume fluctuations. This provides operational agility without requiring additional infrastructure investment.",
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    title: "Insufficient Buffer Time",
    description: "Failing to include buffer time between truck arrivals leads to cascading delays throughout the day. Always add 15-30 minutes of buffer time between scheduled arrivals to accommodate unexpected delays. Without adequate buffers, a single late truck can disrupt your entire schedule, causing dock congestion and increased labor costs.",
  },
  {
    title: "Ignoring Cargo Compatibility",
    description: "Not considering cargo compatibility when scheduling trucks can create safety hazards and operational inefficiencies. Hazardous materials require dedicated docks with proper safety equipment, while refrigerated goods need temperature-controlled staging areas. Mixing incompatible cargo types can result in contamination, regulatory violations, and damaged goods.",
  },
  {
    title: "Underestimating Peak Demand",
    description: "Operating at near-maximum capacity leaves no room for demand spikes or unexpected situations. Plan for 75-80% average utilization to maintain operational flexibility. Running at 95%+ utilization may seem efficient, but it creates a fragile system where any disruption causes significant delays and customer service failures.",
  },
  {
    title: "Neglecting Worker Safety",
    description: "Prioritizing speed over safety leads to accidents, injuries, and long-term productivity losses. Ensure proper lighting, clear pathways, and appropriate personal protective equipment. Rushed workers are more likely to make mistakes that result in damaged cargo, injuries, and costly worker compensation claims that far exceed any short-term efficiency gains.",
  },
  {
    title: "Poor Communication Systems",
    description: "Lack of real-time communication between dock staff, drivers, and warehouse management leads to confusion and delays. Implement standardized communication protocols and ensure all stakeholders have access to current schedule and status information. Poor communication often results in trucks waiting at wrong docks or cargo being sent to incorrect destinations.",
  },
];

// FAQ Data
const faqData = [
  {
    question: "What is cross-docking and how does it differ from traditional warehousing?",
    answer: "Cross-docking is a logistics strategy where incoming goods are directly transferred from inbound trucks to outbound vehicles with minimal or no storage time in between. Unlike traditional warehousing where products are stored for days, weeks, or months before being shipped out, cross-docking eliminates the storage phase entirely or reduces it to less than 24 hours. This approach significantly reduces handling costs, storage fees, and order fulfillment time. Traditional warehousing involves receiving goods, putting them away in storage locations, picking them when orders arrive, and then shipping them out. Cross-docking streamlines this to receiving and immediately shipping, often within hours of arrival. The strategy works best for high-volume, time-sensitive goods, or products with predictable demand patterns. While traditional warehousing provides buffer stock and flexibility, cross-docking requires precise coordination and reliable supply chain partners.",
  },
  {
    question: "What types of products are best suited for cross-docking operations?",
    answer: "Cross-docking is most effective for products with specific characteristics that align with the just-in-time nature of the process. High-turnover consumer goods are ideal candidates, including perishable items like fresh produce, dairy products, and baked goods that have limited shelf life and need rapid distribution. Pre-tagged and pre-packaged retail merchandise that doesn't require additional processing works well, as does high-demand, predictable items like basic household goods and popular electronics. Products with regular, consistent demand patterns allow for accurate scheduling and resource planning. Manufacturing components delivered just-in-time for production lines benefit enormously from cross-docking, as do promotional items and seasonal merchandise that need rapid deployment to retail locations. Conversely, products requiring quality inspection, repackaging, or assembly are less suitable, as are slow-moving items with unpredictable demand that benefit from safety stock buffers.",
  },
  {
    question: "How do I calculate the potential savings from implementing cross-docking?",
    answer: "Calculating cross-docking savings requires analyzing several cost categories and comparing them against your current warehousing expenses. Start by calculating your current storage costs: multiply your average inventory volume by storage rates per pallet per day, then by average storage duration. Include costs for warehouse space, utilities, insurance, and inventory carrying costs (typically 15-25% of inventory value annually). Next, estimate your handling cost reduction: cross-docking typically reduces touches from 4-6 (receive, put-away, pick, pack, ship) to 2-3 (receive, sort, ship). Calculate labor savings from reduced handling time. Factor in inventory carrying cost reductions from lower average inventory levels. Consider transportation efficiencies from better truck utilization and reduced empty miles. Finally, account for improved cash flow from faster order fulfillment. The total savings formula becomes: (Storage Costs Eliminated + Handling Labor Saved + Inventory Carrying Costs Reduced + Transportation Efficiency Gains) minus (Additional Planning and Coordination Costs). Most operations see 15-35% total logistics cost reduction, though results vary by industry and implementation quality.",
  },
  {
    question: "What infrastructure requirements are needed for an effective cross-docking facility?",
    answer: "Effective cross-docking facilities require purpose-built infrastructure designed for rapid throughput. The foundation is adequate dock doors: typically 20-40 doors depending on volume, with a mix of inbound, outbound, and flexible doors. Doors should be equipped with levelers, seals, and restraints for quick, safe trailer access. The staging area between docks is critical: plan for 40-60 feet of clear floor space per door to allow efficient forklift traffic and temporary staging. Flooring must be high-grade concrete capable of supporting heavy forklift traffic continuously. Adequate lighting throughout the facility is essential for safety and efficiency. Material handling equipment should include a mix of forklifts, pallet jacks, and possibly conveyor systems for high-volume operations. A robust Warehouse Management System (WMS) with real-time tracking capabilities is crucial for coordinating incoming and outgoing shipments. Communication infrastructure including barcode scanners, RFID systems, and mobile devices enables real-time visibility. Climate control may be necessary for temperature-sensitive products. Finally, consider security systems, fire suppression, and emergency protocols appropriate for your cargo types.",
  },
  {
    question: "What are the key performance indicators (KPIs) for measuring cross-docking efficiency?",
    answer: "Measuring cross-docking performance requires tracking multiple KPIs across operational, financial, and service dimensions. Dock utilization rate measures what percentage of available dock capacity is being used, with optimal performance typically between 70-85%. Truck turnaround time tracks how quickly trucks are processed from arrival to departure; target times vary by industry but generally should be under 2 hours. Throughput rate measures pallets or units processed per hour per dock door. Order accuracy tracks the percentage of shipments correctly sorted and loaded. On-time departure percentage measures how many outbound trucks leave at or before scheduled times. Labor productivity calculates units processed per labor hour. Cost per unit processed combines labor, equipment, and facility costs divided by throughput. Cross-dock conversion time measures the interval between receiving and shipping specific products. Inventory dwell time tracks how long products remain in the facility, ideally under 24 hours. Additional KPIs include carrier appointment adherence, loading efficiency, and damage rates. Regular monitoring of these KPIs enables continuous improvement and helps identify operational bottlenecks.",
  },
  {
    question: "How does cross-docking impact supply chain visibility and inventory management?",
    answer: "Cross-docking fundamentally transforms supply chain visibility and inventory management practices. With minimal storage time, inventory tracking shifts from static warehouse management to dynamic flow management. Real-time visibility becomes critical: you need precise knowledge of incoming shipment contents, timing, and destination before trucks arrive. This requires tight integration with suppliers' systems and advance shipping notifications (ASNs). Inventory levels are dramatically reduced, often by 50-80%, freeing up working capital but requiring more precise demand forecasting. Safety stock concepts shift from warehouse buffers to pipeline inventory management. Product traceability improves as goods spend less time in storage where tracking can be lost. However, the lack of safety stock means supply chain disruptions have immediate impact: a delayed inbound truck directly affects outbound shipments. This necessitates robust contingency planning and alternative supplier arrangements. The reduced inventory carrying cost must be weighed against increased risk exposure and the cost of sophisticated tracking systems. Many organizations find the net effect positive, with improved cash flow, fresher products, and better customer service, but success depends on reliable supply chain partners and accurate demand forecasting.",
  },
  {
    question: "What are the main challenges in implementing cross-docking and how can they be overcome?",
    answer: "Implementing cross-docking presents several significant challenges that require careful planning and execution to overcome. The primary challenge is coordination complexity: synchronizing inbound and outbound shipments requires precise timing and reliable partners. Overcome this by implementing robust scheduling systems, establishing clear communication protocols, and building buffer time into schedules. Another major hurdle is supplier reliability: cross-docking depends on suppliers delivering accurate orders on time. Address this through supplier scorecards, performance contracts, and maintaining backup suppliers for critical items. Internal resistance to change can slow implementation; involve workers early in planning, provide comprehensive training, and demonstrate how cross-docking improves their work experience. Technology integration challenges arise when connecting WMS, TMS, and supplier systems; work with vendors experienced in cross-docking operations and consider phased implementation. Volume variability can make consistent operations difficult; maintain flexible capacity through cross-trained workers and adjustable dock assignments. Quality control becomes harder with compressed timeframes; implement pre-shipment quality agreements with suppliers and use spot-checking protocols. Finally, seasonal and demand fluctuations require adaptive planning; develop contingency procedures and consider hybrid operations during transition periods.",
  },
  {
    question: "How should businesses decide between cross-docking and traditional warehousing?",
    answer: "The decision between cross-docking and traditional warehousing should be based on a comprehensive analysis of your product characteristics, demand patterns, supplier capabilities, and strategic objectives. Start by analyzing your product portfolio: high-volume items with predictable demand and minimal handling requirements are cross-docking candidates, while slow-moving, complex, or inspection-requiring products may need traditional storage. Evaluate your demand variability: consistent demand favors cross-docking, while highly variable demand requires safety stock buffers. Assess supplier reliability: cross-docking demands dependable suppliers who deliver accurate orders on time. Consider your customer service requirements: cross-docking reduces lead times but offers less flexibility for unexpected orders. Analyze cost structures: calculate total logistics costs including storage, handling, inventory carrying costs, and transportation for both scenarios. Evaluate facility constraints: cross-docking requires specific dock configurations and staging areas. Consider risk tolerance: cross-docking reduces inventory buffers that protect against supply chain disruptions. Many organizations find a hybrid approach optimal: cross-docking suitable products while maintaining traditional storage for others. Pilot programs can help test assumptions before full implementation. The right choice ultimately depends on your specific business context, customer expectations, and competitive positioning.",
  },
];

export function CrossDockingCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  const [copied, setCopied] = useState(false);

  // Dock configuration
  const [totalDoors, setTotalDoors] = useState<number>(12);
  const [flexibleDoors, setFlexibleDoors] = useState<number>(4);
  const [operatingHours, setOperatingHours] = useState<number>(16);

  // Scheduling inputs
  const [inboundTrucks, setInboundTrucks] = useState<InboundTruck[]>([
    { id: "IB-001", arrivalTime: "06:00", pallets: 24, cargoType: "Palletized", priority: "high", assignedDoor: null, unloadTime: 1.5, status: "pending" },
    { id: "IB-002", arrivalTime: "07:30", pallets: 18, cargoType: "Palletized", priority: "medium", assignedDoor: null, unloadTime: 1.5, status: "pending" },
    { id: "IB-003", arrivalTime: "08:00", pallets: 32, cargoType: "Containerized", priority: "high", assignedDoor: null, unloadTime: 2.0, status: "pending" },
    { id: "IB-004", arrivalTime: "09:00", pallets: 20, cargoType: "Floor Loaded", priority: "low", assignedDoor: null, unloadTime: 2.5, status: "pending" },
    { id: "IB-005", arrivalTime: "10:30", pallets: 28, cargoType: "Refrigerated", priority: "high", assignedDoor: null, unloadTime: 2.2, status: "pending" },
  ]);

  const [outboundTrucks, setOutboundTrucks] = useState<OutboundTruck[]>([
    { id: "OB-001", departureTime: "10:00", pallets: 22, destination: "Regional Hub A", assignedDoor: null, loadTime: 1.2, status: "pending" },
    { id: "OB-002", departureTime: "12:00", pallets: 30, destination: "Regional Hub B", assignedDoor: null, loadTime: 1.2, status: "pending" },
    { id: "OB-003", departureTime: "14:00", pallets: 25, destination: "Distribution Center", assignedDoor: null, loadTime: 1.2, status: "pending" },
    { id: "OB-004", departureTime: "16:00", pallets: 18, destination: "Local Delivery", assignedDoor: null, loadTime: 1.2, status: "pending" },
  ]);

  // Labor parameters
  const [workersPerDoor, setWorkersPerDoor] = useState<number>(2);
  const [laborRegion, setLaborRegion] = useState<string>("US - Average");
  const [customLaborRate, setCustomLaborRate] = useState<number>(25);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(1.5);

  // Cost parameters
  const [storageRegion, setStorageRegion] = useState<string>("US - Average");
  const [customStorageCost, setCustomStorageCost] = useState<number>(0.85);
  const [traditionalStorageDays, setTraditionalStorageDays] = useState<number>(7);
  const [facilityOverheadRate, setFacilityOverheadRate] = useState<number>(15);

  // Calculate results
  const result = useMemo<CrossDockingResult>(() => {
    const totalInboundPallets = inboundTrucks.reduce((sum, t) => sum + t.pallets, 0);
    const totalOutboundPallets = outboundTrucks.reduce((sum, t) => sum + t.pallets, 0);
    const totalPallets = Math.max(totalInboundPallets, totalOutboundPallets);

    // Get labor rate
    const laborRate = laborRegion === "Custom" ? customLaborRate : laborRates.find(r => r.region === laborRegion)?.rate || 25;

    // Get storage cost
    const storageCostPerPallet = storageRegion === "Custom" ? customStorageCost : storageCosts.find(r => r.region === storageRegion)?.cost || 0.85;

    // Calculate processing times
    const avgUnloadTime = inboundTrucks.reduce((sum, t) => sum + t.unloadTime, 0) / inboundTrucks.length;
    const avgLoadTime = outboundTrucks.reduce((sum, t) => sum + t.loadTime, 0) / outboundTrucks.length;
    const totalUnloadTime = inboundTrucks.reduce((sum, t) => sum + t.unloadTime, 0);
    const totalLoadTime = outboundTrucks.reduce((sum, t) => sum + t.loadTime, 0);

    // Dock utilization calculation
    const totalDoorHours = totalDoors * operatingHours;
    const usedDoorHours = totalUnloadTime + totalLoadTime;
    const dockUtilization = (usedDoorHours / totalDoorHours) * 100;

    // Peak utilization (simplified - assumes peak when multiple trucks)
    const peakUtilization = Math.min(100, (totalDoors / totalDoors) * (usedDoorHours / operatingHours) * 1.3);

    // Labor calculations
    const totalProcessingTime = Math.max(totalUnloadTime, totalLoadTime) + 0.5; // buffer
    const laborHours = totalProcessingTime * workersPerDoor * totalDoors;
    const regularHours = Math.min(laborHours, operatingHours * workersPerDoor * totalDoors);
    const overtimeHours = Math.max(0, laborHours - regularHours);
    const laborCost = (regularHours * laborRate) + (overtimeHours * laborRate * overtimeMultiplier);

    // Throughput
    const throughputPerHour = totalPallets / totalProcessingTime;

    // Cross-docking cost
    const crossDockCost = laborCost + (totalPallets * storageCostPerPallet * 0.5) + (facilityOverheadRate * totalProcessingTime);

    // Traditional warehousing cost
    const traditionalStorageCost = totalPallets * storageCostPerPallet * traditionalStorageDays;
    const traditionalHandlingCost = totalPallets * 0.5 * laborRate; // extra handling
    const traditionalCost = traditionalStorageCost + traditionalHandlingCost + (facilityOverheadRate * traditionalStorageDays);

    // Savings
    const costSavings = traditionalCost - crossDockCost;
    const savingsPercent = (costSavings / traditionalCost) * 100;

    // Efficiency metrics
    const avgTruckTurnaround = (avgUnloadTime + avgLoadTime) / 2 + 0.5;
    const efficiency = Math.min(100, (throughputPerHour / 30) * 100); // 30 pallets/hour is benchmark

    return {
      totalProcessingTime: parseFloat(totalProcessingTime.toFixed(1)),
      avgTruckTurnaround: parseFloat(avgTruckTurnaround.toFixed(1)),
      peakUtilization: parseFloat(Math.min(100, peakUtilization).toFixed(1)),
      laborHours: parseFloat(laborHours.toFixed(1)),
      laborCost: parseFloat(laborCost.toFixed(2)),
      crossDockCost: parseFloat(crossDockCost.toFixed(2)),
      traditionalCost: parseFloat(traditionalCost.toFixed(2)),
      costSavings: parseFloat(costSavings.toFixed(2)),
      savingsPercent: parseFloat(savingsPercent.toFixed(1)),
      efficiency: parseFloat(efficiency.toFixed(1)),
      throughputPerHour: parseFloat(throughputPerHour.toFixed(1)),
      dockUtilization: parseFloat(dockUtilization.toFixed(1)),
    };
  }, [inboundTrucks, outboundTrucks, totalDoors, operatingHours, workersPerDoor, laborRegion, customLaborRate, overtimeMultiplier, storageRegion, customStorageCost, traditionalStorageDays, facilityOverheadRate]);

  // Generate dock door schedule
  const dockSchedule = useMemo(() => {
    const schedule: { door: number; time: string; activity: string; truck: string; pallets: number }[] = [];
    let currentTime = 6; // Start at 6 AM

    // Assign inbound trucks
    const inboundSorted = [...inboundTrucks].sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    inboundSorted.forEach((truck, index) => {
      const door = (index % totalDoors) + 1;
      const time = `${String(currentTime).padStart(2, '0')}:00`;
      schedule.push({
        door,
        time,
        activity: "Unload",
        truck: truck.id,
        pallets: truck.pallets,
      });
      currentTime += truck.unloadTime;
    });

    // Assign outbound trucks
    currentTime = Math.max(currentTime, 10); // Start outbound after initial inbound
    outboundTrucks.forEach((truck, index) => {
      const door = ((index + inboundTrucks.length) % totalDoors) + 1;
      const time = `${String(Math.floor(currentTime)).padStart(2, '0')}:${String((currentTime % 1) * 60).padStart(2, '0')}`;
      schedule.push({
        door,
        time,
        activity: "Load",
        truck: truck.id,
        pallets: truck.pallets,
      });
      currentTime += truck.loadTime;
    });

    return schedule;
  }, [inboundTrucks, outboundTrucks, totalDoors]);

  // Utilization timeline data
  const utilizationData = useMemo(() => {
    const data = [];
    for (let hour = 6; hour < 6 + operatingHours; hour++) {
      const activeInbound = inboundTrucks.filter(t => {
        const arrival = parseInt(t.arrivalTime.split(":")[0]);
        return hour >= arrival && hour < arrival + t.unloadTime;
      }).length;

      const activeOutbound = outboundTrucks.filter(t => {
        const departure = parseInt(t.departureTime.split(":")[0]);
        return hour >= departure - t.loadTime && hour < departure;
      }).length;

      const utilization = ((activeInbound + activeOutbound) / totalDoors) * 100;

      data.push({
        hour: `${String(hour).padStart(2, '0')}:00`,
        inbound: activeInbound,
        outbound: activeOutbound,
        utilization: Math.min(100, utilization),
      });
    }
    return data;
  }, [inboundTrucks, outboundTrucks, totalDoors, operatingHours]);

  // Cost comparison data
  const costComparisonData = useMemo(() => [
    { name: "Cross-Dock", value: result.crossDockCost, fill: "#2E8B57" },
    { name: "Traditional", value: result.traditionalCost, fill: "#0F4C81" },
  ], [result]);

  // Cost breakdown pie data
  const costBreakdownData = useMemo(() => {
    const totalPallets = Math.max(inboundTrucks.reduce((s, t) => s + t.pallets, 0), outboundTrucks.reduce((s, t) => s + t.pallets, 0));
    const storageCostPerPallet = storageRegion === "Custom" ? customStorageCost : storageCosts.find(r => r.region === storageRegion)?.cost || 0.85;
    
    return [
      { name: "Labor Cost", value: result.laborCost, color: chartColors.ocean },
      { name: "Handling Cost", value: result.crossDockCost * 0.15, color: chartColors.logistics },
      { name: "Facility Overhead", value: facilityOverheadRate * result.totalProcessingTime, color: chartColors.warning },
      { name: "Storage Cost", value: totalPallets * storageCostPerPallet * 0.5, color: chartColors.purple },
    ];
  }, [result, storageRegion, customStorageCost, facilityOverheadRate, inboundTrucks, outboundTrucks]);

  // Time savings data
  const timeSavingsData = useMemo(() => [
    { name: "Processing Time", crossDock: result.totalProcessingTime, traditional: traditionalStorageDays * 24, fill: "#2E8B57" },
    { name: "Truck Turnaround", crossDock: result.avgTruckTurnaround, traditional: result.avgTruckTurnaround * 2, fill: "#0F4C81" },
    { name: "Labor Hours", crossDock: result.laborHours, traditional: result.laborHours * 1.5, fill: "#F59E0B" },
  ], [result, traditionalStorageDays]);

  // Throughput analysis data
  const throughputData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= 12; i++) {
      const baseThroughput = result.throughputPerHour;
      const variation = Math.sin(i * 0.5) * 5;
      data.push({
        month: `Month ${i}`,
        throughput: Math.max(0, baseThroughput + variation),
        benchmark: 30,
      });
    }
    return data;
  }, [result]);

  // Add/remove truck handlers
  const addInboundTruck = () => {
    const newId = `IB-${String(inboundTrucks.length + 1).padStart(3, '0')}`;
    setInboundTrucks([...inboundTrucks, {
      id: newId,
      arrivalTime: "08:00",
      pallets: 20,
      cargoType: "Palletized",
      priority: "medium",
      assignedDoor: null,
      unloadTime: 1.5,
      status: "pending",
    }]);
  };

  const removeInboundTruck = (id: string) => {
    setInboundTrucks(inboundTrucks.filter(t => t.id !== id));
  };

  const updateInboundTruck = (id: string, field: keyof InboundTruck, value: string | number) => {
    setInboundTrucks(inboundTrucks.map(t => {
      if (t.id === id) {
        const updated = { ...t, [field]: value };
        if (field === "cargoType") {
          const cargo = cargoTypes.find(c => c.type === value);
          if (cargo) {
            updated.unloadTime = cargo.unloadTime;
          }
        }
        return updated;
      }
      return t;
    }));
  };

  const addOutboundTruck = () => {
    const newId = `OB-${String(outboundTrucks.length + 1).padStart(3, '0')}`;
    setOutboundTrucks([...outboundTrucks, {
      id: newId,
      departureTime: "14:00",
      pallets: 20,
      destination: "Distribution Center",
      assignedDoor: null,
      loadTime: 1.2,
      status: "pending",
    }]);
  };

  const removeOutboundTruck = (id: string) => {
    setOutboundTrucks(outboundTrucks.filter(t => t.id !== id));
  };

  const updateOutboundTruck = (id: string, field: keyof OutboundTruck, value: string | number) => {
    setOutboundTrucks(outboundTrucks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  // Reset function
  const handleReset = useCallback(() => {
    setTotalDoors(12);
    setFlexibleDoors(4);
    setOperatingHours(16);
    setWorkersPerDoor(2);
    setLaborRegion("US - Average");
    setCustomLaborRate(25);
    setOvertimeMultiplier(1.5);
    setStorageRegion("US - Average");
    setCustomStorageCost(0.85);
    setTraditionalStorageDays(7);
    setFacilityOverheadRate(15);
    setInboundTrucks([
      { id: "IB-001", arrivalTime: "06:00", pallets: 24, cargoType: "Palletized", priority: "high", assignedDoor: null, unloadTime: 1.5, status: "pending" },
      { id: "IB-002", arrivalTime: "07:30", pallets: 18, cargoType: "Palletized", priority: "medium", assignedDoor: null, unloadTime: 1.5, status: "pending" },
      { id: "IB-003", arrivalTime: "08:00", pallets: 32, cargoType: "Containerized", priority: "high", assignedDoor: null, unloadTime: 2.0, status: "pending" },
      { id: "IB-004", arrivalTime: "09:00", pallets: 20, cargoType: "Floor Loaded", priority: "low", assignedDoor: null, unloadTime: 2.5, status: "pending" },
      { id: "IB-005", arrivalTime: "10:30", pallets: 28, cargoType: "Refrigerated", priority: "high", assignedDoor: null, unloadTime: 2.2, status: "pending" },
    ]);
    setOutboundTrucks([
      { id: "OB-001", departureTime: "10:00", pallets: 22, destination: "Regional Hub A", assignedDoor: null, loadTime: 1.2, status: "pending" },
      { id: "OB-002", departureTime: "12:00", pallets: 30, destination: "Regional Hub B", assignedDoor: null, loadTime: 1.2, status: "pending" },
      { id: "OB-003", departureTime: "14:00", pallets: 25, destination: "Distribution Center", assignedDoor: null, loadTime: 1.2, status: "pending" },
      { id: "OB-004", departureTime: "16:00", pallets: 18, destination: "Local Delivery", assignedDoor: null, loadTime: 1.2, status: "pending" },
    ]);
  }, []);

  // Export function
  const handleExport = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      configuration: {
        totalDoors,
        flexibleDoors,
        operatingHours,
        workersPerDoor,
        laborRegion,
        storageRegion,
        traditionalStorageDays,
        facilityOverheadRate,
      },
      inboundTrucks,
      outboundTrucks,
      results: result,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cross-docking-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [totalDoors, flexibleDoors, operatingHours, workersPerDoor, laborRegion, storageRegion, traditionalStorageDays, facilityOverheadRate, inboundTrucks, outboundTrucks, result]);

  // Share function
  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Cross-Docking Analysis',
      text: `Cross-docking savings: ${formatCurrency(result.costSavings, currency)} (${result.savingsPercent}%)`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result, currency]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="flex flex-wrap gap-2 mb-4">
          {["Warehouse Operations", "Cross-Docking", "Logistics Efficiency"].map((badge, index) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Badge 
                variant="secondary" 
                className="text-xs px-3 py-1 bg-[var(--ocean)]/10 text-[var(--ocean)] dark:bg-[var(--ocean)]/20 dark:text-[var(--ocean)]"
              >
                {badge}
              </Badge>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Warehouse className="h-8 w-8 text-[var(--ocean)]" />
            Cross-Docking Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-4">
            Optimize your warehouse operations by analyzing cross-docking efficiency, comparing costs against traditional warehousing, and identifying opportunities for operational improvement.
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Quick Results Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-l-4 border-l-[var(--logistics)]">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Cost Savings</p>
                  <p className="text-xl font-bold text-[var(--logistics)]">{formatCurrency(result.costSavings, currency)}</p>
                </div>
                <TrendingDown className="h-6 w-6 text-[var(--logistics)] opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-[var(--ocean)]">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Throughput</p>
                  <p className="text-xl font-bold text-[var(--ocean)]">{result.throughputPerHour} <span className="text-sm font-normal">pallets/hr</span></p>
                </div>
                <Gauge className="h-6 w-6 text-[var(--ocean)] opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Dock Utilization</p>
                  <p className="text-xl font-bold text-amber-600">{result.dockUtilization}%</p>
                </div>
                <Warehouse className="h-6 w-6 text-amber-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                  <p className="text-xl font-bold text-green-600">{result.efficiency}%</p>
                </div>
                <Zap className="h-6 w-6 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-1">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1">
            <ArrowRightLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[var(--ocean)]" />
                  Dock Configuration
                </CardTitle>
                <CardDescription>Configure dock door settings and operating parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Total Dock Doors</Label>
                    <Badge>{totalDoors}</Badge>
                  </div>
                  <Slider
                    value={[totalDoors]}
                    onValueChange={(v) => setTotalDoors(v[0])}
                    min={4}
                    max={30}
                    step={1}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Flexible Doors</Label>
                    <Badge>{flexibleDoors}</Badge>
                  </div>
                  <Slider
                    value={[flexibleDoors]}
                    onValueChange={(v) => setFlexibleDoors(v[0])}
                    min={0}
                    max={totalDoors}
                    step={1}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Operating Hours</Label>
                    <Badge>{operatingHours}h</Badge>
                  </div>
                  <Slider
                    value={[operatingHours]}
                    onValueChange={(v) => setOperatingHours(v[0])}
                    min={8}
                    max={24}
                    step={1}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Workers per Dock Door</Label>
                    <Badge>{workersPerDoor}</Badge>
                  </div>
                  <Slider
                    value={[workersPerDoor]}
                    onValueChange={(v) => setWorkersPerDoor(v[0])}
                    min={1}
                    max={6}
                    step={1}
                  />
                </div>

                <Separator />

                <div className="flex items-center gap-4">
                  <Label className="shrink-0">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.slice(0, 15).map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Inbound Trucks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-[var(--ocean)]" />
                    Inbound Trucks
                  </span>
                  <Button size="sm" variant="outline" onClick={addInboundTruck}>
                    <Plus className="h-4 w-4 mr-1" /> Add Truck
                  </Button>
                </CardTitle>
                <CardDescription>Schedule incoming trucks and cargo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                {inboundTrucks.map((truck) => (
                  <div key={truck.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[var(--ocean)]">{truck.id}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => removeInboundTruck(truck.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Arrival Time</Label>
                        <Input
                          type="time"
                          value={truck.arrivalTime}
                          onChange={(e) => updateInboundTruck(truck.id, "arrivalTime", e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Pallets</Label>
                        <Input
                          type="number"
                          value={truck.pallets}
                          onChange={(e) => updateInboundTruck(truck.id, "pallets", parseInt(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Cargo Type</Label>
                        <Select
                          value={truck.cargoType}
                          onValueChange={(v) => updateInboundTruck(truck.id, "cargoType", v)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cargoTypes.map((c) => (
                              <SelectItem key={c.type} value={c.type}>{c.type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Priority</Label>
                        <Select
                          value={truck.priority}
                          onValueChange={(v) => updateInboundTruck(truck.id, "priority", v as "high" | "medium" | "low")}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Unload time: {truck.unloadTime}h
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Outbound Trucks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5 text-[var(--logistics)]" />
                    Outbound Trucks
                  </span>
                  <Button size="sm" variant="outline" onClick={addOutboundTruck}>
                    <Plus className="h-4 w-4 mr-1" /> Add Truck
                  </Button>
                </CardTitle>
                <CardDescription>Schedule outgoing trucks and destinations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                {outboundTrucks.map((truck) => (
                  <div key={truck.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[var(--logistics)]">{truck.id}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => removeOutboundTruck(truck.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Departure Time</Label>
                        <Input
                          type="time"
                          value={truck.departureTime}
                          onChange={(e) => updateOutboundTruck(truck.id, "departureTime", e.target.value)}
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Pallets</Label>
                        <Input
                          type="number"
                          value={truck.pallets}
                          onChange={(e) => updateOutboundTruck(truck.id, "pallets", parseInt(e.target.value))}
                          className="h-8"
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Destination</Label>
                        <Input
                          value={truck.destination}
                          onChange={(e) => updateOutboundTruck(truck.id, "destination", e.target.value)}
                          className="h-8"
                          placeholder="Enter destination"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Load time: {truck.loadTime}h
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Labor & Cost Parameters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                  Labor & Cost Parameters
                </CardTitle>
                <CardDescription>Configure labor rates and cost parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Labor Region</Label>
                  <Select value={laborRegion} onValueChange={setLaborRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {laborRates.map((r) => (
                        <SelectItem key={r.region} value={r.region}>{r.region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {laborRegion === "Custom" && (
                  <div>
                    <Label>Custom Hourly Rate ($)</Label>
                    <Input
                      type="number"
                      value={customLaborRate}
                      onChange={(e) => setCustomLaborRate(parseFloat(e.target.value))}
                    />
                  </div>
                )}

                <div>
                  <Label>Storage Cost Region</Label>
                  <Select value={storageRegion} onValueChange={setStorageRegion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {storageCosts.map((r) => (
                        <SelectItem key={r.region} value={r.region}>{r.region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {storageRegion === "Custom" && (
                  <div>
                    <Label>Custom Storage Cost ($/pallet/day)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={customStorageCost}
                      onChange={(e) => setCustomStorageCost(parseFloat(e.target.value))}
                    />
                  </div>
                )}

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Traditional Storage Days</Label>
                    <Badge>{traditionalStorageDays} days</Badge>
                  </div>
                  <Slider
                    value={[traditionalStorageDays]}
                    onValueChange={(v) => setTraditionalStorageDays(v[0])}
                    min={1}
                    max={30}
                    step={1}
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Facility Overhead Rate ($/hr)</Label>
                    <Badge>${facilityOverheadRate}</Badge>
                  </div>
                  <Slider
                    value={[facilityOverheadRate]}
                    onValueChange={(v) => setFacilityOverheadRate(v[0])}
                    min={5}
                    max={50}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[var(--ocean)]" />
                Schedule Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-[var(--ocean)]">{inboundTrucks.length}</p>
                  <p className="text-xs text-muted-foreground">Inbound Trucks</p>
                </div>
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center">
                  <p className="text-2xl font-bold text-[var(--logistics)]">{outboundTrucks.length}</p>
                  <p className="text-xs text-muted-foreground">Outbound Trucks</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{inboundTrucks.reduce((s, t) => s + t.pallets, 0)}</p>
                  <p className="text-xs text-muted-foreground">Inbound Pallets</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{outboundTrucks.reduce((s, t) => s + t.pallets, 0)}</p>
                  <p className="text-xs text-muted-foreground">Outbound Pallets</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Breakdown Analysis
                </CardTitle>
                <CardDescription>Distribution of cross-docking costs</CardDescription>
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
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Time Savings Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--logistics)]" />
                  Time Savings Comparison
                </CardTitle>
                <CardDescription>Cross-docking vs Traditional warehousing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeSavingsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={120} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="crossDock" name="Cross-Dock" fill={chartColors.logistics} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="traditional" name="Traditional" fill={chartColors.ocean} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Throughput Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                  Throughput Analysis
                </CardTitle>
                <CardDescription>Projected throughput over 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={throughputData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="throughput" 
                        name="Throughput" 
                        stroke={chartColors.logistics} 
                        strokeWidth={2}
                        dot={{ fill: chartColors.logistics }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="benchmark" 
                        name="Benchmark" 
                        stroke={chartColors.ocean} 
                        strokeDasharray="5 5"
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Dock Utilization Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-[var(--logistics)]" />
                  Dock Utilization Timeline
                </CardTitle>
                <CardDescription>Hourly dock usage throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={utilizationData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="hour" />
                      <YAxis yAxisId="left" label={{ value: 'Trucks', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Util %', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="inbound" stackId="a" fill={chartColors.ocean} name="Inbound" />
                      <Bar yAxisId="left" dataKey="outbound" stackId="a" fill={chartColors.logistics} name="Outbound" />
                      <Line yAxisId="right" type="monotone" dataKey="utilization" stroke={chartColors.warning} strokeWidth={2} name="Utilization %" />
                      <ReferenceLine yAxisId="right" y={100} stroke={chartColors.danger} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Efficiency Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                Efficiency Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Dock Utilization Gauge */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Dock Utilization</Label>
                  <span className="text-sm font-medium">{result.dockUtilization}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.dockUtilization > 90 ? "bg-red-500" :
                      result.dockUtilization > 70 ? "bg-amber-500" : "bg-[var(--logistics)]"
                    }`}
                    style={{ width: `${result.dockUtilization}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Under-utilized</span>
                  <span>Optimal (70-90%)</span>
                  <span>Over-capacity</span>
                </div>
              </div>

              {/* Efficiency Gauge */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Efficiency vs Benchmark</Label>
                  <span className="text-sm font-medium">{result.efficiency}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.efficiency >= 80 ? "bg-[var(--logistics)]" :
                      result.efficiency >= 50 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${result.efficiency}%` }}
                  />
                </div>
              </div>

              {/* Processing Time */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Processing Time</Label>
                  <span className="text-sm font-medium">{result.totalProcessingTime} hrs</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--ocean)] transition-all duration-500"
                    style={{ width: `${Math.min(100, (result.totalProcessingTime / operatingHours) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Truck Turnaround */}
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Avg Truck Turnaround</Label>
                  <span className="text-sm font-medium">{result.avgTruckTurnaround} hrs</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.avgTruckTurnaround <= 2 ? "bg-[var(--logistics)]" :
                      result.avgTruckTurnaround <= 3 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(100, (result.avgTruckTurnaround / 5) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Comparison */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Comparison */}
            <Card className="border-[var(--logistics)]/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Comparison
                </CardTitle>
                <CardDescription>Cross-docking vs Traditional warehousing costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {costComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Cross-Docking</p>
                    <p className="text-2xl font-bold text-[var(--logistics)]">{formatCurrency(result.crossDockCost, currency)}</p>
                  </div>
                  <div className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Traditional</p>
                    <p className="text-2xl font-bold text-[var(--ocean)]">{formatCurrency(result.traditionalCost, currency)}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Total Savings</p>
                  <p className="text-3xl font-bold text-green-600">{formatCurrency(result.costSavings, currency)}</p>
                  <Badge className="bg-green-600 mt-2">{result.savingsPercent}% Savings</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="crossdock">
                    <AccordionTrigger className="text-[var(--logistics)]">
                      Cross-Docking Costs
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Labor Cost</span>
                          <span>{formatCurrency(result.laborCost, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Handling Cost</span>
                          <span>{formatCurrency(result.crossDockCost * 0.15, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Facility Overhead</span>
                          <span>{formatCurrency(facilityOverheadRate * result.totalProcessingTime, currency)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(result.crossDockCost, currency)}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="traditional">
                    <AccordionTrigger className="text-[var(--ocean)]">
                      Traditional Warehousing Costs
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Storage Cost ({traditionalStorageDays} days)</span>
                          <span>{formatCurrency(Math.max(inboundTrucks.reduce((s, t) => s + t.pallets, 0), outboundTrucks.reduce((s, t) => s + t.pallets, 0)) * (storageRegion === "Custom" ? customStorageCost : storageCosts.find(r => r.region === storageRegion)?.cost || 0.85) * traditionalStorageDays, currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Additional Handling</span>
                          <span>{formatCurrency(Math.max(inboundTrucks.reduce((s, t) => s + t.pallets, 0), outboundTrucks.reduce((s, t) => s + t.pallets, 0)) * 0.5 * (laborRegion === "Custom" ? customLaborRate : laborRates.find(r => r.region === laborRegion)?.rate || 25), currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Facility Overhead</span>
                          <span>{formatCurrency(facilityOverheadRate * traditionalStorageDays, currency)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{formatCurrency(result.traditionalCost, currency)}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Side-by-Side Comparison</CardTitle>
              <CardDescription>Key metrics comparison between cross-docking and traditional warehousing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Metric</TableHead>
                    <TableHead className="text-right text-[var(--logistics)]">Cross-Docking</TableHead>
                    <TableHead className="text-right text-[var(--ocean)]">Traditional</TableHead>
                    <TableHead className="text-right">Difference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Total Cost</TableCell>
                    <TableCell className="text-right">{formatCurrency(result.crossDockCost, currency)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(result.traditionalCost, currency)}</TableCell>
                    <TableCell className="text-right text-green-600">-{formatCurrency(result.costSavings, currency)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Processing Time</TableCell>
                    <TableCell className="text-right">{result.totalProcessingTime} hours</TableCell>
                    <TableCell className="text-right">{traditionalStorageDays * 24} hours</TableCell>
                    <TableCell className="text-right text-green-600">-{traditionalStorageDays * 24 - result.totalProcessingTime} hours</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Labor Hours</TableCell>
                    <TableCell className="text-right">{result.laborHours}</TableCell>
                    <TableCell className="text-right">{(result.laborHours * 1.5).toFixed(1)}</TableCell>
                    <TableCell className="text-right text-green-600">-{(result.laborHours * 0.5).toFixed(1)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Truck Turnaround</TableCell>
                    <TableCell className="text-right">{result.avgTruckTurnaround} hours</TableCell>
                    <TableCell className="text-right">{(result.avgTruckTurnaround * 2).toFixed(1)} hours</TableCell>
                    <TableCell className="text-right text-green-600">-{result.avgTruckTurnaround.toFixed(1)} hours</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Inventory Holding</TableCell>
                    <TableCell className="text-right">&lt; 24 hours</TableCell>
                    <TableCell className="text-right">{traditionalStorageDays} days</TableCell>
                    <TableCell className="text-right text-green-600">Significant reduction</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                What is Cross-Docking?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Cross-docking is a logistics strategy where incoming goods are directly transferred from inbound transportation to outbound vehicles with minimal or no storage time in between. Unlike traditional warehousing where products are stored for extended periods before distribution, cross-docking eliminates the storage phase entirely or reduces it to less than 24 hours. This approach streamlines the supply chain by reducing handling steps, minimizing storage costs, and accelerating order fulfillment. The process typically involves receiving goods at a distribution center, sorting them by destination, and immediately loading them onto outbound trucks—all within a matter of hours. Cross-docking is particularly valuable for time-sensitive products, high-demand items with predictable sales patterns, and businesses looking to optimize their supply chain efficiency. By eliminating unnecessary storage time, companies can reduce inventory carrying costs, improve cash flow, and deliver products to customers faster.
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-[var(--logistics)]" />
                  Benefits of Cross-Docking
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Cross-docking offers numerous operational and financial benefits for businesses seeking to optimize their logistics operations. The primary advantage is significant cost reduction: by eliminating or minimizing storage time, companies can reduce warehouse space requirements by up to 50%, lower labor costs through reduced handling, and decrease inventory carrying costs that typically amount to 15-25% of inventory value annually. Speed is another major benefit—products move through the supply chain faster, reducing order-to-delivery times and improving customer satisfaction. Cross-docking also reduces product damage and loss by minimizing handling touches, as each additional touch increases the risk of damage. The strategy improves cash flow by reducing tied-up capital in inventory, and enhances supply chain visibility as goods move predictably through designated channels. Additionally, cross-docking supports sustainability goals by reducing energy consumption associated with long-term storage and enabling better truck utilization, which reduces transportation emissions per unit shipped.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Challenges of Cross-Docking
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  While cross-docking offers significant benefits, it also presents challenges that require careful planning and management to overcome. The most significant challenge is the need for precise coordination between suppliers, transportation providers, and receiving facilities—any delay in inbound shipments can disrupt the entire operation. This requires robust information systems and reliable partners throughout the supply chain. Cross-docking also reduces the safety stock buffer that traditional warehousing provides, making operations more vulnerable to supply chain disruptions such as weather events, transportation strikes, or supplier issues. The strategy requires substantial upfront investment in technology, including warehouse management systems, real-time tracking, and communication infrastructure. Labor management becomes more complex as workers must be highly trained and flexible to handle rapidly changing priorities. Cross-docking is also less suitable for products requiring quality inspection, repackaging, or assembly, as these activities add processing time that conflicts with the rapid throughput model. Finally, seasonal demand fluctuations can make it difficult to maintain consistent operations and may require hybrid approaches.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                When to Use Cross-Docking
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Cross-docking is most effective in specific scenarios where its benefits outweigh the operational complexity and investment required. The ideal candidates for cross-docking are products with high turnover rates and predictable demand patterns—fast-moving consumer goods, perishable items like fresh produce and dairy, and popular retail merchandise that doesn't require additional processing. Time-sensitive products such as newspapers, magazines, and promotional materials benefit enormously from reduced transit times. Manufacturing operations using just-in-time delivery can leverage cross-docking to receive components exactly when needed, reducing on-site inventory. Products that are pre-tagged, pre-packaged, and ready for retail distribution are excellent candidates, as they require no additional handling before shipment. Cross-docking also works well for consolidation operations where goods from multiple suppliers are combined for shipment to a single destination. However, it's less suitable for slow-moving products with unpredictable demand, items requiring quality inspection or repackaging, and situations where supply chain reliability is uncertain. The decision should be based on a thorough analysis of your product characteristics, demand patterns, and supply chain capabilities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[var(--logistics)]" />
                Implementation Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Successfully implementing cross-docking requires a systematic approach that addresses technology, processes, and people. Start by conducting a thorough analysis of your product portfolio to identify items suitable for cross-docking based on volume, demand predictability, and handling requirements. Invest in robust technology infrastructure including a warehouse management system (WMS) with real-time visibility, transportation management system (TMS) for scheduling, and communication platforms for coordinating with suppliers and carriers. Establish strong partnerships with reliable suppliers who can provide accurate advance shipping notices (ASNs) and meet delivery windows consistently. Design your facility layout specifically for cross-docking with adequate dock doors, clear staging areas, and efficient material flow paths. Cross-train your workforce to handle both loading and unloading tasks, enabling flexible labor allocation based on real-time demands. Implement standardized processes and key performance indicators (KPIs) to monitor operations and identify improvement opportunities. Start with a pilot program on a limited product range before scaling up, and maintain contingency plans for supply chain disruptions. Regular communication with all stakeholders—suppliers, carriers, and internal teams—is essential for coordinating the precise timing that cross-docking requires.
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips for Cross-Docking Success
              </CardTitle>
              <CardDescription>Expert recommendations to maximize your cross-docking efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proTips.map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex items-start gap-3">
                      <tip.icon className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from common pitfalls in cross-docking implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <motion.div
                    key={mistake.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20 rounded-r-lg"
                  >
                    <h4 className="font-medium text-sm mb-1">{mistake.title}</h4>
                    <p className="text-xs text-muted-foreground">{mistake.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Comprehensive answers to common questions about cross-docking</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium hover:text-[var(--ocean)]">
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

      {/* Export Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={handleShare}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
