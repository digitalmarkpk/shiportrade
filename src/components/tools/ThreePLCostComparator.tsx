"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Warehouse,
  Package,
  Truck,
  Plug,
  TrendingUp,
  AlertCircle,
  Info,
  ArrowRight,
  DollarSign,
  BarChart3,
  Scale,
  Globe,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Award,
  RefreshCw,
  Building2,
  ShoppingCart,
  Layers,
  Target,
  LineChart,
  Crown,
  Medal,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PieChart,
  Pie,
  Cell,
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
  AreaChart,
  Area,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// 3PL Provider Data
interface ThreePLProvider {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  features: string[];
  integrationTypes: ("API" | "EDI" | "Portal" | "Manual")[];
  fulfillmentCenters: number;
  countries: number;
  
  // Pricing
  warehousingRatePerPallet: number; // per pallet per month
  warehousingRatePerCubicFt: number; // per cubic ft per month
  
  pickPackFee: number; // per order
  pickPackFeePerItem: number; // additional per item
  
  shippingBaseRate: number; // base rate per shipment
  shippingPerPound: number; // per lb
  shippingPerZone: number; // additional per zone
  
  integrationFee: number; // one-time
  integrationMonthly: number; // monthly
  integrationAPI: number; // API integration cost
  
  minimumMonthly: number; // minimum monthly fee
  onboardingFee: number; // one-time setup
  
  // Service factors
  accuracyRate: number; // percentage
  avgShipTime: number; // days
  returnsHandling: number; // per return
}

const threePLProviders: ThreePLProvider[] = [
  {
    id: "shipbob",
    name: "ShipBob",
    rating: 4.5,
    features: ["Same-day shipping", "Inventory management", "B2B fulfillment", "Returns processing"],
    integrationTypes: ["API", "Portal"],
    fulfillmentCenters: 50,
    countries: 6,
    warehousingRatePerPallet: 25,
    warehousingRatePerCubicFt: 0.45,
    pickPackFee: 1.50,
    pickPackFeePerItem: 0.25,
    shippingBaseRate: 4.50,
    shippingPerPound: 0.35,
    shippingPerZone: 0.75,
    integrationFee: 0,
    integrationMonthly: 0,
    integrationAPI: 0,
    minimumMonthly: 0,
    onboardingFee: 0,
    accuracyRate: 99.5,
    avgShipTime: 1.5,
    returnsHandling: 3.50,
  },
  {
    id: "fulfillment-by-amazon",
    name: "Amazon FBA",
    rating: 4.3,
    features: ["Prime eligibility", "Global fulfillment", "Customer service", "Multi-channel"],
    integrationTypes: ["API", "Portal"],
    fulfillmentCenters: 185,
    countries: 20,
    warehousingRatePerPallet: 30,
    warehousingRatePerCubicFt: 0.87,
    pickPackFee: 3.22,
    pickPackFeePerItem: 0.00,
    shippingBaseRate: 5.40,
    shippingPerPound: 0.38,
    shippingPerZone: 0.00,
    integrationFee: 0,
    integrationMonthly: 39.99,
    integrationAPI: 0,
    minimumMonthly: 0,
    onboardingFee: 0,
    accuracyRate: 99.9,
    avgShipTime: 1.0,
    returnsHandling: 0.00,
  },
  {
    id: "redstage",
    name: "Red Stag Fulfillment",
    rating: 4.7,
    features: ["Heavy items specialty", "Zero-error guarantee", "Kitting services", "Custom packaging"],
    integrationTypes: ["API", "EDI", "Portal"],
    fulfillmentCenters: 2,
    countries: 1,
    warehousingRatePerPallet: 18,
    warehousingRatePerCubicFt: 0.35,
    pickPackFee: 2.25,
    pickPackFeePerItem: 0.30,
    shippingBaseRate: 5.00,
    shippingPerPound: 0.40,
    shippingPerZone: 0.85,
    integrationFee: 500,
    integrationMonthly: 100,
    integrationAPI: 0,
    minimumMonthly: 250,
    onboardingFee: 500,
    accuracyRate: 99.99,
    avgShipTime: 2.0,
    returnsHandling: 5.00,
  },
  {
    id: "shiphero",
    name: "ShipHero",
    rating: 4.4,
    features: ["WMS included", "Batch picking", "Multi-warehouse", "Real-time inventory"],
    integrationTypes: ["API", "Portal"],
    fulfillmentCenters: 10,
    countries: 3,
    warehousingRatePerPallet: 22,
    warehousingRatePerCubicFt: 0.40,
    pickPackFee: 1.75,
    pickPackFeePerItem: 0.20,
    shippingBaseRate: 4.25,
    shippingPerPound: 0.32,
    shippingPerZone: 0.70,
    integrationFee: 0,
    integrationMonthly: 150,
    integrationAPI: 0,
    minimumMonthly: 0,
    onboardingFee: 250,
    accuracyRate: 99.7,
    avgShipTime: 1.8,
    returnsHandling: 4.00,
  },
  {
    id: "routific",
    name: "ShipRush (Routific)",
    rating: 4.2,
    features: ["Small business focus", "Easy integration", "Rate shopping", "Label printing"],
    integrationTypes: ["API", "Portal", "Manual"],
    fulfillmentCenters: 5,
    countries: 2,
    warehousingRatePerPallet: 28,
    warehousingRatePerCubicFt: 0.50,
    pickPackFee: 1.25,
    pickPackFeePerItem: 0.15,
    shippingBaseRate: 3.95,
    shippingPerPound: 0.28,
    shippingPerZone: 0.60,
    integrationFee: 0,
    integrationMonthly: 29.99,
    integrationAPI: 0,
    minimumMonthly: 0,
    onboardingFee: 0,
    accuracyRate: 98.5,
    avgShipTime: 2.5,
    returnsHandling: 2.50,
  },
  {
    id: "fedex-supply-chain",
    name: "FedEx Supply Chain",
    rating: 4.6,
    features: ["Global network", "Returns management", "Value-added services", "Customs brokerage"],
    integrationTypes: ["API", "EDI", "Portal"],
    fulfillmentCenters: 130,
    countries: 15,
    warehousingRatePerPallet: 32,
    warehousingRatePerCubicFt: 0.55,
    pickPackFee: 2.00,
    pickPackFeePerItem: 0.28,
    shippingBaseRate: 5.50,
    shippingPerPound: 0.42,
    shippingPerZone: 0.90,
    integrationFee: 1000,
    integrationMonthly: 200,
    integrationAPI: 500,
    minimumMonthly: 500,
    onboardingFee: 1500,
    accuracyRate: 99.8,
    avgShipTime: 1.2,
    returnsHandling: 6.00,
  },
  {
    id: "cfl",
    name: "CFL (Capacity LLC)",
    rating: 4.3,
    features: ["Mid-market focus", "Custom solutions", "Subscription boxes", "Crowdfunding"],
    integrationTypes: ["API", "Portal"],
    fulfillmentCenters: 8,
    countries: 2,
    warehousingRatePerPallet: 20,
    warehousingRatePerCubicFt: 0.38,
    pickPackFee: 1.60,
    pickPackFeePerItem: 0.22,
    shippingBaseRate: 4.40,
    shippingPerPound: 0.34,
    shippingPerZone: 0.72,
    integrationFee: 250,
    integrationMonthly: 75,
    integrationAPI: 0,
    minimumMonthly: 100,
    onboardingFee: 300,
    accuracyRate: 99.4,
    avgShipTime: 2.0,
    returnsHandling: 3.75,
  },
  {
    id: "dhl-ecommerce",
    name: "DHL eCommerce",
    rating: 4.4,
    features: ["International expertise", "Parcel consolidation", "Customs handling", "Last-mile delivery"],
    integrationTypes: ["API", "EDI", "Portal"],
    fulfillmentCenters: 45,
    countries: 220,
    warehousingRatePerPallet: 28,
    warehousingRatePerCubicFt: 0.48,
    pickPackFee: 1.85,
    pickPackFeePerItem: 0.24,
    shippingBaseRate: 4.80,
    shippingPerPound: 0.36,
    shippingPerZone: 0.00,
    integrationFee: 500,
    integrationMonthly: 50,
    integrationAPI: 200,
    minimumMonthly: 0,
    onboardingFee: 200,
    accuracyRate: 99.6,
    avgShipTime: 1.5,
    returnsHandling: 4.50,
  },
];

// Zone distance multipliers for shipping
const zoneMultipliers = {
  zone1: 0.8,
  zone2: 0.9,
  zone3: 1.0,
  zone4: 1.1,
  zone5: 1.2,
  zone6: 1.3,
  zone7: 1.4,
  zone8: 1.5,
};

type Currency = keyof typeof currencies;
type ShippingZone = keyof typeof zoneMultipliers;
type IntegrationType = "API" | "EDI" | "Portal" | "Manual";

interface ThreePLInputs {
  // Business parameters
  ordersPerMonth: number;
  itemsPerOrder: number;
  avgOrderWeight: number; // lbs
  avgOrderValue: number;
  
  // Inventory parameters
  palletPositions: number;
  cubicFeet: number;
  
  // Shipping parameters
  shippingZone: ShippingZone;
  intlShippingPercent: number; // percentage of international orders
  
  // Returns
  returnRate: number; // percentage
  
  // Integration
  integrationType: IntegrationType;
  useCustomAPI: boolean;
  
  // Analysis period
  analysisMonths: number;
  
  // Currency
  currency: Currency;
  
  // Selected providers for comparison
  selectedProviders: string[];
}

interface ProviderCostBreakdown {
  providerId: string;
  providerName: string;
  
  warehousingCost: number;
  pickPackCost: number;
  shippingCost: number;
  integrationCost: number;
  returnsCost: number;
  onboardingCost: number;
  minimumCost: number;
  
  totalMonthlyCost: number;
  totalAnnualCost: number;
  costPerOrder: number;
  
  // Break-even vs in-house (assumed)
  breakEvenOrders: number;
  
  // Score factors
  accuracyScore: number;
  speedScore: number;
  networkScore: number;
  overallScore: number;
  
  rank: number;
}

// Calculate costs for a single provider
function calculateProviderCosts(
  provider: ThreePLProvider,
  inputs: ThreePLInputs
): ProviderCostBreakdown {
  // Warehousing cost
  const palletCost = inputs.palletPositions * provider.warehousingRatePerPallet;
  const cubicFtCost = inputs.cubicFeet * provider.warehousingRatePerCubicFt;
  const warehousingCost = Math.max(palletCost, cubicFtCost);
  
  // Pick and pack cost
  const basePickPack = inputs.ordersPerMonth * provider.pickPackFee;
  const itemPickPack = inputs.ordersPerMonth * inputs.itemsPerOrder * provider.pickPackFeePerItem;
  const pickPackCost = basePickPack + itemPickPack;
  
  // Shipping cost
  const domesticOrders = inputs.ordersPerMonth * (1 - inputs.intlShippingPercent / 100);
  const intlOrders = inputs.ordersPerMonth * inputs.intlShippingPercent / 100;
  const zoneMult = zoneMultipliers[inputs.shippingZone];
  
  const domesticShipping = domesticOrders * (
    provider.shippingBaseRate + 
    (inputs.avgOrderWeight * provider.shippingPerPound) +
    (provider.shippingPerZone * (parseInt(inputs.shippingZone.replace("zone", "")) - 1))
  ) * zoneMult;
  
  const intlShipping = intlOrders * (
    provider.shippingBaseRate * 1.5 + 
    (inputs.avgOrderWeight * provider.shippingPerPound * 1.8)
  );
  
  const shippingCost = domesticShipping + intlShipping;
  
  // Integration cost (monthly amortized)
  const integrationSetup = provider.integrationFee / inputs.analysisMonths;
  let integrationTypeCost = 0;
  if (inputs.integrationType === "API") {
    integrationTypeCost = provider.integrationAPI;
  } else if (inputs.integrationType === "EDI") {
    integrationTypeCost = provider.integrationMonthly;
  }
  const integrationCost = integrationSetup + integrationTypeCost + provider.integrationMonthly;
  
  // Returns handling cost
  const returnsCount = inputs.ordersPerMonth * (inputs.returnRate / 100);
  const returnsCost = returnsCount * provider.returnsHandling;
  
  // Onboarding (amortized)
  const onboardingCost = provider.onboardingFee / inputs.analysisMonths;
  
  // Minimum fee check
  const calculatedMonthly = warehousingCost + pickPackCost + shippingCost + integrationCost + returnsCost;
  const minimumCost = Math.max(0, provider.minimumMonthly - calculatedMonthly);
  
  // Total costs
  const totalMonthlyCost = calculatedMonthly + minimumCost;
  const totalAnnualCost = totalMonthlyCost * 12;
  const costPerOrder = inputs.ordersPerMonth > 0 ? totalMonthlyCost / inputs.ordersPerMonth : 0;
  
  // Break-even analysis (vs in-house fulfillment estimate)
  const inHouseCostPerOrder = 8.50; // Estimated in-house cost
  const savingsPerOrder = inHouseCostPerOrder - costPerOrder;
  const breakEvenOrders = savingsPerOrder > 0 
    ? (provider.onboardingFee + provider.integrationFee) / (savingsPerOrder * inputs.ordersPerMonth / inputs.analysisMonths)
    : 0;
  
  // Score calculations
  const accuracyScore = provider.accuracyRate;
  const speedScore = 100 - (provider.avgShipTime * 20); // 1 day = 80, 2 days = 60, etc.
  const networkScore = Math.min(100, (provider.fulfillmentCenters / 2) + (provider.countries * 2));
  
  // Weighted overall score
  const overallScore = (accuracyScore * 0.4) + (speedScore * 0.3) + (networkScore * 0.2) + ((100 - (costPerOrder * 10)) * 0.1);
  
  return {
    providerId: provider.id,
    providerName: provider.name,
    warehousingCost,
    pickPackCost,
    shippingCost,
    integrationCost,
    returnsCost,
    onboardingCost,
    minimumCost,
    totalMonthlyCost,
    totalAnnualCost,
    costPerOrder,
    breakEvenOrders,
    accuracyScore,
    speedScore,
    networkScore,
    overallScore: Math.max(0, Math.min(100, overallScore)),
    rank: 0, // Will be set later
  };
}

// Rank providers by cost
function rankProviders(breakdowns: ProviderCostBreakdown[]): ProviderCostBreakdown[] {
  const sorted = [...breakdowns].sort((a, b) => a.totalMonthlyCost - b.totalMonthlyCost);
  return sorted.map((b, i) => ({ ...b, rank: i + 1 }));
}

export function ThreePLCostComparator() {
  const [activeTab, setActiveTab] = useState("calculator");

  const [inputs, setInputs] = useState<ThreePLInputs>({
    ordersPerMonth: 500,
    itemsPerOrder: 2,
    avgOrderWeight: 2.5,
    avgOrderValue: 75,
    palletPositions: 10,
    cubicFeet: 500,
    shippingZone: "zone5",
    intlShippingPercent: 10,
    returnRate: 5,
    integrationType: "API",
    useCustomAPI: false,
    analysisMonths: 12,
    currency: "USD",
    selectedProviders: ["shipbob", "fulfillment-by-amazon", "shiphero", "redstage"],
  });

  // Calculate costs for all selected providers
  const providerCosts = useMemo(() => {
    const selectedProviderData = threePLProviders.filter(p => 
      inputs.selectedProviders.includes(p.id)
    );
    const breakdowns = selectedProviderData.map(provider => 
      calculateProviderCosts(provider, inputs)
    );
    return rankProviders(breakdowns);
  }, [inputs]);

  // Get the best (lowest cost) provider
  const bestProvider = useMemo(() => {
    return providerCosts[0] || null;
  }, [providerCosts]);

  // Calculate average cost across selected providers
  const avgCost = useMemo(() => {
    if (providerCosts.length === 0) return 0;
    return providerCosts.reduce((sum, p) => sum + p.totalMonthlyCost, 0) / providerCosts.length;
  }, [providerCosts]);

  // Cost comparison data for chart
  const costComparisonData = useMemo(() => {
    return providerCosts.map(p => ({
      name: p.providerName,
      "Total Monthly": p.totalMonthlyCost,
      Warehousing: p.warehousingCost,
      "Pick & Pack": p.pickPackCost,
      Shipping: p.shippingCost,
      Integration: p.integrationCost,
    }));
  }, [providerCosts]);

  // Break-even analysis data
  const breakEvenData = useMemo(() => {
    if (!bestProvider) return [];
    
    const baseOrders = inputs.ordersPerMonth;
    const months = 12;
    
    return Array.from({ length: months }, (_, i) => {
      const month = i + 1;
      const orders = baseOrders * month;
      
      const providerCumulative = (bestProvider.totalMonthlyCost * month) + 
        (threePLProviders.find(p => p.id === bestProvider.providerId)?.onboardingFee || 0) +
        (threePLProviders.find(p => p.id === bestProvider.providerId)?.integrationFee || 0);
      
      const inHouseCumulative = orders * 8.50; // In-house cost per order
      
      return {
        month,
        orders,
        "3PL Cost": providerCumulative,
        "In-House Cost": inHouseCumulative,
        Savings: inHouseCumulative - providerCumulative,
      };
    });
  }, [bestProvider, inputs.ordersPerMonth]);

  // Provider ranking data
  const rankingData = useMemo(() => {
    return providerCosts.map(p => ({
      name: p.providerName,
      "Overall Score": p.overallScore,
      "Cost Score": Math.max(0, 100 - (p.costPerOrder * 10)),
      "Accuracy Score": p.accuracyScore,
      "Speed Score": p.speedScore,
    })).sort((a, b) => b["Overall Score"] - a["Overall Score"]);
  }, [providerCosts]);

  // Score breakdown for selected provider
  const getScoreBreakdown = (providerId: string) => {
    const cost = providerCosts.find(p => p.providerId === providerId);
    if (!cost) return [];
    
    return [
      { name: "Accuracy", value: cost.accuracyScore, color: "#0F4C81" },
      { name: "Speed", value: cost.speedScore, color: "#2E8B57" },
      { name: "Network", value: cost.networkScore, color: "#F59E0B" },
      { name: "Cost", value: Math.max(0, 100 - (cost.costPerOrder * 10)), color: "#EF4444" },
    ];
  };

  const updateInput = <K extends keyof ThreePLInputs>(field: K, value: ThreePLInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const toggleProvider = (providerId: string) => {
    setInputs((prev) => {
      const isSelected = prev.selectedProviders.includes(providerId);
      if (isSelected) {
        return { 
          ...prev, 
          selectedProviders: prev.selectedProviders.filter(id => id !== providerId)
        };
      } else {
        return { 
          ...prev, 
          selectedProviders: [...prev.selectedProviders, providerId] 
        };
      }
    });
  };

  const formatMoney = (value: number) => {
    return formatCurrency(value, inputs.currency);
  };

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    purple: "#8B5CF6",
    pink: "#EC4899",
  };

  const resetCalculator = () => {
    setInputs({
      ordersPerMonth: 500,
      itemsPerOrder: 2,
      avgOrderWeight: 2.5,
      avgOrderValue: 75,
      palletPositions: 10,
      cubicFeet: 500,
      shippingZone: "zone5",
      intlShippingPercent: 10,
      returnRate: 5,
      integrationType: "API",
      useCustomAPI: false,
      analysisMonths: 12,
      currency: "USD",
      selectedProviders: ["shipbob", "fulfillment-by-amazon", "shiphero", "redstage"],
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-medium">#{rank}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="breakeven">Break-Even</TabsTrigger>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[var(--ocean)]" />
                    Order Parameters
                  </CardTitle>
                  <CardDescription>
                    Enter your monthly order volume and characteristics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Orders per month */}
                  <div className="space-y-2">
                    <Label htmlFor="ordersPerMonth">Monthly Orders</Label>
                    <Input
                      id="ordersPerMonth"
                      type="number"
                      value={inputs.ordersPerMonth}
                      onChange={(e) => updateInput("ordersPerMonth", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Items per order */}
                  <div className="space-y-2">
                    <Label htmlFor="itemsPerOrder">Average Items per Order</Label>
                    <Input
                      id="itemsPerOrder"
                      type="number"
                      value={inputs.itemsPerOrder}
                      onChange={(e) => updateInput("itemsPerOrder", parseFloat(e.target.value) || 0)}
                      step="0.5"
                    />
                  </div>

                  {/* Average order weight */}
                  <div className="space-y-2">
                    <Label htmlFor="avgOrderWeight">Average Order Weight (lbs)</Label>
                    <Input
                      id="avgOrderWeight"
                      type="number"
                      value={inputs.avgOrderWeight}
                      onChange={(e) => updateInput("avgOrderWeight", parseFloat(e.target.value) || 0)}
                      step="0.1"
                    />
                  </div>

                  {/* Average order value */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Average Order Value
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={inputs.avgOrderValue}
                        onChange={(e) => updateInput("avgOrderValue", parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <Select
                        value={inputs.currency}
                        onValueChange={(v) => updateInput("currency", v as Currency)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Warehouse className="h-5 w-5 text-[var(--logistics)]" />
                    Inventory & Storage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pallet positions */}
                  <div className="space-y-2">
                    <Label htmlFor="palletPositions">Pallet Positions Needed</Label>
                    <Input
                      id="palletPositions"
                      type="number"
                      value={inputs.palletPositions}
                      onChange={(e) => updateInput("palletPositions", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Cubic feet */}
                  <div className="space-y-2">
                    <Label htmlFor="cubicFeet">Storage Volume (cubic feet)</Label>
                    <Input
                      id="cubicFeet"
                      type="number"
                      value={inputs.cubicFeet}
                      onChange={(e) => updateInput("cubicFeet", parseInt(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Truck className="h-5 w-5 text-[var(--ocean)]" />
                    Shipping Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Shipping zone */}
                  <div className="space-y-2">
                    <Label>Primary Shipping Zone</Label>
                    <Select
                      value={inputs.shippingZone}
                      onValueChange={(v) => updateInput("shippingZone", v as ShippingZone)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zone1">Zone 1 (0-150 miles)</SelectItem>
                        <SelectItem value="zone2">Zone 2 (151-300 miles)</SelectItem>
                        <SelectItem value="zone3">Zone 3 (301-600 miles)</SelectItem>
                        <SelectItem value="zone4">Zone 4 (601-1000 miles)</SelectItem>
                        <SelectItem value="zone5">Zone 5 (1001-1400 miles)</SelectItem>
                        <SelectItem value="zone6">Zone 6 (1401-1800 miles)</SelectItem>
                        <SelectItem value="zone7">Zone 7 (1801+ miles)</SelectItem>
                        <SelectItem value="zone8">Zone 8 (International)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* International shipping percentage */}
                  <div className="space-y-2">
                    <Label>International Orders (%)</Label>
                    <Slider
                      value={[inputs.intlShippingPercent]}
                      onValueChange={(v) => updateInput("intlShippingPercent", v[0])}
                      min={0}
                      max={50}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-[var(--ocean)]">{inputs.intlShippingPercent}%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Return rate */}
                  <div className="space-y-2">
                    <Label>Return Rate (%)</Label>
                    <Slider
                      value={[inputs.returnRate]}
                      onValueChange={(v) => updateInput("returnRate", v[0])}
                      min={0}
                      max={30}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-[var(--logistics)]">{inputs.returnRate}%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plug className="h-5 w-5 text-[var(--logistics)]" />
                    Integration Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Integration type */}
                  <div className="space-y-2">
                    <Label>Integration Type</Label>
                    <Select
                      value={inputs.integrationType}
                      onValueChange={(v) => updateInput("integrationType", v as IntegrationType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="API">API Integration</SelectItem>
                        <SelectItem value="EDI">EDI Connection</SelectItem>
                        <SelectItem value="Portal">Web Portal</SelectItem>
                        <SelectItem value="Manual">Manual Entry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Analysis period */}
                  <div className="space-y-2">
                    <Label>Analysis Period (months)</Label>
                    <Slider
                      value={[inputs.analysisMonths]}
                      onValueChange={(v) => updateInput("analysisMonths", v[0])}
                      min={3}
                      max={36}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>3 mo</span>
                      <span className="font-medium text-[var(--ocean)]">{inputs.analysisMonths} months</span>
                      <span>36 mo</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Provider Ranking
                  </CardTitle>
                  <CardDescription>
                    Ranked by total monthly fulfillment cost
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {providerCosts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Select at least one provider to compare costs</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {providerCosts.map((provider) => (
                        <motion.div
                          key={provider.providerId}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border ${
                            provider.rank === 1 
                              ? "border-[var(--logistics)] bg-[var(--logistics)]/5" 
                              : "border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getRankIcon(provider.rank)}
                              <div>
                                <div className="font-medium">{provider.providerName}</div>
                                <div className="text-xs text-muted-foreground">
                                  Score: {provider.overallScore.toFixed(1)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-[var(--ocean)]">
                                {formatMoney(provider.totalMonthlyCost)}
                              </div>
                              <div className="text-xs text-muted-foreground">per month</div>
                            </div>
                          </div>
                          
                          {provider.rank === 1 && (
                            <div className="mt-3 pt-3 border-t border-[var(--logistics)]/20">
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Per Order:</span>
                                  <span className="ml-1 font-medium">{formatMoney(provider.costPerOrder)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Annual:</span>
                                  <span className="ml-1 font-medium">{formatMoney(provider.totalAnnualCost)}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Accuracy:</span>
                                  <span className="ml-1 font-medium">{provider.accuracyScore.toFixed(1)}%</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Cost Summary */}
              {bestProvider && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-[var(--logistics)]" />
                      Best Value: {bestProvider.providerName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground mb-1">Monthly Cost</div>
                        <div className="text-2xl font-bold text-[var(--ocean)]">
                          {formatMoney(bestProvider.totalMonthlyCost)}
                        </div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground mb-1">Cost per Order</div>
                        <div className="text-2xl font-bold text-[var(--logistics)]">
                          {formatMoney(bestProvider.costPerOrder)}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Cost Breakdown</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Warehousing</span>
                          <span>{formatMoney(bestProvider.warehousingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Pick & Pack</span>
                          <span>{formatMoney(bestProvider.pickPackCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>{formatMoney(bestProvider.shippingCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Integration</span>
                          <span>{formatMoney(bestProvider.integrationCost)}</span>
                        </div>
                        {bestProvider.returnsCost > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Returns</span>
                            <span>{formatMoney(bestProvider.returnsCost)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Score Breakdown Pie Chart */}
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getScoreBreakdown(bestProvider.providerId)}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value.toFixed(0)}`}
                            labelLine={false}
                          >
                            {getScoreBreakdown(bestProvider.providerId).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Cost Comparison by Provider
              </CardTitle>
              <CardDescription>
                Compare total costs across all selected 3PL providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costComparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis type="number" tickFormatter={(v) => formatMoney(v)} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Legend />
                    <Bar dataKey="Warehousing" stackId="a" fill={chartColors.ocean} />
                    <Bar dataKey="Pick & Pack" stackId="a" fill={chartColors.logistics} />
                    <Bar dataKey="Shipping" stackId="a" fill={chartColors.warning} />
                    <Bar dataKey="Integration" stackId="a" fill={chartColors.purple} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.ocean }} />
                  <span className="text-sm text-muted-foreground">Warehousing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.logistics }} />
                  <span className="text-sm text-muted-foreground">Pick & Pack</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.warning }} />
                  <span className="text-sm text-muted-foreground">Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: chartColors.purple }} />
                  <span className="text-sm text-muted-foreground">Integration</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Provider</th>
                      <th className="text-right py-3 px-4">Warehousing</th>
                      <th className="text-right py-3 px-4">Pick & Pack</th>
                      <th className="text-right py-3 px-4">Shipping</th>
                      <th className="text-right py-3 px-4">Integration</th>
                      <th className="text-right py-3 px-4">Returns</th>
                      <th className="text-right py-3 px-4 font-semibold">Total/Month</th>
                      <th className="text-right py-3 px-4">Per Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providerCosts.map((provider) => (
                      <tr
                        key={provider.providerId}
                        className={`border-b ${provider.rank === 1 ? "bg-[var(--logistics)]/10" : ""}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getRankIcon(provider.rank)}
                            <span className="font-medium">{provider.providerName}</span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">{formatMoney(provider.warehousingCost)}</td>
                        <td className="text-right py-3 px-4">{formatMoney(provider.pickPackCost)}</td>
                        <td className="text-right py-3 px-4">{formatMoney(provider.shippingCost)}</td>
                        <td className="text-right py-3 px-4">{formatMoney(provider.integrationCost)}</td>
                        <td className="text-right py-3 px-4">{formatMoney(provider.returnsCost)}</td>
                        <td className="text-right py-3 px-4 font-semibold text-[var(--ocean)]">
                          {formatMoney(provider.totalMonthlyCost)}
                        </td>
                        <td className="text-right py-3 px-4">{formatMoney(provider.costPerOrder)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Break-Even Tab */}
        <TabsContent value="breakeven" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                3PL vs In-House Fulfillment
              </CardTitle>
              <CardDescription>
                Compare cumulative costs over time to find your break-even point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={breakEvenData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" label={{ value: "Months", position: "bottom", offset: -5 }} />
                    <YAxis tickFormatter={(v) => formatMoney(v)} />
                    <Tooltip 
                      formatter={(value: number, name) => [formatMoney(value), name]}
                      labelFormatter={(label) => `Month ${label}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="In-House Cost"
                      stroke={chartColors.danger}
                      fill={chartColors.danger}
                      fillOpacity={0.2}
                    />
                    <Area
                      type="monotone"
                      dataKey="3PL Cost"
                      stroke={chartColors.logistics}
                      fill={chartColors.logistics}
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">Estimated Savings (Year 1)</div>
                  <div className="text-2xl font-bold text-[var(--logistics)]">
                    {formatMoney(breakEvenData[11]?.Savings || 0)}
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">In-House Cost</div>
                  <div className="text-2xl font-bold">
                    {formatMoney(breakEvenData[11]?.["In-House Cost"] || 0)}
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">3PL Cost</div>
                  <div className="text-2xl font-bold text-[var(--ocean)]">
                    {formatMoney(breakEvenData[11]?.["3PL Cost"] || 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Break-Even Analysis Assumptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[var(--ocean)]" />
                    In-House Fulfillment Costs
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Labor cost: $3.50/order</li>
                    <li>• Packaging materials: $1.00/order</li>
                    <li>• Warehouse overhead: $2.00/order</li>
                    <li>• Shipping (avg): $2.00/order</li>
                    <li>• <strong>Total: $8.50/order</strong></li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--logistics)]" />
                    3PL Advantages
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No warehouse lease required</li>
                    <li>• Scalable without fixed costs</li>
                    <li>• Carrier rate discounts</li>
                    <li>• Technology included</li>
                    <li>• Focus on core business</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranking Tab */}
        <TabsContent value="ranking" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[var(--ocean)]" />
                Provider Score Ranking
              </CardTitle>
              <CardDescription>
                Comprehensive scoring based on accuracy, speed, network, and cost
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rankingData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Overall Score" fill={chartColors.ocean} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-4">Score Components</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {providerCosts.slice(0, 4).map((provider) => (
                    <div key={provider.providerId} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        {getRankIcon(provider.rank)}
                        <span className="font-medium">{provider.providerName}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Accuracy</span>
                          <span className="font-medium">{provider.accuracyScore.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-[var(--ocean)] h-2 rounded-full" 
                            style={{ width: `${provider.accuracyScore}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Speed</span>
                          <span className="font-medium">{provider.speedScore.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-[var(--logistics)] h-2 rounded-full" 
                            style={{ width: `${provider.speedScore}%` }} 
                          />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Network</span>
                          <span className="font-medium">{provider.networkScore.toFixed(1)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-[var(--warning)] h-2 rounded-full" 
                            style={{ width: `${Math.min(100, provider.networkScore)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                Select Providers to Compare
              </CardTitle>
              <CardDescription>
                Choose 3PL providers to include in your comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {threePLProviders.map((provider) => {
                  const isSelected = inputs.selectedProviders.includes(provider.id);
                  return (
                    <div
                      key={provider.id}
                      onClick={() => toggleProvider(provider.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? "border-[var(--logistics)] bg-[var(--logistics)]/5" 
                          : "border-border hover:border-[var(--ocean)]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{provider.name}</span>
                        {isSelected && <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < Math.floor(provider.rating) ? "text-yellow-500" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{provider.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>{provider.fulfillmentCenters} fulfillment centers • {provider.countries} countries</div>
                        <div>{provider.accuracyRate}% accuracy • {provider.avgShipTime} day avg ship</div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {provider.features.slice(0, 3).map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Provider Details Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {threePLProviders.map((provider) => (
                  <AccordionItem key={provider.id} value={provider.id}>
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{provider.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {provider.rating} ★
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-muted-foreground">Warehousing Rate</span>
                            <div className="font-medium">{formatMoney(provider.warehousingRatePerPallet)}/pallet/month</div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Pick & Pack Fee</span>
                            <div className="font-medium">{formatMoney(provider.pickPackFee)}/order + {formatMoney(provider.pickPackFeePerItem)}/item</div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Shipping Base Rate</span>
                            <div className="font-medium">{formatMoney(provider.shippingBaseRate)} + {formatMoney(provider.shippingPerPound)}/lb</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-xs text-muted-foreground">Integration Fee</span>
                            <div className="font-medium">{formatMoney(provider.integrationFee)} one-time + {formatMoney(provider.integrationMonthly)}/mo</div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Onboarding Fee</span>
                            <div className="font-medium">{formatMoney(provider.onboardingFee)}</div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">Minimum Monthly</span>
                            <div className="font-medium">{formatMoney(provider.minimumMonthly)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-xs text-muted-foreground">Features</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {provider.features.map((feature, i) => (
                            <Badge key={i} variant="secondary">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
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
