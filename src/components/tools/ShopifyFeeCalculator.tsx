"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Info,
  ArrowRight,
  DollarSign,
  BarChart3,
  Globe,
  ShoppingCart,
  Package,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Crown,
  Star,
  Building,
  Percent,
  Calendar,
  PiggyBank,
  TrendingDown,
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
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Shopify Plan Data
const shopifyPlans = {
  basic: {
    name: "Basic",
    monthlyFee: 29,
    annualFee: 348, // $29 * 12, with 10% discount when paid annually = $313.20
    annualMonthly: 26.10,
    transactionFee: 2.0, // percentage
    creditCardRate: 2.9, // percentage
    creditCardFixed: 0.30, // cents
    features: [
      "Unlimited products",
      "2 staff accounts",
      "24/7 support",
      "Sales channels",
      "Basic reports",
      "Up to 77% shipping discount",
    ],
    limitations: [
      "No professional reports",
      "No advanced analytics",
      "No international commerce tools",
    ],
    recommended: false,
    color: "#0F4C81",
  },
  shopify: {
    name: "Shopify",
    monthlyFee: 79,
    annualFee: 948,
    annualMonthly: 71.10,
    transactionFee: 1.0,
    creditCardRate: 2.7,
    creditCardFixed: 0.30,
    features: [
      "Everything in Basic",
      "5 staff accounts",
      "Professional reports",
      "Lower transaction fees",
      "International commerce",
      "Up to 88% shipping discount",
      "Market capabilities",
    ],
    limitations: [
      "No advanced reports",
      "No third-party calculated shipping rates",
    ],
    recommended: true,
    color: "#2E8B57",
  },
  advanced: {
    name: "Advanced",
    monthlyFee: 299,
    annualFee: 3588,
    annualMonthly: 322.90,
    transactionFee: 0.5,
    creditCardRate: 2.5,
    creditCardFixed: 0.30,
    features: [
      "Everything in Shopify",
      "15 staff accounts",
      "Advanced reports",
      "Lowest transaction fees",
      "Third-party calculated shipping",
      "Up to 88% shipping discount",
      "Advanced analytics",
      "Custom reporting",
    ],
    limitations: [],
    recommended: false,
    color: "#8B5CF6",
  },
};

// Payment Provider Data
const paymentProviders = {
  shopifyPayments: {
    name: "Shopify Payments",
    rates: {
      basic: { rate: 2.9, fixed: 0.30 },
      shopify: { rate: 2.7, fixed: 0.30 },
      advanced: { rate: 2.5, fixed: 0.30 },
    },
    additionalTransactionFee: 0, // No additional fee
    supportedCountries: "US, CA, UK, AU, and 20+ more",
    features: ["Integrated checkout", "Fraud analysis", "Chargeback management"],
    recommended: true,
  },
  paypal: {
    name: "PayPal",
    rates: {
      basic: { rate: 2.9, fixed: 0.30 },
      shopify: { rate: 2.9, fixed: 0.30 },
      advanced: { rate: 2.9, fixed: 0.30 },
    },
    additionalTransactionFee: 2.0, // Shopify's additional fee for third-party
    supportedCountries: "Worldwide",
    features: ["Buyer protection", "Credit card processing", "Express checkout"],
    recommended: false,
  },
  stripe: {
    name: "Stripe",
    rates: {
      basic: { rate: 2.9, fixed: 0.30 },
      shopify: { rate: 2.9, fixed: 0.30 },
      advanced: { rate: 2.9, fixed: 0.30 },
    },
    additionalTransactionFee: 2.0, // Shopify's additional fee for third-party
    supportedCountries: "40+ countries",
    features: ["Custom checkout", "Subscription billing", "Advanced fraud detection"],
    recommended: false,
  },
};

// Domain and Additional Costs
const additionalCosts = {
  domain: {
    shopify: 14, // per year for .com
    custom: 20, // average custom domain transfer
  },
  ssl: 0, // Included in all plans
  pos: {
    basic: 0,
    pro: 89, // per month per location
  },
  apps: {
    essential: 29, // average for essential apps
    advanced: 99, // for advanced functionality
  },
  theme: {
    free: 0,
    premium: 180, // one-time
  },
};

// Currency options
const currencyOptions = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"];

type ShopifyPlan = keyof typeof shopifyPlans;
type PaymentProvider = keyof typeof paymentProviders;

interface ShopifyFeeInputs {
  plan: ShopifyPlan;
  monthlySales: number;
  averageOrderValue: number;
  paymentProvider: PaymentProvider;
  useShopifyDomain: boolean;
  posLocations: number;
  monthlyAppSpend: number;
  premiumTheme: boolean;
  paysAnnually: boolean;
  currency: string;
}

interface ShopifyFeeBreakdown {
  subscriptionCost: number;
  transactionFees: number;
  paymentProcessingFees: number;
  domainCost: number;
  posCost: number;
  appCost: number;
  themeCost: number;
  totalMonthly: number;
  totalAnnual: number;
  effectiveRate: number;
  feesPerOrder: number;
  profitImpact: number;
}

// Calculate fees
function calculateFees(inputs: ShopifyFeeInputs): ShopifyFeeBreakdown {
  const plan = shopifyPlans[inputs.plan];
  const provider = paymentProviders[inputs.paymentProvider];

  // Subscription cost (with annual discount)
  const subscriptionCost = inputs.paysAnnually
    ? plan.annualMonthly
    : plan.monthlyFee;

  // Number of orders
  const numberOfOrders = inputs.averageOrderValue > 0
    ? inputs.monthlySales / inputs.averageOrderValue
    : 0;

  // Transaction fees (Shopify fee)
  const shopifyTransactionFee = inputs.paymentProvider === "shopifyPayments"
    ? 0
    : (plan.transactionFee / 100) * inputs.monthlySales;

  // Payment processing fees
  const providerRate = provider.rates[inputs.plan];
  const paymentProcessingFees = (providerRate.rate / 100) * inputs.monthlySales +
    (providerRate.fixed * numberOfOrders);

  // Third-party additional fee
  const additionalFee = inputs.paymentProvider !== "shopifyPayments"
    ? (provider.additionalTransactionFee / 100) * inputs.monthlySales
    : 0;

  const transactionFees = shopifyTransactionFee + additionalFee;

  // Domain cost (monthly)
  const domainCost = inputs.useShopifyDomain
    ? 0
    : additionalCosts.domain.custom / 12;

  // POS cost
  const posCost = inputs.posLocations * additionalCosts.pos.pro;

  // App cost
  const appCost = inputs.monthlyAppSpend;

  // Theme cost (amortized over 2 years)
  const themeCost = inputs.premiumTheme
    ? additionalCosts.theme.premium / 24
    : 0;

  // Totals
  const totalMonthly = subscriptionCost + transactionFees + paymentProcessingFees +
    domainCost + posCost + appCost + themeCost;

  const totalAnnual = totalMonthly * 12;

  // Effective rate
  const effectiveRate = inputs.monthlySales > 0
    ? ((transactionFees + paymentProcessingFees + subscriptionCost) / inputs.monthlySales) * 100
    : 0;

  // Fees per order
  const feesPerOrder = numberOfOrders > 0
    ? (transactionFees + paymentProcessingFees) / numberOfOrders
    : 0;

  // Profit impact (assuming 30% profit margin)
  const profitImpact = inputs.monthlySales * 0.30 - totalMonthly;

  return {
    subscriptionCost,
    transactionFees,
    paymentProcessingFees,
    domainCost,
    posCost,
    appCost,
    themeCost,
    totalMonthly,
    totalAnnual,
    effectiveRate,
    feesPerOrder,
    profitImpact: profitImpact > 0 ? profitImpact : 0,
  };
}

// Plan comparison helper
function comparePlans(inputs: ShopifyFeeInputs): Array<{
  plan: ShopifyPlan;
  name: string;
  totalMonthly: number;
  totalAnnual: number;
  savings: number;
  isRecommended: boolean;
}> {
  return Object.keys(shopifyPlans).map((planKey) => {
    const planInputs = { ...inputs, plan: planKey as ShopifyPlan };
    const fees = calculateFees(planInputs);
    const plan = shopifyPlans[planKey as ShopifyPlan];

    return {
      plan: planKey as ShopifyPlan,
      name: plan.name,
      totalMonthly: fees.totalMonthly,
      totalAnnual: fees.totalAnnual,
      savings: 0,
      isRecommended: plan.recommended,
    };
  });
}

export function ShopifyFeeCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");

  const [inputs, setInputs] = useState<ShopifyFeeInputs>({
    plan: "shopify",
    monthlySales: 10000,
    averageOrderValue: 75,
    paymentProvider: "shopifyPayments",
    useShopifyDomain: true,
    posLocations: 0,
    monthlyAppSpend: 50,
    premiumTheme: false,
    paysAnnually: true,
    currency: "USD",
  });

  const results = useMemo(() => calculateFees(inputs), [inputs]);
  const planComparison = useMemo(() => comparePlans(inputs), [inputs]);

  const updateInput = <K extends keyof ShopifyFeeInputs>(
    field: K,
    value: ShopifyFeeInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Find the best plan
  const bestPlan = useMemo(() => {
    const sorted = [...planComparison].sort((a, b) => a.totalMonthly - b.totalMonthly);
    return sorted[0];
  }, [planComparison]);

  // Cost breakdown data for pie chart
  const costBreakdownData = useMemo(() => {
    return [
      { name: "Subscription", value: results.subscriptionCost, color: "#0F4C81" },
      { name: "Transaction Fees", value: results.transactionFees, color: "#2E8B57" },
      { name: "Payment Processing", value: results.paymentProcessingFees, color: "#F59E0B" },
      { name: "Apps", value: results.appCost, color: "#8B5CF6" },
      ...(results.domainCost > 0 ? [{ name: "Domain", value: results.domainCost, color: "#EF4444" }] : []),
      ...(results.posCost > 0 ? [{ name: "POS", value: results.posCost, color: "#06B6D4" }] : []),
      ...(results.themeCost > 0 ? [{ name: "Theme", value: results.themeCost, color: "#EC4899" }] : []),
    ];
  }, [results]);

  // Annual projection data
  const annualProjectionData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let cumulative = 0;

    return months.map((month) => {
      cumulative += results.totalMonthly;
      return {
        month,
        monthly: results.totalMonthly,
        cumulative,
        sales: inputs.monthlySales,
      };
    });
  }, [results, inputs.monthlySales]);

  // Plan comparison chart data
  const planComparisonChartData = useMemo(() => {
    return planComparison.map((p) => ({
      name: p.name,
      monthly: p.totalMonthly,
      annual: p.totalAnnual / 12, // Average monthly
      effective: (p.totalMonthly / inputs.monthlySales) * 100,
      isRecommended: p.isRecommended,
    }));
  }, [planComparison, inputs.monthlySales]);

  // Sales volume impact data
  const salesVolumeImpactData = useMemo(() => {
    const volumes = [5000, 10000, 25000, 50000, 100000, 250000];
    return volumes.map((volume) => {
      const testInputs = { ...inputs, monthlySales: volume };
      const fees = calculateFees(testInputs);
      return {
        volume: `$${(volume / 1000).toFixed(0)}K`,
        volumeNum: volume,
        totalFees: fees.totalMonthly,
        effectiveRate: fees.effectiveRate,
        profitImpact: fees.profitImpact,
      };
    });
  }, [inputs]);

  const formatMoney = (value: number) => {
    return formatCurrency(value, inputs.currency);
  };

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    accent: "#8B5CF6",
    danger: "#EF4444",
    info: "#06B6D4",
  };

  const resetCalculator = () => {
    setInputs({
      plan: "shopify",
      monthlySales: 10000,
      averageOrderValue: 75,
      paymentProvider: "shopifyPayments",
      useShopifyDomain: true,
      posLocations: 0,
      monthlyAppSpend: 50,
      premiumTheme: false,
      paysAnnually: true,
      currency: "USD",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="comparison">Plan Comparison</TabsTrigger>
          <TabsTrigger value="projection">Annual View</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="reference">Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-[var(--ocean)]" />
                    Store Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your Shopify store settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Plan Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Shopify Plan
                    </Label>
                    <Select
                      value={inputs.plan}
                      onValueChange={(v) => updateInput("plan", v as ShopifyPlan)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(shopifyPlans).map(([key, plan]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span>{plan.name}</span>
                              <span className="text-muted-foreground">
                                ${plan.monthlyFee}/mo
                              </span>
                              {plan.recommended && (
                                <Badge className="bg-[var(--logistics)] text-xs">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Monthly Sales */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monthly Sales Volume
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={inputs.monthlySales}
                        onChange={(e) => updateInput("monthlySales", parseFloat(e.target.value) || 0)}
                        className="flex-1"
                      />
                      <Select
                        value={inputs.currency}
                        onValueChange={(v) => updateInput("currency", v)}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencyOptions.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Average Order Value */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Average Order Value
                    </Label>
                    <Input
                      type="number"
                      value={inputs.averageOrderValue}
                      onChange={(e) => updateInput("averageOrderValue", parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {/* Payment Provider */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Provider
                    </Label>
                    <Select
                      value={inputs.paymentProvider}
                      onValueChange={(v) => updateInput("paymentProvider", v as PaymentProvider)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(paymentProviders).map(([key, provider]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <span>{provider.name}</span>
                              {provider.recommended && (
                                <Badge variant="secondary" className="text-xs">
                                  Best Value
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {inputs.paymentProvider !== "shopifyPayments" && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Additional {shopifyPlans[inputs.plan].transactionFee}% Shopify transaction fee applies
                      </p>
                    )}
                  </div>

                  {/* Annual Billing Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Pay Annually (Save 10%)</Label>
                      <p className="text-xs text-muted-foreground">
                        Get a discount on subscription
                      </p>
                    </div>
                    <Switch
                      checked={inputs.paysAnnually}
                      onCheckedChange={(v) => updateInput("paysAnnually", v)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[var(--logistics)]" />
                    Additional Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* POS Locations */}
                  <div className="space-y-2">
                    <Label>Point of Sale (POS) Locations</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[inputs.posLocations]}
                        onValueChange={(v) => updateInput("posLocations", v[0])}
                        min={0}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="font-medium w-8 text-center">{inputs.posLocations}</span>
                    </div>
                    {inputs.posLocations > 0 && (
                      <p className="text-xs text-muted-foreground">
                        ${additionalCosts.pos.pro}/month per location
                      </p>
                    )}
                  </div>

                  {/* Monthly App Spend */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Monthly App Budget
                    </Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[inputs.monthlyAppSpend]}
                        onValueChange={(v) => updateInput("monthlyAppSpend", v[0])}
                        min={0}
                        max={500}
                        step={10}
                        className="flex-1"
                      />
                      <span className="font-medium w-16 text-right">${inputs.monthlyAppSpend}</span>
                    </div>
                  </div>

                  {/* Custom Domain */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Custom Domain</Label>
                      <p className="text-xs text-muted-foreground">
                        ~${additionalCosts.domain.custom}/year
                      </p>
                    </div>
                    <Switch
                      checked={!inputs.useShopifyDomain}
                      onCheckedChange={(v) => updateInput("useShopifyDomain", !v)}
                    />
                  </div>

                  {/* Premium Theme */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Premium Theme</Label>
                      <p className="text-xs text-muted-foreground">
                        ~${additionalCosts.theme.premium} one-time
                      </p>
                    </div>
                    <Switch
                      checked={inputs.premiumTheme}
                      onCheckedChange={(v) => updateInput("premiumTheme", v)}
                    />
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
                    Total Monthly Cost
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Total Cost */}
                  <motion.div
                    key={results.totalMonthly}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-6 rounded-xl bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--logistics)]/10"
                  >
                    <div className="text-sm text-muted-foreground mb-1">Estimated Monthly Cost</div>
                    <div className="text-4xl font-bold text-[var(--ocean)]">
                      {formatMoney(results.totalMonthly)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatMoney(results.totalAnnual)} annually
                    </div>
                  </motion.div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Effective Rate</div>
                      <div className="text-xl font-bold">{results.effectiveRate.toFixed(2)}%</div>
                      <div className="text-xs text-muted-foreground">of sales</div>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg text-center">
                      <div className="text-xs text-muted-foreground mb-1">Fees Per Order</div>
                      <div className="text-xl font-bold">{formatMoney(results.feesPerOrder)}</div>
                      <div className="text-xs text-muted-foreground">average</div>
                    </div>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Cost Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subscription</span>
                        <span className="font-medium">{formatMoney(results.subscriptionCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transaction Fees</span>
                        <span className="font-medium">{formatMoney(results.transactionFees)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Processing</span>
                        <span className="font-medium">{formatMoney(results.paymentProcessingFees)}</span>
                      </div>
                      {results.appCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Apps</span>
                          <span className="font-medium">{formatMoney(results.appCost)}</span>
                        </div>
                      )}
                      {results.posCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">POS</span>
                          <span className="font-medium">{formatMoney(results.posCost)}</span>
                        </div>
                      )}
                      {results.domainCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Domain</span>
                          <span className="font-medium">{formatMoney(results.domainCost)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-[var(--ocean)]">{formatMoney(results.totalMonthly)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown Pie Chart */}
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {costBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatMoney(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Profit Impact Card */}
              <Card className="bg-gradient-to-br from-[var(--logistics)]/10 to-transparent">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-[var(--logistics)]/20">
                      <PiggyBank className="h-6 w-6 text-[var(--logistics)]" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Profit Impact Analysis</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Assuming a 30% profit margin on your products, your estimated monthly profit
                        after Shopify costs would be:
                      </p>
                      <div className="mt-3 text-2xl font-bold text-[var(--logistics)]">
                        {formatMoney(results.profitImpact)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation */}
              {bestPlan.plan !== inputs.plan && (
                <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        <p className="font-semibold mb-1">Cost Optimization Tip</p>
                        <p>
                          Switching to the <strong>{bestPlan.name}</strong> plan could save you
                          approximately <strong>{formatMoney(inputs.monthlySales > 0 ? Math.abs(results.totalMonthly - bestPlan.totalMonthly) : 0)}</strong> per month.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {Object.entries(shopifyPlans).map(([key, plan]) => {
              const planInputs = { ...inputs, plan: key as ShopifyPlan };
              const planFees = calculateFees(planInputs);
              const isCurrentPlan = key === inputs.plan;

              return (
                <Card
                  key={key}
                  className={`relative ${isCurrentPlan ? "border-2 border-[var(--ocean)]" : ""} ${
                    plan.recommended ? "ring-2 ring-[var(--logistics)]" : ""
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-[var(--logistics)]">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="flex items-center justify-center gap-2">
                      {key === "advanced" && <Crown className="h-5 w-5 text-purple-500" />}
                      {key === "shopify" && <Star className="h-5 w-5 text-[var(--logistics)]" />}
                      {key === "basic" && <Building className="h-5 w-5 text-[var(--ocean)]" />}
                      {plan.name}
                    </CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.monthlyFee}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    {inputs.paysAnnually && (
                      <p className="text-sm text-[var(--logistics)]">
                        ${plan.annualMonthly.toFixed(2)}/mo billed annually
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Transaction Fees */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Transaction Fee</div>
                      <div className="text-lg font-semibold">{plan.transactionFee}%</div>
                    </div>

                    {/* Credit Card Rate */}
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Credit Card Rate</div>
                      <div className="text-lg font-semibold">
                        {plan.creditCardRate}% + ${plan.creditCardFixed}
                      </div>
                    </div>

                    {/* Estimated Monthly Cost */}
                    <div className="p-4 rounded-lg bg-gradient-to-br from-[var(--ocean)]/10 to-[var(--logistics)]/10">
                      <div className="text-xs text-muted-foreground mb-1">Est. Monthly Cost</div>
                      <div className="text-2xl font-bold text-[var(--ocean)]">
                        {formatMoney(planFees.totalMonthly)}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      {plan.features.slice(0, 5).map((feature, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 5 && (
                        <p className="text-xs text-muted-foreground pl-6">
                          +{plan.features.length - 5} more features
                        </p>
                      )}
                    </div>

                    {isCurrentPlan && (
                      <Badge className="w-full justify-center bg-[var(--ocean)]">
                        Current Plan
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Plan Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Plan Cost Comparison
              </CardTitle>
              <CardDescription>
                Monthly costs comparison across all plans at your current sales volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={planComparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `$${v}`} />
                    <Tooltip formatter={(value: number) => formatMoney(value)} />
                    <Legend />
                    <Bar
                      dataKey="monthly"
                      name="Monthly Cost"
                      fill={chartColors.ocean}
                      radius={[4, 4, 0, 0]}
                    >
                      {planComparisonChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.isRecommended ? chartColors.logistics : chartColors.ocean}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projection" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[var(--ocean)]" />
                Annual Cost Projection
              </CardTitle>
              <CardDescription>
                Projected costs over 12 months based on your current configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={annualProjectionData}>
                    <defs>
                      <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColors.ocean} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chartColors.ocean} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `$${v / 1000}K`} />
                    <Tooltip
                      formatter={(value: number, name) => {
                        if (name === "cumulative") return formatMoney(value);
                        return formatMoney(value);
                      }}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="cumulative"
                      name="Cumulative Cost"
                      stroke={chartColors.ocean}
                      fillOpacity={1}
                      fill="url(#colorCumulative)"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="monthly"
                      name="Monthly Cost"
                      stroke={chartColors.logistics}
                      strokeWidth={2}
                      dot={{ fill: chartColors.logistics }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">Monthly Average</div>
                  <div className="text-xl font-bold">{formatMoney(results.totalMonthly)}</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">Annual Total</div>
                  <div className="text-xl font-bold">{formatMoney(results.totalAnnual)}</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">Cost Per Sale</div>
                  <div className="text-xl font-bold">{results.effectiveRate.toFixed(2)}%</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg text-center">
                  <div className="text-xs text-muted-foreground mb-1">Annual Savings</div>
                  <div className="text-xl font-bold text-[var(--logistics)]">
                    {inputs.paysAnnually
                      ? formatMoney((shopifyPlans[inputs.plan].monthlyFee - shopifyPlans[inputs.plan].annualMonthly) * 12)
                      : "$0"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--ocean)]" />
                Sales Volume Impact Analysis
              </CardTitle>
              <CardDescription>
                How your costs change as your business grows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={salesVolumeImpactData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="volume" />
                    <YAxis yAxisId="left" tickFormatter={(v) => `$${v}`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                    <Tooltip
                      formatter={(value: number, name) => {
                        if (name === "effectiveRate") return `${value.toFixed(2)}%`;
                        return formatMoney(value);
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="totalFees"
                      name="Monthly Fees"
                      fill={chartColors.ocean}
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="effectiveRate"
                      name="Effective Rate %"
                      stroke={chartColors.logistics}
                      strokeWidth={2}
                      dot={{ fill: chartColors.logistics }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Key Insights</h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                    <span>
                      As your sales volume increases, the subscription cost becomes a smaller percentage
                      of your total revenue.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                    <span>
                      Higher-tier plans become more cost-effective at larger volumes due to lower
                      transaction fees.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                    <span>
                      Using Shopify Payments eliminates the additional transaction fee, saving you
                      {formatMoney((shopifyPlans[inputs.plan].transactionFee / 100) * inputs.monthlySales)}
                      /month.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Breakeven Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-[var(--logistics)]" />
                Plan Breakeven Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">From Plan</th>
                      <th className="text-left py-3 px-4">To Plan</th>
                      <th className="text-right py-3 px-4">Breakeven Sales</th>
                      <th className="text-right py-3 px-4">Monthly Savings at Current Volume</th>
                      <th className="text-center py-3 px-4">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Basic</td>
                      <td className="py-3 px-4">Shopify</td>
                      <td className="text-right py-3 px-4 font-medium">$5,000/mo</td>
                      <td className="text-right py-3 px-4">
                        {inputs.monthlySales >= 5000 ? (
                          <span className="text-[var(--logistics)]">Save money</span>
                        ) : (
                          <span className="text-amber-600">Not worth it yet</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {inputs.monthlySales >= 5000 && inputs.plan === "basic" ? (
                          <Badge className="bg-[var(--logistics)]">Upgrade</Badge>
                        ) : (
                          <Badge variant="outline">-</Badge>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Shopify</td>
                      <td className="py-3 px-4">Advanced</td>
                      <td className="text-right py-3 px-4 font-medium">$115,000/mo</td>
                      <td className="text-right py-3 px-4">
                        {inputs.monthlySales >= 115000 ? (
                          <span className="text-[var(--logistics)]">Save money</span>
                        ) : (
                          <span className="text-amber-600">Not worth it yet</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {inputs.monthlySales >= 115000 && inputs.plan === "shopify" ? (
                          <Badge className="bg-[var(--logistics)]">Upgrade</Badge>
                        ) : (
                          <Badge variant="outline">-</Badge>
                        )}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Basic</td>
                      <td className="py-3 px-4">Advanced</td>
                      <td className="text-right py-3 px-4 font-medium">$15,000/mo</td>
                      <td className="text-right py-3 px-4">
                        {inputs.monthlySales >= 15000 ? (
                          <span className="text-[var(--logistics)]">Save money</span>
                        ) : (
                          <span className="text-amber-600">Not worth it yet</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {inputs.monthlySales >= 15000 && inputs.plan === "basic" ? (
                          <Badge className="bg-[var(--logistics)]">Upgrade</Badge>
                        ) : (
                          <Badge variant="outline">-</Badge>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reference" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shopify Plan Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4">Feature</th>
                      <th className="text-center py-3 px-4">Basic</th>
                      <th className="text-center py-3 px-4">Shopify</th>
                      <th className="text-center py-3 px-4">Advanced</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Monthly Price</td>
                      <td className="text-center py-3 px-4">$29</td>
                      <td className="text-center py-3 px-4">$79</td>
                      <td className="text-center py-3 px-4">$299</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Transaction Fee</td>
                      <td className="text-center py-3 px-4">2.0%</td>
                      <td className="text-center py-3 px-4">1.0%</td>
                      <td className="text-center py-3 px-4">0.5%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Credit Card Rate (Shopify Payments)</td>
                      <td className="text-center py-3 px-4">2.9% + 30c</td>
                      <td className="text-center py-3 px-4">2.7% + 30c</td>
                      <td className="text-center py-3 px-4">2.5% + 30c</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Staff Accounts</td>
                      <td className="text-center py-3 px-4">2</td>
                      <td className="text-center py-3 px-4">5</td>
                      <td className="text-center py-3 px-4">15</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Report Type</td>
                      <td className="text-center py-3 px-4">Basic</td>
                      <td className="text-center py-3 px-4">Professional</td>
                      <td className="text-center py-3 px-4">Advanced</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">International Commerce</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mx-auto" />
                      </td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mx-auto" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4 font-medium">Third-Party Shipping</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">-</td>
                      <td className="text-center py-3 px-4">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Provider Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {Object.entries(paymentProviders).map(([key, provider]) => (
                  <AccordionItem key={key} value={key}>
                    <AccordionTrigger className="text-sm">
                      <div className="flex items-center gap-2">
                        {provider.recommended && (
                          <Badge className="bg-[var(--logistics)]">Recommended</Badge>
                        )}
                        <span>{provider.name}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                          <strong>Processing Rate:</strong>{" "}
                          {provider.rates[inputs.plan].rate}% + ${provider.rates[inputs.plan].fixed}
                        </p>
                        <p>
                          <strong>Additional Shopify Fee:</strong>{" "}
                          {provider.additionalTransactionFee > 0
                            ? `${provider.additionalTransactionFee}%`
                            : "None (using Shopify Payments)"}
                        </p>
                        <p>
                          <strong>Supported Countries:</strong> {provider.supportedCountries}
                        </p>
                        <p>
                          <strong>Features:</strong>
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          {provider.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Common Shopify Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Domain Costs
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Shopify subdomain: Free</li>
                    <li>Custom domain (via Shopify): ~$14/year</li>
                    <li>Domain transfer: ~$20/year</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    App Costs
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Essential apps: $0-30/month</li>
                    <li>Marketing apps: $10-100/month</li>
                    <li>Advanced features: $50-300/month</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Theme Costs
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Free themes: 8+ available</li>
                    <li>Premium themes: $150-350 one-time</li>
                    <li>Custom development: $500-5000+</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    POS Costs
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>Basic POS: Free (with plan)</li>
                    <li>POS Pro: $89/location/month</li>
                    <li>Hardware: $29-349 per device</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Lightbulb icon component
function Lightbulb({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
