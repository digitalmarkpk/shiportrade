"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Train,
  MapPin,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  DollarSign,
  RefreshCw,
  Gauge,
  TrainTrack,
  ArrowLeftRight,
  Globe,
  BookOpen,
  Zap,
  Package,
  Wrench,
  Building,
  Route,
  Download,
  Share2,
  Lightbulb,
  AlertCircle,
  TrendingUp,
  Target,
  Shield,
  Timer,
  RouteIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// Animated badge component (defined outside main component to avoid lint issues)
const AnimatedBadge = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5, type: "spring" }}
  >
    <Badge
      variant="outline"
      className="px-3 py-1 text-sm border-[var(--ocean)]/30 dark:border-[var(--ocean)]/50 bg-[var(--ocean)]/5 dark:bg-[var(--ocean)]/10"
    >
      {text}
    </Badge>
  </motion.div>
);

// Rail Gauge Types Database
const RAIL_GAUGES = {
  STANDARD: {
    id: "STANDARD",
    name: "Standard Gauge",
    width: 1435,
    unit: "mm",
    description: "Most common gauge worldwide, used in North America, Europe, China",
    color: "#0F4C81",
    countries: ["US", "CA", "CN", "DE", "FR", "IT", "ES", "UK", "JP", "KR", "AU"],
    percentage: 55,
  },
  RUSSIAN: {
    id: "RUSSIAN",
    name: "Russian/Broad Gauge",
    width: 1520,
    unit: "mm",
    description: "Used in former Soviet Union countries and Finland",
    color: "#DC2626",
    countries: ["RU", "UA", "BY", "KZ", "UZ", "FI", "MN", "LV", "LT", "EE"],
    percentage: 12,
  },
  BROAD_INDIAN: {
    id: "BROAD_INDIAN",
    name: "Indian Broad Gauge",
    width: 1676,
    unit: "mm",
    description: "Used in India, Pakistan, Bangladesh, and parts of Argentina",
    color: "#2E8B57",
    countries: ["IN", "PK", "BD", "AR"],
    percentage: 7,
  },
  BROAD_IRISH: {
    id: "BROAD_IRISH",
    name: "Irish Broad Gauge",
    width: 1600,
    unit: "mm",
    description: "Used in Ireland, parts of Australia, and Brazil",
    color: "#F59E0B",
    countries: ["IE", "BR", "AU_VIC"],
    percentage: 3,
  },
  NARROW_METRIC: {
    id: "NARROW_METRIC",
    name: "Meter Gauge",
    width: 1000,
    unit: "mm",
    description: "Common in Southeast Asia, Africa, and parts of South America",
    color: "#8B5CF6",
    countries: ["TH", "VN", "MY", "KE", "TZ", "BO", "PE"],
    percentage: 10,
  },
  NARROW_1067: {
    id: "NARROW_1067",
    name: "Cape Gauge",
    width: 1067,
    unit: "mm",
    description: "Used in Japan, South Africa, Australia, and New Zealand",
    color: "#EC4899",
    countries: ["JP_HD", "ZA", "NZ", "AU_QS"],
    percentage: 8,
  },
  NARROW_762: {
    id: "NARROW_762",
    name: "Bogie Gauge",
    width: 762,
    unit: "mm",
    description: "Used in mountain railways and heritage lines",
    color: "#06B6D4",
    countries: ["IN_NG", "CN_NG", "TW"],
    percentage: 3,
  },
  NARROW_600: {
    id: "NARROW_600",
    name: "Decauville Gauge",
    width: 600,
    unit: "mm",
    description: "Industrial and heritage railways",
    color: "#84CC16",
    countries: ["FR_IND", "DE_IND"],
    percentage: 2,
  },
};

// Country Database with Rail Gauge Information
const COUNTRIES: Record<string, {
  name: string;
  code: string;
  region: string;
  primaryGauge: keyof typeof RAIL_GAUGES;
  secondaryGauge?: keyof typeof RAIL_GAUGES;
  hasBogieExchange: boolean;
  bogieExchangeLocations?: string[];
  transshipmentCost: number;
  transshipmentTime: number;
}> = {
  US: {
    name: "United States",
    code: "US",
    region: "North America",
    primaryGauge: "STANDARD",
    hasBogieExchange: false,
    transshipmentCost: 0,
    transshipmentTime: 0,
  },
  CA: {
    name: "Canada",
    code: "CA",
    region: "North America",
    primaryGauge: "STANDARD",
    hasBogieExchange: false,
    transshipmentCost: 0,
    transshipmentTime: 0,
  },
  MX: {
    name: "Mexico",
    code: "MX",
    region: "North America",
    primaryGauge: "STANDARD",
    hasBogieExchange: false,
    transshipmentCost: 0,
    transshipmentTime: 0,
  },
  CN: {
    name: "China",
    code: "CN",
    region: "Asia",
    primaryGauge: "STANDARD",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Erlianhot", "Manzhouli", "Alashankou"],
    transshipmentCost: 350,
    transshipmentTime: 8,
  },
  RU: {
    name: "Russia",
    code: "RU",
    region: "Europe/Asia",
    primaryGauge: "RUSSIAN",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Moscow", "Zabaykalsk", "Naushki"],
    transshipmentCost: 400,
    transshipmentTime: 10,
  },
  KZ: {
    name: "Kazakhstan",
    code: "KZ",
    region: "Central Asia",
    primaryGauge: "RUSSIAN",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Dostyk", "Altynkol"],
    transshipmentCost: 380,
    transshipmentTime: 9,
  },
  EU: {
    name: "European Union",
    code: "EU",
    region: "Europe",
    primaryGauge: "STANDARD",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Brest (BY)", "Chop (UA)", "Kaunas (LT)"],
    transshipmentCost: 320,
    transshipmentTime: 7,
  },
  UA: {
    name: "Ukraine",
    code: "UA",
    region: "Europe",
    primaryGauge: "RUSSIAN",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Chop", "Mostyska"],
    transshipmentCost: 300,
    transshipmentTime: 6,
  },
  BY: {
    name: "Belarus",
    code: "BY",
    region: "Europe",
    primaryGauge: "RUSSIAN",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Brest", "Grodno"],
    transshipmentCost: 310,
    transshipmentTime: 7,
  },
  FI: {
    name: "Finland",
    code: "FI",
    region: "Europe",
    primaryGauge: "RUSSIAN",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Vainikkala", "Tornio"],
    transshipmentCost: 350,
    transshipmentTime: 6,
  },
  MN: {
    name: "Mongolia",
    code: "MN",
    region: "Asia",
    primaryGauge: "RUSSIAN",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Zamyn-Üüd"],
    transshipmentCost: 280,
    transshipmentTime: 8,
  },
  IN: {
    name: "India",
    code: "IN",
    region: "South Asia",
    primaryGauge: "BROAD_INDIAN",
    secondaryGauge: "NARROW_METRIC",
    hasBogieExchange: false,
    transshipmentCost: 200,
    transshipmentTime: 5,
  },
  PK: {
    name: "Pakistan",
    code: "PK",
    region: "South Asia",
    primaryGauge: "BROAD_INDIAN",
    hasBogieExchange: false,
    transshipmentCost: 180,
    transshipmentTime: 5,
  },
  BD: {
    name: "Bangladesh",
    code: "BD",
    region: "South Asia",
    primaryGauge: "BROAD_INDIAN",
    secondaryGauge: "NARROW_METRIC",
    hasBogieExchange: false,
    transshipmentCost: 150,
    transshipmentTime: 4,
  },
  IR: {
    name: "Iran",
    code: "IR",
    region: "Middle East",
    primaryGauge: "STANDARD",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Sarakhs", "Jolfa"],
    transshipmentCost: 320,
    transshipmentTime: 8,
  },
  TR: {
    name: "Turkey",
    code: "TR",
    region: "Europe/Asia",
    primaryGauge: "STANDARD",
    hasBogieExchange: false,
    transshipmentCost: 0,
    transshipmentTime: 0,
  },
  TH: {
    name: "Thailand",
    code: "TH",
    region: "Southeast Asia",
    primaryGauge: "NARROW_METRIC",
    hasBogieExchange: false,
    transshipmentCost: 150,
    transshipmentTime: 4,
  },
  VN: {
    name: "Vietnam",
    code: "VN",
    region: "Southeast Asia",
    primaryGauge: "NARROW_METRIC",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Dong Dang", "Lao Cai"],
    transshipmentCost: 180,
    transshipmentTime: 5,
  },
  MY: {
    name: "Malaysia",
    code: "MY",
    region: "Southeast Asia",
    primaryGauge: "NARROW_METRIC",
    hasBogieExchange: false,
    transshipmentCost: 140,
    transshipmentTime: 4,
  },
  JP: {
    name: "Japan",
    code: "JP",
    region: "Asia",
    primaryGauge: "NARROW_1067",
    secondaryGauge: "STANDARD",
    hasBogieExchange: false,
    transshipmentCost: 400,
    transshipmentTime: 6,
  },
  KR: {
    name: "South Korea",
    code: "KR",
    region: "Asia",
    primaryGauge: "STANDARD",
    hasBogieExchange: false,
    transshipmentCost: 0,
    transshipmentTime: 0,
  },
  AU: {
    name: "Australia",
    code: "AU",
    region: "Oceania",
    primaryGauge: "STANDARD",
    secondaryGauge: "NARROW_1067",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Broken Hill", "Crystal Brook"],
    transshipmentCost: 450,
    transshipmentTime: 8,
  },
  NZ: {
    name: "New Zealand",
    code: "NZ",
    region: "Oceania",
    primaryGauge: "NARROW_1067",
    hasBogieExchange: false,
    transshipmentCost: 0,
    transshipmentTime: 0,
  },
  ZA: {
    name: "South Africa",
    code: "ZA",
    region: "Africa",
    primaryGauge: "NARROW_1067",
    hasBogieExchange: false,
    transshipmentCost: 0,
    transshipmentTime: 0,
  },
  BR: {
    name: "Brazil",
    code: "BR",
    region: "South America",
    primaryGauge: "BROAD_IRISH",
    secondaryGauge: "NARROW_METRIC",
    hasBogieExchange: true,
    bogieExchangeLocations: ["Uruguaiana", "Corumbá"],
    transshipmentCost: 350,
    transshipmentTime: 7,
  },
  AR: {
    name: "Argentina",
    code: "AR",
    region: "South America",
    primaryGauge: "BROAD_INDIAN",
    secondaryGauge: "STANDARD",
    hasBogieExchange: false,
    transshipmentCost: 280,
    transshipmentTime: 6,
  },
  UK: {
    name: "United Kingdom",
    code: "UK",
    region: "Europe",
    primaryGauge: "STANDARD",
    hasBogieExchange: false,
    transshipmentCost: 0,
    transshipmentTime: 0,
  },
  IE: {
    name: "Ireland",
    code: "IE",
    region: "Europe",
    primaryGauge: "BROAD_IRISH",
    hasBogieExchange: false,
    transshipmentCost: 250,
    transshipmentTime: 4,
  },
};

// Bogie Exchange Cost/Time Data
const BOGIE_EXCHANGE_DATA = {
  costPerContainer: 250,
  timePerContainer: 0.5,
  minTime: 4,
  maxTime: 12,
};

// Transshipment Methods
const TRANSSHIPMENT_METHODS = [
  {
    id: "bogie_exchange",
    name: "Bogie Exchange",
    description: "Swap wheelsets at gauge break point",
    timeMultiplier: 1.0,
    costMultiplier: 1.0,
    suitableFor: "All cargo types",
    icon: Wrench,
  },
  {
    id: "transshipment",
    name: "Container Transshipment",
    description: "Transfer containers between trains",
    timeMultiplier: 1.5,
    costMultiplier: 1.3,
    suitableFor: "Containerized cargo",
    icon: Package,
  },
  {
    id: "variable_gauge",
    name: "Variable Gauge Axles",
    description: "Automatic gauge adjustment while moving",
    timeMultiplier: 0.3,
    costMultiplier: 1.5,
    suitableFor: "Passenger and special cargo",
    icon: Zap,
  },
];

// Major Rail Corridors
const RAIL_CORRIDORS = [
  {
    id: "china_europe",
    name: "China-Europe Railway Express",
    route: "China → Kazakhstan → Russia → Belarus → Poland → Germany",
    distance: 11000,
    transitTime: 14,
    gaugeChanges: 2,
    gaugeBreakPoints: ["Dostyk (CN-KZ)", "Brest (BY-PL)"],
    annualTEU: 500000,
    mainCargo: "Electronics, Machinery, Auto Parts",
  },
  {
    id: "trans_siberian",
    name: "Trans-Siberian Railway",
    route: "Moscow → Vladivostok",
    distance: 9289,
    transitTime: 7,
    gaugeChanges: 0,
    gaugeBreakPoints: [],
    annualTEU: 250000,
    mainCargo: "Containers, Raw Materials",
  },
  {
    id: "north_south",
    name: "North-South Transport Corridor",
    route: "Russia → Iran → India (via ship)",
    distance: 7200,
    transitTime: 10,
    gaugeChanges: 1,
    gaugeBreakPoints: ["Sarakhs (IR-TM)"],
    annualTEU: 50000,
    mainCargo: "Agricultural products, Chemicals",
  },
  {
    id: "central_asia",
    name: "Central Asia-China Corridor",
    route: "China → Kazakhstan → Uzbekistan",
    distance: 4500,
    transitTime: 6,
    gaugeChanges: 1,
    gaugeBreakPoints: ["Alashankou (CN-KZ)"],
    annualTEU: 150000,
    mainCargo: "Cotton, Minerals, Consumer goods",
  },
  {
    id: "southern_asia",
    name: "Southern Asia Corridor",
    route: "India → Pakistan → Iran → Turkey",
    distance: 6000,
    transitTime: 12,
    gaugeChanges: 2,
    gaugeBreakPoints: ["Mirjaveh (IR-PK)", "Lake Van (TR)"],
    annualTEU: 30000,
    mainCargo: "Textiles, Agricultural products",
  },
];

// Pro Tips
const PRO_TIPS = [
  {
    icon: Timer,
    title: "Plan for Gauge Changes in Transit Time",
    description: "Add 6-12 hours for each gauge change point in your transit time calculations. Complex routes with multiple gauge changes may require 24-48 hours of additional time.",
  },
  {
    icon: DollarSign,
    title: "Budget for Hidden Costs",
    description: "Beyond basic transshipment fees, factor in documentation charges ($50-100/container), potential storage fees during delays, and currency exchange costs at border points.",
  },
  {
    icon: Shield,
    title: "Verify Insurance Coverage",
    description: "Ensure your cargo insurance covers transshipment operations. Some policies exclude damages during gauge changes - request specific coverage extensions if needed.",
  },
  {
    icon: Target,
    title: "Choose Optimal Break Points",
    description: "Select routes with established, well-equipped gauge change facilities. Modern terminals like Brest or Dostyk offer faster processing and better security than remote locations.",
  },
  {
    icon: Package,
    title: "Standardize Container Types",
    description: "Use standard 20ft or 40ft containers whenever possible. Specialized equipment may not be available at all gauge change points, causing delays and additional costs.",
  },
  {
    icon: TrendingUp,
    title: "Negotiate Volume Discounts",
    description: "For regular shipments, negotiate frame agreements with rail operators. Volume discounts of 10-20% are common for shippers moving 50+ containers monthly.",
  },
];

// Common Mistakes
const COMMON_MISTAKES = [
  {
    icon: AlertCircle,
    title: "Ignoring Gauge Compatibility in Route Planning",
    description: "Many shippers select routes based solely on distance or cost without considering gauge compatibility. This can lead to unexpected transshipment delays and costs. Always verify gauge compatibility at every border crossing and factor in the time and cost for gauge change operations.",
  },
  {
    icon: AlertTriangle,
    title: "Underestimating Transshipment Time",
    description: "Transshipment times can vary significantly based on cargo type, terminal congestion, and operational efficiency. A single gauge change can take 4-12 hours, and delays are common during peak seasons. Always add buffer time to your logistics schedule.",
  },
  {
    icon: Package,
    title: "Using Non-Standard Container Sizes",
    description: "Specialized containers (open-top, flat rack, refrigerated) may not be available at all gauge change points. This can result in cargo transfers to standard containers or waiting for special equipment. Plan container requirements well in advance.",
  },
  {
    icon: AlertCircle,
    title: "Neglecting Documentation Requirements",
    description: "Cross-border rail shipments require extensive documentation including customs declarations, railway consignment notes (SMGS/CIM), and cargo insurance certificates. Incomplete documentation is a leading cause of delays at gauge change points.",
  },
  {
    icon: MapPin,
    title: "Overlooking Alternative Routes",
    description: "Focusing on a single route without considering alternatives can be costly when disruptions occur. Identify backup routes and gauge change points for your critical shipments to maintain supply chain resilience.",
  },
];

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is rail gauge compatibility and why does it matter for international freight?",
    answer: "Rail gauge compatibility refers to whether railway tracks in different countries have the same distance between the rails. When gauges differ, trains cannot continue directly across borders - they require either a bogie exchange (changing the wheelsets), container transshipment (moving containers to a different train), or variable gauge equipment. This is a critical consideration for international rail freight because gauge differences directly impact transit times, costs, and logistics complexity. For example, shipping from China (1435mm standard gauge) to Russia (1520mm broad gauge) requires a gauge change operation that adds 6-12 hours and $250-400 per container to the journey. Understanding gauge compatibility helps shippers plan realistic transit times, budget accurately, and select optimal routes for their cargo.",
  },
  {
    question: "How do I calculate the total cost impact of gauge changes on my shipment?",
    answer: "Calculating the total cost impact of gauge changes requires considering multiple factors. Start with the direct transshipment fee, which typically ranges from $200-450 per container depending on the location. Add documentation charges (approximately $50-100 per container for customs and railway paperwork). Consider potential storage fees if there are delays ($10-30 per container per day). Factor in additional insurance costs for cargo handling during transshipment. Don't forget indirect costs: extended transit time affects inventory carrying costs and potentially customer commitments. For time-sensitive cargo, the opportunity cost of delays may exceed direct handling fees. Finally, include any special handling fees for dangerous goods, oversized cargo, or temperature-controlled containers. A conservative estimate would add 15-25% to your base rail freight cost for each gauge change point on the route.",
  },
  {
    question: "Which transshipment method should I choose for my cargo?",
    answer: "The choice of transshipment method depends on your cargo type, budget, and timeline requirements. Bogie exchange is the most common and cost-effective method for standard freight, where wheelsets are swapped while the cargo remains on the wagon. This takes 6-12 hours and costs $200-400 per container. Container transshipment involves physically lifting containers from one train to another - it's more expensive (30-50% higher) and slower but necessary for cargo requiring special handling or when bogie exchange isn't available. Variable gauge axles (VGA) allow trains to automatically adjust their gauge, taking only minutes, but this technology is primarily used for passenger trains and limited cargo applications. For most freight shippers, bogie exchange offers the best balance of cost and speed. Choose container transshipment for dangerous goods, oversized cargo, or when switching between incompatible wagon types.",
  },
  {
    question: "What are the major gauge change points along the China-Europe railway route?",
    answer: "The China-Europe Railway Express traverses multiple gauge systems, with two primary gauge change points. The first is at Dostyk (Kazakhstan side) or Alashankou (China side), where trains transition from China's standard gauge (1435mm) to the Russian broad gauge (1520mm) used throughout Kazakhstan, Russia, and Belarus. This facility processes over 150,000 TEU annually and typically takes 8-10 hours for a full train. The second major point is at Brest (Belarus) and Małaszewicze (Poland), where trains transition back to standard gauge for European railways. This is one of the busiest gauge change facilities in the world, handling over 200,000 TEU annually with processing times of 10-12 hours. Additional minor gauge changes may occur depending on the specific European destination. Modern facilities at these points operate 24/7 with advanced equipment, but congestion during peak seasons can cause significant delays.",
  },
  {
    question: "How can I minimize delays at gauge change points?",
    answer: "Minimizing delays at gauge change points requires careful planning and coordination. First, ensure all documentation is complete and accurate before arrival - incomplete paperwork is the leading cause of delays. Use standard container types that are readily compatible with handling equipment at both ends. Schedule shipments to arrive during off-peak periods when possible - mid-week arrivals typically have shorter queues than weekend or holiday arrivals. Work with experienced freight forwarders who have established relationships with terminal operators and can prioritize your cargo. Consider pre-clearing customs documentation electronically before physical arrival. For high-volume shipments, negotiate service level agreements that guarantee processing times. Finally, build buffer time into your logistics schedule - even the best-planned shipments can face unexpected delays due to weather, equipment issues, or congestion.",
  },
  {
    question: "Are there any routes that avoid gauge changes between Asia and Europe?",
    answer: "While the majority of Asia-Europe rail routes require gauge changes, there are some alternatives. The most promising development is the gradual expansion of standard gauge infrastructure. Turkey has extended standard gauge lines into Central Asia via the Baku-Tbilisi-Kars railway, though capacity remains limited. Iran offers a standard gauge corridor from the Caspian Sea to Turkish borders, avoiding Russian broad gauge entirely. However, this route has geopolitical and logistical challenges. The Iron Silk Road vision aims to create continuous standard gauge corridors, but full implementation is decades away. Currently, the most practical approach is to accept gauge changes as inevitable and focus on optimizing transit through established break points. For truly time-sensitive cargo where gauge change delays are unacceptable, intermodal alternatives combining sea and short-sea shipping may be worth considering.",
  },
  {
    question: "What documentation is required for cross-border rail shipments with gauge changes?",
    answer: "Cross-border rail shipments with gauge changes require comprehensive documentation to ensure smooth transit. The primary document is the SMGS (Agreement on International Railway Freight Transport) consignment note, which serves as both the transport contract and cargo receipt. You'll need a commercial invoice with detailed cargo description, values, and HS codes. A packing list specifying contents, weights, and dimensions of each package is essential. Customs declarations for each border crossing must be prepared, often requiring translation into local languages. For dangerous goods, specific declarations and certificates are mandatory. Cargo insurance certificates should explicitly cover transshipment operations. Additional documents may include phytosanitary certificates for agricultural products, certificates of origin for preferential duty rates, and any specific import permits required by destination countries. Working with a freight forwarder experienced in rail documentation can prevent costly delays.",
  },
  {
    question: "How do seasonal factors affect rail gauge change operations?",
    answer: "Seasonal factors significantly impact rail gauge change operations. Winter months (November-March) present the greatest challenges, particularly on routes through Russia, Kazakhstan, and Eastern Europe. Severe cold can slow operations, freeze equipment, and cause rail damage. Processing times may increase by 20-40% during extreme weather. Conversely, summer months bring peak shipping volumes, leading to congestion at major terminals. The pre-Christmas period (August-October) sees the highest demand on Asia-Europe routes, with queues at Brest/Małaszewicze sometimes extending to days. Spring thaw season can cause temporary speed restrictions and operational limitations. For optimal service, plan time-sensitive shipments for spring or early autumn, build buffer time for winter shipments, and book well in advance for peak season cargo. Some terminals offer premium services with guaranteed processing times during peak periods, which may be cost-effective for urgent shipments.",
  },
];

interface CompatibilityResult {
  isCompatible: boolean;
  originGauge: keyof typeof RAIL_GAUGES;
  destinationGauge: keyof typeof RAIL_GAUGES;
  gaugeDifference: number;
  requiresTransshipment: boolean;
  transshipmentLocations: string[];
  estimatedCost: number;
  estimatedTime: number;
  recommendedMethod: typeof TRANSSHIPMENT_METHODS[0];
  warnings: string[];
  suggestions: string[];
}

export function RailGaugeCompatibility() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [originCountry, setOriginCountry] = useState<string>("CN");
  const [destinationCountry, setDestinationCountry] = useState<string>("EU");
  const [containers, setContainers] = useState<number>(10);
  const [cargoType, setCargoType] = useState<string>("general");
  const [showShareToast, setShowShareToast] = useState(false);

  // Calculate compatibility result
  const result = useMemo((): CompatibilityResult => {
    const origin = COUNTRIES[originCountry];
    const destination = COUNTRIES[destinationCountry];

    if (!origin || !destination) {
      return {
        isCompatible: false,
        originGauge: "STANDARD",
        destinationGauge: "STANDARD",
        gaugeDifference: 0,
        requiresTransshipment: false,
        transshipmentLocations: [],
        estimatedCost: 0,
        estimatedTime: 0,
        recommendedMethod: TRANSSHIPMENT_METHODS[0],
        warnings: ["Please select valid origin and destination countries"],
        suggestions: [],
      };
    }

    const originGauge = origin.primaryGauge;
    const destGauge = destination.primaryGauge;
    const isCompatible = originGauge === destGauge;
    const originGaugeWidth = RAIL_GAUGES[originGauge].width;
    const destGaugeWidth = RAIL_GAUGES[destGauge].width;
    const gaugeDifference = Math.abs(originGaugeWidth - destGaugeWidth);

    const transshipmentLocations: string[] = [];
    let estimatedCost = 0;
    let estimatedTime = 0;
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (!isCompatible) {
      if (origin.hasBogieExchange && origin.bogieExchangeLocations) {
        transshipmentLocations.push(...origin.bogieExchangeLocations.map(loc => `${loc} (${origin.name})`));
      }
      if (destination.hasBogieExchange && destination.bogieExchangeLocations) {
        transshipmentLocations.push(...destination.bogieExchangeLocations.map(loc => `${loc} (${destination.name})`));
      }

      const baseTransshipmentCost = (origin.transshipmentCost + destination.transshipmentCost) / 2;
      estimatedCost = baseTransshipmentCost * containers;

      const baseTransshipmentTime = Math.max(origin.transshipmentTime, destination.transshipmentTime);
      estimatedTime = Math.min(
        Math.max(baseTransshipmentTime, BOGIE_EXCHANGE_DATA.minTime),
        BOGIE_EXCHANGE_DATA.maxTime
      );

      if (gaugeDifference > 200) {
        warnings.push(`Large gauge difference (${gaugeDifference}mm) requires complete transshipment or bogie exchange`);
      }
      if (transshipmentLocations.length === 0) {
        warnings.push("No established bogie exchange facilities on this route");
        suggestions.push("Consider alternative routing via established gauge change points");
      }
      if (origin.region !== destination.region) {
        suggestions.push("Cross-regional route may have multiple gauge changes - verify intermediate points");
      }

      if (containers > 20) {
        suggestions.push("For large shipments, negotiate volume discounts on transshipment costs");
      }
    } else {
      suggestions.push("Gauges are compatible - direct through service possible");
      if (origin.secondaryGauge || destination.secondaryGauge) {
        suggestions.push("Note: Secondary gauge networks exist in one or both countries");
      }
    }

    const recommendedMethod = gaugeDifference > 300 ? TRANSSHIPMENT_METHODS[1] : TRANSSHIPMENT_METHODS[0];

    return {
      isCompatible,
      originGauge,
      destinationGauge: destGauge,
      gaugeDifference,
      requiresTransshipment: !isCompatible,
      transshipmentLocations,
      estimatedCost,
      estimatedTime,
      recommendedMethod,
      warnings,
      suggestions,
    };
  }, [originCountry, destinationCountry, containers, cargoType]);

  // Chart data for gauge distribution
  const gaugeDistributionData = useMemo(() => {
    return Object.values(RAIL_GAUGES).map(gauge => ({
      name: gauge.name,
      width: gauge.width,
      percentage: gauge.percentage,
      color: gauge.color,
    }));
  }, []);

  // Cost breakdown for pie chart
  const costBreakdownData = useMemo(() => {
    if (result.isCompatible) return [];
    return [
      { name: "Transshipment Fee", value: result.estimatedCost * 0.6, color: "#0F4C81" },
      { name: "Documentation", value: containers * 75, color: "#2E8B57" },
      { name: "Handling Charges", value: result.estimatedCost * 0.2, color: "#F59E0B" },
      { name: "Insurance Surcharge", value: result.estimatedCost * 0.1, color: "#8B5CF6" },
    ];
  }, [result, containers]);

  // Transit time comparison data
  const transitTimeData = useMemo(() => {
    return RAIL_CORRIDORS.map(corridor => ({
      name: corridor.name.split(" ").slice(0, 2).join(" "),
      fullRoute: corridor.route,
      transitTime: corridor.transitTime,
      gaugeChanges: corridor.gaugeChanges,
      distance: corridor.distance,
    }));
  }, []);

  // Gauge change timeline data
  const gaugeChangeTimeline = useMemo(() => {
    if (result.isCompatible) return [];
    
    const origin = COUNTRIES[originCountry];
    const destination = COUNTRIES[destinationCountry];
    
    return [
      {
        stage: "Departure",
        location: origin?.name || "Origin",
        gauge: RAIL_GAUGES[result.originGauge].width,
        time: 0,
        color: RAIL_GAUGES[result.originGauge].color,
      },
      {
        stage: "Gauge Change",
        location: result.transshipmentLocations[0] || "Border",
        gauge: "Change",
        time: result.estimatedTime,
        color: "#F59E0B",
      },
      {
        stage: "Arrival",
        location: destination?.name || "Destination",
        gauge: RAIL_GAUGES[result.destinationGauge].width,
        time: 0,
        color: RAIL_GAUGES[result.destinationGauge].color,
      },
    ];
  }, [result, originCountry, destinationCountry]);

  // Gauge width comparison
  const gaugeComparisonData = useMemo(() => {
    return [
      {
        name: "Origin",
        gauge: RAIL_GAUGES[result.originGauge].name,
        width: RAIL_GAUGES[result.originGauge].width,
        color: RAIL_GAUGES[result.originGauge].color,
      },
      {
        name: "Destination",
        gauge: RAIL_GAUGES[result.destinationGauge].name,
        width: RAIL_GAUGES[result.destinationGauge].width,
        color: RAIL_GAUGES[result.destinationGauge].color,
      },
    ];
  }, [result]);

  // Cost comparison data
  const costComparisonData = useMemo(() => {
    return TRANSSHIPMENT_METHODS.map(method => ({
      name: method.name.split(" ").slice(0, 2).join(" "),
      fullName: method.name,
      cost: Math.round(result.estimatedCost * method.costMultiplier),
      time: Math.round(result.estimatedTime * method.timeMultiplier * 10) / 10,
      color: method.id === result.recommendedMethod.id ? "#2E8B57" : "#0F4C81",
    }));
  }, [result]);

  // Swap origin and destination
  const handleSwap = () => {
    const temp = originCountry;
    setOriginCountry(destinationCountry);
    setDestinationCountry(temp);
  };

  // Reset to defaults
  const handleReset = () => {
    setOriginCountry("CN");
    setDestinationCountry("EU");
    setContainers(10);
    setCargoType("general");
  };

  // Export results as JSON
  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      route: {
        origin: COUNTRIES[originCountry]?.name,
        destination: COUNTRIES[destinationCountry]?.name,
      },
      gauges: {
        origin: RAIL_GAUGES[result.originGauge],
        destination: RAIL_GAUGES[result.destinationGauge],
        difference: result.gaugeDifference,
      },
      compatibility: {
        isCompatible: result.isCompatible,
        requiresTransshipment: result.requiresTransshipment,
      },
      costs: {
        transshipmentCost: result.estimatedCost,
        containers: containers,
        costPerContainer: result.estimatedCost / (containers || 1),
      },
      time: {
        estimatedDelay: result.estimatedTime,
      },
      recommendations: {
        method: result.recommendedMethod.name,
        locations: result.transshipmentLocations,
        warnings: result.warnings,
        suggestions: result.suggestions,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rail-gauge-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share results
  const handleShare = async () => {
    const shareText = `Rail Gauge Compatibility Check:
Route: ${COUNTRIES[originCountry]?.name} → ${COUNTRIES[destinationCountry]?.name}
Gauges: ${RAIL_GAUGES[result.originGauge].width}mm → ${RAIL_GAUGES[result.destinationGauge].width}mm
Compatible: ${result.isCompatible ? "Yes" : "No"}
${!result.isCompatible ? `Transshipment Cost: $${result.estimatedCost.toLocaleString()}
Delay: ${result.estimatedTime} hours` : ""}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Rail Gauge Compatibility Analysis",
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border border-border/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <AnimatedBadge text="Rail Transport" delay={0} />
              <AnimatedBadge text="Gauge Compatibility" delay={0.1} />
              <AnimatedBadge text="Intermodal" delay={0.2} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Rail Gauge Compatibility Checker
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Analyze rail gauge compatibility between countries, estimate transshipment costs and delays, 
                and plan efficient cross-border rail freight routes.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={handleShare} className="gap-2 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3 bg-[var(--logistics)]/10 border border-[var(--logistics)]/30 rounded-lg text-sm text-[var(--logistics)] dark:text-[var(--logistics)]"
          >
            Results copied to clipboard!
          </motion.div>
        )}
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="calculator" className="py-3">Calculator</TabsTrigger>
          <TabsTrigger value="analysis" className="py-3">Analysis</TabsTrigger>
          <TabsTrigger value="routes" className="py-3">Routes</TabsTrigger>
          <TabsTrigger value="guide" className="py-3">Guide</TabsTrigger>
          <TabsTrigger value="faq" className="py-3">FAQ</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Origin Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                  Origin Country
                </CardTitle>
                <CardDescription>Select the departure country</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={originCountry} onValueChange={setOriginCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COUNTRIES).map(([code, country]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span>{country.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {RAIL_GAUGES[country.primaryGauge].width}mm
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {COUNTRIES[originCountry] && (
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Primary Gauge</span>
                      <Badge style={{ backgroundColor: RAIL_GAUGES[COUNTRIES[originCountry].primaryGauge].color }}>
                        {RAIL_GAUGES[COUNTRIES[originCountry].primaryGauge].width}mm
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Region</span>
                      <span className="text-sm font-medium">{COUNTRIES[originCountry].region}</span>
                    </div>
                    {COUNTRIES[originCountry].hasBogieExchange && (
                      <div className="flex items-center gap-2 text-[var(--logistics)]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Bogie exchange available</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Swap Button */}
            <div className="flex items-center justify-center">
              <Button variant="outline" size="icon" onClick={handleSwap} className="h-12 w-12">
                <ArrowLeftRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Destination Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--logistics)]" />
                  Destination Country
                </CardTitle>
                <CardDescription>Select the arrival country</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COUNTRIES).map(([code, country]) => (
                      <SelectItem key={code} value={code}>
                        <div className="flex items-center gap-2">
                          <span>{country.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {RAIL_GAUGES[country.primaryGauge].width}mm
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {COUNTRIES[destinationCountry] && (
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Primary Gauge</span>
                      <Badge style={{ backgroundColor: RAIL_GAUGES[COUNTRIES[destinationCountry].primaryGauge].color }}>
                        {RAIL_GAUGES[COUNTRIES[destinationCountry].primaryGauge].width}mm
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Region</span>
                      <span className="text-sm font-medium">{COUNTRIES[destinationCountry].region}</span>
                    </div>
                    {COUNTRIES[destinationCountry].hasBogieExchange && (
                      <div className="flex items-center gap-2 text-[var(--logistics)]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-sm">Bogie exchange available</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Shipment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--ocean)]" />
                Shipment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Number of Containers</label>
                  <Select value={containers.toString()} onValueChange={(v) => setContainers(parseInt(v))}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 5, 10, 20, 30, 40, 50].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} TEU{num > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Cargo Type</label>
                  <Select value={cargoType} onValueChange={setCargoType}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Cargo</SelectItem>
                      <SelectItem value="dangerous">Dangerous Goods</SelectItem>
                      <SelectItem value="perishable">Perishable Goods</SelectItem>
                      <SelectItem value="oversized">Oversized Cargo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="outline" className="w-full" onClick={handleReset}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${originCountry}-${destinationCountry}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Compatibility Status */}
              <Card className={`border-2 ${result.isCompatible ? "border-[var(--logistics)]/50" : "border-amber-500/50"}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {result.isCompatible ? (
                        <div className="h-14 w-14 rounded-full bg-[var(--logistics)]/20 flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-[var(--logistics)]" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <AlertTriangle className="h-8 w-8 text-amber-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold">
                          {result.isCompatible ? "Gauges Compatible" : "Gauge Change Required"}
                        </h3>
                        <p className="text-muted-foreground">
                          {result.isCompatible
                            ? "Direct through service possible"
                            : `Gauge difference of ${result.gaugeDifference}mm requires intervention`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge
                          className="text-lg px-3 py-1"
                          style={{ backgroundColor: RAIL_GAUGES[result.originGauge].color }}
                        >
                          {RAIL_GAUGES[result.originGauge].width}mm
                        </Badge>
                        <ArrowRight className="h-5 w-5" />
                        <Badge
                          className="text-lg px-3 py-1"
                          style={{ backgroundColor: RAIL_GAUGES[result.destinationGauge].color }}
                        >
                          {RAIL_GAUGES[result.destinationGauge].width}mm
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warnings and Suggestions */}
              {result.warnings.length > 0 && (
                <Card className="border-destructive/50 bg-destructive/5 mt-4">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {result.warnings.map((warning, index) => (
                        <div key={index} className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="h-5 w-5 shrink-0" />
                          <span className="text-sm">{warning}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {result.suggestions.length > 0 && (
                <Card className="border-blue-500/50 bg-blue-500/5 mt-4">
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <Info className="h-5 w-5 shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Cost and Time Impact */}
              {!result.isCompatible && (
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Transshipment Cost</p>
                          <p className="text-2xl font-bold text-[var(--ocean)]">
                            ${result.estimatedCost.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            for {containers} TEU{containers > 1 ? "s" : ""}
                          </p>
                        </div>
                        <DollarSign className="h-10 w-10 text-[var(--ocean)]/30" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Delay Time</p>
                          <p className="text-2xl font-bold text-[var(--logistics)]">
                            {result.estimatedTime} hours
                          </p>
                          <p className="text-xs text-muted-foreground">
                            at gauge change point
                          </p>
                        </div>
                        <Clock className="h-10 w-10 text-[var(--logistics)]/30" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Transshipment Locations */}
              {!result.isCompatible && result.transshipmentLocations.length > 0 && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-[var(--ocean)]" />
                      Bogie Exchange Locations
                    </CardTitle>
                    <CardDescription>Facilities for gauge change operations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {result.transshipmentLocations.map((location, index) => (
                        <div
                          key={index}
                          className="p-3 bg-muted/50 rounded-lg flex items-center gap-2"
                        >
                          <TrainTrack className="h-4 w-4 text-[var(--logistics)]" />
                          <span className="text-sm font-medium">{location}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recommended Method */}
              {!result.isCompatible && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Wrench className="h-5 w-5 text-[var(--ocean)]" />
                      Recommended Transshipment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border-2 border-[var(--logistics)]/30 rounded-lg bg-[var(--logistics)]/5">
                      <div className="flex items-start gap-4">
                        <result.recommendedMethod.icon className="h-8 w-8 text-[var(--logistics)] shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{result.recommendedMethod.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.recommendedMethod.description}
                          </p>
                          <div className="flex gap-4 mt-3">
                            <Badge variant="outline">Best for: {result.recommendedMethod.suitableFor}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid md:grid-cols-3 gap-4">
                      {TRANSSHIPMENT_METHODS.map((method) => (
                        <div
                          key={method.id}
                          className={`p-3 border rounded-lg ${
                            method.id === result.recommendedMethod.id
                              ? "border-[var(--logistics)] bg-[var(--logistics)]/10"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <method.icon className="h-4 w-4" />
                            <span className="font-medium text-sm">{method.name}</span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Cost: ${(result.estimatedCost * method.costMultiplier).toLocaleString()}</p>
                            <p>Time: {(result.estimatedTime * method.timeMultiplier).toFixed(1)} hrs</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Gauge Change Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                Gauge Change Analysis
              </CardTitle>
              <CardDescription>Detailed breakdown of gauge differences and transshipment requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Gauge Width Comparison Chart */}
                <div>
                  <h4 className="font-medium mb-4">Gauge Width Comparison</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gaugeComparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" unit="mm" domain={[0, 1800]} className="text-xs" />
                        <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                        <Tooltip 
                          formatter={(value: number) => [`${value}mm`, "Gauge Width"]}
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                        />
                        <Bar dataKey="width" radius={[0, 8, 8, 0]}>
                          {gaugeComparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {result.gaugeDifference > 0 && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Gauge Difference</span>
                        <Badge className="bg-amber-500">{result.gaugeDifference}mm</Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown Pie Chart */}
                <div>
                  <h4 className="font-medium mb-4">Cost Breakdown by Segment</h4>
                  {result.isCompatible ? (
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <CheckCircle2 className="h-12 w-12 text-[var(--logistics)] mx-auto mb-2" />
                        <p className="text-muted-foreground">No transshipment costs</p>
                        <p className="text-xs text-muted-foreground/70">Gauges are compatible</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64">
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
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`$${value.toLocaleString()}`, "Cost"]}
                            contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RouteIcon className="h-5 w-5 text-[var(--logistics)]" />
                Gauge Change Timeline
              </CardTitle>
              <CardDescription>Visual timeline of your rail journey with gauge change points</CardDescription>
            </CardHeader>
            <CardContent>
              {result.isCompatible ? (
                <div className="py-8 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <Train className="h-12 w-12 text-[var(--logistics)] mx-auto mb-2" />
                    <p className="text-muted-foreground">Direct through service</p>
                    <p className="text-xs text-muted-foreground/70">No gauge changes required</p>
                  </div>
                </div>
              ) : (
                <div className="relative py-8">
                  {/* Timeline Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted transform -translate-y-1/2" />
                  
                  {/* Timeline Points */}
                  <div className="relative flex justify-between">
                    {gaugeChangeTimeline.map((point, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.2, type: "spring" }}
                          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 border-background"
                          style={{ backgroundColor: point.color }}
                        >
                          {index === 0 ? (
                            <Train className="h-5 w-5 text-white" />
                          ) : index === gaugeChangeTimeline.length - 1 ? (
                            <MapPin className="h-5 w-5 text-white" />
                          ) : (
                            <ArrowLeftRight className="h-5 w-5 text-white" />
                          )}
                        </motion.div>
                        <div className="mt-3 text-center">
                          <p className="font-medium text-sm">{point.stage}</p>
                          <p className="text-xs text-muted-foreground">{point.location}</p>
                          {typeof point.gauge === "number" ? (
                            <Badge variant="outline" className="mt-1 text-xs">{point.gauge}mm</Badge>
                          ) : (
                            <Badge className="mt-1 text-xs bg-amber-500">{point.gauge}</Badge>
                          )}
                          {point.time > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">+{point.time}h delay</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost & Time Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Method Comparison
              </CardTitle>
              <CardDescription>Compare costs and transit times across transshipment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Cost by Method</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={costComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          formatter={(value: number) => [`$${value.toLocaleString()}`, "Cost"]}
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                        />
                        <Bar dataKey="cost" name="Cost (USD)">
                          {costComparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Time by Method</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={costComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          formatter={(value: number) => [`${value} hours`, "Time"]}
                          contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                        />
                        <Bar dataKey="time" fill="#2E8B57" name="Time (hours)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips & Best Practices
              </CardTitle>
              <CardDescription>Expert advice for optimizing your rail freight operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                        <tip.icon className="h-5 w-5 text-[var(--ocean)]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from common errors in cross-border rail freight</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <div key={index} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-start gap-3">
                      <mistake.icon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6 mt-6">
          {/* Transit Time by Route */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-[var(--logistics)]" />
                Transit Time by Major Rail Corridor
              </CardTitle>
              <CardDescription>Compare transit times across major international rail routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transitTimeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" unit=" days" className="text-xs" />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === "transitTime" ? `${value} days` : value, 
                        name === "transitTime" ? "Transit Time" : name
                      ]}
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Legend />
                    <Bar dataKey="transitTime" fill="#0F4C81" name="Transit Time (days)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Major Corridors Detail */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--ocean)]" />
                Major Rail Corridors
              </CardTitle>
              <CardDescription>Key international rail freight routes and their characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {RAIL_CORRIDORS.map((corridor) => (
                  <div key={corridor.id} className="p-4 border rounded-lg hover:border-[var(--ocean)]/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{corridor.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{corridor.route}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="outline" className="text-xs">
                            {corridor.distance.toLocaleString()} km
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {corridor.transitTime} days
                          </Badge>
                          <Badge className="text-xs bg-[var(--ocean)]">
                            {corridor.gaugeChanges} gauge change{corridor.gaugeChanges !== 1 ? "s" : ""}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {corridor.annualTEU.toLocaleString()} TEU/yr
                          </Badge>
                        </div>
                        {corridor.gaugeBreakPoints.length > 0 && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                            <ArrowLeftRight className="h-3 w-3" />
                            <span>Break points: {corridor.gaugeBreakPoints.join(", ")}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          <strong>Main cargo:</strong> {corridor.mainCargo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Global Gauge Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                Global Rail Gauge Distribution
              </CardTitle>
              <CardDescription>Rail gauge types and their distribution across regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gaugeDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="width" tick={{ fontSize: 10 }} unit="mm" />
                    <YAxis tick={{ fontSize: 10 }} unit="%" />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, "Global Share"]}
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    />
                    <Area type="monotone" dataKey="percentage" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(RAIL_GAUGES).slice(0, 6).map((gauge) => (
                  <div
                    key={gauge.id}
                    className="p-4 border rounded-lg"
                    style={{ borderColor: gauge.color + "50" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: gauge.color }}
                      />
                      <span className="font-medium">{gauge.width}mm</span>
                    </div>
                    <h4 className="font-semibold text-sm">{gauge.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{gauge.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Global share:</span>
                      <Badge variant="outline" style={{ borderColor: gauge.color, color: gauge.color }}>
                        {gauge.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Understanding Rail Gauges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Understanding Rail Gauges
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Rail gauge refers to the distance between the inner sides of the two parallel rails that make up a railway track. 
                This seemingly simple measurement has profound implications for international freight logistics, as different countries 
                and regions adopted different gauges during the development of their rail networks. The gauge determines the width 
                of rolling stock that can operate on a particular railway, and when tracks of different gauges meet, trains cannot 
                simply continue their journey - they must undergo some form of transshipment operation. This creates additional costs, 
                delays, and logistical complexity that shippers must factor into their planning. Understanding gauge compatibility is 
                essential for anyone involved in cross-border rail freight, as it directly impacts transit times, costs, and the 
                feasibility of certain routes. The standard gauge of 1435mm (4 feet 8½ inches) is the most widely used globally, 
                accounting for approximately 55% of the world's railway tracks, but significant portions of the world operate on 
                broader or narrower gauges that require special handling at border crossings.
              </p>
            </CardContent>
          </Card>

          {/* Major Gauge Systems Worldwide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--logistics)]" />
                Major Gauge Systems Worldwide
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                The world's railway networks use several distinct gauge systems, each with its own geographical concentration 
                and historical reasons for adoption. The Standard Gauge (1435mm) dominates in North America, most of Western Europe, 
                China, and Australia's interstate network, making it the most common gauge for international trade routes. The Russian 
                Broad Gauge (1520mm) covers the former Soviet Union countries, creating a continuous network from Eastern Europe through 
                Russia to the Pacific, but requiring gauge changes at borders with standard gauge countries. The Indian Broad Gauge 
                (1676mm) is used across the Indian subcontinent, reflecting British colonial engineering decisions optimized for 
                the region's conditions. Narrow gauges, particularly the Meter Gauge (1000mm) and Cape Gauge (1067mm), are common 
                in developing regions, mountainous areas, and some island nations where lower construction costs were prioritized. 
                Japan's main rail network uses Cape Gauge despite the high-speed Shinkansen using standard gauge, creating internal 
                gauge compatibility issues. Understanding which gauge system applies to your origin, destination, and transit countries 
                is crucial for accurate logistics planning and cost estimation.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {Object.values(RAIL_GAUGES).slice(0, 4).map((gauge) => (
                  <div key={gauge.id} className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: gauge.color }} />
                      <span className="font-semibold">{gauge.name}</span>
                      <Badge variant="outline">{gauge.width}mm</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{gauge.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Countries:</strong> {gauge.countries.slice(0, 4).join(", ")}
                      {gauge.countries.length > 4 && ` and ${gauge.countries.length - 4} more`}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transshipment and Bogie Exchange */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[var(--ocean)]" />
                Transshipment and Bogie Exchange
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                When rail freight crosses from one gauge system to another, three main methods are used to handle the incompatibility. 
                Bogie exchange is the most common and cost-effective solution for freight wagons. In this process, the entire wagon 
                is lifted, and the wheelsets (bogies) are swapped for ones that match the destination gauge. This operation 
                typically takes 6-12 hours for a full train and costs $200-400 per container, depending on the location and 
                operational conditions. Container transshipment involves physically lifting containers from one train to another 
                at the gauge break point. This method is more expensive (typically 30-50% higher costs) and time-consuming, but 
                necessary for cargo requiring special handling or when bogie exchange isn't practical. The most advanced solution 
                is Variable Gauge Axles (VGA), which allow trains to automatically adjust their gauge while moving slowly through 
                a gauge-changing installation. This process takes only minutes but requires specialized equipment that is not 
                universally available. The choice of method depends on cargo type, available infrastructure, cost considerations, 
                and time constraints. Modern gauge change facilities like those at Brest (Belarus-Poland border) or Dostyk 
                (China-Kazakhstan border) handle hundreds of thousands of containers annually with sophisticated equipment and 
                24/7 operations.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {TRANSSHIPMENT_METHODS.map((method) => (
                  <div key={method.id} className="p-4 border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2 mb-2">
                      <method.icon className="h-5 w-5 text-[var(--ocean)]" />
                      <span className="font-semibold">{method.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Best for:</strong> {method.suitableFor}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Planning Cross-Border Rail Shipments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-[var(--logistics)]" />
                Planning Cross-Border Rail Shipments
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Effective planning for cross-border rail shipments with gauge changes requires attention to multiple factors beyond 
                simple distance and cost calculations. Start by identifying all gauge change points along your planned route and 
                researching the facilities available at each. Consider the capacity and reliability of transshipment terminals - 
                modern facilities like Brest or Dostyk process containers faster and with less risk of damage than older, smaller 
                terminals. Factor in the specific requirements of your cargo: dangerous goods may need specialized handling, 
                temperature-controlled containers require power supply during transshipment, and oversized cargo may need special 
                equipment. Build realistic time buffers into your schedule - even efficient gauge change operations add 6-12 hours, 
                and delays are common during peak shipping seasons. Ensure all documentation is complete and accurate before arrival 
                at border points; incomplete paperwork is the leading cause of delays at gauge change facilities. Consider seasonal 
                factors: winter operations in Russia, Kazakhstan, and Eastern Europe can be significantly slower due to severe 
                weather conditions. Work with experienced freight forwarders who have established relationships with terminal 
                operators and can provide real-time updates on conditions at gauge change points. Finally, develop contingency plans 
                for alternative routes in case your primary route experiences disruptions.
              </p>
            </CardContent>
          </Card>

          {/* Major Gauge Break Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                Major Gauge Break Points Worldwide
              </CardTitle>
              <CardDescription>Key locations where rail gauge changes occur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Brest/Małaszewicze", countries: "Belarus-Poland", from: "1520mm", to: "1435mm", traffic: "~200,000 TEU/yr" },
                  { name: "Dostyk/Alashankou", countries: "Kazakhstan-China", from: "1520mm", to: "1435mm", traffic: "~150,000 TEU/yr" },
                  { name: "Zabaykalsk/Manzhouli", countries: "Russia-China", from: "1520mm", to: "1435mm", traffic: "~100,000 TEU/yr" },
                  { name: "Sarakhs", countries: "Iran-Turkmenistan", from: "1435mm", to: "1520mm", traffic: "~50,000 TEU/yr" },
                  { name: "Dong Dang", countries: "Vietnam-China", from: "1000mm", to: "1435mm", traffic: "~30,000 TEU/yr" },
                  { name: "Vainikkala", countries: "Finland-Russia", from: "1520mm", to: "1520mm", traffic: "Same gauge" },
                ].map((point, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-muted/30">
                    <h4 className="font-semibold text-sm">{point.name}</h4>
                    <p className="text-xs text-muted-foreground">{point.countries}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{point.from}</Badge>
                      <ArrowRight className="h-3 w-3" />
                      <Badge variant="outline" className="text-xs">{point.to}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{point.traffic}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about rail gauge compatibility and cross-border rail freight</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
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
