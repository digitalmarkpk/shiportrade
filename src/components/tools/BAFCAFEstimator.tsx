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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
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
  Ship,
  Globe,
  Zap,
  BookOpen,
  HelpCircle,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Clock,
  Shield,
  Lightbulb,
  Anchor,
  Waves,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Brand colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Carrier BAF rates (example data - would be real-time in production)
const CARRIER_BAF = {
  MAERSK: { name: "Maersk Line", baseBAF: 850, adjustmentFactor: 1.0 },
  MSC: { name: "MSC", baseBAF: 820, adjustmentFactor: 0.98 },
  CMA_CGM: { name: "CMA CGM", baseBAF: 880, adjustmentFactor: 1.02 },
  COSCO: { name: "COSCO Shipping", baseBAF: 790, adjustmentFactor: 0.95 },
  HAPAG: { name: "Hapag-Lloyd", baseBAF: 870, adjustmentFactor: 1.01 },
  EVERGREEN: { name: "Evergreen", baseBAF: 810, adjustmentFactor: 0.97 },
  ONE: { name: "ONE", baseBAF: 860, adjustmentFactor: 1.0 },
  YANG_MING: { name: "Yang Ming", baseBAF: 830, adjustmentFactor: 0.99 },
};

// Trade lane factors
const TRADE_LANES = {
  ASIA_EUROPE: { name: "Asia - Europe", factor: 1.0, avgTransit: 30 },
  ASIA_USWC: { name: "Asia - US West Coast", factor: 1.1, avgTransit: 14 },
  ASIA_USEC: { name: "Asia - US East Coast", factor: 1.15, avgTransit: 25 },
  EUROPE_US: { name: "Europe - US", factor: 0.95, avgTransit: 12 },
  TRANS_PACIFIC: { name: "Trans-Pacific", factor: 1.2, avgTransit: 18 },
  TRANS_ATLANTIC: { name: "Trans-Atlantic", factor: 0.9, avgTransit: 10 },
  INTRA_ASIA: { name: "Intra-Asia", factor: 0.7, avgTransit: 7 },
  ASIA_MEA: { name: "Asia - Middle East", factor: 0.8, avgTransit: 12 },
};

// Fuel price data (last 12 months simulation)
const FUEL_PRICE_HISTORY = [
  { month: "Jan", ifo380: 520, mgo: 750, brent: 78 },
  { month: "Feb", ifo380: 535, mgo: 765, brent: 82 },
  { month: "Mar", ifo380: 548, mgo: 780, brent: 85 },
  { month: "Apr", ifo380: 562, mgo: 795, brent: 88 },
  { month: "May", ifo380: 540, mgo: 770, brent: 84 },
  { month: "Jun", ifo380: 528, mgo: 758, brent: 80 },
  { month: "Jul", ifo380: 545, mgo: 772, brent: 83 },
  { month: "Aug", ifo380: 560, mgo: 790, brent: 87 },
  { month: "Sep", ifo380: 575, mgo: 805, brent: 91 },
  { month: "Oct", ifo380: 588, mgo: 820, brent: 95 },
  { month: "Nov", ifo380: 595, mgo: 835, brent: 98 },
  { month: "Dec", ifo380: 610, mgo: 850, brent: 102 },
];

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is BAF (Bunker Adjustment Factor) and how is it calculated?",
    answer: "BAF, or Bunker Adjustment Factor, is a surcharge applied by shipping lines to compensate for fluctuations in fuel prices. It represents one of the most significant variable costs in ocean freight shipping. The calculation typically involves a formula that considers the difference between current fuel prices and a baseline price established by the carrier, multiplied by the fuel consumption rate for the specific trade lane and vessel type. Most carriers update their BAF rates monthly or quarterly based on average fuel prices during the previous period. The BAF mechanism helps carriers maintain profitability while offering shippers transparency in fuel cost pass-through, protecting both parties from extreme fuel price volatility.",
  },
  {
    question: "How does CAF (Currency Adjustment Factor) work in international shipping?",
    answer: "The Currency Adjustment Factor (CAF) is a surcharge that compensates carriers for fluctuations in currency exchange rates between the time of booking and the actual payment settlement. Since international shipping involves multiple currencies and payment terms that can span several weeks, exchange rate movements can significantly impact carrier revenues. CAF is typically expressed as a percentage of the base freight rate and is adjusted periodically based on currency market movements. A positive CAF indicates that the payment currency has weakened against the carrier's operational currency, while a negative CAF suggests strengthening. Understanding CAF is crucial for accurate landed cost calculations and budget forecasting in international trade.",
  },
  {
    question: "Why do BAF rates vary between different carriers and trade lanes?",
    answer: "BAF rates vary significantly between carriers and trade lanes due to several interconnected factors. First, each carrier operates different vessel types with varying fuel efficiency profiles, from older vessels consuming 80+ tons per day to modern eco-ships burning 50-60 tons. Second, trade lanes have distinct characteristics: longer routes like Asia-Europe require more fuel per voyage, while shorter routes like Intra-Asia have lower absolute consumption. Third, carriers use different baseline fuel prices and adjustment formulas, reflecting their hedging strategies and cost structures. Fourth, operational factors such as vessel speed, weather routing, and port congestion all impact actual fuel consumption. Finally, market competition on specific lanes can influence how aggressively carriers price their surcharges.",
  },
  {
    question: "How often do BAF and CAF rates change?",
    answer: "BAF and CAF rates follow different update schedules depending on carrier policies and market conditions. Most major carriers update BAF rates monthly, with some using quarterly adjustments for more stability. The update frequency often reflects the carrier's fuel hedging strategy—carriers with extensive hedging programs may adjust less frequently. CAF rates are typically updated monthly or bi-weekly, closely tracking currency market movements. During periods of extreme volatility, carriers may implement emergency surcharge adjustments or use floating rate mechanisms. It's essential for shippers to monitor carrier announcements and factor potential rate changes into their logistics budgets, especially for long-term contracts where surcharge volatility can significantly impact total landed costs.",
  },
  {
    question: "Can BAF and CAF be negotiated in shipping contracts?",
    answer: "Yes, BAF and CAF terms can often be negotiated, particularly for high-volume shippers with significant bargaining power. Common negotiation approaches include fixed-rate agreements where surcharges are locked for the contract duration, providing budget certainty but potentially missing savings during fuel price declines. Alternatively, capped arrangements limit maximum surcharge exposure while allowing downside participation. Some contracts use hybrid mechanisms with floors and ceilings on adjustment factors. Volume-based discounts on surcharges are also common for consistent high-volume shippers. However, negotiations typically focus on the mechanism rather than the absolute rates, as carriers need to recover actual fuel costs. Understanding these negotiation levers can help procurement teams structure contracts that balance cost predictability with market responsiveness.",
  },
  {
    question: "What is the relationship between oil prices and BAF rates?",
    answer: "The relationship between crude oil prices and BAF rates is complex and not perfectly correlated. While bunker fuel prices generally follow crude oil trends, several factors create divergence. Refining margins, known as 'spreads,' can vary significantly—when refineries have capacity constraints, bunker fuel prices may rise faster than crude. Regional supply dynamics also matter; bunker availability at major bunkering hubs like Singapore, Rotterdam, and Fujairah affects local pricing. Additionally, regulatory changes such as IMO 2020's sulfur cap have fundamentally altered the bunker fuel market, creating different pricing dynamics for low-sulfur fuels. VLSFO (Very Low Sulfur Fuel Oil) now commands a premium over traditional high-sulfur fuel, and carriers have adjusted their baseline prices accordingly. Shippers should monitor both crude trends and specific bunker fuel markets for accurate forecasting.",
  },
];

// Educational content sections
const EDUCATIONAL_SECTIONS = [
  {
    title: "Understanding Bunker Fuel Markets",
    icon: Fuel,
    content: "Bunker fuel represents the single largest operating expense for container shipping lines, typically accounting for 50-60% of total voyage costs. The global bunker fuel market is a complex ecosystem involving refineries, traders, physical suppliers, and shipping companies across major hubs worldwide. Understanding this market is essential for logistics professionals who need to forecast shipping costs and negotiate contracts effectively. The introduction of IMO 2020 regulations fundamentally transformed this market, mandating a maximum sulfur content of 0.5% for marine fuels outside designated emission control areas. This regulatory shift created new fuel grades like VLSFO (Very Low Sulfur Fuel Oil) and LSMGO (Low Sulfur Marine Gas Oil), each with distinct pricing characteristics. Today's bunker market features significant price differentials between fuel types, with LSMGO typically commanding the highest premium due to its versatility and compliance certainty.",
  },
  {
    title: "Currency Risk in International Shipping",
    icon: DollarSign,
    content: "International shipping inherently involves multiple currencies, creating exposure to foreign exchange risk that affects all parties in the supply chain. Carriers typically denominate freight rates in USD but incur costs in local currencies—bunker fuel in Singapore dollars, port charges in euros, crew wages in various currencies. This currency mismatch necessitates the Currency Adjustment Factor as a risk-sharing mechanism. For shippers, understanding currency dynamics is crucial for accurate landed cost calculations. A strengthening USD generally reduces CAF exposure for USD-denominated contracts, while a weakening USD increases surcharges. Sophisticated shippers may use currency hedging instruments to lock in exchange rates for their shipping costs, similar to how carriers hedge fuel price risk. The interplay between currency movements and freight costs adds another dimension to trade finance planning, particularly for businesses with thin margins or long payment terms.",
  },
  {
    title: "Fuel Efficiency and Environmental Regulations",
    icon: Waves,
    content: "The shipping industry faces increasing pressure to reduce its environmental footprint, driving significant changes in vessel design and operational practices. Modern container ships incorporate multiple fuel efficiency technologies including bulbous bows, wake improvement devices, and air lubrication systems that reduce fuel consumption by 5-15%. Slow steaming—operating vessels at reduced speeds—has become standard practice, cutting fuel consumption by up to 30% on some routes despite extending transit times. Looking ahead, the International Maritime Organization's GHG reduction targets for 2030 and 2050 are accelerating investment in alternative fuels and propulsion systems. Liquefied Natural Gas (LNG) powered vessels are entering service, offering reduced emissions and potential fuel cost savings. Methanol, ammonia, and hydrogen represent the next generation of marine fuels under development. These environmental imperatives will reshape BAF mechanisms as carriers transition to new fuel types with different cost structures.",
  },
  {
    title: "Strategic Approaches to Surcharge Management",
    icon: Target,
    content: "Effective management of BAF and CAF exposure requires a multi-faceted approach combining procurement strategy, contract negotiation, and operational optimization. Leading shippers develop comprehensive fuel surcharge management programs that begin with thorough market analysis—tracking bunker price trends, currency movements, and carrier-specific adjustment patterns. Contract negotiations should address surcharge mechanisms explicitly, whether through fixed rates, caps, or index-linked arrangements. Operationally, route optimization and carrier selection can minimize surcharge exposure; shorter transit routes naturally have lower fuel consumption, while carriers with modern, efficient fleets may offer competitive BAF rates despite higher base freight. Some large shippers participate directly in bunker markets through fuel supply agreements, bypassing carrier BAF mechanisms entirely. Technology plays an increasingly important role, with analytics platforms providing real-time visibility into surcharge components and forecasting tools helping to budget future shipping costs with greater accuracy.",
  },
];

interface SurchargesResult {
  baf: number;
  caf: number;
  totalSurcharges: number;
  baseFreight: number;
  allInRate: number;
  bafPercent: number;
  cafPercent: number;
  monthlyFuelCost: number;
  annualProjection: number;
  priceLevel: "low" | "medium" | "high";
}

export function BAFCAFEstimator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");
  
  // Input parameters
  const [baseFreight, setBaseFreight] = useState<string>("2000");
  const [containerType, setContainerType] = useState<string>("40HC");
  const [carrier, setCarrier] = useState<keyof typeof CARRIER_BAF>("MAERSK");
  const [tradeLane, setTradeLane] = useState<keyof typeof TRADE_LANES>("ASIA_EUROPE");
  const [currentFuelPrice, setCurrentFuelPrice] = useState<number>(600);
  const [baseFuelPrice, setBaseFuelPrice] = useState<number>(500);
  const [cafRate, setCafRate] = useState<number>(5);
  const [containersPerMonth, setContainersPerMonth] = useState<number>(10);

  // Calculate surcharges
  const result = useMemo((): SurchargesResult => {
    const base = parseFloat(baseFreight) || 0;
    const carrierData = CARRIER_BAF[carrier];
    const laneData = TRADE_LANES[tradeLane];
    
    // BAF calculation based on fuel price difference
    const fuelDiff = currentFuelPrice - baseFuelPrice;
    const bafAdjustment = fuelDiff * 0.5; // $0.50 per $1 fuel increase
    const baf = carrierData.baseBAF * carrierData.adjustmentFactor * laneData.factor + bafAdjustment;
    
    // CAF calculation (currency adjustment)
    const caf = base * (cafRate / 100);
    
    const totalSurcharges = baf + caf;
    const allInRate = base + totalSurcharges;
    const bafPercent = (baf / allInRate) * 100;
    const cafPercent = (caf / allInRate) * 100;
    const monthlyFuelCost = baf * containersPerMonth;
    const annualProjection = monthlyFuelCost * 12;
    
    let priceLevel: "low" | "medium" | "high" = "medium";
    if (currentFuelPrice < 450) priceLevel = "low";
    else if (currentFuelPrice > 650) priceLevel = "high";

    return {
      baf,
      caf,
      totalSurcharges,
      baseFreight: base,
      allInRate,
      bafPercent,
      cafPercent,
      monthlyFuelCost,
      annualProjection,
      priceLevel,
    };
  }, [baseFreight, carrier, tradeLane, currentFuelPrice, baseFuelPrice, cafRate, containersPerMonth]);

  // Carrier comparison data
  const carrierComparison = useMemo(() => {
    const laneData = TRADE_LANES[tradeLane];
    return Object.entries(CARRIER_BAF).map(([key, data]) => {
      const fuelDiff = currentFuelPrice - baseFuelPrice;
      const baf = data.baseBAF * data.adjustmentFactor * laneData.factor + (fuelDiff * 0.5);
      const allIn = result.baseFreight + baf + result.caf;
      return {
        carrier: key,
        name: data.name,
        baf: parseFloat(baf.toFixed(2)),
        allIn: parseFloat(allIn.toFixed(2)),
      };
    }).sort((a, b) => a.allIn - b.allIn);
  }, [tradeLane, currentFuelPrice, baseFuelPrice, result]);

  // Historical trend data
  const trendData = useMemo(() => {
    return FUEL_PRICE_HISTORY.map((data) => ({
      ...data,
      estimatedBAF: CARRIER_BAF[carrier].baseBAF * CARRIER_BAF[carrier].adjustmentFactor * 
                    TRADE_LANES[tradeLane].factor + ((data.ifo380 - baseFuelPrice) * 0.5),
    }));
  }, [carrier, tradeLane, baseFuelPrice]);

  // Pie chart data for cost breakdown
  const pieData = useMemo(() => [
    { name: "Base Freight", value: result.baseFreight, color: OCEAN_BLUE },
    { name: "BAF", value: result.baf, color: LOGISTICS_GREEN },
    { name: "CAF", value: result.caf, color: "#F59E0B" },
  ], [result]);

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden py-16 px-6 md:px-10 lg:px-16"
        style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, ${OCEAN_BLUE}E6 50%, ${LOGISTICS_GREEN} 100%)` }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: `${LOGISTICS_GREEN}33` }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5">
                  <Zap className="h-3.5 w-3.5 mr-1.5" />
                  Free Calculator
                </Badge>
                <Badge className="backdrop-blur-sm px-4 py-1.5 text-white" style={{ backgroundColor: `${LOGISTICS_GREEN}4D`, borderColor: `${LOGISTICS_GREEN}66` }}>
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  Industry Standard
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                BAF & CAF
                <span className="block text-white/90">Estimator</span>
              </h1>
              
              <p className="text-lg text-white/80 mb-6 max-w-xl leading-relaxed">
                Calculate Bunker Adjustment Factor and Currency Adjustment Factor surcharges with precision. 
                Compare carriers, analyze trends, and project annual costs for your ocean freight shipments.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Real-time calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>8 major carriers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4" />
                  <span>All trade lanes</span>
                </div>
              </div>
            </div>
            
            {/* Right quick stats */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4 lg:p-6 text-center">
                  <Fuel className="h-8 w-8 mx-auto mb-2 text-amber-400" />
                  <p className="text-2xl lg:text-3xl font-bold">${currentFuelPrice}</p>
                  <p className="text-sm text-white/70">IFO 380 $/tonne</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4 lg:p-6 text-center">
                  <Calculator className="h-8 w-8 mx-auto mb-2" style={{ color: LOGISTICS_GREEN }} />
                  <p className="text-2xl lg:text-3xl font-bold">{formatCurrency(result.allInRate, currency)}</p>
                  <p className="text-sm text-white/70">All-In Rate</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4 lg:p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                  <p className="text-2xl lg:text-3xl font-bold">{result.bafPercent.toFixed(1)}%</p>
                  <p className="text-sm text-white/70">BAF Share</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4 lg:p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                  <p className="text-2xl lg:text-3xl font-bold">{formatCurrency(result.annualProjection, currency)}</p>
                  <p className="text-sm text-white/70">Annual BAF Cost</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="px-6 md:px-10 lg:px-16 py-8 bg-background">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-muted/50">
            <TabsTrigger value="calculator" className="flex items-center gap-2 text-sm">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2 text-sm">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Comparison</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center gap-2 text-sm">
              <LineChart className="h-4 w-4" />
              <span className="hidden sm:inline">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="projections" className="flex items-center gap-2 text-sm">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Projections</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Card */}
              <Card style={{ borderColor: `${OCEAN_BLUE}33` }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                    <Fuel className="h-5 w-5" />
                    BAF/CAF Calculator
                  </CardTitle>
                  <CardDescription>Estimate bunker and currency adjustment factors</CardDescription>
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
                      <Label htmlFor="baseFreight">Base Freight Rate (per container)</Label>
                      <div className="relative mt-1.5">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="baseFreight"
                          type="number"
                          value={baseFreight}
                          onChange={(e) => setBaseFreight(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Container Type</Label>
                      <Select value={containerType} onValueChange={setContainerType}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20GP">20&apos; GP</SelectItem>
                          <SelectItem value="40GP">40&apos; GP</SelectItem>
                          <SelectItem value="40HC">40&apos; HC</SelectItem>
                          <SelectItem value="45HC">45&apos; HC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Carrier</Label>
                      <Select value={carrier} onValueChange={(v) => setCarrier(v as keyof typeof CARRIER_BAF)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CARRIER_BAF).map(([key, data]) => (
                            <SelectItem key={key} value={key}>
                              {data.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Trade Lane</Label>
                      <Select value={tradeLane} onValueChange={(v) => setTradeLane(v as keyof typeof TRADE_LANES)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TRADE_LANES).map(([key, data]) => (
                            <SelectItem key={key} value={key}>
                              {data.name} ({data.avgTransit} days avg)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Card */}
              <Card style={{ borderColor: `${OCEAN_BLUE}33`, background: `linear-gradient(135deg, ${OCEAN_BLUE}0D 0%, ${LOGISTICS_GREEN}0D 100%)` }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                    <Calculator className="h-5 w-5" />
                    Surcharge Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg text-white" style={{ backgroundColor: OCEAN_BLUE }}>
                      <p className="text-sm text-white/80">All-In Rate</p>
                      <p className="text-3xl font-bold">
                        {formatCurrency(result.allInRate, currency)}
                      </p>
                      <p className="text-sm text-white/70 mt-1">
                        per {containerType} container
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">BAF</p>
                          <Badge variant="outline" style={{ color: OCEAN_BLUE }}>{result.bafPercent.toFixed(1)}%</Badge>
                        </div>
                        <p className="text-xl font-bold" style={{ color: OCEAN_BLUE }}>
                          {formatCurrency(result.baf, currency)}
                        </p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">CAF</p>
                          <Badge variant="outline" style={{ color: LOGISTICS_GREEN }}>{result.cafPercent.toFixed(1)}%</Badge>
                        </div>
                        <p className="text-xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                          {formatCurrency(result.caf, currency)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Base Freight</span>
                        <span className="font-medium">{formatCurrency(result.baseFreight, currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Surcharges</span>
                        <span className="font-medium">{formatCurrency(result.totalSurcharges, currency)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-sm font-medium">Surcharge Ratio</span>
                        <span className="font-bold" style={{ color: OCEAN_BLUE }}>
                          {((result.totalSurcharges / result.baseFreight) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fuel Price Adjustment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                  <TrendingUp className="h-5 w-5" />
                  Fuel Price Impact
                </CardTitle>
                <CardDescription>Adjust BAF based on current fuel prices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Current IFO 380 Price ($/tonne)</Label>
                    <div className="mt-2">
                      <Slider
                        value={[currentFuelPrice]}
                        onValueChange={(v) => setCurrentFuelPrice(v[0])}
                        min={300}
                        max={800}
                        step={10}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>$300</span>
                        <span className="font-medium" style={{ color: OCEAN_BLUE }}>${currentFuelPrice}</span>
                        <span>$800</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Base Fuel Price ($/tonne)</Label>
                    <Input
                      type="number"
                      value={baseFuelPrice}
                      onChange={(e) => setBaseFuelPrice(parseInt(e.target.value) || 500)}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Reference price used by carrier for BAF calculation
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  result.priceLevel === "high" ? "bg-destructive/10 border border-destructive/20" :
                  result.priceLevel === "low" ? "border" : "bg-amber-500/10 border border-amber-500/20"
                }`} style={result.priceLevel === "low" ? { backgroundColor: `${LOGISTICS_GREEN}1A`, borderColor: `${LOGISTICS_GREEN}33` } : {}}>
                  <div className="flex items-center gap-2">
                    {result.priceLevel === "high" ? (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    ) : result.priceLevel === "low" ? (
                      <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    ) : (
                      <Info className="h-5 w-5 text-amber-500" />
                    )}
                    <p className="font-medium">
                      {result.priceLevel === "high" ? "High Fuel Prices" :
                       result.priceLevel === "low" ? "Favorable Fuel Prices" : "Moderate Fuel Prices"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current fuel prices are ${currentFuelPrice > baseFuelPrice ? "+" : ""}
                    {currentFuelPrice - baseFuelPrice}/tonne {currentFuelPrice > baseFuelPrice ? "above" : "below"} base.
                    BAF adjustment: {formatCurrency((currentFuelPrice - baseFuelPrice) * 0.5, currency)}/container
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CAF Adjustment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                  <DollarSign className="h-5 w-5" />
                  Currency Adjustment Factor (CAF)
                </CardTitle>
                <CardDescription>Adjust for currency fluctuations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>CAF Rate (%)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[cafRate]}
                      onValueChange={(v) => setCafRate(v[0])}
                      min={-10}
                      max={15}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="font-bold w-16 text-right">{cafRate}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>-10%</span>
                    <span>0%</span>
                    <span>+15%</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <Info className="h-3 w-3 inline mr-1" />
                  CAF compensates carriers for currency fluctuations between booking and payment.
                  Positive values indicate USD strengthening against major currencies.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Carrier BAF Comparison
                </CardTitle>
                <CardDescription>Compare surcharges across major carriers for the {TRADE_LANES[tradeLane].name} trade lane</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={carrierComparison} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrency(value, currency),
                          name === "baf" ? "BAF" : "All-In Rate"
                        ]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="baf" fill={OCEAN_BLUE} name="BAF" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="allIn" fill={LOGISTICS_GREEN} name="All-In Rate" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-3 px-4">Rank</th>
                        <th className="text-left py-3 px-4">Carrier</th>
                        <th className="text-right py-3 px-4">BAF</th>
                        <th className="text-right py-3 px-4">All-In Rate</th>
                        <th className="text-right py-3 px-4">vs. Average</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrierComparison.map((row, idx) => {
                        const avg = carrierComparison.reduce((sum, r) => sum + r.allIn, 0) / carrierComparison.length;
                        const diff = ((row.allIn - avg) / avg) * 100;
                        return (
                          <tr key={row.carrier} className={`border-b ${idx === 0 ? "bg-green-500/10" : ""}`}>
                            <td className="py-3 px-4">
                              {idx === 0 ? (
                                <Badge style={{ backgroundColor: LOGISTICS_GREEN }}>Best</Badge>
                              ) : (
                                <span className="text-muted-foreground">#{idx + 1}</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-medium">{row.name}</td>
                            <td className="text-right py-3 px-4">{formatCurrency(row.baf, currency)}</td>
                            <td className="text-right py-3 px-4 font-bold">{formatCurrency(row.allIn, currency)}</td>
                            <td className={`text-right py-3 px-4 ${diff < 0 ? "text-green-600" : diff > 0 ? "text-destructive" : ""}`}>
                              {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Educational blurb */}
            <Card style={{ background: `linear-gradient(90deg, ${OCEAN_BLUE}0D 0%, ${LOGISTICS_GREEN}0D 100%)`, borderColor: `${OCEAN_BLUE}33` }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Lightbulb className="h-6 w-6 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Understanding Carrier BAF Differences</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      BAF rates vary between carriers due to differences in vessel fuel efficiency, trade lane exposure, 
                      and fuel hedging strategies. Modern eco-vessels consume 20-30% less fuel than older ships, 
                      allowing carriers like Maersk and CMA CGM to offer competitive BAF rates. When comparing carriers, 
                      consider both the base freight and total all-in rate to make informed decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Fuel Price Trends
                </CardTitle>
                <CardDescription>12-month fuel price history and BAF correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `$${v}`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === "brent" ? `$${value}/bbl` : `$${value}/tonne`,
                          name === "ifo380" ? "IFO 380" : name === "mgo" ? "MGO" : name === "brent" ? "Brent Crude" : "Est. BAF"
                        ]}
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="ifo380"
                        fill={OCEAN_BLUE}
                        fillOpacity={0.3}
                        stroke={OCEAN_BLUE}
                        name="ifo380"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="mgo"
                        stroke={LOGISTICS_GREEN}
                        strokeWidth={2}
                        name="mgo"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="estimatedBAF"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="estimatedBAF"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center border">
                    <p className="text-sm text-muted-foreground">IFO 380 (Current)</p>
                    <p className="text-xl font-bold" style={{ color: OCEAN_BLUE }}>${FUEL_PRICE_HISTORY[11].ifo380}/t</p>
                    <p className="text-xs" style={{ color: LOGISTICS_GREEN }}>+17.3% YTD</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center border">
                    <p className="text-sm text-muted-foreground">MGO (Current)</p>
                    <p className="text-xl font-bold" style={{ color: LOGISTICS_GREEN }}>${FUEL_PRICE_HISTORY[11].mgo}/t</p>
                    <p className="text-xs" style={{ color: LOGISTICS_GREEN }}>+13.3% YTD</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center border">
                    <p className="text-sm text-muted-foreground">Brent Crude</p>
                    <p className="text-xl font-bold text-amber-500">${FUEL_PRICE_HISTORY[11].brent}/bbl</p>
                    <p className="text-xs" style={{ color: LOGISTICS_GREEN }}>+30.8% YTD</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trend Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: `${LOGISTICS_GREEN}1A`, borderColor: `${LOGISTICS_GREEN}33` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                      <h4 className="font-semibold">Bullish Indicators</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• OPEC+ production cuts maintaining supply discipline</li>
                      <li>• Growing demand from recovering global trade</li>
                      <li>• Geopolitical tensions in key oil regions</li>
                      <li>• Refining capacity constraints</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="h-5 w-5 text-amber-500" />
                      <h4 className="font-semibold">Bearish Indicators</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Potential economic slowdown concerns</li>
                      <li>• Increased fleet efficiency reducing demand</li>
                      <li>• Alternative fuel adoption accelerating</li>
                      <li>• Strategic reserves releases possible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projections Tab */}
          <TabsContent value="projections" className="space-y-6 mt-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Cost Breakdown
                  </CardTitle>
                  <CardDescription>Visual breakdown of your shipping costs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value, currency)}
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px"
                          }}
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Volume Projections
                  </CardTitle>
                  <CardDescription>Estimate your annual fuel surcharge costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Containers per Month</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[containersPerMonth]}
                        onValueChange={(v) => setContainersPerMonth(v[0])}
                        min={1}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="font-bold w-16 text-right">{containersPerMonth}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: `${OCEAN_BLUE}1A`, borderColor: `${OCEAN_BLUE}33` }}>
                      <p className="text-sm text-muted-foreground">Monthly BAF Cost</p>
                      <p className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>
                        {formatCurrency(result.monthlyFuelCost, currency)}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border" style={{ backgroundColor: `${LOGISTICS_GREEN}1A`, borderColor: `${LOGISTICS_GREEN}33` }}>
                      <p className="text-sm text-muted-foreground">Annual Projection</p>
                      <p className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                        {formatCurrency(result.annualProjection, currency)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-medium mb-3">Cost Breakdown (Annual)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Base Freight</span>
                        <span>{formatCurrency(result.baseFreight * containersPerMonth * 12, currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BAF Surcharge</span>
                        <span>{formatCurrency(result.baf * containersPerMonth * 12, currency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CAF Surcharge</span>
                        <span>{formatCurrency(result.caf * containersPerMonth * 12, currency)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-bold">
                        <span>Total Annual Cost</span>
                        <span style={{ color: OCEAN_BLUE }}>
                          {formatCurrency(result.allInRate * containersPerMonth * 12, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Projection Disclaimer</h4>
                    <p className="text-sm text-muted-foreground">
                      Projections are based on current BAF/CAF rates and may fluctuate with fuel prices 
                      and currency movements. Consider hedging strategies for long-term contracts. 
                      Historical data shows BAF volatility of ±15-25% annually on major trade lanes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6 mt-6">
            {/* Educational Sections */}
            <div className="grid lg:grid-cols-2 gap-6">
              {EDUCATIONAL_SECTIONS.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow" style={{ borderColor: `${OCEAN_BLUE}1A` }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="p-2 rounded-lg text-white" style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, ${LOGISTICS_GREEN} 100%)` }}>
                          <Icon className="h-5 w-5" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* FAQs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Comprehensive answers to common questions about BAF, CAF, and fuel surcharges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {FAQ_DATA.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left transition-colors" style={{ color: 'inherit' }}>
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="shrink-0 mt-1">
                            Q{index + 1}
                          </Badge>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-12 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE} 0%, ${LOGISTICS_GREEN} 100%)` }}>
              <CardContent className="p-8 text-white">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Need More Help?</h3>
                    <p className="text-white/80">
                      Access our comprehensive guides and documentation for detailed information on shipping surcharges.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="secondary" className="bg-white hover:bg-white/90" style={{ color: OCEAN_BLUE }}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      View Documentation
                    </Button>
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      <Anchor className="h-4 w-4 mr-2" />
                      Shipping Glossary
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
          <Button variant="outline" size="sm" onClick={() => {
            setBaseFreight("2000");
            setCurrentFuelPrice(600);
            setBaseFuelPrice(500);
            setCafRate(5);
            setContainersPerMonth(10);
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button size="sm" style={{ backgroundColor: OCEAN_BLUE }}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}
