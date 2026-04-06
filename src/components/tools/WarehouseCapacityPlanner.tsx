"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Warehouse,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  Calculator,
  Clock,
  DollarSign,
  Target,
  Layers,
  PieChart,
  RefreshCw,
  Zap,
  Database,
  LineChart,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Gauge,
  BoxSelect,
  Calendar,
  Move3D,
  Layers3,
  Grid3X3,
  Download,
  Share2,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Settings,
  ChevronRight,
  X,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  ComposedChart,
  Area,
  ReferenceLine,
  AreaChart,
} from "recharts";

// Brand Colors
const BRAND_COLORS = {
  oceanBlue: "#0F4C81",
  logisticsGreen: "#2E8B57",
  oceanBlueLight: "#3D6A9F",
  greenLight: "#4CAF50",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

// Interfaces
interface InventoryLevel {
  sku: string;
  name: string;
  currentStock: number;
  capacity: number;
  utilization: number;
  velocity: "high" | "medium" | "low";
  trend: number;
  category: string;
}

interface StorageZone {
  id: string;
  name: string;
  type: string;
  totalCapacity: number;
  usedCapacity: number;
  utilization: number;
  items: number;
  avgVelocity: number;
}

interface SKUVelocity {
  sku: string;
  name: string;
  velocity: number;
  velocityTrend: number;
  category: "A" | "B" | "C";
  daysOfStock: number;
  reorderPoint: number;
}

interface PeakSeasonData {
  month: string;
  demand: number;
  capacity: number;
  utilization: number;
  isPeak: boolean;
}

// Sample data
const sampleInventoryLevels: InventoryLevel[] = [
  { sku: "SKU-001", name: "Electronics - Category A", currentStock: 4500, capacity: 5000, utilization: 90, velocity: "high", trend: 12, category: "Electronics" },
  { sku: "SKU-002", name: "Apparel - Seasonal", currentStock: 2800, capacity: 4000, utilization: 70, velocity: "medium", trend: -5, category: "Apparel" },
  { sku: "SKU-003", name: "Home Goods - Fast", currentStock: 3200, capacity: 3500, utilization: 91.4, velocity: "high", trend: 8, category: "Home" },
  { sku: "SKU-004", name: "Sporting Goods", currentStock: 1500, capacity: 3000, utilization: 50, velocity: "low", trend: 3, category: "Sports" },
  { sku: "SKU-005", name: "Auto Parts", currentStock: 2200, capacity: 2500, utilization: 88, velocity: "medium", trend: 15, category: "Auto" },
  { sku: "SKU-006", name: "Industrial Equipment", currentStock: 800, capacity: 2000, utilization: 40, velocity: "low", trend: -2, category: "Industrial" },
  { sku: "SKU-007", name: "Consumer Electronics", currentStock: 3800, capacity: 4000, utilization: 95, velocity: "high", trend: 20, category: "Electronics" },
  { sku: "SKU-008", name: "Health & Beauty", currentStock: 1900, capacity: 2500, utilization: 76, velocity: "medium", trend: 7, category: "Health" },
];

const sampleStorageZones: StorageZone[] = [
  { id: "zone-a", name: "Zone A - High Velocity", type: "Picking", totalCapacity: 15000, usedCapacity: 14200, utilization: 94.7, items: 450, avgVelocity: 320 },
  { id: "zone-b", name: "Zone B - Medium Velocity", type: "Picking", totalCapacity: 25000, usedCapacity: 20500, utilization: 82, items: 1200, avgVelocity: 150 },
  { id: "zone-c", name: "Zone C - Low Velocity", type: "Reserve", totalCapacity: 35000, usedCapacity: 28000, utilization: 80, items: 2500, avgVelocity: 45 },
  { id: "zone-d", name: "Cold Storage", type: "Temperature", totalCapacity: 8000, usedCapacity: 7200, utilization: 90, items: 320, avgVelocity: 180 },
  { id: "zone-e", name: "Bulk Storage", type: "Reserve", totalCapacity: 50000, usedCapacity: 35000, utilization: 70, items: 800, avgVelocity: 25 },
  { id: "zone-f", name: "Cross-Dock Area", type: "Flow-Through", totalCapacity: 5000, usedCapacity: 4500, utilization: 90, items: 180, avgVelocity: 500 },
];

const samplePeakSeasonData: PeakSeasonData[] = [
  { month: "Jan", demand: 8500, capacity: 12000, utilization: 70.8, isPeak: false },
  { month: "Feb", demand: 9000, capacity: 12000, utilization: 75, isPeak: false },
  { month: "Mar", demand: 10000, capacity: 12000, utilization: 83.3, isPeak: false },
  { month: "Apr", demand: 11000, capacity: 12000, utilization: 91.7, isPeak: false },
  { month: "May", demand: 9500, capacity: 12000, utilization: 79.2, isPeak: false },
  { month: "Jun", demand: 10500, capacity: 12000, utilization: 87.5, isPeak: false },
  { month: "Jul", demand: 11500, capacity: 12000, utilization: 95.8, isPeak: true },
  { month: "Aug", demand: 12500, capacity: 12000, utilization: 104.2, isPeak: true },
  { month: "Sep", demand: 11800, capacity: 12000, utilization: 98.3, isPeak: true },
  { month: "Oct", demand: 10000, capacity: 12000, utilization: 83.3, isPeak: false },
  { month: "Nov", demand: 14000, capacity: 12000, utilization: 116.7, isPeak: true },
  { month: "Dec", demand: 15000, capacity: 12000, utilization: 125, isPeak: true },
];

// Pro Tips Data
const proTips = [
  {
    icon: Target,
    title: "Implement ABC Classification",
    description: "Organize inventory by velocity - place A-class items near shipping areas for faster picking. This simple reorganization can improve picking efficiency by 20-30% and reduce travel time significantly.",
  },
  {
    icon: Layers3,
    title: "Maximize Vertical Space",
    description: "Install mezzanine floors or high-bay racking to utilize vertical storage potential. Many warehouses use only 40-50% of their vertical capacity. A well-designed mezzanine can add 30-50% more storage space without expanding your footprint.",
  },
  {
    icon: Zap,
    title: "Use Dynamic Slotting",
    description: "Regularly analyze SKU velocity and adjust slot locations seasonally. Fast-moving items should be at waist height in prime pick zones. This dynamic approach can reduce pick times by 15-25% during peak seasons.",
  },
  {
    icon: Calendar,
    title: "Plan for Peak Seasons",
    description: "Start capacity planning 3-4 months before peak seasons. Pre-negotiate overflow warehouse space and temporary labor. Having contingency plans ready prevents last-minute capacity crunches and premium costs.",
  },
  {
    icon: Gauge,
    title: "Monitor Utilization Metrics",
    description: "Keep warehouse utilization between 75-85% for optimal operations. Below 70% wastes resources; above 90% creates bottlenecks. Install real-time monitoring systems to track space utilization across zones.",
  },
  {
    icon: RefreshCw,
    title: "Implement Cross-Docking",
    description: "For high-velocity items, implement cross-docking to bypass storage entirely. Products move directly from receiving to shipping, reducing handling costs by up to 40% and freeing valuable warehouse space.",
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    title: "Ignoring Vertical Storage Potential",
    description: "Many warehouses focus on floor space while neglecting vertical capacity. A standard warehouse with 30-foot ceilings might only utilize 15-18 feet effectively. Installing taller racking systems or mezzanine floors can dramatically increase storage density without additional real estate costs. Calculate your cubic utilization, not just square footage.",
    severity: "high",
  },
  {
    title: "Poor SKU Slotting Strategy",
    description: "Placing slow-moving items in prime picking locations wastes time and labor. Without regular slotting reviews, warehouses accumulate inefficiencies. Implement velocity-based slotting and review it quarterly. Fast-moving A-items belong near shipping areas; C-items can go to remote locations. Poor slotting can add 10-15% to labor costs.",
    severity: "high",
  },
  {
    title: "Underestimating Peak Season Needs",
    description: "Many operations wait until peak season hits before addressing capacity constraints. This reactive approach leads to premium rates for temporary space, rushed hiring, and operational chaos. Start planning 4-6 months ahead: analyze historical trends, pre-book overflow facilities, and train temporary staff before the rush.",
    severity: "medium",
  },
  {
    title: "Neglecting Aisle Width Optimization",
    description: "Standard wide aisles (12-14 feet) consume valuable space that could be used for storage. Consider narrow-aisle (8-10 feet) or very narrow aisle (6-8 feet) configurations with appropriate forklifts. Converting to narrow aisles can increase storage capacity by 15-25% in the same footprint.",
    severity: "medium",
  },
  {
    title: "Overlooking Cross-Docking Opportunities",
    description: "Storing every item that enters the warehouse is inefficient. Cross-docking high-velocity items directly from receiving to shipping bypasses storage entirely, reducing handling costs by 30-40% and freeing capacity for items that need storage. Identify candidates for cross-docking based on velocity and demand predictability.",
    severity: "low",
  },
];

// FAQ Data
const faqData = [
  {
    question: "What is warehouse capacity planning and why is it critical for logistics operations?",
    answer: "Warehouse capacity planning is the strategic process of analyzing, forecasting, and optimizing the storage space and throughput capabilities of a warehouse facility. It involves evaluating current utilization rates, projecting future storage needs based on business growth and seasonal variations, and implementing strategies to maximize space efficiency. Effective capacity planning is critical because it directly impacts operational costs, customer service levels, and overall supply chain efficiency. Without proper planning, warehouses face either underutilization (wasting resources and increasing per-unit costs) or overutilization (creating bottlenecks, delays, and potential service failures). A well-planned warehouse operates at 75-85% utilization, leaving adequate buffer for seasonal peaks and operational flexibility. This planning encompasses not just floor space, but also vertical storage potential, aisle configurations, receiving and shipping dock capacity, and throughput velocity.",
  },
  {
    question: "How do I calculate optimal warehouse utilization rate?",
    answer: "Calculating optimal warehouse utilization requires analyzing multiple factors beyond simple square footage. The basic formula divides used space by total available space, but sophisticated planning considers cubic utilization (volume), slot occupancy, and throughput capacity. Start by measuring your total warehouse footprint, then subtract non-storage areas (offices, restrooms, break rooms, battery charging stations). Calculate usable storage space at 85-90% of the remaining area, accounting for necessary aisles and staging areas. The optimal utilization target of 75-85% accounts for several operational needs: space for receiving and quality inspection, staging areas for outbound orders, buffer zones for seasonal fluctuations, and room for equipment maneuvering. Monitor utilization by zone rather than aggregate, as different areas have different optimal rates. Picking zones operate best at 70-80% to maintain picking speed, while reserve storage can safely reach 90%.",
  },
  {
    question: "What are the most effective strategies for increasing warehouse capacity without expansion?",
    answer: "Several proven strategies can significantly increase capacity without physical expansion. First, maximize vertical space through high-bay racking, mezzanine floors, or multi-tier shelving systems - many warehouses utilize only 40-50% of their vertical potential. Second, optimize aisle widths by converting from standard (12-14 feet) to narrow (8-10 feet) or very narrow (6-8 feet) aisle configurations with appropriate equipment, potentially gaining 15-25% more storage positions. Third, implement slotting optimization to ensure products are stored in appropriately sized locations, eliminating wasted space from oversized slots holding undersized products. Fourth, reduce inventory through better demand forecasting, reduced safety stock, and vendor-managed inventory programs. Fifth, increase throughput velocity through cross-docking and flow-through operations that bypass storage entirely. Sixth, implement automated storage and retrieval systems (AS/RS) that can increase storage density by 200-300% compared to conventional racking. Combining these strategies often yields 30-50% capacity improvements.",
  },
  {
    question: "How should I prepare my warehouse for peak season capacity demands?",
    answer: "Peak season preparation should begin 4-6 months before the anticipated surge. Start by analyzing historical data to forecast demand patterns, identifying which products and zones will experience the greatest increases. Review your current capacity utilization and calculate how much additional space will be needed. Consider temporary solutions like overflow warehouses, mobile racking systems, or outdoor storage for weather-resistant items. Pre-negotiate contracts with 3PL providers for emergency overflow capacity. Increase labor capacity by hiring and training temporary staff early, before the market competition for warehouse workers intensifies. Optimize current operations by purging obsolete inventory, consolidating partial pallets, and implementing more aggressive cross-docking. Review and potentially extend operating hours, adding shifts to spread the workload. Ensure your WMS and inventory management systems can handle increased transaction volumes. Finally, establish daily capacity monitoring during peak season to identify issues early and respond quickly.",
  },
  {
    question: "What role does warehouse management system (WMS) technology play in capacity optimization?",
    answer: "A robust WMS is essential for maximizing warehouse capacity and provides several key optimization capabilities. Real-time inventory tracking enables accurate visibility of what's stored where, eliminating the phantom inventory that wastes valuable space. Advanced slotting algorithms analyze product velocity and dimensions to suggest optimal storage locations, continuously optimizing space utilization. Cubing functionality ensures products are stored in appropriately sized locations, preventing oversized slots from holding small items. The system can manage and optimize multi-zone storage strategies, automatically directing put-away to maximize space efficiency while maintaining picking productivity. WMS reporting provides utilization analytics by zone, aisle, and storage type, highlighting areas of under or over-utilization. Integration with labor management systems helps balance workload across available resources. Modern WMS platforms also support 3D visualization of warehouse space, scenario planning for capacity changes, and predictive analytics for future space requirements. Without this technology, capacity optimization becomes a manual, reactive process that cannot keep pace with dynamic warehouse operations.",
  },
  {
    question: "How do I determine when to expand versus optimize existing warehouse space?",
    answer: "The decision between expansion and optimization requires a thorough cost-benefit analysis. First, assess your current utilization rate - if you're below 85%, optimization should be your priority. Calculate the cost per square foot of your current operations and compare it to optimization investments (mezzanines, AS/RS, narrow aisles) versus expansion costs (new facility construction, lease rates, operational duplication). Consider the timeline: optimization projects typically take 2-6 months, while new facility acquisition and setup can take 12-24 months. Evaluate your growth trajectory - temporary or seasonal capacity needs may be better served through optimization or 3PL partnerships, while sustained long-term growth might justify expansion. Factor in operational complexity: multiple facilities add logistics challenges, staffing requirements, and management overhead that optimization avoids. Consider asset utilization - can you justify the capital investment in a new facility based on projected returns? Finally, assess your current location's value - is your warehouse strategically positioned relative to customers and suppliers? Sometimes expansion at a suboptimal location is less valuable than optimization at the current site.",
  },
  {
    question: "What is the impact of e-commerce growth on warehouse capacity planning?",
    answer: "E-commerce has fundamentally transformed warehouse capacity planning requirements. The shift from bulk distribution to direct-to-consumer fulfillment has created demand for more picking locations, larger pack stations, and increased returns processing areas. Order profiles have changed dramatically - instead of pallets or cases moving to retail stores, warehouses now handle individual items shipping to thousands of addresses daily. This increases the number of SKUs active in the picking zone, requiring more forward pick locations. E-commerce fulfillment centers typically need 15-25% more staging area for outbound orders compared to traditional distribution. Returns processing requires dedicated space that traditional warehouses never needed. The velocity variation is more extreme - e-commerce creates more seasonal peaks (Black Friday, Cyber Monday, holiday shopping) that can be 3-5x normal volumes. Customer expectations for same-day and next-day delivery require inventory positioning closer to population centers, often necessitating smaller urban warehouses rather than large regional DCs. These factors have made capacity planning more complex and dynamic, requiring more sophisticated forecasting, flexible storage solutions, and real-time visibility systems.",
  },
  {
    question: "How do different storage systems affect warehouse capacity and which should I choose?",
    answer: "Storage system selection significantly impacts capacity and operational efficiency. Selective pallet racking offers 100% selectivity but lowest density, utilizing only 30-40% of floor space. Drive-in/drive-through racking increases density to 60-70% by eliminating aisles but reduces selectivity and is best for homogeneous inventory. Push-back racking provides good density (50-60% utilization) with decent selectivity, ideal for LIFO inventory management. Pallet flow racking offers high density (65-75%) with FIFO capability, perfect for perishable or time-sensitive goods. Mobile racking systems can achieve 80% floor utilization by eliminating fixed aisles, moving racks on demand. Automated Storage and Retrieval Systems (AS/RS) provide the highest density (up to 85% utilization) with perfect selectivity but require significant capital investment. Cantilever racking suits long or irregular items but sacrifices density for accessibility. The optimal choice depends on your product characteristics, inventory turnover, throughput requirements, budget, and growth plans. Many warehouses implement hybrid solutions, using different systems in different zones based on SKU velocity and product attributes.",
  },
];

export default function WarehouseCapacityPlanner() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Input states
  const [totalWarehouseSize, setTotalWarehouseSize] = useState("150000");
  const [totalSKUs, setTotalSKUs] = useState("5500");
  const [averageOrderSize, setAverageOrderSize] = useState("12");
  const [dailyOrders, setDailyOrders] = useState("850");
  const [growthRate, setGrowthRate] = useState("15");
  const [peakSeasonMultiplier, setPeakSeasonMultiplier] = useState("1.4");
  const [storageCostPerSqFt, setStorageCostPerSqFt] = useState("8.50");
  const [laborCostPerHour, setLaborCostPerHour] = useState("22");
  const [operatingHours, setOperatingHours] = useState("16");

  // Computed values
  const capacityMetrics = useMemo(() => {
    const sqft = parseFloat(totalWarehouseSize) || 150000;
    const skus = parseFloat(totalSKUs) || 5500;
    const orders = parseFloat(dailyOrders) || 850;
    const growth = parseFloat(growthRate) || 15;
    const peak = parseFloat(peakSeasonMultiplier) || 1.4;
    const storageCost = parseFloat(storageCostPerSqFt) || 8.50;
    const laborCost = parseFloat(laborCostPerHour) || 22;
    const hours = parseFloat(operatingHours) || 16;

    // Current utilization
    const totalUsed = sampleStorageZones.reduce((sum, z) => sum + z.usedCapacity, 0);
    const totalCapacity = sampleStorageZones.reduce((sum, z) => sum + z.totalCapacity, 0);
    const currentUtilization = (totalUsed / totalCapacity) * 100;

    // Space utilization
    const usableSpace = sqft * 0.85; // 85% usable
    const storageDensity = totalUsed / usableSpace;

    // Throughput calculations
    const dailyThroughput = orders * parseFloat(averageOrderSize);
    const hourlyThroughput = dailyThroughput / hours;
    const peakDailyThroughput = dailyThroughput * peak;

    // Growth projections
    const nextYearCapacity = currentUtilization * (1 + growth / 100);
    const capacityGap = Math.max(0, nextYearCapacity - 100);

    // Cost calculations
    const monthlyStorageCost = sqft * storageCost / 12;
    const monthlyLaborCost = laborCost * hours * 30 * 15; // 15 workers avg
    const totalMonthlyCost = monthlyStorageCost + monthlyLaborCost;

    return {
      currentUtilization,
      totalUsed,
      totalCapacity,
      usableSpace,
      storageDensity,
      dailyThroughput,
      hourlyThroughput,
      peakDailyThroughput,
      nextYearCapacity,
      capacityGap,
      monthlyStorageCost,
      monthlyLaborCost,
      totalMonthlyCost,
      sqft,
      skus,
      orders,
      growth,
      peak,
    };
  }, [totalWarehouseSize, totalSKUs, averageOrderSize, dailyOrders, growthRate, peakSeasonMultiplier, storageCostPerSqFt, laborCostPerHour, operatingHours]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(Math.round(num));
  };

  // Chart data preparations
  const utilizationPieData = [
    { name: "Used Capacity", value: capacityMetrics.currentUtilization, color: BRAND_COLORS.oceanBlue },
    { name: "Available Capacity", value: Math.max(0, 100 - capacityMetrics.currentUtilization), color: "#E5E7EB" },
  ];

  const areaCapacityData = sampleStorageZones.map(zone => ({
    name: zone.name.split(" - ")[0],
    totalCapacity: zone.totalCapacity,
    usedCapacity: zone.usedCapacity,
    utilization: zone.utilization,
  }));

  const seasonalCapacityData = samplePeakSeasonData.map(d => ({
    month: d.month,
    demand: d.demand,
    capacity: d.capacity,
    utilization: d.utilization,
  }));

  // Export functionality
  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      inputs: {
        totalWarehouseSize,
        totalSKUs,
        averageOrderSize,
        dailyOrders,
        growthRate,
        peakSeasonMultiplier,
        storageCostPerSqFt,
        laborCostPerHour,
        operatingHours,
      },
      metrics: capacityMetrics,
      storageZones: sampleStorageZones,
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `warehouse-capacity-analysis-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share functionality
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareData = JSON.stringify({
    inputs: {
      totalWarehouseSize,
      totalSKUs,
      dailyOrders,
      growthRate,
    },
    metrics: {
      utilization: capacityMetrics.currentUtilization.toFixed(1),
      throughput: capacityMetrics.dailyThroughput,
    },
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Reset functionality
  const resetForm = () => {
    setTotalWarehouseSize("150000");
    setTotalSKUs("5500");
    setAverageOrderSize("12");
    setDailyOrders("850");
    setGrowthRate("15");
    setPeakSeasonMultiplier("1.4");
    setStorageCostPerSqFt("8.50");
    setLaborCostPerHour("22");
    setOperatingHours("16");
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8 border border-border/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {["Warehouse Management", "Capacity Planning", "Storage Optimization"].map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-sm px-3 py-1 animate-pulse"
                    style={{
                      backgroundColor: index === 0 ? `${BRAND_COLORS.oceanBlue}20` :
                                      index === 1 ? `${BRAND_COLORS.logisticsGreen}20` :
                                      `${BRAND_COLORS.warning}20`,
                      color: index === 0 ? BRAND_COLORS.oceanBlue :
                            index === 1 ? BRAND_COLORS.logisticsGreen :
                            BRAND_COLORS.warning,
                    }}
                  >
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3" style={{ color: BRAND_COLORS.oceanBlue }}>
                <Warehouse className="h-8 w-8" />
                Warehouse Capacity Planner
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Comprehensive warehouse capacity analysis, planning, and optimization tool. Analyze storage utilization,
                plan for peak seasons, and optimize your warehouse space for maximum efficiency.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={exportResults} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              style={{ backgroundColor: BRAND_COLORS.logisticsGreen }}
              className="text-white flex items-center gap-2"
              onClick={() => setShowShareModal(true)}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs - 5 Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 gap-1 h-auto">
          <TabsTrigger value="calculator" className="text-xs md:text-sm py-2">
            <Calculator className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs md:text-sm py-2">
            <BarChart3 className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="text-xs md:text-sm py-2">
            <Zap className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="text-xs md:text-sm py-2">
            <BookOpen className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-xs md:text-sm py-2">
            <HelpCircle className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Gauge className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Capacity</span>
                </div>
                <p className="text-3xl font-bold">{capacityMetrics.currentUtilization.toFixed(1)}%</p>
                <p className="text-sm opacity-80 mt-1">Current Utilization</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Throughput</span>
                </div>
                <p className="text-3xl font-bold">{formatNumber(capacityMetrics.dailyThroughput)}</p>
                <p className="text-sm opacity-80 mt-1">Units/Day</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Growth</span>
                </div>
                <p className="text-3xl font-bold">{growthRate}%</p>
                <p className="text-sm opacity-80 mt-1">Annual Growth Rate</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Costs</span>
                </div>
                <p className="text-3xl font-bold">{formatCurrency(capacityMetrics.totalMonthlyCost)}</p>
                <p className="text-sm opacity-80 mt-1">Monthly Operating</p>
              </CardContent>
            </Card>
          </div>

          {/* Configuration Card */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2" style={{ color: BRAND_COLORS.oceanBlue }}>
                <Settings className="h-5 w-5" />
                Warehouse Parameters
              </CardTitle>
              <CardDescription>Configure your warehouse parameters for accurate capacity analysis</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="warehouseSize" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                    Total Warehouse Size (sq ft)
                  </Label>
                  <Input
                    id="warehouseSize"
                    type="number"
                    value={totalWarehouseSize}
                    onChange={(e) => setTotalWarehouseSize(e.target.value)}
                    placeholder="150,000"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalSKUs" className="flex items-center gap-2">
                    <Package className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                    Total SKUs
                  </Label>
                  <Input
                    id="totalSKUs"
                    type="number"
                    value={totalSKUs}
                    onChange={(e) => setTotalSKUs(e.target.value)}
                    placeholder="5,500"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dailyOrders" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                    Daily Orders
                  </Label>
                  <Input
                    id="dailyOrders"
                    type="number"
                    value={dailyOrders}
                    onChange={(e) => setDailyOrders(e.target.value)}
                    placeholder="850"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="growthRate" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" style={{ color: BRAND_COLORS.logisticsGreen }} />
                    Annual Growth Rate (%)
                  </Label>
                  <Input
                    id="growthRate"
                    type="number"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(e.target.value)}
                    placeholder="15"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="peakMultiplier">Peak Season Multiplier</Label>
                  <Input
                    id="peakMultiplier"
                    type="number"
                    step="0.1"
                    value={peakSeasonMultiplier}
                    onChange={(e) => setPeakSeasonMultiplier(e.target.value)}
                    placeholder="1.4"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storageCost">Storage Cost ($/sq ft/year)</Label>
                  <Input
                    id="storageCost"
                    type="number"
                    step="0.01"
                    value={storageCostPerSqFt}
                    onChange={(e) => setStorageCostPerSqFt(e.target.value)}
                    placeholder="8.50"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="laborCost">Labor Cost ($/hour)</Label>
                  <Input
                    id="laborCost"
                    type="number"
                    value={laborCostPerHour}
                    onChange={(e) => setLaborCostPerHour(e.target.value)}
                    placeholder="22"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operatingHours">Operating Hours/Day</Label>
                  <Input
                    id="operatingHours"
                    type="number"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="16"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Zones Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Storage Zones Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleStorageZones.map((zone, index) => (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{zone.name.split(" - ")[0]}</span>
                      <Badge
                        style={{
                          backgroundColor: zone.utilization > 90 ? BRAND_COLORS.danger :
                                         zone.utilization > 80 ? BRAND_COLORS.warning :
                                         BRAND_COLORS.logisticsGreen
                        }}
                        className="text-white text-xs"
                      >
                        {zone.utilization.toFixed(0)}%
                      </Badge>
                    </div>
                    <Progress value={zone.utilization} className="h-2" />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>{formatNumber(zone.usedCapacity)} ft³ used</span>
                      <span>{zone.items} items</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Capacity Alert */}
          {capacityMetrics.currentUtilization > 85 && (
            <Card className="border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800 dark:text-amber-200">
                      High Utilization Warning
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Your warehouse is operating at {capacityMetrics.currentUtilization.toFixed(1)}% capacity.
                      Consider expansion options or optimization strategies to avoid operational bottlenecks.
                      Based on your {growthRate}% growth rate, you may face capacity constraints within the next year.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Utilization Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                  Storage Utilization Breakdown
                </CardTitle>
                <CardDescription>Overall warehouse capacity distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={utilizationPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      >
                        {utilizationPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <p className="text-4xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {capacityMetrics.currentUtilization.toFixed(1)}%
                  </p>
                  <p className="text-muted-foreground">Overall Utilization</p>
                </div>
              </CardContent>
            </Card>

            {/* Area-wise Capacity Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                  Area-wise Capacity Analysis
                </CardTitle>
                <CardDescription>Storage capacity by zone</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={areaCapacityData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" unit=" ft³" />
                      <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value) => [formatNumber(value as number), ""]} />
                      <Legend />
                      <Bar dataKey="totalCapacity" name="Total Capacity" fill={BRAND_COLORS.oceanBlue} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="usedCapacity" name="Used Capacity" fill={BRAND_COLORS.logisticsGreen} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seasonal Capacity Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Seasonal Capacity Planning
              </CardTitle>
              <CardDescription>Monthly demand vs capacity forecast with utilization trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={seasonalCapacityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <ReferenceLine y={12000} stroke={BRAND_COLORS.danger} strokeDasharray="5 5" label="Max Capacity" />
                    <Area
                      type="monotone"
                      dataKey="capacity"
                      name="Available Capacity"
                      stroke={BRAND_COLORS.oceanBlue}
                      fill={BRAND_COLORS.oceanBlue}
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="demand"
                      name="Demand Forecast"
                      stroke={BRAND_COLORS.logisticsGreen}
                      fill={BRAND_COLORS.logisticsGreen}
                      fillOpacity={0.4}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND_COLORS.logisticsGreen }}></div>
                  <span className="text-sm">Demand Forecast</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND_COLORS.oceanBlue }}></div>
                  <span className="text-sm">Available Capacity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BRAND_COLORS.danger }}></div>
                  <span className="text-sm">Capacity Limit</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Capacity Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                    {formatNumber(parseFloat(totalWarehouseSize))}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Sq Ft</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>
                    {formatNumber(capacityMetrics.totalCapacity)}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Capacity (ft³)</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.warning }}>
                    {totalSKUs}
                  </p>
                  <p className="text-xs text-muted-foreground">Active SKUs</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.purple }}>
                    {dailyOrders}
                  </p>
                  <p className="text-xs text-muted-foreground">Daily Orders</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.cyan }}>
                    {capacityMetrics.hourlyThroughput.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">Units/Hour</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.danger }}>
                    {capacityMetrics.capacityGap.toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">Capacity Gap</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zone Utilization Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zone Utilization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Zone</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-right py-3 px-4">Total Capacity</th>
                      <th className="text-right py-3 px-4">Used</th>
                      <th className="text-right py-3 px-4">Utilization</th>
                      <th className="text-center py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleStorageZones.map((zone) => (
                      <tr key={zone.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{zone.name}</td>
                        <td className="py-3 px-4">{zone.type}</td>
                        <td className="py-3 px-4 text-right">{formatNumber(zone.totalCapacity)} ft³</td>
                        <td className="py-3 px-4 text-right">{formatNumber(zone.usedCapacity)} ft³</td>
                        <td className="py-3 px-4 text-right">
                          <span style={{
                            color: zone.utilization > 90 ? BRAND_COLORS.danger :
                                   zone.utilization > 80 ? BRAND_COLORS.warning :
                                   BRAND_COLORS.logisticsGreen
                          }}>
                            {zone.utilization.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            style={{
                              backgroundColor: zone.utilization > 90 ? BRAND_COLORS.danger :
                                             zone.utilization > 80 ? BRAND_COLORS.warning :
                                             BRAND_COLORS.logisticsGreen
                            }}
                            className="text-white text-xs"
                          >
                            {zone.utilization > 90 ? "Critical" :
                             zone.utilization > 80 ? "High" : "Normal"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Optimization */}
        <TabsContent value="optimization" className="space-y-6 mt-6">
          {/* Optimization Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Potential</span>
                </div>
                <p className="text-3xl font-bold">+35%</p>
                <p className="text-sm opacity-80 mt-1">Capacity Increase Possible</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Savings</span>
                </div>
                <p className="text-3xl font-bold">$125K</p>
                <p className="text-sm opacity-80 mt-1">Potential Annual Savings</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="h-8 w-8 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Efficiency</span>
                </div>
                <p className="text-3xl font-bold">+25%</p>
                <p className="text-sm opacity-80 mt-1">Productivity Improvement</p>
              </CardContent>
            </Card>
          </div>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                Pro Tips & Best Practices
              </CardTitle>
              <CardDescription>Actionable strategies to optimize your warehouse capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proTips.map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-border/50"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${BRAND_COLORS.logisticsGreen}20` }}
                      >
                        <tip.icon className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
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
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" style={{ color: BRAND_COLORS.danger }} />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from common warehouse capacity planning pitfalls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <motion.div
                    key={mistake.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-l-4 ${
                      mistake.severity === "high" ? "bg-red-50 dark:bg-red-900/20 border-red-500" :
                      mistake.severity === "medium" ? "bg-amber-50 dark:bg-amber-900/20 border-amber-500" :
                      "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 flex-shrink-0 ${
                          mistake.severity === "high" ? "text-red-600" :
                          mistake.severity === "medium" ? "text-amber-600" :
                          "text-blue-600"
                        }`}
                      />
                      <div>
                        <h4 className="font-semibold mb-1">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground">{mistake.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expansion Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Expansion Recommendations
              </CardTitle>
              <CardDescription>Strategic options for capacity expansion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Vertical Expansion (Mezzanine)", cost: 450000, capacityIncrease: 20, roi: 35, priority: "high" },
                  { type: "Automated Storage System", cost: 850000, capacityIncrease: 45, roi: 42, priority: "high" },
                  { type: "Racking Optimization", cost: 120000, capacityIncrease: 15, roi: 55, priority: "medium" },
                  { type: "Cross-Dock Expansion", cost: 350000, capacityIncrease: 12, roi: 38, priority: "low" },
                ].map((rec, index) => (
                  <motion.div
                    key={rec.type}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 ${
                      rec.priority === "high" ? "border-red-500" :
                      rec.priority === "medium" ? "border-amber-500" :
                      "border-green-500"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{rec.type}</h4>
                          <Badge
                            variant="outline"
                            className={
                              rec.priority === "high" ? "border-red-500 text-red-600" :
                              rec.priority === "medium" ? "border-amber-500 text-amber-600" :
                              "border-green-500 text-green-600"
                            }
                          >
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold" style={{ color: BRAND_COLORS.oceanBlue }}>
                            {formatCurrency(rec.cost)}
                          </p>
                          <p className="text-xs text-muted-foreground">Investment</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: BRAND_COLORS.logisticsGreen }}>
                            +{rec.capacityIncrease}%
                          </p>
                          <p className="text-xs text-muted-foreground">Capacity</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold" style={{ color: BRAND_COLORS.purple }}>
                            {rec.roi}%
                          </p>
                          <p className="text-xs text-muted-foreground">ROI</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Understanding Warehouse Capacity
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Warehouse capacity is a multifaceted concept that extends far beyond simple square footage calculations.
                At its core, capacity planning involves understanding the interplay between physical space, inventory
                characteristics, operational workflows, and future growth projections. A comprehensive capacity analysis
                must consider not only the floor area available but also the vertical storage potential, aisle configurations,
                product slotting strategies, and throughput requirements. Modern warehouses typically utilize only 40-50%
                of their total cubic volume, leaving significant room for optimization without physical expansion.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Effective capacity planning requires a holistic approach that balances storage density with operational
                efficiency. Overcrowded warehouses may maximize storage but suffer from reduced picking productivity,
                increased safety risks, and limited flexibility for peak seasons. Conversely, underutilized warehouses
                waste resources and inflate per-unit storage costs. The optimal utilization target typically ranges from
                75-85%, providing adequate buffer for seasonal fluctuations, new product introductions, and operational
                flexibility. This target allows for efficient operations while maintaining the agility needed to respond
                to changing business conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers3 className="h-5 w-5" style={{ color: BRAND_COLORS.logisticsGreen }} />
                Types of Storage Systems
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Storage system selection fundamentally impacts warehouse capacity and operational efficiency. Selective
                pallet racking, the most common system, offers 100% selectivity but achieves only 30-40% floor space
                utilization due to required aisles. This system is ideal for operations with high SKU counts and frequent
                inventory turnover where accessibility is paramount. Drive-in and drive-through racking systems eliminate
                aisles to achieve 60-70% floor utilization, making them suitable for homogeneous inventory with fewer SKUs
                but high pallet quantities per SKU.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Push-back and pallet flow racking systems combine high density with reasonable selectivity, utilizing
                gravity-fed lanes that can achieve 50-75% floor utilization. Push-back systems operate on a LIFO basis,
                while pallet flow provides FIFO inventory management—crucial for perishable or date-sensitive products.
                Mobile racking systems mount standard racking on motorized bases that move along floor tracks, eliminating
                fixed aisles entirely and achieving up to 80% floor utilization. The most space-efficient option is
                Automated Storage and Retrieval Systems (AS/RS), which can reach 85% utilization while providing perfect
                selectivity and high throughput, though requiring significant capital investment. Each system type serves
                different operational requirements, and many warehouses employ hybrid configurations that optimize
                different zones for different inventory characteristics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" style={{ color: BRAND_COLORS.warning }} />
                Capacity Planning Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Strategic capacity planning begins with accurate demand forecasting that accounts for both baseline
                growth and seasonal variations. Historical sales data should be analyzed to identify demand patterns,
                peak seasons, and growth trends. This analysis feeds into capacity models that project future storage
                requirements across different scenarios. Conservative, moderate, and aggressive growth projections help
                organizations understand the range of possible outcomes and plan appropriate responses for each scenario.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                A phased approach to capacity planning allows organizations to match investment timing with actual demand
                realization. Short-term capacity increases can be achieved through operational improvements like slotting
                optimization, inventory reduction, and extended operating hours. Medium-term solutions include racking
                modifications, mezzanine installations, and temporary overflow facilities. Long-term capacity expansion
                may involve facility construction, acquisition, or significant automation investments. Each phase should
                be planned with clear trigger points that indicate when to proceed, ensuring capacity keeps pace with
                demand without over-investing in unused space. Regular reviews—quarterly at minimum—ensure plans remain
                aligned with actual business performance and market conditions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" style={{ color: BRAND_COLORS.purple }} />
                Optimizing Space Utilization
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Space optimization begins with a thorough audit of current utilization patterns, identifying both
                obvious waste and hidden inefficiencies. Many warehouses discover that significant space is consumed
                by obsolete inventory, damaged goods awaiting disposal, or oversized storage locations holding small
                items. Implementing rigorous slotting analysis ensures each product is stored in an appropriately sized
                location, potentially recovering 10-15% of storage capacity. Regular slotting reviews should adjust
                locations based on changing velocity patterns and seasonal demand shifts.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Aisle width optimization offers substantial capacity improvements for facilities with standard wide
                aisles. Converting from 12-14 foot aisles to narrow aisle configurations (8-10 feet) or very narrow
                aisle designs (6-8 feet) can increase storage capacity by 15-25% within the same footprint. This
                conversion requires appropriate material handling equipment but typically delivers rapid ROI through
                increased storage density and improved picking productivity. Additional optimization strategies include
                implementing cross-docking for high-velocity items that bypass storage entirely, consolidating partial
                pallets to eliminate wasted slots, and utilizing vertical space through mezzanine installations or
                high-bay racking. The most effective optimization programs combine multiple strategies tailored to
                specific operational requirements and inventory characteristics.
              </p>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Capacity Planning Quick Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Optimal Utilization Targets</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Overall warehouse: 75-85%</li>
                    <li>• Picking zones: 70-80%</li>
                    <li>• Reserve storage: 85-90%</li>
                    <li>• Cold storage: 80-90%</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Warning Signs</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Utilization above 90%</li>
                    <li>• Increased picking errors</li>
                    <li>• Extended loading times</li>
                    <li>• Frequent overflow requests</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Improvement Timeline</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Quick wins: 0-3 months</li>
                    <li>• Medium term: 3-12 months</li>
                    <li>• Long term: 12+ months</li>
                    <li>• Review frequency: Quarterly</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <h4 className="font-semibold mb-2">Key Metrics</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Cubic utilization %</li>
                    <li>• Slot occupancy %</li>
                    <li>• Throughput velocity</li>
                    <li>• Cost per unit stored</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: BRAND_COLORS.oceanBlue }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Comprehensive answers to common warehouse capacity planning questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--logistics)]/10">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">Need More Help?</h3>
                  <p className="text-muted-foreground">Our logistics experts are available to help with your warehouse capacity planning needs.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documentation
                  </Button>
                  <Button style={{ backgroundColor: BRAND_COLORS.logisticsGreen }} className="text-white">
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Analysis</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowShareModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Copy configuration data</Label>
                  <div className="flex mt-2 gap-2">
                    <Input
                      readOnly
                      value={shareData.substring(0, 100) + "..."}
                      className="flex-1"
                    />
                    <Button onClick={copyToClipboard} variant="outline">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Share your warehouse configuration and analysis results with your team.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <Card className="bg-slate-50 dark:bg-slate-900">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Warehouse className="h-6 w-6" style={{ color: BRAND_COLORS.oceanBlue }} />
              <div>
                <p className="font-semibold" style={{ color: BRAND_COLORS.oceanBlue }}>
                  Shiportrade.com Warehouse Capacity Planner
                </p>
                <p className="text-sm text-muted-foreground">
                  Comprehensive warehouse analytics and planning tool
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live Data</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Last updated: {new Date().toLocaleString()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
