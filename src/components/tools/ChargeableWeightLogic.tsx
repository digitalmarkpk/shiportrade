"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  Ship,
  Truck,
  Scale,
  Box,
  RefreshCw,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  TrendingDown,
  DollarSign,
  BarChart3,
  PieChart,
  Zap,
  Package,
  Info,
  ArrowUpDown,
  Sparkles,
  Calculator,
  HelpCircle,
  FileText,
  ChevronDown,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPie,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { lengthUnits } from "@/lib/constants/units";

// Carrier divisors with additional info
const carrierDivisors = {
  iata: { name: "IATA Standard", divisor: 6000, color: "#0F4C81", description: "Industry standard for airlines" },
  dhl: { name: "DHL Express", divisor: 5000, color: "#FFCC00", description: "DHL uses lower divisor = higher volumetric weight" },
  fedex: { name: "FedEx International", divisor: 6000, color: "#4D148C", description: "Same as IATA standard" },
  ups: { name: "UPS International", divisor: 6000, color: "#354E57", description: "Same as IATA standard" },
  tnt: { name: "TNT Express", divisor: 6000, color: "#FF6600", description: "Same as IATA standard" },
  ems: { name: "EMS/Postal", divisor: 6000, color: "#00B04F", description: "International postal services" },
  sea: { name: "Sea Freight (1:1000)", divisor: 1000000, color: "#2E8B57", description: "1 CBM = 1000 kg equivalent" },
} as const;

// Mode cost per kg estimates (USD)
const modeCosts = {
  air: { rate: 3.50, name: "Air Freight", icon: Plane, transitDays: "3-7", color: "#0F4C81" },
  sea: { rate: 0.15, name: "Sea Freight (LCL)", icon: Ship, transitDays: "20-45", color: "#2E8B57" },
  road: { rate: 0.45, name: "Road Freight", icon: Truck, transitDays: "5-14", color: "#F59E0B" },
} as const;

// Density classification
const densityClasses = [
  { min: 0, max: 50, label: "Very Light", color: "#EF4444", recommendation: "Consider sea freight" },
  { min: 50, max: 150, label: "Light", color: "#F59E0B", recommendation: "Compare air vs sea carefully" },
  { min: 150, max: 300, label: "Medium", color: "#10B981", recommendation: "Good for air freight" },
  { min: 300, max: 500, label: "Dense", color: "#0F4C81", recommendation: "Excellent for air freight" },
  { min: 500, max: Infinity, label: "Very Dense", color: "#2E8B57", recommendation: "Best for air freight" },
];

// Carrier Divisor Reference Data
const carrierDivisorReference = [
  { carrier: "DHL Express", divisor: 5000, formula: "L×W×H÷5000", notes: "Lower divisor = 20% higher volumetric weight", region: "Global" },
  { carrier: "FedEx International", divisor: 6000, formula: "L×W×H÷6000", notes: "IATA standard", region: "Global" },
  { carrier: "UPS International", divisor: 6000, formula: "L×W×H÷6000", notes: "IATA standard", region: "Global" },
  { carrier: "TNT Express", divisor: 6000, formula: "L×W×H÷6000", notes: "IATA standard", region: "Global" },
  { carrier: "IATA Airlines", divisor: 6000, formula: "L×W×H÷6000", notes: "Industry standard for most airlines", region: "Global" },
  { carrier: "EMS/Postal", divisor: 6000, formula: "L×W×H÷6000", notes: "International postal services", region: "Global" },
  { carrier: "Road Freight (LTL)", divisor: 3000, formula: "L×W×H÷3000", notes: "Higher impact for volume", region: "Regional" },
  { carrier: "Sea Freight", divisor: 1000000, formula: "1 CBM = 1000 kg", notes: "Volume-based pricing", region: "Global" },
];

// FAQ Data
const faqData = [
  {
    question: "What is chargeable weight and why does it matter?",
    answer: `Chargeable weight is the weight used by carriers to calculate your shipping costs, determined by taking the greater value between the actual weight (the physical weight of your shipment on a scale) and the volumetric weight (a calculated weight based on the package dimensions). This concept is fundamental to the logistics industry because it ensures carriers are fairly compensated for the space cargo occupies in their vehicles, vessels, or aircraft.

The reason chargeable weight matters is simple economics: a truck, container, or aircraft has limited space. A shipment of pillows weighing 50 kg might occupy the same space as 500 kg of machinery parts. Without volumetric weight pricing, carriers would lose money shipping lightweight but bulky items. Understanding chargeable weight helps you optimize packaging, compare shipping modes accurately, and avoid unexpected costs when receiving freight invoices. For importers and exporters, mastering this concept can lead to significant cost savings through better packaging decisions and mode selection.`
  },
  {
    question: "How is volumetric weight calculated for different carriers?",
    answer: `Volumetric weight is calculated using a simple formula: (Length × Width × Height) ÷ Divisor. The divisor varies by carrier and significantly impacts your final chargeable weight. The most common divisor is 6000 (IATA standard), used by most airlines, FedEx, UPS, and TNT. DHL Express uses a divisor of 5000, which results in 20% higher volumetric weight compared to the IATA standard.

For example, a package measuring 100cm × 80cm × 60cm has a volume of 480,000 cubic centimeters. Using the IATA divisor of 6000, the volumetric weight would be 80 kg. Using DHL's divisor of 5000, it would be 96 kg - a significant difference. Road freight typically uses a divisor of 3000, making volumetric weight even higher for LTL shipments. Sea freight uses a different approach: 1 CBM (cubic meter) equals 1000 kg chargeable weight. Understanding these differences allows shippers to choose carriers strategically based on their cargo characteristics. Dense, heavy cargo benefits from carriers with lower divisors, while lightweight cargo should avoid carriers with aggressive volumetric calculations.`
  },
  {
    question: "What is the 'whichever is greater' rule?",
    answer: `The "whichever is greater" rule is the fundamental principle behind chargeable weight calculations. It states that the chargeable weight will always be the higher of two values: the actual (gross) weight of your shipment, or the volumetric (dimensional) weight. This rule protects carriers from losing revenue on large, lightweight shipments while ensuring dense cargo is charged fairly based on its actual weight.

Consider a practical example: You're shipping electronic components that weigh 45 kg in a box measuring 60cm × 50cm × 40cm. The volumetric weight using IATA 6000 divisor is (60×50×40)÷6000 = 20 kg. Since the actual weight (45 kg) is greater than the volumetric weight (20 kg), the chargeable weight is 45 kg. Now imagine shipping pillows in the same size box weighing only 10 kg. The volumetric weight is still 20 kg, but now it's greater than the actual weight, so you pay for 20 kg - twice the actual weight!

This rule incentivizes efficient packaging. If your volumetric weight consistently exceeds actual weight, you're essentially paying for air. Strategies like vacuum sealing, removing unnecessary packaging, and consolidating shipments can help reduce this gap and lower your shipping costs significantly.`
  },
  {
    question: "How does chargeable weight differ by transport mode?",
    answer: `Each transport mode applies chargeable weight differently, reflecting the unique economics of air, sea, and road freight. Air freight is the most sensitive to volumetric weight due to aircraft weight and balance constraints. Airlines use the IATA standard divisor of 6000, and even small, lightweight packages can incur significant costs if they're bulky. Air freight is ideal for dense cargo with high value-to-weight ratios, such as electronics, pharmaceuticals, and emergency parts.

Sea freight operates on a different principle entirely. For LCL (Less than Container Load) shipments, the chargeable unit is CBM (cubic meter), with a conversion of 1 CBM = 1000 kg. This makes sea freight extremely cost-effective for large, lightweight shipments that would be prohibitively expensive by air. However, if your cargo exceeds 1000 kg per CBM, you'll be charged by weight instead. Sea freight is the best choice for bulky items like furniture, construction materials, and any cargo where transit time is not critical.

Road freight (LTL) typically uses a divisor of 3000, which is more aggressive than air freight. This reflects the limited space in trucks and the importance of pallet optimization. Road freight also introduces the concept of "stackability" - non-stackable freight occupies more vertical space and may incur additional charges. For regional shipments, road freight often provides the best balance of cost and speed for medium-density cargo.`
  },
  {
    question: "What strategies can minimize my chargeable weight?",
    answer: `Reducing chargeable weight is one of the most effective ways to lower shipping costs, and several proven strategies can help. The first approach is packaging optimization: use the smallest possible boxes that still protect your goods, remove excess void fill and cushioning materials, and consider custom packaging for high-volume products. Even a 10% reduction in each dimension can result in a 27% reduction in volume and volumetric weight.

Product consolidation is another powerful strategy. Instead of shipping multiple small packages, combine them into one larger shipment. This improves space utilization and may qualify you for volume discounts. Many freight forwarders offer consolidation services where your goods are combined with other shippers' cargo heading to the same destination. For regular shipments, consider implementing vacuum sealing or compression techniques for applicable products like textiles, foam, or soft goods.

Mode selection is equally important. Low-density cargo (below 167 kg/m³ for IATA standard) should typically go by sea freight unless speed is critical. High-density cargo can take advantage of air freight's speed without volumetric penalties. Finally, work with your suppliers on packaging - receiving goods in export-ready packaging can eliminate the need for repackaging and reduce dimensions before the first leg of transport.`
  },
  {
    question: "How does chargeable weight impact freight costs?",
    answer: `Chargeable weight directly determines your base freight charges, but the impact extends beyond just the per-kilogram rate. Understanding the full cost implications helps you make better shipping decisions and avoid budget surprises. The base freight charge is calculated as: Chargeable Weight × Rate per kg. For a shipment with 100 kg chargeable weight at $3.50/kg, the base cost is $350. But freight invoices include additional charges that also scale with chargeable weight.

Fuel surcharges (FSC) are typically calculated as a percentage of base freight or as a per-kilogram charge. With current rates around 15-25% of base freight, a $350 shipment could add $52-87 in fuel costs. Security surcharges (SSC) are usually a fixed rate per kilogram, often $0.25-0.50/kg. For 100 kg, that's another $25-50. Some carriers also apply handling fees, documentation charges, and pickup/delivery fees that may reference chargeable weight.

The cumulative impact can be substantial. If your cargo is volumetric, you might be paying for 150 kg when you only have 100 kg of actual goods. At $3.50/kg base rate with typical surcharges, that 50 kg "air" costs you around $200 per shipment. Over a year of regular shipments, inefficient packaging can waste thousands of dollars. This is why understanding and optimizing chargeable weight should be a priority for any business that ships regularly.`
  },
  {
    question: "What is density and how does it affect shipping mode selection?",
    answer: `Cargo density is the relationship between weight and volume, typically expressed in kilograms per cubic meter (kg/m³). It's calculated by dividing the actual weight by the volume: Density = Actual Weight ÷ Volume (CBM). Density is the key factor in determining whether your cargo will be charged by actual weight or volumetric weight, and it significantly influences optimal mode selection.

The density threshold for IATA standard (6000 divisor) is approximately 167 kg/m³. Cargo denser than this will typically be charged by actual weight; lighter cargo will be charged by volumetric weight. Very light cargo (0-50 kg/m³) like foam products, empty containers, or inflated items should almost always go by sea freight. Light cargo (50-167 kg/m³) requires careful analysis - compare total costs including transit time value. Medium density cargo (167-300 kg/m³) is suitable for air freight with competitive pricing. Dense cargo (300-500 kg/m³) is ideal for air freight - you'll pay actual weight rates. Very dense cargo (500+ kg/m³) gets excellent air freight rates.

For mode selection, consider both density and urgency. Sea freight is typically 90-95% cheaper than air freight for the same volume, but takes 20-45 days versus 3-7 days. Road freight falls in between, offering moderate costs and transit times for regional shipments. Use the density analysis to narrow your options, then factor in delivery requirements, product value, and cash flow implications to make the final decision.`
  }
];

interface ChargeableWeightResult {
  volumetricWeight: number;
  actualWeightKg: number;
  chargeableWeight: number;
  isVolumetric: boolean;
  volumeCBM: number;
  density: number;
  densityClass: typeof densityClasses[0];
  weightRatio: number;
  optimizationPotential: number;
}

interface CarrierComparison {
  carrier: string;
  divisor: number;
  volumetricWeight: number;
  chargeableWeight: number;
  costPerKg: number;
  totalCost: number;
  color: string;
}

interface ModeComparison {
  mode: string;
  name: string;
  chargeableWeight: number;
  rate: number;
  totalCost: number;
  transitDays: string;
  icon: typeof Plane;
  color: string;
}

export function ChargeableWeightLogic() {
  const [length, setLength] = useState<string>("100");
  const [width, setWidth] = useState<string>("80");
  const [height, setHeight] = useState<string>("60");
  const [unit, setUnit] = useState<keyof typeof lengthUnits>("cm");
  const [actualWeight, setActualWeight] = useState<string>("25");
  const [weightUnit, setWeightUnit] = useState<string>("kg");
  const [selectedCarrier, setSelectedCarrier] = useState<string>("iata");
  const [ratePerKg, setRatePerKg] = useState<string>("3.50");
  const [quantity, setQuantity] = useState<string>("1");
  const [compareAllCarriers, setCompareAllCarriers] = useState(true);
  const [showModeComparison, setShowModeComparison] = useState(true);

  // Calculate results
  const result = useMemo<ChargeableWeightResult>(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const qty = parseInt(quantity) || 1;
    const divisor = carrierDivisors[selectedCarrier as keyof typeof carrierDivisors]?.divisor || 6000;
    
    // Convert to cm
    let lCm = l;
    let wCm = w;
    let hCm = h;
    
    if (unit === "m") {
      lCm = l * 100;
      wCm = w * 100;
      hCm = h * 100;
    } else if (unit === "in") {
      lCm = l * 2.54;
      wCm = w * 2.54;
      hCm = h * 2.54;
    } else if (unit === "ft") {
      lCm = l * 30.48;
      wCm = w * 30.48;
      hCm = h * 30.48;
    }
    
    // Calculate volume in CBM
    const volumeCBM = (lCm * wCm * hCm * qty) / 1000000;
    
    // Volumetric weight
    const volumetricWeight = (lCm * wCm * hCm * qty) / divisor;
    
    // Actual weight in kg
    const aw = parseFloat(actualWeight) || 0;
    const actualWeightKg = weightUnit === "lb" ? aw * 0.453592 : weightUnit === "t" ? aw * 1000 : aw;
    
    // Chargeable weight
    const chargeableWeight = Math.max(volumetricWeight, actualWeightKg);
    const isVolumetric = volumetricWeight > actualWeightKg;
    
    // Density (kg per CBM)
    const density = volumeCBM > 0 ? actualWeightKg / volumeCBM : 0;
    
    // Density class
    const densityClass = densityClasses.find(d => density >= d.min && density < d.max) || densityClasses[0];
    
    // Weight ratio (actual to volumetric)
    const weightRatio = volumetricWeight > 0 ? (actualWeightKg / volumetricWeight) * 100 : 100;
    
    // Optimization potential (how much could be saved)
    const optimizationPotential = isVolumetric ? volumetricWeight - actualWeightKg : 0;
    
    return {
      volumetricWeight,
      actualWeightKg,
      chargeableWeight,
      isVolumetric,
      volumeCBM,
      density,
      densityClass,
      weightRatio,
      optimizationPotential,
    };
  }, [length, width, height, unit, actualWeight, weightUnit, selectedCarrier, quantity]);

  // Carrier comparison
  const carrierComparison = useMemo<CarrierComparison[]>(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    const qty = parseInt(quantity) || 1;
    const rate = parseFloat(ratePerKg) || 3.50;
    
    // Convert to cm
    let lCm = l;
    let wCm = w;
    let hCm = h;
    
    if (unit === "m") {
      lCm = l * 100;
      wCm = w * 100;
      hCm = h * 100;
    } else if (unit === "in") {
      lCm = l * 2.54;
      wCm = w * 2.54;
      hCm = h * 2.54;
    } else if (unit === "ft") {
      lCm = l * 30.48;
      wCm = w * 30.48;
      hCm = h * 30.48;
    }
    
    return Object.entries(carrierDivisors).map(([key, carrier]) => {
      const vw = (lCm * wCm * hCm * qty) / carrier.divisor;
      const cw = Math.max(vw, result.actualWeightKg);
      return {
        carrier: carrier.name,
        divisor: carrier.divisor,
        volumetricWeight: vw,
        chargeableWeight: cw,
        costPerKg: rate,
        totalCost: cw * rate,
        color: carrier.color,
      };
    });
  }, [length, width, height, unit, quantity, result.actualWeightKg, ratePerKg]);

  // Mode comparison
  const modeComparison = useMemo<ModeComparison[]>(() => {
    return Object.entries(modeCosts).map(([key, mode]) => {
      // Sea freight uses CBM, not volumetric weight
      let cw: number;
      if (key === "sea") {
        // For sea, charge by CBM, converted to weight equivalent
        cw = result.volumeCBM * 1000; // 1 CBM = 1000 kg
        cw = Math.max(cw, result.actualWeightKg);
      } else if (key === "road") {
        // Road uses volumetric with different divisor
        const l = parseFloat(length) || 0;
        const w = parseFloat(width) || 0;
        const h = parseFloat(height) || 0;
        const qty = parseInt(quantity) || 1;
        
        let lCm = l, wCm = w, hCm = h;
        if (unit === "m") { lCm *= 100; wCm *= 100; hCm *= 100; }
        else if (unit === "in") { lCm *= 2.54; wCm *= 2.54; hCm *= 2.54; }
        else if (unit === "ft") { lCm *= 30.48; wCm *= 30.48; hCm *= 30.48; }
        
        const vw = (lCm * wCm * hCm * qty) / 3000; // Road uses 3000 divisor
        cw = Math.max(vw, result.actualWeightKg);
      } else {
        cw = result.chargeableWeight;
      }
      
      return {
        mode: key,
        name: mode.name,
        chargeableWeight: cw,
        rate: mode.rate,
        totalCost: cw * mode.rate,
        transitDays: mode.transitDays,
        icon: mode.icon,
        color: mode.color,
      };
    });
  }, [length, width, height, unit, quantity, result, selectedCarrier]);

  // Optimization suggestions
  const optimizationSuggestions = useMemo(() => {
    const suggestions: { title: string; description: string; impact: string; icon: typeof Box }[] = [];
    
    if (result.isVolumetric) {
      const reductionNeeded = result.volumetricWeight - result.actualWeightKg;
      const percentageReduction = (reductionNeeded / result.volumetricWeight) * 100;
      
      suggestions.push({
        title: "Reduce Package Dimensions",
        description: `Reduce volume by ${percentageReduction.toFixed(1)}% to lower chargeable weight`,
        impact: `Save up to $${(reductionNeeded * parseFloat(ratePerKg)).toFixed(2)}`,
        icon: Package,
      });
      
      suggestions.push({
        title: "Use Denser Packaging",
        description: "Compress items or use vacuum sealing for applicable products",
        impact: "Potentially reduce to actual weight pricing",
        icon: Box,
      });
      
      suggestions.push({
        title: "Consider Sea Freight",
        description: "For large volumes, sea freight may be more economical",
        impact: `Save up to $${(modeComparison.find(m => m.mode === "sea")?.totalCost ? result.chargeableWeight * parseFloat(ratePerKg) - (modeComparison.find(m => m.mode === "sea")?.totalCost || 0) : 0).toFixed(2)}`,
        icon: Ship,
      });
      
      if (result.density < 150) {
        suggestions.push({
          title: "Consolidate Shipments",
          description: "Combine multiple small shipments into one to optimize space",
          impact: "Better container/aircraft utilization",
          icon: TrendingDown,
        });
      }
    } else {
      suggestions.push({
        title: "Good Density Ratio",
        description: "Your cargo is charged by actual weight - optimal for air freight",
        impact: "No optimization needed",
        icon: CheckCircle2,
      });
    }
    
    return suggestions;
  }, [result, ratePerKg, modeComparison]);

  // Cost breakdown data
  const costBreakdownData = useMemo(() => {
    const rate = parseFloat(ratePerKg) || 3.50;
    return [
      { name: "Base Freight", value: result.chargeableWeight * rate, color: "#0F4C81" },
      { name: "Fuel Surcharge", value: result.chargeableWeight * rate * 0.15, color: "#F59E0B" },
      { name: "Security Surcharge", value: result.chargeableWeight * 0.25, color: "#2E8B57" },
      { name: "Handling Fee", value: 25, color: "#8B5CF6" },
    ];
  }, [result.chargeableWeight, ratePerKg]);

  // Weight comparison chart data
  const weightComparisonData = useMemo(() => {
    return [
      { name: "Actual Weight", value: result.actualWeightKg, fill: result.isVolumetric ? "#94A3B8" : "#2E8B57" },
      { name: "Volumetric Weight", value: result.volumetricWeight, fill: result.isVolumetric ? "#F59E0B" : "#94A3B8" },
      { name: "Chargeable Weight", value: result.chargeableWeight, fill: "#0F4C81" },
    ];
  }, [result]);

  // Cost impact scenario data
  const costImpactData = useMemo(() => {
    const rate = parseFloat(ratePerKg) || 3.50;
    return [
      { 
        scenario: "Current", 
        chargeableWeight: result.chargeableWeight, 
        cost: result.chargeableWeight * rate,
        savings: 0 
      },
      { 
        scenario: "10% Smaller", 
        chargeableWeight: Math.max(result.volumetricWeight * 0.729, result.actualWeightKg), 
        cost: Math.max(result.volumetricWeight * 0.729, result.actualWeightKg) * rate,
        savings: (result.chargeableWeight - Math.max(result.volumetricWeight * 0.729, result.actualWeightKg)) * rate
      },
      { 
        scenario: "20% Smaller", 
        chargeableWeight: Math.max(result.volumetricWeight * 0.512, result.actualWeightKg), 
        cost: Math.max(result.volumetricWeight * 0.512, result.actualWeightKg) * rate,
        savings: (result.chargeableWeight - Math.max(result.volumetricWeight * 0.512, result.actualWeightKg)) * rate
      },
      { 
        scenario: "30% Smaller", 
        chargeableWeight: Math.max(result.volumetricWeight * 0.343, result.actualWeightKg), 
        cost: Math.max(result.volumetricWeight * 0.343, result.actualWeightKg) * rate,
        savings: (result.chargeableWeight - Math.max(result.volumetricWeight * 0.343, result.actualWeightKg)) * rate
      },
    ];
  }, [result, ratePerKg]);

  // Density trend data
  const densityTrendData = useMemo(() => {
    return densityClasses.map(dc => ({
      name: dc.label,
      range: dc.max === Infinity ? `${dc.min}+` : `${dc.min}-${dc.max}`,
      density: dc.min + (dc.max === Infinity ? 100 : (dc.max - dc.min) / 2),
      color: dc.color,
      isCurrent: dc.label === result.densityClass.label,
    }));
  }, [result.densityClass]);

  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      input: {
        dimensions: { length, width, height, unit },
        actualWeight: { value: actualWeight, unit: weightUnit },
        quantity,
        carrier: selectedCarrier,
        ratePerKg,
      },
      results: {
        ...result,
        densityClass: result.densityClass.label,
      },
      carrierComparison: carrierComparison.map(c => ({
        carrier: c.carrier,
        chargeableWeight: c.chargeableWeight.toFixed(2),
        cost: c.totalCost.toFixed(2),
      })),
      modeComparison: modeComparison.map(m => ({
        mode: m.name,
        chargeableWeight: m.chargeableWeight.toFixed(2),
        cost: m.totalCost.toFixed(2),
        transitDays: m.transitDays,
      })),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chargeable-weight-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareText = `Chargeable Weight Calculator Results:
    
📦 Dimensions: ${length} × ${width} × ${height} ${unit}
⚖️ Actual Weight: ${actualWeight} ${weightUnit}
📊 Chargeable Weight: ${result.chargeableWeight.toFixed(2)} kg
💰 Estimated Cost: $${(result.chargeableWeight * parseFloat(ratePerKg)).toFixed(2)}
📏 Density: ${result.density.toFixed(1)} kg/m³ (${result.densityClass.label})

Calculated at Shiportrade.com`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chargeable Weight Calculation',
          text: shareText,
        });
      } catch {
        await navigator.clipboard.writeText(shareText);
      }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)] via-[#1a5a9e] to-[var(--logistics)] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              Freight Cost Optimization
            </Badge>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Chargeable Weight Calculator
            </h1>
            <p className="text-white/80 max-w-2xl text-lg mb-6">
              Calculate the weight used by carriers to determine your shipping costs. 
              Compare actual vs volumetric weight and optimize your freight expenses.
            </p>
          </motion.div>
          
          {/* Key Metrics Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Actual Weight</div>
                    <div className="text-2xl font-bold">{result.actualWeightKg.toFixed(2)} kg</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Box className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Volumetric Weight</div>
                    <div className="text-2xl font-bold">{result.volumetricWeight.toFixed(2)} kg</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/15 backdrop-blur-sm border-white/30 ring-2 ring-white/40">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70">Chargeable Weight</div>
                    <div className="text-2xl font-bold">{result.chargeableWeight.toFixed(2)} kg</div>
                    <Badge variant="secondary" className={`text-xs mt-1 ${result.isVolumetric ? 'bg-amber-500 text-white' : 'bg-[var(--logistics)] text-white'}`}>
                      {result.isVolumetric ? 'Volumetric' : 'Actual'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 5-Tab Interface */}
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="calculator" className="gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="modes" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">Mode Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="divisors" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Carrier Divisors</span>
          </TabsTrigger>
          <TabsTrigger value="cost" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Cost Impact</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-[var(--ocean)]/20 bg-gradient-to-r from-[var(--ocean)]/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <Info className="h-5 w-5" />
                What is Chargeable Weight?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                <strong>Chargeable weight</strong> is the weight used by carriers to calculate shipping costs. It is determined by the "whichever is greater" rule - the higher value between actual weight (gross weight on a scale) and volumetric weight (dimensional weight calculated from package dimensions). This pricing method ensures carriers are fairly compensated for the space cargo occupies in their vehicles, aircraft, or vessels.
              </p>
              <p className="text-muted-foreground mt-3">
                The concept is essential in logistics because large, lightweight packages (like pillows or foam products) occupy significant space while weighing little, whereas small, dense packages (like machinery parts) occupy minimal space. Without volumetric pricing, carriers would lose revenue on bulky shipments. Understanding chargeable weight helps you optimize packaging, compare shipping modes accurately, and avoid unexpected costs on freight invoices.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm mt-4">
                <div className="text-[var(--ocean)] font-semibold mb-2">Formula:</div>
                <div>Chargeable Weight = Max(Actual Weight, Volumetric Weight)</div>
                <div className="mt-2 text-muted-foreground">
                  Volumetric Weight = (L × W × H) ÷ Divisor
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--ocean)]" />
                    Package Details
                  </CardTitle>
                  <CardDescription>
                    Enter dimensions and weight to calculate chargeable weight
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Dimension Inputs */}
                  <div className="space-y-4">
                    <Label>Dimensions</Label>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="length" className="text-xs text-muted-foreground">Length</Label>
                        <Input
                          id="length"
                          type="number"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="width" className="text-xs text-muted-foreground">Width</Label>
                        <Input
                          id="width"
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height" className="text-xs text-muted-foreground">Height</Label>
                        <Input
                          id="height"
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Unit</Label>
                        <Select value={unit} onValueChange={(v) => setUnit(v as keyof typeof lengthUnits)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="m">m</SelectItem>
                            <SelectItem value="in">inches</SelectItem>
                            <SelectItem value="ft">feet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Actual Weight */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="actualWeight">Actual Weight</Label>
                      <Input
                        id="actualWeight"
                        type="number"
                        value={actualWeight}
                        onChange={(e) => setActualWeight(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight Unit</Label>
                      <Select value={weightUnit} onValueChange={setWeightUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="lb">lb</SelectItem>
                          <SelectItem value="t">Metric Ton</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Number of Packages</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  {/* Carrier Selection */}
                  <div className="space-y-2">
                    <Label>Carrier Divisor</Label>
                    <Select value={selectedCarrier} onValueChange={setSelectedCarrier}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(carrierDivisors).map(([key, carrier]) => (
                          <SelectItem key={key} value={key}>
                            {carrier.name} ({carrier.divisor})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {carrierDivisors[selectedCarrier as keyof typeof carrierDivisors]?.description}
                    </p>
                  </div>

                  {/* Rate Input */}
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate per kg (USD)</Label>
                    <Input
                      id="rate"
                      type="number"
                      step="0.01"
                      value={ratePerKg}
                      onChange={(e) => setRatePerKg(e.target.value)}
                    />
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="compareCarriers" className="text-sm">Compare all carriers</Label>
                      <Switch
                        id="compareCarriers"
                        checked={compareAllCarriers}
                        onCheckedChange={setCompareAllCarriers}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showModes" className="text-sm">Compare transport modes</Label>
                      <Switch
                        id="showModes"
                        checked={showModeComparison}
                        onCheckedChange={setShowModeComparison}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Main Result */}
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center justify-between">
                    <span>Chargeable Weight</span>
                    <Badge className={result.isVolumetric ? "bg-amber-500" : "bg-[var(--logistics)] text-white"}>
                      {result.isVolumetric ? "Volumetric" : "Actual"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    key={result.chargeableWeight}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center mb-6"
                  >
                    <div className="text-5xl font-bold text-[var(--ocean)]">
                      {result.chargeableWeight.toFixed(2)} kg
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Total cost: <span className="font-semibold text-foreground">${(result.chargeableWeight * parseFloat(ratePerKg)).toFixed(2)}</span>
                    </div>
                  </motion.div>

                  {/* Weight Comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className={`p-4 rounded-lg ${!result.isVolumetric ? 'bg-[var(--logistics)]/10 border border-[var(--logistics)]/30' : 'bg-muted/30'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Scale className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">Actual Weight</span>
                        {!result.isVolumetric && <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] ml-auto" />}
                      </div>
                      <div className="text-xl font-semibold">{result.actualWeightKg.toFixed(2)} kg</div>
                    </div>
                    <div className={`p-4 rounded-lg ${result.isVolumetric ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-muted/30'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Box className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">Volumetric Weight</span>
                        {result.isVolumetric && <AlertTriangle className="h-4 w-4 text-amber-500 ml-auto" />}
                      </div>
                      <div className="text-xl font-semibold">{result.volumetricWeight.toFixed(2)} kg</div>
                    </div>
                  </div>

                  {result.isVolumetric && (
                    <div className="p-3 bg-amber-500/10 rounded-lg text-sm text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      Paying for {result.weightRatio.toFixed(1)}% of actual weight due to volume.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground mb-1">Volume</div>
                    <div className="text-xl font-semibold">{result.volumeCBM.toFixed(4)} m³</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground mb-1">Density</div>
                    <div className="text-xl font-semibold">{result.density.toFixed(1)} kg/m³</div>
                    <Badge 
                      style={{ backgroundColor: result.densityClass.color }} 
                      className="text-white text-xs mt-1"
                    >
                      {result.densityClass.label}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Weight Comparison Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                    Weight Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weightComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis type="category" dataKey="name" width={120} className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {weightComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Mode Comparison */}
        <TabsContent value="modes" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-[var(--logistics)]/20 bg-gradient-to-r from-[var(--logistics)]/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--logistics)]">
                <ArrowUpDown className="h-5 w-5" />
                How Chargeable Weight Differs by Transport Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Each transport mode applies chargeable weight differently, reflecting unique operational constraints and economics. <strong>Air freight</strong> is most sensitive to volumetric weight due to aircraft weight and balance constraints, using the IATA standard divisor of 6000. Small, lightweight packages can incur significant costs if bulky, making air ideal for dense, high-value cargo like electronics and pharmaceuticals.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Sea freight</strong> operates on a different principle entirely. For LCL shipments, the chargeable unit is CBM (cubic meter), with 1 CBM equal to 1000 kg chargeable weight. This makes sea freight extremely cost-effective for large, lightweight shipments that would be prohibitively expensive by air. <strong>Road freight</strong> (LTL) typically uses a divisor of 3000, more aggressive than air freight, reflecting limited truck space and pallet optimization importance.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-[var(--ocean)]" />
                Transport Mode Comparison
              </CardTitle>
              <CardDescription>
                Compare costs across different shipping modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {modeComparison.map((mode) => {
                  const Icon = mode.icon;
                  const isCheapest = mode.totalCost === Math.min(...modeComparison.map(m => m.totalCost));
                  return (
                    <Card 
                      key={mode.mode} 
                      className={`relative ${isCheapest ? 'border-[var(--logistics)] border-2' : ''}`}
                    >
                      {isCheapest && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-[var(--logistics)] text-white">Best Value</Badge>
                        </div>
                      )}
                      <CardContent className="pt-6 text-center">
                        <Icon className="h-8 w-8 mx-auto mb-2" style={{ color: mode.color }} />
                        <div className="font-semibold">{mode.name}</div>
                        <div className="text-2xl font-bold mt-2" style={{ color: mode.color }}>
                          ${mode.totalCost.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {mode.chargeableWeight.toFixed(2)} kg @ ${mode.rate}/kg
                        </div>
                        <Separator className="my-3" />
                        <div className="text-xs text-muted-foreground">
                          Transit: {mode.transitDays} days
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Mode Comparison Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modeComparison}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" label={{ value: 'USD', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                  />
                  <Bar dataKey="totalCost" name="Total Cost" radius={[4, 4, 0, 0]}>
                    {modeComparison.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Mode Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-[var(--ocean)]/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-[var(--ocean)]" />
                  <CardTitle className="text-base">Air Freight</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Divisor:</strong> 6000 (IATA)</div>
                <div><strong>Best for:</strong> Dense cargo, urgent shipments</div>
                <div><strong>Transit:</strong> 3-7 days</div>
                <div className="text-muted-foreground">Ideal for electronics, pharmaceuticals, documents, and high-value goods.</div>
              </CardContent>
            </Card>
            
            <Card className="border-[var(--logistics)]/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-[var(--logistics)]" />
                  <CardTitle className="text-base">Sea Freight</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Formula:</strong> 1 CBM = 1000 kg</div>
                <div><strong>Best for:</strong> Large, lightweight cargo</div>
                <div><strong>Transit:</strong> 20-45 days</div>
                <div className="text-muted-foreground">Most economical for furniture, construction materials, bulk goods.</div>
              </CardContent>
            </Card>
            
            <Card className="border-amber-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base">Road Freight</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div><strong>Divisor:</strong> 3000</div>
                <div><strong>Best for:</strong> Regional shipments</div>
                <div><strong>Transit:</strong> 5-14 days</div>
                <div className="text-muted-foreground">Good balance for medium-distance, medium-density cargo.</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Carrier Divisors */}
        <TabsContent value="divisors" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-600">
                <BarChart3 className="h-5 w-5" />
                Understanding Carrier Divisors
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                The divisor is the critical number that determines how volume converts to weight in chargeable weight calculations. The formula is simple: Volumetric Weight = (L × W × H) ÷ Divisor. However, the divisor varies significantly between carriers, and understanding these differences can lead to substantial cost savings.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>A lower divisor results in higher volumetric weight</strong>. DHL Express uses a divisor of 5000, which produces 20% higher volumetric weight compared to the IATA standard of 6000 used by FedEx, UPS, TNT, and most airlines. For a package measuring 100×80×60 cm, the volumetric weight would be 80 kg with IATA but 96 kg with DHL - a significant difference on large shipments.
              </p>
              <p className="text-muted-foreground mt-3">
                Sea freight uses a different approach: 1 CBM equals 1000 kg chargeable weight. Road freight (LTL) often uses 3000 as the divisor, making volumetric calculations even more aggressive. Always verify the divisor with your carrier before finalizing shipping arrangements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-[var(--ocean)]" />
                Carrier Divisor Comparison
              </CardTitle>
              <CardDescription>
                See how different carriers calculate volumetric weight with their divisors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Carrier</th>
                      <th className="text-center py-3 px-4">Divisor</th>
                      <th className="text-center py-3 px-4">Volumetric Weight</th>
                      <th className="text-center py-3 px-4">Chargeable Weight</th>
                      <th className="text-right py-3 px-4">Cost (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrierComparison.map((carrier, index) => (
                      <motion.tr
                        key={carrier.carrier}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-border/50 ${carrier.carrier === carrierDivisors[selectedCarrier as keyof typeof carrierDivisors]?.name ? 'bg-[var(--ocean)]/5' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: carrier.color }}
                            />
                            {carrier.carrier}
                            {carrier.carrier === carrierDivisors[selectedCarrier as keyof typeof carrierDivisors]?.name && (
                              <Badge variant="outline" className="text-xs">Selected</Badge>
                            )}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4 font-mono">{carrier.divisor}</td>
                        <td className="text-center py-3 px-4 font-mono">{carrier.volumetricWeight.toFixed(2)} kg</td>
                        <td className="text-center py-3 px-4 font-mono font-semibold">{carrier.chargeableWeight.toFixed(2)} kg</td>
                        <td className="text-right py-3 px-4 font-semibold">${carrier.totalCost.toFixed(2)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Chart */}
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={carrierComparison.filter(c => c.divisor < 100000)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="carrier" className="text-xs" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" className="text-xs" label={{ value: 'kg', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" label={{ value: 'USD', angle: 90, position: 'insideRight' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="chargeableWeight" name="Chargeable Weight (kg)" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="totalCost" name="Cost (USD)" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Carrier Divisor Reference Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--ocean)]" />
                Carrier Divisor Reference Table
              </CardTitle>
              <CardDescription>
                Complete reference for carrier divisors and their formulas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Carrier</th>
                      <th className="text-center py-3 px-4">Divisor</th>
                      <th className="text-left py-3 px-4">Formula</th>
                      <th className="text-left py-3 px-4">Notes</th>
                      <th className="text-center py-3 px-4">Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrierDivisorReference.map((row, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{row.carrier}</td>
                        <td className="py-3 px-4 text-center font-mono">{row.divisor}</td>
                        <td className="py-3 px-4 font-mono text-muted-foreground">{row.formula}</td>
                        <td className="py-3 px-4 text-muted-foreground">{row.notes}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant="outline">{row.region}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Cost Impact */}
        <TabsContent value="cost" className="space-y-6 mt-6">
          {/* Educational Content */}
          <Card className="border-[var(--ocean)]/20 bg-gradient-to-r from-[var(--ocean)]/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <DollarSign className="h-5 w-5" />
                Impact on Freight Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Chargeable weight directly determines your base freight charges, but the impact extends beyond just the per-kilogram rate. The base freight charge is calculated as: Chargeable Weight × Rate per kg. For a shipment with 100 kg chargeable weight at $3.50/kg, the base cost is $350. However, freight invoices include additional charges that also scale with chargeable weight.
              </p>
              <p className="text-muted-foreground mt-3">
                Fuel surcharges (FSC) are typically calculated as a percentage of base freight, currently around 15-25%. Security surcharges (SSC) are usually a fixed rate per kilogram, often $0.25-0.50/kg. Handling fees, documentation charges, and pickup/delivery fees may also reference chargeable weight. If your cargo is volumetric, you might be paying for 150 kg when you only have 100 kg of actual goods - that extra 50 kg of "air" costs real money.
              </p>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                Air Freight Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {costBreakdownData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-semibold">${item.value.toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[var(--ocean)]">${costBreakdownData.reduce((sum, item) => sum + item.value, 0).toFixed(2)}</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPie>
                    <Pie
                      data={costBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {costBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Cost Impact Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Packaging Optimization Scenarios
              </CardTitle>
              <CardDescription>
                See how reducing package size impacts your costs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={costImpactData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="scenario" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    name="Total Cost ($)" 
                    stroke="#0F4C81" 
                    fill="#0F4C81" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              <div className="grid grid-cols-4 gap-4 mt-6">
                {costImpactData.map((scenario, index) => (
                  <div 
                    key={scenario.scenario} 
                    className={`p-4 rounded-lg text-center ${index === 0 ? 'bg-muted/50' : 'bg-[var(--logistics)]/10 border border-[var(--logistics)]/30'}`}
                  >
                    <div className="font-semibold mb-1">{scenario.scenario}</div>
                    <div className="text-lg font-bold text-[var(--ocean)]">${scenario.cost.toFixed(2)}</div>
                    {scenario.savings > 0 && (
                      <div className="text-sm text-[var(--logistics)] font-medium">
                        Save ${scenario.savings.toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-[var(--logistics)]" />
                Strategies to Minimize Chargeable Weight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {optimizationSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <motion.div
                      key={suggestion.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[var(--logistics)]/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-5 w-5 text-[var(--logistics)]" />
                            </div>
                            <div>
                              <div className="font-semibold">{suggestion.title}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {suggestion.description}
                              </div>
                              <div className="text-sm font-medium text-[var(--logistics)] mt-2">
                                {suggestion.impact}
                              </div>
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

          {/* Density Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--ocean)]" />
                Density Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Your cargo density</span>
                  <span className="font-semibold">{result.density.toFixed(1)} kg/m³</span>
                </div>
                <Progress value={Math.min(result.density / 10, 100)} className="h-3" />
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium">Density Classification</div>
                <div className="grid grid-cols-5 gap-2">
                  {densityClasses.map((dc) => (
                    <div
                      key={dc.label}
                      className={`p-3 rounded-lg text-center text-xs transition-all ${
                        dc.label === result.densityClass.label
                          ? 'ring-2 ring-offset-2 scale-105'
                          : ''
                      }`}
                      style={{ 
                        backgroundColor: dc.color + '20',
                        borderColor: dc.color,
                        borderWidth: 1,
                        borderStyle: 'solid' as const,
                        ...(dc.label === result.densityClass.label && { ringColor: dc.color })
                      }}
                    >
                      <div className="font-medium" style={{ color: dc.color }}>{dc.label}</div>
                      <div className="text-muted-foreground mt-1">
                        {dc.max === Infinity ? `${dc.min}+` : `${dc.min}-${dc.max}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[var(--logistics)]/30 bg-[var(--logistics)]/5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                  <span className="font-medium">Recommendation</span>
                </div>
                <p className="text-sm text-muted-foreground">{result.densityClass.recommendation}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card className="border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about chargeable weight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-start gap-3">
                        <Badge 
                          variant="outline" 
                          className="mt-1 h-6 w-6 rounded-full p-0 flex items-center justify-center"
                        >
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-10 pr-4">
                      <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
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

      {/* Action Buttons */}
      <Card className="border-[var(--ocean)]/20 bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExport} className="flex-1 gap-2 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1 gap-2 border-[var(--logistics)] text-[var(--logistics)] hover:bg-[var(--logistics)]/10">
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Button 
              variant="outline" 
              className="gap-2" 
              onClick={() => {
                setLength("100");
                setWidth("80");
                setHeight("60");
                setActualWeight("25");
                setQuantity("1");
                setUnit("cm");
                setWeightUnit("kg");
                setSelectedCarrier("iata");
                setRatePerKg("3.50");
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
