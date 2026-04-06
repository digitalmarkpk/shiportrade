"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Info,
  Route,
  Anchor,
  Gauge,
  TrendingUp,
  Globe,
  Navigation,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Timer,
  RotateCcw,
  Lightbulb,
  XCircle,
  AlertCircle,
  Plane,
  Truck,
  Train,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PORTS, type Port } from "@/lib/constants/ports";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

// Carrier data with transit time factors and reliability
const CARRIERS = [
  { id: "maersk", name: "Maersk", reliability: 92, avgDelay: 1.2, color: "#0F4C81" },
  { id: "msc", name: "MSC", reliability: 88, avgDelay: 1.8, color: "#2E8B57" },
  { id: "cma", name: "CMA CGM", reliability: 90, avgDelay: 1.5, color: "#1E40AF" },
  { id: "cosco", name: "COSCO", reliability: 86, avgDelay: 2.0, color: "#DC2626" },
  { id: "hapag", name: "Hapag-Lloyd", reliability: 91, avgDelay: 1.3, color: "#F97316" },
  { id: "one", name: "ONE", reliability: 89, avgDelay: 1.6, color: "#8B5CF6" },
  { id: "evergreen", name: "Evergreen", reliability: 87, avgDelay: 1.9, color: "#059669" },
  { id: "yangming", name: "Yang Ming", reliability: 85, avgDelay: 2.1, color: "#0EA5E9" },
];

// Service types
const SERVICE_TYPES = [
  { id: "direct", name: "Direct", description: "Non-stop sailing to destination", timeFactor: 1.0 },
  { id: "transshipment", name: "Transshipment", description: "Via intermediate hub port", timeFactor: 1.35 },
];

// Route options via canals
const ROUTE_OPTIONS = [
  { id: "optimal", name: "Optimal Route", description: "Automatically select best route", timeModifier: 0 },
  { id: "suez", name: "Via Suez Canal", description: "Suez Canal route (Europe-Asia)", timeModifier: 0, availability: "Europe-Asia, Asia-Europe" },
  { id: "panama", name: "Via Panama Canal", description: "Panama Canal route (Asia-US East)", timeModifier: 0, availability: "Asia-US East Coast, US West- Europe" },
  { id: "cape", name: "Via Cape of Good Hope", description: "Around Africa (avoids Suez)", timeModifier: 7, availability: "Global" },
];

// Transport modes comparison
const TRANSPORT_MODES = [
  { id: "ocean", name: "Ocean Freight", icon: Ship, speed: "Slow", cost: "Low", reliability: 85, avgDays: 28, color: "#0F4C81" },
  { id: "air", name: "Air Freight", icon: Plane, speed: "Fast", cost: "High", reliability: 95, avgDays: 3, color: "#F59E0B" },
  { id: "rail", name: "Rail Freight", icon: Train, speed: "Medium", cost: "Medium", reliability: 88, avgDays: 14, color: "#8B5CF6" },
  { id: "road", name: "Road Freight", icon: Truck, speed: "Medium", cost: "Medium", reliability: 90, avgDays: 7, color: "#2E8B57" },
];

// Port congestion data (average delay days by region)
const PORT_CONGESTION: Record<string, number> = {
  "Asia": 1.5,
  "Europe": 2.0,
  "North America": 2.5,
  "South America": 1.8,
  "Africa": 1.2,
  "Oceania": 1.0,
  "Middle East": 1.5,
};

// Base transit times between regions (in days)
const BASE_TRANSIT_TIMES: Record<string, Record<string, number>> = {
  "Asia": {
    "Asia": 5,
    "Europe": 28,
    "North America": 14,
    "South America": 30,
    "Africa": 18,
    "Oceania": 12,
    "Middle East": 10,
  },
  "Europe": {
    "Asia": 28,
    "Europe": 4,
    "North America": 12,
    "South America": 18,
    "Africa": 8,
    "Oceania": 35,
    "Middle East": 12,
  },
  "North America": {
    "Asia": 14,
    "Europe": 12,
    "North America": 5,
    "South America": 15,
    "Africa": 20,
    "Oceania": 25,
    "Middle East": 22,
  },
  "South America": {
    "Asia": 30,
    "Europe": 18,
    "North America": 15,
    "South America": 5,
    "Africa": 12,
    "Oceania": 28,
    "Middle East": 20,
  },
  "Africa": {
    "Asia": 18,
    "Europe": 8,
    "North America": 20,
    "South America": 12,
    "Africa": 4,
    "Oceania": 22,
    "Middle East": 8,
  },
  "Oceania": {
    "Asia": 12,
    "Europe": 35,
    "North America": 25,
    "South America": 28,
    "Africa": 22,
    "Oceania": 5,
    "Middle East": 18,
  },
  "Middle East": {
    "Asia": 10,
    "Europe": 12,
    "North America": 22,
    "South America": 20,
    "Africa": 8,
    "Oceania": 18,
    "Middle East": 3,
  },
};

// Pro Tips Data
const PRO_TIPS = [
  {
    icon: Clock,
    title: "Add Buffer Time Strategically",
    description: "Include 10-15% buffer time for inter-continental routes and 20-25% during peak seasons. This accounts for port congestion, weather delays, and customs clearance variations.",
  },
  {
    icon: Route,
    title: "Consider Alternative Routes",
    description: "During canal disruptions or peak seasons, alternative routes via Cape of Good Hope or different port pairs may offer more reliable transit times despite longer distances.",
  },
  {
    icon: Target,
    title: "Monitor Carrier Reliability",
    description: "Choose carriers with 90%+ reliability for time-sensitive cargo. The slight premium is often offset by reduced inventory carrying costs and fewer supply chain disruptions.",
  },
  {
    icon: Calendar,
    title: "Plan for Seasonal Variations",
    description: "Account for monsoon seasons (Jun-Sep in Asia, Nov-Mar in Europe), Chinese New Year factory closures, and pre-holiday shipping peaks when planning transit schedules.",
  },
  {
    icon: Zap,
    title: "Lverage Real-Time Tracking",
    description: "Use carrier APIs and tracking platforms to monitor vessel positions and receive early warnings about potential delays. This enables proactive communication with stakeholders.",
  },
  {
    icon: Globe,
    title: "Understand Port Characteristics",
    description: "Major hub ports offer more frequent services but may have congestion. Smaller ports have less congestion but fewer direct services. Balance these factors based on your priorities.",
  },
];

// Common Mistakes Data
const COMMON_MISTAKES = [
  {
    title: "Underestimating Port Delays",
    description: "Many shippers focus solely on ocean transit time and overlook port handling delays. Port congestion can add 2-7 days to total transit time, especially at high-volume gateway ports during peak seasons. Always factor in realistic port processing times for both origin and destination.",
    severity: "high",
  },
  {
    title: "Ignoring Carrier Schedule Changes",
    description: "Carriers frequently adjust sailing schedules due to demand fluctuations, vessel maintenance, or network optimization. A route that had weekly service may become bi-weekly, effectively doubling waiting time for cargo. Monitor carrier announcements and maintain flexibility in your planning.",
    severity: "high",
  },
  {
    title: "Not Accounting for Transshipment Risks",
    description: "Transshipment routes offer cost savings but introduce multiple failure points. Missing a connection at a hub port can add a week or more to transit time. For critical shipments, prioritize direct services or verify connection times at transshipment hubs.",
    severity: "medium",
  },
  {
    title: "Overlooking Customs Clearance Time",
    description: "Transit time calculations often end at port arrival, but customs clearance can add 1-5 days depending on documentation accuracy, inspection probability, and port efficiency. Build customs clearance time into your total supply chain timeline.",
    severity: "medium",
  },
  {
    title: "Assuming Historical Data Predicts Future",
    description: "Past transit performance doesn't guarantee future results. Global events, regulatory changes, and carrier network restructuring can significantly alter transit times. Use historical data as a baseline but maintain contingency plans for unexpected variations.",
    severity: "low",
  },
];

// Enhanced FAQ Data with 150+ words each
const FAQ_DATA = [
  {
    question: "How is transit time calculated in ocean freight?",
    answer: "Transit time calculation in ocean freight involves multiple components that together determine the total duration from port of origin to port of destination. The base transit time is primarily determined by the nautical distance between ports and the vessel's average speed (typically 18-25 knots for container ships). This base time is then adjusted for various factors including port handling time at both origin and destination (typically 1-3 days each), canal transit times if applicable (Suez Canal adds approximately 12-16 hours, Panama Canal 8-10 hours), transshipment delays at intermediate hubs, and buffer time for potential delays. Modern transit time estimators also factor in carrier-specific performance data, historical route conditions, seasonal weather patterns, and current port congestion levels to provide more accurate predictions.",
  },
  {
    question: "What factors most significantly affect transit time accuracy?",
    answer: "Several key factors can significantly impact the accuracy of transit time estimates. Weather conditions represent the most variable factor - severe storms, hurricanes, and monsoon seasons can add days to voyages and force route deviations. Port congestion has become increasingly critical, with major hubs like Los Angeles, Shanghai, and Rotterdam experiencing wait times of 5-15 days during peak periods. Canal transit delays, particularly at the Suez Canal following recent disruptions, can add 3-7 days unexpectedly. Vessel speed decisions (slow steaming vs. full speed) based on fuel costs and schedule optimization can vary transit by 2-5 days. Additionally, carrier schedule reliability, transshipment connection timing, customs clearance efficiency, and labor disruptions at ports all contribute to transit time variability. The most accurate estimates combine base transit times with real-time data on these factors.",
  },
  {
    question: "How is carrier reliability measured and what does it mean?",
    answer: "Carrier reliability is a critical performance metric that measures the percentage of vessels arriving at their destination ports within a specified window of the scheduled arrival time, typically within 24 hours. This metric is calculated by industry analysts like Sea-Intelligence and Drewry, who track millions of sailings annually. A carrier with 90% reliability means that 90 out of 100 shipments arrive within the expected timeframe. High reliability carriers (90%+) offer more predictable supply chains, allowing for tighter inventory management and reduced safety stock requirements. Reliability is influenced by fleet maintenance, route optimization, port relationships, and operational excellence. Maersk and Hapag-Lloyd consistently rank among the most reliable carriers. When planning shipments, reliability should be factored into lead time calculations - a 90% reliable carrier on a 30-day route may occasionally experience 2-3 day delays, while an 85% reliable carrier might see delays of 4-5 days more frequently.",
  },
  {
    question: "What is the difference between direct and transshipment services?",
    answer: "Direct and transshipment services represent two fundamentally different approaches to ocean freight routing. Direct service means the vessel sails from the origin port directly to the destination port without intermediate cargo handling. This offers the fastest transit time, typically 20-30% faster than alternatives, with lower risk of cargo damage and fewer potential delay points. However, direct services are limited to high-volume port pairs where carriers can fill vessels profitably. Transshipment involves transferring cargo at an intermediate hub port to a different vessel for final delivery. This enables service to more destinations with lower volumes, often at reduced freight costs, but adds 5-10 days to transit time and introduces additional handling risks. Major transshipment hubs include Singapore, Rotterdam, Dubai, and Panama. For time-sensitive cargo, direct service is preferred despite higher costs. For cost-sensitive shipments with flexible timelines, transshipment offers economic advantages with access to more origin-destination combinations.",
  },
  {
    question: "How do canals affect global shipping routes and transit times?",
    answer: "The Suez Canal and Panama Canal are critical chokepoints that dramatically affect global shipping routes and transit times. The Suez Canal, connecting the Mediterranean to the Red Sea, shortens Asia-Europe routes by approximately 7,000 kilometers compared to routing around Africa, saving 10-15 days of transit time. Approximately 12% of global trade passes through Suez, making disruptions highly impactful. The Panama Canal connects the Pacific and Atlantic Oceans, saving Asia-US East Coast routes about 8,000 kilometers and 10-14 days compared to the alternative around Cape Horn. Both canals charge significant tolls but remain economically vital despite these costs. Canal transits also add complexity - vessels must wait for scheduled transit slots, navigate the locks at reduced speeds, and comply with size restrictions (Panamax/Neopanamax for Panama, Suezmax for Suez). Recent disruptions, including the 2021 Ever Given incident at Suez and drought restrictions at Panama, have highlighted the vulnerability of global supply chains to canal-related delays.",
  },
  {
    question: "What is port congestion and how does it impact shipping?",
    answer: "Port congestion occurs when vessel arrivals exceed a port's capacity to handle them efficiently, resulting in ships waiting at anchor for days before berthing. This phenomenon has become increasingly common due to several factors: surges in import volumes, labor shortages, equipment availability issues (chassis, containers), landside transportation bottlenecks, and operational inefficiencies. The impact on shipping is substantial - each day waiting at anchor directly extends transit time, disrupts downstream schedules, and increases costs through demurrage and detention charges. During peak congestion periods, ports like Los Angeles/Long Beach have seen wait times exceed 20 days, effectively doubling transit times from Asia. Port congestion is typically worse at high-volume gateway ports during peak seasons (pre-holiday periods) and can cascade through global networks as delayed vessels arrive late at subsequent ports. Real-time congestion monitoring and route planning that considers alternative ports have become essential strategies for supply chain resilience.",
  },
  {
    question: "How should buffer time be incorporated into transit planning?",
    answer: "Buffer time is a strategic addition to estimated transit times that accounts for variability and uncertainty in shipping operations. Industry best practices suggest adding buffer based on several factors: carrier reliability (lower reliability warrants more buffer), route complexity (transshipment routes need more buffer than direct), time sensitivity of cargo (critical shipments need larger buffers), and seasonal factors (monsoon or typhoon seasons require additional contingency). A common approach is to add 10-15% of the estimated transit time as buffer, or 3-7 days for most routes. For supply chain planning, buffer should be applied differently at various stages: buffer for departure timing allows flexibility in cargo readiness, buffer for transit accommodates delays en route, and buffer for arrival planning covers port delays and customs clearance. Just-in-time inventory systems often underestimate required buffer, leading to stockouts. The optimal buffer balances the cost of extra inventory against the risk and cost of delays - typically calculated through simulation models considering service level requirements and historical delay distributions.",
  },
  {
    question: "What are the trade-offs between different transport modes?",
    answer: "Choosing between ocean, air, rail, and road freight involves balancing speed, cost, reliability, and cargo characteristics. Ocean freight offers the lowest cost per unit but longest transit times (weeks to months), making it ideal for non-urgent, high-volume cargo. Air freight provides fastest transit (days) at highest cost, suitable for time-sensitive, high-value, or perishable goods. Rail freight offers middle-ground pricing and speed, particularly efficient for land-based routes like Asia-Europe (China-Europe Railway Express). Road freight provides door-to-door flexibility and moderate speed, essential for last-mile delivery and regional distribution. Intermodal solutions combine multiple modes - for example, ocean freight followed by rail or truck for inland delivery. Factors influencing mode choice include cargo value density (high-value items favor air), urgency requirements, environmental considerations (ocean has lowest carbon footprint per ton-kilometer), infrastructure availability, and total logistics cost including inventory carrying costs. A comprehensive analysis should consider total delivered cost rather than just freight rates.",
  },
];

interface TransitResult {
  baseTransitDays: number;
  adjustedTransitDays: number;
  originPortDelay: number;
  destinationPortDelay: number;
  totalTransitDays: number;
  departureDate: Date;
  estimatedArrival: Date;
  reliability: number;
  carrier: typeof CARRIERS[0] | null;
  serviceType: typeof SERVICE_TYPES[0];
  route: typeof ROUTE_OPTIONS[0];
  distance: number;
  voyageSpeed: number;
}

export function TransitTimeEstimator() {
  // State
  const [originPort, setOriginPort] = useState<string>("");
  const [destinationPort, setDestinationPort] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("any");
  const [serviceType, setServiceType] = useState<string>("direct");
  const [routeOption, setRouteOption] = useState<string>("optimal");
  const [departureDate, setDepartureDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [bufferDays, setBufferDays] = useState<number>(3);
  const [considerCongestion, setConsiderCongestion] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("calculator");

  // Get port by UN/LOCODE
  const getPortByCode = (code: string): Port | undefined => {
    return PORTS.find((p) => p.unLoCode === code);
  };

  // Get ports by region for dropdown
  const portsByRegion = useMemo(() => {
    const grouped: Record<string, Port[]> = {};
    PORTS.forEach((port) => {
      if (!grouped[port.region]) {
        grouped[port.region] = [];
      }
      grouped[port.region].push(port);
    });
    return grouped;
  }, []);

  // Calculate transit time
  const result = useMemo((): TransitResult | null => {
    if (!originPort || !destinationPort) return null;

    const origin = getPortByCode(originPort);
    const dest = getPortByCode(destinationPort);
    if (!origin || !dest) return null;

    // Get base transit time
    let baseTransitDays = BASE_TRANSIT_TIMES[origin.region]?.[dest.region] || 20;

    // Service type adjustment
    const service = SERVICE_TYPES.find((s) => s.id === serviceType) || SERVICE_TYPES[0];
    const adjustedTransitDays = Math.round(baseTransitDays * service.timeFactor);

    // Port delays
    const originDelay = considerCongestion ? PORT_CONGESTION[origin.region] || 1 : 0;
    const destDelay = considerCongestion ? PORT_CONGESTION[dest.region] || 1 : 0;

    // Route modifier
    const route = ROUTE_OPTIONS.find((r) => r.id === routeOption) || ROUTE_OPTIONS[0];

    // Calculate total
    const totalTransitDays = Math.round(
      adjustedTransitDays + originDelay + destDelay + route.timeModifier + bufferDays
    );

    // Calculate dates
    const departure = new Date(departureDate);
    const arrival = new Date(departure.getTime() + totalTransitDays * 24 * 60 * 60 * 1000);

    // Carrier reliability
    const selectedCarrier = carrier !== "any" ? CARRIERS.find((c) => c.id === carrier) : null;
    const reliability = selectedCarrier?.reliability || 85;

    // Calculate approximate distance (simplified)
    const latDiff = Math.abs(origin.coordinates.lat - dest.coordinates.lat);
    const lngDiff = Math.abs(origin.coordinates.lng - dest.coordinates.lng);
    const distance = Math.round(Math.sqrt(latDiff ** 2 + lngDiff ** 2) * 111 * 1.2); // km

    // Average voyage speed
    const voyageSpeed = Math.round(distance / (adjustedTransitDays * 24));

    return {
      baseTransitDays,
      adjustedTransitDays,
      originPortDelay: originDelay,
      destinationPortDelay: destDelay,
      totalTransitDays,
      departureDate: departure,
      estimatedArrival: arrival,
      reliability,
      carrier: selectedCarrier || null,
      serviceType: service,
      route,
      distance,
      voyageSpeed,
    };
  }, [
    originPort,
    destinationPort,
    carrier,
    serviceType,
    routeOption,
    departureDate,
    bufferDays,
    considerCongestion,
  ]);

  // Timeline data for visualization
  const timelineData = useMemo(() => {
    if (!result || !originPort || !destinationPort) return [];

    const origin = getPortByCode(originPort);
    const dest = getPortByCode(destinationPort);

    return [
      { stage: "Origin Port", days: result.originPortDelay, color: "#0F4C81", icon: "anchor" },
      { stage: "Ocean Transit", days: result.adjustedTransitDays, color: "#2E8B57", icon: "ship" },
      { stage: "Dest. Port", days: result.destinationPortDelay, color: "#F59E0B", icon: "anchor" },
      { stage: "Buffer", days: bufferDays, color: "#8B5CF6", icon: "clock" },
    ];
  }, [result, originPort, destinationPort, bufferDays]);

  // Reliability breakdown
  const reliabilityData = useMemo(() => {
    if (!result) return [];

    return [
      { name: "On-time", value: result.reliability, color: "#2E8B57" },
      { name: "Delayed", value: 100 - result.reliability, color: "#F59E0B" },
    ];
  }, [result]);

  // Carrier comparison data
  const carrierComparisonData = useMemo(() => {
    return CARRIERS.map((c) => ({
      name: c.name,
      reliability: c.reliability,
      avgDelay: c.avgDelay,
      color: c.color,
    }));
  }, []);

  // Transport mode comparison data
  const modeComparisonData = useMemo(() => {
    if (!result) return TRANSPORT_MODES;
    return TRANSPORT_MODES.map((mode) => ({
      ...mode,
      actualDays: mode.id === "ocean" ? result.totalTransitDays : mode.avgDays,
    }));
  }, [result]);

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get reliability color
  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 90) return "text-green-600 dark:text-green-400";
    if (reliability >= 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Get reliability badge
  const getReliabilityBadge = (reliability: number) => {
    if (reliability >= 90) return { label: "Excellent", variant: "default" as const, className: "gradient-logistics text-white" };
    if (reliability >= 80) return { label: "Good", variant: "secondary" as const, className: "" };
    return { label: "Fair", variant: "outline" as const, className: "border-yellow-500 text-yellow-600 dark:text-yellow-400" };
  };

  // Reset form
  const resetForm = () => {
    setOriginPort("");
    setDestinationPort("");
    setCarrier("any");
    setServiceType("direct");
    setRouteOption("optimal");
    setDepartureDate(new Date().toISOString().split("T")[0]);
    setBufferDays(3);
    setConsiderCongestion(true);
  };

  // Export results as JSON
  const exportResults = () => {
    if (!result || !originPort || !destinationPort) return;

    const origin = getPortByCode(originPort);
    const dest = getPortByCode(destinationPort);

    const exportData = {
      generated: new Date().toISOString(),
      route: {
        origin: {
          name: origin?.name,
          country: origin?.country,
          code: originPort,
          region: origin?.region,
          coordinates: origin?.coordinates,
        },
        destination: {
          name: dest?.name,
          country: dest?.country,
          code: destinationPort,
          region: dest?.region,
          coordinates: dest?.coordinates,
        },
        distance: result.distance,
      },
      transit: {
        totalDays: result.totalTransitDays,
        baseTransitDays: result.baseTransitDays,
        adjustedTransitDays: result.adjustedTransitDays,
        breakdown: {
          originPortDelay: result.originPortDelay,
          oceanTransit: result.adjustedTransitDays,
          destinationPortDelay: result.destinationPortDelay,
          bufferDays: bufferDays,
        },
      },
      schedule: {
        departureDate: result.departureDate.toISOString(),
        estimatedArrival: result.estimatedArrival.toISOString(),
      },
      service: {
        type: result.serviceType.name,
        route: result.route.name,
        carrier: result.carrier?.name || "Any Carrier",
        reliability: result.reliability,
        averageSpeed: result.voyageSpeed,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transit-estimate-${originPort}-${destinationPort}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share results
  const shareResults = async () => {
    if (!result || !originPort || !destinationPort) return;

    const origin = getPortByCode(originPort);
    const dest = getPortByCode(destinationPort);

    const shareText = `Transit Time: ${origin?.name} → ${dest?.name}
📊 ${result.totalTransitDays} days total transit
📅 Departure: ${formatDate(result.departureDate)}
🎯 Arrival: ${formatDate(result.estimatedArrival)}
✅ ${result.reliability}% reliability
🚢 ~${result.distance.toLocaleString()} km distance

Calculated with Shiportrade Transit Time Estimator`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Transit Time Estimate",
          text: shareText,
        });
      } catch {
        navigator.clipboard.writeText(shareText);
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  // Animated badge variants
  const badgeVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="space-y-8">
      {/* Hero Section with Animated Badges */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 p-8 border border-border/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              {/* Animated Badges */}
              <motion.div
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-2 mb-4"
              >
                {["Transit Planning", "Route Analysis", "Delivery Estimates"].map((badge, i) => (
                  <motion.div
                    key={badge}
                    custom={i}
                    variants={badgeVariants}
                  >
                    <Badge className="bg-[var(--ocean)]/10 hover:bg-[var(--ocean)]/20 text-[var(--ocean)] dark:text-[var(--ocean-light)] border border-[var(--ocean)]/20 transition-all duration-300">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] bg-clip-text text-transparent">
                Transit Time Estimator
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Calculate accurate ocean freight transit times between global ports with carrier reliability
                data, route optimization, and comprehensive delay factors.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="border-border/50 hover:border-[var(--ocean)]/50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportResults}
                disabled={!result}
                className="border-border/50 hover:border-[var(--logistics)]/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareResults}
                disabled={!result}
                className="border-border/50 hover:border-[var(--logistics)]/50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="grid grid-cols-3 gap-4 mt-6"
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="h-5 w-5 text-[var(--ocean)]" />
                  <span className="text-sm text-muted-foreground">Transit Days</span>
                </div>
                <div className="text-3xl font-bold text-foreground">{result.totalTransitDays}</div>
                <div className="text-xs text-muted-foreground mt-1">total estimated</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Route className="h-5 w-5 text-[var(--logistics)]" />
                  <span className="text-sm text-muted-foreground">Distance</span>
                </div>
                <div className="text-3xl font-bold text-foreground">{result.distance.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">kilometers</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-5 w-5 text-amber-500" />
                  <span className="text-sm text-muted-foreground">Reliability</span>
                </div>
                <div className="text-3xl font-bold text-foreground">{result.reliability}%</div>
                <div className="text-xs text-muted-foreground mt-1">on-time probability</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Ship className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Routes</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              {/* Route Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                    Route Selection
                  </CardTitle>
                  <CardDescription>
                    Select origin and destination ports for transit time estimation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Origin Port */}
                  <div className="space-y-2">
                    <Label>Origin Port</Label>
                    <Select value={originPort} onValueChange={setOriginPort}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin port" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {Object.entries(portsByRegion).map(([region, ports]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                              {region}
                            </div>
                            {ports.map((port) => (
                              <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                {port.name}, {port.country} ({port.unLoCode})
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    {originPort && (
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {getPortByCode(originPort)?.region}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getPortByCode(originPort)?.throughput || "N/A"}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const temp = originPort;
                        setOriginPort(destinationPort);
                        setDestinationPort(temp);
                      }}
                      className="rounded-full hover:bg-[var(--ocean)]/10"
                      disabled={!originPort && !destinationPort}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Destination Port */}
                  <div className="space-y-2">
                    <Label>Destination Port</Label>
                    <Select value={destinationPort} onValueChange={setDestinationPort}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination port" />
                      </SelectTrigger>
                      <SelectContent className="max-h-80">
                        {Object.entries(portsByRegion).map(([region, ports]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground bg-muted/50">
                              {region}
                            </div>
                            {ports.map((port) => (
                              <SelectItem key={port.unLoCode} value={port.unLoCode}>
                                {port.name}, {port.country} ({port.unLoCode})
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    {destinationPort && (
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {getPortByCode(destinationPort)?.region}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getPortByCode(destinationPort)?.throughput || "N/A"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Service Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5 text-[var(--logistics)]" />
                    Service Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service Type */}
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div>
                              <div className="font-medium">{type.name}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Carrier Selection */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Carrier (Optional)</Label>
                      <span className="text-xs text-muted-foreground">Affects reliability score</span>
                    </div>
                    <Select value={carrier} onValueChange={setCarrier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Carrier</SelectItem>
                        {CARRIERS.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: c.color }}
                              />
                              <span>{c.name}</span>
                              <Badge variant="secondary" className="text-xs ml-auto">
                                {c.reliability}% reliable
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Route Option */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Route Option</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Choose specific canal routes or let the system select the optimal path</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Select value={routeOption} onValueChange={setRouteOption}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROUTE_OPTIONS.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            <div>
                              <div className="font-medium">{route.name}</div>
                              <div className="text-xs text-muted-foreground">{route.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[var(--ocean)]" />
                    Schedule & Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Departure Date */}
                  <div className="space-y-2">
                    <Label htmlFor="departure">Departure Date</Label>
                    <Input
                      id="departure"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {/* Buffer Days */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Buffer Days: {bufferDays}</Label>
                      <span className="text-xs text-muted-foreground">For customs & handling</span>
                    </div>
                    <Slider
                      value={[bufferDays]}
                      onValueChange={(v) => setBufferDays(v[0])}
                      min={0}
                      max={14}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 days</span>
                      <span>7 days</span>
                      <span>14 days</span>
                    </div>
                  </div>

                  {/* Port Congestion Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Consider Port Congestion</Label>
                      <p className="text-xs text-muted-foreground">
                        Add average port delays by region
                      </p>
                    </div>
                    <Switch
                      checked={considerCongestion}
                      onCheckedChange={setConsiderCongestion}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Main Result Card */}
                  <Card className="border-2 border-[var(--ocean)]/20">
                    <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[var(--ocean)]" />
                        Transit Time Estimate
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {getPortByCode(originPort)?.name} → {getPortByCode(destinationPort)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {/* Total Transit Time */}
                      <div className="text-center mb-6">
                        <div className="text-6xl font-bold bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] bg-clip-text text-transparent">
                          {result.totalTransitDays}
                        </div>
                        <div className="text-lg text-muted-foreground mt-1">Total Transit Days</div>
                      </div>

                      {/* Date Range */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-muted/30 text-center">
                          <div className="text-sm text-muted-foreground mb-1">Departure</div>
                          <div className="font-medium">{formatDate(result.departureDate)}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-[var(--logistics)]/10 text-center">
                          <div className="text-sm text-muted-foreground mb-1">Estimated Arrival</div>
                          <div className="font-medium text-[var(--logistics)]">
                            {formatDate(result.estimatedArrival)}
                          </div>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Transit Breakdown */}
                      <div className="space-y-3">
                        <div className="text-sm font-medium mb-2">Transit Breakdown</div>
                        {timelineData.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm">{item.stage}</span>
                            </div>
                            <Badge variant="secondary">{item.days} days</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Reliability */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                        Service Reliability
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className={`text-3xl font-bold ${getReliabilityColor(result.reliability)}`}>
                            {result.reliability}%
                          </div>
                          <div className="text-sm text-muted-foreground">On-time probability</div>
                        </div>
                        <Badge
                          variant={getReliabilityBadge(result.reliability).variant}
                          className={getReliabilityBadge(result.reliability).className}
                        >
                          {getReliabilityBadge(result.reliability).label}
                        </Badge>
                      </div>
                      <Progress value={result.reliability} className="h-2 mb-4" />
                      {result.carrier && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: result.carrier.color }}
                            />
                            <span className="font-medium">{result.carrier.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Avg. delay: {result.carrier.avgDelay} days
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Route Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center">
                            <Route className="h-5 w-5 text-[var(--ocean)]" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold">
                              {result.distance.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">km distance</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--logistics)]/10 flex items-center justify-center">
                            <Gauge className="h-5 w-5 text-[var(--logistics)]" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold">{result.voyageSpeed}</div>
                            <div className="text-sm text-muted-foreground">km/h avg speed</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Ship className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <div className="text-lg font-medium text-muted-foreground">
                      Select ports to calculate transit time
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Choose an origin and destination port from the dropdown menus
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Time Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--ocean)]" />
                  Time Breakdown by Segment
                </CardTitle>
                <CardDescription>Distribution of transit time components</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={timelineData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={4}
                          dataKey="days"
                          label={({ stage, days }) => `${stage}: ${days}d`}
                          labelLine
                        >
                          {timelineData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          formatter={(value: number) => [`${value} days`, "Duration"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    Select ports to view time breakdown
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mode Comparison Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[var(--logistics)]" />
                  Transport Mode Comparison
                </CardTitle>
                <CardDescription>Compare transit times across transport modes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={modeComparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" className="text-xs" height={60} />
                      <YAxis unit=" days" className="text-sm" />
                      <Legend />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="actualDays" name="Transit Days" radius={[4, 4, 0, 0]}>
                        {modeComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Visualization */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-[var(--ocean)]" />
                  Transit Timeline Visualization
                </CardTitle>
                <CardDescription>Visual journey from origin to destination</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Timeline Progress Bar */}
                    <div className="relative">
                      <div className="h-4 bg-muted rounded-full overflow-hidden flex">
                        {timelineData.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.days / result.totalTransitDays) * 100}%` }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="h-full"
                            style={{ backgroundColor: item.color }}
                          />
                        ))}
                      </div>
                      {/* Timeline markers */}
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>Day 0</span>
                        <span>Day {Math.round(result.totalTransitDays / 2)}</span>
                        <span>Day {result.totalTransitDays}</span>
                      </div>
                    </div>

                    {/* Timeline Stages */}
                    <div className="grid grid-cols-4 gap-4">
                      {timelineData.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative"
                        >
                          <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                            <div
                              className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: item.color }}
                            >
                              {idx + 1}
                            </div>
                            <div className="font-medium text-sm">{item.stage}</div>
                            <div className="text-2xl font-bold mt-1" style={{ color: item.color }}>
                              {item.days}
                            </div>
                            <div className="text-xs text-muted-foreground">days</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Route Summary */}
                    <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Anchor className="h-5 w-5 text-[var(--ocean)]" />
                          <span className="font-medium">{getPortByCode(originPort)?.name}</span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-[var(--logistics)]" />
                          <span className="font-medium">{getPortByCode(destinationPort)?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Select ports to view timeline
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Route Map Placeholder */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[var(--logistics)]" />
                  Route Visualization
                </CardTitle>
                <CardDescription>Visual representation of shipping route</CardDescription>
              </CardHeader>
              <CardContent>
                {originPort && destinationPort && result ? (
                  <div className="relative h-64 bg-gradient-to-b from-[var(--ocean)]/5 to-[var(--ocean)]/20 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-16 w-16 text-[var(--ocean)]/20 mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm">Route visualization</p>
                        <p className="text-xs text-muted-foreground">
                          {getPortByCode(originPort)?.coordinates.lat.toFixed(2)}°,
                          {getPortByCode(originPort)?.coordinates.lng.toFixed(2)}° →
                          {getPortByCode(destinationPort)?.coordinates.lat.toFixed(2)}°,
                          {getPortByCode(destinationPort)?.coordinates.lng.toFixed(2)}°
                        </p>
                      </div>
                    </div>

                    <svg className="absolute inset-0 w-full h-full">
                      <defs>
                        <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--ocean)" />
                          <stop offset="100%" stopColor="var(--logistics)" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M 60 120 Q 200 30 340 120"
                        fill="none"
                        stroke="url(#routeGradient)"
                        strokeWidth="3"
                        strokeDasharray="8 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </svg>

                    <div className="absolute left-8 top-1/2 -translate-y-1/2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="relative"
                      >
                        <div className="w-8 h-8 rounded-full bg-[var(--ocean)] flex items-center justify-center text-white shadow-lg">
                          <Anchor className="h-4 w-4" />
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
                          <span className="text-xs font-medium">{getPortByCode(originPort)?.name}</span>
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute right-8 top-1/2 -translate-y-1/2">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 }}
                        className="relative"
                      >
                        <div className="w-8 h-8 rounded-full bg-[var(--logistics)] flex items-center justify-center text-white shadow-lg">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap">
                          <span className="text-xs font-medium">{getPortByCode(destinationPort)?.name}</span>
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <Badge variant="secondary" className="text-sm">
                        ~{result.distance.toLocaleString()} km
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Select ports to view route
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Route Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-[var(--ocean)]" />
                  Canal Route Options
                </CardTitle>
                <CardDescription>Major shipping canals and their impact on transit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ROUTE_OPTIONS.filter((r) => r.id !== "optimal").map((route) => (
                    <div
                      key={route.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        routeOption === route.id
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                          : "hover:border-[var(--ocean)]/50 border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{route.name}</span>
                        {route.timeModifier > 0 && (
                          <Badge variant="secondary">+{route.timeModifier} days</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{route.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Best for:</strong> {route.availability}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Port Congestion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Port Congestion by Region
                </CardTitle>
                <CardDescription>Average delay days at major ports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(PORT_CONGESTION).map(([region, delay]) => ({
                        region,
                        delay,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="region" angle={-45} textAnchor="end" className="text-xs" height={60} />
                      <YAxis unit=" days" className="text-sm" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value} days`, "Avg. Delay"]}
                      />
                      <Bar dataKey="delay" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Regional Transit Times */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[var(--logistics)]" />
                  Regional Transit Time Matrix
                </CardTitle>
                <CardDescription>Base transit times between regions (days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2 bg-muted/50">From / To</th>
                        {Object.keys(BASE_TRANSIT_TIMES).map((region) => (
                          <th key={region} className="text-center p-2 bg-muted/50 min-w-[80px]">
                            {region.split(" ")[0]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(BASE_TRANSIT_TIMES).map(([fromRegion, destinations]) => (
                        <tr key={fromRegion} className="border-b border-border hover:bg-muted/30">
                          <td className="p-2 font-medium">{fromRegion}</td>
                          {Object.keys(BASE_TRANSIT_TIMES).map((toRegion) => (
                            <td
                              key={toRegion}
                              className={`text-center p-2 ${
                                fromRegion === toRegion
                                  ? "bg-muted/50 text-muted-foreground"
                                  : ""
                              }`}
                            >
                              {destinations[toRegion] || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide">
          <div className="space-y-8">
            {/* Understanding Transit Times */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding Transit Times
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  Transit time in ocean freight represents the total duration from when cargo is loaded onto a vessel at the origin port until it is discharged at the destination port. This metric is fundamental to supply chain planning, inventory management, and customer service commitments. Understanding the components that make up transit time enables logistics professionals to make informed decisions about routing, carrier selection, and contingency planning. Accurate transit time estimation requires consideration of multiple variables including vessel speed, route distance, port efficiency, and potential disruptions.
                </p>
                <p className="text-muted-foreground mt-4">
                  The transit time equation extends beyond simple sailing duration. Port handling times at both origin and destination typically add 2-6 days to the total journey, depending on port congestion and terminal efficiency. Canal transits, when applicable, add both waiting time and passage time. Weather routing decisions by carriers can extend or shorten routes based on conditions. All these factors must be considered when planning supply chain timelines and setting customer expectations for delivery dates.
                </p>
              </CardContent>
            </Card>

            {/* Factors Affecting Transit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Factors Affecting Transit
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  Multiple interconnected factors influence the accuracy and variability of transit time estimates. Weather conditions represent the most unpredictable variable, with severe storms potentially adding days to voyages and forcing vessels to take longer alternate routes. Seasonal patterns such as monsoon seasons in Asia and hurricane seasons in the Atlantic create predictable periods of increased transit time variability. Port congestion has emerged as a critical factor in recent years, with major gateway ports experiencing unprecedented wait times during peak demand periods.
                </p>
                <p className="text-muted-foreground mt-4">
                  Carrier operational decisions significantly impact transit times. Slow steaming, implemented to reduce fuel consumption and costs, adds days to transit times compared to full-speed sailing. Schedule optimization may result in vessels waiting at ports to maintain weekly service frequencies. Vessel sharing agreements between carriers can lead to different transit times on the same route depending on which carrier operates the specific sailing. Understanding these operational factors helps in interpreting carrier schedules and building realistic transit time expectations.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  {[
                    { title: "Weather Patterns", desc: "Storms, monsoons, and seasonal conditions can extend voyages by 2-5 days" },
                    { title: "Port Congestion", desc: "High-volume ports may have vessel queues adding 1-7 days to transit" },
                    { title: "Canal Transit", desc: "Suez and Panama canals add waiting time and passage complexity" },
                    { title: "Vessel Speed", desc: "Slow steaming vs. full speed can vary transit by 3-5 days" },
                  ].map((factor, idx) => (
                    <div key={idx} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <div className="font-medium text-foreground">{factor.title}</div>
                      <p className="text-sm text-muted-foreground mt-1">{factor.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Planning for Delays */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--ocean)]" />
                  Planning for Delays
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  Effective delay planning begins with acknowledging that variability is inherent in ocean freight. Rather than treating transit times as fixed values, supply chain professionals should work with ranges and probabilities. This approach involves calculating expected transit times with appropriate buffer, understanding the probability distribution of delays, and having contingency plans for significant deviations. The goal is not to eliminate delays but to manage their impact on the supply chain effectively.
                </p>
                <p className="text-muted-foreground mt-4">
                  Buffer time allocation should be strategic rather than uniform. Routes with transshipment require more buffer than direct services due to connection risks. Carrier reliability scores should influence buffer allocation, with lower reliability carriers warranting additional contingency. Seasonal factors must be considered, with higher buffers during peak seasons and weather-volatile periods. The cost of buffer time must be balanced against inventory carrying costs and service level requirements to determine optimal allocation.
                </p>
              </CardContent>
            </Card>

            {/* Mode Selection Strategies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[var(--logistics)]" />
                  Mode Selection Strategies
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-muted-foreground">
                  Choosing between transport modes involves balancing multiple factors including speed, cost, reliability, and cargo characteristics. Ocean freight offers the lowest cost per unit but longest transit times, making it ideal for high-volume, non-urgent cargo where inventory carrying costs are manageable. Air freight provides rapid transit at premium rates, appropriate for time-sensitive, high-value, or perishable goods. The value density of cargo often determines the optimal mode, with high-value items better able to absorb air freight costs.
                </p>
                <p className="text-muted-foreground mt-4">
                  Intermodal solutions increasingly offer attractive middle-ground options. Rail freight provides moderate speed and cost, particularly efficient for long-distance land movements such as China-Europe routes. Road freight offers door-to-door flexibility essential for last-mile delivery. Many supply chains employ multimodal strategies, using ocean freight for the primary leg and air or road for final delivery to balance cost and service. The optimal mode selection considers total delivered cost, transit time requirements, cargo characteristics, and supply chain resilience needs.
                </p>
                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  {TRANSPORT_MODES.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <div key={mode.id} className="p-4 bg-muted/30 rounded-lg border border-border/50 text-center">
                        <Icon className="h-8 w-8 mx-auto mb-2" style={{ color: mode.color }} />
                        <div className="font-medium text-foreground">{mode.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {mode.avgDays} days avg
                        </div>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {mode.reliability}% reliable
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Transit Time Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PRO_TIPS.map((tip, idx) => {
                    const Icon = tip.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-[var(--ocean)]/50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-[var(--ocean)]" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{tip.title}</div>
                            <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {COMMON_MISTAKES.map((mistake, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        mistake.severity === "high"
                          ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                          : mistake.severity === "medium"
                          ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                          : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className={`h-5 w-5 shrink-0 ${
                          mistake.severity === "high"
                            ? "text-red-500"
                            : mistake.severity === "medium"
                            ? "text-amber-500"
                            : "text-yellow-500"
                        }`} />
                        <div>
                          <div className="font-medium text-foreground">{mistake.title}</div>
                          <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about transit time estimation and ocean freight planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {FAQ_DATA.map((faq, index) => (
                  <Collapsible
                    key={index}
                    open={expandedFaq === index}
                    onOpenChange={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-4 h-auto text-left hover:bg-muted/50"
                      >
                        <span className="font-medium text-base">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
