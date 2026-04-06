"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Scale,
  AlertTriangle,
  FileWarning,
  DollarSign,
  Package,
  Ship,
  Plane,
  Truck,
  Train,
  Info,
  RefreshCw,
  Shield,
  Gavel,
  Clock,
  FileCheck,
  FileX,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Share2,
  ChevronRight,
  Calendar,
  Weight,
  Percent,
  Building2,
  Ban,
  BookOpen,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  Target,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { currencies, formatCurrency } from "@/lib/constants/currencies";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

// Types
interface ClaimCalculation {
  // Cargo values
  totalCargoValue: number;
  damagedValue: number;
  
  // Carrier liability
  carrierLiabilityLimit: number;
  carrierLiabilityPerKg: number;
  carrierRecoverable: number;
  carrierRecoveryPercentage: number;
  
  // Insurance
  insuredAmount: number;
  insuranceRecovery: number;
  deductibleAmount: number;
  
  // Total recovery
  totalRecovery: number;
  unrecoveredLoss: number;
  recoveryRate: number;
  
  // Assessment
  liabilityRegime: string;
  carrierLiable: boolean;
  exclusionRisk: string[];
  
  // Timeline
  noticeDeadline: string;
  claimDeadline: string;
  daysRemaining: number;
}

interface DocumentItem {
  name: string;
  required: boolean;
  description: string;
  uploaded?: boolean;
}

interface TimelineStep {
  step: number;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  critical: boolean;
}

// Liability regimes data
const liabilityRegimes = {
  'hague': { 
    limitPerKg: 500, 
    name: 'Hague Rules (1924)', 
    timeLimit: '3 days', 
    claimPeriod: '1 year',
    description: 'Original maritime convention with limited carrier liability'
  },
  'hague-visby': { 
    limitPerKg: 666.67, 
    name: 'Hague-Visby Rules (1968)', 
    timeLimit: '3 days', 
    claimPeriod: '1 year',
    description: 'Most widely adopted, higher limits than Hague'
  },
  'hamburg': { 
    limitPerKg: 835, 
    name: 'Hamburg Rules (1978)', 
    timeLimit: '15 days', 
    claimPeriod: '2 years',
    description: 'More cargo-friendly, higher liability limits'
  },
  'rotterdam': { 
    limitPerKg: 875, 
    name: 'Rotterdam Rules (2008)', 
    timeLimit: '21 days', 
    claimPeriod: '2 years',
    description: 'Modern convention, highest liability limits'
  },
  'montreal-air': { 
    limitPerKg: 22, 
    name: 'Montreal Convention (Air)', 
    timeLimit: '21 days', 
    claimPeriod: '2 years',
    description: 'SDR 22/kg for international air cargo'
  },
  'cmr-road': { 
    limitPerKg: 8.33, 
    name: 'CMR Convention (Road)', 
    timeLimit: '7 days', 
    claimPeriod: '1 year',
    description: 'European road transport standard'
  },
  'cim-rail': { 
    limitPerKg: 17, 
    name: 'CIM Convention (Rail)', 
    timeLimit: '7 days', 
    claimPeriod: '1 year',
    description: 'European rail transport standard'
  },
};

// Damage types with carrier liability indicators
const damageTypes = [
  { 
    value: 'total-loss', 
    label: 'Total Loss', 
    carrierLiable: true, 
    icon: '🚨',
    description: 'Complete loss of cargo during transit'
  },
  { 
    value: 'partial-loss', 
    label: 'Partial Loss/Damage', 
    carrierLiable: true, 
    icon: '📦',
    description: 'Part of shipment damaged or lost'
  },
  { 
    value: 'shortage', 
    label: 'Shortage', 
    carrierLiable: true, 
    icon: '📉',
    description: 'Quantity delivered less than shipped'
  },
  { 
    value: 'water-damage', 
    label: 'Water Damage', 
    carrierLiable: true, 
    icon: '💧',
    description: 'Damage from water ingress or moisture'
  },
  { 
    value: 'breakage', 
    label: 'Breakage', 
    carrierLiable: true, 
    icon: '💔',
    description: 'Physical damage from impact or handling'
  },
  { 
    value: 'theft', 
    label: 'Theft/Pilferage', 
    carrierLiable: true, 
    icon: '🔓',
    description: 'Cargo stolen during transit'
  },
  { 
    value: 'contamination', 
    label: 'Contamination', 
    carrierLiable: false, 
    icon: '☢️',
    description: 'Cargo contaminated by other goods'
  },
  { 
    value: 'temperature', 
    label: 'Temperature Deviation', 
    carrierLiable: false, 
    icon: '🌡️',
    description: 'Damage from temperature variations'
  },
  { 
    value: 'inherent-vice', 
    label: 'Inherent Vice', 
    carrierLiable: false, 
    icon: '⚠️',
    description: 'Natural deterioration of goods'
  },
];

// Insurance coverage types
const insuranceTypes = [
  { value: 'icc-a', name: 'ICC (A) - All Risks', deductible: 0.05, coversTemperature: true },
  { value: 'icc-b', name: 'ICC (B) - Intermediate', deductible: 0.10, coversTemperature: false },
  { value: 'icc-c', name: 'ICC (C) - Basic', deductible: 0.15, coversTemperature: false },
  { value: 'none', name: 'No Insurance', deductible: 0, coversTemperature: false },
];

// Transport modes
const transportModes = [
  { value: 'sea', label: 'Ocean Freight', icon: Ship, defaultRegime: 'hague-visby' },
  { value: 'air', label: 'Air Freight', icon: Plane, defaultRegime: 'montreal-air' },
  { value: 'road', label: 'Road Transport', icon: Truck, defaultRegime: 'cmr-road' },
  { value: 'rail', label: 'Rail Transport', icon: Train, defaultRegime: 'cim-rail' },
];

// Carrier defenses/exclusions
const carrierDefenses = [
  'Act of God (natural disaster)',
  'Act of War or Piracy',
  'Fault or neglect of shipper',
  'Inherent vice of the goods',
  'Insufficient packing',
  'Latent defect not discoverable',
  'Saving life at sea',
  'Reasonable deviation',
];

const COLORS = [
  "#0F4C81",
  "#2E8B57",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
];

// Animated Badge Component
const AnimatedBadge = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Badge 
      variant="outline" 
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-[var(--ocean)]/30 text-[var(--ocean)] dark:text-[var(--ocean)] px-3 py-1"
    >
      {children}
    </Badge>
  </motion.div>
);

export default function FreightClaimsCalculator() {
  // Input state
  const [transportMode, setTransportMode] = useState<'sea' | 'air' | 'road' | 'rail'>('sea');
  const [liabilityRegime, setLiabilityRegime] = useState('hague-visby');
  const [damageType, setDamageType] = useState('partial-loss');
  const [cargoValue, setCargoValue] = useState('50000');
  const [damagedValue, setDamagedValue] = useState('15000');
  const [grossWeight, setGrossWeight] = useState('5000');
  const [currency, setCurrency] = useState('USD');
  const [insuranceType, setInsuranceType] = useState('icc-a');
  const [insuredValue, setInsuredValue] = useState('55000');
  const [deductible, setDeductible] = useState('500');
  const [incidentDate, setIncidentDate] = useState('');
  const [hasInsurance, setHasInsurance] = useState(true);
  const [activeTab, setActiveTab] = useState('calculator');

  // Get selected damage type info
  const selectedDamage = damageTypes.find(d => d.value === damageType);
  const selectedRegime = liabilityRegimes[liabilityRegime as keyof typeof liabilityRegimes];
  const selectedInsurance = insuranceTypes.find(i => i.value === insuranceType);

  // Calculate claim
  const calculation = useMemo<ClaimCalculation>(() => {
    const cargoValueNum = parseFloat(cargoValue) || 0;
    const damagedValueNum = parseFloat(damagedValue) || 0;
    const weight = parseFloat(grossWeight) || 0;
    const insuredAmount = hasInsurance ? (parseFloat(insuredValue) || cargoValueNum * 1.1) : 0;
    const deductibleAmount = hasInsurance ? (parseFloat(deductible) || 0) : 0;

    // Carrier liability calculation
    const liabilityLimit = selectedRegime.limitPerKg * weight;
    const claimPerKg = weight > 0 ? damagedValueNum / weight : 0;
    
    // Check carrier liability based on damage type
    const carrierLiable = selectedDamage?.carrierLiable ?? true;
    let carrierRecoverable = carrierLiable ? Math.min(damagedValueNum, liabilityLimit) : 0;
    const carrierRecoveryPercentage = damagedValueNum > 0 ? (carrierRecoverable / damagedValueNum) * 100 : 0;

    // Insurance recovery
    let insuranceRecovery = 0;
    if (hasInsurance && insuranceType !== 'none') {
      if (damageType === 'total-loss') {
        insuranceRecovery = Math.min(insuredAmount, damagedValueNum) - deductibleAmount;
      } else {
        // Partial damage - typically covers shortfall after carrier
        const shortfall = damagedValueNum - carrierRecoverable;
        insuranceRecovery = Math.max(0, Math.min(insuredAmount, shortfall)) - deductibleAmount;
      }
      
      // Check temperature coverage
      if (damageType === 'temperature' && !selectedInsurance?.coversTemperature) {
        insuranceRecovery = 0;
      }
    }

    insuranceRecovery = Math.max(0, insuranceRecovery);

    const totalRecovery = carrierRecoverable + insuranceRecovery;
    const unrecoveredLoss = Math.max(0, damagedValueNum - totalRecovery);
    const recoveryRate = damagedValueNum > 0 ? (totalRecovery / damagedValueNum) * 100 : 0;

    // Exclusion risks
    const exclusionRisk: string[] = [];
    if (!carrierLiable) {
      exclusionRisk.push(`Carrier may deny liability for ${selectedDamage?.label}`);
    }
    if (claimPerKg > liabilityLimit * 0.8) {
      exclusionRisk.push('Claim per kg approaches liability limit');
    }
    if (!hasInsurance && damagedValueNum > liabilityLimit) {
      exclusionRisk.push('No insurance for excess over carrier liability');
    }
    if (damageType === 'temperature' && insuranceType === 'icc-c') {
      exclusionRisk.push('ICC(C) does not cover temperature damage');
    }

    // Timeline calculation
    const incident = incidentDate ? new Date(incidentDate) : new Date();
    const noticeDays = parseInt(selectedRegime.timeLimit);
    const claimYears = parseInt(selectedRegime.claimPeriod);
    
    const noticeDeadline = new Date(incident);
    noticeDeadline.setDate(noticeDeadline.getDate() + noticeDays);
    
    const claimDeadline = new Date(incident);
    claimDeadline.setFullYear(claimDeadline.getFullYear() + claimYears);
    
    const today = new Date();
    const daysRemaining = Math.ceil((noticeDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return {
      totalCargoValue: cargoValueNum,
      damagedValue: damagedValueNum,
      carrierLiabilityLimit: liabilityLimit,
      carrierLiabilityPerKg: selectedRegime.limitPerKg,
      carrierRecoverable,
      carrierRecoveryPercentage,
      insuredAmount,
      insuranceRecovery,
      deductibleAmount,
      totalRecovery,
      unrecoveredLoss,
      recoveryRate,
      liabilityRegime: selectedRegime.name,
      carrierLiable,
      exclusionRisk,
      noticeDeadline: noticeDeadline.toLocaleDateString(),
      claimDeadline: claimDeadline.toLocaleDateString(),
      daysRemaining,
    };
  }, [cargoValue, damagedValue, grossWeight, liabilityRegime, damageType, insuranceType, insuredValue, deductible, hasInsurance, incidentDate, selectedDamage, selectedRegime, selectedInsurance]);

  // Documentation checklist
  const documentation: DocumentItem[] = useMemo(() => {
    const docs: DocumentItem[] = [
      { name: 'Commercial Invoice', required: true, description: 'Original invoice showing cargo value', uploaded: false },
      { name: 'Packing List', required: true, description: 'Detailed list of shipped items', uploaded: false },
      { name: 'Bill of Lading / Air Waybill', required: true, description: 'Transport contract document', uploaded: false },
      { name: 'Delivery Receipt', required: true, description: 'With damage noted at delivery', uploaded: false },
      { name: 'Survey Report', required: true, description: 'Independent damage assessment', uploaded: false },
      { name: 'Photos of Damage', required: true, description: 'Clear images showing damage extent', uploaded: false },
      { name: 'Insurance Certificate', required: hasInsurance, description: 'Proof of cargo insurance', uploaded: false },
      { name: 'Claim Letter', required: true, description: 'Written notice to carrier/insurer', uploaded: false },
    ];
    
    if (damageType === 'temperature') {
      docs.push({ name: 'Temperature Log / Data Logger', required: true, description: 'Temperature records during transit', uploaded: false });
    }
    if (damageType === 'theft') {
      docs.push({ name: 'Police Report', required: true, description: 'Official police report of theft', uploaded: false });
    }
    if (damageType === 'contamination') {
      docs.push({ name: 'Lab Analysis Report', required: true, description: 'Scientific analysis of contamination', uploaded: false });
    }
    
    return docs;
  }, [damageType, hasInsurance]);

  // Timeline steps
  const timeline: TimelineStep[] = useMemo(() => {
    const incident = incidentDate ? new Date(incidentDate) : new Date();
    const noticeDays = parseInt(selectedRegime.timeLimit);
    
    return [
      {
        step: 1,
        title: 'Document Damage',
        description: 'Take photos, note damage on delivery receipt',
        deadline: 'Immediate',
        completed: false,
        critical: true,
      },
      {
        step: 2,
        title: 'Written Notice to Carrier',
        description: 'Submit written claim notification',
        deadline: `Within ${selectedRegime.timeLimit}`,
        completed: false,
        critical: true,
      },
      {
        step: 3,
        title: 'Arrange Survey',
        description: 'Independent surveyor assessment',
        deadline: 'Within 3-7 days',
        completed: false,
        critical: false,
      },
      {
        step: 4,
        title: 'Submit Insurance Claim',
        description: 'File claim with insurance company',
        deadline: 'Within 30 days',
        completed: false,
        critical: false,
      },
      {
        step: 5,
        title: 'Gather Documentation',
        description: 'Collect all supporting documents',
        deadline: 'Ongoing',
        completed: false,
        critical: false,
      },
      {
        step: 6,
        title: 'Legal Action Deadline',
        description: 'File lawsuit if claim denied',
        deadline: `Within ${selectedRegime.claimPeriod}`,
        completed: false,
        critical: true,
      },
    ];
  }, [incidentDate, selectedRegime]);

  // Chart data
  const recoveryData = useMemo(() => {
    return [
      { name: 'Carrier Recovery', value: calculation.carrierRecoverable, color: '#0F4C81' },
      { name: 'Insurance Recovery', value: calculation.insuranceRecovery, color: '#2E8B57' },
      { name: 'Unrecovered Loss', value: calculation.unrecoveredLoss, color: '#ef4444' },
    ];
  }, [calculation]);

  const liabilityComparisonData = useMemo(() => {
    return Object.entries(liabilityRegimes).map(([key, regime]) => ({
      name: regime.name.split(' ')[0],
      limit: regime.limitPerKg,
      current: liabilityRegime === key ? calculation.carrierLiabilityPerKg : 0,
    }));
  }, [liabilityRegime, calculation.carrierLiabilityPerKg]);

  const claimTypesData = useMemo(() => {
    return damageTypes.slice(0, 6).map(type => ({
      name: type.label.split('/')[0],
      liable: type.carrierLiable ? 100 : 0,
      icon: type.icon,
    }));
  }, []);

  const timelineChartData = useMemo(() => {
    return [
      { day: 0, progress: 0 },
      { day: 3, progress: 15 },
      { day: 7, progress: 30 },
      { day: 21, progress: 50 },
      { day: 90, progress: 75 },
      { day: 180, progress: 90 },
      { day: 365, progress: 100 },
    ];
  }, []);

  const resetForm = () => {
    setCargoValue('50000');
    setDamagedValue('15000');
    setGrossWeight('5000');
    setInsuredValue('55000');
    setDeductible('500');
    setIncidentDate('');
    setDamageType('partial-loss');
  };

  const exportResults = () => {
    const results = {
      calculation,
      inputs: {
        transportMode,
        liabilityRegime,
        damageType,
        cargoValue,
        damagedValue,
        grossWeight,
        currency,
        insuranceType,
        insuredValue,
        deductible,
        incidentDate,
        hasInsurance,
      },
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `freight-claim-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    const shareText = `Freight Claim Analysis:
Damage Value: ${formatCurrency(calculation.damagedValue, currency)}
Total Recovery: ${formatCurrency(calculation.totalRecovery, currency)}
Recovery Rate: ${calculation.recoveryRate.toFixed(1)}%
Liability Regime: ${calculation.liabilityRegime}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Freight Claims Calculator Results',
          text: shareText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const selectedCurrencyData = currencies.find(c => c.code === currency);

  // Pro Tips
  const proTips = [
    {
      icon: FileText,
      title: "Document Everything Immediately",
      description: "Take comprehensive photos and videos of damage before moving cargo. Document packaging condition, seal numbers, and any visible signs of tampering or mishandling."
    },
    {
      icon: Clock,
      title: "File Written Notice Promptly",
      description: "Submit written notice to the carrier within the required timeframe (3-21 days depending on the convention). Verbal notifications are insufficient - always follow up in writing."
    },
    {
      icon: Shield,
      title: "Insure for Full CIF Value Plus 10%",
      description: "Ensure your insurance covers the complete landed cost including freight, duties, and a buffer for incidental expenses. Under-insurance can lead to proportional recovery reductions."
    },
    {
      icon: AlertTriangle,
      title: "Note Damage on Delivery Receipt",
      description: "Always inspect cargo before signing the delivery receipt. Write 'Received damaged' or 'Subject to inspection' if you suspect any issues - signing 'clean' can waive your rights."
    },
    {
      icon: Gavel,
      title: "Understand Applicable Liability Regime",
      description: "Different transport modes are governed by different conventions. Knowing your rights under Hague-Visby, Montreal Convention, or CMR helps set realistic recovery expectations."
    },
    {
      icon: Target,
      title: "Request an Independent Survey",
      description: "For claims exceeding $10,000, commission an independent surveyor report. This provides objective evidence of damage extent and strengthens your negotiating position."
    }
  ];

  // Common Mistakes
  const commonMistakes = [
    {
      title: "Signing Clean Delivery Receipts",
      description: "Accepting delivery without noting damage or writing 'received in apparent good order' eliminates your ability to prove carrier liability. Always inspect and document before signing, or note 'subject to inspection' on the receipt."
    },
    {
      title: "Missing Notification Deadlines",
      description: "Failing to provide written notice within the required timeframe (often just 3 days for maritime claims) can completely bar your claim. Set reminders immediately upon delivery and send written notice even if you're still gathering documentation."
    },
    {
      title: "Under-Insuring Cargo",
      description: "Insuring only the purchase price rather than CIF value plus duties and handling costs leaves you exposed. Marine insurance should cover the full landed cost including freight, insurance premiums, and applicable duties."
    },
    {
      title: "Accepting Carrier's First Offer",
      description: "Carriers often make low initial settlement offers hoping you'll accept. Understand your full entitlements under the applicable convention, document all losses thoroughly, and be prepared to negotiate or escalate to legal action if necessary."
    },
    {
      title: "Poor Documentation Quality",
      description: "Blurry photos, incomplete paperwork, or missing timestamps can undermine your claim. Take clear, well-lit photos from multiple angles, keep all original documents, and maintain a chronological record of all communications."
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "What is a freight claim and when should I file one?",
      answer: "A freight claim is a formal demand for compensation against a carrier or insurer for loss, damage, or delay to cargo during transportation. You should file a freight claim whenever your cargo arrives damaged, short-delivered, or doesn't arrive at all. The claim process involves documenting the damage, calculating the loss value, and submitting a formal claim within the required timeframe. Most liability conventions require written notice within 3-21 days of delivery, followed by a formal claim within the claim period (typically 1-2 years). Even if you have insurance, you should still pursue carrier liability first, as insurers often require you to exhaust carrier remedies before claiming under the policy."
    },
    {
      question: "How is carrier liability calculated for damaged cargo?",
      answer: "Carrier liability is typically calculated based on the weight of the damaged cargo multiplied by a per-kilogram limit established by the applicable international convention. For maritime shipments under Hague-Visby Rules, the limit is approximately SDR 666.67 per kg (roughly $900 USD). Under Montreal Convention for air cargo, the limit is SDR 22 per kg (approximately $30 USD). If the actual damage value per kilogram is below the limit, the carrier pays the full amount. If it exceeds the limit, the carrier's liability is capped at the weight-based maximum. This is why high-value, low-weight cargo (electronics, pharmaceuticals) often requires additional insurance to cover the gap between carrier liability limits and actual value."
    },
    {
      question: "What documents do I need to support a freight claim?",
      answer: "A successful freight claim requires comprehensive documentation including: the commercial invoice proving cargo value, packing list showing contents, bill of lading or air waybill (transport contract), delivery receipt with damage notation, survey report from an independent assessor, photographs clearly showing the damage and packaging condition, insurance certificate if applicable, and a formal claim letter itemizing losses. For specific damage types, additional documents may be required: temperature logs for cold chain claims, police reports for theft, or lab analysis for contamination. All documents should be originals or certified copies, and you should maintain your own copies of everything submitted. The burden of proof lies with the claimant, so documentation quality directly impacts claim success."
    },
    {
      question: "What is the difference between carrier liability and cargo insurance?",
      answer: "Carrier liability and cargo insurance serve different but complementary purposes. Carrier liability is the legal obligation of the transporter to compensate for loss or damage caused by their negligence or breach of contract. It's limited by international conventions and may be excluded for certain causes (force majeure, inherent vice, shipper fault). Cargo insurance is a contract you purchase that covers your goods against specified risks, regardless of carrier fault. Insurance typically pays out first and then subrogates (takes over your rights) to pursue the carrier. The key differences are: carrier liability has weight-based limits, while insurance can cover full value; carrier liability may be excluded for certain perils, while all-risks insurance covers most events; and pursuing carrier claims can be adversarial, while insurance claims follow policy terms. Best practice is to have both: claim against carrier first, then claim any shortfall from insurance."
    },
    {
      question: "What are the time limits for filing freight claims?",
      answer: "Time limits for freight claims are strictly enforced and vary by transport mode and applicable convention. For maritime shipments under Hague-Visby Rules, you must give written notice within 3 days of delivery (or upon delivery if damage is apparent) and file legal proceedings within 1 year. Hamburg Rules extend notice to 15 days and proceedings to 2 years. For air cargo under Montreal Convention, written notice must be given within 21 days for damage or 14 days for delay, with legal proceedings within 2 years. Road transport under CMR requires notice within 7 days and proceedings within 1 year. Rail under CIM also has 7 days for notice and 1 year for proceedings. Missing these deadlines can completely bar your claim, so always set reminders and file notice immediately upon discovering any issue, even before you've calculated the full loss amount."
    },
    {
      question: "Can a carrier deny liability for cargo damage?",
      answer: "Yes, carriers can deny liability under certain circumstances defined by international conventions. Common carrier defenses include: Act of God (natural disasters like hurricanes or earthquakes), Act of War or piracy, fault or negligence of the shipper (improper packing, misdeclaration), inherent vice of the goods (natural spoilage or deterioration), latent defects not discoverable by due diligence, acts taken to save life at sea, and reasonable deviation from the agreed route. The carrier bears the burden of proving these defenses. Additionally, carriers may limit or exclude liability if the shipper failed to give timely notice of damage, declared a lower value for freight purposes, or if the damage occurred before the carrier took custody. Understanding these defenses helps you anticipate and counter carrier arguments by ensuring proper packing, accurate documentation, and timely notice."
    },
    {
      question: "How do I maximize recovery from a freight claim?",
      answer: "Maximizing recovery requires a strategic approach from the moment damage is discovered. First, document everything immediately with comprehensive photos and videos before moving cargo. Second, note damage on the delivery receipt or write 'subject to inspection' - never sign clean. Third, send written notice to the carrier within the required timeframe, even if you're still calculating losses. Fourth, commission an independent survey for significant claims to provide objective evidence. Fifth, claim against the carrier first before approaching your insurer - insurers often require this and may reduce payouts if you don't. Sixth, understand the applicable liability regime and calculate the full value including freight, duties, and consequential losses where recoverable. Seventh, don't accept the first settlement offer - carriers often lowball initially. Eighth, maintain detailed records of all communications and costs. Finally, be prepared to escalate to legal action if negotiations fail, but weigh legal costs against recovery potential."
    },
    {
      question: "What types of cargo damage are typically covered by freight claims?",
      answer: "Freight claims cover various types of cargo damage and loss, each with specific considerations. Physical damage includes breakage, crushing, denting, and scratching from rough handling or improper stowage. Water damage results from rain, seawater ingress, or condensation during transit. Temperature damage affects perishable goods when refrigeration fails or settings are incorrect. Theft and pilferage cover stolen cargo, ranging from complete container theft to partial losses from broken seals. Shortage occurs when delivery quantity is less than shipped quantity. Contamination happens when cargo is spoiled by contact with other goods or substances. Total loss means complete destruction or disappearance of cargo. Delay claims compensate for financial losses from late delivery, though these are often limited or excluded. Each damage type requires specific documentation and may have different coverage under carrier liability and insurance policies. Understanding the nature of your damage helps determine the best claim strategy."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-2xl p-6 md:p-8 border border-[var(--ocean)]/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <AnimatedBadge delay={0.1}>
              <Scale className="h-3 w-3 mr-1" />
              Freight Claims
            </AnimatedBadge>
            <AnimatedBadge delay={0.2}>
              <TrendingUp className="h-3 w-3 mr-1" />
              Loss Recovery
            </AnimatedBadge>
            <AnimatedBadge delay={0.3}>
              <Shield className="h-3 w-3 mr-1" />
              Claims Management
            </AnimatedBadge>
          </div>

          {/* Title and Description */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-[var(--ocean)] to-[var(--logistics)] rounded-xl shadow-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Freight Claims Calculator</h2>
                <p className="text-sm text-muted-foreground">
                  Calculate carrier liability, insurance recovery, and optimize your freight claim process
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetForm}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={shareResults}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-1">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="types" className="flex items-center gap-1">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Types</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              {/* Transport Mode */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[var(--ocean)]" />
                    Transport & Liability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Transport Mode</Label>
                      <Select 
                        value={transportMode} 
                        onValueChange={(v: 'sea' | 'air' | 'road' | 'rail') => {
                          setTransportMode(v);
                          const mode = transportModes.find(m => m.value === v);
                          if (mode) setLiabilityRegime(mode.defaultRegime);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {transportModes.map(mode => (
                            <SelectItem key={mode.value} value={mode.value}>
                              <div className="flex items-center gap-2">
                                <mode.icon className="h-4 w-4" />
                                {mode.label}
                              </div>
                            </SelectItem>
                          ))}
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
                        {damageTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.label}</span>
                              {!type.carrierLiable && (
                                <Badge variant="outline" className="ml-auto text-xs text-amber-600">Carrier may deny</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedDamage && (
                      <p className="text-xs text-muted-foreground">{selectedDamage.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cargo Values */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                    Cargo Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 15).map(c => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Gross Weight (kg)</Label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={grossWeight}
                          onChange={(e) => setGrossWeight(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Total Cargo Value</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {selectedCurrencyData?.symbol}
                        </span>
                        <Input
                          type="number"
                          value={cargoValue}
                          onChange={(e) => setCargoValue(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Damage/Loss Value</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {selectedCurrencyData?.symbol}
                        </span>
                        <Input
                          type="number"
                          value={damagedValue}
                          onChange={(e) => setDamagedValue(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Incident Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={incidentDate}
                        onChange={(e) => setIncidentDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Section */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[var(--logistics)]" />
                      Insurance Coverage
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-normal">Has Insurance</Label>
                      <Switch checked={hasInsurance} onCheckedChange={setHasInsurance} />
                    </div>
                  </CardTitle>
                </CardHeader>
                {hasInsurance && (
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Coverage Type</Label>
                        <Select value={insuranceType} onValueChange={setInsuranceType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {insuranceTypes.filter(t => t.value !== 'none').map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Insured Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {selectedCurrencyData?.symbol}
                          </span>
                          <Input
                            type="number"
                            value={insuredValue}
                            onChange={(e) => setInsuredValue(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Deductible</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {selectedCurrencyData?.symbol}
                        </span>
                        <Input
                          type="number"
                          value={deductible}
                          onChange={(e) => setDeductible(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {/* Main Result Card */}
              <Card className="border-2 border-[var(--ocean)]/20 bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Claim Analysis</span>
                    <Badge className="bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] text-white">
                      {calculation.recoveryRate.toFixed(1)}% Recovery
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Recovery Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Damage Value</p>
                      <p className="text-2xl font-bold text-red-500">
                        {formatCurrency(calculation.damagedValue, currency)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Recovery</p>
                      <p className="text-2xl font-bold text-[var(--logistics)]">
                        {formatCurrency(calculation.totalRecovery, currency)}
                      </p>
                    </div>
                  </div>

                  {/* Recovery Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Recovery Rate</span>
                      <span className="font-medium">{calculation.recoveryRate.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(calculation.recoveryRate, 100)} 
                      className="h-3"
                    />
                  </div>

                  <Separator />

                  {/* Carrier Liability */}
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-[var(--ocean)]" />
                      Carrier Liability ({calculation.liabilityRegime})
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Liability Limit</p>
                        <p className="text-lg font-bold text-[var(--ocean)]">
                          {formatCurrency(calculation.carrierLiabilityLimit, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SDR {calculation.carrierLiabilityPerKg}/kg × {grossWeight}kg
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                        <p className="text-xs text-muted-foreground">Recoverable</p>
                        <p className="text-lg font-bold text-[var(--logistics)]">
                          {formatCurrency(calculation.carrierRecoverable, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {calculation.carrierRecoveryPercentage.toFixed(1)}% of claim
                        </p>
                      </div>
                    </div>
                    {!calculation.carrierLiable && (
                      <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-amber-700 dark:text-amber-400">
                          Carrier may deny liability for this damage type
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Insurance Recovery */}
                  {hasInsurance && (
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[var(--logistics)]" />
                        Insurance Recovery
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">Coverage</p>
                          <p className="text-lg font-bold text-purple-600">
                            {formatCurrency(calculation.insuredAmount, currency)}
                          </p>
                        </div>
                        <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">Insurance Recovery</p>
                          <p className="text-lg font-bold text-teal-600">
                            {formatCurrency(calculation.insuranceRecovery, currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Unrecovered Loss Warning */}
                  {calculation.unrecoveredLoss > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <p className="font-semibold text-red-700 dark:text-red-400">Unrecovered Loss</p>
                      </div>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(calculation.unrecoveredLoss, currency)}
                      </p>
                      <p className="text-sm text-red-600/80 mt-1">
                        {(100 - calculation.recoveryRate).toFixed(1)}% of damage value not recoverable
                      </p>
                    </div>
                  )}

                  {/* Timeline Warning */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div className="flex-1">
                      <p className="font-medium">Notice Deadline: {calculation.noticeDeadline}</p>
                      <p className="text-sm text-muted-foreground">
                        {calculation.daysRemaining > 0 
                          ? `${calculation.daysRemaining} days remaining to file notice`
                          : 'Deadline passed - seek legal advice'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recovery Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recovery Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={recoveryData.filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {recoveryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          formatter={(value: number) => formatCurrency(value, currency)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Claim Value Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Claim Value Analysis
                </CardTitle>
                <CardDescription>
                  Detailed breakdown of claim components
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Cargo Value</p>
                    <p className="text-xl font-bold">{formatCurrency(calculation.totalCargoValue, currency)}</p>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Damage Value</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(calculation.damagedValue, currency)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Carrier Recovery</p>
                    <p className="text-xl font-bold text-[var(--ocean)]">{formatCurrency(calculation.carrierRecoverable, currency)}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Insurance Recovery</p>
                    <p className="text-xl font-bold text-[var(--logistics)]">{formatCurrency(calculation.insuranceRecovery, currency)}</p>
                  </div>
                </div>

                {/* Recovery Comparison Chart */}
                <div className="h-[250px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={recoveryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <RechartsTooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {recoveryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Liability Regime Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-[var(--ocean)]" />
                  Liability Regime Comparison
                </CardTitle>
                <CardDescription>
                  Compare liability limits across international conventions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={liabilityComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="limit" fill="#0F4C81" radius={[4, 4, 0, 0]}>
                        {liabilityComparisonData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.current > 0 ? '#2E8B57' : '#0F4C81'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Carrier Defenses */}
                <div className="mt-6">
                  <h4 className="font-medium flex items-center gap-2 mb-3">
                    <Ban className="h-4 w-4 text-amber-600" />
                    Carrier Defenses & Exclusions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {carrierDefenses.slice(0, 6).map((defense, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 text-sm p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded"
                      >
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                        <span className="text-xs">{defense}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Claims Process Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Claims Process Timeline
              </CardTitle>
              <CardDescription>
                Visual representation of the claims filing process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="progress" 
                      stroke="#0F4C81" 
                      fill="#0F4C81" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeline.slice(0, 6).map((step) => (
                  <div 
                    key={step.step}
                    className={`p-3 rounded-lg border ${
                      step.critical 
                        ? 'border-red-200 bg-red-50/50 dark:bg-red-950/20' 
                        : 'border-border bg-slate-50 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold ${step.critical ? 'text-red-600' : 'text-muted-foreground'}`}>
                        Step {step.step}
                      </span>
                      {step.critical && (
                        <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                          Critical
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.deadline}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Types Tab */}
        <TabsContent value="types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--ocean)]" />
                Freight Claim Types
              </CardTitle>
              <CardDescription>
                Understanding different types of freight claims and carrier liability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {damageTypes.map((type) => (
                  <Card 
                    key={type.value}
                    className={`cursor-pointer transition-all ${
                      damageType === type.value 
                        ? 'border-[var(--ocean)] bg-[var(--ocean)]/5' 
                        : 'hover:border-[var(--ocean)]/50'
                    }`}
                    onClick={() => setDamageType(type.value)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <h4 className="font-medium">{type.label}</h4>
                          <Badge 
                            variant="outline"
                            className={type.carrierLiable ? 'text-[var(--logistics)]' : 'text-amber-600'}
                          >
                            {type.carrierLiable ? 'Carrier Liable' : 'Carrier May Deny'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Liability Chart by Damage Type */}
              <div className="mt-6">
                <h4 className="font-medium mb-4">Carrier Liability by Damage Type</h4>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={claimTypesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="liable" fill="#2E8B57" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liability Regimes Table */}
          <Card>
            <CardHeader>
              <CardTitle>International Liability Regimes</CardTitle>
              <CardDescription>
                Carrier liability limits vary by transport mode and applicable convention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">Convention</th>
                      <th className="text-center py-2 px-3 font-medium">Mode</th>
                      <th className="text-center py-2 px-3 font-medium">SDR/kg</th>
                      <th className="text-center py-2 px-3 font-medium">Notice</th>
                      <th className="text-center py-2 px-3 font-medium">Claim Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(liabilityRegimes).map(([key, regime]) => (
                      <tr 
                        key={key} 
                        className={`border-b ${liabilityRegime === key ? 'bg-[var(--ocean)]/10' : ''}`}
                      >
                        <td className="py-2 px-3">
                          <div>
                            <p className="font-medium">{regime.name}</p>
                            <p className="text-xs text-muted-foreground">{regime.description}</p>
                          </div>
                        </td>
                        <td className="text-center py-2 px-3">
                          <Badge variant="outline">
                            {key.includes('air') ? 'Air' : 
                             key.includes('road') ? 'Road' :
                             key.includes('rail') ? 'Rail' : 'Sea'}
                          </Badge>
                        </td>
                        <td className="text-center py-2 px-3">
                          <Badge className="bg-[var(--ocean)]/10 text-[var(--ocean)]">
                            {regime.limitPerKg}
                          </Badge>
                        </td>
                        <td className="text-center py-2 px-3">
                          <Badge variant="secondary">{regime.timeLimit}</Badge>
                        </td>
                        <td className="text-center py-2 px-3">
                          <Badge variant="secondary">{regime.claimPeriod}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          {/* Understanding Freight Claims */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Understanding Freight Claims
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Freight claims are formal demands for compensation arising from loss, damage, or delay to cargo during transportation. The claims process is governed by international conventions, national laws, and contractual terms that vary depending on the mode of transport and the parties involved. Understanding the fundamentals of freight claims is essential for anyone involved in international trade, logistics, or supply chain management.
              </p>
              <p className="text-muted-foreground mt-4">
                The foundation of any freight claim is the contract of carriage, evidenced by documents such as bills of lading for sea transport, air waybills for air cargo, or consignment notes for road and rail. These documents establish the carrier's obligations and the terms under which they accept liability for cargo in their custody. When cargo arrives damaged, short, or delayed, the claimant must prove that the loss occurred while the cargo was in the carrier's charge and that the carrier is legally responsible.
              </p>
              <p className="text-muted-foreground mt-4">
                The claims process typically involves three key stages: notification, documentation, and settlement. Notification must be made within strict timeframes specified by the applicable convention—often as little as 3 days for maritime claims. Documentation must establish the value of the cargo, the extent of the damage, and the causal link between the carrier's actions and the loss. Settlement negotiations may involve direct discussions with the carrier, mediation, or ultimately legal proceedings if a fair resolution cannot be reached.
              </p>
            </CardContent>
          </Card>

          {/* Filing Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--logistics)]" />
                Filing Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Successfully filing a freight claim requires careful attention to procedural requirements and thorough documentation. The specific requirements vary by jurisdiction and transport mode, but certain principles apply universally. First and foremost, all claims must be made in writing and directed to the proper party—typically the issuing carrier or their agent. Verbal notifications, while helpful, do not satisfy legal requirements for preserving your rights.
              </p>
              <p className="text-muted-foreground mt-4">
                The written claim letter should clearly identify the shipment (including booking number, bill of lading number, dates, and routing), describe the damage or loss in detail, state the amount being claimed, and reference the legal basis for the claim. Supporting documentation must include proof of value (commercial invoices), proof of shipment (transport documents), proof of delivery condition (delivery receipts, survey reports), and evidence of the damage (photographs, inspection reports).
              </p>
              <p className="text-muted-foreground mt-4">
                For claims involving insurance, additional requirements apply. Most cargo insurance policies require immediate notification of any potential claim, cooperation with the insurer's investigation, and submission of proof of loss within a specified period (typically 30-60 days). Failure to comply with policy conditions can result in denial of coverage, even for otherwise valid claims. It's essential to review your insurance policy carefully and understand all notification and documentation requirements before a loss occurs.
              </p>
            </CardContent>
          </Card>

          {/* Time Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Time Limits & Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Time limits are among the most critical aspects of freight claims, as missing a deadline can completely bar your right to recover. The applicable time limits depend on the governing convention and the nature of the claim. For visible damage under Hague-Visby Rules, written notice must be given before or at the time of delivery, or within 3 days thereafter. For concealed damage, the same 3-day period applies from discovery. The Hamburg Rules extend this to 15 days, providing more flexibility for claimants.
              </p>
              <p className="text-muted-foreground mt-4">
                Beyond the notice requirement, there is a statute of limitations for commencing legal proceedings. Under Hague-Visby Rules, this is one year from delivery or the date the goods should have been delivered. Hamburg and Rotterdam Rules extend this to two years. Montreal Convention for air cargo provides two years from arrival at destination. CMR for road transport has one year, while CIM for rail also has one year. These limitation periods are strictly enforced—courts have no discretion to extend them regardless of the circumstances.
              </p>
              <p className="text-muted-foreground mt-4">
                Insurance policies impose their own time limits, which may be shorter than those under international conventions. Most policies require notice "as soon as practicable" after discovery of loss, with formal proof of loss within 30-60 days. Some policies have suit limitation clauses requiring legal action within a specified period (often 12 months) from the date of loss. Failing to meet these internal deadlines can result in denial of coverage even if the claim against the carrier would otherwise be valid.
              </p>
            </CardContent>
          </Card>

          {/* Maximizing Recovery */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Maximizing Recovery
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Maximizing recovery from freight claims requires a strategic approach that begins before any loss occurs. Proper preparation includes ensuring adequate insurance coverage (typically 110% of CIF value to account for all costs), maintaining detailed records of cargo value and condition, and understanding the liability limits applicable to your shipments. When high-value, low-weight cargo exceeds carrier liability limits, additional insurance becomes essential to cover the gap.
              </p>
              <p className="text-muted-foreground mt-4">
                At the time of delivery, thorough inspection is crucial. Never sign a clean delivery receipt without verifying the condition of the cargo. If damage is visible, note it specifically on the receipt. If damage is suspected but not immediately apparent, write "received subject to inspection" or similar qualifying language. Take comprehensive photographs before unpacking, showing the exterior condition of packages, any signs of mishandling, and the interior contents. These photographs can be invaluable in establishing when and how damage occurred.
              </p>
              <p className="text-muted-foreground mt-4">
                For significant claims, commissioning an independent survey provides objective evidence of the damage and its likely cause. Survey reports carry more weight than shipper-prepared documentation and can help overcome carrier defenses. When negotiating with carriers, understand that initial offers are often low. Be prepared to counter with documentation supporting your full claim amount, and don't hesitate to involve legal counsel if negotiations stall. Sometimes the credible threat of litigation motivates carriers to offer fair settlements they would otherwise avoid.
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {proTips.map((tip, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg border border-[var(--ocean)]/20 bg-[var(--ocean)]/5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <tip.icon className="h-5 w-5 text-[var(--ocean)]" />
                      <h4 className="font-medium">{tip.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900"
                  >
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-700 dark:text-red-400">{mistake.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common freight claim questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2 bg-[var(--ocean)]/10 rounded-lg">
                          <HelpCircle className="h-4 w-4 text-[var(--ocean)]" />
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-12">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-[var(--ocean)]/5 border-[var(--ocean)]/20">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-[var(--ocean)] mx-auto mb-2" />
                <h4 className="font-medium">Notice Deadlines</h4>
                <p className="text-2xl font-bold text-[var(--ocean)] mt-1">3-21 days</p>
                <p className="text-xs text-muted-foreground mt-1">Depending on convention</p>
              </CardContent>
            </Card>
            <Card className="bg-[var(--logistics)]/5 border-[var(--logistics)]/20">
              <CardContent className="p-4 text-center">
                <Gavel className="h-8 w-8 text-[var(--logistics)] mx-auto mb-2" />
                <h4 className="font-medium">Claim Periods</h4>
                <p className="text-2xl font-bold text-[var(--logistics)] mt-1">1-2 years</p>
                <p className="text-xs text-muted-foreground mt-1">For legal proceedings</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <h4 className="font-medium">Liability Limits</h4>
                <p className="text-2xl font-bold text-amber-600 mt-1">SDR 8.33-875/kg</p>
                <p className="text-xs text-muted-foreground mt-1">By transport mode</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
