'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Scale,
  AlertTriangle,
  DollarSign,
  Package,
  Ship,
  Info,
  RefreshCw,
  Shield,
  Gavel,
  Clock,
  Download,
  Share2,
  BarChart3,
  BookOpen,
  HelpCircle,
  Zap,
  TrendingUp,
  Target,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Landmark,
  Globe,
  Lightbulb,
  Plane,
  Truck,
  Train,
  FileCheck,
  AlertCircle,
  Award,
  Users,
  Sparkles,
  ChevronRight,
  ClipboardList,
  FileSearch,
  MessageSquareWarning,
  ClipboardCopy,
  Check,
  Briefcase,
  Building,
  FileWarning,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from 'recharts';

// Brand Colors
const OCEAN_BLUE = '#0F4C81';
const LOGISTICS_GREEN = '#2E8B57';

// Chart colors using brand palette
const COLORS = {
  ocean: OCEAN_BLUE,
  logistics: LOGISTICS_GREEN,
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  cyan: '#06B6D4',
};

interface ClaimResult {
  carrierLiabilityLimit: number;
  carrierLiabilityPerKg: number;
  actualClaimValue: number;
  claimPerKg: number;
  recoverableAmount: number;
  recoveryPercentage: number;
  shortfall: number;
  insuranceCoverage: number;
  insuranceRecovery: number;
  totalRecovery: number;
  unrecoveredLoss: number;
  liabilityRegime: string;
  recommendedAction: string;
  timeLimit: string;
  documentsRequired: string[];
  riskFactors: string[];
}

// Liability limits by convention
const liabilityRegimes = {
  'hague': { limitPerKg: 500, name: 'Hague Rules', timeLimit: '3 days', mode: 'Sea', year: 1924 },
  'hague-visby': { limitPerKg: 666.67, name: 'Hague-Visby Rules', timeLimit: '3 days', mode: 'Sea', year: 1968 },
  'hamburg': { limitPerKg: 835, name: 'Hamburg Rules', timeLimit: '15 days', mode: 'Sea', year: 1978 },
  'rotterdam': { limitPerKg: 875, name: 'Rotterdam Rules', timeLimit: '21 days', mode: 'Sea', year: 2008 },
  'montreal-air': { limitPerKg: 22, name: 'Montreal Convention (Air)', timeLimit: '21 days', mode: 'Air', year: 1999 },
  'cmr-road': { limitPerKg: 8.33, name: 'CMR Convention (Road)', timeLimit: '7 days', mode: 'Road', year: 1956 },
  'cim-rail': { limitPerKg: 17, name: 'CIM Convention (Rail)', timeLimit: '7 days', mode: 'Rail', year: 1980 },
};

const damageTypes = [
  { value: 'total-loss', label: 'Total Loss', icon: AlertCircle },
  { value: 'partial-loss', label: 'Partial Loss/Damage', icon: Package },
  { value: 'shortage', label: 'Shortage', icon: Scale },
  { value: 'water-damage', label: 'Water Damage', icon: Ship },
  { value: 'breakage', label: 'Breakage', icon: AlertTriangle },
  { value: 'theft', label: 'Theft/Pilferage', icon: Shield },
  { value: 'contamination', label: 'Contamination', icon: AlertTriangle },
  { value: 'temperature', label: 'Temperature Deviation', icon: AlertTriangle },
];

const FAQS = [
  {
    question: "What is carrier liability and how is it calculated?",
    answer: "Carrier liability refers to the legal responsibility of a transport carrier for loss or damage to cargo during transit. The liability is typically calculated based on the weight of the goods, using Special Drawing Rights (SDR) per kilogram as the standard unit. For example, under Hague-Visby Rules, the carrier's liability is limited to 666.67 SDR per kg (approximately $970 USD) or 2 SDR per package, whichever is higher. This means that for a 5,000 kg shipment, the maximum carrier liability would be around $4,850,000 regardless of the actual cargo value. Understanding these limits is crucial for proper insurance coverage. The calculation method varies by convention - some use weight only, while others allow the higher of weight or package limits. Cargo owners must be aware that carrier liability often falls short of actual cargo value, making insurance essential for full protection.",
    category: "Basics",
  },
  {
    question: "What is the difference between Hague, Hague-Visby, and Hamburg Rules?",
    answer: "These are international conventions governing carrier liability in sea transport, each representing different levels of protection for cargo owners. The Hague Rules (1924) established the original framework with lower liability limits and more carrier defenses available. The Hague-Visby Rules (1968) updated the limits and introduced the 'per package or per kg' calculation method, becoming the most widely adopted convention globally. The Hamburg Rules (1978) significantly increased carrier liability and reduced available defenses, making it more favorable to cargo owners, but has seen limited adoption. The Rotterdam Rules (2008) modernized the framework further with the highest liability limits and extended coverage to door-to-door transport. Which convention applies depends on the contract of carriage, the countries involved, and the bill of lading terms. Most major shipping routes operate under Hague-Visby Rules, providing a balance between carrier and cargo owner interests.",
    category: "Conventions",
  },
  {
    question: "When should I file a cargo claim with the carrier versus insurance?",
    answer: "Best practice is to file with both the carrier and your insurance company simultaneously, as they serve different purposes in the claims process. File with the carrier first within the applicable time limit (3-21 days depending on the convention) to preserve your legal rights under the contract of carriage. The carrier may accept liability up to their limit based on the applicable convention. If the carrier rejects the claim or their liability limit doesn't cover your full loss, your insurance should cover the difference minus any applicable deductible. Insurance claims typically have longer filing windows (30-90 days per policy terms). Failing to notify the carrier within the time limit may void both carrier and insurance claims, as many policies require you to preserve your rights against third parties. This dual-filing approach ensures maximum recovery while meeting all contractual obligations.",
    category: "Process",
  },
  {
    question: "What documents are required for a cargo claim?",
    answer: "A comprehensive cargo claim requires multiple supporting documents to establish liability and quantify damages. The essential documents include: (1) Original Bill of Lading or Air Waybill proving the contract of carriage; (2) Commercial Invoice showing the declared value of goods; (3) Packing List with detailed item specifications and quantities; (4) Survey Report documenting damage assessment by an independent surveyor; (5) Photographs of damage taken at delivery showing extent and nature of damage; (6) Carrier's Delivery Receipt with damage remarks noted at the time of delivery; (7) Insurance Certificate demonstrating coverage in force. Additional documents may include: Temperature logs for refrigerated cargo claims; Police reports for theft claims; Lab test results for contamination claims; Repair or replacement quotes; and Proof of ownership. All documents should be originals or certified copies. Missing documentation can significantly delay or reduce your claim recovery, so maintaining thorough records from the outset is critical.",
    category: "Documentation",
  },
  {
    question: "What are carrier defenses and how do they affect my claim?",
    answer: "Carriers can invoke various legal defenses to limit or deny liability for cargo damage or loss. Understanding these defenses helps you anticipate carrier responses and prepare counter-arguments. The main defenses include: (1) Act of God - natural disasters, extreme weather events beyond human control; (2) Act of War - armed conflict, terrorism, piracy; (3) Inherent Vice - natural deterioration of goods without external cause, such as perishable goods spoiling; (4) Shipper's Fault - improper packing, incorrect declaration, inadequate marking of hazardous materials; (5) Latent Defect - hidden defects in the vessel not discoverable through reasonable inspection; (6) Perils of the Sea - extraordinary maritime dangers beyond ordinary weather; (7) Saving Life - deviation to save life at sea; (8) Public Authorities - seizure, quarantine, inspection by government agencies. The burden of proof for these defenses generally falls on the carrier, but they can significantly impact your claim outcome. Proper documentation and expert survey reports help counter these defenses effectively.",
    category: "Legal",
  },
  {
    question: "How does cargo insurance differ from carrier liability?",
    answer: "Cargo insurance and carrier liability serve complementary but distinct purposes in protecting cargo interests. Carrier liability is the carrier's legal obligation under international conventions, limited to specific amounts per kg or per package. It often excludes certain perils and requires proof of carrier negligence for recovery. Carrier liability limits may be far below actual cargo value, particularly for high-value goods. In contrast, cargo insurance is a contract between you and an insurer covering all risks of loss or damage during transit. Insurance typically covers the full invoice value plus costs, with fewer exclusions than carrier liability limits. Insurance doesn't require proving carrier fault - it covers regardless of cause. Most importantly, insurance fills the gap between your actual loss and what the carrier is legally obligated to pay, protecting against both carrier defenses and liability limits. Insurance premiums are typically calculated as a percentage of cargo value, often 0.1% to 0.5% depending on risk factors. The small cost of insurance provides essential protection against potentially catastrophic losses.",
    category: "Insurance",
  },
  {
    question: "What are the time limits for filing cargo claims?",
    answer: "Time limits for cargo claims vary significantly by transport mode and applicable convention, making timely action essential. For written notice of damage: Sea transport under Hague/Hague-Visby Rules requires notice within 3 days; Hamburg Rules allows 15 days; Rotterdam Rules extends to 21 days; Air transport under Montreal Convention requires 21 days; Road transport under CMR Convention requires 7 days; Rail transport under CIM Convention also requires 7 days. These notice periods run from the date of delivery or when damage should have been discovered. For legal action (statute of limitations): Sea claims under Hague/Visby must be filed within 1 year; Hamburg Rules extends to 2 years; Air claims under Montreal allow 2 years; Road and Rail claims typically allow 1-2 years. Insurance claims usually require notice within 30 days and formal filing within the policy period. Missing these deadlines can completely bar your claim under both carrier liability and insurance policies. Always note damage on delivery documents immediately, send written notice promptly, and consult legal counsel for high-value claims.",
    category: "Deadlines",
  },
  {
    question: "Can I claim for consequential losses from cargo damage?",
    answer: "Generally, carrier liability does not extend to consequential losses such as lost profits, market price differences, production delays, or business interruption. Carrier liability under international conventions is typically limited to the physical loss or damage of the cargo itself, calculated at the invoice value or market value at destination. However, cargo insurance policies may offer coverage for consequential losses as an additional coverage option or under broader policy forms. Business interruption coverage, advance profit coverage, or contingent business interruption endorsements can protect against these secondary losses. Review your insurance policy carefully and consider adding consequential loss coverage for high-value or time-sensitive shipments. Some trade contracts may also allocate these risks differently through indemnity clauses or liquidated damages provisions. For time-critical shipments, consider including delay insurance provisions in your cargo policy. The relatively small additional premium for extended coverage can provide significant protection against the full range of potential losses from a cargo incident.",
    category: "Coverage",
  },
];

const PRO_TIPS = [
  {
    title: "Document Everything Immediately",
    description: "Take photos at delivery, note damage on receipts, and notify all parties in writing within 24 hours to preserve your rights and strengthen your claim position.",
    icon: FileText,
    color: OCEAN_BLUE,
  },
  {
    title: "Know Your Convention",
    description: "Identify which liability convention applies by checking your Bill of Lading terms and the transport route countries involved. This determines your recovery limits.",
    icon: Gavel,
    color: LOGISTICS_GREEN,
  },
  {
    title: "Insurance is Essential",
    description: "Carrier liability rarely covers full cargo value. Always insure at 110% of CIF value to cover all potential losses including freight and duty costs.",
    icon: Shield,
    color: COLORS.warning,
  },
  {
    title: "Survey Early",
    description: "Commission an independent survey within 3 days of discovery. Carrier-appointed surveyors may favor the carrier's interests in their assessment.",
    icon: Target,
    color: COLORS.purple,
  },
  {
    title: "Calculate Accurately",
    description: "Document your claim value with invoices, replacement costs, and depreciation calculations to justify your demand and support negotiation.",
    icon: Calculator,
    color: COLORS.cyan,
  },
  {
    title: "Preserve Evidence Chain",
    description: "Maintain all original documents, packaging samples, and damaged goods until the claim is fully resolved. Evidence preservation is critical for dispute resolution.",
    icon: FileSearch,
    color: OCEAN_BLUE,
  },
];

const COMMON_MISTAKES = [
  {
    title: "Missing Notification Deadlines",
    description: "Failing to provide written notice within the required time period (3-21 days) is the most common reason claims are denied. Always notify the carrier in writing immediately upon discovering damage, even before quantifying the full extent of loss. Many carriers reject claims solely on timing grounds regardless of the merits.",
    icon: Clock,
    color: COLORS.danger,
  },
  {
    title: "Insufficient Insurance Coverage",
    description: "Many shippers underinsure cargo by not including freight costs, duties, and expected profit margin in the insured value. Others rely entirely on carrier liability without understanding its limits. Always insure at 110% of CIF value and review policy exclusions carefully before shipment.",
    icon: Shield,
    color: COLORS.warning,
  },
  {
    title: "Signing Clean Delivery Receipts",
    description: "Signing for cargo 'in good condition' without inspection forfeits your right to claim visible damage. Always inspect cargo before signing, note all damage on the delivery receipt with specific details, and retain a signed copy. Even vague notations like 'received damaged' are better than a clean receipt.",
    icon: FileCheck,
    color: COLORS.danger,
  },
  {
    title: "Inadequate Documentation",
    description: "Insufficient documentation is a leading cause of reduced claim recoveries. Missing survey reports, incomplete photos, lack of commercial invoices, or failure to note damage on delivery receipts all weaken your position. Gather comprehensive documentation immediately upon discovery of any damage.",
    icon: ClipboardList,
    color: COLORS.warning,
  },
  {
    title: "Delaying Insurance Notification",
    description: "Many cargo insurance policies have strict notification requirements that can void coverage if missed. Notify your insurer immediately upon any incident, even before quantifying the loss. Late notification can give insurers grounds to deny otherwise valid claims, regardless of the actual loss.",
    icon: AlertCircle,
    color: COLORS.danger,
  },
];

// Claims Process Steps
const CLAIMS_PROCESS_STEPS = [
  {
    step: 1,
    title: "Immediate Inspection",
    description: "Inspect cargo thoroughly upon delivery before signing any documents. Note all visible damage on the delivery receipt with specific details about extent, location, and nature of damage. Take comprehensive photographs from multiple angles.",
    timeline: "At delivery",
    critical: true,
    icon: FileSearch,
  },
  {
    step: 2,
    title: "Written Notification",
    description: "Send written notice to the carrier within the applicable time limit (3-21 days depending on convention). Include shipment details, damage description, and reserve rights to claim. Even if damage extent is unknown, notify immediately.",
    timeline: "Within 3-21 days",
    critical: true,
    icon: MessageSquareWarning,
  },
  {
    step: 3,
    title: "Survey & Documentation",
    description: "Commission an independent surveyor for high-value claims. Gather all supporting documents: commercial invoice, packing list, bill of lading, photos, delivery receipt with damage notation. Organize evidence systematically.",
    timeline: "Within 3-7 days",
    critical: true,
    icon: ClipboardList,
  },
  {
    step: 4,
    title: "Insurance Notification",
    description: "Notify your cargo insurer promptly per policy requirements, typically within 30 days. Provide preliminary loss information and documentation. Request claim form and assigned adjuster contact. Cooperate fully with investigation.",
    timeline: "Within 30 days",
    critical: false,
    icon: Shield,
  },
  {
    step: 5,
    title: "Submit Formal Claim",
    description: "Prepare and submit formal claim to carrier with all supporting documentation. Quantify loss with invoices, replacement quotes, or repair estimates. State demand amount clearly and reference applicable liability convention.",
    timeline: "Within 30-60 days",
    critical: false,
    icon: FileText,
  },
  {
    step: 6,
    title: "Negotiate & Settle",
    description: "Engage with carrier's claims department. Be prepared to negotiate and provide additional documentation. Consider partial settlements for undisputed amounts. Document all communications. Escalate to legal action if necessary within limitation period.",
    timeline: "1-12 months",
    critical: false,
    icon: Gavel,
  },
];

// Transport mode icons
const transportIcons = {
  sea: Ship,
  air: Plane,
  road: Truck,
  rail: Train,
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CargoClaimCalculator() {
  const [transportMode, setTransportMode] = useState<'sea' | 'air' | 'road' | 'rail'>('sea');
  const [liabilityRegime, setLiabilityRegime] = useState('hague-visby');
  const [damageType, setDamageType] = useState('partial-loss');
  const [cargoValue, setCargoValue] = useState('50000');
  const [damagedValue, setDamagedValue] = useState('15000');
  const [grossWeight, setGrossWeight] = useState('5000');
  const [currency, setCurrency] = useState('USD');
  const [insuranceCoverage, setInsuranceCoverage] = useState('110');
  const [insuredValue, setInsuredValue] = useState('55000');
  const [deductible, setDeductible] = useState('500');
  const [result, setResult] = useState<ClaimResult | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const calculateClaim = () => {
    const cargoValueNum = parseFloat(cargoValue) || 0;
    const damagedValueNum = parseFloat(damagedValue) || 0;
    const weight = parseFloat(grossWeight) || 0;
    const insurancePercent = parseFloat(insuranceCoverage) || 110;
    const insuredAmount = parseFloat(insuredValue) || cargoValueNum * (insurancePercent / 100);
    const deductibleAmount = parseFloat(deductible) || 0;

    const regime = liabilityRegimes[liabilityRegime as keyof typeof liabilityRegimes];
    const liabilityLimit = regime.limitPerKg * weight;

    const claimPerKg = damagedValueNum / weight;
    let recoverableAmount = Math.min(damagedValueNum, liabilityLimit);

    const isCarrierLiable = damageType !== 'temperature' && damageType !== 'contamination';
    if (!isCarrierLiable) {
      recoverableAmount = 0;
    }

    const recoveryPercentage = damagedValueNum > 0 ? (recoverableAmount / damagedValueNum) * 100 : 0;
    const shortfall = damagedValueNum - recoverableAmount;

    const insuranceRecovery = damageType === 'total-loss'
      ? Math.min(insuredAmount, damagedValueNum) - deductibleAmount
      : Math.min(insuredAmount, damagedValueNum) * 0.95 - deductibleAmount;

    const totalRecovery = Math.max(0, recoverableAmount) + Math.max(0, insuranceRecovery);
    const unrecoveredLoss = damagedValueNum - totalRecovery;

    const documentsRequired = [
      'Commercial Invoice',
      'Packing List',
      'Bill of Lading / Air Waybill',
      'Survey Report / Damage Assessment',
      'Photos of Damage',
      "Carrier's Delivery Receipt (with remarks)",
      'Insurance Certificate',
    ];

    if (damageType === 'temperature') {
      documentsRequired.push('Temperature Log / Data Logger Report');
    }
    if (damageType === 'theft') {
      documentsRequired.push('Police Report');
    }

    const riskFactors: string[] = [];
    if (claimPerKg > regime.limitPerKg * 0.8) {
      riskFactors.push('Claim value per kg approaches liability limit');
    }
    if (shortfall > damagedValueNum * 0.5) {
      riskFactors.push('Significant shortfall between loss and carrier liability');
    }
    if (insurancePercent < 100) {
      riskFactors.push('Insurance coverage below invoice value');
    }
    if (damageType === 'temperature') {
      riskFactors.push('Temperature claims often excluded from carrier liability');
    }
    if (weight < 100) {
      riskFactors.push('Small shipment - carrier may dispute liability basis');
    }

    let recommendedAction = '';
    if (unrecoveredLoss > 0) {
      recommendedAction = 'File claim with both carrier and insurance. Document all losses thoroughly.';
    } else if (recoverableAmount >= damagedValueNum) {
      recommendedAction = 'Carrier liability sufficient. File claim directly with carrier.';
    } else {
      recommendedAction = 'File with carrier first, then claim shortfall from insurance.';
    }

    if (damagedValueNum > 25000) {
      recommendedAction += ' Consider legal counsel for high-value claims.';
    }

    setResult({
      carrierLiabilityLimit: Math.round(liabilityLimit * 100) / 100,
      carrierLiabilityPerKg: regime.limitPerKg,
      actualClaimValue: damagedValueNum,
      claimPerKg: Math.round(claimPerKg * 100) / 100,
      recoverableAmount: Math.round(recoverableAmount * 100) / 100,
      recoveryPercentage: Math.round(recoveryPercentage * 10) / 10,
      shortfall: Math.round(shortfall * 100) / 100,
      insuranceCoverage: insuredAmount,
      insuranceRecovery: Math.round(Math.max(0, insuranceRecovery) * 100) / 100,
      totalRecovery: Math.round(Math.max(0, totalRecovery) * 100) / 100,
      unrecoveredLoss: Math.round(Math.max(0, unrecoveredLoss) * 100) / 100,
      liabilityRegime: regime.name,
      recommendedAction,
      timeLimit: regime.timeLimit,
      documentsRequired,
      riskFactors,
    });
  };

  const resetForm = () => {
    setCargoValue('50000');
    setDamagedValue('15000');
    setGrossWeight('5000');
    setInsuranceCoverage('110');
    setInsuredValue('55000');
    setDeductible('500');
    setResult(null);
    toast({
      title: "Form Reset",
      description: "All fields have been reset to default values.",
    });
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;

  const exportResults = () => {
    if (!result) {
      toast({
        title: "No Results",
        description: "Please calculate a claim first before exporting.",
        variant: "destructive",
      });
      return;
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      inputs: {
        transportMode,
        liabilityRegime,
        damageType,
        cargoValue: parseFloat(cargoValue),
        damagedValue: parseFloat(damagedValue),
        grossWeight: parseFloat(grossWeight),
        currency,
        insuranceCoverage: parseFloat(insuranceCoverage),
        insuredValue: parseFloat(insuredValue),
        deductible: parseFloat(deductible),
      },
      results: result,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cargo-claim-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Claim calculation has been downloaded as JSON.",
    });
  };

  const shareResults = async () => {
    if (!result) {
      toast({
        title: "No Results",
        description: "Please calculate a claim first before sharing.",
        variant: "destructive",
      });
      return;
    }

    const shareText = `Cargo Claim Calculation
━━━━━━━━━━━━━━━━━━━━━
Claim Value: ${currencySymbol}${result.actualClaimValue.toLocaleString()}
Total Recovery: ${currencySymbol}${result.totalRecovery.toLocaleString()}
Recovery Rate: ${((result.totalRecovery / result.actualClaimValue) * 100).toFixed(1)}%
Liability Regime: ${result.liabilityRegime}

Carrier Recovery: ${currencySymbol}${result.recoverableAmount.toLocaleString()}
Insurance Recovery: ${currencySymbol}${result.insuranceRecovery.toLocaleString()}
Unrecovered Loss: ${currencySymbol}${result.unrecoveredLoss.toLocaleString()}

Calculated using Shiportrade Cargo Claim Calculator`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "Claim summary has been copied and ready to share.",
      });
    } else {
      toast({
        title: "Share Failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Chart data for visualization
  const recoveryData = result ? [
    { name: 'Carrier Recovery', value: result.recoverableAmount, fill: COLORS.ocean },
    { name: 'Insurance Recovery', value: result.insuranceRecovery, fill: COLORS.logistics },
    { name: 'Unrecovered', value: result.unrecoveredLoss, fill: COLORS.danger },
  ].filter(d => d.value > 0) : [];

  const claimBreakdownData = result ? [
    { name: 'Total Claim', value: result.actualClaimValue, fill: COLORS.ocean },
    { name: 'Carrier Limit', value: result.carrierLiabilityLimit, fill: COLORS.logistics },
    { name: 'Recovered', value: result.totalRecovery, fill: COLORS.purple },
  ] : [];

  const liabilityComparisonData = Object.entries(liabilityRegimes).map(([, regime]) => ({
    name: regime.name.split(' ')[0],
    limit: regime.limitPerKg,
    year: regime.year,
    mode: regime.mode,
  }));

  const recoveryProgressData = result ? [
    {
      name: 'Recovery',
      value: (result.totalRecovery / result.actualClaimValue) * 100,
      fill: result.totalRecovery / result.actualClaimValue >= 0.8 ? COLORS.logistics : 
            result.totalRecovery / result.actualClaimValue >= 0.6 ? COLORS.warning : COLORS.danger,
    },
  ] : [];

  // Claim timeline data
  const claimTimelineData = result ? [
    { stage: 'Discovery', days: 0, cumulative: 0 },
    { stage: 'Notice', days: parseInt(result.timeLimit) || 3, cumulative: parseInt(result.timeLimit) || 3 },
    { stage: 'Survey', days: 7, cumulative: (parseInt(result.timeLimit) || 3) + 7 },
    { stage: 'Insurance Notice', days: 23, cumulative: 30 },
    { stage: 'Claim Submission', days: 30, cumulative: 60 },
    { stage: 'Settlement', days: 90, cumulative: 150 },
  ] : [];

  // Historical trend data (simulated)
  const trendData = [
    { year: '2019', claims: 1250, avgRecovery: 72 },
    { year: '2020', claims: 980, avgRecovery: 68 },
    { year: '2021', claims: 1420, avgRecovery: 75 },
    { year: '2022', claims: 1680, avgRecovery: 78 },
    { year: '2023', claims: 1890, avgRecovery: 81 },
    { year: '2024', claims: 1650, avgRecovery: 83 },
  ];

  const getEfficiencyColor = (percentage: number) => {
    if (percentage >= 80) return COLORS.logistics;
    if (percentage >= 60) return COLORS.warning;
    return COLORS.danger;
  };

  const TransportIcon = transportIcons[transportMode];

  return (
    <div className="space-y-6">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 border border-border/50">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(15,76,129,0.03)_25%,rgba(15,76,129,0.03)_50%,transparent_50%,transparent_75%,rgba(46,139,87,0.03)_75%)] bg-[length:60px_60px]" />
        
        {/* Animated shapes */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-[var(--ocean)]/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--logistics)]/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        
        {/* Floating icons */}
        <motion.div
          className="absolute top-8 right-12 text-[var(--ocean)]/10"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Ship className="w-24 h-24" />
        </motion.div>
        <motion.div
          className="absolute bottom-8 right-32 text-[var(--logistics)]/10"
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        >
          <Package className="w-16 h-16" />
        </motion.div>
        <motion.div
          className="absolute top-16 left-1/4 text-[var(--ocean)]/10"
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        >
          <Globe className="w-20 h-20" />
        </motion.div>
        
        {/* Content */}
        <div className="relative px-6 py-8 lg:px-10 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="space-y-4 max-w-2xl">
              {/* Animated Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 hover:bg-[var(--ocean)]/20 backdrop-blur-sm transition-all">
                    <Briefcase className="h-3 w-3 mr-1" />
                    Claims Management
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20 hover:bg-[var(--logistics)]/20 backdrop-blur-sm transition-all">
                    <Shield className="h-3 w-3 mr-1" />
                    Cargo Insurance
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 backdrop-blur-sm transition-all">
                    <Target className="h-3 w-3 mr-1" />
                    Loss Assessment
                  </Badge>
                </motion.div>
              </div>

              {/* Title */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 text-foreground">
                  Cargo Claim Calculator
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Calculate carrier liability, insurance recovery, and total claim value for damaged cargo. 
                  Understand your rights under international conventions and optimize your claim strategy.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Users className="h-4 w-4" />
                  <span>Trusted by 15,000+ users</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Award className="h-4 w-4" />
                  <span>Industry-standard formulas</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Globe className="h-4 w-4" />
                  <span>7 international conventions</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetForm}
                className="bg-background/50 backdrop-blur-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportResults}
                className="bg-background/50 backdrop-blur-sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={shareResults}
                className="bg-background/50 backdrop-blur-sm"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Share'}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Tabs - 5 columns */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl bg-muted/50">
          <TabsTrigger 
            value="calculator" 
            className="flex items-center gap-2 data-[state=active]:bg-[var(--ocean)] data-[state=active]:text-white"
          >
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="flex items-center gap-2 data-[state=active]:bg-[var(--ocean)] data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger 
            value="process" 
            className="flex items-center gap-2 data-[state=active]:bg-[var(--logistics)] data-[state=active]:text-white"
          >
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">Process</span>
          </TabsTrigger>
          <TabsTrigger 
            value="guide" 
            className="flex items-center gap-2 data-[state=active]:bg-[var(--logistics)] data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger 
            value="faq" 
            className="flex items-center gap-2 data-[state=active]:bg-[var(--ocean)] data-[state=active]:text-white"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="border-l-4 border-l-[var(--ocean)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TransportIcon className="h-5 w-5 text-[var(--ocean)]" />
                      Transport & Liability Regime
                    </CardTitle>
                    <CardDescription>
                      Select transport mode and applicable liability convention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Transport Mode</Label>
                        <Select value={transportMode} onValueChange={(v: 'sea' | 'air' | 'road' | 'rail') => {
                          setTransportMode(v);
                          if (v === 'air') setLiabilityRegime('montreal-air');
                          else if (v === 'road') setLiabilityRegime('cmr-road');
                          else if (v === 'rail') setLiabilityRegime('cim-rail');
                          else setLiabilityRegime('hague-visby');
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sea">
                              <div className="flex items-center gap-2">
                                <Ship className="h-4 w-4" />
                                Ocean Freight
                              </div>
                            </SelectItem>
                            <SelectItem value="air">
                              <div className="flex items-center gap-2">
                                <Plane className="h-4 w-4" />
                                Air Freight
                              </div>
                            </SelectItem>
                            <SelectItem value="road">
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                Road Transport
                              </div>
                            </SelectItem>
                            <SelectItem value="rail">
                              <div className="flex items-center gap-2">
                                <Train className="h-4 w-4" />
                                Rail Transport
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Liability Regime</Label>
                        <Select value={liabilityRegime} onValueChange={setLiabilityRegime}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(liabilityRegimes).map(([key, regime]) => (
                              <SelectItem key={key} value={key}>
                                {regime.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Type of Damage/Loss</Label>
                      <Select value={damageType} onValueChange={setDamageType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {damageTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5 rounded-lg border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center">
                          <Info className="h-5 w-5 text-[var(--ocean)]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {liabilityRegimes[liabilityRegime as keyof typeof liabilityRegimes].name}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            SDR {liabilityRegimes[liabilityRegime as keyof typeof liabilityRegimes].limitPerKg}/kg liability limit
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-l-4 border-l-[var(--logistics)]">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                      Cargo Values
                    </CardTitle>
                    <CardDescription>
                      Enter shipment and damage details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Gross Weight (kg)</Label>
                        <Input
                          type="number"
                          value={grossWeight}
                          onChange={(e) => setGrossWeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Total Cargo Value</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                          <Input
                            type="number"
                            value={cargoValue}
                            onChange={(e) => setCargoValue(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Damage/Loss Value</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                          <Input
                            type="number"
                            value={damagedValue}
                            onChange={(e) => setDamagedValue(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-l-4 border-l-amber-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-amber-500" />
                      Insurance Coverage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Coverage %</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={insuranceCoverage}
                            onChange={(e) => setInsuranceCoverage(e.target.value)}
                            className="pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Insured Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                          <Input
                            type="number"
                            value={insuredValue}
                            onChange={(e) => setInsuredValue(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Deductible</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currencySymbol}</span>
                        <Input
                          type="number"
                          value={deductible}
                          onChange={(e) => setDeductible(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={calculateClaim}
                      className="w-full bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] hover:opacity-90 text-white h-11"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Claim
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className={`border-2 ${result ? (result.unrecoveredLoss > 0 ? 'border-red-200 dark:border-red-800' : 'border-[var(--logistics)]/30') : 'border-[var(--ocean)]/20'}`}>
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[var(--ocean)]" />
                    Claim Analysis
                  </CardTitle>
                  <CardDescription>
                    Liability assessment and recovery calculation
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <AnimatePresence mode="wait">
                    {result ? (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        {/* Claim Summary */}
                        <div className="bg-gradient-to-br from-[var(--ocean)] to-[var(--logistics)] rounded-xl p-6 text-white">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="text-sm opacity-90 mb-1">Claim Value</p>
                              <motion.p
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                className="text-2xl font-bold"
                              >
                                {currencySymbol}{result.actualClaimValue.toLocaleString()}
                              </motion.p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm opacity-90 mb-1">Total Recovery</p>
                              <motion.p
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                className="text-2xl font-bold"
                              >
                                {currencySymbol}{result.totalRecovery.toLocaleString()}
                              </motion.p>
                            </div>
                          </div>
                        </div>

                        {/* Recovery Progress */}
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2 text-sm">
                              <span className="flex items-center gap-2">
                                <Gavel className="h-4 w-4 text-[var(--ocean)]" />
                                Carrier Recovery
                              </span>
                              <span className="font-medium">{result.recoveryPercentage}%</span>
                            </div>
                            <Progress value={result.recoveryPercentage} className="h-3" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>{currencySymbol}{result.recoverableAmount.toLocaleString()}</span>
                              <span>Limit: {currencySymbol}{result.carrierLiabilityLimit.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Carrier Liability */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-[var(--ocean)]" />
                            Carrier Liability ({result.liabilityRegime})
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Liability Limit</p>
                              <p className="text-lg font-bold text-[var(--ocean)]">{currencySymbol}{result.carrierLiabilityLimit.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">({currencySymbol}{result.carrierLiabilityPerKg}/kg × {grossWeight}kg)</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Recoverable from Carrier</p>
                              <p className="text-lg font-bold text-[var(--logistics)]">{currencySymbol}{result.recoverableAmount.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">({result.recoveryPercentage}% recovery)</p>
                            </div>
                          </div>
                        </div>

                        {/* Insurance Recovery */}
                        <div className="space-y-3">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Shield className="h-4 w-4 text-[var(--logistics)]" />
                            Insurance Recovery
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Insurance Coverage</p>
                              <p className="text-lg font-bold text-purple-600">{currencySymbol}{result.insuranceCoverage.toLocaleString()}</p>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
                              <p className="text-xs text-muted-foreground">Insurance Recovery</p>
                              <p className="text-lg font-bold text-amber-600">{currencySymbol}{result.insuranceRecovery.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Unrecovered Loss */}
                        {result.unrecoveredLoss > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-200 dark:border-red-800"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                              <p className="font-semibold text-red-700 dark:text-red-400">Unrecovered Loss</p>
                            </div>
                            <p className="text-2xl font-bold text-red-600">{currencySymbol}{result.unrecoveredLoss.toLocaleString()}</p>
                          </motion.div>
                        )}

                        {/* Time Limit */}
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Clock className="h-5 w-5 text-amber-600" />
                          <div>
                            <p className="font-medium">Notice Time Limit: {result.timeLimit}</p>
                            <p className="text-sm text-muted-foreground">From date of delivery or when damage discovered</p>
                          </div>
                        </div>

                        {/* Documents Required */}
                        <div className="space-y-3">
                          <h4 className="font-semibold">Documents Required</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.documentsRequired.map((doc, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{doc}</Badge>
                            ))}
                          </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
                          <div className="flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-[var(--ocean)]" />
                            <p className="font-semibold text-[var(--ocean)]">Recommended Action</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.recommendedAction}</p>
                        </div>

                        {/* Risk Factors */}
                        {result.riskFactors.length > 0 && (
                          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-100 dark:border-amber-900">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-amber-600" />
                              <p className="font-semibold text-amber-700 dark:text-amber-400">Risk Factors</p>
                            </div>
                            <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1">
                              {result.riskFactors.map((factor, index) => (
                                <li key={index}>• {factor}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Export Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={exportResults} className="flex-1">
                            <Download className="h-4 w-4 mr-2" />
                            Export JSON
                          </Button>
                          <Button variant="outline" size="sm" onClick={shareResults} className="flex-1">
                            {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
                            {copied ? 'Copied!' : 'Share'}
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-16 text-center"
                      >
                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Scale className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-2">
                          Enter parameters and click Calculate
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Results will appear here
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          {result ? (
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pie Chart - Claim Breakdown */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                        Claim Breakdown
                      </CardTitle>
                      <CardDescription>Distribution of recovery amounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={recoveryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {recoveryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Bar Chart - Liability Comparison */}
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                        Claim vs Recovery
                      </CardTitle>
                      <CardDescription>Comparison of claim components</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={claimBreakdownData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                            <XAxis dataKey="name" className="text-muted-foreground" />
                            <YAxis className="text-muted-foreground" />
                            <Tooltip formatter={(value: number) => `${currencySymbol}${value.toLocaleString()}`} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {claimBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Line Chart - Claim Timeline */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[var(--ocean)]" />
                      Claim Timeline
                    </CardTitle>
                    <CardDescription>Typical claim process timeline in days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={claimTimelineData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="stage" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground" />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="cumulative" 
                            stroke={OCEAN_BLUE} 
                            strokeWidth={3}
                            name="Cumulative Days"
                            dot={{ fill: OCEAN_BLUE, strokeWidth: 2 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="days" 
                            stroke={LOGISTICS_GREEN} 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Days per Stage"
                            dot={{ fill: LOGISTICS_GREEN, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recovery Gauge */}
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[var(--ocean)]" />
                      Recovery Rate Gauge
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          cx="50%" 
                          cy="100%" 
                          innerRadius="30%" 
                          outerRadius="100%" 
                          startAngle={180} 
                          endAngle={0}
                          data={recoveryProgressData}
                        >
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={10}
                          />
                          <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center -mt-8">
                      <p className="text-3xl font-bold" style={{ color: getEfficiencyColor((result.totalRecovery / result.actualClaimValue) * 100) }}>
                        {((result.totalRecovery / result.actualClaimValue) * 100).toFixed(1)}%
                      </p>
                      <p className="text-muted-foreground">Overall Recovery Rate</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-[var(--ocean)]" />
                      Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--ocean)]/5 rounded-lg text-center border border-[var(--ocean)]/20">
                        <div className="text-2xl font-bold text-[var(--ocean)]">{currencySymbol}{result.actualClaimValue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Claim Value</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-[var(--logistics)]/10 to-[var(--logistics)]/5 rounded-lg text-center border border-[var(--logistics)]/20">
                        <div className="text-2xl font-bold text-[var(--logistics)]">{currencySymbol}{result.totalRecovery.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Recovery</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-lg text-center border border-amber-500/20">
                        <div className="text-2xl font-bold" style={{ color: getEfficiencyColor((result.totalRecovery / result.actualClaimValue) * 100) }}>
                          {((result.totalRecovery / result.actualClaimValue) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Recovery Rate</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-red-500/10 to-red-500/5 rounded-lg text-center border border-red-500/20">
                        <div className="text-2xl font-bold text-red-500">{currencySymbol}{result.unrecoveredLoss.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Unrecovered Loss</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-10 w-10 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Run a calculation first to see analysis charts
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Process Tab */}
        <TabsContent value="process" className="space-y-6">
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Process Steps */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-[var(--ocean)]" />
                    Claims Process Steps
                  </CardTitle>
                  <CardDescription>
                    Follow these steps to maximize your claim recovery
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {CLAIMS_PROCESS_STEPS.map((step, index) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative pl-8 pb-6 ${index < CLAIMS_PROCESS_STEPS.length - 1 ? 'border-l-2 border-l-border' : ''}`}
                      >
                        {/* Step number circle */}
                        <div className={`absolute left-0 top-0 w-7 h-7 -translate-x-[15px] rounded-full flex items-center justify-center text-sm font-bold ${
                          step.critical 
                            ? 'bg-[var(--ocean)] text-white' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {step.step}
                        </div>
                        
                        <div className={`p-4 rounded-lg border ${
                          step.critical 
                            ? 'bg-[var(--ocean)]/5 border-[var(--ocean)]/20' 
                            : 'bg-muted/30 border-border'
                        }`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <step.icon className={`h-5 w-5 ${step.critical ? 'text-[var(--ocean)]' : 'text-muted-foreground'}`} />
                                <h4 className="font-semibold">{step.title}</h4>
                                {step.critical && (
                                  <Badge variant="outline" className="text-[var(--ocean)] border-[var(--ocean)] text-xs">
                                    Critical
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs whitespace-nowrap">
                              <Clock className="h-3 w-3 mr-1" />
                              {step.timeline}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* International Liability Regimes */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gavel className="h-5 w-5 text-[var(--ocean)]" />
                    International Liability Regimes
                  </CardTitle>
                  <CardDescription>
                    Carrier liability limits by transport mode and convention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={liabilityComparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis type="number" className="text-muted-foreground" />
                        <YAxis dataKey="name" type="category" width={80} className="text-muted-foreground" />
                        <Tooltip formatter={(value: number) => `SDR ${value}/kg`} />
                        <Bar dataKey="limit" name="Liability Limit (SDR/kg)" radius={[0, 4, 4, 0]}>
                          {liabilityComparisonData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.mode === 'Sea' ? OCEAN_BLUE : 
                                    entry.mode === 'Air' ? COLORS.cyan : 
                                    entry.mode === 'Road' ? LOGISTICS_GREEN : COLORS.purple} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-semibold">Convention</th>
                          <th className="text-center py-3 px-4 font-semibold">Mode</th>
                          <th className="text-center py-3 px-4 font-semibold">Year</th>
                          <th className="text-center py-3 px-4 font-semibold">Limit per kg</th>
                          <th className="text-center py-3 px-4 font-semibold">Notice Period</th>
                          <th className="text-left py-3 px-4 font-semibold">Key Features</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(liabilityRegimes).map(([key, regime], index) => (
                          <tr key={key} className={`border-b ${index % 2 === 0 ? 'bg-muted/30' : ''}`}>
                            <td className="py-3 px-4 font-medium">{regime.name}</td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="outline">{regime.mode}</Badge>
                            </td>
                            <td className="text-center py-3 px-4">{regime.year}</td>
                            <td className="text-center py-3 px-4">
                              <Badge style={{ backgroundColor: `rgba(15,76,129,0.1)`, color: OCEAN_BLUE }}>
                                SDR {regime.limitPerKg}/kg
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="outline">{regime.timeLimit}</Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {key === 'hague' && 'Original convention, limited carrier liability'}
                              {key === 'hague-visby' && 'Most widely adopted, higher limits than Hague'}
                              {key === 'hamburg' && 'More cargo-friendly, higher limits'}
                              {key === 'rotterdam' && 'Modern convention, highest limits'}
                              {key === 'montreal-air' && 'Standard for international air cargo'}
                              {key === 'cmr-road' && 'European road transport standard'}
                              {key === 'cim-rail' && 'European rail transport standard'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* SDR Conversion Note */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-[var(--ocean)]" />
                    SDR Conversion Note
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Special Drawing Rights (SDR) is an international reserve asset created by the IMF. 
                    Liability limits are expressed in SDR to provide a stable reference value across currencies.
                  </p>
                  <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5 rounded-lg border border-border/50">
                    <div className="text-sm text-muted-foreground mb-2">Current Approximate Rates:</div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-bold text-lg text-[var(--ocean)]">1.35</div>
                        <div className="text-xs text-muted-foreground">SDR to USD</div>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-[var(--logistics)]">1.20</div>
                        <div className="text-xs text-muted-foreground">SDR to EUR</div>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-amber-600">1.08</div>
                        <div className="text-xs text-muted-foreground">SDR to GBP</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: SDR rates fluctuate daily. Check IMF rates for exact conversions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Understanding Cargo Claims */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                    Understanding Cargo Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    Cargo claims represent the legal and financial process through which cargo owners seek compensation for loss, damage, or delay to goods during transportation. The global logistics industry handles billions of dollars in cargo claims annually, making understanding this process essential for any business involved in international trade. Claims can arise from various causes including improper handling, inadequate packaging, accidents, natural disasters, theft, or carrier negligence. The complexity of cargo claims stems from the intersection of multiple legal frameworks, including international conventions, national laws, contractual terms, and insurance policies. Each mode of transport - sea, air, road, and rail - operates under different liability regimes that establish the carrier's obligations and limits of liability. Success in recovering losses depends on understanding which convention applies to your shipment, meeting all notification deadlines, maintaining comprehensive documentation, and navigating the negotiation process effectively. Cargo claims can range from simple cases resolved within weeks to complex disputes lasting years and requiring legal intervention.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Types of Claims */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--logistics)]" />
                    Types of Cargo Claims
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Cargo claims fall into several distinct categories, each with unique characteristics, evidentiary requirements, and recovery considerations. Understanding these categories helps ensure proper documentation and maximizes recovery potential.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Total Loss
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Complete destruction or irretrievable loss of cargo. May be actual total loss (physically destroyed) or constructive total loss (recovery cost exceeds value). Requires proof of cargo value and evidence of total destruction.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-[var(--ocean)]" />
                        Partial Damage
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Physical damage to a portion of the shipment. Most common claim type requiring detailed survey reports, repair estimates, or salvage value assessments. Documentation of both damaged and undamaged portions essential.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Scale className="h-4 w-4 text-amber-500" />
                        Shortage
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Receipt of fewer items than shipped. Requires comparison of shipping documents with delivery records, weighing certificates, and often investigation of potential pilferage versus documentation errors.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Ship className="h-4 w-4 text-[var(--logistics)]" />
                        Water Damage
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Damage from seawater, fresh water, or condensation. Common in maritime transport requiring survey of container condition, weather records, and determination of whether damage occurred from external ingress or internal condensation.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        Theft & Pilferage
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Criminal taking of cargo during transport or storage. Requires police reports, investigation of security measures, and often involves complex coverage questions regarding custody and control at time of loss.
                      </p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                      <h4 className="font-semibold flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-cyan-500" />
                        Temperature Deviation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Damage to temperature-sensitive goods from improper refrigeration. Requires temperature logs, data logger records, and expert analysis to establish causal link between deviation and damage.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Documentation Requirements */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[var(--ocean)]" />
                    Documentation Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Comprehensive documentation forms the foundation of any successful cargo claim. The quality and completeness of your documentation directly impacts recovery speed and amount. All claims require establishing four key elements: the existence of the loss, the cause of the loss, the carrier's liability, and the quantum of damages. Each element requires specific supporting documents. Begin collecting documentation immediately upon discovery of any loss - delay in gathering evidence can prove fatal to your claim as memories fade, physical evidence degrades, and documents become unavailable. Maintain organized files with copies of all documents, noting dates of receipt and transmission. Digital copies should be backed up securely. For high-value claims, consider engaging a professional surveyor who can ensure proper documentation collection and preservation.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)]" />
                        Essential Documents
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                          <span><strong>Bill of Lading/Air Waybill</strong> - Proof of contract of carriage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                          <span><strong>Commercial Invoice</strong> - Establishes cargo value</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                          <span><strong>Packing List</strong> - Item details and quantities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                          <span><strong>Survey Report</strong> - Independent damage assessment</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                          <span><strong>Delivery Receipt</strong> - With damage notation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-[var(--ocean)] mt-0.5" />
                          <span><strong>Photographs</strong> - Visual evidence of damage</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileWarning className="h-4 w-4 text-amber-500" />
                        Situational Documents
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span><strong>Temperature Logs</strong> - For refrigerated cargo</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span><strong>Police Report</strong> - For theft claims</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span><strong>Lab Reports</strong> - For contamination claims</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span><strong>Repair Quotes</strong> - For partial damage</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span><strong>Salvage Reports</strong> - For damaged goods</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileCheck className="h-4 w-4 text-amber-500 mt-0.5" />
                          <span><strong>Insurance Certificate</strong> - Coverage proof</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Claims Best Practices */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-[var(--logistics)]" />
                    Claims Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Successful cargo claim management requires a systematic approach that begins before any loss occurs. Proactive measures, including proper insurance coverage, clear contract terms, and documented procedures, significantly improve recovery outcomes. Establish relationships with surveyors, legal counsel, and claims consultants before you need them. When a loss occurs, time is of the essence - every day of delay can weaken your claim. Follow these best practices consistently to maximize recovery and minimize the impact of cargo losses on your business operations.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
                      <h4 className="font-semibold text-[var(--ocean)] mb-2">Pre-Shipment</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Insure at 110% of CIF value minimum</li>
                        <li>• Use appropriate Institute Cargo Clauses</li>
                        <li>• Document pre-shipment condition</li>
                        <li>• Ensure proper packaging and marking</li>
                        <li>• Review carrier terms and conditions</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-[var(--logistics)]/5 rounded-lg border border-[var(--logistics)]/20">
                      <h4 className="font-semibold text-[var(--logistics)] mb-2">At Delivery</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Inspect before signing delivery receipt</li>
                        <li>• Note all damage with specific details</li>
                        <li>• Take comprehensive photographs</li>
                        <li>• Request carrier representative presence</li>
                        <li>• Preserve damaged goods and packaging</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                      <h4 className="font-semibold text-amber-600 mb-2">Post-Discovery</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Send written notice immediately</li>
                        <li>• Commission independent survey</li>
                        <li>• Notify insurance promptly</li>
                        <li>• Gather all supporting documents</li>
                        <li>• Maintain communication log</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                      <h4 className="font-semibold text-purple-600 mb-2">Claim Filing</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Submit formal claim with documentation</li>
                        <li>• Quantify loss with supporting evidence</li>
                        <li>• File with both carrier and insurer</li>
                        <li>• Track all deadlines and limitations</li>
                        <li>• Document all negotiations</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Tips */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Pro Tips for Successful Claims
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PRO_TIPS.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md transition-shadow"
                      >
                        <tip.icon className="h-6 w-6 mb-2" style={{ color: tip.color }} />
                        <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                        <p className="text-xs text-muted-foreground">{tip.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Common Mistakes */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Common Mistakes to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {COMMON_MISTAKES.map((mistake, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800/50"
                      >
                        <div className="flex items-start gap-3">
                          <mistake.icon className="h-5 w-5 mt-0.5" style={{ color: mistake.color }} />
                          <div>
                            <h4 className="font-medium text-sm text-red-700 dark:text-red-400">{mistake.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{mistake.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Time Limits Reference */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Time Limits Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--ocean)]/5 rounded-lg p-4 border border-[var(--ocean)]/20">
                      <h5 className="font-semibold mb-2 text-[var(--ocean)]">Written Notice</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        3-21 days depending on convention. Must be in writing with specific damage details.
                      </p>
                      <Badge variant="outline" className="text-[var(--ocean)] border-[var(--ocean)]">Critical Deadline</Badge>
                    </div>
                    <div className="bg-gradient-to-br from-[var(--logistics)]/10 to-[var(--logistics)]/5 rounded-lg p-4 border border-[var(--logistics)]/20">
                      <h5 className="font-semibold mb-2 text-[var(--logistics)]">Legal Action</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        1-2 years from delivery date. After this period, claims are time-barred.
                      </p>
                      <Badge variant="outline" className="text-[var(--logistics)] border-[var(--logistics)]">Statute of Limitations</Badge>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <h5 className="font-semibold text-purple-600 mb-2">Insurance Notice</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Usually within 30 days. Check your specific policy for exact requirements.
                      </p>
                      <Badge variant="outline" className="text-purple-600 border-purple-600">Policy Dependent</Badge>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <h5 className="font-semibold text-amber-600 mb-2">Survey Report</h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        Arrange within 3-7 days of discovery. Independent survey strengthens your case.
                      </p>
                      <Badge variant="outline" className="text-amber-600 border-amber-600">Best Practice</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Comprehensive answers to common cargo claim questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['All', 'Basics', 'Conventions', 'Process', 'Documentation', 'Insurance', 'Legal'].map((category) => (
                      <Badge 
                        key={category} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted transition-colors"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <Accordion type="single" collapsible className="space-y-3">
                    {FAQS.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`item-${index}`} 
                        className="border rounded-lg px-4 bg-muted/20 hover:bg-muted/30 transition-colors"
                      >
                        <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                              style={{ color: OCEAN_BLUE, borderColor: OCEAN_BLUE }}
                            >
                              {faq.category}
                            </Badge>
                            <span>{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5 border-[var(--ocean)]/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-[var(--logistics)]" />
                    Need More Help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-background/50 rounded-lg text-center hover:shadow-md transition-shadow">
                      <FileCheck className="h-8 w-8 mx-auto mb-2 text-[var(--ocean)]" />
                      <h4 className="font-medium mb-1">Documentation Guide</h4>
                      <p className="text-sm text-muted-foreground">
                        Download our comprehensive claim documentation checklist
                      </p>
                      <Button variant="link" size="sm" className="mt-2 text-[var(--ocean)]">
                        Download <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg text-center hover:shadow-md transition-shadow">
                      <Gavel className="h-8 w-8 mx-auto mb-2 text-[var(--logistics)]" />
                      <h4 className="font-medium mb-1">Legal Resources</h4>
                      <p className="text-sm text-muted-foreground">
                        Find maritime lawyers specializing in cargo claims
                      </p>
                      <Button variant="link" size="sm" className="mt-2 text-[var(--logistics)]">
                        Browse <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg text-center hover:shadow-md transition-shadow">
                      <Sparkles className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                      <h4 className="font-medium mb-1">Expert Consultation</h4>
                      <p className="text-sm text-muted-foreground">
                        Schedule a consultation with our cargo claim experts
                      </p>
                      <Button variant="link" size="sm" className="mt-2 text-amber-500">
                        Schedule <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-center border-t pt-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Still have questions? Contact our support team for personalized assistance.
                  </p>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
