"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Info,
  Calculator,
  Target,
  BarChart3,
  Settings,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Gauge,
  Warehouse,
  Timer,
  Shield,
  ArrowRight,
  HelpCircle,
  Sparkles,
  Award,
  Layers,
  RefreshCw,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  AlertOctagon,
  Building2,
  Rocket,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  BarChart2,
  Copy,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { CHART_COLORS } from "@/lib/constants/chartColors";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

type PickMethod = "discrete" | "batch" | "zone" | "wave";
type ShippingOption = "standard" | "express" | "same-day" | "next-day";
type FulfillmentModel = "inhouse" | "3pl" | "dropship" | "hybrid";

interface PickMethodData {
  id: PickMethod;
  name: string;
  description: string;
  efficiencyMultiplier: number;
  laborReduction: number;
  setupTime: number;
  bestFor: string;
  icon: string;
}

interface ShippingOptionData {
  id: ShippingOption;
  name: string;
  costMultiplier: number;
  timeHours: number;
  description: string;
}

interface FulfillmentModelData {
  id: FulfillmentModel;
  name: string;
  description: string;
  costPerOrder: number;
  pros: string[];
  cons: string[];
  bestFor: string;
  icon: React.ReactNode;
}

interface CalculationResult {
  totalItems: number;
  pickTime: number;
  packTime: number;
  totalLaborHours: number;
  laborCost: number;
  costPerOrder: number;
  fulfillmentRate: number;
  dailyCapacity: number;
  capacityUtilization: number;
  workersNeeded: number;
  slaCompliance: number;
  throughput: number;
  ordersPerHour: number;
  stationUtilization: number;
  efficiency: number;
  shippingCost: number;
  totalCostPerOrder: number;
  peakCapacityNeeded: number;
  overtimeHours: number;
}

const pickMethods: Record<PickMethod, PickMethodData> = {
  discrete: {
    id: "discrete",
    name: "Discrete Picking",
    description: "One order at a time, single picker completes entire order",
    efficiencyMultiplier: 1.0,
    laborReduction: 0,
    setupTime: 0.05,
    bestFor: "Low volume, high variety",
    icon: "📦",
  },
  batch: {
    id: "batch",
    name: "Batch Picking",
    description: "Pick multiple orders simultaneously in one trip through the warehouse",
    efficiencyMultiplier: 1.35,
    laborReduction: 25,
    setupTime: 0.1,
    bestFor: "High volume, similar products",
    icon: "📦",
  },
  zone: {
    id: "zone",
    name: "Zone Picking",
    description: "Warehouse divided into zones with dedicated pickers per zone",
    efficiencyMultiplier: 1.5,
    laborReduction: 35,
    setupTime: 0.15,
    bestFor: "Large warehouses, diverse SKUs",
    icon: "🏭",
  },
  wave: {
    id: "wave",
    name: "Wave Picking",
    description: "Release orders in scheduled waves coordinated with shipping",
    efficiencyMultiplier: 1.45,
    laborReduction: 30,
    setupTime: 0.12,
    bestFor: "Time-sensitive, carrier integration",
    icon: "🌊",
  },
};

const shippingOptions: Record<ShippingOption, ShippingOptionData> = {
  standard: {
    id: "standard",
    name: "Standard Shipping",
    costMultiplier: 1.0,
    timeHours: 48,
    description: "3-5 business days delivery",
  },
  express: {
    id: "express",
    name: "Express Shipping",
    costMultiplier: 1.8,
    timeHours: 24,
    description: "1-2 business days delivery",
  },
  "same-day": {
    id: "same-day",
    name: "Same Day Delivery",
    costMultiplier: 2.5,
    timeHours: 4,
    description: "Delivery within same day",
  },
  "next-day": {
    id: "next-day",
    name: "Next Day Delivery",
    costMultiplier: 1.5,
    timeHours: 18,
    description: "Guaranteed next business day",
  },
};

const fulfillmentModels: Record<FulfillmentModel, FulfillmentModelData> = {
  inhouse: {
    id: "inhouse",
    name: "In-House Fulfillment",
    description: "Manage all fulfillment operations internally with your own warehouse, staff, and equipment.",
    costPerOrder: 3.50,
    pros: ["Full control over operations", "Direct quality oversight", "No third-party dependencies", "Better for brand experience"],
    cons: ["High fixed costs", "Requires significant investment", "Limited scalability", "Management overhead"],
    bestFor: "High volume businesses with consistent demand",
    icon: <Building2 className="h-5 w-5" />,
  },
  "3pl": {
    id: "3pl",
    name: "Third-Party Logistics (3PL)",
    description: "Outsource fulfillment to specialized logistics providers who handle warehousing, picking, packing, and shipping.",
    costPerOrder: 4.25,
    pros: ["Scalable infrastructure", "Reduced capital investment", "Expertise and technology", "Multi-location fulfillment"],
    cons: ["Less control over operations", "Variable costs", "Potential quality variations", "Dependency on provider"],
    bestFor: "Growing businesses needing flexibility",
    icon: <Truck className="h-5 w-5" />,
  },
  dropship: {
    id: "dropship",
    name: "Dropshipping",
    description: "Suppliers ship directly to customers; no inventory handling required from the seller.",
    costPerOrder: 2.80,
    pros: ["No inventory investment", "Low operational complexity", "Wide product selection", "Location independence"],
    cons: ["Lower profit margins", "Limited quality control", "Shipping time challenges", "Supplier dependency"],
    bestFor: "New businesses testing markets",
    icon: <Package className="h-5 w-5" />,
  },
  hybrid: {
    id: "hybrid",
    name: "Hybrid Fulfillment",
    description: "Combine multiple fulfillment methods - in-house for core products, 3PL for overflow, dropship for niche items.",
    costPerOrder: 3.75,
    pros: ["Optimized for each product", "Risk diversification", "Flexible capacity management", "Cost optimization"],
    cons: ["Complex coordination", "Multiple systems", "Inconsistent customer experience", "Higher management needs"],
    bestFor: "Established businesses with diverse products",
    icon: <Layers className="h-5 w-5" />,
  },
};

const comprehensiveFAQs = [
  {
    question: "What is order fulfillment and why is it critical for e-commerce success?",
    answer: "Order fulfillment encompasses the complete process from receiving a customer order to delivering the product to their doorstep. It includes inventory management, order processing, picking items from warehouse locations, packing them securely, and coordinating shipping to the final destination. Effective fulfillment is the backbone of e-commerce operations because it directly impacts customer satisfaction, repeat purchase rates, and overall business profitability. Poor fulfillment leads to delayed shipments, incorrect orders, damaged goods, and ultimately, lost customers. Studies show that 84% of consumers will not return to a brand after a poor delivery experience. Furthermore, fulfillment costs typically represent 15-30% of total operating costs for e-commerce businesses, making optimization essential for maintaining healthy margins. Modern fulfillment strategies must balance speed, accuracy, and cost while adapting to seasonal fluctuations and evolving customer expectations for faster delivery times.",
  },
  {
    question: "How do I determine the optimal picking method for my warehouse operations?",
    answer: "Selecting the right picking method depends on multiple factors including order volume, SKU count, warehouse layout, and order complexity. Discrete picking works best for operations with fewer than 100 daily orders, a wide variety of products, and orders that require careful attention to detail. This method is simple to implement but becomes inefficient at scale. Batch picking increases efficiency 25-35% by consolidating multiple orders into a single picking tour, ideal for operations with 100-500 daily orders and relatively similar product types. Zone picking assigns workers to specific warehouse zones and can boost efficiency by 40-50%, making it suitable for large warehouses (50,000+ sq ft) with diverse SKUs and 500+ daily orders. Wave picking coordinates order release with shipping schedules, perfect for operations with time-sensitive deliveries and carrier integration requirements. Consider starting with discrete picking and progressively implementing more advanced methods as volume grows. The key is to match your picking method to your specific operational characteristics rather than blindly following industry trends.",
  },
  {
    question: "What fulfillment rate should I target and what happens if I fall below 80%?",
    answer: "A healthy fulfillment rate target is 95% or higher, meaning your operation can process at least 95% of daily incoming orders within your available capacity and SLA timeframes. This 5% buffer accounts for operational variability, equipment issues, and unexpected demand spikes. When fulfillment rate drops below 80%, several serious consequences emerge. First, order backlog accumulates rapidly, creating a snowball effect where each day's new orders compound previous delays. Second, overtime costs escalate as you struggle to catch up, often increasing labor costs by 25-40%. Third, customer satisfaction plummets as delivery times extend beyond expectations, leading to increased complaints, returns, and negative reviews. Fourth, you may face SLA penalties if you have contractual obligations with retail partners or B2B customers. Fifth, employee morale suffers as workers face constant pressure and extended shifts. To recover from sub-80% fulfillment rates, you need immediate capacity expansion through temporary staffing, extended shifts, or outsourcing overflow to a 3PL partner. Long-term solutions include process optimization, automation investment, and demand forecasting improvements.",
  },
  {
    question: "How should I calculate and budget for labor requirements in fulfillment?",
    answer: "Labor calculation begins with understanding your total processing time: the sum of pick time, pack time, and setup/transition time per order. For accurate estimates, track actual worker performance over multiple shifts and seasons. A typical pick takes 0.3-0.8 minutes per item depending on warehouse layout and picking method, while packing requires 1.5-3 minutes per order based on complexity. Add 10-15% buffer for breaks, training, quality checks, and variability. Calculate workers needed by dividing total processing time by available shift hours. For example, processing 500 orders with 10 minutes total time per order equals 5,000 minutes or 83.3 hours. With 8-hour shifts, you need approximately 11 workers. However, factor in role distribution: typically 60% pickers, 30% packers, and 10% supervisors/floaters. Budget for labor costs by multiplying workers needed by hours and hourly rate, then add 20-30% for benefits, taxes, and overhead. Don't forget to plan for peak seasons with 1.5-3x normal volume, requiring proportional staffing increases. Cross-training workers provides flexibility to shift resources between picking and packing as daily demands fluctuate.",
  },
  {
    question: "What are the key components that affect cost per order and how can I reduce them?",
    answer: "Cost per order (CPO) comprises several components: labor costs (40-50%), shipping expenses (30-40%), packaging materials (10-15%), and overhead allocation (10-15%). Labor costs include picking, packing, quality control, returns processing, and management. Shipping costs vary by carrier, service level, package weight, and delivery distance. Packaging includes boxes, tape, labels, protective materials, and custom branded packaging. Overhead covers rent, utilities, equipment depreciation, software systems, and insurance. To reduce CPO, start with picking optimization using ABC slotting to place fast-moving items near pack stations, reducing travel time by 20-30%. Implement batch or zone picking for higher volumes to improve picker productivity. Negotiate aggressive carrier rates by consolidating volume with fewer carriers and leveraging your total shipping spend. Right-size packaging to minimize dimensional weight charges - many companies save 15-25% by switching to packaging that better fits their typical order profiles. Automate where ROI justifies it: conveyor systems, automated storage and retrieval systems (AS/RS), and robotic picking can reduce labor costs 40-60% for high-volume operations. Finally, reduce returns through better product information and quality control, as returns processing typically costs 2-3x forward fulfillment.",
  },
  {
    question: "What strategies should I implement for peak season capacity planning?",
    answer: "Peak season planning must begin 4-6 months before anticipated volume increases. Start by analyzing historical data to identify peak periods and expected volume multiples - most e-commerce operations see 2-3x normal volume during Q4 holidays. Develop a capacity model showing your current baseline capacity, projected peak demand, and the gap that needs to be filled. Staffing strategies include hiring temporary workers (begin recruiting 2-3 months early), cross-training existing staff for multiple roles, extending shifts with overtime premiums, and partnering with staffing agencies for flexible labor pools. Operational strategies include pre-positioning inventory to reduce pick travel time, implementing wave picking to coordinate with carrier schedules, pre-packing common order combinations, and activating secondary fulfillment locations. Technology considerations include stress-testing order management and warehouse management systems, ensuring adequate bandwidth for increased transactions, and preparing backup communication channels for peak-period issues. Establish 3PL overflow partnerships with pre-negotiated rates and activation triggers (e.g., when daily volume exceeds 120% of capacity). Post-peak, conduct thorough analysis to document lessons learned and improve next year's planning. Remember that peak season is also when customer expectations are highest - communication about potential delays and proactive order updates become even more critical.",
  },
  {
    question: "What is SLA compliance and why does it matter for B2B and B2C operations?",
    answer: "Service Level Agreement (SLA) compliance measures your ability to meet committed order processing and delivery timeframes. For B2C operations, SLAs typically focus on order-to-ship time (how quickly an order leaves your warehouse) and delivery promises made to customers. For B2B operations, SLAs often include stricter requirements such as specific delivery windows, advance ship notice (ASN) accuracy, product condition standards, and penalty clauses for non-compliance. Target SLA compliance should be 95% or higher, as each missed SLA has compounding negative effects. In B2C, missed delivery promises lead to customer complaints, negative reviews, and lost future business - research shows 62% of online shoppers will abandon a brand after 2-3 poor delivery experiences. In B2B, SLA breaches can trigger financial penalties ranging from 1-5% of order value, damage long-term partnerships, and result in chargebacks for retailers. Track SLA compliance by measuring the percentage of orders meeting each committed metric, identify root causes for misses (capacity constraints, system issues, carrier delays), and implement corrective actions. Establish early warning systems that flag potential SLA risks before they materialize, allowing proactive customer communication and expectation management. Regular SLA reviews with key customers help maintain relationships and identify improvement opportunities.",
  },
  {
    question: "How do I choose between in-house fulfillment, 3PL, and dropshipping models?",
    answer: "Each fulfillment model has distinct advantages and trade-offs that make it suitable for different business stages and strategies. In-house fulfillment provides maximum control over customer experience, quality, and branding. It's ideal for businesses with consistent high volume (500+ orders/day), unique products requiring special handling, or premium brands where unboxing experience is critical. However, it requires significant capital investment (warehouse, equipment, staff), ongoing management overhead, and creates fixed costs that persist regardless of volume. Third-party logistics (3PL) offers scalability and reduced capital requirements, with costs that scale with your volume. Choose 3PL if you're experiencing rapid growth, need multi-location fulfillment for faster delivery, or want to focus resources on product development and marketing rather than operations. Evaluate 3PLs on technology integration capabilities, fulfillment accuracy rates, shipping rates, and customer service responsiveness. Dropshipping eliminates inventory investment and fulfillment operations entirely, ideal for testing new products, serving niche markets, or businesses with limited capital. However, you sacrifice control over fulfillment quality, face lower margins due to supplier markup, and may struggle with inconsistent shipping times. Many successful businesses adopt hybrid approaches: in-house for core products, 3PL for overflow or regional fulfillment, and dropship for extended catalog items. Your choice should align with your competitive strategy, growth stage, capital availability, and the importance of fulfillment to your customer value proposition.",
  },
];

const proTips = [
  {
    icon: <Lightbulb className="h-5 w-5" />,
    title: "Implement Pick Path Optimization",
    description: "Use warehouse mapping software to create optimal pick routes. This can reduce walking time by 30-50% and significantly improve picker productivity. Analyze pick density and slot popular items together.",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Set Realistic SLA Targets",
    description: "Base your SLA targets on 85th percentile performance, not average. This accounts for variability and prevents over-promising. Communicate realistic delivery windows to customers to set proper expectations.",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Cross-Train Your Workforce",
    description: "Train workers to handle both picking and packing duties. This flexibility allows you to shift resources based on real-time bottlenecks and reduces dependency on specialized labor during peak periods.",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Track Key Performance Indicators Daily",
    description: "Monitor picks per hour, orders per station, fulfillment rate, and error rate daily. Set up dashboards and alerts for metrics that fall outside acceptable ranges. Data-driven decisions prevent small issues from becoming major problems.",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Automate High-Volume Tasks First",
    description: "Prioritize automation for repetitive, high-volume tasks like label printing and box erection. These typically offer the fastest ROI (6-18 months) and free up workers for tasks requiring human judgment.",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Build Quality Checks at Every Stage",
    description: "Implement barcode scanning at pick and pack stages, weight verification before shipping, and photo documentation of packed orders. This reduces errors by 80-90% and provides proof for dispute resolution.",
  },
];

const commonMistakes = [
  {
    icon: <AlertOctagon className="h-5 w-5" />,
    title: "Underestimating Peak Season Volume",
    description: "Many businesses plan for average volumes and get overwhelmed during peak periods. Always plan capacity for 2-3x your average daily volume and have contingency plans ready. Failing to prepare leads to overtime costs, SLA breaches, and customer complaints.",
  },
  {
    icon: <AlertOctagon className="h-5 w-5" />,
    title: "Ignoring Returns Processing",
    description: "Returns can account for 20-30% of orders, especially in apparel. Failing to staff and budget for returns processing creates backlogs that consume valuable warehouse space and delay inventory restocking. Build dedicated returns processing capacity.",
  },
  {
    icon: <AlertOctagon className="h-5 w-5" />,
    title: "Over-Reliance on Manual Processes",
    description: "Manual tracking, paper-based systems, and spreadsheet management don't scale. As volume grows, these approaches lead to errors, delays, and inability to provide real-time visibility. Invest in proper WMS and OMS systems before you need them.",
  },
  {
    icon: <AlertOctagon className="h-5 w-5" />,
    title: "Poor Inventory Slotting",
    description: "Random inventory placement forces pickers to travel longer distances. Implement ABC analysis to slot fast-moving items near pack stations, medium movers in middle zones, and slow movers in remote areas. Poor slotting can increase labor costs by 25% or more.",
  },
  {
    icon: <AlertOctagon className="h-5 w-5" />,
    title: "Neglecting Worker Training and Retention",
    description: "High turnover in warehouse roles is expensive - recruiting, training, and productivity loss during ramp-up can cost 50-100% of annual salary per worker. Invest in proper training, competitive wages, and career development to reduce turnover and maintain productivity.",
  },
];

export function OrderFulfillmentCalculator() {
  const [orderVolume, setOrderVolume] = useState<string>("500");
  const [skus, setSkus] = useState<string>("1500");
  const [itemsPerOrder, setItemsPerOrder] = useState<string>("3");
  const [pickMethod, setPickMethod] = useState<PickMethod>("batch");
  const [packTimePerOrder, setPackTimePerOrder] = useState<string>("2.5");
  const [shippingOption, setShippingOption] = useState<ShippingOption>("standard");
  const [baseShippingCost, setBaseShippingCost] = useState<string>("8.50");
  const [laborRate, setLaborRate] = useState<string>("18");
  const [shiftHours, setShiftHours] = useState<string>("8");
  const [packStations, setPackStations] = useState<number>(4);
  const [warehouseSize, setWarehouseSize] = useState<string>("50000");
  const [peakVolumeMultiplier, setPeakVolumeMultiplier] = useState<number>(1.5);
  const [targetSla, setTargetSla] = useState<number>(24);
  const [includePackaging, setIncludePackaging] = useState<boolean>(true);
  const [packagingCost, setPackagingCost] = useState<string>("0.75");
  const [fulfillmentModel, setFulfillmentModel] = useState<FulfillmentModel>("inhouse");
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [copied, setCopied] = useState<boolean>(false);

  const selectedMethod = pickMethods[pickMethod];
  const selectedShipping = shippingOptions[shippingOption];
  const selectedModel = fulfillmentModels[fulfillmentModel];

  const calculation = useMemo<CalculationResult>(() => {
    const orders = parseInt(orderVolume) || 0;
    const skuCount = parseInt(skus) || 1;
    const items = parseInt(itemsPerOrder) || 1;
    const rate = parseFloat(laborRate) || 18;
    const shifts = parseFloat(shiftHours) || 8;
    const size = parseInt(warehouseSize) || 50000;
    const packTime = parseFloat(packTimePerOrder) || 2.5;
    const shippingBase = parseFloat(baseShippingCost) || 8.5;
    const packaging = includePackaging ? parseFloat(packagingCost) || 0.75 : 0;

    const totalItems = orders * items;

    // Base pick time per item (minutes)
    const basePickTime = 0.5;
    // SKU density factor (more SKUs = more complexity)
    const skuFactor = 1 + (skuCount / 5000);
    // Travel time factor based on warehouse size
    const travelFactor = 1 + (size / 100000);
    // Apply method efficiency
    const effectivePickTime = (basePickTime * travelFactor * skuFactor) / selectedMethod.efficiencyMultiplier;
    const totalPickTime = totalItems * effectivePickTime;

    // Pack time calculation
    const totalPackTime = orders * packTime;

    // Setup and transition time
    const setupTime = orders * selectedMethod.setupTime;

    const totalTimeMinutes = totalPickTime + totalPackTime + (setupTime * orders * items);
    const totalLaborHours = totalTimeMinutes / 60;

    // Labor cost calculation
    const laborCost = totalLaborHours * rate;

    // Cost per order (labor only)
    const costPerOrder = laborCost / orders;

    // Shipping cost
    const shippingCost = shippingBase * selectedShipping.costMultiplier;

    // Total cost per order
    const totalCostPerOrder = costPerOrder + shippingCost + packaging;

    // Throughput calculations
    const availableMinutes = packStations * shifts * 60;
    const throughput = Math.min(100, (totalTimeMinutes / availableMinutes) * 100);
    const ordersPerHour = orders / totalLaborHours;

    // Station utilization
    const stationUtilization = Math.min(100, (totalLaborHours / (packStations * shifts)) * 100);

    // Workers needed
    const workersNeeded = Math.ceil(totalLaborHours / shifts);

    // Daily capacity
    const dailyCapacity = Math.round((packStations * shifts * 60) / (packTime + (effectivePickTime * items)));

    // Capacity utilization
    const capacityUtilization = Math.min(100, (orders / dailyCapacity) * 100);

    // Fulfillment rate (% of orders that can be processed within SLA)
    const fulfillmentRate = Math.min(100, (dailyCapacity / orders) * 100);

    // SLA compliance (based on target SLA vs actual processing time)
    const avgProcessingTimeMinutes = totalTimeMinutes / orders;
    const slaCompliance = Math.min(100, Math.max(0, 100 - ((avgProcessingTimeMinutes / 60 - targetSla) / targetSla * 100 * -1)));

    // Efficiency score (0-100)
    const efficiency = Math.min(100, Math.round(
      50 * selectedMethod.efficiencyMultiplier +
      (100 - stationUtilization) * 0.3 +
      (items > 2 ? 10 : 5)
    ));

    // Peak capacity needed
    const peakOrders = orders * peakVolumeMultiplier;
    const peakCapacityNeeded = Math.ceil(peakOrders / (dailyCapacity / orders));

    // Overtime hours
    const overtimeHours = Math.max(0, totalLaborHours - (workersNeeded * shifts));

    return {
      totalItems,
      pickTime: totalPickTime / 60,
      packTime: totalPackTime / 60,
      totalLaborHours,
      laborCost,
      costPerOrder,
      fulfillmentRate,
      dailyCapacity,
      capacityUtilization,
      workersNeeded,
      slaCompliance: Math.max(0, Math.min(100, slaCompliance)),
      throughput,
      ordersPerHour,
      stationUtilization,
      efficiency,
      shippingCost,
      totalCostPerOrder,
      peakCapacityNeeded,
      overtimeHours,
    };
  }, [orderVolume, skus, itemsPerOrder, pickMethod, packTimePerOrder, shippingOption, baseShippingCost, laborRate, shiftHours, packStations, warehouseSize, peakVolumeMultiplier, targetSla, includePackaging, packagingCost, selectedMethod, selectedShipping]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  // Chart data with proper hex colors
  const pieData = [
    { name: "Pick Time", value: calculation.pickTime, fill: OCEAN_BLUE },
    { name: "Pack Time", value: calculation.packTime, fill: LOGISTICS_GREEN },
    { name: "Other", value: Math.max(0.1, calculation.totalLaborHours - calculation.pickTime - calculation.packTime), fill: CHART_COLORS.amber },
  ];

  const methodComparisonData = Object.values(pickMethods).map((method) => ({
    name: method.name.split(" ")[0],
    efficiency: method.efficiencyMultiplier * 100,
    laborReduction: method.laborReduction,
    current: method.id === pickMethod,
  }));

  const costBreakdownData = [
    { name: "Labor", value: calculation.costPerOrder, fill: OCEAN_BLUE },
    { name: "Shipping", value: calculation.shippingCost, fill: LOGISTICS_GREEN },
    { name: "Packaging", value: includePackaging ? (parseFloat(packagingCost) || 0) : 0, fill: CHART_COLORS.amber },
  ].filter(d => d.value > 0);

  const slaData = Array.from({ length: 8 }, (_, i) => ({
    hour: `${i + 1}h`,
    orders: Math.round((parseInt(orderVolume) || 0) / 8 * (0.7 + Math.random() * 0.6)),
    target: Math.round((parseInt(orderVolume) || 0) / 8),
    cumulative: Math.round((parseInt(orderVolume) || 0) / 8 * (i + 1)),
  }));

  const laborRequirementData = [
    { name: "Pickers", workers: Math.ceil(calculation.workersNeeded * 0.6), fill: OCEAN_BLUE },
    { name: "Packers", workers: Math.ceil(calculation.workersNeeded * 0.3), fill: LOGISTICS_GREEN },
    { name: "Supervisors", workers: Math.max(1, Math.ceil(calculation.workersNeeded * 0.1)), fill: CHART_COLORS.amber },
  ];

  const radialData = [
    { name: "Efficiency", value: calculation.efficiency, fill: OCEAN_BLUE },
    { name: "SLA", value: calculation.slaCompliance, fill: LOGISTICS_GREEN },
    { name: "Utilization", value: calculation.capacityUtilization, fill: CHART_COLORS.amber },
  ];

  const volumeProjectionData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    orders: Math.round((parseInt(orderVolume) || 500) * (0.8 + Math.random() * 0.4)),
    capacity: calculation.dailyCapacity,
    projected: Math.round((parseInt(orderVolume) || 500) * (1 + (i * 0.05))),
  }));

  const fulfillmentMetricsData = [
    { name: "Fulfillment Rate", value: calculation.fulfillmentRate, fill: OCEAN_BLUE },
    { name: "SLA Compliance", value: calculation.slaCompliance, fill: LOGISTICS_GREEN },
    { name: "Station Util.", value: calculation.stationUtilization, fill: CHART_COLORS.amber },
    { name: "Throughput", value: calculation.throughput, fill: CHART_COLORS.rose },
  ];

  const chartConfig = {
    hours: { label: "Hours" },
    efficiency: { label: "Efficiency %" },
    orders: { label: "Orders" },
    target: { label: "Target" },
    pick: { label: "Pick", color: OCEAN_BLUE },
    pack: { label: "Pack", color: LOGISTICS_GREEN },
  };

  // Hero stats
  const heroStats = [
    { label: "Daily Orders", value: parseInt(orderVolume) || 0, icon: Package, color: OCEAN_BLUE },
    { label: "Workers Needed", value: calculation.workersNeeded, icon: Users, color: LOGISTICS_GREEN },
    { label: "Cost/Order", value: formatCurrency(calculation.totalCostPerOrder), icon: DollarSign, color: CHART_COLORS.amber },
    { label: "Efficiency", value: `${calculation.efficiency}%`, icon: Gauge, color: OCEAN_BLUE },
  ];

  // Reset function
  const handleReset = useCallback(() => {
    setOrderVolume("500");
    setSkus("1500");
    setItemsPerOrder("3");
    setPickMethod("batch");
    setPackTimePerOrder("2.5");
    setShippingOption("standard");
    setBaseShippingCost("8.50");
    setLaborRate("18");
    setShiftHours("8");
    setPackStations(4);
    setWarehouseSize("50000");
    setPeakVolumeMultiplier(1.5);
    setTargetSla(24);
    setIncludePackaging(true);
    setPackagingCost("0.75");
    setFulfillmentModel("inhouse");
  }, []);

  // Export function
  const handleExport = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      inputs: {
        orderVolume,
        skus,
        itemsPerOrder,
        pickMethod,
        packTimePerOrder,
        shippingOption,
        baseShippingCost,
        laborRate,
        shiftHours,
        packStations,
        warehouseSize,
        peakVolumeMultiplier,
        targetSla,
        includePackaging,
        packagingCost,
        fulfillmentModel,
      },
      results: calculation,
      pickMethodInfo: pickMethods[pickMethod],
      shippingOptionInfo: shippingOptions[shippingOption],
      fulfillmentModelInfo: fulfillmentModels[fulfillmentModel],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fulfillment-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [orderVolume, skus, itemsPerOrder, pickMethod, packTimePerOrder, shippingOption, baseShippingCost, laborRate, shiftHours, packStations, warehouseSize, peakVolumeMultiplier, targetSla, includePackaging, packagingCost, fulfillmentModel, calculation]);

  // Share function
  const handleShare = useCallback(async () => {
    const shareText = `Order Fulfillment Calculation:
- Daily Orders: ${orderVolume}
- Workers Needed: ${calculation.workersNeeded}
- Cost/Order: ${formatCurrency(calculation.totalCostPerOrder)}
- Fulfillment Rate: ${formatNumber(calculation.fulfillmentRate, 1)}%
- SLA Compliance: ${formatNumber(calculation.slaCompliance, 1)}%
- Efficiency: ${calculation.efficiency}%

Calculated using Order Fulfillment Calculator`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [orderVolume, calculation]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 p-8 md:p-12 border border-border/50">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,76,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,76,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Floating Elements */}
        <motion.div
          className="absolute top-4 right-4 w-20 h-20 rounded-full bg-[var(--ocean)]/5"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-[var(--logistics)]/5"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap gap-2 mb-4"
              >
                {["E-Commerce", "Fulfillment", "Order Processing"].map((badge, index) => (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Badge 
                      variant="outline"
                      className="bg-background/80 backdrop-blur-sm border-border/50 text-foreground"
                    >
                      {badge}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Order Fulfillment Calculator
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Calculate costs, capacity, labor requirements, and SLA compliance for your e-commerce fulfillment operations.
              </motion.p>
              
              {/* Action Buttons */}
              <motion.div 
                className="flex flex-wrap gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </Button>
                <Button variant="outline" onClick={handleExport} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="default" onClick={handleShare} className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {copied ? "Copied!" : "Share"}
                </Button>
              </motion.div>
            </div>
            
            {/* Quick Stats */}
            <motion.div 
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {heroStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={stat.label}
                    className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <div className="text-xl md:text-2xl font-bold">
                      {typeof stat.value === 'number' ? formatNumber(stat.value, 0) : stat.value}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
          <TabsTrigger value="calculator" className="gap-1 md:gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-1 md:gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="options" className="gap-1 md:gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Options</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="gap-1 md:gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-1 md:gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Order Volume & SKUs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Order Volume & SKUs
                  </CardTitle>
                  <CardDescription>
                    Enter your daily order processing requirements and product catalog size
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orderVolume">Daily Orders</Label>
                      <Input
                        id="orderVolume"
                        type="number"
                        value={orderVolume}
                        onChange={(e) => setOrderVolume(e.target.value)}
                        placeholder="500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="skus">Total SKUs</Label>
                      <Input
                        id="skus"
                        type="number"
                        value={skus}
                        onChange={(e) => setSkus(e.target.value)}
                        placeholder="1500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemsPerOrder">Items/Order</Label>
                      <Input
                        id="itemsPerOrder"
                        type="number"
                        value={itemsPerOrder}
                        onChange={(e) => setItemsPerOrder(e.target.value)}
                        placeholder="3"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Items to Process</span>
                      <Badge variant="secondary" className="font-mono">
                        {formatNumber(calculation.totalItems, 0)} items
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Picking Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Picking Method
                  </CardTitle>
                  <CardDescription>
                    Choose the optimal picking strategy for your operation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={pickMethod} onValueChange={(v) => setPickMethod(v as PickMethod)}>
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="discrete">Discrete</TabsTrigger>
                      <TabsTrigger value="batch">Batch</TabsTrigger>
                      <TabsTrigger value="zone">Zone</TabsTrigger>
                      <TabsTrigger value="wave">Wave</TabsTrigger>
                    </TabsList>

                    {Object.values(pickMethods).map((method) => (
                      <TabsContent key={method.id} value={method.id} className="mt-4">
                        <div className="p-4 bg-gradient-to-br rounded-lg border" style={{ background: `linear-gradient(to bottom right, ${OCEAN_BLUE}08, ${LOGISTICS_GREEN}08)` }}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{method.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold">{method.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {method.description}
                              </p>
                              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Efficiency:</span>
                                  <Badge variant="outline" className="ml-2" style={{ color: LOGISTICS_GREEN }}>
                                    +{Math.round((method.efficiencyMultiplier - 1) * 100)}%
                                  </Badge>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Labor Saved:</span>
                                  <Badge variant="outline" className="ml-2" style={{ color: OCEAN_BLUE }}>
                                    {method.laborReduction}%
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                <strong>Best for:</strong> {method.bestFor}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Pack Time & Shipping */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Pack Time & Shipping
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="packTime">Pack Time (min/order)</Label>
                      <Input
                        id="packTime"
                        type="number"
                        step="0.1"
                        value={packTimePerOrder}
                        onChange={(e) => setPackTimePerOrder(e.target.value)}
                        placeholder="2.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baseShipping">Base Shipping Cost</Label>
                      <Input
                        id="baseShipping"
                        type="number"
                        step="0.01"
                        value={baseShippingCost}
                        onChange={(e) => setBaseShippingCost(e.target.value)}
                        placeholder="8.50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Shipping Option</Label>
                    <Select value={shippingOption} onValueChange={(v) => setShippingOption(v as ShippingOption)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(shippingOptions).map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name} ({option.description})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={includePackaging}
                        onCheckedChange={setIncludePackaging}
                      />
                      <Label className="cursor-pointer">Include Packaging Cost</Label>
                    </div>
                    {includePackaging && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={packagingCost}
                          onChange={(e) => setPackagingCost(e.target.value)}
                          className="w-20 h-8"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Resources & Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Resources & Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Pack Stations</Label>
                      <Badge variant="secondary">{packStations} stations</Badge>
                    </div>
                    <Slider
                      value={[packStations]}
                      onValueChange={(v) => setPackStations(v[0])}
                      min={1}
                      max={20}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="laborRate">Labor Rate ($/hr)</Label>
                      <Input
                        id="laborRate"
                        type="number"
                        value={laborRate}
                        onChange={(e) => setLaborRate(e.target.value)}
                        placeholder="18"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shiftHours">Shift Hours</Label>
                      <Input
                        id="shiftHours"
                        type="number"
                        value={shiftHours}
                        onChange={(e) => setShiftHours(e.target.value)}
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="warehouseSize">Warehouse Size (sq ft)</Label>
                    <Select value={warehouseSize} onValueChange={setWarehouseSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10000">10,000 sq ft (Small)</SelectItem>
                        <SelectItem value="25000">25,000 sq ft (Medium)</SelectItem>
                        <SelectItem value="50000">50,000 sq ft (Large)</SelectItem>
                        <SelectItem value="100000">100,000 sq ft (X-Large)</SelectItem>
                        <SelectItem value="200000">200,000 sq ft (Distribution Center)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Planning */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Gauge className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Capacity & SLA Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Peak Volume Multiplier</Label>
                      <Badge variant="secondary">{peakVolumeMultiplier.toFixed(1)}x</Badge>
                    </div>
                    <Slider
                      value={[peakVolumeMultiplier]}
                      onValueChange={(v) => setPeakVolumeMultiplier(v[0])}
                      min={1.0}
                      max={3.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Target SLA (hours)</Label>
                      <Badge variant="secondary">{targetSla}h</Badge>
                    </div>
                    <Slider
                      value={[targetSla]}
                      onValueChange={(v) => setTargetSla(v[0])}
                      min={4}
                      max={48}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Cost Analysis */}
              <Card className="bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Cost Per Order Analysis
                  </CardTitle>
                  <CardDescription>
                    Complete fulfillment cost breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>
                        {formatCurrency(calculation.costPerOrder)}
                      </div>
                      <div className="text-xs text-muted-foreground">Labor Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                        {formatCurrency(calculation.shippingCost)}
                      </div>
                      <div className="text-xs text-muted-foreground">Shipping</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {formatCurrency(calculation.totalCostPerOrder)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total/Order</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 rounded-lg px-3 bg-[var(--logistics)]/10">
                    <span className="font-semibold">Daily Total Cost</span>
                    <span className="font-bold text-xl" style={{ color: LOGISTICS_GREEN }}>
                      {formatCurrency(calculation.totalCostPerOrder * (parseInt(orderVolume) || 0))}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Fulfillment Rate & SLA */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Fulfillment Rate & SLA Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                        <span className="text-sm font-medium">Fulfillment Rate</span>
                      </div>
                      <div className="text-2xl font-bold">{formatNumber(calculation.fulfillmentRate, 1)}%</div>
                      <Progress value={calculation.fulfillmentRate} className="h-2 mt-2" />
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        <span className="text-sm font-medium">SLA Compliance</span>
                      </div>
                      <div className="text-2xl font-bold">{formatNumber(calculation.slaCompliance, 1)}%</div>
                      <Progress value={calculation.slaCompliance} className="h-2 mt-2" />
                    </div>
                  </div>

                  <div className={`p-3 rounded-lg flex items-start gap-3 ${
                    calculation.slaCompliance >= 95 ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800" :
                    calculation.slaCompliance >= 80 ? "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" :
                    "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
                  }`}>
                    {calculation.slaCompliance >= 95 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    ) : calculation.slaCompliance >= 80 ? (
                      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                    )}
                    <div className="text-sm">
                      <span className="font-semibold">
                        {calculation.slaCompliance >= 95 ? "SLA Target Met" :
                         calculation.slaCompliance >= 80 ? "SLA at Risk" : "SLA Breach Risk"}
                      </span>
                      <p className="text-muted-foreground">
                        {calculation.slaCompliance >= 95 ? "Current capacity meets service level targets." :
                         calculation.slaCompliance >= 80 ? "Consider adding resources to improve SLA compliance." :
                         "Immediate action required to prevent SLA violations."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Planning */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Warehouse className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Capacity Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>
                        {formatNumber(calculation.dailyCapacity, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Daily Capacity</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                        {formatNumber(calculation.capacityUtilization, 1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Utilization</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current vs Capacity</span>
                      <span className="font-medium">{parseInt(orderVolume) || 0} / {calculation.dailyCapacity}</span>
                    </div>
                    <Progress value={calculation.capacityUtilization} className="h-2" />
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-amber-700 dark:text-amber-400">Peak Scenario</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Peak Orders:</span>
                        <span className="ml-1 font-medium">{Math.round((parseInt(orderVolume) || 0) * peakVolumeMultiplier)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Extra Capacity:</span>
                        <span className="ml-1 font-medium">{calculation.peakCapacityNeeded}x</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Labor Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Labor Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-r rounded-lg bg-[var(--ocean)]/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Workers Needed</div>
                        <div className="text-3xl font-bold">{calculation.workersNeeded}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Total Labor Hours</div>
                        <div className="text-xl font-semibold">{formatNumber(calculation.totalLaborHours)}h</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {laborRequirementData.map((item) => (
                      <div key={item.name} className="p-3 bg-muted/30 rounded-lg text-center">
                        <div className="text-xl font-bold" style={{ color: item.fill }}>{item.workers}</div>
                        <div className="text-xs text-muted-foreground">{item.name}</div>
                      </div>
                    ))}
                  </div>

                  {calculation.overtimeHours > 0 && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2">
                        <Timer className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-700 dark:text-red-400">
                          Overtime Required: {formatNumber(calculation.overtimeHours)} hours
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Time Distribution Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <PieChartIcon className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                    Time Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="flex justify-center gap-4 mt-2">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Fulfillment Metrics Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Fulfillment Metrics
                </CardTitle>
                <CardDescription>Key performance indicators for your fulfillment operation</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fulfillmentMetricsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis type="category" dataKey="name" width={100} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" name="Percentage" radius={[0, 4, 4, 0]}>
                        {fulfillmentMetricsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Cost Breakdown
                </CardTitle>
                <CardDescription>Per-order cost distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {costBreakdownData.map((item) => (
                    <div key={item.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Volume Projections Line Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Volume Projections
                </CardTitle>
                <CardDescription>Monthly order volume and capacity analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={volumeProjectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="orders"
                        name="Current Orders"
                        stroke={OCEAN_BLUE}
                        fill={OCEAN_BLUE}
                        fillOpacity={0.3}
                      />
                      <Line
                        type="monotone"
                        dataKey="capacity"
                        name="Capacity"
                        stroke={LOGISTICS_GREEN}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="projected"
                        name="Projected Growth"
                        stroke={CHART_COLORS.amber}
                        strokeWidth={2}
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Radial Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Performance Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={radialData}>
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={10}
                        />
                        <Legend
                          iconSize={10}
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <Award className="h-6 w-6 mx-auto mb-2" style={{ color: OCEAN_BLUE }} />
                      <div className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>{calculation.efficiency}%</div>
                      <div className="text-xs text-muted-foreground">Overall Efficiency</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <Target className="h-6 w-6 mx-auto mb-2" style={{ color: LOGISTICS_GREEN }} />
                      <div className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>{formatNumber(calculation.fulfillmentRate, 1)}%</div>
                      <div className="text-xs text-muted-foreground">Fulfillment Rate</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <Shield className="h-6 w-6 mx-auto mb-2" style={{ color: OCEAN_BLUE }} />
                      <div className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>{formatNumber(calculation.slaCompliance, 1)}%</div>
                      <div className="text-xs text-muted-foreground">SLA Compliance</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <DollarSign className="h-6 w-6 mx-auto mb-2" style={{ color: LOGISTICS_GREEN }} />
                      <div className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>{formatCurrency(calculation.totalCostPerOrder)}</div>
                      <div className="text-xs text-muted-foreground">Cost/Order</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Options */}
        <TabsContent value="options" className="mt-6">
          <div className="space-y-6">
            {/* Fulfillment Model Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Fulfillment Model Comparison
                </CardTitle>
                <CardDescription>Compare different fulfillment strategies for your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.values(fulfillmentModels).map((model) => (
                    <div
                      key={model.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        fulfillmentModel === model.id 
                          ? 'border-[var(--logistics)] bg-[var(--logistics)]/5' 
                          : 'border-border hover:border-border/80'
                      }`}
                      onClick={() => setFulfillmentModel(model.id)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-muted/50" style={{ color: OCEAN_BLUE }}>
                          {model.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold">{model.name}</h4>
                          <div className="text-sm text-muted-foreground">Est. {formatCurrency(model.costPerOrder)}/order</div>
                        </div>
                        {fulfillmentModel === model.id && (
                          <Badge className="ml-auto" style={{ background: LOGISTICS_GREEN }}>Selected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{model.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-green-600 dark:text-green-400">Pros:</span>
                          <ul className="mt-1 space-y-1">
                            {model.pros.slice(0, 2).map((pro, i) => (
                              <li key={i} className="text-muted-foreground flex items-start gap-1">
                                <Check className="h-3 w-3 mt-0.5 text-green-500 shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-red-600 dark:text-red-400">Cons:</span>
                          <ul className="mt-1 space-y-1">
                            {model.cons.slice(0, 2).map((con, i) => (
                              <li key={i} className="text-muted-foreground flex items-start gap-1">
                                <AlertTriangle className="h-3 w-3 mt-0.5 text-red-500 shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-xs text-muted-foreground"><strong>Best for:</strong> {model.bestFor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Cost Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Model Cost Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={Object.values(fulfillmentModels).map(m => ({
                        name: m.name.split(' ')[0],
                        cost: m.costPerOrder,
                        selected: m.id === fulfillmentModel
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" name="Cost/Order ($)" radius={[4, 4, 0, 0]}>
                        {Object.values(fulfillmentModels).map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.id === fulfillmentModel ? LOGISTICS_GREEN : OCEAN_BLUE} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Your estimated annual fulfillment cost:</span>
                    <span className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                      {formatCurrency(selectedModel.costPerOrder * (parseInt(orderVolume) || 0) * 365)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on {parseInt(orderVolume) || 0} orders/day with {selectedModel.name}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="mt-6">
          <div className="space-y-6">
            {/* Understanding Order Fulfillment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Understanding Order Fulfillment
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Order fulfillment represents the complete journey of a product from the moment a customer places an order to the time it arrives at their doorstep. This critical business process encompasses several interconnected stages: receiving and processing orders, picking items from warehouse locations, packing them securely for shipment, and coordinating delivery to the end customer. Each stage presents opportunities for optimization and potential bottlenecks that can impact customer satisfaction and operational costs.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Modern fulfillment operations must balance multiple competing priorities: speed of delivery, accuracy of order picking, cost efficiency, and scalability for demand fluctuations. The rise of e-commerce has dramatically raised customer expectations, with same-day and next-day delivery becoming standard offerings for many retailers. This pressure has driven significant innovation in fulfillment technology, from automated warehouse systems to predictive analytics for demand forecasting. Understanding these dynamics is essential for any business looking to compete in today&apos;s fast-paced retail environment.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  The economics of fulfillment are particularly important for growing businesses. Fixed costs including warehouse space, equipment, and staff must be balanced against variable costs that scale with order volume. Many businesses start with in-house fulfillment for control and cost transparency, then transition to third-party logistics providers as volume grows and operational complexity increases. The key is understanding your specific requirements: order volume, product characteristics, customer expectations, and geographic distribution all influence the optimal fulfillment strategy.
                </p>
              </CardContent>
            </Card>

            {/* Fulfillment Models Explained */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Fulfillment Models Explained
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  The choice of fulfillment model fundamentally shapes your operations, costs, and customer experience. In-house fulfillment provides maximum control but requires significant capital investment and ongoing management attention. You own every aspect of the customer experience, from the moment an order is received until it&apos;s delivered, but you also bear all the risks and responsibilities of warehouse management, staffing, and equipment maintenance.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Third-party logistics providers (3PLs) offer a compelling alternative for businesses seeking scalability without capital investment. A good 3PL partnership provides access to established infrastructure, technology platforms, and logistics expertise. Costs scale with your volume, converting fixed costs into variable ones, and many 3PLs offer multi-location fulfillment that can reduce shipping times and costs. However, you sacrifice some control over the customer experience and must carefully manage the provider relationship.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Dropshipping eliminates inventory handling entirely, allowing businesses to offer wide product selections without warehousing investment. This model works well for testing new products and serving niche markets, but typically results in lower margins and less control over fulfillment quality. Many successful businesses adopt hybrid approaches, using different models for different product categories or sales channels to optimize for specific requirements.
                </p>
              </CardContent>
            </Card>

            {/* Key Metrics to Track */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Key Metrics to Track
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Effective fulfillment management requires tracking and optimizing a comprehensive set of performance indicators. These metrics provide visibility into operational health, identify improvement opportunities, and enable data-driven decision making. Understanding what each metric measures and how it relates to overall business performance is essential for operational excellence.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: OCEAN_BLUE }}>Fulfillment Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      Measures the percentage of orders processed within available capacity. Target 95%+ to ensure healthy headroom for demand variability. Rates below 80% indicate capacity constraints requiring immediate attention.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: LOGISTICS_GREEN }}>SLA Compliance</h4>
                    <p className="text-sm text-muted-foreground">
                      Tracks your ability to meet committed delivery timeframes. Critical for customer satisfaction and B2B relationships. Monitor separately for different service levels and customer segments.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: OCEAN_BLUE }}>Cost Per Order (CPO)</h4>
                    <p className="text-sm text-muted-foreground">
                      Total fulfillment cost divided by order count, including labor, packaging, and shipping. Benchmark against industry standards and track trends over time to identify optimization opportunities.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2" style={{ color: LOGISTICS_GREEN }}>Order Accuracy Rate</h4>
                    <p className="text-sm text-muted-foreground">
                      Percentage of orders shipped without errors. Industry leaders achieve 99.5%+ accuracy. Implement quality checks at pick and pack stages to minimize costly returns and customer complaints.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Rocket className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Optimization Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Fulfillment optimization is a continuous process that combines process improvement, technology adoption, and strategic planning. The goal is to maximize throughput and accuracy while minimizing costs and delivery times. Successful optimization efforts typically address multiple areas simultaneously, recognizing the interconnected nature of fulfillment operations.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Warehouse layout and inventory slotting represent foundational optimization opportunities. By positioning fast-moving items near pack stations and organizing the picking sequence to minimize travel distance, operations can achieve 20-30% improvements in picker productivity. ABC analysis, which categorizes inventory by velocity, provides a framework for strategic slotting decisions that adapt to changing demand patterns.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Technology plays an increasingly important role in fulfillment optimization. Warehouse management systems (WMS) provide real-time visibility into inventory locations and order status, while pick-to-light and voice-directed systems improve accuracy and productivity. Automation, from conveyor systems to robotic picking, offers significant productivity gains for high-volume operations, though careful ROI analysis is essential given the capital investment required.
                </p>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Pro Tips & Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {proTips.map((tip, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-background" style={{ color: index % 2 === 0 ? OCEAN_BLUE : LOGISTICS_GREEN }}>
                          {tip.icon}
                        </div>
                        <h4 className="font-semibold">{tip.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5" style={{ color: CHART_COLORS.rose }} />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commonMistakes.map((mistake, index) => (
                    <div key={index} className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
                          {mistake.icon}
                        </div>
                        <h4 className="font-semibold text-red-700 dark:text-red-400">{mistake.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{mistake.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about order fulfillment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {comprehensiveFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 shrink-0" style={{ color: index % 2 === 0 ? OCEAN_BLUE : LOGISTICS_GREEN }} />
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
