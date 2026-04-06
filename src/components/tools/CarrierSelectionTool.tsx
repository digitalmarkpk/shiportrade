"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Ship,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Download,
  Share2,
  RefreshCw,
  Shield,
  Gauge,
  Percent,
  Activity,
  MapPin,
  DollarSign,
  Zap,
  Target,
  Award,
  Info,
  Building2,
  Route,
  Timer,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ChevronRight,
  Calculator,
  FileText,
  Lightbulb,
  AlertCircle,
  BookOpen,
  HelpCircle,
  CheckCircle,
  XCircle as XCircleIcon,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Major Ocean Carriers Data
const CARRIERS = {
  MAERSK: {
    name: "Maersk Line",
    code: "MSK",
    fleet: 708,
    teu: 4150000,
    region: "Global",
    established: 1904,
    alliance: "2M",
  },
  MSC: {
    name: "MSC",
    code: "MSC",
    fleet: 760,
    teu: 4800000,
    region: "Global",
    established: 1970,
    alliance: "2M",
  },
  CMA_CGM: {
    name: "CMA CGM",
    code: "CMDU",
    fleet: 566,
    teu: 3400000,
    region: "Global",
    established: 1978,
    alliance: "Ocean Alliance",
  },
  COSCO: {
    name: "COSCO Shipping",
    code: "COS",
    fleet: 507,
    teu: 2900000,
    region: "Global",
    established: 1961,
    alliance: "Ocean Alliance",
  },
  HAPAG: {
    name: "Hapag-Lloyd",
    code: "HLCU",
    fleet: 260,
    teu: 2100000,
    region: "Global",
    established: 1847,
    alliance: "THE Alliance",
  },
  EVERGREEN: {
    name: "Evergreen",
    code: "EGSU",
    fleet: 210,
    teu: 1650000,
    region: "Asia-Pacific",
    established: 1968,
    alliance: "Ocean Alliance",
  },
  ONE: {
    name: "ONE",
    code: "ONEY",
    fleet: 230,
    teu: 1600000,
    region: "Global",
    established: 2017,
    alliance: "THE Alliance",
  },
  YANG_MING: {
    name: "Yang Ming",
    code: "YMLU",
    fleet: 95,
    teu: 720000,
    region: "Asia-Pacific",
    established: 1972,
    alliance: "THE Alliance",
  },
  HMM: {
    name: "HMM",
    code: "HMM",
    fleet: 78,
    teu: 820000,
    region: "Asia-Pacific",
    established: 1976,
    alliance: "Independent",
  },
  ZIM: {
    name: "ZIM",
    code: "ZIM",
    fleet: 150,
    teu: 580000,
    region: "Global",
    established: 1945,
    alliance: "Independent",
  },
} as const;

// Carrier Performance Metrics
const CARRIER_PERFORMANCE: Record<keyof typeof CARRIERS, {
  scheduleReliability: number;
  vesselOnTime: number;
  bookingAcceptance: number;
  documentationAccuracy: number;
  claimRatio: number;
  overallScore: number;
  trend: "up" | "down" | "stable";
}> = {
  MAERSK: {
    scheduleReliability: 78.5,
    vesselOnTime: 82.3,
    bookingAcceptance: 91.2,
    documentationAccuracy: 96.8,
    claimRatio: 1.2,
    overallScore: 87.6,
    trend: "up",
  },
  MSC: {
    scheduleReliability: 72.1,
    vesselOnTime: 76.8,
    bookingAcceptance: 88.5,
    documentationAccuracy: 94.2,
    claimRatio: 1.8,
    overallScore: 82.1,
    trend: "stable",
  },
  CMA_CGM: {
    scheduleReliability: 75.8,
    vesselOnTime: 79.2,
    bookingAcceptance: 89.3,
    documentationAccuracy: 95.1,
    claimRatio: 1.5,
    overallScore: 84.3,
    trend: "up",
  },
  COSCO: {
    scheduleReliability: 74.2,
    vesselOnTime: 77.5,
    bookingAcceptance: 87.8,
    documentationAccuracy: 93.5,
    claimRatio: 1.6,
    overallScore: 81.9,
    trend: "up",
  },
  HAPAG: {
    scheduleReliability: 81.2,
    vesselOnTime: 84.6,
    bookingAcceptance: 92.1,
    documentationAccuracy: 97.2,
    claimRatio: 0.9,
    overallScore: 89.4,
    trend: "up",
  },
  EVERGREEN: {
    scheduleReliability: 76.5,
    vesselOnTime: 80.1,
    bookingAcceptance: 90.5,
    documentationAccuracy: 95.8,
    claimRatio: 1.3,
    overallScore: 85.8,
    trend: "stable",
  },
  ONE: {
    scheduleReliability: 79.8,
    vesselOnTime: 83.2,
    bookingAcceptance: 91.8,
    documentationAccuracy: 96.5,
    claimRatio: 1.1,
    overallScore: 88.2,
    trend: "up",
  },
  YANG_MING: {
    scheduleReliability: 71.3,
    vesselOnTime: 74.8,
    bookingAcceptance: 86.2,
    documentationAccuracy: 92.8,
    claimRatio: 2.1,
    overallScore: 79.2,
    trend: "down",
  },
  HMM: {
    scheduleReliability: 77.9,
    vesselOnTime: 81.5,
    bookingAcceptance: 89.7,
    documentationAccuracy: 95.3,
    claimRatio: 1.4,
    overallScore: 86.1,
    trend: "up",
  },
  ZIM: {
    scheduleReliability: 69.5,
    vesselOnTime: 73.2,
    bookingAcceptance: 85.8,
    documentationAccuracy: 91.5,
    claimRatio: 2.4,
    overallScore: 77.8,
    trend: "down",
  },
};

// Trade Lanes
const TRADE_LANES = [
  { id: "asia-europe", name: "Asia - Europe", origin: "Shanghai", destination: "Rotterdam" },
  { id: "asia-uswc", name: "Asia - US West Coast", origin: "Shanghai", destination: "Los Angeles" },
  { id: "asia-usec", name: "Asia - US East Coast", origin: "Shanghai", destination: "New York" },
  { id: "trans-atlantic", name: "Trans-Atlantic", origin: "Rotterdam", destination: "New York" },
  { id: "intra-asia", name: "Intra-Asia", origin: "Shanghai", destination: "Singapore" },
  { id: "asia-med", name: "Asia - Mediterranean", origin: "Shanghai", destination: "Genoa" },
] as const;

// Carrier Service Coverage
const SERVICE_COVERAGE: Record<keyof typeof CARRIERS, string[]> = {
  MAERSK: ["asia-europe", "asia-uswc", "asia-usec", "trans-atlantic", "intra-asia", "asia-med"],
  MSC: ["asia-europe", "asia-uswc", "asia-usec", "trans-atlantic", "intra-asia", "asia-med"],
  CMA_CGM: ["asia-europe", "asia-uswc", "asia-usec", "trans-atlantic", "intra-asia", "asia-med"],
  COSCO: ["asia-europe", "asia-uswc", "asia-usec", "intra-asia", "asia-med"],
  HAPAG: ["asia-europe", "asia-uswc", "asia-usec", "trans-atlantic", "asia-med"],
  EVERGREEN: ["asia-europe", "asia-uswc", "asia-usec", "intra-asia", "asia-med"],
  ONE: ["asia-europe", "asia-uswc", "asia-usec", "trans-atlantic", "intra-asia"],
  YANG_MING: ["asia-europe", "asia-uswc", "asia-usec", "intra-asia"],
  HMM: ["asia-europe", "asia-uswc", "asia-usec", "intra-asia"],
  ZIM: ["asia-uswc", "asia-usec", "trans-atlantic", "asia-med"],
};

// Transit Times (days)
const TRANSIT_TIMES: Record<keyof typeof CARRIERS, Record<string, number>> = {
  MAERSK: { "asia-europe": 32, "asia-uswc": 14, "asia-usec": 32, "trans-atlantic": 12, "intra-asia": 7, "asia-med": 28 },
  MSC: { "asia-europe": 34, "asia-uswc": 15, "asia-usec": 34, "trans-atlantic": 13, "intra-asia": 8, "asia-med": 30 },
  CMA_CGM: { "asia-europe": 31, "asia-uswc": 14, "asia-usec": 31, "trans-atlantic": 11, "intra-asia": 7, "asia-med": 27 },
  COSCO: { "asia-europe": 30, "asia-uswc": 13, "asia-usec": 30, "trans-atlantic": 12, "intra-asia": 6, "asia-med": 26 },
  HAPAG: { "asia-europe": 33, "asia-uswc": 15, "asia-usec": 33, "trans-atlantic": 10, "intra-asia": 8, "asia-med": 29 },
  EVERGREEN: { "asia-europe": 32, "asia-uswc": 14, "asia-usec": 32, "trans-atlantic": 12, "intra-asia": 6, "asia-med": 28 },
  ONE: { "asia-europe": 31, "asia-uswc": 14, "asia-usec": 31, "trans-atlantic": 11, "intra-asia": 7, "asia-med": 27 },
  YANG_MING: { "asia-europe": 34, "asia-uswc": 16, "asia-usec": 35, "intra-asia": 8 },
  HMM: { "asia-europe": 32, "asia-uswc": 13, "asia-usec": 32, "intra-asia": 7 },
  ZIM: { "asia-uswc": 14, "asia-usec": 33, "trans-atlantic": 12, "asia-med": 29 },
};

// Pricing Data ($/TEU)
const PRICING_DATA: Record<keyof typeof CARRIERS, Record<string, { base: number; peak: number; offPeak: number }>> = {
  MAERSK: { "asia-europe": { base: 1850, peak: 2800, offPeak: 1500 }, "asia-uswc": { base: 2200, peak: 3500, offPeak: 1800 }, "asia-usec": { base: 3200, peak: 4800, offPeak: 2600 }, "trans-atlantic": { base: 1600, peak: 2400, offPeak: 1300 }, "intra-asia": { base: 450, peak: 650, offPeak: 350 }, "asia-med": { base: 2100, peak: 3200, offPeak: 1700 } },
  MSC: { "asia-europe": { base: 1750, peak: 2700, offPeak: 1400 }, "asia-uswc": { base: 2100, peak: 3400, offPeak: 1700 }, "asia-usec": { base: 3100, peak: 4700, offPeak: 2500 }, "trans-atlantic": { base: 1550, peak: 2350, offPeak: 1250 }, "intra-asia": { base: 400, peak: 600, offPeak: 300 }, "asia-med": { base: 2000, peak: 3100, offPeak: 1600 } },
  CMA_CGM: { "asia-europe": { base: 1800, peak: 2750, offPeak: 1450 }, "asia-uswc": { base: 2150, peak: 3450, offPeak: 1750 }, "asia-usec": { base: 3150, peak: 4750, offPeak: 2550 }, "trans-atlantic": { base: 1580, peak: 2380, offPeak: 1280 }, "intra-asia": { base: 420, peak: 620, offPeak: 320 }, "asia-med": { base: 2050, peak: 3150, offPeak: 1650 } },
  COSCO: { "asia-europe": { base: 1700, peak: 2600, offPeak: 1350 }, "asia-uswc": { base: 2050, peak: 3300, offPeak: 1650 }, "asia-usec": { base: 3050, peak: 4600, offPeak: 2450 }, "trans-atlantic": { base: 1500, peak: 2300, offPeak: 1200 }, "intra-asia": { base: 380, peak: 580, offPeak: 280 }, "asia-med": { base: 1950, peak: 3000, offPeak: 1550 } },
  HAPAG: { "asia-europe": { base: 1900, peak: 2900, offPeak: 1550 }, "asia-uswc": { base: 2250, peak: 3600, offPeak: 1850 }, "asia-usec": { base: 3250, peak: 4900, offPeak: 2650 }, "trans-atlantic": { base: 1650, peak: 2450, offPeak: 1350 }, "intra-asia": { base: 480, peak: 680, offPeak: 380 }, "asia-med": { base: 2150, peak: 3250, offPeak: 1750 } },
  EVERGREEN: { "asia-europe": { base: 1820, peak: 2780, offPeak: 1480 }, "asia-uswc": { base: 2180, peak: 3480, offPeak: 1780 }, "asia-usec": { base: 3180, peak: 4780, offPeak: 2580 }, "trans-atlantic": { base: 1600, peak: 2400, offPeak: 1300 }, "intra-asia": { base: 400, peak: 600, offPeak: 300 }, "asia-med": { base: 2080, peak: 3180, offPeak: 1680 } },
  ONE: { "asia-europe": { base: 1830, peak: 2800, offPeak: 1490 }, "asia-uswc": { base: 2200, peak: 3500, offPeak: 1800 }, "asia-usec": { base: 3200, peak: 4800, offPeak: 2600 }, "trans-atlantic": { base: 1620, peak: 2420, offPeak: 1320 }, "intra-asia": { base: 410, peak: 610, offPeak: 310 }, "asia-med": { base: 2100, peak: 3200, offPeak: 1700 } },
  YANG_MING: { "asia-europe": { base: 1780, peak: 2700, offPeak: 1400 }, "asia-uswc": { base: 2100, peak: 3400, offPeak: 1700 }, "asia-usec": { base: 3100, peak: 4700, offPeak: 2500 }, "intra-asia": { base: 390, peak: 590, offPeak: 290 } },
  HMM: { "asia-europe": { base: 1760, peak: 2680, offPeak: 1380 }, "asia-uswc": { base: 2080, peak: 3350, offPeak: 1680 }, "asia-usec": { base: 3080, peak: 4650, offPeak: 2480 }, "intra-asia": { base: 385, peak: 585, offPeak: 285 } },
  ZIM: { "asia-uswc": { base: 2050, peak: 3300, offPeak: 1650 }, "asia-usec": { base: 3020, peak: 4580, offPeak: 2420 }, "trans-atlantic": { base: 1480, peak: 2280, offPeak: 1180 }, "asia-med": { base: 1920, peak: 2950, offPeak: 1520 } },
};

// Get rating badge color
const getRatingColor = (score: number): string => {
  if (score >= 90) return "#2E8B57"; // Logistics Green - Excellent
  if (score >= 80) return "#0F4C81"; // Ocean Blue - Good
  if (score >= 70) return "#F59E0B"; // Warning - Average
  if (score >= 60) return "#EF4444"; // Danger - Below Average
  return "#DC2626"; // Critical - Poor
};

const getRatingLabel = (score: number): string => {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Average";
  if (score >= 60) return "Below Average";
  return "Poor";
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up": return <ArrowUpRight className="h-4 w-4 text-[var(--logistics)]" />;
    case "down": return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    default: return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

// Pro Tips Data
const PRO_TIPS = [
  {
    icon: Clock,
    title: "Book Early During Peak Season",
    description: "Carrier capacity tightens significantly during August-October. Book 4-6 weeks in advance to secure space and better rates during peak shipping periods."
  },
  {
    icon: Shield,
    title: "Diversify Your Carrier Portfolio",
    description: "Don't rely on a single carrier. Maintain relationships with 2-3 carriers to ensure backup options during capacity crunches or service disruptions."
  },
  {
    icon: Target,
    title: "Align Carrier Selection with Cargo Type",
    description: "Match carriers to your specific cargo needs. Some carriers specialize in refrigerated containers, while others excel in project cargo or dangerous goods handling."
  },
  {
    icon: Globe,
    title: "Consider Total Landed Cost",
    description: "Factor in inland transportation costs from port of discharge. A slightly higher ocean freight might be offset by lower drayage costs to your final destination."
  },
  {
    icon: Zap,
    title: "Monitor Schedule Reliability",
    description: "Track carrier on-time performance metrics for your specific trade lanes. Reliable schedules can reduce inventory holding costs and improve supply chain planning."
  },
  {
    icon: Calendar,
    title: "Leverage Long-Term Contracts",
    description: "Volume commitments can secure favorable rates and guaranteed space. Negotiate annual contracts during market softness for year-round protection."
  }
];

// Common Mistakes Data
const COMMON_MISTAKES = [
  {
    icon: AlertCircle,
    title: "Choosing Based on Lowest Rate Only",
    description: "The lowest freight rate often comes with hidden costs like poor schedule reliability, longer transit times, or higher claim ratios. Always evaluate the total cost of service, including potential delays and their impact on your supply chain. A carrier that costs 10% more but delivers on time 95% of the time may actually be more economical than a cheaper carrier with 70% reliability."
  },
  {
    icon: XCircleIcon,
    title: "Ignoring Transit Time Variability",
    description: "Average transit times can be misleading. Some carriers have high variability, meaning your shipment might arrive in 25 days or 45 days. This uncertainty forces you to carry more safety stock, tying up working capital. Always review transit time consistency alongside average transit days when making carrier selection decisions."
  },
  {
    icon: AlertTriangle,
    title: "Overlooking Documentation Accuracy",
    description: "Carriers with poor documentation accuracy can cause customs delays, demurrage charges, and supply chain disruptions. A carrier that frequently mislabels cargo or makes errors on bills of lading can cost you thousands in additional fees and lost time, far exceeding any savings on freight rates."
  },
  {
    icon: Clock,
    title: "Not Planning for Peak Season Capacity",
    description: "During peak seasons (Q3-Q4), carrier capacity fills rapidly, and spot rates can double or triple. Companies without contracted space often face rolled bookings and extended delays. Develop a peak season strategy that includes early booking, alternative routing options, and buffer inventory."
  },
  {
    icon: Globe,
    title: "Neglecting Last-Mile Capabilities",
    description: "Your carrier choice should consider end-to-end logistics. Some carriers offer superior inland transportation networks and door-to-door services, while others focus purely on port-to-port movements. The total cost and reliability of your shipment often depends more on the landside portion than the ocean leg itself."
  }
];

// Educational Content
const EDUCATIONAL_CONTENT = {
  keyFactors: {
    title: "Key Factors in Carrier Selection",
    content: `Selecting the right ocean carrier is a critical decision that impacts your entire supply chain. The primary factors to consider include schedule reliability, which measures how consistently a carrier adheres to published sailing schedules. High reliability (80%+) means your cargo will arrive when expected, allowing for better inventory planning and reduced safety stock requirements. Transit time is another crucial factor, particularly for time-sensitive shipments or perishable goods. Consider both the average transit time and the variability, as inconsistent transit times can wreak havoc on just-in-time supply chains.

Cost remains a primary consideration, but it should be evaluated holistically. The freight rate is just one component; you must also factor in fuel surcharges (BAF), currency adjustment factors (CAF), origin and destination charges, and potential demurrage or detention fees. A carrier with slightly higher base rates but better schedule reliability may ultimately be more cost-effective when you account for reduced inventory carrying costs and fewer supply chain disruptions.

Service coverage and network reach are essential for companies with diverse sourcing or distribution needs. Carriers with extensive networks can serve multiple trade lanes under a single contract, simplifying vendor management and potentially unlocking volume discounts. Additionally, consider the carrier's financial stability and market position, as this affects their ability to maintain service levels during market downturns and invest in new vessels and technology.`
  },
  contracts: {
    title: "Understanding Carrier Contracts",
    content: `Ocean freight contracts come in several forms, each with distinct advantages and limitations. Service contracts are long-term agreements (typically 6-12 months) that commit to a certain volume in exchange for negotiated rates and guaranteed space. These contracts provide rate stability and space assurance but require accurate volume forecasting. Breaching volume commitments can result in penalties or loss of contracted rates.

Spot bookings are transactional arrangements made on a per-shipment basis at current market rates. While spot rates offer flexibility and no volume commitments, they expose shippers to market volatility and provide no space guarantees during peak periods. Spot rates can be 50-200% higher than contract rates during capacity crunches.

NVOCC (Non-Vessel Operating Common Carrier) arrangements allow freight forwarders to purchase carrier capacity in bulk and resell it to smaller shippers. This can provide access to carrier services without direct carrier relationships, though it typically comes at a premium. Understanding the pros and cons of each contract type is essential for developing a carrier strategy that balances cost, flexibility, and service reliability for your specific shipping patterns and business requirements.`
  },
  sla: {
    title: "Service Level Agreements",
    content: `Service Level Agreements (SLAs) with ocean carriers define performance expectations and remedies for service failures. Key SLA components include schedule reliability targets, typically expressed as a percentage of sailings departing and arriving within acceptable time windows. Industry average schedule reliability hovers around 70-75%, though top performers achieve 85%+. Your SLA should specify the minimum acceptable reliability level and what compensation or service credits apply when targets are missed.

Documentation accuracy is another critical SLA element. Errors in bills of lading, cargo manifests, or customs documentation can cause costly delays. A strong SLA will specify documentation accuracy targets (ideally 98%+) and define the carrier's liability for documentation-related delays. Transit time guarantees should outline expected transit times by trade lane and what remedies apply when shipments arrive late.

Effective SLAs also address booking confirmation timelines, equipment availability (containers), and communication protocols during service disruptions. The agreement should specify how and when the carrier must notify you of delays, vessel changes, or other issues affecting your cargo. Finally, ensure your SLA includes clear escalation procedures and performance review mechanisms to address recurring issues before they significantly impact your supply chain.`
  },
  riskManagement: {
    title: "Risk Management in Carrier Selection",
    content: `Carrier selection risk management involves identifying, assessing, and mitigating potential disruptions to your ocean freight operations. Financial risk assessment should include evaluating the carrier's financial health, credit rating, and market position. Financially unstable carriers may suddenly cease operations, leaving shippers scrambling to find alternative capacity. Monitor carrier financial reports and industry news for early warning signs.

Operational risks include schedule reliability issues, equipment shortages, and port congestion. Mitigate these by diversifying your carrier portfolio, maintaining relationships with 2-3 carriers per trade lane, and building buffer time into your supply chain planning. Consider carriers with strong track records during previous disruption events, such as pandemic-related capacity crunches or major port strikes.

Geopolitical risks increasingly affect ocean freight, from trade wars and sanctions to regional conflicts affecting key shipping routes like the Suez Canal or Strait of Hormuz. Stay informed about geopolitical developments and work with carriers that have flexible routing options and diverse vessel deployments. Contractual risk management should include force majeure clauses, clear liability limitations, and insurance requirements. Ensure your marine cargo insurance adequately covers the full value of your shipments and understand the carrier's liability limitations under international conventions.`
  }
};

// FAQ Data with comprehensive answers
const FAQ_DATA = [
  {
    question: "What is schedule reliability and why does it matter for carrier selection?",
    answer: `Schedule reliability measures how consistently an ocean carrier operates according to its published schedules, typically expressed as a percentage of voyages that depart and arrive within acceptable time windows. A carrier with 85% schedule reliability means 85 out of 100 voyages operate essentially on time. This metric is crucial because unreliable schedules create cascading problems throughout your supply chain. When vessels arrive late, your cargo may miss connecting transportation, causing inventory stockouts, production line stoppages, or missed sales opportunities.

The financial impact of poor schedule reliability extends far beyond the freight cost. Late arrivals force companies to carry additional safety stock, tying up working capital. They may trigger expedited shipping fees for alternative transportation, overtime costs at warehouses, or penalties from customers for late deliveries. Studies suggest that a 10% improvement in schedule reliability can reduce total supply chain costs by 2-5%. When evaluating carriers, look beyond average reliability to understand consistency across seasons and trade lanes. Some carriers maintain high reliability on major routes but struggle on secondary lanes.`
  },
  {
    question: "How do carrier alliances affect my shipping options and costs?",
    answer: `Carrier alliances are cooperative agreements between ocean carriers to share vessel capacity on specific trade routes. The three major global alliances are 2M (Maersk and MSC), Ocean Alliance (CMA CGM, COSCO, Evergreen, and others), and THE Alliance (Hapag-Lloyd, ONE, Yang Ming, and HMM). These alliances allow carriers to offer more frequent sailings and broader port coverage without each carrier deploying vessels on every route.

For shippers, alliances mean you can book cargo on vessels operated by alliance partners through your contracted carrier. This effectively expands your routing options and sailing frequency. If you have a contract with ONE, you can ship on Hapag-Lloyd vessels serving the same trade lane under THE Alliance arrangement. However, alliances also reduce competition, potentially leading to higher rates and less service differentiation.

The alliance structure also impacts service quality. While you book with one carrier, your cargo may sail on a partner's vessel with different equipment condition, crew quality, and operational standards. Schedule reliability can vary significantly between alliance members on shared routes. When selecting a carrier, understand their alliance partnerships and how this affects the actual vessel operating your cargo. Some shippers negotiate specific vessel operator requirements into their contracts.`
  },
  {
    question: "What is the difference between FCL and LCL and when should I use each?",
    answer: `FCL (Full Container Load) means you contract for exclusive use of an entire container, whether you fill it completely or not. You pay a flat rate for the container regardless of how much cargo is inside. FCL is typically more economical when your cargo volume exceeds about 15 cubic meters or approximately half a 20-foot container. FCL offers faster transit since the container moves intact from origin to destination without intermediate handling, reducing damage risk and handling charges.

LCL (Less than Container Load) consolidates your cargo with other shippers' goods in a shared container. You pay only for the space you use, making it cost-effective for smaller shipments. However, LCL involves additional handling at both origin ( consolidation) and destination (deconsolidation), adding time and cost. Transit times are typically 5-10 days longer than FCL for the same route. LCL also carries higher damage risk due to additional handling and proximity to other cargo.

Choose FCL when shipping volume justifies the cost, when you need faster transit, or when cargo requires special handling (temperature control, dangerous goods). Choose LCL for smaller shipments, when testing new markets, or when cash flow constraints favor lower upfront costs. Some companies use a hybrid approach, using LCL for slow-moving products while shipping high-volume SKUs via FCL.`
  },
  {
    question: "How do seasonal fluctuations affect carrier rates and availability?",
    answer: `Ocean freight rates exhibit significant seasonal patterns driven by consumer demand cycles, manufacturing patterns, and capacity dynamics. The most pronounced peak season runs from August through October, when retailers worldwide stock inventory for the holiday shopping season. During this period, Asia-Europe and Asia-North America rates typically increase 50-150% from annual lows, and carriers often experience capacity shortages leading to rolled bookings.

Pre-Chinese New Year (January-February) represents another peak as shippers rush cargo before factories close for the holiday. Conversely, February-March typically sees soft rates and ample capacity as post-holiday demand slumps. Understanding these patterns allows strategic shipping decisions: booking early for peak season needs, leveraging lower rates during soft periods, and building inventory buffers before capacity crunches.

Beyond calendar seasons, unexpected events can create sudden rate spikes and capacity shortages. The 2021 Suez Canal blockage, port congestion crises, and pandemic-related disruptions all demonstrated how quickly market conditions can change. Develop contingency plans that include alternative routing options, buffer inventory for critical items, and carrier relationships that provide priority access during capacity constraints. Long-term service contracts with volume commitments offer protection against spot market volatility but require accurate forecasting to avoid over-commitment penalties.`
  },
  {
    question: "What are demurrage and detention charges and how can I avoid them?",
    answer: `Demurrage and detention (D&D) charges are fees assessed by carriers when containers are held beyond free time allowances. Demurrage applies while containers remain at the port terminal beyond the free period, typically 5-7 days after vessel arrival for imports. Detention charges apply when containers are held outside the terminal, such as at your warehouse, beyond the allowed free time, typically 3-5 days for imports. Rates vary by port and carrier but can exceed $200 per container per day.

These charges accumulate rapidly, potentially exceeding the original freight cost for delayed shipments. Common causes include customs clearance delays, documentation errors, port congestion preventing container pickup, warehouse capacity constraints, and holiday closures. To minimize D&D exposure, ensure all documentation is accurate and submitted promptly, monitor vessel arrival schedules to begin customs clearance before cargo arrives, and coordinate closely with truckers for timely container pickup and return.

Negotiate extended free time in your carrier contracts, especially for shipments destined to locations with known delays. Some carriers offer free time of 14+ days on specific routes as a contract incentive. Consider using container tracking technology to monitor free time countdowns and receive alerts before charges accrue. For recurring issues at specific ports or with certain carriers, conduct root cause analysis to identify systemic problems and work with partners on process improvements.`
  },
  {
    question: "What should I consider when choosing between different container types?",
    answer: `Container selection impacts both cost and cargo safety, making it an important carrier selection factor. Standard containers (20'GP, 40'GP, 40'HC) suit most general cargo. Choose 40'HC (High Cube) for voluminous but lightweight cargo, as it provides 12% more internal volume at minimal additional cost. For heavy cargo, 20' containers typically offer better payload capacity per cubic meter than 40' containers, though this varies by carrier and vessel type.

Specialized containers address specific cargo needs. Refrigerated (reefer) containers maintain temperature-controlled environments for perishables, pharmaceuticals, and temperature-sensitive products. Open-top containers suit over-height cargo that won't fit through standard container doors, while flat rack containers handle over-width and over-length cargo. Tank containers transport bulk liquids, and ventilated containers provide airflow for cargoes requiring ventilation.

When selecting container types, consider total cost implications beyond the base freight rate. Specialized equipment often commands premium rates and may have limited availability during peak seasons. Reefer containers require power connections and monitoring, adding handling complexity. Some carriers have newer, better-maintained fleets than others, impacting container condition and potential for cargo damage. Inspect containers before loading for damage, cleanliness, and weather-tightness, and document any issues to protect against liability disputes.`
  },
  {
    question: "How can I evaluate a carrier's environmental and sustainability performance?",
    answer: `Carrier sustainability performance is increasingly important for companies with environmental commitments and carbon reporting requirements. Key metrics include the Carbon Intensity Indicator (CII), an IMO-mandated rating system (A to E) measuring vessel efficiency. Carriers with better CII ratings operate newer, more efficient vessels and employ operational measures like slow steaming and route optimization. Request carrier CII data when evaluating options.

Consider carriers' investment in alternative fuels and technologies. Leading carriers are investing in LNG-powered vessels, methanol-ready ships, and exploring ammonia and hydrogen propulsion. These investments signal long-term commitment to decarbonization and may provide future competitive advantages as regulations tighten. Carriers participating in green corridor initiatives demonstrate proactive sustainability engagement.

Sustainability reporting transparency varies significantly. Look for carriers publishing annual sustainability reports with verified emissions data, science-based targets for emissions reduction, and clear roadmaps for achieving net-zero goals. Some carriers offer carbon offsetting programs or low-carbon fuel options, though these typically come at premium rates. For accurate Scope 3 emissions reporting, carriers providing verified Well-to-Wake (WTW) emissions data offer more complete information than those reporting only Tank-to-Wake (TTW) figures.`
  },
  {
    question: "What role do freight forwarders play in carrier selection?",
    answer: `Freight forwarders serve as intermediaries between shippers and carriers, offering services ranging from basic booking arrangements to comprehensive supply chain management. They leverage consolidated volumes to negotiate rates with carriers that individual shippers could not achieve, potentially offering cost savings for smaller volume shippers. Forwarders also provide market intelligence on rate trends, carrier performance, and routing options.

For shippers without dedicated logistics resources, forwarders handle documentation, customs clearance, insurance, and coordination with multiple carriers, simplifying the shipping process. They can serve as a single point of contact across multiple trade lanes and transportation modes, providing visibility and control that would require significant internal resources to replicate. Forwarders often have established relationships with carriers that can be valuable during capacity crunches when securing space is challenging.

However, using forwarders means less direct control over carrier selection and potential communication delays. Forwarder margins add cost, typically 3-10% above carrier rates, though this may be offset by their negotiating leverage. Some shippers use a hybrid approach, contracting directly with carriers for core volume while using forwarders for spot needs and secondary routes. When selecting a forwarder, evaluate their carrier relationships, technology capabilities, and track record on your specific trade lanes.`
  }
];

interface CarrierSelectionToolProps {
  onCarrierSelect?: (carrier: string) => void;
}

export function CarrierSelectionTool({ onCarrierSelect }: CarrierSelectionToolProps) {
  const [activeTab, setActiveTab] = useState("calculator");
  const [selectedLane, setSelectedLane] = useState<string>("asia-europe");
  const [containerType, setContainerType] = useState<"20GP" | "40GP" | "40HC">("40GP");
  const [containerCount, setContainerCount] = useState<number>(1);
  const [season, setSeason] = useState<"peak" | "offPeak" | "base">("base");
  const [exportSuccess, setExportSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  // Priority weights for recommendation
  const [priorities, setPriorities] = useState({
    cost: 30,
    reliability: 30,
    transitTime: 20,
    coverage: 20,
  });

  // Calculate recommendation scores
  const recommendations = useMemo(() => {
    const laneCarriers = Object.entries(SERVICE_COVERAGE)
      .filter(([, lanes]) => lanes.includes(selectedLane))
      .map(([carrierKey]) => carrierKey as keyof typeof CARRIERS);

    const scored = laneCarriers.map((carrierKey) => {
      const carrier = CARRIERS[carrierKey];
      const performance = CARRIER_PERFORMANCE[carrierKey];
      const transitTime = TRANSIT_TIMES[carrierKey][selectedLane] || 0;
      const pricing = PRICING_DATA[carrierKey][selectedLane] || { base: 0, peak: 0, offPeak: 0 };
      
      // Normalize scores (0-100)
      const maxTransit = Math.max(...laneCarriers.map(c => TRANSIT_TIMES[c][selectedLane] || 0));
      const minPrice = Math.min(...laneCarriers.map(c => PRICING_DATA[c][selectedLane]?.[season] || Infinity));
      const maxPrice = Math.max(...laneCarriers.map(c => PRICING_DATA[c][selectedLane]?.[season] || 0));
      
      // Cost score (lower is better, so invert)
      const costScore = maxPrice > minPrice 
        ? 100 - ((pricing[season] - minPrice) / (maxPrice - minPrice)) * 100 
        : 50;
      
      // Transit time score (lower is better)
      const transitScore = maxTransit > 0 
        ? 100 - ((transitTime / maxTransit) * 100) 
        : 50;
      
      // Reliability score
      const reliabilityScore = performance.overallScore;
      
      // Coverage score
      const coverageScore = (SERVICE_COVERAGE[carrierKey].length / 6) * 100;
      
      // Weighted total score
      const totalScore = (
        (costScore * priorities.cost / 100) +
        (reliabilityScore * priorities.reliability / 100) +
        (transitScore * priorities.transitTime / 100) +
        (coverageScore * priorities.coverage / 100)
      );

      return {
        key: carrierKey,
        carrier,
        performance,
        transitTime,
        pricing: pricing[season],
        costScore,
        reliabilityScore,
        transitScore,
        coverageScore,
        totalScore,
      };
    });

    return scored.sort((a, b) => b.totalScore - a.totalScore);
  }, [selectedLane, season, priorities]);

  // Best recommendation
  const bestCarrier = recommendations[0];

  // Radar data for comparison
  const radarData = useMemo(() => {
    if (recommendations.length < 2) return [];
    
    const top2 = recommendations.slice(0, 2);
    return [
      { metric: "Cost", carrier1: top2[0].costScore, carrier2: top2[1]?.costScore || 0 },
      { metric: "Reliability", carrier1: top2[0].reliabilityScore, carrier2: top2[1]?.reliabilityScore || 0 },
      { metric: "Transit", carrier1: top2[0].transitScore, carrier2: top2[1]?.transitScore || 0 },
      { metric: "Coverage", carrier1: top2[0].coverageScore, carrier2: top2[1]?.coverageScore || 0 },
      { metric: "Overall", carrier1: top2[0].totalScore, carrier2: top2[1]?.totalScore || 0 },
    ];
  }, [recommendations]);

  // Container multiplier - must be declared before use in useMemo hooks
  const containerMultiplier = containerType === "40HC" ? 1.1 : containerType === "40GP" ? 1.0 : 0.6;

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    secondary: "#6366F1",
  };

  // Bar chart data for carrier scoring
  const barChartData = useMemo(() => {
    return recommendations.slice(0, 6).map(r => ({
      name: r.carrier.code,
      "Total Score": Math.round(r.totalScore),
      "Cost Score": Math.round(r.costScore),
      "Reliability": Math.round(r.reliabilityScore),
    }));
  }, [recommendations]);

  // Pie chart data for cost breakdown
  const pieChartData = useMemo(() => {
    if (!bestCarrier) return [];
    const baseRate = Math.round(bestCarrier.pricing * containerMultiplier * containerCount);
    const baf = Math.round(baseRate * 0.12); // Bunker Adjustment Factor ~12%
    const caf = Math.round(baseRate * 0.03); // Currency Adjustment Factor ~3%
    const otherSurcharges = Math.round(baseRate * 0.08); // Other surcharges ~8%
    
    return [
      { name: "Base Freight", value: baseRate, color: "#0F4C81" },
      { name: "BAF", value: baf, color: "#2E8B57" },
      { name: "CAF", value: caf, color: "#F59E0B" },
      { name: "Other Surcharges", value: otherSurcharges, color: "#6366F1" },
    ];
  }, [bestCarrier, containerMultiplier, containerCount]);

  // Reset function
  const handleReset = useCallback(() => {
    setSelectedLane("asia-europe");
    setContainerType("40GP");
    setContainerCount(1);
    setSeason("base");
    setPriorities({ cost: 30, reliability: 30, transitTime: 20, coverage: 20 });
  }, []);

  // Export function
  const handleExport = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      shipmentDetails: {
        tradeLane: selectedLane,
        containerType,
        containerCount,
        season,
      },
      priorities,
      recommendations: recommendations.slice(0, 5).map(r => ({
        carrier: r.carrier.name,
        code: r.carrier.code,
        totalScore: r.totalScore.toFixed(2),
        pricing: Math.round(r.pricing * containerMultiplier * containerCount),
        transitTime: r.transitTime,
      })),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carrier-selection-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  }, [selectedLane, containerType, containerCount, season, priorities, recommendations, containerMultiplier]);

  // Share function
  const handleShare = useCallback(async () => {
    const shareText = `Carrier Selection Results
Trade Lane: ${TRADE_LANES.find(l => l.id === selectedLane)?.name}
Containers: ${containerCount} x ${containerType}
Season: ${season}

Top Recommendation: ${bestCarrier?.carrier.name}
Score: ${bestCarrier?.totalScore.toFixed(1)}/100
Estimated Cost: $${bestCarrier ? Math.round(bestCarrier.pricing * containerMultiplier * containerCount).toLocaleString() : 0}
Transit Time: ${bestCarrier?.transitTime} days

Generated by Shiportrade Carrier Selection Tool`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  }, [selectedLane, containerType, containerCount, season, bestCarrier, containerMultiplier]);

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-2xl p-6 md:p-8 border border-border/50">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 animate-pulse">
            <Ship className="h-3 w-3 mr-1" />
            Carrier Management
          </Badge>
          <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20 animate-pulse delay-100">
            <Building2 className="h-3 w-3 mr-1" />
            Vendor Selection
          </Badge>
          <Badge className="bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20 animate-pulse delay-200">
            <Globe className="h-3 w-3 mr-1" />
            Logistics Optimization
          </Badge>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Carrier Selection Tool
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Compare ocean carriers across reliability, cost, transit time, and coverage metrics to find the optimal partner for your shipping needs.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" onClick={handleExport} className={exportSuccess ? "border-[var(--logistics)] text-[var(--logistics)]" : ""}>
              {exportSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Exported!
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
            <Button variant="default" onClick={handleShare} className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
              {shareSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
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
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-1">
            <Calculator className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1">
            <GitCompare className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4 md:mr-1" />
            <span className="hidden md:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Shipment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-[var(--ocean)]" />
                  Shipment Details
                </CardTitle>
                <CardDescription>Enter your shipment requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Trade Lane</Label>
                  <Select value={selectedLane} onValueChange={setSelectedLane}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_LANES.map((lane) => (
                        <SelectItem key={lane.id} value={lane.id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {lane.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Container Type</Label>
                    <Select value={containerType} onValueChange={(v) => setContainerType(v as typeof containerType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20GP">20&apos; GP</SelectItem>
                        <SelectItem value="40GP">40&apos; GP</SelectItem>
                        <SelectItem value="40HC">40&apos; HC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Number of Containers</Label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={containerCount}
                      onChange={(e) => setContainerCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Shipping Season</Label>
                  <Select value={season} onValueChange={(v) => setSeason(v as typeof season)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Standard Season
                        </div>
                      </SelectItem>
                      <SelectItem value="peak">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-red-500" />
                          Peak Season (Aug-Oct)
                        </div>
                      </SelectItem>
                      <SelectItem value="offPeak">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-[var(--logistics)]" />
                          Off-Peak Season
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-[var(--ocean)]/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Route className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Selected Route</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{TRADE_LANES.find(l => l.id === selectedLane)?.origin}</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium">{TRADE_LANES.find(l => l.id === selectedLane)?.destination}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Weights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--logistics)]" />
                  Priority Weights
                </CardTitle>
                <CardDescription>Adjust what matters most for your shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Cost Priority
                      </Label>
                      <span className="font-bold text-[var(--ocean)]">{priorities.cost}%</span>
                    </div>
                    <Slider
                      value={[priorities.cost]}
                      onValueChange={(v) => setPriorities(prev => ({ ...prev, cost: v[0] }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Reliability Priority
                      </Label>
                      <span className="font-bold text-[var(--logistics)]">{priorities.reliability}%</span>
                    </div>
                    <Slider
                      value={[priorities.reliability]}
                      onValueChange={(v) => setPriorities(prev => ({ ...prev, reliability: v[0] }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        Transit Time Priority
                      </Label>
                      <span className="font-bold text-[var(--warning)]">{priorities.transitTime}%</span>
                    </div>
                    <Slider
                      value={[priorities.transitTime]}
                      onValueChange={(v) => setPriorities(prev => ({ ...prev, transitTime: v[0] }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Coverage Priority
                      </Label>
                      <span className="font-bold text-[var(--secondary)]">{priorities.coverage}%</span>
                    </div>
                    <Slider
                      value={[priorities.coverage]}
                      onValueChange={(v) => setPriorities(prev => ({ ...prev, coverage: v[0] }))}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Priority Distribution</p>
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div className="bg-[var(--ocean)]" style={{ width: `${priorities.cost}%` }} />
                    <div className="bg-[var(--logistics)]" style={{ width: `${priorities.reliability}%` }} />
                    <div className="bg-[var(--warning)]" style={{ width: `${priorities.transitTime}%` }} />
                    <div className="bg-[var(--secondary)]" style={{ width: `${priorities.coverage}%` }} />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                    <span>Cost</span>
                    <span>Reliability</span>
                    <span>Transit</span>
                    <span>Coverage</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Recommendation Preview */}
          <Card className="border-[var(--logistics)]/30 bg-[var(--logistics)]/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--logistics)]" />
                Top Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bestCarrier && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-[var(--ocean)] flex items-center justify-center text-white font-bold text-lg">
                      {bestCarrier.carrier.code}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{bestCarrier.carrier.name}</h3>
                      <p className="text-muted-foreground">Score: {bestCarrier.totalScore.toFixed(1)}/100</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{bestCarrier.carrier.alliance}</Badge>
                        <span className="text-sm text-muted-foreground">{bestCarrier.carrier.region}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[var(--ocean)]">
                      ${Math.round(bestCarrier.pricing * containerMultiplier * containerCount).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {bestCarrier.transitTime} days transit
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => onCarrierSelect?.(bestCarrier.key)}
                    >
                      Select Carrier
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Score Rankings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--ocean)]" />
                Carrier Score Rankings
              </CardTitle>
              <CardDescription>Overall scores based on your priority weights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((r, index) => (
                  <div 
                    key={r.key}
                    className={`p-4 rounded-lg border ${index === 0 ? 'border-[var(--logistics)]/30 bg-[var(--logistics)]/5' : 'border-border'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-[var(--logistics)] text-white' : 'bg-muted text-muted-foreground'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{r.carrier.name}</p>
                          <p className="text-xs text-muted-foreground">{r.carrier.code} | {r.carrier.alliance}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <Progress value={r.totalScore} className="h-2" />
                        </div>
                        <span className="font-bold text-lg w-12 text-right" style={{ color: getRatingColor(r.totalScore) }}>
                          {r.totalScore.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bar Chart - Carrier Scoring */}
            <Card>
              <CardHeader>
                <CardTitle>Carrier Scoring Comparison</CardTitle>
                <CardDescription>Multi-factor score breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Total Score" fill={chartColors.ocean} name="Total" />
                      <Bar dataKey="Cost Score" fill={chartColors.logistics} name="Cost" />
                      <Bar dataKey="Reliability" fill={chartColors.warning} name="Reliability" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart - Multi-factor Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Multi-Factor Comparison</CardTitle>
                <CardDescription>Top 2 carriers across all dimensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name={recommendations[0]?.carrier.name}
                        dataKey="carrier1"
                        stroke={chartColors.ocean}
                        fill={chartColors.ocean}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Radar
                        name={recommendations[1]?.carrier.name}
                        dataKey="carrier2"
                        stroke={chartColors.logistics}
                        fill={chartColors.logistics}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pie Chart - Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                Estimated Cost Breakdown
              </CardTitle>
              <CardDescription>Based on top recommendation - excludes origin/destination charges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {pieChartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold">${item.value.toLocaleString()}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between p-3 bg-[var(--ocean)]/10 rounded-lg">
                    <span className="font-bold">Total Estimated Cost</span>
                    <span className="font-bold text-[var(--ocean)]">
                      ${pieChartData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Comparison */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Carrier Comparison Matrix
              </CardTitle>
              <CardDescription>Compare carriers serving the {TRADE_LANES.find(l => l.id === selectedLane)?.name} route</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Carrier</th>
                      <th className="text-center p-3">Overall Score</th>
                      <th className="text-center p-3">Reliability</th>
                      <th className="text-center p-3">Transit</th>
                      <th className="text-center p-3">Price</th>
                      <th className="text-center p-3">Trend</th>
                      <th className="text-center p-3">Alliance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.map((r, index) => (
                      <tr 
                        key={r.key} 
                        className={`border-b hover:bg-muted/50 cursor-pointer transition-colors ${index === 0 ? 'bg-[var(--logistics)]/10' : ''}`}
                        onClick={() => onCarrierSelect?.(r.key)}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {index === 0 && (
                              <div className="w-6 h-6 rounded-full bg-[var(--logistics)] flex items-center justify-center">
                                <Star className="h-3 w-3 text-white" />
                              </div>
                            )}
                            <div className="w-10 h-10 rounded bg-[var(--ocean)] flex items-center justify-center text-white font-bold text-xs">
                              {r.carrier.code}
                            </div>
                            <div>
                              <p className="font-medium">{r.carrier.name}</p>
                              <p className="text-xs text-muted-foreground">{r.carrier.region}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span 
                              className="text-lg font-bold"
                              style={{ color: getRatingColor(r.totalScore) }}
                            >
                              {r.totalScore.toFixed(1)}
                            </span>
                            <Progress value={r.totalScore} className="w-16 h-2" />
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Badge 
                            className="text-white"
                            style={{ backgroundColor: getRatingColor(r.reliabilityScore) }}
                          >
                            {r.reliabilityScore.toFixed(0)}%
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-medium">{r.transitTime} days</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="font-medium text-[var(--ocean)]">
                            ${Math.round(r.pricing * containerMultiplier).toLocaleString()}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {getTrendIcon(r.performance.trend)}
                        </td>
                        <td className="p-3 text-center">
                          <Badge variant="outline">{r.carrier.alliance}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Details */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--logistics)]" />
                  Schedule Reliability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.slice(0, 5).map((r) => (
                    <div key={r.key} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{r.carrier.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={r.performance.scheduleReliability} className="w-24 h-2" />
                        <span className="text-sm font-bold w-12 text-right">{r.performance.scheduleReliability}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[var(--warning)]" />
                  Documentation Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.slice(0, 5).map((r) => (
                    <div key={r.key} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{r.carrier.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={r.performance.documentationAccuracy} className="w-24 h-2" />
                        <span className="text-sm font-bold w-12 text-right">{r.performance.documentationAccuracy}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Educational Content Sections */}
          {Object.entries(EDUCATIONAL_CONTENT).map(([key, section]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[var(--ocean)]" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pro Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--warning)]" />
                Pro Tips & Best Practices
              </CardTitle>
              <CardDescription>Actionable insights for optimal carrier selection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {PRO_TIPS.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <div key={index} className="p-4 border border-border rounded-lg hover:border-[var(--ocean)]/30 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                          <Icon className="h-5 w-5 text-[var(--ocean)]" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{tip.title}</h4>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from these common pitfalls in carrier selection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => {
                  const Icon = mistake.icon;
                  return (
                    <div key={index} className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <Icon className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{mistake.title}</h4>
                          <p className="text-sm text-muted-foreground">{mistake.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              <CardDescription>Comprehensive answers to common carrier selection questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pt-2">
                        {faq.answer}
                      </div>
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

// GitCompare icon fallback
function GitCompare({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="18" cy="18" r="3" />
      <circle cx="6" cy="6" r="3" />
      <path d="M13 6h3a2 2 0 0 1 2 2v7" />
      <path d="M11 18H8a2 2 0 0 1-2-2V9" />
    </svg>
  );
}
