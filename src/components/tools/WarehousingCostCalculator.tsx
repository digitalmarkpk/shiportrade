"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Warehouse,
  Package,
  Calendar,
  DollarSign,
  Info,
  TrendingUp,
  Calculator,
  BoxSelect,
  Clock,
  RotateCcw,
  Download,
  Share2,
  BarChart3,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Zap,
  Building2,
  MapPin,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Target,
  Scale,
  ArrowRight,
  Settings,
  Thermometer,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Area,
} from "recharts";

interface WarehousingResult {
  palletPositions: number;
  palletRate: number;
  storageCost: number;
  handlingIn: number;
  handlingOut: number;
  pickPackCost: number;
  totalMonthly: number;
  costPerPallet: number;
  costPerCbm: number;
  totalCost: number;
  insuranceCost: number;
  adminCost: number;
}

// Sample warehousing rates by region (USD per pallet per month)
const warehouseRates: Record<string, { name: string; palletRate: number; handlingIn: number; handlingOut: number; pickPack: number; climateControl: number; bonded: number }> = {
  US_WEST: {
    name: "US West Coast (LA/LB)",
    palletRate: 18,
    handlingIn: 15,
    handlingOut: 18,
    pickPack: 2.5,
    climateControl: 8,
    bonded: 5,
  },
  US_EAST: {
    name: "US East Coast (NY/NJ)",
    palletRate: 22,
    handlingIn: 18,
    handlingOut: 20,
    pickPack: 3,
    climateControl: 10,
    bonded: 6,
  },
  US_CENTRAL: {
    name: "US Central (Chicago/Dallas)",
    palletRate: 16,
    handlingIn: 12,
    handlingOut: 15,
    pickPack: 2.25,
    climateControl: 7,
    bonded: 4,
  },
  EU_WEST: {
    name: "EU West (Rotterdam/Antwerp)",
    palletRate: 15,
    handlingIn: 12,
    handlingOut: 14,
    pickPack: 2.75,
    climateControl: 9,
    bonded: 5,
  },
  EU_CENTRAL: {
    name: "EU Central (Frankfurt)",
    palletRate: 18,
    handlingIn: 15,
    handlingOut: 16,
    pickPack: 3.25,
    climateControl: 11,
    bonded: 6,
  },
  UK: {
    name: "United Kingdom (London)",
    palletRate: 20,
    handlingIn: 16,
    handlingOut: 18,
    pickPack: 3.5,
    climateControl: 12,
    bonded: 7,
  },
  ASIA_HK: {
    name: "Asia (Hong Kong)",
    palletRate: 35,
    handlingIn: 25,
    handlingOut: 28,
    pickPack: 4,
    climateControl: 15,
    bonded: 8,
  },
  ASIA_SG: {
    name: "Asia (Singapore)",
    palletRate: 28,
    handlingIn: 20,
    handlingOut: 22,
    pickPack: 3.5,
    climateControl: 14,
    bonded: 7,
  },
  ASIA_CN: {
    name: "Asia (Shanghai/Shenzhen)",
    palletRate: 10,
    handlingIn: 8,
    handlingOut: 10,
    pickPack: 1.5,
    climateControl: 6,
    bonded: 3,
  },
  AU: {
    name: "Australia (Sydney/Melbourne)",
    palletRate: 25,
    handlingIn: 20,
    handlingOut: 22,
    pickPack: 3.75,
    climateControl: 13,
    bonded: 7,
  },
};

const palletDimensions = {
  standard: { name: "Standard (120×100 cm)", cbm: 0.96 },
  euro: { name: "Euro Pallet (120×80 cm)", cbm: 0.768 },
  us: { name: "US Pallet (48×40 in)", cbm: 0.87 },
};

const storageTypes = [
  { id: "standard", name: "Standard Dry Storage", icon: Warehouse, premium: 0 },
  { id: "climate", name: "Climate Controlled", icon: Thermometer, premium: 0.35 },
  { id: "bonded", name: "Bonded Warehouse", icon: Shield, premium: 0.15 },
  { id: "hazmat", name: "Hazardous Materials", icon: AlertTriangle, premium: 0.50 },
];

const FAQS = [
  {
    question: "What factors influence warehousing costs the most?",
    answer: "Warehousing costs are primarily driven by five key factors: location (urban areas and ports command premium rates), storage type (climate-controlled and bonded facilities cost more), volume and duration (larger volumes and longer commitments often qualify for discounts), handling requirements (special equipment or hazardous materials handling increases costs), and additional services like pick & pack, kitting, or returns processing. Location typically has the largest impact, with rates varying by 200-400% between regions like Asia and Western Europe or US coastal vs. inland facilities.",
  },
  {
    question: "How is pallet positioning calculated for different pallet types?",
    answer: "Pallet positioning calculates the floor space required based on pallet dimensions and stacking capability. Standard pallets (120×100cm) occupy 1.2 LDM (loading meters), Euro pallets (120×80cm) occupy 0.96 LDM, and US pallets (48×40in) occupy approximately 0.87 LDM equivalent. When cargo is stackable, you can effectively halve the pallet positions needed by utilizing vertical space. The formula is: Positions = Total Volume ÷ (Pallet CBM × Stacking Factor). Always account for 5-10% buffer space for aisle access and handling clearance.",
  },
  {
    question: "What are the hidden costs in warehousing beyond storage fees?",
    answer: "Beyond base storage rates, warehouses typically charge for: receiving/handling-in fees ($8-25 per pallet), dispatch/handling-out fees ($10-30 per pallet), pick & pack operations ($1.50-4.00 per item), inventory management system access ($50-200/month), insurance (0.1-0.5% of goods value monthly), minimum monthly charges, after-hours access fees, kitting and assembly services, returns processing, labeling and relabeling, and pallet exchange fees. Bonded warehouses add customs documentation fees, and climate-controlled facilities often have energy surcharges during extreme weather periods.",
  },
  {
    question: "When should I choose climate-controlled vs. standard storage?",
    answer: "Climate-controlled storage is essential for temperature-sensitive goods including: pharmaceuticals and medical devices (requires 15-25°C range), food and beverages (prevents spoilage and quality degradation), electronics and batteries (prevents moisture damage), artwork and antiques (humidity control), cosmetics and chemicals, and paper products. The 30-50% premium is justified by avoiding product loss. For general merchandise, metals, machinery, and non-perishable goods, standard dry storage is more cost-effective. Consider seasonal temperature variations in your decision - some goods may only need climate control during summer months.",
  },
  {
    question: "How do bonded warehouses work and when should I use them?",
    answer: "Bonded warehouses are secure facilities where imported goods can be stored without paying duties and taxes until they're released for domestic sale or re-exported. This provides significant cash flow advantages for importers - you defer 5-25% duty payments until goods are sold. Bonded storage is ideal for: goods with uncertain domestic demand (re-export avoids duties entirely), seasonal inventory build-up, goods pending customs clearance, duty drawback programs, and international distribution centers. The bonded premium (10-20% above standard rates) is often offset by duty deferral benefits and improved cash flow management.",
  },
  {
    question: "What contract terms should I negotiate with a warehouse provider?",
    answer: "Key contract terms to negotiate include: storage rates per pallet/CBM with volume discounts, minimum monthly commitments (avoid if possible), handling fee structures (per-pallet vs. per-shipment), free storage periods (often 5-15 days after receipt), termination clauses and notice periods, insurance requirements and liability limits, service level agreements (SLAs) for accuracy and turnaround times, access hours and after-hours charges, inventory reporting frequency and format, and escalation clauses for rate increases. Longer-term contracts (12+ months) typically secure 10-20% discounts but reduce flexibility. Always clarify liability for loss, damage, and theft before signing.",
  },
  {
    question: "How can I optimize my warehousing costs effectively?",
    answer: "Cost optimization strategies include: implementing inventory management systems to reduce overstocking, negotiating volume-based discounts for multiple locations, using cross-docking to minimize storage time for fast-moving goods, consolidating shipments to reduce handling frequency, optimizing packaging to maximize pallet density, utilizing stackable containers where possible, considering multi-client facilities for smaller volumes, implementing ABC analysis to prioritize fast-moving inventory placement, negotiating flexible space arrangements for seasonal fluctuations, and regularly auditing invoices against contracted rates. A 10-15% cost reduction is achievable through systematic optimization without compromising service levels.",
  },
];

const PRO_TIPS = [
  {
    title: "Negotiate Volume Discounts",
    description: "Warehouses typically offer 10-20% discounts for commitments above 100 pallets or 6+ month contracts. Always get tiered pricing quotes.",
    icon: DollarSign,
  },
  {
    title: "Optimize Pallet Utilization",
    description: "Maximize pallet density by optimizing carton sizes. A well-packed pallet can hold 20-30% more product at no additional storage cost.",
    icon: Package,
  },
  {
    title: "Consider Multi-Location Strategy",
    description: "Multiple smaller warehouses near customers can reduce last-mile delivery costs significantly, often offsetting higher storage rates.",
    icon: MapPin,
  },
  {
    title: "Audit Monthly Invoices",
    description: "Warehouse billing errors are common (5-10% of invoices). Regular audits catch overcharges for handling, storage days, and phantom pallets.",
    icon: Target,
  },
  {
    title: "Plan for Peak Seasons",
    description: "Secure storage commitments 3-6 months before peak seasons (Q4 for retail). Peak storage can cost 50-100% more and space availability is limited.",
    icon: Calendar,
  },
];

export function WarehousingCostCalculator() {
  const [volume, setVolume] = useState<string>("50");
  const [volumeUnit, setVolumeUnit] = useState<string>("cbm");
  const [storageMonths, setStorageMonths] = useState<string>("3");
  const [warehouseLocation, setWarehouseLocation] = useState<string>("US_WEST");
  const [palletType, setPalletType] = useState<string>("standard");
  const [includePickPack, setIncludePickPack] = useState(true);
  const [monthlyOrders, setMonthlyOrders] = useState<string>("100");
  const [itemsPerOrder, setItemsPerOrder] = useState<string>("3");
  const [stackable, setStackable] = useState(true);
  const [storageType, setStorageType] = useState<string>("standard");
  const [goodsValue, setGoodsValue] = useState<string>("50000");
  const [activeTab, setActiveTab] = useState("calculator");

  const selectedWarehouse = warehouseRates[warehouseLocation];
  const selectedPallet = palletDimensions[palletType as keyof typeof palletDimensions];
  const selectedStorageType = storageTypes.find(s => s.id === storageType) || storageTypes[0];

  const calculation = useMemo<WarehousingResult>(() => {
    const volumeValue = parseFloat(volume) || 0;
    const months = parseInt(storageMonths) || 1;
    const orders = parseInt(monthlyOrders) || 0;
    const items = parseInt(itemsPerOrder) || 1;
    const goodsVal = parseFloat(goodsValue) || 0;

    // Calculate pallet positions needed
    let cbmValue = volumeValue;
    if (volumeUnit === "pallets") {
      cbmValue = volumeValue * selectedPallet.cbm;
    }

    // Account for stacking (if stackable, can fit 2 pallets in same floor space)
    const effectiveCbmPerPallet = stackable ? selectedPallet.cbm * 2 : selectedPallet.cbm;
    const palletPositions = Math.ceil(cbmValue / effectiveCbmPerPallet);

    // Base storage rate with storage type premium
    const baseRate = selectedWarehouse.palletRate;
    const premiumRate = baseRate * (1 + selectedStorageType.premium);

    // Calculate costs
    const storageCost = palletPositions * premiumRate * months;
    const handlingIn = palletPositions * selectedWarehouse.handlingIn;
    const handlingOut = palletPositions * selectedWarehouse.handlingOut;
    const pickPackCost = includePickPack ? orders * items * selectedWarehouse.pickPack : 0;
    const insuranceCost = goodsVal * 0.002 * months; // 0.2% per month
    const adminCost = 50 + (palletPositions * 0.5); // Base admin + per-pallet fee

    const totalMonthly = (storageCost + handlingIn + handlingOut + pickPackCost + insuranceCost + adminCost) / months;
    const totalCost = storageCost + handlingIn + handlingOut + pickPackCost + insuranceCost + adminCost;
    const costPerPallet = totalMonthly / palletPositions;
    const costPerCbm = totalMonthly / cbmValue;

    return {
      palletPositions,
      palletRate: premiumRate,
      storageCost,
      handlingIn,
      handlingOut,
      pickPackCost,
      totalMonthly,
      costPerPallet,
      costPerCbm,
      totalCost,
      insuranceCost,
      adminCost,
    };
  }, [volume, volumeUnit, storageMonths, warehouseLocation, palletType, includePickPack, monthlyOrders, itemsPerOrder, stackable, selectedWarehouse, selectedPallet, storageType, goodsValue, selectedStorageType]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Chart data
  const costBreakdownData = [
    { name: "Storage", value: calculation.storageCost, fill: "#0F4C81" },
    { name: "Handling In", value: calculation.handlingIn, fill: "#2E8B57" },
    { name: "Handling Out", value: calculation.handlingOut, fill: "#3B82F6" },
    { name: "Pick & Pack", value: calculation.pickPackCost, fill: "#F59E0B" },
    { name: "Insurance", value: calculation.insuranceCost, fill: "#8B5CF6" },
    { name: "Admin", value: calculation.adminCost, fill: "#6B7280" },
  ].filter(item => item.value > 0);

  const locationComparisonData = Object.entries(warehouseRates)
    .map(([key, data]) => {
      const premiumRate = data.palletRate * (1 + selectedStorageType.premium);
      const monthlyCost = calculation.palletPositions * premiumRate;
      return {
        name: data.name.split("(")[0].trim(),
        fullLocation: data.name,
        rate: premiumRate,
        monthlyCost,
        code: key,
      };
    })
    .sort((a, b) => a.monthlyCost - b.monthlyCost);

  const monthlyCostData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthlyStorage = calculation.palletPositions * (selectedWarehouse.palletRate * (1 + selectedStorageType.premium));
    const cumulativeCost = monthlyStorage * month;
    return {
      month: `Month ${month}`,
      monthlyCost: monthlyStorage,
      cumulativeCost,
    };
  });

  const storageTypeComparisonData = storageTypes.map(type => {
    const rate = selectedWarehouse.palletRate * (1 + type.premium);
    const monthlyCost = calculation.palletPositions * rate;
    return {
      name: type.name,
      rate,
      monthlyCost,
      premium: type.premium * 100,
    };
  });

  const resetForm = () => {
    setVolume("50");
    setVolumeUnit("cbm");
    setStorageMonths("3");
    setWarehouseLocation("US_WEST");
    setPalletType("standard");
    setIncludePickPack(true);
    setMonthlyOrders("100");
    setItemsPerOrder("3");
    setStackable(true);
    setStorageType("standard");
    setGoodsValue("50000");
  };

  const getEfficiencyColor = (rate: number) => {
    if (rate <= 15) return "#10B981";
    if (rate <= 20) return "#22C55E";
    if (rate <= 25) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-[var(--ocean)] text-white">
                <Warehouse className="h-3 w-3 mr-1" />
                Warehousing
              </Badge>
              <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                <Zap className="h-3 w-3 mr-1" />
                Cost Analysis
              </Badge>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Warehousing Cost Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Calculate comprehensive warehousing costs including storage fees, handling charges, 
              fulfillment services, and additional expenses. Compare locations and optimize your storage strategy.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
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

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[var(--logistics)]" />
                    Cargo Details
                  </CardTitle>
                  <CardDescription>
                    Enter your cargo volume and storage requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="volume">Total Volume</Label>
                      <Input
                        id="volume"
                        type="number"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        placeholder="50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select value={volumeUnit} onValueChange={setVolumeUnit}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cbm">CBM</SelectItem>
                          <SelectItem value="pallets">Pallets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pallet Type</Label>
                      <Select value={palletType} onValueChange={setPalletType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(palletDimensions).map(([key, data]) => (
                            <SelectItem key={key} value={key}>
                              {data.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Storage Duration</Label>
                      <Select value={storageMonths} onValueChange={setStorageMonths}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Month</SelectItem>
                          <SelectItem value="2">2 Months</SelectItem>
                          <SelectItem value="3">3 Months</SelectItem>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">12 Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="stackable">Stackable Cargo</Label>
                      <p className="text-xs text-muted-foreground">
                        Can pallets be stacked 2-high?
                      </p>
                    </div>
                    <Switch
                      id="stackable"
                      checked={stackable}
                      onCheckedChange={setStackable}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[var(--ocean)]" />
                    Storage Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Storage Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {storageTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setStorageType(type.id)}
                          className={`p-3 rounded-lg border-2 transition-all text-left ${
                            storageType === type.id
                              ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                              : "border-border hover:border-muted-foreground/50"
                          }`}
                        >
                          <type.icon className="h-4 w-4 mb-1" />
                          <div className="text-sm font-medium">{type.name}</div>
                          {type.premium > 0 && (
                            <div className="text-xs text-muted-foreground">+{(type.premium * 100).toFixed(0)}% premium</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Warehouse Location</Label>
                    <Select value={warehouseLocation} onValueChange={setWarehouseLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(warehouseRates).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="text-muted-foreground">Pallet Rate:</span>
                      <span className="font-medium ml-1">${(selectedWarehouse.palletRate * (1 + selectedStorageType.premium)).toFixed(2)}/mo</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pick & Pack:</span>
                      <span className="font-medium ml-1">${selectedWarehouse.pickPack}/item</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goodsValue">Goods Value (for insurance)</Label>
                    <Input
                      id="goodsValue"
                      type="number"
                      value={goodsValue}
                      onChange={(e) => setGoodsValue(e.target.value)}
                      placeholder="50000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used to calculate insurance costs (0.2%/month)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BoxSelect className="h-5 w-5 text-[var(--logistics)]" />
                    Order Fulfillment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pickPack">Include Pick & Pack</Label>
                      <p className="text-xs text-muted-foreground">
                        Add fulfillment services
                      </p>
                    </div>
                    <Switch
                      id="pickPack"
                      checked={includePickPack}
                      onCheckedChange={setIncludePickPack}
                    />
                  </div>

                  <AnimatePresence>
                    {includePickPack && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="monthlyOrders">Monthly Orders</Label>
                          <Input
                            id="monthlyOrders"
                            type="number"
                            value={monthlyOrders}
                            onChange={(e) => setMonthlyOrders(e.target.value)}
                            placeholder="100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="itemsPerOrder">Avg Items/Order</Label>
                          <Input
                            id="itemsPerOrder"
                            type="number"
                            value={itemsPerOrder}
                            onChange={(e) => setItemsPerOrder(e.target.value)}
                            placeholder="3"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--logistics)]/20">
                <div className="h-2 bg-[var(--logistics)]" />
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                    Cost Estimate
                  </CardTitle>
                  <CardDescription>
                    {selectedWarehouse.name} • {selectedStorageType.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg">
                    <div className="text-center">
                      <motion.div
                        key={calculation.palletPositions}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-[var(--logistics)]"
                      >
                        {calculation.palletPositions}
                      </motion.div>
                      <div className="text-xs text-muted-foreground">Pallet Positions</div>
                    </div>
                    <div className="text-center">
                      <motion.div
                        key={storageMonths}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold text-[var(--ocean)]"
                      >
                        {storageMonths}
                      </motion.div>
                      <div className="text-xs text-muted-foreground">Months Storage</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Storage ({storageMonths} mo)</span>
                      <span className="font-medium">{formatCurrency(calculation.storageCost)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Receiving (In)</span>
                      <span className="font-medium">{formatCurrency(calculation.handlingIn)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Dispatch (Out)</span>
                      <span className="font-medium">{formatCurrency(calculation.handlingOut)}</span>
                    </div>
                    
                    {includePickPack && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Pick & Pack</span>
                        <span className="font-medium">{formatCurrency(calculation.pickPackCost)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Insurance</span>
                      <span className="font-medium">{formatCurrency(calculation.insuranceCost)}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Admin Fees</span>
                      <span className="font-medium">{formatCurrency(calculation.adminCost)}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 bg-[var(--logistics)]/10 rounded-lg px-3">
                      <span className="font-semibold">Total Monthly Cost</span>
                      <span className="font-bold text-[var(--logistics)] text-xl">
                        {formatCurrency(calculation.totalMonthly)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className="text-sm font-medium">{formatCurrency(calculation.costPerPallet)}</div>
                        <div className="text-xs text-muted-foreground">Per Pallet/Month</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded">
                        <div className="text-sm font-medium">{formatCurrency(calculation.costPerCbm)}</div>
                        <div className="text-xs text-muted-foreground">Per CBM/Month</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Efficiency Indicator */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[var(--ocean)]" />
                    Rate Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Your Rate</span>
                      <span className="font-medium" style={{ color: getEfficiencyColor(calculation.palletRate) }}>
                        ${calculation.palletRate.toFixed(2)}/pallet
                      </span>
                    </div>
                    <Progress 
                      value={Math.max(0, 100 - (calculation.palletRate / 40) * 100)} 
                      className="h-2" 
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low Cost</span>
                      <span>High Cost</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-start gap-3 p-3 bg-[var(--logistics)]/5 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Stacking {stackable ? 'Enabled' : 'Disabled'}</p>
                      <p className="text-muted-foreground">
                        {stackable 
                          ? 'You\'re saving ~50% on floor positions by stacking cargo.'
                          : 'Enable stacking to reduce floor space costs by up to 50%.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={costBreakdownData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {costBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--logistics)]" />
                  Monthly Cost Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyCostData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                      <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="monthlyCost" name="Monthly Cost" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="cumulativeCost" name="Cumulative" stroke="#2E8B57" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Cost Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[var(--ocean)]">{formatCurrency(calculation.totalCost)}</div>
                    <div className="text-sm text-muted-foreground">Total Contract Cost</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[var(--logistics)]">{formatCurrency(calculation.totalMonthly)}</div>
                    <div className="text-sm text-muted-foreground">Monthly Average</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-2xl font-bold" style={{ color: getEfficiencyColor(calculation.palletRate) }}>
                      ${calculation.palletRate.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Rate per Pallet</div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-500">{calculation.palletPositions}</div>
                    <div className="text-sm text-muted-foreground">Positions Needed</div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Cost Composition</h4>
                    <div className="space-y-2">
                      {costBreakdownData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: item.fill }} />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Efficiency Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage Efficiency</span>
                        <span className="font-medium">{stackable ? '50% savings' : 'Baseline'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location Premium</span>
                        <span className="font-medium">{((calculation.palletRate / 10) * 100 - 100).toFixed(0)}% vs baseline</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Storage Type Premium</span>
                        <span className="font-medium">+{(selectedStorageType.premium * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                  Location Comparison
                </CardTitle>
                <CardDescription>
                  Compare monthly storage costs across different warehouse locations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={locationComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Bar dataKey="monthlyCost" name="Monthly Cost" radius={[0, 4, 4, 0]}>
                        {locationComparisonData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.code === warehouseLocation ? "#2E8B57" : "#0F4C81"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[var(--logistics)]" />
                  Storage Type Comparison
                </CardTitle>
                <CardDescription>
                  Compare costs across different storage configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={storageTypeComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                      <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="monthlyCost" name="Monthly Cost ($)" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="rate" name="Rate/Pallet" stroke="#2E8B57" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Location Comparison</CardTitle>
              <CardDescription>
                Complete breakdown of rates by warehouse location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Location</th>
                      <th className="text-right p-2">Rate/Pallet</th>
                      <th className="text-right p-2">Handling In</th>
                      <th className="text-right p-2">Handling Out</th>
                      <th className="text-right p-2">Pick & Pack</th>
                      <th className="text-right p-2">Monthly Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locationComparisonData.map((location) => {
                      const data = warehouseRates[location.code];
                      return (
                        <tr 
                          key={location.code} 
                          className={`border-b ${location.code === warehouseLocation ? 'bg-[var(--logistics)]/5' : ''}`}
                        >
                          <td className="p-2 font-medium">{location.fullLocation}</td>
                          <td className="text-right p-2">${(data.palletRate * (1 + selectedStorageType.premium)).toFixed(2)}</td>
                          <td className="text-right p-2">${data.handlingIn}</td>
                          <td className="text-right p-2">${data.handlingOut}</td>
                          <td className="text-right p-2">${data.pickPack}</td>
                          <td className="text-right p-2 font-bold text-[var(--logistics)]">
                            {formatCurrency(location.monthlyCost)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Cost Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding Warehousing Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Warehousing costs represent a significant portion of total logistics expenses, typically accounting 
                  for 15-25% of total supply chain costs. Understanding the components and drivers of these costs is 
                  essential for effective budget management and cost optimization. Modern warehousing involves much more 
                  than simple storage—it encompasses inventory management, order fulfillment, value-added services, and 
                  increasingly sophisticated technology integration.
                </p>
                <p>
                  The primary cost driver is storage fees, typically charged per pallet position or per square foot/meter 
                  of floor space. Rates vary dramatically by location, with premium logistics hubs like Los Angeles, 
                  Rotterdam, and Singapore commanding rates 2-4x higher than secondary markets. Duration also affects 
                  pricing—longer commitments often qualify for volume discounts, while short-term or spot storage carries 
                  premium rates during peak seasons.
                </p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Cost Components:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--logistics)]">•</span>
                      <span><strong>Storage Fees:</strong> Base charge per pallet/CBM per month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--logistics)]">•</span>
                      <span><strong>Handling Fees:</strong> Receiving and dispatching charges per pallet</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--logistics)]">•</span>
                      <span><strong>Fulfillment Services:</strong> Pick & pack, kitting, labeling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--logistics)]">•</span>
                      <span><strong>Insurance:</strong> Typically 0.1-0.5% of goods value monthly</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[var(--logistics)]" />
                  Types of Storage Facilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Different storage requirements necessitate different facility types, each with distinct cost structures 
                  and operational characteristics. Understanding these differences helps in selecting the right facility 
                  for your specific needs and budget. The choice of storage type directly impacts product integrity, 
                  regulatory compliance, and total cost of ownership.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Warehouse className="h-4 w-4 text-[var(--ocean)]" />
                      Standard Dry Storage
                    </h4>
                    <p className="mt-1">
                      The most common and cost-effective option for non-perishable goods. Maintains ambient temperature 
                      and humidity. Ideal for general merchandise, packaged goods, metals, and materials not sensitive 
                      to environmental conditions. Rates typically range from $8-25/pallet/month depending on location.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      Climate-Controlled Storage
                    </h4>
                    <p className="mt-1">
                      Maintains specific temperature (typically 15-25°C) and humidity levels. Essential for 
                      pharmaceuticals, food products, electronics, and sensitive materials. Premium of 30-50% over 
                      standard storage, but prevents product degradation and regulatory compliance issues.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-500" />
                      Bonded Warehousing
                    </h4>
                    <p className="mt-1">
                      Government-authorized facilities for storing imported goods without paying duties until release. 
                      Provides significant cash flow advantages for importers. Ideal for goods with uncertain domestic 
                      demand or those awaiting re-export. Premium of 10-20%, offset by duty deferral benefits.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--ocean)]" />
                  Contract Considerations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Warehouse contracts contain numerous terms that significantly impact total costs and operational 
                  flexibility. Before signing, carefully review all terms and negotiate where possible. Understanding 
                  these elements helps avoid unexpected charges and ensures the agreement aligns with your operational 
                  needs and business strategy.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Critical Contract Elements:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                      <span><strong>Minimum Commitments:</strong> Avoid monthly minimums if volume fluctuates; negotiate seasonal flexibility instead.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                      <span><strong>Rate Escalation:</strong> Understand annual increase clauses; cap at CPI or fixed percentage.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                      <span><strong>Termination Terms:</strong> Negotiate reasonable notice periods (30-90 days) and avoid penalties.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                      <span><strong>Service Levels:</strong> Include SLAs for accuracy rates, turnaround times, and reporting frequency.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                      <span><strong>Liability Limits:</strong> Clarify responsibility for loss, damage, theft; consider additional insurance.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 text-[var(--logistics)] mt-0.5" />
                      <span><strong>Hidden Fees:</strong> Watch for access charges, after-hours fees, system fees, and pallet exchange costs.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about warehousing costs and storage optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <span className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-[var(--ocean)] shrink-0" />
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Still Have Questions?</CardTitle>
              <CardDescription>
                Our logistics experts are here to help you optimize your warehousing strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
                  Contact Support
                </Button>
                <Button variant="outline">
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
