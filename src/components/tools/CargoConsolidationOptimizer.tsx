"use client";

import { useState, useMemo } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  Container,
  Ship,
  Truck,
  Warehouse,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Minus,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Layers,
  Box,
  Route,
  MapPin,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  Target,
  Award,
  Settings,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Lightbulb,
  XCircle,
  ArrowLeftRight,
  Scale,
  Timer,
  Users,
  Globe,
  Shield,
  FileText,
  PackageCheck,
  ContainersIcon,
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
  Legend,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";
import { motion } from "framer-motion";

// Types
interface Shipment {
  id: string;
  name: string;
  origin: string;
  destination: string;
  readyDate: string;
  cargoType: "LCL" | "FCL" | "Air";
  volume: number;
  weight: number;
  value: number;
  lclRate: number;
  currentCost: number;
  transitDays: number;
  priority: "high" | "medium" | "low";
  consolidate: boolean;
}

interface ConsolidationOpportunity {
  id: string;
  shipments: string[];
  destination: string;
  totalVolume: number;
  totalWeight: number;
  containerType: string;
  containerUtilization: number;
  consolidatedCost: number;
  originalCost: number;
  savings: number;
  savingsPercent: number;
  warehouseDays: number;
  warehouseCost: number;
  additionalTransitDays: number;
  recommendation: string;
  feasibility: "excellent" | "good" | "marginal" | "not-recommended";
}

interface ConsolidationResult {
  totalOriginalCost: number;
  totalConsolidatedCost: number;
  totalSavings: number;
  savingsPercent: number;
  avgContainerUtilization: number;
  lclToFclConversions: number;
  warehouseBundlingSavings: number;
  transitImpact: number;
  opportunities: ConsolidationOpportunity[];
}

// Container specifications
const CONTAINERS = {
  "20GP": { name: "20' GP", capacity: 33.2, maxPayload: 21700, cost: 2800, dims: "5.9m × 2.35m × 2.39m" },
  "40GP": { name: "40' GP", capacity: 67.7, maxPayload: 25800, cost: 4200, dims: "12.0m × 2.35m × 2.39m" },
  "40HC": { name: "40' HC", capacity: 76.3, maxPayload: 26330, cost: 4500, dims: "12.0m × 2.35m × 2.70m" },
  "45HC": { name: "45' HC", capacity: 86.0, maxPayload: 25500, cost: 5200, dims: "13.6m × 2.35m × 2.70m" },
};

// Popular trade lanes
const TRADE_LANES = [
  { origin: "Shanghai, CN", destination: "Los Angeles, US", avgTransit: 18 },
  { origin: "Shenzhen, CN", destination: "Long Beach, US", avgTransit: 17 },
  { origin: "Ningbo, CN", destination: "New York, US", avgTransit: 25 },
  { origin: "Shanghai, CN", destination: "Rotterdam, NL", avgTransit: 28 },
  { origin: "Shenzhen, CN", destination: "Hamburg, DE", avgTransit: 30 },
  { origin: "Hong Kong, HK", destination: "Felixstowe, UK", avgTransit: 26 },
  { origin: "Busan, KR", destination: "Los Angeles, US", avgTransit: 12 },
  { origin: "Tokyo, JP", destination: "New York, US", avgTransit: 22 },
  { origin: "Singapore, SG", destination: "Rotterdam, NL", avgTransit: 22 },
  { origin: "Mumbai, IN", destination: "Hamburg, DE", avgTransit: 24 },
];

// Warehouse costs by region ($/CBM/day)
const WAREHOUSE_COSTS = [
  { region: "China - Shanghai", cost: 0.45 },
  { region: "China - Shenzhen", cost: 0.42 },
  { region: "China - Ningbo", cost: 0.40 },
  { region: "Singapore", cost: 0.85 },
  { region: "Hong Kong", cost: 0.95 },
  { region: "South Korea - Busan", cost: 0.75 },
  { region: "Japan - Tokyo", cost: 1.10 },
  { region: "US - Los Angeles", cost: 0.90 },
  { region: "US - New York", cost: 1.05 },
  { region: "EU - Rotterdam", cost: 0.80 },
];

// LCL rates by trade lane ($/CBM)
const LCL_RATES = [
  { lane: "CN-US West", rate: 85 },
  { lane: "CN-US East", rate: 95 },
  { lane: "CN-EU North", rate: 90 },
  { lane: "Asia-EU", rate: 75 },
  { lane: "Intra-Asia", rate: 45 },
];

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  pink: "#EC4899",
  teal: "#10B981",
};

// Helper function to generate recommendations
function getSavingsRecommendation(savingsPercent: number, utilization: number, warehouseDays: number): string {
  if (savingsPercent >= 30 && utilization >= 80) {
    return `Highly recommended! Excellent cost savings with ${utilization.toFixed(0)}% container utilization.`;
  } else if (savingsPercent >= 15 && utilization >= 70) {
    return `Good consolidation opportunity. Consider adjusting cargo ready dates to improve savings.`;
  } else if (savingsPercent >= 5) {
    return `Marginal savings. Review warehouse storage costs and ready date alignment.`;
  } else if (warehouseDays > 14) {
    return `Extended warehouse wait may erode savings. Try to align cargo ready dates closer together.`;
  }
  return `Not recommended for consolidation. Continue with separate LCL shipments.`;
}

// Helper function to determine feasibility
function getFeasibility(savingsPercent: number, utilization: number): "excellent" | "good" | "marginal" | "not-recommended" {
  if (savingsPercent >= 30 && utilization >= 80) return "excellent";
  if (savingsPercent >= 15 && utilization >= 70) return "good";
  if (savingsPercent >= 5) return "marginal";
  return "not-recommended";
}

// Pro Tips Data
const PRO_TIPS = [
  {
    icon: Calendar,
    title: "Align Cargo Ready Dates",
    description: "Coordinate with suppliers to have cargo ready within a 3-5 day window. This minimizes warehouse storage costs and maximizes consolidation efficiency. Even a 2-day reduction in waiting time can save 15-20% on storage costs.",
  },
  {
    icon: Target,
    title: "Target 85% Container Utilization",
    description: "Aim for at least 85% container utilization before consolidating. Below this threshold, the per-CBM cost may not justify the additional handling and coordination effort. Use the LCL to FCL break-even analysis to find your optimal volume.",
  },
  {
    icon: Globe,
    title: "Consider Multiple Destinations",
    description: "Group shipments by region rather than exact port when possible. Consolidating for nearby ports can increase your volume pool while still achieving significant freight savings through shared container positioning.",
  },
  {
    icon: FileText,
    title: "Pre-Plan Documentation",
    description: "Prepare consolidated documentation early. Commercial invoices, packing lists, and HS codes should be aligned across all shipments to avoid customs delays. Mismatched documentation is the #1 cause of consolidated shipment holds.",
  },
  {
    icon: Timer,
    title: "Buffer Transit Time",
    description: "Add 2-3 days buffer to transit estimates when consolidating. The coordination and warehouse handling adds time that shippers often underestimate. Communicate realistic delivery windows to consignees upfront.",
  },
  {
    icon: Users,
    title: "Partner with Consolidators",
    description: "Work with experienced freight consolidators who have established networks. They can match your cargo with compatible shipments, often achieving better rates and faster turnaround than trying to consolidate independently.",
  },
];

// Common Mistakes Data
const COMMON_MISTAKES = [
  {
    icon: XCircle,
    title: "Ignoring Transit Time Impact",
    description: "Many shippers focus solely on cost savings and overlook the additional 2-7 days that consolidation adds to delivery times. This can affect inventory planning, customer commitments, and seasonal product launches. Always factor transit impact into your decision.",
  },
  {
    icon: XCircle,
    title: "Underestimating Warehouse Costs",
    description: "Storage costs during the consolidation waiting period can quickly erode savings. A shipment waiting 14 days at $0.50/CBM/day adds $7/CBM to your costs. Calculate the total landed cost including all warehouse charges before committing to consolidation.",
  },
  {
    icon: XCircle,
    title: "Mixing Incompatible Cargo",
    description: "Combining cargo with different handling requirements (hazmat, temperature-sensitive, fragile) can lead to rejections, delays, or damage. Ensure all consolidated cargo shares compatible shipping requirements and stowage positions.",
  },
  {
    icon: XCircle,
    title: "Neglecting Insurance Implications",
    description: "Consolidated shipments may have different insurance coverage limits and claim procedures. Verify that your cargo insurance covers consolidated shipments and understand the liability limits of consolidators and carriers involved.",
  },
  {
    icon: XCircle,
    title: "Poor Communication with Consignees",
    description: "Failing to inform consignees about consolidation changes can cause delivery complications. Multiple shipments arriving under one container requires proper splitting and allocation. Ensure consignees understand the process and can receive consolidated cargo.",
  },
];

// FAQ Data with 150+ words each
const FAQ_DATA = [
  {
    question: "What is cargo consolidation and how does it reduce shipping costs?",
    answer: `Cargo consolidation is a logistics strategy where multiple smaller shipments from different shippers are combined into a single container or transport unit, typically converting LCL (Less than Container Load) shipments into FCL (Full Container Load) shipments. This process significantly reduces shipping costs through several mechanisms. First, FCL rates are substantially lower per cubic meter than LCL rates, often 30-50% less, because carriers prefer handling complete containers over piecemeal cargo. Second, consolidation eliminates the per-shipment minimum charges that LCL shipments incur, which can be particularly costly for small volumes. Third, consolidated shipments benefit from reduced handling at ports and terminals, minimizing the risk of damage and lowering handling fees. Fourth, documentation costs are reduced as multiple shipments share a single bill of lading and customs entry. However, consolidation requires careful coordination of cargo ready dates, compatible destinations, and transit time considerations. Shippers must balance the cost savings against the additional warehouse storage time needed to accumulate sufficient volume and the slight delay in transit that consolidation typically introduces.`,
  },
  {
    question: "When should I choose LCL shipping versus waiting to consolidate for FCL?",
    answer: `The decision between LCL shipping and consolidation for FCL depends on several critical factors that must be evaluated holistically. Volume is the primary consideration - the break-even point typically falls between 15-20 CBM for a 20-foot container and 35-40 CBM for a 40-foot container, depending on current LCL and FCL rates. Time sensitivity is equally important; if your shipment is urgent or supports just-in-time inventory, the 3-10 day delay from consolidation waiting periods may be unacceptable. Product characteristics matter significantly - perishable goods, high-value items requiring faster transit, or cargo with specific stowage requirements may not be suitable for consolidation. Consider warehouse costs in your calculation; if your cargo needs to wait 14 days at $0.85/CBM/day to accumulate sufficient volume, that's an additional $11.90/CBM in storage charges. Seasonal factors also influence the decision - during peak seasons, consolidation opportunities increase due to higher cargo volumes, but FCL rates also rise, potentially narrowing the savings gap. A comprehensive cost-benefit analysis should compare total LCL costs (freight + handling + documentation) against total consolidated FCL costs (freight + warehouse + handling + coordination) while factoring in the business impact of extended transit times.`,
  },
  {
    question: "How do I calculate the break-even volume for LCL to FCL conversion?",
    answer: `Calculating the break-even volume for LCL to FCL conversion requires comparing total costs under both scenarios to find the volume at which FCL becomes more economical. The formula is straightforward: Break-Even Volume = FCL Rate ÷ LCL Rate per CBM. For example, if a 40HC container costs $4,500 and your LCL rate is $85/CBM, the break-even is approximately 53 CBM. However, this basic calculation ignores several important factors that must be included for accuracy. Add warehouse storage costs if your cargo will wait for consolidation: Storage Cost = Volume × Daily Rate × Days Waiting. Include handling and documentation differences: FCL typically has one set of handling fees and documentation costs, while LCL incurs these per shipment. Factor in the destination charges: LCL shipments often have higher destination handling fees (CIS, CFS charges) on a per-CBM basis compared to FCL. Consider the value of time: if consolidation delays your product reaching market by 7 days, calculate the opportunity cost or additional inventory carrying cost. A practical approach is to create a comparison table showing total costs at various volumes (10, 15, 20, 25, 30 CBM, etc.) with all relevant charges included, then identify where the FCL total becomes lower than LCL. Most consolidators recommend targeting at least 85% container utilization to ensure meaningful savings after all costs are accounted for.`,
  },
  {
    question: "What are the risks of cargo consolidation and how can I mitigate them?",
    answer: `Cargo consolidation, while economically beneficial, carries several risks that shippers must understand and actively mitigate. Transit time variability is a primary risk - consolidated shipments depend on accumulating sufficient volume before dispatch, which can extend lead times unpredictably. Mitigate this by setting clear service level agreements with consolidators, establishing maximum wait times, and maintaining buffer inventory for critical shipments. Cargo damage risk increases with additional handling during consolidation and deconsolidation processes. Protect against this by using robust packaging, clearly marking fragile items, requesting container positioning photos, and ensuring comprehensive insurance coverage. Documentation discrepancies between consignees in a consolidated container can cause customs delays affecting all shipments. Prevent this by ensuring all HS codes, values, and descriptions are accurate and consistent, and working with consolidators who pre-screen documentation. Cargo incompatibility is often overlooked but critical - mixing hazardous materials with general cargo, or temperature-sensitive goods with ambient shipments, can lead to rejections or spoilage. Always disclose cargo characteristics fully and verify compatibility with other shipments in your consolidation. Liability gaps can occur when cargo passes through multiple parties (shipper, consolidator, carrier, deconsolidator). Clarify liability limits and ensure end-to-end insurance coverage that addresses potential gaps in carrier liability. Finally, communication failures between parties can lead to missed consolidations or delivery complications. Establish clear communication protocols, tracking updates, and escalation procedures with all parties involved in the consolidation chain.`,
  },
  {
    question: "How do warehouse costs affect the economics of cargo consolidation?",
    answer: `Warehouse costs are a critical and often underestimated factor in consolidation economics that can significantly impact the overall savings calculation. When consolidating shipments, cargo typically must wait at an origin warehouse until sufficient volume accumulates to fill a container, incurring daily storage charges that reduce or potentially eliminate the freight savings. The basic warehouse cost formula is: Total Storage Cost = Total Volume (CBM) × Daily Rate × Number of Days. For example, 30 CBM waiting 10 days at $0.50/CBM/day adds $150 to your costs. However, the true impact is more nuanced. Warehouse costs vary significantly by region - China's major ports average $0.40-0.50/CBM/day, while Singapore and Hong Kong can exceed $0.90/CBM/day. This geographic variation means consolidation economics differ by origin location. The timing relationship between cargo ready dates and consolidation dispatch is crucial. If your shipments have ready dates spread across 14 days, you're paying storage on early shipments while waiting for later ones. Coordinating ready dates within a 3-5 day window can reduce storage costs by 60-70%. Consider also the opportunity cost of working capital tied up in goods sitting in warehouses, especially for high-value cargo. Some consolidators offer free storage periods (typically 3-7 days) before charges apply - negotiate this in your contracts. Additionally, warehouse handling charges (receiving, storing, retrieving) may apply separately from storage fees and should be included in your total cost comparison. To optimize consolidation economics, calculate the point where storage costs offset freight savings, typically around 14-21 days of waiting, and structure your consolidation strategy to minimize this wait time.`,
  },
  {
    question: "What documentation is required for consolidated shipments?",
    answer: `Consolidated shipments require comprehensive documentation that addresses both the consolidated container level and individual shipment level, with each layer serving different regulatory and commercial purposes. At the container level, you need a Master Bill of Lading (MBL) issued by the carrier covering the entire container from port of loading to port of discharge, and a House Bill of Lading (HBL) issued by the consolidator to each shipper for their specific cargo portion. The container manifest lists all shipments within the container with weights, volumes, and consignee details. At the individual shipment level, each shipper must provide a commercial invoice with detailed item descriptions, HS codes, values, and currency, a packing list specifying contents, weights, dimensions, and packaging details, and any required certificates (origin, quality, phytosanitary, etc.) specific to their cargo. Customs documentation is particularly critical for consolidated shipments. The consolidator typically files a single customs entry for the container, but each shipment's details must be accurately declared. In many jurisdictions, the consolidator must provide a consolidation declaration identifying all shippers and consignees. For shipments with multiple consignees, the destination freight forwarder will need to file individual customs entries for each consignee's portion after deconsolidation. Documentation discrepancies between shipments in a consolidated container can cause holds affecting all cargo. Best practices include pre-submitting all documentation to the consolidator for review, ensuring HS code consistency across similar items, and maintaining clear communication channels with all parties. Electronic documentation systems and standardized formats can significantly reduce errors and processing time.`,
  },
  {
    question: "How does cargo consolidation affect transit times and delivery reliability?",
    answer: `Cargo consolidation impacts transit times and delivery reliability in multiple ways that shippers must understand and plan for. The most obvious impact is the waiting period required to accumulate sufficient cargo volume before container dispatch. This consolidation buffer typically adds 3-10 days to the overall transit time, though it can extend longer during slow seasons or for niche trade lanes with lower cargo volumes. Beyond the waiting period, consolidated shipments may have additional handling steps that extend timelines: cargo must be received at the consolidator's warehouse, processed, and loaded into the container, then at destination, the container must be deconsolidated at a CFS (Container Freight Station) before individual shipments are released. Each step adds 1-3 days. Delivery reliability can be affected by several consolidation-specific factors. The consolidator's schedule and sailing frequency determine how quickly your cargo moves - consolidators with weekly sailings provide more predictable timelines than those sailing on an ad-hoc basis. Cargo mix within the container can cause delays if one shipment has documentation issues or customs holds that affect the entire container. Port congestion and carrier schedule reliability impact consolidated shipments the same as FCL, but the impact may be magnified because you're dependent on the consolidator's carrier relationships and routing choices. To improve predictability, work with consolidators who provide real-time tracking, guaranteed maximum wait times, and regular sailing schedules. Build 7-14 day buffers into your supply chain planning for consolidated shipments. Communicate clearly with consignees about the process and expected timelines, including the fact that multiple shipments in one container require deconsolidation before final delivery. For time-critical shipments, consider partial consolidation (meeting minimum container utilization) rather than waiting for optimal fill rates.`,
  },
  {
    question: "What are the best practices for successful cargo consolidation?",
    answer: `Successful cargo consolidation requires strategic planning, strong partnerships, and systematic processes that address both operational efficiency and risk management. Start with partner selection - work with established consolidators or freight forwarders who have proven track records, regular sailing schedules, and strong carrier relationships. Verify their financial stability, insurance coverage, and references from similar businesses. For operational planning, establish a consolidation calendar that aligns with your supply chain cadence. Many shippers find success with weekly or bi-weekly consolidation cycles that provide predictability for both origin suppliers and destination consignees. Coordinate closely with suppliers to align cargo ready dates within tight windows, ideally 3-5 days, to minimize warehouse storage costs. Create a volume forecast by destination to identify consolidation opportunities early and communicate expected volumes to your consolidator for capacity planning. Documentation discipline is essential - implement standardized documentation templates for all shipments, require suppliers to submit documents at least 48 hours before cargo readiness, and have the consolidator pre-screen all paperwork before cargo arrival. For cargo management, clearly label all shipments with consignee details, establish handling instructions that account for all cargo types in the consolidation, and photograph cargo condition at receiving and loading. Build strong relationships with consolidator staff who handle your cargo regularly. On the financial side, negotiate transparent pricing that includes all fees (handling, documentation, storage tiers), establish volume-based rate agreements if you have regular consolidation lanes, and request detailed cost breakdowns for each consolidation. Finally, implement a continuous improvement process by tracking key metrics (savings achieved, transit times, damage rates, documentation accuracy), conducting regular reviews with your consolidator, and adjusting processes based on performance data. The most successful consolidation programs evolve over time based on operational learning and changing business needs.`,
  },
];

// Educational Content Sections
const EDUCATIONAL_CONTENT = {
  whatIsConsolidation: {
    title: "What is Cargo Consolidation?",
    content: `Cargo consolidation is a fundamental logistics strategy that involves combining multiple smaller shipments from different shippers into a single transport unit, typically a shipping container. This process transforms Less than Container Load (LCL) shipments into Full Container Load (FCL) shipments, enabling shippers to benefit from economies of scale that would otherwise be unavailable to them individually. The concept originated in the 1960s with the advent of containerization and has since become a cornerstone of modern international trade, particularly for small and medium enterprises that don't generate sufficient volume to fill containers independently.

The consolidation process typically involves a freight forwarder or consolidator who collects cargo from multiple shippers, stores it at a Container Freight Station (CFS) or warehouse, and loads it into a single container when sufficient volume accumulates. At destination, the process reverses: the container is deconsolidated at a CFS, and individual shipments are released to their respective consignees. This end-to-end coordination requires sophisticated logistics management, including cargo tracking, documentation handling, and customs coordination.

Consolidation offers compelling benefits for suitable shipments: reduced per-unit shipping costs, simplified documentation processes, and access to FCL service levels. However, it also introduces complexity in coordination, extends transit times due to consolidation waiting periods, and requires trust in the consolidator's handling capabilities. Understanding when consolidation makes sense - and when it doesn't - is essential for optimizing your supply chain costs and service levels.`,
  },
  benefits: {
    title: "Benefits of Cargo Consolidation",
    content: `Cargo consolidation delivers substantial benefits across cost, operational, and environmental dimensions for businesses engaged in international trade. The most immediate benefit is cost reduction - consolidated shipments typically achieve 20-40% savings compared to equivalent LCL shipments. This saving stems from multiple factors: FCL rates are significantly lower per CBM than LCL rates, handling fees are reduced through single-container processing, documentation costs are shared across multiple shipments, and destination charges are typically lower on a per-shipment basis.

Operational benefits extend beyond direct cost savings. Consolidated shipments benefit from simplified tracking - one container to monitor instead of multiple LCL shipments. Insurance claims processes can be more straightforward with single-container liability. Customs clearance is streamlined when shipments share compatible product categories and destinations. Additionally, consolidation can improve inventory management by creating predictable shipping schedules and enabling better planning of goods receipt.

From an environmental perspective, consolidation reduces the carbon footprint of shipping by maximizing container utilization. Half-empty containers consume similar fuel and resources to fully-loaded ones, so consolidating cargo into fewer containers reduces per-unit emissions. This environmental benefit increasingly matters for companies with sustainability commitments or facing carbon reporting requirements.

Risk management benefits include reduced cargo handling at terminals (each handling event introduces damage risk), consolidated insurance coverage options, and the ability to work with established consolidators who have proven handling procedures. For growing businesses, consolidation provides a stepping stone between LCL shipping and volume levels that justify dedicated FCL shipments, allowing gradual scaling of shipping operations.`,
  },
  whenToConsolidate: {
    title: "When to Consolidate Cargo",
    content: `Determining when to consolidate cargo requires evaluating multiple factors to ensure the benefits outweigh the additional complexity and time involved. The primary decision point is volume - consolidation typically makes economic sense when your shipment volume approaches the break-even point for container utilization, generally above 15 CBM for 20-foot containers and above 35 CBM for 40-foot containers. Below these thresholds, the freight savings may not justify the coordination effort and waiting time.

Time sensitivity is equally important in the consolidation decision. If your supply chain operates on just-in-time principles, or if you're shipping seasonal goods with narrow market windows, the additional 5-14 days that consolidation typically adds to transit may be unacceptable. Conversely, if you have buffer inventory or flexible delivery requirements, consolidation becomes more attractive.

Product characteristics influence consolidation suitability. Dry goods, general merchandise, and non-perishables are ideal candidates. Temperature-sensitive cargo, hazardous materials, high-value items requiring enhanced security, and fragile goods may face restrictions or additional costs in consolidated shipments. Cargo compatibility is also crucial - ensure your goods can safely share container space with other shippers' cargo.

Origin-destination dynamics matter significantly. Consolidation opportunities are most abundant on high-volume trade lanes where consolidators regularly dispatch containers. Niche or low-volume lanes may offer limited consolidation options, extending wait times. Regional consolidation (grouping cargo for a destination country or region rather than specific port) can expand opportunities.

Finally, consider your organizational readiness. Successful consolidation requires coordination with suppliers on cargo ready dates, documentation accuracy, and communication with consignees about the process. If your organization lacks the bandwidth for this coordination, the theoretical savings may not materialize in practice.`,
  },
  lclVsFcl: {
    title: "LCL vs FCL Decision Framework",
    content: `The decision between LCL shipping and FCL shipping (whether through consolidation or direct booking) involves a systematic evaluation of volume, cost, time, and risk factors. Volume is the starting point: below approximately 15 CBM, LCL is almost always more economical; between 15-25 CBM, the decision requires detailed cost comparison; above 25 CBM, FCL becomes increasingly attractive. However, volume alone doesn't determine the optimal choice.

Cost analysis must extend beyond basic freight rates. LCL pricing includes per-CBM freight rates plus minimum charges, CFS handling fees at origin and destination, documentation fees per shipment, and destination delivery charges. FCL pricing includes the all-in container rate plus origin handling, potential warehouse storage if consolidating, and destination charges. A comprehensive comparison should include all these elements.

Transit time requirements often override cost considerations. LCL shipments typically move on the next available sailing, while consolidated FCL shipments wait for volume accumulation. If your lead time allows for 5-14 additional days, consolidation savings become viable. For urgent shipments, LCL or direct FCL (if volume permits) are preferable.

Risk tolerance affects the decision differently for each mode. LCL involves multiple handling events and cargo mingling, increasing damage risk but spreading it across multiple carriers and documentation chains. FCL reduces handling but concentrates risk on a single container and carrier. Insurance costs and coverage should be compared for both scenarios.

Operational factors include documentation complexity (LCL requires individual documentation per shipment; consolidated FCL adds master/house bill complexity), tracking granularity (LCL provides individual shipment tracking; FCL tracks the container), and destination processes (LCL requires individual releases; FCL requires deconsolidation coordination).

A practical decision framework starts with volume assessment, adds time constraint filtering, incorporates comprehensive cost comparison, and ends with risk and operational factor evaluation. Document your decision criteria and review periodically as freight rates and business requirements change.`,
  },
};

export function CargoConsolidationOptimizer() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  const [showCopied, setShowCopied] = useState(false);

  // Shipments state
  const [shipments, setShipments] = useState<Shipment[]>([
    {
      id: "SHP-001",
      name: "Electronics Lot A",
      origin: "Shanghai, CN",
      destination: "Los Angeles, US",
      readyDate: new Date().toISOString().split("T")[0],
      cargoType: "LCL",
      volume: 8.5,
      weight: 2200,
      value: 45000,
      lclRate: 85,
      currentCost: 722.5,
      transitDays: 18,
      priority: "high",
      consolidate: true,
    },
    {
      id: "SHP-002",
      name: "Textiles Batch B",
      origin: "Shanghai, CN",
      destination: "Los Angeles, US",
      readyDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      cargoType: "LCL",
      volume: 12.3,
      weight: 3500,
      value: 28000,
      lclRate: 85,
      currentCost: 1045.5,
      transitDays: 18,
      priority: "medium",
      consolidate: true,
    },
    {
      id: "SHP-003",
      name: "Auto Parts C",
      origin: "Shanghai, CN",
      destination: "Los Angeles, US",
      readyDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      cargoType: "LCL",
      volume: 6.8,
      weight: 4800,
      value: 65000,
      lclRate: 85,
      currentCost: 578,
      transitDays: 18,
      priority: "high",
      consolidate: true,
    },
    {
      id: "SHP-004",
      name: "Furniture D",
      origin: "Shenzhen, CN",
      destination: "Los Angeles, US",
      readyDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      cargoType: "LCL",
      volume: 15.2,
      weight: 2100,
      value: 32000,
      lclRate: 85,
      currentCost: 1292,
      transitDays: 17,
      priority: "low",
      consolidate: true,
    },
  ]);

  // Consolidation parameters
  const [maxWarehouseDays, setMaxWarehouseDays] = useState(7);
  const [warehouseRegion, setWarehouseRegion] = useState("China - Shanghai");
  const [targetUtilization, setTargetUtilization] = useState(80);
  const [includePartialConsolidation, setIncludePartialConsolidation] = useState(true);
  const [considerTransitImpact, setConsiderTransitImpact] = useState(true);

  // Calculate consolidation opportunities
  const result = useMemo<ConsolidationResult>(() => {
    const selectedShipments = shipments.filter((s) => s.consolidate);
    let totalOriginalCost = 0;
    let totalConsolidatedCost = 0;
    let totalSavings = 0;
    const opportunities: ConsolidationOpportunity[] = [];

    if (selectedShipments.length === 0) {
      return {
        totalOriginalCost: 0,
        totalConsolidatedCost: 0,
        totalSavings: 0,
        savingsPercent: 0,
        avgContainerUtilization: 0,
        lclToFclConversions: 0,
        warehouseBundlingSavings: 0,
        transitImpact: 0,
        opportunities: [],
      };
    }

    // Group shipments by destination
    const destinationGroups = new Map<string, Shipment[]>();
    selectedShipments.forEach((s) => {
      const key = s.destination;
      if (!destinationGroups.has(key)) {
        destinationGroups.set(key, []);
      }
      destinationGroups.get(key)!.push(s);
    });

    // Process each destination group
    destinationGroups.forEach((groupShipments, destination) => {
      const totalVolume = groupShipments.reduce((sum, s) => sum + s.volume, 0);
      const totalWeight = groupShipments.reduce((sum, s) => sum + s.weight, 0);
      const originalCost = groupShipments.reduce((sum, s) => sum + s.currentCost, 0);
      totalOriginalCost += originalCost;

      // Find best container fit
      let bestContainer: keyof typeof CONTAINERS | null = null;
      let bestUtilization = 0;
      let bestCost = originalCost;
      let bestWarehouseCost = 0;

      Object.entries(CONTAINERS).forEach(([type, spec]) => {
        const volumeUtilization = (totalVolume / spec.capacity) * 100;
        const weightUtilization = (totalWeight / spec.maxPayload) * 100;
        const utilization = Math.min(volumeUtilization, weightUtilization);

        // Check if this container is a viable option
        if (utilization >= 50 && utilization <= 100) {
          const warehouseCostPerCBM = WAREHOUSE_COSTS.find((w) => w.region === warehouseRegion)?.cost || 0.45;
          const earliestDate = new Date(Math.min(...groupShipments.map((s) => new Date(s.readyDate).getTime())));
          const latestDate = new Date(Math.max(...groupShipments.map((s) => new Date(s.readyDate).getTime())));
          const warehouseDays = Math.min(
            Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)),
            maxWarehouseDays
          );
          const warehouseCost = totalVolume * warehouseCostPerCBM * warehouseDays;

          const consolidatedCost = spec.cost + warehouseCost;

          // Select best option: either cheaper or meets target utilization
          if (consolidatedCost < bestCost || (bestContainer === null && utilization >= targetUtilization)) {
            bestContainer = type as keyof typeof CONTAINERS;
            bestUtilization = utilization;
            bestCost = consolidatedCost;
            bestWarehouseCost = warehouseCost;
          }
        }
      });

      if (bestContainer) {
        const container = CONTAINERS[bestContainer];
        const warehouseCostPerCBM = WAREHOUSE_COSTS.find((w) => w.region === warehouseRegion)?.cost || 0.45;
        const earliestDate = new Date(Math.min(...groupShipments.map((s) => new Date(s.readyDate).getTime())));
        const latestDate = new Date(Math.max(...groupShipments.map((s) => new Date(s.readyDate).getTime())));
        const warehouseDays = Math.min(
          Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24)),
          maxWarehouseDays
        );

        const consolidatedCost = container.cost + bestWarehouseCost;
        const savings = originalCost - consolidatedCost;
        const savingsPercent = originalCost > 0 ? (savings / originalCost) * 100 : 0;
        const feasibility = getFeasibility(savingsPercent, bestUtilization);

        opportunities.push({
          id: `CONS-${opportunities.length + 1}`,
          shipments: groupShipments.map((s) => s.id),
          destination,
          totalVolume,
          totalWeight,
          containerType: bestContainer,
          containerUtilization: bestUtilization,
          consolidatedCost,
          originalCost,
          savings,
          savingsPercent,
          warehouseDays,
          warehouseCost: bestWarehouseCost,
          additionalTransitDays: considerTransitImpact ? 2 : 0,
          recommendation: getSavingsRecommendation(savingsPercent, bestUtilization, warehouseDays),
          feasibility,
        });

        totalConsolidatedCost += consolidatedCost;
        totalSavings += savings;
      } else {
        // No viable container found, keep original cost
        totalConsolidatedCost += originalCost;
      }
    });

    // Add non-consolidated shipments
    shipments.filter((s) => !s.consolidate).forEach((s) => {
      totalOriginalCost += s.currentCost;
      totalConsolidatedCost += s.currentCost;
    });

    const lclToFclConversions = opportunities.filter(
      (o) => o.feasibility === "excellent" || o.feasibility === "good"
    ).length;
    const warehouseBundlingSavings = opportunities.reduce((sum, o) => sum + o.savings * 0.15, 0);
    const transitImpact = considerTransitImpact ? opportunities.reduce((sum, o) => sum + o.additionalTransitDays, 0) : 0;
    const avgContainerUtilization = opportunities.length > 0
      ? opportunities.reduce((sum, o) => sum + o.containerUtilization, 0) / opportunities.length
      : 0;

    return {
      totalOriginalCost,
      totalConsolidatedCost,
      totalSavings,
      savingsPercent: totalOriginalCost > 0 ? (totalSavings / totalOriginalCost) * 100 : 0,
      avgContainerUtilization,
      lclToFclConversions,
      warehouseBundlingSavings,
      transitImpact,
      opportunities,
    };
  }, [shipments, maxWarehouseDays, warehouseRegion, targetUtilization, includePartialConsolidation, considerTransitImpact]);

  // Chart data
  const costComparisonData = [
    { name: "Original (LCL)", value: result.totalOriginalCost, fill: COLORS.ocean },
    { name: "Consolidated (FCL)", value: result.totalConsolidatedCost, fill: COLORS.logistics },
  ];

  const utilizationChartData = result.opportunities.map((o) => ({
    name: `${o.containerType} → ${o.destination.split(",")[0]}`,
    utilization: o.containerUtilization,
    savings: o.savingsPercent,
  }));

  const savingsBreakdownData = [
    { name: "LCL to FCL Conversion", value: result.totalSavings * 0.65, fill: COLORS.ocean },
    { name: "Warehouse Bundling", value: result.warehouseBundlingSavings, fill: COLORS.logistics },
    { name: "Reduced Handling", value: result.totalSavings * 0.15, fill: COLORS.warning },
    { name: "Documentation Savings", value: result.totalSavings * 0.05, fill: COLORS.purple },
  ].filter(d => d.value > 0);

  // Cost breakdown pie chart data
  const costBreakdownData = [
    { name: "Freight Charges", value: result.totalConsolidatedCost * 0.70, fill: COLORS.ocean },
    { name: "Warehouse Storage", value: result.warehouseBundlingSavings, fill: COLORS.warning },
    { name: "Documentation", value: result.opportunities.length * 75, fill: COLORS.logistics },
    { name: "Handling Fees", value: result.totalConsolidatedCost * 0.05, fill: COLORS.purple },
  ];

  // Timeline data for transit impact
  const timelineData = useMemo(() => {
    const data = [];
    const baseDate = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);
      data.push({
        day: i + 1,
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        lclCumulative: i < 18 ? 0 : result.totalOriginalCost,
        fclCumulative: i >= 20 ? result.totalConsolidatedCost : 0,
        utilization: i < 7 ? 0 : Math.min(100, result.avgContainerUtilization * (i / 15)),
      });
    }
    return data;
  }, [result]);

  // Before/After comparison data
  const beforeAfterData = [
    {
      category: "Freight Cost",
      before: result.totalOriginalCost,
      after: result.totalConsolidatedCost,
    },
    {
      category: "Per CBM Rate",
      before: shipments.filter(s => s.consolidate).length > 0 ? result.totalOriginalCost / shipments.filter(s => s.consolidate).reduce((sum, s) => sum + s.volume, 0) : 0,
      after: shipments.filter(s => s.consolidate).length > 0 ? result.totalConsolidatedCost / shipments.filter(s => s.consolidate).reduce((sum, s) => sum + s.volume, 0) : 0,
    },
    {
      category: "Documentation",
      before: shipments.filter(s => s.consolidate).length * 75,
      after: result.opportunities.length * 75,
    },
    {
      category: "Handling",
      before: shipments.filter(s => s.consolidate).length * 45,
      after: result.opportunities.length * 35,
    },
  ];

  // Add/remove shipment handlers
  const addShipment = () => {
    const newId = `SHP-${String(shipments.length + 1).padStart(3, "0")}`;
    setShipments([
      ...shipments,
      {
        id: newId,
        name: `New Shipment ${shipments.length + 1}`,
        origin: "Shanghai, CN",
        destination: "Los Angeles, US",
        readyDate: new Date().toISOString().split("T")[0],
        cargoType: "LCL",
        volume: 5,
        weight: 1000,
        value: 20000,
        lclRate: 85,
        currentCost: 425,
        transitDays: 18,
        priority: "medium",
        consolidate: true,
      },
    ]);
  };

  const removeShipment = (id: string) => {
    setShipments(shipments.filter((s) => s.id !== id));
  };

  const updateShipment = (id: string, field: keyof Shipment, value: string | number | boolean) => {
    setShipments(
      shipments.map((s) => {
        if (s.id === id) {
          const updated = { ...s, [field]: value };
          // Recalculate current cost when volume or rate changes
          if (field === "volume" || field === "lclRate") {
            updated.currentCost = updated.volume * updated.lclRate;
          }
          return updated;
        }
        return s;
      })
    );
  };

  const toggleAllConsolidation = (value: boolean) => {
    setShipments(shipments.map((s) => ({ ...s, consolidate: value })));
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility) {
      case "excellent":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "good":
        return "bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20";
      case "marginal":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    }
  };

  const resetForm = () => {
    setMaxWarehouseDays(7);
    setWarehouseRegion("China - Shanghai");
    setTargetUtilization(80);
    setIncludePartialConsolidation(true);
    setConsiderTransitImpact(true);
  };

  // Export functionality
  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      currency,
      summary: {
        totalOriginalCost: result.totalOriginalCost,
        totalConsolidatedCost: result.totalConsolidatedCost,
        totalSavings: result.totalSavings,
        savingsPercent: result.savingsPercent,
        avgContainerUtilization: result.avgContainerUtilization,
        lclToFclConversions: result.lclToFclConversions,
      },
      shipments: shipments.filter(s => s.consolidate),
      opportunities: result.opportunities,
      parameters: {
        maxWarehouseDays,
        warehouseRegion,
        targetUtilization,
        includePartialConsolidation,
        considerTransitImpact,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consolidation-analysis-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share functionality
  const shareResults = async () => {
    const shareText = `Cargo Consolidation Analysis
Total Savings: ${formatCurrency(result.totalSavings, currency)} (${result.savingsPercent.toFixed(1)}%)
Shipments: ${shipments.filter(s => s.consolidate).length}
LCL to FCL Conversions: ${result.lclToFclConversions}
Container Utilization: ${result.avgContainerUtilization.toFixed(0)}%`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Cargo Consolidation Analysis",
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareText);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8 border border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["LCL Shipping", "Consolidation", "Cost Optimization"].map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Badge
                    variant="outline"
                    className="px-3 py-1 text-sm font-medium bg-background/50 border-[var(--ocean)]/30 text-[var(--ocean)] dark:text-[var(--ocean-light)]"
                  >
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Cargo Consolidation Optimizer
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Optimize your shipping costs by consolidating multiple LCL shipments into FCL containers.
                Analyze savings, utilization, and transit impact in real-time.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button
              size="sm"
              className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white"
              onClick={shareResults}
            >
              {showCopied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
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

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="border-l-4 border-l-[var(--ocean)] bg-background/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-[var(--ocean)]" />
                <span className="text-sm text-muted-foreground">Total Shipments</span>
              </div>
              <p className="text-2xl font-bold">{shipments.length}</p>
              <p className="text-xs text-muted-foreground">
                {shipments.filter((s) => s.consolidate).length} selected for consolidation
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-[var(--logistics)] bg-background/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Box className="h-4 w-4 text-[var(--logistics)]" />
                <span className="text-sm text-muted-foreground">Total Volume</span>
              </div>
              <p className="text-2xl font-bold">
                {shipments.reduce((sum, s) => sum + s.volume, 0).toFixed(1)} CBM
              </p>
              <p className="text-xs text-muted-foreground">
                {(shipments.reduce((sum, s) => sum + s.weight, 0) / 1000).toFixed(2)} tonnes
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 bg-background/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Potential Savings</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(result.totalSavings, currency)}
              </p>
              <p className="text-xs text-muted-foreground">{result.savingsPercent.toFixed(1)}% reduction</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 bg-background/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Container className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">LCL → FCL Conversions</span>
              </div>
              <p className="text-2xl font-bold">{result.lclToFclConversions}</p>
              <p className="text-xs text-muted-foreground">
                {result.opportunities.length} consolidation group(s)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="options" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Options</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          {/* Shipment Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[var(--ocean)]" />
                Shipment Parameters
              </CardTitle>
              <CardDescription>Configure consolidation optimization settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm font-medium">Max Warehouse Days</Label>
                    <Badge variant="secondary">{maxWarehouseDays} days</Badge>
                  </div>
                  <Slider
                    value={[maxWarehouseDays]}
                    onValueChange={(v) => setMaxWarehouseDays(v[0])}
                    min={1}
                    max={21}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Maximum days cargo can wait at warehouse
                  </p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm font-medium">Target Utilization</Label>
                    <Badge variant="secondary">{targetUtilization}%</Badge>
                  </div>
                  <Slider
                    value={[targetUtilization]}
                    onValueChange={(v) => setTargetUtilization(v[0])}
                    min={50}
                    max={100}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum container fill target
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Warehouse Region</Label>
                  <Select value={warehouseRegion} onValueChange={setWarehouseRegion}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WAREHOUSE_COSTS.map((w) => (
                        <SelectItem key={w.region} value={w.region}>
                          {w.region} (${w.cost}/CBM/day)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Partial Consolidation</span>
                    <Switch
                      checked={includePartialConsolidation}
                      onCheckedChange={setIncludePartialConsolidation}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Consider Transit Impact</span>
                    <Switch
                      checked={considerTransitImpact}
                      onCheckedChange={setConsiderTransitImpact}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Details */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Cargo Details
                  </CardTitle>
                  <CardDescription>Add shipments to analyze consolidation opportunities</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleAllConsolidation(true)}>
                    Select All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleAllConsolidation(false)}>
                    Deselect All
                  </Button>
                  <Button size="sm" onClick={addShipment} className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white">
                    <Plus className="h-4 w-4 mr-1" /> Add Shipment
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2">
                {shipments.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No shipments added yet.</p>
                    <Button onClick={addShipment} className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white">
                      <Plus className="h-4 w-4 mr-2" /> Add First Shipment
                    </Button>
                  </div>
                ) : (
                  shipments.map((shipment) => (
                    <Card
                      key={shipment.id}
                      className={`${shipment.consolidate ? "border-[var(--ocean)]/30 bg-[var(--ocean)]/5" : ""} transition-colors`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={shipment.consolidate}
                              onCheckedChange={(v) => updateShipment(shipment.id, "consolidate", v)}
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[var(--ocean)] border-[var(--ocean)]/30">
                                  {shipment.id}
                                </Badge>
                                <span className="font-medium">{shipment.name}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {shipment.origin} → {shipment.destination}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                shipment.priority === "high"
                                  ? "text-red-500 border-red-500/30"
                                  : shipment.priority === "medium"
                                  ? "text-yellow-500 border-yellow-500/30"
                                  : "text-green-500 border-green-500/30"
                              }
                            >
                              {shipment.priority}
                            </Badge>
                            <Badge variant="secondary">{shipment.cargoType}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeShipment(shipment.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Origin</Label>
                            <Select
                              value={shipment.origin}
                              onValueChange={(v) => updateShipment(shipment.id, "origin", v)}
                            >
                              <SelectTrigger className="h-9 mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TRADE_LANES.map((lane) => (
                                  <SelectItem key={lane.origin} value={lane.origin}>
                                    {lane.origin}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Destination</Label>
                            <Select
                              value={shipment.destination}
                              onValueChange={(v) => updateShipment(shipment.id, "destination", v)}
                            >
                              <SelectTrigger className="h-9 mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TRADE_LANES.map((lane) => (
                                  <SelectItem key={lane.destination} value={lane.destination}>
                                    {lane.destination}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Ready Date</Label>
                            <Input
                              type="date"
                              value={shipment.readyDate}
                              onChange={(e) => updateShipment(shipment.id, "readyDate", e.target.value)}
                              className="h-9 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Volume (CBM)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={shipment.volume}
                              onChange={(e) => updateShipment(shipment.id, "volume", parseFloat(e.target.value) || 0)}
                              className="h-9 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
                            <Input
                              type="number"
                              value={shipment.weight}
                              onChange={(e) => updateShipment(shipment.id, "weight", parseFloat(e.target.value) || 0)}
                              className="h-9 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">LCL Rate ($/CBM)</Label>
                            <Input
                              type="number"
                              value={shipment.lclRate}
                              onChange={(e) => updateShipment(shipment.id, "lclRate", parseFloat(e.target.value) || 0)}
                              className="h-9 mt-1"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{shipment.transitDays} days transit</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>{shipment.volume} CBM</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-muted-foreground">Current Cost: </span>
                            <span className="font-bold text-[var(--ocean)]">
                              {formatCurrency(shipment.currentCost, currency)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Consolidation Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--logistics)]" />
                Consolidation Opportunities
              </CardTitle>
              <CardDescription>Identified consolidation options with savings analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {result.opportunities.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No consolidation opportunities found. Select shipments with matching destinations.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {result.opportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="p-4 border border-border rounded-lg hover:border-[var(--ocean)]/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">{opp.id}</Badge>
                            <Badge className={getFeasibilityColor(opp.feasibility)}>
                              {opp.feasibility.charAt(0).toUpperCase() + opp.feasibility.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Shipments: {opp.shipments.join(", ")} → {opp.destination}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[var(--logistics)]">
                            {formatCurrency(opp.savings, currency)}
                          </p>
                          <p className="text-sm text-muted-foreground">{opp.savingsPercent.toFixed(1)}% savings</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-4">
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Container</p>
                          <p className="font-bold">{opp.containerType}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Total Volume</p>
                          <p className="font-bold">{opp.totalVolume.toFixed(1)} CBM</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Total Weight</p>
                          <p className="font-bold">{(opp.totalWeight / 1000).toFixed(2)}t</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Utilization</p>
                          <p className="font-bold">{opp.containerUtilization.toFixed(0)}%</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Warehouse Days</p>
                          <p className="font-bold">{opp.warehouseDays} days</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Storage Cost</p>
                          <p className="font-bold">{formatCurrency(opp.warehouseCost, currency)}</p>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Added Transit</p>
                          <p className="font-bold">{opp.additionalTransitDays} days</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Info className="h-4 w-4" />
                          {opp.recommendation}
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <span className="text-sm text-muted-foreground">Original: </span>
                            <span className="font-medium line-through text-red-500">
                              {formatCurrency(opp.originalCost, currency)}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm text-muted-foreground">Consolidated: </span>
                            <span className="font-bold text-[var(--logistics)]">
                              {formatCurrency(opp.consolidatedCost, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-[var(--ocean)]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                  <span className="text-sm text-muted-foreground">Original Cost</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.totalOriginalCost, currency)}</p>
              </CardContent>
            </Card>
            <Card className="border-[var(--logistics)]/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-[var(--logistics)]" />
                  <span className="text-sm text-muted-foreground">Consolidated Cost</span>
                </div>
                <p className="text-2xl font-bold text-[var(--logistics)]">
                  {formatCurrency(result.totalConsolidatedCost, currency)}
                </p>
              </CardContent>
            </Card>
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Total Savings</span>
                </div>
                <p className="text-2xl font-bold text-green-500">
                  {formatCurrency(result.totalSavings, currency)}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">{result.savingsPercent.toFixed(1)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Container className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-muted-foreground">LCL to FCL</span>
                </div>
                <p className="text-2xl font-bold">{result.lclToFclConversions}</p>
                <p className="text-sm text-muted-foreground">Conversions</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Breakdown
                </CardTitle>
                <CardDescription>Distribution of consolidated shipping costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: "hsl(var(--muted-foreground))" }}
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Before/After Comparison Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="h-5 w-5 text-[var(--logistics)]" />
                  Before vs After Comparison
                </CardTitle>
                <CardDescription>Cost comparison before and after consolidation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={beforeAfterData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="hsl(var(--border))" />
                      <XAxis type="number" tickFormatter={(v) => `$${v}`} stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="category" type="category" width={100} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="before" name="Before (LCL)" fill={COLORS.ocean} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="after" name="After (FCL)" fill={COLORS.logistics} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cost Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Cost Comparison</CardTitle>
                <CardDescription>Original LCL costs vs consolidated FCL costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={costComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `$${v}`} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value, currency)}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {costComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Savings Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Savings Breakdown</CardTitle>
                <CardDescription>Distribution of cost savings by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  {savingsBreakdownData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={savingsBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {savingsBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, currency)}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No savings data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Utilization Over Time Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Utilization Over Time
              </CardTitle>
              <CardDescription>Container utilization progression during consolidation period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis tickFormatter={(v) => `${v}%`} stroke="hsl(var(--muted-foreground))" />
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
                      dataKey="utilization"
                      name="Container Utilization"
                      stroke={COLORS.ocean}
                      fill={COLORS.ocean}
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Cost Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cost Component</TableHead>
                      <TableHead className="text-right">Original</TableHead>
                      <TableHead className="text-right">Consolidated</TableHead>
                      <TableHead className="text-right">Savings</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Freight Charges</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.totalOriginalCost * 0.85, currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.totalConsolidatedCost * 0.70, currency)}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {formatCurrency(
                          result.totalOriginalCost * 0.85 - result.totalConsolidatedCost * 0.70,
                          currency
                        )}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {result.totalOriginalCost > 0
                          ? (
                              ((result.totalOriginalCost * 0.85 - result.totalConsolidatedCost * 0.70) /
                                (result.totalOriginalCost * 0.85)) *
                              100
                            ).toFixed(1)
                          : "0"}
                        %
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Warehouse Storage</TableCell>
                      <TableCell className="text-right">{formatCurrency(0, currency)}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.warehouseBundlingSavings, currency)}
                      </TableCell>
                      <TableCell className="text-right text-red-500">
                        -{formatCurrency(result.warehouseBundlingSavings, currency)}
                      </TableCell>
                      <TableCell className="text-right text-red-500">-</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Documentation</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(shipments.filter((s) => s.consolidate).length * 75, currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.opportunities.length * 75, currency)}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {formatCurrency(
                          (shipments.filter((s) => s.consolidate).length - result.opportunities.length) * 75,
                          currency
                        )}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {shipments.filter((s) => s.consolidate).length > 0
                          ? (
                              (((shipments.filter((s) => s.consolidate).length - result.opportunities.length) * 75) /
                                (shipments.filter((s) => s.consolidate).length * 75)) *
                              100
                            ).toFixed(1)
                          : "0"}
                        %
                      </TableCell>
                    </TableRow>
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.totalOriginalCost, currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(result.totalConsolidatedCost, currency)}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {formatCurrency(result.totalSavings, currency)}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {result.savingsPercent.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Options */}
        <TabsContent value="options" className="space-y-6 mt-6">
          {/* Container Options */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="h-5 w-5 text-[var(--ocean)]" />
                Container Options Analysis
              </CardTitle>
              <CardDescription>Compare container utilization for different sizes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(CONTAINERS).map(([type, spec]) => {
                  const totalVolume = shipments
                    .filter((s) => s.consolidate)
                    .reduce((sum, s) => sum + s.volume, 0);
                  const totalWeight = shipments
                    .filter((s) => s.consolidate)
                    .reduce((sum, s) => sum + s.weight, 0);
                  const volUtil = (totalVolume / spec.capacity) * 100;
                  const weightUtil = (totalWeight / spec.maxPayload) * 100;
                  const utilization = Math.min(volUtil, weightUtil);
                  const isViable = utilization >= targetUtilization && utilization <= 100;

                  return (
                    <div
                      key={type}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        isViable
                          ? "border-[var(--logistics)] bg-[var(--logistics)]/5"
                          : utilization > 100
                          ? "border-red-500 bg-red-500/5"
                          : "border-border"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-lg">{type}</span>
                        {isViable && <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />}
                        {utilization > 100 && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Volume Utilization</span>
                            <span className={volUtil > 100 ? "text-red-500 font-bold" : ""}>
                              {volUtil.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={Math.min(volUtil, 100)} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Weight Utilization</span>
                            <span className={weightUtil > 100 ? "text-red-500 font-bold" : ""}>
                              {weightUtil.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={Math.min(weightUtil, 100)} className="h-2" />
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
                        <p>
                          {spec.capacity} CBM • {(spec.maxPayload / 1000).toFixed(1)}t max
                        </p>
                        <p className="font-medium text-foreground">
                          FCL Rate: {formatCurrency(spec.cost, currency)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* LCL to FCL Break-Even Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                LCL to FCL Break-Even Analysis
              </CardTitle>
              <CardDescription>When to convert from LCL to FCL for optimal savings</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertTitle>Break-Even Point</AlertTitle>
                <AlertDescription>
                  The break-even volume is where LCL cost equals FCL cost. Above this point, FCL becomes more
                  economical. For a 20GP at ${CONTAINERS["20GP"].cost.toLocaleString()}, the break-even is ~
                  {(CONTAINERS["20GP"].cost / 85).toFixed(0)} CBM at $85/CBM LCL rate.
                </AlertDescription>
              </Alert>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Volume (CBM)</TableHead>
                      <TableHead className="text-right">LCL Cost @ $85/CBM</TableHead>
                      <TableHead className="text-right">20GP FCL</TableHead>
                      <TableHead className="text-right">40HC FCL</TableHead>
                      <TableHead className="text-right">Best Option</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[10, 15, 20, 25, 30, 35, 40, 50].map((vol) => {
                      const lclCost = vol * 85;
                      const gp20 = CONTAINERS["20GP"].cost;
                      const hc40 = CONTAINERS["40HC"].cost;
                      let recommendation = "LCL";
                      let savings = 0;

                      if (vol >= 15 && lclCost > gp20 && vol <= CONTAINERS["20GP"].capacity) {
                        recommendation = "20GP";
                        savings = lclCost - gp20;
                      }
                      if (vol >= 40 && lclCost > hc40 && vol <= CONTAINERS["40HC"].capacity) {
                        recommendation = "40HC";
                        savings = lclCost - hc40;
                      }

                      return (
                        <TableRow key={vol}>
                          <TableCell className="font-medium">{vol} CBM</TableCell>
                          <TableCell className="text-right">{formatCurrency(lclCost, currency)}</TableCell>
                          <TableCell
                            className={`text-right ${
                              lclCost > gp20 && vol <= CONTAINERS["20GP"].capacity
                                ? "text-[var(--logistics)] font-bold"
                                : ""
                            }`}
                          >
                            {formatCurrency(gp20, currency)}
                            {lclCost > gp20 && vol <= CONTAINERS["20GP"].capacity && (
                              <span className="ml-2 text-xs">✓ Best</span>
                            )}
                          </TableCell>
                          <TableCell
                            className={`text-right ${
                              lclCost > hc40 && vol >= 40 && vol <= CONTAINERS["40HC"].capacity
                                ? "text-[var(--logistics)] font-bold"
                                : ""
                            }`}
                          >
                            {formatCurrency(hc40, currency)}
                            {lclCost > hc40 && vol >= 40 && vol <= CONTAINERS["40HC"].capacity && (
                              <span className="ml-2 text-xs">✓ Best</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                recommendation === "LCL"
                                  ? "text-muted-foreground"
                                  : "text-[var(--logistics)] border-[var(--logistics)]/30 bg-[var(--logistics)]/10"
                              }
                            >
                              {recommendation}
                              {savings > 0 && ` (Save ${formatCurrency(savings, currency)})`}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Utilization Chart */}
          {result.opportunities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Utilization by Consolidation Group</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={utilizationChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="hsl(var(--border))" />
                      <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="hsl(var(--muted-foreground))" />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="utilization" name="Utilization %" fill={COLORS.ocean} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="savings" name="Savings %" fill={COLORS.logistics} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warehouse Costs Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-[var(--ocean)]" />
                Warehouse Rates by Region
              </CardTitle>
              <CardDescription>Storage costs per CBM per day by region</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">$/CBM/Day</TableHead>
                    <TableHead className="text-right">7-Day Cost</TableHead>
                    <TableHead className="text-right">14-Day Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {WAREHOUSE_COSTS.map((w) => (
                    <TableRow key={w.region} className={w.region === warehouseRegion ? "bg-[var(--ocean)]/5" : ""}>
                      <TableCell className="text-sm">{w.region}</TableCell>
                      <TableCell className="text-right">{formatCurrency(w.cost, currency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(w.cost * 7, currency)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(w.cost * 14, currency)}</TableCell>
                    </TableRow>
                  ))}
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
                Educational Content
              </CardTitle>
              <CardDescription>Learn about cargo consolidation strategies and best practices</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {/* What is Cargo Consolidation */}
                <AccordionItem value="what-is" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                        <Layers className="h-5 w-5 text-[var(--ocean)]" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{EDUCATIONAL_CONTENT.whatIsConsolidation.title}</p>
                        <p className="text-sm text-muted-foreground">Understanding the fundamentals of consolidation</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                    {EDUCATIONAL_CONTENT.whatIsConsolidation.content}
                  </AccordionContent>
                </AccordionItem>

                {/* Benefits of Consolidation */}
                <AccordionItem value="benefits" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[var(--logistics)]/10 rounded-lg">
                        <Award className="h-5 w-5 text-[var(--logistics)]" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{EDUCATIONAL_CONTENT.benefits.title}</p>
                        <p className="text-sm text-muted-foreground">Cost, operational, and environmental advantages</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                    {EDUCATIONAL_CONTENT.benefits.content}
                  </AccordionContent>
                </AccordionItem>

                {/* When to Consolidate */}
                <AccordionItem value="when" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Timer className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{EDUCATIONAL_CONTENT.whenToConsolidate.title}</p>
                        <p className="text-sm text-muted-foreground">Key factors for consolidation decisions</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                    {EDUCATIONAL_CONTENT.whenToConsolidate.content}
                  </AccordionContent>
                </AccordionItem>

                {/* LCL vs FCL Decision */}
                <AccordionItem value="lcl-fcl" className="border border-border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/10 rounded-lg">
                        <Scale className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold">{EDUCATIONAL_CONTENT.lclVsFcl.title}</p>
                        <p className="text-sm text-muted-foreground">Systematic evaluation framework</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-4">
                    {EDUCATIONAL_CONTENT.lclVsFcl.content}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Pro Tips Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Pro Tips for Successful Consolidation
              </CardTitle>
              <CardDescription>Actionable advice from industry experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <div
                    key={index}
                    className="p-4 border border-border rounded-lg hover:border-[var(--ocean)]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                        <tip.icon className="h-5 w-5 text-[var(--ocean)]" />
                      </div>
                      <h4 className="font-semibold">{tip.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from common consolidation pitfalls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <div
                    key={index}
                    className="p-4 border border-red-500/20 bg-red-500/5 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500/10 rounded-lg mt-0.5">
                        <mistake.icon className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
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
              <CardDescription>Comprehensive answers to common cargo consolidation questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-3">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`faq-${index}`}
                    className="border border-border rounded-lg px-4 data-[state=open]:bg-muted/30"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-start gap-3 text-left">
                        <div className="p-2 bg-[var(--ocean)]/10 rounded-lg shrink-0 mt-0.5">
                          <HelpCircle className="h-4 w-4 text-[var(--ocean)]" />
                        </div>
                        <p className="font-medium pr-4">{faq.question}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pl-12">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Separator />
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
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
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={resetForm}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm" onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white"
            onClick={shareResults}
          >
            {showCopied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
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
  );
}
