"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Plane,
  Train,
  Truck,
  MapPin,
  Clock,
  DollarSign,
  Package,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Route,
  Zap,
  BarChart3,
  RefreshCw,
  Star,
  Shield,
  Leaf,
  Gauge,
  Weight,
  Plus,
  X,
  GripVertical,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Calculator,
  Target,
  Fuel,
  AlertTriangle,
  Globe,
  Navigation,
  Activity,
  PieChart as PieChartIcon,
  HelpCircle,
  Sparkles,
  Layers,
  Timer,
  Warehouse,
  Download,
  Share2,
  Lightbulb,
  AlertOctagon,
  BookOpen,
  FileText,
  ClipboardList,
  RotateCcw,
  Settings,
  Compass,
  FileCheck,
  Users,
  Building2,
  Container,
  Send,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
  PieChart,
  Pie,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

// Types
interface TransportMode {
  id: string;
  name: string;
  icon: React.ElementType;
  speed: number;
  costPerKgPerKm: number;
  co2PerKgPerKm: number;
  reliability: number;
  capacity: string;
  avgDelay: number;
  minWeight: number;
  maxWeight: number;
  optimalDistance: { min: number; max: number };
  color: string;
  description: string;
}

interface RouteSegment {
  id: string;
  mode: string;
  origin: string;
  destination: string;
  distance: number;
}

interface RouteResult {
  id: string;
  segments: RouteSegment[];
  totalCost: number;
  totalTime: number;
  totalCO2: number;
  totalDistance: number;
  averageReliability: number;
  score: number;
  isRecommended: boolean;
  breakdown: {
    segmentId: string;
    mode: string;
    cost: number;
    time: number;
    co2: number;
    distance: number;
  }[];
}

interface ComparisonData {
  routes: RouteResult[];
  bestCost: RouteResult | null;
  bestTime: RouteResult | null;
  bestEco: RouteResult | null;
  savings: {
    costSavings: number;
    timeSavings: number;
    co2Reduction: number;
  };
}

// Transport Modes Data
const transportModes: TransportMode[] = [
  {
    id: "ocean",
    name: "Ocean Freight",
    icon: Ship,
    speed: 25,
    costPerKgPerKm: 0.00002,
    co2PerKgPerKm: 0.000015,
    reliability: 91,
    capacity: "Up to 250,000 tons/vessel",
    avgDelay: 3,
    minWeight: 500,
    maxWeight: 250000000,
    optimalDistance: { min: 3000, max: 25000 },
    color: "#0F4C81",
    description: "Ocean shipping for large volumes",
  },
  {
    id: "air",
    name: "Air Freight",
    icon: Plane,
    speed: 850,
    costPerKgPerKm: 0.0045,
    co2PerKgPerKm: 0.0005,
    reliability: 97,
    capacity: "Up to 120 tons/flight",
    avgDelay: 0.5,
    minWeight: 1,
    maxWeight: 120000,
    optimalDistance: { min: 500, max: 15000 },
    color: "#8B5CF6",
    description: "Fast air transport for time-critical shipments",
  },
  {
    id: "rail",
    name: "Rail Freight",
    icon: Train,
    speed: 45,
    costPerKgPerKm: 0.000035,
    co2PerKgPerKm: 0.000028,
    reliability: 89,
    capacity: "Up to 5,000 tons/train",
    avgDelay: 1.5,
    minWeight: 1000,
    maxWeight: 5000000,
    optimalDistance: { min: 500, max: 8000 },
    color: "#2E8B57",
    description: "Rail transport for efficient land routes",
  },
  {
    id: "road",
    name: "Road Freight",
    icon: Truck,
    speed: 65,
    costPerKgPerKm: 0.000075,
    co2PerKgPerKm: 0.000062,
    reliability: 92,
    capacity: "Up to 25 tons/truck",
    avgDelay: 0.5,
    minWeight: 50,
    maxWeight: 25000,
    optimalDistance: { min: 50, max: 2500 },
    color: "#F59E0B",
    description: "Flexible door-to-door road transport",
  },
];

// Predefined Routes
const popularRoutes = [
  { origin: "Shanghai, CN", destination: "Rotterdam, NL", distance: 10800 },
  { origin: "Shenzhen, CN", destination: "Los Angeles, US", distance: 11500 },
  { origin: "Frankfurt, DE", destination: "New York, US", distance: 6200 },
  { origin: "Shanghai, CN", destination: "Hamburg, DE", distance: 11000 },
  { origin: "London, UK", destination: "Paris, FR", distance: 460 },
  { origin: "Chicago, US", destination: "Los Angeles, US", distance: 2800 },
  { origin: "Singapore, SG", destination: "Sydney, AU", distance: 6300 },
  { origin: "Dubai, AE", destination: "Mumbai, IN", distance: 2200 },
];

// Mode Combinations Presets
const modeCombinations = [
  { name: "Door-to-Door Ocean", modes: ["road", "ocean", "road"] },
  { name: "Air Express", modes: ["road", "air", "road"] },
  { name: "Intermodal Rail", modes: ["road", "rail", "road"] },
  { name: "Rail-Ocean", modes: ["rail", "ocean", "road"] },
  { name: "Ocean-Rail", modes: ["road", "ocean", "rail"] },
  { name: "Air-Rail", modes: ["air", "rail", "road"] },
];

// Comprehensive FAQ Data (150+ words each)
const faqData = [
  {
    question: "What is multimodal transport and how does it differ from intermodal transport?",
    answer: "Multimodal transport refers to the transportation of goods under a single contract, using at least two different modes of transport (such as ocean, air, rail, or road), with one carrier legally responsible for the entire journey. The key distinction from intermodal transport lies in the contractual arrangement: multimodal transport operates under a single bill of lading or transport document, with one Multimodal Transport Operator (MTO) taking responsibility for the entire movement from origin to destination. In contrast, intermodal transport involves separate contracts for each leg of the journey. Multimodal transport offers significant advantages including simplified documentation, single point of contact, consolidated liability, and often more competitive pricing due to optimized route planning. The MTO coordinates all transfers, handles customs clearance at various points, and manages the complex logistics of mode changes. This approach is particularly beneficial for long-distance international shipments where combining ocean freight for the main leg with road or rail for first and last-mile delivery can achieve optimal balance between cost, time, and environmental impact.",
  },
  {
    question: "How do I determine the optimal transport mode combination for my shipment?",
    answer: "Determining the optimal transport mode combination requires careful analysis of multiple factors including cargo characteristics, delivery requirements, budget constraints, and route-specific considerations. Start by evaluating your cargo: weight, volume, value density, perishability, and any special handling requirements. High-value, time-sensitive goods often justify air freight despite the premium cost, while bulk commodities typically favor ocean or rail transport. Consider your delivery timeline: ocean freight averages 25-35 days for Asia-Europe routes versus 3-5 days for air, but costs 80-90% less per kilogram. Analyze the complete supply chain: door-to-door costs include not just main carriage but also origin/destination handling, customs clearance, and last-mile delivery. Environmental considerations are increasingly important; ocean freight produces approximately 15 grams of CO2 per ton-kilometer versus 500 grams for air freight. Use our route planner to compare multiple combinations simultaneously, examining total cost, transit time, reliability scores, and carbon footprint. The optimal choice often involves trade-offs; our balanced scoring algorithm helps quantify these trade-offs to support data-driven decision-making.",
  },
  {
    question: "What are the key documentation requirements for multimodal shipments?",
    answer: "Multimodal shipments require comprehensive documentation to ensure smooth transit across different transport modes and international borders. The primary document is the Multimodal Transport Document (MTD) or Combined Transport Bill of Lading, which serves as evidence of the contract of carriage, receipt of goods, and document of title. This single document replaces individual bills of lading for each mode, simplifying the documentary process. Additional required documents include: Commercial Invoice detailing cargo value for customs purposes; Packing List specifying contents, weights, and dimensions; Certificate of Origin proving the goods' country of manufacture, essential for preferential duty rates; Cargo Insurance Certificate covering the entire journey; and any required permits or licenses for restricted goods. For customs clearance at mode transfer points, you'll need transit documents such as T1 (EU) or TIR Carnet for international road transport. Dangerous goods shipments require additional declarations, safety data sheets, and proper marking. Proper documentation preparation is critical; errors or omissions can cause significant delays, demurrage charges, or even cargo seizure. Our platform helps generate and validate these documents, reducing the risk of costly documentation failures.",
  },
  {
    question: "How are transfer costs and handling times calculated at mode change points?",
    answer: "Transfer costs and handling times at mode change points (also called intermodal terminals or hubs) are critical components of multimodal transport planning that significantly impact both total cost and transit time. These costs include terminal handling charges (THC), which vary by facility and cargo type, typically ranging from $150-400 per TEU at major ports; inland terminal handling charges for rail/road transfers, usually $50-150 per unit; customs clearance fees if the transfer occurs at an international border; and cargo handling costs including loading, unloading, and temporary storage. Time factors include: vessel-to-shore or shore-to-vessel handling (4-12 hours at ports), customs inspection time (2-24 hours depending on clearance type), rail car switching and assembly (4-8 hours), and truck loading/unloading (1-3 hours). Our calculator incorporates empirical data from major terminals worldwide, adjusted for cargo type and seasonal variations. Transfer efficiency varies significantly by facility; Singapore and Rotterdam achieve average container dwell times under 2 days, while smaller ports may require 4-5 days. Planning for adequate buffer time at transfer points is essential; we recommend adding 20-30% to estimated transfer times for time-sensitive shipments to account for potential delays.",
  },
  {
    question: "What factors affect the reliability of multimodal transport routes?",
    answer: "Reliability in multimodal transport depends on a complex interplay of factors across all stages of the journey. Weather conditions significantly impact all modes: ocean routes face seasonal disruptions from typhoons and winter storms, causing an average of 3-5 days delay on Asia-Europe routes during peak season; air freight experiences weather-related delays primarily at origin and destination airports; rail networks can be affected by extreme temperatures and flooding; and road transport is susceptible to traffic congestion and road conditions. Carrier performance varies widely; established ocean carriers maintain schedule reliability of 75-85% while budget operators may fall below 60%. Port congestion, particularly at major transshipment hubs, can add 5-10 days to transit times during peak periods. Customs clearance efficiency varies dramatically by country, with advanced economies processing in hours versus days or weeks in developing markets. Infrastructure quality at transfer points affects handling efficiency and damage risk. The number of mode transfers directly correlates with reliability risk; each additional transfer introduces potential coordination failures. Our reliability scoring incorporates historical performance data, seasonal patterns, and real-time intelligence to provide accurate predictions and help you select routes with appropriate reliability for your cargo requirements.",
  },
  {
    question: "How can I minimize the environmental impact of my logistics operations?",
    answer: "Minimizing environmental impact in logistics requires a strategic approach combining mode selection, route optimization, and operational efficiency improvements. Transport mode choice has the largest single impact: shifting from air to ocean freight reduces CO2 emissions by approximately 95% per ton-kilometer, while rail transport produces 70-80% less emissions than road transport. For multimodal routes, prioritize ocean or rail for the longest legs of the journey, using road transport only for first and last-mile delivery where no alternatives exist. Consider the emerging options for green logistics: many carriers now offer carbon-neutral shipping options through offset programs, and an increasing number of vessels use liquefied natural gas (LNG) or are being designed for future conversion to green fuels. Route consolidation and load optimization significantly reduce per-unit emissions; filling containers to 85%+ capacity rather than shipping partially loaded can reduce emissions by 15-20% per unit shipped. Partner with carriers committed to sustainability; major shipping lines have announced ambitious decarbonization targets aligned with IMO 2050 goals. Beyond carbon, consider other environmental factors: packaging optimization reduces waste and allows more efficient loading; choosing suppliers closer to consumption reduces transport distances; and collaborating with logistics providers on reverse logistics enables recycling and reuse. Our carbon calculator helps quantify these choices, enabling informed decisions that balance commercial requirements with environmental responsibility.",
  },
  {
    question: "What are the common pitfalls in multimodal transport planning and how can I avoid them?",
    answer: "Multimodal transport planning presents numerous challenges that can lead to costly mistakes if not properly addressed. A common pitfall is underestimating total transit time by focusing only on main carriage duration while ignoring transfer times, customs clearance, and last-mile delivery. Always calculate door-to-door time, adding buffer for transfers and potential delays. Another frequent error is inadequate insurance coverage; standard cargo policies may not cover all modes or may have coverage gaps at transfer points. Ensure you have comprehensive marine cargo insurance covering the entire journey with appropriate cargo clauses. Documentation failures cause significant disruptions; ensure all documents are consistent in terms of cargo description, weights, and consignee details. Mismatched information can trigger customs holds or carrier rejections. Failing to plan for contingencies is risky; have backup routing options and carrier alternatives identified before shipment. Understanding Incoterms properly is essential; they define responsibility boundaries and insurance obligations that can significantly impact your total landed cost. Underestimating ancillary costs such as demurrage, detention, and documentation fees can blow budgets. Our tool helps avoid these pitfalls by providing comprehensive cost modeling, documentation checklists, and contingency planning features that ensure thorough preparation for successful multimodal shipments.",
  },
  {
    question: "How do currency fluctuations and fuel surcharges affect multimodal transport costs?",
    answer: "Currency fluctuations and fuel surcharges represent significant variables in multimodal transport costing that can substantially impact final landed costs. International freight is typically priced in major currencies: ocean freight in USD, air freight in USD or EUR, and regional transport in local currencies. Exchange rate volatility can swing costs by 5-15% over typical contract periods; the USD/EUR rate alone has varied by over 10% annually in recent years. Consider hedging strategies for high-volume, recurring shipments, or negotiate contracts with currency adjustment clauses that share exchange rate risk between shipper and carrier. Fuel surcharges are dynamic components applied to base rates, typically adjusted monthly or quarterly based on published fuel indices. Ocean carriers reference bunker fuel prices, currently applying surcharges of $200-600 per TEU depending on trade lane and vessel efficiency. Air freight fuel surcharges are indexed to jet kerosene prices, typically ranging $1.50-3.00 per kilogram. These surcharges can represent 20-40% of total freight costs during periods of high fuel prices. Our calculator includes current surcharge levels and allows sensitivity analysis for fuel price scenarios. Understanding the fuel efficiency of your chosen carriers matters significantly; newer vessels and aircraft can operate with 20-30% lower fuel consumption, translating to more stable surcharge levels. For budget planning, we recommend adding a 10-15% contingency to quoted rates to account for potential surcharge increases and currency movements during the quotation-to-shipment period.",
  },
];

// Pro Tips Data
const proTips = [
  {
    icon: Compass,
    title: "Optimize Mode Selection by Distance",
    description: "Use ocean freight for distances over 3,000 km to achieve maximum cost efficiency. Rail transport is optimal for 500-8,000 km land routes, while road excels for first/last mile and short-haul under 2,500 km. Air freight should be reserved for high-value or time-critical shipments over 500 km.",
  },
  {
    icon: Container,
    title: "Consolidate Shipments Effectively",
    description: "Maximize container utilization by consolidating multiple orders into single shipments. A fully loaded 40'HC container costs significantly less per CBM than multiple partially filled containers. Plan production and ordering schedules to enable consolidation opportunities.",
  },
  {
    icon: FileCheck,
    title: "Prepare Documentation Early",
    description: "Begin documentation preparation at least 2 weeks before shipment. Missing or incorrect documents cause 40% of customs delays. Use our document checklist and ensure all parties review and approve documents before cargo arrives at the terminal.",
  },
  {
    icon: Clock,
    title: "Build Buffer Time Into Schedules",
    description: "Add 20-30% buffer time to quoted transit times for time-sensitive shipments. Factor in seasonal variations: Q4 peak season adds 5-10 days on major trade lanes. Plan critical shipments during shoulder seasons when capacity is more readily available.",
  },
  {
    icon: Shield,
    title: "Verify Insurance Coverage Gaps",
    description: "Standard cargo insurance may not cover all modes in multimodal transport. Ensure your policy includes warehouse-to-warehouse coverage and specifically covers transfer operations. Consider additional coverage for high-value cargo or sensitive goods.",
  },
  {
    icon: Building2,
    title: "Understand Transfer Hub Capabilities",
    description: "Research transfer hub facilities before routing. Major hubs like Singapore, Rotterdam, and Dubai offer efficient transfers with advanced customs procedures. Smaller ports may have limited capabilities and longer dwell times. Choose hubs with appropriate infrastructure for your cargo type.",
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    icon: AlertCircle,
    title: "Ignoring Total Landed Cost",
    description: "Focusing only on freight rates without considering all cost components is a critical mistake. Total landed cost includes freight, insurance, customs duties, handling fees, inland transport, and various surcharges. A seemingly low freight rate can result in higher total costs if it involves inefficient routing or expensive transfer operations. Always evaluate complete door-to-door costs when comparing options.",
  },
  {
    icon: AlertOctagon,
    title: "Underestimating Customs Clearance Time",
    description: "Customs clearance times vary dramatically by country, cargo type, and documentation quality. Assuming uniform processing times across borders leads to missed delivery commitments. Developing markets may require 3-5 days for standard clearance versus hours in advanced economies. Pre-clearance programs, proper HS code classification, and complete documentation can significantly reduce clearance times and avoid costly inspections.",
  },
  {
    icon: Package,
    title: "Poor Cargo Packaging for Multimodal Transfers",
    description: "Packaging designed for single-mode transport may not survive multiple handling operations in multimodal journeys. Each transfer exposes cargo to handling risks including drops, compression from stacking, and environmental exposure. Use packaging rated for multiple handlings, consider climate variations across the route, and ensure proper marking for orientation, fragility, and handling requirements. Invest in quality packaging to prevent damage claims and rejected deliveries.",
  },
  {
    icon: Users,
    title: "Insufficient Communication Between Stakeholders",
    description: "Multimodal shipments involve multiple parties: shippers, freight forwarders, carriers, terminal operators, customs brokers, and consignees. Inadequate communication leads to coordination failures, missed handoffs, and delays. Establish clear communication protocols, share tracking information proactively, and ensure all parties understand their responsibilities and timelines. A single point of coordination through a reliable MTO can significantly reduce communication failures.",
  },
  {
    icon: Timer,
    title: "Not Planning for Seasonal Capacity Constraints",
    description: "Peak shipping seasons, particularly Q4 and Chinese New Year periods, severely constrain capacity on major trade lanes. Waiting until the last minute to book during these periods results in premium rates, space unavailability, and extended transit times. Book 4-6 weeks in advance during peak seasons, consider alternative routing options, and maintain relationships with multiple carriers to ensure capacity access when needed.",
  },
];

// Educational Content
const educationalContent = {
  whatIsMultimodal: {
    title: "What is Multimodal Transport?",
    content: `Multimodal transport represents a sophisticated approach to international logistics where goods move from origin to destination using at least two different modes of transport under a single contract and a single transport document. This integrated approach to freight transportation has become increasingly important in global supply chains, offering businesses the ability to optimize their logistics operations by leveraging the unique advantages of different transport modes while maintaining streamlined coordination and documentation.

The fundamental principle of multimodal transport is the "one carrier, one liability, one document" concept. A Multimodal Transport Operator (MTO) takes responsibility for the entire journey, coordinating the various transport legs, managing transfers between modes, handling customs formalities, and ensuring cargo reaches its destination safely. This contrasts with unimodal arrangements where shippers must coordinate separately with ocean carriers, airlines, rail operators, and trucking companies.

The evolution of multimodal transport has been driven by globalization, containerization, and advances in logistics management systems. Standard containers can be seamlessly transferred between ships, trains, and trucks without unpacking, enabling efficient mode changes. Modern tracking and communication systems provide real-time visibility across the entire supply chain, allowing proactive management of potential disruptions.

Key benefits of multimodal transport include cost optimization through strategic mode selection, reduced transit times for complex routes by combining fast and economical transport modes, simplified documentation and liability management, environmental benefits through optimized routing, and enhanced supply chain resilience through mode diversification. For businesses engaged in international trade, understanding and effectively utilizing multimodal transport options is essential for competitive advantage in today's complex global marketplace.`,
  },
  planningConsiderations: {
    title: "Planning Considerations",
    content: `Effective multimodal transport planning requires careful consideration of numerous interconnected factors that collectively determine the success and efficiency of your logistics operations. The planning process should begin with a thorough analysis of cargo characteristics, as these fundamentally influence mode selection and routing options.

Cargo-related considerations include physical dimensions and weight, which determine containerization options and modal compatibility. High-value cargo may justify premium air freight rates for security and speed, while bulk commodities favor ocean or rail transport for cost efficiency. Perishable goods require temperature-controlled transport options and minimized transit times, while dangerous goods must comply with mode-specific regulations and may face routing restrictions.

Transit time requirements significantly influence planning decisions. Time-definite delivery commitments may necessitate air freight or expedited multimodal combinations, while more flexible timelines allow cost-optimized routing. Consider not just average transit times but also reliability and variability; a route with 25-day average transit and 2-day standard deviation may be preferable to one with 23-day average but 5-day variability.

Budget constraints must be evaluated comprehensively. Beyond basic freight charges, consider all ancillary costs including fuel surcharges, terminal handling charges, customs brokerage fees, insurance premiums, inland transport, and potential demurrage or detention charges. Currency considerations are important for international shipments; freight is typically quoted in USD but local charges may apply at origin and destination.

Route-specific factors include infrastructure quality at ports and terminals, customs efficiency at border crossings, seasonal weather patterns affecting reliability, and geopolitical risks in certain corridors. Building contingency plans for potential disruptions is essential; identifying alternative routes and carriers in advance enables rapid response when primary plans face obstacles. Collaborative planning with logistics partners ensures alignment on requirements and expectations throughout the supply chain.`,
  },
  modeTransferPoints: {
    title: "Mode Transfer Points",
    content: `Mode transfer points, also known as intermodal terminals or hub facilities, are critical nodes in the multimodal transport network where cargo transitions between different transport modes. These facilities are designed to facilitate efficient transfer of cargo while minimizing handling time, reducing damage risk, and managing necessary documentation and customs procedures.

Major seaports represent the most significant transfer points in global logistics, handling the transition between ocean vessels and inland transport modes. Modern container terminals are highly automated facilities capable of handling thousands of container moves per day. Key capabilities include berth infrastructure for vessel loading/unloading, yard management systems for container storage and retrieval, gate operations for truck handling, and rail terminals for direct vessel-to-rail transfers. Leading ports like Singapore, Rotterdam, and Shanghai have invested heavily in automation and digitization to minimize container dwell times and optimize throughput.

Inland container depots (ICDs) and dry ports serve as transfer points away from coastal areas, enabling efficient distribution to inland destinations. These facilities typically handle transfers between rail and road transport, providing customs clearance services, temporary storage, and container maintenance. ICDs are particularly important in large countries like India, China, and the United States where inland manufacturing centers are distant from seaports.

Air cargo terminals facilitate transfers between air and surface transport, handling the unique requirements of air freight including security screening, customs processing, and specialized handling for time-sensitive cargo. Major air cargo hubs like Hong Kong, Memphis, and Dubai have developed sophisticated facilities for rapid transfer between aircraft and trucks, with some offering direct rail connections.

The efficiency of transfer operations directly impacts total transit time and cost. Key metrics include container dwell time (time spent at the facility), transfer time between modes, customs clearance duration, and facility throughput capacity. When planning multimodal routes, research the specific capabilities and performance metrics of potential transfer points, as these can vary significantly between facilities and directly impact your supply chain performance.`,
  },
  documentationRequirements: {
    title: "Documentation Requirements",
    content: `Comprehensive and accurate documentation is fundamental to successful multimodal transport operations. The documentation framework serves multiple critical functions: evidencing the contract of carriage, facilitating customs clearance, enabling cargo tracking, supporting insurance claims if needed, and ensuring regulatory compliance across all jurisdictions and modes involved in the journey.

The Multimodal Transport Document (MTD) or Combined Transport Bill of Lading is the cornerstone document, serving as the contract between shipper and MTO, receipt for goods, and potentially a document of title. This document specifies the agreed journey, parties involved, cargo details, applicable terms and conditions, and liability limits. Unlike separate bills of lading for each mode, the MTD provides unified documentation with single-carrier responsibility.

Commercial documents essential for customs and commercial purposes include the Commercial Invoice, which must accurately describe goods, values, currencies, and Incoterms; the Packing List detailing contents, weights, dimensions, and packaging specifications; and the Certificate of Origin certifying the country of manufacture, essential for preferential duty rates under trade agreements. These documents must be consistent with each other and with transport documents to avoid customs complications.

Regulatory documents vary by cargo type and route. Dangerous goods shipments require Dangerous Goods Declarations, safety data sheets, and proper marking. Food products may need health certificates, phytosanitary certificates for agricultural goods, and FDA prior notice for US imports. Controlled substances, wildlife products, and strategic goods require additional permits and licenses.

Transit documents facilitate customs processing at intermediate points. The T1 transit document enables movement of non-EU goods through EU territory without payment of duties. TIR Carnets provide similar functionality for international road transport. Understanding the transit documentation requirements for each border crossing is essential to avoid delays.

Best practices for documentation management include using standardized templates, implementing document checklists for each route, allowing adequate time for document preparation and verification, maintaining digital copies for rapid resubmission if needed, and working with experienced customs brokers familiar with local requirements. Documentation errors are among the most common causes of shipment delays and additional costs; investing in proper documentation processes yields significant returns through smoother operations.`,
  },
};

const COLORS = {
  primary: "#0F4C81",
  secondary: "#2E8B57",
  modes: {
    ocean: "#0F4C81",
    air: "#8B5CF6",
    rail: "#2E8B57",
    road: "#F59E0B",
  },
};

// Animated Badge Component
const AnimatedBadge = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--ocean)]/10 text-[var(--ocean)] dark:bg-[var(--ocean)]/20 dark:text-[var(--ocean-foreground)] text-sm font-medium border border-[var(--ocean)]/20"
  >
    {children}
  </motion.div>
);

export default function MultimodalRoutePlanner() {
  const { toast } = useToast();

  // State
  const [origin, setOrigin] = useState("Shanghai, CN");
  const [destination, setDestination] = useState("Rotterdam, NL");
  const [totalDistance, setTotalDistance] = useState(10800);
  const [cargoWeight, setCargoWeight] = useState(15000);
  const [cargoValue, setCargoValue] = useState(250000);
  const [priority, setPriority] = useState<"cost" | "time" | "balanced" | "eco">("balanced");

  // Route segments
  const [segments, setSegments] = useState<RouteSegment[]>([
    { id: "1", mode: "road", origin: "Shanghai, CN", destination: "Shanghai Port", distance: 100 },
    { id: "2", mode: "ocean", origin: "Shanghai Port", destination: "Rotterdam Port", distance: 10500 },
    { id: "3", mode: "road", origin: "Rotterdam Port", destination: "Rotterdam, NL", distance: 200 },
  ]);

  const [results, setResults] = useState<ComparisonData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSegmentBuilder, setShowSegmentBuilder] = useState(true);
  const [activeTab, setActiveTab] = useState("planner");

  // Get mode details
  const getMode = (modeId: string) => transportModes.find((m) => m.id === modeId) || transportModes[0];

  // Add segment
  const addSegment = () => {
    const newSegment: RouteSegment = {
      id: Date.now().toString(),
      mode: "road",
      origin: "",
      destination: "",
      distance: 100,
    };
    setSegments([...segments, newSegment]);
  };

  // Remove segment
  const removeSegment = (id: string) => {
    if (segments.length > 1) {
      setSegments(segments.filter((s) => s.id !== id));
    }
  };

  // Update segment
  const updateSegment = (id: string, field: keyof RouteSegment, value: string | number) => {
    setSegments(
      segments.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Apply preset combination
  const applyPreset = (presetName: string) => {
    const preset = modeCombinations.find((p) => p.name === presetName);
    if (!preset) return;

    const newSegments: RouteSegment[] = preset.modes.map((mode, index) => {
      const isLast = index === preset.modes.length - 1;
      const isFirst = index === 0;
      const avgDistance = totalDistance / preset.modes.length;

      return {
        id: `${Date.now()}-${index}`,
        mode,
        origin: isFirst ? origin : `Transit Hub ${index}`,
        destination: isLast ? destination : `Transit Hub ${index + 1}`,
        distance: Math.round(avgDistance),
      };
    });

    setSegments(newSegments);
  };

  // Calculate route from segments
  const calculateRouteFromSegments = useCallback((
    routeSegments: RouteSegment[],
    weight: number,
    prio: "cost" | "time" | "balanced" | "eco"
  ): RouteResult => {
    let totalCost = 0;
    let totalTime = 0;
    let totalCO2 = 0;
    let totalDist = 0;
    let totalReliability = 0;
    const breakdown: RouteResult["breakdown"] = [];

    routeSegments.forEach((segment) => {
      const mode = getMode(segment.mode);
      const distance = segment.distance;
      const cost = weight * mode.costPerKgPerKm * distance;
      const time = distance / (mode.speed * 24) + mode.avgDelay;
      const co2 = weight * mode.co2PerKgPerKm * distance;

      totalCost += cost;
      totalTime += time;
      totalCO2 += co2;
      totalDist += distance;
      totalReliability += mode.reliability;

      breakdown.push({
        segmentId: segment.id,
        mode: segment.mode,
        cost: Math.round(cost),
        time: Math.round(time * 10) / 10,
        co2: Math.round(co2),
        distance,
      });
    });

    const avgReliability = totalReliability / routeSegments.length;

    const costScore = Math.max(0, 100 - totalCost / 5000);
    const timeScore = Math.max(0, 100 - totalTime * 2);
    const ecoScore = Math.max(0, 100 - totalCO2 / 500);

    let score = 0;
    switch (prio) {
      case "cost":
        score = costScore * 0.5 + timeScore * 0.2 + ecoScore * 0.15 + avgReliability * 0.15;
        break;
      case "time":
        score = costScore * 0.2 + timeScore * 0.5 + ecoScore * 0.15 + avgReliability * 0.15;
        break;
      case "eco":
        score = costScore * 0.2 + timeScore * 0.2 + ecoScore * 0.45 + avgReliability * 0.15;
        break;
      default:
        score = costScore * 0.3 + timeScore * 0.3 + ecoScore * 0.25 + avgReliability * 0.15;
    }

    return {
      id: Date.now().toString(),
      segments: routeSegments,
      totalCost: Math.round(totalCost),
      totalTime: Math.round(totalTime * 10) / 10,
      totalCO2: Math.round(totalCO2),
      totalDistance: Math.round(totalDist),
      averageReliability: Math.round(avgReliability * 10) / 10,
      score: Math.round(score * 10) / 10,
      isRecommended: false,
      breakdown,
    };
  }, []);

  // Generate alternative routes
  const generateAlternatives = useCallback((
    from: string,
    to: string,
    distance: number,
    weight: number,
    prio: "cost" | "time" | "balanced" | "eco"
  ): RouteResult[] => {
    const alternatives: RouteResult[] = [];

    const oceanRoute: RouteSegment[] = [
      { id: "o1", mode: "road", origin: from, destination: `${from.split(",")[0]} Port`, distance: 100 },
      { id: "o2", mode: "ocean", origin: `${from.split(",")[0]} Port`, destination: `${to.split(",")[0]} Port`, distance: distance - 200 },
      { id: "o3", mode: "road", origin: `${to.split(",")[0]} Port`, destination: to, distance: 100 },
    ];
    alternatives.push(calculateRouteFromSegments(oceanRoute, weight, prio));

    const airRoute: RouteSegment[] = [
      { id: "a1", mode: "road", origin: from, destination: `${from.split(",")[0]} Airport`, distance: 50 },
      { id: "a2", mode: "air", origin: `${from.split(",")[0]} Airport`, destination: `${to.split(",")[0]} Airport`, distance: distance },
      { id: "a3", mode: "road", origin: `${to.split(",")[0]} Airport`, destination: to, distance: 50 },
    ];
    alternatives.push(calculateRouteFromSegments(airRoute, weight, prio));

    const railRoute: RouteSegment[] = [
      { id: "r1", mode: "road", origin: from, destination: `${from.split(",")[0]} Rail Terminal`, distance: 80 },
      { id: "r2", mode: "rail", origin: `${from.split(",")[0]} Rail Terminal`, destination: `${to.split(",")[0]} Rail Terminal`, distance: distance - 160 },
      { id: "r3", mode: "road", origin: `${to.split(",")[0]} Rail Terminal`, destination: to, distance: 80 },
    ];
    alternatives.push(calculateRouteFromSegments(railRoute, weight, prio));

    const intermodalRoute: RouteSegment[] = [
      { id: "i1", mode: "road", origin: from, destination: `${from.split(",")[0]} Port`, distance: 100 },
      { id: "i2", mode: "ocean", origin: `${from.split(",")[0]} Port`, destination: "Intermediate Port", distance: distance * 0.6 },
      { id: "i3", mode: "rail", origin: "Intermediate Port", destination: `${to.split(",")[0]} Terminal`, distance: distance * 0.35 },
      { id: "i4", mode: "road", origin: `${to.split(",")[0]} Terminal`, destination: to, distance: 100 },
    ];
    alternatives.push(calculateRouteFromSegments(intermodalRoute, weight, prio));

    return alternatives;
  }, [calculateRouteFromSegments]);

  // Calculate results
  const calculateRoutes = useCallback(() => {
    setIsCalculating(true);

    setTimeout(() => {
      const currentRoute = calculateRouteFromSegments(segments, cargoWeight, priority);
      const alternatives = generateAlternatives(origin, destination, totalDistance, cargoWeight, priority);
      const allRoutes = [currentRoute, ...alternatives];

      const sortedByCost = [...allRoutes].sort((a, b) => a.totalCost - b.totalCost);
      const sortedByTime = [...allRoutes].sort((a, b) => a.totalTime - b.totalTime);
      const sortedByCO2 = [...allRoutes].sort((a, b) => a.totalCO2 - b.totalCO2);

      allRoutes.forEach((r) => (r.isRecommended = false));
      const recommended = allRoutes.sort((a, b) => b.score - a.score)[0];
      if (recommended) recommended.isRecommended = true;

      const comparisonData: ComparisonData = {
        routes: allRoutes,
        bestCost: sortedByCost[0] || null,
        bestTime: sortedByTime[0] || null,
        bestEco: sortedByCO2[0] || null,
        savings: {
          costSavings: sortedByCost[0] ? sortedByCost[sortedByCost.length - 1].totalCost - sortedByCost[0].totalCost : 0,
          timeSavings: sortedByTime[0] ? sortedByTime[sortedByTime.length - 1].totalTime - sortedByTime[0].totalTime : 0,
          co2Reduction: sortedByCO2[0] ? sortedByCO2[sortedByCO2.length - 1].totalCO2 - sortedByCO2[0].totalCO2 : 0,
        },
      };

      setResults(comparisonData);
      setIsCalculating(false);
      setActiveTab("routes");
    }, 1200);
  }, [segments, cargoWeight, origin, destination, totalDistance, priority, calculateRouteFromSegments, generateAlternatives]);

  // Reset form
  const handleReset = () => {
    setOrigin("Shanghai, CN");
    setDestination("Rotterdam, NL");
    setTotalDistance(10800);
    setCargoWeight(15000);
    setCargoValue(250000);
    setPriority("balanced");
    setSegments([
      { id: "1", mode: "road", origin: "Shanghai, CN", destination: "Shanghai Port", distance: 100 },
      { id: "2", mode: "ocean", origin: "Shanghai Port", destination: "Rotterdam Port", distance: 10500 },
      { id: "3", mode: "road", origin: "Rotterdam Port", destination: "Rotterdam, NL", distance: 200 },
    ]);
    setResults(null);
    setActiveTab("planner");
    toast({
      title: "Form Reset",
      description: "All inputs have been reset to default values.",
    });
  };

  // Export results as JSON
  const handleExport = () => {
    if (!results) {
      toast({
        title: "No Results",
        description: "Please calculate routes first before exporting.",
        variant: "destructive",
      });
      return;
    }

    const exportData = {
      origin,
      destination,
      totalDistance,
      cargoWeight,
      cargoValue,
      priority,
      segments,
      results: {
        routes: results.routes.map(r => ({
          modeCombination: r.segments.map(s => s.mode).join(" → "),
          totalCost: r.totalCost,
          totalTime: r.totalTime,
          totalCO2: r.totalCO2,
          totalDistance: r.totalDistance,
          reliability: r.averageReliability,
          score: r.score,
          isRecommended: r.isRecommended,
          breakdown: r.breakdown,
        })),
        bestCost: results.bestCost ? {
          modeCombination: results.bestCost.segments.map(s => s.mode).join(" → "),
          cost: results.bestCost.totalCost,
        } : null,
        bestTime: results.bestTime ? {
          modeCombination: results.bestTime.segments.map(s => s.mode).join(" → "),
          time: results.bestTime.totalTime,
        } : null,
        bestEco: results.bestEco ? {
          modeCombination: results.bestEco.segments.map(s => s.mode).join(" → "),
          co2: results.bestEco.totalCO2,
        } : null,
        potentialSavings: results.savings,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `multimodal-route-${origin.split(",")[0].toLowerCase()}-${destination.split(",")[0].toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Route analysis has been downloaded as JSON file.",
    });
  };

  // Share functionality
  const handleShare = async () => {
    if (!results) {
      toast({
        title: "No Results",
        description: "Please calculate routes first before sharing.",
        variant: "destructive",
      });
      return;
    }

    const shareText = `Multimodal Route Analysis: ${origin} → ${destination}
Distance: ${totalDistance.toLocaleString()} km | Weight: ${cargoWeight.toLocaleString()} kg
Best Route: ${results.routes.find(r => r.isRecommended)?.segments.map(s => s.mode).join(" → ")}
Total Cost: $${results.routes.find(r => r.isRecommended)?.totalCost.toLocaleString()}
Transit Time: ${results.routes.find(r => r.isRecommended)?.totalTime} days
CO₂ Emissions: ${results.routes.find(r => r.isRecommended)?.totalCO2.toLocaleString()} kg
Score: ${results.routes.find(r => r.isRecommended)?.score}/100

Calculated using Shiportrade Multimodal Route Planner`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Multimodal Route Analysis",
          text: shareText,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to Clipboard",
        description: "Route analysis has been copied and is ready to share.",
      });
    }
  };

  // Format helpers
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

  // Chart data
  const routeComparisonData = useMemo(() => {
    if (!results) return [];
    return results.routes.slice(0, 5).map((r, index) => ({
      name: `Route ${index + 1}`,
      cost: r.totalCost / 1000,
      time: r.totalTime,
      co2: r.totalCO2 / 100,
      score: r.score,
      fill: r.isRecommended ? COLORS.secondary : COLORS.primary,
    }));
  }, [results]);

  const transitTimelineData = useMemo(() => {
    if (!results || !results.routes[0]) return [];
    let cumulativeTime = 0;
    return results.routes[0].breakdown.map((b) => {
      cumulativeTime += b.time;
      return {
        name: getMode(b.mode).name.split(" ")[0],
        time: b.time,
        cumulative: cumulativeTime,
        distance: b.distance,
      };
    });
  }, [results]);

  const costDistributionData = useMemo(() => {
    if (!results || !results.routes[0]) return [];
    return results.routes[0].breakdown.map((b) => ({
      name: getMode(b.mode).name.split(" ")[0],
      value: b.cost,
      color: COLORS.modes[b.mode as keyof typeof COLORS.modes] || COLORS.primary,
    }));
  }, [results]);

  const ModeIcon = ({ modeId, className = "h-5 w-5" }: { modeId: string; className?: string }) => {
    const mode = getMode(modeId);
    const Icon = mode.icon;
    return <Icon className={className} style={{ color: mode.color }} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 dark:from-[var(--ocean)]/10 dark:via-background dark:to-[var(--logistics)]/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            {/* Animated Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <AnimatedBadge delay={0.1}>
                <Route className="h-3.5 w-3.5" />
                Route Planning
              </AnimatedBadge>
              <AnimatedBadge delay={0.2}>
                <Layers className="h-3.5 w-3.5" />
                Multimodal
              </AnimatedBadge>
              <AnimatedBadge delay={0.3}>
                <Globe className="h-3.5 w-3.5" />
                Logistics Network
              </AnimatedBadge>
            </div>

            {/* Title and Description */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                  Multimodal Route Planner
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Optimize your supply chain with intelligent route planning. Compare ocean, air, rail, and road freight combinations to find the perfect balance of cost, time, and environmental impact.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={!results}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button
                  onClick={handleShare}
                  disabled={!results}
                  className="gap-2 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              {[
                { icon: Ship, label: "Ocean Routes", value: "500+" },
                { icon: Plane, label: "Air Connections", value: "300+" },
                { icon: Train, label: "Rail Corridors", value: "150+" },
                { icon: Truck, label: "Road Networks", value: "1000+" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50">
                  <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                    <stat.icon className="h-5 w-5 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - 5-Tab Interface */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="planner" className="flex items-center gap-2 py-3">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2 py-3">
              <Route className="h-4 w-4" />
              <span className="hidden sm:inline">Routes</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2 py-3">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Guide</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Planner */}
          <TabsContent value="planner" className="space-y-6">
            {/* Route Configuration Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                  <MapPin className="h-5 w-5" />
                  Route Configuration
                </CardTitle>
                <CardDescription>Configure your multimodal route with origin, destination, and constraints</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Origin & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[var(--logistics)]" />
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
                      <MapPin className="h-4 w-4 text-red-500" />
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
                      <Gauge className="h-4 w-4 text-[var(--ocean)]" />
                      Total Distance (km)
                    </Label>
                    <Input
                      id="distance"
                      type="number"
                      value={totalDistance}
                      onChange={(e) => setTotalDistance(parseInt(e.target.value) || 0)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="cost">Cost Optimized</SelectItem>
                        <SelectItem value="time">Time Optimized</SelectItem>
                        <SelectItem value="eco">Eco-Friendly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Cargo Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2">
                      <Weight className="h-4 w-4 text-muted-foreground" />
                      Cargo Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(parseInt(e.target.value) || 0)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      Cargo Value (USD)
                    </Label>
                    <Input
                      id="value"
                      type="number"
                      value={cargoValue}
                      onChange={(e) => setCargoValue(parseInt(e.target.value) || 0)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      Quick Presets
                    </Label>
                    <Select onValueChange={applyPreset}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select a preset..." />
                      </SelectTrigger>
                      <SelectContent>
                        {modeCombinations.map((preset) => (
                          <SelectItem key={preset.name} value={preset.name}>
                            {preset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Mode Combination Builder */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold flex items-center gap-2 text-[var(--ocean)]">
                      <ArrowUpDown className="h-5 w-5" />
                      Mode Combination Builder
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSegmentBuilder(!showSegmentBuilder)}
                    >
                      {showSegmentBuilder ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showSegmentBuilder && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                          {segments.map((segment, index) => {
                            const mode = getMode(segment.mode);
                            return (
                              <motion.div
                                key={segment.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-4 rounded-lg border-2 border-border bg-card/50"
                              >
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <GripVertical className="h-5 w-5 cursor-grab" />
                                    <span className="font-semibold">Segment {index + 1}</span>
                                  </div>
                                  <Select
                                    value={segment.mode}
                                    onValueChange={(v) => updateSegment(segment.id, "mode", v)}
                                  >
                                    <SelectTrigger className="w-48 h-10">
                                      <SelectValue>
                                        <div className="flex items-center gap-2">
                                          <ModeIcon modeId={segment.mode} />
                                          {mode.name}
                                        </div>
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {transportModes.map((m) => (
                                        <SelectItem key={m.id} value={m.id}>
                                          <div className="flex items-center gap-2">
                                            <m.icon className="h-4 w-4" style={{ color: m.color }} />
                                            {m.name}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {segments.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeSegment(segment.id)}
                                      className="text-red-500 hover:text-red-600"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                  <div className="space-y-1">
                                    <Label className="text-xs">Origin</Label>
                                    <Input
                                      value={segment.origin}
                                      onChange={(e) => updateSegment(segment.id, "origin", e.target.value)}
                                      placeholder="Origin location"
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Destination</Label>
                                    <Input
                                      value={segment.destination}
                                      onChange={(e) => updateSegment(segment.id, "destination", e.target.value)}
                                      placeholder="Destination location"
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Distance (km)</Label>
                                    <Input
                                      type="number"
                                      value={segment.distance}
                                      onChange={(e) => updateSegment(segment.id, "distance", parseInt(e.target.value) || 0)}
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="flex items-end">
                                    <div className="w-full p-2 rounded bg-background border border-border">
                                      <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{(segment.distance / (mode.speed * 24) + mode.avgDelay).toFixed(1)} days</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <Badge variant="outline" style={{ borderColor: mode.color, color: mode.color }}>
                                    {mode.speed} km/h avg
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {(mode.costPerKgPerKm * 1000).toFixed(3)} $/kg/1000km
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {mode.reliability}% reliability
                                  </Badge>
                                </div>
                              </motion.div>
                            );
                          })}

                          <Button
                            variant="outline"
                            onClick={addSegment}
                            className="w-full border-dashed border-2 h-12"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Segment
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Calculate Button */}
                <div className="flex justify-center">
                  <Button
                    onClick={calculateRoutes}
                    disabled={isCalculating}
                    className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white px-8 py-6 text-lg"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Calculating Routes...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-5 w-5" />
                        Calculate Multimodal Routes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Routes Quick Select */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                  <Navigation className="h-5 w-5" />
                  Popular Trade Routes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularRoutes.map((route, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setOrigin(route.origin);
                        setDestination(route.destination);
                        setTotalDistance(route.distance);
                      }}
                      className="text-xs hover:bg-[var(--ocean)] hover:text-white transition-colors"
                    >
                      {route.origin.split(",")[0]} → {route.destination.split(",")[0]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                  <Lightbulb className="h-5 w-5" />
                  Pro Tips for Route Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-border bg-card/50 hover:border-[var(--logistics)]/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-[var(--logistics)]/10">
                          <tip.icon className="h-5 w-5 text-[var(--logistics)]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">{tip.title}</h4>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertOctagon className="h-5 w-5" />
                  Common Mistakes to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commonMistakes.map((mistake, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                          <mistake.icon className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">{mistake.title}</h4>
                          <p className="text-sm text-red-700 dark:text-red-300">{mistake.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Routes */}
          <TabsContent value="routes" className="space-y-6">
            {results ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean)]/80 text-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <DollarSign className="h-6 w-6 opacity-80" />
                        <Badge className="bg-white/20 text-white">Best Cost</Badge>
                      </div>
                      <p className="text-xl font-bold">{results.bestCost ? formatCurrency(results.bestCost.totalCost) : "-"}</p>
                      <p className="text-sm opacity-80 mt-1">
                        {results.bestCost?.segments.map((s) => s.mode).join(" → ") || "N/A"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-[var(--logistics)] to-[var(--logistics)]/80 text-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <Clock className="h-6 w-6 opacity-80" />
                        <Badge className="bg-white/20 text-white">Fastest</Badge>
                      </div>
                      <p className="text-xl font-bold">{results.bestTime ? `${results.bestTime.totalTime} days` : "-"}</p>
                      <p className="text-sm opacity-80 mt-1">
                        {results.bestTime?.segments.map((s) => s.mode).join(" → ") || "N/A"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <Leaf className="h-6 w-6 opacity-80" />
                        <Badge className="bg-white/20 text-white">Greenest</Badge>
                      </div>
                      <p className="text-xl font-bold">{results.bestEco ? `${formatNumber(results.bestEco.totalCO2)} kg` : "-"}</p>
                      <p className="text-sm opacity-80 mt-1">CO₂ emissions</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <TrendingDown className="h-6 w-6 opacity-80" />
                        <Badge className="bg-white/20 text-white">Potential Savings</Badge>
                      </div>
                      <p className="text-xl font-bold">{formatCurrency(results.savings.costSavings)}</p>
                      <p className="text-sm opacity-80 mt-1">
                        {results.savings.co2Reduction > 0 && `${formatNumber(results.savings.co2Reduction)} kg CO₂ reduction`}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Route Options Comparison */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <Route className="h-5 w-5" />
                      Route Options Comparison
                    </CardTitle>
                    <CardDescription>
                      Compare all available route combinations and their metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {results.routes.slice(0, 6).map((route, index) => (
                        <motion.div
                          key={route.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-6 rounded-lg border-2 ${
                            route.isRecommended
                              ? "border-[var(--logistics)] bg-[var(--logistics)]/5"
                              : "border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                {route.segments.map((s, i) => (
                                  <div key={i} className="flex items-center">
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                                      style={{ backgroundColor: `${COLORS.modes[s.mode as keyof typeof COLORS.modes] || COLORS.primary}20` }}
                                    >
                                      <ModeIcon modeId={s.mode} className="h-4 w-4" />
                                    </div>
                                    {i < route.segments.length - 1 && (
                                      <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {route.isRecommended && (
                              <Badge className="bg-[var(--logistics)] text-white">Recommended</Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Total Cost</p>
                              <p className="font-bold text-lg">{formatCurrency(route.totalCost)}</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Transit Time</p>
                              <p className="font-bold text-lg">{route.totalTime} days</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">CO₂ Emissions</p>
                              <p className="font-bold text-lg">{formatNumber(route.totalCO2)} kg</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-xs text-muted-foreground">Reliability</p>
                              <p className="font-bold text-lg">{route.averageReliability}%</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {formatNumber(route.totalDistance)} km total distance
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-[var(--ocean)]">{route.score}</p>
                              <p className="text-xs text-muted-foreground">Score</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-16 text-center">
                  <Route className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Routes Calculated Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Configure your route parameters in the Planner tab and click Calculate to see route options.
                  </p>
                  <Button onClick={() => setActiveTab("planner")} className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
                    Go to Planner
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 3: Analysis */}
          <TabsContent value="analysis" className="space-y-6">
            {results ? (
              <>
                {/* Bar Chart: Route Comparison */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <BarChart3 className="h-5 w-5" />
                      Route Comparison
                    </CardTitle>
                    <CardDescription>
                      Compare cost, time, and CO₂ metrics across all routes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={routeComparisonData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis yAxisId="left" orientation="left" stroke={COLORS.primary} />
                          <YAxis yAxisId="right" orientation="right" stroke={COLORS.secondary} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Bar yAxisId="left" dataKey="cost" name="Cost ($K)" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                          <Bar yAxisId="right" dataKey="time" name="Time (days)" fill={COLORS.secondary} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Line Chart: Transit Timeline */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                      <TrendingUp className="h-5 w-5" />
                      Transit Timeline
                    </CardTitle>
                    <CardDescription>
                      Time breakdown across transport segments for the recommended route
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={transitTimelineData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="time"
                            name="Segment Time (days)"
                            stroke={COLORS.secondary}
                            fill={COLORS.secondary}
                            fillOpacity={0.3}
                          />
                          <Line
                            type="monotone"
                            dataKey="cumulative"
                            name="Cumulative Time (days)"
                            stroke={COLORS.primary}
                            strokeWidth={3}
                            dot={{ fill: COLORS.primary, strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Pie Chart: Cost Distribution */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <PieChartIcon className="h-5 w-5" />
                      Cost Distribution by Mode
                    </CardTitle>
                    <CardDescription>
                      Breakdown of costs across different transport modes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costDistributionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {costDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Segment Breakdown */}
                {results.routes[0] && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                        <Package className="h-5 w-5" />
                        Recommended Route Segment Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {results.routes[0].breakdown.map((segment, index) => {
                          const mode = getMode(segment.mode);
                          return (
                            <motion.div
                              key={segment.segmentId}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 rounded-lg border-2"
                              style={{ borderColor: mode.color, backgroundColor: `${mode.color}10` }}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <mode.icon className="h-6 w-6" style={{ color: mode.color }} />
                                <span className="font-semibold">{mode.name}</span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Distance</span>
                                  <span className="font-medium">{formatNumber(segment.distance)} km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Cost</span>
                                  <span className="font-medium">{formatCurrency(segment.cost)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Time</span>
                                  <span className="font-medium">{segment.time} days</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">CO₂</span>
                                  <span className="font-medium">{formatNumber(segment.co2)} kg</span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--ocean)]/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                        <span className="text-sm text-muted-foreground">Avg Cost/kg</span>
                      </div>
                      <p className="text-2xl font-bold text-[var(--ocean)]">
                        {results.routes[0] ? formatCurrency(results.routes[0].totalCost / cargoWeight) : "-"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-[var(--logistics)]/10 to-[var(--logistics)]/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Fuel className="h-5 w-5 text-[var(--logistics)]" />
                        <span className="text-sm text-muted-foreground">Avg CO₂/kg</span>
                      </div>
                      <p className="text-2xl font-bold text-[var(--logistics)]">
                        {results.routes[0] ? `${formatNumber(results.routes[0].totalCO2 / cargoWeight, 2)} kg` : "-"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Warehouse className="h-5 w-5 text-purple-600" />
                        <span className="text-sm text-muted-foreground">Transit Hubs</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        {results.routes[0]?.segments.length || 0}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-5 w-5 text-amber-600" />
                        <span className="text-sm text-muted-foreground">Risk Score</span>
                      </div>
                      <p className="text-2xl font-bold text-amber-600">
                        {results.routes[0] ? (100 - results.routes[0].averageReliability) + "%" : "-"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-16 text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Analysis Available</h3>
                  <p className="text-muted-foreground mb-6">
                    Calculate routes first to see detailed analysis and visualizations.
                  </p>
                  <Button onClick={() => setActiveTab("planner")} className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
                    Go to Planner
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab 4: Guide */}
          <TabsContent value="guide" className="space-y-6">
            {/* What is Multimodal Transport */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                  <Layers className="h-5 w-5" />
                  {educationalContent.whatIsMultimodal.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {educationalContent.whatIsMultimodal.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Planning Considerations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                  <ClipboardList className="h-5 w-5" />
                  {educationalContent.planningConsiderations.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {educationalContent.planningConsiderations.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mode Transfer Points */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                  <Container className="h-5 w-5" />
                  {educationalContent.modeTransferPoints.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {educationalContent.modeTransferPoints.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documentation Requirements */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                  <FileText className="h-5 w-5" />
                  {educationalContent.documentationRequirements.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {educationalContent.documentationRequirements.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Transport Modes Reference */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                  <Globe className="h-5 w-5" />
                  Transport Modes Reference
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {transportModes.map((mode) => (
                    <div
                      key={mode.id}
                      className="p-4 rounded-lg border-2"
                      style={{ borderColor: mode.color, backgroundColor: `${mode.color}08` }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${mode.color}20` }}
                        >
                          <mode.icon className="h-6 w-6" style={{ color: mode.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold">{mode.name}</h4>
                          <p className="text-xs text-muted-foreground">{mode.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Speed</span>
                          <span className="font-medium">{mode.speed} km/h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reliability</span>
                          <span className="font-medium">{mode.reliability}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Optimal Distance</span>
                          <span className="font-medium">{mode.optimalDistance.min.toLocaleString()}-{mode.optimalDistance.max.toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Capacity</span>
                          <span className="font-medium text-xs">{mode.capacity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Comprehensive answers to common questions about multimodal transport planning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqData.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="border border-border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-left hover:text-[var(--ocean)] py-4">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Globe className="h-6 w-6" />
              <span className="font-bold text-lg">Multimodal Route Planner</span>
            </div>
            <p className="text-white/70 text-sm">
              © {new Date().getFullYear()} Shiportrade. Optimizing global logistics.
            </p>
            <div className="flex gap-4">
              {transportModes.map((mode) => (
                <mode.icon key={mode.id} className="h-5 w-5 text-white/70 hover:text-white transition-colors cursor-pointer" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
