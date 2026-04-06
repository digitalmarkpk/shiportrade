"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Send,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart3,
  Calculator,
  RefreshCw,
  Percent,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Lightbulb,
  Scale,
  Award,
  ChevronUp,
  ChevronDown,
  Clock,
  Ship,
  Container,
  Globe,
  Users,
  Building2,
  Plus,
  Trash2,
  Eye,
  Download,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Star,
  ArrowRight,
  Zap,
  Shield,
  X,
  Check,
  Share2,
  RotateCcw,
  BookOpen,
  HelpCircle,
  AlertCircle,
  TrendingFlat,
  PieChart as PieChartIcon,
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { currencies } from "@/lib/constants/currencies";

// Carrier data for bidding
const carriers = [
  { id: 1, name: "Maersk", region: "Global", reliability: 94, transit: 28, rating: 4.8 },
  { id: 2, name: "MSC", region: "Global", reliability: 91, transit: 30, rating: 4.5 },
  { id: 3, name: "CMA CGM", region: "Global", reliability: 93, transit: 27, rating: 4.7 },
  { id: 4, name: "COSCO", region: "Asia-Pacific", reliability: 89, transit: 32, rating: 4.3 },
  { id: 5, name: "Hapag-Lloyd", region: "Global", reliability: 95, transit: 26, rating: 4.9 },
  { id: 6, name: "ONE", region: "Asia-Pacific", reliability: 92, transit: 28, rating: 4.6 },
  { id: 7, name: "Evergreen", region: "Asia-Pacific", reliability: 90, transit: 29, rating: 4.4 },
  { id: 8, name: "Yang Ming", region: "Asia-Pacific", reliability: 87, transit: 33, rating: 4.2 },
  { id: 9, name: "HMM", region: "Asia-Pacific", reliability: 88, transit: 31, rating: 4.3 },
  { id: 10, name: "ZIM", region: "Global", reliability: 86, transit: 34, rating: 4.1 },
];

// Trade lanes
const tradeLanes = [
  { route: "Asia - North America West", code: "TP-WB", avgRate: 2850, volatility: 0.25 },
  { route: "North America West - Asia", code: "TP-EB", avgRate: 1450, volatility: 0.18 },
  { route: "Asia - Europe", code: "FE-EU", avgRate: 2150, volatility: 0.22 },
  { route: "Europe - Asia", code: "EU-FE", avgRate: 1100, volatility: 0.15 },
  { route: "Asia - Mediterranean", code: "FE-MED", avgRate: 2350, volatility: 0.20 },
  { route: "North America East - Europe", code: "TA-WB", avgRate: 2650, volatility: 0.12 },
  { route: "Europe - North America East", code: "TA-EB", avgRate: 1850, volatility: 0.10 },
  { route: "Intra-Asia", code: "IA", avgRate: 650, volatility: 0.30 },
];

// Container types
const containerTypes = [
  { code: "20GP", name: "20' Standard", teu: 1, maxWeight: 28180 },
  { code: "40GP", name: "40' Standard", teu: 2, maxWeight: 26740 },
  { code: "40HC", name: "40' High Cube", teu: 2.25, maxWeight: 26630 },
  { code: "45HC", name: "45' High Cube", teu: 2.5, maxWeight: 25580 },
  { code: "20RF", name: "20' Refrigerated", teu: 1.5, maxWeight: 27390 },
  { code: "40RF", name: "40' Refrigerated", teu: 2.5, maxWeight: 25980 },
];

// Cargo types
const cargoTypes = [
  "General Cargo",
  "Reefer Cargo",
  "Dangerous Goods (IMDG)",
  "Out of Gauge (OOG)",
  "Heavy Lift",
  "Breakbulk",
  "Project Cargo",
  "Hazardous Materials",
];

// Evaluation criteria with weights
const evaluationCriteria = [
  { id: "price", name: "Price Competitiveness", weight: 35, description: "Total cost per container including all surcharges" },
  { id: "transit", name: "Transit Time", weight: 20, description: "Total days from origin to destination" },
  { id: "reliability", name: "Service Reliability", weight: 20, description: "On-time delivery and schedule reliability" },
  { id: "coverage", name: "Network Coverage", weight: 10, description: "Port coverage and service frequency" },
  { id: "terms", name: "Payment Terms", weight: 10, description: "Credit terms and payment flexibility" },
  { id: "sustainability", name: "Sustainability", weight: 5, description: "Environmental credentials and CII rating" },
];

const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  pink: "#EC4899",
};

interface RFQItem {
  id: string;
  containerType: string;
  quantity: number;
  cargoType: string;
  weight: number;
  volume: number;
}

interface CarrierBid {
  id: string;
  carrierId: number;
  carrierName: string;
  rfqItemId: string;
  baseRate: number;
  baf: number;
  caf: number;
  thcOrigin: number;
  thcDestination: number;
  docs: number;
  otherSurcharges: number;
  totalRate: number;
  transitTime: number;
  validity: number;
  freeTime: number;
  paymentTerms: string;
  notes: string;
  submittedAt: Date;
  status: "pending" | "accepted" | "rejected" | "negotiating";
}

interface NegotiationRound {
  round: number;
  carrierId: number;
  carrierName: string;
  initialOffer: number;
  counterOffer: number;
  finalOffer: number;
  savings: number;
  status: "pending" | "accepted" | "rejected";
}

interface BidAnalysis {
  carrierId: number;
  carrierName: string;
  totalCost: number;
  costPerTEU: number;
  transitDays: number;
  reliabilityScore: number;
  overallScore: number;
  rank: number;
  recommendation: "recommended" | "acceptable" | "not_recommended";
  strengths: string[];
  weaknesses: string[];
}

interface ContractAward {
  carrierId: number;
  carrierName: string;
  awardPercentage: number;
  volume: number;
  rate: number;
  totalValue: number;
  reasoning: string;
}

// Pro Tips Data
const proTips = [
  {
    icon: Target,
    title: "Define Clear Requirements",
    description: "Before issuing an RFQ, document your exact shipping requirements including cargo specifications, preferred transit times, and special handling needs. This clarity helps carriers provide accurate quotes.",
  },
  {
    icon: Users,
    title: "Diversify Your Carrier Base",
    description: "Don't rely on a single carrier. Maintain relationships with 3-5 reliable carriers to ensure capacity availability during peak seasons and leverage competitive pricing.",
  },
  {
    icon: Calendar,
    title: "Plan Around Peak Seasons",
    description: "Book shipments 4-6 weeks in advance during peak seasons (pre-Chinese New Year, pre-Christmas). Rates can increase 50-100% during these periods.",
  },
  {
    icon: Scale,
    title: "Benchmark Against Market Rates",
    description: "Use indices like Shanghai Containerized Freight Index (SCFI) to benchmark quoted rates. Understanding market trends gives you negotiating leverage.",
  },
  {
    icon: DollarSign,
    title: "Understand Total Landed Cost",
    description: "Compare quotes based on total cost including BAF, CAF, THC, documentation fees, and destination charges. A lower base rate may result in higher overall costs.",
  },
  {
    icon: Shield,
    title: "Verify Carrier Credentials",
    description: "Check carrier reliability ratings, CII scores for environmental compliance, and financial stability. A slightly higher rate from a reliable carrier often provides better value.",
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    title: "Focusing Only on Base Rate",
    description: "Many procurement managers focus solely on the base freight rate without considering surcharges. BAF, CAF, and THC can add 30-50% to your total shipping cost. Always compare total landed costs when evaluating bids.",
  },
  {
    title: "Ignoring Transit Time Impact",
    description: "Choosing the cheapest carrier with longer transit times can increase inventory carrying costs and delay time-sensitive shipments. Factor in the cost of capital tied up in transit and potential stockouts.",
  },
  {
    title: "Not Negotiating Rate Validity",
    description: "Accepting short validity periods (3 months or less) exposes you to rate volatility. Negotiate 12-24 month validity periods with carriers, especially in volatile markets, to lock in favorable rates.",
  },
  {
    title: "Overlooking Service Reliability",
    description: "A carrier with 85% reliability vs 95% might save you money upfront but cause supply chain disruptions. Calculate the true cost of delays including expedited shipping, production stoppages, and customer dissatisfaction.",
  },
  {
    title: "Single Sourcing Risk",
    description: "Awarding 100% volume to one carrier creates risk during capacity crunches, strikes, or service issues. Follow the 50-30-20 rule: primary carrier 50%, secondary 30%, tertiary 20%.",
  },
];

// Educational Content Data
const educationalContent = {
  understanding: {
    title: "Understanding Freight Procurement",
    content: `Freight procurement is the strategic process of sourcing, negotiating, and managing ocean freight services to optimize supply chain costs and reliability. Unlike spot market bookings, strategic freight procurement involves long-term contracts with carriers that provide rate stability, guaranteed capacity, and preferential service levels.

The procurement process typically follows a structured approach: defining shipping requirements, issuing Requests for Quotation (RFQs), evaluating carrier bids, negotiating rates and terms, and awarding contracts. Effective freight procurement balances cost optimization with service quality, considering factors beyond price such as transit times, reliability, network coverage, and sustainability credentials.

Modern freight procurement increasingly incorporates data analytics to benchmark rates against market indices, predict rate trends, and optimize carrier selection. Companies with mature procurement programs typically achieve 8-15% cost savings compared to ad-hoc booking approaches while improving supply chain reliability.`,
  },
  rfqPractices: {
    title: "RFQ Best Practices",
    content: `A well-structured Request for Quotation (RFQ) is the foundation of successful freight procurement. The RFQ should clearly communicate your shipping requirements, volume projections, and evaluation criteria to enable carriers to provide accurate and competitive bids.

Key elements of an effective RFQ include: detailed cargo specifications (weight, dimensions, commodity type), origin-destination pairs with specific ports, volume forecasts by container type, required transit times and service levels, contract validity period, and commercial terms including payment conditions and free time requirements.

Best practices for RFQ management include issuing RFQs 2-3 months before contract start dates to allow adequate response time, providing realistic volume estimates to build carrier confidence, clearly stating evaluation criteria weights, and maintaining transparent communication throughout the bidding process. Consider using standardized RFQ templates to ensure consistency and reduce processing time for both shippers and carriers.`,
  },
  vendorSelection: {
    title: "Vendor Selection Criteria",
    content: `Effective vendor selection in freight procurement requires a balanced scorecard approach that evaluates carriers across multiple dimensions. While price competitiveness remains important, leading procurement organizations weight multiple factors to optimize total cost of ownership.

The six key evaluation criteria include: Price Competitiveness (35% weight) - comparing total landed costs including all surcharges; Transit Time (20% weight) - evaluating schedule reliability and total journey duration; Service Reliability (20% weight) - assessing on-time delivery performance and cargo care; Network Coverage (10% weight) - considering port coverage and service frequency; Payment Terms (10% weight) - evaluating credit terms and payment flexibility; and Sustainability (5% weight) - reviewing environmental credentials including CII ratings.

Each criterion should be scored objectively using carrier-provided data, third-party reliability indices, and historical performance metrics. The weighted scoring methodology ensures consistent evaluation across all bidders and documents the rationale for contract award decisions.`,
  },
  contractNegotiation: {
    title: "Contract Negotiation Strategies",
    content: `Successful contract negotiation in freight procurement requires thorough preparation, market intelligence, and a collaborative approach with carriers. The goal is to achieve mutually beneficial terms that provide rate stability for shippers while ensuring reasonable margins for carriers.

Pre-negotiation preparation includes: benchmarking current rates against market indices like SCFI and FBX, analyzing historical shipment data to identify patterns and leverage points, understanding carrier-specific factors such as network positioning and capacity utilization, and identifying non-price terms that add value such as extended free time or priority loading.

Effective negotiation tactics include: leveraging competitive bids to drive better offers, offering volume commitments in exchange for rate concessions, negotiating rate adjustment mechanisms for fuel and currency fluctuations, securing performance guarantees with penalty clauses, and establishing regular business review processes to address issues proactively. Remember that long-term carrier relationships built on mutual trust often deliver better outcomes than aggressive one-time negotiations.`,
  },
};

// FAQ Data
const faqData = [
  {
    question: "What is the difference between spot rates and contract rates in freight procurement?",
    answer: `Spot rates and contract rates represent two fundamentally different approaches to freight pricing, each with distinct advantages and trade-offs. Spot rates are market-driven prices for immediate or near-term shipments, typically valid for 1-2 weeks. They fluctuate daily based on supply-demand dynamics, vessel capacity utilization, and seasonal factors. During capacity crunches, spot rates can spike dramatically - sometimes 200-300% above normal levels.

Contract rates, on the other hand, are negotiated prices locked in for an extended period (typically 6-24 months). They provide rate stability and guaranteed capacity but may not always reflect current market conditions. If spot rates fall below contract rates, shippers may pay a premium; conversely, during rate spikes, contracted shippers enjoy significant savings.

The optimal strategy typically involves a hybrid approach: securing 60-80% of projected volume under contract rates for stability and cost predictability, while keeping 20-40% flexible for spot market opportunities when rates are favorable. This approach balances risk management with cost optimization while maintaining relationships with contracted carriers.`,
  },
  {
    question: "How do BAF and CAF surcharges work and why are they important in procurement?",
    answer: `Bunker Adjustment Factor (BAF) and Currency Adjustment Factor (CAF) are variable surcharges that carriers apply to base freight rates to manage their exposure to fuel price volatility and currency fluctuations. Understanding these surcharges is critical for accurate cost comparison and budget planning in freight procurement.

BAF compensates carriers for fuel cost variations. After IMO 2020 regulations requiring low-sulfur fuel, BAF calculations became more complex, with carriers using different methodologies. Some use fixed quarterly rates, while others employ fuel price indexing with adjustment mechanisms. BAF can represent 10-25% of total freight cost depending on trade lane and vessel efficiency.

CAF addresses currency exchange risk. Since freight rates are typically quoted in USD, carriers operating in different currency zones face exposure when local currencies fluctuate against the dollar. CAF adjustments typically range from 0-15% and are updated monthly based on central bank rates.

During procurement, always request transparent BAF/CAF methodologies and consider negotiating fixed surcharge rates or caps. Some shippers prefer "all-in" rates that bundle surcharges, providing cost certainty but potentially at a premium.`,
  },
  {
    question: "What evaluation criteria should be prioritized when selecting freight carriers?",
    answer: `Carrier evaluation in freight procurement requires a balanced scorecard approach that goes beyond price to consider total value delivered. Based on industry best practices and procurement maturity models, the recommended weighting for evaluation criteria follows a structured framework.

Price Competitiveness (35% weight) remains the primary factor but should be evaluated on total landed cost, not base rate alone. Include all surcharges, origin/destination charges, and any hidden fees in the comparison. Consider the total cost impact including inventory carrying costs for longer transit options.

Service Reliability (20% weight) measures on-time performance, schedule integrity, and cargo care. A carrier with 95% reliability versus 85% can significantly reduce supply chain costs by minimizing delays, reducing safety stock requirements, and improving customer satisfaction. Use third-party reliability indices from organizations like SeaIntel or Drewry for objective data.

Transit Time (20% weight) affects inventory levels, cash flow, and responsiveness to demand changes. Evaluate both published transit times and actual performance, as some carriers publish optimistic schedules they cannot maintain. Consider the financial impact of transit time through inventory carrying costs and order cycle time.

Network Coverage (10% weight) evaluates port coverage, service frequency, and inland connectivity. A carrier with better network coverage provides flexibility for route optimization and contingency planning during disruptions.

Payment Terms (10% weight) considers credit periods and payment flexibility. Extended terms (Net 45-60) improve cash flow and reduce working capital requirements.

Sustainability (5% weight) addresses environmental credentials, CII ratings, and carbon footprint. This factor is increasingly important for companies with ESG commitments and may become a regulatory requirement.`,
  },
  {
    question: "How can I optimize contract validity periods in freight procurement?",
    answer: `Contract validity period optimization is a strategic decision that balances rate stability, market flexibility, and administrative overhead. The optimal duration depends on market conditions, volume profile, and risk tolerance.

Long-term contracts (18-24 months) provide maximum rate stability and are advantageous when rates are expected to rise. They also demonstrate commitment to carriers, improving service levels and capacity allocation during tight markets. However, they reduce flexibility to respond to market downturns and may lock in unfavorable rates if spot prices decline significantly.

Medium-term contracts (12 months) offer a balanced approach, aligning with annual budget cycles and typical procurement review periods. They provide sufficient time to build carrier relationships while maintaining annual renegotiation opportunities to capture market improvements.

Short-term contracts (3-6 months) maximize flexibility to respond to market changes but increase administrative burden and may result in higher rates due to reduced carrier commitment. They're appropriate for volatile markets or when expecting significant rate changes.

Best practices include: staggering contract expiry dates to avoid all contracts expiring simultaneously, building rate adjustment mechanisms for significant market movements, including volume flexibility clauses (typically ±20%), and negotiating renewal options that provide continuity without commitment.`,
  },
  {
    question: "What are the key clauses to include in freight service contracts?",
    answer: `A well-drafted freight service contract protects both shipper and carrier interests while establishing clear expectations for the business relationship. Beyond pricing, several critical clauses should be addressed in every freight contract.

Volume Commitment and Flexibility clauses specify minimum volume commitments (MQC) and the flexibility range for actual shipments. Standard practice allows ±20% variance, with penalties for underperformance and potential rate adjustments for overperformance. Clear definitions of volume measurement (TEU, FEU, or weight) prevent disputes.

Rate Structure and Adjustment Mechanisms define the pricing framework including base rates, surcharges, and adjustment triggers. Include specific BAF/CAF formulas or fixed surcharge rates, demurrage/detention terms, and any peak season surcharge provisions. Define the rate review process and circumstances warranting renegotiation.

Service Level Agreements (SLAs) specify transit times, booking cut-off periods, documentation requirements, and service reliability expectations. Include performance measurement methodology, reporting frequency, and consequences for service failures. Some contracts include service credits or penalty clauses for underperformance.

Free Time and Demurrage provisions specify standard free time for container use at origin and destination, demurrage rates for exceeding free time, and any guaranteed free time extensions. Negotiating generous free time (14-21 days) can significantly reduce landed costs.

Payment Terms specify credit periods, currency, payment methods, and dispute resolution procedures. Standard terms range from Net 15 to Net 45 depending on the trade relationship and shipper creditworthiness.

Force Majeure and Termination clauses address unforeseeable events preventing contract performance and conditions under which either party may terminate the agreement. Include notice periods and transition procedures for orderly contract conclusion.`,
  },
  {
    question: "How should I structure a carrier diversification strategy in freight procurement?",
    answer: `Carrier diversification is a fundamental risk management strategy in freight procurement, designed to ensure capacity availability, maintain competitive pricing, and protect against service disruptions. The optimal diversification strategy balances relationship depth with competitive tension.

The 50-30-20 rule provides a practical framework for carrier allocation: primary carrier receives 50% of volume, offering relationship depth and preferential service; secondary carrier receives 30%, providing meaningful competition and backup capacity; tertiary carrier receives 20%, ensuring market access and new capability development. This structure provides resilience while maintaining manageable procurement complexity.

Geographic diversification adds another dimension. Different carriers have regional strengths - some excel in Asia-Europe trade, others in Trans-Pacific routes. Matching carrier selection to route-specific performance optimizes service quality while spreading risk across multiple carriers.

When selecting carriers for your portfolio, consider complementary capabilities rather than direct substitutes. A portfolio might include: a premium global carrier for high-value/time-sensitive shipments, a cost-competitive carrier for standard cargo, and a niche carrier for specialized equipment or specific trade lanes.

Annual portfolio reviews should assess carrier performance against SLAs, rate competitiveness against market benchmarks, and strategic alignment with evolving business needs. Consider phasing in new carriers gradually, starting with 5-10% of volume before expanding the relationship.`,
  },
  {
    question: "What role does data analytics play in modern freight procurement?",
    answer: `Data analytics has transformed freight procurement from a relationship-driven process to a data-informed strategic function. Modern procurement teams leverage analytics for market intelligence, performance optimization, and predictive planning.

Market Intelligence analytics benchmark contracted rates against spot market indices (SCFI, FBX, WCI) to assess competitiveness and identify renegotiation opportunities. Historical rate analysis reveals seasonal patterns, enabling optimal timing for contract negotiations. Network analysis identifies route consolidation opportunities and modal alternatives.

Performance Analytics track carrier reliability, transit time consistency, and service quality metrics. Automated dashboards compare carrier performance against contracted SLAs, triggering service credits or escalation procedures. Trend analysis identifies degrading performance before it impacts supply chain operations.

Predictive Analytics forecast future rate movements based on economic indicators, vessel ordering patterns, and capacity utilization trends. Demand forecasting integrates sales data with shipment planning to optimize procurement timing and volume commitments. Scenario modeling evaluates cost implications of alternative routing or carrier selection decisions.

Procurement Automation streamlines RFQ processes, bid comparison, and contract management. Machine learning algorithms can suggest optimal carrier selection based on shipment characteristics and performance requirements. Natural language processing extracts key terms from carrier quotations for standardized comparison.

Implementation typically progresses through stages: descriptive analytics (what happened), diagnostic analytics (why it happened), predictive analytics (what will happen), and prescriptive analytics (what should we do). Most organizations achieve significant ROI at the predictive stage, with prescriptive capabilities representing advanced maturity.`,
  },
  {
    question: "How do I handle rate disputes and contract renegotiations with carriers?",
    answer: `Rate disputes and contract renegotiations are inevitable in freight procurement due to market volatility and changing business conditions. Effective handling requires preparation, documentation, and a collaborative approach that preserves relationships while protecting business interests.

Rate Dispute Resolution begins with clear contract language specifying the dispute process. Common dispute areas include surcharge calculations, currency adjustment applications, and peak season surcharge triggers. Maintain detailed records of all rate agreements, amendments, and communications to support your position. Engage carriers early when issues arise - most disputes are resolved through clarification rather than formal proceedings.

Contract Renegotiations may be triggered by significant market movements, volume changes, or service issues. Best practices include: monitoring market rates monthly against contracted rates to identify renegotiation opportunities; preparing supporting data including market indices, volume history, and competitive alternatives; approaching carriers collaboratively, recognizing that long-term relationships provide ongoing value; and being willing to compromise - rate reductions might be exchanged for volume commitments or extended contract terms.

Market Downturn Renegotiations: When spot rates fall significantly below contract rates (20%+ differential), negotiate temporary rate adjustments or contract amendments. Carriers may prefer reduced rates over losing the volume entirely. Consider offering longer commitment periods in exchange for immediate rate reductions.

Market Uptick Responses: During rate spikes, honor contract terms and use the opportunity to strengthen carrier relationships. Good-faith contract performance during challenging markets builds goodwill for future negotiations and ensures capacity allocation when supply is constrained.

If negotiations fail, formal dispute resolution typically follows escalation procedures: direct negotiation between procurement teams, commercial management involvement, and ultimately arbitration according to contract terms. Most disputes are resolved before formal proceedings.`,
  },
];

export default function FreightProcurementTool() {
  // RFQ States
  const [rfqName, setRfqName] = useState<string>("Annual Freight Procurement 2024");
  const [originPort, setOriginPort] = useState<string>("CNSHA");
  const [destinationPort, setDestinationPort] = useState<string>("USLAX");
  const [tradeLane, setTradeLane] = useState<string>("Asia - North America West");
  const [rfqDeadline, setRfqDeadline] = useState<string>("2024-02-28");
  const [validityPeriod, setValidityPeriod] = useState<string>("12");
  const [currency, setCurrency] = useState<string>("USD");
  const [rfqItems, setRfqItems] = useState<RFQItem[]>([
    { id: "1", containerType: "40HC", quantity: 100, cargoType: "General Cargo", weight: 20, volume: 67 },
    { id: "2", containerType: "20GP", quantity: 50, cargoType: "General Cargo", weight: 18, volume: 33 },
  ]);
  const [rfqNotes, setRfqNotes] = useState<string>("");
  const [rfqSubmitted, setRfqSubmitted] = useState<boolean>(false);

  // Bids States
  const [carrierBids, setCarrierBids] = useState<CarrierBid[]>([
    {
      id: "1",
      carrierId: 1,
      carrierName: "Maersk",
      rfqItemId: "1",
      baseRate: 2450,
      baf: 420,
      caf: 180,
      thcOrigin: 185,
      thcDestination: 225,
      docs: 75,
      otherSurcharges: 85,
      totalRate: 3620,
      transitTime: 28,
      validity: 12,
      freeTime: 14,
      paymentTerms: "Net 30",
      notes: "Premium service with priority loading",
      submittedAt: new Date("2024-02-15"),
      status: "pending",
    },
    {
      id: "2",
      carrierId: 2,
      carrierName: "MSC",
      rfqItemId: "1",
      baseRate: 2380,
      baf: 395,
      caf: 165,
      thcOrigin: 175,
      thcDestination: 215,
      docs: 65,
      otherSurcharges: 75,
      totalRate: 3470,
      transitTime: 30,
      validity: 12,
      freeTime: 10,
      paymentTerms: "Net 15",
      notes: "Competitive rate with standard service",
      submittedAt: new Date("2024-02-16"),
      status: "pending",
    },
    {
      id: "3",
      carrierId: 3,
      carrierName: "CMA CGM",
      rfqItemId: "1",
      baseRate: 2520,
      baf: 410,
      caf: 175,
      thcOrigin: 190,
      thcDestination: 230,
      docs: 70,
      otherSurcharges: 80,
      totalRate: 3675,
      transitTime: 27,
      validity: 12,
      freeTime: 12,
      paymentTerms: "Net 30",
      notes: "Fast transit time with excellent reliability",
      submittedAt: new Date("2024-02-14"),
      status: "pending",
    },
    {
      id: "4",
      carrierId: 5,
      carrierName: "Hapag-Lloyd",
      rfqItemId: "1",
      baseRate: 2580,
      baf: 435,
      caf: 190,
      thcOrigin: 195,
      thcDestination: 240,
      docs: 80,
      otherSurcharges: 85,
      totalRate: 3805,
      transitTime: 26,
      validity: 12,
      freeTime: 14,
      paymentTerms: "Net 45",
      notes: "Best transit time with premium service",
      submittedAt: new Date("2024-02-15"),
      status: "pending",
    },
    {
      id: "5",
      carrierId: 6,
      carrierName: "ONE",
      rfqItemId: "1",
      baseRate: 2490,
      baf: 405,
      caf: 170,
      thcOrigin: 180,
      thcDestination: 220,
      docs: 70,
      otherSurcharges: 78,
      totalRate: 3613,
      transitTime: 28,
      validity: 12,
      freeTime: 11,
      paymentTerms: "Net 30",
      notes: "Balanced offer with good value",
      submittedAt: new Date("2024-02-16"),
      status: "pending",
    },
  ]);

  // Negotiation States
  const [negotiationRounds, setNegotiationRounds] = useState<NegotiationRound[]>([]);
  const [selectedCarrierForNegotiation, setSelectedCarrierForNegotiation] = useState<number>(1);
  const [negotiationTarget, setNegotiationTarget] = useState<string>("3400");
  const [negotiationNotes, setNegotiationNotes] = useState<string>("");

  // Analysis & Award States
  const [bidAnalysis, setBidAnalysis] = useState<BidAnalysis[] | null>(null);
  const [contractAward, setContractAward] = useState<ContractAward[] | null>(null);
  const [activeTab, setActiveTab] = useState<string>("rfq");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Add RFQ Item
  const addRfqItem = () => {
    const newItem: RFQItem = {
      id: Date.now().toString(),
      containerType: "40HC",
      quantity: 50,
      cargoType: "General Cargo",
      weight: 20,
      volume: 67,
    };
    setRfqItems([...rfqItems, newItem]);
  };

  // Remove RFQ Item
  const removeRfqItem = (id: string) => {
    setRfqItems(rfqItems.filter(item => item.id !== id));
  };

  // Update RFQ Item
  const updateRfqItem = (id: string, field: keyof RFQItem, value: string | number) => {
    setRfqItems(rfqItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Submit RFQ
  const submitRfq = () => {
    setRfqSubmitted(true);
    setActiveTab("analysis");
  };

  // Start Negotiation
  const startNegotiation = (carrierId: number) => {
    const carrier = carriers.find(c => c.id === carrierId);
    const bid = carrierBids.find(b => b.carrierId === carrierId);
    if (carrier && bid) {
      const newRound: NegotiationRound = {
        round: negotiationRounds.filter(r => r.carrierId === carrierId).length + 1,
        carrierId,
        carrierName: carrier.name,
        initialOffer: bid.totalRate,
        counterOffer: bid.totalRate * 0.95,
        finalOffer: 0,
        savings: 0,
        status: "pending",
      };
      setNegotiationRounds([...negotiationRounds, newRound]);
    }
  };

  // Accept Negotiation Offer
  const acceptNegotiationOffer = (carrierId: number, round: number) => {
    setNegotiationRounds(negotiationRounds.map(r =>
      r.carrierId === carrierId && r.round === round
        ? { ...r, status: "accepted", finalOffer: r.counterOffer, savings: r.initialOffer - r.counterOffer }
        : r
    ));
    // Update the bid status
    setCarrierBids(carrierBids.map(b =>
      b.carrierId === carrierId ? { ...b, status: "accepted" } : b
    ));
  };

  // Analyze Bids
  const analyzeBids = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const analysis: BidAnalysis[] = carrierBids.map(bid => {
        const carrier = carriers.find(c => c.id === bid.carrierId)!;
        const lane = tradeLanes.find(t => t.route === tradeLane) || tradeLanes[0];

        // Calculate scores
        const priceScore = Math.max(0, 100 - ((bid.totalRate - lane.avgRate * 0.9) / (lane.avgRate * 0.3)) * 100);
        const transitScore = Math.max(0, 100 - (bid.transitTime - 25) * 2.5);
        const reliabilityScore = carrier.reliability;
        const coverageScore = carrier.region === "Global" ? 90 : 75;
        const termsScore = bid.paymentTerms === "Net 45" ? 95 : bid.paymentTerms === "Net 30" ? 80 : 60;
        const sustainabilityScore = 80 + Math.random() * 15;

        const overallScore =
          priceScore * (evaluationCriteria[0].weight / 100) +
          transitScore * (evaluationCriteria[1].weight / 100) +
          reliabilityScore * (evaluationCriteria[2].weight / 100) +
          coverageScore * (evaluationCriteria[3].weight / 100) +
          termsScore * (evaluationCriteria[4].weight / 100) +
          sustainabilityScore * (evaluationCriteria[5].weight / 100);

        const strengths: string[] = [];
        const weaknesses: string[] = [];

        if (priceScore > 70) strengths.push("Competitive pricing");
        else weaknesses.push("Above-market pricing");

        if (transitScore > 80) strengths.push("Fast transit time");
        else if (transitScore < 60) weaknesses.push("Long transit time");

        if (reliabilityScore > 92) strengths.push("Excellent reliability");
        else if (reliabilityScore < 88) weaknesses.push("Below-average reliability");

        if (bid.freeTime >= 14) strengths.push("Generous free time");
        if (bid.paymentTerms === "Net 45") strengths.push("Flexible payment terms");

        let recommendation: "recommended" | "acceptable" | "not_recommended";
        if (overallScore >= 80) recommendation = "recommended";
        else if (overallScore >= 65) recommendation = "acceptable";
        else recommendation = "not_recommended";

        return {
          carrierId: bid.carrierId,
          carrierName: bid.carrierName,
          totalCost: bid.totalRate,
          costPerTEU: bid.totalRate,
          transitDays: bid.transitTime,
          reliabilityScore,
          overallScore,
          rank: 0,
          recommendation,
          strengths,
          weaknesses,
        };
      });

      // Sort by overall score and assign ranks
      analysis.sort((a, b) => b.overallScore - a.overallScore);
      analysis.forEach((a, i) => a.rank = i + 1);

      setBidAnalysis(analysis);

      // Generate contract award recommendation
      const topCarriers = analysis.slice(0, 3);
      const totalVolume = rfqItems.reduce((sum, item) => sum + item.quantity, 0);

      const awards: ContractAward[] = topCarriers.map((carrier, index) => {
        const bid = carrierBids.find(b => b.carrierId === carrier.carrierId)!;
        const percentage = index === 0 ? 50 : index === 1 ? 30 : 20;
        const volume = Math.round(totalVolume * percentage / 100);

        return {
          carrierId: carrier.carrierId,
          carrierName: carrier.carrierName,
          awardPercentage: percentage,
          volume,
          rate: bid.totalRate,
          totalValue: volume * bid.totalRate,
          reasoning: index === 0
            ? "Best overall value with competitive pricing and reliable service"
            : index === 1
            ? "Strong backup option with good balance of cost and quality"
            : "Strategic diversification to ensure capacity availability",
        };
      });

      setContractAward(awards);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Reset function
  const handleReset = () => {
    setRfqName("Annual Freight Procurement 2024");
    setOriginPort("CNSHA");
    setDestinationPort("USLAX");
    setTradeLane("Asia - North America West");
    setRfqItems([
      { id: "1", containerType: "40HC", quantity: 100, cargoType: "General Cargo", weight: 20, volume: 67 },
      { id: "2", containerType: "20GP", quantity: 50, cargoType: "General Cargo", weight: 18, volume: 33 },
    ]);
    setRfqNotes("");
    setRfqSubmitted(false);
    setBidAnalysis(null);
    setContractAward(null);
    setNegotiationRounds([]);
    setActiveTab("rfq");
  };

  // Export function
  const handleExport = () => {
    const data = {
      rfq: {
        name: rfqName,
        origin: originPort,
        destination: destinationPort,
        tradeLane,
        items: rfqItems,
        deadline: rfqDeadline,
        validity: validityPeriod,
        currency,
      },
      bids: carrierBids,
      analysis: bidAnalysis,
      awards: contractAward,
      negotiations: negotiationRounds,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `freight-procurement-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share function
  const handleShare = async () => {
    const shareData = {
      title: "Freight Procurement Analysis",
      text: `RFQ: ${rfqName}\nRoute: ${originPort} → ${destinationPort}\nTotal Volume: ${rfqItems.reduce((sum, item) => sum + item.quantity, 0)} containers`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    }
  };

  // Chart data
  const bidComparisonData = useMemo(() => {
    return carrierBids.map(bid => ({
      name: bid.carrierName,
      "Base Rate": bid.baseRate,
      "BAF": bid.baf,
      "CAF": bid.caf,
      "THC": bid.thcOrigin + bid.thcDestination,
      "Other": bid.docs + bid.otherSurcharges,
      total: bid.totalRate,
    }));
  }, [carrierBids]);

  const radarData = useMemo(() => {
    if (!bidAnalysis) return [];
    return bidAnalysis.slice(0, 5).map(analysis => ({
      carrier: analysis.carrierName,
      price: Math.max(0, 100 - ((analysis.totalCost - 3000) / 10)),
      transit: Math.max(0, 100 - (analysis.transitDays - 25) * 3),
      reliability: analysis.reliabilityScore,
      score: analysis.overallScore,
    }));
  }, [bidAnalysis]);

  const awardData = useMemo(() => {
    if (!contractAward) return [];
    return contractAward.map(award => ({
      name: award.carrierName,
      volume: award.volume,
      value: award.totalValue,
      percentage: award.awardPercentage,
    }));
  }, [contractAward]);

  const costBreakdownData = useMemo(() => {
    if (!carrierBids.length) return [];
    const avgBid = carrierBids.reduce((acc, bid) => {
      acc.baseRate += bid.baseRate;
      acc.baf += bid.baf;
      acc.caf += bid.caf;
      acc.thc += bid.thcOrigin + bid.thcDestination;
      acc.other += bid.docs + bid.otherSurcharges;
      return acc;
    }, { baseRate: 0, baf: 0, caf: 0, thc: 0, other: 0 });

    const count = carrierBids.length;
    return [
      { name: "Base Rate", value: Math.round(avgBid.baseRate / count), color: COLORS.ocean },
      { name: "BAF", value: Math.round(avgBid.baf / count), color: COLORS.logistics },
      { name: "CAF", value: Math.round(avgBid.caf / count), color: COLORS.warning },
      { name: "THC", value: Math.round(avgBid.thc / count), color: COLORS.info },
      { name: "Other", value: Math.round(avgBid.other / count), color: COLORS.purple },
    ];
  }, [carrierBids]);

  const formatValue = (value: number, curr: string = currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "recommended": return COLORS.logistics;
      case "acceptable": return COLORS.warning;
      case "not_recommended": return COLORS.danger;
      default: return COLORS.info;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 overflow-hidden">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--ocean)] to-[var(--logistics)] flex items-center justify-center shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] bg-clip-text text-transparent">
                  Freight Procurement Tool
                </h1>
                <p className="text-muted-foreground mt-1">
                  Streamline your freight sourcing, vendor management, and contract negotiations
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {/* Animated Badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 px-4 py-2 text-sm">
                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                  Procurement
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20 px-4 py-2 text-sm">
                  <Ship className="h-3.5 w-3.5 mr-1.5" />
                  Freight Sourcing
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 px-4 py-2 text-sm">
                  <Users className="h-3.5 w-3.5 mr-1.5" />
                  Vendor Management
                </Badge>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Deadline: {rfqDeadline}</span>
            </div>
            <div className="flex items-center gap-2">
              <Container className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {rfqItems.reduce((sum, item) => sum + item.quantity, 0)} Containers
              </span>
            </div>
            <div className="flex-1" />
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={handleShare} size="sm" className="bg-[var(--logistics)] hover:bg-[var(--logistics)]/90">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs - 5 Column Grid */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="rfq" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            RFQ
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: RFQ - Request for Quotation Builder */}
        <TabsContent value="rfq" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <FileText className="h-5 w-5" />
                Request for Quotation (RFQ) Builder
              </CardTitle>
              <CardDescription>
                Create a new RFQ to solicit competitive bids from carriers
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* RFQ Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[var(--logistics)]" />
                    Route & Timeline
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>RFQ Name</Label>
                      <Input
                        value={rfqName}
                        onChange={(e) => setRfqName(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trade Lane</Label>
                      <Select value={tradeLane} onValueChange={setTradeLane}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tradeLanes.map((lane) => (
                            <SelectItem key={lane.route} value={lane.route}>
                              {lane.route}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Origin Port</Label>
                      <Input
                        value={originPort}
                        onChange={(e) => setOriginPort(e.target.value.toUpperCase())}
                        placeholder="CNSHA"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Destination Port</Label>
                      <Input
                        value={destinationPort}
                        onChange={(e) => setDestinationPort(e.target.value.toUpperCase())}
                        placeholder="USLAX"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bid Deadline</Label>
                      <Input
                        type="date"
                        value={rfqDeadline}
                        onChange={(e) => setRfqDeadline(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Validity Period</Label>
                      <Select value={validityPeriod} onValueChange={setValidityPeriod}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                    Commercial Terms
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 15).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.code} - {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Carriers</Label>
                      <Select>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select carriers..." />
                        </SelectTrigger>
                        <SelectContent>
                          {carriers.map((carrier) => (
                            <SelectItem key={carrier.id} value={carrier.id.toString()}>
                              {carrier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={rfqNotes}
                      onChange={(e) => setRfqNotes(e.target.value)}
                      placeholder="Special requirements, cargo specifications, etc."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* RFQ Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Container className="h-4 w-4 text-[var(--logistics)]" />
                    Container Requirements
                  </h3>
                  <Button onClick={addRfqItem} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800">
                      <tr>
                        <th className="text-left p-3 font-medium">Container Type</th>
                        <th className="text-left p-3 font-medium">Quantity</th>
                        <th className="text-left p-3 font-medium">Cargo Type</th>
                        <th className="text-left p-3 font-medium">Weight (t)</th>
                        <th className="text-left p-3 font-medium">Volume (m³)</th>
                        <th className="text-center p-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfqItems.map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">
                            <Select
                              value={item.containerType}
                              onValueChange={(v) => updateRfqItem(item.id, "containerType", v)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {containerTypes.map((ct) => (
                                  <SelectItem key={ct.code} value={ct.code}>
                                    {ct.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateRfqItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                              className="h-9 w-24"
                            />
                          </td>
                          <td className="p-3">
                            <Select
                              value={item.cargoType}
                              onValueChange={(v) => updateRfqItem(item.id, "cargoType", v)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {cargoTypes.map((ct) => (
                                  <SelectItem key={ct} value={ct}>
                                    {ct}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              value={item.weight}
                              onChange={(e) => updateRfqItem(item.id, "weight", parseFloat(e.target.value) || 0)}
                              className="h-9 w-20"
                            />
                          </td>
                          <td className="p-3">
                            <Input
                              type="number"
                              value={item.volume}
                              onChange={(e) => updateRfqItem(item.id, "volume", parseFloat(e.target.value) || 0)}
                              className="h-9 w-20"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRfqItem(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex gap-6">
                    <div>
                      <span className="text-sm text-muted-foreground">Total Containers</span>
                      <p className="text-xl font-bold text-[var(--ocean)]">
                        {rfqItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Weight</span>
                      <p className="text-xl font-bold text-[var(--logistics)]">
                        {rfqItems.reduce((sum, item) => sum + item.weight * item.quantity, 0).toLocaleString()} t
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Volume</span>
                      <p className="text-xl font-bold text-[var(--ocean)]">
                        {rfqItems.reduce((sum, item) => sum + item.volume * item.quantity, 0).toLocaleString()} m³
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => analyzeBids()}
                      disabled={isAnalyzing}
                      className="bg-[var(--logistics)] hover:bg-[var(--logistics)]/90"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analyze Bids
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={submitRfq}
                      className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Publish RFQ
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Analysis - Bid Analysis & Comparison */}
        <TabsContent value="analysis" className="space-y-6">
          {!bidAnalysis ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-12 pb-12 text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Analysis Available</h3>
                <p className="text-muted-foreground mb-6">
                  Click "Analyze Bids" on the RFQ tab to generate a comprehensive analysis
                </p>
                <Button onClick={() => setActiveTab("rfq")} variant="outline">
                  Go to RFQ
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Analysis Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean)]/80 text-white">
                  <CardContent className="pt-6">
                    <Award className="h-6 w-6 opacity-80 mb-2" />
                    <p className="text-2xl font-bold">{bidAnalysis[0]?.carrierName}</p>
                    <p className="text-sm opacity-80">Top Recommended Carrier</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[var(--logistics)] to-[var(--logistics)]/80 text-white">
                  <CardContent className="pt-6">
                    <DollarSign className="h-6 w-6 opacity-80 mb-2" />
                    <p className="text-2xl font-bold">{formatValue(bidAnalysis[0]?.totalCost || 0)}</p>
                    <p className="text-sm opacity-80">Best Rate per Container</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="pt-6">
                    <Clock className="h-6 w-6 opacity-80 mb-2" />
                    <p className="text-2xl font-bold">{bidAnalysis[0]?.transitDays || 0} days</p>
                    <p className="text-sm opacity-80">Best Transit Time</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                  <CardContent className="pt-6">
                    <Target className="h-6 w-6 opacity-80 mb-2" />
                    <p className="text-2xl font-bold">{bidAnalysis[0]?.overallScore.toFixed(1) || 0}</p>
                    <p className="text-sm opacity-80">Highest Score</p>
                  </CardContent>
                </Card>
              </div>

              {/* Bar Chart - Bid Comparison */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                    <BarChart3 className="h-5 w-5" />
                    Bid Comparison by Carrier
                  </CardTitle>
                  <CardDescription>Compare rate components across all carrier bids</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bidComparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" tickFormatter={(v) => formatValue(v)} />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(value: number) => formatValue(value)} />
                        <Legend />
                        <Bar dataKey="Base Rate" stackId="a" fill={COLORS.ocean} />
                        <Bar dataKey="BAF" stackId="a" fill={COLORS.logistics} />
                        <Bar dataKey="CAF" stackId="a" fill={COLORS.warning} />
                        <Bar dataKey="THC" stackId="a" fill={COLORS.info} />
                        <Bar dataKey="Other" stackId="a" fill={COLORS.purple} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Radar Chart - Vendor Scoring */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                    <Target className="h-5 w-5" />
                    Carrier Performance Comparison
                  </CardTitle>
                  <CardDescription>Multi-dimensional evaluation across key criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        { criteria: "Price", ...Object.fromEntries(radarData.map(r => [r.carrier, r.price])) },
                        { criteria: "Transit", ...Object.fromEntries(radarData.map(r => [r.carrier, r.transit])) },
                        { criteria: "Reliability", ...Object.fromEntries(radarData.map(r => [r.carrier, r.reliability])) },
                        { criteria: "Overall", ...Object.fromEntries(radarData.map(r => [r.carrier, r.score])) },
                      ]}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="criteria" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        {radarData.slice(0, 4).map((carrier, index) => (
                          <Radar
                            key={carrier.carrier}
                            name={carrier.carrier}
                            dataKey={carrier.carrier}
                            stroke={[COLORS.ocean, COLORS.logistics, COLORS.warning, COLORS.info][index]}
                            fill={[COLORS.ocean, COLORS.logistics, COLORS.warning, COLORS.info][index]}
                            fillOpacity={0.2}
                          />
                        ))}
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart - Cost Breakdown */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                    <PieChartIcon className="h-5 w-5" />
                    Average Cost Breakdown
                  </CardTitle>
                  <CardDescription>Distribution of freight cost components</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatValue(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Analysis Table */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                    <Scale className="h-5 w-5" />
                    Detailed Bid Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-slate-50 dark:bg-slate-800">
                          <th className="text-left p-3 font-medium">Rank</th>
                          <th className="text-left p-3 font-medium">Carrier</th>
                          <th className="text-left p-3 font-medium">Total Cost</th>
                          <th className="text-left p-3 font-medium">Transit</th>
                          <th className="text-left p-3 font-medium">Reliability</th>
                          <th className="text-left p-3 font-medium">Score</th>
                          <th className="text-left p-3 font-medium">Recommendation</th>
                          <th className="text-left p-3 font-medium">Strengths</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bidAnalysis.map((analysis) => (
                          <tr key={analysis.carrierId} className="border-b">
                            <td className="p-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                analysis.rank === 1 ? "bg-[var(--logistics)] text-white" :
                                analysis.rank === 2 ? "bg-[var(--ocean)] text-white" :
                                analysis.rank === 3 ? "bg-amber-500 text-white" :
                                "bg-slate-200 dark:bg-slate-700"
                              }`}>
                                {analysis.rank}
                              </div>
                            </td>
                            <td className="p-3 font-medium">{analysis.carrierName}</td>
                            <td className="p-3 font-bold">{formatValue(analysis.totalCost)}</td>
                            <td className="p-3">{analysis.transitDays} days</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <Progress value={analysis.reliabilityScore} className="w-16 h-2" />
                                <span>{analysis.reliabilityScore}%</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-[var(--ocean)]">{analysis.overallScore.toFixed(1)}</span>
                            </td>
                            <td className="p-3">
                              <Badge
                                style={{ backgroundColor: getRecommendationColor(analysis.recommendation) }}
                                className="text-white"
                              >
                                {analysis.recommendation.replace("_", " ")}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                {analysis.strengths.map((s, i) => (
                                  <Badge key={i} variant="outline" className="text-[var(--logistics)] border-[var(--logistics)]">
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Tab 3: Vendors - Vendor Comparison */}
        <TabsContent value="vendors" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Users className="h-5 w-5" />
                Vendor Comparison
              </CardTitle>
              <CardDescription>
                Compare and evaluate carrier bids from {carrierBids.length} vendors
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Vendor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {carrierBids.sort((a, b) => a.totalRate - b.totalRate).map((bid, index) => {
                  const carrier = carriers.find(c => c.id === bid.carrierId);
                  return (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`relative overflow-hidden ${
                        index === 0 ? "border-2 border-[var(--logistics)]" :
                        index === 1 ? "border-2 border-[var(--ocean)]" :
                        ""
                      }`}>
                        {index === 0 && (
                          <div className="absolute top-0 right-0 bg-[var(--logistics)] text-white text-xs px-2 py-1 rounded-bl">
                            Best Price
                          </div>
                        )}
                        {index === 1 && (
                          <div className="absolute top-0 right-0 bg-[var(--ocean)] text-white text-xs px-2 py-1 rounded-bl">
                            Runner Up
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{bid.carrierName}</CardTitle>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{carrier?.rating}</span>
                            </div>
                          </div>
                          <CardDescription>{carrier?.region} carrier</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Total Rate</span>
                              <span className="text-xl font-bold text-[var(--ocean)]">
                                {formatValue(bid.totalRate)}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Base:</span>
                                <span>{formatValue(bid.baseRate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">BAF:</span>
                                <span>{formatValue(bid.baf)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">THC:</span>
                                <span>{formatValue(bid.thcOrigin + bid.thcDestination)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Other:</span>
                                <span>{formatValue(bid.caf + bid.docs + bid.otherSurcharges)}</span>
                              </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Transit:</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {bid.transitTime} days
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Free Time:</span>
                                <span>{bid.freeTime} days</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setSelectedCarrierForNegotiation(bid.carrierId);
                                }}
                              >
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Negotiate
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria Reference */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Scale className="h-5 w-5" />
                Evaluation Criteria & Weights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {evaluationCriteria.map((criteria) => (
                  <div key={criteria.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                    <div className="text-3xl font-bold text-[var(--ocean)] mb-1">{criteria.weight}%</div>
                    <div className="text-sm font-medium">{criteria.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{criteria.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide - Educational Content */}
        <TabsContent value="guide" className="space-y-6">
          {/* Understanding Freight Procurement */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <BookOpen className="h-5 w-5" />
                {educationalContent.understanding.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {educationalContent.understanding.content}
              </p>
            </CardContent>
          </Card>

          {/* RFQ Best Practices */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                <FileText className="h-5 w-5" />
                {educationalContent.rfqPractices.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {educationalContent.rfqPractices.content}
              </p>
            </CardContent>
          </Card>

          {/* Vendor Selection Criteria */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Users className="h-5 w-5" />
                {educationalContent.vendorSelection.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {educationalContent.vendorSelection.content}
              </p>
            </CardContent>
          </Card>

          {/* Contract Negotiation */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
                <Scale className="h-5 w-5" />
                {educationalContent.contractNegotiation.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {educationalContent.contractNegotiation.content}
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                <Lightbulb className="h-5 w-5" />
                Pro Tips for Freight Procurement
              </CardTitle>
              <CardDescription>Actionable insights to optimize your procurement strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proTips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-background rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--logistics)]/10 flex items-center justify-center">
                        <tip.icon className="h-5 w-5 text-[var(--logistics)]" />
                      </div>
                      <h4 className="font-semibold">{tip.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from common procurement pitfalls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <div key={index} className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">{mistake.title}</h4>
                    <p className="text-sm text-muted-foreground">{mistake.description}</p>
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
                Comprehensive answers to common freight procurement questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqData.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-lg px-4 bg-slate-50/50 dark:bg-slate-800/50"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
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
  );
}
