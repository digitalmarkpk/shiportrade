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
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Leaf,
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
  Ship,
  Plane,
  Truck,
  Train,
  Globe,
  Zap,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  BookOpen,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Shield,
  LineChart,
  Activity,
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
} from "recharts";
import { currencies, formatCurrency } from "@/lib/constants/currencies";

// Carbon emission factors (kg CO2e per tonne-km)
const EMISSION_FACTORS = {
  ocean: { 
    name: "Ocean Freight", 
    factor: 0.015, 
    icon: Ship,
    description: "Container vessel average",
    color: "#0F4C81",
  },
  air: { 
    name: "Air Freight", 
    factor: 0.602, 
    icon: Plane,
    description: "Cargo aircraft average",
    color: "#9333EA",
  },
  road: { 
    name: "Road Transport", 
    factor: 0.105, 
    icon: Truck,
    description: "Truck average",
    color: "#F59E0B",
  },
  rail: { 
    name: "Rail Transport", 
    factor: 0.028, 
    icon: Train,
    description: "Freight train average",
    color: "#2E8B57",
  },
};

// Carbon tax rates by region
const CARBON_TAX_RATES = {
  EU_ETS: { name: "EU ETS", rate: 85, unit: "€/tCO2", scope: "Aviation & Shipping to/from EU", trend: "rising" },
  UK_ETS: { name: "UK ETS", rate: 75, unit: "£/tCO2", scope: "UK domestic flights & shipping", trend: "rising" },
  CALIFORNIA: { name: "California Cap-and-Trade", rate: 35, unit: "$/tCO2", scope: "California operations", trend: "stable" },
  SINGAPORE: { name: "Singapore Carbon Tax", rate: 25, unit: "S$/tCO2", scope: "Facilities in Singapore", trend: "rising" },
  CANADA: { name: "Canada Carbon Price", rate: 65, unit: "CAD/tCO2", scope: "Canadian operations", trend: "rising" },
  CHINA_ETS: { name: "China ETS", rate: 10, unit: "¥/tCO2", scope: "Power sector (expanding)", trend: "rising" },
  KOREA_ETS: { name: "Korea ETS", rate: 20, unit: "₩/tCO2", scope: "Large emitters", trend: "stable" },
  IMO_FUTURE: { name: "IMO Carbon Pricing (Proposed)", rate: 100, unit: "$/tCO2", scope: "Global shipping (proposed)", trend: "pending" },
};

// Historical carbon price data
const HISTORICAL_PRICES = [
  { year: "2019", eu_ets: 25, uk_ets: 0, california: 17 },
  { year: "2020", eu_ets: 28, uk_ets: 0, california: 18 },
  { year: "2021", eu_ets: 53, uk_ets: 45, california: 21 },
  { year: "2022", eu_ets: 81, uk_ets: 68, california: 29 },
  { year: "2023", eu_ets: 85, uk_ets: 75, california: 35 },
  { year: "2024", eu_ets: 85, uk_ets: 75, california: 35 },
];

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is a carbon tax and how does it affect shipping costs?",
    answer: "A carbon tax is a fee imposed on the emission of carbon dioxide (CO2) and other greenhouse gases resulting from burning fossil fuels. In the shipping and logistics industry, carbon taxes directly impact operational costs based on the emissions produced during transportation. For example, air freight generates approximately 0.602 kg CO2e per tonne-kilometer, while ocean freight produces only 0.015 kg CO2e per tonne-kilometer. This significant difference means that choosing the right transport mode can dramatically affect your carbon tax liability. Companies must now factor these environmental costs into their supply chain decisions, potentially leading to higher consumer prices or changes in logistics strategies."
  },
  {
    question: "How is the EU ETS expanding to include maritime transport?",
    answer: "The European Union Emissions Trading System (EU ETS) is expanding to include maritime emissions, marking a significant shift in global shipping regulations. Starting in 2024, the EU ETS covers CO2 emissions from large ships (over 5,000 gross tonnage) entering EU ports, regardless of the flag they fly. The system is being phased in gradually: 40% of emissions verified in 2024, 70% in 2025, and 100% from 2026 onwards. Shipping companies must purchase and surrender EU Allowances (EUAs) for their emissions, which currently trade around €85 per tonne of CO2. This regulatory change is expected to increase shipping costs significantly and drive the adoption of cleaner fuels and more efficient vessel technologies."
  },
  {
    question: "What are the differences between carbon taxes and cap-and-trade systems?",
    answer: "Carbon taxes and cap-and-trade systems are two primary market-based approaches to reducing greenhouse gas emissions. A carbon tax directly sets a price on carbon emissions, providing price certainty but not emission reduction guarantees. Taxpayers pay a fixed rate per ton of CO2 emitted, making financial planning straightforward. In contrast, cap-and-trade systems (like the EU ETS) set a limit (cap) on total emissions and allow companies to trade emission allowances. This provides certainty on emission reductions but introduces price volatility. For logistics companies, understanding both systems is crucial: carbon taxes appear in regions like Canada and Singapore, while cap-and-trade dominates in the EU, UK, California, and South Korea. Each system creates different compliance requirements and financial risks."
  },
  {
    question: "How can companies reduce their carbon tax exposure in logistics?",
    answer: "Companies can significantly reduce their carbon tax exposure through several strategic approaches. First, modal shift optimization: switching from air freight (0.602 kg CO2e/t-km) to rail (0.028 kg CO2e/t-km) or ocean (0.015 kg CO2e/t-km) can reduce emissions by up to 95%. Second, route optimization using advanced logistics software can minimize total distance traveled. Third, investing in sustainable aviation fuels (SAF) or biofuels can reduce the carbon intensity of operations. Fourth, implementing carbon offsetting programs for unavoidable emissions. Fifth, consolidating shipments to maximize load efficiency. Sixth, partnering with carriers who operate newer, more fuel-efficient fleets. These strategies not only reduce tax liability but also demonstrate environmental leadership to increasingly eco-conscious consumers and investors."
  },
  {
    question: "What is the IMO's strategy for reducing shipping emissions?",
    answer: "The International Maritime Organization (IMO) has adopted an ambitious strategy to reduce greenhouse gas emissions from international shipping. The revised IMO GHG Strategy aims to reduce total annual GHG emissions by at least 20% by 2030 (striving for 30%), and by at least 70% by 2040 (striving for 80%), compared to 2008 levels. By 2050, the goal is to reach net-zero emissions. Key measures include the Energy Efficiency Existing Ship Index (EEXI) and Carbon Intensity Indicator (CII) requirements, which came into effect in 2023. The IMO is also developing a global fuel standard and carbon pricing mechanism, expected to be finalized by 2025. These regulations will fundamentally transform the shipping industry, requiring significant investment in new technologies and alternative fuels."
  },
  {
    question: "How do Scope 3 emissions relate to carbon taxes in supply chains?",
    answer: "Scope 3 emissions encompass all indirect emissions occurring in a company's value chain, including upstream transportation and distribution, which are critical for logistics operations. Unlike Scope 1 (direct emissions) and Scope 2 (purchased energy), Scope 3 emissions often represent the largest portion of a company's carbon footprint, sometimes exceeding 80% of total emissions. Carbon taxes are increasingly targeting Scope 3 emissions through supply chain due diligence requirements. Companies must now calculate, report, and often pay for emissions generated by their logistics providers. This creates both risks and opportunities: companies with carbon-intensive supply chains face higher costs and regulatory scrutiny, while those with optimized, low-emission logistics networks gain competitive advantages and can offer carbon-neutral products to environmentally conscious markets."
  },
];

// Educational content sections
const EDUCATIONAL_SECTIONS = [
  {
    title: "Understanding Carbon Pricing Mechanisms",
    icon: DollarSign,
    content: `Carbon pricing represents one of the most powerful economic tools for addressing climate change by putting a monetary value on greenhouse gas emissions. The fundamental principle is straightforward: by making emitters pay for the environmental damage caused by their CO2 emissions, market forces naturally drive innovation toward cleaner technologies and practices. There are two primary approaches to carbon pricing that have been implemented globally. Carbon taxes impose a direct fee per ton of CO2 emitted, providing price certainty that helps businesses plan long-term investments. Cap-and-trade systems, conversely, set an absolute limit on emissions and allow companies to buy and sell emission permits, guaranteeing environmental outcomes while introducing price volatility. In the logistics sector, carbon pricing has profound implications. Transportation accounts for approximately 24% of global CO2 emissions, with freight contributing a significant portion. As carbon prices rise—EU ETS allowances have increased from under €10 in 2017 to over €85 in 2024—the financial impact on shipping decisions becomes material. A single container shipped from Shanghai to Rotterdam by air might incur carbon costs exceeding €500, compared to under €15 for ocean freight. Understanding these mechanisms is essential for supply chain professionals who must now balance traditional metrics like cost and speed with environmental compliance and sustainability goals.`,
  },
  {
    title: "Transport Mode Emission Factors Explained",
    icon: Train,
    content: `Emission factors quantify the amount of CO2 equivalent emitted per unit of transport work, typically expressed in grams or kilograms per tonne-kilometer. Understanding these factors is crucial for making informed logistics decisions that balance operational requirements with environmental impact. Ocean freight remains the most carbon-efficient mode for long-distance transport, with emission factors around 0.015 kg CO2e per tonne-kilometer for container vessels. This efficiency stems from the ability to move massive cargo volumes with relatively modest fuel consumption—a large container ship can carry over 20,000 containers while burning approximately 225 metric tons of fuel per day. Rail transport follows closely with approximately 0.028 kg CO2e per tonne-kilometer, benefiting from steel-wheel-on-steel-rail efficiency and the possibility of electrification. Road transport, the backbone of last-mile delivery, generates approximately 0.105 kg CO2e per tonne-kilometer—about seven times more than ocean freight. Air freight, while offering unmatched speed, produces approximately 0.602 kg CO2e per tonne-kilometer, making it roughly 40 times more carbon-intensive than ocean shipping. For logistics professionals, these factors translate directly into carbon tax liabilities: a 10,000 km shipment of 1,000 kg cargo would generate approximately 150 kg CO2e by ocean but over 6,000 kg CO2e by air, representing a potential carbon cost difference of hundreds of dollars per shipment at current prices.`,
  },
  {
    title: "Global Carbon Tax Regulations Overview",
    icon: Globe,
    content: `The global landscape of carbon pricing regulations is rapidly evolving, creating a complex compliance environment for international logistics operations. As of 2024, over 70 carbon pricing initiatives are operating worldwide, covering approximately 23% of global greenhouse gas emissions. The European Union Emissions Trading System (EU ETS) remains the largest and most influential carbon market, now extending to maritime emissions for vessels over 5,000 gross tonnage calling at EU ports. The UK ETS operates independently post-Brexit with similar coverage and comparable prices. North America features a patchwork of systems: Canada's federal carbon price (currently CAD 65/tonne) applies nationwide with provincial systems in Quebec and British Columbia, while California's cap-and-trade program links with Quebec's market. Asia-Pacific is rapidly developing its carbon pricing infrastructure: Singapore's carbon tax started at S$25/tonne in 2024 and will rise to S$45 by 2026; China's national ETS, launched in 2021, covers the power sector with plans for industrial expansion; South Korea's ETS has been operational since 2015. The International Maritime Organization is developing global regulations that could introduce a universal carbon levy on shipping by 2027. For supply chain managers, navigating this regulatory maze requires sophisticated tracking systems, regional compliance expertise, and strategic planning to optimize routes and modes based on varying carbon costs across jurisdictions.`,
  },
  {
    title: "Strategic Carbon Reduction in Supply Chains",
    icon: Target,
    content: `Developing a comprehensive carbon reduction strategy for supply chains requires a multi-faceted approach that balances environmental goals with operational efficiency and cost management. The first pillar involves transportation optimization: consolidating shipments to maximize load factors, implementing advanced route planning algorithms, and strategically locating distribution centers to minimize total transport distances. Studies show that load optimization alone can reduce per-unit emissions by 15-25%. The second pillar focuses on modal shift—replacing carbon-intensive transport modes with cleaner alternatives where feasible. For non-urgent shipments, shifting from air to ocean or rail can reduce emissions by 80-95%, though it requires adjusting lead time expectations and safety stock levels. The third pillar encompasses technology adoption: partnering with carriers investing in alternative fuel vehicles, electric trucks for last-mile delivery, and vessels equipped with wind-assist propulsion or LNG engines. The fourth pillar involves carbon offsetting and insetting programs—purchasing verified carbon credits for unavoidable emissions or investing directly in emission reduction projects within the supply chain. Leading companies are setting Science-Based Targets aligned with the Paris Agreement, committing to reduce Scope 3 logistics emissions by 25-50% by 2030. Successful implementation requires cross-functional collaboration, executive sponsorship, and sophisticated carbon accounting systems that can track emissions at the shipment level.`,
  },
];

interface CarbonResult {
  totalEmissions: number;
  carbonTaxCost: number;
  taxPerKg: number;
  emissionsByMode: { mode: string; emissions: number }[];
  recommendedAlternative: string | null;
  potentialSavings: number;
  complianceRisk: "low" | "medium" | "high";
}

export function CarbonTaxCalculator() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [currency, setCurrency] = useState("USD");

  // Input parameters
  const [weight, setWeight] = useState<string>("1000"); // kg
  const [distance, setDistance] = useState<string>("10000"); // km
  const [transportMode, setTransportMode] = useState<keyof typeof EMISSION_FACTORS>("ocean");
  const [taxRegion, setTaxRegion] = useState<keyof typeof CARBON_TAX_RATES>("EU_ETS");
  const [carbonPrice, setCarbonPrice] = useState<number>(85);
  const [annualShipments, setAnnualShipments] = useState<number>(50);

  // Calculate carbon impact
  const result = useMemo((): CarbonResult => {
    const weightKg = parseFloat(weight) || 0;
    const weightTonnes = weightKg / 1000;
    const distanceKm = parseFloat(distance) || 0;
    const taxRate = carbonPrice;

    // Calculate emissions
    const emissionFactor = EMISSION_FACTORS[transportMode].factor;
    const totalEmissions = weightTonnes * distanceKm * emissionFactor; // tonnes CO2

    // Calculate carbon tax cost
    const carbonTaxCost = totalEmissions * taxRate;
    const taxPerKg = carbonTaxCost / weightKg;

    // Emissions by mode (for comparison)
    const emissionsByMode = Object.entries(EMISSION_FACTORS).map(([mode, data]) => ({
      mode: data.name,
      emissions: weightTonnes * distanceKm * data.factor,
    }));

    // Find best alternative
    const sortedModes = [...emissionsByMode].sort((a, b) => a.emissions - b.emissions);
    const currentModeName = EMISSION_FACTORS[transportMode].name;
    const bestAlternative = sortedModes.find(m => m.mode !== currentModeName && m.emissions < totalEmissions);

    // Calculate potential savings
    const potentialSavings = bestAlternative 
      ? (totalEmissions - bestAlternative.emissions) * taxRate 
      : 0;

    // Assess compliance risk
    let complianceRisk: "low" | "medium" | "high" = "low";
    if (transportMode === "air" && taxRegion === "EU_ETS") complianceRisk = "high";
    else if (transportMode === "ocean" && totalEmissions > 1000) complianceRisk = "medium";

    return {
      totalEmissions,
      carbonTaxCost,
      taxPerKg,
      emissionsByMode,
      recommendedAlternative: bestAlternative?.mode || null,
      potentialSavings,
      complianceRisk,
    };
  }, [weight, distance, transportMode, carbonPrice]);

  // Annual projection
  const annualProjection = useMemo(() => {
    return {
      totalEmissions: result.totalEmissions * annualShipments,
      totalTaxCost: result.carbonTaxCost * annualShipments,
      averagePerShipment: result.carbonTaxCost,
    };
  }, [result, annualShipments]);

  // Price scenarios
  const priceScenarios = useMemo(() => {
    return [
      { scenario: "Current", price: carbonPrice, cost: result.totalEmissions * carbonPrice },
      { scenario: "+25%", price: carbonPrice * 1.25, cost: result.totalEmissions * carbonPrice * 1.25 },
      { scenario: "+50%", price: carbonPrice * 1.5, cost: result.totalEmissions * carbonPrice * 1.5 },
      { scenario: "+100%", price: carbonPrice * 2, cost: result.totalEmissions * carbonPrice * 2 },
    ];
  }, [carbonPrice, result.totalEmissions]);

  // Mode comparison data
  const modeComparison = useMemo(() => {
    const weightTonnes = (parseFloat(weight) || 0) / 1000;
    const distanceKm = parseFloat(distance) || 0;

    return Object.entries(EMISSION_FACTORS).map(([key, data]) => {
      const emissions = weightTonnes * distanceKm * data.factor;
      const cost = emissions * carbonPrice;
      return {
        mode: data.name,
        emissions: parseFloat(emissions.toFixed(3)),
        cost: parseFloat(cost.toFixed(2)),
        current: key === transportMode,
        color: data.color,
      };
    });
  }, [weight, distance, carbonPrice, transportMode]);

  // Pie chart data for emissions distribution
  const pieData = useMemo(() => {
    return modeComparison.map((item) => ({
      name: item.mode,
      value: item.emissions,
      color: item.color,
    }));
  }, [modeComparison]);

  const chartColors = {
    ocean: "#0F4C81",
    logistics: "#2E8B57",
    warning: "#F59E0B",
    danger: "#EF4444",
    secondary: "#6366F1",
  };

  const COLORS = [chartColors.ocean, chartColors.logistics, chartColors.warning, chartColors.danger];

  const TransportIcon = EMISSION_FACTORS[transportMode].icon;

  // Reset function
  const handleReset = () => {
    setWeight("1000");
    setDistance("10000");
    setTransportMode("ocean");
    setTaxRegion("EU_ETS");
    setCarbonPrice(85);
    setAnnualShipments(50);
    setCurrency("USD");
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] p-8 md:p-12">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2E8B57]/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 to-transparent rounded-full" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Sparkles className="h-3 w-3 mr-1" />
              Environmental Compliance Tool
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Carbon Tax Calculator
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-6">
            Calculate, compare, and optimize your logistics carbon footprint across global emission trading schemes and carbon pricing mechanisms.
          </p>
          
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#2E8B57]" />
              <span>8 Carbon Pricing Regions</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#2E8B57]" />
              <span>4 Transport Modes</span>
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-[#2E8B57]" />
              <span>Price Scenarios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#0F4C81] hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                <Activity className="h-5 w-5 text-[#0F4C81]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Emissions</p>
                <p className="text-xl font-bold text-[#0F4C81]">{result.totalEmissions.toFixed(3)} tCO2e</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-[#2E8B57] hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                <DollarSign className="h-5 w-5 text-[#2E8B57]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Carbon Tax Cost</p>
                <p className="text-xl font-bold text-[#2E8B57]">{formatCurrency(result.carbonTaxCost, currency)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Target className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Alternative</p>
                <p className="text-xl font-bold text-amber-600">{result.recommendedAlternative || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <TrendingDown className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-xl font-bold text-purple-600">{formatCurrency(result.potentialSavings, currency)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2 py-3">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Scenarios</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2 py-3">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2 py-3">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Learn</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                    <Leaf className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  Carbon Tax Calculator
                </CardTitle>
                <CardDescription>Calculate carbon tax impact on your shipments</CardDescription>
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
                    <Label htmlFor="weight">Shipment Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input
                      id="distance"
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Transport Mode</Label>
                    <Select value={transportMode} onValueChange={(v) => setTransportMode(v as keyof typeof EMISSION_FACTORS)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EMISSION_FACTORS).map(([key, data]) => {
                          const Icon = data.icon;
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" style={{ color: data.color }} />
                                {data.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Carbon Tax Region</Label>
                    <Select value={taxRegion} onValueChange={(v) => {
                      setTaxRegion(v as keyof typeof CARBON_TAX_RATES);
                      setCarbonPrice(CARBON_TAX_RATES[v as keyof typeof CARBON_TAX_RATES].rate);
                    }}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CARBON_TAX_RATES).map(([key, data]) => (
                          <SelectItem key={key} value={key}>
                            {data.name} ({data.rate} {data.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="border-2 border-[#2E8B57]/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                    <Calculator className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  Carbon Impact Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-[#2E8B57]/10 to-[#2E8B57]/5 rounded-xl border border-[#2E8B57]/20">
                    <div className="flex items-center gap-2 mb-2">
                      <TransportIcon className="h-5 w-5 text-[#2E8B57]" />
                      <p className="text-sm text-muted-foreground">{EMISSION_FACTORS[transportMode].name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Carbon Emissions</p>
                    <p className="text-3xl font-bold text-[#2E8B57]">
                      {result.totalEmissions.toFixed(3)} tCO2e
                    </p>
                    <div className="mt-2">
                      <Progress 
                        value={Math.min((result.totalEmissions / 10) * 100, 100)} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Carbon Tax Cost</p>
                      <p className="text-xl font-bold text-[#0F4C81]">
                        {formatCurrency(result.carbonTaxCost, currency)}
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Tax per kg Cargo</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(result.taxPerKg, currency)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Carbon Price</span>
                      <span className="font-medium">{carbonPrice} {CARBON_TAX_RATES[taxRegion].unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Emission Factor</span>
                      <span className="font-medium">{EMISSION_FACTORS[transportMode].factor} kg CO2e/t-km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Transport Work</span>
                      <span className="font-medium">{((parseFloat(weight) || 0) / 1000 * (parseFloat(distance) || 0)).toFixed(0)} t-km</span>
                    </div>
                  </div>

                  {result.recommendedAlternative && (
                    <div className="p-3 bg-[#2E8B57]/10 rounded-lg border border-[#2E8B57]/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#2E8B57]" />
                        <p className="text-sm font-medium text-[#2E8B57]">
                          Consider {result.recommendedAlternative} to save {formatCurrency(result.potentialSavings, currency)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carbon Price Adjustment */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                  <TrendingUp className="h-5 w-5 text-[#2E8B57]" />
                </div>
                Carbon Price Adjustment
              </CardTitle>
              <CardDescription>Adjust for current or projected carbon prices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Carbon Price ({CARBON_TAX_RATES[taxRegion].unit})</Label>
                <div className="mt-2">
                  <Slider
                    value={[carbonPrice]}
                    onValueChange={(v) => setCarbonPrice(v[0])}
                    min={10}
                    max={200}
                    step={5}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>10</span>
                    <span className="font-medium text-[#2E8B57]">{carbonPrice}</span>
                    <span>200</span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${
                result.complianceRisk === "high" ? "bg-destructive/10 border-destructive/20" :
                result.complianceRisk === "medium" ? "bg-yellow-500/10 border-yellow-500/20" : "bg-[#2E8B57]/10 border-[#2E8B57]/20"
              }`}>
                <div className="flex items-center gap-2">
                  {result.complianceRisk === "high" ? (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  ) : result.complianceRisk === "medium" ? (
                    <Info className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-[#2E8B57]" />
                  )}
                  <p className="font-medium">
                    {result.complianceRisk === "high" ? "High Compliance Risk" :
                     result.complianceRisk === "medium" ? "Moderate Compliance Risk" : "Low Compliance Risk"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {CARBON_TAX_RATES[taxRegion].scope}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Emissions Distribution Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                  <PieChartIcon className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Emissions by Transport Mode
              </CardTitle>
              <CardDescription>Visual breakdown of emissions across transport modes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(3)} tCO2e`, "Emissions"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6 mt-6">
          {/* Mode Comparison Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                  <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Transport Mode Comparison
              </CardTitle>
              <CardDescription>Compare emissions and costs across transport modes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modeComparison}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis dataKey="mode" className="fill-muted-foreground" />
                    <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `${v} t`} className="fill-muted-foreground" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatCurrency(v, currency)} className="fill-muted-foreground" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "emissions" ? `${value.toFixed(3)} tCO2e` : formatCurrency(value, currency),
                        name === "emissions" ? "Emissions" : "Tax Cost"
                      ]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="emissions" name="emissions" radius={[4, 4, 0, 0]}>
                      {modeComparison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.current ? "#2E8B57" : entry.color} />
                      ))}
                    </Bar>
                    <Bar yAxisId="right" dataKey="cost" fill="#F59E0B" name="cost" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Mode</th>
                      <th className="text-right py-3 px-4 font-medium">Emission Factor</th>
                      <th className="text-right py-3 px-4 font-medium">Emissions</th>
                      <th className="text-right py-3 px-4 font-medium">Tax Cost</th>
                      <th className="text-right py-3 px-4 font-medium">vs. Current</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modeComparison.map((row) => {
                      const currentCost = modeComparison.find(m => m.current)?.cost || 0;
                      const diff = currentCost > 0 ? ((row.cost - currentCost) / currentCost) * 100 : 0;
                      return (
                        <tr key={row.mode} className={`border-b transition-colors ${row.current ? "bg-[#2E8B57]/10" : "hover:bg-muted/50"}`}>
                          <td className="py-3 px-4 font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                              {row.mode}
                              {row.current && <Badge className="ml-2 bg-[#2E8B57]">Current</Badge>}
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-muted-foreground">
                            {EMISSION_FACTORS[Object.keys(EMISSION_FACTORS).find(k => 
                              EMISSION_FACTORS[k as keyof typeof EMISSION_FACTORS].name === row.mode
                            ) as keyof typeof EMISSION_FACTORS]?.factor} kg/t-km
                          </td>
                          <td className="text-right py-3 px-4 text-[#2E8B57] font-medium">
                            {row.emissions.toFixed(3)} tCO2e
                          </td>
                          <td className="text-right py-3 px-4 font-medium">{formatCurrency(row.cost, currency)}</td>
                          <td className={`text-right py-3 px-4 font-medium ${diff < 0 ? "text-[#2E8B57]" : diff > 0 ? "text-destructive" : ""}`}>
                            {row.current ? "-" : `${diff > 0 ? "+" : ""}${diff.toFixed(0)}%`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Emission Factors Info */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                  <Info className="h-5 w-5 text-[#2E8B57]" />
                </div>
                Understanding Emission Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(EMISSION_FACTORS).map(([key, data]) => {
                  const Icon = data.icon;
                  return (
                    <div key={key} className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${data.color}20` }}>
                        <Icon className="h-5 w-5" style={{ color: data.color }} />
                      </div>
                      <div>
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-muted-foreground">{data.description}</p>
                        <p className="text-sm font-medium mt-1" style={{ color: data.color }}>
                          {data.factor} kg CO2e per tonne-km
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6 mt-6">
          {/* Price Scenarios Chart */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                  <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Carbon Price Scenarios
              </CardTitle>
              <CardDescription>Impact of different carbon price trajectories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceScenarios}>
                    <defs>
                      <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis dataKey="scenario" className="fill-muted-foreground" />
                    <YAxis tickFormatter={(v) => formatCurrency(v, currency)} className="fill-muted-foreground" />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "price" ? `${value} ${CARBON_TAX_RATES[taxRegion].unit}` : formatCurrency(value, currency),
                        name === "price" ? "Carbon Price" : "Tax Cost"
                      ]}
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="cost" stroke="#0F4C81" fill="url(#colorCost)" strokeWidth={3} name="cost" />
                    <Line type="monotone" dataKey="price" stroke="#2E8B57" strokeWidth={2} name="price" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {priceScenarios.map((s, index) => (
                  <div key={s.scenario} className={`p-4 rounded-lg border text-center transition-all hover:scale-105 ${
                    index === 0 ? "bg-[#2E8B57]/10 border-[#2E8B57]/20" : "bg-muted/50"
                  }`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{s.scenario}</p>
                    <p className="text-lg font-bold text-[#0F4C81] mt-1">{formatCurrency(s.cost, currency)}</p>
                    <p className="text-xs text-muted-foreground">{s.price} {CARBON_TAX_RATES[taxRegion].unit.split("/")[0]}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Historical Price Trends */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                  <LineChart className="h-5 w-5 text-[#2E8B57]" />
                </div>
                Historical Carbon Price Trends
              </CardTitle>
              <CardDescription>Evolution of carbon prices across major markets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={HISTORICAL_PRICES}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis dataKey="year" className="fill-muted-foreground" />
                    <YAxis className="fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="eu_ets" stroke="#0F4C81" strokeWidth={3} name="EU ETS" dot={{ fill: "#0F4C81" }} />
                    <Line type="monotone" dataKey="uk_ets" stroke="#2E8B57" strokeWidth={3} name="UK ETS" dot={{ fill: "#2E8B57" }} />
                    <Line type="monotone" dataKey="california" stroke="#F59E0B" strokeWidth={3} name="California" dot={{ fill: "#F59E0B" }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Annual Projections */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                  <Calculator className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Annual Cost Projection
              </CardTitle>
              <CardDescription>Estimate annual carbon tax liability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Annual Shipments</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[annualShipments]}
                    onValueChange={(v) => setAnnualShipments(v[0])}
                    min={1}
                    max={500}
                    step={1}
                    className="flex-1"
                  />
                  <span className="font-bold w-16 text-right text-[#0F4C81]">{annualShipments}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-[#2E8B57]/10 to-[#2E8B57]/5 rounded-lg text-center border border-[#2E8B57]/20">
                  <Leaf className="h-6 w-6 text-[#2E8B57] mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Annual Emissions</p>
                  <p className="text-2xl font-bold text-[#2E8B57]">
                    {annualProjection.totalEmissions.toFixed(1)} tCO2e
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-[#0F4C81]/10 to-[#0F4C81]/5 rounded-lg text-center border border-[#0F4C81]/20">
                  <DollarSign className="h-6 w-6 text-[#0F4C81] mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Annual Tax Cost</p>
                  <p className="text-2xl font-bold text-[#0F4C81]">
                    {formatCurrency(annualProjection.totalTaxCost, currency)}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center border">
                  <Target className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Per Shipment</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(annualProjection.averagePerShipment, currency)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 mt-6">
          {/* Regulations Table */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                  <Globe className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Carbon Pricing Regulations
              </CardTitle>
              <CardDescription>Overview of global carbon pricing mechanisms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Scheme</th>
                      <th className="text-right py-3 px-4 font-medium">Current Rate</th>
                      <th className="text-left py-3 px-4 font-medium">Scope</th>
                      <th className="text-left py-3 px-4 font-medium">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(CARBON_TAX_RATES).map(([key, data]) => (
                      <tr key={key} className="border-b transition-colors hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{data.name}</td>
                        <td className="text-right py-3 px-4 text-[#0F4C81] font-bold">
                          {data.rate} {data.unit}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{data.scope}</td>
                        <td className="py-3 px-4">
                          <Badge className={
                            data.trend === "rising" ? "bg-[#2E8B57]" :
                            data.trend === "stable" ? "bg-amber-500" :
                            "bg-purple-500"
                          }>
                            {data.trend === "rising" ? "↑ Rising" :
                             data.trend === "stable" ? "→ Stable" :
                             "⏳ Pending"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Recommendations */}
          <Card className="border-2 border-[#2E8B57]/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                Compliance Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors">
                  <div className="p-2 rounded-lg bg-[#2E8B57]/10 shrink-0">
                    <Leaf className="h-5 w-5 text-[#2E8B57]" />
                  </div>
                  <div>
                    <p className="font-medium">Mode Optimization</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Consider multimodal transport to reduce emissions. Rail and ocean are significantly 
                      less carbon-intensive than air freight, potentially reducing your carbon tax liability by up to 95%.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors">
                  <div className="p-2 rounded-lg bg-[#0F4C81]/10 shrink-0">
                    <TrendingDown className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  <div>
                    <p className="font-medium">Carbon Offsetting</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Purchase verified carbon credits to offset unavoidable emissions. Many carriers 
                      offer insetting programs that directly reduce emissions in your supply chain.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors">
                  <div className="p-2 rounded-lg bg-amber-500/10 shrink-0">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">Long-term Planning</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Carbon prices are expected to rise significantly in coming years. Build carbon costs into 
                      your pricing model and contracts now to avoid future financial exposure.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors">
                  <div className="p-2 rounded-lg bg-purple-500/10 shrink-0">
                    <Zap className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Technology Investment</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Partner with carriers investing in sustainable aviation fuels (SAF), electric vehicles 
                      for last-mile delivery, and LNG-powered vessels for ocean freight.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                </div>
                Your Risk Assessment
              </CardTitle>
              <CardDescription>Based on your current configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Compliance Risk Level</span>
                  <Badge className={
                    result.complianceRisk === "high" ? "bg-destructive" :
                    result.complianceRisk === "medium" ? "bg-amber-500" :
                    "bg-[#2E8B57]"
                  }>
                    {result.complianceRisk.charAt(0).toUpperCase() + result.complianceRisk.slice(1)}
                  </Badge>
                </div>
                <Progress 
                  value={
                    result.complianceRisk === "high" ? 85 :
                    result.complianceRisk === "medium" ? 50 : 15
                  } 
                  className="h-3"
                />
                <p className="text-sm text-muted-foreground">
                  {result.complianceRisk === "high" && 
                    "Your current configuration indicates high exposure to carbon pricing regulations. Air freight under EU ETS faces the highest carbon costs and regulatory scrutiny. Consider alternative modes or routes."}
                  {result.complianceRisk === "medium" && 
                    "Moderate risk detected. Your emissions level may trigger additional reporting requirements. Monitor regulatory changes in your operating regions closely."}
                  {result.complianceRisk === "low" && 
                    "Low compliance risk with your current configuration. Continue monitoring as regulations evolve and carbon prices increase."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6 mt-6">
          {/* Educational Sections */}
          <div className="grid gap-6">
            {EDUCATIONAL_SECTIONS.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57]" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#2E8B57]">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ Section */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#0F4C81]/10">
                  <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
                </div>
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about carbon taxes and emissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium hover:text-[#0F4C81]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card className="border-2 border-[#2E8B57]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#2E8B57]">
                <div className="p-2 rounded-lg bg-[#2E8B57]/10">
                  <BookOpen className="h-5 w-5" />
                </div>
                Quick Reference Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium text-[#0F4C81] mb-2">Key Emission Factors</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ocean: 0.015 kg CO2e/t-km</li>
                    <li>• Rail: 0.028 kg CO2e/t-km</li>
                    <li>• Road: 0.105 kg CO2e/t-km</li>
                    <li>• Air: 0.602 kg CO2e/t-km</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium text-[#2E8B57] mb-2">Carbon Price Ranges</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• EU ETS: €85/tonne</li>
                    <li>• UK ETS: £75/tonne</li>
                    <li>• California: $35/tonne</li>
                    <li>• Canada: CAD 65/tonne</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium text-amber-500 mb-2">Reduction Strategies</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Modal shift to rail/ocean</li>
                    <li>• Route optimization</li>
                    <li>• Load consolidation</li>
                    <li>• Carbon offsetting</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-medium text-purple-500 mb-2">Upcoming Regulations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• EU maritime ETS (2024-2026)</li>
                    <li>• IMO carbon levy (2027+)</li>
                    <li>• FuelEU Maritime (2025)</li>
                    <li>• CBAM implementation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90 text-white">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}
