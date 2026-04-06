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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ship,
  Calendar,
  MapPin,
  RefreshCw,
  Download,
  Share2,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Building2,
  LineChart,
  BarChart,
  Globe,
  Anchor,
  Zap,
  Target,
  HelpCircle,
  ChevronRight,
  Activity,
  PieChart,
  TrendingUpIcon,
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
  ComposedChart,
  Area,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { formatCurrency } from "@/lib/constants/currencies";

// Brand Colors
const BRAND_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  secondary: "#6366F1",
  light: "#E8F4F8",
};

// Major Trade Lanes
const TRADE_LANES = {
  ASIA_EUROPE: { name: "Asia - North Europe", code: "AE", avgTransit: 30 },
  ASIA_MED: { name: "Asia - Mediterranean", code: "AM", avgTransit: 28 },
  ASIA_USWC: { name: "Asia - US West Coast", code: "AW", avgTransit: 14 },
  ASIA_USEC: { name: "Asia - US East Coast", code: "AE", avgTransit: 25 },
  EUROPE_US: { name: "Europe - US East Coast", code: "EU", avgTransit: 12 },
  TRANS_PACIFIC: { name: "Trans-Pacific", code: "TP", avgTransit: 18 },
  TRANS_ATLANTIC: { name: "Trans-Atlantic", code: "TA", avgTransit: 10 },
  INTRA_ASIA: { name: "Intra-Asia", code: "IA", avgTransit: 7 },
  ASIA_MEA: { name: "Asia - Middle East", code: "AM", avgTransit: 12 },
  ASIA_LATAM: { name: "Asia - Latin America", code: "AL", avgTransit: 35 },
} as const;

// Major Carriers with rate data
const CARRIERS = {
  MAERSK: { name: "Maersk Line", code: "MSK", marketShare: 16.8 },
  MSC: { name: "MSC", code: "MSC", marketShare: 17.2 },
  CMA_CGM: { name: "CMA CGM", code: "CMDU", marketShare: 12.8 },
  COSCO: { name: "COSCO Shipping", code: "COS", marketShare: 11.5 },
  HAPAG: { name: "Hapag-Lloyd", code: "HLCU", marketShare: 8.9 },
  EVERGREEN: { name: "Evergreen", code: "EGSU", marketShare: 6.5 },
  ONE: { name: "ONE", code: "ONEY", marketShare: 6.2 },
  YANG_MING: { name: "Yang Ming", code: "YMLU", marketShare: 2.8 },
  HMM: { name: "HMM", code: "HMM", marketShare: 2.5 },
  ZIM: { name: "ZIM", code: "ZIM", marketShare: 2.3 },
} as const;

// Historical rate data (12 months simulation)
const HISTORICAL_RATES = {
  ASIA_EUROPE: [
    { month: "Jan", spot: 1850, contract: 1650, index: 100 },
    { month: "Feb", spot: 1920, contract: 1650, index: 103 },
    { month: "Mar", spot: 2100, contract: 1680, index: 108 },
    { month: "Apr", spot: 2350, contract: 1720, index: 115 },
    { month: "May", spot: 2580, contract: 1780, index: 125 },
    { month: "Jun", spot: 2850, contract: 1850, index: 138 },
    { month: "Jul", spot: 3200, contract: 1950, index: 155 },
    { month: "Aug", spot: 3500, contract: 2050, index: 168 },
    { month: "Sep", spot: 3800, contract: 2150, index: 182 },
    { month: "Oct", spot: 3650, contract: 2200, index: 175 },
    { month: "Nov", spot: 3400, contract: 2180, index: 165 },
    { month: "Dec", spot: 3200, contract: 2150, index: 155 },
  ],
  ASIA_USWC: [
    { month: "Jan", spot: 2200, contract: 2000, index: 100 },
    { month: "Feb", spot: 2350, contract: 2000, index: 106 },
    { month: "Mar", spot: 2600, contract: 2050, index: 117 },
    { month: "Apr", spot: 2950, contract: 2120, index: 132 },
    { month: "May", spot: 3300, contract: 2200, index: 148 },
    { month: "Jun", spot: 3650, contract: 2300, index: 163 },
    { month: "Jul", spot: 4100, contract: 2450, index: 183 },
    { month: "Aug", spot: 4500, contract: 2600, index: 200 },
    { month: "Sep", spot: 4200, contract: 2650, index: 188 },
    { month: "Oct", spot: 3800, contract: 2600, index: 170 },
    { month: "Nov", spot: 3500, contract: 2500, index: 157 },
    { month: "Dec", spot: 3200, contract: 2400, index: 144 },
  ],
  ASIA_USEC: [
    { month: "Jan", spot: 3200, contract: 2900, index: 100 },
    { month: "Feb", spot: 3400, contract: 2900, index: 106 },
    { month: "Mar", spot: 3700, contract: 2950, index: 115 },
    { month: "Apr", spot: 4100, contract: 3050, index: 128 },
    { month: "May", spot: 4550, contract: 3200, index: 142 },
    { month: "Jun", spot: 5000, contract: 3400, index: 156 },
    { month: "Jul", spot: 5500, contract: 3600, index: 172 },
    { month: "Aug", spot: 5900, contract: 3800, index: 184 },
    { month: "Sep", spot: 5500, contract: 3900, index: 172 },
    { month: "Oct", spot: 5000, contract: 3800, index: 156 },
    { month: "Nov", spot: 4600, contract: 3650, index: 144 },
    { month: "Dec", spot: 4200, contract: 3500, index: 131 },
  ],
  EUROPE_US: [
    { month: "Jan", spot: 1650, contract: 1500, index: 100 },
    { month: "Feb", spot: 1680, contract: 1500, index: 102 },
    { month: "Mar", spot: 1720, contract: 1520, index: 104 },
    { month: "Apr", spot: 1780, contract: 1550, index: 108 },
    { month: "May", spot: 1850, contract: 1580, index: 112 },
    { month: "Jun", spot: 1920, contract: 1620, index: 116 },
    { month: "Jul", spot: 2000, contract: 1650, index: 121 },
    { month: "Aug", spot: 2080, contract: 1680, index: 126 },
    { month: "Sep", spot: 2050, contract: 1700, index: 124 },
    { month: "Oct", spot: 1980, contract: 1680, index: 120 },
    { month: "Nov", spot: 1900, contract: 1650, index: 115 },
    { month: "Dec", spot: 1820, contract: 1600, index: 110 },
  ],
  INTRA_ASIA: [
    { month: "Jan", spot: 450, contract: 380, index: 100 },
    { month: "Feb", spot: 480, contract: 380, index: 107 },
    { month: "Mar", spot: 520, contract: 400, index: 116 },
    { month: "Apr", spot: 580, contract: 420, index: 129 },
    { month: "May", spot: 650, contract: 450, index: 144 },
    { month: "Jun", spot: 720, contract: 480, index: 160 },
    { month: "Jul", spot: 800, contract: 520, index: 178 },
    { month: "Aug", spot: 850, contract: 550, index: 189 },
    { month: "Sep", spot: 820, contract: 560, index: 182 },
    { month: "Oct", spot: 750, contract: 540, index: 167 },
    { month: "Nov", spot: 680, contract: 510, index: 151 },
    { month: "Dec", spot: 600, contract: 480, index: 133 },
  ],
};

// Carrier market share data for pie chart
const carrierMarketShareData = [
  { name: "MSC", value: 17.2, color: BRAND_COLORS.ocean },
  { name: "Maersk", value: 16.8, color: BRAND_COLORS.logistics },
  { name: "CMA CGM", value: 12.8, color: "#6366F1" },
  { name: "COSCO", value: 11.5, color: "#F59E0B" },
  { name: "Hapag-Lloyd", value: 8.9, color: "#EF4444" },
  { name: "Others", value: 32.8, color: "#94A3B8" },
];

// Trade lane performance data for radar chart
const tradeLanePerformanceData = [
  { lane: "Cost", ASIA_EUROPE: 85, ASIA_USWC: 75, EUROPE_US: 95 },
  { lane: "Speed", ASIA_EUROPE: 70, ASIA_USWC: 85, EUROPE_US: 90 },
  { lane: "Reliability", ASIA_EUROPE: 80, ASIA_USWC: 78, EUROPE_US: 92 },
  { lane: "Capacity", ASIA_EUROPE: 90, ASIA_USWC: 85, EUROPE_US: 75 },
  { lane: "Coverage", ASIA_EUROPE: 95, ASIA_USWC: 80, EUROPE_US: 85 },
];

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is the difference between spot rates and contract rates?",
    answer: "Spot rates are real-time market prices that fluctuate based on supply and demand. They offer flexibility but come with price volatility. Contract rates are fixed prices agreed upon for a specific period (typically 3-12 months), providing cost certainty and often lower rates for committed volumes. Contract rates typically offer 8-15% savings compared to spot rates during stable market conditions."
  },
  {
    question: "How often should I benchmark my freight rates?",
    answer: "We recommend benchmarking freight rates quarterly for active trade lanes, and monthly during periods of high market volatility. Regular benchmarking helps identify cost optimization opportunities and ensures your rates remain competitive. For contract negotiations, start benchmarking 2-3 months before renewal dates."
  },
  {
    question: "What factors influence freight rate fluctuations?",
    answer: "Key factors include: fuel prices (BAF adjustments), seasonal demand (peak seasons Aug-Oct), vessel capacity availability, port congestion, geopolitical events, currency exchange rates, and trade imbalances. Understanding these factors helps predict rate movements and optimize booking timing."
  },
  {
    question: "When should I choose spot rates over contract rates?",
    answer: "Choose spot rates when: market rates are declining, you have unpredictable volumes, you're testing new trade lanes, or you need maximum flexibility. Spot rates are ideal for short-term needs and when you can time your shipments during low-demand periods for better pricing."
  },
  {
    question: "What volume is needed to negotiate contract rates?",
    answer: "Typically, carriers require minimum commitments of 50-100 TEU per month for meaningful contract negotiations. The break-even volume depends on the rate differential - generally, if you ship more than 10-15 containers monthly on a consistent trade lane, contract rates offer better value."
  },
  {
    question: "How do I calculate total landed cost using freight rates?",
    answer: "Total landed cost = Freight rate + Origin charges (THC, documentation) + Destination charges (THC, customs clearance) + Inland transportation + Insurance + Duties/taxes. Our benchmark shows the base freight component typically represents 40-60% of total landed cost for ocean shipments."
  },
  {
    question: "What are the major trade lanes and their characteristics?",
    answer: "Major lanes include: Asia-Europe (largest volume, peak season Jul-Oct), Trans-Pacific (high volatility, US import dependency), Trans-Atlantic (stable rates, balanced trade), and Intra-Asia (short transit, competitive pricing). Each has unique seasonal patterns and carrier options."
  },
  {
    question: "How can I reduce my freight costs effectively?",
    answer: "Strategies include: negotiating volume-based contracts, using a mix of spot and contract rates (hybrid approach), optimizing container utilization, considering alternative ports, booking during off-peak periods, consolidating shipments, and leveraging competitive bidding between carriers."
  },
];

// Carrier rate comparison data (per trade lane)
const getCarrierRates = (tradeLane: keyof typeof TRADE_LANES) => {
  const baseRates: Record<keyof typeof TRADE_LANES, number> = {
    ASIA_EUROPE: 2850,
    ASIA_MED: 2650,
    ASIA_USWC: 3200,
    ASIA_USEC: 4200,
    EUROPE_US: 1800,
    TRANS_PACIFIC: 3400,
    TRANS_ATLANTIC: 1650,
    INTRA_ASIA: 650,
    ASIA_MEA: 1200,
    ASIA_LATAM: 4500,
  };

  const base = baseRates[tradeLane] || 2500;
  return Object.entries(CARRIERS).map(([key, carrier]) => {
    const variance = (Math.random() - 0.5) * 0.2;
    const spotRate = Math.round(base * (1 + variance));
    const contractRate = Math.round(spotRate * 0.88);
    return {
      carrier: key,
      name: carrier.name,
      code: carrier.code,
      marketShare: carrier.marketShare,
      spotRate,
      contractRate,
      difference: spotRate - contractRate,
      diffPercent: ((spotRate - contractRate) / spotRate) * 100,
    };
  }).sort((a, b) => a.spotRate - b.spotRate);
};

// Spot vs Contract Analysis
interface RateAnalysis {
  currentSpot: number;
  currentContract: number;
  spotChange: number;
  contractChange: number;
  recommendation: "spot" | "contract" | "hybrid";
  savings: number;
  breakEvenVolume: number;
}

interface FreightRateBenchmarkProps {
  onRateSelect?: (carrier: string, rate: number, type: "spot" | "contract") => void;
}

export function FreightRateBenchmark({ onRateSelect }: FreightRateBenchmarkProps) {
  const [activeTab, setActiveTab] = useState("comparison");
  const [currency, setCurrency] = useState("USD");
  const [containerType, setContainerType] = useState<string>("40HC");
  const [selectedLane, setSelectedLane] = useState<keyof typeof TRADE_LANES>("ASIA_EUROPE");
  const [volume, setVolume] = useState<number>(50);
  const [contractLength, setContractLength] = useState<number>(6);

  // Get carrier rates for selected lane
  const carrierRates = useMemo(() => getCarrierRates(selectedLane), [selectedLane]);

  // Get historical data for selected lane
  const historicalData = useMemo(() => {
    return HISTORICAL_RATES[selectedLane as keyof typeof HISTORICAL_RATES] || HISTORICAL_RATES.ASIA_EUROPE;
  }, [selectedLane]);

  // Rate analysis
  const rateAnalysis = useMemo((): RateAnalysis => {
    const currentSpot = historicalData[historicalData.length - 1].spot;
    const prevSpot = historicalData[historicalData.length - 2].spot;
    const currentContract = historicalData[historicalData.length - 1].contract;
    const prevContract = historicalData[historicalData.length - 2].contract;

    const spotChange = ((currentSpot - prevSpot) / prevSpot) * 100;
    const contractChange = ((currentContract - prevContract) / prevContract) * 100;

    const avgSpotDiff = historicalData.reduce((sum, d) => sum + (d.spot - d.contract), 0) / historicalData.length;
    const volatility = historicalData.reduce((sum, d, i, arr) => {
      if (i === 0) return 0;
      return sum + Math.abs((d.spot - arr[i - 1].spot) / arr[i - 1].spot);
    }, 0) / (historicalData.length - 1) * 100;

    let recommendation: "spot" | "contract" | "hybrid" = "hybrid";
    if (volatility > 15 && spotChange < 0) recommendation = "spot";
    else if (volatility < 10 || avgSpotDiff > 400) recommendation = "contract";

    const savings = recommendation === "contract"
      ? (currentSpot - currentContract) * volume * contractLength
      : recommendation === "hybrid"
      ? (currentSpot - currentContract) * volume * contractLength * 0.5
      : 0;

    const breakEvenVolume = Math.ceil(5000 / (currentSpot - currentContract));

    return {
      currentSpot,
      currentContract,
      spotChange,
      contractChange,
      recommendation,
      savings,
      breakEvenVolume,
    };
  }, [historicalData, volume, contractLength]);

  // Market trend data
  const marketTrend = useMemo(() => {
    const last3 = historicalData.slice(-3);
    const avgSpot = last3.reduce((sum, d) => sum + d.spot, 0) / 3;
    const avgContract = last3.reduce((sum, d) => sum + d.contract, 0) / 3;
    const trend = historicalData[historicalData.length - 1].spot > historicalData[0].spot ? "up" :
                  historicalData[historicalData.length - 1].spot < historicalData[0].spot ? "down" : "stable";
    return { avgSpot, avgContract, trend };
  }, [historicalData]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-red-500" />;
      case "down": return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden rounded-2xl p-8 md:p-12"
        style={{ 
          background: `linear-gradient(135deg, ${BRAND_COLORS.ocean} 0%, ${BRAND_COLORS.logistics} 100%)`,
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Anchor className="h-8 w-8 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                  Real-time Data
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Freight Rate Benchmark
              </h1>
              <p className="text-lg text-white/90 mb-6 max-w-2xl">
                Compare carrier rates across major trade lanes, analyze spot vs contract pricing, 
                and make data-driven decisions to optimize your shipping costs.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <Globe className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">10+ Trade Lanes</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <Building2 className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">10 Major Carriers</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                  <Activity className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">12-Month History</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:w-80">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-white/80 text-sm">Current Spot</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(rateAnalysis.currentSpot, currency)}</p>
                <p className={`text-sm mt-1 ${rateAnalysis.spotChange > 0 ? "text-red-300" : "text-green-300"}`}>
                  {rateAnalysis.spotChange > 0 ? "+" : ""}{rateAnalysis.spotChange.toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-white/80 text-sm">Contract Rate</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(rateAnalysis.currentContract, currency)}</p>
                <p className={`text-sm mt-1 ${rateAnalysis.contractChange > 0 ? "text-red-300" : "text-green-300"}`}>
                  {rateAnalysis.contractChange > 0 ? "+" : ""}{rateAnalysis.contractChange.toFixed(1)}%
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-white/80 text-sm">Savings Potential</p>
                <p className="text-2xl font-bold text-green-300">
                  {(((rateAnalysis.currentSpot - rateAnalysis.currentContract) / rateAnalysis.currentSpot) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-white/80 text-sm">Recommendation</p>
                <p className="text-lg font-bold text-white capitalize">{rateAnalysis.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="comparison" className="text-sm md:text-base">Carrier Comparison</TabsTrigger>
          <TabsTrigger value="spot-contract" className="text-sm md:text-base">Spot vs Contract</TabsTrigger>
          <TabsTrigger value="trends" className="text-sm md:text-base">Historical Trends</TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm md:text-base">Analytics</TabsTrigger>
          <TabsTrigger value="lanes" className="text-sm md:text-base">Trade Lanes</TabsTrigger>
        </TabsList>

        {/* Carrier Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Filters */}
            <Card className="lg:col-span-1 border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Benchmark Parameters
                </CardTitle>
                <CardDescription>Select trade lane and container type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Trade Lane</Label>
                  <Select value={selectedLane} onValueChange={(v) => setSelectedLane(v as keyof typeof TRADE_LANES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRADE_LANES).map(([key, lane]) => (
                        <SelectItem key={key} value={key}>
                          {lane.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Container Type</Label>
                  <Select value={containerType} onValueChange={setContainerType}>
                    <SelectTrigger>
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
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="CNY">CNY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="p-3 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.ocean}15` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" style={{ color: BRAND_COLORS.ocean }} />
                    <span className="font-medium">{TRADE_LANES[selectedLane].name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Avg. Transit:</span>
                      <span className="font-medium">{TRADE_LANES[selectedLane].avgTransit} days</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Current Spot:</span>
                      <span className="font-medium" style={{ color: BRAND_COLORS.ocean }}>{formatCurrency(rateAnalysis.currentSpot, currency)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rate Chart */}
            <Card className="lg:col-span-2 border-t-4" style={{ borderTopColor: BRAND_COLORS.logistics }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                  Carrier Rate Comparison
                </CardTitle>
                <CardDescription>Spot rates per {containerType} container on {TRADE_LANES[selectedLane].name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={carrierRates} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency)} />
                      <YAxis dataKey="code" type="category" width={50} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrency(value, currency),
                          name === "spotRate" ? "Spot Rate" : "Contract Rate"
                        ]}
                        labelFormatter={(label) => carrierRates.find(c => c.code === label)?.name || label}
                      />
                      <Legend />
                      <Bar dataKey="spotRate" fill={BRAND_COLORS.ocean} name="Spot Rate" radius={[0, 4, 4, 0]}>
                        {carrierRates.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? BRAND_COLORS.logistics : BRAND_COLORS.ocean} />
                        ))}
                      </Bar>
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>

                <Separator className="my-4" />

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left py-2 px-3">Carrier</th>
                        <th className="text-right py-2 px-3">Spot Rate</th>
                        <th className="text-right py-2 px-3">Contract Rate</th>
                        <th className="text-right py-2 px-3">Savings</th>
                        <th className="text-right py-2 px-3">Market Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carrierRates.slice(0, 6).map((row, idx) => (
                        <tr key={row.carrier} className={`border-b ${idx === 0 ? "bg-green-50" : ""}`}>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              {idx === 0 && <Badge className="text-xs" style={{ backgroundColor: BRAND_COLORS.logistics }}>Best</Badge>}
                              <span className="font-medium">{row.name}</span>
                            </div>
                          </td>
                          <td className="text-right py-2 px-3 font-medium" style={{ color: BRAND_COLORS.ocean }}>
                            {formatCurrency(row.spotRate, currency)}
                          </td>
                          <td className="text-right py-2 px-3" style={{ color: BRAND_COLORS.logistics }}>
                            {formatCurrency(row.contractRate, currency)}
                          </td>
                          <td className="text-right py-2 px-3">
                            <Badge variant="outline" style={{ color: BRAND_COLORS.logistics, borderColor: BRAND_COLORS.logistics }}>
                              {row.diffPercent.toFixed(1)}%
                            </Badge>
                          </td>
                          <td className="text-right py-2 px-3 text-muted-foreground">
                            {row.marketShare}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spot vs Contract Tab */}
        <TabsContent value="spot-contract" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Analysis Inputs */}
            <Card className="border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Your Requirements
                </CardTitle>
                <CardDescription>Configure your shipping needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Trade Lane</Label>
                  <Select value={selectedLane} onValueChange={(v) => setSelectedLane(v as keyof typeof TRADE_LANES)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(TRADE_LANES).map(([key, lane]) => (
                        <SelectItem key={key} value={key}>
                          {lane.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Containers per Month</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[volume]}
                      onValueChange={(v) => setVolume(v[0])}
                      min={1}
                      max={200}
                      step={1}
                      className="flex-1"
                    />
                    <span className="font-bold w-16 text-right">{volume}</span>
                  </div>
                </div>

                <div>
                  <Label>Contract Length (months)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[contractLength]}
                      onValueChange={(v) => setContractLength(v[0])}
                      min={1}
                      max={24}
                      step={1}
                      className="flex-1"
                    />
                    <span className="font-bold w-16 text-right">{contractLength}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Rates */}
            <Card className="border-t-4" style={{ borderTopColor: BRAND_COLORS.logistics }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                  Current Rates
                </CardTitle>
                <CardDescription>Spot vs Contract comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.ocean}15` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Spot Rate</span>
                      {rateAnalysis.spotChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      ) : rateAnalysis.spotChange < 0 ? (
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                      {formatCurrency(rateAnalysis.currentSpot, currency)}
                    </p>
                    <p className={`text-xs mt-1 ${rateAnalysis.spotChange > 0 ? "text-red-500" : "text-green-500"}`}>
                      {rateAnalysis.spotChange > 0 ? "+" : ""}{rateAnalysis.spotChange.toFixed(1)}% vs last month
                    </p>
                  </div>

                  <div className="p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.logistics}15` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Contract Rate</span>
                      {rateAnalysis.contractChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      ) : rateAnalysis.contractChange < 0 ? (
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                      {formatCurrency(rateAnalysis.currentContract, currency)}
                    </p>
                    <p className={`text-xs mt-1 ${rateAnalysis.contractChange > 0 ? "text-red-500" : "text-green-500"}`}>
                      {rateAnalysis.contractChange > 0 ? "+" : ""}{rateAnalysis.contractChange.toFixed(1)}% vs last month
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Rate Differential</span>
                    <Badge style={{ backgroundColor: BRAND_COLORS.logistics }}>
                      {formatCurrency(rateAnalysis.currentSpot - rateAnalysis.currentContract, currency)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Contract Savings %</span>
                    <span className="font-bold" style={{ color: BRAND_COLORS.logistics }}>
                      {(((rateAnalysis.currentSpot - rateAnalysis.currentContract) / rateAnalysis.currentSpot) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendation */}
            <Card className="border-2" style={{ 
              borderColor: rateAnalysis.recommendation === "contract" ? BRAND_COLORS.logistics :
                rateAnalysis.recommendation === "spot" ? BRAND_COLORS.ocean : BRAND_COLORS.warning 
            }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" style={{ 
                    color: rateAnalysis.recommendation === "contract" ? BRAND_COLORS.logistics :
                      rateAnalysis.recommendation === "spot" ? BRAND_COLORS.ocean : BRAND_COLORS.warning 
                  }} />
                  Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4">
                  <Badge className="text-lg px-6 py-2" style={{ 
                    backgroundColor: rateAnalysis.recommendation === "contract" ? BRAND_COLORS.logistics :
                      rateAnalysis.recommendation === "spot" ? BRAND_COLORS.ocean : BRAND_COLORS.warning 
                  }}>
                    Choose {rateAnalysis.recommendation.toUpperCase()}
                  </Badge>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    {rateAnalysis.recommendation === "contract" && (
                      <>
                        Based on current market conditions, a <strong>contract rate</strong> offers better value.
                        Lock in rates now to secure savings and protect against volatility.
                      </>
                    )}
                    {rateAnalysis.recommendation === "spot" && (
                      <>
                        Current market suggests <strong>spot rates</strong> may offer better value.
                        Spot rates are trending down, consider waiting for better contract terms.
                      </>
                    )}
                    {rateAnalysis.recommendation === "hybrid" && (
                      <>
                        A <strong>hybrid approach</strong> is recommended. Consider splitting volume
                        between spot and contract to balance flexibility and cost certainty.
                      </>
                    )}
                  </p>

                  {rateAnalysis.savings > 0 && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-medium">Potential Savings</span>
                      <span className="text-xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                        {formatCurrency(rateAnalysis.savings, currency)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.ocean}15` }}>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" style={{ color: BRAND_COLORS.ocean }} />
                    <span className="text-sm font-medium">Break-even Volume</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    You need at least <strong>{rateAnalysis.breakEvenVolume} containers/month</strong> to justify
                    contract negotiations on this trade lane.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Projection */}
          <Card className="border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Cost Projection ({contractLength} months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value, currency),
                        name === "spot" ? "Spot Rate" : "Contract Rate"
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="spot"
                      stroke={BRAND_COLORS.ocean}
                      strokeWidth={3}
                      dot={{ fill: BRAND_COLORS.ocean }}
                      name="spot"
                    />
                    <Line
                      type="monotone"
                      dataKey="contract"
                      stroke={BRAND_COLORS.logistics}
                      strokeWidth={3}
                      dot={{ fill: BRAND_COLORS.logistics }}
                      name="contract"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${BRAND_COLORS.ocean}15` }}>
                  <p className="text-sm text-muted-foreground">Spot Total Cost</p>
                  <p className="text-xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                    {formatCurrency(rateAnalysis.currentSpot * volume * contractLength, currency)}
                  </p>
                </div>
                <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${BRAND_COLORS.logistics}15` }}>
                  <p className="text-sm text-muted-foreground">Contract Total Cost</p>
                  <p className="text-xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                    {formatCurrency(rateAnalysis.currentContract * volume * contractLength, currency)}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Your Savings</p>
                  <p className="text-xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                    {formatCurrency((rateAnalysis.currentSpot - rateAnalysis.currentContract) * volume * contractLength, currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historical Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card className="border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Historical Rate Trends
              </CardTitle>
              <CardDescription>12-month rate history and market index</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-6">
                {Object.entries(TRADE_LANES).slice(0, 5).map(([key, lane]) => (
                  <Button
                    key={key}
                    variant={selectedLane === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLane(key as keyof typeof TRADE_LANES)}
                    style={selectedLane === key ? { backgroundColor: BRAND_COLORS.ocean } : {}}
                  >
                    {lane.name}
                  </Button>
                ))}
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => v} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "index" ? value : formatCurrency(value, currency),
                        name === "spot" ? "Spot Rate" : name === "contract" ? "Contract Rate" : "Rate Index"
                      ]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="spot"
                      fill={BRAND_COLORS.ocean}
                      fillOpacity={0.2}
                      stroke={BRAND_COLORS.ocean}
                      strokeWidth={2}
                      name="spot"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="contract"
                      stroke={BRAND_COLORS.logistics}
                      strokeWidth={2}
                      dot={{ fill: BRAND_COLORS.logistics }}
                      name="contract"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="index"
                      stroke={BRAND_COLORS.warning}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      name="index"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.ocean}15` }}>
                  <p className="text-sm text-muted-foreground">Current Spot</p>
                  <p className="text-xl font-bold" style={{ color: BRAND_COLORS.ocean }}>
                    {formatCurrency(rateAnalysis.currentSpot, currency)}
                  </p>
                  <p className={`text-xs mt-1 ${rateAnalysis.spotChange > 0 ? "text-red-500" : "text-green-500"}`}>
                    {rateAnalysis.spotChange > 0 ? "+" : ""}{rateAnalysis.spotChange.toFixed(1)}% MoM
                  </p>
                </div>
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.logistics}15` }}>
                  <p className="text-sm text-muted-foreground">Current Contract</p>
                  <p className="text-xl font-bold" style={{ color: BRAND_COLORS.logistics }}>
                    {formatCurrency(rateAnalysis.currentContract, currency)}
                  </p>
                  <p className={`text-xs mt-1 ${rateAnalysis.contractChange > 0 ? "text-red-500" : "text-green-500"}`}>
                    {rateAnalysis.contractChange > 0 ? "+" : ""}{rateAnalysis.contractChange.toFixed(1)}% MoM
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. 3-Month Spot</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(marketTrend.avgSpot, currency)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {getTrendIcon(marketTrend.trend)}
                    <span className="text-xs capitalize">{marketTrend.trend} trend</span>
                  </div>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg. 3-Month Contract</p>
                  <p className="text-xl font-bold">
                    {formatCurrency(marketTrend.avgContract, currency)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">Stable</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Market Drivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                    <div>
                      <span className="font-medium">Peak Season Demand</span>
                      <p className="text-sm text-muted-foreground">
                        Pre-holiday inventory building driving rate increases
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                    <div>
                      <span className="font-medium">Capacity Constraints</span>
                      <p className="text-sm text-muted-foreground">
                        Limited vessel availability on key trade lanes
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: BRAND_COLORS.logistics }} />
                    <div>
                      <span className="font-medium">Fuel Price Impact</span>
                      <p className="text-sm text-muted-foreground">
                        BAF surcharges adjusted quarterly based on fuel costs
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium">Port Congestion</span>
                      <p className="text-sm text-muted-foreground">
                        Major ports experiencing 3-5 day delays
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Download className="h-4 w-4" style={{ color: BRAND_COLORS.ocean }} />
                  Export Rate Report
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Share2 className="h-4 w-4" style={{ color: BRAND_COLORS.logistics }} />
                  Share with Team
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <RefreshCw className="h-4 w-4" style={{ color: BRAND_COLORS.ocean }} />
                  Refresh Market Data
                </Button>
                <Button className="w-full justify-start gap-2" variant="outline">
                  <Target className="h-4 w-4" style={{ color: BRAND_COLORS.logistics }} />
                  Set Rate Alert
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Carrier Market Share */}
            <Card className="border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  Carrier Market Share
                </CardTitle>
                <CardDescription>Global container shipping market distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={carrierMarketShareData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {carrierMarketShareData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [`${value}%`, "Market Share"]}
                      />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Trade Lane Performance */}
            <Card className="border-t-4" style={{ borderTopColor: BRAND_COLORS.logistics }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                  Trade Lane Performance
                </CardTitle>
                <CardDescription>Comparative analysis across major lanes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={tradeLanePerformanceData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="lane" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Asia-Europe"
                        dataKey="ASIA_EUROPE"
                        stroke={BRAND_COLORS.ocean}
                        fill={BRAND_COLORS.ocean}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Asia-USWC"
                        dataKey="ASIA_USWC"
                        stroke={BRAND_COLORS.logistics}
                        fill={BRAND_COLORS.logistics}
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Europe-US"
                        dataKey="EUROPE_US"
                        stroke={BRAND_COLORS.warning}
                        fill={BRAND_COLORS.warning}
                        fillOpacity={0.3}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rate Index Comparison */}
          <Card className="border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUpIcon className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                Rate Index Comparison
              </CardTitle>
              <CardDescription>Spot rate index across all major trade lanes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="index"
                      stroke={BRAND_COLORS.ocean}
                      strokeWidth={3}
                      dot={{ fill: BRAND_COLORS.ocean }}
                      name="Rate Index"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.ocean}15` }}>
                    <Ship className="h-5 w-5" style={{ color: BRAND_COLORS.ocean }} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Vessels</p>
                    <p className="text-xl font-bold">6,542</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${BRAND_COLORS.logistics}15` }}>
                    <Globe className="h-5 w-5" style={{ color: BRAND_COLORS.logistics }} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ports Covered</p>
                    <p className="text-xl font-bold">930+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <BarChart className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">TEU Capacity</p>
                    <p className="text-xl font-bold">25.4M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Sailings</p>
                    <p className="text-xl font-bold">1,240</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trade Lanes Tab */}
        <TabsContent value="lanes" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(TRADE_LANES).map(([key, lane]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all hover:shadow-lg border-t-4 ${selectedLane === key ? "ring-2 ring-offset-2" : ""}`}
                style={{ borderTopColor: selectedLane === key ? BRAND_COLORS.ocean : BRAND_COLORS.logistics }}
                onClick={() => setSelectedLane(key as keyof typeof TRADE_LANES)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{lane.name}</CardTitle>
                    <Badge variant="outline">{lane.code}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Transit Time</span>
                      <span className="font-medium">{lane.avgTransit} days</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Spot Rate</span>
                      <span className="font-medium" style={{ color: BRAND_COLORS.ocean }}>
                        {formatCurrency(HISTORICAL_RATES[key as keyof typeof HISTORICAL_RATES]?.[11]?.spot || 0, currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Contract Rate</span>
                      <span className="font-medium" style={{ color: BRAND_COLORS.logistics }}>
                        {formatCurrency(HISTORICAL_RATES[key as keyof typeof HISTORICAL_RATES]?.[11]?.contract || 0, currency)}
                      </span>
                    </div>
                    <Button 
                      className="w-full mt-2" 
                      variant={selectedLane === key ? "default" : "outline"}
                      style={selectedLane === key ? { backgroundColor: BRAND_COLORS.ocean } : {}}
                    >
                      {selectedLane === key ? "Selected" : "Select Lane"}
                      {selectedLane !== key && <ChevronRight className="h-4 w-4 ml-1" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* FAQ Section */}
      <Card className="border-t-4" style={{ borderTopColor: BRAND_COLORS.ocean }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="h-6 w-6" style={{ color: BRAND_COLORS.ocean }} />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Get answers to common questions about freight rate benchmarking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: BRAND_COLORS.ocean }}
                    >
                      {index + 1}
                    </div>
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-11 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Footer CTA */}
      <div 
        className="rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ background: `linear-gradient(135deg, ${BRAND_COLORS.ocean}15 0%, ${BRAND_COLORS.logistics}15 100%)` }}
      >
        <div>
          <h3 className="text-xl font-bold mb-1">Need Custom Rate Analysis?</h3>
          <p className="text-muted-foreground">
            Get personalized freight rate insights for your specific shipping lanes and volumes.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="gap-2 text-white" style={{ backgroundColor: BRAND_COLORS.ocean }}>
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
}
