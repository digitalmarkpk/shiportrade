"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plane,
  Fuel,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Scale,
  BarChart3,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Zap,
  RotateCcw,
  Target,
  AlertCircle,
} from "lucide-react";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Airline fuel surcharge data (example - would be real-time in production)
const AIRLINE_FSC = {
  DHL: { name: "DHL Express", baseFSC: 0.85, updateFreq: "Weekly", fuelIndex: "Jet Kerosene" },
  FEDEX: { name: "FedEx", baseFSC: 0.82, updateFreq: "Weekly", fuelIndex: "Jet Kerosene" },
  UPS: { name: "UPS", baseFSC: 0.80, updateFreq: "Weekly", fuelIndex: "Jet Kerosene" },
  TNT: { name: "TNT Express", baseFSC: 0.84, updateFreq: "Weekly", fuelIndex: "Jet Kerosene" },
  EMIRATES: { name: "Emirates SkyCargo", baseFSC: 1.10, updateFreq: "Monthly", fuelIndex: "IATA Index" },
  LUFTHANSA: { name: "Lufthansa Cargo", baseFSC: 1.05, updateFreq: "Monthly", fuelIndex: "IATA Index" },
  CATHAY: { name: "Cathay Pacific Cargo", baseFSC: 1.08, updateFreq: "Monthly", fuelIndex: "IATA Index" },
  KOREAN: { name: "Korean Air Cargo", baseFSC: 1.02, updateFreq: "Monthly", fuelIndex: "IATA Index" },
  SINGAPORE: { name: "Singapore Airlines Cargo", baseFSC: 1.06, updateFreq: "Monthly", fuelIndex: "IATA Index" },
  QATAR: { name: "Qatar Airways Cargo", baseFSC: 1.04, updateFreq: "Monthly", fuelIndex: "IATA Index" },
};

// Fuel price indices
const FUEL_INDICES = {
  IATA: { name: "IATA Fuel Price Index", currentPrice: 98.5, basePrice: 70, unit: "$/bbl" },
  JET_KEROSENE: { name: "Jet Kerosene (Rotterdam)", currentPrice: 2.85, basePrice: 2.00, unit: "$/gal" },
  BRENT: { name: "Brent Crude", currentPrice: 85, basePrice: 65, unit: "$/bbl" },
};

// Historical fuel prices (12 months)
const FUEL_HISTORY = [
  { month: "Jan", jetFuel: 2.45, iataIndex: 85, brent: 75 },
  { month: "Feb", jetFuel: 2.52, iataIndex: 88, brent: 78 },
  { month: "Mar", jetFuel: 2.58, iataIndex: 90, brent: 80 },
  { month: "Apr", jetFuel: 2.65, iataIndex: 93, brent: 83 },
  { month: "May", jetFuel: 2.70, iataIndex: 95, brent: 85 },
  { month: "Jun", jetFuel: 2.78, iataIndex: 97, brent: 87 },
  { month: "Jul", jetFuel: 2.85, iataIndex: 98, brent: 88 },
  { month: "Aug", jetFuel: 2.92, iataIndex: 101, brent: 90 },
  { month: "Sep", jetFuel: 2.88, iataIndex: 99, brent: 88 },
  { month: "Oct", jetFuel: 2.95, iataIndex: 102, brent: 91 },
  { month: "Nov", jetFuel: 3.02, iataIndex: 105, brent: 94 },
  { month: "Dec", jetFuel: 3.10, iataIndex: 108, brent: 98 },
];

// Current FSC rates by carrier
const CURRENT_FSC_RATES = [
  { carrier: "DHL Express", rate: 0.85, effective: "Jan 15, 2025", trend: "up", change: "+2.5%" },
  { carrier: "FedEx", rate: 0.82, effective: "Jan 15, 2025", trend: "up", change: "+1.8%" },
  { carrier: "UPS", rate: 0.80, effective: "Jan 15, 2025", trend: "stable", change: "0%" },
  { carrier: "TNT Express", rate: 0.84, effective: "Jan 15, 2025", trend: "up", change: "+2.1%" },
  { carrier: "Emirates SkyCargo", rate: 1.10, effective: "Jan 1, 2025", trend: "up", change: "+3.2%" },
  { carrier: "Lufthansa Cargo", rate: 1.05, effective: "Jan 1, 2025", trend: "up", change: "+2.8%" },
  { carrier: "Cathay Pacific", rate: 1.08, effective: "Jan 1, 2025", trend: "stable", change: "0%" },
  { carrier: "Korean Air Cargo", rate: 1.02, effective: "Jan 1, 2025", trend: "down", change: "-0.5%" },
  { carrier: "Singapore Airlines", rate: 1.06, effective: "Jan 1, 2025", trend: "up", change: "+1.9%" },
  { carrier: "Qatar Airways", rate: 1.04, effective: "Jan 1, 2025", trend: "stable", change: "0%" },
];

const FAQS = [
  {
    question: "What is a fuel surcharge (FSC) in air freight?",
    answer: "A fuel surcharge (FSC) is an additional fee imposed by airlines and freight carriers to offset fluctuating fuel costs. Unlike base freight rates which remain relatively stable, FSC rates are adjusted regularly (weekly for integrators like DHL/FedEx, monthly for most airlines) based on fuel price indices such as the IATA Fuel Price Index or Jet Kerosene prices. This mechanism allows carriers to pass through fuel cost volatility without constantly renegotiating contracts. The FSC is typically charged per kilogram of chargeable weight and can represent 15-30% of total shipping costs depending on fuel market conditions.",
  },
  {
    question: "How are fuel surcharges calculated?",
    answer: "Fuel surcharges are calculated using a formula that considers the current fuel price relative to a baseline price established by each carrier. The most common approach is: FSC Rate = Base FSC Rate × (1 + (Current Price - Base Price) / Base Price × Pass-through Factor). The pass-through factor varies by carrier but typically ranges from 40-60%, meaning carriers absorb some fuel cost fluctuations. For example, if jet fuel increases 20% from baseline with a 50% pass-through, the FSC would increase by 10%. Some carriers use tiered systems where FSC changes in steps based on fuel price thresholds rather than continuous adjustments.",
  },
  {
    question: "Why do FSC rates differ between integrators and airlines?",
    answer: "Integrators (DHL, FedEx, UPS, TNT) and commercial airlines operate under different business models and fuel hedging strategies, leading to varying FSC rates. Integrators typically have more frequent rate adjustments (weekly) and use Jet Kerosene indices, while airlines adjust monthly using the IATA Fuel Price Index. Airlines often have larger fuel hedging programs that smooth out price volatility, while integrators may pass through costs more directly. Additionally, integrators' extensive ground networks and multiple transport modes affect their overall fuel exposure differently than pure air cargo operators. These factors combine to create FSC rate variations of 15-25% between carriers on identical routes.",
  },
  {
    question: "When should I expect FSC rate changes?",
    answer: "FSC rate changes follow predictable schedules: Integrators (DHL, FedEx, UPS, TNT) update weekly, typically on Mondays, based on the previous week's fuel prices. Commercial airlines update monthly, usually on the 1st or 15th of each month. Some carriers provide advance notice of 7-14 days before rate changes. Emergency adjustments may occur during extreme fuel price volatility, such as geopolitical events or supply disruptions. To anticipate changes, monitor fuel price indices weekly - if prices move more than 5-10% from the previous reference period, rate adjustments are likely imminent. Many carriers publish their FSC update calendars and calculation methodologies on their websites.",
  },
  {
    question: "How can I minimize the impact of fuel surcharges?",
    answer: "Several strategies can help manage FSC impact: (1) Negotiate all-inclusive rates that bundle FSC into base rates, providing cost predictability. (2) Use fuel-efficient routing options that may have lower FSC rates. (3) Consider alternative carriers during high FSC periods - rate differences can be significant. (4) Optimize shipment timing to avoid peak fuel price seasons. (5) Consolidate shipments to improve weight breaks and reduce per-kg FSC exposure. (6) Lock in rates with forward contracts or volume commitments when carriers offer FSC caps. (7) Monitor fuel indices and plan shipments before anticipated FSC increases. (8) Consider alternative transport modes for non-urgent cargo when FSC makes air freight uneconomical.",
  },
  {
    question: "What is the relationship between oil prices and air freight FSC?",
    answer: "Air freight FSC is directly correlated with aviation fuel prices, which track crude oil prices with a 2-4 week lag. The correlation is typically 0.85-0.95, meaning FSC rates follow oil market trends closely but not perfectly. Key relationships include: Brent crude prices affect FSC with approximately 2-3 week lag, jet kerosene prices have the most direct impact with 1-2 week lag, and the IATA Fuel Price Index serves as an industry benchmark. Seasonal factors also influence this relationship - aviation fuel demand peaks in summer travel season, sometimes decoupling jet fuel from crude prices. Geopolitical events affecting oil supply can cause sudden FSC spikes independent of normal market dynamics.",
  },
  {
    question: "How do fuel surcharges affect total air freight costs?",
    answer: "Fuel surcharges typically represent 15-30% of total air freight costs, though this can vary significantly based on market conditions. During low fuel price periods, FSC might represent only 10-15% of total costs, while during fuel price spikes, it can exceed 35%. For example, on a $5/kg base rate shipment, FSC might add $0.80-$1.10/kg, resulting in $5.80-$6.10/kg all-in. This percentage impact is higher for long-haul routes where fuel represents a larger portion of operating costs. Understanding your shipment's FSC component is crucial for accurate cost forecasting and competitive pricing. Many shippers track the FSC-to-base-rate ratio as a key performance indicator for air freight cost management.",
  },
];

const PRO_TIPS = [
  {
    title: "Monitor Fuel Indices",
    description: "Track IATA Fuel Price Index and Jet Kerosene prices weekly to anticipate FSC changes before they're announced by carriers.",
    icon: TrendingUp,
  },
  {
    title: "Negotiate FSC Caps",
    description: "When signing volume agreements, negotiate maximum FSC limits or fuel price thresholds above which you're protected.",
    icon: Target,
  },
  {
    title: "Compare Carriers Regularly",
    description: "FSC rates can vary 20-30% between carriers on identical routes. Regular comparison shopping ensures optimal pricing.",
    icon: Scale,
  },
  {
    title: "Consider All-In Rates",
    description: "All-inclusive rates bundle FSC into base pricing, providing budget certainty at the cost of potential savings during low fuel periods.",
    icon: DollarSign,
  },
  {
    title: "Plan Around Updates",
    description: "Know your carriers' FSC update schedules and plan shipments before anticipated increases to lock in lower rates.",
    icon: Zap,
  },
];

interface FSCResult {
  fsc: number;
  baseFreight: number;
  totalCharge: number;
  fscPerKg: number;
  fuelIndexChange: number;
  surchargePercent: number;
  annualProjection: number;
  priceLevel: "low" | "medium" | "high";
}

const chartColors = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  secondary: "#6366F1",
};

export function FuelSurchargeCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");

  // Input parameters
  const [chargeableWeight, setChargeableWeight] = useState<string>("100");
  const [baseRate, setBaseRate] = useState<string>("4.50");
  const [airline, setAirline] = useState<keyof typeof AIRLINE_FSC>("DHL");
  const [fuelIndex, setFuelIndex] = useState<keyof typeof FUEL_INDICES>("IATA");
  const [currentFuelPrice, setCurrentFuelPrice] = useState<number>(98.5);
  const [shipmentsPerMonth, setShipmentsPerMonth] = useState<number>(20);

  // Calculate fuel surcharge
  const result = useMemo((): FSCResult => {
    const weight = parseFloat(chargeableWeight) || 0;
    const rate = parseFloat(baseRate) || 0;
    const airlineData = AIRLINE_FSC[airline];
    const indexData = FUEL_INDICES[fuelIndex];

    // FSC calculation based on fuel price change
    const fuelPriceChange = ((currentFuelPrice - indexData.basePrice) / indexData.basePrice) * 100;
    const fscRate = airlineData.baseFSC * (1 + fuelPriceChange / 100 * 0.5); // 50% pass-through

    const baseFreight = weight * rate;
    const fsc = weight * fscRate;
    const totalCharge = baseFreight + fsc;
    const surchargePercent = (fsc / totalCharge) * 100;
    const annualProjection = (baseFreight + fsc) * shipmentsPerMonth * 12;

    let priceLevel: "low" | "medium" | "high" = "medium";
    if (fuelPriceChange < -10) priceLevel = "low";
    else if (fuelPriceChange > 20) priceLevel = "high";

    return {
      fsc,
      baseFreight,
      totalCharge,
      fscPerKg: fscRate,
      fuelIndexChange: fuelPriceChange,
      surchargePercent,
      annualProjection,
      priceLevel,
    };
  }, [chargeableWeight, baseRate, airline, fuelIndex, currentFuelPrice, shipmentsPerMonth]);

  // Airline comparison
  const airlineComparison = useMemo(() => {
    const weight = parseFloat(chargeableWeight) || 0;
    return Object.entries(AIRLINE_FSC).map(([key, data]) => {
      const fuelPriceChange = ((currentFuelPrice - FUEL_INDICES[fuelIndex].basePrice) / FUEL_INDICES[fuelIndex].basePrice) * 100;
      const fscRate = data.baseFSC * (1 + fuelPriceChange / 100 * 0.5);
      const baseFreight = weight * (parseFloat(baseRate) || 0);
      const fsc = weight * fscRate;
      return {
        airline: key,
        name: data.name,
        fscRate: parseFloat(fscRate.toFixed(3)),
        fscTotal: parseFloat(fsc.toFixed(2)),
        totalCharge: parseFloat((baseFreight + fsc).toFixed(2)),
      };
    }).sort((a, b) => a.totalCharge - b.totalCharge);
  }, [chargeableWeight, baseRate, fuelIndex, currentFuelPrice]);

  // Trend data
  const trendData = useMemo(() => {
    return FUEL_HISTORY.map((data) => ({
      ...data,
      estimatedFSC: AIRLINE_FSC[airline].baseFSC * (1 + ((data.iataIndex - FUEL_INDICES.IATA.basePrice) / FUEL_INDICES.IATA.basePrice) * 0.5),
    }));
  }, [airline]);

  // Chart data for analysis tab
  const costBreakdownData = [
    { name: "Base Freight", value: result.baseFreight, fill: chartColors.ocean },
    { name: "Fuel Surcharge", value: result.fsc, fill: chartColors.logistics },
  ];

  const monthlyCostData = trendData.map((d) => ({
    month: d.month,
    baseFreight: (parseFloat(chargeableWeight) || 100) * (parseFloat(baseRate) || 4.5),
    fsc: (parseFloat(chargeableWeight) || 100) * d.estimatedFSC,
    total: (parseFloat(chargeableWeight) || 100) * ((parseFloat(baseRate) || 4.5) + d.estimatedFSC),
  }));

  const resetForm = () => {
    setChargeableWeight("100");
    setBaseRate("4.50");
    setAirline("DHL");
    setFuelIndex("IATA");
    setCurrentFuelPrice(98.5);
    setShipmentsPerMonth(20);
    setCurrency("USD");
  };

  const getEfficiencyColor = (value: number) => {
    if (value >= 80) return "#10B981";
    if (value >= 60) return "#22C55E";
    if (value >= 40) return "#F59E0B";
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
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[var(--ocean)] text-white">
                  <Plane className="h-3 w-3 mr-1" />
                  Air Freight
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                  <Zap className="h-3 w-3 mr-1" />
                  Cost Planning
                </Badge>
              </motion.div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Fuel Surcharge Calculator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Calculate and forecast air freight fuel surcharges with precision. Compare carriers, analyze trends,
              and optimize your shipping costs with real-time FSC calculations.
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
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Rates</span>
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
            {/* Input Card */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plane className="h-5 w-5 text-[var(--ocean)]" />
                    Shipment Details
                  </CardTitle>
                  <CardDescription>Enter your shipment parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Label className="shrink-0">Currency</Label>
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

                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="chargeableWeight">Chargeable Weight (kg)</Label>
                      <div className="relative">
                        <Scale className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="chargeableWeight"
                          type="number"
                          value={chargeableWeight}
                          onChange={(e) => setChargeableWeight(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="baseRate">Base Rate (per kg)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="baseRate"
                          type="number"
                          step="0.01"
                          value={baseRate}
                          onChange={(e) => setBaseRate(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Airline / Carrier</Label>
                      <Select value={airline} onValueChange={(v) => setAirline(v as keyof typeof AIRLINE_FSC)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(AIRLINE_FSC).map(([key, data]) => (
                            <SelectItem key={key} value={key}>
                              {data.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Fuel Price Index</Label>
                      <Select value={fuelIndex} onValueChange={(v) => setFuelIndex(v as keyof typeof FUEL_INDICES)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(FUEL_INDICES).map(([key, data]) => (
                            <SelectItem key={key} value={key}>
                              {data.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-[var(--ocean)]">{AIRLINE_FSC[airline].baseFSC}</div>
                      <div className="text-xs text-muted-foreground">Base FSC/kg</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-[var(--logistics)]">{AIRLINE_FSC[airline].updateFreq}</div>
                      <div className="text-xs text-muted-foreground">Updates</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-amber-500">{AIRLINE_FSC[airline].fuelIndex}</div>
                      <div className="text-xs text-muted-foreground">Index</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fuel Price Adjustment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                    Fuel Price Impact
                  </CardTitle>
                  <CardDescription>Adjust surcharge based on current fuel prices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Current Fuel Index Price</Label>
                    <div className="mt-2">
                      <Slider
                        value={[currentFuelPrice]}
                        onValueChange={(v) => setCurrentFuelPrice(v[0])}
                        min={50}
                        max={150}
                        step={0.5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>$50</span>
                        <span className="font-medium text-[var(--ocean)]">${currentFuelPrice}</span>
                        <span>$150</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    result.priceLevel === "high" ? "bg-destructive/10" :
                    result.priceLevel === "low" ? "bg-[var(--logistics)]/10" : "bg-yellow-500/10"
                  }`}>
                    <div className="flex items-center gap-2">
                      {result.priceLevel === "high" ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      ) : result.priceLevel === "low" ? (
                        <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                      ) : (
                        <Info className="h-5 w-5 text-yellow-500" />
                      )}
                      <p className="font-medium">
                        {result.priceLevel === "high" ? "High Fuel Prices" :
                         result.priceLevel === "low" ? "Favorable Fuel Prices" : "Moderate Fuel Prices"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fuel prices are {result.fuelIndexChange > 0 ? "above" : "below"} baseline by
                      {" "}{Math.abs(result.fuelIndexChange).toFixed(1)}%, resulting in
                      {" "}{formatCurrency(result.fscPerKg - AIRLINE_FSC[airline].baseFSC, currency)}/kg adjustment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Card */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <div className="h-2 bg-[var(--ocean)]" />
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Surcharge Results
                  </CardTitle>
                  <CardDescription>
                    {AIRLINE_FSC[airline].name} - {chargeableWeight} kg
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <motion.div
                    key={result.totalCharge}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center"
                  >
                    <p className="text-sm text-muted-foreground">Total Charge</p>
                    <p className="text-3xl font-bold text-[var(--ocean)]">
                      {formatCurrency(result.totalCharge, currency)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      for {chargeableWeight} kg chargeable weight
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      key={result.baseFreight}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Base Freight</p>
                      </div>
                      <p className="text-xl font-bold text-[var(--ocean)]">
                        {formatCurrency(result.baseFreight, currency)}
                      </p>
                    </motion.div>
                    <motion.div
                      key={result.fsc}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Fuel Surcharge</p>
                        <Badge variant="outline">{result.surchargePercent.toFixed(1)}%</Badge>
                      </div>
                      <p className="text-xl font-bold text-[var(--logistics)]">
                        {formatCurrency(result.fsc, currency)}
                      </p>
                    </motion.div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">FSC Rate</span>
                      <span className="font-medium">${result.fscPerKg.toFixed(3)}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Fuel Index Change</span>
                      <span className={`font-medium ${result.fuelIndexChange > 0 ? "text-destructive" : "text-[var(--logistics)]"}`}>
                        {result.fuelIndexChange > 0 ? "+" : ""}{result.fuelIndexChange.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Airline</span>
                      <span className="font-bold text-[var(--ocean)]">{AIRLINE_FSC[airline].name}</span>
                    </div>
                  </div>

                  {/* FSC Percentage Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FSC Share of Total</span>
                      <span className="font-medium" style={{ color: getEfficiencyColor(100 - result.surchargePercent) }}>
                        {result.surchargePercent.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={result.surchargePercent} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* Cost Projection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                    Cost Projections
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Shipments per Month</Label>
                      <Badge variant="outline">{shipmentsPerMonth}</Badge>
                    </div>
                    <Slider
                      value={[shipmentsPerMonth]}
                      onValueChange={(v) => setShipmentsPerMonth(v[0])}
                      min={1}
                      max={100}
                      step={1}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center">
                      <div className="text-xl font-bold text-[var(--ocean)]">
                        {formatCurrency(result.fsc * shipmentsPerMonth, currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">Monthly FSC Cost</div>
                    </div>
                    <div className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center">
                      <div className="text-xl font-bold text-[var(--logistics)]">
                        {formatCurrency(result.annualProjection, currency)}
                      </div>
                      <div className="text-xs text-muted-foreground">Annual Projection</div>
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
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-[var(--logistics)]" />
                  Carrier Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={airlineComparison.slice(0, 6)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10 }} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "fscTotal" ? formatCurrency(value, currency) : `$${value.toFixed(3)}/kg`,
                          name === "fscTotal" ? "Total FSC" : "FSC Rate"
                        ]}
                      />
                      <Bar dataKey="fscTotal" fill={chartColors.ocean} name="fscTotal" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                  Monthly Cost Trends (12-Month History)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyCostData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(v) => formatCurrency(v, currency)} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, currency)} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="total"
                        fill={chartColors.ocean}
                        fillOpacity={0.3}
                        stroke={chartColors.ocean}
                        name="Total Cost"
                      />
                      <Line
                        type="monotone"
                        dataKey="fsc"
                        stroke={chartColors.logistics}
                        strokeWidth={2}
                        name="FSC"
                      />
                      <Line
                        type="monotone"
                        dataKey="baseFreight"
                        stroke={chartColors.secondary}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Base Freight"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--ocean)]">{formatCurrency(result.fscPerKg, currency)}</div>
                  <div className="text-sm text-muted-foreground">FSC Rate/kg</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-[var(--logistics)]">{formatCurrency(result.fsc, currency)}</div>
                  <div className="text-sm text-muted-foreground">Total FSC</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold" style={{ color: result.fuelIndexChange > 0 ? chartColors.danger : chartColors.logistics }}>
                    {result.fuelIndexChange > 0 ? "+" : ""}{result.fuelIndexChange.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Fuel Index Change</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-500">{formatCurrency(result.annualProjection, currency)}</div>
                  <div className="text-sm text-muted-foreground">Annual Projection</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rates Tab */}
        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[var(--ocean)]" />
                Current FSC Rates by Carrier
              </CardTitle>
              <CardDescription>
                Latest fuel surcharge rates and their effective dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Carrier</th>
                      <th className="text-right p-3 font-medium">FSC Rate ($/kg)</th>
                      <th className="text-left p-3 font-medium">Effective Date</th>
                      <th className="text-center p-3 font-medium">Trend</th>
                      <th className="text-right p-3 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CURRENT_FSC_RATES.map((row, idx) => (
                      <tr key={idx} className={`border-b ${row.carrier === AIRLINE_FSC[airline].name ? "bg-[var(--ocean)]/5" : ""}`}>
                        <td className="p-3 font-medium">{row.carrier}</td>
                        <td className="text-right p-3">
                          <span className="font-bold text-[var(--ocean)]">${row.rate.toFixed(2)}</span>
                        </td>
                        <td className="p-3 text-muted-foreground">{row.effective}</td>
                        <td className="p-3 text-center">
                          {row.trend === "up" && <TrendingUp className="h-4 w-4 text-destructive mx-auto" />}
                          {row.trend === "down" && <TrendingDown className="h-4 w-4 text-[var(--logistics)] mx-auto" />}
                          {row.trend === "stable" && <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className={`text-right p-3 font-medium ${
                          row.trend === "up" ? "text-destructive" :
                          row.trend === "down" ? "text-[var(--logistics)]" : "text-muted-foreground"
                        }`}>
                          {row.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-[var(--logistics)]" />
                  Fuel Price Indices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(FUEL_INDICES).map(([key, data]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium">{data.name}</div>
                      <div className="text-xs text-muted-foreground">Base: {data.basePrice} {data.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[var(--ocean)]">{data.currentPrice} {data.unit}</div>
                      <div className="text-xs text-[var(--logistics)]">
                        +{((data.currentPrice - data.basePrice) / data.basePrice * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                  Fuel Price Trend (12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="jetFuel" stroke={chartColors.ocean} strokeWidth={2} name="Jet Fuel ($/gal)" />
                      <Line type="monotone" dataKey="brent" stroke={chartColors.warning} strokeWidth={2} name="Brent ($/bbl)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for FSC Optimization
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
                  Understanding Fuel Surcharges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Fuel surcharges (FSC) represent a critical component of air freight pricing, designed to help carriers
                  manage the volatility of aviation fuel costs. Unlike fixed base rates that remain stable throughout
                  contract periods, FSC rates fluctuate based on published fuel price indices, providing carriers with
                  a mechanism to pass through fuel cost changes without renegotiating entire contracts.
                </p>
                <p>
                  The aviation industry typically uses two primary fuel benchmarks: the IATA Fuel Price Index, which
                  tracks a basket of global jet fuel prices, and regional Jet Kerosene prices from major trading hubs
                  like Rotterdam, Singapore, and New York. Integrators (DHL, FedEx, UPS) generally use Jet Kerosene
                  indices with weekly updates, while commercial airlines often reference the IATA Index with monthly
                  adjustments.
                </p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Formula:</h4>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-xs">
                    FSC = Base Rate × (1 + (Fuel Price Change × Pass-through Factor))
                  </div>
                  <p className="text-xs">
                    The pass-through factor (typically 40-60%) determines how much of the fuel price change
                    is passed on to shippers. Lower factors mean carriers absorb more volatility.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[var(--ocean)]" />
                  FSC Calculation Methodology
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Understanding how fuel surcharges are calculated empowers shippers to forecast costs accurately
                  and negotiate better terms. The calculation methodology varies by carrier type but follows a
                  consistent framework: First, carriers establish a baseline fuel price against which current
                  prices are measured. This baseline is typically set at historical average prices and represents
                  the fuel cost already built into base freight rates.
                </p>
                <p>
                  When current fuel prices deviate from the baseline, carriers calculate the percentage change
                  and apply a pass-through factor. For example, if jet fuel increases 20% from baseline and a
                  carrier uses a 50% pass-through factor, the FSC increases by 10%. This mechanism protects
                  both parties: shippers aren't exposed to 100% of fuel volatility, and carriers aren't forced
                  to absorb unsustainable fuel cost increases.
                </p>
                <p>
                  Some carriers use tiered or stepped FSC schedules where rates change in discrete steps based
                  on fuel price thresholds rather than continuous calculation. This approach provides more
                  predictability but may result in larger sudden changes when thresholds are crossed. Understanding
                  your carrier's methodology is essential for accurate cost forecasting.
                </p>
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
                Common questions about air freight fuel surcharges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
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
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={resetForm}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
