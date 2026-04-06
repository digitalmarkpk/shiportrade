"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Plane,
  Truck,
  Train,
  Clock,
  DollarSign,
  Leaf,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Gauge,
  Package,
  RefreshCw,
  Route,
  Zap,
  ArrowLeftRight,
  BarChart3,
  PieChart as PieChartIcon,
  HelpCircle,
  Sparkles,
  Target,
  Shield,
  Globe,
  ChevronDown,
  Calculator,
  LineChart,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface TransportMode {
  id: string;
  name: string;
  icon: React.ElementType;
  speed: number;
  costPerKg: number;
  co2PerKg: number;
  reliability: number;
  capacity: string;
  avgDelay: number;
  minWeight: number;
  maxWeight: number;
}

interface ModalResult {
  mode: string;
  modeName: string;
  cost: number;
  time: number;
  co2: number;
  reliability: number;
  score: number;
  costPerKg: number;
  timePerKm: number;
  recommendations: string[];
  advantages: string[];
  disadvantages: string[];
}

interface ComparisonResult {
  results: ModalResult[];
  bestValue: string;
  fastestMode: string;
  greenestMode: string;
  totalSavings: number;
  co2Reduction: number;
  summary: {
    origin: string;
    destination: string;
    distance: number;
    weight: number;
    value: number;
  };
}

const transportModes: TransportMode[] = [
  {
    id: "ocean",
    name: "Ocean Freight",
    icon: Ship,
    speed: 25,
    costPerKg: 0.02,
    co2PerKg: 0.015,
    reliability: 92,
    capacity: "Unlimited",
    avgDelay: 2,
    minWeight: 100,
    maxWeight: 10000000,
  },
  {
    id: "air",
    name: "Air Freight",
    icon: Plane,
    speed: 800,
    costPerKg: 3.5,
    co2PerKg: 0.5,
    reliability: 97,
    capacity: "Up to 100 tons/flight",
    avgDelay: 0.5,
    minWeight: 1,
    maxWeight: 100000,
  },
  {
    id: "rail",
    name: "Rail Freight",
    icon: Train,
    speed: 50,
    costPerKg: 0.04,
    co2PerKg: 0.03,
    reliability: 88,
    capacity: "Up to 3000 tons/train",
    avgDelay: 1,
    minWeight: 500,
    maxWeight: 3000000,
  },
  {
    id: "road",
    name: "Road Freight",
    icon: Truck,
    speed: 60,
    costPerKg: 0.08,
    co2PerKg: 0.08,
    reliability: 90,
    capacity: "Up to 25 tons/truck",
    avgDelay: 0.5,
    minWeight: 50,
    maxWeight: 25000,
  },
];

const tradeRoutes = [
  { origin: "Shanghai, CN", destination: "Rotterdam, NL", distance: 10800, popular: "ocean" },
  { origin: "Shenzhen, CN", destination: "Los Angeles, US", distance: 11500, popular: "ocean" },
  { origin: "Frankfurt, DE", destination: "New York, US", distance: 6200, popular: "air" },
  { origin: "Shanghai, CN", destination: "Hamburg, DE", distance: 11000, popular: "rail" },
  { origin: "London, UK", destination: "Paris, FR", distance: 460, popular: "road" },
  { origin: "Chicago, US", destination: "Los Angeles, US", distance: 2800, popular: "rail" },
];

const COLORS = {
  oceanBlue: "#0F4C81",
  logisticsGreen: "#2E8B57",
  amber: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
};

const faqData = [
  {
    question: "What is modal shift and why is it important?",
    answer: "Modal shift refers to changing from one mode of transport to another (e.g., from road to rail, or air to ocean). It's important because it can significantly reduce costs, lower carbon emissions, and improve supply chain resilience. Companies often pursue modal shift strategies to meet sustainability goals while optimizing operational costs.",
  },
  {
    question: "When should I consider switching from air to ocean freight?",
    answer: "Consider air to ocean shift when: (1) Your cargo has low value-to-weight ratio, (2) Transit time is not critical (15-40 days acceptable), (3) You want to reduce costs by 80-90%, (4) You're shipping large volumes (>1 ton), (5) Sustainability is a priority. The break-even point is typically when inventory carrying costs plus ocean freight are lower than air freight costs.",
  },
  {
    question: "How do I calculate the true cost of modal shift?",
    answer: "The true cost includes: (1) Direct transportation costs, (2) Inventory carrying costs during longer transit, (3) Warehousing costs, (4) Insurance premiums (higher for longer transit), (5) Potential stockout costs, (6) Administrative costs for mode coordination. Use our calculator to compare total landed costs across modes.",
  },
  {
    question: "What is intermodal transportation and when should I use it?",
    answer: "Intermodal transportation uses multiple modes (e.g., truck + rail + ship) in a single journey without handling the cargo during mode changes. Use it when: (1) Origin/destination aren't near ports, (2) You want to combine flexibility of truck with efficiency of rail/ocean, (3) Door-to-door service is needed, (4) You want to optimize cost-time trade-offs. Containers are ideal for intermodal transport.",
  },
  {
    question: "How do carbon emissions compare across transport modes?",
    answer: "Carbon emissions per ton-kilometer vary significantly: Ocean freight emits ~10-15g CO2, Rail ~20-30g, Road ~60-80g, Air ~500-600g. Ocean freight is 30-50x cleaner than air freight per ton-km. For a 10,000 km journey with 15 tons cargo: Ocean ~2,250 kg CO2, Rail ~4,500 kg, Road ~12,000 kg, Air ~75,000 kg.",
  },
  {
    question: "What factors affect freight mode reliability?",
    answer: "Key reliability factors include: (1) Weather conditions (storms, fog affect air/sea), (2) Port/airport congestion, (3) Labor strikes, (4) Customs clearance delays, (5) Infrastructure quality, (6) Carrier network coverage. Air freight typically has 95-98% reliability, Ocean 90-95%, Rail 85-92%, Road 88-95%. Buffer time should be added based on route-specific risks.",
  },
  {
    question: "How can I optimize my supply chain using modal shift?",
    answer: "Optimization strategies include: (1) Segment products by urgency - use faster modes only for time-sensitive items, (2) Use slower modes for high-volume, low-value goods, (3) Implement nearshoring to reduce distances, (4) Use consolidation centers for multi-modal optimization, (5) Consider transloading facilities at key hubs, (6) Partner with 3PLs specializing in intermodal solutions.",
  },
  {
    question: "What are the hidden costs of each transport mode?",
    answer: "Hidden costs include: Ocean - demurrage/detention ($100-300/day), port congestion surcharges, documentary compliance; Air - fuel surcharges (variable), security fees, handling fees; Rail - intermodal transfer costs, last-mile trucking, railcar detention; Road - driver overtime, tolls, empty return miles, detention at docks. Always request all-inclusive quotes to compare accurately.",
  },
];

export default function ModalShiftComparator() {
  const [origin, setOrigin] = useState("Shanghai, CN");
  const [destination, setDestination] = useState("Rotterdam, NL");
  const [distance, setDistance] = useState("10800");
  const [cargoWeight, setCargoWeight] = useState("15000");
  const [cargoValue, setCargoValue] = useState("250000");
  const [cargoType, setCargoType] = useState("general");
  const [urgency, setUrgency] = useState("standard");
  const [sustainabilityPriority, setSustainabilityPriority] = useState("medium");

  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  const calculateModalShift = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const dist = parseFloat(distance) || 10800;
      const weight = parseFloat(cargoWeight) || 15000;
      const value = parseFloat(cargoValue) || 250000;

      const results: ModalResult[] = transportModes.map((mode) => {
        const time = dist / mode.speed + mode.avgDelay;
        const cost = weight * mode.costPerKg * (dist / 1000);
        const co2 = weight * mode.co2PerKg * (dist / 1000);

        let urgencyMultiplier = 1;
        if (urgency === "urgent") {
          urgencyMultiplier = mode.id === "air" ? 0.9 : 1.1;
        } else if (urgency === "economy") {
          urgencyMultiplier = mode.id === "ocean" ? 0.85 : 1.05;
        }

        const costScore = 100 - (cost / 50000) * 10;
        const timeScore = 100 - time * 2;
        const ecoScore = 100 - co2 / 100;
        const reliabilityScore = mode.reliability;

        let score = (costScore * 0.3 + timeScore * 0.3 + ecoScore * 0.2 + reliabilityScore * 0.2);

        if (urgency === "urgent") {
          score = costScore * 0.15 + timeScore * 0.45 + ecoScore * 0.1 + reliabilityScore * 0.3;
        } else if (urgency === "economy") {
          score = costScore * 0.45 + timeScore * 0.15 + ecoScore * 0.25 + reliabilityScore * 0.15;
        }

        if (sustainabilityPriority === "high") {
          score = score * 0.9 + ecoScore * 0.1;
        }

        const isWeightFeasible = weight >= mode.minWeight && weight <= mode.maxWeight;

        const recommendations: string[] = [];
        const advantages: string[] = [];
        const disadvantages: string[] = [];

        if (mode.id === "ocean") {
          advantages.push("Lowest cost per kg", "High capacity availability", "Ideal for bulk cargo");
          disadvantages.push("Longest transit time", "Less schedule flexibility", "Port congestion risks");
          if (value / weight > 50) {
            recommendations.push("Consider air freight for high-value items");
          }
        } else if (mode.id === "air") {
          advantages.push("Fastest transit time", "High security", "Global reach");
          disadvantages.push("Highest cost", "Weight restrictions", "Limited capacity");
          if (weight > 50000) {
            recommendations.push("Weight may exceed typical air cargo limits");
          }
        } else if (mode.id === "rail") {
          advantages.push("Cost-effective for land routes", "Lower emissions than road", "Reliable schedules");
          disadvantages.push("Limited routes", "Fixed schedules", "Intermodal handling required");
          if (dist < 3000) {
            recommendations.push("Rail is most efficient for distances over 3000km");
          }
        } else if (mode.id === "road") {
          advantages.push("Door-to-door service", "Flexible scheduling", "Short distances efficient");
          disadvantages.push("Emissions per kg higher", "Traffic delays", "Driver regulations");
          if (dist > 2000) {
            recommendations.push("Consider rail or intermodal for longer distances");
          }
        }

        if (!isWeightFeasible) {
          disadvantages.push("Weight outside optimal range");
        }

        return {
          mode: mode.id,
          modeName: mode.name,
          cost: Math.round(cost * urgencyMultiplier),
          time: Math.round(time * 10) / 10,
          co2: Math.round(co2),
          reliability: mode.reliability,
          score: Math.round(score * 10) / 10,
          costPerKg: Math.round(mode.costPerKg * 1000) / 1000,
          timePerKm: Math.round((24 / mode.speed) * 100) / 100,
          recommendations,
          advantages,
          disadvantages,
        };
      });

      const sortedByScore = [...results].sort((a, b) => b.score - a.score);
      const sortedByTime = [...results].sort((a, b) => a.time - b.time);
      const sortedByCO2 = [...results].sort((a, b) => a.co2 - b.co2);

      const bestValue = sortedByScore[0].modeName;
      const fastestMode = sortedByTime[0].modeName;
      const greenestMode = sortedByCO2[0].modeName;

      const lowestCost = Math.min(...results.map((r) => r.cost));
      const averageCost = results.reduce((sum, r) => sum + r.cost, 0) / results.length;
      const totalSavings = averageCost - lowestCost;

      const lowestCO2 = Math.min(...results.map((r) => r.co2));
      const highestCO2 = Math.max(...results.map((r) => r.co2));
      const co2Reduction = highestCO2 - lowestCO2;

      const comparisonResult: ComparisonResult = {
        results,
        bestValue,
        fastestMode,
        greenestMode,
        totalSavings,
        co2Reduction,
        summary: {
          origin,
          destination,
          distance: dist,
          weight,
          value,
        },
      };

      setResult(comparisonResult);
      setIsCalculating(false);
      setActiveTab("comparison");
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 0) => {
    return value.toLocaleString("en-US", { maximumFractionDigits: decimals });
  };

  const ModeIcon = ({ mode }: { mode: string }) => {
    const found = transportModes.find((m) => m.id === mode);
    if (!found) return null;
    const Icon = found.icon;
    return <Icon className="h-5 w-5" />;
  };

  const chartData = useMemo(() => result?.results.map((r) => ({
    name: r.modeName.split(" ")[0],
    cost: r.cost,
    time: r.time,
    co2: r.co2 / 10,
    score: r.score,
  })) || [], [result]);

  const radarData = useMemo(() => result?.results.map((r) => ({
    mode: r.modeName.split(" ")[0],
    cost: Math.min(100, r.cost / 100),
    time: Math.max(0, 100 - r.time),
    reliability: r.reliability,
    sustainability: Math.max(0, 100 - r.co2 / 50),
  })) || [], [result]);

  const pieData = useMemo(() => result?.results.map((r, index) => ({
    name: r.modeName.split(" ")[0],
    value: r.cost,
    co2: r.co2,
    fill: [COLORS.oceanBlue, COLORS.logisticsGreen, COLORS.amber, COLORS.red][index],
  })) || [], [result]);

  const timelineData = useMemo(() => {
    if (!result) return [];
    return result.results.map((r) => ({
      name: r.modeName.split(" ")[0],
      time: r.time,
      co2: r.co2 / 100,
      cost: r.cost / 1000,
    }));
  }, [result]);

  const radarChartData = useMemo(() => {
    if (!result) return [];
    const metrics = ["Cost Efficiency", "Time Efficiency", "Reliability", "Sustainability"];
    return metrics.map((metric) => {
      const dataPoint: Record<string, string | number> = { metric };
      result.results.forEach((r) => {
        const modeName = r.modeName.split(" ")[0];
        if (metric === "Cost Efficiency") dataPoint[modeName] = Math.min(100, 100 - r.cost / 100);
        if (metric === "Time Efficiency") dataPoint[modeName] = Math.max(0, 100 - r.time);
        if (metric === "Reliability") dataPoint[modeName] = r.reliability;
        if (metric === "Sustainability") dataPoint[modeName] = Math.max(0, 100 - r.co2 / 50);
      });
      return dataPoint;
    });
  }, [result]);

  const heroBenefits = [
    { icon: DollarSign, label: "Cost Savings", value: "Up to 90%", color: COLORS.oceanBlue },
    { icon: Leaf, label: "CO2 Reduction", value: "Up to 95%", color: COLORS.logisticsGreen },
    { icon: Clock, label: "Time Analysis", value: "4 Modes", color: COLORS.amber },
    { icon: Target, label: "Smart Scoring", value: "AI-Powered", color: COLORS.purple },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <Card className="border-0 bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
          <CardContent className="relative p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-white/20 text-white border-white/30 mb-4">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart Logistics Tool
                  </Badge>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    Modal Shift Comparator
                  </h1>
                  <p className="text-white/80 text-lg mt-4 leading-relaxed">
                    Compare transport modes intelligently. Optimize cost, time, and sustainability 
                    across ocean, air, rail, and road freight to make data-driven logistics decisions.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
                    <Ship className="h-4 w-4" />
                    Ocean
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
                    <Plane className="h-4 w-4" />
                    Air
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
                    <Train className="h-4 w-4" />
                    Rail
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full">
                    <Truck className="h-4 w-4" />
                    Road
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                {heroBenefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <benefit.icon className="h-6 w-6 mb-2" style={{ color: benefit.color }} />
                    <p className="text-2xl font-bold">{benefit.value}</p>
                    <p className="text-white/70 text-sm">{benefit.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Tabs Section */}
      <Card className="border-0 shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="border-b border-slate-100 dark:border-slate-700 pb-0">
            <TabsList className="grid w-full grid-cols-5 h-12">
              <TabsTrigger value="input" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">Input</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                <span className="hidden sm:inline">Comparison</span>
              </TabsTrigger>
              <TabsTrigger value="visualizations" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Visualizations</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="faqs" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">FAQs</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-6">
            <AnimatePresence mode="wait">
              {/* Tab 1: Input */}
              <TabsContent value="input" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Input Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="origin" className="flex items-center gap-2">
                        <Ship className="h-4 w-4 text-[#2E8B57]" />
                        Origin
                      </Label>
                      <Input
                        id="origin"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="City, Country"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination" className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-[#EF4444]" />
                        Destination
                      </Label>
                      <Input
                        id="destination"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="City, Country"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="distance" className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-[#2E8B57]" />
                        Distance (km)
                      </Label>
                      <Input
                        id="distance"
                        type="number"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        placeholder="10000"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cargoWeight" className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#2E8B57]" />
                        Cargo Weight (kg)
                      </Label>
                      <Input
                        id="cargoWeight"
                        type="number"
                        value={cargoWeight}
                        onChange={(e) => setCargoWeight(e.target.value)}
                        placeholder="15000"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cargoValue" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-[#2E8B57]" />
                        Cargo Value (USD)
                      </Label>
                      <Input
                        id="cargoValue"
                        type="number"
                        value={cargoValue}
                        onChange={(e) => setCargoValue(e.target.value)}
                        placeholder="250,000"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cargo Type</Label>
                      <Select value={cargoType} onValueChange={setCargoType}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Cargo</SelectItem>
                          <SelectItem value="perishable">Perishable Goods</SelectItem>
                          <SelectItem value="dangerous">Dangerous Goods</SelectItem>
                          <SelectItem value="fragile">Fragile Items</SelectItem>
                          <SelectItem value="hightech">High-Tech Electronics</SelectItem>
                          <SelectItem value="textiles">Textiles & Apparel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Urgency Level</Label>
                      <Select value={urgency} onValueChange={setUrgency}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent (1-3 days)</SelectItem>
                          <SelectItem value="standard">Standard (1-2 weeks)</SelectItem>
                          <SelectItem value="economy">Economy (3-6 weeks)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Sustainability Priority</Label>
                      <Select value={sustainabilityPriority} onValueChange={setSustainabilityPriority}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Cost-focused)</SelectItem>
                          <SelectItem value="medium">Medium (Balanced)</SelectItem>
                          <SelectItem value="high">High (Eco-focused)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={calculateModalShift}
                      disabled={isCalculating}
                      className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 text-white px-8 py-6 text-lg"
                    >
                      {isCalculating ? (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing Modes...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="mr-2 h-5 w-5" />
                          Compare Transport Modes
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Popular Routes */}
                  <div className="mt-6">
                    <h3 className="font-semibold text-[#0F4C81] mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Popular Trade Routes
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tradeRoutes.map((route, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-[#0F4C81] hover:shadow-md transition-all"
                          onClick={() => {
                            setOrigin(route.origin);
                            setDestination(route.destination);
                            setDistance(route.distance.toString());
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-[#0F4C81]/10 text-[#0F4C81] border-[#0F4C81]/20">
                              {route.popular}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{formatNumber(route.distance)} km</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{route.origin.split(",")[0]}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{route.destination.split(",")[0]}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Tab 2: Comparison */}
              <TabsContent value="comparison" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {!result ? (
                    <div className="text-center py-12">
                      <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Please enter shipment details and click &quot;Compare Transport Modes&quot; to see comparison results.</p>
                    </div>
                  ) : (
                    <>
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <DollarSign className="h-6 w-6 opacity-80" />
                              <Badge className="bg-white/20 text-white border-0">Best Value</Badge>
                            </div>
                            <p className="text-xl font-bold">{result.bestValue}</p>
                            <p className="text-sm opacity-80 mt-1">Highest overall score</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <Clock className="h-6 w-6 opacity-80" />
                              <Badge className="bg-white/20 text-white border-0">Fastest</Badge>
                            </div>
                            <p className="text-xl font-bold">{result.fastestMode}</p>
                            <p className="text-sm opacity-80 mt-1">Shortest transit time</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <Leaf className="h-6 w-6 opacity-80" />
                              <Badge className="bg-white/20 text-white border-0">Greenest</Badge>
                            </div>
                            <p className="text-xl font-bold">{result.greenestMode}</p>
                            <p className="text-sm opacity-80 mt-1">Lowest CO₂ emissions</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                              <TrendingDown className="h-6 w-6 opacity-80" />
                              <Badge className="bg-white/20 text-white border-0">Savings</Badge>
                            </div>
                            <p className="text-xl font-bold">{formatCurrency(result.totalSavings)}</p>
                            <p className="text-sm opacity-80 mt-1">Potential cost savings</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Comparison Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                              <th className="text-left py-3 px-4 font-semibold text-[#0F4C81]">Transport Mode</th>
                              <th className="text-right py-3 px-4 font-semibold text-[#0F4C81]">Cost</th>
                              <th className="text-right py-3 px-4 font-semibold text-[#0F4C81]">Transit Time</th>
                              <th className="text-right py-3 px-4 font-semibold text-[#0F4C81]">CO₂ Emissions</th>
                              <th className="text-right py-3 px-4 font-semibold text-[#0F4C81]">Reliability</th>
                              <th className="text-right py-3 px-4 font-semibold text-[#0F4C81]">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.results.map((r, index) => (
                              <motion.tr
                                key={r.mode}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`border-b border-slate-100 dark:border-slate-800 ${
                                  r.modeName === result.bestValue ? "bg-[#0F4C81]/5" : ""
                                }`}
                              >
                                <td className="py-4 px-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                      <ModeIcon mode={r.mode} />
                                    </div>
                                    <div>
                                      <p className="font-medium">{r.modeName}</p>
                                      {r.modeName === result.bestValue && (
                                        <Badge className="bg-[#0F4C81] text-white mt-1">
                                          Recommended
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="text-right py-4 px-4 font-medium">{formatCurrency(r.cost)}</td>
                                <td className="text-right py-4 px-4">{r.time} days</td>
                                <td className="text-right py-4 px-4">{formatNumber(r.co2)} kg</td>
                                <td className="text-right py-4 px-4">
                                  <span className={`px-2 py-0.5 rounded text-sm ${
                                    r.reliability >= 95 ? "bg-green-100 text-green-700" :
                                    r.reliability >= 90 ? "bg-amber-100 text-amber-700" :
                                    "bg-red-100 text-red-700"
                                  }`}>
                                    {r.reliability}%
                                  </span>
                                </td>
                                <td className="text-right py-4 px-4">
                                  <span className="text-lg font-bold text-[#0F4C81]">{r.score}</span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </motion.div>
              </TabsContent>

              {/* Tab 3: Visualizations */}
              <TabsContent value="visualizations" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {!result ? (
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Run a comparison to see visualizations.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Bar Chart */}
                        <Card className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                              <BarChart3 className="h-5 w-5" />
                              Cost & Time Comparison
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="name" tick={{ fill: "#0F4C81" }} />
                                  <YAxis yAxisId="left" orientation="left" stroke={COLORS.oceanBlue} />
                                  <YAxis yAxisId="right" orientation="right" stroke={COLORS.logisticsGreen} />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "white",
                                      border: "1px solid #e5e7eb",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <Legend />
                                  <Bar yAxisId="left" dataKey="cost" name="Cost ($)" fill={COLORS.oceanBlue} radius={[4, 4, 0, 0]} />
                                  <Bar yAxisId="right" dataKey="time" name="Time (days)" fill={COLORS.logisticsGreen} radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Pie Chart */}
                        <Card className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                              <PieChartIcon className="h-5 w-5" />
                              Cost Distribution
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {pieData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                  </Pie>
                                  <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{
                                      backgroundColor: "white",
                                      border: "1px solid #e5e7eb",
                                      borderRadius: "8px",
                                    }}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Radar Chart */}
                        <Card className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                              <Target className="h-5 w-5" />
                              Performance Radar
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={radarChartData}>
                                  <PolarGrid stroke="#e5e7eb" />
                                  <PolarAngleAxis dataKey="metric" tick={{ fill: "#0F4C81", fontSize: 12 }} />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                                  <Radar name="Ocean" dataKey="Ocean" stroke={COLORS.oceanBlue} fill={COLORS.oceanBlue} fillOpacity={0.3} />
                                  <Radar name="Air" dataKey="Air" stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.3} />
                                  <Radar name="Rail" dataKey="Rail" stroke={COLORS.logisticsGreen} fill={COLORS.logisticsGreen} fillOpacity={0.3} />
                                  <Radar name="Road" dataKey="Road" stroke={COLORS.amber} fill={COLORS.amber} fillOpacity={0.3} />
                                  <Legend />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Area Chart */}
                        <Card className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                              <LineChart className="h-5 w-5" />
                              Multi-Metric Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={timelineData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="name" tick={{ fill: "#0F4C81" }} />
                                  <YAxis tick={{ fontSize: 10 }} />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "white",
                                      border: "1px solid #e5e7eb",
                                      borderRadius: "8px",
                                    }}
                                  />
                                  <Legend />
                                  <Area type="monotone" dataKey="time" name="Time (days)" fill={COLORS.logisticsGreen} fillOpacity={0.3} stroke={COLORS.logisticsGreen} />
                                  <Bar dataKey="cost" name="Cost ($K)" fill={COLORS.oceanBlue} radius={[4, 4, 0, 0]} />
                                </ComposedChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* CO2 Comparison */}
                      <Card className="border shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2 text-[#2E8B57]">
                            <Leaf className="h-5 w-5" />
                            Carbon Footprint Comparison
                          </CardTitle>
                          <CardDescription>CO₂ emissions for your shipment by transport mode</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {result.results.map((r) => (
                              <div
                                key={r.mode}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                  r.modeName === result.greenestMode
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : "border-slate-200 dark:border-slate-700"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <ModeIcon mode={r.mode} />
                                  <span className="font-medium">{r.modeName}</span>
                                  {r.modeName === result.greenestMode && (
                                    <Badge className="bg-green-500 text-white ml-auto">Best</Badge>
                                  )}
                                </div>
                                <p className="text-2xl font-bold">{formatNumber(r.co2)} kg</p>
                                <p className="text-sm text-muted-foreground">CO₂ emissions</p>
                                <div className="mt-2">
                                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full transition-all"
                                      style={{
                                        width: `${Math.max(0, 100 - (r.co2 / Math.max(...result.results.map(x => x.co2))) * 100)}%`
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </motion.div>
              </TabsContent>

              {/* Tab 4: Analysis */}
              <TabsContent value="analysis" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {!result ? (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Run a comparison to see detailed analysis.</p>
                    </div>
                  ) : (
                    <>
                      {/* Detailed Mode Cards */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {result.results.map((r, index) => (
                          <motion.div
                            key={r.mode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-lg border-2 ${
                              r.modeName === result.bestValue
                                ? "border-[#0F4C81] bg-[#0F4C81]/5"
                                : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                  <ModeIcon mode={r.mode} />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-lg">{r.modeName}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {formatCurrency(r.costPerKg)}/kg • {r.timePerKm} hrs/100km
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-[#0F4C81]">{r.score}</p>
                                <p className="text-xs text-muted-foreground">Score</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-sm text-muted-foreground">Total Cost</p>
                                <p className="font-bold text-lg">{formatCurrency(r.cost)}</p>
                              </div>
                              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <p className="text-sm text-muted-foreground">Transit Time</p>
                                <p className="font-bold text-lg">{r.time} days</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium text-green-600 mb-1 flex items-center gap-1">
                                  <CheckCircle className="h-4 w-4" />
                                  Advantages
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {r.advantages.slice(0, 3).map((adv, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                      {adv}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <Separator />
                              <div>
                                <p className="text-sm font-medium text-red-600 mb-1 flex items-center gap-1">
                                  <AlertCircle className="h-4 w-4" />
                                  Considerations
                                </p>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {r.disadvantages.slice(0, 2).map((dis, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                                      {dis}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Recommendations */}
                      <Card className="border shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                            <Zap className="h-5 w-5" />
                            Modal Shift Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-green-800 dark:text-green-200">
                                    Recommended: {result.bestValue}
                                  </p>
                                  <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                                    Based on your urgency level ({urgency}) and sustainability priority ({sustainabilityPriority}),
                                    {result.bestValue} offers the best balance of cost, time, and environmental impact.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-start gap-2">
                                <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-blue-800 dark:text-blue-200">Modal Shift Opportunities</p>
                                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                                    <li>• Switching from air to ocean could save {formatCurrency(result.totalSavings)}</li>
                                    <li>• Choosing {result.greenestMode} reduces CO₂ by {formatNumber(result.co2Reduction)} kg</li>
                                    <li>• Intermodal solutions may offer better cost-time balance</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-amber-800 dark:text-amber-200">Key Considerations</p>
                                  <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1">
                                    <li>• Consider inventory holding costs for slower modes</li>
                                    <li>• Factor in customs clearance time at borders</li>
                                    <li>• Check seasonal capacity constraints</li>
                                    <li>• Verify insurance coverage for selected mode</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                              <div className="flex items-start gap-2">
                                <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                                <div>
                                  <p className="font-medium text-purple-800 dark:text-purple-200">Risk Mitigation</p>
                                  <ul className="text-sm text-purple-700 dark:text-purple-300 mt-2 space-y-1">
                                    <li>• Add buffer time for port congestion</li>
                                    <li>• Consider cargo insurance variations</li>
                                    <li>• Plan for potential delays in peak seasons</li>
                                    <li>• Have contingency routing options</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cost-Benefit Summary */}
                      <Card className="border shadow-sm">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                            <DollarSign className="h-5 w-5" />
                            Cost-Benefit Summary
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Shipment Value</span>
                                <span className="font-medium">{formatCurrency(result.summary.value)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Cargo Weight</span>
                                <span className="font-medium">{formatNumber(result.summary.weight)} kg</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Distance</span>
                                <span className="font-medium">{formatNumber(result.summary.distance)} km</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Value Density</span>
                                <span className="font-medium">{formatCurrency(result.summary.value / result.summary.weight)}/kg</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Potential Savings</span>
                                <span className="font-bold text-[#2E8B57]">{formatCurrency(result.totalSavings)}</span>
                              </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <p className="font-medium text-[#0F4C81] mb-2">💡 Pro Tip</p>
                              <p className="text-sm text-muted-foreground">
                                For shipments with value density above $50/kg, consider air freight
                                despite higher costs. Lower insurance premiums and faster turnover often offset the
                                transportation cost difference.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </motion.div>
              </TabsContent>

              {/* Tab 5: FAQs */}
              <TabsContent value="faqs" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <HelpCircle className="h-12 w-12 mx-auto text-[#0F4C81] mb-4" />
                    <h2 className="text-2xl font-bold text-[#0F4C81]">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-2">Everything you need to know about modal shift and freight optimization</p>
                  </div>

                  <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqData.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg px-6 bg-white dark:bg-slate-900"
                      >
                        <AccordionTrigger className="text-left font-medium text-[#0F4C81] hover:text-[#2E8B57]">
                          <span className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-sm font-bold">
                              {index + 1}
                            </span>
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pl-11">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* Quick Reference */}
                  <Card className="border-0 bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-[#0F4C81]">
                        <Sparkles className="h-5 w-5" />
                        Quick Reference: Mode Selection Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Ship className="h-5 w-5 text-[#0F4C81]" />
                            <span className="font-semibold">Ocean Freight</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Large volumes, low value</li>
                            <li>• Non-urgent shipments</li>
                            <li>• International trade</li>
                            <li>• Cost: Lowest</li>
                            <li>• Time: 15-45 days</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Plane className="h-5 w-5 text-[#EF4444]" />
                            <span className="font-semibold">Air Freight</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• High value, low volume</li>
                            <li>• Urgent deliveries</li>
                            <li>• Perishable goods</li>
                            <li>• Cost: Highest</li>
                            <li>• Time: 1-5 days</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Train className="h-5 w-5 text-[#2E8B57]" />
                            <span className="font-semibold">Rail Freight</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Land-based routes</li>
                            <li>• Medium urgency</li>
                            <li>• Bulk commodities</li>
                            <li>• Cost: Low-Medium</li>
                            <li>• Time: 5-15 days</li>
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 mb-2">
                            <Truck className="h-5 w-5 text-[#F59E0B]" />
                            <span className="font-semibold">Road Freight</span>
                          </div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Door-to-door needed</li>
                            <li>• Short distances</li>
                            <li>• Flexible scheduling</li>
                            <li>• Cost: Medium</li>
                            <li>• Time: 1-7 days</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
