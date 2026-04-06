"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  DollarSign,
  AlertTriangle,
  Info,
  Building2,
  Ship,
  Container,
  Calculator,
  TrendingUp,
  ArrowRight,
  Download,
  Share2,
  MapPin,
  Lightbulb,
  HelpCircle,
  GitBranch,
  BarChart3,
  PieChart,
  FileText,
  CheckCircle2,
  XCircle,
  Clock4,
  Globe,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Shield,
  Target,
  LineChart as LineChartIcon,
  Activity,
  Wallet,
  Timer,
  RefreshCw,
  ArrowDownUp,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  ComposedChart,
} from "recharts";
import { toast } from "sonner";

interface DemurrageResult {
  demurrageDays: number;
  detentionDays: number;
  demurrageCost: number;
  detentionCost: number;
  totalCost: number;
  dailyRate: number;
  savingsPotential: number;
  freeTimeUsed: number;
  averageCostPerDay: number;
  effectiveDailyRate: number;
}

// Extended port rates data with more detail
const portRates: Record<string, { name: string; country: string; demurrageRate: number; detentionRate: number; freeDays: number; region: string; tieredRates?: { days: number; multiplier: number }[] }> = {
  US_LAX: { name: "Los Angeles", country: "USA", demurrageRate: 310, detentionRate: 175, freeDays: 5, region: "North America", tieredRates: [{ days: 5, multiplier: 1 }, { days: 10, multiplier: 1.5 }, { days: 999, multiplier: 2 }] },
  US_NY: { name: "New York", country: "USA", demurrageRate: 350, detentionRate: 200, freeDays: 5, region: "North America", tieredRates: [{ days: 5, multiplier: 1 }, { days: 10, multiplier: 1.5 }, { days: 999, multiplier: 2 }] },
  US_LGB: { name: "Long Beach", country: "USA", demurrageRate: 305, detentionRate: 170, freeDays: 5, region: "North America", tieredRates: [{ days: 5, multiplier: 1 }, { days: 10, multiplier: 1.5 }, { days: 999, multiplier: 2 }] },
  US_SAV: { name: "Savannah", country: "USA", demurrageRate: 280, detentionRate: 155, freeDays: 5, region: "North America" },
  US_OAK: { name: "Oakland", country: "USA", demurrageRate: 295, detentionRate: 165, freeDays: 5, region: "North America" },
  US_SEA: { name: "Seattle", country: "USA", demurrageRate: 275, detentionRate: 150, freeDays: 5, region: "North America" },
  EU_ROT: { name: "Rotterdam", country: "Netherlands", demurrageRate: 180, detentionRate: 120, freeDays: 4, region: "Europe" },
  EU_HAM: { name: "Hamburg", country: "Germany", demurrageRate: 195, detentionRate: 135, freeDays: 4, region: "Europe" },
  EU_ANT: { name: "Antwerp", country: "Belgium", demurrageRate: 175, detentionRate: 115, freeDays: 4, region: "Europe" },
  UK_FEL: { name: "Felixstowe", country: "UK", demurrageRate: 200, detentionRate: 140, freeDays: 4, region: "Europe" },
  UK_LON: { name: "London Gateway", country: "UK", demurrageRate: 210, detentionRate: 145, freeDays: 4, region: "Europe" },
  ES_BAR: { name: "Barcelona", country: "Spain", demurrageRate: 165, detentionRate: 110, freeDays: 4, region: "Europe" },
  IT_GEN: { name: "Genoa", country: "Italy", demurrageRate: 170, detentionRate: 115, freeDays: 4, region: "Europe" },
  FR_MAR: { name: "Marseille", country: "France", demurrageRate: 160, detentionRate: 105, freeDays: 4, region: "Europe" },
  CN_SHA: { name: "Shanghai", country: "China", demurrageRate: 75, detentionRate: 50, freeDays: 7, region: "Asia" },
  CN_SHE: { name: "Shenzhen", country: "China", demurrageRate: 70, detentionRate: 45, freeDays: 7, region: "Asia" },
  CN_NGB: { name: "Ningbo", country: "China", demurrageRate: 68, detentionRate: 42, freeDays: 7, region: "Asia" },
  CN_QIN: { name: "Qingdao", country: "China", demurrageRate: 65, detentionRate: 40, freeDays: 7, region: "Asia" },
  CN_TIA: { name: "Tianjin", country: "China", demurrageRate: 62, detentionRate: 38, freeDays: 7, region: "Asia" },
  HK_HKG: { name: "Hong Kong", country: "Hong Kong", demurrageRate: 120, detentionRate: 80, freeDays: 5, region: "Asia" },
  SG_SIN: { name: "Singapore", country: "Singapore", demurrageRate: 150, detentionRate: 100, freeDays: 5, region: "Asia" },
  JP_TKY: { name: "Tokyo", country: "Japan", demurrageRate: 140, detentionRate: 95, freeDays: 5, region: "Asia" },
  JP_YOK: { name: "Yokohama", country: "Japan", demurrageRate: 145, detentionRate: 98, freeDays: 5, region: "Asia" },
  JP_KOB: { name: "Kobe", country: "Japan", demurrageRate: 135, detentionRate: 92, freeDays: 5, region: "Asia" },
  KR_BUS: { name: "Busan", country: "South Korea", demurrageRate: 110, detentionRate: 75, freeDays: 6, region: "Asia" },
  TW_KHH: { name: "Kaohsiung", country: "Taiwan", demurrageRate: 95, detentionRate: 65, freeDays: 6, region: "Asia" },
  AU_SYD: { name: "Sydney", country: "Australia", demurrageRate: 220, detentionRate: 160, freeDays: 3, region: "Oceania" },
  AU_MEL: { name: "Melbourne", country: "Australia", demurrageRate: 215, detentionRate: 155, freeDays: 3, region: "Oceania" },
  IN_MUM: { name: "Mumbai", country: "India", demurrageRate: 85, detentionRate: 55, freeDays: 5, region: "Asia" },
  IN_NVA: { name: "Nava Sheva", country: "India", demurrageRate: 80, detentionRate: 52, freeDays: 5, region: "Asia" },
  UAE_DXB: { name: "Dubai", country: "UAE", demurrageRate: 165, detentionRate: 110, freeDays: 5, region: "Middle East" },
  SA_JED: { name: "Jeddah", country: "Saudi Arabia", demurrageRate: 140, detentionRate: 95, freeDays: 5, region: "Middle East" },
  BR_SAN: { name: "Santos", country: "Brazil", demurrageRate: 190, detentionRate: 130, freeDays: 5, region: "South America" },
  MX_MAN: { name: "Manzanillo", country: "Mexico", demurrageRate: 175, detentionRate: 120, freeDays: 5, region: "North America" },
};

const carrierRates: Record<string, { name: string; rateMultiplier: number; logo?: string; combinedFreeTime?: boolean }> = {
  MSC: { name: "MSC", rateMultiplier: 1.0, combinedFreeTime: true },
  MAERSK: { name: "Maersk", rateMultiplier: 1.05, combinedFreeTime: true },
  CMA: { name: "CMA CGM", rateMultiplier: 0.95 },
  COSCO: { name: "COSCO", rateMultiplier: 0.9, combinedFreeTime: true },
  HAPAG: { name: "Hapag-Lloyd", rateMultiplier: 1.1 },
  ONE: { name: "ONE", rateMultiplier: 1.0 },
  EVERGREEN: { name: "Evergreen", rateMultiplier: 0.95 },
  YANGMING: { name: "Yang Ming", rateMultiplier: 0.85 },
  HMM: { name: "HMM", rateMultiplier: 0.9 },
  ZIM: { name: "ZIM", rateMultiplier: 1.15 },
  PIL: { name: "PIL", rateMultiplier: 0.8 },
  WANHAI: { name: "Wan Hai", rateMultiplier: 0.85 },
};

const containerTypes = [
  { id: "20st", name: "20' Standard", multiplier: 0.7, description: "Standard dry container" },
  { id: "40st", name: "40' Standard", multiplier: 1.0, description: "Standard dry container" },
  { id: "40hc", name: "40' High Cube", multiplier: 1.1, description: "Extra height container" },
  { id: "45hc", name: "45' High Cube", multiplier: 1.25, description: "Maximum capacity dry" },
  { id: "reefer", name: "Reefer", multiplier: 1.5, description: "Temperature controlled" },
  { id: "ot", name: "Open Top", multiplier: 1.3, description: "For over-height cargo" },
  { id: "fr", name: "Flat Rack", multiplier: 1.4, description: "For OOG cargo" },
];

const COLORS = ["#0F4C81", "#2E8B57", "#f59e0b", "#ef4444", "#8b5cf6"];

const faqData = [
  {
    question: "What is the difference between Demurrage and Detention charges?",
    answer: "Demurrage and Detention (D&D) charges are two distinct fees that apply at different stages of the container journey. Demurrage is charged by the terminal when your full container stays at the port beyond the allocated free time period. This fee compensates the terminal for storage space and helps manage port congestion. Detention, on the other hand, is charged by the shipping line when you keep the empty container outside the terminal beyond the allowed free time. This fee compensates the carrier for the container being unavailable for other shipments. Understanding this distinction is crucial because different parties charge these fees and they apply during different phases of the logistics chain. Demurrage applies while the container is still at the port, while detention applies after the container has left the port and until it's returned empty to the designated location."
  },
  {
    question: "How is free time calculated and can it be extended?",
    answer: "Free time represents the grace period during which you can store or use containers without incurring additional charges. For demurrage, free time typically starts when the container is discharged from the vessel and ends when it's picked up from the terminal. For detention, free time begins when you pick up the full container and ends when you return the empty container. Standard free time varies by port, carrier, and cargo type, usually ranging from 3 to 7 days. You can often negotiate extended free time in your service contract, especially if you're a high-volume shipper. Some carriers offer 'combined free time' which gives you a total number of days to split between demurrage and detention as needed. To extend free time, contact your carrier before the initial period expires and be prepared to pay a premium or demonstrate business need. Many ports also offer extended free time during peak seasons or for specific commodity types, so always check the current terms."
  },
  {
    question: "What factors influence D&D rates across different ports?",
    answer: "Several key factors determine D&D rates at different ports worldwide. Port congestion levels play a major role - busy ports like Los Angeles and New York typically have higher rates to discourage extended storage. Labor costs and terminal operating expenses in each country affect the base rates significantly. Regional regulations and government policies can impose additional fees or caps. Container availability and trade imbalance (whether there's surplus or shortage of containers in the region) influence carrier pricing strategies. The competitive landscape among terminals in the same region can lead to rate variations. Seasonal factors such as peak shipping seasons before holidays often trigger higher rates. Infrastructure quality and terminal capacity constraints also matter - modern, efficient terminals may charge less due to faster processing. Understanding these factors helps you plan shipments strategically, potentially routing through ports with more favorable D&D terms."
  },
  {
    question: "How can I effectively dispute or reduce D&D charges?",
    answer: "Disputing D&D charges requires documentation, timing, and knowledge of your rights. First, document everything - keep records of all communications, terminal receipts, carrier notifications, and proof of circumstances beyond your control. If delays were caused by port congestion, labor strikes, customs holds, or carrier errors, you have grounds for dispute. Submit your dispute in writing within the carrier's specified timeframe (usually 30-90 days). Cite specific contract terms and reference any industry regulations or local laws that support your case. For legitimate disputes, request a full waiver; for partial responsibility, negotiate a reduced amount. Build relationships with carrier representatives who can advocate for you. Consider using a D&D management platform that tracks free time and automates dispute documentation. Join industry associations that provide collective bargaining power and resources for challenging unfair charges. Finally, pattern recognition matters - if certain carriers or routes consistently generate disputes, adjust your logistics strategy accordingly."
  },
  {
    question: "What are the legal obligations regarding D&D charges?",
    answer: "D&D charges are governed by a complex interplay of maritime law, carrier tariffs, and local regulations. Under maritime law, carriers have the right to charge for container usage beyond agreed terms, but they must follow their published tariff rules. In the United States, the Federal Maritime Commission (FMC) has issued rules requiring carriers to justify D&D charges and demonstrate that fees serve a legitimate purpose. The 2022 Ocean Shipping Reform Act gave the FMC additional authority to investigate and penalize unreasonable D&D practices. Similar regulatory oversight exists in the EU, Australia, and other major trading regions. Your bill of lading constitutes a contract that specifies D&D terms, so review it carefully. You have the right to receive advance notice of charges, clear explanation of calculation methods, and fair opportunity to dispute. However, legal obligations also extend to shippers - you must exercise reasonable diligence to return containers promptly. Understanding your contractual rights and filing complaints with relevant authorities when necessary are essential strategies for fair treatment."
  },
  {
    question: "How do different carriers vary in their D&D policies?",
    answer: "Major ocean carriers have developed distinct D&D policies that can significantly impact your total shipping costs. Maersk often implements higher base rates but offers comprehensive digital tools for tracking and managing free time. MSC typically uses standard rates with flexible negotiation options for contract customers. CMA CGM provides combined demurrage-detention programs that simplify calculations. COSCO and OOCL tend to offer more competitive rates on Asia-origin routes. Hapag-Lloyd's policies include detailed exemption clauses for certain circumstances. ONE (Ocean Network Express) focuses on transparency with clear breakdown communications. ZIM often charges premium rates but provides reliable service on specific trade lanes. Beyond base rates, carriers differ in how they handle: free time extensions (some offer automatic extensions during port congestion), notification requirements, dispute resolution processes, peak season surcharges, and reefer container handling. Smart shippers maintain carrier comparison matrices, negotiate customized terms based on volume, and maintain flexibility to route cargo through carriers offering favorable D&D terms for specific corridors."
  },
  {
    question: "What strategies can help minimize D&D costs?",
    answer: "Minimizing D&D costs requires a multi-pronged approach spanning planning, operations, and technology. Pre-arrival preparation is crucial: file customs documentation before vessel arrival, secure import permits in advance, and arrange terminal appointments early. Establish relationships with reliable trucking providers who can guarantee pickup times. Consider using a chassis pool to eliminate wait times for equipment. Negotiate extended free time in your service contracts, especially for ports with known congestion issues. Technology solutions include real-time container tracking systems, automated alerts for free time expiration, and D&D calculators for scenario planning. Operationally, consider using container yards or off-dock facilities that offer lower storage rates than terminals. For high-volume shipments, negotiate flat-rate D&D caps or all-in pricing. Time your shipments to avoid peak seasons when ports are congested. For exports, ensure cargo is ready before container delivery to minimize empty container dwell time. Finally, maintain detailed records to dispute any erroneous charges and identify patterns that can inform future logistics decisions."
  },
  {
    question: "What is combined free time and how does it benefit shippers?",
    answer: "Combined free time is an innovative approach offered by select carriers that merges demurrage and detention free time into a single, flexible pool of days. Instead of having separate allocations for port storage (demurrage) and container usage outside the port (detention), shippers receive a total number of days to distribute between both phases as needed. This flexibility is particularly valuable for shipments where either demurrage or detention might typically exceed standard limits. For example, if your cargo requires extended port storage but quick turnaround after pickup, combined free time allows you to allocate more days to demurrage without wasting detention days. Carriers like MSC, COSCO, and Maersk offer combined free time programs, though terms vary. The main benefits include reduced risk of charges from uneven time distribution, simplified tracking and planning, and better alignment with actual operational needs. When negotiating service contracts, ask about combined free time options, as they can significantly reduce D&D exposure for certain trade patterns and cargo types."
  },
  {
    question: "How do tiered D&D rates work and what do they mean for costs?",
    answer: "Tiered D&D rates represent a progressive pricing structure where daily charges increase as containers remain beyond free time for longer periods. This approach is increasingly common at congested ports and among major carriers. Under a typical tiered system, the first several days beyond free time might be charged at the standard rate, followed by progressively higher rates for extended delays. For example, days 1-5 might cost $200/day, days 6-10 jump to $300/day, and day 11+ could reach $400/day. This structure creates strong incentives for quick container turnover and helps terminals manage capacity. For shippers, tiered rates mean that extended delays become exponentially more expensive, making proactive planning even more critical. When calculating potential costs, always check whether your destination port or carrier uses tiered rates. Factor these escalating costs into your supply chain decisions, and prioritize rapid turnaround at ports with aggressive tiered pricing. Some carriers offer tiered rate calculators on their platforms, and our calculator above can help estimate costs under different scenarios."
  },
  {
    question: "What documentation should I maintain for D&D management?",
    answer: "Effective D&D management requires comprehensive documentation throughout the shipment lifecycle. Start with your service contract, noting all free time provisions, rate structures, and special terms. Maintain copies of bills of lading, which specify D&D liability terms. Track vessel arrival dates, container availability notices, and free time start/end dates from carriers. Document all terminal transactions including gate-in/gate-out timestamps, and keep delivery orders and pickup receipts. When delays occur, document the cause with supporting evidence: port congestion notices, carrier communications, customs holds, weather events, or labor disruptions. Screenshot carrier portal notifications and save email alerts about free time expiration. For disputes, compile a complete timeline with all relevant communications. Many D&D disputes succeed or fail based on documentation quality. Consider implementing a document management system that automatically captures and organizes D&D-related records. Well-maintained documentation not only supports successful disputes but also helps identify patterns and optimize future shipments."
  },
];

// Carrier comparison data for visualization
const carrierComparisonData = [
  { carrier: "MSC", demurrage: 200, detention: 120, combinedFreeTime: true, rating: 4.2 },
  { carrier: "Maersk", demurrage: 210, detention: 126, combinedFreeTime: true, rating: 4.5 },
  { carrier: "CMA CGM", demurrage: 190, detention: 114, combinedFreeTime: false, rating: 4.0 },
  { carrier: "COSCO", demurrage: 180, detention: 108, combinedFreeTime: true, rating: 3.8 },
  { carrier: "Hapag-Lloyd", demurrage: 220, detention: 132, combinedFreeTime: false, rating: 4.3 },
  { carrier: "ONE", demurrage: 200, detention: 120, combinedFreeTime: false, rating: 4.1 },
  { carrier: "Evergreen", demurrage: 190, detention: 114, combinedFreeTime: false, rating: 3.9 },
  { carrier: "Yang Ming", demurrage: 170, detention: 102, combinedFreeTime: false, rating: 3.7 },
];

export function DemurrageCalculator() {
  const [port, setPort] = useState<string>("US_LAX");
  const [carrier, setCarrier] = useState<string>("MSC");
  const [containerType, setContainerType] = useState<string>("40st");
  const [containerCount, setContainerCount] = useState<string>("1");
  const [arrivalDate, setArrivalDate] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<string>("");
  const [returnDate, setReturnDate] = useState<string>("");
  const [customFreeDays, setCustomFreeDays] = useState<string>("");
  const [customDemurrageRate, setCustomDemurrageRate] = useState<string>("");
  const [customDetentionRate, setCustomDetentionRate] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");
  const calculatorRef = useRef<HTMLDivElement>(null);

  const calculation = useMemo<DemurrageResult>(() => {
    const selectedPort = portRates[port];
    const selectedCarrier = carrierRates[carrier];
    const selectedContainer = containerTypes.find((c) => c.id === containerType);
    const numContainers = parseInt(containerCount) || 1;

    const freeDays = customFreeDays ? parseInt(customFreeDays) : selectedPort.freeDays;
    const demurrageRateBase = customDemurrageRate
      ? parseFloat(customDemurrageRate)
      : selectedPort.demurrageRate;
    const detentionRateBase = customDetentionRate
      ? parseFloat(customDetentionRate)
      : selectedPort.detentionRate;

    const demurrageRate =
      demurrageRateBase *
      selectedCarrier.rateMultiplier *
      (selectedContainer?.multiplier || 1);
    const detentionRate =
      detentionRateBase *
      selectedCarrier.rateMultiplier *
      (selectedContainer?.multiplier || 1);

    let demurrageDays = 0;
    let detentionDays = 0;
    let freeTimeUsed = 0;

    if (arrivalDate && pickupDate) {
      const arrival = new Date(arrivalDate);
      const pickup = new Date(pickupDate);
      const daysUntilPickup = Math.ceil((pickup.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
      freeTimeUsed = Math.min(daysUntilPickup, freeDays);
      demurrageDays = Math.max(0, daysUntilPickup - freeDays);
    }

    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      const daysUntilReturn = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
      const detentionFreeDays = 4;
      detentionDays = Math.max(0, daysUntilReturn - detentionFreeDays);
    }

    const demurrageCost = demurrageDays * demurrageRate * numContainers;
    const detentionCost = detentionDays * detentionRate * numContainers;
    const totalCost = demurrageCost + detentionCost;
    const savingsPotential = (demurrageCost + detentionCost) * 0.4;
    const totalDays = demurrageDays + detentionDays;
    const averageCostPerDay = totalDays > 0 ? totalCost / totalDays : 0;
    const effectiveDailyRate = demurrageRate;

    return {
      demurrageDays,
      detentionDays,
      demurrageCost,
      detentionCost,
      totalCost,
      dailyRate: demurrageRate,
      savingsPotential,
      freeTimeUsed,
      averageCostPerDay,
      effectiveDailyRate,
    };
  }, [
    port,
    carrier,
    containerType,
    containerCount,
    arrivalDate,
    pickupDate,
    returnDate,
    customFreeDays,
    customDemurrageRate,
    customDetentionRate,
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const selectedPort = portRates[port];

  // Timeline data for visualization
  const timelineData = useMemo(() => {
    const data = [];
    const maxDays = Math.max(20, calculation.demurrageDays + calculation.detentionDays + calculation.freeTimeUsed + 8);
    
    for (let i = 0; i <= maxDays; i++) {
      let status = "free";
      let dailyCost = 0;
      if (i > calculation.freeTimeUsed && i <= calculation.freeTimeUsed + calculation.demurrageDays) {
        status = "demurrage";
        dailyCost = calculation.dailyRate;
      } else if (i > calculation.freeTimeUsed + calculation.demurrageDays) {
        status = "detention";
        dailyCost = calculation.dailyRate * 0.6;
      }
      data.push({
        day: i,
        cost: i <= calculation.freeTimeUsed ? 0 : 
              i <= calculation.freeTimeUsed + calculation.demurrageDays ? 
                (i - calculation.freeTimeUsed) * calculation.dailyRate :
                calculation.demurrageCost + (i - calculation.freeTimeUsed - calculation.demurrageDays) * calculation.dailyRate * 0.6,
        status,
        dailyCost,
      });
    }
    return data;
  }, [calculation]);

  // Port comparison data
  const portComparisonData = useMemo(() => {
    return Object.entries(portRates)
      .map(([code, data]) => ({
        name: data.name,
        demurrage: data.demurrageRate,
        detention: data.detentionRate,
        total: data.demurrageRate + data.detentionRate,
        region: data.region,
        freeDays: data.freeDays,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
  }, []);

  // Cost breakdown data
  const costBreakdownData = useMemo(() => {
    return [
      { name: "Demurrage Charges", value: calculation.demurrageCost, color: "#0F4C81" },
      { name: "Detention Charges", value: calculation.detentionCost, color: "#2E8B57" },
      { name: "Potential Savings", value: calculation.savingsPotential, color: "#f59e0b" },
    ];
  }, [calculation]);

  // Region comparison data
  const regionComparisonData = useMemo(() => {
    const regionMap = new Map<string, { total: number; count: number; demurrage: number; detention: number }>();
    Object.values(portRates).forEach(port => {
      const existing = regionMap.get(port.region) || { total: 0, count: 0, demurrage: 0, detention: 0 };
      regionMap.set(port.region, {
        total: existing.total + port.demurrageRate + port.detentionRate,
        count: existing.count + 1,
        demurrage: existing.demurrage + port.demurrageRate,
        detention: existing.detention + port.detentionRate,
      });
    });
    return Array.from(regionMap.entries()).map(([region, data]) => ({
      region,
      avgDemurrage: Math.round(data.demurrage / data.count),
      avgDetention: Math.round(data.detention / data.count),
      avgTotal: Math.round(data.total / data.count),
      portCount: data.count,
    }));
  }, []);

  // Weekly trend data (simulated)
  const weeklyTrendData = useMemo(() => {
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i * 7);
      weeks.push({
        week: `Week ${12 - i}`,
        demurrage: Math.round(150 + Math.random() * 100),
        detention: Math.round(80 + Math.random() * 60),
        total: Math.round(230 + Math.random() * 160),
      });
    }
    return weeks;
  }, []);

  const handleExport = () => {
    const data = {
      calculation: {
        port: selectedPort.name,
        carrier: carrierRates[carrier].name,
        containerType: containerTypes.find(c => c.id === containerType)?.name,
        containerCount,
        dates: { arrivalDate, pickupDate, returnDate },
        result: calculation,
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dd-calculation-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Calculation exported successfully!");
  };

  const handleShare = async () => {
    const shareData = {
      title: "D&D Calculation",
      text: `Total D&D Charges: ${formatCurrency(calculation.totalCost)} at ${selectedPort.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(
        `D&D Calculation: ${formatCurrency(calculation.totalCost)} at ${selectedPort.name}\nDemurrage: ${formatCurrency(calculation.demurrageCost)} (${calculation.demurrageDays} days)\nDetention: ${formatCurrency(calculation.detentionCost)} (${calculation.detentionDays} days)`
      );
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8" ref={calculatorRef}>
      {/* Enhanced Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl"
      >
        {/* Background gradient */}
        <div 
          className="absolute inset-0 opacity-5 dark:opacity-10"
          style={{
            background: `linear-gradient(135deg, #0F4C81 0%, #2E8B57 50%, #0F4C81 100%)`,
          }}
        />
        
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
            style={{ backgroundColor: "#0F4C81" }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full opacity-20"
            style={{ backgroundColor: "#2E8B57" }}
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative px-6 py-8 md:px-10 md:py-12">
          {/* Top badge row */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
          >
            <Badge 
              className="px-4 py-1.5 text-sm font-medium"
              style={{ 
                backgroundColor: "rgba(15, 76, 129, 0.15)", 
                color: "#0F4C81",
                borderColor: "rgba(15, 76, 129, 0.3)"
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Professional Tool
            </Badge>
            <Badge 
              className="px-4 py-1.5 text-sm font-medium"
              style={{ 
                backgroundColor: "rgba(46, 139, 87, 0.15)", 
                color: "#2E8B57",
                borderColor: "rgba(46, 139, 87, 0.3)"
              }}
            >
              <Clock4 className="h-4 w-4 mr-2" />
              Real-time Calculation
            </Badge>
            <Badge 
              className="px-4 py-1.5 text-sm font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
            >
              <Globe className="h-4 w-4 mr-2" />
              35+ Global Ports
            </Badge>
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Demurrage & Detention Calculator
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Calculate port storage charges with precision. Compare rates across 35+ global ports, 
              analyze carrier policies, and discover strategies to minimize your D&D costs.
            </p>
          </motion.div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Total D&D Cost",
                value: formatCurrency(calculation.totalCost),
                subLabel: `${calculation.demurrageDays + calculation.detentionDays} chargeable days`,
                icon: DollarSign,
                color: calculation.totalCost > 0 ? "#ef4444" : "#2E8B57",
                bgColor: calculation.totalCost > 0 ? "rgba(239, 68, 68, 0.1)" : "rgba(46, 139, 87, 0.1)",
                delay: 0.4,
              },
              {
                label: "Demurrage",
                value: formatCurrency(calculation.demurrageCost),
                subLabel: `${calculation.demurrageDays} days at port`,
                icon: Building2,
                color: "#0F4C81",
                bgColor: "rgba(15, 76, 129, 0.1)",
                delay: 0.5,
              },
              {
                label: "Detention",
                value: formatCurrency(calculation.detentionCost),
                subLabel: `${calculation.detentionDays} days outside`,
                icon: Container,
                color: "#2E8B57",
                bgColor: "rgba(46, 139, 87, 0.1)",
                delay: 0.6,
              },
              {
                label: "Savings Potential",
                value: formatCurrency(calculation.savingsPotential),
                subLabel: "40% reduction possible",
                icon: TrendingUp,
                color: "#f59e0b",
                bgColor: "rgba(245, 158, 11, 0.1)",
                delay: 0.7,
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: metric.delay }}
              >
                <Card className="relative overflow-hidden h-full">
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: metric.color }}
                  />
                  <CardContent className="pt-5 pb-4 px-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          {metric.label}
                        </p>
                        <p 
                          className="text-2xl md:text-3xl font-bold mb-1"
                          style={{ color: metric.color }}
                        >
                          {metric.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {metric.subLabel}
                        </p>
                      </div>
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: metric.bgColor }}
                      >
                        <metric.icon className="h-5 w-5" style={{ color: metric.color }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Share Results"}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab("tips")}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Cost Saving Tips
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ports Covered", value: "35+", icon: MapPin, color: "#0F4C81" },
          { label: "Carriers", value: "12", icon: Ship, color: "#2E8B57" },
          { label: "Container Types", value: "7", icon: Container, color: "#f59e0b" },
          { label: "FAQs", value: "10", icon: HelpCircle, color: "#8b5cf6" },
        ].map((stat) => (
          <div 
            key={stat.label}
            className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border"
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 5-Tab Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-4xl mx-auto h-auto">
          <TabsTrigger value="calculator" className="flex flex-col sm:flex-row items-center gap-1.5 py-3">
            <Calculator className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex flex-col sm:flex-row items-center gap-1.5 py-3">
            <GitBranch className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex flex-col sm:flex-row items-center gap-1.5 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Port Rates</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex flex-col sm:flex-row items-center gap-1.5 py-3">
            <Lightbulb className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Tips</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex flex-col sm:flex-row items-center gap-1.5 py-3">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs sm:text-sm">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="calculator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-8"
            >
              {/* Input Section */}
              <div className="space-y-6">
                {/* Route & Carrier */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Ship className="h-5 w-5" style={{ color: "#2E8B57" }} />
                      Route & Carrier Configuration
                    </CardTitle>
                    <CardDescription>
                      Select your port of discharge and shipping carrier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Port of Discharge</Label>
                        <Select value={port} onValueChange={setPort}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-64">
                            {Object.entries(portRates).map(([code, data]) => (
                              <SelectItem key={code} value={code}>
                                {data.name}, {data.country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Carrier</Label>
                        <Select value={carrier} onValueChange={setCarrier}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(carrierRates).map(([code, data]) => (
                              <SelectItem key={code} value={code}>
                                <div className="flex items-center gap-2">
                                  {data.name}
                                  {data.combinedFreeTime && (
                                    <Badge variant="outline" className="text-xs ml-2">Combined</Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Container Type</Label>
                        <Select value={containerType} onValueChange={setContainerType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {containerTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    </div>

                    {/* Port Info Badge */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {selectedPort.region}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {selectedPort.freeDays} Free Days
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ${selectedPort.demurrageRate}/day Dem
                      </Badge>
                      {carrierRates[carrier].combinedFreeTime && (
                        <Badge 
                          className="text-xs"
                          style={{ backgroundColor: "rgba(46, 139, 87, 0.15)", color: "#2E8B57" }}
                        >
                          <Layers className="h-3 w-3 mr-1" />
                          Combined Free Time
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" style={{ color: "#0F4C81" }} />
                      Important Dates
                    </CardTitle>
                    <CardDescription>
                      Enter key dates to calculate potential charges
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="arrivalDate">Container Arrival at Port</Label>
                      <Input
                        id="arrivalDate"
                        type="date"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Container Pickup (Gate Out)</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnDate">Empty Return (Gate In)</Label>
                      <Input
                        id="returnDate"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Custom Rates */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" style={{ color: "#2E8B57" }} />
                      Custom Rates (Optional)
                    </CardTitle>
                    <CardDescription>
                      Override default rates with contract-specific values
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="freeDays">Free Days</Label>
                        <Input
                          id="freeDays"
                          type="number"
                          min="0"
                          placeholder={String(selectedPort.freeDays)}
                          value={customFreeDays}
                          onChange={(e) => setCustomFreeDays(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="demRate">Demurrage $/day</Label>
                        <Input
                          id="demRate"
                          type="number"
                          min="0"
                          placeholder={String(selectedPort.demurrageRate)}
                          value={customDemurrageRate}
                          onChange={(e) => setCustomDemurrageRate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="detRate">Detention $/day</Label>
                        <Input
                          id="detRate"
                          type="number"
                          min="0"
                          placeholder={String(selectedPort.detentionRate)}
                          value={customDetentionRate}
                          onChange={(e) => setCustomDetentionRate(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {/* Main Result */}
                <Card className={`overflow-hidden ${calculation.totalCost > 0 ? "border-red-200 dark:border-red-800" : "border-green-200 dark:border-green-800"}`}>
                  <div className={`h-2 ${calculation.totalCost > 0 ? "bg-red-500" : "bg-green-500"}`} />
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      D&D Charges Estimate
                    </CardTitle>
                    <CardDescription>
                      Demurrage & Detention calculation for {selectedPort.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {calculation.totalCost > 0 ? (
                      <div className="space-y-4">
                        <div className="text-center py-6">
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-bold text-red-600 dark:text-red-400"
                          >
                            {formatCurrency(calculation.totalCost)}
                          </motion.div>
                          <div className="text-lg text-muted-foreground mt-1">
                            Total D&D Charges
                          </div>
                          {calculation.averageCostPerDay > 0 && (
                            <div className="text-sm text-muted-foreground mt-2">
                              Average {formatCurrency(calculation.averageCostPerDay)}/day
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span>Demurrage</span>
                              <Badge variant="secondary" className="text-xs">
                                {calculation.demurrageDays} days
                              </Badge>
                            </div>
                            <span className="font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(calculation.demurrageCost)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-2">
                            <div className="flex items-center gap-2">
                              <Container className="h-4 w-4 text-muted-foreground" />
                              <span>Detention</span>
                              <Badge variant="secondary" className="text-xs">
                                {calculation.detentionDays} days
                              </Badge>
                            </div>
                            <span className="font-medium text-red-600 dark:text-red-400">
                              {formatCurrency(calculation.detentionCost)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}>
                          <div className="flex items-center gap-2" style={{ color: "#f59e0b" }}>
                            <TrendingUp className="h-5 w-5" />
                            <span className="font-semibold">
                              Potential Savings: {formatCurrency(calculation.savingsPotential)}
                            </span>
                          </div>
                          <p className="text-xs mt-1 opacity-80">
                            By reducing delays by 40%, you could save this amount
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(46, 139, 87, 0.1)" }}>
                          <CheckCircle2 className="h-8 w-8" style={{ color: "#2E8B57" }} />
                        </div>
                        <div className="text-xl font-semibold" style={{ color: "#2E8B57" }}>
                          No D&D Charges
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Container is within free time or no dates entered
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Port Rates Summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Port Rates Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-3 text-center text-sm">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold text-lg" style={{ color: "#0F4C81" }}>{selectedPort.freeDays}</div>
                        <div className="text-xs text-muted-foreground">Free Days</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold text-lg" style={{ color: "#0F4C81" }}>${selectedPort.demurrageRate}</div>
                        <div className="text-xs text-muted-foreground">Dem/Day</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold text-lg" style={{ color: "#2E8B57" }}>${selectedPort.detentionRate}</div>
                        <div className="text-xs text-muted-foreground">Det/Day</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="font-semibold text-lg">${selectedPort.demurrageRate + selectedPort.detentionRate}</div>
                        <div className="text-xs text-muted-foreground">Total/Day</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Cost Breakdown Pie Chart */}
                {calculation.totalCost > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <PieChart className="h-4 w-4" style={{ color: "#0F4C81" }} />
                        Cost Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={costBreakdownData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {costBreakdownData.map((entry, index) => (
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
                            <Legend 
                              formatter={(value) => <span className="text-sm">{value}</span>}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Educational Content - Understanding D&D */}
                <Card className="border-l-4" style={{ borderLeftColor: "#0F4C81" }}>
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#0F4C81" }} />
                      <div className="text-sm space-y-3">
                        <h4 className="font-semibold text-base" style={{ color: "#0F4C81" }}>Understanding Demurrage & Detention</h4>
                        <p className="text-muted-foreground">
                          Demurrage and detention charges represent significant cost factors in international shipping that can 
                          substantially impact your total landed costs. These charges serve as economic incentives to ensure 
                          efficient container turnover and terminal capacity management. Demurrage applies when containers 
                          remain at the port terminal beyond the allocated free time, effectively charging for storage space 
                          and the opportunity cost of terminal capacity. Detention charges apply when containers are kept 
                          outside the terminal beyond the permitted period, compensating carriers for lost container utilization.
                        </p>
                        <p className="text-muted-foreground">
                          Understanding the distinction between these charges is crucial for effective cost management. Demurrage 
                          is typically charged by the terminal operator and begins when free time expires after vessel discharge. 
                          Detention is charged by the ocean carrier and applies to the period when you have possession of the 
                          container outside the terminal. Different carriers and terminals have varying policies, rate structures, 
                          and free time allocations, making it essential to understand your specific contractual terms for each 
                          shipment route and carrier relationship.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Tab 2: Timeline View */}
        <TabsContent value="timeline" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5" style={{ color: "#0F4C81" }} />
                    Container Journey Timeline
                  </CardTitle>
                  <CardDescription>
                    Visual representation of your container&apos;s journey through the supply chain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Visual Timeline */}
                  <div className="relative py-8">
                    <div className="flex items-center justify-between mb-8">
                      {/* Arrival */}
                      <motion.div 
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "rgba(15, 76, 129, 0.15)" }}>
                          <Ship className="h-7 w-7" style={{ color: "#0F4C81" }} />
                        </div>
                        <span className="text-sm font-medium mt-2">Arrival</span>
                        <span className="text-xs text-muted-foreground">{arrivalDate || "Not set"}</span>
                      </motion.div>

                      {/* Free Time */}
                      <div className="flex-1 mx-4">
                        <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 relative shadow-inner">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap" style={{ color: "#2E8B57" }}>
                            Free Time ({selectedPort.freeDays} days)
                          </div>
                        </div>
                      </div>

                      {/* Pickup */}
                      <motion.div 
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "rgba(46, 139, 87, 0.15)" }}>
                          <Container className="h-7 w-7" style={{ color: "#2E8B57" }} />
                        </div>
                        <span className="text-sm font-medium mt-2">Pickup</span>
                        <span className="text-xs text-muted-foreground">{pickupDate || "Not set"}</span>
                      </motion.div>

                      {/* Charged Days */}
                      <div className="flex-1 mx-4">
                        <div className="h-3 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-red-500 relative shadow-inner">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-red-600 dark:text-red-400 whitespace-nowrap">
                            Charged Days
                          </div>
                        </div>
                      </div>

                      {/* Return */}
                      <motion.div 
                        className="flex flex-col items-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}>
                          <Building2 className="h-7 w-7" style={{ color: "#f59e0b" }} />
                        </div>
                        <span className="text-sm font-medium mt-2">Return</span>
                        <span className="text-xs text-muted-foreground">{returnDate || "Not set"}</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Cost Accumulation Chart */}
                  <div className="mt-8">
                    <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                      <LineChartIcon className="h-4 w-4" style={{ color: "#0F4C81" }} />
                      Cost Accumulation Over Time
                    </h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timelineData}>
                          <defs>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#0F4C81" stopOpacity={0.05}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value}`} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => `Day ${label}`}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="cost" 
                            stroke="#0F4C81" 
                            strokeWidth={2}
                            fill="url(#colorCost)" 
                            name="Accumulated Cost"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Daily Cost Bar Chart */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" style={{ color: "#2E8B57" }} />
                      Daily Cost by Phase
                    </h4>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={timelineData.slice(0, 15)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                          <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => `$${value}`} stroke="hsl(var(--muted-foreground))" />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Bar dataKey="dailyCost" name="Daily Cost" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Educational Content - Free Time */}
              <Card className="border-l-4" style={{ borderLeftColor: "#0F4C81" }}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#0F4C81" }} />
                    <div className="text-sm space-y-3">
                      <h4 className="font-semibold text-base" style={{ color: "#0F4C81" }}>Understanding Free Time in Detail</h4>
                      <p className="text-muted-foreground">
                        Free time represents the grace period provided by terminals and carriers during which you can store 
                        or use containers without incurring additional charges. This period is a critical component of 
                        international shipping contracts and varies significantly based on multiple factors including port 
                        location, carrier policies, cargo type, and your negotiated service contract terms. Understanding 
                        how free time is calculated and applied is essential for effective D&D cost management.
                      </p>
                      <p className="text-muted-foreground">
                        Standard demurrage free time typically ranges from 3 to 7 days, starting when the container is 
                        discharged from the vessel until it is picked up from the terminal. Detention free time usually 
                        spans 4 to 7 days, beginning when you collect the full container and ending when you return the 
                        empty container to the designated location. Some carriers offer combined free time pools, giving 
                        you flexibility to allocate days between demurrage and detention based on your operational needs.
                      </p>
                      <p className="text-muted-foreground">
                        Free time can often be extended through contractual negotiations, especially for high-volume shippers. 
                        During peak seasons or port congestion events, carriers may offer automatic extensions. However, 
                        it&apos;s essential to track your free time carefully and communicate proactively with all parties 
                        involved to avoid unexpected charges that can significantly impact your total landed costs. 
                        Implementing automated tracking systems and setting up alerts well before free time expires are 
                        proven strategies for avoiding unnecessary D&D charges.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Phases Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-5 w-5" style={{ color: "#2E8B57" }} />
                    Timeline Phases Explained
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        phase: "Port Storage",
                        icon: Building2,
                        color: "#0F4C81",
                        description: "Container sits at the terminal from vessel discharge until pickup. This is where demurrage charges apply if free time is exceeded.",
                        cost: "Demurrage Rate"
                      },
                      {
                        phase: "Cargo Handling",
                        icon: Container,
                        color: "#2E8B57",
                        description: "Container is transported to your facility, unloaded, and prepared for return. Efficient operations here minimize detention exposure.",
                        cost: "Time Critical"
                      },
                      {
                        phase: "Empty Return",
                        icon: RefreshCw,
                        color: "#f59e0b",
                        description: "Empty container is returned to designated location. Detention charges apply if return is delayed beyond free time allocation.",
                        cost: "Detention Rate"
                      },
                    ].map((phase) => (
                      <div key={phase.phase} className="p-4 rounded-lg border">
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${phase.color}15` }}
                          >
                            <phase.icon className="h-5 w-5" style={{ color: phase.color }} />
                          </div>
                          <h5 className="font-medium">{phase.phase}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                        <Badge variant="outline" className="text-xs">{phase.cost}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Tab 3: Port Rates */}
        <TabsContent value="rates" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="rates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Region Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" style={{ color: "#0F4C81" }} />
                    Average D&D Rates by Region
                  </CardTitle>
                  <CardDescription>
                    Compare average demurrage and detention rates across different regions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="region" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value}`} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="avgDemurrage" name="Avg Demurrage" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="avgDetention" name="Avg Detention" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Port Rates Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" style={{ color: "#0F4C81" }} />
                    Global Port Demurrage & Detention Rates
                  </CardTitle>
                  <CardDescription>
                    Reference rates for major ports worldwide (USD per day per 40&apos; container)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader className="sticky top-0 bg-background">
                        <TableRow>
                          <TableHead>Port</TableHead>
                          <TableHead>Country</TableHead>
                          <TableHead>Region</TableHead>
                          <TableHead className="text-center">Free Days</TableHead>
                          <TableHead className="text-right">Demurrage</TableHead>
                          <TableHead className="text-right">Detention</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(portRates).map(([code, data]) => (
                          <TableRow key={code} className={port === code ? "bg-muted/50" : ""}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {data.name}
                              </div>
                            </TableCell>
                            <TableCell>{data.country}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">{data.region}</Badge>
                            </TableCell>
                            <TableCell className="text-center">{data.freeDays}</TableCell>
                            <TableCell className="text-right">${data.demurrageRate}</TableCell>
                            <TableCell className="text-right">${data.detentionRate}</TableCell>
                            <TableCell className="text-right font-semibold">
                              ${data.demurrageRate + data.detentionRate}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Port Comparison Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" style={{ color: "#2E8B57" }} />
                    Top 15 Ports by D&D Rate
                  </CardTitle>
                  <CardDescription>
                    Visual comparison of demurrage and detention rates across highest-cost ports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={portComparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value}`} stroke="hsl(var(--muted-foreground))" />
                        <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} 
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="demurrage" name="Demurrage" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="detention" name="Detention" fill="#2E8B57" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Carrier Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5" style={{ color: "#0F4C81" }} />
                    Carrier Rate Multiplier Comparison
                  </CardTitle>
                  <CardDescription>
                    How different carriers&apos; rate multipliers affect your D&D costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={carrierComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="carrier" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value}`} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Bar dataKey="demurrage" name="Base Demurrage" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="detention" name="Base Detention" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {carrierComparisonData.filter(c => c.combinedFreeTime).map(c => (
                      <Badge key={c.carrier} className="text-xs" style={{ backgroundColor: "rgba(46, 139, 87, 0.15)", color: "#2E8B57" }}>
                        {c.carrier}: Combined Free Time
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Educational Content - How D&D Charges are Calculated */}
              <Card className="border-l-4" style={{ borderLeftColor: "#f59e0b" }}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#f59e0b" }} />
                    <div className="text-sm space-y-3">
                      <h4 className="font-semibold text-base" style={{ color: "#f59e0b" }}>How D&D Charges are Calculated</h4>
                      <p className="text-muted-foreground">
                        Demurrage and detention charges follow a systematic calculation methodology that takes into account 
                        several key variables. The fundamental formula involves multiplying the daily rate by the number 
                        of days exceeding the free time allowance. However, the actual implementation can involve tiered 
                        rates, currency adjustments, and carrier-specific multipliers that significantly impact the final 
                        amount charged to the shipper.
                      </p>
                      <p className="text-muted-foreground">
                        The calculation begins with determining the base daily rate, which varies by port, carrier, and 
                        container type. Standard 20-foot containers typically incur 70% of the 40-foot rate, while reefer 
                        containers may carry a 50% premium due to their higher value and operational complexity. Carrier 
                        multipliers also apply - some carriers charge up to 15% above or below the port base rate based on 
                        their own tariff structures and market positioning.
                      </p>
                      <p className="text-muted-foreground">
                        The number of chargeable days is calculated from the expiration of free time until the container 
                        status changes (pickup for demurrage, empty return for detention). Many terminals and carriers now 
                        implement tiered pricing structures where rates increase progressively for extended delays. For 
                        example, days 1-5 beyond free time might be charged at the standard rate, days 6-10 at 1.5x, and 
                        days 11+ at 2x the base rate. This progressive structure incentivizes quick container turnover.
                      </p>
                      <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
                        <h5 className="font-medium mb-2">Calculation Formula:</h5>
                        <code className="text-xs block">
                          Total D&D = (Demurrage Days × Dem. Rate × Container Count × Carrier Mult.) + (Detention Days × Det. Rate × Container Count × Carrier Mult.)
                        </code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" style={{ color: "#2E8B57" }} />
                    Weekly D&D Rate Trends
                  </CardTitle>
                  <CardDescription>
                    Historical rate trends for reference (sample data)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={weeklyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                        <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value}`} stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="demurrage" name="Demurrage" stroke="#0F4C81" strokeWidth={2} dot={{ r: 3 }} />
                        <Line type="monotone" dataKey="detention" name="Detention" stroke="#2E8B57" strokeWidth={2} dot={{ r: 3 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Tab 4: Avoidance Tips */}
        <TabsContent value="tips" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="tips"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Top Tips Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    icon: FileText,
                    title: "Pre-file Customs Documents",
                    description: "Submit all customs documentation before vessel arrival to expedite clearance. Work with your customs broker to ensure all paperwork is complete and accurate. Missing or incorrect documents are the most common cause of clearance delays that lead to demurrage charges.",
                    color: "#0F4C81",
                    impact: "High Impact",
                  },
                  {
                    icon: Calendar,
                    title: "Schedule Terminal Appointments Early",
                    description: "Book terminal pickup appointments as soon as the vessel ETA is confirmed. Many ports require advance appointments, and slots fill quickly during peak periods. Having a confirmed appointment also helps truckers plan their schedules efficiently.",
                    color: "#2E8B57",
                    impact: "High Impact",
                  },
                  {
                    icon: Ship,
                    title: "Negotiate Extended Free Time",
                    description: "Include free time extensions in your service contracts with carriers. High-volume shippers can often secure 7-14 days of free time instead of standard 4-5 days. This provides a critical buffer against unexpected delays and operational disruptions.",
                    color: "#f59e0b",
                    impact: "Medium Impact",
                  },
                  {
                    icon: Container,
                    title: "Use Chassis Pools",
                    description: "Access to chassis pools eliminates wait times for equipment availability. Many delays occur because truckers arrive at terminals but cannot secure chassis for container transport. Pool memberships ensure equipment is always available when needed.",
                    color: "#8b5cf6",
                    impact: "Medium Impact",
                  },
                ].map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center"
                              style={{ backgroundColor: `${tip.color}15` }}
                            >
                              <tip.icon className="h-6 w-6" style={{ color: tip.color }} />
                            </div>
                            <CardTitle className="text-base">{tip.title}</CardTitle>
                          </div>
                          <Badge 
                            className="text-xs"
                            style={{ 
                              backgroundColor: tip.impact === "High Impact" ? "rgba(46, 139, 87, 0.15)" : "rgba(245, 158, 11, 0.15)",
                              color: tip.impact === "High Impact" ? "#2E8B57" : "#f59e0b"
                            }}
                          >
                            {tip.impact}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Additional Strategies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" style={{ color: "#2E8B57" }} />
                    Additional Strategies to Minimize D&D Costs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        {
                          title: "Monitor Container Status",
                          description: "Use tracking systems to monitor container location and free time expiration in real-time. Set up automated alerts for critical milestones."
                        },
                        {
                          title: "Partner with Reliable Truckers",
                          description: "Build relationships with dependable trucking companies who guarantee pickup times and have experience with your destination terminals."
                        },
                        {
                          title: "Consider Off-Dock Storage",
                          description: "Use nearby container yards for storage when terminal free time expires. Off-dock rates are often significantly lower than terminal demurrage."
                        },
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border">
                          <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                          <div>
                            <h5 className="font-medium mb-1">{item.title}</h5>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Avoid Peak Seasons",
                          description: "Plan shipments to avoid peak periods (pre-holiday rushes, cherry blossom season) when ports are congested and delays are common."
                        },
                        {
                          title: "Maintain Buffer Time",
                          description: "Build extra time into your supply chain for unexpected delays. Rush shipments often lead to mistakes that cause longer delays and higher costs."
                        },
                        {
                          title: "Use D&D Insurance",
                          description: "Consider insurance products that cover D&D charges for high-value or time-sensitive shipments where delays could result in significant costs."
                        },
                      ].map((item) => (
                        <div key={item.title} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30 border">
                          <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#2E8B57" }} />
                          <div>
                            <h5 className="font-medium mb-1">{item.title}</h5>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warning about common mistakes */}
              <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div className="space-y-3">
                      <h4 className="font-semibold text-base text-red-700 dark:text-red-300">Common Mistakes to Avoid</h4>
                      <ul className="space-y-3">
                        {[
                          {
                            title: "Waiting until arrival to arrange pickup",
                            description: "By then, terminal appointments may be fully booked, forcing you to wait additional days and incur demurrage charges."
                          },
                          {
                            title: "Ignoring free time notifications",
                            description: "Carriers send alerts when free time is about to expire. Ignoring these leads to unnecessary charges that could have been avoided."
                          },
                          {
                            title: "Not reviewing carrier tariff terms",
                            description: "Each carrier has different D&D policies. Understanding these helps you plan and dispute charges when appropriate."
                          },
                          {
                            title: "Failing to document delays",
                            description: "Without proper documentation, you cannot successfully dispute charges caused by carrier or terminal errors."
                          },
                        ].map((mistake) => (
                          <li key={mistake.title} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                            <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>
                              <strong>{mistake.title}</strong> - {mistake.description}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Educational Content - Carrier Variations */}
              <Card className="border-l-4" style={{ borderLeftColor: "#8b5cf6" }}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#8b5cf6" }} />
                    <div className="text-sm space-y-3">
                      <h4 className="font-semibold text-base" style={{ color: "#8b5cf6" }}>Understanding Carrier Variations in D&D Policies</h4>
                      <p className="text-muted-foreground">
                        Major ocean carriers have developed distinct approaches to demurrage and detention charges that 
                        reflect their operational models, market positioning, and customer relationships. Understanding 
                        these variations is essential for optimizing your shipping costs and avoiding unexpected charges 
                        that can significantly impact your bottom line and overall supply chain economics.
                      </p>
                      <p className="text-muted-foreground">
                        Rate variations among carriers can range from 15% below to 15% above industry averages. For example, 
                        carriers like Maersk and Hapag-Lloyd tend to charge premium rates but offer sophisticated digital 
                        platforms for tracking and managing D&D exposure. Asian carriers like COSCO and Yang Ming often 
                        provide more competitive pricing, particularly on Asia-origin routes, but may have less flexible 
                        dispute resolution processes and notification systems.
                      </p>
                      <p className="text-muted-foreground">
                        Beyond base rates, carriers differ significantly in how they handle free time extensions, notification 
                        requirements, dispute resolution processes, and peak season adjustments. Some carriers offer combined 
                        demurrage-detention free time pools, allowing shippers to flexibly allocate days based on operational 
                        needs. Others maintain strict separation, which can be advantageous or disadvantageous depending on your 
                        typical cargo flow patterns and operational constraints.
                      </p>
                      <p className="text-muted-foreground">
                        Smart shippers maintain detailed carrier comparison matrices, negotiate customized terms based on volume 
                        and route patterns, and maintain flexibility to route cargo through carriers offering favorable D&D 
                        terms for specific trade lanes. This strategic approach to carrier selection can result in substantial 
                        annual savings on D&D charges while maintaining service quality and reliability.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pro Tips Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" style={{ color: "#f59e0b" }} />
                    Pro Tips from Industry Experts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { tip: "Always have a backup trucker on standby for terminal pickups", icon: Truck },
                      { tip: "Request written confirmation of any verbal free time extensions", icon: FileText },
                      { tip: "Join shipper associations for collective bargaining power on D&D terms", icon: Users },
                      { tip: "Track D&D costs per shipment to identify problematic routes/carriers", icon: Target },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)" }}>
                          <item.icon className="h-4 w-4" style={{ color: "#f59e0b" }} />
                        </div>
                        <p className="text-sm">{item.tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" style={{ color: "#0F4C81" }} />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Comprehensive answers to common questions about demurrage and detention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {faqData.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium"
                              style={{ 
                                backgroundColor: "rgba(15, 76, 129, 0.1)", 
                                color: "#0F4C81" 
                              }}
                            >
                              {index + 1}
                            </div>
                            <span className="text-sm md:text-base">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pl-11 text-sm">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Legal Aspects Card */}
              <Card className="border-l-4" style={{ borderLeftColor: "#0F4C81" }}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "#0F4C81" }} />
                    <div className="text-sm space-y-3">
                      <h4 className="font-semibold text-base" style={{ color: "#0F4C81" }}>Legal Aspects of D&D Charges</h4>
                      <p className="text-muted-foreground">
                        The legal framework governing demurrage and detention charges has evolved significantly in recent 
                        years, with increased regulatory scrutiny and shipper protections. Understanding your legal rights 
                        and obligations is essential for fair treatment and successful dispute resolution when charges seem 
                        unreasonable or unjustified. Various jurisdictions have implemented different levels of protection.
                      </p>
                      <p className="text-muted-foreground">
                        In the United States, the Federal Maritime Commission (FMC) has taken an active role in regulating 
                        D&D practices. The Ocean Shipping Reform Act of 2022 empowered the FMC to investigate and penalize 
                        carriers for unreasonable D&D charges. Carriers must now demonstrate that charges serve a legitimate 
                        purpose related to container availability and cannot charge fees when delays are caused by factors 
                        outside the shipper&apos;s control, such as port congestion or carrier equipment shortages.
                      </p>
                      <p className="text-muted-foreground">
                        Similar regulatory frameworks exist in other major trading regions. The European Union maintains 
                        competition regulations that prevent carriers from abusing dominant market positions through excessive 
                        D&D charges. Australia, China, and other major trading nations have implemented their own oversight 
                        mechanisms. Your bill of lading constitutes a binding contract that specifies D&D terms, and carriers 
                        must adhere to their filed tariff rules. When disputing charges, you can file complaints with relevant 
                        regulatory bodies, cite industry regulations, and reference precedent cases that support your position.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">FMC Regulations</Badge>
                        <Badge variant="outline" className="text-xs">Ocean Shipping Reform Act</Badge>
                        <Badge variant="outline" className="text-xs">Bill of Lading Terms</Badge>
                        <Badge variant="outline" className="text-xs">Carrier Tariffs</Badge>
                        <Badge variant="outline" className="text-xs">Dispute Rights</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Reference Cards */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" style={{ color: "#0F4C81" }} />
                      Standard Free Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Demurrage: 3-7 days</li>
                      <li>• Detention: 4-7 days</li>
                      <li>• Combined: 7-14 days</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <DollarSign className="h-4 w-4" style={{ color: "#2E8B57" }} />
                      Average Daily Rates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• US Ports: $250-350/day</li>
                      <li>• EU Ports: $150-200/day</li>
                      <li>• Asia Ports: $50-150/day</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" style={{ color: "#f59e0b" }} />
                      Dispute Window
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Standard: 30-90 days</li>
                      <li>• Documentation required</li>
                      <li>• Written submission needed</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper component icons
function Truck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
